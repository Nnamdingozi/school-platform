// // 'use client';

// // import Link from "next/link";
// // import { DashboardHeader } from "@/components/TeacherDashboard/dashboard-header";
// // import { ActiveTopicCard } from "@/components/TeacherDashboard/active-topic-card";
// // import { PerformanceCharts } from "@/components/TeacherDashboard/performance-charts";
// // import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner";
// // import { WhatsAppStatus } from "@/components/TeacherDashboard/whatsapp-status";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { useSchool } from "@/context/schoolProvider";
// // import { useSearchParams } from "next/navigation";
// // import { useEffect, useState } from "react";
// // import { getPerformanceDashboardData } from "@/app/actions/performance-data";
// // // ✅ FIX 1: Removed unused 'Assessment' import
// // import { ProfileInStore } from "@/types/profile";
// // import { PerformanceDashboardData } from "@/types/performanceData";
// // // ✅ FIX 2: Import the correct type from the planner component
// // import type { EnhancedLessonContent } from "./ai-learning-planner"; 

// // import { isTeacherProfile } from '@/types/profile'

// // const { profile } = useProfileStore()

// // // Narrow to ProfileInStore before accessing teacher-specific fields
// // if (!isTeacherProfile(profile)) return null

// // // Now TypeScript knows profile.selectedSubjects exists
// // const activeSubject = profile.selectedSubjects.find(s => s.id === subjectId)
// //     ?? profile.selectedSubjects[0]

// // export const dynamic = "force-dynamic";

// // interface TeacherDashboardContentProps {
// //     teacher: ProfileInStore | null;
// // }

// // function TeacherDashboardContent({ teacher }: TeacherDashboardContentProps) {
// //     const searchParams = useSearchParams();
// //     const subjectId = searchParams.get('subjectId') ?? undefined;
// //     const topicId = searchParams.get('topicId') ?? undefined;
// //     const termId = searchParams.get('termId') ?? undefined;
// //     const week = searchParams.get('week') ?? undefined;

// //     const { school } = useSchool();

// //     const [performanceResult, setPerformanceResult] = useState<{ data: PerformanceDashboardData | null; error: string | null }>({
// //         data: null,
// //         error: null,
// //     });

// //     useEffect(() => {
// //         async function loadPerformanceData() {
// //             if (teacher?.selectedSubjects?.[0] && school?.id) {
// //                 const result = await getPerformanceDashboardData(teacher.selectedSubjects[0].id, school.id);
// //                 setPerformanceResult(result);
// //             }
// //         }
// //         loadPerformanceData();
// //     }, [teacher, school]); // ✅ FIX 3: Added 'school' to the dependency array

// //     if (!teacher) {
// //         return <div className="p-20 text-center">Teacher not found.</div>;
// //     }
// //     if (!school) {
// //         return <div className="p-20 text-center">School data not available.</div>;
// //     }

// //     const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId)
// //         ?? teacher.selectedSubjects[0];

// //     if (!activeSubject) return <div className="p-20 text-center">No subjects assigned.</div>;

// //     let activeTopic = activeSubject.topics.find(t => t.id === topicId);
// //     if (!activeTopic && termId && week) {
// //         activeTopic = activeSubject.topics.find(t =>
// //             t.termId === termId && t.weekNumber === parseInt(week || '0')
// //         );
// //     }
// //     activeTopic = activeTopic ?? activeSubject.topics[0];

// //     const subjectsForHeader = teacher.selectedSubjects.map((gs) => ({
// //         id: gs.id,
// //         displayName: `${gs.grade.displayName} ${gs.subject.name}`,
// //         studentCount: gs.enrollments?.length ?? 0,
// //     }));

// //     return (
// //         <div className="flex flex-col w-full min-h-screen overflow-x-hidden">
// //             <DashboardHeader
// //                 teacherName={teacher.name ?? "Teacher"}
// //                 subjects={subjectsForHeader}
// //                 activeSubjectId={activeSubject.id}
// //             />

// //             <main className="flex-1 p-4 md:p-6 space-y-6 w-full overflow-x-hidden">
// //                 <section>
// //                     <Card className="border-dashed bg-muted/30">
// //                         <CardContent className="flex items-center justify-between p-4">
// //                             <p className="text-sm text-muted-foreground">
// //                                 Viewing: <strong>{activeSubject.grade.displayName} {activeSubject.subject.name}</strong>
// //                             </p>
// //                             <Button variant="outline" size="sm" asChild>
// //                                 <Link href="/subjects/manage?role=teacher">Edit Assignments</Link>
// //                             </Button>
// //                         </CardContent>
// //                     </Card>
// //                 </section>

// //                 <div className="w-full max-w-7xl mx-auto space-y-6">
// //                     <section className="w-full">
// //                         <ActiveTopicCard
// //                             key={activeSubject.id}
// //                             activeSubject={activeSubject}
// //                             activeTopic={activeTopic}
// //                             selectedTermId={termId || activeTopic?.termId}
// //                             selectedWeek={week || String(activeTopic?.weekNumber)}
// //                         />
// //                     </section>

// //                     <section className="w-full">
// //                     <AILessonPlanner
// //     topicId={activeTopic?.id ?? ""}
// //     lessonId={activeTopic?.lessons?.id ?? ""}
// //     topicTitle={activeTopic?.title ?? "General Subject"}
// //     initialData={activeTopic?.lessons?.aiContent as unknown as EnhancedLessonContent}
// // />
// //                     </section>

// //                     <section className="w-full">
// //                         <PerformanceCharts
// //                             gradeSubjectId={activeSubject.id}
// //                             schoolId={school.id}
// //                             initialPerformanceData={performanceResult.data}
// //                             initialPerformanceError={performanceResult.error}
// //                         />
// //                     </section>

// //                     <section className="w-full">
// //                         <WhatsAppStatus />
// //                     </section>
// //                 </div>
// //             </main>
// //         </div>
// //     );
// // }

// // export default TeacherDashboardContent;



// 'use client'

// import Link from 'next/link'
// import { DashboardHeader } from '@/components/TeacherDashboard/dashboard-header'
// import { ActiveTopicCard } from '@/components/TeacherDashboard/active-topic-card'
// import { PerformanceCharts } from '@/components/TeacherDashboard/performance-charts'
// import { AILessonPlanner } from '@/components/TeacherDashboard/ai-learning-planner'
// import { WhatsAppStatus } from '@/components/TeacherDashboard/whatsapp-status'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { useSchool } from '@/context/schoolProvider'
// import { useSearchParams } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import { getPerformanceDashboardData } from '@/app/actions/performance-data'
// import { ProfileInStore, isTeacherProfile } from '@/types/profile'
// import { PerformanceDashboardData } from '@/types/performanceData'
// import type { EnhancedLessonContent } from './ai-learning-planner'

// export const dynamic = 'force-dynamic'

// interface TeacherDashboardContentProps {
//     teacher: ProfileInStore | null
// }

// function TeacherDashboardContent({ teacher }: TeacherDashboardContentProps) {
//     const searchParams = useSearchParams()
//     const subjectId    = searchParams.get('subjectId') ?? undefined
//     const topicId      = searchParams.get('topicId')   ?? undefined
//     const termId       = searchParams.get('termId')    ?? undefined
//     const week         = searchParams.get('week')      ?? undefined

//     const { school } = useSchool()

//     const [performanceResult, setPerformanceResult] = useState<{
//         data:  PerformanceDashboardData | null
//         error: string | null
//     }>({ data: null, error: null })

//     useEffect(() => {
//         async function loadPerformanceData() {
//             if (teacher?.selectedSubjects?.[0] && school?.id) {
//                 const result = await getPerformanceDashboardData(
//                     teacher.selectedSubjects[0].id,
//                     school.id
//                 )
//                 setPerformanceResult(result)
//             }
//         }
//         loadPerformanceData()
//     }, [teacher, school])

//     // ── Guards ─────────────────────────────────────────────────────────────
//     if (!teacher) {
//         return <div className="p-20 text-center">Teacher not found.</div>
//     }

//     if (!school) {
//         return <div className="p-20 text-center">School data not available.</div>
//     }

//     // ── Type guard — narrows teacher to ProfileInStore ─────────────────────
//     // This ensures selectedSubjects is available before accessing it
//     if (!isTeacherProfile(teacher)) {
//         return <div className="p-20 text-center">Invalid profile type.</div>
//     }

//     // ── From here TypeScript knows teacher.selectedSubjects exists ─────────
//     const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId)
//         ?? teacher.selectedSubjects[0]

//     if (!activeSubject) {
//         return <div className="p-20 text-center">No subjects assigned.</div>
//     }

//     let activeTopic = activeSubject.topics.find(t => t.id === topicId)
//     if (!activeTopic && termId && week) {
//         activeTopic = activeSubject.topics.find(t =>
//             t.termId === termId && t.weekNumber === parseInt(week || '0')
//         )
//     }
//     activeTopic = activeTopic ?? activeSubject.topics[0]

//     const subjectsForHeader = teacher.selectedSubjects.map(gs => ({
//         id:           gs.id,
//         displayName:  `${gs.grade.displayName} ${gs.subject.name}`,
//         studentCount: gs.enrollments?.length ?? 0,
//     }))

//     return (
//         <div className="flex flex-col w-full min-h-screen overflow-x-hidden">
//             <DashboardHeader
//                 teacherName={teacher.name ?? 'Teacher'}
//                 subjects={subjectsForHeader}
//                 activeSubjectId={activeSubject.id}
//             />

//             <main className="flex-1 p-4 md:p-6 space-y-6 w-full overflow-x-hidden">
//                 <section>
//                     <Card className="border-dashed bg-muted/30">
//                         <CardContent className="flex items-center justify-between p-4">
//                             <p className="text-sm text-muted-foreground">
//                                 Viewing:{' '}
//                                 <strong>
//                                     {activeSubject.grade.displayName} {activeSubject.subject.name}
//                                 </strong>
//                             </p>
//                             <Button variant="outline" size="sm" asChild>
//                                 <Link href="/subjects/manage?role=teacher">
//                                     Edit Assignments
//                                 </Link>
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 </section>

//                 <div className="w-full max-w-7xl mx-auto space-y-6">
//                     <section className="w-full">
//                         <ActiveTopicCard
//                             key={activeSubject.id}
//                             activeSubject={activeSubject}
//                             activeTopic={activeTopic}
//                             selectedTermId={termId || activeTopic?.termId}
//                             selectedWeek={week || String(activeTopic?.weekNumber)}
//                         />
//                     </section>

//                     <section className="w-full">
//                         <AILessonPlanner
//                             topicId={activeTopic?.id ?? ''}
//                             lessonId={activeTopic?.lessons?.id ?? ''}
//                             topicTitle={activeTopic?.title ?? 'General Subject'}
//                             initialData={
//                                 activeTopic?.lessons?.aiContent as unknown as EnhancedLessonContent
//                             }
//                         />
//                     </section>

//                     <section className="w-full">
//                         <PerformanceCharts
//                             gradeSubjectId={activeSubject.id}
//                             schoolId={school.id}
//                             initialPerformanceData={performanceResult.data}
//                             initialPerformanceError={performanceResult.error}
//                         />
//                     </section>

