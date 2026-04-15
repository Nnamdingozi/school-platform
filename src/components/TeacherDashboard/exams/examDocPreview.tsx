// import { Card } from "@/components/ui/card"
// import { cn } from "@/lib/utils"
// import { Edit3, Save } from "lucide-react"

// export function ExamDocumentPreview({ 
//     questions, 
//     title, 
//     isViewOnly, 
//     onUpdate 
// }: { 
//     questions: any[], 
//     title: string, 
//     isViewOnly: boolean, 
//     onUpdate: (idx: number, val: string) => void 
// }) {
//     return (
//         <Card id="exam-document" className="bg-white text-slate-900 p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-visible">
//             <div className="no-print absolute top-0 left-0 w-full h-2 bg-school-primary" />
//             <div className="text-center mb-16">
//                 <h2 className="text-3xl font-black uppercase italic">{title}</h2>
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Institutional Exam Vault • Official Record</p>
//             </div>

//             <div className="space-y-12">
//                 {questions.map((q, idx) => (
//                     <div key={idx} className="space-y-4 page-break relative group">
//                         <div className="flex gap-4">
//                             <span className="font-black text-school-primary">Q{idx + 1}.</span>
//                             <p className="font-bold text-lg leading-snug">{q.text}</p>
//                         </div>
//                         <div className="grid grid-cols-2 gap-x-12 gap-y-3 pl-10">
//                             {q.options.map((opt: string, i: number) => (
//                                 <p key={i} className={cn(
//                                     "text-sm font-medium",
//                                     !isViewOnly && opt === q.correctAnswer ? "text-school-primary font-black underline decoration-2 underline-offset-4" : "text-slate-600"
//                                 )}>
//                                     {String.fromCharCode(65 + i)}) {opt}
//                                 </p>
//                             ))}
//                         </div>
//                         {!isViewOnly && <p className="no-print pl-10 text-[9px] italic text-slate-400">Rationale: {q.explanation}</p>}
//                     </div>
//                 ))}
//             </div>
//         </Card>
//     )
// }