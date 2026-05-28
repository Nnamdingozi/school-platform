// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//     ArrowLeft, Users, Mail, Phone, BookOpen,
//     ClipboardCheck, Plus, Trash2, UserX,
//     AlertCircle, CheckCircle2, ShieldCheck
// } from 'lucide-react'
// import { Card, CardContent } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { toast } from "sonner"
// import { useProfileStore } from '@/store/profileStore'
// import { UserActionsModal } from '@/components/admin-dasboard/user-modal'
// import { AssignClassModal } from '@/components/admin-dasboard/user-detail-shared'
// import { useUserAction } from '@/hooks/useUserAction'
// import { type UserDetail, getUserById } from '@/app/actions/user-management'
// import { cn } from '@/lib/utils'

// interface StudentDetailClientProps {
//     initialUser: UserDetail;
// }

// /**
//  * INSTITUTIONAL STUDENT DETAIL (Tier 2)
//  * Rule 17: Pulls primary color from Zustand store.
//  * Rule 11: Derives performance from database truth.
//  */
// export function StudentDetailClient({ initialUser }: StudentDetailClientProps) {
//     const router = useRouter();
//     const { profile: actorProfile } = useProfileStore();
//     const [user, setUser] = useState<UserDetail>(initialUser);
//     const [showAssign, setShowAssign] = useState(false);
//     const { actionState, triggerAction, closeAction } = useUserAction();

//     const primaryColor = actorProfile?.primaryColor || "#f59e0b";

//     const initials = (user.name ?? user.email)
//         .split(' ')
//         .filter(Boolean)
//         .map(n => n[0])
//         .slice(0, 2)
//         .join('')
//         .toUpperCase();

//     const refreshData = async () => {
//         const updated = await getUserById(user.id, actorProfile?.schoolId ?? null);
//         if (updated) setUser(updated);
//     };

//     const handleActionSuccess = () => {
//         closeAction();
//         if (actionState?.action === 'delete') {
//             router.replace('/admin/students');
//         } else {
//             refreshData();
//         }
//     };

//     return (
//         <div className="min-h-screen bg-slate-950 p-4 md:p-8 lg:p-12 text-slate-50 animate-in fade-in duration-500">
//             <div className="max-w-5xl mx-auto space-y-10">
                
//                 <button
//                     onClick={() => router.back()}
//                     className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
//                 >
//                     <ArrowLeft className="h-3 w-3" /> Back to Registry
//                 </button>

//                 {/* ── HEADER CARD ── */}
//                 <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
//                     <CardContent className="p-8 md:p-10">
//                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
//                             <div className="flex items-center gap-6">
//                                 <div 
//                                     className="h-20 w-20 rounded-[2rem] border flex items-center justify-center text-2xl font-black italic shadow-inner"
//                                     style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30`, color: primaryColor }}
//                                 >
//                                     {initials}
//                                 </div>
//                                 <div className="space-y-1">
//                                     <div className="flex items-center gap-3">
//                                         <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
//                                             {user.name ?? 'Identity Pending'}
//                                         </h1>
//                                         <Badge className="font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-md" style={{ backgroundColor: primaryColor, color: '#000' }}>
//                                             Student
//                                         </Badge>
//                                     </div>
//                                     <div className="flex items-center gap-4 pt-2">
//                                         <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase">
//                                             <Mail className="h-3.5 w-3.5" style={{ color: primaryColor }} /> {user.email}
//                                         </div>
//                                         {user.phone && (
//                                             <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase">
//                                                 <Phone className="h-3.5 w-3.5" style={{ color: primaryColor }} /> {user.phone}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="flex items-center gap-3 w-full md:w-auto">
//                                 <button
//                                     onClick={() => setShowAssign(true)}
//                                     className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all border border-white/5"
//                                 >
//                                     <Plus className="h-4 w-4 inline mr-2" style={{ color: primaryColor }} /> Placement
//                                 </button>
//                                 <button
//                                     onClick={() => triggerAction('deactivate', user.id, user.name, user.email)}
//                                     className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-slate-800 text-amber-400 text-[10px] font-black uppercase tracking-widest hover:bg-amber-400/10 transition-all border border-amber-400/20"
//                                 >
//                                     <UserX className="h-4 w-4 inline mr-2" /> Deactivate
//                                 </button>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//                     <div className="lg:col-span-2 space-y-10">
                        
