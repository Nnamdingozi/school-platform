// 'use client'

// import { use, useEffect, useState } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { getLessonForTopic } from "@/app/actions/lesson.actions"
// import { LessonAiContent } from "@/app/actions/ai-generator"
// import { 
//     ArrowLeft, BookOpen, Clock, 
//     CheckCircle2, Loader2, Info, 
//     ChevronRight, ImageIcon, GraduationCap
// } from "lucide-react"
// import Link from "next/link"
// import ReactMarkdown from "react-markdown"
// import Image from "next/image"
// import { Card, CardContent } from "@/components/ui/card"
// import { cn } from "@/lib/utils"

// interface PageProps {
//     params: Promise<{ topicId: string }>
// }

// export default function StudentLessonPage({ params }: PageProps) {
//     const { topicId } = use(params)
//     const { profile, isLoading: isProfileLoading } = useProfileStore()
    
//     const [lesson, setLesson] = useState<LessonAiContent | null>(null)
//     const [loading, setLoading] = useState(true)

//     const schoolId = profile?.schoolId ?? ''

//     useEffect(() => {
//         if (!schoolId || !topicId) return
//         getLessonForTopic(topicId, schoolId).then(res => {
//             if (res.success && res.data) {
//                 setLesson(res.data.aiContent as unknown as LessonAiContent)
//             }
//             setLoading(false)
//         })
//     }, [topicId, schoolId])

//     if (isProfileLoading || loading) {
//         return (
//             <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//                 <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//                 <p className="text-slate-500 font-mono text-[10px] uppercase mt-4">Opening_Study_Vault...</p>
//             </div>
//         )
//     }

//     if (!lesson) return (
//         <div className="p-20 text-center text-slate-500 italic">
//             This lesson is still being prepared by your teacher. Check back soon!
//         </div>
//     )

//     // Extraction: Strictly Student-Facing Content
//     const content = lesson.studentContent;

//     return (
//         <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50">
            
//             {/* ── Header ── */}
//             <header className="space-y-6">
//                 <Link href="/student" className="text-school-primary text-[10px] font-black uppercase flex items-center gap-2 hover:underline">
//                     <ArrowLeft className="h-3 w-3" /> Back to Learning Hub
//                 </Link>
                
//                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
//                     <div>
//                         <div className="flex items-center gap-2 mb-2">
//                              <div className="p-1.5 bg-school-primary/10 rounded-lg border border-school-primary/20">
//                                 <BookOpen className="h-4 w-4 text-school-primary" />
//                              </div>
//                              <span className="text-[10px] font-black text-school-primary uppercase tracking-widest">Study Module</span>
//                         </div>
//                         <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">{content.title}</h1>
//                     </div>
//                     <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-2xl border border-white/5">
//                         <GraduationCap className="h-4 w-4 text-slate-500" />
//                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile?.school?.name}</span>
//                     </div>
//                 </div>
//             </header>

//             <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
                
//                 {/* ── Main Notes Area ── */}
//                 <main className="space-y-12">
                    
//                     {/* Objectives */}
//                     <section className="bg-slate-900 border border-white/5 rounded-[2rem] p-8 shadow-2xl">
//                         <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
//                             <CheckCircle2 className="h-4 w-4 text-emerald-500" /> What you will learn
//                         </h3>
//                         <ul className="space-y-3">
//                             {content.learningObjectives.map((obj, i) => (
//                                 <li key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
//                                     <span className="text-school-primary font-black">0{i+1}</span>
//                                     {obj}
//                                 </li>
//                             ))}
//                         </ul>
//                     </section>

//                     {/* The Body (Markdown) */}
//                     <article className="prose prose-invert max-w-none px-4 prose-p:text-slate-300 prose-headings:italic prose-headings:font-black prose-strong:text-school-primary">
//                         <ReactMarkdown>{content.explanation}</ReactMarkdown>
//                     </article>

//                     {/* Visual Aids */}
//                     {content.visualAids.length > 0 && (
//                         <section className="space-y-6">
//                             <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 px-4">
//                                 <ImageIcon className="h-4 w-4 text-school-primary" /> Visual Resources
//                             </h3>
//                             <div className="grid grid-cols-1 gap-8">
//                                 {content.visualAids.map((aid, idx) => aid.url && (
//                                     <Card key={idx} className="bg-slate-900 border-white/5 overflow-hidden rounded-[2rem]">
//                                         <div className="p-6 border-b border-white/5">
//                                             <p className="text-xs font-bold text-white uppercase">{aid.title}</p>
//                                             <p className="text-[10px] text-slate-500 mt-1">{aid.description}</p>
//                                         </div>
//                                         <div className="p-2 bg-slate-950">
//                                             <Image 
//                                                 src={aid.url} 
//                                                 alt={aid.title} 
//                                                 width={800} 
//                                                 height={500} 
//                                                 className="w-full h-auto rounded-2xl"
//                                             />
//                                         </div>
//                                     </Card>
//                                 ))}
//                             </div>
//                         </section>
//                     )}

//                     {/* Summary */}
//                     <section className="bg-school-primary/5 border border-school-primary/20 rounded-[2rem] p-8">
//                         <h3 className="text-xs font-black text-school-primary uppercase tracking-[0.2em] mb-4">Key Summary</h3>
//                         <p className="text-sm text-slate-300 leading-relaxed italic">&quot;{content.summary}&quot;</p>
//                     </section>
//                 </main>

//                 {/* ── Sidebar: Vocabulary & Meta ── */}
//                 <aside className="space-y-6">
//                     <div className="sticky top-24 space-y-6">
//                         {/* Vocabulary List */}
//                         <Card className="bg-slate-900 border-white/5 rounded-[2rem] p-6 shadow-xl">
//                             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Keywords</h4>
//                             <div className="flex flex-wrap gap-2">
//                                 {content.vocabulary.map((word) => (
//                                     <span key={word} className="bg-slate-950 border border-white/10 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-tighter hover:border-school-primary/40 transition-colors">
//                                         {word}
//                                     </span>
//                                 ))}
//                             </div>
//                         </Card>

