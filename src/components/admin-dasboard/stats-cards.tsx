// "use client"
// import { Users, GraduationCap, ClipboardCheck, MessageCircle, TrendingUp, TrendingDown } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"

// const stats = [
//   {
//     title: "Total Students",
//     value: "1,247",
//     change: "+12%",
//     trend: "up",
//     icon: Users,
//     description: "from last term",
//   },
//   {
//     title: "Active Teachers",
//     value: "68",
//     change: "+3",
//     trend: "up",
//     icon: GraduationCap,
//     description: "new this month",
//   },
//   {
//     title: "Assessment Completion",
//     value: "87.3%",
//     change: "+5.2%",
//     trend: "up",
//     icon: ClipboardCheck,
//     description: "vs last month",
//   },
//   {
//     title: "WhatsApp Feedback",
//     value: "342",
//     change: "-8%",
//     trend: "down",
//     icon: MessageCircle,
//     description: "sent this month",
//   },
// ]

// export function StatsCards() {
//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       {stats.map((stat) => {
//         const Icon = stat.icon
//         const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown

//         return (
//           <Card key={stat.title} className="relative overflow-hidden">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium text-muted-foreground">
//                     {stat.title}
//                   </p>
//                   <div className="flex items-baseline gap-2">
//                     <h3 className="text-3xl font-bold text-foreground tracking-tight">
//                       {stat.value}
//                     </h3>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <TrendIcon
//                       className={`h-3 w-3 ${
//                         stat.trend === "up" ? "text-accent" : "text-destructive"
//                       }`}
//                     />
//                     <span
//                       className={`text-xs font-medium ${
//                         stat.trend === "up" ? "text-accent" : "text-destructive"
//                       }`}
//                     >
//                       {stat.change}
//                     </span>
//                     <span className="text-xs text-muted-foreground">
//                       {stat.description}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
//                   <Icon className="h-6 w-6 text-primary" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }


// "use client"

// import { useMemo } from "react"
// import { Users, GraduationCap, ClipboardCheck, MessageCircle, TrendingUp, TrendingDown, Minus } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { useProfileStore } from "@/store/profileStore"
// import { useSchool } from "@/context/schoolProvider"

// export function StatsCards() {
//     const { profile } = useProfileStore()
//     const { school } = useSchool()

//     const stats = useMemo(() => {
//         if (!profile?.school) return null

//         const s = profile.school

//         // ── Total Students ─────────────────────────────────────────────────
//         // Count all profiles in the school with STUDENT role via classEnrollments
//         const totalStudents = s.classEnrollments?.length ?? 0

//         // ── Active Teachers ────────────────────────────────────────────────
//         // Count profiles with TEACHER role via taughtClasses (unique teachers)
//         const activeTeachers = new Set(
//             s.classes?.map((c: any) => c.teacherId) ?? []
//         ).size

//         // ── Assessment Completion ──────────────────────────────────────────
//         // Assessments with a score / total assessments = completion rate
//         const totalAssessments = s.assessments?.length ?? 0
//         const completedAssessments = s.assessments?.filter(
//             (a: any) => a.score !== null
//         ).length ?? 0
//         const completionRate = totalAssessments > 0
//             ? ((completedAssessments / totalAssessments) * 100).toFixed(1)
//             : "0.0"

//         // ── WhatsApp Feedback ──────────────────────────────────────────────
//         // Feedbacks with a sentAt date = actually sent via WhatsApp
//         const whatsappSent = s.feedbacks?.filter(
//             (f: any) => f.sentAt !== null
//         ).length ?? 0

