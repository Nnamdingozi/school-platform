// "use client"

// import { useState, useEffect, useTransition } from "react"
// import { X, Search, Loader2 } from "lucide-react"
// import { enrollSingleStudent, searchStudents } from "@/app/actions/class-management"
// import { toast } from "sonner"

// interface Props {
//   isOpen: boolean
//   onClose: () => void
//   classes: any[]
//   profile: any
//   onRefresh: () => Promise<void>
// }

// export function EnrollStudentModal({ isOpen, onClose, classes, profile, onRefresh }: Props) {
//   const [isPending, startTransition] = useTransition()
//   const [studentQuery, setStudentQuery] = useState("")
//   const [searchResults, setSearchResults] = useState<any[]>([])
//   const [isSearching, setIsSearching] = useState(false)
//   const [formData, setFormData] = useState({ studentId: "", classId: "" })

//   useEffect(() => {
//     if (studentQuery.length < 2 || formData.studentId) {
//       setSearchResults([])
//       return
//     }
//     const delayDebounceFn = setTimeout(async () => {
//       setIsSearching(true)
//       try {
//         const results = await searchStudents(profile.schoolId, studentQuery)
//         setSearchResults(results)
//       } finally {
//         setIsSearching(false)
//       }
//     }, 400)
//     return () => clearTimeout(delayDebounceFn)
//   }, [studentQuery, profile.schoolId, formData.studentId])

