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


"use client";

import React from "react";
import { 
  FileDown, Printer, RotateCcw, 
  CheckCircle2, BookOpen, Layers,
  FileText, Award
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


// ── Types ───────────────────────────────────────────────────────────────────

interface Question {
  number: number;
  text: string;
  marks?: number;
  type?: string;
}

interface Answer {
  number: number;
  answer: string;
  difficulty?: "easy" | "medium" | "hard";
  keyPoints?: string[];
  markingGuide?: string;
}

interface Result {
  success: boolean;
  subject?: string;
  grade?: string;
  year?: string;
  questions?: Question[];
  answers?: Answer[];
}

interface PastQuestionResultProps {
  result: Result;
  onReset: () => void;
}

// ── Main Component ──────────────────────────────────────────────────────────

export function PastQuestionResult({ result, onReset }: PastQuestionResultProps) {
  const { subject, grade, year, questions = [], answers = [] } = result;

  // ─── Export Logic ──────────────────────────────────────────────────────────

  const handlePrint = (): void => {
    window.print();
  };

  const handleDownloadDoc = (): void => {
    let content = `OFFICIAL MARKING GUIDE\n${subject} - ${grade}\nYear: ${year}\n\n`;
    
    questions.forEach((q) => {
      const a = answers.find(ans => ans.number === q.number);
      content += `QUESTION ${q.number} (${q.marks || 0} Marks)\n`;
      content += `${q.text}\n\n`;
      content += `SUGGESTED ANSWER:\n${a?.answer || "N/A"}\n`;
      content += `MARKING GUIDE:\n${a?.markingGuide || "N/A"}\n`;
      content += `--------------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${subject}_${grade}_Marking_Guide.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ─── Print Configuration ─── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          #printable-content { color: black !important; background: white !important; padding: 0 !important; box-shadow: none !important; }
          .page-break { page-break-after: always; }
        }
      `}</style>

      {/* ─── Action Toolbar ─── */}
      <div className="no-print flex flex-col md:flex-row justify-between items-center bg-slate-900 p-6 rounded-3xl border border-white/5 shadow-2xl gap-4">
        <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onReset} className="text-slate-500 hover:text-white uppercase text-[10px] font-black tracking-widest">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset Analysis
            </Button>
            <div className="h-8 w-px bg-white/5" />
            <div className="flex items-center gap-2 text-school-primary">
                <FileText className="h-4 w-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Registry Output Ready</p>
            </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <Button onClick={handlePrint} variant="outline" className="flex-1 md:flex-none bg-slate-950 border-white/10 rounded-xl uppercase text-[10px] font-black tracking-widest h-12">
                <Printer className="mr-2 h-4 w-4" /> Export PDF
            </Button>
            <Button onClick={handleDownloadDoc} className="flex-1 md:flex-none bg-school-primary text-slate-950 rounded-xl uppercase text-[10px] font-black tracking-widest h-12 shadow-xl shadow-school-primary/10 transition-all hover:scale-[1.02]">
                <FileDown className="mr-2 h-4 w-4" /> Download DOC
            </Button>
        </div>
      </div>

      {/* ─── The Printable Document ─── */}
      <Card id="printable-content" className="bg-white text-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border-none relative">
        <div className="no-print absolute top-0 left-0 w-full h-2 bg-school-primary" />
        
        <CardContent className="p-12 md:p-20">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Layers className="h-3 w-3" /> Institutional Standard
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
                {subject} — {grade}
            </h1>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.4em]">
                Registry ID: {year || "Official Past Record"}
            </p>
            <div className="h-1 w-20 bg-school-primary mx-auto rounded-full mt-6" />
          </div>

          {/* Q&A List */}
          <div className="space-y-16">
            {questions.map((q, idx) => {
              const a = answers.find(ans => ans.number === q.number);
              return (
                <div key={idx} className="space-y-6 relative group border-b border-slate-100 pb-12 last:border-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-6">
                        <span className="text-2xl font-black text-school-primary/30 mt-1 italic">
                            {q.number < 10 ? `0${q.number}` : q.number}
                        </span>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-900 leading-snug tracking-tight">
                                {q.text}
                            </h3>
                            <div className="flex gap-4">
                                <span className="text-[9px] font-black uppercase bg-slate-100 px-3 py-1 rounded-md text-slate-500 flex items-center gap-1.5">
                                    <Award className="h-3 w-3" /> {q.marks || 0} Marks
                                </span>
                                <span className="text-[9px] font-black uppercase bg-slate-100 px-3 py-1 rounded-md text-slate-500">
                                    Type: {q.type || "Theory"}
                                </span>
                            </div>
                        </div>
                    </div>
                  </div>

                  <div className="ml-14 space-y-6">
                     <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 shadow-inner">
                        <div className="flex items-center gap-2 text-school-primary mb-2">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Marking Guide Answer</span>
                        </div>
                        <p className="text-base text-slate-700 leading-loose font-medium">
                            {a?.answer || "Pending AI synthesis..."}
                        </p>

                        {a?.markingGuide && (
                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Evaluation Criteria</p>
                                <p className="text-sm text-slate-500 italic leading-relaxed">
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

          <div className="mt-20 pt-12 border-t-2 border-slate-900/5 text-center flex flex-col items-center">
            <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white mb-4 shadow-xl">
                <BookOpen className="h-5 w-5" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">
                Institutional_Registry_Output_Marking_Guide
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}