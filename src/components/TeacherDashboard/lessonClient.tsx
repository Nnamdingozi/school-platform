// 'use client'

// import { useState } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { generateTopicContent, type EnhancedLessonContent } from "@/app/actions/ai-generator"
// import { getScannedQuestions } from "@/app/actions/scanned-question-bank"
// import { getLessonForTeacher } from "@/app/actions/lesson.actions"
// import { ArrowLeft, BookOpen, Loader2, Sparkles, ShieldCheck } from "lucide-react"
// import Link from "next/link"
// import { Badge } from "@/components/ui/badge"
// import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner"
// import { toast } from "sonner"
// import { getErrorMessage } from "@/lib/error-handler"
// import { Question, Role, GlobalLesson } from "@prisma/client"

// interface LessonStudioClientProps {
//   topicId: string;
//   initialLesson: any; 
//   initialScannedQuestions: Question[];
// }

// /**
//  * INSTITUTIONAL LESSON STUDIO (Tier 2/3)
//  * Rule 17: Leverages Zustand for branding context and session data.
//  * Rule 14: Optimistic state updates after AI synthesis.
//  */
// export function LessonStudioClient({ topicId, initialLesson, initialScannedQuestions }: LessonStudioClientProps) {
//   const { profile } = useProfileStore();
  
//   // Local state for interactive synthesis flow
//   const [lessonContent, setLessonContent] = useState<EnhancedLessonContent | null>(
//     initialLesson?.customContent as EnhancedLessonContent ?? null
//   );
//   const [scannedQuestions, setScannedQuestions] = useState<Question[]>(initialScannedQuestions);
//   const [isGenerating, setIsGenerating] = useState(false);

//   const userId = profile?.id ?? "";
//   const schoolId = profile?.schoolId ?? null;
//   const userRole = profile?.role ?? Role.TEACHER;
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   /**
//    * Rule 11: System Truth Re-Sync
//    * Re-fetches database state after AI generation is complete.
//    */
//   const refreshStudio = async () => {
//     try {
//         const [lRes, qRes] = await Promise.all([
//             getLessonForTeacher(topicId, schoolId ?? ""),
//             getScannedQuestions({ topicId, schoolId, userId })
//         ]);
//         if (lRes.success && lRes.data) {
//             setLessonContent(lRes.data.customContent as unknown as  EnhancedLessonContent);
//         }
//         setScannedQuestions(qRes);
//     } catch (err) {
//         console.error("Studio Sync Error:", err);
//     }
//   };

//   const handleGenerate = async () => {
//     if (!userId) return toast.error("Session Identification Required");

//     setIsGenerating(true);
//     try {
//       // Rule 8: Trigger Tiered AI Synthesis
//       const res = await generateTopicContent({ 
//           topicId, 
//           userId, 
//           schoolId, 
//           userRole: userRole as Role 
//       });

//       if (res.success) {
//         toast.success("AI Synthesis Complete. Hydrating Registry...");
//         await refreshStudio();
//       } else {
//         toast.error(res.error || "Synthesis failed.");
//       }
//     } catch (err: unknown) {
//       toast.error(getErrorMessage(err));
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8 bg-slate-950 min-h-screen text-white animate-in fade-in duration-700">
      
//       {/* ── HEADER ── */}
//       <header className="space-y-6">
//         <Link 
//             href={userRole === Role.STUDENT ? "/student" : "/teacher"} 
//             className="text-slate-500 hover:text-white text-[10px] font-black uppercase flex items-center gap-2 transition-all w-fit tracking-widest"
//         >
//           <ArrowLeft className="h-3.5 w-3.5" /> Return to Hub
//         </Link>

//         <div className="flex items-center justify-between border-b border-white/5 pb-8">
//           <div className="flex items-center gap-5">
//             <div 
//                 className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
//                 style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
//             >
//               <BookOpen className="h-7 w-7" style={{ color: primaryColor }} />
//             </div>
//             <div>
//               <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Studio Console</h1>
//               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Registry Module Architecture</p>
//             </div>
//           </div>
          