//         return [
//             {
//                 title: "Total Students",
//                 value: totalStudents.toLocaleString(),
//                 icon: Users,
//                 description: "enrolled across all classes",
//                 hasData: totalStudents > 0,
//             },
//             {
//                 title: "Active Teachers",
//                 value: activeTeachers.toLocaleString(),
//                 icon: GraduationCap,
//                 description: "assigned to classes",
//                 hasData: activeTeachers > 0,
//             },
//             {
//                 title: "Assessment Completion",
//                 value: `${completionRate}%`,
//                 icon: ClipboardCheck,
//                 description: `${completedAssessments} of ${totalAssessments} completed`,
//                 hasData: totalAssessments > 0,
//                 // Trend: good if above 80%
//                 trend: parseFloat(completionRate) >= 80 ? "up" : parseFloat(completionRate) >= 50 ? "neutral" : "down",
//             },
//             {
//                 title: "WhatsApp Feedback",
//                 value: whatsappSent.toLocaleString(),
//                 icon: MessageCircle,
//                 description: "messages sent to parents",
//                 hasData: whatsappSent > 0,
//                 // Remaining credits
//                 credits: `${school?.whatsappCredits ?? s.whatsappCredits ?? 0} credits left`,
//             },
//         ]
//     }, [profile, school])

//     // ── Loading skeleton ───────────────────────────────────────────────────
//     if (!profile) {
//         return (
//             <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
//                 {[...Array(4)].map((_, i) => (
//                     <Card key={i} className="bg-school-secondary-900 border-school-secondary-700">
//                         <CardContent className="p-5 sm:p-6">
//                             <div className="animate-pulse space-y-3">
//                                 <div className="h-3 w-24 rounded bg-school-secondary-700" />
//                                 <div className="h-8 w-16 rounded bg-school-secondary-700" />
//                                 <div className="h-3 w-32 rounded bg-school-secondary-700" />
//                             </div>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//         )
//     }

//     if (!stats) return null

//     return (
//         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
//             {stats.map((stat) => {
//                 const Icon = stat.icon
//                 const trend = (stat as any).trend as "up" | "down" | "neutral" | undefined

//                 return (
//                     <Card
//                         key={stat.title}
//                         className="relative overflow-hidden bg-school-secondary-900 border-school-secondary-700 hover:border-school-primary/30 transition-colors duration-200"
//                     >
//                         {/* Subtle glow top edge */}
//                         <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-school-primary/30 to-transparent" />

//                         <CardContent className="p-5 sm:p-6">
//                             <div className="flex items-start justify-between gap-4">

//                                 {/* Text content */}
//                                 <div className="space-y-2 min-w-0 flex-1">
//                                     <p className="text-xs font-semibold uppercase tracking-wider text-school-secondary-100/40 truncate">
//                                         {stat.title}
//                                     </p>

//                                     <h3 className="text-2xl sm:text-3xl font-black text-school-secondary-100 tracking-tight leading-none">
//                                         {stat.value}
//                                     </h3>

//                                     <div className="flex items-center gap-1.5 flex-wrap">
//                                         {/* Trend indicator */}
//                                         {trend === "up" && (
//                                             <TrendingUp className="h-3 w-3 text-green-400 shrink-0" />
//                                         )}
//                                         {trend === "down" && (
//                                             <TrendingDown className="h-3 w-3 text-red-400 shrink-0" />
//                                         )}
//                                         {trend === "neutral" && (
//                                             <Minus className="h-3 w-3 text-amber-400 shrink-0" />
//                                         )}

//                                         <span className="text-xs text-school-secondary-100/50 leading-relaxed">
//                                             {stat.description}
//                                         </span>
//                                     </div>

//                                     {/* Extra info e.g. credits remaining */}
//                                     {(stat as any).credits && (
//                                         <p className="text-[10px] font-medium text-school-primary/70">
//                                             {(stat as any).credits}
//                                         </p>
//                                     )}

//                                     {/* Empty state nudge */}
//                                     {!stat.hasData && (
//                                         <p className="text-[10px] text-school-secondary-100/30 italic">
//                                             No data yet
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Icon */}
//                                 <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-school-primary/10 border border-school-primary/20">
//                                     <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-school-primary" />
//                                 </div>

//                             </div>
//                         </CardContent>
//                     </Card>
//                 )
//             })}
//         </div>
//     )
// }


// "use client"

// import { useMemo } from "react"
// import { Users, GraduationCap, ClipboardCheck, MessageCircle, TrendingUp, TrendingDown, Minus } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { useProfileStore } from "@/store/profileStore"
// import { useSchool } from "@/context/schoolProvider"

// export function StatsCards() {
//     const { profile } = useProfileStore()
//     const { school } = useSchool()

