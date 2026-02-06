"use client"
import { Users, GraduationCap, ClipboardCheck, MessageCircle, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Total Students",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Users,
    description: "from last term",
  },
  {
    title: "Active Teachers",
    value: "68",
    change: "+3",
    trend: "up",
    icon: GraduationCap,
    description: "new this month",
  },
  {
    title: "Assessment Completion",
    value: "87.3%",
    change: "+5.2%",
    trend: "up",
    icon: ClipboardCheck,
    description: "vs last month",
  },
  {
    title: "WhatsApp Feedback",
    value: "342",
    change: "-8%",
    trend: "down",
    icon: MessageCircle,
    description: "sent this month",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown

        return (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-foreground tracking-tight">
                      {stat.value}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendIcon
                      className={`h-3 w-3 ${
                        stat.trend === "up" ? "text-accent" : "text-destructive"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        stat.trend === "up" ? "text-accent" : "text-destructive"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stat.description}
                    </span>
                  </div>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
