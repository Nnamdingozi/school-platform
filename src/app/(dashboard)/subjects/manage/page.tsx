


// import { redirect } from "next/navigation";
// import { prisma } from "@/lib/prisma";
// import { createClient } from "@/lib/supabase/server"; // ✅ Import your server client
// import { ManageSubjectsClient } from "@/components/subjects/manage-subjects-client";
// import { Role, Prisma } from "@prisma/client";

// // ✅ Type for searchParams in Next.js 15
// type PageProps = {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// };

// type GradeSubjectWithRelations = Prisma.GradeSubjectGetPayload<{
//   include: {
//     grade: true;
//     subject: true;
//     selectedByUsers: {
//       select: { id: true };
//     };
//   };
// }>;

// export default async function ManageSubjectsPage({ searchParams }: PageProps) {
//   // 1. Next.js 15: Unwrap Search Params
//   const params = await searchParams;
  
//   // 2. Authenticate User via Supabase
//   const supabase = await createClient();
//   const { data: { user: authUser }, error } = await supabase.auth.getUser();

//   if (error || !authUser) {
//     redirect("/login");
//   }

//   // 3. Fetch Profile from Database
//   const profile = await prisma.profile.findUnique({
//     where: { email: authUser.email },
//     include: {
//         // Include enrollments to find the student's current grade
//         classEnrollments: {
//             include: {
//                 class: true
//             }
//         }
//     }
//   });

//   if (!profile) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
//         <div className="text-center bg-slate-900 border border-white/5 p-10 rounded-[2.5rem]">
//           <p className="text-slate-400 italic">User profile not found in institutional registry.</p>
//         </div>
//       </div>
//     );
//   }

//   let gradeSubjects: GradeSubjectWithRelations[] = [];

//   // 4. Logic based on User Role
//   if (profile.role === Role.STUDENT) {
//     // Determine which grade to show subjects for
//     // Priority: 1. Their current class, 2. Default to level 7
//     const currentGradeId = profile.classEnrollments[0]?.class?.gradeId;

//     gradeSubjects = await prisma.gradeSubject.findMany({
//       where: {
//         // If they are in a class, show those subjects. 
//         // Otherwise, show all subjects for their curriculum
//         ...(currentGradeId ? { gradeId: currentGradeId } : { grade: { curriculumId: profile.curriculumId } }),
//         OR: [
//             { schoolId: profile.schoolId },
//             { schoolId: null }
//         ]
//       },
//       include: {
//         grade: true,
//         subject: true,
//         selectedByUsers: {
//           where: { id: profile.id },
//           select: { id: true },
//         },
//       },
//       orderBy: { subject: { name: "asc" } },
//     });
//   } else {
//     // Teacher Logic: Show all subjects available in the school
//     gradeSubjects = await prisma.gradeSubject.findMany({
//       where: {
//         OR: [
//             { schoolId: profile.schoolId },
//             { schoolId: null }
//         ],
//         // Ensure we stay within the correct curriculum
//         grade: { curriculumId: profile.curriculumId }
//       },
//       include: {
//         grade: true,
//         subject: true,
//         selectedByUsers: {
//           where: { id: profile.id },
//           select: { id: true },
//         },
//       },
//       orderBy: [
//         { grade: { level: 'asc' } },
//         { subject: { name: 'asc' } }
//       ]
//     });
//   }

//   // 5. Format for Client Component
//   const subjects = gradeSubjects.map((gs) => ({
//     id: gs.id,
//     gradeName: gs.grade.displayName,
//     subjectName: gs.subject.name,
//     isSelected: gs.selectedByUsers.length > 0,
//   }));

//   return (
//     <main className="min-h-screen bg-slate-950 px-4 py-8 md:px-12 md:py-12">
//       <div className="max-w-5xl mx-auto space-y-8">
//         <header className="border-b border-white/5 pb-8">
//             <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Registry Management</h1>
//             <p className="text-slate-500 text-sm mt-2">
//                 Configure your active subjects for the {profile.role.toLowerCase()} dashboard.
//             </p>
//         </header>

//         <ManageSubjectsClient
//           userId={profile.id}
//           userRole={profile.role}
//           subjects={subjects}
//         />
//       </div>
//     </main>
//   );
// }


// "use client";

