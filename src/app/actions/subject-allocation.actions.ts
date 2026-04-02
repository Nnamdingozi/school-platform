// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { createClient } from '@/lib/supabase/server'
// import { revalidatePath } from 'next/cache'

// // ── Types ──────────────────────────────────────────────────────────────────────

// export type NigerianStream = 'science' | 'arts' | 'commercial' | 'general'

// export interface SubjectAllocationData {
//     isNigerianCurriculum: boolean
//     grade: {
//         id:          string
//         displayName: string
//         level:       number
//         isJSS:       boolean  // JSS = levels 1-3, SSS = levels 4-6
//         isSSS:       boolean
//     }
//     students: {
//         id:          string
//         name:        string | null
//         stream:      NigerianStream | null
//         subjects:    {
//             id:            string
//             gradeSubjectId: string
//             subjectName:   string
//             isCompulsory:  boolean
//             status:        string
//         }[]
//     }[]
//     availableSubjects: {
//         id:          string  // gradeSubjectId
//         subjectName: string
//         isCompulsory: boolean
//         stream:      NigerianStream | null  // null = all streams
//     }[]
// }

// export interface AllocateSubjectsInput {
//     studentId:      string
//     gradeSubjectIds: string[]
//     schoolId:       string
//     isCompulsory:   boolean
// }

// export interface SetStreamInput {
//     studentId: string
//     stream:    NigerianStream
//     schoolId:  string
//     classId:   string
// }

// // ── Check Nigerian curriculum ──────────────────────────────────────────────────

// async function isNigerianCurriculum(curriculumId: string): Promise<boolean> {
//     const curriculum = await prisma.curriculum.findUnique({
//         where:  { id: curriculumId },
//         select: { name: true, type: true },
//     })
//     if (!curriculum) return false

//     // Check by type field first (preferred), fall back to name matching
//     if (curriculum.type) {
//         return curriculum.type.toLowerCase() === 'nigerian'
//     }

//     const name = curriculum.name.toLowerCase()
//     return (
//         name.includes('nigeria') ||
//         name.includes('nerdc')   ||
//         name.includes('waec')    ||
//         name.includes('neco')
//     )
// }

// // ── Nigerian grade helper ──────────────────────────────────────────────────────
// // Nigerian secondary: JSS1=1, JSS2=2, JSS3=3, SSS1=4, SSS2=5, SSS3=6

// function getNigerianGradeInfo(level: number) {
//     const isJSS = level >= 7 && level <= 9
//     const isSSS = level >= 10 && level <= 12

//     const label = isJSS
//         ? `JSS ${level - 6}`   // 7→JSS 1, 8→JSS 2, 9→JSS 3
//         : isSSS
//         ? `SSS ${level - 9}`   // 10→SSS 1, 11→SSS 2, 12→SSS 3
//         : `Grade ${level}`     // fallback for other curricula

//     return { isJSS, isSSS, label }
// }

// // ── Get stream from profile metadata ──────────────────────────────────────────
// // We store stream in a dedicated field — for now we derive it from
// // their subject allocation pattern (most compulsory subjects indicate stream)

// async function getStudentStream(
//     studentId: string,
//     schoolId:  string,
// ): Promise<NigerianStream | null> {
//     // Check existing subject allocations to infer stream
//     const subjects = await prisma.studentSubject.findMany({
//         where: {
//             studentId,
//             schoolId,
//         },
//         select: {
//             gradeSubject: {
//                 select: {
//                     subject: { select: { name: true } },
//                 },
//             },
//         },
//     })

//     const subjectNames = subjects.map(
//         s => s.gradeSubject.subject.name.toLowerCase()
//     )

