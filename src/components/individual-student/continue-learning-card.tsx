'use client'
import { ChevronRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface ContinueLearningCardProps {
  topic: string
  subject: string
  progress: number
  nextUp: string
  image?: string
}

export function ContinueLearningCard({
  topic,
  subject,
  progress,
  nextUp,
  image,
}: ContinueLearningCardProps) {
  return (
    <Card className="overflow-hidden border-0 bg-linaer-to-br from-blue-500 via-blue-600 to-cyan-500 shadow-lg">
      <div className="flex items-center gap-6 p-8">
        {/* Left Content */}
        <div className="flex-1">
          <p className="mb-2 text-sm font-semibold text-primary-foreground/80 uppercase tracking-wider">
            {subject}
          </p>
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground">{topic}</h2>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium text-primary-foreground/90">Progress</span>
              <span className="text-sm font-bold text-primary-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-primary-foreground/20" />
          </div>

          <p className="mb-6 text-primary-foreground/80">
            Next up: <span className="font-semibold">{nextUp}</span>
          </p>

          <Button
            className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            size="lg"
          >
            <Play className="h-4 w-4" />
            Continue Learning
          </Button>
        </div>

        {/* Right Illustration */}
        <div className="hidden lg:flex lg:flex-1 items-center justify-center">
          <div className="relative h-48 w-48 rounded-2xl bg-primary-foreground/10 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-5xl">📚</div>
              <p className="text-sm font-semibold text-primary-foreground">{progress}% Complete</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
