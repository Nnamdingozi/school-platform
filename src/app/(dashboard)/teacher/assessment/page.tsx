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



// 'use client'

// import { useState, useEffect, useTransition } from 'react'
// import { Card } from '@/components/ui/card'
// import { 
//     generateCompositeExam, 
//     getAdminExamRegistry, 
//     getTopicsForClass,
//     type ExamGenerationConfig,
//     type AdminExamStats // ✅ Import these from your actions file
// } from '@/app/actions/exam-engine.actions'
// import { getSchoolClassesWithGrades } from '@/app/actions/subject-allocation'
// import { ExamStatCard } from '@/components/shared/examComponent'
// import { 
//     Sparkles, FileText, Loader2, 
//     AlertCircle, Database, CheckCircle2,
//     Layers, ChevronRight, Zap
// } from 'lucide-react'
// import { toast } from 'sonner'
// import { useProfileStore } from '@/store/profileStore'
// import { cn } from '@/lib/utils'

// // ── Local Interfaces for Type Safety ──────────────────────────────────────────

// interface ClassSummary {
//     id: string
//     name: string
//     grade: {
//         id: string
//         displayName: string
//     }
// }

// interface TopicSummary {
//     id: string
//     title: string
// }

// // ── Main Component ─────────────────────────────────────────────────────────────

// export default function TeacherExamArchitect() {
//     const { profile } = useProfileStore()
//     const schoolId = profile?.schoolId ?? ''

//     const [isPending, startTransition] = useTransition()
//     const [step, setStep] = useState<1 | 2>(1)
    
//     // ✅ FIX: Replaced 'any' with specific types
//     const [classes, setClasses] = useState<ClassSummary[]>([])
//     const [availableTopics, setAvailableTopics] = useState<TopicSummary[]>([])
//     const [stats, setStats] = useState<AdminExamStats | null>(null)

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
        
//         // Cast the results to the appropriate interfaces
//         getSchoolClassesWithGrades(schoolId).then((data) => setClasses(data as ClassSummary[]))
        
//         getAdminExamRegistry(schoolId).then(res => {
//             if (res.success && res.stats) {
//                 setStats(res.stats)
//             }
//         })
//     }, [schoolId])

//     // 2. Load Topics when Class is selected
//     useEffect(() => {
//         if (config.classId) {
//             getTopicsForClass(config.classId).then((data) => setAvailableTopics(data as TopicSummary[]))
//         }
//     }, [config.classId])

//     const handleGeneratePool = () => {
//         if (!config.title || !config.classId || !config.topicIds || config.topicIds.length === 0) {
//             return toast.error("Please provide a Title, Class, and at least one Topic.")
//         }
//         setStep(2)
//         toast.success("AI is synthesizing the question pool...")
//     }

//     const handleDeploy = () => {
//         if (!schoolId || !config.classId) return
        
//         startTransition(async () => {
//             const res = await generateCompositeExam({
//                 ...config,
//                 schoolId,
//                 // In a production app, termId should be picked from an active session or dropdown
//                 termId: 'current-term-id', 
//             } as ExamGenerationConfig)

//             if (res.success) {
//                 toast.success("Exam Published to CBT Portal!")
//                 setStep(1)
//                 // Optionally reset config
//                 setConfig(prev => ({ ...prev, title: '', topicIds: [] }))
//             } else {
//                 toast.error(res.error || "Failed to deploy exam")
//             }
//         })
//     }

//     return (
//         <div className="p-4 md:p-8 lg:p-12 bg-slate-950 min-h-screen text-slate-50 space-y-10">
//             <header className="flex items-center gap-5 border-b border-white/5 pb-10">
//                 <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
//                     <FileText className="h-7 w-7 text-school-primary" />
//                 </div>
//                 <div>
//                     <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Exam Architect</h1>
//                     <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">Composite CBT Generation & Question Pooling.</p>
//                 </div>
//             </header>

//             {/* ── Top Stats ── */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <ExamStatCard label="Subject Bank" value={stats?.totalExams ?? 0} sub="Items available" icon={Database} />
//                 <ExamStatCard label="Active Sessions" value="Live" sub="CBT Engine Online" icon={Zap} colorClass="text-school-primary" />
//                 <ExamStatCard label="Grading Index" value={`${stats?.completionRate ?? 0}%`} sub="Global Grad Rate" icon={CheckCircle2} colorClass="text-emerald-500" />
//             </div>

//             {step === 1 ? (
//                 // ── STEP 1: CONFIGURATION ──
//                 <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
//                     <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
//                         <div className="space-y-8">
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
//                                                     ? "bg-school-primary/10 border-school-primary text-school-primary shadow-lg" 
//                                                     : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/20"
//                                             )}
//                                         >
//                                             <span className="text-[11px] font-bold uppercase">{topic.title}</span>
//                                             {config.topicIds?.includes(topic.id) && <CheckCircle2 className="h-4 w-4" />}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>

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
//                                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
//                                         <span className="text-slate-500">{config.reusePercentage}% Revision</span>
//                                         <span className="text-school-primary">{100 - (config.reusePercentage || 0)}% Unseen</span>
//                                     </div>
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div className="space-y-2">
//                                         <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Items</label>
//                                         <input type="number" value={config.totalQuestions} onChange={e => setConfig({...config, totalQuestions: Number(e.target.value)})} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-mono focus:border-school-primary outline-none" />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Duration</label>
//                                         <input type="number" value={config.duration} onChange={e => setConfig({...config, duration: Number(e.target.value)})} className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-mono focus:border-school-primary outline-none" />
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
//                             <h4 className="text-white font-black uppercase tracking-widest text-sm mb-3 italic">Generation Protocol</h4>
//                             <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
//                                 Existing questions are retrieved from the institutional Subject Bank. New &quot;Unseen&quot; questions are generated via AI to align with specified topic complexity.
//                             </p>
//                         </div>
//                     </aside>
//                 </div>
//             ) : (
//                 // ── STEP 2: REVIEW ──
//                 <div className="space-y-8 animate-in slide-in-from-right-12 duration-500">
//                     <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl gap-6">
//                         <div className="flex items-center gap-4">
//                             <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
//                                 <CheckCircle2 className="h-6 w-6" />
//                             </div>
//                             <div>
//                                 <h3 className="text-2xl font-black uppercase italic text-white leading-none">{config.title}</h3>
//                                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Staging {config.totalQuestions} Academic Items</p>
//                             </div>
//                         </div>
//                         <div className="flex gap-4 w-full md:w-auto">
//                             <button onClick={() => setStep(1)} className="flex-1 md:flex-none px-8 py-3 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all border border-white/5">Abort</button>
//                             <button onClick={handleDeploy} disabled={isPending} className="flex-1 md:flex-none bg-school-primary text-slate-950 px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-school-primary/20 disabled:opacity-50">
//                                 {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
//                                 Deploy to CBT Vault
//                             </button>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="col-span-full p-4 text-center text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] border-b border-white/5">Question_Audit_Active</div>
//                         <p className="col-span-full text-center py-20 text-slate-600 italic font-bold uppercase text-xs tracking-widest opacity-50">Synchronizing question bank preview...</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }



// 'use client'

// import { useState, useEffect, useTransition, useMemo } from 'react'
// import { Card } from '@/components/ui/card'
// import { 
//     getTeacherExamContext, 
//     getGroupedTopics,
//     generateCompositeExam,
//     getAdminExamRegistry
// } from '@/app/actions/exam-engine.actions'
// import { useProfileStore } from '@/store/profileStore'
// import { 
//     FileText, CheckCircle2, Layers, ChevronRight, 
//     BookOpen, GraduationCap, Zap, Database, X, 
//     LayoutGrid, ClipboardCheck
// } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { toast } from 'sonner'
// import { ExamStatCard } from '@/components/shared/examComponent'

// export default function TeacherExamArchitect() {
//     const { profile } = useProfileStore()
//     const [isPending, startTransition] = useTransition()
    
//     // Data States
//     const [assignments, setAssignments] = useState<any[]>([])
//     const [physicalClasses, setPhysicalClasses] = useState<any[]>([])
//     const [termGroups, setTermGroups] = useState<any[]>([])
//     const [stats, setStats] = useState<any>(null)

//     // Form States
//     const [selectedAssignmentId, setSelectedAssignmentId] = useState("")
//     const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
//     const [config, setConfig] = useState({
//         title: '',
//         type: 'TERMLY' as any,
//         classId: '',
//         duration: 60,
//         totalQuestions: 20
//     })

