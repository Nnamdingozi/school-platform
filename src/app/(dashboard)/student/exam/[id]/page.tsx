// 'use client'

// import { useState } from 'react'
// import { Card } from '@/components/ui/card'
// import { Clock, ArrowRight, ArrowLeft, Send } from 'lucide-react'
// import { submitExam } from '@/app/actions/exam-engine.actions'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'
// import { useRouter } from 'next/navigation'

// export default function StudentCBT({ exam, studentId, schoolId }: any) {
//     const router = useRouter()
//     const [currentIdx, setCurrentIdx] = useState(0)
//     const [answers, setAnswers] = useState<Record<string, string>>({})
//     const [submitting, setSubmitting] = useState(false)

//     const question = exam.questions[currentIdx].question;

//     const handleSubmit = async () => {
//         setSubmitting(true)
//         const res = await submitExam(exam.id, studentId, schoolId, answers)
//         if (res.success) {
//             toast.success(`Exam submitted successfully.`)
//             router.push('/student/grades')
//         }
//         setSubmitting(false)
//     }

//     return (
//         <div className="min-h-screen bg-slate-950 text-white flex flex-col p-4 md:p-8 lg:p-12">
            
//             {/* Header: Timer and Context */}
//             <header className="flex justify-between items-center mb-12 bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
//                 <div className="flex items-center gap-6">
//                     <div className="h-16 w-16 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-inner">
//                         <Clock className="h-8 w-8 text-school-primary animate-pulse" />
//                     </div>
//                     <div>
//                         <h2 className="text-3xl font-black uppercase italic text-white leading-none">{exam.title}</h2>
//                         <p className="text-[11px] text-slate-500 uppercase font-black tracking-[0.2em] mt-2">Computer Based Testing • Live</p>
//                     </div>
//                 </div>
//                 <div className="text-right">
//                     <p className="text-4xl font-mono font-black text-school-primary tracking-tighter">
//                         {exam.duration}:00
//                     </p>
//                     <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Minutes Remaining</p>
//                 </div>
//             </header>

//             {/* Question Display */}
//             <div className="max-w-5xl mx-auto w-full space-y-6 flex-1 flex flex-col">
                
//                 <div className="flex justify-between items-center px-6">
//                     <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
//                         Question {currentIdx + 1} of {exam.questions.length}
//                     </span>
//                     <span className="text-[11px] font-black text-school-primary uppercase tracking-widest">
//                         {Object.keys(answers).length} Answered
//                     </span>
//                 </div>

//                 <Card className="bg-slate-900 border-white/5 rounded-[3rem] p-10 lg:p-16 shadow-2xl flex-1 flex flex-col justify-between">
//                     <div>
//                         <h3 className="text-3xl font-bold leading-relaxed text-white mb-12 italic">
//                             {question.text}
//                         </h3>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             {question.options.map((opt: string, i: number) => {
//                                 const isSelected = answers[question.id] === opt
//                                 return (
//                                     <button 
//                                         key={opt}
//                                         onClick={() => setAnswers({...answers, [question.id]: opt})}
//                                         className={cn(
//                                             "w-full text-left p-6 rounded-2xl border transition-all font-bold text-sm flex items-center gap-4",
//                                             isSelected 
//                                                 ? "bg-school-primary border-school-primary text-school-secondary-950 shadow-[0_0_30px_rgba(var(--school-primary-rgb),0.2)] scale-[1.02]" 
//                                                 : "bg-slate-950 border-white/5 text-slate-400 hover:border-school-primary/40 hover:text-white"
//                                         )}
//                                     >
//                                         <span className={cn(
//                                             "h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-black uppercase transition-colors",
//                                             isSelected ? "bg-school-secondary-950/20 text-slate-900" : "bg-slate-900 text-slate-600"
//                                         )}>
//                                             {String.fromCharCode(65 + i)}
//                                         </span>
//                                         {opt}
//                                     </button>
//                                 )
//                             })}
//                         </div>
//                     </div>