// import { useEffect, useState, useTransition, useMemo } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { getAllSubjectsWithOwnership, claimSubjectAction, releaseSubjectAction } from "@/app/actions/subject-claim";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { 
//   Loader2, Lock, BookOpen, Trash2, 
//   ShieldCheck, Search, X, FilterX 
// } from "lucide-react";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";

// export default function SubjectSelectionPage() {
//   const { profile } = useProfileStore();
//   const [subjects, setSubjects] = useState<any[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [isPending, startTransition] = useTransition();

//   const load = async () => {
//     if (profile?.schoolId) {
//       const data = await getAllSubjectsWithOwnership(profile.schoolId);
//       setSubjects(data);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => { load(); }, [profile, load]);

//   // ── Search Logic (Client-side for instant feedback) ──
//   const filteredSubjects = useMemo(() => {
//     return subjects.filter((item) => {
//       const searchStr = `${item.subject.name} ${item.grade.displayName}`.toLowerCase();
//       return searchStr.includes(searchQuery.toLowerCase());
//     });
//   }, [subjects, searchQuery]);

//   const handleAction = (id: string, action: 'claim' | 'release') => {
//     if (!profile?.id) return;
//     startTransition(async () => {
//       const res = action === 'claim' 
//         ? await claimSubjectAction(id, profile.id)
//         : await releaseSubjectAction(id);
      
//       if (res.success) {
//         toast.success(action === 'claim' ? "Subject assigned to profile" : "Subject released to pool");
//         load();
//       } else toast.error(res.error);
//     });
//   };

//   if (isLoading) return (
//     <div className="h-screen flex items-center justify-center bg-slate-950">
//       <Loader2 className="animate-spin text-school-primary" />
//     </div>
//   );

//   return (
//     <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-10">
      
//       {/* ── HEADER ── */}
//       <header className="flex flex-col gap-8 border-b border-white/5 pb-10">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//             <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">Syllabus Registry</h1>
//             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-3">Institutional Module Management</p>
//             </div>
//             <div className="bg-slate-900 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-4 shadow-xl">
//                 <ShieldCheck className="text-school-primary h-5 w-5" />
//                 <div>
//                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Active Load</p>
//                     <p className="text-sm font-bold text-white uppercase">{subjects.filter(s => s.profileId === profile?.id).length} Modules</p>
//                 </div>
//             </div>
//         </div>

//         {/* ── SEARCH BAR ── */}
//         <div className="relative max-w-2xl group">
//             <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-school-primary transition-colors" />
//             <input 
//                 type="text"
//                 placeholder="SEARCH BY SUBJECT OR GRADE (E.G. 'BIOLOGY' OR 'JS1')..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full bg-slate-900 border border-white/5 rounded-2xl py-5 pl-14 pr-14 text-sm font-bold uppercase tracking-widest text-white outline-none focus:border-school-primary/50 focus:bg-slate-900/80 transition-all placeholder:text-slate-700 shadow-2xl"
//             />
//             {searchQuery && (
//                 <button 
//                     onClick={() => setSearchQuery("")}
//                     className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
//                 >
//                     <X className="h-4 w-4 text-slate-400" />
//                 </button>
//             )}
//         </div>
//       </header>

//       {/* ── RESULTS GRID ── */}
//       {filteredSubjects.length === 0 ? (
//           <div className="py-32 text-center bg-slate-900/30 rounded-[3rem] border border-dashed border-white/5">
//               <FilterX className="h-12 w-12 text-slate-800 mx-auto mb-4" />
//               <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest">No modules matching your query found in registry.</p>
//           </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredSubjects.map((item) => {
//             const isMine = item.profileId === profile?.id;
//             const isTaken = item.profileId && !isMine;
//             const isAvailable = !item.profileId;

//             return (
//                 <Card key={item.id} className={cn(
//                 "bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl transition-all relative overflow-hidden border",
//                 isMine ? "border-school-primary/40 bg-school-primary/[0.02]" : "border-white/5",
//                 isTaken && "grayscale-[0.8] opacity-50"
//                 )}>
//                 {/* Blurred Overlay for Taken Subjects */}
//                 {isTaken && (
//                     <div className="absolute inset-0 z-20 backdrop-blur-[3px] bg-slate-950/40 flex flex-col items-center justify-center p-6 text-center">
//                     <Lock className="h-8 w-8 text-slate-600 mb-2" />
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned to</p>
//                     <p className="text-sm font-bold text-white uppercase italic truncate max-w-full px-4">
//                         {item.profile?.name || "Another Instructor"}
//                     </p>
//                     </div>
//                 )}

