// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Card } from "../ui/card";
// import { Badge } from "../ui/badge";
// import { UserCheck, Users} from "lucide-react";

// export function StudentClassView({ data }: { data: any }) {
//   if (!data) return <div>You are not currently enrolled in a class.</div>;

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//       {/* Left Column: Class Info & My Subjects */}
//       <div className="lg:col-span-1 space-y-6">
//         <Card className="bg-school-primary text-white p-8 rounded-[2rem] shadow-xl">
//           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Your Class</h2>
//           <p className="text-3xl font-black italic uppercase mt-2">{data.name}</p>
//           <div className="mt-6 flex items-center gap-3">
//             <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
//               <UserCheck className="h-5 w-5" />
//             </div>
//             <div>
//               <p className="text-[10px] font-bold opacity-70 uppercase">Class Teacher</p>
//               <p className="font-bold">{data.teacher.name}</p>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6 rounded-[2rem] border-slate-200 dark:border-slate-800">
//           <h3 className="text-xs font-black uppercase text-slate-500 mb-4 tracking-widest">My Registered Subjects</h3>
//           <div className="flex flex-wrap gap-2">
//             {data.mySubjects.map((sub: string) => (
//               <Badge key={sub} variant="outline" className="px-3 py-1 rounded-lg border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
//                 {sub}
//               </Badge>
//             ))}
//           </div>
//         </Card>
//       </div>

//       {/* Right Column: Classmates List */}
//       <div className="lg:col-span-2">
//         <Card className="p-8 rounded-[2rem] border-slate-200 dark:border-slate-800 h-full">
//           <div className="flex items-center justify-between mb-8">
//             <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">Classmates ({data.classmates.length})</h3>
//             <Users className="h-4 w-4 text-slate-300" />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {data.classmates.map((student: any) => (
//               <div key={student.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-transparent hover:border-school-primary/20 transition-all">
//                 <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800">
//                   <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-[10px] font-bold">
//                     {student.name.substring(0, 2).toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>
//                 <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight truncate">
//                   {student.name}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }


// "use client"

// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Card } from "../ui/card";
// import { Badge } from "../ui/badge";
// import { UserCheck, Users, School, BookOpen } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface StudentClassViewProps {
//   data: {
//     name: string; // Physical class name e.g. SS1 Silver
//     teacher: {
//       name: string | null;
//     } | null;
//     classmates: Array<{
//       id: string;
//       name: string;
//     }>;
//     mySubjects: string[]; // Array of subject names
//   } | null;
// }

// export function StudentClassView({ data }: StudentClassViewProps) {
//   // ── 1. UNASSIGNED STATE ──
//   if (!data) {
//     return (
//       <div className="py-20 text-center bg-slate-900/50 rounded-[3rem] border border-dashed border-white/5">
//         <School className="h-12 w-12 text-slate-800 mx-auto mb-4" />
//         <h3 className="text-xl font-black text-white uppercase italic">Registry Unlinked</h3>
//         <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">
//           No classroom assignment found in the database.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      
//       {/* ── LEFT COLUMN: CLASS IDENTITY ── */}
//       <div className="lg:col-span-1 space-y-6">
//         {/* Main Class Card */}
//         <Card className="bg-school-primary border-none p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
//           {/* Decorative Pattern */}
//           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
//              <School className="h-20 w-20 text-slate-950" />
//           </div>

//           <div className="relative z-10">
//             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-950/60">
//               Assigned Registry
//             </h2>
//             <p className="text-4xl font-black text-slate-950 italic uppercase tracking-tighter mt-2">
//               {data.name}
//             </p>
            
