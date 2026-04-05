// 'use client'

// import { useState, useEffect } from "react"
// import { CurriculumCard } from "@/components/admin-dasboard/curriculum-card"
// import { useProfileStore } from "@/store/profileStore"
// import { getManagementHelpers } from "@/app/actions/class-management"
// import { 
//     BookMarked, 
//     Settings2, 
//     CheckCircle2, 
//     AlertCircle, 
//     Loader2,
//     Search,
//     ChevronRight
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import Link from "next/link"

// export default function CurriculumManagementPage() {
//     const { profile } = useProfileStore()
//     const [grades, setGrades] = useState<any[]>([])
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         if (!profile?.schoolId) return
//         // We reuse your management helpers to get the grades and their subject counts
//         getManagementHelpers(profile.schoolId).then(res => {
//             setGrades(res.grades)
//             setLoading(false)
//         })
//     }, [profile?.schoolId])

//     return (
//         <div className="p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50">
//             {/* ── Page Header ── */}
//             <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//                 <div className="flex items-center gap-5">
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
//                         <BookMarked className="h-7 w-7 text-school-primary" />
//                     </div>
//                     <div>
//                         <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Academic Architecture</h1>
//                         <p className="text-slate-500 text-sm mt-2 font-medium uppercase tracking-widest text-[10px]">Master Curriculum Registry</p>
//                     </div>
//                 </div>

//                 <div className="flex gap-3">
//                     <Button asChild variant="outline" className="border-white/10 text-slate-400 hover:bg-white/5 uppercase text-[10px] font-black tracking-widest px-6 h-12">
//                         <Link href="/admin/settings?tab=curriculum">
//                             <Settings2 className="w-4 h-4 mr-2 text-school-primary" /> Labels
//                         </Link>
//                     </Button>
//                 </div>
//             </header>

//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
                
//                 {/* ── Left Column: Overview Widget ── */}
//                 <div className="xl:col-span-1 sticky top-24 space-y-6">
//                     <CurriculumCard />
                    
//                     <div className="p-6 rounded-[2rem] bg-slate-900 border border-white/5 space-y-4">
//                         <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Status</h4>
//                         <div className="flex items-center gap-3">
//                             <CheckCircle2 className="h-4 w-4 text-emerald-500" />
//                             <span className="text-xs text-slate-300 font-bold uppercase tracking-tight">Database Synced</span>
//                         </div>
//                         <p className="text-[10px] text-slate-500 leading-relaxed italic">
//                             All subjects are mapped to the {profile?.school?.curriculum?.name || 'national'} standard.
//                         </p>
//                     </div>
//                 </div>

//                 {/* ── Right Column: Grade-by-Grade Health Check ── */}
//                 <div className="xl:col-span-2 space-y-6">
//                     <div className="flex items-center justify-between px-2">
//                         <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Academic Breakdown</h3>
//                         <span className="text-[10px] font-bold text-slate-500 uppercase">{grades.length} Levels Active</span>
//                     </div>

//                     <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
//                         <CardContent className="p-0">
//                             {loading ? (
//                                 <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-school-primary" /></div>
//                             ) : (
//                                 <div className="overflow-x-auto">
//                                     <table className="w-full text-sm">
//                                         <thead>
//                                             <tr className="text-left text-slate-500 text-[10px] uppercase tracking-widest bg-slate-950/40 border-b border-white/5">
//                                                 <th className="px-8 py-5">Grade Level</th>
//                                                 <th className="px-8 py-5">Subjects</th>
//                                                 <th className="px-8 py-5">Status</th>
//                                                 <th className="px-8 py-5 text-right">Registry</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="divide-y divide-white/5">
//                                             {grades.map((grade) => (
//                                                 <tr key={grade.id} className="hover:bg-school-primary/5 transition-all group">
//                                                     <td className="px-8 py-6 font-bold text-white uppercase italic text-base">
//                                                         {grade.displayName}
//                                                     </td>
//                                                     <td className="px-8 py-6">
//                                                         <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-white/5">
//                                                             {grade.gradeSubjects?.length || 0} Assigned
//                                                         </span>
//                                                     </td>
//                                                     <td className="px-8 py-6">
//                                                         {(grade.gradeSubjects?.length || 0) > 5 ? (
//                                                             <span className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
//                                                                 <CheckCircle2 className="h-3 w-3" /> Fully Configured
//                                                             </span>
//                                                         ) : (
//                                                             <span className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest">
//                                                                 <AlertCircle className="h-3 w-3" /> Underpopulated
//                                                             </span>
//                                                         )}
//                                                     </td>
//                                                     <td className="px-8 py-6 text-right">
//                                                         <Link href={`/admin/curriculum/allocation?gradeId=${grade.id}`}>
//                                                             <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl bg-slate-950 border border-white/5 group-hover:bg-school-primary group-hover:text-slate-950 transition-all">
//                                                                 <ChevronRight className="h-4 w-4" />
//                                                             </Button>
//                                                         </Link>
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     )
// }



// 'use client'

