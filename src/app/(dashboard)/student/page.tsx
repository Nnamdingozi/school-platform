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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useProfileStore } from "@/store/profileStore";
import { getStudentDashboardData } from "@/app/actions/student-dashboard";

// Components
import { Header } from "@/components/student-dashboard/header";
import { Navigation } from "@/components/student-dashboard/navigation";
import { WhatsDueWidget } from "@/components/student-dashboard/whats-due-widget";
import { CurrentLessonCard } from "@/components/student-dashboard/current-lesson-card";
import { RecentFeedback } from "@/components/student-dashboard/recent-feedback";
import { TeacherContact } from "@/components/student-dashboard/teacher-contact";
import { QuickStats } from "@/components/student-dashboard/quick-stats";
import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid";
import { Sparkles, Loader2, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  const { profile, isLoading: isProfileLoading } = useProfileStore();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [dbData, setDbData] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (profile?.id) {
        const data = await getStudentDashboardData(profile.id);
        setDbData(data);
        setIsDataLoading(false);
      }
    }
    load();
  }, [profile]);

  // ── LOADING STATE ──
  if (isProfileLoading || isDataLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">
          Syncing Academic Profile...
        </p>
      </div>
    );
  }

  // ── UNASSIGNED STATE ──
  if (!dbData?.classroom) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
        <BookOpen className="h-16 w-16 text-slate-800 mb-6" />
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Placement Pending</h2>
        <p className="text-slate-500 max-w-sm mt-2 text-sm leading-relaxed">
          You haven't been assigned to a physical classroom yet. Please contact the administrator to finalize your enrollment.
        </p>
      </div>
    );
  }

  const { student, school, classroom, subjects, recentAssessments, upcomingExams } = dbData;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* 1. Header (Dynamic Data) */}
      <Header
        studentName={student.name || "Student"}
        schoolName={school?.name || "Institution"}
        grade={classroom.name} 
      />

      <Navigation activeItem={activeNav} onNavigate={setActiveNav} />

      <main className="px-4 py-6 md:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* 2. Welcome Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-school-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-school-primary">Standard Registry</span>
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Welcome back, {student.name?.split(" ")[0]}
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">
            {classroom.name} — Current Academic Session
          </p>
        </div>

        {/* 3. Quick Stats (Pass assessments for GPA logic) */}
        <QuickStats assessments={recentAssessments} />

        {/* 4. My Subjects Grid (Pass subjects array) */}
        <SubjectsGrid 
        subjects={subjects} 
        classTeacherName={classroom.teacher?.name || "Registry Instructor"} 
        gradeLevel={classroom.grade.level} 
    />

        <div className="grid gap-8 lg:grid-cols-3 items-start">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* 5. What's Due (Pass exams array) */}
            <WhatsDueWidget exams={upcomingExams} />

            {/* 6. Recent Feedback (Pass assessments array) */}
            <RecentFeedback assessments={recentAssessments} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* 7. Teacher Contact (Pass class teacher info) */}
            <TeacherContact teacher={classroom.teacher} />

            {/* 8. Current Lesson (Logic: Pick first available subject topic) */}
            <CurrentLessonCard
              topic={subjects[0]?.gradeSubject?.topics[0]?.title || "Self Study"}
              subject={subjects[0]?.gradeSubject?.subject.name || "General"}
              progress={0} 
              isLive={false}
            />

            {/* 9. Manage Subjects Link */}
            <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-slate-950/50">
                <CardTitle className="text-xs font-black uppercase text-slate-400">Registry Control</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-6">
                <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
                  Modify your registered academic modules to update your dashboard view.
                </p>
                <Button asChild className="bg-slate-950 border border-white/10 text-school-primary hover:bg-school-primary hover:text-slate-950 font-black rounded-xl text-[10px] uppercase">
                  <Link href="/subjects/manage?role=student">
                    Update Syllabus Registry
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 mt-12 bg-slate-950">
        <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
             INSTITUTIONAL_ENVIRONMENT_v1.0
          </p>
          <div className="flex items-center gap-6 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            <button className="hover:text-school-primary transition-colors">Compliance</button>
            <button className="hover:text-school-primary transition-colors">Privacy</button>
            <button className="hover:text-school-primary transition-colors">Archive</button>
          </div>
        </div>
      </footer>
    </div>
  );
}