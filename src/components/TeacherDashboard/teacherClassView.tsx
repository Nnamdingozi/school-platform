// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Users } from "lucide-react";
// import { Card, CardContent } from "../ui/card";

// export function TeacherClassView({ data }: { data: any[] }) {
//     // 1. Better Empty State
//     if (!data || data.length === 0) {
//       return (
//         <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 rounded-[3rem] border border-white/5">
//           <div className="p-4 bg-school-primary/10 rounded-full mb-4">
//             <Users className="h-10 w-10 text-school-primary" />
//           </div>
//           <h3 className="text-xl font-black text-white uppercase italic">No Registry Assigned</h3>
//           <p className="text-slate-500 text-sm mt-2">You are not currently assigned as a Lead Teacher to any classroom.</p>
//           <p className="text-[10px] text-slate-600 uppercase mt-8 tracking-widest">Contact Admin for Registry Access</p>
//         </div>
//       );
//     }
  
//     // 2. Default to the first class
//     const selectedClass = data[0];
  
//     return (
//       <div className="max-w-7xl mx-auto space-y-10">
//         <header className="flex justify-between items-end">
//           <div>
//              <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
//                {selectedClass.name}
//              </h1>
//              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
//                {selectedClass.grade.displayName} — Master Report Sheet
//              </p>
//           </div>
          
