// // import { ReactNode } from "react";
// // import { prisma } from "@/lib/prisma";
// // import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
// // import { AppSidebar } from "@/components/TeacherDashboard/app-sidebar";

// // export default async function TeacherLayout({ children }: { children: ReactNode }) {
// //   // 1. Fetch Teacher Identity
// //   const teacherEmail = "teacher@lagosacademy.test"; 
// //   const profile = await prisma.profile.findUnique({
// //     where: { email: teacherEmail },
// //     include: {
// //       school: true,
// //       selectedSubjects: {
// //         include: { subject: true }
// //       }
// //     },
// //   });

// //   if (!profile) return <div className="p-20 text-center">Profile not found.</div>;

// //   // 2. Prepare Sidebar Data
// //   const sidebarData = {
// //     name: profile.name || "Teacher",
// //     email: profile.email,
// //     schoolName: profile.school?.name || "EduAI Academy",
// //     primarySubject: profile.selectedSubjects[0]?.subject.name || "General"
// //   };

// //   return (
// //     <SidebarProvider>
// //       <AppSidebar teacher={sidebarData} />
// //       <SidebarInset>
// //         {/* We wrap children here so every teacher page has the same inset behavior */}
// //         {children}
// //       </SidebarInset>
// //     </SidebarProvider>
// //   );
// // }

// // // app/teacher/layout.tsx
// // 'use client'; // This layout must be a client component to use the useContext hook.

// // import { ReactNode } from "react";
// // import { prisma } from "@/lib/prisma"; // This prisma client will only be used for teacher-specific data
// // import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
// // import { AppSidebar } from "@/components/TeacherDashboard/app-sidebar";
// // import { useSchool } from "@/context/schoolProvider"; // Correct path to your SchoolProvider hook

// // // Note: In a real application, 'teacherEmail' would be derived from the authenticated user.
// // // For this example, we'll keep it as a placeholder.
// // const TEACHER_EMAIL_PLACEHOLDER = "teacher@lagosacademy.test";

// // export default async function TeacherLayout({ children }: { children: ReactNode }) {
// //   // Use the school context from the parent layout
// //   const school = useSchool(); 

// //   // 1. Fetch Teacher Identity (only teacher-specific data)
// //   const profile = await prisma.profile.findUnique({
// //     where: { email: TEACHER_EMAIL_PLACEHOLDER }, // Replace with authenticated user's email/ID
// //     include: {
// //       // REMOVED: `school: true` from include, as school data is from context
// //       selectedSubjects: {
// //         include: { subject: true }
// //       }
// //     },
// //   });

// //   if (!profile) {
// //     // You might want to redirect to a setup page or show a more specific error
// //     return <div className="p-20 text-center">Teacher Profile not found for this user.</div>;
// //   }

// //   // 2. Prepare Sidebar Data
// //   const sidebarData = {
// //     name: profile.name || "Teacher",
// //     email: profile.email,
// //     schoolName: school.name, // MODIFIED: Get school name from the context
// //     primarySubject: profile.selectedSubjects[0]?.subject.name || "General"
// //   };

// //   return (
// //     <SidebarProvider>
// //       <AppSidebar teacher={sidebarData} />
// //       <SidebarInset>
// //         {/* We wrap children here so every teacher page has the same inset behavior */}
// //         {children}
// //       </SidebarInset>
// //     </SidebarProvider>
// //   );
// // }

// // app/teacher/layout.tsx



// // 'use client';

// // import { ReactNode } from "react";
// // // REMOVED: import { prisma } from "@/lib/prisma"; // No Prisma in client components
// // import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
// // import { AppSidebar } from "@/components/TeacherDashboard/app-sidebar";
// // import { useSchool } from "@/src/context/SchoolProvider";
// // import { useProfileStore } from "@/src/store/profileStore"; // New: Import useProfileStore

