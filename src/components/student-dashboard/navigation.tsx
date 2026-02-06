"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  ClipboardList, 
  BarChart3, 
  FolderOpen, 
  MessageSquare,
  Home
} from "lucide-react"

interface NavigationProps {
  activeItem: string
  onNavigate: (item: string) => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "classroom", label: "My Classroom", icon: BookOpen },
  { id: "homework", label: "Homework", icon: ClipboardList },
  { id: "grades", label: "My Grades", icon: BarChart3 },
  { id: "resources", label: "Resources", icon: FolderOpen },
  { id: "messages", label: "Messages", icon: MessageSquare },
]

export function Navigation({ activeItem, onNavigate }: NavigationProps) {
  return (
    <nav className="border-b border-border bg-card">
      <div className="px-4 md:px-6">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap px-3 py-2 transition-all",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
