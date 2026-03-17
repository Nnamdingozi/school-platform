// 'use client';

// import { useMemo, useState, useEffect } from 'react';
// import type { CSSProperties } from 'react';
// import { useProfileStore } from '@/store/profileStore';
// import { letterFromPercentage } from '@/lib/utils/formatters';
// import { 
//     AssessmentRecord, ChildProfile, 
//     SubjectProgress, TopicStatus 
// } from '@/types/parent-dashboard';
// import { Notification } from '@prisma/client';
// import { BaseProfile } from '@/types/profile';


// type Props = {
//     initialProfile: BaseProfile;
//     childrenOfParent: ChildProfile[];
//     subjectsByChild: Record<string, SubjectProgress[]>;
//     assessmentsByChild: Record<string, AssessmentRecord[]>;
//     notificationsByChild: Record<string, Notification[]>;
// };

// export function ParentDashboardClient({
//     initialProfile,
//     childrenOfParent,
//     subjectsByChild,
//     assessmentsByChild,
//     notificationsByChild,
// }: Props) {
//     // 1. Sync with Zustand Store on mount
//     const setProfile = useProfileStore((state) => state.setProfile);
//     useEffect(() => {
//         if (initialProfile) setProfile(initialProfile);
//     }, [initialProfile, setProfile]);

//     // 2. Component State
//     const [selectedChildId, setSelectedChildId] = useState<string>(childrenOfParent[0]?.id ?? '');
//     const [tab, setTab] = useState<'overview' | 'subjects' | 'assessments'>('overview');
//     const [notificationsOpen, setNotificationsOpen] = useState(false);
//     const [expandedSubjectIds, setExpandedSubjectIds] = useState<Record<string, boolean>>({});

//     // 3. Derived Data
//     const currentChild = useMemo(
//         () => childrenOfParent.find((c) => c.id === selectedChildId) ?? childrenOfParent[0],
//         [childrenOfParent, selectedChildId]
//     );

//     const currentSubjects = subjectsByChild[currentChild?.id ?? ''] ?? [];
//     const currentAssessments = assessmentsByChild[currentChild?.id ?? ''] ?? [];
//     const currentNotifications = notificationsByChild[currentChild?.id ?? ''] ?? [];

//     const overallStats = useMemo(() => {
//         const allPcts = currentSubjects.flatMap(s => s.assessments.map(a => a.pct).filter((p): p is number => p != null));
//         const overallPct = allPcts.length > 0 ? allPcts.reduce((a, b) => a + b, 0) / allPcts.length : 0;
        
//         let pending = 0;
//         currentSubjects.forEach(s => s.topics.forEach(t => { if(t.hasLesson && !t.assessment) pending++ }));

//         return { 
//             totalSubjects: currentSubjects.length, 
//             overallPct, 
//             pendingAssessments: pending,
//             lessonsAvailable: currentSubjects.reduce((acc, s) => acc + s.topics.filter(t => t.hasLesson).length, 0)
//         };
//     }, [currentSubjects]);

//     // Helper: Progress Ring Calculation
//     const getStroke = (pct: number) => (2 * Math.PI * 18 * Math.min(Math.max(pct, 0), 100)) / 100;

//     return (
//         <div 
//             className="min-h-screen bg-slate-950 text-slate-50"
//             style={{ 
//                 '--color-primary': initialProfile.school.primaryColor, 
//                 '--color-secondary': initialProfile.school.secondaryColor 
//             } as CSSProperties}
//         >
//             {/* --- Header --- */}
//             <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
//                 <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
//                     <div className="flex items-center gap-3">
//                         <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
//                             {initialProfile.school.name.charAt(0)}
//                         </div>
//                         <div>
//                             <div className="text-sm text-slate-400">Parent Dashboard</div>
//                             <div className="font-semibold">{initialProfile.school.name}</div>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-4">
//                         <div className="hidden md:block text-right">
//                             <div className="text-sm font-medium">{initialProfile.name}</div>
//                             <div className="text-[10px] text-slate-500 uppercase">{initialProfile.role}</div>
//                         </div>
//                         <button 
//                             onClick={() => setNotificationsOpen(!notificationsOpen)}
//                             className="relative p-2 rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800 transition"
//                         >
//                             <BellIcon className="h-5 w-5" />
//                             {currentNotifications.length > 0 && (
//                                 <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center">
//                                     {currentNotifications.length}
//                                 </span>
//                             )}
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             <main className="mx-auto max-w-6xl px-4 py-8">
//                 {/* Child Switcher */}
//                 {childrenOfParent.length > 1 && (
//                     <div className="flex gap-2 mb-8 bg-slate-900/50 p-1 rounded-full w-fit border border-slate-800">
//                         {childrenOfParent.map(child => (
//                             <button
//                                 key={child.id}
//                                 onClick={() => setSelectedChildId(child.id)}
//                                 className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
//                                     selectedChildId === child.id 
//                                     ? 'bg-primary text-slate-950' 
//                                     : 'text-slate-400 hover:text-slate-200'
//                                 }`}
//                             >
//                                 {child.name}
//                             </button>
//                         ))}
//                     </div>
//                 )}

