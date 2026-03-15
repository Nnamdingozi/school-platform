'use server';

import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { getErrorMessage } from '@/lib/error-handler'

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

async function linkSinglePair(
  parentEmail: string,
  childEmail: string,
  schoolId: string,
): Promise<ParentChildLinkResult> {
  const trimmedParent = parentEmail.trim().toLowerCase();
  const trimmedChild = childEmail.trim().toLowerCase();

  if (!trimmedParent || !trimmedChild) {
    return {
      parentEmail,
      childEmail,
      success: false,
      message: 'Parent and child email are both required.',
    };
  }

  if (!EMAIL_REGEX.test(trimmedParent) || !EMAIL_REGEX.test(trimmedChild)) {
    return {
      parentEmail,
      childEmail,
      success: false,
      message: 'Invalid email format for parent or child.',
    };
  }

  if (!schoolId) {
    return {
      parentEmail,
      childEmail,
      success: false,
      message: 'Missing school context for linking.',
    };
  }

  try {
    const [parent, student] = await Promise.all([
      prisma.profile.findFirst({
        where: {
          email: trimmedParent,
          schoolId,
        },
      }),
      prisma.profile.findFirst({
        where: {
          email: trimmedChild,
          schoolId,
        },
      }),
    ]);

    if (!parent) {
      return {
        parentEmail,
        childEmail,
        success: false,
        message: 'Parent profile not found in this school.',
      };
    }

    if (parent.role !== Role.PARENT) {
      return {
        parentEmail,
        childEmail,
        success: false,
        message: 'Parent profile exists but does not have PARENT role.',
      };
    }

    if (!student) {
      return {
        parentEmail,
        childEmail,
        success: false,
        message: 'Student profile not found in this school.',
      };
    }

    if (student.role !== Role.STUDENT) {
      return {
        parentEmail,
        childEmail,
        success: false,
        message: 'Child profile exists but does not have STUDENT role.',
      };
    }

    if (parent.id === student.id) {
      return {
        parentEmail,
        childEmail,
        success: false,
        message: 'Parent and child cannot be the same profile.',
      };
    }

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
      update: {
        schoolId,
      },
    });

    return {
      parentEmail,
      childEmail,
      success: true,
      message: 'Linked successfully.',
    };
  } catch (error) {
    return {
      parentEmail,
      childEmail,
      success: false,
      message: getErrorMessage(error),  // ← now error is used
    }
  }
}

export async function linkParentAndChildByEmail(
  parentEmail: string,
  childEmail: string,
  schoolId: string,
): Promise<ParentChildLinkResult> {
  return linkSinglePair(parentEmail, childEmail, schoolId);
}

export async function bulkLinkParentsAndChildren(
  input: ParentChildLinkInput[],
  schoolId: string,
): Promise<ParentChildLinkResult[]> {
  if (!schoolId) {
    return input.map((row) => ({
      parentEmail: row.parentEmail,
      childEmail: row.childEmail,
      success: false,
      message: 'Missing schoolId for bulk linking.',
    }));
  }

  const results: ParentChildLinkResult[] = [];

  for (const row of input) {
    const result = await linkSinglePair(row.parentEmail, row.childEmail, schoolId);
    results.push(result);
  }

  return results;
}

