"use client";

import { useState } from "react";
import { useLang } from "./LanguageToggle";

export default function QuizCard({ question, index, onAnswered }) {
  const { lang } = useLang();
  const [selected, setSelected] = useState(null);

  const q = lang === "as" ? question.question_as : question.question_en;
  const options = lang === "as" ? question.options_as : question.options_en;

  function choose(i) {
    if (selected !== null) return;
    setSelected(i);
    onAnswered?.(i === question.correct_index);
  }

  return (
    <div className="border border-line rounded-lg p-5 bg-white/40">
      <p className="text-xs text-ink/50 mb-2">Question {index + 1}</p>
      <h3 className={`font-medium text-ink mb-4 ${lang === "as" ? "lang-as" : ""}`}>{q}</h3>
      <div className="space-y-2">
        {options.map((opt, i) => {
          const isCorrect = i === question.correct_index;
          const isSelected = i === selected;
          let style = "border-line hover:border-tea/40";
          if (selected !== null) {
            if (isCorrect) style = "border-tea bg-tea/10 text-tea";
            else if (isSelected) style = "border-gamosa bg-gamosa/10 text-gamosa";
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              className={`w-full text-left px-4 py-2.5 rounded-md border text-sm transition ${style} ${lang === "as" ? "lang-as" : ""}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
