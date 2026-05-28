// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { GraduationCap, Menu, X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link";

// const navLinks = [
//   { label: "Features", href: "#features" },
//   { label: "Curriculums", href: "#curriculums" },
//   { label: "Pricing", href: "/pricing" },
// ];

// export function Navbar() {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   return (
//     <motion.nav
//       className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md"
//       initial={{ y: -20, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
//     >
//       <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
//         <a href="#" className="flex items-center gap-2">
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
//             <GraduationCap className="h-5 w-5 text-primary-foreground" />
//           </div>
//           <span className="text-lg font-bold text-foreground">
//             SchoolPlatform
//           </span>
//         </a>

//         {/* Desktop Nav */}
//         <div className="hidden items-center gap-8 md:flex">
//           {navLinks.map((link) => (
//             <a
//               key={link.href}
//               href={link.href}
//               className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
//             >
//               {link.label}
//             </a>
//           ))}
//         </div>

//         <div className="hidden items-center gap-3 md:flex">
//           <Button variant="outline" size="sm" className="bg-transparent ">
//              Login
//           </Button>
//           <Button size="sm">Get Started</Button>
//         </div>

//         {/* Mobile Toggle */}
//         <button
//           type="button"
//           className="md:hidden"
//           onClick={() => setMobileOpen(!mobileOpen)}
//           aria-label={mobileOpen ? "Close menu" : "Open menu"}
//         >
//           {mobileOpen ? (
//             <X className="h-6 w-6 text-foreground" />
//           ) : (
//             <Menu className="h-6 w-6 text-foreground" />
//           )}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div
//             className="border-t border-border bg-card px-6 pb-6 pt-4 md:hidden"
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.3, ease: "easeInOut" }}
//           >
//             <div className="flex flex-col gap-4">
//               {navLinks.map((link) => (
//                 <a
//                   key={link.href}
//                   href={link.href}
//                   className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
//                   onClick={() => setMobileOpen(false)}
//                 >
//                   {link.label}
//                 </a>
//               ))}
//               <div className="flex flex-col gap-2 pt-2">
//                <Link href="/login"> <Button variant="outline" size="sm" className="bg-transparent">
//                    Login
//                 </Button>
//                 </Link>

//                 <Link href="/onboarding">
//                 <Button size="sm">Get Started</Button>
//                 </Link>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.nav>
//   );
// }




// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { GraduationCap, Menu, X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link";

// const navLinks = [
//   { label: "Features", href: "#features" },
//   { label: "Curriculums", href: "#curriculums" },
//   { label: "Pricing", href: "/pricing" },
// ];

// export function Navbar() {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   return (
//     <motion.nav
//       className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md"
//       initial={{ y: -20, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
//     >
//       <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
//         {/* Logo */}
//         <Link href="/" className="flex items-center gap-2">
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
//             <GraduationCap className="h-5 w-5 text-primary-foreground" />
//           </div>
//           <span className="text-lg font-bold text-foreground">
//             SchoolPlatform
//           </span>
//         </Link>

//         {/* Desktop Nav */}
//         <div className="hidden items-center gap-8 md:flex">
//           {navLinks.map((link) => (
//             <a
//               key={link.href}
//               href={link.href}
//               className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
//             >
//               {link.label}
//             </a>
//           ))}
//         </div>

//         {/* Desktop Actions */}
//         <div className="hidden items-center gap-3 md:flex">
//           <Link href="/login">
//             <Button variant="outline" size="sm" className="bg-transparent">
//               Login
//             </Button>
//           </Link>
//           <Link href="/onboarding">
//             <Button size="sm">Get Started</Button>
//           </Link>
//         </div>