//     const stats = useMemo(() => {
//         if (!profile?.school) return null

//         const s = profile.school

//         // ── Total Students ─────────────────────────────────────────────────
//         // Count all profiles in the school with STUDENT role via classEnrollments
//         const totalStudents = s.classEnrollments?.length ?? 0

//         // ── Active Teachers ────────────────────────────────────────────────
//         // Count profiles with TEACHER role via taughtClasses (unique teachers)
//         const activeTeachers = new Set(
//             s.classes?.map((c: any) => c.teacherId) ?? []
//         ).size

//         // ── Assessment Completion ──────────────────────────────────────────
//         // Assessments with a score / total assessments = completion rate
//         const totalAssessments = s.assessments?.length ?? 0
//         const completedAssessments = s.assessments?.filter(
//             (a: any) => a.score !== null
//         ).length ?? 0
//         const completionRate = totalAssessments > 0
//             ? ((completedAssessments / totalAssessments) * 100).toFixed(1)
//             : "0.0"

//         // ── WhatsApp Feedback ──────────────────────────────────────────────
//         // Feedbacks with a sentAt date = actually sent via WhatsApp
//         const whatsappSent = s.feedbacks?.filter(
//             (f: any) => f.sentAt !== null
//         ).length ?? 0

//         return [
//             {
//                 title: "Total Students",
//                 value: totalStudents.toLocaleString(),
//                 icon: Users,
//                 description: "enrolled across all classes",
//                 hasData: totalStudents > 0,
//             },
//             {
//                 title: "Active Teachers",
//                 value: activeTeachers.toLocaleString(),
//                 icon: GraduationCap,
//                 description: "assigned to classes",
//                 hasData: activeTeachers > 0,
//             },
//             {
//                 title: "Assessment Completion",
//                 value: `${completionRate}%`,
//                 icon: ClipboardCheck,
//                 description: `${completedAssessments} of ${totalAssessments} completed`,
//                 hasData: totalAssessments > 0,
//                 // Trend: good if above 80%
//                 trend: parseFloat(completionRate) >= 80 ? "up" : parseFloat(completionRate) >= 50 ? "neutral" : "down",
//             },
//             {
//                 title: "WhatsApp Feedback",
//                 value: whatsappSent.toLocaleString(),
//                 icon: MessageCircle,
//                 description: "messages sent to parents",
//                 hasData: whatsappSent > 0,
//                 // Remaining credits
//                 credits: `${school?.whatsappCredits ?? s.whatsappCredits ?? 0} credits left`,
//             },
//         ]
//     }, [profile, school])

//     // ── Loading skeleton ───────────────────────────────────────────────────
//     if (!profile) {
//         return (
//             <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
//                 {[...Array(4)].map((_, i) => (
//                     <Card key={i} className="bg-school-secondary-900 border-school-secondary-700">
//                         <CardContent className="p-5 sm:p-6">
//                             <div className="animate-pulse space-y-3">
//                                 <div className="h-3 w-24 rounded bg-school-secondary-700" />
//                                 <div className="h-8 w-16 rounded bg-school-secondary-700" />
//                                 <div className="h-3 w-32 rounded bg-school-secondary-700" />
//                             </div>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//         )
//     }

//     if (!stats) return null

//     return (
//         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
//             {stats.map((stat) => {
//                 const Icon = stat.icon
//                 const trend = (stat as any).trend as "up" | "down" | "neutral" | undefined

//                 return (
//                     <Card
//                         key={stat.title}
//                         className="relative overflow-hidden bg-school-secondary-900 border-school-secondary-700 hover:border-school-primary/30 transition-colors duration-200"
//                     >
//                         {/* Subtle glow top edge */}
//                         <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-school-primary/30 to-transparent" />

//                         <CardContent className="p-5 sm:p-6">
//                             <div className="flex items-start justify-between gap-4">

//                                 {/* Text content */}
//                                 <div className="space-y-2 min-w-0 flex-1">
//                                     <p className="text-xs font-semibold uppercase tracking-wider text-school-secondary-100/40 truncate">
//                                         {stat.title}
//                                     </p>

//                                     <h3 className="text-2xl sm:text-3xl font-black text-school-secondary-100 tracking-tight leading-none">
//                                         {stat.value}
//                                     </h3>

//                                     <div className="flex items-center gap-1.5 flex-wrap">
//                                         {/* Trend indicator */}
//                                         {trend === "up" && (
//                                             <TrendingUp className="h-3 w-3 text-green-400 shrink-0" />
//                                         )}
//                                         {trend === "down" && (
//                                             <TrendingDown className="h-3 w-3 text-red-400 shrink-0" />
//                                         )}
//                                         {trend === "neutral" && (
//                                             <Minus className="h-3 w-3 text-amber-400 shrink-0" />
//                                         )}

//                                         <span className="text-xs text-school-secondary-100/50 leading-relaxed">
//                                             {stat.description}
//                                         </span>
//                                     </div>

//                                     {/* Extra info e.g. credits remaining */}
//                                     {(stat as any).credits && (
//                                         <p className="text-[10px] font-medium text-school-primary/70">
//                                             {(stat as any).credits}
//                                         </p>
//                                     )}

//                                     {/* Empty state nudge */}
//                                     {!stat.hasData && (
//                                         <p className="text-[10px] text-school-secondary-100/30 italic">
//                                             No data yet
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Icon */}
//                                 <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-school-primary/10 border border-school-primary/20">
//                                     <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-school-primary" />
//                                 </div>

//                             </div>
//                         </CardContent>
//                     </Card>
//                 )
//             })}
//         </div>
//     )
// }


"use client"

import { useMemo } from "react"
import {
    Users, GraduationCap, ClipboardCheck, MessageCircle,
    TrendingUp, TrendingDown, Minus, ArrowRight
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useProfileStore } from "@/store/profileStore"
import { useSchool } from "@/context/schoolProvider"
import Link from "next/link"

