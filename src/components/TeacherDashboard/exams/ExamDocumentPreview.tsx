// import { Card } from "@/components/ui/card"
// import { ArrowLeft, Printer, Loader2, CheckCircle2 } from "lucide-react"

// export function ExamDocumentPreview({
//   generatedPool,
//   config,
//   handleFinalDeploy,
//   setStep,
//   isViewOnly,
//   isPending
// }: any) {

//   return (
//     <div className="max-w-4xl mx-auto space-y-8 pb-20">

//       <div className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl">

//         <button
//           onClick={() => setStep(1)}
//           className="flex items-center gap-2 text-sm"
//         >
//           <ArrowLeft className="h-3 w-3" /> Back
//         </button>

//         <div className="flex gap-4">

//           <button
//             onClick={() => window.print()}
//             className="p-3 bg-slate-950 rounded-xl"
//           >
//             <Printer className="h-5 w-5" />
//           </button>

//           {!isViewOnly && (
//             <button
//               onClick={handleFinalDeploy}
//               disabled={isPending}
//               className="bg-school-primary text-black px-6 py-3 rounded-xl flex items-center gap-2"
//             >
//               {isPending
//                 ? <Loader2 className="h-4 w-4 animate-spin" />
//                 : <CheckCircle2 className="h-4 w-4" />
//               }

//               Deploy Exam
//             </button>
//           )}

//         </div>
//       </div>

//       <Card className="bg-white text-black p-12 rounded-3xl">

//         <h2 className="text-3xl font-black mb-10 text-center">
//           {config.title}
//         </h2>

//         <div className="space-y-10">

//           {generatedPool.map((q: any, idx: number) => (

//             <div key={idx}>

//               <p className="font-bold">
//                 Q{idx + 1}. {q.text}
//               </p>

//               <div className="grid grid-cols-2 gap-4 mt-4">

//                 {q.options.map((opt: string, i: number) => (
//                   <p key={i}>
//                     {String.fromCharCode(65 + i)}) {opt}
//                   </p>
//                 ))}

//               </div>

//             </div>

//           ))}

//         </div>

//       </Card>

//     </div>
//   )
// }


// import { useState } from "react"
// import { Card } from "@/components/ui/card"
// import {
//   ArrowLeft,
//   Printer,
//   Loader2,
//   CheckCircle2,
//   Download,
//   FileText
// } from "lucide-react"

// export function ExamDocumentPreview({
//   generatedPool,
//   config,
//   handleFinalDeploy,
//   setStep,
//   isViewOnly,
//   isPending
// }: any) {

//   const [questions, setQuestions] = useState(generatedPool)

//   // -----------------------------
//   // Update Question Text
//   // -----------------------------
//   const updateQuestion = (index: number, value: string) => {
//     const updated = [...questions]
//     updated[index].text = value
//     setQuestions(updated)
//   }

//   // -----------------------------
//   // Update Option
//   // -----------------------------
//   const updateOption = (qIndex: number, optIndex: number, value: string) => {
//     const updated = [...questions]
//     updated[qIndex].options[optIndex] = value
//     setQuestions(updated)
//   }

//   // -----------------------------
//   // Export as JSON
//   // -----------------------------
//   const exportJSON = () => {

//     const blob = new Blob(
//       [JSON.stringify(questions, null, 2)],
//       { type: "application/json" }
//     )

//     const url = URL.createObjectURL(blob)

//     const a = document.createElement("a")
//     a.href = url
//     a.download = `${config.title}-questions.json`
//     a.click()

//     URL.revokeObjectURL(url)
//   }

//   // -----------------------------
//   // Export as DOC (printable)
//   // -----------------------------
//   const exportDoc = () => {

//     const html = `
//       <html>
//       <head>
//         <title>${config.title}</title>
//       </head>
//       <body>
//         <h1>${config.title}</h1>
//         ${questions
//           .map(
//             (q: any, i: number) => `
//             <p><b>Q${i + 1}. ${q.text}</b></p>
//             ${q.options
//               .map(
//                 (opt: string, idx: number) =>
//                   `<p>${String.fromCharCode(65 + idx)}) ${opt}</p>`
//               )
//               .join("")}
//             <br/>
//           `
//           )
//           .join("")}
//       </body>
//       </html>
//     `

//     const blob = new Blob([html], { type: "application/msword" })

//     const url = URL.createObjectURL(blob)

//     const a = document.createElement("a")
//     a.href = url
//     a.download = `${config.title}.doc`
//     a.click()

//     URL.revokeObjectURL(url)
//   }