//           {/* If teacher has multiple classes, they can see how many here */}
//           {data.length > 1 && (
//              <span className="text-[10px] font-black bg-school-primary text-slate-950 px-3 py-1 rounded-full">
//                + {data.length - 1} OTHER CLASSES
//              </span>
//           )}
//         </header>
  
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {selectedClass.subjectStats?.map((stat: any) => (
//             <Card key={stat.subjectName} className="bg-slate-900 border-white/5 p-6 rounded-[1.5rem]">
//               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.subjectName}</p>
//               <div className="mt-4 flex items-end justify-between">
//                 <div>
//                   <span className="text-2xl font-black text-school-primary">{stat.average}%</span>
//                   <p className="text-[9px] text-slate-600 font-bold uppercase">Class Avg</p>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
  
//         {/* Table Section (Ensures visibility) */}
//         <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
//            <div className="overflow-x-auto">
//              <table className="w-full text-sm text-slate-200">
//                <thead className="bg-slate-950 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
//                  <tr>
//                    <th className="px-8 py-6 text-left">Student</th>
//                    {selectedClass.grade.gradeSubjects.map((gs: any) => (
//                      <th key={gs.id} className="px-4 py-6 text-center">{gs.subject.name}</th>
//                    ))}
//                  </tr>
//                </thead>
//                <tbody className="divide-y divide-white/5">
//                   {selectedClass.students.map((student: any) => (
//                     <tr key={student.id} className="hover:bg-white/5">
//                       <td className="px-8 py-5 font-bold uppercase text-xs">{student.name}</td>
//                       {selectedClass.grade.gradeSubjects.map((gs: any) => {
//                          const score = student.assessments.find((a: any) => a.gradeSubjectId === gs.id)?.score;
//                          return (
//                            <td key={gs.id} className="text-center text-slate-400 font-mono">
//                              {score ?? "-"}
//                            </td>
//                          );
//                       })}
//                     </tr>
//                   ))}
//                </tbody>
//              </table>
//            </div>
//         </div>
//       </div>
//     );
//   }


// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Users } from "lucide-react";
// import { Card, CardContent } from "../ui/card";

// export function TeacherClassView({ data }: { data: any[] }) {
//     // 1. Better Empty State
//     if (!data || data.length === 0) {
//       return (
//         <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 rounded-[3rem] border border-white/5">
//           <div className="p-4 bg-school-primary/10 rounded-full mb-4">
//             <Users className="h-10 w-10 text-school-primary" />
//           </div>
//           <h3 className="text-xl font-black text-white uppercase italic">No Registry Assigned</h3>
//           <p className="text-slate-500 text-sm mt-2">You are not currently assigned as a Lead Teacher to any classroom.</p>
//           <p className="text-[10px] text-slate-600 uppercase mt-8 tracking-widest">Contact Admin for Registry Access</p>
//         </div>
//       );
//     }
  
//     // 2. Default to the first class
//     const selectedClass = data[0];
  
//     return (
//       <div className="max-w-7xl mx-auto space-y-10">
//         <header className="flex justify-between items-end">
//           <div>
//              <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
//                {selectedClass.name}
//              </h1>
//              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
//                {selectedClass.grade.displayName} — Master Report Sheet
//              </p>
//           </div>
          
//           {/* If teacher has multiple classes, they can see how many here */}
//           {data.length > 1 && (
//              <span className="text-[10px] font-black bg-school-primary text-slate-950 px-3 py-1 rounded-full">
//                + {data.length - 1} OTHER CLASSES
//              </span>
//           )}
//         </header>
  
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {selectedClass.subjectStats?.map((stat: any) => (
//             <Card key={stat.subjectName} className="bg-slate-900 border-white/5 p-6 rounded-[1.5rem]">
//               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.subjectName}</p>
//               <div className="mt-4 flex items-end justify-between">
//                 <div>
//                   <span className="text-2xl font-black text-school-primary">{stat.average}%</span>
//                   <p className="text-[9px] text-slate-600 font-bold uppercase">Class Avg</p>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
  
//         {/* Table Section (Ensures visibility) */}
//         <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
//            <div className="overflow-x-auto">
//              <table className="w-full text-sm text-slate-200">
//                <thead className="bg-slate-950 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
//                  <tr>
//                    <th className="px-8 py-6 text-left">Student</th>
//                    {selectedClass.grade.gradeSubjects.map((gs: any) => (
//                      <th key={gs.id} className="px-4 py-6 text-center">{gs.subject.name}</th>
//                    ))}
//                  </tr>
//                </thead>
//                <tbody className="divide-y divide-white/5">
//                   {selectedClass.students.map((student: any) => (
//                     <tr key={student.id} className="hover:bg-white/5">
//                       <td className="px-8 py-5 font-bold uppercase text-xs">{student.name}</td>
//                       {selectedClass.grade.gradeSubjects.map((gs: any) => {
//                          const score = student.assessments.find((a: any) => a.gradeSubjectId === gs.id)?.score;
//                          return (
//                            <td key={gs.id} className="text-center text-slate-400 font-mono">
//                              {score ?? "-"}
//                            </td>
//                          );
//                       })}
//                     </tr>
//                   ))}
//                </tbody>
//              </table>
//            </div>
//         </div>
//       </div>
//     );
//   }



// "use client";

// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableHead, 
//   TableHeader, 
//   TableRow 
// } from "@/components/ui/table";
// import { Users } from "lucide-react";
// import { Card } from "@/components/ui/card";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface SubjectStat {
//   subjectName: string;
//   average: number;
// }

// interface GradeSubjectDetail {
//   id: string;
//   subject: {
//     name: string;
//   };
// }

// interface StudentWithAssessments {
//   id: string;
//   name: string | null;
//   assessments: {
//     gradeSubjectId: string;
//     score: number | null;
//   }[];
// }

// interface ClassData {
//   id: string;
//   name: string;
//   grade: {
//     displayName: string;
//     gradeSubjects: GradeSubjectDetail[];
//   };
//   subjectStats?: SubjectStat[];
//   students: StudentWithAssessments[];
// }

// interface TeacherClassViewProps {
//   data: ClassData[];
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function TeacherClassView({ data }: TeacherClassViewProps) {
//   // 1. Better Empty State
//   if (!data || data.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 rounded-[3rem] border border-white/5">
//         <div className="p-4 bg-school-primary/10 rounded-full mb-4">
//           <Users className="h-10 w-10 text-school-primary" />
//         </div>
//         <h3 className="text-xl font-black text-white uppercase italic">No Registry Assigned</h3>
//         <p className="text-slate-500 text-sm mt-2">You are not currently assigned as a Lead Teacher to any classroom.</p>
//         <p className="text-[10px] text-slate-600 uppercase mt-8 tracking-widest">Contact Admin for Registry Access</p>
//       </div>
//     );
//   }

//   // 2. Default to the first class
//   const selectedClass = data[0];

//   return (
//     <div className="max-w-7xl mx-auto space-y-10">
//       <header className="flex justify-between items-end">
//         <div>
//            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
//              {selectedClass.name}
//            </h1>
//            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
//              {selectedClass.grade.displayName} — Master Report Sheet
//            </p>
//         </div>
        
//         {data.length > 1 && (
//            <span className="text-[10px] font-black bg-school-primary text-slate-950 px-3 py-1 rounded-full">
//              + {data.length - 1} OTHER CLASSES
//            </span>
//         )}
//       </header>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         {selectedClass.subjectStats?.map((stat) => (
//           <Card key={stat.subjectName} className="bg-slate-900 border-white/5 p-6 rounded-[1.5rem]">
//             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.subjectName}</p>
//             <div className="mt-4 flex items-end justify-between">
//               <div>
//                 <span className="text-2xl font-black text-school-primary">{stat.average}%</span>
//                 <p className="text-[9px] text-slate-600 font-bold uppercase">Class Avg</p>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Table Section using UI Components */}
//       <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
//          <Table>
//            <TableHeader className="bg-slate-950">
//              <TableRow className="border-white/5 hover:bg-transparent">
//                <TableHead className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
//                 Student
//                </TableHead>
//                {selectedClass.grade.gradeSubjects.map((gs) => (
//                  <TableHead key={gs.id} className="px-4 py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
//                   {gs.subject.name}
//                  </TableHead>
//                ))}
//              </TableRow>
//            </TableHeader>
//            <TableBody>
//               {selectedClass.students.map((student) => (
//                 <TableRow key={student.id} className="border-white/5 hover:bg-white/5 transition-colors">
//                   <TableCell className="px-8 py-5 font-bold uppercase text-xs text-slate-200">
//                     {student.name || "Unknown Student"}
//                   </TableCell>
//                   {selectedClass.grade.gradeSubjects.map((gs) => {
//                      const assessment = student.assessments.find((a) => a.gradeSubjectId === gs.id);
//                      return (
//                        <TableCell key={gs.id} className="text-center text-slate-400 font-mono">
//                          {assessment?.score !== undefined && assessment?.score !== null 
//                            ? assessment.score 
//                            : "-"}
//                        </TableCell>
//                      );
//                   })}
//                 </TableRow>
//               ))}
//            </TableBody>
//          </Table>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { 
//   Table, TableBody, TableCell, TableHead, 
//   TableHeader, TableRow 
// } from "@/components/ui/table";
// import { Users, GraduationCap, ArrowRight } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { useProfileStore } from "@/store/profileStore";

// interface TeacherClassViewProps {
//   data: any[]; // Array of classes the teacher is lead of
// }

// /**
//  * TEACHER REGISTRY VIEW (Tier 2)
//  * Rule 17: Branding from Zustand.
//  */
// export function TeacherClassView({ data }: TeacherClassViewProps) {
//   const { profile } = useProfileStore();
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   if (!data || data.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-32 bg-slate-900/50 rounded-[3rem] border border-white/5 space-y-6">
//         <Users className="h-12 w-12 text-slate-800" />
//         <div className="text-center">
//             <h3 className="text-xl font-black text-white uppercase italic">Registry Unassigned</h3>
//             <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">You are not registered as a Lead Teacher.</p>
//         </div>
//       </div>
//     );
//   }

//   const activeClass = data[0];

//   return (
//     <div className="max-w-7xl mx-auto space-y-10 p-6">
//       <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//         <div>
//            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
//              {activeClass.name}
//            </h1>
//            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
//              {activeClass.grade.displayName} • Institutional Master Broadsheet
//            </p>
//         </div>
        
//         {data.length > 1 && (
//            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
//              + {data.length - 1} OTHER REGISTRIES AVAILABLE
//            </div>
//         )}
//       </header>

//       {/* Subject Averages */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {activeClass.subjectStats?.map((stat: any) => (
//           <Card key={stat.subjectName} className="bg-slate-900 border-white/5 p-8 rounded-[2rem] shadow-xl hover:border-white/10 transition-all">
//             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{stat.subjectName}</p>
//             <div className="flex items-end justify-between">
//               <span className="text-4xl font-black text-white italic" style={{ color: primaryColor }}>{stat.average}%</span>
//               <div className="text-right">
//                   <p className="text-[8px] font-black text-slate-600 uppercase">Top: {stat.bestStudent}</p>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Main Registry Table */}
//       <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
//          <Table>
//            <TableHeader className="bg-slate-950/50">
//              <TableRow className="border-white/5 hover:bg-transparent">
//                <TableHead className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Identity</TableHead>
//                {activeClass.grade.gradeSubjects.map((gs: any) => (
//                  <TableHead key={gs.id} className="px-6 py-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
//                   {gs.subject.name}
//                  </TableHead>
//                ))}
//              </TableRow>
//            </TableHeader>
//            <TableBody>
//               {activeClass.students.map((student: any) => (
//                 <TableRow key={student.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
//                   <TableCell className="px-10 py-6 font-black uppercase text-sm text-white italic">
//                     {student.name || "Anonymous Student"}
//                   </TableCell>
//                   {activeClass.grade.gradeSubjects.map((gs: any) => {
//                      const assessment = student.assessments.find((a: any) => a.gradeSubjectId === gs.id);
//                      return (
//                        <TableCell key={gs.id} className="text-center text-slate-400 font-mono text-xs">
//                          {assessment?.score ?? "-"}
//                        </TableCell>
//                      );
//                   })}
//                 </TableRow>
//               ))}
//            </TableBody>
//          </Table>
//       </div>
//     </div>
//   );
// }


"use client";

import React from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Users, GraduationCap, ArrowRight, ShieldCheck, Activity, UserCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useProfileStore } from "@/store/profileStore";
import { cn } from "@/lib/utils";

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface SubjectStat {
    subjectName: string;
    average: number;
    bestStudent: string;
}

interface GradeSubject {
    id: string;
    subject: { name: string };
}

interface StudentRecord {
    id: string;
    name: string | null;
    assessments: { score: number | null; gradeSubjectId: string }[];
}

interface ClassroomData {
    id: string;
    name: string;
    grade: { 
        displayName: string;
        gradeSubjects: GradeSubject[];
    };
    students: StudentRecord[];
    subjectStats: SubjectStat[];
}

interface TeacherClassViewProps {
  data: ClassroomData[]; 
}

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * TEACHER REGISTRY VIEW (Tier 2)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function TeacherClassView({ data }: TeacherClassViewProps) {
  if (!data || data.length === 0) {
    return (
      /* ── EMPTY REGISTRY HUB (Rule 18/19) ── */
      <div className="flex flex-col items-center justify-center py-32 bg-surface border-2 border-dashed border-border rounded-[2rem] space-y-6 animate-in fade-in duration-700">
        <div className="h-16 w-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg">
            <Users className="h-8 w-8 text-muted-foreground/30" />
        </div>
        <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter">Registry Unassigned</h3>
            <p className="text-muted-foreground text-[10px] font-semibold mt-2 uppercase tracking-widest italic opacity-60">
                You are not registered as a lead hub instructor.
            </p>
        </div>
      </div>
    );
  }

  const activeClass = data[0];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* ── HUB HEADER (Rule 11/21) ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-3">
           <h1 className="text-3xl md:text-5xl font-extrabold text-foreground italic uppercase tracking-tighter leading-none">
             {activeClass.name}
           </h1>
           <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-school-primary animate-pulse" />
                <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest italic">
                    {activeClass.grade.displayName} Hub • Institutional Master Broadsheet
                </p>
           </div>
        </div>
        
        {data.length > 1 && (
           <div className="px-5 py-2.5 rounded-xl bg-surface border border-border text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest shadow-inner">
             + {data.length - 1} OTHER REGISTRIES DISCOVERED
           </div>
        )}
      </header>

      {/* ── SUBJECT PERFORMANCE TILES (Rule 20/21) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeClass.subjectStats?.map((stat) => (
          <Card key={stat.subjectName} className="bg-card border-border p-6 md:p-8 rounded-[2rem] shadow-xl hover:border-school-primary-200 transition-all group">
            <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">{stat.subjectName}</p>
                <div className="p-2 bg-school-primary-50 border border-school-primary-100 rounded-lg">
                    <Activity className="h-3.5 w-3.5 text-school-primary" />
                </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-extrabold text-school-primary italic tracking-tighter tabular-nums">{stat.average}%</span>
              <div className="text-right">
                  <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-tighter">Peak Record</p>
                  <p className="text-[9px] font-extrabold text-foreground uppercase italic truncate max-w-[80px]">{stat.bestStudent}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── MASTER REGISTRY TABLE (Rule 18/20) ── */}
      <Card className="bg-card border-border rounded-[2rem] overflow-hidden shadow-2xl">
         <div className="overflow-x-auto custom-scrollbar">
            <Table>
            <TableHeader className="bg-surface/50 backdrop-blur-md border-b border-border">
                <TableRow className="border-border hover:bg-transparent">
                <TableHead className="px-10 py-8 text-left text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground italic">
                    Identity Hub
                </TableHead>
                {activeClass.grade.gradeSubjects.map((gs) => (
                    <TableHead key={gs.id} className="px-6 py-8 text-center text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground italic">
                    {gs.subject.name}
                    </TableHead>
                ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {activeClass.students.map((student) => (
                    <TableRow key={student.id} className="border-border hover:bg-muted/30 transition-colors group">
                    <TableCell className="px-10 py-6">
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-8 rounded-lg bg-surface border border-border flex items-center justify-center text-muted-foreground/40 group-hover:text-school-primary transition-colors">
                                <UserCircle className="h-5 w-5" />
                            </div>
                            <span className="font-extrabold uppercase text-sm text-foreground italic tracking-tight">
                                {student.name || "Anonymous_Identity"}
                            </span>
                        </div>
                    </TableCell>
                    {activeClass.grade.gradeSubjects.map((gs) => {
                        const assessment = student.assessments.find((a) => a.gradeSubjectId === gs.id);
                        const score = assessment?.score;
                        const isLow = score !== null && score !== undefined && score < 50;

                        return (
                        <TableCell key={gs.id} className={cn(
                            "text-center font-mono text-xs tabular-nums font-bold",
                            isLow ? "text-destructive" : "text-muted-foreground/80"
                        )}>
                            {score ?? "—"}
                        </TableCell>
                        );
                    })}
                    </TableRow>
                ))}
            </TableBody>
            </Table>
         </div>
      </Card>

      {/* ── FOOTER PROTOCOL ── */}
      <div className="pt-6 flex justify-center items-center gap-3 opacity-30">
          <ShieldCheck className="h-4 w-4" />
          <p className="text-[9px] font-bold uppercase tracking-[0.4em]">Institutional_Broadsheet_Ledger_v4.2</p>
      </div>
    </div>
  );
}