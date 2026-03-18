// 'use client'

// import { useState, useEffect } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import {
//     getUserById, getClassesBySchool, assignUserToClass,
//     deactivateUser, deleteUser, UserDetail
// } from '@/app/actions/user-management'
// import {
//     ArrowLeft, Users, Mail, Phone, BookOpen,
//     Bell, ClipboardCheck, Plus, Trash2, UserX,
//     AlertCircle,
// } from 'lucide-react'
// import { Card, CardContent } from '@/components/ui/card'
// import { toast } from 'sonner'
// import {
//     Section, EmptySection, DetailSkeleton,
//     AssignClassModal, ConfirmModal
// } from '@/components/admin-dasboard/user-detail-shared'

// export default function StudentDetailPage() {
//     const { id }  = useParams<{ id: string }>()
//     const router  = useRouter()

//     const [user,          setUser]          = useState<UserDetail | null>(null)
//     const [loading,       setLoading]       = useState(true)
//     const [showAssign,    setShowAssign]    = useState(false)
//     const [showDelete,    setShowDelete]    = useState(false)
//     const [actionLoading, setActionLoading] = useState(false)

//     useEffect(() => {
//         if (!id) return
//         getUserById(id)
//             .then(data => { setUser(data); setLoading(false) })
//             .catch(() => setLoading(false))
//     }, [id])

//     async function handleDeactivate() {
//         if (!user) return
//         setActionLoading(true)
//         const result = await deactivateUser(user.id)
//         result.success
//             ? toast.success('Student deactivated.')
//             : toast.error(result.error ?? 'Failed to deactivate.')
//         setActionLoading(false)
//     }

//     async function handleDelete() {
//         if (!user) return
//         setActionLoading(true)
//         const result = await deleteUser(user.id)
//         if (result.success) {
//             toast.success('Student deleted.')
//             router.replace('/admin/studentView')
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
//                 <p className="text-white font-bold">Student not found</p>
//                 <button onClick={() => router.back()} className="text-sm text-school-primary hover:underline">Go back</button>
//             </div>
//         </div>
//     )

//     const initials = (user.name ?? user.email)
//         .split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

//     return (
//         <div className="min-h-screen bg-school-secondary-950 p-4 sm:p-6 lg:p-8">
//             <div className="max-w-4xl mx-auto space-y-6">

//                 <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-school-secondary-300 hover:text-white transition-colors">
//                     <ArrowLeft className="h-4 w-4" /> Back to Students
//                 </button>

//                 {/* Profile header */}
//                 <Card className="bg-school-secondary-900 border-school-secondary-700">
//                     <CardContent className="p-6">
//                         <div className="flex items-start justify-between gap-4 flex-wrap">
//                             <div className="flex items-center gap-4">
//                                 <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-500/20 border border-green-500/20">
//                                     <span className="text-xl font-black text-green-400">{initials}</span>
//                                 </div>
//                                 <div className="space-y-1">
//                                     <h1 className="text-xl font-black text-white">{user.name ?? '—'}</h1>
//                                     <div className="flex items-center gap-1.5">
//                                         <Users className="h-3.5 w-3.5 text-green-400" />
//                                         <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Student</span>
//                                     </div>
//                                     <div className="flex items-center gap-3 flex-wrap">
//                                         <span className="flex items-center gap-1 text-xs text-school-secondary-300">
//                                             <Mail className="h-3 w-3" />{user.email}
//                                         </span>
//                                         {user.phone && (
//                                             <span className="flex items-center gap-1 text-xs text-school-secondary-300">
//                                                 <Phone className="h-3 w-3" />{user.phone}
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-2 flex-wrap">
//                                 <button onClick={() => setShowAssign(true)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-school-primary/10 hover:bg-school-primary/20 text-school-primary text-xs font-semibold transition-all">
//                                     <Plus className="h-3.5 w-3.5" /> Assign Class
//                                 </button>
//                                 <button onClick={handleDeactivate} disabled={actionLoading} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold transition-all disabled:opacity-50">
//                                     <UserX className="h-3.5 w-3.5" /> Deactivate
//                                 </button>
//                                 <button onClick={() => setShowDelete(true)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-all">
//                                     <Trash2 className="h-3.5 w-3.5" /> Delete
//                                 </button>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* Assigned Classes */}
//                 <Section title="Assigned Classes" icon={<BookOpen className="h-4 w-4 text-school-primary" />}>
//                     {user.assignedClasses.length === 0 ? (
//                         <EmptySection message="Not enrolled in any class yet." />
//                     ) : (
//                         <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
//                             {user.assignedClasses.map(c => (
//                                 <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-school-secondary-800 border border-school-secondary-700">
//                                     <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
//                                         <BookOpen className="h-4 w-4 text-green-400" />
//                                     </div>
//                                     <div className="min-w-0">
//                                         <p className="text-sm font-semibold text-white truncate">{c.name}</p>
//                                         <p className="text-xs text-school-secondary-300 truncate">
//                                             {c.grade.displayName}{c.subject ? ` · ${c.subject}` : ''}
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </Section>

