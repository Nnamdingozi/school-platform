"use client";

import { useState, useTransition } from "react";
import { getScannedPaperById } from "@/app/actions/scanned-question-bank";
import { useProfileStore } from "@/store/profileStore";
import { toast } from "sonner";
import {
  Download,
  Loader2,
  FileDown,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScannedPaperSet, ExtractedQuestion } from "@/app/actions/scanned-question-bank";

interface PastQuestionDownloaderProps {
  paper: ScannedPaperSet;
  userId: string;
  schoolId: string | null;
}

function buildHtml(paper: ScannedPaperSet, questions: ExtractedQuestion[], primaryColor: string): string {
  const rows = questions
    .map(
      (q, i) => `
      <div class="question-block">
        <div class="question-header">
          <span class="question-number">Q${String(i + 1).padStart(2, "0")}</span>
          <p class="question-text">${q.text}</p>
        </div>
        <div class="answer-block">
          <div class="answer-row">
            <span class="label">Answer</span>
            <span class="answer-value">${q.answer}</span>
          </div>
          <div class="explanation-row">
            <span class="label">Explanation</span>
            <p class="explanation-value">${q.explanation}</p>
          </div>
        </div>
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${paper.subject} ${paper.type} ${paper.year} — Past Questions</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: #f8f8f6;
      color: #1a1a1a;
      padding: 48px 24px;
      line-height: 1.6;
    }

    .page {
      max-width: 820px;
      margin: 0 auto;
    }

    /* ── Header ── */
    .header {
      border-bottom: 3px solid ${primaryColor};
      padding-bottom: 28px;
      margin-bottom: 48px;
    }

    .badge {
      display: inline-block;
      background: ${primaryColor}18;
      color: ${primaryColor};
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 999px;
      border: 1px solid ${primaryColor}40;
      margin-bottom: 16px;
    }

    .title {
      font-size: clamp(28px, 5vw, 42px);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.03em;
      font-style: italic;
      color: #0f0f0f;
      line-height: 1.1;
    }

    .meta {
      margin-top: 10px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #888;
    }

    .meta span {
      color: ${primaryColor};
    }

    /* ── Question Blocks ── */
    .question-block {
      background: #fff;
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 28px;
      border: 1px solid #e8e8e4;
      page-break-inside: avoid;
    }

    .question-header {
      display: flex;
      gap: 20px;
      align-items: flex-start;
      padding: 28px 32px;
      border-bottom: 1px solid #f0f0ec;
    }

    .question-number {
      font-size: 22px;
      font-weight: 900;
      font-style: italic;
      color: ${primaryColor};
      opacity: 0.35;
      flex-shrink: 0;
      line-height: 1.4;
    }

    .question-text {
      font-size: 15px;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 1.7;
    }

    .answer-block {
      padding: 24px 32px;
      background: #fafaf8;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .answer-row,
    .explanation-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .label {
      font-size: 9px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #aaa;
      padding-top: 3px;
      min-width: 80px;
      flex-shrink: 0;
    }

    .answer-value {
      font-size: 15px;
      font-weight: 800;
      font-style: italic;
      color: #0f0f0f;
    }

    .explanation-value {
      font-size: 13px;
      color: #555;
      line-height: 1.75;
      font-weight: 500;
    }

    /* ── Footer ── */
    .footer {
      margin-top: 60px;
      padding-top: 24px;
      border-top: 1px solid #e0e0da;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-text {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #bbb;
    }

    .footer-count {
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: ${primaryColor};
    }

    @media print {
      body { background: #fff; padding: 24px; }
      .question-block { border: 1px solid #ddd; box-shadow: none; }
    }

    @media (max-width: 600px) {
      body { padding: 24px 16px; }
      .question-header { flex-direction: column; gap: 8px; }
      .answer-row, .explanation-row { flex-direction: column; gap: 4px; }
      .label { min-width: unset; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="badge">${paper.type} Past Questions</div>
      <h1 class="title">${paper.subject}</h1>
      <p class="meta">Session <span>${paper.year}</span> &nbsp;·&nbsp; <span>${questions.length} Questions</span> &nbsp;·&nbsp; AI Verified</p>
    </div>

    ${rows}

    <div class="footer">
      <span class="footer-text">Generated via Archive Hub</span>
      <span class="footer-count">${questions.length} Logic Nodes</span>
    </div>
  </div>
</body>
</html>`;
}

export function PastQuestionDownloader({
  paper,
  userId,
  schoolId,
}: PastQuestionDownloaderProps) {
  const { profile } = useProfileStore();
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const primaryColor = profile?.primaryColor || "#f59e0b";

  const handleDownload = () => {
    startTransition(async () => {
      const res = await getScannedPaperById(paper.id, userId, schoolId);

      if (!res.success || !res.paper) {
        toast.error(res.error ?? "Could not retrieve paper.");
        return;
      }

      const questions = (res.paper.questions as unknown as ExtractedQuestion[]) ?? [];

      if (questions.length === 0) {
        toast.error("No questions found in this paper.");
        return;
      }

      const html = buildHtml(res.paper as ScannedPaperSet, questions, primaryColor);
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${res.paper.subject}_${res.paper.type}_${res.paper.year}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDone(true);
      toast.success("Download started — open the file in any browser to print as PDF.");
      setTimeout(() => setDone(false), 3000);
    });
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isPending}
      title="Download as HTML (printable PDF)"
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
        done
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
          : "border-border bg-card hover:border-school-primary/30 hover:bg-school-primary/5 text-muted-foreground hover:text-foreground",
        isPending && "opacity-60 cursor-not-allowed"
      )}
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : done ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <FileDown className="h-3.5 w-3.5" />
      )}
      {isPending ? "Preparing..." : done ? "Downloaded" : "Download"}
    </button>
  );
}