//                 <div className="relative z-10 space-y-6">
//                     <div className="flex justify-between items-center">
//                     <div className={cn("p-3 rounded-2xl", isMine ? "bg-school-primary/20" : "bg-slate-950")}>
//                         <BookOpen className={cn("h-5 w-5", isMine ? "text-school-primary" : "text-slate-700")} />
//                     </div>
//                     {isMine && (
//                         <span className="text-[9px] font-black bg-school-primary text-slate-950 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
//                         Currently Yours
//                         </span>
//                     )}
//                     </div>

//                     <div>
//                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{item.grade.displayName}</p>
//                     <h3 className="text-2xl font-black text-white uppercase italic mt-1 leading-tight">{item.subject.name}</h3>
//                     </div>

//                     <div className="pt-4">
//                     {isAvailable && (
//                         <Button 
//                         onClick={() => handleAction(item.id, 'claim')}
//                         disabled={isPending}
//                         className="w-full bg-slate-950 border border-white/10 text-school-primary hover:bg-school-primary hover:text-slate-950 font-black rounded-2xl py-6 shadow-lg"
//                         >
//                         {isPending ? <Loader2 className="animate-spin" /> : "CLAIM MODULE"}
//                         </Button>
//                     )}

//                     {isMine && (
//                         <Button 
//                         onClick={() => handleAction(item.id, 'release')}
//                         disabled={isPending}
//                         variant="ghost"
//                         className="w-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-black rounded-2xl py-6 border border-red-500/20"
//                         >
//                         {isPending ? <Loader2 className="animate-spin" /> : <><Trash2 className="mr-2 h-4 w-4" /> RELEASE TO POOL</>}
//                         </Button>
//                     )}

