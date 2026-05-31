// "use client";

// import { useState, CSSProperties } from "react";
// import { Role } from "@prisma/client";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { 
//     Eye, EyeOff, CheckCircle2, 
//     GraduationCap, Zap, ShieldCheck,
//     SearchX
// } from "lucide-react";
// import { useProfileStore } from "@/store/profileStore";
// import { cn } from "@/lib/utils";

// // ── Types ───────────────────────────────────────────────────────────────────

// /**
//  * Rule 15: Strict interface for AI-digitized question nodes.
//  */
// export interface ScannedQuestion {
//     text: string;
//     answer: string;
//     explanation: string;
//     marks?: number;
//     year?: number;
//     examBody?: string;
// }

// interface ScannedRegistryProps {
//     questions: ScannedQuestion[];
//     userRole: Role;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * SCANNED NODE REGISTRY (Visual Layer)
//  * Rule 18: Uses Semantic Tokens (bg-card, bg-background, border-border).
//  * Rule 19: Refined Typography (font-extrabold, font-semibold).
//  * Rule 17: Leverages Zustand for primary institutional branding.
//  * Rule 20: Responsive grid layout.
//  */
// export function ScannedQuestionRegistry({ 
//     questions, 
//     userRole 
// }: ScannedRegistryProps) {
//     const { profile } = useProfileStore();
//     const [revealedIdx, setRevealedIdx] = useState<number | null>(null);
    
//     const primaryColor = profile?.primaryColor || "#f59e0b";
//     const isTeacher = userRole === Role.TEACHER || userRole === Role.SCHOOL_ADMIN || userRole === Role.SUPER_ADMIN;

//     const toggleAnswer = (index: number) => {
//         setRevealedIdx(prev => (prev === index ? null : index));
//     };

//     if (questions.length === 0) {
//         return (
//             <div className="py-24 text-center bg-card/30 rounded-[2rem] border border-dashed border-border animate-in fade-in">
//                 <SearchX className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
//                 <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.3em] italic leading-relaxed">
//                     Registry Empty: No digitized past-paper nodes <br/> 
//                     discovered for this specific topic context.
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-8 animate-in fade-in duration-700">
            
//             {/* ── METRICS STRIP ── */}
//             <div className="flex flex-col md:flex-row justify-between items-center bg-card p-6 rounded-[2rem] border border-border gap-6 shadow-xl">
//                 <div className="flex items-center gap-4">
//                     <div 
//                         className="h-12 w-12 rounded-2xl flex items-center justify-center border shadow-inner transition-transform hover:scale-105"
//                         style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
//                     >
//                         <GraduationCap className="h-6 w-6" style={{ color: primaryColor }} />
//                     </div>
//                     <div>
//                         <h3 className="text-foreground font-extrabold uppercase italic tracking-tighter text-lg">Digitized Assets</h3>
//                         <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest">
//                             {questions.length} Questions Resolved from Archives
//                         </p>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-3 bg-background px-4 py-2 rounded-xl border border-border">
//                     <ShieldCheck className="h-4 w-4 text-emerald-500" />
//                     <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
//                         AI Syllabus Logic Verified
//                     </span>
//                 </div>
//             </div>

//             {/* ── QUESTION GRID ── */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
//                 {questions.map((q, idx) => {
//                     const isRevealed = revealedIdx === idx;

//                     return (
//                         <Card 
//                             key={idx} 
//                             className="bg-card border-border hover:border-school-primary/30 transition-all duration-500 rounded-[2rem] overflow-hidden group shadow-2xl"
//                         >
//                             <CardHeader className="bg-background/50 border-b border-border flex flex-row items-center justify-between p-6 md:p-8">
//                                 <div className="flex items-center gap-4">
//                                     <span 
//                                         className="h-8 w-8 rounded-xl border flex items-center justify-center text-[10px] font-black italic shadow-inner"
//                                         style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}20`, color: primaryColor }}
//                                     >
//                                         #{idx + 1}
//                                     </span>
//                                     <div className="flex flex-col">
//                                         <span className="text-[10px] font-extrabold text-foreground uppercase tracking-widest">
//                                             {q.examBody || "External"} Archive
//                                         </span>
//                                         {q.year && (
//                                             <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">
//                                                 Registry Year: {q.year}
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="p-2 rounded-lg bg-background border border-border">
//                                     <Zap className="h-3.5 w-3.5 text-muted-foreground" />
//                                 </div>
//                             </CardHeader>

