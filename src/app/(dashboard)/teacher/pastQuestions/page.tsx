// "use client";

// import { useState, useRef, useCallback } from "react";
// import { processPastQuestion } from "@/app/actions/processPastQuestion"

// // ─── Types ───────────────────────────────────────────────────────────────────

// type Question = {
//   number: number;
//   text: string;
//   marks?: number;
//   type?: string;
// };

// type Answer = {
//   number: number;
//   answer: string;
//   difficulty?: "easy" | "medium" | "hard";
//   keyPoints?: string[];
//   markingGuide?: string;
// };

// type Result = {
//   success: boolean;
//   subject?: string;
//   grade?: string;
//   year?: string;
//   imageUrl?: string;
//   questions?: Question[];
//   answers?: Answer[];
//   error?: string;
// };

// // ─── Icons (unchanged) ───────────────────────────────────────────────────────

// const UploadIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//     <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
//     <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round"/>
//     <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round"/>
//   </svg>
// );

// // (Other icons remain unchanged...)

// const difficultyConfig = {
//   easy:   { label: "Easy",   bg: "#dcfce7", color: "#166534" },
//   medium: { label: "Medium", bg: "#fef9c3", color: "#854d0e" },
//   hard:   { label: "Hard",   bg: "#fee2e2", color: "#991b1b" },
// };

// function DifficultyBadge({ level }: { level?: "easy" | "medium" | "hard" }) {
//   const config = difficultyConfig[level ?? "medium"];
//   return (
//     <span style={{
//       fontSize: 11,
//       fontWeight: 500,
//       padding: "2px 8px",
//       borderRadius: 999,
//       background: config.bg,
//       color: config.color,
//     }}>
//       {config.label}
//     </span>
//   );
// }

// // ─── Question Card ───────────────────────────────────────────────────────────

// function QuestionCard({
//   question,
//   answer,
//   index,
// }: {
//   question: Question;
//   answer: Answer | null;
//   index: number;
// }) {
//   const [open, setOpen] = useState<boolean>(index === 0);

//   return (
//     <div>
//       {/* Same JSX as before */}
//     </div>
//   );
// }

// // ─── Processing Steps ─────────────────────────────────────────────────────────

// type StepId = "upload" | "ocr" | "answers";

// function ProcessingSteps({ currentStep }: { currentStep: StepId }) {
//   const steps = [
//     { id: "upload", label: "Uploading image" },
//     { id: "ocr", label: "Reading questions" },
//     { id: "answers", label: "Generating answers" },
//   ] as const;

//   const stepIndex = steps.findIndex((s) => s.id === currentStep);

//   return <div>{/* same JSX */}</div>;
// }

// // ─── Main Page ───────────────────────────────────────────────────────────────

// export default function PastQuestionsPage() {
//   const [dragOver, setDragOver] = useState<boolean>(false);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [file, setFile] = useState<File | null>(null);
//   const [processingStep, setStep] = useState<StepId | null>(null);
//   const [result, setResult] = useState<Result | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const cameraInputRef = useRef<HTMLInputElement | null>(null);

//   // ── File handler ───────────────────────────────────────────────────────────

//   const handleFile = useCallback((selectedFile: File | null) => {
//     if (!selectedFile) return;

//     setFile(selectedFile);
//     setResult(null);
//     setError(null);

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const result = e.target?.result;
//       if (typeof result === "string") {
//         setPreview(result);
//       }
//     };
//     reader.readAsDataURL(selectedFile);
//   }, []);

//   const onDrop = useCallback(
//     (e: React.DragEvent<HTMLDivElement>) => {
//       e.preventDefault();
//       setDragOver(false);
//       handleFile(e.dataTransfer.files[0] ?? null);
//     },
//     [handleFile]
//   );

//   // ── Process ────────────────────────────────────────────────────────────────

//   const handleProcess = async () => {
//     if (!file) return;

//     setError(null);
//     setResult(null);

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       setStep("upload");
//       await new Promise((r) => setTimeout(r, 600));

//       setStep("ocr");
//       const promise = processPastQuestion(formData);

