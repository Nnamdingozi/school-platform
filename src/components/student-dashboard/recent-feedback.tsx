"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, FileText, ThumbsUp, Star } from "lucide-react"

interface Feedback {
  id: string
  teacher: {
    name: string
    avatar?: string
    subject: string
  }
  message: string
  type: "praise" | "suggestion" | "grade"
  date: string
  assignment?: string
}

const feedbacks: Feedback[] = [
  {
    id: "1",
    teacher: {
      name: "Mrs. Adebayo",
      subject: "Mathematics",
    },
    message: "Excellent work on your fractions test! Your problem-solving skills have improved significantly.",
    type: "praise",
    date: "Today",
    assignment: "Fractions Test",
  },
  {
    id: "2",
    teacher: {
      name: "Mr. Okonkwo",
      subject: "English",
    },
    message: "Good effort on your essay. Try to add more descriptive language in your next writing.",
    type: "suggestion",
    date: "Yesterday",
    assignment: "Creative Writing",
  },
  {
    id: "3",
    teacher: {
      name: "Dr. Ibrahim",
      subject: "Science",
    },
    message: "You scored 85% on the Science Quiz. Keep up the great work!",
    type: "grade",
    date: "2 days ago",
    assignment: "Chapter 4 Quiz",
  },
]

const typeIcons = {
  praise: ThumbsUp,
  suggestion: MessageCircle,
  grade: Star,
}

const typeColors = {
  praise: "bg-success/10 text-success",
  suggestion: "bg-primary/10 text-primary",
  grade: "bg-warning/10 text-warning-foreground",
}

export function RecentFeedback() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5 text-primary" />
            Recent Feedback
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <FileText className="h-4 w-4" />
            View Report Card
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedbacks.map((feedback) => {
          const TypeIcon = typeIcons[feedback.type]
          const initials = feedback.teacher.name
            .split(" ")
            .map((n) => n[0])
            .join("")

          return (
            <div
              key={feedback.id}
              className="rounded-lg border border-border p-4 transition-all hover:border-primary/30 hover:bg-muted/30"
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={feedback.teacher.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h4 className="font-medium text-sm text-foreground">
                        {feedback.teacher.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {feedback.teacher.subject}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${typeColors[feedback.type]}`}>
                        <TypeIcon className="h-3 w-3" />
                      </div>
                      <span className="text-xs text-muted-foreground">{feedback.date}</span>
                    </div>
                  </div>
                  {feedback.assignment && (
                    <Badge variant="secondary" className="mb-2 text-[10px]">
                      {feedback.assignment}
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feedback.message}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
