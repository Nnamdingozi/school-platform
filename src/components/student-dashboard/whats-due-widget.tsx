// // "use client"

// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { Button } from "@/components/ui/button"
// // import { Calendar, Clock, FileText, Calculator, FlaskConical, BookMarked } from "lucide-react"

// // interface Assignment {
// //   id: string
// //   title: string
// //   subject: string
// //   dueDate: string
// //   dueTime: string
// //   type: "assignment" | "quiz" | "project"
// //   urgent?: boolean
// // }

// // const assignments: Assignment[] = [
// //   {
// //     id: "1",
// //     title: "Fractions Worksheet",
// //     subject: "Mathematics",
// //     dueDate: "Today",
// //     dueTime: "3:00 PM",
// //     type: "assignment",
// //     urgent: true,
// //   },
// //   {
// //     id: "2",
// //     title: "Chapter 5 Quiz",
// //     subject: "Science",
// //     dueDate: "Tomorrow",
// //     dueTime: "10:00 AM",
// //     type: "quiz",
// //   },
// //   {
// //     id: "3",
// //     title: "Book Report",
// //     subject: "English",
// //     dueDate: "Feb 7",
// //     dueTime: "11:59 PM",
// //     type: "project",
// //   },
// //   {
// //     id: "4",
// //     title: "Lab Report",
// //     subject: "Science",
// //     dueDate: "Feb 10",
// //     dueTime: "2:00 PM",
// //     type: "assignment",
// //   },
// // ]

// // const subjectIcons: Record<string, typeof Calculator> = {
// //   Mathematics: Calculator,
// //   Science: FlaskConical,
// //   English: BookMarked,
// // }

// // const typeStyles: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
// //   assignment: { variant: "secondary", label: "Assignment" },
// //   quiz: { variant: "default", label: "Quiz" },
// //   project: { variant: "outline", label: "Project" },
// // }

// // export function WhatsDueWidget() {
// //   return (
// //     <Card className="h-full">
// //       <CardHeader className="pb-3">
// //         <div className="flex items-center justify-between">
// //           <CardTitle className="flex items-center gap-2 text-lg">
// //             <Calendar className="h-5 w-5 text-primary" />
// //             {"What's Due"}
// //           </CardTitle>
// //           <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
// //             View All
// //           </Button>
// //         </div>
// //       </CardHeader>
// //       <CardContent className="space-y-3">
// //         {assignments.map((assignment) => {
// //           const SubjectIcon = subjectIcons[assignment.subject] || FileText
// //           const typeStyle = typeStyles[assignment.type]

// //           return (
// //             <div
// //               key={assignment.id}
// //               className="group flex items-start gap-3 rounded-lg border border-border p-3 transition-all hover:border-primary/30 hover:bg-muted/50"
// //             >
// //               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
// //                 <SubjectIcon className="h-5 w-5" />
// //               </div>
// //               <div className="min-w-0 flex-1">
// //                 <div className="flex items-start justify-between gap-2">
// //                   <div>
// //                     <h4 className="font-medium text-foreground text-sm leading-tight">
// //                       {assignment.title}
// //                     </h4>
// //                     <p className="text-xs text-muted-foreground mt-0.5">{assignment.subject}</p>
// //                   </div>
// //                   <Badge variant={typeStyle.variant} className="shrink-0 text-[10px]">
// //                     {typeStyle.label}
// //                   </Badge>
// //                 </div>
// //                 <div className="mt-2 flex items-center gap-3 text-xs">
// //                   <span className={`flex items-center gap-1 ${assignment.urgent ? "text-destructive font-medium" : "text-muted-foreground"}`}>
// //                     <Clock className="h-3 w-3" />
// //                     {assignment.dueDate}, {assignment.dueTime}
// //                   </span>
// //                   {assignment.urgent && (
// //                     <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
// //                       Due Soon
// //                     </Badge>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           )
// //         })}
// //       </CardContent>
// //     </Card>
// //   )
// // }



