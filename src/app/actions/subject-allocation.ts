// // src/app/actions/subject-allocation.ts
// 'use server'

// import { prisma } from '@/lib/prisma' // ✅ Import your prisma client
// import { EnrollmentStatus } from '@prisma/client' // ✅ Import enums
// import { getErrorMessage } from '@/lib/error-handler' // ✅ Import error helper

// /**
//  * JS1-JS3: Bulk assign subjects to an entire class
//  * Professional approach: Ensures all students study the same required subjects.
//  */
// export async function bulkAllocateJuniorSubjects(
//     schoolId: string, 
//     classId: string, 
//     gradeSubjectIds: string[]
// ) {
//     try {
//         // 1. Get all students currently placed in this class
//         const students = await prisma.classEnrollment.findMany({ 
//             where: { classId } 
//         });

//         if (students.length === 0) {
//             return { success: false, error: "No students found in this class to allocate subjects to." };
//         }

//         // 2. Use a transaction to create subjects for EVERY student
//         return await prisma.$transaction(async (tx) => {
//             for (const student of students) {
//                 await tx.studentSubject.createMany({
//                     data: gradeSubjectIds.map(gsId => ({
//                         studentId: student.studentId,
//                         gradeSubjectId: gsId,
//                         schoolId: schoolId, // ✅ Added schoolId (required by schema)
//                         status: EnrollmentStatus.APPROVED // ✅ Use enum value
//                     })),
//                     skipDuplicates: true // Prevents errors if some are already assigned
//                 });
//             }
//             return { success: true };
//         });
//     } catch (err) {
//         console.error('bulkAllocateJuniorSubjects error:', getErrorMessage(err));
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * SS1-SS3: Submit elective selection for teacher approval
//  * Follows WAEC/NECO standards of 7-9 subjects.
//  */
// export async function submitSeniorSubjects(
//     schoolId: string, // ✅ Added schoolId to params
//     studentId: string, 
//     gradeSubjectIds: string[]
// ) {
//     try {
//         // 1. Validate WAEC counts
//         if (gradeSubjectIds.length < 7 || gradeSubjectIds.length > 9) {
//             throw new Error("WAEC standard requires 7 to 9 subjects.");
//         }

//         // 2. Create as PENDING for teacher review
//         await prisma.studentSubject.createMany({
//             data: gradeSubjectIds.map(id => ({
//                 studentId,
//                 gradeSubjectId: id,
//                 schoolId: schoolId, // ✅ Added schoolId
//                 status: EnrollmentStatus.PENDING
//             })),
//             skipDuplicates: true
//         });

//         return { success: true };
//     } catch (err) {
//         console.error('submitSeniorSubjects error:', getErrorMessage(err));
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * Update status (Used by Teachers to approve/reject SS1-3 electives)
//  */
// export async function updateAllocationStatus(
//     studentId: string,
//     gradeSubjectId: string,
//     status: EnrollmentStatus
// ) {
//     try {
//         await prisma.studentSubject.update({
//             where: {
//                 studentId_gradeSubjectId: { studentId, gradeSubjectId }
//             },
//             data: { status }
//         });
//         return { success: true };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// export async function allocateStudentSubjects(
//     schoolId: string, 
//     studentId: string, // ✅ Now used as a primary parameter
//     gradeSubjectIds: string[]
// ) {
//     try {
//         return await prisma.$transaction(async (tx) => {
//             // 1. Wipe existing allocations for this student to ensure a clean sync
//             await tx.studentSubject.deleteMany({
//                 where: { studentId }
//             });

//             // 2. Create the new specific allocations
//             if (gradeSubjectIds.length > 0) {
//                 await tx.studentSubject.createMany({
//                     data: gradeSubjectIds.map(gsId => ({
//                         studentId,
//                         gradeSubjectId: gsId,
//                         schoolId,
//                         status: EnrollmentStatus.APPROVED
//                     })),
//                     skipDuplicates: true
//                 });
//             }
            
//             return { success: true };
//         });
//     } catch (err) {
//         console.error('allocateStudentSubjects error:', getErrorMessage(err));
//         return { success: false, error: getErrorMessage(err) };
//     }
// }



// 'use server'

// import { prisma } from '@/lib/prisma'
// import { EnrollmentStatus, ActivityType } from '@prisma/client'
// import { getErrorMessage } from '@/lib/error-handler'
// import { logActivity } from '@/lib/activitylogger'
// import { revalidatePath } from 'next/cache'

// /**
//  * Helper: Validates if the school is running a Nigerian Curriculum
//  */
// async function getCurriculumContext(schoolId: string) {
//     const school = await prisma.school.findUnique({
//         where: { id: schoolId },
//         include: { curriculum: true }
//     });
//     return {
//         isNigeria: school?.curriculum.name.toLowerCase().includes('nigeria') ?? false,
//         curriculumName: school?.curriculum.name ?? 'Standard'
//     };
// }

// /**
//  * SS1-SS3 (Nigeria): Submit elective selection
//  * Enforces a minimum of 9 subjects for WAEC compliance, but allows infinite 
//  * extracurricular subjects above that number.
//  */
// export async function submitSeniorSubjects(
//     schoolId: string,
//     studentId: string, 
//     gradeSubjectIds: string[]
// ) {
//     try {
//         const { isNigeria } = await getCurriculumContext(schoolId);

//         // Fetch student's current grade level
//         const enrollment = await prisma.classEnrollment.findFirst({
//             where: { studentId },
//             include: { class: { include: { grade: true } } }
//         });

//         const isSenior = (enrollment?.class?.grade.level ?? 0) >= 10;

//         // Validation: Nigerian Senior Secondary Academic Standards
//         if (isNigeria && isSenior) {
//             if (gradeSubjectIds.length < 9) {
//                 throw new Error("WAEC standard requires a minimum of 9 subjects for Senior Secondary enrollment.");
//             }
//         }

//         // We use a transaction to ensure old choices are replaced by the new selection
//         await prisma.$transaction(async (tx) => {
//             await tx.studentSubject.deleteMany({ where: { studentId, schoolId } });
            
//             await tx.studentSubject.createMany({
//                 data: gradeSubjectIds.map(id => ({
//                     studentId,
//                     gradeSubjectId: id,
//                     schoolId,
//                     // If Senior Nigeria, needs teacher approval. 
//                     // Junior or non-Nigeria is auto-approved.
//                     status: isNigeria && isSenior ? EnrollmentStatus.PENDING : EnrollmentStatus.APPROVED
//                 })),
//                 skipDuplicates: true
//             });
//         });

//         return { success: true };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * Unified Matrix Sync
//  * Enforces the 9-subject minimum for Nigerian Senior grades during Admin entry.
//  */
// export async function allocateStudentSubjects(
//     schoolId: string, 
//     studentId: string,
//     gradeSubjectIds: string[]
// ) {
//     try {
//         const { isNigeria } = await getCurriculumContext(schoolId);

//         // Fetch Grade Level for validation
//         const enrollment = await prisma.classEnrollment.findFirst({
//             where: { studentId, schoolId },
//             include: { class: { include: { grade: true } } }
//         });

//         const gradeLevel = enrollment?.class?.grade.level ?? 0;

//         // Enforce WAEC Min-9 Rule
//         if (isNigeria && gradeLevel >= 10 && gradeSubjectIds.length < 9) {
//             throw new Error(`Academic Policy Violation: Senior Secondary students must be allocated a minimum of 9 subjects.`);
//         }