//                     {isTaken && (
//                         <Button disabled className="w-full bg-slate-950 border border-white/5 text-slate-800 font-black rounded-2xl py-6 opacity-0">
//                         UNAVAILABLE
//                         </Button>
//                     )}
//                     </div>
//                 </div>
//                 </Card>
//             );
//             })}
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState, useTransition, useMemo, useCallback } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { getAllSubjectsWithOwnership, claimSubjectAction, releaseSubjectAction } from "@/app/actions/subject-claim";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { 
//   Loader2, Lock, BookOpen, Trash2, 
//   ShieldCheck, Search, X, FilterX 
// } from "lucide-react";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface SubjectOwner {
//   id: string;
//   name: string | null;
// }

// interface SubjectWithOwnership {
//   id: string;
//   profileId: string | null;
//   subject: { name: string };
//   grade: { displayName: string };
//   profile: SubjectOwner | null;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function SubjectSelectionPage() {
//   const { profile } = useProfileStore();
  
//   // FIX: Replaced 'any[]' with specific interface
//   const [subjects, setSubjects] = useState<SubjectWithOwnership[]>([]);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isPending, startTransition] = useTransition();

//   // FIX: Wrapped in useCallback to satisfy useEffect dependencies
//   const load = useCallback(async () => {
//     if (profile?.schoolId) {
//       try {
//         const data = await getAllSubjectsWithOwnership(profile.schoolId);
//         setSubjects(data as SubjectWithOwnership[]);
//       } catch (err) {
//         console.error("Failed to load registry:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   }, [profile?.schoolId]);

//   useEffect(() => { 
//     load(); 
//   }, [load]);

//   // ── Search Logic (Client-side for instant feedback) ──
//   const filteredSubjects = useMemo(() => {
//     return subjects.filter((item) => {
//       const searchStr = `${item.subject.name} ${item.grade.displayName}`.toLowerCase();
//       return searchStr.includes(searchQuery.toLowerCase());
//     });
//   }, [subjects, searchQuery]);

//   const handleAction = (id: string, action: 'claim' | 'release') => {
//     if (!profile?.id) return;
//     startTransition(async () => {
//       const res = action === 'claim' 
//         ? await claimSubjectAction(id, profile.id)
//         : await releaseSubjectAction(id);
      
//       if (res.success) {
//         toast.success(action === 'claim' ? "Subject assigned to profile" : "Subject released to pool");
//         load();
//       } else {
//         toast.error(res.error || "Action failed");
//       }
//     });
//   };

//   if (isLoading) return (
//     <div className="h-screen flex items-center justify-center bg-slate-950">
//       <Loader2 className="animate-spin text-school-primary" />
//     </div>
//   );

//   return (
//     <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-10">
      
//       {/* ── HEADER ── */}
//       <header className="flex flex-col gap-8 border-b border-white/5 pb-10">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//             <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">Syllabus Registry</h1>
//             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-3">Institutional Module Management</p>
//             </div>
//             <div className="bg-slate-900 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-4 shadow-xl">
//                 <ShieldCheck className="text-school-primary h-5 w-5" />
//                 <div>
//                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Active Load</p>
//                     <p className="text-sm font-bold text-white uppercase">{subjects.filter(s => s.profileId === profile?.id).length} Modules</p>
//                 </div>
//             </div>
//         </div>

//         {/* ── SEARCH BAR ── */}
//         <div className="relative max-w-2xl group">
//             <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-school-primary transition-colors" />
//             <input 
//                 type="text"
//                 placeholder="SEARCH BY SUBJECT OR GRADE (E.G. 'BIOLOGY' OR 'JS1')..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full bg-slate-900 border border-white/5 rounded-2xl py-5 pl-14 pr-14 text-sm font-bold uppercase tracking-widest text-white outline-none focus:border-school-primary/50 focus:bg-slate-900/80 transition-all placeholder:text-slate-700 shadow-2xl"
//             />
//             {searchQuery && (
//                 <button 
//                     onClick={() => setSearchQuery("")}
//                     className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
//                 >
//                     <X className="h-4 w-4 text-slate-400" />
//                 </button>
//             )}
//         </div>
//       </header>

//       {/* ── RESULTS GRID ── */}
//       {filteredSubjects.length === 0 ? (
//           <div className="py-32 text-center bg-slate-900/30 rounded-[3rem] border border-dashed border-white/5">
//               <FilterX className="h-12 w-12 text-slate-800 mx-auto mb-4" />
//               <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest">No modules matching your query found in registry.</p>
//           </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredSubjects.map((item) => {
//             const isMine = item.profileId === profile?.id;
//             const isTaken = item.profileId && !isMine;
//             const isAvailable = !item.profileId;

//             return (
//                 <Card key={item.id} className={cn(
//                 "bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl transition-all relative overflow-hidden border",
//                 isMine ? "border-school-primary/40 bg-school-primary/[0.02]" : "border-white/5",
//                 isTaken && "grayscale-[0.8] opacity-50"
//                 )}>
//                 {/* Blurred Overlay for Taken Subjects */}
//                 {isTaken && (
//                     <div className="absolute inset-0 z-20 backdrop-blur-[3px] bg-slate-950/40 flex flex-col items-center justify-center p-6 text-center">
//                     <Lock className="h-8 w-8 text-slate-600 mb-2" />
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned to</p>
//                     <p className="text-sm font-bold text-white uppercase italic truncate max-w-full px-4">
//                         {item.profile?.name || "Another Instructor"}
//                     </p>
//                     </div>
//                 )}

//                 <div className="relative z-10 space-y-6">
//                     <div className="flex justify-between items-center">
//                     <div className={cn("p-3 rounded-2xl", isMine ? "bg-school-primary/20" : "bg-slate-950")}>
//                         <BookOpen className={cn("h-5 w-5", isMine ? "text-school-primary" : "text-slate-700")} />
//                     </div>
//                     {isMine && (
//                         <span className="text-[9px] font-black bg-school-primary text-slate-950 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
//                         Currently Yours
//                         </span>
//                     )}
//                     </div>

//                     <div>
//                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{item.grade.displayName}</p>
//                     <h3 className="text-2xl font-black text-white uppercase italic mt-1 leading-tight">{item.subject.name}</h3>
//                     </div>

//                     <div className="pt-4">
//                     {isAvailable && (
//                         <Button 
//                         onClick={() => handleAction(item.id, 'claim')}
//                         disabled={isPending}
//                         className="w-full bg-slate-950 border border-white/10 text-school-primary hover:bg-school-primary hover:text-slate-950 font-black rounded-2xl py-6 shadow-lg"
//                         >
//                         {isPending ? <Loader2 className="animate-spin" /> : "CLAIM MODULE"}
//                         </Button>
//                     )}

//                     {isMine && (
//                         <Button 
//                         onClick={() => handleAction(item.id, 'release')}
//                         disabled={isPending}
//                         variant="ghost"
//                         className="w-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-black rounded-2xl py-6 border border-red-500/20"
//                         >
//                         {isPending ? <Loader2 className="animate-spin" /> : <><Trash2 className="mr-2 h-4 w-4" /> RELEASE TO POOL</>}
//                         </Button>
//                     )}

//                     {isTaken && (
//                         <Button disabled className="w-full bg-slate-950 border border-white/5 text-slate-800 font-black rounded-2xl py-6 opacity-0">
//                         UNAVAILABLE
//                         </Button>
//                     )}
//                     </div>
//                 </div>
//                 </Card>
//             );
//             })}
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState, useTransition, useMemo, useCallback } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { getAllSubjectsWithOwnership, claimSubjectAction, releaseSubjectAction } from "@/app/actions/subject-claim";
// import { selectPersonalSubjects } from "@/app/actions/subject-allocation"; // New action we created
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Loader2, Lock, BookOpen, Trash2, ShieldCheck, Search, X, FilterX, Globe } from "lucide-react";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import { Role } from "@prisma/client";
// import { Badge } from "@/components/ui/badge";

