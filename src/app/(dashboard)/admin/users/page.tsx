"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Users, GraduationCap, UserCircle, Download,
  Loader2, ChevronRight, BookOpen, UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";


// Actions & Store
import { 
  getStudentsBySchool, 
  getTeachersBySchool, 
  getParentsBySchool,
  type UserListItem 
} from "@/app/actions/user-management";
import { useProfileStore } from "@/store/profileStore";
import { ParentChildLinker } from "@/components/admin-dasboard/parent-child-linker";
import { getErrorMessage } from "@/lib/error-handler";

const ROLE_CONFIG = {
  STUDENT: { label: "Students", icon: <GraduationCap className="w-4 h-4" />, folder: "studentView" },
  TEACHER: { label: "Teachers", icon: <Users className="w-4 h-4" />, folder: "teacherView" },
  PARENT: { label: "Parents", icon: <UserCircle className="w-4 h-4" />, folder: "parentView" },
} as const;

type RoleKey = keyof typeof ROLE_CONFIG;

function UserRegistryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useProfileStore();
  const schoolId = profile?.schoolId;

  // Sync Active Tab with URL
  const activeTab = (searchParams.get("role") as RoleKey) || "STUDENT";
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleTabChange = (value: string) => {
    router.push(`/admin/users?role=${value}`, { scroll: false });
  };

  useEffect(() => {
    async function fetchData() {
      if (!schoolId) return;
      setIsLoading(true);
      try {
        let data: UserListItem[] = [];
        if (activeTab === "STUDENT") data = await getStudentsBySchool(schoolId);
        else if (activeTab === "TEACHER") data = await getTeachersBySchool(schoolId);
        else if (activeTab === "PARENT") data = await getParentsBySchool(schoolId);
        setUsers(data);
      } catch (error) {
        toast.error("Registry synchronization failed.");
        getErrorMessage(error)
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [activeTab, schoolId]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  if (!profile) return null;

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50">
      
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">Registry Control</h1>
          <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide">
            Manage your school community and access levels.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="border-slate-700 text-slate-500 hover:bg-slate-900 hover:text-slate-200 uppercase text-[10px] font-black tracking-widest px-6 h-12">
             <Download className="w-4 h-4 mr-2 text-school-primary" /> Export Data
          </Button>
          <Button className="bg-school-primary text-slate-950 font-black px-8 h-12 rounded-xl hover:scale-105 transition-all text-[10px] tracking-widest uppercase shadow-xl">
             <UserPlus className="w-4 h-4 mr-2" /> New Record
          </Button>
        </div>
      </header>

      {/* ── Control Bar (FIXED TAB VISIBILITY) ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-3xl shadow-2xl">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full lg:w-auto">
          {/* Explicit width and overflow handling for TabsList */}
          <TabsList className="flex w-full md:w-[480px] bg-slate-950 p-1 rounded-2xl h-auto flex-wrap sm:flex-nowrap">
            {Object.entries(ROLE_CONFIG).map(([key, config]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="flex-1 rounded-xl gap-2 data-[state=active]:bg-school-primary data-[state=active]:text-slate-950 transition-all font-black text-[10px] uppercase tracking-widest py-3 text-slate-400"
              >
                {config.icon} {config.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder={`Search ${activeTab.toLowerCase()}s...`} 
            className="pl-12 bg-slate-950 border-slate-800 rounded-2xl text-white focus:border-school-primary h-12 uppercase text-[10px] font-bold tracking-widest placeholder:text-slate-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Data Grid ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden bg-slate-900">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="py-40 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Querying_Registry...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-300 text-[10px] uppercase tracking-[0.3em] bg-slate-950/60 border-b border-slate-800 font-black">
                        <th className="px-10 py-6 italic">Identity</th>
                        <th className="px-10 py-6 italic">Role</th>
                        <th className="px-10 py-6 italic">Assignments</th>
                        <th className="px-10 py-6 text-right italic">Registry</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-white/[0.02] transition-all group">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-5">
                              <Avatar className="h-12 w-12 rounded-2xl border border-slate-700">
                                <AvatarFallback className="bg-slate-800 text-school-primary font-black uppercase">
                                  {user.name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-white uppercase tracking-tight text-base">{user.name || "UNNAMED"}</span>
                                <span className="text-[11px] text-slate-400 font-mono mt-0.5">{user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                             <Badge className="border-school-primary/30 text-school-primary text-[9px] font-black uppercase tracking-widest bg-school-primary/5 px-3 py-1 rounded-md">
                                {user.role}
                             </Badge>
                          </td>
                          <td className="px-10 py-6">
                             <div className="flex flex-wrap gap-2 max-w-[300px]">
                                {user.assignedClasses.length > 0 ? (
                                  user.assignedClasses.map(cls => (
                                    <span key={cls.id} className="inline-flex items-center gap-1.5 bg-slate-950 text-slate-200 px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-800">
                                      <BookOpen className="h-3.5 w-3.5 text-school-primary" /> {cls.name}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[10px] text-slate-600 font-bold uppercase italic opacity-60">Empty Registry</span>
                                )}
                             </div>
                          </td>
                          <td className="px-10 py-6 text-right">
                             <Link href={`/admin/${ROLE_CONFIG[activeTab].folder}/${user.id}`}>
                                <Button variant="ghost" className="bg-slate-950 border text-school-primary border-slate-800 hover:bg-school-primary hover:text-slate-950 transition-all rounded-xl h-11 w-11 p-0 shadow-lg">
                                  <ChevronRight className="h-6 w-6" />
                                </Button>
                             </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* ── Relationship Manager (Card-based Light Theme context) ── */}
      {(activeTab === "PARENT" || activeTab === "STUDENT") && (
         <div className="animate-in slide-in-from-bottom-6 duration-500 pt-6">
            <ParentChildLinker />
         </div>
      )}
    </div>
  );
}

export default function UnifiedUserManagementPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <Loader2 className="animate-spin text-school-primary h-8 w-8" />
        </div>
    }>
      <UserRegistryContent />
    </Suspense>
  );
}


// 'use client'

// import React, { useState, useEffect, useMemo, Suspense } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import {
//     Search, Users, GraduationCap, UserCircle, Download,
//     Loader2, ChevronRight, BookOpen, UserPlus, User,
//     AlertCircle,
// } from 'lucide-react'
// import { Input } from '@/components/ui/input'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Avatar, AvatarFallback } from '@/components/ui/avatar'
// import Link from 'next/link'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'
// import {
//     getStudentsBySchool,
//     getTeachersBySchool,
//     getParentsBySchool,
//     type UserListItem,
// } from '@/app/actions/user-management'
// import { useProfileStore } from '@/store/profileStore'
// import { ParentChildLinker } from '@/components/admin-dasboard/parent-child-linker'

// // ── Role config ────────────────────────────────────────────────────────────────

// const ROLE_CONFIG = {
//     STUDENT: {
//         label:       'Students',
//         icon:        GraduationCap,
//         folder:      'studentView',
//         color:       'text-green-400',
//         bg:          'bg-green-500/10',
//         border:      'border-green-500/20',
//         emptyLabel:  'No students registered yet.',
//     },
//     TEACHER: {
//         label:       'Teachers',
//         icon:        Users,
//         folder:      'teacherView',
//         color:       'text-blue-400',
//         bg:          'bg-blue-500/10',
//         border:      'border-blue-500/20',
//         emptyLabel:  'No teachers registered yet.',
//     },
//     PARENT: {
//         label:       'Parents',
//         icon:        UserCircle,
//         folder:      'parentView',
//         color:       'text-purple-400',
//         bg:          'bg-purple-500/10',
//         border:      'border-purple-500/20',
//         emptyLabel:  'No parents registered yet.',
//     },
// } as const

// type RoleKey = keyof typeof ROLE_CONFIG

// // ── User row ───────────────────────────────────────────────────────────────────

// function UserRow({
//     user,
//     roleKey,
// }: {
//     user:    UserListItem
//     roleKey: RoleKey
// }) {
//     const config  = ROLE_CONFIG[roleKey]
//     const initials = (user.name ?? user.email)
//         .split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

//     return (
//         <div className="flex items-center gap-3 px-4 py-3 hover:bg-school-secondary-800/40 transition-colors group">

//             {/* Avatar */}
//             <Avatar className="h-9 w-9 shrink-0 rounded-xl border border-school-secondary-700">
//                 <AvatarFallback className={cn(
//                     'rounded-xl text-xs font-black',
//                     config.bg, config.color
//                 )}>
//                     {initials}
//                 </AvatarFallback>
//             </Avatar>

//             {/* Name + email */}
//             <div className="flex-1 min-w-0">
//                 <p className="text-xs font-bold text-white truncate">
//                     {user.name ?? 'Unnamed'}
//                 </p>
//                 <p className="text-[10px] text-school-secondary-500 truncate font-mono">
//                     {user.email}
//                 </p>
//             </div>

//             {/* Classes */}
//             <div className="hidden sm:flex items-center gap-1.5 flex-wrap max-w-[220px]">
//                 {user.assignedClasses.length > 0 ? (
//                     user.assignedClasses.slice(0, 2).map(cls => (
//                         <span
//                             key={cls.id}
//                             className="inline-flex items-center gap-1 bg-school-secondary-800 border border-school-secondary-700 text-school-secondary-300 px-2 py-0.5 rounded-md text-[10px] font-semibold"
//                         >
//                             <BookOpen className="h-2.5 w-2.5 text-school-primary shrink-0" />
//                             {cls.name}
//                         </span>
//                     ))
//                 ) : (
//                     <span className="text-[10px] text-school-secondary-600 italic">
//                         No class assigned
//                     </span>
//                 )}
//                 {user.assignedClasses.length > 2 && (
//                     <span className="text-[10px] text-school-secondary-500 font-semibold">
//                         +{user.assignedClasses.length - 2} more
//                     </span>
//                 )}
//             </div>

//             {/* Role badge */}
//             <span className={cn(
//                 'hidden md:inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider shrink-0',
//                 config.bg, config.border, config.color
//             )}>
//                 {config.label.slice(0, -1)}
//             </span>

//             {/* View button */}
//             <Link href={`/admin/${config.folder}/${user.id}`} className="shrink-0">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-school-secondary-700 bg-school-secondary-800 hover:border-school-primary hover:bg-school-primary/10 hover:text-school-primary text-school-secondary-400 transition-all">
//                     <ChevronRight className="h-4 w-4" />
//                 </div>
//             </Link>
//         </div>
//     )
// }

// // ── Skeleton row ───────────────────────────────────────────────────────────────

// function SkeletonRow() {
//     return (
//         <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
//             <div className="h-9 w-9 rounded-xl bg-school-secondary-800 shrink-0" />
//             <div className="flex-1 space-y-1.5 min-w-0">
//                 <div className="h-3 w-32 rounded bg-school-secondary-800" />
//                 <div className="h-2.5 w-48 rounded bg-school-secondary-800" />
//             </div>
//             <div className="hidden sm:block h-6 w-20 rounded-md bg-school-secondary-800" />
//             <div className="h-8 w-8 rounded-lg bg-school-secondary-800 shrink-0" />
//         </div>
//     )
// }

// // ── Main content ───────────────────────────────────────────────────────────────

// function UserRegistryContent() {
//     const router       = useRouter()
//     const searchParams = useSearchParams()
//     const { profile }  = useProfileStore()
//     const schoolId     = profile?.schoolId ?? ''

//     const activeTab    = (searchParams.get('role') as RoleKey) ?? 'STUDENT'
//     const [query,      setQuery]     = useState('')
//     const [users,      setUsers]     = useState<UserListItem[]>([])
//     const [loading,    setLoading]   = useState(true)

//     function handleTabChange(key: RoleKey) {
//         router.push(`/admin/users?role=${key}`, { scroll: false })
//     }

//     useEffect(() => {
//         if (!schoolId) return
//         setLoading(true)
//         const fetcher =
//             activeTab === 'STUDENT' ? getStudentsBySchool(schoolId) :
//             activeTab === 'TEACHER' ? getTeachersBySchool(schoolId) :
//                                       getParentsBySchool(schoolId)
//         fetcher
//             .then(setUsers)
//             .catch(() => toast.error('Failed to load users.'))
//             .finally(() => setLoading(false))
//     }, [activeTab, schoolId])

//     const filtered = useMemo(() =>
//         users.filter(u =>
//             u.name?.toLowerCase().includes(query.toLowerCase()) ||
//             u.email.toLowerCase().includes(query.toLowerCase())
//         ),
//     [users, query])

//     const config = ROLE_CONFIG[activeTab]
//     const Icon   = config.icon

//     if (!profile) return null

//     return (
//         <div className="min-h-screen bg-school-secondary-950">
//             <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

//                 {/* ── Page header ── */}
//                 <div className="flex items-center justify-between gap-4 flex-wrap">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20">
//                             <User className="h-5 w-5 text-school-primary" />
//                         </div>
//                         <div>
//                             <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
//                                 User Registry
//                             </h1>
//                             <p className="text-xs text-school-secondary-400">
//                                 Manage students, teachers and parents
//                             </p>
//                         </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex items-center gap-2">
//                         <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-school-secondary-700 bg-school-secondary-800 hover:bg-school-secondary-700 text-school-secondary-300 hover:text-white text-xs font-semibold transition-all">
//                             <Download className="h-3.5 w-3.5" />
//                             Export
//                         </button>
//                         <Link href="/admin/invite-users">
//                             <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 text-xs font-bold transition-all">
//                                 <UserPlus className="h-3.5 w-3.5" />
//                                 Invite User
//                             </button>
//                         </Link>
//                     </div>
//                 </div>

//                 {/* ── Tab selector + search ── */}
//                 <Card className="bg-school-secondary-900 border-school-secondary-700">
//                     <CardContent className="p-3 sm:p-4">
//                         <div className="flex flex-col sm:flex-row gap-3">

//                             {/* Tabs */}
//                             <div className="flex gap-1 p-1 rounded-xl bg-school-secondary-950 border border-school-secondary-800">
//                                 {(Object.keys(ROLE_CONFIG) as RoleKey[]).map(key => {
//                                     const cfg      = ROLE_CONFIG[key]
//                                     const TabIcon  = cfg.icon
//                                     const isActive = activeTab === key
//                                     return (
//                                         <button
//                                             key={key}
//                                             onClick={() => handleTabChange(key)}
//                                             className={cn(
//                                                 'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap',
//                                                 isActive
//                                                     ? 'bg-school-primary text-school-secondary-950'
//                                                     : 'text-school-secondary-400 hover:text-white'
//                                             )}
//                                         >
//                                             <TabIcon className="h-3.5 w-3.5 shrink-0" />
//                                             {cfg.label}
//                                         </button>
//                                     )
//                                 })}
//                             </div>

//                             {/* Search */}
//                             <div className="relative flex-1">
//                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-school-secondary-500" />
//                                 <Input
//                                     value={query}
//                                     onChange={e => setQuery(e.target.value)}
//                                     placeholder={`Search ${config.label.toLowerCase()}...`}
//                                     className="pl-9 bg-school-secondary-950 border-school-secondary-700 text-white placeholder:text-school-secondary-600 focus:border-school-primary h-9 text-xs"
//                                 />
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* ── User list ── */}
//                 <Card className="bg-school-secondary-900 border-school-secondary-700">
//                     <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
//                         <div className="flex items-center justify-between gap-3">
//                             <div className="flex items-center gap-3">
//                                 <div className={cn(
//                                     'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border',
//                                     config.bg, config.border
//                                 )}>
//                                     <Icon className={cn('h-4 w-4', config.color)} />
//                                 </div>
//                                 <div>
//                                     <CardTitle className="text-sm font-bold text-white">
//                                         {config.label}
//                                     </CardTitle>
//                                     <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                         {loading
//                                             ? 'Loading...'
//                                             : `${filtered.length} ${config.label.toLowerCase()} found`
//                                         }
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Count badge */}
//                             {!loading && (
//                                 <span className={cn(
//                                     'inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-black',
//                                     config.bg, config.border, config.color
//                                 )}>
//                                     {filtered.length}
//                                 </span>
//                             )}
//                         </div>
//                     </CardHeader>

//                     <CardContent className="p-0">
//                         {loading ? (
//                             <div className="divide-y divide-school-secondary-800">
//                                 {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
//                             </div>
//                         ) : filtered.length === 0 ? (
//                             <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
//                                 <div className={cn(
//                                     'flex h-12 w-12 items-center justify-center rounded-2xl border',
//                                     config.bg, config.border
//                                 )}>
//                                     <Icon className={cn('h-6 w-6', config.color)} />
//                                 </div>
//                                 <p className="text-sm font-bold text-white">
//                                     {query ? `No ${config.label.toLowerCase()} match "${query}"` : config.emptyLabel}
//                                 </p>
//                                 {!query && (
//                                     <Link href="/admin/invite-users">
//                                         <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 text-xs font-bold transition-all mt-1">
//                                             <UserPlus className="h-3.5 w-3.5" />
//                                             Invite {config.label.slice(0, -1)}
//                                         </button>
//                                     </Link>
//                                 )}
//                                 {query && (
//                                     <button
//                                         onClick={() => setQuery('')}
//                                         className="text-xs text-school-primary hover:underline"
//                                     >
//                                         Clear search
//                                     </button>
//                                 )}
//                             </div>
//                         ) : (
//                             <div className="divide-y divide-school-secondary-800">
//                                 {filtered.map(user => (
//                                     <UserRow
//                                         key={user.id}
//                                         user={user}
//                                         roleKey={activeTab}
//                                     />
//                                 ))}
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>

//                 {/* ── Parent-child linker ── */}
//                 {(activeTab === 'PARENT' || activeTab === 'STUDENT') && (
//                     <div className="pt-2">
//                         <ParentChildLinker />
//                     </div>
//                 )}

//             </div>
//         </div>
//     )
// }

// // ── Page export ────────────────────────────────────────────────────────────────

// export default function UnifiedUserManagementPage() {
//     return (
//         <Suspense fallback={
//             <div className="min-h-screen bg-school-secondary-950 flex items-center justify-center">
//                 <Loader2 className="animate-spin text-school-primary h-6 w-6" />
//             </div>
//         }>
//             <UserRegistryContent />
//         </Suspense>
//     )
// }