//                         {/* ── ROOM PLACEMENT ── */}
//                         <section className="space-y-4">
//                             <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white px-2">Institutional Placement</h3>
//                             {user.assignedClasses.length === 0 ? (
//                                 <Card className="bg-slate-900 border-white/5 border-dashed rounded-[2rem] p-12 text-center">
//                                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">Not yet assigned to a physical classroom registry.</p>
//                                 </Card>
//                             ) : (
//                                 <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
//                                     {user.assignedClasses.map(c => (
//                                         <Card key={c.id} className="bg-slate-900 border-white/5 p-6 rounded-3xl flex items-center gap-4 hover:border-white/10 transition-all">
//                                             <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5">
//                                                 <BookOpen className="h-5 w-5" style={{ color: primaryColor }} />
//                                             </div>
//                                             <div className="min-w-0">
//                                                 <p className="text-sm font-black text-white uppercase italic truncate">{c.name}</p>
//                                                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{c.grade.displayName}</p>
//                                             </div>
//                                         </Card>
//                                     ))}
//                                 </div>
//                             )}
//                         </section>

//                         {/* ── ACADEMIC LOAD ── */}
//                         <section className="space-y-4">
//                             <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white px-2">Modular Allocation</h3>
//                             {user.allocatedSubjects.length === 0 ? (
//                                 <Card className="bg-slate-900 border-white/5 border-dashed rounded-[2rem] p-12 text-center">
//                                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">No academic subjects currently mapped.</p>
//                                 </Card>
//                             ) : (
//                                 <div className="flex flex-wrap gap-2">
//                                     {user.allocatedSubjects.map(sub => (
//                                         <Badge key={sub.id} variant="outline" className="px-4 py-2 rounded-xl bg-slate-950 border-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest">
//                                             {sub.name}
//                                         </Badge>
//                                     ))}
//                                 </div>
//                             )}
//                         </section>

//                         {/* ── PERFORMANCE ── */}
//                         <section className="space-y-4">
//                             <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white px-2">Proficiency Telemetry</h3>
//                             {user.assessments.length === 0 ? (
//                                 <Card className="bg-slate-900 border-white/5 border-dashed rounded-[2rem] p-12 text-center">
//                                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">No assessment history recorded in this registry.</p>
//                                 </Card>
//                             ) : (
//                                 <div className="space-y-3">
//                                     {user.assessments.map(a => {
//                                         const pct = a.maxScore && a.score !== null ? Math.round((a.score / a.maxScore) * 100) : 0;
//                                         return (
//                                             <Card key={a.id} className="bg-slate-900 border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all group">
//                                                 <div className="flex items-center justify-between">
//                                                     <div>
//                                                         <p className="text-sm font-black text-white uppercase italic group-hover:text-school-primary transition-colors" style={{ color: pct >= 50 ? '#fff' : '#ef4444' }}>
//                                                             {a.subject}
//                                                         </p>
//                                                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
//                                                             {a.type.replace('_', ' ')} • {new Date(a.createdAt).toLocaleDateString()}
//                                                         </p>
//                                                     </div>
//                                                     <div className="text-right">
//                                                         <p className="text-lg font-black text-white">{a.score}/{a.maxScore}</p>
//                                                         <p className="text-[10px] font-bold uppercase" style={{ color: primaryColor }}>{pct}% Proficiency</p>
//                                                     </div>
//                                                 </div>
//                                             </Card>
//                                         )
//                                     })}
//                                 </div>
//                             )}
//                         </section>
//                     </div>