//                     <section className="w-full">
//                         <WhatsAppStatus />
//                     </section>
//                 </div>
//             </main>
//         </div>
//     )
// }

// export default TeacherDashboardContent


// 'use client'

// import Link from 'next/link'
// import { DashboardHeader } from '@/components/TeacherDashboard/dashboard-header'
// import { ActiveTopicCard } from '@/components/TeacherDashboard/active-topic-card'
// import { PerformanceCharts } from '@/components/TeacherDashboard/performance-charts'
// import { AILessonPlanner } from '@/components/TeacherDashboard/ai-learning-planner'
// import { WhatsAppStatus } from '@/components/TeacherDashboard/whatsapp-status'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { useSchool } from '@/context/schoolProvider'
// import { useSearchParams } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import { getPerformanceDashboardData } from '@/app/actions/performance-data'
// import { ProfileInStore, isTeacherProfile } from '@/types/profile'
// import { PerformanceDashboardData } from '@/types/performanceData'
// import type { EnhancedLessonContent } from './ai-learning-planner'

// export const dynamic = 'force-dynamic'

// interface TeacherDashboardContentProps {
//     teacher: ProfileInStore | null
// }

// function TeacherDashboardContent({ teacher }: TeacherDashboardContentProps) {
//     const searchParams = useSearchParams()
//     const subjectId    = searchParams.get('subjectId') ?? undefined
//     const topicId      = searchParams.get('topicId')   ?? undefined
//     const termId       = searchParams.get('termId')    ?? undefined
//     const week         = searchParams.get('week')      ?? undefined

//     const { school } = useSchool()

//     const [performanceResult, setPerformanceResult] = useState<{
//         data:  PerformanceDashboardData | null
//         error: string | null
//     }>({ data: null, error: null })

//     useEffect(() => {
//         async function loadPerformanceData() {
//             if (teacher?.selectedSubjects?.[0] && school?.id) {
//                 const result = await getPerformanceDashboardData(
//                     teacher.selectedSubjects[0].id,
//                     school.id
//                 )
//                 setPerformanceResult(result)
//             }
//         }
//         loadPerformanceData()
//     }, [teacher, school])

//     if (!teacher) return <div className="p-20 text-center text-slate-500">Teacher not found.</div>
//     if (!school) return <div className="p-20 text-center text-slate-500">School data unavailable.</div>

//     if (!isTeacherProfile(teacher)) {
//         return <div className="p-20 text-center text-slate-500">Invalid profile type.</div>
//     }

//     const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId)
//         ?? teacher.selectedSubjects[0]

//     if (!activeSubject) {
//         return <div className="p-20 text-center text-slate-500">No subjects assigned.</div>
//     }

//     let activeTopic = activeSubject.topics.find(t => t.id === topicId)
//     if (!activeTopic && termId && week) {
//         activeTopic = activeSubject.topics.find(t =>
//             t.termId === termId && t.weekNumber === parseInt(week || '0')
//         )
//     }
//     activeTopic = activeTopic ?? activeSubject.topics[0]

//     // Mapping for the header component
//     const subjectsForHeader = teacher.selectedSubjects.map(gs => ({
//         id:           gs.id,
//         displayName:  `${gs.grade.displayName} ${gs.subject.name}`,
//         studentCount: gs.studentSubjects?.length ?? 0, // ✅ FIXED: Changed from enrollments
//     }))

//     return (
//         <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-slate-950">
//            <DashboardHeader
//                 teacherName={teacher.name ?? 'Teacher'}
//                 subjects={subjectsForHeader}
//                 activeSubjectId={activeSubject.id}
//             />

//             <main className="flex-1 p-4 md:p-6 space-y-6 w-full overflow-x-hidden">
//                 <section>
//                     <Card className="border-dashed bg-slate-900/50 border-slate-800">
//                         <CardContent className="flex items-center justify-between p-4">
//                             <p className="text-sm text-slate-400">
//                                 Viewing: <strong className="text-white">{activeSubject.grade.displayName} {activeSubject.subject.name}</strong>
//                             </p>
//                             <Button variant="outline" size="sm" asChild className="border-slate-700 hover:bg-slate-800 text-slate-300">
//                                 <Link href="/subjects/manage?role=teacher">Edit Assignments</Link>
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 </section>

//                 <div className="w-full max-w-7xl mx-auto space-y-6">
//                     <section className="w-full">
//                         <ActiveTopicCard
//                             key={activeSubject.id}
//                             activeSubject={activeSubject}
//                             activeTopic={activeTopic}
//                             selectedTermId={termId || activeTopic?.termId}
//                             selectedWeek={week || String(activeTopic?.weekNumber)}
//                         />
//                     </section>

//                     <section className="w-full">
//                         <AILessonPlanner
//                             topicId={activeTopic?.id ?? ''}
//                             // ✅ FIX 1: Pass the required schoolId
//                             schoolId={school.id}
//                             // ✅ FIX 2: Access the ID and aiContent from the first item in the array
//                             lessonId={activeTopic?.lessons?.[0]?.id ?? ''}
//                             topicTitle={activeTopic?.title ?? 'General Subject'}
//                             initialData={
//                                 activeTopic?.lessons?.[0]?.aiContent as unknown as EnhancedLessonContent
//                             }
//                         />
//                     </section>


//                     <section className="w-full">
//                         <PerformanceCharts
//                             gradeSubjectId={activeSubject.id}
//                             schoolId={school.id}
//                             initialPerformanceData={performanceResult.data}
//                             initialPerformanceError={performanceResult.error}
//                         />
//                     </section>

//                     <section className="w-full">
//                         <WhatsAppStatus />
//                     </section>
//                 </div>
//             </main>
//         </div>
//     )
// }

// export default TeacherDashboardContent


// 'use client'

// import Link from 'next/link'
// import { DashboardHeader } from '@/components/TeacherDashboard/dashboard-header'
// import { ActiveTopicCard } from '@/components/TeacherDashboard/active-topic-card'
// import { PerformanceCharts } from '@/components/TeacherDashboard/performance-charts'
// import { AILessonPlanner } from '@/components/TeacherDashboard/ai-learning-planner'
// import { WhatsAppStatus } from '@/components/TeacherDashboard/whatsapp-status'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { useSchool } from '@/context/schoolProvider'
// import { useSearchParams } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import { getPerformanceDashboardData } from '@/app/actions/performance-data'
// import { ProfileInStore, isTeacherProfile } from '@/types/profile'
// import { PerformanceDashboardData } from '@/types/performanceData'
// import type { EnhancedLessonContent } from './ai-learning-planner'
// import { BookOpen, Plus, Info, LayoutGrid } from 'lucide-react'

// export const dynamic = 'force-dynamic'

// interface TeacherDashboardContentProps {
//     teacher: ProfileInStore | null
// }

// function TeacherDashboardContent({ teacher }: TeacherDashboardContentProps) {
//     const searchParams = useSearchParams()
//     const subjectId    = searchParams.get('subjectId') ?? undefined
//     const topicId      = searchParams.get('topicId')   ?? undefined
//     const termId       = searchParams.get('termId')    ?? undefined
//     const week         = searchParams.get('week')      ?? undefined

//     const { school } = useSchool()

//     const [performanceResult, setPerformanceResult] = useState<{
//         data:  PerformanceDashboardData | null
//         error: string | null
//     }>({ data: null, error: null })

//     useEffect(() => {
//         async function loadPerformanceData() {
//             if (teacher?.selectedSubjects?.[0] && school?.id) {
//                 const result = await getPerformanceDashboardData(
//                     teacher.selectedSubjects[0].id,
//                     school.id
//                 )
//                 setPerformanceResult(result)
//             }
//         }
//         loadPerformanceData()
//     }, [teacher, school])

//     if (!teacher) return <div className="p-20 text-center text-slate-500 font-black uppercase tracking-widest">Teacher registry entry not found.</div>
//     if (!school) return <div className="p-20 text-center text-slate-500 font-black uppercase tracking-widest">Institutional data synchronized failure.</div>
//     if (!isTeacherProfile(teacher)) return <div className="p-20 text-center text-slate-500 font-black uppercase tracking-widest">Unauthorized access level.</div>

//     // ✅ LOGIC: Determine if we have an active subject to display
//     const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId)
//         ?? teacher.selectedSubjects[0] ?? null;

//     let activeTopic = activeSubject?.topics.find(t => t.id === topicId);
//     if (!activeTopic && termId && week && activeSubject) {
//         activeTopic = activeSubject.topics.find(t =>
//             t.termId === termId && t.weekNumber === parseInt(week || '0')
//         );
//     }
//     activeTopic = activeTopic ?? activeSubject?.topics[0] ?? null;

//     const subjectsForHeader = teacher.selectedSubjects.map(gs => ({
//         id:           gs.id,
//         displayName:  `${gs.grade.displayName} ${gs.subject.name}`,
//         studentCount: gs.studentSubjects?.length ?? 0,
//     }))

//     return (
//         <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-slate-950">
//             <DashboardHeader
//                 teacherName={teacher.name ?? 'Teacher'}
//                 subjects={subjectsForHeader}
//                 activeSubjectId={activeSubject?.id ?? ""}
//             />

//             <main className="flex-1 p-4 md:p-8 space-y-8 w-full max-w-7xl mx-auto overflow-x-hidden animate-in fade-in duration-700">
                
//                 {/* ── Conditional Rendering Based on Subject Availability ── */}
//                 {!activeSubject ? (
//                     /* ── EMPTY STATE: NO SUBJECTS ASSIGNED ── */
//                     <div className="py-20 flex flex-col items-center justify-center text-center space-y-8">
//                         <div className="h-24 w-24 rounded-[2.5rem] bg-school-primary/10 border border-school-primary/20 flex items-center justify-center text-school-primary shadow-2xl">
//                             <BookOpen className="h-10 w-10 animate-pulse" />
//                         </div>
//                         <div className="space-y-2">
//                             <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Welcome, {teacher.name?.split(' ')[0]}</h2>
//                             <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">Your teaching registry is currently empty. Initialize your dashboard by selecting your assigned subjects.</p>
//                         </div>
//                         <Button asChild className="bg-school-primary text-school-secondary-950 font-black px-10 py-7 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-school-primary/10 uppercase tracking-widest text-xs">
//                             <Link href="/teacher/subjects">
//                                 <Plus className="mr-2 h-4 w-4" /> Initialize Workspace
//                             </Link>
//                         </Button>
//                     </div>
//                 ) : (
//                     /* ── FULL DASHBOARD: SUBJECTS ASSIGNED ── */
//                     <>
//                         <section className="animate-in slide-in-from-bottom-4 duration-500">
//                             <Card className="bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
//                                 <CardContent className="flex items-center justify-between p-6 bg-slate-950/40">
//                                     <div className="flex items-center gap-4">
//                                         <div className="p-2 bg-school-primary/10 rounded-lg">
//                                             <LayoutGrid className="h-4 w-4 text-school-primary" />
//                                         </div>
//                                         <p className="text-sm font-bold text-white uppercase italic tracking-tight">
//                                             Registry View: <span className="text-school-primary">{activeSubject.grade.displayName} {activeSubject.subject.name}</span>
//                                         </p>
//                                     </div>
//                                     <Button variant="outline" size="sm" asChild className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl uppercase text-[10px] font-black tracking-widest">
//                                         <Link href="/teacher/subjects">Edit Registry</Link>
//                                     </Button>
//                                 </CardContent>
//                             </Card>
//                         </section>

