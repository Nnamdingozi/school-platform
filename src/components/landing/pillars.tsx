// "use client";

// import {
//   School,
//   BookOpen,
//   Users,
//   ShieldCheck,
//   BarChart3,
//   Video,
//   ClipboardCheck,
//   MessageSquare,
//   TrendingUp,
// } from "lucide-react";
// import { motion, Variants } from "framer-motion";

// const cardVariants: Variants = {
//     hidden: { opacity: 0, y: 30, scale: 0.95 },
//     visible: (i: number) => ({
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         delay: i * 0.1, // Staggers the cards
//         duration: 0.5,
//         ease: "easeOut",
//       },
//     }),
//   };

// const pillars = [
//   {
//     icon: School,
//     title: "For Schools",
//     description:
//       "Centralized management with role-based access control and school-wide B2B reporting dashboards.",
//     features: [
//       { icon: ShieldCheck, text: "Role-Based Access Control" },
//       { icon: BarChart3, text: "School-Wide Analytics" },
//     ],
//     color: "bg-primary/10 text-primary",
//   },
//   {
//     icon: BookOpen,
//     title: "For Teachers",
//     description:
//       "AI-generated lesson plans, video scripts, and automated assessment grading in seconds.",
//     features: [
//       { icon: Video, text: "AI Lesson Plans & Videos" },
//       { icon: ClipboardCheck, text: "Automated Grading" },
//     ],
//     color: "bg-[hsl(199,89%,48%)]/10 text-[hsl(199,89%,48%)]",
//   },
//   {
//     icon: Users,
//     title: "For Parents",
//     description:
//       "Real-time feedback delivered via WhatsApp and detailed student growth charts.",
//     features: [
//       { icon: MessageSquare, text: "WhatsApp Feedback" },
//       { icon: TrendingUp, text: "Student Growth Charts" },
//     ],
//     color: "bg-foreground/10 text-foreground",
//   },
// ];

// // const cardVariants = {
// //   hidden: { opacity: 0, y: 32 },
// //   visible: (i: number) => ({
// //     opacity: 1,
// //     y: 0,
// //     transition: { duration: 0.5, delay: i * 0.15, ease: [0.25, 0.4, 0.25, 1] },
// //   }),
// // };

// export function Pillars() {
//   return (
//     <section className="bg-background py-24 lg:py-32">
//   <div className="mx-auto max-w-7xl px-6">
//     {/* Header Section */}
//     <motion.div
//       className="mx-auto mb-20 max-w-2xl text-center"
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: "-100px" }}
//       transition={{ duration: 0.7, ease: "easeOut" }}
//     >
//       <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
//         Built for Everyone
//       </p>
//       <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
//         Three Pillars,{" "}
//         <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
//           One Platform
//         </span>
//       </h2>
//       <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
//         Whether you run a school, teach a class, or support your child at
//         home, SchoolPlatform has you covered.
//       </p>
//     </motion.div>

//     {/* Grid of Pillar Cards */}
//     <div className="grid gap-8 md:grid-cols-3">
//       {pillars.map((pillar, i) => (
//         <motion.div
//           key={pillar.title}
//           custom={i}
//           variants={cardVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, margin: "-50px" }}
//           whileHover={{ 
//             y: -10, 
//             scale: 1.02,
//             transition: { duration: 0.3 } 
//           }}
//           className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10"
//         >
//           {/* Subtle background glow on hover */}
//           <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl transition-opacity group-hover:opacity-100" />

//           {/* Icon Container */}
//           <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-200/50 transition-colors group-hover:bg-amber-500 group-hover:text-white">
//             <pillar.icon className="h-7 w-7" />
//           </div>

//           <h3 className="mb-4 text-2xl font-bold text-foreground">
//             {pillar.title}
//           </h3>
          
//           <p className="mb-8 leading-relaxed text-muted-foreground">
//             {pillar.description}
//           </p>

//           {/* Feature List */}
//           <div className="flex flex-col gap-4">
//             {pillar.features.map((feature) => (
//               <div
//                 key={feature.text}
//                 className="flex items-center gap-3 text-sm font-medium text-foreground/80"
//               >
//                 <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600 group-hover:bg-amber-500/10">
//                    <feature.icon className="h-3 w-3" />
//                 </div>
//                 {feature.text}
//               </div>
//             ))}
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   </div>
// </section>
//   );
// }



// "use client";

