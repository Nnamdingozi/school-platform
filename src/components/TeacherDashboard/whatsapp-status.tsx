// "use client"

// import { MessageCircle, Check, Clock, AlertCircle } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"

// const feedbackStatuses = [
//   {
//     id: 1,
//     assessment: "Week 5 Quiz - Quadratic Equations",
//     date: "Jan 28, 2026",
//     sent: 42,
//     pending: 3,
//     status: "partial",
//   },
//   {
//     id: 2,
//     assessment: "Class Assignment 4",
//     date: "Jan 25, 2026",
//     sent: 45,
//     pending: 0,
//     status: "complete",
//   },
//   {
//     id: 3,
//     assessment: "Mid-Term Test",
//     date: "Jan 20, 2026",
//     sent: 44,
//     pending: 1,
//     status: "partial",
//   },
//   {
//     id: 4,
//     assessment: "Week 4 Quiz - Indices",
//     date: "Jan 18, 2026",
//     sent: 45,
//     pending: 0,
//     status: "complete",
//   },
// ]

// export function WhatsAppStatus() {
//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center gap-2">
//           <MessageCircle className="h-5 w-5 text-primary" />
//           <CardTitle className="text-base font-semibold">WhatsApp Feedback Status</CardTitle>
//         </div>
//         <CardDescription>
//           Recent assessment feedback sent to parents
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-3">
//           {feedbackStatuses.map((item) => (
//             <div
//               key={item.id}
//               className="flex items-center justify-between rounded-lg border border-border p-3"
//             >
//               <div className="flex items-center gap-3">
//                 <div
//                   className={`flex h-8 w-8 items-center justify-center rounded-full ${
//                     item.status === "complete"
//                       ? "bg-primary/10 text-primary"
//                       : "bg-amber-500/10 text-amber-500"
//                   }`}
//                 >
//                   {item.status === "complete" ? (
//                     <Check className="h-4 w-4" />
//                   ) : (
//                     <Clock className="h-4 w-4" />
//                   )}
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-foreground">{item.assessment}</p>
//                   <p className="text-xs text-muted-foreground">{item.date}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 {item.status === "complete" ? (
//                   <Badge className="bg-primary/10 text-primary">
//                     {item.sent} sent
//                   </Badge>
//                 ) : (
//                   <div className="flex items-center gap-1.5">
//                     <Badge className="bg-primary/10 text-primary">
//                       {item.sent} sent
//                     </Badge>
//                     <Badge variant="outline" className="gap-1 text-amber-500 border-amber-500/30">
//                       <AlertCircle className="h-3 w-3" />
//                       {item.pending} pending
//                     </Badge>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }




"use client"

import React from "react"
import { MessageCircle, Check, Clock, AlertCircle, History, Send, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface FeedbackStatus {
  id: number
  assessment: string
  date: string
  sent: number
  pending: number
  status: "partial" | "complete"
}

const feedbackStatuses: FeedbackStatus[] = [
  {
    id: 1,
    assessment: "Week 5 Hub - Quadratic Equations",
    date: "Jan 28, 2026",
    sent: 42,
    pending: 3,
    status: "partial",
  },
  {
    id: 2,
    assessment: "Class Module Dispatch 4",
    date: "Jan 25, 2026",
    sent: 45,
    pending: 0,
    status: "complete",
  },
  {
    id: 3,
    assessment: "Mid-Term Registry Hub",
    date: "Jan 20, 2026",
    sent: 44,
    pending: 1,
    status: "partial",
  },
  {
    id: 4,
    assessment: "Week 4 Hub - Indices",
    date: "Jan 18, 2026",
    sent: 45,
    pending: 0,
    status: "complete",
  },
]

/**
 * COMMUNICATION TRANSMISSION LEDGER (Tier 2)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical status tints.
 */
export function WhatsAppStatus() {
  return (
    <Card className="bg-card border-border rounded-[2rem] shadow-xl overflow-hidden animate-in fade-in duration-700">
      
      {/* ── HEADER (Rule 11/21) ── */}
      <CardHeader className="pb-6 bg-surface/50 border-b border-border">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Rule 21 Scale Protocol Icon Box */}
            <div className="p-2.5 bg-school-primary-50 border border-school-primary-200 rounded-xl flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-school-primary" />
            </div>
            <div>
                <CardTitle className="text-base font-extrabold uppercase italic tracking-tighter text-foreground leading-none">
                    Transmission Hub
                </CardTitle>
                <CardDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1.5">
                    WhatsApp Feedback Registry
                </CardDescription>
            </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-surface border border-border flex items-center justify-center">
              <History className="h-4 w-4 text-muted-foreground/30" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8 space-y-4">
        {feedbackStatuses.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-surface hover:border-school-primary-200 transition-all shadow-sm group"
          >
            <div className="flex items-center gap-4">
              {/* Rule 21: Mathematical Status Scale */}
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-inner transition-transform group-hover:scale-110",
                  item.status === "complete"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                    : "bg-amber-50 border-amber-200 text-amber-600"
                )}
              >
                {item.status === "complete" ? (
                  <Check className="h-5 w-5 stroke-[3]" />
                ) : (
                  <Clock className="h-5 w-5 stroke-[3]" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-foreground uppercase italic tracking-tight truncate leading-tight">
                    {item.assessment}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                    {item.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Badge className="bg-school-primary-50 text-school-primary border-school-primary-100 text-[9px] font-extrabold uppercase px-3 py-1 rounded-lg tabular-nums">
                {item.sent} Dispatched
              </Badge>
              
              {item.status !== "complete" && (
                <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-200 bg-amber-50/30 text-[9px] font-extrabold uppercase px-3 py-1 rounded-lg tabular-nums">
                  <AlertCircle className="h-3 w-3" />
                  {item.pending} Queued
                </Badge>
              )}

              <div className="ml-2 h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center group-hover:border-school-primary-200 transition-colors cursor-pointer">
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-school-primary" />
              </div>
            </div>
          </div>
        ))}

        {/* ── FOOTER PROTOCOL ── */}
        <button className="w-full mt-4 py-4 rounded-xl border border-dashed border-border hover:border-school-primary/30 hover:bg-school-primary-50 transition-all group">
            <div className="flex items-center justify-center gap-3">
                <Send className="h-4 w-4 text-muted-foreground group-hover:text-school-primary transition-colors" />
                <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground uppercase tracking-widest">
                    Audit Full Transmission Ledger
                </span>
            </div>
        </button>
      </CardContent>
    </Card>
  )
}