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

"use client"

import { useState, useEffect, useTransition, useCallback } from "react"
import { X, Search, Loader2, CheckCircle2 } from "lucide-react"
import { enrollSingleStudent, searchStudents } from "@/app/actions/class-management"
import { toast } from "sonner"
import { AnyProfile } from "@/types/profile"

// ── Types ───────────────────────────────────────────────────────────────────

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
  profile: AnyProfile
  onRefresh: () => Promise<void>
}

// ── Main Component ──────────────────────────────────────────────────────────

export function EnrollStudentModal({ 
  isOpen, 
  onClose, 
  classes, 
  profile, 
  onRefresh 
}: EnrollStudentModalProps) {
  const [isPending, startTransition] = useTransition()
  
  // State Management
  const [studentQuery, setStudentQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<StudentSearchResult[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [formData, setFormData] = useState({ studentId: "", classId: "" })

  // ── Search Logic ──
  const performSearch = useCallback(async () => {
    if (studentQuery.length < 2 || formData.studentId || !profile.schoolId) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await searchStudents(profile.schoolId, studentQuery)
      setSearchResults(results as StudentSearchResult[])
    } catch (error) {
      console.error("Registry search failure:", error)
    } finally {
      setIsSearching(false)
    }
  }, [studentQuery, profile.schoolId, formData.studentId])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      performSearch()
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [performSearch])

  if (!isOpen) return null

  // ── Handlers ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!profile.schoolId) {
        toast.error("Institutional session expired.")
        return
    }

    startTransition(async () => {
      const res = await enrollSingleStudent(
        profile.schoolId!, 
        profile.id, 
        profile.name ?? "Admin", 
        profile.role, 
        formData
      )

      if (res.success) {
        toast.success("Student successfully placed in classroom")
        setStudentQuery("")
        setFormData({ studentId: "", classId: "" })
        await onRefresh()
        onClose()
      } else {
        toast.error(res.error || "Placement procedure failed")
      }
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
      <div className="bg-slate-900 border border-school-secondary/20 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl scale-in-center">
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">
                Student Placement
            </h2>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mt-2">
                Assign student identity to classroom
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Search Field */}
          <div className="space-y-2 relative">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Identity Lookup (Name or Email)
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
              <input 
                type="text"
                className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800 font-bold"
                placeholder="SEARCH REGISTRY..."
                value={studentQuery}
                onChange={(e) => {
                    setStudentQuery(e.target.value)
                    if (formData.studentId) setFormData({ ...formData, studentId: "" })
                }}
              />
            </div>

            {/* Search Results Dropdown */}
            {(isSearching || searchResults.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-school-secondary/30 rounded-2xl overflow-hidden z-[110] shadow-2xl max-h-60 overflow-y-auto">
                {isSearching ? (
                  <div className="p-5 text-xs text-slate-500 flex items-center gap-3 italic">
                    <Loader2 className="h-3 w-3 animate-spin text-school-primary" /> Validating Registry...
                  </div>
                ) : (
                  searchResults.map(s => (
                    <button 
                      key={s.id} 
                      type="button" 
                      onClick={() => { 
                        setFormData({...formData, studentId: s.id}); 
                        setStudentQuery(`${s.name || 'Unknown'} (${s.email})`); 
                        setSearchResults([]); 
                      }}
                      className="w-full text-left px-5 py-4 text-sm hover:bg-school-primary hover:text-school-secondary-950 transition-colors border-b border-white/5 last:border-0 group"
                    >
                      <p className="font-black uppercase italic group-hover:text-inherit text-white">{s.name || 'Anonymous'}</p>
                      <p className="text-[10px] opacity-60 uppercase tracking-tighter">{s.email}</p>
                    </button>
                  ))
                )}
              </div>
            )}

            {formData.studentId && (
                <div className="flex items-center gap-2 mt-2 ml-1 text-emerald-500 animate-in fade-in slide-in-from-left-2">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Student Selected</span>
                </div>
            )}
          </div>

          {/* Destination Class Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Target Classroom Group
            </label>
            <select 
              required 
              className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-5 py-4 text-white focus:border-school-primary outline-none appearance-none font-bold uppercase text-xs cursor-pointer"
              value={formData.classId} 
              onChange={e => setFormData({...formData, classId: e.target.value})}
            >
              <option value="">Choose Destination...</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isPending || !formData.studentId || !formData.classId} 
            className="w-full bg-school-primary text-school-secondary-950 font-black py-5 rounded-2xl mt-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale shadow-xl shadow-school-primary/10 flex items-center justify-center gap-2"
          >
            {isPending ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    PROCESSING PLACEMENT...
                </>
            ) : "CONFIRM PLACEMENT"}
          </button>
        </form>
      </div>
    </div>
  )
}