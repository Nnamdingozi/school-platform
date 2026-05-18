"use client";

import { useState } from "react";
import Link from "next/link";
import { useProfileStore } from "@/store/profileStore";

// Components
import { Header } from "@/components/student-dashboard/header";
import { Navigation } from "@/components/student-dashboard/navigation";
import { WhatsDueWidget } from "@/components/student-dashboard/whats-due-widget";
import { CurrentLessonCard } from "@/components/student-dashboard/lesson/current-lesson-card";
import { RecentFeedback } from "@/components/student-dashboard/recent-feedback";
import { TeacherContact } from "@/components/student-dashboard/teacher-contact";
import { QuickStats } from "@/components/student-dashboard/quick-stats";
import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid";
import { Sparkles, BookOpen, Zap, Globe, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Role } from "@prisma/client";

// ── Types ───────────────────────────────────────────────────────────────────

interface StudentDashboardClientProps {
  initialData: {
    student: any;
    school: { name: string } | null;
    classroom: {
        id: string;
        name: string;
        grade: { level: number; displayName: string };
        teacher: { name: string | null; email: string } | null;
    } | null;
    subjects: any[];
    recentAssessments: any[];
    upcomingExams: any[];
    isIndependent: boolean;
  };
}

/**
 * UNIFIED STUDENT HUB
 * Rule 12: Hydrated by Server Props.
 * Rule 17: Leverages Zustand for branding context.
 * Rule 6: Contextual UI for Independent vs School users.
 */
export function StudentDashboardClient({ initialData }: StudentDashboardClientProps) {
  const { profile } = useProfileStore();
  const [activeNav, setActiveNav] = useState<string>("dashboard");

  const { student, school, classroom, subjects, recentAssessments, upcomingExams, isIndependent } = initialData;
  const primaryColor = profile?.primaryColor || "#f59e0b";

  return (
    <div className="min-h-screen bg-slate-950 animate-in fade-in duration-700">
      <Header
        studentName={student?.name || "Learner"}
        schoolName={isIndependent ? "Global Learning Registry" : (school?.name || "Institution")}
        grade={isIndependent ? "Self-Paced" : (classroom?.name || "Registry Pending")} 
      />

      <Navigation activeItem={activeNav} onNavigate={setActiveNav} />

      <main className="px-4 py-10 md:px-8 max-w-7xl mx-auto space-y-10">
        
        {/* ── WELCOME STRIP ── */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {isIndependent ? (
                <Globe className="h-4 w-4" style={{ color: primaryColor }} />
            ) : (
                <Sparkles className="h-4 w-4" style={{ color: primaryColor }} />
            )}
            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: primaryColor }}>
                {isIndependent ? "Global Tier Registry" : "Institutional Node Active"}
            </span>
          </div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Welcome, {student?.name?.split(" ")[0]}
          </h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic">
            {isIndependent ? "Personal Knowledge Dashboard" : `${classroom?.name} — Current Term Registry`}
          </p>
        </div>

        <QuickStats assessments={recentAssessments} />

        {/* ── SUBJECT GRID (Tier 1 + 2) ── */}
        <SubjectsGrid 
            subjects={subjects} 
            classTeacherName={isIndependent ? "Platform AI" : (classroom?.teacher?.name || "Registry Lead")} 
            gradeLevel={classroom?.grade?.level || 10} 
            isIndependent={isIndependent}
        />

        <div className="grid gap-10 lg:grid-cols-3 items-start">
          <div className="space-y-10 lg:col-span-2">
            
            {/* Rule 6: Conditional UI Widgets */}
            {!isIndependent ? (
                <WhatsDueWidget exams={upcomingExams} />
            ) : (
                <Card className="border-none rounded-[3rem] overflow-hidden shadow-2xl" style={{ backgroundColor: primaryColor }}>
                  <CardContent className="p-10 space-y-6">
                      <div className="h-12 w-12 bg-slate-950 rounded-2xl flex items-center justify-center">
                        <Zap className="h-6 w-6 text-white animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-black text-slate-950 uppercase italic leading-none">Practice Engine</h2>
                        <p className="text-slate-950/60 text-xs font-bold uppercase tracking-tight italic">Initialize a self-paced assessment from the global bank.</p>
                      </div>
                      <Link href="/student/practice" className="block">
                        <Button className="w-full bg-slate-950 text-white font-black rounded-xl py-7 shadow-2xl hover:bg-slate-900 transition-all text-[10px] uppercase tracking-widest">
                            Initialize Test Engine
                        </Button>
                      </Link>
                  </CardContent>
                </Card>
            )}

            <RecentFeedback assessments={recentAssessments} />
          </div>

          {/* ── SIDEBAR WIDGETS ── */}
          <div className="space-y-8">
            {!isIndependent && classroom?.teacher && (
                <TeacherContact teacher={classroom.teacher} />
            )}

            <CurrentLessonCard
              topic={subjects[0]?.topics[0]?.title || "Exploration Node"}
              subject={subjects[0]?.subject.name || "Global Core"}
              progress={0} 
              isLive={false}
            />

            <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl">
              <CardHeader className="bg-slate-950/50 p-6 border-b border-white/5">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registry Operations</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6 p-8">
                <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed italic">
                  Modify your registered academic modules to update your personal learning roadmap.
                </p>
                <Button asChild className="bg-slate-950 border border-white/10 text-school-primary hover:bg-school-primary hover:text-slate-950 font-black rounded-xl text-[10px] uppercase py-6 shadow-lg" style={{ color: primaryColor }}>
                  <Link href="/subjects/manage">
                    {isIndependent ? "Sync Global Catalogue" : "Update Syllabus Registry"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-16 mt-20 bg-slate-950">
        <div className="px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.5em]">
             {isIndependent ? "GLOBAL_USER_NODE_v1.2" : "INSTITUTIONAL_ENVIRONMENT_v1.2"}
          </p>
          <div className="flex items-center gap-8 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
            <button className="hover:text-school-primary transition-colors">Registry Compliance</button>
            <button className="hover:text-school-primary transition-colors">Identity Privacy</button>
            <button className="hover:text-school-primary transition-colors">Support Hub</button>
          </div>
        </div>
      </footer>
    </div>
  );
}