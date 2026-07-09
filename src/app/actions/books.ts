// @/app/actions/books.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addSchoolBook(data: {
    title: string;
    gradeSubjectId: string;
    schoolId?: string;
    profileId: string;
}) {
    try {
        const book = await prisma.book.create({
            data: {
                title: data.title,
                gradeSubjectId: data.gradeSubjectId,
                schoolId: data.schoolId || null, // Optional for individual learners
                profileId: data.profileId,
            }
        });
        revalidatePath('/dashboard/settings'); // Or wherever your library UI lives
        return { success: true, data: book };
    } catch (err) {
        return { success: false, error: "Failed to add book to library." };
    }
}

export async function getBooksForGradeSubject(gradeSubjectId: string, schoolId?: string, profileId?: string) {
    return await prisma.book.findMany({
        where: {
            gradeSubjectId,
            OR: [
                { schoolId: schoolId },
                { profileId: profileId }
            ]
        }
    });
}