//                             <CardContent className="p-8 md:p-10 space-y-8">
//                                 <p className="text-foreground text-lg md:text-xl font-bold leading-relaxed italic tracking-tight uppercase">
//                                     {q.text}
//                                 </p>

//                                 <div className="pt-8 border-t border-border flex flex-col gap-6">
//                                     <button 
//                                         onClick={() => toggleAnswer(idx)}
//                                         className="w-fit text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:brightness-125 flex items-center gap-2"
//                                         style={{ color: primaryColor }}
//                                     >
//                                         {isRevealed ? (
//                                             <><EyeOff className="h-4 w-4" /> Conceal Solution</>
//                                         ) : (
//                                             <><Eye className="h-4 w-4" /> Reveal Logic Node</>
//                                         )}
//                                     </button>

//                                     {isRevealed && (
//                                         <div className="bg-background rounded-[2rem] p-8 border border-border animate-in slide-in-from-top-4 duration-500 shadow-inner space-y-6">
//                                             <div className="space-y-1.5">
//                                                 <div className="flex items-center gap-2">
//                                                     <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
//                                                     <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Correct Registry Response</p>
//                                                 </div>
//                                                 <p className="text-lg font-extrabold text-foreground italic leading-tight">
//                                                     "{q.answer}"
//                                                 </p>
//                                             </div>
                                            
//                                             <div className="space-y-2">
//                                                 <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Pedagogical Rationale</p>
//                                                 <p className="text-sm text-muted-foreground leading-relaxed font-medium uppercase tracking-tight">
//                                                     {q.explanation}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }



// "use client";

// import React, { useState } from "react";
// import { Role } from "@prisma/client";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { 
//     Eye, EyeOff, CheckCircle2, 
//     GraduationCap, Zap, ShieldCheck,
//     SearchX
// } from "lucide-react";
// import { useProfileStore } from "@/store/profileStore";
// import { cn } from "@/lib/utils";

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// /**
//  * Rule 15: Interface for AI-digitized module entries.
//  */
// export interface ScannedQuestion {
//     text: string;
//     answer: string;
//     explanation: string;
//     marks?: number;
//     year?: number;
//     examBody?: string;
// }

// interface ScannedRegistryProps {
//     questions: ScannedQuestion[];
//     userRole: Role;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * SCANNED MODULE LEDGER (Tier 3 Visual Hub)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function ScannedQuestionRegistry({ 
//     questions, 
//     userRole 
// }: ScannedRegistryProps) {
//     const [revealedIdx, setRevealedIdx] = useState<number | null>(null);
    
//     const toggleAnswer = (index: number) => {
//         setRevealedIdx(prev => (prev === index ? null : index));
//     };

//     if (questions.length === 0) {
//         return (
//             /* ── EMPTY HUB STATE (Rule 18/19) ── */
//             <div className="py-24 text-center bg-surface border-2 border-dashed border-border rounded-[2rem] animate-in fade-in duration-500">
//                 <div className="h-16 w-16 bg-card border border-border rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
//                     <SearchX className="h-8 w-8 text-muted-foreground/20" />
//                 </div>
//                 <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest italic leading-relaxed max-w-xs mx-auto">
//                     Registry Empty: No digitized past-paper modules <br/> 
//                     discovered for this specific hub context.
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-8 animate-in fade-in duration-700">
            
