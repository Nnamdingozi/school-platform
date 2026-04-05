// 'use client'

// import { useState, useEffect, useMemo } from 'react'
// import { useProfileStore } from '@/store/profileStore'
// import { 
//     getAdminExamRegistry, 
//     type AdminExamStats, 
//     type ExamRegistryItem 
// } from '@/app/actions/exam-engine.actions'
// import { ExamStatCard } from '@/components/shared/examComponent'
// import { 
//     ClipboardList, Search, Activity, CheckCircle2, 
//     Database, Loader2, Users 
// } from 'lucide-react'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// export default function AdminExamRegistry() {
//     const { profile } = useProfileStore()
//     const schoolId = profile?.schoolId ?? ''

//     // ✅ FIX: Use strict types for state
//     const [stats, setStats] = useState<AdminExamStats | null>(null)
//     const [exams, setExams] = useState<ExamRegistryItem[]>([])
//     const [loading, setLoading] = useState(true)
//     const [searchQuery, setSearchQuery] = useState("")

//     useEffect(() => {
//         if (!schoolId) return

//         async function loadData() {
//             setLoading(true)
//             const res = await getAdminExamRegistry(schoolId)
            
//             // ✅ FIX: Access stats and exams directly from res
//             if (res.success && res.stats && res.exams) {
//                 setStats(res.stats)
//                 setExams(res.exams)
//             } else {
//                 toast.error(res.error || "Failed to connect to the Exam Vault")
//             }
//             setLoading(false)
//         }
//         loadData()
//     }, [schoolId])

//     // ✅ FIX: Explicitly type the parameter 'e'
//     const filteredExams = useMemo(() => {
//         return exams.filter((e: ExamRegistryItem) => 
//             e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             e.className.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//     }, [exams, searchQuery])

//     if (loading) return (
//         <div className="h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
//             <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//             <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest animate-pulse ">Synchronizing_Exam_Registry...</p>
//         </div>
//     )

//     return (
//         <div className="p-4 md:p-8 lg:p-12 bg-slate-950 min-h-screen text-slate-50 space-y-10 animate-in fade-in duration-500">
//             <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//                 <div className="flex items-center gap-5">
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl shadow-school-primary/10">
//                         <ClipboardList className="h-7 w-7 text-school-primary" />
//                     </div>
//                     <div>
//                         <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">Exam Registry</h1>
//                         <p className="text-slate-500 text-sm mt-2 font-medium italic">Master oversight of institutional CBT activity.</p>
//                     </div>
//                 </div>
//             </header>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <ExamStatCard 
//                     label="Total Assessments" 
//                     value={stats?.totalExams ?? 0} 
//                     sub="Items in bank" 
//                     icon={Database} 
//                 />
//                 <ExamStatCard 
//                     label="Active Sessions" 
//                     value={stats?.activeNow ?? 0} 
//                     sub="Running now" 
//                     icon={Activity} 
//                     colorClass="text-school-primary" 
//                 />
//                 <ExamStatCard 
//                     label="System Completion" 
//                     value={`${stats?.completionRate ?? 0}%`} 
//                     sub="Global submission rate" 
//                     icon={CheckCircle2} 
//                     colorClass="text-emerald-500" 
//                 />
//             </div>

//             <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
//                 <div className="p-8 border-b border-white/5 bg-slate-950/40 flex flex-col md:flex-row justify-between items-center gap-6">
//                     <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">Active Registry Index</h3>
//                     <div className="relative w-full md:w-96">
//                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
//                         <input 
//                             placeholder="Filter by classroom or exam title..." 
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800" 
//                         />
//                     </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                         <thead>
//                             <tr className="text-left text-slate-500 text-[10px] uppercase tracking-widest bg-slate-950/20 border-b border-white/5 font-black">
//                                 <th className="px-10 py-6 italic">Exam Identity</th>
//                                 <th className="px-10 py-6 italic">Target cohort</th>
//                                 <th className="px-10 py-6 italic">System status</th>
//                                 <th className="px-10 py-6 text-right italic">Progress</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-white/5">
//                             {/* ✅ FIX: Explicitly type 'exam' */}
//                             {filteredExams.map((exam: ExamRegistryItem) => {
//                                 const progress = exam.studentCount > 0 
//                                     ? Math.round((exam.completedCount / exam.studentCount) * 100) 
//                                     : 0

