// import { Database, Zap, CheckCircle2 } from "lucide-react";
// import { ExamStatCard } from "@/components/shared/examComponent";

// export function ArchitectStats({ stats }: { stats: any }) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       <ExamStatCard
//         label="Subject Bank"
//         value={stats?.totalExams ?? 0}
//         sub="Items available"
//         icon={Database}
//       />

//       <ExamStatCard
//         label="Active Sessions"
//         value="Live"
//         sub="CBT Engine Online"
//         icon={Zap}
//         colorClass="text-school-primary"
//       />

//       <ExamStatCard
//         label="Grading Index"
//         value={`${stats?.completionRate ?? 0}%`}
//         sub="Global Grad Rate"
//         icon={CheckCircle2}
//         colorClass="text-emerald-500"
//       />
//     </div>
//   );
// }


// import { Database, Zap, CheckCircle2 } from "lucide-react";
// import { ExamStatCard } from "@/components/shared/examComponent";
// import {getErrorMessage} from "@/lib/error-handler"


// // ── Types ───────────────────────────────────────────────────────────────────

// interface ArchitectStatsData {
//   totalExams: number;
//   completionRate: number;
// }

// interface ArchitectStatsProps {
//   stats: ArchitectStatsData | null | undefined;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function ArchitectStats({ stats }: ArchitectStatsProps) {
//   // Example of using getErrorMessage if logic was added here
//   try {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <ExamStatCard
//           label="Subject Bank"
//           value={stats?.totalExams ?? 0}
//           sub="Items available"
//           icon={Database}
//         />

//         <ExamStatCard
//           label="Active Sessions"
//           value="Live"
//           sub="CBT Engine Online"
//           icon={Zap}
//           colorClass="text-school-primary"
//         />

//         <ExamStatCard
//           label="Grading Index"
//           value={`${stats?.completionRate ?? 0}%`}
//           sub="Global Grad Rate"
//           icon={CheckCircle2}
//           colorClass="text-emerald-500"
//         />
//       </div>
//     );
//   } catch (error) {
//     console.error(getErrorMessage(error));
//     return null;
//   }
// }




// "use client";

// import React from "react";
// import { Database, Zap, CheckCircle2 } from "lucide-react";
// import { ExamStatCard } from "@/components/shared/examComponent";
// import { getErrorMessage } from "@/lib/error-handler";
// import { cn } from "@/lib/utils";

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface ArchitectStatsData {
//   totalExams: number;
//   completionRate: number;
// }

// interface ArchitectStatsProps {
//   stats: ArchitectStatsData | null | undefined;
//   className?: string; // This is for the container div
// }

// /**
//  * ARCHITECT STATS (Tier 2/3)
//  * Rule 15: Resolved Type Error 2322 by removing unsupported className from child.
//  * Rule 20: Responsive grid scaling.
//  * Rule 19: Geometric alignment with Master Registry.
//  */
// export function ArchitectStats({ stats, className }: ArchitectStatsProps) {
//   try {
//     return (
//       <div 
//         className={cn(
//           "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8", 
//           className
//         )}
//       >
//         {/* ── SUBJECT VOLUME ── */}
//         <ExamStatCard
//           label="Subject Bank"
//           value={stats?.totalExams ?? 0}
//           sub="Items available"
//           icon={Database}
//         />

//         {/* ── ENGINE STATUS ── */}
//         <ExamStatCard
//           label="Active Sessions"
//           value="Live"
//           sub="CBT Engine Online"
//           icon={Zap}
//           // COMPILER FIX: Removed 'className' as it is not defined in ExamStatCardProps
//           colorClass="text-school-primary" 
//         />

//         {/* ── PERFORMANCE INDEX ── */}
//         <ExamStatCard
//           label="Grading Index"
//           value={`${stats?.completionRate ?? 0}%`}
//           sub="Global Grad Rate"
//           icon={CheckCircle2}
//           colorClass="text-emerald-500"
//         />
//       </div>
//     );
//   } catch (error) {
//     // Rule 15: Safe error handling
//     console.error(`[ArchitectStats] Sync Error: ${getErrorMessage(error)}`);
//     return (
//       <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive text-[10px] font-bold uppercase tracking-widest">
//         Telemetry Sync Failed
//       </div>
//     );
//   }
// }


"use client";

import React from "react";
import { Database, Zap, CheckCircle2 } from "lucide-react";
import { ExamStatCard } from "@/components/shared/examComponent";
import { getErrorMessage } from "@/lib/error-handler";
import { cn } from "@/lib/utils";

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface ArchitectStatsData {
  totalExams: number;
  completionRate: number;
}

interface ArchitectStatsProps {
  stats: ArchitectStatsData | null | undefined;
  className?: string; // This is for the container div
}

/**
 * ARCHITECT STATS (Tier 2/3)
 * Rule 15: Resolved Type Error 2322 by removing unsupported className from child.
 * Rule 20: Responsive grid scaling.
 * Rule 19: Geometric alignment with Master Registry.
 */
export function ArchitectStats({ stats, className }: ArchitectStatsProps) {
  try {
    return (
      <div 
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8", 
          className
        )}
      >
        {/* ── SUBJECT VOLUME ── */}
        <ExamStatCard
          label="Subject Bank"
          value={stats?.totalExams ?? 0}
          sub="Items available"
          icon={Database}
        />

        {/* ── ENGINE STATUS ── */}
        <ExamStatCard
          label="Active Sessions"
          value="Live"
          sub="CBT Engine Online"
          icon={Zap}
          // COMPILER FIX: Removed 'className' as it is not defined in ExamStatCardProps
          colorClass="text-school-primary" 
        />

        {/* ── PERFORMANCE INDEX ── */}
        <ExamStatCard
          label="Grading Index"
          value={`${stats?.completionRate ?? 0}%`}
          sub="Global Grad Rate"
          icon={CheckCircle2}
          colorClass="text-emerald-500"
        />
      </div>
    );
  } catch (error) {
    // Rule 15: Safe error handling
    console.error(`[ArchitectStats] Sync Error: ${getErrorMessage(error)}`);
    return (
      <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive text-[10px] font-bold uppercase tracking-widest">
        Telemetry Sync Failed
      </div>
    );
  }
}