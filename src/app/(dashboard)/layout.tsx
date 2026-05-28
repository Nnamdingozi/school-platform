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



// import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'
// import { prisma } from '@/lib/prisma'
// import { getTeacherData } from '@/app/actions/teacherData'
// import { getParentProfile } from '@/app/actions/parentProfile'
// import { SchoolProvider } from '@/context/schoolProvider'
// import { checkSubscription } from '@/app/actions/subscription-guard'
// import { AppSidebar } from '@/components/app-sidebar'
// import { ProfileInitializer } from '@/components/profileInitializer'
// import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
// import { Role } from '@prisma/client'
// import {
//     AnyProfile,
//     ProfileInStore,
//     ParentProfileInStore,
// } from '@/types/profile'

// // ── Role constants ─────────────────────────────────────────────────────────────
// // Added INDIVIDUAL_LEARNER to support Rule 6
// const ALLOWED_ROLES: Role[] = [
//     Role.SCHOOL_ADMIN, 
//     Role.SUPER_ADMIN, 
//     Role.TEACHER, 
//     Role.STUDENT, 
//     Role.PARENT, 
//     Role.INDIVIDUAL_LEARNER
// ]

// const SIDEBAR_ROLES: Role[] = [
//     Role.SCHOOL_ADMIN, 
//     Role.SUPER_ADMIN, 
//     Role.TEACHER, 
//     Role.STUDENT, 
//     Role.INDIVIDUAL_LEARNER
// ]

// // ── Layout ─────────────────────────────────────────────────────────────────────
// export default async function DashboardLayout({
//     children,
// }: {
//     children: React.ReactNode
// }) {
//     // 1. Authenticate Session
//     const supabase = await createClient()
//     const { data: { user } } = await supabase.auth.getUser()

//     if (!user?.email) redirect('/login')

//     // 2. Fetch Base Profile (Security Rule 10)
//     // FIX: Changed findUnique to findFirst to resolve the composite key TS error
//     const profileBase = await prisma.profile.findFirst({
//         where:  { email: user.email },
//         select: { id: true, role: true, schoolId: true },
//     })

//     if (!profileBase || !ALLOWED_ROLES.includes(profileBase.role)) {
//         redirect('/login?error=unauthorized')
//     }

//     // 3. Subscription Guard (Rule 11 System Truth)
//     // Protects all dashboard routes at once.
//     const subStatus = await checkSubscription(profileBase.id, profileBase.schoolId)

//     if (!subStatus.isActive) {
//         // This line forces the user out of the dashboard
//         redirect('/billing?status=expired') 
//     }

//     // 4. Hydrate Comprehensive Profile Data
//     let profile: AnyProfile | null = null

//     if (profileBase.role === Role.PARENT) {
//         profile = await getParentProfile(user.email) as ParentProfileInStore | null
//     } else {
//         profile = await getTeacherData(user.email) as ProfileInStore | null
//     }

//     if (!profile) redirect('/login?error=profile_sync_failed')

//     // 5. Parent UI Branch (Rule 2 - No Sidebar Layer)
//     if (profileBase.role === Role.PARENT) {
//         return (
//             <SchoolProvider initialProfile={profile}>
//                 <ProfileInitializer profile={profile} />
//                 <div className="min-h-screen bg-slate-950">
//                     {children}
//                 </div>
//             </SchoolProvider>
//         )
//     }

//     // 6. Sidebar UI Branch (School & Individual Users)
//     return (
//         <SchoolProvider initialProfile={profile}>
//             <ProfileInitializer profile={profile} />
//             <SidebarProvider>
//                 <div className="flex min-h-screen w-full bg-slate-950">
//                     <AppSidebar />
//                     <SidebarInset className="overflow-y-auto overflow-x-hidden bg-slate-950 border-l border-white/5">
//                         <header className="flex h-12 items-center gap-2 px-4 border-b border-white/5 sm:hidden">
//                             <SidebarTrigger className="text-white" />
//                         </header>
//                         <main className="flex-1">
//                             {children}
//                         </main>
//                     </SidebarInset>
//                 </div>
//             </SidebarProvider>
//         </SchoolProvider>
//     )
// }



