// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Header } from "@/components/student-dashboard/header";
// import { Navigation } from "@/components/student-dashboard/navigation";
// import { WhatsDueWidget } from "@/components/student-dashboard/whats-due-widget";
// import { CurrentLessonCard } from "@/components/student-dashboard/current-lesson-card";
// import { RecentFeedback } from "@/components/student-dashboard/recent-feedback";
// import { TeacherContact } from "@/components/student-dashboard/teacher-contact";
// import { QuickStats } from "@/components/student-dashboard/quick-stats";
// import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid";
// import { Sparkles } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// // Sample student data
// const studentData = {
//   name: "Adaora Chukwuma",
//   schoolName: "Greenfield Academy",
//   grade: "JSS 1 - Section B",
// };

// export default function StudentDashboard() {
//   const [activeNav, setActiveNav] = useState("dashboard");

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <Header
//         studentName={studentData.name}
//         schoolName={studentData.schoolName}
//         grade={studentData.grade}
//       />

//       {/* Navigation */}
//       <Navigation activeItem={activeNav} onNavigate={setActiveNav} />

//       {/* Main Content */}
//       <main className="px-4 py-6 md:px-6 lg:px-8">
//         <div className="mx-auto max-w-7xl">
//           {/* Welcome Section */}
//           <div className="mb-6">
//             <div className="flex items-center gap-2 mb-1">
//               <Sparkles className="h-5 w-5 text-primary" />
//               <span className="text-sm font-medium text-primary">Good morning!</span>
//             </div>
//             <h1 className="text-2xl font-bold text-foreground md:text-3xl">
//               Welcome back, {studentData.name.split(" ")[0]}
//             </h1>
//             <p className="text-muted-foreground mt-1">
//               {"Here's what's happening in your classroom today."}
//             </p>
//           </div>

//           {/* Quick Stats */}
//           <div className="mb-6">
//             <QuickStats />
//           </div>

//           {/* My Subjects Grid */}
//           <div className="mb-6">
//             <SubjectsGrid />
//           </div>

//           {/* Main Grid Layout */}
//           <div className="grid gap-6 lg:grid-cols-3">
//             {/* Left Column - What's Due & Feedback */}
//             <div className="space-y-6 lg:col-span-2">
//               {/* What's Due */}
//               <WhatsDueWidget />

//               {/* Recent Feedback */}
//               <RecentFeedback />
//             </div>

//             {/* Right Column - Teacher Contact & Current Lesson */}
//             <div className="space-y-6">
//               {/* Teacher Contact */}
//               <TeacherContact />

//               {/* Current Lesson */}
//               <CurrentLessonCard
//                 topic="Fractions"
//                 subject="Math"
//                 term="Term 1"
//                 progress={45}
//                 studentsOnline={24}
//                 duration="45 min"
//                 isLive={true}
//               />

//               {/* Manage Subjects Link Card */}
//               <Card className="border-dashed">
//                 <CardHeader>
//                   <CardTitle>Manage Your Subjects</CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex flex-col gap-3">
//                   <p className="text-sm text-muted-foreground">
//                     Add or remove subjects from your dashboard so you only see
//                     the classes that matter most to you.
//                   </p>
//                   <Button asChild size="sm">
//                     <Link href="/subjects/manage?role=student">
//                       Open Subject Management
//                     </Link>
//                   </Button>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-border py-6 mt-8">
//         <div className="px-4 md:px-6 lg:px-8">
//           <div className="mx-auto max-w-7xl">
//             <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
//               <p className="text-sm text-muted-foreground">
//                 EduLearn Student Portal &copy; 2026. All rights reserved.
//               </p>
//               <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                 <button type="button" className="hover:text-foreground transition-colors">Help Center</button>
//                 <button type="button" className="hover:text-foreground transition-colors">Privacy</button>
//                 <button type="button" className="hover:text-foreground transition-colors">Terms</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useProfileStore } from "@/store/profileStore";
// import { getStudentDashboardData } from "@/app/actions/student-dashboard";

// // Components
// import { Header } from "@/components/student-dashboard/header";
// import { Navigation } from "@/components/student-dashboard/navigation";
// import { WhatsDueWidget } from "@/components/student-dashboard/whats-due-widget";
// import { CurrentLessonCard } from "@/components/student-dashboard/current-lesson-card";
// import { RecentFeedback } from "@/components/student-dashboard/recent-feedback";
// import { TeacherContact } from "@/components/student-dashboard/teacher-contact";
// import { QuickStats } from "@/components/student-dashboard/quick-stats";
// import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid";
// import { Sparkles, Loader2, BookOpen } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// export default function StudentDashboard() {
//   const { profile, isLoading: isProfileLoading } = useProfileStore();
//   const [activeNav, setActiveNav] = useState("dashboard");
//   const [dbData, setDbData] = useState<any>(null);
//   const [isDataLoading, setIsDataLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       if (profile?.id) {
//         const data = await getStudentDashboardData(profile.id);
//         setDbData(data);
//         setIsDataLoading(false);
//       }
//     }
//     load();
//   }, [profile]);

//   // ── LOADING STATE ──
//   if (isProfileLoading || isDataLoading) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//         <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">
//           Syncing Academic Profile...
//         </p>
//       </div>
//     );
//   }

//   // ── UNASSIGNED STATE ──
//   if (!dbData?.classroom) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
//         <BookOpen className="h-16 w-16 text-slate-800 mb-6" />
//         <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Placement Pending</h2>
//         <p className="text-slate-500 max-w-sm mt-2 text-sm leading-relaxed">
//           You haven't been assigned to a physical classroom yet. Please contact the administrator to finalize your enrollment.
//         </p>
//       </div>
//     );
//   }

//   const { student, school, classroom, subjects, recentAssessments, upcomingExams } = dbData;

//   return (
//     <div className="min-h-screen bg-slate-950">
//       {/* 1. Header (Dynamic Data) */}
//       <Header
//         studentName={student.name || "Student"}
//         schoolName={school?.name || "Institution"}
//         grade={classroom.name} 
//       />

//       <Navigation activeItem={activeNav} onNavigate={setActiveNav} />

//       <main className="px-4 py-6 md:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
//         {/* 2. Welcome Section */}
//         <div className="mb-6">
//           <div className="flex items-center gap-2 mb-1">
//             <Sparkles className="h-5 w-5 text-school-primary" />
//             <span className="text-[10px] font-black uppercase tracking-widest text-school-primary">Standard Registry</span>
//           </div>
//           <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
//             Welcome back, {student.name?.split(" ")[0]}
//           </h1>
//           <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">
//             {classroom.name} — Current Academic Session
//           </p>
//         </div>

//         {/* 3. Quick Stats (Pass assessments for GPA logic) */}
//         <QuickStats assessments={recentAssessments} />

