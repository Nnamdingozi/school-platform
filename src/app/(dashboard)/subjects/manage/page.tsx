

// import { prisma } from "@/lib/prisma";
// import { ManageSubjectsClient } from "@/components/subjects/manage-subjects-client";
// // ✅ Import everything directly from the standard client package
// import { Role, Prisma } from "@prisma/client"; 

// type PageProps = {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// };

// // ✅ This type helper now uses the standard @prisma/client namespace
// type GradeSubjectWithRelations = Prisma.GradeSubjectGetPayload<{
//   include: {
//     grade: true;
//     subject: true;
//     selectedByUsers: {
//       select: { id: true };
//     };
//   };
// }>;

// async function getSeedUser(roleHint?: string) {
//   if (roleHint === "student") {
//     const student = await prisma.profile.findFirst({
//       where: { email: "student@lagosacademy.test" },
//     });
//     if (student) return student;
//   }

//   if (roleHint === "teacher") {
//     const teacher = await prisma.profile.findFirst({
//       where: { email: "teacher@lagosacademy.test" },
//     });
//     if (teacher) return teacher;
//   }

//   const teacher = await prisma.profile.findFirst({
//     where: { email: "teacher@lagosacademy.test" },
//   });
//   if (teacher) return teacher;

//   const student = await prisma.profile.findFirst({
//     where: { email: "student@lagosacademy.test" },
//   });
//   if (student) return student;

//   return null;
// }

// export default async function ManageSubjectsPage({ searchParams }: PageProps) {
//   const params = await searchParams;
//   const roleHint = typeof params.role === "string" ? params.role : undefined;
  
//   const user = await getSeedUser(roleHint);
//   console.log("🕵️ Found User:", user?.email, "Role:", user?.role);

//   if (!user) {
//     return (
//       <div className="mx-auto max-w-2xl py-10">
//         <h1 className="text-2xl font-bold">Manage Your Subjects</h1>
//         <p className="mt-2 text-sm text-muted-foreground">
//           No seed user found. Run the seed script and check database.
//         </p>
//       </div>
//     );
//   }

//   let gradeSubjects: GradeSubjectWithRelations[] = [];

//   if (user.role === Role.STUDENT) {
//     const grade = await prisma.grade.findFirst({
//       where: {
//         curriculumId: user.curriculumId,
//         level: 7,
//       },
//     });

//     if (grade) {
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
//           subject: { name: "asc" },
//         },
//       });
//     }
//   } else {
//     // Teacher debug query
//     gradeSubjects = await prisma.gradeSubject.findMany({
//       include: {
//         grade: true,
//         subject: true,
//         selectedByUsers: {
//           where: { id: user.id },
//           select: { id: true },
//         },
//       },
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


import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server"; // ✅ Import your server client
import { ManageSubjectsClient } from "@/components/subjects/manage-subjects-client";
import { Role, Prisma } from "@prisma/client";

// ✅ Type for searchParams in Next.js 15
type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type GradeSubjectWithRelations = Prisma.GradeSubjectGetPayload<{
  include: {
    grade: true;
    subject: true;
    selectedByUsers: {
      select: { id: true };
    };
  };
}>;

export default async function ManageSubjectsPage({ searchParams }: PageProps) {
  // 1. Next.js 15: Unwrap Search Params
  const params = await searchParams;
  
  // 2. Authenticate User via Supabase
  const supabase = await createClient();
  const { data: { user: authUser }, error } = await supabase.auth.getUser();

  if (error || !authUser) {
    redirect("/login");
  }

  // 3. Fetch Profile from Database
  const profile = await prisma.profile.findUnique({
    where: { email: authUser.email },
    include: {
        // Include enrollments to find the student's current grade
        classEnrollments: {
            include: {
                class: true
            }
        }
    }
  });

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center bg-slate-900 border border-white/5 p-10 rounded-[2.5rem]">
          <p className="text-slate-400 italic">User profile not found in institutional registry.</p>
        </div>
      </div>
    );
  }

  let gradeSubjects: GradeSubjectWithRelations[] = [];

  // 4. Logic based on User Role
  if (profile.role === Role.STUDENT) {
    // Determine which grade to show subjects for
    // Priority: 1. Their current class, 2. Default to level 7
    const currentGradeId = profile.classEnrollments[0]?.class?.gradeId;

    gradeSubjects = await prisma.gradeSubject.findMany({
      where: {
        // If they are in a class, show those subjects. 
        // Otherwise, show all subjects for their curriculum
        ...(currentGradeId ? { gradeId: currentGradeId } : { grade: { curriculumId: profile.curriculumId } }),
        OR: [
            { schoolId: profile.schoolId },
            { schoolId: null }
        ]
      },
      include: {
        grade: true,
        subject: true,
        selectedByUsers: {
          where: { id: profile.id },
          select: { id: true },
        },
      },
      orderBy: { subject: { name: "asc" } },
    });
  } else {
    // Teacher Logic: Show all subjects available in the school
    gradeSubjects = await prisma.gradeSubject.findMany({
      where: {
        OR: [
            { schoolId: profile.schoolId },
            { schoolId: null }
        ],
        // Ensure we stay within the correct curriculum
        grade: { curriculumId: profile.curriculumId }
      },
      include: {
        grade: true,
        subject: true,
        selectedByUsers: {
          where: { id: profile.id },
          select: { id: true },
        },
      },
      orderBy: [
        { grade: { level: 'asc' } },
        { subject: { name: 'asc' } }
      ]
    });
  }

  // 5. Format for Client Component
  const subjects = gradeSubjects.map((gs) => ({
    id: gs.id,
    gradeName: gs.grade.displayName,
    subjectName: gs.subject.name,
    isSelected: gs.selectedByUsers.length > 0,
  }));

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 md:px-12 md:py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="border-b border-white/5 pb-8">
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Registry Management</h1>
            <p className="text-slate-500 text-sm mt-2">
                Configure your active subjects for the {profile.role.toLowerCase()} dashboard.
            </p>
        </header>

        <ManageSubjectsClient
          userId={profile.id}
          userRole={profile.role}
          subjects={subjects}
        />
      </div>
    </main>
  );
}