//                 {/* Dashboard Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     {/* Progress Circle Card */}
//                     <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
//                         <div className="relative h-32 w-32 mb-4">
//                             <svg viewBox="0 0 48 48" className="transform -rotate-90 w-32 h-32">
//                                 <circle cx="24" cy="24" r="18" fill="none" className="stroke-slate-800" strokeWidth="4" />
//                                 <circle cx="24" cy="24" r="18" fill="none" className="stroke-primary" strokeWidth="4" 
//                                     strokeDasharray="113.1" strokeDashoffset={113.1 - getStroke(overallStats.overallPct)} 
//                                     strokeLinecap="round"
//                                 />
//                             </svg>
//                             <div className="absolute inset-0 flex flex-col items-center justify-center">
//                                 <span className="text-2xl font-bold">{Math.round(overallStats.overallPct)}%</span>
//                                 <span className="text-xs text-slate-400">{letterFromPercentage(overallStats.overallPct)}</span>
//                             </div>
//                         </div>
//                         <h3 className="font-bold text-lg">{currentChild?.name}</h3>
//                         <p className="text-sm text-slate-500">{currentChild?.grade} • {currentChild?.termLabel}</p>
//                     </div>

//                     {/* Stats Grid */}
//                     <div className="md:col-span-2 grid grid-cols-2 gap-4">
//                         <StatCard label="Subjects" value={overallStats.totalSubjects} />
//                         <StatCard label="Lessons" value={overallStats.lessonsAvailable} />
//                         <StatCard label="Avg Score" value={`${Math.round(overallStats.overallPct)}%`} />
//                         <StatCard label="Pending" value={overallStats.pendingAssessments} highlight />
//                     </div>
//                 </div>

//                 {/* Tabs & Content Logic ... (Simplified for brevity, matches your existing tab code) */}
//                 <div className="mt-12">
//                    <nav className="flex gap-8 border-b border-slate-800 mb-6">
//                         {['overview', 'subjects', 'assessments'].map((t) => (
//                             <button 
//                                 key={t} 
//                                 onClick={() => setTab(t as any)}
//                                 className={`pb-4 text-sm font-medium capitalize transition relative ${tab === t ? 'text-primary' : 'text-slate-500'}`}
//                             >
//                                 {t}
//                                 {tab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_var(--color-primary)]" />}
//                             </button>
//                         ))}
//                    </nav>
//                    {/* Render Tab Content based on 'tab' state */}
//                 </div>
//             </main>
//         </div>
//     );
// }

// function StatCard({ label, value, highlight }: { label: string, value: string | number, highlight?: boolean }) {
//     return (
//         <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
//             <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">{label}</p>
//             <p className={`text-3xl font-bold ${highlight ? 'text-amber-400' : 'text-white'}`}>{value}</p>
//         </div>
//     );
// }

// function BellIcon({ className }: { className?: string }) {
//     return (
//         <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//         </svg>
//     );
// }


'use client';

