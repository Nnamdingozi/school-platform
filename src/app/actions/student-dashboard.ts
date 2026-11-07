// "use server";

// import { prisma } from "@/lib/prisma";
// import { Role } from "@prisma/client";
// import { classifyNigerianSubject } from "@/lib/curriculum/nigeria";
// import { contentScope, academicCoreScope } from "@/lib/content-scope";

// /**
//  * FETCH STUDENT DASHBOARD DATA
//  * Rule 5: Scopes institutional data for school students.
//  * Rule 6: Provides global core progress for independent learners.
//  */
// export async function getStudentDashboardData(studentId: string) {
//     const profile = await prisma.profile.findUnique({
//         where: { id: studentId },
//         include: {
//             school: true,
//             curriculum: true,
//             classEnrollments: {
//                 include: {
//                     class: {
//                         include: {
//                             grade: true,
//                             teacher: { select: { name: true, email: true } }
//                         }
//                     }
//                 }
//             },
//             studentSubjects: {
//                 include: {
//                     gradeSubject: {
//                         include: {
//                             subject: true,
//                             topics: { include: { term: true }, orderBy: { weekNumber: 'asc' } },
//                             assessments: { where: { studentId } }
//                         }
//                     }
//                 }
//             },
//             selectedSubjects: {
//                 include: {
//                     subject: true,          // needed for gs.subject.name
//                     topics: {
//                         where: { schoolId: null },
//                         include: { term: true },    // needed for term.index in CurriculumView
//                         orderBy: { weekNumber: 'asc' }
//                     },
//                     assessments: {
//                         where: { studentId }    // needed for performance calculation
//                     }
//                 }
//             },
//             assessments: {
//                 take: 10,
//                 orderBy: { createdAt: 'desc' },
//                 include: {
//                     gradeSubject: { include: { subject: true } },
//                     feedbacks: { take: 1, orderBy: { createdAt: 'desc' } }
//                 }
//             }
//         }
//     });

//     if (!profile) return null;

//     const schoolId = profile.schoolId;
//     const enrollment = profile.classEnrollments[0];
//     const isIndependent = !schoolId || profile.role === Role.INDIVIDUAL_LEARNER;

//     // ── Scenario A: School Registered Student (Tier 2) ──
//     if (!isIndependent && enrollment?.class) {
//         const gradeLevel = enrollment.class.grade.level;
//         const isJSS = gradeLevel <= 9;

//         // 1. Fetch Grade-specific subjects (Tier 1 + Tier 2)
//         const allGradeSubjects = await prisma.gradeSubject.findMany({
//             where: {
//                 gradeId: enrollment.class.gradeId,
//                 ...academicCoreScope({ schoolId })
//             },
//             include: {
//                 subject: true,
//                 topics: {
//                     where: contentScope({ schoolId }),
//                     include: { term: true },
//                     orderBy: { weekNumber: 'asc' }
//                 },
//                 assessments: { where: { studentId } }
//             }
//         });

//         // 2. Apply Nigerian filtering logic for institutional curriculum
//         const effectiveSubjects = allGradeSubjects.filter(gs => {
//             if (isJSS) return true;
//             const { isCompulsory } = classifyNigerianSubject(gs.subject.name, false);
//             const isRegistered = profile.studentSubjects.some(ss => ss.gradeSubjectId === gs.id);
//             return isCompulsory || isRegistered;
//         });

//         // 3. Fetch institutional exams
//         const upcomingExams = await prisma.exam.findMany({
//             where: {
//                 classId: enrollment.class.id,
//                 schoolId: schoolId!,
//                 status: 'PUBLISHED'
//             },
//             take: 3,
//             orderBy: { createdAt: 'desc' }
//         });

//         return {
//             student: {
//                 id: profile.id,
//                 name: profile.name,
//                 email: profile.email,
//                 curriculumId: profile.curriculumId,
//             },
//             school: profile.school,
//             classroom: enrollment.class,
//             subjects: effectiveSubjects,
//             upcomingExams,
//             recentAssessments: profile.assessments,
//             isIndependent: false
//         };
//     }

//     // ── Scenario B: Independent Learner (Tier 3) ──
//     // Rule 6: Learner manages their own syllabus from Global Core
    
//     // If the learner has not explicitly linked via selectedSubjects yet or we want to ensure
//     // all global subjects for their profile's gradeId are fetched automatically:
//     let resolvedSubjects = profile.selectedSubjects;

//     if (resolvedSubjects.length === 0 && profile.gradeId) {
//         const allGlobalGradeSubjects = await prisma.gradeSubject.findMany({
//             where: {
//                 schoolId: null,
//                 gradeId: profile.gradeId,
//             },
//             include: {
//                 subject: true,
//                 topics: {
//                     where: { schoolId: null },
//                     include: { term: true },
//                     orderBy: { weekNumber: 'asc' }
//                 },
//                 assessments: {
//                     where: { studentId }
//                 }
//             }
//         });
//         resolvedSubjects = allGlobalGradeSubjects;
//     }

