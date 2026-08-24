import { runFetchNews } from "@/lib/fetch-news";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function RefreshPage() {
  let results;
  let failed = false;

  try {
    // force: true — runs immediately, ignoring the normal 3-hour gap
    results = await runFetchNews({ force: true });
  } catch (err) {
    failed = true;
    results = { error: err.message };
  }

  return (
    <div className="py-16 max-w-lg mx-auto text-center">
      <h1 className="font-display text-2xl text-tea mb-4">
        {failed ? "Update failed" : "Update complete"}
      </h1>

      {failed ? (
        <p className="text-gamosa text-sm mb-6">{results.error}</p>
      ) : (
        <div className="text-sm text-ink/80 space-y-1 mb-6">
          <p>Checked: {results.fetched ?? 0} articles</p>
          <p>New saved: <strong className="text-tea">{results.saved ?? 0}</strong></p>
          <p>Already had: {results.skipped ?? 0}</p>
          {results.errors?.length > 0 && (
            <p className="text-gamosa">{results.errors.length} source error(s)</p>
          )}
        </div>
      )}

      <Link href="/" className="inline-block bg-tea text-paper px-6 py-2.5 rounded-full text-sm font-medium hover:bg-teaLight transition">
        Go to homepage
      </Link>

      <p className="text-xs text-ink/40 mt-8">
        Bookmark this page (/refresh) — visit it anytime to pull the latest news on demand.
      </p>
    </div>
  );
}
