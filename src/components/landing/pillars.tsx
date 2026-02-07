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

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

export function Pillars() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Built for Everyone
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Three Pillars,{" "}
            <span className="bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(199,89%,48%)] bg-clip-text text-transparent">
              One Platform
            </span>
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Whether you run a school, teach a class, or support your child at
            home, SchoolPlatform has you covered.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group rounded-2xl border border-border bg-card p-8 transition-shadow hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div
                className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl ${pillar.color}`}
              >
                <pillar.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                {pillar.title}
              </h3>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
              <div className="flex flex-col gap-3">
                {pillar.features.map((feature) => (
                  <div
                    key={feature.text}
                    className="flex items-center gap-3 text-sm text-foreground"
                  >
                    <feature.icon className="h-4 w-4 text-primary" />
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