// import { redirect } from 'next/navigation'
// import { cookies } from 'next/headers'
// import { createClient } from '@/lib/supabase/server'
// import { prisma } from '@/lib/prisma'
// import { getTeacherData } from '@/app/actions/teacherData'
// import { getParentProfile } from '@/app/actions/parentProfile'
// import { SchoolProvider } from '@/context/schoolProvider'
// import { checkSubscription } from '@/app/actions/subscription-guard'
// import { AppSidebar } from '@/components/app-sidebar'
// import { ProfileInitializer } from '@/components/profileInitializer'
// import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
// import { Role } from '@prisma/client'
// import { getSchoolThemeStyle } from '@/lib/school-theme'
// import type {
//     AnyProfile,
//     ProfileInStore,
//     ParentProfileInStore,
// } from '@/types/profile'

// // ── Role constants ─────────────────────────────────────────────────────────────
// const ALLOWED_ROLES: Role[] = [
//     Role.SCHOOL_ADMIN,
//     Role.SUPER_ADMIN,
//     Role.TEACHER,
//     Role.STUDENT,
//     Role.PARENT,
//     Role.INDIVIDUAL_LEARNER,
// ]

// const SIDEBAR_ROLES: Role[] = [
//     Role.SCHOOL_ADMIN,
//     Role.SUPER_ADMIN,
//     Role.TEACHER,
//     Role.STUDENT,
//     Role.INDIVIDUAL_LEARNER,
// ]

// // ── Theme resolution ───────────────────────────────────────────────────────────
// // DB value wins over cookie. Cookie is used on first load before DB resolves.
// // Both are read server-side so the correct class is set before paint — no flash.
// function resolveTheme(
//     dbTheme: string | null | undefined,
//     cookieTheme: string | null | undefined
// ): 'dark' | 'light' {
//     if (dbTheme === 'dark' || dbTheme === 'light') return dbTheme
//     if (cookieTheme === 'dark' || cookieTheme === 'light') return cookieTheme
//     return 'light'
// }

// // ── Layout ─────────────────────────────────────────────────────────────────────
// export default async function DashboardLayout({
//     children,
// }: {
//     children: React.ReactNode
// }) {
//     // 1. Authenticate session
//     const supabase = await createClient()
//     const { data: { user } } = await supabase.auth.getUser()

//     if (!user?.email) redirect('/login')

//     // 2. Fetch base profile
//     const profileBase = await prisma.profile.findFirst({
//         where:  { email: user.email },
//         select: { id: true, role: true, schoolId: true },
//     })

//     if (!profileBase || !ALLOWED_ROLES.includes(profileBase.role)) {
//         redirect('/login?error=unauthorized')
//     }

//     // 3. Subscription guard
//     const subStatus = await checkSubscription(profileBase.id, profileBase.schoolId)
//     if (!subStatus.isActive) redirect('/billing?status=expired')

//     // 4. Hydrate full profile
//     //
//     // getParentProfile  → include: { school: true, ... }
//     // getTeacherData    → include: { school: { include: { ... } }, ... }
//     //
//     // Both return the full School row, which includes primaryColor and
//     // secondaryColor once those columns exist in the schema.
//     // Both return all Profile scalars including `theme`.
//     let profile: AnyProfile | null = null

//     if (profileBase.role === Role.PARENT) {
//         profile = await getParentProfile(user.email) as ParentProfileInStore | null
//     } else {
//         profile = await getTeacherData(user.email) as ProfileInStore | null
//     }

//     if (!profile) redirect('/login?error=profile_sync_failed')

//     // 5. Resolve theme
//     //
//     // `profile.theme` is a scalar on Profile — available after adding to schema:
//     //   model Profile { theme String @default("light") }
//     //
//     // Add `theme` to your AnyProfile / ProfileInStore / ParentProfileInStore
//     // types so TypeScript resolves it without errors.
//     const cookieStore = await cookies()
//     const cookieTheme = cookieStore.get('theme')?.value
//     const isDark = resolveTheme(profile.theme, cookieTheme) === 'dark'

