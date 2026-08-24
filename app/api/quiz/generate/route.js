import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { generateQuizBilingual } from "@/lib/groq";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const count = Number(searchParams.get("count") || 10);
  const category = searchParams.get("category");

  let query = adminDb.collection("articles").orderBy("createdAt", "desc").limit(25);
  if (category) {
    query = adminDb
      .collection("articles")
      .where("category", "==", category)
      .orderBy("createdAt", "desc")
      .limit(25);
  }

  const snap = await query.get();
  const articles = snap.docs.map((d) => d.data());

  if (articles.length === 0) {
    return NextResponse.json({ questions: [] });
  }

  // Sample down to keep the prompt small and the quiz varied
  const sample = articles.sort(() => 0.5 - Math.random()).slice(0, Math.min(count, articles.length));
  const questions = await generateQuizBilingual(sample, Math.min(count, sample.length));

  return NextResponse.json({ questions });
}
