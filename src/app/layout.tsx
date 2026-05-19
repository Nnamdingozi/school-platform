

// import { Toaster } from "@/components/ui/sonner"
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
//   display: 'swap',
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
//   display: 'swap',
// });

// export const metadata: Metadata = {
//   title: "School PaaS Admin",
//   description: "Management dashboard for multi-curricular institutions",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className="antialiased">
//         {/* All content must be here! */}
//         <main>{children}</main>
        
//         {/* ✅ The Toaster MUST be inside the body tags */}
//         <Toaster richColors closeButton position="top-right" />
//       </body>
//     </html>
//   );
// }


// // app/layout.tsx (This is a Server Component by default)
// import { Inter } from "next/font/google";
// import "./globals.css"; // Your global CSS where --school-primary etc. are defined
// import { prisma } from "@/lib/prisma"; // Your Prisma client
// import { SchoolProvider } from "@/context/schoolProvider";
// import { Toaster } from "@/components/ui/sonner"

// const inter = Inter({ subsets: ["latin"] });

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   // --- SERVER-SIDE DATA FETCHING ---
//   // You'll need a way to determine the current school ID.
//   // This could come from:
//   // 1. A subdomain (e.g., `schoolname.yourapp.com`)
//   // 2. A cookie set after login
//   // 3. A query parameter
//   // For this example, let's hardcode for simplicity or derive from auth context
//   const schoolId = "dc8812b9-d0f2-488d-8870-d4f68febb9e2"; // Replace with dynamic logic

//   // Fetch school data using Prisma on the server
//   const schoolData = await prisma.school.findUnique({
//     where: { id: schoolId },
//     select: {
//       id: true,
//       name: true,
//       primaryColor: true,
//       secondaryColor: true,
//       whatsappCredits: true,
//       curriculum: { // Assuming curriculum is directly linked and selected
//         select: {
//           id: true,
//           name: true,
//           yearLabel: true,
//           termLabel: true,
//           subjectLabel: true,
//         },
//       },
//     },
//   });

//   // Handle case where school data isn't found
//   if (!schoolData) {
//     // You might want a more sophisticated error page or redirect
//     return (
//       <html lang="en">
//         <body className={inter.className}>
//           <div className="flex items-center justify-center min-h-screen">
//             School Not Found or Data Missing.
//           </div>
//         </body>
//       </html>
//     );
//   }

//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         {/* Pass the fetched schoolData to the SchoolProvider */}
//         {/* The SchoolProvider itself must be a 'use client' component */}
//         <SchoolProvider school={schoolData}>
//           {children}
//           <Toaster richColors closeButton position="top-right" />
//         </SchoolProvider>
//       </body>
//     </html>
//   );
// }


// // app/layout.tsx
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { prisma } from "@/lib/prisma"; // Your Prisma client
// import { SchoolProvider } from "@/src/context/SchoolProvider"; // Your client-side provider
// import { ProfileInitializer } from "@/src/components/ProfileInitializer"; // New: Profile Initializer
// import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { CookieOptions } from '@supabase/ssr'; // Or define your own CookieOptions

// const inter = Inter({ subsets: ["latin"] });

// // IMPORTANT: Define the exact Prisma include for profile here, consistent with ProfileInStore type
// const profileInclude = {
//   selectedSubjects: {
//     include: { subject: true }
//   }
// } satisfies Prisma.ProfileInclude;

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const cookieStore = cookies();
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get: (name: string) => cookieStore.get(name)?.value,
//         set: (name: string, value: string, options: CookieOptions) => cookieStore.set(name, value, options),
//         remove: (name: string, options: CookieOptions) => cookieStore.set(name, value, options),
//       },
//     }
//   );

//   const { data: { user } } = await supabase.auth.getUser();

//   let schoolData = null;
//   let profileData: ProfileInStore | null = null; // Use the ProfileInStore type

//   if (user) {
//     // 1. Fetch Profile data (first to get schoolId)
//     profileData = await prisma.profile.findUnique({
//       where: { id: user.id }, // Assuming profile.id is linked to user.id
//       include: profileInclude, // Use the defined include
//     });