//             {/* ── METRICS HUB (Rule 21: Scale Protocol) ── */}
//             <div className="flex flex-col md:flex-row justify-between items-center bg-card p-6 md:p-8 rounded-[2rem] border border-border gap-6 shadow-xl">
//                 <div className="flex items-center gap-5">
//                     {/* Rule 21 mathematical scale token */}
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center shadow-inner transition-transform hover:scale-105">
//                         <GraduationCap className="h-7 w-7 text-school-primary" />
//                     </div>
//                     <div>
//                         <h3 className="text-foreground font-extrabold uppercase italic tracking-tighter text-lg">Digitized Assets</h3>
//                         <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest italic">
//                             {questions.length} Modules Resolved from Archive Hub
//                         </p>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-3 bg-surface px-5 py-2.5 rounded-xl border border-border shadow-sm">
//                     <ShieldCheck className="h-4 w-4 text-emerald-500" />
//                     <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">
//                         AI Syllabus Logic Verified
//                     </span>
//                 </div>
//             </div>

//             {/* ── MODULE GRID (Rule 20) ── */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
//                 {questions.map((q, idx) => {
//                     const isRevealed = revealedIdx === idx;

//                     return (
//                         <Card 
//                             key={idx} 
//                             className="bg-card border-border hover:border-school-primary-200 transition-all duration-500 rounded-[2rem] overflow-hidden group shadow-2xl"
//                         >
//                             <CardHeader className="bg-surface/50 border-b border-border flex flex-row items-center justify-between p-6 md:p-8">
//                                 <div className="flex items-center gap-4">
//                                     {/* Rule 21: Scale Protocol Index Hub */}
//                                     <span className="h-9 w-9 rounded-xl bg-school-primary-50 border border-school-primary-100 flex items-center justify-center text-[10px] font-extrabold italic text-school-primary shadow-sm tabular-nums">
//                                         #{String(idx + 1).padStart(2, '0')}
//                                     </span>
//                                     <div className="flex flex-col">
//                                         <span className="text-[10px] font-extrabold text-foreground uppercase tracking-widest">
//                                             {q.examBody || "External"} Archive
//                                         </span>
//                                         {q.year && (
//                                             <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter italic opacity-60">
//                                                 Registry Cycle: {q.year}
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="p-2 rounded-lg bg-surface border border-border shadow-inner">
//                                     <Zap className="h-4 w-4 text-school-primary opacity-40" />
//                                 </div>
//                             </CardHeader>

//                             <CardContent className="p-8 md:p-10 space-y-10">
//                                 <p className="text-foreground text-lg md:text-xl font-bold leading-relaxed italic tracking-tight uppercase">
//                                     {q.text}
//                                 </p>

//                                 <div className="pt-8 border-t border-border flex flex-col gap-6">
//                                     <button 
//                                         onClick={() => toggleAnswer(idx)}
//                                         className="w-fit text-[10px] font-extrabold uppercase tracking-[0.3em] transition-all hover:text-school-primary flex items-center gap-2 text-school-primary/60 group/btn"
//                                     >
//                                         {isRevealed ? (
//                                             <><EyeOff className="h-4 w-4" /> Conceal Solution Hub</>
//                                         ) : (
//                                             <><Eye className="h-4 w-4" /> Reveal Logic Hub</>
//                                         )}
//                                     </button>

//                                     {isRevealed && (
//                                         <div className="bg-surface rounded-[2rem] p-8 md:p-10 border border-border animate-in slide-in-from-top-4 duration-500 shadow-inner space-y-8 relative overflow-hidden">
//                                             {/* Rule 21 decoration */}
//                                             <div className="absolute top-0 right-0 w-24 h-24 bg-school-primary-50 blur-3xl opacity-30 pointer-events-none" />

//                                             <div className="space-y-3 relative z-10">
//                                                 <div className="flex items-center gap-2">
//                                                     <div className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
//                                                     <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Correct Registry Response</p>
//                                                 </div>
//                                                 <p className="text-lg font-extrabold text-foreground italic leading-tight tracking-tight uppercase border-l-2 border-school-primary-200 pl-6 py-1">
//                                                     "{q.answer}"
//                                                 </p>
//                                             </div>
                                            
