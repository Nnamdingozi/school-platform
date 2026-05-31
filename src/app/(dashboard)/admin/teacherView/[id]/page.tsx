// 'use client'

// import { useState, useEffect } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import { Section, AssignClassModal, ConfirmModal} from '@/components/admin-dasboard/user-detail-shared'
// import {
//     getUserById, getClassesBySchool, assignTeacherToClass,
//     deactivateUser, reactivateUser, deleteUser, UserDetail
// } from '@/app/actions/user-management'
// import {
//     ArrowLeft, GraduationCap, Mail, Phone, BookOpen,
//     Bell, ClipboardCheck, Plus, Trash2, UserX, UserCheck,
//     Loader2, AlertCircle, X, CheckCircle2,
// } from 'lucide-react'
// import { Card, CardContent } from '@/components/ui/card'
// import { toast } from 'sonner'
// import { DetailSkeleton, EmptySection } from '@/components/admin-dasboard/user-detail-shared'

// export default function TeacherDetailPage() {
//     const { id }  = useParams<{ id: string }>()
//     const router  = useRouter()

//     const [user,        setUser]        = useState<UserDetail | null>(null)
//     const [loading,     setLoading]     = useState(true)
//     const [showAssign,  setShowAssign]  = useState(false)
//     const [showDelete,  setShowDelete]  = useState(false)
//     const [actionLoading, setActionLoading] = useState(false)

//     useEffect(() => {
//         if (!id) return
//         getUserById(id)
//             .then(data => {
//                 setUser(data)
//                 setLoading(false)
//             })
//             .catch(() => setLoading(false))
//     }, [id])

//     async function handleDeactivate() {
//         if (!user) return
//         setActionLoading(true)
//         const result = await deactivateUser(user.id)
//         if (result.success) {
//             toast.success('Teacher deactivated.')
//         } else {
//             toast.error(result.error ?? 'Failed to deactivate.')
//         }
//         setActionLoading(false)
//     }

//     async function handleReactivate() {
//         if (!user) return
//         setActionLoading(true)
//         const result = await reactivateUser(user.id)
//         if (result.success) {
//             toast.success('Teacher reactivated.')
//         } else {
//             toast.error(result.error ?? 'Failed to reactivate.')
//         }
//         setActionLoading(false)
//     }

//     async function handleDelete() {
//         if (!user) return
//         setActionLoading(true)
//         const result = await deleteUser(user.id)
//         if (result.success) {
//             toast.success('Teacher deleted.')
//             router.replace('/admin/teachers')
//         } else {
//             toast.error(result.error ?? 'Failed to delete.')
//             setActionLoading(false)
//         }
//     }

//     if (loading) return <DetailSkeleton />

//     if (!user) return (
//         <div className="min-h-screen bg-school-secondary-950 flex items-center justify-center">
//             <div className="text-center space-y-3">
//                 <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
//                 <p className="text-white font-bold">Teacher not found</p>
//                 <button
//                     onClick={() => router.back()}
//                     className="text-sm text-school-primary hover:underline"
//                 >
//                     Go back
//                 </button>
//             </div>
//         </div>
//     )

//     const initials = (user.name ?? user.email)
//         .split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

//     return (
//         <div className="min-h-screen bg-school-secondary-950 p-4 sm:p-6 lg:p-8">
//             <div className="max-w-4xl mx-auto space-y-6">

//                 {/* ── Back ── */}
//                 <button
//                     onClick={() => router.back()}
//                     className="inline-flex items-center gap-2 text-sm text-school-secondary-300 hover:text-white transition-colors"
//                 >
//                     <ArrowLeft className="h-4 w-4" />
//                     Back to Teachers
//                 </button>

//                 {/* ── Profile header ── */}
//                 <Card className="bg-school-secondary-900 border-school-secondary-700">
//                     <CardContent className="p-6">
//                         <div className="flex items-start justify-between gap-4 flex-wrap">