//                         <div className="space-y-8">
//                             <section className="w-full">
//                                 <ActiveTopicCard
//                                     key={activeSubject.id}
//                                     activeSubject={activeSubject}
//                                     activeTopic={activeTopic}
//                                     selectedTermId={termId || activeTopic?.termId}
//                                     selectedWeek={week || String(activeTopic?.weekNumber)}
//                                 />
//                             </section>

//                             <section className="w-full">
//                                 <AILessonPlanner
//                                     topicId={activeTopic?.id ?? ''}
//                                     schoolId={school.id}
//                                     lessonId={activeTopic?.lessons?.[0]?.id ?? ''}
//                                     topicTitle={activeTopic?.title ?? 'General Subject'}
//                                     initialData={activeTopic?.lessons?.[0]?.aiContent as unknown as EnhancedLessonContent}
//                                 />
//                             </section>

//                             <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//                                 <div className="lg:col-span-2">
//                                     <PerformanceCharts
//                                         gradeSubjectId={activeSubject.id}
//                                         schoolId={school.id}
//                                         initialPerformanceData={performanceResult.data}
//                                         initialPerformanceError={performanceResult.error}
//                                     />
//                                 </div>
//                                 <div className="lg:col-span-1">
//                                     <WhatsAppStatus />
//                                 </div>
//                             </section>
//                         </div>
//                     </>
//                 )}
//             </main>
//         </div>
//     )
// }

// export default TeacherDashboardContent;



// 'use client'

// import { useState, useEffect, useMemo } from 'react'
// import Link from 'next/link'
// import { useSearchParams } from 'next/navigation'
// import { useSchool } from '@/context/schoolProvider'
// import { useProfileStore } from '@/store/profileStore'

// // Components
// import { DashboardHeader } from '@/components/TeacherDashboard/dashboard-header'
// import { ActiveTopicCard } from '@/components/TeacherDashboard/active-topic-card'
// import { PerformanceCharts } from '@/components/TeacherDashboard/performance-charts'
// import { AILessonPlanner } from '@/components/TeacherDashboard/ai-learning-planner'
// import { WhatsAppStatus } from '@/components/TeacherDashboard/whatsapp-status'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'

// // Actions & Types
// import { getPerformanceDashboardData } from '@/app/actions/performance-data'
// import { isTeacherProfile } from '@/types/profile'
// import { PerformanceDashboardData } from '@/types/performanceData'
// import type { EnhancedLessonContent } from './ai-learning-planner'
// import { LayoutGrid, Loader2 } from 'lucide-react'

// export const dynamic = 'force-dynamic'

// export default function TeacherDashboardContent({ teacher }: { teacher: any }) {
//     const searchParams = useSearchParams()
//     const { school } = useSchool()
    
//     // 1. Extract Search Params
//     const subjectId = searchParams.get('subjectId')
//     const topicId = searchParams.get('topicId')
//     const termId = searchParams.get('termId')
//     const week = searchParams.get('week')

//     const [performanceResult, setPerformanceResult] = useState<{
//         data: PerformanceDashboardData | null
//         error: string | null
//     }>({ data: null, error: null })

//     // 2. Data Resolution (Safe Fallbacks for everything)
//     const activeSubject = teacher?.selectedSubjects?.find((s: any) => s.id === subjectId)
//         ?? teacher?.selectedSubjects?.[0]
//         ?? null;

//     const activeTopic = activeSubject?.topics?.find((t: any) => 
//         t.id === topicId || (t.termId === termId && t.weekNumber === parseInt(week || '0'))
//     ) ?? activeSubject?.topics?.[0] ?? null;

//     const subjectsForHeader = teacher?.selectedSubjects?.map((gs: any) => ({
//         id: gs.id,
//         displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//         studentCount: gs.studentSubjects?.length ?? 0,
//     })) ?? [];


//     useEffect(() => {
//         // If the URL contains the hash, scroll to it after a small delay
//         if (window.location.hash === "#lesson-planner-section") {
//             setTimeout(() => {
//                 const element = document.getElementById("lesson-planner-section");
//                 if (element) {
//                     element.scrollIntoView({ behavior: "smooth" });
//                 }
//             }, 500); // 500ms delay gives the UI time to paint
//         }
//     }, [searchParams]);

//     // 3. Effect: Performance Data Fetch
//     useEffect(() => {
//         async function load() {
//             if (activeSubject?.id && school?.id) {
//                 const result = await getPerformanceDashboardData(activeSubject.id, school.id)
//                 setPerformanceResult(result)
//             }
//         }
//         load()
//     }, [activeSubject?.id, school?.id])

//     // ── PERMANENT RENDER ──
//     // We render the full shell regardless of whether data is null
//     return (
//         <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">
            
//             {/* ── HEADER (Always Visible) ── */}
//             <DashboardHeader
//                 teacherName={teacher?.name ?? 'Teacher'}
//                 subjects={subjectsForHeader}
//                 activeSubjectId={activeSubject?.id ?? ""}
//             />

//             <main className="flex-1 p-4 md:p-8 space-y-8 w-full max-w-7xl mx-auto overflow-x-hidden">
                
//                 {/* ── STATUS CARD (Always Visible) ── */}
//                 <section>
//                     <Card className="bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
//                         <CardContent className="flex items-center justify-between p-6 bg-slate-950/40">
//                             <div className="flex items-center gap-4">
//                                 <div className="p-2 bg-school-primary/10 rounded-lg">
//                                     <LayoutGrid className="h-4 w-4 text-school-primary" />
//                                 </div>
//                                 <div className="min-w-0">
//                                     <p className="text-sm font-bold text-white uppercase italic tracking-tight truncate">
//                                         {activeSubject 
//                                             ? <>Registry: <span className="text-school-primary">{activeSubject.grade.displayName} {activeSubject.subject.name}</span></>
//                                             : "Institutional Workspace: Pending Subject Selection"}
//                                     </p>
//                                 </div>
//                             </div>
//                             <Button variant="outline" size="sm" asChild className="border-white/10 text-slate-400 hover:text-school-primary rounded-xl uppercase text-[10px] font-black tracking-widest shrink-0">
//                                 <Link href="/subjects/manage">Select Subject</Link>
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 </section>

//                 {/* ── MAIN COMPONENTS (Always Rendered) ── */}
//                 <div className="space-y-8">
                    
//                     {/* 1. TOPIC MONITOR */}
//                     <section className="w-full">
//                         <ActiveTopicCard
//                             activeSubject={activeSubject}
//                             activeTopic={activeTopic}
//                             selectedTermId={termId || activeTopic?.termId || ""}
//                             selectedWeek={week || String(activeTopic?.weekNumber || "")}
//                         />
//                     </section>

//                     {/* 2. AI LESSON PLANNER */}
//                     <section className="w-full scroll-mt-20" id="lesson-planner-section">
//                         <AILessonPlanner
//                             topicId={activeTopic?.id ?? ""}
//                             schoolId={school?.id ?? ""}
//                             lessonId={activeTopic?.lessons?.[0]?.id ?? ""}
//                             topicTitle={activeTopic?.title ?? "Standard Registry"}
//                             initialData={
//                                 (activeTopic?.lessons?.[0]?.aiContent as unknown as EnhancedLessonContent) || null
//                             }
//                         />
//                     </section>

//                     {/* 3. PERFORMANCE & WHATSAPP ROW */}
//                     <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//                         <div className="lg:col-span-2 h-full">
//                             <PerformanceCharts
//                                 gradeSubjectId={activeSubject?.id ?? ""}
//                                 schoolId={school?.id ?? ""}
//                                 initialPerformanceData={performanceResult.data}
//                                 initialPerformanceError={performanceResult.error}
//                             />
//                         </div>
//                         <div className="lg:col-span-1 h-full">
//                             <WhatsAppStatus />
//                         </div>
//                     </section>
//                 </div>

//                 {/* ── FOOTER SYSTEM LOGS ── */}
//                 <footer className="pt-12 flex justify-center opacity-20 border-t border-white/5">
//                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
//                         Institutional_Control_Environment_v1.0
//                     </p>
//                 </footer>
//             </main>
//         </div>
//     )
// }

// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { useSearchParams } from 'next/navigation'
// import { useSchool } from '@/context/schoolProvider'

// // Components
// import { DashboardHeader } from '@/components/TeacherDashboard/dashboard-header'
// import { ActiveTopicCard } from '@/components/TeacherDashboard/active-topic-card'
// import { PerformanceCharts } from '@/components/TeacherDashboard/performance-charts'
// import { AILessonPlanner } from '@/components/TeacherDashboard/ai-learning-planner'
// import { WhatsAppStatus } from '@/components/TeacherDashboard/whatsapp-status'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'

// // Actions & Types
// import { getPerformanceDashboardData } from '@/app/actions/performance-data'
// import { PerformanceDashboardData } from '@/types/performanceData'
// import type { EnhancedLessonContent } from './ai-learning-planner'
// import { LayoutGrid } from 'lucide-react'

// // ── Types ───────────────────────────────────────────────────────────────────

// interface LessonReference {
//     id: string
//     aiContent: unknown // Cast to EnhancedLessonContent when passed as prop
// }

// interface DashboardTopic {
//     id: string
//     title: string
//     termId: string
//     weekNumber: number | null
//     lessons: LessonReference[]
// }

// interface DashboardSubject {
//     id: string
//     grade: { displayName: string }
//     subject: { name: string }
//     topics: DashboardTopic[]
//     studentSubjects?: unknown[]
// }

// interface TeacherDashboardProps {
//     teacher: {
//         name: string | null
//         selectedSubjects: DashboardSubject[]
//     }
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export const dynamic = 'force-dynamic'

// export default function TeacherDashboardContent({ teacher }: TeacherDashboardProps) {
//     const searchParams = useSearchParams()
//     const { school } = useSchool()
    
//     // 1. Extract Search Params
//     const subjectId = searchParams.get('subjectId')
//     const topicId = searchParams.get('topicId')
//     const termId = searchParams.get('termId')
//     const week = searchParams.get('week')

//     const [performanceResult, setPerformanceResult] = useState<{
//         data: PerformanceDashboardData | null
//         error: string | null
//     }>({ data: null, error: null })

//     // 2. Data Resolution (Strictly Typed)
//     const activeSubject = teacher.selectedSubjects.find((s: DashboardSubject) => s.id === subjectId)
//         ?? teacher.selectedSubjects[0]
//         ?? null;

//     const activeTopic = activeSubject?.topics.find((t: DashboardTopic) => 
//         t.id === topicId || (t.termId === termId && t.weekNumber === parseInt(week || '0'))
//     ) ?? activeSubject?.topics[0] ?? null;

//     const subjectsForHeader = teacher.selectedSubjects.map((gs: DashboardSubject) => ({
//         id: gs.id,
//         displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//         studentCount: gs.studentSubjects?.length ?? 0,
//     }));

