// // src/components/parent/ParentDashboardOrchestrator.tsx
// import { ParentDashboardClient } from './ParentDashboardClient';
// import {
//   getChildAssessmentHistory,
//   getChildNotifications,
//   getChildSubjectsAndProgress,
// } from '@/app/actions/parent-dashboard';
// import type { 
//   AssessmentRecord, 
//   ChildProfile, 
//   SubjectProgress 
// } from '@/types/parent-dashboard';
// import type { Notification } from '@prisma/client';
// import type { ProfileWithSchool } from '@/types/profile';

// interface ParentDashboardOrchestratorProps {
//   profile: ProfileWithSchool;
//   childrenOfParent: ChildProfile[];
// }

// /**
//  * Server Component: Orchestrates parallel data fetching for all children 
//  * associated with the parent before passing it to the client.
//  */
// export async function ParentDashboardOrchestrator({ 
//   profile, 
//   childrenOfParent 
// }: ParentDashboardOrchestratorProps) {
  
//   // Initialize data containers with explicit types
//   const subjectsByChild: Record<string, SubjectProgress[]> = {};
//   const assessmentsByChild: Record<string, AssessmentRecord[]> = {};
//   const notificationsByChild: Record<string, Notification[]> = {};

//   // Ensure we have a schoolId before proceeding
//   const schoolId = profile.schoolId;

//   if (schoolId && childrenOfParent.length > 0) {
//     // Fetch data for all children in parallel to avoid waterfalls
//     await Promise.all(
//       childrenOfParent.map(async (child) => {
//         const [subjects, assessments, notifications] = await Promise.all([
//           getChildSubjectsAndProgress(child.id, schoolId),
//           getChildAssessmentHistory(child.id, schoolId),
//           getChildNotifications(child.id, schoolId),
//         ]);

//         // Map the results back to the child's ID
//         subjectsByChild[child.id] = subjects;
//         assessmentsByChild[child.id] = assessments;
//         notificationsByChild[child.id] = notifications;
//       })
//     );
//   }

//   return (
//     <ParentDashboardClient
//       initialProfile={profile}
//       childrenOfParent={childrenOfParent}
//       subjectsByChild={subjectsByChild}
//       assessmentsByChild={assessmentsByChild}
//       notificationsByChild={notificationsByChild}
//     />
//   );
// }



import { ParentDashboardClient } from './ParentDashboardClient';
import {
  getChildAssessmentHistory,
  getChildNotifications,
  getChildSubjectsAndProgress,
} from '@/app/actions/parent-dashboard';
import type { 
  AssessmentRecord, 
  ChildProfile, 
  SubjectProgress 
} from '@/types/parent-dashboard';
import type { Notification } from '@prisma/client';
import type { BaseProfile } from '@/types/profile';

interface ParentDashboardOrchestratorProps {
  profile: BaseProfile;
  childrenOfParent: ChildProfile[];
}

export async function ParentDashboardOrchestrator({ 
  profile, 
  childrenOfParent 
}: ParentDashboardOrchestratorProps) {
  
  // Guard against missing school data
  if (!profile.school) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>School configuration missing. Please contact support.</p>
      </div>
    );
  }

  const subjectsByChild: Record<string, SubjectProgress[]> = {};
  const assessmentsByChild: Record<string, AssessmentRecord[]> = {};
  const notificationsByChild: Record<string, Notification[]> = {};

  const schoolId = profile.school.id;

  if (childrenOfParent.length > 0) {
    await Promise.all(
      childrenOfParent.map(async (child) => {
        const [subjects, assessments, notifications] = await Promise.all([
          getChildSubjectsAndProgress(child.id, schoolId),
          getChildAssessmentHistory(child.id, schoolId),
          getChildNotifications(child.id, schoolId),
        ]);

        subjectsByChild[child.id] = subjects;
        assessmentsByChild[child.id] = assessments;
        notificationsByChild[child.id] = notifications;
      })
    );
  }

  return (
    <ParentDashboardClient
      initialProfile={profile}
      childrenOfParent={childrenOfParent}
      subjectsByChild={subjectsByChild}
      assessmentsByChild={assessmentsByChild}
      notificationsByChild={notificationsByChild}
    />
  );
}