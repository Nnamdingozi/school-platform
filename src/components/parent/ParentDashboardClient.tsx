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


// 'use client';

// import { useMemo, useState, useEffect } from 'react';
// import type { CSSProperties } from 'react';
// import { useProfileStore } from '@/store/profileStore';
// import { letterFromPercentage } from '@/lib/utils/formatters';
// import { 
//     AssessmentRecord, ChildProfile, 
//     SubjectProgress 
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

//     // ── Safe Data Extraction (Fixes the Null/Undefined Errors) ─────────────────
//     const primaryColor = initialProfile.school?.primaryColor ?? '#f59e0b';
//     const secondaryColor = initialProfile.school?.secondaryColor ?? '#1e293b';
//     const schoolName = initialProfile.school?.name ?? 'School';

//     // 3. Derived Data
//     const currentChild = useMemo(
//         () => childrenOfParent.find((c) => c.id === selectedChildId) ?? childrenOfParent[0],
//         [childrenOfParent, selectedChildId]
//     );

//     const currentSubjects = useMemo(
//         () => subjectsByChild[currentChild?.id ?? ''] ?? [],
//         [subjectsByChild, currentChild?.id]
//     );

//     const currentAssessments = useMemo(
//         () => assessmentsByChild[currentChild?.id ?? ''] ?? [],
//         [assessmentsByChild, currentChild?.id]
//     );

//     const currentNotifications = useMemo(
//         () => notificationsByChild[currentChild?.id ?? ''] ?? [],
//         [notificationsByChild, currentChild?.id]
//     );

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
//                 '--color-primary': primaryColor, 
//                 '--color-secondary': secondaryColor 
//             } as CSSProperties}
//         >
//             {/* --- Header --- */}
//             <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
//                 <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
//                     <div className="flex items-center gap-3">
//                         <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
//                             {schoolName.charAt(0)}
//                         </div>
//                         <div>
//                             <div className="text-sm text-slate-400">Parent Dashboard</div>
//                             <div className="font-semibold">{schoolName}</div>
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

//                     <div className="md:col-span-2 grid grid-cols-2 gap-4">
//                         <StatCard label="Subjects" value={overallStats.totalSubjects} />
//                         <StatCard label="Lessons" value={overallStats.lessonsAvailable} />
//                         <StatCard label="Avg Score" value={`${Math.round(overallStats.overallPct)}%`} />
//                         <StatCard label="Pending" value={overallStats.pendingAssessments} highlight />
//                     </div>
//                 </div>

//                 <div className="mt-12">
//                    <nav className="flex gap-8 border-b border-slate-800 mb-6">
//                         {(['overview', 'subjects', 'assessments'] as const).map((t) => (
//                             <button 
//                                 key={t} 
//                                 onClick={() => setTab(t)}
//                                 className={`pb-4 text-sm font-medium capitalize transition relative ${tab === t ? 'text-primary' : 'text-slate-500'}`}
//                             >
//                                 {t}
//                                 {tab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_var(--color-primary)]" />}
//                             </button>
//                         ))}
//                    </nav>

//                    {/* Render Content based on tab */}
//                    {tab === 'assessments' && (
//                        <div className="space-y-4">
//                            {currentAssessments.map(a => (
//                                <div key={a.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
//                                    <div>
//                                        <p className="font-bold">{a.subjectName}</p>
//                                        <p className="text-xs text-slate-500">{a.topicTitle}</p>
//                                    </div>
//                                    <div className="text-right">
//                                        <p className="text-lg font-bold">{a.pct}%</p>
//                                        <p className="text-[10px] text-slate-500">{letterFromPercentage(a.pct ?? 0)}</p>
//                                    </div>
//                                </div>
//                            ))}
//                            {currentAssessments.length === 0 && <p className="text-center text-slate-500 py-10">No assessments found.</p>}
//                        </div>
//                    )}
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


// 'use client';

// import { useMemo, useState, useEffect } from 'react';
// import { useProfileStore } from '@/store/profileStore';
// import { 
//     AssessmentRecord, ChildProfile, 
//     SubjectProgress 
// } from '@/types/parent-dashboard';
// import { Notification, Role } from '@prisma/client';
// import { Bell, GraduationCap, Layout, BookOpen, ShieldCheck, History, ChevronRight } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
// import { cn } from '@/lib/utils';

