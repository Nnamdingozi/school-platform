// export function SubjectSelector({
//     assignments,
//     selectedAssignment,
//     setSelectedAssignment,
//   }: any) {
//     return (
//       <div className="space-y-4">
//         {assignments.map((item: any) => (
//           <button
//             key={item.id}
//             onClick={() => setSelectedAssignment(item)}
//             className="w-full p-5 rounded-2xl border text-left bg-slate-900"
//           >
//             <p className="text-[9px] font-black uppercase text-slate-500">
//               {item.grade.displayName}
//             </p>
  
//             <h4 className="text-base font-bold uppercase italic text-white">
//               {item.subject.name}
//             </h4>
//           </button>
//         ))}
//       </div>
//     );
//   }


// "use client";

// import React from "react";
// import { cn } from "@/lib/utils";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface SubjectAssignment {
//   id: string;
//   grade: {
//     displayName: string;
//   };
//   subject: {
//     name: string;
//   };
// }

// interface SubjectSelectorProps {
//   assignments: SubjectAssignment[];
//   selectedAssignment: SubjectAssignment | null;
//   setSelectedAssignment: (assignment: SubjectAssignment) => void;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function SubjectSelector({
//   assignments,
//   selectedAssignment,
//   setSelectedAssignment,
// }: SubjectSelectorProps) {
//   return (
//     <div className="space-y-4">
//       {assignments.map((item: SubjectAssignment) => {
//         // FIX: Utilize selectedAssignment to apply active styling
//         // This resolves the 'unused variable' warning
//         const isActive = selectedAssignment?.id === item.id;

//         return (
//           <button
//             key={item.id}
//             onClick={() => setSelectedAssignment(item)}
//             className={cn(
//               "w-full p-5 rounded-2xl border transition-all duration-300 text-left group",
//               isActive
//                 ? "bg-school-primary border-school-primary shadow-xl shadow-school-primary/10"
//                 : "bg-slate-900 border-white/5 hover:border-white/10 hover:bg-slate-800"
//             )}
//           >
//             <p
//               className={cn(
//                 "text-[9px] font-black uppercase tracking-[0.2em] mb-1",
//                 isActive ? "text-slate-900/60" : "text-slate-500 group-hover:text-slate-400"
//               )}
//             >
//               {item.grade.displayName}
//             </p>

//             <h4
//               className={cn(
//                 "text-base font-black uppercase italic tracking-tight",
//                 isActive ? "text-slate-950" : "text-white"
//               )}
//             >
//               {item.subject.name}
//             </h4>
//           </button>
//         );
//       })}

//       {assignments.length === 0 && (
//         <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-white/5">
//             <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
//                 No active assignments
//             </p>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import React from "react";
// import { cn } from "@/lib/utils";
// import { useProfileStore } from "@/store/profileStore";
// import { BookOpen, CheckCircle2 } from "lucide-react";

// // ── Types ───────────────────────────────────────────────────────────────────

// /**
//  * Rule 15: Strict Interface Definition.
//  * Matches 'AssignmentWithDetails' from useExamStore to ensure seamless prop syncing.
//  */
// export interface SubjectAssignment {
//   id: string;
//   gradeId: string;
//   subjectId: string;
//   grade: {
//     id: string;
//     displayName: string;
//   };
//   subject: {
//     id: string;
//     name: string;
//   };
// }