//                     <div className="flex justify-between items-center pt-12 border-t border-white/5 mt-12">
//                         <button 
//                             disabled={currentIdx === 0}
//                             onClick={() => setCurrentIdx(p => p - 1)}
//                             className="flex items-center gap-3 text-slate-500 font-black uppercase text-[10px] hover:text-white transition-all disabled:opacity-0 tracking-widest"
//                         >
//                             <ArrowLeft className="h-4 w-4" /> Previous
//                         </button>

//                         {currentIdx === exam.questions.length - 1 ? (
//                             <button 
//                                 onClick={handleSubmit} disabled={submitting}
//                                 className="bg-emerald-500 text-slate-950 font-black px-12 py-5 rounded-[2rem] hover:scale-105 active:scale-95 transition-all uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-emerald-500/20 flex items-center gap-3"
//                             >
//                                 {submitting ? "Processing..." : "Submit Exam"} <Send className="h-4 w-4" />
//                             </button>
//                         ) : (
//                             <button 
//                                 onClick={() => setCurrentIdx(p => p + 1)}
//                                 className="flex items-center gap-3 text-school-primary font-black uppercase text-[10px] hover:scale-105 active:scale-95 transition-all tracking-widest bg-school-primary/10 px-8 py-4 rounded-2xl border border-school-primary/20"
//                             >
//                                 Next <ArrowRight className="h-4 w-4" />
//                             </button>
//                         )}
//                     </div>
//                 </Card>
//             </div>
//         </div>
//     )
// }


// 'use client'

// import { useState } from 'react'
// import { Card } from '@/components/ui/card'
// import { Clock, ArrowRight, ArrowLeft, Send, Loader2 } from 'lucide-react'
// import { submitExam } from '@/app/actions/exam-engine.actions'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'
// import { useRouter } from 'next/navigation'
// import { getErrorMessage } from '@/lib/error-handler'

// // ── Types ──────────────────────────────────────────────────────────────────────

// interface QuestionData {
//     id: string
//     text: string
//     options: string[] // We know AI generates an array of strings
// }

// interface ExamQuestionLink {
//     questionId: string
//     question: QuestionData
// }

// interface ExamData {
//     id: string
//     title: string
//     duration: number
//     questions: ExamQuestionLink[]
// }

// interface StudentCBTProps {
//     exam: ExamData
//     studentId: string
//     schoolId: string
// }

// // ── Main Component ─────────────────────────────────────────────────────────────

// export default function StudentCBT({ exam, studentId, schoolId }: StudentCBTProps) {
//     const router = useRouter()
//     const [currentIdx, setCurrentIdx] = useState(0)
//     const [answers, setAnswers] = useState<Record<string, string>>({})
//     const [submitting, setSubmitting] = useState(false)

//     // Helper to get the current active question data
//     const currentLink = exam.questions[currentIdx]
//     const question = currentLink.question

//     const handleSubmit = async () => {
//         // Validation: Ensure all questions are answered before submitting
//         const answeredCount = Object.keys(answers).length
//         if (answeredCount < exam.questions.length) {
//             toast.error(`Please answer all ${exam.questions.length} questions before submitting.`)
//             return
//         }

//         setSubmitting(true)
//         try {
//             const res = await submitExam(exam.id, studentId, schoolId, answers)
//             if (res.success) {
//                 toast.success(`Exam submitted successfully.`)
//                 router.push('/student/grades')
//             } else {
//                 toast.error(res.error || "Submission failed.")
//             }
//         } catch (err) {
//             toast.error("Network error during submission.")
//             getErrorMessage(err)
//         } finally {
//             setSubmitting(false)
//         }
//     }

//     return (
//         <div className="min-h-screen bg-slate-950 text-white flex flex-col p-4 md:p-8 lg:p-12 font-sans">
            