// // export default function TeacherLayout({ children }: { children: ReactNode }) {
// //   const school = useSchool();
// //   const { profile, isLoading, error } = useProfileStore(); // New: Get profile from Zustand store

// //   if (isLoading) return <div className="p-20 text-center">Loading profile...</div>;
// //   if (error) return <div className="p-20 text-center text-red-500">Error: {error}</div>;
// //   if (!profile) return <div className="p-20 text-center">Profile data not available. Please log in.</div>;

// //   // Prepare Sidebar Data using profile from store
// //   const sidebarData = {
// //     name: profile.name || "Teacher",
// //     email: profile.email,
// //     schoolName: school.name, // Still from SchoolContext
// //     primarySubject: profile.selectedSubjects[0]?.subject.name || "General"
// //   };

// //   return (
// //     <SidebarProvider>
// //       <AppSidebar teacher={sidebarData} />
// //       <SidebarInset>
// //         {children}
// //       </SidebarInset>
// //     </SidebarProvider>
// //   );
// // }



// // 'use client';

// // import { ReactNode } from "react";
// // import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
// // import { AppSidebar } from "@/components/TeacherDashboard/app-sidebar";
// // import { useSchool } from "@/context/schoolProvider"; // From your context
// // import { useProfileStore } from "@/store/profileStore"; // From your Zustand store
// // // import { Prisma } from '@/generated/prisma/client'; // For role checks
// // import { SidebarProfileData } from '@/types/profile';

// // export default function TeacherLayout({ children }: { children: ReactNode }) {
// //   const school = useSchool(); // School is still from context
// //   const { profile, isLoading, error} = useProfileStore(); // Get profile and helper from Zustand

// //   if (isLoading) return <div className="p-20 text-center">Loading profile...</div>;
// //   if (error) return <div className="p-20 text-center text-red-500">Error: {error}</div>;
// //   if (!profile) return <div className="p-20 text-center">Profile data not available. Please log in.</div>;

// //   // // IMPORTANT: Role check for the layout itself
// //   // if (!isTeacher()) {
// //   //   return <div className="p-20 text-center">Access Denied: You are not a Teacher.</div>;
// //   // }

// //   // Prepare Sidebar Data using profile from store
// //   const sidebarData: SidebarProfileData = {
// //     name: profile.name || "Teacher",
// //     email: profile.email,
// //     role: profile.role,
// //     schoolName: profile.school?.name, // Accessing from profile, but school.name is also available via useSchool()
// //     primarySubject: profile.selectedSubjects[0]?.subject.name || "General" // Ensure selectedSubjects are included in profileData
// //   };

// //   return (
// //     <SidebarProvider>
// //       <AppSidebar teacher={sidebarData} />
// //       <SidebarInset>
// //         {children}
// //       </SidebarInset>
// //     </SidebarProvider>
// //   );
// // }


// // // src/app/(dashboard)/layout.tsx
// // import { ReactNode } from "react";
// // import { createServerClient } from '@supabase/ssr';
// // import { cookies } from 'next/headers';
// // import { redirect } from 'next/navigation'; // Import redirect
// // import { useProfileStore } from "@/store/profileStore";
// // import { useSchool } from "@/context/schoolProvider";

// // export default async function DashboardLayout({
// //   children,
// // }: {
// //   children: ReactNode;
// // }) {
// //   const cookieStore = cookies();
// //   const supabase = createServerClient(
// //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// //     {
// //       cookies: {
// //         get: (name: string) => cookieStore.get(name)?.value,
// //       },
// //     }
// //   );

// //   const { data: { user } } = await supabase.auth.getUser();

// //   // If no user, redirect to sign in page
// //   if (!user) {
// //     redirect('/login'); // Replace '/login' with your actual login page URL
// //   }

// //   // If there is a user, then load the sub files.

// //   return (
// //     <>
// //       {children}
// //     </>
// //   );
// // }