//         return await prisma.$transaction(async (tx) => {
//             // 1. Wipe existing allocations
//             await tx.studentSubject.deleteMany({
//                 where: { studentId, schoolId }
//             });

//             // 2. Create the new mapping
//             if (gradeSubjectIds.length > 0) {
//                 await tx.studentSubject.createMany({
//                     data: gradeSubjectIds.map(gsId => ({
//                         studentId,
//                         gradeSubjectId: gsId,
//                         schoolId,
//                         status: EnrollmentStatus.APPROVED 
//                     })),
//                     skipDuplicates: true
//                 });
//             }

//             // 3. Audit Logging
//             await logActivity({
//                 schoolId,
//                 actorId: "SYSTEM", 
//                 actorName: "Academic Registrar",
//                 actorRole: "SCHOOL_ADMIN",
//                 type: ActivityType.CURRICULUM_UPDATED,
//                 title: 'Subject Allocation Synchronized',
//                 description: `Updated subject registry for student. Total subjects: ${gradeSubjectIds.length}.`,
//                 metadata: { studentId, subjectCount: gradeSubjectIds.length }
//             });
            
//             revalidatePath('/admin/curriculum/allocation');
//             return { success: true };
//         });
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * JS1-JS3 (Nigeria): Bulk assign subjects to an entire class
//  */
// export async function bulkAllocateJuniorSubjects(
//     schoolId: string, 
//     classId: string, 
//     gradeSubjectIds: string[]
// ) {
//     try {
//         const { isNigeria } = await getCurriculumContext(schoolId);
//         const klass = await prisma.class.findUnique({
//             where: { id: classId },
//             include: { grade: true }
//         });

//         if (!klass) throw new Error("Class registry entry not found.");

//         if (isNigeria && klass.grade.level > 9) {
//             throw new Error("Bulk allocation is restricted to Junior Secondary (JS1-3) only.");
//         }

//         const students = await prisma.classEnrollment.findMany({ where: { classId } });

//         return await prisma.$transaction(async (tx) => {
//             for (const student of students) {
//                 await tx.studentSubject.createMany({
//                     data: gradeSubjectIds.map(gsId => ({
//                         studentId: student.studentId,
//                         gradeSubjectId: gsId,
//                         schoolId: schoolId,
//                         status: EnrollmentStatus.APPROVED
//                     })),
//                     skipDuplicates: true
//                 });
//             }
//             return { success: true };
//         });
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }





// 'use server'

// import { prisma } from '@/lib/prisma'
// import { EnrollmentStatus, ActivityType } from '@prisma/client'
// import { getErrorMessage } from '@/lib/error-handler'
// import { logActivity } from '@/lib/activitylogger'
// import { revalidatePath } from 'next/cache'

// /**
//  * Helper: Validates if the school is running a Nigerian Curriculum
//  */
// async function getCurriculumContext(schoolId: string) {
//     const school = await prisma.school.findUnique({
//         where: { id: schoolId },
//         include: { curriculum: true }
//     });
//     return {
//         isNigeria: school?.curriculum.name.toLowerCase().includes('nigeria') ?? false,
//         curriculumName: school?.curriculum.name ?? 'Standard'
//     };
// }

// /**
//  * SS1-SS3 (Nigeria): Submit elective selection
//  * Enforces a minimum of 9 subjects for WAEC compliance.
//  */
// export async function submitSeniorSubjects(
//     schoolId: string,
//     studentId: string, 
//     gradeSubjectIds: string[]
// ) {
//     try {
//         const { isNigeria } = await getCurriculumContext(schoolId);

//         const enrollment = await prisma.classEnrollment.findFirst({
//             where: { studentId },
//             include: { class: { include: { grade: true } } }
//         });

//         const isSenior = (enrollment?.class?.grade.level ?? 0) >= 10;

//         if (isNigeria && isSenior) {
//             if (gradeSubjectIds.length < 9) {
//                 throw new Error("WAEC standard requires a minimum of 9 subjects for Senior Secondary enrollment.");
//             }
//         }

//         await prisma.$transaction(async (tx) => {
//             await tx.studentSubject.deleteMany({ where: { studentId, schoolId } });
            
//             await tx.studentSubject.createMany({
//                 data: gradeSubjectIds.map(id => ({
//                     studentId,
//                     gradeSubjectId: id,
//                     schoolId,
//                     status: isNigeria && isSenior ? EnrollmentStatus.PENDING : EnrollmentStatus.APPROVED
//                 })),
//                 skipDuplicates: true
//             });
//         });

//         return { success: true };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * Unified Matrix Sync
//  * Enforces the 9-subject minimum for Nigerian Senior grades during Admin entry.
//  */
// export async function allocateStudentSubjects(
//     schoolId: string, 
//     studentId: string,
//     gradeSubjectIds: string[]
// ) {
//     try {
//         const { isNigeria } = await getCurriculumContext(schoolId);

//         const enrollment = await prisma.classEnrollment.findFirst({
//             where: { studentId, schoolId },
//             include: { class: { include: { grade: true } } }
//         });

//         const gradeLevel = enrollment?.class?.grade.level ?? 0;

//         if (isNigeria && gradeLevel >= 10 && gradeSubjectIds.length < 9) {
//             throw new Error(`Academic Policy Violation: Senior Secondary students must be allocated a minimum of 9 subjects.`);
//         }

//         return await prisma.$transaction(async (tx) => {
//             await tx.studentSubject.deleteMany({
//                 where: { studentId, schoolId }
//             });

//             if (gradeSubjectIds.length > 0) {
//                 await tx.studentSubject.createMany({
//                     data: gradeSubjectIds.map(gsId => ({
//                         studentId,
//                         gradeSubjectId: gsId,
//                         schoolId,
//                         status: EnrollmentStatus.APPROVED 
//                     })),
//                     skipDuplicates: true
//                 });
//             }

//             await logActivity({
//                 schoolId,
//                 actorId: "SYSTEM", 
//                 actorName: "Academic Registrar",
//                 actorRole: "SCHOOL_ADMIN",
//                 type: ActivityType.CURRICULUM_UPDATED,
//                 title: 'Subject Allocation Synchronized',
//                 description: `Updated subject registry for student. Total subjects: ${gradeSubjectIds.length}.`,
//                 metadata: { studentId, subjectCount: gradeSubjectIds.length }
//             });
            
//             revalidatePath('/admin/curriculum/allocation');
//             return { success: true };
//         });
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * JS1-JS3 (Nigeria): Bulk assign subjects to an entire class
//  */
// export async function bulkAllocateJuniorSubjects(
//     schoolId: string, 
//     classId: string, 
//     gradeSubjectIds: string[]
// ) {
//     try {
//         const { isNigeria } = await getCurriculumContext(schoolId);
//         const klass = await prisma.class.findUnique({
//             where: { id: classId },
//             include: { grade: true }
//         });

//         if (!klass) throw new Error("Class registry entry not found.");

//         if (isNigeria && klass.grade.level > 9) {
//             throw new Error("Bulk allocation is restricted to Junior Secondary (JS1-3) only.");
//         }

//         const students = await prisma.classEnrollment.findMany({ where: { classId } });

