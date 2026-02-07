'use client'

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface SubjectCardProps {
  name: string
  icon: string
  completion: number
  color: 'blue' | 'cyan' | 'pink' | 'yellow'
}

const colorClasses = {
  blue: 'from-blue-400 to-blue-600',
  cyan: 'from-cyan-400 to-cyan-600',
  pink: 'from-pink-400 to-pink-600',
  yellow: 'from-yellow-400 to-yellow-600',
}

const bgColorClasses = {
  blue: 'bg-blue-50 dark:bg-blue-950',
  cyan: 'bg-cyan-50 dark:bg-cyan-950',
  pink: 'bg-pink-50 dark:bg-pink-950',
  yellow: 'bg-yellow-50 dark:bg-yellow-950',
}

export function SubjectCard({ name, icon, completion, color }: SubjectCardProps) {
  return (
    <Card className="group cursor-pointer overflow-hidden border-0 transition-all duration-300 hover:shadow-lg hover:scale-105">
      <div className={cn('p-6', bgColorClasses[color])}>
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-3xl">{icon}</span>
          <span className="inline-block rounded-full bg-white/20 px-2 py-1 text-xs font-bold text-foreground">
            {completion}%
          </span>
        </div>

        {/* Subject Name */}
        <h3 className="mb-4 text-lg font-bold text-foreground">{name}</h3>

        {/* Progress Bar */}
        <Progress value={completion} className="h-2" />

        {/* Bottom Text */}
        <p className="mt-3 text-xs text-muted-foreground">
          {completion === 100 ? '🎉 Completed!' : `${100 - completion}% to go`}
        </p>
      </div>
    </Card>
  )
}
