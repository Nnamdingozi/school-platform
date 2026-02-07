'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AchievementBadgeProps {
  title: string
  description: string
  icon: string
  earnedAt: string
  rarity: 'common' | 'rare' | 'epic'
}

const rarityColors = {
  common: 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600',
  rare: 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700',
  epic: 'bg-purple-100 border-purple-300 dark:bg-purple-900 dark:border-purple-700',
}

const rarityTextColors = {
  common: 'text-gray-700 dark:text-gray-300',
  rare: 'text-blue-700 dark:text-blue-300',
  epic: 'text-purple-700 dark:text-purple-300',
}

export function AchievementBadge({
  title,
  description,
  icon,
  earnedAt,
  rarity,
}: AchievementBadgeProps) {
  return (
    <Card className={cn('border-2 p-4', rarityColors[rarity])}>
      <div className="flex items-center gap-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <h3 className={cn('font-bold', rarityTextColors[rarity])}>{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">Earned {earnedAt}</p>
        </div>
      </div>
    </Card>
  )
}