// interface SubjectWithOwnership {
//   id: string;
//   profileId: string | null;
//   subject: { name: string };
//   grade: { displayName: string };
//   profile: { id: string; name: string | null } | null;
// }

// export default function SubjectSelectionPage() {
//   const { profile } = useProfileStore();
//   const [subjects, setSubjects] = useState<SubjectWithOwnership[]>([]);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isPending, startTransition] = useTransition();

//   // Rule 6: UI Identity Check
//   const isIndependent = profile?.role === Role.INDIVIDUAL_LEARNER && !profile?.schoolId;

//   const load = useCallback(async () => {
//     try {
//       // Rule 7: Fetch based on context (SchoolId vs Null)
//       const data = await getAllSubjectsWithOwnership(profile?.schoolId ?? null);
//       setSubjects(data as SubjectWithOwnership[]);
//     } catch (err) {
//       toast.error("Failed to sync registry");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [profile?.schoolId]);

//   useEffect(() => { load(); }, [load]);

//   const handleAction = (id: string, action: 'claim' | 'release') => {
//     if (!profile?.id) return;
//     startTransition(async () => {
//       let res;
      
//       if (isIndependent) {
//           // Rule 6: Use Personal Selection Logic
//           const currentSelection = subjects.filter(s => s.profileId === profile.id).map(s => s.id);
//           const newSelection = action === 'claim' 
//             ? [...currentSelection, id] 
//             : currentSelection.filter(sid => sid !== id);
            
//           res = await selectPersonalSubjects({ userId: profile.id, gradeSubjectIds: newSelection });
//       } else {
//           // Tier 2: Use Institutional Claiming Logic
//           res = action === 'claim' 
//             ? await claimSubjectAction({ gradeSubjectId: id, userId: profile.id, userName: profile.name, userRole: profile.role, schoolId: profile.schoolId })
//             : await releaseSubjectAction({ gradeSubjectId: id, userId: profile.id, userRole: profile.role, schoolId: profile.schoolId });
//       }
      
//       if (res.success) {
//         toast.success(action === 'claim' ? "Library updated" : "Module removed");
//         load();
//       } else {
//         toast.error(res.error || "Action failed");
//       }
//     });
//   };

//   if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-school-primary" /></div>;

//   return (
//     <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-10">
//       <header className="flex flex-col gap-8 border-b border-white/5 pb-10">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//                 <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
//                     {isIndependent ? "Knowledge Discovery" : "Syllabus Registry"}
//                 </h1>
//                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-3">
//                     {isIndependent ? "Build your personal learning roadmap" : "Institutional Module Management"}
//                 </p>
//             </div>
//             <div className="bg-slate-900 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-4 shadow-xl">
//                 {isIndependent ? <Globe className="text-school-primary h-5 w-5" /> : <ShieldCheck className="text-school-primary h-5 w-5" />}
//                 <div>
//                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Modules</p>
//                     <p className="text-sm font-bold text-white uppercase">{subjects.filter(s => s.profileId === profile?.id).length} Active</p>
//                 </div>
//             </div>
//         </div>
//         {/* Search input stays same... */}
//       </header>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {subjects.map((item) => {
//                 const isMine = item.profileId === profile?.id;
//                 const isTaken = !isIndependent && item.profileId && !isMine; // Only block if institutional

