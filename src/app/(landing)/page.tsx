


// import { Hero } from "@/components/landing/hero";
// import { Pillars } from "@/components/landing/pillars";
// import { Curriculums } from "@/components/landing/curriculum";
// import { Features } from "@/components/landing/features";
// import { CTA } from "@/components/landing/cta";


// export default function Page() {
//   return (
//     <main>
     
//       <Hero />
//       <Pillars />
//       <Curriculums />
//       <Features />
//       <CTA />
      
//     </main>
//   );
// }



// 




import { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { Pillars } from "@/components/landing/pillars";
import { Curriculums } from "@/components/landing/curriculum";
import { Features } from "@/components/landing/features";
import { CTA } from "@/components/landing/cta";

/**
 * Rule 16: Contextual SEO
 */
export const metadata: Metadata = {
  title: "SchoolPaaS | The Multicurricular AI Academic Registry",
  description: 
    "A centralized knowledge engine for modern institutions and independent learners. AI-powered lesson synthesis, institutional CBT registry, and real-time communication.",
  openGraph: {
    title: "SchoolPaaS | AI Academic Registry",
    description: "Institutional infrastructure for the next generation of learning.",
    type: "website",
    url: "https://schoolpaas.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "SchoolPaaS | AI Academic Registry",
    description: "Scale your institutional logic with multicurricular AI synthesis.",
  }
};

/**
 * PUBLIC LANDING PAGE (Tier 0)
 * Rule 12: Server Component by default for maximum performance and SEO.
 *
 * bg-surface → oklch(0.97 0.002 264) in light mode (near-white gray)
 *           → oklch(0.1  0.01  264) in dark mode  (deep dark)
 * Defined in globals.css and registered as --color-surface in @theme.
 */
export default function Page() {
  return (
    <main className="bg-surface min-h-screen selection:bg-school-primary/30">
      <Hero />
      <Pillars />
      <Curriculums />
      <Features />
      <CTA />
    </main>
  );
}