//     // Infer stream from subjects
//     if (subjectNames.some(n => n.includes('physics') || n.includes('chemistry') || n.includes('biology') || n.includes('further math'))) {
//         return 'science'
//     }
//     if (subjectNames.some(n => n.includes('literature') || n.includes('government') || n.includes('history') || n.includes('yoruba') || n.includes('igbo') || n.includes('hausa'))) {
//         return 'arts'
//     }
//     if (subjectNames.some(n => n.includes('commerce') || n.includes('accounting') || n.includes('economics') || n.includes('typewriting'))) {
//         return 'commercial'
//     }

//     return null
// }

// // ── Get subject allocation data for a class ───────────────────────────────────

// export async function getClassSubjectAllocation(
//     classId:  string,
//     schoolId: string,
// ): Promise<SubjectAllocationData | null> {
//     try {
//         const authClient = await createClient()
//         const { data: { user }, error } = await authClient.auth.getUser()
//         if (error || !user) return null

//         // Fetch class with grade and enrolled students
//         const cls = await prisma.class.findUnique({
//             where: { id: classId },
//             select: {
//                 id:      true,
//                 name:    true,
//                 gradeId: true,
//                 grade: {
//                     select: {
//                         id:           true,
//                         level:        true,
//                         displayName:  true,
//                         curriculumId: true,
//                         gradeSubjects: {
//                             where: { schoolId },
//                             select: {
//                                 id:      true,
//                                 subject: { select: { name: true } },
//                             },
//                         },
//                     },
//                 },
//                 enrollments: {
//                     select: {
//                         student: {
//                             select: {
//                                 id:   true,
//                                 name: true,
//                                 studentSubjects: {
//                                     where: { schoolId },
//                                     select: {
//                                         id:            true,
//                                         gradeSubjectId: true,
//                                         isCompulsory:  true,
//                                         status:        true,
//                                         gradeSubject: {
//                                             select: {
//                                                 subject: { select: { name: true } },
//                                             },
//                                         },
//                                     },
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//         })

//         if (!cls) return null

//         const nigerian = await isNigerianCurriculum(cls.grade.curriculumId)
//         const gradeInfo = getNigerianGradeInfo(cls.grade.level)

//         // Build available subjects for this grade
//         const availableSubjects = cls.grade.gradeSubjects.map(gs => {
//             const name = gs.subject.name.toLowerCase()

//             // Determine if compulsory based on Nigerian curriculum rules
//             let isCompulsory = false
//             let stream: NigerianStream | null = null

//             if (nigerian) {
//                 if (gradeInfo.isJSS) {
//                     // JSS: all subjects compulsory
//                     isCompulsory = true
//                     stream       = null
//                 } else {
//                     // SSS: core subjects compulsory for all
//                     const coreSubjects = [
//                         'english', 'mathematics', 'civic', 'economics',
//                         'computer', 'agricultural'
//                     ]
//                     isCompulsory = coreSubjects.some(c => name.includes(c))

//                     // Assign stream
//                     if (name.includes('physics') || name.includes('chemistry') || name.includes('biology') || name.includes('further math')) {
//                         stream = 'science'
//                     } else if (name.includes('literature') || name.includes('government') || name.includes('history') || name.includes('yoruba') || name.includes('igbo') || name.includes('hausa')) {
//                         stream = 'arts'
//                     } else if (name.includes('commerce') || name.includes('accounting') || name.includes('typewriting')) {
//                         stream = 'commercial'
//                     }
//                 }
//             }

//             return {
//                 id:          gs.id,
//                 subjectName: gs.subject.name,
//                 isCompulsory,
//                 stream,
//             }
//         })

//         // Build students with their current allocation
//         const students = await Promise.all(
//             cls.enrollments.map(async e => {
//                 const stream = nigerian
//                     ? await getStudentStream(e.student.id, schoolId)
//                     : null

//                 return {
//                     id:      e.student.id,
//                     name:    e.student.name,
//                     stream,
//                     subjects: e.student.studentSubjects.map(ss => ({
//                         id:            ss.id,
//                         gradeSubjectId: ss.gradeSubjectId,
//                         subjectName:   ss.gradeSubject.subject.name,
//                         isCompulsory:  ss.isCompulsory,
//                         status:        ss.status,
//                     })),
//                 }
//             })
//         )

