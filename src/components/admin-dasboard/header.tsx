// "use client"

// import { useState, useEffect, useRef, useCallback } from "react"
// import { useRouter } from "next/navigation"
// import {
//     Bell, Search, ChevronDown, User, Settings,
//     LogOut, MessageCircle, GraduationCap, Users,
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
// import { createClient } from "@/lib/supabase/client"
// import { toast } from "sonner"

// // ── Types ──────────────────────────────────────────────────────────────────────
// interface ProfileResult {
//     id:    string
//     name:  string | null
//     email: string
//     role:  'TEACHER' | 'STUDENT' | 'PARENT'
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

// // ── Debounce hook ──────────────────────────────────────────────────────────────
// function useDebounce<T>(value: T, delay: number): T {
//     const [debounced, setDebounced] = useState<T>(value)
//     useEffect(() => {
//         const timer = setTimeout(() => setDebounced(value), delay)
//         return () => clearTimeout(timer)
//     }, [value, delay])
//     return debounced
// }

// // ── Result count helper ────────────────────────────────────────────────────────
// function hasAnyResults(results: SearchResults | null): boolean {
//     if (!results) return false
//     return (
//         results.teachers.total > 0 ||
//         results.students.total > 0 ||
//         results.parents.total  > 0 ||
//         results.classes.total  > 0
//     )
// }

// // ── Main Component ─────────────────────────────────────────────────────────────
// export function Header() {
//     const router      = useRouter()
//     const { profile } = useProfileStore()
//     const { school }  = useSchool()

//     // ── Search state ───────────────────────────────────────────────────────
//     const [query,        setQuery]        = useState('')
//     const [results,      setResults]      = useState<SearchResults | null>(null)
//     const [searchState,  setSearchState]  = useState<SearchState>('idle')
//     const [showDropdown, setShowDropdown] = useState(false)
//     const searchRef      = useRef<HTMLDivElement>(null)
//     const debouncedQuery = useDebounce(query, DEBOUNCE_MS)

//     // ── Auth state ─────────────────────────────────────────────────────────
//     const [isLoggingOut, setIsLoggingOut] = useState(false)

//     // ── Derived values ─────────────────────────────────────────────────────
//     const displayName  = profile?.name  ?? 'User'
//     const displayEmail = profile?.email ?? ''
//     const displayRole  = profile?.role
//         ? profile.role.toLowerCase().replace(/_/g, ' ')
//         : 'user'
//     const schoolName = school?.name ?? profile?.school?.name ?? 'EduAI'
//     const schoolId   = profile?.schoolId ?? ''

//     const initials = displayName
//         .split(' ')
//         .map((n) => n[0])
//         .slice(0, 2)
//         .join('')
//         .toUpperCase()

//     const notifications = profile?.notifications ?? []
//     const unreadCount   = notifications.filter((n) => !n.read).length

//     // ── Search fetch ───────────────────────────────────────────────────────
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
//             if (!res.ok) throw new Error('Search request failed')
//             const json = await res.json() as { results: SearchResults | null }
//             setResults(json.results)
//             setSearchState('done')
//         } catch {
//             setResults(null)
//             setSearchState('error')
//         }
//     }, [schoolId])

//     useEffect(() => {
//         performSearch(debouncedQuery)
//     }, [debouncedQuery, performSearch])

//     // ── Close dropdown on outside click ───────────────────────────────────
//     useEffect(() => {
//         const handler = (e: MouseEvent) => {
//             if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
//                 setShowDropdown(false)
//             }
//         }
//         document.addEventListener('mousedown', handler)
//         return () => document.removeEventListener('mousedown', handler)
//     }, [])

//     // ── Helpers ────────────────────────────────────────────────────────────
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
//             case 'TEACHER':
//                 router.push(`/admin/teacherView/${p.id}`)
//                 break
//             case 'STUDENT':
//                 router.push(`/admin/studentView/${p.id}`)
//                 break
//             case 'PARENT':
//                 router.push(`/admin/parentView/${p.id}`)
//                 break
//         }
//     }

