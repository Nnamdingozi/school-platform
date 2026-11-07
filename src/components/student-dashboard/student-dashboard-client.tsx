// "use client";

// import React, { useState } from "react";
// import Link from "next/link";

// import { Header } from "@/components/student-dashboard/header";
// import { Navigation } from "@/components/student-dashboard/navigation";
// import { WhatsDueWidget } from "@/components/student-dashboard/whats-due-widget";
// import { CurrentLessonCard } from "@/components/student-dashboard/lesson/current-lesson-card";
// import { RecentFeedback } from "@/components/student-dashboard/recent-feedback";
// import { TeacherContact } from "@/components/student-dashboard/teacher-contact";
// import { QuickStats } from "@/components/student-dashboard/quick-stats";
// import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid";
// import { Sparkles, Zap, Globe, ShieldCheck, Activity } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { getErrorMessage } from "@/lib/error-handler";
// import { AssessmentType, ExamStatus } from "@prisma/client";
// import { IndividualSetupModal } from "@/components/student-dashboard/individualSetupModal";
// import { IndividualSetupBanner } from "@/components/student-dashboard/individualSetUpBanner";

// interface AssessmentHubNode {
//   id: string;
//   score: number | null;
//   maxScore: number | null;
//   type: string;
// }

// interface TopicHubNode {
//   id: string;
//   title: string;
//   weekNumber?: number | null;
//   term?: { index: number } | null;
// }

// interface RegistrySubject {
//   id: string;
//   subject: { name: string };
//   topics: TopicHubNode[];
//   assessments: AssessmentHubNode[];
// }

// interface FeedbackHubRecord {
//     id: string;
//     score: number | null;
//     maxScore: number | null;
//     gradeSubject?: {
//         subject?: {
//             name: string;
//         };
//     };
//     feedbacks?: {
//         message: string | null;
//         sentAt: Date | string | null;
//     }[];
// }

// interface UpcomingExamHub {
//   id: string;
//   title: string;
//   type: AssessmentType;
//   duration: number;
//   status: ExamStatus;
//   startTime: Date | null;
//   endTime: Date | null;
//   schoolId: string;
//   termId: string;
//   classId: string;
//   creatorId: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// interface StudentDashboardClientProps {
//   initialData: {
//     student: { id: string; name: string | null; email: string; curriculumId: string };
//     school: { name: string } | null;
//     classroom: {
//         id: string;
//         name: string;
//         grade: { level: number; displayName: string };
//         teacher: { name: string | null; email: string; avatar?: string } | null;
//     } | null;
//     subjects: RegistrySubject[];
//     recentAssessments: FeedbackHubRecord[]; 
//     upcomingExams: UpcomingExamHub[];      
//     isIndependent: boolean;
//   };
// }

// export function StudentDashboardClient({ initialData }: StudentDashboardClientProps) {
//   const [activeNav, setActiveNav] = useState<string>("dashboard");
//   const [subjects, setSubjects] = useState<RegistrySubject[]>(initialData.subjects);
//   const [showSetup, setShowSetup] = useState(
//     initialData.isIndependent && initialData.subjects.length === 0
//   );

//   const { student, school, classroom, recentAssessments, upcomingExams, isIndependent } = initialData;

//   const handleNavigationSync = (item: string) => {
//     try {
//         setActiveNav(item);
//     } catch (error: unknown) {
//         const message = getErrorMessage(error);
//         console.error(`[HUB_NAVIGATION_FAULT]: ${message}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700 pb-24">
//       <Header
//         studentName={student?.name || "Learner"}
//         schoolName={isIndependent ? "Global Learning Hub" : (school?.name || "Institutional Hub")}
//         grade={isIndependent ? "Self-Paced Core" : (classroom?.name || "Registry Pending")} 
//       />

//       <Navigation activeItem={activeNav} onNavigate={handleNavigationSync} />

//       <main className="max-w-7xl mx-auto w-full p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
        
//         {showSetup && (
//             <IndividualSetupModal
//                 profileId={student.id}
//                 curriculumId={student.curriculumId}
//                 onComplete={(fetchedSubjects) => {
//                     setSubjects(fetchedSubjects);
//                     setShowSetup(false);
//                 }}
//             />
//         )}
        
