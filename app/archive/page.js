import { adminDb } from "@/lib/firebase-admin";
import ArticleCard from "@/components/ArticleCard";
import { format } from "date-fns";

export const revalidate = 1800;

async function getAllArticles() {
  const snap = await adminDb.collection("articles").orderBy("createdAt", "desc").limit(200).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

function groupByDate(articles) {
  const groups = {};
  for (const a of articles) {
    const key = a.publishedAt ? format(new Date(a.publishedAt), "d MMMM yyyy") : "Undated";
    if (!groups[key]) groups[key] = [];
    groups[key].push(a);
  }
  return groups;
}

export default async function ArchivePage() {
  const articles = await getAllArticles();
  const groups = groupByDate(articles);
  const dates = Object.keys(groups);

  return (
    <div className="py-10">
      <h1 className="font-display text-2xl text-tea mb-8">Archive</h1>

      {dates.length === 0 && <p className="text-ink/60">Nothing archived yet.</p>}

      {dates.map((date) => (
        <section key={date} className="mb-10">
          <h2 className="text-sm font-semibold text-gold uppercase tracking-wide mb-3 border-b border-line pb-2">
            {date}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups[date].map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
