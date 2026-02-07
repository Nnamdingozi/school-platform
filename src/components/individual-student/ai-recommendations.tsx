'use client'

import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Recommendation {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string
}

interface AIRecommendationsProps {
  recommendations: Recommendation[]
}

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200',
  Intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
  Advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200',
}

export function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  return (
    <section>
      <div className="mb-6 flex items-center gap-2">
        <Zap className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Suggested for You</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="border-0 transition-all duration-300 hover:shadow-lg">
            <div className="p-6">
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <h3 className="flex-1 text-lg font-bold text-foreground">{rec.title}</h3>
              </div>

              {/* Description */}
              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{rec.description}</p>

              {/* Metadata */}
              <div className="mb-4 flex items-center gap-2">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${difficultyColors[rec.difficulty]}`}>
                  {rec.difficulty}
                </span>
                <span className="text-xs text-muted-foreground">⏱️ {rec.estimatedTime}</span>
              </div>

              {/* CTA */}
              <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                Start Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
