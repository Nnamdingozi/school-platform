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


"use client";

import React from "react";
import { CheckCircle2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────────────────────

interface Topic {
  id: string;
  title: string;
}

interface TermGroup {
  id: string;
  displayName: string;
  topics: Topic[];
}

interface SyllabusSelectorProps {
  // FIX: Replaced any with specific interfaces
  termGroups: TermGroup[];
  selectedTopicIds: string[];
  setSelectedTopicIds: React.Dispatch<React.SetStateAction<string[]>>;
}

// ── Main Component ──────────────────────────────────────────────────────────

export function SyllabusSelector({
  termGroups,
  selectedTopicIds,
  setSelectedTopicIds,
}: SyllabusSelectorProps) {
  
  const handleToggle = (id: string) => {
    setSelectedTopicIds((prev: string[]) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {termGroups.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/40 rounded-[3rem] border border-dashed border-white/5 opacity-30">
            <Layers className="h-10 w-10 text-slate-800 mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">
                Please select a subject module to load syllabus content
            </p>
        </div>
      ) : (
        termGroups.map((term: TermGroup) => (
          <div key={term.id} className="space-y-4">
            {/* Term Header */}
            <div className="flex items-center gap-3 px-2">
                <div className="h-1 w-6 bg-school-primary/40 rounded-full" />
                <h3 className="text-xs font-black uppercase text-school-primary italic tracking-widest">
                    {term.displayName} Registry
                </h3>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {term.topics.map((t: Topic) => {
                const isSelected = selectedTopicIds.includes(t.id);
                
                return (
                  <button
                    key={t.id}
                    onClick={() => handleToggle(t.id)}
                    className={cn(
                      "p-5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group",
                      isSelected
                        ? "bg-school-primary/10 border-school-primary text-school-primary shadow-inner"
                        : "bg-slate-950 border-white/5 text-slate-500 hover:border-white/10 hover:bg-slate-900"
                    )}
                  >
                    <span className={cn(
                        "text-[11px] font-bold uppercase tracking-tight truncate pr-4",
                        isSelected ? "text-school-primary" : "group-hover:text-slate-300"
                    )}>
                        {t.title}
                    </span>

                    {isSelected ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 animate-in zoom-in-50" />
                    ) : (
                        <div className="h-4 w-4 rounded-full border border-white/10 shrink-0" />
                    )}
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