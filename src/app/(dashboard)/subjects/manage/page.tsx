// import { prisma } from "@/lib/prisma";
// import { ManageSubjectsClient } from "@/components/subjects/manage-subjects-client";
// import { GradeSubject, Role } from "@prisma/client";

// type PageProps = {
//   searchParams?: {
//     role?: string;
//   };
// };

// async function getSeedUser(roleHint?: string) {
//   if (roleHint === "student") {
//     const student = await prisma.user.findFirst({
//       where: { email: "student@lagosacademy.test" },
//     });
//     if (student) return student;
//   }

//   if (roleHint === "teacher") {
//     const teacher = await prisma.user.findFirst({
//       where: { email: "teacher@lagosacademy.test" },
//     });
//     if (teacher) return teacher;
//   }

//   // Default: prefer teacher, then student.
//   const teacher = await prisma.user.findFirst({
//     where: { email: "teacher@lagosacademy.test" },
//   });
//   if (teacher) return teacher;

//   const student = await prisma.user.findFirst({
//     where: { email: "student@lagosacademy.test" },
//   });
//   if (student) return student;

//   return null;
// }

// export default async function ManageSubjectsPage({ searchParams }: PageProps) {
//   const roleHint = searchParams?.role;
//   const user = await getSeedUser(roleHint);

//   if (!user) {
//     return (
//       <div className="mx-auto max-w-2xl py-10">
//         <h1 className="text-2xl font-bold">Manage Your Subjects</h1>
//         <p className="mt-2 text-sm text-muted-foreground">
//           No seed user found. Make sure you have run the Prisma seed and that
//           the test users exist.
//         </p>
//       </div>
//     );
//   }

//   let gradeSubjects: GradeSubject[] = [];

//   if (user.role === Role.STUDENT) {
//     // For now, assume the student is in JSS 1 (level 7) of their curriculum.
//     const grade = await prisma.grade.findFirst({
//       where: {
//         curriculumId: user.curriculumId,
//         level: 7,
//       },
//     });

//     if (!grade) {
//       gradeSubjects = [];
//     } else {
//       gradeSubjects = await prisma.gradeSubject.findMany({
//         where: {
//           gradeId: grade.id,
//           schoolId: user.schoolId ?? undefined,
//         },
//         include: {
//           grade: true,
//           subject: true,
//           selectedByUsers: {
//             where: { id: user.id },
//             select: { id: true },
//           },
//         },
//         orderBy: {
//           subject: {
//             name: "asc",
//           },
//         },
//       });
//     }
//   } else {
//     // Teacher: see all GradeSubjects for their curriculum (and school, if set).
//     gradeSubjects = await prisma.gradeSubject.findMany({
//       where: {
//         grade: {
//           curriculumId: user.curriculumId,
//         },
//         schoolId: user.schoolId ?? undefined,
//       },
//       include: {
//         grade: true,
//         subject: true,
//         selectedByUsers: {
//           where: { id: user.id },
//           select: { id: true },
//         },
//       },
//       orderBy: [
//         { grade: { level: "asc" } },
//         { subject: { name: "asc" } },
//       ],
//     });
//   }

//   const subjects = gradeSubjects.map((gs) => ({
//     id: gs.id,
//     gradeName: gs.grade.displayName,
//     subjectName: gs.subject.name,
//     isSelected: gs.selectedByUsers.length > 0,
//   }));

//   return (
//     <main className="min-h-screen bg-background px-4 py-6 md:px-8 md:py-10">
//       <ManageSubjectsClient
//         userId={user.id}
//         userRole={user.role}
//         subjects={subjects}
//       />
//     </main>
//   );
// }



