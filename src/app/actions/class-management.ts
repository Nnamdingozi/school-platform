

// 'use server'

// import { prisma } from '@/lib/prisma'
// import { ActivityType, Role, Prisma } from '@prisma/client'
// import { getErrorMessage } from '@/lib/error-handler'
// import { logActivity } from '@/lib/activitylogger'

// // ── Types & Interfaces ─────────────────────────────────────────────────────────

// export interface ClassRow {
//   id: string
//   name: string
//   gradeDisplayName: string
//   teacherName: string | null
//   studentCount: number
// }

// export interface ImportClassesRow {
//   name: string
//   grade_level: string | number
// }

// export interface EnrollStudentRow {
//   student_email: string
//   class_name: string
// }

// export interface BulkImportResult {
//   successCount: number
//   errorCount: number
//   errors: { rowIndex: number; message: string }[]
// }

// export interface BulkEnrollSummary {
//   successCount: number
//   errorCount: number
//   errors: { rowIndex: number; message: string }[]
//   missingStudents: string[]
// }

// export interface ManagementHelpers {
//   grades: (Prisma.GradeGetPayload<{
//     include: { gradeSubjects: { include: { subject: { select: { name: true } } } } }
//   }>)[]
//   teachers: { id: string; name: string | null }[]
//   students: { id: string; name: string | null; email: string }[]
// }

// // ── Queries ─────────────────────────────────────────────────────────────────────

// /**
//  * Fetches all classes for a school with counts of enrolled students
//  */
// export async function getClassesForManagement(
//   schoolId: string
// ): Promise<ClassRow[]> {
//   try {
//     const classes = await prisma.class.findMany({
//       where: { schoolId },
//       orderBy: { name: 'asc' },
//       include: {
//         grade: { select: { displayName: true } },
//         teacher: { select: { name: true } },
//         enrollments: { select: { id: true } },
//       },
//     })

//     return classes.map((c) => ({
//       id: c.id,
//       name: c.name,
//       gradeDisplayName: c.grade.displayName,
//       teacherName: c.teacher?.name ?? null,
//       studentCount: c.enrollments.length,
//     }))
//   } catch (err) {
//     console.error('getClassesForManagement error:', getErrorMessage(err))
//     return []
//   }
// }

// /**
//  * Fetches grades (with subjects), teachers, and students to populate UI helpers
//  */
// export async function getManagementHelpers(schoolId: string): Promise<ManagementHelpers> {
//   try {
//     const school = await prisma.school.findUnique({
//       where: { id: schoolId },
//       select: { curriculumId: true }
//     });

//     const [grades, teachers, students] = await Promise.all([
//       prisma.grade.findMany({
//         where: { OR: [{ schoolId }, { curriculumId: school?.curriculumId }] },
//         include: {
//           gradeSubjects: {
//             include: {
//               subject: { select: { name: true } }
//             }
//           }
//         },
//         orderBy: { level: 'asc' },
//       }),
//       prisma.profile.findMany({
//         where: { schoolId, role: Role.TEACHER },
//         select: { id: true, name: true },
//         orderBy: { name: 'asc' },
//       }),
//       prisma.profile.findMany({
//         where: { schoolId, role: Role.STUDENT },
//         select: { id: true, name: true, email: true },
//         orderBy: { name: 'asc' },
//       })
//     ]);

//     return { 
//       grades: grades as ManagementHelpers['grades'], 
//       teachers, 
//       students 
//     };
//   } catch (err) {
//     console.error('getManagementHelpers error:', getErrorMessage(err))
//     return { grades: [], teachers: [], students: [] };
//   }
// }

// /**
//  * Search students by name or email (Server-side)
//  */
// export async function searchStudents(schoolId: string, query: string): Promise<{ id: string; name: string | null; email: string }[]> {
//   if (!query || query.length < 2) return [];

//   try {
//     return await prisma.profile.findMany({
//       where: {
//         schoolId,
//         role: Role.STUDENT,
//         OR: [
//           { name: { contains: query, mode: 'insensitive' } },
//           { email: { contains: query, mode: 'insensitive' } }
//         ]
//       },
//       select: { id: true, name: true, email: true },
//       take: 10,
//     });
//   } catch (err) {
//     console.error('searchStudents error:', getErrorMessage(err))
//     return [];
//   }
// }

// // ── Placement Logic (Room Assignment) ───────────────────────────────────────────

