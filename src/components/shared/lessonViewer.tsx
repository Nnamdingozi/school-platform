// export function LessonViewer({ aiContent, role }: { aiContent: any, role: string }) {
//     const isTeacher = role === 'TEACHER' || role === 'SCHOOL_ADMIN';

//     return (
//         <div className="space-y-8">
//             {/* ── TEACHER ONLY SECTION ── */}
//             {isTeacher && aiContent.teacher_logic && (
//                 <div className="bg-school-primary/5 border border-school-primary/20 rounded-2xl p-6">
//                     <h4 className="text-school-primary text-[10px] font-black uppercase tracking-widest mb-4">
//                         Instructional Strategy (Internal Only)
//                     </h4>
//                     <div className="grid grid-cols-2 gap-4 text-xs">
//                         <div>
//                             <p className="text-slate-500 uppercase font-bold">Method:</p>
//                             <p className="text-white">{aiContent.teacher_logic.teaching_method}</p>
//                         </div>
//                         <div>
//                             <p className="text-slate-500 uppercase font-bold">Time:</p>
//                             <p className="text-white">{aiContent.teacher_logic.time_allocation}</p>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ── SHARED CONTENT SECTION (Visible to everyone) ── */}
//             <article className="prose prose-invert max-w-none">
//                 <h1 className="text-white font-black italic uppercase tracking-tighter">
//                     {aiContent.student_content.title}
//                 </h1>
//                 <div className="text-slate-300 leading-relaxed">
//                     {aiContent.student_content.body}
//                 </div>
                
//                 <div className="mt-8 p-6 bg-slate-900 rounded-2xl border border-white/5">
//                     <h5 className="text-white font-bold mb-2">Summary</h5>
//                     <p className="text-sm text-slate-400">{aiContent.student_content.summary}</p>
//                 </div>
//             </article>
//         </div>
//     )
// }


// 'use client'

// import React from 'react'
// import ReactMarkdown from 'react-markdown'

// // ── Types ──────────────────────────────────────────────────────────────────────

// interface LessonAiContent {
//     teacher_logic?: {
//         teaching_method: string
//         time_allocation: string
//     }
//     student_content: {
//         title: string
//         body: string
//         summary: string
//     }
// }

// interface LessonViewerProps {
//     aiContent: LessonAiContent
//     role: string
// }

// // ── Main Component ─────────────────────────────────────────────────────────────

// export function LessonViewer({ aiContent, role }: LessonViewerProps) {
//     const isTeacher = role === 'TEACHER' || role === 'SCHOOL_ADMIN'

//     return (
//         <div className="space-y-8">
//             {/* ── TEACHER ONLY SECTION ── */}
//             {isTeacher && aiContent.teacher_logic && (
//                 <div className="bg-school-primary/5 border border-school-primary/20 rounded-2xl p-6 shadow-sm">
//                     <h4 className="text-school-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
//                         Instructional Strategy (Internal Only)
//                     </h4>
//                     <div className="grid grid-cols-2 gap-6 text-xs">
//                         <div className="space-y-1">
//                             <p className="text-slate-500 uppercase font-bold tracking-widest">Methodology</p>
//                             <p className="text-white font-medium italic">{aiContent.teacher_logic.teaching_method}</p>
//                         </div>
//                         <div className="space-y-1">
//                             <p className="text-slate-500 uppercase font-bold tracking-widest">Time Window</p>
//                             <p className="text-white font-medium italic">{aiContent.teacher_logic.time_allocation}</p>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ── SHARED CONTENT SECTION (Visible to everyone) ── */}
//             <article className="prose prose-invert max-w-none">
//                 <header className="mb-8">
//                     <div className="flex items-center gap-2 mb-2">
//                         <span className="h-1 w-8 bg-school-primary rounded-full" />
//                         <span className="text-[10px] font-black text-school-primary uppercase tracking-[0.3em]">
//                             Learning Module
//                         </span>
//                     </div>
//                     <h1 className="text-white font-black italic uppercase tracking-tighter text-3xl sm:text-4xl leading-none">
//                         {aiContent.student_content.title}
//                     </h1>
//                 </header>

//                 <div className="text-slate-300 leading-relaxed text-base sm:text-lg">
//                     {/* Note: If 'body' contains HTML or Markdown, you might need a parser here */}
                    
//     <ReactMarkdown>{aiContent.student_content.body}</ReactMarkdown>
//                 </div>
                
//                 <div className="mt-12 p-8 bg-slate-900 border border-white/5 rounded-[2rem] shadow-xl relative overflow-hidden">
//                     {/* Decorative element */}
//                     <div className="absolute top-0 right-0 h-24 w-24 bg-school-primary/5 blur-3xl rounded-full -mr-10 -mt-10" />
                    