//     // 1. Initial Load
//     useEffect(() => {
//         if (profile?.id && profile?.schoolId) {
//             getTeacherExamContext(profile.id, profile.schoolId).then(res => {
//                 setAssignments(res.assignments)
//                 setPhysicalClasses(res.classes)
//             })
//             getAdminExamRegistry(profile.schoolId).then(res => {
//                 if (res.success) setStats(res.stats)
//             })
//         }
//     }, [profile])

//     // 2. Fetch Topics when Assignment changes
//     useEffect(() => {
//         if (selectedAssignmentId) {
//             getGroupedTopics(selectedAssignmentId).then(setTermGroups)
//         }
//     }, [selectedAssignmentId])

//     // Helper: Get Titles of selected topics
//     const selectedTopicTitles = useMemo(() => {
//         const allTopics = termGroups.flatMap(t => t.topics)
//         return allTopics.filter(t => selectedTopicIds.includes(t.id))
//     }, [selectedTopicIds, termGroups])

//     const toggleTopic = (id: string) => {
//         setSelectedTopicIds(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
//     }

//     return (
//         <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-10">
//             <header className="flex items-center gap-4 border-b border-white/5 pb-8">
//                 <div className="h-12 w-12 rounded-xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center">
//                     <Zap className="text-school-primary h-6 w-6" />
//                 </div>
//                 <div>
//                     <h1 className="text-3xl font-black uppercase italic tracking-tighter">Exam Architect</h1>
//                     <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Syllabus-Based Assessment Engine</p>
//                 </div>
//             </header>

//             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                
//                 {/* ── COLUMN 1: SUBJECT PICKER ── */}
//                 <div className="space-y-4">
//                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">1. Select Subject</p>
//                     {assignments.map(item => (
//                         <button
//                             key={item.id}
//                             onClick={() => { setSelectedAssignmentId(item.id); setSelectedTopicIds([]); }}
//                             className={cn(
//                                 "w-full p-5 rounded-2xl border text-left transition-all",
//                                 selectedAssignmentId === item.id 
//                                     ? "bg-school-primary border-school-primary shadow-lg shadow-school-primary/20" 
//                                     : "bg-slate-900 border-white/5 hover:bg-slate-800"
//                             )}
//                         >
//                             <p className={cn("text-[10px] font-black uppercase", selectedAssignmentId === item.id ? "text-slate-900" : "text-slate-500")}>
//                                 {item.grade.displayName}
//                             </p>
//                             <h4 className={cn("text-base font-bold uppercase italic", selectedAssignmentId === item.id ? "text-slate-950" : "text-white")}>
//                                 {item.subject.name}
//                             </h4>
//                         </button>
//                     ))}
//                 </div>

//                 {/* ── COLUMN 2 & 3: TOPIC SELECTION ── */}
//                 <div className="lg:col-span-2 space-y-6">
//                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">2. Grouped Syllabus</p>
//                     {termGroups.length === 0 ? (
//                         <div className="py-20 text-center bg-slate-900/50 rounded-[2rem] border border-dashed border-white/5 opacity-40">
//                             <Layers className="h-8 w-8 mx-auto mb-3" />
//                             <p className="text-[10px] font-black uppercase tracking-widest">Select a subject to load topics</p>
//                         </div>
//                     ) : (
//                         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
//                             {termGroups.map(term => (
//                                 <div key={term.id} className="space-y-3">
//                                     <div className="flex items-center gap-2 text-school-primary px-2">
//                                         <GraduationCap className="h-4 w-4" />
//                                         <h3 className="text-xs font-black uppercase tracking-widest">{term.displayName}</h3>
//                                     </div>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                                         {term.topics.map((topic: any) => (
//                                             <button
//                                                 key={topic.id}
//                                                 onClick={() => toggleTopic(topic.id)}
//                                                 className={cn(
//                                                     "p-4 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between",
//                                                     selectedTopicIds.includes(topic.id)
//                                                         ? "bg-school-primary/10 border-school-primary text-school-primary"
//                                                         : "bg-slate-900 border-white/5 text-slate-400"
//                                                 )}
//                                             >
//                                                 {topic.title}
//                                                 {selectedTopicIds.includes(topic.id) && <CheckCircle2 className="h-3 w-3" />}
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 {/* ── COLUMN 4: SELECTED & CONFIG ── */}
//                 <div className="space-y-6">
//                     <Card className="bg-slate-900 border-white/5 p-6 rounded-[2rem] shadow-2xl">
//                         <div className="flex items-center gap-2 mb-6 text-school-primary">
//                             <ClipboardCheck className="h-4 w-4" />
//                             <h3 className="text-[10px] font-black uppercase tracking-widest">Selected Topics ({selectedTopicIds.length})</h3>
//                         </div>
//                         <div className="space-y-2 mb-8 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
//                             {selectedTopicTitles.map(t => (
//                                 <div key={t.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-white/5">
//                                     <span className="text-[10px] font-bold text-slate-300 uppercase truncate pr-4">{t.title}</span>
//                                     <button onClick={() => toggleTopic(t.id)}><X className="h-3 w-3 text-slate-600 hover:text-red-500" /></button>
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="space-y-4 pt-6 border-t border-white/5">
//                             <div className="space-y-2">
//                                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Target Classroom</label>
//                                 <select 
//                                     className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-3 text-xs text-white outline-none"
//                                     value={config.classId}
//                                     onChange={e => setConfig({...config, classId: e.target.value})}
//                                 >
//                                     <option value="">Choose physical class...</option>
//                                     {physicalClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//                                 </select>
//                             </div>
//                             <button 
//                                 disabled={selectedTopicIds.length === 0 || !config.classId}
//                                 className="w-full bg-school-primary text-slate-950 font-black py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-20 transition-all"
//                             >
//                                 Build Pool
//                             </button>
//                         </div>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     )
// }


// 'use client'

// import { useState, useEffect, useTransition, useMemo } from 'react'
// import { Card } from '@/components/ui/card'
// import { 
//     getTeacherAuthorizedAssignments, getClassesByGradeLevel,
//     getGroupedTopics, buildExamPool, finalizeAndDeployExam,
//     getAdminExamRegistry
// } from '@/app/actions/exam-engine.actions'
// import { useProfileStore } from '@/store/profileStore'
// import { 
//     CheckCircle2, Layers, ChevronRight, Zap, X, 
//     ClipboardCheck, School, Loader2, Sparkles, 
//     ArrowLeft, Database, FileText, Printer
// } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { toast } from 'sonner'
// import { ExamStatCard } from '@/components/shared/examComponent'

// export default function TeacherExamArchitect() {
//     const { profile } = useProfileStore()
//     const [isPending, startTransition] = useTransition()
//     const [step, setStep] = useState<1 | 2>(1) 
    
//     // Data States
//     const [assignments, setAssignments] = useState<any[]>([])
//     const [validClassrooms, setValidClassrooms] = useState<any[]>([])
//     const [termGroups, setTermGroups] = useState<any[]>([])
//     const [generatedPool, setGeneratedPool] = useState<any[]>([])
//     const [stats, setStats] = useState<any>(null)

//     // Selection & Config
//     const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
//     const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
//     const [config, setConfig] = useState({ 
//         title: '', classId: '', duration: 60, 
//         totalQuestions: 20, reusePercentage: 30 
//     })

//     useEffect(() => {
//         if (profile?.id && profile?.schoolId) {
//             getTeacherAuthorizedAssignments(profile.id, profile.schoolId).then(setAssignments)
//             getAdminExamRegistry(profile.schoolId).then(res => res.success && setStats(res.stats))
//         }
//     }, [profile])

//     useEffect(() => {
//         if (selectedAssignment && profile?.schoolId) {
//             getGroupedTopics(selectedAssignment.id).then(setTermGroups)
//             getClassesByGradeLevel(selectedAssignment.gradeId, profile.schoolId).then(setValidClassrooms)
//             setSelectedTopicIds([])
//         }
//     }, [selectedAssignment, profile?.schoolId])

//     const handleBuildPool = () => {
//         if (!config.title || !config.classId || selectedTopicIds.length === 0) return toast.error("Selection incomplete.")
//         startTransition(async () => {
//             const res = await buildExamPool({ ...config, topicIds: selectedTopicIds, schoolId: profile!.schoolId! })
//             if (res.success) { setGeneratedPool(res.questions ?? []); setStep(2); }
//             else toast.error(res.error)
//         })
//     }