//             <div className="mt-10 flex items-center gap-4 bg-slate-950/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
//               <div className="h-12 w-12 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg">
//                 <UserCheck className="h-6 w-6 text-school-primary" />
//               </div>
//               <div>
//                 <p className="text-[9px] font-black text-slate-950/70 uppercase tracking-widest">
//                   Class Teacher
//                 </p>
//                 <p className="font-black text-slate-950 uppercase italic text-sm">
//                   {data.teacher?.name || "Registry Pending"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Registered Subjects Card */}
//         <Card className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-xl">
//           <div className="flex items-center gap-3 mb-6">
//             <BookOpen className="h-4 w-4 text-school-primary" />
//             <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Registered Modules</h3>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {data.mySubjects.length === 0 ? (
//                 <p className="text-[10px] text-slate-600 italic uppercase">No subjects registered</p>
//             ) : (
//                 data.mySubjects.map((sub: string) => (
//                   <Badge 
//                     key={sub} 
//                     variant="outline" 
//                     className="px-4 py-2 rounded-xl border-white/5 bg-slate-950 text-slate-300 text-[10px] font-bold uppercase tracking-wider hover:border-school-primary/30 transition-all"
//                   >
//                     {sub}
//                   </Badge>
//                 ))
//             )}
//           </div>
//         </Card>
//       </div>

//       {/* ── RIGHT COLUMN: CLASSMATES LIST ── */}
//       <div className="lg:col-span-2">
//         <Card className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-xl h-full">
//           <div className="flex items-center justify-between mb-10">
//             <div>
//                 <h3 className="text-sm font-black uppercase text-white italic tracking-widest">
//                   Peer Registry
//                 </h3>
//                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">
//                   {data.classmates.length} Students Assigned
//                 </p>
//             </div>
//             <div className="h-10 w-10 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-center">
//                 <Users className="h-5 w-5 text-slate-600" />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {data.classmates.length === 0 ? (
//                <p className="col-span-full text-center py-10 text-slate-700 text-xs font-bold uppercase">No other students enrolled</p>
//             ) : (
//                 data.classmates.map((student: any) => (
//                   <div 
//                     key={student.id} 
//                     className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950 border border-white/5 hover:border-school-primary/20 transition-all group cursor-default"
//                   >
//                     <Avatar className="h-10 w-10 border-2 border-slate-900 shadow-xl ring-2 ring-white/5 group-hover:ring-school-primary/20 transition-all">
//                       <AvatarFallback className="bg-slate-900 text-school-primary text-[10px] font-black uppercase">
//                         {student.name.substring(0, 2)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <p className="text-sm font-black text-slate-300 group-hover:text-white uppercase italic tracking-tight truncate">
//                       {student.name}
//                     </p>
//                   </div>
//                 ))
//             )}
//           </div>
//         </Card>
//       </div>

//     </div>
//   );
// }


// "use client"

// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Card } from "../ui/card";
// import { Badge } from "../ui/badge";
// import { UserCheck, Users, School, BookOpen } from "lucide-react";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface Classmate {
//   id: string;
//   name: string;
// }

// interface StudentClassViewProps {
//   data: {
//     name: string; // Physical class name e.g. SS1 Silver
//     teacher: {
//       name: string | null;
//     } | null;
//     classmates: Classmate[];
//     mySubjects: string[]; // Array of subject names
//   } | null;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function StudentClassView({ data }: StudentClassViewProps) {
//   // ── 1. UNASSIGNED STATE ──
//   if (!data) {
//     return (
//       <div className="py-20 text-center bg-slate-900/50 rounded-[3rem] border border-dashed border-white/5">
//         <School className="h-12 w-12 text-slate-800 mx-auto mb-4" />
//         <h3 className="text-xl font-black text-white uppercase italic">Registry Unlinked</h3>
//         <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">
//           No classroom assignment found in the database.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      
//       {/* ── LEFT COLUMN: CLASS IDENTITY ── */}
//       <div className="lg:col-span-1 space-y-6">
//         {/* Main Class Card */}
//         <Card className="bg-school-primary border-none p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group text-slate-950">
//           {/* Decorative Pattern */}
//           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
//              <School className="h-20 w-20 fill-current" />
//           </div>

//           <div className="relative z-10">
//             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
//               Assigned Registry
//             </h2>
//             <p className="text-4xl font-black italic uppercase tracking-tighter mt-2">
//               {data.name}
//             </p>
            
