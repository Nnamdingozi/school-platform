// 'use client';

// import {
//     Sidebar,
//     SidebarContent,
//     SidebarFooter,
//     SidebarHeader,
//     SidebarMenu,
//     SidebarMenuItem,
//     SidebarMenuButton,
//     SidebarGroup,
//     SidebarGroupLabel,
//     SidebarGroupContent,
// } from "@/components/ui/sidebar";
// import { useSchool } from "@/context/schoolProvider";
// import { useProfileStore } from "@/store/profileStore";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//     LayoutDashboard,
//     BookOpen,
//     ClipboardList,
//     GraduationCap,
//     BarChart2,
//     Users,
//     Loader2,
//     Bell,
//     BookMarked,
//     School,
//     CreditCard,
//     FileText,
//     MessageSquare,
//     Trophy,
//     Calendar,
//     UserCircle,
//     Layers,
//     TableProperties, // For Subject Allocation Matrix
//     MessageCircle,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// const navItemClass = cn(
//     "flex items-center gap-3 rounded-lg px-3 py-2 w-full",
//     "text-school-primary transition-all duration-200",
//     "hover:bg-school-primary hover:text-school-secondary-100",
//     "hover:scale-[1.03] hover:shadow-sm",
//     "active:scale-[0.98]"
// );

// function NavItem({ href, icon: Icon, label }: {
//     href: string;
//     icon: React.ElementType;
//     label: string;
// }) {
//     return (
//         <SidebarMenuItem>
//             <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent">
//                 <Link href={href} className={navItemClass}>
//                     <Icon className="h-4 w-4 shrink-0" />
//                     <span>{label}</span>
//                 </Link>
//             </SidebarMenuButton>
//         </SidebarMenuItem>
//     );
// }

// function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
//     return (
//         <SidebarGroup>
//             <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-school-secondary-100/30 px-3 py-1">
//                 {label}
//             </SidebarGroupLabel>
//             <SidebarGroupContent>
//                 <SidebarMenu className="space-y-0.5">
//                     {children}
//                 </SidebarMenu>
//             </SidebarGroupContent>
//         </SidebarGroup>
//     );
// }

// export function AppSidebar() {
//     const { school } = useSchool();
//     const { profile, isLoading } = useProfileStore();

//     if (isLoading || !profile) {
//         return (
//             <Sidebar className="border-r border-school-secondary-800">
//                 <SidebarHeader className="border-b border-school-secondary-800 bg-school-secondary-950 p-4">
//                     <div className="flex items-center gap-2 text-school-secondary-100/40">
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         <span className="text-sm">Loading...</span>
//                     </div>
//                 </SidebarHeader>
//                 <SidebarContent className="bg-school-secondary-950" />
//             </Sidebar>
//         );
//     }

//     const role = profile.role;
//     const isAdmin = role === "SUPER_ADMIN" || role === "SCHOOL_ADMIN";
//     const isTeacher = role === "TEACHER";
//     const isStudent = role === "STUDENT";
//     const isParent = role === "PARENT";

//     const dashboardHref =
//         isAdmin ? "/admin" :
//         isTeacher ? "/teacher" :
//         isStudent ? "/student" :
//         isParent ? "/parent" : "/";

//     return (
//         <Sidebar className="border-r border-school-secondary-800">

//             {/* ── Header: School + User Info ───────────────────────────── */}
//             <SidebarHeader className="border-b border-school-secondary-800 bg-school-secondary-950 p-4 space-y-1">
//                 <h2 className="text-lg font-semibold text-school-primary truncate">
//                     {school?.name ?? profile.school?.name ?? "EduAI"}
//                 </h2>
//                 <p className="text-sm text-school-secondary-100 font-medium">
//                     {profile.name}
//                 </p>
//                 <span className="inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-school-primary/10 text-school-primary">
//                     {role.toLowerCase().replace(/_/g, ' ')}
//                 </span>
//                 <p className="text-xs text-school-secondary-100/50 truncate pt-0.5">
//                     {profile.email}
//                 </p>
//             </SidebarHeader>