// /**
//  * Places a single student in a class room (Class Placement Only)
//  */
// export async function enrollSingleStudent(
//   schoolId: string,
//   actorId: string,
//   actorName: string | null,
//   actorRole: string | null,
//   data: { studentId: string; classId: string }
// ) {
//   try {
//     const [student, klass] = await Promise.all([
//       prisma.profile.findUnique({ where: { id: data.studentId }, select: { id: true, name: true } }),
//       prisma.class.findUnique({ where: { id: data.classId }, select: { id: true, name: true } })
//     ]);

//     if (!student || !klass) throw new Error("Student or Class not found");

//     await prisma.classEnrollment.create({
//       data: {
//         studentId: student.id,
//         classId: klass.id,
//         schoolId,
//       }
//     });

//     await logActivity({
//       schoolId,
//       actorId,
//       actorName,
//       actorRole,
//       type: ActivityType.STUDENT_ENROLLED, // Standard Enum
//       title: 'Student Placement',
//       description: `${student.name} assigned to classroom: ${klass.name}.`,
//       metadata: { studentId: student.id, classId: klass.id }
//     });

//     return { success: true as const };
//   } catch (err) {
//     return { success: false as const, error: getErrorMessage(err) };
//   }
// }

// /**
//  * Bulk placement from CSV (Placement Only)
//  */
// export async function enrollStudentsFromCsv(
//   schoolId: string,
//   actorId: string,
//   actorName: string | null,
//   actorRole: string | null,
//   rows: EnrollStudentRow[]
// ): Promise<BulkEnrollSummary> {
//   const errors: BulkEnrollSummary['errors'] = []
//   const missingStudents: string[] = []
//   let successCount = 0

//   try {
//     await prisma.$transaction(async (tx) => {
//       for (let index = 0; index < rows.length; index++) {
//         const raw = rows[index]
//         const email = (raw.student_email ?? '').trim().toLowerCase()
//         const className = (raw.class_name ?? '').trim()

//         if (!email || !className) {
//           errors.push({ rowIndex: index, message: 'Missing student_email or class_name' });
//           continue;
//         }

//         const [student, klass] = await Promise.all([
//           tx.profile.findFirst({ where: { email, schoolId }, select: { id: true, name: true } }),
//           tx.class.findFirst({ where: { name: className, schoolId }, select: { id: true, name: true } }),
//         ])

//         if (!student) {
//           missingStudents.push(email);
//           errors.push({ rowIndex: index, message: `Student ${email} not found.` });
//           continue;
//         }

//         if (!klass) {
//           errors.push({ rowIndex: index, message: `Class room "${className}" not found.` });
//           continue;
//         }

//         const existing = await tx.classEnrollment.findFirst({
//           where: { studentId: student.id, classId: klass.id },
//         });

//         if (existing) continue;

//         await tx.classEnrollment.create({
//           data: { studentId: student.id, classId: klass.id, schoolId },
//         });

//         successCount += 1;
//       }
//     });

//     await logActivity({
//       schoolId,
//       actorId,
//       actorName,
//       actorRole,
//       type: ActivityType.STUDENT_ENROLLED,
//       title: 'Bulk Class Placement',
//       description: `Successfully placed ${successCount} students into classrooms via CSV.`,
//     });

//     return { successCount, errorCount: errors.length, errors, missingStudents };
//   } catch (err) {
//     return { successCount: 0, errorCount: rows.length, errors: [{ rowIndex: -1, message: getErrorMessage(err) }], missingStudents };
//   }
// }

// // ── Manual Creation ─────────────────────────────────────────────────────────────

// /**
//  * Creates a physical class room
//  */
// export async function createSingleClass(
//   schoolId: string,
//   actorId: string,
//   actorName: string | null,
//   actorRole: string | null,
//   data: { name: string; gradeId: string; teacherId?: string }
// ) {
//   try {
//     const newClass = await prisma.class.create({
//       data: {
//         name: data.name,
//         gradeId: data.gradeId,
//         schoolId,
//         teacherId: data.teacherId || actorId,
//       },
//       include: { grade: { select: { displayName: true } } },
//     })

//     await logActivity({
//       schoolId,
//       actorId,
//       actorName,
//       actorRole,
//       type: ActivityType.CLASS_CREATED,
//       title: `Class Created: ${newClass.name}`,
//       description: `Room "${newClass.name}" configured for grade ${newClass.grade.displayName}.`,
//       metadata: { classId: newClass.id },
//     })

