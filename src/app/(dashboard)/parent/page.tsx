// import { redirect } from 'next/navigation';
// import { cookies } from 'next/headers';
// import { createServerClient } from '@supabase/ssr';
// import { prisma } from '@/lib/prisma';
// import { ParentDashboard } from '@/components/parent/ParentDashboard';
// import { getParentChildren } from '@/app/actions/parent-dashboard';

// export default async function ParentDashboardPage() {
//   const cookieStore = await cookies();

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll: () => cookieStore.getAll(),
//         setAll: () => {
//           // read-only in this context
//         },
//       },
//     },
//   );

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     redirect('/login');
//   }

//   const profile = await prisma.profile.findUnique({
//     where: { email: user.email ?? '' },
//     include: {
//       school: true,
//     },
//   });

//   if (!profile || !profile.school) {
//     redirect('/login');
//   }

//   const parentId = profile.id
//   const schoolId = profile.schoolId!;

//   const childrenOfParent = await getParentChildren(parentId, schoolId);

//   return (
//     <ParentDashboard
//       parentName={profile.name}
//       role={profile.role}
//       schoolName={profile.school.name}
//       primaryColor={profile.school.primaryColor}
//       secondaryColor={profile.school.secondaryColor}
//       schoolId={schoolId}
//       childrenOfParent={childrenOfParent}
//     />
//   );
// }

// src/app/parent/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { ParentDashboardOrchestrator } from '@/components/parent/ParentDashboardOrchestrator';
import { getParentChildren } from '@/app/actions/parent-dashboard';
import { parentProfileInclude, BaseProfile } from '@/types/profile';


export default async function ParentDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Use your defined include for parents
  const profile = await prisma.profile.findUnique({
    where: { email: user.email ?? '' },
    include: parentProfileInclude,
  });

  // Strict check: if no profile, no school, or no curriculum (required by BaseProfile)
  if (!profile || !profile.school || !profile.curriculum) {
    redirect('/login');
  }

  const childrenOfParent = await getParentChildren(profile.id, profile.schoolId!);

  return (
    <ParentDashboardOrchestrator
      // Explicitly spreading ensures TS sees the narrowed non-null properties
      profile={profile as unknown as BaseProfile}
      childrenOfParent={childrenOfParent}
    />
  );
}