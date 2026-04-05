// src/app/actions/subject-allocation.ts
'use server'

import { prisma } from '@/lib/prisma' // ✅ Import your prisma client
import { EnrollmentStatus } from '@prisma/client' // ✅ Import enums
import { getErrorMessage } from '@/lib/error-handler' // ✅ Import error helper

/**
 * JS1-JS3: Bulk assign subjects to an entire class
 * Professional approach: Ensures all students study the same required subjects.
 */
export async function bulkAllocateJuniorSubjects(
    schoolId: string, 
    classId: string, 
    gradeSubjectIds: string[]
) {
    try {
        // 1. Get all students currently placed in this class
        const students = await prisma.classEnrollment.findMany({ 
            where: { classId } 
        });

        if (students.length === 0) {
            return { success: false, error: "No students found in this class to allocate subjects to." };
        }

        // 2. Use a transaction to create subjects for EVERY student
        return await prisma.$transaction(async (tx) => {
            for (const student of students) {
                await tx.studentSubject.createMany({
                    data: gradeSubjectIds.map(gsId => ({
                        studentId: student.studentId,
                        gradeSubjectId: gsId,
                        schoolId: schoolId, // ✅ Added schoolId (required by schema)
                        status: EnrollmentStatus.APPROVED // ✅ Use enum value
                    })),
                    skipDuplicates: true // Prevents errors if some are already assigned
                });
            }
            return { success: true };
        });
    } catch (err) {
        console.error('bulkAllocateJuniorSubjects error:', getErrorMessage(err));
        return { success: false, error: getErrorMessage(err) };
    }
}

/**
 * SS1-SS3: Submit elective selection for teacher approval
 * Follows WAEC/NECO standards of 7-9 subjects.
 */
export async function submitSeniorSubjects(
    schoolId: string, // ✅ Added schoolId to params
    studentId: string, 
    gradeSubjectIds: string[]
) {
    try {
        // 1. Validate WAEC counts
        if (gradeSubjectIds.length < 7 || gradeSubjectIds.length > 9) {
            throw new Error("WAEC standard requires 7 to 9 subjects.");
        }

        // 2. Create as PENDING for teacher review
        await prisma.studentSubject.createMany({
            data: gradeSubjectIds.map(id => ({
                studentId,
                gradeSubjectId: id,
                schoolId: schoolId, // ✅ Added schoolId
                status: EnrollmentStatus.PENDING
            })),
            skipDuplicates: true
        });

        return { success: true };
    } catch (err) {
        console.error('submitSeniorSubjects error:', getErrorMessage(err));
        return { success: false, error: getErrorMessage(err) };
    }
}

/**
 * Update status (Used by Teachers to approve/reject SS1-3 electives)
 */
export async function updateAllocationStatus(
    studentId: string,
    gradeSubjectId: string,
    status: EnrollmentStatus
) {
    try {
        await prisma.studentSubject.update({
            where: {
                studentId_gradeSubjectId: { studentId, gradeSubjectId }
            },
            data: { status }
        });
        return { success: true };
    } catch (err) {
        return { success: false, error: getErrorMessage(err) };
    }
}

export async function allocateStudentSubjects(
    schoolId: string, 
    studentId: string, // ✅ Now used as a primary parameter
    gradeSubjectIds: string[]
) {
    try {
        return await prisma.$transaction(async (tx) => {
            // 1. Wipe existing allocations for this student to ensure a clean sync
            await tx.studentSubject.deleteMany({
                where: { studentId }
            });

            // 2. Create the new specific allocations
            if (gradeSubjectIds.length > 0) {
                await tx.studentSubject.createMany({
                    data: gradeSubjectIds.map(gsId => ({
                        studentId,
                        gradeSubjectId: gsId,
                        schoolId,
                        status: EnrollmentStatus.APPROVED
                    })),
                    skipDuplicates: true
                });
            }
            
            return { success: true };
        });
    } catch (err) {
        console.error('allocateStudentSubjects error:', getErrorMessage(err));
        return { success: false, error: getErrorMessage(err) };
    }
}