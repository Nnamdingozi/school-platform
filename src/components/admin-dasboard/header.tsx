
// "use client"

// import React, { useState, useEffect, useRef, useCallback } from "react"
// import { useRouter } from "next/navigation"
// import {
//     Bell, Search, ChevronDown, User, Settings,
//     MessageCircle, GraduationCap, Users,
//     BookOpen, X, Loader2,
// } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import {
//     DropdownMenu, DropdownMenuContent, DropdownMenuItem,
//     DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { useProfileStore } from "@/store/profileStore"
// import { useSchool } from "@/context/schoolProvider"
// import { LogoutButton } from "@/components/shared/logOutButton"
// import { Role } from "@prisma/client"
// import { cn } from "@/lib/utils"
// import { getErrorMessage } from "@/lib/error-handler"

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface ProfileResult {
//     id:    string
//     name:  string | null
//     email: string
//     role:  Role
// }

// interface ClassResult {
//     id:      string
//     name:    string
//     grade:   { displayName: string }
//     teacher: { name: string | null }
// }

// interface SearchCategory<T> {
//     data:  T[]
//     total: number
// }

// interface SearchResults {
//     teachers: SearchCategory<ProfileResult>
//     students: SearchCategory<ProfileResult>
//     parents:  SearchCategory<ProfileResult>
//     classes:  SearchCategory<ClassResult>
// }

// type SearchState = 'idle' | 'searching' | 'done' | 'error'

// const MIN_QUERY_LENGTH = 3
// const DEBOUNCE_MS      = 300

// // ── Hooks ────────────────────────────────────────────────────────────────────

// function useDebounce<T>(value: T, delay: number): T {
//     const [debounced, setDebounced] = useState<T>(value)
//     useEffect(() => {
//         const timer = setTimeout(() => setDebounced(value), delay)
//         return () => clearTimeout(timer)
//     }, [value, delay])
//     return debounced
// }

// // ── Main Component ───────────────────────────────────────────────────────────

// /**
//  * COMMAND CENTER HEADER (Tier 2)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry (rounded-2xl).
//  * Rule 21: Scale Protocol for mathematical brand tints.
//  */
// export function Header() {
//     const router      = useRouter()
//     const { profile } = useProfileStore()
//     const { school }  = useSchool()

//     const [query,        setQuery]        = useState<string>('')
//     const [results,      setResults]      = useState<SearchResults | null>(null)
//     const [searchState,  setSearchState]  = useState<SearchState>('idle')
//     const [showDropdown, setShowDropdown] = useState<boolean>(false)
//     const searchRef      = useRef<HTMLDivElement>(null)
//     const debouncedQuery = useDebounce<string>(query, DEBOUNCE_MS)

//     const isAdmin = profile?.role === Role.SCHOOL_ADMIN || profile?.role === Role.SUPER_ADMIN

//     const displayName: string  = profile?.name  ?? 'User'
//     const displayEmail: string = profile?.email ?? ''
//     const displayRole: string  = profile?.role
//         ? profile.role.toLowerCase().replace(/_/g, ' ')
//         : 'user'
//     const schoolName: string = school?.name ?? profile?.school?.name ?? 'School Platform'
//     const schoolId: string   = profile?.schoolId ?? ''

//     const initials: string = displayName
//         .split(' ')
//         .filter(Boolean)
//         .map((n) => n[0])
//         .slice(0, 2)
//         .join('')
//         .toUpperCase()

//     const notifications = profile?.notifications ?? []
//     const unreadCount: number = notifications.filter((n) => !n.read).length

//     const performSearch = useCallback(async (q: string) => {
//         if (q.length < MIN_QUERY_LENGTH || !schoolId) {
//             setResults(null)
//             setSearchState('idle')
//             setShowDropdown(false)
//             return
//         }
//         setSearchState('searching')
//         setShowDropdown(true)
//         try {
//             const res = await fetch(
//                 `/api/search?q=${encodeURIComponent(q)}&schoolId=${encodeURIComponent(schoolId)}`
//             )
//             if (!res.ok) throw new Error('Registry query failure')
//             const json = await res.json() as { results: SearchResults | null }
//             setResults(json.results)
//             setSearchState('done')
//         } catch (err) {
//             console.error(`[SEARCH_FAULT]: ${getErrorMessage(err)}`)
//             setResults(null)
//             setSearchState('error')
//         }
//     }, [schoolId])

//     useEffect(() => {
//         if (isAdmin) performSearch(debouncedQuery)
//     }, [debouncedQuery, performSearch, isAdmin])

//     useEffect(() => {
//         const handler = (e: MouseEvent) => {
//             if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
//                 setShowDropdown(false)
//             }
//         }
//         document.addEventListener('mousedown', handler)
//         return () => document.removeEventListener('mousedown', handler)
//     }, [])

//     const clearSearch = () => {
//         setQuery('')
//         setResults(null)
//         setSearchState('idle')
//         setShowDropdown(false)
//     }

//     const handleResultClick = (item: ProfileResult | ClassResult, type: 'profile' | 'class') => {
//         clearSearch()
//         if (type === 'class') {
//             router.push(`/admin/classes/${(item as ClassResult).id}`)
//             return
//         }
//         const p = item as ProfileResult
//         switch (p.role) {
//             case Role.TEACHER: router.push(`/admin/teacherView/${p.id}`); break
//             case Role.STUDENT: router.push(`/admin/studentView/${p.id}`); break
//             case Role.PARENT:  router.push(`/admin/parentView/${p.id}`);  break
//             default: break
//         }
//     }

//     // ── Result count helper ────────────────────────────────────────────────────────
// function hasAnyResults(results: SearchResults | null): boolean {
//     if (!results) return false
//     return (
//         results.teachers.total > 0 ||
//         results.students.total > 0 ||
//         results.parents.total  > 0 ||
//         results.classes.total  > 0
//     )
// }


//     if (!isAdmin) return null

//     return (
//         <header className="sticky top-0 z-40 h-16 w-full bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-8">
//             <div className="flex h-full items-center justify-between gap-4">
                
//                 {/* ── LEFT: REGISTRY IDENTITY ── */}
//                 <div className="flex items-center gap-8 min-w-0">
//                     <h1 className="text-base font-extrabold text-school-primary uppercase italic tracking-tighter truncate max-w-[180px] hidden sm:block">
//                         {schoolName}
//                     </h1>

//                     {/* Registry Search (Rule 18/19) */}
//                     <div ref={searchRef} className="relative hidden md:block group">
//                         <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors z-10 pointer-events-none" />

//                         <Input
//                             type="text"
//                             placeholder="Query Registry Node..."
//                             value={query}
//                             onChange={(e) => setQuery(e.target.value)}
//                             onFocus={() => { if (query.length >= MIN_QUERY_LENGTH) setShowDropdown(true) }}
//                             className="w-[320px] lg:w-[400px] pl-11 pr-10 bg-surface border-border text-foreground placeholder:text-muted-foreground/30 focus:ring-2 focus:ring-school-primary-200 rounded-xl transition-all"
//                         />

//                         {query.length > 0 && (
//                             <button
//                                 onClick={clearSearch}
//                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all p-1"
//                             >
//                                 <X className="h-3.5 w-3.5" />
//                             </button>
//                         )}

//                         {/* Results Dropdown (Rule 19) */}
//                         {showDropdown && query.length >= MIN_QUERY_LENGTH && (
//                             <div className="absolute top-full left-0 mt-3 w-full rounded-[1.5rem] border border-border bg-card shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
//                                 {searchState === 'searching' ? (
//                                     <div className="flex items-center justify-center gap-3 py-10">
//                                         <Loader2 className="h-5 w-5 animate-spin text-school-primary" />
//                                         <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Synchronizing Registry...</span>
//                                     </div>
//                                 ) : searchState === 'error' ? (
//                                     <div className="py-10 text-center text-[10px] font-bold uppercase text-destructive tracking-widest italic">
//                                         Registry Protocol Breach: Sync Failure
//                                     </div>
//                                 ) : !hasAnyResults(results) ? (
//                                     <div className="py-10 text-center space-y-2">
//                                         <p className="text-sm font-bold text-foreground italic">No matching nodes</p>
//                                         <p className="text-[10px] text-muted-foreground uppercase tracking-widest italic leading-relaxed">Check syntax or refine identity query</p>
//                                     </div>
//                                 ) : (
//                                     <ScrollArea className="max-h-[480px]">
//                                         <div className="py-2">
//                                             {results && (
//                                                 <>
//                                                     <SearchCategorySection results={results.teachers} label="Teachers" icon={<GraduationCap className="h-3.5 w-3.5" />} color="text-blue-600" bg="bg-blue-50" onClick={(t) => handleResultClick(t, 'profile')} />
//                                                     <SearchCategorySection results={results.students} label="Students" icon={<Users className="h-3.5 w-3.5" />} color="text-emerald-600" bg="bg-emerald-50" onClick={(s) => handleResultClick(s, 'profile')} />
//                                                     <SearchCategorySection results={results.parents} label="Parents" icon={<User className="h-3.5 w-3.5" />} color="text-purple-600" bg="bg-purple-50" onClick={(p) => handleResultClick(p, 'profile')} />
                                                    
//                                                     {results.classes.total > 0 && (
//                                                         <div className="px-2 pb-2">
//                                                             <div className="px-3 py-2">
//                                                                 <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/40">Class Nodes</p>
//                                                             </div>
//                                                             {results.classes.data.map(c => (
//                                                                 <button
//                                                                     key={c.id}
//                                                                     onClick={() => handleResultClick(c, 'class')}
//                                                                     className="flex w-full items-center gap-4 px-4 py-3 hover:bg-muted/40 rounded-xl transition-all group"
//                                                                 >
//                                                                     <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary-50 border border-school-primary-200">
//                                                                         <BookOpen className="h-4 w-4 text-school-primary" />
//                                                                     </div>
//                                                                     <div className="text-left min-w-0">
//                                                                         <p className="text-sm font-bold text-foreground truncate group-hover:text-school-primary transition-colors">{c.name}</p>
//                                                                         <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">{c.grade.displayName} • {c.teacher.name || 'Unassigned'}</p>
//                                                                     </div>
//                                                                 </button>
//                                                             ))}
//                                                         </div>
//                                                     )}
//                                                 </>
//                                             )}
//                                         </div>
//                                     </ScrollArea>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* ── RIGHT: SYSTEM ACTIONS ── */}
//                 <div className="flex items-center gap-4">
                    
//                     {/* Mobile Search Trigger */}
//                     <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-school-primary hover:bg-surface rounded-xl">
//                         <Search className="h-5 w-5" />
//                     </Button>

//                     {/* Alerts/Notifications (Rule 18/21) */}
//                     <Popover>
//                         <PopoverTrigger asChild>
//                             <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-school-primary hover:bg-surface rounded-xl transition-all">
//                                 <Bell className="h-5 w-5" />
//                                 {unreadCount > 0 && (
//                                     <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-school-primary text-on-school-primary text-[10px] font-extrabold flex items-center justify-center shadow-lg animate-in zoom-in">
//                                         {unreadCount > 9 ? '9+' : unreadCount}
//                                     </span>
//                                 )}
//                             </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-80 p-0 bg-card border-border shadow-2xl rounded-[1.5rem] overflow-hidden" align="end">
//                             <div className="bg-surface/50 px-5 py-4 border-b border-border flex items-center justify-between">
//                                 <h3 className="text-xs font-extrabold uppercase italic tracking-widest text-foreground">Alert Terminal</h3>
//                                 {unreadCount > 0 && <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-school-primary-100 text-school-primary uppercase">{unreadCount} New</span>}
//                             </div>
//                             <ScrollArea className="h-80">
//                                 {notifications.length === 0 ? (
//                                     <div className="flex flex-col items-center justify-center h-48 gap-3 opacity-20">
//                                         <Bell className="h-8 w-8" />
//                                         <p className="text-[10px] font-bold uppercase tracking-widest">Registry Silent</p>
//                                     </div>
//                                 ) : (
//                                     <div className="p-2 space-y-1">
//                                         {notifications.slice(0, 10).map((n) => (
//                                             <div key={n.id} className={cn("p-4 rounded-xl transition-all cursor-pointer hover:bg-muted/40 flex items-start gap-4", !n.read && "bg-school-primary-50/50")}>
//                                                 <div className="h-8 w-8 rounded-full bg-school-primary-50 flex items-center justify-center shrink-0">
//                                                     <MessageCircle className="h-4 w-4 text-school-primary" />
//                                                 </div>
//                                                 <div className="min-w-0 space-y-1">
//                                                     <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 italic">{n.message}</p>
//                                                     <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{timeAgo(n.createdAt)}</p>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </ScrollArea>
//                         </PopoverContent>
//                     </Popover>

//                     {/* Identity Dropdown (Rule 17/19) */}
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-1 hover:bg-surface rounded-2xl transition-all border border-transparent hover:border-border">
//                                 <Avatar className="h-9 w-9 border-2 border-school-primary-100">
//                                     <AvatarFallback className="bg-school-primary-50 text-school-primary text-xs font-extrabold italic">{initials}</AvatarFallback>
//                                 </Avatar>
//                                 <div className="hidden lg:flex flex-col items-start text-left">
//                                     <span className="text-sm font-extrabold text-foreground tracking-tight leading-none truncate max-w-[120px] italic">{displayName}</span>
//                                     <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">{displayRole}</span>
//                                 </div>
//                                 <ChevronDown className="h-4 w-4 text-muted-foreground opacity-30" />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-60 bg-card border-border rounded-2xl shadow-2xl p-2 animate-in zoom-in-95 duration-200">
//                             <DropdownMenuLabel className="p-3">
//                                 <p className="text-sm font-extrabold text-foreground italic">{displayName}</p>
//                                 <p className="text-[10px] font-semibold text-muted-foreground opacity-60 truncate">{displayEmail}</p>
//                             </DropdownMenuLabel>
//                             <DropdownMenuSeparator className="bg-border mx-2" />
//                             <DropdownMenuItem onClick={() => router.push('/settings/profile')} className="rounded-xl px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-surface cursor-pointer">
//                                 <User className="mr-3 h-4 w-4 opacity-40" /> Profile Registry
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => router.push('/admin/settings')} className="rounded-xl px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-surface cursor-pointer">
//                                 <Settings className="mr-3 h-4 w-4 opacity-40" /> Core Architecture
//                             </DropdownMenuItem>
//                             <DropdownMenuSeparator className="bg-border mx-2" />
//                             <div className="p-1">
//                                 <LogoutButton variant="header" className="w-full justify-start h-10 px-3 rounded-xl bg-destructive-50 hover:bg-destructive-100 text-destructive border-0 shadow-none font-extrabold text-[11px] uppercase tracking-widest" />
//                             </div>
//                         </DropdownMenuContent>
//                     </DropdownMenu>