//                 {/* Assessment Scores */}
//                 <Section title="Assessment Scores" icon={<ClipboardCheck className="h-4 w-4 text-school-primary" />}>
//                     {user.assessments.length === 0 ? (
//                         <EmptySection message="No assessments recorded yet." />
//                     ) : (
//                         <div className="space-y-2">
//                             {user.assessments.map(a => {
//                                 const pct = a.maxScore && a.score !== null
//                                     ? Math.round((a.score / a.maxScore) * 100)
//                                     : null
//                                 const color = pct === null ? 'text-school-secondary-300'
//                                     : pct >= 70 ? 'text-green-400'
//                                     : pct >= 50 ? 'text-amber-400'
//                                     : 'text-red-400'

//                                 return (
//                                     <div key={a.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-school-secondary-800 border border-school-secondary-700">
//                                         <div className="min-w-0">
//                                             <p className="text-sm font-semibold text-white truncate">
//                                                 {a.subject ?? 'Unknown Subject'}
//                                             </p>
//                                             <p className="text-xs text-school-secondary-300">
//                                                 {a.type.replace(/_/g, ' ')} · {new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
//                                             </p>
//                                             {a.comments && (
//                                                 <p className="text-xs text-school-secondary-400 mt-0.5 truncate">
//                                                     {a.comments}
//                                                 </p>
//                                             )}
//                                         </div>
//                                         <div className="text-right shrink-0">
//                                             <p className={`text-sm font-black ${color}`}>
//                                                 {a.score !== null ? a.score : '—'}
//                                                 {a.maxScore ? `/${a.maxScore}` : ''}
//                                             </p>
//                                             {pct !== null && (
//                                                 <p className={`text-xs font-semibold ${color}`}>{pct}%</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 )
//                             })}
//                         </div>
//                     )}
//                 </Section>

//                 {/* Notifications */}
//                 <Section title="Notifications" icon={<Bell className="h-4 w-4 text-school-primary" />}>
//                     {user.notifications.length === 0 ? (
//                         <EmptySection message="No notifications yet." />
//                     ) : (
//                         <div className="space-y-2">
//                             {user.notifications.map(n => (
//                                 <div key={n.id} className={`flex items-start gap-3 p-3 rounded-lg border ${n.read ? 'bg-school-secondary-800/50 border-school-secondary-700' : 'bg-school-primary/5 border-school-primary/20'}`}>
//                                     <div className={`h-2 w-2 rounded-full shrink-0 mt-1.5 ${n.read ? 'bg-school-secondary-500' : 'bg-school-primary'}`} />
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-sm text-school-secondary-100 leading-snug">{n.message}</p>
//                                         <p className="text-xs text-school-secondary-400 mt-0.5">
//                                             {new Date(n.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </Section>

//             </div>

