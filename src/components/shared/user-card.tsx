// 'use client'

// import { UserListItem } from '@/app/actions/user-management'
// import { Mail, Phone, BookOpen, AlertCircle } from 'lucide-react'
// import { Card, CardContent } from '@/components/ui/card'

// interface UserCardProps {
//     user:    UserListItem
//     onClick: () => void
// }

// export function UserCard({ user, onClick }: UserCardProps) {
//     const initials = (user.name ?? user.email)
//         .split(' ')
//         .map(n => n[0])
//         .slice(0, 2)
//         .join('')
//         .toUpperCase()

//     const isUnassigned = user.assignedClasses.length === 0

//     return (
//         <Card
//             onClick={onClick}
//             className="relative overflow-hidden bg-school-secondary-900 border-school-secondary-700 hover:border-school-primary/40 hover:bg-school-secondary-800/60 transition-all duration-200 cursor-pointer group"
//         >
//             {/* Top glow */}
//             <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-school-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

//             <CardContent className="p-4 sm:p-5">
//                 <div className="flex items-start gap-3">

//                     {/* Avatar */}
//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20">
//                         <span className="text-sm font-black text-school-primary">
//                             {initials}
//                         </span>
//                     </div>

//                     {/* Info */}
//                     <div className="flex-1 min-w-0 space-y-2">

//                         {/* Name */}
//                         <p className="text-sm font-bold text-white truncate">
//                             {user.name ?? '—'}
//                         </p>

//                         {/* Email */}
//                         <div className="flex items-center gap-1.5">
//                             <Mail className="h-3 w-3 text-school-secondary-400 shrink-0" />
//                             <p className="text-xs text-school-secondary-300 truncate">
//                                 {user.email}
//                             </p>
//                         </div>

//                         {/* Phone */}
//                         {user.phone && (
//                             <div className="flex items-center gap-1.5">
//                                 <Phone className="h-3 w-3 text-school-secondary-400 shrink-0" />
//                                 <p className="text-xs text-school-secondary-300 truncate">
//                                     {user.phone}
//                                 </p>
//                             </div>
//                         )}

//                         {/* Classes */}
//                         <div className="flex items-center gap-1.5 pt-1 border-t border-school-secondary-700">
//                             {isUnassigned ? (
//                                 <>
//                                     <AlertCircle className="h-3 w-3 text-amber-400 shrink-0" />
//                                     <span className="text-[11px] font-semibold text-amber-400">
//                                         Unassigned
//                                     </span>
//                                 </>
//                             ) : (
//                                 <>
//                                     <BookOpen className="h-3 w-3 text-school-secondary-400 shrink-0" />
//                                     <span className="text-[11px] text-school-secondary-300 truncate">
//                                         {user.assignedClasses
//                                             .map(c => c.name)
//                                             .join(', ')}
//                                     </span>
//                                 </>
//                             )}
//                         </div>

//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

// // ── Skeleton ───────────────────────────────────────────────────────────────────
// export function UserListSkeleton() {
//     return (
//         <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//             {[...Array(6)].map((_, i) => (
//                 <Card key={i} className="bg-school-secondary-900 border-school-secondary-700">
//                     <CardContent className="p-4 sm:p-5">
//                         <div className="flex items-start gap-3">
//                             <div className="h-10 w-10 rounded-xl bg-school-secondary-700 animate-pulse shrink-0" />
//                             <div className="flex-1 space-y-2">
//                                 <div className="h-3 w-32 rounded bg-school-secondary-700 animate-pulse" />
//                                 <div className="h-3 w-40 rounded bg-school-secondary-700 animate-pulse" />
//                                 <div className="h-3 w-24 rounded bg-school-secondary-700 animate-pulse" />
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             ))}
//         </div>
//     )
// }

// // ── Empty State ────────────────────────────────────────────────────────────────
// interface EmptyStateProps {
//     query:    string
//     onInvite: () => void
//     role:     'teacher' | 'student' | 'parent'
// }