//                         {/* Quiz Call to Action */}
//                         <Link href={`/student/quizzes/${topicId}`} className="block group">
//                             <Card className="bg-school-primary border-none rounded-[2rem] p-6 shadow-2xl shadow-school-primary/10 group-hover:scale-[1.02] transition-all">
//                                 <div className="flex justify-between items-start mb-4">
//                                     <div className="p-2 bg-slate-950 rounded-xl">
//                                         <Zap className="h-5 w-5 text-school-primary" />
//                                     </div>
//                                     <ChevronRight className="h-5 w-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
//                                 </div>
//                                 <h4 className="text-slate-950 font-black uppercase text-sm leading-tight">Test Your<br/>Knowledge</h4>
//                                 <p className="text-slate-950/60 text-[9px] font-bold uppercase mt-2 tracking-widest">Start Quiz Now</p>
//                             </Card>
//                         </Link>
//                     </div>
//                 </aside>
//             </div>
//         </div>
//     )
// }

// function Zap({ className }: { className?: string }) {
//     return (
//         <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
//         </svg>
//     )
// }



// 'use client'

// import { use, useEffect, useState } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { getLessonForTopic } from "@/app/actions/lesson.actions"
// import { AILessonPlanner, type EnhancedLessonContent } from "@/components/TeacherDashboard/ai-learning-planner"
// import { ArrowLeft, Loader2 } from "lucide-react"
// import Link from "next/link"

// interface PageProps {
//     params: Promise<{ topicId: string }>
// }

// export default function StudentLessonPage({ params }: PageProps) {
//     const { topicId } = use(params)
//     const { profile, isLoading: isProfileLoading } = useProfileStore()
    
//     const [lessonId, setLessonId] = useState<string>("")
//     const [lessonContent, setLessonContent] = useState<EnhancedLessonContent | null>(null)
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         if (!profile?.schoolId || !topicId) return

//         async function fetchContent() {
//             setLoading(true)
//             const res = await getLessonForTopic(topicId, profile!.schoolId!)
//             if (res.success && res.data) {
//                 setLessonId(res.data.id)
//                 setLessonContent(res.data.aiContent as unknown as EnhancedLessonContent)
//             }
//             setLoading(false)
//         }
//         fetchContent()
//     }, [topicId, profile?.schoolId, profile])

//     if (isProfileLoading || loading) {
//         return (
//             <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//                 <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//                 <p className="text-slate-500 font-mono text-[10px] mt-4 uppercase">Syncing_Study_Vault...</p>
//             </div>
//         )
//     }

//     return (
//         <div className="max-w-7xl mx-auto p-4 md:p-12 space-y-8 bg-slate-950 min-h-screen">
//             <Link href="/student" className="text-school-primary text-[10px] font-black uppercase flex items-center gap-2">
//                 <ArrowLeft className="h-3 w-3" /> Back to HUB
//             </Link>

//             <AILessonPlanner 
//                 topicId={topicId}
//                 schoolId={profile!.schoolId!}
//                 lessonId={lessonId}
//                 topicTitle="Study Portal"
//                 initialData={lessonContent}
//                 mode="student" // ✅ PRO APPROACH: Same code, student view
//             />
//         </div>
//     )
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { getStudentLesson } from "@/app/actions/lesson.actions";
// import { transformLessonByRole } from "@/lib/lessons/transformLessons";
// import { Loader2 } from "lucide-react";

// export default function StudentLessonPage({
//   params,
// }: {
//   params: { topicId: string };
// }) {
//   const { profile } = useProfileStore();

//   const [lesson, setLesson] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       if (!profile?.schoolId) return;

//       const res = await getStudentLesson(params.topicId, profile.schoolId);

//       if (res.success && res.data) {
//         const transformed = transformLessonByRole(
//           res.data.aiContent,
//           "student"
//         );

//         setLesson({
//           ...res.data,
//           view: transformed,
//         });
//       }

//       setLoading(false);
//     }

//     load();
//   }, [params.topicId, profile]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950">
//         <Loader2 className="h-8 w-8 animate-spin text-white" />
//       </div>
//     );
//   }

//   if (!lesson) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-slate-500">
//         No lesson available
//       </div>
//     );
//   }

//   const view = lesson.view;

//   return (
//     <div className="p-6 max-w-4xl mx-auto text-white space-y-6">

//       {/* HEADER */}
//       <div>
//         <h1 className="text-2xl font-black uppercase">
//           {lesson.subject}
//         </h1>
//         <p className="text-slate-500 text-sm">{lesson.title}</p>
//       </div>

//       {/* SUMMARY (PRIMARY) */}
//       <div className="bg-slate-900 p-5 rounded-2xl border border-white/5">
//         <h2 className="text-sm font-black uppercase mb-2">Summary</h2>
//         <p className="text-slate-300 text-sm leading-relaxed">
//           {view?.summary}
//         </p>
//       </div>

//       {/* GUIDED NOTES */}
//       <div className="bg-slate-900 p-5 rounded-2xl border border-white/5">
//         <h2 className="text-sm font-black uppercase mb-2">
//           Key Notes
//         </h2>
//         <p className="text-slate-300 text-sm whitespace-pre-line">
//           {view?.guidedNotes}
//         </p>
//       </div>

//       {/* VISUAL AIDS */}
//       {view?.visualAids?.length > 0 && (
//         <div className="bg-slate-900 p-5 rounded-2xl border border-white/5">
//           <h2 className="text-sm font-black uppercase mb-3">
//             Visual Aids
//           </h2>

//           <div className="grid gap-3">
//             {view.visualAids.map((v: any, i: number) => (
//               <div
//                 key={i}
//                 className="p-3 bg-slate-950 rounded-xl border border-white/5"
//               >
//                 <p className="text-sm text-slate-300">{v.title}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }


// "use client";

// import { useEffect, useState, use } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { getStudentLesson } from "@/app/actions/lesson.actions";
// import { transformLessonByRole } from "@/lib/lessons/transformLessons";
// import { Loader2 } from "lucide-react";

