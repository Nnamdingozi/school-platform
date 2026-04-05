

// // src/app/actions/teacherData.ts
// 'use server';

// import { prisma } from "@/lib/prisma";
// import { comprehensiveProfileInclude, ProfileInStore } from "@/types/profile";

// export const getTeacherData = async (email: string): Promise<ProfileInStore | null> => {
//   try {
//     const teacher = await prisma.profile.findUnique({
//       where: {
//         email: email,
//       },
//       include: comprehensiveProfileInclude,
//     });
//     return teacher;
//   } catch (error) {
//     console.error("Error fetching teacher data:", error);
//     return null;
//   }
// };


'use server'

import { prisma } from '@/lib/prisma'
import { comprehensiveProfileInclude, ProfileInStore } from '@/types/profile'
import { getErrorMessage } from '@/lib/error-handler'

export const getTeacherData = async (
    email: string
): Promise<ProfileInStore | null> => {
    try {
        const teacher = await prisma.profile.findUnique({
            where: { email },
            include: comprehensiveProfileInclude,
        })

        if (!teacher) return null

        return teacher as unknown as ProfileInStore

    } catch (error: unknown) {
        console.error('Error fetching teacher data:', getErrorMessage(error))
        return null}
    } 