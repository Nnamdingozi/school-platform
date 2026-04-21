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


"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────────────────────

interface SubjectAssignment {
  id: string;
  grade: {
    displayName: string;
  };
  subject: {
    name: string;
  };
}

interface SubjectSelectorProps {
  assignments: SubjectAssignment[];
  selectedAssignment: SubjectAssignment | null;
  setSelectedAssignment: (assignment: SubjectAssignment) => void;
}

// ── Main Component ──────────────────────────────────────────────────────────

export function SubjectSelector({
  assignments,
  selectedAssignment,
  setSelectedAssignment,
}: SubjectSelectorProps) {
  return (
    <div className="space-y-4">
      {assignments.map((item: SubjectAssignment) => {
        // FIX: Utilize selectedAssignment to apply active styling
        // This resolves the 'unused variable' warning
        const isActive = selectedAssignment?.id === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setSelectedAssignment(item)}
            className={cn(
              "w-full p-5 rounded-2xl border transition-all duration-300 text-left group",
              isActive
                ? "bg-school-primary border-school-primary shadow-xl shadow-school-primary/10"
                : "bg-slate-900 border-white/5 hover:border-white/10 hover:bg-slate-800"
            )}
          >
            <p
              className={cn(
                "text-[9px] font-black uppercase tracking-[0.2em] mb-1",
                isActive ? "text-slate-900/60" : "text-slate-500 group-hover:text-slate-400"
              )}
            >
              {item.grade.displayName}
            </p>

            <h4
              className={cn(
                "text-base font-black uppercase italic tracking-tight",
                isActive ? "text-slate-950" : "text-white"
              )}
            >
              {item.subject.name}
            </h4>
          </button>
        );
      })}

      {assignments.length === 0 && (
        <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-white/5">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                No active assignments
            </p>
        </div>
      )}
    </div>
  );
}