//         return await prisma.$transaction(async (tx) => {
//             for (const student of students) {
//                 await tx.studentSubject.createMany({
//                     data: gradeSubjectIds.map(gsId => ({
//                         studentId: student.studentId,
//                         gradeSubjectId: gsId,
//                         schoolId: schoolId,
//                         status: EnrollmentStatus.APPROVED
//                     })),
//                     skipDuplicates: true
//                 });
//             }
//             return { success: true };
//         });
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * ✅ NEW: Fetches the data specifically for the Allocation Matrix UI
//  * Synchronized with decoupled Placement/Allocation schema.
//  */
// export async function getClassAllocationData(classId: string, schoolId: string) {
//     try {
//         const [klass, enrollments, existingAllocations] = await Promise.all([
//             // 1. Get Class and all available Subjects for its Grade
//             prisma.class.findUnique({
//                 where: { id: classId },
//                 include: { 
//                     grade: { 
//                         include: { 
//                             gradeSubjects: { include: { subject: true } } 
//                         } 
//                     } 
//                 }
//             }),
//             // 2. Get all Students placed in this physical room
//             prisma.classEnrollment.findMany({
//                 where: { classId, schoolId },
//                 include: { student: { select: { id: true, name: true, email: true } } }
//             }),
//             // 3. Get currently approved subjects for these students
//             prisma.studentSubject.findMany({
//                 where: { 
//                     schoolId, 
//                     student: { classEnrollments: { some: { classId } } } 
//                 },
//                 select: { studentId: true, gradeSubjectId: true }
//             })
//         ]);

//         if (!klass) throw new Error("Institutional registry for this class room not found.");

//         return {
//             success: true,
//             data: {
//                 className: klass.name,
//                 gradeName: klass.grade.displayName,
//                 gradeLevel: klass.grade.level,
//                 subjects: klass.grade.gradeSubjects.map(gs => ({ id: gs.id, name: gs.subject.name })),
//                 students: enrollments.map(e => e.student),
//                 existingMap: existingAllocations
//             }
//         };
//     } catch (err) {
//         console.error('getClassAllocationData failure:', getErrorMessage(err));
//         return { success: false, error: getErrorMessage(err) };
//     }
// }



// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { createClient } from '@/lib/supabase/server'
// import { revalidatePath } from 'next/cache'
// import { EnrollmentStatus, ActivityType } from '@prisma/client'
// import { logActivity } from '@/lib/activitylogger'

// // ── Types ──────────────────────────────────────────────────────────────────────

// export type NigerianStream = 'science' | 'arts' | 'commercial' | 'general'

// export interface SubjectAllocationData {
//     isNigerianCurriculum: boolean
//     grade: {
//         id:          string
//         displayName: string
//         level:       number
//         isJSS:       boolean
//         isSSS:       boolean
//     }
//     students: {
//         id:       string
//         name:     string | null
//         email:    string
//         stream:   NigerianStream | null
//         subjects: string[] // Array of gradeSubjectIds currently assigned
//     }[]
//     availableSubjects: {
//         id:          string
//         subjectName: string
//         isCompulsory: boolean
//         stream:      NigerianStream | null
//     }[]
// }

// // ── Helpers ────────────────────────────────────────────────────────────────────

// async function getAuthUser() {
//     const supabase = await createClient()
//     const { data: { user }, error } = await supabase.auth.getUser()
//     if (error || !user) return null
//     return user
// }

// /**
//  * Checks if curriculum is Nigerian using the 'type' or 'name' fields from schema
//  */
// async function isNigerianCurriculum(curriculumId: string): Promise<boolean> {
//     const curriculum = await prisma.curriculum.findUnique({
//         where:  { id: curriculumId },
//         select: { name: true, type: true }, 
//     })
//     if (!curriculum) return false

//     return (
//         curriculum.type === 'nigerian' || 
//         curriculum.name.toLowerCase().includes('nigeria') ||
//         curriculum.name.toLowerCase().includes('nerdc')
//     )
// }

// function classifyNigerianSubject(
//     subjectName: string,
//     isJSS:       boolean,
// ): { isCompulsory: boolean; stream: NigerianStream | null } {
//     if (isJSS) return { isCompulsory: true, stream: null }

//     const name = subjectName.toLowerCase()
    
//     // WAEC/NECO Compulsory Core
//     const core = ['english', 'mathematics', 'maths', 'civic', 'economics', 'biology', 'data processing', 'marketing', 'trade']
//     const isCompulsory = core.some(c => name.includes(c))

//     let stream: NigerianStream | null = null
//     if (name.includes('physics') || name.includes('chemistry') || name.includes('further math')) stream = 'science'
//     else if (name.includes('literature') || name.includes('government') || name.includes('history') || name.includes('christian') || name.includes('islamic')) stream = 'arts'
//     else if (name.includes('commerce') || name.includes('accounting') || name.includes('book keeping')) stream = 'commercial'

//     return { isCompulsory, stream }
// }

// // ── Main Data Fetcher ──────────────────────────────────────────────────────────

// export async function getClassSubjectAllocation(
//     classId:  string,
//     schoolId: string,
// ): Promise<SubjectAllocationData | null> {
//     try {
//         const cls = await prisma.class.findUnique({
//             where: { id: classId },
//             include: {
//                 grade: true,
//                 enrollments: {
//                     include: {
//                         student: {
//                             include: {
//                                 // Fetch existing assignments for this specific school
//                                 studentSubjects: { where: { schoolId } }
//                             }
//                         }
//                     }
//                 }
//             }
//         })

//         if (!cls) return null

//         const nigerian = await isNigerianCurriculum(cls.grade.curriculumId)
//         const isJSS = cls.grade.level >= 7 && cls.grade.level <= 9
//         const isSSS = cls.grade.level >= 10 && cls.grade.level <= 12

//         // ✅ THE FIX: Query gradeSubjects where schoolId matches OR is null (Global)
//         const gradeSubjects = await prisma.gradeSubject.findMany({
//             where: {
//                 gradeId: cls.gradeId,
//                 OR: [
//                     { schoolId: schoolId },
//                     { schoolId: null }
//                 ]
//             },
//             include: { subject: { select: { name: true } } },
//             orderBy: { subject: { name: 'asc' } }
//         })

//         const availableSubjects = gradeSubjects.map(gs => {
//             const { isCompulsory, stream } = nigerian 
//                 ? classifyNigerianSubject(gs.subject.name, isJSS)
//                 : { isCompulsory: false, stream: null }
            
//             return {
//                 id: gs.id,
//                 subjectName: gs.subject.name,
//                 isCompulsory,
//                 stream
//             }
//         })

//         const students = cls.enrollments.map(e => ({
//             id: e.student.id,
//             name: e.student.name,
//             email: e.student.email,
//             stream: null, 
//             subjects: e.student.studentSubjects.map(ss => ss.gradeSubjectId)
//         }))

//         return {
//             isNigerianCurriculum: nigerian,
//             grade: {
//                 id: cls.grade.id,
//                 displayName: cls.grade.displayName,
//                 level: cls.grade.level,
//                 isJSS,
//                 isSSS
//             },
//             students,
//             availableSubjects
//         }
//     } catch (err) {
//         console.error('getClassSubjectAllocation error:', getErrorMessage(err))
//         return null
//     }
// }

// // ── Persistence Logic ──────────────────────────────────────────────────────────