//     return { success: true as const }
//   } catch (err) {
//     return { success: false as const, error: getErrorMessage(err) }
//   }
// }

// /**
//  * Bulk create class rooms from CSV
//  */
// export async function importClassesFromCsv(
//   schoolId: string,
//   actorId: string,
//   actorName: string | null,
//   actorRole: string | null,
//   rows: ImportClassesRow[]
// ): Promise<BulkImportResult> {
//   const errors: BulkImportResult['errors'] = []
//   let successCount = 0

//   try {
//     for (let index = 0; index < rows.length; index++) {
//       const raw = rows[index]
//       const name = (raw.name ?? '').trim()
//       const gradeLevel = Number(raw.grade_level)

//       if (!name || Number.isNaN(gradeLevel)) {
//         errors.push({ rowIndex: index, message: 'Invalid name or grade level.' });
//         continue;
//       }

//       const grade = await prisma.grade.findFirst({
//         where: { schoolId, level: gradeLevel },
//         select: { id: true, displayName: true },
//       })

//       if (!grade) {
//         errors.push({ rowIndex: index, message: `Grade Level ${gradeLevel} not found.` });
//         continue;
//       }

//       await prisma.class.create({
//         data: { name, gradeId: grade.id, schoolId, teacherId: actorId },
//       });

//       successCount += 1;
//     }

//     return { successCount, errorCount: errors.length, errors };
//   } catch (err) {
//     return { successCount: 0, errorCount: rows.length, errors: [{ rowIndex: -1, message: getErrorMessage(err) }] };
//   }
// }

// /**
//  * Assigns a lead teacher to a classroom
//  */
// export async function assignTeacherToClassWithNotify(
//   schoolId: string,
//   classId: string,
//   teacherId: string,
//   actorId: string,
//   actorName: string | null,
//   actorRole: string | null
// ) {
//   try {
//     const updated = await prisma.class.update({
//       where: { id: classId, schoolId },
//       data: { teacherId },
//       include: { grade: { select: { displayName: true } } },
//     })

//     await prisma.notification.create({
//       data: {
//         userId: teacherId,
//         message: `You have been assigned as the lead teacher for ${updated.name}.`,
//       }
//     });

//     await logActivity({
//       schoolId,
//       actorId,
//       actorName,
//       actorRole,
//       type: ActivityType.TEACHER_ASSIGNED,
//       title: 'Teacher Assignment',
//       description: `Class "${updated.name}" assigned to a lead teacher.`,
//     });

//     return { success: true as const }
//   } catch (err) {
//     return { success: false as const, error: getErrorMessage(err) }
//   }  
// }



// "use server";

// import { prisma } from "@/lib/prisma";
// import { ActivityType, Role, Prisma } from '@prisma/client'
// import { getErrorMessage } from '@/lib/error-handler'
// import { logActivity } from '@/lib/activitylogger'

// export async function getClassDashboardData(profileId: string) {
//   try {
//     const user = await prisma.profile.findUnique({
//       where: { id: profileId },
//       include: { school: true },
//     });

//     if (!user) throw new Error("User not found");

//     // --- LOGIC FOR ADMIN ---
//     if (user.role === Role.SCHOOL_ADMIN || user.role === Role.SUPER_ADMIN) {
//       return await prisma.class.findMany({
//         where: { schoolId: user.schoolId },
//         include: {
//           grade: true,
//           teacher: true,
//           enrollments: { include: { student: true } },
//         },
//       });
//     }

//     // --- LOGIC FOR TEACHER ---
//     if (user.role === Role.TEACHER) {
//       console.log("Fetching classes for Teacher ID:", profileId);
      
//       const classes = await prisma.class.findMany({
//         where: { teacherId: profileId },
//         include: {
//           grade: { include: { gradeSubjects: { include: { subject: true } } } },
//           enrollments: {
//             include: {
//               student: {
//                 include: {
//                   assessments: true,
//                   studentSubjects: true,
//                 },
//               },
//             },
//           },
//         },
//       });
    
//       console.log(`Found ${classes.length} classes for this teacher.`);
    
//       if (classes.length === 0) return []; 

//       // Calculate Statistics for Teacher (Averages, Top Students)
//       return classes.map((cls) => {
//         const students = cls.enrollments.map((e) => e.student);
        
//         // Flatten all assessments in this class
//         const allAssessments = students.flatMap((s) => s.assessments);