//     if (profileData?.schoolId) {
//       // 2. Fetch School data using profile's schoolId
//       schoolData = await prisma.school.findUnique({
//         where: { id: profileData.schoolId },
//         select: {
//           id: true,
//           name: true,
//           primaryColor: true,
//           secondaryColor: true,
//           whatsappCredits: true,
//           curriculum: {
//             select: {
//               id: true,
//               name: true,
//               yearLabel: true,
//               termLabel: true,
//               subjectLabel: true,
//             },
//           },
//         },
//       });
//     }
//   }

//   // Handle cases where user/profile/schoolData isn't found
//   if (!user || !profileData || !schoolData) {
//      return (
//        <html lang="en">
//          <body className={inter.className}>
//            <div className="flex items-center justify-center min-h-screen">
//              Please log in or school data not found.
//            </div>
//          </body>
//        </html>
//      );
//   }

//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <SchoolProvider school={schoolData}>
//           {/* New: Initialize Profile Store with server-fetched profileData */}
//           <ProfileInitializer initialProfile={profileData}>
//             {children}
//           </ProfileInitializer>
//         </SchoolProvider>
//       </body>
//     </html>
//   );
// }


// // app/layout.tsx
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { prisma } from "@/lib/prisma";
// import { SchoolProvider } from "@/context/schoolProvider";
// import { ProfileInitializer } from "@/components/profileInitializer";
// import { createServerClient, type CookieOptions } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { comprehensiveProfileInclude, ProfileInStore } from '@/types/profile';
// // NEW: Import Toaster
// import { Toaster } from "@/components/ui/sonner"

// const inter = Inter({ subsets: ["latin"] });

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   // 1. Fetch Cookies, Supabase User, Profile Data and set their states.
//   const cookieStore = await cookies();
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get: (name: string) => cookieStore.get(name)?.value,
//         set: (name: string, value: string, options: CookieOptions) => {
//           cookieStore.set({ name, value, ...options });
//         },
//         remove: (name: string, value: string, options: CookieOptions) => {
//           cookieStore.set({name, value: '', ...options });
//         },
//       },
//     }
//   );

//   let schoolData = null;
//   let profileData: ProfileInStore | null = null;

//   const { data: { user } } = await supabase.auth.getUser();

//   if (user) {
//     profileData = await prisma.profile.findUnique({
//       where: { id: user.id },
//       include: comprehensiveProfileInclude,
//     });

//     if (profileData?.schoolId) {
//       schoolData = await prisma.school.findUnique({
//         where: { id: profileData.schoolId },
//         select: {
//           id: true, name: true, primaryColor: true, secondaryColor: true, whatsappCredits: true,
//           curriculum: {
//             select: { id: true, name: true, yearLabel: true, termLabel: true, subjectLabel: true },
//           },
//         },
//       });
//     }
//   }

//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         {/* All the components of the server-side:
//         -   1. Fetch Cookies, Supabase User, Profile Data and set their states.
//         -   2. The context to all the things including school and all
//         Toaster is still loaded no matter what.
//         */}
//         <Toaster />

//         {/* Render children with providers if user is logged in. 
//             Otherwise, render children directly (assuming they are public).
//         */}
//         {user && profileData ? (
//           <>
//             {schoolData ? (
//               <SchoolProvider school={schoolData}>
//                 <ProfileInitializer initialProfile={profileData}>
//                   {children}
//                 </ProfileInitializer>
//               </SchoolProvider>
//             ) : (
//               <ProfileInitializer initialProfile={profileData}>
//                 {children}
//               </ProfileInitializer>
//             )}
//           </>
//         ) : (
//           children // Render children directly if not logged in (public pages)
//         )}
//       </body>
//     </html>
//   );
// }


// // app/layout.tsx
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { prisma } from "@/lib/prisma";
// import { SchoolProvider } from "@/context/schoolProvider";
// import { ProfileInitializer } from "@/components/profileInitializer";
// import { createServerClient, type CookieOptions } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { comprehensiveProfileInclude, ProfileInStore } from '@/types/profile';
// // NEW: Import Toaster
// import { Toaster } from "@/components/ui/sonner"


// const inter = Inter({ subsets: ["latin"] });

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   // 1. Fetch Cookies, Supabase User, Profile Data and set their states.
//   const cookieStore = await cookies();
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get: (name: string) => cookieStore.get(name)?.value,
//         set: (name: string, value: string, options: CookieOptions) => {
//           cookieStore.set({ name, value, ...options });
//         },
//         remove: (name: string, value: string, options: CookieOptions) => {
//           cookieStore.set({name, value: '', ...options });
//         },
//       },
//     }
//   );

