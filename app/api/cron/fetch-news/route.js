import Parser from "rss-parser";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { summarizeBilingual } from "@/lib/groq";
import { RSS_SOURCES } from "@/lib/rss-sources";

export const dynamic = "force-dynamic";

const parser = new Parser({ timeout: 15000 });

// Prevents anyone on the internet from triggering this (and burning your Groq quota)
function isAuthorized(req) {
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = { fetched: 0, saved: 0, skipped: 0, errors: [] };

  for (const source of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      const items = (feed.items || []).slice(0, 8); // cap per source per run

      for (const item of items) {
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

  return NextResponse.json(results);
}
