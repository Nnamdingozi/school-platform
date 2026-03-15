import { ParentDashboardClient } from './ParentDashboardClient';
import {
  getChildAssessmentHistory,
  getChildNotifications,
  getChildSubjectsAndProgress,
} from '@/app/actions/parent-dashboard';
import type {
  AssessmentRecord,
  ChildProfile,
  SubjectProgress,
} from '@/types/parent-dashboard';
import type { Notification } from '@prisma/client';

type ParentDashboardProps = {
  parentName: string | null;
  role: string;
  schoolName: string;
  primaryColor: string;
  secondaryColor: string;
  parentId: string;
  schoolId: string;
  children: ChildProfile[];
};

export async function ParentDashboard({
  parentName,
  role,
  schoolName,
  primaryColor,
  secondaryColor,
  parentId,
  schoolId,
  children,
}: ParentDashboardProps) {
  const subjectsByChild: Record<string, SubjectProgress[]> = {};
  const assessmentsByChild: Record<string, AssessmentRecord[]> = {};
  const notificationsByChild: Record<string, Notification[]> = {};

  await Promise.all(
    children.map(async (child) => {
      const [subjects, assessments, notifications] = await Promise.all([
        getChildSubjectsAndProgress(child.id, schoolId),
        getChildAssessmentHistory(child.id, schoolId),
        getChildNotifications(child.id, schoolId),
      ]);

      subjectsByChild[child.id] = subjects;
      assessmentsByChild[child.id] = assessments;
      notificationsByChild[child.id] = notifications;
    }),
  );

  return (
    <ParentDashboardClient
      parentName={parentName}
      role={role}
      schoolName={schoolName}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      children={children}
      subjectsByChild={subjectsByChild}
      assessmentsByChild={assessmentsByChild}
      notificationsByChild={notificationsByChild}
    />
  );
}