//             <div className="mt-10 flex items-center gap-4 bg-slate-950/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
//               <div className="h-12 w-12 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg">
//                 <UserCheck className="h-6 w-6 text-school-primary" />
//               </div>
//               <div>
//                 <p className="text-[9px] font-black opacity-70 uppercase tracking-widest">
//                   Class Teacher
//                 </p>
//                 <p className="font-black uppercase italic text-sm">
//                   {data.teacher?.name || "Registry Pending"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Registered Subjects Card */}
//         <Card className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-xl">
//           <div className="flex items-center gap-3 mb-6">
//             <BookOpen className="h-4 w-4 text-school-primary" />
//             <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Registered Modules</h3>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {data.mySubjects.length === 0 ? (
//                 <p className="text-[10px] text-slate-600 italic uppercase">No subjects registered</p>
//             ) : (
//                 data.mySubjects.map((sub: string) => (
//                   <Badge 
//                     key={sub} 
//                     variant="outline" 
//                     className="px-4 py-2 rounded-xl border-white/5 bg-slate-950 text-slate-300 text-[10px] font-bold uppercase tracking-wider hover:border-school-primary/30 transition-all"
//                   >
//                     {sub}
//                   </Badge>
//                 ))
//             )}
//           </div>
//         </Card>
//       </div>

//       {/* ── RIGHT COLUMN: CLASSMATES LIST ── */}
//       <div className="lg:col-span-2">
//         <Card className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-xl h-full">
//           <div className="flex items-center justify-between mb-10">
//             <div>
//                 <h3 className="text-sm font-black uppercase text-white italic tracking-widest">
//                   Peer Registry
//                 </h3>
//                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">
//                   {data.classmates.length} Students Assigned
//                 </p>
//             </div>
//             <div className="h-10 w-10 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-center">
//                 <Users className="h-5 w-5 text-slate-600" />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {data.classmates.length === 0 ? (
//                <p className="col-span-full text-center py-10 text-slate-700 text-xs font-bold uppercase">No other students enrolled</p>
//             ) : (
//                 // FIX: Changed student: any to student: Classmate
//                 data.classmates.map((student: Classmate) => (
//                   <div 
//                     key={student.id} 
//                     className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950 border border-white/5 hover:border-school-primary/20 transition-all group cursor-default"
//                   >
//                     <Avatar className="h-10 w-10 border-2 border-slate-900 shadow-xl ring-2 ring-white/5 group-hover:ring-school-primary/20 transition-all">
//                       <AvatarFallback className="bg-slate-900 text-school-primary text-[10px] font-black uppercase">
//                         {student.name.substring(0, 2)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <p className="text-sm font-black text-slate-300 group-hover:text-white uppercase italic tracking-tight truncate">
//                       {student.name}
//                     </p>
//                   </div>
//                 ))
//             )}
//           </div>
//         </Card>
//       </div>

//     </div>
//   );
// }




// "use client";

// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Card } from "../ui/card";
// import { Badge } from "../ui/badge";
// import { UserCheck, Users, School, BookOpen } from "lucide-react";

// // ── Types ───────────────────────────────────────────────────────────────────

// /**
//  * Peer identity within a classroom.
//  * Rule 5: Peer visibility is restricted to the specific classroom scope.
//  */
// export interface Classmate {
//   id: string;
//   name: string | null;
// }

// /**
//  * Comprehensive classroom state for a student.
//  * Rule 11: Represents the database truth for institutional placement.
//  */
// export interface StudentClassRegistryData {
//   name: string; // e.g., "SSS1 Silver"
//   teacher: {
//     name: string | null;
//   } | null;
//   classmates: Classmate[];
//   mySubjects: string[]; 
// }

// interface StudentClassViewProps {
//   data: StudentClassRegistryData | null;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * INSTITUTIONAL CLASSROOM VIEW (Tier 2)
//  * This component is intended for school-registered students only.
//  */
// export function StudentClassView({ data }: StudentClassViewProps) {
  
//   // ── 1. UNASSIGNED / EMPTY STATE ──
//   // Rule 6: Handled by showing a fallback if no institutional link exists.
//   if (!data) {
//     return (
//       <div className="py-20 text-center bg-slate-900/50 rounded-[3rem] border border-dashed border-white/5">
//         <div className="h-16 w-16 bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
//             <School className="h-8 w-8 text-slate-800" />
//         </div>
//         <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Registry Unlinked</h3>
//         <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
//           No classroom assignment detected. Please finalize your enrollment with the school administrator.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
      