// export function EmptyState({ query, onInvite, role }: EmptyStateProps) {
//     return (
//         <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
//             <p className="text-white font-bold text-lg">
//                 {query
//                     ? `No ${role}s match "${query}"`
//                     : `No ${role}s registered yet`
//                 }
//             </p>
//             <p className="text-school-secondary-400 text-sm max-w-xs">
//                 {query
//                     ? 'Try a different name, email or phone number.'
//                     : `Invite ${role}s to your school and they will appear here.`
//                 }
//             </p>
//             {!query && (
//                 <button
//                     onClick={onInvite}
//                     className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold text-sm transition-all"
//                 >
//                     Invite {role.charAt(0).toUpperCase() + role.slice(1)}
//                 </button>
//             )}
//         </div>
//     )
// }


// 'use client'

// import { type UserListItem } from '@/app/actions/user-management'
// import { Mail, Phone, BookOpen, AlertCircle, ChevronRight } from 'lucide-react'
// import { Card, CardContent } from '@/components/ui/card'
// import { useProfileStore } from '@/store/profileStore'
// import { cn } from '@/lib/utils'

// interface UserCardProps {
//     user:    UserListItem
//     onClick: () => void
// }

// export function UserCard({ user, onClick }: UserCardProps) {
//     const { profile } = useProfileStore();
//     const primaryColor = profile?.primaryColor || "#f59e0b";

//     const initials = (user.name ?? user.email)
//         .split(' ')
//         .map(n => n[0])
//         .slice(0, 2)
//         .join('')
//         .toUpperCase()

//     const isUnassigned = user.assignedClasses.length === 0

//     return (
//         <Card
//             onClick={onClick}
//             className="relative overflow-hidden bg-slate-900 border-white/5 hover:border-school-primary/30 transition-all duration-300 cursor-pointer group rounded-[2rem] shadow-xl"
//         >
//             <CardContent className="p-8">
//                 <div className="flex items-start gap-5">
                    
//                     {/* Dynamic Avatar */}
//                     <div 
//                         className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-colors shadow-inner"
//                         style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
//                     >
//                         <span className="text-sm font-black" style={{ color: primaryColor }}>
//                             {initials}
//                         </span>
//                     </div>

//                     <div className="flex-1 min-w-0 space-y-3">
//                         <div>
//                             <p className="text-lg font-black text-white uppercase italic tracking-tight truncate leading-none">
//                                 {user.name ?? 'Identity Pending'}
//                             </p>
//                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
//                                 Registered Family Head
//                             </p>
//                         </div>

//                         <div className="space-y-1.5 pt-2 border-t border-white/5">
//                             <div className="flex items-center gap-2 text-slate-400">
//                                 <Mail className="h-3 w-3" />
//                                 <p className="text-[10px] font-medium truncate uppercase">{user.email}</p>
//                             </div>

//                             {user.phone && (
//                                 <div className="flex items-center gap-2 text-slate-400">
//                                     <Phone className="h-3 w-3" />
//                                     <p className="text-[10px] font-medium uppercase">{user.phone}</p>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Linkage Info */}
//                         <div className="flex items-center justify-between pt-4">
//                             <div className="flex items-center gap-2">
//                                 {isUnassigned ? (
//                                     <div className="flex items-center gap-1.5 text-amber-500 text-[9px] font-black uppercase tracking-widest bg-amber-500/5 px-2 py-1 rounded">
//                                         <AlertCircle className="h-3 w-3" /> No Student Link
//                                     </div>
//                                 ) : (
//                                     <div className="flex items-center gap-1.5 text-slate-400 text-[9px] font-black uppercase tracking-widest">
//                                         <BookOpen className="h-3 w-3" /> 
//                                         {user.assignedClasses.length} Cohorts
//                                     </div>
//                                 )}
//                             </div>
//                             <ChevronRight className="h-4 w-4 text-slate-800 group-hover:text-school-primary transition-all group-hover:translate-x-1" />
//                         </div>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