//   // -----------------------------
//   // Deploy Handler
//   // -----------------------------
//   const deployExam = () => {
//     handleFinalDeploy(questions)
//   }

//   return (
//     <div className="max-w-4xl mx-auto space-y-8 pb-20">

//       {/* Top Controls */}
//       <div className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl">

//         <button
//           onClick={() => setStep(1)}
//           className="flex items-center gap-2 text-sm"
//         >
//           <ArrowLeft className="h-3 w-3" /> Back
//         </button>

//         <div className="flex gap-3">

//           {/* Print */}
//           <button
//             onClick={() => window.print()}
//             className="p-3 bg-slate-950 rounded-xl"
//           >
//             <Printer className="h-5 w-5" />
//           </button>

//           {/* Export JSON */}
//           <button
//             onClick={exportJSON}
//             className="p-3 bg-slate-950 rounded-xl"
//           >
//             <Download className="h-5 w-5" />
//           </button>

//           {/* Export DOC */}
//           <button
//             onClick={exportDoc}
//             className="p-3 bg-slate-950 rounded-xl"
//           >
//             <FileText className="h-5 w-5" />
//           </button>

//           {/* Deploy */}
//           {!isViewOnly && (
//             <button
//               onClick={deployExam}
//               disabled={isPending}
//               className="bg-school-primary text-black px-6 py-3 rounded-xl flex items-center gap-2"
//             >
//               {isPending
//                 ? <Loader2 className="h-4 w-4 animate-spin" />
//                 : <CheckCircle2 className="h-4 w-4" />
//               }

//               Deploy Exam
//             </button>
//           )}

//         </div>
//       </div>

//       {/* Document */}
//       <Card className="bg-white text-black p-12 rounded-3xl">

//         <h2 className="text-3xl font-black mb-10 text-center">
//           {config.title}
//         </h2>

//         <div className="space-y-10">

//           {questions.map((q: any, idx: number) => (

//             <div key={idx}>

//               {/* Editable Question */}
//               {isViewOnly ? (
//                 <p className="font-bold">
//                   Q{idx + 1}. {q.text}
//                 </p>
//               ) : (
//                 <textarea
//                   className="w-full font-bold border p-2 rounded"
//                   value={q.text}
//                   onChange={(e) =>
//                     updateQuestion(idx, e.target.value)
//                   }
//                 />
//               )}

//               {/* Options */}
//               <div className="grid grid-cols-2 gap-4 mt-4">

//                 {q.options.map((opt: string, i: number) => (

//                   isViewOnly ? (

//                     <p key={i}>
//                       {String.fromCharCode(65 + i)}) {opt}
//                     </p>

//                   ) : (

//                     <input
//                       key={i}
//                       value={opt}
//                       className="border p-2 rounded"
//                       onChange={(e) =>
//                         updateOption(idx, i, e.target.value)
//                       }
//                     />

//                   )

//                 ))}

//               </div>

//             </div>

//           ))}

//         </div>

//       </Card>

//     </div>
//   )
// }






// import { useState } from "react"
// import { Card } from "@/components/ui/card"
// import {
//   ArrowLeft,
//   Printer,
//   Loader2,
//   CheckCircle2,
//   Pencil,
//   Save,
//   X
// } from "lucide-react"

// export function ExamDocumentPreview({
//   generatedPool,
//   config,
//   handleFinalDeploy,
//   setStep,
//   isViewOnly,
//   isPending
// }: any) {

//   const [questions, setQuestions] = useState(generatedPool)
//   const [editing, setEditing] = useState(false)

//   const updateQuestion = (index: number, value: string) => {
//     const updated = [...questions]
//     updated[index].text = value
//     setQuestions(updated)
//   }

//   const updateOption = (qIndex: number, optIndex: number, value: string) => {
//     const updated = [...questions]
//     updated[qIndex].options[optIndex] = value
//     setQuestions(updated)
//   }

//   const deployExam = () => {
//     handleFinalDeploy(questions)
//   }

//   return (
//     <div className="max-w-4xl mx-auto space-y-8 pb-20">

//       {/* Top Controls */}
//       <div className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl">

//         <button
//           onClick={() => setStep(1)}
//           className="flex items-center gap-2 text-sm"
//         >
//           <ArrowLeft className="h-3 w-3" /> Back
//         </button>

//         <div className="flex gap-4">

//           {/* Print */}
//           <button
//             onClick={() => window.print()}
//             className="p-3 bg-slate-950 rounded-xl"
//           >
//             <Printer className="h-5 w-5" />
//           </button>

