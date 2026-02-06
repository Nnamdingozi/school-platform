"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts"

// Student distribution by grade data
const gradeDistributionData = [
  { name: "JSS 1", value: 245, fill: "var(--chart-1)" },
  { name: "JSS 2", value: 218, fill: "var(--chart-2)" },
  { name: "JSS 3", value: 196, fill: "var(--chart-3)" },
  { name: "SSS 1", value: 234, fill: "var(--chart-4)" },
  { name: "SSS 2", value: 187, fill: "var(--chart-5)" },
  { name: "SSS 3", value: 167, fill: "var(--chart-1)" },
]

// Assessment scores by subject
const assessmentScoresData = [
  { subject: "Math", average: 72, highest: 95 },
  { subject: "English", average: 78, highest: 92 },
  { subject: "Science", average: 68, highest: 88 },
  { subject: "Social St.", average: 81, highest: 94 },
  { subject: "French", average: 65, highest: 89 },
]

// Monthly enrollment trend
const enrollmentTrendData = [
  { month: "Sep", students: 1180 },
  { month: "Oct", students: 1195 },
  { month: "Nov", students: 1210 },
  { month: "Dec", students: 1205 },
  { month: "Jan", students: 1232 },
  { month: "Feb", students: 1247 },
]

// Student status distribution for pie chart
const statusDistributionData = [
  { name: "Active", value: 1142, fill: "var(--chart-2)" },
  { name: "Inactive", value: 68, fill: "var(--muted-foreground)" },
  { name: "Probation", value: 37, fill: "var(--chart-5)" },
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; payload?: { fill?: string } }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-muted-foreground">
            {entry.name}: <span className="font-semibold text-foreground">{entry.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

const PieTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload?: { fill?: string } }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">
          Students: <span className="font-semibold text-foreground">{payload[0].value}</span>
        </p>
      </div>
    )
  }
  return null
}

export function GradeDistributionChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">Students by Grade</CardTitle>
        <CardDescription>Distribution across all grade levels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gradeDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {gradeDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatusDistributionChart() {
  const total = statusDistributionData.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">Student Status</CardTitle>
        <CardDescription>Current enrollment status breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {statusDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex justify-center gap-4">
          {statusDistributionData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-xs text-muted-foreground">
                {item.name} ({Math.round((item.value / total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function AssessmentScoresChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">Assessment Performance</CardTitle>
        <CardDescription>Average and highest scores by subject</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assessmentScoresData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="subject" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                formatter={(value) => <span className="text-xs text-muted-foreground capitalize">{value}</span>}
              />
              <Bar 
                dataKey="average" 
                fill="var(--chart-1)" 
                radius={[4, 4, 0, 0]}
                name="Average Score"
              />
              <Bar 
                dataKey="highest" 
                fill="var(--chart-2)" 
                radius={[4, 4, 0, 0]}
                name="Highest Score"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function EnrollmentTrendChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">Enrollment Trend</CardTitle>
        <CardDescription>Student enrollment over the current academic year</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={enrollmentTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                domain={['dataMin - 20', 'dataMax + 20']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="students" 
                stroke="var(--chart-1)" 
                strokeWidth={2}
                dot={{ fill: "var(--chart-1)", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "var(--chart-1)" }}
                name="Students"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