//                     {/* ── SIDEBAR ── */}
//                     <div className="space-y-8">
//                         <div className="p-8 rounded-[2rem] bg-slate-900 border border-white/5 space-y-4 shadow-xl">
//                             <div className="flex items-center gap-3" style={{ color: primaryColor }}>
//                                 <ShieldCheck className="h-4 w-4" />
//                                 <span className="text-[10px] font-black uppercase tracking-widest">Privacy Protocol</span>
//                             </div>
//                             <p className="text-[11px] text-slate-500 leading-relaxed italic uppercase font-bold">
//                                 Student data is restricted to the assigned institution. Records are synchronized with the Parent Dashboard and real-time automated reports.
//                             </p>
//                         </div>
//                         <button
//                             onClick={() => triggerAction('delete', user.id, user.name, user.email)}
//                             className="w-full py-5 rounded-2xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
//                         >
//                             <Trash2 className="h-4 w-4 inline mr-2" /> Delete Registry Identity
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* ── MODALS ── */}
//             {showAssign && (
//                 <AssignClassModal 
//                     userId={user.id} 
//                     schoolId={user.schoolId!} 
//                     role="STUDENT" 
//                     onClose={() => setShowAssign(false)}
//                     onSuccess={() => { setShowAssign(false); refreshData(); toast.success('Institutional placement updated.'); }}
//                 />
//             )}
//             {actionState && (
//                 <UserActionsModal
//                     userId={actionState.userId}
//                     userName={actionState.userName}
//                     userEmail={actionState.userEmail}
//                     action={actionState.action}
//                     onClose={closeAction}
//                     onSuccess={handleActionSuccess}
//                 />
//             )}
//         </div>
//     );
// }




// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//     ArrowLeft, Mail, Phone, BookOpen,
//     ClipboardCheck, Plus, Trash2, UserX,
//     ShieldCheck, History, CheckCircle2
// } from 'lucide-react'
// import { Card, CardContent } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { toast } from "sonner"
// import { useProfileStore } from '@/store/profileStore'
// import { UserActionsModal } from '@/components/admin-dasboard/user-modal'
// import { AssignClassModal } from '@/components/admin-dasboard/user-detail-shared'
// import { useUserAction } from '@/hooks/useUserAction'
// import { type UserDetail, getUserById } from '@/app/actions/user-management'
// import { cn } from '@/lib/utils'
// import {Section} from "@/components/admin-dasboard/user-detail-shared"
// import {EmptySection} from "@/components/admin-dasboard/user-detail-shared"

// interface StudentDetailClientProps {
//     initialUser: UserDetail;
// }

// export function StudentDetailClient({ initialUser }: StudentDetailClientProps) {
//     const router = useRouter();
//     const { profile: actorProfile } = useProfileStore();
//     const [user, setUser] = useState<UserDetail>(initialUser);
//     const [showAssign, setShowAssign] = useState(false);
//     const { actionState, triggerAction, closeAction } = useUserAction();

//     const primaryColor = actorProfile?.primaryColor || "#f59e0b";

//     const initials = (user.name ?? user.email)
//         .split(' ')
//         .filter(Boolean)
//         .map(n => n[0])
//         .slice(0, 2)
//         .join('')
//         .toUpperCase();

//     const refreshData = async () => {
//         const updated = await getUserById(user.id, actorProfile?.schoolId ?? null);
//         if (updated) setUser(updated);
//     };

//     const handleActionSuccess = () => {
//         closeAction();
//         if (actionState?.action === 'delete') {
//             router.replace('/admin/students');
//         } else {
//             refreshData();
//         }
//     };

//     return (
//         <div className="min-h-screen bg-slate-950 p-4 md:p-8 lg:p-12 text-slate-50 animate-in fade-in duration-500">
//             <div className="max-w-5xl mx-auto space-y-10">
                
//                 <button
//                     onClick={() => router.back()}
//                     className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
//                 >
//                     <ArrowLeft className="h-3 w-3" /> Back to Registry
//                 </button>