// ─── Bulk Downloader (downloads all papers at once) ───────────────────────────

interface BulkDownloaderProps {
  papers: ScannedPaperSet[];
  userId: string;
  schoolId: string | null;
}

export function BulkPastQuestionDownloader({
  papers,
  userId,
  schoolId,
}: BulkDownloaderProps) {
  const { profile } = useProfileStore();
  const [isPending, startTransition] = useTransition();
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const primaryColor = profile?.primaryColor || "#f59e0b";

  const handleBulkDownload = () => {
    if (papers.length === 0) return toast.error("No papers in registry.");

    startTransition(async () => {
      setProgress({ done: 0, total: papers.length });
      let successCount = 0;

      for (let i = 0; i < papers.length; i++) {
        const paper = papers[i];
        const res = await getScannedPaperById(paper.id, userId, schoolId);

        if (!res.success || !res.paper) continue;

        const questions = (res.paper.questions as unknown as ExtractedQuestion[]) ?? [];
        if (questions.length === 0) continue;

        const html = buildHtml(res.paper as ScannedPaperSet, questions, primaryColor);
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${res.paper.subject}_${res.paper.type}_${res.paper.year}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        successCount++;
        setProgress({ done: i + 1, total: papers.length });

        // Small delay between downloads so browser doesn't block them
        await new Promise((r) => setTimeout(r, 600));
      }

      setProgress(null);
      toast.success(`${successCount} of ${papers.length} papers downloaded.`);
    });
  };

  return (
    <button
      onClick={handleBulkDownload}
      disabled={isPending || papers.length === 0}
      className={cn(
        "flex items-center gap-2 px-5 py-3 rounded-2xl border border-border bg-card text-[10px] font-black uppercase tracking-widest transition-all",
        "hover:border-school-primary/30 hover:bg-school-primary/5 hover:text-foreground",
        "text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      {isPending ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {progress
            ? `Downloading ${progress.done}/${progress.total}...`
            : "Preparing..."}
        </>
      ) : (
        <>
          <Download className="h-3.5 w-3.5" />
          Download All ({papers.length})
        </>
      )}
    </button>
  );
}