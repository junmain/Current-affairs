// Free, public RSS feeds — Assam-only, as requested.
// Feel free to add/remove — check each feed still resolves every few months,
// news sites occasionally change their RSS paths.

export const RSS_SOURCES = [
  { name: "The Sentinel Assam", url: "https://www.sentinelassam.com/feed", category: "assam" },
  { name: "The Assam Tribune", url: "https://assamtribune.com/feed", category: "assam" },
  { name: "NorthEast Now", url: "https://nenow.in/feed", category: "assam" },
];

// Exam-relevant categories used across the site (home filters, article tags, quiz)
export const CATEGORIES = [
  { slug: "assam", label_en: "Assam", label_as: "অসম" },
  { slug: "polity", label_en: "Government & Polity", label_as: "চৰকাৰ আৰু ৰাজনীতি" },
  { slug: "sports", label_en: "Sports", label_as: "ক্ৰীড়া" },
  { slug: "education", label_en: "Education", label_as: "শিক্ষা" },
  { slug: "environment", label_en: "Environment", label_as: "পৰিৱেশ" },
];
