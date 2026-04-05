// 'use client'

// import { useState, useEffect, useTransition } from 'react'
// import { Card } from '@/components/ui/card'
// import { 
//     generateCompositeExam, 
//     getAdminExamRegistry, 
//     getTopicsForClass,
//     type ExamGenerationConfig 
// } from '@/app/actions/exam-engine.actions'
// import { getSchoolClassesWithGrades } from '@/app/actions/subject-allocation'
// import { ExamStatCard } from '@/components/shared/examComponent'
// import { 
//     Sparkles, FileText, Loader2, 
//      AlertCircle, Database, CheckCircle2,
//    Layers, ChevronRight, Zap
// } from 'lucide-react'
// import { toast } from 'sonner'
// import { useProfileStore } from '@/store/profileStore'
// import { cn } from '@/lib/utils'

// export default function TeacherExamArchitect() {
//     const { profile } = useProfileStore()
//     const schoolId = profile?.schoolId ?? ''

//     const [isPending, startTransition] = useTransition()
//     const [step, setStep] = useState<1 | 2>(1)
    
//     // --- Data States ---
//     const [classes, setClasses] = useState<any[]>([])
//     const [availableTopics, setAvailableTopics] = useState<any[]>([])
//     const [stats, setStats] = useState<any>(null)

//     // --- Form State ---
//     const [config, setConfig] = useState<Partial<ExamGenerationConfig>>({
//         title: '',
//         type: 'TERMLY',
//         totalQuestions: 20,
//         reusePercentage: 30,
//         duration: 60,
//         topicIds: [],
//         classId: ''
//     })

//     // 1. Load Classes and Stats on Mount
//     useEffect(() => {
//         if (!schoolId) return
//         getSchoolClassesWithGrades(schoolId).then(setClasses)
//         getAdminExamRegistry(schoolId).then(res => res.success && setStats(res.stats))
//     }, [schoolId])

//     // 2. Load Topics when Class is selected
//     useEffect(() => {
//         if (config.classId) {
//             getTopicsForClass(config.classId).then(setAvailableTopics)
//         }
//     }, [config.classId])

//     const handleGeneratePool = () => {
//         if (!config.title || !config.classId || config.topicIds!.length === 0) {
//             return toast.error("Please provide a Title, Class, and at least one Topic.")
//         }
//         setStep(2)
//         toast.success("AI is synthesizing the question pool...")
//     }

//     const handleDeploy = () => {
//         if (!schoolId) return
//         startTransition(async () => {
//             const res = await generateCompositeExam({
//                 ...config,
//                 schoolId,
//                 termId: 'current-term-id', // Ideally fetched from a 'Term' context or dropdown
//             } as ExamGenerationConfig)

//             if (res.success) {
//                 toast.success("Exam Published to CBT Portal!")
//                 setStep(1)
//             } else {
//                 toast.error(res.error || "Failed to deploy exam")
//             }
//         })
//     }

//     return (
//         <div className="p-4 md:p-8 lg:p-12 bg-slate-950 min-h-screen text-slate-50 space-y-10">
//             <header className="flex items-center gap-5 border-b border-white/5 pb-10">
//                 <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl shadow-school-primary/10">
//                     <FileText className="h-7 w-7 text-school-primary" />
//                 </div>
//                 <div>
//                     <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Exam Architect</h1>
//                     <p className="text-slate-500 text-sm mt-2 font-medium">Composite CBT Generation & Question Pooling.</p>
//                 </div>
//             </header>

//             {/* ── Top Stats ── */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <ExamStatCard label="Subject Question Bank" value={stats?.totalExams ?? 0} sub="Items available" icon={Database} />
//                 <ExamStatCard label="Active Status" value="Live" sub="CBT Engine Online" icon={Zap} colorClass="text-school-primary" />
//                 <ExamStatCard label="Completed" value={`${stats?.completionRate ?? 0}%`} sub="Global Grad Rate" icon={CheckCircle2} colorClass="text-emerald-500" />
//             </div>