//                 {/* ── HEADER CARD ── */}
//                 <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
//                     <CardContent className="p-8 md:p-10">
//                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
//                             <div className="flex items-center gap-6">
//                                 <div 
//                                     className="h-20 w-20 rounded-[2rem] border flex items-center justify-center text-2xl font-black italic shadow-inner"
//                                     style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30`, color: primaryColor }}
//                                 >
//                                     {initials}
//                                 </div>
//                                 <div className="space-y-1">
//                                     <div className="flex items-center gap-3">
//                                         <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
//                                             {user.name ?? 'Identity Pending'}
//                                         </h1>
//                                         <Badge className="font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-md" style={{ backgroundColor: primaryColor, color: '#000' }}>
//                                             Student
//                                         </Badge>
//                                     </div>
//                                     <div className="flex items-center gap-4 pt-2">
//                                         <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase">
//                                             <Mail className="h-3.5 w-3.5" style={{ color: primaryColor }} /> {user.email}
//                                         </div>
//                                         {user.phone && (
//                                             <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase">
//                                                 <Phone className="h-3.5 w-3.5" style={{ color: primaryColor }} /> {user.phone}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="flex items-center gap-3 w-full md:w-auto">
//                                 <button
//                                     onClick={() => setShowAssign(true)}
//                                     className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest border border-white/5 hover:brightness-110 transition-all"
//                                 >
//                                     <Plus className="h-4 w-4 inline mr-2" style={{ color: primaryColor }} /> Placement
//                                 </button>
//                                 <button
//                                     onClick={() => triggerAction('deactivate', user.id, user.name, user.email)}
//                                     className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-slate-800 text-amber-400 text-[10px] font-black uppercase tracking-widest hover:bg-amber-400/10 transition-all border border-amber-400/20"
//                                 >
//                                     <UserX className="h-4 w-4 inline mr-2" /> Deactivate
//                                 </button>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//                     <div className="lg:col-span-2 space-y-10">
                        
//                         {/* ── PLACEMENT ── */}
//                         <Section title="Institutional Placement" icon={BookOpen}>
//                             {user.assignedClasses.length === 0 ? (
//                                 <EmptySection message="Not yet assigned to a physical classroom registry." />
//                             ) : (
//                                 <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
//                                     {user.assignedClasses.map(c => (
//                                         <Card key={c.id} className="bg-slate-900 border-white/5 p-6 rounded-3xl flex items-center gap-4 hover:border-white/10 transition-all">
//                                             <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5">
//                                                 <BookOpen className="h-5 w-5" style={{ color: primaryColor }} />
//                                             </div>
//                                             <div className="min-w-0">
//                                                 <p className="text-sm font-black text-white uppercase italic truncate">{c.name}</p>
//                                                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{c.grade.displayName}</p>
//                                             </div>
//                                         </Card>
//                                     ))}
//                                 </div>
//                             )}
//                         </Section>

//                         {/* ── ACADEMIC LOAD ── */}
//                         <Section title="Modular Allocation" icon={CheckCircle2}>
//                             {user.allocatedSubjects.length === 0 ? (
//                                 <EmptySection message="No academic subjects currently mapped." />
//                             ) : (
//                                 <div className="flex flex-wrap gap-2">
//                                     {user.allocatedSubjects.map(sub => (
//                                         <Badge key={sub.id} variant="outline" className="px-4 py-2 rounded-xl bg-slate-950 border-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest">
//                                             {sub.name}
//                                         </Badge>
//                                     ))}
//                                 </div>
//                             )}
//                         </Section>

//                         {/* ── PERFORMANCE ── */}
//                         <Section title="Proficiency Telemetry" icon={ClipboardCheck}>
//                             {user.assessments.length === 0 ? (
//                                 <EmptySection message="No assessment history recorded in this registry." />
//                             ) : (
//                                 <div className="space-y-3">
//                                     {user.assessments.map(a => {
//                                         const pct = a.maxScore && a.score !== null ? Math.round((a.score / a.maxScore) * 100) : 0;
//                                         return (
//                                             <Card key={a.id} className="bg-slate-900 border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all group">
//                                                 <div className="flex items-center justify-between">
//                                                     <div>
//                                                         <p className="text-sm font-black text-white uppercase italic group-hover:text-school-primary transition-colors">
//                                                             {a.subject}
//                                                         </p>
//                                                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
//                                                             {a.type.replace('_', ' ')} • {new Date(a.createdAt).toLocaleDateString()}
//                                                         </p>
//                                                     </div>
//                                                     <div className="text-right">
//                                                         <p className="text-lg font-black text-white">{a.score}/{a.maxScore}</p>
//                                                         <p className="text-[10px] font-bold uppercase" style={{ color: primaryColor }}>{pct}% Proficiency</p>
//                                                     </div>
//                                                 </div>
//                                             </Card>
//                                         )
//                                     })}
//                                 </div>
//                             )}
//                         </Section>
//                     </div>

