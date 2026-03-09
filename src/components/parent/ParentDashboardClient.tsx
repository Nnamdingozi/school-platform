'use client';

import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type {
  AssessmentRecord,
  ChildProfile,
  SubjectProgress,
  TopicStatus,
} from '@/types/parent-dashboard';
import type { Notification } from '@prisma/client';

type ParentDashboardClientProps = {
  parentName: string | null;
  role: string;
  schoolName: string;
  primaryColor: string;
  secondaryColor: string;
  children: ChildProfile[];
  subjectsByChild: Record<string, SubjectProgress[]>;
  assessmentsByChild: Record<string, AssessmentRecord[]>;
  notificationsByChild: Record<string, Notification[]>;
};

function percentageToStroke(pct: number): number {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  return (circumference * Math.min(Math.max(pct, 0), 100)) / 100;
}

function formatDate(date: Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function letterFromPercentage(pct: number | null): string {
  if (pct == null) return '-';
  if (pct >= 85) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 55) return 'C';
  if (pct >= 40) return 'D';
  return 'E';
}

export function ParentDashboardClient({
  parentName,
  role,
  schoolName,
  primaryColor,
  secondaryColor,
  children,
  subjectsByChild,
  assessmentsByChild,
  notificationsByChild,
}: ParentDashboardClientProps) {
  const [selectedChildId, setSelectedChildId] = useState<string>(
    children[0]?.id ?? '',
  );
  const [tab, setTab] = useState<'overview' | 'subjects' | 'assessments'>(
    'overview',
  );
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [expandedSubjectIds, setExpandedSubjectIds] = useState<
    Record<string, boolean>
  >({});

  const currentChild = children.find((c) => c.id === selectedChildId) ?? children[0];
  const currentSubjects = subjectsByChild[currentChild?.id ?? ''] ?? [];
  const currentAssessments = assessmentsByChild[currentChild?.id ?? ''] ?? [];
  const currentNotifications = notificationsByChild[currentChild?.id ?? ''] ?? [];

  const overallStats = useMemo(() => {
    const totalSubjects = currentSubjects.length;
    const totalAssessments = currentSubjects.reduce(
      (sum, s) => sum + s.assessments.length,
      0,
    );
    let lessonsAvailable = 0;
    let pendingAssessments = 0;

    currentSubjects.forEach((subject) => {
      subject.topics.forEach((topic) => {
        if (topic.hasLesson) {
          lessonsAvailable += 1;
          if (!topic.assessment) {
            pendingAssessments += 1;
          }
        }
      });
    });

    const allPcts: number[] = [];
    currentSubjects.forEach((s) => {
      s.assessments.forEach((a) => {
        if (a.pct != null) allPcts.push(a.pct);
      });
    });
    const overallPct =
      allPcts.length > 0
        ? allPcts.reduce((sum, v) => sum + v, 0) / allPcts.length
        : 0;

    return {
      totalSubjects,
      totalAssessments,
      lessonsAvailable,
      pendingAssessments,
      overallPct,
    };
  }, [currentSubjects]);

  const perSubjectAverages = useMemo(
    () =>
      currentSubjects.map((s) => {
        const valid = s.assessments
          .map((a) => a.pct)
          .filter((p): p is number => p != null);
        const avg =
          valid.length > 0
            ? valid.reduce((sum, v) => sum + v, 0) / valid.length
            : 0;
        return {
          id: s.gradeSubjectId,
          name: s.subjectName,
          avg,
        };
      }),
    [currentSubjects],
  );

  const unreadCount = currentNotifications.length;

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-50"
      style={
        {
          '--color-primary': primaryColor,
          '--color-secondary': secondaryColor,
        } as CSSProperties
      }
    >
      {/* Top nav */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-semibold">
              {schoolName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm text-slate-400">Parent Dashboard</div>
              <div className="font-semibold text-slate-50">{schoolName}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium">
                {parentName ?? 'Parent'}
              </div>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium primary border border-primary/40">
              {role}
            </span>
            <button
              type="button"
              onClick={() => setNotificationsOpen((open) => !open)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800 transition"
            >
              <span className="sr-only">Notifications</span>
              <svg
                className="h-5 w-5 text-slate-200"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M14 18.5a2 2 0 1 1-4 0"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M6.5 10.5A5.5 5.5 0 1 1 18 10.5c0 1.97.74 3.06 1.34 3.87.64.88.96 1.32.9 1.66-.07.37-.37.67-.97 1.27-.9.9-1.36 1.35-1.9 1.56-.48.18-1.02.18-2.1.18H9.13c-1.08 0-1.62 0-2.1-.18-.54-.21-1-.66-1.9-1.56-.6-.6-.9-.9-.97-1.27-.06-.34.26-.78.9-1.66.6-.81 1.34-1.9 1.34-3.87Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-slate-950">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {notificationsOpen && (
          <div className="border-t border-slate-800 bg-slate-950/95">
            <div className="mx-auto max-w-6xl px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-100">
                  Unread notifications for {currentChild?.name ?? 'student'}
                </h2>
                <span className="text-xs text-slate-400">
                  Click a notification to mark as read
                </span>
              </div>
              {currentNotifications.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No unread notifications.
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {currentNotifications.map((n) => (
                    <li
                      key={n.id}
                      className="cursor-pointer rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 hover:border-primary/60 hover:bg-slate-900/80 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-slate-100">{n.message}</p>
                        <span className="shrink-0 text-[10px] text-slate-500">
                          {formatDate(n.createdAt)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Child selector */}
        <section className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-slate-50">
                Welcome back, {parentName ?? 'Parent'}
              </h1>
              <p className="text-xs text-slate-400">
                Select a child to view detailed progress.
              </p>
            </div>
          </div>
          {children.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => setSelectedChildId(child.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    child.id === currentChild?.id
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {child.name ?? child.email}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Child info + tabs */}
        {currentChild && (
          <section className="space-y-4">
            {/* Student info + overview ring */}
            <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-400">
                      Student overview
                    </div>
                    <div className="mt-1 text-base font-semibold text-slate-50">
                      {currentChild.name ?? currentChild.email}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {currentChild.grade} • {currentChild.curriculum}
                    </div>
                    <div className="mt-2 inline-flex items-center rounded-full bg-slate-800 px-2 py-1 text-[10px] text-slate-300">
                      Current {currentChild.termLabel}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative h-20 w-20">
                      <svg viewBox="0 0 48 48" className="h-20 w-20">
                        <circle
                          cx="24"
                          cy="24"
                          r="18"
                          className="stroke-slate-800"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="18"
                          className="stroke-primary"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={2 * Math.PI * 18}
                          strokeDashoffset={
                            2 * Math.PI * 18 -
                            percentageToStroke(overallStats.overallPct)
                          }
                          strokeLinecap="round"
                          transform="rotate(-90 24 24)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs font-semibold text-slate-50">
                          {Math.round(overallStats.overallPct)}%
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {letterFromPercentage(overallStats.overallPct)}
                        </span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Overall average
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                  <div className="text-[10px] uppercase tracking-wide text-slate-400">
                    Total subjects
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-slate-50">
                    {overallStats.totalSubjects}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                  <div className="text-[10px] uppercase tracking-wide text-slate-400">
                    Total assessments
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-slate-50">
                    {overallStats.totalAssessments}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                  <div className="text-[10px] uppercase tracking-wide text-slate-400">
                    Lessons available
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-slate-50">
                    {overallStats.lessonsAvailable}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                  <div className="text-[10px] uppercase tracking-wide text-slate-400">
                    Pending assessments
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-amber-400">
                    {overallStats.pendingAssessments}
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="mt-2 border-b border-slate-800">
              <div className="flex gap-4 text-xs">
                {(['overview', 'subjects', 'assessments'] as const).map(
                  (key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTab(key)}
                      className={`relative py-2 capitalize ${
                        tab === key
                          ? 'text-primary'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {key}
                      {tab === key && (
                        <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary rounded-full" />
                      )}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Tab content */}
            {tab === 'overview' && (
              <div className="space-y-4 pt-2">
                <h2 className="text-xs font-semibold text-slate-300">
                  Subject progress
                </h2>
                <div className="space-y-3">
                  {currentSubjects.map((subject) => {
                    const totalTopics = subject.topics.length;
                    const topicsWithLessons = subject.topics.filter(
                      (t) => t.hasLesson,
                    ).length;
                    const pct =
                      totalTopics > 0
                        ? Math.round(
                            (topicsWithLessons / totalTopics) * 100,
                          )
                        : 0;
                    return (
                      <div
                        key={subject.gradeSubjectId}
                        className="rounded-xl border border-slate-800 bg-slate-900/80 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-xs font-medium text-slate-100">
                              {subject.subjectName}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {topicsWithLessons}/{totalTopics} topics ready
                            </div>
                          </div>
                          <div className="w-32">
                            <div className="h-1.5 w-full rounded-full bg-slate-800">
                              <div
                                className="h-1.5 rounded-full bg-primary"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className="mt-1 text-right text-[10px] text-slate-400">
                              {pct}% complete
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {currentSubjects.length === 0 && (
                    <p className="text-xs text-slate-500">
                      No subject enrollments found for this student yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {tab === 'subjects' && (
              <div className="space-y-4 pt-2">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {currentSubjects.map((subject) => {
                    const id = subject.gradeSubjectId;
                    const avg = subject.avgScore ?? 0;
                    const isExpanded = expandedSubjectIds[id] ?? false;
                    const topicCount = subject.topics.length;
                    return (
                      <div
                        key={id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedSubjectIds((prev) => ({
                              ...prev,
                              [id]: !isExpanded,
                            }))
                          }
                          className="flex w-full items-center justify-between gap-3"
                        >
                          <div className="text-left">
                            <div className="text-xs font-semibold text-slate-50">
                              {subject.subjectName}
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-400">
                              Teacher:{' '}
                              {subject.teacherName ?? 'Not assigned yet'}
                            </div>
                            <div className="mt-1 text-[11px] text-slate-500">
                              {topicCount} topics
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="relative h-12 w-12">
                              <svg viewBox="0 0 48 48" className="h-12 w-12">
                                <circle
                                  cx="24"
                                  cy="24"
                                  r="18"
                                  className="stroke-slate-800"
                                  strokeWidth="5"
                                  fill="none"
                                />
                                <circle
                                  cx="24"
                                  cy="24"
                                  r="18"
                                  className="stroke-primary"
                                  strokeWidth="5"
                                  fill="none"
                                  strokeDasharray={2 * Math.PI * 18}
                                  strokeDashoffset={
                                    2 * Math.PI * 18 -
                                    percentageToStroke(avg || 0)
                                  }
                                  strokeLinecap="round"
                                  transform="rotate(-90 24 24)"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[11px] font-semibold text-slate-50">
                                  {Math.round(avg)}%
                                </span>
                                <span className="text-[9px] text-slate-400">
                                  {letterFromPercentage(avg)}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-slate-400">
                              {isExpanded ? 'Hide' : 'Details'}
                            </span>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/60 p-2">
                            <div className="mb-1 grid grid-cols-[2fr,auto,auto,auto,auto] gap-2 border-b border-slate-800 pb-1 text-[10px] font-medium text-slate-400">
                              <span>Topic</span>
                              <span className="text-center">Week</span>
                              <span className="text-center">Term</span>
                              <span className="text-center">Lesson</span>
                              <span className="text-center">Score</span>
                            </div>
                            <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                              {subject.topics.map((topic: TopicStatus) => (
                                <div
                                  key={topic.id}
                                  className="grid grid-cols-[2fr,auto,auto,auto,auto] items-center gap-2 rounded-lg px-1.5 py-1 text-[11px] text-slate-100 hover:bg-slate-900/80"
                                >
                                  <span className="truncate">
                                    {topic.title}
                                  </span>
                                  <span className="text-center text-slate-400">
                                    {topic.weekNumber ?? '-'}
                                  </span>
                                  <span className="text-center text-slate-400">
                                    {topic.termName}
                                  </span>
                                  <span className="text-center">
                                    <span
                                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] ${
                                        topic.hasLesson
                                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                                      }`}
                                    >
                                      {topic.hasLesson ? 'Ready' : 'Coming soon'}
                                    </span>
                                  </span>
                                  <span className="text-center">
                                    {topic.assessment ? (
                                      <span className="inline-flex rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-100">
                                        {Math.round(topic.assessment.pct)}%
                                      </span>
                                    ) : (
                                      <span className="inline-flex rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300 border border-amber-500/30">
                                        Pending
                                      </span>
                                    )}
                                  </span>
                                </div>
                              ))}
                              {subject.topics.length === 0 && (
                                <div className="py-2 text-center text-[11px] text-slate-500">
                                  No topics defined yet for this subject.
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {tab === 'assessments' && (
              <div className="space-y-4 pt-2">
                {/* Per-subject averages strip */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                  <div className="mb-2 text-xs font-semibold text-slate-200">
                    Subject averages
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {perSubjectAverages.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-[11px]"
                      >
                        <span className="text-slate-200">{s.name}</span>
                        <span className="h-1 w-14 overflow-hidden rounded-full bg-slate-800">
                          <span
                            className="block h-1 rounded-full bg-primary"
                            style={{ width: `${Math.round(s.avg)}%` }}
                          />
                        </span>
                        <span className="text-slate-300">
                          {Math.round(s.avg)}%
                        </span>
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                          {letterFromPercentage(s.avg)}
                        </span>
                      </div>
                    ))}
                    {perSubjectAverages.length === 0 && (
                      <p className="text-xs text-slate-500">
                        No assessments recorded yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Assessment history */}
                <div className="space-y-2">
                  {currentAssessments.map((a) => (
                    <article
                      key={a.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold text-slate-50">
                            {a.subjectName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {a.topicTitle || 'General assessment'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                            {a.type}
                          </span>
                          <div className="text-right text-[11px] text-slate-400">
                            <div>{formatDate(a.createdAt)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-semibold text-slate-50">
                            {a.score != null && a.maxScore != null
                              ? `${a.score}/${a.maxScore}`
                              : 'Not graded'}
                          </span>
                          {a.pct != null && (
                            <>
                              <span className="text-xs text-slate-400">
                                ({Math.round(a.pct)}%)
                              </span>
                              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                                {letterFromPercentage(a.pct)}
                              </span>
                            </>
                          )}
                        </div>
                        {a.feedbacks.some((f) => f.whatsappSid) && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300 border border-emerald-500/30">
                            <span>Sent via WhatsApp</span>
                            <span className="text-emerald-400">✓</span>
                          </span>
                        )}
                      </div>
                      {a.comments && (
                        <div className="mt-2 border-l-2 border-primary/70 pl-3 text-[11px] italic text-slate-200">
                          {a.comments}
                        </div>
                      )}
                      {a.feedbacks.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {a.feedbacks.map((f, idx) => (
                            <div
                              key={idx}
                              className="border-l-2 border-primary/40 pl-3 text-[11px] italic text-slate-300"
                            >
                              {f.message}
                            </div>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                  {currentAssessments.length === 0 && (
                    <p className="text-xs text-slate-500">
                      No assessments recorded for this student yet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

