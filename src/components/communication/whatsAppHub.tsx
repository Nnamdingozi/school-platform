'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import {
    MessageCircle, Zap, History, ShoppingCart,
    Clock, Loader2, BarChart3, AlertCircle,
    TrendingDown
} from 'lucide-react'
import {
    getCommunicationStats,
    CommunicationStats,
} from '@/app/actions/communication.action'
import { format } from 'date-fns'


// ── Helpers ────────────────────────────────────────────────────────────────────
function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60)     return 'just now'
    if (seconds < 3600)   return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400)  return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return format(new Date(date), 'dd MMM yyyy')
}

function getRoleColor(role: string | null): string {
    switch (role?.toUpperCase()) {
        case 'SCHOOL_ADMIN': return 'text-school-primary bg-school-primary/10 border-school-primary/20'
        case 'SUPER_ADMIN':  return 'text-purple-400 bg-purple-500/10 border-purple-500/20'
        case 'TEACHER':      return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
        default:             return 'text-school-secondary-400 bg-school-secondary-800 border-school-secondary-700'
    }
}

function formatRole(role: string | null): string {
    if (!role) return 'Unknown'
    return role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({
    label,
    value,
    sub,
    icon: Icon,
    accent,
}: {
    label:  string
    value:  number | string
    sub?:   string
    icon:   React.ElementType
    accent: string
}) {
    
    return (
        <Card className="bg-school-secondary-900 border-school-secondary-700">
            <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                        <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
                            {label}
                        </p>
                        <p className="text-2xl font-black text-white leading-none">
                            {value}
                        </p>
                        {sub && (
                            <p className="text-[11px] text-school-secondary-400">
                                {sub}
                            </p>
                        )}
                    </div>
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${accent}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function WhatsAppHub({ schoolId }: { schoolId: string }) {
    const [stats,   setStats]   = useState<CommunicationStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState<string | null>(null)
    
const router = useRouter()


    // const purchaseHref = 'mailto:support@yourplatform.com?subject=Purchase%20WhatsApp%20Credits'
    

    useEffect(() => {
        if (!schoolId) return
        setLoading(true)
        getCommunicationStats(schoolId).then(res => {
            if (res.success && res.stats) {
                setStats(res.stats)
            } else {
                setError(res.error ?? 'Failed to load communication data.')
            }
            setLoading(false)
        })
    }, [schoolId])

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
            <p className="text-xs text-school-secondary-500 font-mono uppercase tracking-widest">Initialising_Hub...</p>
        </div>
    )

    if (error || !stats) return (
        <Card className="bg-school-secondary-900 border-red-500/20">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                </div>
                <p className="text-sm font-bold uppercase tracking-tighter text-red-400">Sync_Error</p>
                <p className="text-xs text-school-secondary-400 max-w-xs">{error ?? 'Data connection interrupted.'}</p>
            </CardContent>
        </Card> 
    )

    const creditStatus =
        stats.totalRemaining > 20
            ? { label: 'Healthy',  color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', bar: 'bg-green-500'  }
            : stats.totalRemaining > 5
            ? { label: 'Low',      color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: 'bg-amber-500'  }
            : { label: 'Critical', color: 'text-red-400',   bg: 'bg-red-500/10',   border: 'border-red-500/20',   bar: 'bg-red-500'    }

    return (
        <div className="space-y-4">
            {/* Stat cards */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Purchased" value={stats.totalPurchased} sub="All-time credit balance" icon={ShoppingCart} accent="bg-school-primary/10 border-school-primary/20 text-school-primary" />
                <StatCard label="Remaining Credits" value={stats.totalRemaining} sub={`Status: ${creditStatus.label}`} icon={Zap} accent={`${creditStatus.bg} ${creditStatus.border} ${creditStatus.color}`} />
                <StatCard label="Total Used" value={stats.totalUsed} sub="Messages sent" icon={TrendingDown} accent="bg-blue-500/10 border-blue-500/20 text-blue-400" />
                <StatCard label="Usage Rate" value={`${stats.usagePercent}%`} sub="Of purchased credits" icon={BarChart3} accent="bg-purple-500/10 border-purple-500/20 text-purple-400" />
            </div>

            {/* Credit health bar */}
            <Card className="bg-school-secondary-900 border-school-secondary-700">
                <CardContent className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2.5">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${creditStatus.bg} ${creditStatus.border}`}>
                                <MessageCircle className={`h-4 w-4 ${creditStatus.color}`} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white uppercase tracking-tighter italic">Credit Balance</p>
                                <p className={`text-[11px] font-semibold ${creditStatus.color}`}>{creditStatus.label} — {stats.totalRemaining} units valid</p>
                            </div>
                        </div>

                        {/* ✅ FIXED: Added <a tag */}
                        <button
    onClick={() => router.push('/admin/credits')}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 text-xs font-bold transition-all shrink-0"
>
    <ShoppingCart className="h-3.5 w-3.5" />
    Buy Credits
</button>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-school-secondary-500 font-bold uppercase tracking-widest">
                            <span>{stats.totalUsed} used</span>
                            <span>{stats.totalPurchased} total</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-school-secondary-800 shadow-inner">
                            <div className={`h-2 rounded-full transition-all duration-500 ${creditStatus.bar}`} style={{ width: `${Math.min(stats.usagePercent, 100)}%` }} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                {/* Top users */}
                <Card className="bg-school-secondary-900 border-school-secondary-700 rounded-3xl overflow-hidden shadow-2xl">
                    <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-5">
                        <div className="flex items-center gap-2.5 font-black uppercase tracking-widest text-[10px] text-white italic">
                            <BarChart3 className="h-3.5 w-3.5 text-school-primary" />
                            Top Credit Consumers
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {stats.topUsers.length === 0 ? (
                            <div className="py-12 text-center text-xs text-school-secondary-600 italic">No usage recorded</div>
                        ) : (
                            <div className="divide-y divide-school-secondary-800">
                                {stats.topUsers.map((user, i) => (
                                    <div key={user.name ?? i} className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-black ${i === 0 ? 'bg-school-primary text-school-secondary-950 shadow-lg shadow-school-primary/20' : 'bg-school-secondary-800 text-slate-400'}`}>{i + 1}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-white uppercase tracking-tight italic">{user.name || 'Anonymous'}</p>
                                            <span className={`inline-flex px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase border mt-1 ${getRoleColor(user.role)}`}>{formatRole(user.role)}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-white">{user.total}</p>
                                            <p className="text-[8px] text-school-secondary-500 uppercase font-bold tracking-widest">Units</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Usage history */}
                <Card className="bg-school-secondary-900 border-school-secondary-700 rounded-3xl overflow-hidden shadow-2xl">
                    <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-5">
                        <div className="flex items-center gap-2.5 font-black uppercase tracking-widest text-[10px] text-white italic">
                            <History className="h-3.5 w-3.5 text-blue-400" />
                            Transmission Registry
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {stats.recentLogs.length === 0 ? (
                            <div className="py-12 text-center text-xs text-school-secondary-600 italic">No activity registered</div>
                        ) : (
                            <div className="divide-y divide-school-secondary-800 max-h-[400px] overflow-y-auto scrollbar-hide">
                                {stats.recentLogs.map(log => (
                                    <div key={log.id} className="flex items-start gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-school-secondary-800 border border-white/5 group-hover:border-school-primary/20 transition-all mt-0.5"><MessageCircle className="h-3.5 w-3.5 text-school-secondary-500 group-hover:text-school-primary" /></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-white uppercase tracking-tight">{log.actorName ?? 'System'}</p>
                                            <div className="flex items-center gap-2 mt-1 text-[9px] text-school-secondary-500 font-bold uppercase tracking-widest"><Clock className="h-2.5 w-2.5" />{timeAgo(log.createdAt)}</div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-amber-500 uppercase">-{log.credits} Unit</span>
                                            <p className="text-[8px] text-school-secondary-500 uppercase font-black">Settled</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}