//                             {/* Left: avatar + info */}
//                             <div className="flex items-center gap-4">
//                                 <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-school-primary/20 border border-school-primary/20">
//                                     <span className="text-xl font-black text-school-primary">
//                                         {initials}
//                                     </span>
//                                 </div>
//                                 <div className="space-y-1">
//                                     <h1 className="text-xl font-black text-white">
//                                         {user.name ?? '—'}
//                                     </h1>
//                                     <div className="flex items-center gap-1.5">
//                                         <GraduationCap className="h-3.5 w-3.5 text-blue-400" />
//                                         <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
//                                             Teacher
//                                         </span>
//                                     </div>
//                                     <div className="flex items-center gap-3 flex-wrap">
//                                         <span className="flex items-center gap-1 text-xs text-school-secondary-300">
//                                             <Mail className="h-3 w-3" />
//                                             {user.email}
//                                         </span>
//                                         {user.phone && (
//                                             <span className="flex items-center gap-1 text-xs text-school-secondary-300">
//                                                 <Phone className="h-3 w-3" />
//                                                 {user.phone}
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Right: actions */}
//                             <div className="flex items-center gap-2 flex-wrap">
//                                 <button
//                                     onClick={() => setShowAssign(true)}
//                                     className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-school-primary/10 hover:bg-school-primary/20 text-school-primary text-xs font-semibold transition-all"
//                                 >
//                                     <Plus className="h-3.5 w-3.5" />
//                                     Assign Class
//                                 </button>
//                                 <button
//                                     onClick={handleDeactivate}
//                                     disabled={actionLoading}
//                                     className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold transition-all disabled:opacity-50"
//                                 >
//                                     <UserX className="h-3.5 w-3.5" />
//                                     Deactivate
//                                 </button>
//                                 <button
//                                     onClick={() => setShowDelete(true)}
//                                     className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-all"
//                                 >
//                                     <Trash2 className="h-3.5 w-3.5" />
//                                     Delete
//                                 </button>
//                             </div>

//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* ── Assigned Classes ── */}
//                 <Section
//                     title="Assigned Classes"
//                     icon={<BookOpen className="h-4 w-4 text-school-primary" />}
//                 >
//                     {user.assignedClasses.length === 0 ? (
//                         <EmptySection message="Not assigned to any class yet." />
//                     ) : (
//                         <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
//                             {user.assignedClasses.map(c => (
//                                 <div
//                                     key={c.id}
//                                     className="flex items-center gap-3 p-3 rounded-lg bg-school-secondary-800 border border-school-secondary-700"
//                                 >
//                                     <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/10">
//                                         <BookOpen className="h-4 w-4 text-school-primary" />
//                                     </div>
//                                     <div className="min-w-0">
//                                         <p className="text-sm font-semibold text-white truncate">
//                                             {c.name}
//                                         </p>
//                                         <p className="text-xs text-school-secondary-300 truncate">
//                                             {c.grade.displayName}
//                                             {c.subject ? ` · ${c.subject}` : ''}
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </Section>

//                 {/* ── Notifications ── */}
//                 <Section
//                     title="Notifications"
//                     icon={<Bell className="h-4 w-4 text-school-primary" />}
//                 >
//                     {user.notifications.length === 0 ? (
//                         <EmptySection message="No notifications yet." />
//                     ) : (
//                         <div className="space-y-2">
//                             {user.notifications.map(n => (
//                                 <div
//                                     key={n.id}
//                                     className={`flex items-start gap-3 p-3 rounded-lg border transition-colors
//                                         ${n.read
//                                             ? 'bg-school-secondary-800/50 border-school-secondary-700'
//                                             : 'bg-school-primary/5 border-school-primary/20'
//                                         }`}
//                                 >
//                                     <div className={`h-2 w-2 rounded-full shrink-0 mt-1.5 ${n.read ? 'bg-school-secondary-500' : 'bg-school-primary'}`} />
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-sm text-school-secondary-100 leading-snug">
//                                             {n.message}
//                                         </p>
//                                         <p className="text-xs text-school-secondary-400 mt-0.5">
//                                             {new Date(n.createdAt).toLocaleDateString('en-GB', {
//                                                 day: 'numeric', month: 'short', year: 'numeric',
//                                                 hour: '2-digit', minute: '2-digit',
//                                             })}
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </Section>

