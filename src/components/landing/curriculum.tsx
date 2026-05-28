// // "use client";

// // import { Globe, BookMarked, GraduationCap } from "lucide-react";
// // import { motion, Variants } from "framer-motion";


// // const curriculums = [
// //   {
// //     icon: Globe,
// //     name: "British National",
// //     description: "Key Stages 1-4, GCSEs & A-Levels",
// //   },
// //   {
// //     icon: BookMarked,
// //     name: "American K-12",
// //     description: "Common Core & State Standards",
// //   },
// //   {
// //     icon: GraduationCap,
// //     name: "Nigerian National",
// //     description: "JSS & SSS Curriculum (WAEC/NECO)",
// //   },
// // ];

// // const cardVariants:Variants = {
// //   hidden: { opacity: 0, y: 20, scale: 0.95 },
// //   visible: (i: number) => ({
// //     opacity: 1,
// //     y: 0,
// //     scale: 1,
// //     transition: { 
// //       duration: 0.5, 
// //       delay: i * 0.12, 
// //       ease: [0.25, 0.4, 0.25, 1] 
// //     },
// //   }),
// // };

// // export function Curriculums() {
// //   return (
// //     <section id="curriculums" className="bg-background py-24 lg:py-32">
// //       <div className="mx-auto max-w-7xl px-6">
        
// //         {/* Header Section */}
// //         <motion.div
// //           className="mx-auto mb-20 max-w-2xl text-center"
// //           initial={{ opacity: 0, y: 20 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           viewport={{ once: true, margin: "-80px" }}
// //           transition={{ duration: 0.7, ease: "easeOut" }}
// //         >
// //           <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
// //             Curriculum Support
// //           </p>
// //           <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
// //             Works with the Curriculums{" "}
// //             <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
// //               You Follow
// //             </span>
// //           </h2>
// //           <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
// //             AI-generated content aligned to major international curriculums, so
// //             every lesson meets the highest global standards.
// //           </p>
// //         </motion.div>

// //         {/* Grid Section */}
// //         <div className="grid gap-8 md:grid-cols-3">
// //           {curriculums.map((item, i) => (
// //             <motion.div
// //               key={item.name}
// //               custom={i}
// //               variants={cardVariants}
// //               initial="hidden"
// //               whileInView="visible"
// //               viewport={{ once: true, margin: "-60px" }}
// //               whileHover={{ 
// //                 y: -12, 
// //                 transition: { duration: 0.3 } 
// //               }}
// //               className="group relative flex flex-col items-center rounded-3xl border border-amber-100 bg-card p-12 text-center transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)]"
// //             >
// //               {/* Background Glow */}
// //               <div className="absolute inset-0 -z-10 bg-gradient-to-b from-amber-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

// //               {/* Icon Container */}
// //               <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-200 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-amber-500/30">
// //                 <item.icon className="h-10 w-10" />
// //               </div>

// //               <h3 className="mb-3 text-2xl font-bold text-foreground">
// //                 {item.name}
// //               </h3>
              
// //               <p className="text-base leading-relaxed text-muted-foreground">
// //                 {item.description}
// //               </p>

// //               {/* Decorative line that appears on hover */}
// //               <div className="mt-8 h-1 w-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent transition-all duration-500 group-hover:w-24" />
// //             </motion.div>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }



// "use client";

// import { Globe, BookMarked, GraduationCap, ShieldCheck } from "lucide-react";
// import { motion, Variants } from "framer-motion";
// import { cn } from "@/lib/utils";

// // ── Data: Tier 1 Core ────────────────────────────────────────────────────────

// const curriculums = [
//   {
//     icon: Globe,
//     name: "British National",
//     description: "Key Stages 1-4, GCSEs & International A-Levels.",
//     code: "UK-KS-104",
//   },
//   {
//     icon: BookMarked,
//     name: "American K-12",
//     description: "Common Core & State Standards integration.",
//     code: "US-K12-CC",
//   },
//   {
//     icon: GraduationCap,
//     name: "Nigerian National",
//     description: "JSS & SSS Curriculum (WAEC/NECO Standards).",
//     code: "NG-JSS-SSS",
//   },
// ];

// const cardVariants: Variants = {
//   hidden: { opacity: 0, y: 20, scale: 0.95 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { 
//       duration: 0.5, 
//       delay: i * 0.12, 
//       ease: [0.25, 0.4, 0.25, 1] 
//     },
//   }),
// };

// /**
//  * GLOBAL KNOWLEDGE CORE (Tier 1)
//  * Rule 11: Standardizes the "Registry" aesthetic with black/italic/uppercase.
//  * Rule 4: Showcases universally accessible academic foundations.
//  */
// export function Curriculums() {
//   return (
//     <section id="curriculums" className="bg-slate-950 py-24 lg:py-32 overflow-hidden">
//       <div className="mx-auto max-w-7xl px-6">
        
//         {/* ── HEADER SECTION ── */}
//         <motion.div
//           className="mx-auto mb-24 max-w-3xl text-center space-y-6"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-80px" }}
//           transition={{ duration: 0.7, ease: "easeOut" }}
//         >
//           <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-school-primary shadow-2xl">
//             <ShieldCheck className="h-3.5 w-3.5" />
//             Registry Protocol: Global
//           </div>

//           <h2 className="text-balance text-5xl font-black tracking-tighter text-white md:text-6xl uppercase italic leading-none">
//             Multicurricular <br/>
//             <span className="text-school-primary underline decoration-white/10 underline-offset-8">Knowledge Core</span>
//           </h2>