// interface SubjectSelectorProps {
//   assignments: SubjectAssignment[];
//   selectedAssignment: SubjectAssignment | null;
//   setSelectedAssignment: (assignment: SubjectAssignment) => void;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * INSTITUTIONAL SUBJECT SELECTOR (Tier 2)
//  * Rule 17: Uses Zustand Store for institutional branding.
//  * Rule 11: Direct reflection of the teacher's authorized assignment registry.
//  */
// export function SubjectSelector({
//   assignments,
//   selectedAssignment,
//   setSelectedAssignment,
// }: SubjectSelectorProps) {
//   const { profile } = useProfileStore();
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {assignments.map((item: SubjectAssignment) => {
//         const isActive = selectedAssignment?.id === item.id;

//         return (
//           <button
//             key={item.id}
//             type="button"
//             onClick={() => setSelectedAssignment(item)}
//             className={cn(
//               "relative w-full p-6 rounded-[2rem] border transition-all duration-300 text-left group overflow-hidden shadow-xl",
//               isActive
//                 ? "bg-slate-900 border-transparent scale-[1.02]"
//                 : "bg-slate-950 border-white/5 hover:border-white/10"
//             )}
//             style={isActive ? { border: `2px solid ${primaryColor}` } : {}}
//           >
//             {/* Branding Accent */}
//             {isActive && (
//                 <div 
//                     className="absolute top-0 right-0 p-4 opacity-10"
//                     style={{ color: primaryColor }}
//                 >
//                     <BookOpen className="h-12 w-12" />
//                 </div>
//             )}

//             <div className="relative z-10 flex items-start justify-between gap-4">
//                 <div className="space-y-4">
//                     <div 
//                         className={cn(
//                             "h-10 w-10 rounded-xl flex items-center justify-center border transition-colors",
//                             isActive ? "bg-slate-950 border-white/10" : "bg-slate-900 border-white/5"
//                         )}
//                     >
//                         <BookOpen 
//                             className="h-5 w-5" 
//                             style={{ color: isActive ? primaryColor : '#475569' }} 
//                         />
//                     </div>

//                     <div className="space-y-1">
//                         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
//                             {item.grade.displayName}
//                         </p>
//                         <h4 className="text-xl font-black uppercase italic tracking-tighter text-white leading-tight">
//                             {item.subject.name}
//                         </h4>
//                     </div>
//                 </div>

//                 {isActive && (
//                     <div 
//                         className="h-6 w-6 rounded-full flex items-center justify-center animate-in zoom-in"
//                         style={{ backgroundColor: primaryColor }}
//                     >
//                         <CheckCircle2 className="h-4 w-4 text-slate-950 stroke-[3]" />
//                     </div>
//                 )}
//             </div>
//           </button>
//         );
//       })}

//       {assignments.length === 0 && (
//         <div className="col-span-full py-20 text-center bg-slate-900/50 rounded-[3rem] border border-dashed border-white/5">
//             <div className="h-12 w-12 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
//                 <BookOpen className="h-6 w-6 text-slate-800" />
//             </div>
//             <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic">
//                 Authorized registry entries not discovered
//             </p>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { BookOpen, CheckCircle2 } from "lucide-react";

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

/**
 * Rule 15: Strict Interface Definition.
 */
export interface SubjectAssignment {
  id: string;
  gradeId: string;
  subjectId: string;
  grade: {
    id: string;
    displayName: string;
  };
  subject: {
    id: string;
    name: string;
  };
}

interface SubjectSelectorProps {
  assignments: SubjectAssignment[];
  selectedAssignment: SubjectAssignment | null;
  setSelectedAssignment: (assignment: SubjectAssignment) => void;
}

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * INSTITUTIONAL SUBJECT SELECTOR (Tier 2)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function SubjectSelector({
  assignments,
  selectedAssignment,
  setSelectedAssignment,
}: SubjectSelectorProps) {


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-in fade-in duration-700">
      {assignments.map((item: SubjectAssignment) => {
        const isActive = selectedAssignment?.id === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedAssignment(item)}
            className={cn(
              "relative w-full p-6 transition-all duration-300 text-left group overflow-hidden shadow-xl",
              "rounded-[2rem] border", // Rule 19
              isActive
                ? "bg-card border-school-primary scale-[1.02] shadow-school-primary-200/20"
                : "bg-surface border-border hover:border-school-primary-200" // Rule 18 & 21
            )}
          >
            {/* ── BRANDING ACCENT (Rule 21) ── */}
            {isActive && (
                <div className="absolute top-0 right-0 p-4 text-school-primary opacity-10">
                    <BookOpen className="h-16 w-16" />
                </div>
            )}

            <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="space-y-6">
                    {/* Icon Hub (Rule 21) */}
                    <div 
                        className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-500 shadow-inner",
                            isActive 
                                ? "bg-school-primary text-on-school-primary border-school-primary" 
                                : "bg-card border-border text-muted-foreground/40 group-hover:text-school-primary group-hover:border-school-primary-200"
                        )}
                    >
                        <BookOpen className="h-6 w-6" />
                    </div>

                    <div className="space-y-1.5">
                        {/* Rule 11: Metadata Labels */}
                        <p className={cn(
                            "text-[10px] font-bold uppercase tracking-widest transition-colors",
                            isActive ? "text-school-primary" : "text-muted-foreground"
                        )}>
                            {item.grade.displayName}
                        </p>
                        {/* Rule 11: Header Scaling */}
                        <h4 className="text-xl font-extrabold uppercase italic tracking-tighter text-foreground leading-tight">
                            {item.subject.name}
                        </h4>
                    </div>
                </div>

                {/* Status Sentinel */}
                {isActive && (
                    <div className="h-8 w-8 rounded-full bg-school-primary text-on-school-primary flex items-center justify-center animate-in zoom-in shadow-lg">
                        <CheckCircle2 className="h-5 w-5 stroke-[3]" />
                    </div>
                )}
            </div>
          </button>
        );
      })}

      {/* ── EMPTY STATE (Rule 18/19) ── */}
      {assignments.length === 0 && (
        <div className="col-span-full py-24 text-center bg-surface border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center space-y-6">
            <div className="h-16 w-16 bg-card rounded-2xl border border-border flex items-center justify-center shadow-lg">
                <BookOpen className="h-8 w-8 text-muted-foreground/20" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] italic">
                Authorized Registry Records Not Discovered
            </p>
        </div>
      )}
    </div>
  );
}