// /**
//  * Synchronizes the subjects for a specific student.
//  * Wipes current and creates new list in one transaction.
//  */
// export async function syncStudentSubjects(
//     schoolId: string,
//     studentId: string,
//     gradeSubjectIds: string[],
//     gradeLevel: number,
//     isNigerian: boolean
// ) {
//     try {
//         // Enforce WAEC Min-9 Rule for Senior Secondary
//         if (isNigerian && gradeLevel >= 10 && gradeSubjectIds.length < 9) {
//             throw new Error(`WAEC Policy: Senior students must take at least 9 subjects.`);
//         }

//         return await prisma.$transaction(async (tx) => {
//             // 1. Clear old allocations for this school
//             await tx.studentSubject.deleteMany({
//                 where: { studentId, schoolId }
//             });

//             // 2. Create new allocations
//             if (gradeSubjectIds.length > 0) {
//                 await tx.studentSubject.createMany({
//                     data: gradeSubjectIds.map(gsId => ({
//                         studentId,
//                         gradeSubjectId: gsId,
//                         schoolId,
//                         status: EnrollmentStatus.APPROVED,
//                         // Determine if compulsory based on name (optional logic)
//                         isCompulsory: true 
//                     }))
//                 });
//             }

//             // 3. Log Activity
//             await logActivity({
//                 schoolId,
//                 actorId: "SYSTEM",
//                 actorName: "Academic Admin",
//                 actorRole: "SCHOOL_ADMIN",
//                 type: ActivityType.CURRICULUM_UPDATED,
//                 title: 'Subjects Synchronized',
//                 description: `Updated subject registry for student. Count: ${gradeSubjectIds.length}`,
//                 metadata: { studentId }
//             });

//             return { success: true };
//         });
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// // ── Additional Helper ──────────────────────────────────────────────────────────

// export async function getSchoolClasses(schoolId: string) {
//     try {
//         return await prisma.class.findMany({
//             where: { schoolId },
//             include: { grade: true },
//             orderBy: { grade: { level: 'asc' } }
//         });
//     } catch (err) {
//         return [];
//     }
// }


// /**
//  * Fetches all classes for a school, including grade details and student counts.
//  * Used by the Admin Allocation Portal selection dropdown.
//  */
// export async function getSchoolClassesWithGrades(schoolId: string) {
//     try {
//         const classes = await prisma.class.findMany({
//             where: { schoolId },
//             orderBy: [
//                 { grade: { level: 'asc' } },
//                 { name: 'asc' }
//             ],
//             select: {
//                 id: true,
//                 name: true,
//                 grade: {
//                     select: {
//                         id: true,
//                         displayName: true,
//                         level: true,
//                     },
//                 },
//                 teacher: {
//                     select: { name: true },
//                 },
//                 _count: {
//                     select: { enrollments: true },
//                 },
//             },
//         });

//         return classes;
//     } catch (err) {
//         console.error('getSchoolClassesWithGrades error:', getErrorMessage(err));
//         return [];
//     }
// }

// export async function submitSeniorSubjects(
//     schoolId: string,
//     studentId: string, 
//     gradeSubjectIds: string[]
// ) {
//     try {
//         const { isNigeria } = await getCurriculumContext(schoolId);

//         const enrollment = await prisma.classEnrollment.findFirst({
//             where: { studentId },
//             include: { class: { include: { grade: true } } }
//         });

//         const isSenior = (enrollment?.class?.grade.level ?? 0) >= 10;

//         if (isNigeria && isSenior) {
//             if (gradeSubjectIds.length < 9) {
//                 throw new Error("WAEC standard requires a minimum of 9 subjects for Senior Secondary enrollment.");
//             }
//         }

//         await prisma.$transaction(async (tx) => {
//             await tx.studentSubject.deleteMany({ where: { studentId, schoolId } });
            
//             await tx.studentSubject.createMany({
//                 data: gradeSubjectIds.map(id => ({
//                     studentId,
//                     gradeSubjectId: id,
//                     schoolId,
//                     status: isNigeria && isSenior ? EnrollmentStatus.PENDING : EnrollmentStatus.APPROVED
//                 })),
//                 skipDuplicates: true
//             });
//         });

//         return { success: true };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }



// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { createClient } from '@/lib/supabase/server'
// import { revalidatePath } from 'next/cache'
// import { EnrollmentStatus, ActivityType } from '@prisma/client'
// import { logActivity } from '@/lib/activitylogger'

// // ── Types ──────────────────────────────────────────────────────────────────────

// export type NigerianStream = 'science' | 'arts' | 'commercial' | 'general'

// export interface SubjectAllocationData {
//     isNigerianCurriculum: boolean
//     grade: {
//         id:          string
//         displayName: string
//         level:       number
//         isJSS:       boolean
//         isSSS:       boolean
//     }
//     students: {
//         id:       string
//         name:     string | null
//         email:    string
//         stream:   NigerianStream | null
//         subjects: string[] // Array of gradeSubjectIds currently assigned
//     }[]
//     availableSubjects: {
//         id:          string
//         subjectName: string
//         isCompulsory: boolean
//         stream:      NigerianStream | null
//     }[]
// }

// export interface AllocateSubjectsInput {
//     studentId:       string
//     gradeSubjectIds: string[]
//     schoolId:        string
//     isCompulsory:    boolean
// }

// // ── Helpers ────────────────────────────────────────────────────────────────────

// async function getAuthUser() {
//     const supabase = await createClient()
//     const { data: { user }, error } = await supabase.auth.getUser()
//     if (error || !user) return null
//     return user
// }

// /**
//  * ✅ HELPER: Resolves the school's curriculum context
//  */
// async function getCurriculumContext(schoolId: string) {
//     const school = await prisma.school.findUnique({
//         where: { id: schoolId },
//         include: { curriculum: true }
//     });
    
//     const isNigeria = 
//         school?.curriculum.type === 'nigerian' || 
//         school?.curriculum.name.toLowerCase().includes('nigeria') || 
//         false;

//     return { isNigeria, curriculum: school?.curriculum };
// }

// async function isNigerianCurriculum(curriculumId: string): Promise<boolean> {
//     const curriculum = await prisma.curriculum.findUnique({
//         where:  { id: curriculumId },
//         select: { name: true, type: true }, 
//     })
//     if (!curriculum) return false

//     return (
//         curriculum.type === 'nigerian' || 
//         curriculum.name.toLowerCase().includes('nigeria') ||
//         curriculum.name.toLowerCase().includes('nerdc')
//     )
// }

// function classifyNigerianSubject(
//     subjectName: string,
//     isJSS:       boolean,
// ): { isCompulsory: boolean; stream: NigerianStream | null } {
//     if (isJSS) return { isCompulsory: true, stream: null }

//     const name = subjectName.toLowerCase()
//     const core = ['english', 'mathematics', 'maths', 'civic', 'economics', 'biology', 'data processing', 'marketing', 'trade']
//     const isCompulsory = core.some(c => name.includes(c))

//     let stream: NigerianStream | null = null
//     if (name.includes('physics') || name.includes('chemistry') || name.includes('further math')) stream = 'science'
//     else if (name.includes('literature') || name.includes('government') || name.includes('history') || name.includes('christian') || name.includes('islamic')) stream = 'arts'
//     else if (name.includes('commerce') || name.includes('accounting') || name.includes('book keeping')) stream = 'commercial'

//     return { isCompulsory, stream }
// }

// // ── Main Data Fetcher ──────────────────────────────────────────────────────────

