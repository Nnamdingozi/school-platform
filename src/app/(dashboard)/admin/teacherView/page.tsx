'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProfileStore } from '@/store/profileStore'
import { getTeachersBySchool, UserListItem } from '@/app/actions/user-management'
import { Search, UserPlus, X } from 'lucide-react'
import { toast } from 'sonner'
import { UserCard, UserListSkeleton, EmptyState } from '@/components/admin-dasboard/user-card'

export default function TeachersPage() {
    const router   = useRouter()
    const { profile } = useProfileStore()
    const schoolId = profile?.schoolId ?? ''

    const [teachers,  setTeachers]  = useState<UserListItem[]>([])
    const [filtered,  setFiltered]  = useState<UserListItem[]>([])
    const [loading,   setLoading]   = useState(true)
    const [query,     setQuery]     = useState('')

    useEffect(() => {
        if (!schoolId) return
        setLoading(true)
        getTeachersBySchool(schoolId)
            .then(data => {
                setTeachers(data)
                setFiltered(data)
                setLoading(false)
            })
            .catch(() => {
                toast.error('Failed to load teachers.')
                setLoading(false)
            })
    }, [schoolId])

    useEffect(() => {
        const q = query.toLowerCase()
        setFiltered(
            teachers.filter(t =>
                t.name?.toLowerCase().includes(q) ||
                t.email.toLowerCase().includes(q) ||
                t.phone?.toLowerCase().includes(q)
            )
        )
    }, [query, teachers])

    return (
        <div className="min-h-screen bg-school-secondary-950 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* ── Header ── */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">
                            Teachers
                        </h1>
                        <p className="text-school-secondary-100/50 text-sm mt-1">
                            {teachers.length} registered teacher{teachers.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/admin/invite-users')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold text-sm transition-all"
                    >
                        <UserPlus className="w-4 h-4" />
                        Invite Teacher
                    </button>
                </div>

                {/* ── Search ── */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-400 pointer-events-none" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search by name, email or phone..."
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-school-secondary-900 border border-school-secondary-700 text-white placeholder:text-school-secondary-400 focus:border-school-primary focus:outline-none text-sm"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-school-secondary-400 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* ── Content ── */}
                {loading ? (
                    <UserListSkeleton />
                ) : filtered.length === 0 ? (
                    <EmptyState
                        query={query}
                        onInvite={() => router.push('/admin/invite-users')}
                        role="teacher"
                    />
                ) : (
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map(teacher => (
                            <UserCard
                                key={teacher.id}
                                user={teacher}
                                onClick={() => router.push(`/admin/teachers/${teacher.id}`)}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}