//             {/* Header: Timer and Context */}
//             <header className="flex justify-between items-center mb-12 bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
//                 <div className="flex items-center gap-6">
//                     <div className="h-16 w-16 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-inner">
//                         <Clock className="h-8 w-8 text-school-primary animate-pulse" />
//                     </div>
//                     <div>
//                         <h2 className="text-3xl font-black uppercase italic text-white leading-none tracking-tight">
//                             {exam.title}
//                         </h2>
//                         <p className="text-[11px] text-slate-500 uppercase font-black tracking-widest mt-2">
//                             Institutional CBT Environment • Active Session
//                         </p>
//                     </div>
//                 </div>
//                 <div className="text-right">
//                     <p className="text-4xl font-mono font-black text-school-primary tracking-tighter">
//                         {exam.duration}:00
//                     </p>
//                     <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Minutes Remaining</p>
//                 </div>
//             </header>

//             {/* Question Display */}
//             <div className="max-w-5xl mx-auto w-full space-y-6 flex-1 flex flex-col">
                
//                 <div className="flex justify-between items-center px-6">
//                     <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
//                         Assessment Node {currentIdx + 1} of {exam.questions.length}
//                     </span>
//                     <span className={cn(
//                         "text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
//                         Object.keys(answers).length === exam.questions.length 
//                             ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" 
//                             : "text-school-primary border-school-primary/20 bg-school-primary/5"
//                     )}>
//                         {Object.keys(answers).length} of {exam.questions.length} Answered
//                     </span>
//                 </div>

//                 <Card className="bg-slate-900 border-white/5 rounded-[3rem] p-10 lg:p-16 shadow-2xl flex-1 flex flex-col justify-between">
//                     <div className="animate-in fade-in slide-in-from-right-4 duration-500">
//                         <h3 className="text-3xl font-bold leading-relaxed text-white mb-12 italic tracking-tight">
//                             {question.text}
//                         </h3>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             {(question.options as string[]).map((opt: string, i: number) => {
//                                 const isSelected = answers[question.id] === opt
//                                 return (
//                                     <button 
//                                         key={opt}
//                                         onClick={() => setAnswers({...answers, [question.id]: opt})}
//                                         className={cn(
//                                             "w-full text-left p-6 rounded-2xl border transition-all font-bold text-sm flex items-center gap-4",
//                                             isSelected 
//                                                 ? "bg-school-primary border-school-primary text-school-secondary-950 shadow-[0_0_30px_rgba(var(--school-primary-rgb),0.2)] scale-[1.02]" 
//                                                 : "bg-slate-950 border-white/5 text-slate-400 hover:border-school-primary/40 hover:text-white"
//                                         )}
//                                     >
//                                         <span className={cn(
//                                             "h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-black uppercase transition-colors",
//                                             isSelected ? "bg-school-secondary-950/20 text-slate-900" : "bg-slate-900 text-slate-600"
//                                         )}>
//                                             {String.fromCharCode(65 + i)}
//                                         </span>
//                                         {opt}
//                                     </button>
//                                 )
//                             })}
//                         </div>
//                     </div>

//                     <div className="flex justify-between items-center pt-12 border-t border-white/5 mt-12">
//                         <button 
//                             disabled={currentIdx === 0}
//                             onClick={() => setCurrentIdx(p => p - 1)}
//                             className="flex items-center gap-3 text-slate-500 font-black uppercase text-[10px] hover:text-white transition-all disabled:opacity-0 tracking-widest"
//                         >
//                             <ArrowLeft className="h-4 w-4" /> Previous
//                         </button>

//                         {currentIdx === exam.questions.length - 1 ? (
//                             <button 
//                                 onClick={handleSubmit} 
//                                 disabled={submitting}
//                                 className="bg-emerald-500 text-slate-950 font-black px-12 py-5 rounded-[2rem] hover:scale-105 active:scale-95 transition-all uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-emerald-500/20 flex items-center gap-3"
//                             >
//                                 {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Finalize Submission"} <Send className="h-4 w-4" />
//                             </button>
//                         ) : (
//                             <button 
//                                 onClick={() => setCurrentIdx(p => p + 1)}
//                                 className="flex items-center gap-3 text-school-primary font-black uppercase text-[10px] hover:scale-105 active:scale-95 transition-all tracking-widest bg-school-primary/10 px-8 py-4 rounded-2xl border border-school-primary/20"
//                             >
//                                 Next Node <ArrowRight className="h-4 w-4" />
//                             </button>
//                         )}
//                     </div>
//                 </Card>
//             </div>
//         </div>
//     )
// }


