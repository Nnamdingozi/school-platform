// "use client";

// import { 
//   CheckCircle2, Clock, PlayCircle, 
//   AlertCircle, Calendar, ChevronRight 
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Progress } from "@/components/ui/progress";

// export function TermTimelineView({ data }: { data: any }) {
//   const { term, currentWeek, schedule, progressPercent } = data;

//   return (
//     <div className="max-w-5xl mx-auto space-y-12 pb-20">
      
//       {/* ── 1. The Header: Progress Summary ── */}
//       <div className="relative overflow-hidden bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
//         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-school-primary/10 rounded-full blur-3xl" />
        
//         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
//           <div className="space-y-2">
//             <div className="flex items-center gap-3 text-school-primary mb-2">
//               <Calendar className="h-5 w-5" />
//               <span className="text-[10px] font-black uppercase tracking-[0.3em]">
//                 {term.displayName} Registry
//               </span>
//             </div>
//             <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
//               Term Schedule
//             </h1>
//             <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
//               {new Date(term.startDate).toLocaleDateString()} — {new Date(term.endDate).toLocaleDateString()}
//             </p>
//           </div>

//           <div className="w-full md:w-72 space-y-4">
//             <div className="flex justify-between items-end">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syllabus Progress</span>
//               <span className="text-2xl font-black text-school-primary italic">{progressPercent}%</span>
//             </div>
//             <Progress value={progressPercent} className="h-3 bg-slate-950 border border-white/5" />
//           </div>
//         </div>
//       </div>

//       {/* ── 2. The Vertical Timeline ── */}
//       <div className="relative px-4">
//         {/* The Actual Line */}
//         <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-school-primary/50 via-slate-800 to-transparent" />

//         <div className="space-y-12">
//           {schedule.map((topic: any, index: number) => {
//             const isCurrent = topic.status === "current";
//             const isCompleted = topic.status === "completed";
            
//             return (
//               <div key={topic.id} className={cn(
//                 "relative flex flex-col md:flex-row items-center",
//                 index % 2 === 0 ? "md:flex-row-reverse" : ""
//               )}>
                
//                 {/* Timeline Center Node */}
//                 <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20">
//                   <div className={cn(
//                     "h-8 w-8 rounded-full flex items-center justify-center border-4 border-slate-950 transition-all duration-500",
//                     isCurrent ? "bg-school-primary shadow-[0_0_20px_rgba(var(--primary),0.5)] scale-125" : 
//                     isCompleted ? "bg-emerald-500" : "bg-slate-800"
//                   )}>
//                     {isCompleted ? <CheckCircle2 className="h-4 w-4 text-white" /> : 
//                      isCurrent ? <PlayCircle className="h-4 w-4 text-slate-950" /> : 
//                      <Clock className="h-4 w-4 text-slate-500" />}
//                   </div>
//                 </div>

//                 {/* Content Card */}
//                 <div className="w-full md:w-[45%] ml-12 md:ml-0">
//                   <div className={cn(
//                     "p-8 rounded-[2rem] border transition-all duration-300",
//                     isCurrent ? "bg-slate-900 border-school-primary/30 shadow-xl" : 
//                     "bg-slate-900/40 border-white/5 opacity-80"
//                   )}>
//                     <div className="flex justify-between items-start mb-4">
//                       <span className={cn(
//                         "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest",
//                         isCurrent ? "bg-school-primary text-slate-950" : "bg-slate-950 text-slate-500"
//                       )}>
//                         Week {topic.weekNumber}
//                       </span>
//                       {topic.needsReview && (
//                         <div className="flex items-center gap-1 text-amber-500 animate-pulse">
//                           <AlertCircle className="h-3 w-3" />
//                           <span className="text-[9px] font-black uppercase">Needs Review</span>
//                         </div>
//                       )}
//                     </div>

//                     <h4 className="text-xl font-bold text-white uppercase italic tracking-tight mb-2">
//                       {topic.title}
//                     </h4>
                    
//                     <div className="flex items-center justify-between mt-6">
//                        <div className="flex gap-4">
//                          <div className="text-center">
//                             <p className="text-[8px] font-black text-slate-600 uppercase">Lesson</p>
//                             <div className={cn("h-1.5 w-6 rounded-full mt-1", topic.hasLesson ? "bg-emerald-500" : "bg-slate-800")} />
//                          </div>
//                          <div className="text-center">
//                             <p className="text-[8px] font-black text-slate-600 uppercase">Avg Score</p>
//                             <p className="text-xs font-bold text-slate-400">{topic.averagePercent ? `${topic.averagePercent}%` : '--'}</p>
//                          </div>
//                        </div>

