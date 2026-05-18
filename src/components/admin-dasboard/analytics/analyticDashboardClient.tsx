'use client'

import { useState } from 'react'
import {
    BarChart3,
    Users,
    Zap,
    MessageSquare,
    PieChart,
    ShieldAlert,
    History,
    type LucideIcon,
} from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import {
    GradeDistributionChart,
    AssessmentScoresChart,
    StatusDistributionChart,
    CommunicationTrendChart,
    AcademicContentHealth,
} from './analytics-charts'
import { UnassignedStudentsAlert } from './unassigned-students-alert'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
    type AnalyticsData,
    type UnassignedStudentsData,
} from '@/app/actions/analytics.action'

type AnalyticsTab = 'visuals' | 'registry'

interface AnalyticsHubProps {
    initialData: AnalyticsData | null
    unassignedData: UnassignedStudentsData | null
    userCount: number
    whatsappCredits: number
}

/**
 * UNIFIED INSTITUTIONAL INTELLIGENCE HUB (Tier 2)
 * Rule 12: Server-fetched data passed as props.
 * Rule 17: Branding via Zustand + school-primary design tokens.
 */
export function AnalyticsHubClient({
    initialData,
    unassignedData,
    userCount,
    whatsappCredits,
}: AnalyticsHubProps) {
    const { profile } = useProfileStore()
    const [activeTab, setActiveTab] = useState<AnalyticsTab>('visuals')

    if (!initialData) {
        return (
            <div className="p-20 text-center text-muted-foreground uppercase font-black italic tracking-widest">
                Telemetry Sync Offline
            </div>
        )
    }

    const schoolName = profile?.school?.name || 'Institution'

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 bg-background min-h-screen text-foreground animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-10">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl border border-school-primary/20 bg-school-primary/10 flex items-center justify-center shadow-2xl shadow-school-primary/10">
                        <BarChart3 className="h-7 w-7 text-school-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
                            Intelligence Hub
                        </h1>
                        <p className="text-muted-foreground text-sm mt-2 font-medium italic">
                            Operational oversight for {schoolName}.
                        </p>
                    </div>
                </div>

                <nav
                    className="flex p-1.5 bg-card rounded-2xl border border-border shadow-inner"
                    aria-label="Analytics view"
                >
                    <TabButton
                        active={activeTab === 'visuals'}
                        onClick={() => setActiveTab('visuals')}
                        icon={PieChart}
                        label="Data Visuals"
                    />
                    <TabButton
                        active={activeTab === 'registry'}
                        onClick={() => setActiveTab('registry')}
                        icon={ShieldAlert}
                        label="Registry Audit"
                    />
                </nav>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
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

                <aside className="space-y-8">
                    <StatusDistributionChart data={initialData.statusDistribution} />
                    <AcademicContentHealth data={initialData.contentHealth} />

                    <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-border bg-background/50 text-center">
                            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">
                                System Registry Vitals
                            </h4>
                        </div>
                        <CardContent className="p-8 space-y-8">
                            <MetricItem
                                icon={Users}
                                label="Total Identity Load"
                                value={userCount}
                                sub="Provisioned accounts"
                            />
                            <MetricItem
                                icon={MessageSquare}
                                label="Transmission Units"
                                value={whatsappCredits}
                                sub="WhatsApp credit balance"
                            />
                            <MetricItem
                                icon={Zap}
                                label="Synthesis Engine"
                                value="STABLE"
                                sub="AI Generation Active"
                            />
                        </CardContent>
                    </Card>

                    <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-inner">
                        <div className="flex items-center gap-3 mb-3">
                            <History className="h-4 w-4 text-muted-foreground" />
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                Protocol
                            </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed italic uppercase font-bold">
                            Data parameters are recalculated on session initialization. Detailed subject
                            reports are available in the module management portal.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    )
}

/** @deprecated Use AnalyticsHubClient — kept for import compatibility */
export const AnalyticsDashboardClient = AnalyticsHubClient

interface TabButtonProps {
    active: boolean
    onClick: () => void
    icon: LucideIcon
    label: string
}

function TabButton({ active, onClick, icon: Icon, label }: TabButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                'flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                active
                    ? 'bg-background text-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground',
            )}
        >
            <Icon className={cn('h-3.5 w-3.5', active && 'text-school-primary')} />
            {label}
        </button>
    )
}

interface MetricItemProps {
    icon: LucideIcon
    label: string
    value: string | number
    sub: string
}

function MetricItem({ icon: Icon, label, value, sub }: MetricItemProps) {
    return (
        <div className="flex items-center gap-5 group cursor-default">
            <div className="h-12 w-12 rounded-xl bg-background flex items-center justify-center border border-border group-hover:border-school-primary/30 transition-all">
                <Icon className="h-6 w-6 text-muted-foreground group-hover:text-school-primary transition-colors" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    {label}
                </p>
                <p className="text-xl font-bold text-foreground leading-none mt-1 italic tracking-tighter truncate">
                    {value}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter font-bold">
                    {sub}
                </p>
            </div>
        </div>
    )
}
