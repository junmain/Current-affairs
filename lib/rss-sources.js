// Free, public RSS feeds. No API key or budget needed.
// Feel free to add/remove — check each feed still resolves every few months,
// news sites occasionally change their RSS paths.

export const RSS_SOURCES = [
  { name: "PIB India (English releases)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3", category: "national" },
  { name: "The Hindu — National", url: "https://www.thehindu.com/news/national/feeder/default.rss", category: "national" },
  { name: "The Hindu — International", url: "https://www.thehindu.com/news/international/feeder/default.rss", category: "international" },
  { name: "The Sentinel Assam", url: "https://www.sentinelassam.com/feed", category: "assam" },
  { name: "The Assam Tribune", url: "https://assamtribune.com/feed", category: "assam" },
  { name: "Down To Earth — Environment", url: "https://www.downtoearth.org.in/rss/environment", category: "environment" },
  { name: "Livemint — Economy", url: "https://www.livemint.com/rss/economy", category: "economy" },
  { name: "PIB India — Sports", url: "https://pib.gov.in/RssMain.aspx?ModId=13&Lang=1&Regid=3", category: "sports" },
];

// Exam-relevant categories used across the site (home filters, article tags, quiz)
export const CATEGORIES = [
  { slug: "assam", label_en: "Assam", label_as: "অসম" },
  { slug: "national", label_en: "National", label_as: "ৰাষ্ট্ৰীয়" },
  { slug: "international", label_en: "International", label_as: "আন্তঃৰাষ্ট্ৰীয়" },
  { slug: "economy", label_en: "Economy", label_as: "অৰ্থনীতি" },
  { slug: "environment", label_en: "Environment", label_as: "পৰিৱেশ" },
  { slug: "sports", label_en: "Sports", label_as: "ক্ৰীড়া" },
  { slug: "polity", label_en: "Polity", label_as: "ৰাজনীতি" },
  { slug: "science-tech", label_en: "Science & Tech", label_as: "বিজ্ঞান আৰু প্ৰযুক্তি" },
];
