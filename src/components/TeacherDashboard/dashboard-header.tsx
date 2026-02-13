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

type SubjectOption = {
  id: string
  /**
   * Pre-formatted label, e.g. "[Grade Name] [Subject Name]"
   */
  displayName: string
  studentCount: number
}

interface DashboardHeaderProps {
  teacherName: string
  subjects: SubjectOption[]
}

export function DashboardHeader({ teacherName, subjects }: DashboardHeaderProps) {
  const hasSubjects = subjects.length > 0
  const currentSubject = hasSubjects ? subjects[0] : null

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <div>
          <h1 className="text-lg font-semibold text-foreground md:text-xl">
            Good morning, {teacherName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {"Let's make today a great learning day!"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              disabled={!hasSubjects}
            >
              <span className="hidden sm:inline">
                {currentSubject ? currentSubject.displayName : "No subjects assigned"}
              </span>
              <span className="sm:hidden">
                {currentSubject ? currentSubject.displayName : "No subjects"}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {hasSubjects ? (
              subjects.map((subject) => (
                <DropdownMenuItem key={subject.id} className="flex justify-between">
                  <span>{subject.displayName}</span>
                  <span className="text-xs text-muted-foreground">
                    {subject.studentCount} students
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem className="flex justify-between">
                <span>No subjects assigned</span>
              </DropdownMenuItem>
            )}
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