//         {isIndependent && subjects.length === 0 && !showSetup && (
//             <IndividualSetupBanner onStart={() => setShowSetup(true)} />
//         )}

//         <div className="space-y-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 rounded-lg bg-school-primary-50 border border-school-primary-200 shadow-sm transition-colors">
//                 {isIndependent ? <Globe className="h-4 w-4 text-school-primary" /> : <Sparkles className="h-4 w-4 text-school-primary" />}
//             </div>
//             <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-school-primary italic">
//                 {isIndependent ? "Global Tier Registry" : "Institutional Hub Active"}
//             </span>
//           </div>
//           <div>
//             <h1 className="text-4xl md:text-5xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//               Welcome, {student?.name?.split(" ")[0]}
//             </h1>
//             <p className="text-muted-foreground text-sm font-semibold uppercase tracking-widest italic mt-3 opacity-70">
//               {isIndependent ? "Personal Knowledge Dashboard" : `${classroom?.name} Hub — Current Term Registry`}
//             </p>
//           </div>
//         </div>

//         <QuickStats assessments={recentAssessments} />

//         <div className="w-full">
//             <SubjectsGrid 
//                 subjects={subjects} 
//                 classTeacherName={isIndependent ? "Registry AI Core" : (classroom?.teacher?.name || "Academic Lead")} 
//                 gradeLevel={classroom?.grade?.level || 10} 
//                 isIndependent={isIndependent}
//             />
//         </div>

//         <div className="grid gap-8 lg:grid-cols-3 items-start">
//           <div className="space-y-10 lg:col-span-2">
//             {!isIndependent ? (
//                 <WhatsDueWidget exams={upcomingExams} />
//             ) : (
//                 <Card className="border-none rounded-[2rem] overflow-hidden shadow-2xl bg-school-primary text-on-school-primary relative group">
//                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
//                     <Zap className="h-32 w-32 fill-current" />
//                   </div>
//                   <CardContent className="p-8 md:p-12 space-y-8 relative z-10">
//                       <div className="h-14 w-14 bg-on-school-primary/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-on-school-primary/20 shadow-inner">
//                         <Zap className="h-7 w-7 text-on-school-primary animate-pulse" />
//                       </div>
//                       <div className="space-y-2">
//                         <h2 className="text-3xl font-extrabold uppercase italic tracking-tighter leading-none">Practice Engine</h2>
//                         <p className="text-on-school-primary/70 text-[10px] font-bold uppercase tracking-widest italic leading-relaxed">
//                             Initialize a self-paced assessment hub from the global question bank.
//                         </p>
//                       </div>
//                       <Link href="/student/practice" className="block pt-4">
//                         <Button className="w-full h-16 bg-surface text-foreground hover:bg-background font-extrabold rounded-2xl py-8 shadow-xl text-[11px] uppercase tracking-[0.3em] transition-all active:scale-95 border-none">
//                             Initialize Test Hub
//                         </Button>
//                       </Link>
//                   </CardContent>
//                 </Card>
//             )}
//             <RecentFeedback assessments={recentAssessments} />
//           </div>

//           <div className="space-y-8">
//             {!isIndependent && classroom?.teacher && (
//                 <TeacherContact teacher={classroom.teacher} />
//             )}

//             <CurrentLessonCard
//               topic={subjects[0]?.topics[0]?.title || "Exploration Hub"}
//               subject={subjects[0]?.subject.name || "Global Core"}
//               progress={0} 
//               isLive={false}
//             />

//             <Card className="bg-card border-border rounded-[2rem] shadow-xl group">
//               <CardHeader className="bg-surface/50 p-6 border-b border-border">
//                 <CardTitle className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground italic flex items-center gap-3">
//                     <Activity className="h-3.5 w-3.5 text-school-primary" />
//                     Registry Operations Hub
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="flex flex-col gap-8 p-8 md:p-10">
//                 <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest leading-relaxed italic opacity-70">
//                   Synchronize your registered academic modules to update your personal learning roadmap.
//                 </p>
//                 <Button asChild className="h-14 bg-surface border border-border text-school-primary hover:bg-school-primary hover:text-on-school-primary font-extrabold rounded-2xl text-[10px] uppercase tracking-widest shadow-md transition-all active:scale-95">
//                   <Link href="/subjects/manage">
//                     {isIndependent ? "Sync Global Catalogue" : "Update Syllabus Hub"}
//                   </Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>

