// "use client";

// import React, { useState, useTransition, useMemo } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { 
//   claimSubjectAction, 
//   releaseSubjectAction,
//   getAllSubjectsWithOwnership,
//   getIndividualLearnerSubjects,
//   toggleLearnerSubjectLibrary 
// } from "@/app/actions/subject-claim";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { 
//   Loader2, Lock, BookOpen, Trash2, 
//   ShieldCheck, Search, X, FilterX,
//   Library, 
// } from "lucide-react";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import { Role } from "@prisma/client";
// import { Badge } from "@/components/ui/badge";

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface SubjectWithOwnership {
//   id: string; // gradeSubjectId
//   profileId: string | null;
//   subject: { name: string };
//   grade: { displayName: string };
//   profile: { id: string; name: string | null } | null;
// }

// interface SubjectSelectionClientProps {
//     initialSubjects: SubjectWithOwnership[];
// }

// /**
//  * UNIFIED SUBJECT SELECTION (Tier 2 & 3)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function SubjectSelectionClient({ initialSubjects }: SubjectSelectionClientProps) {
//   const { profile } = useProfileStore();
//   const [subjects, setSubjects] = useState<SubjectWithOwnership[]>(initialSubjects);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [isPending, startTransition] = useTransition();

//   // Rules 6 & 13: Tier Identification
//   const isIndependent = profile?.role === Role.INDIVIDUAL_LEARNER && !profile?.schoolId;

//   /**
//    * Rule 11: Refresh system truth after registry mutations with tier branching
//    */
//   const refreshRegistry = async () => {
//     if (!profile?.id) return;

//     if (isIndependent) {
//         const data = await getIndividualLearnerSubjects(profile.id);
//         setSubjects(data as SubjectWithOwnership[]);
//     } else {
//         const data = await getAllSubjectsWithOwnership(profile?.schoolId ?? null);
//         setSubjects(data as SubjectWithOwnership[]);
//     }
//   };

//   const handleAction = (gradeSubjectId: string, action: 'claim' | 'release') => {
//     if (!profile?.id) return;

//     startTransition(async () => {
//       let res;
      
//       if (isIndependent) {
//           // Tier 3 logic: Synchronizing personal library via StudentSubject table
//           res = await toggleLearnerSubjectLibrary({
//             gradeSubjectId,
//             userId: profile.id,
//             action: action === 'claim' ? 'claim' : 'release'
//           });
//       } else {
//           // Tier 2 logic: Institutional module distribution (Rule 5)
//           if (action === 'claim') {
//             res = await claimSubjectAction({ 
//                 gradeSubjectId, 
//                 userId: profile.id, 
//                 userName: profile.name ?? null, 
//                 userRole: profile.role as Role, 
//                 schoolId: profile.schoolId ?? null 
//             });
//           } else {
//             res = await releaseSubjectAction({ 
//                 gradeSubjectId, 
//                 userId: profile.id, 
//                 userRole: profile.role as Role, 
//                 schoolId: profile.schoolId ?? null 
//             });
//           }
//       }
      
//       if (res && res.success) {
//         toast.success(action === 'claim' ? "Hub successfully integrated" : "Module released to registry pool");
//         await refreshRegistry();
//       } else {
//         toast.error(`Registry Protocol Breach: ${res?.error || "Action failed."}`);
//       }
//     });
//   };

//   const filteredSubjects = useMemo(() => {
//     return subjects.filter((item) => {
//       const searchStr = `${item.subject.name} ${item.grade.displayName}`.toLowerCase();
//       return searchStr.includes(searchQuery.toLowerCase());
//     });
//   }, [subjects, searchQuery]);

//   return (
//     <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
//       <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
        
//         {/* ── HEADER (Rule 11/21) ── */}
//         <header className="flex flex-col gap-10 border-b border-border pb-10">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
//               <div className="space-y-2">
//                   <h1 className="text-3xl md:text-5xl font-extrabold uppercase italic tracking-tighter leading-none">
//                       {isIndependent ? "Knowledge Discovery" : "Syllabus Registry"}
//                   </h1>
//                   <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest italic opacity-70">
//                       {isIndependent ? "Add global curriculum modules to your personal hub" : "Manage institutional module distribution matrix"}
//                   </p>
//               </div>
              
//               <div className="bg-surface px-6 py-4 rounded-2xl border border-border flex items-center gap-5 shadow-inner">
//                   <div className="p-2.5 rounded-xl bg-school-primary-50 border border-school-primary-200">
//                     {isIndependent ? <Library className="h-5 w-5 text-school-primary" /> : <ShieldCheck className="h-5 w-5 text-school-primary" />}
//                   </div>
//                   <div>
//                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Active Payload</p>
//                       <p className="text-sm font-extrabold text-foreground uppercase mt-1 italic tabular-nums">
//                           {subjects.filter(s => s.profileId === profile?.id).length} Modules Synced
//                       </p>
//                   </div>
//               </div>
//           </div>

//           <div className="relative max-w-2xl group">
//               <div className="absolute left-5 top-1/2 -translate-y-1/2">
//                 <Search className="h-5 w-5 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
//               </div>
//               <input 
//                   type="text"
//                   placeholder="QUERY BY MODULE OR GRADE LEVEL..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className={cn(
//                     "w-full h-16 pl-14 pr-14 outline-none transition-all",
//                     "bg-surface border border-border rounded-2xl shadow-xl",
//                     "text-xs font-bold uppercase tracking-widest text-foreground placeholder:text-muted-foreground/30",
//                     "focus:ring-2 focus:ring-school-primary-200 focus:border-school-primary"
//                   )}
//               />
//               {searchQuery && (
//                   <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-background rounded-full transition-all text-muted-foreground">
//                       <X className="h-4 w-4" />
//                   </button>
//               )}
//           </div>
//         </header>

//         {/* ── RESULTS GRID (Rule 20) ── */}
//         <main className="w-full">
//           {filteredSubjects.length === 0 ? (
//               <div className="py-32 text-center bg-surface border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center space-y-6">
//                   <FilterX className="h-12 w-12 text-muted-foreground/20" />
//                   <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest italic opacity-60">No matching hubs discovered in this registry context.</p>
//               </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//                 {filteredSubjects.map((item) => {
//                     const isMine = item.profileId === profile?.id;
//                     const isTaken = !isIndependent && item.profileId && !isMine;

//                     return (
//                         <Card 
//                           key={item.id} 
//                           className={cn(
//                             "group relative overflow-hidden transition-all duration-500",
//                             "bg-card border-border rounded-[2rem] shadow-xl",
//                             isMine ? "border-school-primary-200 bg-school-primary-50/20" : "hover:border-school-primary-100",
//                             isTaken && "grayscale-[0.8] opacity-40 pointer-events-none"
//                           )}
//                         >
//                             {isTaken && (
//                                 <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-background/40 flex flex-col items-center justify-center p-6 text-center">
//                                     <div className="p-3 bg-surface border border-border rounded-full shadow-inner mb-3">
//                                       <Lock className="h-6 w-6 text-muted-foreground/40" />
//                                     </div>
//                                     <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Locked Hub</p>
//                                     <p className="text-sm font-extrabold text-foreground uppercase italic truncate w-full px-4">{item.profile?.name || "Administrative Staff"}</p>
//                                 </div>
//                             )}

//                             <CardContent className="p-8 md:p-10 space-y-10 relative z-10">
//                                 <div className="flex justify-between items-center">
//                                     <Badge variant="outline" className="bg-surface border-border text-muted-foreground text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm">
//                                         {item.grade.displayName}
//                                     </Badge>
//                                     {isMine && (
//                                         <div className="h-2.5 w-2.5 rounded-full bg-school-primary animate-pulse shadow-[0_0_10px_rgba(var(--school-primary-raw),0.5)]" />
//                                     )}
//                                 </div>

//                                 <div className="space-y-2">
//                                   <h3 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter leading-tight group-hover:text-school-primary transition-colors">
//                                       {item.subject.name}
//                                   </h3>
//                                   {isMine && (
//                                     <p className="text-[9px] font-bold text-school-primary uppercase tracking-widest">Synchronized to Profile</p>
//                                   )}
//                                 </div>

//                                 <div className="pt-6">
//                                 <Button 
//     onClick={() => handleAction(item.id, isMine ? 'release' : 'claim')}
//     disabled={isPending || !!isTaken}
//     className={cn(
//         "w-full h-14 rounded-2xl font-extrabold text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95",
//         isMine 
//             ? "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white" 
//             : "bg-school-primary text-on-school-primary hover:brightness-110 shadow-school-primary-200"
//     )}
// >
//     {isPending ? (
//       <Loader2 className="animate-spin h-4 w-4" />
//     ) : (
//       <div className="flex items-center gap-2">
//         {isMine ? <Trash2 className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
//         {isMine 
//           ? (isIndependent ? "Remove from Library" : "Purge from Hub") 
//           : "Add to Library"
//         }
//       </div>
//     )}
// </Button>
//                                 </div>
//                             </CardContent>

//                             {isMine && (
//                               <div className="h-1 w-full bg-school-primary absolute bottom-0 left-0" />
//                             )}
//                         </Card>
//                     );
//                 })}
//             </div>
//           )}
//         </main>
        
//         <div className="pt-12 flex justify-center items-center gap-3 opacity-30 grayscale hover:opacity-100 transition-all duration-700">
//             <ShieldCheck className="h-4 w-4" />
//             <p className="text-[8px] font-bold uppercase tracking-[0.4em]">Institutional_Governance_Protocol_v4.2</p>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import React, { useState, useTransition, useMemo } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { 
//   claimSubjectAction, 
//   releaseSubjectAction,
//   getAllSubjectsWithOwnership,
//   getIndividualLearnerSubjects,
//   toggleLearnerSubjectLibrary 
// } from "@/app/actions/subject-claim";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { 
//   Loader2, Lock, BookOpen, Trash2, 
//   ShieldCheck, Search, X, FilterX,
//   Library, 
// } from "lucide-react";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import { Role } from "@prisma/client";
// import { Badge } from "@/components/ui/badge";

// interface SubjectWithOwnership {
//   id: string; // gradeSubjectId
//   profileId: string | null;
//   subject: { name: string };
//   grade: { displayName: string };
//   profile: { id: string; name: string | null } | null;
// }

// interface SubjectSelectionClientProps {
//     initialSubjects: SubjectWithOwnership[];
// }

// export function SubjectSelectionClient({ initialSubjects }: SubjectSelectionClientProps) {
//   const { profile } = useProfileStore();
//   const [subjects, setSubjects] = useState<SubjectWithOwnership[]>(initialSubjects);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [isPending, startTransition] = useTransition();

//   const isIndependent = profile?.role === Role.INDIVIDUAL_LEARNER && !profile?.schoolId;

//   /**
//    * ── PRECISE OWNERSHIP SEEDING ─────────────────────────────────────────────
//    * Only mark items as "mine" if their profileId explicitly matches the student's 
//    * ID (for institutional registry) or if they are fetched as active personal library items.
//    */
//   const [syncedIds, setSyncedIds] = useState<string[]>(() => {
//     return initialSubjects
//       .filter(s => s.profileId === profile?.id)
//       .map(s => s.id);
//   });

//   const refreshRegistry = async () => {
//     if (!profile?.id) return;

//     if (isIndependent) {
//         const data = await getIndividualLearnerSubjects(profile.id);
//         setSubjects(data as SubjectWithOwnership[]);
//         // Explicitly map only the returned records belonging to this student's library
//         setSyncedIds((data as SubjectWithOwnership[]).map(s => s.id));
//     } else {
//         const data = await getAllSubjectsWithOwnership(profile?.schoolId ?? null);
//         setSubjects(data as SubjectWithOwnership[]);
//         setSyncedIds((data as SubjectWithOwnership[]).filter(s => s.profileId === profile?.id).map(s => s.id));
//     }
//   };

//   const handleAction = (gradeSubjectId: string, isMine: boolean) => {
//     if (!profile?.id) return;
//     const action = isMine ? 'release' : 'claim';

//     startTransition(async () => {
//       let res;
      
//       if (isIndependent) {
//           res = await toggleLearnerSubjectLibrary({
//             gradeSubjectId,
//             userId: profile.id,
//             action
//           });
//       } else {
//           if (action === 'claim') {
//             res = await claimSubjectAction({ 
//                 gradeSubjectId, 
//                 userId: profile.id, 
//                 userName: profile.name ?? null, 
//                 userRole: profile.role as Role, 
//                 schoolId: profile.schoolId ?? null 
//             });
//           } else {
//             res = await releaseSubjectAction({ 
//                 gradeSubjectId, 
//                 userId: profile.id, 
//                 userRole: profile.role as Role, 
//                 schoolId: profile.schoolId ?? null 
//             });
//           }
//       }
      
//       if (res && res.success) {
//         toast.success(action === 'claim' ? "Hub successfully integrated" : "Module released to registry pool");
        
//         // Update local synced IDs accurately
//         setSyncedIds(prev => 
//           action === 'claim' 
//             ? Array.from(new Set([...prev, gradeSubjectId]))
//             : prev.filter(id => id !== gradeSubjectId)
//         );
        
//         await refreshRegistry();
//       } else {
//         toast.error(`Registry Protocol Breach: ${res?.error || "Action failed."}`);
//       }
//     });
//   };

//   const filteredSubjects = useMemo(() => {
//     return subjects.filter((item) => {
//       const searchStr = `${item.subject.name} ${item.grade.displayName}`.toLowerCase();
//       return searchStr.includes(searchQuery.toLowerCase());
//     });
//   }, [subjects, searchQuery]);

//   return (
//     <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
//       <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
        
//         <header className="flex flex-col gap-10 border-b border-border pb-10">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
//               <div className="space-y-2">
//                   <h1 className="text-3xl md:text-5xl font-extrabold uppercase italic tracking-tighter leading-none">
//                       {isIndependent ? "Knowledge Discovery" : "Syllabus Registry"}
//                   </h1>
//                   <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest italic opacity-70">
//                       {isIndependent ? "Add global curriculum modules to your personal hub" : "Manage institutional module distribution matrix"}
//                   </p>
//               </div>
              
//               <div className="bg-surface px-6 py-4 rounded-2xl border border-border flex items-center gap-5 shadow-inner">
//                   <div className="p-2.5 rounded-xl bg-school-primary-50 border border-school-primary-200">
//                     {isIndependent ? <Library className="h-5 w-5 text-school-primary" /> : <ShieldCheck className="h-5 w-5 text-school-primary" />}
//                   </div>
//                   <div>
//                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Active Payload</p>
//                       <p className="text-sm font-extrabold text-foreground uppercase mt-1 italic tabular-nums">
//                           {syncedIds.length} Modules Synced
//                       </p>
//                   </div>
//               </div>
//           </div>

//           <div className="relative max-w-2xl group">
//               <div className="absolute left-5 top-1/2 -translate-y-1/2">
//                 <Search className="h-5 w-5 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
//               </div>
//               <input 
//                   type="text"
//                   placeholder="QUERY BY MODULE OR GRADE LEVEL..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className={cn(
//                     "w-full h-16 pl-14 pr-14 outline-none transition-all",
//                     "bg-surface border border-border rounded-2xl shadow-xl",
//                     "text-xs font-bold uppercase tracking-widest text-foreground placeholder:text-muted-foreground/30",
//                     "focus:ring-2 focus:ring-school-primary-200 focus:border-school-primary"
//                   )}
//               />
//               {searchQuery && (
//                   <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-background rounded-full transition-all text-muted-foreground">
//                       <X className="h-4 w-4" />
//                   </button>
//               )}
//           </div>
//         </header>

//         <main className="w-full">
//           {filteredSubjects.length === 0 ? (
//               <div className="py-32 text-center bg-surface border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center space-y-6">
//                   <FilterX className="h-12 w-12 text-muted-foreground/20" />
//                   <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest italic opacity-60">No matching hubs discovered in this registry context.</p>
//               </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//                 {filteredSubjects.map((item) => {
//                     // ── Strict Ownership Evaluation ─────────────────────────
//                     // An item is only "mine" if its ID is explicitly found in syncedIds
//                     const isMine = syncedIds.includes(item.id);
//                     const isTaken = !isIndependent && item.profileId && !isMine;

//                     return (
//                         <Card 
//                           key={item.id} 
//                           className={cn(
//                             "group relative overflow-hidden transition-all duration-500",
//                             "bg-card border-border rounded-[2rem] shadow-xl",
//                             isMine ? "border-school-primary-200 bg-school-primary-50/20" : "hover:border-school-primary-100",
//                             isTaken && "grayscale-[0.8] opacity-40 pointer-events-none"
//                           )}
//                         >
//                             {isTaken && (
//                                 <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-background/40 flex flex-col items-center justify-center p-6 text-center">
//                                     <div className="p-3 bg-surface border border-border rounded-full shadow-inner mb-3">
//                                       <Lock className="h-6 w-6 text-muted-foreground/40" />
//                                     </div>
//                                     <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Locked Hub</p>
//                                     <p className="text-sm font-extrabold text-foreground uppercase italic truncate w-full px-4">{item.profile?.name || "Administrative Staff"}</p>
//                                 </div>
//                             )}

//                             <CardContent className="p-8 md:p-10 space-y-10 relative z-10">
//                                 <div className="flex justify-between items-center">
//                                     <Badge variant="outline" className="bg-surface border-border text-muted-foreground text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm">
//                                         {item.grade.displayName}
//                                     </Badge>
//                                     {isMine && (
//                                         <div className="h-2.5 w-2.5 rounded-full bg-school-primary animate-pulse shadow-[0_0_10px_rgba(var(--school-primary-raw),0.5)]" />
//                                     )}
//                                 </div>

//                                 <div className="space-y-2">
//                                   <h3 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter leading-tight group-hover:text-school-primary transition-colors">
//                                       {item.subject.name}
//                                   </h3>
//                                   {isMine && (
//                                     <p className="text-[9px] font-bold text-school-primary uppercase tracking-widest">Synchronized to Profile</p>
//                                   )}
//                                 </div>

//                                 <div className="pt-6">
//                                     <Button 
//                                         onClick={() => handleAction(item.id, isMine)}
//                                         disabled={isPending || !!isTaken}
//                                         className={cn(
//                                             "w-full h-14 rounded-2xl font-extrabold text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95",
//                                             isMine 
//                                                 ? "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white" 
//                                                 : "bg-school-primary text-on-school-primary hover:brightness-110 shadow-school-primary-200"
//                                         )}
//                                     >
//                                         {isPending ? (
//                                           <Loader2 className="animate-spin h-4 w-4" />
//                                         ) : (
//                                           <div className="flex items-center gap-2">
//                                             {isMine ? <Trash2 className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
//                                             {isMine 
//                                               ? (isIndependent ? "Remove from Library" : "Purge from Hub") 
//                                               : "Add to Library"
//                                             }
//                                           </div>
//                                         )}
//                                     </Button>
//                                 </div>
//                             </CardContent>

//                             {isMine && (
//                               <div className="h-1 w-full bg-school-primary absolute bottom-0 left-0" />
//                             )}
//                         </Card>
//                     );
//                 })}
//             </div>
//           )}
//         </main>
        
//         <div className="pt-12 flex justify-center items-center gap-3 opacity-30 grayscale hover:opacity-100 transition-all duration-700">
//             <ShieldCheck className="h-4 w-4" />
//             <p className="text-[8px] font-bold uppercase tracking-[0.4em]">Institutional_Governance_Protocol_v4.2</p>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useState, useTransition, useMemo } from "react";
import { useProfileStore } from "@/store/profileStore";
import { 
  claimSubjectAction, 
  releaseSubjectAction,
  getAllSubjectsWithOwnership,
  getIndividualLearnerSubjects,
  toggleLearnerSubjectLibrary 
} from "@/app/actions/subject-claim";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, Lock, BookOpen, Trash2, 
  ShieldCheck, Search, X, FilterX,
  Library, 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

interface SubjectWithOwnership {
  id: string; // gradeSubjectId
  profileId: string | null;
  subject: { name: string };
  grade: { displayName: string };
  profile: { id: string; name: string | null } | null;
  isAdded?: boolean; // 👈 Individual property flag for bulletproof per-card rendering
}

interface SubjectSelectionClientProps {
    initialSubjects: SubjectWithOwnership[];
}

export function SubjectSelectionClient({ initialSubjects }: SubjectSelectionClientProps) {
  const { profile } = useProfileStore();
  
  // ── Track subjects locally with individual status flags ───────────────────
  const [subjects, setSubjects] = useState<SubjectWithOwnership[]>(() => {
    return initialSubjects.map(sub => ({
      ...sub,
      isAdded: sub.profileId === profile?.id || false
    }));
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const isIndependent = profile?.role === Role.INDIVIDUAL_LEARNER && !profile?.schoolId;

  const refreshRegistry = async () => {
    if (!profile?.id) return;

    if (isIndependent) {
        const data = await getIndividualLearnerSubjects(profile.id);
        const activeIds = new Set((data as SubjectWithOwnership[]).map(s => s.id));
        
        // Update master subjects list while individually flagging ownership per card
        setSubjects(prev => prev.map(item => ({
            ...item,
            isAdded: activeIds.has(item.id)
        })));
    } else {
        const data = await getAllSubjectsWithOwnership(profile?.schoolId ?? null);
        setSubjects((data as SubjectWithOwnership[]).map(item => ({
            ...item,
            isAdded: item.profileId === profile?.id
        })));
    }
  };

  const handleAction = (gradeSubjectId: string, currentIsAdded: boolean) => {
    if (!profile?.id) return;
    const action = currentIsAdded ? 'release' : 'claim';

    startTransition(async () => {
      let res;
      
      if (isIndependent) {
          res = await toggleLearnerSubjectLibrary({
            gradeSubjectId,
            userId: profile.id,
            action
          });
      } else {
          if (action === 'claim') {
            res = await claimSubjectAction({ 
                gradeSubjectId, 
                userId: profile.id, 
                userName: profile.name ?? null, 
                userRole: profile.role as Role, 
                schoolId: profile.schoolId ?? null 
            });
          } else {
            res = await releaseSubjectAction({ 
                gradeSubjectId, 
                userId: profile.id, 
                userRole: profile.role as Role, 
                schoolId: profile.schoolId ?? null 
            });
          }
      }
      
      if (res && res.success) {
        toast.success(action === 'claim' ? "Hub successfully integrated" : "Module released to registry pool");
        
        // ── Optimistic Individual State Toggle (Prevents global re-renders) ──
        setSubjects(prev => prev.map(item => {
          if (item.id === gradeSubjectId) {
            return { ...item, isAdded: action === 'claim' };
          }
          return item;
        }));
        
        await refreshRegistry();
      } else {
        toast.error(`Registry Protocol Breach: ${res?.error || "Action failed."}`);
      }
    });
  };

  const filteredSubjects = useMemo(() => {
    return subjects.filter((item) => {
      const searchStr = `${item.subject.name} ${item.grade.displayName}`.toLowerCase();
      return searchStr.includes(searchQuery.toLowerCase());
    });
  }, [subjects, searchQuery]);

  const totalSyncedCount = useMemo(() => {
    return subjects.filter(s => s.isAdded).length;
  }, [subjects]);

  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
        
        <header className="flex flex-col gap-10 border-b border-border pb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-2">
                  <h1 className="text-3xl md:text-5xl font-extrabold uppercase italic tracking-tighter leading-none">
                      {isIndependent ? "Knowledge Discovery" : "Syllabus Registry"}
                  </h1>
                  <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest italic opacity-70">
                      {isIndependent ? "Add global curriculum modules to your personal hub" : "Manage institutional module distribution matrix"}
                  </p>
              </div>
              
              <div className="bg-surface px-6 py-4 rounded-2xl border border-border flex items-center gap-5 shadow-inner">
                  <div className="p-2.5 rounded-xl bg-school-primary-50 border border-school-primary-200">
                    {isIndependent ? <Library className="h-5 w-5 text-school-primary" /> : <ShieldCheck className="h-5 w-5 text-school-primary" />}
                  </div>
                  <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Active Payload</p>
                      <p className="text-sm font-extrabold text-foreground uppercase mt-1 italic tabular-nums">
                          {totalSyncedCount} Modules Synced
                      </p>
                  </div>
              </div>
          </div>

          <div className="relative max-w-2xl group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
              </div>
              <input 
                  type="text"
                  placeholder="QUERY BY MODULE OR GRADE LEVEL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full h-16 pl-14 pr-14 outline-none transition-all",
                    "bg-surface border border-border rounded-2xl shadow-xl",
                    "text-xs font-bold uppercase tracking-widest text-foreground placeholder:text-muted-foreground/30",
                    "focus:ring-2 focus:ring-school-primary-200 focus:border-school-primary"
                  )}
              />
              {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-background rounded-full transition-all text-muted-foreground">
                      <X className="h-4 w-4" />
                  </button>
              )}
          </div>
        </header>

        <main className="w-full">
          {filteredSubjects.length === 0 ? (
              <div className="py-32 text-center bg-surface border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center space-y-6">
                  <FilterX className="h-12 w-12 text-muted-foreground/20" />
                  <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest italic opacity-60">No matching hubs discovered in this registry context.</p>
              </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredSubjects.map((item) => {
                    const isMine = !!item.isAdded;
                    const isTaken = !isIndependent && item.profileId && !isMine;

                    return (
                        <Card 
                          key={item.id} 
                          className={cn(
                            "group relative overflow-hidden transition-all duration-500",
                            "bg-card border-border rounded-[2rem] shadow-xl",
                            isMine ? "border-school-primary-200 bg-school-primary-50/20" : "hover:border-school-primary-100",
                            isTaken && "grayscale-[0.8] opacity-40 pointer-events-none"
                          )}
                        >
                            {isTaken && (
                                <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-background/40 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="p-3 bg-surface border border-border rounded-full shadow-inner mb-3">
                                      <Lock className="h-6 w-6 text-muted-foreground/40" />
                                    </div>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Locked Hub</p>
                                    <p className="text-sm font-extrabold text-foreground uppercase italic truncate w-full px-4">{item.profile?.name || "Administrative Staff"}</p>
                                </div>
                            )}

                            <CardContent className="p-8 md:p-10 space-y-10 relative z-10">
                                <div className="flex justify-between items-center">
                                    <Badge variant="outline" className="bg-surface border-border text-muted-foreground text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm">
                                        {item.grade.displayName}
                                    </Badge>
                                    {isMine && (
                                        <div className="h-2.5 w-2.5 rounded-full bg-school-primary animate-pulse shadow-[0_0_10px_rgba(var(--school-primary-raw),0.5)]" />
                                    )}
                                </div>

                                <div className="space-y-2">
                                  <h3 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter leading-tight group-hover:text-school-primary transition-colors">
                                      {item.subject.name}
                                  </h3>
                                  {isMine && (
                                    <p className="text-[9px] font-bold text-school-primary uppercase tracking-widest">Synchronized to Profile</p>
                                  )}
                                </div>

                                <div className="pt-6">
                                    <Button 
                                        onClick={() => handleAction(item.id, isMine)}
                                        disabled={isPending || !!isTaken}
                                        className={cn(
                                            "w-full h-14 rounded-2xl font-extrabold text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95",
                                            isMine 
                                                ? "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white" 
                                                : "bg-school-primary text-on-school-primary hover:brightness-110 shadow-school-primary-200"
                                        )}
                                    >
                                        {isPending ? (
                                          <Loader2 className="animate-spin h-4 w-4" />
                                        ) : (
                                          <div className="flex items-center gap-2">
                                            {isMine ? <Trash2 className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                                            {isMine 
                                              ? (isIndependent ? "Remove from Library" : "Purge from Hub") 
                                              : "Add to Library"
                                            }
                                          </div>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>

                            {isMine && (
                              <div className="h-1 w-full bg-school-primary absolute bottom-0 left-0" />
                            )}
                        </Card>
                    );
                })}
            </div>
          )}
        </main>
        
        <div className="pt-12 flex justify-center items-center gap-3 opacity-30 grayscale hover:opacity-100 transition-all duration-700">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-[8px] font-bold uppercase tracking-[0.4em]">Institutional_Governance_Protocol_v4.2</p>
        </div>
      </div>
    </div>
  );
}