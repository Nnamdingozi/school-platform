// import { GraduationCap } from "lucide-react";

// const footerLinks = {
//   Product: ["Features", "Pricing", "Curriculums", "Integrations"],
//   Company: ["About", "Blog", "Careers", "Contact"],
//   Resources: ["Documentation", "Help Center", "Community", "Status"],
//   Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
// };

// export function Footer() {
//   return (
//     <footer className="border-t border-border bg-card">
//       <div className="mx-auto max-w-7xl px-6 py-16">
//         <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
//           {/* Brand */}
//           <div className="lg:col-span-1">
//             <a href="#" className="flex items-center gap-2">
//               <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
//                 <GraduationCap className="h-5 w-5 text-primary-foreground" />
//               </div>
//               <span className="text-lg font-bold text-foreground">
//                 SchoolPlatform
//               </span>
//             </a>
//             <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
//               AI-powered education for every school, teacher, and learner.
//             </p>
//           </div>

//           {/* Links */}
//           {Object.entries(footerLinks).map(([category, links]) => (
//             <div key={category}>
//               <h4 className="mb-4 text-sm font-semibold text-foreground">
//                 {category}
//               </h4>
//               <ul className="flex flex-col gap-3">
//                 {links.map((link) => (
//                   <li key={link}>
//                     <a
//                       href="#"
//                       className="text-sm text-muted-foreground transition-colors hover:text-foreground"
//                     >
//                       {link}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
//           <p className="text-sm text-muted-foreground">
//             {"2026 SchoolPlatform. All rights reserved."}
//           </p>
//           <div className="flex gap-6">
//             <a
//               href="#"
//               className="text-sm text-muted-foreground transition-colors hover:text-foreground"
//             >
//               Twitter
//             </a>
//             <a
//               href="#"
//               className="text-sm text-muted-foreground transition-colors hover:text-foreground"
//             >
//               LinkedIn
//             </a>
//             <a
//               href="#"
//               className="text-sm text-muted-foreground transition-colors hover:text-foreground"
//             >
//               GitHub
//             </a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }


// import { GraduationCap, ShieldCheck, Globe } from "lucide-react";
// import Link from "next/link";

// // ── Configuration: Navigation Matrix ──────────────────────────────────────────

// const footerLinks = {
//   Registry: ["Features", "Pricing", "Curriculums", "Synthesis Engine"],
//   Institution: ["Onboarding", "CBT Registry", "WhatsApp Bridge", "Staff Management"],
//   Individual: ["Personal Library", "Study Hub", "Practice Tests", "Individual Tiers"],
//   Legal: ["Privacy Protocol", "Terms of Service", "Cookie Registry"],
// };

// /**
//  * PUBLIC FOOTER (Tier 0)
//  * Rule 11: Standardizes the "Registry" aesthetic with black/italic/uppercase headers.
//  * Rule 12: Pure Server Component for maximum performance.
//  */
// export function Footer() {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="border-t border-white/5 bg-slate-950">
//       <div className="mx-auto max-w-7xl px-6 py-20">
//         <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          
//           {/* ── BRAND IDENTITY ── */}
//           <div className="lg:col-span-2 space-y-6">
//             <Link href="/" className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-school-primary shadow-lg shadow-school-primary/20">
//                 <GraduationCap className="h-6 w-6 text-slate-950" strokeWidth={2.5} />
//               </div>
//               <span className="text-2xl font-black text-white uppercase italic tracking-tighter">
//                 SchoolPaaS
//               </span>
//             </Link>
//             <p className="text-sm font-bold leading-relaxed text-slate-500 uppercase tracking-widest italic max-w-xs">
//               The Multicurricular AI Academic Registry for modern institutions and self-paced learners.
//             </p>
            
//             {/* System Status Node */}
//             <div className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-slate-900 px-4 py-2">
//                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Status: Optimal</span>
//             </div>
//           </div>

//           {/* ── NAVIGATION LINKS ── */}
//           {Object.entries(footerLinks).map(([category, links]) => (
//             <div key={category} className="space-y-6">
//               <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">
//                 {category}
//               </h4>
//               <ul className="flex flex-col gap-4">
//                 {links.map((link) => (
//                   <li key={link}>
//                     <Link
//                       href="#"
//                       className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] transition-all hover:text-school-primary hover:translate-x-1 inline-block"
//                     >
//                       {link}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* ── BOTTOM BAR ── */}
//         <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-10 md:flex-row">
//           <div className="flex items-center gap-4">
//               <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">
//                 &copy; {currentYear} SchoolPaaS Registry
//               </p>
//               <div className="h-1 w-1 rounded-full bg-slate-800" />
//               <div className="flex items-center gap-2">
//                  <ShieldCheck className="h-3 w-3 text-slate-800" />
//                  <span className="text-[9px] font-bold text-slate-800 uppercase tracking-widest">Tier-3 Encrypted</span>
//               </div>
//           </div>