//           <div className="hidden md:flex items-center gap-3 bg-slate-900 px-5 py-2 rounded-2xl border border-white/5">
//               <ShieldCheck className="h-4 w-4" style={{ color: primaryColor }} />
//               <span className="text-[9px] font-black uppercase tracking-widest text-white">Logic Node Active</span>
//           </div>
//         </div>
//       </header>

//       {/* ── MAIN WORKSPACE ── */}
//       <main className="max-w-5xl mx-auto">
//         {!lessonContent ? (
//           <div className="text-center py-32 bg-slate-900/50 rounded-[3.5rem] border border-white/5 space-y-8 shadow-2xl animate-in zoom-in-95 duration-500">
//             <div 
//                 className="h-20 w-20 rounded-[2rem] flex items-center justify-center mx-auto border"
//                 style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}20` }}
//             >
//                 <Sparkles className="h-10 w-10 animate-pulse" style={{ color: primaryColor }} />
//             </div>

//             <div className="space-y-2">
//                 <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">Registry Empty</h2>
//                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
//                 Initialize the synthesis engine to generate academic nodes for this topic.
//                 </p>
//             </div>

//             <button
//               onClick={handleGenerate}
//               disabled={isGenerating}
//               className="px-12 py-6 text-slate-950 font-black rounded-2xl uppercase text-[11px] tracking-[0.3em] hover:scale-105 transition-all disabled:opacity-20 shadow-2xl"
//               style={{ backgroundColor: primaryColor, boxShadow: `0 0 30px ${primaryColor}20` }}
//             >
//               {isGenerating ? (
//                 <span className="flex items-center gap-3">
//                   <Loader2 className="animate-spin w-4 h-4" />
//                   Synthesizing...
//                 </span>
//               ) : (
//                 "Initialize Synthesis"
//               )}
//             </button>
//           </div>
//         ) : (
//           <AILessonPlanner
//             topicId={topicId}
//             lessonId={initialLesson?.id || ""}
//             schoolId={schoolId}
//             userId={userId}
//             userRole={userRole as Role}
//             topicTitle={lessonContent.studentContent.title}
//             initialData={lessonContent}
//             initialScannedQuestions={scannedQuestions}
//             mode={userRole === Role.STUDENT ? "student" : "teacher"}
//           />
//         )}
//       </main>
//     </div>
//   );
// }



// 'use client'

// import { useState } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { generateTopicContent, type EnhancedLessonContent } from "@/app/actions/ai-generator"
// import { getScannedQuestions } from "@/app/actions/scanned-question-bank"
// import { getLessonForTeacher } from "@/app/actions/lesson.actions"
// import { ArrowLeft, BookOpen, Loader2, Sparkles, ShieldCheck } from "lucide-react"
// import Link from "next/link"
// import { Badge } from "@/components/ui/badge"
// import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner"
// import { toast } from "sonner"
// import { getErrorMessage } from "@/lib/error-handler"
// import { Question, Role} from "@prisma/client"


// interface LessonStudioClientProps {
//   topicId: string;
//   initialLesson: any; 
//   initialScannedQuestions: Question[];
// }

// /**
//  * INSTITUTIONAL LESSON STUDIO (Tier 2/3)
//  * Rule 15: Resolved Error 2352 using 'unknown' bridge for JSON casting.
//  * Rule 17: Leverages Zustand for branding context.
//  */
// export function LessonStudioClient({ topicId, initialLesson, initialScannedQuestions }: LessonStudioClientProps) {
//   const { profile } = useProfileStore();
  
//   // ✅ FIXED: Using 'unknown' bridge to safely cast Prisma JSON to EnhancedLessonContent
//   const [lessonContent, setLessonContent] = useState<EnhancedLessonContent | null>(
//     (initialLesson?.customContent as unknown as EnhancedLessonContent) ?? null
//   );
  
//   const [scannedQuestions, setScannedQuestions] = useState<Question[]>(initialScannedQuestions);
//   const [isGenerating, setIsGenerating] = useState(false);

//   const userId = profile?.id ?? "";
//   const schoolId = profile?.schoolId ?? null;
//   const userRole = profile?.role ?? Role.TEACHER;
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   /**
//    * Rule 11: Re-Sync Logic
//    */
//   const refreshStudio = async () => {
//     try {
//         const [lRes, qRes] = await Promise.all([
//             getLessonForTeacher(topicId, schoolId ?? ""),
//             getScannedQuestions({ topicId, schoolId, userId })
//         ]);
//         if (lRes.success && lRes.data) {
//             // ✅ FIXED: Consistent 'unknown' casting
//             setLessonContent(lRes.data.customContent as unknown as EnhancedLessonContent);
//         }
//         setScannedQuestions(qRes);
//     } catch (err) {
//         console.error("Studio Sync Error:", err);
//     }
//   };

//   const handleGenerate = async () => {
//     if (!userId) return toast.error("Session Identification Required");

//     setIsGenerating(true);
//     try {
//       const res = await generateTopicContent({ 
//           topicId, 
//           userId, 
//           schoolId, 
//           userRole: userRole as Role 
//       });

//       if (res.success) {
//         toast.success("AI Synthesis Complete.");
//         await refreshStudio();
//       } else {
//         toast.error(res.error || "Synthesis failed.");
//       }
//     } catch (err: unknown) {
//       toast.error(getErrorMessage(err));
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8 bg-slate-950 min-h-screen text-white animate-in fade-in duration-700">
      
//       <header className="space-y-6">
//         <Link 
//             href={userRole === Role.STUDENT ? "/student" : "/teacher"} 
//             className="text-slate-500 hover:text-white text-[10px] font-black uppercase flex items-center gap-2 transition-all w-fit tracking-widest"
//         >
//           <ArrowLeft className="h-3.5 w-3.5" /> Return to Hub
//         </Link>

//         <div className="flex items-center justify-between border-b border-white/5 pb-8">
//           <div className="flex items-center gap-5">
//             <div 
//                 className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
//                 style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
//             >
//               <BookOpen className="h-7 w-7" style={{ color: primaryColor }} />
//             </div>
//             <div>
//               <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Studio Console</h1>
//               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Registry Module Architecture</p>
//             </div>
//           </div>
          
//           <div className="hidden md:flex items-center gap-3 bg-slate-900 px-5 py-2 rounded-2xl border border-white/5 shadow-inner">
//               <ShieldCheck className="h-4 w-4" style={{ color: primaryColor }} />
//               <span className="text-[9px] font-black uppercase tracking-widest text-white">Logic Node Active</span>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-5xl mx-auto">
//         {!lessonContent ? (
//           <div className="text-center py-32 bg-slate-900/50 rounded-[3.5rem] border border-white/5 space-y-8 shadow-2xl animate-in zoom-in-95 duration-500">
//             <div 
//                 className="h-20 w-20 rounded-[2rem] flex items-center justify-center mx-auto border"
//                 style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}20` }}
//             >
//                 <Sparkles className="h-10 w-10 animate-pulse" style={{ color: primaryColor }} />
//             </div>

//             <div className="space-y-2">
//                 <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">Registry Empty</h2>
//                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
//                 Initialize the synthesis engine to generate academic nodes for this topic.
//                 </p>
//             </div>

//             <button
//               onClick={handleGenerate}
//               disabled={isGenerating}
//               className="px-12 py-6 text-slate-950 font-black rounded-2xl uppercase text-[11px] tracking-[0.3em] hover:scale-105 transition-all disabled:opacity-20 shadow-2xl"
//               style={{ backgroundColor: primaryColor, boxShadow: `0 0 30px ${primaryColor}20` }}
//             >
//               {isGenerating ? (
//                 <span className="flex items-center gap-3">
//                   <Loader2 className="animate-spin w-4 h-4" />
//                   Synthesizing...
//                 </span>
//               ) : (
//                 "Initialize Synthesis"
//               )}
//             </button>
//           </div>
//         ) : (
//           <AILessonPlanner
//             topicId={topicId}
//             lessonId={initialLesson?.id || ""}
//             schoolId={schoolId}
//             userId={userId}
//             userRole={userRole as Role}
//             topicTitle={lessonContent.studentContent.title}
//             initialData={lessonContent}
//             initialScannedQuestions={scannedQuestions}
//             mode={userRole === Role.STUDENT ? "student" : "teacher"}
//           />
//         )}
//       </main>
//     </div>
//   );
// }


