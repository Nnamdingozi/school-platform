"use client"

import { useState } from "react"
import { Sparkles, Video, FileText, HelpCircle, ChevronRight, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const lessonContent = {
  videoScript: {
    title: "Video Script: Introduction to Quadratic Equations",
    content: `Welcome to today's lesson on Quadratic Equations! 

A quadratic equation is a polynomial equation of degree 2, typically written in the form ax² + bx + c = 0, where a ≠ 0.

Today we'll cover:
1. Recognizing quadratic equations
2. Solving by factorization
3. Using the quadratic formula
4. Real-world applications`,
    duration: "12 min",
  },
  summary: {
    title: "Topic Summary",
    content: `Key Concepts:
• Standard form: ax² + bx + c = 0
• Factorization method for simple equations
• Quadratic formula: x = (-b ± √(b²-4ac)) / 2a
• Discriminant determines nature of roots

Learning Objectives:
✓ Identify quadratic equations
✓ Apply factorization techniques
✓ Use the quadratic formula correctly`,
  },
  quiz: {
    title: "Quick Assessment Quiz",
    questions: [
      "Solve: x² - 5x + 6 = 0",
      "What is the discriminant of 2x² + 3x - 1 = 0?",
      "Factor: x² - 9",
    ],
  },
}

export function AILessonPlanner() {
  const [activeTab, setActiveTab] = useState<"video" | "summary" | "quiz">("video")
  const [isGenerated, setIsGenerated] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-semibold">AI Lesson Planner</CardTitle>
          </div>
          {!isGenerated && (
            <Button size="sm" onClick={() => setIsGenerated(true)}>
              Generate Content
            </Button>
          )}
          {isGenerated && (
            <Badge className="gap-1 bg-primary/10 text-primary">
              <Check className="h-3 w-3" />
              Generated
            </Badge>
          )}
        </div>
        <CardDescription>
          AI-generated content for: Quadratic Equations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isGenerated ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Ready to Generate</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Click the button above to generate a video script, summary, and quiz for the current topic.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-2">
              <Button
                variant={activeTab === "video" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("video")}
                className="gap-1.5"
              >
                <Video className="h-3.5 w-3.5" />
                Video Script
              </Button>
              <Button
                variant={activeTab === "summary" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("summary")}
                className="gap-1.5"
              >
                <FileText className="h-3.5 w-3.5" />
                Summary
              </Button>
              <Button
                variant={activeTab === "quiz" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("quiz")}
                className="gap-1.5"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Quiz
              </Button>
            </div>

            {/* Content */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              {activeTab === "video" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{lessonContent.videoScript.title}</h4>
                    <Badge variant="secondary">{lessonContent.videoScript.duration}</Badge>
                  </div>
                  <p className="whitespace-pre-line text-sm text-muted-foreground">
                    {lessonContent.videoScript.content}
                  </p>
                </div>
              )}
              {activeTab === "summary" && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">{lessonContent.summary.title}</h4>
                  <p className="whitespace-pre-line text-sm text-muted-foreground">
                    {lessonContent.summary.content}
                  </p>
                </div>
              )}
              {activeTab === "quiz" && (
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">{lessonContent.quiz.title}</h4>
                  <div className="space-y-2">
                    {lessonContent.quiz.questions.map((question, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-md border border-border bg-card p-3"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                          {index + 1}
                        </span>
                        <span className="text-sm text-foreground">{question}</span>
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
