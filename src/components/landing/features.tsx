"use client";

import { Sparkles, BarChart3, MessageSquare, Check } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    title: "AI Content Engine",
    description:
      "Generate curriculum-aligned videos, quizzes, and lesson plans in seconds. Let AI handle the heavy lifting while teachers focus on teaching.",
    highlights: [
      "Video generation from prompts",
      "Auto-generated assessments",
      "Aligned lesson plans",
    ],
  },
  {
    icon: BarChart3,
    title: "Smart Assessments",
    description:
      "Track topic mastery with interactive charts and detailed analytics. Identify knowledge gaps before they become problems.",
    highlights: [
      "Real-time mastery tracking",
      "Interactive progress charts",
      "Gap identification",
    ],
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Bridge",
    description:
      "Automated feedback sent directly to parents' phones via WhatsApp. Keep families engaged without extra teacher workload.",
    highlights: [
      "Automated progress reports",
      "Direct parent notifications",
      "Zero extra workload",
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.5, 
      delay: i * 0.15, 
      ease: [0.25, 0.4, 0.25, 1] 
    },
  }),
};

export function Features() {
  return (
    <section id="features" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header Section */}
        <motion.div
          className="mx-auto mb-20 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
            AI-Powered Features
          </p>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Intelligence Built Into{" "}
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              Every Workflow
            </span>
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            From content creation to parent communication, AI automates the
            repetitive so you can focus on making a real impact.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ 
                y: -10, 
                transition: { duration: 0.3 } 
              }}
              className="group relative flex flex-col rounded-3xl border border-amber-100 bg-card p-10 transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_20px_50px_rgba(245,158,11,0.12)]"
            >
              {/* Icon - Maintained original h-12 w-12 size */}
              <div className="mb-8 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-200 transition-all duration-300 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-amber-500/30">
                <feature.icon className="h-6 w-6" />
              </div>

              <h3 className="mb-4 text-2xl font-bold text-foreground">
                {feature.title}
              </h3>
              
              <p className="mb-8 text-base leading-relaxed text-muted-foreground">
                {feature.description}
              </p>

              {/* Highlights List */}
              <ul className="mt-auto flex flex-col gap-4 border-t border-amber-100 pt-8 group-hover:border-amber-500/10">
                {feature.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-center gap-3 text-sm font-medium text-foreground/90"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Check className="h-3 w-3" />
                    </div>
                    {highlight}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}