import { useMemo, useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { letterFromPercentage } from '@/lib/utils/formatters';
import { 
    AssessmentRecord, ChildProfile, 
    SubjectProgress 
} from '@/types/parent-dashboard';
import { Notification } from '@prisma/client';
import { BaseProfile } from '@/types/profile';

type Props = {
    initialProfile: BaseProfile;
    childrenOfParent: ChildProfile[];
    subjectsByChild: Record<string, SubjectProgress[]>;
    assessmentsByChild: Record<string, AssessmentRecord[]>;
    notificationsByChild: Record<string, Notification[]>;
};

export function ParentDashboardClient({
    initialProfile,
    childrenOfParent,
    subjectsByChild,
    assessmentsByChild,
    notificationsByChild,
}: Props) {
    // 1. Sync with Zustand Store on mount
    const setProfile = useProfileStore((state) => state.setProfile);
    useEffect(() => {
        if (initialProfile) setProfile(initialProfile);
    }, [initialProfile, setProfile]);

    // 2. Component State
    const [selectedChildId, setSelectedChildId] = useState<string>(childrenOfParent[0]?.id ?? '');
    const [tab, setTab] = useState<'overview' | 'subjects' | 'assessments'>('overview');
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    // ── Safe Data Extraction (Fixes the Null/Undefined Errors) ─────────────────
    const primaryColor = initialProfile.school?.primaryColor ?? '#f59e0b';
    const secondaryColor = initialProfile.school?.secondaryColor ?? '#1e293b';
    const schoolName = initialProfile.school?.name ?? 'School';

    // 3. Derived Data
    const currentChild = useMemo(
        () => childrenOfParent.find((c) => c.id === selectedChildId) ?? childrenOfParent[0],
        [childrenOfParent, selectedChildId]
    );

    const currentSubjects = useMemo(
        () => subjectsByChild[currentChild?.id ?? ''] ?? [],
        [subjectsByChild, currentChild?.id]
    );

    const currentAssessments = useMemo(
        () => assessmentsByChild[currentChild?.id ?? ''] ?? [],
        [assessmentsByChild, currentChild?.id]
    );

    const currentNotifications = useMemo(
        () => notificationsByChild[currentChild?.id ?? ''] ?? [],
        [notificationsByChild, currentChild?.id]
    );

    const overallStats = useMemo(() => {
        const allPcts = currentSubjects.flatMap(s => s.assessments.map(a => a.pct).filter((p): p is number => p != null));
        const overallPct = allPcts.length > 0 ? allPcts.reduce((a, b) => a + b, 0) / allPcts.length : 0;
        
        let pending = 0;
        currentSubjects.forEach(s => s.topics.forEach(t => { if(t.hasLesson && !t.assessment) pending++ }));

        return { 
            totalSubjects: currentSubjects.length, 
            overallPct, 
            pendingAssessments: pending,
            lessonsAvailable: currentSubjects.reduce((acc, s) => acc + s.topics.filter(t => t.hasLesson).length, 0)
        };
    }, [currentSubjects]);

    // Helper: Progress Ring Calculation
    const getStroke = (pct: number) => (2 * Math.PI * 18 * Math.min(Math.max(pct, 0), 100)) / 100;

    return (
        <div 
            className="min-h-screen bg-slate-950 text-slate-50"
            style={{ 
                '--color-primary': primaryColor, 
                '--color-secondary': secondaryColor 
            } as CSSProperties}
        >
            {/* --- Header --- */}
            <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {schoolName.charAt(0)}
                        </div>
                        <div>
                            <div className="text-sm text-slate-400">Parent Dashboard</div>
                            <div className="font-semibold">{schoolName}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <div className="text-sm font-medium">{initialProfile.name}</div>
                            <div className="text-[10px] text-slate-500 uppercase">{initialProfile.role}</div>
                        </div>
                        <button 
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="relative p-2 rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800 transition"
                        >
                            <BellIcon className="h-5 w-5" />
                            {currentNotifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {currentNotifications.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8">
                {/* Child Switcher */}
                {childrenOfParent.length > 1 && (
                    <div className="flex gap-2 mb-8 bg-slate-900/50 p-1 rounded-full w-fit border border-slate-800">
                        {childrenOfParent.map(child => (
                            <button
                                key={child.id}
                                onClick={() => setSelectedChildId(child.id)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                                    selectedChildId === child.id 
                                    ? 'bg-primary text-slate-950' 
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                {child.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                        <div className="relative h-32 w-32 mb-4">
                            <svg viewBox="0 0 48 48" className="transform -rotate-90 w-32 h-32">
                                <circle cx="24" cy="24" r="18" fill="none" className="stroke-slate-800" strokeWidth="4" />
                                <circle cx="24" cy="24" r="18" fill="none" className="stroke-primary" strokeWidth="4" 
                                    strokeDasharray="113.1" strokeDashoffset={113.1 - getStroke(overallStats.overallPct)} 
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold">{Math.round(overallStats.overallPct)}%</span>
                                <span className="text-xs text-slate-400">{letterFromPercentage(overallStats.overallPct)}</span>
                            </div>
                        </div>
                        <h3 className="font-bold text-lg">{currentChild?.name}</h3>
                        <p className="text-sm text-slate-500">{currentChild?.grade} • {currentChild?.termLabel}</p>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        <StatCard label="Subjects" value={overallStats.totalSubjects} />
                        <StatCard label="Lessons" value={overallStats.lessonsAvailable} />
                        <StatCard label="Avg Score" value={`${Math.round(overallStats.overallPct)}%`} />
                        <StatCard label="Pending" value={overallStats.pendingAssessments} highlight />
                    </div>
                </div>

                <div className="mt-12">
                   <nav className="flex gap-8 border-b border-slate-800 mb-6">
                        {(['overview', 'subjects', 'assessments'] as const).map((t) => (
                            <button 
                                key={t} 
                                onClick={() => setTab(t)}
                                className={`pb-4 text-sm font-medium capitalize transition relative ${tab === t ? 'text-primary' : 'text-slate-500'}`}
                            >
                                {t}
                                {tab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_var(--color-primary)]" />}
                            </button>
                        ))}
                   </nav>

                   {/* Render Content based on tab */}
                   {tab === 'assessments' && (
                       <div className="space-y-4">
                           {currentAssessments.map(a => (
                               <div key={a.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
                                   <div>
                                       <p className="font-bold">{a.subjectName}</p>
                                       <p className="text-xs text-slate-500">{a.topicTitle}</p>
                                   </div>
                                   <div className="text-right">
                                       <p className="text-lg font-bold">{a.pct}%</p>
                                       <p className="text-[10px] text-slate-500">{letterFromPercentage(a.pct ?? 0)}</p>
                                   </div>
                               </div>
                           ))}
                           {currentAssessments.length === 0 && <p className="text-center text-slate-500 py-10">No assessments found.</p>}
                       </div>
                   )}
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, highlight }: { label: string, value: string | number, highlight?: boolean }) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">{label}</p>
            <p className={`text-3xl font-bold ${highlight ? 'text-amber-400' : 'text-white'}`}>{value}</p>
        </div>
    );
}

function BellIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    );
}