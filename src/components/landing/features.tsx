"use client";

import { Sparkles, BarChart3, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    title: "AI Content Engine",
    description:
      "Generate curriculum-aligned videos, quizzes, and lesson plans in seconds. Let AI handle the heavy lifting while teachers focus on teaching.",
    highlights: [
      "Video generation from text prompts",
      "Auto-generated quizzes & assessments",
      "Curriculum-aligned lesson plans",
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
      "Knowledge gap identification",
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
      "Zero extra teacher workload",
    ],
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

export function Features() {
  return (
    <section id="features" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            AI-Powered Features
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Intelligence Built Into{" "}
            <span className="bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(199,89%,48%)] bg-clip-text text-transparent">
              Every Workflow
            </span>
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            From content creation to parent communication, AI automates the
            repetitive so you can focus on impact.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group rounded-2xl border border-border bg-card p-8 transition-shadow hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
              <ul className="flex flex-col gap-3">
                {feature.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
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
