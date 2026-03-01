// "use client";

// import React, { useState } from "react";
// import { Check, Zap, School, Building2, User } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// const plans = [
//   {
//     name: "Independent",
//     id: "individual",
//     price: 19,
//     description: "For solo students or homeschoolers.",
//     icon: <User className="h-5 w-5 text-emerald-500" />,
//     features: ["1 Student Profile", "1 Curriculum Access", "Personal AI Tutor", "Self-Paced Quizzes", "WhatsApp Alerts"],
//     highlight: false,
//   },
//   {
//     name: "Starter",
//     id: "starter",
//     price: 49,
//     description: "For small learning centers.",
//     icon: <Zap className="h-5 w-5 text-blue-500" />,
//     features: ["Up to 50 Students", "Single Curriculum", "AI Lesson Generation", "Basic Assessments", "Teacher Dashboard"],
//     highlight: false,
//   },
//   {
//     name: "Professional",
//     id: "pro",
//     price: 199,
//     description: "For established schools.",
//     icon: <School className="h-5 w-5 text-amber-500" />,
//     features: ["Up to 500 Students", "Multi-Curriculum Support", "AI Video Scripts", "Full CRM & Sales", "Advanced Analytics"],
//     highlight: true,
//   },
//   {
//     name: "Enterprise",
//     id: "enterprise",
//     price: 599,
//     description: "For large school groups.",
//     icon: <Building2 className="h-5 w-5 text-purple-500" />,
//     features: ["Unlimited Students", "Custom Mapping", "White-labeling", "Priority AI Tokens", "API Access"],
//     highlight: false,
//   },
// ];

// export default function PricingPage() {
//   const router = useRouter();
//   const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

//   return (
//     <div className="min-h-screen bg-slate-50 py-20 px-4">
//       <div className="max-w-7xl mx-auto text-center">
//         <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 leading-tight">
//           Flexible plans for <span className="text-amber-600">modern education.</span>
//         </h1>
        
//         {/* Billing Toggle */}
//         <div className="flex items-center justify-center gap-4 mb-12 mt-8">
//           <span className={cn("text-sm font-bold", billingCycle === "monthly" ? "text-slate-900" : "text-slate-400")}>Monthly</span>
//           <button 
//             onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
//             className="w-12 h-6 bg-slate-200 rounded-full relative focus:outline-none ring-2 ring-amber-500 ring-offset-2"
//           >
//             <div className={cn("absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200", billingCycle === "annually" ? "translate-x-6 bg-amber-600" : "")} />
//           </button>
//           <span className={cn("text-sm font-bold", billingCycle === "annually" ? "text-slate-900" : "text-slate-400")}>
//             Annually <span className="text-green-600 text-[10px] bg-green-100 px-2 py-0.5 rounded-full ml-1 font-black uppercase">-20%</span>
//           </span>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {plans.map((plan) => {
//             // Price Logic
//             const monthlyPrice = plan.price;
//             const discountedMonthly = Math.floor(monthlyPrice * 0.8);
//             const yearlyTotal = discountedMonthly * 12;

//             return (
//               <Card key={plan.id} className={cn("flex flex-col border-2 transition-all", plan.highlight ? "border-amber-500 shadow-xl lg:scale-105 bg-white" : "border-slate-200 bg-white/50")}>
//                 <CardHeader className="text-left">
//                   <div className="flex items-center gap-2 mb-1">
//                     {plan.icon} 
//                     <CardTitle className="text-lg">{plan.name}</CardTitle>
//                   </div>
//                   <CardDescription className="text-xs h-8">{plan.description}</CardDescription>
//                 </CardHeader>

//                 <CardContent className="flex-grow text-left">
//                   <div className="mb-6 h-16">
//                     {billingCycle === "monthly" ? (
//                       <div>
//                         <span className="text-4xl font-black text-slate-900">${monthlyPrice}</span>
//                         <span className="text-slate-500 text-sm font-medium"> /mo</span>
//                       </div>
//                     ) : (
//                       <div>
//                         <span className="text-4xl font-black text-slate-900">${yearlyTotal}</span>
//                         <span className="text-slate-500 text-sm font-medium"> /yr</span>
//                         <p className="text-[10px] text-green-600 font-bold uppercase mt-1">
//                           Just ${discountedMonthly} / month
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <ul className="space-y-3">
//                     {plan.features.map((f, i) => (
//                       <li key={i} className="flex items-start gap-2 text-[11px] font-semibold text-slate-600">
//                         <Check className="h-4 w-4 text-green-500 shrink-0" /> {f}
//                       </li>
//                     ))}
//                   </ul>
//                 </CardContent>

