// 'use client'

// import { BarChart3, TrendingUp, Users, Zap, MessageSquare } from "lucide-react"
// import { useProfileStore } from "@/store/profileStore"
// import { 
//     GradeDistributionChart, 
//     AssessmentScoresChart, 
//     StatusDistributionChart,
//     CommunicationTrendChart,
//     AcademicContentHealth 
// } from "./analytics-charts"
// import { UnassignedStudentsAlert } from "./unassigned-students-alert"
// import { Card, CardContent } from "@/components/ui/card"
// import { type AnalyticsData, type UnassignedStudentsData } from "@/app/actions/analytics.action"

// interface AnalyticsClientProps {
//     initialData: AnalyticsData | null;
//     unassignedData: UnassignedStudentsData | null;
//     userCount: number;
//     whatsappCredits: number;
// }

// /**
//  * INSTITUTIONAL INSIGHTS CONSOLE (Tier 2)
//  * Rule 17: Injects school branding from Zustand.
//  */
// export function AnalyticsDashboardClient({ initialData, unassignedData, userCount, whatsappCredits }: AnalyticsClientProps) {
//     const { profile } = useProfileStore();
//     const primaryColor = profile?.primaryColor || "#f59e0b";

//     if (!initialData) return <div className="p-20 text-center text-slate-500 uppercase font-black italic">Registry Data Offline</div>;

//     return (
//         <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50 animate-in fade-in duration-700">
            
//             <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//                 <div className="flex items-center gap-5">
//                     <div 
//                         className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
//                         style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
//                     >
//                         <BarChart3 className="h-7 w-7" style={{ color: primaryColor }} />
//                     </div>
//                     <div>
//                         <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Institutional Insights</h1>
//                         <p className="text-slate-500 text-sm mt-2 font-medium italic">Data visualization for {profile?.school?.name || "Registry"}.</p>
//                     </div>
//                 </div>

//                 <div className="hidden xl:flex items-center gap-3 bg-slate-900 px-5 py-2.5 rounded-2xl border border-white/5 shadow-xl">
//                     <TrendingUp className="h-4 w-4 text-emerald-500" />
//                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Real-time Sync Active</span>
//                 </div>
//             </header>

//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//                 <div className="xl:col-span-2 space-y-8">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <GradeDistributionChart data={initialData.gradeDistribution} />
//                         <AssessmentScoresChart data={initialData.assessmentScores} />
//                     </div>
//                     <CommunicationTrendChart data={initialData.communicationTrend} />
//                     <UnassignedStudentsAlert initialData={unassignedData} />
//                 </div>

//                 <div className="space-y-8">
//                     <StatusDistributionChart data={initialData.statusDistribution} />
//                     <AcademicContentHealth data={initialData.contentHealth} />

//                     <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
//                         <div className="p-6 border-b border-white/5 bg-slate-950/50 text-center">
//                             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Vital Metrics</h4>
//                         </div>
//                         <CardContent className="p-8 space-y-8">
//                             <MetricItem icon={Users} label="Institutional Population" value={userCount} sub="Total provisioned accounts" primaryColor={primaryColor} />
//                             <MetricItem icon={MessageSquare} label="Transmission Reserve" value={whatsappCredits} sub="Available WhatsApp units" primaryColor={primaryColor} />
//                             <MetricItem icon={Zap} label="Synthesis Engine" value="ONLINE" sub="AI Generation Active" primaryColor={primaryColor} />
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     )
// }

// function MetricItem({ icon: Icon, label, value, sub, primaryColor }: { icon: any, label: string, value: string | number, sub: string, primaryColor: string }) {
//     return (
//         <div className="flex items-center gap-5 group cursor-default">
//             <div className="h-12 w-12 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 group-hover:border-school-primary/30 transition-all">
//                 <Icon className="h-6 w-6 text-slate-600 group-hover:text-school-primary" style={{ color: primaryColor }} />
//             </div>
//             <div>
//                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
//                 <p className="text-xl font-bold text-white leading-none mt-1">{value}</p>
//                 <p className="text-[9px] text-slate-600 mt-1 italic">{sub}</p>
//             </div>
//         </div>
//     )
// }

// 'use client'

// import { BarChart3, TrendingUp, Users, Zap, MessageSquare } from "lucide-react"
// import { useProfileStore } from "@/store/profileStore"
// import { 
//     GradeDistributionChart, 
//     AssessmentScoresChart, 
//     StatusDistributionChart,
//     CommunicationTrendChart,
//     AcademicContentHealth 
// } from "./analytics-charts"
// import { UnassignedStudentsAlert } from "./unassigned-students-alert"
// import { Card, CardContent } from "@/components/ui/card"
// import { type AnalyticsData, type UnassignedStudentsData } from "@/app/actions/analytics.action"