//       await new Promise((r) => setTimeout(r, 2500));
//       setStep("answers");
//       if (!promise) return

//       const data: Result = await promise;

//       if (!data.success) {
//         setError(data.error ?? "Something went wrong.");
//       } else {
//         setResult(data);
//       }
//     } catch (err: any) {
//       setError(err.message ?? "Network error. Please try again.");
//     } finally {
//       setStep(null);
//     }
//   };

//   const reset = () => {
//     setFile(null);
//     setPreview(null);
//     setResult(null);
//     setError(null);
//     setStep(null);
//   };

//   // ── Merge logic ────────────────────────────────────────────────────────────

//   const pairs =
//     result?.questions?.map((q) => ({
//       question: q,
//       answer: result.answers?.find((a) => a.number === q.number) ?? null,
//     })) ?? [];

//   // ── JSX (unchanged) ────────────────────────────────────────────────────────

//   return (
//     <div className="p-8 bg-slate-950 min-h-screen">
//        <PastQuestionResult 
//          result={result} 
//          onReset={reset} 
//        />
//     </div>
//   );
// }

// "use client";

// import { useState, useRef, useCallback } from "react";
// import { processPastQuestion } from "@/app/actions/processPastQuestion";
// import { PastQuestionResult } from "@/components/teacherDashboard/exams/pastQuestionProcess";
// import { 
//   Loader2, Camera, Image as ImageIcon, 
//   X, Sparkles, Upload, AlertCircle, CheckCircle2,
//   Clock, Zap, FileText
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// // ─── Types ───────────────────────────────────────────────────────────────────

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
//   imageUrl?: string;
//   questions?: Question[];
//   answers?: Answer[];
//   error?: string;
// }

// type StepId = "upload" | "ocr" | "answers";

// // ─── Sub-Components ──────────────────────────────────────────────────────────

// function ProcessingSteps({ currentStep }: { currentStep: StepId }) {
//   const steps = [
//     { id: "upload", label: "Registry Upload", icon: Upload },
//     { id: "ocr", label: "AI Vision Scan", icon: FileText },
//     { id: "answers", label: "Syllabus Matching", icon: Zap },
//   ] as const;

//   return (
//     <div className="flex flex-col items-center space-y-8 w-full max-w-xs mx-auto">
//       {steps.map((s, idx) => {
//         const isActive = s.id === currentStep;
//         const isDone = steps.findIndex(x => x.id === currentStep) > idx;
//         const Icon = s.icon;

//         return (
//           <div key={s.id} className="flex items-center gap-4 w-full group">
//             <div className={cn(
//                 "h-10 w-10 rounded-xl border flex items-center justify-center transition-all duration-500",
//                 isActive ? "bg-school-primary border-school-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" : 
//                 isDone ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-500" : "bg-slate-900 border-white/5 text-slate-700"
//             )}>
//               {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Icon className={cn("h-5 w-5", isActive ? "text-slate-950" : "")} />}
//             </div>
//             <p className={cn(
//                 "text-[10px] font-black uppercase tracking-widest",
//                 isActive ? "text-white" : isDone ? "text-emerald-500" : "text-slate-700"
//             )}>
//               {s.label}
//             </p>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // ─── Main Page ───────────────────────────────────────────────────────────────

// export default function PastQuestionsPage() {
//   const [dragOver, setDragOver] = useState<boolean>(false);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [file, setFile] = useState<File | null>(null);
//   const [processingStep, setStep] = useState<StepId | null>(null);
//   const [result, setResult] = useState<Result | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const cameraInputRef = useRef<HTMLInputElement>(null);

//   const handleFile = useCallback((selectedFile: File | null) => {
//     if (!selectedFile) return;
//     setFile(selectedFile);
//     setResult(null);
//     setError(null);

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const res = e.target?.result;
//       if (typeof res === "string") setPreview(res);
//     };
//     reader.readAsDataURL(selectedFile);
//   }, []);

//   const handleProcess = async () => {
//     if (!file) return;
//     setError(null);
//     setResult(null);

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       setStep("upload");
//       await new Promise((r) => setTimeout(r, 800));

