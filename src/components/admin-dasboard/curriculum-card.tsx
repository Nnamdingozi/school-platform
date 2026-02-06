"use client"

import { useState } from "react"
import { BookOpen, Calendar, CheckCircle2, ChevronDown, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const curriculumOptions = [
  {
    id: "british",
    name: "British National",
    description: "National Curriculum of England and Wales",
    subjects: 24,
    objectives: 156,
  },
  {
    id: "nigerian",
    name: "Nigerian National",
    description: "Federal Ministry of Education Curriculum",
    subjects: 18,
    objectives: 132,
  },
  {
    id: "cambridge",
    name: "Cambridge IGCSE",
    description: "Cambridge International Examinations",
    subjects: 22,
    objectives: 178,
  },
  {
    id: "american",
    name: "American Common Core",
    description: "US State Standards Initiative",
    subjects: 20,
    objectives: 145,
  },
]

export function CurriculumCard() {
  const [selectedCurriculum, setSelectedCurriculum] = useState(curriculumOptions[0])

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Curriculum Status
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 bg-transparent">
                <span className="text-xs">Switch</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {curriculumOptions.map((curriculum) => (
                <DropdownMenuItem
                  key={curriculum.id}
                  onClick={() => setSelectedCurriculum(curriculum)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{curriculum.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {curriculum.subjects} subjects
                    </span>
                  </div>
                  {selectedCurriculum.id === curriculum.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Curriculum */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground">{selectedCurriculum.name}</h4>
                <Badge className="bg-accent/15 text-accent hover:bg-accent/25 border-0 text-xs">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedCurriculum.description}
              </p>
            </div>
          </div>
        </div>

        {/* Current Term */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Current Term</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="font-semibold text-foreground">Term 2</p>
              <p className="text-xs text-muted-foreground">Jan 8 - Apr 12, 2026</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              Week 5 of 14
            </Badge>
          </div>
        </div>

        {/* Term Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Term Progress</span>
            <span className="font-medium text-foreground">36%</span>
          </div>
          {/* <Progress value={36} className="h-2" /> */}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{selectedCurriculum.subjects}</p>
            <p className="text-xs text-muted-foreground">Subjects</p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{selectedCurriculum.objectives}</p>
            <p className="text-xs text-muted-foreground">Learning Objectives</p>
          </div>
        </div>

        {/* Curriculum Compliance */}
        <div className="flex items-center gap-2 rounded-lg bg-accent/10 p-3">
          <CheckCircle2 className="h-5 w-5 text-accent" />
          <div>
            <p className="text-sm font-medium text-foreground">Compliance Status</p>
            <p className="text-xs text-muted-foreground">
              All curriculum requirements are being met
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
