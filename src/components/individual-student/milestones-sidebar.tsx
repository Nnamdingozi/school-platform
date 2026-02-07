'use client'

import { Lock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Milestone {
  id: string
  level: number
  title: string
  icon: string
  unlocked: boolean
  pointsRequired: number
}

interface MilestonesSidebarProps {
  milestones: Milestone[]
  currentPoints: number
}

export function MilestonesSidebar({ milestones, currentPoints }: MilestonesSidebarProps) {
  return (
    <aside className="space-y-4">
      <div className="sticky top-20">
        <Card className="border-0 bg-linear-to-b from-primary/5 to-secondary/5 p-6">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-foreground">
            <span className="text-2xl">🏆</span>
            Achievements
          </h3>

          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={cn(
                  'rounded-lg p-4 transition-all duration-300',
                  milestone.unlocked
                    ? 'bg-primary/10 ring-2 ring-primary'
                    : 'bg-muted/30 opacity-75'
                )}
              >
                {/* Icon and Title */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-lg text-xl',
                        milestone.unlocked
                          ? 'bg-primary/20'
                          : 'bg-muted/50'
                      )}
                    >
                      {milestone.unlocked ? milestone.icon : '🔒'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Level {milestone.level}
                      </p>
                      <p className="font-semibold text-foreground">{milestone.title}</p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                {!milestone.unlocked && (
                  <div className="text-xs text-muted-foreground">
                    Unlock at {milestone.pointsRequired.toLocaleString()} points
                  </div>
                )}

                {milestone.unlocked && (
                  <div className="text-xs font-semibold text-primary">✓ Unlocked</div>
                )}
              </div>
            ))}
          </div>

          {/* Progress to Next Milestone */}
          <div className="mt-6 rounded-lg bg-accent/20 p-4">
            <p className="text-xs text-muted-foreground mb-2">Next milestone in</p>
            <p className="text-sm font-bold text-accent">
              {Math.max(0, 1000 - currentPoints).toLocaleString()} points
            </p>
          </div>
        </Card>
      </div>
    </aside>
  )
}
