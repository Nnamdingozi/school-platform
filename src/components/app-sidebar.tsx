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
    LogOut, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { logoutAction } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-school-secondary-100/30 px-3 py-1">
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

// ── Logout button ──────────────────────────────────────────────────────────────

function LogoutButton() {
    const [confirming,  setConfirming]  = useState(false)
    const [loggingOut,  setLoggingOut]  = useState(false)
    const { clearProfile }              = useProfileStore()
    const router                        = useRouter()

    async function handleLogout() {
        if (!confirming) {
            // First click — ask for confirmation
            setConfirming(true)
            // Auto-cancel after 4 seconds if user doesn't confirm
            setTimeout(() => setConfirming(false), 4000)
            return
        }

        // Second click — confirmed, proceed
        setLoggingOut(true)
        try {
            clearProfile()
            await logoutAction()
        } catch {
            // logoutAction redirects — if we reach here something went wrong
            toast.error('Failed to log out. Please try again.')
            setLoggingOut(false)
            setConfirming(false)
        }
    }

    return (
        <div className="space-y-2">
            {/* Confirmation hint */}
            {confirming && !loggingOut && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
                    <span className="text-[10px] text-red-400 font-semibold flex-1">
                        Click again to confirm logout
                    </span>
                    <button
                        onClick={() => setConfirming(false)}
                        className="text-[10px] text-school-secondary-500 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            )}

            <button
                onClick={handleLogout}
                disabled={loggingOut}
                className={cn(
                    'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all',
                    'border disabled:opacity-50 disabled:cursor-not-allowed',
                    confirming && !loggingOut
                        // Confirmed state — red
                        ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                        // Default state
                        : 'bg-school-secondary-800 border-school-secondary-700 text-school-secondary-300 hover:text-white hover:border-school-secondary-600'
                )}
            >
                {loggingOut ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                        <span>Signing out...</span>
                    </>
                ) : confirming ? (
                    <>
                        <LogOut className="h-4 w-4 shrink-0 text-red-400" />
                        <span className="flex-1 text-left">Confirm Sign Out</span>
                        <ChevronRight className="h-3.5 w-3.5 text-red-400" />
                    </>
                ) : (
                    <>
                        <LogOut className="h-4 w-4 shrink-0 text-red-500" />
                        <span className="flex-1 text-left text-red-500">Sign Out</span>
                    </>
                )}
            </button>
        </div>
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

    // Initials for avatar
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
            <SidebarContent className="bg-school-secondary-950 px-2 py-4 space-y-4">

                <NavGroup label="Command Center">
                    <NavItem href={dashboardHref} icon={LayoutDashboard} label="Dashboard" />
                    <NavItem href="/notifications"  icon={Bell}           label="System Alerts" />
                </NavGroup>

                {/* ── Admin ── */}
                {isAdmin && (
                    <>
                        <NavGroup label="Institutional Control">
                            <NavItem href="/admin/settings"           icon={School}          label="Global Settings"  />
                            <NavItem href="/admin/invite-users"       icon={UserPlus}        label="Invite Users"     />
                            <NavItem href="/admin/users"              icon={Users}           label="User Registry"    />
                            <NavItem href="/admin/users/parent-linking" icon={UserPlus}      label="Family Relations" />
                            <NavItem href="/admin/communication"      icon={MessageCircle}   label="WhatsApp Hub"     />
                            <NavItem href="/admin/classes"            icon={Layers}          label="Add Class"        />
                        </NavGroup>

                        <NavGroup label="Academic Logic">
                            <NavItem href="/admin/curriculum" icon={BookMarked}      label="Master Curriculum"  />
                            <NavItem href="/admin/subject"    icon={TableProperties} label="Subject Allocation" />
                            <NavItem href="/admin/catalogue"  icon={BookOpen}        label="Course Catalog"     />
                            <NavItem href="/admin/lessons"    icon={FileText}        label="Lesson Bank"        />
                        </NavGroup>

                        <NavGroup label="Intelligence">
                            <NavItem href="/admin/assessments"   icon={ClipboardList} label="Exam Registry"       />
                            <NavItem href="/admin/reports"       icon={BarChart2}     label="Analytical Insights" />
                            <NavItem href="/admin/subscription"  icon={CreditCard}    label="Finance & Billing"   />
                        </NavGroup>
                    </>
                )}

                {/* ── Teacher ── */}
                {isTeacher && (
                    <>
                        <NavGroup label="Academic Operations">
                            <NavItem href="/teacher/classes"    icon={Layers}          label="My Classrooms"      />
                            <NavItem href="/teacher/subjects"   icon={BookOpen}        label="Assigned Subjects"  />
                            <NavItem href="/teacher/allocation" icon={TableProperties} label="Subject Allocation" />
                            <NavItem href="/teacher/topics"     icon={Calendar}        label="Termly Schedule"    />
                        </NavGroup>

                        <NavGroup label="Content & Assessment">
                            <NavItem href="/teacher/lessons"     icon={FileText}     label="AI Lesson Plans"  />
                            <NavItem href="/teacher/assessments" icon={ClipboardList} label="Gradebook"        />
                            <NavItem href="/teacher/students"    icon={GraduationCap} label="Student Directory"/>
                            <NavItem href="/teacher/reports"     icon={BarChart2}     label="Performance Data" />
                        </NavGroup>
                    </>
                )}

                {/* ── Student ── */}
                {isStudent && (
                    <>
                        <NavGroup label="Study Portal">
                            <NavItem href="/student/subjects"          icon={BookOpen}        label="My Subjects"    />
                            <NavItem href="/student/subjects/electives" icon={TableProperties} label="Pick Electives" />
                            <NavItem href="/student/lessons"           icon={FileText}        label="Digital Lessons"/>
                        </NavGroup>
                        <NavGroup label="Evaluations">
                            <NavItem href="/student/quizzes" icon={Trophy}   label="AI Challenges"  />
                            <NavItem href="/student/grades"  icon={BarChart2} label="Academic Record" />
                        </NavGroup>
                    </>
                )}

                {/* ── Parent ── */}
                {isParent && (
                    <NavGroup label="Guardian Hub">
                        <NavItem href="/parent/children" icon={Users}        label="Child Profiles" />
                        <NavItem href="/parent/grades"   icon={BarChart2}    label="Results Portal" />
                        <NavItem href="/parent/feedback" icon={MessageSquare} label="School Comms"  />
                    </NavGroup>
                )}

            </SidebarContent>

            {/* ── Footer ── */}
            <SidebarFooter className="p-4 border-t border-school-secondary-800 bg-school-secondary-950 space-y-3">

                {/* User card */}
                <Link
                    href="/settings/profile"
                    className="flex items-center gap-3 rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 px-3 py-2.5 hover:border-school-secondary-600 hover:bg-school-secondary-800 transition-all group"
                >
                    {/* Avatar */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20 text-[11px] font-black text-school-primary">
                        {initials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      
                        <p className="text-[10px] text-school-primary truncate hover:text-school-secondary-100 transition-colors">
                            Profile Settings
                        </p>
                    </div>

                    <UserCircle className="h-4 w-4 text-school-secondary-500 group-hover:text-school-primary transition-colors shrink-0" />
                </Link>

                {/* Logout */}
                <LogoutButton />

            </SidebarFooter>

        </Sidebar>
    )
}