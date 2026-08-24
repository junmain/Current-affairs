"use client";

import { useEffect, useState } from "react";
import QuizCard from "@/components/QuizCard";

export default function QuizPage() {
  const [questions, setQuestions] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [loading, setLoading] = useState(true);

  async function loadQuiz() {
    setLoading(true);
    setQuestions(null);
    setScore(0);
    setAnswered(0);
    try {
      const res = await fetch("/api/quiz/generate?count=10");
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuiz();
  }, []);

  return (
    <div className="py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-2xl text-tea">Daily Quiz</h1>
        {questions && questions.length > 0 && (
          <span className="text-sm text-ink/60">
            Score: {score}/{answered}
          </span>
        )}
      </div>
      <p className="text-sm text-ink/60 mb-8">
        Auto-generated from this week's current affairs.
      </p>

      {loading && <p className="text-ink/60">Generating questions…</p>}

      {!loading && questions?.length === 0 && (
        <div className="border border-dashed border-line rounded-lg p-10 text-center text-ink/60">
          Not enough articles saved yet to build a quiz. Check back after the next update.
        </div>
      )}

      <div className="space-y-4">
        {questions?.map((q, i) => (
          <QuizCard
            key={i}
            question={q}
            index={i}
            onAnswered={(correct) => {
              setAnswered((a) => a + 1);
              if (correct) setScore((s) => s + 1);
            }}
          />
        ))}
      </div>

      {!loading && questions?.length > 0 && (
        <button
          onClick={loadQuiz}
          className="mt-8 bg-tea text-paper px-6 py-2.5 rounded-full text-sm font-medium hover:bg-teaLight transition"
        >
          New set of questions
        </button>
      )}
    </div>
  );
}