//             {/* ── Navigation ───────────────────────────────────────────── */}
//             <SidebarContent className="bg-school-secondary-950 px-2 py-3 space-y-2">

//                 {/* Shared: Dashboard */}
//                 <NavGroup label="Overview">
//                     <NavItem href={dashboardHref} icon={LayoutDashboard} label="Dashboard" />
//                     <NavItem href="/notifications" icon={Bell} label="Notifications" />
//                 </NavGroup>

//                 {/* ── SCHOOL ADMIN / SUPER ADMIN ───────────────────────── */}
//                 {isAdmin && (
//                     <>
//                        <NavGroup label="School Management">
//     <NavItem href="/admin/settings" icon={School} label="School Settings" />
//     <NavItem href="/admin/users" icon={Users} label="Users & Roles" />
//     {/* ✅ Direct Link to the new Hub */}
//     <NavItem href="/admin/communication" icon={MessageCircle} label="WhatsApp Hub" />
//     <NavItem href="/admin/classes" icon={Layers} label="Classes" />
// </NavGroup>

//                         <NavGroup label="Curriculum">
//                             <NavItem href="/admin/curriculum" icon={BookMarked} label="Curriculum" />
//                             <NavItem href="/admin/subjects" icon={BookOpen} label="Subjects" />
//                             {/* ✅ NEW: Subject Allocation Matrix */}
//                             <NavItem href="/admin/curriculum/allocation" icon={TableProperties} label="Subject Allocation" />
//                             <NavItem href="/admin/lessons" icon={FileText} label="Lessons" />
//                         </NavGroup>

//                         <NavGroup label="Assessment & Reports">
//                             <NavItem href="/admin/assessments" icon={ClipboardList} label="Assessments" />
//                             <NavItem href="/admin/feedback" icon={MessageSquare} label="Feedback" />
//                             <NavItem href="/admin/reports" icon={BarChart2} label="Reports" />
//                         </NavGroup>

//                         <NavGroup label="Billing">
//                             <NavItem href="/admin/billing" icon={CreditCard} label="Subscription & Billing" />
//                         </NavGroup>
//                     </>
//                 )}

//                 {/* ── TEACHER ──────────────────────────────────────────── */}
//                 {isTeacher && (
//                     <>
//                         <NavGroup label="Teaching">
//                             <NavItem href="/teacher/classes" icon={Layers} label="My Classes" />
//                             <NavItem href="/teacher/subjects" icon={BookOpen} label="My Subjects" />
//                             {/* ✅ NEW: Subject Allocation Matrix for their class */}
//                             <NavItem href="/teacher/allocation" icon={TableProperties} label="Subject Allocation" />
//                             <NavItem href="/teacher/topics" icon={Calendar} label="Topics & Schedule" />
//                         </NavGroup>

//                         <NavGroup label="Content">
//                             <NavItem href="/teacher/lessons" icon={FileText} label="Lessons" />
//                             <NavItem href="/teacher/assessments" icon={ClipboardList} label="Assessments" />
//                         </NavGroup>

//                         <NavGroup label="Students">
//                             <NavItem href="/teacher/students" icon={GraduationCap} label="My Students" />
//                             <NavItem href="/teacher/feedback" icon={MessageSquare} label="Feedback Sent" />
//                             <NavItem href="/teacher/reports" icon={BarChart2} label="Performance Reports" />
//                         </NavGroup>
//                     </>
//                 )}

//                 {/* ── STUDENT ──────────────────────────────────────────── */}
//                 {isStudent && (
//                     <>
//                         <NavGroup label="Learning">
//                             <NavItem href="/student/subjects" icon={BookOpen} label="My Subjects" />
//                             {/* ✅ NEW: Elective Selection (Student Portal) */}
//                             <NavItem href="/student/subjects/electives" icon={TableProperties} label="Select Electives" />
//                             <NavItem href="/student/lessons" icon={FileText} label="Lessons" />
//                             <NavItem href="/student/topics" icon={Calendar} label="Topics" />
//                         </NavGroup>

