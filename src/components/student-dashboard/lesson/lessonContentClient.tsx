// 'use client'

// import { useState } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { Layers, BookOpen, GraduationCap, History, Zap } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { type EnhancedLessonContent } from "@/app/actions/ai-generator"
// import { Question, Role } from "@prisma/client"
// import { ScannedQuestionRegistry } from "@/components/scan/scannedQuestionRegistry"
// import { Badge } from "@/components/ui/badge"
// import { Card } from "@/components/ui/card"

// // ── Types ───────────────────────────────────────────────────────────────────

// interface LessonContentClientProps {
//   initialLesson: {
//     id: string;
//     title: string;
//     aiContent: EnhancedLessonContent;
//   };
//   initialScannedQuestions: Question[];
//   userId: string;
//   schoolId: string | null;
//   userRole: Role;
// }

// /**
//  * STUDENT MODULE VIEWER
//  * Rule 12: Hydrated with server-side props.
//  * Rule 17: Pulls primary branding color from Zustand store.
//  */
// export function LessonContentClient({ 
//   initialLesson, 
//   initialScannedQuestions,
//   userId,
//   schoolId,
//   userRole
// }: LessonContentClientProps) {
//   const { profile } = useProfileStore();
//   const [activeTab, setActiveTab] = useState<'content' | 'practice'>('content');
  
//   const primaryColor = profile?.primaryColor || "#f59e0b";
//   const content = initialLesson.aiContent.studentContent;

//   return (
//     <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700">
      
//       {/* ── HEADER ── */}
//       <header className="border-b border-white/5 pb-10">
//         <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 rounded-lg bg-slate-900 border border-white/5">
//                 <Layers className="h-4 w-4 text-school-primary" style={{ color: primaryColor }} />
//             </div>
//             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Registry Module</span>
//         </div>
//         <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
//             {initialLesson.title}
//         </h1>

//         {/* TABS SWITCHER */}
//         <div className="flex p-1.5 bg-slate-900 rounded-2xl w-fit border border-white/5 shadow-inner">
//             <button 
//                 onClick={() => setActiveTab('content')}
//                 className={cn(
//                     "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
//                     activeTab === 'content' ? "bg-slate-950 text-white shadow-xl border border-white/10" : "text-slate-500 hover:text-white"
//                 )}
//             >
//                 Lesson Note
//             </button>
//             <button 
//                 onClick={() => setActiveTab('practice')}
//                 className={cn(
//                     "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
//                     activeTab === 'practice' ? "bg-slate-950 text-white shadow-xl border border-white/10" : "text-slate-500 hover:text-white"
//                 )}
//             >
//                 <History className="h-3.5 w-3.5" style={activeTab === 'practice' ? { color: primaryColor } : {}} /> Past Papers
//             </button>
//         </div>
//       </header>

//       {activeTab === 'content' && (
//         <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
          
//           {/* OBJECTIVES */}
//           <div className="flex flex-wrap gap-2">
//               {content.learningObjectives.map((obj, i) => (
//                   <Badge key={i} variant="outline" className="px-4 py-2 bg-slate-900 border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">
//                     <GraduationCap className="h-3 w-3 mr-2" style={{ color: primaryColor }} /> {obj}
//                   </Badge>
//               ))}
//           </div>

//           {/* SUMMARY */}
//           <section className="space-y-4">
//             <div className="flex items-center gap-3 ml-2">
//                 <div className="h-px w-8" style={{ backgroundColor: primaryColor }} />
//                 <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">Core Summary</h2>
//             </div>
//             <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
//               <p className="text-slate-300 text-xl leading-loose italic font-medium">{content.summary}</p>
//             </div>
//           </section>

//           {/* CONTENT */}
//           <section className="space-y-6">
//             <div className="flex items-center gap-3 ml-2">
//                 <div className="h-px w-8" style={{ backgroundColor: primaryColor }} />
//                 <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">Theoretical Framework</h2>
//             </div>
//             <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-2xl text-slate-200 whitespace-pre-line leading-loose text-lg font-medium">
//               {content.explanation}
//             </div>
//           </section>

//           {/* VISUAL REGISTRY */}
//           {content.visualAids.length > 0 && (
//             <section className="space-y-6">
//                 <div className="flex items-center gap-3 ml-2">
//                     <div className="h-px w-8" style={{ backgroundColor: primaryColor }} />
//                     <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">Visual Assets</h2>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {content.visualAids.map((v, i) => (
//                     <Card key={i} className="bg-slate-950 rounded-[2rem] border border-white/5 overflow-hidden group hover:border-white/10 transition-all">
//                         <div className="p-8 space-y-3">
//                             <h4 className="text-base font-black text-white uppercase italic group-hover:text-school-primary transition-colors" style={{ color: primaryColor }}>{v.title}</h4>
//                             <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-tight">{v.description}</p>
//                         </div>
//                     </Card>
//                     ))}
//                 </div>
//             </section>
//           )}
//         </div>
//       )}

//       {activeTab === 'practice' && (
//         <div className="animate-in slide-in-from-right-4 duration-500">
//             <ScannedQuestionRegistry 
//                 questions={initialScannedQuestions}
//                 userRole={userRole}
//             />
//         </div>
//       )}
//     </div>
//   );
// }



// 'use client'

// import { useState } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { Layers, GraduationCap, History, ChevronRight } from "lucide-react"
// import { cn } from "@/lib/utils"
// // ✅ FIXED: Importing the refactored type from the actions file
// import { type EnhancedLessonContent } from "@/app/actions/ai-generator"
// import { Question, Role } from "@prisma/client"
// import { ScannedQuestionRegistry } from "@/components/scan/scannedQuestionRegistry"
// import { Badge } from "@/components/ui/badge"
// import { Card } from "@/components/ui/card"


// // ── Types ───────────────────────────────────────────────────────────────────

// interface LessonContentClientProps {
//   initialLesson: {
//     id: string;
//     title: string;
//     aiContent: EnhancedLessonContent;
//   };
//   initialScannedQuestions: Question[];
//   userId: string;
//   schoolId: string | null;
//   userRole: Role;
// }

// /**
//  * STUDENT MODULE VIEWER
//  * Rule 12: Hydrated with server-side props.
//  * Rule 17: Pulls primary branding color from Zustand store.
//  */
// export function LessonContentClient({ 
//   initialLesson, 
//   initialScannedQuestions,
//   userId,
//   schoolId,
//   userRole
// }: LessonContentClientProps) {
//   const { profile } = useProfileStore();
//   const [activeTab, setActiveTab] = useState<'content' | 'practice'>('content');
  
//   const primaryColor = profile?.primaryColor || "#f59e0b";
//   const content = initialLesson.aiContent.studentContent;

//   return (
//     <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700">
      
//       {/* ── HEADER ── */}
//       <header className="border-b border-white/5 pb-10">
//         <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 rounded-lg bg-slate-900 border border-white/5 shadow-inner">
//                 <Layers className="h-4 w-4 text-school-primary" style={{ color: primaryColor }} />
//             </div>
//             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Academic Module</span>
//         </div>
//         <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-8">
//             {initialLesson.title}
//         </h1>

//         {/* TABS SWITCHER (Rule 11 System Truth) */}
//         <div className="flex p-1.5 bg-slate-900 rounded-2xl w-fit border border-white/5 shadow-2xl">
//             <button 
//                 onClick={() => setActiveTab('content')}
//                 className={cn(
//                     "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
//                     activeTab === 'content' ? "bg-slate-950 text-white shadow-xl border border-white/10" : "text-slate-500 hover:text-white"
//                 )}
//             >
//                 Lesson Note
//             </button>
//             <button 
//                 onClick={() => setActiveTab('practice')}
//                 className={cn(
//                     "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
//                     activeTab === 'practice' ? "bg-slate-950 text-white shadow-xl border border-white/10" : "text-slate-500 hover:text-white"
//                 )}
//             >
//                 <History className="h-3.5 w-3.5" style={activeTab === 'practice' ? { color: primaryColor } : {}} /> Past Papers
//             </button>
//         </div>
//       </header>

