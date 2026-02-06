"use client"

import { ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"

const subjects = [
  { id: 1, name: "JSS 1 Mathematics", students: 45 },
  { id: 2, name: "JSS 2 Mathematics", students: 42 },
  { id: 3, name: "JSS 3 Mathematics", students: 38 },
]

export function DashboardHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <div>
          <h1 className="text-lg font-semibold text-foreground md:text-xl">
            Good morning, Teacher Sarah
          </h1>
          <p className="text-sm text-muted-foreground">
            {"Let's make today a great learning day!"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <span className="hidden sm:inline">JSS 1 Mathematics</span>
              <span className="sm:hidden">JSS 1</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {subjects.map((subject) => (
              <DropdownMenuItem key={subject.id} className="flex justify-between">
                <span>{subject.name}</span>
                <span className="text-xs text-muted-foreground">{subject.students} students</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Quick Create</span>
        </Button>
      </div>
    </header>
  )
}