//   const { data: { user } } = await supabase.auth.getUser();
//   if (user){
//     console.log("User",user)
//   }

//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         {/* All the components of the server-side:
//         -   1. Fetch Cookies, Supabase User, Profile Data and set their states.
//         -   2. The context to all the things including school and all
//         Toaster is still loaded no matter what.
//         */}
//         <Toaster />

//         {/* This will only run for subroutes that may or may not need log in. To change. Change app/dashboard/layout*/}
//         {children}
//       </body>
//     </html>
//   );
// }


// // app/layout.tsx
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { prisma } from "@/lib/prisma";
// import { SchoolProvider } from "@/context/schoolProvider";
// import { ProfileInitializer } from "@/components/profileInitializer";
// import { createServerClient, type CookieOptions } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { comprehensiveProfileInclude, ProfileInStore } from '@/types/profile';
// // NEW: Import Toaster
// import { Toaster } from "@/components/ui/sonner"
// import { getTeacherData } from "./actions/teacherData";

// const inter = Inter({ subsets: ["latin"] });

// export default async function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     // 1. Fetch Cookies, Supabase User, Profile Data and set their states.
//     const cookieStore = await cookies();
//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 get: (name: string) => cookieStore.get(name)?.value,
//                 set: (name: string, value: string, options: CookieOptions) => {
//                     cookieStore.set({ name, value, ...options });
//                 },
//                 remove: (name: string, options: CookieOptions) => { // Corrected
//                     cookieStore.delete({ name, ...options });  // Corrected
//                 },
//             },
//         }
//     );

//     const { data: { user } } = await supabase.auth.getUser();

//     return (
//         <html lang="en">
//             <body className={inter.className}>
//                 <Toaster />
//                 {children}
//             </body>
//         </html>
//     );
// }



// // app/layout.tsx
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { prisma } from "@/lib/prisma";
// import { SchoolProvider } from "@/context/schoolProvider";
// import { ProfileInitializer } from "@/components/profileInitializer";
// import { createServerClient, type CookieOptions } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { comprehensiveProfileInclude, ProfileInStore } from '@/types/profile';
// // NEW: Import Toaster
// import { Toaster } from "@/components/ui/sonner"
// import { getTeacherData } from "./actions/teacherData";
// import { Profile } from "@/generated/prisma/client";

// const inter = Inter({ subsets: ["latin"] });

// export default async function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     const cookieStore = await cookies();
  
    // const supabase = createServerClient(
    //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    //     {
    //         cookies: {
    //             get: (name: string) => cookieStore.get(name)?.value,
    //             set: (name: string, value: string, options: CookieOptions) => {
    //                 cookieStore.set({ name, value, ...options });
    //             },
    //             remove: (name: string, options: CookieOptions) => { // Corrected
    //                 cookieStore.delete({ name, ...options });  // Corrected
    //             },
    //         },
    //     }
    // );


//     // const { data: { user } } = await supabase.auth.getUser();

//     // // If no user, redirect to sign in page
//     // if (!user) {
//     //     redirect('/login');
//     // }


//     // const { data: { user } } = await supabase.auth.getUser();
    // let teacher: Profile | null = null;
    // const email = "teacher@lagosacademy.test"
  
    // if (email) {
    //     teacher = await getTeacherData(email);
    // }
//     return (
//         <html lang="en">
//             <body className={inter.className}>
//                 <Toaster />
//                 <SchoolProvider teacher={teacher}>
//                     {children}
//                 </SchoolProvider>
//             </body>
//         </html>
//     );
// }


// // app/layout.tsx
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { prisma } from "@/lib/prisma";
// import { SchoolProvider } from "@/context/schoolProvider";
// import { ProfileInitializer } from "@/components/profileInitializer";
// import { createServerClient, type CookieOptions } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { comprehensiveProfileInclude, ProfileInStore } from '@/types/profile';
// import { Toaster } from "@/components/ui/sonner"
// import { getTeacherData } from "./actions/teacherData";
// import { Profile } from "@/generated/prisma/client";
// import { usePathname } from 'next/navigation'; // Import usePathname

// const inter = Inter({ subsets: ["latin"] });

