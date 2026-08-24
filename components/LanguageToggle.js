"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LangContext = createContext({ lang: "en", setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("ap_lang");
    if (saved) setLangState(saved);
  }, []);

  function setLang(next) {
    setLangState(next);
    if (typeof window !== "undefined") localStorage.setItem("ap_lang", next);
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