//         {/* Mobile Toggle */}
//         <button
//           type="button"
//           className="md:hidden"
//           onClick={() => setMobileOpen(!mobileOpen)}
//           aria-label={mobileOpen ? "Close menu" : "Open menu"}
//         >
//           {mobileOpen ? (
//             <X className="h-6 w-6 text-foreground" />
//           ) : (
//             <Menu className="h-6 w-6 text-foreground" />
//           )}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div
//             className="border-t border-border bg-card px-6 pb-6 pt-4 md:hidden"
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.3, ease: "easeInOut" }}
//           >
//             <div className="flex flex-col gap-4">
//               {navLinks.map((link) => (
//                 <a
//                   key={link.href}
//                   href={link.href}
//                   className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
//                   onClick={() => setMobileOpen(false)}
//                 >
//                   {link.label}
//                 </a>
//               ))}
//               <div className="flex flex-col gap-2 pt-2">
//                 <Link href="/login" onClick={() => setMobileOpen(false)}>
//                   <Button variant="outline" size="sm" className="w-full bg-transparent">
//                     Login
//                   </Button>
//                 </Link>

//                 <Link href="/onboarding" onClick={() => setMobileOpen(false)}>
//                   <Button size="sm" className="w-full">
//                     Get Started
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.nav>
//   );
// }



// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { GraduationCap, Menu, X, ShieldCheck, Zap } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link";
// import { ThemeToggle } from "../themeToggle";

// // ── Configuration ───────────────────────────────────────────────────────────

// const navLinks = [
//   { label: "Features", href: "#features" },
//   { label: "Curriculums", href: "#curriculums" },
//   { label: "Pricing", href: "/pricing" },
// ];

// /**
//  * PUBLIC NAVIGATION (Tier 0)
//  * Rule 11: Enforces the "Registry" aesthetic with black/italic/uppercase typography.
//  * Rule 17: Self-contained state management for mobile interactivity.
//  */
// export function Navbar() {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   return (
//     <motion.nav
//       className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md"
//       initial={{ y: -20, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
//     >
//       <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
//         {/* ── LOGO IDENTITY ── */}
//         <Link href="/" className="flex items-center gap-3 group">
//           <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-school-primary shadow-lg shadow-school-primary/20 transition-transform group-hover:scale-110">
//             <GraduationCap className="h-6 w-6 text-slate-950" strokeWidth={2.5} />
//           </div>
//           <span className="text-2xl font-black text-white uppercase italic tracking-tighter">
//             SchoolPaaS
//           </span>
//         </Link>

//         {/* ── DESKTOP NAVIGATION ── */}
//         <div className="hidden items-center gap-10 md:flex">
//           {navLinks.map((link) => (
//             <a
//               key={link.href}
//               href={link.href}
//               className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-colors hover:text-school-primary"
//             >
//               {link.label}
//             </a>
//           ))}
//         </div>

//         {/* ── DESKTOP ACTIONS ── */}
//         <div className="hidden items-center gap-4 md:flex">
//           <Link href="/login">
//             <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-xl px-6">
//               Initialize Access
//             </Button>
//           </Link>
//           <Link href="/onboarding">
//             <Button 
//                 size="sm" 
//                 className="bg-school-primary text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-xl px-6 hover:scale-105 transition-all shadow-xl shadow-school-primary/10"
//             >
//               Provision Hub
//             </Button>
//           </Link>
//           <ThemeToggle />
//         </div>

//         {/* ── MOBILE TOGGLE ── */}
//         <button
//           type="button"
//           className="md:hidden p-2 rounded-xl bg-slate-900 border border-white/5"
//           onClick={() => setMobileOpen(!mobileOpen)}
//           aria-label={mobileOpen ? "Close registry menu" : "Open registry menu"}
//         >
//           {mobileOpen ? (
//             <X className="h-5 w-5 text-school-primary" />
//           ) : (
//             <Menu className="h-5 w-5 text-school-primary" />
//           )}
//         </button>
//       </div>