//       setStep("ocr");
//       const res = await processPastQuestion(formData);

//       await new Promise((r) => setTimeout(r, 1200));
//       setStep("answers");

//       if (!res.success) {
//         setError(res.error ?? "The AI could not parse this image. Please ensure it is clear.");
//       } else {
//         setResult(res as Result);
//       }
//     } catch (err: unknown) {
//       const msg = err instanceof Error ? err.message : "Internal synthesis error.";
//       setError(msg);
//     } finally {
//       setStep(null);
//     }
//   };

//   const reset = () => {
//     setFile(null);
//     setPreview(null);
//     setResult(null);
//     setError(null);
//     setStep(null);
//   };

//   // ── Render Logic ──

//   if (result) {
//     return <PastQuestionResult result={result} onReset={reset} />;
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 p-4 md:p-8 lg:p-12 text-slate-50">
//       <div className="max-w-4xl mx-auto space-y-10">
        
//         {/* Header */}
//         <header className="flex items-center gap-5 border-b border-white/5 pb-10">
//           <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
//             <Sparkles className="h-7 w-7 text-school-primary" />
//           </div>
//           <div>
//             <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Vision Architect</h1>
//             <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide uppercase">AI Image-to-Syllabus Processing Unit.</p>
//           </div>
//         </header>

//         {processingStep ? (
//           /* PROCESSING STATE */
//           <div className="py-20 animate-in fade-in zoom-in-95 duration-500">
//             <div className="text-center mb-12 space-y-4">
//                <Loader2 className="h-12 w-12 animate-spin text-school-primary mx-auto" />
//                <h2 className="text-xl font-black uppercase italic text-white tracking-widest">Processing Registry Assets</h2>
//                <p className="text-slate-600 text-xs uppercase font-bold tracking-[0.3em]">Institutional AI Logic is Active</p>
//             </div>
//             <ProcessingSteps currentStep={processingStep} />
//           </div>
//         ) : (
//           /* UPLOAD STATE */
//           <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
//             <div 
//               onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//               onDragLeave={() => setDragOver(false)}
//               onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
//               className={cn(
//                 "relative group overflow-hidden rounded-[3rem] border-2 border-dashed transition-all duration-500",
//                 dragOver ? "bg-school-primary/5 border-school-primary" : "bg-slate-900/50 border-white/5 hover:border-white/10"
//               )}
//             >
//               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] || null)} />
//               <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={(e) => handleFile(e.target.files?.[0] || null)} />

