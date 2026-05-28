// "use client"

// import { useState } from "react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { BookOpen, Users, GraduationCap, ClipboardList } from "lucide-react"

// export function AssessmentDashboard({ data }: { data: any }) {
//   const { subjectView, classView } = data;

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
//       <header>
//         <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Assessment Registry</h1>
//         <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Grading & Performance Monitoring</p>
//       </header>

//       <Tabs defaultValue="subject" className="w-full">
//         <TabsList className="bg-slate-900 border border-white/5 p-1 rounded-2xl mb-8">
//           <TabsTrigger value="subject" className="rounded-xl px-8 data-[state=active]:bg-school-primary data-[state=active]:text-slate-950 font-bold uppercase text-[10px]">
//             <BookOpen className="h-3 w-3 mr-2" /> My Subjects
//           </TabsTrigger>
//           <TabsTrigger value="class" className="rounded-xl px-8 data-[state=active]:bg-school-primary data-[state=active]:text-slate-950 font-bold uppercase text-[10px]">
//             <Users className="h-3 w-3 mr-2" /> My Classroom
//           </TabsTrigger>
//         </TabsList>

//         {/* ── VIEW A: SUBJECT-CENTRIC ── */}
//         <TabsContent value="subject" className="space-y-6">
//           {subjectView.map((gs: any) => (
//             <Card key={gs.id} className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden">
//               <div className="bg-slate-950/50 p-6 border-b border-white/5 flex justify-between items-center">
//                 <div>
//                   <h3 className="text-lg font-black text-white italic uppercase">{gs.subject.name}</h3>
//                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{gs.grade.displayName}</p>
//                 </div>
//                 <Badge variant="outline" className="text-school-primary border-school-primary/20">
//                   {gs.studentSubjects.length} Students enrolled
//                 </Badge>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="bg-slate-950 text-[10px] uppercase font-black text-slate-500">
//                     <tr>
//                       <th className="px-6 py-4 text-left">Student Name</th>
//                       <th className="px-6 py-4 text-left">Latest Assessment</th>
//                       <th className="px-6 py-4 text-center">Score</th>
//                       <th className="px-6 py-4 text-right">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-white/5">
//                     {gs.studentSubjects.map((ss: any) => {
//                       const latest = ss.student.assessments[0];
//                       return (
//                         <tr key={ss.student.id} className="hover:bg-white/5 transition-colors">
//                           <td className="px-6 py-4 font-bold text-slate-200 uppercase text-xs">{ss.student.name}</td>
//                           <td className="px-6 py-4 text-slate-400 italic text-xs">{latest?.topic?.title || "No data"}</td>
//                           <td className="px-6 py-4 text-center font-black text-school-primary">
//                             {latest ? `${latest.score}/${latest.maxScore}` : "--"}
//                           </td>
//                           <td className="px-6 py-4 text-right">
//                             <button className="text-[9px] font-black uppercase tracking-tighter text-slate-600 hover:text-school-primary">View History</button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </Card>
//           ))}
//         </TabsContent>

