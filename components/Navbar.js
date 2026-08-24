"use client";

import Link from "next/link";
import { useLang } from "./LanguageToggle";
import { CATEGORIES } from "@/lib/rss-sources";

export default function Navbar() {
  const { lang, setLang } = useLang();

  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-content mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-2 shrink-0">
          <span className="font-display text-xl md:text-2xl text-tea">অসম প্ৰস্তুতি</span>
          <span className="text-xs text-ink/50 hidden sm:inline">Asom Prostuti</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm overflow-x-auto">
          {CATEGORIES.slice(0, 6).map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="text-ink/70 hover:text-tea whitespace-nowrap">
              {lang === "as" ? c.label_as : c.label_en}
            </Link>
          ))}
          <Link href="/quiz" className="text-gamosa font-medium hover:text-tea whitespace-nowrap">
            {lang === "as" ? "কুইজ" : "Quiz"}
          </Link>
          <Link href="/archive" className="text-ink/70 hover:text-tea whitespace-nowrap">
            {lang === "as" ? "আৰ্কাইভ" : "Archive"}
          </Link>
        </nav>

        <div className="flex items-center gap-1 border border-line rounded-full p-1 text-xs shrink-0">
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded-full transition ${lang === "en" ? "bg-tea text-paper" : "text-ink/60"}`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("as")}
            className={`px-3 py-1 rounded-full transition lang-as ${lang === "as" ? "bg-tea text-paper" : "text-ink/60"}`}
          >
            অস
          </button>
        </div>
      </div>
    </header>
  );
}
