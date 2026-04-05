import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getTeacherData } from '@/app/actions/teacherData'
import { getParentProfile } from '@/app/actions/parentProfile'
import { SchoolProvider } from '@/context/schoolProvider'
import { AppSidebar } from '@/components/app-sidebar'
import { ProfileInitializer } from '@/components/profileInitializer'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import {
    AnyProfile,
    ProfileInStore,
    ParentProfileInStore,
} from '@/types/profile'

// ── Role constants ─────────────────────────────────────────────────────────────
const ALLOWED_ROLES  = ['SCHOOL_ADMIN', 'SUPER_ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'INDIVIDUAL_LEARNER']
// Sidebar is rendered for these dashboard roles (including PARENT).
const SIDEBAR_ROLES  = ['SCHOOL_ADMIN', 'SUPER_ADMIN', 'TEACHER', 'STUDENT', 'PARENT']

// ── Layout ─────────────────────────────────────────────────────────────────────
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // ── Auth ───────────────────────────────────────────────────────────────
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) redirect('/login')

    // ── Lightweight role check ─────────────────────────────────────────────
    // Only fetch role first to decide which profile fetcher to use
    const roleCheck = await prisma.profile.findUnique({
        where:  { email: user.email },
        select: { role: true },
    })

    if (!roleCheck || !ALLOWED_ROLES.includes(roleCheck.role)) {
        redirect('/login')
    }

    // ── Fetch correct profile shape based on role ──────────────────────────
    // Parents get ParentProfileInStore — lightweight, no subjects/classes
    // Everyone else gets ProfileInStore — full comprehensive profile
    let profile: AnyProfile | null = null

    if (roleCheck.role === 'PARENT') {
        profile = await getParentProfile(user.email) as ParentProfileInStore | null
    } else {
        profile = await getTeacherData(user.email) as ProfileInStore | null
    }

    if (!profile) redirect('/login?error=profile_not_found')

    // ── Roles without sidebar (full-screen) ───────────────────────────────
    if (!SIDEBAR_ROLES.includes(roleCheck.role)) {
        return (
            <SchoolProvider initialProfile={profile}>
                <ProfileInitializer profile={profile} />
                {children}
            </SchoolProvider>
        )
    }

    // ── Admin / Teacher / Student — full sidebar layout ────────────────────
    return (
        <SchoolProvider initialProfile={profile}>
            <ProfileInitializer profile={profile} />
            <SidebarProvider>
                <div className="flex min-h-screen w-full">
                    <AppSidebar />
                    <SidebarInset className="overflow-y-auto overflow-x-hidden">
                        <header className="flex h-12 items-center gap-2 px-4 border-b sm:hidden">
                            <SidebarTrigger />
                        </header>
                        {children}
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </SchoolProvider>
    )
}