// // ── Types ───────────────────────────────────────────────────────────────────

// type ParentDashboardProps = {
//     initialProfile: any;
//     childrenOfParent: ChildProfile[];
//     subjectsByChild: Record<string, SubjectProgress[]>;
//     assessmentsByChild: Record<string, AssessmentRecord[]>;
//     notificationsByChild: Record<string, Notification[]>;
// };

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * PARENT PERFORMANCE CONSOLE (Tier 3)
//  * Rule 11: Real-time synchronization of child metrics.
//  * Rule 17: Styling via primaryColor from Zustand.
//  */
// export function ParentDashboardClient({
//     initialProfile,
//     childrenOfParent,
//     subjectsByChild,
//     assessmentsByChild,
//     notificationsByChild,
// }: ParentDashboardProps) {
//     // Rule 11 & 17: Sync Registry Identity
//     const setProfile = useProfileStore((state) => state.setProfile);
//     useEffect(() => {
//         if (initialProfile) setProfile(initialProfile);
//     }, [initialProfile, setProfile]);

//     const primaryColor = initialProfile.school?.primaryColor ?? '#f59e0b';
//     const schoolName = initialProfile.school?.name ?? 'Institutional Registry';

//     // State
//     const [selectedChildId, setSelectedChildId] = useState<string>(childrenOfParent[0]?.id ?? '');
//     const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'assessments'>('overview');

//     // Contextual Selectors
//     const currentChild = useMemo(
//         () => childrenOfParent.find((c) => c.id === selectedChildId) ?? childrenOfParent[0],
//         [childrenOfParent, selectedChildId]
//     );

//     const currentSubjects = useMemo(() => subjectsByChild[currentChild?.id ?? ''] ?? [], [subjectsByChild, currentChild?.id]);
//     const currentAssessments = useMemo(() => assessmentsByChild[currentChild?.id ?? ''] ?? [], [assessmentsByChild, currentChild?.id]);
//     const currentNotifications = useMemo(() => notificationsByChild[currentChild?.id ?? ''] ?? [], [notificationsByChild, currentChild?.id]);

//     const overallStats = useMemo(() => {
//         const allPcts = currentSubjects.flatMap(s => s.assessments.map(a => a.pct).filter((p): p is number => p != null));
//         const overallPct = allPcts.length > 0 ? allPcts.reduce((a, b) => a + b, 0) / allPcts.length : 0;
//         const lessonsCount = currentSubjects.reduce((acc, s) => acc + s.topics.filter(t => t.hasLesson).length, 0);

//         return { 
//             totalSubjects: currentSubjects.length, 
//             overallPct: Math.round(overallPct), 
//             lessonsAvailable: lessonsCount
//         };
//     }, [currentSubjects]);

//     return (
//         <div className="min-h-screen bg-slate-950 text-slate-50 font-sans pb-20">
            
//             {/* ── HEADER ── */}
//             <header className="border-b border-white/5 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
//                 <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
//                     <div className="flex items-center gap-4">
//                         <div 
//                             className="h-10 w-10 rounded-2xl flex items-center justify-center font-black text-slate-950 italic"
//                             style={{ backgroundColor: primaryColor }}
//                         >
//                             {schoolName.charAt(0)}
//                         </div>
//                         <div>
//                             <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">Parent Dashboard</p>
//                             <h2 className="text-lg font-black uppercase italic tracking-tighter text-white">{schoolName}</h2>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-6">
//                         <div className="hidden md:block text-right">
//                             <div className="text-sm font-black uppercase italic leading-none">{initialProfile.name}</div>
//                             <div className="text-[9px] text-slate-500 font-bold uppercase mt-1">Authorized Guardian</div>
//                         </div>
//                         <div className="relative p-2 rounded-xl bg-slate-950 border border-white/5">
//                             <Bell className="h-5 w-5 text-slate-600" />
//                             {currentNotifications.length > 0 && (
//                                 <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
//                                     {currentNotifications.length}
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <main className="mx-auto max-w-7xl px-6 py-10 space-y-10">
                
