import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';
import { ParentDashboard } from '@/components/parent/ParentDashboard';
import { getParentChildren } from '@/app/actions/parent-dashboard';

export default async function ParentDashboardPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {
          // read-only in this context
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await prisma.profile.findUnique({
    where: { email: user.email ?? '' },
    include: {
      school: true,
    },
  });

  if (!profile || !profile.school) {
    redirect('/login');
  }

  const parentId = profile.id
  const schoolId = profile.schoolId!;

  const childrenOfParent = await getParentChildren(parentId, schoolId);

  return (
    <ParentDashboard
      parentName={profile.name}
      role={profile.role}
      schoolName={profile.school.name}
      primaryColor={profile.school.primaryColor}
      secondaryColor={profile.school.secondaryColor}
      schoolId={schoolId}
      childrenOfParent={childrenOfParent}
    />
  );
}

