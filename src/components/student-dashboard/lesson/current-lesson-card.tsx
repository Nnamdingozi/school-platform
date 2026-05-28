// "use client"

// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { Play, BookOpen, Users, Clock } from "lucide-react"

// interface CurrentLessonProps {
//   topic: string
//   subject: string
//   term: string
//   progress: number
//   studentsOnline: number
//   duration: string
//   isLive?: boolean
// }

// export function CurrentLessonCard({
//   topic = "Fractions",
//   subject = "Math",
//   term = "Term 1",
//   progress = 45,
//   studentsOnline = 24,
//   duration = "45 min",
//   isLive = true,
// }: Partial<CurrentLessonProps>) {
//   return (
//     <Card className="overflow-hidden">
//       {/* Live indicator bar */}
//       {isLive && (
//         <div className="h-1 bg-success" />
//       )}
      
//       <CardContent className="p-5">
//         <div className="flex items-start justify-between gap-4">
//           <div className="flex-1">
//             {/* Header */}
//             <div className="flex items-center gap-2 mb-3">
//               {isLive && (
//                 <Badge className="bg-success text-success-foreground gap-1.5 px-2">
//                   <span className="relative flex h-2 w-2">
//                     <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-foreground/60"></span>
//                     <span className="relative inline-flex h-2 w-2 rounded-full bg-success-foreground"></span>
//                   </span>
//                   Live Now
//                 </Badge>
//               )}
//               <Badge variant="outline" className="text-xs">
//                 {term} {subject}
//               </Badge>
//             </div>

//             {/* Topic */}
//             <h3 className="text-xl font-semibold text-foreground mb-1">
//               {topic}
//             </h3>
//             <p className="text-sm text-muted-foreground mb-4">
//               Currently being taught in your classroom
//             </p>

//             {/* Stats */}
//             <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
//               <span className="flex items-center gap-1.5">
//                 <Users className="h-4 w-4" />
//                 {studentsOnline} online
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <Clock className="h-4 w-4" />
//                 {duration}
//               </span>
//             </div>

//             {/* Progress */}
//             <div className="space-y-2">
//               <div className="flex items-center justify-between text-xs">
//                 <span className="text-muted-foreground">Lesson Progress</span>
//                 <span className="font-medium text-foreground">{progress}%</span>
//               </div>
//               <Progress value={progress} className="h-2" />
//             </div>
//           </div>

//           {/* Illustration */}
//           <div className="hidden sm:flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
//             <BookOpen className="h-12 w-12 text-primary" />
//           </div>
//         </div>

//         {/* Action */}
//         <Button className="w-full mt-5 gap-2" size="lg">
//           <Play className="h-4 w-4" />
//           Join Lesson
//         </Button>
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, BookOpen, Users, Clock, Radio } from "lucide-react"
import { useProfileStore } from "@/store/profileStore"
import { cn } from "@/lib/utils"

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface CurrentLessonProps {
  topic: string
  subject: string
  term: string
  progress: number
  studentsOnline: number
  duration: string
  isLive?: boolean
}

/**
 * ACTIVE LESSON HUB (Tier 3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function CurrentLessonCard({
  topic = "Fractions",
  subject = "Mathematics",
  term = "Term 1",
  progress = 45,
  studentsOnline = 24,
  duration = "45 min",
  isLive = true,
}: Partial<CurrentLessonProps>) {
  const { profile } = useProfileStore();

  return (
    <Card className="bg-card border-border rounded-[2rem] overflow-hidden shadow-xl transition-all hover:border-school-primary-200 group">
      {/* ── LIVE TELEMETRY BAR (Rule 21) ── */}
      {isLive && (
        <div className="h-1.5 w-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse" />
      )}
      
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="flex-1 w-full space-y-6">
            
            {/* ── HEADER BADGES ── */}
            <div className="flex flex-wrap items-center gap-3">
              {isLive && (
                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 gap-2 px-3 py-1 rounded-lg animate-in fade-in zoom-in duration-500">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">Live Node</span>
                </Badge>
              )}
              <Badge variant="outline" className="bg-surface border-border text-muted-foreground px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest italic">
                {term} • {subject}
              </Badge>
            </div>

            {/* ── TOPIC IDENTITY (Rule 11) ── */}
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none mb-2">
                {topic}
              </h3>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest italic opacity-60">
                Active pedagogical sync in progress
              </p>
            </div>

            {/* ── TELEMETRY STATS ── */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="p-1.5 rounded-md bg-surface border border-border">
                    <Users className="h-3.5 w-3.5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest tabular-nums">{studentsOnline} Online</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="p-1.5 rounded-md bg-surface border border-border">
                    <Clock className="h-3.5 w-3.5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest tabular-nums">{duration}</span>
              </div>
            </div>

            {/* ── PROGRESS MATRIX (Rule 21) ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-[0.2em]">Module Coverage</span>
                <span className="text-[10px] font-extrabold text-school-primary italic tabular-nums">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-border">
                  <div 
                    className="h-full bg-school-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--school-primary-raw),0.3)]"
                    style={{ width: `${progress}%` }}
                  />
              </div>
            </div>
          </div>

          {/* ── VISUAL HUB (Rule 19/21) ── */}
          <div className="hidden lg:flex h-32 w-32 shrink-0 items-center justify-center rounded-[1.5rem] bg-school-primary-50 border border-school-primary-200 shadow-inner group-hover:scale-105 transition-transform duration-500">
            <BookOpen className="h-14 w-14 text-school-primary opacity-80" />
          </div>
        </div>

        {/* ── ACTION HUB (Rule 18/21) ── */}
        <button 
            className={cn(
                "w-full h-14 mt-8 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg",
                "bg-school-primary text-on-school-primary font-extrabold text-[11px] uppercase tracking-widest",
                "hover:brightness-110 shadow-school-primary-200"
            )}
        >
          <Radio className="h-4 w-4 animate-pulse" />
          Synchronize with Lesson
        </button>
      </CardContent>
    </Card>
  )
}