//                 return (
//                     <Card key={item.id} className={cn(
//                         "bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl transition-all border",
//                         isMine ? "border-school-primary/40 bg-school-primary/[0.02]" : "border-white/5",
//                         isTaken && "grayscale opacity-50"
//                     )}>
//                         <div className="space-y-6">
//                             <div className="flex justify-between items-center">
//                                 <Badge variant="outline" className="text-[9px] border-white/10 uppercase">{item.grade.displayName}</Badge>
//                                 {isMine && <span className="text-[8px] font-black bg-school-primary text-slate-950 px-2 py-1 rounded-md uppercase">In My Library</span>}
//                             </div>
//                             <h3 className="text-2xl font-black text-white uppercase italic">{item.subject.name}</h3>
//                             <Button 
//                                 onClick={() => handleAction(item.id, isMine ? 'release' : 'claim')}
//                                 disabled={isPending || isTaken}
//                                 className={cn(
//                                     "w-full rounded-2xl py-6 font-black text-xs uppercase transition-all",
//                                     isMine ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-slate-950 text-school-primary border border-white/10"
//                                 )}
//                             >
//                                 {isPending ? <Loader2 className="animate-spin" /> : (isMine ? "Remove Module" : "Add to Library")}
//                             </Button>
//                         </div>
//                     </Card>
//                 )
//             })}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState, useTransition, useMemo, useCallback } from "react";
import { useProfileStore } from "@/store/profileStore";
import { 
  getAllSubjectsWithOwnership, 
  claimSubjectAction, 
  releaseSubjectAction,
} from "@/app/actions/subject-claim";
import { selectPersonalSubjects } from "@/app/actions/subject-allocation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Lock, 
  BookOpen, 
  Trash2, 
  ShieldCheck, 
  Search, 
  X, 
  FilterX, 
  Globe 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

// ── Types ───────────────────────────────────────────────────────────────────

interface SubjectWithOwnership {
  id: string;
  profileId: string | null;
  subject: { name: string };
  grade: { displayName: string };
  profile: { id: string; name: string | null } | null;
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function SubjectSelectionPage() {
  const { profile } = useProfileStore();
  const [subjects, setSubjects] = useState<SubjectWithOwnership[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  // Rule 6: UI Identity Check (Tier 3 vs Tier 2)
  const isIndependent = profile?.role === Role.INDIVIDUAL_LEARNER && !profile?.schoolId;

  const loadRegistry = useCallback(async () => {
    try {
      // Rule 7: Mandatory Query Resolution based on context
      const data = await getAllSubjectsWithOwnership(profile?.schoolId ?? null);
      setSubjects(data as SubjectWithOwnership[]);
    } catch (err: unknown) {
      toast.error("Failed to synchronize subject registry.");
    } finally {
      setIsLoading(false);
    }
  }, [profile?.schoolId]);

  useEffect(() => { 
    loadRegistry(); 
  }, [loadRegistry]);

  // ── Handlers ───────────────────────────────────────────────────────────

  const handleAction = (id: string, action: 'claim' | 'release') => {
    if (!profile?.id) return;

    startTransition(async () => {
      let res;
      
      if (isIndependent) {
          // Tier 3: Rule 6 - Build Personal Library
          const currentSelection = subjects
            .filter(s => s.profileId === profile.id)
            .map(s => s.id);
            
          const newSelection = action === 'claim' 
            ? [...currentSelection, id] 
            : currentSelection.filter(sid => sid !== id);
            
          res = await selectPersonalSubjects({ 
            userId: profile.id, 
            gradeSubjectIds: newSelection 
          });
      } else {
          // Tier 2: Rule 5 - Institutional Claiming
          // ✅ FIX: Using '?? null' to resolve string | null | undefined mismatch
          if (action === 'claim') {
            res = await claimSubjectAction({ 
                gradeSubjectId: id, 
                userId: profile.id, 
                userName: profile.name ?? null, 
                userRole: profile.role, 
                schoolId: profile.schoolId ?? null 
            });
          } else {
            res = await releaseSubjectAction({ 
                gradeSubjectId: id, 
                userId: profile.id, 
                userRole: profile.role, 
                schoolId: profile.schoolId ?? null 
            });
          }
      }
      
      if (res && res.success) {
        toast.success(action === 'claim' ? "Registry updated successfully" : "Module released to pool");
        loadRegistry();
      } else {
        toast.error(res?.error || "Action failed. Access restricted.");
      }
    });
  };

  // ── Search Logic ──
  const filteredSubjects = useMemo(() => {
    return subjects.filter((item) => {
      const searchStr = `${item.subject.name} ${item.grade.displayName}`.toLowerCase();
      return searchStr.includes(searchQuery.toLowerCase());
    });
  }, [subjects, searchQuery]);

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-slate-950">
      <Loader2 className="animate-spin text-school-primary" />
    </div>
  );

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-10">
      
      {/* ── HEADER ── */}
      <header className="flex flex-col gap-8 border-b border-white/5 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
                    {isIndependent ? "Knowledge Discovery" : "Syllabus Registry"}
                </h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-3">
                    {isIndependent ? "Select global curriculum modules for your library" : "Institutional Module Management"}
                </p>
            </div>
            <div className="bg-slate-900 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-4 shadow-xl">
                {isIndependent ? <Globe className="text-school-primary h-5 w-5" /> : <ShieldCheck className="text-school-primary h-5 w-5" />}
                <div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Current Load</p>
                    <p className="text-sm font-bold text-white uppercase">
                        {subjects.filter(s => s.profileId === profile?.id).length} Modules
                    </p>
                </div>
            </div>
        </div>

        {/* ── SEARCH BAR ── */}
        <div className="relative max-w-2xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-school-primary transition-colors" />
            <input 
                type="text"
                placeholder="SEARCH BY SUBJECT OR GRADE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded-2xl py-5 pl-14 pr-14 text-sm font-bold uppercase tracking-widest text-white outline-none focus:border-school-primary/50 transition-all shadow-2xl"
            />
            {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full">
                    <X className="h-4 w-4 text-slate-400" />
                </button>
            )}
        </div>
      </header>