//                     {/* ── SIDEBAR ── */}
//                     <div className="space-y-8">
//                         <div className="p-8 rounded-[2rem] bg-slate-900 border border-white/5 space-y-4 shadow-xl">
//                             <div className="flex items-center gap-3" style={{ color: primaryColor }}>
//                                 <ShieldCheck className="h-4 w-4" />
//                                 <span className="text-[10px] font-black uppercase tracking-widest">Privacy Protocol</span>
//                             </div>
//                             <p className="text-[11px] text-slate-500 leading-relaxed italic uppercase font-bold">
//                                 Student data is restricted to the assigned institution. Records are synchronized with real-time automated reports.
//                             </p>
//                         </div>

//                         <Section title="Communication" icon={History}>
//                             <div className="space-y-3">
//                                 {user.notifications.length === 0 ? (
//                                     <p className="text-[10px] text-slate-700 italic uppercase py-4">Registry ledger empty</p>
//                                 ) : (
//                                     user.notifications.slice(0, 3).map(n => (
//                                         <div key={n.id} className="p-4 rounded-2xl bg-slate-950 border border-white/5">
//                                             <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">{n.message}</p>
//                                             <p className="text-[9px] text-slate-600 font-bold uppercase mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
//                                         </div>
//                                     ))
//                                 )}
//                             </div>
//                         </Section>

//                         <button
//                             onClick={() => triggerAction('delete', user.id, user.name, user.email)}
//                             className="w-full py-5 rounded-2xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
//                         >
//                             <Trash2 className="h-4 w-4 inline mr-2" /> Purge Registry Identity
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* ── MODALS ── */}
//             {showAssign && (
//                 <AssignClassModal 
//                     userId={user.id} 
//                     schoolId={user.schoolId!} 
//                     role="STUDENT" 
//                     onClose={() => setShowAssign(false)}
//                     onSuccess={() => { setShowAssign(false); refreshData(); toast.success('Institutional placement updated.'); }}
//                 />
//             )}
//             {actionState && (
//                 <UserActionsModal
//                     userId={actionState.userId}
//                     userName={actionState.userName}
//                     userEmail={actionState.userEmail}
//                     action={actionState.action}
//                     onClose={closeAction}
//                     onSuccess={handleActionSuccess}
//                 />
//             )}
//         </div>
//     );
// }


// 'use client'

// import React, { useState, useEffect } from 'react'
// import { Card, CardContent } from '@/components/ui/card'
// import { 
//     LucideIcon, Loader2, X, BookOpen, 
//     CheckCircle2, AlertTriangle, ShieldCheck 
// } from 'lucide-react'
// import { useProfileStore } from '@/store/profileStore'
// import { getClassesBySchool, assignUserToClass, assignTeacherToClass } from '@/app/actions/user-management'
// import { cn } from '@/lib/utils'
// import { Role } from '@prisma/client'

// // ── Types ──────────────────────────────────────────────────────────────────────

// interface SectionProps {
//     title: string
//     icon: LucideIcon
//     children: React.ReactNode
// }

// interface AssignClassModalProps {
//     userId:    string
//     schoolId:  string
//     role:      Role
//     onClose:   () => void
//     onSuccess: () => void
// }

// interface ConfirmModalProps {
//     title:        string
//     description:  string
//     confirmLabel: string
//     danger?:      boolean
//     loading:      boolean
//     onConfirm:    () => void
//     onCancel:     () => void
// }

// // ── 1. Shared Section Wrapper ──────────────────────────────────────────────────

// export function Section({ title, icon: Icon, children }: SectionProps) {
//     const { profile } = useProfileStore();
//     const primaryColor = profile?.primaryColor || "#f59e0b";

//     return (
//         <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
//             <div className="flex items-center gap-3 px-2">
//                 <div className="p-2 rounded-lg bg-slate-900 border border-white/5 shadow-inner">
//                     <Icon className="h-4 w-4" style={{ color: primaryColor }} />
//                 </div>
//                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white italic">
//                     {title}
//                 </h3>
//             </div>
//             {children}
//         </section>
//     )
// }

