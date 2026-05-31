// import { FileText } from "lucide-react";

// export function ArchitectHeader() {
//   return (
//     <header className="flex items-center gap-5 border-b border-white/5 pb-10">
//       <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
//         <FileText className="h-7 w-7 text-school-primary" />
//       </div>

//       <div>
//         <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
//           Exam Architect
//         </h1>

//         <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">
//           Institutional Assessment Generation & Vault Management.
//         </p>
//       </div>
//     </header>
//   );
// }


import React from "react";
import { FileText, ShieldCheck } from "lucide-react";


/**
 * EXAM ARCHITECT HEADER (Tier 2 Hub)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, border-border).
 * Rule 19: Standardized Geometry (rounded-2xl).
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function ArchitectHeader() {
  return (
    <header className="flex flex-col md:flex-row md:items-center gap-6 border-b border-border pb-10">
      
      {/* ── VISUAL ANCHOR (Rule 19/21) ── */}
      <div className="h-16 w-16 rounded-2xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center shadow-lg transition-colors group">
        <FileText className="h-8 w-8 text-school-primary transition-transform group-hover:scale-110" />
      </div>

      <div className="space-y-2">
        {/* Rule 11: Primary Header Styling */}
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tighter uppercase italic leading-none text-foreground">
          Assessment Architect
        </h1>

        {/* Rule 19: Metadata Typography */}
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-3.5 w-3.5 text-school-primary opacity-50" />
          <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest italic opacity-70">
            Institutional Generation Hub & Assessment Ledger Management
          </p>
        </div>
      </div>
    </header>
  );
}