//     const handleFinalDeploy = () => {
//         startTransition(async () => {
//             const res = await finalizeAndDeployExam(
//                 { ...config, schoolId: profile!.schoolId!, topicIds: selectedTopicIds, termId: termGroups[0]?.id, type: 'TERMLY', reusePercentage: config.reusePercentage },
//                 generatedPool
//             )
//             if (res.success) { toast.success("Exam Deployed"); setStep(1); }
//             else toast.error(res.error)
//         })
//     }

//     return (
//         <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-10">
//             {/* ── RESTORED HEADER & STATS ── */}
//             <header className="flex items-center gap-5 border-b border-white/5 pb-10">
//                 <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
//                     <FileText className="h-7 w-7 text-school-primary" />
//                 </div>
//                 <div>
//                     <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Exam Architect</h1>
//                     <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">Institutional Assessment Generation & Vault Management.</p>
//                 </div>
//             </header>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <ExamStatCard label="Subject Bank" value={stats?.totalExams ?? 0} sub="Items available" icon={Database} />
//                 <ExamStatCard label="Active Sessions" value="Live" sub="CBT Engine Online" icon={Zap} colorClass="text-school-primary" />
//                 <ExamStatCard label="Grading Index" value={`${stats?.completionRate ?? 0}%`} sub="Global Grad Rate" icon={CheckCircle2} colorClass="text-emerald-500" />
//             </div>

//             {step === 1 ? (
//                 /* ── STEP 1: CONFIGURATION ── */
//                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
//                     {/* Subject & Topic selection columns (Same as previous version) */}
//                     <div className="space-y-4">
//                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">1. Your Subjects</p>
//                         {assignments.map(item => (
//                             <button key={item.id} onClick={() => setSelectedAssignment(item)} className={cn("w-full p-5 rounded-2xl border text-left transition-all", selectedAssignment?.id === item.id ? "bg-school-primary border-school-primary shadow-xl" : "bg-slate-900 border-white/5")}>
//                                 <p className={cn("text-[9px] font-black uppercase", selectedAssignment?.id === item.id ? "text-slate-950" : "text-slate-500")}>{item.grade.displayName}</p>
//                                 <h4 className={cn("text-base font-bold uppercase italic", selectedAssignment?.id === item.id ? "text-slate-950" : "text-white")}>{item.subject.name}</h4>
//                             </button>
//                         ))}
//                     </div>

//                     <div className="lg:col-span-2 space-y-6">
//                          {/* Term/Topic map here */}
//                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">2. Syllabus Map</p>
//                          <div className="space-y-8">
//                             {termGroups.map(term => (
//                                 <div key={term.id} className="space-y-4">
//                                     <h3 className="text-xs font-black uppercase text-school-primary italic px-2">{term.displayName}</h3>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                                         {term.topics.map((t: any) => (
//                                             <button key={t.id} onClick={() => setSelectedTopicIds(prev => prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id])}
//                                                 className={cn("p-5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between", selectedTopicIds.includes(t.id) ? "bg-school-primary/10 border-school-primary text-school-primary" : "bg-slate-900 border-white/5 text-slate-400")}>
//                                                 <span className="uppercase">{t.title}</span>
//                                                 {selectedTopicIds.includes(t.id) && <CheckCircle2 className="h-4 w-4" />}
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}
//                          </div>
//                     </div>

//                     {/* SETTINGS SIDEBAR */}
//                     <Card className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-8 sticky top-8">
//                         <div className="space-y-6">
//                             <div className="space-y-4">
//                                 <label className="text-[10px] font-black text-school-primary uppercase tracking-widest">Question Mix</label>
//                                 <input type="range" min="0" max="100" step="10" value={config.reusePercentage} onChange={e => setConfig({...config, reusePercentage: Number(e.target.value)})} className="w-full accent-school-primary" />
//                                 <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
//                                     <span>{config.reusePercentage}% Revision</span>
//                                     <span>{100 - config.reusePercentage}% New AI</span>
//                                 </div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <label className="text-[9px] font-black uppercase text-slate-500">Count</label>
//                                     <input type="number" value={config.totalQuestions} onChange={e => setConfig({...config, totalQuestions: Number(e.target.value)})} className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-white font-mono" />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <label className="text-[9px] font-black uppercase text-slate-500">Time (Min)</label>
//                                     <input type="number" value={config.duration} onChange={e => setConfig({...config, duration: Number(e.target.value)})} className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-white font-mono" />
//                                 </div>
//                             </div>
//                             <input className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white outline-none focus:border-school-primary font-bold uppercase italic" placeholder="Exam Title..." value={config.title} onChange={e => setConfig({...config, title: e.target.value})} />
//                             <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white font-bold uppercase" value={config.classId} onChange={e => setConfig({...config, classId: e.target.value})}>
//                                 <option value="">Target Class...</option>
//                                 {validClassrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//                             </select>
//                             <button onClick={handleBuildPool} disabled={isPending || selectedTopicIds.length === 0} className="w-full bg-school-primary text-slate-950 font-black py-5 rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.03] transition-all">
//                                 {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Build Vault"}
//                             </button>
//                         </div>
//                     </Card>
//                 </div>
//             ) : (
//                 /* ── STEP 2: PROFESSIONAL SINGLE-CARD REVIEW ── */
//                 <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-12 duration-500 pb-20">
//                     <div className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl border border-white/5">
//                         <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-white"><ArrowLeft className="h-3 w-3" /> Back</button>
//                         <div className="flex gap-4">
//                             <button className="p-3 bg-slate-950 rounded-xl text-slate-500 hover:text-school-primary transition-all"><Printer className="h-5 w-5" /></button>
//                             <button onClick={handleFinalDeploy} disabled={isPending} className="bg-school-primary text-slate-950 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl">
//                                 {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Deploy to Registry
//                             </button>
//                         </div>
//                     </div>

//                     <Card className="bg-white text-slate-900 p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
//                         <div className="absolute top-0 left-0 w-full h-2 bg-school-primary" />
//                         <div className="text-center mb-16 space-y-2">
//                             <h2 className="text-3xl font-black uppercase italic tracking-tighter">{config.title}</h2>
//                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Assessment Draft • {generatedPool.length} Items</p>
//                         </div>

//                         <div className="space-y-12">
//                             {generatedPool.map((q, idx) => (
//                                 <div key={idx} className="space-y-4">
//                                     <div className="flex items-center gap-4">
//                                         <span className="font-black text-lg text-school-primary">0{idx + 1}.</span>
//                                         <p className="font-bold text-lg leading-snug">{q.text}</p>
//                                     </div>
//                                     <div className="grid grid-cols-2 gap-x-12 gap-y-3 pl-10">
//                                         {q.options.map((opt: string, i: number) => (
//                                             <p key={i} className={cn("text-sm font-medium", opt === q.correctAnswer ? "text-school-primary font-black underline underline-offset-4" : "text-slate-500")}>
//                                                 {String.fromCharCode(65 + i)}) {opt}
//                                             </p>
//                                         ))}
//                                     </div>
//                                     <p className="pl-10 text-[10px] italic text-slate-400 font-medium">Rationale: {q.explanation}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </Card>
//                 </div>
//             )}
//         </div>
//     )
// }


// 'use client'

// import { useState, useEffect, useTransition, useMemo } from 'react'
// import { Card } from '@/components/ui/card'
// import { 
//     getTeacherAuthorizedAssignments, getClassesByGradeLevel,
//     getGroupedTopics, buildExamPool, finalizeAndDeployExam,
//     getAdminExamRegistry
// } from '@/app/actions/exam-engine.actions'
// import { useProfileStore } from '@/store/profileStore'
// import { 
//     CheckCircle2, Layers, ChevronRight, Zap, X, 
//     ClipboardCheck, School, Loader2, Sparkles, 
//     ArrowLeft, Database, FileText, Printer
// } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { toast } from 'sonner'
// import { ExamStatCard } from '@/components/shared/examComponent'

// export default function TeacherExamArchitect() {
//     const { profile } = useProfileStore()
//     const [isPending, startTransition] = useTransition()
//     const [step, setStep] = useState<1 | 2>(1) 
    
//     // Data States
//     const [assignments, setAssignments] = useState<any[]>([])
//     const [validClassrooms, setValidClassrooms] = useState<any[]>([])
//     const [termGroups, setTermGroups] = useState<any[]>([])
//     const [generatedPool, setGeneratedPool] = useState<any[]>([])
//     const [stats, setStats] = useState<any>(null)