//             {showAssign && user.schoolId && (
//                 <AssignClassModal
//                     userId={user.id}
//                     schoolId={user.schoolId}
//                     role="student"
//                     onClose={() => setShowAssign(false)}
//                     onSuccess={() => {
//                         setShowAssign(false)
//                         getUserById(id).then(setUser)
//                         toast.success('Class assigned successfully.')
//                     }}
//                 />
//             )}

//             {showDelete && (
//                 <ConfirmModal
//                     title="Delete Student"
//                     description={`Are you sure you want to delete ${user.name ?? user.email}? This cannot be undone.`}
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


'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getUserById, UserDetail } from '@/app/actions/user-management'
import {
    ArrowLeft, Users, Mail, Phone, BookOpen,
    Bell, ClipboardCheck, Plus, Trash2, UserX,
    AlertCircle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import {
    Section, EmptySection, DetailSkeleton, AssignClassModal,
} from '@/components/admin-dasboard/user-detail-shared'
import { UserActionsModal } from '@/components/admin-dasboard/user-modal'
import { useUserAction } from '@/hooks/useUserAction'

export default function StudentDetailPage() {
    const { id }  = useParams<{ id: string }>()
    const router  = useRouter()

    const [user,       setUser]       = useState<UserDetail | null>(null)
    const [loading,    setLoading]    = useState(true)
    const [showAssign, setShowAssign] = useState(false)

    const { actionState, triggerAction, closeAction } = useUserAction()

    // ── Fetch ──────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!id) return
        getUserById(id)
            .then(data => { setUser(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [id])

    // ── Post-action handler ────────────────────────────────────────────────
    function handleActionSuccess() {
        closeAction()
        if (actionState?.action === 'delete') {
            router.replace('/admin/studentView')
        } else {
            getUserById(id).then(setUser)
        }
    }

    // ── Guards ─────────────────────────────────────────────────────────────
    if (loading) return <DetailSkeleton />

    if (!user) return (
        <div className="min-h-screen bg-school-secondary-950 flex items-center justify-center">
            <div className="text-center space-y-3">
                <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
                <p className="text-white font-bold">Student not found</p>
                <button
                    onClick={() => router.back()}
                    className="text-sm text-school-primary hover:underline"
                >
                    Go back
                </button>
            </div>
        </div>
    )

    const initials = (user.name ?? user.email)
        .split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

    return (
        <div className="min-h-screen bg-school-secondary-950 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-sm text-school-secondary-300 hover:text-white transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Students
                </button>

                {/* ── Profile header ── */}
                <Card className="bg-school-secondary-900 border-school-secondary-700">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4 flex-wrap">

                            {/* Avatar + info */}
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-500/20 border border-green-500/20">
                                    <span className="text-xl font-black text-green-400">
                                        {initials}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-xl font-black text-white">
                                        {user.name ?? '—'}
                                    </h1>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5 text-green-400" />
                                        <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                                            Student
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="flex items-center gap-1 text-xs text-school-secondary-300">
                                            <Mail className="h-3 w-3" />
                                            {user.email}
                                        </span>
                                        {user.phone && (
                                            <span className="flex items-center gap-1 text-xs text-school-secondary-300">
                                                <Phone className="h-3 w-3" />
                                                {user.phone}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    onClick={() => setShowAssign(true)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-school-primary/10 hover:bg-school-primary/20 text-school-primary text-xs font-semibold transition-all"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Assign Class
                                </button>
                                <button
                                    onClick={() => triggerAction('deactivate', user.id, user.name, user.email)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold transition-all"
                                >
                                    <UserX className="h-3.5 w-3.5" />
                                    Deactivate
                                </button>
                                <button
                                    onClick={() => triggerAction('delete', user.id, user.name, user.email)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-all"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete
                                </button>
                            </div>

                        </div>
                    </CardContent>
                </Card>

                {/* ── Assigned Classes ── */}
                <Section
                    title="Assigned Classes"
                    icon={<BookOpen className="h-4 w-4 text-school-primary" />}
                >
                    {user.assignedClasses.length === 0 ? (
                        <EmptySection message="Not enrolled in any class yet." />
                    ) : (
                        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                            {user.assignedClasses.map(c => (
                                <div
                                    key={c.id}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-school-secondary-800 border border-school-secondary-700"
                                >
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                                        <BookOpen className="h-4 w-4 text-green-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">
                                            {c.name}
                                        </p>
                                        <p className="text-xs text-school-secondary-300 truncate">
                                            {c.grade.displayName}
                                            {c.subject ? ` · ${c.subject}` : ''}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

                {/* ── Assessment Scores ── */}
                <Section
                    title="Assessment Scores"
                    icon={<ClipboardCheck className="h-4 w-4 text-school-primary" />}
                >
                    {user.assessments.length === 0 ? (
                        <EmptySection message="No assessments recorded yet." />
                    ) : (
                        <div className="space-y-2">
                            {user.assessments.map(a => {
                                const pct = a.maxScore && a.score !== null
                                    ? Math.round((a.score / a.maxScore) * 100)
                                    : null
                                const color =
                                    pct === null ? 'text-school-secondary-300'
                                    : pct >= 70  ? 'text-green-400'
                                    : pct >= 50  ? 'text-amber-400'
                                    :              'text-red-400'

                                return (
                                    <div
                                        key={a.id}
                                        className="flex items-center justify-between gap-3 p-3 rounded-lg bg-school-secondary-800 border border-school-secondary-700"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">
                                                {a.subject ?? 'Unknown Subject'}
                                            </p>
                                            <p className="text-xs text-school-secondary-300">
                                                {a.type.replace(/_/g, ' ')} ·{' '}
                                                {new Date(a.createdAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric', month: 'short', year: 'numeric',
                                                })}
                                            </p>
                                            {a.comments && (
                                                <p className="text-xs text-school-secondary-400 mt-0.5 truncate">
                                                    {a.comments}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className={`text-sm font-black ${color}`}>
                                                {a.score !== null ? a.score : '—'}
                                                {a.maxScore ? `/${a.maxScore}` : ''}
                                            </p>
                                            {pct !== null && (
                                                <p className={`text-xs font-semibold ${color}`}>
                                                    {pct}%
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </Section>

                {/* ── Notifications ── */}
                <Section
                    title="Notifications"
                    icon={<Bell className="h-4 w-4 text-school-primary" />}
                >
                    {user.notifications.length === 0 ? (
                        <EmptySection message="No notifications yet." />
                    ) : (
                        <div className="space-y-2">
                            {user.notifications.map(n => (
                                <div
                                    key={n.id}
                                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                                        n.read
                                            ? 'bg-school-secondary-800/50 border-school-secondary-700'
                                            : 'bg-school-primary/5 border-school-primary/20'
                                    }`}
                                >
                                    <div className={`h-2 w-2 rounded-full shrink-0 mt-1.5 ${
                                        n.read ? 'bg-school-secondary-500' : 'bg-school-primary'
                                    }`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-school-secondary-100 leading-snug">
                                            {n.message}
                                        </p>
                                        <p className="text-xs text-school-secondary-400 mt-0.5">
                                            {new Date(n.createdAt).toLocaleDateString('en-GB', {
                                                day: 'numeric', month: 'short',
                                                year: 'numeric', hour: '2-digit', minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

            </div>

            {/* ── Assign Class Modal ── */}
            {showAssign && user.schoolId && (
                <AssignClassModal
                    userId={user.id}
                    schoolId={user.schoolId}
                    role="student"
                    onClose={() => setShowAssign(false)}
                    onSuccess={() => {
                        setShowAssign(false)
                        getUserById(id).then(setUser)
                        toast.success('Class assigned successfully.')
                    }}
                />
            )}

            {/* ── Delete / Deactivate / Reactivate Modal ── */}
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
    )
}