//         // Group by Subject to find "Best Student" and "Average"
//         const subjectStats = cls.grade.gradeSubjects.map((gs) => {
//           const subjectAssessments = allAssessments.filter(
//             (a) => a.gradeSubjectId === gs.id
//           );
          
//           const avg = subjectAssessments.length 
//             ? subjectAssessments.reduce((acc, curr) => acc + (curr.score || 0), 0) / subjectAssessments.length 
//             : 0;

//           // Find student with highest total score in this subject
//           const studentScores = students.map(s => {
//             const total = s.assessments
//               .filter(a => a.gradeSubjectId === gs.id)
//               .reduce((acc, curr) => acc + (curr.score || 0), 0);
//             return { name: s.name, score: total };
//           });

//           const best = studentScores.sort((a, b) => b.score - a.score)[0];

//           return {
//             subjectName: gs.subject.name,
//             average: avg.toFixed(2),
//             bestStudent: best?.score > 0 ? best.name : "N/A",
//           };
//         });

//         return { ...cls, students, subjectStats };
//       });
//     }

//     // --- LOGIC FOR STUDENT ---
//     if (user.role === Role.STUDENT) {
//       const enrollment = await prisma.classEnrollment.findFirst({
//         where: { studentId: profileId },
//         include: {
//           class: {
//             include: {
//               teacher: true,
//               grade: true,
//               enrollments: {
//                 include: {
//                   student: {
//                     select: { id: true, name: true, phone: true }, // Privacy: No scores
//                   },
//                 },
//               },
//             },
//           },
//         },
//       });

//       if (!enrollment) return null;

//       // Get subjects this specific student is offering
//       const mySubjects = await prisma.studentSubject.findMany({
//         where: { studentId: profileId },
//         include: { gradeSubject: { include: { subject: true } } },
//       });

//       return {
//         ...enrollment.class,
//         classmates: enrollment.class?.enrollments.map((e) => e.student),
//         mySubjects: mySubjects.map((ms) => ms.gradeSubject.subject.name),
//       };
//     }

//     return null;
//   } catch (error) {
//     console.error("Error fetching class data:", error);
//     throw error;
//   }
// }


// export interface ClassRow {
//   id: string
//   name: string
//   gradeDisplayName: string
//   teacherName: string | null
//   studentCount: number
// }

// export interface ImportClassesRow {
//   name: string
//   grade_level: string | number
// }

// export interface EnrollStudentRow {
//   student_email: string
//   class_name: string
// }

// export interface BulkImportResult {
//   successCount: number
//   errorCount: number
//   errors: { rowIndex: number; message: string }[]
// }

// export interface BulkEnrollSummary {
//   successCount: number
//   errorCount: number
//   errors: { rowIndex: number; message: string }[]
//   missingStudents: string[]
// }

// export interface ManagementHelpers {
//   grades: (Prisma.GradeGetPayload<{
//     include: { gradeSubjects: { include: { subject: { select: { name: true } } } } }
//   }>)[]
//   teachers: { id: string; name: string | null }[]
//   students: { id: string; name: string | null; email: string }[]
// }

// // ── Queries ─────────────────────────────────────────────────────────────────────

// /**
//  * Fetches all classes for a school with counts of enrolled students
//  */
// export async function getClassesForManagement(
//   schoolId: string
// ): Promise<ClassRow[]> {
//   try {
//     const classes = await prisma.class.findMany({
//       where: { schoolId },
//       orderBy: { name: 'asc' },
//       include: {
//         grade: { select: { displayName: true } },
//         teacher: { select: { name: true } },
//         enrollments: { select: { id: true } },
//       },
//     })

//     return classes.map((c) => ({
//       id: c.id,
//       name: c.name,
//       gradeDisplayName: c.grade.displayName,
//       teacherName: c.teacher?.name ?? null,
//       studentCount: c.enrollments.length,
//     }))
//   } catch (err) {
//     console.error('getClassesForManagement error:', getErrorMessage(err))
//     return []
//   }
// }

// /**
//  * Fetches grades (with subjects), teachers, and students to populate UI helpers
//  */
// export async function getManagementHelpers(schoolId: string): Promise<ManagementHelpers> {
//   try {
//     const school = await prisma.school.findUnique({
//       where: { id: schoolId },
//       select: { curriculumId: true }
//     });

