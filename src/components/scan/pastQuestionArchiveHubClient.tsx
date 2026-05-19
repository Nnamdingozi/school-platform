// "use client";

// import { useState } from "react";
// import { Sparkles, History, Database } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useProfileStore } from "@/store/profileStore";
// import { Role } from "@prisma/client";
// import { ArchiveUploader } from "./pastQuestionUploader";
// import { ArchiveRegistry } from "./pastQuestionArchiveRegistry";
// import { ScannedPaperSet } from "@/app/actions/scanned-question-bank";

// interface ArchiveHubProps {
//     userId: string;
//     schoolId: string | null;
//     userRole: Role;
//     subjects: { id: string, name: string }[]; 
//     initialPapers: ScannedPaperSet[];
// }

// export function ArchiveHubClient({ userId, schoolId, userRole, subjects, initialPapers }: ArchiveHubProps) {
//   const { profile } = useProfileStore();
//   const [activeTab, setActiveTab] = useState<"architect" | "registry">("architect");
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   return (
//     <div className="min-h-screen bg-surface p-4 md:p-8 lg:p-12 animate-in fade-in duration-500">
//       <div className="max-w-7xl mx-auto space-y-10">
        
//         <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-border pb-10">
//           <div className="flex items-center gap-6">
//             <div className="h-16 w-16 rounded-2xl border border-border bg-card flex items-center justify-center shadow-lg">
//                 <Database className="h-8 w-8 text-school-primary" style={{ color: primaryColor }} />
//             </div>
//             <div>
//                 <h1 className="text-2xl md:text-4xl font-extrabold tracking-tighter uppercase italic text-foreground leading-none">
//                     Archive Hub
//                 </h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2">
//                     Institutional Node Digitization & Logic Storage
//                 </p>
//             </div>
//           </div>

//           <div className="flex p-1.5 bg-card border border-border rounded-2xl shadow-inner w-full lg:w-auto">
//             <button 
//                 onClick={() => setActiveTab("architect")}
//                 className={cn(
//                     "flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
//                     activeTab === "architect" ? "bg-background text-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
//                 )}
//             >
//                 <Sparkles className="h-3.5 w-3.5" style={activeTab === 'architect' ? { color: primaryColor } : {}} /> Architect
//             </button>
//             <button 
//                 onClick={() => setActiveTab("registry")}
//                 className={cn(
//                     "flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
//                     activeTab === "registry" ? "bg-background text-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
//                 )}
//             >
//                 <History className="h-3.5 w-3.5" style={activeTab === 'registry' ? { color: primaryColor } : {}} /> Registry
//             </button>
//           </div>
//         </header>

//         <main className="w-full">
//             {activeTab === "architect" ? (
//                 <ArchiveUploader userId={userId} schoolId={schoolId} userRole={userRole} subjects={subjects} />
//             ) : (
//                 <ArchiveRegistry initialData={initialPapers} />
//             )}
//         </main>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { Sparkles, History, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/store/profileStore";
import { Role } from "@prisma/client";
import { ArchiveUploader } from "./pastQuestionUploader";
import { ArchiveRegistry } from "./pastQuestionArchiveRegistry";
import { ScannedPaperSet } from "@/app/actions/scanned-question-bank";

interface ArchiveHubProps {
  userId: string;
  schoolId: string | null;
  userRole: Role;
  subjects: { id: string; name: string }[];
  initialPapers: ScannedPaperSet[];
}

export function ArchiveHubClient({
  userId,
  schoolId,
  userRole,
  subjects,
  initialPapers,
}: ArchiveHubProps) {
  const { profile } = useProfileStore();
  const [activeTab, setActiveTab] = useState<"architect" | "registry">(
    "architect"
  );
  const primaryColor = profile?.primaryColor || "#f59e0b";

  return (
    <div className="min-h-screen bg-surface p-4 md:p-8 lg:p-12 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* ── Header ── */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-border pb-10">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl border border-border bg-card flex items-center justify-center shadow-lg">
              <Database
                className="h-8 w-8 text-school-primary"
                style={{ color: primaryColor }}
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tighter uppercase italic text-foreground leading-none">
                Archive Hub
              </h1>
              <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2">
                Institutional Node Digitization & Logic Storage
              </p>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex p-1.5 bg-card border border-border rounded-2xl shadow-inner w-full lg:w-auto">
            <button
              onClick={() => setActiveTab("architect")}
              className={cn(
                "flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                activeTab === "architect"
                  ? "bg-background text-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles
                className="h-3.5 w-3.5"
                style={activeTab === "architect" ? { color: primaryColor } : {}}
              />
              Architect
            </button>
            <button
              onClick={() => setActiveTab("registry")}
              className={cn(
                "flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                activeTab === "registry"
                  ? "bg-background text-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <History
                className="h-3.5 w-3.5"
                style={activeTab === "registry" ? { color: primaryColor } : {}}
              />
              Registry
            </button>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="w-full">
          {activeTab === "architect" ? (
            <ArchiveUploader
              userId={userId}
              schoolId={schoolId}
              userRole={userRole}
              subjects={subjects}
            />
          ) : (
            <ArchiveRegistry initialData={initialPapers} />
          )}
        </main>
      </div>
    </div>
  );
}