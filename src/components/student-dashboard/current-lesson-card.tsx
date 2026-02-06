"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, BookOpen, Users, Clock } from "lucide-react"

interface CurrentLessonProps {
  topic: string
  subject: string
  term: string
  progress: number
  studentsOnline: number
  duration: string
  isLive?: boolean
}

export function CurrentLessonCard({
  topic = "Fractions",
  subject = "Math",
  term = "Term 1",
  progress = 45,
  studentsOnline = 24,
  duration = "45 min",
  isLive = true,
}: Partial<CurrentLessonProps>) {
  return (
    <Card className="overflow-hidden">
      {/* Live indicator bar */}
      {isLive && (
        <div className="h-1 bg-success" />
      )}
      
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              {isLive && (
                <Badge className="bg-success text-success-foreground gap-1.5 px-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-foreground/60"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success-foreground"></span>
                  </span>
                  Live Now
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {term} {subject}
              </Badge>
            </div>

            {/* Topic */}
            <h3 className="text-xl font-semibold text-foreground mb-1">
              {topic}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Currently being taught in your classroom
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {studentsOnline} online
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {duration}
              </span>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Lesson Progress</span>
                <span className="font-medium text-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Illustration */}
          <div className="hidden sm:flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
        </div>

        {/* Action */}
        <Button className="w-full mt-5 gap-2" size="lg">
          <Play className="h-4 w-4" />
          Join Lesson
        </Button>
      </CardContent>
    </Card>
  )
}