//                                             <div className="space-y-3 relative z-10">
//                                                 <div className="flex items-center gap-2">
//                                                     <CheckCircle2 className="h-4 w-4 text-emerald-500" />
//                                                     <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Pedagogical Rationale</p>
//                                                 </div>
//                                                 <p className="text-sm text-muted-foreground leading-relaxed font-semibold uppercase tracking-tight italic opacity-80">
//                                                     {q.explanation}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }



// "use client";

// import React, { useState } from "react";
// import { Role } from "@prisma/client";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { 
//     Eye, EyeOff, CheckCircle2, 
//     GraduationCap, Zap, ShieldCheck,
//     SearchX
// } from "lucide-react";


// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// /**
//  * Rule 15: Interface for AI-digitized module entries.
//  */
// export interface ScannedQuestion {
//     text: string;
//     answer: string;
//     explanation: string;
//     marks?: number;
//     year?: number;
//     examBody?: string;
// }

// interface ScannedRegistryProps {
//     questions: ScannedQuestion[];
//     userRole: Role;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * SCANNED MODULE LEDGER (Tier 3 Visual Hub)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function ScannedQuestionRegistry({ 
//     questions
// }: ScannedRegistryProps) {
//     const [revealedIdx, setRevealedIdx] = useState<number | null>(null);
    
//     const toggleAnswer = (index: number) => {
//         setRevealedIdx(prev => (prev === index ? null : index));
//     };

//     if (questions.length === 0) {
//         return (
//             /* ── EMPTY HUB STATE (Rule 18/19) ── */
//             <div className="py-24 text-center bg-surface border-2 border-dashed border-border rounded-[2rem] animate-in fade-in duration-500">
//                 <div className="h-16 w-16 bg-card border border-border rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
//                     <SearchX className="h-8 w-8 text-muted-foreground/20" />
//                 </div>
//                 <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest italic leading-relaxed max-w-xs mx-auto">
//                     Registry Empty: No digitized past-paper modules <br/> 
//                     discovered for this specific hub context.
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-8 animate-in fade-in duration-700">
            
//             {/* ── METRICS HUB (Rule 21: Scale Protocol) ── */}
//             <div className="flex flex-col md:flex-row justify-between items-center bg-card p-6 md:p-8 rounded-[2rem] border border-border gap-6 shadow-xl">
//                 <div className="flex items-center gap-5">
//                     {/* Rule 21 mathematical scale token */}
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center shadow-inner transition-transform hover:scale-105">
//                         <GraduationCap className="h-7 w-7 text-school-primary" />
//                     </div>
//                     <div>
//                         <h3 className="text-foreground font-extrabold uppercase italic tracking-tighter text-lg">Digitized Assets</h3>
//                         <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest italic">
//                             {questions.length} Modules Resolved from Archive Hub
//                         </p>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-3 bg-surface px-5 py-2.5 rounded-xl border border-border shadow-sm">
//                     <ShieldCheck className="h-4 w-4 text-emerald-500" />
//                     <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">
//                         AI Syllabus Logic Verified
//                     </span>
//                 </div>
//             </div>

//             {/* ── MODULE GRID (Rule 20) ── */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
//                 {questions.map((q, idx) => {
//                     const isRevealed = revealedIdx === idx;

//                     return (
//                         <Card 
//                             key={idx} 
//                             className="bg-card border-border hover:border-school-primary-200 transition-all duration-500 rounded-[2rem] overflow-hidden group shadow-2xl"
//                         >
//                             <CardHeader className="bg-surface/50 border-b border-border flex flex-row items-center justify-between p-6 md:p-8">
//                                 <div className="flex items-center gap-4">
//                                     {/* Rule 21: Scale Protocol Index Hub */}
//                                     <span className="h-9 w-9 rounded-xl bg-school-primary-50 border border-school-primary-100 flex items-center justify-center text-[10px] font-extrabold italic text-school-primary shadow-sm tabular-nums">
//                                         #{String(idx + 1).padStart(2, '0')}
//                                     </span>
//                                     <div className="flex flex-col">
//                                         <span className="text-[10px] font-extrabold text-foreground uppercase tracking-widest">
//                                             {q.examBody || "External"} Archive
//                                         </span>
//                                         {q.year && (
//                                             <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter italic opacity-60">
//                                                 Registry Cycle: {q.year}
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="p-2 rounded-lg bg-surface border border-border shadow-inner">
//                                     <Zap className="h-4 w-4 text-school-primary opacity-40" />
//                                 </div>
//                             </CardHeader>