// export default async function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
    // const cookieStore = await cookies();
    // const supabase = createServerClient(
    //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    //     {
    //         cookies: {
    //             get: (name: string) => cookieStore.get(name)?.value,
    //             set: (name: string, value: string, options: CookieOptions) => {
    //                 cookieStore.set({ name, value, ...options });
    //             },
    //             remove: (name: string, options: CookieOptions) => { // Corrected
    //                 cookieStore.delete({ name, ...options });  // Corrected
    //             },
    //         },
    //     }
    // );


//     // const { data: { user } } = await supabase.auth.getUser();
//     const pathname = usePathname(); // Get the current route

//     let teacher: Profile | null = null;
//     const email = "teacher@lagosacademy.test"
  
//     if (email) {
//         teacher = await getTeacherData(email);
//     }
//     // Determine if we're in the dashboard
//     const isInDashboard = pathname.startsWith('/(dashboard)'); // Modify this as needed

//     return (
//         <html lang="en">
//             <body className={inter.className}>
//                 <Toaster />
//                 {isInDashboard ? (
//                     <SchoolProvider teacher={teacher}>
//                         {children}
//                     </SchoolProvider>
//                 ) : (
//                     children // Render children directly for non-dashboard routes
//                 )}
//             </body>
//         </html>
//     );
// }


// app/layout.tsx

// "use client"
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { prisma } from "@/lib/prisma";
// import { SchoolProvider } from "@/context/schoolProvider";
// import { ProfileInitializer } from "@/components/profileInitializer";
// import { createServerClient, type CookieOptions } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { comprehensiveProfileInclude, ProfileInStore } from '@/types/profile';
// import { Toaster } from "@/components/ui/sonner"
// import { getTeacherData } from "./actions/teacherData";
// import { Profile } from "@/generated/prisma/client";
// import { usePathname } from 'next/navigation'; // Import usePathname
// import { useProfileStore } from "@/store/profileStore";

// const inter = Inter({ subsets: ["latin"] });
// const pathname = usePathname(); // Get the current route

// export default async function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     const cookieStore = await cookies();
   
    // const supabase = createServerClient(
    //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    //     {
    //         cookies: {
    //             get: (name: string) => cookieStore.get(name)?.value,
    //             set: (name: string, value: string, options: CookieOptions) => {
    //                 cookieStore.set({ name, value, ...options });
    //             },
    //             remove: (name: string, options: CookieOptions) => { // Corrected
    //                 cookieStore.delete({ name, ...options });  // Corrected
    //             },
    //         },
    //     }
    // );

// // use when auth is in place
//     // let profile: ProfileInStore | null = null;
//     // if (email) {
//     //     const teacher = await getTeacherData(email);
//     //     profile = teacher as ProfileInStore | null;
//     //     useProfileStore.getState().setProfile(profile); // Set in store
//     // }


//     // const { data: { user } } = await supabase.auth.getUser();
//     let email = "teacher@lagosacademy.test"
 

//     // Fetch the profile and set it to the store
//     let profile: ProfileInStore | null = null;
//     if (email) {
//         const teacher = await getTeacherData(email);
//         profile = teacher as ProfileInStore | null;
//         useProfileStore.getState().setProfile(profile); // Set in store
//     }
//     // Determine if we're in the dashboard
//     const isInDashboard = pathname.startsWith('/(dashboard)'); // Modify this as needed

//     return (
//         <html lang="en">
//             <body className={inter.className}>
//                 <Toaster />
//                 {isInDashboard ? (
//                     <SchoolProvider>
//                         {children}
//                     </SchoolProvider>
//                 ) : (
//                     children // Render children directly for non-dashboard routes
//                 )}
//             </body>
//         </html>
//     );
// }



// // app/layout.tsx
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { prisma } from "@/lib/prisma";
// import { SchoolProvider } from "@/context/schoolProvider";
// import { ProfileInitializer } from "@/components/profileInitializer";
// import { cookies } from 'next/headers';
// import { comprehensiveProfileInclude, ProfileInStore } from '@/types/profile';
// import { Toaster } from "@/components/ui/sonner"
// import { getTeacherData } from "./actions/teacherData";
// import { Profile } from "@/generated/prisma/client";
// import { useProfileStore } from "@/store/profileStore"; // Import useProfileStore
// import { DashboardChecker } from '@/app/(dashboard)/dashBoardChecker';
// import { Footer } from "@/components/landing/footer";
// import { Navbar } from "@/components/landing/navbar";
// import { ScrollToTop } from '@/components/scroll-to-top';

