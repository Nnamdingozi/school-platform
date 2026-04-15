"use client";

import { useState, useRef, useCallback } from "react";
import { processPastQuestion } from "@/actions/processPastQuestion";

// ─── Types ───────────────────────────────────────────────────────────────────

type Question = {
  number: number;
  text: string;
  marks?: number;
  type?: string;
};

type Answer = {
  number: number;
  answer: string;
  difficulty?: "easy" | "medium" | "hard";
  keyPoints?: string[];
  markingGuide?: string;
};

type Result = {
  success: boolean;
  subject?: string;
  grade?: string;
  year?: string;
  imageUrl?: string;
  questions?: Question[];
  answers?: Answer[];
  error?: string;
};

// ─── Icons (unchanged) ───────────────────────────────────────────────────────

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round"/>
  </svg>
);

// (Other icons remain unchanged...)

const difficultyConfig = {
  easy:   { label: "Easy",   bg: "#dcfce7", color: "#166534" },
  medium: { label: "Medium", bg: "#fef9c3", color: "#854d0e" },
  hard:   { label: "Hard",   bg: "#fee2e2", color: "#991b1b" },
};

function DifficultyBadge({ level }: { level?: "easy" | "medium" | "hard" }) {
  const config = difficultyConfig[level ?? "medium"];
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 500,
      padding: "2px 8px",
      borderRadius: 999,
      background: config.bg,
      color: config.color,
    }}>
      {config.label}
    </span>
  );
}

// ─── Question Card ───────────────────────────────────────────────────────────

function QuestionCard({
  question,
  answer,
  index,
}: {
  question: Question;
  answer: Answer | null;
  index: number;
}) {
  const [open, setOpen] = useState<boolean>(index === 0);

  return (
    <div>
      {/* Same JSX as before */}
    </div>
  );
}

// ─── Processing Steps ─────────────────────────────────────────────────────────

type StepId = "upload" | "ocr" | "answers";

function ProcessingSteps({ currentStep }: { currentStep: StepId }) {
  const steps = [
    { id: "upload", label: "Uploading image" },
    { id: "ocr", label: "Reading questions" },
    { id: "answers", label: "Generating answers" },
  ] as const;

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  return <div>{/* same JSX */}</div>;
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function PastQuestionsPage() {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [processingStep, setStep] = useState<StepId | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // ── File handler ───────────────────────────────────────────────────────────

  const handleFile = useCallback((selectedFile: File | null) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setPreview(result);
      }
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      handleFile(e.dataTransfer.files[0] ?? null);
    },
    [handleFile]
  );

  // ── Process ────────────────────────────────────────────────────────────────

  const handleProcess = async () => {
    if (!file) return;

    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      setStep("upload");
      await new Promise((r) => setTimeout(r, 600));

      setStep("ocr");
      const promise = processPastQuestion(formData);

      await new Promise((r) => setTimeout(r, 2500));
      setStep("answers");

      const data: Result = await promise;

      if (!data.success) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message ?? "Network error. Please try again.");
    } finally {
      setStep(null);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setStep(null);
  };

  // ── Merge logic ────────────────────────────────────────────────────────────

  const pairs =
    result?.questions?.map((q) => ({
      question: q,
      answer: result.answers?.find((a) => a.number === q.number) ?? null,
    })) ?? [];

  // ── JSX (unchanged) ────────────────────────────────────────────────────────

  return (
    <div>
      {/* Your full JSX stays EXACTLY the same */}
    </div>
  );
}