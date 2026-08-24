import { adminDb } from "@/lib/firebase-admin";
import ArticleCard from "@/components/ArticleCard";
import { CATEGORIES } from "@/lib/rss-sources";

export const dynamic = "force-dynamic";

async function getArticles(slug) {
  const snap = await adminDb
    .collection("articles")
    .where("category", "==", slug)
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  const articles = await getArticles(slug);

  return (
    <div className="py-10">
      <h1 className="font-display text-2xl text-tea mb-1">{cat ? cat.label_en : slug}</h1>
      <p className="text-sm text-ink/60 mb-8">{articles.length} articles</p>

      {articles.length === 0 ? (
        <p className="text-ink/60">No articles in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}