// export async function getClassSubjectAllocation(
//     classId:  string,
//     schoolId: string,
// ): Promise<SubjectAllocationData | null> {
//     try {
//         const cls = await prisma.class.findUnique({
//             where: { id: classId },
//             include: {
//                 grade: true,
//                 enrollments: {
//                     include: {
//                         student: {
//                             include: {
//                                 studentSubjects: { where: { schoolId } }
//                             }
//                         }
//                     }
//                 }
//             }
//         })

//         if (!cls) return null

//         const nigerian = await isNigerianCurriculum(cls.grade.curriculumId)
//         const isJSS = cls.grade.level >= 7 && cls.grade.level <= 9
//         const isSSS = cls.grade.level >= 10 && cls.grade.level <= 12

//         const gradeSubjects = await prisma.gradeSubject.findMany({
//             where: {
//                 gradeId: cls.gradeId,
//                 OR: [
//                     { schoolId: schoolId },
//                     { schoolId: null }
//                 ]
//             },
//             include: { subject: { select: { name: true } } },
//             orderBy: { subject: { name: 'asc' } }
//         })

//         const availableSubjects = gradeSubjects.map(gs => {
//             const { isCompulsory, stream } = nigerian 
//                 ? classifyNigerianSubject(gs.subject.name, isJSS)
//                 : { isCompulsory: false, stream: null }
            
//             return {
//                 id: gs.id,
//                 subjectName: gs.subject.name,
//                 isCompulsory,
//                 stream
//             }
//         })

//         const students = cls.enrollments.map(e => ({
//             id: e.student.id,
//             name: e.student.name,
//             email: e.student.email,
//             stream: null, 
//             subjects: e.student.studentSubjects.map(ss => ss.gradeSubjectId)
//         }))

//         return {
//             isNigerianCurriculum: nigerian,
//             grade: {
//                 id: cls.grade.id,
//                 displayName: cls.grade.displayName,
//                 level: cls.grade.level,
//                 isJSS,
//                 isSSS
//             },
//             students,
//             availableSubjects
//         }
//     } catch (err) {
//         console.error('getClassSubjectAllocation error:', getErrorMessage(err))
//         return null
//     }
// }

// // ── Persistence Logic ──────────────────────────────────────────────────────────

// export async function syncStudentSubjects(
//     schoolId: string,
//     studentId: string,
//     gradeSubjectIds: string[],
//     gradeLevel: number,
//     isNigerian: boolean
// ) {
//     try {
//         if (isNigerian && gradeLevel >= 10 && gradeSubjectIds.length < 9) {
//             throw new Error(`WAEC Policy: Senior students must take at least 9 subjects.`);
//         }

//         return await prisma.$transaction(async (tx) => {
//             await tx.studentSubject.deleteMany({
//                 where: { studentId, schoolId }
//             });

//             if (gradeSubjectIds.length > 0) {
//                 await tx.studentSubject.createMany({
//                     data: gradeSubjectIds.map(gsId => ({
//                         studentId,
//                         gradeSubjectId: gsId,
//                         schoolId,
//                         status: EnrollmentStatus.APPROVED,
//                         isCompulsory: true 
//                     }))
//                 });
//             }

//             await logActivity({
//                 schoolId,
//                 actorId: "SYSTEM",
//                 actorName: "Academic Admin",
//                 actorRole: "SCHOOL_ADMIN",
//                 type: ActivityType.CURRICULUM_UPDATED,
//                 title: 'Subjects Synchronized',
//                 description: `Updated subject registry for student. Count: ${gradeSubjectIds.length}`,
//                 metadata: { studentId }
//             });

//             return { success: true };
//         });
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// export async function getSchoolClassesWithGrades(schoolId: string) {
//     try {
//         const classes = await prisma.class.findMany({
//             where: { schoolId },
//             orderBy: [
//                 { grade: { level: 'asc' } },
//                 { name: 'asc' }
//             ],
//             select: {
//                 id: true,
//                 name: true,
//                 grade: {
//                     select: {
//                         id: true,
//                         displayName: true,
//                         level: true,
//                     },
//                 },
//                 teacher: {
//                     select: { name: true },
//                 },
//                 _count: {
//                     select: { enrollments: true },
//                 },
//             },
//         });

//         return classes;
//     } catch (err) {
//         console.error('getSchoolClassesWithGrades error:', getErrorMessage(err));
//         return [];
//     }
// }

// export async function submitSeniorSubjects(
//     schoolId: string,
//     studentId: string, 
//     gradeSubjectIds: string[]
// ) {
//     try {
//         const { isNigeria } = await getCurriculumContext(schoolId);

//         const enrollment = await prisma.classEnrollment.findFirst({
//             where: { studentId },
//             include: { class: { include: { grade: true } } }
//         });

//         const isSenior = (enrollment?.class?.grade.level ?? 0) >= 10;

//         if (isNigeria && isSenior) {
//             if (gradeSubjectIds.length < 9) {
//                 throw new Error("WAEC standard requires a minimum of 9 subjects for Senior Secondary enrollment.");
//             }
//         }

//         await prisma.$transaction(async (tx) => {
//             await tx.studentSubject.deleteMany({ where: { studentId, schoolId } });
            
//             await tx.studentSubject.createMany({
//                 data: gradeSubjectIds.map(id => ({
//                     studentId,
//                     gradeSubjectId: id,
//                     schoolId,
//                     status: isNigeria && isSenior ? EnrollmentStatus.PENDING : EnrollmentStatus.APPROVED
//                 })),
//                 skipDuplicates: true
//             });
//         });

//         return { success: true };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }



// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { createClient } from '@/lib/supabase/server'
// import { revalidatePath } from 'next/cache'
// import { EnrollmentStatus, ActivityType } from '@prisma/client'
// import { logActivity } from '@/lib/activitylogger'

// // ── Types ──────────────────────────────────────────────────────────────────────

// export type NigerianStream = 'science' | 'arts' | 'commercial' | 'general'

// export interface SubjectAllocationData {
//     isNigerianCurriculum: boolean
//     grade: {
//         id:          string
//         displayName: string
//         level:       number
//         isJSS:       boolean
//         isSSS:       boolean
//     }
//     students: {
//         id:       string
//         name:     string | null
//         email:    string
//         stream:   NigerianStream | null
//         subjects: string[] 
//     }[]
//     availableSubjects: {
//         id:          string
//         subjectName: string
//         isCompulsory: boolean
//         stream:      NigerianStream | null
//     }[]
// }

// // ── Helpers ────────────────────────────────────────────────────────────────────

// async function getAuthUser() {
//     const supabase = await createClient()
//     const { data: { user }, error } = await supabase.auth.getUser()
//     if (error || !user) return null
//     return user
// }

// async function getCurriculumContext(schoolId: string) {
//     const school = await prisma.school.findUnique({
//         where: { id: schoolId },
//         include: { curriculum: true }
//     });
//     const isNigeria = school?.curriculum.type === 'nigerian' || school?.curriculum.name.toLowerCase().includes('nigeria') || false;
//     return { isNigeria, curriculum: school?.curriculum };
// }