//                 <CardFooter>
//                   <Button 
//                     onClick={() => router.push(`/onboarding?plan=${plan.id}&billing=${billingCycle}`)} 
//                     className={cn("w-full font-bold", plan.highlight ? "bg-amber-600 hover:bg-amber-700" : "bg-slate-900 hover:bg-slate-800")}
//                   >
//                     Get Started
//                   </Button>
//                 </CardFooter>
//               </Card>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import { Check, Zap, School, Building2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Independent",
    id: "individual",
    price: 19,
    description: "For solo students or homeschoolers.",
    icon: <User className="h-5 w-5 text-emerald-500" />,
    features: ["1 Student Profile", "1 Curriculum Access", "Personal AI Tutor", "Self-Paced Quizzes", "WhatsApp Alerts"],
    highlight: false,
  },
  {
    name: "Starter",
    id: "starter",
    price: 49,
    description: "For small learning centers.",
    icon: <Zap className="h-5 w-5 text-blue-500" />,
    features: ["Up to 50 Students", "Single Curriculum", "AI Lesson Generation", "Basic Assessments", "Teacher Dashboard"],
    highlight: false,
  },
  {
    name: "Professional",
    id: "pro",
    price: 199,
    description: "For established schools.",
    icon: <School className="h-5 w-5 text-amber-500" />,
    features: ["Up to 500 Students", "Multi-Curriculum Support", "AI Video Scripts", "Full CRM & Sales", "Advanced Analytics"],
    highlight: true,
  },
  {
    name: "Enterprise",
    id: "enterprise",
    price: 599,
    description: "For large school groups.",
    icon: <Building2 className="h-5 w-5 text-purple-500" />,
    features: ["Unlimited Students", "Custom Mapping", "White-labeling", "Priority AI Tokens", "API Access"],
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

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">

        <h1 className="text-lg md:text-4xl font-black text-slate-900 mb-4 leading-tight">
          Flexible plans for <span className="text-amber-600">modern education.</span>
        </h1>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12 mt-8">
          <span className={cn("text-sm font-bold", billingCycle === "monthly" ? "text-slate-900" : "text-slate-400")}>Monthly</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
            className="w-12 h-6 bg-slate-200 rounded-full relative focus:outline-none ring-2 ring-amber-500 ring-offset-2"
          >
            <div className={cn("absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200", billingCycle === "annually" ? "translate-x-6 bg-amber-600" : "")} />
          </button>
          <span className={cn("text-sm font-bold", billingCycle === "annually" ? "text-slate-900" : "text-slate-400")}>
            Annually <span className="text-green-600 text-[10px] bg-green-100 px-2 py-0.5 rounded-full ml-1 font-black uppercase">-20%</span>
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Flexible plans for <span className="text-amber-600">modern education.</span>
          </h1>
          
          <div className="flex items-center justify-center gap-6 mb-16 mt-10">
            <span className={cn("text-base font-bold transition-colors", billingCycle === "monthly" ? "text-slate-900" : "text-slate-400")}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
              className="w-16 h-8 bg-slate-200 rounded-full relative focus:outline-none ring-2 ring-amber-500/20 ring-offset-4"
            >
              <motion.div 
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: billingCycle === "annually" ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{ backgroundColor: billingCycle === "annually" ? "#d97706" : "white" }}
              />
            </button>
            <span className={cn("text-base font-bold transition-colors", billingCycle === "annually" ? "text-slate-900" : "text-slate-400")}>
              Annually <span className="text-green-600 text-xs bg-green-100 px-3 py-1 rounded-full ml-2 font-black uppercase tracking-tighter">-20% OFF</span>
            </span>
          </div>
        </motion.div>


        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {plans.map((plan) => {
            const monthlyPrice = plan.price;
            const discountedMonthly = Math.floor(monthlyPrice * 0.8);
            const yearlyTotal = discountedMonthly * 12;

            return (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05, 
                  y: -12,
                  zIndex: 50,
                  transition: { type: "spring", stiffness: 300, damping: 20 } 
                }}
                className="relative"
              >
                <Card className={cn(
                  "flex flex-col h-full border-2 transition-all duration-500 rounded-3xl overflow-hidden", 
                  plan.highlight 
                    ? "border-amber-500 shadow-[0_20px_50px_rgba(217,119,6,0.15)] bg-white" 
                    : "border-slate-200 bg-white/70 backdrop-blur-sm"
                )}>
                  <CardHeader className="text-left pt-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-slate-100 rounded-xl">{plan.icon}</div>
                      <CardTitle className="text-xl font-bold tracking-tight">{plan.name}</CardTitle>
                    </div>
                    <CardDescription className="text-sm leading-relaxed min-h-[40px]">{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="grow text-left">
                    <div className="mb-8 h-20 flex flex-col justify-end">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={billingCycle}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {billingCycle === "monthly" ? (
                            <div>
                              <span className="text-5xl font-black text-slate-900 tracking-tighter">${monthlyPrice}</span>
                              <span className="text-slate-400 text-lg font-medium">/mo</span>
                            </div>
                          ) : (
                            <div>
                              <span className="text-5xl font-black text-slate-900 tracking-tighter">${yearlyTotal}</span>
                              <span className="text-slate-400 text-lg font-medium">/yr</span>
                              <p className="text-xs text-green-600 font-black uppercase mt-2 bg-green-50 w-fit px-2 py-1 rounded">
                                Save ${(monthlyPrice * 12) - yearlyTotal} Yearly
                              </p>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <ul className="space-y-4 mb-4">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm font-semibold text-slate-600">
                          <Check className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /> {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pb-8">
                    <Button 
                      onClick={() => router.push(`/onboarding?plan=${plan.id}&billing=${billingCycle}`)} 
                      className={cn(
                        "w-full h-14 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all", 
                        plan.highlight 
                          ? "bg-amber-600 hover:bg-amber-700 text-white" 
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      )}
                    >
                      Select Plan
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