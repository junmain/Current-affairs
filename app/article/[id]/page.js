import { adminDb } from "@/lib/firebase-admin";
import Link from "next/link";
import { format } from "date-fns";

export const revalidate = 1800;

async function getArticle(id) {
  const doc = await adminDb.collection("articles").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export default async function ArticlePage({ params }) {
  const article = await getArticle(params.id);

  if (!article) {
    return (
      <div className="py-16 text-center text-ink/60">
        Article not found. <Link href="/" className="text-tea underline">Back home</Link>
      </div>
    );
  }

  return (
    <article className="py-10 max-w-2xl">
      <Link href="/" className="text-xs text-ink/50 hover:text-tea">&larr; Back</Link>

      <p className="text-xs text-ink/50 mt-4">
        {article.publishedAt ? format(new Date(article.publishedAt), "d MMMM yyyy") : ""} · {article.sourceName}
      </p>

      <h1 className="font-display text-2xl md:text-3xl text-tea mt-2 mb-6">{article.title_en}</h1>
      <p className="text-ink/85 leading-relaxed mb-8">{article.summary_en}</p>

      <div className="gamosa-rule rounded-full mb-8" />

      <h2 className="lang-as font-semibold text-xl text-tea mb-3">{article.title_as}</h2>
      <p className="lang-as text-ink/85 leading-relaxed">{article.summary_as}</p>

      {article.sourceUrl && (
        <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-8 text-sm text-tea underline">
          Read original source →
        </a>
      )}
    </article>
  );
}