//     const [grades, teachers, students] = await Promise.all([
//       prisma.grade.findMany({
//         where: { OR: [{ schoolId }, { curriculumId: school?.curriculumId }] },
//         include: {
//           gradeSubjects: {
//             include: {
//               subject: { select: { name: true } }
//             }
//           }
//         },
//         orderBy: { level: 'asc' },
//       }),
//       prisma.profile.findMany({
//         where: { schoolId, role: Role.TEACHER },
//         select: { id: true, name: true },
//         orderBy: { name: 'asc' },
//       }),
//       prisma.profile.findMany({
//         where: { schoolId, role: Role.STUDENT },
//         select: { id: true, name: true, email: true },
//         orderBy: { name: 'asc' },
//       })
//     ]);

//     return { 
//       grades: grades as ManagementHelpers['grades'], 
//       teachers, 
//       students 
//     };
//   } catch (err) {
//     console.error('getManagementHelpers error:', getErrorMessage(err))
//     return { grades: [], teachers: [], students: [] };
//   }
// }

// /**
//  * Search students by name or email (Server-side)
//  */
// export async function searchStudents(schoolId: string, query: string): Promise<{ id: string; name: string | null; email: string }[]> {
//   if (!query || query.length < 2) return [];

//   try {
//     return await prisma.profile.findMany({
//       where: {
//         schoolId,
//         role: Role.STUDENT,
//         OR: [
//           { name: { contains: query, mode: 'insensitive' } },
//           { email: { contains: query, mode: 'insensitive' } }
//         ]
//       },
//       select: { id: true, name: true, email: true },
//       take: 10,
//     });
//   } catch (err) {
//     console.error('searchStudents error:', getErrorMessage(err))
//     return [];
//   }
// }

// // ── Placement Logic (Room Assignment) ───────────────────────────────────────────

// /**
//  * Places a single student in a class room (Class Placement Only)
//  */
// export async function enrollSingleStudent(
//   schoolId: string,
//   actorId: string,
//   actorName: string | null,
//   actorRole: string | null,
//   data: { studentId: string; classId: string }
// ) {
//   try {
//     const [student, klass] = await Promise.all([
//       prisma.profile.findUnique({ where: { id: data.studentId }, select: { id: true, name: true } }),
//       prisma.class.findUnique({ where: { id: data.classId }, select: { id: true, name: true } })
//     ]);

//     if (!student || !klass) throw new Error("Student or Class not found");

//     await prisma.classEnrollment.create({
//       data: {
//         studentId: student.id,
//         classId: klass.id,
//         schoolId,
//       }
//     });

//     await logActivity({
//       schoolId,
//       actorId,
//       actorName,
//       actorRole,
//       type: ActivityType.STUDENT_ENROLLED, // Standard Enum
//       title: 'Student Placement',
//       description: `${student.name} assigned to classroom: ${klass.name}.`,
//       metadata: { studentId: student.id, classId: klass.id }
//     });

//     return { success: true as const };
//   } catch (err) {
//     return { success: false as const, error: getErrorMessage(err) };
//   }
// }

// /**
//  * Bulk placement from CSV (Placement Only)
//  */
// export async function enrollStudentsFromCsv(
//   schoolId: string,
//   actorId: string,
//   actorName: string | null,
//   actorRole: string | null,
//   rows: EnrollStudentRow[]
// ): Promise<BulkEnrollSummary> {
//   const errors: BulkEnrollSummary['errors'] = []
//   const missingStudents: string[] = []
//   let successCount = 0

//   try {
//     await prisma.$transaction(async (tx) => {
//       for (let index = 0; index < rows.length; index++) {
//         const raw = rows[index]
//         const email = (raw.student_email ?? '').trim().toLowerCase()
//         const className = (raw.class_name ?? '').trim()

//         if (!email || !className) {
//           errors.push({ rowIndex: index, message: 'Missing student_email or class_name' });
//           continue;
//         }

//         const [student, klass] = await Promise.all([
//           tx.profile.findFirst({ where: { email, schoolId }, select: { id: true, name: true } }),
//           tx.class.findFirst({ where: { name: className, schoolId }, select: { id: true, name: true } }),
//         ])

//         if (!student) {
//           missingStudents.push(email);
//           errors.push({ rowIndex: index, message: `Student ${email} not found.` });
//           continue;
//         }

//         if (!klass) {
//           errors.push({ rowIndex: index, message: `Class room "${className}" not found.` });
//           continue;
//         }

//         const existing = await tx.classEnrollment.findFirst({
//           where: { studentId: student.id, classId: klass.id },
//         });

//         if (existing) continue;

