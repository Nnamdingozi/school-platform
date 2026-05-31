// "use client";

// import React from "react";
// import { 
//   FileDown, Printer, RotateCcw, 
//   CheckCircle2, FileText, BookOpen, 
//   Download, Award, Layers 
// } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// // Use the types from your main page
// type Question = { number: number; text: string; marks?: number; type?: string; };
// type Answer = { number: number; answer: string; difficulty?: "easy" | "medium" | "hard"; keyPoints?: string[]; markingGuide?: string; };
// type Result = { success: boolean; subject?: string; grade?: string; year?: string; questions?: Question[]; answers?: Answer[]; };

// interface Props {
//   result: Result;
//   onReset: () => void;
// }

// export function PastQuestionResult({ result, onReset }: Props) {
//   const { subject, grade, year, questions = [], answers = [] } = result;

//   // ─── Export Logic ──────────────────────────────────────────────────────────

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleDownloadDoc = () => {
//     // Generate a simple text-based DOC format
//     let content = `OFFICIAL MARKING GUIDE\n${subject} - ${grade}\nYear: ${year}\n\n`;
    
//     questions.forEach((q) => {
//       const a = answers.find(ans => ans.number === q.number);
//       content += `QUESTION ${q.number} (${q.marks || 0} Marks)\n`;
//       content += `${q.text}\n\n`;
//       content += `SUGGESTED ANSWER:\n${a?.answer || "N/A"}\n`;
//       content += `MARKING GUIDE:\n${a?.markingGuide || "N/A"}\n`;
//       content += `--------------------------------------------------\n\n`;
//     });

//     const blob = new Blob([content], { type: "application/msword" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `${subject}_${grade}_Marking_Guide.doc`;
//     link.click();
//   };

//   return (
//     <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
//       {/* ─── Action Toolbar (Hidden during print) ─── */}
//       <style>{`
//         @media print {
//           .no-print { display: none !important; }
//           #printable-content { color: black !important; background: white !important; padding: 0 !important; }
//           .page-break { page-break-after: always; }
//         }
//       `}</style>

//       <div className="no-print flex flex-col md:flex-row justify-between items-center bg-slate-900 p-6 rounded-3xl border border-white/5 shadow-2xl gap-4">
//         <div className="flex items-center gap-4">
//             <Button variant="ghost" onClick={onReset} className="text-slate-500 hover:text-white uppercase text-[10px] font-black">
//                 <RotateCcw className="mr-2 h-4 w-4" /> Start Over
//             </Button>
//             <div className="h-8 w-px bg-white/5" />
//             <p className="text-[10px] font-black text-school-primary uppercase tracking-[0.2em]">Registry Output Ready</p>
//         </div>
//         <div className="flex gap-3 w-full md:w-auto">
//             <Button onClick={handlePrint} variant="outline" className="flex-1 md:flex-none bg-slate-950 border-white/10 rounded-xl uppercase text-[10px] font-black tracking-widest h-12">
//                 <Printer className="mr-2 h-4 w-4" /> Print PDF
//             </Button>
//             <Button onClick={handleDownloadDoc} className="flex-1 md:flex-none bg-school-primary text-slate-950 rounded-xl uppercase text-[10px] font-black tracking-widest h-12 shadow-xl shadow-school-primary/10">
//                 <FileDown className="mr-2 h-4 w-4" /> Download DOC
//             </Button>
//         </div>
//       </div>

//       {/* ─── The Printable Document ─── */}
//       <Card id="printable-content" className="bg-white text-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border-none relative">
//         <div className="no-print absolute top-0 left-0 w-full h-2 bg-school-primary" />
        
//         <CardContent className="p-12 md:p-20">
//           {/* Document Header */}
//           <div className="text-center mb-16 space-y-4">
//             <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
//                 <Layers className="h-3 w-3" /> Nigerian Curriculum Standard
//             </div>
//             <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
//                 {subject} — {grade}
//             </h1>
//             <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.4em]">
//                 Academic Session: {year || "Official Past Question"}
//             </p>
//             <div className="h-1 w-20 bg-school-primary mx-auto rounded-full mt-6" />
//           </div>

//           {/* Q&A Section */}
//           <div className="space-y-16">
//             {questions.map((q, idx) => {
//               const a = answers.find(ans => ans.number === q.number);
//               return (
//                 <div key={idx} className="space-y-6 relative group border-b border-slate-100 pb-12 last:border-0">
//                   <div className="flex justify-between items-start gap-4">
//                     <div className="flex gap-6">
//                         <span className="text-2xl font-black text-school-primary/30 mt-1">
//                             {q.number < 10 ? `0${q.number}` : q.number}
//                         </span>
//                         <div className="space-y-4">
//                             <h3 className="text-xl font-bold text-slate-900 leading-snug">
//                                 {q.text}
//                             </h3>
//                             <div className="flex gap-4">
//                                 <span className="text-[9px] font-black uppercase bg-slate-100 px-3 py-1 rounded-md text-slate-500">
//                                     Value: {q.marks || 0} Marks
//                                 </span>
//                                 <span className="text-[9px] font-black uppercase bg-slate-100 px-3 py-1 rounded-md text-slate-500">
//                                     Type: {q.type || "Theory"}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                   </div>

//                   {/* AI Generated Answer Section */}
//                   <div className="ml-14 space-y-6">
//                      <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
//                         <div className="flex items-center gap-2 text-school-primary mb-2">
//                             <CheckCircle2 className="h-4 w-4" />
//                             <span className="text-[10px] font-black uppercase tracking-widest">Suggested Solution</span>
//                         </div>
//                         <p className="text-base text-slate-700 leading-loose font-medium">
//                             {a?.answer || "AI is synthesizing answer..."}
//                         </p>

//                         {/* Marking Guide */}
//                         {a?.markingGuide && (
//                             <div className="mt-6 pt-6 border-t border-slate-200">
//                                 <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Marking Guide / Rationale</p>
//                                 <p className="text-sm text-slate-500 italic leading-relaxed">
//                                     {a.markingGuide}
//                                 </p>
//                             </div>
//                         )}
//                      </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Footer for the Doc */}
//           <div className="mt-20 pt-12 border-t-2 border-slate-900/5 text-center flex flex-col items-center">
//             <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white mb-4">
//                 <BookOpen className="h-5 w-5" />
//             </div>
//             <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">
//                 Institutional_Registry_Output_ID_{Math.random().toString(36).substr(2, 9).toUpperCase()}
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


// "use client";

// import React from "react";
// import { 
//   FileDown, Printer, RotateCcw, 
//   CheckCircle2, BookOpen, Layers,
//   FileText, Award
// } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";


// // ── Types ───────────────────────────────────────────────────────────────────

// interface Question {
//   number: number;
//   text: string;
//   marks?: number;
//   type?: string;
// }

// interface Answer {
//   number: number;
//   answer: string;
//   difficulty?: "easy" | "medium" | "hard";
//   keyPoints?: string[];
//   markingGuide?: string;
// }

// interface Result {
//   success: boolean;
//   subject?: string;
//   grade?: string;
//   year?: string;
//   questions?: Question[];
//   answers?: Answer[];
// }

// interface PastQuestionResultProps {
//   result: Result;
//   onReset: () => void;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function PastQuestionResult({ result, onReset }: PastQuestionResultProps) {
//   const { subject, grade, year, questions = [], answers = [] } = result;

//   // ─── Export Logic ──────────────────────────────────────────────────────────

//   const handlePrint = (): void => {
//     window.print();
//   };

//   const handleDownloadDoc = (): void => {
//     let content = `OFFICIAL MARKING GUIDE\n${subject} - ${grade}\nYear: ${year}\n\n`;
    
//     questions.forEach((q) => {
//       const a = answers.find(ans => ans.number === q.number);
//       content += `QUESTION ${q.number} (${q.marks || 0} Marks)\n`;
//       content += `${q.text}\n\n`;
//       content += `SUGGESTED ANSWER:\n${a?.answer || "N/A"}\n`;
//       content += `MARKING GUIDE:\n${a?.markingGuide || "N/A"}\n`;
//       content += `--------------------------------------------------\n\n`;
//     });

//     const blob = new Blob([content], { type: "application/msword" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `${subject}_${grade}_Marking_Guide.doc`;
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
//       {/* ─── Print Configuration ─── */}
//       <style>{`
//         @media print {
//           .no-print { display: none !important; }
//           #printable-content { color: black !important; background: white !important; padding: 0 !important; box-shadow: none !important; }
//           .page-break { page-break-after: always; }
//         }
//       `}</style>

//       {/* ─── Action Toolbar ─── */}
//       <div className="no-print flex flex-col md:flex-row justify-between items-center bg-slate-900 p-6 rounded-3xl border border-white/5 shadow-2xl gap-4">
//         <div className="flex items-center gap-4">
//             <Button variant="ghost" onClick={onReset} className="text-slate-500 hover:text-white uppercase text-[10px] font-black tracking-widest">
//                 <RotateCcw className="mr-2 h-4 w-4" /> Reset Analysis
//             </Button>
//             <div className="h-8 w-px bg-white/5" />
//             <div className="flex items-center gap-2 text-school-primary">
//                 <FileText className="h-4 w-4" />
//                 <p className="text-[10px] font-black uppercase tracking-[0.2em]">Registry Output Ready</p>
//             </div>
//         </div>
//         <div className="flex gap-3 w-full md:w-auto">
//             <Button onClick={handlePrint} variant="outline" className="flex-1 md:flex-none bg-slate-950 border-white/10 rounded-xl uppercase text-[10px] font-black tracking-widest h-12">
//                 <Printer className="mr-2 h-4 w-4" /> Export PDF
//             </Button>
//             <Button onClick={handleDownloadDoc} className="flex-1 md:flex-none bg-school-primary text-slate-950 rounded-xl uppercase text-[10px] font-black tracking-widest h-12 shadow-xl shadow-school-primary/10 transition-all hover:scale-[1.02]">
//                 <FileDown className="mr-2 h-4 w-4" /> Download DOC
//             </Button>
//         </div>
//       </div>

//       {/* ─── The Printable Document ─── */}
//       <Card id="printable-content" className="bg-white text-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border-none relative">
//         <div className="no-print absolute top-0 left-0 w-full h-2 bg-school-primary" />
        
//         <CardContent className="p-12 md:p-20">
//           {/* Header */}
//           <div className="text-center mb-16 space-y-4">
//             <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
//                 <Layers className="h-3 w-3" /> Institutional Standard
//             </div>
//             <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
//                 {subject} — {grade}
//             </h1>
//             <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.4em]">
//                 Registry ID: {year || "Official Past Record"}
//             </p>
//             <div className="h-1 w-20 bg-school-primary mx-auto rounded-full mt-6" />
//           </div>

//           {/* Q&A List */}
//           <div className="space-y-16">
//             {questions.map((q, idx) => {
//               const a = answers.find(ans => ans.number === q.number);
//               return (
//                 <div key={idx} className="space-y-6 relative group border-b border-slate-100 pb-12 last:border-0">
//                   <div className="flex justify-between items-start gap-4">
//                     <div className="flex gap-6">
//                         <span className="text-2xl font-black text-school-primary/30 mt-1 italic">
//                             {q.number < 10 ? `0${q.number}` : q.number}
//                         </span>
//                         <div className="space-y-4">
//                             <h3 className="text-xl font-bold text-slate-900 leading-snug tracking-tight">
//                                 {q.text}
//                             </h3>
//                             <div className="flex gap-4">
//                                 <span className="text-[9px] font-black uppercase bg-slate-100 px-3 py-1 rounded-md text-slate-500 flex items-center gap-1.5">
//                                     <Award className="h-3 w-3" /> {q.marks || 0} Marks
//                                 </span>
//                                 <span className="text-[9px] font-black uppercase bg-slate-100 px-3 py-1 rounded-md text-slate-500">
//                                     Type: {q.type || "Theory"}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                   </div>

//                   <div className="ml-14 space-y-6">
//                      <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 shadow-inner">
//                         <div className="flex items-center gap-2 text-school-primary mb-2">
//                             <CheckCircle2 className="h-4 w-4" />
//                             <span className="text-[10px] font-black uppercase tracking-widest">Marking Guide Answer</span>
//                         </div>
//                         <p className="text-base text-slate-700 leading-loose font-medium">
//                             {a?.answer || "Pending AI synthesis..."}
//                         </p>

//                         {a?.markingGuide && (
//                             <div className="mt-6 pt-6 border-t border-slate-200">
//                                 <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Evaluation Criteria</p>
//                                 <p className="text-sm text-slate-500 italic leading-relaxed">
//                                     {a.markingGuide}
//                                 </p>
//                             </div>
//                         )}
//                      </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="mt-20 pt-12 border-t-2 border-slate-900/5 text-center flex flex-col items-center">
//             <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white mb-4 shadow-xl">
//                 <BookOpen className="h-5 w-5" />
//             </div>
//             <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">
//                 Institutional_Registry_Output_Marking_Guide
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



"use client";

import React from "react";
import { 
  FileDown, Printer, RotateCcw, 
  CheckCircle2, BookOpen, Layers,
  FileText, Award, ShieldCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface QuestionNode {
  number: number;
  text: string;
  marks?: number;
  type?: string;
}

interface AnswerNode {
  number: number;
  answer: string;
  difficulty?: "easy" | "medium" | "hard";
  keyPoints?: string[];
  markingGuide?: string;
}

interface ResultPayload {
  success: boolean;
  subject?: string;
  grade?: string;
  year?: string;
  questions?: QuestionNode[];
  answers?: AnswerNode[];
}

interface PastQuestionResultProps {
  result: ResultPayload;
  onReset: () => void;
}

/**
 * PAST QUESTION ANALYSIS LEDGER (Tier 2/3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem] and [3rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function PastQuestionResult({ result, onReset }: PastQuestionResultProps) {
  const { subject, grade, year, questions = [], answers = [] } = result;

  // ─── Export Protocol ───────────────────────────────────────────────────────

  const handlePrint = (): void => {
    window.print();
  };

  const handleDownloadDoc = (): void => {
    let content = `OFFICIAL MARKING LEDGER\n${subject} - ${grade}\nArchive Year: ${year}\n\n`;
    
    questions.forEach((q) => {
      const a = answers.find(ans => ans.number === q.number);
      content += `QUESTION ${q.number} (${q.marks || 0} Marks)\n`;
      content += `${q.text}\n\n`;
      content += `SUGGESTED ANSWER:\n${a?.answer || "N/A"}\n`;
      content += `MARKING CRITERIA:\n${a?.markingGuide || "N/A"}\n`;
      content += `--------------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${subject}_${grade}_Marking_Ledger.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24 animate-in fade-in duration-700">
      
      {/* ─── PRINT PROTOCOL (Rule 18) ─── */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          #printable-content { color: black !important; background: white !important; padding: 0 !important; border: none !important; }
          .page-break { page-break-after: always; }
        }
      `}</style>

      {/* ─── ACTION TERMINAL (Rule 18/19/21) ─── */}
      <div className="no-print flex flex-col md:flex-row justify-between items-center bg-card border border-border p-6 rounded-[2rem] shadow-xl gap-6 sticky top-4 z-50 backdrop-blur-md">
        <div className="flex items-center gap-5">
            <button 
              onClick={onReset} 
              className="text-muted-foreground hover:text-foreground text-[10px] font-extrabold uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95"
            >
                <RotateCcw className="h-4 w-4" /> Reset Analysis
            </button>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-2.5 text-school-primary">
                {/* Rule 21: Scale protocol accent */}
                <div className="h-8 w-8 rounded-lg bg-school-primary-50 flex items-center justify-center border border-school-primary-200 shadow-inner">
                    <FileText className="h-4 w-4" />
                </div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest italic leading-none">Output Ledger Ready</p>
            </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            <Button 
              onClick={handlePrint} 
              variant="outline" 
              className="flex-1 md:flex-none h-12 px-8 bg-surface border-border rounded-xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-background transition-all"
            >
                <Printer className="mr-2 h-4 w-4" /> Export PDF
            </Button>
            <Button 
              onClick={handleDownloadDoc} 
              className="flex-1 md:flex-none h-12 px-8 bg-school-primary text-on-school-primary rounded-xl font-extrabold text-[10px] uppercase tracking-widest shadow-lg shadow-school-primary-200 transition-all hover:scale-[1.02] active:scale-95"
            >
                <FileDown className="mr-2 h-4 w-4" /> Download DOC
            </Button>
        </div>
      </div>

      {/* ─── THE PRINTABLE LEDGER (Rule 11/19) ─── */}
      <Card id="printable-content" className="bg-card border-border rounded-[3rem] shadow-2xl overflow-hidden relative">
        {/* Visual Brand Guard */}
        <div className="no-print absolute top-0 left-0 right-0 h-2 bg-school-primary opacity-40" />
        
        <CardContent className="p-8 md:p-16 lg:p-20 space-y-16">
          {/* Document Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-surface border border-border text-[9px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground shadow-inner">
                <Layers className="h-3.5 w-3.5 text-school-primary" /> Institutional Registry Standard
            </div>
            
            <div className="space-y-3">
                <h1 className="text-3xl md:text-5xl font-extrabold text-foreground uppercase italic tracking-tighter leading-tight">
                    {subject} — {grade}
                </h1>
                <p className="text-muted-foreground text-[12px] font-bold uppercase tracking-[0.4em] opacity-40">
                    Registry Code: {year || "Official Archive"}
                </p>
            </div>
            
            <div className="h-1.5 w-24 bg-school-primary-100 mx-auto rounded-full" />
          </div>

          {/* Q&A HUB */}
          <div className="space-y-16">
            {questions.map((q, idx) => {
              const a = answers.find(ans => ans.number === q.number);
              return (
                <div key={idx} className="space-y-8 relative group border-b border-border pb-16 last:border-0 last:pb-0">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex gap-6 min-w-0">
                        {/* Question Index (Rule 21) */}
                        <div className="h-12 w-12 shrink-0 rounded-2xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center text-xl font-extrabold text-school-primary italic tabular-nums shadow-sm">
                            {String(q.number).padStart(2, '0')}
                        </div>
                        <div className="space-y-4 min-w-0">
                            <h3 className="text-xl md:text-2xl font-bold text-foreground leading-relaxed italic tracking-tight">
                                {q.text}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                <span className="text-[9px] font-extrabold uppercase bg-surface border border-border px-3 py-1 rounded-lg text-muted-foreground flex items-center gap-1.5 shadow-sm">
                                    <Award className="h-3 w-3 text-school-primary" /> {q.marks || 0} Marks
                                </span>
                                <span className="text-[9px] font-extrabold uppercase bg-surface border border-border px-3 py-1 rounded-lg text-muted-foreground italic">
                                    Type: {q.type || "Theory"}
                                </span>
                            </div>
                        </div>
                    </div>
                  </div>

                  <div className="md:ml-16 space-y-6">
                     <div className="p-6 md:p-10 bg-surface rounded-[2rem] border border-border space-y-6 shadow-inner relative overflow-hidden">
                        {/* Rule 21 mathematical decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 blur-3xl opacity-20" />

                        <div className="flex items-center gap-3 text-school-primary relative z-10">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-[10px] font-extrabold uppercase tracking-widest">Marking Hub Resolution</span>
                        </div>
                        
                        <p className="text-base md:text-lg text-foreground/80 leading-loose font-medium italic relative z-10">
                            {a?.answer || "Registry Protocol: Sync pending..."}
                        </p>

                        {a?.markingGuide && (
                            <div className="mt-8 pt-8 border-t border-border relative z-10">
                                <p className="text-[10px] font-extrabold uppercase text-muted-foreground/40 mb-4 tracking-widest italic">Evaluation Matrix</p>
                                <p className="text-sm text-muted-foreground italic leading-relaxed pl-6 border-l-2 border-school-primary-200">
                                    {a.markingGuide}
                                </p>
                            </div>
                        )}
                     </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ledger Footer */}
          <div className="mt-24 pt-12 border-t border-border text-center flex flex-col items-center gap-6 opacity-30">
            <div className="h-12 w-12 rounded-2xl bg-surface border border-border flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.5em] text-foreground">
                    Institutional_Registry_Protocol_v2.0
                </p>
                <div className="flex items-center justify-center gap-3">
                    <ShieldCheck className="h-3 w-3" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Marking Ledger Verified</span>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}