// // // src/app/(dashboard)/layout.tsx
// // import { ReactNode } from "react";
// // import { createServerClient } from '@supabase/ssr';
// // import { cookies, headers } from 'next/headers';
// // import { redirect } from 'next/navigation';
// // import { useSchool } from "@/context/schoolProvider";
// // import { SchoolProvider } from "@/context/schoolProvider";
// // import { useProfileStore } from "@/store/profileStore"; // Import profile store
// // import { comprehensiveProfileInclude } from '@/types/profile'; // Import profileInclude
// // import { ProfileInStore } from "@/types/profile";
// // import { getTeacherData } from "@/app/actions/teacherData";
// // import { Profile } from "@/generated/prisma/client";

// // export default async function DashboardLayout({
// //     children,
// // }: {
// //     children: ReactNode;
// // }) {
// //     const cookieStore = await cookies();
// //     const supabase = createServerClient(
// //         process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// //         {
// //             cookies: {
// //                 get: (name: string) => cookieStore.get(name)?.value,
// //                 set: (name: string, value: string, options: CookieOptions) => {
// //                     cookieStore.set({ name, value, ...options });
// //                 },
// //                 getAll: () => cookieStore.getAll().map(cookie => ({ name: cookie.name, value: cookie.value })),
// //                 remove: (name: string, options: CookieOptions) => {
// //                     cookieStore.delete({ name, ...options });
// //                 },
// //             },
// //         }
// //     );

// //     const { data: { user } } = await supabase.auth.getUser();

// //     // If no user, redirect to sign in page
// //     if (!user) {
// //         redirect('/login');
// //     }

// //     let teacher: Profile | null = null;
// //     if (user?.email) {
// //         teacher = await getTeacherData(user.email);
// //     }
// //     // Set the profile in the store (IMPORTANT)
// //     useProfileStore.getState().setProfile(teacher as ProfileInStore | null);

// //     // Corrected: Pass the teacher prop to SchoolProvider
// //     return (
// //         <SchoolProvider teacher={teacher}>
// //             {children}
// //         </SchoolProvider>
// //     );
// // }



// // // src/app/(dashboard)/layout.tsx
// // import { ReactNode } from "react";
// // import { createServerClient, type CookieOptions } from '@supabase/ssr';
// // import { cookies, headers } from 'next/headers';
// // import { redirect } from 'next/navigation';
// // import { useSchool } from "@/context/schoolProvider";
// // import { SchoolProvider } from "@/context/schoolProvider";
// // import { useProfileStore } from "@/store/profileStore"; // Import profile store
// // import { comprehensiveProfileInclude } from '@/types/profile'; // Import profileInclude
// // import { ProfileInStore } from "@/types/profile";
// // import { getTeacherData } from "@/app/actions/teacherData";
// // import { Profile } from "@/generated/prisma/client";

// // export default async function DashboardLayout({
// //     children,
// // }: {
// //     children: ReactNode;
// // }) {
// //     const cookieStore = await cookies();
// //     const supabase = createServerClient(
// //         process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// //         {
// //             cookies: {
// //                 get: (name: string) => cookieStore.get(name)?.value,
// //                 set: (name: string, value: string, options: CookieOptions) => {
// //                     cookieStore.set({ name, value, ...options });
// //                 },
// //                 remove: (name: string, options: CookieOptions) => { // Corrected
// //                     cookieStore.delete({ name, ...options });  // Corrected
// //                 },
// //             },
// //         }
// //     );


// //     // const { data: { user } } = await supabase.auth.getUser();

// //     // // If no user, redirect to sign in page
// //     // if (!user) {
// //     //     redirect('/login');
// //     // }

// //     // let teacher: Profile | null = null;
// //     // const email = "teacher@lagosacademy.test"
  
// //     // if (email) {
// //     //     teacher = await getTeacherData(email);
// //     // }
// //     // // Set the profile in the store (IMPORTANT)
// //     // useProfileStore.getState().setProfile(teacher as ProfileInStore | null);

