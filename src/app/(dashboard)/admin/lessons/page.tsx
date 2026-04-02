// 'use client'

// import { useState, useEffect, useMemo } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { 
//     getAdminLessonBank, 
//     type LessonRegistryItem, 
//     type LessonBankStats 
// } from "@/app/actions/lesson.actions"
// import { 
//     FileText, Search, Eye, Loader2, 
//     BarChart3, Clock, Zap, ShieldCheck,
//     LayoutGrid, ChevronRight, Globe, School
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// // ── Sub-component: StatCard ──────────────────────────────────────────────────
// interface StatCardProps {
//     label: string
//     value: string | number
//     sub: string
//     icon: React.ElementType
// }

// function StatCard({ label, value, sub, icon: Icon }: StatCardProps) {
//     return (
//         <Card className="bg-slate-900 border-white/5 rounded-[2rem] p-8 shadow-xl group hover:border-school-primary/20 transition-all duration-300">
//             <div className="flex justify-between items-start mb-4">
//                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
//                 <div className="p-2 bg-slate-950 rounded-lg group-hover:bg-school-primary/10 transition-colors">
//                     <Icon className="h-4 w-4 text-slate-700 group-hover:text-school-primary transition-colors" />
//                 </div>
//             </div>
//             <h3 className="text-4xl font-black text-white leading-none tracking-tighter">{value}</h3>
//             <p className="text-[10px] text-school-primary font-bold uppercase mt-3 tracking-widest opacity-80">{sub}</p>
//         </Card>
//     )
// }

// // ── Main Page Component ──────────────────────────────────────────────────────

// export default function AdminLessonBank() {
//     const { profile } = useProfileStore()
//     const [stats, setStats] = useState<LessonBankStats | null>(null)
//     const [lessons, setLessons] = useState<LessonRegistryItem[]>([])
//     const [loading, setLoading] = useState(true)
//     const [searchQuery, setSearchQuery] = useState("")

//     useEffect(() => {
//         async function loadRegistry() {
//             if (!profile?.schoolId) return
//             setLoading(true)
//             try {
//                 const res = await getAdminLessonBank(profile.schoolId)
                
//                 // ✅ Correctly utilizing the structured return value
//                 if (res.success && res.stats && res.registry) {
//                     setStats(res.stats)
//                     setLessons(res.registry)
//                 } else {
//                     toast.error("Registry synchronization failed")
//                 }
//             } catch (err) {
//                 toast.error("Failed to connect to content vault")
//             } finally {
//                 setLoading(false)
//             }
//         }
//         loadRegistry()
//     }, [profile?.schoolId])

//     // Client-side filtering logic
//     const filteredLessons = useMemo(() => {
//         return lessons.filter(l => 
//             l.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             l.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             l.teacherName?.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//     }, [lessons, searchQuery])

//     if (loading) return (
//         <div className="h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
//             <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//             <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">Accessing_Lesson_Vault...</p>
//         </div>
//     )

//     return (
//         <div className="p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50 font-sans">
            
//             {/* ── Header ── */}
//             <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//                 <div className="flex items-center gap-5">
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl shadow-school-primary/10">
//                         <FileText className="h-7 w-7 text-school-primary" />
//                     </div>
//                     <div>
//                         <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">Lesson Bank</h1>
//                         <p className="text-slate-500 text-sm mt-2 font-medium">Master repository of curriculum-aligned digital assets.</p>
//                     </div>
//                 </div>
//                 <div className="hidden lg:flex items-center gap-3 bg-slate-900 border border-white/5 px-6 py-3 rounded-2xl">
//                     <ShieldCheck className="h-4 w-4 text-emerald-500" />
//                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Centralized Oversight Active</span>
//                 </div>
//             </header>

