'use client'

import { UserListItem } from '@/app/actions/user-management'
import { Mail, Phone, BookOpen, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface UserCardProps {
    user:    UserListItem
    onClick: () => void
}

export function UserCard({ user, onClick }: UserCardProps) {
    const initials = (user.name ?? user.email)
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    const isUnassigned = user.assignedClasses.length === 0

    return (
        <Card
            onClick={onClick}
            className="relative overflow-hidden bg-school-secondary-900 border-school-secondary-700 hover:border-school-primary/40 hover:bg-school-secondary-800/60 transition-all duration-200 cursor-pointer group"
        >
            {/* Top glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-school-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-3">

                    {/* Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20">
                        <span className="text-sm font-black text-school-primary">
                            {initials}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2">

                        {/* Name */}
                        <p className="text-sm font-bold text-white truncate">
                            {user.name ?? '—'}
                        </p>

                        {/* Email */}
                        <div className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3 text-school-secondary-400 shrink-0" />
                            <p className="text-xs text-school-secondary-300 truncate">
                                {user.email}
                            </p>
                        </div>

                        {/* Phone */}
                        {user.phone && (
                            <div className="flex items-center gap-1.5">
                                <Phone className="h-3 w-3 text-school-secondary-400 shrink-0" />
                                <p className="text-xs text-school-secondary-300 truncate">
                                    {user.phone}
                                </p>
                            </div>
                        )}

                        {/* Classes */}
                        <div className="flex items-center gap-1.5 pt-1 border-t border-school-secondary-700">
                            {isUnassigned ? (
                                <>
                                    <AlertCircle className="h-3 w-3 text-amber-400 shrink-0" />
                                    <span className="text-[11px] font-semibold text-amber-400">
                                        Unassigned
                                    </span>
                                </>
                            ) : (
                                <>
                                    <BookOpen className="h-3 w-3 text-school-secondary-400 shrink-0" />
                                    <span className="text-[11px] text-school-secondary-300 truncate">
                                        {user.assignedClasses
                                            .map(c => c.name)
                                            .join(', ')}
                                    </span>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
export function UserListSkeleton() {
    return (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-school-secondary-900 border-school-secondary-700">
                    <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-xl bg-school-secondary-700 animate-pulse shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-32 rounded bg-school-secondary-700 animate-pulse" />
                                <div className="h-3 w-40 rounded bg-school-secondary-700 animate-pulse" />
                                <div className="h-3 w-24 rounded bg-school-secondary-700 animate-pulse" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

// ── Empty State ────────────────────────────────────────────────────────────────
interface EmptyStateProps {
    query:    string
    onInvite: () => void
    role:     'teacher' | 'student' | 'parent'
}

export function EmptyState({ query, onInvite, role }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <p className="text-white font-bold text-lg">
                {query
                    ? `No ${role}s match "${query}"`
                    : `No ${role}s registered yet`
                }
            </p>
            <p className="text-school-secondary-400 text-sm max-w-xs">
                {query
                    ? 'Try a different name, email or phone number.'
                    : `Invite ${role}s to your school and they will appear here.`
                }
            </p>
            {!query && (
                <button
                    onClick={onInvite}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold text-sm transition-all"
                >
                    Invite {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
            )}
        </div>
    )
}