//     const personalSubjects = resolvedSubjects.map(gs => ({
//         ...gs,
//         // Ensure topics are filtered to Tier-1 only
//         topics: gs.topics.filter(t => t.schoolId === null || t.isGlobal)
//     }));

//     console.log('[SCENARIO_B_DEBUG]:', JSON.stringify({
//         subjectCount: personalSubjects.length,
//         firstSubjectTopics: personalSubjects[0]?.topics?.slice(0, 2),
//     }, null, 2));

//     return {
//         student: {
//             id: profile.id,
//             name: profile.name,
//             email: profile.email,
//             curriculumId: profile.curriculumId,
//         },
//         school: null,
//         classroom: null,
//         subjects: personalSubjects, 
//         upcomingExams: [],
//         recentAssessments: profile.assessments,
//         isIndependent: true
//     };
// }


"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { classifyNigerianSubject } from "@/lib/curriculum/nigeria";
import { contentScope, academicCoreScope } from "@/lib/content-scope";

/**
 * FETCH STUDENT DASHBOARD DATA
 * Rule 5: Scopes institutional data for school students.
 * Rule 6: Provides global core progress for independent learners.
 */

export async function getStudentDashboardData(studentId: string) {
    const profile = await prisma.profile.findUnique({
        where: { id: studentId },
        include: {
            school: true,
            curriculum: true,
            classEnrollments: {
                include: {
                    class: {
                        include: {
                            grade: true,
                            teacher: { select: { name: true, email: true } }
                        }
                    }
                }
            },
            // ── Primary source for Individual Learners: StudentSubject table ──
            studentSubjects: {
                include: {
                    gradeSubject: {
                        include: {
                            subject: true,
                            grade: true, // Included for contextual labeling
                            topics: { 
                                where: { schoolId: null },
                                include: { term: true }, 
                                orderBy: { weekNumber: 'asc' } 
                            },
                            assessments: { where: { studentId } }
                        }
                    }
                }
            },
            selectedSubjects: {
                include: {
                    subject: true,          
                    topics: {
                        where: { schoolId: null },
                        include: { term: true },    
                        orderBy: { weekNumber: 'asc' }
                    },
                    assessments: {
                        where: { studentId }    
                    }
                }
            },
            assessments: {
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    gradeSubject: { include: { subject: true } },
                    feedbacks: { take: 1, orderBy: { createdAt: 'desc' } }
                }
            }
        }
    });

    if (!profile) return null;

    const schoolId = profile.schoolId;
    const enrollment = profile.classEnrollments[0];
    const isIndependent = !schoolId || profile.role === Role.INDIVIDUAL_LEARNER;

    // ── Scenario A: School Registered Student (Tier 2) ──
    if (!isIndependent && enrollment?.class) {
        const gradeLevel = enrollment.class.grade.level;
        const isJSS = gradeLevel <= 9;

        const allGradeSubjects = await prisma.gradeSubject.findMany({
            where: {
                gradeId: enrollment.class.gradeId,
                ...academicCoreScope({ schoolId })
            },
            include: {
                subject: true,
                topics: {
                    where: contentScope({ schoolId }),
                    include: { term: true },
                    orderBy: { weekNumber: 'asc' }
                },
                assessments: { where: { studentId } }
            }
        });

        const effectiveSubjects = allGradeSubjects.filter(gs => {
            if (isJSS) return true;
            const { isCompulsory } = classifyNigerianSubject(gs.subject.name, false);
            const isRegistered = profile.studentSubjects.some(ss => ss.gradeSubjectId === gs.id);
            return isCompulsory || isRegistered;
        });

        const upcomingExams = await prisma.exam.findMany({
            where: {
                classId: enrollment.class.id,
                schoolId: schoolId!,
                status: 'PUBLISHED'
            },
            take: 3,
            orderBy: { createdAt: 'desc' }
        });

        return {
            student: {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                curriculumId: profile.curriculumId,
            },
            school: profile.school,
            classroom: enrollment.class,
            subjects: effectiveSubjects,
            upcomingExams,
            recentAssessments: profile.assessments,
            isIndependent: false
        };
    }

    // ── Scenario B: Independent Learner (Tier 3) ──
    // Rule 6: Fetch strictly from the StudentSubject junction table linked to their library
    
    const personalSubjects = profile.studentSubjects.map(ss => {
        const gs = ss.gradeSubject;
        return {
            ...gs,
            topics: gs.topics.filter(t => t.schoolId === null || t.isGlobal)
        };
    });

    console.log('[SCENARIO_B_DEBUG]:', JSON.stringify({
        librarySubjectCount: personalSubjects.length,
        firstSubjectTopics: personalSubjects[0]?.topics?.slice(0, 2),
    }, null, 2));

    return {
        student: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            curriculumId: profile.curriculumId,
        },
        school: null,
        classroom: null,
        subjects: personalSubjects, // 👈 Strictly pulls from studentSubjects table
        upcomingExams: [],
        recentAssessments: profile.assessments,
        isIndependent: true
    };
}