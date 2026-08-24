"use client";

import Link from "next/link";
import { useLang } from "./LanguageToggle";
import { useSidebar } from "./SidebarToggle";

export default function Navbar() {
  const { lang, setLang } = useLang();
  const { toggle } = useSidebar();

  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-content mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Open menu"
            className="flex flex-col justify-center gap-1.5 w-8 h-8 shrink-0"
          >
            <span className="block h-0.5 w-6 bg-tea rounded-full" />
            <span className="block h-0.5 w-6 bg-tea rounded-full" />
            <span className="block h-0.5 w-4 bg-tea rounded-full" />
          </button>

          <Link href="/" className="flex items-baseline gap-2 shrink-0">
            <span className="font-display text-xl md:text-2xl text-tea">অসম প্ৰস্তুতি</span>
            <span className="text-xs text-ink/50 hidden sm:inline">Asom Prostuti</span>
          </Link>
        </div>

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