//           <p className="mt-8 text-pretty text-sm md:text-lg font-bold uppercase tracking-widest leading-relaxed text-slate-500 italic">
//             Standardized academic nodes aligned to international requirements. 
//             AI synthesis verified across major global registries.
//           </p>
//         </motion.div>

//         {/* ── GRID SECTION ── */}
//         <div className="grid gap-6 md:grid-cols-3">
//           {curriculums.map((item, i) => (
//             <motion.div
//               key={item.name}
//               custom={i}
//               variants={cardVariants}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true, margin: "-60px" }}
//               className="group relative flex flex-col items-center rounded-[3rem] border border-white/5 bg-slate-900 p-12 text-center transition-all duration-500 hover:border-school-primary/30 hover:shadow-2xl"
//             >
//               {/* Registry ID Badge */}
//               <div className="absolute top-8 right-10 text-[9px] font-mono font-black text-slate-700 group-hover:text-school-primary transition-colors">
//                 {item.code}
//               </div>

//               {/* Icon Matrix */}
//               <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-950 border border-white/5 text-slate-600 transition-all duration-500 group-hover:scale-110 group-hover:bg-school-primary group-hover:text-slate-950 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]">
//                 <item.icon className="h-10 w-10" strokeWidth={1.5} />
//               </div>

//               <div className="space-y-4">
//                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
//                     {item.name}
//                   </h3>
                  
//                   <p className="text-[11px] font-bold leading-relaxed text-slate-500 uppercase tracking-widest italic">
//                     {item.description}
//                   </p>
//               </div>

//               {/* Status Indicator */}
//               <div className="mt-10 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-white/5">
//                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                   <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">Node Synchronized</span>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Support Footer */}
//         <motion.p 
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             className="mt-16 text-center text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]"
//         >
//             Deploying Standardized Learning Logic Across US • UK • NG
//         </motion.p>
//       </div>
//     </section>
//   );
// }




"use client";

import React from "react";
import { Globe, BookMarked, GraduationCap, ShieldCheck } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Data: Tier 1 Core ────────────────────────────────────────────────────────

const curriculums = [
  {
    icon: Globe,
    name: "British National",
    description: "Key Stages 1-4, GCSEs & International A-Levels.",
    code: "UK-KS-104",
  },
  {
    icon: BookMarked,
    name: "American K-12",
    description: "Common Core & State Standards integration.",
    code: "US-K12-CC",
  },
  {
    icon: GraduationCap,
    name: "Nigerian National",
    description: "JSS & SSS Curriculum (WAEC/NECO Standards).",
    code: "NG-JSS-SSS",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.5, 
      delay: i * 0.1, 
      ease: [0.25, 0.4, 0.25, 1] 
    },
  }),
};

/**
 * GLOBAL KNOWLEDGE CORE (Tier 1)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem] for architecture cards.
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function Curriculums() {
  return (
    <section id="curriculums" className="bg-background py-16 md:py-24 lg:py-32 overflow-hidden border-t border-border">
      {/* Rule 20: Fluid Container and Padding */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 w-full">
        
        {/* ── HEADER SECTION (Rule 11) ── */}
        <motion.div
          className="mx-auto mb-16 md:mb-24 max-w-3xl text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Rule 21: Scale Protocol Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-school-primary-200 bg-school-primary-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-school-primary shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            Registry Protocol: Global Core
          </div>

          <h2 className="text-balance text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground uppercase italic leading-none">
            Multicurricular <br/>
            <span className="text-school-primary decoration-border/40 underline-offset-8">Knowledge Core</span>
          </h2>

          <p className="mt-8 text-pretty text-sm md:text-lg font-semibold uppercase tracking-widest leading-relaxed text-muted-foreground italic opacity-80">
            Standardized academic nodes aligned to international requirements. 
            AI synthesis verified across major global registries.
          </p>
        </motion.div>

        {/* ── GRID SECTION (Rule 20) ── */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {curriculums.map((item, i) => (
            <motion.div
              key={item.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className={cn(
                "group relative flex flex-col items-center p-8 md:p-12 text-center transition-all duration-500",
                "bg-card border border-border rounded-[2rem] shadow-xl hover:border-school-primary/30 hover:shadow-school-primary-100" // Rule 18/19
              )}
            >
              {/* Registry ID Badge */}
              <div className="absolute top-8 right-10 text-[9px] font-mono font-bold text-muted-foreground/30 group-hover:text-school-primary transition-colors uppercase">
                {item.code}
              </div>

              {/* Icon Matrix (Rule 21) */}
              <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-surface border border-border text-muted-foreground transition-all duration-500 group-hover:scale-110 group-hover:bg-school-primary group-hover:text-on-school-primary group-hover:border-transparent shadow-inner">
                <item.icon className="h-10 w-10" strokeWidth={1.5} />
              </div>

              <div className="space-y-4">
                  <h3 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter">
                    {item.name}
                  </h3>
                  
                  <p className="text-[11px] font-semibold leading-relaxed text-muted-foreground uppercase tracking-widest italic">
                    {item.description}
                  </p>
              </div>

              {/* Status Indicator (Rule 21) */}
              <div className="mt-10 flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border shadow-inner">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest">Node Synchronized</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Support Footer */}
        <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-16 text-center text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.4em]"
        >
            Deploying Standardized Learning Logic Across US • UK • NG
        </motion.p>
      </div>
    </section>
  );
}