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

// "use client"

// import { useState, useTransition } from "react"
// import { X, Loader2 } from "lucide-react"
// import { createSingleClass } from "@/app/actions/class-management"
// import { toast } from "sonner"
// import { AnyProfile } from "@/types/profile"

// // ── Types ───────────────────────────────────────────────────────────────────

// interface GradeHelper {
//   id: string
//   displayName: string
// }

// interface TeacherHelper {
//   id: string
//   name: string | null
// }

// interface CreateClassModalProps {
//   isOpen: boolean
//   onClose: () => void
//   helpers: { 
//     grades: GradeHelper[]
//     teachers: TeacherHelper[] 
//   }
//   profile: AnyProfile
//   onRefresh: () => Promise<void>
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function CreateClassModal({ 
//   isOpen, 
//   onClose, 
//   helpers, 
//   profile, 
//   onRefresh 
// }: CreateClassModalProps) {
//   const [isPending, startTransition] = useTransition()
//   const [formData, setFormData] = useState({ name: "", gradeId: "", teacherId: "" })

//   if (!isOpen) return null

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     // Safety check for schoolId
//     if (!profile.schoolId) {
//         toast.error("Institutional ID missing. Please re-login.")
//         return
//     }

//     startTransition(async () => {
//       const res = await createSingleClass(
//         profile.schoolId!, // Asserted as non-null due to check above
//         profile.id, 
//         profile.name ?? "Admin", 
//         profile.role, 
//         formData
//       )

//       if (res.success) {
//         toast.success("Classroom successfully added to registry")
//         setFormData({ name: "", gradeId: "", teacherId: "" })
//         await onRefresh()
//         onClose()
//       } else {
//         toast.error(res.error || "Failed to initialize classroom")
//       }
//     })
//   }

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
//       <div className="bg-slate-900 border border-school-secondary/20 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl scale-in-center">
        
//         <div className="flex justify-between items-start mb-8">
//           <div>
//             <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
//                 New Classroom
//             </h2>
//             <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mt-1">
//                 Define a room in the academic registry
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
//           <div className="space-y-2">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                 Room Title / Identifier
//             </label>
//             <input 
//               required
//               className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-5 py-4 text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800 font-bold"
//               placeholder="e.g. GRADE 10 ALPHA"
//               value={formData.name}
//               onChange={e => setFormData({...formData, name: e.target.value})}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                 Grade Level
//               </label>
//               <select 
//                 required
//                 className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-4 py-4 text-white focus:border-school-primary outline-none appearance-none font-bold uppercase text-xs cursor-pointer"
//                 value={formData.gradeId}
//                 onChange={e => setFormData({...formData, gradeId: e.target.value})}
//               >
//                 <option value="">Select Level</option>
//                 {helpers.grades.map(g => (
//                     <option key={g.id} value={g.id}>{g.displayName}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//                 Lead Teacher
//               </label>
//               <select 
//                 className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-4 py-4 text-white focus:border-school-primary outline-none appearance-none font-bold uppercase text-xs cursor-pointer"
//                 value={formData.teacherId}
//                 onChange={e => setFormData({...formData, teacherId: e.target.value})}
//               >
//                 <option value="">Assign Later</option>
//                 {helpers.teachers.map(t => (
//                     <option key={t.id} value={t.id}>{t.name || 'Anonymous Staff'}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <button 
//             type="submit" 
//             disabled={isPending} 
//             className="w-full bg-school-primary text-school-secondary-950 font-black py-5 rounded-2xl mt-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale shadow-xl shadow-school-primary/10 flex items-center justify-center gap-2"
//           >
//             {isPending ? (
//                 <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     REGISTERING...
//                 </>
//             ) : "CREATE CLASSROOM"}
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useTransition } from "react"
import { X, Loader2, ShieldCheck, Warehouse } from "lucide-react"
import { createSingleClass } from "@/app/actions/class-management"
import { useProfileStore } from "@/store/profileStore"
import { toast } from "sonner"
import { Role } from "@prisma/client"


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
  onRefresh: () => Promise<void>
}

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * INSTITUTIONAL INFRASTRUCTURE MODAL (Tier 2)
 * Rule 17: Decoupled from prop-drilling; fetches identity/branding from Zustand.
 * Rule 11: Real-time synchronization of the classroom registry.
 */
export function CreateClassModal({ 
  isOpen, 
  onClose, 
  helpers, 
  onRefresh 
}: CreateClassModalProps) {
  const { profile } = useProfileStore();
  const [isPending, startTransition] = useTransition();
  
  // Local Form State
  const [formData, setFormData] = useState({ name: "", gradeId: "", teacherId: "" });

  const schoolId = profile?.schoolId ?? "";
  const primaryColor = profile?.primaryColor || "#f59e0b";

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Rule 10: Security check for institutional session
    if (!schoolId || !profile) {
        toast.error("Institutional session synchronization error.");
        return;
    }

    startTransition(async () => {
      // Rule 15: Passing actor context to the server action
      const res = await createSingleClass(
        schoolId, 
        profile.id, 
        profile.name ?? "System Admin", 
        profile.role as Role, 
        formData
      );

      if (res.success) {
        toast.success("Classroom successfully provisioned in registry.");
        setFormData({ name: "", gradeId: "", teacherId: "" });
        await onRefresh();
        onClose();
      } else {
        toast.error(res.error || "Initialization failed.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/5 rounded-[3rem] w-full max-w-md p-10 shadow-2xl scale-in-center">
        
        {/* ── HEADER ── */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-slate-950 rounded-lg border border-white/5">
                    <Warehouse className="h-5 w-5" style={{ color: primaryColor }} />
                </div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                    Room Creation
                </h2>
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">
                Define a node in the institutional registry
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-600 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* ── FORM ── */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* IDENTIFIER */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Classroom Identifier
            </label>
            <input 
              required
              className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-school-primary transition-all placeholder:text-slate-800 font-black uppercase italic text-sm"
              placeholder="e.g. JSS 1 SAPPHIRE"
              value={formData.name}
              style={{ '--tw-ring-color': primaryColor } as any}
              onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEVEL SELECTION */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Grade Level
              </label>
              <div className="relative">
                <select 
                    required
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-school-primary outline-none appearance-none font-black uppercase italic text-xs cursor-pointer"
                    value={formData.gradeId}
                    onChange={e => setFormData({...formData, gradeId: e.target.value})}
                >
                    <option value="">Select Level</option>
                    {helpers.grades.map(g => (
                        <option key={g.id} value={g.id}>{g.displayName}</option>
                    ))}
                </select>
              </div>
            </div>

            {/* INSTRUCTOR SELECTION */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Lead Instructor
              </label>
              <div className="relative">
                <select 
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-school-primary outline-none appearance-none font-black uppercase italic text-xs cursor-pointer"
                    value={formData.teacherId}
                    onChange={e => setFormData({...formData, teacherId: e.target.value})}
                >
                    <option value="">Pending Assignment</option>
                    {helpers.teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name || 'Unregistered Staff'}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-6">
            <div className="flex items-center gap-3 px-2 text-slate-600">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-[9px] font-bold uppercase tracking-widest">Initialization will enable student placement nodes.</p>
            </div>

            <button 
                type="submit" 
                disabled={isPending} 
                className="w-full text-slate-950 font-black py-6 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale shadow-xl shadow-school-primary/10 flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.3em]"
                style={{ backgroundColor: primaryColor }}
            >
                {isPending ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Provisioning...
                    </>
                ) : (
                    "Initialize Classroom Node"
                )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}