//                 </div>
//             </div>
//         </header>
//     )
// }

// // ── Search Sub-Components ──────────────────────────────────────────────────

// function SearchCategorySection({ results, label, icon, color, bg, onClick }: { results: SearchCategory<ProfileResult>, label: string, icon: React.ReactNode, color: string, bg: string, onClick: (i: ProfileResult) => void }) {
//     if (results.total === 0) return null
//     return (
//         <div className="px-2 mb-2">
//             <div className="px-3 py-2 flex items-center justify-between">
//                 <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/40">{label}</p>
//                 {results.total > 5 && <span className="text-[8px] font-bold text-muted-foreground/30 italic">+{results.total - 5} Nodes</span>}
//             </div>
//             {results.data.slice(0, 5).map(item => (
//                 <button
//                     key={item.id}
//                     onClick={() => onClick(item)}
//                     className="flex w-full items-center gap-4 px-4 py-3 hover:bg-muted/40 rounded-xl transition-all group"
//                 >
//                     <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", bg, color, "border-current/10")}>
//                         {icon}
//                     </div>
//                     <div className="text-left min-w-0">
//                         <p className="text-sm font-bold text-foreground truncate group-hover:text-school-primary transition-colors">{item.name || item.email}</p>
//                         {item.name && <p className="text-[9px] text-muted-foreground font-mono opacity-60 uppercase">{item.email}</p>}
//                     </div>
//                 </button>
//             ))}
//         </div>
//     )
// }

