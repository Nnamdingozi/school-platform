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
//     SidebarGroupContent,
// } from "@/components/ui/sidebar";
// import { useSchool } from "@/context/schoolProvider";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { LayoutDashboard, BookOpen, ClipboardList, GraduationCap, BarChart2, Users, Settings } from "lucide-react";
// import { SidebarProfileData } from '@/types/profile';

// interface AppSidebarProps {
//     teacher: SidebarProfileData;
// }

// export function AppSidebar({ teacher }: AppSidebarProps) {
//     const { school } = useSchool();
//     const showAdminFeatures = teacher.role === "SUPER_ADMIN" || teacher.role === "SCHOOL_ADMIN";

//     return (
//         <Sidebar>
//             {/* School + user info */}
//             <SidebarHeader className="border-b border-school-primary-200 bg-school-secondary-950 text-school-secondary-foreground p-4">
//                 <h2 className="text-lg font-semibold text-school-primary">
//                     {school?.name ?? teacher.schoolName ?? "EduAI Academy"}
//                 </h2>
//                 <p className="text-sm">
//                     {teacher.name}{" "}
//                     <span className="capitalize text-xs opacity-70">
//                         ({teacher.role.toLowerCase().replace('_', ' ')})
//                     </span>
//                 </p>
//                 <p className="text-xs opacity-60">{teacher.email}</p>
//                 {teacher.role === "TEACHER" && (
//                     <p className="text-xs mt-1">
//                         Subject:{" "}
//                         <span className="text-school-primary-100">{teacher.primarySubject}</span>
//                     </p>
//                 )}
//             </SidebarHeader>

//             <SidebarContent>
//                 <SidebarGroup>
//                     <SidebarGroupContent>
//                         <SidebarMenu>
//                             {/* Always visible */}
//                             <SidebarMenuItem>
//                                 <SidebarMenuButton asChild>
//                                     <Link href="/dashboard">
//                                         <LayoutDashboard className="h-4 w-4" />
//                                         <span>Dashboard</span>
//                                     </Link>
//                                 </SidebarMenuButton>
//                             </SidebarMenuItem>

//                             {/* Teacher links */}
//                             {teacher.role === "TEACHER" && (
//                                 <>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild>
//                                             <Link href="/teacher/classes">
//                                                 <BookOpen className="h-4 w-4" />
//                                                 <span>Classes</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild>
//                                             <Link href="/teacher/assessments">
//                                                 <ClipboardList className="h-4 w-4" />
//                                                 <span>Assessments</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                 </>
//                             )}

//                             {/* Student links */}
//                             {teacher.role === "STUDENT" && (
//                                 <>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild>
//                                             <Link href="/student/my-courses">
//                                                 <GraduationCap className="h-4 w-4" />
//                                                 <span>My Courses</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild>
//                                             <Link href="/student/grades">
//                                                 <BarChart2 className="h-4 w-4" />
//                                                 <span>My Grades</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                 </>
//                             )}

//                             {/* Admin links */}
//                             {showAdminFeatures && (
//                                 <>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild>
//                                             <Link href="/admin/users">
//                                                 <Users className="h-4 w-4" />
//                                                 <span>Manage Users</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild>
//                                             <Link href="/admin/settings">
//                                                 <Settings className="h-4 w-4" />
//                                                 <span>School Settings</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                 </>
//                             )}
//                         </SidebarMenu>
//                     </SidebarGroupContent>
//                 </SidebarGroup>
//             </SidebarContent>

//             <SidebarFooter className="p-4 border-t border-school-secondary-800">
//                 <Button
//                     className="w-full bg-school-primary hover:bg-school-primary-600 text-school-primary-foreground"
//                     asChild
//                 >
//                     <Link href="/settings">
//                         <Settings className="h-4 w-4 mr-2" />
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
//     SidebarGroupContent,
// } from "@/components/ui/sidebar";
// import { useSchool } from "@/context/schoolProvider";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { LayoutDashboard, BookOpen, ClipboardList, GraduationCap, BarChart2, Users, Settings } from "lucide-react";
// import { SidebarProfileData } from '@/types/profile';
// import { cn } from "@/lib/utils";

// interface AppSidebarProps {
//     teacher: SidebarProfileData;
// }

// const navItemClass = cn(
//     "flex items-center gap-3 rounded-lg px-3 py-2 w-full",
//  "text-school-primary transition-all duration-200",      
//     "hover:bg-school-primary hover:text-school-secondary-100",
//     "hover:scale-[1.03] hover:shadow-sm",
//     "active:scale-[0.98]"
// );