// export default function StudentLessonPage({
//   params,
// }: {
//   params: Promise<{ topicId: string }>;
// }) {
//   // ✅ unwrap params
//   const { topicId } = use(params);

//   const { profile } = useProfileStore();

//   const [lesson, setLesson] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       if (!profile?.schoolId || !topicId) return;

//       try {
//         const res = await getStudentLesson(topicId, profile.schoolId);

//         if (res.success && res.data) {
//           const transformed = transformLessonByRole(
//             res.data.aiContent,
//             "student"
//           );

//           setLesson({
//             ...res.data,
//             view: transformed,
//           });
//         }
//       } catch (err) {
//         console.error("Lesson load error:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, [topicId, profile?.schoolId]); // ✅ FIXED dependency

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950">
//         <Loader2 className="h-8 w-8 animate-spin text-white" />
//       </div>
//     );
//   }

//   if (!lesson) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-slate-500">
//         No lesson available
//       </div>
//     );
//   }

//   const view = lesson.view;

//   return (
//     <div className="p-6 max-w-4xl mx-auto text-white space-y-6">

//       {/* HEADER */}
//       <div>
//         <h1 className="text-2xl font-black uppercase">
//           {lesson.subject}
//         </h1>
//         <p className="text-slate-500 text-sm">{lesson.title}</p>
//       </div>

//       {/* SUMMARY */}
//       <div className="bg-slate-900 p-5 rounded-2xl border border-white/5">
//         <h2 className="text-sm font-black uppercase mb-2">Summary</h2>
//         <p className="text-slate-300 text-sm leading-relaxed">
//           {view?.summary}
//         </p>
//       </div>

//       {/* GUIDED NOTES */}
//       <div className="bg-slate-900 p-5 rounded-2xl border border-white/5">
//         <h2 className="text-sm font-black uppercase mb-2">
//           Key Notes
//         </h2>
//         <p className="text-slate-300 text-sm whitespace-pre-line">
//           {view?.guidedNotes}
//         </p>
//       </div>

//       {/* VISUAL AIDS */}
//       {view?.visualAids?.length > 0 && (
//         <div className="bg-slate-900 p-5 rounded-2xl border border-white/5">
//           <h2 className="text-sm font-black uppercase mb-3">
//             Visual Aids
//           </h2>

//           <div className="grid gap-3">
//             {view.visualAids.map((v: any, i: number) => (
//               <div
//                 key={i}
//                 className="p-3 bg-slate-950 rounded-xl border border-white/5"
//               >
//                 <p className="text-sm text-slate-300">{v.title}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// 'use client'

// import { use, useEffect, useState } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { Loader2 } from "lucide-react"

// import { getStudentLesson } from "@/app/actions/lesson.actions"
// import { transformLesson } from "@/lib/lessons/transformLessons"

// interface PageProps {
//   params: Promise<{ topicId: string }>
// }

// type LessonView = {
//   summary?: string
//   guidedNotes?: string
//   visualAids?: any[]
//   quiz?: any[]
// }

// export default function StudentLessonPage({ params }: PageProps) {
//   // ✅ FIX: properly unwrap Next.js async params
//   const { topicId } = use(params)

//   const { profile } = useProfileStore()
//   const schoolId = profile?.schoolId ?? ""

//   const [lesson, setLesson] = useState<any>(null)
//   const [view, setView] = useState<LessonView | null>(null)
//   const [loading, setLoading] = useState(true)

//   // ── Fetch Lesson ─────────────────────────────────────
//   useEffect(() => {
//     if (!schoolId || !topicId) return

//     async function loadLesson() {
//       setLoading(true)

//       try {
//         const res = await getStudentLesson(topicId, schoolId)

//         // ❗ No published lesson exists for this school/topic
//         if (!res.success || !res.data) {
//           setLesson(null)
//           setView(null)
//           return
//         }

//         const lessonData = res.data

//         // transform AI content for student view
//         const transformed = transformLessonByRole(
//           lessonData.aiContent,
//           "student"
//         )

//         setLesson(lessonData)
//         setView(transformed)

//       } catch (err) {
//         console.error("Student lesson load error:", err)
//         setLesson(null)
//         setView(null)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadLesson()
//   }, [topicId, schoolId])

//   // ── Loading State ─────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950">
//         <Loader2 className="h-8 w-8 animate-spin text-white" />
//       </div>
//     )
//   }

//   // ── Empty State (IMPORTANT UX FIX) ────────────────────
//   if (!lesson || !view) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 gap-2 px-6 text-center">
//         <p className="text-lg font-semibold">
//           Lesson not available yet
//         </p>
//         <p className="text-sm text-slate-600">
//           Your teacher has not published this lesson for your school.
//         </p>
//       </div>
//     )
//   }

//   // ── Main Render ───────────────────────────────────────
//   return (
//     <div className="p-6 max-w-4xl mx-auto text-white space-y-6">

//       {/* HEADER */}
//       <div>
//         <h1 className="text-2xl font-black uppercase">
//           {lesson?.subject || "Subject"}
//         </h1>
//         <p className="text-slate-500 text-sm">
//           {lesson?.title || "Lesson"}
//         </p>
//       </div>

//       {/* SUMMARY */}
//       <div className="bg-slate-900 p-5 rounded-2xl border border-white/5">
//         <h2 className="text-sm font-black uppercase mb-2">
//           Summary
//         </h2>
//         <p className="text-slate-300 text-sm leading-relaxed">
//           {view?.summary}
//         </p>
//       </div>

//       {/* GUIDED NOTES */}
//       <div className="bg-slate-900 p-5 rounded-2xl border border-white/5">
//         <h2 className="text-sm font-black uppercase mb-2">
//           Key Notes
//         </h2>
//         <p className="text-slate-300 text-sm whitespace-pre-line">
//           {view?.guidedNotes}
//         </p>
//       </div>

//       {/* VISUAL AIDS */}
//       {view?.visualAids?.length > 0 && (
//         <div className="bg-slate-900 p-5 rounded-2xl border border-white/5">
//           <h2 className="text-sm font-black uppercase mb-3">
//             Visual Aids
//           </h2>

