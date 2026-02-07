"use client";

import { Globe, BookMarked, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const curriculums = [
  {
    icon: Globe,
    name: "British National",
    description: "Key Stages 1-4, GCSEs & A-Levels",
  },
  {
    icon: BookMarked,
    name: "American K-12",
    description: "Common Core & State Standards",
  },
  {
    icon: GraduationCap,
    name: "Nigerian National",
    description: "JSS & SSS Curriculum (WAEC/NECO)",
  },
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

export function Curriculums() {
  return (
    <section id="curriculums" className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Curriculum Support
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Works with the Curriculums{" "}
            <span className="bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(199,89%,48%)] bg-clip-text text-transparent">
              You Follow
            </span>
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            AI-generated content aligned to major international curriculums, so
            every lesson meets the standard.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {curriculums.map((item, i) => (
            <motion.div
              key={item.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="flex flex-col items-center rounded-2xl border border-border bg-background p-10 text-center transition-shadow hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {item.name}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