// export function AppSidebar({ teacher }: AppSidebarProps) {
//     const { school } = useSchool();
//     const showAdminFeatures = teacher.role === "SUPER_ADMIN" || teacher.role === "SCHOOL_ADMIN";

//     return (
//         <Sidebar className="border-r border-school-secondary-800 mt-20">
//             {/* School + user info */}
//             <SidebarHeader className="border-b border-school-secondary-800 bg-school-secondary-950 p-4 space-y-1">
//                 <h2 className="text-lg font-semibold text-school-primary truncate">
//                     {school?.name ?? teacher.schoolName ?? "EduAI Academy"}
//                 </h2>
//                 <p className="text-sm text-school-secondary-100">
//                     {teacher.name}{" "}
//                     <span className="capitalize text-xs text-school-secondary-100/70">
//                         ({teacher.role.toLowerCase().replace('_', ' ')})
//                     </span>
//                 </p>
//                 <p className="text-xs text-school-secondary-100/60 truncate">{teacher.email}</p>
//                 {teacher.role === "TEACHER" && (
//                     <p className="text-xs text-school-secondary-100/80 mt-1">
//                         Subject:{" "}
//                         <span className="text-school-primary-100 font-medium">{teacher.primarySubject}</span>
//                     </p>
//                 )}
//             </SidebarHeader>

//             <SidebarContent className="bg-school-secondary-950 px-2 py-3">
//                 <SidebarGroup>
//                     <SidebarGroupContent>
//                         <SidebarMenu className="space-y-1">
//                             {/* Always visible */}
//                             <SidebarMenuItem>
//                                 <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent">
//                                     <Link href="/dashboard" className={navItemClass}>
//                                         <LayoutDashboard className="h-4 w-4 shrink-0" />
//                                         <span>Dashboard</span>
//                                     </Link>
//                                 </SidebarMenuButton>
//                             </SidebarMenuItem>

//                             {/* Teacher links */}
//                             {teacher.role === "TEACHER" && (
//                                 <>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent">
//                                             <Link href="/teacher/classes" className={navItemClass}>
//                                                 <BookOpen className="h-4 w-4 shrink-0" />
//                                                 <span>Classes</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent">
//                                             <Link href="/teacher/assessments" className={navItemClass}>
//                                                 <ClipboardList className="h-4 w-4 shrink-0" />
//                                                 <span>Assessments</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                 </>
//                             )}

//                             {/* Student links */}
//                             {teacher.role === "STUDENT" && (
//                                 <>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent">
//                                             <Link href="/student/my-courses" className={navItemClass}>
//                                                 <GraduationCap className="h-4 w-4 shrink-0" />
//                                                 <span>My Courses</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent">
//                                             <Link href="/student/grades" className={navItemClass}>
//                                                 <BarChart2 className="h-4 w-4 shrink-0" />
//                                                 <span>My Grades</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                 </>
//                             )}

//                             {/* Admin links */}
//                             {showAdminFeatures && (
//                                 <>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent">
//                                             <Link href="/admin/users" className={navItemClass}>
//                                                 <Users className="h-4 w-4 shrink-0" />
//                                                 <span>Manage Users</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent">
//                                             <Link href="/admin/settings" className={navItemClass}>
//                                                 <Settings className="h-4 w-4 shrink-0" />
//                                                 <span>School Settings</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                 </>
//                             )}
//                         </SidebarMenu>
//                     </SidebarGroupContent>
//                 </SidebarGroup>
//             </SidebarContent>

//             <SidebarFooter className="p-4 border-t border-school-secondary-800 bg-school-secondary-950">
//                 <Button
//                     className={cn(
//                         "w-full bg-school-primary text-school-secondary-950 font-semibold",
//                         "hover:bg-school-primary-600 hover:scale-[1.02]",
//                         "transition-all duration-200 active:scale-[0.98]"
//                     )}
//                     asChild
//                 >
//                     <Link href="/settings">
//                         <Settings className="h-4 w-4 mr-2" />
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
//     SidebarGroupContent,
// } from "@/components/ui/sidebar";
// import { useSchool } from "@/context/schoolProvider";
// import { useProfileStore } from "@/store/profileStore";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//     LayoutDashboard, BookOpen, ClipboardList,
//     GraduationCap, BarChart2, Users, Settings, Loader2
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// const navItemClass = cn(
//     "flex items-center gap-3 rounded-lg px-3 py-2 w-full",
//     "text-school-primary transition-all duration-200",
//     "hover:bg-school-primary hover:text-school-secondary-100",
//     "hover:scale-[1.03] hover:shadow-sm",
//     "active:scale-[0.98]"
// );

// // ✅ No props needed — reads everything from store
// export function AppSidebar() {
//     const { school } = useSchool();
//     const { profile, isLoading } = useProfileStore();