// // "use client"

// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { Button } from "@/components/ui/button"
// // import { Calendar, Clock, FileText, Zap, ChevronRight, AlertCircle } from "lucide-react"
// // import { cn } from "@/lib/utils"

// // interface WhatsDueWidgetProps {
// //   exams: any[]; // Data from Prisma 'Exam' model
// // }

// // export function WhatsDueWidget({ exams }: WhatsDueWidgetProps) {
// //   return (
// //     <Card className="h-full bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
// //       <CardHeader className="pb-6 bg-slate-950/50 border-b border-white/5">
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <div className="p-2 bg-school-primary/10 rounded-lg">
// //                 <Calendar className="h-4 w-4 text-school-primary" />
// //             </div>
// //             <CardTitle className="text-sm font-black uppercase italic tracking-tighter text-white">
// //                 Upcoming Assessment Vault
// //             </CardTitle>
// //           </div>
// //           <Badge variant="outline" className="text-[9px] font-black uppercase border-white/10 text-slate-500">
// //             {exams.length} Pending
// //           </Badge>
// //         </div>
// //       </CardHeader>

// //       <CardContent className="p-6 space-y-4">
// //         {exams.length === 0 ? (
// //           <div className="py-12 text-center space-y-3">
// //             <AlertCircle className="h-8 w-8 text-slate-800 mx-auto" />
// //             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
// //                 Registry Clear: No Exams Scheduled
// //             </p>
// //           </div>
// //         ) : (
// //           exams.map((exam) => (
// //             <div
// //               key={exam.id}
// //               className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-slate-950 p-4 transition-all hover:border-school-primary/30"
// //             >
// //               {/* Icon Based on Type */}
// //               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-white/5 text-school-primary shadow-inner">
// //                 <Zap className="h-5 w-5" />
// //               </div>

// //               <div className="min-w-0 flex-1">
// //                 <div className="flex items-start justify-between gap-2">
// //                   <div>
// //                     <h4 className="font-black text-white text-sm uppercase italic tracking-tight leading-none truncate">
// //                       {exam.title}
// //                     </h4>
// //                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">
// //                       {exam.type.replace(/_/g, ' ')}
// //                     </p>
// //                   </div>
// //                   <Badge className="bg-school-primary/10 text-school-primary border-none text-[8px] font-black uppercase px-2 py-0">
// //                     Active
// //                   </Badge>
// //                 </div>
                
// //                 <div className="mt-4 flex items-center justify-between">
// //                   <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
// //                     <span className="flex items-center gap-1.5">
// //                         <Clock className="h-3 w-3" />
// //                         {exam.duration} Minutes
// //                     </span>
// //                     <span className="flex items-center gap-1.5">
// //                         <FileText className="h-3 w-3" />
// //                         CBT Format
// //                     </span>
// //                   </div>
                  
// //                   <Button size="sm" className="h-7 bg-slate-900 border border-white/10 hover:bg-school-primary hover:text-slate-950 text-[9px] font-black uppercase rounded-lg transition-all">
// //                     Initialize <ChevronRight className="ml-1 h-3 w-3" />
// //                   </Button>
// //                 </div>
// //               </div>
// //             </div>
// //           ))
// //         )}
        
// //         {exams.length > 0 && (
// //             <button className="w-full py-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-school-primary transition-colors mt-2">
// //                 View Full Assessment History
// //             </button>
// //         )}
// //       </CardContent>
// //     </Card>
// //   )
// // }


// // "use client"

// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { Button } from "@/components/ui/button"
// // import { Calendar, Clock, FileText, Zap, ChevronRight, AlertCircle } from "lucide-react"

// // // ── Types ───────────────────────────────────────────────────────────────────

// // interface Exam {
// //   id: string;
// //   title: string;
// //   type: string;
// //   duration: number;
// // }

// // interface WhatsDueWidgetProps {
// //   // FIX: Replaced 'any[]' with the specific Exam interface
// //   exams: Exam[]; 
// // }