//                             <CardContent className="p-8 md:p-10 space-y-10">
//                                 <p className="text-foreground text-lg md:text-xl font-bold leading-relaxed italic tracking-tight uppercase">
//                                     {q.text}
//                                 </p>

//                                 <div className="pt-8 border-t border-border flex flex-col gap-6">
//                                     <button 
//                                         onClick={() => toggleAnswer(idx)}
//                                         className="w-fit text-[10px] font-extrabold uppercase tracking-[0.3em] transition-all hover:text-school-primary flex items-center gap-2 text-school-primary/60 group/btn"
//                                     >
//                                         {isRevealed ? (
//                                             <><EyeOff className="h-4 w-4" /> Conceal Solution Hub</>
//                                         ) : (
//                                             <><Eye className="h-4 w-4" /> Reveal Logic Hub</>
//                                         )}
//                                     </button>

//                                     {isRevealed && (
//                                         <div className="bg-surface rounded-[2rem] p-8 md:p-10 border border-border animate-in slide-in-from-top-4 duration-500 shadow-inner space-y-8 relative overflow-hidden">
//                                             {/* Rule 21 decoration */}
//                                             <div className="absolute top-0 right-0 w-24 h-24 bg-school-primary-50 blur-3xl opacity-30 pointer-events-none" />

//                                             <div className="space-y-3 relative z-10">
//                                                 <div className="flex items-center gap-2">
//                                                     <div className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
//                                                     <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Correct Registry Response</p>
//                                                 </div>
//                                                 <p className="text-lg font-extrabold text-foreground italic leading-tight tracking-tight uppercase border-l-2 border-school-primary-200 pl-6 py-1">
//                                                     "{q.answer}"
//                                                 </p>
//                                             </div>
                                            
//                                             <div className="space-y-3 relative z-10">
//                                                 <div className="flex items-center gap-2">
//                                                     <CheckCircle2 className="h-4 w-4 text-emerald-500" />
//                                                     <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Pedagogical Rationale</p>
//                                                 </div>
//                                                 <p className="text-sm text-muted-foreground leading-relaxed font-semibold uppercase tracking-tight italic opacity-80">
//                                                     {q.explanation}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }


"use client";

import React, { useState } from "react";
import { Role } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
    Eye, EyeOff, CheckCircle2, GraduationCap,
     Zap, ShieldCheck, SearchX
} from "lucide-react";

import { getErrorMessage } from "@/lib/error-handler";


// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

/**
 * Rule 15: Interface for AI-digitized module entries.
 */
export interface ScannedQuestion {
    text: string;
    answer: string;
    explanation: string;
    marks?: number;
    year?: number;
    examBody?: string;
}

interface ScannedRegistryProps {
    questions: ScannedQuestion[];
    userRole: Role;
}

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * SCANNED MODULE LEDGER (Tier 3 Visual Hub)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 * Rule 23: Explicit Error Protocol with standardized extraction.
 */
