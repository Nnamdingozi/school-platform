// 'use client'

// import { useState, useEffect } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import { getUserById, UserDetail } from '@/app/actions/user-management'

// import {
//     ArrowLeft,
//     Users,
//     Mail,
//     Phone,
//     User,
//     GraduationCap,
//     ClipboardCheck,
//     Trash2,
//     UserX,
//     AlertCircle
// } from 'lucide-react'

// import { Card, CardContent } from '@/components/ui/card'
// import { toast } from 'sonner'

// import {
//     Section,
//     EmptySection,
//     DetailSkeleton
// } from '@/components/admin-dasboard/user-detail-shared'

// import { UserActionsModal } from '@/components/admin-dasboard/user-modal'
// import { useUserAction } from '@/hooks/useUserAction'

// export default function ParentDetailPage() {
//     const { id } = useParams<{ id: string }>()
//     const router = useRouter()

//     const [user, setUser] = useState<UserDetail | null>(null)
//     const [loading, setLoading] = useState(true)

//     const { actionState, triggerAction, closeAction } = useUserAction()

//     useEffect(() => {
//         if (!id) return

//         getUserById(id)
//             .then(data => {
//                 setUser(data)
//                 setLoading(false)
//             })
//             .catch(() => setLoading(false))
//     }, [id])

//     function handleActionSuccess() {
//         closeAction()

//         if (actionState?.action === 'delete') {
//             router.replace('/admin/parentView')
//         } else {
//             getUserById(id).then(setUser)
//         }
//     }

//     if (loading) return <DetailSkeleton />

//     if (!user) {
//         return (
//             <div className="min-h-screen bg-school-secondary-950 flex items-center justify-center">
//                 <div className="text-center space-y-3">
//                     <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
//                     <p className="text-white font-bold">Parent not found</p>

//                     <button
//                         onClick={() => router.back()}
//                         className="text-sm text-school-primary hover:underline"
//                     >
//                         Go back
//                     </button>
//                 </div>
//             </div>
//         )
//     }

//     const initials = (user.name ?? user.email)
//         .split(' ')
//         .map(n => n[0])
//         .slice(0, 2)
//         .join('')
//         .toUpperCase()

//     return (
//         <div className="min-h-screen bg-school-secondary-950 p-4 sm:p-6 lg:p-8">
//             <div className="max-w-4xl mx-auto space-y-6">

//                 {/* Back */}
//                 <button
//                     onClick={() => router.back()}
//                     className="inline-flex items-center gap-2 text-sm text-school-secondary-300 hover:text-white transition-colors"
//                 >
//                     <ArrowLeft className="h-4 w-4" />
//                     Back to Parents
//                 </button>

//                 {/* Profile Header */}
//                 <Card className="bg-school-secondary-900 border-school-secondary-700">
//                     <CardContent className="p-6">

//                         <div className="flex items-start justify-between gap-4 flex-wrap">

//                             <div className="flex items-center gap-4">

//                                 <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-500/20">
//                                     <span className="text-xl font-black text-purple-400">
//                                         {initials}
//                                     </span>
//                                 </div>

//                                 <div className="space-y-1">

//                                     <h1 className="text-xl font-black text-white">
//                                         {user.name ?? '—'}
//                                     </h1>

//                                     <div className="flex items-center gap-1.5">
//                                         <Users className="h-3.5 w-3.5 text-purple-400" />
//                                         <span className="text-xs font-semibold text-purple-400 uppercase">
//                                             Parent
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
//                                     onClick={() => triggerAction('deactivate', user.id, user.name, user.email)}
//                                     className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
//                                 >
//                                     <UserX className="h-3.5 w-3.5" />
//                                     Deactivate
//                                 </button>

//                                 <button
//                                     onClick={() => triggerAction('delete', user.id, user.name, user.email)}
//                                     className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
//                                 >
//                                     <Trash2 className="h-3.5 w-3.5" />
//                                     Delete
//                                 </button>

//                             </div>

//                         </div>

//                     </CardContent>
//                 </Card>

//                 {/* Children */}
//                 <Section
//                     title="Linked Students"
//                     icon={<GraduationCap className="h-4 w-4 text-school-primary" />}
//                 >

//                     {user.children?.length === 0 ? (
//                         <EmptySection message="No students linked to this parent yet." />
//                     ) : (

//                         <div className="space-y-3">

//                             {user.children.map(child => (

