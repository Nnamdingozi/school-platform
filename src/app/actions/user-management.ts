'use server'

import { prisma } from '@/lib/prisma'
import { supabase as supabaseAdmin } from '@/lib/supabase/supabaseClient'
import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/error-handler'
import { toTitleCase } from '@/lib/utils/formatters'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface UserListItem {
    id:    string
    name:  string | null
    email: string
    phone: string | null
    role:  string
    assignedClasses: {
        id:    string
        name:  string
        grade: { displayName: string }
    }[]
}

export interface UserDetail {
    id:       string
    name:     string | null
    email:    string
    phone:    string | null
    role:     string
    schoolId: string | null
    assignedClasses: {
        id:      string
        name:    string
        grade:   { displayName: string }
        subject: string | null  // subject name string, not object
    }[]
    assessments: {
        id:          string
        type:        string
        score:       number | null
        maxScore:    number | null
        comments:    string | null
        subject:     string | null
        createdAt:   Date
    }[]
    notifications: {
        id:        string
        message:   string
        read:      boolean
        createdAt: Date
    }[]
}

interface ActionResult {
    success: boolean
    error?:  string
}

// ── Auth helper ────────────────────────────────────────────────────────────────
async function getAuthUser() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) return null
        return data.user
    } catch (err) {
        console.error('getAuthUser failed:', err)
        return null
    }
}

// ── Get Teachers ───────────────────────────────────────────────────────────────
export async function getTeachersBySchool(
    schoolId: string
): Promise<UserListItem[]> {
    try {
        const teachers = await prisma.profile.findMany({
            where:   { schoolId, role: 'TEACHER' },
            orderBy: { createdAt: 'desc' },
            select: {
                id:    true,
                name:  true,
                email: true,
                phone: true,
                role:  true,
                // Teachers are linked to classes via Class.teacherId
                taughtClasses: {
                    select: {
                        id:    true,
                        name:  true,
                        grade: { select: { displayName: true } },
                    },
                },
            },
        })

        return teachers.map(t => ({
            id:              t.id,
            name:            t.name,
            email:           t.email,
            phone:           t.phone,
            role:            t.role,
            assignedClasses: t.taughtClasses,
        }))
    } catch (err) {
        console.error('getTeachersBySchool error:', err)
        return []
    }
}

// ── Get Students ───────────────────────────────────────────────────────────────
export async function getStudentsBySchool(
    schoolId: string
): Promise<UserListItem[]> {
    try {
        const students = await prisma.profile.findMany({
            where:   { schoolId, role: 'STUDENT' },
            orderBy: { createdAt: 'desc' },
            select: {
                id:    true,
                name:  true,
                email: true,
                phone: true,
                role:  true,
                // Students are linked to classes via ClassEnrollment.studentId
                classEnrollments: {
                    select: {
                        class: {
                            select: {
                                id:    true,
                                name:  true,
                                grade: { select: { displayName: true } },
                            },
                        },
                    },
                },
            },
        })

        return students.map(s => ({
            id:    s.id,
            name:  s.name,
            email: s.email,
            phone: s.phone,
            role:  s.role,
            assignedClasses: s.classEnrollments
                .filter(e => e.class !== null)
                .map(e => e.class!),
        }))
    } catch (err) {
        console.error('getStudentsBySchool error:', err)
        return []
    }
}

