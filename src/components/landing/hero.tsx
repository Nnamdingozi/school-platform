// 


// "use client"

// import Link from 'next/link';
// import Image from 'next/image'; // ✅ Import Next.js Image component
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Sparkles } from "lucide-react";
// import { motion, Variants } from "framer-motion";

// const containerVariants: Variants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.15 },
//   },
// };

// const fadeUpZoom: Variants = {
//   hidden: { opacity: 0, y: 20, scale: 0.95 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { duration: 0.5, ease: "easeOut" }
//   },
// };

// const scaleIn: Variants = {
//   hidden: { opacity: 0, scale: 0.8, rotateX: -10 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     rotateX: 0,
//     transition: { duration: 0.8, ease: "backOut" }
//   },
// };

// export function Hero() {
//   return (
//     <section className="relative overflow-hidden bg-card pt-12 pb-16 lg:pt-24 lg:pb-24">
//       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(217_91%_60%/0.08),transparent_60%)]" />
//       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(199_89%_48%/0.06),transparent_60%)]" />

//       <div className="relative mx-auto max-w-7xl px-6">
//         <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

//           <motion.div
//             className="text-center lg:text-left"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//           >
//             <motion.div
//               variants={fadeUpZoom}
//               className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/50 bg-amber-50/50 px-4 py-1.5 text-sm font-medium text-amber-700 backdrop-blur-sm"
//             >
//               <Sparkles className="h-4 w-4 animate-pulse text-amber-500" />
//               AI-Powered Education Platform
//             </motion.div>

//             <motion.h1
//               variants={fadeUpZoom}
//               className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
//             >
//               The Future of Education,{" "}
//               <span className="bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
//                 Powered by AI.
//               </span>
//             </motion.h1>

//             <motion.p
//               variants={fadeUpZoom}
//               className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground lg:mx-0"
//             >
//               One platform for Schools, Teachers, and Independent Learners.
//               Generate lessons, track mastery, and bridge the parent-teacher gap
//               with automated WhatsApp feedback.
//             </motion.p>

//             <motion.div
//               variants={fadeUpZoom}
//               className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
//             >
//               <Link href="/onboarding">
//                 <Button
//                   size="lg"
//                   className="group gap-2 bg-amber-500 px-8 text-base font-semibold text-white hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 shadow-lg shadow-amber-500/20"
//                 >
//                   Register Your School
//                   <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                 </Button>
//               </Link>

//               <Link href="/onboarding">
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   className="gap-2 border-amber-200 bg-transparent px-8 text-base hover:bg-amber-50 hover:text-amber-600 transition-colors"
//                 >
//                   Join as a Student
//                 </Button>
//               </Link>
//             </motion.div>
//           </motion.div>

//           <motion.div
//             className="relative"
//             variants={scaleIn}
//             initial="hidden"
//             animate="visible"
//             style={{ perspective: 1200 }}
//           >
//             <div className="pointer-events-none absolute -inset-8 -z-10 rounded-4xl bg-linear-to-br from-amber-500/20 to-primary/10 blur-3xl" />

//             <motion.div
//               className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/40 p-2 shadow-2xl backdrop-blur-xl"
//               whileHover={{
//                 rotateY: 8,
//                 rotateX: -4,
//                 scale: 1.02,
//                 transition: { duration: 0.4, ease: "easeOut" },
//               }}
//               style={{ transformStyle: "preserve-3d" }}
//             >
//               {/* ✅ FIXED: Replaced <img> with <Image /> */}
//               <Image
//                 src="/hero-dashboard.jpg"
//                 alt="AI Dashboard Mockup"
//                 width={1200}
//                 height={800}
//                 priority // ✅ Preloads image for better LCP
//                 className="relative z-10 h-auto w-full rounded-xl shadow-inner"
//               />

//               <motion.div
//                 className="absolute left-6 bottom-12 z-20 hidden rounded-xl border border-white/40 bg-white/70 px-4 py-3 shadow-lg backdrop-blur-md lg:flex"
//                 animate={{ y: [0, -10, 0] }}
//                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
//               >
//                 <div className="flex items-center gap-2">
//                   <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
//                   <span className="text-xs font-bold text-slate-800">AI Lesson Generated</span>
//                 </div>
//               </motion.div>

//               <motion.div
//                 className="absolute right-6 top-12 z-20 hidden rounded-xl border border-white/40 bg-white/70 px-4 py-3 shadow-lg backdrop-blur-md lg:flex"
//                 animate={{ y: [0, -12, 0] }}
//                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
//               >
//                 <div className="flex items-center gap-2">
//                   <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
//                   <span className="text-xs font-bold text-slate-800">98% Mastery Rate</span>
//                 </div>
//               </motion.div>
//             </motion.div>
//           </motion.div>

//         </div>
//       </div>
//     </section>
//   );
// }


// "use client"

// import Link from 'next/link';
// import Image from 'next/image';
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Sparkles, ShieldCheck, Globe, Activity } from "lucide-react";
// import { motion, Variants } from "framer-motion";
// import { cn } from '@/lib/utils';