// function classifyNigerianSubject(subjectName: string, isJSS: boolean): { isCompulsory: boolean; stream: NigerianStream | null } {
//     if (isJSS) return { isCompulsory: true, stream: null }
//     const name = subjectName.toLowerCase()
//     const core = ['english', 'mathematics', 'maths', 'civic', 'economics', 'biology', 'data processing', 'marketing', 'trade']
//     const isCompulsory = core.some(c => name.includes(c))
//     let stream: NigerianStream | null = null
//     if (name.includes('physics') || name.includes('chemistry') || name.includes('further math')) stream = 'science'
//     else if (name.includes('literature') || name.includes('government') || name.includes('history') || name.includes('crs') || name.includes('irs')) stream = 'arts'
//     else if (name.includes('commerce') || name.includes('accounting')) stream = 'commercial'
//     return { isCompulsory, stream }
// }

// // ── Core Actions for Allocation Matrix ──────────────────────────────────────────

// /**
//  * ✅ RESTORED: Fetches the data specifically for the Allocation Matrix UI
//  */
// export async function getClassAllocationData(classId: string, schoolId: string) {
//     try {
//         const [targetClass, enrollments, existingAllocations] = await Promise.all([
//             prisma.class.findUnique({
//                 where: { id: classId },
//                 include: { grade: { include: { gradeSubjects: { include: { subject: true } } } } }
//             }),
//             prisma.classEnrollment.findMany({
//                 where: { classId, schoolId },
//                 include: { student: { select: { id: true, name: true, email: true } } }
//             }),
//             prisma.studentSubject.findMany({
//                 where: { schoolId, student: { classEnrollments: { some: { classId } } } },
//                 select: { studentId: true, gradeSubjectId: true }
//             })
//         ]);

//         if (!targetClass) throw new Error("Classroom not found.");

//         return {
//             success: true,
//             data: {
//                 className: targetClass.name,
//                 gradeName: targetClass.grade.displayName,
//                 gradeLevel: targetClass.grade.level,
//                 subjects: targetClass.grade.gradeSubjects.map(gs => ({ id: gs.id, name: gs.subject.name })),
//                 students: enrollments.map(e => e.student),
//                 existingMap: existingAllocations
//             }
//         };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * ✅ RESTORED/RENAMED: Synchronizes a single student's subjects (Used by Matrix)
//  */
// export async function allocateStudentSubjects(
//     schoolId: string, 
//     studentId: string,
//     gradeSubjectIds: string[]
// ) {
//     try {
//         // Resolve context for validation
//         const enrollment = await prisma.classEnrollment.findFirst({
//             where: { studentId, schoolId },
//             include: { class: { include: { grade: true } } }
//         });
//         const { isNigeria } = await getCurriculumContext(schoolId);
//         const gradeLevel = enrollment?.class?.grade.level ?? 0;

//         if (isNigeria && gradeLevel >= 10 && gradeSubjectIds.length < 9) {
//             throw new Error(`Academic Standard: Senior students must have at least 9 subjects.`);
//         }

//         return await prisma.$transaction(async (tx) => {
//             await tx.studentSubject.deleteMany({ where: { studentId, schoolId } });
//             if (gradeSubjectIds.length > 0) {
//                 await tx.studentSubject.createMany({
//                     data: gradeSubjectIds.map(gsId => ({
//                         studentId,
//                         gradeSubjectId: gsId,
//                         schoolId,
//                         status: EnrollmentStatus.APPROVED 
//                     }))
//                 });
//             }
//             return { success: true };
//         });
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// // ── Student Elective Actions ───────────────────────────────────────────────────

// /**
//  * ✅ RESTORED: Submit elective selection for students
//  */
// export async function submitSeniorSubjects(
//     schoolId: string,
//     studentId: string, 
//     gradeSubjectIds: string[]
// ) {
//     try {
//         const { isNigeria } = await getCurriculumContext(schoolId);
//         const enrollment = await prisma.classEnrollment.findFirst({
//             where: { studentId },
//             include: { class: { include: { grade: true } } }
//         });
//         const isSenior = (enrollment?.class?.grade.level ?? 0) >= 10;

//         if (isNigeria && isSenior && gradeSubjectIds.length < 9) {
//             throw new Error("WAEC standard requires a minimum of 9 subjects.");
//         }

//         await prisma.$transaction(async (tx) => {
//             await tx.studentSubject.deleteMany({ where: { studentId, schoolId } });
//             await tx.studentSubject.createMany({
//                 data: gradeSubjectIds.map(id => ({
//                     studentId,
//                     gradeSubjectId: id,
//                     schoolId,
//                     status: isNigeria && isSenior ? EnrollmentStatus.PENDING : EnrollmentStatus.APPROVED
//                 }))
//             });
//         });
//         return { success: true };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// // ── Other Management Actions ──────────────────────────────────────────────────

// export async function getClassSubjectAllocation(classId: string, schoolId: string): Promise<SubjectAllocationData | null> {
//     try {
//         const cls = await prisma.class.findUnique({
//             where: { id: classId },
//             include: {
//                 grade: true,
//                 enrollments: { include: { student: { include: { studentSubjects: { where: { schoolId } } } } } }
//             }
//         })
//         if (!cls) return null;
//         const { isNigeria } = await getCurriculumContext(schoolId);
//         const gradeSubjects = await prisma.gradeSubject.findMany({
//             where: { gradeId: cls.gradeId, OR: [{ schoolId }, { schoolId: null }] },
//             include: { subject: { select: { name: true } } },
//             orderBy: { subject: { name: 'asc' } }
//         })
//         const availableSubjects = gradeSubjects.map(gs => {
//             const { isCompulsory, stream } = isNigeria ? classifyNigerianSubject(gs.subject.name, cls.grade.level <= 9) : { isCompulsory: false, stream: null }
//             return { id: gs.id, subjectName: gs.subject.name, isCompulsory, stream }
//         })
//         return {
//             isNigerianCurriculum: isNigeria,
//             grade: { id: cls.grade.id, displayName: cls.grade.displayName, level: cls.grade.level, isJSS: cls.grade.level <= 9, isSSS: cls.grade.level >= 10 },
//             students: cls.enrollments.map(e => ({ id: e.student.id, name: e.student.name, email: e.student.email, stream: null, subjects: e.student.studentSubjects.map(ss => ss.gradeSubjectId) })),
//             availableSubjects
//         }
//     } catch (err) {
//         return null;
//     }
// }

// export async function getSchoolClassesWithGrades(schoolId: string) {
//     return await prisma.class.findMany({
//         where: { schoolId },
//         include: { grade: true, _count: { select: { enrollments: true } } },
//         orderBy: { grade: { level: 'asc' } }
//     });
// }

// export async function allocateStreamSubjects(studentId: string, stream: NigerianStream, classId: string, schoolId: string) {
//     const data = await getClassSubjectAllocation(classId, schoolId);
//     if (!data) return { success: false };
//     const streamIds = data.availableSubjects.filter(s => s.isCompulsory || s.stream === stream).map(s => s.id);
//     return await allocateStudentSubjects(schoolId, studentId, streamIds);
// }

// export async function removeStudentSubject(studentId: string, gradeSubjectId: string, schoolId: string) {
//     try {
//         await prisma.studentSubject.delete({ where: { studentId_gradeSubjectId: { studentId, gradeSubjectId } } });
//         return { success: true };
//     } catch (err) {
//         return { success: false };
//     }
// }

// export async function autoAllocateCompulsorySubjects(
//     classId: string,
//     schoolId: string
// ): Promise<{ success: boolean; error?: string; allocated?: number }> {
//     try {
//         // 1. Get the class to find the grade
//         const cls = await prisma.class.findUnique({
//             where: { id: classId },
//             select: { gradeId: true }
//         });