//           <div className="grid gap-3">
//             {view.visualAids.map((v: any, i: number) => (
//               <div
//                 key={i}
//                 className="p-3 bg-slate-950 rounded-xl border border-white/5"
//               >
//                 <p className="text-sm text-slate-300">
//                   {v.title}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* QUIZ (optional future-safe rendering) */}
//       {view?.quiz?.length > 0 && (
//         <div className="bg-slate-900 p-5 rounded-2xl border border-white/5">
//           <h2 className="text-sm font-black uppercase mb-3">
//             Quiz
//           </h2>

//           <div className="space-y-4">
//             {view.quiz.map((q: any, i: number) => (
//               <div
//                 key={i}
//                 className="p-4 bg-slate-950 rounded-xl border border-white/5"
//               >
//                 <p className="text-sm font-semibold text-white mb-2">
//                   {q.question}
//                 </p>

//                 <div className="space-y-1">
//                   {q.options?.map((opt: string) => (
//                     <p
//                       key={opt}
//                       className={`text-xs px-3 py-2 rounded-md border ${
//                         opt === q.answer
//                           ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5"
//                           : "border-white/5 text-slate-400"
//                       }`}
//                     >
//                       {opt}
//                     </p>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//     </div>
//   )
// }


// 'use client'

// import { use, useEffect, useState } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { Loader2, BookOpen, Layers, CheckCircle2 } from "lucide-react"

// import { getStudentLesson } from "@/app/actions/lesson.actions"
// import { transformLesson } from "@/lib/lessons/transformLessons"

// // ── Types ───────────────────────────────────────────────────────────────────

// interface VisualAid {
//   title: string
//   description: string
//   imagePrompt: string
//   url?: string
// }

// interface QuizQuestion {
//   question: string
//   options: string[]
//   answer: string
//   explanation: string
// }

// interface LessonView {
//   summary: string
//   guidedNotes: string
//   visualAids: VisualAid[]
//   quiz: QuizQuestion[]
// }

// interface LessonData {
//   id: string
//   title: string
//   subject: string
//   aiContent: Record<string, unknown> // Passing raw JSON to transform function
// }

