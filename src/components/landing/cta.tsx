"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section id="pricing" className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-foreground px-8 py-16 text-center md:px-16 lg:py-24"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {/* Subtle glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(217_91%_60%/0.15),transparent_70%)]" />

          <div className="relative">
            <motion.h2
              className="text-balance text-3xl font-bold tracking-tight text-background md:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Ready to{" "}
              <span className="bg-linear-to-r from-[hsl(217,91%,60%)] to-[hsl(199,89%,48%)] bg-clip-text text-transparent">
                Transform
              </span>{" "}
              Your School?
            </motion.h2>
            <motion.p
              className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-background/70"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Join thousands of educators already using SchoolPlatform to
              deliver better learning outcomes with the power of AI.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                size="lg"
                className="gap-2 bg-primary px-8 text-base text-primary-foreground hover:bg-primary/90"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-background/20 bg-transparent px-8 text-base text-background hover:bg-background/10"
              >
                Book a Demo
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
