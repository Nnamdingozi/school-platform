'use client';

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
} from "@/components/ui/sidebar";
import { useSchool } from "@/context/schoolProvider";
import { useProfileStore } from "@/store/profileStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    GraduationCap,
    BarChart2,
    Users,
    Loader2,
    Bell,
    BookMarked,
    School,
    CreditCard,
    FileText,
    MessageSquare,
    Trophy,
    Calendar,
    UserCircle,
    Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItemClass = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 w-full",
    "text-school-primary transition-all duration-200",
    "hover:bg-school-primary hover:text-school-secondary-100",
    "hover:scale-[1.03] hover:shadow-sm",
    "active:scale-[0.98]"
);

function NavItem({ href, icon: Icon, label }: {
    href: string;
    icon: React.ElementType;
    label: string;
}) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent">
                <Link href={href} className={navItemClass}>
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-school-secondary-100/30 px-3 py-1">
                {label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                    {children}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

export function AppSidebar() {
    const { school } = useSchool();
    const { profile, isLoading } = useProfileStore();

    if (isLoading || !profile) {
        return (
            <Sidebar className="border-r border-school-secondary-800">
                <SidebarHeader className="border-b border-school-secondary-800 bg-school-secondary-950 p-4">
                    <div className="flex items-center gap-2 text-school-secondary-100/40">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Loading...</span>
                    </div>
                </SidebarHeader>
                <SidebarContent className="bg-school-secondary-950" />
            </Sidebar>
        );
    }

    const role = profile.role;
    const isAdmin = role === "SUPER_ADMIN" || role === "SCHOOL_ADMIN";
    const isTeacher = role === "TEACHER";
    const isStudent = role === "STUDENT";
    const isParent = role === "PARENT";

    // Dashboard href varies by role
    const dashboardHref =
        isAdmin ? "/admin" :
        isTeacher ? "/teacher" :
        isStudent ? "/student" :
        isParent ? "/parent" : "/";

    return (
        <Sidebar className="border-r border-school-secondary-800">

            {/* ── Header: School + User Info ───────────────────────────── */}
            <SidebarHeader className="border-b border-school-secondary-800 bg-school-secondary-950 p-4 space-y-1">
                <h2 className="text-lg font-semibold text-school-primary truncate">
                    {school?.name ?? profile.school?.name ?? "EduAI"}
                </h2>
                <p className="text-sm text-school-secondary-100 font-medium">
                    {profile.name}
                </p>
                <span className="inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-school-primary/10 text-school-primary">
                    {role.toLowerCase().replace(/_/g, ' ')}
                </span>
                <p className="text-xs text-school-secondary-100/50 truncate pt-0.5">
                    {profile.email}
                </p>
            </SidebarHeader>

            {/* ── Navigation ───────────────────────────────────────────── */}
            <SidebarContent className="bg-school-secondary-950 px-2 py-3 space-y-2">

                {/* Shared: Dashboard */}
                <NavGroup label="Overview">
                    <NavItem href={dashboardHref} icon={LayoutDashboard} label="Dashboard" />
                    <NavItem href="/notifications" icon={Bell} label="Notifications" />
                </NavGroup>

                {/* ── SCHOOL ADMIN / SUPER ADMIN ───────────────────────── */}
                {isAdmin && (
                    <>
                        <NavGroup label="School Management">
                            {/* School model → name, colors, curriculum */}
                            <NavItem href="/admin/settings" icon={School} label="School Settings" />
                            {/* Profile model → all users in school */}
                            <NavItem href="/admin/users" icon={Users} label="Users & Roles" />
                            {/* Class model → classes in school */}
                            <NavItem href="/admin/classes" icon={Layers} label="Classes" />
                        </NavGroup>

                        <NavGroup label="Curriculum">
                            {/* Grade + Term + Subject + Topic models */}
                            <NavItem href="/admin/curriculum" icon={BookMarked} label="Curriculum" />
                            {/* GradeSubject model → subject assignments */}
                            <NavItem href="/admin/subjects" icon={BookOpen} label="Subjects" />
                            {/* Lesson model → AI generated content */}
                            <NavItem href="/admin/lessons" icon={FileText} label="Lessons" />
                        </NavGroup>

                        <NavGroup label="Assessment & Reports">
                            {/* Assessment model → all school assessments */}
                            <NavItem href="/admin/assessments" icon={ClipboardList} label="Assessments" />
                            {/* Feedback model → WhatsApp feedback tracking */}
                            <NavItem href="/admin/feedback" icon={MessageSquare} label="Feedback" />
                            {/* Analytics across all models */}
                            <NavItem href="/admin/reports" icon={BarChart2} label="Reports" />
                        </NavGroup>

                        <NavGroup label="Billing">
                            {/* Subscription model */}
                            <NavItem href="/admin/billing" icon={CreditCard} label="Subscription & Billing" />
                        </NavGroup>
                    </>
                )}

                {/* ── TEACHER ──────────────────────────────────────────── */}
                {isTeacher && (
                    <>
                        <NavGroup label="Teaching">
                            {/* Class model → taughtClasses relation */}
                            <NavItem href="/teacher/classes" icon={Layers} label="My Classes" />
                            {/* GradeSubject → gradeSubjectsTaught relation */}
                            <NavItem href="/teacher/subjects" icon={BookOpen} label="My Subjects" />
                            {/* Topic model → topics in their subjects */}
                            <NavItem href="/teacher/topics" icon={Calendar} label="Topics & Schedule" />
                        </NavGroup>

                        <NavGroup label="Content">
                            {/* Lesson model → AI lessons for their topics */}
                            <NavItem href="/teacher/lessons" icon={FileText} label="Lessons" />
                            {/* Assessment model → assessments they manage */}
                            <NavItem href="/teacher/assessments" icon={ClipboardList} label="Assessments" />
                        </NavGroup>

                        <NavGroup label="Students">
                            {/* ClassEnrollment model → students in their classes */}
                            <NavItem href="/teacher/students" icon={GraduationCap} label="My Students" />
                            {/* Feedback model → WhatsApp feedback they sent */}
                            <NavItem href="/teacher/feedback" icon={MessageSquare} label="Feedback Sent" />
                            <NavItem href="/teacher/reports" icon={BarChart2} label="Performance Reports" />
                        </NavGroup>
                    </>
                )}

                {/* ── STUDENT ──────────────────────────────────────────── */}
                {isStudent && (
                    <>
                        <NavGroup label="Learning">
                            {/* ClassEnrollment → their enrolled subjects */}
                            <NavItem href="/student/subjects" icon={BookOpen} label="My Subjects" />
                            {/* Lesson model → lessons for their enrolled topics */}
                            <NavItem href="/student/lessons" icon={FileText} label="Lessons" />
                            {/* Topic model → their curriculum topics */}
                            <NavItem href="/student/topics" icon={Calendar} label="Topics" />
                        </NavGroup>

                        <NavGroup label="Assessments">
                            {/* Assessment model → StudentAssessments relation */}
                            <NavItem href="/student/assessments" icon={ClipboardList} label="My Assessments" />
                            {/* Quiz model → quizzes on their lessons */}
                            <NavItem href="/student/quizzes" icon={Trophy} label="Quizzes" />
                        </NavGroup>

                        <NavGroup label="Progress">
                            {/* Assessment scores + feedback received */}
                            <NavItem href="/student/grades" icon={BarChart2} label="My Grades" />
                            {/* Feedback model → feedback they received */}
                            <NavItem href="/student/feedback" icon={MessageSquare} label="My Feedback" />
                        </NavGroup>
                    </>
                )}

                {/* ── PARENT ───────────────────────────────────────────── */}
                {isParent && (
                    <>
                        <NavGroup label="My Children">
                            {/* Profile model → children linked to parent */}
                            <NavItem href="/parent/children" icon={GraduationCap} label="Children" />
                            {/* ClassEnrollment → their children's classes */}
                            <NavItem href="/parent/classes" icon={Layers} label="Classes & Subjects" />
                        </NavGroup>

                        <NavGroup label="Progress">
                            {/* Assessment model → children's assessments */}
                            <NavItem href="/parent/assessments" icon={ClipboardList} label="Assessments" />
                            {/* Assessment scores overview */}
                            <NavItem href="/parent/grades" icon={BarChart2} label="Grades Overview" />
                            {/* Feedback model → WhatsApp feedback received */}
                            <NavItem href="/parent/feedback" icon={MessageSquare} label="School Feedback" />
                        </NavGroup>
                    </>
                )}

            </SidebarContent>

            {/* ── Footer: Profile Settings ──────────────────────────────── */}
            <SidebarFooter className="p-4 border-t border-school-secondary-800 bg-school-secondary-950">
                <Button
                    className={cn(
                        "w-full bg-school-primary text-school-secondary-950 font-semibold",
                        "hover:bg-school-primary-600 hover:scale-[1.02]",
                        "transition-all duration-200 active:scale-[0.98]"
                    )}
                    asChild
                >
                    <Link href="/settings/profile">
                        <UserCircle className="h-4 w-4 mr-2" />
                        Profile Settings
                    </Link>
                </Button>
            </SidebarFooter>

        </Sidebar>
    );
}