//                        <button className="h-10 w-10 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center hover:bg-school-primary hover:text-slate-950 transition-all group">
//                           <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
//                        </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { 
//   CheckCircle2, 
//   Clock, 
//   PlayCircle, 
//   AlertCircle, 
//   Calendar, 
//   ChevronRight,
//   Archive
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Progress } from "@/components/ui/progress";

// interface TermTimelineProps {
//   data: {
//     term: {
//       displayName: string;
//       startDate: string;
//       endDate: string;
//     };
//     isConcluded: boolean;
//     currentWeek: string | number;
//     schedule: Array<{
//       id: string;
//       title: string;
//       weekNumber: number;
//       status: "completed" | "current" | "pending";
//       hasLesson: boolean;
//       needsReview: boolean;
//       averagePercent: string | null;
//     }>;
//     progressPercent: number;
//     subjectName: string;
//     gradeName: string;
//   };
// }

// export function TermTimelineView({ data }: TermTimelineProps) {
//   const { term, isConcluded, schedule, progressPercent, subjectName, gradeName } = data;

//   return (
//     <div className="max-w-5xl mx-auto space-y-12 pb-20">
      
//       {/* ── 1. THE HEADER: TERM SUMMARY ── */}
//       <div className={cn(
//         "relative overflow-hidden border rounded-[3rem] p-10 shadow-2xl transition-all duration-500",
//         isConcluded 
//           ? "bg-slate-900/40 border-emerald-500/20 shadow-emerald-500/5" 
//           : "bg-slate-900 border-white/5 shadow-school-primary/5"
//       )}>
//         {/* Decorative Blur Background */}
//         <div className={cn(
//             "absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full blur-3xl opacity-20",
//             isConcluded ? "bg-emerald-500" : "bg-school-primary"
//         )} />
        
//         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
//           <div className="space-y-3 text-center md:text-left">
//             <div className="flex items-center justify-center md:justify-start gap-3">
//               {isConcluded ? (
//                 <div className="flex items-center gap-2 bg-emerald-500 text-slate-950 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
//                   <Archive className="h-3 w-3" /> Term Concluded
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 bg-school-primary text-slate-950 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
//                   <PlayCircle className="h-3 w-3" /> Active Roadmap
//                 </div>
//               )}
//               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                 {gradeName}
//               </span>
//             </div>
            
//             <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
//               {term.displayName}
//             </h1>
            
//             <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-3 w-3" />
//                 <span>{new Date(term.startDate).toLocaleDateString()} — {new Date(term.endDate).toLocaleDateString()}</span>
//               </div>
//               <span className="text-slate-800">|</span>
//               <span className="text-slate-300">{subjectName}</span>
//             </div>
//           </div>

//           {/* Progress Section */}
//           <div className="w-full md:w-72 space-y-4">
//             <div className="flex justify-between items-end">
//               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                 Term Completion
//               </span>
//               <span className={cn(
//                   "text-2xl font-black italic",
//                   isConcluded ? "text-emerald-500" : "text-school-primary"
//               )}>
//                 {progressPercent}%
//               </span>
//             </div>
//             <Progress 
//                 value={progressPercent} 
//                 className={cn(
//                     "h-3 bg-slate-950 border border-white/5",
//                     isConcluded ? "[&>div]:bg-emerald-500" : "[&>div]:bg-school-primary"
//                 )} 
//             />
//           </div>
//         </div>
//       </div>

//       {/* ── 2. THE TIMELINE ── */}
//       <div className="relative px-4">
//         {/* The Vertical Connecting Line */}
//         <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-slate-800 via-slate-800 to-transparent" />

//         <div className="space-y-12">
//           {schedule.length > 0 ? (
//             schedule.map((topic, index) => {
//               const isCurrent = topic.status === "current";
//               const isCompleted = topic.status === "completed";
              
//               return (
//                 <div 
//                     key={topic.id} 
//                     className={cn(
//                         "relative flex flex-col md:flex-row items-center transition-all duration-700",
//                         index % 2 === 0 ? "md:flex-row-reverse" : "",
//                         isConcluded && "opacity-80 grayscale-[0.3]"
//                     )}
//                 >
                  