// // // ── Main Component ──────────────────────────────────────────────────────────

// // export function WhatsDueWidget({ exams }: WhatsDueWidgetProps) {
// //   return (
// //     <Card className="h-full bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
// //       <CardHeader className="pb-6 bg-slate-950/50 border-b border-white/5">
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <div className="p-2 bg-school-primary/10 rounded-lg">
// //                 <Calendar className="h-4 w-4 text-school-primary" />
// //             </div>
// //             <CardTitle className="text-sm font-black uppercase italic tracking-tighter text-white leading-none">
// //                 Upcoming Assessment Vault
// //             </CardTitle>
// //           </div>
// //           <Badge variant="outline" className="text-[9px] font-black uppercase border-white/10 text-slate-500">
// //             {exams.length} Pending
// //           </Badge>
// //         </div>
// //       </CardHeader>

// //       <CardContent className="p-6 space-y-4">
// //         {exams.length === 0 ? (
// //           <div className="py-12 text-center space-y-3">
// //             <AlertCircle className="h-8 w-8 text-slate-800 mx-auto" />
// //             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
// //                 Registry Clear: No Exams Scheduled
// //             </p>
// //           </div>
// //         ) : (
// //           // FIX: Strictly typed mapping
// //           exams.map((exam: Exam) => (
// //             <div
// //               key={exam.id}
// //               className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-slate-950 p-4 transition-all hover:border-school-primary/30"
// //             >
// //               {/* Icon Based on Type */}
// //               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-white/5 text-school-primary shadow-inner">
// //                 <Zap className="h-5 w-5" />
// //               </div>

// //               <div className="min-w-0 flex-1">
// //                 <div className="flex items-start justify-between gap-2">
// //                   <div>
// //                     <h4 className="font-black text-white text-sm uppercase italic tracking-tight leading-none truncate">
// //                       {exam.title}
// //                     </h4>
// //                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">
// //                       {exam.type.replace(/_/g, ' ')}
// //                     </p>
// //                   </div>
// //                   <Badge className="bg-school-primary/10 text-school-primary border-none text-[8px] font-black uppercase px-2 py-0">
// //                     Active
// //                   </Badge>
// //                 </div>
                
// //                 <div className="mt-4 flex items-center justify-between">
// //                   <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
// //                     <span className="flex items-center gap-1.5">
// //                         <Clock className="h-3 w-3" />
// //                         {exam.duration} Minutes
// //                     </span>
// //                     <span className="flex items-center gap-1.5">
// //                         <FileText className="h-3 w-3" />
// //                         CBT Format
// //                     </span>
// //                   </div>
                  
// //                   <Button size="sm" className="h-7 bg-slate-900 border border-white/10 hover:bg-school-primary hover:text-slate-950 text-[9px] font-black uppercase rounded-lg transition-all">
// //                     Initialize <ChevronRight className="ml-1 h-3 w-3" />
// //                   </Button>
// //                 </div>
// //               </div>
// //             </div>
// //           ))
// //         )}
        
// //         {exams.length > 0 && (
// //             <button className="w-full py-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-school-primary transition-colors mt-2">
// //                 View Full Assessment History
// //             </button>
// //         )}
// //       </CardContent>
// //     </Card>
// //   )
// // }



// // "use client"

// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { Button } from "@/components/ui/button"
// // import { Calendar, Clock, FileText, Zap, ChevronRight, AlertCircle } from "lucide-react"

// // // ── Types ───────────────────────────────────────────────────────────────────

// // interface Exam {
// //   id: string;
// //   title: string;
// //   type: string;
// //   duration: number;
// // }

// // interface WhatsDueWidgetProps {
// //   // FIX: Replaced 'any[]' with the specific Exam interface
// //   exams: Exam[]; 
// // }

// // // ── Main Component ──────────────────────────────────────────────────────────

