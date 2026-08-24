import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

/**
 * Takes a raw news item (title + snippet/body) and returns a structured,
 * exam-relevant bilingual summary. Falls back gracefully if the model
 * output isn't clean JSON.
 */
export async function summarizeBilingual({ title, content, source }) {
  const prompt = `You are writing a current-affairs briefing for Assam government job exam aspirants (3rd Grade / 4th Grade level — Peon, Grade IV, LDA, etc.). These candidates need short, factual, exam-relevant points — not full articles.

Source: ${source}
Headline: ${title}
Content: ${content}

Do the following:
1. Write a crisp exam-relevant summary in English (3-5 bullet-style sentences, focus on names, numbers, dates, schemes, places — the kind of facts asked in objective exams).
2. Translate/rewrite the SAME summary in natural, correct Assamese (not a robotic word-for-word translation — a native Assamese speaker should find it natural to read).
3. Assign ONE category from exactly this list: assam, national, international, economy, environment, sports, polity, science-tech.
4. Write a short English headline (max 12 words) and its Assamese equivalent.

Respond with ONLY valid JSON, no markdown fences, no preamble, in this exact shape:
{
  "title_en": "",
  "title_as": "",
  "summary_en": "",
  "summary_as": "",
  "category": ""
}`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const raw = completion.choices[0]?.message?.content?.trim() || "{}";
  const clean = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(clean);
  } catch {
    // Model didn't return clean JSON — skip this article rather than save garbage
    return null;
  }
}

/**
 * Generates bilingual MCQs from a batch of already-summarized articles.
 */
export async function generateQuizBilingual(articles, count = 10) {
  const articleBlock = articles
    .map((a, i) => `${i + 1}. ${a.title_en} — ${a.summary_en}`)
    .join("\n");

  const prompt = `Based on these current-affairs items, write ${count} multiple-choice questions suitable for an Assam Grade III / Grade IV government exam (simple, factual, objective — one clearly correct answer, three plausible distractors).

Items:
${articleBlock}

For each question give it in BOTH English and natural Assamese. Respond with ONLY valid JSON array, no markdown fences, in this exact shape:
[
  {
    "question_en": "",
    "question_as": "",
    "options_en": ["", "", "", ""],
    "options_as": ["", "", "", ""],
    "correct_index": 0
  }
]`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  const raw = completion.choices[0]?.message?.content?.trim() || "[]";
  const clean = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(clean);
  } catch {
    return [];
  }
}
