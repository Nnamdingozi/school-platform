// import { CheckCircle2 } from "lucide-react";

// export function SyllabusSelector({
//   termGroups,
//   selectedTopicIds,
//   setSelectedTopicIds,
// }: any) {
//   return (
//     <div className="space-y-8">
//       {termGroups.map((term: any) => (
//         <div key={term.id} className="space-y-4">
//           <h3 className="text-xs font-black uppercase text-school-primary italic px-2">
//             {term.displayName}
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//             {term.topics.map((t: any) => (
//               <button
//                 key={t.id}
//                 onClick={() =>
//                   setSelectedTopicIds((prev: string[]) =>
//                     prev.includes(t.id)
//                       ? prev.filter((x) => x !== t.id)
//                       : [...prev, t.id]
//                   )
//                 }
//                 className="p-4 rounded-xl border text-left text-[11px] font-bold bg-slate-900 text-slate-400 flex justify-between"
//               >
//                 {t.title}

//                 {selectedTopicIds.includes(t.id) && (
//                   <CheckCircle2 className="h-4 w-4" />
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


// "use client";

// import React from "react";
// import { CheckCircle2, Layers } from "lucide-react";
// import { cn } from "@/lib/utils";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface Topic {
//   id: string;
//   title: string;
// }

// interface TermGroup {
//   id: string;
//   displayName: string;
//   topics: Topic[];
// }

// interface SyllabusSelectorProps {
//   // FIX: Replaced any with specific interfaces
//   termGroups: TermGroup[];
//   selectedTopicIds: string[];
//   setSelectedTopicIds: React.Dispatch<React.SetStateAction<string[]>>;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function SyllabusSelector({
//   termGroups,
//   selectedTopicIds,
//   setSelectedTopicIds,
// }: SyllabusSelectorProps) {
  
//   const handleToggle = (id: string) => {
//     setSelectedTopicIds((prev: string[]) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   return (
//     <div className="space-y-10 animate-in fade-in duration-700">
//       {termGroups.length === 0 ? (
//         <div className="py-20 text-center bg-slate-900/40 rounded-[3rem] border border-dashed border-white/5 opacity-30">
//             <Layers className="h-10 w-10 text-slate-800 mx-auto mb-4" />
//             <p className="text-[10px] font-black uppercase tracking-widest">
//                 Please select a subject module to load syllabus content
//             </p>
//         </div>
//       ) : (
//         termGroups.map((term: TermGroup) => (
//           <div key={term.id} className="space-y-4">
//             {/* Term Header */}
//             <div className="flex items-center gap-3 px-2">
//                 <div className="h-1 w-6 bg-school-primary/40 rounded-full" />
//                 <h3 className="text-xs font-black uppercase text-school-primary italic tracking-widest">
//                     {term.displayName} Registry
//                 </h3>
//             </div>

//             {/* Topics Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {term.topics.map((t: Topic) => {
//                 const isSelected = selectedTopicIds.includes(t.id);
                
//                 return (
//                   <button
//                     key={t.id}
//                     onClick={() => handleToggle(t.id)}
//                     className={cn(
//                       "p-5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group",
//                       isSelected
//                         ? "bg-school-primary/10 border-school-primary text-school-primary shadow-inner"
//                         : "bg-slate-950 border-white/5 text-slate-500 hover:border-white/10 hover:bg-slate-900"
//                     )}
//                   >
//                     <span className={cn(
//                         "text-[11px] font-bold uppercase tracking-tight truncate pr-4",
//                         isSelected ? "text-school-primary" : "group-hover:text-slate-300"
//                     )}>
//                         {t.title}
//                     </span>

//                     {isSelected ? (
//                       <CheckCircle2 className="h-4 w-4 shrink-0 animate-in zoom-in-50" />
//                     ) : (
//                         <div className="h-4 w-4 rounded-full border border-white/10 shrink-0" />
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }



// "use client";

// import React, { Dispatch, SetStateAction } from "react";
// import { CheckCircle2, Layers, ShieldCheck } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useProfileStore } from "@/store/profileStore";

// // ── Types ───────────────────────────────────────────────────────────────────

// export interface TopicNode {
//   id: string;
//   title: string;
// }