// // export function WhatsDueWidget({ exams }: WhatsDueWidgetProps) {
// //   return (
// //     <Card className="h-full bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
// //       <CardHeader className="pb-6 bg-slate-950/50 border-b border-white/5">
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <div className="p-2 bg-school-primary/10 rounded-lg">
// //                 {/* Utilized icon */}
// //                 <Calendar className="h-4 w-4 text-school-primary" />
// //             </div>
// //             <CardTitle className="text-sm font-black uppercase italic tracking-tighter text-white leading-none">
// //                 Upcoming Assessment Vault
// //             </CardTitle>
// //           </div>
// //           <Badge variant="outline" className="text-[9px] font-black uppercase border-white/10 text-slate-500">
// //             {exams.length} Pending
// //           </Badge>
// //         </div>
// //       </CardHeader>

// //       <CardContent className="p-6 space-y-4">
// //         {exams.length === 0 ? (
// //           <div className="py-12 text-center space-y-3">
// //             {/* Utilized icon */}
// //             <AlertCircle className="h-8 w-8 text-slate-800 mx-auto" />
// //             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
// //                 Registry Clear: No Exams Scheduled
// //             </p>
// //           </div>
// //         ) : (
// //           // FIX: Strictly typed mapping using the Exam interface
// //           exams.map((exam: Exam) => (
// //             <div
// //               key={exam.id}
// //               className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-slate-950 p-4 transition-all hover:border-school-primary/30"
// //             >
// //               {/* Icon Based on Type - Utilized Zap */}
// //               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-white/5 text-school-primary shadow-inner">
// //                 <Zap className="h-5 w-5" />
// //               </div>

// //               <div className="min-w-0 flex-1">
// //                 <div className="flex items-start justify-between gap-2">
// //                   <div>
// //                     <h4 className="font-black text-white text-sm uppercase italic tracking-tight leading-none truncate">
// //                       {exam.title}
// //                     </h4>
// //                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">
// //                       {exam.type.replace(/_/g, ' ')}
// //                     </p>
// //                   </div>
// //                   <Badge className="bg-school-primary/10 text-school-primary border-none text-[8px] font-black uppercase px-2 py-0">
// //                     Active
// //                   </Badge>
// //                 </div>
                
// //                 <div className="mt-4 flex items-center justify-between">
// //                   <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
// //                     <span className="flex items-center gap-1.5">
// //                         {/* Utilized Clock icon */}
// //                         <Clock className="h-3 w-3" />
// //                         {exam.duration} Minutes
// //                     </span>
// //                     <span className="flex items-center gap-1.5">
// //                         {/* Utilized FileText icon */}
// //                         <FileText className="h-3 w-3" />
// //                         CBT Format
// //                     </span>
// //                   </div>
                  
// //                   <Button size="sm" className="h-7 bg-slate-900 border border-white/10 hover:bg-school-primary hover:text-slate-950 text-[9px] font-black uppercase rounded-lg transition-all">
// //                     Initialize 
// //                     {/* Utilized Chevron icon */}
// //                     <ChevronRight className="ml-1 h-3 w-3" />
// //                   </Button>
// //                 </div>
// //               </div>
// //             </div>
// //           ))
// //         )}
        
// //         {exams.length > 0 && (
// //             <button className="w-full py-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-school-primary transition-colors mt-2 outline-none">
// //                 View Full Assessment History
// //             </button>
// //         )}
// //       </CardContent>
// //     </Card>
// //   )
// // }





// // "use client"

// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { Button } from "@/components/ui/button"
// // import { Calendar, Clock, FileText, Zap, ChevronRight, AlertCircle } from "lucide-react"
// // // Import generated Prisma types
// // import { Exam } from "@prisma/client"
// // import { getErrorMessage } from "@/lib/error-handler"

// // // ── Utility ──────────────────────────────────────────────────────────────────