// const inter = Inter({ subsets: ["latin"] });

// export default async function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     const cookieStore = await cookies();

   

//     const { data: { user } } = await supabase.auth.getUser();
//     // let email = "teacher@lagosacademy.test"

//     // Fetch the profile and set it to the store
//     let profile: ProfileInStore | null = null;
//     if (user?.email) {
//         const teacher = await getTeacherData(user.email);
//         console.log('teacher in layout for store update:', teacher)
//         profile = teacher as ProfileInStore | null;
//         useProfileStore.getState().setProfile(profile); // Set in store
//     }

//     return (
//         <html lang="en">
//             <body className={inter.className}>
//             <ScrollToTop />
//                 <Toaster />
//                 <Navbar />
//                 {/* <DashboardChecker>{children}</DashboardChecker> */}
//                 <SchoolProvider initialProfile={profile}>
//     {children}
// </SchoolProvider>
// <Footer />
//             </body>
//         </html>
//     );
// }



// // app/layout.tsx
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { prisma } from "@/lib/prisma";
// import { SchoolProvider } from "@/context/schoolProvider";
// import { ProfileInitializer } from "@/components/profileInitializer";
// import { cookies } from 'next/headers';
// import { comprehensiveProfileInclude, ProfileInStore } from '@/types/profile';
// import { Toaster } from "@/components/ui/sonner"
// import { getTeacherData } from "./actions/teacherData";
// import { Profile } from "@/generated/prisma/client";
// import { useProfileStore } from "@/store/profileStore"; // Import useProfileStore
// import { DashboardChecker } from '@/app/(dashboard)/dashBoardChecker';
// import { Footer } from "@/components/landing/footer";
// import { Navbar } from "@/components/landing/navbar";
// import { ScrollToTop } from '@/components/scroll-to-top';

// const inter = Inter({ subsets: ["latin"] });

// export default async function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     const cookieStore = await cookies();

   

//     const { data: { user } } = await supabase.auth.getUser();
//     // let email = "teacher@lagosacademy.test"

//     // Fetch the profile and set it to the store
//     let profile: ProfileInStore | null = null;
//     if (user?.email) {
//         const teacher = await getTeacherData(user.email);
//         console.log('teacher in layout for store update:', teacher)
//         profile = teacher as ProfileInStore | null;
//         useProfileStore.getState().setProfile(profile); // Set in store
//     }

//     return (
//         <html lang="en">
//             <body className={inter.className}>
//             <ScrollToTop />
//                 <Toaster />
//                 <Navbar />
//                 {/* <DashboardChecker>{children}</DashboardChecker> */}
//                 <SchoolProvider initialProfile={profile}>
//     {children}
// </SchoolProvider>
// <Footer />
//             </body>
//         </html>
//     );
// }



// import { Inter } from "next/font/google";
// import "./globals.css";
// import { SchoolProvider } from "@/context/schoolProvider";
// import { ProfileInitializer } from "@/components/profileInitializer";
// import { Toaster } from "@/components/ui/sonner";
// import { ScrollToTop } from '@/components/scroll-to-top';
// import { getTeacherData } from "./actions/teacherData";
// import { ProfileInStore } from '@/types/profile';
// import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';

// const inter = Inter({ subsets: ["latin"] });

// export default async function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     const cookieStore = await cookies();

//     // ✅ Supabase client — reads session from cookies
//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 getAll: () => cookieStore.getAll(),
//                 setAll: () => {}, // no-op — middleware handles writing
//             },
//         }
//     );

//     const { data: { user } } = await supabase.auth.getUser();

//     let profile: ProfileInStore | null = null;
//     if (user?.email) {
//         const teacher = await getTeacherData(user.email);
//         profile = teacher as ProfileInStore | null;
//     }

//     return (
//         <html lang="en">
//             <body className={inter.className}>
//                 <ScrollToTop />
//                 <Toaster />
//                 {/*
//                     ✅ No Navbar/Footer here — they belong in specific layouts:
//                     - app/(landing)/layout.tsx  → Navbar + Footer on public pages
//                     - app/(dashboard)/layout.tsx → Sidebar + Header
//                     - app/onboarding/            → no nav
//                     Adding them here puts them on EVERY page
//                 */}
//                 <SchoolProvider initialProfile={profile}>
//                     <ProfileInitializer profile={profile} />
//                     {children}
//                 </SchoolProvider>
//             </body>
//         </html>
//     );
// }



