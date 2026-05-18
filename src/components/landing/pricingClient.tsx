"use client";

import React, { useState } from "react";
import { Check, Zap, School, Building2, User, ShieldCheck, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useProfileStore } from "@/store/profileStore";

// ── Types ───────────────────────────────────────────────────────────────────

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
    description: "For emerging learning centers and small cohorts.",
    icon: <Zap className="h-5 w-5 text-blue-500" />,
    features: ["50 Student Identities", "Institutional Node", "AI Lesson Synthesis", "CBT Registry Access", "Staff Dashboard"],
    highlight: false,
  },
  {
    name: "Professional",
    id: "pro",
    tier: "Tier 02",
    price: 199,
    description: "High-performance logic for established schools.",
    icon: <School className="h-5 w-5 text-amber-500" />,
    features: ["500 Student Identities", "Multi-Curricular Sync", "AI Video Registry", "Family Communication Bridge", "Advanced Telemetry"],
    highlight: true,
  },
  {
    name: "Enterprise",
    id: "enterprise",
    tier: "Tier 02",
    price: 599,
    description: "Full-scale infrastructure for school groups.",
    icon: <Building2 className="h-5 w-5 text-purple-500" />,
    features: ["Unlimited Identities", "Custom Mapping Node", "White-label Protocol", "Priority Logic Pipeline", "API Data Sink"],
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
 * UNIFIED PRICING INTERFACE
 * Rule 11: Standardizes the "Registry" aesthetic.
 * Rule 2 & 6: Distinguishes between Individual and Institutional Tiers.
 * Rule 17: Injects branding from Zustand if user is logged in.
 */
export function PricingClient() {
  const router = useRouter();
  const { profile } = useProfileStore();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  
  const primaryColor = profile?.primaryColor || "#f59e0b";

  return (
    <div className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center space-y-10">
        
        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-school-primary shadow-2xl">
            <ShieldCheck className="h-3.5 w-3.5" />
            Deployment Protocol: v1.2
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
            Registry <span style={{ color: primaryColor }}>Access Tiers</span>
          </h1>
          
          {/* Toggle Engine */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", billingCycle === "monthly" ? "text-white" : "text-slate-600")}>Monthly Billing</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
              className="w-16 h-8 bg-slate-900 border border-white/10 rounded-full relative focus:outline-none"
            >
              <motion.div 
                className="absolute top-1 left-1 w-6 h-6 rounded-full shadow-lg"
                animate={{ x: billingCycle === "annually" ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{ backgroundColor: primaryColor }}
              />
            </button>
            <div className="flex items-center gap-3">
                <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", billingCycle === "annually" ? "text-white" : "text-slate-600")}>Annual Sync</span>
                <span className="text-emerald-500 text-[9px] bg-emerald-500/10 px-3 py-1 rounded-full font-black uppercase tracking-tighter border border-emerald-500/20">-20% DISCOUNT</span>
            </div>
          </div>
        </motion.div>


        {/* ── PRICING MATRIX ── */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {plans.map((plan) => {
            const monthlyPrice = plan.price;
            const discountedMonthly = Math.floor(monthlyPrice * 0.8);
            const yearlyTotal = discountedMonthly * 12;

            return (
              <motion.div key={plan.id} variants={cardVariants} className="relative h-full">
                <Card className={cn(
                  "flex flex-col h-full bg-slate-900 border transition-all duration-500 rounded-[2.5rem] overflow-hidden shadow-2xl", 
                  plan.highlight ? "border-school-primary/40" : "border-white/5"
                )}
                style={plan.highlight ? { boxShadow: `0 20px 50px ${primaryColor}10` } : {}}
                >
                  <CardHeader className="text-left p-8 space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-slate-950 rounded-2xl border border-white/5 shadow-inner">
                            {plan.icon}
                        </div>
                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{plan.tier}</span>
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-black text-white uppercase italic tracking-tighter">{plan.name}</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">{plan.description}</CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="grow text-left p-8 pt-0 space-y-8">
                    <div className="h-16 flex flex-col justify-end">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={billingCycle}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          {billingCycle === "monthly" ? (
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-black text-white italic tracking-tighter">₦{monthlyPrice.toLocaleString()}</span>
                              <span className="text-slate-600 text-xs font-black uppercase tracking-widest">/mo</span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white italic tracking-tighter">₦{yearlyTotal.toLocaleString()}</span>
                                <span className="text-slate-600 text-xs font-black uppercase tracking-widest">/yr</span>
                              </div>
                              <p className="text-[9px] text-emerald-500 font-black uppercase mt-2 italic">
                                Optimized: Synchronized Annual License
                              </p>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="h-px bg-white/5 w-full" />

                    <ul className="space-y-4">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 group">
                          <Check className="h-4 w-4 text-school-primary shrink-0 transition-transform group-hover:scale-125" style={{ color: primaryColor }} /> 
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="p-8 pt-0">
                    <Button 
                      onClick={() => router.push(`/onboarding?plan=${plan.id}&cycle=${billingCycle}`)} 
                      className="w-full h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                      style={{ 
                          backgroundColor: plan.highlight ? primaryColor : '#1e293b', 
                          color: plan.highlight ? '#000' : '#fff' 
                      }}
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
    </div>
  );
}