// 'use server';

// import { prisma } from '@/lib/prisma';
// import { Role } from '@prisma/client';
// import { getErrorMessage } from '@/lib/error-handler';
// import { revalidatePath } from 'next/cache';

// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// export type ParentChildLinkInput = {
//   parentEmail: string;
//   childEmail: string;
// }
// export type ParentChildLinkResult = {
//   parentEmail: string;
//   childEmail: string;
//   success: boolean;
//   message?: string;
// };

// /**
//  * Links a specific parent to a specific student.
//  * Supports multiple children per parent.
//  */
// async function linkSinglePair(
//   parentEmail: string,
//   childEmail: string,
//   schoolId: string,
// ): Promise<ParentChildLinkResult> {
//   const trimmedParent = parentEmail.trim().toLowerCase();
//   const trimmedChild = childEmail.trim().toLowerCase();

//   // 1. Basic Validation
//   if (!trimmedParent || !trimmedChild) {
//     return { parentEmail, childEmail, success: false, message: 'Both emails are required.' };
//   }
//   if (!EMAIL_REGEX.test(trimmedParent) || !EMAIL_REGEX.test(trimmedChild)) {
//     return { parentEmail, childEmail, success: false, message: 'Invalid email format.' };
//   }

//   try {
//     // 2. Fetch both profiles (Scoped by schoolId for security)
//     const [parent, student] = await Promise.all([
//       prisma.profile.findFirst({ where: { email: trimmedParent, schoolId } }),
//       prisma.profile.findFirst({ where: { email: trimmedChild, schoolId } }),
//     ]);

//     // 3. Robust Role Checks
//     if (!parent) return { parentEmail, childEmail, success: false, message: 'Parent account not found in this school.' };
//     if (parent.role !== Role.PARENT) return { parentEmail, childEmail, success: false, message: 'User exists but does not have the PARENT role.' };
    
//     if (!student) return { parentEmail, childEmail, success: false, message: 'Student account not found in this school.' };
//     if (student.role !== Role.STUDENT) return { parentEmail, childEmail, success: false, message: 'User exists but does not have the STUDENT role.' };

//     if (parent.id === student.id) return { parentEmail, childEmail, success: false, message: 'Cannot link a profile to itself.' };

//     // 4. Create Link (Upsert)
//     // This creates a NEW row in the junction table. 
//     // If Parent A already has Student 1, this confirms the link.
//     // If Parent A is now being linked to Student 2, it creates a second row.
//     await prisma.parentStudent.upsert({
//       where: {
//         parentId_studentId: {
//           parentId: parent.id,
//           studentId: student.id,
//         },
//       },
//       create: {
//         parentId: parent.id,
//         studentId: student.id,
//         schoolId,
//       },
//       update: {}, // No changes needed if link already exists
//     });

//     return {
//       parentEmail,
//       childEmail,
//       success: true,
//       message: `Successfully linked ${student.name ?? 'student'} to ${parent.name ?? 'parent'}.`,
//     };
//   } catch (error) {
//     return {
//       parentEmail,
//       childEmail,
//       success: false,
//       message: getErrorMessage(error),
//     };
//   }
// }

// export async function bulkLinkParentsAndChildren(
//   input: ParentChildLinkInput[],
//   schoolId: string,
// ): Promise<ParentChildLinkResult[]> {
//   if (!schoolId) {
//     return input.map((row) => ({ ...row, success: false, message: 'Missing school context.' }));
//   }

//   const results: ParentChildLinkResult[] = [];

//   // Sequential processing to provide row-by-row feedback to the CSV Importer UI
//   for (const row of input) {
//     const result = await linkSinglePair(row.parentEmail, row.childEmail, schoolId);
//     results.push(result);
//   }

//   // Clear caches so the Parent Dashboard and Admin Lists reflect the new children immediately
//   revalidatePath('/admin/users');
//   revalidatePath('/parent/dashboard');

//   return results;
// }


// /**
//  * Search users by name or email with role filtering
//  */
// export async function searchUsersByRole(schoolId: string, query: string, role: Role) {
//   if (!query || query.length < 2) return [];

