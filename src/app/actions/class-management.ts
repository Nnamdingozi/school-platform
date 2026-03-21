
// 'use server'

// import { prisma } from '@/lib/prisma'
// import { ActivityType, Prisma, Role } from '@prisma/client'
// import { getErrorMessage } from '@/lib/error-handler'
// import { logActivity } from '@/lib/activitylogger'

// // ── Types ───────────────────────────────────────────────────────────────────────

// export interface ClassRow {
//   id: string
//   name: string
//   gradeDisplayName: string
//   teacherName: string | null
//   studentCount: number
// }

// export interface ImportClassesRow {
//   name: string
//   grade_level: string
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

// // ── Queries ─────────────────────────────────────────────────────────────────────

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
//  * Fetches grades and teachers to populate manual creation dropdowns
//  */
// /**
//  * Fetches grades, teachers, AND students to populate manual dropdowns
//  */
// export async function getManagementHelpers(schoolId: string) {
//   try {
//     const school = await prisma.school.findUnique({
//       where: { id: schoolId },
//       select: { curriculumId: true }
//     });

//     const [grades, teachers, students] = await Promise.all([
//       prisma.grade.findMany({
//         where: { OR: [{ schoolId }, { curriculumId: school?.curriculumId }] },
//         select: { id: true, displayName: true },
//         orderBy: { level: 'asc' },
//       }),
//       prisma.profile.findMany({
//         where: { schoolId, role: 'TEACHER' },
//         select: { id: true, name: true },
//         orderBy: { name: 'asc' },
//       }),
//       // ✅ Added student fetching
//       prisma.profile.findMany({
//         where: { schoolId, role: 'STUDENT' },
//         select: { id: true, name: true, email: true },
//         orderBy: { name: 'asc' },
//       })
//     ]);

//     return { grades, teachers, students };
//   } catch (err) {
//     return { grades: [], teachers: [], students: [] };
//   }
// }

// /**
//  * Enrolls a single student manually
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
//       prisma.class.findUnique({ where: { id: data.classId }, include: { grade: true } })
//     ]);

//     if (!student || !klass) throw new Error("Student or Class not found");

//     // Find the primary grade subject for this grade to satisfy relation
//     const gradeSubject = await prisma.gradeSubject.findFirst({
//       where: { gradeId: klass.gradeId, schoolId }
//     });

//     if (!gradeSubject) throw new Error("Grade has no subjects configured.");

//     const enrollment = await prisma.classEnrollment.create({
//       data: {
//         studentId: student.id,
//         classId: klass.id,
//         gradeSubjectId: gradeSubject.id,
//         schoolId,
//       }
//     });

//     // Notify & Log
//     await prisma.notification.create({
//       data: { userId: student.id, message: `You have been enrolled in ${klass.name}.` }
//     });

//     await logActivity({
//       schoolId,
//       actorId,
//       actorName,
//       actorRole,
//       type: ActivityType.STUDENT_ENROLLED,
//       title: 'Student Enrolled',
//       description: `${student.name} was added to ${klass.name} manually.`,
//       metadata: { studentId: student.id, classId: klass.id }
//     });

//     return { success: true as const };
//   } catch (err) {
//     return { success: false as const, error: getErrorMessage(err) };
//   }
// }
// // ── Helpers ─────────────────────────────────────────────────────────────────────


// /**
//  * Search students by name or email (Server-side)
//  */
// export async function searchStudents(schoolId: string, query: string) {
//   if (!query || query.length < 2) return [];

//   try {
//     return await prisma.profile.findMany({
//       where: {
//         schoolId,
//         role: 'STUDENT',
//         OR: [
//           { name: { contains: query, mode: 'insensitive' } },
//           { email: { contains: query, mode: 'insensitive' } }
//         ]
//       },
//       select: { id: true, name: true, email: true },
//       take: 10, // Limit results for performance
//     });
//   } catch (err) {
//     return [];
//   }
// }

// async function notifyUser(userId: string, message: string, link?: string) {
//   try {
//     await prisma.notification.create({
//       data: {
//         userId,
//         message,
//         link,
//       },
//     })
//   } catch (err) {
//     console.error('notifyUser error:', getErrorMessage(err))
//   }
// }

// // ── Manual Creation ─────────────────────────────────────────────────────────────

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
//       include: {
//         grade: { select: { displayName: true } },
//       },
//     })

