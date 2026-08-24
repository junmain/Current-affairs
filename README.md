# অসম প্ৰস্তুতি (Asom Prostuti)

Auto-updating current affairs website for Assam Grade III / Grade IV government
exam aspirants. Content in English + Assamese. No login required.

## How it works

1. A cron job (`/api/cron/fetch-news`) runs every few hours, pulls free RSS
   feeds (PIB, The Hindu, Sentinel Assam, Assam Tribune, Down To Earth, etc. —
   see `lib/rss-sources.js`).
2. Each new article is sent to Groq (`llama-3.3-70b-versatile`) with a prompt
   that produces an exam-focused summary in **English and Assamese**, plus a
   category.
3. Saved to Firestore (`articles` collection). The site reads straight from
   there — no manual posting, ever.
4. `/quiz` generates fresh bilingual MCQs on demand from the latest saved
   articles.

## One-time setup

### 1. Firebase project
- Create a project at https://console.firebase.google.com
- Enable **Firestore Database** (production mode)
- Project Settings → General → add a Web App → copy the config values into
  `.env.local` (`NEXT_PUBLIC_FIREBASE_*`)
- Project Settings → Service Accounts → Generate new private key → copy
  `project_id`, `client_email`, `private_key` into `.env.local`
  (`FIREBASE_ADMIN_*`). Keep the `\n` characters in the private key as-is.
- Deploy `firestore.rules` (Firebase Console → Firestore → Rules → paste and
  publish). This keeps the database public-read but write-only from the server.

### 2. Groq API key
- https://console.groq.com/keys → create a free key → `GROQ_API_KEY`

### 3. Cron secret
- Pick any long random string → `CRON_SECRET` (protects the fetch endpoint
  from being called by strangers and burning your free Groq quota)

### 4. Install and run locally
```bash
npm install
cp .env.local.example .env.local   # then fill in the values above
npm run dev
```

### 5. First data load
Once env vars are set, trigger the fetch manually once so the site isn't
empty:
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-deployed-url.vercel.app/api/cron/fetch-news
```

## Deploying (Vercel — free tier works)

1. Push this project to a GitHub repo
2. Import it in Vercel, add all the `.env.local` values as Environment
   Variables in Vercel's dashboard
3. `vercel.json` already defines the cron schedule (every 4 hours). Vercel's
   free Hobby tier limits cron to **once per day** — if you're on Hobby,
   change the schedule to `"0 6 * * *"` (once daily) or upgrade to Pro for
   more frequent runs.
4. Deploy. Then run the manual curl above once against your live URL to seed
   the first batch of articles.

## Notes on Assamese quality

`llama-3.3-70b-versatile` on Groq handles Assamese reasonably but isn't
perfect — check the first 10–15 saved articles in Firestore for quality. If
translations read awkward, swap the model in `lib/groq.js` for something via
OpenRouter with stronger Indic-language output (e.g. Gemini or GPT-4o-mini)
— the prompt structure stays the same, only the API call changes.

## Project structure
```
app/
  page.js                  → homepage (latest articles)
  category/[slug]/page.js  → per-category feed
  archive/page.js          → date-grouped archive
  quiz/page.js             → bilingual MCQ quiz
  api/cron/fetch-news/     → the auto-update job
  api/quiz/generate/       → on-demand quiz generation
components/                → ArticleCard, QuizCard, Navbar, language toggle
lib/                       → Firebase (client+admin), Groq prompts, RSS sources
```