// //     // Corrected: Pass the teacher prop to SchoolProvider
// //     return (
//         // <SchoolProvider >
//         //     {children}
//         // </SchoolProvider>
// //     );
// // }


// // export default function DashboardLayout({
// //     children,
// //   }: {
// //     children: React.ReactNode
// //   }) {
// //     return <section>{children}</section>
// //   }

// // app/(dashboard)/layout.tsx
// // import { getTeacherData } from "@/app/actions/teacherData";
// // import { SchoolProvider } from "@/context/schoolProvider";
// // import { AppSidebar } from "@/components/TeacherDashboard/app-sidebar";
// // import { ProfileInStore, SidebarProfileData } from "@/types/profile";

// // export default async function DashboardLayout({
// //     children,
// // }: {
// //     children: React.ReactNode;
// // }) {
// //     const email = "teacher@lagosacademy.test";
// //     const profile = await getTeacherData(email) as ProfileInStore | null;

// //     const sidebarData: SidebarProfileData | null = profile ? {
// //         name: profile.name ?? "Unknown",
// //         email: profile.email,
// //         role: profile.role,
// //         schoolName: profile.school?.name ?? "EduAI Academy",
// //         primarySubject: profile.selectedSubjects?.[0]?.subject?.name ?? "Not Assigned",
// //     } : null;

// //     return (
// //         <SchoolProvider initialProfile={profile}>
// //             <div className="flex min-h-screen">
// //                 {sidebarData && <AppSidebar teacher={sidebarData} />}
// //                 {/* Offset content to account for fixed sidebar width */}
// //                 <div className="flex flex-col flex-1 sm:pl-64">
// //                     {children}
// //                 </div>
// //             </div>
// //         </SchoolProvider>
// //     );
// // }


// // app/(dashboard)/layout.tsx
// // import { getTeacherData } from "@/app/actions/teacherData";
// // import { SchoolProvider } from "@/context/schoolProvider";
// // import { AppSidebar } from "@/components/TeacherDashboard/app-sidebar";
// // import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
// // import { ProfileInStore, SidebarProfileData } from "@/types/profile";

// // export default async function DashboardLayout({
// //     children,
// // }: {
// //     children: React.ReactNode;
// // }) {
// //     const email = "teacher@lagosacademy.test";
// //     const profile = await getTeacherData(email) as ProfileInStore | null;

// //     const sidebarData: SidebarProfileData | null = profile ? {
// //         name: profile.name ?? "Unknown",
// //         email: profile.email,
// //         role: profile.role,
// //         schoolName: profile.school?.name ?? "EduAI Academy",
// //         primarySubject: profile.selectedSubjects?.[0]?.subject?.name ?? "Not Assigned",
// //     } : null;

// //     return (
// //         <SchoolProvider initialProfile={profile}>
// //             <SidebarProvider>
// //                 <div className="flex min-h-screen w-full">
// //                     {sidebarData && <AppSidebar teacher={sidebarData} />}
// //                     <SidebarInset>
// //                         {/* Mobile trigger — shows hamburger to toggle sidebar */}
// //                         <header className="flex h-12 items-center gap-2 px-4 border-b sm:hidden">
// //                             <SidebarTrigger />
// //                         </header>
// //                         {children}
// //                     </SidebarInset>
// //                 </div>
// //             </SidebarProvider>
// //         </SchoolProvider>
// //     );
// // }

// // import { getTeacherData } from "@/app/actions/teacherData";
// // import { SchoolProvider } from "@/context/schoolProvider";
// // import { AppSidebar } from "@/components/TeacherDashboard/app-sidebar";
// // import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
// // import { ProfileInStore, SidebarProfileData } from "@/types/profile";

// // export default async function DashboardLayout({
// //     children,
// // }: {
// //     children: React.ReactNode;
// // }) {
// //     const email = "teacher@lagosacademy.test";
// //     const profile = await getTeacherData(email) as ProfileInStore | null;

