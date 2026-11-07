'use client'

import React from 'react'
import { ThemeToggle } from './themeToggle'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from '@/components/ui/sidebar'
import { useSchool } from '@/context/schoolProvider'
import { useProfileStore } from '@/store/profileStore'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard, BookOpen, ClipboardList,
    GraduationCap, BarChart2, Users, Loader2,
    Bell, BookMarked, School, CreditCard, FileText,
    Trophy, Calendar, UserCircle,
    TableProperties, MessageCircle, UserPlus, Layers,
    ShieldCheck, ChevronRight, Zap, History, MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { LogoutButton } from './shared/logOutButton'

// ── Nav Item Component (Rule 11/19/21) ────────────────────────────────────────

function NavItem({ href, icon: Icon, label }: {
    href:  string
    icon:  React.ElementType
    label: string
}) {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent text-inherit">
                <Link 
                    href={href} 
                    className={cn(
                        'flex items-center justify-between gap-3 rounded-xl px-4 py-3 w-full transition-all duration-200 group',
                        isActive 
                            ? 'bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-200' 
                            : 'text-school-primary hover:bg-school-primary-50' 
                    )}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <Icon className={cn(
                            "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                            isActive ? "text-on-school-primary" : "text-school-primary"
                        )} />
                        <span className="text-[11px] font-extrabold uppercase tracking-widest italic truncate">
                            {label}
                        </span>
                    </div>
                    {isActive && <ChevronRight className="h-3 w-3 text-on-school-primary animate-in slide-in-from-left-2" />}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <SidebarGroup className="px-2">
            <SidebarGroupLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-4 py-3">
                {label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                    {children}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

// ── Main Sidebar (Tier 2/3) ───────────────────────────────────────────────────

export function AppSidebar() {
    const { school }      = useSchool()
    const { profile, isLoading } = useProfileStore()

    if (isLoading || !profile) {
        return (
            <Sidebar className="border-r border-border bg-card">
                <SidebarHeader className="border-b border-border bg-surface/50 p-6">
                    <div className="flex items-center gap-3 animate-pulse">
                        <Loader2 className="h-5 w-5 animate-spin text-school-primary" />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Synchronizing_Hub...</span>
                    </div>
                </SidebarHeader>
                <SidebarContent className="bg-card" />
            </Sidebar>
        )
    }

    const role         = profile.role
    const isAdmin      = role === 'SUPER_ADMIN' || role === 'SCHOOL_ADMIN'
    const isTeacher    = role === 'TEACHER'
    const isStudent    = role === 'STUDENT'
    const isParent     = role === 'PARENT'
    const isIndividual = role === 'INDIVIDUAL_LEARNER'

    const dashboardHref =
        isAdmin      ? '/admin' :
        isTeacher    ? '/teacher' :
        isIndividual ? '/student' :
        isStudent    ? '/student' :
        isParent     ? '/parent' : '/'

    const initials = (profile.name ?? profile.email)
        .split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase()

    return (
        <Sidebar className="border-r border-border bg-card">

            {/* ── HEADER: HUB IDENTITY (Rule 11/21) ── */}
            <SidebarHeader className="border-b border-border bg-surface/50 p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-school-primary flex items-center justify-center shadow-lg shadow-school-primary-200 shrink-0">
                            <ShieldCheck className="text-on-school-primary h-5 w-5" strokeWidth={2.5} />
                        </div>
                        <h2 className="text-lg font-extrabold text-school-primary truncate uppercase italic tracking-tighter leading-none">
                            {isIndividual ? 'Personal Hub' : (school?.name ?? profile.school?.name ?? 'Registry Hub')}
                        </h2>
                    </div>
                    <div className="shrink-0 scale-90">
                        <ThemeToggle />
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-school-primary-50 border border-school-primary-200 text-school-primary text-[9px] font-extrabold uppercase tracking-widest">
                        {role.replace(/_/g, ' ')}
                    </span>
                    <div className="h-1 w-1 rounded-full bg-border" />
                    <p className="text-[10px] text-muted-foreground font-bold truncate italic">
                        {profile.name}
                    </p>
                </div>
            </SidebarHeader>

            <SidebarContent className="custom-scrollbar bg-card py-4">

                <NavGroup label="Command Core">
                    <NavItem href={dashboardHref} icon={LayoutDashboard} label="Dashboard" />
                    <NavItem href="/notifications" icon={Bell} label="Alert Hub" />
                </NavGroup>

                {/* ── INDIVIDUAL LEARNER HUB (Combined Study + Admin) ── */}
                {isIndividual && (
                    <>
                        <NavGroup label="Personal Syllabus">
                            <NavItem href="/student/subject" icon={BookOpen} label="Subjects" />
                            <NavItem href="/subjects/manage" icon={Layers} label="Manage Sub" />
                            <NavItem href="/term-timeline" icon={Calendar} label="Termly Planner" />
                            <NavItem href="/pastQuestions" icon={History} label="Scanned Questions " />
                        </NavGroup>

                        <NavGroup label="Proficiency Lab">
                            <NavItem href="/student/quizzes" icon={Trophy} label="Take Quizzes" />
                            <NavItem href="/student/grades" icon={BarChart2} label="Academic Progress" />
                            <NavItem href="/student/assessment" icon={ClipboardList} label="Assessment History" />
                        </NavGroup>

                        <NavGroup label="Registry Control">
                            <NavItem href="/billing" icon={CreditCard} label="Subscription Hub" />
                            <NavItem href="/credits" icon={Zap} label="Credit Balance" />
                        </NavGroup>
                    </>
                )}

                {isAdmin && (
                    <>
                        <NavGroup label="Institutional Control">
                            <NavItem href="/admin/settings" icon={School} label="Settings" />
                            <NavItem href="/admin/invite-users" icon={UserPlus} label="Invite Users" />
                            <NavItem href="/admin/users" icon={Users} label="User Management" />
                            <NavItem href="/admin/users/parent-linking" icon={Users} label="Parent-Child Linker" />
                            <NavItem href="/admin/communication" icon={MessageCircle} label="WhatsApp Hub" />
                            <NavItem href="/classes" icon={Layers} label="Classroom Hubs" />
                        </NavGroup>

                        <NavGroup label="Academic Logic">
                            <NavItem href="/admin/curriculum" icon={BookMarked} label="Curriculum Hub" />
                            <NavItem href="/admin/curriculum/allocation" icon={TableProperties} label="Subject Matrix" />
                            <NavItem href="/admin/catalogue" icon={BookOpen} label="Course Catalogue" />
                        </NavGroup>

                        <NavGroup label="Financial Hub">
                            <NavItem href="/admin/assessments" icon={ClipboardList} label="Assessment Hub" />
                            <NavItem href="/admin/billing" icon={CreditCard} label="License & Billing" />
                        </NavGroup>
                    </>
                )}

                {isTeacher && (
                    <>
                        <NavGroup label="Hub Operations">
                            <NavItem href="/classes" icon={Layers} label="My Classrooms" />
                            <NavItem href="/subjects/manage" icon={BookOpen} label="Subjects" />
                            <NavItem href="/teacher/allocation" icon={TableProperties} label="Subject Matrix" />
                            <NavItem href="/term-timeline" icon={Calendar} label="Termly Planner" />
                            <NavItem href="/pastQuestions" icon={History} label="Scanned Questions " />
                        </NavGroup>

                        <NavGroup label="Content Logic">
                            <NavItem href="/teacher#ai-planner" icon={FileText} label="Lesson Planner" />
                            <NavItem href="/teacher/assessment" icon={ClipboardList} label="Assessments" />
                            <NavItem href="/teacher/students" icon={GraduationCap} label="Student Ledger" />
                            <NavItem href="/teacher/assessmentView" icon={BarChart2} label="Performance Hub" />
                        </NavGroup>
                    </>
                )}

                {isStudent && (
                    <>
                        <NavGroup label="Study Hub">
                            <NavItem href="/student/class" icon={Layers} label="My Classroom" />
                            <NavItem href="/student/subject" icon={BookOpen} label="Subjects" />
                            <NavItem href="/student/subject/elective" icon={TableProperties} label="Elective Subjects" />
                            <NavItem href="/term-timeline" icon={Calendar} label="Termly Planner" />
                        </NavGroup>
                        <NavGroup label="Proficiency">
                            <NavItem href="/student/quizzes" icon={Trophy} label="Take Quizzes" />
                            <NavItem href="/student/grades" icon={BarChart2} label="Academic Record" />
                        </NavGroup>
                    </>
                )}

                {isParent && (
                    <NavGroup label="Guardian Terminal">
                        <NavItem href="/parent/children" icon={Users} label="Child Profiles" />
                        <NavItem href="/parent/grades" icon={BarChart2} label="Results Hub" />
                        <NavItem href="/parent/feedback" icon={MessageSquare} label="Feedback Hub" />
                    </NavGroup>
                )}

            </SidebarContent>

            {/* ── FOOTER: IDENTITY TERMINAL ── */}
            <SidebarFooter className="p-4 border-t border-border bg-surface/50 space-y-4">
                <Link
                    href="/settings/profile"
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-3 hover:border-school-primary-200 transition-all group shadow-sm"
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-school-primary-50 border border-school-primary-100 text-[11px] font-extrabold text-school-primary shadow-inner">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-extrabold text-school-primary uppercase tracking-widest group-hover:brightness-110 transition-all italic leading-none">
                            Profile Hub
                        </p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1 truncate">Settings</p>
                    </div>
                    <UserCircle className="h-5 w-5 text-muted-foreground group-hover:text-school-primary transition-colors shrink-0" />
                </Link>

                <div className="px-1">
                    <LogoutButton variant="sidebar" />
                </div>
            </SidebarFooter>

        </Sidebar>
    )
}