//       {activeTab === 'content' && (
//         <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
          
//           {/* OBJECTIVES */}
//           <div className="flex flex-wrap gap-2">
//               {content.learningObjectives.map((obj, i) => (
//                   <Badge key={i} variant="outline" className="px-4 py-2 bg-slate-900 border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">
//                     <GraduationCap className="h-3 w-3 mr-2" style={{ color: primaryColor }} /> {obj}
//                   </Badge>
//               ))}
//           </div>

//           {/* SUMMARY */}
//           <section className="space-y-4">
//             <div className="flex items-center gap-3 ml-2">
//                 <div className="h-px w-8" style={{ backgroundColor: primaryColor }} />
//                 <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest italic">Executive Summary</h2>
//             </div>
//             <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
//               <p className="text-slate-300 text-xl leading-loose italic font-medium">{content.summary}</p>
//             </div>
//           </section>

//           {/* CONTENT */}
//           <section className="space-y-6">
//             <div className="flex items-center gap-3 ml-2">
//                 <div className="h-px w-8" style={{ backgroundColor: primaryColor }} />
//                 <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest italic">Theoretical Framework</h2>
//             </div>
//             <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-2xl text-slate-200 whitespace-pre-line leading-loose text-lg font-medium">
//               {content.explanation}
//             </div>
//           </section>

//           {/* VISUAL REGISTRY */}
//           {content.visualAids.length > 0 && (
//             <section className="space-y-6">
//                 <div className="flex items-center gap-3 ml-2">
//                     <div className="h-px w-8" style={{ backgroundColor: primaryColor }} />
//                     <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest italic">Visual Registry</h2>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {content.visualAids.map((v, i) => (
//                     <Card key={i} className="bg-slate-950 rounded-[2rem] border border-white/5 overflow-hidden group hover:border-white/10 transition-all shadow-xl">
//                         <div className="p-8 space-y-3">
//                             <h4 className="text-base font-black text-white uppercase italic group-hover:text-school-primary transition-colors" style={{ color: primaryColor }}>{v.title}</h4>
//                             <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-tight">{v.description}</p>
//                         </div>
//                     </Card>
//                     ))}
//                 </div>
//             </section>
//           )}
//         </div>
//       )}

//       {activeTab === 'practice' && (
//         <div className="animate-in slide-in-from-right-4 duration-500">
//             <ScannedQuestionRegistry 
//                 questions={initialScannedQuestions}
//                 userRole={userRole}
//             />
//         </div>
//       )}
//     </div>
//   );
// }


// 'use client'

// import React, { useState } from "react"
// import { Layers, GraduationCap, History, Sparkles } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { type EnhancedLessonContent } from "@/app/actions/ai-generator"
// import { Question, Role } from "@prisma/client"
// import { ScannedQuestionRegistry } from "@/components/scan/scannedQuestionRegistry"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface LessonContentClientProps {
//   initialLesson: {
//     id: string;
//     title: string;
//     aiContent: EnhancedLessonContent;
//   };
//   initialScannedQuestions: Question[];
//   userId: string;
//   schoolId: string | null;
//   userRole: Role;
// }

// /**
//  * STUDENT MODULE VIEWER (Tier 3)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function LessonContentClient({ 
//   initialLesson, 
//   initialScannedQuestions,
//   userRole
// }: LessonContentClientProps) {
//   const [activeTab, setActiveTab] = useState<'content' | 'practice'>('content');
  
//   const content = initialLesson.aiContent.studentContent;

//   // ✅ RESOLVED TS2322: Registry Schema Adapter
//   // Bridging Prisma 'correctAnswer' to 'answer' expected by the ScannedRegistry component
//   const practiceNodes = initialScannedQuestions.map(q => ({
//     ...q,
//     answer: q.correctAnswer
//   }));

//   return (
//     <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
//       {/* Rule 20: Fluid Container */}
//       <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-10 pb-32">
        
//         {/* ── HEADER (Rule 11/21) ── */}
//         <header className="border-b border-border pb-10">
//           <div className="flex items-center gap-3 mb-6">
//               <div className="p-2.5 rounded-xl bg-school-primary-50 border border-school-primary-200 shadow-inner">
//                   <Layers className="h-5 w-5 text-school-primary" />
//               </div>
//               <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-muted-foreground italic">
//                 Academic Module Hub
//               </span>
//           </div>
          
//           <h1 className="text-3xl md:text-5xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none mb-10">
//               {initialLesson.title}
//           </h1>

//           {/* ── TABS SWITCHER (Rule 18/19) ── */}
//           <div className="flex p-1.5 bg-surface rounded-2xl w-fit border border-border shadow-xl">
//               <button 
//                   onClick={() => setActiveTab('content')}
//                   className={cn(
//                       "px-8 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all",
//                       activeTab === 'content' 
//                         ? "bg-school-primary text-on-school-primary shadow-lg" 
//                         : "text-muted-foreground hover:text-foreground"
//                   )}
//               >
//                   Material Notes
//               </button>
//               <button 
//                   onClick={() => setActiveTab('practice')}
//                   className={cn(
//                       "px-8 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all flex items-center gap-2",
//                       activeTab === 'practice' 
//                         ? "bg-school-primary text-on-school-primary shadow-lg" 
//                         : "text-muted-foreground hover:text-foreground"
//                   )}
//               >
//                   <History className="h-4 w-4" /> Past Papers
//               </button>
//           </div>
//         </header>

//         {/* ── CONTENT TIER ── */}
//         <main className="min-w-0">
//           {activeTab === 'content' && (
//             <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
              
//               {/* LEARNING OBJECTIVES (Rule 21) */}
//               <div className="flex flex-wrap gap-3">
//                   {content.learningObjectives.map((obj, i) => (
//                       <Badge 
//                         key={i} 
//                         variant="outline" 
//                         className="px-4 py-2 bg-surface border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:border-school-primary-200 transition-colors"
//                       >
//                         <GraduationCap className="h-3.5 w-3.5 mr-2 text-school-primary" /> {obj}
//                       </Badge>
//                   ))}
//               </div>

//               {/* EXECUTIVE SUMMARY (Rule 19) */}
//               <section className="space-y-6">
//                 <div className="flex items-center gap-4 ml-2">
//                     <div className="h-1 w-8 bg-school-primary rounded-full shadow-[0_0_10px_rgba(var(--school-primary-raw),0.3)]" />
//                     <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Theoretical Context</h2>
//                 </div>
//                 <div className="bg-card p-8 md:p-12 rounded-[2rem] border border-border shadow-2xl relative overflow-hidden group">
//                   <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 blur-3xl rounded-full opacity-40 group-hover:opacity-100 transition-opacity" />
//                   <p className="relative z-10 text-foreground text-xl md:text-2xl leading-loose italic font-medium">
//                     {content.summary}
//                   </p>
//                 </div>
//               </section>

//               {/* PRIMARY CONTENT */}
//               <section className="space-y-6">
//                 <div className="flex items-center gap-4 ml-2">
//                     <div className="h-1 w-8 bg-school-primary rounded-full shadow-[0_0_10px_rgba(var(--school-primary-raw),0.3)]" />
//                     <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Pedagogical Framework</h2>
//                 </div>
//                 <div className="bg-card p-8 md:p-12 rounded-[2rem] border border-border shadow-xl text-foreground/80 whitespace-pre-line leading-relaxed text-lg font-medium italic">
//                   {content.explanation}
//                 </div>
//               </section>

