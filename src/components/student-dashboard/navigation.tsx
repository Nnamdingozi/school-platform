// "use client"

// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { 
//   BookOpen, 
//   ClipboardList, 
//   BarChart3, 
//   FolderOpen, 
//   MessageSquare,
//   Home
// } from "lucide-react"

// interface NavigationProps {
//   activeItem: string
//   onNavigate: (item: string) => void
// }

// const navItems = [
//   { id: "dashboard", label: "Dashboard", icon: Home },
//   { id: "classroom", label: "My Classroom", icon: BookOpen },
//   { id: "homework", label: "Homework", icon: ClipboardList },
//   { id: "grades", label: "My Grades", icon: BarChart3 },
//   { id: "resources", label: "Resources", icon: FolderOpen },
//   { id: "messages", label: "Messages", icon: MessageSquare },
// ]

// export function Navigation({ activeItem, onNavigate }: NavigationProps) {
//   return (
//     <nav className="border-b border-border bg-card">
//       <div className="px-4 md:px-6">
//         <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
//           {navItems.map((item) => {
//             const Icon = item.icon
//             const isActive = activeItem === item.id
            
//             return (
//               <Button
//                 key={item.id}
//                 variant={isActive ? "secondary" : "ghost"}
//                 size="sm"
//                 onClick={() => onNavigate(item.id)}
//                 className={cn(
//                   "flex items-center gap-2 whitespace-nowrap px-3 py-2 transition-all",
//                   isActive && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
//                 )}
//               >
//                 <Icon className="h-4 w-4" />
//                 <span className="hidden sm:inline">{item.label}</span>
//               </Button>
//             )
//           })}
//         </div>
//       </div>
//     </nav>
//   )
// }



"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { 
  BookOpen, 
  ClipboardList, 
  BarChart3, 
  FolderOpen, 
  MessageSquare,
  Home,
  Layout
} from "lucide-react"
import { useProfileStore } from "@/store/profileStore"

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface NavigationProps {
  activeItem: string
  onNavigate: (item: string) => void
}

const navItems = [
  { id: "dashboard", label: "Registry Hub", icon: Home },
  { id: "classroom", label: "Classroom Hub", icon: BookOpen },
  { id: "modules",   label: "Academic Modules", icon: ClipboardList },
  { id: "performance", label: "Performance Hub", icon: BarChart3 },
  { id: "library",   label: "Library Hub", icon: FolderOpen },
  { id: "transmissions", label: "Transmissions", icon: MessageSquare },
]

/**
 * STUDENT SUB-NAVIGATION HUB (Tier 3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold uppercase).
 * Rule 18: Semantic Flip (bg-background, bg-surface, border-border).
 * Rule 19: Standardized Geometry (rounded-xl).
 * Rule 20: Compulsory Responsiveness (Fluid horizontal scroll).
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function Navigation({ activeItem, onNavigate }: NavigationProps) {
  const { profile } = useProfileStore();

  return (
    <nav className="sticky top-16 z-40 w-full border-b border-border bg-surface/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Rule 20: Fluid horizontal container with hidden scrollbars */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex items-center gap-2.5 whitespace-nowrap px-5 py-2.5 transition-all active:scale-95 group",
                  "rounded-xl border", // Rule 19
                  "text-[10px] font-extrabold uppercase tracking-widest", // Rule 11
                  isActive
                    ? "bg-school-primary text-on-school-primary border-school-primary shadow-lg shadow-school-primary-200"
                    : "bg-transparent border-transparent text-muted-foreground hover:bg-school-primary-50 hover:text-school-primary hover:border-school-primary-100"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-transform group-hover:scale-110",
                  isActive ? "text-on-school-primary" : "text-muted-foreground/50 group-hover:text-school-primary"
                )} />
                <span className={cn(
                  "hidden sm:inline italic",
                  isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                )}>
                  {item.label}
                </span>
                
                {/* Rule 21: Scale protocol active indicator */}
                {isActive && (
                  <div className="h-1 w-1 rounded-full bg-on-school-primary animate-pulse" />
                )}
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Visual Depth Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-school-primary/20 to-transparent opacity-30" />
    </nav>
  )
}