//     // Selection & Config
//     const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
//     const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
//     const [config, setConfig] = useState({ 
//         title: '', classId: '', duration: 60, 
//         totalQuestions: 20, reusePercentage: 30 
//     })

//     useEffect(() => {
//         if (profile?.id && profile?.schoolId) {
//             getTeacherAuthorizedAssignments(profile.id, profile.schoolId).then(setAssignments)
//             getAdminExamRegistry(profile.schoolId).then(res => res.success && setStats(res.stats))
//         }
//     }, [profile])

//     useEffect(() => {
//         if (selectedAssignment && profile?.schoolId) {
//             getGroupedTopics(selectedAssignment.id).then(setTermGroups)
//             getClassesByGradeLevel(selectedAssignment.gradeId, profile.schoolId).then(setValidClassrooms)
//             setSelectedTopicIds([])
//         }
//     }, [selectedAssignment, profile?.schoolId])

//     const handleBuildPool = () => {
//         if (!config.title || !config.classId || selectedTopicIds.length === 0) return toast.error("Selection incomplete.")
//         startTransition(async () => {
//             const res = await buildExamPool({ ...config, topicIds: selectedTopicIds, schoolId: profile!.schoolId! })
//             if (res.success) { setGeneratedPool(res.questions ?? []); setStep(2); }
//             else toast.error(res.error)
//         })
//     }

//     const handleFinalDeploy = () => {
//         startTransition(async () => {
//             const res = await finalizeAndDeployExam(
//                 { ...config, schoolId: profile!.schoolId!, topicIds: selectedTopicIds, termId: termGroups[0]?.id, type: 'TERMLY', reusePercentage: config.reusePercentage },
//                 generatedPool
//             )
//             if (res.success) { toast.success("Exam Deployed"); setStep(1); }
//             else toast.error(res.error)
//         })
//     }

//     return (
//         <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-10">
//             {/* ── RESTORED HEADER & STATS ── */}
//             <header className="flex items-center gap-5 border-b border-white/5 pb-10">
//                 <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
//                     <FileText className="h-7 w-7 text-school-primary" />
//                 </div>
//                 <div>
//                     <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Exam Architect</h1>
//                     <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">Institutional Assessment Generation & Vault Management.</p>
//                 </div>
//             </header>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <ExamStatCard label="Subject Bank" value={stats?.totalExams ?? 0} sub="Items available" icon={Database} />
//                 <ExamStatCard label="Active Sessions" value="Live" sub="CBT Engine Online" icon={Zap} colorClass="text-school-primary" />
//                 <ExamStatCard label="Grading Index" value={`${stats?.completionRate ?? 0}%`} sub="Global Grad Rate" icon={CheckCircle2} colorClass="text-emerald-500" />
//             </div>

//             {step === 1 ? (
//                 /* ── STEP 1: CONFIGURATION ── */
//                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
//                     {/* Subject & Topic selection columns (Same as previous version) */}
//                     <div className="space-y-4">
//                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">1. Your Subjects</p>
//                         {assignments.map(item => (
//                             <button key={item.id} onClick={() => setSelectedAssignment(item)} className={cn("w-full p-5 rounded-2xl border text-left transition-all", selectedAssignment?.id === item.id ? "bg-school-primary border-school-primary shadow-xl" : "bg-slate-900 border-white/5")}>
//                                 <p className={cn("text-[9px] font-black uppercase", selectedAssignment?.id === item.id ? "text-slate-950" : "text-slate-500")}>{item.grade.displayName}</p>
//                                 <h4 className={cn("text-base font-bold uppercase italic", selectedAssignment?.id === item.id ? "text-slate-950" : "text-white")}>{item.subject.name}</h4>
//                             </button>
//                         ))}
//                     </div>

//                     <div className="lg:col-span-2 space-y-6">
//                          {/* Term/Topic map here */}
//                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">2. Syllabus Map</p>
//                          <div className="space-y-8">
//                             {termGroups.map(term => (
//                                 <div key={term.id} className="space-y-4">
//                                     <h3 className="text-xs font-black uppercase text-school-primary italic px-2">{term.displayName}</h3>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                                         {term.topics.map((t: any) => (
//                                             <button key={t.id} onClick={() => setSelectedTopicIds(prev => prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id])}
//                                                 className={cn("p-5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between", selectedTopicIds.includes(t.id) ? "bg-school-primary/10 border-school-primary text-school-primary" : "bg-slate-900 border-white/5 text-slate-400")}>
//                                                 <span className="uppercase">{t.title}</span>
//                                                 {selectedTopicIds.includes(t.id) && <CheckCircle2 className="h-4 w-4" />}
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}
//                          </div>
//                     </div>

//                     {/* SETTINGS SIDEBAR */}
//                     <Card className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-8 sticky top-8">
//                         <div className="space-y-6">
//                             <div className="space-y-4">
//                                 <label className="text-[10px] font-black text-school-primary uppercase tracking-widest">Question Mix</label>
//                                 <input type="range" min="0" max="100" step="10" value={config.reusePercentage} onChange={e => setConfig({...config, reusePercentage: Number(e.target.value)})} className="w-full accent-school-primary" />
//                                 <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
//                                     <span>{config.reusePercentage}% Revision</span>
//                                     <span>{100 - config.reusePercentage}% New AI</span>
//                                 </div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <label className="text-[9px] font-black uppercase text-slate-500">Count</label>
//                                     <input type="number" value={config.totalQuestions} onChange={e => setConfig({...config, totalQuestions: Number(e.target.value)})} className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-white font-mono" />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <label className="text-[9px] font-black uppercase text-slate-500">Time (Min)</label>
//                                     <input type="number" value={config.duration} onChange={e => setConfig({...config, duration: Number(e.target.value)})} className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-white font-mono" />
//                                 </div>
//                             </div>
//                             <input className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white outline-none focus:border-school-primary font-bold uppercase italic" placeholder="Exam Title..." value={config.title} onChange={e => setConfig({...config, title: e.target.value})} />
//                             <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white font-bold uppercase" value={config.classId} onChange={e => setConfig({...config, classId: e.target.value})}>
//                                 <option value="">Target Class...</option>
//                                 {validClassrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//                             </select>
//                             <button onClick={handleBuildPool} disabled={isPending || selectedTopicIds.length === 0} className="w-full bg-school-primary text-slate-950 font-black py-5 rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.03] transition-all">
//                                 {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Build Vault"}
//                             </button>
//                         </div>
//                     </Card>
//                 </div>
//             ) : (
//                 /* ── STEP 2: PROFESSIONAL SINGLE-CARD REVIEW ── */
//                 <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-12 duration-500 pb-20">
//                     <div className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl border border-white/5">
//                         <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-white"><ArrowLeft className="h-3 w-3" /> Back</button>
//                         <div className="flex gap-4">
//                             <button className="p-3 bg-slate-950 rounded-xl text-slate-500 hover:text-school-primary transition-all"><Printer className="h-5 w-5" /></button>
//                             <button onClick={handleFinalDeploy} disabled={isPending} className="bg-school-primary text-slate-950 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl">
//                                 {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Deploy to Registry
//                             </button>
//                         </div>
//                     </div>

//                     <Card className="bg-white text-slate-900 p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
//                         <div className="absolute top-0 left-0 w-full h-2 bg-school-primary" />
//                         <div className="text-center mb-16 space-y-2">
//                             <h2 className="text-3xl font-black uppercase italic tracking-tighter">{config.title}</h2>
//                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Assessment Draft • {generatedPool.length} Items</p>
//                         </div>

//                         <div className="space-y-12">
//                             {generatedPool.map((q, idx) => (
//                                 <div key={idx} className="space-y-4">
//                                     <div className="flex items-center gap-4">
//                                         <span className="font-black text-lg text-school-primary">0{idx + 1}.</span>
//                                         <p className="font-bold text-lg leading-snug">{q.text}</p>
//                                     </div>
//                                     <div className="grid grid-cols-2 gap-x-12 gap-y-3 pl-10">
//                                         {q.options.map((opt: string, i: number) => (
//                                             <p key={i} className={cn("text-sm font-medium", opt === q.correctAnswer ? "text-school-primary font-black underline underline-offset-4" : "text-slate-500")}>
//                                                 {String.fromCharCode(65 + i)}) {opt}
//                                             </p>
//                                         ))}
//                                     </div>
//                                     <p className="pl-10 text-[10px] italic text-slate-400 font-medium">Rationale: {q.explanation}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </Card>
//                 </div>
//             )}
//         </div>
//     )
// }