//                   {/* Timeline Center Node (The Circle) */}
//                   <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20">
//                     <div className={cn(
//                       "h-8 w-8 rounded-full flex items-center justify-center border-4 border-slate-950 transition-all duration-500",
//                       isCurrent ? "bg-school-primary shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-125" : 
//                       isCompleted ? "bg-emerald-500" : "bg-slate-800"
//                     )}>
//                       {isCompleted ? <CheckCircle2 className="h-4 w-4 text-white" /> : 
//                        isCurrent ? <PlayCircle className="h-4 w-4 text-slate-950" /> : 
//                        <Clock className="h-4 w-4 text-slate-500" />}
//                     </div>
//                   </div>

//                   {/* Topic Card Content */}
//                   <div className="w-full md:w-[45%] ml-12 md:ml-0">
//                     <div className={cn(
//                       "p-8 rounded-[2.5rem] border transition-all duration-300 group",
//                       isCurrent ? "bg-slate-900 border-school-primary/30 shadow-xl" : 
//                       "bg-slate-900/40 border-white/5"
//                     )}>
                      
//                       {/* Header Section of Card */}
//                       <div className="flex justify-between items-start mb-4">
//                         <span className={cn(
//                           "text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest",
//                           isCurrent ? "bg-school-primary text-slate-950" : "bg-slate-950 text-slate-500"
//                         )}>
//                           Week {topic.weekNumber}
//                         </span>
                        
//                         {topic.needsReview && (
//                           <div className="flex items-center gap-1.5 text-amber-500 animate-pulse">
//                             <AlertCircle className="h-3.5 w-3.5" />
//                             <span className="text-[9px] font-black uppercase tracking-wider">Gap Found</span>
//                           </div>
//                         )}
//                       </div>

//                       {/* Title */}
//                       <h4 className="text-xl font-bold text-white uppercase italic tracking-tight mb-3 leading-tight">
//                         {topic.title}
//                       </h4>
                      
//                       <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-6 font-bold">
//                         Registry Ref: {topic.id.split('-')[0]}
//                       </p>

//                       {/* Footer Section of Card: Lesson and Scores */}
//                       <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
//                          <div className="flex gap-6">
//                            <div className="space-y-1">
//                               <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Lesson Note</p>
//                               <div className={cn(
//                                   "h-1.5 w-8 rounded-full", 
//                                   topic.hasLesson ? "bg-emerald-500" : "bg-slate-800"
//                               )} />
//                            </div>
//                            <div className="space-y-1">
//                               <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Performance</p>
//                               <p className={cn(
//                                   "text-xs font-black",
//                                   topic.needsReview ? "text-amber-500" : "text-slate-400"
//                               )}>
//                                 {topic.averagePercent ? `${topic.averagePercent}%` : 'N/A'}
//                               </p>
//                            </div>
//                          </div>

//                          {/* Action Button */}
//                          <button className="h-12 w-12 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-slate-500 hover:bg-school-primary hover:text-slate-950 transition-all hover:scale-110 active:scale-95">
//                             <ChevronRight className="h-5 w-5" />
//                          </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             /* EMPTY TOPIC STATE */
//             <div className="py-32 text-center bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-white/5">
//               <Archive className="h-12 w-12 text-slate-800 mx-auto mb-6" />
//               <h4 className="text-lg font-black text-slate-600 uppercase italic">Empty Timeline</h4>
//               <p className="text-slate-700 text-xs uppercase tracking-widest mt-2">
//                 No topics have been mapped to this academic term yet.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { 
//   CheckCircle2, Clock, PlayCircle, AlertCircle, 
//   Calendar, ChevronRight, Archive 
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Progress } from "@/components/ui/progress";

// export function TermTimelineView({ data }: { data: any }) {
//   const { term, isConcluded, schedule, progressPercent, subjectName, gradeName } = data;

//   return (
//     <div className="max-w-5xl mx-auto space-y-12 pb-20">
      
//       {/* ── HEADER ── */}
//       <div className={cn(
//         "relative overflow-hidden border rounded-[3rem] p-10 shadow-2xl transition-all duration-500",
//         isConcluded ? "bg-slate-900/40 border-emerald-500/20" : "bg-slate-900 border-white/5"
//       )}>
//         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
//           <div className="space-y-3 text-center md:text-left">
//             <div className="flex items-center justify-center md:justify-start gap-3">
//               {isConcluded ? (
//                 <div className="flex items-center gap-2 bg-emerald-500 text-slate-950 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
//                   <Archive className="h-3 w-3" /> Term Concluded
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 bg-school-primary text-slate-950 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
//                   <PlayCircle className="h-3 w-3" /> Active Roadmap
//                 </div>
//               )}
//             </div>
            