//         {/* ── VIEW B: CLASS-CENTRIC ── */}
//         <TabsContent value="class" className="space-y-6">
//           {classView.map((cls: any) => (
//             <Card key={cls.id} className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden">
//                <div className="bg-slate-950/50 p-6 border-b border-white/5">
//                   <h3 className="text-lg font-black text-white italic uppercase">{cls.name} Registry</h3>
//                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Master List — All Subjects</p>
//                </div>
//                <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead className="bg-slate-950 text-[10px] uppercase font-black text-slate-500">
//                       <tr>
//                         <th className="px-6 py-4 text-left">Identity</th>
//                         <th className="px-6 py-4 text-left">Recent Activity</th>
//                         <th className="px-6 py-4 text-center">Subject Count</th>
//                         <th className="px-6 py-4 text-right">Performance Index</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-white/5">
//                       {cls.enrollments.map((e: any) => (
//                         <tr key={e.student.id} className="hover:bg-white/5 transition-colors">
//                           <td className="px-6 py-4 font-bold text-slate-200 uppercase text-xs">{e.student.name}</td>
//                           <td className="px-6 py-4 text-slate-500 text-[10px] font-medium italic truncate max-w-[150px]">
//                             {e.student.assessments[0]?.gradeSubject?.subject?.name || "N/A"}
//                           </td>
//                           <td className="px-6 py-4 text-center text-slate-400 font-mono text-xs">
//                              {e.student.assessments.length}
//                           </td>
//                           <td className="px-6 py-4 text-right">
//                             <div className="h-1.5 w-20 bg-slate-800 rounded-full ml-auto overflow-hidden">
//                                <div className="h-full bg-school-primary" style={{ width: '75%' }}></div>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                </div>
//             </Card>
//           ))}
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { 
//   BookOpen, Users, GraduationCap, 
//   ClipboardList, BookX, UserX, 
//   SearchX, AlertCircle, History
// } from "lucide-react"
// import { cn } from "@/lib/utils"

// export function AssessmentDashboard({ data }: { data: any }) {
//   const { subjectView = [], classView = [] } = data;

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
//       <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//         <div>
//           <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Assessment Registry</h1>
//           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-3">Grading & Performance Monitoring Environment</p>
//         </div>
//         <div className="bg-slate-900 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
//             <History className="h-4 w-4 text-school-primary" />
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Sync Active</span>
//         </div>
//       </header>

//       <Tabs defaultValue="subject" className="w-full">
//         <TabsList className="bg-slate-900 border border-white/5 p-1.5 rounded-2xl mb-10 w-fit">
//           <TabsTrigger value="subject" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-school-primary data-[state=active]:text-slate-950 font-black uppercase text-[10px] tracking-widest">
//             <BookOpen className="h-3.5 w-3.5 mr-2" /> My Assigned Subjects
//           </TabsTrigger>
//           <TabsTrigger value="class" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-school-primary data-[state=active]:text-slate-950 font-black uppercase text-[10px] tracking-widest">
//             <Users className="h-3.5 w-3.5 mr-2" /> My Classroom Registry
//           </TabsTrigger>
//         </TabsList>

//         {/* ── VIEW A: SUBJECT-CENTRIC (Lead Teacher View) ── */}
//         <TabsContent value="subject" className="space-y-8 outline-none">
//           {subjectView.length === 0 ? (
//             <EmptyState 
//               icon={BookX} 
//               title="No Subjects Claimed" 
//               desc="Your profile is not currently linked as a Lead Teacher to any subjects in the registry."
//             />
//           ) : (
//             subjectView.map((gs: any) => (
//               <Card key={gs.id} className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
//                 <div className="bg-slate-950/50 p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                   <div>
//                     <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{gs.subject.name}</h3>
//                     <p className="text-[10px] text-school-primary font-black uppercase tracking-[0.2em] mt-1">{gs.grade.displayName}</p>
//                   </div>
//                   <Badge variant="outline" className="bg-slate-950 text-slate-400 border-white/10 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
//                     {gs.studentSubjects.length} Registered Students
//                   </Badge>
//                 </div>

//                 <div className="overflow-x-auto">
//                   {gs.studentSubjects.length === 0 ? (
//                     <div className="py-20 text-center">
//                        <UserX className="h-10 w-10 text-slate-800 mx-auto mb-4" />
//                        <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest">No students have enrolled for this subject yet.</p>
//                     </div>
//                   ) : (
//                     <table className="w-full text-sm">
//                       <thead className="bg-slate-950/30 text-[10px] uppercase font-black text-slate-600 tracking-widest">
//                         <tr>
//                           <th className="px-8 py-5 text-left">Full Name</th>
//                           <th className="px-8 py-5 text-left">Latest Module</th>
//                           <th className="px-8 py-5 text-center">Current Score</th>
//                           <th className="px-8 py-5 text-right">Records</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-white/5">
//                         {gs.studentSubjects.map((ss: any) => {
//                           const latest = ss.student.assessments[0];
//                           return (
//                             <tr key={ss.student.id} className="hover:bg-white/[0.02] transition-colors group">
//                               <td className="px-8 py-5 font-bold text-slate-200 uppercase text-xs tracking-tight">{ss.student.name}</td>
//                               <td className="px-8 py-5">
//                                 {latest?.topic?.title ? (
//                                   <span className="text-slate-400 italic text-xs">{latest.topic.title}</span>
//                                 ) : (
//                                   <span className="text-slate-700 uppercase text-[9px] font-bold tracking-tighter italic">Waiting for grading...</span>
//                                 )}
//                               </td>
//                               <td className="px-8 py-5 text-center">
//                                 {latest ? (
//                                   <span className="font-black text-school-primary text-base">
//                                     {latest.score}<span className="text-slate-600 text-[10px] font-bold ml-1">/ {latest.maxScore}</span>
//                                   </span>
//                                 ) : (
//                                   <div className="flex items-center justify-center gap-2 text-slate-800">
//                                     <AlertCircle className="h-3 w-3" />
//                                     <span className="text-[10px] font-black uppercase">Pending</span>
//                                   </div>
//                                 )}
//                               </td>
//                               <td className="px-8 py-5 text-right">
//                                 <button className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-school-primary transition-colors border border-white/10 px-3 py-1.5 rounded-lg group-hover:border-school-primary/30">
//                                   Profile Info
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//               </Card>
//             ))
//           )}
//         </TabsContent>

//         {/* ── VIEW B: CLASS-CENTRIC (Form Tutor View) ── */}
//         <TabsContent value="class" className="space-y-8 outline-none">
//           {classView.length === 0 ? (
//             <EmptyState 
//               icon={SearchX} 
//               title="Registry Unassigned" 
//               desc="You are not designated as the Class Teacher for any physical classroom groups."
//             />
//           ) : (
//             classView.map((cls: any) => (
//               <Card key={cls.id} className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
//                  <div className="bg-slate-950/50 p-8 border-b border-white/5">
//                     <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{cls.name} Master List</h3>
//                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 italic">Consolidated View — All Academic Subjects</p>
//                  </div>
//                  <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead className="bg-slate-950/30 text-[10px] uppercase font-black text-slate-600 tracking-widest">
//                         <tr>
//                           <th className="px-8 py-5 text-left">Identity</th>
//                           <th className="px-8 py-5 text-left">Recent Activity</th>
//                           <th className="px-8 py-5 text-center">Module Load</th>
//                           <th className="px-8 py-5 text-right">Performance Index</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-white/5">
//                         {cls.enrollments.map((e: any) => (
//                           <tr key={e.student.id} className="hover:bg-white/[0.02] transition-colors">
//                             <td className="px-8 py-5 font-bold text-slate-200 uppercase text-xs">{e.student.name}</td>
//                             <td className="px-8 py-5">
//                               <span className="text-slate-500 text-[10px] font-bold uppercase italic truncate max-w-[150px] block">
//                                 {e.student.assessments[0]?.gradeSubject?.subject?.name || "No active history"}
//                               </span>
//                             </td>
//                             <td className="px-8 py-5 text-center text-slate-400 font-mono text-xs">
//                                {e.student.assessments.length} Tests
//                             </td>
//                             <td className="px-8 py-5">
//                               <div className="flex items-center gap-3 justify-end">
//                                 <span className="text-[9px] font-black text-slate-600 uppercase">Health</span>
//                                 <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden border border-white/5">
//                                    <div className="h-full bg-school-primary shadow-[0_0_10px_rgba(245,158,11,0.3)]" style={{ width: '70%' }}></div>
//                                 </div>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                  </div>
//               </Card>
//             ))
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// function EmptyState({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
//   return (
//     <div className="py-40 text-center bg-slate-900/30 rounded-[3.5rem] border border-dashed border-white/5">
//       <div className="h-20 w-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/5">
//         <Icon className="h-10 w-10 text-slate-700" />
//       </div>
//       <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{title}</h2>
//       <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto leading-relaxed">{desc}</p>
//     </div>
//   )
// }

// "use client"

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { 
//   BookOpen, Users, 
//   BookX, UserX, 
//   SearchX, AlertCircle, History
// } from "lucide-react"
// import { 
//   GradeSubject, 
//   Subject, 
//   Grade, 
//   StudentSubject, 
//   Profile, 
//   Assessment, 
//   Topic, 
//   Class, 
//   ClassEnrollment 
// } from "@prisma/client"
// import React from "react"

// // ── Utility ──────────────────────────────────────────────────────────────────



// // ── Strict Interfaces ────────────────────────────────────────────────────────

// // Extending Prisma types to include the relations used in the maps
// interface AssessmentWithDetails extends Assessment {
//   topic: Topic | null;
//   gradeSubject?: GradeSubject & { subject: Subject };
// }

// interface ProfileWithAssessments extends Profile {
//   assessments: AssessmentWithDetails[];
// }

// interface StudentSubjectWithDetails extends StudentSubject {
//   student: ProfileWithAssessments;
// }

// interface GradeSubjectView extends GradeSubject {
//   subject: Subject;
//   grade: Grade;
//   studentSubjects: StudentSubjectWithDetails[];
// }

// interface ClassEnrollmentWithDetails extends ClassEnrollment {
//   student: ProfileWithAssessments;
// }

// interface ClassView extends Class {
//   enrollments: ClassEnrollmentWithDetails[];
// }

// interface AssessmentDashboardProps {
//   data: {
//     subjectView?: GradeSubjectView[];
//     classView?: ClassView[];
//   };
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function AssessmentDashboard({ data }: AssessmentDashboardProps) {
//   const { subjectView = [], classView = [] } = data;

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
//       <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//         <div>
//           <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Assessment Registry</h1>
//           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-3">Grading & Performance Monitoring Environment</p>
//         </div>
//         <div className="bg-slate-900 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
//             <History className="h-4 w-4 text-school-primary" />
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Sync Active</span>
//         </div>
//       </header>

//       <Tabs defaultValue="subject" className="w-full">
//         <TabsList className="bg-slate-900 border border-white/5 p-1.5 rounded-2xl mb-10 w-fit">
//           <TabsTrigger value="subject" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-school-primary data-[state=active]:text-slate-950 font-black uppercase text-[10px] tracking-widest">
//             <BookOpen className="h-3.5 w-3.5 mr-2" /> My Assigned Subjects
//           </TabsTrigger>
//           <TabsTrigger value="class" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-school-primary data-[state=active]:text-slate-950 font-black uppercase text-[10px] tracking-widest">
//             <Users className="h-3.5 w-3.5 mr-2" /> My Classroom Registry
//           </TabsTrigger>
//         </TabsList>

//         {/* ── VIEW A: SUBJECT-CENTRIC ── */}
//         <TabsContent value="subject" className="space-y-8 outline-none">
//           {subjectView.length === 0 ? (
//             <EmptyState 
//               icon={BookX} 
//               title="No Subjects Claimed" 
//               desc="Your profile is not currently linked as a Lead Teacher to any subjects in the registry."
//             />
//           ) : (
//             subjectView.map((gs) => (
//               <Card key={gs.id} className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
//                 <div className="bg-slate-950/50 p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                   <div>
//                     <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{gs.subject.name}</h3>
//                     <p className="text-[10px] text-school-primary font-black uppercase tracking-[0.2em] mt-1">{gs.grade.displayName}</p>
//                   </div>
//                   <Badge variant="outline" className="bg-slate-950 text-slate-400 border-white/10 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
//                     {gs.studentSubjects.length} Registered Students
//                   </Badge>
//                 </div>

//                 <div className="overflow-x-auto">
//                   {gs.studentSubjects.length === 0 ? (
//                     <div className="py-20 text-center">
//                        <UserX className="h-10 w-10 text-slate-800 mx-auto mb-4" />
//                        <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest">No students have enrolled for this subject yet.</p>
//                     </div>
//                   ) : (
//                     <table className="w-full text-sm">
//                       <thead className="bg-slate-950/30 text-[10px] uppercase font-black text-slate-600 tracking-widest">
//                         <tr>
//                           <th className="px-8 py-5 text-left">Full Name</th>
//                           <th className="px-8 py-5 text-left">Latest Module</th>
//                           <th className="px-8 py-5 text-center">Current Score</th>
//                           <th className="px-8 py-5 text-right">Records</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-white/5">
//                         {gs.studentSubjects.map((ss) => {
//                           const latest = ss.student.assessments[0];
//                           return (
//                             <tr key={ss.student.id} className="hover:bg-white/[0.02] transition-colors group">
//                               <td className="px-8 py-5 font-bold text-slate-200 uppercase text-xs tracking-tight">{ss.student.name}</td>
//                               <td className="px-8 py-5">
//                                 {latest?.topic?.title ? (
//                                   <span className="text-slate-400 italic text-xs">{latest.topic.title}</span>
//                                 ) : (
//                                   <span className="text-slate-700 uppercase text-[9px] font-bold tracking-tighter italic">Waiting for grading...</span>
//                                 )}
//                               </td>
//                               <td className="px-8 py-5 text-center">
//                                 {latest ? (
//                                   <span className="font-black text-school-primary text-base">
//                                     {latest.score}<span className="text-slate-600 text-[10px] font-bold ml-1">/ {latest.maxScore}</span>
//                                   </span>
//                                 ) : (
//                                   <div className="flex items-center justify-center gap-2 text-slate-800">
//                                     <AlertCircle className="h-3 w-3" />
//                                     <span className="text-[10px] font-black uppercase">Pending</span>
//                                   </div>
//                                 )}
//                               </td>
//                               <td className="px-8 py-5 text-right">
//                                 <button className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-school-primary transition-colors border border-white/10 px-3 py-1.5 rounded-lg group-hover:border-school-primary/30">
//                                   Profile Info
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//               </Card>
//             ))
//           )}
//         </TabsContent>

//         {/* ── VIEW B: CLASS-CENTRIC ── */}
//         <TabsContent value="class" className="space-y-8 outline-none">
//           {classView.length === 0 ? (
//             <EmptyState 
//               icon={SearchX} 
//               title="Registry Unassigned" 
//               desc="You are not designated as the Class Teacher for any physical classroom groups."
//             />
//           ) : (
//             classView.map((cls) => (
//               <Card key={cls.id} className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
//                  <div className="bg-slate-950/50 p-8 border-b border-white/5">
//                     <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{cls.name} Master List</h3>
//                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 italic">Consolidated View — All Academic Subjects</p>
//                  </div>
//                  <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead className="bg-slate-950/30 text-[10px] uppercase font-black text-slate-600 tracking-widest">
//                         <tr>
//                           <th className="px-8 py-5 text-left">Identity</th>
//                           <th className="px-8 py-5 text-left">Recent Activity</th>
//                           <th className="px-8 py-5 text-center">Module Load</th>
//                           <th className="px-8 py-5 text-right">Performance Index</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-white/5">
//                         {cls.enrollments.map((e) => (
//                           <tr key={e.student.id} className="hover:bg-white/[0.02] transition-colors">
//                             <td className="px-8 py-5 font-bold text-slate-200 uppercase text-xs">{e.student.name}</td>
//                             <td className="px-8 py-5">
//                               <span className="text-slate-500 text-[10px] font-bold uppercase italic truncate max-w-[150px] block">
//                                 {e.student.assessments[0]?.gradeSubject?.subject?.name || "No active history"}
//                               </span>
//                             </td>
//                             <td className="px-8 py-5 text-center text-slate-400 font-mono text-xs">
//                                {e.student.assessments.length} Tests
//                             </td>
//                             <td className="px-8 py-5">
//                               <div className="flex items-center gap-3 justify-end">
//                                 <span className="text-[9px] font-black text-slate-600 uppercase">Health</span>
//                                 <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden border border-white/5">
//                                    <div className="h-full bg-school-primary shadow-[0_0_10px_rgba(245,158,11,0.3)]" style={{ width: '70%' }}></div>
//                                 </div>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                  </div>
//               </Card>
//             ))
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// interface EmptyStateProps {
//   icon: React.ElementType;
//   title: string;
//   desc: string;
// }

// function EmptyState({ icon: Icon, title, desc }: EmptyStateProps) {
//   return (
//     <div className="py-40 text-center bg-slate-900/30 rounded-[3.5rem] border border-dashed border-white/5">
//       <div className="h-20 w-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/5">
//         <Icon className="h-10 w-10 text-slate-700" />
//       </div>
//       <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{title}</h2>
//       <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto leading-relaxed">{desc}</p>
//     </div>
//   )
// }


// "use client"

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { 
//   BookOpen, Users, 
//   BookX, UserX, 
//   SearchX, AlertCircle, History
// } from "lucide-react"
// import { 
//   GradeSubject, 
//   Subject, 
//   Grade, 
//   StudentSubject, 
//   Profile, 
//   Assessment, 
//   Topic, 
//   Class, 
//   ClassEnrollment 
// } from "@prisma/client"
// import React from "react"

// // ── Utility ──────────────────────────────────────────────────────────────────



// // ── Strict Interfaces ────────────────────────────────────────────────────────

// // Extending Prisma types to include the relations used in the maps
// interface AssessmentWithDetails extends Assessment {
//   topic: Topic | null;
//   gradeSubject?: GradeSubject & { subject: Subject };
// }

// interface ProfileWithAssessments extends Profile {
//   assessments: AssessmentWithDetails[];
// }

// interface StudentSubjectWithDetails extends StudentSubject {
//   student: ProfileWithAssessments;
// }

// interface GradeSubjectView extends GradeSubject {
//   subject: Subject;
//   grade: Grade;
//   studentSubjects: StudentSubjectWithDetails[];
// }

// interface ClassEnrollmentWithDetails extends ClassEnrollment {
//   student: ProfileWithAssessments;
// }

// interface ClassView extends Class {
//   enrollments: ClassEnrollmentWithDetails[];
// }

// interface AssessmentDashboardProps {
//   data: {
//     subjectView?: GradeSubjectView[];
//     classView?: ClassView[];
//   };
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function AssessmentDashboard({ data }: AssessmentDashboardProps) {
//   const { subjectView = [], classView = [] } = data;

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
//       <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//         <div>
//           <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Assessment Registry</h1>
//           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-3">Grading & Performance Monitoring Environment</p>
//         </div>
//         <div className="bg-slate-900 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
//             <History className="h-4 w-4 text-school-primary" />
//             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Sync Active</span>
//         </div>
//       </header>

//       <Tabs defaultValue="subject" className="w-full">
//         <TabsList className="bg-slate-900 border border-white/5 p-1.5 rounded-2xl mb-10 w-fit">
//           <TabsTrigger value="subject" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-school-primary data-[state=active]:text-slate-950 font-black uppercase text-[10px] tracking-widest">
//             <BookOpen className="h-3.5 w-3.5 mr-2" /> My Assigned Subjects
//           </TabsTrigger>
//           <TabsTrigger value="class" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-school-primary data-[state=active]:text-slate-950 font-black uppercase text-[10px] tracking-widest">
//             <Users className="h-3.5 w-3.5 mr-2" /> My Classroom Registry
//           </TabsTrigger>
//         </TabsList>

//         {/* ── VIEW A: SUBJECT-CENTRIC ── */}
//         <TabsContent value="subject" className="space-y-8 outline-none">
//           {subjectView.length === 0 ? (
//             <EmptyState 
//               icon={BookX} 
//               title="No Subjects Claimed" 
//               desc="Your profile is not currently linked as a Lead Teacher to any subjects in the registry."
//             />
//           ) : (
//             subjectView.map((gs) => (
//               <Card key={gs.id} className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
//                 <div className="bg-slate-950/50 p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                   <div>
//                     <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{gs.subject.name}</h3>
//                     <p className="text-[10px] text-school-primary font-black uppercase tracking-[0.2em] mt-1">{gs.grade.displayName}</p>
//                   </div>
//                   <Badge variant="outline" className="bg-slate-950 text-slate-400 border-white/10 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
//                     {gs.studentSubjects.length} Registered Students
//                   </Badge>
//                 </div>

//                 <div className="overflow-x-auto">
//                   {gs.studentSubjects.length === 0 ? (
//                     <div className="py-20 text-center">
//                        <UserX className="h-10 w-10 text-slate-800 mx-auto mb-4" />
//                        <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest">No students have enrolled for this subject yet.</p>
//                     </div>
//                   ) : (
//                     <table className="w-full text-sm">
//                       <thead className="bg-slate-950/30 text-[10px] uppercase font-black text-slate-600 tracking-widest">
//                         <tr>
//                           <th className="px-8 py-5 text-left">Full Name</th>
//                           <th className="px-8 py-5 text-left">Latest Module</th>
//                           <th className="px-8 py-5 text-center">Current Score</th>
//                           <th className="px-8 py-5 text-right">Records</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-white/5">
//                         {gs.studentSubjects.map((ss) => {
//                           const latest = ss.student.assessments[0];
//                           return (
//                             <tr key={ss.student.id} className="hover:bg-white/[0.02] transition-colors group">
//                               <td className="px-8 py-5 font-bold text-slate-200 uppercase text-xs tracking-tight">{ss.student.name}</td>
//                               <td className="px-8 py-5">
//                                 {latest?.topic?.title ? (
//                                   <span className="text-slate-400 italic text-xs">{latest.topic.title}</span>
//                                 ) : (
//                                   <span className="text-slate-700 uppercase text-[9px] font-bold tracking-tighter italic">Waiting for grading...</span>
//                                 )}
//                               </td>
//                               <td className="px-8 py-5 text-center">
//                                 {latest ? (
//                                   <span className="font-black text-school-primary text-base">
//                                     {latest.score}<span className="text-slate-600 text-[10px] font-bold ml-1">/ {latest.maxScore}</span>
//                                   </span>
//                                 ) : (
//                                   <div className="flex items-center justify-center gap-2 text-slate-800">
//                                     <AlertCircle className="h-3 w-3" />
//                                     <span className="text-[10px] font-black uppercase">Pending</span>
//                                   </div>
//                                 )}
//                               </td>
//                               <td className="px-8 py-5 text-right">
//                                 <button className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-school-primary transition-colors border border-white/10 px-3 py-1.5 rounded-lg group-hover:border-school-primary/30">
//                                   Profile Info
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//               </Card>
//             ))
//           )}
//         </TabsContent>

//         {/* ── VIEW B: CLASS-CENTRIC ── */}
//         <TabsContent value="class" className="space-y-8 outline-none">
//           {classView.length === 0 ? (
//             <EmptyState 
//               icon={SearchX} 
//               title="Registry Unassigned" 
//               desc="You are not designated as the Class Teacher for any physical classroom groups."
//             />
//           ) : (
//             classView.map((cls) => (
//               <Card key={cls.id} className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
//                  <div className="bg-slate-950/50 p-8 border-b border-white/5">
//                     <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{cls.name} Master List</h3>
//                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 italic">Consolidated View — All Academic Subjects</p>
//                  </div>
//                  <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead className="bg-slate-950/30 text-[10px] uppercase font-black text-slate-600 tracking-widest">
//                         <tr>
//                           <th className="px-8 py-5 text-left">Identity</th>
//                           <th className="px-8 py-5 text-left">Recent Activity</th>
//                           <th className="px-8 py-5 text-center">Module Load</th>
//                           <th className="px-8 py-5 text-right">Performance Index</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-white/5">
//                         {cls.enrollments.map((e) => (
//                           <tr key={e.student.id} className="hover:bg-white/[0.02] transition-colors">
//                             <td className="px-8 py-5 font-bold text-slate-200 uppercase text-xs">{e.student.name}</td>
//                             <td className="px-8 py-5">
//                               <span className="text-slate-500 text-[10px] font-bold uppercase italic truncate max-w-[150px] block">
//                                 {e.student.assessments[0]?.gradeSubject?.subject?.name || "No active history"}
//                               </span>
//                             </td>
//                             <td className="px-8 py-5 text-center text-slate-400 font-mono text-xs">
//                                {e.student.assessments.length} Tests
//                             </td>
//                             <td className="px-8 py-5">
//                               <div className="flex items-center gap-3 justify-end">
//                                 <span className="text-[9px] font-black text-slate-600 uppercase">Health</span>
//                                 <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden border border-white/5">
//                                    <div className="h-full bg-school-primary shadow-[0_0_10px_rgba(245,158,11,0.3)]" style={{ width: '70%' }}></div>
//                                 </div>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                  </div>
//               </Card>
//             ))
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// interface EmptyStateProps {
//   icon: React.ElementType;
//   title: string;
//   desc: string;
// }

// function EmptyState({ icon: Icon, title, desc }: EmptyStateProps) {
//   return (
//     <div className="py-40 text-center bg-slate-900/30 rounded-[3.5rem] border border-dashed border-white/5">
//       <div className="h-20 w-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/5">
//         <Icon className="h-10 w-10 text-slate-700" />
//       </div>
//       <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{title}</h2>
//       <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto leading-relaxed">{desc}</p>
//     </div>
//   )
// }



// "use client";

// import React from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { 
//   BookOpen, Users, 
//   BookX, UserX, 
//   SearchX, AlertCircle, History,
//   ChevronRight
// } from "lucide-react";
// import { 
//   GradeSubject, 
//   Subject, 
//   Grade, 
//   StudentSubject, 
//   Profile, 
//   Assessment, 
//   Topic, 
//   Class, 
//   ClassEnrollment 
// } from "@prisma/client";
// import { cn } from "@/lib/utils";

// // ── Strict Interfaces (Rule 15) ─────────────────────────────────────────────

// interface AssessmentWithDetails extends Assessment {
//   topic: Topic | null;
//   gradeSubject?: GradeSubject & { subject: Subject };
// }

// interface ProfileWithAssessments extends Profile {
//   assessments: AssessmentWithDetails[];
// }

// interface StudentSubjectWithDetails extends StudentSubject {
//   student: ProfileWithAssessments;
// }

// interface GradeSubjectView extends GradeSubject {
//   subject: Subject;
//   grade: Grade;
//   studentSubjects: StudentSubjectWithDetails[];
// }

// interface ClassEnrollmentWithDetails extends ClassEnrollment {
//   student: ProfileWithAssessments;
// }

// interface ClassView extends Class {
//   enrollments: ClassEnrollmentWithDetails[];
// }

// interface AssessmentDashboardProps {
//   data: {
//     subjectView?: GradeSubjectView[];
//     classView?: ClassView[];
//   };
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * ASSESSMENT DASHBOARD (Tier 2/3)
//  * Rule 11: High-fidelity Registry Typography.
//  * Rule 18: Semantic Color Flip (Purged hardcoded Slates).
//  * Rule 20: Compulsory Responsiveness with fluid padding.
//  */
// export function AssessmentDashboard({ data }: AssessmentDashboardProps) {
//   const { subjectView = [], classView = [] } = data;

//   return (
//     <div className="max-w-7xl mx-auto w-full p-4 md:p-8 lg:p-12 space-y-10 animate-in fade-in duration-700">
      
//       {/* ── HEADER (Rule 11) ── */}
//       <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-10">
//         <div className="space-y-2">
//           <h1 className="text-2xl md:text-4xl font-extrabold text-foreground italic uppercase tracking-tighter leading-none">
//             Assessment Registry
//           </h1>
//           <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest flex items-center gap-2">
//             <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
//             Grading & Performance Monitoring Environment
//           </p>
//         </div>
//         <div className="bg-surface px-4 py-2 rounded-xl border border-border flex items-center gap-3 w-fit shadow-sm">
//             <History className="h-4 w-4 text-school-primary" />
//             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Sync Active</span>
//         </div>
//       </header>

//       <Tabs defaultValue="subject" className="w-full">
//         {/* Rule 19: Standardized 2xl for tabs list container */}
//         <TabsList className="bg-surface border border-border p-1.5 rounded-2xl mb-12 w-fit">
//           <TabsTrigger 
//             value="subject" 
//             className="rounded-xl px-8 py-3 data-[state=active]:bg-school-primary data-[state=active]:text-on-school-primary font-bold uppercase text-[10px] tracking-widest transition-all"
//           >
//             <BookOpen className="h-3.5 w-3.5 mr-2" /> Assigned Subjects
//           </TabsTrigger>
//           <TabsTrigger 
//             value="class" 
//             className="rounded-xl px-8 py-3 data-[state=active]:bg-school-primary data-[state=active]:text-on-school-primary font-bold uppercase text-[10px] tracking-widest transition-all"
//           >
//             <Users className="h-3.5 w-3.5 mr-2" /> Classroom Registry
//           </TabsTrigger>
//         </TabsList>

//         {/* ── VIEW A: SUBJECT-CENTRIC ── */}
//         <TabsContent value="subject" className="space-y-10 outline-none">
//           {subjectView.length === 0 ? (
//             <EmptyState 
//               icon={BookX} 
//               title="No Subjects Claimed" 
//               desc="Your profile is not currently linked as a Lead Teacher to any subjects in the registry."
//             />
//           ) : (
//             subjectView.map((gs) => (
//               <Card key={gs.id} className="bg-card border-border rounded-[2rem] overflow-hidden shadow-xl">
//                 <div className="bg-surface/50 p-8 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                   <div>
//                     <h3 className="text-2xl font-bold text-foreground italic uppercase tracking-tight">{gs.subject.name}</h3>
//                     <p className="text-[10px] text-school-primary font-bold uppercase tracking-widest mt-1">{gs.grade.displayName}</p>
//                   </div>
//                   <Badge variant="outline" className="bg-background text-muted-foreground border-border px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest">
//                     {gs.studentSubjects.length} Registered Students
//                   </Badge>
//                 </div>

//                 <div className="overflow-x-auto custom-scrollbar">
//                   {gs.studentSubjects.length === 0 ? (
//                     <div className="py-20 text-center flex flex-col items-center">
//                        <UserX className="h-10 w-10 text-muted-foreground/30 mb-4" />
//                        <p className="text-muted-foreground uppercase text-[10px] font-semibold tracking-widest">No subject enrollment detected.</p>
//                     </div>
//                   ) : (
//                     <table className="w-full text-sm">
//                       <thead className="bg-surface/30 text-[10px] uppercase font-semibold text-muted-foreground tracking-widest border-b border-border">
//                         <tr>
//                           <th className="px-8 py-5 text-left">Full Name</th>
//                           <th className="px-8 py-5 text-left">Latest Module</th>
//                           <th className="px-8 py-5 text-center">Current Score</th>
//                           <th className="px-8 py-5 text-right">Action</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-border">
//                         {gs.studentSubjects.map((ss) => {
//                           const latest = ss.student.assessments[0];
//                           return (
//                             <tr key={ss.student.id} className="hover:bg-muted/30 transition-colors group">
//                               <td className="px-8 py-5 font-bold text-foreground uppercase text-xs tracking-tight">{ss.student.name}</td>
//                               <td className="px-8 py-5">
//                                 {latest?.topic?.title ? (
//                                   <span className="text-muted-foreground italic text-xs">{latest.topic.title}</span>
//                                 ) : (
//                                   <span className="text-muted-foreground/40 uppercase text-[9px] font-semibold tracking-widest">Awaiting Registry Data...</span>
//                                 )}
//                               </td>
//                               <td className="px-8 py-5 text-center">
//                                 {latest ? (
//                                   <span className="font-bold text-school-primary text-base">
//                                     {latest.score}<span className="text-muted-foreground text-[10px] font-semibold ml-1">/ {latest.maxScore}</span>
//                                   </span>
//                                 ) : (
//                                   <div className="flex items-center justify-center gap-2 text-muted-foreground/40">
//                                     <AlertCircle className="h-3 w-3" />
//                                     <span className="text-[10px] font-bold uppercase tracking-widest">Pending</span>
//                                   </div>
//                                 )}
//                               </td>
//                               <td className="px-8 py-5 text-right">
//                                 <button className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-school-primary transition-colors border border-border px-4 py-2 rounded-xl group-hover:border-school-primary/30">
//                                   Profile <ChevronRight className="h-3 w-3" />
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//               </Card>
//             ))
//           )}
//         </TabsContent>

//         {/* ── VIEW B: CLASS-CENTRIC ── */}
//         <TabsContent value="class" className="space-y-10 outline-none">
//           {classView.length === 0 ? (
//             <EmptyState 
//               icon={SearchX} 
//               title="Registry Unassigned" 
//               desc="You are not designated as the Class Teacher for any physical classroom groups."
//             />
//           ) : (
//             classView.map((cls) => (
//               <Card key={cls.id} className="bg-card border-border rounded-[2rem] overflow-hidden shadow-xl">
//                  <div className="bg-surface/50 p-8 border-b border-border">
//                     <h3 className="text-2xl font-bold text-foreground italic uppercase tracking-tight">{cls.name} Master List</h3>
//                     <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mt-1 italic">Consolidated View — All Academic Subjects</p>
//                  </div>
//                  <div className="overflow-x-auto custom-scrollbar">
//                     <table className="w-full text-sm">
//                       <thead className="bg-surface/30 text-[10px] uppercase font-semibold text-muted-foreground tracking-widest border-b border-border">
//                         <tr>
//                           <th className="px-8 py-5 text-left">Identity</th>
//                           <th className="px-8 py-5 text-left">Recent Activity</th>
//                           <th className="px-8 py-5 text-center">Module Load</th>
//                           <th className="px-8 py-5 text-right">Performance Index</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-border">
//                         {cls.enrollments.map((e) => (
//                           <tr key={e.student.id} className="hover:bg-muted/30 transition-colors">
//                             <td className="px-8 py-5 font-bold text-foreground uppercase text-xs tracking-tight">{e.student.name}</td>
//                             <td className="px-8 py-5">
//                               <span className="text-muted-foreground text-[10px] font-semibold uppercase italic truncate max-w-[150px] block">
//                                 {e.student.assessments[0]?.gradeSubject?.subject?.name || "No active history"}
//                               </span>
//                             </td>
//                             <td className="px-8 py-5 text-center text-muted-foreground font-mono text-xs">
//                                {e.student.assessments.length} Tests
//                             </td>
//                             <td className="px-8 py-5">
//                               <div className="flex items-center gap-3 justify-end">
//                                 <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">Health</span>
//                                 <div className="h-2 w-28 bg-surface rounded-full overflow-hidden border border-border">
//                                    <div className="h-full bg-school-primary shadow-[0_0_10px_rgba(var(--school-primary-raw),0.3)]" style={{ width: '70%' }}></div>
//                                 </div>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                  </div>
//               </Card>
//             ))
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

// // ── Sub-Components (Registry Style) ─────────────────────────────────────────

// interface EmptyStateProps {
//   icon: React.ElementType;
//   title: string;
//   desc: string;
// }

// function EmptyState({ icon: Icon, title, desc }: EmptyStateProps) {
//   return (
//     <div className="py-32 md:py-48 text-center bg-card/40 rounded-[2rem] border border-dashed border-border flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 px-6">
//       <div className="h-20 w-20 bg-surface rounded-[1.5rem] flex items-center justify-center mb-8 shadow-lg border border-border">
//         <Icon className="h-10 w-10 text-muted-foreground/40" />
//       </div>
//       <h2 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter">{title}</h2>
//       <p className="text-muted-foreground text-xs font-medium mt-4 max-w-sm mx-auto leading-relaxed">{desc}</p>
//     </div>
//   );
// }



"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Users, 
  BookX, UserX, 
  SearchX, AlertCircle, History,
  ChevronRight
} from "lucide-react";
import { 
  GradeSubject, 
  Subject, 
  Grade, 
  StudentSubject, 
  Profile, 
  Assessment, 
  Topic, 
  Class, 
  ClassEnrollment 
} from "@prisma/client";
import { cn } from "@/lib/utils";

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface AssessmentWithDetails extends Assessment {
  topic: Topic | null;
  gradeSubject?: GradeSubject & { subject: Subject };
}

interface ProfileWithAssessments extends Profile {
  assessments: AssessmentWithDetails[];
}

interface StudentSubjectWithDetails extends StudentSubject {
  student: ProfileWithAssessments;
}

interface GradeSubjectView extends GradeSubject {
  subject: Subject;
  grade: Grade;
  studentSubjects: StudentSubjectWithDetails[];
}

interface ClassEnrollmentWithDetails extends ClassEnrollment {
  student: ProfileWithAssessments;
}

interface ClassView extends Class {
  enrollments: ClassEnrollmentWithDetails[];
}

interface AssessmentDashboardProps {
  data: {
    subjectView?: GradeSubjectView[];
    classView?: ClassView[];
  };
}

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * ASSESSMENT PERFORMANCE HUB (Tier 2/3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function AssessmentDashboard({ data }: AssessmentDashboardProps) {
  const { subjectView = [], classView = [] } = data;

  return (
    <div className="max-w-7xl mx-auto w-full p-4 md:p-8 lg:p-12 space-y-10 animate-in fade-in duration-700">
      
      {/* ── HEADER (Rule 11/21) ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-10">
        <div className="space-y-3">
          <h1 className="text-2xl md:text-4xl font-extrabold text-foreground italic uppercase tracking-tighter leading-none">
            Assessment Hub
          </h1>
          <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest flex items-center gap-2">
            {/* Rule 21: Scale Protocol Indicator */}
            <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse shadow-[0_0_8px_rgba(var(--school-primary-raw),0.5)]" />
            Grading & Performance Monitoring Sector
          </p>
        </div>
        <div className="bg-surface px-5 py-3 rounded-xl border border-border flex items-center gap-3 w-fit shadow-sm">
            <History className="h-4 w-4 text-school-primary" />
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest italic tabular-nums">Registry Sync Active</span>
        </div>
      </header>

      <Tabs defaultValue="subject" className="w-full">
        {/* ── TAB NAVIGATION (Rule 19) ── */}
        <TabsList className="bg-surface border border-border p-1.5 rounded-2xl mb-12 w-fit">
          <TabsTrigger 
            value="subject" 
            className="rounded-xl px-8 py-3 data-[state=active]:bg-school-primary data-[state=active]:text-on-school-primary font-extrabold uppercase text-[10px] tracking-widest transition-all active:scale-95"
          >
            <BookOpen className="h-3.5 w-3.5 mr-2" /> Assigned Modules
          </TabsTrigger>
          <TabsTrigger 
            value="class" 
            className="rounded-xl px-8 py-3 data-[state=active]:bg-school-primary data-[state=active]:text-on-school-primary font-extrabold uppercase text-[10px] tracking-widest transition-all active:scale-95"
          >
            <Users className="h-3.5 w-3.5 mr-2" /> Classroom Hubs
          </TabsTrigger>
        </TabsList>

        {/* ── VIEW A: MODULE-CENTRIC (Rule 18/20) ── */}
        <TabsContent value="subject" className="space-y-10 outline-none">
          {subjectView.length === 0 ? (
            <EmptyHub 
              icon={BookX} 
              title="No Modules Assigned" 
              desc="Your profile is not currently linked as a Lead Instructor to any modules in the registry."
            />
          ) : (
            subjectView.map((gs) => (
              <Card key={gs.id} className="bg-card border-border rounded-[2rem] overflow-hidden shadow-xl hover:border-school-primary-200 transition-all duration-300">
                <div className="bg-surface/50 p-8 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold text-foreground italic uppercase tracking-tighter">{gs.subject.name}</h3>
                    <p className="text-[10px] text-school-primary font-extrabold uppercase tracking-widest italic">{gs.grade.displayName} Registry</p>
                  </div>
                  <Badge variant="outline" className="bg-background text-muted-foreground border-border px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm">
                    {gs.studentSubjects.length} Synced Profiles
                  </Badge>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  {gs.studentSubjects.length === 0 ? (
                    <div className="py-24 text-center flex flex-col items-center opacity-40">
                       <UserX className="h-10 w-10 text-muted-foreground/30 mb-4" />
                       <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest italic">No identity enrollment discovered.</p>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-surface/30 text-[10px] uppercase font-bold text-muted-foreground tracking-widest border-b border-border">
                        <tr>
                          <th className="px-8 py-6 text-left italic">Full Identity</th>
                          <th className="px-8 py-6 text-left italic">Latest Module</th>
                          <th className="px-8 py-6 text-center italic">Proficiency</th>
                          <th className="px-8 py-6 text-right italic">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {gs.studentSubjects.map((ss) => {
                          const latest = ss.student.assessments[0];
                          return (
                            <tr key={ss.student.id} className="hover:bg-muted/30 transition-colors group">
                              <td className="px-8 py-6 font-extrabold text-foreground uppercase text-xs tracking-tight italic">{ss.student.name}</td>
                              <td className="px-8 py-6">
                                {latest?.topic?.title ? (
                                  <span className="text-muted-foreground italic text-xs font-medium">{latest.topic.title}</span>
                                ) : (
                                  <span className="text-muted-foreground/30 uppercase text-[9px] font-bold tracking-widest italic">Awaiting Hub Sync...</span>
                                )}
                              </td>
                              <td className="px-8 py-6 text-center">
                                {latest ? (
                                  <span className="font-extrabold text-school-primary text-base tabular-nums italic">
                                    {latest.score}<span className="text-muted-foreground/40 text-[10px] font-bold not-italic ml-1">/ {latest.maxScore}</span>
                                  </span>
                                ) : (
                                  <div className="flex items-center justify-center gap-2 text-muted-foreground/30">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Pending</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-8 py-6 text-right">
                                <button className="inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground hover:text-school-primary transition-all border border-border px-4 py-2 rounded-xl group-hover:border-school-primary/40 bg-surface shadow-sm active:scale-95">
                                  Audit Profile <ChevronRight className="h-3 w-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        {/* ── VIEW B: CLASS-CENTRIC (Rule 20) ── */}
        <TabsContent value="class" className="space-y-10 outline-none">
          {classView.length === 0 ? (
            <EmptyHub 
              icon={SearchX} 
              title="Registry Unassigned" 
              desc="You are not designated as the Lead Instructor for any classroom hubs."
            />
          ) : (
            classView.map((cls) => (
              <Card key={cls.id} className="bg-card border-border rounded-[2rem] overflow-hidden shadow-xl">
                 <div className="bg-surface/50 p-8 border-b border-border">
                    <h3 className="text-2xl font-extrabold text-foreground italic uppercase tracking-tighter leading-none">{cls.name} Registry</h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2 italic opacity-60">Consolidated Hub View — All Academic Modules</p>
                 </div>
                 <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm">
                      <thead className="bg-surface/30 text-[10px] uppercase font-bold text-muted-foreground tracking-widest border-b border-border">
                        <tr>
                          <th className="px-8 py-6 text-left italic">Identity Hub</th>
                          <th className="px-8 py-6 text-left italic">Recent Activity</th>
                          <th className="px-8 py-6 text-center italic">Module Load</th>
                          <th className="px-8 py-6 text-right italic">Performance Index</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {cls.enrollments.map((e) => (
                          <tr key={e.student.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-8 py-6 font-extrabold text-foreground uppercase text-xs tracking-tight italic">{e.student.name}</td>
                            <td className="px-8 py-6">
                              <span className="text-muted-foreground text-[10px] font-bold uppercase italic truncate max-w-[160px] block opacity-80">
                                {e.student.assessments[0]?.gradeSubject?.subject?.name || "No active history"}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-center text-muted-foreground font-mono text-xs tabular-nums font-bold">
                               {e.student.assessments.length} Syncs
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3 justify-end">
                                <span className="text-[9px] font-extrabold text-muted-foreground/40 uppercase tracking-widest italic">Health</span>
                                <div className="h-2 w-28 bg-surface rounded-full overflow-hidden border border-border shadow-inner">
                                   {/* Rule 21: Brand Color Hub Progress */}
                                   <div className="h-full bg-school-primary shadow-[0_0_10px_rgba(var(--school-primary-raw),0.3)]" style={{ width: '70%' }}></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Sub-Components (Registry Style) ─────────────────────────────────────────

interface EmptyHubProps {
  icon: React.ElementType;
  title: string;
  desc: string;
}

function EmptyHub({ icon: Icon, title, desc }: EmptyHubProps) {
  return (
    <div className="py-32 md:py-48 text-center bg-surface border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 px-6">
      {/* Rule 21: Scale Protocol for Empty States */}
      <div className="h-20 w-20 bg-card rounded-2xl flex items-center justify-center mb-8 shadow-lg border border-border">
        <Icon className="h-10 w-10 text-muted-foreground/20" />
      </div>
      <h2 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter">{title}</h2>
      <p className="text-muted-foreground text-[10px] font-bold mt-4 max-w-xs mx-auto leading-relaxed uppercase tracking-widest italic opacity-60">{desc}</p>
    </div>
  );
}