//                                 return (
//                                     <tr key={exam.id} className="hover:bg-school-primary/5 transition-all group">
//                                         <td className="px-10 py-8 text-white font-black uppercase italic leading-tight">{exam.title}</td>
//                                         <td className="px-10 py-8">
//                                             <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
//                                                 <Users className="h-3.5 w-3.5 text-school-primary" /> {exam.className}
//                                             </div>
//                                         </td>
//                                         <td className="px-10 py-8">
//                                             <span className={cn(
//                                                 "inline-flex px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
//                                                 exam.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
//                                                 exam.status === 'ONGOING' ? 'bg-school-primary/10 text-school-primary border-school-primary/20 animate-pulse shadow-2xl shadow-school-primary/10' :
//                                                 'bg-slate-800 text-slate-400 border-white/5'
//                                             )}>
//                                                 {exam.status}
//                                             </span>
//                                         </td>
//                                         <td className="px-10 py-8 text-right">
//                                             <div className="flex flex-col items-end gap-2">
//                                                 <span className="text-[10px] font-black text-white uppercase tracking-tighter">
//                                                     {exam.completedCount} / {exam.studentCount} SYNCED
//                                                 </span>
//                                                 <div className="h-1.5 w-40 bg-slate-950 rounded-full overflow-hidden border border-white/5">
//                                                     <div 
//                                                         className={cn(
//                                                             "h-full transition-all duration-1000",
//                                                             progress === 100 ? "bg-emerald-500" : "bg-school-primary shadow-[0_0_10px_var(--color-school-primary)]"
//                                                         )}
//                                                         style={{ width: `${progress}%` }} 
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     )
// }


'use client'

import { useState, useEffect, useMemo } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { 
    getAdminExamRegistry, 
    type AdminExamStats, 
    type ExamRegistryItem 
} from '@/app/actions/exam-engine.actions'
import { ExamStatCard } from '@/components/shared/examComponent'
import { 
    ClipboardList, Search, Activity, CheckCircle2, 
    Database, Loader2, Users 
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function AdminExamRegistry() {
    const { profile } = useProfileStore()
    const schoolId = profile?.schoolId ?? ''

    // ✅ FIX: Use strict types for state
    const [stats, setStats] = useState<AdminExamStats | null>(null)
    const [exams, setExams] = useState<ExamRegistryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        if (!schoolId) return

        async function loadData() {
            setLoading(true)
            const res = await getAdminExamRegistry(schoolId)
            
            // ✅ FIX: Access stats and exams directly from res
            if (res.success && res.stats && res.exams) {
                setStats(res.stats)
                setExams(res.exams)
            } else {
                toast.error(res.error || "Failed to connect to the Exam Vault")
            }
            setLoading(false)
        }
        loadData()
    }, [schoolId])

    // ✅ FIX: Explicitly type the parameter 'e'
    const filteredExams = useMemo(() => {
        return exams.filter((e: ExamRegistryItem) => 
            e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.className.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [exams, searchQuery])

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">Synchronizing_Exam_Registry...</p>
        </div>
    )

    return (
        <div className="p-4 md:p-8 lg:p-12 bg-slate-950 min-h-screen text-slate-50 space-y-10 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl shadow-school-primary/10">
                        <ClipboardList className="h-7 w-7 text-school-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">Exam Registry</h1>
                        <p className="text-slate-500 text-sm mt-2 font-medium italic">Master oversight of institutional CBT activity.</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ExamStatCard 
                    label="Total Assessments" 
                    value={stats?.totalExams ?? 0} 
                    sub="Items in bank" 
                    icon={Database} 
                />
                <ExamStatCard 
                    label="Active Sessions" 
                    value={stats?.activeNow ?? 0} 
                    sub="Running now" 
                    icon={Activity} 
                    colorClass="text-school-primary" 
                />
                <ExamStatCard 
                    label="System Completion" 
                    value={`${stats?.completionRate ?? 0}%`} 
                    sub="Global submission rate" 
                    icon={CheckCircle2} 
                    colorClass="text-emerald-500" 
                />
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-slate-950/40 flex flex-col md:flex-row justify-between items-center gap-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">Active Registry Index</h3>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                        <input 
                            placeholder="Filter by classroom or exam title..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800" 
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-slate-500 text-[10px] uppercase tracking-widest bg-slate-950/20 border-b border-white/5 font-black">
                                <th className="px-10 py-6 italic">Exam Identity</th>
                                <th className="px-10 py-6 italic">Target cohort</th>
                                <th className="px-10 py-6 italic">System status</th>
                                <th className="px-10 py-6 text-right italic">Progress</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {/* ✅ FIX: Explicitly type 'exam' */}
                            {filteredExams.map((exam: ExamRegistryItem) => {
                                const progress = exam.studentCount > 0 
                                    ? Math.round((exam.completedCount / exam.studentCount) * 100) 
                                    : 0

                                return (
                                    <tr key={exam.id} className="hover:bg-school-primary/5 transition-all group">
                                        <td className="px-10 py-8 text-white font-black uppercase italic leading-tight">{exam.title}</td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                                <Users className="h-3.5 w-3.5 text-school-primary" /> {exam.className}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={cn(
                                                "inline-flex px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                                exam.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                exam.status === 'ONGOING' ? 'bg-school-primary/10 text-school-primary border-school-primary/20 animate-pulse shadow-2xl shadow-school-primary/10' :
                                                'bg-slate-800 text-slate-400 border-white/5'
                                            )}>
                                                {exam.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                                                    {exam.completedCount} / {exam.studentCount} SYNCED
                                                </span>
                                                <div className="h-1.5 w-40 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                                    <div 
                                                        className={cn(
                                                            "h-full transition-all duration-1000",
                                                            progress === 100 ? "bg-emerald-500" : "bg-school-primary shadow-[0_0_10px_var(--color-school-primary)]"
                                                        )}
                                                        style={{ width: `${progress}%` }} 
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}