// src/app/layout.tsx

// import { Inter } from "next/font/google";
// import "./globals.css";
// import { SchoolProvider } from "@/context/schoolProvider";
// import { ProfileInitializer } from "@/components/profileInitializer";
// import { Toaster } from "@/components/ui/sonner";
// import { ScrollToTop } from '@/components/scroll-to-top';
// import { getTeacherData } from "./actions/teacherData";
// import { getParentProfile } from "./actions/parentProfile";
// import { ProfileInStore, ParentProfileInStore } from '@/types/profile';
// import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { getSchoolThemeStyle } from '@/lib/school-theme';
// import { Role } from "@prisma/client";

// const inter = Inter({ subsets: ["latin"] });

// // ── Theme resolution ───────────────────────────────────────────────────────────
// // DB value wins over cookie. Cookie covers first load before DB resolves
// // and logged-out visitors on the landing layout.
// function resolveTheme(
//     dbTheme: string | null | undefined,
//     cookieTheme: string | null | undefined
// ): 'dark' | 'light' {
//     if (dbTheme === 'dark' || dbTheme === 'light') return dbTheme
//     if (cookieTheme === 'dark' || cookieTheme === 'light') return cookieTheme
//     return 'light'
// }

// export default async function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     const cookieStore = await cookies();

//     // 1. Supabase client — reads session from cookies
//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 getAll: () => cookieStore.getAll(),
//                 setAll: () => {}, // no-op — middleware handles writing
//             },
//         }
//     );

//     const { data: { user } } = await supabase.auth.getUser();

//     // 2. Fetch profile if authenticated
//     //
//     // We need to know the role to call the right action, so we do a lightweight
//     // role check first — same pattern as the dashboard layout's profileBase query.
//     // If no user, both profile and role stay null and we skip all of this.
//     let profile: ProfileInStore | ParentProfileInStore | null = null;

//     if (user?.email) {
//         // Lightweight role check — avoids fetching the wrong profile shape
//         const { prisma } = await import('@/lib/prisma');
//         const base = await prisma.profile.findFirst({
//             where:  { email: user.email },
//             select: { role: true },
//         });

//         if (base?.role === Role.PARENT) {
//             profile = await getParentProfile(user.email) as ParentProfileInStore | null;
//         } else if (base?.role) {
//             profile = await getTeacherData(user.email) as ProfileInStore | null;
//         }
//     }

//     // 3. Resolve theme
//     //
//     // Cookie is read for logged-out visitors (landing pages).
//     // For logged-in users, profile.theme (DB) takes priority.
//     const cookieTheme = cookieStore.get('theme')?.value
//     const isDark = resolveTheme(profile?.theme, cookieTheme) === 'dark'

//     // 4. Resolve school colors
//     //
//     // Only applies when a school profile is loaded. Landing pages and
//     // unauthenticated routes fall back to the defaults in globals.css (:root).
//     const schoolColors = profile?.school?.primaryColor && profile?.school?.secondaryColor
//         ? getSchoolThemeStyle({
//               primary:   profile.school.primaryColor,
//               secondary: profile.school.secondaryColor,
//           })
//         : {}

//     return (
//         // The dark class and school CSS variables live here on <html> —
//         // the single source of truth for both. Child layouts (landing,
//         // dashboard) no longer need to apply these themselves.
//         <html
//             lang="en"
//             className={isDark ? 'dark' : ''}
//             style={schoolColors}
//         >
//             <body className={`${inter.className} bg-background text-foreground`}>
//                 <ScrollToTop />
//                 <Toaster />
//                 <SchoolProvider initialProfile={profile}>
//                     <ProfileInitializer profile={profile} />
//                     {children}
//                 </SchoolProvider>
//             </body>
//         </html>
//     );
// }



// import { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getSchoolThemeStyle } from "@/lib/school-theme";
// import { cookies } from "next/headers";
// import { Role } from "@prisma/client";
// import { Toaster } from "@/components/ui/sonner";
// import { ScrollToTop } from "@/components/scroll-to-top";
// import { SchoolProvider } from "@/context/schoolProvider";
// import { ProfileInitializer } from "@/components/profileInitializer";
// import { getRegistryProfile } from "./actions/profileRegistry";
// import { getParentProfile } from "./actions/parentProfile";
// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "SchoolPaaS | AI Academic Registry",
//   description: "Institutional infrastructure for the next generation of learning.",
// };

