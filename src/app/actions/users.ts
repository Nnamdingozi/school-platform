// "use server"

// import { prisma } from "@/lib/prisma" // Adjust based on your prisma client location

// import { Role } from "@prisma/client";

// export async function createUsers(users: any[], schoolId: string, curriculumId: string) {
//   try {
//     const results = await prisma.$transaction(
//       users.map((user) =>
//         prisma.profile.create({
//           data: {
//             email: user.email,
//             name: user.name,
//             role: user.role as Role,
//             schoolId: schoolId,
//             curriculumId: curriculumId,
//           },
//         })
//       )
//     )
//     return { success: true, count: results.length }
//   } catch (error: any) {
//     return { success: false, error: error.message }
//   }
// }

// "use server"

// import { prisma } from "@/lib/prisma"
// import { Role } from "@prisma/client";
// // ✅ Import your error handler
// import { getErrorMessage } from "@/lib/error-handler";

// // ✅ Define an interface for the input data to avoid 'any'
// interface CreateUserInput {
//   email: string;
//   name: string;
//   role: Role;
// }

// export async function createUsers(
//   users: CreateUserInput[], // ✅ FIX: Replaced any[] with CreateUserInput[]
//   schoolId: string, 
//   curriculumId: string
// ) {
//   try {
//     const results = await prisma.$transaction(
//       users.map((user) =>
//         prisma.profile.create({
//           data: {
//             email: user.email,
//             name: user.name,
//             role: user.role,
//             schoolId: schoolId,
//             curriculumId: curriculumId,
//           },
//         })
//       )
//     )
//     return { success: true, count: results.length }
//   } catch (error: unknown) { // ✅ FIX: Changed any to unknown
//     return { success: false, error: getErrorMessage(error) }
//   }
// }


"use server"

import { prisma } from "@/lib/prisma"
import { Role, ActivityType } from "@prisma/client";
import { getErrorMessage } from "@/lib/error-handler";
import { logActivity } from "@/lib/activitylogger";

// ── Types ──────────────────────────────────────────────────────────────────────

interface CreateUserInput {
  email: string;
  name: string;
  role: Role;
  phone: string;
}

interface BulkCreateResponse {
    success: boolean;
    count?: number;
    error?: string;
}

// ── Action ─────────────────────────────────────────────────────────────────────

/**
 * BULK CREATE PROFILES
 * Rule 5: Strictly isolated to the school context.
 * Rule 10: Ensures the actor has permission to create users in this school.
 */
export async function createUsers(params: {
  users: CreateUserInput[];
  schoolId: string;
  curriculumId: string;
  actorId: string;
  phone: string
  actorRole: Role;
}): Promise<BulkCreateResponse> {
  const { users, schoolId, curriculumId, actorId, actorRole } = params;

  try {
    // 1. Security Check (Rule 10)
    // Only Admins can bulk create users, and they must belong to the school.
    if (actorRole !== Role.SCHOOL_ADMIN && actorRole !== Role.SUPER_ADMIN) {
        throw new Error("Unauthorized: Insufficient permissions for bulk import.");
    }

    const actorProfile = await prisma.profile.findUnique({
        where: { id: actorId },
        select: { schoolId: true }
    });

    if (actorRole !== Role.SUPER_ADMIN && actorProfile?.schoolId !== schoolId) {
        throw new Error("Security Alert: You cannot create users for another institution.");
    }

    // 2. Execution (Tier 2 Institutional Change)
    const results = await prisma.$transaction(async (tx) => {
        const createdProfiles = await Promise.all(
            users.map((user) =>
              tx.profile.create({
                data: {
                  email: user.email.toLowerCase().trim(),
                  name: user.name.trim(),
                  role: user.role,
                  schoolId: schoolId,
                  curriculumId: curriculumId,
                  phone: user.phone
                },
              })
            )
        );

        // 3. Rule 11: Log the activity
        await logActivity({
            schoolId: schoolId,
            actorId: actorId,
            actorRole: actorRole,
            type: ActivityType.USER_INVITED, // Reusing invited type for creation
            title: 'Bulk Users Created',
            description: `Successfully created ${createdProfiles.length} user profiles via management console.`
        });

        return createdProfiles;
    });

    return { success: true, count: results.length };

  } catch (error: unknown) {
    console.error("createUsers error:", getErrorMessage(error));
    return { success: false, error: getErrorMessage(error) };
  }
}