//   if (!isOpen) return null

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     startTransition(async () => {
//       const res = await enrollSingleStudent(profile.schoolId, profile.id, profile.name, profile.role, formData)
//       if (res.success) {
//         toast.success("Placement confirmed")
//         setStudentQuery("")
//         setFormData({ studentId: "", classId: "" })
//         await onRefresh()
//         onClose()
//       } else {
//         toast.error(res.error || "Placement failed")
//       }
//     })
//   }

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
//       <div className="bg-slate-900 border border-school-secondary/20 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl scale-in-center">
//         <div className="flex justify-between items-start mb-8">
//           <div>
//             <h2 className="text-2xl font-black text-white italic uppercase">Place Student</h2>
//             <p className="text-slate-500 text-sm">Assign student identity to room</p>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X className="text-slate-500" /></button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2 relative">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Lookup</label>
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
//               <input 
//                 type="text"
//                 className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800"
//                 placeholder="Search name or email..."
//                 value={studentQuery}
//                 onChange={(e) => setStudentQuery(e.target.value)}
//               />
//             </div>
//             {searchResults.length > 0 && (
//               <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-white/5 rounded-2xl overflow-hidden z-[110] shadow-2xl">
//                 {searchResults.map(s => (
//                   <button key={s.id} type="button" onClick={() => { setFormData({...formData, studentId: s.id}); setStudentQuery(`${s.name} (${s.email})`); setSearchResults([]); }}
//                     className="w-full text-left px-5 py-4 text-sm hover:bg-school-primary hover:text-slate-950 transition-colors border-b border-white/5 last:border-0"
//                   >
//                     <p className="font-black">{s.name}</p>
//                     <p className="text-[10px] opacity-60 uppercase">{s.email}</p>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="space-y-2">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination</label>
//             <select required className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-5 py-4 text-white focus:border-school-primary outline-none appearance-none"
//               value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})}>
//               <option value="">Select room...</option>
//               {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//             </select>
//           </div>

//           <button type="submit" disabled={isPending || !formData.studentId} className="w-full bg-school-primary text-school-secondary font-black py-5 rounded-2xl mt-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30">
//             {isPending ? "SYNCHRONIZING..." : "CONFIRM PLACEMENT"}
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect, useTransition, useCallback } from "react"
// import { X, Search, Loader2, CheckCircle2 } from "lucide-react"
// import { enrollSingleStudent, searchStudents } from "@/app/actions/class-management"
// import { toast } from "sonner"
// import { AnyProfile } from "@/types/profile"

// // ── Types ───────────────────────────────────────────────────────────────────

// interface StudentSearchResult {
//   id: string
//   name: string | null
//   email: string
// }

// interface ClassroomOption {
//   id: string
//   name: string
// }

// interface EnrollStudentModalProps {
//   isOpen: boolean
//   onClose: () => void
//   classes: ClassroomOption[]
//   profile: AnyProfile
//   onRefresh: () => Promise<void>
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function EnrollStudentModal({ 
//   isOpen, 
//   onClose, 
//   classes, 
//   profile, 
//   onRefresh 
// }: EnrollStudentModalProps) {
//   const [isPending, startTransition] = useTransition()
  
//   // State Management
//   const [studentQuery, setStudentQuery] = useState<string>("")
//   const [searchResults, setSearchResults] = useState<StudentSearchResult[]>([])
//   const [isSearching, setIsSearching] = useState<boolean>(false)
//   const [formData, setFormData] = useState({ studentId: "", classId: "" })

//   // ── Search Logic ──
//   const performSearch = useCallback(async () => {
//     if (studentQuery.length < 2 || formData.studentId || !profile.schoolId) {
//       setSearchResults([])
//       return
//     }

//     setIsSearching(true)
//     try {
//       const results = await searchStudents(profile.schoolId, studentQuery)
//       setSearchResults(results as StudentSearchResult[])
//     } catch (error) {
//       console.error("Registry search failure:", error)
//     } finally {
//       setIsSearching(false)
//     }
//   }, [studentQuery, profile.schoolId, formData.studentId])

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       performSearch()
//     }, 400)
//     return () => clearTimeout(delayDebounceFn)
//   }, [performSearch])

//   if (!isOpen) return null

//   // ── Handlers ──
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!profile.schoolId) {
//         toast.error("Institutional session expired.")
//         return
//     }

//     startTransition(async () => {
//       const res = await enrollSingleStudent(
//         profile.schoolId!, 
//         profile.id, 
//         profile.name ?? "Admin", 
//         profile.role, 
//         formData
//       )

//       if (res.success) {
//         toast.success("Student successfully placed in classroom")
//         setStudentQuery("")
//         setFormData({ studentId: "", classId: "" })
//         await onRefresh()
//         onClose()
//       } else {
//         toast.error(res.error || "Placement procedure failed")
//       }
//     })
//   }

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
//       <div className="bg-slate-900 border border-school-secondary/20 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl scale-in-center">
        
//         <div className="flex justify-between items-start mb-8">
//           <div>
//             <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">
//                 Student Placement
//             </h2>
//             <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mt-2">
//                 Assign student identity to classroom
//             </p>
//           </div>
//           <button 
//             onClick={onClose} 
//             className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-white"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Student Search Field */}
//           <div className="space-y-2 relative">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                 Identity Lookup (Name or Email)
//             </label>
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
//               <input 
//                 type="text"
//                 className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800 font-bold"
//                 placeholder="SEARCH REGISTRY..."
//                 value={studentQuery}
//                 onChange={(e) => {
//                     setStudentQuery(e.target.value)
//                     if (formData.studentId) setFormData({ ...formData, studentId: "" })
//                 }}
//               />
//             </div>

//             {/* Search Results Dropdown */}
//             {(isSearching || searchResults.length > 0) && (
//               <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-school-secondary/30 rounded-2xl overflow-hidden z-[110] shadow-2xl max-h-60 overflow-y-auto">
//                 {isSearching ? (
//                   <div className="p-5 text-xs text-slate-500 flex items-center gap-3 italic">
//                     <Loader2 className="h-3 w-3 animate-spin text-school-primary" /> Validating Registry...
//                   </div>
//                 ) : (
//                   searchResults.map(s => (
//                     <button 
//                       key={s.id} 
//                       type="button" 
//                       onClick={() => { 
//                         setFormData({...formData, studentId: s.id}); 
//                         setStudentQuery(`${s.name || 'Unknown'} (${s.email})`); 
//                         setSearchResults([]); 
//                       }}
//                       className="w-full text-left px-5 py-4 text-sm hover:bg-school-primary hover:text-school-secondary-950 transition-colors border-b border-white/5 last:border-0 group"
//                     >
//                       <p className="font-black uppercase italic group-hover:text-inherit text-white">{s.name || 'Anonymous'}</p>
//                       <p className="text-[10px] opacity-60 uppercase tracking-tighter">{s.email}</p>
//                     </button>
//                   ))
//                 )}
//               </div>
//             )}

//             {formData.studentId && (
//                 <div className="flex items-center gap-2 mt-2 ml-1 text-emerald-500 animate-in fade-in slide-in-from-left-2">
//                     <CheckCircle2 className="h-3 w-3" />
//                     <span className="text-[10px] font-black uppercase tracking-widest">Verified Student Selected</span>
//                 </div>
//             )}
//           </div>

//           {/* Destination Class Selection */}
//           <div className="space-y-2">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                 Target Classroom Group
//             </label>
//             <select 
//               required 
//               className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-5 py-4 text-white focus:border-school-primary outline-none appearance-none font-bold uppercase text-xs cursor-pointer"
//               value={formData.classId} 
//               onChange={e => setFormData({...formData, classId: e.target.value})}
//             >
//               <option value="">Choose Destination...</option>
//               {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//             </select>
//           </div>

//           {/* Submit Button */}
//           <button 
//             type="submit" 
//             disabled={isPending || !formData.studentId || !formData.classId} 
//             className="w-full bg-school-primary text-school-secondary-950 font-black py-5 rounded-2xl mt-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale shadow-xl shadow-school-primary/10 flex items-center justify-center gap-2"
//           >
//             {isPending ? (
//                 <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     PROCESSING PLACEMENT...
//                 </>
//             ) : "CONFIRM PLACEMENT"}
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }



// "use client"

// import { useState, useEffect, useTransition, useCallback } from "react"
// import { X, Search, Loader2, CheckCircle2, GraduationCap } from "lucide-react"
// import { enrollSingleStudent, searchStudents } from "@/app/actions/class-management"
// import { useProfileStore } from "@/store/profileStore"
// import { toast } from "sonner"
// import { Role } from "@prisma/client"
// import { cn } from "@/lib/utils"

// // ── Types ───────────────────────────────────────────────────────────────────

// interface StudentSearchResult {
//   id: string
//   name: string | null
//   email: string
// }

// interface ClassroomOption {
//   id: string
//   name: string
// }

// interface EnrollStudentModalProps {
//   isOpen: boolean
//   onClose: () => void
//   classes: ClassroomOption[]
//   onRefresh: () => Promise<void>
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * INSTITUTIONAL STUDENT PLACEMENT MODAL (Tier 2)
//  * Rule 17: Decoupled from parent props; fetches identity/branding from Zustand.
//  * Rule 15: Synced with refactored 'enrollSingleStudent' parameters.
//  */
// export function EnrollStudentModal({ 
//   isOpen, 
//   onClose, 
//   classes, 
//   onRefresh 
// }: EnrollStudentModalProps) {
//   const { profile } = useProfileStore();
//   const [isPending, startTransition] = useTransition()
  
//   // Local State
//   const [studentQuery, setStudentQuery] = useState<string>("")
//   const [searchResults, setSearchResults] = useState<StudentSearchResult[]>([])
//   const [isSearching, setIsSearching] = useState<boolean>(false)
//   const [formData, setFormData] = useState({ studentId: "", classId: "" })

//   const schoolId = profile?.schoolId ?? "";
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   // ── Registry Search Logic ──
//   const performSearch = useCallback(async () => {
//     if (studentQuery.length < 2 || formData.studentId || !schoolId) {
//       setSearchResults([])
//       return
//     }

//     setIsSearching(true)
//     try {
//       // Rule 5: Search is strictly limited to the current schoolId
//       const results = await searchStudents(schoolId, studentQuery)
//       setSearchResults(results as StudentSearchResult[])
//     } catch (error) {
//       console.error("Registry search failure:", error)
//     } finally {
//       setIsSearching(false)
//     }
//   }, [studentQuery, schoolId, formData.studentId])

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       performSearch()
//     }, 400)
//     return () => clearTimeout(delayDebounceFn)
//   }, [performSearch])

//   if (!isOpen) return null

//   // ── Placement Handler ──
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!schoolId || !profile) {
//         toast.error("Institutional session synchronization error.");
//         return
//     }

//     startTransition(async () => {
//       // Rule 15: Passing actor context to the server action
//       const res = await enrollSingleStudent(
//         schoolId, 
//         profile.id, 
//         profile.name ?? "System Admin", 
//         profile.role as Role, 
//         formData
//       )

//       if (res.success) {
//         toast.success("Student successfully synchronized with classroom.");
//         setStudentQuery("")
//         setFormData({ studentId: "", classId: "" })
//         await onRefresh()
//         onClose()
//       } else {
//         toast.error(res.error || "Placement procedure failed.");
//       }
//     })
//   }

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
//       <div className="bg-slate-900 border border-white/5 rounded-[3rem] w-full max-w-md p-10 shadow-2xl scale-in-center">
        
//         <div className="flex justify-between items-start mb-10">
//           <div>
//             <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
//                 Placement Hub
//             </h2>
//             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-3">
//                 Bind identity to institutional classroom
//             </p>
//           </div>
//           <button 
//             onClick={onClose} 
//             className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-600 hover:text-white"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* SEARCH FIELD */}
//           <div className="space-y-3 relative">
//             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
//                 Student Registry Lookup
//             </label>
//             <div className="relative group">
//               <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-school-primary transition-colors" style={{ color: primaryColor }} />
//               <input 
//                 type="text"
//                 autoComplete="off"
//                 className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-sm text-white outline-none focus:border-school-primary transition-all placeholder:text-slate-800 font-bold uppercase italic"
//                 placeholder="Name or Email..."
//                 value={studentQuery}
//                 onChange={(e) => {
//                     setStudentQuery(e.target.value)
//                     if (formData.studentId) setFormData({ ...formData, studentId: "" })
//                 }}
//               />
//             </div>

//             {/* RESULTS DROPDOWN */}
//             {(isSearching || searchResults.length > 0) && (
//               <div className="absolute top-full left-0 right-0 mt-3 bg-slate-950 border border-white/10 rounded-2xl overflow-hidden z-[110] shadow-2xl max-h-64 overflow-y-auto no-scrollbar">
//                 {isSearching ? (
//                   <div className="p-6 text-[10px] text-slate-500 flex items-center gap-3 font-black uppercase tracking-widest italic">
//                     <Loader2 className="h-4 w-4 animate-spin" style={{ color: primaryColor }} /> Querying_Registry...
//                   </div>
//                 ) : (
//                   searchResults.map(s => (
//                     <button 
//                       key={s.id} 
//                       type="button" 
//                       onClick={() => { 
//                         setFormData({...formData, studentId: s.id}); 
//                         setStudentQuery(s.name || s.email); 
//                         setSearchResults([]); 
//                       }}
//                       className="w-full text-left px-6 py-5 hover:bg-white/[0.03] transition-colors border-b border-white/5 last:border-0 group"
//                     >
//                       <p className="font-black uppercase italic text-white group-hover:text-school-primary transition-colors" style={{ color: primaryColor }}>{s.name || 'Identity Unknown'}</p>
//                       <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter mt-1">{s.email}</p>
//                     </button>
//                   ))
//                 )}
//               </div>
//             )}

//             {formData.studentId && (
//                 <div className="flex items-center gap-2 mt-3 ml-2 text-emerald-500 animate-in slide-in-from-left-2">
//                     <CheckCircle2 className="h-4 w-4" />
//                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Registry Entry</span>
//                 </div>
//             )}
//           </div>

//           {/* DESTINATION SELECTION */}
//           <div className="space-y-3">
//             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
//                 Target Classroom Node
//             </label>
//             <div className="relative">
//                 <select 
//                 required 
//                 className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-school-primary outline-none appearance-none font-black uppercase italic text-sm cursor-pointer"
//                 value={formData.classId} 
//                 onChange={e => setFormData({...formData, classId: e.target.value})}
//                 >
//                 <option value="">Choose Destination...</option>
//                 {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//                 </select>
//                 <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
//                     <GraduationCap className="h-5 w-5 text-white" />
//                 </div>
//             </div>
//           </div>

//           {/* ACTION BUTTON */}
//           <button 
//             type="submit" 
//             disabled={isPending || !formData.studentId || !formData.classId} 
//             className="w-full bg-school-primary text-slate-950 font-black py-6 rounded-2xl mt-6 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale shadow-xl shadow-school-primary/10 flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.3em]"
//             style={{ backgroundColor: primaryColor }}
//           >
//             {isPending ? (
//                 <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Synchronizing...
//                 </>
//             ) : (
//                 <>
//                     Confirm Placement <ArrowRight className="h-4 w-4" />
//                 </>
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// function ArrowRight({ className }: { className?: string }) {
//     return (
//         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
//     )
// }


"use client"

import React, { useState, useEffect, useTransition, useCallback } from "react"
import { X, Search, Loader2, CheckCircle2, GraduationCap, ChevronDown, ArrowRight } from "lucide-react"
import { enrollSingleStudent, searchStudents } from "@/app/actions/class-management"
import { useProfileStore } from "@/store/profileStore"
import { toast } from "sonner"
import { Role } from "@prisma/client"
import { cn } from "@/lib/utils"

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface StudentSearchResult {
  id: string
  name: string | null
  email: string
}

interface ClassroomOption {
  id: string
  name: string
}

interface EnrollStudentModalProps {
  isOpen: boolean
  onClose: () => void
  classes: ClassroomOption[]
  onRefresh: () => Promise<void>
}

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * INSTITUTIONAL STUDENT PLACEMENT MODAL
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function EnrollStudentModal({ 
  isOpen, 
  onClose, 
  classes, 
  onRefresh 
}: EnrollStudentModalProps) {
  const { profile } = useProfileStore();
  const [isPending, startTransition] = useTransition()
  
  const [studentQuery, setStudentQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<StudentSearchResult[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [formData, setFormData] = useState({ studentId: "", classId: "" })

  const schoolId = profile?.schoolId ?? "";

  // ── Registry Search Logic ──
  const performSearch = useCallback(async () => {
    if (studentQuery.length < 2 || formData.studentId || !schoolId) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      // Rule 5: Scoped institutional lookup
      const results = await searchStudents(schoolId, studentQuery)
      setSearchResults(results as StudentSearchResult[])
    } catch (error) {
      console.error("[REGISTRY_SEARCH_FAULT]:", error)
    } finally {
      setIsSearching(false)
    }
  }, [studentQuery, schoolId, formData.studentId])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      performSearch()
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [performSearch])

  if (!isOpen) return null

  // ── Placement Handler ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!schoolId || !profile) {
        toast.error("Institutional session synchronization error.");
        return
    }

    startTransition(async () => {
      const res = await enrollSingleStudent(
        schoolId, 
        profile.id, 
        profile.name ?? "System Admin", 
        profile.role as Role, 
        formData
      )

      if (res.success) {
        toast.success("Identity synchronization complete.");
        setStudentQuery("")
        setFormData({ studentId: "", classId: "" })
        await onRefresh()
        onClose()
      } else {
        toast.error(res.error || "Placement procedure failed.");
      }
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Rule 19: Modal standardized to rounded-[2rem] */}
      <div className="bg-card border border-border rounded-[2rem] w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-300">
        
        {/* ── HEADER ── */}
        <div className="p-8 md:p-10 pb-0">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground italic uppercase tracking-tighter leading-none">
                  Placement Hub
              </h2>
              <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
                  Bind identity to institutional classroom
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface rounded-xl transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── FORM ── */}
        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
          {/* SEARCH FIELD */}
          <div className="space-y-3 relative">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Student Registry Lookup
            </label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
              <input 
                type="text"
                autoComplete="off"
                className="w-full bg-surface border border-border rounded-xl pl-11 pr-6 py-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-school-primary-200 transition-all placeholder:text-muted-foreground/30 font-semibold uppercase italic"
                placeholder="Identity Name or Email..."
                value={studentQuery}
                onChange={(e) => {
                    setStudentQuery(e.target.value)
                    if (formData.studentId) setFormData({ ...formData, studentId: "" })
                }}
              />
            </div>

            {/* RESULTS DROPDOWN (Rule 18/19) */}
            {(isSearching || searchResults.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-card border border-border rounded-2xl overflow-hidden z-[110] shadow-2xl max-h-64 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200">
                {isSearching ? (
                  <div className="p-6 text-[10px] text-muted-foreground flex items-center gap-3 font-bold uppercase tracking-widest italic">
                    <Loader2 className="h-4 w-4 animate-spin text-school-primary" /> Synchronizing_Query...
                  </div>
                ) : (
                  searchResults.map(s => (
                    <button 
                      key={s.id} 
                      type="button" 
                      onClick={() => { 
                        setFormData({...formData, studentId: s.id}); 
                        setStudentQuery(s.name || s.email); 
                        setSearchResults([]); 
                      }}
                      className="w-full text-left px-6 py-4 hover:bg-school-primary hover:text-on-school-primary transition-all border-b border-border last:border-0 group"
                    >
                      <p className="font-extrabold uppercase italic text-sm truncate">{s.name || 'Anonymous Node'}</p>
                      <p className="text-[9px] font-bold uppercase tracking-tighter opacity-70 mt-1">{s.email}</p>
                    </button>
                  ))
                )}
              </div>
            )}

            {formData.studentId && (
                <div className="flex items-center gap-2 mt-3 ml-2 text-emerald-500 animate-in slide-in-from-left-2">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-bold uppercase tracking-widest italic">Verified Registry Entry</span>
                </div>
            )}
          </div>

          {/* DESTINATION SELECTION (Rule 18) */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Target Classroom Node
            </label>
            <div className="relative group">
                <select 
                required 
                className="w-full bg-surface border border-border rounded-xl px-5 py-4 text-foreground focus:ring-2 focus:ring-school-primary-200 outline-none appearance-none font-bold uppercase italic text-xs cursor-pointer transition-all"
                value={formData.classId} 
                onChange={e => setFormData({...formData, classId: e.target.value})}
                >
                <option value="" className="bg-card">Choose Destination...</option>
                {classes.map(c => <option key={c.id} value={c.id} className="bg-card">{c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-hover:text-school-primary transition-colors" />
            </div>
          </div>

          {/* ACTION BUTTON (Rule 21 Scale Protocol) */}
          <button 
            type="submit" 
            disabled={isPending || !formData.studentId || !formData.classId} 
            className="w-full bg-school-primary text-on-school-primary font-extrabold py-5 rounded-2xl mt-4 hover:brightness-110 active:scale-95 transition-all disabled:opacity-20 shadow-xl shadow-school-primary-200 flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest"
          >
            {isPending ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Synchronizing...
                </>
            ) : (
                <>
                    Confirm Placement <ArrowRight className="h-4 w-4" />
                </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}