//             </div>

//             {/* ── Assign Class Modal ── */}
//             {showAssign && user.schoolId && (
//                 <AssignClassModal
//                     userId={user.id}
//                     schoolId={user.schoolId}
//                     role="teacher"
//                     onClose={() => setShowAssign(false)}
//                     onSuccess={() => {
//                         setShowAssign(false)
//                         getUserById(id).then(setUser)
//                         toast.success('Class assigned successfully.')
//                     }}
//                 />
//             )}

//             {/* ── Delete Confirm Modal ── */}
//             {showDelete && (
//                 <ConfirmModal
//                     title="Delete Teacher"
//                     description={`Are you sure you want to delete ${user.name ?? user.email}? This action cannot be undone.`}
//                     confirmLabel="Delete"
//                     danger
//                     loading={actionLoading}
//                     onConfirm={handleDelete}
//                     onCancel={() => setShowDelete(false)}
//                 />
//             )}

//         </div>
//     )
// }


// 'use client'

// import { useState, useEffect } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import { getUserById, UserDetail } from '@/app/actions/user-management'
// import {
//     ArrowLeft, GraduationCap, Mail, Phone, BookOpen,
//     Bell, Plus, Trash2, UserX, UserCheck, AlertCircle,
// } from 'lucide-react'
// import { Card, CardContent } from '@/components/ui/card'
// import { toast } from 'sonner'
// import {
//     Section, EmptySection, DetailSkeleton, AssignClassModal,
// } from '@/components/admin-dasboard/user-detail-shared'
// import { UserActionsModal } from '@/components/admin-dasboard/user-modal'
// import { useUserAction } from '@/hooks/useUserAction'

// export default function TeacherDetailPage() {
//     const { id }  = useParams<{ id: string }>()
//     const router  = useRouter()

//     const [user,       setUser]       = useState<UserDetail | null>(null)
//     const [loading,    setLoading]    = useState(true)
//     const [showAssign, setShowAssign] = useState(false)

//     const { actionState, triggerAction, closeAction } = useUserAction()

//     // ── Fetch ──────────────────────────────────────────────────────────────
//     useEffect(() => {
//         if (!id) return
//         getUserById(id)
//             .then(data => { setUser(data); setLoading(false) })
//             .catch(() => setLoading(false))
//     }, [id])

//     // ── Post-action handler ────────────────────────────────────────────────
//     function handleActionSuccess() {
//         closeAction()
//         if (actionState?.action === 'delete') {
//             router.replace('/admin/teachers')
//         } else {
//             getUserById(id).then(setUser)
//         }
//     }

//     // ── Guards ─────────────────────────────────────────────────────────────
//     if (loading) return <DetailSkeleton />

//     if (!user) return (
//         <div className="min-h-screen bg-school-secondary-950 flex items-center justify-center">
//             <div className="text-center space-y-3">
//                 <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
//                 <p className="text-white font-bold">Teacher not found</p>
//                 <button
//                     onClick={() => router.back()}
//                     className="text-sm text-school-primary hover:underline"
//                 >
//                     Go back
//                 </button>
//             </div>
//         </div>
//     )

//     const initials = (user.name ?? user.email)
//         .split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

//     return (
//         <div className="min-h-screen bg-school-secondary-950 p-4 sm:p-6 lg:p-8">
//             <div className="max-w-4xl mx-auto space-y-6">

//                 {/* Back */}
//                 <button
//                     onClick={() => router.back()}
//                     className="inline-flex items-center gap-2 text-sm text-school-secondary-300 hover:text-white transition-colors"
//                 >
//                     <ArrowLeft className="h-4 w-4" />
//                     Back to Teachers
//                 </button>

//                 {/* ── Profile header ── */}
//                 <Card className="bg-school-secondary-900 border-school-secondary-700">
//                     <CardContent className="p-6">
//                         <div className="flex items-start justify-between gap-4 flex-wrap">