//   try {
//     return await prisma.profile.findMany({
//       where: {
//         schoolId,
//         role,
//         OR: [
//           { name: { contains: query, mode: 'insensitive' } },
//           { email: { contains: query, mode: 'insensitive' } }
//         ]
//       },
//       select: { id: true, name: true, email: true },
//       take: 8,
//     });
//   } catch (err) {
//     return [];
//   }
// }


// /**
//  * Fetches all parents and their linked children for the directory
//  */
// export async function getLinkedFamilies(schoolId: string) {
//   try {
//     const families = await prisma.profile.findMany({
//       where: {
//         schoolId,
//         role: Role.PARENT,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         ParentStudent_ParentStudent_parentIdToprofiles: {
//           select: {
//             id: true, // The ID of the link itself
//             student: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//               }
//             }
//           }
//         }
//       },
//       orderBy: { name: 'asc' }
//     });

//     return families;
//   } catch (err) {
//     console.error("Error fetching families:", err);
//     return [];
//   }
// }

// /**
//  * Action to remove a specific link
//  */
// export async function unlinkParentStudent(linkId: string) {
//     try {
//         await prisma.parentStudent.delete({
//             where: { id: linkId }
//         });
//         revalidatePath('/admin/users');
//         return { success: true };
//     } catch (err) {
//         return { success: false };
//     }
// }


// /**
//  * Paginated and Searchable Family Directory
//  */
// export async function getLinkedFamiliesPaginated(
//   schoolId: string, 
//   page: number = 1, 
//   search: string = ""
// ) {
//   const limit = 20; // Items per page
//   const skip = (page - 1) * limit;

//   try {
//     const where = {
//       schoolId,
//       role: Role.PARENT,
//       OR: [
//         { name: { contains: search, mode: 'insensitive' as const } },
//         { email: { contains: search, mode: 'insensitive' as const } }
//       ]
//     };