// ── Get Parents ────────────────────────────────────────────────────────────────
// ── Get Parents ────────────────────────────────────────────────────────────────
export async function getParentsBySchool(
    schoolId: string
): Promise<UserListItem[]> {
    try {
        const parents = await prisma.profile.findMany({
            where:   { schoolId, role: 'PARENT' },
            orderBy: { createdAt: 'desc' },
            select: {
                id:    true,
                name:  true,
                email: true,
                phone: true,
                role:  true,
                // This is the relation name from the Profile model
                ParentStudent_ParentStudent_parentIdToprofiles: {
                    select: {
                        // ✅ FIX: Use 'student' (the field name in ParentStudent model)
                        student: { 
                            select: {
                                classEnrollments: {
                                    select: {
                                        class: {
                                            select: {
                                                id:    true,
                                                name:  true,
                                                grade: { select: { displayName: true } },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        return parents.map(p => {
            // Flatten all classes from all linked students
            const classes = p.ParentStudent_ParentStudent_parentIdToprofiles
                .flatMap(ps =>
                    // ✅ FIX: Use .student here as well
                    ps.student
                        .classEnrollments
                        .filter(e => e.class !== null)
                        .map(e => e.class!)
                )
            
            // Deduplicate by class id
            const unique = Array.from(
                new Map(classes.map(c => [c.id, c])).values()
            )
            return {
                id:              p.id,
                name:            p.name,
                email:           p.email,
                phone:           p.phone,
                role:            p.role,
                assignedClasses: unique,
            }
        })
    } catch (err) {
        console.error('getParentsBySchool error:', err)
        return []
    }
}
// ── Get User By ID ─────────────────────────────────────────────────────────────
export async function getUserById(id: string): Promise<UserDetail | null> {
    try {
        const user = await prisma.profile.findUnique({
            where:  { id },
            select: {
                id:       true,
                name:     true,
                email:    true,
                phone:    true,
                role:     true,
                schoolId: true,
                // Classes taught (teacher)
                taughtClasses: {
                    select: {
                        id:    true,
                        name:  true,
                        grade: { select: { displayName: true } },
                        // Subject via gradeSubjects taught by this teacher
                        enrollments: {
                            take: 1,
                            select: {
                                gradeSubject: {
                                    select: {
                                        subject: { select: { name: true } },
                                    },
                                },
                            },
                        },
                    },
                },
                // Class enrollments (student/parent)
                classEnrollments: {
                    select: {
                        gradeSubject: {
                            select: {
                                subject: { select: { name: true } },
                            },
                        },
                        class: {
                            select: {
                                id:    true,
                                name:  true,
                                grade: { select: { displayName: true } },
                            },
                        },
                    },
                },
                // Assessments (student)
                assessments: {
                    orderBy: { createdAt: 'desc' },
                    take:    20,
                    select: {
                        id:        true,
                        type:      true,
                        score:     true,
                        maxScore:  true,
                        comments:  true,
                        createdAt: true,
                        gradeSubject: {
                            select: {
                                subject: { select: { name: true } },
                            },
                        },
                    },
                },
                // Notifications
                notifications: {
                    orderBy: { createdAt: 'desc' },
                    take:    20,
                    select: {
                        id:        true,
                        message:   true,
                        read:      true,
                        createdAt: true,
                    },
                },
            },
        })

        if (!user) return null

        // Merge taughtClasses into assignedClasses (teacher)
        const taughtClasses = user.taughtClasses.map(c => ({
            id:      c.id,
            name:    c.name,
            grade:   c.grade,
            subject: c.enrollments[0]?.gradeSubject?.subject?.name ?? null,
        }))

        // Merge classEnrollments into assignedClasses (student/parent)
        const enrolledClasses = user.classEnrollments
            .filter(e => e.class !== null)
            .map(e => ({
                id:      e.class!.id,
                name:    e.class!.name,
                grade:   e.class!.grade,
                subject: e.gradeSubject?.subject?.name ?? null,
            }))

        // Deduplicate
        const allClasses = [...taughtClasses, ...enrolledClasses]
        const assignedClasses = Array.from(
            new Map(allClasses.map(c => [c.id, c])).values()
        )

        const assessments = user.assessments.map(a => ({
            id:        a.id,
            type:      a.type,
            score:     a.score,
            maxScore:  a.maxScore,
            comments:  a.comments,
            subject:   a.gradeSubject?.subject?.name ?? null,
            createdAt: a.createdAt,
        }))

        return {
            id:              user.id,
            name:            user.name,
            email:           user.email,
            phone:           user.phone,
            role:            user.role,
            schoolId:        user.schoolId,
            assignedClasses,
            assessments,
            notifications:   user.notifications,
        }
    } catch (err) {
        console.error('getUserById error:', err)
        return null
    }
}

// ── Get Classes for School ─────────────────────────────────────────────────────
export async function getClassesBySchool(schoolId: string) {
    try {
        return await prisma.class.findMany({
            where:   { schoolId },
            orderBy: { name: 'asc' },
            select: {
                id:    true,
                name:  true,
                grade: { select: { displayName: true } },
            },
        })
    } catch (err) {
        console.error('getClassesBySchool error:', err)
        return []
    }
}

// ── Assign Teacher to Class ────────────────────────────────────────────────────
export async function assignTeacherToClass(
    teacherId: string,
    classId:   string
): Promise<ActionResult> {
    try {
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        await prisma.class.update({
            where: { id: classId },
            data:  { teacherId },
        })

        return { success: true }
    } catch (err) {
        console.error('assignTeacherToClass error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Assign Student/Parent to Class ────────────────────────────────────────────
export async function assignUserToClass(
    userId:        string,
    classId:       string,
    gradeSubjectId: string
): Promise<ActionResult> {
    try {
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        // Check if enrollment already exists
        const existing = await prisma.classEnrollment.findFirst({
            where: { studentId: userId, classId },
        })
        if (existing) {
            return { success: false, error: 'User is already enrolled in this class.' }
        }

        await prisma.classEnrollment.create({
            data: {
                studentId:     userId,
                classId,
                gradeSubjectId,
                schoolId:      (await prisma.class.findUnique({
                    where:  { id: classId },
                    select: { schoolId: true },
                }))?.schoolId ?? undefined,
            },
        })

        return { success: true }
    } catch (err) {
        console.error('assignUserToClass error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Remove User from Class ─────────────────────────────────────────────────────
export async function removeUserFromClass(
    userId:  string,
    classId: string
): Promise<ActionResult> {
    try {
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        await prisma.classEnrollment.deleteMany({
            where: { studentId: userId, classId },
        })

        return { success: true }
    } catch (err) {
        console.error('removeUserFromClass error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Deactivate User ────────────────────────────────────────────────────────────
export async function deactivateUser(userId: string): Promise<ActionResult> {
    try {
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { ban_duration: '87600h' }
        )
        if (banError) {
            console.error('deactivateUser error:', banError)
            return { success: false, error: banError.message }
        }

        return { success: true }
    } catch (err) {
        console.error('deactivateUser error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Reactivate User ────────────────────────────────────────────────────────────
export async function reactivateUser(userId: string): Promise<ActionResult> {
    try {
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        const { error } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { ban_duration: 'none' }
        )
        if (error) {
            console.error('reactivateUser error:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (err) {
        console.error('reactivateUser error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Delete User ────────────────────────────────────────────────────────────────
export async function deleteUser(userId: string): Promise<ActionResult> {
    try {
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        // Delete profile first — cascades to classEnrollments, notifications etc.
        await prisma.profile.delete({ where: { id: userId } })

        // Delete from Supabase auth
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
        if (deleteError) {
            console.error('deleteUser auth error (non-fatal):', deleteError)
        }

        return { success: true }
    } catch (err) {
        console.error('deleteUser error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Update User Profile ────────────────────────────────────────────────────────
export async function updateUserProfile(
    userId: string,
    data:   { name?: string; phone?: string }
): Promise<ActionResult> {
    try {
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        await prisma.profile.update({
            where: { id: userId },
            data: {
                name:  data.name  ? toTitleCase(data.name)  : undefined,
                phone: data.phone ? data.phone.trim()        : undefined,
            },
        })

        return { success: true }
    } catch (err) {
        console.error('updateUserProfile error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}