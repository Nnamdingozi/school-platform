
// "use client";

// import { useState } from "react";
// import { useExamTimer } from "@/hooks/useExamTimer";

// type Props = {
//   exam: any;
// };

// export default function ExamClient({ exam }: Props) {
//   const { timeLeft, status } = useExamTimer(exam.startTime, exam.duration);

//   const [answers, setAnswers] = useState<Record<string, string>>({});

//   const formatTime = (seconds: number) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m}:${s.toString().padStart(2, "0")}`;
//   };

//   // ---------------- ACCESS CONTROL ----------------
//   if (status === "waiting") {
//     return (
//       <div className="p-10 text-center text-white">
//         <h1 className="text-2xl font-bold">Exam Not Started</h1>
//         <p>Starts at: {new Date(exam.startTime).toLocaleString()}</p>
//       </div>
//     );
//   }

//   if (status === "ended") {
//     return (
//       <div className="p-10 text-center text-red-500">
//         <h1 className="text-2xl font-bold">Exam Ended</h1>
//       </div>
//     );
//   }

//   // ---------------- ACTIVE EXAM ----------------
//   return (
//     <div className="p-6 space-y-6 text-white bg-slate-950 min-h-screen">

//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-xl font-bold">{exam.title}</h1>

//         <div className="bg-red-600 px-4 py-2 rounded-lg font-bold">
//           ⏱ {formatTime(timeLeft)}
//         </div>
//       </div>

//       {/* QUESTIONS */}
//       <div className="space-y-6">
//         {exam.questions.map((q: any, index: number) => (
//           <div key={q.id} className="bg-slate-900 p-4 rounded-lg space-y-3">

//             <p className="font-bold">
//               {index + 1}. {q.text}
//             </p>

//             <div className="space-y-2">
//               {q.options.map((opt: string) => (
//                 <label
//                   key={opt}
//                   className="flex items-center gap-2 cursor-pointer"
//                 >
//                   <input
//                     type="radio"
//                     name={q.id}
//                     value={opt}
//                     onChange={() =>
//                       setAnswers((prev) => ({
//                         ...prev,
//                         [q.id]: opt,
//                       }))
//                     }
//                   />
//                   {opt}
//                 </label>
//               ))}
//             </div>

//           </div>
//         ))}
//       </div>

