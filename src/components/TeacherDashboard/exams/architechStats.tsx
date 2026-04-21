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


import { Database, Zap, CheckCircle2 } from "lucide-react";
import { ExamStatCard } from "@/components/shared/examComponent";
import {getErrorMessage} from "@/lib/error-handler"


// ── Types ───────────────────────────────────────────────────────────────────

interface ArchitectStatsData {
  totalExams: number;
  completionRate: number;
}

interface ArchitectStatsProps {
  stats: ArchitectStatsData | null | undefined;
}

// ── Main Component ──────────────────────────────────────────────────────────

export function ArchitectStats({ stats }: ArchitectStatsProps) {
  // Example of using getErrorMessage if logic was added here
  try {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ExamStatCard
          label="Subject Bank"
          value={stats?.totalExams ?? 0}
          sub="Items available"
          icon={Database}
        />

        <ExamStatCard
          label="Active Sessions"
          value="Live"
          sub="CBT Engine Online"
          icon={Zap}
          colorClass="text-school-primary"
        />

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
    console.error(getErrorMessage(error));
    return null;
  }
}