//       {/* ── MOBILE MENU ── */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div
//             className="border-t border-white/5 bg-slate-950 px-6 pb-10 pt-6 md:hidden shadow-2xl"
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.3, ease: "easeInOut" }}
//           >
//             <div className="flex flex-col gap-6">
//               {navLinks.map((link) => (
//                 <a
//                   key={link.href}
//                   href={link.href}
//                   className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 hover:text-school-primary transition-colors"
//                   onClick={() => setMobileOpen(false)}
//                 >
//                   {link.label}
//                 </a>
//               ))}
              
//               <div className="h-px bg-white/5 w-full my-2" />
              
//               <div className="flex flex-col gap-3">
//                 <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full">
//                   <Button variant="outline" className="w-full bg-slate-900 border-white/10 text-white font-black uppercase text-[10px] tracking-widest py-6 rounded-2xl">
//                     <Zap className="mr-2 h-4 w-4 text-school-primary" />
//                     Initialize Access
//                   </Button>
//                 </Link>

//                 <Link href="/onboarding" onClick={() => setMobileOpen(false)} className="w-full">
//                   <Button className="w-full bg-school-primary text-slate-950 font-black uppercase text-[10px] tracking-widest py-6 rounded-2xl">
//                     <ShieldCheck className="mr-2 h-4 w-4" />
//                     Provision Hub
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.nav>
//   );
// }


"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, ShieldCheck, Zap, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "../themeToggle";
import { cn } from "@/lib/utils";

// ── Configuration ───────────────────────────────────────────────────────────

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Curriculums", href: "#curriculums" },
  { label: "Pricing", href: "/pricing" },
];

/**
 * PUBLIC NAVIGATION (Tier 0)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-surface, border-border).
 * Rule 19: Standardized Geometry (rounded-2xl).
 * Rule 20: Compulsory Responsiveness with fluid padding.
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8 py-4">
        
        {/* ── LOGO IDENTITY (Rule 11/19) ── */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-school-primary shadow-lg shadow-school-primary-200 transition-transform group-hover:scale-105">
            <GraduationCap className="h-6 w-6 text-on-school-primary" strokeWidth={2.5} />
          </div>
          <span className="text-xl md:text-2xl font-extrabold text-foreground uppercase italic tracking-tighter">
            SchoolPaaS
          </span>
        </Link>

        {/* ── DESKTOP NAVIGATION (Rule 11) ── */}
        <div className="hidden items-center gap-8 lg:gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground transition-all hover:text-school-primary"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ── DESKTOP ACTIONS (Rule 19/21) ── */}
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/login">
            <Button 
              variant="ghost" 
              className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-surface rounded-xl px-5"
            >
              LogIn
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button 
                className="bg-school-primary text-on-school-primary font-extrabold text-[10px] uppercase tracking-widest rounded-xl px-6 hover:brightness-110 transition-all shadow-lg shadow-school-primary-200"
            >
              Start Here
            </Button>
          </Link>
          <div className="h-4 w-px bg-border mx-2" />
          <ThemeToggle />
        </div>

        {/* ── MOBILE TOGGLE (Rule 18/21) ── */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="p-2.5 rounded-xl bg-surface border border-border text-school-primary shadow-sm"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU (Rule 18/20) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 border-b border-border bg-background px-6 pb-12 pt-6 md:hidden shadow-2xl overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex flex-col gap-8">
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-school-primary transition-colors group"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                ))}
              </nav>
              
              <div className="h-px bg-border w-full" />
              
              <div className="flex flex-col gap-4">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full bg-surface border-border text-foreground font-bold uppercase text-[10px] tracking-widest py-6 rounded-2xl"
                  >
                    <Zap className="mr-2 h-4 w-4 text-school-primary" />
                LogIn
                  </Button>
                </Link>

                <Link href="/onboarding" onClick={() => setMobileOpen(false)} className="w-full">
                  <Button className="w-full bg-school-primary text-on-school-primary font-extrabold uppercase text-[10px] tracking-widest py-6 rounded-2xl shadow-lg shadow-school-primary-200">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Start Here
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}