//           <div className="flex gap-8">
//             {["Twitter", "LinkedIn", "GitHub"].map((social) => (
//                 <Link
//                   key={social}
//                   href="#"
//                   className="text-[10px] font-black text-slate-600 uppercase tracking-widest transition-colors hover:text-white"
//                 >
//                   {social}
//                 </Link>
//             ))}
//           </div>
//         </div>

//         {/* Support Regions */}
//         <div className="mt-10 flex justify-center items-center gap-6 opacity-20">
//             <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.5em] flex items-center gap-2">
//                 <Globe className="h-3 w-3" /> Deploying Logic Across: UK • US • NG • GH
//             </span>
//         </div>
//       </div>
//     </footer>
//   );
// }



import React from "react";
import { GraduationCap, ShieldCheck, Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ── Configuration: Navigation Matrix ──────────────────────────────────────────

const footerLinks = {
  Registry: ["Features", "Pricing", "Curriculums", "Synthesis Engine"],
  Institution: ["Onboarding", "CBT Registry", "WhatsApp Bridge", "Staff Management"],
  Individual: ["Personal Library", "Study Hub", "Practice Tests", "Individual Tiers"],
  Legal: ["Privacy Protocol", "Terms of Service", "Cookie Registry"],
};

/**
 * PUBLIC REGISTRY FOOTER (Tier 0)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-surface, border-border).
 * Rule 19: Standardized Geometry (rounded-2xl).
 * Rule 20: Compulsory Responsiveness with fluid grid and padding.
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      {/* Rule 20: Standardized Container Constraints */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 py-16 md:py-24">
        
        {/* ── GRID SYSTEM (Rule 20) ── */}
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
          
          {/* ── BRAND IDENTITY (LG: Col 2) ── */}
          <div className="sm:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Rule 19/21: Item Radius and Scale Protocol */}
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-school-primary shadow-lg shadow-school-primary-200 group-hover:scale-105 transition-transform duration-500">
                <GraduationCap className="h-6 w-6 text-on-school-primary" strokeWidth={2.5} />
              </div>
              {/* Rule 11: Header Scaling */}
              <span className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter">
                SchoolPaaS
              </span>
            </Link>
            
            <p className="text-sm font-semibold leading-relaxed text-muted-foreground uppercase tracking-widest italic max-w-xs opacity-70">
              The Multicurricular AI Academic Registry for modern institutions and self-paced learners.
            </p>
            
            {/* System Status Node (Rule 18/21) */}
            <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2 shadow-inner">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  System Status: Optimal
                </span>
            </div>
          </div>

          {/* ── NAVIGATION LINKS ── */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-6">
              {/* Rule 11: Category Header */}
              <h4 className="text-[11px] font-extrabold text-foreground uppercase tracking-widest italic">
                {category}
              </h4>
              <ul className="flex flex-col gap-4">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest transition-all hover:text-school-primary hover:translate-x-1 inline-block"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── BOTTOM BAR (Rule 18/20) ── */}
        <div className="mt-16 md:mt-24 flex flex-col items-center justify-between gap-8 border-t border-border pt-10 md:flex-row">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6">
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                &copy; {currentYear} SchoolPaaS Registry
              </p>
              <div className="hidden sm:block h-1 w-1 rounded-full bg-border" />
              <div className="flex items-center gap-2">
                 <ShieldCheck className="h-3.5 w-3.5 text-school-primary/60" />
                 <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
                  Node Tier-3 Encrypted
                 </span>
              </div>
          </div>

          {/* Social Matrix */}
          <div className="flex gap-8">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="text-[10px] font-extrabold text-muted-foreground/40 uppercase tracking-widest transition-colors hover:text-foreground"
                >
                  {social}
                </Link>
            ))}
          </div>
        </div>

        {/* Support Regions (Rule 11) */}
        <div className="mt-12 flex justify-center items-center gap-6 opacity-30">
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.4em] flex items-center gap-3">
                <Globe className="h-3.5 w-3.5" /> Deploying Logic Across: UK • US • NG • GH
            </span>
        </div>
      </div>
    </footer>
  );
}