//     // 6. Resolve school colors
//     //
//     // `profile.school.primaryColor` and `profile.school.secondaryColor` are
//     // scalars on School — available after adding to schema:
//     //   model School {
//     //     primaryColor   String @default("#f59e0b")
//     //     secondaryColor String @default("#1e293b")
//     //   }
//     //
//     // getSchoolThemeStyle() writes the four CSS variables onto the wrapper div.
//     // globals.css derives all scale shades from those automatically.
//     const schoolColors = profile.school?.primaryColor && profile.school?.secondaryColor
//         ? getSchoolThemeStyle({
//               primary:   profile.school.primaryColor,
//               secondary: profile.school.secondaryColor,
//           })
//         : {}

//     // 7. Shared wrapper class — drives globals.css .dark variant
//     const wrapperClass = isDark ? 'dark' : ''

//     // 8. Parent branch — no sidebar
//     if (profileBase.role === Role.PARENT) {
//         return (
//             <SchoolProvider initialProfile={profile}>
//                 <ProfileInitializer profile={profile} />
//                 <div
//                     className={`min-h-screen bg-background ${wrapperClass}`.trim()}
//                     style={schoolColors}
//                 >
//                     {children}
//                 </div>
//             </SchoolProvider>
//         )
//     }

//     // 9. Sidebar branch — school admin, teacher, student, individual learner
//     return (
//         <SchoolProvider initialProfile={profile}>
//             <ProfileInitializer profile={profile} />
//             <SidebarProvider>
//                 <div
//                     className={`flex min-h-screen w-full bg-background ${wrapperClass}`.trim()}
//                     style={schoolColors}
//                 >
//                     <AppSidebar />
//                     <SidebarInset className="overflow-y-auto overflow-x-hidden bg-background border-l border-border">
//                         <header className="flex h-12 items-center gap-2 px-4 border-b border-border sm:hidden">
//                             <SidebarTrigger className="text-foreground" />
//                         </header>
//                         <main className="flex-1">
//                             {children}
//                         </main>
//                     </SidebarInset>
//                 </div>
//             </SidebarProvider>
//         </SchoolProvider>
//     )
// }


// src/app/(dashboard)/layout.tsx
//
// Theme and school colors are handled by the root layout (app/layout.tsx).
// This layout handles auth, subscription guard, sidebar structure, and
// role-based UI branching only.

// import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'
// import { prisma } from '@/lib/prisma'
// import { getTeacherData } from '@/app/actions/teacherData'
// import { getParentProfile } from '@/app/actions/parentProfile'
// import { SchoolProvider } from '@/context/schoolProvider'
// import { checkSubscription } from '@/app/actions/subscription-guard'
// import { AppSidebar } from '@/components/app-sidebar'
// import { ProfileInitializer } from '@/components/profileInitializer'
// import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
// import { Role } from '@prisma/client'
// import type {
//     AnyProfile,
//     ProfileInStore,
//     ParentProfileInStore,
// } from '@/types/profile'

// // ── Role constants ─────────────────────────────────────────────────────────────
// const ALLOWED_ROLES: Role[] = [
//     Role.SCHOOL_ADMIN,
//     Role.SUPER_ADMIN,
//     Role.TEACHER,
//     Role.STUDENT,
//     Role.PARENT,
//     Role.INDIVIDUAL_LEARNER,
// ]

// // ── Layout ─────────────────────────────────────────────────────────────────────
// export default async function DashboardLayout({
//     children,
// }: {
//     children: React.ReactNode
// }) {
//     // 1. Authenticate session
//     const supabase = await createClient()
//     const { data: { user } } = await supabase.auth.getUser()

//     if (!user?.email) redirect('/login')

//     // 2. Fetch base profile
//     const profileBase = await prisma.profile.findFirst({
//         where:  { email: user.email },
//         select: { id: true, role: true, schoolId: true },
//     })