//       <footer className="border-t border-border py-16 mt-20 bg-surface/30">
//         <div className="px-6 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground/40">
//           <div className="flex items-center gap-3">
//             <ShieldCheck className="h-4 w-4" />
//             <p className="text-[9px] font-bold uppercase tracking-[0.5em] italic">
//                {isIndependent ? "GLOBAL_USER_HUB_v2.1" : "INSTITUTIONAL_ENVIRONMENT_v2.1"}
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import Link from "next/link";

import { Header } from "@/components/student-dashboard/header";
import { Navigation } from "@/components/student-dashboard/navigation";
import { WhatsDueWidget } from "@/components/student-dashboard/whats-due-widget";
import { CurrentLessonCard } from "@/components/student-dashboard/lesson/current-lesson-card";
import { RecentFeedback } from "@/components/student-dashboard/recent-feedback";
import { TeacherContact } from "@/components/student-dashboard/teacher-contact";
import { QuickStats } from "@/components/student-dashboard/quick-stats";
import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid";
import { Sparkles, Zap, Globe, ShieldCheck, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/error-handler";
import { AssessmentType, ExamStatus } from "@prisma/client";
import { IndividualSetupModal } from "@/components/student-dashboard/individualSetupModal";
import { IndividualSetupBanner } from "@/components/student-dashboard/individualSetUpBanner";

interface AssessmentHubNode {
  id: string;
  score: number | null;
  maxScore: number | null;
  type: string;
}

interface TopicHubNode {
  id: string;
  title: string;
  weekNumber?: number | null;
  term?: { index: number } | null;
}

interface RegistrySubject {
  id: string;
  subject: { name: string };
  topics: TopicHubNode[];
  assessments: AssessmentHubNode[];
}

interface FeedbackHubRecord {
    id: string;
    score: number | null;
    maxScore: number | null;
    gradeSubject?: {
        subject?: {
            name: string;
        };
    };
    feedbacks?: {
        message: string | null;
        sentAt: Date | string | null;
    }[];
}

interface UpcomingExamHub {
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

interface StudentDashboardClientProps {
  initialData: {
    student: { id: string; name: string | null; email: string; curriculumId: string };
    school: { name: string } | null;
    classroom: {
        id: string;
        name: string;
        grade: { level: number; displayName: string };
        teacher: { name: string | null; email: string; avatar?: string } | null;
    } | null;
    subjects: RegistrySubject[];
    recentAssessments: FeedbackHubRecord[]; 
    upcomingExams: UpcomingExamHub[];      
    isIndependent: boolean;
  };
}

export function StudentDashboardClient({ initialData }: StudentDashboardClientProps) {
  const [activeNav, setActiveNav] = useState<string>("dashboard");
  const [subjects, setSubjects] = useState<RegistrySubject[]>(initialData.subjects);
  // const [showSetup, setShowSetup] = useState<boolean>(
  //   initialData.isIndependent && initialData.subjects.length === 0
  // );

  const { student, school, classroom, recentAssessments, upcomingExams, isIndependent } = initialData;

  const handleNavigationSync = (item: string) => {
    try {
        setActiveNav(item);
    } catch (error: unknown) {
        const message = getErrorMessage(error);
        console.error(`[HUB_NAVIGATION_FAULT]: ${message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700 pb-24">
      <Header
        studentName={student?.name || "Learner"}
        schoolName={isIndependent ? "Global Learning Hub" : (school?.name || "Institutional Hub")}
        grade={isIndependent ? "Self-Paced Core" : (classroom?.name || "Registry Pending")} 
      />

      <Navigation activeItem={activeNav} onNavigate={handleNavigationSync} />

      <main className="max-w-7xl mx-auto w-full p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
        
        {/* {showSetup && (
            <IndividualSetupModal
                profileId={student.id}
                curriculumId={student.curriculumId}
                onComplete={(fetchedSubjects: RegistrySubject[]) => {
                    setSubjects(fetchedSubjects);
                    setShowSetup(false);
                }}
            />
        )}
        
        {isIndependent && subjects.length === 0 && !showSetup && (
            <IndividualSetupBanner onStart={() => setShowSetup(true)} />
        )} */}

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-school-primary-50 border border-school-primary-200 shadow-sm transition-colors">
                {isIndependent ? <Globe className="h-4 w-4 text-school-primary" /> : <Sparkles className="h-4 w-4 text-school-primary" />}
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-school-primary italic">
                {isIndependent ? "Global Tier Registry" : "Institutional Hub Active"}
            </span>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
              Welcome, {student?.name?.split(" ")[0]}
            </h1>
            <p className="text-muted-foreground text-sm font-semibold uppercase tracking-widest italic mt-3 opacity-70">
              {isIndependent ? "Personal Knowledge Dashboard" : `${classroom?.name} Hub — Current Term Registry`}
            </p>
          </div>
        </div>

        <QuickStats assessments={recentAssessments} />

        <div className="w-full">
            <SubjectsGrid 
                subjects={subjects} 
                classTeacherName={isIndependent ? "Registry AI Core" : (classroom?.teacher?.name || "Academic Lead")} 
                gradeLevel={classroom?.grade?.level || 10} 
                isIndependent={isIndependent}
                compact={true}
            />
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-start">
          <div className="space-y-10 lg:col-span-2">
            {!isIndependent ? (
                <WhatsDueWidget exams={upcomingExams} />
            ) : (
                <Card className="border-none rounded-[2rem] overflow-hidden shadow-2xl bg-school-primary text-on-school-primary relative group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Zap className="h-32 w-32 fill-current" />
                  </div>
                  <CardContent className="p-6 md:p-8 space-y-5 relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-on-school-primary/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-on-school-primary/20 shadow-inner">
            <Zap className="h-5 w-5 text-on-school-primary animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold uppercase italic tracking-tighter leading-none">Practice Engine</h2>
            
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[9px] font-extrabold uppercase tracking-widest block text-on-school-primary/60">Readiness</span>
          <span className="text-sm font-extrabold italic tracking-tight">Optimal</span>
        </div>
      </div>

      <div className="pt-1 flex items-center justify-between gap-4">
        <p className="text-on-school-primary/80 text-[10px] font-semibold uppercase tracking-widest italic leading-relaxed">
          Drill self-paced questions tailored to your syllabus.
        </p>
        <Link href="/student/practice" className="shrink-0">
          <Button className="h-12 px-6 bg-surface text-foreground hover:bg-background font-extrabold rounded-xl shadow-lg text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 border-none">
              Start Practice
          </Button>
        </Link>
      </div>
  </CardContent>
                </Card>
            )}
            <RecentFeedback assessments={recentAssessments} />
          </div>

          <div className="space-y-8">
            {!isIndependent && classroom?.teacher && (
                <TeacherContact teacher={classroom.teacher} />
            )}

            <CurrentLessonCard
              topic={subjects[0]?.topics[0]?.title || "Exploration Hub"}
              subject={subjects[0]?.subject.name || "Global Core"}
              progress={0} 
              isLive={false}
            />

            <Card className="bg-card border-border rounded-[2rem] shadow-xl group">
              <CardHeader className="bg-surface/50 p-6 border-b border-border">
                <CardTitle className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground italic flex items-center gap-3">
                    <Activity className="h-3.5 w-3.5 text-school-primary" />
                    Registry Operations Hub
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-8 p-8 md:p-10">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest leading-relaxed italic opacity-70">
                  Synchronize your registered academic modules to update your personal learning roadmap.
                </p>
                <Button asChild className="h-14 bg-surface border border-border text-school-primary hover:bg-school-primary hover:text-on-school-primary font-extrabold rounded-2xl text-[10px] uppercase tracking-widest shadow-md transition-all active:scale-95">
                  <Link href="/subjects/manage">
                    {isIndependent ? "Sync Global Catalogue" : "Update Syllabus Hub"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-16 mt-20 bg-surface/30">
        <div className="px-6 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground/40">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-[9px] font-bold uppercase tracking-[0.5em] italic">
               {isIndependent ? "GLOBAL_USER_HUB_v2.1" : "INSTITUTIONAL_ENVIRONMENT_v2.1"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}



// "use client";

// import React, { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { 
//   Globe, 
//   Sparkles, 
//   Zap, 
//   Activity, 
//   ShieldCheck,
//   BookOpen
// } from "lucide-react";
// import { getErrorMessage } from "@/lib/error-handler";
// import Link from "next/link";
// import { Header } from "@/components/student-dashboard/header";
// import { Navigation } from "@/components/student-dashboard/navigation";
// import { QuickStats } from "@/components/student-dashboard/quick-stats";
// import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid";
// import { WhatsDueWidget } from "@/components/student-dashboard/whats-due";
// import { RecentFeedback } from "@/components/student-dashboard/recent-feedback";
// import { TeacherContact } from "@/components/student-dashboard/teacher-contact";
// import { CurrentLessonCard } from "@/components/student-dashboard/current-lesson-card";

// // ── Types ──────────────────────────────────────────────────────────────────

// interface RegistrySubject {
//   id: string;
//   subject: { name: string };
//   topics: { id: string; title: string; weekNumber?: number | null; term?: { index: number } | null }[];
//   assessments: { id: string; score: number | null; maxScore: number | null; type: string }[];
// }

// interface FeedbackHubRecord {
//   id: string;
//   score: number | null;
//   maxScore: number | null;
//   type: string;
//   createdAt: string;
//   topic?: { title: string } | null;
// }

// interface UpcomingExamHub {
//   id: string;
//   title: string;
//   dueDate: string;
//   subjectName: string;
// }

// interface PracticeQuestionItem {
//   id: string;
//   questionText: string;
//   options: any;
//   correctAnswer: string;
//   explanation: string | null;
//   difficulty: string;
// }

// interface StudentDashboardClientProps {
//   initialData: {
//     student: { id: string; name: string | null; email: string; curriculumId: string };
//     school: { name: string } | null;
//     classroom: {
//         id: string;
//         name: string;
//         grade: { level: number; displayName: string };
//         teacher: { name: string | null; email: string; avatar?: string } | null;
//     } | null;
//     subjects: RegistrySubject[];
//     recentAssessments: FeedbackHubRecord[]; 
//     upcomingExams: UpcomingExamHub[];      
//     isIndependent: boolean;
//   };
//   initialPracticeQuestions?: PracticeQuestionItem[]; // 👈 Added practice questions prop
// }

// export function StudentDashboardClient({ 
//   initialData, 
//   initialPracticeQuestions = [] 
// }: StudentDashboardClientProps) {
//   const [activeNav, setActiveNav] = useState<string>("dashboard");
//   const [subjects, setSubjects] = useState<RegistrySubject[]>(initialData.subjects);
//   const [practicePool] = useState<PracticeQuestionItem[]>(initialPracticeQuestions);

//   const { student, school, classroom, recentAssessments, upcomingExams, isIndependent } = initialData;

//   const handleNavigationSync = (item: string) => {
//     try {
//         setActiveNav(item);
//     } catch (error: unknown) {
//         const message = getErrorMessage(error);
//         console.error(`[HUB_NAVIGATION_FAULT]: ${message}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700 pb-24">
//       <Header
//         studentName={student?.name || "Learner"}
//         schoolName={isIndependent ? "Global Learning Hub" : (school?.name || "Institutional Hub")}
//         grade={isIndependent ? "Self-Paced Core" : (classroom?.name || "Registry Pending")} 
//       />

//       <Navigation activeItem={activeNav} onNavigate={handleNavigationSync} />

//       <main className="max-w-7xl mx-auto w-full p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
        
//         <div className="space-y-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 rounded-lg bg-school-primary-50 border border-school-primary-200 shadow-sm transition-colors">
//                 {isIndependent ? <Globe className="h-4 w-4 text-school-primary" /> : <Sparkles className="h-4 w-4 text-school-primary" />}
//             </div>
//             <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-school-primary italic">
//                 {isIndependent ? "Global Tier Registry" : "Institutional Hub Active"}
//             </span>
//           </div>
//           <div>
//             <h1 className="text-4xl md:text-5xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//               Welcome, {student?.name?.split(" ")[0]}
//             </h1>
//             <p className="text-muted-foreground text-sm font-semibold uppercase tracking-widest italic mt-3 opacity-70">
//               {isIndependent ? "Personal Knowledge Dashboard" : `${classroom?.name} Hub — Current Term Registry`}
//             </p>
//           </div>
//         </div>

//         <QuickStats assessments={recentAssessments} />

//         <div className="w-full">
//             <SubjectsGrid 
//                 subjects={subjects} 
//                 classTeacherName={isIndependent ? "Registry AI Core" : (classroom?.teacher?.name || "Academic Lead")} 
//                 gradeLevel={classroom?.grade?.level || 10} 
//                 isIndependent={isIndependent}
//                 compact={true}
//             />
//         </div>

//         <div className="grid gap-8 lg:grid-cols-3 items-start">
//           <div className="space-y-10 lg:col-span-2">
//             {!isIndependent ? (
//                 <WhatsDueWidget exams={upcomingExams} />
//             ) : (
//                 <Card className="border-none rounded-[2rem] overflow-hidden shadow-2xl bg-school-primary text-on-school-primary relative group">
//                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
//                     <Zap className="h-32 w-32 fill-current" />
//                   </div>
//                   <CardContent className="p-8 md:p-12 space-y-8 relative z-10">
//                       <div className="h-14 w-14 bg-on-school-primary/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-on-school-primary/20 shadow-inner">
//                         <Zap className="h-7 w-7 text-on-school-primary animate-pulse" />
//                       </div>
//                       <div className="space-y-2">
//                         <h2 className="text-3xl font-extrabold uppercase italic tracking-tighter leading-none">Practice Engine</h2>
//                         <p className="text-on-school-primary/70 text-[10px] font-bold uppercase tracking-widest italic leading-relaxed">
//                             Initialize a self-paced assessment hub from the global question bank. ({practicePool.length} active practice nodes synced)
//                         </p>
//                       </div>
//                       <Link href="/student/practice" className="block pt-4">
//                         <Button className="w-full h-16 bg-surface text-foreground hover:bg-background font-extrabold rounded-2xl py-8 shadow-xl text-[11px] uppercase tracking-[0.3em] transition-all active:scale-95 border-none">
//                             Initialize Test Hub
//                         </Button>
//                       </Link>
//                   </CardContent>
//                 </Card>
//             )}
//             <RecentFeedback assessments={recentAssessments} />
//           </div>

//           <div className="space-y-8">
//             {!isIndependent && classroom?.teacher && (
//                 <TeacherContact teacher={classroom.teacher} />
//             )}

//             <CurrentLessonCard
//               topic={subjects[0]?.topics[0]?.title || "Exploration Hub"}
//               subject={subjects[0]?.subject.name || "Global Core"}
//               progress={0} 
//               isLive={false}
//             />

//             <Card className="bg-card border-border rounded-[2rem] shadow-xl group">
//               <CardHeader className="bg-surface/50 p-6 border-b border-border">
//                 <CardTitle className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground italic flex items-center gap-3">
//                     <Activity className="h-3.5 w-3.5 text-school-primary" />
//                     Registry Operations Hub
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="flex flex-col gap-8 p-8 md:p-10">
//                 <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest leading-relaxed italic opacity-70">
//                   Synchronize your registered academic modules to update your personal learning roadmap.
//                 </p>
//                 <Button asChild className="h-14 bg-surface border border-border text-school-primary hover:bg-school-primary hover:text-on-school-primary font-extrabold rounded-2xl text-[10px] uppercase tracking-widest shadow-md transition-all active:scale-95">
//                   <Link href="/subjects/manage">
//                     {isIndependent ? "Sync Global Catalogue" : "Update Syllabus Hub"}
//                   </Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>

//       <footer className="border-t border-border py-16 mt-20 bg-surface/30">
//         <div className="px-6 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground/40">
//           <div className="flex items-center gap-3">
//             <ShieldCheck className="h-4 w-4" />
//             <p className="text-[9px] font-bold uppercase tracking-[0.5em] italic">
//                {isIndependent ? "GLOBAL_USER_HUB_v2.1" : "INSTITUTIONAL_ENVIRONMENT_v2.1"}
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }