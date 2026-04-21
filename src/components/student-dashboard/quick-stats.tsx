// "use client"

// import { Card, CardContent } from "@/components/ui/card"
// import { TrendingUp, CheckCircle2, Clock, Award } from "lucide-react"

// interface Stat {
//   label: string
//   value: string
//   icon: typeof TrendingUp
//   trend?: string
//   trendUp?: boolean
// }

// const stats: Stat[] = [
//   {
//     label: "Average Grade",
//     value: "B+",
//     icon: TrendingUp,
//     trend: "+5%",
//     trendUp: true,
//   },
//   {
//     label: "Completed",
//     value: "12/15",
//     icon: CheckCircle2,
//   },
//   {
//     label: "Pending",
//     value: "3",
//     icon: Clock,
//   },
//   {
//     label: "Achievements",
//     value: "8",
//     icon: Award,
//   },
// ]

// export function QuickStats() {
//   return (
//     <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//       {stats.map((stat) => {
//         const Icon = stat.icon
//         return (
//           <Card key={stat.label} className="overflow-hidden">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
//                   <Icon className="h-4 w-4" />
//                 </div>
//                 {stat.trend && (
//                   <span className={`text-xs font-medium ${stat.trendUp ? "text-success" : "text-destructive"}`}>
//                     {stat.trend}
//                   </span>
//                 )}
//               </div>
//               <div className="space-y-0.5">
//                 <p className="text-2xl font-bold text-foreground">{stat.value}</p>
//                 <p className="text-xs text-muted-foreground">{stat.label}</p>
//               </div>
//             </CardContent>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }



// "use client"

// import { Card, CardContent } from "@/components/ui/card"
// import { TrendingUp, CheckCircle2, Clock, Award, LucideIcon } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface QuickStatsProps {
//   assessments: any[];
//   exams?: any[]; // Optional upcoming exams
// }

// export function QuickStats({ assessments, exams = [] }: QuickStatsProps) {
  
//   // ── 1. Calculate Real Metrics ──
  
//   // A. Average Score
//   const totalScore = assessments.reduce((acc, a) => acc + (a.score || 0), 0);
//   const totalMax = assessments.reduce((acc, a) => acc + (a.maxScore || 100), 0);
//   const avgPercent = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

//   // B. Achievements (Count assessments where score is >= 75%)
//   const achievements = assessments.filter(a => ((a.score / a.maxScore) * 100) >= 75).length;

//   // ── 2. Define the Stat Display Logic ──
//   const stats = [
//     {
//       label: "Average Grade",
//       value: `${avgPercent}%`,
//       icon: TrendingUp,
//       color: "text-school-primary",
//       bg: "bg-school-primary/10",
//     },
//     {
//       label: "Assessments",
//       value: assessments.length.toString(),
//       icon: CheckCircle2,
//       color: "text-emerald-500",
//       bg: "bg-emerald-500/10",
//     },
//     {
//       label: "Upcoming CBT",
//       value: exams.length.toString(),
//       icon: Clock,
//       color: "text-amber-500",
//       bg: "bg-amber-500/10",
//     },
//     {
//       label: "Achievements",
//       value: achievements.toString(),
//       icon: Award,
//       color: "text-purple-500",
//       bg: "bg-purple-500/10",
//     },
//   ]

//   return (
//     <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//       {stats.map((stat) => {
//         const Icon = stat.icon
//         return (
//           <Card key={stat.label} className="overflow-hidden border-white/5 bg-slate-900 shadow-xl rounded-2xl transition-all hover:border-white/10">
//             <CardContent className="p-5">
//               <div className="flex items-center justify-between mb-4">
//                 <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border border-white/5", stat.bg, stat.color)}>
//                   <Icon className="h-5 w-5" />
//                 </div>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-2xl font-black text-white italic tracking-tighter uppercase">
//                     {stat.value}
//                 </p>
//                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
//                     {stat.label}
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, CheckCircle2, Clock, Award } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ───────────────────────────────────────────────────────────────────

interface Assessment {
  score: number | null;
  maxScore: number | null;
}

interface Exam {
  id: string;
}

interface QuickStatsProps {
  // FIX: Replaced 'any[]' with specific interfaces
  assessments: Assessment[];
  exams?: Exam[]; 
}

// ── Main Component ──────────────────────────────────────────────────────────

export function QuickStats({ assessments, exams = [] }: QuickStatsProps) {
  
  // ── 1. Calculate Real Metrics ──
  
  // A. Average Score (Safely handling nulls)
  const totalScore = assessments.reduce((acc, a) => acc + (a.score || 0), 0);
  const totalMax = assessments.reduce((acc, a) => acc + (a.maxScore || 0), 0);
  const avgPercent = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  // B. Achievements (Count assessments where score is >= 75%)
  const achievements = assessments.filter(a => {
    if (!a.score || !a.maxScore) return false;
    return (a.score / a.maxScore) * 100 >= 75;
  }).length;

  // ── 2. Define the Stat Display Logic ──
  const stats = [
    {
      label: "Academic Avg",
      value: `${avgPercent}%`,
      icon: TrendingUp,
      color: "text-school-primary",
      bg: "bg-school-primary/10",
    },
    {
      label: "Modules Graded",
      value: assessments.length.toString(),
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Pending CBT",
      value: exams.length.toString(),
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Distinctions",
      value: achievements.toString(),
      icon: Award,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="overflow-hidden border-white/5 bg-slate-900 shadow-xl rounded-2xl transition-all hover:border-white/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border border-white/5", 
                    stat.bg, 
                    stat.color
                )}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black text-white italic tracking-tighter uppercase">
                    {stat.value}
                </p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                    {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}