//             {/* ── Stats Section ── */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <StatCard 
//                     label="Total Inventory" 
//                     value={stats?.totalLessons.toLocaleString() ?? '0'} 
//                     sub="Global + Private Assets" 
//                     icon={BarChart3}
//                 />
//                 <StatCard 
//                     label="Curriculum Coverage" 
//                     value={`${stats?.coverageRate ?? 0}%`} 
//                     sub="Topics with Lesson Notes" 
//                     icon={Zap}
//                 />
//                 <StatCard 
//                     label="Recent Velocity" 
//                     value={stats?.recentCount ?? 0} 
//                     sub="Additions in last 24h" 
//                     icon={Clock}
//                 />
//             </div>

//             {/* ── Registry Table ── */}
//             <div className="rounded-[2.5rem] border border-white/5 bg-slate-900 overflow-hidden shadow-2xl">
//                 <div className="p-8 border-b border-white/5 bg-slate-950/40 flex flex-col md:flex-row justify-between items-center gap-6">
//                     <div className="flex items-center gap-3">
//                         <LayoutGrid className="h-4 w-4 text-school-primary" />
//                         <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white italic">Asset Registry Index</h3>
//                     </div>
//                     <div className="relative w-full md:w-96">
//                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
//                          <input 
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             placeholder="Filter by subject, topic or author..." 
//                             className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800" 
//                          />
//                     </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                         <thead>
//                             <tr className="text-left text-slate-500 text-[10px] uppercase tracking-[0.3em] bg-slate-950/20 border-b border-white/5 font-black">
//                                 <th className="px-10 py-6 italic">Academic context</th>
//                                 <th className="px-10 py-6 italic">Topic identification</th>
//                                 <th className="px-10 py-6 italic">Origin / Source</th>
//                                 <th className="px-10 py-6 text-right italic">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-white/5">
//                             {filteredLessons.map((lesson) => (
//                                 <tr key={lesson.id} className="hover:bg-school-primary/5 transition-all group">
//                                     <td className="px-10 py-8">
//                                         <p className="font-black text-white uppercase italic text-base">{lesson.subjectName}</p>
//                                         <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">{lesson.gradeName}</p>
//                                     </td>
//                                     <td className="px-10 py-8">
//                                         <p className="text-sm text-slate-300 font-bold leading-relaxed line-clamp-1">{lesson.topicTitle}</p>
//                                         <div className="flex items-center gap-2 mt-2">
//                                             <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
//                                             <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{lesson.teacherName}</span>
//                                         </div>
//                                     </td>
//                                     <td className="px-10 py-8">
//                                         <span className={cn(
//                                             "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest",
//                                             lesson.isGlobal 
//                                                 ? "bg-blue-500/5 border-blue-500/20 text-blue-400" 
//                                                 : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
//                                         )}>
//                                             {lesson.isGlobal ? <Globe className="h-3 w-3" /> : <School className="h-3 w-3" />}
//                                             {lesson.isGlobal ? 'Curriculum Standard' : 'Institutional Edit'}
//                                         </span>
//                                     </td>
//                                     <td className="px-10 py-8 text-right">
//                                         <button className="h-12 w-12 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-center hover:bg-school-primary hover:text-school-secondary-950 transition-all shadow-lg group-hover:scale-110">
//                                             <Eye className="h-5 w-5" />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                             {filteredLessons.length === 0 && (
//                                 <tr>
//                                     <td colSpan={4} className="py-32 text-center">
//                                         <div className="flex flex-col items-center gap-2 opacity-20">
//                                             <Search className="h-10 w-10 text-slate-500" />
//                                             <p className="text-slate-500 font-black uppercase text-xs tracking-[0.3em]">No_Vault_Matches_Found</p>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     )
// }



// 'use client'

