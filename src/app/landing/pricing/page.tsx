// "use client";

// import React, { useState } from "react";
// import { Check, ArrowRight, Zap, Shield, Globe, Sparkles } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// const plans = [
//   {
//     name: "Starter",
//     id: "starter",
//     price: 49,
//     description: "Perfect for small learning centers and individual tutors.",
//     features: [
//       "Up to 50 Students",
//       "Single Curriculum Support",
//       "Basic AI Lesson Generation",
//       "Standard Assessments",
//       "WhatsApp Feedback Notifications",
//     ],
//     highlight: false,
//     color: "from-blue-500 to-cyan-500",
//   },
//   {
//     name: "Professional",
//     id: "pro",
//     price: 199,
//     description: "Ideal for established schools needing multi-curriculum depth.",
//     features: [
//       "Up to 500 Students",
//       "Multi-Curriculum Support",
//       "Advanced AI Lesson & Video Scripts",
//       "Full Sales Pipeline & CRM",
//       "Automated Gradebook & Analytics",
//       "Priority Support",
//     ],
//     highlight: true,
//     color: "from-amber-500 to-orange-600",
//   },
//   {
//     name: "Enterprise",
//     id: "enterprise",
//     price: 599,
//     description: "For school groups and large institutions with custom needs.",
//     features: [
//       "Unlimited Students",
//       "Custom Curriculum Mapping",
//       "White-label Branding",
//       "Dedicated AI Token Allowance",
//       "API Access for SIS Integration",
//       "24/7 Dedicated Account Manager",
//     ],
//     highlight: false,
//     color: "from-purple-600 to-indigo-600",
//   },
// ];

// export default function PricingPage() {
//   const router = useRouter();
//   const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

//   const handleSelection = (planId: string) => {
//     // Redirect to onboarding with plan and cycle metadata
//     router.push(`/onboarding?plan=${planId}&billing=${billingCycle}`);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 py-20 px-4">
//       <div className="max-w-7xl mx-auto text-center mb-16">
//         <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-4">
//           Empower Your School with <span className="text-amber-600">AI Logic</span>
//         </h1>
//         <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
//           Choose a plan that fits your curriculum needs. All plans include our core PaaS infrastructure.
//         </p>

//         {/* Billing Toggle */}
//         <div className="flex items-center justify-center gap-4 mb-12">
//           <span className={cn("text-sm font-bold", billingCycle === "monthly" ? "text-slate-900" : "text-slate-400")}>Monthly</span>
//           <button 
//             onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
//             className="w-14 h-7 bg-slate-200 rounded-full relative transition-colors duration-200 focus:outline-none ring-2 ring-amber-500 ring-offset-2"
//           >
//             <div className={cn(
//               "absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm",
//               billingCycle === "annually" ? "translate-x-7 bg-amber-600" : ""
//             )} />
//           </button>
//           <span className={cn("text-sm font-bold", billingCycle === "annually" ? "text-slate-900" : "text-slate-400")}>
//             Annually <span className="text-green-600 text-xs bg-green-100 px-2 py-0.5 rounded-full ml-1">Save 20%</span>
//           </span>
//         </div>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {plans.map((plan) => (
//             <Card 
//               key={plan.id}
//               className={cn(
//                 "relative flex flex-col transition-all duration-300 hover:shadow-2xl border-2",
//                 plan.highlight ? "border-amber-500 scale-105 z-10 shadow-xl" : "border-transparent"
//               )}
//             >
//               {plan.highlight && (
//                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
//                   Most Popular
//                 </div>
//               )}
              
//               <CardHeader>
//                 <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
//                 <CardDescription>{plan.description}</CardDescription>
//               </CardHeader>

//               <CardContent className="grow">
//                 <div className="mb-6">
//                   <span className="text-5xl font-black text-slate-900">
//                     ${billingCycle === "annually" ? Math.floor(plan.price * 0.8) : plan.price}
//                   </span>
//                   <span className="text-slate-500 font-medium">/month</span>
//                 </div>

//                 <ul className="space-y-4 text-left">
//                   {plan.features.map((feature, i) => (
//                     <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
//                       <Check className="h-5 w-5 text-green-500 shrink-0" />
//                       {feature}
//                     </li>
//                   ))}
//                 </ul>
//               </CardContent>

//               <CardFooter>
//                 <Button 
//                   onClick={() => handleSelection(plan.id)}
//                   className={cn(
//                     "w-full h-12 text-lg font-bold transition-all",
//                     plan.highlight 
//                       ? "bg-amber-600 hover:bg-amber-700 text-white" 
//                       : "bg-slate-900 hover:bg-slate-800 text-white"
//                   )}
//                 >
//                   Get Started <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* Trust Section */}
//       <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
//          <div className="flex flex-col items-center"><Zap className="mb-2" /> <span>AI Powered</span></div>
//          <div className="flex flex-col items-center"><Shield className="mb-2" /> <span>Secure Data</span></div>
//          <div className="flex flex-col items-center"><Globe className="mb-2" /> <span>Multi-Curriculum</span></div>
//          <div className="flex flex-col items-center"><Sparkles className="mb-2" /> <span>SupaBase Integration</span></div>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useState } from "react";
import { Check, Zap, School, Building2, User } from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 leading-tight">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            // Price Logic
            const monthlyPrice = plan.price;
            const discountedMonthly = Math.floor(monthlyPrice * 0.8);
            const yearlyTotal = discountedMonthly * 12;

            return (
              <Card key={plan.id} className={cn("flex flex-col border-2 transition-all", plan.highlight ? "border-amber-500 shadow-xl lg:scale-105 bg-white" : "border-slate-200 bg-white/50")}>
                <CardHeader className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    {plan.icon} 
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                  </div>
                  <CardDescription className="text-xs h-8">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-grow text-left">
                  <div className="mb-6 h-16">
                    {billingCycle === "monthly" ? (
                      <div>
                        <span className="text-4xl font-black text-slate-900">${monthlyPrice}</span>
                        <span className="text-slate-500 text-sm font-medium"> /mo</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-4xl font-black text-slate-900">${yearlyTotal}</span>
                        <span className="text-slate-500 text-sm font-medium"> /yr</span>
                        <p className="text-[10px] text-green-600 font-bold uppercase mt-1">
                          Just ${discountedMonthly} / month
                        </p>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] font-semibold text-slate-600">
                        <Check className="h-4 w-4 text-green-500 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button 
                    onClick={() => router.push(`/onboarding?plan=${plan.id}&billing=${billingCycle}`)} 
                    className={cn("w-full font-bold", plan.highlight ? "bg-amber-600 hover:bg-amber-700" : "bg-slate-900 hover:bg-slate-800")}
                  >
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}