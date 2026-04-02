// 'use client'

// import { 
//     BarChart3, 
//     TrendingUp, 
//     Users, 
//     Zap, 
//     MessageSquare, 
//     Loader2, 
    
// } from "lucide-react"
// import { useProfileStore } from "@/store/profileStore"
// import { 
//     GradeDistributionChart, 
//     AssessmentScoresChart, 
//     StatusDistributionChart,
//     CommunicationTrendChart,
//     AcademicContentHealth 
// } from "@/components/admin-dasboard/analitcs-charts"
// import { UnassignedStudentsAlert } from "@/components/admin-dasboard/unassigned-students-alert"
// import { Card, CardContent } from "@/components/ui/card"

// export default function AnalyticsReportsPage() {
//     const { profile, isLoading } = useProfileStore()

//     if (isLoading || !profile) {
//         return (
//             <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
//                 <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//                 <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">
//                     Generating_Analytical_Models...
//                 </p>
//             </div>
//         )
//     }

//     return (
//         <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50">
            
//             {/* ── Page Header ── */}
//             <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//                 <div className="flex items-center gap-5">
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl shadow-school-primary/10">
//                         <BarChart3 className="h-7 w-7 text-school-primary" />
//                     </div>
//                     <div>
//                         <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">
//                             Institutional Insights
//                         </h1>
//                         <p className="text-slate-500 text-sm mt-2 font-medium">
//                             Real-time data visualization of academic and operational performance.
//                         </p>
//                     </div>
//                 </div>

//                 <div className="hidden xl:flex items-center gap-3 bg-slate-900 px-5 py-2.5 rounded-2xl border border-white/5 shadow-xl">
//                     <TrendingUp className="h-4 w-4 text-emerald-500" />
//                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">
//                         Data synchronized successfully
//                     </span>
//                 </div>
//             </header>

//             {/* ── Main Analytics Grid ── */}
//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
//                 {/* Left Column: Primary Charts */}
//                 <div className="xl:col-span-2 space-y-8">
                    
//                     {/* Performance Overview */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <GradeDistributionChart />
//                         <AssessmentScoresChart />
//                     </div>

//                     {/* Operational Activity (New) */}
//                     <CommunicationTrendChart />

//                     {/* Registry Alerts */}
//                     <UnassignedStudentsAlert />
//                 </div>

//                 {/* Right Column: Health & Status Sidebars */}
//                 <div className="space-y-8">
                    
//                     {/* Enrollment Status */}
//                     <StatusDistributionChart />

//                     {/* Content Registry Health (New) */}
//                     <AcademicContentHealth />

//                     {/* Quick Stats Sidebar */}
//                     <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden">
//                         <div className="p-6 border-b border-white/5 bg-slate-950/50">
//                             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Quick Metrics</h4>
//                         </div>
//                         <CardContent className="p-6 space-y-6">
//                             <MetricItem 
//                                 icon={Users} 
//                                 label="Total Registry" 
//                                 value={profile.school?.users?.length || 0} 
//                                 sub="Total active accounts" 
//                             />
//                             <MetricItem 
//                                 icon={MessageSquare} 
//                                 label="Comms Balance" 
//                                 value={profile.school?.whatsappCredits || 0} 
//                                 sub="Available WhatsApp units" 
//                             />
//                             <MetricItem 
//                                 icon={Zap} 
//                                 label="AI Generation" 
//                                 value="Automated" 
//                                 sub="Planner status: Active" 
//                             />
//                         </CardContent>
//                     </Card>

//                     {/* Help Note */}
//                     <div className="p-6 rounded-[2rem] bg-school-primary/5 border border-school-primary/10">
//                         <p className="text-[10px] text-slate-500 leading-relaxed italic">
//                             Report parameters are calculated based on the current academic term data stored in the database. Charts are refreshed automatically on page entry.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// function MetricItem({ icon: Icon, label, value, sub }: { icon: any, label: string, value: string | number, subText?: string, sub: string }) {
//     return (
//         <div className="flex items-center gap-4 group cursor-default">
//             <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 group-hover:border-school-primary/30 transition-all shadow-inner">
//                 <Icon className="h-5 w-5 text-slate-600 group-hover:text-school-primary transition-colors" />
//             </div>
//             <div>
//                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
//                 <p className="text-lg font-bold text-white leading-none mt-0.5">{value}</p>
//                 <p className="text-[9px] text-slate-600 mt-1">{sub}</p>
//             </div>
//         </div>
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
    type LucideIcon 
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
                <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse text-center">
                    Generating_Analytical_Models...
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50 font-sans">
            
            {/* ── Page Header ── */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
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

                <div className="hidden xl:flex items-center gap-3 bg-slate-900 px-5 py-2.5 rounded-2xl border border-white/5 shadow-xl shadow-black/20">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">
                        Registry Synchronized
                    </span>
                </div>
            </header>

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

                {/* Right Column: Health & Status Sidebars */}
                <div className="space-y-8">
                    <StatusDistributionChart />
                    <AcademicContentHealth />

                    {/* Quick Stats Sidebar */}
                    <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 bg-slate-950/50">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Quick Metrics</h4>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <MetricItem 
                                icon={Users} 
                                label="Total Registry" 
                                // ✅ No more any cast. TypeScript knows .users exists.
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
                            Report parameters are calculated based on the current academic term data stored in the database.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── Strict Interface for Sub-Component ──

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
                <p className="text-[9px] text-slate-600 mt-1 uppercase tracking-tighter">{sub}</p>
            </div>
        </div>
    )
}