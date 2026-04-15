// import { Card } from "@/components/ui/card"
// import { ClipboardCheck, Eye, FileText } from "lucide-react"

// export function RegistryVault({ history, onView }: { history: any[], onView: (e: any) => void }) {
//     if (history.length === 0) return (
//         <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30">
//             <FileText className="h-12 w-12 mx-auto mb-4" />
//             <p className="text-[10px] font-black uppercase tracking-widest">Vault Empty</p>
//         </div>
//     )

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {history.map((exam) => (
//                 <Card key={exam.id} className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-2xl group">
//                     <div className="flex justify-between mb-6">
//                         <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5">
//                             <ClipboardCheck className="text-school-primary h-5 w-5" />
//                         </div>
//                     </div>
//                     <h3 className="text-xl font-bold text-white uppercase italic truncate">{exam.title}</h3>
//                     <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">{exam.class.name} • {exam._count.questions} Items</p>
//                     <button onClick={() => onView(exam)} className="w-full bg-slate-950 mt-6 border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-school-primary transition-all">
//                         Open Registry File
//                     </button>
//                 </Card>
//             ))}
//         </div>
//     )
// // }