//       {/* ── LEFT COLUMN: CLASS IDENTITY ── */}
//       <div className="lg:col-span-1 space-y-6">
//         {/* Institutional Identity Card */}
//         <Card className="bg-school-primary border-none p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group text-slate-950">
//           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
//              <School className="h-24 w-24 fill-current" />
//           </div>

//           <div className="relative z-10">
//             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
//               Assigned Registry
//             </h2>
//             <p className="text-4xl font-black italic uppercase tracking-tighter mt-2 leading-none">
//               {data.name}
//             </p>
            
//             <div className="mt-10 flex items-center gap-4 bg-slate-950/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
//               <div className="h-12 w-12 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg">
//                 <UserCheck className="h-6 w-6 text-school-primary" />
//               </div>
//               <div>
//                 <p className="text-[9px] font-black opacity-70 uppercase tracking-widest">
//                   Lead Instructor
//                 </p>
//                 <p className="font-black uppercase italic text-sm">
//                   {data.teacher?.name || "Registry Pending"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Registered Academic Modules Card */}
//         <Card className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-xl">
//           <div className="flex items-center gap-3 mb-6">
//             <BookOpen className="h-4 w-4 text-school-primary" />
//             <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Academic Modules</h3>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {data.mySubjects.length === 0 ? (
//                 <p className="text-[10px] text-slate-600 italic uppercase">No modules currently registered.</p>
//             ) : (
//                 data.mySubjects.map((sub) => (
//                   <Badge 
//                     key={sub} 
//                     variant="outline" 
//                     className="px-4 py-2 rounded-xl border-white/5 bg-slate-950 text-slate-300 text-[10px] font-bold uppercase tracking-wider hover:border-school-primary/30 transition-all"
//                   >
//                     {sub}
//                   </Badge>
//                 ))
//             )}
//           </div>
//         </Card>
//       </div>

//       {/* ── RIGHT COLUMN: PEER REGISTRY ── */}
//       <div className="lg:col-span-2">
//         <Card className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-xl h-full">
//           <div className="flex items-center justify-between mb-10">
//             <div>
//                 <h3 className="text-sm font-black uppercase text-white italic tracking-widest">
//                   Peer Registry
//                 </h3>
//                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">
//                   {data.classmates.length} Students Allocated
//                 </p>
//             </div>
//             <div className="h-10 w-10 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-center">
//                 <Users className="h-5 w-5 text-slate-600" />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {data.classmates.length === 0 ? (
//                <div className="col-span-full text-center py-20 bg-slate-950/30 rounded-3xl border border-dashed border-white/5">
//                  <p className="text-slate-700 text-xs font-bold uppercase tracking-widest italic">No peers currently registered in this module.</p>
//                </div>
//             ) : (
//                 data.classmates.map((student) => (
//                   <div 
//                     key={student.id} 
//                     className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950 border border-white/5 hover:border-school-primary/20 transition-all group cursor-default shadow-lg"
//                   >
//                     <Avatar className="h-10 w-10 border-2 border-slate-900 shadow-xl ring-2 ring-white/5 group-hover:ring-school-primary/20 transition-all">
//                       <AvatarFallback className="bg-slate-900 text-school-primary text-[10px] font-black uppercase">
//                         {(student.name ?? "??").substring(0, 2)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <p className="text-sm font-black text-slate-300 group-hover:text-white uppercase italic tracking-tight truncate">
//                       {student.name ?? "Anonymous Learner"}
//                     </p>
//                   </div>
//                 ))
//             )}
//           </div>
//         </Card>
//       </div>

//     </div>
//   );
// }


// "use client";

// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Card } from "../../ui/card";
// import { Badge } from "../../ui/badge";
// import { UserCheck, Users, School, BookOpen } from "lucide-react";
// import { useProfileStore } from "@/store/profileStore";

// // ── Types ───────────────────────────────────────────────────────────────────

// export interface Classmate {
//   id: string;
//   name: string | null;
// }

