// "use client";

// import { Button } from "@/components/ui/button";
// import { ArrowRight, Sparkles } from "lucide-react";
// import { motion } from "framer-motion";

// export function CTA() {
//   return (
//     <section id="pricing" className="bg-background py-12 lg:py-24">
//       <div className="mx-auto max-w-7xl px-6">
//         <motion.div
//           // We use a very dark slate background to make the Amber pop
//           className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 px-8 py-20 text-center shadow-2xl md:px-16 lg:py-28"
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
//         >
//           {/* THE AMBER GLOW: This creates the "Premium" feel */}
//           <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15),transparent_70%)]" />
          
//           {/* Subtle grid pattern for texture */}
//           <div className="absolute inset-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" 
//                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` }} 
//           />

//           <div className="relative z-10">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//               className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm font-semibold text-amber-500"
//             >
//               <Sparkles className="h-4 w-4" />
//               Limited Beta Access Now Open
//             </motion.div>

//             <motion.h2
//   className="text-balance text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
//   initial={{ opacity: 0, y: 20 }}
//   whileInView={{ opacity: 1, y: 0 }}
//   transition={{ duration: 0.6, delay: 0.2 }}
// >
//   Ready to{" "}
//   <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
//     Transform
//   </span>{" "}
//   Your School?
// </motion.h2>

//             <motion.p
//               className="mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-slate-400"
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.3 }}
//             >
//               Join the new generation of educators across the UK, US, and Nigeria 
//               delivering world-class learning outcomes with AI.
//             </motion.p>

//             <motion.div
//               className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row"
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//             >
//               <Button
//                 size="lg"
//                 className="group relative h-14 gap-2 overflow-hidden bg-amber-500 px-10 text-lg font-bold text-slate-950 transition-all hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
//               >
//                 Get Started Free
//                 <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
//               </Button>
              
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="h-14 border-slate-800 bg-transparent px-10 text-lg font-semibold text-white hover:bg-white/5"
//               >
//                 Schedule a Demo
//               </Button>
//             </motion.div>

//             {/* Trusted By text */}
//             <motion.p 
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ delay: 0.6 }}
//               className="mt-12 text-sm font-medium text-slate-500"
//             >
//               No credit card required • Cancel anytime • 14-day free trial
//             </motion.p>
//           </div>

//           {/* Decorative corner elements */}
//           <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-500/10 blur-[100px]" />
//           <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-500/10 blur-[100px]" />
//         </motion.div>
//       </div>
//     </section>
//   );
// }



// "use client";

// import { Button } from "@/components/ui/button";
// import { CheckCircle2, Sparkles, ShieldCheck, Globe } from "lucide-react";
// import { motion } from "framer-motion";
// import Link from "next/link";

// /**
//  * CONVERSION PROTOCOL (Tier 0)
//  * Rule 11: Enforces the Brutal-Elegant typography of the Registry.
//  * Rule 2 & 6: Unified messaging for Institutions and Individual Learners.
//  */
// export function CTA() {
//   return (
//     <section id="conversion" className="bg-slate-950 py-20 lg:py-32 overflow-hidden">
//       <div className="mx-auto max-w-7xl px-6">
//         <motion.div
//           className="relative overflow-hidden rounded-[3rem] bg-slate-900 border border-white/5 px-8 py-24 text-center shadow-2xl md:px-16 lg:py-32"
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
//         >
//           {/* THE PRIMARY GLOW */}
//           <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08),transparent_70%)]" />
          
//           {/* Registry Grid Texture */}
//           <div className="absolute inset-0 opacity-[0.02]" 
//                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23ffffff' stroke-width='1'%3E%3Cpath d='M30 0v60M0 30h60'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
//           />

//           <div className="relative z-10 space-y-10">
//             {/* Rule 16: Badges for Authority */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-school-primary shadow-xl"
//             >
//               <Sparkles className="h-4 w-4" />
//               Deployment Protocol: Active
//             </motion.div>

//             <div className="space-y-4">
//                 <motion.h2
//                     className="text-balance text-5xl font-black tracking-tighter text-white md:text-6xl lg:text-7xl uppercase italic leading-none"
//                 >
//                     Secure Your <br/>
//                     <span className="text-school-primary underline decoration-white/10 underline-offset-8">Registry Node</span>
//                 </motion.h2>

//                 <motion.p
//                     className="mx-auto mt-8 max-w-2xl text-slate-400 text-sm md:text-lg font-bold uppercase tracking-widest leading-relaxed italic"
//                 >
//                     Provision your institutional workspace or initialize your personal global learning library today.
//                 </motion.p>
//             </div>

