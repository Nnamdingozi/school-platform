// 'use client';

// import Link from "next/link";
// import { DashboardHeader } from "@/components/TeacherDashboard/dashboard-header";
// import { ActiveTopicCard } from "@/components/TeacherDashboard/active-topic-card";
// import { PerformanceCharts } from "@/components/TeacherDashboard/performance-charts";
// import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner";
// import { WhatsAppStatus } from "@/components/TeacherDashboard/whatsapp-status";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useSchool } from "@/context/schoolProvider";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { getPerformanceDashboardData } from "@/app/actions/performance-data";
// // ✅ FIX 1: Removed unused 'Assessment' import
// import { ProfileInStore } from "@/types/profile";
// import { PerformanceDashboardData } from "@/types/performanceData";
// // ✅ FIX 2: Import the correct type from the planner component
// import type { EnhancedLessonContent } from "./ai-learning-planner"; 

// import { isTeacherProfile } from '@/types/profile'

// const { profile } = useProfileStore()

// // Narrow to ProfileInStore before accessing teacher-specific fields
// if (!isTeacherProfile(profile)) return null

// // Now TypeScript knows profile.selectedSubjects exists
// const activeSubject = profile.selectedSubjects.find(s => s.id === subjectId)
//     ?? profile.selectedSubjects[0]

// export const dynamic = "force-dynamic";

// interface TeacherDashboardContentProps {
//     teacher: ProfileInStore | null;
// }

// function TeacherDashboardContent({ teacher }: TeacherDashboardContentProps) {
//     const searchParams = useSearchParams();
//     const subjectId = searchParams.get('subjectId') ?? undefined;
//     const topicId = searchParams.get('topicId') ?? undefined;
//     const termId = searchParams.get('termId') ?? undefined;
//     const week = searchParams.get('week') ?? undefined;

//     const { school } = useSchool();

//     const [performanceResult, setPerformanceResult] = useState<{ data: PerformanceDashboardData | null; error: string | null }>({
//         data: null,
//         error: null,
//     });

//     useEffect(() => {
//         async function loadPerformanceData() {
//             if (teacher?.selectedSubjects?.[0] && school?.id) {
//                 const result = await getPerformanceDashboardData(teacher.selectedSubjects[0].id, school.id);
//                 setPerformanceResult(result);
//             }
//         }
//         loadPerformanceData();
//     }, [teacher, school]); // ✅ FIX 3: Added 'school' to the dependency array

//     if (!teacher) {
//         return <div className="p-20 text-center">Teacher not found.</div>;
//     }
//     if (!school) {
//         return <div className="p-20 text-center">School data not available.</div>;
//     }

//     const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId)
//         ?? teacher.selectedSubjects[0];

//     if (!activeSubject) return <div className="p-20 text-center">No subjects assigned.</div>;

//     let activeTopic = activeSubject.topics.find(t => t.id === topicId);
//     if (!activeTopic && termId && week) {
//         activeTopic = activeSubject.topics.find(t =>
//             t.termId === termId && t.weekNumber === parseInt(week || '0')
//         );
//     }
//     activeTopic = activeTopic ?? activeSubject.topics[0];

//     const subjectsForHeader = teacher.selectedSubjects.map((gs) => ({
//         id: gs.id,
//         displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//         studentCount: gs.enrollments?.length ?? 0,
//     }));

//     return (
//         <div className="flex flex-col w-full min-h-screen overflow-x-hidden">
//             <DashboardHeader
//                 teacherName={teacher.name ?? "Teacher"}
//                 subjects={subjectsForHeader}
//                 activeSubjectId={activeSubject.id}
//             />

//             <main className="flex-1 p-4 md:p-6 space-y-6 w-full overflow-x-hidden">
//                 <section>
//                     <Card className="border-dashed bg-muted/30">
//                         <CardContent className="flex items-center justify-between p-4">
//                             <p className="text-sm text-muted-foreground">
//                                 Viewing: <strong>{activeSubject.grade.displayName} {activeSubject.subject.name}</strong>
//                             </p>
//                             <Button variant="outline" size="sm" asChild>
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
//                     <AILessonPlanner
//     topicId={activeTopic?.id ?? ""}
//     lessonId={activeTopic?.lessons?.id ?? ""}
//     topicTitle={activeTopic?.title ?? "General Subject"}
//     initialData={activeTopic?.lessons?.aiContent as unknown as EnhancedLessonContent}
// />
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
//     );
// }

// export default TeacherDashboardContent;



'use client'

