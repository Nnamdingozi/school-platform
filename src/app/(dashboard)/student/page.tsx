"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/student-dashboard/header";
import { Navigation } from "@/components/student-dashboard/navigation";
import { WhatsDueWidget } from "@/components/student-dashboard/whats-due-widget";
import { CurrentLessonCard } from "@/components/student-dashboard/current-lesson-card";
import { RecentFeedback } from "@/components/student-dashboard/recent-feedback";
import { TeacherContact } from "@/components/student-dashboard/teacher-contact";
import { QuickStats } from "@/components/student-dashboard/quick-stats";
import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Sample student data
const studentData = {
  name: "Adaora Chukwuma",
  schoolName: "Greenfield Academy",
  grade: "JSS 1 - Section B",
};

export default function StudentDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        studentName={studentData.name}
        schoolName={studentData.schoolName}
        grade={studentData.grade}
      />

      {/* Navigation */}
      <Navigation activeItem={activeNav} onNavigate={setActiveNav} />

      {/* Main Content */}
      <main className="px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Good morning!</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              Welcome back, {studentData.name.split(" ")[0]}
            </h1>
            <p className="text-muted-foreground mt-1">
              {"Here's what's happening in your classroom today."}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mb-6">
            <QuickStats />
          </div>

          {/* My Subjects Grid */}
          <div className="mb-6">
            <SubjectsGrid />
          </div>

          {/* Main Grid Layout */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - What's Due & Feedback */}
            <div className="space-y-6 lg:col-span-2">
              {/* What's Due */}
              <WhatsDueWidget />

              {/* Recent Feedback */}
              <RecentFeedback />
            </div>

            {/* Right Column - Teacher Contact & Current Lesson */}
            <div className="space-y-6">
              {/* Teacher Contact */}
              <TeacherContact />

              {/* Current Lesson */}
              <CurrentLessonCard
                topic="Fractions"
                subject="Math"
                term="Term 1"
                progress={45}
                studentsOnline={24}
                duration="45 min"
                isLive={true}
              />

              {/* Manage Subjects Link Card */}
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle>Manage Your Subjects</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    Add or remove subjects from your dashboard so you only see
                    the classes that matter most to you.
                  </p>
                  <Button asChild size="sm">
                    <Link href="/subjects/manage?role=student">
                      Open Subject Management
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                EduLearn Student Portal &copy; 2026. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <button type="button" className="hover:text-foreground transition-colors">Help Center</button>
                <button type="button" className="hover:text-foreground transition-colors">Privacy</button>
                <button type="button" className="hover:text-foreground transition-colors">Terms</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