//         await tx.classEnrollment.create({
//           data: { studentId: student.id, classId: klass.id, schoolId },
//         });

//         successCount += 1;
//       }
//     });

//     await logActivity({
//       schoolId,
//       actorId,
//       actorName,
//       actorRole,
//       type: ActivityType.STUDENT_ENROLLED,
//       title: 'Bulk Class Placement',
//       description: `Successfully placed ${successCount} students into classrooms via CSV.`,
//     });

//     return { successCount, errorCount: errors.length, errors, missingStudents };
//   } catch (err) {
//     return { successCount: 0, errorCount: rows.length, errors: [{ rowIndex: -1, message: getErrorMessage(err) }], missingStudents };
//   }
// }

// // ── Manual Creation ─────────────────────────────────────────────────────────────

// /**
//  * Creates a physical class room
//  */
// export async function createSingleClass(
//   schoolId: string,
//   actorId: string,
//   actorName: string | null,
//   actorRole: string | null,
//   data: { name: string; gradeId: string; teacherId?: string }
// ) {
//   try {
//     const newClass = await prisma.class.create({
//       data: {
//         name: data.name,
//         gradeId: data.gradeId,
//         schoolId,
//         teacherId: data.teacherId || actorId,
//       },
//       include: { grade: { select: { displayName: true } } },
//     })

//     await logActivity({
//       schoolId,
//       actorId,
//       actorName,
//       actorRole,
//       type: ActivityType.CLASS_CREATED,
//       title: `Class Created: ${newClass.name}`,
//       description: `Room "${newClass.name}" configured for grade ${newClass.grade.displayName}.`,
//       metadata: { classId: newClass.id },
//     })

//     return { success: true as const }
//   } catch (err) {
//     return { success: false as const, error: getErrorMessage(err) }
//   }
// }

// /**
//  * Bulk create class rooms from CSV
//  */
// export async function importClassesFromCsv(
//   schoolId: string,
//   actorId: string,
//   actorName: string | null,
//   actorRole: string | null,
//   rows: ImportClassesRow[]
// ): Promise<BulkImportResult> {
//   const errors: BulkImportResult['errors'] = []
//   let successCount = 0

//   try {
//     for (let index = 0; index < rows.length; index++) {
//       const raw = rows[index]
//       const name = (raw.name ?? '').trim()
//       const gradeLevel = Number(raw.grade_level)

//       if (!name || Number.isNaN(gradeLevel)) {
//         errors.push({ rowIndex: index, message: 'Invalid name or grade level.' });
//         continue;
//       }

//       const grade = await prisma.grade.findFirst({
//         where: { schoolId, level: gradeLevel },
//         select: { id: true, displayName: true },
//       })

//       if (!grade) {
//         errors.push({ rowIndex: index, message: `Grade Level ${gradeLevel} not found.` });
//         continue;
//       }

//       await prisma.class.create({
//         data: { name, gradeId: grade.id, schoolId, teacherId: actorId },
//       });

//       successCount += 1;
//     }

//     return { successCount, errorCount: errors.length, errors };
//   } catch (err) {
//     return { successCount: 0, errorCount: rows.length, errors: [{ rowIndex: -1, message: getErrorMessage(err) }] };
//   }
// }

// /**
//  * Assigns a lead teacher to a classroom
//  */
// export async function assignTeacherToClassWithNotify(
//   schoolId: string,
//   classId: string,
//   teacherId: string,
//   actorId: string,
//   actorName: string | null,
//   actorRole: string | null
// ) {
//   try {
//     const updated = await prisma.class.update({
//       where: { id: classId, schoolId },
//       data: { teacherId },
//       include: { grade: { select: { displayName: true } } },
//     })

//     await prisma.notification.create({
//       data: {
//         userId: teacherId,
//         message: `You have been assigned as the lead teacher for ${updated.name}.`,
//       }
//     });

//     await logActivity({
//       schoolId,
//       actorId,
//       actorName,
//       actorRole,
//       type: ActivityType.TEACHER_ASSIGNED,
//       title: 'Teacher Assignment',
//       description: `Class "${updated.name}" assigned to a lead teacher.`,
//     });

//     return { success: true as const }
//   } catch (err) {
//     return { success: false as const, error: getErrorMessage(err) }
//   }  
// }

"use server";