//                         <NavGroup label="Assessments">
//                             <NavItem href="/student/assessments" icon={ClipboardList} label="My Assessments" />
//                             <NavItem href="/student/quizzes" icon={Trophy} label="Quizzes" />
//                         </NavGroup>

//                         <NavGroup label="Progress">
//                             <NavItem href="/student/grades" icon={BarChart2} label="My Grades" />
//                             <NavItem href="/student/feedback" icon={MessageSquare} label="My Feedback" />
//                         </NavGroup>
//                     </>
//                 )}

//                 {/* ── PARENT ───────────────────────────────────────────── */}
//                 {isParent && (
//                     <>
//                         <NavGroup label="My Children">
//                             <NavItem href="/parent/children" icon={GraduationCap} label="Children" />
//                             <NavItem href="/parent/classes" icon={Layers} label="Classes & Subjects" />
//                         </NavGroup>

//                         <NavGroup label="Progress">
//                             <NavItem href="/parent/assessments" icon={ClipboardList} label="Assessments" />
//                             <NavItem href="/parent/grades" icon={BarChart2} label="Grades Overview" />
//                             <NavItem href="/parent/feedback" icon={MessageSquare} label="School Feedback" />
//                         </NavGroup>
//                     </>
//                 )}

//             </SidebarContent>

//             {/* ── Footer: Profile Settings ──────────────────────────────── */}
//             <SidebarFooter className="p-4 border-t border-school-secondary-800 bg-school-secondary-950">
//                 <Button
//                     className={cn(
//                         "w-full bg-school-primary text-school-secondary-950 font-semibold",
//                         "hover:bg-school-primary-600 hover:scale-[1.02]",
//                         "transition-all duration-200 active:scale-[0.98]"
//                     )}
//                     asChild
//                 >
//                     <Link href="/settings/profile">
//                         <UserCircle className="h-4 w-4 mr-2" />
//                         Profile Settings
//                     </Link>
//                 </Button>
//             </SidebarFooter>

//         </Sidebar>
//     );
// }


// 'use client';

// import {
//     Sidebar,
//     SidebarContent,
//     SidebarFooter,
//     SidebarHeader,
//     SidebarMenu,
//     SidebarMenuItem,
//     SidebarMenuButton,
//     SidebarGroup,
//     SidebarGroupLabel,
//     SidebarGroupContent,
// } from "@/components/ui/sidebar";
// import { useSchool } from "@/context/schoolProvider";
// import { useProfileStore } from "@/store/profileStore";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//     LayoutDashboard,
//     BookOpen,
//     ClipboardList,
//     GraduationCap,
//     BarChart2,
//     Users,
//     Loader2,
//     Bell,
//     BookMarked,
//     School,
//     CreditCard,
//     FileText,
//     MessageSquare,
//     Trophy,
//     Calendar,
//     UserCircle,
//     Layers,
//     TableProperties, // ✅ Icon for Allocation Matrix
//     MessageCircle,
//     UserPlus,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// const navItemClass = cn(
//     "flex items-center gap-3 rounded-lg px-3 py-2 w-full",
//     "text-school-primary transition-all duration-200",
//     "hover:bg-school-primary hover:text-school-secondary-100",
//     "hover:scale-[1.03] hover:shadow-sm",
//     "active:scale-[0.98]"
// );

// function NavItem({ href, icon: Icon, label }: {
//     href: string;
//     icon: React.ElementType;
//     label: string;
// }) {
//     return (
//         <SidebarMenuItem>
//             <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent text-inherit">
//                 <Link href={href} className={navItemClass}>
//                     <Icon className="h-4 w-4 shrink-0" />
//                     <span>{label}</span>
//                 </Link>
//             </SidebarMenuButton>
//         </SidebarMenuItem>
//     );
// }

