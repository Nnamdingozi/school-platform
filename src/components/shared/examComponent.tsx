// import { Card } from '@/components/ui/card'
// import { Edit3 } from 'lucide-react'
// import { cn } from '@/lib/utils'

// // ── 1. Stat Card (Reusable for Admin & Teacher) ──
// export function ExamStatCard({ label, value, sub, icon: Icon, colorClass = "text-white" }: any) {
//     return (
//         <Card className="bg-slate-900 border-white/5 rounded-[2rem] p-8 shadow-xl group hover:border-school-primary/20 transition-all duration-300">
//             <div className="flex justify-between items-start mb-4">
//                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
//                 <div className="p-2 bg-slate-950 rounded-lg group-hover:bg-school-primary/10 transition-colors border border-white/5">
//                     <Icon className="h-4 w-4 text-slate-700 group-hover:text-school-primary transition-colors" />
//                 </div>
//             </div>
//             <h3 className={cn("text-4xl font-black leading-none tracking-tighter", colorClass)}>{value}</h3>
//             <p className="text-[10px] text-slate-500 font-bold uppercase mt-3 tracking-widest">{sub}</p>
//         </Card>
//     )
// }

// // ── 2. Question Preview Card (Reusable for Building and Auditing) ──
// export function QuestionPreviewCard({ question, index, onEdit }: any) {
//     return (
//         <Card className="bg-slate-900 border-white/5 rounded-[2rem] p-8 hover:border-school-primary/20 transition-all group shadow-xl">
//             <div className="flex justify-between items-start mb-6">
//                 <div className="flex items-center gap-3">
//                     <span className="h-8 w-8 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-center text-[10px] font-black text-school-primary shadow-inner">
//                         Q{index + 1}
//                     </span>
//                     <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md uppercase tracking-widest border border-emerald-500/20">
//                         {question.category}
//                     </span>
//                 </div>
//                 {onEdit && (
//                     <button onClick={onEdit} className="opacity-0 group-hover:opacity-100 p-2 bg-slate-950 rounded-xl text-slate-400 hover:text-school-primary border border-white/5 shadow-lg transition-all">
//                         <Edit3 className="h-4 w-4" />
//                     </button>
//                 )}
//             </div>
            
//             <p className="text-sm font-bold text-white mb-6 leading-relaxed">{question.text}</p>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                  {question.options.map((opt: string, i: number) => {
//                      const isCorrect = opt === question.correctAnswer
//                      return (
//                          <div key={i} className={cn(
//                              "p-4 rounded-xl border text-xs font-bold transition-all",
//                              isCorrect 
//                                 ? "bg-school-primary/10 border-school-primary/30 text-school-primary shadow-inner" 
//                                 : "bg-slate-950 border-white/5 text-slate-500"
//                          )}>
//                              {String.fromCharCode(65 + i)}) {opt}
//                              {isCorrect && <span className="ml-2 text-[9px] uppercase tracking-widest opacity-60">(Correct Key)</span>}
//                          </div>
//                      )
//                  })}
//             </div>
//         </Card>
//     )
// }



// 'use client'

// import React from 'react'
// import { Card } from '@/components/ui/card'
// import { Edit3, type LucideIcon } from 'lucide-react'
// import { cn } from '@/lib/utils'

// // ── Types ──────────────────────────────────────────────────────────────────────

// interface ExamStatCardProps {
//     label: string
//     value: string | number
//     sub: string
//     icon: LucideIcon | React.ElementType
//     colorClass?: string
// }

// interface QuestionData {
//     category: string
//     text: string
//     options: string[]
//     correctAnswer: string
// }

// interface QuestionPreviewCardProps {
//     question: QuestionData
//     index: number
//     onEdit?: () => void
// }