//                             {/* Avatar + info */}
//                             <div className="flex items-center gap-4">
//                                 <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-school-primary/20 border border-school-primary/20">
//                                     <span className="text-xl font-black text-school-primary">
//                                         {initials}
//                                     </span>
//                                 </div>
//                                 <div className="space-y-1">
//                                     <h1 className="text-xl font-black text-white">
//                                         {user.name ?? '—'}
//                                     </h1>
//                                     <div className="flex items-center gap-1.5">
//                                         <GraduationCap className="h-3.5 w-3.5 text-blue-400" />
//                                         <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
//                                             Teacher
//                                         </span>
//                                     </div>
//                                     <div className="flex items-center gap-3 flex-wrap">
//                                         <span className="flex items-center gap-1 text-xs text-school-secondary-300">
//                                             <Mail className="h-3 w-3" />
//                                             {user.email}
//                                         </span>
//                                         {user.phone && (
//                                             <span className="flex items-center gap-1 text-xs text-school-secondary-300">
//                                                 <Phone className="h-3 w-3" />
//                                                 {user.phone}
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Actions */}
//                             <div className="flex items-center gap-2 flex-wrap">
//                                 <button
//                                     onClick={() => setShowAssign(true)}
//                                     className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-school-primary/10 hover:bg-school-primary/20 text-school-primary text-xs font-semibold transition-all"
//                                 >
//                                     <Plus className="h-3.5 w-3.5" />
//                                     Assign Class
//                                 </button>
//                                 <button
//                                     onClick={() => triggerAction('deactivate', user.id, user.name, user.email)}
//                                     className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold transition-all"
//                                 >
//                                     <UserX className="h-3.5 w-3.5" />
//                                     Deactivate
//                                 </button>
//                                 <button
//                                     onClick={() => triggerAction('reactivate', user.id, user.name, user.email)}
//                                     className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-semibold transition-all"
//                                 >
//                                     <UserCheck className="h-3.5 w-3.5" />
//                                     Reactivate
//                                 </button>
//                                 <button
//                                     onClick={() => triggerAction('delete', user.id, user.name, user.email)}
//                                     className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-all"
//                                 >
//                                     <Trash2 className="h-3.5 w-3.5" />
//                                     Delete
//                                 </button>
//                             </div>

//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* ── Assigned Classes ── */}
//                 <Section
//                     title="Assigned Classes"
//                     icon={<BookOpen className="h-4 w-4 text-school-primary" />}
//                 >
//                     {user.assignedClasses.length === 0 ? (
//                         <EmptySection message="Not assigned to any class yet." />
//                     ) : (
//                         <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
//                             {user.assignedClasses.map(c => (
//                                 <div
//                                     key={c.id}
//                                     className="flex items-center gap-3 p-3 rounded-lg bg-school-secondary-800 border border-school-secondary-700"
//                                 >
//                                     <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/10">
//                                         <BookOpen className="h-4 w-4 text-school-primary" />
//                                     </div>
//                                     <div className="min-w-0">
//                                         <p className="text-sm font-semibold text-white truncate">
//                                             {c.name}
//                                         </p>
//                                         <p className="text-xs text-school-secondary-300 truncate">
//                                             {c.grade.displayName}
//                                             {/* {c.subject ? ` · ${c.subject}` : ''} */}
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </Section>

//                 {/* ── Notifications ── */}
//                 <Section
//                     title="Notifications"
//                     icon={<Bell className="h-4 w-4 text-school-primary" />}
//                 >
//                     {user.notifications.length === 0 ? (
//                         <EmptySection message="No notifications yet." />
//                     ) : (
//                         <div className="space-y-2">
//                             {user.notifications.map(n => (
//                                 <div
//                                     key={n.id}
//                                     className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
//                                         n.read
//                                             ? 'bg-school-secondary-800/50 border-school-secondary-700'
//                                             : 'bg-school-primary/5 border-school-primary/20'
//                                     }`}
//                                 >
//                                     <div className={`h-2 w-2 rounded-full shrink-0 mt-1.5 ${
//                                         n.read ? 'bg-school-secondary-500' : 'bg-school-primary'
//                                     }`} />
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-sm text-school-secondary-100 leading-snug">
//                                             {n.message}
//                                         </p>
//                                         <p className="text-xs text-school-secondary-400 mt-0.5">
//                                             {new Date(n.createdAt).toLocaleDateString('en-GB', {
//                                                 day: 'numeric', month: 'short',
//                                                 year: 'numeric', hour: '2-digit', minute: '2-digit',
//                                             })}
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </Section>