// export interface TermGroup {
//   id: string;
//   displayName: string;
//   topics: TopicNode[];
// }

// interface SyllabusSelectorProps {
//   termGroups: TermGroup[];
//   selectedTopicIds: string[];
//   setSelectedTopicIds: Dispatch<SetStateAction<string[]>>;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * INSTITUTIONAL SYLLABUS MAPPER (Tier 2)
//  * Rule 17: Pulls primaryColor from Zustand store for state branding.
//  * Rule 11: Real-time selection of syllabus nodes for assessment generation.
//  */
// export function SyllabusSelector({
//   termGroups,
//   selectedTopicIds,
//   setSelectedTopicIds,
// }: SyllabusSelectorProps) {
//   const { profile } = useProfileStore();
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   /**
//    * Rule 14: Optimistic Toggle
//    * Updates selection state immediately for a high-performance feel.
//    */
//   const handleToggle = (id: string) => {
//     setSelectedTopicIds((prev: string[]) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   return (
//     <div className="space-y-12 animate-in fade-in duration-700">
//       {termGroups.length === 0 ? (
//         <div className="py-32 text-center bg-slate-900/40 rounded-[3rem] border border-dashed border-white/5">
//             <div className="h-16 w-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5">
//                 <Layers className="h-8 w-8 text-slate-800" />
//             </div>
//             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 italic">
//                 Awaiting Module Selection to Index Syllabus
//             </p>
//         </div>
//       ) : (
//         termGroups.map((term: TermGroup) => (
//           <div key={term.id} className="space-y-6">
//             {/* ── TERM HEADER ── */}
//             <div className="flex items-center justify-between px-4">
//                 <div className="flex items-center gap-3">
//                     <div className="h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} />
//                     <h3 className="text-sm font-black uppercase text-white italic tracking-tighter">
//                         {term.displayName} Registry
//                     </h3>
//                 </div>
//                 <BadgeCheck count={term.topics.filter(t => selectedTopicIds.includes(t.id)).length} />
//             </div>

//             {/* ── TOPICS GRID ── */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {term.topics.map((topic: TopicNode) => {
//                 const isSelected = selectedTopicIds.includes(topic.id);
                
//                 return (
//                   <button
//                     key={topic.id}
//                     type="button"
//                     onClick={() => handleToggle(topic.id)}
//                     className={cn(
//                       "group p-6 rounded-[2rem] border transition-all duration-300 flex items-center justify-between text-left shadow-xl",
//                       isSelected
//                         ? "bg-slate-900 border-transparent scale-[1.01]"
//                         : "bg-slate-950 border-white/5 hover:border-white/10"
//                     )}
//                     style={isSelected ? { border: `2px solid ${primaryColor}40`, boxShadow: `0 0 20px ${primaryColor}10` } : {}}
//                   >
//                     <div className="flex items-center gap-4 flex-1 min-w-0">
//                         <div className={cn(
//                             "h-8 w-8 rounded-xl border flex items-center justify-center transition-colors shrink-0",
//                             isSelected ? "bg-slate-950 border-white/10" : "bg-slate-900 border-white/5"
//                         )}>
//                             <ShieldCheck 
//                                 className="h-4 w-4" 
//                                 style={{ color: isSelected ? primaryColor : '#1e293b' }} 
//                             />
//                         </div>
//                         <span className={cn(
//                             "text-xs font-black uppercase tracking-widest truncate transition-colors",
//                             isSelected ? "text-white" : "text-slate-500 group-hover:text-slate-300"
//                         )}>
//                             {topic.title}
//                         </span>
//                     </div>

//                     <div className="ml-4 shrink-0">
//                         {isSelected ? (
//                         <CheckCircle2 
//                             className="h-5 w-5 animate-in zoom-in" 
//                             style={{ color: primaryColor }}
//                         />
//                         ) : (
//                             <div className="h-5 w-5 rounded-lg border border-white/5 bg-slate-900" />
//                         )}
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// /**
//  * ── LOCAL HELPER ──
//  */
// function BadgeCheck({ count }: { count: number }) {
//     if (count === 0) return null;
//     return (
//         <span className="bg-slate-900 border border-white/10 text-[9px] font-black text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest">
//             {count} Nodes Staged
//         </span>
//     );
// }