//                                 <div
//                                     key={child.id}
//                                     className="p-4 rounded-lg bg-school-secondary-800 border border-school-secondary-700 space-y-3"
//                                 >

//                                     {/* Child Info */}
//                                     <div className="flex items-center justify-between">

//                                         <div className="space-y-1">

//                                             <p className="text-sm font-bold text-white">
//                                                 {child.name ?? child.email}
//                                             </p>

//                                             <p className="text-xs text-school-secondary-300">
//                                                 {child.className ?? 'No class assigned'}
//                                             </p>

//                                         </div>

//                                         <button
//                                             onClick={() => router.push(`/admin/studentView/${child.id}`)}
//                                             className="text-xs text-school-primary hover:underline"
//                                         >
//                                             View Student
//                                         </button>

//                                     </div>

//                                     {/* Subjects */}
//                                     {child.subjects?.length > 0 && (

//                                         <div className="flex flex-wrap gap-2">

//                                             {child.subjects.map(sub => (
//                                                 <div
//                                                     key={sub.id}
//                                                     className="px-3 py-1 rounded-full bg-school-secondary-900 border border-school-secondary-700 text-[10px] font-bold text-slate-300 uppercase"
//                                                 >
//                                                     {sub.name}
//                                                 </div>
//                                             ))}

//                                         </div>

//                                     )}

//                                     {/* Assessments */}
//                                     {child.assessments?.length > 0 && (

//                                         <div className="space-y-2">

//                                             {child.assessments.slice(0, 3).map(a => {

//                                                 const pct =
//                                                     a.maxScore && a.score !== null
//                                                         ? Math.round((a.score / a.maxScore) * 100)
//                                                         : null

//                                                 const color =
//                                                     pct === null
//                                                         ? 'text-school-secondary-300'
//                                                         : pct >= 70
//                                                         ? 'text-green-400'
//                                                         : pct >= 50
//                                                         ? 'text-amber-400'
//                                                         : 'text-red-400'

//                                                 return (

//                                                     <div
//                                                         key={a.id}
//                                                         className="flex items-center justify-between text-xs"
//                                                     >

//                                                         <span className="text-school-secondary-300">
//                                                             {a.subject}
//                                                         </span>

//                                                         <span className={`font-bold ${color}`}>
//                                                             {a.score ?? '—'}
//                                                             {a.maxScore ? `/${a.maxScore}` : ''}
//                                                         </span>

//                                                     </div>

//                                                 )
//                                             })}

//                                         </div>

//                                     )}

//                                 </div>

//                             ))}

//                         </div>

//                     )}

//                 </Section>

//             </div>

