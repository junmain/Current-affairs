import Parser from "rss-parser";
import { adminDb } from "@/lib/firebase-admin";
import { summarizeBilingual } from "@/lib/groq";
import { RSS_SOURCES } from "@/lib/rss-sources";

const parser = new Parser({
  timeout: 15000,
  xml2js: { strict: false, trim: true },
});

// Minimum gap between two fetch runs, regardless of what triggered them
// (the daily cron, or a visitor opening the homepage). Keeps things from
// re-fetching on every single page view.
const MIN_GAP_MS = 3 * 60 * 60 * 1000; // 3 hours

const META_REF_PATH = ["meta", "fetch-status"];

async function shouldRun() {
  const ref = adminDb.collection(META_REF_PATH[0]).doc(META_REF_PATH[1]);
  const snap = await ref.get();
  if (!snap.exists) return { ref, run: true };

  const lastRunAt = snap.data()?.lastRunAt;
  if (!lastRunAt) return { ref, run: true };

  const elapsed = Date.now() - new Date(lastRunAt).getTime();
  return { ref, run: elapsed > MIN_GAP_MS };
}

// Hobby-plan serverless functions have a hard time limit. We ask for the max
// allowed (60s — set via `maxDuration` export in the calling route/page) but
// still self-limit how much work one run does, so it finishes comfortably
// inside that window instead of racing it.
const MAX_NEW_ARTICLES_PER_RUN = 8;
const TIME_BUDGET_MS = 45 * 1000; // stop starting new work past this, leaves headroom under 60s

export async function runFetchNews({ force = false } = {}) {
  const { ref, run } = await shouldRun();
  if (!run && !force) {
    return { skipped: true, reason: "ran recently" };
  }

  // Mark as running immediately so two near-simultaneous visitors
  // don't both kick off a fetch.
  await ref.set({ lastRunAt: new Date().toISOString() }, { merge: true });

  const startedAt = Date.now();
  const results = { fetched: 0, saved: 0, skipped: 0, errors: [] };

  outer:
  for (const source of RSS_SOURCES) {
    if (results.saved >= MAX_NEW_ARTICLES_PER_RUN) break;
    if (Date.now() - startedAt > TIME_BUDGET_MS) break;

    try {
      const feed = await parser.parseURL(source.url);
      const items = (feed.items || []).slice(0, 5); // cap per source per run

      for (const item of items) {
        if (results.saved >= MAX_NEW_ARTICLES_PER_RUN) break outer;
        if (Date.now() - startedAt > TIME_BUDGET_MS) break outer;

        results.fetched += 1;

        const link = item.link || item.guid;
        if (!link) continue;

        // Dedupe: skip if we already have this exact article
        const docId = Buffer.from(link).toString("base64url").slice(0, 120);
        const existingRef = adminDb.collection("articles").doc(docId);
        const existing = await existingRef.get();
        if (existing.exists) {
          results.skipped += 1;
          continue;
        }

        const rawContent =
          item.contentSnippet || item.content || item.summary || item.title;

        const summarized = await summarizeBilingual({
          title: item.title,
          content: rawContent,
          source: source.name,
        });

        if (!summarized) {
          results.errors.push(`Summarize failed: ${item.title}`);
          continue;
        }

        await existingRef.set({
          ...summarized,
          sourceName: source.name,
          sourceUrl: link,
          publishedAt: item.isoDate || new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });

        results.saved += 1;
      }
    } catch (err) {
      results.errors.push(`${source.name}: ${err.message}`);
    }
  }

  return results;
}