// /**
//  * THEME RESOLUTION LOGIC
//  * Rule 11: DB preference takes priority over session cookies.
//  */
// function resolveTheme(
//     dbTheme: string | null | undefined,
//     cookieTheme: string | null | undefined
// ): 'dark' | 'light' {
//     if (dbTheme === 'dark' || dbTheme === 'light') return dbTheme as 'dark' | 'light';
//     if (cookieTheme === 'dark' || cookieTheme === 'light') return cookieTheme as 'dark' | 'light';
//     return 'dark'; // Default platform standard
// }

// /**
//  * ROOT LAYOUT (Global Core)
//  * Rule 12: Server-side data resolution to prevent "White Flash" and layout shifts.
//  * Rule 18: Dynamic Design Token injection via inline styles.
//  */
// export default async function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//     const cookieStore = await cookies();
//     const supabase = await createClient();
    
//     // 1. Resolve Identity (Rule 10)
//     const { data: { user } } = await supabase.auth.getUser();

//     let profile = null;
//     if (user?.email) {
//         // Lightweight check to determine hydration path
//         const base = await prisma.profile.findFirst({
//             where: { id: user.id },
//             select: { role: true, theme: true, primaryColor: true, secondaryColor: true }
//         });

//         if (base) {
//             // Hydrate full profile based on tier
//             profile = base.role === Role.PARENT 
//                 ? await getParentProfile(user.email) 
//                 : await getRegistryProfile(user.email);
//         }
//     }

//     // 2. Resolve Theme Node (Rule 18)
//     const cookieTheme = cookieStore.get('theme')?.value;
//     // @ts-ignore - 'theme' added to Profile model per previous refactor
//     const isDark = resolveTheme(profile?.theme, cookieTheme) === 'dark';

//     // 3. Resolve Institutional Branding (Tier 2/3)
//     // ✅ FIX: Accessing colors from profile directly, as they do not exist on the School model.
//     const schoolColors = profile?.primaryColor && profile?.secondaryColor
//         ? getSchoolThemeStyle({
//               primary:   profile.primaryColor,
//               secondary: profile.secondaryColor,
//           })
//         : {};

//     return (
//         <html
//             lang="en"
//             className={isDark ? 'dark' : ''}
//             style={schoolColors}
//             suppressHydrationWarning // Prevents browser console mismatch errors for theme classes
//         >
//             <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-school-primary/30`}>
//                 <ScrollToTop />
//                 <Toaster />
                
//                 {/* Rule 17: Sync Registry Identity to Client Store */}
//                 <SchoolProvider initialProfile={profile as any}>
//                     <ProfileInitializer profile={profile as any} />
//                     {children}
//                 </SchoolProvider>
//             </body>
//         </html>
//     );
// }


import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getSchoolThemeStyle } from "@/lib/school-theme";
import { cookies } from "next/headers";
import { SchoolProvider } from "@/context/schoolProvider";
import { ProfileInitializer } from "@/components/profileInitializer";
import { BrandingProvider } from "@/context/brandingProvider"; // ✅ Import here
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Resolve Global Identity (Server-Side)
    let profile = null;
    if (user) {
        profile = await prisma.profile.findUnique({
            where: { id: user.id },
            select: { 
                id: true, theme: true, primaryColor: true, 
                secondaryColor: true, schoolId: true, role: true, 
                name: true, email: true 
            }
        });
    }

    // 2. Resolve Theme & Branding
    const cookieTheme = cookieStore.get('theme')?.value || 'dark';
    // @ts-ignore
    const resolvedTheme = profile?.theme || cookieTheme;
    const brandingStyles = getSchoolThemeStyle(profile?.primaryColor || null, profile?.secondaryColor || null);

    return (
        <html 
            lang="en" 
            className={resolvedTheme} 
            style={brandingStyles} 
            suppressHydrationWarning
        >
            <body className={`${inter.className} bg-background text-foreground antialiased`}>
                <SchoolProvider initialProfile={profile as any}>
                    {/* Rule 17: Initialize Store */}
                    <ProfileInitializer profile={profile as any} />
                    
                    {/* Rule 18: Inject Dynamic Tokens based on Store */}
                    <BrandingProvider>
                        <Toaster />
                        {children}
                    </BrandingProvider>
                </SchoolProvider>
            </body>
        </html>
    );
}