// interface AnalyticsClientProps {
//     initialData: AnalyticsData | null;
//     unassignedData: UnassignedStudentsData | null;
//     userCount: number;
//     whatsappCredits: number;
// }

// /**
//  * INSTITUTIONAL INSIGHTS CONSOLE (Tier 2)
//  * Rule 12: Receives server-fetched data as props to eliminate loading flickers.
//  * Rule 17: Injects school branding from Zustand store.
//  */
// export function AnalyticsDashboardClient({ 
//     initialData, 
//     unassignedData, 
//     userCount, 
//     whatsappCredits 
// }: AnalyticsClientProps) {
//     const { profile } = useProfileStore();
//     const primaryColor = profile?.primaryColor || "#f59e0b";

//     if (!initialData) return (
//         <div className="p-20 text-center text-slate-600 uppercase font-black italic tracking-widest">
//             Registry Sync Failure: Data Offline
//         </div>
//     );

//     return (
//         <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50 animate-in fade-in duration-700">
            
//             {/* ── HEADER ── */}
//             <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//                 <div className="flex items-center gap-5">
//                     <div 
//                         className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
//                         style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
//                     >
//                         <BarChart3 className="h-7 w-7" style={{ color: primaryColor }} />
//                     </div>
//                     <div>
//                         <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
//                             Institutional Insights
//                         </h1>
//                         <p className="text-slate-500 text-sm mt-2 font-medium italic">
//                             Operational intelligence for {profile?.school?.name || "Institution"}.
//                         </p>
//                     </div>
//                 </div>

//                 <div className="hidden xl:flex items-center gap-3 bg-slate-900 px-5 py-2.5 rounded-2xl border border-white/5 shadow-xl">
//                     <TrendingUp className="h-4 w-4 text-emerald-500" />
//                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">
//                         Real-time Telemetry Active
//                     </span>
//                 </div>
//             </header>

//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
//                 {/* ── PRIMARY ANALYTICS (Left) ── */}
//                 <div className="xl:col-span-2 space-y-8">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <GradeDistributionChart data={initialData.gradeDistribution} />
//                         <AssessmentScoresChart data={initialData.assessmentScores} />
//                     </div>
//                     <CommunicationTrendChart data={initialData.communicationTrend} />
                    
//                     {/* ✅ FIXED: Correct prop name to match component definition below */}
//                     <UnassignedStudentsAlert initialData={unassignedData} />
//                 </div>

//                 {/* ── SECONDARY METRICS (Right) ── */}
//                 <div className="space-y-8">
//                     <StatusDistributionChart data={initialData.statusDistribution} />
//                     <AcademicContentHealth data={initialData.contentHealth} />

//                     <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
//                         <div className="p-6 border-b border-white/5 bg-slate-950/50 text-center">
//                             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Institutional Vitals</h4>
//                         </div>
//                         <CardContent className="p-8 space-y-8">
//                             <MetricItem 
//                                 icon={Users} 
//                                 label="Total Registry" 
//                                 value={userCount} 
//                                 sub="Provisioned Identity Count" 
//                                 primaryColor={primaryColor} 
//                             />
//                             <MetricItem 
//                                 icon={MessageSquare} 
//                                 label="Comms Reserve" 
//                                 value={whatsappCredits} 
//                                 sub="Available WhatsApp Units" 
//                                 primaryColor={primaryColor} 
//                             />
//                             <MetricItem 
//                                 icon={Zap} 
//                                 label="Synthesis Node" 
//                                 value="OPTIMAL" 
//                                 sub="AI Generation Engine Status" 
//                                 primaryColor={primaryColor} 
//                             />
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     )
// }

// function MetricItem({ 
//     icon: Icon, 
//     label, 
//     value, 
//     sub, 
//     primaryColor 
// }: { 
//     icon: any, 
//     label: string, 
//     value: string | number, 
//     sub: string, 
//     primaryColor: string 
// }) {
//     return (
//         <div className="flex items-center gap-5 group cursor-default">
//             <div className="h-12 w-12 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 group-hover:border-school-primary/30 transition-all">
//                 <Icon className="h-6 w-6 text-slate-600 group-hover:text-school-primary" style={{ color: primaryColor }} />
//             </div>
//             <div>
//                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
//                 <p className="text-xl font-bold text-white leading-none mt-1">{value}</p>
//                 <p className="text-[9px] text-slate-600 mt-1 italic">{sub}</p>
//             </div>
//         </div>
//     )
// }

'use client'

import { useState } from 'react'
import { 
    BarChart3, TrendingUp, Users, Zap, 
    MessageSquare, PieChart, ShieldAlert, History 
} from "lucide-react"
import { useProfileStore } from "@/store/profileStore"
import { 
    GradeDistributionChart, 
    AssessmentScoresChart, 
    StatusDistributionChart,
    CommunicationTrendChart,
    AcademicContentHealth 
} from "./AnalyticsCharts"
import { UnassignedStudentsAlert } from "./UnassignedStudentsAlert"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { type AnalyticsData, type UnassignedStudentsData } from "@/app/_actions/analytics-actions"

