'use client'

import { Flame, Star } from 'lucide-react'

interface HeaderProps {
  userName: string
  streak: number
  learningPoints: number
}

export function DashboardHeader({ userName, streak, learningPoints }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Keep it up, <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{userName}</span>!
          </h1>
        </div>

        <div className="flex items-center gap-8">
          {/* Streak */}
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-orange-50 p-3 dark:bg-orange-950">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Streak</p>
              <p className="font-bold text-foreground">{streak} Days</p>
            </div>
          </div>

          {/* Learning Points */}
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-accent/10 p-3">
              <Star className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Learning Points</p>
              <p className="font-bold text-foreground">{learningPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