//             {step === 1 ? (
//                 // ── STEP 1: CONFIGURATION ──
//                 <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
//                     <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
//                         <div className="space-y-8">
//                             {/* Title & Class Selection */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div className="space-y-3">
//                                     <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Official Exam Title</label>
//                                     <input 
//                                         className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800 font-bold uppercase italic"
//                                         placeholder="e.g. Mid-Term Science"
//                                         value={config.title}
//                                         onChange={e => setConfig({...config, title: e.target.value})}
//                                     />
//                                 </div>
//                                 <div className="space-y-3">
//                                     <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Target Class</label>
//                                     <select 
//                                         className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-school-primary outline-none appearance-none font-bold uppercase"
//                                         value={config.classId}
//                                         onChange={e => setConfig({...config, classId: e.target.value})}
//                                     >
//                                         <option value="">Select Classroom...</option>
//                                         {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//                                     </select>
//                                 </div>
//                             </div>

//                             {/* Topic Selection Grid */}
//                             <div className="space-y-3">
//                                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-2">
//                                     <Layers className="h-3 w-3" /> Select Syllabus Topics to Include
//                                 </label>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-4 bg-slate-950 rounded-[1.5rem] border border-white/5 shadow-inner custom-scrollbar">
//                                     {availableTopics.map(topic => (
//                                         <button
//                                             key={topic.id}
//                                             onClick={() => setConfig(prev => ({
//                                                 ...prev,
//                                                 topicIds: prev.topicIds?.includes(topic.id) 
//                                                     ? prev.topicIds.filter(id => id !== topic.id) 
//                                                     : [...(prev.topicIds || []), topic.id]
//                                             }))}
//                                             className={cn(
//                                                 "flex items-center justify-between p-4 rounded-xl border text-left transition-all",
//                                                 config.topicIds?.includes(topic.id) 
//                                                     ? "bg-school-primary/10 border-school-primary text-school-primary" 
//                                                     : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/20"
//                                             )}
//                                         >
//                                             <span className="text-[11px] font-bold uppercase">{topic.title}</span>
//                                             {config.topicIds?.includes(topic.id) && <CheckCircle2 className="h-4 w-4" />}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* synthesis Slider & Numbers */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-white/5">
//                                 <div className="space-y-6">
//                                     <label className="text-[10px] font-black uppercase text-school-primary tracking-widest flex items-center gap-2">
//                                         <Sparkles className="h-4 w-4" /> AI Synthesis Mix
//                                     </label>
//                                     <input 
//                                         type="range" min="0" max="100" step="10"
//                                         value={config.reusePercentage}
//                                         onChange={e => setConfig({...config, reusePercentage: Number(e.target.value)})}
//                                         className="w-full accent-school-primary cursor-pointer"
//                                     />
//                                     <div className="flex justify-between text-[10px] font-black uppercase">
//                                         <span className="text-slate-500">{config.reusePercentage}% Revision</span>
//                                         <span className="text-school-primary">{100 - (config.reusePercentage || 0)}% Unseen</span>
//                                     </div>
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div className="space-y-2">
//                                         <label className="text-[9px] font-black uppercase text-slate-500">Volume</label>
//                                         <input type="number" value={config.totalQuestions} onChange={e => setConfig({...config, totalQuestions: Number(e.target.value)})} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-mono" />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <label className="text-[9px] font-black uppercase text-slate-500">Mins</label>
//                                         <input type="number" value={config.duration} onChange={e => setConfig({...config, duration: Number(e.target.value)})} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-mono" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <button 
//                             onClick={handleGeneratePool}
//                             className="w-full bg-school-primary text-school-secondary-950 font-black py-6 rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-school-primary/20 mt-12 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3"
//                         >
//                             Initialize Question Pool <ChevronRight className="h-4 w-4" />
//                         </button>
//                     </Card>

//                     <aside className="space-y-6">
//                         <div className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] shadow-xl">
//                             <AlertCircle className="h-8 w-8 text-school-primary mb-6" />
//                             <h4 className="text-white font-black uppercase tracking-widest text-sm mb-3">Protocol Info</h4>
//                             <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
//                                 The system will automatically fetch existing validated questions from the Subject Bank for the selected topics. New &quot;Unseen&quot; questions will be generated to match the current curriculum difficulty.
//                             </p>
//                         </div>
//                     </aside>
//                 </div>
//             ) : (
//                 // ── STEP 2: REVIEW ──
//                 <div className="space-y-8 animate-in slide-in-from-right-12 duration-500">
//                     <div className="flex justify-between items-center bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
//                         <div className="flex items-center gap-4">
//                             <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
//                                 <CheckCircle2 className="h-6 w-6" />
//                             </div>
//                             <div>
//                                 <h3 className="text-2xl font-black uppercase italic text-white leading-none">{config.title}</h3>
//                                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Staging {config.totalQuestions} Exam Items</p>
//                             </div>
//                         </div>
//                         <div className="flex gap-4">
//                             <button onClick={() => setStep(1)} className="px-8 py-3 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Abort</button>
//                             <button onClick={handleDeploy} disabled={isPending} className="bg-school-primary text-slate-950 px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-school-primary/20 disabled:opacity-50">
//                                 {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
//                                 Deploy to CBT Registry
//                             </button>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="col-span-full p-4 text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Question_Review_Mode_Active</div>
//                         {/* Here we would map over the actually generated/selected questions from the bank */}
//                         <p className="col-span-full text-center py-20 text-slate-700 italic font-bold">Question Preview coming from Database...</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }



'use client'

import { useState, useEffect, useTransition } from 'react'
import { Card } from '@/components/ui/card'
import { 
    generateCompositeExam, 
    getAdminExamRegistry, 
    getTopicsForClass,
    type ExamGenerationConfig,
    type AdminExamStats // ✅ Import these from your actions file
} from '@/app/actions/exam-engine.actions'
import { getSchoolClassesWithGrades } from '@/app/actions/subject-allocation'
import { ExamStatCard } from '@/components/shared/examComponent'
import { 
    Sparkles, FileText, Loader2, 
    AlertCircle, Database, CheckCircle2,
    Layers, ChevronRight, Zap
} from 'lucide-react'
import { toast } from 'sonner'
import { useProfileStore } from '@/store/profileStore'
import { cn } from '@/lib/utils'

// ── Local Interfaces for Type Safety ──────────────────────────────────────────

interface ClassSummary {
    id: string
    name: string
    grade: {
        id: string
        displayName: string
    }
}

interface TopicSummary {
    id: string
    title: string
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function TeacherExamArchitect() {
    const { profile } = useProfileStore()
    const schoolId = profile?.schoolId ?? ''

    const [isPending, startTransition] = useTransition()
    const [step, setStep] = useState<1 | 2>(1)
    
    // ✅ FIX: Replaced 'any' with specific types
    const [classes, setClasses] = useState<ClassSummary[]>([])
    const [availableTopics, setAvailableTopics] = useState<TopicSummary[]>([])
    const [stats, setStats] = useState<AdminExamStats | null>(null)

    // --- Form State ---
    const [config, setConfig] = useState<Partial<ExamGenerationConfig>>({
        title: '',
        type: 'TERMLY',
        totalQuestions: 20,
        reusePercentage: 30,
        duration: 60,
        topicIds: [],
        classId: ''
    })

    // 1. Load Classes and Stats on Mount
    useEffect(() => {
        if (!schoolId) return
        
        // Cast the results to the appropriate interfaces
        getSchoolClassesWithGrades(schoolId).then((data) => setClasses(data as ClassSummary[]))
        
        getAdminExamRegistry(schoolId).then(res => {
            if (res.success && res.stats) {
                setStats(res.stats)
            }
        })
    }, [schoolId])

    // 2. Load Topics when Class is selected
    useEffect(() => {
        if (config.classId) {
            getTopicsForClass(config.classId).then((data) => setAvailableTopics(data as TopicSummary[]))
        }
    }, [config.classId])

    const handleGeneratePool = () => {
        if (!config.title || !config.classId || !config.topicIds || config.topicIds.length === 0) {
            return toast.error("Please provide a Title, Class, and at least one Topic.")
        }
        setStep(2)
        toast.success("AI is synthesizing the question pool...")
    }

    const handleDeploy = () => {
        if (!schoolId || !config.classId) return
        
        startTransition(async () => {
            const res = await generateCompositeExam({
                ...config,
                schoolId,
                // In a production app, termId should be picked from an active session or dropdown
                termId: 'current-term-id', 
            } as ExamGenerationConfig)

            if (res.success) {
                toast.success("Exam Published to CBT Portal!")
                setStep(1)
                // Optionally reset config
                setConfig(prev => ({ ...prev, title: '', topicIds: [] }))
            } else {
                toast.error(res.error || "Failed to deploy exam")
            }
        })
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 bg-slate-950 min-h-screen text-slate-50 space-y-10">
            <header className="flex items-center gap-5 border-b border-white/5 pb-10">
                <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
                    <FileText className="h-7 w-7 text-school-primary" />
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Exam Architect</h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">Composite CBT Generation & Question Pooling.</p>
                </div>
            </header>

            {/* ── Top Stats ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ExamStatCard label="Subject Bank" value={stats?.totalExams ?? 0} sub="Items available" icon={Database} />
                <ExamStatCard label="Active Sessions" value="Live" sub="CBT Engine Online" icon={Zap} colorClass="text-school-primary" />
                <ExamStatCard label="Grading Index" value={`${stats?.completionRate ?? 0}%`} sub="Global Grad Rate" icon={CheckCircle2} colorClass="text-emerald-500" />
            </div>

            {step === 1 ? (
                // ── STEP 1: CONFIGURATION ──
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Official Exam Title</label>
                                    <input 
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800 font-bold uppercase italic"
                                        placeholder="e.g. Mid-Term Science"
                                        value={config.title}
                                        onChange={e => setConfig({...config, title: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Target Class</label>
                                    <select 
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-school-primary outline-none appearance-none font-bold uppercase"
                                        value={config.classId}
                                        onChange={e => setConfig({...config, classId: e.target.value})}
                                    >
                                        <option value="">Select Classroom...</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-2">
                                    <Layers className="h-3 w-3" /> Select Syllabus Topics to Include
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-4 bg-slate-950 rounded-[1.5rem] border border-white/5 shadow-inner custom-scrollbar">
                                    {availableTopics.map(topic => (
                                        <button
                                            key={topic.id}
                                            onClick={() => setConfig(prev => ({
                                                ...prev,
                                                topicIds: prev.topicIds?.includes(topic.id) 
                                                    ? prev.topicIds.filter(id => id !== topic.id) 
                                                    : [...(prev.topicIds || []), topic.id]
                                            }))}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-xl border text-left transition-all",
                                                config.topicIds?.includes(topic.id) 
                                                    ? "bg-school-primary/10 border-school-primary text-school-primary shadow-lg" 
                                                    : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/20"
                                            )}
                                        >
                                            <span className="text-[11px] font-bold uppercase">{topic.title}</span>
                                            {config.topicIds?.includes(topic.id) && <CheckCircle2 className="h-4 w-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-white/5">
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black uppercase text-school-primary tracking-widest flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" /> AI Synthesis Mix
                                    </label>
                                    <input 
                                        type="range" min="0" max="100" step="10"
                                        value={config.reusePercentage}
                                        onChange={e => setConfig({...config, reusePercentage: Number(e.target.value)})}
                                        className="w-full accent-school-primary cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">{config.reusePercentage}% Revision</span>
                                        <span className="text-school-primary">{100 - (config.reusePercentage || 0)}% Unseen</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Items</label>
                                        <input type="number" value={config.totalQuestions} onChange={e => setConfig({...config, totalQuestions: Number(e.target.value)})} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-mono focus:border-school-primary outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Duration</label>
                                        <input type="number" value={config.duration} onChange={e => setConfig({...config, duration: Number(e.target.value)})} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-mono focus:border-school-primary outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleGeneratePool}
                            className="w-full bg-school-primary text-school-secondary-950 font-black py-6 rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-school-primary/20 mt-12 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3"
                        >
                            Initialize Question Pool <ChevronRight className="h-4 w-4" />
                        </button>
                    </Card>

                    <aside className="space-y-6">
                        <div className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] shadow-xl">
                            <AlertCircle className="h-8 w-8 text-school-primary mb-6" />
                            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-3 italic">Generation Protocol</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                                Existing questions are retrieved from the institutional Subject Bank. New &quot;Unseen&quot; questions are generated via AI to align with specified topic complexity.
                            </p>
                        </div>
                    </aside>
                </div>
            ) : (
                // ── STEP 2: REVIEW ──
                <div className="space-y-8 animate-in slide-in-from-right-12 duration-500">
                    <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase italic text-white leading-none">{config.title}</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Staging {config.totalQuestions} Academic Items</p>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <button onClick={() => setStep(1)} className="flex-1 md:flex-none px-8 py-3 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all border border-white/5">Abort</button>
                            <button onClick={handleDeploy} disabled={isPending} className="flex-1 md:flex-none bg-school-primary text-slate-950 px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-school-primary/20 disabled:opacity-50">
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                Deploy to CBT Vault
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-full p-4 text-center text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] border-b border-white/5">Question_Audit_Active</div>
                        <p className="col-span-full text-center py-20 text-slate-600 italic font-bold uppercase text-xs tracking-widest opacity-50">Synchronizing question bank preview...</p>
                    </div>
                </div>
            )}
        </div>
    )
}