// // ── 2. Shared Empty State ──────────────────────────────────────────────────────

// export function EmptySection({ message }: { message: string }) {
//     return (
//         <Card className="bg-slate-900 border-white/5 border-dashed rounded-[2.5rem] p-12 text-center shadow-2xl">
//             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic leading-relaxed">
//                 {message}
//             </p>
//         </Card>
//     )
// }

// // ── 3. Shared Detail Skeleton ──────────────────────────────────────────────────

// export function DetailSkeleton() {
//     return (
//         <div className="min-h-screen bg-slate-950 p-4 md:p-8 lg:p-12 space-y-10">
//             <div className="h-4 w-32 bg-slate-900 rounded-lg animate-pulse" />
//             <div className="h-48 bg-slate-900 border border-white/5 rounded-[2.5rem] animate-pulse" />
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//                 <div className="lg:col-span-2 space-y-10">
//                     <div className="h-64 bg-slate-900 border border-white/5 rounded-[2.5rem] animate-pulse" />
//                     <div className="h-64 bg-slate-900 border border-white/5 rounded-[2.5rem] animate-pulse" />
//                 </div>
//                 <div className="space-y-8">
//                     <div className="h-80 bg-slate-900 border border-white/5 rounded-[2.5rem] animate-pulse" />
//                 </div>
//             </div>
//         </div>
//     )
// }

// // ── 4. Assign Class Modal ──────────────────────────────────────────────────────

// /**
//  * INSTITUTIONAL PLACEMENT MODAL
//  * Rule 17: Branding from Zustand.
//  * Rule 5: Fetches classes only for the specific school registry.
//  */
// export function AssignClassModal({ userId, schoolId, role, onClose, onSuccess }: AssignClassModalProps) {
//     const { profile } = useProfileStore();
//     const primaryColor = profile?.primaryColor || "#f59e0b";
    
//     const [classes, setClasses] = useState<{ id: string; name: string; grade: { displayName: string } }[]>([])
//     const [selected, setSelected] = useState('')
//     const [loading, setLoading] = useState(true)
//     const [assigning, setAssigning] = useState(false)

//     useEffect(() => {
//         // Rule 5: Isolated Institutional Fetch
//         getClassesBySchool(schoolId).then(data => {
//             setClasses(data);
//             setLoading(false);
//         });
//     }, [schoolId]);

//     async function handleAssign() {
//         if (!selected) return;
//         setAssigning(true);
        
//         // Rule 11: System Truth Update based on role
//         const result = role === Role.TEACHER
//             ? await assignTeacherToClass(userId, selected)
//             : await assignUserToClass(userId, selected);

//         if (result.success) {
//             onSuccess();
//         } else {
//             setAssigning(false);
//         }
//     }

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
//             <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
//                 <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-950/50">
//                     <div className="flex items-center gap-3">
//                         <ShieldCheck className="h-5 w-5 text-school-primary" style={{ color: primaryColor }} />
//                         <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Registry Placement</h3>
//                     </div>
//                     <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
//                         <X className="h-5 w-5" />
//                     </button>
//                 </div>

//                 <div className="p-8 space-y-4">
//                     {loading ? (
//                         <div className="flex justify-center py-10">
//                             <Loader2 className="h-6 w-6 animate-spin" style={{ color: primaryColor }} />
//                         </div>
//                     ) : classes.length === 0 ? (
//                         <p className="text-[10px] font-black text-slate-600 uppercase text-center py-8">No classrooms discovered in registry.</p>
//                     ) : (
//                         <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
//                             {classes.map(c => (
//                                 <button
//                                     key={c.id}
//                                     onClick={() => setSelected(c.id)}
//                                     className={cn(
//                                         "w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all",
//                                         selected === c.id ? "bg-slate-800 border-white/20 shadow-lg" : "bg-slate-950 border-white/5 text-slate-500 hover:border-white/10"
//                                     )}
//                                 >
//                                     <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: selected === c.id ? `${primaryColor}20` : '#1e293b' }}>
//                                         {selected === c.id ? <CheckCircle2 className="h-4 w-4" style={{ color: primaryColor }} /> : <BookOpen className="h-4 w-4" />}
//                                     </div>
//                                     <div className="min-w-0">
//                                         <p className="text-sm font-bold text-white uppercase italic truncate">{c.name}</p>
//                                         <p className="text-[9px] font-bold uppercase tracking-widest">{c.grade.displayName}</p>
//                                     </div>
//                                 </button>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 <div className="p-8 pt-0">
//                     <button
//                         onClick={handleAssign}
//                         disabled={!selected || assigning}
//                         className="w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-30 shadow-xl"
//                         style={{ backgroundColor: primaryColor, color: '#000' }}
//                     >
//                         {assigning ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Commit Placement"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// // ── 5. Confirm Modal ───────────────────────────────────────────────────────────

