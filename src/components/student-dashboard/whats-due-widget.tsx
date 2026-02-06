"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, Calculator, FlaskConical, BookMarked } from "lucide-react"

interface Assignment {
  id: string
  title: string
  subject: string
  dueDate: string
  dueTime: string
  type: "assignment" | "quiz" | "project"
  urgent?: boolean
}

const assignments: Assignment[] = [
  {
    id: "1",
    title: "Fractions Worksheet",
    subject: "Mathematics",
    dueDate: "Today",
    dueTime: "3:00 PM",
    type: "assignment",
    urgent: true,
  },
  {
    id: "2",
    title: "Chapter 5 Quiz",
    subject: "Science",
    dueDate: "Tomorrow",
    dueTime: "10:00 AM",
    type: "quiz",
  },
  {
    id: "3",
    title: "Book Report",
    subject: "English",
    dueDate: "Feb 7",
    dueTime: "11:59 PM",
    type: "project",
  },
  {
    id: "4",
    title: "Lab Report",
    subject: "Science",
    dueDate: "Feb 10",
    dueTime: "2:00 PM",
    type: "assignment",
  },
]

const subjectIcons: Record<string, typeof Calculator> = {
  Mathematics: Calculator,
  Science: FlaskConical,
  English: BookMarked,
}

const typeStyles: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
  assignment: { variant: "secondary", label: "Assignment" },
  quiz: { variant: "default", label: "Quiz" },
  project: { variant: "outline", label: "Project" },
}

export function WhatsDueWidget() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            {"What's Due"}
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {assignments.map((assignment) => {
          const SubjectIcon = subjectIcons[assignment.subject] || FileText
          const typeStyle = typeStyles[assignment.type]

          return (
            <div
              key={assignment.id}
              className="group flex items-start gap-3 rounded-lg border border-border p-3 transition-all hover:border-primary/30 hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <SubjectIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-foreground text-sm leading-tight">
                      {assignment.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{assignment.subject}</p>
                  </div>
                  <Badge variant={typeStyle.variant} className="shrink-0 text-[10px]">
                    {typeStyle.label}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className={`flex items-center gap-1 ${assignment.urgent ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                    <Clock className="h-3 w-3" />
                    {assignment.dueDate}, {assignment.dueTime}
                  </span>
                  {assignment.urgent && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                      Due Soon
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
