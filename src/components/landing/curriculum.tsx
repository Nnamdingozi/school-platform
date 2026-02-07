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
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.5, 
      delay: i * 0.12, 
      ease: [0.25, 0.4, 0.25, 1] 
    },
  }),
};

export function Curriculums() {
  return (
    <section id="curriculums" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header Section */}
        <motion.div
          className="mx-auto mb-20 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
            Curriculum Support
          </p>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Works with the Curriculums{" "}
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              You Follow
            </span>
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            AI-generated content aligned to major international curriculums, so
            every lesson meets the highest global standards.
          </p>
        </motion.div>

        {/* Grid Section */}
        <div className="grid gap-8 md:grid-cols-3">
          {curriculums.map((item, i) => (
            <motion.div
              key={item.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ 
                y: -12, 
                transition: { duration: 0.3 } 
              }}
              className="group relative flex flex-col items-center rounded-3xl border border-amber-100 bg-card p-12 text-center transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)]"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-amber-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              {/* Icon Container */}
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-200 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-amber-500/30">
                <item.icon className="h-10 w-10" />
              </div>

              <h3 className="mb-3 text-2xl font-bold text-foreground">
                {item.name}
              </h3>
              
              <p className="text-base leading-relaxed text-muted-foreground">
                {item.description}
              </p>

              {/* Decorative line that appears on hover */}
              <div className="mt-8 h-1 w-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent transition-all duration-500 group-hover:w-24" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}