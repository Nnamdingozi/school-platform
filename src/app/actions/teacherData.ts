// src/app/(dashboard)/teacher/actions.ts
// src/app/(dashboard)/teacher/actions.ts
// import { prisma } from "@/lib/prisma";
// import { Prisma } from "@/generated/prisma/client";

// const teacherInclude = {
//     selectedSubjects: {
//         include: {
//             grade: true,
//             subject: true,
//             enrollments: true,
//             topics: {
//                 include: {
//                     term: true,
//                     lessons: true
//                 },
//                 orderBy: [
//                     { term: { index: 'asc' } },
//                     { weekNumber: 'asc' },
//                 ],
//             },
//         },
//     },
//     // Removed 'school' here
// } satisfies Prisma.ProfileInclude;

// export async function getTeacherData() {
//     const teacherEmail = "teacher@lagosacademy.test";

//     try {
//         const teacher = await prisma.profile.findUnique({
//             where: { email: teacherEmail },
//             include: teacherInclude, // This no longer includes school data
//         });

//         return teacher;
//     } catch (error) {
//         console.error("Error fetching teacher data:", error);
//         return null;
//     }
// }

// src/app/actions/teacherData.ts
'use server';

import { prisma } from "@/lib/prisma";
import { comprehensiveProfileInclude, ProfileInStore } from "@/types/profile";

export const getTeacherData = async (email: string): Promise<ProfileInStore | null> => {
  try {
    const teacher = await prisma.profile.findUnique({
      where: {
        email: email,
      },
      include: comprehensiveProfileInclude,
    });
    return teacher;
  } catch (error) {
    console.error("Error fetching teacher data:", error);
    return null;
  }
};