// import { useState, useEffect, useMemo } from "react"
// import { getErrorMessage } from "@/lib/error-handler"
// import { useProfileStore } from "@/store/profileStore"
// import { 
//     getAdminLessonBank, 
//     type LessonRegistryItem, 
//     type LessonBankStats 
// } from "@/app/actions/lesson.actions"
// import { 
//     FileText, Search, Eye, Loader2, 
//     BarChart3, Zap, ShieldCheck,
//     LayoutGrid, Globe, School, Activity
// } from "lucide-react"
// import { Card } from "@/components/ui/card"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// // ── Sub-component: StatCard ──────────────────────────────────────────────────
// interface StatCardProps {
//     label: string
//     value: string | number
//     sub: string
//     icon: React.ElementType
// }

// function StatCard({ label, value, sub, icon: Icon }: StatCardProps) {
//     return (
//         <Card className="bg-slate-900 border-white/5 rounded-[2rem] p-8 shadow-xl group hover:border-school-primary/20 transition-all duration-300">
//             <div className="flex justify-between items-start mb-4">
//                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
//                 <div className="p-2 bg-slate-950 rounded-lg group-hover:bg-school-primary/10 transition-colors border border-white/5">
//                     <Icon className="h-4 w-4 text-slate-700 group-hover:text-school-primary transition-colors" />
//                 </div>
//             </div>
//             <h3 className="text-4xl font-black text-white leading-none tracking-tighter">{value}</h3>
//             <p className="text-[10px] text-school-primary font-bold uppercase mt-3 tracking-widest opacity-80">{sub}</p>
//         </Card>
//     )
// }

// // ── Main Page Component ──────────────────────────────────────────────────────

// export default function AdminLessonBank() {
//     const { profile } = useProfileStore()
//     const [stats, setStats] = useState<LessonBankStats | null>(null)
//     const [lessons, setLessons] = useState<LessonRegistryItem[]>([])
//     const [loading, setLoading] = useState(true)
//     const [searchQuery, setSearchQuery] = useState("")

//     useEffect(() => {
//         async function loadRegistry() {
//             if (!profile?.schoolId) return
//             setLoading(true)
//             try {
//                 const res = await getAdminLessonBank(profile.schoolId)
                
//                 if (res.success && res.stats && res.registry) {
//                     setStats(res.stats)
//                     setLessons(res.registry)
//                 } else {
//                     toast.error("Registry synchronization failed")
//                 }
//             } catch (err) {
//                 toast.error("Critical: Failed to access institutional vault")
//                 getErrorMessage(err)
//             } finally {
//                 setLoading(false)
//             }
//         }
//         loadRegistry()
//     }, [profile?.schoolId])

//     const filteredLessons = useMemo(() => {
//         return lessons.filter(l => 
//             l.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             l.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             l.teacherName?.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//     }, [lessons, searchQuery])

//     if (loading) return (
//         <div className="h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
//             <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//             <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse italic">Connecting_To_Academic_Vault...</p>
//         </div>
//     )

//     return (
//         <div className="p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50 font-sans">
            
//             {/* ── Header ── */}
//             <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//                 <div className="flex items-center gap-5">
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl shadow-school-primary/10">
//                         <FileText className="h-7 w-7 text-school-primary" />
//                     </div>
//                     <div>
//                         <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">Lesson Bank</h1>
//                         <p className="text-slate-500 text-sm mt-2 font-medium">Global Curriculum Readiness & Institutional Adaptation Metrics.</p>
//                     </div>
//                 </div>
//                 <div className="hidden lg:flex items-center gap-3 bg-slate-900 border border-white/5 px-6 py-3 rounded-2xl shadow-xl shadow-black/20">
//                     <ShieldCheck className="h-4 w-4 text-emerald-500" />
//                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Curriculum Sync Active</span>
//                 </div>
//             </header>

//             {/* ── Refined Stats Section ── */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <StatCard 
//                     label="Library Wealth" 
//                     // @ts-ignore - stats mapping from action
//                     value={stats?.totalLessons.toLocaleString() ?? '0'} 
//                     sub="Lessons Available" 
//                     icon={BarChart3}
//                 />
//                 <StatCard 
//                     label="Syllabus Readiness" 
//                     // @ts-ignore - stats mapping from action
//                     value={`${stats?.coverageRate ?? 0}%`} 
//                     sub="Registry Coverage" 
//                     icon={Zap}
//                 />
//                 <StatCard 
//                     label="Institutional Adaptation" 
//                     // @ts-ignore - stats mapping from action
//                     value={`${stats?.recentCount ?? 0}%`} 
//                     sub="Staff Customization Rate" 
//                     icon={Activity}
//                 />
//             </div>