// 'use client'

// import { useState, useEffect, useTransition, useMemo, useCallback } from 'react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card } from '@/components/ui/card'
// import { 
//     getTeacherAuthorizedAssignments, getClassesByGradeLevel,
//     getGroupedTopics, buildExamPool, finalizeAndDeployExam,
//     getAdminExamRegistry, getTeacherExamHistory, getExamQuestions
// } from '@/app/actions/exam-engine.actions'
// import { useProfileStore } from '@/store/profileStore'
// import { 
//     CheckCircle2, Layers, ChevronRight, Zap, X, 
//     ClipboardCheck, School, Loader2, Sparkles, 
//     ArrowLeft, Database, FileText, Printer, Eye
// } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { toast } from 'sonner'
// import { ExamStatCard } from '@/components/shared/examComponent'

// export default function TeacherExamArchitect() {
//     const { profile } = useProfileStore()
//     const [isPending, startTransition] = useTransition()
    
//     // ── NAVIGATION STATE ──
//     const [activeTab, setActiveTab] = useState("vault")
//     const [step, setStep] = useState<1 | 2>(1) 
//     const [isViewOnly, setIsViewOnly] = useState(false) // Distinguish between previewing new vs viewing history
    
//     // ── DATA STATES ──
//     const [assignments, setAssignments] = useState<any[]>([])
//     const [validClassrooms, setValidClassrooms] = useState<any[]>([])
//     const [termGroups, setTermGroups] = useState<any[]>([])
//     const [generatedPool, setGeneratedPool] = useState<any[]>([])
//     const [stats, setStats] = useState<any>(null)
//     const [examHistory, setExamHistory] = useState<any[]>([])

//     // ── SELECTION & CONFIG ──
//     const [editModeIndex, setEditModeIndex] = useState<number | null>(null);
//     const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
//     const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
//     const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])
//     const [config, setConfig] = useState({ 
//         title: '', duration: 60, totalQuestions: 20, reusePercentage: 30 
//     })

//     // 1. Initial Load: Stats, History, Assignments
//     const loadRegistry = useCallback(async () => {
//         if (profile?.id && profile?.schoolId) {
//             const [history, authAssignments, adminStats] = await Promise.all([
//                 getTeacherExamHistory(profile.id, profile.schoolId),
//                 getTeacherAuthorizedAssignments(profile.id, profile.schoolId),
//                 getAdminExamRegistry(profile.schoolId)
//             ])
//             setExamHistory(history)
//             setAssignments(authAssignments)
//             if (adminStats.success) setStats(adminStats.stats)
//         }
//     }, [profile])

//     useEffect(() => { loadRegistry() }, [loadRegistry])

//     // 2. Load Topics & Valid Rooms when Subject changes
//     useEffect(() => {
//         if (selectedAssignment && profile?.schoolId) {
//             getGroupedTopics(selectedAssignment.id).then(setTermGroups)
//             getClassesByGradeLevel(selectedAssignment.gradeId, profile.schoolId).then(setValidClassrooms)
//             setSelectedTopicIds([])
//             setSelectedClassIds([])
//         }
//     }, [selectedAssignment, profile?.schoolId])

//     // ── HANDLERS ──

//     const handleBuildPool = () => {
//         if (!config.title || selectedClassIds.length === 0 || selectedTopicIds.length === 0) {
//             return toast.error("Deployment parameters incomplete.")
//         }
//         startTransition(async () => {
//             const res = await buildExamPool({ 
//                 ...config, 
//                 topicIds: selectedTopicIds, 
//                 schoolId: profile!.schoolId! 
//             })
//             if (res.success) {
//                 setGeneratedPool(res.questions ?? [])
//                 setIsViewOnly(false)
//                 setStep(2)
//             } else toast.error(res.error)
//         })
//     }

//     const handleFinalDeploy = () => {
//         startTransition(async () => {
//             const res = await finalizeAndDeployExam(
//                 { 
//                     ...config, 
//                     classIds: selectedClassIds, 
//                     schoolId: profile!.schoolId!, 
//                     topicIds: selectedTopicIds, 
//                     termId: termGroups[0]?.id, 
//                     type: 'TERMLY' 
//                 },
//                 generatedPool
//             )
//             if (res.success) {
//                 toast.success("Exam Deployed to Registry")
//                 setStep(1)
//                 loadRegistry()
//                 setActiveTab("vault")
//             } else toast.error(res.error)
//         })
//     }

//     const handleViewHistory = async (exam: any) => {
//         const questions = await getExamQuestions(exam.id)
//         setGeneratedPool(questions)
//         setConfig({ ...config, title: exam.title, totalQuestions: questions.length })
//         setIsViewOnly(true)
//         setStep(2)
//         setActiveTab("create")
//     }
//     const updateQuestionValue = (index: number, field: string, value: string) => {
//         const updated = [...generatedPool];
//         updated[index] = { ...updated[index], [field]: value };
//         setGeneratedPool(updated);
//     };

//     const toggleClass = (id: string) => {
//         setSelectedClassIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
//     }

//     return (
//         <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-10">
        
//             {/* ── HEADER ── */}
//             <header className="flex items-center gap-5 border-b border-white/5 pb-10">
//                 <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
//                     <FileText className="h-7 w-7 text-school-primary" />
//                 </div>
//                 <div>
//                     <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Exam Architect</h1>
//                     <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">Institutional Assessment Generation & Vault Management.</p>
//                 </div>
//             </header>

//             {/* ── STATS ── */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <ExamStatCard label="Subject Bank" value={stats?.totalExams ?? 0} sub="Items available" icon={Database} />
//                 <ExamStatCard label="Active Sessions" value="Live" sub="CBT Engine Online" icon={Zap} colorClass="text-school-primary" />
//                 <ExamStatCard label="Grading Index" value={`${stats?.completionRate ?? 0}%`} sub="Global Grad Rate" icon={CheckCircle2} colorClass="text-emerald-500" />
//             </div>

//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="bg-slate-900 border border-white/5 p-1 rounded-2xl mb-8">
//                     <TabsTrigger value="vault" className="rounded-xl px-8 data-[state=active]:bg-school-primary data-[state=active]:text-slate-950 font-bold uppercase text-[10px]">
//                         <Database className="h-3 w-3 mr-2" /> Exam Vault
//                     </TabsTrigger>
//                     <TabsTrigger value="create" className="rounded-xl px-8 data-[state=active]:bg-school-primary data-[state=active]:text-slate-950 font-bold uppercase text-[10px]">
//                         <Plus className="h-3 w-3 mr-2" /> Drafting Room
//                     </TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="vault">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
//                         {examHistory.map((exam) => (
//                             <Card key={exam.id} className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-2xl hover:border-school-primary/30 transition-all group">
//                                 <div className="flex justify-between items-start mb-6">
//                                     <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5">
//                                         <ClipboardCheck className="text-school-primary h-5 w-5" />
//                                     </div>
//                                     <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">Deployed</span>
//                                 </div>
//                                 <h3 className="text-xl font-bold text-white uppercase italic truncate mb-2">{exam.title}</h3>
//                                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6">{exam.class.name} • {exam._count.questions} Items</p>
//                                 <button onClick={() => handleViewHistory(exam)} className="w-full bg-slate-950 border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-school-primary transition-all flex items-center justify-center gap-2">
//                                     <Eye className="h-3.5 w-3.5" /> Open Registry File
//                                 </button>
//                             </Card>
//                         ))}
//                     </div>
//                 </TabsContent>

//                 <TabsContent value="create">
//                     {step === 1 ? (
//                         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start animate-in slide-in-from-bottom-4">
//                             {/* 1. Subjects */}
//                             <div className="space-y-4">
//                                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">1. Your Subjects</p>
//                                 {assignments.map(item => (
//                                     <button key={item.id} onClick={() => setSelectedAssignment(item)} className={cn("w-full p-5 rounded-2xl border text-left transition-all", selectedAssignment?.id === item.id ? "bg-school-primary border-school-primary shadow-xl" : "bg-slate-900 border-white/5")}>
//                                         <p className={cn("text-[9px] font-black uppercase", selectedAssignment?.id === item.id ? "text-slate-950" : "text-slate-500")}>{item.grade.displayName}</p>
//                                         <h4 className={cn("text-base font-bold uppercase italic", selectedAssignment?.id === item.id ? "text-slate-950" : "text-white")}>{item.subject.name}</h4>
//                                     </button>
//                                 ))}
//                             </div>