// import {
//   School,
//   BookOpen,
//   Users,
//   ShieldCheck,
//   BarChart3,
//   Zap,
//   ClipboardCheck,
//   Globe,
//   TrendingUp,
//   Cpu,
// } from "lucide-react";
// import { motion, Variants } from "framer-motion";
// import { cn } from "@/lib/utils";

// // ── Animation Variants ────────────────────────────────────────────────────────

// const cardVariants: Variants = {
//     hidden: { opacity: 0, y: 30, scale: 0.98 },
//     visible: (i: number) => ({
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         delay: i * 0.1,
//         duration: 0.6,
//         ease: [0.22, 1, 0.36, 1],
//       },
//     }),
//   };

// // ── Data: The 3-Tier Pillars ──────────────────────────────────────────────────

// const pillars = [
//   {
//     tier: "Tier 02",
//     icon: School,
//     title: "Institutional Core",
//     description:
//       "Centralized governance for modern schools. Provision classrooms, manage staff registries, and monitor school-wide telemetry.",
//     features: [
//       { icon: ShieldCheck, text: "Role-Based Access Logic" },
//       { icon: BarChart3, text: "Institutional Analytics" },
//     ],
//   },
//   {
//     tier: "Tier 01",
//     icon: Cpu,
//     title: "Synthesis Engine",
//     description:
//       "AI-powered pedagogical tools for instructors. Generate syllabus-aligned modules, automated assessments, and video scripts.",
//     features: [
//       { icon: Zap, text: "AI Content Synthesis" },
//       { icon: ClipboardCheck, text: "Automated Grading Node" },
//     ],
//   },
//   {
//     tier: "Tier 03",
//     icon: Globe,
//     title: "Individual Registry",
//     description:
//       "Personal learning paths for independent users. Real-time feedback delivery via WhatsApp and detailed personal growth indexing.",
//     features: [
//       { icon: Users, text: "Personal Study Hub" },
//       { icon: TrendingUp, text: "Growth Telemetry" },
//     ],
//   },
// ];

// /**
//  * 3-TIER SYSTEM VISUALIZATION (Rule 1)
//  * Rule 11: Enforces Registry typography (Black, Italic, Uppercase).
//  * Rule 6: Highlights the specific value for Independent Learners.
//  */
// export function Pillars() {
//   return (
//     <section id="pillars" className="bg-slate-950 py-24 lg:py-32 overflow-hidden">
//       <div className="mx-auto max-w-7xl px-6">
        
//         {/* ── HEADER SECTION ── */}
//         <motion.div
//           className="mx-auto mb-24 max-w-3xl text-center space-y-6"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 0.7, ease: "easeOut" }}
//         >
//           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-school-primary">
//             Registry Architecture
//           </p>
//           <h2 className="text-balance text-5xl font-black tracking-tighter text-white md:text-6xl uppercase italic leading-none">
//             Three Tiers, <br/>
//             <span className="text-school-primary underline decoration-white/10 underline-offset-8">One knowledge engine</span>
//           </h2>
//           <p className="mt-8 text-pretty text-sm md:text-lg font-bold uppercase tracking-widest leading-relaxed text-slate-500 italic">
//             Whether you govern an institution, lead a classroom, or direct your own personal learning roadmap.
//           </p>
//         </motion.div>

//         {/* ── PILLAR GRID ── */}
//         <div className="grid gap-8 md:grid-cols-3">
//           {pillars.map((pillar, i) => (
//             <motion.div
//               key={pillar.title}
//               custom={i}
//               variants={cardVariants}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true, margin: "-50px" }}
//               className="group relative flex flex-col rounded-[3rem] border border-white/5 bg-slate-900 p-10 shadow-2xl transition-all duration-500 hover:border-school-primary/30"
//             >
//               {/* Tier Label */}
//               <div className="absolute top-10 right-10 text-[10px] font-black text-slate-800 uppercase tracking-widest group-hover:text-school-primary transition-colors">
//                 {pillar.tier}
//               </div>

//               {/* Icon Matrix */}
//               <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 border border-white/5 text-slate-600 transition-all duration-500 group-hover:bg-school-primary group-hover:text-slate-950 group-hover:scale-110">
//                 <pillar.icon className="h-8 w-8" strokeWidth={1.5} />
//               </div>

//               <div className="space-y-4 mb-10">
//                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
//                     {pillar.title}
//                   </h3>
                  
//                   <p className="text-[11px] font-bold leading-relaxed text-slate-400 uppercase tracking-widest italic">
//                     {pillar.description}
//                   </p>
//               </div>