//         if (!cls) throw new Error("Class not found");

//         // 2. Get all students in this class
//         const enrollments = await prisma.classEnrollment.findMany({
//             where: { classId, schoolId },
//             select: { studentId: true }
//         });

//         // 3. Find subjects that are "Compulsory" for this grade
//         // Based on our classification logic (Maths, English, etc.)
//         const gradeSubjects = await prisma.gradeSubject.findMany({
//             where: { 
//                 gradeId: cls.gradeId,
//                 OR: [{ schoolId }, { schoolId: null }]
//             },
//             include: { subject: { select: { name: true } } }
//         });

//         // Identify compulsory ones using the same logic as our fetcher
//         const coreKeywords = ['english', 'mathematics', 'maths', 'civic', 'economics', 'biology'];
//         const compulsoryIds = gradeSubjects
//             .filter(gs => coreKeywords.some(kw => gs.subject.name.toLowerCase().includes(kw)))
//             .map(gs => gs.id);

//         if (compulsoryIds.length === 0) return { success: true, allocated: 0 };

//         // 4. Create many-to-many links in StudentSubject
//         const dataToCreate = enrollments.flatMap(enrollment => 
//             compulsoryIds.map(gsId => ({
//                 studentId: enrollment.studentId,
//                 gradeSubjectId: gsId,
//                 schoolId,
//                 status: EnrollmentStatus.APPROVED,
//                 isCompulsory: true
//             }))
//         );

//         const result = await prisma.studentSubject.createMany({
//             data: dataToCreate,
//             skipDuplicates: true
//         });

//         revalidatePath('/admin/subject');
//         return { success: true, allocated: result.count };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * Logic: Adds specific subjects to a single student's academic registry.
//  */
// export async function allocateSubjectsToStudent(input: {
//     studentId: string;
//     gradeSubjectIds: string[];
//     schoolId: string;
//     isCompulsory: boolean;
// }): Promise<{ success: boolean; error?: string }> {
//     try {
//         await prisma.studentSubject.createMany({
//             data: input.gradeSubjectIds.map(id => ({
//                 studentId: input.studentId,
//                 gradeSubjectId: id,
//                 schoolId: input.schoolId,
//                 status: EnrollmentStatus.APPROVED,
//                 isCompulsory: input.isCompulsory
//             })),
//             skipDuplicates: true
//         });

//         revalidatePath('/admin/subject');
//         return { success: true };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }


'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { EnrollmentStatus, ActivityType } from '@prisma/client'
import { logActivity } from '@/lib/activitylogger'

// ── Types ──────────────────────────────────────────────────────────────────────

export type NigerianStream = 'science' | 'arts' | 'commercial' | 'general'

export interface SubjectAllocationData {
    isNigerianCurriculum: boolean
    grade: {
        id:          string
        displayName: string
        level:       number
        isJSS:       boolean
        isSSS:       boolean
    }
    students: {
        id:       string
        name:     string | null
        email:    string
        stream:   NigerianStream | null
        subjects: string[] 
    }[]
    availableSubjects: {
        id:          string
        subjectName: string
        isCompulsory: boolean
        stream:      NigerianStream | null
    }[]
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Validates session and returns the current user.
 */
async function getAuthUser() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return user
}

async function getCurriculumContext(schoolId: string) {
    const school = await prisma.school.findUnique({
        where: { id: schoolId },
        include: { curriculum: true }
    });
    const isNigeria = school?.curriculum.type === 'nigerian' || school?.curriculum.name.toLowerCase().includes('nigeria') || false;
    return { isNigeria, curriculum: school?.curriculum };
}

function classifyNigerianSubject(subjectName: string, isJSS: boolean): { isCompulsory: boolean; stream: NigerianStream | null } {
    if (isJSS) return { isCompulsory: true, stream: null }
    const name = subjectName.toLowerCase()
    const core = ['english', 'mathematics', 'maths', 'civic', 'economics', 'biology', 'data processing', 'marketing', 'trade']
    const isCompulsory = core.some(c => name.includes(c))
    let stream: NigerianStream | null = null
    if (name.includes('physics') || name.includes('chemistry') || name.includes('further math')) stream = 'science'
    else if (name.includes('literature') || name.includes('government') || name.includes('history') || name.includes('crs') || name.includes('irs')) stream = 'arts'
    else if (name.includes('commerce') || name.includes('accounting')) stream = 'commercial'
    return { isCompulsory, stream }
}

// ── Core Actions ──────────────────────────────────────────────────────────

export async function getClassAllocationData(classId: string, schoolId: string) {
    try {
        const [targetClass, enrollments, existingAllocations] = await Promise.all([
            prisma.class.findUnique({
                where: { id: classId },
                include: { grade: { include: { gradeSubjects: { include: { subject: true } } } } }
            }),
            prisma.classEnrollment.findMany({
                where: { classId, schoolId },
                include: { student: { select: { id: true, name: true, email: true } } }
            }),
            prisma.studentSubject.findMany({
                where: { schoolId, student: { classEnrollments: { some: { classId } } } },
                select: { studentId: true, gradeSubjectId: true }
            })
        ]);

        if (!targetClass) throw new Error("Classroom not found.");

        return {
            success: true,
            data: {
                className: targetClass.name,
                gradeName: targetClass.grade.displayName,
                gradeLevel: targetClass.grade.level,
                subjects: targetClass.grade.gradeSubjects.map(gs => ({ id: gs.id, name: gs.subject.name })),
                students: enrollments.map(e => e.student),
                existingMap: existingAllocations
            }
        };
    } catch (err) {
        return { success: false, error: getErrorMessage(err) };
    }
}

export async function allocateStudentSubjects(
    schoolId: string, 
    studentId: string,
    gradeSubjectIds: string[]
) {
    try {
        const user = await getAuthUser();
        if (!user) throw new Error("Unauthorized");

        const enrollment = await prisma.classEnrollment.findFirst({
            where: { studentId, schoolId },
            include: { class: { include: { grade: true } } }
        });
        const { isNigeria } = await getCurriculumContext(schoolId);
        const gradeLevel = enrollment?.class?.grade.level ?? 0;

        if (isNigeria && gradeLevel >= 10 && gradeSubjectIds.length < 9) {
            throw new Error(`Academic Standard: Senior students must have at least 9 subjects.`);
        }

        const result = await prisma.$transaction(async (tx) => {
            await tx.studentSubject.deleteMany({ where: { studentId, schoolId } });
            if (gradeSubjectIds.length > 0) {
                await tx.studentSubject.createMany({
                    data: gradeSubjectIds.map(gsId => ({
                        studentId,
                        gradeSubjectId: gsId,
                        schoolId,
                        status: EnrollmentStatus.APPROVED 
                    }))
                });
            }
            return { success: true };
        });

        await logActivity({
            schoolId,
            actorId: user.id,
            type: ActivityType.CURRICULUM_UPDATED,
            title: "Subjects Allocated",
            description: `Manual subject allocation updated for student ID: ${studentId}`,
        });

        revalidatePath('/admin/curriculum/allocation');
        return result;
    } catch (err) {
        return { success: false, error: getErrorMessage(err) };
    }
}