//             {/* ── Registry Table ── */}
//             <div className="rounded-[2.5rem] border border-white/5 bg-slate-900 overflow-hidden shadow-2xl">
//                 <div className="p-8 border-b border-white/5 bg-slate-950/40 flex flex-col md:flex-row justify-between items-center gap-6">
//                     <div className="flex items-center gap-3">
//                         <LayoutGrid className="h-4 w-4 text-school-primary opacity-50" />
//                         <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">Archive Index</h3>
//                     </div>
//                     <div className="relative w-full md:w-96">
//                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
//                          <input 
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             placeholder="Filter by subject, level or teacher..." 
//                             className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800" 
//                          />
//                     </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                         <thead>
//                             <tr className="text-left text-slate-500 text-[10px] uppercase tracking-[0.3em] bg-slate-950/20 border-b border-white/5 font-black">
//                                 <th className="px-10 py-6 italic">Academic context</th>
//                                 <th className="px-10 py-6 italic">Topic identification</th>
//                                 <th className="px-10 py-6 italic">Asset Source</th>
//                                 <th className="px-10 py-6 text-right italic">Registry Link</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-white/5">
//                             {filteredLessons.map((lesson) => (
//                                 <tr key={lesson.id} className="hover:bg-school-primary/5 transition-all group">
//                                     <td className="px-10 py-8">
//                                         <p className="font-black text-white uppercase italic text-base tracking-tight">{lesson.subjectName}</p>
//                                         <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">{lesson.gradeName}</p>
//                                     </td>
//                                     <td className="px-10 py-8">
//                                         <p className="text-sm text-slate-300 font-bold leading-relaxed line-clamp-1">{lesson.topicTitle}</p>
//                                         <div className="flex items-center gap-2 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
//                                             <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
//                                             <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Modified by: {lesson.teacherName}</span>
//                                         </div>
//                                     </td>
//                                     <td className="px-10 py-8">
//                                         <span className={cn(
//                                             "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest shadow-inner",
//                                             !lesson.isPrivate 
//                                                 ? "bg-blue-500/5 border-blue-500/20 text-blue-400" 
//                                                 : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
//                                         )}>
//                                             {!lesson.isPrivate ? <Globe className="h-3 w-3" /> : <School className="h-3 w-3" />}
//                                             {!lesson.isPrivate ? 'Curriculum Bank' : 'Institutional Edit'}
//                                         </span>
//                                     </td>
//                                     <td className="px-10 py-8 text-right">
//                                         <button className="h-12 w-12 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-center hover:bg-school-primary hover:text-school-secondary-950 transition-all shadow-lg group-hover:scale-110">
//                                             <Eye className="h-5 w-5" />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* ── Context Disclaimer ── */}
//             <footer className="max-w-4xl mx-auto flex items-start gap-4 text-slate-600 opacity-60 hover:opacity-100 transition-opacity pb-20">
//                 <InfoIcon className="h-5 w-5 shrink-0 mt-0.5" />
//                 <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed italic">
//                     The Lesson Bank synchronizes with the National Curriculum Registry. Institutional edits represent localized adjustments made by your staff to meet specific student needs. All data is synchronized in real-time.
//                 </p>
//             </footer>
//         </div>
//     )
// }

// function InfoIcon({ className }: { className?: string }) {
//     return (
//         <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//     )
// }

// 'use client'

