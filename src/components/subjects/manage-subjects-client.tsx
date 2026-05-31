// "use client";

// import { useMemo, useState, useTransition } from "react";
// import {  Role } from "@prisma/client";
// import { toggleSubjectEnrollment } from "@/app/actions/enrollment";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";

// type ManageSubject = {
//   id: string;
//   gradeName: string;
//   subjectName: string;
//   isSelected: boolean;
// };

// type Props = {
//   userId: string;
//   userRole: Role;
//   subjects: ManageSubject[];
// };

// export function ManageSubjectsClient({ userId, userRole, subjects }: Props) {
//   const [search, setSearch] = useState("");
//   const [items, setItems] = useState<ManageSubject[]>(subjects);
//   const [isPending, startTransition] = useTransition();

//   const filtered = useMemo(() => {
//     const query = search.trim().toLowerCase();
//     if (!query) return items;

//     return items.filter((item) => {
//       const haystack = `${item.gradeName} ${item.subjectName}`.toLowerCase();
//       return haystack.includes(query);
//     });
//   }, [items, search]);

//   const handleToggle = (subject: ManageSubject) => {
//     if (isPending) return;

//     startTransition(async () => {
//       try {
//         const optimisticSelected = !subject.isSelected;

//         // Optimistic UI update
//         setItems((prev) =>
//           prev.map((item) =>
//             item.id === subject.id ? { ...item, isSelected: optimisticSelected } : item
//           )
//         );

//         const result = await toggleSubjectEnrollment({
//           gradeSubjectId: subject.id,
//           userId,
//         });

//         const actionVerb = optimisticSelected ? "added to" : "removed from";
//         const noun =
//           userRole === Role.STUDENT ? "your subjects" : "your teaching list";

//         toast.success(
//           `${subject.subjectName} ${actionVerb} ${noun}.`
//         );
//       } catch (error) {
//         console.error(error);
//         toast.error("Unable to update subject enrollment. Please try again.");

//         // Roll back optimistic change on error
//         setItems((prev) =>
//           prev.map((item) =>
//             item.id === subject.id ? { ...item, isSelected: subject.isSelected } : item
//           )
//         );
//       }
//     });
//   };

//   const titleByRole =
//     userRole === Role.STUDENT ? "Manage Your Subjects" : "Manage Your Teaching Subjects";

//   const subtitleByRole =
//     userRole === Role.STUDENT
//       ? "Choose the subjects you want to focus on this term."
//       : "Select the subjects and classes you actively teach.";

//   return (
//     <div className="mx-auto flex max-w-6xl flex-col gap-6">
//       <header className="space-y-2">
//         <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
//           {titleByRole}
//         </h1>
//         <p className="max-w-2xl text-sm text-muted-foreground">
//           {subtitleByRole}
//         </p>
//       </header>

//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex-1">
//           <Input
//             placeholder="Search by subject or grade..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full"
//           />
//         </div>
//       </div>

