'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useProfileStore } from '@/store/profileStore'
import { type UserListItem } from '@/app/actions/user-management'
import { Search, UserPlus, X, Users } from 'lucide-react'
import { UserCard, EmptyState } from '@/components/shared/user-card'

interface StudentsListClientProps {
    initialStudents: UserListItem[];
}

/**
 * INSTITUTIONAL STUDENT REGISTRY (Tier 2)
 * Rule 17: Injects school branding via Zustand.
 */
export function StudentsListClient({ initialStudents }: StudentsListClientProps) {
    const router = useRouter();
    const { profile } = useProfileStore();
    const [query, setQuery] = useState('');
    
    const primaryColor = profile?.primaryColor || "#f59e0b";

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return initialStudents;
        return initialStudents.filter(s =>
            s.name?.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.phone?.toLowerCase().includes(q)
        );
    }, [query, initialStudents]);

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8 lg:p-12 animate-in fade-in duration-500">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* ── Header ── */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                    <div className="flex items-center gap-5">
                        <div 
                            className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl shadow-school-primary/10"
                            style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
                        >
                            <Users className="h-7 w-7" style={{ color: primaryColor }} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
                                Student Registry
                            </h1>
                            <p className="text-slate-500 text-sm mt-2 font-medium italic">
                                {initialStudents.length} provisioned student identities.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/admin/invite')}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-slate-950 font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 shadow-xl shadow-school-primary/10"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <UserPlus className="w-4 h-4" />
                        Enroll Student
                    </button>
                </header>

                {/* ── Search (Rule 14: Instant UI) ── */}
                <div className="relative max-w-2xl group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-school-primary transition-colors" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="QUERY BY NAME, EMAIL OR PHONE REGISTRY..."
                        className="w-full pl-14 pr-12 py-5 rounded-2xl bg-slate-900 border border-white/5 text-white placeholder:text-slate-700 outline-none focus:border-school-primary transition-all text-xs font-bold uppercase tracking-widest shadow-2xl"
                    />
                    {query && (
                        <button onClick={() => setQuery('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* ── Content ── */}
                {filtered.length === 0 ? (
                    <EmptyState
                        query={query}
                        onInvite={() => router.push('/admin/invite')}
                        role="student"
                    />
                ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map(student => (
                            <UserCard
                                key={student.id}
                                user={student}
                                onClick={() => router.push(`/admin/students/${student.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}