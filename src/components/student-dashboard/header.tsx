// "use client"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Bell, GraduationCap, ChevronDown, Settings, LogOut, User } from "lucide-react"
// import { Badge } from "@/components/ui/badge"

// interface HeaderProps {
//   studentName: string
//   schoolName: string
//   grade: string
//   avatarUrl?: string
// }

// export function Header({ studentName, schoolName, grade, avatarUrl }: HeaderProps) {
//   const initials = studentName
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()

//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
//       <div className="flex h-16 items-center justify-between px-4 md:px-6">
//         {/* Logo & School */}
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
//             <GraduationCap className="h-5 w-5" />
//           </div>
//           <div className="hidden sm:block">
//             <h1 className="text-sm font-semibold text-foreground">{schoolName}</h1>
//             <p className="text-xs text-muted-foreground">Student Portal</p>
//           </div>
//         </div>

//         {/* Grade Badge - Center */}
//         <div className="hidden md:flex items-center">
//           <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">
//             {grade}
//           </Badge>
//         </div>

//         {/* Right side - User & Notifications */}
//         <div className="flex items-center gap-2">
//           {/* Notifications */}
//           <Button variant="ghost" size="icon" className="relative">
//             <Bell className="h-5 w-5" />
//             <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
//               3
//             </span>
//             <span className="sr-only">Notifications</span>
//           </Button>

//           {/* User Menu */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="flex items-center gap-2 px-2">
//                 <Avatar className="h-8 w-8">
//                   <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={studentName} />
//                   <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
//                     {initials}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="hidden md:block text-left">
//                   <p className="text-sm font-medium text-foreground">{studentName}</p>
//                   <p className="text-xs text-muted-foreground md:hidden lg:block">{grade}</p>
//                 </div>
//                 <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               <DropdownMenuLabel>My Account</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>
//                 <User className="mr-2 h-4 w-4" />
//                 Profile
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <Settings className="mr-2 h-4 w-4" />
//                 Settings
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem className="text-destructive">
//                 <LogOut className="mr-2 h-4 w-4" />
//                 Log out
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   )
// }




"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, GraduationCap, ChevronDown, Settings, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useProfileStore } from "@/store/profileStore"
import { LogoutButton } from "@/components/shared/logOutButton"

interface HeaderProps {
  studentName?: string
  schoolName?: string
  grade?: string
  avatarUrl?: string
}

/**
 * STUDENT REGISTRY HEADER (Tier 3 Hub)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 17: Pulls branding and identity from Zustand store.
 * Rule 18: Semantic Flip (bg-background, bg-surface, border-border).
 * Rule 19: Standardized Geometry (rounded-2xl).
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function Header({ studentName, schoolName, grade, avatarUrl }: HeaderProps) {
  const { profile } = useProfileStore();

  // Rule 17: Resolve data from Store with Prop Fallbacks
  const activeName = profile?.name || studentName || "Registry User";
  const activeSchool = profile?.school?.name || schoolName || "Institutional Hub";
  const activeGrade = grade || "Standard Tier";

  const initials = activeName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        
        {/* ── LOGO & INSTITUTIONAL IDENTITY (Rule 11/21) ── */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-school-primary shadow-lg shadow-school-primary-200">
            <GraduationCap className="h-6 w-6 text-on-school-primary" strokeWidth={2.5} />
          </div>
          <div className="hidden sm:block min-w-0">
            <h1 className="text-sm font-extrabold text-foreground uppercase italic tracking-tighter leading-none truncate">
              {activeSchool}
            </h1>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 italic">
              Student Terminal Hub
            </p>
          </div>
        </div>

        {/* ── COHORT BADGE (Rule 21) ── */}
        <div className="hidden md:flex items-center">
          <Badge 
            variant="outline" 
            className="bg-school-primary-50 text-school-primary border-school-primary-200 px-5 py-1.5 text-[10px] font-extrabold uppercase tracking-widest shadow-sm rounded-xl"
          >
            {activeGrade}
          </Badge>
        </div>

        {/* ── ACTION HUB (Rule 18/19) ── */}
        <div className="flex items-center gap-3">
          {/* Notifications Registry */}
          <Button variant="ghost" size="icon" className="relative hover:bg-surface rounded-xl text-muted-foreground hover:text-school-primary transition-all">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[8px] font-extrabold text-white shadow-lg animate-in zoom-in">
              3
            </span>
            <span className="sr-only">Transmission Registry</span>
          </Button>

          {/* Identity Hub Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-1 hover:bg-surface rounded-2xl border border-transparent hover:border-border transition-all">
                <Avatar className="h-9 w-9 border-2 border-background ring-2 ring-school-primary-100">
                  <AvatarImage src={avatarUrl} alt={activeName} />
                  <AvatarFallback className="bg-school-primary-50 text-school-primary text-xs font-extrabold italic tabular-nums">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left min-w-0 max-w-[120px]">
                  <p className="text-sm font-extrabold text-foreground truncate italic leading-none">{activeName}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 opacity-60">Verified Identity</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground opacity-30" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-64 bg-card border-border rounded-2xl shadow-2xl p-2 animate-in zoom-in-95 duration-200">
              <DropdownMenuLabel className="p-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Profile</p>
                  <p className="text-sm font-extrabold text-foreground uppercase italic tracking-tighter truncate">{activeName}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border mx-2" />
              
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-surface cursor-pointer group">
                <User className="mr-3 h-4 w-4 opacity-40 group-hover:text-school-primary group-hover:opacity-100 transition-all" />
                Profile Registry
              </DropdownMenuItem>
              
              <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-surface cursor-pointer group">
                <Settings className="mr-3 h-4 w-4 opacity-40 group-hover:text-school-primary group-hover:opacity-100 transition-all" />
                Hub Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-border mx-2" />
              
              {/* Rule 5: Compliance - Secure Session Termination */}
              <div className="p-1">
                <LogoutButton 
                  variant="header" 
                  className="w-full justify-start h-10 px-3 rounded-xl bg-destructive/5 hover:bg-destructive text-destructive hover:text-white border-0 shadow-none font-extrabold text-[11px] uppercase tracking-widest" 
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