//             {/* Action Modal */}

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

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { getUserById, type UserDetail } from '@/app/actions/user-management'
import {
    ArrowLeft, Mail, Phone, 
    Bell, Trash2, UserX, AlertCircle, BookOpen,
    ShieldCheck
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { 
    Section, EmptySection, DetailSkeleton 
} from '@/components/admin-dasboard/user-detail-shared'
import { UserActionsModal } from '@/components/admin-dasboard/user-modal'
import { useUserAction } from '@/hooks/useUserAction'
import { Badge } from '@/components/ui/badge'

interface PageProps {
    params: Promise<{ id: string }>
}

export default function ParentDetailPage({ params }: PageProps) {
    const { id } = use(params)
    const router = useRouter()
    
    const [user, setUser] = useState<UserDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const { actionState, triggerAction, closeAction } = useUserAction()

    useEffect(() => {
        if (!id) return
        getUserById(id)
            .then(data => { 
                setUser(data)
                setLoading(false) 
            })
            .catch(() => setLoading(false))
    }, [id])

    function handleActionSuccess() {
        closeAction()
        if (actionState?.action === 'delete') {
            router.replace('/admin/users?role=PARENT')
        } else {
            getUserById(id).then(setUser)
        }
    }

    if (loading) return <DetailSkeleton />

    if (!user) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                <p className="text-white font-black uppercase tracking-widest">Guardian Not Found</p>
                <button onClick={() => router.back()} className="text-school-primary hover:underline text-xs font-bold uppercase">Return to Registry</button>
            </div>
        </div>
    )

    const initials = (user.name ?? user.email).split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8 lg:p-12 text-slate-50">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* ── Navigation ── */}
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-school-primary transition-all"
                >
                    <ArrowLeft className="h-3 w-3" /> Back to User Index
                </button>

                {/* ── Header Card ── */}
                <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <CardContent className="p-8 md:p-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="flex items-center gap-6">
                                <div className="h-20 w-20 rounded-[2rem] bg-school-primary/10 border border-school-primary/20 flex items-center justify-center text-2xl font-black text-school-primary shadow-inner italic">
                                    {initials}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                                            {user.name ?? '—'}
                                        </h1>
                                        <Badge className="bg-school-primary text-school-secondary-950 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-md">
                                            Guardian
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 pt-2">
                                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                                            <Mail className="h-3.5 w-3.5" /> {user.email}
                                        </div>
                                        {user.phone && (
                                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                                                <Phone className="h-3.5 w-3.5" /> {user.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => triggerAction('deactivate', user.id, user.name, user.email)}
                                    className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-slate-800 text-amber-400 text-[10px] font-black uppercase tracking-widest hover:bg-amber-400/10 transition-all border border-amber-400/20"
                                >
                                    <UserX className="h-4 w-4 inline mr-2" /> Deactivate
                                </button>
                                <button
                                    onClick={() => triggerAction('delete', user.id, user.name, user.email)}
                                    className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all border border-red-500/20"
                                >
                                    <Trash2 className="h-4 w-4 inline mr-2" /> Wipe Record
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* ── Left: Linked Children ── */}
                    <div className="lg:col-span-2 space-y-8">
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-school-primary px-2">Family Academic Hub</h3>
                        
                        {(user as any).childrenRegistry?.length === 0 ? (
                            <EmptySection message="No students are linked to this record." />
                        ) : (
                            (user as any).childrenRegistry.map((child: any) => (
                                <Card key={child.id} className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                    <div className="p-8 border-b border-white/5 bg-slate-950/40 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-school-primary/10 flex items-center justify-center text-school-primary font-black">
                                                {child.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-white uppercase italic">{child.name}</h4>
                                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                                                    {child.gradeName} • {child.className}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => router.push(`/admin/studentView/${child.id}`)}
                                            className="text-[10px] font-black text-school-primary uppercase hover:underline"
                                        >
                                            View Full Profile →
                                        </button>
                                    </div>

                                    <CardContent className="p-8 space-y-8">
                                        {/* 1. Allocated Subjects */}
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                <BookOpen className="h-3 w-3" /> Subject Allocation
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {child.subjects.map((sub: string) => (
                                                    <span key={sub} className="px-3 py-1 rounded-full bg-slate-950 border border-white/5 text-[10px] font-bold text-slate-400 uppercase">
                                                        {sub}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 2. Recent Assessment Scores */}
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                <ShieldCheck className="h-3 w-3" /> Performance Snapshot
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {child.recentAssessments.length > 0 ? child.recentAssessments.map((a: any) => (
                                                    <div key={a.id} className="flex justify-between items-center p-4 rounded-2xl bg-slate-950 border border-white/5 shadow-inner">
                                                        <span className="text-xs font-bold text-slate-300 uppercase">{a.subject}</span>
                                                        <span className="text-sm font-black text-school-primary">{a.score}/{a.maxScore}</span>
                                                    </div>
                                                )) : (
                                                    <p className="text-[10px] text-slate-600 italic">No recent scores found.</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* ── Right: Sidebar Context ── */}
                    <div className="space-y-8">
                        {/* Notification Status */}
                        <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 bg-slate-950/40">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-school-primary" /> Recent Alerts
                                </h3>
                            </div>
                            <CardContent className="p-6 space-y-4">
                                {user.notifications.length === 0 ? (
                                    <p className="text-[10px] text-slate-600 italic text-center py-4 uppercase">No communication history</p>
                                ) : (
                                    user.notifications.slice(0, 3).map(n => (
                                        <div key={n.id} className="p-3 rounded-xl bg-slate-950 border border-white/5">
                                            <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">{n.message}</p>
                                            <p className="text-[9px] text-slate-600 font-bold uppercase mt-2">
                                                {new Date(n.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Security Policy */}
                        <div className="p-6 rounded-[2rem] bg-school-primary/5 border border-school-primary/10">
                            <div className="flex items-center gap-3 text-school-primary mb-3">
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">System Protocol</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed italic">
                                Guardian access is restricted to dependents linked via the Family Relations registry. Deactivating this account will sever real-time WhatsApp report delivery.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Modals ── */}
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