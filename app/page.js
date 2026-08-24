import { adminDb } from "@/lib/firebase-admin";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

async function getLatestArticles() {
  const snap = await adminDb.collection("articles").orderBy("createdAt", "desc").limit(24).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export default async function HomePage() {
  const articles = await getLatestArticles();
  const today = format(new Date(), "d MMMM yyyy");

  return (
    <div>
      <section className="pt-10 pb-6">
        <p className="text-xs uppercase tracking-widest text-gold font-medium mb-2">{today}</p>
        <h1 className="font-display text-3xl md:text-4xl text-tea leading-tight max-w-2xl">
          আজিৰ প্ৰস্তুতি — Today's briefing for Assam Grade III & IV exams
        </h1>
        <p className="text-ink/70 mt-3 max-w-xl text-sm md:text-base">
          Fresh current affairs, summarized for objective-type exams, updated automatically
          through the day. Read in English or Assamese — toggle top right.
        </p>
      </section>

      <div className="gamosa-rule rounded-full mb-8" />

      {articles.length === 0 ? (
        <div className="border border-dashed border-line rounded-lg p-10 text-center text-ink/60">
          No articles yet — run the news fetch job (see README) to populate the site.
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </section>
      )}

      <section className="border-t border-line py-10 text-center">
        <h2 className="font-display text-xl text-tea mb-2">Test yourself</h2>
        <p className="text-sm text-ink/70 mb-4">
          Auto-generated MCQs from this week's current affairs, in English and Assamese.
        </p>
        <Link href="/quiz" className="inline-block bg-tea text-paper px-6 py-2.5 rounded-full text-sm font-medium hover:bg-teaLight transition">
          Start quiz
        </Link>
      </section>
    </div>
  );
}