//             </div>

//             {/* ── Assign Class Modal ── */}
//             {showAssign && user.schoolId && (
//                 <AssignClassModal
//                     userId={user.id}
//                     schoolId={user.schoolId}
//                     role="teacher"
//                     onClose={() => setShowAssign(false)}
//                     onSuccess={() => {
//                         setShowAssign(false)
//                         getUserById(id).then(setUser)
//                         toast.success('Class assigned successfully.')
//                     }}
//                 />
//             )}

//             {/* ── Delete / Deactivate / Reactivate Modal ── */}
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
//     )
// }



'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getUserById, type UserDetail } from '@/app/actions/user-management'
import {
    ArrowLeft, GraduationCap, Mail, Phone, BookOpen,
    Plus, Trash2, UserX, AlertCircle, ShieldCheck,
     TableProperties
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import {
    Section, EmptySection, DetailSkeleton, AssignClassModal,
} from '@/components/admin-dasboard/user-detail-shared'
import { UserActionsModal } from '@/components/admin-dasboard/user-modal'
import { useUserAction } from '@/hooks/useUserAction'
import { useProfileStore } from '@/store/profileStore'
import { getErrorMessage } from '@/lib/error-handler'

/**
 * TEACHER DETAIL REGISTRY (Tier 2)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 15: Resolved TS2554 by normalizing identity context to (string, string | null).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 * Rule 23: Explicit Error Protocol with getErrorMessage.
 */
export default function TeacherDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const { profile: actorProfile } = useProfileStore();
    
    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAssign, setShowAssign] = useState(false);
    const { actionState, triggerAction, closeAction } = useUserAction();

    // ── Registry Fetch Protocol (Rule 11/23) ──
    const fetchTeacher = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            // ✅ RESOLVED: Providing 2nd argument (actorSchoolId) to enforce isolation
            const data = await getUserById(id, actorProfile?.schoolId ?? null);
            setUser(data);
        } catch (error: unknown) {
            // ✅ Rule 23: Standardized Error Extraction
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }, [id, actorProfile?.schoolId]);

    useEffect(() => {
        fetchTeacher();
    }, [fetchTeacher]);

    async function handleActionSuccess() {
        closeAction();
        if (actionState?.action === 'delete') {
            router.replace('/admin/teachers');
        } else {
            await fetchTeacher();
        }
    }

    if (loading) return <DetailSkeleton />;

    if (!user) return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="text-center space-y-6 animate-in fade-in zoom-in-95">
                <div className="h-20 w-20 bg-surface rounded-[2rem] flex items-center justify-center mx-auto border border-border shadow-lg">
                    <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter">Identity Mismatch</h2>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Faculty profile not discovered in registry.</p>
                </div>
                <button onClick={() => router.back()} className="text-[10px] font-extrabold text-school-primary uppercase tracking-widest hover:underline">
                    Return to Faculty Hub
                </button>
            </div>
        </div>
    );

    const initials = (user.name ?? user.email).split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase();

    return (
        <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
            {/* Rule 20: Fluid Container and Padding */}
            <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10">
                
                <button 
                    onClick={() => router.back()} 
                    className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Faculty Hub
                </button>

                {/* ── IDENTITY HUB HEADER (Rule 18/21) ── */}
                <Card className="bg-card border-border rounded-[2rem] overflow-hidden shadow-xl">
                    <CardContent className="p-6 md:p-10">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Rule 21: Scale Protocol Hub Icon */}
                                <div className="h-20 w-20 rounded-2xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center text-2xl font-extrabold italic text-school-primary shadow-inner tabular-nums">
                                    {initials}
                                </div>
                                <div className="space-y-2 text-center md:text-left">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                        {/* Rule 11: Header scaling */}
                                        <h1 className="text-2xl md:text-4xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                                            {user.name ?? 'Identity Pending'}
                                        </h1>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-school-primary-50 rounded-lg border border-school-primary-200">
                                            <GraduationCap className="h-3 w-3 text-school-primary" />
                                            <span className="text-[9px] font-bold text-school-primary uppercase tracking-widest">Lead Instructor</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-semibold uppercase tracking-tight">
                                            <Mail className="h-3.5 w-3.5 text-school-primary" /> {user.email}
                                        </div>
                                        {user.phone && (
                                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-semibold uppercase tracking-tight">
                                                <Phone className="h-3.5 w-3.5 text-school-primary" /> {user.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ── ACTION DECK ── */}
                            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                                <button 
                                    onClick={() => setShowAssign(true)} 
                                    className="flex-1 lg:flex-none px-6 py-3 rounded-xl bg-school-primary text-on-school-primary font-extrabold text-[10px] uppercase tracking-widest shadow-lg shadow-school-primary-200 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="h-4 w-4" /> Hub Placement
                                </button>
                                <button 
                                    onClick={() => triggerAction('deactivate', user.id, user.name, user.email)} 
                                    className="flex-1 lg:flex-none px-6 py-3 rounded-xl bg-surface border border-border text-amber-500 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <UserX className="h-4 w-4" /> Deactivate
                                </button>
                                <button 
                                    onClick={() => triggerAction('delete', user.id, user.name, user.email)} 
                                    className="flex-1 lg:flex-none px-6 py-3 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-[10px] font-bold uppercase tracking-widest hover:bg-destructive/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" /> Purge Record
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-12">
                        
                        {/* ── FACULTY HUB PLACEMENT ── */}
                        <Section title="Classroom Hub Responsibility" icon={<BookOpen className="h-5 w-5" />}>
                            {user.assignedClasses.length === 0 ? <EmptySection message="No institutional classroom lead responsibility assigned." /> : (
                                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                    {user.assignedClasses.map(c => (
                                        <div key={c.id} className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-card border border-border shadow-sm group hover:border-school-primary-200 transition-all">
                                            <div className="flex h-10 w-10 rounded-xl bg-surface border border-border items-center justify-center group-hover:bg-school-primary-50 transition-colors">
                                                <BookOpen className="h-5 w-5 text-school-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-extrabold text-foreground uppercase italic truncate tracking-tight">{c.name}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{c.grade.displayName} Registry</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Section>

                        {/* ── MODULE ALLOCATIONS ── */}
                        <Section title="Academic Hub Allocations" icon={<TableProperties className="h-5 w-5" />}>
                            {user.allocatedSubjects.length === 0 ? <EmptySection message="No academic modules currently synchronized to this instructor." /> : (
                                <div className="flex flex-wrap gap-3">
                                    {user.allocatedSubjects.map(sub => (
                                        <div key={sub.id} className="px-4 py-2 rounded-full bg-surface border border-border text-[10px] font-bold text-foreground uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all hover:border-school-primary-200">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            {sub.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Section>
                    </div>

                    {/* ── SIDEBAR Hub ── */}
                    <div className="space-y-8">
                         <div className="p-8 rounded-[2rem] bg-surface border border-border space-y-4 shadow-inner">
                            <div className="flex items-center gap-3 text-school-primary">
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Registry Protocol</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed italic font-medium">
                                Faculty identity hubs are institutional assets. Access and module assignments are cryptographically linked to the master institutional registry.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MODALS Hub ── */}
            {showAssign && user.schoolId && (
                <AssignClassModal 
                    userId={user.id} 
                    schoolId={user.schoolId} 
                    role="TEACHER" 
                    onClose={() => setShowAssign(false)}
                    onSuccess={() => { 
                        setShowAssign(false); 
                        fetchTeacher();
                        toast.success('Hub Placement Synchronized.'); 
                    }}
                />
            )}
            
            {actionState && (
                <UserActionsModal 
                    userId={actionState.userId} 
                    userName={actionState.userName} 
                    userEmail={actionState.userEmail} 
                    action={actionState.action} 
                    onClose={closeAction} 
                    onSuccess={handleActionSuccess} 
                />
            )}
        </div>
    );
}