//                             {/* 2. Syllabus */}
//                             <div className="lg:col-span-2 space-y-6">
//                                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">2. Syllabus Map</p>
//                                 <div className="space-y-8">
//                                     {termGroups.map(term => (
//                                         <div key={term.id} className="space-y-4">
//                                             <h3 className="text-xs font-black uppercase text-school-primary italic px-2">{term.displayName}</h3>
//                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                                                 {term.topics.map((t: any) => (
//                                                     <button key={t.id} onClick={() => setSelectedTopicIds(prev => prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id])}
//                                                         className={cn("p-4 rounded-xl border text-left text-[11px] font-bold transition-all flex items-center justify-between", selectedTopicIds.includes(t.id) ? "bg-school-primary/10 border-school-primary text-school-primary" : "bg-slate-900 border-white/5 text-slate-400")}>
//                                                         <span className="uppercase">{t.title}</span>
//                                                         {selectedTopicIds.includes(t.id) && <CheckCircle2 className="h-4 w-4" />}
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* 3. Settings Sidebar */}
//                             <Card className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-8 sticky top-8">
//                                 <div className="space-y-6">
//                                     <div className="space-y-3">
//                                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Classrooms</label>
//                                         <div className="flex flex-wrap gap-2">
//                                             {validClassrooms.map(c => (
//                                                 <button key={c.id} onClick={() => toggleClass(c.id)} className={cn("px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all", selectedClassIds.includes(c.id) ? "bg-school-primary border-school-primary text-slate-950" : "bg-slate-950 border-white/5 text-slate-500")}>
//                                                     {c.name}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>
//                                     <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
//                                         <div className="space-y-1"><label className="text-[8px] font-bold text-slate-500 uppercase">Items</label><input type="number" value={config.totalQuestions} onChange={e => setConfig({...config, totalQuestions: Number(e.target.value)})} className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-white font-mono" /></div>
//                                         <div className="space-y-1"><label className="text-[8px] font-bold text-slate-500 uppercase">Min</label><input type="number" value={config.duration} onChange={e => setConfig({...config, duration: Number(e.target.value)})} className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-white font-mono" /></div>
//                                     </div>
//                                     <input className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white outline-none focus:border-school-primary font-bold uppercase italic" placeholder="Exam Title..." value={config.title} onChange={e => setConfig({...config, title: e.target.value})} />
//                                     <button onClick={handleBuildPool} disabled={isPending || selectedClassIds.length === 0 || selectedTopicIds.length === 0} className="w-full bg-school-primary text-slate-950 font-black py-5 rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.03] transition-all">
//                                         {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Build Vault"}
//                                     </button>
//                                 </div>
//                             </Card>
//                         </div>
//                     ) : (
//                         /* ── STEP 2: PROFESSIONAL DOCUMENT VIEW ── */
//                         <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-12 pb-20">
//                             <style>{`
//                                 @media print {
//                                     body * { visibility: hidden; }
//                                     #exam-document, #exam-document * { visibility: visible; }
//                                     #exam-document { position: absolute; left: 0; top: 0; width: 100%; padding: 0 !important; color: black !important; }
//                                     .no-print { display: none !important; }
//                                     .answer-marker { display: none !important; }
//                                 }
//                             `}</style>
                            
//                             <div className="no-print flex justify-between items-center bg-slate-900 p-6 rounded-3xl border border-white/5 shadow-2xl">
//                                 <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-white"><ArrowLeft className="h-3 w-3" /> Back</button>
//                                 <div className="flex gap-4">
//                                     <button onClick={() => window.print()} className="p-3 bg-slate-950 rounded-xl text-slate-500 hover:text-school-primary transition-all"><Printer className="h-5 w-5" /></button>
//                                     {!isViewOnly && (
//                                         <button onClick={handleFinalDeploy} disabled={isPending} className="bg-school-primary text-slate-950 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl">
//                                             {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Deploy Exam
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>

//                             <Card id="exam-document" className="bg-white text-slate-900 p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
//                                 <div className="no-print absolute top-0 left-0 w-full h-2 bg-school-primary" />
//                                 <div className="text-center mb-16 space-y-2">
//                                     <h2 className="text-3xl font-black uppercase italic tracking-tighter">{config.title}</h2>
//                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Assessment Registry • Official Record</p>
//                                 </div>

//                                 <div className="space-y-12">
//                                     {generatedPool.map((q, idx) => (
//                                         <div key={idx} className="space-y-4">
//                                             <div className="flex gap-4">
//                                                 <span className="font-black text-school-primary">Q{idx + 1}.</span>
//                                                 <p className="font-bold text-lg leading-snug">{q.text}</p>
//                                             </div>
//                                             <div className="grid grid-cols-2 gap-x-12 gap-y-3 pl-10">
//                                                 {q.options.map((opt: string, i: number) => (
//                                                     <p key={i} className={cn(
//                                                         "text-sm font-medium",
//                                                         !isViewOnly && opt === q.correctAnswer ? "text-school-primary font-black underline decoration-2 underline-offset-4" : "text-slate-600"
//                                                     )}>
//                                                         {String.fromCharCode(65 + i)}) {opt}
//                                                         {opt === q.correctAnswer && <span className="answer-marker ml-2 text-[8px] font-black uppercase text-emerald-500 opacity-40">(Key)</span>}
//                                                     </p>
//                                                 ))}
//                                             </div>
//                                             {!isViewOnly && <p className="no-print pl-10 text-[9px] italic text-slate-400 font-medium">Rationale: {q.explanation}</p>}
//                                         </div>
//                                     ))}
//                                 </div>
//                             </Card>
//                         </div>
//                     )}
//                 </TabsContent>
//             </Tabs>
//         </div>
//     )
// }

// function Plus({ className }: { className?: string }) { return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg> }

// 'use client'

// import { SubjectSelector } from "@/components/TeacherDashboard/exams/subjectSelector"
// import { SyllabusSelector } from "@/components/TeacherDashboard/exams/syllabusSelector"
// import { SettingsSidebar } from "@/components/TeacherDashboard/exams/settingsSidebar"

// import { useState, useEffect, useTransition, useCallback } from 'react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card } from '@/components/ui/card'

// import {
//   getTeacherAuthorizedAssignments,
//   getClassesByGradeLevel,
//   getGroupedTopics,
//   buildExamPool,
//   finalizeAndDeployExam,
//   getAdminExamRegistry,
//   getTeacherExamHistory,
//   getExamQuestions
// } from '@/app/actions/exam-engine.actions'

// import { useProfileStore } from '@/store/profileStore'

// import {
//   CheckCircle2,
//   Zap,
//   Database,
//   FileText,
//   Eye
// } from 'lucide-react'

// import { toast } from 'sonner'
// import { ExamStatCard } from '@/components/shared/examComponent'

// export default function TeacherExamArchitect() {

//   const { profile } = useProfileStore()
//   const [isPending, startTransition] = useTransition()

//   const [activeTab, setActiveTab] = useState("vault")
//   const [step, setStep] = useState<1 | 2>(1)
//   const [isViewOnly, setIsViewOnly] = useState(false)

//   const [assignments, setAssignments] = useState<any[]>([])
//   const [validClassrooms, setValidClassrooms] = useState<any[]>([])
//   const [termGroups, setTermGroups] = useState<any[]>([])
//   const [generatedPool, setGeneratedPool] = useState<any[]>([])
//   const [stats, setStats] = useState<any>(null)
//   const [examHistory, setExamHistory] = useState<any[]>([])

//   const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
//   const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
//   const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])

//   const [config, setConfig] = useState({
//     title: '',
//     duration: 60,
//     totalQuestions: 20,
//     reusePercentage: 30
//   })

//   const loadRegistry = useCallback(async () => {

//     if (!profile?.id || !profile?.schoolId) return

//     const [history, authAssignments, adminStats] = await Promise.all([
//       getTeacherExamHistory(profile.id, profile.schoolId),
//       getTeacherAuthorizedAssignments(profile.id, profile.schoolId),
//       getAdminExamRegistry(profile.schoolId)
//     ])

//     setExamHistory(history)
//     setAssignments(authAssignments)

