"use client";

import Link from "next/link";
import { useLang } from "./LanguageToggle";
import { useSidebar } from "./SidebarToggle";
import { CATEGORIES } from "@/lib/rss-sources";

export default function Sidebar() {
  const { lang } = useLang();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Overlay — click to close */}
      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 bg-ink/40 z-40"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-paper border-r border-line z-50 transform transition-transform duration-200 ease-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <span className="font-display text-lg text-tea">অসম প্ৰস্তুতি</span>
          <button onClick={close} aria-label="Close menu" className="text-ink/60 text-xl leading-none px-1">
            ×
          </button>
        </div>

        <nav className="py-3">
          <Link
            href="/"
            onClick={close}
            className="block px-5 py-3 text-sm font-medium text-ink hover:bg-tea/5 hover:text-tea"
          >
            {lang === "as" ? "গৃহপৃষ্ঠা" : "Home"}
          </Link>

          <Link
            href="/quiz"
            onClick={close}
            className="block px-5 py-3 text-sm font-semibold text-gamosa hover:bg-gamosa/5"
          >
            {lang === "as" ? "কুইজ" : "Quiz"}
          </Link>

          <Link
            href="/archive"
            onClick={close}
            className="block px-5 py-3 text-sm font-medium text-ink hover:bg-tea/5 hover:text-tea"
          >
            {lang === "as" ? "আৰ্কাইভ" : "Archive"}
          </Link>

          <p className="px-5 pt-4 pb-2 text-xs uppercase tracking-wide text-ink/40">
            {lang === "as" ? "শাখা" : "Categories"}
          </p>

          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              onClick={close}
              className="block px-5 py-2.5 text-sm text-ink/70 hover:bg-tea/5 hover:text-tea"
            >
              {lang === "as" ? c.label_as : c.label_en}
            </Link>
          ))}

          <div className="border-t border-line mt-3 pt-3">
            <Link
              href="/refresh"
              onClick={close}
              className="block px-5 py-3 text-sm font-medium text-gold hover:bg-gold/5"
            >
              {lang === "as" ? "এতিয়াই আপডেট কৰক" : "Update now"}
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