//           {/* EDIT BUTTON */}
//           {!editing && !isViewOnly && (
//             <button
//               onClick={() => setEditing(true)}
//               className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
//             >
//               <Pencil className="h-4 w-4" />
//               Edit Exam
//             </button>
//           )}

//           {/* DEPLOY BUTTON */}
//           {!isViewOnly && (
//             <button
//               onClick={deployExam}
//               disabled={isPending}
//               className="bg-school-primary text-black px-6 py-3 rounded-xl flex items-center gap-2"
//             >
//               {isPending
//                 ? <Loader2 className="h-4 w-4 animate-spin" />
//                 : <CheckCircle2 className="h-4 w-4" />
//               }

//               Deploy Exam
//             </button>
//           )}

//           {/* SAVE / CANCEL when editing */}
//           {editing && (
//             <>
//               <button
//                 onClick={() => setEditing(false)}
//                 className="bg-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
//               >
//                 <Save className="h-4 w-4" />
//                 Save Changes
//               </button>

//               <button
//                 onClick={() => {
//                   setQuestions(generatedPool)
//                   setEditing(false)
//                 }}
//                 className="bg-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
//               >
//                 <X className="h-4 w-4" />
//                 Cancel
//               </button>
//             </>
//           )}

//         </div>
//       </div>

//       {/* Document */}
//       <Card className="bg-white text-black p-12 rounded-3xl">

//         <h2 className="text-3xl font-black mb-10 text-center">
//           {config.title}
//         </h2>

//         <div className="space-y-10">

//           {questions.map((q: any, idx: number) => (

//             <div key={idx}>

//               {editing ? (

//                 <textarea
//                   className="w-full border p-2 rounded font-bold"
//                   value={q.text}
//                   onChange={(e) =>
//                     updateQuestion(idx, e.target.value)
//                   }
//                 />

//               ) : (

//                 <p className="font-bold">
//                   Q{idx + 1}. {q.text}
//                 </p>

//               )}

//               <div className="grid grid-cols-2 gap-4 mt-4">

//                 {q.options.map((opt: string, i: number) => (

//                   editing ? (

//                     <input
//                       key={i}
//                       value={opt}
//                       className="border p-2 rounded"
//                       onChange={(e) =>
//                         updateOption(idx, i, e.target.value)
//                       }
//                     />

//                   ) : (

//                     <p key={i}>
//                       {String.fromCharCode(65 + i)}) {opt}
//                     </p>

//                   )

//                 ))}

//               </div>

//             </div>

//           ))}

//         </div>

//       </Card>

//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { Card } from "@/components/ui/card"
// import {
//   ArrowLeft,
//   Printer,
//   Loader2,
//   CheckCircle2,
//   Pencil,
//   Save,
//   X
// } from "lucide-react"
// // Import Prisma types
// import { Question } from "@prisma/client"

// // ── Utility ──────────────────────────────────────────────────────────────────

// function getErrorMessage(error: unknown): string {
//   if (error instanceof Error) return error.message;
//   if (error && typeof error === 'object' && 'message' in error) {
//     return String((error as { message?: string }).message);
//   }
//   return typeof error === 'string' ? error : "An unknown error occurred";
// }

// // ── Types ───────────────────────────────────────────────────────────────────

// /**
//  * Since Prisma's 'options' field is defined as Json, 
//  * we define a UI-specific interface to ensure the component 
//  * knows it's working with a string array.
//  */
// interface UIQuestion extends Partial<Question> {
//   text: string;
//   options: string[];
// }

// interface ExamConfig {
//   title: string;
// }

// interface ExamDocumentPreviewProps {
//   generatedPool: UIQuestion[];
//   config: ExamConfig;
//   handleFinalDeploy: (questions: UIQuestion[]) => Promise<void> | void;
//   setStep: (step: number) => void;
//   isViewOnly?: boolean;
//   isPending?: boolean;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function ExamDocumentPreview({
//   generatedPool,
//   config,
//   handleFinalDeploy,
//   setStep,
//   isViewOnly,
//   isPending
// }: ExamDocumentPreviewProps) {

//   const [questions, setQuestions] = useState<UIQuestion[]>(generatedPool)
//   const [editing, setEditing] = useState(false)

//   const updateQuestion = (index: number, value: string) => {
//     const updated = [...questions]
//     updated[index].text = value
//     setQuestions(updated)
//   }

//   const updateOption = (qIndex: number, optIndex: number, value: string) => {
//     const updated = [...questions]
//     const updatedOptions = [...updated[qIndex].options]
//     updatedOptions[optIndex] = value
//     updated[qIndex].options = updatedOptions
//     setQuestions(updated)
//   }

