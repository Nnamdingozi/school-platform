// "use client"

// import {
//   Bar,
//   BarChart,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"
// import { AlertCircle } from "lucide-react"

// const topicScores = [
//   { topic: "Algebra", score: 78 },
//   { topic: "Geometry", score: 85 },
//   { topic: "Statistics", score: 72 },
//   { topic: "Quadratic", score: 68 },
//   { topic: "Indices", score: 82 },
// ]

// const completionData = [
//   { name: "Completed", value: 67, color: "#10b981" },
//   { name: "Remaining", value: 33, color: "#e5e7eb" },
// ]

// const studentsNeedingAttention = [
//   { name: "Adebayo O.", score: 45, trend: "down" },
//   { name: "Chioma E.", score: 48, trend: "stable" },
//   { name: "Ibrahim M.", score: 52, trend: "up" },
//   { name: "Fatima A.", score: 55, trend: "down" },
// ]

// export function PerformanceCharts() {
//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 h-[350px] w-full min-h-[350px]">
//       {/* Bar Chart - Average Score per Topic */}
//       <Card className="md:col-span-2 lg:col-span-1">
//         <CardHeader className="pb-2">
//           <CardTitle className="text-base font-semibold">Average Score per Topic</CardTitle>
//           <CardDescription>Performance across curriculum topics</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ChartContainer
//             config={{
//               score: {
//                 label: "Score",
//                 color: "#10b981",
//               },
//             }}
//             className="h-50 w-full"
//           >
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={topicScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
//                 <XAxis 
//                   dataKey="topic" 
//                   tick={{ fontSize: 11, fill: "#6b7280" }}
//                   axisLine={false}
//                   tickLine={false}
//                 />
//                 <YAxis 
//                   tick={{ fontSize: 11, fill: "#6b7280" }}
//                   axisLine={false}
//                   tickLine={false}
//                   domain={[0, 100]}
//                 />
//                 <ChartTooltip content={<ChartTooltipContent />} />
//                 <Bar 
//                   dataKey="score" 
//                   fill="#10b981"
//                   radius={[4, 4, 0, 0]}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </ChartContainer>
//         </CardContent>
//       </Card>

//       {/* Pie Chart - Curriculum Completion */}
//       <Card>
//         <CardHeader className="pb-2">
//           <CardTitle className="text-base font-semibold">Curriculum Completion</CardTitle>
//           <CardDescription>Term 2 progress overview</CardDescription>
//         </CardHeader>
//         <CardContent className="flex flex-col items-center">
//           <div className="relative h-40 w-40">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={completionData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={50}
//                   outerRadius={70}
//                   paddingAngle={2}
//                   dataKey="value"
//                   startAngle={90}
//                   endAngle={-270}
//                 >
//                   {completionData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="absolute inset-0 flex flex-col items-center justify-center">
//               <span className="text-3xl font-bold text-foreground">67%</span>
//               <span className="text-xs text-muted-foreground">Complete</span>
//             </div>
//           </div>
//           <div className="mt-2 flex items-center gap-4 text-sm">
//             <div className="flex items-center gap-1.5">
//               <div className="h-3 w-3 rounded-full bg-primary" />
//               <span className="text-muted-foreground">8 of 12 topics</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Students Needing Attention */}
//       <Card>
//         <CardHeader className="pb-2">
//           <div className="flex items-center gap-2">
//             <AlertCircle className="h-4 w-4 text-amber-500" />
//             <CardTitle className="text-base font-semibold">Students Needing Attention</CardTitle>
//           </div>
//           <CardDescription>Lowest performing students this term</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {studentsNeedingAttention.map((student) => (
//               <div key={student.name} className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
//                     {student.name.split(" ")[0][0]}{student.name.split(" ")[1][0]}
//                   </div>
//                   <span className="text-sm font-medium text-foreground">{student.name}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className={`text-sm font-semibold ${student.score < 50 ? "text-destructive" : "text-amber-500"}`}>
//                     {student.score}%
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


// components/TeacherDashboard/performance-charts.tsx
// "use client"

// import { useState, useEffect } from "react"
// import {
//   Bar,
//   BarChart,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"
// import { AlertCircle, CheckCircle2, UserCircle2, Loader2 } from "lucide-react"
// import { getPerformanceDashboardData, PerformanceDashboardData } from "@/app/actions/performance-data"
// import { toast } from "sonner"

// // Define props for the component
// interface PerformanceChartsProps {
//   gradeSubjectId: string; // The ID of the specific grade-subject (e.g., Math for JSS1)
//   schoolId: string;      // The ID of the school
//   // NEW PROPS for server-fetched data
//   initialPerformanceData?: PerformanceDashboardData | null;
//   initialPerformanceError?: string | null;
// }

// export function PerformanceCharts({ 
//   gradeSubjectId, 
//   schoolId, 
//   initialPerformanceData, // <-- New
//   initialPerformanceError // <-- New
// }: PerformanceChartsProps) {
//   // Initialize state with props, or null if not provided
//   const [data, setData] = useState<PerformanceDashboardData | null>(initialPerformanceData || null);
//   // isLoading is true only if no initial data/error was provided from server
//   const [isLoading, setIsLoading] = useState(!initialPerformanceData && !initialPerformanceError);
//   const [error, setError] = useState<string | null>(initialPerformanceError || null);

//   useEffect(() => {
//     // If initial data or error was provided from the server, we don't need to fetch on client
//     if (initialPerformanceData || initialPerformanceError) {
//       setIsLoading(false); // Ensure loading is off as data/error is already set
//       return;
//     }

//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null); // Clear previous errors
//       try {
//         const result = await getPerformanceDashboardData(gradeSubjectId, schoolId);
//         if (result.success && result.data) {
//           setData(result.data);
//         } else {
//           setError(result.error || "Failed to load dashboard data.");
//           toast.error(result.error || "Could not retrieve performance data.");
//         }
//       } catch (err) {
//         console.error("Error fetching performance data:", err);
//         setError("An unexpected error occurred while fetching data.");
//         toast.error("An unexpected error occurred.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     // Only fetch if IDs are provided AND no initial data/error was given
//     if (gradeSubjectId && schoolId && !initialPerformanceData && !initialPerformanceError) { 
//       fetchData();
//     } else if (!gradeSubjectId || !schoolId) {
//       // If IDs are missing and no initial data, show an error state
//       setIsLoading(false);
//       setError("Please select a Grade and Subject to view performance.");
//     }
//   }, [gradeSubjectId, schoolId, initialPerformanceData, initialPerformanceError]); // Re-run effect if these change

//   // Loading State UI
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-[350px] w-full bg-slate-50 rounded-lg">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
//         <span className="ml-3 text-slate-600">Loading performance data...</span>
//       </div>
//     );
//   }

//   // Error State UI
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[350px] w-full bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
//         <AlertCircle className="h-8 w-8 mb-3" />
//         <p className="text-center font-medium">{error}</p>
//         <p className="text-sm text-red-600 mt-1">Please ensure a valid subject and school are selected.</p>
//       </div>
//     );
//   }

//   // No Data Found UI (e.g., first-time setup or no assessments yet)
//   if (!data || (data.topicScores.length === 0 && data.studentsNeedingAttention.length === 0 && data.curriculumCompletion.totalTopics === 0)) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[350px] w-full bg-slate-50 border border-slate-200 text-slate-600 rounded-lg p-4">
//         <AlertCircle className="h-8 w-8 mb-3 text-slate-400" />
//         <p className="text-center font-medium">No performance data available yet.</p>
//         <p className="text-sm text-slate-500 mt-1">Start by creating lessons and assessments for this subject.</p>
//       </div>
//     );
//   }

//   // Destructure data for easier access (provide fallbacks for safety)
//   const topicScores = data.topicScores || [];
//   const completionData = data.curriculumCompletion.completionData || [];
//   const studentsNeedingAttention = data.studentsNeedingAttention || [];
//   const curriculumPercentage = data.curriculumCompletion.percentage || 0;
//   const completedTopicsCount = data.curriculumCompletion.completedTopics || 0;
//   const totalTopicsCount = data.curriculumCompletion.totalTopics || 0;

//   const PIE_COLORS = ["#10b981", "#e5e7eb"]; // Green for completed, light gray for remaining

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 h-[350px] w-full min-h-[350px]">
//       {/* Bar Chart - Average Score per Topic */}
//       <Card className="md:col-span-2 lg:col-span-1">
//         <CardHeader className="pb-2">
//           <CardTitle className="text-base font-semibold">Average Score per Topic</CardTitle>
//           <CardDescription>Performance across curriculum topics</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {topicScores.length > 0 ? (
//             <ChartContainer
//               config={{
//                 score: {
//                   label: "Score",
//                   color: "#10b981",
//                 },
//               }}
//               className="h-50 w-full"
//             >
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={topicScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
//                   <XAxis 
//                     dataKey="topic" 
//                     tick={{ fontSize: 11, fill: "#6b7280" }}
//                     axisLine={false}
//                     tickLine={false}
//                   />
//                   <YAxis 
//                     tick={{ fontSize: 11, fill: "#6b7280" }}
//                     axisLine={false}
//                     tickLine={false}
//                     domain={[0, 100]}
//                   />
//                   <ChartTooltip content={<ChartTooltipContent />} />
//                   <Bar 
//                     dataKey="score" 
//                     fill="#10b981"
//                     radius={[4, 4, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </ChartContainer>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-[200px] text-slate-500">
//               <AlertCircle className="h-6 w-6 mb-2" />
//               <p className="text-sm">No topic scores available.</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Pie Chart - Curriculum Completion */}
//       <Card>
//         <CardHeader className="pb-2">
//           <CardTitle className="text-base font-semibold">Curriculum Completion</CardTitle>
//           <CardDescription>Overall progress in this subject</CardDescription>
//         </CardHeader>
//         <CardContent className="flex flex-col items-center">
//           {totalTopicsCount > 0 ? (
//             <>
//               <div className="relative h-40 w-40">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={completionData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={50}
//                       outerRadius={70}
//                       paddingAngle={2}
//                       dataKey="value"
//                       startAngle={90}
//                       endAngle={-270}
//                     >
//                       {completionData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="absolute inset-0 flex flex-col items-center justify-center">
//                   <span className="text-3xl font-bold text-foreground">{curriculumPercentage}%</span>
//                   <span className="text-xs text-muted-foreground">Complete</span>
//                 </div>
//               </div>
//               <div className="mt-2 flex items-center gap-4 text-sm">
//                 <div className="flex items-center gap-1.5">
//                   <div className="h-3 w-3 rounded-full bg-primary" />
//                   <span className="text-muted-foreground">{completedTopicsCount} of {totalTopicsCount} topics</span>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-[200px] text-slate-500">
//               <AlertCircle className="h-6 w-6 mb-2" />
//               <p className="text-sm">No topics defined for this subject.</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Students Needing Attention */}
//       <Card>
//         <CardHeader className="pb-2">
//           <div className="flex items-center gap-2">
//             <AlertCircle className="h-4 w-4 text-amber-500" />
//             <CardTitle className="text-base font-semibold">Students Needing Attention</CardTitle>
//           </div>
//           <CardDescription>Lowest performing students in this subject</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {studentsNeedingAttention.length > 0 ? (
//             <div className="space-y-3">
//               {studentsNeedingAttention.map((student) => (
//                 <div key={student.name} className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
//                       {student.name.split(" ")[0][0]}{student.name.split(" ").length > 1 ? student.name.split(" ")[1][0] : ''}
//                     </div>
//                     <span className="text-sm font-medium text-foreground">{student.name}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className={`text-sm font-semibold ${student.score < 50 ? "text-red-500" : "text-amber-500"}`}>
//                       {student.score}%
//                     </span>
//                     {/* Optional: Trend icon based on student.trend */}
//                     {/* {student.trend === "down" && <ArrowDown className="h-4 w-4 text-red-500" />} */}
//                     {/* {student.trend === "up" && <ArrowUp className="h-4 w-4 text-emerald-500" />} */}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-[200px] text-slate-500">
//               <CheckCircle2 className="h-6 w-6 mb-2 text-emerald-500" />
//               <p className="text-sm">All students performing well or no assessments yet!</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// components/TeacherDashboard/performance-charts.tsx
"use client"

import { useState, useEffect } from "react"
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
import { AlertCircle, CheckCircle2, UserCircle2, Loader2 } from "lucide-react"
// REMOVED: import { getPerformanceDashboardData, PerformanceDashboardData } from "@/app/actions/performance-data"
import type { PerformanceDashboardData } from "@/app/actions/performance-data" // <--- Import only the TYPE
import { toast } from "sonner"

interface PerformanceChartsProps {
  gradeSubjectId: string;
  schoolId: string;
  initialPerformanceData?: PerformanceDashboardData | null;
  initialPerformanceError?: string | null;
}

export function PerformanceCharts({ 
  gradeSubjectId, 
  schoolId, 
  initialPerformanceData,
  initialPerformanceError
}: PerformanceChartsProps) {
  const [data, setData] = useState<PerformanceDashboardData | null>(initialPerformanceData || null);
  const [isLoading, setIsLoading] = useState(!initialPerformanceData && !initialPerformanceError);
  const [error, setError] = useState<string | null>(initialPerformanceError || null);

  useEffect(() => {
    if (initialPerformanceData || initialPerformanceError) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!gradeSubjectId || !schoolId) {
          throw new Error("Missing gradeSubjectId or schoolId to fetch data.");
        }

        // --- NEW: Call the API Route instead of the server action directly ---
        const response = await fetch(`/api/performance/${gradeSubjectId}/${schoolId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const resultData: PerformanceDashboardData = await response.json();
        // --- END NEW ---

        setData(resultData); // Directly set the data from the API
        
      } catch (err: any) { // Type 'any' for unknown error object
        console.error("Error fetching performance data:", err);
        setError(err.message || "An unexpected error occurred while fetching data.");
        toast.error(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    if (gradeSubjectId && schoolId && !initialPerformanceData && !initialPerformanceError) { 
      fetchData();
    } else if (!gradeSubjectId || !schoolId) {
      setIsLoading(false);
      setError("Please select a Grade and Subject to view performance.");
    }
  }, [gradeSubjectId, schoolId, initialPerformanceData, initialPerformanceError]);

  // ... (rest of the component remains the same) ...

  if (isLoading) { /* ... */ }
  if (error) { /* ... */ }
  if (!data || (data.topicScores.length === 0 && data.studentsNeedingAttention.length === 0 && data.curriculumCompletion.totalTopics === 0)) { /* ... */ }

  const topicScores = data?.topicScores || [];
  const completionData = data?.curriculumCompletion?.completionData || [];
  const studentsNeedingAttention = data?.studentsNeedingAttention || [];
  const curriculumPercentage = data?.curriculumCompletion?.percentage || 0;
  const completedTopicsCount = data?.curriculumCompletion?.completedTopics || 0;
  const totalTopicsCount = data?.curriculumCompletion?.totalTopics || 0;

  const PIE_COLORS = ["#10b981", "#e5e7eb"];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 h-[350px] w-full min-h-[350px]">
      {/* Bar Chart - Average Score per Topic */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Average Score per Topic</CardTitle>
          <CardDescription>Performance across curriculum topics</CardDescription>
        </CardHeader>
        <CardContent>
          {topicScores.length > 0 ? (
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
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-slate-500">
              <AlertCircle className="h-6 w-6 mb-2" />
              <p className="text-sm">No topic scores available.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pie Chart - Curriculum Completion */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Curriculum Completion</CardTitle>
          <CardDescription>Overall progress in this subject</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {totalTopicsCount > 0 ? (
            <>
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
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">{curriculumPercentage}%</span>
                  <span className="text-xs text-muted-foreground">Complete</span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{completedTopicsCount} of {totalTopicsCount} topics</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-slate-500">
              <AlertCircle className="h-6 w-6 mb-2" />
              <p className="text-sm">No topics defined for this subject.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Students Needing Attention */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base font-semibold">Students Needing Attention</CardTitle>
          </div>
          <CardDescription>Lowest performing students in this subject</CardDescription>
        </CardHeader>
        <CardContent>
          {studentsNeedingAttention.length > 0 ? (
            <div className="space-y-3">
              {studentsNeedingAttention.map((student) => (
                <div key={student.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {student.name.split(" ")[0][0]}{student.name.split(" ").length > 1 ? student.name.split(" ")[1][0] : ''}
                    </div>
                    <span className="text-sm font-medium text-foreground">{student.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${student.score < 50 ? "text-red-500" : "text-amber-500"}`}>
                      {student.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-slate-500">
              <CheckCircle2 className="h-6 w-6 mb-2 text-emerald-500" />
              <p className="text-sm">All students performing well or no assessments yet!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}