'use client'

import { useState, useEffect, use } from 'react'
import { Card } from '@/components/ui/card'
import { 
    Clock, ArrowRight, ArrowLeft, Send, 
    Loader2, AlertCircle, BookCheck, Info 
} from 'lucide-react'
import { 
    submitExam, 
    getTopicsForClass, 
    getAdminExamRegistry,
    type ExamRegistryItem 
} from '@/app/actions/exam-engine.actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useProfileStore } from '@/store/profileStore'
import { getErrorMessage } from '@/lib/error-handler'

// ── Types ──────────────────────────────────────────────────────────────────────

interface QuestionData {
    id: string
    text: string
    options: string[]
}

interface ExamQuestionLink {
    questionId: string
    question: QuestionData
}

interface ExamData {
    id: string
    title: string
    duration: number
    classId: string
    questions: ExamQuestionLink[]
}

// ✅ Extend the action type to include the missing classId for local usage
interface ExtendedExamRegistryItem extends ExamRegistryItem {
    classId: string;
}

// ── Main Page Component ────────────────────────────────────────────────────────

export default function StudentExamPage({ params }: { params: Promise<{ id: string }> }) {
    // ✅ FIX: Correctly unwrap params for Next.js 15
    const resolvedParams = use(params)
    const examId = resolvedParams.id
    
    const router = useRouter()
    const { profile, isLoading: isProfileLoading } = useProfileStore()
    
    // --- State Management ---
    const [exam, setExam] = useState<ExamData | null>(null) 
    const [coveredTopics, setCoveredTopics] = useState<{id: string, title: string}[]>([]) 
    const [loading, setLoading] = useState(true)
    const [currentIdx, setCurrentIdx] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)

    const schoolId = profile?.schoolId ?? ''
    const studentId = profile?.id ?? ''

    // 1. Initialize CBT Environment
    useEffect(() => {
        async function initializeCBT() {
            if (!examId || !schoolId) return
            try {
                const res = await getAdminExamRegistry(schoolId)
                
                if (res.success && res.exams) {
                    // ✅ FIX: Cast to Extended type to access classId
                    const foundExam = res.exams.find((e) => e.id === examId) as ExtendedExamRegistryItem
                    
                    if (foundExam) {
                        setExam(foundExam as unknown as ExamData)

                        // ✅ UTILIZED: getTopicsForClass via the found classId
                        const topics = await getTopicsForClass(foundExam.classId)
                        setCoveredTopics(topics)
                    }
                }
            } catch (err) {
                toast.error(getErrorMessage(err))
            } finally {
                setLoading(false)
            }
        }
        initializeCBT()
    }, [examId, schoolId])

    const handleSubmit = async () => {
        if (!exam) return

        const answeredCount = Object.keys(answers).length
        if (answeredCount < exam.questions.length) {
            toast.error(`Incomplete: Please provide answers for all ${exam.questions.length} items.`)
            return
        }

        setSubmitting(true)
        try {
            const res = await submitExam(exam.id, studentId, schoolId, answers)
            if (res.success) {
                toast.success(`Submission finalized. Score: ${res.score}/${res.maxScore}`)
                router.push('/student/grades')
            } else {
                toast.error(res?.error || "CBT Synchronization failure.")
            }
        } catch (err) {
            toast.error(getErrorMessage(err))
        } finally {
            setSubmitting(false)
        }
    }

    if (isProfileLoading || loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
                <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">Accessing_Registry...</p>
            </div>
        )
    }

    if (!exam) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-black text-white uppercase italic">Entry Missing</h2>
                <button onClick={() => router.back()} className="mt-4 bg-school-primary text-slate-950 px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest">Return</button>
            </div>
        )
    }

    const currentQuestion = exam.questions[currentIdx]?.question

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col p-4 md:p-8 lg:p-12 font-sans overflow-hidden">
            
            {/* ── Header ── */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative">
                <div className="flex items-center gap-6 relative z-10">
                    <div className="h-16 w-16 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-inner">
                        <Clock className="h-8 w-8 text-school-primary animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase italic text-white leading-none tracking-tighter">{exam.title}</h2>
                        <div className="flex items-center gap-2 mt-2">
                             <BookCheck className="h-3 w-3 text-emerald-500" />
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                {coveredTopics.length > 0 
                                    ? `Topics: ${coveredTopics.map(t => t.title).join(", ")}` 
                                    : "Full Syllabus Coverage"}
                             </span>
                        </div>
                    </div>
                </div>
                <div className="text-right mt-4 md:mt-0">
                    <p className="text-4xl font-mono font-black text-school-primary tracking-tighter leading-none">{exam.duration}:00</p>
                    <p className="text-[9px] text-slate-500 font-black tracking-widest mt-2 uppercase">Remaining Time</p>
                </div>
            </header>

            <div className="max-w-5xl mx-auto w-full space-y-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center px-6">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Question {currentIdx + 1} of {exam.questions.length}
                    </span>
                    <div className="flex items-center gap-2 text-school-primary bg-school-primary/5 px-3 py-1 rounded-full border border-school-primary/20">
                         <Info className="h-3 w-3" />
                         <span className="text-[9px] font-black uppercase tracking-widest">
                            Progress: {Object.keys(answers).length} / {exam.questions.length}
                         </span>
                    </div>
                </div>

                <Card className="bg-slate-900 border-white/5 rounded-[3rem] p-10 lg:p-16 shadow-2xl flex-1 flex flex-col justify-between">
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <h3 className="text-3xl font-bold leading-relaxed text-white mb-12 italic tracking-tight">
                            {currentQuestion?.text}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(currentQuestion?.options as string[] || []).map((opt, i) => {
                                const isSelected = answers[currentQuestion.id] === opt
                                return (
                                    <button 
                                        key={opt}
                                        onClick={() => setAnswers({...answers, [currentQuestion.id]: opt})}
                                        className={cn(
                                            "w-full text-left p-6 rounded-2xl border transition-all font-bold text-sm flex items-center gap-4",
                                            isSelected 
                                                ? "bg-school-primary border-school-primary text-school-secondary-950 shadow-[0_0_40px_rgba(var(--school-primary-rgb),0.4)] scale-[1.02]" 
                                                : "bg-slate-950 border-white/5 text-slate-400 hover:border-school-primary/30 hover:text-white"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-colors",
                                            isSelected ? "bg-school-secondary-950/20 text-slate-900" : "bg-slate-900 text-slate-700"
                                        )}>
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                        {opt}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-12 border-t border-white/5 mt-12">
                        <button 
                            disabled={currentIdx === 0}
                            onClick={() => setCurrentIdx(p => p - 1)}
                            className="flex items-center gap-3 text-slate-500 font-black uppercase text-[10px] hover:text-white transition-all disabled:opacity-0"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back
                        </button>

                        {currentIdx === exam.questions.length - 1 ? (
                            <button 
                                onClick={handleSubmit} 
                                disabled={submitting}
                                className="bg-emerald-500 text-slate-950 font-black px-12 py-5 rounded-[2rem] hover:scale-105 active:scale-95 transition-all uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3"
                            >
                                {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Submit Final"} <Send className="h-4 w-4" />
                            </button>
                        ) : (
                            <button 
                                onClick={() => setCurrentIdx(p => p + 1)}
                                className="flex items-center gap-3 text-school-primary font-black uppercase text-[10px] hover:scale-105 active:scale-95 transition-all tracking-widest bg-school-primary/10 px-10 py-4 rounded-2xl border border-school-primary/20"
                            >
                                Continue <ArrowRight className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}