//             {/* Rule 2 & 6: Tier-Specific Onboarding Paths */}
//             <motion.div
//               className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
//             >
//               <Link href="/onboarding" className="w-full sm:w-auto">
//                 <Button
//                     size="lg"
//                     className="w-full h-16 gap-3 bg-school-primary px-10 text-[11px] font-black uppercase tracking-[0.3em] text-slate-950 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.3)] rounded-2xl"
//                 >
//                     <ShieldCheck className="h-5 w-5" />
//                     Provision Institution
//                 </Button>
//               </Link>
              
//               <Link href="/register" className="w-full sm:w-auto">
//                 <Button
//                     variant="outline"
//                     size="lg"
//                     className="w-full h-16 gap-3 border-white/10 bg-slate-950/50 px-10 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/5 rounded-2xl transition-all"
//                 >
//                     <Globe className="h-5 w-5" />
//                     Individual Registry
//                 </Button>
//               </Link>
//             </motion.div>

//             {/* Support Metrics */}
//             <div className="flex flex-wrap justify-center gap-8 pt-10 border-t border-white/5 opacity-40">
//                 <div className="flex items-center gap-2">
//                     <CheckCircle2 className="h-3 w-3 text-emerald-500" />
//                     <span className="text-[9px] font-black uppercase tracking-widest">Multi-Curricular Core</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <CheckCircle2 className="h-3 w-3 text-emerald-500" />
//                     <span className="text-[9px] font-black uppercase tracking-widest">PCI-DSS Encrypted</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <CheckCircle2 className="h-3 w-3 text-emerald-500" />
//                     <span className="text-[9px] font-black uppercase tracking-widest">No Card Required</span>
//                 </div>
//             </div>
//           </div>

//           {/* Decorative Corner Accents */}
//           <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-school-primary/5 blur-[100px]" />
//           <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-school-primary/5 blur-[100px]" />
//         </motion.div>
//       </div>
//     </section>
//   );
// }



"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, ShieldCheck, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

/**
 * CONVERSION PROTOCOL (Tier 0)
 * Rule 11: Enforces the Brutal-Elegant typography of the Registry.
 * Rule 18: Uses Semantic Tokens (bg-background, bg-card, border-border).
 * Rule 2 & 6: Unified messaging for Institutions and Individual Learners.
 */
export function CTA() {
  return (
    <section id="conversion" className="bg-background py-20 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="relative overflow-hidden rounded-[3rem] bg-card border border-border px-8 py-24 text-center shadow-2xl md:px-16 lg:py-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {/* THE PRIMARY BRAND GLOW */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--school-primary),transparent_70%)] opacity-[0.05]" />
          
          {/* Registry Grid Texture */}
          <div className="absolute inset-0 opacity-[0.02]" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23ffffff' stroke-width='1'%3E%3Cpath d='M30 0v60M0 30h60'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
          />

          <div className="relative z-10 space-y-10">
            {/* Deployment Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 rounded-2xl border border-border bg-background px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-school-primary shadow-xl"
            >
              <Sparkles className="h-4 w-4" />
              Deployment Protocol: Active
            </motion.div>

            <div className="space-y-4">
                <motion.h2
                    className="text-balance text-5xl font-black tracking-tighter text-foreground md:text-6xl lg:text-7xl uppercase italic leading-none"
                >
                    Secure Your <br/>
                    <span className="text-school-primary underline decoration-border underline-offset-8">Registry Node</span>
                </motion.h2>

                <motion.p
                    className="mx-auto mt-8 max-w-2xl text-muted-foreground text-sm md:text-lg font-bold uppercase tracking-widest leading-relaxed italic"
                >
                    Provision your institutional workspace or initialize your personal global learning library today.
                </motion.p>
            </div>

            {/* Tier-Specific Redirection Matrix */}
            <motion.div
              className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/onboarding" className="w-full sm:w-auto">
                <Button
                    size="lg"
                    className="w-full h-16 gap-3 bg-school-primary text-on-school-primary font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(var(--school-primary-rgb),0.3)] rounded-2xl"
                >
                    <ShieldCheck className="h-5 w-5" />
                    Provision Institution
                </Button>
              </Link>
              
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-16 gap-3 border-border bg-background text-foreground px-10 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-school-primary/10 rounded-2xl transition-all"
                >
                    <Globe className="h-5 w-5 text-school-primary" />
                    Individual Registry
                </Button>
              </Link>
            </motion.div>

            {/* Compliance Footer */}
            <div className="flex flex-wrap justify-center gap-8 pt-10 border-t border-border opacity-60">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Multi-Curricular Core</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">PCI-DSS Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Universal Access</span>
                </div>
            </div>
          </div>

          {/* Decorative Brand Accents */}
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-school-primary/5 blur-[100px]" />
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-school-primary/5 blur-[100px]" />
        </motion.div>
      </div>
    </section>
  );
}