// export interface StudentClassRegistryData {
//   name: string;
//   teacher: { name: string | null } | null;
//   classmates: Classmate[];
//   mySubjects: string[]; 
// }

// interface StudentClassViewProps {
//   data: StudentClassRegistryData | null;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * PURE DISPLAY COMPONENT (Visual Layer)
//  * Rule 17: Pulls primaryColor from Zustand.
//  */
// export function StudentClassView({ data }: StudentClassViewProps) {
//   const { profile } = useProfileStore();
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   if (!data) {
//     return (
//       <div className="py-20 text-center bg-slate-900/50 rounded-[3rem] border border-dashed border-white/5">
//         <School className="h-12 w-12 text-slate-800 mx-auto mb-4" />
//         <h3 className="text-xl font-black text-white uppercase italic">Registry Unlinked</h3>
//         <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest max-w-xs mx-auto">
//           No classroom assignment discovered in the institutional registry.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
//       {/* ── CLASS IDENTITY ── */}
//       <div className="lg:col-span-1 space-y-6">
//         <Card 
//           className="border-none p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group text-slate-950"
//           style={{ backgroundColor: primaryColor }}
//         >
//           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
//              <School className="h-20 w-20 fill-current" />
//           </div>

//           <div className="relative z-10">
//             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Assigned Node</h2>
//             <p className="text-4xl font-black italic uppercase tracking-tighter mt-2 leading-none">{data.name}</p>
            
//             <div className="mt-10 flex items-center gap-4 bg-slate-950/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
//               <div className="h-12 w-12 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg">
//                 <UserCheck className="h-6 w-6" style={{ color: primaryColor }} />
//               </div>
//               <div>
//                 <p className="text-[9px] font-black opacity-70 uppercase tracking-widest">Lead Instructor</p>
//                 <p className="font-black uppercase italic text-sm text-white">{data.teacher?.name || "Pending"}</p>
//               </div>
//             </div>
//           </div>
//         </Card>

//         <Card className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-xl">
//           <div className="flex items-center gap-3 mb-6">
//             <BookOpen className="h-4 w-4" style={{ color: primaryColor }} />
//             <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Academic Modules</h3>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {data.mySubjects.map((sub) => (
//               <Badge key={sub} variant="outline" className="px-3 py-1.5 rounded-xl border-white/5 bg-slate-950 text-slate-300 text-[9px] font-black uppercase tracking-widest">
//                 {sub}
//               </Badge>
//             ))}
//           </div>
//         </Card>
//       </div>

//       {/* ── PEER REGISTRY ── */}
//       <div className="lg:col-span-2">
//         <Card className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-xl h-full">
//           <div className="flex items-center justify-between mb-10">
//             <div>
//                 <h3 className="text-sm font-black uppercase text-white italic tracking-widest">Peer directory</h3>
//                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">{data.classmates.length} Peers Assigned</p>
//             </div>
//             <Users className="h-5 w-5 text-slate-700" />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {data.classmates.map((student) => (
//               <div key={student.id} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950 border border-white/5 hover:border-school-primary/20 transition-all group">
//                 <Avatar className="h-10 w-10 border-2 border-slate-900 ring-2 ring-white/5 group-hover:ring-school-primary/20 transition-all">
//                   <AvatarFallback className="bg-slate-900 text-[10px] font-black uppercase" style={{ color: primaryColor }}>
//                     {(student.name ?? "??").substring(0, 2)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <p className="text-sm font-black text-slate-300 group-hover:text-white uppercase italic tracking-tight truncate">
//                   {student.name ?? "Anonymous Learner"}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }



"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { UserCheck, Users, School, BookOpen, ChevronRight } from "lucide-react";



// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

export interface Classmate {
  id: string;
  name: string | null;
}

export interface StudentClassRegistryData {
  name: string;
  teacher: { name: string | null } | null;
  classmates: Classmate[];
  mySubjects: string[]; 
}

interface StudentClassViewProps {
  data: StudentClassRegistryData | null;
}

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * PURE DISPLAY COMPONENT (Tier 3 Visual Layer)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem] and [3rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function StudentClassView({ data }: StudentClassViewProps) {
  

  if (!data) {
    return (
      /* ── EMPTY REGISTRY HUB ── */
      <div className="py-24 md:py-32 text-center bg-surface border-2 border-dashed border-border rounded-[3rem] animate-in fade-in duration-700">
        <div className="h-20 w-20 bg-background rounded-[1.5rem] border border-border flex items-center justify-center mx-auto shadow-sm mb-6">
          <School className="h-10 w-10 text-muted-foreground/30" />
        </div>
        <h3 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter">Registry Hub Unlinked</h3>
        <p className="text-muted-foreground text-[10px] font-bold mt-3 uppercase tracking-widest max-w-xs mx-auto italic leading-relaxed opacity-60">
          No classroom assignment discovered in the institutional ledger.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      
      {/* ── CLASS IDENTITY (Tier 2/3 Meta) ── */}
      <div className="lg:col-span-1 space-y-6 md:space-y-8">
        {/* Rule 18: High-impact Brand Card */}
        <Card 
          className="bg-school-primary border-none p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group text-on-school-primary"
        >
          {/* Rule 21: Scale protocol decoration */}
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
             <School className="h-24 w-24 fill-current" />
          </div>

          <div className="relative z-10 space-y-12">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.4em] opacity-60 italic">Assigned Registry Hub</p>
              <h2 className="text-4xl md:text-5xl font-extrabold italic uppercase tracking-tighter mt-3 leading-none drop-shadow-sm">
                {data.name}
              </h2>
            </div>
            
            <div className="flex items-center gap-4 bg-on-school-primary/10 p-4 rounded-2xl backdrop-blur-md border border-on-school-primary/10 shadow-inner">
              {/* Rule 21: Scale Protocol for dark surface in light bg */}
              <div className="h-12 w-12 rounded-xl bg-on-school-primary/20 flex items-center justify-center shadow-sm">
                <UserCheck className="h-6 w-6 text-on-school-primary" />
              </div>
              <div>
                <p className="text-[9px] font-bold opacity-70 uppercase tracking-widest leading-none mb-1">Lead Instructor</p>
                <p className="font-extrabold uppercase italic text-sm tracking-tight">{data.teacher?.name || "Registry Pending"}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* ── ACADEMIC MODULES HUB ── */}
        <Card className="bg-card border-border p-6 md:p-8 rounded-[2rem] shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-10 rounded-xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-school-primary" />
            </div>
            <h3 className="text-xs font-extrabold uppercase text-foreground italic tracking-widest">Academic Modules</h3>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            {data.mySubjects.map((sub) => (
              <Badge 
                key={sub} 
                variant="outline" 
                className="px-4 py-2 rounded-xl border-border bg-surface text-muted-foreground text-[10px] font-bold uppercase tracking-widest hover:border-school-primary-200 hover:text-school-primary transition-all cursor-default"
              >
                {sub}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* ── PEER REGISTRY MATRIX (Rule 20) ── */}
      <div className="lg:col-span-2">
        <Card className="bg-card border-border p-6 md:p-10 rounded-[2rem] shadow-xl h-full">
          <div className="flex items-center justify-between mb-10 border-b border-border pb-6">
            <div className="space-y-1">
                <h3 className="text-xl font-extrabold uppercase text-foreground italic tracking-tighter">Peer Directory</h3>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest italic opacity-60">
                  {data.classmates.length} Identity Profiles Synchronized
                </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center">
              <Users className="h-5 w-5 text-muted-foreground/30" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {data.classmates.map((student) => (
              <div 
                key={student.id} 
                className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-border hover:border-school-primary/40 transition-all group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Avatar Standard (Rule 19/21) */}
                  <Avatar className="h-10 w-10 border-2 border-background ring-4 ring-school-primary-50 transition-all group-hover:ring-school-primary-100">
                    <AvatarFallback className="bg-surface text-[10px] font-extrabold uppercase italic text-school-primary tabular-nums">
                      {(student.name ?? "??").substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-extrabold text-foreground/80 group-hover:text-school-primary uppercase italic tracking-tight truncate leading-none transition-colors">
                    {student.name ?? "Anonymous Learner"}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-school-primary group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}