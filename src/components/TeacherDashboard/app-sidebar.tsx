"use client"

import {
  Calendar,
  School,
  Sparkles,
  BookOpen,
  MessageCircle,
  GraduationCap,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const menuItems = [
  {
    title: "My Schedule",
    icon: Calendar,
    isActive: false,
  },
  {
    title: "Classrooms",
    icon: School,
    isActive: false,
  },
  {
    title: "AI Lesson Planner",
    icon: Sparkles,
    isActive: true,
  },
  {
    title: "Gradebook",
    icon: BookOpen,
    isActive: false,
  },
  {
    title: "Parent Communication",
    icon: MessageCircle,
    isActive: false,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">EduAI</span>
            <span className="text-xs text-sidebar-foreground/60">Teacher Portal</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.isActive}
                    tooltip={item.title}
                    className="gap-3"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.title === "Parent Communication" && (
                      <span className="ml-auto text-[10px] font-medium text-sidebar-foreground/60">
                        WhatsApp
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Teacher Sarah" />
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
              TS
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">Teacher Sarah</span>
            <span className="text-xs text-sidebar-foreground/60">Mathematics Dept.</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
