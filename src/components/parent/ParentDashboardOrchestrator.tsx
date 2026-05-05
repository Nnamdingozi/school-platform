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
// import type { BaseProfile } from '@/types/profile';

// interface ParentDashboardOrchestratorProps {
//   profile: BaseProfile;
//   childrenOfParent: ChildProfile[];
// }

// export async function ParentDashboardOrchestrator({ 
//   profile, 
//   childrenOfParent 
// }: ParentDashboardOrchestratorProps) {
  
//   // Guard against missing school data
//   if (!profile.school) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p>School configuration missing. Please contact support.</p>
//       </div>
//     );
//   }

//   const subjectsByChild: Record<string, SubjectProgress[]> = {};
//   const assessmentsByChild: Record<string, AssessmentRecord[]> = {};
//   const notificationsByChild: Record<string, Notification[]> = {};

//   const schoolId = profile.school.id;

//   if (childrenOfParent.length > 0) {
//     await Promise.all(
//       childrenOfParent.map(async (child) => {
//         const [subjects, assessments, notifications] = await Promise.all([
//           getChildSubjectsAndProgress(child.id, schoolId),
//           getChildAssessmentHistory(child.id, schoolId),
//           getChildNotifications(child.id, schoolId),
//         ]);

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


'use client';

import { useMemo, useState, useEffect } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { 
    AssessmentRecord, ChildProfile, 
    SubjectProgress 
} from '@/types/parent-dashboard';
import { Notification, Role } from '@prisma/client';
import { Bell, GraduationCap, Layout, BookOpen, ShieldCheck, History, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// ── Types ───────────────────────────────────────────────────────────────────

type ParentDashboardProps = {
    initialProfile: any;
    childrenOfParent: ChildProfile[];
    subjectsByChild: Record<string, SubjectProgress[]>;
    assessmentsByChild: Record<string, AssessmentRecord[]>;
    notificationsByChild: Record<string, Notification[]>;
};

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * PARENT PERFORMANCE CONSOLE (Tier 3)
 * Rule 11: Real-time synchronization of child metrics.
 * Rule 17: Styling via primaryColor from Zustand.
 */
export function ParentDashboardClient({
    initialProfile,
    childrenOfParent,
    subjectsByChild,
    assessmentsByChild,
    notificationsByChild,
}: ParentDashboardProps) {
    // Rule 11 & 17: Sync Registry Identity
    const setProfile = useProfileStore((state) => state.setProfile);
    useEffect(() => {
        if (initialProfile) setProfile(initialProfile);
    }, [initialProfile, setProfile]);

    const primaryColor = initialProfile.school?.primaryColor ?? '#f59e0b';
    const schoolName = initialProfile.school?.name ?? 'Institutional Registry';

    // State
    const [selectedChildId, setSelectedChildId] = useState<string>(childrenOfParent[0]?.id ?? '');
    const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'assessments'>('overview');

    // Contextual Selectors
    const currentChild = useMemo(
        () => childrenOfParent.find((c) => c.id === selectedChildId) ?? childrenOfParent[0],
        [childrenOfParent, selectedChildId]
    );

    const currentSubjects = useMemo(() => subjectsByChild[currentChild?.id ?? ''] ?? [], [subjectsByChild, currentChild?.id]);
    const currentAssessments = useMemo(() => assessmentsByChild[currentChild?.id ?? ''] ?? [], [assessmentsByChild, currentChild?.id]);
    const currentNotifications = useMemo(() => notificationsByChild[currentChild?.id ?? ''] ?? [], [notificationsByChild, currentChild?.id]);

    const overallStats = useMemo(() => {
        const allPcts = currentSubjects.flatMap(s => s.assessments.map(a => a.pct).filter((p): p is number => p != null));
        const overallPct = allPcts.length > 0 ? allPcts.reduce((a, b) => a + b, 0) / allPcts.length : 0;
        const lessonsCount = currentSubjects.reduce((acc, s) => acc + s.topics.filter(t => t.hasLesson).length, 0);

        return { 
            totalSubjects: currentSubjects.length, 
            overallPct: Math.round(overallPct), 
            lessonsAvailable: lessonsCount
        };
    }, [currentSubjects]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans pb-20">
            
            {/* ── HEADER ── */}
            <header className="border-b border-white/5 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-4">
                        <div 
                            className="h-10 w-10 rounded-2xl flex items-center justify-center font-black text-slate-950 italic"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {schoolName.charAt(0)}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">Parent Dashboard</p>
                            <h2 className="text-lg font-black uppercase italic tracking-tighter text-white">{schoolName}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                            <div className="text-sm font-black uppercase italic leading-none">{initialProfile.name}</div>
                            <div className="text-[9px] text-slate-500 font-bold uppercase mt-1">Authorized Guardian</div>
                        </div>
                        <div className="relative p-2 rounded-xl bg-slate-950 border border-white/5">
                            <Bell className="h-5 w-5 text-slate-600" />
                            {currentNotifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                    {currentNotifications.length}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-10 space-y-10">
                
                {/* ── CHILD SWITCHER ── */}
                {childrenOfParent.length > 1 && (
                    <div className="flex gap-2 bg-slate-900 p-1.5 rounded-2xl w-fit border border-white/5 shadow-inner">
                        {childrenOfParent.map(child => (
                            <button
                                key={child.id}
                                onClick={() => setSelectedChildId(child.id)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    selectedChildId === child.id 
                                    ? "bg-slate-950 text-white shadow-xl border border-white/5" 
                                    : "text-slate-500 hover:text-white"
                                )}
                            >
                                {child.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── PERFORMANCE GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Primary Profile Card */}
                    <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                            <GraduationCap className="h-24 w-24 text-white" />
                        </div>
                        
                        <div className="relative h-40 w-40 flex items-center justify-center mb-6">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                <circle 
                                    cx="50" cy="50" r="45" fill="none" 
                                    stroke={primaryColor} strokeWidth="8" 
                                    strokeDasharray="282.7" 
                                    strokeDashoffset={282.7 - (282.7 * overallStats.overallPct) / 100}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black italic tracking-tighter">{overallStats.overallPct}%</span>
                                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Aggregate</span>
                            </div>
                        </div>
                        <h3 className="font-black text-2xl uppercase italic text-white leading-none">{currentChild?.name}</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">{currentChild?.grade} • {currentChild?.curriculum}</p>
                    </Card>

                    {/* Stats Module */}
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        <StatItem label="Registered Modules" value={overallStats.totalSubjects} icon={BookOpen} color={primaryColor} />
                        <StatItem label="Active Academic Nodes" value={overallStats.lessonsAvailable} icon={ShieldCheck} color={primaryColor} />
                        <StatItem label="Current GPA Status" value={`${overallStats.overallPct}%`} icon={Layout} color={primaryColor} />
                        <StatItem label="Unread Notifications" value={currentNotifications.length} icon={Bell} color="#ef4444" highlight />
                    </div>
                </div>

                {/* ── TAB NAVIGATION ── */}
                <div className="space-y-6">
                   <nav className="flex gap-10 border-b border-white/5 px-4">
                        {(['overview', 'subjects', 'assessments'] as const).map((t) => (
                            <button 
                                key={t} 
                                onClick={() => setActiveTab(t)}
                                className={cn(
                                    "pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative",
                                    activeTab === t ? "text-white" : "text-slate-600 hover:text-slate-400"
                                )}
                            >
                                {t}
                                {activeTab === t && (
                                    <div 
                                        className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full shadow-lg" 
                                        style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }} 
                                    />
                                )}
                            </button>
                        ))}
                   </nav>

                   <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {activeTab === 'assessments' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentAssessments.map(a => (
                                    <Card key={a.id} className="bg-slate-900 border-white/5 p-6 rounded-[1.5rem] flex justify-between items-center hover:border-white/10 transition-all">
                                        <div className="space-y-1">
                                            <p className="font-black text-white uppercase italic text-sm">{a.subjectName}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{a.topicTitle}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black italic leading-none" style={{ color: primaryColor }}>{a.pct}%</p>
                                            <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">{new Date(a.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </Card>
                                ))}
                                {currentAssessments.length === 0 && (
                                    <div className="col-span-full py-20 text-center opacity-30">
                                        <History className="h-10 w-10 mx-auto mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Performance ledger empty</p>
                                    </div>
                                )}
                            </div>
                        )}
                   </div>
                </div>
            </main>
        </div>
    );
}

function StatItem({ label, value, icon: Icon, color, highlight }: { label: string, value: string | number, icon: any, color: string, highlight?: boolean }) {
    return (
        <Card className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-xl group hover:border-white/10 transition-all">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-slate-950 rounded-lg shadow-inner">
                    <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
            </div>
            <p className="text-4xl font-black italic tracking-tighter text-white">
                {value}
            </p>
        </Card>
    );
}