// //     const sidebarData: SidebarProfileData | null = profile ? {
// //         name: profile.name ?? "Unknown",
// //         email: profile.email,
// //         role: profile.role,
// //         schoolName: profile.school?.name ?? "EduAI Academy",
// //         primarySubject: profile.selectedSubjects?.[0]?.subject?.name ?? "Not Assigned",
// //     } : null;

// //     return (
// //         <SchoolProvider initialProfile={profile}>
// //             <SidebarProvider>
// //                 <div className="flex min-h-screen w-full">
// //                     {sidebarData && <AppSidebar teacher={sidebarData} />}
// //                     <SidebarInset>
// //                         {/* Mobile trigger — shows hamburger to toggle sidebar */}
// //                         <header className="flex h-12 items-center gap-2 px-4 border-b sm:hidden">
// //                             <SidebarTrigger />
// //                         </header>
// //                         {children}
// //                     </SidebarInset>
// //                 </div>
// //             </SidebarProvider>
// //         </SchoolProvider>
// //     );
// // }


// // // app/(dashboard)/layout.tsx
// // import { getTeacherData } from "@/app/actions/teacherData";
// // import { SchoolProvider } from "@/context/schoolProvider";
// // import { AppSidebar } from "@/components/app-sidebar";
// // import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
// // import { ProfileInStore, SidebarProfileData } from "@/types/profile";

// // export default async function DashboardLayout({
// //     children,
// // }: {
// //     children: React.ReactNode;
// // }) {
// //     const email = "teacher@lagosacademy.test";
// //     const profile = await getTeacherData(email) as ProfileInStore | null;

// //     const sidebarData: SidebarProfileData | null = profile ? {
// //         name: profile.name ?? "Unknown",
// //         email: profile.email,
// //         role: profile.role,
// //         schoolName: profile.school?.name ?? "EduAI Academy",
// //         primarySubject: profile.selectedSubjects?.[0]?.subject?.name ?? "Not Assigned",
// //     } : null;

// //     return (
// //         // SchoolProvider receives initialProfile and internally calls setProfile
// //         // in a useEffect — this is how the store gets initialized for all
// //         // dashboard pages and their components
// //         <SchoolProvider initialProfile={profile}>
// //             <SidebarProvider>
// //                 <div className="flex min-h-screen w-full">
// //                     {sidebarData && <AppSidebar teacher={sidebarData} />}
// //                     <SidebarInset className="overflow-y-auto overflow-x-hidden">
// //     <header className="flex h-12 items-center gap-2 px-4 border-b sm:hidden">
// //         <SidebarTrigger />
// //     </header>
// //     {children}
// // </SidebarInset>
// //                 </div>
// //             </SidebarProvider>
// //         </SchoolProvider>
// //     );
// // }

// // app/(dashboard)/layout.tsx
// // import { redirect } from 'next/navigation';
// // import { cookies } from 'next/headers';
// // import { createServerClient } from '@supabase/ssr';
// // import { getTeacherData } from "@/app/actions/teacherData";
// // import { SchoolProvider } from "@/context/schoolProvider";
// // import { AppSidebar } from "@/components/app-sidebar";
// // import { ProfileInitializer } from "@/components/profileInitializer";
// // import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
// // import { ProfileInStore } from "@/types/profile";

// // export default async function DashboardLayout({
// //     children,
// // }: {
// //     children: React.ReactNode;
// // }) {
// //     const cookieStore = await cookies();

// //     // ✅ Read actual logged-in user from session cookie
// //     const supabase = createServerClient(
// //         process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// //         {
// //             cookies: {
// //                 getAll: () => cookieStore.getAll(),
// //                 setAll: () => {}, // read-only in layout
// //             },
// //         }
// //     );

// //     const { data: { user } } = await supabase.auth.getUser();

// //     // ✅ Server-side auth guard
// //     if (!user?.email) {
// //         redirect('/login');
// //     }

