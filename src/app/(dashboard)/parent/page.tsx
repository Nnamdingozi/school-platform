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