//     async function handleLogout() {
//         setIsLoggingOut(true)
//         const supabase = createClient()
//         const { error } = await supabase.auth.signOut()
//         if (error) {
//             toast.error('Failed to log out. Please try again.')
//             setIsLoggingOut(false)
//             return
//         }
//         useProfileStore.getState().clearProfile()
//         router.replace('/login')
//     }

//     // ── Render ─────────────────────────────────────────────────────────────
//     return (
//         <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-school-secondary-800 bg-school-secondary-950 px-6">

//             {/* Left: School name + Search */}
//             <div className="flex items-center gap-6">
//                 <h1 className="text-lg font-bold text-school-primary truncate max-w-[200px]">
//                     {schoolName}
//                 </h1>

//                 {/* Search */}
//                 <div ref={searchRef} className="relative hidden md:block">
//                     <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-school-secondary-100 z-10 pointer-events-none" />

//                     <Input
//                         type="text"
//                         placeholder="Search by name or email..."
//                         value={query}
//                         onChange={(e) => setQuery(e.target.value)}
//                         onFocus={() => {
//                             if (query.length >= MIN_QUERY_LENGTH) setShowDropdown(true)
//                         }}
//                         className="w-80 pl-10 pr-8 bg-school-secondary-700 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-400 focus:border-school-primary"
//                     />

//                     {/* Clear button */}
//                     {query.length > 0 && (
//                         <button
//                             onClick={clearSearch}
//                             className="absolute right-3 top-1/2 -translate-y-1/2 text-school-secondary-400 hover:text-white transition-colors"
//                         >
//                             <X className="h-3.5 w-3.5" />
//                         </button>
//                     )}

//                     {/* Min chars hint */}
//                     {query.length > 0 && query.length < MIN_QUERY_LENGTH && (
//                         <div className="absolute top-full left-0 mt-1 w-80 rounded-xl border border-school-secondary-700 bg-gray-600 px-4 py-3 text-gray-100">
//                             <p className="text-xs text-school-secondary-400">
//                                 Type {MIN_QUERY_LENGTH - query.length} more character{MIN_QUERY_LENGTH - query.length !== 1 ? 's' : ''} to search...
//                             </p>
//                         </div>
//                     )}

//                     {/* Results dropdown */}
//                     {showDropdown && query.length >= MIN_QUERY_LENGTH && (
//                         <div className="absolute top-full left-0 mt-1 w-80 rounded-xl border border-school-secondary-700 bg-gray-600 text-gray-100 shadow-2xl z-50 overflow-hidden">

//                             {/* Searching */}
//                             {searchState === 'searching' && (
//                                 <div className="flex items-center justify-center gap-2 py-6 text-school-secondary-400">
//                                     <Loader2 className="h-4 w-4 animate-spin" />
//                                     <span className="text-sm">Searching...</span>
//                                 </div>
//                             )}

//                             {/* Error */}
//                             {searchState === 'error' && (
//                                 <div className="py-6 text-center text-sm text-red-400">
//                                     Search failed. Please try again.
//                                 </div>
//                             )}

//                             {/* No results */}
//                             {searchState === 'done' && !hasAnyResults(results) && (
//                                 <div className="py-6 text-center space-y-1">
//                                     <p className="text-sm text-white font-medium">
//                                         No results for &ldquo;{query}&rdquo;
//                                     </p>
//                                     <p className="text-xs text-school-secondary-400">
//                                         Try a different name or email
//                                     </p>
//                                 </div>
//                             )}

//                             {/* Results */}
//                             {searchState === 'done' && hasAnyResults(results) && results && (
//                                 <ScrollArea className="max-h-[420px]">