// // ── 1. Stat Card (Reusable for Admin & Teacher) ──
// export function ExamStatCard({ 
//     label, 
//     value, 
//     sub, 
//     icon: Icon, 
//     colorClass = "text-white" 
// }: ExamStatCardProps) {
//     return (
//         <Card className="bg-slate-900 border-white/5 rounded-[2rem] p-8 shadow-xl group hover:border-school-primary/20 transition-all duration-300">
//             <div className="flex justify-between items-start mb-4">
//                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
//                 <div className="p-2 bg-slate-950 rounded-lg group-hover:bg-school-primary/10 transition-colors border border-white/5">
//                     <Icon className="h-4 w-4 text-slate-700 group-hover:text-school-primary transition-colors" />
//                 </div>
//             </div>
//             <h3 className={cn("text-4xl font-black leading-none tracking-tighter", colorClass)}>{value}</h3>
//             <p className="text-[10px] text-slate-500 font-bold uppercase mt-3 tracking-widest">{sub}</p>
//         </Card>
//     )
// }

// // ── 2. Question Preview Card (Reusable for Building and Auditing) ──
// export function QuestionPreviewCard({ 
//     question, 
//     index, 
//     onEdit 
// }: QuestionPreviewCardProps) {
//     return (
//         <Card className="bg-slate-900 border-white/5 rounded-[2rem] p-8 hover:border-school-primary/20 transition-all group shadow-xl">
//             <div className="flex justify-between items-start mb-6">
//                 <div className="flex items-center gap-3">
//                     <span className="h-8 w-8 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-center text-[10px] font-black text-school-primary shadow-inner">
//                         Q{index + 1}
//                     </span>
//                     <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md uppercase tracking-widest border border-emerald-500/20">
//                         {question.category}
//                     </span>
//                 </div>
//                 {onEdit && (
//                     <button 
//                         onClick={onEdit} 
//                         className="opacity-0 group-hover:opacity-100 p-2 bg-slate-950 rounded-xl text-slate-400 hover:text-school-primary border border-white/5 shadow-lg transition-all"
//                     >
//                         <Edit3 className="h-4 w-4" />
//                     </button>
//                 )}
//             </div>
            
//             <p className="text-sm font-bold text-white mb-6 leading-relaxed">{question.text}</p>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                  {question.options.map((opt: string, i: number) => {
//                      const isCorrect = opt === question.correctAnswer
//                      return (
//                          <div key={i} className={cn(
//                              "p-4 rounded-xl border text-xs font-bold transition-all",
//                              isCorrect 
//                                 ? "bg-school-primary/10 border-school-primary/30 text-school-primary shadow-inner" 
//                                 : "bg-slate-950 border-white/5 text-slate-500"
//                          )}>
//                              {String.fromCharCode(65 + i)}) {opt}
//                              {isCorrect && <span className="ml-2 text-[9px] uppercase tracking-widest opacity-60">(Correct Key)</span>}
//                          </div>
//                      )
//                  })}
//             </div>
//         </Card>
//     )
// }



// 'use client'