//     const [families, total] = await Promise.all([
//       prisma.profile.findMany({
//         where,
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           ParentStudent_ParentStudent_parentIdToprofiles: {
//             select: {
//               id: true,
//               student: { select: { name: true, email: true } }
//             }
//           }
//         },
//         orderBy: { name: 'asc' },
//         skip,
//         take: limit,
//       }),
//       prisma.profile.count({ where })
//     ]);

//     return {
//       families,
//       totalPages: Math.ceil(total / limit),
//       totalCount: total
//     };
//   } catch (err) {
//     return { families: [], totalPages: 0, totalCount: 0 };
//   }
// }



'use server';

import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { getErrorMessage } from '@/lib/error-handler';
import { revalidatePath } from 'next/cache';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ParentChildLinkInput = {
  parentEmail: string;
  childEmail: string;
};

export type ParentChildLinkResult = {
  parentEmail: string;
  childEmail: string;
  success: boolean;
  message?: string;
};

/**
 * Links a specific parent to a specific student.
 * Supports multiple children per parent.
 */
async function linkSinglePair(
  parentEmail: string,
  childEmail: string,
  schoolId: string,
): Promise<ParentChildLinkResult> {
  const trimmedParent = parentEmail.trim().toLowerCase();
  const trimmedChild = childEmail.trim().toLowerCase();

  // 1. Basic Validation
  if (!trimmedParent || !trimmedChild) {
    return { parentEmail, childEmail, success: false, message: 'Both emails are required.' };
  }
  if (!EMAIL_REGEX.test(trimmedParent) || !EMAIL_REGEX.test(trimmedChild)) {
    return { parentEmail, childEmail, success: false, message: 'Invalid email format.' };
  }

  try {
    // 2. Fetch both profiles (Scoped by schoolId for security)
    const [parent, student] = await Promise.all([
      prisma.profile.findFirst({ where: { email: trimmedParent, schoolId } }),
      prisma.profile.findFirst({ where: { email: trimmedChild, schoolId } }),
    ]);

    // 3. Robust Role Checks
    if (!parent) return { parentEmail, childEmail, success: false, message: 'Parent account not found in this school.' };
    if (parent.role !== Role.PARENT) return { parentEmail, childEmail, success: false, message: 'User exists but does not have the PARENT role.' };
    
    if (!student) return { parentEmail, childEmail, success: false, message: 'Student account not found in this school.' };
    if (student.role !== Role.STUDENT) return { parentEmail, childEmail, success: false, message: 'User exists but does not have the STUDENT role.' };

    if (parent.id === student.id) return { parentEmail, childEmail, success: false, message: 'Cannot link a profile to itself.' };

    // 4. Create Link (Upsert)
    await prisma.parentStudent.upsert({
      where: {
        parentId_studentId: {
          parentId: parent.id,
          studentId: student.id,
        },
      },
      create: {
        parentId: parent.id,
        studentId: student.id,
        schoolId,
      },
      update: {}, 
    });

    return {
      parentEmail,
      childEmail,
      success: true,
      message: `Successfully linked ${student.name ?? 'student'} to ${parent.name ?? 'parent'}.`,
    };
  } catch (error: unknown) {
    return {
      parentEmail,
      childEmail,
      success: false,
      message: getErrorMessage(error),
    };
  }
}

/**
 * Bulk action for linking
 */
export async function bulkLinkParentsAndChildren(
  input: ParentChildLinkInput[],
  schoolId: string,
): Promise<ParentChildLinkResult[]> {
  if (!schoolId) {
    return input.map((row) => ({ ...row, success: false, message: 'Missing school context.' }));
  }

  const results: ParentChildLinkResult[] = [];

  for (const row of input) {
    const result = await linkSinglePair(row.parentEmail, row.childEmail, schoolId);
    results.push(result);
  }

  revalidatePath('/admin/users');
  revalidatePath('/parent/dashboard');

  return results;
}

/**
 * Search users by name or email with role filtering
 */
export async function searchUsersByRole(schoolId: string, query: string, role: Role) {
  if (!query || query.length < 2) return [];

  try {
    return await prisma.profile.findMany({
      where: {
        schoolId,
        role,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: { id: true, name: true, email: true },
      take: 8,
    });
  } catch (err: unknown) {
    console.error("searchUsersByRole error:", getErrorMessage(err));
    return [];
  }
}

/**
 * Fetches all parents and their linked children for the directory
 */
export async function getLinkedFamilies(schoolId: string) {
  try {
    const families = await prisma.profile.findMany({
      where: {
        schoolId,
        role: Role.PARENT,
      },
      select: {
        id: true,
        name: true,
        email: true,
        ParentStudent_ParentStudent_parentIdToprofiles: {
          select: {
            id: true,
            student: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return families;
  } catch (err: unknown) {
    console.error("getLinkedFamilies error:", getErrorMessage(err));
    return [];
  }
}

/**
 * Action to remove a specific link
 */
export async function unlinkParentStudent(linkId: string) {
    try {
        await prisma.parentStudent.delete({
            where: { id: linkId }
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (err: unknown) {
        console.error("unlinkParentStudent error:", getErrorMessage(err));
        return { success: false, error: getErrorMessage(err) };
    }
}

/**
 * Paginated and Searchable Family Directory
 */
export async function getLinkedFamiliesPaginated(
  schoolId: string, 
  page: number = 1, 
  search: string = ""
) {
  const limit = 20; 
  const skip = (page - 1) * limit;

  try {
    const where = {
      schoolId,
      role: Role.PARENT,
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } }
      ]
    };

    const [families, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          ParentStudent_ParentStudent_parentIdToprofiles: {
            select: {
              id: true,
              student: { select: { name: true, email: true } }
            }
          }
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.profile.count({ where })
    ]);

    return {
      families,
      totalPages: Math.ceil(total / limit),
      totalCount: total
    };
  } catch (err: unknown) {
    console.error("getLinkedFamiliesPaginated error:", getErrorMessage(err));
    return { families: [], totalPages: 0, totalCount: 0 };
  }
}