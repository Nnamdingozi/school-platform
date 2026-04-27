// import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'
// import { prisma } from '@/lib/prisma'
// import { getTeacherData } from '@/app/actions/teacherData'
// import { getParentProfile } from '@/app/actions/parentProfile'
// import { SchoolProvider } from '@/context/schoolProvider'
// import { AppSidebar } from '@/components/app-sidebar'
// import { ProfileInitializer } from '@/components/profileInitializer'
// import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
// import {
//     AnyProfile,
//     ProfileInStore,
//     ParentProfileInStore,
// } from '@/types/profile'

// // ── Role constants ─────────────────────────────────────────────────────────────
// const ALLOWED_ROLES  = ['SCHOOL_ADMIN', 'SUPER_ADMIN', 'TEACHER', 'STUDENT', 'PARENT']
// const SIDEBAR_ROLES  = ['SCHOOL_ADMIN', 'SUPER_ADMIN', 'TEACHER', 'STUDENT']

// // ── Layout ─────────────────────────────────────────────────────────────────────
// export default async function DashboardLayout({
//     children,
// }: {
//     children: React.ReactNode
// }) {
//     // ── Auth ───────────────────────────────────────────────────────────────
//     const supabase = await createClient()
//     const { data: { user } } = await supabase.auth.getUser()

//     if (!user?.email) redirect('/login')

//     // ── Lightweight role check ─────────────────────────────────────────────
//     // Only fetch role first to decide which profile fetcher to use
//     const roleCheck = await prisma.profile.findUnique({
//         where:  { email: user.email },
//         select: { role: true },
//     })

//     if (!roleCheck || !ALLOWED_ROLES.includes(roleCheck.role)) {
//         redirect('/login')
//     }

//     // ── Fetch correct profile shape based on role ──────────────────────────
//     // Parents get ParentProfileInStore — lightweight, no subjects/classes
//     // Everyone else gets ProfileInStore — full comprehensive profile
//     let profile: AnyProfile | null = null

//     if (roleCheck.role === 'PARENT') {
//         profile = await getParentProfile(user.email) as ParentProfileInStore | null
//     } else {
//         profile = await getTeacherData(user.email) as ProfileInStore | null
//     }

//     if (!profile) redirect('/login?error=profile_not_found')

//     // ── Parent — no sidebar, no admin chrome ──────────────────────────────
//     // Parents have their own full-screen dashboard layout
//     if (!SIDEBAR_ROLES.includes(roleCheck.role)) {
//         return (
//             <SchoolProvider initialProfile={profile}>
//                 <ProfileInitializer profile={profile} />
//                 {children}
//             </SchoolProvider>
//         )
//     }

//     // ── Admin / Teacher / Student — full sidebar layout ────────────────────
//     return (
//         <SchoolProvider initialProfile={profile}>
//             <ProfileInitializer profile={profile} />
//             <SidebarProvider>
//                 <div className="flex min-h-screen w-full">
//                     <AppSidebar />
//                     <SidebarInset className="overflow-y-auto overflow-x-hidden">
//                         <header className="flex h-12 items-center gap-2 px-4 border-b sm:hidden">
//                             <SidebarTrigger />
//                         </header>
//                         {children}
//                     </SidebarInset>
//                 </div>
//             </SidebarProvider>
//         </SchoolProvider>
//     )
// }



import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getTeacherData } from '@/app/actions/teacherData'
import { getParentProfile } from '@/app/actions/parentProfile'
import { SchoolProvider } from '@/context/schoolProvider'
import { checkSubscription } from '@/app/actions/subscription-guard'
import { AppSidebar } from '@/components/app-sidebar'
import { ProfileInitializer } from '@/components/profileInitializer'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Role } from '@prisma/client'
import {
    AnyProfile,
    ProfileInStore,
    ParentProfileInStore,
} from '@/types/profile'

// ── Role constants ─────────────────────────────────────────────────────────────
// Added INDIVIDUAL_LEARNER to support Rule 6
const ALLOWED_ROLES: Role[] = [
    Role.SCHOOL_ADMIN, 
    Role.SUPER_ADMIN, 
    Role.TEACHER, 
    Role.STUDENT, 
    Role.PARENT, 
    Role.INDIVIDUAL_LEARNER
]

const SIDEBAR_ROLES: Role[] = [
    Role.SCHOOL_ADMIN, 
    Role.SUPER_ADMIN, 
    Role.TEACHER, 
    Role.STUDENT, 
    Role.INDIVIDUAL_LEARNER
]

// ── Layout ─────────────────────────────────────────────────────────────────────
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // 1. Authenticate Session
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) redirect('/login')

    // 2. Fetch Base Profile (Security Rule 10)
    // FIX: Changed findUnique to findFirst to resolve the composite key TS error
    const profileBase = await prisma.profile.findFirst({
        where:  { email: user.email },
        select: { id: true, role: true, schoolId: true },
    })

    if (!profileBase || !ALLOWED_ROLES.includes(profileBase.role)) {
        redirect('/login?error=unauthorized')
    }

    // 3. Subscription Guard (Rule 11 System Truth)
    // Protects all dashboard routes at once.
    const subStatus = await checkSubscription(profileBase.id, profileBase.schoolId)

    if (!subStatus.isActive) {
        // This line forces the user out of the dashboard
        redirect('/billing?status=expired') 
    }

    // 4. Hydrate Comprehensive Profile Data
    let profile: AnyProfile | null = null

    if (profileBase.role === Role.PARENT) {
        profile = await getParentProfile(user.email) as ParentProfileInStore | null
    } else {
        profile = await getTeacherData(user.email) as ProfileInStore | null
    }

    if (!profile) redirect('/login?error=profile_sync_failed')

    // 5. Parent UI Branch (Rule 2 - No Sidebar Layer)
    if (profileBase.role === Role.PARENT) {
        return (
            <SchoolProvider initialProfile={profile}>
                <ProfileInitializer profile={profile} />
                <div className="min-h-screen bg-slate-950">
                    {children}
                </div>
            </SchoolProvider>
        )
    }

    // 6. Sidebar UI Branch (School & Individual Users)
    return (
        <SchoolProvider initialProfile={profile}>
            <ProfileInitializer profile={profile} />
            <SidebarProvider>
                <div className="flex min-h-screen w-full bg-slate-950">
                    <AppSidebar />
                    <SidebarInset className="overflow-y-auto overflow-x-hidden bg-slate-950 border-l border-white/5">
                        <header className="flex h-12 items-center gap-2 px-4 border-b border-white/5 sm:hidden">
                            <SidebarTrigger className="text-white" />
                        </header>
                        <main className="flex-1">
                            {children}
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </SchoolProvider>
    )
}