//         return {
//             isNigerianCurriculum: nigerian,
//             grade: {
//                 id:          cls.grade.id,
//                 displayName: cls.grade.displayName,
//                 level:       cls.grade.level,
//                 ...gradeInfo,
//             },
//             students,
//             availableSubjects,
//         }
//     } catch (err) {
//         console.error('getClassSubjectAllocation error:', getErrorMessage(err))
//         return null
//     }
// }

// // ── Allocate subjects to a single student ─────────────────────────────────────

// export async function allocateSubjectsToStudent(
//     input: AllocateSubjectsInput
// ): Promise<{ success: boolean; error?: string; allocated?: number }> {
//     try {
//         const authClient = await createClient()
//         const { data: { user }, error } = await authClient.auth.getUser()
//         if (error || !user) return { success: false, error: 'Unauthorized.' }

//         // Upsert each subject — skip if already allocated
//         const results = await Promise.allSettled(
//             input.gradeSubjectIds.map(gradeSubjectId =>
//                 prisma.studentSubject.upsert({
//                     where: {
//                         studentId_gradeSubjectId: {
//                             studentId:      input.studentId,
//                             gradeSubjectId,
//                         },
//                     },
//                     update: { status: 'APPROVED' },
//                     create: {
//                         studentId:      input.studentId,
//                         gradeSubjectId,
//                         schoolId:       input.schoolId,
//                         isCompulsory:   input.isCompulsory,
//                         status:         'APPROVED',
//                     },
//                 })
//             )
//         )

//         const allocated = results.filter(r => r.status === 'fulfilled').length
//         const failed    = results.filter(r => r.status === 'rejected').length

//         if (failed > 0) {
//             console.warn(`${failed} subject allocations failed for student ${input.studentId}`)
//         }

//         revalidatePath('/admin/classes')

//         return { success: true, allocated }
//     } catch (err) {
//         console.error('allocateSubjectsToStudent error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Auto-allocate compulsory subjects to all students in a class ──────────────
// // Nigerian JSS: allocate ALL subjects
// // Nigerian SSS: allocate only core/compulsory subjects

// export async function autoAllocateCompulsorySubjects(
//     classId:  string,
//     schoolId: string,
// ): Promise<{ success: boolean; error?: string; allocated?: number }> {
//     try {
//         const authClient = await createClient()
//         const { data: { user }, error } = await authClient.auth.getUser()
//         if (error || !user) return { success: false, error: 'Unauthorized.' }

//         const allocationData = await getClassSubjectAllocation(classId, schoolId)
//         if (!allocationData) return { success: false, error: 'Class not found.' }

//         const compulsorySubjects = allocationData.availableSubjects.filter(
//             s => s.isCompulsory
//         )

//         if (compulsorySubjects.length === 0) {
//             return { success: false, error: 'No compulsory subjects found for this grade.' }
//         }

//         let totalAllocated = 0

//         for (const student of allocationData.students) {
//             const result = await allocateSubjectsToStudent({
//                 studentId:       student.id,
//                 gradeSubjectIds: compulsorySubjects.map(s => s.id),
//                 schoolId,
//                 isCompulsory:    true,
//             })
//             totalAllocated += result.allocated ?? 0
//         }

//         revalidatePath('/admin/classes')

//         return { success: true, allocated: totalAllocated }
//     } catch (err) {
//         console.error('autoAllocateCompulsorySubjects error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Allocate stream subjects to a student (SSS only) ──────────────────────────

// export async function allocateStreamSubjects(
//     studentId: string,
//     stream:    NigerianStream,
//     classId:   string,
//     schoolId:  string,
// ): Promise<{ success: boolean; error?: string; allocated?: number }> {
//     try {
//         const authClient = await createClient()
//         const { data: { user }, error } = await authClient.auth.getUser()
//         if (error || !user) return { success: false, error: 'Unauthorized.' }