// function timeAgo(date: Date | string): string {
//     const d = typeof date === 'string' ? new Date(date) : date
//     const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
//     if (seconds < 60) return 'Just Now'
//     if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
//     if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
//     return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
// }




"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
    Bell, Search, ChevronDown, User, Settings,
    MessageCircle, GraduationCap, Users,
    BookOpen, X, Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useProfileStore } from "@/store/profileStore"
import { useSchool } from "@/context/schoolProvider"
import { LogoutButton } from "@/components/shared/logOutButton"
import { Role } from "@prisma/client"
import { cn } from "@/lib/utils"
import { getErrorMessage } from "@/lib/error-handler"

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface ProfileResult {
    id:    string
    name:  string | null
    email: string
    role:  Role
}

interface ClassResult {
    id:      string
    name:    string
    grade:   { displayName: string }
    teacher: { name: string | null }
}

interface SearchCategory<T> {
    data:  T[]
    total: number
}

interface SearchResults {
    teachers: SearchCategory<ProfileResult>
    students: SearchCategory<ProfileResult>
    parents:  SearchCategory<ProfileResult>
    classes:  SearchCategory<ClassResult>
}

type SearchState = 'idle' | 'searching' | 'done' | 'error'

const MIN_QUERY_LENGTH = 3
const DEBOUNCE_MS      = 300

