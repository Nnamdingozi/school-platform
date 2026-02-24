// "use client"

// import {
//   Calendar,
//   School,
//   Sparkles,
//   BookOpen,
//   MessageCircle,
//   GraduationCap,
// } from "lucide-react"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarFooter,
// } from "@/components/ui/sidebar"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// const menuItems = [
//   {
//     title: "My Schedule",
//     icon: Calendar,
//     isActive: false,
//   },
//   {
//     title: "Classrooms",
//     icon: School,
//     isActive: false,
//   },
//   {
//     title: "AI Lesson Planner",
//     icon: Sparkles,
//     isActive: true,
//   },
//   {
//     title: "Gradebook",
//     icon: BookOpen,
//     isActive: false,
//   },
//   {
//     title: "Parent Communication",
//     icon: MessageCircle,
//     isActive: false,
//   },
// ]

// export function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarHeader className="p-4">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
//             <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
//           </div>
//           <div className="flex flex-col">
//             <span className="text-sm font-semibold text-sidebar-foreground">EduAI</span>
//             <span className="text-xs text-sidebar-foreground/60">Teacher Portal</span>
//           </div>
//         </div>
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel className="text-sidebar-foreground/50">Menu</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {menuItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton
//                     isActive={item.isActive}
//                     tooltip={item.title}
//                     className="gap-3"
//                   >
//                     <item.icon className="h-4 w-4" />
//                     <span>{item.title}</span>
//                     {item.title === "Parent Communication" && (
//                       <span className="ml-auto text-[10px] font-medium text-sidebar-foreground/60">
//                         WhatsApp
//                       </span>
//                     )}
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarFooter className="p-4">
//         <div className="flex items-center gap-3">
//           <Avatar className="h-9 w-9">
//             <AvatarImage src="/placeholder-avatar.jpg" alt="Teacher Sarah" />
//             <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
//               TS
//             </AvatarFallback>
//           </Avatar>
//           <div className="flex flex-col">
//             <span className="text-sm font-medium text-sidebar-foreground">Teacher Sarah</span>
//             <span className="text-xs text-sidebar-foreground/60">Mathematics Dept.</span>
//           </div>
//         </div>
//       </SidebarFooter>
//     </Sidebar>
//   )
// }



// "use client"

// import Link from "next/link"
// import { useSchool } from "@/context/schoolProvider";
// import { usePathname } from "next/navigation"
// import {
//   Calendar,
//   School,
//   Sparkles,
//   BookOpen,
//   MessageCircle,
//   GraduationCap,
// } from "lucide-react"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarFooter,
// } from "@/components/ui/sidebar"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// // 1. Define the props interface
// interface AppSidebarProps {
//   teacher: {
//     name: string | null
//     email: string
//     primarySubject: string
//   }
// }

// const school = useSchool();

// export function AppSidebar({ teacher }: AppSidebarProps) {
//   const pathname = usePathname()

//   // 2. Define menu items with real routes
//   const menuItems = [
//     { title: "My Schedule", icon: Calendar, url: "/dashboard/teacher/schedule" },
//     { title: "Classrooms", icon: School, url: "/dashboard/teacher/classes" },
//     { title: "AI Lesson Planner", icon: Sparkles, url: "/dashboard/teacher/planner" },
//     { title: "Gradebook", icon: BookOpen, url: "/dashboard/teacher/grades" },
//     { title: "Communication", icon: MessageCircle, url: "/dashboard/teacher/communication" },
//   ]

//   // Initials for Avatar Fallback
//   const initials = teacher.name 
//     ? teacher.name.split(" ").map(n => n[0]).join("").toUpperCase() 
//     : "T"

//   return (
//     <Sidebar>
//       <SidebarHeader className="p-4">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white shadow-lg shadow-amber-500/20">
//             <GraduationCap className="h-6 w-6" />
//           </div>
//           <div className="flex flex-col">
//             <span className="text-sm font-bold text-foreground">School Platform </span>
//             <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">
//               {school.name}
//             </span>
//           </div>
//         </div>
//       </SidebarHeader>

//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Teacher Portal</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {menuItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton
//                     asChild
//                     isActive={pathname.startsWith(item.url)}
//                     tooltip={item.title}
//                   >
//                     <Link href={item.url} className="flex items-center gap-3">
//                       <item.icon className="h-4 w-4" />
//                       <span className="font-medium">{item.title}</span>
//                       {item.title === "Communication" && (
//                         <span className="ml-auto text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
//                           WHATSAPP
//                         </span>
//                       )}
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>

//       <SidebarFooter className="p-4 border-t border-sidebar-border/50">
//         <div className="flex items-center gap-3">
//           <Avatar className="h-9 w-9 border border-amber-200">
//             <AvatarImage src="" alt={teacher.name ?? ""} />
//             <AvatarFallback className="bg-amber-500 text-white font-bold">
//               {initials}
//             </AvatarFallback>
//           </Avatar>
//           <div className="flex flex-col overflow-hidden">
//             <span className="text-sm font-bold truncate text-foreground">
//               {teacher.name || "Teacher"}
//             </span>
//             <span className="text-[10px] text-muted-foreground truncate">
//               {teacher.primarySubject} Dept.
//             </span>
//           </div>
//         </div>
//       </SidebarFooter>
//     </Sidebar>
//   )
// }

// src/components/TeacherDashboard/app-sidebar.tsx


// 'use client';

// import { useSchool } from "@/context/schoolProvider";
// import Link from "next/link"; // Assuming you might have navigation links in your sidebar
// import { Button } from "@/components/ui/button"; // Assuming a button might be here

// interface AppSidebarProps {
//   teacher: {
//     name: string;
//     email: string;
//     primarySubject: string;
//   };
// }

// export function AppSidebar({ teacher }: AppSidebarProps) {
//   const school = useSchool(); // Access school data (including colors) from context

//   return (
//     <aside className={`fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r 
//                      bg-background sm:flex border-school-primary-100` // Example: Lighter primary border
//                       // The main background is often 'bg-background', but for some prominent parts,
//                       // you might choose `bg-school-secondary` or `bg-school-primary-950` etc.
//     }>
//       <div className={`flex flex-col gap-2 p-4 border-b border-school-primary-200 
//                        bg-school-secondary-950 text-school-secondary-foreground` // Darker secondary background, light text
//       }>
//         <h2 className={`text-lg font-semibold text-school-primary`}> {/* Primary color for main title */}
//           {school.name}
//         </h2>
//         <p className="text-sm">{teacher.name}</p> {/* Default text color, or specific if needed */}
//         <p className="text-xs">{teacher.email}</p>
//         <p className="text-xs">Primary Subject: <span className="text-school-primary-100">{teacher.primarySubject}</span></p> {/* Lighter primary for subject highlight */}
//       </div>

//       <nav className="flex-1 flex flex-col gap-1 p-4">
//         {/* Example of Navigation Links */}
//         <Link 
//           href="/teacher" 
//           className="flex items-center gap-3 rounded-lg px-3 py-2 text-school-secondary-foreground transition-all hover:bg-school-primary hover:text-school-primary-foreground"
//         >
//           {/* Icon could also be colored: <YourIcon className="h-4 w-4 text-school-primary-600" /> */}
//           Dashboard
//         </Link>
//         <Link 
//           href="/teacher/classes" 
//           className="flex items-center gap-3 rounded-lg px-3 py-2 text-school-secondary-foreground transition-all hover:bg-school-primary hover:text-school-primary-foreground"
//         >
//           Classes
//         </Link>
//         <Link 
//           href="/teacher/assessments" 
//           className="flex items-center gap-3 rounded-lg px-3 py-2 text-school-secondary-foreground transition-all hover:bg-school-primary hover:text-school-primary-foreground"
//         >
//           Assessments
//         </Link>
        
//         {/* Example: A prominent button at the bottom of the sidebar */}
//         <div className="mt-auto pt-4 border-t border-school-secondary-800">
//           <Button 
//             className="w-full bg-school-primary hover:bg-school-primary-600 text-school-primary-foreground"
//             asChild
//           >
//             <Link href="/settings">
//               Settings
//             </Link>
//           </Button>
//         </div>
//       </nav>
//     </aside>
//   );
// }

// // src/components/TeacherDashboard/app-sidebar.tsx
// 'use client';

// import { useSchool } from "@/src/context/SchoolProvider";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { SidebarProfileData } from '@/src/types/profile'; // Import the derived type

// interface AppSidebarProps {
//   teacher: SidebarProfileData; // Use the derived profile data type
// }

// export function AppSidebar({ teacher }: AppSidebarProps) {
//   const school = useSchool(); // Access school data from context

//   return (
//     <aside className={`fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r 
//                      bg-background sm:flex border-school-primary-100`}>
//       <div className={`flex flex-col gap-2 p-4 border-b border-school-primary-200 
//                        bg-school-secondary-950 text-school-secondary-foreground`}>
//         <h2 className={`text-lg font-semibold text-school-primary`}>
//           {school.name} {/* School name from SchoolProvider */}
//         </h2>
//         <p className="text-sm">{teacher.name}</p> {/* Teacher name from props */}
//         <p className="text-xs">{teacher.email}</p>
//         <p className="text-xs">Primary Subject: <span className="text-school-primary-100">{teacher.primarySubject}</span></p>
//       </div>

//       {/* ... rest of your styled sidebar content ... */}
//       <nav className="flex-1 flex flex-col gap-1 p-4">
//         <Link
//           href="/teacher"
//           className="flex items-center gap-3 rounded-lg px-3 py-2 text-school-secondary-foreground transition-all hover:bg-school-primary hover:text-school-primary-foreground"
//         >
//           Dashboard
//         </Link>
//         {/* ... other links ... */}
//       </nav>
//     </aside>
//   );
// }

// src/components/TeacherDashboard/app-sidebar.tsx


// 'use client';

// import { useSchool } from "@/context/schoolProvider";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { SidebarProfileData } from '@/types/profile'; // Import the derived type
// import { Prisma } from '@/generated/prisma/client'; // For role checks
// import { Role } from "@/generated/prisma/client";



// interface AppSidebarProps {
//   teacher: SidebarProfileData; // Use the derived profile data type
// }

// export function AppSidebar({ teacher }: AppSidebarProps) {
//   const school = useSchool(); // Access school data from context

//   // Example of using role for conditional rendering/styling
//   const showAdminFeatures = teacher.role === Role.SUPER_ADMIN || teacher.role === Role.SCHOOL_ADMIN;

//   return (
//     <aside className={`fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r 
//                      bg-background sm:flex border-school-primary-100`}>
//       <div className={`flex flex-col gap-2 p-4 border-b border-school-primary-200 
//                        bg-school-secondary-950 text-school-secondary-foreground`}>
//         <h2 className={`text-lg font-semibold text-school-primary`}>
//           {teacher.schoolName || "EduAI Academy"} {/* Use schoolName from prop, or fallback */}
//         </h2>
//         <p className="text-sm">{teacher.name} (<span className="capitalize">{teacher.role.toLowerCase().replace('_', ' ')}</span>)</p>
//         <p className="text-xs">{teacher.email}</p>
//         {teacher.role === Role.TEACHER && ( // Conditionally show based on role
//           <p className="text-xs">Primary Subject: <span className="text-school-primary-100">{teacher.primarySubject}</span></p>
//         )}
//       </div>

//       <nav className="flex-1 flex flex-col gap-1 p-4">
//         <Link
//           href="/dashboard" // Generic dashboard link, might redirect based on role
//           className="flex items-center gap-3 rounded-lg px-3 py-2 text-school-secondary-foreground transition-all hover:bg-school-primary hover:text-school-primary-foreground"
//         >
//           Dashboard
//         </Link>

//         {teacher.role === Role.TEACHER && (
//           <>
//             <Link href="/teacher/classes" /* ... */>Classes</Link>
//             <Link href="/teacher/assessments" /* ... */>Assessments</Link>
//           </>
//         )}

//         {teacher.role === Role.STUDENT && (
//           <>
//             <Link href="/student/my-courses" /* ... */>My Courses</Link>
//             <Link href="/student/grades" /* ... */>My Grades</Link>
//           </>
//         )}

//         {showAdminFeatures && (
//           <>
//             <Link href="/admin/users" /* ... */>Manage Users</Link>
//             <Link href="/admin/settings" /* ... */>School Settings</Link>
//           </>
//         )}

//         <div className="mt-auto pt-4 border-t border-school-secondary-800">
//           <Button
//             className="w-full bg-school-primary hover:bg-school-primary-600 text-school-primary-foreground"
//             asChild
//           >
//             <Link href="/settings">
//               Profile Settings
//             </Link>
//           </Button>
//         </div>
//       </nav>
//     </aside>
//   );
// }


// 'use client';

// import { useSchool } from "@/context/schoolProvider";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { SidebarProfileData } from '@/types/profile'; // Import the derived type
// // REMOVE  import { Prisma } from '@/generated/prisma/client'; // For role checks
// import { Role } from "@/generated/prisma/client"; // REMOVE, no need for role

// interface AppSidebarProps {
//   teacher: SidebarProfileData; // Use the derived profile data type
// }

// export function AppSidebar({ teacher }: AppSidebarProps) {
//   const school = useSchool(); // Access school data from context

//   // Removed
//   // Example of using role for conditional rendering/styling
//   // const showAdminFeatures = teacher.role === Role.SUPER_ADMIN || teacher.role === Role.SCHOOL_ADMIN;

//   return (
//     <aside className={`fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r 
//                      bg-background sm:flex border-school-primary-100`}>
//       <div className={`flex flex-col gap-2 p-4 border-b border-school-primary-200 
//                        bg-school-secondary-950 text-school-secondary-foreground`}>
//         <h2 className={`text-lg font-semibold text-school-primary`}>
//           {teacher.schoolName || "EduAI Academy"} {/* Use schoolName from prop, or fallback */}
//         </h2>
//         <p className="text-sm">{teacher.name} (<span className="capitalize">{teacher.role.toLowerCase().replace('_', ' ')}</span>)</p>
//         <p className="text-xs">{teacher.email}</p>
//         {teacher.role === "TEACHER" && ( // Conditionally show based on role, replaced enum with a string compare.
//           <p className="text-xs">Primary Subject: <span className="text-school-primary-100">{teacher.primarySubject}</span></p>
//         )}
//       </div>

//       <nav className="flex-1 flex flex-col gap-1 p-4">
//         <Link
//           href="/dashboard" // Generic dashboard link, might redirect based on role
//           className="flex items-center gap-3 rounded-lg px-3 py-2 text-school-secondary-foreground transition-all hover:bg-school-primary hover:text-school-primary-foreground"
//         >
//           Dashboard
//         </Link>

//         {teacher.role === "TEACHER" && (
//           <>
//             <Link href="/teacher/classes" /* ... */>Classes</Link>
//             <Link href="/teacher/assessments" /* ... */>Assessments</Link>
//           </>
//         )}

//         {teacher.role === "STUDENT" && (
//           <>
//             <Link href="/student/my-courses" /* ... */>My Courses</Link>
//             <Link href="/student/grades" /* ... */>My Grades</Link>
//           </>
//         )}

//         {teacher.role === "SUPER_ADMIN" || teacher.role === "SCHOOL_ADMIN" && ( //Check the roles here as well
//           <>
//             <Link href="/admin/users" /* ... */>Manage Users</Link>
//             <Link href="/admin/settings" /* ... */>School Settings</Link>
//           </>
//         )}

//         <div className="mt-auto pt-4 border-t border-school-secondary-800">
//           <Button
//             className="w-full bg-school-primary hover:bg-school-primary-600 text-school-primary-foreground"
//             asChild
//           >
//             <Link href="/settings">
//               Profile Settings
//             </Link>
//           </Button>
//         </div>
//       </nav>
//     </aside>
//   );
// }



// src/components/TeacherDashboard/app-sidebar.tsx
// src/components/TeacherDashboard/app-sidebar.tsx
// 'use client';

// import { useSchool } from "@/context/schoolProvider";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { SidebarProfileData } from '@/types/profile';

// interface AppSidebarProps {
//   teacher: SidebarProfileData; // Use the derived profile data type
// }

// export function AppSidebar({ teacher }: AppSidebarProps) {
//   const school = useSchool(); // Access school data from context

//   // Example of using role for conditional rendering/styling
//   const showAdminFeatures = teacher.role === "SUPER_ADMIN" || teacher.role === "SCHOOL_ADMIN"; // Do not import any prisma logic or use it.

//   return (
//     <aside className={`fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r 
//                      bg-background sm:flex border-school-primary-100`}>
//       <div className={`flex flex-col gap-2 p-4 border-b border-school-primary-200 
//                        bg-school-secondary-950 text-school-secondary-foreground`}>
//         <h2 className={`text-lg font-semibold text-school-primary`}>
//           {teacher.schoolName || "EduAI Academy"} {/* Use schoolName from prop, or fallback */}
//         </h2>
//         <p className="text-sm">{teacher.name} (<span className="capitalize">{teacher.role.toLowerCase().replace('_', ' ')}</span>)</p>
//         <p className="text-xs">{teacher.email}</p>
//         {teacher.role === "TEACHER" && ( // Conditionally show based on role
//           <p className="text-xs">Primary Subject: <span className="text-school-primary-100">{teacher.primarySubject}</span></p>
//         )}
//       </div>

//       <nav className="flex-1 flex flex-col gap-1 p-4">
//         <Link
//           href="/dashboard" // Generic dashboard link, might redirect based on role
//           className="flex items-center gap-3 rounded-lg px-3 py-2 text-school-secondary-foreground transition-all hover:bg-school-primary hover:text-school-primary-foreground"
//         >
//           Dashboard
//         </Link>

//         {teacher.role === "TEACHER" && (
//           <>
//             <Link href="/teacher/classes" /* ... */>Classes</Link>
//             <Link href="/teacher/assessments" /* ... */>Assessments</Link>
//           </>
//         )}

//         {teacher.role === "STUDENT" && (
//           <>
//             <Link href="/student/my-courses" /* ... */>My Courses</Link>
//             <Link href="/student/grades" /* ... */>My Grades</Link>
//           </>
//         )}

//         {showAdminFeatures && (
//           <>
//             <Link href="/admin/users" /* ... */>Manage Users</Link>
//             <Link href="/admin/settings" /* ... */>School Settings</Link>
//           </>
//         )}

//         <div className="mt-auto pt-4 border-t border-school-secondary-800">
//           <Button
//             className="w-full bg-school-primary hover:bg-school-primary-600 text-school-primary-foreground"
//             asChild
//           >
//             <Link href="/settings">
//               Profile Settings
//             </Link>
//           </Button>
//         </div>
//       </nav>
//     </aside>
//   );
// }


// components/appSidebar.tsx
// components/appSidebar.tsx
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
    SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useSchool } from "@/context/schoolProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, BookOpen, ClipboardList, GraduationCap, BarChart2, Users, Settings } from "lucide-react";