//         const allocationData = await getClassSubjectAllocation(classId, schoolId)
//         if (!allocationData) return { success: false, error: 'Class not found.' }

//         if (!allocationData.isNigerianCurriculum) {
//             return { success: false, error: 'Stream allocation only applies to Nigerian curriculum.' }
//         }

//         if (allocationData.grade.isJSS) {
//             return { success: false, error: 'Stream allocation does not apply to JSS grades.' }
//         }

//         // Get subjects for this stream + compulsory subjects
//         const streamSubjects = allocationData.availableSubjects.filter(
//             s => s.stream === stream || s.isCompulsory
//         )

//         const result = await allocateSubjectsToStudent({
//             studentId,
//             gradeSubjectIds: streamSubjects.map(s => s.id),
//             schoolId,
//             isCompulsory:    false,
//         })

//         revalidatePath('/admin/classes')

//         return result
//     } catch (err) {
//         console.error('allocateStreamSubjects error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Remove subject from student ────────────────────────────────────────────────

// export async function removeStudentSubject(
//     studentId:      string,
//     gradeSubjectId: string,
//     schoolId:       string,
// ): Promise<{ success: boolean; error?: string }> {
//     try {
//         const authClient = await createClient()
//         const { data: { user }, error } = await authClient.auth.getUser()
//         if (error || !user) return { success: false, error: 'Unauthorized.' }

//         await prisma.studentSubject.delete({
//             where: {
//                 studentId_gradeSubjectId: {
//                     studentId,
//                     gradeSubjectId,
//                 },
//             },
//         })

//         revalidatePath('/admin/classes')

//         return { success: true }
//     } catch (err) {
//         console.error('removeStudentSubject error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Get classes for school (for page selector) ────────────────────────────────

// export async function getSchoolClassesWithGrades(schoolId: string) {
//     try {
//         return await prisma.class.findMany({
//             where:   { schoolId },
//             orderBy: [
//                 { grade: { level: 'asc' } },
//                 { name:  'asc'            },
//             ],
//             select: {
//                 id:   true,
//                 name: true,
//                 grade: {
//                     select: {
//                         id:          true,
//                         displayName: true,
//                         level:       true,
//                     },
//                 },
//                 teacher: {
//                     select: { name: true },
//                 },
//                 _count: {
//                     select: { enrollments: true },
//                 },
//             },
//         })
//     } catch (err) {
//         console.error('getSchoolClassesWithGrades error:', getErrorMessage(err))
//         return []
//     }
// }



// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { createClient } from '@/lib/supabase/server'
// import { revalidatePath } from 'next/cache'
// import { EnrollmentStatus } from '@prisma/client'

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
//         stream:   NigerianStream | null
//         subjects: {
//             id:             string
//             gradeSubjectId: string
//             subjectName:    string
//             isCompulsory:   boolean
//             status:         string
//         }[]
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

// // ── Auth helper ────────────────────────────────────────────────────────────────

// async function getAuthUser() {
//     const supabase = await createClient()
//     const { data: { user }, error } = await supabase.auth.getUser()
//     if (error || !user) return null
//     return user
// }

// // ── Nigerian curriculum check ──────────────────────────────────────────────────
// // ✅ Only uses fields that exist in your schema (name only — no type field)

// async function isNigerianCurriculum(curriculumId: string): Promise<boolean> {
//     const curriculum = await prisma.curriculum.findUnique({
//         where:  { id: curriculumId },
//         select: { name: true },       // ✅ type field does not exist in schema
//     })
//     if (!curriculum) return false

//     const name = curriculum.name.toLowerCase()
//     return (
//         name.includes('nigeria') ||
//         name.includes('nerdc')   ||
//         name.includes('waec')    ||
//         name.includes('neco')
//     )
// }

// // ── Nigerian grade helper ──────────────────────────────────────────────────────
// // DB levels: JSS1=7, JSS2=8, JSS3=9, SSS1=10, SSS2=11, SSS3=12

