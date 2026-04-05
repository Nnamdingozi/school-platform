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



'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Edit3, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ──────────────────────────────────────────────────────────────────────

interface ExamStatCardProps {
    label: string
    value: string | number
    sub: string
    icon: LucideIcon | React.ElementType
    colorClass?: string
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
}

// ── 1. Stat Card (Reusable for Admin & Teacher) ──
export function ExamStatCard({ 
    label, 
    value, 
    sub, 
    icon: Icon, 
    colorClass = "text-white" 
}: ExamStatCardProps) {
    return (
        <Card className="bg-slate-900 border-white/5 rounded-[2rem] p-8 shadow-xl group hover:border-school-primary/20 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
                <div className="p-2 bg-slate-950 rounded-lg group-hover:bg-school-primary/10 transition-colors border border-white/5">
                    <Icon className="h-4 w-4 text-slate-700 group-hover:text-school-primary transition-colors" />
                </div>
            </div>
            <h3 className={cn("text-4xl font-black leading-none tracking-tighter", colorClass)}>{value}</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-3 tracking-widest">{sub}</p>
        </Card>
    )
}

// ── 2. Question Preview Card (Reusable for Building and Auditing) ──
export function QuestionPreviewCard({ 
    question, 
    index, 
    onEdit 
}: QuestionPreviewCardProps) {
    return (
        <Card className="bg-slate-900 border-white/5 rounded-[2rem] p-8 hover:border-school-primary/20 transition-all group shadow-xl">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <span className="h-8 w-8 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-center text-[10px] font-black text-school-primary shadow-inner">
                        Q{index + 1}
                    </span>
                    <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md uppercase tracking-widest border border-emerald-500/20">
                        {question.category}
                    </span>
                </div>
                {onEdit && (
                    <button 
                        onClick={onEdit} 
                        className="opacity-0 group-hover:opacity-100 p-2 bg-slate-950 rounded-xl text-slate-400 hover:text-school-primary border border-white/5 shadow-lg transition-all"
                    >
                        <Edit3 className="h-4 w-4" />
                    </button>
                )}
            </div>
            
            <p className="text-sm font-bold text-white mb-6 leading-relaxed">{question.text}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {question.options.map((opt: string, i: number) => {
                     const isCorrect = opt === question.correctAnswer
                     return (
                         <div key={i} className={cn(
                             "p-4 rounded-xl border text-xs font-bold transition-all",
                             isCorrect 
                                ? "bg-school-primary/10 border-school-primary/30 text-school-primary shadow-inner" 
                                : "bg-slate-950 border-white/5 text-slate-500"
                         )}>
                             {String.fromCharCode(65 + i)}) {opt}
                             {isCorrect && <span className="ml-2 text-[9px] uppercase tracking-widest opacity-60">(Correct Key)</span>}
                         </div>
                     )
                 })}
            </div>
        </Card>
    )
}