//     // 3. Anchor Scroll Logic
//     useEffect(() => {
//         if (window.location.hash === "#lesson-planner-section") {
//             const timer = setTimeout(() => {
//                 const element = document.getElementById("lesson-planner-section");
//                 if (element) {
//                     element.scrollIntoView({ behavior: "smooth" });
//                 }
//             }, 500); 
//             return () => clearTimeout(timer);
//         }
//     }, [searchParams]);

//     // 4. Effect: Performance Data Fetch
//     useEffect(() => {
//         async function load() {
//             if (activeSubject?.id && school?.id) {
//                 const result = await getPerformanceDashboardData(activeSubject.id, school.id)
//                 setPerformanceResult(result)
//             }
//         }
//         load()
//     }, [activeSubject?.id, school?.id])

//     return (
//         <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">
            
//             <DashboardHeader
//                 teacherName={teacher.name ?? 'Instructor'}
//                 subjects={subjectsForHeader}
//                 activeSubjectId={activeSubject?.id ?? ""}
//             />

//             <main className="flex-1 p-4 md:p-8 space-y-8 w-full max-w-7xl mx-auto overflow-x-hidden">
                
//                 {/* ── STATUS CARD ── */}
//                 <section>
//                     <Card className="bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
//                         <CardContent className="flex items-center justify-between p-6 bg-slate-950/40">
//                             <div className="flex items-center gap-4">
//                                 <div className="p-2 bg-school-primary/10 rounded-lg">
//                                     <LayoutGrid className="h-4 w-4 text-school-primary" />
//                                 </div>
//                                 <div className="min-w-0">
//                                     <p className="text-sm font-bold text-white uppercase italic tracking-tight truncate">
//                                         {activeSubject 
//                                             ? <>Registry: <span className="text-school-primary">{activeSubject.grade.displayName} {activeSubject.subject.name}</span></>
//                                             : "Institutional Workspace: Pending Subject Selection"}
//                                     </p>
//                                 </div>
//                             </div>
//                             <Button variant="outline" size="sm" asChild className="border-white/10 text-slate-400 hover:text-school-primary rounded-xl uppercase text-[10px] font-black tracking-widest shrink-0">
//                                 <Link href="/subjects/manage">Update Registry</Link>
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 </section>

//                 <div className="space-y-8">
//                     {/* 1. TOPIC MONITOR */}
//                     <section className="w-full">
//                         <ActiveTopicCard
//                             activeSubject={activeSubject}
//                             activeTopic={activeTopic}
//                             selectedTermId={termId || activeTopic?.termId || ""}
//                             selectedWeek={week || String(activeTopic?.weekNumber || "")}
//                         />
//                     </section>

//                     {/* 2. AI LESSON PLANNER */}
//                     <section className="w-full scroll-mt-20" id="lesson-planner-section">
//                         <AILessonPlanner
//                             topicId={activeTopic?.id ?? ""}
//                             schoolId={school?.id ?? ""}
//                             lessonId={activeTopic?.lessons?.[0]?.id ?? ""}
//                             topicTitle={activeTopic?.title ?? "Standard Registry"}
//                             initialData={
//                                 (activeTopic?.lessons?.[0]?.aiContent as EnhancedLessonContent) || null
//                             }
//                         />
//                     </section>

//                     {/* 3. PERFORMANCE & WHATSAPP ROW */}
//                     <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//                         <div className="lg:col-span-2 h-full">
//                             <PerformanceCharts
//                                 gradeSubjectId={activeSubject?.id ?? ""}
//                                 schoolId={school?.id ?? ""}
//                                 initialPerformanceData={performanceResult.data}
//                                 initialPerformanceError={performanceResult.error}
//                             />
//                         </div>
//                         <div className="lg:col-span-1 h-full">
//                             <WhatsAppStatus />
//                         </div>
//                     </section>
//                 </div>

//                 <footer className="pt-12 flex justify-center opacity-20 border-t border-white/5">
//                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
//                         Institutional_Control_Environment_v1.0
//                     </p>
//                 </footer>
//             </main>
//         </div>
//     )
// }


// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { useSearchParams } from 'next/navigation'
// import { useSchool } from '@/context/schoolProvider'

// // Components
// import { DashboardHeader } from '@/components/TeacherDashboard/dashboard-header'
// import { ActiveTopicCard } from '@/components/TeacherDashboard/active-topic-card'
// import { PerformanceCharts } from '@/components/TeacherDashboard/performance-charts'
// import { AILessonPlanner, type EnhancedLessonContent } from '@/components/TeacherDashboard/ai-learning-planner'
// import { WhatsAppStatus } from '@/components/TeacherDashboard/whatsapp-status'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'

// // Actions & Types
// import { getPerformanceDashboardData } from '@/app/actions/performance-data'
// import { PerformanceDashboardData } from '@/types/performanceData'
// import { LayoutGrid } from 'lucide-react'
// import { ProfileInStore } from '@/types/profile'

// // ── Types ───────────────────────────────────────────────────────────────────

// interface LessonReference {
//     id: string
//     aiContent: unknown 
// }

// interface DashboardTopic {
//     id: string
//     title: string
//     termId: string
//     weekNumber: number | null
//     lessons: LessonReference[]
// }

// interface DashboardSubject {
//     id: string
//     grade: { displayName: string }
//     subject: { name: string }
//     topics: DashboardTopic[]
//     studentSubjects?: unknown[]
// }