//                                     {/* Teachers */}
//                                     {results.teachers.total > 0 && (
//                                         <ResultSection
//                                             label="Teachers"
//                                             total={results.teachers.total}
//                                             icon={<GraduationCap className="h-3.5 w-3.5 text-blue-400" />}
//                                             iconBg="bg-blue-500/20"
//                                         >
//                                             {results.teachers.data.map(t => (
//                                                 <ProfileResultRow
//                                                     key={t.id}
//                                                     item={t}
//                                                     iconBg="bg-blue-500"
//                                                     icon={<GraduationCap className="h-3.5 w-3.5 text-blue-100" />}
//                                                     onClick={() => handleResultClick(t, 'profile')}
//                                                 />
//                                             ))}
//                                         </ResultSection>
//                                     )}

//                                     {/* Students */}
//                                     {results.students.total > 0 && (
//                                         <ResultSection
//                                             label="Students"
//                                             total={results.students.total}
//                                             icon={<Users className="h-3.5 w-3.5 text-green-400" />}
//                                             iconBg="bg-green-500/20"
//                                         >
//                                             {results.students.data.map(s => (
//                                                 <ProfileResultRow
//                                                     key={s.id}
//                                                     item={s}
//                                                     iconBg="bg-green-500"
//                                                     icon={<Users className="h-3.5 w-3.5 text-green-100" />}
//                                                     onClick={() => handleResultClick(s, 'profile')}
//                                                 />
//                                             ))}
//                                         </ResultSection>
//                                     )}

//                                     {/* Parents */}
//                                     {results.parents.total > 0 && (
//                                         <ResultSection
//                                             label="Parents"
//                                             total={results.parents.total}
//                                             icon={<User className="h-3.5 w-3.5 text-purple-400" />}
//                                             iconBg="bg-purple-500/20"
//                                         >
//                                             {results.parents.data.map(p => (
//                                                 <ProfileResultRow
//                                                     key={p.id}
//                                                     item={p}
//                                                     iconBg="bg-purple-500"
//                                                     icon={<User className="h-3.5 w-3.5 text-purple-100" />}
//                                                     onClick={() => handleResultClick(p, 'profile')}
//                                                 />
//                                             ))}
//                                         </ResultSection>
//                                     )}

//                                     {/* Classes */}
//                                     {results.classes.total > 0 && (
//                                         <ResultSection
//                                             label="Classes"
//                                             total={results.classes.total}
//                                             icon={<BookOpen className="h-3.5 w-3.5 text-amber-400" />}
//                                             iconBg="bg-amber-500/20"
//                                         >
//                                             {results.classes.data.map(c => (
//                                                 <button
//                                                     key={c.id}
//                                                     onClick={() => handleResultClick(c, 'class')}
//                                                     className="flex w-full items-center gap-3 px-3 py-2 hover:bg-school-secondary-800 transition-colors"
//                                                 >
//                                                     <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500">
//                                                         <BookOpen className="h-3.5 w-3.5 text-amber-100" />
//                                                     </div>
//                                                     <div className="text-left min-w-0">
//                                                         <p className="text-sm font-medium text-white truncate">
//                                                             {c.name}
//                                                         </p>
//                                                         <p className="text-xs text-school-secondary-400 truncate">
//                                                             {c.grade.displayName}
//                                                             {c.teacher.name ? ` · ${c.teacher.name}` : ''}
//                                                         </p>
//                                                     </div>
//                                                 </button>
//                                             ))}
//                                         </ResultSection>
//                                     )}

//                                 </ScrollArea>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Right: Actions */}
//             <div className="flex items-center gap-2">

//                 {/* Mobile search button */}
//                 <Button
//                     variant="ghost"
//                     size="icon"
//                     className="md:hidden text-school-secondary-200 bg-school-secondary-800 hover:text-school-primary hover:bg-school-secondary-800"
//                 >
//                     <Search className="h-5 w-5" />
//                 </Button>