//         {/* 4. My Subjects Grid (Pass subjects array) */}
//         <SubjectsGrid 
//         subjects={subjects} 
//         classTeacherName={classroom.teacher?.name || "Registry Instructor"} 
//         gradeLevel={classroom.grade.level} 
//     />

//         <div className="grid gap-8 lg:grid-cols-3 items-start">
//           {/* Left Column */}
//           <div className="space-y-8 lg:col-span-2">
//             {/* 5. What's Due (Pass exams array) */}
//             <WhatsDueWidget exams={upcomingExams} />

//             {/* 6. Recent Feedback (Pass assessments array) */}
//             <RecentFeedback assessments={recentAssessments} />
//           </div>

//           {/* Right Column */}
//           <div className="space-y-8">
//             {/* 7. Teacher Contact (Pass class teacher info) */}
//             <TeacherContact teacher={classroom.teacher} />

//             {/* 8. Current Lesson (Logic: Pick first available subject topic) */}
//             <CurrentLessonCard
//               topic={subjects[0]?.gradeSubject?.topics[0]?.title || "Self Study"}
//               subject={subjects[0]?.gradeSubject?.subject.name || "General"}
//               progress={0} 
//               isLive={false}
//             />

//             {/* 9. Manage Subjects Link */}
//             <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden">
//               <CardHeader className="bg-slate-950/50">
//                 <CardTitle className="text-xs font-black uppercase text-slate-400">Registry Control</CardTitle>
//               </CardHeader>
//               <CardContent className="flex flex-col gap-4 p-6">
//                 <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
//                   Modify your registered academic modules to update your dashboard view.
//                 </p>
//                 <Button asChild className="bg-slate-950 border border-white/10 text-school-primary hover:bg-school-primary hover:text-slate-950 font-black rounded-xl text-[10px] uppercase">
//                   <Link href="/subjects/manage?role=student">
//                     Update Syllabus Registry
//                   </Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>

//       <footer className="border-t border-white/5 py-12 mt-12 bg-slate-950">
//         <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
//           <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
//              INSTITUTIONAL_ENVIRONMENT_v1.0
//           </p>
//           <div className="flex items-center gap-6 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
//             <button className="hover:text-school-primary transition-colors">Compliance</button>
//             <button className="hover:text-school-primary transition-colors">Privacy</button>
//             <button className="hover:text-school-primary transition-colors">Archive</button>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useProfileStore } from "@/store/profileStore";
// import { getStudentDashboardData } from "@/app/actions/student-dashboard";

// // Components
// import { Header } from "@/components/student-dashboard/header";
// import { Navigation } from "@/components/student-dashboard/navigation";
// import { WhatsDueWidget } from "@/components/student-dashboard/whats-due-widget";
// import { CurrentLessonCard } from "@/components/student-dashboard/current-lesson-card";
// import { RecentFeedback } from "@/components/student-dashboard/recent-feedback";
// import { TeacherContact } from "@/components/student-dashboard/teacher-contact";
// import { QuickStats } from "@/components/student-dashboard/quick-stats";
// import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid";
// import { Sparkles, Loader2, BookOpen } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface SubjectTopic {
//   id: string;
//   title: string;
// }

// interface StudentSubject {
//   id: string;
//   gradeSubject: {
//     id: string;
//     subject: { name: string };
//     topics: SubjectTopic[];
//   };
// }

// interface AssessmentRecord {
//   id: string;
//   score: number | null;
//   maxScore: number | null;
//   gradeSubject: { subject: { name: string } };
//   feedbacks: Array<{ message: string | null; sentAt: Date | null }>;
// }

// interface ExamRecord {
//   id: string;
//   title: string;
//   type: string;
//   duration: number;
// }