// function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
//     return (
//         <SidebarGroup>
//             <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-school-secondary-100/30 px-3 py-1">
//                 {label}
//             </SidebarGroupLabel>
//             <SidebarGroupContent>
//                 <SidebarMenu className="space-y-0.5">
//                     {children}
//                 </SidebarMenu>
//             </SidebarGroupContent>
//         </SidebarGroup>
//     );
// }

// export function AppSidebar() {
//     const { school } = useSchool();
//     const { profile, isLoading } = useProfileStore();

//     if (isLoading || !profile) {
//         return (
//             <Sidebar className="border-r border-school-secondary-800">
//                 <SidebarHeader className="border-b border-school-secondary-800 bg-school-secondary-950 p-4">
//                     <div className="flex items-center gap-2 text-school-secondary-100/40">
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         <span className="text-sm font-mono uppercase tracking-widest">Loading...</span>
//                     </div>
//                 </SidebarHeader>
//                 <SidebarContent className="bg-school-secondary-950" />
//             </Sidebar>
//         );
//     }

//     const role = profile.role;
//     const isAdmin = role === "SUPER_ADMIN" || role === "SCHOOL_ADMIN";
//     const isTeacher = role === "TEACHER";
//     const isStudent = role === "STUDENT";
//     const isParent = role === "PARENT";

//     const dashboardHref =
//         isAdmin ? "/admin" :
//         isTeacher ? "/teacher" :
//         isStudent ? "/student" :
//         isParent ? "/parent" : "/";

//     return (
//         <Sidebar className="border-r border-school-secondary-800">

//             {/* ── Header: School + User Info ───────────────────────────── */}
//             <SidebarHeader className="border-b border-school-secondary-800 bg-school-secondary-950 p-4 space-y-1">
//                 <h2 className="text-lg font-black text-school-primary truncate uppercase italic tracking-tighter">
//                     {school?.name ?? profile.school?.name ?? "EduAI"}
//                 </h2>
//                 <p className="text-sm text-school-secondary-100 font-bold truncate">
//                     {profile.name}
//                 </p>
//                 <span className="inline-block text-[9px] uppercase tracking-[0.2em] font-black px-2 py-0.5 rounded-md bg-school-primary/10 text-school-primary border border-school-primary/20 w-fit">
//                     {role.replace(/_/g, ' ')}
//                 </span>
//             </SidebarHeader>

//             {/* ── Navigation ───────────────────────────────────────────── */}
//             <SidebarContent className="bg-school-secondary-950 px-2 py-4 space-y-4">

//                 {/* Shared: Dashboard */}
//                 <NavGroup label="Command Center">
//                     <NavItem href={dashboardHref} icon={LayoutDashboard} label="Dashboard" />
//                     <NavItem href="/notifications" icon={Bell} label="System Alerts" />
//                 </NavGroup>

//                 {/* ── SCHOOL ADMIN / SUPER ADMIN ───────────────────────── */}
//                 {isAdmin && (
//                     <>
//                         <NavGroup label="Institutional Control">
//                             <NavItem href="/admin/settings" icon={School} label="Global Settings" />
//                             <NavItem href="/admin/invite-users" icon={UserPlus} label="Invite Users" />
//                             <NavItem href="/admin/users" icon={Users} label="User Registry" />
//                             <NavItem href="/admin/users/parent-linking" icon={UserPlus} label="Family Relations" />
//                             <NavItem href="/admin/communication" icon={MessageCircle} label="WhatsApp Hub" />
//                             <NavItem href="/admin/classes" icon={Layers} label="Add Class" />
//                         </NavGroup>