import { prisma } from "@/lib/prisma";
import { ManageSubjectsClient } from "@/components/subjects/manage-subjects-client";
import {  Role } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Define the type that includes the relations we are fetching in our queries
type GradeSubjectWithRelations = Prisma.GradeSubjectGetPayload<{
  include: {
    grade: true;
    subject: true;
    selectedByUsers: {
      select: { id: true }; // This matches your query exactly
    };
  };
}>;
async function getSeedUser(roleHint?: string) {
  if (roleHint === "student") {
    const student = await prisma.profile.findFirst({
      where: { email: "student@lagosacademy.test" },
    });
    if (student) return student;
  }

  if (roleHint === "teacher") {
    const teacher = await prisma.profile.findFirst({
      where: { email: "teacher@lagosacademy.test" },
    });
    if (teacher) return teacher;
  }

  // Default: prefer teacher, then student.
  const teacher = await prisma.profile.findFirst({
    where: { email: "teacher@lagosacademy.test" },
  });
  if (teacher) return teacher;

  const student = await prisma.profile.findFirst({
    where: { email: "student@lagosacademy.test" },
  });
  if (student) return student;

  return null;
}

export default async function ManageSubjectsPage({ searchParams }: PageProps) {
  // Next.js 15: searchParams must be awaited
  const params = await searchParams;
  const roleHint = typeof params.role === "string" ? params.role : undefined;
  
  const user = await getSeedUser(roleHint);
  console.log("🕵️ Found User:", user?.email, "Role:", user?.role);


  if (!user) {
    return (
      <div className="mx-auto max-w-2xl py-10">
        <h1 className="text-2xl font-bold">Manage Your Subjects</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No seed user found. Make sure you have run the Prisma seed and that
          the test users exist.
        </p>
      </div>
    );
  }

  // Initialize as an array of the relation-heavy type
  let gradeSubjects: GradeSubjectWithRelations[] = [];

  if (user.role === Role.STUDENT) {
    // For now, assume the student is in JSS 1 (level 7) of their curriculum.
    const grade = await prisma.grade.findFirst({
      where: {
        curriculumId: user.curriculumId,
        level: 7,
      },
    });

    if (grade) {
      gradeSubjects = await prisma.gradeSubject.findMany({
        where: {
          gradeId: grade.id,
          schoolId: user.schoolId ?? undefined,
        },
        include: {
          grade: true,
          subject: true,
          selectedByUsers: {
            where: { id: user.id },
            select: { id: true },
          },
        },
        orderBy: {
          subject: {
            name: "asc",
          },
        },
      });
    }
  } else {
    // Teacher: see all GradeSubjects for their curriculum (and school, if set).
  //   gradeSubjects = await prisma.gradeSubject.findMany({
  //     where: {
  //       grade: {
  //         curriculumId: user.curriculumId, // Must match user's curriculum
  //       },
  //       // THE CRITICAL FIX:
  //       // Show subjects that have NO schoolId (Global) 
  //       // OR subjects that match the user's schoolId
  //       OR: [
  //         { schoolId: null },
  //         { schoolId: user.schoolId }
  //       ]
  //     },
  //     include: {
  //       grade: true,
  //       subject: true,
  //       selectedByUsers: {
  //         where: { id: user.id },
  //         select: { id: true },
  //       },
  //     },
  //     orderBy: [
  //       { grade: { level: "asc" } },
  //       { subject: { name: "asc" } },
  //     ],
  //   });
  // 

  //TEACHER: Wide Net Query for Debugging
gradeSubjects = await prisma.gradeSubject.findMany({
  include: {
    grade: true,
    subject: true,
    selectedByUsers: {
      where: { id: user.id },
      select: { id: true },
    },
  },
});
}
  console.log("📊 Number of GradeSubjects found:", gradeSubjects.length);

  // Now TypeScript knows exactly what gs.grade and gs.subject are
  const subjects = gradeSubjects.map((gs) => ({
    id: gs.id,
    gradeName: gs.grade.displayName,
    subjectName: gs.subject.name,
    isSelected: gs.selectedByUsers.length > 0,
  }));
  console.log("📦 Final subjects array being sent to Client:", subjects.length);
  return (
    <main className="min-h-screen bg-background px-4 py-6 md:px-8 md:py-10">
      <ManageSubjectsClient
        userId={user.id}
        userRole={user.role}
        subjects={subjects}
      />
    </main>
  );
}