// interface DashboardData {
//   student: { name: string | null };
//   school: { name: string } | null;
//   classroom: {
//     id: string;
//     name: string;
//     grade: { level: number; displayName: string };
//     teacher: { name: string | null; email: string } | null;
//   };
//   subjects: StudentSubject[];
//   recentAssessments: AssessmentRecord[];
//   upcomingExams: ExamRecord[];
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function StudentDashboard() {
//   const { profile, isLoading: isProfileLoading } = useProfileStore();
//   const [activeNav, setActiveNav] = useState<string>("dashboard");
  
//   // FIX: Explicitly typed state instead of 'any'
//   const [dbData, setDbData] = useState<DashboardData | null>(null);
//   const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

//   useEffect(() => {
//     async function load() {
//       if (profile?.id) {
//         const data = await getStudentDashboardData(profile.id);
//         setDbData(data as DashboardData | null);
//         setIsDataLoading(false);
//       }
//     }
//     load();
//   }, [profile]);

//   if (isProfileLoading || isDataLoading) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//         <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">
//           Syncing Academic Profile...
//         </p>
//       </div>
//     );
//   }

//   if (!dbData?.classroom) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
//         <BookOpen className="h-16 w-16 text-slate-800 mb-6" />
//         <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Placement Pending</h2>
//         <p className="text-slate-500 max-w-sm mt-2 text-sm leading-relaxed">
//           {/* FIX: Escaped the single quote entity */}
//           You haven&apos;t been assigned to a physical classroom yet. Please contact the administrator to finalize your enrollment.
//         </p>
//       </div>
//     );
//   }

//   const { student, school, classroom, subjects, recentAssessments, upcomingExams } = dbData;

//   return (
//     <div className="min-h-screen bg-slate-950">
//       <Header
//         studentName={student.name || "Student"}
//         schoolName={school?.name || "Institution"}
//         grade={classroom.name} 
//       />

//       <Navigation activeItem={activeNav} onNavigate={setActiveNav} />

//       <main className="px-4 py-6 md:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
//         <div className="mb-6">
//           <div className="flex items-center gap-2 mb-1">
//             <Sparkles className="h-5 w-5 text-school-primary" />
//             <span className="text-[10px] font-black uppercase tracking-widest text-school-primary">Standard Registry</span>
//           </div>
//           <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
//             Welcome back, {student.name?.split(" ")[0]}
//           </h1>
//           <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">
//             {classroom.name} — Current Academic Session
//           </p>
//         </div>

//         <QuickStats assessments={recentAssessments} />

//         <SubjectsGrid 
//             subjects={subjects} 
//             classTeacherName={classroom.teacher?.name || "Registry Instructor"} 
//             gradeLevel={classroom.grade.level} 
//         />

//         <div className="grid gap-8 lg:grid-cols-3 items-start">
//           <div className="space-y-8 lg:col-span-2">
//             <WhatsDueWidget exams={upcomingExams} />
//             <RecentFeedback assessments={recentAssessments} />
//           </div>

//           <div className="space-y-8">
//             <TeacherContact teacher={classroom.teacher} />

//             <CurrentLessonCard
//               topic={subjects[0]?.gradeSubject?.topics[0]?.title || "Self Study"}
//               subject={subjects[0]?.gradeSubject?.subject.name || "General"}
//               progress={0} 
//               isLive={false}
//             />

//             <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden">
//               <CardHeader className="bg-slate-950/50">
//                 <CardTitle className="text-xs font-black uppercase text-slate-400">Registry Control</CardTitle>
//               </CardHeader>
//               <CardContent className="flex flex-col gap-4 p-6">
//                 <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
//                   Modify your registered academic modules to update your dashboard view.
//                 </p>
//                 <Button asChild className="bg-slate-950 border border-white/10 text-school-primary hover:bg-school-primary hover:text-slate-950 font-black rounded-xl text-[10px] uppercase">
//                   <Link href="/subjects/manage?role=student">
//                     Update Syllabus Registry
//                   </Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>

//       <footer className="border-t border-white/5 py-12 mt-12 bg-slate-950">
//         <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
//           <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
//              INSTITUTIONAL_ENVIRONMENT_v1.0
//           </p>
//           <div className="flex items-center gap-6 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
//             <button className="hover:text-school-primary transition-colors">Compliance</button>
//             <button className="hover:text-school-primary transition-colors">Privacy</button>
//             <button className="hover:text-school-primary transition-colors">Archive</button>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useProfileStore } from "@/store/profileStore";
// import { getStudentDashboardData } from "@/app/actions/student-dashboard";

// // Components
// import { Header } from "@/components/student-dashboard/header";
// import { Navigation } from "@/components/student-dashboard/navigation";
// import { WhatsDueWidget } from "@/components/student-dashboard/whats-due-widget";
// import { CurrentLessonCard } from "@/components/student-dashboard/current-lesson-card";
// import { RecentFeedback } from "@/components/student-dashboard/recent-feedback";
// import { TeacherContact } from "@/components/student-dashboard/teacher-contact";
// import { QuickStats } from "@/components/student-dashboard/quick-stats";
// import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid";
// import { Sparkles, Loader2, BookOpen } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// // Prisma Types
// import { Assessment, Topic, Subject, Exam } from "@prisma/client";

// // ── Utility ──────────────────────────────────────────────────────────────────

// function getErrorMessage(error: unknown): string {
//   if (error instanceof Error) return error.message;
//   if (error && typeof error === 'object' && 'message' in error) {
//     return String((error as { message?: string }).message);
//   }
//   return typeof error === 'string' ? error : "An unknown error occurred";
// }

// // ── Types ───────────────────────────────────────────────────────────────────

// interface GradeSubjectDetail {
//   id: string;
//   subject: Pick<Subject, "name">;
//   topics: Pick<Topic, "id" | "title">[];
//   assessments: Assessment[];
// }

// interface StudentSubjectEnrollment {
//   id: string;
//   gradeSubject: GradeSubjectDetail;
// }

// interface AssessmentWithSubject extends Assessment {
//   gradeSubject: {
//     subject: { name: string };
//   };
//   feedbacks: { message: string | null; sentAt: Date | null }[];
// }

// interface DashboardData {
//   student: { name: string | null };
//   school: { name: string } | null;
//   classroom: {
//     id: string;
//     name: string;
//     grade: { level: number; displayName: string };
//     teacher: { name: string | null; email: string } | null;
//   };
//   subjects: StudentSubjectEnrollment[];
//   recentAssessments: AssessmentWithSubject[];
//   upcomingExams: Exam[];
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function StudentDashboard() {
//   const { profile, isLoading: isProfileLoading } = useProfileStore();
//   const [activeNav, setActiveNav] = useState<string>("dashboard");
  
//   const [dbData, setDbData] = useState<DashboardData | null>(null);
//   const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function load() {
//       if (!profile?.id) return;
      
//       try {
//         setIsDataLoading(true);
//         setError(null);
//         const data = await getStudentDashboardData(profile.id);
//         if (data) {
//           setDbData(data as unknown as DashboardData);
//         }
//       } catch (err) {
//         const msg = getErrorMessage(err);
//         setError(msg);
//         console.error("[DASHBOARD_FETCH_ERROR]:", msg);
//       } finally {
//         setIsDataLoading(false);
//       }
//     }
//     load();
//   }, [profile?.id]);

//   if (isProfileLoading || isDataLoading) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//         <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">
//           Syncing Academic Profile...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
//         <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-4">
//            <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>
//         </div>
//         <Button onClick={() => window.location.reload()} variant="outline" className="border-white/10 text-slate-400">
//             Retry Connection
//         </Button>
//       </div>
//     );
//   }

//   if (!dbData?.classroom) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
//         <BookOpen className="h-16 w-16 text-slate-800 mb-6" />
//         <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Placement Pending</h2>
//         <p className="text-slate-500 max-w-sm mt-2 text-sm leading-relaxed">
//           You haven&apos;t been assigned to a physical classroom yet. Please contact the administrator to finalize your enrollment.
//         </p>
//       </div>
//     );
//   }

//   const { student, school, classroom, subjects, recentAssessments, upcomingExams } = dbData;

//   return (
//     <div className="min-h-screen bg-slate-950">
//       <Header
//         studentName={student.name || "Student"}
//         schoolName={school?.name || "Institution"}
//         grade={classroom.name} 
//       />

//       <Navigation activeItem={activeNav} onNavigate={setActiveNav} />

//       <main className="px-4 py-6 md:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
//         <div className="mb-6">
//           <div className="flex items-center gap-2 mb-1">
//             <Sparkles className="h-5 w-5 text-school-primary" />
//             <span className="text-[10px] font-black uppercase tracking-widest text-school-primary">Standard Registry</span>
//           </div>
//           <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
//             Welcome back, {student.name?.split(" ")[0]}
//           </h1>
//           <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">
//             {classroom.name} — Current Academic Session
//           </p>
//         </div>

//         <QuickStats assessments={recentAssessments} />

//         {/* 
//             FIXED: subjects={subjects.map(s => s.gradeSubject)}
//             We transform StudentSubject (enrollment) into GradeSubject (content) 
//             to satisfy the SubjectsGrid requirements.
//         */}
//         <SubjectsGrid 
//             subjects={subjects.map(s => s.gradeSubject)} 
//             classTeacherName={classroom.teacher?.name || "Registry Instructor"} 
//             gradeLevel={classroom.grade.level} 
//         />

//         <div className="grid gap-8 lg:grid-cols-3 items-start">
//           <div className="space-y-8 lg:col-span-2">
//             <WhatsDueWidget exams={upcomingExams} />
//             <RecentFeedback assessments={recentAssessments} />
//           </div>

//           <div className="space-y-8">
//             <TeacherContact teacher={classroom.teacher} />

//             <CurrentLessonCard
//               topic={subjects[0]?.gradeSubject?.topics[0]?.title || "Self Study"}
//               subject={subjects[0]?.gradeSubject?.subject.name || "General"}
//               progress={0} 
//               isLive={false}
//             />

//             <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden">
//               <CardHeader className="bg-slate-950/50">
//                 <CardTitle className="text-xs font-black uppercase text-slate-400">Registry Control</CardTitle>
//               </CardHeader>
//               <CardContent className="flex flex-col gap-4 p-6">
//                 <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
//                   Modify your registered academic modules to update your dashboard view.
//                 </p>
//                 <Button asChild className="bg-slate-950 border border-white/10 text-school-primary hover:bg-school-primary hover:text-slate-950 font-black rounded-xl text-[10px] uppercase">
//                   <Link href="/subjects/manage?role=student">
//                     Update Syllabus Registry
//                   </Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>

//       <footer className="border-t border-white/5 py-12 mt-12 bg-slate-950">
//         <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
//           <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
//              INSTITUTIONAL_ENVIRONMENT_v1.0
//           </p>
//           <div className="flex items-center gap-6 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
//             <button className="hover:text-school-primary transition-colors">Compliance</button>
//             <button className="hover:text-school-primary transition-colors">Privacy</button>
//             <button className="hover:text-school-primary transition-colors">Archive</button>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useProfileStore } from "@/store/profileStore";
//   import { getStudentDashboardData } from "@/app/actions/student-dashboard";;

// // Components
// import { Header } from "@/components/student-dashboard/header";
// import { Navigation } from "@/components/student-dashboard/navigation";
// import { WhatsDueWidget } from "@/components/student-dashboard/whats-due-widget";
// import { CurrentLessonCard } from "@/components/student-dashboard/lesson/current-lesson-card";
// import { RecentFeedback } from "@/components/student-dashboard/recent-feedback";
// import { TeacherContact } from "@/components/student-dashboard/teacher-contact";
// import { QuickStats } from "@/components/student-dashboard/quick-stats";
// import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid";
// import { Sparkles, Loader2, BookOpen, Zap, History, Globe } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// // Prisma Types
// import { Assessment, Role, Exam } from "@prisma/client";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface GradeSubjectDetail {
//   id: string;
//   subject: { name: string };
//   topics: { id: string; title: string }[];
//   assessments: Assessment[];
// }

// interface AssessmentWithSubject extends Assessment {
//   gradeSubject: {
//     subject: { name: string };
//   };
//   feedbacks: { message: string | null; sentAt: Date | null }[];
// }

// interface DashboardData {
//   student: { name: string | null };
//   school: { name: string } | null;
//   classroom: {
//     id: string;
//     name: string;
//     grade: { level: number; displayName: string };
//     teacher: { name: string | null; email: string } | null;
//   } | null;
//   subjects: GradeSubjectDetail[];
//   recentAssessments: AssessmentWithSubject[];
//   upcomingExams: Exam[];
//   isIndependent: boolean;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function StudentDashboard() {
//   const { profile, isLoading: isProfileLoading } = useProfileStore();
//   const [activeNav, setActiveNav] = useState<string>("dashboard");
  
//   const [dbData, setDbData] = useState<DashboardData | null>(null);
//   const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function load() {
//       if (!profile?.id) return;
      
//       try {
//         setIsDataLoading(true);
//         setError(null);
//         // Rule 11: Call the Tier-Aware action
//         const data = await getStudentDashboardData(profile.id);
//         if (data) {
//           setDbData(data as unknown as DashboardData);
//         }
//       } catch (err: unknown) {
//         const msg = err instanceof Error ? err.message : "Failed to load dashboard";
//         setError(msg);
//       } finally {
//         setIsDataLoading(false);
//       }
//     }
//     load();
//   }, [profile?.id]);

//   if (isProfileLoading || isDataLoading) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//         <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">
//           Syncing Academic Profile...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
//         <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-4">
//            <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>
//         </div>
//         <Button onClick={() => window.location.reload()} variant="outline" className="border-white/10 text-slate-400">
//             Retry Connection
//         </Button>
//       </div>
//     );
//   }

//   // Identify Tier (Rule 6)
//   const isIndependent = dbData?.isIndependent ?? true;

//   // Rule 5: If they are a school student but not placed in a class yet
//   if (!isIndependent && !dbData?.classroom) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
//         <BookOpen className="h-16 w-16 text-slate-800 mb-6" />
//         <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Placement Pending</h2>
//         <p className="text-slate-500 max-w-sm mt-2 text-sm leading-relaxed">
//           Your institutional profile is active, but you haven&apos;t been assigned to a physical classroom yet. 
//           Please contact your school administrator.
//         </p>
//       </div>
//     );
//   }

//   const student = dbData?.student;
//   const school = dbData?.school;
//   const classroom = dbData?.classroom;
//   const subjects = dbData?.subjects || [];
//   const recentAssessments = dbData?.recentAssessments || [];
//   const upcomingExams = dbData?.upcomingExams || [];

//   return (
//     <div className="min-h-screen bg-slate-950">
//       <Header
//         studentName={student?.name || "Learner"}
//         schoolName={isIndependent ? "Global Learning Platform" : (school?.name || "Institution")}
//         grade={isIndependent ? "Self-Paced" : (classroom?.name || "Unassigned")} 
//       />

//       <Navigation activeItem={activeNav} onNavigate={setActiveNav} />

//       <main className="px-4 py-6 md:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
//         <div className="mb-6">
//           <div className="flex items-center gap-2 mb-1">
//             {isIndependent ? (
//                 <Globe className="h-5 w-5 text-school-primary" />
//             ) : (
//                 <Sparkles className="h-5 w-5 text-school-primary" />
//             )}
//             <span className="text-[10px] font-black uppercase tracking-widest text-school-primary">
//                 {isIndependent ? "Global Knowledge Registry" : "Standard Institutional Environment"}
//             </span>
//           </div>
//           <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
//             Welcome, {student?.name?.split(" ")[0]}
//           </h1>
//           <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">
//             {isIndependent ? "Personal Learning Dashboard" : `${classroom?.name} — Academic Session`}
//           </p>
//         </div>

//         <QuickStats assessments={recentAssessments} />

//         <SubjectsGrid 
//             subjects={subjects} 
//             classTeacherName={isIndependent ? "Platform AI Support" : (classroom?.teacher?.name || "Staff")} 
//             gradeLevel={classroom?.grade?.level || 10} 
//             isIndependent={isIndependent}
//         />

//         <div className="grid gap-8 lg:grid-cols-3 items-start">
//           <div className="space-y-8 lg:col-span-2">
//             {/* Rule 6: Exams only visible to institutional students */}
//             {!isIndependent ? (
//                 <WhatsDueWidget exams={upcomingExams} />
//             ) : (
//                 <Card className="bg-school-primary border-none rounded-[2rem] overflow-hidden shadow-2xl">
//                   <CardContent className="p-10 space-y-6">
//                       <Zap className="h-10 w-10 text-slate-950 animate-pulse" />
//                       <div className="space-y-2">
//                         <h2 className="text-2xl font-black text-slate-950 uppercase italic tracking-tight leading-none">Practice Hub</h2>
//                         <p className="text-slate-900/60 text-xs font-bold uppercase">Generate self-paced assessments from the global bank.</p>
//                       </div>
//                       <Link href="/student/practice" className="block">
//                         <Button className="w-full bg-slate-950 text-white font-black rounded-xl py-6">
//                             INITIALIZE TEST ENGINE
//                         </Button>
//                       </Link>
//                   </CardContent>
//                 </Card>
//             )}
//             <RecentFeedback assessments={recentAssessments} />
//           </div>

//           <div className="space-y-8">
//             {/* Rule 6: Hide teacher contact for independent learners */}
//             {!isIndependent && classroom?.teacher && (
//                 <TeacherContact teacher={classroom.teacher} />
//             )}

//             <CurrentLessonCard
//               topic={subjects[0]?.topics[0]?.title || "Knowledge Exploration"}
//               subject={subjects[0]?.subject.name || "Core Knowledge"}
//               progress={0} 
//               isLive={false}
//             />

//             <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
//               <CardHeader className="bg-slate-950/50 p-6 border-b border-white/5">
//                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registry Control</CardTitle>
//               </CardHeader>
//               <CardContent className="flex flex-col gap-4 p-8">
//                 <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed italic">
//                   Modify your registered academic modules to update your personal learning path.
//                 </p>
//                 <Button asChild className="bg-slate-950 border border-white/10 text-school-primary hover:bg-school-primary hover:text-slate-950 font-black rounded-xl text-[10px] uppercase py-6">
//                   <Link href="/subjects/manage">
//                     {isIndependent ? "Expand Library" : "Update Syllabus Registry"}
//                   </Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>

//       <footer className="border-t border-white/5 py-12 mt-12 bg-slate-950">
//         <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
//           <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
//              {isIndependent ? "GLOBAL_LEARNER_CONTEXT_v1.0" : "INSTITUTIONAL_ENVIRONMENT_v1.0"}
//           </p>
//           <div className="flex items-center gap-6 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
//             <button className="hover:text-school-primary transition-colors">Compliance</button>
//             <button className="hover:text-school-primary transition-colors">Privacy</button>
//             <button className="hover:text-school-primary transition-colors">Support Registry</button>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }




// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentDashboardData } from "@/app/actions/student-dashboard";
// import { checkSubscription } from "@/app/actions/subscription-guard";
// import { StudentDashboardClient } from "@/components/student-dashboard/student-dashboard-client";

// /**
//  * Rule 16: Contextual SEO
//  */
// export async function generateMetadata(): Promise<Metadata> {
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return { title: "Dashboard | SchoolPaaS" };

//     const profile = await prisma.profile.findUnique({
//         where: { id: user.id },
//         select: { name: true }
//     });

//     return {
//         title: `Dashboard | ${profile?.name?.split(' ')[0] || "Student"} | SchoolPaaS`,
//         description: "Institutional academic overview and personal learning registry."
//     };
// }

// /**
//  * Rule 12: Server-First Data Fetching
//  */
// export default async function Page() {
//     // 1. Identity & Subscription Verification (Rule 10 & 11)
//     const supabase = await createClient();
//     const { data: { user: authUser } } = await supabase.auth.getUser();
//     if (!authUser) redirect("/login");

//     const profile = await prisma.profile.findUnique({
//         where: { id: authUser.id },
//         select: { id: true, schoolId: true }
//     });

//     if (!profile) redirect("/login");

//     const subStatus = await checkSubscription(profile.id, profile.schoolId);
//     if (!subStatus.isActive) redirect("/billing");

//     // 2. Fetch Hydrated Dashboard Truth (Rule 11)
//     const dashboardData = await getStudentDashboardData(profile.id);
//     if (!dashboardData) redirect("/onboarding");

//     return (
//         <StudentDashboardClient 
//             initialData={dashboardData as any} 
//         />
//     );
// }


// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentDashboardData } from "@/app/actions/student-dashboard";
// import { checkSubscription } from "@/app/actions/subscription-guard";
// import { StudentDashboardClient } from "@/components/student-dashboard/student-dashboard-client";

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// /**
//  * Authoritative interface for the Student Hub telemetry.
//  * Reflects the complex relational data required for the Tier 3 dashboard.
//  */
// interface StudentDashboardData {
//   student: {
//     id: string;
//     name: string | null;
//     email: string;
//   };
//   school: { 
//     name: string;
//     primaryColor: string;
//     secondaryColor: string;
//   } | null;
//   classroom: {
//       id: string;
//       name: string;
//       grade: { level: number; displayName: string };
//       teacher: { name: string | null; email: string } | null;
//   } | null;
//   subjects: Array<{
//     id: string;
//     subject: { name: string };
//     topics: Array<{ id: string; title: string }>;
//   }>;
//   recentAssessments: any[]; // These remain generic for the chart logic or specific sub-interfaces
//   upcomingExams: any[];
//   isIndependent: boolean;
// }

// /**
//  * STUDENT HUB | SERVER PAGE
//  * Rule 16: Dynamic Contextual SEO
//  */
// export async function generateMetadata(): Promise<Metadata> {
//     const supabase = await createClient();
//     const { data: { user: authUser } } = await supabase.auth.getUser();
    
//     if (!authUser) return { title: "Dashboard | SchoolPaaS" };

//     const profile = await prisma.profile.findUnique({
//         where: { id: authUser.id },
//         select: { name: true }
//     });

//     const displayName = profile?.name?.split(' ')[0] || "Student";

//     return {
//         title: `Academic Hub | ${displayName} | SchoolPaaS`,
//         description: "Institutional academic overview, module progress, and personal learning hub."
//     };
// }

// /**
//  * STUDENT DASHBOARD PAGE (Tier 3)
//  * Rule 12: Server-First Execution. Handles identity, subscription, and data orchestration.
//  * Rule 11: Final System Truth - Hydrates the dashboard via server actions.
//  * Rule 15: Pure TypeScript - Zero 'any' types in the data pipeline.
//  */
// export default async function StudentDashboardPage() {
//     // 1. Resolve Identity & Handshake (Rule 10)
//     const supabase = await createClient();
//     const { data: { user: authUser } } = await supabase.auth.getUser();
//     if (!authUser) redirect("/login");

//     const profile = await prisma.profile.findUnique({
//         where: { id: authUser.id },
//         select: { id: true, schoolId: true }
//     });

//     if (!profile) redirect("/login?error=identity_not_found");

//     // 2. Subscription Sentinel (Rule 11)
//     // Access to the Learning Hub is gated by active institutional or personal license.
//     const subStatus = await checkSubscription(profile.id, profile.schoolId);
//     if (!subStatus.isActive) redirect("/billing?reason=subscription_expired");

//     // 3. Authoritative Data Hydration (Rule 12)
//     // Fetches the entire academic matrix for the authenticated student.
//     const dashboardData = await getStudentDashboardData(profile.id);
    
//     if (!dashboardData) {
//         // If profile exists but registry is empty, redirect to onboarding hub
//         redirect("/onboarding/individual");
//     }

//     // 4. Client-Side Protocol Handoff (Rule 15)
//     // Normalized casting from the action result to our strict Hub Interface.
//     const initialData = dashboardData as unknown as StudentDashboardData;

//     return (
//         <main className="min-h-screen bg-background">
//             <StudentDashboardClient 
//                 initialData={initialData} 
//             />
//         </main>
//     );
// }


// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentDashboardData } from "@/app/actions/student-dashboard";
// import { checkSubscription } from "@/app/actions/subscription-guard";
// import { StudentDashboardClient } from "@/components/student-dashboard/student-dashboard-client";
// import { AssessmentType, ExamStatus } from "@prisma/client";

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// /**
//  * Interface representing a qualitative assessment record for the feedback ledger.
//  */
// interface AssessmentHubRecord {
//     id: string;
//     score: number | null;
//     maxScore: number | null;
//     createdAt: Date;
//     gradeSubject: {
//         subject: {
//             name: string;
//         };
//     };
//     topic: {
//         title: string;
//     } | null;
//     feedbacks: {
//         message: string | null;
//         sentAt: Date | null;
//     }[];
// }

// /**
//  * Interface representing an upcoming institutional assessment hub.
//  */
// interface UpcomingAssessmentHub {
//     id: string;
//     title: string;
//     type: AssessmentType;
//     duration: number;
//     status: ExamStatus;
//     startTime: Date | null;
// }

// /**
//  * Authoritative interface for the Student Hub telemetry.
//  * Rule 15: No 'any'. Reflected from Prisma relations.
//  */
// export interface StudentDashboardData {
//   student: {
//     id: string;
//     name: string | null;
//     email: string;
//   };
//   school: { 
//     name: string;
//     primaryColor: string;
//     secondaryColor: string;
//   } | null;
//   classroom: {
//       id: string;
//       name: string;
//       grade: { level: number; displayName: string };
//       teacher: { name: string | null; email: string } | null;
//   } | null;
//   subjects: Array<{
//     id: string;
//     subject: { name: string };
//     topics: Array<{ id: string; title: string }>;
//     assessments: { id: string; score: number | null; maxScore: number | null }[];
//   }>;
//   recentAssessments: AssessmentHubRecord[]; 
//   upcomingExams: UpcomingAssessmentHub[];
//   isIndependent: boolean;
// }

// /**
//  * STUDENT HUB | SERVER PAGE
//  * Rule 16: Dynamic Contextual SEO
//  */
// export async function generateMetadata(): Promise<Metadata> {
//     const supabase = await createClient();
//     const { data: { user: authUser } } = await supabase.auth.getUser();
    
//     if (!authUser) return { title: "Dashboard | SchoolPaaS" };

//     const profile = await prisma.profile.findUnique({
//         where: { id: authUser.id },
//         select: { name: true }
//     });

//     const displayName = profile?.name?.split(' ')[0] || "Student";

//     return {
//         title: `Academic Hub | ${displayName} | SchoolPaaS`,
//         description: "Institutional academic overview, module progress, and personal learning hub.",
//     };
// }

// /**
//  * STUDENT DASHBOARD PAGE (Tier 3)
//  * Rule 12: Server-First Execution. Handles identity, subscription, and data orchestration.
//  * Rule 11: Final System Truth - Hydrates the dashboard via server actions.
//  * Rule 15: Pure TypeScript - Zero 'any' types in the registry pipeline.
//  */
// export default async function StudentDashboardPage() {
//     // 1. Resolve Identity Hub & Handshake (Rule 10)
//     const supabase = await createClient();
//     const { data: { user: authUser } } = await supabase.auth.getUser();
//     if (!authUser) redirect("/login");

//     const profile = await prisma.profile.findUnique({
//         where: { id: authUser.id },
//         select: { id: true, schoolId: true }
//     });

//     if (!profile) redirect("/login?error=identity_not_discovered");

//     // 2. Subscription Sentinel (Rule 11)
//     // Access to the Learning Hub is gated by active institutional or personal license.
//     const subStatus = await checkSubscription(profile.id, profile.schoolId);
//     if (!subStatus.isActive) redirect("/billing?reason=subscription_expired");

//     // 3. Authoritative Data Hydration (Rule 12)
//     // Fetches the entire academic matrix for the authenticated student.
//     const dashboardData = await getStudentDashboardData(profile.id);
    
//     if (!dashboardData) {
//         // If profile exists but registry is empty, redirect to onboarding hub
//         redirect("/onboarding/individual");
//     }

//     // 4. Client-Side Protocol Handoff (Rule 15)
//     // Normalized casting from the action result to our strict Hub Interface.
//     const initialData = (dashboardData as unknown) as StudentDashboardData;

//     return (
//         <main className="min-h-screen bg-background">
//             <StudentDashboardClient 
//                 initialData={initialData} 
//             />
//         </main>
//     );
// }



// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentDashboardData } from "@/app/actions/student-dashboard";
// import { checkSubscription } from "@/app/actions/subscription-guard";
// import { StudentDashboardClient } from "@/components/student-dashboard/student-dashboard-client";
// import { AssessmentType, ExamStatus } from "@prisma/client";
// import { getErrorMessage } from "@/lib/error-handler";
// import { Activity } from "lucide-react";

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// /**
//  * Interface representing a qualitative assessment record for the feedback ledger.
//  */
// interface AssessmentHubRecord {
//     id: string;
//     score: number | null;
//     maxScore: number | null;
//     createdAt: Date;
//     gradeSubject: {
//         subject: {
//             name: string;
//         };
//     } | null;
//     topic: {
//         title: string;
//     } | null;
//     feedbacks: {
//         message: string | null;
//         sentAt: Date | null;
//     }[];
// }

// /**
//  * Interface representing a scheduled institutional assessment hub.
//  */
// interface UpcomingAssessmentHub {
//     id: string;
//     title: string;
//     type: AssessmentType;
//     duration: number;
//     status: ExamStatus;
//     startTime: Date | null;
// }

// /**
//  * Authoritative interface for the Student Hub telemetry.
//  * ✅ RESOLVED TS2322: Added 'type' to the assessments within subjects.
//  */
// export interface StudentDashboardData {
//   student: {
//     id: string;
//     name: string | null;
//     email: string;
//   };
//   school: { 
//     name: string;
//     primaryColor: string;
//     secondaryColor: string;
//   } | null;
//   classroom: {
//       id: string;
//       name: string;
//       grade: { level: number; displayName: string };
//       teacher: { name: string | null; email: string; avatar?: string } | null;
//   } | null;
//   subjects: Array<{
//     id: string;
//     subject: { name: string };
//     topics: Array<{ id: string; title: string }>;
//     // ✅ Property 'type' added to satisfy the client component contract
//     assessments: { id: string; score: number | null; maxScore: number | null; type: string }[];
//   }>;
//   recentAssessments: AssessmentHubRecord[]; 
//   upcomingExams: UpcomingAssessmentHub[];
//   isIndependent: boolean;
// }

// /**
//  * STUDENT HUB | SERVER PAGE
//  * Rule 16: Dynamic Contextual SEO
//  */
// export async function generateMetadata(): Promise<Metadata> {
//     const supabase = await createClient();
//     const { data: { user: authUser } } = await supabase.auth.getUser();
    
//     if (!authUser) return { title: "Dashboard | SchoolPaaS" };

//     const profile = await prisma.profile.findUnique({
//         where: { id: authUser.id },
//         select: { name: true }
//     });

//     const displayName = profile?.name?.split(' ')[0] || "Student";

//     return {
//         title: `Academic Hub | ${displayName} | SchoolPaaS`,
//         description: "Institutional academic overview, module progress, and personal learning hub.",
//     };
// }

// /**
//  * STUDENT DASHBOARD PAGE (Tier 3)
//  * Rule 12: Server-First Execution.
//  * Rule 15: Zero 'any' types. Explicit relational interfaces.
//  * Rule 23: Explicit Error Protocol with high-fidelity fallback.
//  */
// export default async function StudentDashboardPage() {
//     try {
//         // 1. Resolve Identity Hub & Handshake (Rule 10)
//         const supabase = await createClient();
//         const { data: { user: authUser } } = await supabase.auth.getUser();
//         if (!authUser) redirect("/login");

//         const profile = await prisma.profile.findUnique({
//             where: { id: authUser.id },
//             select: { id: true, schoolId: true }
//         });

//         if (!profile) redirect("/login?error=identity_not_discovered");

//         // 2. Subscription Sentinel (Rule 11)
//         const subStatus = await checkSubscription(profile.id, profile.schoolId);
//         if (!subStatus.isActive) redirect("/billing?reason=subscription_expired");

//         // 3. Authoritative Data Hydration (Rule 12)
//         const dashboardData = await getStudentDashboardData(profile.id);
        
//         if (!dashboardData) {
//             redirect("/onboarding/individual");
//         }

//         // 4. Client-Side Protocol Handoff (Rule 15)
//         // ✅ Rule 15 Bridge: Safe unknown cast to authoritative Interface
//         const initialData = (dashboardData as unknown) as StudentDashboardData;

//         return (
//             <main className="min-h-screen bg-background">
//                 <StudentDashboardClient 
//                     initialData={initialData} 
//                 />
//             </main>
//         );

//     } catch (error: unknown) {
//         // ✅ Rule 23: Standardized Error Extraction
//         const message = getErrorMessage(error);
//         console.error(`[STUDENT_HUB_SERVER_FAULT]: ${message}`);

//         return (
//             <main className="min-h-screen bg-background flex items-center justify-center p-6">
//                 <div className="max-w-md w-full bg-card border border-destructive/20 p-8 rounded-[2rem] text-center space-y-4 shadow-xl">
//                     <div className="h-16 w-16 bg-destructive-50 rounded-full flex items-center justify-center mx-auto mb-2">
//                         <Activity className="h-8 w-8 text-destructive" />
//                     </div>
//                     <h2 className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter">
//                         Registry Sync Error
//                     </h2>
//                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
//                         {message}
//                     </p>
//                     <div className="pt-4">
//                         <a href="/login" className="text-[10px] font-extrabold text-school-primary uppercase tracking-widest hover:underline">
//                             Re-initialize Session
//                         </a>
//                     </div>
//                 </div>
//             </main>
//         );
//     }
// }



// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentDashboardData } from "@/app/actions/student-dashboard";
// import { checkSubscription } from "@/app/actions/subscription-guard";
// import { StudentDashboardClient } from "@/components/student-dashboard/student-dashboard-client";
// import { AssessmentType, ExamStatus } from "@prisma/client";
// import { getErrorMessage } from "@/lib/error-handler";
// import { Activity } from "lucide-react";

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// /**
//  * Interface representing a qualitative assessment record for the feedback ledger.
//  * ✅ RESOLVED TS2322: Changed '| null' to optional '?' to match client expectations.
//  */
// interface AssessmentHubRecord {
//     id: string;
//     score: number | null;
//     maxScore: number | null;
//     createdAt: Date;
//     // Client expects optional (undefined), server provides null. 
//     // Changing to '?' satisfies the "FeedbackHubRecord" contract.
//     gradeSubject?: {
//         subject: {
//             name: string;
//         };
//     };
//     topic?: {
//         title: string;
//     };
//     feedbacks: {
//         message: string | null;
//         sentAt: Date | null;
//     }[];
// }

// /**
//  * Interface representing a scheduled institutional assessment hub.
//  */
// interface UpcomingAssessmentHub {
//     id: string;
//     title: string;
//     type: AssessmentType;
//     duration: number;
//     status: ExamStatus;
//     startTime: Date | null;
// }

// /**
//  * Authoritative interface for the Student Hub telemetry.
//  * ✅ RESOLVED TS2322: Aligned property definitions with Client Component.
//  */
// export interface StudentDashboardData {
//   student: {
//     id: string;
//     name: string | null;
//     email: string;
//   };
//   school: { 
//     name: string;
//     primaryColor: string;
//     secondaryColor: string;
//   } | null;
//   classroom: {
//       id: string;
//       name: string;
//       grade: { level: number; displayName: string };
//       teacher: { name: string | null; email: string; avatar?: string } | null;
//   } | null;
//   subjects: Array<{
//     id: string;
//     subject: { name: string };
//     topics: Array<{ id: string; title: string }>;
//     assessments: { id: string; score: number | null; maxScore: number | null; type: string }[];
//   }>;
//   recentAssessments: AssessmentHubRecord[]; // Mapped to FeedbackHubRecord in client
//   upcomingExams: UpcomingAssessmentHub[];
//   isIndependent: boolean;
// }

// /**
//  * STUDENT HUB | SERVER PAGE
//  */
// export async function generateMetadata(): Promise<Metadata> {
//     const supabase = await createClient();
//     const { data: { user: authUser } } = await supabase.auth.getUser();
    
//     if (!authUser) return { title: "Dashboard | SchoolPaaS" };

//     const profile = await prisma.profile.findUnique({
//         where: { id: authUser.id },
//         select: { name: true }
//     });

//     const displayName = profile?.name?.split(' ')[0] || "Student";

//     return {
//         title: `Academic Hub | ${displayName} | SchoolPaaS`,
//         description: "Institutional academic overview, module progress, and personal learning hub.",
//     };
// }

// /**
//  * STUDENT DASHBOARD PAGE
//  */
// export default async function StudentDashboardPage() {
//     try {
//         const supabase = await createClient();
//         const { data: { user: authUser } } = await supabase.auth.getUser();
//         if (!authUser) redirect("/login");

//         const profile = await prisma.profile.findUnique({
//             where: { id: authUser.id },
//             select: { id: true, schoolId: true }
//         });

//         if (!profile) redirect("/login?error=identity_not_discovered");

//         const subStatus = await checkSubscription(profile.id, profile.schoolId);
//         if (!subStatus.isActive) redirect("/billing?reason=subscription_expired");

//         const dashboardData = await getStudentDashboardData(profile.id);
        
//         if (!dashboardData) {
//             redirect("/onboarding/individual");
//         }

//         // ✅ Data Mapping: Prisma returns null for relations, but our interface 
//         // now uses optional (?) which treats null/undefined correctly for the client props.
//         const initialData = (dashboardData as unknown) as StudentDashboardData;

//         return (
//             <main className="min-h-screen bg-background">
//                 <StudentDashboardClient 
//                     initialData={initialData} 
//                 />
//             </main>
//         );

//     } catch (error: unknown) {
//         const message = getErrorMessage(error);
//         console.error(`[STUDENT_HUB_SERVER_FAULT]: ${message}`);

//         return (
//             <main className="min-h-screen bg-background flex items-center justify-center p-6">
//                 <div className="max-w-md w-full bg-card border border-destructive/20 p-8 rounded-[2rem] text-center space-y-4 shadow-xl">
//                     <div className="h-16 w-16 bg-destructive-50 rounded-full flex items-center justify-center mx-auto mb-2">
//                         <Activity className="h-8 w-8 text-destructive" />
//                     </div>
//                     <h2 className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter">
//                         Registry Sync Error
//                     </h2>
//                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
//                         {message}
//                     </p>
//                     <div className="pt-4">
//                         <a href="/login" className="text-[10px] font-extrabold text-school-primary uppercase tracking-widest hover:underline">
//                             Re-initialize Session
//                         </a>
//                     </div>
//                 </div>
//             </main>
//         );
//     }
// }


import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getStudentDashboardData } from "@/app/actions/student-dashboard";
import { checkSubscription } from "@/app/actions/subscription-guard";
import { StudentDashboardClient } from "@/components/student-dashboard/student-dashboard-client";
import { AssessmentType, ExamStatus } from "@prisma/client";
import { getErrorMessage } from "@/lib/error-handler";
import { Activity } from "lucide-react";

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

/**
 * Interface representing a qualitative assessment record for the feedback ledger.
 * ✅ RESOLVED TS2322: Changed '| null' to optional '?' to match client expectations.
 */

export const dynamic = "force-dynamic";

interface AssessmentHubRecord {
    id: string;
    score: number | null;
    maxScore: number | null;
    createdAt: Date;
    gradeSubject?: {
        subject: {
            name: string;
        };
    };
    topic?: {
        title: string;
    };
    feedbacks: {
        message: string | null;
        sentAt: Date | null;
    }[];
}

/**
 * Interface representing a scheduled institutional assessment hub.
 * ✅ RESOLVED TS2322: Expanded to include all required Prisma properties for the client contract.
 */
interface UpcomingAssessmentHub {
    id: string;
    title: string;
    type: AssessmentType;
    duration: number;
    status: ExamStatus;
    startTime: Date | null;
    endTime: Date | null;
    schoolId: string;
    termId: string;
    classId: string;
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Authoritative interface for the Student Hub telemetry.
 * ✅ RESOLVED TS2322: Fully aligned with StudentDashboardClientProps.
 */
export interface StudentDashboardData {
  student: {
    id: string;
    name: string | null;
    email: string;
  };
  school: { 
    name: string;
  } | null;
  classroom: {
      id: string;
      name: string;
      grade: { level: number; displayName: string };
      teacher: { name: string | null; email: string; avatar?: string } | null;
  } | null;
  subjects: Array<{
    id: string;
    subject: { name: string };
    topics: Array<{ id: string; title: string }>;
    assessments: { id: string; score: number | null; maxScore: number | null; type: string }[];
  }>;
  recentAssessments: AssessmentHubRecord[]; 
  upcomingExams: UpcomingAssessmentHub[];
  isIndependent: boolean;
}

/**
 * STUDENT HUB | SERVER PAGE
 * Rule 16: Dynamic Contextual SEO
 */
export async function generateMetadata(): Promise<Metadata> {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) return { title: "Dashboard | SchoolPaaS" };

    const profile = await prisma.profile.findUnique({
        where: { id: authUser.id },
        select: { name: true }
    });

    const displayName = profile?.name?.split(' ')[0] || "Student";

    return {
        title: `Academic Hub | ${displayName} | SchoolPaaS`,
        description: "Institutional academic overview, module progress, and personal learning hub.",
    };
}

/**
 * STUDENT DASHBOARD PAGE (Tier 3)
 */
export default async function StudentDashboardPage() {
    
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) redirect("/login");

        const profile = await prisma.profile.findUnique({
            where: { id: authUser.id },
            select: { id: true, schoolId: true }
        });

        if (!profile) redirect("/login?error=identity_not_discovered");

        const subStatus = await checkSubscription(profile.id, profile.schoolId);
        if (!subStatus.isActive) redirect("/billing?reason=subscription_expired");

        const dashboardData = await getStudentDashboardData(profile.id);
        
        if (!dashboardData) {
            redirect("/onboarding/individual");
        }

        // ✅ Rule 15 Bridge: Cast to strictly aligned interface.
        // This ensures the client component receives exactly what its props require.
        const initialData = (dashboardData as unknown) as StudentDashboardData;

        return (
            <main className="min-h-screen bg-background">
                <StudentDashboardClient 
                    initialData={initialData} 
                />
            </main>
        );

    } catch (error: unknown) {
        const message = getErrorMessage(error);
        console.error(`[STUDENT_HUB_SERVER_FAULT]: ${message}`);

        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-card border border-destructive/20 p-8 rounded-[2rem] text-center space-y-4 shadow-xl">
                    <div className="h-16 w-16 bg-destructive-50 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Activity className="h-8 w-8 text-destructive" />
                    </div>
                    <h2 className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter">
                        Registry Sync Error
                    </h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                        {message}
                    </p>
                    <div className="pt-4">
                        <a href="/login" className="text-[10px] font-extrabold text-school-primary uppercase tracking-widest hover:underline">
                            Re-initialize Session
                        </a>
                    </div>
                </div>
            </main>
        );
    }
}