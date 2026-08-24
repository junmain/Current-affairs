"use client";

import Link from "next/link";
import { useLang } from "./LanguageToggle";
import { CATEGORIES } from "@/lib/rss-sources";
import { format } from "date-fns";

export default function ArticleCard({ article }) {
  const { lang } = useLang();
  const title = lang === "as" ? article.title_as : article.title_en;
  const summary = lang === "as" ? article.summary_as : article.summary_en;
  const cat = CATEGORIES.find((c) => c.slug === article.category);

  return (
    <article className="border border-line rounded-lg p-5 bg-white/40 hover:border-tea/40 transition">
      <div className="flex items-center justify-between text-xs text-ink/50 mb-2">
        <span className="uppercase tracking-wide text-gamosa font-medium">
          {cat ? (lang === "as" ? cat.label_as : cat.label_en) : article.category}
        </span>
        <time>{article.publishedAt ? format(new Date(article.publishedAt), "d MMM yyyy") : ""}</time>
      </div>
      <Link href={`/article/${article.id}`}>
        <h3 className={`font-display text-lg text-ink mb-2 hover:text-tea transition ${lang === "as" ? "lang-as font-body font-semibold" : ""}`}>
          {title}
        </h3>
      </Link>
      <p className={`text-sm text-ink/80 leading-relaxed ${lang === "as" ? "lang-as" : ""}`}>{summary}</p>
      {article.sourceName && (
        <p className="text-xs text-ink/40 mt-3">Source: {article.sourceName}</p>
      )}
    </article>
  );
}