import { prisma } from "@/lib/prisma";
import { ActivityType, Role, Prisma, LessonStatus } from '@prisma/client'
import { getErrorMessage } from '@/lib/error-handler'
import { logActivity } from "@/lib/activitylogger";
import { academicCoreScope } from "@/lib/content-scope";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ClassDashboardStats {
  subjectName: string;
  average: string;
  bestStudent: string;
}

export interface StudentDashboardData {
  classId: string;
  className: string;
  teacherName: string;
  classmates: { id: string; name: string | null; phone: string | null }[];
  mySubjects: string[];
}

export interface IndividualLearnerData {
  totalLessonsViewed: number;
  averagePracticeScore: number;
  recentTopics: string[];
}

export interface ClassRow {
  id: string
  name: string
  gradeDisplayName: string
  teacherName: string
  studentCount: number
}

export interface ImportClassesRow {
  name: string
  grade_level: string | number
}

export interface EnrollStudentRow {
  student_email: string
  class_name: string
}

export interface BulkImportResult {
  successCount: number
  errorCount: number
  errors: { rowIndex: number; message: string }[]
}

export interface BulkEnrollSummary {
  successCount: number
  errorCount: number
  errors: { rowIndex: number; message: string }[]
  missingStudents: string[]
}

export type ManagementHelpers = {
  grades: Prisma.GradeGetPayload<{
    include: { gradeSubjects: { include: { subject: { select: { name: true } } } } }
  }>[]
  teachers: { id: string; name: string | null }[]
  students: { id: string; name: string | null; email: string }[]
}

// ── Dashboard Logic ─────────────────────────────────────────────────────────────

export async function getClassDashboardData(profileId: string) {
  try {
    const user = await prisma.profile.findUnique({
      where: { id: profileId },
      include: { school: true },
    });

    if (!user) throw new Error("User not found");

    // --- 1. ADMIN LOGIC (Tier 2) ---
    if (user.role === Role.SCHOOL_ADMIN || user.role === Role.SUPER_ADMIN) {
      return await prisma.class.findMany({
        where: { schoolId: user.schoolId },
        include: {
          grade: true,
          teacher: true,
          enrollments: { include: { student: true } },
        },
      });
    }

    // --- 2. TEACHER LOGIC (Tier 2) ---
    if (user.role === Role.TEACHER) {
      const classes = await prisma.class.findMany({
        where: { teacherId: profileId, schoolId: user.schoolId },
        include: {
          grade: { 
            include: { 
              gradeSubjects: { 
                where: academicCoreScope({ schoolId: user.schoolId }),
                include: { subject: true } 
              } 
            } 
          },
          enrollments: {
            include: {
              student: {
                include: {
                  assessments: { where: { schoolId: user.schoolId } },
                },
              },
            },
          },
        },
      });
    
      if (classes.length === 0) return []; 

      return classes.map((cls) => {
        const students = cls.enrollments.map((e) => e.student);
        const allAssessments = students.flatMap((s) => s.assessments);

        const subjectStats: ClassDashboardStats[] = cls.grade.gradeSubjects.map((gs) => {
          const subjectAssessments = allAssessments.filter(a => a.gradeSubjectId === gs.id);
          
          const avg = subjectAssessments.length 
            ? subjectAssessments.reduce((acc, curr) => acc + (curr.score ?? 0), 0) / subjectAssessments.length 
            : 0;

          const studentScores = students.map(s => {
            const total = s.assessments
              .filter(a => a.gradeSubjectId === gs.id)
              .reduce((acc, curr) => acc + (curr.score ?? 0), 0);
            return { name: s.name ?? "Unknown", score: total };
          });

          const best = studentScores.sort((a, b) => b.score - a.score)[0];

          return {
            subjectName: gs.subject.name,
            average: avg.toFixed(1),
            bestStudent: best && best.score > 0 ? best.name : "N/A",
          };
        });

        return { ...cls, students, subjectStats };
      });
    }

    // --- 3. STUDENT LOGIC (Tier 2) ---
    if (user.role === Role.STUDENT && user.schoolId) {
      const enrollment = await prisma.classEnrollment.findFirst({
        where: { studentId: profileId, schoolId: user.schoolId },
        include: {
          class: {
            include: {
              teacher: true,
              grade: true,
              enrollments: {
                include: { student: { select: { id: true, name: true, phone: true } } },
              },
            },
          },
        },
      });

      if (!enrollment || !enrollment.class) return null;

      const mySubjects = await prisma.studentSubject.findMany({
        where: { studentId: profileId, schoolId: user.schoolId },
        include: { gradeSubject: { include: { subject: true } } },
      });

      return {
        classId: enrollment.class.id,
        className: enrollment.class.name,
        teacherName: enrollment.class.teacher?.name ?? "Staff",
        classmates: enrollment.class.enrollments.map((e) => e.student),
        mySubjects: mySubjects.map((ms) => ms.gradeSubject.subject.name),
      } as StudentDashboardData;
    }

    // --- 4. INDEPENDENT LEARNER (Tier 1) ---
    if (user.role === Role.INDIVIDUAL_LEARNER) {
        const [activity, practiceScores] = await Promise.all([
            prisma.activityLog.findMany({
                where: { actorId: profileId },
                take: 5,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.assessment.aggregate({
                where: { studentId: profileId, schoolId: null },
                _avg: { score: true }
            })
        ]);

        return {
            totalLessonsViewed: activity.length,
            averagePracticeScore: practiceScores._avg.score ?? 0,
            recentTopics: activity.map(a => a.title)
        } as IndividualLearnerData;
    }

    return null;
  } catch (error: unknown) {
    console.error("Dashboard Fetch Error:", error);
    return null;
  }
}

// ── Management Logic ─────────────────────────────────────────────────────────────

export async function getClassesForManagement(schoolId: string): Promise<ClassRow[]> {
  try {
    const classes = await prisma.class.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
      include: {
        grade: { select: { displayName: true } },
        teacher: { select: { name: true } },
        enrollments: { select: { id: true } },
      },
    })

    return classes.map((c) => ({
      id: c.id,
      name: c.name,
      gradeDisplayName: c.grade.displayName,
      teacherName: c.teacher?.name ?? "Unassigned",
      studentCount: c.enrollments.length,
    }))
  } catch (err: unknown) {
    console.error('getClassesForManagement error:', getErrorMessage(err))
    return []
  }
}