//     if (!profileBase || !ALLOWED_ROLES.includes(profileBase.role)) {
//         redirect('/login?error=unauthorized')
//     }

//     // 3. Subscription guard
//     const subStatus = await checkSubscription(profileBase.id, profileBase.schoolId)
//     if (!subStatus.isActive) redirect('/billing?status=expired')

//     // 4. Hydrate full profile
//     let profile: AnyProfile | null = null

//     if (profileBase.role === Role.PARENT) {
//         profile = await getParentProfile(user.email) as ParentProfileInStore | null
//     } else {
//         profile = await getTeacherData(user.email) as ProfileInStore | null
//     }

//     if (!profile) redirect('/login?error=profile_sync_failed')

//     // 5. Parent branch — no sidebar
//     if (profileBase.role === Role.PARENT) {
//         return (
//             <SchoolProvider initialProfile={profile}>
//                 <ProfileInitializer profile={profile} />
//                 <div className="min-h-screen bg-background">
//                     {children}
//                 </div>
//             </SchoolProvider>
//         )
//     }

//     // 6. Sidebar branch — school admin, teacher, student, individual learner
//     return (
//         <SchoolProvider initialProfile={profile}>
//             <ProfileInitializer profile={profile} />
//             <SidebarProvider>
//                 <div className="flex min-h-screen w-full bg-background">
//                     <AppSidebar />
//                     <SidebarInset className="overflow-y-auto overflow-x-hidden bg-background border-l border-border">
//                         <header className="flex h-12 items-center gap-2 px-4 border-b border-border sm:hidden">
//                             <SidebarTrigger className="text-foreground" />
//                         </header>
//                         <main className="flex-1">
//                             {children}
//                         </main>
//                     </SidebarInset>
//                 </div>
//             </SidebarProvider>
//         </SchoolProvider>
//     )
// }






// import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'
// import { prisma } from '@/lib/prisma'
// import { getRegistryProfile } from '@/app/actions/profileRegistry'
// import { getParentProfile } from '@/app/actions/parentProfile'
// import { SchoolProvider } from '@/context/schoolProvider'
// import { checkSubscription } from '@/app/actions/subscription-guard'
// import { AppSidebar } from '@/components/app-sidebar'
// import { ProfileInitializer } from '@/components/profileInitializer'
// import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
// import { Role } from '@prisma/client'
// import { BrandingProvider } from '@/context/brandingProvider'





// export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
//     // 1. Verify Identity (Rule 10)
//     const supabase = await createClient()
//     const { data: { user: authUser } } = await supabase.auth.getUser()
//     if (!authUser) redirect('/login')

//     // 2. Subscription Guard (Rule 11 System Truth)
//     const profileBase = await prisma.profile.findUnique({
//         where: { id: authUser.id },
//         select: { id: true, schoolId: true, role: true }
//     });

//     if (!profileBase) redirect('/login');

//     const subStatus = await checkSubscription(profileBase.id, profileBase.schoolId)
//     if (!subStatus.isActive) redirect('/billing?status=expired')

//     // 3. Hydrate Full Registry Context
//     const profile = profileBase.role === Role.PARENT
//         ? await getParentProfile(authUser.email!)
//         : await getRegistryProfile(authUser.email!);

//     if (!profile) redirect('/login?error=sync_failed');

//     return (
//         <SchoolProvider initialProfile={profile as any}>
//             <ProfileInitializer profile={profile as any} />
//             <SidebarProvider>
//                 <div className="flex min-h-screen w-full bg-surface">
//                     {profileBase.role !== Role.PARENT && <AppSidebar />}
//                     <SidebarInset className="bg-background">
//                         {/* Mobile Header (Hidden on Desktop) */}
//                         <header className="flex h-14 items-center gap-4 px-6 border-b border-border sm:hidden bg-card/50 backdrop-blur">
//                             <SidebarTrigger />
//                             <div className="h-4 w-px bg-border" />
//                             <p className="text-[10px] font-black uppercase tracking-widest italic truncate">
//                                 {profile.school?.name || "Registry"}
//                             </p>
//                         </header>

