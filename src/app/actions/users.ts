"use server"

import { prisma } from "@/lib/prisma" // Adjust based on your prisma client location
import {Role} from "@/generated/prisma/enums"

export async function createUsers(users: any[], schoolId: string, curriculumId: string) {
  try {
    const results = await prisma.$transaction(
      users.map((user) =>
        prisma.profile.create({
          data: {
            email: user.email,
            name: user.name,
            role: user.role as Role,
            schoolId: schoolId,
            curriculumId: curriculumId,
          },
        })
      )
    )
    return { success: true, count: results.length }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}