//                 {/* ── CHILD SWITCHER ── */}
//                 {childrenOfParent.length > 1 && (
//                     <div className="flex gap-2 bg-slate-900 p-1.5 rounded-2xl w-fit border border-white/5 shadow-inner">
//                         {childrenOfParent.map(child => (
//                             <button
//                                 key={child.id}
//                                 onClick={() => setSelectedChildId(child.id)}
//                                 className={cn(
//                                     "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
//                                     selectedChildId === child.id 
//                                     ? "bg-slate-950 text-white shadow-xl border border-white/5" 
//                                     : "text-slate-500 hover:text-white"
//                                 )}
//                             >
//                                 {child.name}
//                             </button>
//                         ))}
//                     </div>
//                 )}

//                 {/* ── PERFORMANCE GRID ── */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
//                     {/* Primary Profile Card */}
//                     <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
//                         <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
//                             <GraduationCap className="h-24 w-24 text-white" />
//                         </div>
                        
//                         <div className="relative h-40 w-40 flex items-center justify-center mb-6">
//                             <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
//                                 <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
//                                 <circle 
//                                     cx="50" cy="50" r="45" fill="none" 
//                                     stroke={primaryColor} strokeWidth="8" 
//                                     strokeDasharray="282.7" 
//                                     strokeDashoffset={282.7 - (282.7 * overallStats.overallPct) / 100}
//                                     strokeLinecap="round"
//                                     className="transition-all duration-1000 ease-out"
//                                 />
//                             </svg>
//                             <div className="absolute inset-0 flex flex-col items-center justify-center">
//                                 <span className="text-4xl font-black italic tracking-tighter">{overallStats.overallPct}%</span>
//                                 <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Aggregate</span>
//                             </div>
//                         </div>
//                         <h3 className="font-black text-2xl uppercase italic text-white leading-none">{currentChild?.name}</h3>
//                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">{currentChild?.grade} • {currentChild?.curriculum}</p>
//                     </Card>

//                     {/* Stats Module */}
//                     <div className="lg:col-span-2 grid grid-cols-2 gap-4">
//                         <StatItem label="Registered Modules" value={overallStats.totalSubjects} icon={BookOpen} color={primaryColor} />
//                         <StatItem label="Active Academic Nodes" value={overallStats.lessonsAvailable} icon={ShieldCheck} color={primaryColor} />
//                         <StatItem label="Current GPA Status" value={`${overallStats.overallPct}%`} icon={Layout} color={primaryColor} />
//                         <StatItem label="Unread Notifications" value={currentNotifications.length} icon={Bell} color="#ef4444" highlight />
//                     </div>
//                 </div>

//                 {/* ── TAB NAVIGATION ── */}
//                 <div className="space-y-6">
//                    <nav className="flex gap-10 border-b border-white/5 px-4">
//                         {(['overview', 'subjects', 'assessments'] as const).map((t) => (
//                             <button 
//                                 key={t} 
//                                 onClick={() => setActiveTab(t)}
//                                 className={cn(
//                                     "pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative",
//                                     activeTab === t ? "text-white" : "text-slate-600 hover:text-slate-400"
//                                 )}
//                             >
//                                 {t}
//                                 {activeTab === t && (
//                                     <div 
//                                         className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full shadow-lg" 
//                                         style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }} 
//                                     />
//                                 )}
//                             </button>
//                         ))}
//                    </nav>