// function getNigerianGradeInfo(level: number) {
//     const isJSS = level >= 7  && level <= 9
//     const isSSS = level >= 10 && level <= 12

//     const label = isJSS
//         ? `JSS ${level - 6}`   // 7→JSS 1, 8→JSS 2, 9→JSS 3
//         : isSSS
//         ? `SSS ${level - 9}`   // 10→SSS 1, 11→SSS 2, 12→SSS 3
//         : `Grade ${level}`

//     return { isJSS, isSSS, label }
// }

// // ── Infer stream from subject names already in memory ─────────────────────────

// function inferStreamFromSubjects(subjectNames: string[]): NigerianStream | null {
//     const names = subjectNames.map(n => n.toLowerCase())

//     if (names.some(n =>
//         n.includes('physics')     || n.includes('chemistry') ||
//         n.includes('biology')     || n.includes('further math')
//     )) return 'science'

//     if (names.some(n =>
//         n.includes('literature')  || n.includes('government') ||
//         n.includes('history')     || n.includes('yoruba')     ||
//         n.includes('igbo')        || n.includes('hausa')
//     )) return 'arts'

//     if (names.some(n =>
//         n.includes('commerce')    || n.includes('accounting') ||
//         n.includes('typewriting') || n.includes('book keeping')
//     )) return 'commercial'

//     return null
// }

// // ── Classify subject compulsory/stream for Nigerian SSS ───────────────────────

// function classifyNigerianSubject(
//     subjectName: string,
//     isJSS:       boolean,
// ): { isCompulsory: boolean; stream: NigerianStream | null } {
//     if (isJSS) {
//         // JSS: all subjects compulsory, no streams
//         return { isCompulsory: true, stream: null }
//     }

//     const name = subjectName.toLowerCase()

//     // SSS core subjects — compulsory for all streams
//     const coreSubjects = [
//         'english', 'mathematics', 'civic',
        
//     ]
//     const isCompulsory = coreSubjects.some(c => name.includes(c))

//     let stream: NigerianStream | null = null
//     if (name.includes('physics')     || name.includes('chemistry')    ||
//         name.includes('biology')     || name.includes('further math')) {
//         stream = 'science'
//     } else if (name.includes('literature') || name.includes('government') ||
//                name.includes('history')    || name.includes('yoruba')     ||
//                name.includes('igbo')       || name.includes('hausa')) {
//         stream = 'arts'
//     } else if (name.includes('commerce')   || name.includes('accounting') ||
//                name.includes('typewriting') || name.includes('book keeping')) {
//         stream = 'commercial'
//     }

//     return { isCompulsory, stream }
// }

// // ── Get subject allocation data for a class ───────────────────────────────────

// export async function getClassSubjectAllocation(
//     classId:  string,
//     schoolId: string,
// ): Promise<SubjectAllocationData | null> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return null

//         const cls = await prisma.class.findUnique({
//             where: { id: classId },
//             select: {
//                 id:      true,
//                 name:    true,
//                 gradeId: true,
//                 grade: {
//                     select: {
//                         id:           true,
//                         level:        true,
//                         displayName:  true,
//                         curriculumId: true,
//                     },
//                 },
//                 enrollments: {
//                     select: {
//                         student: {
//                             select: {
//                                 id:   true,
//                                 name: true,
//                                 // Students' individual allocated subjects are always school-specific
//                                 studentSubjects: {
//                                     where: { schoolId }, 
//                                     select: {
//                                         id:             true,
//                                         gradeSubjectId: true,
//                                         isCompulsory:   true,
//                                         status:         true,
//                                         gradeSubject: {
//                                             select: {
//                                                 subject: { select: { name: true } },
//                                             },
//                                         },
//                                     },
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//         })

//         if (!cls) return null

//         const [nigerian, gradeSubjects] = await Promise.all([
//             isNigerianCurriculum(cls.grade.curriculumId),
            