// import { useState, useEffect, useMemo } from "react"
// import { getErrorMessage } from "@/lib/error-handler"
// import { useProfileStore } from "@/store/profileStore"
// import { 
//     getAdminLessonBank, 
//     type LessonRegistryItem, 
//     type LessonBankStats 
// } from "@/app/actions/lesson.actions"
// import { 
//     FileText, Search, Eye, Loader2, 
//     BarChart3, Zap, ShieldCheck,
//     LayoutGrid, Globe, School, Activity
// } from "lucide-react"
// import { Card } from "@/components/ui/card"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// // ── Sub-component: StatCard ──────────────────────────────────────────────────

// interface StatCardProps {
//     label: string
//     value: string | number
//     sub: string
//     icon: React.ElementType
// }

// function StatCard({ label, value, sub, icon: Icon }: StatCardProps) {
//     return (
//         <Card className="bg-slate-900 border-white/5 rounded-[2rem] p-8 shadow-xl group hover:border-school-primary/20 transition-all duration-300">
//             <div className="flex justify-between items-start mb-4">
//                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
//                 <div className="p-2 bg-slate-950 rounded-lg group-hover:bg-school-primary/10 transition-colors border border-white/5">
//                     <Icon className="h-4 w-4 text-slate-700 group-hover:text-school-primary transition-colors" />
//                 </div>
//             </div>
//             <h3 className="text-4xl font-black text-white leading-none tracking-tighter">{value}</h3>
//             <p className="text-[10px] text-school-primary font-bold uppercase mt-3 tracking-widest opacity-80">{sub}</p>
//         </Card>
//     )
// }

// // ── Main Page Component ──────────────────────────────────────────────────────

// export default function AdminLessonBank() {
//     const { profile } = useProfileStore()
    
//     // Explicitly typed state to avoid "@ts-ignore"
//     const [stats, setStats] = useState<LessonBankStats | null>(null)
//     const [lessons, setLessons] = useState<LessonRegistryItem[]>([])
//     const [loading, setLoading] = useState(true)
//     const [searchQuery, setSearchQuery] = useState("")

//     useEffect(() => {
//         async function loadRegistry() {
//             if (!profile?.schoolId) return
//             setLoading(true)
//             try {
//                 const res = await getAdminLessonBank(profile.schoolId)
                
//                 if (res.success && res.stats && res.registry) {
//                     setStats(res.stats)
//                     setLessons(res.registry)
//                 } else {
//                     toast.error("Registry synchronization failed")
//                 }
//             } catch (err) {
//                 // ✅ FIX: Use the 'err' variable to satisfy the linter
//                 const message = getErrorMessage(err)
//                 toast.error(`Critical Failure: ${message}`)
//             } finally {
//                 setLoading(false)
//             }
//         }
//         loadRegistry()
//     }, [profile?.schoolId])

//     const filteredLessons = useMemo(() => {
//         return lessons.filter(l => 
//             l.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             l.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             l.teacherName?.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//     }, [lessons, searchQuery])

//     if (loading) return (
//         <div className="h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
//             <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//             <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse italic">Connecting_To_Academic_Vault...</p>
//         </div>
//     )

//     return (
//         <div className="p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50 font-sans">
            
//             {/* ── Header ── */}
//             <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//                 <div className="flex items-center gap-5">
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl shadow-school-primary/10">
//                         <FileText className="h-7 w-7 text-school-primary" />
//                     </div>
//                     <div>
//                         <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">Lesson Bank</h1>
//                         <p className="text-slate-500 text-sm mt-2 font-medium">Global Curriculum Readiness & Institutional Adaptation Metrics.</p>
//                     </div>
//                 </div>
//                 <div className="hidden lg:flex items-center gap-3 bg-slate-900 border border-white/5 px-6 py-3 rounded-2xl shadow-xl shadow-black/20">
//                     <ShieldCheck className="h-4 w-4 text-emerald-500" />
//                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Curriculum Sync Active</span>
//                 </div>
//             </header>