//     const showAdminFeatures =
//         profile?.role === "SUPER_ADMIN" || profile?.role === "SCHOOL_ADMIN";

//     // Show skeleton while store hydrates
//     if (isLoading || !profile) {
//         return (
//             <Sidebar className="border-r border-school-secondary-800 mt-20">
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

//     return (
//         <Sidebar className="border-r border-school-secondary-800 mt-20">

//             {/* School + user info */}
//             <SidebarHeader className="border-b border-school-secondary-800 bg-school-secondary-950 p-4 space-y-1">
//                 <h2 className="text-lg font-semibold text-school-primary truncate">
//                     {school?.name ?? profile.school?.name ?? "EduAI Academy"}
//                 </h2>
//                 <p className="text-sm text-school-secondary-100">
//                     {profile.name}{" "}
//                     <span className="capitalize text-xs text-school-secondary-100/70">
//                         ({profile.role.toLowerCase().replace('_', ' ')})
//                     </span>
//                 </p>
//                 <p className="text-xs text-school-secondary-100/60 truncate">
//                     {profile.email}
//                 </p>
//                 {profile.role === "TEACHER" && profile.selectedSubjects?.[0]?.subject?.name && (
//                     <p className="text-xs text-school-secondary-100/80 mt-1">
//                         Subject:{" "}
//                         <span className="text-school-primary-100 font-medium">
//                             {profile.selectedSubjects[0].subject.name}
//                         </span>
//                     </p>
//                 )}
//             </SidebarHeader>

//             <SidebarContent className="bg-school-secondary-950 px-2 py-3">
//                 <SidebarGroup>
//                     <SidebarGroupContent>
//                         <SidebarMenu className="space-y-1">

//                             {/* Always visible */}
//                             <SidebarMenuItem>
//                                 <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent">
//                                     <Link href="/admin" className={navItemClass}>
//                                         <LayoutDashboard className="h-4 w-4 shrink-0" />
//                                         <span>Dashboard</span>
//                                     </Link>
//                                 </SidebarMenuButton>
//                             </SidebarMenuItem>

//                             {/* Teacher links */}
//                             {profile.role === "TEACHER" && (
//                                 <>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent">
//                                             <Link href="/teacher/classes" className={navItemClass}>
//                                                 <BookOpen className="h-4 w-4 shrink-0" />
//                                                 <span>Classes</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent">
//                                             <Link href="/teacher/assessments" className={navItemClass}>
//                                                 <ClipboardList className="h-4 w-4 shrink-0" />
//                                                 <span>Assessments</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                 </>
//                             )}

//                             {/* Student links */}
//                             {profile.role === "STUDENT" && (
//                                 <>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent">
//                                             <Link href="/student/my-courses" className={navItemClass}>
//                                                 <GraduationCap className="h-4 w-4 shrink-0" />
//                                                 <span>My Courses</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent">
//                                             <Link href="/student/grades" className={navItemClass}>
//                                                 <BarChart2 className="h-4 w-4 shrink-0" />
//                                                 <span>My Grades</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                 </>
//                             )}

//                             {/* Admin links */}
//                             {showAdminFeatures && (
//                                 <>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent">
//                                             <Link href="/admin/users" className={navItemClass}>
//                                                 <Users className="h-4 w-4 shrink-0" />
//                                                 <span>Manage Users</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                     <SidebarMenuItem>
//                                         <SidebarMenuButton asChild className="p-0 h-auto hover:bg-transparent">
//                                             <Link href="/admin/settings" className={navItemClass}>
//                                                 <Settings className="h-4 w-4 shrink-0" />
//                                                 <span>School Settings</span>
//                                             </Link>
//                                         </SidebarMenuButton>
//                                     </SidebarMenuItem>
//                                 </>
//                             )}

//                         </SidebarMenu>
//                     </SidebarGroupContent>
//                 </SidebarGroup>
//             </SidebarContent>

//             <SidebarFooter className="p-4 border-t border-school-secondary-800 bg-school-secondary-950">
//                 <Button
//                     className={cn(
//                         "w-full bg-school-primary text-school-secondary-950 font-semibold",
//                         "hover:bg-school-primary-600 hover:scale-[1.02]",
//                         "transition-all duration-200 active:scale-[0.98]"
//                     )}
//                     asChild
//                 >
//                     <Link href="/settings">
//                         <Settings className="h-4 w-4 mr-2" />
//                         Profile Settings
//                     </Link>
//                 </Button>
//             </SidebarFooter>

//         </Sidebar>
//     );
// }


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
                            <NavItem href="/admin/school" icon={School} label="School Settings" />
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