// // /**
// //  * Standard error extractor for usage in client-side actions
// //  */
// // // eslint-disable-next-line @typescript-eslint/no-unused-vars
// // // function getErrorMessage(error: unknown): string {
// // //   if (error instanceof Error) return error.message;
// // //   if (error && typeof error === 'object' && 'message' in error) {
// // //     return String(error.message);
// // //   }
// // //   return typeof error === 'string' ? error : "An unknown error occurred";
// // // }

// // // ── Types ───────────────────────────────────────────────────────────────────

// // interface WhatsDueWidgetProps {
// //   // Using the Prisma generated Exam type
// //   exams: Exam[]; 
// // }

// // // ── Main Component ──────────────────────────────────────────────────────────

// // export function WhatsDueWidget({ exams }: WhatsDueWidgetProps) {
// //   return (
// //     <Card className="h-full bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
// //       <CardHeader className="pb-6 bg-slate-950/50 border-b border-white/5">
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <div className="p-2 bg-school-primary/10 rounded-lg">
// //                 <Calendar className="h-4 w-4 text-school-primary" />
// //             </div>
// //             <CardTitle className="text-sm font-black uppercase italic tracking-tighter text-white leading-none">
// //                 Upcoming Assessment Vault
// //             </CardTitle>
// //           </div>
// //           <Badge variant="outline" className="text-[9px] font-black uppercase border-white/10 text-slate-500">
// //             {exams.length} Pending
// //           </Badge>
// //         </div>
// //       </CardHeader>

// //       <CardContent className="p-6 space-y-4">
// //         {exams.length === 0 ? (
// //           <div className="py-12 text-center space-y-3">
// //             <AlertCircle className="h-8 w-8 text-slate-800 mx-auto" />
// //             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
// //                 Registry Clear: No Exams Scheduled
// //             </p>
// //           </div>
// //         ) : (
// //           exams.map((exam) => (
// //             <div
// //               key={exam.id}
// //               className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-slate-950 p-4 transition-all hover:border-school-primary/30"
// //             >
// //               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-white/5 text-school-primary shadow-inner">
// //                 <Zap className="h-5 w-5" />
// //               </div>

// //               <div className="min-w-0 flex-1">
// //                 <div className="flex items-start justify-between gap-2">
// //                   <div>
// //                     <h4 className="font-black text-white text-sm uppercase italic tracking-tight leading-none truncate">
// //                       {exam.title}
// //                     </h4>
// //                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">
// //                       {exam.type.replace(/_/g, ' ')}
// //                     </p>
// //                   </div>
// //                   <Badge className="bg-school-primary/10 text-school-primary border-none text-[8px] font-black uppercase px-2 py-0">
// //                     Active
// //                   </Badge>
// //                 </div>
                
// //                 <div className="mt-4 flex items-center justify-between">
// //                   <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
// //                     <span className="flex items-center gap-1.5">
// //                         <Clock className="h-3 w-3" />
// //                         {exam.duration} Minutes
// //                     </span>
// //                     <span className="flex items-center gap-1.5">
// //                         <FileText className="h-3 w-3" />
// //                         CBT Format
// //                     </span>
// //                   </div>
                  
// //                   <Button size="sm" className="h-7 bg-slate-900 border border-white/10 hover:bg-school-primary hover:text-slate-950 text-[9px] font-black uppercase rounded-lg transition-all">
// //                     Initialize 
// //                     <ChevronRight className="ml-1 h-3 w-3" />
// //                   </Button>
// //                 </div>
// //               </div>
// //             </div>
// //           ))
// //         )}
        
// //         {exams.length > 0 && (
// //             <button className="w-full py-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-school-primary transition-colors mt-2 outline-none">
// //                 View Full Assessment History
// //             </button>
// //         )}
// //       </CardContent>
// //     </Card>
// //   )
// // }



// "use client";

// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Calendar, Clock, FileText, Zap, ChevronRight, AlertCircle } from "lucide-react";
// import { type Exam } from "@prisma/client";
// import { cn } from "@/lib/utils";

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface WhatsDueWidgetProps {
//   exams: Exam[]; 
// }

// /**
//  * UPCOMING ASSESSMENT LEDGER (Tier 3)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 20: Compulsory Responsiveness with fluid spacing.
//  * Rule 21: Scale Protocol for clean mathematical status tints.
//  */
// export function WhatsDueWidget({ exams }: WhatsDueWidgetProps) {
//   return (
//     <Card className="h-full bg-card border-border rounded-[2rem] shadow-xl overflow-hidden animate-in fade-in duration-700">
//       {/* ── HEADER (Rule 11/21) ── */}
//       <CardHeader className="pb-6 bg-surface/50 border-b border-border">
//         <div className="flex items-center justify-between gap-4">
//           <div className="flex items-center gap-4">
//             {/* Rule 21: Scale Protocol Icon Box */}
//             <div className="p-2.5 bg-school-primary-50 border border-school-primary-200 rounded-xl flex items-center justify-center">
//                 <Calendar className="h-5 w-5 text-school-primary" />
//             </div>
//             <CardTitle className="text-base font-extrabold uppercase italic tracking-tighter text-foreground leading-none">
//                 Assessment Vault
//             </CardTitle>
//           </div>
//           <Badge variant="outline" className="bg-surface border-border text-muted-foreground text-[9px] font-extrabold uppercase px-3 py-1 rounded-lg shadow-sm">
//             {exams.length} Pending
//           </Badge>
//         </div>
//       </CardHeader>

//       <CardContent className="p-6 md:p-8 space-y-5">
//         {exams.length === 0 ? (
//           /* ── EMPTY STATE (Rule 18/19) ── */
//           <div className="py-16 text-center space-y-4 flex flex-col items-center opacity-40">
//             <div className="h-14 w-14 bg-surface border border-border rounded-full flex items-center justify-center mb-2">
//                 <AlertCircle className="h-8 w-8 text-muted-foreground/30" />
//             </div>
//             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic leading-relaxed max-w-[200px]">
//                 Registry Clear: No Assessment Nodes Scheduled
//             </p>
//           </div>
//         ) : (
//           /* ── EXAM LIST ── */
//           exams.map((exam) => (
//             <div
//               key={exam.id}
//               className="group flex flex-col sm:flex-row sm:items-center gap-5 p-5 rounded-2xl border border-border bg-surface hover:border-school-primary-300 transition-all shadow-sm hover:shadow-md"
//             >
//               {/* Rule 21: Scale Protocol Visual Anchor */}
//               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-school-primary-50 border border-school-primary-200 text-school-primary shadow-inner group-hover:scale-105 transition-transform">
//                 <Zap className="h-6 w-6" />
//               </div>

//               <div className="min-w-0 flex-1 space-y-4">
//                 <div className="flex items-start justify-between gap-4">
//                   <div className="min-w-0">
//                     <h4 className="font-extrabold text-foreground text-sm uppercase italic tracking-tight leading-none truncate mb-2">
//                       {exam.title}
//                     </h4>
//                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
//                       {exam.type.replace(/_/g, ' ')}
//                     </p>
//                   </div>
//                   <Badge className="bg-school-primary-100 text-school-primary border border-school-primary-200 text-[8px] font-extrabold uppercase px-2.5 py-0.5 rounded-md shadow-sm">
//                     Live Node
//                   </Badge>
//                 </div>
                
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                   <div className="flex items-center gap-5 text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/70">
//                     <span className="flex items-center gap-2">
//                         <Clock className="h-3.5 w-3.5 text-school-primary/60" />
//                         <span className="tabular-nums">{exam.duration} Units</span>
//                     </span>
//                     <span className="flex items-center gap-2">
//                         <FileText className="h-3.5 w-3.5 text-school-primary/60" />
//                         CBT Registry
//                     </span>
//                   </div>
                  
//                   <button className="h-10 px-6 bg-school-primary text-on-school-primary font-extrabold uppercase text-[9px] tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-school-primary-200 hover:brightness-110 active:scale-95 flex items-center justify-center gap-2">
//                     Initialize Hub
//                     <ChevronRight className="h-3 w-3 stroke-[3]" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
        
//         {/* ── FOOTER ACTIONS (Rule 11) ── */}
//         {exams.length > 0 && (
//             <button className="w-full py-4 text-[9px] font-extrabold uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-school-primary transition-all group border-t border-border mt-4">
//                 Audit Full Assessment Hub <ChevronRight className="inline-block ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
//             </button>
//         )}
//       </CardContent>
//     </Card>
//   );
// }


"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Zap, ChevronRight, AlertCircle } from "lucide-react";
import { type Exam } from "@prisma/client";


// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface WhatsDueWidgetProps {
  exams: Exam[]; 
}

