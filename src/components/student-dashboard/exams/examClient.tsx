
"use client";

import { useState } from "react";
import { useExamTimer } from "@/hooks/useExamTimer";

type Props = {
  exam: any;
};

export default function ExamClient({ exam }: Props) {
  const { timeLeft, status } = useExamTimer(exam.startTime, exam.duration);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ---------------- ACCESS CONTROL ----------------
  if (status === "waiting") {
    return (
      <div className="p-10 text-center text-white">
        <h1 className="text-2xl font-bold">Exam Not Started</h1>
        <p>Starts at: {new Date(exam.startTime).toLocaleString()}</p>
      </div>
    );
  }

  if (status === "ended") {
    return (
      <div className="p-10 text-center text-red-500">
        <h1 className="text-2xl font-bold">Exam Ended</h1>
      </div>
    );
  }

  // ---------------- ACTIVE EXAM ----------------
  return (
    <div className="p-6 space-y-6 text-white bg-slate-950 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{exam.title}</h1>

        <div className="bg-red-600 px-4 py-2 rounded-lg font-bold">
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* QUESTIONS */}
      <div className="space-y-6">
        {exam.questions.map((q: any, index: number) => (
          <div key={q.id} className="bg-slate-900 p-4 rounded-lg space-y-3">

            <p className="font-bold">
              {index + 1}. {q.text}
            </p>

            <div className="space-y-2">
              {q.options.map((opt: string) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    onChange={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [q.id]: opt,
                      }))
                    }
                  />
                  {opt}
                </label>
              ))}
            </div>

          </div>
        ))}
      </div>

      {/* SUBMIT */}
      <button
        className="bg-green-600 px-6 py-3 rounded-lg font-bold"
        onClick={() => console.log("submit", answers)}
      >
        Submit Exam
      </button>
    </div>
  );
}