//     if (adminStats.success) {
//       setStats(adminStats.stats)
//     }

//   }, [profile])


//   useEffect(() => {
//     loadRegistry()
//   }, [loadRegistry])


//   useEffect(() => {

//     if (!selectedAssignment || !profile?.schoolId) return

//     getGroupedTopics(selectedAssignment.id).then(setTermGroups)

//     getClassesByGradeLevel(
//       selectedAssignment.gradeId,
//       profile.schoolId
//     ).then(setValidClassrooms)

//     setSelectedTopicIds([])
//     setSelectedClassIds([])

//   }, [selectedAssignment, profile?.schoolId])


//   const handleBuildPool = () => {

//     if (
//       !config.title ||
//       selectedClassIds.length === 0 ||
//       selectedTopicIds.length === 0
//     ) {
//       return toast.error("Deployment parameters incomplete.")
//     }

//     startTransition(() => {
//       (async () => {
    
//         const res = await buildExamPool({
//           topicIds: selectedTopicIds,
//           totalQuestions: config.totalQuestions,
//           reusePercentage: config.reusePercentage,
//           schoolId: profile!.schoolId!
//         })
    
//         if (!res.success) {
//           toast.error(res.error)
//           return
//         }
    
//         setGeneratedPool(res.questions ?? [])
//         setIsViewOnly(false)
//         setStep(2)
    
//       })()
//     })

//   const handleFinalDeploy = () => {

//     startTransition(async () => {

//       const res = await finalizeAndDeployExam(
//         {
//           ...config,
//           teacherId: profile!.id, 
//           classIds: selectedClassIds,
//           schoolId: profile!.schoolId!,
//           topicIds: selectedTopicIds,
//           termId: termGroups[0]?.id,
//           type: 'TERMLY'
//         },
//         generatedPool
//       )

//       if (!res.success) {
//       toast.error(res.error)
//       return
//       }

//       toast.success("Exam Deployed to Registry")

//       setStep(1)
//       setActiveTab("vault")
//       loadRegistry()

//     })
//   }


//   const handleViewHistory = async (exam: any) => {

//     const questions = await getExamQuestions(exam.id)

//     setGeneratedPool(questions)

//     setConfig(prev => ({
//       ...prev,
//       title: exam.title,
//       totalQuestions: questions.length
//     }))

//     setIsViewOnly(true)
//     setStep(2)
//     setActiveTab("create")

//   }


//   const toggleClass = (id: string) => {

//     setSelectedClassIds(prev =>
//       prev.includes(id)
//         ? prev.filter(i => i !== id)
//         : [...prev, id]
//     )

//   }


//   return (

//     <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-10">

//       <header className="flex items-center gap-5 border-b border-white/5 pb-10">

//         <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
//           <FileText className="h-7 w-7 text-school-primary" />
//         </div>

//         <div>
//           <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
//             Exam Architect
//           </h1>

//           <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">
//             Institutional Assessment Generation & Vault Management
//           </p>
//         </div>

//       </header>


//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//         <ExamStatCard
//           label="Subject Bank"
//           value={stats?.totalExams ?? 0}
//           sub="Items available"
//           icon={Database}
//         />

//         <ExamStatCard
//           label="Active Sessions"
//           value="Live"
//           sub="CBT Engine Online"
//           icon={Zap}
//           colorClass="text-school-primary"
//         />

//         <ExamStatCard
//           label="Grading Index"
//           value={`${stats?.completionRate ?? 0}%`}
//           sub="Global Grad Rate"
//           icon={CheckCircle2}
//           colorClass="text-emerald-500"
//         />

//       </div>


//       <Tabs value={activeTab} onValueChange={setActiveTab}>

//         <TabsList className="bg-slate-900 border border-white/5 p-1 rounded-2xl mb-8">
//           <TabsTrigger value="vault">Exam Vault</TabsTrigger>
//           <TabsTrigger value="create">Drafting Room</TabsTrigger>
//         </TabsList>


//         <TabsContent value="vault">

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//             {examHistory.map((exam) => (

//               <Card key={exam.id} className="p-6">

//                 <h3 className="font-bold">{exam.title}</h3>

//                 <p className="text-xs text-slate-400">
//                   {exam.class.name} • {exam._count.questions} Items
//                 </p>

//                 <button
//                   onClick={() => handleViewHistory(exam)}
//                   className="mt-4 flex items-center gap-2 text-school-primary"
//                 >
//                   <Eye className="h-4 w-4" /> View
//                 </button>

//               </Card>

//             ))}

//           </div>

//         </TabsContent>


//         <TabsContent value="create">

//           {step === 1 && (

//             <DraftBuilder
//               assignments={assignments}
//               selectedAssignment={selectedAssignment}
//               setSelectedAssignment={setSelectedAssignment}
//               termGroups={termGroups}
//               selectedTopicIds={selectedTopicIds}
//               setSelectedTopicIds={setSelectedTopicIds}
//               validClassrooms={validClassrooms}
//               selectedClassIds={selectedClassIds}
//               toggleClass={toggleClass}
//               config={config}
//               setConfig={setConfig}
//               handleBuildPool={handleBuildPool}
//               isPending={isPending}
//             />

//           )}

//           {step === 2 && (

//             <Card className="p-8 space-y-6">

//               <h2 className="text-xl font-bold">
//                 Generated Question Pool
//               </h2>

//               {generatedPool.length === 0 && (
//                 <p className="text-slate-400">
//                   No questions generated.
//                 </p>
//               )}

//               {generatedPool.map((q: any, index: number) => (

//                 <div key={index} className="border border-white/10 p-4 rounded-xl">

//                   <p className="font-medium mb-3">
//                     {index + 1}. {q.text}
//                   </p>

//                   <ul className="space-y-1 text-sm text-slate-300">
//                     {q.options?.map((opt: string, i: number) => (
//                       <li key={i}>{opt}</li>
//                     ))}
//                   </ul>

//                 </div>

//               ))}

//               <div className="flex gap-4">

//                 <button
//                   onClick={() => setStep(1)}
//                   className="px-6 py-3 border border-white/10 rounded-lg"
//                 >
//                   Back
//                 </button>

//                 {!isViewOnly && (
//                   <button
//                     onClick={handleFinalDeploy}
//                     className="bg-school-primary px-6 py-3 rounded-lg font-semibold"
//                   >
//                     Deploy Exam
//                   </button>
//                 )}

//               </div>

//             </Card>

//           )}

//         </TabsContent>

//       </Tabs>

//     </div>

//   )
// }


// /* Draft Builder */

// function DraftBuilder({
//   assignments,
//   selectedAssignment,
//   setSelectedAssignment,
//   termGroups,
//   selectedTopicIds,
//   setSelectedTopicIds,
//   validClassrooms,
//   selectedClassIds,
//   toggleClass,
//   config,
//   setConfig,
//   handleBuildPool,
//   isPending
// }: any) {

//   return (

//     <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

//       <SubjectSelector
//         assignments={assignments}
//         selectedAssignment={selectedAssignment}
//         setSelectedAssignment={setSelectedAssignment}
//       />

//       <SyllabusSelector
//         termGroups={termGroups}
//         selectedTopicIds={selectedTopicIds}
//         setSelectedTopicIds={setSelectedTopicIds}
//       />

//       <SettingsSidebar
//         validClassrooms={validClassrooms}
//         selectedClassIds={selectedClassIds}
//         toggleClass={toggleClass}
//         config={config}
//         setConfig={setConfig}
//         handleBuildPool={handleBuildPool}
//         isPending={isPending}
//       />

//     </div>

//   )

// }


'use client'

import { SubjectSelector } from "@/components/TeacherDashboard/exams/subjectSelector"
import { SyllabusSelector } from "@/components/TeacherDashboard/exams/syllabusSelector"
import { SettingsSidebar } from "@/components/TeacherDashboard/exams/settingsSidebar"