//   const deployExam = async () => {
//     try {
//       await handleFinalDeploy(questions)
//     } catch (err) {
//       console.error("[DEPLOY_ERROR]:", getErrorMessage(err));
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto space-y-8 pb-20">

//       {/* Top Controls */}
//       <div className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl">

//         <button
//           onClick={() => setStep(1)}
//           className="flex items-center gap-2 text-sm text-white"
//         >
//           <ArrowLeft className="h-3 w-3" /> Back
//         </button>

//         <div className="flex gap-4">

//           {/* Print */}
//           <button
//             onClick={() => window.print()}
//             className="p-3 bg-slate-950 rounded-xl text-white"
//           >
//             <Printer className="h-5 w-5" />
//           </button>

//           {/* EDIT BUTTON */}
//           {!editing && !isViewOnly && (
//             <button
//               onClick={() => setEditing(true)}
//               className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
//             >
//               <Pencil className="h-4 w-4" />
//               Edit Exam
//             </button>
//           )}

//           {/* DEPLOY BUTTON */}
//           {!isViewOnly && (
//             <button
//               onClick={deployExam}
//               disabled={isPending}
//               className="bg-school-primary text-black px-6 py-3 rounded-xl flex items-center gap-2"
//             >
//               {isPending
//                 ? <Loader2 className="h-4 w-4 animate-spin" />
//                 : <CheckCircle2 className="h-4 w-4" />
//               }
//               Deploy Exam
//             </button>
//           )}

//           {/* SAVE / CANCEL when editing */}
//           {editing && (
//             <>
//               <button
//                 onClick={() => setEditing(false)}
//                 className="bg-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
//               >
//                 <Save className="h-4 w-4" />
//                 Save Changes
//               </button>

//               <button
//                 onClick={() => {
//                   setQuestions(generatedPool)
//                   setEditing(false)
//                 }}
//                 className="bg-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
//               >
//                 <X className="h-4 w-4" />
//                 Cancel
//               </button>
//             </>
//           )}

//         </div>
//       </div>

//       {/* Document */}
//       <Card className="bg-white text-black p-12 rounded-3xl">

//         <h2 className="text-3xl font-black mb-10 text-center uppercase tracking-tighter">
//           {config.title}
//         </h2>

//         <div className="space-y-10">

//           {questions.map((q, idx) => (

//             <div key={idx}>

//               {editing ? (

//                 <textarea
//                   className="w-full border p-2 rounded font-bold"
//                   value={q.text}
//                   onChange={(e) =>
//                     updateQuestion(idx, e.target.value)
//                   }
//                 />

//               ) : (

//                 <p className="font-bold">
//                   Q{idx + 1}. {q.text}
//                 </p>

//               )}

//               <div className="grid grid-cols-2 gap-4 mt-4">

//                 {q.options.map((opt, i) => (

//                   editing ? (

//                     <input
//                       key={i}
//                       value={opt}
//                       className="border p-2 rounded"
//                       onChange={(e) =>
//                         updateOption(idx, i, e.target.value)
//                       }
//                     />

//                   ) : (

//                     <p key={i} className="text-sm">
//                       <span className="font-bold mr-2">{String.fromCharCode(65 + i)})</span>
//                       {opt}
//                     </p>

//                   )

//                 ))}

//               </div>

//             </div>

//           ))}

//         </div>

//       </Card>

//     </div>
//   )
// }



"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Printer,
  Loader2,
  CheckCircle2,
  Pencil,
  Save,
  X
} from "lucide-react";
import { Question } from "@prisma/client";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/error-handler";

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

/**
 * UI-Specific interface to handle the JSON 'options' field from Prisma.
 */
interface UIQuestion extends Partial<Question> {
  text: string;
  options: string[];
}

interface ExamConfig {
  title: string;
}

interface ExamDocumentPreviewProps {
  generatedPool: UIQuestion[];
  config: ExamConfig;
  handleFinalDeploy: (questions: UIQuestion[]) => Promise<void>;
  setStep: (step: number) => void;
  isViewOnly?: boolean;
  isPending?: boolean;
}

/**
 * EXAM DOCUMENT PREVIEW (Tier 2/3)
 * Rule 11: Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Color Flip (Purged hardcoded Slates).
 * Rule 19: Standardized Radius [2rem].
 */