//     // Log the activity
//     await logActivity({
//       schoolId,
//       actorId,
//       actorName,
//       actorRole,
//       type: ActivityType.CLASS_CREATED,
//       title: `Class Created: ${newClass.name}`,
//       description: `Manually created class "${newClass.name}" for ${newClass.grade.displayName}.`,
//       metadata: { classId: newClass.id },
//     })

//     // Notify the teacher if one was assigned
//     if (data.teacherId) {
//       await notifyUser(
//         data.teacherId,
//         `You have been assigned to teach the new class: ${newClass.name}.`
//       )
//     }

//     return { success: true as const }
//   } catch (err) {
//     console.error('createSingleClass error:', getErrorMessage(err))
//     return { success: false as const, error: getErrorMessage(err) }
//   }
// }

// // ── Class creation from CSV ─────────────────────────────────────────────────────

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
//       const gradeLevel = Number((raw.grade_level ?? '').trim())

//       if (!name || Number.isNaN(gradeLevel)) {
//         errors.push({
//           rowIndex: index,
//           message: 'Missing or invalid name / grade_level',
//         })
//         continue
//       }

//       try {
//         const grade = await prisma.grade.findFirst({
//           where: { schoolId, level: gradeLevel },
//           select: { id: true, displayName: true },
//         })

//         if (!grade) {
//           errors.push({
//             rowIndex: index,
//             message: `Grade with level ${gradeLevel} not found for this school.`,
//           })
//           continue
//         }

//         const newClass = await prisma.class.create({
//           data: {
//             name,
//             gradeId: grade.id,
//             schoolId,
//             teacherId: actorId, 
//           },
//         })

//         successCount += 1

//         await logActivity({
//           schoolId,
//           actorId,
//           actorName,
//           actorRole,
//           type: ActivityType.CLASS_CREATED,
//           title: `Class created: ${name}`,
//           description: `Class "${name}" created for grade ${grade.displayName}.`,
//           metadata: {
//             classId: newClass.id,
//             gradeId: grade.id,
//           },
//         })
//       } catch (innerErr: unknown) {
//         errors.push({
//           rowIndex: index,
//           message: getErrorMessage(innerErr),
//         })
//       }
//     }

//     return {
//       successCount,
//       errorCount: errors.length,
//       errors,
//     }
//   } catch (err) {
//     console.error('importClassesFromCsv error:', getErrorMessage(err))
//     return {
//       successCount,
//       errorCount: rows.length,
//       errors: [
//         {
//           rowIndex: -1,
//           message: getErrorMessage(err),
//         },
//       ],
//     }
//   }
// }

// // ── Teacher assignment with notification ────────────────────────────────────────

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
//       include: {
//         grade: { select: { displayName: true } },
//         teacher: { select: { name: true } },
//       },
//     })

//     await notifyUser(
//       teacherId,
//       `You have been assigned to teach ${updated.name} (${updated.grade.displayName}).`
//     )

//     await logActivity({
//       schoolId,
//       actorId,
//       actorName,
//       actorRole,
//       type: ActivityType.TEACHER_ASSIGNED,
//       title: 'Teacher assigned to class',
//       description: `${updated.teacher?.name ?? 'A teacher'} was assigned to ${updated.name}.`,
//       metadata: {
//         classId: classId,
//         teacherId,
//       },
//     })

//     return { success: true as const }
//   } catch (err: unknown) {
//     console.error('assignTeacherToClassWithNotify error:', getErrorMessage(err))
//     return { success: false as const, error: getErrorMessage(err) }
//   }
// }

// // ── Bulk enrollment from CSV (transactional) ────────────────────────────────────

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
//     await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
//       for (let index = 0; index < rows.length; index++) {
//         const raw = rows[index]
//         const email = (raw.student_email ?? '').trim().toLowerCase()
//         const className = (raw.class_name ?? '').trim()

//         if (!email || !className) {
//           errors.push({
//             rowIndex: index,
//             message: 'Missing student_email or class_name',
//           })
//           continue
//         }

//         const [student, klass] = await Promise.all([
//           tx.profile.findFirst({
//             where: { email, schoolId },
//             select: { id: true, name: true },
//           }),
//           tx.class.findFirst({
//             where: { name: className, schoolId },
//             select: { id: true, gradeId: true, name: true },
//           }),
//         ])

//         if (!student) {
//           missingStudents.push(email)
//           errors.push({
//             rowIndex: index,
//             message: `Student with email ${email} not found in this school.`,
//           })
//           continue
//         }

//         if (!klass) {
//           errors.push({
//             rowIndex: index,
//             message: `Class "${className}" not found in this school.`,
//           })
//           continue
//         }

