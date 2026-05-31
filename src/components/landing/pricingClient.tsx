// "use client";

// import React, { useState } from "react";
// import { Check, Zap, School, Building2, User, ShieldCheck, Globe } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { useProfileStore } from "@/store/profileStore";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface Plan {
//     name: string;
//     id: string;
//     tier: string;
//     price: number;
//     description: string;
//     icon: React.ReactNode;
//     features: string[];
//     highlight: boolean;
// }

// const plans: Plan[] = [
//   {
//     name: "Independent",
//     id: "individual",
//     tier: "Tier 03",
//     price: 19,
//     description: "For individual learners and personal registry usage.",
//     icon: <User className="h-5 w-5 text-emerald-500" />,
//     features: ["1 Personal Profile", "Global Core Access", "AI Synthesis Logic", "Personal Scanned Bank", "WhatsApp Telemetry"],
//     highlight: false,
//   },
//   {
//     name: "Starter",
//     id: "starter",
//     tier: "Tier 02",
//     price: 49,
//     description: "For emerging learning centers and small cohorts.",
//     icon: <Zap className="h-5 w-5 text-blue-500" />,
//     features: ["50 Student Identities", "Institutional Node", "AI Lesson Synthesis", "CBT Registry Access", "Staff Dashboard"],
//     highlight: false,
//   },
//   {
//     name: "Professional",
//     id: "pro",
//     tier: "Tier 02",
//     price: 199,
//     description: "High-performance logic for established schools.",
//     icon: <School className="h-5 w-5 text-amber-500" />,
//     features: ["500 Student Identities", "Multi-Curricular Sync", "AI Video Registry", "Family Communication Bridge", "Advanced Telemetry"],
//     highlight: true,
//   },
//   {
//     name: "Enterprise",
//     id: "enterprise",
//     tier: "Tier 02",
//     price: 599,
//     description: "Full-scale infrastructure for school groups.",
//     icon: <Building2 className="h-5 w-5 text-purple-500" />,
//     features: ["Unlimited Identities", "Custom Mapping Node", "White-label Protocol", "Priority Logic Pipeline", "API Data Sink"],
//     highlight: false,
//   },
// ];

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.1 },
//   },
// };

// const cardVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: { 
//     opacity: 1, 
//     y: 0,
//     transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
//   },
// };

// /**
//  * UNIFIED PRICING INTERFACE
//  * Rule 11: Standardizes the "Registry" aesthetic.
//  * Rule 2 & 6: Distinguishes between Individual and Institutional Tiers.
//  * Rule 17: Injects branding from Zustand if user is logged in.
//  */
// export function PricingClient() {
//   const router = useRouter();
//   const { profile } = useProfileStore();
//   const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   return (
//     <div className="py-24 px-6 overflow-hidden">
//       <div className="max-w-7xl mx-auto text-center space-y-10">
        
//         {/* ── HEADER ── */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="space-y-6"
//         >
//           <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-school-primary shadow-2xl">
//             <ShieldCheck className="h-3.5 w-3.5" />
//             Deployment Protocol: v1.2
//           </div>

//           <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
//             Registry <span style={{ color: primaryColor }}>Access Tiers</span>
//           </h1>
          
//           {/* Toggle Engine */}
//           <div className="flex items-center justify-center gap-6 mt-12">
//             <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", billingCycle === "monthly" ? "text-white" : "text-slate-600")}>Monthly Billing</span>
//             <button 
//               onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
//               className="w-16 h-8 bg-slate-900 border border-white/10 rounded-full relative focus:outline-none"
//             >
//               <motion.div 
//                 className="absolute top-1 left-1 w-6 h-6 rounded-full shadow-lg"
//                 animate={{ x: billingCycle === "annually" ? 32 : 0 }}
//                 transition={{ type: "spring", stiffness: 400, damping: 25 }}
//                 style={{ backgroundColor: primaryColor }}
//               />
//             </button>
//             <div className="flex items-center gap-3">
//                 <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", billingCycle === "annually" ? "text-white" : "text-slate-600")}>Annual Sync</span>
//                 <span className="text-emerald-500 text-[9px] bg-emerald-500/10 px-3 py-1 rounded-full font-black uppercase tracking-tighter border border-emerald-500/20">-20% DISCOUNT</span>
//             </div>
//           </div>
//         </motion.div>


