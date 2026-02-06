"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, CheckCircle2, Clock, Award } from "lucide-react"

interface Stat {
  label: string
  value: string
  icon: typeof TrendingUp
  trend?: string
  trendUp?: boolean
}

const stats: Stat[] = [
  {
    label: "Average Grade",
    value: "B+",
    icon: TrendingUp,
    trend: "+5%",
    trendUp: true,
  },
  {
    label: "Completed",
    value: "12/15",
    icon: CheckCircle2,
  },
  {
    label: "Pending",
    value: "3",
    icon: Clock,
  },
  {
    label: "Achievements",
    value: "8",
    icon: Award,
  },
]

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                {stat.trend && (
                  <span className={`text-xs font-medium ${stat.trendUp ? "text-success" : "text-destructive"}`}>
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