/**
 * UPCOMING ASSESSMENT LEDGER (Tier 3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function WhatsDueWidget({ exams }: WhatsDueWidgetProps) {
  return (
    <Card className="h-full bg-card border-border rounded-[2rem] shadow-xl overflow-hidden animate-in fade-in duration-700">
      {/* ── HEADER (Rule 11/21) ── */}
      <CardHeader className="pb-6 bg-surface/50 border-b border-border">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Rule 21: Scale Protocol Icon Box */}
            <div className="p-2.5 bg-school-primary-50 border border-school-primary-200 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-school-primary" />
            </div>
            <CardTitle className="text-base font-extrabold uppercase italic tracking-tighter text-foreground leading-none">
                Assessment Vault
            </CardTitle>
          </div>
          <Badge variant="outline" className="bg-surface border-border text-muted-foreground text-[9px] font-extrabold uppercase px-3 py-1 rounded-lg shadow-sm">
            {exams.length} Pending
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8 space-y-5">
        {exams.length === 0 ? (
          /* ── EMPTY HUB STATE (Rule 18/19) ── */
          <div className="py-16 text-center space-y-4 flex flex-col items-center opacity-40">
            <div className="h-14 w-14 bg-surface border border-border rounded-full flex items-center justify-center mb-2">
                <AlertCircle className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic leading-relaxed max-w-[200px]">
                Registry Clear: No Assessment Modules Scheduled
            </p>
          </div>
        ) : (
          /* ── EXAM LIST ── */
          exams.map((exam) => (
            <div
              key={exam.id}
              className="group flex flex-col sm:flex-row sm:items-center gap-5 p-5 rounded-2xl border border-border bg-surface hover:border-school-primary-300 transition-all shadow-sm hover:shadow-md"
            >
              {/* Rule 21: Scale Protocol Visual Anchor */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-school-primary-50 border border-school-primary-200 text-school-primary shadow-inner group-hover:scale-105 transition-transform">
                <Zap className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-foreground text-sm uppercase italic tracking-tight leading-none truncate mb-2">
                      {exam.title}
                    </h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                      {exam.type.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <Badge className="bg-school-primary-100 text-school-primary border border-school-primary-200 text-[8px] font-extrabold uppercase px-2.5 py-0.5 rounded-md shadow-sm">
                    Active Hub
                  </Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-5 text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/70">
                    <span className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-school-primary/60" />
                        <span className="tabular-nums">{exam.duration} Minutes</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-school-primary/60" />
                        CBT Registry
                    </span>
                  </div>
                  
                  <button className="h-10 px-6 bg-school-primary text-on-school-primary font-extrabold uppercase text-[9px] tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-school-primary-200 hover:brightness-110 active:scale-95 flex items-center justify-center gap-2">
                    Start Module
                    <ChevronRight className="h-3 w-3 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* ── FOOTER ACTIONS (Rule 11) ── */}
        {exams.length > 0 && (
            <button className="w-full py-4 text-[9px] font-extrabold uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-school-primary transition-all group border-t border-border mt-4">
                Audit Full Assessment Hub <ChevronRight className="inline-block ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </button>
        )}
      </CardContent>
    </Card>
  );
}