//                         <main className="flex-1 overflow-y-auto overflow-x-hidden">
//                             <BrandingProvider>
//                                 {children}
//                             </BrandingProvider>

//                         </main>
//                     </SidebarInset>
//                 </div>
//             </SidebarProvider>
//         </SchoolProvider>
//     )
// }



import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getRegistryProfile } from '@/app/actions/profileRegistry'
import { getParentProfile } from '@/app/actions/parentProfile'
import { SchoolProvider } from '@/context/schoolProvider'
import { checkSubscription } from '@/app/actions/subscription-guard'
import { AppSidebar } from '@/components/app-sidebar'
import { ProfileInitializer } from '@/components/profileInitializer'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Role } from '@prisma/client'
import { BrandingProvider } from '@/context/brandingProvider'
import { type AnyProfile } from '@/types/profile' // Rule 15: Strict store types

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * INSTITUTIONAL DASHBOARD LAYOUT
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 12: Server-First Authorization and Subscription Sentinel.
 * Rule 18: Semantic Flip (bg-surface, bg-background, border-border).
 * Rule 21: Scale Protocol for mathematical brand tints.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // 1. Resolve Auth Identity (Rule 10)
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) redirect('/login')

    // 2. Subscription Sentinel (Rule 11 System Truth)
    // We check the base profile before hydration to save cycles.
    const profileBase = await prisma.profile.findUnique({
        where: { id: authUser.id },
        select: { id: true, schoolId: true, role: true }
    });

    if (!profileBase) redirect('/login');

    // Rule 11: Locked behind institutional license
    const subStatus = await checkSubscription(profileBase.id, profileBase.schoolId)
    if (!subStatus.isActive) redirect('/billing?status=expired')

    // 3. Registry Hub Hydration (Rule 12)
    // Contextual fetch based on identity role (Parent vs Staff/Student)
    const profileData = profileBase.role === Role.PARENT
        ? await getParentProfile(authUser.email!)
        : await getRegistryProfile(authUser.email!);

    if (!profileData) redirect('/login?error=registry_sync_failure');

    // Rule 15: Cast to unified store type for cross-tier compatibility
    const hydratedProfile = profileData as unknown as AnyProfile;

    return (
        <SchoolProvider initialProfile={hydratedProfile}>
            {/* Rule 17: Hydrates Zustand store on the client side */}
            <ProfileInitializer profile={hydratedProfile} />
            
            <SidebarProvider>
                <div className="flex min-h-screen w-full bg-surface">
                    {/* Rule 5: Only show Sidebar for Institutional Staff/Students */}
                    {profileBase.role !== Role.PARENT && <AppSidebar />}
                    
                    <SidebarInset className="bg-background">
                        {/* ── MOBILE HUD HEADER (Rule 11/18/20) ── */}
                        <header className="flex h-16 items-center gap-4 px-4 md:px-6 border-b border-border md:hidden bg-surface/80 backdrop-blur-md sticky top-0 z-50">
                            <div className="flex items-center gap-2">
                                <SidebarTrigger className="h-9 w-9 rounded-lg hover:bg-school-primary-50 transition-colors" />
                                <div className="h-4 w-px bg-border" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-extrabold uppercase italic tracking-tighter text-foreground truncate">
                                    {hydratedProfile.school?.name || "Registry Core"}
                                </p>
                            </div>

                            {/* Scale Protocol Indicator */}
                            <div className="h-2 w-2 rounded-full bg-school-primary animate-pulse" />
                        </header>

                        {/* ── PRIMARY VIEWPORT ── */}
                        <main className="flex-1 overflow-y-auto overflow-x-hidden">
                            <BrandingProvider>
                                <div className="animate-in fade-in duration-700 h-full">
                                    {children}
                                </div>
                            </BrandingProvider>
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </SchoolProvider>
    )
}