//               <div className="p-12 md:p-20 text-center space-y-6">
//                 {preview ? (
//                   <div className="relative inline-block group/preview">
//                     <img src={preview} alt="Preview" className="h-64 rounded-3xl object-cover shadow-2xl border-4 border-slate-950" />
//                     <button onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }} className="absolute -top-3 -right-3 bg-red-500 p-2 rounded-full shadow-xl hover:scale-110 transition-transform">
//                         <X className="h-4 w-4 text-white" />
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     <div className="h-20 w-20 bg-slate-950 rounded-3xl flex items-center justify-center mx-auto border border-white/5 group-hover:border-school-primary/30 transition-all">
//                       <ImageIcon className="h-10 w-10 text-slate-700 group-hover:text-school-primary" />
//                     </div>
//                     <div className="space-y-2">
//                         <h3 className="text-xl font-black uppercase text-white tracking-widest italic">Initialize Data Scan</h3>
//                         <p className="text-slate-500 text-xs font-medium uppercase tracking-widest max-w-xs mx-auto leading-loose">
//                             Drag & drop an image of a handwritten or printed question paper to start AI synthesis.
//                         </p>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex flex-wrap justify-center gap-4 pt-6">
//                   <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="rounded-xl border-white/10 text-slate-400 font-bold uppercase text-[10px]">
//                     <Upload className="mr-2 h-4 w-4" /> Select File
//                   </Button>
//                   <Button onClick={() => cameraInputRef.current?.click()} variant="outline" className="rounded-xl border-white/10 text-slate-400 font-bold uppercase text-[10px]">
//                     <Camera className="mr-2 h-4 w-4" /> Capture Photo
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             {error && (
//               <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 animate-in shake duration-500">
//                 <AlertCircle className="h-5 w-5 shrink-0" />
//                 <p className="text-xs font-black uppercase tracking-widest">{error}</p>
//               </div>
//             )}

//             <Button 
//               onClick={handleProcess} 
//               disabled={!file}
//               className="w-full bg-school-primary text-slate-950 font-black py-8 rounded-[2.5rem] shadow-xl shadow-school-primary/10 text-xs uppercase tracking-[0.3em] disabled:opacity-20 hover:scale-[1.01] active:scale-95 transition-all"
//             >
//               Analyze & Generate Solutions
//             </Button>
//           </div>
//         )}

//         {/* Support Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-30 group hover:opacity-100 transition-opacity">
//            <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 flex items-center gap-4">
//               <Zap className="h-6 w-6 text-school-primary" />
//               <p className="text-[10px] font-bold uppercase tracking-tighter">Nigerian Curriculum Optimized</p>
//            </div>
//            <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 flex items-center gap-4">
//               <Clock className="h-6 w-6 text-school-primary" />
//               <p className="text-[10px] font-bold uppercase tracking-tighter">Instant Automated Marking Guides</p>
//            </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image"; // Import Next.js Image
import { processPastQuestion } from "@/app/actions/processPastQuestion";
import { PastQuestionResult } from "@/components/TeacherDashboard/exams/pastQuestionProcess";
import { 
  Loader2, Camera, Image as ImageIcon, 
  X, Sparkles, Upload, AlertCircle, CheckCircle2,
  Clock, Zap, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Utility ──────────────────────────────────────────────────────────────────

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return typeof error === 'string' ? error : "An unknown error occurred";
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface QuestionData {
  number: number;
  text: string;
  marks?: number;
  type?: string;
}

interface AnswerData {
  number: number;
  answer: string;
  difficulty?: "easy" | "medium" | "hard";
  keyPoints?: string[];
  markingGuide?: string;
}

// Strictly typed Result based on server action expectations
interface Result {
  success: boolean;
  subject?: string;
  grade?: string;
  year?: string;
  imageUrl?: string;
  questions?: QuestionData[];
  answers?: AnswerData[];
  error?: string;
}

type StepId = "upload" | "ocr" | "answers";

// ─── Sub-Components ──────────────────────────────────────────────────────────

function ProcessingSteps({ currentStep }: { currentStep: StepId }) {
  const steps = [
    { id: "upload", label: "Registry Upload", icon: Upload },
    { id: "ocr", label: "AI Vision Scan", icon: FileText },
    { id: "answers", label: "Syllabus Matching", icon: Zap },
  ] as const;

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-xs mx-auto">
      {steps.map((s, idx) => {
        const isActive = s.id === currentStep;
        const isDone = steps.findIndex(x => x.id === currentStep) > idx;
        const Icon = s.icon;

        return (
          <div key={s.id} className="flex items-center gap-4 w-full group">
            <div className={cn(
                "h-10 w-10 rounded-xl border flex items-center justify-center transition-all duration-500",
                isActive ? "bg-school-primary border-school-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" : 
                isDone ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-500" : "bg-slate-900 border-white/5 text-slate-700"
            )}>
              {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Icon className={cn("h-5 w-5", isActive ? "text-slate-950" : "")} />}
            </div>
            <p className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                isActive ? "text-white" : isDone ? "text-emerald-500" : "text-slate-700"
            )}>
              {s.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function PastQuestionsPage() {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [processingStep, setStep] = useState<StepId | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selectedFile: File | null) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setResult(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result;
      if (typeof res === "string") setPreview(res);
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  const handleProcess = async () => {
    if (!file) return;
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      setStep("upload");
      await new Promise((r) => setTimeout(r, 800));

      setStep("ocr");
      // Use cast to our local Result interface
      const res = await processPastQuestion(formData) as Result;

      await new Promise((r) => setTimeout(r, 1200));
      setStep("answers");

      if (!res.success) {
        setError(res.error ?? "The AI could not parse this image. Please ensure it is clear.");
      } else {
        setResult(res);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
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

  // ── Render Logic ──

  if (result) {
    return <PastQuestionResult result={result} onReset={reset} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 lg:p-12 text-slate-50">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex items-center gap-5 border-b border-white/5 pb-10">
          <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
            <Sparkles className="h-7 w-7 text-school-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Vision Architect</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide uppercase">AI Image-to-Syllabus Processing Unit.</p>
          </div>
        </header>

        {processingStep ? (
          /* PROCESSING STATE */
          <div className="py-20 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center mb-12 space-y-4">
               <Loader2 className="h-12 w-12 animate-spin text-school-primary mx-auto" />
               <h2 className="text-xl font-black uppercase italic text-white tracking-widest">Processing Registry Assets</h2>
               <p className="text-slate-600 text-xs uppercase font-bold tracking-[0.3em]">Institutional AI Logic is Active</p>
            </div>
            <ProcessingSteps currentStep={processingStep} />
          </div>
        ) : (
          /* UPLOAD STATE */
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              className={cn(
                "relative group overflow-hidden rounded-[3rem] border-2 border-dashed transition-all duration-500",
                dragOver ? "bg-school-primary/5 border-school-primary" : "bg-slate-900/50 border-white/5 hover:border-white/10"
              )}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] || null)} />
              <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={(e) => handleFile(e.target.files?.[0] || null)} />

              <div className="p-12 md:p-20 text-center space-y-6">
                {preview ? (
                  <div className="relative inline-block group/preview">
                    {/* FIXED: Replaced <img> with Next.js <Image /> */}
                    <Image 
                      src={preview} 
                      alt="Preview" 
                      width={500}
                      height={256}
                      unoptimized // Necessary for data URLs/local blobs
                      className="h-64 w-auto rounded-3xl object-cover shadow-2xl border-4 border-slate-950" 
                    />
                    <button onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }} className="absolute -top-3 -right-3 bg-red-500 p-2 rounded-full shadow-xl hover:scale-110 transition-transform">
                        <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="h-20 w-20 bg-slate-950 rounded-3xl flex items-center justify-center mx-auto border border-white/5 group-hover:border-school-primary/30 transition-all">
                      <ImageIcon className="h-10 w-10 text-slate-700 group-hover:text-school-primary" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black uppercase text-white tracking-widest italic">Initialize Data Scan</h3>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-widest max-w-xs mx-auto leading-loose">
                            Drag & drop an image of a handwritten or printed question paper to start AI synthesis.
                        </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-4 pt-6">
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="rounded-xl border-white/10 text-slate-400 font-bold uppercase text-[10px]">
                    <Upload className="mr-2 h-4 w-4" /> Select File
                  </Button>
                  <Button onClick={() => cameraInputRef.current?.click()} variant="outline" className="rounded-xl border-white/10 text-slate-400 font-bold uppercase text-[10px]">
                    <Camera className="mr-2 h-4 w-4" /> Capture Photo
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 animate-in shake duration-500">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-xs font-black uppercase tracking-widest">{error}</p>
              </div>
            )}

            <Button 
              onClick={handleProcess} 
              disabled={!file}
              className="w-full bg-school-primary text-slate-950 font-black py-8 rounded-[2.5rem] shadow-xl shadow-school-primary/10 text-xs uppercase tracking-[0.3em] disabled:opacity-20 hover:scale-[1.01] active:scale-95 transition-all"
            >
              Analyze & Generate Solutions
            </Button>
          </div>
        )}

        {/* Support Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-30 group hover:opacity-100 transition-opacity">
           <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 flex items-center gap-4">
              <Zap className="h-6 w-6 text-school-primary" />
              <p className="text-[10px] font-bold uppercase tracking-tighter">Nigerian Curriculum Optimized</p>
           </div>
           <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 flex items-center gap-4">
              <Clock className="h-6 w-6 text-school-primary" />
              <p className="text-[10px] font-bold uppercase tracking-tighter">Instant Automated Marking Guides</p>
           </div>
        </div>
      </div>
    </div>
  );
}