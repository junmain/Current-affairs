import "./globals.css";
import Navbar from "@/components/Navbar";
import { LangProvider } from "@/components/LanguageToggle";

export const metadata = {
  title: "অসম প্ৰস্তুতি | Asom Prostuti — Current Affairs for Assam Exams",
  description:
    "Daily current affairs for Assam Grade III & Grade IV government exam preparation, in English and Assamese. Auto-updated.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Tiro+Devanagari+Hindi&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-paper text-ink font-body antialiased">
        <LangProvider>
          <Navbar />
          <main className="max-w-content mx-auto px-4 md:px-6">{children}</main>
          <footer className="border-t border-line mt-20 py-8 text-center text-sm text-ink/60">
            অসম প্ৰস্তুতি · Built for Assam Grade III / IV exam aspirants · Auto-updated daily
          </footer>
        </LangProvider>
      </body>
    </html>
  );
}