// ── Hooks ────────────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState<T>(value)
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])
    return debounced
}

// ── Main Component ───────────────────────────────────────────────────────────

/**
 * COMMAND CENTER HEADER (Tier 2)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry (rounded-2xl).
 * Rule 21: Scale Protocol for mathematical brand tints.
 *
 * NOTE: School name now renders on its own dedicated row so it is always
 * displayed in full, regardless of length (no truncation, no max-width cap).
 */
export function Header() {
    const router      = useRouter()
    const { profile } = useProfileStore()
    const { school }  = useSchool()

    const [query,        setQuery]        = useState<string>('')
    const [results,      setResults]      = useState<SearchResults | null>(null)
    const [searchState,  setSearchState]  = useState<SearchState>('idle')
    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    const searchRef      = useRef<HTMLDivElement>(null)
    const debouncedQuery = useDebounce<string>(query, DEBOUNCE_MS)

    const isAdmin = profile?.role === Role.SCHOOL_ADMIN || profile?.role === Role.SUPER_ADMIN

    const displayName: string  = profile?.name  ?? 'User'
    const displayEmail: string = profile?.email ?? ''
    const displayRole: string  = profile?.role
        ? profile.role.toLowerCase().replace(/_/g, ' ')
        : 'user'
    const schoolName: string = school?.name ?? profile?.school?.name ?? 'School Platform'
    const schoolId: string   = profile?.schoolId ?? ''

    const initials: string = displayName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    const notifications = profile?.notifications ?? []
    const unreadCount: number = notifications.filter((n) => !n.read).length

    const performSearch = useCallback(async (q: string) => {
        if (q.length < MIN_QUERY_LENGTH || !schoolId) {
            setResults(null)
            setSearchState('idle')
            setShowDropdown(false)
            return
        }
        setSearchState('searching')
        setShowDropdown(true)
        try {
            const res = await fetch(
                `/api/search?q=${encodeURIComponent(q)}&schoolId=${encodeURIComponent(schoolId)}`
            )
            if (!res.ok) throw new Error('Registry query failure')
            const json = await res.json() as { results: SearchResults | null }
            setResults(json.results)
            setSearchState('done')
        } catch (err) {
            console.error(`[SEARCH_FAULT]: ${getErrorMessage(err)}`)
            setResults(null)
            setSearchState('error')
        }
    }, [schoolId])

    useEffect(() => {
        if (isAdmin) performSearch(debouncedQuery)
    }, [debouncedQuery, performSearch, isAdmin])

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const clearSearch = () => {
        setQuery('')
        setResults(null)
        setSearchState('idle')
        setShowDropdown(false)
    }

    const handleResultClick = (item: ProfileResult | ClassResult, type: 'profile' | 'class') => {
        clearSearch()
        if (type === 'class') {
            router.push(`/admin/classes/${(item as ClassResult).id}`)
            return
        }
        const p = item as ProfileResult
        switch (p.role) {
            case Role.TEACHER: router.push(`/admin/teacherView/${p.id}`); break
            case Role.STUDENT: router.push(`/admin/studentView/${p.id}`); break
            case Role.PARENT:  router.push(`/admin/parentView/${p.id}`);  break
            default: break
        }
    }

    // ── Result count helper ────────────────────────────────────────────────────────
    function hasAnyResults(results: SearchResults | null): boolean {
        if (!results) return false
        return (
            results.teachers.total > 0 ||
            results.students.total > 0 ||
            results.parents.total  > 0 ||
            results.classes.total  > 0
        )
    }

    if (!isAdmin) return null

    return (
        <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-8">
            <div className="flex flex-col w-full">

                {/* ── TOP ROW: SCHOOL IDENTITY (own row, never truncated) ── */}
                <div className="w-full pt-2 pb-1">
                    <h1 className="text-base font-extrabold text-school-primary uppercase italic tracking-tighter break-words">
                        {schoolName}
                    </h1>
                </div>

                {/* ── BOTTOM ROW: REGISTRY SEARCH + SYSTEM ACTIONS ── */}
                <div className="flex h-16 items-center justify-between gap-4">

                    {/* ── LEFT: REGISTRY SEARCH ── */}
                    <div className="flex items-center gap-8 min-w-0">
                        <div ref={searchRef} className="relative hidden md:block group">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors z-10 pointer-events-none" />

                            <Input
                                type="text"
                                placeholder="Query Registry Node..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => { if (query.length >= MIN_QUERY_LENGTH) setShowDropdown(true) }}
                                className="w-[320px] lg:w-[400px] pl-11 pr-10 bg-surface border-border text-foreground placeholder:text-muted-foreground/30 focus:ring-2 focus:ring-school-primary-200 rounded-xl transition-all"
                            />

                            {query.length > 0 && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all p-1"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}

                            {/* Results Dropdown (Rule 19) */}
                            {showDropdown && query.length >= MIN_QUERY_LENGTH && (
                                <div className="absolute top-full left-0 mt-3 w-full rounded-[1.5rem] border border-border bg-card shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    {searchState === 'searching' ? (
                                        <div className="flex items-center justify-center gap-3 py-10">
                                            <Loader2 className="h-5 w-5 animate-spin text-school-primary" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Synchronizing Registry...</span>
                                        </div>
                                    ) : searchState === 'error' ? (
                                        <div className="py-10 text-center text-[10px] font-bold uppercase text-destructive tracking-widest italic">
                                            Registry Protocol Breach: Sync Failure
                                        </div>
                                    ) : !hasAnyResults(results) ? (
                                        <div className="py-10 text-center space-y-2">
                                            <p className="text-sm font-bold text-foreground italic">No matching nodes</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest italic leading-relaxed">Check syntax or refine identity query</p>
                                        </div>
                                    ) : (
                                        <ScrollArea className="max-h-[480px]">
                                            <div className="py-2">
                                                {results && (
                                                    <>
                                                        <SearchCategorySection results={results.teachers} label="Teachers" icon={<GraduationCap className="h-3.5 w-3.5" />} color="text-blue-600" bg="bg-blue-50" onClick={(t) => handleResultClick(t, 'profile')} />
                                                        <SearchCategorySection results={results.students} label="Students" icon={<Users className="h-3.5 w-3.5" />} color="text-emerald-600" bg="bg-emerald-50" onClick={(s) => handleResultClick(s, 'profile')} />
                                                        <SearchCategorySection results={results.parents} label="Parents" icon={<User className="h-3.5 w-3.5" />} color="text-purple-600" bg="bg-purple-50" onClick={(p) => handleResultClick(p, 'profile')} />

                                                        {results.classes.total > 0 && (
                                                            <div className="px-2 pb-2">
                                                                <div className="px-3 py-2">
                                                                    <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/40">Class Nodes</p>
                                                                </div>
                                                                {results.classes.data.map(c => (
                                                                    <button
                                                                        key={c.id}
                                                                        onClick={() => handleResultClick(c, 'class')}
                                                                        className="flex w-full items-center gap-4 px-4 py-3 hover:bg-muted/40 rounded-xl transition-all group"
                                                                    >
                                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary-50 border border-school-primary-200">
                                                                            <BookOpen className="h-4 w-4 text-school-primary" />
                                                                        </div>
                                                                        <div className="text-left min-w-0">
                                                                            <p className="text-sm font-bold text-foreground truncate group-hover:text-school-primary transition-colors">{c.name}</p>
                                                                            <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">{c.grade.displayName} • {c.teacher.name || 'Unassigned'}</p>
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT: SYSTEM ACTIONS ── */}
                    <div className="flex items-center gap-4">

                        {/* Mobile Search Trigger */}
                        <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-school-primary hover:bg-surface rounded-xl">
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Alerts/Notifications (Rule 18/21) */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-school-primary hover:bg-surface rounded-xl transition-all">
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-school-primary text-on-school-primary text-[10px] font-extrabold flex items-center justify-center shadow-lg animate-in zoom-in">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0 bg-card border-border shadow-2xl rounded-[1.5rem] overflow-hidden" align="end">
                                <div className="bg-surface/50 px-5 py-4 border-b border-border flex items-center justify-between">
                                    <h3 className="text-xs font-extrabold uppercase italic tracking-widest text-foreground">Alert Terminal</h3>
                                    {unreadCount > 0 && <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-school-primary-100 text-school-primary uppercase">{unreadCount} New</span>}
                                </div>
                                <ScrollArea className="h-80">
                                    {notifications.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-48 gap-3 opacity-20">
                                            <Bell className="h-8 w-8" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest">Registry Silent</p>
                                        </div>
                                    ) : (
                                        <div className="p-2 space-y-1">
                                            {notifications.slice(0, 10).map((n) => (
                                                <div key={n.id} className={cn("p-4 rounded-xl transition-all cursor-pointer hover:bg-muted/40 flex items-start gap-4", !n.read && "bg-school-primary-50/50")}>
                                                    <div className="h-8 w-8 rounded-full bg-school-primary-50 flex items-center justify-center shrink-0">
                                                        <MessageCircle className="h-4 w-4 text-school-primary" />
                                                    </div>
                                                    <div className="min-w-0 space-y-1">
                                                        <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 italic">{n.message}</p>
                                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{timeAgo(n.createdAt)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>

                        {/* Identity Dropdown (Rule 17/19) */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-1 hover:bg-surface rounded-2xl transition-all border border-transparent hover:border-border">
                                    <Avatar className="h-9 w-9 border-2 border-school-primary-100">
                                        <AvatarFallback className="bg-school-primary-50 text-school-primary text-xs font-extrabold italic">{initials}</AvatarFallback>
                                    </Avatar>
                                    <div className="hidden lg:flex flex-col items-start text-left">
                                        <span className="text-sm font-extrabold text-foreground tracking-tight leading-none truncate max-w-[120px] italic">{displayName}</span>
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">{displayRole}</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-muted-foreground opacity-30" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-60 bg-card border-border rounded-2xl shadow-2xl p-2 animate-in zoom-in-95 duration-200">
                                <DropdownMenuLabel className="p-3">
                                    <p className="text-sm font-extrabold text-foreground italic">{displayName}</p>
                                    <p className="text-[10px] font-semibold text-muted-foreground opacity-60 truncate">{displayEmail}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border mx-2" />
                                <DropdownMenuItem onClick={() => router.push('/settings/profile')} className="rounded-xl px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-surface cursor-pointer">
                                    <User className="mr-3 h-4 w-4 opacity-40" /> Profile Registry
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/admin/settings')} className="rounded-xl px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-surface cursor-pointer">
                                    <Settings className="mr-3 h-4 w-4 opacity-40" /> Core Architecture
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-border mx-2" />
                                <div className="p-1">
                                    <LogoutButton variant="header" className="w-full justify-start h-10 px-3 rounded-xl bg-destructive-50 hover:bg-destructive-100 text-destructive border-0 shadow-none font-extrabold text-[11px] uppercase tracking-widest" />
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                </div>
            </div>
        </header>
    )
}

// ── Search Sub-Components ──────────────────────────────────────────────────

function SearchCategorySection({ results, label, icon, color, bg, onClick }: { results: SearchCategory<ProfileResult>, label: string, icon: React.ReactNode, color: string, bg: string, onClick: (i: ProfileResult) => void }) {
    if (results.total === 0) return null
    return (
        <div className="px-2 mb-2">
            <div className="px-3 py-2 flex items-center justify-between">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/40">{label}</p>
                {results.total > 5 && <span className="text-[8px] font-bold text-muted-foreground/30 italic">+{results.total - 5} Nodes</span>}
            </div>
            {results.data.slice(0, 5).map(item => (
                <button
                    key={item.id}
                    onClick={() => onClick(item)}
                    className="flex w-full items-center gap-4 px-4 py-3 hover:bg-muted/40 rounded-xl transition-all group"
                >
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", bg, color, "border-current/10")}>
                        {icon}
                    </div>
                    <div className="text-left min-w-0">
                        <p className="text-sm font-bold text-foreground truncate group-hover:text-school-primary transition-colors">{item.name || item.email}</p>
                        {item.name && <p className="text-[9px] text-muted-foreground font-mono opacity-60 uppercase">{item.email}</p>}
                    </div>
                </button>
            ))}
        </div>
    )
}

function timeAgo(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
    if (seconds < 60) return 'Just Now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