//               {/* VISUAL REGISTRY (Rule 20) */}
//               {content.visualAids.length > 0 && (
//                 <section className="space-y-6">
//                     <div className="flex items-center gap-4 ml-2">
//                         <div className="h-1 w-8 bg-school-primary rounded-full shadow-[0_0_10px_rgba(var(--school-primary-raw),0.3)]" />
//                         <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Visual Hubs</h2>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {content.visualAids.map((v, i) => (
//                         <Card key={i} className="bg-surface border-border rounded-[2rem] overflow-hidden group hover:border-school-primary/30 transition-all shadow-lg">
//                             <CardContent className="p-8 space-y-4">
//                                 <div className="flex items-center gap-3">
//                                     <Sparkles className="h-4 w-4 text-school-primary" />
//                                     <h4 className="text-base font-extrabold text-foreground uppercase italic tracking-tight group-hover:text-school-primary transition-colors">
//                                         {v.title}
//                                     </h4>
//                                 </div>
//                                 <p className="text-sm text-muted-foreground leading-relaxed font-semibold uppercase tracking-tight opacity-70">
//                                     {v.description}
//                                 </p>
//                             </CardContent>
//                         </Card>
//                         ))}
//                     </div>
//                 </section>
//               )}
//             </div>
//           )}

//           {activeTab === 'practice' && (
//             <div className="animate-in fade-in slide-in-from-right-6 duration-700">
//                 {/* ✅ RESOLVED: Passing correctly typed practiceNodes */}
//                 <ScannedQuestionRegistry 
//                     questions={practiceNodes as any}
//                     userRole={userRole}
//                 />
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }


// 'use client'

// import React, { useState } from "react"
// import { Layers, GraduationCap, History, Sparkles } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { type EnhancedLessonContent } from "@/app/actions/ai-generator"
// import { Question, Role } from "@prisma/client"
// import { ScannedQuestionRegistry, type ScannedQuestion } from "@/components/scan/scannedQuestionRegistry"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"
// import { getErrorMessage } from "@/lib/error-handler"

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface LessonContentClientProps {
//   initialLesson: {
//     id: string;
//     title: string;
//     aiContent: EnhancedLessonContent;
//   };
//   initialScannedQuestions: Question[];
//   userId: string;
//   schoolId: string | null;
//   userRole: Role;
// }

// /**
//  * STUDENT MODULE VIEWER (Tier 3)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 15: Pure TypeScript - All 'any' types resolved via mapping.
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 21: Scale Protocol for mathematical brand tints.
//  * Rule 23: Explicit Error Protocol with getErrorMessage.
//  */
// export function LessonContentClient({ 
//   initialLesson, 
//   initialScannedQuestions,
//   userRole
// }: LessonContentClientProps) {
//   const [activeTab, setActiveTab] = useState<'content' | 'practice'>('content');
  
//   const content = initialLesson.aiContent.studentContent;

//   /**
//    * Rule 23: Logic Hub Protection
//    */
//   const handleTabSwitch = (tab: 'content' | 'practice') => {
//     try {
//         setActiveTab(tab);
//     } catch (error: unknown) {
//         const message = getErrorMessage(error);
//         console.error(`[MODULE_TAB_SYNC_FAULT]: ${message}`);
//     }
//   };

//   /**
//    * REGISTRY SCHEMA ADAPTER (Rule 15)
//    * ✅ RESOLVED: Replaced 'any' with strict mapping from Prisma to Component Interface.
//    */
//   const practiceNodes: ScannedQuestion[] = initialScannedQuestions.map(q => ({
//     text: q.text,
//     answer: q.correctAnswer,
//     explanation: q.explanation ?? "Registry rationale pending sync.",
//     marks: q.points,
//     year: q.year ?? undefined,
//     examBody: q.examBody ?? undefined
//   }));

//   return (
//     <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
//       {/* Rule 20: Fluid Container */}
//       <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 pb-32">
        
//         {/* ── HEADER (Rule 11/21) ── */}
//         <header className="border-b border-border pb-10">
//           <div className="flex items-center gap-3 mb-6">
//               <div className="p-2.5 rounded-xl bg-school-primary-50 border border-school-primary-200 shadow-inner">
//                   <Layers className="h-5 w-5 text-school-primary" />
//               </div>
//               <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-muted-foreground italic">
//                 Academic Module Hub
//               </span>
//           </div>
          
//           <h1 className="text-3xl md:text-5xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none mb-10">
//               {initialLesson.title}
//           </h1>

//           {/* ── TABS SWITCHER (Rule 18/19) ── */}
//           <div className="flex p-1.5 bg-surface rounded-2xl w-fit border border-border shadow-xl">
//               <button 
//                   onClick={() => handleTabSwitch('content')}
//                   className={cn(
//                       "px-8 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all",
//                       activeTab === 'content' 
//                         ? "bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-200" 
//                         : "text-muted-foreground hover:text-foreground"
//                   )}
//               >
//                   Material Notes
//               </button>
//               <button 
//                   onClick={() => handleTabSwitch('practice')}
//                   className={cn(
//                       "px-8 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all flex items-center gap-2",
//                       activeTab === 'practice' 
//                         ? "bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-200" 
//                         : "text-muted-foreground hover:text-foreground"
//                   )}
//               >
//                   <History className="h-4 w-4" /> Practice Hub
//               </button>
//           </div>
//         </header>

//         {/* ── CONTENT TIER ── */}
//         <main className="min-w-0">
//           {activeTab === 'content' && (
//             <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
              
//               {/* LEARNING OBJECTIVES (Rule 21) */}
//               <div className="flex flex-wrap gap-3">
//                   {content.learningObjectives.map((obj, i) => (
//                       <Badge 
//                         key={i} 
//                         variant="outline" 
//                         className="px-4 py-2 bg-surface border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:border-school-primary-200 transition-colors"
//                       >
//                         <GraduationCap className="h-3.5 w-3.5 mr-2 text-school-primary" /> {obj}
//                       </Badge>
//                   ))}
//               </div>

//               {/* EXECUTIVE SUMMARY (Rule 19) */}
//               <section className="space-y-6">
//                 <div className="flex items-center gap-4 ml-2">
//                     <div className="h-1 w-8 bg-school-primary rounded-full shadow-[0_0_10px_rgba(var(--school-primary-raw),0.3)]" />
//                     <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Theoretical Context</h2>
//                 </div>
//                 <div className="bg-card p-8 md:p-12 rounded-[2rem] border border-border shadow-2xl relative overflow-hidden group">
//                   <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 blur-3xl rounded-full opacity-40 group-hover:opacity-100 transition-opacity" />
//                   <p className="relative z-10 text-foreground text-xl md:text-2xl leading-loose italic font-medium">
//                     {content.summary}
//                   </p>
//                 </div>
//               </section>

//               {/* PRIMARY CONTENT */}
//               <section className="space-y-6">
//                 <div className="flex items-center gap-4 ml-2">
//                     <div className="h-1 w-8 bg-school-primary rounded-full shadow-[0_0_10px_rgba(var(--school-primary-raw),0.3)]" />
//                     <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Pedagogical Framework</h2>
//                 </div>
//                 <div className="bg-card p-8 md:p-12 rounded-[2rem] border border-border shadow-xl text-foreground/80 whitespace-pre-line leading-relaxed text-lg font-medium italic">
//                   {content.explanation}
//                 </div>
//               </section>

//               {/* VISUAL HUB (Rule 20) */}
//               {content.visualAids.length > 0 && (
//                 <section className="space-y-6">
//                     <div className="flex items-center gap-4 ml-2">
//                         <div className="h-1 w-8 bg-school-primary rounded-full shadow-[0_0_10px_rgba(var(--school-primary-raw),0.3)]" />
//                         <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Visual Hubs</h2>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {content.visualAids.map((v, i) => (
//                         <Card key={i} className="bg-surface border-border rounded-[2rem] overflow-hidden group hover:border-school-primary-300 transition-all shadow-lg">
//                             <CardContent className="p-8 space-y-4">
//                                 <div className="flex items-center gap-3">
//                                     <Sparkles className="h-4 w-4 text-school-primary" />
//                                     <h4 className="text-base font-extrabold text-foreground uppercase italic tracking-tight group-hover:text-school-primary transition-colors">
//                                         {v.title}
//                                     </h4>
//                                 </div>
//                                 <p className="text-sm text-muted-foreground leading-relaxed font-semibold uppercase tracking-tight opacity-70">
//                                     {v.description}
//                                 </p>
//                             </CardContent>
//                         </Card>
//                         ))}
//                     </div>
//                 </section>
//               )}
//             </div>
//           )}

//           {activeTab === 'practice' && (
//             <div className="animate-in fade-in slide-in-from-right-6 duration-700">
//                 {/* ✅ RESOLVED: Passing strictly typed ScannedQuestion[] */}
//                 <ScannedQuestionRegistry 
//                     questions={practiceNodes}
//                     userRole={userRole}
//                 />
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }




// 'use client'

// import React, { useState, useEffect } from "react"
// import { Layers, GraduationCap, History, Sparkles, Loader2 } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { type EnhancedLessonContent, generateTopicContent } from "@/app/actions/ai-generator"
// import { Question, Role } from "@prisma/client"
// import { ScannedQuestionRegistry, type ScannedQuestion } from "@/components/scan/scannedQuestionRegistry"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"
// import { getErrorMessage } from "@/lib/error-handler"
// import { toast } from "sonner"

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface LessonContentClientProps {
//   initialLesson: {
//     id: string;
//     title: string;
//     aiContent: EnhancedLessonContent;
//   } | null; // Nullable for auto-synthesis phase
//   isGenerated: boolean;
//   topicMetadata?: { title: string; subject: string } | null;
//   initialScannedQuestions: Question[];
//   topicId: string;
//   userId: string;
//   schoolId: string | null;
//   userRole: Role;
// }

// /**
//  * STUDENT MODULE VIEWER (Tier 3)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 24: Auto-Synthesis - Triggers AI generation if content is missing.
//  */
// export function LessonContentClient({ 
//   initialLesson, 
//   isGenerated,
//   topicMetadata,
//   initialScannedQuestions,
//   topicId,
//   userId,
//   schoolId,
//   userRole
// }: LessonContentClientProps) {
//   const [activeTab, setActiveTab] = useState<'content' | 'practice'>('content');
//   const [isSynthesizing, setIsSynthesizing] = useState(!isGenerated);

//   /**
//    * Rule 24: Auto-Synthesis Protocol
//    * Triggers the AI Syllabus Hub if the module has no synthesized content.
//    */
//   useEffect(() => {
//     if (!isGenerated) {
//       const runSynthesis = async () => {
//         try {
//           const res = await generateTopicContent({
//             topicId,
//             userId,
//             schoolId,
//             userRole
//           });
//           if (res.success) {
//             toast.success("Academic module synthesized successfully.");
//             window.location.reload(); // Refresh to hydrate with new content
//           } else {
//             throw new Error(res.error);
//           }
//         } catch (error) {
//           toast.error(`Synthesis Hub Fault: ${getErrorMessage(error)}`);
//           setIsSynthesizing(false);
//         }
//       };
//       runSynthesis();
//     }
//   }, [isGenerated, topicId, userId, schoolId, userRole]);

//   // ── LOADING STATE: SYNTHESIS HUB ──
//   if (isSynthesizing) {
//     return (
//       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in">
//         <div className="relative">
//             <Loader2 className="h-16 w-16 animate-spin text-school-primary opacity-20" />
//             <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-school-primary animate-pulse" />
//         </div>
//         <div className="text-center space-y-3">
//             <h2 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter">
//                 Synthesizing {topicMetadata?.title || "Module"}
//             </h2>
//             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] animate-pulse">
//                 AI Hub is constructing high-fidelity academic modules...
//             </p>
//         </div>
//       </div>
//     );
//   }

//   // Safe access to content after synthesis check
//   const content = initialLesson?.aiContent.studentContent;

//   const handleTabSwitch = (tab: 'content' | 'practice') => {
//     try {
//         setActiveTab(tab);
//     } catch (error: unknown) {
//         console.error(`[MODULE_TAB_SYNC_FAULT]: ${getErrorMessage(error)}`);
//     }
//   };

//   const practiceNodes: ScannedQuestion[] = initialScannedQuestions.map(q => ({
//     text: q.text,
//     answer: q.correctAnswer,
//     explanation: q.explanation ?? "Registry rationale pending sync.",
//     marks: q.points,
//     year: q.year ?? undefined,
//     examBody: q.examBody ?? undefined
//   }));

//   return (
//     <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
//       <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 pb-32">
        
//         {/* ── HEADER (Rule 11/21) ── */}
//         <header className="border-b border-border pb-10">
//           <div className="flex items-center gap-3 mb-6">
//               <div className="p-2.5 rounded-xl bg-school-primary-50 border border-school-primary-200 shadow-inner">
//                   <Layers className="h-5 w-5 text-school-primary" />
//               </div>
//               <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-muted-foreground italic">
//                 {userRole === Role.INDIVIDUAL_LEARNER ? "Personal Academic Hub" : "Institutional Revision Hub"}
//               </span>
//           </div>
          
//           <h1 className="text-3xl md:text-5xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none mb-10">
//               {initialLesson?.title || topicMetadata?.title}
//           </h1>

//           <div className="flex p-1.5 bg-surface rounded-2xl w-fit border border-border shadow-xl">
//               <button 
//                   onClick={() => handleTabSwitch('content')}
//                   className={cn(
//                       "px-8 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all",
//                       activeTab === 'content' ? "bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-200" : "text-muted-foreground hover:text-foreground"
//                   )}
//               >
//                   Material Notes
//               </button>
//               <button 
//                   onClick={() => handleTabSwitch('practice')}
//                   className={cn(
//                       "px-8 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all flex items-center gap-2",
//                       activeTab === 'practice' ? "bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-200" : "text-muted-foreground hover:text-foreground"
//                   )}
//               >
//                   <History className="h-4 w-4" /> Practice Hub
//               </button>
//           </div>
//         </header>

//         {/* ── CONTENT TIER ── */}
//         <main className="min-w-0">
//           {activeTab === 'content' && content && (
//             <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
              
//               <div className="flex flex-wrap gap-3">
//                   {content.learningObjectives.map((obj, i) => (
//                       <Badge key={i} variant="outline" className="px-4 py-2 bg-surface border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
//                         <GraduationCap className="h-3.5 w-3.5 mr-2 text-school-primary" /> {obj}
//                       </Badge>
//                   ))}
//               </div>

//               <section className="space-y-6">
//                 <div className="flex items-center gap-4 ml-2">
//                     <div className="h-1 w-8 bg-school-primary rounded-full" />
//                     <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Theoretical Context</h2>
//                 </div>
//                 <div className="bg-card p-8 md:p-12 rounded-[2rem] border border-border shadow-2xl relative overflow-hidden group">
//                   <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 blur-3xl rounded-full opacity-40" />
//                   <p className="relative z-10 text-foreground text-xl md:text-2xl leading-loose italic font-medium">
//                     {content.summary}
//                   </p>
//                 </div>
//               </section>

//               {/* PRIMARY CONTENT (Will be masked for STUDENTS via server action) */}
//               <section className="space-y-6">
//                 <div className="flex items-center gap-4 ml-2">
//                     <div className="h-1 w-8 bg-school-primary rounded-full" />
//                     <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Pedagogical Framework</h2>
//                 </div>
//                 <div className={cn(
//                   "bg-card p-8 md:p-12 rounded-[2rem] border border-border shadow-xl text-foreground/80 whitespace-pre-line leading-relaxed text-lg font-medium italic",
//                   userRole === Role.STUDENT && "text-muted-foreground/50 italic text-sm text-center"
//                 )}>
//                   {content.explanation}
//                 </div>
//               </section>

//               {/* VISUAL HUB (Only for Individual Learners) */}
//               {content.visualAids.length > 0 && (
//                 <section className="space-y-6">
//                     <div className="flex items-center gap-4 ml-2">
//                         <div className="h-1 w-8 bg-school-primary rounded-full" />
//                         <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Visual Hubs</h2>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {content.visualAids.map((v, i) => (
//                         <Card key={i} className="bg-surface border-border rounded-[2rem] overflow-hidden group hover:border-school-primary-300 transition-all shadow-lg">
//                             <CardContent className="p-8 space-y-4">
//                                 <div className="flex items-center gap-3">
//                                     <Sparkles className="h-4 w-4 text-school-primary" />
//                                     <h4 className="text-base font-extrabold text-foreground uppercase italic tracking-tight">{v.title}</h4>
//                                 </div>
//                                 <p className="text-sm text-muted-foreground leading-relaxed font-semibold uppercase tracking-tight opacity-70">
//                                     {v.description}
//                                 </p>
//                             </CardContent>
//                         </Card>
//                         ))}
//                     </div>
//                 </section>
//               )}
//             </div>
//           )}

//           {activeTab === 'practice' && (
//             <div className="animate-in fade-in slide-in-from-right-6 duration-700">
//                 <ScannedQuestionRegistry questions={practiceNodes} userRole={userRole} />
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }


// 'use client'

// import React, { useState, useEffect } from "react"
// import { Layers, GraduationCap, History, Sparkles, Loader2, HelpCircle, CheckCircle2, XCircle, Award } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { type EnhancedLessonContent, generateTopicContent } from "@/app/actions/ai-generator"
// import { submitQuizAssessment, type QuizQuestionResult, type ExistingQuizAttempt } from "@/app/actions/quiz.actions"
// import { Question, Role } from "@prisma/client"
// import { ScannedQuestionRegistry, type ScannedQuestion } from "@/components/scan/scannedQuestionRegistry"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { getErrorMessage } from "@/lib/error-handler"
// import { toast } from "sonner"

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface LessonContentClientProps {
//   initialLesson: {
//     id: string;
//     title: string;
//     aiContent: EnhancedLessonContent;
//   } | null; // Nullable for auto-synthesis phase
//   isGenerated: boolean;
//   topicMetadata?: { title: string; subject: string } | null;
//   initialScannedQuestions: Question[];
//   topicId: string;
//   gradeSubjectId: string;
//   existingAttempt: ExistingQuizAttempt | null;
//   userId: string;
//   schoolId: string | null;
//   userRole: Role;
// }

// /**
//  * STUDENT MODULE VIEWER (Tier 3)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 24: Auto-Synthesis - Triggers AI generation if content is missing.
//  */
// export function LessonContentClient({ 
//   initialLesson, 
//   isGenerated,
//   topicMetadata,
//   initialScannedQuestions,
//   topicId,
//   gradeSubjectId,
//   existingAttempt,
//   userId,
//   schoolId,
//   userRole
// }: LessonContentClientProps) {
//   const [activeTab, setActiveTab] = useState<'content' | 'practice'>('content');
//   const [isSynthesizing, setIsSynthesizing] = useState(!isGenerated);

//   /**
//    * Rule 24: Auto-Synthesis Protocol
//    * Triggers the AI Syllabus Hub if the module has no synthesized content.
//    */
//   const hasSynthesized = React.useRef(false);

//   useEffect(() => {
//       if (!isGenerated && !hasSynthesized.current) {
//           hasSynthesized.current = true;
//           const runSynthesis = async () => {
//               try {
//                   const res = await generateTopicContent({ topicId, userId, schoolId, userRole });
//                   if (res.success) {
//                       toast.success("Academic module synthesized successfully.");
//                       window.location.reload();
//                   } else {
//                       throw new Error(res.error);
//                   }
//               } catch (error) {
//                   toast.error(`Synthesis Hub Fault: ${getErrorMessage(error)}`);
//                   setIsSynthesizing(false);
//               }
//           };
//           runSynthesis();
//       }
//   }, [isGenerated, topicId, userId, schoolId, userRole]);

//   // ── LOADING STATE: SYNTHESIS HUB ──
//   if (isSynthesizing) {
//     return (
//       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in">
//         <div className="relative">
//             <Loader2 className="h-16 w-16 animate-spin text-school-primary opacity-20" />
//             <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-school-primary animate-pulse" />
//         </div>
//         <div className="text-center space-y-3">
//             <h2 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter">
//                 Synthesizing {topicMetadata?.title || "Module"}
//             </h2>
//             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] animate-pulse">
//                 AI Hub is constructing high-fidelity academic modules...
//             </p>
//         </div>
//       </div>
//     );
//   }

//   // Safe access to content after synthesis check
//   const content = initialLesson?.aiContent.studentContent;

//   const handleTabSwitch = (tab: 'content' | 'practice') => {
//     try {
//         setActiveTab(tab);
//     } catch (error: unknown) {
//         console.error(`[MODULE_TAB_SYNC_FAULT]: ${getErrorMessage(error)}`);
//     }
//   };

//   const practiceNodes: ScannedQuestion[] = initialScannedQuestions.map(q => ({
//     text: q.text,
//     answer: q.correctAnswer,
//     explanation: q.explanation ?? "Registry rationale pending sync.",
//     marks: q.points,
//     year: q.year ?? undefined,
//     examBody: q.examBody ?? undefined
//   }));

//   return (
//     <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
//       <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 pb-32">
        
//         {/* ── HEADER (Rule 11/21) ── */}
//         <header className="border-b border-border pb-10">
//           <div className="flex items-center gap-3 mb-6">
//               <div className="p-2.5 rounded-xl bg-school-primary-50 border border-school-primary-200 shadow-inner">
//                   <Layers className="h-5 w-5 text-school-primary" />
//               </div>
//               <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-muted-foreground italic">
//                 {userRole === Role.INDIVIDUAL_LEARNER ? "Personal Academic Hub" : "Institutional Revision Hub"}
//               </span>
//           </div>
          
//           <h1 className="text-3xl md:text-5xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none mb-10">
//               {initialLesson?.title || topicMetadata?.title}
//           </h1>

//           <div className="flex p-1.5 bg-surface rounded-2xl w-fit border border-border shadow-xl">
//               <button 
//                   onClick={() => handleTabSwitch('content')}
//                   className={cn(
//                       "px-8 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all",
//                       activeTab === 'content' ? "bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-200" : "text-muted-foreground hover:text-foreground"
//                   )}
//               >
//                   Material Notes
//               </button>
//               <button 
//                   onClick={() => handleTabSwitch('practice')}
//                   className={cn(
//                       "px-8 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all flex items-center gap-2",
//                       activeTab === 'practice' ? "bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-200" : "text-muted-foreground hover:text-foreground"
//                   )}
//               >
//                   <History className="h-4 w-4" /> Practice Hub
//               </button>
//           </div>
//         </header>

//         {/* ── CONTENT TIER ── */}
//         <main className="min-w-0">
//           {activeTab === 'content' && content && (
//             <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
              
//               <div className="flex flex-wrap gap-3">
//                   {content.learningObjectives.map((obj, i) => (
//                       <Badge key={i} variant="outline" className="px-4 py-2 bg-surface border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
//                         <GraduationCap className="h-3.5 w-3.5 mr-2 text-school-primary" /> {obj}
//                       </Badge>
//                   ))}
//               </div>

//               <section className="space-y-6">
//                 <div className="flex items-center gap-4 ml-2">
//                     <div className="h-1 w-8 bg-school-primary rounded-full" />
//                     <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Theoretical Context</h2>
//                 </div>
//                 <div className="bg-card p-8 md:p-12 rounded-[2rem] border border-border shadow-2xl relative overflow-hidden group">
//                   <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 blur-3xl rounded-full opacity-40" />
//                   <p className="relative z-10 text-foreground text-xl md:text-2xl leading-loose italic font-medium">
//                     {content.summary}
//                   </p>
//                 </div>
//               </section>

//               {/* PRIMARY CONTENT (Masked for restricted school STUDENTS via server action) */}
//               <section className="space-y-6">
//                 <div className="flex items-center gap-4 ml-2">
//                     <div className="h-1 w-8 bg-school-primary rounded-full" />
//                     <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Pedagogical Framework</h2>
//                 </div>
//                 <div className={cn(
//                   "bg-card p-8 md:p-12 rounded-[2rem] border border-border shadow-xl text-foreground/80 whitespace-pre-line leading-relaxed text-lg font-medium italic",
//                   userRole === Role.STUDENT && "text-muted-foreground/50 italic text-sm text-center"
//                 )}>
//                   {content.explanation}
//                 </div>
//               </section>

//               {/* WORKED EXAMPLES — server sends [] for restricted school students */}
//               {content.examples.length > 0 && (
//                 <section className="space-y-6">
//                   <div className="flex items-center gap-4 ml-2">
//                       <div className="h-1 w-8 bg-school-primary rounded-full" />
//                       <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Worked Examples</h2>
//                   </div>
//                   <div className="space-y-4">
//                       {content.examples.map((ex, i) => (
//                       <Card key={i} className="bg-surface border-border rounded-[2rem] overflow-hidden shadow-lg">
//                           <CardContent className="p-8 space-y-4">
//                               <div>
//                                   <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest mb-2">Task</p>
//                                   <p className="text-base font-semibold text-foreground">{ex.task}</p>
//                               </div>
//                               <div className="pt-4 border-t border-border">
//                                   <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest mb-2">Solution</p>
//                                   <p className="text-base text-foreground/80 whitespace-pre-line">{ex.solution}</p>
//                               </div>
//                           </CardContent>
//                       </Card>
//                       ))}
//                   </div>
//                 </section>
//               )}

//               {/* VISUAL HUB — server sends [] for restricted school students */}
//               {content.visualAids.length > 0 && (
//                 <section className="space-y-6">
//                     <div className="flex items-center gap-4 ml-2">
//                         <div className="h-1 w-8 bg-school-primary rounded-full" />
//                         <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Visual Hubs</h2>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {content.visualAids.map((v, i) => (
//                         <Card key={i} className="bg-surface border-border rounded-[2rem] overflow-hidden group hover:border-school-primary-300 transition-all shadow-lg">
//                             <CardContent className="p-8 space-y-4">
//                                 <div className="flex items-center gap-3">
//                                     <Sparkles className="h-4 w-4 text-school-primary" />
//                                     <h4 className="text-base font-extrabold text-foreground uppercase italic tracking-tight">{v.title}</h4>
//                                 </div>
//                                 <p className="text-sm text-muted-foreground leading-relaxed font-semibold uppercase tracking-tight opacity-70">
//                                     {v.description}
//                                 </p>
//                             </CardContent>
//                         </Card>
//                         ))}
//                     </div>
//                 </section>
//               )}

//               {/* AI QUIZ — assessment for this topic, shown to every role */}
//               {content.quiz.length > 0 && (
//                 <QuizAssessment
//                   quiz={content.quiz}
//                   topicId={topicId}
//                   gradeSubjectId={gradeSubjectId}
//                   schoolId={schoolId}
//                   studentId={userId}
//                   userRole={userRole}
//                   existingAttempt={existingAttempt}
//                 />
//               )}
//             </div>
//           )}

//           {activeTab === 'practice' && (
//             <div className="animate-in fade-in slide-in-from-right-6 duration-700">
//                 <ScannedQuestionRegistry questions={practiceNodes} userRole={userRole} />
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }

// // ── QUIZ ASSESSMENT SUB-COMPONENT ────────────────────────────────────────────
// // Selections are hidden from grading logic until submit — correctness is
// // never computed or revealed client-side before that point, and the score
// // itself is computed server-side against the authoritative quiz content.

// interface QuizAssessmentProps {
//   quiz: EnhancedLessonContent['studentContent']['quiz'];
//   topicId: string;
//   gradeSubjectId: string;
//   schoolId: string | null;
//   studentId: string;
//   userRole: Role;
//   existingAttempt: ExistingQuizAttempt | null;
// }

// function QuizAssessment({ quiz, topicId, gradeSubjectId, schoolId, studentId, userRole, existingAttempt }: QuizAssessmentProps) {
//   const [answers, setAnswers] = useState<Record<number, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [result, setResult] = useState<{ score: number; maxScore: number; results: QuizQuestionResult[] } | null>(
//     existingAttempt ? { score: existingAttempt.score, maxScore: existingAttempt.maxScore, results: existingAttempt.results } : null
//   );
//   const isLocked = !!existingAttempt;

//   const allAnswered = quiz.every((_, idx) => !!answers[idx]);

//   const handleSelect = (questionIdx: number, option: string) => {
//     if (result) return; // locked after submission
//     setAnswers((prev) => ({ ...prev, [questionIdx]: option }));
//   };