// export function ConfirmModal({ title, description, confirmLabel, danger, loading, onConfirm, onCancel }: ConfirmModalProps) {
//     const { profile } = useProfileStore();
//     const primaryColor = profile?.primaryColor || "#f59e0b";

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
//             <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl p-8 space-y-6">
//                 <div className="flex items-center gap-3">
//                     <AlertTriangle className={cn("h-6 w-6", danger ? "text-red-500" : "text-amber-500")} />
//                     <h3 className="font-black text-white text-lg uppercase italic tracking-tighter">{title}</h3>
//                 </div>
//                 <p className="text-xs text-slate-400 leading-relaxed font-medium italic">{description}</p>
//                 <div className="flex gap-3 pt-4">
//                     <button onClick={onCancel} disabled={loading} className="flex-1 py-4 rounded-xl border border-white/5 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">
//                         Cancel
//                     </button>
//                     <button
//                         onClick={onConfirm}
//                         disabled={loading}
//                         className="flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-xl"
//                         style={{ backgroundColor: danger ? '#ef4444' : primaryColor, color: '#000' }}
//                     >
//                         {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : confirmLabel}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }



'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { 
    LucideIcon, Loader2, X, BookOpen, 
    CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight 
} from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { getClassesBySchool, assignUserToClass, assignTeacherToClass } from '@/app/actions/user-management'
import { cn } from '@/lib/utils'
import { Role } from '@prisma/client'

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface SectionProps {
    title: string
    icon: LucideIcon
    children: React.ReactNode
}

interface AssignClassModalProps {
    userId:    string
    schoolId:  string
    role:      Role
    onClose:   () => void
    onSuccess: () => void
}

interface ConfirmModalProps {
    title:        string
    description:  string
    confirmLabel: string
    danger?:      boolean
    loading:      boolean
    onConfirm:    () => void
    onCancel:     () => void
}

// ── 1. Shared Section Wrapper (Rule 18) ──────────────────────────────────────

export function Section({ title, icon: Icon, children }: SectionProps) {
    return (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-3 px-2">
                {/* Rule 19: Item Radius Standardized */}
                <div className="p-2.5 rounded-xl bg-surface border border-border shadow-inner">
                    <Icon className="h-4 w-4 text-school-primary" />
                </div>
                {/* Rule 11: Header scaling */}
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-foreground italic">
                    {title}
                </h3>
            </div>
            {children}
        </section>
    )
}

// ── 2. Shared Empty State (Rule 19) ──────────────────────────────────────────

export function EmptySection({ message }: { message: string }) {
    return (
        <Card className="bg-card/40 border-border border-dashed border-2 rounded-[2rem] p-12 text-center shadow-sm">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest italic leading-relaxed">
                {message}
            </p>
        </Card>
    )
}

// ── 3. Shared Detail Skeleton (Rule 20) ──────────────────────────────────────

export function DetailSkeleton() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-8 lg:p-12 space-y-10">
            <div className="h-6 w-32 bg-surface rounded-full animate-pulse" />
            <div className="h-48 bg-card border border-border rounded-[2rem] animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <div className="h-72 bg-card border border-border rounded-[2rem] animate-pulse" />
                    <div className="h-72 bg-card border border-border rounded-[2rem] animate-pulse" />
                </div>
                <div className="space-y-8">
                    <div className="h-96 bg-card border border-border rounded-[2rem] animate-pulse" />
                </div>
            </div>
        </div>
    )
}