export async function submitSeniorSubjects(
    schoolId: string,
    studentId: string, 
    gradeSubjectIds: string[]
) {
    try {
        const user = await getAuthUser();
        if (!user) throw new Error("Unauthorized");

        const { isNigeria } = await getCurriculumContext(schoolId);
        const enrollment = await prisma.classEnrollment.findFirst({
            where: { studentId },
            include: { class: { include: { grade: true } } }
        });
        const isSenior = (enrollment?.class?.grade.level ?? 0) >= 10;

        if (isNigeria && isSenior && gradeSubjectIds.length < 9) {
            throw new Error("WAEC standard requires a minimum of 9 subjects.");
        }

        await prisma.$transaction(async (tx) => {
            await tx.studentSubject.deleteMany({ where: { studentId, schoolId } });
            await tx.studentSubject.createMany({
                data: gradeSubjectIds.map(id => ({
                    studentId,
                    gradeSubjectId: id,
                    schoolId,
                    status: isNigeria && isSenior ? EnrollmentStatus.PENDING : EnrollmentStatus.APPROVED
                }))
            });
        });

        await logActivity({
            schoolId,
            actorId: user.id,
            type: ActivityType.SETTINGS_UPDATED,
            title: "Electives Submitted",
            description: `Student ${user.email} submitted ${gradeSubjectIds.length} electives for approval.`,
        });

        revalidatePath('/parent/dashboard');
        return { success: true };
    } catch (err) {
        return { success: false, error: getErrorMessage(err) };
    }
}

export async function removeStudentSubject(studentId: string, gradeSubjectId: string, schoolId: string) {
    try {
        const user = await getAuthUser();
        if (!user) throw new Error("Unauthorized");

        await prisma.studentSubject.delete({ 
            where: { 
                studentId_gradeSubjectId: { studentId, gradeSubjectId },
                schoolId // ✅ Security: Ensure school ownership
            } 
        });

        await logActivity({
            schoolId,
            actorId: user.id,
            type: ActivityType.CURRICULUM_UPDATED,
            title: "Subject Removed",
            description: `Removed gradeSubject ${gradeSubjectId} from student ${studentId}`,
        });

        revalidatePath('/admin/curriculum/allocation');
        return { success: true };
    } catch (err) {
        return { success: false, error: getErrorMessage(err) };
    }
}

export async function autoAllocateCompulsorySubjects(
    classId: string,
    schoolId: string
): Promise<{ success: boolean; error?: string; allocated?: number }> {
    try {
        const user = await getAuthUser();
        if (!user) throw new Error("Unauthorized");

        const cls = await prisma.class.findUnique({
            where: { id: classId },
            select: { gradeId: true, name: true }
        });

        if (!cls) throw new Error("Class not found");

        const enrollments = await prisma.classEnrollment.findMany({
            where: { classId, schoolId },
            select: { studentId: true }
        });

        const gradeSubjects = await prisma.gradeSubject.findMany({
            where: { 
                gradeId: cls.gradeId,
                OR: [{ schoolId }, { schoolId: null }]
            },
            include: { subject: { select: { name: true } } }
        });

        const coreKeywords = ['english', 'mathematics', 'maths', 'civic', 'economics', 'biology'];
        const compulsoryIds = gradeSubjects
            .filter(gs => coreKeywords.some(kw => gs.subject.name.toLowerCase().includes(kw)))
            .map(gs => gs.id);

        if (compulsoryIds.length === 0) return { success: true, allocated: 0 };

        const dataToCreate = enrollments.flatMap(enrollment => 
            compulsoryIds.map(gsId => ({
                studentId: enrollment.studentId,
                gradeSubjectId: gsId,
                schoolId,
                status: EnrollmentStatus.APPROVED,
                isCompulsory: true
            }))
        );

        const result = await prisma.studentSubject.createMany({
            data: dataToCreate,
            skipDuplicates: true
        });

        await logActivity({
            schoolId,
            actorId: user.id,
            type: ActivityType.CURRICULUM_UPDATED,
            title: "Bulk Auto-Allocation",
            description: `Auto-allocated core subjects for class: ${cls.name}`,
        });

        revalidatePath('/admin/curriculum/allocation');
        return { success: true, allocated: result.count };
    } catch (err) {
        return { success: false, error: getErrorMessage(err) };
    }
}

// ── Standard Getters ──────────────────────────────────────────────────────────

export async function getClassSubjectAllocation(classId: string, schoolId: string): Promise<SubjectAllocationData | null> {
    try {
        const cls = await prisma.class.findUnique({
            where: { id: classId },
            include: {
                grade: true,
                enrollments: { include: { student: { include: { studentSubjects: { where: { schoolId } } } } } }
            }
        })
        if (!cls) return null;
        const { isNigeria } = await getCurriculumContext(schoolId);
        const gradeSubjects = await prisma.gradeSubject.findMany({
            where: { gradeId: cls.gradeId, OR: [{ schoolId }, { schoolId: null }] },
            include: { subject: { select: { name: true } } },
            orderBy: { subject: { name: 'asc' } }
        })
        const availableSubjects = gradeSubjects.map(gs => {
            const { isCompulsory, stream } = isNigeria ? classifyNigerianSubject(gs.subject.name, cls.grade.level <= 9) : { isCompulsory: false, stream: null }
            return { id: gs.id, subjectName: gs.subject.name, isCompulsory, stream }
        })
        return {
            isNigerianCurriculum: isNigeria,
            grade: { id: cls.grade.id, displayName: cls.grade.displayName, level: cls.grade.level, isJSS: cls.grade.level <= 9, isSSS: cls.grade.level >= 10 },
            students: cls.enrollments.map(e => ({ id: e.student.id, name: e.student.name, email: e.student.email, stream: null, subjects: e.student.studentSubjects.map(ss => ss.gradeSubjectId) })),
            availableSubjects
        }
    } catch (err) {
        console.error(getErrorMessage(err));
        return null;
    }
}

export async function getSchoolClassesWithGrades(schoolId: string) {
    return await prisma.class.findMany({
        where: { schoolId },
        include: { grade: true, _count: { select: { enrollments: true } } },
        orderBy: { grade: { level: 'asc' } }
    });
}

export async function allocateSubjectsToStudent(input: {
    studentId: string;
    gradeSubjectIds: string[];
    schoolId: string;
    isCompulsory: boolean;
}): Promise<{ success: boolean; error?: string }> {
    try {
        const user = await getAuthUser();
        if (!user) throw new Error("Unauthorized");

        await prisma.studentSubject.createMany({
            data: input.gradeSubjectIds.map(id => ({
                studentId: input.studentId,
                gradeSubjectId: id,
                schoolId: input.schoolId,
                status: EnrollmentStatus.APPROVED,
                isCompulsory: input.isCompulsory
            })),
            skipDuplicates: true
        });

        await logActivity({
            schoolId: input.schoolId,
            actorId: user.id,
            type: ActivityType.CURRICULUM_UPDATED,
            title: "Subjects Added",
            description: `Manually added ${input.gradeSubjectIds.length} subjects to student ${input.studentId}`,
        });

        revalidatePath('/admin/curriculum/allocation');
        return { success: true };
    } catch (err) {
        return { success: false, error: getErrorMessage(err) };
    }
}

export async function allocateStreamSubjects(studentId: string, stream: NigerianStream, classId: string, schoolId: string) {
    const data = await getClassSubjectAllocation(classId, schoolId);
    if (!data) return { success: false };
    const streamIds = data.availableSubjects.filter(s => s.isCompulsory || s.stream === stream).map(s => s.id);
    return await allocateStudentSubjects(schoolId, studentId, streamIds);
}