import { SidebarProfileData } from '@/types/profile';

interface AppSidebarProps {
    teacher: SidebarProfileData;
}

export function AppSidebar({ teacher }: AppSidebarProps) {
    const { school } = useSchool();
    const showAdminFeatures = teacher.role === "SUPER_ADMIN" || teacher.role === "SCHOOL_ADMIN";

    return (
        <Sidebar>
            {/* School + user info */}
            <SidebarHeader className="border-b border-school-primary-200 bg-school-secondary-950 text-school-secondary-foreground p-4">
                <h2 className="text-lg font-semibold text-school-primary">
                    {school?.name ?? teacher.schoolName ?? "EduAI Academy"}
                </h2>
                <p className="text-sm">
                    {teacher.name}{" "}
                    <span className="capitalize text-xs opacity-70">
                        ({teacher.role.toLowerCase().replace('_', ' ')})
                    </span>
                </p>
                <p className="text-xs opacity-60">{teacher.email}</p>
                {teacher.role === "TEACHER" && (
                    <p className="text-xs mt-1">
                        Subject:{" "}
                        <span className="text-school-primary-100">{teacher.primarySubject}</span>
                    </p>
                )}
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Always visible */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard">
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Teacher links */}
                            {teacher.role === "TEACHER" && (
                                <>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/teacher/classes">
                                                <BookOpen className="h-4 w-4" />
                                                <span>Classes</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/teacher/assessments">
                                                <ClipboardList className="h-4 w-4" />
                                                <span>Assessments</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </>
                            )}

                            {/* Student links */}
                            {teacher.role === "STUDENT" && (
                                <>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/student/my-courses">
                                                <GraduationCap className="h-4 w-4" />
                                                <span>My Courses</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/student/grades">
                                                <BarChart2 className="h-4 w-4" />
                                                <span>My Grades</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </>
                            )}

                            {/* Admin links */}
                            {showAdminFeatures && (
                                <>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/admin/users">
                                                <Users className="h-4 w-4" />
                                                <span>Manage Users</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/admin/settings">
                                                <Settings className="h-4 w-4" />
                                                <span>School Settings</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-school-secondary-800">
                <Button
                    className="w-full bg-school-primary hover:bg-school-primary-600 text-school-primary-foreground"
                    asChild
                >
                    <Link href="/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Profile Settings
                    </Link>
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}