// import { useState, useEffect } from "react"
// import { CurriculumCard } from "@/components/admin-dasboard/curriculum-card"
// import { useProfileStore } from "@/store/profileStore"
// import { getManagementHelpers } from "@/app/actions/class-management"
// import { 
//     BookMarked, 
//     Settings2, 
//     CheckCircle2, 
//     AlertCircle, 
//     Loader2,
//     ChevronRight
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import Link from "next/link"

// export default function CurriculumManagementPage() {
//     const { profile } = useProfileStore()
//     const [grades, setGrades] = useState<any[]>([])
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         if (!profile?.schoolId) return
//         getManagementHelpers(profile.schoolId).then(res => {
//             setGrades(res.grades)
//             setLoading(false)
//         })
//     }, [profile?.schoolId])

//     return (
//         <div className="p-4 md:p-8 lg:p-12 space-y-12 bg-slate-950 min-h-screen text-slate-50">
//             {/* ── Page Header ── */}
//             <header className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//                 <div className="flex items-center gap-5">
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
//                         <BookMarked className="h-7 w-7 text-school-primary" />
//                     </div>
//                     <div>
//                         <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Academic Architecture</h1>
//                         <p className="text-slate-500 text-sm mt-2 font-medium uppercase tracking-widest text-[10px]">Master Curriculum Registry</p>
//                     </div>
//                 </div>

//                 <Button asChild variant="outline" className="border-white/10 text-slate-400 hover:bg-white/5 uppercase text-[10px] font-black tracking-widest px-6 h-12">
//                     <Link href="/admin/settings?tab=curriculum">
//                         <Settings2 className="w-4 h-4 mr-2 text-school-primary" /> Label Settings
//                     </Link>
//                 </Button>
//             </header>

//             {/* ── Stacked Content Container ── */}
//             <main className="max-w-5xl mx-auto space-y-10">
                
//                 {/* ── Top Section: Global Summary ── */}
//                 <section className="space-y-4">
//                     <div className="flex items-center gap-3 px-2">
//                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-school-primary">01</span>
//                         <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Curriculum Overview</h3>
//                     </div>
//                     <div className="w-full">
//                         <CurriculumCard />
//                     </div>
//                 </section>

//                 {/* ── Bottom Section: Detailed Grade Audit ── */}
//                 <section className="space-y-4">
//                     <div className="flex items-center justify-between px-2">
//                         <div className="flex items-center gap-3">
//                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-school-primary">02</span>
//                             <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Registry Health Check</h3>
//                         </div>
//                         <span className="text-[10px] font-bold text-slate-500 uppercase font-mono italic">
//                             {grades.length} Levels Discovered
//                         </span>
//                     </div>

//                     <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
//                         <CardContent className="p-0">
//                             {loading ? (
//                                 <div className="py-40 flex flex-col items-center justify-center gap-4">
//                                     <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//                                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Querying_Grade_Matrix...</p>
//                                 </div>
//                             ) : (
//                                 <div className="overflow-x-auto">
//                                     <table className="w-full text-sm">
//                                         <thead>
//                                             <tr className="text-left text-slate-500 text-[10px] uppercase tracking-widest bg-slate-950/40 border-b border-white/5 font-black">
//                                                 <th className="px-10 py-6 italic">Academic Level</th>
//                                                 <th className="px-10 py-6 italic">Subject Count</th>
//                                                 <th className="px-10 py-6 italic">Deployment Status</th>
//                                                 <th className="px-10 py-6 text-right italic">Action</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="divide-y divide-white/5">
//                                             {grades.map((grade) => (
//                                                 <tr key={grade.id} className="hover:bg-school-primary/5 transition-all group">
//                                                     <td className="px-10 py-8 font-black text-white uppercase italic text-lg">
//                                                         {grade.displayName}
//                                                     </td>
//                                                     <td className="px-10 py-8">
//                                                         <div className="flex items-center gap-3">
//                                                             <div className="h-8 w-12 bg-slate-950 rounded-lg border border-white/5 flex items-center justify-center text-xs font-mono text-school-primary font-bold shadow-inner">
//                                                                 {grade.gradeSubjects?.length || 0}
//                                                             </div>
//                                                             <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter italic">Courses Assigned</span>
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-10 py-8">
//                                                         {(grade.gradeSubjects?.length || 0) >= 8 ? (
//                                                             <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
//                                                                 <CheckCircle2 className="h-4 w-4" /> Fully Synchronized
//                                                             </div>
//                                                         ) : (
//                                                             <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest">
//                                                                 <AlertCircle className="h-4 w-4" /> Data Incomplete
//                                                             </div>
//                                                         )}
//                                                     </td>
//                                                     <td className="px-10 py-8 text-right">
//                                                         <Link href={`/admin/curriculum/allocation?gradeId=${grade.id}`}>
//                                                             <Button variant="ghost" className="h-12 px-6 rounded-2xl bg-slate-950 border border-white/5 group-hover:bg-school-primary group-hover:text-school-secondary-950 transition-all shadow-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
//                                                                 Manage Registry
//                                                                 <ChevronRight className="h-4 w-4" />
//                                                             </Button>
//                                                         </Link>
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>