//             <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
//               {term.displayName}
//             </h1>
            
//             <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-3 w-3" />
//                 <span>
//                   {new Date(term.startDate).toLocaleDateString('en-GB')} — {new Date(term.endDate).toLocaleDateString('en-GB')}
//                 </span>
//               </div>
//               <span className="text-slate-800">|</span>
//               <span className="text-slate-300">{gradeName} / {subjectName}</span>
//             </div>
//           </div>

//           <div className="w-full md:w-72 space-y-4">
//             <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
//               <span className="text-slate-400">Completion</span>
//               <span className={isConcluded ? "text-emerald-500" : "text-school-primary"}>{progressPercent}%</span>
//             </div>
//             <Progress value={progressPercent} className={cn("h-3 bg-slate-950", isConcluded ? "[&>div]:bg-emerald-500" : "[&>div]:bg-school-primary")} />
//           </div>
//         </div>
//       </div>

//       {/* ── TIMELINE ── */}
//       <div className="relative px-4">
//         <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-px bg-slate-800" />

//         <div className="space-y-12">
//           {schedule.length > 0 ? (
//             schedule.map((topic: any, index: number) => (
//               <div key={topic.id} className={cn(
//                 "relative flex flex-col md:flex-row items-center",
//                 index % 2 === 0 ? "md:flex-row-reverse" : "",
//                 isConcluded && "opacity-70 grayscale-[0.4]"
//               )}>
//                 <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20">
//                   <div className={cn(
//                     "h-8 w-8 rounded-full flex items-center justify-center border-4 border-slate-950",
//                     topic.status === "current" ? "bg-school-primary" : 
//                     topic.status === "completed" ? "bg-emerald-500" : "bg-slate-800"
//                   )}>
//                     {topic.status === "completed" ? <CheckCircle2 className="h-4 w-4 text-white" /> : <Clock className="h-4 w-4 text-slate-500" />}
//                   </div>
//                 </div>