// //     // ✅ Fetch real profile using real email
// //     const profile = await getTeacherData(user.email) as ProfileInStore | null;

// //     // ✅ Role guard
// //     const allowedRoles = ['SCHOOL_ADMIN', 'SUPER_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'];
// //     if (!profile || !allowedRoles.includes(profile.role)) {
// //         redirect('/login');
// //     }

// //     return (
// //         <SchoolProvider initialProfile={profile}>
// //             {/*
// //                 ✅ ProfileInitializer ensures the Zustand store is hydrated
// //                 with the real server-fetched profile on every dashboard load.
// //                 Without this, the store only gets set when SchoolProvider's
// //                 useEffect fires — which can lag behind the first render.
// //             */}
// //             <ProfileInitializer profile={profile} />
// //             <SidebarProvider>
// //                 <div className="flex min-h-screen w-full">
// //                     {/* ✅ No props — AppSidebar reads from store directly */}
// //                     <AppSidebar />
// //                     <SidebarInset className="overflow-y-auto overflow-x-hidden">
// //                         <header className="flex h-12 items-center gap-2 px-4 border-b sm:hidden">
// //                             <SidebarTrigger />
// //                         </header>
// //                         {children}
// //                     </SidebarInset>
// //                 </div>
// //             </SidebarProvider>
// //         </SchoolProvider>
// //     );
// // }



// import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'
// import { prisma } from '@/lib/prisma'
// import { getTeacherData } from '@/app/actions/teacherData'
// import { getParentProfile } from '@/app/actions/parentProfile'
// import { SchoolProvider } from '@/context/schoolProvider'
// import { AppSidebar } from '@/components/app-sidebar'
// import { ProfileInitializer } from '@/components/profileInitializer'
// import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
// import { ProfileInStore } from '@/types/profile'
// import { isTeacherProfile } from '@/types/profile'


// const ALLOWED_ROLES = ['SCHOOL_ADMIN', 'SUPER_ADMIN', 'TEACHER', 'STUDENT', 'PARENT']

// // Roles that get the full admin/teacher sidebar layout
// const SIDEBAR_ROLES = ['SCHOOL_ADMIN', 'SUPER_ADMIN', 'TEACHER', 'STUDENT']
// // dashboard layout

// const profile = roleCheck.role === 'PARENT'
//     ? await getParentProfile(user.email)
//     : await getTeacherData(user.email) as ProfileInStore | null

// export default async function DashboardLayout({
//     children,
// }: {
//     children: React.ReactNode
// }) {
//     // ── Auth ───────────────────────────────────────────────────────────────
//     const supabase = await createClient()
//     const { data: { user } } = await supabase.auth.getUser()

//     if (!user?.email) redirect('/login')

//     // ── Lightweight role check first ───────────────────────────────────────
//     // Avoids fetching heavy profile data before knowing the role
//     const roleCheck = await prisma.profile.findUnique({
//         where:  { email: user.email },
//         select: { role: true },
//     })

//     if (!roleCheck || !ALLOWED_ROLES.includes(roleCheck.role)) {
//         redirect('/login')
//     }

//     // ── Fetch profile based on role ────────────────────────────────────────
//     // Parents get a lightweight profile — no subjects/classes needed
//     // Everyone else gets the full comprehensive profile
//     const profile = roleCheck.role === 'PARENT'
//         ? await getParentProfile(user.email) as ProfileInStore | null
//         : await getTeacherData(user.email)   as ProfileInStore | null

//     if (!profile) redirect('/login?error=profile_not_found')

//     // ── Parent/Student — no sidebar needed ────────────────────────────────
//     if (!SIDEBAR_ROLES.includes(roleCheck.role)) {
//         return (
//             <SchoolProvider initialProfile={profile}>
//                 <ProfileInitializer profile={profile} />
//                 {children}
//             </SchoolProvider>
//         )
//     }

//     // ── Admin/Teacher — full sidebar layout ───────────────────────────────
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