//                         <NavGroup label="Academic Logic">
//                             <NavItem href="/admin/curriculum" icon={BookMarked} label="Master Curriculum" />
//                             {/* ✅ ADMIN ALLOCATION LINK */}
//                             <NavItem href="/admin/subject" icon={TableProperties} label="Subject Allocation" />
//                             <NavItem href="/admin/catalogue" icon={BookOpen} label="Course Catalog" />
//                             <NavItem href="/admin/lessons" icon={FileText} label="Lesson Bank" />
//                         </NavGroup>

//                         <NavGroup label="Intelligence">
//                             <NavItem href="/admin/assessments" icon={ClipboardList} label="Exam Registry" />
//                             <NavItem href="/admin/reports" icon={BarChart2} label="Analytical Insights" />
//                             <NavItem href="/admin/subscription" icon={CreditCard} label="Finance & Billing" />
//                         </NavGroup>
//                     </>
//                 )}

//                 {/* ── TEACHER ──────────────────────────────────────────── */}
//                 {isTeacher && (
//                     <>
//                         <NavGroup label="Academic Operations">
//                             <NavItem href="/teacher/classes" icon={Layers} label="My Classrooms" />
//                             <NavItem href="/teacher/subjects" icon={BookOpen} label="Assigned Subjects" />
//                             {/* ✅ TEACHER ALLOCATION LINK */}
//                             <NavItem href="/teacher/allocation" icon={TableProperties} label="Subject Allocation" />
//                             <NavItem href="/teacher/topics" icon={Calendar} label="Termly Schedule" />
//                         </NavGroup>

//                         <NavGroup label="Content & Assessment">
//                             <NavItem href="/teacher/lessons" icon={FileText} label="AI Lesson Plans" />
//                             <NavItem href="/teacher/assessments" icon={ClipboardList} label="Gradebook" />
//                             <NavItem href="/teacher/students" icon={GraduationCap} label="Student Directory" />
//                             <NavItem href="/teacher/reports" icon={BarChart2} label="Performance Data" />
//                         </NavGroup>
//                     </>
//                 )}

//                 {/* ── STUDENT ──────────────────────────────────────────── */}
//                 {isStudent && (
//                     <>
//                         <NavGroup label="Study Portal">
//                             <NavItem href="/student/subjects" icon={BookOpen} label="My Subjects" />
//                             <NavItem href="/student/subjects/electives" icon={TableProperties} label="Pick Electives" />
//                             <NavItem href="/student/lessons" icon={FileText} label="Digital Lessons" />
//                         </NavGroup>
//                         <NavGroup label="Evaluations">
//                             <NavItem href="/student/quizzes" icon={Trophy} label="AI Challenges" />
//                             <NavItem href="/student/grades" icon={BarChart2} label="Academic Record" />
//                         </NavGroup>
//                     </>
//                 )}

//                 {/* ── PARENT ───────────────────────────────────────────── */}
//                 {isParent && (
//                     <>
//                         <NavGroup label="Guardian Hub">
//                             <NavItem href="/parent/children" icon={Users} label="Child Profiles" />
//                             <NavItem href="/parent/grades" icon={BarChart2} label="Results Portal" />
//                             <NavItem href="/parent/feedback" icon={MessageSquare} label="School Comms" />
//                         </NavGroup>
//                     </>
//                 )}

//             </SidebarContent>

//             {/* ── Footer: Profile Settings ──────────────────────────────── */}
//             <SidebarFooter className="p-4 border-t border-school-secondary-800 bg-school-secondary-950">
//                 <Button
//                     className={cn(
//                         "w-full bg-school-primary text-school-secondary-950 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-school-primary/10",
//                         "hover:scale-[1.02] hover:bg-school-secondary-950 hover:text-school-primary transition-all duration-200 active:scale-[0.98]"
//                     )}
//                     asChild
//                 >
//                     <Link href="/settings/profile">
//                         <UserCircle className="h-4 w-4 mr-2" />
//                         Profile Settings
//                     </Link>
//                 </Button>
//             </SidebarFooter>

//         </Sidebar>
//     );
// }