export function StatsCards() {
    const { profile } = useProfileStore()
    const { school } = useSchool()

    const stats = useMemo(() => {
        if (!profile?.school) return null

        const s = profile.school

        // ── Total Students ─────────────────────────────────────────────
        const totalStudents = s.classEnrollments?.length ?? 0

        // ── Active Teachers ────────────────────────────────────────────
        const activeTeachers = new Set(
            s.classes?.map((c) => c.teacherId) ?? []
        ).size

        // ── Assessment Completion ──────────────────────────────────────
        const totalAssessments = s.assessments?.length ?? 0
        const completedAssessments = s.assessments?.filter(
            (a) => a.score !== null
        ).length ?? 0
        const completionRate = totalAssessments > 0
            ? ((completedAssessments / totalAssessments) * 100).toFixed(1)
            : null

        // ── WhatsApp Feedback ──────────────────────────────────────────
        const whatsappSent = s.feedbacks?.filter(
            (f) => f.sentAt !== null
        ).length ?? 0
        const credits = school?.whatsappCredits ?? s.whatsappCredits ?? 0

        return [
            {
                title: "Total Students",
                value: totalStudents > 0 ? totalStudents.toLocaleString() : null,
                icon: Users,
                trend: totalStudents > 0 ? "up" : null,
                ctaHref: "/admin/invite-users",
                // Empty state copy
                emptyHeadline: "No students enrolled yet",
                emptyBody: "Invite students or ask teachers to add class enrollments. Enrolled students will appear here.",
                emptyAction: "Invite Users",
                // Populated state copy
                populatedDescription: "enrolled across all classes",
            },
            {
                title: "Active Teachers",
                value: activeTeachers > 0 ? activeTeachers.toLocaleString() : null,
                icon: GraduationCap,
                trend: activeTeachers > 0 ? "up" : null,
                ctaHref: "/invite-users",
                emptyHeadline: "No teachers assigned yet",
                emptyBody: "Add teachers and assign them to classes. Active teachers will show up here once classes are created.",
                emptyAction: "Add Teachers",
                populatedDescription: "assigned to classes",
            },
            {
                title: "Assessment Completion",
                value: completionRate !== null ? `${completionRate}%` : null,
                icon: ClipboardCheck,
                trend: completionRate !== null
                    ? parseFloat(completionRate) >= 80 ? "up"
                    : parseFloat(completionRate) >= 50 ? "neutral" : "down"
                    : null,
                ctaHref: "/admin/assessments",
                emptyHeadline: "No assessments recorded",
                emptyBody: "Once teachers start grading students, completion rates will appear here. Create your first assessment to get started.",
                emptyAction: "View Assessments",
                populatedDescription: `${completedAssessments} of ${totalAssessments} graded`,
            },
            {
                title: "WhatsApp Feedback",
                value: whatsappSent > 0 ? whatsappSent.toLocaleString() : null,
                icon: MessageCircle,
                trend: null,
                ctaHref: "/admin/feedback",
                emptyHeadline: "No feedback sent yet",
                emptyBody: `You have ${credits} WhatsApp credits available. Send report feedback to parents and the count will appear here.`,
                emptyAction: "Send Feedback",
                populatedDescription: "messages sent to parents",
                extra: credits > 0 ? `${credits} credits remaining` : "Top up credits to send more",
            },
        ]
    }, [profile, school])

    // ── Loading skeleton ───────────────────────────────────────────────
    if (!profile) {
        return (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="bg-school-secondary-900 border-school-secondary-700">
                        <CardContent className="p-5 sm:p-6">
                            <div className="animate-pulse space-y-3">
                                <div className="h-3 w-24 rounded bg-school-secondary-700" />
                                <div className="h-8 w-16 rounded bg-school-secondary-700" />
                                <div className="h-3 w-32 rounded bg-school-secondary-700" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (!stats) return null

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon
                const isEmpty = stat.value === null

                return (
                    <Card
                        key={stat.title}
                        className="relative overflow-hidden bg-school-secondary-900 border-school-secondary-700 hover:border-school-primary/30 transition-all duration-200 group"
                    >
                        {/* Top glow edge */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-school-primary/30 to-transparent" />

                        <CardContent className="p-5 sm:p-6">
                            {isEmpty ? (
                                /* ── Empty State ─────────────────────────────── */
                                <div className="space-y-3">
                                    {/* Header row */}
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-school-secondary-100/40">
                                            {stat.title}
                                        </p>
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-school-secondary-800 border border-school-secondary-700">
                                            <Icon className="h-4 w-4 text-school-secondary-100/30" />
                                        </div>
                                    </div>

                                    {/* Zero value */}
                                    <p className="text-3xl font-black text-school-secondary-100/20 tracking-tight">
                                        0
                                    </p>

                                    {/* Guidance text */}
                                    <div className="space-y-1 border-t border-school-secondary-700/50 pt-3">
                                        <p className="text-xs font-semibold text-school-secondary-100/50">
                                            {stat.emptyHeadline}
                                        </p>
                                        <p className="text-[11px] text-school-secondary-100/30 leading-relaxed">
                                            {stat.emptyBody}
                                        </p>
                                    </div>

                                    {/* CTA */}
                                    <Link
                                        href={stat.ctaHref}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-school-primary hover:text-school-primary/80 transition-colors"
                                    >
                                        {stat.emptyAction}
                                        <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            ) : (
                                /* ── Populated State ─────────────────────────── */
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2 min-w-0 flex-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-school-secondary-100/40 truncate">
                                            {stat.title}
                                        </p>

                                        <h3 className="text-2xl sm:text-3xl font-black text-school-secondary-100 tracking-tight leading-none">
                                            {stat.value}
                                        </h3>

                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {stat.trend === "up" && (
                                                <TrendingUp className="h-3 w-3 text-green-400 shrink-0" />
                                            )}
                                            {stat.trend === "down" && (
                                                <TrendingDown className="h-3 w-3 text-red-400 shrink-0" />
                                            )}
                                            {stat.trend === "neutral" && (
                                                <Minus className="h-3 w-3 text-amber-400 shrink-0" />
                                            )}
                                            <span className="text-xs text-school-secondary-100/50 leading-relaxed">
                                                {stat.populatedDescription}
                                            </span>
                                        </div>

                                        {stat.extra && (
                                            <p className="text-[10px] font-medium text-school-primary/70">
                                                {stat.extra}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-school-primary/10 border border-school-primary/20">
                                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-school-primary" />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