//         const gradeSubject = await tx.gradeSubject.findFirst({
//           where: {
//             gradeId: klass.gradeId,
//             schoolId,
//           },
//           select: { id: true },
//         })

//         if (!gradeSubject) {
//           errors.push({
//             rowIndex: index,
//             message:
//               'No grade subject found for this class. Please configure subjects for the grade first.',
//           })
//           continue
//         }

//         const existing = await tx.classEnrollment.findFirst({
//           where: {
//             studentId: student.id,
//             classId: klass.id,
//           },
//           select: { id: true },
//         })

//         if (existing) {
//           errors.push({
//             rowIndex: index,
//             message: `Student is already enrolled in ${klass.name}.`,
//           })
//           continue
//         }

//         await tx.classEnrollment.create({
//           data: {
//             studentId: student.id,
//             classId: klass.id,
//             gradeSubjectId: gradeSubject.id,
//             schoolId,
//           },
//         })

//         successCount += 1

//         await tx.notification.create({
//           data: {
//             userId: student.id,
//             message: `You have been enrolled in ${klass.name}.`,
//           },
//         })

//         await tx.activityLog.create({
//           data: {
//             schoolId,
//             actorId,
//             actorName: actorName ?? null,
//             actorRole: actorRole ?? null,
//             type: ActivityType.STUDENT_ENROLLED,
//             title: 'Student enrolled in class',
//             description: `${student.name ?? email} enrolled in ${klass.name}.`,
//             metadata: {
//               studentEmail: email,
//               className: klass.name,
//             } as unknown as Prisma.InputJsonValue,
//           },
//         })
//       }
//     })

//     return {
//       successCount,
//       errorCount: errors.length,
//       errors,
//       missingStudents,
//     }
//   } catch (err: unknown) {
//     console.error('enrollStudentsFromCsv error:', getErrorMessage(err))
//     return {
//       successCount,
//       errorCount: rows.length,
//       errors: [
//         {
//           rowIndex: -1,
//           message: getErrorMessage(err),
//         },
//       ],
//       missingStudents,
//     }
//   }
// }


// 'use server'

// import { prisma } from '@/lib/prisma'
// import { ActivityType, Role } from '@prisma/client'
// import { getErrorMessage } from '@/lib/error-handler'
// import { logActivity } from '@/lib/activitylogger'

// // ── Types ───────────────────────────────────────────────────────────────────────

// export interface ClassRow {
//   id: string
//   name: string
//   gradeDisplayName: string
//   teacherName: string | null
//   studentCount: number
// }

// export interface ImportClassesRow {
//   name: string
//   grade_level: string
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
//  * Fetches grades, teachers, and students to populate dropdowns/search
//  */
// // export async function getManagementHelpers(schoolId: string) {
// //   try {
// //     const school = await prisma.school.findUnique({
// //       where: { id: schoolId },
// //       select: { curriculumId: true }
// //     });

// //     const [grades, teachers, students] = await Promise.all([
// //       prisma.grade.findMany({
// //         where: { OR: [{ schoolId }, { curriculumId: school?.curriculumId }] },
// //         select: { id: true, displayName: true },
// //         orderBy: { level: 'asc' },
// //       }),
// //       prisma.profile.findMany({
// //         where: { schoolId, role: Role.TEACHER },
// //         select: { id: true, name: true },
// //         orderBy: { name: 'asc' },
// //       }),
// //       prisma.profile.findMany({
// //         where: { schoolId, role: Role.STUDENT },
// //         select: { id: true, name: true, email: true },
// //         orderBy: { name: 'asc' },
// //       })
// //     ]);

// //     return { grades, teachers, students };
// //   } catch (err) {
// //     return { grades: [], teachers: [], students: [] };
// //   }
// // }



// export async function getManagementHelpers(schoolId: string) {
//   try {
//     const school = await prisma.school.findUnique({
//       where: { id: schoolId },
//       select: { curriculumId: true }
//     });

//     const [grades, teachers, students] = await Promise.all([
//       prisma.grade.findMany({
//         where: { OR: [{ schoolId }, { curriculumId: school?.curriculumId }] },
//         // ✅ UPDATE: Include the nested gradeSubjects and subject names
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

//     return { grades, teachers, students };
//   } catch (err) {
//     return { grades: [], teachers: [], students: [] };
//   }
// }
// /**
//  * Search students by name or email (Server-side)
//  */
// export async function searchStudents(schoolId: string, query: string) {
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