//                     <h5 className="text-white font-black uppercase italic tracking-widest text-sm mb-4 flex items-center gap-2">
//                         <span className="h-4 w-1 bg-school-primary rounded-full" />
//                         Syllabus Summary
//                     </h5>
//                     <p className="text-sm text-slate-400 leading-relaxed italic border-l border-school-primary/30 pl-4">
//                         {aiContent.student_content.summary}
//                     </p>
//                 </div>
//             </article>
//         </div>
//     )
// }


'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Lightbulb, Target, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface LessonAiContent {
    teacher_logic?: {
        teaching_method: string
        time_allocation: string
    }
    student_content: {
        title: string
        body: string
        summary: string
    }
}

interface LessonViewerProps {
    aiContent: LessonAiContent
    role: string
}

/**
 * LEARNING MODULE VIEWER (Tier 1/2/3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry (rounded-2xl, rounded-[2rem]).
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function LessonViewer({ aiContent, role }: LessonViewerProps) {
    const isTeacher = role === 'TEACHER' || role === 'SCHOOL_ADMIN' || role === 'SUPER_ADMIN';

    return (
        <div className="space-y-10 md:space-y-16 animate-in fade-in duration-700">
            
            {/* ── INSTRUCTIONAL STRATEGY (Rule 21: Scale Protocol) ── */}
            {isTeacher && aiContent.teacher_logic && (
                <div className="bg-school-primary-50 border border-school-primary-200 rounded-2xl p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-school-primary-100 rounded-lg">
                            <Lightbulb className="h-4 w-4 text-school-primary" />
                        </div>
                        <h4 className="text-school-primary text-[10px] font-extrabold uppercase tracking-widest italic">
                            Instructional Strategy Protocol (Internal Only)
                        </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <p className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest ml-1">Methodology</p>
                            <p className="text-foreground font-semibold italic text-sm leading-relaxed border-l-2 border-school-primary-200 pl-4">
                                {aiContent.teacher_logic.teaching_method}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest ml-1">Time Window</p>
                            <p className="text-foreground font-semibold italic text-sm leading-relaxed border-l-2 border-school-primary-200 pl-4">
                                {aiContent.teacher_logic.time_allocation}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── CORE CONTENT ARCHITECTURE (Rule 11/18) ── */}
            <article className="prose prose-invert max-w-none">
                <header className="mb-12 space-y-4">
                    <div className="flex items-center gap-3">
                        {/* Rule 21: Scale protocol accent */}
                        <div className="h-1 w-12 bg-school-primary rounded-full shadow-[0_0_10px_rgba(var(--school-primary-raw),0.4)]" />
                        <span className="text-[10px] font-extrabold text-school-primary uppercase tracking-[0.3em] italic">
                            Academic Module
                        </span>
                    </div>
                    <h1 className="text-foreground font-extrabold italic uppercase tracking-tighter text-3xl md:text-5xl leading-none">
                        {aiContent.student_content.title}
                    </h1>
                </header>

                <div className={cn(
                    "text-foreground/80 leading-relaxed text-base md:text-lg",
                    "prose-p:mb-6 prose-headings:text-foreground prose-headings:font-extrabold prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter",
                    "prose-strong:text-school-primary prose-strong:font-extrabold prose-li:text-foreground/70"
                )}>
                    <ReactMarkdown>{aiContent.student_content.body}</ReactMarkdown>
                </div>
                
                {/* ── SYLLABUS SUMMARY HUB (Rule 19) ── */}
                <div className="mt-16 md:mt-24 p-8 md:p-12 bg-card border border-border rounded-[2rem] shadow-xl relative overflow-hidden group">
                    {/* Rule 21 Decorative Background Accent */}
                    <div className="absolute top-0 right-0 h-32 w-32 bg-school-primary-50 blur-3xl rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                            <Target className="h-5 w-5 text-school-primary" />
                            <h5 className="text-foreground font-extrabold uppercase italic tracking-widest text-sm">
                                Syllabus Module Summary
                            </h5>
                        </div>
                        
                        <div className="relative">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-school-primary-200 rounded-full" />
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic pl-6">
                                {aiContent.student_content.summary}
                            </p>
                        </div>

                        <div className="pt-4 flex items-center gap-3 opacity-30">
                            <Info className="h-3.5 w-3.5" />
                            <span className="text-[8px] font-bold uppercase tracking-widest">
                                AI-Synthesized Knowledge Node v1.4
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}