import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Pillars } from "@/components/landing/pillars";
import { Curriculums } from "@/components/landing/curriculum";
import { Features } from "@/components/landing/features";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Pillars />
      <Curriculums />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