//                 <div className="w-full md:w-[45%] ml-12 md:ml-0">
//                   <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-white/5">
//                     <div className="flex justify-between mb-4">
//                       <span className="text-[10px] font-black px-3 py-1 bg-slate-950 rounded-full text-slate-500 uppercase tracking-widest">
//                         Week {topic.weekNumber}
//                       </span>
//                       {topic.needsReview && <AlertCircle className="h-4 w-4 text-amber-500" />}
//                     </div>
//                     <h4 className="text-xl font-bold text-white uppercase italic">{topic.title}</h4>
//                     <div className="mt-6 flex justify-between items-center border-t border-white/5 pt-6">
//                       <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">
//                         Performance: {topic.averagePercent ? `${topic.averagePercent}%` : 'N/A'}
//                       </div>
//                       <button className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center text-slate-500 hover:text-school-primary transition-colors">
//                         <ChevronRight className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="py-20 text-center bg-slate-900/50 rounded-[3rem] border border-dashed border-white/10">
//               <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest">No topics mapped for this term yet</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { 
//   CheckCircle2, Clock, PlayCircle, AlertCircle, 
//   Calendar, ChevronRight, Archive 
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Progress } from "@/components/ui/progress";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface TimelineTopic {
//   id: string;
//   title: string;
//   weekNumber: number | null;
//   status: "completed" | "current" | "pending";
//   hasLesson: boolean;
//   averagePercent?: string | null;
//   needsReview?: boolean;
// }

// interface TermTimelineData {
//   term: {
//     displayName: string;
//     startDate: string | Date;
//     endDate: string | Date;
//   };
//   isConcluded: boolean;
//   schedule: TimelineTopic[];
//   progressPercent: number;
//   subjectName: string;
//   gradeName: string;
// }

// interface TermTimelineViewProps {
//   // FIX: Replaced 'any' with specific interface
//   data: TermTimelineData;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function TermTimelineView({ data }: TermTimelineViewProps) {
//   const { term, isConcluded, schedule, progressPercent, subjectName, gradeName } = data;

//   return (
//     <div className="max-w-5xl mx-auto space-y-12 pb-20">
      
//       {/* ── HEADER ── */}
//       <div className={cn(
//         "relative overflow-hidden border rounded-[3rem] p-10 shadow-2xl transition-all duration-500",
//         isConcluded ? "bg-slate-900/40 border-emerald-500/20" : "bg-slate-900 border-white/5"
//       )}>
//         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
//           <div className="space-y-3 text-center md:text-left">
//             <div className="flex items-center justify-center md:justify-start gap-3">
//               {isConcluded ? (
//                 <div className="flex items-center gap-2 bg-emerald-500 text-slate-950 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
//                   <Archive className="h-3 w-3" /> Term Concluded
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 bg-school-primary text-slate-950 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
//                   <PlayCircle className="h-3 w-3" /> Active Roadmap
//                 </div>
//               )}
//             </div>
            
//             <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
//               {term.displayName}
//             </h1>
            
//             <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-3 w-3" />
//                 <span>
//                   {new Date(term.startDate).toLocaleDateString('en-GB')} — {new Date(term.endDate).toLocaleDateString('en-GB')}
//                 </span>
//               </div>
//               <span className="text-slate-800">|</span>
//               <span className="text-slate-300">{gradeName} / {subjectName}</span>
//             </div>
//           </div>

//           <div className="w-full md:w-72 space-y-4">
//             <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
//               <span className="text-slate-400">Completion</span>
//               <span className={isConcluded ? "text-emerald-500" : "text-school-primary"}>{progressPercent}%</span>
//             </div>
//             <Progress value={progressPercent} className={cn("h-3 bg-slate-950", isConcluded ? "[&>div]:bg-emerald-500" : "[&>div]:bg-school-primary")} />
//           </div>
//         </div>
//       </div>

//       {/* ── TIMELINE ── */}
//       <div className="relative px-4">
//         <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-px bg-slate-800" />

//         <div className="space-y-12">
//           {schedule.length > 0 ? (
//             // FIX: Replaced topic: any with topic: TimelineTopic
//             schedule.map((topic: TimelineTopic, index: number) => (
//               <div key={topic.id} className={cn(
//                 "relative flex flex-col md:flex-row items-center transition-all duration-300",
//                 index % 2 === 0 ? "md:flex-row-reverse" : "",
//                 isConcluded && "opacity-70 grayscale-[0.4]"
//               )}>
//                 <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20">
//                   <div className={cn(
//                     "h-8 w-8 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-lg transition-all",
//                     topic.status === "current" ? "bg-school-primary scale-110 shadow-school-primary/20" : 
//                     topic.status === "completed" ? "bg-emerald-500" : "bg-slate-800"
//                   )}>
//                     {topic.status === "completed" ? <CheckCircle2 className="h-4 w-4 text-white" /> : <Clock className="h-4 w-4 text-slate-500" />}
//                   </div>
//                 </div>

//                 <div className="w-full md:w-[45%] ml-12 md:ml-0">
//                   <div className={cn(
//                     "p-8 rounded-[2.5rem] bg-slate-900 border transition-all hover:border-white/20",
//                     topic.status === "current" ? "border-school-primary/40 shadow-xl" : "border-white/5"
//                   )}>
//                     <div className="flex justify-between mb-4">
//                       <span className="text-[10px] font-black px-3 py-1 bg-slate-950 rounded-full text-slate-500 uppercase tracking-widest">
//                         Week {topic.weekNumber}
//                       </span>
//                       {topic.needsReview && <AlertCircle className="h-4 w-4 text-amber-500 animate-pulse" />}
//                     </div>
//                     <h4 className="text-xl font-bold text-white uppercase italic tracking-tight leading-tight">
//                         {topic.title}
//                     </h4>
//                     <div className="mt-6 flex justify-between items-center border-t border-white/5 pt-6">
//                       <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">
//                         Performance Index: {topic.averagePercent ? `${topic.averagePercent}%` : 'Pending'}
//                       </div>
//                       <button className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center text-slate-500 hover:text-school-primary border border-white/5 transition-all active:scale-95 shadow-inner">
//                         <ChevronRight className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="py-24 text-center bg-slate-900/40 rounded-[3rem] border border-dashed border-white/5">
//               <Archive className="h-12 w-12 text-slate-800 mx-auto mb-4" />
//               <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest italic opacity-50">
//                 Registry Empty: No Topics Mapped for this Term
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




// "use client";

// import { 
//   CheckCircle2, Clock, PlayCircle,
//   Calendar, Archive, GraduationCap,
//   BookOpen
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Progress } from "@/components/ui/progress";
// import { useProfileStore } from "@/store/profileStore";
// import { type TermScheduleResponse } from "@/app/actions/termly-schedule";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface TermTimelineViewProps {
//   data: TermScheduleResponse;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * VISUAL SYLLABUS ROADMAP (Tier 2 & 3)
//  * Rule 11: Direct visual representation of the academic ledger.
//  * Rule 17: Pulls branding from Zustand for consistent institutional UI.
//  */
// export function TermTimelineView({ data }: TermTimelineViewProps) {
//   const { profile } = useProfileStore();
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   const { term, isConcluded, schedule, progressPercent, subjectName, gradeName } = data;

//   return (
//     <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      
//       {/* ── REGISTRY HEADER ── */}
//       <div className={cn(
//         "relative overflow-hidden border rounded-[3rem] p-10 shadow-2xl transition-all duration-500",
//         isConcluded ? "bg-slate-900/40 border-emerald-500/20" : "bg-slate-900 border-white/5"
//       )}>
//         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
//           <div className="space-y-4 text-center md:text-left">
//             <div className="flex items-center justify-center md:justify-start gap-3">
//               {isConcluded ? (
//                 <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
//                   <Archive className="h-3 w-3" /> Ledger Concluded
//                 </div>
//               ) : (
//                 <div 
//                     className="flex items-center gap-2 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg"
//                     style={{ backgroundColor: primaryColor }}
//                 >
//                   <PlayCircle className="h-3 w-3" /> Active Roadmap
//                 </div>
//               )}
//             </div>
            
//             <div>
//                 <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
//                 {term.displayName}
//                 </h1>
//                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2">
//                     Academic Cycle Sync
//                 </p>
//             </div>
            
//             <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-3.5 w-3.5" style={{ color: primaryColor }} />
//                 <span className="text-slate-400">
//                   {new Date(term.startDate).toLocaleDateString('en-GB')} — {new Date(term.endDate).toLocaleDateString('en-GB')}
//                 </span>
//               </div>
//               <span className="opacity-20">|</span>
//               <div className="flex items-center gap-2">
//                 <GraduationCap className="h-3.5 w-3.5" style={{ color: primaryColor }} />
//                 <span className="text-slate-400">{gradeName} / {subjectName}</span>
//               </div>
//             </div>
//           </div>

//           {/* PROGRESS MODULE */}
//           <div className="w-full md:w-72 space-y-4 bg-slate-950/50 p-6 rounded-[2rem] border border-white/5 shadow-inner">
//             <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
//               <span className="text-slate-500 italic">Term Completion</span>
//               <span className="text-lg italic" style={{ color: isConcluded ? '#10b981' : primaryColor }}>
//                   {progressPercent}%
//               </span>
//             </div>
//             <Progress 
//                 value={progressPercent} 
//                 className="h-2 bg-slate-900" 
//                 style={{ 
//                     '--progress-bg': isConcluded ? '#10b981' : primaryColor 
//                 } as any}
//             />
//           </div>
//         </div>

//         {/* Branding Aura */}
//         <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full opacity-10 blur-[100px]" style={{ backgroundColor: primaryColor }} />
//       </div>

//       {/* ── TIMELINE TRACK ── */}
//       <div className="relative px-4">
//         {/* Central Spine */}
//         <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-px bg-white/5" />

//         <div className="space-y-12">
//           {schedule.length > 0 ? (
//             schedule.map((topic, index) => {
//               const isCurrent = topic.status === "current";
//               const isDone = topic.status === "completed";

//               return (
//                 <div key={topic.id} className={cn(
//                   "relative flex flex-col md:flex-row items-center transition-all duration-500",
//                   index % 2 === 0 ? "md:flex-row-reverse" : "",
//                   !isCurrent && !isDone && "opacity-40 grayscale"
//                 )}>
//                   {/* Timeline Node */}
//                   <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20">
//                     <div 
//                         className={cn(
//                             "h-10 w-10 rounded-2xl flex items-center justify-center border-4 border-slate-950 shadow-2xl transition-all duration-500",
//                             isCurrent ? "scale-125 z-30" : "scale-100"
//                         )}
//                         style={{ 
//                             backgroundColor: isCurrent || isDone ? primaryColor : '#1e293b',
//                             borderColor: '#020617' 
//                         }}
//                     >
//                       {isDone ? (
//                           <CheckCircle2 className="h-5 w-5 text-slate-950 stroke-[3]" />
//                       ) : (
//                           <Clock className={cn("h-5 w-5", isCurrent ? "text-slate-950 animate-spin-slow" : "text-slate-500")} />
//                       )}
//                     </div>
//                   </div>

//                   {/* Syllabus Card */}
//                   <div className="w-full md:w-[45%] ml-14 md:ml-0">
//                     <div className={cn(
//                       "p-8 rounded-[2.5rem] bg-slate-900 border transition-all duration-500 hover:border-white/10 group shadow-xl",
//                       isCurrent ? "border-white/10 shadow-2xl" : "border-white/5"
//                     )}
//                     style={isCurrent ? { boxShadow: `0 20px 40px ${primaryColor}10` } : {}}
//                     >
//                       <div className="flex justify-between items-start mb-6">
//                         <span className="text-[10px] font-black px-4 py-1.5 bg-slate-950 rounded-xl text-slate-500 uppercase tracking-widest border border-white/5 shadow-inner">
//                           Registry Node {topic.weekNumber || index + 1}
//                         </span>
//                         {isCurrent && (
//                             <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md uppercase tracking-tighter animate-pulse">
//                                 In-Sync
//                             </span>
//                         )}
//                       </div>

//                       <h4 className="text-xl font-black text-white uppercase italic tracking-tight leading-tight group-hover:text-school-primary transition-colors">
//                           {topic.title}
//                       </h4>

//                       <div className="mt-8 flex justify-between items-center border-t border-white/5 pt-6">
//                         <div className="flex flex-col gap-1">
//                             <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Mastery Telemetry</p>
//                             <p className="text-sm font-black italic" style={{ color: isDone ? primaryColor : '#475569' }}>
//                                 {topic.averagePercent ? `${topic.averagePercent}% Index` : 'Awaiting Data'}
//                             </p>
//                         </div>
                        
//                         <button 
//                             className="h-12 w-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5 text-slate-700 hover:text-white transition-all shadow-inner group-hover:border-school-primary/30"
//                             title="Open Lesson Note"
//                         >
//                           <BookOpen className="h-5 w-5" style={topic.hasLesson ? { color: primaryColor } : {}} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })
//           ) : (
//             <div className="py-32 text-center bg-slate-900/40 rounded-[3rem] border border-dashed border-white/5 shadow-inner">
//               <Archive className="h-12 w-12 text-slate-800 mx-auto mb-4" />
//               <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest italic">
//                 Registry ledger empty: No academic nodes mapped for this cycle.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import React from "react";
import { 
  CheckCircle2, Clock, PlayCircle,
  Calendar, Archive, GraduationCap,
  BookOpen, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type TermScheduleResponse } from "@/app/actions/termly-schedule";

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface TermTimelineViewProps {
  data: TermScheduleResponse;
}

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * VISUAL SYLLABUS ROADMAP (Tier 2/3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for mathematical brand tints.
 */
export function TermTimelineView({ data }: TermTimelineViewProps) {
  const { term, isConcluded, schedule, progressPercent, subjectName, gradeName } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
      
      {/* ── TIMELINE HEADER (Rule 11/19/21) ── */}
      <div className={cn(
        "relative overflow-hidden border rounded-[2rem] p-8 md:p-12 shadow-2xl transition-all duration-500",
        isConcluded 
          ? "bg-surface border-emerald-200" 
          : "bg-card border-border"
      )}>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="space-y-6 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              {isConcluded ? (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest">
                  <Archive className="h-3.5 w-3.5" /> Ledger Concluded
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-school-primary text-on-school-primary text-[10px] font-extrabold px-5 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-school-primary-200">
                  <PlayCircle className="h-4 w-4 animate-pulse" /> Active Roadmap
                </div>
              )}
            </div>
            
            <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-extrabold text-foreground italic uppercase tracking-tighter leading-none">
                {term.displayName}
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground italic opacity-60">
                    Academic Cycle Sync Hub
                </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-school-primary" />
                <span className="tabular-nums">
                  {new Date(term.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} — {new Date(term.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </span>
              </div>
              <div className="hidden sm:block h-1 w-1 rounded-full bg-border" />
              <div className="flex items-center gap-2.5">
                <GraduationCap className="h-4 w-4 text-school-primary" />
                <span>{gradeName} Hub / {subjectName}</span>
              </div>
            </div>
          </div>

          {/* ── PROGRESS HUB (Rule 21) ── */}
          <div className="w-full lg:w-80 space-y-5 bg-surface border border-border p-6 md:p-8 rounded-[2rem] shadow-inner">
            <div className="flex justify-between items-end">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Hub Coverage</p>
              <p className={cn(
                "text-2xl font-extrabold italic tracking-tighter tabular-nums",
                isConcluded ? "text-emerald-500" : "text-school-primary"
              )}>
                {progressPercent}%
              </p>
            </div>
            <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border shadow-sm">
                <div 
                    className={cn(
                      "h-full transition-all duration-1000 ease-out",
                      isConcluded ? "bg-emerald-500" : "bg-school-primary"
                    )}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
          </div>
        </div>

        {/* Decorative Scale Protocol Background */}
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-school-primary-50 blur-[100px] opacity-40 pointer-events-none" />
      </div>

      {/* ── TIMELINE TRACK (Rule 20) ── */}
      <div className="relative px-2 md:px-4">
        {/* Central Spine Hub */}
        <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-0.5 bg-border/40" />

        <div className="space-y-12 md:space-y-16">
          {schedule.length > 0 ? (
            schedule.map((topic, index) => {
              const isCurrent = topic.status === "current";
              const isDone = topic.status === "completed";

              return (
                <div key={topic.id} className={cn(
                  "relative flex flex-col md:flex-row items-center transition-all duration-700",
                  index % 2 === 0 ? "md:flex-row-reverse" : "",
                  !isCurrent && !isDone && "opacity-40 grayscale"
                )}>
                  {/* Timeline Indicator Hub (Rule 21) */}
                  <div className="absolute left-[31px] md:left-1/2 -translate-x-1/2 z-20">
                    <div 
                        className={cn(
                            "h-10 w-10 rounded-2xl flex items-center justify-center border-4 transition-all duration-500 shadow-xl",
                            "bg-background", // Rule 18
                            isCurrent ? "border-school-primary scale-125 z-30" : "border-border"
                        )}
                    >
                      {isDone ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 stroke-[3]" />
                      ) : (
                          <Clock className={cn("h-5 w-5 transition-colors", isCurrent ? "text-school-primary animate-spin-slow" : "text-muted-foreground/30")} />
                      )}
                    </div>
                  </div>

                  {/* ── SYLLABUS MODULE CARD (Rule 19) ── */}
                  <div className="w-full md:w-[45%] ml-16 md:ml-0">
                    <div className={cn(
                      "p-6 md:p-8 rounded-[2rem] bg-card border transition-all duration-500 hover:border-school-primary-200 group shadow-lg",
                      isCurrent ? "border-school-primary-200 shadow-school-primary-50 ring-1 ring-school-primary-100" : "border-border shadow-sm"
                    )}>
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-[9px] font-extrabold px-3 py-1.5 bg-surface rounded-xl text-muted-foreground uppercase tracking-widest border border-border shadow-sm italic">
                          Module {topic.weekNumber || index + 1}
                        </span>
                        {isCurrent && (
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 animate-in zoom-in">
                                <Activity className="h-3 w-3 animate-pulse" />
                                <span className="text-[8px] font-extrabold uppercase tracking-widest">Active</span>
                            </div>
                        )}
                      </div>

                      <h4 className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter leading-tight group-hover:text-school-primary transition-colors">
                          {topic.title}
                      </h4>

                      <div className="mt-8 flex justify-between items-center border-t border-border pt-6">
                        <div className="space-y-1">
                            <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Hub Telemetry</p>
                            <p className={cn(
                                "text-sm font-extrabold italic tracking-tight tabular-nums",
                                isDone ? "text-school-primary" : "text-muted-foreground/60"
                            )}>
                                {topic.averagePercent ? `${topic.averagePercent}% Score` : 'Registry Pending'}
                            </p>
                        </div>
                        
                        <button 
                            className="h-12 w-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-muted-foreground hover:text-school-primary hover:border-school-primary-200 transition-all shadow-sm active:scale-90"
                            title="Audit Learning Hub"
                        >
                          <BookOpen className={cn("h-5 w-5", topic.hasLesson && "text-school-primary")} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* ── EMPTY LEDGER STATE ── */
            <div className="py-24 text-center bg-surface border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center space-y-6">
              <Archive className="h-12 w-12 text-muted-foreground/20" />
              <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest italic leading-relaxed max-w-[200px]">
                Registry ledger empty: No academic modules mapped for this cycle.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}