// interface PageProps {
//   params: Promise<{ topicId: string }>
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function StudentLessonPage({ params }: PageProps) {
//   const { topicId } = use(params)

//   const { profile } = useProfileStore()
//   const schoolId: string = profile?.schoolId ?? ""

//   const [lesson, setLesson] = useState<LessonData | null>(null)
//   const [view, setView] = useState<LessonView | null>(null)
//   const [loading, setLoading] = useState<boolean>(true)

//   // ── Fetch Lesson ─────────────────────────────────────
//   useEffect(() => {
//     if (!schoolId || !topicId) return

//     async function loadLesson() {
//       setLoading(true)
//       try {
//         const res = await getStudentLesson(topicId, schoolId)

//         if (!res.success || !res.data) {
//           setLesson(null)
//           setView(null)
//           return
//         }

//         // Logic fix: Using transformLesson as imported from your lib
//         const transformed: LessonView = transformLesson(
//           res.data.aiContent,
//           "student"
//         )

//         setLesson(res.data as LessonData)
//         setView(transformed)

//       } catch (err) {
//         console.error("Student lesson load error:", err)
//         setLesson(null)
//         setView(null)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadLesson()
//   }, [topicId, schoolId])

//   // ── Loading State ─────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//         <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">
//           Loading Registry File...
//         </p>
//       </div>
//     )
//   }

//   // ── Empty State ───────────────────────────────────────
//   if (!lesson || !view) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-500 gap-4 px-6 text-center">
//         <BookOpen className="h-12 w-12 text-slate-800" />
//         <div className="space-y-1">
//           <p className="text-lg font-black uppercase italic text-white">
//             Lesson Unavailable
//           </p>
//           <p className="text-sm text-slate-600 max-w-xs mx-auto">
//             Your instructor has not published the academic materials for this topic yet.
//           </p>
//         </div>
//       </div>
//     )
//   }

//   // ── Main Render ───────────────────────────────────────
//   return (
//     <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-10">

//       {/* HEADER */}
//       <div className="border-b border-white/5 pb-8">
//         <div className="flex items-center gap-3 text-school-primary mb-2">
//             <Layers className="h-4 w-4" />
//             <span className="text-[10px] font-black uppercase tracking-[0.3em]">{lesson.subject}</span>
//         </div>
//         <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
//           {lesson.title}
//         </h1>
//       </div>

//       {/* SUMMARY */}
//       <section className="space-y-4">
//         <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//            <div className="h-1 w-4 bg-school-primary" /> Executive Summary
//         </h2>
//         <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 shadow-xl">
//           <p className="text-slate-300 text-lg leading-loose italic">
//             {view.summary}
//           </p>
//         </div>
//       </section>

//       {/* GUIDED NOTES */}
//       <section className="space-y-4">
//         <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//            <div className="h-1 w-4 bg-school-primary" /> Academic Notes
//         </h2>
//         <div className="bg-slate-900 p-8 rounded-[2rem] border border-white/5 shadow-2xl">
//           <div className="text-slate-200 text-base whitespace-pre-line leading-relaxed font-medium">
//             {view.guidedNotes}
//           </div>
//         </div>
//       </section>

//       {/* VISUAL AIDS */}
//       {view.visualAids.length > 0 && (
//         <section className="space-y-4">
//           <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//              <div className="h-1 w-4 bg-school-primary" /> Visual References
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {view.visualAids.map((v, i) => (
//               <div
//                 key={i}
//                 className="p-6 bg-slate-950 rounded-3xl border border-white/5 hover:border-school-primary/20 transition-all group"
//               >
//                 <h4 className="text-sm font-black text-white uppercase italic mb-2">{v.title}</h4>
//                 <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">
//                   {v.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* QUIZ SECTION */}
//       {view.quiz.length > 0 && (
//         <section className="space-y-6 pb-20">
//           <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//              <div className="h-1 w-4 bg-school-primary" /> Knowledge Check
//           </h2>

//           <div className="space-y-4">
//             {view.quiz.map((q, i) => (
//               <div
//                 key={i}
//                 className="p-8 bg-slate-900/40 rounded-[2.5rem] border border-white/5 space-y-6"
//               >
//                 <div className="flex gap-4">
//                     <span className="text-school-primary font-black text-lg italic">0{i+1}</span>
//                     <p className="text-lg font-bold text-white tracking-tight leading-tight">
//                         {q.question}
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
//                   {q.options.map((opt) => (
//                     <div
//                       key={opt}
//                       className={cn(
//                         "text-xs font-black uppercase px-5 py-4 rounded-xl border transition-all",
//                         opt === q.answer
//                           ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5 shadow-inner"
//                           : "border-white/5 text-slate-500 bg-slate-950/50"
//                       )}
//                     >
//                       {opt}
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="pl-10 pt-4 border-t border-white/5">
//                     <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1">Pedagogical Rationale</p>
//                     <p className="text-xs text-slate-500 italic leading-relaxed">{q.explanation}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   )
// }


// 'use client'

// import { use, useEffect, useState } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { Loader2, BookOpen, Layers} from "lucide-react"

// import { getStudentLesson } from "@/app/actions/lesson.actions"
// import { transformLesson } from "@/lib/lessons/transformLessons"
// import { cn } from "@/lib/utils"

// // ── Types ───────────────────────────────────────────────────────────────────

// interface VisualAid {
//   title: string
//   description: string
//   imagePrompt: string
//   url?: string
// }

// interface QuizQuestion {
//   question: string
//   options: string[]
//   answer: string
//   explanation: string
// }

// interface LessonView {
//   summary: string
//   guidedNotes: string
//   visualAids: VisualAid[]
//   quiz: QuizQuestion[]
// }

// interface LessonData {
//   id: string
//   title: string
//   subject: string
//   aiContent: unknown // Using unknown for safer handling of raw JSON
// }

// interface PageProps {
//   params: Promise<{ topicId: string }>
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function StudentLessonPage({ params }: PageProps) {
//   // FIX: Properly unwrap async params using Next.js 'use' hook
//   const { topicId } = use(params)

//   const { profile } = useProfileStore()
//   const schoolId: string = profile?.schoolId ?? ""

//   // FIX: Explicitly typed state
//   const [lesson, setLesson] = useState<LessonData | null>(null)
//   const [view, setView] = useState<LessonView | null>(null)
//   const [loading, setLoading] = useState<boolean>(true)

//   // ── Fetch Lesson ─────────────────────────────────────
//   useEffect(() => {
//     if (!schoolId || !topicId) return

//     async function loadLesson(): Promise<void> {
//       setLoading(true)
//       try {
//         const res = await getStudentLesson(topicId, schoolId)

//         if (!res.success || !res.data) {
//           setLesson(null)
//           setView(null)
//           return
//         }

//         // FIX: Replaced any. Typed the incoming data and transformation.
//         const lessonData = res.data as LessonData
//         const transformed: LessonView = transformLesson(
//           lessonData.aiContent,
//           "student"
//         )

//         setLesson(lessonData)
//         setView(transformed)

//       } catch (err) {
//         console.error("Student lesson load error:", err)
//         setLesson(null)
//         setView(null)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadLesson()
//   }, [topicId, schoolId])

//   // ── Loading State ─────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//         <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">
//           Syncing Academic Assets...
//         </p>
//       </div>
//     )
//   }

//   // ── Empty State ───────────────────────────────────────
//   if (!lesson || !view) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-500 gap-4 px-6 text-center">
//         <BookOpen className="h-12 w-12 text-slate-800" />
//         <div className="space-y-1">
//           <p className="text-lg font-black uppercase italic text-white">
//             Lesson Unavailable
//           </p>
//           <p className="text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
//             Your instructor has not published the academic materials for this topic yet.
//           </p>
//         </div>
//       </div>
//     )
//   }

//   // ── Main Render ───────────────────────────────────────
//   return (
//     <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-10">

//       {/* HEADER */}
//       <div className="border-b border-white/5 pb-8">
//         <div className="flex items-center gap-3 text-school-primary mb-2">
//             <Layers className="h-4 w-4" />
//             <span className="text-[10px] font-black uppercase tracking-[0.3em]">{lesson.subject}</span>
//         </div>
//         <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
//           {lesson.title}
//         </h1>
//       </div>

//       {/* SUMMARY */}
//       <section className="space-y-4">
//         <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//            <div className="h-1 w-4 bg-school-primary" /> Syllabus Summary
//         </h2>
//         <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 shadow-xl">
//           <p className="text-slate-300 text-lg leading-loose italic">
//             {view.summary}
//           </p>
//         </div>
//       </section>

//       {/* GUIDED NOTES */}
//       <section className="space-y-4">
//         <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//            <div className="h-1 w-4 bg-school-primary" /> Guided Academic Notes
//         </h2>
//         <div className="bg-slate-900 p-8 rounded-[2rem] border border-white/5 shadow-2xl">
//           <div className="text-slate-200 text-base whitespace-pre-line leading-relaxed font-medium">
//             {view.guidedNotes}
//           </div>
//         </div>
//       </section>

//       {/* VISUAL AIDS */}
//       {view.visualAids.length > 0 && (
//         <section className="space-y-4">
//           <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//              <div className="h-1 w-4 bg-school-primary" /> Visual References
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {view.visualAids.map((v: VisualAid, i: number) => (
//               <div
//                 key={i}
//                 className="p-6 bg-slate-950 rounded-3xl border border-white/5 hover:border-school-primary/20 transition-all group"
//               >
//                 <h4 className="text-sm font-black text-white uppercase italic mb-2">{v.title}</h4>
//                 <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">
//                   {v.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* QUIZ SECTION */}
//       {view.quiz.length > 0 && (
//         <section className="space-y-6 pb-20">
//           <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//              <div className="h-1 w-4 bg-school-primary" /> Knowledge Check
//           </h2>

//           <div className="space-y-4">
//             {view.quiz.map((q: QuizQuestion, i: number) => (
//               <div
//                 key={i}
//                 className="p-8 bg-slate-900/40 rounded-[2.5rem] border border-white/5 space-y-6 shadow-lg"
//               >
//                 <div className="flex gap-4">
//                     <span className="text-school-primary font-black text-lg italic">0{i+1}</span>
//                     <p className="text-lg font-bold text-white tracking-tight leading-tight">
//                         {q.question}
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
//                   {q.options.map((opt: string) => (
//                     <div
//                       key={opt}
//                       className={cn(
//                         "text-[10px] font-black uppercase px-5 py-4 rounded-xl border transition-all",
//                         opt === q.answer
//                           ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5 shadow-inner"
//                           : "border-white/5 text-slate-500 bg-slate-950/50"
//                       )}
//                     >
//                       {opt}
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="pl-10 pt-4 border-t border-white/5">
//                     <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1">Pedagogical Rationale</p>
//                     <p className="text-xs text-slate-500 italic leading-relaxed">{q.explanation}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   )
// }


// 'use client'

// import { use, useEffect, useState } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { Loader2, BookOpen, Layers } from "lucide-react"

// import { getStudentLesson } from "@/app/actions/lesson.actions"
// import { transformLesson } from "@/lib/lessons/transformLessons"
// import { cn } from "@/lib/utils"

// // ── Utility ──────────────────────────────────────────────────────────────────

// /**
//  * Safely extracts a message from an unknown error type
//  */
// function getErrorMessage(error: unknown): string {
//   if (error instanceof Error) return error.message;
//   if (error && typeof error === 'object' && 'message' in error) {
//     return String((error as { message?: string }).message);
//   }
//   return typeof error === 'string' ? error : "An unknown error occurred";
// }

// // ── Types ───────────────────────────────────────────────────────────────────

// /**
//  * Matches the required object structure described in the build error.
//  */
// interface LessonAiContent {
//   metadata: {
//     topicContext: string;
//     difficultyLevel: string;
//   };
//   teacherLogic: {
//     teachingMethod: string;
//     timeAllocation: string;
//     pedagogicalTips: string;
//     introductionHook: string;
//   };
//   studentContent: {
//     title: string;
//     learningObjectives: string[];
//     explanation: string;
//     summary: string;
//     vocabulary: string[];
//     quiz: Array<{
//       question: string;
//       options: string[];
//       answer: string;
//       explanation: string;
//     }>;
//   };
// }

// interface VisualAid {
//   title: string
//   description: string
//   imagePrompt: string
//   url?: string
// }

// interface QuizQuestion {
//   question: string
//   options: string[]
//   answer: string
//   explanation: string
// }

// interface LessonView {
//   summary: string
//   guidedNotes: string
//   visualAids: VisualAid[]
//   quiz: QuizQuestion[]
// }

// interface LessonDTO {
//   summary: string;
//   content?: string;
//   explanation?: string;
//   visualAids: VisualAid[];
//   quiz: QuizQuestion[];
// }

// interface LessonData {
//   id: string
//   title: string
//   subject: string
//   aiContent: unknown 
// }

// interface PageProps {
//   params: Promise<{ topicId: string }>
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function StudentLessonPage({ params }: PageProps) {
//   const { topicId } = use(params)
//   const { profile } = useProfileStore()
//   const schoolId: string = profile?.schoolId ?? ""

//   const [lesson, setLesson] = useState<LessonData | null>(null)
//   const [view, setView] = useState<LessonView | null>(null)
//   const [loading, setLoading] = useState<boolean>(true)

//   useEffect(() => {
//     if (!schoolId || !topicId) return

//     async function loadLesson(): Promise<void> {
//       setLoading(true)
//       try {
//         const res = await getStudentLesson(topicId, schoolId)

//         if (!res.success || !res.data) {
//           setLesson(null)
//           setView(null)
//           return
//         }

//         const lessonData = res.data as LessonData

//         /**
//          * RESOLUTION: Cast the unknown aiContent to our strict LessonAiContent interface.
//          * Since Prisma returns Json, this is an object (not a string).
//          */
//         const aiContentObj = lessonData.aiContent as unknown as LessonAiContent;

//         const dto = transformLesson(
//           aiContentObj, 
//           "student"
//         ) as LessonDTO

//         const transformed: LessonView = {
//           summary: dto.summary,
//           guidedNotes: dto.content || dto.explanation || "No additional notes provided.",
//           visualAids: dto.visualAids || [],
//           quiz: dto.quiz || []
//         }

//         setLesson(lessonData)
//         setView(transformed)

//       } catch (err) {
//         console.error("Student lesson load error:", getErrorMessage(err))
//         setLesson(null)
//         setView(null)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadLesson()
//   }, [topicId, schoolId])

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//         <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">
//           Syncing Academic Assets...
//         </p>
//       </div>
//     )
//   }

//   if (!lesson || !view) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-500 gap-4 px-6 text-center">
//         <BookOpen className="h-12 w-12 text-slate-800" />
//         <div className="space-y-1">
//           <p className="text-lg font-black uppercase italic text-white">Lesson Unavailable</p>
//           <p className="text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
//             Your instructor has not published the academic materials for this topic yet.
//           </p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-10">
//       <div className="border-b border-white/5 pb-8">
//         <div className="flex items-center gap-3 text-school-primary mb-2">
//             <Layers className="h-4 w-4" />
//             <span className="text-[10px] font-black uppercase tracking-[0.3em]">{lesson.subject}</span>
//         </div>
//         <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
//           {lesson.title}
//         </h1>
//       </div>

//       <section className="space-y-4">
//         <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//            <div className="h-1 w-4 bg-school-primary" /> Syllabus Summary
//         </h2>
//         <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 shadow-xl">
//           <p className="text-slate-300 text-lg leading-loose italic">{view.summary}</p>
//         </div>
//       </section>

//       <section className="space-y-4">
//         <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//            <div className="h-1 w-4 bg-school-primary" /> Guided Academic Notes
//         </h2>
//         <div className="bg-slate-900 p-8 rounded-[2rem] border border-white/5 shadow-2xl">
//           <div className="text-slate-200 text-base whitespace-pre-line leading-relaxed font-medium">
//             {view.guidedNotes}
//           </div>
//         </div>
//       </section>

//       {view.visualAids.length > 0 && (
//         <section className="space-y-4">
//           <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//              <div className="h-1 w-4 bg-school-primary" /> Visual References
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {view.visualAids.map((v, i) => (
//               <div key={i} className="p-6 bg-slate-950 rounded-3xl border border-white/5 hover:border-school-primary/20 transition-all group">
//                 <h4 className="text-sm font-black text-white uppercase italic mb-2">{v.title}</h4>
//                 <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">
//                   {v.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {view.quiz.length > 0 && (
//         <section className="space-y-6 pb-20">
//           <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//              <div className="h-1 w-4 bg-school-primary" /> Knowledge Check
//           </h2>
//           <div className="space-y-4">
//             {view.quiz.map((q, i) => (
//               <div key={i} className="p-8 bg-slate-900/40 rounded-[2.5rem] border border-white/5 space-y-6 shadow-lg">
//                 <div className="flex gap-4">
//                     <span className="text-school-primary font-black text-lg italic">0{i+1}</span>
//                     <p className="text-lg font-bold text-white tracking-tight leading-tight">{q.question}</p>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
//                   {q.options.map((opt) => (
//                     <div key={opt} className={cn(
//                         "text-[10px] font-black uppercase px-5 py-4 rounded-xl border transition-all",
//                         opt === q.answer ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5 shadow-inner" : "border-white/5 text-slate-500 bg-slate-950/50"
//                     )}>
//                       {opt}
//                     </div>
//                   ))}
//                 </div>
//                 <div className="pl-10 pt-4 border-t border-white/5">
//                     <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1">Pedagogical Rationale</p>
//                     <p className="text-xs text-slate-500 italic leading-relaxed">{q.explanation}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   )
// }



// 'use client'

// import { use, useEffect, useState } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { Loader2, BookOpen, Layers } from "lucide-react"
// import { getStudentLesson } from "@/app/actions/lesson.actions"
// import { transformLesson } from "@/lib/lessons/transformLessons"
// import { cn } from "@/lib/utils"
// import { getErrorMessage } from "@/lib/error-handler"
// import { type LessonAiContent } from "@/app/actions/ai-generator"

// // ── Types ───────────────────────────────────────────────────────────────────

// interface VisualAid {
//   title: string;
//   description: string;
//   imagePrompt: string;
// }

// interface QuizQuestion {
//   question: string;
//   options: string[];
//   answer: string;
//   explanation: string;
// }

// interface LessonView {
//   summary: string;
//   guidedNotes: string;
//   visualAids: VisualAid[];
//   quiz: QuizQuestion[];
// }

// /**
//  * Interface for the object returned by transformLesson
//  */
// interface LessonDTO {
//   summary: string;
//   explanation?: string;
//   content?: string;
//   visualAids: VisualAid[];
//   quiz: QuizQuestion[];
// }

// interface StudentLessonData {
//   id: string;
//   subject: string;
//   title: string;
//   aiContent: LessonAiContent;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function StudentLessonPage({ params }: { params: Promise<{ topicId: string }> }) {
//   const { topicId } = use(params);
//   const { profile } = useProfileStore();
//   const schoolId = profile?.schoolId ?? "";

//   const [lessonData, setLessonData] = useState<StudentLessonData | null>(null);
//   const [view, setView] = useState<LessonView | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!schoolId || !topicId) return;

//     async function loadLesson() {
//       setLoading(true);
//       try {
//         const res = await getStudentLesson(topicId, schoolId);

//         if (!res.success || !res.data) {
//           setLessonData(null);
//           setView(null); 
//           return;
//         }

//         // res.data.aiContent is already an object of type LessonAiContent
//         const rawContent = res.data.aiContent;

//         /**
//          * FIXED: Removed JSON.stringify.
//          * Passing the object directly to satisfy the LessonAiContent requirement.
//          */
//         const dto = transformLesson(rawContent, "student") as LessonDTO;

//         setLessonData(res.data as StudentLessonData);
//         setView({
//           summary: dto.summary,
//           guidedNotes: dto.explanation || dto.content || "Notes unavailable.",
//           visualAids: dto.visualAids || [],
//           quiz: dto.quiz || []
//         });

//       } catch (err) {
//         console.error("[LESSON_PAGE_LOAD_ERROR]:", getErrorMessage(err));
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadLesson();
//   }, [topicId, schoolId]);

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-950">
//       <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//     </div>
//   );

//   if (!view || !lessonData) return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-500">
//       <BookOpen className="h-12 w-12 mb-4" />
//       <p className="text-lg font-black uppercase">Lesson Not Found</p>
//     </div>
//   );

//   return (
//     <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-10">
      
//       {/* HEADER */}
//       <div className="border-b border-white/5 pb-8">
//         <div className="flex items-center gap-3 text-school-primary mb-2">
//             <Layers className="h-4 w-4" />
//             <span className="text-[10px] font-black uppercase tracking-[0.3em]">{lessonData.subject}</span>
//         </div>
//         <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
//             {lessonData.title}
//         </h1>
//       </div>
      
//       {/* SUMMARY */}
//       <section className="space-y-4">
//         <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//            <div className="h-1 w-4 bg-school-primary" /> Syllabus Summary
//         </h2>
//         <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 shadow-xl">
//           <p className="text-slate-300 text-lg leading-loose italic">{view.summary}</p>
//         </div>
//       </section>

//       {/* GUIDED NOTES */}
//       <section className="space-y-4">
//         <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//            <div className="h-1 w-4 bg-school-primary" /> Guided Academic Notes
//         </h2>
//         <div className="bg-slate-900 p-8 rounded-[2rem] border border-white/5 shadow-2xl text-slate-200 whitespace-pre-line leading-relaxed font-medium">
//           {view.guidedNotes}
//         </div>
//       </section>

//       {/* VISUAL AIDS */}
//       {view.visualAids.length > 0 && (
//         <section className="space-y-4">
//           <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//              <div className="h-1 w-4 bg-school-primary" /> Visual References
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {view.visualAids.map((v, i) => (
//               <div key={i} className="p-6 bg-slate-950 rounded-3xl border border-white/5">
//                 <h4 className="text-sm font-black text-white mb-2 uppercase italic">{v.title}</h4>
//                 <p className="text-xs text-slate-500 leading-relaxed">{v.description}</p>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* QUIZ SECTION */}
//       {view.quiz.length > 0 && (
//         <section className="space-y-6 pb-20">
//           <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
//              <div className="h-1 w-4 bg-school-primary" /> Knowledge Check
//           </h2>
//           <div className="space-y-4">
//             {view.quiz.map((q, i) => (
//               <div key={i} className="p-8 bg-slate-900/40 rounded-[2.5rem] border border-white/5 space-y-6">
//                 <div className="flex gap-4">
//                     <span className="text-school-primary font-black text-lg italic">0{i+1}</span>
//                     <p className="text-lg font-bold text-white tracking-tight">{q.question}</p>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
//                   {q.options.map((opt) => (
//                     <div key={opt} className={cn(
//                         "text-[10px] font-black uppercase px-5 py-4 rounded-xl border",
//                         opt === q.answer ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5" : "border-white/5 text-slate-500 bg-slate-950/50"
//                     )}>
//                       {opt}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }


'use client'

import { use, useEffect, useState } from "react"
import { useProfileStore } from "@/store/profileStore"
import { Loader2, BookOpen, Layers } from "lucide-react"
import { getStudentLesson } from "@/app/actions/lesson.actions"
// Import the helper and the DTO type correctly
import { transformLesson, type LessonDTO } from "@/lib/lessons/transformLessons"
import { cn } from "@/lib/utils"
import { getErrorMessage } from "@/lib/error-handler"
import { type LessonAiContent } from "@/app/actions/ai-generator"

// ── Types ───────────────────────────────────────────────────────────────────

interface LessonView {
  summary: string;
  explanation: string;
  visualAids: LessonDTO['visualAids'];
  quiz: LessonDTO['quiz'];
  objectives: string[];
}

interface StudentLessonData {
  id: string;
  subject: string;
  title: string;
  aiContent: LessonAiContent;
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function StudentLessonPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = use(params);
  const { profile } = useProfileStore();
  const schoolId = profile?.schoolId ?? "";

  const [lessonData, setLessonData] = useState<StudentLessonData | null>(null);
  const [view, setView] = useState<LessonView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId || !topicId) return;

    async function loadLesson() {
      setLoading(true);
      try {
        const res = await getStudentLesson(topicId, schoolId);

        if (!res.success || !res.data || !res.data.aiContent) {
          setLessonData(null);
          setView(null); 
          return;
        }

        /**
         * RESOLUTION:
         * 1. Cast JsonValue to LessonAiContent safely.
         * 2. Pass arguments in correct order: (topicId, aiContent).
         */
        const ai = res.data.aiContent as unknown as LessonAiContent;
        const dto = transformLesson(topicId, ai);

        setLessonData({
            id: res.data.id,
            subject: res.data.subject,
            title: res.data.title,
            aiContent: ai
        });

        setView({
          summary: dto.summary,
          explanation: dto.explanation,
          visualAids: dto.visualAids,
          quiz: dto.quiz,
          objectives: dto.learningObjectives
        });

      } catch (err) {
        console.error("[LESSON_PAGE_LOAD_ERROR]:", getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    loadLesson();
  }, [topicId, schoolId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
    </div>
  );

  if (!view || !lessonData) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-500">
      <BookOpen className="h-12 w-12 mb-4" />
      <p className="text-lg font-black uppercase">Lesson Not Found</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-10 pb-20">
      
      {/* HEADER */}
      <div className="border-b border-white/5 pb-8">
        <div className="flex items-center gap-3 text-school-primary mb-2">
            <Layers className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{lessonData.subject}</span>
        </div>
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
            {lessonData.title}
        </h1>
      </div>
      
      {/* OBJECTIVES */}
      <div className="flex flex-wrap gap-2">
          {view.objectives.map((obj, i) => (
              <span key={i} className="px-3 py-1 bg-school-primary/10 border border-school-primary/20 text-school-primary text-[10px] font-bold uppercase rounded-full">
                  {obj}
              </span>
          ))}
      </div>

      {/* SUMMARY */}
      <section className="space-y-4">
        <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
           <div className="h-1 w-4 bg-school-primary" /> Executive Summary
        </h2>
        <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 shadow-xl">
          <p className="text-slate-300 text-lg leading-loose italic">{view.summary}</p>
        </div>
      </section>

      {/* EXPLANATION */}
      <section className="space-y-4">
        <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
           <div className="h-1 w-4 bg-school-primary" /> Lesson Content
        </h2>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl text-slate-200 whitespace-pre-line leading-relaxed font-medium">
          {view.explanation}
        </div>
      </section>

      {/* VISUAL AIDS */}
      {view.visualAids.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
             <div className="h-1 w-4 bg-school-primary" /> Visual Aids
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {view.visualAids.map((v, i) => (
              <div key={i} className="p-6 bg-slate-950 rounded-3xl border border-white/5">
                <h4 className="text-sm font-black text-white mb-2 uppercase italic">{v.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* QUIZ SECTION */}
      {view.quiz.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
             <div className="h-1 w-4 bg-school-primary" /> Knowledge Check
          </h2>
          <div className="space-y-4">
            {view.quiz.map((q, i) => (
              <div key={i} className="p-8 bg-slate-900/40 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex gap-4">
                    <span className="text-school-primary font-black text-lg italic">0{i+1}</span>
                    <p className="text-lg font-bold text-white tracking-tight">{q.question}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
                  {q.options.map((opt) => (
                    <div key={opt} className={cn(
                        "text-[10px] font-black uppercase px-5 py-4 rounded-xl border",
                        opt === q.answer ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5" : "border-white/5 text-slate-500 bg-slate-950/50"
                    )}>
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}