import { useState, useEffect, useTransition, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from '@/components/ui/card'

import {
  getTeacherAuthorizedAssignments,
  getClassesByGradeLevel,
  getGroupedTopics,
  buildExamPool,
  finalizeAndDeployExam,
  getAdminExamRegistry,
  getTeacherExamHistory,
  getExamQuestions
} from '@/app/actions/exam-engine.actions'

import { useProfileStore } from '@/store/profileStore'

import {
  CheckCircle2,
  Zap,
  Database,
  FileText,
  Eye,
  Loader2,
  ArrowLeft
} from 'lucide-react'

import { toast } from 'sonner'
import { ExamStatCard } from '@/components/shared/examComponent'
import { cn } from "@/lib/utils"

export default function TeacherExamArchitect() {
  const { profile } = useProfileStore()
  const [isPending, startTransition] = useTransition()

  const [activeTab, setActiveTab] = useState("vault")
  const [step, setStep] = useState<1 | 2>(1)
  const [isViewOnly, setIsViewOnly] = useState(false)

  const [assignments, setAssignments] = useState<any[]>([])
  const [validClassrooms, setValidClassrooms] = useState<any[]>([])
  const [termGroups, setTermGroups] = useState<any[]>([])
  const [generatedPool, setGeneratedPool] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [examHistory, setExamHistory] = useState<any[]>([])

  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])

  const [config, setConfig] = useState({
    title: '',
    duration: 60,
    totalQuestions: 20,
    reusePercentage: 30
  })

  const loadRegistry = useCallback(async () => {
    if (!profile?.id || !profile?.schoolId) return

    const [history, authAssignments, adminStats] = await Promise.all([
      getTeacherExamHistory(profile.id, profile.schoolId),
      getTeacherAuthorizedAssignments(profile.id, profile.schoolId),
      getAdminExamRegistry(profile.schoolId)
    ])

    setExamHistory(history)
    setAssignments(authAssignments)

    if (adminStats.success) {
      setStats(adminStats.stats)
    }
  }, [profile])

  useEffect(() => {
    loadRegistry()
  }, [loadRegistry])

  useEffect(() => {
    if (!selectedAssignment || !profile?.schoolId) return

    getGroupedTopics(selectedAssignment.id).then(setTermGroups)
    getClassesByGradeLevel(selectedAssignment.gradeId, profile.schoolId).then(setValidClassrooms)

    setSelectedTopicIds([])
    setSelectedClassIds([])
  }, [selectedAssignment, profile?.schoolId])

  // --- Handlers ---

  const handleBuildPool = () => {
    if (!config.title || selectedClassIds.length === 0 || selectedTopicIds.length === 0) {
      return toast.error("Deployment parameters incomplete.")
    }

    startTransition(async () => {
      const res = await buildExamPool({
        topicIds: selectedTopicIds,
        totalQuestions: config.totalQuestions,
        reusePercentage: config.reusePercentage,
        schoolId: profile!.schoolId!
      })

      if (!res.success) {
        toast.error(res.error || "Failed to build pool")
        return
      }

      setGeneratedPool(res.questions ?? [])
      setIsViewOnly(false)
      setStep(2)
    })
  } // ✅ Fixed missing closing brace

  const handleFinalDeploy = () => {
    startTransition(async () => {
      const res = await finalizeAndDeployExam(
        {
          ...config,
          teacherId: profile!.id,
          classIds: selectedClassIds,
          schoolId: profile!.schoolId!,
          topicIds: selectedTopicIds,
          termId: termGroups[0]?.id || '',
          type: 'TERMLY'
        },
        generatedPool
      )

      if (!res.success) {
        toast.error(res.error || "Failed to deploy")
        return
      }

      toast.success("Exam Deployed to Registry")
      setStep(1)
      setActiveTab("vault")
      loadRegistry()
    })
  }

  const handleViewHistory = async (exam: any) => {
    const questions = await getExamQuestions(exam.id)
    setGeneratedPool(questions)
    setConfig(prev => ({
      ...prev,
      title: exam.title,
      totalQuestions: questions.length
    }))
    setIsViewOnly(true)
    setStep(2)
    setActiveTab("create")
  }

  const toggleClass = (id: string) => {
    setSelectedClassIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-10">
      <header className="flex items-center gap-5 border-b border-white/5 pb-10">
        <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
          <FileText className="h-7 w-7 text-school-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
            Exam Architect
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">
            Institutional Assessment Generation & Vault Management
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ExamStatCard label="Subject Bank" value={stats?.totalExams ?? 0} sub="Items available" icon={Database} />
        <ExamStatCard label="Active Sessions" value="Live" sub="CBT Engine Online" icon={Zap} colorClass="text-school-primary" />
        <ExamStatCard label="Grading Index" value={`${stats?.completionRate ?? 0}%`} sub="Global Grad Rate" icon={CheckCircle2} colorClass="text-emerald-500" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-900 border border-white/5 p-1 rounded-2xl mb-8">
          <TabsTrigger value="vault">Exam Vault</TabsTrigger>
          <TabsTrigger value="create">Drafting Room</TabsTrigger>
        </TabsList>

        <TabsContent value="vault">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {examHistory.length === 0 ? (
              <div className="col-span-full py-20 text-center opacity-30 uppercase text-xs font-black tracking-widest">Registry is empty</div>
            ) : (
              examHistory.map((exam) => (
                <Card key={exam.id} className="p-8 bg-slate-900 border-white/5 rounded-3xl group hover:border-school-primary/30 transition-all">
                  <h3 className="font-bold text-xl uppercase italic">{exam.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest font-black">
                    {exam.class.name} • {exam._count.questions} Items
                  </p>
                  <button
                    onClick={() => handleViewHistory(exam)}
                    className="mt-6 flex items-center gap-2 text-slate-400 hover:text-school-primary font-black uppercase text-[10px] tracking-widest transition-colors"
                  >
                    <Eye className="h-4 w-4" /> Open Registry File
                  </button>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="create">
          {step === 1 ? (
            <DraftBuilder
              assignments={assignments}
              selectedAssignment={selectedAssignment}
              setSelectedAssignment={setSelectedAssignment}
              termGroups={termGroups}
              selectedTopicIds={selectedTopicIds}
              setSelectedTopicIds={setSelectedTopicIds}
              validClassrooms={validClassrooms}
              selectedClassIds={selectedClassIds}
              toggleClass={toggleClass}
              config={config}
              setConfig={setConfig}
              handleBuildPool={handleBuildPool}
              isPending={isPending}
            />
          ) : (
            <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-8">
              <div className="flex justify-between bg-slate-900 p-6 rounded-[2rem] border border-white/5">
                 <button onClick={() => setStep(1)} className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-white">
                   <ArrowLeft className="h-4 w-4"/> Settings
                 </button>
                 {!isViewOnly && (
                   <button 
                     onClick={handleFinalDeploy} 
                     disabled={isPending}
                     className="bg-school-primary text-slate-950 px-8 py-3 rounded-xl font-black uppercase text-xs shadow-xl"
                   >
                     {isPending ? <Loader2 className="animate-spin" /> : "Deploy to Registry"}
                   </button>
                 )}
              </div>

              <Card className="p-12 md:p-20 bg-white text-slate-900 rounded-[3rem] shadow-2xl relative overflow-visible">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-black uppercase italic">{config.title}</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Official Institutional Record</p>
                </div>

                <div className="space-y-12">
                  {generatedPool.map((q: any, index: number) => (
                    <div key={index} className="space-y-4">
                      <p className="font-bold text-lg leading-snug">
                        <span className="text-school-primary mr-4 font-black">Q{index + 1}.</span>
                        {q.text}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-10">
                        {q.options?.map((opt: string, i: number) => (
                          <div key={i} className={cn(
                            "text-sm font-medium p-3 rounded-lg border",
                            !isViewOnly && opt === q.correctAnswer ? "border-school-primary bg-school-primary/5 text-school-primary font-black" : "border-slate-100 text-slate-500"
                          )}>
                             {String.fromCharCode(65 + i)}) {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DraftBuilder({
  assignments,
  selectedAssignment,
  setSelectedAssignment,
  termGroups,
  selectedTopicIds,
  setSelectedTopicIds,
  validClassrooms,
  selectedClassIds,
  toggleClass,
  config,
  setConfig,
  handleBuildPool,
  isPending
}: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start animate-in fade-in duration-500">
      <SubjectSelector
        assignments={assignments}
        selectedAssignment={selectedAssignment}
        setSelectedAssignment={setSelectedAssignment}
      />
      <SyllabusSelector
        termGroups={termGroups}
        selectedTopicIds={selectedTopicIds}
        setSelectedTopicIds={setSelectedTopicIds}
      />
      <SettingsSidebar
        validClassrooms={validClassrooms}
        selectedClassIds={selectedClassIds}
        toggleClass={toggleClass}
        config={config}
        setConfig={setConfig}
        handleBuildPool={handleBuildPool}
        isPending={isPending}
      />
    </div>
  )
}



