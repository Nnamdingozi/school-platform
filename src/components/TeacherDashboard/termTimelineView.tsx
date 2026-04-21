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



"use client";

import { 
  CheckCircle2, Clock, PlayCircle, AlertCircle, 
  Calendar, ChevronRight, Archive 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

// ── Types ───────────────────────────────────────────────────────────────────

interface TimelineTopic {
  id: string;
  title: string;
  weekNumber: number | null;
  status: "completed" | "current" | "pending";
  hasLesson: boolean;
  averagePercent?: string | null;
  needsReview?: boolean;
}

interface TermTimelineData {
  term: {
    displayName: string;
    startDate: string | Date;
    endDate: string | Date;
  };
  isConcluded: boolean;
  schedule: TimelineTopic[];
  progressPercent: number;
  subjectName: string;
  gradeName: string;
}

interface TermTimelineViewProps {
  // FIX: Replaced 'any' with specific interface
  data: TermTimelineData;
}

// ── Main Component ──────────────────────────────────────────────────────────

export function TermTimelineView({ data }: TermTimelineViewProps) {
  const { term, isConcluded, schedule, progressPercent, subjectName, gradeName } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      
      {/* ── HEADER ── */}
      <div className={cn(
        "relative overflow-hidden border rounded-[3rem] p-10 shadow-2xl transition-all duration-500",
        isConcluded ? "bg-slate-900/40 border-emerald-500/20" : "bg-slate-900 border-white/5"
      )}>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              {isConcluded ? (
                <div className="flex items-center gap-2 bg-emerald-500 text-slate-950 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                  <Archive className="h-3 w-3" /> Term Concluded
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-school-primary text-slate-950 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                  <PlayCircle className="h-3 w-3" /> Active Roadmap
                </div>
              )}
            </div>
            
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
              {term.displayName}
            </h1>
            
            <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(term.startDate).toLocaleDateString('en-GB')} — {new Date(term.endDate).toLocaleDateString('en-GB')}
                </span>
              </div>
              <span className="text-slate-800">|</span>
              <span className="text-slate-300">{gradeName} / {subjectName}</span>
            </div>
          </div>

          <div className="w-full md:w-72 space-y-4">
            <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
              <span className="text-slate-400">Completion</span>
              <span className={isConcluded ? "text-emerald-500" : "text-school-primary"}>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className={cn("h-3 bg-slate-950", isConcluded ? "[&>div]:bg-emerald-500" : "[&>div]:bg-school-primary")} />
          </div>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div className="relative px-4">
        <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-px bg-slate-800" />

        <div className="space-y-12">
          {schedule.length > 0 ? (
            // FIX: Replaced topic: any with topic: TimelineTopic
            schedule.map((topic: TimelineTopic, index: number) => (
              <div key={topic.id} className={cn(
                "relative flex flex-col md:flex-row items-center transition-all duration-300",
                index % 2 === 0 ? "md:flex-row-reverse" : "",
                isConcluded && "opacity-70 grayscale-[0.4]"
              )}>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-lg transition-all",
                    topic.status === "current" ? "bg-school-primary scale-110 shadow-school-primary/20" : 
                    topic.status === "completed" ? "bg-emerald-500" : "bg-slate-800"
                  )}>
                    {topic.status === "completed" ? <CheckCircle2 className="h-4 w-4 text-white" /> : <Clock className="h-4 w-4 text-slate-500" />}
                  </div>
                </div>

                <div className="w-full md:w-[45%] ml-12 md:ml-0">
                  <div className={cn(
                    "p-8 rounded-[2.5rem] bg-slate-900 border transition-all hover:border-white/20",
                    topic.status === "current" ? "border-school-primary/40 shadow-xl" : "border-white/5"
                  )}>
                    <div className="flex justify-between mb-4">
                      <span className="text-[10px] font-black px-3 py-1 bg-slate-950 rounded-full text-slate-500 uppercase tracking-widest">
                        Week {topic.weekNumber}
                      </span>
                      {topic.needsReview && <AlertCircle className="h-4 w-4 text-amber-500 animate-pulse" />}
                    </div>
                    <h4 className="text-xl font-bold text-white uppercase italic tracking-tight leading-tight">
                        {topic.title}
                    </h4>
                    <div className="mt-6 flex justify-between items-center border-t border-white/5 pt-6">
                      <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">
                        Performance Index: {topic.averagePercent ? `${topic.averagePercent}%` : 'Pending'}
                      </div>
                      <button className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center text-slate-500 hover:text-school-primary border border-white/5 transition-all active:scale-95 shadow-inner">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 text-center bg-slate-900/40 rounded-[3rem] border border-dashed border-white/5">
              <Archive className="h-12 w-12 text-slate-800 mx-auto mb-4" />
              <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest italic opacity-50">
                Registry Empty: No Topics Mapped for this Term
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}