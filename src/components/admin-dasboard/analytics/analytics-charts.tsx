'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    type TooltipProps,
} from 'recharts'
import { cn } from '@/lib/utils'
import {
    type GradeDistributionItem,
    type AssessmentScoreItem,
    type StatusDistributionItem,
    type CommunicationTrendItem,
    type ContentHealthData,
} from '@/app/actions/analytics.action'

/** Brand-aligned fills — derived from CSS custom properties, not inline hex */
const CHART_FILLS = [
    'var(--color-school-primary)',
    'var(--color-school-primary-300)',
    'var(--color-school-primary-600)',
    'var(--color-school-primary-200)',
    'var(--color-school-primary-800)',
    'var(--color-school-primary-400)',
] as const

const AXIS_TICK = { fill: 'var(--muted-foreground)', fontSize: 10 }
const GRID_STROKE = 'var(--border)'

interface AnalyticsChartCardProps {
    title: string
    description?: string
    children: React.ReactNode
    className?: string
    contentClassName?: string
}

function AnalyticsChartCard({
    title,
    description,
    children,
    className,
    contentClassName,
}: AnalyticsChartCardProps) {
    return (
        <Card
            className={cn(
                'bg-card border-border rounded-[2.5rem] overflow-hidden shadow-2xl',
                className,
            )}
        >
            <CardHeader className="p-8 border-b border-border bg-background/50">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-foreground italic">
                    {title}
                </CardTitle>
                {description && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </CardHeader>
            <CardContent className={cn('p-8', contentClassName)}>{children}</CardContent>
        </Card>
    )
}

function ChartEmpty({ message }: { message: string }) {
    return (
        <div className="flex h-full min-h-[180px] items-center justify-center p-6 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                {message}
            </p>
        </div>
    )
}

type TooltipPayload = { name?: string; value?: number }

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl border border-border bg-card p-3 shadow-lg">
            {label && (
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground mb-1">
                    {label}
                </p>
            )}
            {payload.map((entry, i) => (
                <p key={i} className="text-[10px] text-muted-foreground">
                    {entry.name}:{' '}
                    <span className="font-bold text-foreground">{entry.value}</span>
                </p>
            ))}
        </div>
    )
}

function PieTooltip({ active, payload }: TooltipProps<number, string>) {
    if (!active || !payload?.length) return null
    const entry = payload[0] as TooltipPayload
    return (
        <div className="rounded-xl border border-border bg-card p-3 shadow-lg">
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground">
                {entry.name}
            </p>
            <p className="text-[10px] text-muted-foreground">
                Count: <span className="font-bold text-foreground">{entry.value}</span>
            </p>
        </div>
    )
}

interface GradeDistributionChartProps {
    data: GradeDistributionItem[]
}

export function GradeDistributionChart({ data }: GradeDistributionChartProps) {
    return (
        <AnalyticsChartCard title="Demographic Spread" contentClassName="h-[300px]">
            {!data.length ? (
                <ChartEmpty message="No demographic data available yet." />
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((_, i) => (
                                <Cell key={i} fill={CHART_FILLS[i % CHART_FILLS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </AnalyticsChartCard>
    )
}

interface AssessmentScoresChartProps {
    data: AssessmentScoreItem[]
}

export function AssessmentScoresChart({ data }: AssessmentScoresChartProps) {
    return (
        <AnalyticsChartCard title="Subject Proficiency" contentClassName="h-[300px]">
            {!data.length ? (
                <ChartEmpty message="No assessment data available yet." />
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_STROKE} />
                        <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={AXIS_TICK} />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={AXIS_TICK}
                            domain={[0, 100]}
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar
                            dataKey="average"
                            fill="var(--color-school-primary)"
                            radius={[6, 6, 0, 0]}
                            name="Average Score"
                        />
                        <Bar
                            dataKey="highest"
                            fill="var(--color-school-primary-300)"
                            radius={[6, 6, 0, 0]}
                            name="Highest Score"
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </AnalyticsChartCard>
    )
}

interface CommunicationTrendChartProps {
    data: CommunicationTrendItem[]
}

export function CommunicationTrendChart({ data }: CommunicationTrendChartProps) {
    return (
        <AnalyticsChartCard
            title="Transmission Velocity"
            description="WhatsApp alerts — last 7 days"
            contentClassName="h-[250px]"
        >
            {!data.length ? (
                <ChartEmpty message="No transmission data available yet." />
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="transmissionArea" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-school-primary)"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-school-primary)"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_STROKE} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={AXIS_TICK} />
                        <YAxis hide />
                        <Tooltip content={<ChartTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="var(--color-school-primary)"
                            fill="url(#transmissionArea)"
                            strokeWidth={3}
                            name="Messages"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </AnalyticsChartCard>
    )
}

interface StatusDistributionChartProps {
    data: StatusDistributionItem[]
}

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
    const total = data.reduce((sum, item) => sum + item.value, 0)

    return (
        <AnalyticsChartCard title="Enrollment Status" contentClassName="space-y-6">
            {!data.length ? (
                <ChartEmpty message="No enrollment status data available yet." />
            ) : (
                <>
                    <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((_, i) => (
                                        <Cell key={i} fill={CHART_FILLS[i % CHART_FILLS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<PieTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {data.map((item, i) => (
                            <div
                                key={item.name}
                                className="bg-background p-3 rounded-xl border border-border"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className="h-2 w-2 rounded-full shrink-0"
                                        style={{ backgroundColor: CHART_FILLS[i % CHART_FILLS.length] }}
                                    />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        {item.name}
                                    </p>
                                </div>
                                <p className="text-lg font-bold text-foreground italic leading-none">
                                    {item.value}
                                    <span className="text-[10px] text-muted-foreground ml-1 not-italic">
                                        ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </AnalyticsChartCard>
    )
}

interface AcademicContentHealthProps {
    data: ContentHealthData
}

export function AcademicContentHealth({ data }: AcademicContentHealthProps) {
    const lessonPct =
        data.totalTopics > 0 ? Math.round((data.withLessons / data.totalTopics) * 100) : 0
    const quizPct =
        data.withLessons > 0 ? Math.round((data.withQuizzes / data.withLessons) * 100) : 0

    return (
        <AnalyticsChartCard title="Curriculum Health" contentClassName="space-y-8">
            <ProgressItem label="AI Lesson Synthesis" pct={lessonPct} variant="primary" />
            <ProgressItem label="Quiz Registry Coverage" pct={quizPct} variant="secondary" />
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter italic">
                Percentage of topics with active academic nodes.
            </p>
        </AnalyticsChartCard>
    )
}

interface ProgressItemProps {
    label: string
    pct: number
    variant: 'primary' | 'secondary'
}

function ProgressItem({ label, pct, variant }: ProgressItemProps) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-school-primary">{pct}%</span>
            </div>
            <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border">
                <div
                    className={cn(
                        'h-full transition-all duration-1000',
                        variant === 'primary' ? 'bg-school-primary' : 'bg-school-primary/60',
                    )}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    )
}