//       {filtered.length === 0 ? (
//         <p className="text-sm text-muted-foreground">
//           No subjects found. Try adjusting your search.
//         </p>
//       ) : (
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {filtered.map((subject) => {
//             const isSelected = subject.isSelected;

//             return (
//               <Card
//                 key={subject.id}
//                 className={cn(
//                   "flex flex-col border transition-colors",
//                   isSelected &&
//                     "border-amber-400 bg-amber-50/40 dark:border-amber-500 dark:bg-amber-900/20"
//                 )}
//               >
//                 <CardHeader className="space-y-1 pb-2">
//                   <CardTitle className="flex items-center justify-between gap-2 text-base">
//                     <span className="truncate">
//                       {subject.gradeName} – {subject.subjectName}
//                     </span>
//                     {isSelected && (
//                       <Badge
//                         variant="outline"
//                         className="border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-200"
//                       >
//                         Selected
//                       </Badge>
//                     )}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="mt-auto flex justify-end pt-0">
//                   <Button
//                     variant={isSelected ? "outline" : "default"}
//                     size="sm"
//                     disabled={isPending}
//                     onClick={() => handleToggle(subject)}
//                   >
//                     {isSelected ? "Remove" : "Enroll"}
//                   </Button>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import { useMemo, useState, useTransition } from "react";
// import { Role } from "@prisma/client";
// import { toggleSubjectEnrollment } from "@/app/actions/enrollment";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";

// type ManageSubject = {
//   id: string;
//   gradeName: string;
//   subjectName: string;
//   isSelected: boolean;
// };

// type Props = {
//   userId: string;
//   userRole: Role;
//   subjects: ManageSubject[];
// };

// export function ManageSubjectsClient({ userId, userRole, subjects }: Props) {
//   const [search, setSearch] = useState("");
//   const [items, setItems] = useState<ManageSubject[]>(subjects);
//   const [isPending, startTransition] = useTransition();

//   const filtered = useMemo(() => {
//     const query = search.trim().toLowerCase();
//     if (!query) return items;

//     return items.filter((item) => {
//       const haystack = `${item.gradeName} ${item.subjectName}`.toLowerCase();
//       return haystack.includes(query);
//     });
//   }, [items, search]);
//   const handleToggle = (subject: ManageSubject) => {
//     if (isPending) return;

//     startTransition(async () => {
//       // 1. Store the original state for rollback
//       const originalSelected = subject.isSelected;
//       const optimisticSelected = !originalSelected;

//       try {
//         // 2. Apply Optimistic UI update
//         setItems((prev) =>
//           prev.map((item) =>
//             item.id === subject.id ? { ...item, isSelected: optimisticSelected } : item
//           )
//         );

//         // 3. Perform Server Action
//         const result = await toggleSubjectEnrollment({
//           gradeSubjectId: subject.id,
//           userId,
//         });

//         // ✅ FIX: Use 'result.enrolled' to sync the UI state. 
//         // This satisfies the "unused variable" warning and the Type error.
//         setItems((prev) =>
//           prev.map((item) =>
//             item.id === subject.id ? { ...item, isSelected: result.enrolled } : item
//           )
//         );

//         const actionVerb = result.enrolled ? "added to" : "removed from";
//         const noun =
//           userRole === Role.STUDENT ? "your subjects" : "your teaching list";

//         toast.success(
//           `${subject.subjectName} ${actionVerb} ${noun}.`
//         );
//       } catch (error) {
//         console.error("Enrollment error:", error);
//         toast.error("Unable to update subject enrollment. Please try again.");

//         // 4. Roll back optimistic change on error
//         setItems((prev) =>
//           prev.map((item) =>
//             item.id === subject.id ? { ...item, isSelected: originalSelected } : item
//           )
//         );
//       }
//     });
//   };

//   const titleByRole =
//     userRole === Role.STUDENT ? "Manage Your Subjects" : "Manage Your Teaching Subjects";

//   const subtitleByRole =
//     userRole === Role.STUDENT
//       ? "Choose the subjects you want to focus on this term."
//       : "Select the subjects and classes you actively teach.";

//   return (
//     <div className="mx-auto flex max-w-6xl flex-col gap-6">
//       <header className="space-y-2">
//         <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
//           {titleByRole}
//         </h1>
//         <p className="max-w-2xl text-sm text-muted-foreground">
//           {subtitleByRole}
//         </p>
//       </header>

//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex-1">
//           <Input
//             placeholder="Search by subject or grade..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full"
//           />
//         </div>
//       </div>

//       {filtered.length === 0 ? (
//         <p className="text-sm text-muted-foreground">
//           No subjects found. Try adjusting your search.
//         </p>
//       ) : (
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {filtered.map((subject) => {
//             const isSelected = subject.isSelected;

//             return (
//               <Card
//                 key={subject.id}
//                 className={cn(
//                   "flex flex-col border transition-colors",
//                   isSelected &&
//                     "border-amber-400 bg-amber-50/40 dark:border-amber-500 dark:bg-amber-900/20"
//                 )}
//               >
//                 <CardHeader className="space-y-1 pb-2">
//                   <CardTitle className="flex items-center justify-between gap-2 text-base">
//                     <span className="truncate">
//                       {subject.gradeName} – {subject.subjectName}
//                     </span>
//                     {isSelected && (
//                       <Badge
//                         variant="outline"
//                         className="border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-200"
//                       >
//                         Selected
//                       </Badge>
//                     )}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="mt-auto flex justify-end pt-0">
//                   <Button
//                     variant={isSelected ? "outline" : "default"}
//                     size="sm"
//                     disabled={isPending}
//                     onClick={() => handleToggle(subject)}
//                   >
//                     {isSelected ? "Remove" : "Enroll"}
//                   </Button>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import React, { useState, useMemo } from "react";
// import { Card, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import {
//   BookOpen,
//   ArrowLeft,
//   ChevronRight,
//   BookX,
//   Globe,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { classifyNigerianSubject } from "@/lib/curriculum/nigeria";
// import { computeSubjectPerformance } from "@/lib/academics/compute-performance";
// import { useRouter } from "next/navigation";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface Topic {
//   id: string;
//   title: string;
//   weekNumber?: number | null;
//   term?: {
//     index: number;
//   } | null;
// }

// interface Assessment {
//   id: string;
//   score: number | null;
//   maxScore: number | null;
//   type: string;
// }

// interface GradeSubject {
//   id: string;
//   subject: {
//     name: string;
//   };
//   topics: Topic[];
//   assessments: Assessment[];
// }

// interface SubjectsGridProps {
//   subjects: GradeSubject[];
//   classTeacherName: string;
//   gradeLevel: number;
//   isIndependent: boolean; // Rule 6 context
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function SubjectsGrid({
//   subjects,
//   classTeacherName,
//   gradeLevel,
//   isIndependent
// }: SubjectsGridProps) {
//   const [selectedSubject, setSelectedSubject] = useState<GradeSubject | null>(null);

//   // Deep dive view into a specific subject's syllabus
//   if (selectedSubject) {
//     return (
//       <CurriculumView
//         subject={selectedSubject}
//         classTeacherName={isIndependent ? "Global Academic AI" : classTeacherName}
//         onBack={() => setSelectedSubject(null)}
//       />
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* Header logic based on Rule 6 (Independent Learners) */}
//       <div className="flex items-center justify-between">
//         <div className="space-y-1">
//           <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
//             {isIndependent ? "Learning Library" : (gradeLevel <= 9 ? "Full Curriculum" : "My Academic Load")}
//           </h2>
//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
//             {isIndependent 
//               ? "Self-paced global knowledge modules" 
//               : "Standardized institutional syllabus for your grade level"}
//           </p>
//         </div>

//         <Badge
//           variant="outline"
//           className="bg-slate-900 border-white/10 text-school-primary px-6 py-2 rounded-2xl font-black text-xs uppercase"
//         >
//           {subjects.length} Modules Active
//         </Badge>
//       </div>

//       {subjects.length === 0 ? (
//         <div className="py-32 text-center bg-slate-900/40 rounded-[3rem] border border-dashed border-white/5">
//           <BookX className="h-12 w-12 text-slate-800 mx-auto mb-4" />
//           <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest">
//             Registry Empty: Select subjects from the catalogue to begin.
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//           {subjects.map((gs) => (
//             <SubjectCard
//               key={gs.id}
//               gs={gs}
//               classTeacherName={isIndependent ? "Platform AI" : classTeacherName}
//               isSSS={gradeLevel >= 10}
//               isIndependent={isIndependent}
//               onSelect={() => setSelectedSubject(gs)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Subject Card ─────────────────────────────────────────────────────────────

// interface SubjectCardProps {
//   gs: GradeSubject;
//   classTeacherName: string;
//   isSSS: boolean;
//   isIndependent: boolean;
//   onSelect: () => void;
// }

// function SubjectCard({ gs, classTeacherName, isSSS, isIndependent, onSelect }: SubjectCardProps) {
//   const totalTopics = gs.topics?.length || 0;
//   const gradedCount = gs.assessments?.length || 0;
//   const progressPercent = totalTopics > 0 ? (gradedCount / totalTopics) * 100 : 0;

//   const { isCompulsory, stream } = classifyNigerianSubject(gs.subject.name, !isSSS);
//   const isCore = !isIndependent && isSSS && isCompulsory;

//   // Derive stats from utility
//   const performance = computeSubjectPerformance(gs.assessments || []);

//   return (
//     <Card
//       className={cn(
//         "group cursor-pointer bg-slate-900 border-white/5 rounded-[2.5rem] transition-all hover:border-school-primary/30 shadow-2xl overflow-hidden flex flex-col",
//         isCore && "border-school-primary/20 bg-school-primary/[0.02]"
//       )}
//       onClick={onSelect}
//     >
//       <div className="p-8 space-y-6 flex-1">
//         <div className="flex items-start justify-between">
//           <div className="space-y-4 flex-1">
//             <div className={cn(
//                 "p-4 rounded-2xl w-fit transition-colors",
//                 isCore ? "bg-school-primary text-slate-950" : "bg-slate-950 text-school-primary group-hover:bg-school-primary/10"
//               )}>
//               {isIndependent ? <Globe className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
//             </div>
//             <div>
//               <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight">
//                 {gs.subject.name}
//               </h3>
//               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
//                 {classTeacherName}
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-col gap-2 items-end">
//             {isCore && <Badge className="bg-school-primary text-slate-950 text-[8px] font-black uppercase">Core</Badge>}
//             {stream && !isIndependent && <Badge className="bg-white/10 text-white text-[8px] font-black uppercase">{stream}</Badge>}
//           </div>
//         </div>

//         <div className="space-y-4">
//           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
//             <span className="text-slate-500">Academic Score</span>
//             <span className="text-white">
//               {performance.total}% <span className="text-school-primary ml-1">[{performance.grade}]</span>
//             </span>
//           </div>
          
//           <div className="space-y-2">
//             <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-600">
//                 <span>Coverage</span>
//                 <span>{gradedCount} / {totalTopics}</span>
//             </div>
//             <Progress value={progressPercent} className="h-1 bg-slate-950 [&>div]:bg-school-primary" />
//           </div>
//         </div>
//       </div>

//       <div className="px-8 py-6 bg-slate-950/50 border-t border-white/5 flex items-center justify-between">
//         <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] group-hover:text-school-primary transition-colors">
//             Analyze Syllabus
//         </p>
//         <ChevronRight className="h-4 w-4 text-slate-800 group-hover:translate-x-1 group-hover:text-school-primary transition-all" />
//       </div>
//     </Card>
//   );
// }

// // ── Curriculum View (Deep Dive) ──────────────────────────────────────────────

// function CurriculumView({ subject: gs, classTeacherName, onBack }: { subject: GradeSubject, classTeacherName: string, onBack: () => void }) {
//   const [selectedTerm, setSelectedTerm] = useState<number>(1);
//   const router = useRouter();

//   const termMap = useMemo(() => {
//     const map: Record<number, Topic[]> = { 1: [], 2: [], 3: [] };
//     gs.topics?.forEach(t => {
//       const idx = t.term?.index || 1;
//       if (map[idx]) map[idx].push(t);
//     });
//     return map;
//   }, [gs.topics]);

//   return (
//     <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
//       <Button variant="ghost" onClick={onBack} className="text-slate-500 hover:text-white uppercase font-black text-[10px] tracking-widest">
//         <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
//       </Button>

//       <Card className="bg-slate-900 border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
//         <CardHeader className="bg-slate-950/50 p-10 border-b border-white/5">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//                 <div>
//                     <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">{gs.subject.name}</h2>
//                     <p className="text-xs text-slate-500 font-bold uppercase mt-2">Instructor: {classTeacherName}</p>
//                 </div>
                
//                 <div className="flex gap-2 p-1.5 bg-slate-900 rounded-2xl w-fit border border-white/5">
//                     {[1, 2, 3].map(idx => (
//                         <button
//                             key={idx}
//                             onClick={() => setSelectedTerm(idx)}
//                             className={cn(
//                                 "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
//                                 selectedTerm === idx ? "bg-school-primary text-slate-950 shadow-lg" : "text-slate-500 hover:text-white"
//                             )}
//                         >
//                             Term 0{idx}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         </CardHeader>

//         <div className="p-10 grid gap-4 grid-cols-1 md:grid-cols-2">
//           {termMap[selectedTerm].length === 0 ? (
//             <p className="col-span-full py-20 text-center text-slate-700 text-xs font-black uppercase italic tracking-widest">
//               No syllabus roadmap defined for this term.
//             </p>
//           ) : (
//             termMap[selectedTerm].map((topic, i) => (
//               <div
//                 key={topic.id}
//                 onClick={() => router.push(`/student/lessons/${topic.id}`)}
//                 className="flex items-center gap-6 p-6 rounded-3xl bg-slate-950 border border-white/5 cursor-pointer hover:border-school-primary/30 transition-all group shadow-xl"
//               >
//                 <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-xs font-black text-slate-600 group-hover:text-school-primary transition-colors">
//                   {topic.weekNumber || i + 1}
//                 </div>
//                 <p className="flex-1 text-sm font-bold text-slate-300 uppercase tracking-tight group-hover:text-white">
//                     {topic.title}
//                 </p>
//                 <ChevronRight className="h-4 w-4 text-slate-800 group-hover:text-school-primary transition-all" />
//               </div>
//             ))
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// }



// "use client";

// import React, { useState, useMemo } from "react";
// import { Card, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   BookOpen,
//   ArrowLeft,
//   ChevronRight,
//   BookX,
//   Globe,
//   Target
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { classifyNigerianSubject } from "@/lib/curriculum/nigeria";
// import { computeSubjectPerformance } from "@/lib/academics/compute-performance";
// import { useRouter } from "next/navigation";

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface Topic {
//   id: string;
//   title: string;
//   weekNumber?: number | null;
//   term?: {
//     index: number;
//   } | null;
// }

// interface Assessment {
//   id: string;
//   score: number | null;
//   maxScore: number | null;
//   type: string;
// }

// interface GradeSubject {
//   id: string;
//   subject: {
//     name: string;
//   };
//   topics: Topic[];
//   assessments: Assessment[];
// }

// interface SubjectsGridProps {
//   subjects: GradeSubject[];
//   classTeacherName: string;
//   gradeLevel: number;
//   isIndependent: boolean;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * ACADEMIC MODULE MATRIX (Tier 2/3)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function SubjectsGrid({
//   subjects,
//   classTeacherName,
//   gradeLevel,
//   isIndependent,
// }: SubjectsGridProps) {
//   const [selectedSubject, setSelectedSubject] = useState<GradeSubject | null>(null);

//   if (selectedSubject) {
//     return (
//       <CurriculumView
//         subject={selectedSubject}
//         classTeacherName={isIndependent ? "Global Academic Hub" : classTeacherName}
//         onBack={() => setSelectedSubject(null)}
//       />
//     );
//   }

//   return (
//     <div className="space-y-10 animate-in fade-in duration-700">
      
//       {/* ── HEADER (Rule 11) ── */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
//         <div className="space-y-3">
//           <h2 className="text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//             {isIndependent ? "Learning Hub" : (gradeLevel <= 9 ? "Full Curriculum" : "Academic Load")}
//           </h2>
//           <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest italic opacity-70">
//             {isIndependent 
//               ? "Self-paced global knowledge modules" 
//               : "Standardized institutional syllabus for your current level"}
//           </p>
//         </div>

//         <Badge
//           variant="outline"
//           className="bg-surface border-border text-school-primary px-6 py-2 rounded-xl font-extrabold text-[10px] uppercase tracking-widest shadow-sm w-fit"
//         >
//           {subjects.length} Active Modules
//         </Badge>
//       </div>

//       {subjects.length === 0 ? (
//         /* ── EMPTY HUB STATE (Rule 19) ── */
//         <div className="py-32 text-center bg-surface border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center space-y-6">
//           <div className="h-16 w-16 bg-background rounded-full border border-border flex items-center justify-center shadow-inner">
//             <BookX className="h-8 w-8 text-muted-foreground/30" />
//           </div>
//           <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest italic leading-relaxed max-w-xs">
//             Registry Ledger Empty: Synchronize modules to your path to begin.
//           </p>
//         </div>
//       ) : (
//         /* ── SUBJECT GRID (Rule 20) ── */
//         <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//           {subjects.map((gs) => (
//             <SubjectCard
//               key={gs.id}
//               gs={gs}
//               classTeacherName={isIndependent ? "Platform AI Core" : classTeacherName}
//               isSSS={gradeLevel >= 10}
//               isIndependent={isIndependent}
//               onSelect={() => setSelectedSubject(gs)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Subject Card (Sub-Component) ─────────────────────────────────────────────

// function SubjectCard({ gs, classTeacherName, isSSS, isIndependent, onSelect }: any) {
//   const totalTopics = gs.topics?.length || 0;
//   const gradedCount = gs.assessments?.length || 0;
//   const progressPercent = totalTopics > 0 ? (gradedCount / totalTopics) * 100 : 0;

//   const { isCompulsory } = classifyNigerianSubject(gs.subject.name, !isSSS);
//   const isCore = !isIndependent && isSSS && isCompulsory;
//   const performance = computeSubjectPerformance(gs.assessments || []);

//   return (
//     <Card
//       className={cn(
//         "group cursor-pointer transition-all duration-500 overflow-hidden flex flex-col shadow-xl",
//         "bg-card border-border rounded-[2rem]", // Rule 18/19
//         isCore ? "border-school-primary-200 bg-school-primary-50/30" : "hover:border-school-primary-200"
//       )}
//       onClick={onSelect}
//     >
//       <div className="p-8 space-y-8 flex-1">
//         <div className="flex items-start justify-between">
//           <div className="space-y-5 flex-1">
//             {/* Rule 21: Scale Protocol Icon Box */}
//             <div className={cn(
//                 "h-14 w-14 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-inner group-hover:scale-110",
//                 isCore 
//                   ? "bg-school-primary border-school-primary-200 text-on-school-primary" 
//                   : "bg-surface border-border text-school-primary group-hover:bg-school-primary-50"
//               )}>
//               {isIndependent ? <Globe className="h-7 w-7" /> : <BookOpen className="h-7 w-7" />}
//             </div>
//             <div>
//               <h3 className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter leading-tight group-hover:text-school-primary transition-colors">
//                 {gs.subject.name}
//               </h3>
//               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 opacity-60">
//                 {classTeacherName}
//               </p>
//             </div>
//           </div>

//           {isCore && (
//             <Badge className="bg-school-primary text-on-school-primary text-[8px] font-extrabold uppercase px-3 py-1 rounded-lg shadow-sm">
//                 Core
//             </Badge>
//           )}
//         </div>

//         <div className="space-y-5">
//           <div className="flex items-center justify-between">
//             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Hub Proficiency</span>
//             <div className="text-right">
//                 <span className="text-lg font-extrabold text-foreground italic tabular-nums leading-none">
//                     {performance.total}%
//                 </span>
//                 <span className="text-[9px] font-extrabold text-school-primary ml-1 uppercase tracking-tighter">
//                     [{performance.grade}]
//                 </span>
//             </div>
//           </div>
          
//           <div className="space-y-2.5">
//             <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
//                 <span>Module Sync</span>
//                 <span className="tabular-nums font-extrabold">{gradedCount} / {totalTopics}</span>
//             </div>
//             <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden border border-border">
//                 <div 
//                     className="h-full bg-school-primary transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(var(--school-primary-raw),0.2)]" 
//                     style={{ width: `${progressPercent}%` }} 
//                 />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="px-8 py-5 bg-surface/50 border-t border-border flex items-center justify-between group-hover:bg-school-primary-50 transition-colors">
//         <p className="text-[9px] font-extrabold text-muted-foreground/60 uppercase tracking-[0.3em] group-hover:text-school-primary transition-colors">
//             Audit Syllabus Hub
//         </p>
//         <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:translate-x-1 group-hover:text-school-primary transition-all" />
//       </div>
//     </Card>
//   );
// }

// // ── Curriculum View (Syllabus Deep-Dive) ─────────────────────────────────────

// function CurriculumView({ subject: gs, classTeacherName, onBack }: any) {
//   const [selectedTerm, setSelectedTerm] = useState<number>(1);
//   const router = useRouter();

//   const termMap = useMemo(() => {
//     const map: Record<number, Topic[]> = { 1: [], 2: [], 3: [] };
//     gs.topics?.forEach((t: Topic) => {
//       const idx = t.term?.index || 1;
//       if (map[idx]) map[idx].push(t);
//     });
//     return map;
//   }, [gs.topics]);

//   return (
//     <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-700">
//       <button 
//         onClick={onBack} 
//         className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground uppercase font-extrabold text-[10px] tracking-widest transition-all group"
//       >
//         <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Terminal
//       </button>

//       <Card className="bg-card border-border rounded-[2rem] overflow-hidden shadow-2xl">
//         <CardHeader className="bg-surface/50 p-8 md:p-12 border-b border-border">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
//                 <div className="space-y-3">
//                     <h2 className="text-3xl md:text-5xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                         {gs.subject.name}
//                     </h2>
//                     <div className="flex items-center gap-3">
//                         <Target className="h-4 w-4 text-school-primary" />
//                         <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
//                             Instructor Context: {classTeacherName}
//                         </p>
//                     </div>
//                 </div>
                
//                 <div className="flex bg-surface p-1.5 rounded-2xl border border-border shadow-inner w-fit">
//                     {[1, 2, 3].map(idx => (
//                         <button
//                             key={idx}
//                             onClick={() => setSelectedTerm(idx)}
//                             className={cn(
//                                 "px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all",
//                                 selectedTerm === idx 
//                                     ? "bg-school-primary text-on-school-primary shadow-lg" 
//                                     : "text-muted-foreground hover:text-foreground"
//                             )}
//                         >
//                             Term 0{idx}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         </CardHeader>

//         <div className="p-8 md:p-12 grid gap-4 grid-cols-1 md:grid-cols-2">
//           {termMap[selectedTerm].length === 0 ? (
//             <div className="col-span-full py-24 text-center opacity-30">
//               <p className="text-sm font-extrabold text-muted-foreground uppercase italic tracking-widest">
//                 Academic roadmap offline for this timeline.
//               </p>
//             </div>
//           ) : (
//             termMap[selectedTerm].map((topic, i) => (
//               <div
//                 key={topic.id}
//                 onClick={() => router.push(`/student/lessons/${topic.id}`)}
//                 className="flex items-center gap-6 p-6 rounded-[1.5rem] bg-surface border border-border cursor-pointer hover:border-school-primary-300 hover:shadow-lg transition-all group shadow-sm"
//               >
//                 <div className="h-10 w-10 bg-card border border-border rounded-xl flex items-center justify-center text-xs font-extrabold text-muted-foreground group-hover:text-school-primary group-hover:border-school-primary-100 transition-all tabular-nums">
//                   {topic.weekNumber || i + 1}
//                 </div>
//                 <p className="flex-1 text-sm font-bold text-foreground/80 uppercase italic tracking-tight group-hover:text-foreground transition-colors">
//                     {topic.title}
//                 </p>
//                 <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-school-primary group-hover:translate-x-1 transition-all" />
//               </div>
//             ))
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// }



"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  ArrowLeft, 
  ChevronRight, 
  BookX, 
  Globe, 
  Target
} from "lucide-react";

import { cn } from "@/lib/utils";
import { classifyNigerianSubject } from "@/lib/curriculum/nigeria";
import { computeSubjectPerformance } from "@/lib/academics/compute-performance";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/error-handler";

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface TopicHub {
  id: string;
  title: string;
  weekNumber?: number | null;
  term?: {
    index: number;
  } | null;
}

interface AssessmentHub {
  id: string;
  score: number | null;
  maxScore: number | null;
  type: string;
}

interface GradeSubjectHub {
  id: string;
  subject: {
    name: string;
  };
  topics: TopicHub[];
  assessments: AssessmentHub[];
}

interface SubjectsGridProps {
  subjects: GradeSubjectHub[];
  classTeacherName: string;
  gradeLevel: number;
  isIndependent: boolean;
}

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * ACADEMIC MODULE MATRIX (Tier 2/3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 15: Zero 'any' types. All interfaces strictly defined.
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 * Rule 23: Explicit Error Protocol with getErrorMessage.
 */
export function SubjectsGrid({
  subjects,
  classTeacherName,
  gradeLevel,
  isIndependent,
}: SubjectsGridProps) {
  const [selectedSubject, setSelectedSubject] = useState<GradeSubjectHub | null>(null);

  /**
   * Rule 23: Hub Navigation Protection
   */
  const handleModuleSelection = (module: GradeSubjectHub | null) => {
    try {
      setSelectedSubject(module);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`[MODULE_MATRIX_FAULT]: ${message}`);
    }
  };

  if (selectedSubject) {
    return (
      <CurriculumView
        subject={selectedSubject}
        classTeacherName={isIndependent ? "Global Academic Hub" : classTeacherName}
        onBack={() => handleModuleSelection(null)}
      />
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* ── HEADER HUB (Rule 11) ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
            {isIndependent ? "Learning Hub" : (gradeLevel <= 9 ? "Full Curriculum" : "Academic Load")}
          </h2>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest italic opacity-70">
            {isIndependent 
              ? "Self-paced global knowledge modules" 
              : "Standardized institutional syllabus for your current level"}
          </p>
        </div>

        <Badge
          variant="outline"
          className="bg-surface border-border text-school-primary px-6 py-2 rounded-xl font-extrabold text-[10px] uppercase tracking-widest shadow-sm w-fit"
        >
          {subjects.length} Active Modules
        </Badge>
      </div>

      {subjects.length === 0 ? (
        /* ── EMPTY HUB STATE (Rule 18/19) ── */
        <div className="py-32 text-center bg-surface border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center space-y-6">
          <div className="h-16 w-16 bg-card rounded-2xl border border-border flex items-center justify-center mx-auto shadow-lg">
            <BookX className="h-8 w-8 text-muted-foreground/20" />
          </div>
          <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest italic leading-relaxed max-w-xs">
            Registry Ledger Empty: Synchronize modules to your path to begin.
          </p>
        </div>
      ) : (
        /* ── SUBJECT HUB GRID (Rule 20) ── */
        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((gs) => (
            <SubjectCard
              key={gs.id}
              gs={gs}
              classTeacherName={isIndependent ? "Platform AI Core" : classTeacherName}
              isSSS={gradeLevel >= 10}
              isIndependent={isIndependent}
              onSelect={() => handleModuleSelection(gs)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Subject Card Component (Rule 15/21) ──────────────────────────────────────

interface SubjectCardProps {
  gs: GradeSubjectHub;
  classTeacherName: string;
  isSSS: boolean;
  isIndependent: boolean;
  onSelect: () => void;
}

function SubjectCard({ gs, classTeacherName, isSSS, isIndependent, onSelect }: SubjectCardProps) {
  const totalTopics = gs.topics?.length || 0;
  const gradedCount = gs.assessments?.length || 0;
  const progressPercent = totalTopics > 0 ? (gradedCount / totalTopics) * 100 : 0;

  const { isCompulsory } = classifyNigerianSubject(gs.subject.name, !isSSS);
  const isCore = !isIndependent && isSSS && isCompulsory;
  const performance = computeSubjectPerformance(gs.assessments || []);

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-500 overflow-hidden flex flex-col shadow-xl",
        "bg-card border-border rounded-[2rem]", // Rule 18/19
        isCore ? "border-school-primary-200 bg-school-primary-50" : "hover:border-school-primary-200"
      )}
      onClick={onSelect}
    >
      <div className="p-8 space-y-8 flex-1">
        <div className="flex items-start justify-between">
          <div className="space-y-5 flex-1">
            {/* Rule 21: Scale Protocol Hub Icon */}
            <div className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-inner group-hover:scale-110",
                isCore 
                  ? "bg-school-primary border-school-primary-200 text-on-school-primary" 
                  : "bg-surface border-border text-school-primary group-hover:bg-school-primary-50"
              )}>
              {isIndependent ? <Globe className="h-7 w-7" /> : <BookOpen className="h-7 w-7" />}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter leading-tight group-hover:text-school-primary transition-colors">
                {gs.subject.name}
              </h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 opacity-60">
                {classTeacherName}
              </p>
            </div>
          </div>

          {isCore && (
            <Badge className="bg-school-primary text-on-school-primary text-[8px] font-extrabold uppercase px-3 py-1 rounded-lg shadow-sm">
                Core Hub
            </Badge>
          )}
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Hub Proficiency</span>
            <div className="text-right">
                <span className="text-lg font-extrabold text-foreground italic tabular-nums leading-none">
                    {performance.total}%
                </span>
                <span className="text-[9px] font-extrabold text-school-primary ml-1 uppercase tracking-tighter">
                    [{performance.grade}]
                </span>
            </div>
          </div>
          
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                <span>Module Sync</span>
                <span className="tabular-nums font-extrabold">{gradedCount} / {totalTopics}</span>
            </div>
            {/* Rule 21: Brand Color Progress Hub */}
            <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden border border-border">
                <div 
                    className="h-full bg-school-primary transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(var(--school-primary-raw),0.2)]" 
                    style={{ width: `${progressPercent}%` }} 
                />
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-5 bg-surface/50 border-t border-border flex items-center justify-between group-hover:bg-school-primary-50 transition-colors">
        <p className="text-[9px] font-extrabold text-muted-foreground/60 uppercase tracking-[0.3em] group-hover:text-school-primary transition-colors">
            Audit Syllabus Hub
        </p>
        <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:translate-x-1 group-hover:text-school-primary transition-all" />
      </div>
    </Card>
  );
}

// ── Curriculum Hub View (Rule 15/19/21) ──────────────────────────────────────

interface CurriculumViewProps {
  subject: GradeSubjectHub;
  classTeacherName: string;
  onBack: () => void;
}

function CurriculumView({ subject: gs, classTeacherName, onBack }: CurriculumViewProps) {
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const router = useRouter();

  const termMap = useMemo(() => {
    const map: Record<number, TopicHub[]> = { 1: [], 2: [], 3: [] };
    gs.topics?.forEach((t) => {
      const idx = t.term?.index || 1;
      if (map[idx]) map[idx].push(t);
    });
    return map;
  }, [gs.topics]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-700">
      <button 
        onClick={onBack} 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground uppercase font-extrabold text-[10px] tracking-widest transition-all group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Terminal Hub
      </button>

      <Card className="bg-card border-border rounded-[2rem] overflow-hidden shadow-2xl">
        <CardHeader className="bg-surface/50 p-8 md:p-12 border-b border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                        {gs.subject.name}
                    </h2>
                    <div className="flex items-center gap-3">
                        <Target className="h-4 w-4 text-school-primary" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            Instructor Context: {classTeacherName}
                        </p>
                    </div>
                </div>
                
                {/* ── TERM SWITCHER (Rule 21) ── */}
                <div className="flex bg-surface p-1.5 rounded-2xl border border-border shadow-inner w-fit">
                    {[1, 2, 3].map(idx => (
                        <button
                            key={idx}
                            onClick={() => setSelectedTerm(idx)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all",
                                selectedTerm === idx 
                                    ? "bg-school-primary text-on-school-primary shadow-lg border-school-primary" 
                                    : "bg-card border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Term 0{idx}
                        </button>
                    ))}
                </div>
            </div>
        </CardHeader>

        <div className="p-8 md:p-12 grid gap-4 grid-cols-1 md:grid-cols-2">
          {termMap[selectedTerm].length === 0 ? (
            <div className="col-span-full py-24 text-center opacity-30">
              <p className="text-sm font-extrabold text-muted-foreground uppercase italic tracking-widest">
                Academic roadmap offline for this timeline.
              </p>
            </div>
          ) : (
            termMap[selectedTerm].map((topic, i) => (
              <div
                key={topic.id}
                onClick={() => router.push(`/student/lessons/${topic.id}`)}
                className="flex items-center gap-6 p-6 rounded-[1.5rem] bg-surface border border-border cursor-pointer hover:border-school-primary-300 hover:shadow-lg transition-all group shadow-sm"
              >
                <div className="h-10 w-10 bg-card border border-border rounded-xl flex items-center justify-center text-xs font-extrabold text-muted-foreground group-hover:text-school-primary group-hover:border-school-primary-50 transition-all tabular-nums">
                  {topic.weekNumber || i + 1}
                </div>
                <p className="flex-1 text-sm font-bold text-foreground/80 uppercase italic tracking-tight group-hover:text-foreground transition-colors">
                    {topic.title}
                </p>
                <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-school-primary group-hover:translate-x-1 transition-all" />
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}