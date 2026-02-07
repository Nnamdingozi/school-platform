"use client";

import {
  School,
  BookOpen,
  Users,
  ShieldCheck,
  BarChart3,
  Video,
  ClipboardCheck,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1, // Staggers the cards
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

const pillars = [
  {
    icon: School,
    title: "For Schools",
    description:
      "Centralized management with role-based access control and school-wide B2B reporting dashboards.",
    features: [
      { icon: ShieldCheck, text: "Role-Based Access Control" },
      { icon: BarChart3, text: "School-Wide Analytics" },
    ],
    color: "bg-primary/10 text-primary",
  },
  {
    icon: BookOpen,
    title: "For Teachers",
    description:
      "AI-generated lesson plans, video scripts, and automated assessment grading in seconds.",
    features: [
      { icon: Video, text: "AI Lesson Plans & Videos" },
      { icon: ClipboardCheck, text: "Automated Grading" },
    ],
    color: "bg-[hsl(199,89%,48%)]/10 text-[hsl(199,89%,48%)]",
  },
  {
    icon: Users,
    title: "For Parents",
    description:
      "Real-time feedback delivered via WhatsApp and detailed student growth charts.",
    features: [
      { icon: MessageSquare, text: "WhatsApp Feedback" },
      { icon: TrendingUp, text: "Student Growth Charts" },
    ],
    color: "bg-foreground/10 text-foreground",
  },
];

// const cardVariants = {
//   hidden: { opacity: 0, y: 32 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.5, delay: i * 0.15, ease: [0.25, 0.4, 0.25, 1] },
//   }),
// };

export function Pillars() {
  return (
    <section className="bg-background py-24 lg:py-32">
  <div className="mx-auto max-w-7xl px-6">
    {/* Header Section */}
    <motion.div
      className="mx-auto mb-20 max-w-2xl text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
        Built for Everyone
      </p>
      <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        Three Pillars,{" "}
        <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
          One Platform
        </span>
      </h2>
      <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
        Whether you run a school, teach a class, or support your child at
        home, SchoolPlatform has you covered.
      </p>
    </motion.div>

    {/* Grid of Pillar Cards */}
    <div className="grid gap-8 md:grid-cols-3">
      {pillars.map((pillar, i) => (
        <motion.div
          key={pillar.title}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          whileHover={{ 
            y: -10, 
            scale: 1.02,
            transition: { duration: 0.3 } 
          }}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10"
        >
          {/* Subtle background glow on hover */}
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl transition-opacity group-hover:opacity-100" />

          {/* Icon Container */}
          <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-200/50 transition-colors group-hover:bg-amber-500 group-hover:text-white">
            <pillar.icon className="h-7 w-7" />
          </div>

          <h3 className="mb-4 text-2xl font-bold text-foreground">
            {pillar.title}
          </h3>
          
          <p className="mb-8 leading-relaxed text-muted-foreground">
            {pillar.description}
          </p>

          {/* Feature List */}
          <div className="flex flex-col gap-4">
            {pillar.features.map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-3 text-sm font-medium text-foreground/80"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600 group-hover:bg-amber-500/10">
                   <feature.icon className="h-3 w-3" />
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