//               {/* Feature Map */}
//               <div className="mt-auto flex flex-col gap-4 border-t border-white/5 pt-8">
//                 {pillar.features.map((feature) => (
//                   <div
//                     key={feature.text}
//                     className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-white/70"
//                   >
//                     <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-950 border border-white/5 text-school-primary group-hover:border-school-primary/30 transition-all">
//                        <feature.icon className="h-3.5 w-3.5" />
//                     </div>
//                     {feature.text}
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import React from "react";
import {
  School,
  ShieldCheck,
  BarChart3,
  Zap,
  ClipboardCheck,
  Globe,
  TrendingUp,
  Cpu,
  Users,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Animation Variants ────────────────────────────────────────────────────────

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// ── Data: The 3-Tier Pillars ──────────────────────────────────────────────────

const pillars = [
  {
    tier: "Tier 02",
    icon: School,
    title: "Institutional Core",
    description:
      "Centralized governance for modern schools. Provision classrooms, manage staff registries, and monitor school-wide telemetry.",
    features: [
      { icon: ShieldCheck, text: "Role-Based Access Logic" },
      { icon: BarChart3, text: "Institutional Analytics" },
    ],
  },
  {
    tier: "Tier 01",
    icon: Cpu,
    title: "Synthesis Engine",
    description:
      "AI-powered pedagogical tools for instructors. Generate syllabus-aligned modules, automated assessments, and video scripts.",
    features: [
      { icon: Zap, text: "AI Content Synthesis" },
      { icon: ClipboardCheck, text: "Automated Grading Node" },
    ],
  },
  {
    tier: "Tier 03",
    icon: Globe,
    title: "Individual Registry",
    description:
      "Personal learning paths for independent users. Real-time feedback delivery via WhatsApp and detailed personal growth indexing.",
    features: [
      { icon: Users, text: "Personal Study Hub" },
      { icon: TrendingUp, text: "Growth Telemetry" },
    ],
  },
];

/**
 * 3-TIER SYSTEM VISUALIZATION (Rule 1)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem] for architecture cards.
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function Pillars() {
  return (
    <section id="pillars" className="bg-background py-16 md:py-24 lg:py-32 overflow-hidden border-t border-border">
      {/* Rule 20: Fluid Container and Padding */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 w-full">
        
        {/* ── HEADER SECTION (Rule 11) ── */}
        <motion.div
          className="mx-auto mb-16 md:mb-24 max-w-3xl text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Rule 19: Label Typography */}
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-school-primary">
            Registry Architecture
          </p>
          
          {/* Rule 11: Header Scaling */}
          <h2 className="text-balance text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground uppercase italic leading-[1.1]">
            Three Tiers, <br/>
            <span className="text-school-primary decoration-border/30 underline-offset-8">One knowledge engine</span>
          </h2>
          
          <p className="mt-8 text-pretty text-sm md:text-lg font-semibold uppercase tracking-widest leading-relaxed text-muted-foreground italic opacity-80">
            Whether you govern an institution, lead a classroom, or direct your own personal learning roadmap.
          </p>
        </motion.div>

        {/* ── PILLAR GRID (Rule 20) ── */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className={cn(
                "group relative flex flex-col p-8 md:p-10 transition-all duration-500",
                "bg-card border border-border rounded-[2rem] shadow-xl hover:border-school-primary/30" // Rule 18/19
              )}
            >
              {/* Tier Label (Rule 11) */}
              <div className="absolute top-10 right-10 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest group-hover:text-school-primary transition-colors">
                {pillar.tier}
              </div>

              {/* Icon Matrix (Rule 21) */}
              <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface border border-border text-muted-foreground transition-all duration-500 group-hover:bg-school-primary group-hover:text-on-school-primary group-hover:border-transparent group-hover:scale-110 shadow-inner">
                <pillar.icon className="h-8 w-8" strokeWidth={1.5} />
              </div>

              <div className="space-y-4 mb-10">
                  {/* Rule 11: Sub-header Scaling */}
                  <h3 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-[11px] font-semibold leading-relaxed text-muted-foreground uppercase tracking-widest italic">
                    {pillar.description}
                  </p>
              </div>

              {/* Feature Map (Rule 21) */}
              <div className="mt-auto flex flex-col gap-4 border-t border-border pt-8">
                {pillar.features.map((feature) => (
                  <div
                    key={feature.text}
                    className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-foreground/70"
                  >
                    {/* Rule 21: Mathematical Scale Tokens */}
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-school-primary-50 border border-school-primary-200 text-school-primary group-hover:bg-school-primary-100 transition-colors">
                       <feature.icon className="h-4 w-4" />
                    </div>
                    {feature.text}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}