'use client'

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
import Link from 'next/link'
import {
    LayoutDashboard, BookOpen, ClipboardList,
    GraduationCap, BarChart2, Users, Loader2,
    Bell, BookMarked, School, CreditCard, FileText,
    MessageSquare, Trophy, Calendar, UserCircle,
    Layers, TableProperties, MessageCircle, UserPlus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
// ✅ Only import what the Sidebar needs
import { LogoutButton } from './shared/logOutButton'

// ── Nav item ───────────────────────────────────────────────────────────────────

const navItemClass = cn(
    'flex items-center gap-3 rounded-lg px-3 py-2 w-full',
    'text-school-primary transition-all duration-200',
    'hover:bg-school-primary hover:text-school-secondary-100',
    'hover:scale-[1.03] hover:shadow-sm',
    'active:scale-[0.98]'
)

function NavItem({ href, icon: Icon, label }: {
    href:  string
    icon:  React.ElementType
    label: string
}) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent text-inherit">
                <Link href={href} className={navItemClass}>
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-school-secondary-100/50 px-3 py-1">
                {label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                    {children}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

// ── Main sidebar ───────────────────────────────────────────────────────────────

export function AppSidebar() {
    const { school }      = useSchool()
    const { profile, isLoading } = useProfileStore()

    if (isLoading || !profile) {
        return (
            <Sidebar className="border-r border-school-secondary-800">
                <SidebarHeader className="border-b border-school-secondary-800 bg-school-secondary-950 p-4">
                    <div className="flex items-center gap-2 text-school-secondary-100/40">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm font-mono uppercase tracking-widest">Loading...</span>
                    </div>
                </SidebarHeader>
                <SidebarContent className="bg-school-secondary-950" />
            </Sidebar>
        )
    }

    const role      = profile.role
    const isAdmin   = role === 'SUPER_ADMIN' || role === 'SCHOOL_ADMIN'
    const isTeacher = role === 'TEACHER'
    const isStudent = role === 'STUDENT'
    const isParent  = role === 'PARENT'

    const dashboardHref =
        isAdmin   ? '/admin'   :
        isTeacher ? '/teacher' :
        isStudent ? '/student' :
        isParent  ? '/parent'  : '/'

    const initials = (profile.name ?? profile.email)
        .split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

    return (
        <Sidebar className="border-r border-school-secondary-800">

            {/* ── Header ── */}
            <SidebarHeader className="border-b border-school-secondary-800 bg-school-secondary-950 p-4 space-y-1">
                <h2 className="text-lg font-black text-school-primary truncate uppercase italic tracking-tighter">
                    {school?.name ?? profile.school?.name ?? 'EduAI'}
                </h2>
                <p className="text-sm text-school-secondary-100 font-bold truncate">
                    {profile.name}
                </p>
                <span className="inline-block text-[9px] uppercase tracking-[0.2em] font-black px-2 py-0.5 rounded-md bg-school-primary/10 text-school-primary border border-school-primary/20 w-fit">
                    {role.replace(/_/g, ' ')}
                </span>
            </SidebarHeader>

            {/* ── Navigation ── */}
            <SidebarContent className="custom-scrollbar bg-school-secondary-950 px-2 py-4 space-y-4">

                <NavGroup label="Command Center">
                    <NavItem href={dashboardHref} icon={LayoutDashboard} label="Dashboard" />
                    <NavItem href="/notifications" icon={Bell} label="System Alerts" />
                </NavGroup>

                {/* ── Admin ── */}
                {isAdmin && (
                    <>
                        <NavGroup label="Institutional Control">
                            <NavItem href="/admin/settings" icon={School} label="Global Settings" />
                            <NavItem href="/admin/invite-users" icon={UserPlus} label="Invite Users" />
                            <NavItem href="/admin/users" icon={Users} label="User Registry" />
                            <NavItem href="/admin/users/parent-linking" icon={UserPlus} label="Family Relations" />
                            <NavItem href="/admin/communication" icon={MessageCircle} label="WhatsApp Hub" />
                            <NavItem href="/classes" icon={Layers} label="Add Class" />
                        </NavGroup>

                        <NavGroup label="Academic Logic">
                            <NavItem href="/admin/curriculum" icon={BookMarked} label="Master Curriculum" />
                            <NavItem href="/admin/curriculum/allocation" icon={TableProperties} label="Subject Allocation" />
                            <NavItem href="/admin/catalogue" icon={BookOpen} label="Course Catalog" />
                            <NavItem href="/admin/lessons" icon={FileText} label="Lesson Bank" />
                        </NavGroup>

                        <NavGroup label="Intelligence">
                            <NavItem href="/admin/assessments" icon={ClipboardList} label="Exam Registry" />
                            <NavItem href="/admin/reports" icon={BarChart2} label="Analytical Insights" />
                            <NavItem href="/admin/billing" icon={CreditCard} label="Finance & Billing" />
                        </NavGroup>
                    </>
                )}

                {/* ── Teacher ── */}
                {isTeacher && (
                    <>
                        <NavGroup label="Academic Operations">
                            <NavItem href="/classes" icon={Layers} label="My Classrooms" />
                            <NavItem href="/subjects/manage" icon={BookOpen} label="Assigned Subjects" />
                            <NavItem href="/teacher/allocation" icon={TableProperties} label="Subject Allocation" />
                            <NavItem href="/teacher/term-timeline" icon={Calendar} label="Termly Schedule" />
                        </NavGroup>

                        <NavGroup label="Content & Assessment">
                            <NavItem   href="/teacher#lesson-planner-section"  icon={FileText} label="AI Lesson Plans" />
                            <NavItem href="/teacher/assessment" icon={ClipboardList} label="Examination" />
                            <NavItem href="/teacher/students" icon={GraduationCap} label="Student Directory" />
                            <NavItem href="/teacher/assessmentView" icon={BarChart2} label="Performance Data" />
                        </NavGroup>
                    </>
                )}

                {/* ── Student ── */}
                {isStudent && (
                    <>
                        <NavGroup label="Study Portal">
                        <NavItem href="/student/class" icon={Layers} label="My Class" />
                            <NavItem href="/student/subject" icon={BookOpen} label="My Subjects" />
                            <NavItem href="/student/subject/elective" icon={TableProperties} label="Pick Electives" />
                            
                        </NavGroup>
                        <NavGroup label="Evaluations">
                            <NavItem href="/student/quizzes" icon={Trophy} label="AI Challenges" />
                            <NavItem href="/student/grades" icon={BarChart2} label="Academic Record" />
                        </NavGroup>
                    </>
                )}

                {/* ── Parent ── */}
                {isParent && (
                    <NavGroup label="Guardian Hub">
                        <NavItem href="/parent/children" icon={Users} label="Child Profiles" />
                        <NavItem href="/parent/grades" icon={BarChart2} label="Results Portal" />
                        <NavItem href="/parent/feedback" icon={MessageSquare} label="School Comms" />
                    </NavGroup>
                )}

            </SidebarContent>

            {/* ── Footer ── */}
            <SidebarFooter className="p-4 border-t border-school-secondary-800 bg-school-secondary-950 space-y-3">
                <Link
                    href="/settings/profile"
                    className="flex items-center gap-3 rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 px-3 py-2.5 hover:border-school-secondary-600 hover:bg-school-secondary-800 transition-all group"
                >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20 text-[11px] font-black text-school-primary">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-school-primary truncate group-hover:text-white transition-colors">
                            Profile Settings
                        </p>
                    </div>
                    <UserCircle className="h-4 w-4 text-school-secondary-500 group-hover:text-school-primary transition-colors shrink-0" />
                </Link>

                {/* ✅ REUSABLE LOGOUT COMPONENT (Logic hidden inside) */}
                <LogoutButton variant="sidebar" />
            </SidebarFooter>

        </Sidebar>
    )
}