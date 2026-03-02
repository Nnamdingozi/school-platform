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

"use server"

import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client";
// ✅ Import your error handler
import { getErrorMessage } from "@/lib/error-handler";

// ✅ Define an interface for the input data to avoid 'any'
interface CreateUserInput {
  email: string;
  name: string;
  role: Role;
}

export async function createUsers(
  users: CreateUserInput[], // ✅ FIX: Replaced any[] with CreateUserInput[]
  schoolId: string, 
  curriculumId: string
) {
  try {
    const results = await prisma.$transaction(
      users.map((user) =>
        prisma.profile.create({
          data: {
            email: user.email,
            name: user.name,
            role: user.role,
            schoolId: schoolId,
            curriculumId: curriculumId,
          },
        })
      )
    )
    return { success: true, count: results.length }
  } catch (error: unknown) { // ✅ FIX: Changed any to unknown
    return { success: false, error: getErrorMessage(error) }
  }
}