// import React from 'react'
// import { Card } from '@/components/ui/card'
// import { Edit3, type LucideIcon } from 'lucide-react'
// import { cn } from '@/lib/utils'

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface ExamStatCardProps {
//     label: string
//     value: string | number
//     sub: string
//     icon: LucideIcon | React.ElementType
//     colorClass?: string
//     className?: string // RESOLVED: Prop now supported for ArchitectStats
// }

// interface QuestionData {
//     category: string
//     text: string
//     options: string[]
//     correctAnswer: string
// }

// interface QuestionPreviewCardProps {
//     question: QuestionData
//     index: number
//     onEdit?: () => void
//     className?: string
// }

// // ── 1. Stat Card (Rule 18 & 19) ──
// /**
//  * EXAM STAT CARD
//  * Rule 11: Scaled typography (font-extrabold italic).
//  * Rule 18: Semantic tokens (bg-card, bg-surface).
//  * Rule 19: Standardized 2rem radius.
//  */
// export function ExamStatCard({ 
//     label, 
//     value, 
//     sub, 
//     icon: Icon, 
//     colorClass = "text-foreground",
//     className
// }: ExamStatCardProps) {
//     return (
//         <Card className={cn(
//             "bg-card border-border rounded-[2rem] p-6 md:p-8 shadow-xl group hover:border-school-primary/30 transition-all duration-300",
//             className
//         )}>
//             <div className="flex justify-between items-start mb-6">
//                 {/* Rule 19: Metadata Typography */}
//                 <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{label}</p>
//                 <div className="p-2.5 bg-surface rounded-xl group-hover:bg-school-primary/10 transition-colors border border-border">
//                     <Icon className="h-4 w-4 text-muted-foreground group-hover:text-school-primary transition-colors" />
//                 </div>
//             </div>
//             {/* Rule 11: Registry Header Typography */}
//             <h3 className={cn(
//                 "text-2xl md:text-4xl font-extrabold leading-none tracking-tighter uppercase italic", 
//                 colorClass
//             )}>
//                 {value}
//             </h3>
//             <p className="text-[10px] text-muted-foreground font-semibold uppercase mt-4 tracking-widest italic opacity-70">
//                 {sub}
//             </p>
//         </Card>
//     )
// }

// // ── 2. Question Preview Card (Rule 20) ──
// /**
//  * QUESTION PREVIEW CARD
//  * Rule 20: Fluid grid for options (stack on mobile, cols-2 on md).
//  * Rule 19: Geometric hierarchy (rounded-xl index, rounded-[2rem] card).
//  */
// export function QuestionPreviewCard({ 
//     question, 
//     index, 
//     onEdit,
//     className
// }: QuestionPreviewCardProps) {
//     return (
//         <Card className={cn(
//             "bg-card border-border rounded-[2rem] p-6 md:p-10 hover:border-school-primary/30 transition-all group shadow-xl",
//             className
//         )}>
//             <div className="flex justify-between items-start mb-8">
//                 <div className="flex items-center gap-4">
//                     {/* Rule 19: Small Radius Index */}
//                     <span className="h-10 w-10 bg-surface border border-border rounded-xl flex items-center justify-center text-[10px] font-bold text-school-primary shadow-inner">
//                         Q{index + 1}
//                     </span>
//                     <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-500/20">
//                         {question.category}
//                     </span>
//                 </div>
//                 {onEdit && (
//                     <button 
//                         onClick={onEdit} 
//                         className="opacity-0 group-hover:opacity-100 p-3 bg-surface rounded-xl text-muted-foreground hover:text-school-primary border border-border shadow-lg transition-all active:scale-95"
//                     >
//                         <Edit3 className="h-4 w-4" />
//                     </button>
//                 )}
//             </div>
            
//             <p className="text-base md:text-lg font-bold text-foreground mb-8 leading-relaxed italic tracking-tight">
//                 {question.text}
//             </p>
            
//             {/* Rule 20: Responsive Options Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                  {question.options.map((opt: string, i: number) => {
//                      const isCorrect = opt === question.correctAnswer
//                      return (
//                          <div key={i} className={cn(
//                              "p-5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between",
//                              isCorrect 
//                                 ? "bg-school-primary/10 border-school-primary/30 text-school-primary shadow-inner" 
//                                 : "bg-surface border-border text-muted-foreground hover:border-muted-foreground/30"
//                          )}>
//                              <span className="flex gap-3">
//                                 <span className="opacity-40">{String.fromCharCode(65 + i)})</span>
//                                 {opt}
//                              </span>
//                              {isCorrect && (
//                                 <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-school-primary/20 rounded">
//                                     Key
//                                 </span>
//                              )}
//                          </div>
//                      )
//                  })}
//             </div>
//         </Card>
//     )
// }


'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Edit3, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface ExamStatCardProps {
    label: string
    value: string | number
    sub: string
    icon: LucideIcon | React.ElementType
    colorClass?: string
    className?: string 
}

