// "use client"

// import { useState, useTransition } from "react"
// import { X } from "lucide-react"
// import { createSingleClass } from "@/app/actions/class-management"
// import { toast } from "sonner"

// interface Props {
//   isOpen: boolean
//   onClose: () => void
//   helpers: { grades: any[], teachers: any[] }
//   profile: any
//   onRefresh: () => Promise<void>
// }

// export function CreateClassModal({ isOpen, onClose, helpers, profile, onRefresh }: Props) {
//   const [isPending, startTransition] = useTransition()
//   const [formData, setFormData] = useState({ name: "", gradeId: "", teacherId: "" })

//   if (!isOpen) return null

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     startTransition(async () => {
//       const res = await createSingleClass(
//         profile.schoolId, 
//         profile.id, 
//         profile.name ?? "Admin", 
//         profile.role, 
//         formData
//       )
//       if (res.success) {
//         toast.success("Class room created")
//         setFormData({ name: "", gradeId: "", teacherId: "" })
//         await onRefresh()
//         onClose()
//       } else {
//         toast.error(res.error || "Failed to create")
//       }
//     })
//   }

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
//       <div className="bg-slate-900 border border-school-secondary/20 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl scale-in-center">
//         <div className="flex justify-between items-start mb-8">
//           <div>
//             <h2 className="text-2xl font-black text-white italic uppercase">New Classroom</h2>
//             <p className="text-slate-500 text-sm">Add a specific room to the registry</p>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
//             <X className="text-slate-500" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Title</label>
//             <input 
//               required
//               className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-5 py-4 text-white focus:border-school-primary outline-none transition-all"
//               placeholder="e.g. Science 101"
//               value={formData.name}
//               onChange={e => setFormData({...formData, name: e.target.value})}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grade</label>
//               <select 
//                 required
//                 className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-4 py-4 text-white focus:border-school-primary outline-none appearance-none"
//                 value={formData.gradeId}
//                 onChange={e => setFormData({...formData, gradeId: e.target.value})}
//               >
//                 <option value="">Select...</option>
//                 {helpers.grades.map(g => <option key={g.id} value={g.id}>{g.displayName}</option>)}
//               </select>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teacher</label>
//               <select 
//                 className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-4 py-4 text-white focus:border-school-primary outline-none appearance-none"
//                 value={formData.teacherId}
//                 onChange={e => setFormData({...formData, teacherId: e.target.value})}
//               >
//                 <option value="">Unassigned</option>
//                 {helpers.teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//               </select>
//             </div>
//           </div>

//           <button type="submit" disabled={isPending} className="w-full bg-school-primary text-school-secondary font-black py-5 rounded-2xl mt-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50">
//             {isPending ? "REGISTERING..." : "CREATE CLASSROOM"}
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useTransition } from "react"
import { X, Loader2 } from "lucide-react"
import { createSingleClass } from "@/app/actions/class-management"
import { toast } from "sonner"
import { AnyProfile } from "@/types/profile"

// ── Types ───────────────────────────────────────────────────────────────────

interface GradeHelper {
  id: string
  displayName: string
}

interface TeacherHelper {
  id: string
  name: string | null
}

interface CreateClassModalProps {
  isOpen: boolean
  onClose: () => void
  helpers: { 
    grades: GradeHelper[]
    teachers: TeacherHelper[] 
  }
  profile: AnyProfile
  onRefresh: () => Promise<void>
}

// ── Main Component ──────────────────────────────────────────────────────────

export function CreateClassModal({ 
  isOpen, 
  onClose, 
  helpers, 
  profile, 
  onRefresh 
}: CreateClassModalProps) {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({ name: "", gradeId: "", teacherId: "" })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Safety check for schoolId
    if (!profile.schoolId) {
        toast.error("Institutional ID missing. Please re-login.")
        return
    }

    startTransition(async () => {
      const res = await createSingleClass(
        profile.schoolId!, // Asserted as non-null due to check above
        profile.id, 
        profile.name ?? "Admin", 
        profile.role, 
        formData
      )

      if (res.success) {
        toast.success("Classroom successfully added to registry")
        setFormData({ name: "", gradeId: "", teacherId: "" })
        await onRefresh()
        onClose()
      } else {
        toast.error(res.error || "Failed to initialize classroom")
      }
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
      <div className="bg-slate-900 border border-school-secondary/20 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl scale-in-center">
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                New Classroom
            </h2>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mt-1">
                Define a room in the academic registry
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
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Room Title / Identifier
            </label>
            <input 
              required
              className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-5 py-4 text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800 font-bold"
              placeholder="e.g. GRADE 10 ALPHA"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Grade Level
              </label>
              <select 
                required
                className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-4 py-4 text-white focus:border-school-primary outline-none appearance-none font-bold uppercase text-xs cursor-pointer"
                value={formData.gradeId}
                onChange={e => setFormData({...formData, gradeId: e.target.value})}
              >
                <option value="">Select Level</option>
                {helpers.grades.map(g => (
                    <option key={g.id} value={g.id}>{g.displayName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Lead Teacher
              </label>
              <select 
                className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-4 py-4 text-white focus:border-school-primary outline-none appearance-none font-bold uppercase text-xs cursor-pointer"
                value={formData.teacherId}
                onChange={e => setFormData({...formData, teacherId: e.target.value})}
              >
                <option value="">Assign Later</option>
                {helpers.teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name || 'Anonymous Staff'}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending} 
            className="w-full bg-school-primary text-school-secondary-950 font-black py-5 rounded-2xl mt-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale shadow-xl shadow-school-primary/10 flex items-center justify-center gap-2"
          >
            {isPending ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    REGISTERING...
                </>
            ) : "CREATE CLASSROOM"}
          </button>
        </form>
      </div>
    </div>
  )
}