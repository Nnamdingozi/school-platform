// "use client"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
//   LineChart,
//   Line,
// } from "recharts"

// // Student distribution by grade data
// const gradeDistributionData = [
//   { name: "JSS 1", value: 245, fill: "var(--chart-1)" },
//   { name: "JSS 2", value: 218, fill: "var(--chart-2)" },
//   { name: "JSS 3", value: 196, fill: "var(--chart-3)" },
//   { name: "SSS 1", value: 234, fill: "var(--chart-4)" },
//   { name: "SSS 2", value: 187, fill: "var(--chart-5)" },
//   { name: "SSS 3", value: 167, fill: "var(--chart-1)" },
// ]

// // Assessment scores by subject
// const assessmentScoresData = [
//   { subject: "Math", average: 72, highest: 95 },
//   { subject: "English", average: 78, highest: 92 },
//   { subject: "Science", average: 68, highest: 88 },
//   { subject: "Social St.", average: 81, highest: 94 },
//   { subject: "French", average: 65, highest: 89 },
// ]

// // Monthly enrollment trend
// const enrollmentTrendData = [
//   { month: "Sep", students: 1180 },
//   { month: "Oct", students: 1195 },
//   { month: "Nov", students: 1210 },
//   { month: "Dec", students: 1205 },
//   { month: "Jan", students: 1232 },
//   { month: "Feb", students: 1247 },
// ]

// // Student status distribution for pie chart
// const statusDistributionData = [
//   { name: "Active", value: 1142, fill: "var(--chart-2)" },
//   { name: "Inactive", value: 68, fill: "var(--muted-foreground)" },
//   { name: "Probation", value: 37, fill: "var(--chart-5)" },
// ]

// const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; payload?: { fill?: string } }>; label?: string }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="rounded-lg border bg-card p-3 shadow-lg">
//         <p className="text-sm font-medium text-foreground">{label}</p>
//         {payload.map((entry, index) => (
//           <p key={index} className="text-sm text-muted-foreground">
//             {entry.name}: <span className="font-semibold text-foreground">{entry.value}</span>
//           </p>
//         ))}
//       </div>
//     )
//   }
//   return null
// }

// const PieTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload?: { fill?: string } }> }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="rounded-lg border bg-card p-3 shadow-lg">
//         <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
//         <p className="text-sm text-muted-foreground">
//           Students: <span className="font-semibold text-foreground">{payload[0].value}</span>
//         </p>
//       </div>
//     )
//   }
//   return null
// }

// export function GradeDistributionChart() {
//   return (
//     <Card>
//       <CardHeader className="pb-2">
//         <CardTitle className="text-base font-semibold text-foreground">Students by Grade</CardTitle>
//         <CardDescription>Distribution across all grade levels</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-[280px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={gradeDistributionData}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={60}
//                 outerRadius={100}
//                 paddingAngle={2}
//                 dataKey="value"
//                 stroke="none"
//               >
//                 {gradeDistributionData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.fill} />
//                 ))}
//               </Pie>
//               <Tooltip content={<PieTooltip />} />
//               <Legend 
//                 verticalAlign="bottom" 
//                 height={36}
//                 formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
//               />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// export function StatusDistributionChart() {
//   const total = statusDistributionData.reduce((sum, item) => sum + item.value, 0)
  
