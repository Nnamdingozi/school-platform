"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { AlertCircle } from "lucide-react"

const topicScores = [
  { topic: "Algebra", score: 78 },
  { topic: "Geometry", score: 85 },
  { topic: "Statistics", score: 72 },
  { topic: "Quadratic", score: 68 },
  { topic: "Indices", score: 82 },
]

const completionData = [
  { name: "Completed", value: 67, color: "#10b981" },
  { name: "Remaining", value: 33, color: "#e5e7eb" },
]

const studentsNeedingAttention = [
  { name: "Adebayo O.", score: 45, trend: "down" },
  { name: "Chioma E.", score: 48, trend: "stable" },
  { name: "Ibrahim M.", score: 52, trend: "up" },
  { name: "Fatima A.", score: 55, trend: "down" },
]

export function PerformanceCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Bar Chart - Average Score per Topic */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Average Score per Topic</CardTitle>
          <CardDescription>Performance across curriculum topics</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              score: {
                label: "Score",
                color: "#10b981",
              },
            }}
            className="h-50 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="topic" 
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="score" 
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Pie Chart - Curriculum Completion */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Curriculum Completion</CardTitle>
          <CardDescription>Term 2 progress overview</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="relative h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">67%</span>
              <span className="text-xs text-muted-foreground">Complete</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">8 of 12 topics</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Needing Attention */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base font-semibold">Students Needing Attention</CardTitle>
          </div>
          <CardDescription>Lowest performing students this term</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentsNeedingAttention.map((student) => (
              <div key={student.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {student.name.split(" ")[0][0]}{student.name.split(" ")[1][0]}
                  </div>
                  <span className="text-sm font-medium text-foreground">{student.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${student.score < 50 ? "text-destructive" : "text-amber-500"}`}>
                    {student.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
