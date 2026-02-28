import { Hero } from "@/components/landing/hero";
import { Pillars } from "@/components/landing/pillars";
import { Curriculums } from "@/components/landing/curriculum";
import { Features } from "@/components/landing/features";
import { CTA } from "@/components/landing/cta";


export default function Page() {
  return (
    <main>
     
      <Hero />
      <Pillars />
      <Curriculums />
      <Features />
      <CTA />
      
    </main>
  );
}