//   return (
//     <Card>
//       <CardHeader className="pb-2">
//         <CardTitle className="text-base font-semibold text-foreground">Student Status</CardTitle>
//         <CardDescription>Current enrollment status breakdown</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-[200px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={statusDistributionData}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={50}
//                 outerRadius={75}
//                 paddingAngle={3}
//                 dataKey="value"
//                 stroke="none"
//               >
//                 {statusDistributionData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.fill} />
//                 ))}
//               </Pie>
//               <Tooltip content={<PieTooltip />} />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="mt-2 flex justify-center gap-4">
//           {statusDistributionData.map((item) => (
//             <div key={item.name} className="flex items-center gap-2">
//               <div 
//                 className="h-3 w-3 rounded-full" 
//                 style={{ backgroundColor: item.fill }}
//               />
//               <span className="text-xs text-muted-foreground">
//                 {item.name} ({Math.round((item.value / total) * 100)}%)
//               </span>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// export function AssessmentScoresChart() {
//   return (
//     <Card>
//       <CardHeader className="pb-2">
//         <CardTitle className="text-base font-semibold text-foreground">Assessment Performance</CardTitle>
//         <CardDescription>Average and highest scores by subject</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-[280px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={assessmentScoresData} barGap={4}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
//               <XAxis 
//                 dataKey="subject" 
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
//               />
//               <YAxis 
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
//                 domain={[0, 100]}
//               />
//               <Tooltip content={<CustomTooltip />} />
//               <Legend 
//                 verticalAlign="top" 
//                 height={36}
//                 formatter={(value) => <span className="text-xs text-muted-foreground capitalize">{value}</span>}
//               />
//               <Bar 
//                 dataKey="average" 
//                 fill="var(--chart-1)" 
//                 radius={[4, 4, 0, 0]}
//                 name="Average Score"
//               />
//               <Bar 
//                 dataKey="highest" 
//                 fill="var(--chart-2)" 
//                 radius={[4, 4, 0, 0]}
//                 name="Highest Score"
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// export function EnrollmentTrendChart() {
//   return (
//     <Card>
//       <CardHeader className="pb-2">
//         <CardTitle className="text-base font-semibold text-foreground">Enrollment Trend</CardTitle>
//         <CardDescription>Student enrollment over the current academic year</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-[200px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={enrollmentTrendData}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
//               <XAxis 
//                 dataKey="month" 
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
//               />
//               <YAxis 
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
//                 domain={['dataMin - 20', 'dataMax + 20']}
//               />
//               <Tooltip content={<CustomTooltip />} />
//               <Line 
//                 type="monotone" 
//                 dataKey="students" 
//                 stroke="var(--chart-1)" 
//                 strokeWidth={2}
//                 dot={{ fill: "var(--chart-1)", strokeWidth: 2 }}
//                 activeDot={{ r: 6, fill: "var(--chart-1)" }}
//                 name="Students"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useProfileStore } from "@/store/profileStore"
import { getAnalyticsData, AnalyticsData } from "@/app/actions/analytics.action"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    PieChart, Pie, Cell, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend,
} from "recharts"

import {  AreaChart, Area } from "recharts"

// ── Chart colors using school-primary shades ───────────────────────────────────
const CHART_COLORS = [
    'var(--color-school-primary)',
    'var(--color-school-primary-600)',
    'var(--color-school-primary-300)',
    'var(--color-school-primary-800)',
    'var(--color-school-primary-100)',
    'var(--color-school-primary-900)',
]

// ── Shared hook ────────────────────────────────────────────────────────────────
function useAnalytics() {
    const { profile }  = useProfileStore()
    const schoolId     = profile?.schoolId ?? ''
    const [data,    setData]    = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!schoolId) return
        setLoading(true)
        getAnalyticsData(schoolId)
            .then(d => { setData(d); setLoading(false) })
            .catch(() => setLoading(false))
    }, [schoolId])

    return { data, loading }
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
function ChartSkeleton({ height = 280 }: { height?: number }) {
    return (
        <div
            className="w-full rounded-xl bg-gray-100 animate-pulse"
            style={{ height }}
        />
    )
}

// ── Empty ──────────────────────────────────────────────────────────────────────
function ChartEmpty({ message }: { message: string }) {
    return (
        <div className="flex items-center justify-center h-full text-center p-4">
            <p className="text-xs text-gray-400">{message}</p>
        </div>
    )
}

// ── Custom Tooltips ────────────────────────────────────────────────────────────
function CustomTooltip({
    active, payload, label,
}: {
    active?:  boolean
    payload?: { name: string; value: number }[]
    label?:   string
}) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
            {label && <p className="text-xs font-semibold text-gray-700 mb-1">{label}</p>}
            {payload.map((entry, i) => (
                <p key={i} className="text-xs text-gray-500">
                    {entry.name}:{' '}
                    <span className="font-bold text-gray-800">{entry.value}</span>
                </p>
            ))}
        </div>
    )
}

function PieTooltip({
    active, payload,
}: {
    active?:  boolean
    payload?: { name: string; value: number }[]
}) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
            <p className="text-xs font-semibold text-gray-700">{payload[0].name}</p>
            <p className="text-xs text-gray-500">
                Students:{' '}
                <span className="font-bold text-gray-800">{payload[0].value}</span>
            </p>
        </div>
    )
}

// ── Grade Distribution Chart ───────────────────────────────────────────────────
export function GradeDistributionChart() {
    const { data, loading } = useAnalytics()

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-foreground">
                    Students by Grade
                </CardTitle>
                <CardDescription>Distribution across all grade levels</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[280px]">
                    {loading ? (
                        <ChartSkeleton height={280} />
                    ) : !data?.gradeDistribution.length ? (
                        <ChartEmpty message="No grade data available yet." />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.gradeDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.gradeDistribution.map((_, i) => (
                                        <Cell
                                            key={`cell-${i}`}
                                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<PieTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={value => (
                                        <span className="text-xs text-gray-500">{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

// ── Status Distribution Chart ──────────────────────────────────────────────────
export function StatusDistributionChart() {
    const { data, loading } = useAnalytics()

    const total = data?.statusDistribution.reduce((s, i) => s + i.value, 0) ?? 0

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-foreground">
                    Student Status
                </CardTitle>
                <CardDescription>Current enrollment status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[200px]">
                    {loading ? (
                        <ChartSkeleton height={200} />
                    ) : !data?.statusDistribution.length ? (
                        <ChartEmpty message="No status data available yet." />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={75}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.statusDistribution.map((_, i) => (
                                        <Cell
                                            key={`cell-${i}`}
                                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<PieTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Legend */}
                {!loading && !!data?.statusDistribution.length && (
                    <div className="mt-2 flex justify-center gap-4 flex-wrap">
                        {data.statusDistribution.map((item, i) => (
                            <div key={item.name} className="flex items-center gap-1.5">
                                <div
                                    className="h-2.5 w-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                                />
                                <span className="text-xs text-gray-500">
                                    {item.name}{' '}
                                    <span className="font-semibold text-gray-700">
                                        ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// ── Assessment Scores Chart ────────────────────────────────────────────────────
export function AssessmentScoresChart() {
    const { data, loading } = useAnalytics()

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-foreground">
                    Assessment Performance
                </CardTitle>
                <CardDescription>Average and highest scores by subject</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[280px]">
                    {loading ? (
                        <ChartSkeleton height={280} />
                    ) : !data?.assessmentScores.length ? (
                        <ChartEmpty message="No assessment data available yet." />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data.assessmentScores}
                                barGap={4}
                                margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="var(--border)"
                                />
                                <XAxis
                                    dataKey="subject"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                                    domain={[0, 100]}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="top"
                                    height={32}
                                    formatter={value => (
                                        <span className="text-xs text-gray-500 capitalize">
                                            {value}
                                        </span>
                                    )}
                                />
                                <Bar
                                    dataKey="average"
                                    fill="var(--color-school-primary)"
                                    radius={[4, 4, 0, 0]}
                                    name="Average Score"
                                />
                                <Bar
                                    dataKey="highest"
                                    fill="var(--color-school-primary-300)"
                                    radius={[4, 4, 0, 0]}
                                    name="Highest Score"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}




// ── NEW: Communication Trends Chart ───────────────────────────────────────────
export function CommunicationTrendChart() {
    const { data, loading } = useAnalytics()

    return (
        <Card className="bg-slate-900 border-white/5 shadow-2xl">
            <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-white italic">Messaging Reach</CardTitle>
                <CardDescription className="text-[10px] uppercase text-slate-500">WhatsApp alerts sent over last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[200px]">
                    {loading ? <ChartSkeleton height={200} /> : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.communicationTrend}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-school-primary)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--color-school-primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="var(--color-school-primary)" 
                                    fillOpacity={1} 
                                    fill="url(#colorCount)" 
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

// ── NEW: Academic Content Coverage ───────────────────────────────────────────
export function AcademicContentHealth() {
    const { data, loading } = useAnalytics()
    
    if (loading || !data) return <ChartSkeleton height={150} />

    const h = data.contentHealth
    const lessonPct = h.totalTopics > 0 ? Math.round((h.withLessons / h.totalTopics) * 100) : 0
    const quizPct = h.withLessons > 0 ? Math.round((h.withQuizzes / h.withLessons) * 100) : 0

    return (
        <Card className="bg-slate-900 border-white/5">
            <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-white italic">Registry Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>AI Lesson Generation</span>
                        <span className="text-school-primary">{lessonPct}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-school-primary transition-all" style={{ width: `${lessonPct}%` }} />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>Quiz Engagement</span>
                        <span className="text-school-primary">{quizPct}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-school-primary-300 transition-all" style={{ width: `${quizPct}%` }} />
                    </div>
                </div>
                
                <p className="text-[9px] text-slate-500 italic">This reflects the percentage of topics with active AI content.</p>
            </CardContent>
        </Card>
    )
}