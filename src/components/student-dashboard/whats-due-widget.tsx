// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Calendar, Clock, FileText, Calculator, FlaskConical, BookMarked } from "lucide-react"

// interface Assignment {
//   id: string
//   title: string
//   subject: string
//   dueDate: string
//   dueTime: string
//   type: "assignment" | "quiz" | "project"
//   urgent?: boolean
// }

// const assignments: Assignment[] = [
//   {
//     id: "1",
//     title: "Fractions Worksheet",
//     subject: "Mathematics",
//     dueDate: "Today",
//     dueTime: "3:00 PM",
//     type: "assignment",
//     urgent: true,
//   },
//   {
//     id: "2",
//     title: "Chapter 5 Quiz",
//     subject: "Science",
//     dueDate: "Tomorrow",
//     dueTime: "10:00 AM",
//     type: "quiz",
//   },
//   {
//     id: "3",
//     title: "Book Report",
//     subject: "English",
//     dueDate: "Feb 7",
//     dueTime: "11:59 PM",
//     type: "project",
//   },
//   {
//     id: "4",
//     title: "Lab Report",
//     subject: "Science",
//     dueDate: "Feb 10",
//     dueTime: "2:00 PM",
//     type: "assignment",
//   },
// ]

// const subjectIcons: Record<string, typeof Calculator> = {
//   Mathematics: Calculator,
//   Science: FlaskConical,
//   English: BookMarked,
// }

// const typeStyles: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
//   assignment: { variant: "secondary", label: "Assignment" },
//   quiz: { variant: "default", label: "Quiz" },
//   project: { variant: "outline", label: "Project" },
// }

// export function WhatsDueWidget() {
//   return (
//     <Card className="h-full">
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <CardTitle className="flex items-center gap-2 text-lg">
//             <Calendar className="h-5 w-5 text-primary" />
//             {"What's Due"}
//           </CardTitle>
//           <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
//             View All
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-3">
//         {assignments.map((assignment) => {
//           const SubjectIcon = subjectIcons[assignment.subject] || FileText
//           const typeStyle = typeStyles[assignment.type]

//           return (
//             <div
//               key={assignment.id}
//               className="group flex items-start gap-3 rounded-lg border border-border p-3 transition-all hover:border-primary/30 hover:bg-muted/50"
//             >
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
//                 <SubjectIcon className="h-5 w-5" />
//               </div>
//               <div className="min-w-0 flex-1">
//                 <div className="flex items-start justify-between gap-2">
//                   <div>
//                     <h4 className="font-medium text-foreground text-sm leading-tight">
//                       {assignment.title}
//                     </h4>
//                     <p className="text-xs text-muted-foreground mt-0.5">{assignment.subject}</p>
//                   </div>
//                   <Badge variant={typeStyle.variant} className="shrink-0 text-[10px]">
//                     {typeStyle.label}
//                   </Badge>
//                 </div>
//                 <div className="mt-2 flex items-center gap-3 text-xs">
//                   <span className={`flex items-center gap-1 ${assignment.urgent ? "text-destructive font-medium" : "text-muted-foreground"}`}>
//                     <Clock className="h-3 w-3" />
//                     {assignment.dueDate}, {assignment.dueTime}
//                   </span>
//                   {assignment.urgent && (
//                     <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
//                       Due Soon
//                     </Badge>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </CardContent>
//     </Card>
//   )
// }



"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, Zap, ChevronRight, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface WhatsDueWidgetProps {
  exams: any[]; // Data from Prisma 'Exam' model
}

export function WhatsDueWidget({ exams }: WhatsDueWidgetProps) {
  return (
    <Card className="h-full bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
      <CardHeader className="pb-6 bg-slate-950/50 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-school-primary/10 rounded-lg">
                <Calendar className="h-4 w-4 text-school-primary" />
            </div>
            <CardTitle className="text-sm font-black uppercase italic tracking-tighter text-white">
                Upcoming Assessment Vault
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-[9px] font-black uppercase border-white/10 text-slate-500">
            {exams.length} Pending
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {exams.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-slate-800 mx-auto" />
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                Registry Clear: No Exams Scheduled
            </p>
          </div>
        ) : (
          exams.map((exam) => (
            <div
              key={exam.id}
              className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-slate-950 p-4 transition-all hover:border-school-primary/30"
            >
              {/* Icon Based on Type */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-white/5 text-school-primary shadow-inner">
                <Zap className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-black text-white text-sm uppercase italic tracking-tight leading-none truncate">
                      {exam.title}
                    </h4>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">
                      {exam.type.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <Badge className="bg-school-primary/10 text-school-primary border-none text-[8px] font-black uppercase px-2 py-0">
                    Active
                  </Badge>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
                    <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {exam.duration} Minutes
                    </span>
                    <span className="flex items-center gap-1.5">
                        <FileText className="h-3 w-3" />
                        CBT Format
                    </span>
                  </div>
                  
                  <Button size="sm" className="h-7 bg-slate-900 border border-white/10 hover:bg-school-primary hover:text-slate-950 text-[9px] font-black uppercase rounded-lg transition-all">
                    Initialize <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
        
        {exams.length > 0 && (
            <button className="w-full py-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-school-primary transition-colors mt-2">
                View Full Assessment History
            </button>
        )}
      </CardContent>
    </Card>
  )
}