export function ExamDocumentPreview({
  generatedPool,
  config,
  handleFinalDeploy,
  setStep,
  isViewOnly,
  isPending
}: ExamDocumentPreviewProps) {

  const [questions, setQuestions] = useState<UIQuestion[]>(generatedPool);
  const [editing, setEditing] = useState(false);

  const updateQuestion = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].text = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    const updatedOptions = [...updated[qIndex].options];
    updatedOptions[optIndex] = value;
    updated[qIndex].options = updatedOptions;
    setQuestions(updated);
  };

  const deployExam = async () => {
    try {
      await handleFinalDeploy(questions);
    } catch (err) {
      console.error(`[DEPLOY_FAULT]: ${getErrorMessage(err)}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── TOP CONTROLS (Rule 18) ── */}
      <div className="flex flex-wrap justify-between items-center bg-card border border-border p-4 md:p-6 rounded-[2rem] shadow-xl gap-4 no-print">

        <Button
          variant="ghost"
          onClick={() => setStep(1)}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Registry
        </Button>

        <div className="flex flex-wrap items-center gap-3">
          {/* PRINT ACTIONS */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.print()}
            className="rounded-xl border-border bg-surface text-muted-foreground hover:text-foreground"
          >
            <Printer className="h-5 w-5" />
          </Button>

          {/* EDIT TRIGGER */}
          {!editing && !isViewOnly && (
            <Button
              variant="secondary"
              onClick={() => setEditing(true)}
              className="rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest h-11 px-6"
            >
              <Pencil className="h-4 w-4" />
              Modify Logic
            </Button>
          )}

          {/* DEPLOY TRIGGER */}
          {!isViewOnly && !editing && (
            <Button
              onClick={deployExam}
              disabled={isPending}
              className="bg-school-primary text-on-school-primary rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest h-11 px-8 shadow-lg shadow-school-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Final Deployment
            </Button>
          )}

          {/* EDITING STATE ACTIONS */}
          {editing && (
            <div className="flex items-center gap-3">
              <Button
                variant="default"
                onClick={() => setEditing(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest h-11 px-6"
              >
                <Save className="h-4 w-4" />
                Commit Changes
              </Button>

              <Button
                variant="destructive"
                onClick={() => {
                  setQuestions(generatedPool);
                  setEditing(false);
                }}
                className="rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest h-11 px-6"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── DOCUMENT CANVAS (Rule 11 & 19) ── */}
      <Card className="bg-card border-border p-8 md:p-16 rounded-[2rem] shadow-2xl transition-all duration-500">
        
        <div className="mb-16 text-center space-y-4">
            <h2 className="text-2xl md:text-4xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
            {config.title}
            </h2>
            <div className="h-1 w-24 bg-school-primary mx-auto rounded-full opacity-40" />
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.3em] italic">
                Official Institutional Assessment Registry Document
            </p>
        </div>

        <div className="space-y-12">
          {questions.map((q, idx) => (
            <div key={idx} className="group relative">
              {editing ? (
                <div className="space-y-4 bg-surface p-6 rounded-2xl border border-border">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Question Text</label>
                    <textarea
                        className="w-full bg-background border-border text-foreground p-4 rounded-xl font-bold italic tracking-tight focus:ring-2 focus:ring-school-primary/20 outline-none transition-all"
                        value={q.text}
                        rows={3}
                        onChange={(e) => updateQuestion(idx, e.target.value)}
                    />
                </div>
              ) : (
                <p className="font-bold text-foreground text-lg leading-relaxed italic tracking-tight flex gap-4">
                  <span className="text-school-primary opacity-40">Q{idx + 1}.</span>
                  {q.text}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 ml-10">
                {q.options.map((opt, i) => (
                  editing ? (
                    <div key={i} className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest pl-2">Option {String.fromCharCode(65 + i)}</label>
                        <input
                            value={opt}
                            className="bg-surface border-border text-foreground p-3 rounded-xl text-sm font-semibold focus:ring-1 focus:ring-school-primary/20 outline-none transition-all"
                            onChange={(e) => updateOption(idx, i, e.target.value)}
                        />
                    </div>
                  ) : (
                    <p key={i} className="text-sm font-medium text-muted-foreground flex items-baseline gap-3">
                      <span className="font-bold text-school-primary text-xs uppercase tracking-widest">
                        {String.fromCharCode(65 + i)})
                      </span>
                      {opt}
                    </p>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .bg-card { border: none !important; box-shadow: none !important; padding: 0 !important; }
          .text-foreground { color: black !important; }
          .text-muted-foreground { color: #374151 !important; }
        }
      `}</style>
    </div>
  );
}