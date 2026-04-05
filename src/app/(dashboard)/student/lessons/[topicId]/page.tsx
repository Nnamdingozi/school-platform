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



'use client'

import { use, useEffect, useState } from "react"
import { useProfileStore } from "@/store/profileStore"
import { getLessonForTopic } from "@/app/actions/lesson.actions"
import { AILessonPlanner, type EnhancedLessonContent } from "@/components/TeacherDashboard/ai-learning-planner"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

interface PageProps {
    params: Promise<{ topicId: string }>
}

export default function StudentLessonPage({ params }: PageProps) {
    const { topicId } = use(params)
    const { profile, isLoading: isProfileLoading } = useProfileStore()
    
    const [lessonId, setLessonId] = useState<string>("")
    const [lessonContent, setLessonContent] = useState<EnhancedLessonContent | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!profile?.schoolId || !topicId) return

        async function fetchContent() {
            setLoading(true)
            const res = await getLessonForTopic(topicId, profile!.schoolId!)
            if (res.success && res.data) {
                setLessonId(res.data.id)
                setLessonContent(res.data.aiContent as unknown as EnhancedLessonContent)
            }
            setLoading(false)
        }
        fetchContent()
    }, [topicId, profile?.schoolId, profile])

    if (isProfileLoading || loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
                <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
                <p className="text-slate-500 font-mono text-[10px] mt-4 uppercase">Syncing_Study_Vault...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-12 space-y-8 bg-slate-950 min-h-screen">
            <Link href="/student" className="text-school-primary text-[10px] font-black uppercase flex items-center gap-2">
                <ArrowLeft className="h-3 w-3" /> Back to HUB
            </Link>

            <AILessonPlanner 
                topicId={topicId}
                schoolId={profile!.schoolId!}
                lessonId={lessonId}
                topicTitle="Study Portal"
                initialData={lessonContent}
                mode="student" // ✅ PRO APPROACH: Same code, student view
            />
        </div>
    )
}