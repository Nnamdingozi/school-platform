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