//                     {/* ── Footer Instruction ── */}
//                     <div className="p-6 flex items-center gap-4 text-slate-600">
//                         <AlertCircle className="h-4 w-4" />
//                         <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
//                             Individual subject settings and broadsheet allocations are handled within the 
//                             <span className="text-slate-400"> Manage Registry</span> portal for each level.
//                         </p>
//                     </div>
//                 </section>
//             </main>
//         </div>
//     )
// }



'use client'

import { useState, useEffect } from "react"
import { CurriculumCard } from "@/components/admin-dasboard/curriculum-card"
import { useProfileStore } from "@/store/profileStore"
import { getManagementHelpers } from "@/app/actions/class-management"
import { getErrorMessage } from "@/lib/error-handler"
import { 
    BookMarked, 
    Settings2, 
    CheckCircle2, 
    AlertCircle, 
    Loader2,
    ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

// ── Types ──────────────────────────────────────────────────────────────────────

interface GradeWithSubjects {
    id: string;
    displayName: string;
    gradeSubjects?: { id: string }[];
}

export default function CurriculumManagementPage() {
    const { profile } = useProfileStore()
    
    // ✅ FIX: Replaced any[] with GradeWithSubjects[]
    const [grades, setGrades] = useState<GradeWithSubjects[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!profile?.schoolId) return
        
        async function loadData() {
            try {
                const res = await getManagementHelpers(profile!.schoolId!)
                // Cast the response to our local interface for type safety
                setGrades(res.grades as GradeWithSubjects[])
            } catch (error) {
                console.error("Failed to load grade registry", getErrorMessage(error)	)
            } finally {
                setLoading(false)
            }
        }
        
        loadData()
    }, [profile?.schoolId, profile])

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-12 bg-slate-950 min-h-screen text-slate-50">
            {/* ── Page Header ── */}
            <header className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
                        <BookMarked className="h-7 w-7 text-school-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Academic Architecture</h1>
                        <p className="text-slate-500 text-sm mt-2 font-medium uppercase tracking-widest text-[10px]">Master Curriculum Registry</p>
                    </div>
                </div>

                <Button asChild variant="outline" className="border-white/10 text-slate-400 hover:bg-white/5 uppercase text-[10px] font-black tracking-widest px-6 h-12 rounded-xl">
                    <Link href="/admin/settings?tab=curriculum">
                        <Settings2 className="w-4 h-4 mr-2 text-school-primary" /> Label Settings
                    </Link>
                </Button>
            </header>

            {/* ── Stacked Content Container ── */}
            <main className="max-w-5xl mx-auto space-y-10">
                
                {/* ── Top Section: Global Summary ── */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-school-primary">01</span>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Curriculum Overview</h3>
                    </div>
                    <div className="w-full">
                        <CurriculumCard />
                    </div>
                </section>

                {/* ── Bottom Section: Detailed Grade Audit ── */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-school-primary">02</span>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Registry Health Check</h3>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase font-mono italic">
                            {grades.length} Levels Discovered
                        </span>
                    </div>

                    <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="py-40 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Querying_Grade_Matrix...</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-slate-500 text-[10px] uppercase tracking-widest bg-slate-950/40 border-b border-white/5 font-black">
                                                <th className="px-10 py-6 italic">Academic Level</th>
                                                <th className="px-10 py-6 italic">Subject Count</th>
                                                <th className="px-10 py-6 italic">Deployment Status</th>
                                                <th className="px-10 py-6 text-right italic">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {grades.map((grade) => (
                                                <tr key={grade.id} className="hover:bg-school-primary/5 transition-all group">
                                                    <td className="px-10 py-8 font-black text-white uppercase italic text-lg">
                                                        {grade.displayName}
                                                    </td>
                                                    <td className="px-10 py-8">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-12 bg-slate-950 rounded-lg border border-white/5 flex items-center justify-center text-xs font-mono text-school-primary font-bold shadow-inner">
                                                                {grade.gradeSubjects?.length || 0}
                                                            </div>
                                                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter italic">Courses Assigned</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-8">
                                                        {(grade.gradeSubjects?.length || 0) >= 8 ? (
                                                            <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                                                <CheckCircle2 className="h-4 w-4" /> Fully Synchronized
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                                                                <AlertCircle className="h-3 w-3" /> Data Incomplete
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-10 py-8 text-right">
                                                        <Link href={`/admin/curriculum/allocation?gradeId=${grade.id}`}>
                                                            <Button variant="ghost" className="h-12 px-6 rounded-2xl bg-slate-950 border border-white/5 group-hover:bg-school-primary group-hover:text-school-secondary-950 transition-all shadow-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                                                Manage Registry
                                                                <ChevronRight className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* ── Footer Instruction ── */}
                    <div className="p-6 flex items-center gap-4 text-slate-600">
                        <AlertCircle className="h-4 w-4 text-school-primary" />
                        <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                            Individual subject settings and broadsheet allocations are handled within the 
                            <span className="text-slate-400"> Manage Registry</span> portal for each level.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    )
}