//                 {/* Notifications */}
//                 <Popover>
//                     <PopoverTrigger asChild>
//                         <Button
//                             variant="ghost"
//                             size="icon"
//                             className="relative text-school-secondary-100 hover:text-school-primary hover:bg-school-secondary-800"
//                         >
//                             <Bell className="h-5 w-5" />
//                             {unreadCount > 0 && (
//                                 <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-school-primary text-school-secondary-950 text-[10px] font-black flex items-center justify-center">
//                                     {unreadCount > 9 ? '9+' : unreadCount}
//                                 </span>
//                             )}
//                         </Button>
//                     </PopoverTrigger>
//                     <PopoverContent
//                         className="w-80 p-0 bg-gray-600 border-school-secondary-800 shadow-2xl text-gray-100"
//                         align="end"
//                     >
//                         <div className="flex items-center justify-between border-b border-school-secondary-800 px-4 py-3">
//                             <h3 className="font-bold text-school-secondary-100">Notifications</h3>
//                             {unreadCount > 0 && (
//                                 <span className="text-xs px-2 py-0.5 rounded-full bg-school-primary/20 text-school-primary font-semibold">
//                                     {unreadCount} new
//                                 </span>
//                             )}
//                         </div>
//                         <ScrollArea className="h-80">
//                             {notifications.length === 0 ? (
//                                 <div className="flex flex-col items-center justify-center h-32 text-school-secondary-100">
//                                     <Bell className="h-8 w-8 mb-2" />
//                                     <p className="text-sm">No notifications yet</p>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-0.5 p-2">
//                                     {notifications.slice(0, 10).map((notification) => (
//                                         <div
//                                             key={notification.id}
//                                             className={`flex items-start gap-3 rounded-lg p-3 transition-colors cursor-pointer hover:bg-school-secondary-800 ${
//                                                 !notification.read ? 'bg-school-secondary-800' : ''
//                                             }`}
//                                         >
//                                             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-school-primary/20">
//                                                 <MessageCircle className="h-4 w-4 text-school-primary" />
//                                             </div>
//                                             <div className="flex-1 space-y-0.5 min-w-0">
//                                                 <p className="text-sm font-semibold text-school-secondary-100 leading-snug truncate">
//                                                     {notification.message}
//                                                 </p>
//                                                 <p className="text-xs text-school-secondary-400">
//                                                     {new Date(notification.createdAt).toLocaleDateString('en-GB', {
//                                                         day: 'numeric', month: 'short',
//                                                         hour: '2-digit', minute: '2-digit',
//                                                     })}
//                                                 </p>
//                                             </div>
//                                             {!notification.read && (
//                                                 <div className="h-2 w-2 rounded-full bg-school-primary shrink-0 mt-1" />
//                                             )}
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </ScrollArea>
//                         <div className="border-t border-school-secondary-700 p-2">
//                             <Button
//                                 variant="ghost"
//                                 className="w-full text-sm text-school-primary hover:bg-school-secondary-800"
//                                 onClick={() => router.push('/notifications')}
//                             >
//                                 View all notifications
//                             </Button>
//                         </div>
//                     </PopoverContent>
//                 </Popover>

//                 {/* User menu */}
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button
//                             variant="ghost"
//                             className="flex items-center gap-2 pl-2 pr-1 hover:bg-school-secondary-800"
//                         >
//                             <Avatar className="h-8 w-8">
//                                 <AvatarFallback className="bg-school-primary text-school-secondary-950 text-sm font-black">
//                                     {initials}
//                                 </AvatarFallback>
//                             </Avatar>
//                             <div className="hidden flex-col items-start text-left lg:flex">
//                                 <span className="text-sm font-semibold text-school-secondary-100 max-w-[120px] truncate">
//                                     {displayName}
//                                 </span>
//                                 <span className="text-xs text-school-secondary-400 capitalize">
//                                     {displayRole}
//                                 </span>
//                             </div>
//                             <ChevronDown className="ml-1 h-4 w-4 text-school-secondary-400" />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent
//                         align="end"
//                         className="w-56 bg-slate-600 border-school-secondary-700 shadow-2xl text-slate-100"
//                     >
//                         <DropdownMenuLabel className="font-normal">
//                             <div className="flex flex-col space-y-1">
//                                 <p className="text-sm font-semibold text-school-secondary-100">
//                                     {displayName}
//                                 </p>
//                                 <p className="text-xs text-school-secondary-400 truncate">
//                                     {displayEmail}
//                                 </p>
//                             </div>
//                         </DropdownMenuLabel>
//                         <DropdownMenuSeparator className="bg-school-secondary-700" />
//                         <DropdownMenuItem
//                             className="text-school-secondary-100 hover:text-white hover:bg-school-secondary-800 cursor-pointer"
//                             onClick={() => router.push('/settings/profile')}
//                         >
//                             <User className="mr-2 h-4 w-4" />
//                             Profile
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                             className="text-school-secondary-100 hover:text-white hover:bg-school-secondary-800 cursor-pointer"
//                             onClick={() => router.push('/settings')}
//                         >
//                             <Settings className="mr-2 h-4 w-4" />
//                             Settings
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator className="bg-school-secondary-700" />
//                         <DropdownMenuItem
//                             className="text-red-400 hover:text-red-300 hover:bg-school-secondary-800 cursor-pointer"
//                             onClick={handleLogout}
//                             disabled={isLoggingOut}
//                         >
//                             <LogOut className="mr-2 h-4 w-4" />
//                             {isLoggingOut ? 'Logging out...' : 'Log out'}
//                         </DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>