      {/* ── RESULTS GRID ── */}
      {filteredSubjects.length === 0 ? (
          <div className="py-32 text-center bg-slate-900/30 rounded-[3rem] border border-dashed border-white/5">
              <FilterX className="h-12 w-12 text-slate-800 mx-auto mb-4" />
              <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest">No modules found in this context.</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSubjects.map((item) => {
                const isMine = item.profileId === profile?.id;
                // Rule 6: Private subjects are 'taken' by others. Global subjects are never 'taken'.
                const isTaken = !isIndependent && item.profileId && !isMine;

                return (
                    <Card key={item.id} className={cn(
                        "bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl transition-all relative overflow-hidden border",
                        isMine ? "border-school-primary/40 bg-school-primary/[0.02]" : "border-white/5",
                        isTaken && "grayscale opacity-50"
                    )}>
                        {isTaken && (
                            <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-slate-950/40 flex flex-col items-center justify-center p-6 text-center">
                                <Lock className="h-8 w-8 text-slate-600 mb-2" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Use By</p>
                                <p className="text-sm font-bold text-white uppercase italic truncate w-full">{item.profile?.name || "Staff"}</p>
                            </div>
                        )}

                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-center">
                                <Badge variant="outline" className="text-[9px] border-white/10 uppercase py-1 px-3">
                                    {item.grade.displayName}
                                </Badge>
                                {isMine && (
                                    <span className="text-[8px] font-black bg-school-primary text-slate-950 px-2 py-1 rounded uppercase tracking-tighter">
                                        In Registry
                                    </span>
                                )}
                            </div>

                            <h3 className="text-2xl font-black text-white uppercase italic leading-tight">
                                {item.subject.name}
                            </h3>

                            <div className="pt-4">
                                <Button 
                                    onClick={() => handleAction(item.id, isMine ? 'release' : 'claim')}
                                    // ✅ FIX: Using !!isTaken to force boolean conversion
                                    disabled={isPending || !!isTaken}
                                    className={cn(
                                        "w-full rounded-2xl py-6 font-black text-xs uppercase transition-all",
                                        isMine 
                                            ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white" 
                                            : "bg-slate-950 text-school-primary border border-white/10 hover:bg-school-primary hover:text-slate-950"
                                    )}
                                >
                                    {isPending ? <Loader2 className="animate-spin" /> : (isMine ? "Release Module" : "Add to Library")}
                                </Button>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
      )}
    </div>
  );
}