// /**
//  * FIXED: Aligned interface with page.tsx mapping.
//  * name is string | null, selectedSubjects matches local DashboardSubject[].
//  */
// interface TeacherDashboardProps {
//     teacher: {
//         name: string | null;
//         selectedSubjects: DashboardSubject[];
//     }
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function TeacherDashboardContent({ teacher }: TeacherDashboardProps) {
//     const searchParams = useSearchParams()
//     const { school } = useSchool()
    
//     const subjectId = searchParams.get('subjectId')
//     const topicId = searchParams.get('topicId')
//     const termId = searchParams.get('termId')
//     const week = searchParams.get('week')

//     const [performanceResult, setPerformanceResult] = useState<{
//         data: PerformanceDashboardData | null
//         error: string | null
//     }>({ data: null, error: null })

//     // Data Resolution
//     const activeSubject = (teacher.selectedSubjects as DashboardSubject[]).find(s => s.id === subjectId)
//         ?? teacher.selectedSubjects[0]
//         ?? null;

//     const activeTopic = activeSubject?.topics.find((t: DashboardTopic) => 
//         t.id === topicId || (t.termId === termId && t.weekNumber === parseInt(week || '0'))
//     ) ?? activeSubject?.topics[0] ?? null;

//     const subjectsForHeader = teacher.selectedSubjects.map((gs) => ({
//         id: gs.id,
//         displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//         studentCount: gs.studentSubjects?.length ?? 0,
//     }));

//     useEffect(() => {
//         if (window.location.hash === "#lesson-planner-section") {
//             const timer = setTimeout(() => {
//                 const element = document.getElementById("lesson-planner-section");
//                 if (element) {
//                     element.scrollIntoView({ behavior: "smooth" });
//                 }
//             }, 500); 
//             return () => clearTimeout(timer);
//         }
//     }, [searchParams]);

//     useEffect(() => {
//         async function load() {
//             if (activeSubject?.id && school?.id) {
//                 const result = await getPerformanceDashboardData(activeSubject.id, school.id)
//                 setPerformanceResult(result)
//             }
//         }
//         load()
//     }, [activeSubject?.id, school?.id])

//     return (
//         <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">
            
//             <DashboardHeader
//                 teacherName={teacher.name ?? 'Instructor'}
//                 subjects={subjectsForHeader}
//                 activeSubjectId={activeSubject?.id ?? ""}
//             />

//             <main className="flex-1 p-4 md:p-8 space-y-8 w-full max-w-7xl mx-auto overflow-x-hidden">
                
//                 <section>
//                     <Card className="bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
//                         <CardContent className="flex items-center justify-between p-6 bg-slate-950/40">
//                             <div className="flex items-center gap-4">
//                                 <div className="p-2 bg-school-primary/10 rounded-lg">
//                                     <LayoutGrid className="h-4 w-4 text-school-primary" />
//                                 </div>
//                                 <div className="min-w-0">
//                                     <p className="text-sm font-bold text-white uppercase italic tracking-tight truncate">
//                                         {activeSubject 
//                                             ? <>Registry: <span className="text-school-primary">{activeSubject.grade.displayName} {activeSubject.subject.name}</span></>
//                                             : "Institutional Workspace: Pending Subject Selection"}
//                                     </p>
//                                 </div>
//                             </div>
//                             <Button variant="outline" size="sm" asChild className="border-white/10 text-slate-400 hover:text-school-primary rounded-xl uppercase text-[10px] font-black tracking-widest shrink-0">
//                                 <Link href="/subjects/manage">Update Registry</Link>
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 </section>

//                 <div className="space-y-8">
//                     <section className="w-full">
//                         <ActiveTopicCard
//                             activeSubject={activeSubject as any}
//                             activeTopic={activeTopic as any}
//                             selectedTermId={termId || activeTopic?.termId || ""}
//                             selectedWeek={week || String(activeTopic?.weekNumber || "")}
//                         />
//                     </section>

//                     <section className="w-full scroll-mt-20" id="lesson-planner-section">
//                         <AILessonPlanner
//                             topicId={activeTopic?.id ?? ""}
//                             schoolId={school?.id ?? ""}
//                             lessonId={activeTopic?.lessons?.[0]?.id ?? ""}
//                             topicTitle={activeTopic?.title ?? "Standard Registry"}
//                             initialData={
//                                 (activeTopic?.lessons?.[0]?.aiContent as unknown as EnhancedLessonContent) || null
//                             }
//                         />
//                     </section>

//                     <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//                         <div className="lg:col-span-2 h-full">
//                             <PerformanceCharts
//                                 gradeSubjectId={activeSubject?.id ?? ""}
//                                 schoolId={school?.id ?? ""}
//                                 initialPerformanceData={performanceResult.data}
//                                 initialPerformanceError={performanceResult.error}
//                             />
//                         </div>
//                         <div className="lg:col-span-1 h-full">
//                             <WhatsAppStatus />
//                         </div>
//                     </section>
//                 </div>

//                 <footer className="pt-12 flex justify-center opacity-20 border-t border-white/5">
//                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
//                         Institutional_Control_Environment_v1.0
//                     </p>
//                 </footer>
//             </main>
//         </div>
//     )
// }


// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { useSearchParams } from 'next/navigation'
// import { useSchool } from '@/context/schoolProvider'

// // Components
// import { DashboardHeader } from '@/components/TeacherDashboard/dashboard-header'
// import { ActiveTopicCard } from '@/components/TeacherDashboard/active-topic-card'
// import { PerformanceCharts } from '@/components/TeacherDashboard/performance-charts'
// import { AILessonPlanner, type EnhancedLessonContent } from '@/components/TeacherDashboard/ai-learning-planner'
// import { WhatsAppStatus } from '@/components/TeacherDashboard/whatsapp-status'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'

// // Actions & Types
// import { getPerformanceDashboardData } from '@/app/actions/performance-data'
// import { PerformanceDashboardData } from '@/types/performanceData'
// import { LayoutGrid, AlertCircle } from 'lucide-react'

// // ── Types ───────────────────────────────────────────────────────────────────

// interface LessonReference {
//   id: string
//   aiContent: unknown 
// }

// interface DashboardTopic {
//   id: string
//   title: string
//   termId: string
//   weekNumber: number | null
//   lessons: LessonReference[]
// }

// interface DashboardSubject {
//   id: string
//   grade: { displayName: string }
//   subject: { name: string }
//   topics: DashboardTopic[]
//   studentSubjects?: { id: string }[]
// }

// /**
//  * FIXED: Prop structure strictly matches the mapping in page.tsx
//  */
// interface TeacherDashboardProps {
//   teacher: {
//     name: string | null;
//     selectedSubjects: DashboardSubject[];
//   }
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function TeacherDashboardContent({ teacher }: TeacherDashboardProps) {
//   const searchParams = useSearchParams()
//   const { school } = useSchool()

//   const subjectId = searchParams.get('subjectId')
//   const topicId = searchParams.get('topicId')
//   const termId = searchParams.get('termId')
//   const week = searchParams.get('week')

//   const [performanceResult, setPerformanceResult] = useState<{
//     data: PerformanceDashboardData | null
//     error: string | null
//   }>({ data: null, error: null })

//   // Logic: Find subject based on URL or default to first
//   const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId)
//     ?? teacher.selectedSubjects[0]
//     ?? null;

//   // Logic: Find topic based on URL or default to first
//   const activeTopic = activeSubject?.topics.find((t: DashboardTopic) =>
//     t.id === topicId || (t.termId === termId && t.weekNumber === parseInt(week || '0'))
//   ) ?? activeSubject?.topics[0] ?? null;

//   // Transform data for the Header component
//   const subjectsForHeader = teacher.selectedSubjects.map((gs) => ({
//     id: gs.id,
//     displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//     studentCount: gs.studentSubjects?.length ?? 0,
//   }));

//   useEffect(() => {
//     if (window.location.hash === "#lesson-planner-section") {
//       const timer = setTimeout(() => {
//         const element = document.getElementById("lesson-planner-section");
//         if (element) {
//           element.scrollIntoView({ behavior: "smooth" });
//         }
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     async function load() {
//       if (activeSubject?.id && school?.id) {
//         const result = await getPerformanceDashboardData(activeSubject.id, school.id)
//         setPerformanceResult(result)
//       }
//     }
//     load()
//   }, [activeSubject?.id, school?.id])

//   return (
//     <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">

//       <DashboardHeader
//         teacherName={teacher.name ?? 'Instructor'}
//         subjects={subjectsForHeader}
//         activeSubjectId={activeSubject?.id ?? ""}
//       />

//       <main className="flex-1 p-4 md:p-8 space-y-8 w-full max-w-7xl mx-auto overflow-x-hidden">

//         {/* Status Bar */}
//         <section>
//           <Card className="bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
//             <CardContent className="flex items-center justify-between p-6 bg-slate-950/40">
//               <div className="flex items-center gap-4">
//                 <div className="p-2 bg-school-primary/10 rounded-lg">
//                   <LayoutGrid className="h-4 w-4 text-school-primary" />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-sm font-bold text-white uppercase italic tracking-tight truncate">
//                     {activeSubject
//                       ? <>Registry: <span className="text-school-primary">{activeSubject.grade.displayName} {activeSubject.subject.name}</span></>
//                       : "Institutional Workspace: Pending Selection"}
//                   </p>
//                 </div>
//               </div>
//               <Button variant="outline" size="sm" asChild className="border-white/10 text-slate-400 rounded-xl uppercase text-[10px] font-black shrink-0">
//                 <Link href="/subjects/manage">Update Registry</Link>
//               </Button>
//             </CardContent>
//           </Card>
//         </section>

//         <div className="space-y-8">
//           {/* 1. TOPIC MONITOR */}
//           <section className="w-full">
//             <ActiveTopicCard
//               activeSubject={activeSubject as any}
//               activeTopic={activeTopic as any}
//               selectedTermId={termId || activeTopic?.termId || ""}
//               selectedWeek={week || String(activeTopic?.weekNumber || "")}
//             />
//           </section>

//           {/* 2. AI LESSON PLANNER */}
//           <section className="w-full scroll-mt-20" id="lesson-planner-section">
//             <AILessonPlanner
//               topicId={activeTopic?.id ?? ""}
//               schoolId={school?.id ?? ""}
//               lessonId={activeTopic?.lessons?.[0]?.id ?? ""}
//               topicTitle={activeTopic?.title ?? "Standard Registry"}
//               initialData={
//                 (activeTopic?.lessons?.[0]?.aiContent as unknown as EnhancedLessonContent) || null
//               }
//             />
//           </section>

//           {/* 3. PERFORMANCE & WHATSAPP */}
//           <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//             <div className="lg:col-span-2 h-full">
//               <PerformanceCharts
//                 gradeSubjectId={activeSubject?.id ?? ""}
//                 schoolId={school?.id ?? ""}
//                 initialPerformanceData={performanceResult.data}
//                 initialPerformanceError={performanceResult.error}
//               />
//             </div>
//             <div className="lg:col-span-1 h-full">
//               <WhatsAppStatus />
//             </div>
//           </section>
//         </div>

//         <footer className="pt-12 flex flex-col items-center gap-2 opacity-20 border-t border-white/5">
//           <AlertCircle className="h-4 w-4" />
//           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
//             Institutional_Control_Environment_v1.0
//           </p>
//         </footer>
//       </main>
//     </div>
//   )
// }

// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { useSearchParams } from 'next/navigation'
// import { useSchool } from '@/context/schoolProvider'

// // Components
// import { DashboardHeader } from '@/components/TeacherDashboard/dashboard-header'
// import { ActiveTopicCard } from '@/components/TeacherDashboard/active-topic-card'
// import { PerformanceCharts } from '@/components/TeacherDashboard/performance-charts'
// import { AILessonPlanner, type EnhancedLessonContent } from '@/components/TeacherDashboard/ai-learning-planner'
// import { WhatsAppStatus } from '@/components/TeacherDashboard/whatsapp-status'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'

// // Actions & Types
// import { getPerformanceDashboardData } from '@/app/actions/performance-data'
// import { PerformanceDashboardData } from '@/types/performanceData'
// import { LayoutGrid, AlertCircle } from 'lucide-react'

// // ── Types ───────────────────────────────────────────────────────────────────

// interface LessonReference {
//   id: string
//   aiContent: unknown 
// }

// interface DashboardTopic {
//   id: string
//   title: string
//   termId: string
//   weekNumber: number | null
//   lessons: LessonReference[]
// }

// interface DashboardSubject {
//   id: string
//   grade: { displayName: string }
//   subject: { name: string }
//   topics: DashboardTopic[]
//   studentSubjects?: { id: string }[]
// }

// /**
//  * FIXED: Prop structure strictly matches the mapping in page.tsx
//  */
// interface TeacherDashboardProps {
//   teacher: {
//     name: string | null;
//     selectedSubjects: DashboardSubject[];
//   }
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function TeacherDashboardContent({ teacher }: TeacherDashboardProps) {
//   const searchParams = useSearchParams()
//   const { school } = useSchool()

//   const subjectId = searchParams.get('subjectId')
//   const topicId = searchParams.get('topicId')
//   const termId = searchParams.get('termId')
//   const week = searchParams.get('week')

//   const [performanceResult, setPerformanceResult] = useState<{
//     data: PerformanceDashboardData | null
//     error: string | null
//   }>({ data: null, error: null })

//   // Logic: Find subject based on URL or default to first
//   const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId)
//     ?? teacher.selectedSubjects[0]
//     ?? null;

//   // Logic: Find topic based on URL or default to first
//   const activeTopic = activeSubject?.topics.find((t: DashboardTopic) =>
//     t.id === topicId || (t.termId === termId && t.weekNumber === parseInt(week || '0'))
//   ) ?? activeSubject?.topics[0] ?? null;

//   // Transform data for the Header component
//   const subjectsForHeader = teacher.selectedSubjects.map((gs) => ({
//     id: gs.id,
//     displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//     studentCount: gs.studentSubjects?.length ?? 0,
//   }));

//   useEffect(() => {
//     if (window.location.hash === "#lesson-planner-section") {
//       const timer = setTimeout(() => {
//         const element = document.getElementById("lesson-planner-section");
//         if (element) {
//           element.scrollIntoView({ behavior: "smooth" });
//         }
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     async function load() {
//       if (activeSubject?.id && school?.id) {
//         const result = await getPerformanceDashboardData(activeSubject.id, school.id)
//         setPerformanceResult(result)
//       }
//     }
//     load()
//   }, [activeSubject?.id, school?.id])

//   return (
//     <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">

//       <DashboardHeader
//         teacherName={teacher.name ?? 'Instructor'}
//         subjects={subjectsForHeader}
//         activeSubjectId={activeSubject?.id ?? ""}
//       />

//       <main className="flex-1 p-4 md:p-8 space-y-8 w-full max-w-7xl mx-auto overflow-x-hidden">

//         {/* Status Bar */}
//         <section>
//           <Card className="bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
//             <CardContent className="flex items-center justify-between p-6 bg-slate-950/40">
//               <div className="flex items-center gap-4">
//                 <div className="p-2 bg-school-primary/10 rounded-lg">
//                   <LayoutGrid className="h-4 w-4 text-school-primary" />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-sm font-bold text-white uppercase italic tracking-tight truncate">
//                     {activeSubject
//                       ? <>Registry: <span className="text-school-primary">{activeSubject.grade.displayName} {activeSubject.subject.name}</span></>
//                       : "Institutional Workspace: Pending Selection"}
//                   </p>
//                 </div>
//               </div>
//               <Button variant="outline" size="sm" asChild className="border-white/10 text-slate-400 rounded-xl uppercase text-[10px] font-black shrink-0">
//                 <Link href="/subjects/manage">Update Registry</Link>
//               </Button>
//             </CardContent>
//           </Card>
//         </section>

//         <div className="space-y-8">
//           {/* 1. TOPIC MONITOR */}
//           <section className="w-full">
//             <ActiveTopicCard
//               activeSubject={activeSubject as any}
//               activeTopic={activeTopic as any}
//               selectedTermId={termId || activeTopic?.termId || ""}
//               selectedWeek={week || String(activeTopic?.weekNumber || "")}
//             />
//           </section>

//           {/* 2. AI LESSON PLANNER */}
//           <section className="w-full scroll-mt-20" id="lesson-planner-section">
//             <AILessonPlanner
//               topicId={activeTopic?.id ?? ""}
//               schoolId={school?.id ?? ""}
//               lessonId={activeTopic?.lessons?.[0]?.id ?? ""}
//               topicTitle={activeTopic?.title ?? "Standard Registry"}
//               initialData={
//                 (activeTopic?.lessons?.[0]?.aiContent as unknown as EnhancedLessonContent) || null
//               }
//             />
//           </section>

//           {/* 3. PERFORMANCE & WHATSAPP */}
//           <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//             <div className="lg:col-span-2 h-full">
//               <PerformanceCharts
//                 gradeSubjectId={activeSubject?.id ?? ""}
//                 schoolId={school?.id ?? ""}
//                 initialPerformanceData={performanceResult.data}
//                 initialPerformanceError={performanceResult.error}
//               />
//             </div>
//             <div className="lg:col-span-1 h-full">
//               <WhatsAppStatus />
//             </div>
//           </section>
//         </div>

//         <footer className="pt-12 flex flex-col items-center gap-2 opacity-20 border-t border-white/5">
//           <AlertCircle className="h-4 w-4" />
//           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
//             Institutional_Control_Environment_v1.0
//           </p>
//         </footer>
//       </main>
//     </div>
//   )
// }


// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { useSearchParams } from 'next/navigation'
// import { useSchool } from '@/context/schoolProvider'

// // Components
// import { DashboardHeader } from '@/components/TeacherDashboard/dashboard-header'
// import { ActiveTopicCard } from '@/components/TeacherDashboard/active-topic-card'
// import { PerformanceCharts } from '@/components/TeacherDashboard/performance-charts'
// import { AILessonPlanner, type EnhancedLessonContent } from '@/components/TeacherDashboard/ai-learning-planner'
// import { WhatsAppStatus } from '@/components/TeacherDashboard/whatsapp-status'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'

// // Actions & Types
// import { getPerformanceDashboardData } from '@/app/actions/performance-data'
// import { PerformanceDashboardData } from '@/types/performanceData'
// import { LayoutGrid, AlertCircle } from 'lucide-react'

// // ── Types ───────────────────────────────────────────────────────────────────

// interface LessonReference {
//   id: string
//   aiContent: unknown 
// }

// interface DashboardTopic {
//   id: string
//   title: string
//   termId: string
//   weekNumber: number | null
//   lessons: LessonReference[]
// }

// interface DashboardSubject {
//   id: string
//   grade: { displayName: string }
//   subject: { name: string }
//   topics: DashboardTopic[]
//   studentSubjects?: { id: string }[]
// }

// /**
//  * FIXED: Interface explicitly defined to accept name: string | null.
//  * This matches the mapped payload from the Server Page.
//  */
// interface TeacherDashboardProps {
//   teacher: {
//     name: string | null;
//     selectedSubjects: DashboardSubject[];
//   }
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function TeacherDashboardContent({ teacher }: TeacherDashboardProps) {
//   const searchParams = useSearchParams()
//   const { school } = useSchool()

//   const subjectId = searchParams.get('subjectId')
//   const topicId = searchParams.get('topicId')
//   const termId = searchParams.get('termId')
//   const week = searchParams.get('week')

//   const [performanceResult, setPerformanceResult] = useState<{
//     data: PerformanceDashboardData | null
//     error: string | null
//   }>({ data: null, error: null })

//   // Find subject based on searchParams or fallback
//   const activeSubject = (teacher.selectedSubjects as DashboardSubject[]).find(s => s.id === subjectId)
//     ?? teacher.selectedSubjects[0]
//     ?? null;

//   // Find topic based on searchParams or fallback
//   const activeTopic = activeSubject?.topics.find((t: DashboardTopic) =>
//     t.id === topicId || (t.termId === termId && t.weekNumber === parseInt(week || '0'))
//   ) ?? activeSubject?.topics[0] ?? null;

//   const subjectsForHeader = teacher.selectedSubjects.map((gs) => ({
//     id: gs.id,
//     displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//     studentCount: gs.studentSubjects?.length ?? 0,
//   }));

//   useEffect(() => {
//     if (window.location.hash === "#lesson-planner-section") {
//       const timer = setTimeout(() => {
//         const element = document.getElementById("lesson-planner-section");
//         if (element) {
//           element.scrollIntoView({ behavior: "smooth" });
//         }
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     async function load() {
//       if (activeSubject?.id && school?.id) {
//         const result = await getPerformanceDashboardData(activeSubject.id, school.id)
//         setPerformanceResult(result)
//       }
//     }
//     load()
//   }, [activeSubject?.id, school?.id])

//   return (
//     <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">

//       <DashboardHeader
//         teacherName={teacher.name ?? 'Instructor'}
//         subjects={subjectsForHeader}
//         activeSubjectId={activeSubject?.id ?? ""}
//       />

//       <main className="flex-1 p-4 md:p-8 space-y-8 w-full max-w-7xl mx-auto overflow-x-hidden">

//         <section>
//           <Card className="bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
//             <CardContent className="flex items-center justify-between p-6 bg-slate-950/40">
//               <div className="flex items-center gap-4">
//                 <div className="p-2 bg-school-primary/10 rounded-lg">
//                   <LayoutGrid className="h-4 w-4 text-school-primary" />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-sm font-bold text-white uppercase italic tracking-tight truncate">
//                     {activeSubject
//                       ? <>Registry: <span className="text-school-primary">{activeSubject.grade.displayName} {activeSubject.subject.name}</span></>
//                       : "Institutional Workspace: Pending Selection"}
//                   </p>
//                 </div>
//               </div>
//               <Button variant="outline" size="sm" asChild className="border-white/10 text-slate-400 rounded-xl uppercase text-[10px] font-black shrink-0">
//                 <Link href="/subjects/manage">Update Registry</Link>
//               </Button>
//             </CardContent>
//           </Card>
//         </section>

//         <div className="space-y-8">
//           <section className="w-full">
//             <ActiveTopicCard
//               activeSubject={activeSubject as any}
//               activeTopic={activeTopic as any}
//               selectedTermId={termId || activeTopic?.termId || ""}
//               selectedWeek={week || String(activeTopic?.weekNumber || "")}
//             />
//           </section>

//           <section className="w-full scroll-mt-20" id="lesson-planner-section">
//             <AILessonPlanner
//               topicId={activeTopic?.id ?? ""}
//               schoolId={school?.id ?? ""}
//               lessonId={activeTopic?.lessons?.[0]?.id ?? ""}
//               topicTitle={activeTopic?.title ?? "Standard Registry"}
//               initialData={
//                 (activeTopic?.lessons?.[0]?.aiContent as unknown as EnhancedLessonContent) || null
//               }
//             />
//           </section>

//           <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//             <div className="lg:col-span-2 h-full">
//               <PerformanceCharts
//                 gradeSubjectId={activeSubject?.id ?? ""}
//                 schoolId={school?.id ?? ""}
//                 initialPerformanceData={performanceResult.data}
//                 initialPerformanceError={performanceResult.error}
//               />
//             </div>
//             <div className="lg:col-span-1 h-full">
//               <WhatsAppStatus />
//             </div>
//           </section>
//         </div>

//         <footer className="pt-12 flex flex-col items-center gap-2 opacity-20 border-t border-white/5">
//           <AlertCircle className="h-4 w-4" />
//           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
//             Institutional_Control_Environment_v1.0
//           </p>
//         </footer>
//       </main>
//     </div>
//   )
// }



// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { useSearchParams } from 'next/navigation'
// import { useSchool } from '@/context/schoolProvider'

// // Components
// import { DashboardHeader } from '@/components/TeacherDashboard/dashboard-header'
// import { ActiveTopicCard } from '@/components/TeacherDashboard/active-topic-card'
// import { PerformanceCharts } from '@/components/TeacherDashboard/performance-charts'
// import { AILessonPlanner, type EnhancedLessonContent } from '@/components/TeacherDashboard/ai-learning-planner'
// import { WhatsAppStatus } from '@/components/TeacherDashboard/whatsapp-status'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'

// // Actions & Types
// import { getPerformanceDashboardData } from '@/app/actions/performance-data'
// import { PerformanceDashboardData } from '@/types/performanceData'
// import { LayoutGrid, AlertCircle } from 'lucide-react'

// // ── Types (Exported for Server Page alignment) ──────────────────────────────

// export interface LessonReference {
//   id: string
//   aiContent: unknown 
// }

// export interface DashboardTopic {
//   id: string
//   title: string
//   termId: string
//   weekNumber: number | null
//   lessons: LessonReference[]
// }

// export interface DashboardSubject {
//   id: string
//   grade: { displayName: string }
//   subject: { name: string }
//   topics: DashboardTopic[]
//   studentSubjects?: { id: string }[]
// }

// export interface TeacherDashboardProps {
//   teacher: {
//     name: string | null;
//     selectedSubjects: DashboardSubject[];
//   }
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function TeacherDashboardContent({ teacher }: TeacherDashboardProps) {
//   const searchParams = useSearchParams()
//   const { school } = useSchool()

//   const subjectId = searchParams.get('subjectId')
//   const topicId = searchParams.get('topicId')
//   const termId = searchParams.get('termId')
//   const week = searchParams.get('week')

//   const [performanceResult, setPerformanceResult] = useState<{
//     data: PerformanceDashboardData | null
//     error: string | null
//   }>({ data: null, error: null })

//   // Find subject based on searchParams or fallback
//   const activeSubject = (teacher.selectedSubjects as DashboardSubject[]).find(s => s.id === subjectId)
//     ?? teacher.selectedSubjects[0]
//     ?? null;

//   // Find topic based on searchParams or fallback
//   const activeTopic = activeSubject?.topics.find((t: DashboardTopic) =>
//     t.id === topicId || (t.termId === termId && t.weekNumber === parseInt(week || '0'))
//   ) ?? activeSubject?.topics[0] ?? null;

//   const subjectsForHeader = teacher.selectedSubjects.map((gs) => ({
//     id: gs.id,
//     displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//     studentCount: gs.studentSubjects?.length ?? 0,
//   }));

//   useEffect(() => {
//     if (window.location.hash === "#lesson-planner-section") {
//       const timer = setTimeout(() => {
//         const element = document.getElementById("lesson-planner-section");
//         if (element) {
//           element.scrollIntoView({ behavior: "smooth" });
//         }
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     async function load() {
//       if (activeSubject?.id && school?.id) {
//         const result = await getPerformanceDashboardData(activeSubject.id, school.id)
//         setPerformanceResult(result)
//       }
//     }
//     load()
//   }, [activeSubject?.id, school?.id])

//   return (
//     <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">

//       <DashboardHeader
//         teacherName={teacher.name ?? 'Instructor'}
//         subjects={subjectsForHeader}
//         activeSubjectId={activeSubject?.id ?? ""}
//       />

//       <main className="flex-1 p-4 md:p-8 space-y-8 w-full max-w-7xl mx-auto overflow-x-hidden">

//         <section>
//           <Card className="bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
//             <CardContent className="flex items-center justify-between p-6 bg-slate-950/40">
//               <div className="flex items-center gap-4">
//                 <div className="p-2 bg-school-primary/10 rounded-lg">
//                   <LayoutGrid className="h-4 w-4 text-school-primary" />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-sm font-bold text-white uppercase italic tracking-tight truncate">
//                     {activeSubject
//                       ? <>Registry: <span className="text-school-primary">{activeSubject.grade.displayName} {activeSubject.subject.name}</span></>
//                       : "Institutional Workspace: Pending Selection"}
//                   </p>
//                 </div>
//               </div>
//               <Button variant="outline" size="sm" asChild className="border-white/10 text-slate-400 rounded-xl uppercase text-[10px] font-black shrink-0">
//                 <Link href="/subjects/manage">Update Registry</Link>
//               </Button>
//             </CardContent>
//           </Card>
//         </section>

//         <div className="space-y-8">
//           <section className="w-full">
//             <ActiveTopicCard
//               activeSubject={activeSubject as any}
//               activeTopic={activeTopic as any}
//               selectedTermId={termId || activeTopic?.termId || ""}
//               selectedWeek={week || String(activeTopic?.weekNumber || "")}
//             />
//           </section>

//           <section className="w-full scroll-mt-20" id="lesson-planner-section">
//             <AILessonPlanner
//               topicId={activeTopic?.id ?? ""}
//               schoolId={school?.id ?? ""}
//               lessonId={activeTopic?.lessons?.[0]?.id ?? ""}
//               topicTitle={activeTopic?.title ?? "Standard Registry"}
//               initialData={
//                 (activeTopic?.lessons?.[0]?.aiContent as unknown as EnhancedLessonContent) || null
//               }
//             />
//           </section>

//           <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//             <div className="lg:col-span-2 h-full">
//               <PerformanceCharts
//                 gradeSubjectId={activeSubject?.id ?? ""}
//                 schoolId={school?.id ?? ""}
//                 initialPerformanceData={performanceResult.data}
//                 initialPerformanceError={performanceResult.error}
//               />
//             </div>
//             <div className="lg:col-span-1 h-full">
//               <WhatsAppStatus />
//             </div>
//           </section>
//         </div>

//         <footer className="pt-12 flex flex-col items-center gap-2 opacity-20 border-t border-white/5">
//           <AlertCircle className="h-4 w-4" />
//           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
//             Institutional_Control_Environment_v1.0
//           </p>
//         </footer>
//       </main>
//     </div>
//   )
// }


// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { useSearchParams } from 'next/navigation'
// import { useSchool } from '@/context/schoolProvider'

// // Components
// import { DashboardHeader } from '@/components/TeacherDashboard/dashboard-header'
// import { ActiveTopicCard } from '@/components/TeacherDashboard/active-topic-card'
// import { PerformanceCharts } from '@/components/TeacherDashboard/performance-charts'
// import { AILessonPlanner, type EnhancedLessonContent } from '@/components/TeacherDashboard/ai-learning-planner'
// import { WhatsAppStatus } from '@/components/TeacherDashboard/whatsapp-status'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'

// // Actions & Types
// import { getPerformanceDashboardData } from '@/app/actions/performance-data'
// import { PerformanceDashboardData } from '@/types/performanceData'
// import { LayoutGrid, AlertCircle } from 'lucide-react'

// // ── Types (Exported for Server Page alignment) ──────────────────────────────

// export interface LessonReference {
//   id: string
//   aiContent: unknown 
// }

// export interface DashboardTopic {
//   id: string
//   title: string
//   termId: string
//   weekNumber: number | null
//   lessons: LessonReference[]
// }

// export interface DashboardSubject {
//   id: string
//   grade: { displayName: string }
//   subject: { name: string }
//   topics: DashboardTopic[]
//   studentSubjects?: { id: string }[]
// }

// export interface TeacherDashboardProps {
//   teacher: {
//     name: string | null;
//     selectedSubjects: DashboardSubject[];
//   }
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function TeacherDashboardContent({ teacher }: TeacherDashboardProps) {
//   const searchParams = useSearchParams()
//   const { school } = useSchool()

//   const subjectId = searchParams.get('subjectId')
//   const topicId = searchParams.get('topicId')
//   const termId = searchParams.get('termId')
//   const week = searchParams.get('week')

//   const [performanceResult, setPerformanceResult] = useState<{
//     data: PerformanceDashboardData | null
//     error: string | null
//   }>({ data: null, error: null })

//   // Find subject based on searchParams or fallback
//   const activeSubject = (teacher.selectedSubjects as DashboardSubject[]).find(s => s.id === subjectId)
//     ?? teacher.selectedSubjects[0]
//     ?? null;

//   // Find topic based on searchParams or fallback
//   const activeTopic = activeSubject?.topics.find((t: DashboardTopic) =>
//     t.id === topicId || (t.termId === termId && t.weekNumber === parseInt(week || '0'))
//   ) ?? activeSubject?.topics[0] ?? null;

//   const subjectsForHeader = teacher.selectedSubjects.map((gs) => ({
//     id: gs.id,
//     displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//     studentCount: gs.studentSubjects?.length ?? 0,
//   }));

//   useEffect(() => {
//     if (window.location.hash === "#lesson-planner-section") {
//       const timer = setTimeout(() => {
//         const element = document.getElementById("lesson-planner-section");
//         if (element) {
//           element.scrollIntoView({ behavior: "smooth" });
//         }
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     async function load() {
//       if (activeSubject?.id && school?.id) {
//         const result = await getPerformanceDashboardData(activeSubject.id, school.id)
//         setPerformanceResult(result)
//       }
//     }
//     load()
//   }, [activeSubject?.id, school?.id])

//   return (
//     <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">

//       <DashboardHeader
//         teacherName={teacher.name ?? 'Instructor'}
//         subjects={subjectsForHeader}
//         activeSubjectId={activeSubject?.id ?? ""}
//       />

//       <main className="flex-1 p-4 md:p-8 space-y-8 w-full max-w-7xl mx-auto overflow-x-hidden">

//         <section>
//           <Card className="bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
//             <CardContent className="flex items-center justify-between p-6 bg-slate-950/40">
//               <div className="flex items-center gap-4">
//                 <div className="p-2 bg-school-primary/10 rounded-lg">
//                   <LayoutGrid className="h-4 w-4 text-school-primary" />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-sm font-bold text-white uppercase italic tracking-tight truncate">
//                     {activeSubject
//                       ? <>Registry: <span className="text-school-primary">{activeSubject.grade.displayName} {activeSubject.subject.name}</span></>
//                       : "Institutional Workspace: Pending Selection"}
//                   </p>
//                 </div>
//               </div>
//               <Button variant="outline" size="sm" asChild className="border-white/10 text-slate-400 rounded-xl uppercase text-[10px] font-black shrink-0">
//                 <Link href="/subjects/manage">Update Registry</Link>
//               </Button>
//             </CardContent>
//           </Card>
//         </section>

//         <div className="space-y-8">
//           <section className="w-full">
//             <ActiveTopicCard
//               activeSubject={activeSubject as any}
//               activeTopic={activeTopic as any}
//               selectedTermId={termId || activeTopic?.termId || ""}
//               selectedWeek={week || String(activeTopic?.weekNumber || "")}
//             />
//           </section>

//           <section className="w-full scroll-mt-20" id="lesson-planner-section">
//             <AILessonPlanner
//               topicId={activeTopic?.id ?? ""}
//               schoolId={school?.id ?? ""}
//               lessonId={activeTopic?.lessons?.[0]?.id ?? ""}
//               topicTitle={activeTopic?.title ?? "Standard Registry"}
//               initialData={
//                 (activeTopic?.lessons?.[0]?.aiContent as unknown as EnhancedLessonContent) || null
//               }
//             />
//           </section>

//           <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//             <div className="lg:col-span-2 h-full">
//               <PerformanceCharts
//                 gradeSubjectId={activeSubject?.id ?? ""}
//                 schoolId={school?.id ?? ""}
//                 initialPerformanceData={performanceResult.data}
//                 initialPerformanceError={performanceResult.error}
//               />
//             </div>
//             <div className="lg:col-span-1 h-full">
//               <WhatsAppStatus />
//             </div>
//           </section>
//         </div>

//         <footer className="pt-12 flex flex-col items-center gap-2 opacity-20 border-t border-white/5">
//           <AlertCircle className="h-4 w-4" />
//           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
//             Institutional_Control_Environment_v1.0
//           </p>
//         </footer>
//       </main>
//     </div>
//   )
// }

// 'use client'

// import { useEffect } from 'react'
// import { useTeacherStore, type DashboardSubject } from '@/store/teacherDataStore'
// import { DashboardHeader } from '@/components/TeacherDashboard/dashboard-header'
// import { ActiveTopicCard } from '@/components/TeacherDashboard/active-topic-card'
// import { AILessonPlanner } from '@/components/TeacherDashboard/ai-learning-planner'
// import { PerformanceCharts } from '@/components/TeacherDashboard/performance-charts'
// import { WhatsAppStatus } from '@/components/TeacherDashboard/whatsapp-status'
// import { useSchool } from '@/context/schoolProvider'
// import { useSearchParams } from 'next/navigation'

// interface Props {
//   initialSubjects: DashboardSubject[];
//   teacherName: string;
// }

// export default function TeacherDashboardContent({ initialSubjects, teacherName }: Props) {
//   const searchParams = useSearchParams();
//   const { school } = useSchool();
  
//   // Pull actions and state from Store
//   const { 
//     setDashboardData, 
//     activeSubjectId, 
//     activeTopicId, 
//     selectedSubjects,
//     setActiveSubject 
//   } = useTeacherStore();

//   // 1. Hydrate the store with server data on mount
//   useEffect(() => {
//     setDashboardData(initialSubjects, teacherName);
//   }, [initialSubjects, teacherName, setDashboardData]);

//   // 2. Sync URL params with Store
//   useEffect(() => {
//     const urlSubjectId = searchParams.get('subjectId');
//     if (urlSubjectId && urlSubjectId !== activeSubjectId) {
//       setActiveSubject(urlSubjectId);
//     }
//   }, [searchParams, activeSubjectId, setActiveSubject]);

//   const activeSubject = selectedSubjects.find(s => s.id === activeSubjectId) || null;
//   const activeTopic = activeSubject?.topics.find(t => t.id === activeTopicId) || null;

//   return (
//     <div className="flex flex-col w-full min-h-screen bg-slate-950 text-slate-50">
//       <DashboardHeader 
//         teacherName={teacherName} 
//         subjects={selectedSubjects.map(s => ({
//             id: s.id,
//             displayName: `${s.grade.displayName} ${s.subject.name}`,
//             studentCount: s.studentSubjects?.length ?? 0
//         }))} 
//         activeSubjectId={activeSubjectId ?? ""}
//       />

//       <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
//         {/* Components now strictly use data from the resolved activeSubject/activeTopic */}
//         <ActiveTopicCard
//           activeSubject={activeSubject}
//           activeTopic={activeTopic}
//         />

//         <AILessonPlanner
//           topicId={activeTopic?.id ?? ""}
//           schoolId={school?.id ?? ""}
//           lessonId={activeTopic?.lessons?.[0]?.id ?? ""}
//           topicTitle={activeTopic?.title ?? ""}
//           initialData={activeTopic?.lessons?.[0]?.aiContent || null}
//         />

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             <PerformanceCharts 
//                 gradeSubjectId={activeSubjectId ?? ""} 
//                 schoolId={school?.id ?? ""} 
//             />
//           </div>
//           <WhatsAppStatus />
//         </div>
//       </main>
//     </div>
//   );
// }



// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { useSearchParams } from 'next/navigation'
// import { useSchool } from '@/context/schoolProvider'

// // Components
// import { DashboardHeader } from '@/components/TeacherDashboard/dashboard-header'
// import { ActiveTopicCard } from '@/components/TeacherDashboard/active-topic-card'
// import { AILessonPlanner, type EnhancedLessonContent } from '@/components/TeacherDashboard/ai-learning-planner'
// import { PerformanceCharts } from '@/components/TeacherDashboard/performance-charts'
// import { WhatsAppStatus } from '@/components/TeacherDashboard/whatsapp-status'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'

// // Actions & Types
// import { getPerformanceDashboardData } from '@/app/actions/performance-data'
// import { PerformanceDashboardData } from '@/types/performanceData'
// import { LayoutGrid, AlertCircle } from 'lucide-react'
// import { useTeacherStore, type DashboardSubject, type DashboardTopic } from '@/store/teacherDataStore'
// import { getErrorMessage } from '@/lib/error-handler'


// // ── Types ───────────────────────────────────────────────────────────────────

// interface Props {
//   initialSubjects: DashboardSubject[];
//   teacherName: string;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function TeacherDashboardContent({ initialSubjects, teacherName }: Props) {
//     const searchParams = useSearchParams();
//     const { school } = useSchool();
    
//     // Pull state and actions from the Zustand Store
//     const { 
//         setDashboardData, 
//         activeSubjectId, 
//         activeTopicId, 
//         selectedSubjects,
//         setActiveSubject 
//     } = useTeacherStore();

//     // 1. Extract Search Params
//     const subjectId = searchParams.get('subjectId');
//     const termId = searchParams.get('termId');
//     const week = searchParams.get('week');

//     const [performanceResult, setPerformanceResult] = useState<{
//         data: PerformanceDashboardData | null
//         error: string | null
//     }>({ data: null, error: null });

//     // 2. Initial Hydration (Sync server data to store)
//     useEffect(() => {
//         setDashboardData(initialSubjects, teacherName);
//     }, [initialSubjects, teacherName, setDashboardData]);

//     // 3. URL Param Sync (Update store if URL changes)
//     useEffect(() => {
//         if (subjectId && subjectId !== activeSubjectId) {
//             setActiveSubject(subjectId);
//         }
//     }, [subjectId, activeSubjectId, setActiveSubject]);

//     // 4. Resolve Active Models for Non-Store-Ready children (like AI Planner)
//     const activeSubject = selectedSubjects.find(s => s.id === activeSubjectId) || null;
//     const activeTopic = activeSubject?.topics.find(t => t.id === activeTopicId) || null;

//     // 5. Load Performance Data
//     useEffect(() => {
//         async function load() {
//             if (activeSubjectId && school?.id) {
//                 try {
//                     const result = await getPerformanceDashboardData(activeSubjectId, school.id);
//                     setPerformanceResult(result);
//                 } catch (err) {
//                     setPerformanceResult({ data: null, error: getErrorMessage(err) });
//                 }
//             }
//         }
//         load();
//     }, [activeSubjectId, school?.id]);

//     return (
//         <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">
            
//             <DashboardHeader
//                 teacherName={teacherName}
//                 subjects={selectedSubjects.map(s => ({
//                     id: s.id,
//                     displayName: `${s.grade.displayName} ${s.subject.name}`,
//                     studentCount: s.studentSubjects?.length ?? 0,
//                 }))}
//                 activeSubjectId={activeSubjectId ?? ""}
//             />

//             <main className="flex-1 p-4 md:p-8 space-y-8 w-full max-w-7xl mx-auto overflow-x-hidden">
                
//                 {/* Status Bar */}
//                 <section>
//                     <Card className="bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
//                         <CardContent className="flex items-center justify-between p-6 bg-slate-950/40">
//                             <div className="flex items-center gap-4">
//                                 <div className="p-2 bg-school-primary/10 rounded-lg">
//                                     <LayoutGrid className="h-4 w-4 text-school-primary" />
//                                 </div>
//                                 <div className="min-w-0">
//                                     <p className="text-sm font-bold text-white uppercase italic tracking-tight truncate">
//                                         {activeSubject 
//                                             ? <>Registry: <span className="text-school-primary">{activeSubject.grade.displayName} {activeSubject.subject.name}</span></>
//                                             : "Institutional Workspace: Pending Selection"}
//                                     </p>
//                                 </div>
//                             </div>
//                             <Button variant="outline" size="sm" asChild className="border-white/10 text-slate-400 rounded-xl uppercase text-[10px] font-black shrink-0">
//                                 <Link href="/subjects/manage">Update Registry</Link>
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 </section>

//                 <div className="space-y-8">
//                     {/* 
//                         FIXED: ActiveTopicCard now pulls subject/topic from store.
//                         We only pass the URL overrides.
//                     */}
//                     <section className="w-full">
//                         <ActiveTopicCard
//                             selectedTermId={termId || undefined}
//                             selectedWeek={week || undefined}
//                         />
//                     </section>

//                     {/* AI Lesson Planner Section */}
//                     <section className="w-full scroll-mt-20" id="lesson-planner-section">
//                         <AILessonPlanner
//                             topicId={activeTopic?.id ?? ""}
//                             schoolId={school?.id ?? ""}
//                             lessonId={activeTopic?.lessons?.[0]?.id ?? ""}
//                             topicTitle={activeTopic?.title ?? "Syllabus Module"}
//                             initialData={
//                                 (activeTopic?.lessons?.[0]?.aiContent as unknown as EnhancedLessonContent) || null
//                             }
//                         />
//                     </section>

//                     {/* Analytics Row */}
//                     <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//                         <div className="lg:col-span-2 h-full">
//                             <PerformanceCharts
//                                 schoolId={school?.id ?? ""}
//                                 initialPerformanceData={performanceResult.data}
//                                 initialPerformanceError={performanceResult.error}
//                             />
//                         </div>
//                         <div className="lg:col-span-1 h-full">
//                             <WhatsAppStatus />
//                         </div>
//                     </section>
//                 </div>

//                 <footer className="pt-12 flex flex-col items-center gap-2 opacity-20 border-t border-white/5">
//                     <AlertCircle className="h-4 w-4" />
//                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
//                         Institutional_Control_Environment_v1.0
//                     </p>
//                 </footer>
//             </main>
//         </div>
//     );
// }



'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useSchool } from '@/context/schoolProvider'

// Components
import { DashboardHeader } from '@/components/TeacherDashboard/dashboard-header'
import { ActiveTopicCard } from '@/components/TeacherDashboard/active-topic-card'
import { AILessonPlanner, type EnhancedLessonContent } from '@/components/TeacherDashboard/ai-learning-planner'
import { PerformanceCharts } from '@/components/TeacherDashboard/performance-charts'
import { WhatsAppStatus } from '@/components/TeacherDashboard/whatsapp-status'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Actions & Types
import { getPerformanceDashboardData } from '@/app/actions/performance-data'
import { PerformanceDashboardData } from '@/types/performanceData'
import { LayoutGrid, AlertCircle } from 'lucide-react'
import { useTeacherStore, type DashboardSubject, type DashboardTopic } from '@/store/teacherDataStore'
import { getErrorMessage } from '@/lib/error-handler'


// ── Types ───────────────────────────────────────────────────────────────────

interface Props {
  initialSubjects: DashboardSubject[];
  teacherName: string;
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function TeacherDashboardContent({ initialSubjects, teacherName }: Props) {
    const searchParams = useSearchParams();
    const { school } = useSchool();
    
    // Pull state and actions from the Zustand Store
    const { 
        setDashboardData, 
        activeSubjectId, 
        activeTopicId, 
        selectedSubjects,
        setActiveSubject 
    } = useTeacherStore();

    // 1. Extract Search Params
    const subjectId = searchParams.get('subjectId');
    const termId = searchParams.get('termId');
    const week = searchParams.get('week');

    const [performanceResult, setPerformanceResult] = useState<{
        data: PerformanceDashboardData | null
        error: string | null
    }>({ data: null, error: null });

    // 2. Initial Hydration (Sync server data to store)
    useEffect(() => {
        setDashboardData(initialSubjects, teacherName);
    }, [initialSubjects, teacherName, setDashboardData]);

    // 3. URL Param Sync (Update store if URL changes)
    useEffect(() => {
        if (subjectId && subjectId !== activeSubjectId) {
            setActiveSubject(subjectId);
        }
    }, [subjectId, activeSubjectId, setActiveSubject]);

    // 4. Resolve Active Models (Using imported types to resolve warnings)
    const activeSubject: DashboardSubject | null = selectedSubjects.find(s => s.id === activeSubjectId) || null;
    
    // FIXED: Explicitly typed activeTopic as DashboardTopic to utilize the import
    const activeTopic: DashboardTopic | null = activeSubject?.topics.find(t => t.id === activeTopicId) || null;

    // 5. Load Performance Data
    useEffect(() => {
        async function load() {
            if (activeSubjectId && school?.id) {
                try {
                    const result = await getPerformanceDashboardData(activeSubjectId, school.id);
                    setPerformanceResult(result);
                } catch (err) {
                    // Utilizing getErrorMessage utility
                    setPerformanceResult({ data: null, error: getErrorMessage(err) });
                }
            }
        }
        load();
    }, [activeSubjectId, school?.id]);

    return (
        <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">
            
            <DashboardHeader
                teacherName={teacherName}
                subjects={selectedSubjects.map(s => ({
                    id: s.id,
                    displayName: `${s.grade.displayName} ${s.subject.name}`,
                    studentCount: s.studentSubjects?.length ?? 0,
                }))}
                activeSubjectId={activeSubjectId ?? ""}
            />

            <main className="flex-1 p-4 md:p-8 space-y-8 w-full max-w-7xl mx-auto overflow-x-hidden">
                
                {/* Status Bar */}
                <section>
                    <Card className="bg-slate-900 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
                        <CardContent className="flex items-center justify-between p-6 bg-slate-950/40">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-school-primary/10 rounded-lg">
                                    <LayoutGrid className="h-4 w-4 text-school-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-white uppercase italic tracking-tight truncate">
                                        {activeSubject 
                                            ? <>Registry: <span className="text-school-primary">{activeSubject.grade.displayName} {activeSubject.subject.name}</span></>
                                            : "Institutional Workspace: Pending Selection"}
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" asChild className="border-white/10 text-slate-400 hover:text-school-primary rounded-xl uppercase text-[10px] font-black shrink-0">
                                <Link href="/subjects/manage">Update Registry</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </section>

                <div className="space-y-8">
                    {/* Active Topic Monitor */}
                    <section className="w-full">
                        <ActiveTopicCard
                            selectedTermId={termId || undefined}
                            selectedWeek={week || undefined}
                        />
                    </section>

                    {/* AI Lesson Planner Section */}
                    <section className="w-full scroll-mt-20" id="lesson-planner-section">
                        <AILessonPlanner
                            topicId={activeTopic?.id ?? ""}
                            schoolId={school?.id ?? ""}
                            lessonId={activeTopic?.lessons?.[0]?.id ?? ""}
                            topicTitle={activeTopic?.title ?? "Syllabus Module"}
                            initialData={
                                (activeTopic?.lessons?.[0]?.aiContent as unknown as EnhancedLessonContent) || null
                            }
                        />
                    </section>

                    {/* Analytics Row */}
                    <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 h-full">
                            <PerformanceCharts
                                schoolId={school?.id ?? ""}
                                initialPerformanceData={performanceResult.data}
                                initialPerformanceError={performanceResult.error}
                            />
                        </div>
                        <div className="lg:col-span-1 h-full">
                            <WhatsAppStatus />
                        </div>
                    </section>
                </div>

                <footer className="pt-12 flex flex-col items-center gap-2 opacity-20 border-t border-white/5">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                        Institutional_Control_Environment_v2.0
                    </p>
                </footer>
            </main>
        </div>
    );
}