//             </div>
//         </header>
//     )
// }

// // ── Sub-components ─────────────────────────────────────────────────────────────
// interface ResultSectionProps {
//     label:    string
//     total:    number
//     icon:     React.ReactNode
//     iconBg:   string
//     children: React.ReactNode
// }

// function ResultSection({ label, total, children }: ResultSectionProps) {
//     const TAKE = 5
//     return (
//         <div>
//             <div className="flex items-center justify-between px-3 pt-3 pb-1">
//                 <p className="text-[10px] font-bold uppercase tracking-wider text-school-secondary-400">
//                     {label}
//                 </p>
//                 {total > TAKE && (
//                     <p className="text-[10px] text-school-secondary-400">
//                         Showing {TAKE} of {total} — refine your search
//                     </p>
//                 )}
//             </div>
//             {children}
//         </div>
//     )
// }

// interface ProfileResultRowProps {
//     item:    ProfileResult
//     icon:    React.ReactNode
//     iconBg:  string
//     onClick: () => void
// }

// function ProfileResultRow({ item, icon, iconBg, onClick }: ProfileResultRowProps) {
//     return (
//         <button
//             onClick={onClick}
//             className="flex w-full items-center gap-3 px-3 py-2 hover:bg-school-secondary-800 transition-colors"
//         >
//             <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
//                 {icon}
//             </div>
//             <div className="text-left min-w-0">
//                 <p className="text-sm font-medium text-white truncate">
//                     {item.name ?? item.email}
//                 </p>
//                 {item.name && (
//                     <p className="text-xs text-school-secondary-400 truncate">
//                         {item.email}
//                     </p>
//                 )}
//             </div>
//         </button>
//     )
// }



"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
    Bell, Search, ChevronDown, User, Settings,
    LogOut, MessageCircle, GraduationCap, Users,
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
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

// ── Types ──────────────────────────────────────────────────────────────────────
interface ProfileResult {
    id:    string
    name:  string | null
    email: string
    role:  'TEACHER' | 'STUDENT' | 'PARENT'
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

// ── Debounce hook ──────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState<T>(value)
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])
    return debounced
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

