// "use client"
// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { cn } from "@/lib/utils"
// import {
//   LayoutDashboard,
//   Users,
//   GraduationCap,
//   School,
//   ClipboardCheck,
//   FileText,
//   Settings,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip"

// const navigationItems = [
//   { name: "Overview", href: "#", icon: LayoutDashboard },
//   { name: "Students", href: "#students", icon: Users },
//   { name: "Teachers", href: "#teachers", icon: GraduationCap },
//   { name: "Classes", href: "#classes", icon: School },
//   { name: "Assessments", href: "#assessments", icon: ClipboardCheck },
//   { name: "Report Cards", href: "#reports", icon: FileText },
//   { name: "Curriculum Settings", href: "#curriculum", icon: Settings },
// ]

// interface SidebarProps {
//   onCollapsedChange?: (collapsed: boolean) => void
// }

// export function Sidebar({ onCollapsedChange }: SidebarProps) {
//   const [collapsed, setCollapsed] = useState(false)
//   const [activeItem, setActiveItem] = useState("Overview")

//   useEffect(() => {
//     onCollapsedChange?.(collapsed)
//   }, [collapsed, onCollapsedChange])

//   return (
//     <TooltipProvider delayDuration={0}>
//       <aside
//         className={cn(
//           "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
//           collapsed ? "w-16" : "w-64"
//         )}
//       >
//         <div className="flex h-full flex-col">
//           {/* Logo Section */}
//           <div className={cn(
//             "flex h-16 items-center border-b border-sidebar-border px-4",
//             collapsed ? "justify-center" : "justify-between"
//           )}>
//             {!collapsed && (
//               <div className="flex items-center gap-2">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
//                   <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
//                 </div>
//                 <span className="text-lg font-semibold tracking-tight">EduAdmin</span>
//               </div>
//             )}
//             {collapsed && (
//               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
//                 <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
//               </div>
//             )}
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 space-y-1 p-2">
//             {navigationItems.map((item) => {
//               const Icon = item.icon
//               const isActive = activeItem === item.name

//               const linkContent = (
//                 <Link
//                   href={item.href}
//                   onClick={() => setActiveItem(item.name)}
//                   className={cn(
//                     "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
//                     isActive
//                       ? "bg-sidebar-accent text-sidebar-accent-foreground"
//                       : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
//                     collapsed && "justify-center px-2"
//                   )}
//                 >
//                   <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
//                   {!collapsed && <span>{item.name}</span>}
//                 </Link>
//               )

//               if (collapsed) {
//                 return (
//                   <Tooltip key={item.name}>
//                     <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
//                     <TooltipContent side="right" className="bg-popover text-popover-foreground">
//                       {item.name}
//                     </TooltipContent>
//                   </Tooltip>
//                 )
//               }

//               return <div key={item.name}>{linkContent}</div>
//             })}
//           </nav>

//           {/* Collapse Button */}
//           <div className="border-t border-sidebar-border p-2">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setCollapsed(!collapsed)}
//               className={cn(
//                 "w-full justify-center text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
//                 !collapsed && "justify-start"
//               )}
//             >
//               {collapsed ? (
//                 <ChevronRight className="h-4 w-4" />
//               ) : (
//                 <>
//                   <ChevronLeft className="h-4 w-4 mr-2" />
//                   <span>Collapse</span>
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       </aside>
//     </TooltipProvider>
//   )
// }



"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  ClipboardCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Database,
  ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useProfileStore } from "@/store/profileStore"

// ── Configuration ───────────────────────────────────────────────────────────

const navigationItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Teachers", href: "/admin/teachers", icon: GraduationCap },
  { name: "Classes", href: "/admin/classes", icon: School },
  { name: "Syllabus", href: "/admin/curriculum", icon: Database },
  { name: "Assessments", href: "/admin/exams", icon: ClipboardCheck },
  { name: "Registry Settings", href: "/admin/settings", icon: Settings },
]

interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void
}

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * INSTITUTIONAL CORE SIDEBAR (Tier 2)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-card, border-border).
 * Rule 19: Standardized Geometry (rounded-xl/2xl).
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function Sidebar({ onCollapsedChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { profile } = useProfileStore()

  useEffect(() => {
    onCollapsedChange?.(collapsed)
  }, [collapsed, onCollapsedChange])

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen transition-all duration-300 ease-in-out border-r",
          "bg-card border-border", // Rule 18: Semantic Tokens
          collapsed ? "w-20" : "w-72"
        )}
      >
        <div className="flex h-full flex-col">
          
          {/* ── LOGO SECTION (Rule 11/19/21) ── */}
          <div className={cn(
            "flex h-20 items-center px-4 border-b border-border/50 bg-surface/30",
            collapsed ? "justify-center" : "justify-between"
          )}>
            {!collapsed && (
              <div className="flex items-center gap-3 animate-in fade-in duration-500">
                {/* Rule 21: Scale Protocol for Icon Container */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-school-primary-100 border border-school-primary-200 shadow-sm">
                  <GraduationCap className="h-6 w-6 text-school-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-extrabold italic tracking-tighter uppercase leading-none text-foreground">
                    SchoolPaaS
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                    Registry Core
                  </span>
                </div>
              </div>
            )}
            {collapsed && (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-school-primary-100 border border-school-primary-200">
                <GraduationCap className="h-6 w-6 text-school-primary" />
              </div>
            )}
          </div>

          {/* ── NAVIGATION (Rule 11/20) ── */}
          <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto custom-scrollbar">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              const linkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 transition-all group relative",
                    "rounded-2xl", // Rule 19
                    isActive
                      ? "bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-200"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-on-school-primary" : "text-muted-foreground/60 group-hover:text-school-primary"
                  )} />
                  
                  {!collapsed && (
                    <span className="text-[11px] font-extrabold uppercase tracking-widest italic">
                      {item.name}
                    </span>
                  )}

                  {/* Active Indicator Dot */}
                  {isActive && !collapsed && (
                    <div className="absolute right-4 h-1.5 w-1.5 rounded-full bg-on-school-primary animate-pulse" />
                  )}
                </Link>
              )

              if (collapsed) {
                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>
                      <div className="flex justify-center">{linkContent}</div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-card border border-border text-foreground text-[10px] font-bold uppercase tracking-widest">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return <div key={item.name}>{linkContent}</div>
            })}
          </nav>

          {/* ── SYSTEM STATUS (Rule 21) ── */}
          {!collapsed && (
            <div className="px-6 py-4">
              <div className="bg-surface border border-border rounded-[1.5rem] p-4 space-y-3 shadow-inner">
                <div className="flex items-center gap-2 text-emerald-600">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Verified Session</span>
                </div>
                <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                  Institutional data isolation protocol active for {profile?.school?.name || "Registry"}.
                </p>
              </div>
            </div>
          )}

          {/* ── COLLAPSE TRIGGER (Rule 18/19) ── */}
          <div className="border-t border-border p-4 bg-surface/10">
            <Button
              variant="ghost"
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                "w-full h-12 rounded-xl transition-all",
                "text-muted-foreground hover:bg-surface hover:text-foreground",
                !collapsed ? "justify-start px-4" : "justify-center"
              )}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5 mr-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Minimize Panel</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* Spacing spacer for main content */}
      <div className={cn(
        "hidden lg:block transition-all duration-300",
        collapsed ? "w-20" : "w-72"
      )} />
    </TooltipProvider>
  )
}