export async function getManagementHelpers(schoolId: string): Promise<ManagementHelpers> {
  try {
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { curriculumId: true }
    });

    const [grades, teachers, students] = await Promise.all([
      prisma.grade.findMany({
        where: academicCoreScope({ schoolId, curriculumId: school?.curriculumId ?? undefined }),
        include: {
          gradeSubjects: {
            where: academicCoreScope({ schoolId }),
            include: { subject: { select: { name: true } } }
          }
        },
        orderBy: { level: 'asc' },
      }),
      prisma.profile.findMany({
        where: { schoolId, role: Role.TEACHER },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
      prisma.profile.findMany({
        where: { schoolId, role: Role.STUDENT },
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' },
      })
    ]);

    return { 
      grades: grades as ManagementHelpers['grades'], 
      teachers, 
      students 
    };
  } catch (err: unknown) {
    console.error('getManagementHelpers error:', getErrorMessage(err))
    return { grades: [], teachers: [], students: [] };
  }
}

export async function createSingleClass(
  schoolId: string,
  actorId: string,
  actorName: string | null,
  actorRole: Role,
  data: { name: string; gradeId: string; teacherId?: string }
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const newClass = await tx.class.create({
        data: {
          name: data.name,
          gradeId: data.gradeId,
          schoolId,
          teacherId: data.teacherId || actorId,
        },
        include: { grade: { select: { displayName: true } } },
      });

      await logActivity({
        schoolId,
        actorId,
        actorName,
        actorRole,
        type: ActivityType.CLASS_CREATED,
        title: `Room Created: ${newClass.name}`,
        description: `Classroom configured for Grade ${newClass.grade.displayName}.`,
      });

      return newClass;
    });

    return { success: true, data: result };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function enrollSingleStudent(
  schoolId: string,
  actorId: string,
  actorName: string | null,
  actorRole: Role,
  data: { studentId: string; classId: string }
) {
  try {
    await prisma.$transaction(async (tx) => {
      const [student, klass] = await Promise.all([
        tx.profile.findFirst({ where: { id: data.studentId, schoolId } }),
        tx.class.findFirst({ where: { id: data.classId, schoolId } })
      ]);

      if (!student || !klass) throw new Error("Target not found in institution.");

      await tx.classEnrollment.create({
        data: {
          studentId: student.id,
          classId: klass.id,
          schoolId,
        }
      });

      await logActivity({
        schoolId,
        actorId,
        actorName,
        actorRole,
        type: ActivityType.STUDENT_ENROLLED,
        title: 'Placement Updated',
        description: `${student.name ?? student.email} moved to room ${klass.name}.`,
      });
    });

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}