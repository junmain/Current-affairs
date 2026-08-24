import { NextResponse } from "next/server";
import { runFetchNews } from "@/lib/fetch-news";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Prevents anyone on the internet from triggering this (and burning your Groq quota)
function isAuthorized(req) {
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // force: true — a manual/cron hit always runs, ignoring the 3-hour gap
  // that protects the homepage's automatic trigger.
  const results = await runFetchNews({ force: true });
  return NextResponse.json(results);
}