//                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
//                         {activeTab === 'assessments' && (
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {currentAssessments.map(a => (
//                                     <Card key={a.id} className="bg-slate-900 border-white/5 p-6 rounded-[1.5rem] flex justify-between items-center hover:border-white/10 transition-all">
//                                         <div className="space-y-1">
//                                             <p className="font-black text-white uppercase italic text-sm">{a.subjectName}</p>
//                                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{a.topicTitle}</p>
//                                         </div>
//                                         <div className="text-right">
//                                             <p className="text-xl font-black italic leading-none" style={{ color: primaryColor }}>{a.pct}%</p>
//                                             <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">{new Date(a.createdAt).toLocaleDateString()}</p>
//                                         </div>
//                                     </Card>
//                                 ))}
//                                 {currentAssessments.length === 0 && (
//                                     <div className="col-span-full py-20 text-center opacity-30">
//                                         <History className="h-10 w-10 mx-auto mb-4" />
//                                         <p className="text-[10px] font-black uppercase tracking-widest">Performance ledger empty</p>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                    </div>
//                 </div>
//             </main>
//         </div>
//     );
// }

// function StatItem({ label, value, icon: Icon, color, highlight }: { label: string, value: string | number, icon: any, color: string, highlight?: boolean }) {
//     return (
//         <Card className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-xl group hover:border-white/10 transition-all">
//             <div className="flex items-center gap-4 mb-4">
//                 <div className="p-2 bg-slate-950 rounded-lg shadow-inner">
//                     <Icon className="h-4 w-4" style={{ color }} />
//                 </div>
//                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
//             </div>
//             <p className="text-4xl font-black italic tracking-tighter text-white">
//                 {value}
//             </p>
//         </Card>
//     );
// }




'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { 
    AssessmentRecord, ChildProfile, 
    SubjectProgress 
} from '@/types/parent-dashboard';
import { Notification } from '@prisma/client';
import { Bell, GraduationCap, Layout, BookOpen, ShieldCheck, History, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useSchool } from "@/context/schoolProvider";
import { cn } from '@/lib/utils';

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

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
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function ParentDashboardClient({
    initialProfile,
    childrenOfParent,
    subjectsByChild,
    assessmentsByChild,
    notificationsByChild,
}: ParentDashboardProps) {
    // Rule 11 & 17: Sync Registry Identity to Store
    const setProfile = useProfileStore((state) => state.setProfile);
    const { school } = useSchool();
    
    useEffect(() => {
        if (initialProfile) setProfile(initialProfile);
    }, [initialProfile, setProfile]);

    const schoolName = school?.name ?? initialProfile.school?.name ?? 'Institutional Registry';

    // Internal Terminal State
    const [selectedChildId, setSelectedChildId] = useState<string>(childrenOfParent[0]?.id ?? '');
    const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'assessments'>('overview');

    // Contextual Selectors (Rule 11 System Truth)
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
        <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700 pb-24">
            
            {/* ── HEADER (Rule 18/21) ── */}
            <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-school-primary flex items-center justify-center font-extrabold text-on-school-primary italic shadow-lg">
                            {schoolName.charAt(0)}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest leading-none">Parent Terminal</p>
                            <h2 className="text-base font-extrabold uppercase italic tracking-tighter text-foreground mt-1">{schoolName}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                            <div className="text-sm font-extrabold uppercase italic tracking-tight leading-none">{initialProfile.name}</div>
                            <div className="text-[9px] font-bold text-muted-foreground uppercase mt-1 tracking-widest">Authorized Guardian</div>
                        </div>
                        <div className="relative p-2.5 rounded-xl bg-surface border border-border shadow-sm group cursor-pointer hover:border-school-primary-200 transition-all">
                            <Bell className="h-5 w-5 text-muted-foreground group-hover:text-school-primary transition-colors" />
                            {currentNotifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-white text-[9px] font-extrabold rounded-full flex items-center justify-center animate-in zoom-in">
                                    {currentNotifications.length}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 md:px-8 py-10 space-y-12">
                
                {/* ── CHILD SWITCHER (Rule 19/21) ── */}
                {childrenOfParent.length > 1 && (
                    <div className="flex gap-2 bg-surface p-1.5 rounded-2xl w-fit border border-border shadow-inner">
                        {childrenOfParent.map(child => (
                            <button
                                key={child.id}
                                onClick={() => setSelectedChildId(child.id)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all",
                                    selectedChildId === child.id 
                                    ? "bg-school-primary text-on-school-primary shadow-lg" 
                                    : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {child.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── PERFORMANCE GRID (Rule 20) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Primary Identity Card (Rule 19/21) */}
                    <Card className="bg-card border-border rounded-[2rem] p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                            <GraduationCap className="h-32 w-32 text-foreground" />
                        </div>
                        
                        <div className="relative h-44 w-44 flex items-center justify-center mb-8">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                <circle cx="50" cy="50" r="44" fill="none" className="stroke-surface" strokeWidth="8" />
                                <circle 
                                    cx="50" cy="50" r="44" fill="none" 
                                    stroke="var(--school-primary)" strokeWidth="8" 
                                    strokeDasharray="276.5" 
                                    strokeDashoffset={276.5 - (276.5 * overallStats.overallPct) / 100}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out shadow-lg"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-extrabold italic tracking-tighter tabular-nums">{overallStats.overallPct}%</span>
                                <span className="text-[9px] font-bold uppercase text-muted-foreground tracking-[0.2em] mt-1">Aggregate</span>
                            </div>
                        </div>
                        <h3 className="font-extrabold text-2xl uppercase italic text-foreground leading-tight tracking-tighter">{currentChild?.name}</h3>
                        <div className="mt-3 flex items-center gap-2 px-4 py-1 rounded-full bg-surface border border-border shadow-sm">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{currentChild?.grade} hub</span>
                        </div>
                    </Card>

                    {/* Telemetry Module Grid */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <StatTile label="Registry Modules" value={overallStats.totalSubjects} icon={BookOpen} variant="primary" />
                        <StatTile label="Academic Hubs" value={overallStats.lessonsAvailable} icon={ShieldCheck} variant="primary" />
                        <StatTile label="Performance Index" value={`${overallStats.overallPct}%`} icon={Activity} variant="primary" />
                        <StatTile label="System Alerts" value={currentNotifications.length} icon={Bell} variant="destructive" />
                    </div>
                </div>

                {/* ── TAB NAVIGATION HUB (Rule 11) ── */}
                <div className="space-y-8 pt-4">
                   <nav className="flex gap-10 border-b border-border px-4 overflow-x-auto no-scrollbar">
                        {(['overview', 'subjects', 'assessments'] as const).map((t) => (
                            <button 
                                key={t} 
                                onClick={() => setActiveTab(t)}
                                className={cn(
                                    "pb-5 text-[10px] font-extrabold uppercase tracking-[0.3em] transition-all relative whitespace-nowrap",
                                    activeTab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {t}
                                {activeTab === t && (
                                    <div 
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-school-primary rounded-t-full shadow-[0_0_15px_rgba(var(--school-primary-raw),0.4)]" 
                                    />
                                )}
                            </button>
                        ))}
                   </nav>

                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === 'assessments' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentAssessments.length > 0 ? currentAssessments.map(a => (
                                    <Card key={a.id} className="bg-card border-border p-6 rounded-[1.5rem] flex justify-between items-center hover:border-school-primary-200 transition-all shadow-sm group">
                                        <div className="space-y-1.5 min-w-0">
                                            <p className="font-extrabold text-foreground uppercase italic text-sm truncate">{a.subjectName}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">{a.topicTitle}</p>
                                        </div>
                                        <div className="text-right pl-4">
                                            <p className="text-2xl font-extrabold italic leading-none text-school-primary tabular-nums tracking-tighter">{a.pct}%</p>
                                            <p className="text-[9px] text-muted-foreground font-bold uppercase mt-2 tracking-tighter opacity-60">
                                                {new Date(a.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                            </p>
                                        </div>
                                    </Card>
                                )) : (
                                    <div className="col-span-full py-24 text-center bg-surface/50 border-2 border-dashed border-border rounded-[2rem]">
                                        <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Performance ledger offline</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Other tab contents handled here */}
                   </div>
                </div>
            </main>
        </div>
    );
}

// ── Sub-Components ──────────────────────────────────────────────────────────

function StatTile({ label, value, icon: Icon, variant = 'primary' }: { label: string, value: string | number, icon: any, variant: 'primary' | 'destructive' }) {
    return (
        <Card className="bg-card border-border p-8 rounded-[2rem] shadow-xl group hover:border-school-primary-300 transition-all">
            <div className="flex items-center gap-5 mb-6">
                {/* Rule 21 Scale Protocol */}
                <div className={cn(
                    "p-3 rounded-2xl border shadow-inner transition-transform group-hover:scale-110",
                    variant === 'primary' ? "bg-school-primary-50 border-school-primary-200 text-school-primary" : "bg-destructive/10 border-destructive/20 text-destructive"
                )}>
                    <Icon className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
            </div>
            <p className="text-5xl font-extrabold italic tracking-tighter text-foreground tabular-nums">
                {value}
            </p>
        </Card>
    );
}