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

// /**
//  * MULTI-ROLE USER CARD
//  * Rule 17: Themes based on institutional primary color.
//  * Rule 11: Correctly identifies role context.
//  */
// export function UserCard({ user, onClick }: UserCardProps) {
//     const { profile } = useProfileStore();
//     const primaryColor = profile?.primaryColor || "#f59e0b";

//     const initials = (user.name ?? user.email)
//         .split(' ')
//         .filter(Boolean)
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
//                                 Registered {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
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
//                                         <AlertCircle className="h-3 w-3" /> Pending Placement
//                                     </div>
//                                 ) : (
//                                     <div className="flex items-center gap-1.5 text-slate-400 text-[9px] font-black uppercase tracking-widest">
//                                         <BookOpen className="h-3 w-3" /> 
//                                         {user.assignedClasses[0]?.name || "Class assigned"}
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
//                     {query ? `Search Mismatch` : `Registry Ledger Empty`}
//                 </p>
//                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
//                     {query ? `No ${role} found for "${query}"` : `No institutional ${role} accounts have been provisioned.`}
//                 </p>
//             </div>
//             {!query && (
//                 <button
//                     onClick={onInvite}
//                     className="bg-slate-800 text-white font-black px-10 py-4 rounded-xl hover:bg-slate-700 transition-all text-[10px] uppercase tracking-widest border border-white/10"
//                 >
//                     Enroll New {role.charAt(0).toUpperCase() + role.slice(1)}
//                 </button>
//             )}
//         </div>
//     )
// }

// export function UserListSkeleton() {
//     return (
//         <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//             {[...Array(6)].map((_, i) => (
//                 <div key={i} className="h-48 rounded-[2rem] bg-slate-900 border border-white/5 animate-pulse" />
//             ))}
//         </div>
//     )
// }



'use client'

import React from 'react'
import { type UserListItem } from '@/app/actions/user-management'
import { Mail, Phone, BookOpen, AlertCircle, ChevronRight, UserPlus, SearchX } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useProfileStore } from '@/store/profileStore'
import { cn } from '@/lib/utils'

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface UserCardProps {
    user:    UserListItem
    onClick: () => void
}

/**
 * MULTI-ROLE USER CARD
 * Rule 11: High-fidelity Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-card, bg-surface, border-border).
 * Rule 19: Standardized Geometry [2rem].
 */
export function UserCard({ user, onClick }: UserCardProps) {
    const { profile } = useProfileStore();

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
            className={cn(
                "relative overflow-hidden cursor-pointer group transition-all duration-300",
                "bg-card border-border hover:border-school-primary/40 shadow-xl", // Rule 18
                "rounded-[2rem]" // Rule 19
            )}
        >
            <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-5">
                    
                    {/* ── DYNAMIC AVATAR (Rule 19) ── */}
                    <div 
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-school-primary/20 bg-school-primary/10 transition-colors shadow-inner"
                    >
                        <span className="text-sm font-extrabold italic text-school-primary">
                            {initials}
                        </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-4">
                        <div className="space-y-1">
                            {/* Rule 11: Registry Header Typography */}
                            <p className="text-lg font-extrabold text-foreground uppercase italic tracking-tighter truncate leading-none">
                                {user.name ?? 'Identity Pending'}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest italic">
                                Registered {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                            </p>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-border">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-3.5 w-3.5 text-school-primary/60" />
                                <p className="text-[10px] font-bold truncate uppercase tracking-tight">{user.email}</p>
                            </div>

                            {user.phone && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-3.5 w-3.5 text-school-primary/60" />
                                    <p className="text-[10px] font-bold uppercase tracking-tight">{user.phone}</p>
                                </div>
                            )}
                        </div>

                        {/* ── LINKAGE TELEMETRY ── */}
                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-2">
                                {isUnassigned ? (
                                    <div className="flex items-center gap-2 text-amber-500 text-[9px] font-bold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                                        <AlertCircle className="h-3.5 w-3.5" /> Pending Placement
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-muted-foreground text-[9px] font-bold uppercase tracking-widest">
                                        <BookOpen className="h-3.5 w-3.5 text-school-primary" /> 
                                        <span className="truncate max-w-[120px]">
                                            {user.assignedClasses[0]?.name || "Class assigned"}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-surface border border-border group-hover:bg-school-primary transition-all shadow-sm">
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-on-school-primary transition-all group-hover:translate-x-0.5" />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

/**
 * EMPTY STATE (Rule 18/19)
 */
export function EmptyState({ query, onInvite, role }: { query: string, onInvite: () => void, role: string }) {
    return (
        <div className="py-24 md:py-32 text-center space-y-8 bg-card/40 rounded-[3rem] border-2 border-dashed border-border animate-in fade-in zoom-in-95 duration-500 px-6">
            <div className="h-20 w-20 bg-surface rounded-[2rem] flex items-center justify-center mx-auto shadow-lg border border-border">
                {query ? <SearchX className="h-10 w-10 text-muted-foreground/30" /> : <UserPlus className="h-10 w-10 text-muted-foreground/30" />}
            </div>
            
            <div className="space-y-3">
                <h2 className="text-foreground font-extrabold text-2xl md:text-3xl uppercase italic tracking-tighter">
                    {query ? `Registry Mismatch` : `Registry Ledger Empty`}
                </h2>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                    {query ? `No ${role} found for "${query}" in the institutional tier.` : `No institutional ${role} accounts have been provisioned yet.`}
                </p>
            </div>

            {!query && (
                <button
                    onClick={onInvite}
                    className="inline-flex items-center gap-3 bg-school-primary text-on-school-primary font-extrabold px-10 py-4 rounded-2xl hover:brightness-110 active:scale-95 transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-school-primary/20"
                >
                    <UserPlus className="h-4 w-4" /> Enroll New {role}
                </button>
            )}
        </div>
    )
}

/**
 * LIST SKELETON (Rule 20)
 */
export function UserListSkeleton() {
    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <div 
                    key={i} 
                    className="h-56 rounded-[2rem] bg-card border border-border animate-pulse flex items-center justify-center"
                >
                    <div className="h-4 w-24 bg-surface rounded-full opacity-50" />
                </div>
            ))}
        </div>
    )
}