// app/actions/individual-setup.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/error-handler";

export async function getGradesForCurriculum(curriculumId: string) {
    try {
        const grades = await prisma.grade.findMany({
            where: { curriculumId },
            select: { id: true, level: true, displayName: true },
            orderBy: { level: 'asc' }
        });
        return { success: true, data: grades };
    } catch (err) {
        return { success: false, data: [], error: getErrorMessage(err) };
    }
}

export async function getSubjectsForGrade(gradeId: string) {
    try {
        const gradeSubjects = await prisma.gradeSubject.findMany({
            where: { 
                gradeId,
                schoolId: null  // global subjects only
            },
            include: { subject: true },
            orderBy: { subject: { name: 'asc' } }
        });
        return { success: true, data: gradeSubjects };
    } catch (err) {
        return { success: false, data: [], error: getErrorMessage(err) };
    }
}

export async function saveIndividualSetup(
    profileId: string,
    gradeSubjectIds: string[]
): Promise<{ success: boolean; error?: string }> {
    try {
        // Upsert StudentSubject records — idempotent if they resubmit
        await prisma.$transaction(async (tx) => {
            // Clear existing selections first
            await tx.studentSubject.deleteMany({
                where: { studentId: profileId }
            });

            // Insert new selections
            await tx.studentSubject.createMany({
                data: gradeSubjectIds.map(gradeSubjectId => ({
                    studentId: profileId,
                    gradeSubjectId,
                    schoolId: null,
                }))
            });
        });

        revalidatePath('/student-dashboard');
        return { success: true };
    } catch (err) {
        console.error("[INDIVIDUAL_SETUP_FAULT]:", getErrorMessage(err));
        return { success: false, error: getErrorMessage(err) };
    }
}