// export function EmptyState({ query, onInvite, role }: { query: string, onInvite: () => void, role: string }) {
//     return (
//         <div className="py-32 text-center bg-slate-900/30 rounded-[3rem] border border-dashed border-white/5 space-y-6">
//             <div className="space-y-2">
//                 <p className="text-white font-black text-2xl uppercase italic tracking-tighter">
//                     {query ? `Search Mismatch` : `Registry Empty`}
//                 </p>
//                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
//                     {query ? `No ${role} identities found for "${query}"` : `No institutional ${role} accounts discovered.`}
//                 </p>
//             </div>
//             {!query && (
//                 <button
//                     onClick={onInvite}
//                     className="bg-slate-800 text-white font-black px-10 py-4 rounded-xl hover:bg-slate-700 transition-all text-[10px] uppercase tracking-widest border border-white/10"
//                 >
//                     Provision New {role}
//                 </button>
//             )}
//         </div>
//     )
// }

'use client'

import { type UserListItem } from '@/app/actions/user-management'
import { Mail, Phone, BookOpen, AlertCircle, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useProfileStore } from '@/store/profileStore'
import { cn } from '@/lib/utils'

interface UserCardProps {
    user:    UserListItem
    onClick: () => void
}

/**
 * MULTI-ROLE USER CARD
 * Rule 17: Themes based on institutional primary color.
 * Rule 11: Correctly identifies role context.
 */
export function UserCard({ user, onClick }: UserCardProps) {
    const { profile } = useProfileStore();
    const primaryColor = profile?.primaryColor || "#f59e0b";

    const initials = (user.name ?? user.email)
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    const isUnassigned = user.assignedClasses.length === 0

    return (
        <Card
            onClick={onClick}
            className="relative overflow-hidden bg-slate-900 border-white/5 hover:border-school-primary/30 transition-all duration-300 cursor-pointer group rounded-[2rem] shadow-xl"
        >
            <CardContent className="p-8">
                <div className="flex items-start gap-5">
                    
                    {/* Dynamic Avatar */}
                    <div 
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-colors shadow-inner"
                        style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
                    >
                        <span className="text-sm font-black" style={{ color: primaryColor }}>
                            {initials}
                        </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                        <div>
                            <p className="text-lg font-black text-white uppercase italic tracking-tight truncate leading-none">
                                {user.name ?? 'Identity Pending'}
                            </p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                                Registered {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                            </p>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Mail className="h-3 w-3" />
                                <p className="text-[10px] font-medium truncate uppercase">{user.email}</p>
                            </div>

                            {user.phone && (
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Phone className="h-3 w-3" />
                                    <p className="text-[10px] font-medium uppercase">{user.phone}</p>
                                </div>
                            )}
                        </div>

                        {/* Linkage Info */}
                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-2">
                                {isUnassigned ? (
                                    <div className="flex items-center gap-1.5 text-amber-500 text-[9px] font-black uppercase tracking-widest bg-amber-500/5 px-2 py-1 rounded">
                                        <AlertCircle className="h-3 w-3" /> Pending Placement
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                                        <BookOpen className="h-3 w-3" /> 
                                        {user.assignedClasses[0]?.name || "Class assigned"}
                                    </div>
                                )}
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-800 group-hover:text-school-primary transition-all group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function EmptyState({ query, onInvite, role }: { query: string, onInvite: () => void, role: string }) {
    return (
        <div className="py-32 text-center bg-slate-900/30 rounded-[3rem] border border-dashed border-white/5 space-y-6">
            <div className="space-y-2">
                <p className="text-white font-black text-2xl uppercase italic tracking-tighter">
                    {query ? `Search Mismatch` : `Registry Ledger Empty`}
                </p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                    {query ? `No ${role} found for "${query}"` : `No institutional ${role} accounts have been provisioned.`}
                </p>
            </div>
            {!query && (
                <button
                    onClick={onInvite}
                    className="bg-slate-800 text-white font-black px-10 py-4 rounded-xl hover:bg-slate-700 transition-all text-[10px] uppercase tracking-widest border border-white/10"
                >
                    Enroll New {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
            )}
        </div>
    )
}

export function UserListSkeleton() {
    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 rounded-[2rem] bg-slate-900 border border-white/5 animate-pulse" />
            ))}
        </div>
    )
}