//     // Create the placement record (No gradeSubjectId required anymore)
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
//       type: ActivityType.STUDENT_ASSIGNED,
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

//         // Check if already in this room
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
//       type: ActivityType.STUDENT_ASSIGNED,
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
//       const gradeLevel = Number((raw.grade_level ?? '').trim())

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



'use server'

import { prisma } from '@/lib/prisma'
import { ActivityType, Role, Prisma } from '@prisma/client'
import { getErrorMessage } from '@/lib/error-handler'
import { logActivity } from '@/lib/activitylogger'

// ── Types & Interfaces ─────────────────────────────────────────────────────────

export interface ClassRow {
  id: string
  name: string
  gradeDisplayName: string
  teacherName: string | null
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

export interface ManagementHelpers {
  grades: (Prisma.GradeGetPayload<{
    include: { gradeSubjects: { include: { subject: { select: { name: true } } } } }
  }>)[]
  teachers: { id: string; name: string | null }[]
  students: { id: string; name: string | null; email: string }[]
}

// ── Queries ─────────────────────────────────────────────────────────────────────

/**
 * Fetches all classes for a school with counts of enrolled students
 */
export async function getClassesForManagement(
  schoolId: string
): Promise<ClassRow[]> {
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
      teacherName: c.teacher?.name ?? null,
      studentCount: c.enrollments.length,
    }))
  } catch (err) {
    console.error('getClassesForManagement error:', getErrorMessage(err))
    return []
  }
}

/**
 * Fetches grades (with subjects), teachers, and students to populate UI helpers
 */