//       {/* SUBMIT */}
//       <button
//         className="bg-green-600 px-6 py-3 rounded-lg font-bold"
//         onClick={() => console.log("submit", answers)}
//       >
//         Submit Exam
//       </button>
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import { useExamTimer } from "@/hooks/useExamTimer";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { 
//   Timer, ShieldCheck, AlertCircle, 
//   CheckCircle2, Zap 
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface ExamQuestion {
//   id: string;
//   text: string;
//   options: string[];
// }

// interface ExamData {
//   id: string;
//   title: string;
//   startTime: Date | string;
//   duration: number;
//   questions: ExamQuestion[];
// }

// interface ExamClientProps {
//   exam: ExamData;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function ExamClient({ exam }: ExamClientProps) {
//   // Use custom hook for synchronization
//   const { timeLeft, status } = useExamTimer(exam.startTime, exam.duration);
//   const [answers, setAnswers] = useState<Record<string, string>>({});

//   const formatTime = (seconds: number): string => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m}:${s.toString().padStart(2, "0")}`;
//   };

//   const handleOptionChange = (questionId: string, option: string) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionId]: option,
//     }));
//   };

//   // ── Access Control: Waiting State ──
//   if (status === "waiting") {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
//         <div className="h-20 w-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-8 border border-white/5 animate-pulse">
//             <Timer className="h-10 w-10 text-school-primary" />
//         </div>
//         <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
//             Session Locked
//         </h1>
//         <p className="text-slate-500 text-sm mt-2 max-w-xs uppercase tracking-widest leading-relaxed">
//             Exam is scheduled for: <br/>
//             <span className="text-school-primary font-bold">{new Date(exam.startTime).toLocaleString()}</span>
//         </p>
//       </div>
//     );
//   }

//   // ── Access Control: Ended State ──
//   if (status === "ended") {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
//         <AlertCircle className="h-16 w-16 text-red-500/20 mb-6" />
//         <h1 className="text-2xl font-black text-white uppercase italic">Session Terminated</h1>
//         <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">
//             The allotted time for this assessment has expired.
//         </p>
//         <Button variant="outline" className="mt-8 border-white/10 text-slate-400 rounded-xl px-10 h-12 uppercase text-[10px] font-black">
//             Return to Dashboard
//         </Button>
//       </div>
//     );
//   }

//   // ── Active Exam View ──
//   return (
//     <div className="p-4 md:p-8 bg-slate-950 min-h-screen text-slate-50">
//       <div className="max-w-4xl mx-auto space-y-10 pb-32">
        
//         {/* FIXED HEADER */}
//         <header className="sticky top-4 z-40 bg-slate-900/80 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] shadow-2xl flex justify-between items-center">
//           <div className="flex items-center gap-4">
//              <div className="h-10 w-10 bg-school-primary/10 rounded-xl flex items-center justify-center border border-school-primary/20">
//                 <ShieldCheck className="h-5 w-5 text-school-primary" />
//              </div>
//              <div>
//                 <h1 className="text-lg font-black text-white uppercase italic tracking-tight leading-none">
//                     {exam.title}
//                 </h1>
//                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
//                     Identity Verified • Institutional Assessment
//                 </p>
//              </div>
//           </div>

//           <div className={cn(
//               "px-6 py-2.5 rounded-xl font-black text-sm tabular-nums border transition-colors",
//               timeLeft < 300 ? "bg-red-500/10 border-red-500 text-red-500 animate-pulse" : "bg-slate-950 border-white/10 text-school-primary"
//           )}>
//             ⏱ {formatTime(timeLeft)}
//           </div>
//         </header>

//         {/* QUESTION POOL */}
//         <div className="space-y-6">
//           {exam.questions.map((q: ExamQuestion, index: number) => (
//             <Card key={q.id} className="bg-slate-900 border-white/5 rounded-[2.5rem] shadow-xl overflow-hidden group hover:border-white/10 transition-all">
//               <CardContent className="p-8 space-y-8">
//                 <div className="flex gap-4">
//                   <span className="font-black text-xl text-school-primary/30 mt-1 italic">
//                     {index + 1 < 10 ? `0${index + 1}` : index + 1}
//                   </span>
//                   <p className="text-xl font-bold text-white leading-snug tracking-tight">
//                     {q.text}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
//                   {q.options.map((opt: string, i: number) => (
//                     <label
//                       key={opt}
//                       className={cn(
//                           "relative flex items-center p-5 rounded-2xl border cursor-pointer transition-all active:scale-95 group/option",
//                           answers[q.id] === opt 
//                             ? "bg-school-primary border-school-primary text-slate-950 shadow-lg" 
//                             : "bg-slate-950 border-white/5 text-slate-500 hover:border-white/10"
//                       )}
//                     >
//                       <input
//                         type="radio"
//                         name={q.id}
//                         value={opt}
//                         className="sr-only" // Hidden visually, accessible via label
//                         checked={answers[q.id] === opt}
//                         onChange={() => handleOptionChange(q.id, opt)}
//                       />
//                       <span className={cn(
//                           "mr-3 text-[10px] font-black opacity-40",
//                           answers[q.id] === opt ? "text-slate-950" : "text-slate-500"
//                       )}>
//                         {String.fromCharCode(65 + i)}
//                       </span>
//                       <span className="text-sm font-bold uppercase tracking-tight">{opt}</span>
                      
//                       {answers[q.id] === opt && (
//                           <div className="ml-auto">
//                               <CheckCircle2 className="h-4 w-4" />
//                           </div>
//                       )}
//                     </label>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* SUBMISSION ACTION */}
//         <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xs px-4 no-print">
//             <Button
//                 size="lg"
//                 className="w-full bg-school-primary text-slate-950 font-black py-8 rounded-2xl shadow-2xl hover:scale-[1.03] transition-all uppercase text-[11px] tracking-[0.2em] group"
//                 onClick={() => console.log("Registry Submission:", answers)}
//             >
//                 Finalize Registry Entry <Zap className="ml-2 h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
//             </Button>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { useExamTimer } from "@/hooks/useExamTimer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Timer, ShieldCheck, AlertCircle, 
  CheckCircle2, Zap 
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Utility ──────────────────────────────────────────────────────────────────

/**
 * Safely extracts a message from an unknown error type
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: string }).message);
  }
  return typeof error === 'string' ? error : "An unknown error occurred";
}

// ── Types ───────────────────────────────────────────────────────────────────

interface ExamQuestion {
  id: string;
  text: string;
  options: string[];
}

/**
 * Strictly defines the payload returned by the student exam action.
 * Uses 'Date' for startTime as provided by Prisma.
 */
export interface StudentExamPayload {
  id: string;
  title: string;
  startTime: Date | null;
  duration: number;
  questions: ExamQuestion[];
}

interface ExamClientProps {
  exam: StudentExamPayload;
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function ExamClient({ exam }: ExamClientProps) {
  /**
   * RECONCILIATION: Convert Date to ISO string to satisfy the 
   * useExamTimer hook's parameter type.
   */
  const startTimeISO = exam.startTime 
    ? exam.startTime.toISOString() 
    : new Date().toISOString();

  const { timeLeft, status } = useExamTimer(startTimeISO, exam.duration);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleOptionChange = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleFinalSubmit = () => {
    try {
      console.log("Registry Submission Payload:", {
        examId: exam.id,
        answers: Object.entries(answers).map(([qId, ans]) => ({
          questionId: qId,
          selectedAnswer: ans
        }))
      });
    } catch (error) {
      console.error("[SUBMISSION_ERROR]:", getErrorMessage(error));
    }
  };

  // ── Access Control: Waiting State ──
  if (status === "waiting") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
        <div className="h-20 w-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-8 border border-white/5 animate-pulse">
            <Timer className="h-10 w-10 text-school-primary" />
        </div>
        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Session Locked
        </h1>
        <p className="text-slate-500 text-sm mt-2 max-w-xs uppercase tracking-widest leading-relaxed">
            Exam is scheduled for: <br/>
            <span className="text-school-primary font-bold">
                {exam.startTime ? exam.startTime.toLocaleString() : "TBD"}
            </span>
        </p>
      </div>
    );
  }

  // ── Access Control: Ended State ──
  if (status === "ended") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
        <AlertCircle className="h-16 w-16 text-red-500/20 mb-6" />
        <h1 className="text-2xl font-black text-white uppercase italic">Session Terminated</h1>
        <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">
            The allotted time for this assessment has expired.
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = "/student/dashboard"}
          className="mt-8 border-white/10 text-slate-400 rounded-xl px-10 h-12 uppercase text-[10px] font-black"
        >
            Return to Dashboard
        </Button>
      </div>
    );
  }

  // ── Active Exam View ──
  return (
    <div className="p-4 md:p-8 bg-slate-950 min-h-screen text-slate-50">
      <div className="max-w-4xl mx-auto space-y-10 pb-32">
        
        {/* FIXED HEADER */}
        <header className="sticky top-4 z-40 bg-slate-900/80 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] shadow-2xl flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 bg-school-primary/10 rounded-xl flex items-center justify-center border border-school-primary/20">
                <ShieldCheck className="h-5 w-5 text-school-primary" />
             </div>
             <div>
                <h1 className="text-lg font-black text-white uppercase italic tracking-tight leading-none">
                    {exam.title}
                </h1>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
                    Identity Verified • Institutional Assessment
                </p>
             </div>
          </div>

          <div className={cn(
              "px-6 py-2.5 rounded-xl font-black text-sm tabular-nums border transition-colors",
              timeLeft < 300 ? "bg-red-500/10 border-red-500 text-red-500 animate-pulse" : "bg-slate-950 border-white/10 text-school-primary"
          )}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </header>

        {/* QUESTION POOL */}
        <div className="space-y-6">
          {exam.questions.map((q, index) => (
            <Card key={q.id} className="bg-slate-900 border-white/5 rounded-[2.5rem] shadow-xl overflow-hidden group hover:border-white/10 transition-all">
              <CardContent className="p-8 space-y-8">
                <div className="flex gap-4">
                  <span className="font-black text-xl text-school-primary/30 mt-1 italic">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>
                  <p className="text-xl font-bold text-white leading-snug tracking-tight">
                    {q.text}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
                  {q.options.map((opt, i) => (
                    <label
                      key={`${q.id}-${i}`}
                      className={cn(
                          "relative flex items-center p-5 rounded-2xl border cursor-pointer transition-all active:scale-95 group/option",
                          answers[q.id] === opt 
                            ? "bg-school-primary border-school-primary text-slate-950 shadow-lg" 
                            : "bg-slate-950 border-white/5 text-slate-500 hover:border-white/10"
                      )}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        className="sr-only"
                        checked={answers[q.id] === opt}
                        onChange={() => handleOptionChange(q.id, opt)}
                      />
                      <span className={cn(
                          "mr-3 text-[10px] font-black opacity-40",
                          answers[q.id] === opt ? "text-slate-950" : "text-slate-500"
                      )}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm font-bold uppercase tracking-tight">{opt}</span>
                      
                      {answers[q.id] === opt && (
                          <div className="ml-auto">
                              <CheckCircle2 className="h-4 w-4" />
                          </div>
                      )}
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SUBMISSION ACTION */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xs px-4 no-print">
            <Button
                size="lg"
                className="w-full bg-school-primary text-slate-950 font-black py-8 rounded-2xl shadow-2xl hover:scale-[1.03] transition-all uppercase text-[11px] tracking-[0.2em] group"
                onClick={handleFinalSubmit}
            >
                Finalize Registry Entry <Zap className="ml-2 h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
            </Button>
        </div>
      </div>
    </div>
  );
}