//   const handleSubmit = async () => {
//     if (!allAnswered) {
//       toast.error("Answer every question before submitting.");
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const res = await submitQuizAssessment({
//         topicId,
//         gradeSubjectId,
//         schoolId,
//         studentId,
//         userRole,
//         answers,
//       });

//       if (!res.success || !res.results || res.score === undefined || res.maxScore === undefined) {
//         throw new Error(res.error ?? "Failed to submit quiz.");
//       }

//       setResult({ score: res.score, maxScore: res.maxScore, results: res.results });
//       toast.success(res.alreadySubmitted ? "Showing your previously recorded score." : "Quiz submitted — score recorded.");
//     } catch (err: unknown) {
//       toast.error(getErrorMessage(err));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <section className="space-y-6">
//       <div className="flex items-center justify-between ml-2">
//         <div className="flex items-center gap-4">
//           <div className="h-1 w-8 bg-school-primary rounded-full" />
//           <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">
//             Assessment Quiz
//           </h2>
//         </div>
//         {result && (
//           <div className="flex items-center gap-3 pr-4">
//             {isLocked && (
//               <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
//                 Submitted
//               </span>
//             )}
//             <div className="flex items-center gap-2">
//               <Award className="h-4 w-4 text-school-primary" />
//               <span className="text-xs font-extrabold text-foreground">
//                 {result.score} / {result.maxScore}
//               </span>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="space-y-4">
//         {quiz.map((q, i) => {
//           const graded = result?.results[i];
//           return (
//             <Card key={i} className="bg-surface border-border rounded-[2rem] overflow-hidden shadow-lg">
//               <CardContent className="p-8 space-y-4">
//                 <div className="flex items-start gap-3">
//                   <HelpCircle className="h-4 w-4 text-school-primary mt-1 shrink-0" />
//                   <p className="text-base font-semibold text-foreground">{q.question}</p>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
//                   {q.options.map((opt, oi) => {
//                     const isSelected = answers[i] === opt;
//                     const showCorrect = !!graded && opt === graded.correctAnswer;
//                     const showIncorrectSelected = !!graded && isSelected && !graded.isCorrect;

//                     return (
//                       <button
//                         key={oi}
//                         type="button"
//                         disabled={!!result}
//                         onClick={() => handleSelect(i, opt)}
//                         className={cn(
//                           "px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all",
//                           !result && isSelected && "border-school-primary bg-school-primary/10 text-foreground",
//                           !result && !isSelected && "border-border bg-background text-foreground/70 hover:border-school-primary/30",
//                           showCorrect && "border-emerald-400/50 bg-emerald-500/10 text-emerald-600",
//                           showIncorrectSelected && "border-red-400/50 bg-red-500/10 text-red-600",
//                           result && !isSelected && !showCorrect && "border-border bg-background text-foreground/40"
//                         )}
//                       >
//                         <span className="flex items-center justify-between gap-2">
//                           {opt}
//                           {showCorrect && <CheckCircle2 className="h-4 w-4 shrink-0" />}
//                           {showIncorrectSelected && <XCircle className="h-4 w-4 shrink-0" />}
//                         </span>
//                       </button>
//                     );
//                   })}
//                 </div>

//                 {graded && (
//                   <div className="pl-7 pt-2 animate-in fade-in duration-300">
//                     <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest mb-1">
//                       Explanation
//                     </p>
//                     <p className="text-sm text-foreground/70">{graded.explanation}</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {!result && (
//         <div className="flex justify-end pt-2">
//           <Button
//             type="button"
//             onClick={handleSubmit}
//             disabled={!allAnswered || isSubmitting}
//             className="h-12 px-8 rounded-xl bg-school-primary text-on-school-primary font-extrabold text-[10px] uppercase tracking-widest disabled:opacity-40"
//           >
//             {isSubmitting ? (
//               <span className="flex items-center gap-2">
//                 <Loader2 className="h-4 w-4 animate-spin" /> Grading...
//               </span>
//             ) : (
//               "Submit Quiz"
//             )}
//           </Button>
//         </div>
//       )}
//     </section>
//   );
// }



'use client'

import React, { useState, useEffect } from "react"
import { Layers, GraduationCap, History, Sparkles, Loader2, HelpCircle, CheckCircle2, XCircle, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { type EnhancedLessonContent, generateTopicContent } from "@/app/actions/ai-generator"
import { submitQuizAssessment, type QuizQuestionResult, type ExistingQuizAttempt } from "@/app/actions/quiz.actions"
import { Question, Role } from "@prisma/client"
import { ScannedQuestionRegistry, type ScannedQuestion } from "@/components/scan/scannedQuestionRegistry"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/error-handler"
import { toast } from "sonner"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

// ── Markdown Renderer Overrides ─────────────────────────────────────────────
// Applied to lesson explanation content — the AI is prompted to output
// Markdown headings/tables, so raw '#' and '*' must be parsed, not just
// displayed as plain text. Headings render in the school-primary brand
// color, underlined, instead of showing the literal markdown syntax.

const lessonMarkdownComponents: Components = {
  h1: ({ ...props }) => (
    <h1
      className="text-2xl font-extrabold uppercase italic tracking-tight text-school-primary underline underline-offset-4 decoration-2 mt-8 mb-4 first:mt-0"
      {...props}
    />
  ),
  h2: ({ ...props }) => (
    <h2
      className="text-xl font-extrabold uppercase italic tracking-tight text-school-primary underline underline-offset-4 decoration-2 mt-7 mb-3 first:mt-0"
      {...props}
    />
  ),
  h3: ({ ...props }) => (
    <h3
      className="text-lg font-extrabold uppercase italic tracking-tight text-school-primary underline underline-offset-4 mt-6 mb-2 first:mt-0"
      {...props}
    />
  ),
  strong: ({ ...props }) => <strong className="font-extrabold text-foreground" {...props} />,
  em: ({ ...props }) => <em className="italic text-foreground/90" {...props} />,
  p: ({ ...props }) => <p className="mb-4 leading-relaxed last:mb-0" {...props} />,
  ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 space-y-1.5" {...props} />,
  ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-1.5" {...props} />,
  li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
  table: ({ ...props }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-border">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: ({ ...props }) => <thead className="bg-surface" {...props} />,
  th: ({ ...props }) => (
    <th className="border-b border-border px-4 py-3 text-left font-extrabold uppercase text-[10px] tracking-widest text-muted-foreground" {...props} />
  ),
  td: ({ ...props }) => <td className="border-b border-border px-4 py-3" {...props} />,
  blockquote: ({ ...props }) => (
    <blockquote className="border-l-4 border-school-primary pl-4 italic text-foreground/70 my-4" {...props} />
  ),
};

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface LessonContentClientProps {
  initialLesson: {
    id: string;
    title: string;
    aiContent: EnhancedLessonContent;
  } | null; // Nullable for auto-synthesis phase
  isGenerated: boolean;
  topicMetadata?: { title: string; subject: string } | null;
  initialScannedQuestions: Question[];
  topicId: string;
  gradeSubjectId: string;
  existingAttempt: ExistingQuizAttempt | null;
  userId: string;
  schoolId: string | null;
  userRole: Role;
}

/**
 * STUDENT MODULE VIEWER (Tier 3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 24: Auto-Synthesis - Triggers AI generation if content is missing.
 */
export function LessonContentClient({ 
  initialLesson, 
  isGenerated,
  topicMetadata,
  initialScannedQuestions,
  topicId,
  gradeSubjectId,
  existingAttempt,
  userId,
  schoolId,
  userRole
}: LessonContentClientProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'practice'>('content');
  const [isSynthesizing, setIsSynthesizing] = useState(!isGenerated);
  const synthesisTriggered = React.useRef(false);

  /**
   * Rule 24: Auto-Synthesis Protocol
   * Triggers the AI Syllabus Hub if the module has no synthesized content.
   * Guarded against React 18 Strict Mode's double-invoke-on-mount behavior
   * in dev — without this, two concurrent synthesis requests can fire for
   * the same topic, doubling load on both the DB and the AI provider.
   */
  useEffect(() => {
    if (!isGenerated && !synthesisTriggered.current) {
      synthesisTriggered.current = true;
      const runSynthesis = async () => {
        try {
          const res = await generateTopicContent({
            topicId,
            userId,
            schoolId,
            userRole
          });
          if (res.success) {
            toast.success("Academic module synthesized successfully.");
            window.location.reload(); // Refresh to hydrate with new content
          } else {
            throw new Error(res.error);
          }
        } catch (error) {
          toast.error(`Synthesis Hub Fault: ${getErrorMessage(error)}`);
          setIsSynthesizing(false);
          synthesisTriggered.current = false; // allow retry on genuine failure
        }
      };
      runSynthesis();
    }
  }, [isGenerated, topicId, userId, schoolId, userRole]);

  // ── LOADING STATE: SYNTHESIS HUB ──
  if (isSynthesizing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in">
        <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-school-primary opacity-20" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-school-primary animate-pulse" />
        </div>
        <div className="text-center space-y-3">
            <h2 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter">
                Synthesizing {topicMetadata?.title || "Module"}
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] animate-pulse">
                AI Hub is constructing high-fidelity academic modules...
            </p>
        </div>
      </div>
    );
  }

  // Safe access to content after synthesis check
  const content = initialLesson?.aiContent.studentContent;

  const handleTabSwitch = (tab: 'content' | 'practice') => {
    try {
        setActiveTab(tab);
    } catch (error: unknown) {
        console.error(`[MODULE_TAB_SYNC_FAULT]: ${getErrorMessage(error)}`);
    }
  };

  const practiceNodes: ScannedQuestion[] = initialScannedQuestions.map(q => ({
    text: q.text,
    answer: q.correctAnswer,
    explanation: q.explanation ?? "Registry rationale pending sync.",
    marks: q.points,
    year: q.year ?? undefined,
    examBody: q.examBody ?? undefined
  }));

  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 pb-32">
        
        {/* ── HEADER (Rule 11/21) ── */}
        <header className="border-b border-border pb-10">
          <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-school-primary-50 border border-school-primary-200 shadow-inner">
                  <Layers className="h-5 w-5 text-school-primary" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-muted-foreground italic">
                {userRole === Role.INDIVIDUAL_LEARNER ? "Personal Academic Hub" : "Institutional Revision Hub"}
              </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none mb-10">
              {initialLesson?.title || topicMetadata?.title}
          </h1>

          <div className="flex p-1.5 bg-surface rounded-2xl w-fit border border-border shadow-xl">
              <button 
                  onClick={() => handleTabSwitch('content')}
                  className={cn(
                      "px-8 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all",
                      activeTab === 'content' ? "bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-200" : "text-muted-foreground hover:text-foreground"
                  )}
              >
                  Material Notes
              </button>
              <button 
                  onClick={() => handleTabSwitch('practice')}
                  className={cn(
                      "px-8 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all flex items-center gap-2",
                      activeTab === 'practice' ? "bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-200" : "text-muted-foreground hover:text-foreground"
                  )}
              >
                  <History className="h-4 w-4" /> Practice Hub
              </button>
          </div>
        </header>

        {/* ── CONTENT TIER ── */}
        <main className="min-w-0">
          {activeTab === 'content' && content && (
            <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
              
              <div className="flex flex-wrap gap-3">
                  {content.learningObjectives.map((obj, i) => (
                      <Badge key={i} variant="outline" className="px-4 py-2 bg-surface border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <GraduationCap className="h-3.5 w-3.5 mr-2 text-school-primary" /> {obj}
                      </Badge>
                  ))}
              </div>

              <section className="space-y-6">
                <div className="flex items-center gap-4 ml-2">
                    <div className="h-1 w-8 bg-school-primary rounded-full" />
                    <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Theoretical Context</h2>
                </div>
                <div className="bg-card p-8 md:p-12 rounded-[2rem] border border-border shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 blur-3xl rounded-full opacity-40" />
                  <p className="relative z-10 text-foreground text-xl md:text-2xl leading-loose italic font-medium">
                    {content.summary}
                  </p>
                </div>
              </section>

              {/* PRIMARY CONTENT (Masked for restricted school STUDENTS via server action) */}
              <section className="space-y-6">
                <div className="flex items-center gap-4 ml-2">
                    <div className="h-1 w-8 bg-school-primary rounded-full" />
                    <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Pedagogical Framework</h2>
                </div>
                <div className={cn(
                  "bg-card p-8 md:p-12 rounded-[2rem] border border-border shadow-xl text-foreground/80 leading-relaxed text-lg font-medium",
                  userRole === Role.STUDENT && "text-muted-foreground/50 italic text-sm text-center"
                )}>
                  {userRole === Role.STUDENT ? (
                    content.explanation
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={lessonMarkdownComponents}>
                      {content.explanation}
                    </ReactMarkdown>
                  )}
                </div>
              </section>

              {/* WORKED EXAMPLES — server sends [] for restricted school students */}
              {content.examples.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-4 ml-2">
                      <div className="h-1 w-8 bg-school-primary rounded-full" />
                      <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Worked Examples</h2>
                  </div>
                  <div className="space-y-4">
                      {content.examples.map((ex, i) => (
                      <Card key={i} className="bg-surface border-border rounded-[2rem] overflow-hidden shadow-lg">
                          <CardContent className="p-8 space-y-4">
                              <div>
                                  <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest mb-2">Task</p>
                                  <p className="text-base font-semibold text-foreground">{ex.task}</p>
                              </div>
                              <div className="pt-4 border-t border-border">
                                  <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest mb-2">Solution</p>
                                  <p className="text-base text-foreground/80 whitespace-pre-line">{ex.solution}</p>
                              </div>
                          </CardContent>
                      </Card>
                      ))}
                  </div>
                </section>
              )}

              {/* VISUAL HUB — server sends [] for restricted school students */}
              {content.visualAids.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-center gap-4 ml-2">
                        <div className="h-1 w-8 bg-school-primary rounded-full" />
                        <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">Visual Hubs</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {content.visualAids.map((v, i) => (
                        <Card key={i} className="bg-surface border-border rounded-[2rem] overflow-hidden group hover:border-school-primary-300 transition-all shadow-lg">
                            <CardContent className="p-8 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="h-4 w-4 text-school-primary" />
                                    <h4 className="text-base font-extrabold text-foreground uppercase italic tracking-tight">{v.title}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed font-semibold uppercase tracking-tight opacity-70">
                                    {v.description}
                                </p>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                </section>
              )}

              {/* AI QUIZ — assessment for this topic, shown to every role */}
              {content.quiz.length > 0 && (
                <QuizAssessment
                  quiz={content.quiz}
                  topicId={topicId}
                  gradeSubjectId={gradeSubjectId}
                  schoolId={schoolId}
                  studentId={userId}
                  userRole={userRole}
                  existingAttempt={existingAttempt}
                />
              )}
            </div>
          )}

          {activeTab === 'practice' && (
            <div className="animate-in fade-in slide-in-from-right-6 duration-700">
                <ScannedQuestionRegistry questions={practiceNodes} userRole={userRole} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── QUIZ ASSESSMENT SUB-COMPONENT ────────────────────────────────────────────
// Selections are hidden from grading logic until submit — correctness is
// never computed or revealed client-side before that point, and the score
// itself is computed server-side against the authoritative quiz content.

interface QuizAssessmentProps {
  quiz: EnhancedLessonContent['studentContent']['quiz'];
  topicId: string;
  gradeSubjectId: string;
  schoolId: string | null;
  studentId: string;
  userRole: Role;
  existingAttempt: ExistingQuizAttempt | null;
}

function QuizAssessment({ quiz, topicId, gradeSubjectId, schoolId, studentId, userRole, existingAttempt }: QuizAssessmentProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; maxScore: number; results: QuizQuestionResult[] } | null>(
    existingAttempt ? { score: existingAttempt.score, maxScore: existingAttempt.maxScore, results: existingAttempt.results } : null
  );
  const isLocked = !!existingAttempt;

  const allAnswered = quiz.every((_, idx) => !!answers[idx]);

  const handleSelect = (questionIdx: number, option: string) => {
    if (result) return; // locked after submission
    setAnswers((prev) => ({ ...prev, [questionIdx]: option }));
  };

  const handleSubmit = async () => {
    if (!allAnswered) {
      toast.error("Answer every question before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await submitQuizAssessment({
        topicId,
        gradeSubjectId,
        schoolId,
        studentId,
        userRole,
        answers,
      });

      if (!res.success || !res.results || res.score === undefined || res.maxScore === undefined) {
        throw new Error(res.error ?? "Failed to submit quiz.");
      }

      setResult({ score: res.score, maxScore: res.maxScore, results: res.results });
      toast.success(res.alreadySubmitted ? "Showing your previously recorded score." : "Quiz submitted — score recorded.");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between ml-2">
        <div className="flex items-center gap-4">
          <div className="h-1 w-8 bg-school-primary rounded-full" />
          <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest italic">
            Assessment Quiz
          </h2>
        </div>
        {result && (
          <div className="flex items-center gap-3 pr-4">
            {isLocked && (
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                Submitted
              </span>
            )}
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-school-primary" />
              <span className="text-xs font-extrabold text-foreground">
                {result.score} / {result.maxScore}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {quiz.map((q, i) => {
          const graded = result?.results[i];
          return (
            <Card key={i} className="bg-surface border-border rounded-[2rem] overflow-hidden shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-4 w-4 text-school-primary mt-1 shrink-0" />
                  <p className="text-base font-semibold text-foreground">{q.question}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
                  {q.options.map((opt, oi) => {
                    const isSelected = answers[i] === opt;
                    const showCorrect = !!graded && opt === graded.correctAnswer;
                    const showIncorrectSelected = !!graded && isSelected && !graded.isCorrect;

                    return (
                      <button
                        key={oi}
                        type="button"
                        disabled={!!result}
                        onClick={() => handleSelect(i, opt)}
                        className={cn(
                          "px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all",
                          !result && isSelected && "border-school-primary bg-school-primary/10 text-foreground",
                          !result && !isSelected && "border-border bg-background text-foreground/70 hover:border-school-primary/30",
                          showCorrect && "border-emerald-400/50 bg-emerald-500/10 text-emerald-600",
                          showIncorrectSelected && "border-red-400/50 bg-red-500/10 text-red-600",
                          result && !isSelected && !showCorrect && "border-border bg-background text-foreground/40"
                        )}
                      >
                        <span className="flex items-center justify-between gap-2">
                          {opt}
                          {showCorrect && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                          {showIncorrectSelected && <XCircle className="h-4 w-4 shrink-0" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {graded && (
                  <div className="pl-7 pt-2 animate-in fade-in duration-300">
                    <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest mb-1">
                      Explanation
                    </p>
                    <p className="text-sm text-foreground/70">{graded.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!result && (
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className="h-12 px-8 rounded-xl bg-school-primary text-on-school-primary font-extrabold text-[10px] uppercase tracking-widest disabled:opacity-40"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Grading...
              </span>
            ) : (
              "Submit Quiz"
            )}
          </Button>
        </div>
      )}
    </section>
  );
}