export async function getManagementHelpers(schoolId: string): Promise<ManagementHelpers> {
  try {
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { curriculumId: true }
    });

    const [grades, teachers, students] = await Promise.all([
      prisma.grade.findMany({
        where: { OR: [{ schoolId }, { curriculumId: school?.curriculumId }] },
        include: {
          gradeSubjects: {
            include: {
              subject: { select: { name: true } }
            }
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
  } catch (err) {
    console.error('getManagementHelpers error:', getErrorMessage(err))
    return { grades: [], teachers: [], students: [] };
  }
}

/**
 * Search students by name or email (Server-side)
 */
export async function searchStudents(schoolId: string, query: string): Promise<{ id: string; name: string | null; email: string }[]> {
  if (!query || query.length < 2) return [];

  try {
    return await prisma.profile.findMany({
      where: {
        schoolId,
        role: Role.STUDENT,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: { id: true, name: true, email: true },
      take: 10,
    });
  } catch (err) {
    console.error('searchStudents error:', getErrorMessage(err))
    return [];
  }
}

// ── Placement Logic (Room Assignment) ───────────────────────────────────────────

/**
 * Places a single student in a class room (Class Placement Only)
 */
export async function enrollSingleStudent(
  schoolId: string,
  actorId: string,
  actorName: string | null,
  actorRole: string | null,
  data: { studentId: string; classId: string }
) {
  try {
    const [student, klass] = await Promise.all([
      prisma.profile.findUnique({ where: { id: data.studentId }, select: { id: true, name: true } }),
      prisma.class.findUnique({ where: { id: data.classId }, select: { id: true, name: true } })
    ]);

    if (!student || !klass) throw new Error("Student or Class not found");

    await prisma.classEnrollment.create({
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
      type: ActivityType.STUDENT_ENROLLED, // Standard Enum
      title: 'Student Placement',
      description: `${student.name} assigned to classroom: ${klass.name}.`,
      metadata: { studentId: student.id, classId: klass.id }
    });

    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: getErrorMessage(err) };
  }
}

/**
 * Bulk placement from CSV (Placement Only)
 */
export async function enrollStudentsFromCsv(
  schoolId: string,
  actorId: string,
  actorName: string | null,
  actorRole: string | null,
  rows: EnrollStudentRow[]
): Promise<BulkEnrollSummary> {
  const errors: BulkEnrollSummary['errors'] = []
  const missingStudents: string[] = []
  let successCount = 0

  try {
    await prisma.$transaction(async (tx) => {
      for (let index = 0; index < rows.length; index++) {
        const raw = rows[index]
        const email = (raw.student_email ?? '').trim().toLowerCase()
        const className = (raw.class_name ?? '').trim()

        if (!email || !className) {
          errors.push({ rowIndex: index, message: 'Missing student_email or class_name' });
          continue;
        }

        const [student, klass] = await Promise.all([
          tx.profile.findFirst({ where: { email, schoolId }, select: { id: true, name: true } }),
          tx.class.findFirst({ where: { name: className, schoolId }, select: { id: true, name: true } }),
        ])

        if (!student) {
          missingStudents.push(email);
          errors.push({ rowIndex: index, message: `Student ${email} not found.` });
          continue;
        }

        if (!klass) {
          errors.push({ rowIndex: index, message: `Class room "${className}" not found.` });
          continue;
        }

        const existing = await tx.classEnrollment.findFirst({
          where: { studentId: student.id, classId: klass.id },
        });

        if (existing) continue;

        await tx.classEnrollment.create({
          data: { studentId: student.id, classId: klass.id, schoolId },
        });

        successCount += 1;
      }
    });

    await logActivity({
      schoolId,
      actorId,
      actorName,
      actorRole,
      type: ActivityType.STUDENT_ENROLLED,
      title: 'Bulk Class Placement',
      description: `Successfully placed ${successCount} students into classrooms via CSV.`,
    });

    return { successCount, errorCount: errors.length, errors, missingStudents };
  } catch (err) {
    return { successCount: 0, errorCount: rows.length, errors: [{ rowIndex: -1, message: getErrorMessage(err) }], missingStudents };
  }
}

// ── Manual Creation ─────────────────────────────────────────────────────────────

/**
 * Creates a physical class room
 */
export async function createSingleClass(
  schoolId: string,
  actorId: string,
  actorName: string | null,
  actorRole: string | null,
  data: { name: string; gradeId: string; teacherId?: string }
) {
  try {
    const newClass = await prisma.class.create({
      data: {
        name: data.name,
        gradeId: data.gradeId,
        schoolId,
        teacherId: data.teacherId || actorId,
      },
      include: { grade: { select: { displayName: true } } },
    })

    await logActivity({
      schoolId,
      actorId,
      actorName,
      actorRole,
      type: ActivityType.CLASS_CREATED,
      title: `Class Created: ${newClass.name}`,
      description: `Room "${newClass.name}" configured for grade ${newClass.grade.displayName}.`,
      metadata: { classId: newClass.id },
    })

    return { success: true as const }
  } catch (err) {
    return { success: false as const, error: getErrorMessage(err) }
  }
}

/**
 * Bulk create class rooms from CSV
 */
export async function importClassesFromCsv(
  schoolId: string,
  actorId: string,
  actorName: string | null,
  actorRole: string | null,
  rows: ImportClassesRow[]
): Promise<BulkImportResult> {
  const errors: BulkImportResult['errors'] = []
  let successCount = 0

  try {
    for (let index = 0; index < rows.length; index++) {
      const raw = rows[index]
      const name = (raw.name ?? '').trim()
      const gradeLevel = Number(raw.grade_level)

      if (!name || Number.isNaN(gradeLevel)) {
        errors.push({ rowIndex: index, message: 'Invalid name or grade level.' });
        continue;
      }

      const grade = await prisma.grade.findFirst({
        where: { schoolId, level: gradeLevel },
        select: { id: true, displayName: true },
      })

      if (!grade) {
        errors.push({ rowIndex: index, message: `Grade Level ${gradeLevel} not found.` });
        continue;
      }

      await prisma.class.create({
        data: { name, gradeId: grade.id, schoolId, teacherId: actorId },
      });

      successCount += 1;
    }

    return { successCount, errorCount: errors.length, errors };
  } catch (err) {
    return { successCount: 0, errorCount: rows.length, errors: [{ rowIndex: -1, message: getErrorMessage(err) }] };
  }
}

/**
 * Assigns a lead teacher to a classroom
 */
export async function assignTeacherToClassWithNotify(
  schoolId: string,
  classId: string,
  teacherId: string,
  actorId: string,
  actorName: string | null,
  actorRole: string | null
) {
  try {
    const updated = await prisma.class.update({
      where: { id: classId, schoolId },
      data: { teacherId },
      include: { grade: { select: { displayName: true } } },
    })

    await prisma.notification.create({
      data: {
        userId: teacherId,
        message: `You have been assigned as the lead teacher for ${updated.name}.`,
      }
    });

    await logActivity({
      schoolId,
      actorId,
      actorName,
      actorRole,
      type: ActivityType.TEACHER_ASSIGNED,
      title: 'Teacher Assignment',
      description: `Class "${updated.name}" assigned to a lead teacher.`,
    });

    return { success: true as const }
  } catch (err) {
    return { success: false as const, error: getErrorMessage(err) }
  }  
}