import Link from 'next/link'
import { DashboardHeader } from '@/components/TeacherDashboard/dashboard-header'
import { ActiveTopicCard } from '@/components/TeacherDashboard/active-topic-card'
import { PerformanceCharts } from '@/components/TeacherDashboard/performance-charts'
import { AILessonPlanner } from '@/components/TeacherDashboard/ai-learning-planner'
import { WhatsAppStatus } from '@/components/TeacherDashboard/whatsapp-status'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSchool } from '@/context/schoolProvider'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getPerformanceDashboardData } from '@/app/actions/performance-data'
import { ProfileInStore, isTeacherProfile } from '@/types/profile'
import { PerformanceDashboardData } from '@/types/performanceData'
import type { EnhancedLessonContent } from './ai-learning-planner'

export const dynamic = 'force-dynamic'

interface TeacherDashboardContentProps {
    teacher: ProfileInStore | null
}

function TeacherDashboardContent({ teacher }: TeacherDashboardContentProps) {
    const searchParams = useSearchParams()
    const subjectId    = searchParams.get('subjectId') ?? undefined
    const topicId      = searchParams.get('topicId')   ?? undefined
    const termId       = searchParams.get('termId')    ?? undefined
    const week         = searchParams.get('week')      ?? undefined

    const { school } = useSchool()

    const [performanceResult, setPerformanceResult] = useState<{
        data:  PerformanceDashboardData | null
        error: string | null
    }>({ data: null, error: null })

    useEffect(() => {
        async function loadPerformanceData() {
            if (teacher?.selectedSubjects?.[0] && school?.id) {
                const result = await getPerformanceDashboardData(
                    teacher.selectedSubjects[0].id,
                    school.id
                )
                setPerformanceResult(result)
            }
        }
        loadPerformanceData()
    }, [teacher, school])

    // ── Guards ─────────────────────────────────────────────────────────────
    if (!teacher) {
        return <div className="p-20 text-center">Teacher not found.</div>
    }

    if (!school) {
        return <div className="p-20 text-center">School data not available.</div>
    }

    // ── Type guard — narrows teacher to ProfileInStore ─────────────────────
    // This ensures selectedSubjects is available before accessing it
    if (!isTeacherProfile(teacher)) {
        return <div className="p-20 text-center">Invalid profile type.</div>
    }

    // ── From here TypeScript knows teacher.selectedSubjects exists ─────────
    const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId)
        ?? teacher.selectedSubjects[0]

    if (!activeSubject) {
        return <div className="p-20 text-center">No subjects assigned.</div>
    }

    let activeTopic = activeSubject.topics.find(t => t.id === topicId)
    if (!activeTopic && termId && week) {
        activeTopic = activeSubject.topics.find(t =>
            t.termId === termId && t.weekNumber === parseInt(week || '0')
        )
    }
    activeTopic = activeTopic ?? activeSubject.topics[0]

    const subjectsForHeader = teacher.selectedSubjects.map(gs => ({
        id:           gs.id,
        displayName:  `${gs.grade.displayName} ${gs.subject.name}`,
        studentCount: gs.enrollments?.length ?? 0,
    }))

    return (
        <div className="flex flex-col w-full min-h-screen overflow-x-hidden">
            <DashboardHeader
                teacherName={teacher.name ?? 'Teacher'}
                subjects={subjectsForHeader}
                activeSubjectId={activeSubject.id}
            />

            <main className="flex-1 p-4 md:p-6 space-y-6 w-full overflow-x-hidden">
                <section>
                    <Card className="border-dashed bg-muted/30">
                        <CardContent className="flex items-center justify-between p-4">
                            <p className="text-sm text-muted-foreground">
                                Viewing:{' '}
                                <strong>
                                    {activeSubject.grade.displayName} {activeSubject.subject.name}
                                </strong>
                            </p>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/subjects/manage?role=teacher">
                                    Edit Assignments
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </section>

                <div className="w-full max-w-7xl mx-auto space-y-6">
                    <section className="w-full">
                        <ActiveTopicCard
                            key={activeSubject.id}
                            activeSubject={activeSubject}
                            activeTopic={activeTopic}
                            selectedTermId={termId || activeTopic?.termId}
                            selectedWeek={week || String(activeTopic?.weekNumber)}
                        />
                    </section>

                    <section className="w-full">
                        <AILessonPlanner
                            topicId={activeTopic?.id ?? ''}
                            lessonId={activeTopic?.lessons?.id ?? ''}
                            topicTitle={activeTopic?.title ?? 'General Subject'}
                            initialData={
                                activeTopic?.lessons?.aiContent as unknown as EnhancedLessonContent
                            }
                        />
                    </section>

                    <section className="w-full">
                        <PerformanceCharts
                            gradeSubjectId={activeSubject.id}
                            schoolId={school.id}
                            initialPerformanceData={performanceResult.data}
                            initialPerformanceError={performanceResult.error}
                        />
                    </section>

                    <section className="w-full">
                        <WhatsAppStatus />
                    </section>
                </div>
            </main>
        </div>
    )
}

export default TeacherDashboardContent