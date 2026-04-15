// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { MessageCircle, FileText, ThumbsUp, Star } from "lucide-react"

// interface Feedback {
//   id: string
//   teacher: {
//     name: string
//     avatar?: string
//     subject: string
//   }
//   message: string
//   type: "praise" | "suggestion" | "grade"
//   date: string
//   assignment?: string
// }

// const feedbacks: Feedback[] = [
//   {
//     id: "1",
//     teacher: {
//       name: "Mrs. Adebayo",
//       subject: "Mathematics",
//     },
//     message: "Excellent work on your fractions test! Your problem-solving skills have improved significantly.",
//     type: "praise",
//     date: "Today",
//     assignment: "Fractions Test",
//   },
//   {
//     id: "2",
//     teacher: {
//       name: "Mr. Okonkwo",
//       subject: "English",
//     },
//     message: "Good effort on your essay. Try to add more descriptive language in your next writing.",
//     type: "suggestion",
//     date: "Yesterday",
//     assignment: "Creative Writing",
//   },
//   {
//     id: "3",
//     teacher: {
//       name: "Dr. Ibrahim",
//       subject: "Science",
//     },
//     message: "You scored 85% on the Science Quiz. Keep up the great work!",
//     type: "grade",
//     date: "2 days ago",
//     assignment: "Chapter 4 Quiz",
//   },
// ]

// const typeIcons = {
//   praise: ThumbsUp,
//   suggestion: MessageCircle,
//   grade: Star,
// }

// const typeColors = {
//   praise: "bg-success/10 text-success",
//   suggestion: "bg-primary/10 text-primary",
//   grade: "bg-warning/10 text-warning-foreground",
// }

// export function RecentFeedback() {
//   return (
//     <Card className="h-full">
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <CardTitle className="flex items-center gap-2 text-lg">
//             <MessageCircle className="h-5 w-5 text-primary" />
//             Recent Feedback
//           </CardTitle>
//           <Button variant="outline" size="sm" className="gap-2 bg-transparent">
//             <FileText className="h-4 w-4" />
//             View Report Card
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {feedbacks.map((feedback) => {
//           const TypeIcon = typeIcons[feedback.type]
//           const initials = feedback.teacher.name
//             .split(" ")
//             .map((n) => n[0])
//             .join("")

//           return (
//             <div
//               key={feedback.id}
//               className="rounded-lg border border-border p-4 transition-all hover:border-primary/30 hover:bg-muted/30"
//             >
//               <div className="flex items-start gap-3">
//                 <Avatar className="h-10 w-10 shrink-0">
//                   <AvatarImage src={feedback.teacher.avatar || "/placeholder.svg"} />
//                   <AvatarFallback className="bg-primary/10 text-primary text-xs">
//                     {initials}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-start justify-between gap-2 mb-1">
//                     <div>
//                       <h4 className="font-medium text-sm text-foreground">
//                         {feedback.teacher.name}
//                       </h4>
//                       <p className="text-xs text-muted-foreground">
//                         {feedback.teacher.subject}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-2 shrink-0">
//                       <div className={`flex h-6 w-6 items-center justify-center rounded-full ${typeColors[feedback.type]}`}>
//                         <TypeIcon className="h-3 w-3" />
//                       </div>
//                       <span className="text-xs text-muted-foreground">{feedback.date}</span>
//                     </div>
//                   </div>
//                   {feedback.assignment && (
//                     <Badge variant="secondary" className="mb-2 text-[10px]">
//                       {feedback.assignment}
//                     </Badge>
//                   )}
//                   <p className="text-sm text-muted-foreground leading-relaxed">
//                     {feedback.message}
//                   </p>
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, FileText, Star, Quote, History } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecentFeedbackProps {
  assessments: any[]; // Array of assessments including gradeSubject and feedbacks
}

export function RecentFeedback({ assessments }: RecentFeedbackProps) {
  return (
    <Card className="h-full bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
      <CardHeader className="pb-6 bg-slate-950/50 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-school-primary/10 rounded-lg text-school-primary">
                <MessageSquare className="h-4 w-4" />
            </div>
            <CardTitle className="text-sm font-black uppercase italic tracking-tighter text-white">
                Instructor Remarks
            </CardTitle>
          </div>
          <Button variant="outline" size="sm" className="h-8 border-white/10 text-slate-500 hover:text-school-primary transition-all rounded-xl uppercase text-[9px] font-black tracking-widest">
            <FileText className="h-3 w-3 mr-2" />
            Registry Record
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {assessments.length === 0 ? (
          <div className="py-20 text-center opacity-30">
            <History className="h-10 w-10 text-slate-700 mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                No recent feedback logs found
            </p>
          </div>
        ) : (
          assessments.map((assessment) => {
            // Extraction logic
            const subjectName = assessment.gradeSubject?.subject?.name || "General Module";
            const feedback = assessment.feedbacks?.[0]; // Get the most recent message
            const scorePercent = assessment.score ? Math.round((assessment.score / assessment.maxScore) * 100) : null;

            return (
              <div
                key={assessment.id}
                className="relative p-6 rounded-3xl bg-slate-950 border border-white/5 hover:border-school-primary/20 transition-all group"
              >
                {/* Score Indicator */}
                {scorePercent && (
                    <div className="absolute top-6 right-6 flex flex-col items-end">
                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Grade</div>
                        <div className="text-sm font-black text-school-primary italic">{scorePercent}%</div>
                    </div>
                )}

                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border border-white/5 shadow-xl">
                    <AvatarFallback className="bg-slate-900 text-slate-500 text-[10px] font-black">
                      {subjectName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="mb-4">
                        <h4 className="font-black text-white text-xs uppercase italic tracking-widest">
                            {subjectName}
                        </h4>
                        <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">
                            {feedback?.sentAt ? new Date(feedback.sentAt).toLocaleDateString() : 'Assessment Log'}
                        </p>
                    </div>

                    <div className="relative">
                      <Quote className="absolute -left-2 -top-2 h-4 w-4 text-school-primary/10" />
                      <p className="text-sm font-medium text-slate-400 leading-relaxed pl-4 italic border-l-2 border-school-primary/20">
                        {feedback?.message || "Assessment recorded. Subject instructor provided no specific remarks for this module."}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-slate-900 border-white/5 text-[8px] font-black uppercase text-slate-500 tracking-tighter px-3">
                           Verified Remark
                        </Badge>
                        {scorePercent && scorePercent >= 75 && (
                             <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase px-3 flex items-center gap-1">
                                <Star className="h-2.5 w-2.5 fill-emerald-500" /> Commendation
                             </Badge>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}