// ── 4. Assign Class Modal (Rule 18 & 19) ──────────────────────────────────────

/**
 * INSTITUTIONAL PLACEMENT MODAL
 * Rule 11: High-fidelity Typography.
 * Rule 18: Semantic Flip (Purged hardcoded Slates).
 * Rule 19: Standardized Geometry [2rem].
 */
export function AssignClassModal({ userId, schoolId, role, onClose, onSuccess }: AssignClassModalProps) {
    const [classes, setClasses] = useState<{ id: string; name: string; grade: { displayName: string } }[]>([])
    const [selected, setSelected] = useState('')
    const [loading, setLoading] = useState(true)
    const [assigning, setAssigning] = useState(false)

    useEffect(() => {
        // Rule 5: Isolated Institutional Fetch
        getClassesBySchool(schoolId).then(data => {
            setClasses(data);
            setLoading(false);
        });
    }, [schoolId]);

    async function handleAssign() {
        if (!selected) return;
        setAssigning(true);
        
        const result = role === Role.TEACHER
            ? await assignTeacherToClass(userId, selected)
            : await assignUserToClass(userId, selected);

        if (result.success) {
            onSuccess();
        } else {
            setAssigning(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-card border border-border rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 md:p-8 border-b border-border flex items-center justify-between bg-surface/50">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-school-primary" />
                        <h3 className="text-lg font-extrabold text-foreground uppercase italic tracking-tighter">Registry Placement</h3>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 md:p-8 space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-7 w-7 animate-spin text-school-primary" />
                        </div>
                    ) : classes.length === 0 ? (
                        <p className="text-[10px] font-bold text-muted-foreground uppercase text-center py-8 italic tracking-widest">No classrooms discovered in registry.</p>
                    ) : (
                        <div className="space-y-3 max-h-72 overflow-y-auto no-scrollbar py-2">
                            {classes.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setSelected(c.id)}
                                    className={cn(
                                        "w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all",
                                        selected === c.id 
                                            ? "bg-school-primary-100 border-school-primary/40 shadow-inner" 
                                            : "bg-surface border-border text-muted-foreground hover:border-school-primary/20"
                                    )}
                                >
                                    <div className={cn(
                                        "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                                        selected === c.id ? "bg-school-primary text-on-school-primary" : "bg-background border border-border"
                                    )}>
                                        {selected === c.id ? <CheckCircle2 className="h-5 w-5" /> : <BookOpen className="h-4 w-4 opacity-40" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className={cn(
                                            "text-sm font-bold uppercase italic truncate leading-tight",
                                            selected === c.id ? "text-foreground" : "text-muted-foreground"
                                        )}>
                                            {c.name}
                                        </p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">{c.grade.displayName}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 md:p-8 pt-0">
                    <button
                        onClick={handleAssign}
                        disabled={!selected || assigning}
                        className="w-full py-5 rounded-2xl bg-school-primary text-on-school-primary font-extrabold text-[10px] uppercase tracking-widest transition-all disabled:opacity-20 shadow-xl active:scale-95"
                    >
                        {assigning ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Commit Placement"}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── 5. Confirm Modal (Rule 18 & 19) ──────────────────────────────────────────

export function ConfirmModal({ title, description, confirmLabel, danger, loading, onConfirm, onCancel }: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-card border border-border rounded-[2rem] shadow-2xl p-8 md:p-10 space-y-8 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center border",
                        danger ? "bg-destructive/10 border-destructive/20" : "bg-amber-500/10 border-amber-500/20"
                    )}>
                        <AlertTriangle className={cn("h-6 w-6", danger ? "text-destructive" : "text-amber-500")} />
                    </div>
                    <h3 className="font-extrabold text-foreground text-xl uppercase italic tracking-tighter leading-none">{title}</h3>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-foreground leading-relaxed font-medium italic">{description}</p>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">Action requires re-validation.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button 
                        onClick={onCancel} 
                        disabled={loading} 
                        className="flex-1 py-4 rounded-xl text-muted-foreground hover:bg-surface text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={cn(
                            "flex-1 py-4 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-20",
                            danger ? "bg-destructive text-white" : "bg-school-primary text-on-school-primary"
                        )}
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}