interface QuestionData {
    category: string
    text: string
    options: string[]
    correctAnswer: string
}

interface QuestionPreviewCardProps {
    question: QuestionData
    index: number
    onEdit?: () => void
    className?: string
}

// ── 1. Stat Card (Rule 18/19/21) ──
/**
 * EXAM STAT CARD
 * Rule 11: High-fidelity Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-card, bg-surface, border-border).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol - Uses mathematical CSS tokens (-50, -100).
 */
export function ExamStatCard({ 
    label, 
    value, 
    sub, 
    icon: Icon, 
    colorClass = "text-foreground",
    className
}: ExamStatCardProps) {
    return (
        <Card className={cn(
            "bg-card border-border rounded-[2rem] p-6 md:p-8 shadow-xl group hover:border-school-primary-300 transition-all duration-300",
            className
        )}>
            <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{label}</p>
                {/* ✅ Rule 21: Using Scale Protocol for hover state */}
                <div className="p-2.5 bg-surface rounded-xl group-hover:bg-school-primary-100 transition-colors border border-border">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-school-primary transition-colors" />
                </div>
            </div>
            <h3 className={cn(
                "text-2xl md:text-4xl font-extrabold leading-none tracking-tighter uppercase italic", 
                colorClass
            )}>
                {value}
            </h3>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase mt-4 tracking-widest italic opacity-70">
                {sub}
            </p>
        </Card>
    )
}

// ── 2. Question Preview Card (Rule 20/21) ──
/**
 * QUESTION PREVIEW CARD
 * Rule 11: High-density Typography.
 * Rule 20: Fluid responsive layout.
 * Rule 21: Scale Protocol for "Correct Key" and "Category" backgrounds.
 */
export function QuestionPreviewCard({ 
    question, 
    index, 
    onEdit,
    className
}: QuestionPreviewCardProps) {
    return (
        <Card className={cn(
            "bg-card border-border rounded-[2rem] p-6 md:p-10 hover:border-school-primary-200 transition-all group shadow-xl",
            className
        )}>
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                    {/* Rule 19: Inner radius standardized to xl */}
                    <span className="h-10 w-10 bg-surface border border-border rounded-xl flex items-center justify-center text-[10px] font-bold text-school-primary shadow-inner">
                        Q{index + 1}
                    </span>
                    {/* ✅ Rule 21: Using mathematical emerald-50/200 for status badge */}
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-200">
                        {question.category}
                    </span>
                </div>
                {onEdit && (
                    <button 
                        onClick={onEdit} 
                        className="opacity-0 group-hover:opacity-100 p-3 bg-surface rounded-xl text-muted-foreground hover:text-school-primary border border-border shadow-lg transition-all active:scale-95"
                    >
                        <Edit3 className="h-4 w-4" />
                    </button>
                )}
            </div>
            
            <p className="text-base md:text-lg font-bold text-foreground mb-8 leading-relaxed italic tracking-tight">
                {question.text}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {question.options.map((opt: string, i: number) => {
                     const isCorrect = opt === question.correctAnswer
                     return (
                         <div key={i} className={cn(
                             "p-5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between",
                             // ✅ Rule 21: High-fidelity Correct state using Scale
                             isCorrect 
                                ? "bg-school-primary-50 border-school-primary-200 text-school-primary shadow-inner" 
                                : "bg-surface border-border text-muted-foreground hover:border-muted-foreground/30"
                         )}>
                             <span className="flex gap-3">
                                <span className="opacity-40">{String.fromCharCode(65 + i)})</span>
                                {opt}
                             </span>
                             {isCorrect && (
                                <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 bg-school-primary-100 rounded-md">
                                    Key
                                </span>
                             )}
                         </div>
                     )
                 })}
            </div>
        </Card>
    )
}