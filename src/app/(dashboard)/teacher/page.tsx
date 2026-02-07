"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/TeacherDashboard/app-sidebar"
import { DashboardHeader } from "@/components/TeacherDashboard/dashboard-header"
import { ActiveTopicCard } from "@/components/TeacherDashboard/active-topic-card"
import { PerformanceCharts } from "@/components/TeacherDashboard/performance-charts"
import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner"
import { WhatsAppStatus } from "@/components/TeacherDashboard/whatsapp-status"

export default function TeacherDashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Active Topic Section */}
            <section>
              <ActiveTopicCard />
            </section>

            {/* Performance Overview Section */}
            <section>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Student Performance Overview
              </h2>
              <PerformanceCharts />
            </section>

            {/* AI Lesson Planner and WhatsApp Status */}
            <section className="grid gap-6 lg:grid-cols-2">
              <AILessonPlanner />
              <WhatsAppStatus />
            </section>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