"use client";

import React, { Dispatch, SetStateAction } from "react";
import { CheckCircle2, Layers, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/store/profileStore";

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

export interface TopicHub {
  id: string;
  title: string;
}

export interface TermGroup {
  id: string;
  displayName: string;
  topics: TopicHub[];
}

interface SyllabusSelectorProps {
  termGroups: TermGroup[];
  selectedTopicIds: string[];
  setSelectedTopicIds: Dispatch<SetStateAction<string[]>>;
}

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * INSTITUTIONAL SYLLABUS MAPPER (Tier 2)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function SyllabusSelector({
  termGroups,
  selectedTopicIds,
  setSelectedTopicIds,
}: SyllabusSelectorProps) {
  /**
   * Rule 14: Optimistic Toggle Hub
   * Synchronizes selection state for high-velocity engine generation.
   */
  const handleToggle = (id: string) => {
    setSelectedTopicIds((prev: string[]) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {termGroups.length === 0 ? (
        /* ── EMPTY HUB STATE (Rule 18/19) ── */
        <div className="py-32 text-center bg-surface border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center space-y-6">
            <div className="h-16 w-16 bg-card rounded-2xl border border-border flex items-center justify-center mx-auto shadow-lg">
                <Layers className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic leading-relaxed max-w-xs">
                Awaiting Hub Selection to Index Academic Syllabus
            </p>
        </div>
      ) : (
        termGroups.map((term: TermGroup) => (
          <div key={term.id} className="space-y-6">
            {/* ── TERM REGISTRY HEADER (Rule 11) ── */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    {/* Rule 21 Scale Protocol Accent */}
                    <div className="h-2 w-2 rounded-full bg-school-primary shadow-[0_0_10px_rgba(var(--school-primary-raw),0.5)]" />
                    <h3 className="text-sm font-extrabold text-foreground uppercase italic tracking-tighter">
                        {term.displayName} Registry
                    </h3>
                </div>
                <BadgeSync count={term.topics.filter(t => selectedTopicIds.includes(t.id)).length} />
            </div>

            {/* ── TOPICS GRID (Rule 20) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {term.topics.map((topic: TopicHub) => {
                const isSelected = selectedTopicIds.includes(topic.id);
                
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleToggle(topic.id)}
                    className={cn(
                      "group p-6 rounded-[2rem] border transition-all duration-300 flex items-center justify-between text-left shadow-xl",
                      isSelected
                        ? "bg-card border-school-primary scale-[1.01] shadow-school-primary-200/10"
                        : "bg-surface border-border hover:border-school-primary-100" // Rule 18 & 21
                    )}
                  >
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                        {/* Rule 21 Scale Protocol Icon container */}
                        <div className={cn(
                            "h-10 w-10 rounded-xl border flex items-center justify-center transition-all duration-500 shadow-inner",
                            isSelected 
                                ? "bg-school-primary text-on-school-primary border-school-primary" 
                                : "bg-card border-border text-muted-foreground group-hover:text-school-primary"
                        )}>
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <span className={cn(
                            "text-xs font-extrabold uppercase tracking-widest truncate transition-colors italic",
                            isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}>
                            {topic.title}
                        </span>
                    </div>

                    <div className="ml-4 shrink-0">
                        {isSelected ? (
                        <div className="h-6 w-6 rounded-full bg-school-primary text-on-school-primary flex items-center justify-center animate-in zoom-in shadow-lg">
                            <CheckCircle2 className="h-4 w-4 stroke-[3]" />
                        </div>
                        ) : (
                            <div className="h-6 w-6 rounded-xl border border-border bg-card shadow-inner group-hover:border-school-primary-200 transition-colors" />
                        )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/**
 * ── LOCAL HELPER (Rule 11/21) ──
 */
function BadgeSync({ count }: { count: number }) {
    if (count === 0) return null;
    return (
        <span className="bg-school-primary-50 border border-school-primary-200 text-[9px] font-extrabold text-school-primary px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm italic tabular-nums">
            {count} Modules Staged
        </span>
    );
}