//             // ✅ MODIFIED QUERY: Handles Global (Curriculum) vs Local (School) subjects
//             prisma.gradeSubject.findMany({
//                 where: {
//                     gradeId: cls.gradeId,
//                     // 1. Ensure the subject belongs to the school's specific curriculum
//                     grade: {
//                         curriculumId: cls.grade.curriculumId
//                     },
//                     // 2. Fetch standard (null) OR school-specific (schoolId) subjects
//                     OR: [
//                         { schoolId: schoolId },
//                         { schoolId: null },
//                     ],
//                 },
//                 orderBy: { subject: { name: 'asc' } },
//                 select: {
//                     id:      true,
//                     subject: { select: { name: true } },
//                 },
//             }),
//         ])

//         const gradeInfo = getNigerianGradeInfo(cls.grade.level)

//         // ✅ Build available subjects list
//         const availableSubjects = gradeSubjects.map(gs => {
//             if (!nigerian) {
//                 return {
//                     id:           gs.id,
//                     subjectName:  gs.subject.name,
//                     isCompulsory: false,
//                     stream:       null,
//                 }
//             }

//             const { isCompulsory, stream } = classifyNigerianSubject(
//                 gs.subject.name,
//                 gradeInfo.isJSS,
//             )

//             return {
//                 id:          gs.id,
//                 subjectName: gs.subject.name,
//                 isCompulsory,
//                 stream,
//             }
//         })

//         // ✅ Build students mapping
//         const students = cls.enrollments.map(e => ({
//             id:     e.student.id,
//             name:   e.student.name,
//             stream: nigerian
//                 ? inferStreamFromSubjects(
//                     e.student.studentSubjects.map(ss => ss.gradeSubject.subject.name)
//                   )
//                 : null,
//             subjects: e.student.studentSubjects.map(ss => ({
//                 id:             ss.id,
//                 gradeSubjectId: ss.gradeSubjectId,
//                 subjectName:    ss.gradeSubject.subject.name,
//                 isCompulsory:   ss.isCompulsory,
//                 status:         ss.status,
//             })),
//         }))

//         return {
//             isNigerianCurriculum: nigerian,
//             grade: {
//                 id:          cls.grade.id,
//                 displayName: cls.grade.displayName,
//                 level:       cls.grade.level,
//                 isJSS:       gradeInfo.isJSS,
//                 isSSS:       gradeInfo.isSSS,
//             },
//             students,
//             availableSubjects,
//         }
//     } catch (err) {
//         console.error('getClassSubjectAllocation error:', getErrorMessage(err))
//         return null
//     }
// }

// // ── Allocate subjects to a single student ─────────────────────────────────────
// // ✅ Now defined — was missing from original file

// export async function allocateSubjectsToStudent(
//     input: AllocateSubjectsInput
// ): Promise<{ success: boolean; error?: string; allocated?: number }> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         if (input.gradeSubjectIds.length === 0) {
//             return { success: false, error: 'No subjects provided.' }
//         }

//         // ✅ Use createMany with skipDuplicates — much faster than
//         // individual upserts in a loop for bulk allocation
//         const result = await prisma.studentSubject.createMany({
//             data: input.gradeSubjectIds.map(gradeSubjectId => ({
//                 studentId:      input.studentId,
//                 gradeSubjectId,
//                 schoolId:       input.schoolId,
//                 isCompulsory:   input.isCompulsory,
//                 status:         EnrollmentStatus.APPROVED,
//             })),
//             skipDuplicates: true, // safe — unique([studentId, gradeSubjectId])
//         })

//         revalidatePath('/admin/subjects')

//         return { success: true, allocated: result.count }
//     } catch (err) {
//         console.error('allocateSubjectsToStudent error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Auto-allocate compulsory subjects to all students in a class ──────────────

// export async function autoAllocateCompulsorySubjects(
//     classId:  string,
//     schoolId: string,
// ): Promise<{ success: boolean; error?: string; allocated?: number }> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         const allocationData = await getClassSubjectAllocation(classId, schoolId)
//         if (!allocationData) return { success: false, error: 'Class not found.' }

//         const compulsorySubjects = allocationData.availableSubjects.filter(
//             s => s.isCompulsory
//         )

//         if (compulsorySubjects.length === 0) {
//             return { success: false, error: 'No compulsory subjects found for this grade.' }
//         }

//         const gradeSubjectIds = compulsorySubjects.map(s => s.id)

//         // ✅ Single createMany for all students × subjects
//         // instead of a loop of upserts per student
//         const allPairs = allocationData.students.flatMap(student =>
//             gradeSubjectIds.map(gradeSubjectId => ({
//                 studentId:      student.id,
//                 gradeSubjectId,
//                 schoolId,
//                 isCompulsory:   true,
//                 status:        EnrollmentStatus.APPROVED,
//             }))
//         )

//         const result = await prisma.studentSubject.createMany({
//             data:           allPairs,
//             skipDuplicates: true,
//         })

//         revalidatePath('/admin/subjects')

//         return { success: true, allocated: result.count }
//     } catch (err) {
//         console.error('autoAllocateCompulsorySubjects error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Allocate stream subjects to a student (SSS only) ──────────────────────────

// export async function allocateStreamSubjects(
//     studentId: string,
//     stream:    NigerianStream,
//     classId:   string,
//     schoolId:  string,
// ): Promise<{ success: boolean; error?: string; allocated?: number }> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         const allocationData = await getClassSubjectAllocation(classId, schoolId)
//         if (!allocationData) return { success: false, error: 'Class not found.' }

//         if (!allocationData.isNigerianCurriculum) {
//             return { success: false, error: 'Stream allocation only applies to Nigerian curriculum.' }
//         }

//         if (allocationData.grade.isJSS) {
//             return { success: false, error: 'Stream allocation does not apply to JSS grades.' }
//         }

//         // Core subjects + subjects matching the chosen stream
//         const streamSubjectIds = allocationData.availableSubjects
//             .filter(s => s.isCompulsory || s.stream === stream)
//             .map(s => s.id)

//         if (streamSubjectIds.length === 0) {
//             return { success: false, error: `No subjects found for ${stream} stream.` }
//         }

//         return await allocateSubjectsToStudent({
//             studentId,
//             gradeSubjectIds: streamSubjectIds,
//             schoolId,
//             isCompulsory:    false,
//         })
//     } catch (err) {
//         console.error('allocateStreamSubjects error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Remove subject from student ────────────────────────────────────────────────

// export async function removeStudentSubject(
//     studentId:      string,
//     gradeSubjectId: string,
//     schoolId:       string,
// ): Promise<{ success: boolean; error?: string }> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         await prisma.studentSubject.delete({
//             where: {
//                 studentId_gradeSubjectId: {
//                     studentId,
//                     gradeSubjectId,
//                 },
//             },
//         })

//         revalidatePath('/admin/subjects')

//         return { success: true }
//     } catch (err) {
//         console.error('removeStudentSubject error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Get classes for school ─────────────────────────────────────────────────────

// export async function getSchoolClassesWithGrades(schoolId: string) {
//     try {
//         return await prisma.class.findMany({
//             where:   { schoolId },
//             orderBy: [
//                 { grade: { level: 'asc' } },
//                 { name:  'asc'            },
//             ],
//             select: {
//                 id:   true,
//                 name: true,
//                 grade: {
//                     select: {
//                         id:          true,
//                         displayName: true,
//                         level:       true,
//                     },
//                 },
//                 teacher: {
//                     select: { name: true },
//                 },
//                 _count: {
//                     select: { enrollments: true },
//                 },
//             },
//         })
//     } catch (err) {
//         console.error('getSchoolClassesWithGrades error:', getErrorMessage(err))
//         return []
//     }
// }