// // ── Animation Variants ────────────────────────────────────────────────────────

// const containerVariants: Variants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.15 },
//   },
// };

// const fadeUpZoom: Variants = {
//   hidden: { opacity: 0, y: 30, scale: 0.98 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
//   },
// };

// const scaleIn: Variants = {
//   hidden: { opacity: 0, scale: 0.9, rotateX: -5 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     rotateX: 0,
//     transition: { duration: 1, ease: "easeOut" }
//   },
// };

// /**
//  * LANDING HERO (Tier 0)
//  * Rule 11: Enforces the Brutal-Elegant typography (Black, Italic, Uppercase).
//  * Rule 2 & 6: Explicitly routes Institutions and Individual Learners.
//  */
// export function Hero() {
//   return (
//     <section className="relative overflow-hidden bg-slate-950 pt-16 pb-20 lg:pt-32 lg:pb-32">
//       {/* Background Registry Glows */}
//       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.05),transparent_50%)]" />
//       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(245,158,11,0.03),transparent_50%)]" />

//       <div className="relative mx-auto max-w-7xl px-6">
//         <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">

//           {/* ── LEFT: MESSAGING ── */}
//           <motion.div
//             className="text-center lg:text-left"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//           >
//             <motion.div
//               variants={fadeUpZoom}
//               className="mb-8 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-school-primary shadow-2xl"
//             >
//               <Sparkles className="h-4 w-4 animate-pulse" />
//               Intelligence Registry v1.2
//             </motion.div>

//             <motion.h1
//               variants={fadeUpZoom}
//               className="text-balance text-5xl font-black leading-[1.1] tracking-tighter text-white md:text-6xl lg:text-7xl uppercase italic"
//             >
//               The Multicurricular <br/>
//               <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent underline decoration-white/10 underline-offset-8">
//                 AI Academic Core
//               </span>
//             </motion.h1>

//             <motion.p
//               variants={fadeUpZoom}
//               className="mx-auto mt-10 max-w-xl text-pretty text-sm md:text-lg font-bold uppercase tracking-widest leading-relaxed text-slate-500 lg:mx-0 italic"
//             >
//               Centralized knowledge synthesis for modern institutions and self-paced learners. 
//               Deploy logic across Tier-1 Global Curriculums instantly.
//             </motion.p>

//             <motion.div
//               variants={fadeUpZoom}
//               className="mt-12 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
//             >
//               <Link href="/onboarding" className="w-full sm:w-auto">
//                 <Button
//                   size="lg"
//                   className="w-full h-16 gap-3 bg-school-primary px-10 text-[11px] font-black uppercase tracking-[0.3em] text-slate-950 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.3)] rounded-2xl"
//                 >
//                   <ShieldCheck className="h-5 w-5" />
//                   Provision Institution
//                 </Button>
//               </Link>

//               <Link href="/onboarding/individual" className="w-full sm:w-auto">
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   className="w-full h-16 gap-3 border-white/10 bg-slate-950/50 px-10 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/5 rounded-2xl transition-all"
//                 >
//                   <Globe className="h-5 w-5" />
//                   Individual Registry
//                 </Button>
//               </Link>
//             </motion.div>
//           </motion.div>

//           {/* ── RIGHT: VISUAL ASSET ── */}
//           <motion.div
//             className="relative"
//             variants={scaleIn}
//             initial="hidden"
//             animate="visible"
//             style={{ perspective: 1500 }}
//           >
//             {/* Ambient Background Aura */}
//             <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-school-primary/5 blur-[120px]" />

//             <motion.div
//               className="relative overflow-hidden rounded-[3rem] border border-white/5 bg-slate-900 p-3 shadow-2xl"
//               whileHover={{
//                 rotateY: 5,
//                 rotateX: -2,
//                 scale: 1.01,
//                 transition: { duration: 0.5, ease: "easeOut" },
//               }}
//               style={{ transformStyle: "preserve-3d" }}
//             >
//               <Image
//                 src="/hero-dashboard.jpg" // Ensure this exists in /public
//                 alt="SchoolPaaS Registry Interface"
//                 width={1200}
//                 height={800}
//                 priority
//                 className="relative z-10 h-auto w-full rounded-[2.5rem] opacity-80"
//               />

//               {/* Data Node 01 */}
//               <motion.div
//                 className="absolute left-8 bottom-16 z-20 hidden rounded-2xl border border-white/10 bg-slate-950/90 px-5 py-4 shadow-2xl backdrop-blur-md lg:flex items-center gap-4"
//                 animate={{ y: [0, -10, 0] }}
//                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
//               >
//                 <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
//                     <Activity className="h-4 w-4 text-emerald-500" />
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Telemetry Sync</p>
//                   <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Syllabus Node: 100% Verified</p>
//                 </div>
//               </motion.div>

