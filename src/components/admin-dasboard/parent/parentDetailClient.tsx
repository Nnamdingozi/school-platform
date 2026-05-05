'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft, Mail, Phone, 
    Bell, Trash2, UserX, AlertCircle, BookOpen,
    ShieldCheck
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useProfileStore } from '@/store/profileStore'
import { UserActionsModal } from '@/components/admin-dasboard/user-modal'
import { useUserAction } from '@/hooks/useUserAction'
import { type UserDetail, getUserById } from '@/app/actions/user-management'
import { cn } from '@/lib/utils'

interface ParentDetailClientProps {
    initialUser: UserDetail;
}

/**
 * INSTITUTIONAL PARENT DETAIL (Tier 2)
 * Rule 17: Pulls branding colors from Zustand store.
 */
export function ParentDetailClient({ initialUser }: ParentDetailClientProps) {
    const router = useRouter();
    const { profile: actorProfile } = useProfileStore();
    const [user, setUser] = useState<UserDetail>(initialUser);
    const { actionState, triggerAction, closeAction } = useUserAction();

    const primaryColor = actorProfile?.primaryColor || "#f59e0b";

    const initials = (user.name ?? user.email)
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    async function handleActionSuccess() {
        closeAction();
        if (actionState?.action === 'delete') {
            router.replace('/admin/parents');
        } else {
            // Rule 11: Refresh system truth after modification
            const updated = await getUserById(user.id, actorProfile?.schoolId ?? null);
            if (updated) setUser(updated);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8 lg:p-12 text-slate-50 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto space-y-10">

                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
                >
                    <ArrowLeft className="h-3 w-3" /> Back to Registry
                </button>

                {/* ── HEADER CARD ── */}
                <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <CardContent className="p-8 md:p-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="flex items-center gap-6">
                                <div 
                                    className="h-20 w-20 rounded-[2rem] border flex items-center justify-center text-2xl font-black italic shadow-inner"
                                    style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30`, color: primaryColor }}
                                >
                                    {initials}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                                            {user.name ?? 'Identity Pending'}
                                        </h1>
                                        <Badge className="font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-md" style={{ backgroundColor: primaryColor, color: '#000' }}>
                                            Guardian
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 pt-2">
                                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase">
                                            <Mail className="h-3.5 w-3.5" style={{ color: primaryColor }} /> {user.email}
                                        </div>
                                        {user.phone && (
                                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase">
                                                <Phone className="h-3.5 w-3.5" style={{ color: primaryColor }} /> {user.phone}
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
                                    <Trash2 className="h-4 w-4 inline mr-2" /> Purge
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* ── LEFT: DEPENDENTS ── */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-3 px-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Family Registry</h3>
                        </div>
                        
                        {!user.childrenRegistry || user.childrenRegistry.length === 0 ? (
                            <Card className="bg-slate-900/50 border-white/5 border-dashed rounded-[2rem] p-12 text-center">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">No student identities linked to this guardian.</p>
                            </Card>
                        ) : (
                            user.childrenRegistry.map((child) => (
                                <Card key={child.id} className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl hover:border-white/10 transition-all">
                                    <div className="p-8 border-b border-white/5 bg-slate-950/40 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl flex items-center justify-center font-black" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                                                {child.name?.charAt(0) || "?"}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-white uppercase italic">{child.name || "Anonymous Student"}</h4>
                                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                                                    {child.gradeName} • {child.className}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => router.push(`/admin/students/${child.id}`)}
                                            className="text-[10px] font-black uppercase hover:underline"
                                            style={{ color: primaryColor }}
                                        >
                                            Audit Profile →
                                        </button>
                                    </div>

                                    <CardContent className="p-8 space-y-8">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                <BookOpen className="h-3 w-3" /> Registered Modules
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {child.subjects.map((sub) => (
                                                    <span key={sub} className="px-3 py-1 rounded-full bg-slate-950 border border-white/5 text-[9px] font-bold text-slate-400 uppercase">
                                                        {sub}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                <ShieldCheck className="h-3 w-3" /> Recent Performance
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {child.recentAssessments.length > 0 ? child.recentAssessments.map((a) => (
                                                    <div key={a.id} className="flex justify-between items-center p-4 rounded-2xl bg-slate-950 border border-white/5 shadow-inner">
                                                        <span className="text-xs font-bold text-slate-300 uppercase truncate pr-4">{a.subject}</span>
                                                        <span className="text-sm font-black" style={{ color: primaryColor }}>{a.score}/{a.maxScore}</span>
                                                    </div>
                                                )) : (
                                                    <p className="text-[10px] text-slate-600 italic uppercase">Telemetry history empty.</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* ── SIDEBAR ── */}
                    <div className="space-y-8">
                        <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 bg-slate-950/40">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                                    <Bell className="h-4 w-4" style={{ color: primaryColor }} /> Recent Comms
                                </h3>
                            </div>
                            <CardContent className="p-6 space-y-4">
                                {user.notifications.length === 0 ? (
                                    <p className="text-[10px] text-slate-600 italic text-center py-4 uppercase">Registry Ledger Empty</p>
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

                        <div className="p-8 rounded-[2rem] bg-slate-900 border border-white/5 space-y-4">
                            <div className="flex items-center gap-3" style={{ color: primaryColor }}>
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Admin Protocol</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed italic">
                                Guardian metadata is strictly isolated. Modification or removal of this record will disrupt institutional reporting pipelines for linked dependents.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

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