// ── Main Component ─────────────────────────────────────────────────────────────
export function Header() {
    const router      = useRouter()
    const { profile } = useProfileStore()
    const { school }  = useSchool()

    // ── Search state ───────────────────────────────────────────────────────
    const [query,        setQuery]        = useState('')
    const [results,      setResults]      = useState<SearchResults | null>(null)
    const [searchState,  setSearchState]  = useState<SearchState>('idle')
    const [showDropdown, setShowDropdown] = useState(false)
    const searchRef      = useRef<HTMLDivElement>(null)
    const debouncedQuery = useDebounce(query, DEBOUNCE_MS)

    // ── Auth state ─────────────────────────────────────────────────────────
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    // ── Derived values ─────────────────────────────────────────────────────
    const displayName  = profile?.name  ?? 'User'
    const displayEmail = profile?.email ?? ''
    const displayRole  = profile?.role
        ? profile.role.toLowerCase().replace(/_/g, ' ')
        : 'user'
    const schoolName = school?.name ?? profile?.school?.name ?? 'EduAI'
    const schoolId   = profile?.schoolId ?? ''

    const initials = displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    const notifications = profile?.notifications ?? []
    const unreadCount   = notifications.filter((n) => !n.read).length

    // ── Search fetch ───────────────────────────────────────────────────────
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
            if (!res.ok) throw new Error('Search request failed')
            const json = await res.json() as { results: SearchResults | null }
            setResults(json.results)
            setSearchState('done')
        } catch {
            setResults(null)
            setSearchState('error')
        }
    }, [schoolId])

    useEffect(() => {
        performSearch(debouncedQuery)
    }, [debouncedQuery, performSearch])

    // ── Close dropdown on outside click ───────────────────────────────────
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    // ── Helpers ────────────────────────────────────────────────────────────
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
            case 'TEACHER': router.push(`/admin/teachers/${p.id}`); break
            case 'STUDENT': router.push(`/admin/students/${p.id}`); break
            case 'PARENT':  router.push(`/admin/parents/${p.id}`);  break
        }
    }

    async function handleLogout() {
        setIsLoggingOut(true)
        const supabase = createClient()
        const { error } = await supabase.auth.signOut()
        if (error) {
            toast.error('Failed to log out. Please try again.')
            setIsLoggingOut(false)
            return
        }
        useProfileStore.getState().clearProfile()
        router.replace('/login')
    }

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-school-secondary-800 bg-school-secondary-950 px-6">

            {/* Left: School name + Search */}
            <div className="flex items-center gap-6">
                <h1 className="text-lg font-bold text-school-primary truncate max-w-[200px]">
                    {schoolName}
                </h1>

                {/* Search */}
                <div ref={searchRef} className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-school-secondary-400 z-10 pointer-events-none" />

                    <Input
                        type="text"
                        placeholder="Search by name or email..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => {
                            if (query.length >= MIN_QUERY_LENGTH) setShowDropdown(true)
                        }}
                        className="w-80 pl-10 pr-8 bg-school-secondary-900 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-400 focus:border-school-primary"
                    />

                    {/* Clear button */}
                    {query.length > 0 && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-school-secondary-400 hover:text-school-secondary-100 transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}

                    {/* Min chars hint */}
                    {query.length > 0 && query.length < MIN_QUERY_LENGTH && (
                        <div className="absolute top-full left-0 mt-1 w-80 rounded-xl border border-school-secondary-700 bg-school-secondary-900 px-4 py-3">
                            <p className="text-xs text-school-secondary-400">
                                Type {MIN_QUERY_LENGTH - query.length} more character{MIN_QUERY_LENGTH - query.length !== 1 ? 's' : ''} to search...
                            </p>
                        </div>
                    )}

                    {/* Results dropdown */}
                    {showDropdown && query.length >= MIN_QUERY_LENGTH && (
                        <div className="absolute top-full left-0 mt-1 w-80 rounded-xl border border-school-secondary-700 bg-school-secondary-900 shadow-2xl z-50 overflow-hidden">

                            {/* Searching */}
                            {searchState === 'searching' && (
                                <div className="flex items-center justify-center gap-2 py-6 text-school-secondary-400">
                                    <Loader2 className="h-4 w-4 animate-spin text-school-primary" />
                                    <span className="text-sm text-school-secondary-300">Searching...</span>
                                </div>
                            )}

                            {/* Error */}
                            {searchState === 'error' && (
                                <div className="py-6 text-center text-sm text-red-400">
                                    Search failed. Please try again.
                                </div>
                            )}

                            {/* No results */}
                            {searchState === 'done' && !hasAnyResults(results) && (
                                <div className="py-6 text-center space-y-1">
                                    <p className="text-sm text-school-secondary-100 font-medium">
                                        No results for &ldquo;{query}&rdquo;
                                    </p>
                                    <p className="text-xs text-school-secondary-400">
                                        Try a different name or email
                                    </p>
                                </div>
                            )}

                            {/* Results */}
                            {searchState === 'done' && hasAnyResults(results) && results && (
                                <ScrollArea className="max-h-[420px]">

                                    {results.teachers.total > 0 && (
                                        <ResultSection label="Teachers" total={results.teachers.total}>
                                            {results.teachers.data.map(t => (
                                                <ProfileResultRow
                                                    key={t.id}
                                                    item={t}
                                                    iconBg="bg-blue-500/20"
                                                    icon={<GraduationCap className="h-3.5 w-3.5 text-blue-400" />}
                                                    onClick={() => handleResultClick(t, 'profile')}
                                                />
                                            ))}
                                        </ResultSection>
                                    )}

                                    {results.students.total > 0 && (
                                        <ResultSection label="Students" total={results.students.total}>
                                            {results.students.data.map(s => (
                                                <ProfileResultRow
                                                    key={s.id}
                                                    item={s}
                                                    iconBg="bg-green-500/20"
                                                    icon={<Users className="h-3.5 w-3.5 text-green-400" />}
                                                    onClick={() => handleResultClick(s, 'profile')}
                                                />
                                            ))}
                                        </ResultSection>
                                    )}

                                    {results.parents.total > 0 && (
                                        <ResultSection label="Parents" total={results.parents.total}>
                                            {results.parents.data.map(p => (
                                                <ProfileResultRow
                                                    key={p.id}
                                                    item={p}
                                                    iconBg="bg-purple-500/20"
                                                    icon={<User className="h-3.5 w-3.5 text-purple-400" />}
                                                    onClick={() => handleResultClick(p, 'profile')}
                                                />
                                            ))}
                                        </ResultSection>
                                    )}

                                    {results.classes.total > 0 && (
                                        <ResultSection label="Classes" total={results.classes.total}>
                                            {results.classes.data.map(c => (
                                                <button
                                                    key={c.id}
                                                    onClick={() => handleResultClick(c, 'class')}
                                                    className="flex w-full items-center gap-3 px-3 py-2 hover:bg-school-secondary-800 transition-colors"
                                                >
                                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-school-primary/20">
                                                        <BookOpen className="h-3.5 w-3.5 text-school-primary" />
                                                    </div>
                                                    <div className="text-left min-w-0">
                                                        <p className="text-sm font-medium text-school-secondary-100 truncate">
                                                            {c.name}
                                                        </p>
                                                        <p className="text-xs text-school-secondary-400 truncate">
                                                            {c.grade.displayName}
                                                            {c.teacher.name ? ` · ${c.teacher.name}` : ''}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </ResultSection>
                                    )}

                                </ScrollArea>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">

                {/* Mobile search button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-school-secondary-200 bg-school-secondary-800 hover:text-school-primary hover:bg-school-secondary-800"
                >
                    <Search className="h-5 w-5" />
                </Button>

                {/* Notifications */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-school-secondary-100 hover:text-school-primary hover:bg-school-secondary-800"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-school-primary text-school-secondary-950 text-[10px] font-black flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-80 p-0 bg-school-secondary-900 border-school-secondary-700 shadow-2xl"
                        align="end"
                    >
                        {/* Notification header */}
                        <div className="flex items-center justify-between border-b border-school-secondary-800 px-4 py-3">
                            <h3 className="font-bold text-school-secondary-100">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-school-primary/20 text-school-primary font-semibold">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>

                        {/* Notification list */}
                        <ScrollArea className="h-80">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-32 gap-2">
                                    <Bell className="h-8 w-8 text-school-secondary-700" />
                                    <p className="text-sm text-school-secondary-400">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="space-y-0.5 p-2">
                                    {notifications.slice(0, 10).map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`flex items-start gap-3 rounded-lg p-3 transition-colors cursor-pointer hover:bg-school-secondary-800 ${
                                                !notification.read ? 'bg-school-secondary-800/60' : ''
                                            }`}
                                        >
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-school-primary/20">
                                                <MessageCircle className="h-4 w-4 text-school-primary" />
                                            </div>
                                            <div className="flex-1 space-y-0.5 min-w-0">
                                                <p className="text-sm font-medium text-school-secondary-100 leading-snug truncate">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-school-secondary-400">
                                                    {new Date(notification.createdAt).toLocaleDateString('en-GB', {
                                                        day: 'numeric', month: 'short',
                                                        hour: '2-digit', minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <div className="h-2 w-2 rounded-full bg-school-primary shrink-0 mt-1.5" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>

                        {/* Footer */}
                        <div className="border-t border-school-secondary-800 p-2">
                            <Button
                                variant="ghost"
                                className="w-full text-sm text-school-primary hover:bg-school-secondary-800 hover:text-school-primary"
                                onClick={() => router.push('/notifications')}
                            >
                                View all notifications
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* User menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 pl-2 pr-1 hover:bg-school-secondary-800"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-school-primary text-school-secondary-950 text-sm font-black">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden flex-col items-start text-left lg:flex">
                                <span className="text-sm font-semibold text-school-secondary-100 max-w-[120px] truncate">
                                    {displayName}
                                </span>
                                <span className="text-xs text-school-secondary-400 capitalize">
                                    {displayRole}
                                </span>
                            </div>
                            <ChevronDown className="ml-1 h-4 w-4 text-school-secondary-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 bg-school-secondary-900 border-school-secondary-700 shadow-2xl"
                    >
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-semibold text-school-secondary-100">
                                    {displayName}
                                </p>
                                <p className="text-xs text-school-secondary-400 truncate">
                                    {displayEmail}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-school-secondary-800" />
                        <DropdownMenuItem
                            className="text-school-secondary-200 hover:text-school-secondary-100 hover:bg-school-secondary-800 cursor-pointer focus:bg-school-secondary-800 focus:text-school-secondary-100"
                            onClick={() => router.push('/settings/profile')}
                        >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-school-secondary-200 hover:text-school-secondary-100 hover:bg-school-secondary-800 cursor-pointer focus:bg-school-secondary-800 focus:text-school-secondary-100"
                            onClick={() => router.push('/settings')}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-school-secondary-800" />
                        <DropdownMenuItem
                            className="text-red-400 hover:text-red-300 hover:bg-school-secondary-800 cursor-pointer focus:bg-school-secondary-800 focus:text-red-300"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            {isLoggingOut ? 'Logging out...' : 'Log out'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </header>
    )
}

// ── Sub-components ─────────────────────────────────────────────────────────────
interface ResultSectionProps {
    label:    string
    total:    number
    children: React.ReactNode
}

function ResultSection({ label, total, children }: ResultSectionProps) {
    const TAKE = 5
    return (
        <div>
            <div className="flex items-center justify-between px-3 pt-3 pb-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-school-secondary-400">
                    {label}
                </p>
                {total > TAKE && (
                    <p className="text-[10px] text-school-secondary-400">
                        Showing {TAKE} of {total} — refine your search
                    </p>
                )}
            </div>
            {children}
        </div>
    )
}

interface ProfileResultRowProps {
    item:    ProfileResult
    icon:    React.ReactNode
    iconBg:  string
    onClick: () => void
}

function ProfileResultRow({ item, icon, iconBg, onClick }: ProfileResultRowProps) {
    return (
        <button
            onClick={onClick}
            className="flex w-full items-center gap-3 px-3 py-2 hover:bg-school-secondary-800 transition-colors"
        >
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
                {icon}
            </div>
            <div className="text-left min-w-0">
                <p className="text-sm font-medium text-school-secondary-100 truncate">
                    {item.name ?? item.email}
                </p>
                {item.name && (
                    <p className="text-xs text-school-secondary-400 truncate">
                        {item.email}
                    </p>
                )}
            </div>
        </button>
    )
}