// 'use client'

// import React, { useState } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { generateTopicContent, type EnhancedLessonContent } from "@/app/actions/ai-generator"
// import { getScannedPapers } from "@/app/actions/scanned-question-bank"
// import { getLessonForTeacher } from "@/app/actions/lesson.actions"
// import { ArrowLeft, BookOpen, Loader2, Sparkles, ShieldCheck, ChevronLeft } from "lucide-react"
// import Link from "next/link"
// import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner"
// import { toast } from "sonner"
// import { getErrorMessage } from "@/lib/error-handler"
// import { Question, Role } from "@prisma/client"
// import { cn } from "@/lib/utils"

// interface LessonStudioClientProps {
//   topicId: string;
//   initialLesson: any; 
//   initialScannedQuestions: Question[];
// }

// /**
//  * INSTITUTIONAL LESSON STUDIO (Tier 2/3)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 15: Resolved casting bridge via 'unknown'.
//  * Rule 18: Semantic Flip (bg-background, bg-card, border-border).
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function LessonStudioClient({ topicId, initialLesson, initialScannedQuestions }: LessonStudioClientProps) {
//   const { profile } = useProfileStore();
  
//   // ✅ FIXED Rule 15: unknown bridge casting for Prisma JSON types
//   const [lessonContent, setLessonContent] = useState<EnhancedLessonContent | null>(
//     (initialLesson?.customContent as unknown as EnhancedLessonContent) ?? null
//   );
  
//   const [scannedQuestions, setScannedQuestions] = useState<Question[]>(initialScannedQuestions);
//   const [isGenerating, setIsGenerating] = useState(false);

//   const userId = profile?.id ?? "";
//   const schoolId = profile?.schoolId ?? null;
//   const userRole = profile?.role ?? Role.TEACHER;

//   /**
//    * Rule 11: Hub Re-Synchronization
//    */
//   const refreshStudio = async () => {
//     try {
//         const [lRes, qRes] = await Promise.all([
//             getLessonForTeacher(topicId, schoolId ?? ""),
//             getScannedQuestions({ topicId, schoolId, userId })
//         ]);
//         if (lRes.success && lRes.data) {
//             setLessonContent(lRes.data.customContent as unknown as EnhancedLessonContent);
//         }
//         setScannedQuestions(qRes);
//     } catch (err) {
//         console.error("[STUDIO_SYNC_FAULT]:", err);
//     }
//   };

//   const handleGenerate = async () => {
//     if (!userId) return toast.error("Security Context: Identification required.");

//     setIsGenerating(true);
//     try {
//       const res = await generateTopicContent({ 
//           topicId, 
//           userId, 
//           schoolId, 
//           userRole: userRole as Role 
//       });

//       if (res.success) {
//         toast.success("AI Synthesis Complete.");
//         await refreshStudio();
//       } else {
//         toast.error("Synthesis protocol failed.");
//       }
//     } catch (err: unknown) {
//       toast.error(getErrorMessage(err));
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
//       {/* Rule 20: Fluid Container */}
//       <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-12">
        
//         {/* ── HEADER ── */}
//         <header className="space-y-8">
//           <Link 
//               href={userRole === Role.STUDENT ? "/student" : "/teacher"} 
//               className="text-muted-foreground hover:text-foreground text-[10px] font-extrabold uppercase flex items-center gap-2 transition-all w-fit tracking-widest italic"
//           >
//             <ChevronLeft className="h-4 w-4" /> Return to Hub Terminal
//           </Link>

//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
//             <div className="flex items-center gap-6">
//               {/* Rule 21: Scale Protocol Icon Box */}
//               <div className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-lg transition-colors">
//                 <BookOpen className="h-8 w-8 text-school-primary" />
//               </div>
//               <div className="space-y-1">
//                 {/* Rule 11: Header scaling */}
//                 <h1 className="text-2xl md:text-4xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">Studio Console</h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
//                     <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
//                     Registry Module Architecture Hub
//                 </p>
//               </div>
//             </div>
            
//             <div className="hidden md:flex items-center gap-4 bg-surface px-6 py-3 rounded-2xl border border-border shadow-inner">
//                 <ShieldCheck className="h-5 w-5 text-school-primary" />
//                 <span className="text-[10px] font-extrabold uppercase tracking-widest text-foreground italic">Logic Hub Active</span>
//             </div>
//           </div>
//         </header>

//         <main className="w-full">
//           {!lessonContent ? (
//             /* ── EMPTY HUB STATE (Rule 18/19/21) ── */
//             <div className="text-center py-32 bg-card rounded-[3rem] border-2 border-dashed border-border space-y-10 shadow-2xl animate-in zoom-in-95 duration-500 max-w-4xl mx-auto">
//               <div className="h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto border border-school-primary-200 bg-school-primary-50 shadow-inner">
//                   <Sparkles className="h-12 w-12 text-school-primary animate-pulse" />
//               </div>

//               <div className="space-y-3 px-6">
//                   <h2 className="text-2xl md:text-3xl font-extrabold uppercase italic text-foreground tracking-tighter">Registry Empty</h2>
//                   <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto italic opacity-70">
//                     Initialize the synthesis engine to generate academic modules for this syllabus hub.
//                   </p>
//               </div>

//               <button
//                 onClick={handleGenerate}
//                 disabled={isGenerating}
//                 className="px-12 py-5 bg-school-primary text-on-school-primary font-extrabold rounded-2xl uppercase text-[11px] tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-20 shadow-xl shadow-school-primary-200"
//               >
//                 {isGenerating ? (
//                   <div className="flex items-center gap-3">
//                     <Loader2 className="animate-spin w-5 h-5" />
//                     Synthesizing...
//                   </div>
//                 ) : (
//                   "Initialize Synthesis Engine"
//                 )}
//               </button>
//             </div>
//           ) : (
//             /* ── ACTIVE PLANNER HUB ── */
//             <div className="animate-in slide-in-from-bottom-6 duration-1000">
//                 <AILessonPlanner
//                     topicId={topicId}
//                     lessonId={initialLesson?.id || ""}
//                     schoolId={schoolId}
//                     userId={userId}
//                     userRole={userRole as Role}
//                     topicTitle={lessonContent.studentContent.title}
//                     initialData={lessonContent}
//                     initialScannedQuestions={scannedQuestions}
//                     mode={userRole === Role.STUDENT ? "student" : "teacher"}
//                 />
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }



'use client'

import React, { useState } from "react"
import { useProfileStore } from "@/store/profileStore"
import { generateTopicContent, type EnhancedLessonContent } from "@/app/actions/ai-generator"
import { getScannedPapers } from "@/app/actions/scanned-question-bank"
import { getLessonForTeacher } from "@/app/actions/lesson.actions"
import { ArrowLeft, BookOpen, Loader2, Sparkles, ShieldCheck, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/error-handler"
import { Question, Role } from "@prisma/client"
import { cn } from "@/lib/utils"

interface LessonStudioClientProps {
  topicId: string;
  initialLesson: any; 
  initialScannedQuestions: Question[];
}

/**
 * INSTITUTIONAL LESSON STUDIO (Tier 2/3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 15: Resolved casting bridge TS2345 via 'unknown' and explicit model targeting.
 * Rule 18/21: Semantic Flip & Scale Protocol.
 */
export function LessonStudioClient({ topicId, initialLesson, initialScannedQuestions }: LessonStudioClientProps) {
  const { profile } = useProfileStore();
  
  const [lessonContent, setLessonContent] = useState<EnhancedLessonContent | null>(
    (initialLesson?.customContent as unknown as EnhancedLessonContent) ?? null
  );
  
  const [scannedQuestions, setScannedQuestions] = useState<Question[]>(initialScannedQuestions);
  const [isGenerating, setIsGenerating] = useState(false);

  const userId = profile?.id ?? "";
  const schoolId = profile?.schoolId ?? null;
  const userRole = profile?.role ?? Role.TEACHER;

  /**
   * Rule 11: Hub Re-Synchronization Protocol
   * ✅ RESOLVED TS2345: Explicitly typing qRes to ensure state compatibility.
   */
  const refreshStudio = async () => {
    try {
        const [lRes, qRes] = await Promise.all([
            getLessonForTeacher(topicId, schoolId ?? ""),
            getScannedPapers(schoolId, userId )
        ]);
        
        if (lRes.success && lRes.data) {
            setLessonContent(lRes.data.customContent as unknown as EnhancedLessonContent);
        }
        
        // Rule 15: Safe Bridge Cast to Question[]
        if (qRes) {
            setScannedQuestions(qRes as unknown as Question[]);
        }
    } catch (err) {
        console.error("[STUDIO_SYNC_FAULT]:", err);
    }
  };

  const handleGenerate = async () => {
    if (!userId) return toast.error("Registry Protocol: Identification required.");

    setIsGenerating(true);
    try {
      const res = await generateTopicContent({ topicId, userId, schoolId, userRole: userRole as Role });

      if (res.success) {
        toast.success("AI Synthesis Complete.");
        await refreshStudio();
      } else {
        toast.error("Synthesis protocol failed.");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-12">
        
        {/* ── HEADER (Rule 11/21) ── */}
        <header className="space-y-8">
          <Link 
              href={userRole === Role.STUDENT ? "/student" : "/teacher"} 
              className="text-muted-foreground hover:text-foreground text-[10px] font-extrabold uppercase flex items-center gap-2 transition-all w-fit tracking-widest italic"
          >
            <ChevronLeft className="h-4 w-4" /> Return to Hub Terminal
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-lg transition-colors">
                <BookOpen className="h-8 w-8 text-school-primary" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl md:text-4xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">Studio Console</h1>
                <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
                    Registry Module Architecture Hub
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4 bg-surface px-6 py-3 rounded-2xl border border-border shadow-inner">
                <ShieldCheck className="h-5 w-5 text-school-primary" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-foreground italic">Logic Hub Active</span>
            </div>
          </div>
        </header>

        <main className="w-full">
          {!lessonContent ? (
            /* ── EMPTY HUB STATE (Rule 18/21) ── */
            <div className="text-center py-32 bg-card rounded-[3rem] border-2 border-dashed border-border space-y-10 shadow-2xl animate-in zoom-in-95 duration-500 max-w-4xl mx-auto">
              <div className="h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto border border-school-primary-200 bg-school-primary-50 shadow-inner">
                  <Sparkles className="h-12 w-12 text-school-primary animate-pulse" />
              </div>

              <div className="space-y-3 px-6">
                  <h2 className="text-2xl md:text-3xl font-extrabold uppercase italic text-foreground tracking-tighter">Registry Hub Empty</h2>
                  <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto italic opacity-70">
                    Initialize the synthesis engine to generate academic modules for this syllabus hub.
                  </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-12 py-5 bg-school-primary text-on-school-primary font-extrabold rounded-2xl uppercase text-[11px] tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-20 shadow-xl shadow-school-primary-200"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin w-5 h-5" />
                    Synthesizing Hub...
                  </div>
                ) : (
                  "Initialize Synthesis Hub"
                )}
              </button>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom-6 duration-1000">
                <AILessonPlanner
                    topicId={topicId}
                    lessonId={initialLesson?.id || ""}
                    schoolId={schoolId}
                    userId={userId}
                    userRole={userRole as Role}
                    topicTitle={lessonContent.studentContent.title}
                    initialData={lessonContent}
                    initialScannedQuestions={scannedQuestions}
                    mode={userRole === Role.STUDENT ? "student" : "teacher"}
                />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}