export function ScannedQuestionRegistry({ 
    questions
}: ScannedRegistryProps) {
    
    const [revealedIdx, setRevealedIdx] = useState<number | null>(null);
    
    // Rule 23: Logic Hub Protection
    const toggleAnswer = (index: number) => {
        try {
            setRevealedIdx(prev => (prev === index ? null : index));
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            console.error(`[REGISTRY_INTERACTION_FAULT]: ${message}`);
        }
    };

    if (questions.length === 0) {
        return (
            /* ── EMPTY HUB STATE (Rule 18/19) ── */
            <div className="py-24 text-center bg-surface border-2 border-dashed border-border rounded-[2rem] animate-in fade-in duration-500">
                <div className="h-16 w-16 bg-card border border-border rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <SearchX className="h-8 w-8 text-muted-foreground/20" />
                </div>
                <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest italic leading-relaxed max-w-xs mx-auto">
                    Registry Empty: No digitized past-paper modules <br/> 
                    discovered for this specific hub context.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            
            {/* ── METRICS HUB (Rule 21: Scale Protocol) ── */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-card p-6 md:p-8 rounded-[2rem] border border-border gap-6 shadow-xl">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center shadow-inner transition-transform hover:scale-105">
                        <GraduationCap className="h-7 w-7 text-school-primary" />
                    </div>
                    <div>
                        <h3 className="text-foreground font-extrabold uppercase italic tracking-tighter text-lg leading-none">Digitized Assets</h3>
                        <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-1.5 italic">
                            {questions.length} Modules Resolved from Archive Hub
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-surface px-5 py-2.5 rounded-xl border border-border shadow-sm">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">
                        AI Syllabus Logic Verified
                    </span>
                </div>
            </div>

            {/* ── MODULE GRID (Rule 20) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {questions.map((q, idx) => {
                    const isRevealed = revealedIdx === idx;

                    return (
                        <Card 
                            key={idx} 
                            className="bg-card border-border hover:border-school-primary-200 transition-all duration-500 rounded-[2rem] overflow-hidden group shadow-2xl"
                        >
                            <CardHeader className="bg-surface/50 border-b border-border flex flex-row items-center justify-between p-6 md:p-8">
                                <div className="flex items-center gap-4">
                                    <span className="h-9 w-9 rounded-xl bg-school-primary-50 border border-school-primary-100 flex items-center justify-center text-[10px] font-extrabold italic text-school-primary shadow-sm tabular-nums">
                                        #{String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-extrabold text-foreground uppercase tracking-widest">
                                            {q.examBody || "External"} Archive
                                        </span>
                                        {q.year && (
                                            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter italic opacity-60">
                                                Registry Cycle: {q.year}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-2 rounded-lg bg-surface border border-border shadow-inner">
                                    <Zap className="h-4 w-4 text-school-primary opacity-40" />
                                </div>
                            </CardHeader>

                            <CardContent className="p-8 md:p-10 space-y-10">
                                <p className="text-foreground text-lg md:text-xl font-bold leading-relaxed italic tracking-tight uppercase">
                                    {q.text}
                                </p>

                                <div className="pt-8 border-t border-border flex flex-col gap-6">
                                    <button 
                                        onClick={() => toggleAnswer(idx)}
                                        className="w-fit text-[10px] font-extrabold uppercase tracking-[0.3em] transition-all hover:text-school-primary flex items-center gap-2 text-school-primary/60 group/btn"
                                    >
                                        {isRevealed ? (
                                            <><EyeOff className="h-4 w-4" /> Conceal Solution Hub</>
                                        ) : (
                                            <><Eye className="h-4 w-4" /> Reveal Logic Hub</>
                                        )}
                                    </button>

                                    {isRevealed && (
                                        <div className="bg-surface rounded-[2rem] p-8 md:p-10 border border-border animate-in slide-in-from-top-4 duration-500 shadow-inner space-y-8 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-school-primary-50 blur-3xl opacity-30 pointer-events-none" />

                                            <div className="space-y-3 relative z-10">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
                                                    <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Correct Registry Response</p>
                                                </div>
                                                {/* ✅ RESOLVED react/no-unescaped-entities error */}
                                                <p className="text-lg font-extrabold text-foreground italic leading-tight tracking-tight uppercase border-l-2 border-school-primary-200 pl-6 py-1">
                                                    &quot;{q.answer}&quot;
                                                </p>
                                            </div>
                                            
                                            <div className="space-y-3 relative z-10">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                    <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Pedagogical Rationale</p>
                                                </div>
                                                <p className="text-sm text-muted-foreground leading-relaxed font-semibold uppercase tracking-tight italic opacity-80">
                                                    {q.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}