//             {/* ── Refined Stats Section (No more @ts-ignore) ── */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <StatCard 
//                     label="Library Wealth" 
//                     value={stats?.totalLessons.toLocaleString() ?? '0'} 
//                     sub="Lessons Available" 
//                     icon={BarChart3}
//                 />
//                 <StatCard 
//                     label="Syllabus Readiness" 
//                     value={`${stats?.coverageRate ?? 0}%`} 
//                     sub="Registry Coverage" 
//                     icon={Zap}
//                 />
//                 <StatCard 
//                     label="Institutional Adaptation" 
//                     value={`${stats?.recentCount ?? 0}%`} 
//                     sub="Staff Customization Rate" 
//                     icon={Activity}
//                 />
//             </div>

//             {/* ── Registry Table ── */}
//             <div className="rounded-[2.5rem] border border-white/5 bg-slate-900 overflow-hidden shadow-2xl">
//                 <div className="p-8 border-b border-white/5 bg-slate-950/40 flex flex-col md:flex-row justify-between items-center gap-6">
//                     <div className="flex items-center gap-3">
//                         <LayoutGrid className="h-4 w-4 text-school-primary opacity-50" />
//                         <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">Archive Index</h3>
//                     </div>
//                     <div className="relative w-full md:w-96">
//                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
//                          <input 
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             placeholder="Filter by subject, level or teacher..." 
//                             className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800" 
//                          />
//                     </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                         <thead>
//                             <tr className="text-left text-slate-500 text-[10px] uppercase tracking-[0.3em] bg-slate-950/20 border-b border-white/5 font-black">
//                                 <th className="px-10 py-6 italic">Academic context</th>
//                                 <th className="px-10 py-6 italic">Topic identification</th>
//                                 <th className="px-10 py-6 italic">Asset Source</th>
//                                 <th className="px-10 py-6 text-right italic">Registry Link</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-white/5">
//                             {filteredLessons.map((lesson) => (
//                                 <tr key={lesson.id} className="hover:bg-school-primary/5 transition-all group">
//                                     <td className="px-10 py-8">
//                                         <p className="font-black text-white uppercase italic text-base tracking-tight">{lesson.subjectName}</p>
//                                         <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">{lesson.gradeName}</p>
//                                     </td>
//                                     <td className="px-10 py-8">
//                                         <p className="text-sm text-slate-300 font-bold leading-relaxed line-clamp-1">{lesson.topicTitle}</p>
//                                         <div className="flex items-center gap-2 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
//                                             <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
//                                             <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Modified by: {lesson.teacherName}</span>
//                                         </div>
//                                     </td>
//                                     <td className="px-10 py-8">
//                                         <span className={cn(
//                                             "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest shadow-inner",
//                                             !lesson.isPrivate 
//                                                 ? "bg-blue-500/5 border-blue-500/20 text-blue-400" 
//                                                 : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
//                                         )}>
//                                             {!lesson.isPrivate  ? <Globe className="h-3 w-3" /> : <School className="h-3 w-3" />}
//                                             {!lesson.isPrivate  ? 'Curriculum Bank' : 'Institutional Edit'}
//                                         </span>
//                                     </td>
//                                     <td className="px-10 py-8 text-right">
//                                         <button className="h-12 w-12 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-center hover:bg-school-primary hover:text-school-secondary-950 transition-all shadow-lg group-hover:scale-110">
//                                             <Eye className="h-5 w-5" />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                             {filteredLessons.length === 0 && (
//                                 <tr>
//                                     <td colSpan={4} className="py-32 text-center">
//                                         <div className="flex flex-col items-center gap-2 opacity-20">
//                                             <Search className="h-10 w-10 text-slate-500" />
//                                             <p className="text-slate-500 font-black uppercase text-xs tracking-[0.3em]">No_Vault_Matches_Found</p>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             <footer className="max-w-4xl mx-auto flex items-start gap-4 text-slate-600 opacity-60 hover:opacity-100 transition-opacity pb-20">
//                 <InfoIcon className="h-5 w-5 shrink-0 mt-0.5" />
//                 <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed italic">
//                     The Lesson Bank synchronizes with the National Curriculum Registry. Institutional edits represent localized adjustments made by your staff to meet specific student needs. All data is synchronized in real-time.
//                 </p>
//             </footer>
//         </div>
//     )
// }

