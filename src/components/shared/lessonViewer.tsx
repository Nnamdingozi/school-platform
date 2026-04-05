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


'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'

// ── Types ──────────────────────────────────────────────────────────────────────

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

// ── Main Component ─────────────────────────────────────────────────────────────

export function LessonViewer({ aiContent, role }: LessonViewerProps) {
    const isTeacher = role === 'TEACHER' || role === 'SCHOOL_ADMIN'

    return (
        <div className="space-y-8">
            {/* ── TEACHER ONLY SECTION ── */}
            {isTeacher && aiContent.teacher_logic && (
                <div className="bg-school-primary/5 border border-school-primary/20 rounded-2xl p-6 shadow-sm">
                    <h4 className="text-school-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        Instructional Strategy (Internal Only)
                    </h4>
                    <div className="grid grid-cols-2 gap-6 text-xs">
                        <div className="space-y-1">
                            <p className="text-slate-500 uppercase font-bold tracking-widest">Methodology</p>
                            <p className="text-white font-medium italic">{aiContent.teacher_logic.teaching_method}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-500 uppercase font-bold tracking-widest">Time Window</p>
                            <p className="text-white font-medium italic">{aiContent.teacher_logic.time_allocation}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── SHARED CONTENT SECTION (Visible to everyone) ── */}
            <article className="prose prose-invert max-w-none">
                <header className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-1 w-8 bg-school-primary rounded-full" />
                        <span className="text-[10px] font-black text-school-primary uppercase tracking-[0.3em]">
                            Learning Module
                        </span>
                    </div>
                    <h1 className="text-white font-black italic uppercase tracking-tighter text-3xl sm:text-4xl leading-none">
                        {aiContent.student_content.title}
                    </h1>
                </header>

                <div className="text-slate-300 leading-relaxed text-base sm:text-lg">
                    {/* Note: If 'body' contains HTML or Markdown, you might need a parser here */}
                    
    <ReactMarkdown>{aiContent.student_content.body}</ReactMarkdown>
                </div>
                
                <div className="mt-12 p-8 bg-slate-900 border border-white/5 rounded-[2rem] shadow-xl relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 h-24 w-24 bg-school-primary/5 blur-3xl rounded-full -mr-10 -mt-10" />
                    
                    <h5 className="text-white font-black uppercase italic tracking-widest text-sm mb-4 flex items-center gap-2">
                        <span className="h-4 w-1 bg-school-primary rounded-full" />
                        Syllabus Summary
                    </h5>
                    <p className="text-sm text-slate-400 leading-relaxed italic border-l border-school-primary/30 pl-4">
                        {aiContent.student_content.summary}
                    </p>
                </div>
            </article>
        </div>
    )
}