interface AnalyticsHubProps {
    initialData: AnalyticsData | null;
    unassignedData: UnassignedStudentsData | null;
    userCount: number;
    whatsappCredits: number;
}

/**
 * UNIFIED INSTITUTIONAL INTELLIGENCE HUB (Tier 2)
 * Rule 17: Branding via Zustand.
 * Rule 13: Consolidated view of institutional health.
 */
export function AnalyticsHubClient({ initialData, unassignedData, userCount, whatsappCredits }: AnalyticsHubProps) {
    const { profile } = useProfileStore();
    const [activeTab, setActiveTab] = useState<'visuals' | 'registry'>('visuals');
    const primaryColor = profile?.primaryColor || "#f59e0b";

    if (!initialData) return (
        <div className="p-20 text-center text-slate-600 uppercase font-black italic tracking-widest">
            Telemetry Sync Offline
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50 animate-in fade-in duration-700">
            
            {/* ── HEADER ── */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                <div className="flex items-center gap-5">
                    <div 
                        className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
                        style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
                    >
                        <BarChart3 className="h-7 w-7" style={{ color: primaryColor }} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Intelligence Hub</h1>
                        <p className="text-slate-500 text-sm mt-2 font-medium italic">Operational oversight for {profile?.school?.name || "Institution"}.</p>
                    </div>
                </div>

                {/* TAB SWITCHER */}
                <div className="flex p-1.5 bg-slate-900 rounded-2xl border border-white/5 shadow-inner">
                    <button 
                        onClick={() => setActiveTab('visuals')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'visuals' ? "bg-slate-950 text-white shadow-lg" : "text-slate-500 hover:text-white"
                        )}
                    >
                        <PieChart className="h-3.5 w-3.5" style={activeTab === 'visuals' ? { color: primaryColor } : {}} /> Data Visuals
                    </button>
                    <button 
                        onClick={() => setActiveTab('registry')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'registry' ? "bg-slate-950 text-white shadow-lg" : "text-slate-500 hover:text-white"
                        )}
                    >
                        <ShieldAlert className="h-3.5 w-3.5" style={activeTab === 'registry' ? { color: primaryColor } : {}} /> Registry Audit
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                
                {/* ── MAIN VIEWPORT (Left/Center) ── */}
                <div className="xl:col-span-2 space-y-8">
                    {activeTab === 'visuals' ? (
                        <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <GradeDistributionChart data={initialData.gradeDistribution} />
                                <AssessmentScoresChart data={initialData.assessmentScores} />
                            </div>
                            <CommunicationTrendChart data={initialData.communicationTrend} />
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-right-4 duration-500">
                            <UnassignedStudentsAlert initialData={unassignedData} />
                        </div>
                    )}
                </div>

                {/* ── VITAL METRICS (Right Sidebar) ── */}
                <div className="space-y-8">
                    <StatusDistributionChart data={initialData.statusDistribution} />
                    <AcademicContentHealth data={initialData.contentHealth} />

                    <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 bg-slate-950/50 text-center">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">System Registry Vitals</h4>
                        </div>
                        <CardContent className="p-8 space-y-8">
                            <MetricItem icon={Users} label="Total Identity Load" value={userCount} sub="Provisioned accounts" primaryColor={primaryColor} />
                            <MetricItem icon={MessageSquare} label="Transmission Units" value={whatsappCredits} sub="WhatsApp credit balance" primaryColor={primaryColor} />
                            <MetricItem icon={Zap} label="Synthesis Engine" value="STABLE" sub="AI Generation Active" primaryColor={primaryColor} />
                        </CardContent>
                    </Card>

                    <div className="p-8 rounded-[2rem] bg-slate-900 border border-white/5 shadow-inner">
                        <div className="flex items-center gap-3 mb-3">
                            <History className="h-4 w-4 text-slate-600" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol</span>
                        </div>
                        <p className="text-[10px] text-slate-600 leading-relaxed italic uppercase font-bold">
                            Data parameters are recalculated on session initialization. Detailed subject reports are available in the module management portal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MetricItem({ icon: Icon, label, value, sub, primaryColor }: { icon: any, label: string, value: string | number, sub: string, primaryColor: string }) {
    return (
        <div className="flex items-center gap-5 group cursor-default">
            <div className="h-12 w-12 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 group-hover:border-school-primary/30 transition-all">
                <Icon className="h-6 w-6 text-slate-600 group-hover:text-school-primary" style={{ color: primaryColor }} />
            </div>
            <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
                <p className="text-xl font-bold text-white leading-none mt-1 italic tracking-tighter truncate">{value}</p>
                <p className="text-[9px] text-slate-600 mt-1 uppercase tracking-tighter font-bold">{sub}</p>
            </div>
        </div>
    )
}