//               {/* Data Node 02 */}
//               <motion.div
//                 className="absolute right-8 top-16 z-20 hidden rounded-2xl border border-white/10 bg-slate-950/90 px-5 py-4 shadow-2xl backdrop-blur-md lg:flex items-center gap-4"
//                 animate={{ y: [0, 10, 0] }}
//                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
//               >
//                 <div className="h-8 w-8 rounded-lg bg-school-primary/10 flex items-center justify-center">
//                     <Sparkles className="h-4 w-4 text-school-primary" />
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">AI Synthesis</p>
//                   <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Multicurricular Logic Active</p>
//                 </div>
//               </motion.div>
//             </motion.div>
//           </motion.div>

//         </div>
//       </div>
//     </section>
//   );
// }



"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck, Globe, Activity } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { cn } from '@/lib/utils';

// ── Animation Variants ────────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUpZoom: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9, rotateX: -5 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: { duration: 1, ease: "easeOut" }
  },
};

/**
 * LANDING HERO (Tier 0)
 * Rule 11: Enforces Brutal-Elegant typography standards.
 * Rule 18: Uses Semantic Tokens (bg-background, bg-card, border-border).
 * Rule 2 & 6: Explicitly targets Tier-2 (Institutions) and Tier-3 (Individuals).
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-8 pb-12 lg:pt-16 lg:pb-16">
      {/* Dynamic Background Auras - Using opacity variants of school-primary */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--school-primary),transparent_25%)] opacity-[0.03]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,var(--school-primary),transparent_25%)] opacity-[0.02]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">

          {/* ── LEFT: CORE MESSAGING ── */}
          <motion.div
            className="text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeUpZoom}
              className="mb-8 inline-flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-school-primary shadow-xl"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              Intelligence Registry v1.2
            </motion.div>

            <motion.h1
              variants={fadeUpZoom}
              className="text-balance text-4xl font-black leading-[1.1] tracking-tighter text-foreground md:text-5xl lg:text-6xl uppercase italic"
            >
              The Multicurricular <br/>
              <span className="bg-gradient-to-r from-school-primary via-school-primary to-school-primary/60 bg-clip-text text-transparent underline decoration-border underline-offset-8">
                AI Academic Core
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpZoom}
              className="mx-auto mt-10 max-w-xl text-pretty text-sm  font-bold uppercase tracking-widest leading-relaxed text-muted-foreground lg:mx-0 italic"
            >
              Centralized knowledge synthesis for modern institutions and self-paced learners. 
              Deploy logic across Global Tier-1 Curriculums instantly.
            </motion.p>

            <motion.div
              variants={fadeUpZoom}
              className="mt-12 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              {/* Institutional Tier (2) Action */}
              <Link href="/onboarding" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full h-16 gap-3 bg-school-primary text-on-school-primary font-black text-[11px] uppercase tracking-[0.3em] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(var(--school-primary-rgb),0.3)] rounded-2xl"
                >
                  <ShieldCheck className="h-5 w-5" />
                  Provision Institution
                </Button>
              </Link>

              {/* Individual Tier (3) Action */}
              <Link href="/onboarding/individual" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-16 gap-3 border-border bg-card/50 text-foreground px-10 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-school-primary/10 rounded-2xl transition-all"
                >
                  <Globe className="h-5 w-5 text-school-primary" />
                  Individual Registry
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: SYSTEM INTERFACE VISUAL ── */}
          <motion.div
            className="relative"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            style={{ perspective: 1500 }}
          >
            {/* Ambient Background Aura */}
            <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-school-primary/5 blur-[120px]" />

            <motion.div
              className="relative overflow-hidden rounded-[3.5rem] border border-border bg-card p-3 shadow-2xl"
              whileHover={{
                rotateY: 5,
                rotateX: -2,
                scale: 1.01,
                transition: { duration: 0.5, ease: "easeOut" },
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src="/hero-dashboard.jpg"
                alt="SchoolPaaS Registry Interface"
                width={1200}
                height={800}
                priority
                className="relative z-10 h-auto w-full rounded-[3rem] opacity-90 dark:opacity-80"
              />

              {/* Telemetry Node - Bottom Left */}
              <motion.div
                className="absolute left-8 bottom-16 z-20 hidden rounded-2xl border border-border bg-background/90 px-5 py-4 shadow-2xl backdrop-blur-md lg:flex items-center gap-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Activity className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-foreground uppercase tracking-widest leading-none">Telemetry Sync</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase mt-1">Syllabus: 100% Verified</p>
                </div>
              </motion.div>

              {/* Synthesis Node - Top Right */}
              <motion.div
                className="absolute right-8 top-16 z-20 hidden rounded-2xl border border-border bg-background/90 px-5 py-4 shadow-2xl backdrop-blur-md lg:flex items-center gap-4"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="h-8 w-8 rounded-lg bg-school-primary/10 flex items-center justify-center border border-school-primary/20">
                    <Sparkles className="h-4 w-4 text-school-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-foreground uppercase tracking-widest leading-none">AI Synthesis</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase mt-1">Logic Cycle: Active</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}