// function InfoIcon({ className }: { className?: string }) {
//     return (
//         <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//     )
// }




'use client'

import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    Zap, 
    MessageSquare, 
    Loader2,
    type LucideIcon // ✅ Added LucideIcon type
} from "lucide-react"
import { useProfileStore } from "@/store/profileStore"
import { 
    GradeDistributionChart, 
    AssessmentScoresChart, 
    StatusDistributionChart,
    CommunicationTrendChart,
    AcademicContentHealth 
} from "@/components/admin-dasboard/analitcs-charts"
import { UnassignedStudentsAlert } from "@/components/admin-dasboard/unassigned-students-alert"
import { Card, CardContent } from "@/components/ui/card"

export default function AnalyticsReportsPage() {
    const { profile, isLoading } = useProfileStore()

    if (isLoading || !profile) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
                <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">
                    Generating_Analytical_Models...
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50">
            
            {/* ── Page Header ── */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl shadow-school-primary/10">
                        <BarChart3 className="h-7 w-7 text-school-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">
                            Institutional Insights
                        </h1>
                        <p className="text-slate-500 text-sm mt-2 font-medium">
                            Real-time data visualization of academic and operational performance.
                        </p>
                    </div>
                </div>

                <div className="hidden xl:flex items-center gap-3 bg-slate-900 px-5 py-2.5 rounded-2xl border border-white/5 shadow-xl">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">
                        Data synchronized successfully
                    </span>
                </div>
            </header>

            {/* ── Main Analytics Grid ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Left Column: Primary Charts */}
                <div className="xl:col-span-2 space-y-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GradeDistributionChart />
                        <AssessmentScoresChart />
                    </div>

                    <CommunicationTrendChart />

                    <UnassignedStudentsAlert />
                </div>

                {/* Right Column: Sidebars */}
                <div className="space-y-8">
                    
                    <StatusDistributionChart />

                    <AcademicContentHealth />

                    {/* Quick Stats Sidebar */}
                    <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-slate-950/50">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Quick Metrics</h4>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <MetricItem 
                                icon={Users} 
                                label="Total Registry" 
                                // ✅ FIX: Cast to 'any' temporarily if interface isn't updated, 
                                // but safe-access the length property.
                                value={profile.school?.users?.length ?? 0} 
                                sub="Total active accounts" 
                            />
                            <MetricItem 
                                icon={MessageSquare} 
                                label="Comms Balance" 
                                value={profile.school?.whatsappCredits ?? 0} 
                                sub="Available WhatsApp units" 
                            />
                            <MetricItem 
                                icon={Zap} 
                                label="AI Generation" 
                                value="Automated" 
                                sub="Planner status: Active" 
                            />
                        </CardContent>
                    </Card>

                    <div className="p-6 rounded-[2rem] bg-school-primary/5 border border-school-primary/10">
                        <p className="text-[10px] text-slate-500 leading-relaxed italic">
                            Report parameters are calculated based on the current academic term data stored in the database. Charts are refreshed automatically on page entry.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ✅ FIX: Defined specific interface for props to remove 'any' error
interface MetricItemProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    sub: string;
}

function MetricItem({ icon: Icon, label, value, sub }: MetricItemProps) {
    return (
        <div className="flex items-center gap-4 group cursor-default">
            <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 group-hover:border-school-primary/30 transition-all shadow-inner">
                <Icon className="h-5 w-5 text-slate-600 group-hover:text-school-primary transition-colors" />
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
                <p className="text-lg font-bold text-white leading-none mt-0.5">{value}</p>
                <p className="text-[9px] text-slate-600 mt-1">{sub}</p>
            </div>
        </div>
    )
}