//         {/* ── PRICING MATRIX ── */}
//         <motion.div 
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           {plans.map((plan) => {
//             const monthlyPrice = plan.price;
//             const discountedMonthly = Math.floor(monthlyPrice * 0.8);
//             const yearlyTotal = discountedMonthly * 12;

//             return (
//               <motion.div key={plan.id} variants={cardVariants} className="relative h-full">
//                 <Card className={cn(
//                   "flex flex-col h-full bg-slate-900 border transition-all duration-500 rounded-[2.5rem] overflow-hidden shadow-2xl", 
//                   plan.highlight ? "border-school-primary/40" : "border-white/5"
//                 )}
//                 style={plan.highlight ? { boxShadow: `0 20px 50px ${primaryColor}10` } : {}}
//                 >
//                   <CardHeader className="text-left p-8 space-y-4">
//                     <div className="flex justify-between items-start">
//                         <div className="p-3 bg-slate-950 rounded-2xl border border-white/5 shadow-inner">
//                             {plan.icon}
//                         </div>
//                         <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{plan.tier}</span>
//                     </div>
//                     <div>
//                         <CardTitle className="text-2xl font-black text-white uppercase italic tracking-tighter">{plan.name}</CardTitle>
//                         <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">{plan.description}</CardDescription>
//                     </div>
//                   </CardHeader>

//                   <CardContent className="grow text-left p-8 pt-0 space-y-8">
//                     <div className="h-16 flex flex-col justify-end">
//                       <AnimatePresence mode="wait">
//                         <motion.div
//                           key={billingCycle}
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: -10 }}
//                         >
//                           {billingCycle === "monthly" ? (
//                             <div className="flex items-baseline gap-1">
//                               <span className="text-4xl font-black text-white italic tracking-tighter">₦{monthlyPrice.toLocaleString()}</span>
//                               <span className="text-slate-600 text-xs font-black uppercase tracking-widest">/mo</span>
//                             </div>
//                           ) : (
//                             <div>
//                               <div className="flex items-baseline gap-1">
//                                 <span className="text-4xl font-black text-white italic tracking-tighter">₦{yearlyTotal.toLocaleString()}</span>
//                                 <span className="text-slate-600 text-xs font-black uppercase tracking-widest">/yr</span>
//                               </div>
//                               <p className="text-[9px] text-emerald-500 font-black uppercase mt-2 italic">
//                                 Optimized: Synchronized Annual License
//                               </p>
//                             </div>
//                           )}
//                         </motion.div>
//                       </AnimatePresence>
//                     </div>

//                     <div className="h-px bg-white/5 w-full" />

//                     <ul className="space-y-4">
//                       {plan.features.map((f, i) => (
//                         <li key={i} className="flex items-start gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 group">
//                           <Check className="h-4 w-4 text-school-primary shrink-0 transition-transform group-hover:scale-125" style={{ color: primaryColor }} /> 
//                           {f}
//                         </li>
//                       ))}
//                     </ul>
//                   </CardContent>

//                   <CardFooter className="p-8 pt-0">
//                     <Button 
//                       onClick={() => router.push(`/onboarding?plan=${plan.id}&cycle=${billingCycle}`)} 
//                       className="w-full h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl transition-all hover:scale-[1.02] active:scale-95"
//                       style={{ 
//                           backgroundColor: plan.highlight ? primaryColor : '#1e293b', 
//                           color: plan.highlight ? '#000' : '#fff' 
//                       }}
//                     >
//                       Initialize Deployment
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </motion.div>
//             );
//           })}
//         </motion.div>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useState } from "react";
import { Check, Zap, School, Building2, User, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";


// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface Plan {
    name: string;
    id: string;
    tier: string;
    price: number;
    description: string;
    icon: React.ReactNode;
    features: string[];
    highlight: boolean;
}

const plans: Plan[] = [
  {
    name: "Independent",
    id: "individual",
    tier: "Tier 03",
    price: 19,
    description: "For individual learners and personal registry usage.",
    icon: <User className="h-5 w-5 text-emerald-500" />,
    features: ["1 Personal Profile", "Global Core Access", "AI Synthesis Logic", "Personal Scanned Bank", "WhatsApp Telemetry"],
    highlight: false,
  },
  {
    name: "Starter",
    id: "starter",
    tier: "Tier 02",
    price: 49,
    description: "For emerging learning hubs and small cohorts.",
    icon: <Zap className="h-5 w-5 text-blue-500" />,
    features: ["50 Student Profiles", "Institutional Hub", "AI Lesson Synthesis", "CBT Registry Access", "Staff Dashboard"],
    highlight: false,
  },
  {
    name: "Professional",
    id: "pro",
    tier: "Tier 02",
    price: 199,
    description: "High-performance logic for established schools.",
    icon: <School className="h-5 w-5 text-school-primary" />,
    features: ["500 Student Profiles", "Multi-Curricular Sync", "AI Video Registry", "Family Communication Hub", "Advanced Telemetry"],
    highlight: true,
  },
  {
    name: "Enterprise",
    id: "enterprise",
    tier: "Tier 02",
    price: 599,
    description: "Full-scale infrastructure for school groups.",
    icon: <Building2 className="h-5 w-5 text-purple-500" />,
    features: ["Unlimited Profiles", "Custom Mapping Hub", "White-label Protocol", "Priority Logic Pipeline", "API Data Sink"],
    highlight: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
};

/**
 * UNIFIED PRICING INTERFACE (Tier 0)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function PricingClient() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  
  return (
    <section className="bg-background py-16 md:py-24 lg:py-32 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center space-y-12">
        
        {/* ── HEADER (Rule 11/21) ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-school-primary-200 bg-school-primary-50 px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-school-primary shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            Licensing Protocol: Global Sync
          </div>

          <h1 className="text-balance text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
            Registry <span className="text-school-primary">Access Tiers</span>
          </h1>
          
          {/* ── BILLING TOGGLE (Rule 18/19/21) ── */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-colors", 
                billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"
            )}>
                Monthly Cycle
            </span>
            <button 
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
              className="w-16 h-8 bg-surface border border-border rounded-full relative focus:outline-none shadow-inner"
            >
              <motion.div 
                className="absolute top-1 left-1 w-6 h-6 rounded-full shadow-lg bg-school-primary"
                animate={{ x: billingCycle === "annually" ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            </button>
            <div className="flex items-center gap-4">
                <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest transition-colors", 
                    billingCycle === "annually" ? "text-foreground" : "text-muted-foreground"
                )}>
                    Annual Sync
                </span>
                <span className="text-emerald-600 text-[9px] bg-emerald-50 px-3 py-1 rounded-full font-extrabold uppercase tracking-tighter border border-emerald-200 shadow-sm">
                    -20% OPTIMIZED
                </span>
            </div>
          </div>
        </motion.div>


        {/* ── PRICING MATRIX GRID (Rule 20) ── */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pt-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {plans.map((plan) => {
            const monthlyPrice = plan.price;
            const discountedMonthly = Math.floor(monthlyPrice * 0.8);
            const yearlyTotal = discountedMonthly * 12;

            return (
              <motion.div key={plan.id} variants={cardVariants} className="relative h-full">
                <Card className={cn(
                  "flex flex-col h-full bg-card border transition-all duration-500 rounded-[2rem] overflow-hidden shadow-xl", 
                  plan.highlight ? "border-school-primary/40 ring-1 ring-school-primary-100" : "border-border hover:border-school-primary-200"
                )}>
                  {/* Highlight Header */}
                  {plan.highlight && (
                      <div className="bg-school-primary py-1.5 text-center">
                          <p className="text-[8px] font-extrabold uppercase tracking-[0.3em] text-on-school-primary">Institutional Gold Standard</p>
                      </div>
                  )}

                  <CardHeader className="text-left p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-surface rounded-2xl border border-border shadow-inner">
                            {plan.icon}
                        </div>
                        <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest opacity-40">{plan.tier}</span>
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                            {plan.name}
                        </CardTitle>
                        <CardDescription className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-2 italic leading-relaxed">
                            {plan.description}
                        </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="grow text-left p-6 md:p-8 pt-0 space-y-8">
                    <div className="h-16 flex flex-col justify-end">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={billingCycle}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {billingCycle === "monthly" ? (
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-extrabold text-foreground italic tracking-tighter tabular-nums">₦{monthlyPrice.toLocaleString()}</span>
                              <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60">/mo</span>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-foreground italic tracking-tighter tabular-nums">₦{yearlyTotal.toLocaleString()}</span>
                                <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60">/yr</span>
                              </div>
                              <p className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-tighter italic">
                                Synchronized Annual License
                              </p>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="h-px bg-border w-full opacity-40" />

                    {/* ── FEATURE MATRIX ── */}
                    <ul className="space-y-4">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 group">
                          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-school-primary-50 border border-school-primary-200 transition-colors group-hover:bg-school-primary-100">
                             <Check className="h-3 w-3 text-school-primary stroke-[4]" /> 
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="p-6 md:p-8 pt-0">
                    <Button 
                      onClick={() => router.push(`/onboarding?plan=${plan.id}&cycle=${billingCycle}`)} 
                      className={cn(
                        "w-full h-14 rounded-2xl font-extrabold text-[11px] uppercase tracking-widest shadow-lg transition-all active:scale-95",
                        plan.highlight 
                            ? "bg-school-primary text-on-school-primary shadow-school-primary-200" 
                            : "bg-surface border border-border text-foreground hover:bg-background"
                      )}
                    >
                      Initialize Deployment
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}



// "use client";

// import React from "react";
// import {
//   School,
//   ShieldCheck,
//   BarChart3,
//   Zap,
//   ClipboardCheck,
//   Globe,
//   TrendingUp,
//   Cpu,
//   Users,
// } from "lucide-react";
// import { motion, Variants } from "framer-motion";
// import { cn } from "@/lib/utils";

// // ── Animation Variants ────────────────────────────────────────────────────────

// const cardVariants: Variants = {
//   hidden: { opacity: 0, y: 30, scale: 0.98 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: {
//       delay: i * 0.1,
//       duration: 0.6,
//       ease: [0.22, 1, 0.36, 1],
//     },
//   }),
// };

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
//       { icon: ClipboardCheck, text: "Automated Grading Hub" },
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

// export function Pillars() {
//   return (
//     <section id="pillars" className="bg-background py-16 md:py-24 lg:py-32 overflow-hidden border-t border-border">
//       <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 w-full">
        
//         {/* ── HEADER SECTION ── */}
//         <motion.div
//           className="mx-auto mb-16 md:mb-24 max-w-3xl text-center space-y-6"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 0.7, ease: "easeOut" }}
//         >
//           <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-school-primary">
//             Registry Architecture
//           </p>
          
//           <h2 className="text-balance text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground uppercase italic leading-[1.1]">
//             Three Tiers, <br/>
//             <span className="text-school-primary decoration-border/30 underline-offset-8">One knowledge engine</span>
//           </h2>
          
//           <p className="mt-8 text-pretty text-sm md:text-lg font-semibold uppercase tracking-widest leading-relaxed text-muted-foreground italic opacity-80">
//             Whether you govern an institution, lead a classroom, or direct your own personal learning roadmap.
//           </p>
//         </motion.div>

//         {/* ── PILLAR GRID ── */}
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {pillars.map((pillar, i) => (
//             <motion.div
//               key={pillar.title}
//               custom={i}
//               variants={cardVariants}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true, margin: "-50px" }}
//               className={cn(
//                 "group relative flex flex-col p-8 md:p-10 transition-all duration-500",
//                 "bg-card border border-border rounded-[2rem] shadow-xl hover:border-school-primary/30"
//               )}
//             >
//               {/* Tier Label */}
//               <div className="absolute top-10 right-10 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest group-hover:text-school-primary transition-colors">
//                 {pillar.tier}
//               </div>

//               {/* Icon Matrix */}
//               <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface border border-border text-muted-foreground transition-all duration-500 group-hover:bg-school-primary group-hover:text-on-school-primary group-hover:border-transparent group-hover:scale-110 shadow-inner">
//                 <pillar.icon className="h-8 w-8" strokeWidth={1.5} />
//               </div>

//               <div className="space-y-4 mb-10">
//                   <h3 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter">
//                     {pillar.title}
//                   </h3>
                  
//                   <p className="text-[11px] font-semibold leading-relaxed text-muted-foreground uppercase tracking-widest italic">
//                     {pillar.description}
//                   </p>
//               </div>

//               {/* Feature Map (Switched from Node to Hub/Module) */}
//               <div className="mt-auto flex flex-col gap-4 border-t border-border pt-8">
//                 {pillar.features.map((feature) => (
//                   <div
//                     key={feature.text}
//                     className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-foreground/70"
//                   >
//                     <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-school-primary-50 border border-school-primary-200 text-school-primary group-hover:bg-school-primary-100 transition-colors">
//                        <feature.icon className="h-4 w-4" />
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