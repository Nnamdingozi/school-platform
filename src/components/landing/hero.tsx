"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.12,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88, rotateY: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: { duration: 1, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-card pt-24 pb-16 lg:pt-32 lg:pb-24">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(217_91%_60%/0.08),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(199_89%_48%/0.06),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left column: Text */}
          <motion.div
            className="text-center lg:text-left"
            initial="hidden"
            animate="visible"
          >
            <motion.div
              custom={0}
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm font-medium text-muted-foreground"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              AI-Powered Education Platform
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              The Future of Education,{" "}
              <span className="bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(199,89%,48%)] bg-clip-text text-transparent">
                Powered by AI.
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground lg:mx-0"
            >
              One platform for Schools, Teachers, and Independent Learners.
              Generate lessons, track mastery, and bridge the parent-teacher gap
              with automated WhatsApp feedback.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <Button size="lg" className="gap-2 px-8 text-base">
                Register Your School
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 bg-transparent px-8 text-base"
              >
                Join as a Student
              </Button>
            </motion.div>
          </motion.div>

          {/* Right column: Dashboard mockup with 3D glassmorphism */}
          <motion.div
            className="relative"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            style={{ perspective: 1200 }}
          >
            {/* Glow behind the card */}
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] bg-gradient-to-br from-[hsl(217,91%,60%/0.2)] to-[hsl(199,89%,48%/0.15)] blur-3xl" />

            {/* Glass card wrapper with 3D tilt */}
            <motion.div
              className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 p-2 shadow-[0_8px_60px_-12px_hsl(217_91%_60%/0.3)] backdrop-blur-xl"
              whileHover={{
                rotateY: 4,
                rotateX: -2,
                scale: 1.02,
                transition: { duration: 0.4, ease: "easeOut" },
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Inner glass reflection */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-transparent" />

              {/* Dashboard image */}
              <img
                src="/hero-dashboard.jpg"
                alt="SchoolPlatform AI Dashboard showing student progress charts and lesson generation tools"
                className="relative z-10 h-auto w-full rounded-xl"
              />

              {/* Bottom glass shine */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 rounded-b-2xl bg-gradient-to-t from-white/30 to-transparent" />
            </motion.div>

            {/* Floating badges */}
            <motion.div
              className="absolute -left-3 bottom-12 z-20 rounded-xl border border-white/30 bg-white/70 px-4 py-3 shadow-lg backdrop-blur-md lg:-left-6"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-foreground">
                  AI Lesson Generated
                </span>
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-3 top-12 z-20 rounded-xl border border-white/30 bg-white/70 px-4 py-3 shadow-lg backdrop-blur-md lg:-right-6"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="text-xs font-medium text-foreground">
                  98% Mastery Rate
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
