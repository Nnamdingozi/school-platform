"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  ClipboardCheck,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navigationItems = [
  { name: "Overview", href: "#", icon: LayoutDashboard },
  { name: "Students", href: "#students", icon: Users },
  { name: "Teachers", href: "#teachers", icon: GraduationCap },
  { name: "Classes", href: "#classes", icon: School },
  { name: "Assessments", href: "#assessments", icon: ClipboardCheck },
  { name: "Report Cards", href: "#reports", icon: FileText },
  { name: "Curriculum Settings", href: "#curriculum", icon: Settings },
]

interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void
}

export function Sidebar({ onCollapsedChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("Overview")

  useEffect(() => {
    onCollapsedChange?.(collapsed)
  }, [collapsed, onCollapsedChange])

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className={cn(
            "flex h-16 items-center border-b border-sidebar-border px-4",
            collapsed ? "justify-center" : "justify-between"
          )}>
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                  <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
                </div>
                <span className="text-lg font-semibold tracking-tight">EduAdmin</span>
              </div>
            )}
            {collapsed && (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.name

              const linkContent = (
                <Link
                  href={item.href}
                  onClick={() => setActiveItem(item.name)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )

              if (collapsed) {
                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="bg-popover text-popover-foreground">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return <div key={item.name}>{linkContent}</div>
            })}
          </nav>

          {/* Collapse Button */}
          <div className="border-t border-sidebar-border p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                "w-full justify-center text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                !collapsed && "justify-start"
              )}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span>Collapse</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
