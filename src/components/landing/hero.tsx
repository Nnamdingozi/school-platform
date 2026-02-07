"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUpZoom = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8, rotateX: -10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotateX: 0,
    transition: { duration: 0.8, ease: "backOut" } 
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-card pt-12 pb-16 lg:pt-24 lg:pb-24">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(217_91%_60%/0.08),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(199_89%_48%/0.06),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          
          {/* LEFT COLUMN: TEXT CONTENT */}
          <motion.div
            className="text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeUpZoom}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/50 bg-amber-50/50 px-4 py-1.5 text-sm font-medium text-amber-700 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 animate-pulse text-amber-500" />
              AI-Powered Education Platform
            </motion.div>

            <motion.h1
              variants={fadeUpZoom}
              className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              The Future of Education,{" "}
              <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
                Powered by AI.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpZoom}
              className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground lg:mx-0"
            >
              One platform for Schools, Teachers, and Independent Learners.
              Generate lessons, track mastery, and bridge the parent-teacher gap
              with automated WhatsApp feedback.
            </motion.p>

            <motion.div
              variants={fadeUpZoom}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <Button 
                size="lg" 
                className="group gap-2 bg-amber-500 px-8 text-base font-semibold text-white hover:bg-amber-600 transition-all duration-300 shadow-lg shadow-amber-500/20"
              >
                Register Your School
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-amber-200 bg-transparent px-8 text-base hover:bg-amber-50 hover:text-amber-600 transition-colors"
              >
                Join as a Student
              </Button>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: 3D DASHBOARD MOCKUP */}
          <motion.div
            className="relative"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            style={{ perspective: 1200 }}
          >
            {/* Glow effect behind the image */}
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] bg-gradient-to-br from-amber-500/20 to-primary/10 blur-3xl" />

            {/* 3D Tilted Card */}
            <motion.div
              className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/40 p-2 shadow-2xl backdrop-blur-xl"
              whileHover={{
                rotateY: 8,
                rotateX: -4,
                scale: 1.02,
                transition: { duration: 0.4, ease: "easeOut" },
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <img
                src="/hero-dashboard.jpg"
                alt="AI Dashboard Mockup"
                className="relative z-10 h-auto w-full rounded-xl shadow-inner"
              />
              
              {/* Floating Badge 1 */}
              <motion.div
                className="absolute -left-6 bottom-12 z-20 hidden rounded-xl border border-white/30 bg-white/80 px-4 py-3 shadow-xl backdrop-blur-md lg:flex"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-800">AI Lesson Generated</span>
                </div>
              </motion.div>

              {/* Floating Badge 2 */}
              <motion.div
                className="absolute -right-6 top-12 z-20 hidden rounded-xl border border-white/30 bg-white/80 px-4 py-3 shadow-xl backdrop-blur-md lg:flex"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold text-slate-800">98% Mastery Rate</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}