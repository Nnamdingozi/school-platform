// 'use client'

// import { useState, useEffect } from 'react'
// import {
//     getClassesBySchool, assignTeacherToClass,
//     assignUserToClass
// } from '@/app/actions/user-management'
// import { X, Loader2, BookOpen, CheckCircle2 } from 'lucide-react'
// import { Card, CardContent } from '@/components/ui/card'

// // ── Section wrapper ────────────────────────────────────────────────────────────
// interface SectionProps {
//     title:    string
//     icon:     React.ReactNode
//     children: React.ReactNode
// }

// export function Section({ title, icon, children }: SectionProps) {
//     return (
//         <Card className="bg-school-secondary-900 border-school-secondary-700">
//             <CardContent className="p-5 sm:p-6 space-y-4">
//                 <div className="flex items-center gap-2 border-b border-school-secondary-700 pb-3">
//                     {icon}
//                     <h2 className="text-sm font-bold text-white uppercase tracking-wider">
//                         {title}
//                     </h2>
//                 </div>
//                 {children}
//             </CardContent>
//         </Card>
//     )
// }

// // ── Empty section ──────────────────────────────────────────────────────────────
// export function EmptySection({ message }: { message: string }) {
//     return (
//         <p className="text-sm text-school-secondary-400 py-2">{message}</p>
//     )
// }

// // ── Detail skeleton ────────────────────────────────────────────────────────────
// export function DetailSkeleton() {
//     return (
//         <div className="min-h-screen bg-school-secondary-950 p-4 sm:p-6 lg:p-8">
//             <div className="max-w-4xl mx-auto space-y-6">
//                 <div className="h-4 w-24 rounded bg-school-secondary-700 animate-pulse" />
//                 <Card className="bg-school-secondary-900 border-school-secondary-700">
//                     <CardContent className="p-6">
//                         <div className="flex items-center gap-4">
//                             <div className="h-16 w-16 rounded-2xl bg-school-secondary-700 animate-pulse" />
//                             <div className="space-y-2 flex-1">
//                                 <div className="h-5 w-40 rounded bg-school-secondary-700 animate-pulse" />
//                                 <div className="h-3 w-56 rounded bg-school-secondary-700 animate-pulse" />
//                                 <div className="h-3 w-32 rounded bg-school-secondary-700 animate-pulse" />
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//                 {[...Array(3)].map((_, i) => (
//                     <Card key={i} className="bg-school-secondary-900 border-school-secondary-700">
//                         <CardContent className="p-5 sm:p-6 space-y-3">
//                             <div className="h-4 w-32 rounded bg-school-secondary-700 animate-pulse" />
//                             <div className="h-16 rounded-lg bg-school-secondary-700 animate-pulse" />
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     )
// }

// // ── Assign Class Modal ─────────────────────────────────────────────────────────
// interface AssignClassModalProps {
//     userId:    string
//     schoolId:  string
//     role:      'teacher' | 'student' | 'parent'
//     onClose:   () => void
//     onSuccess: () => void
// }

// export function AssignClassModal({
//     userId, schoolId, role, onClose, onSuccess
// }: AssignClassModalProps) {
//     const [classes,   setClasses]   = useState<{ id: string; name: string; grade: { displayName: string } }[]>([])
//     const [selected,  setSelected]  = useState('')
//     const [loading,   setLoading]   = useState(true)
//     const [assigning, setAssigning] = useState(false)

//     useEffect(() => {
//         getClassesBySchool(schoolId)
//             .then(data => { setClasses(data); setLoading(false) })
//             .catch(() => setLoading(false))
//     }, [schoolId])

//     async function handleAssign() {
//         if (!selected) return
//         setAssigning(true)

//         const result = role === 'teacher'
//             ? await assignTeacherToClass(userId, selected)
//             : await assignUserToClass(userId, selected)
//             // Note: gradeSubjectId is required for students —
//             // you may want to add a gradeSubject selector for production

//         if (result.success) {
//             onSuccess()
//         } else {
//             setAssigning(false)
//         }
//     }

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//             <div className="w-full max-w-sm bg-school-secondary-900 border border-school-secondary-700 rounded-2xl shadow-2xl">

//                 {/* Header */}
//                 <div className="flex items-center justify-between p-5 border-b border-school-secondary-700">
//                     <h3 className="font-bold text-white">Assign to Class</h3>
//                     <button onClick={onClose} className="text-school-secondary-400 hover:text-white transition-colors">
//                         <X className="h-4 w-4" />
//                     </button>
//                 </div>

//                 {/* Body */}
//                 <div className="p-5 space-y-4">
//                     {loading ? (
//                         <div className="flex items-center justify-center py-8">
//                             <Loader2 className="h-5 w-5 animate-spin text-school-primary" />
//                         </div>
//                     ) : classes.length === 0 ? (
//                         <p className="text-sm text-school-secondary-400 text-center py-4">
//                             No classes found. Create classes first.
//                         </p>
//                     ) : (
//                         <div className="space-y-2 max-h-64 overflow-y-auto">
//                             {classes.map(c => (
//                                 <button
//                                     key={c.id}
//                                     onClick={() => setSelected(c.id)}
//                                     className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all
//                                         ${selected === c.id
//                                             ? 'border-school-primary bg-school-primary/10'
//                                             : 'border-school-secondary-700 bg-school-secondary-800 hover:border-school-secondary-500'
//                                         }`}
//                                 >
//                                     <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg
//                                         ${selected === c.id ? 'bg-school-primary/20' : 'bg-school-secondary-700'}`}
//                                     >
//                                         {selected === c.id
//                                             ? <CheckCircle2 className="h-4 w-4 text-school-primary" />
//                                             : <BookOpen className="h-4 w-4 text-school-secondary-300" />
//                                         }
//                                     </div>
//                                     <div className="min-w-0">
//                                         <p className="text-sm font-semibold text-white truncate">{c.name}</p>
//                                         <p className="text-xs text-school-secondary-300">{c.grade.displayName}</p>
//                                     </div>
//                                 </button>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 {/* Footer */}
//                 <div className="flex gap-2 p-5 border-t border-school-secondary-700">
//                     <button
//                         onClick={onClose}
//                         className="flex-1 py-2.5 rounded-xl border border-school-secondary-700 text-school-secondary-300 hover:text-white text-sm font-semibold transition-all"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleAssign}
//                         disabled={!selected || assigning}
//                         className="flex-1 py-2.5 rounded-xl bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//                     >
//                         {assigning
//                             ? <><Loader2 className="h-4 w-4 animate-spin" /> Assigning...</>
//                             : 'Assign'
//                         }
//                     </button>
//                 </div>

//             </div>
//         </div>
//     )
// }

// // ── Confirm Modal ──────────────────────────────────────────────────────────────
// interface ConfirmModalProps {
//     title:        string
//     description:  string
//     confirmLabel: string
//     danger?:      boolean
//     loading:      boolean
//     onConfirm:    () => void
//     onCancel:     () => void
// }

// export function ConfirmModal({
//     title, description, confirmLabel,
//     danger, loading, onConfirm, onCancel
// }: ConfirmModalProps) {
//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//             <div className="w-full max-w-sm bg-school-secondary-900 border border-school-secondary-700 rounded-2xl shadow-2xl p-6 space-y-4">
//                 <h3 className="font-bold text-white text-lg">{title}</h3>
//                 <p className="text-sm text-school-secondary-300 leading-relaxed">{description}</p>
//                 <div className="flex gap-2 pt-2">
//                     <button
//                         onClick={onCancel}
//                         disabled={loading}
//                         className="flex-1 py-2.5 rounded-xl border border-school-secondary-700 text-school-secondary-300 hover:text-white text-sm font-semibold transition-all disabled:opacity-50"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={onConfirm}
//                         disabled={loading}
//                         className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2
//                             ${danger
//                                 ? 'bg-red-500 hover:bg-red-600 text-white'
//                                 : 'bg-school-primary hover:bg-school-primary-600 text-school-secondary-950'
//                             }`}
//                     >
//                         {loading
//                             ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
//                             : confirmLabel
//                         }
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }



'use client'

import React, { useState, useEffect } from 'react'
import {
    getClassesBySchool, 
    assignTeacherToClass,
    assignUserToClass
} from '@/app/actions/user-management'
import { X, Loader2, BookOpen, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// ── 1. SHARED SECTION HUB (Rule 11/18/19) ───────────────────────────────────

interface SectionProps {
    title:    string
    icon:     React.ReactNode
    children: React.ReactNode
}

export function Section({ title, icon, children }: SectionProps) {
    return (
        <Card className="bg-card border-border rounded-[2rem] overflow-hidden shadow-xl animate-in fade-in duration-500">
            <CardContent className="p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-4 border-b border-border pb-5">
                    {/* Rule 21: Scale Protocol Hub */}
                    <div className="h-10 w-10 rounded-xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center text-school-primary shadow-inner">
                        {icon}
                    </div>
                    <h2 className="text-base font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                        {title}
                    </h2>
                </div>
                <div className="relative">
                    {children}
                </div>
            </CardContent>
        </Card>
    )
}

// ── 2. SHARED EMPTY HUB STATE (Rule 11/18) ──────────────────────────────────

export function EmptySection({ message }: { message: string }) {
    return (
        <div className="py-6 px-4 bg-surface/50 border border-dashed border-border rounded-2xl text-center">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest italic">
                {message}
            </p>
        </div>
    )
}

// ── 3. SHARED REGISTRY SKELETON (Rule 20) ───────────────────────────────────

export function DetailSkeleton() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-8 lg:p-12 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                <Card className="bg-card border-border rounded-[2rem]">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 rounded-2xl bg-muted animate-pulse" />
                            <div className="space-y-3 flex-1">
                                <div className="h-8 w-1/3 rounded bg-muted animate-pulse" />
                                <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-64 rounded-[2rem] bg-card border border-border animate-pulse" />
                ))}
            </div>
        </div>
    )
}

// ── 4. INSTITUTIONAL PLACEMENT TERMINAL (Rule 18/19/21) ──────────────────────

interface AssignClassModalProps {
    userId:    string
    schoolId:  string
    role:      'TEACHER' | 'STUDENT' | 'PARENT'
    onClose:   () => void
    onSuccess: () => void
}

export function AssignClassModal({
    userId, schoolId, role, onClose, onSuccess
}: AssignClassModalProps) {
    const [classes,   setClasses]   = useState<{ id: string; name: string; grade: { displayName: string } }[]>([])
    const [selected,  setSelected]  = useState('')
    const [loading,   setLoading]   = useState(true)
    const [assigning, setAssigning] = useState(false)

    useEffect(() => {
        getClassesBySchool(schoolId)
            .then(data => { setClasses(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [schoolId])

    async function handleAssign() {
        if (!selected) return
        setAssigning(true)

        const result = role === 'TEACHER'
            ? await assignTeacherToClass(userId, selected)
            : await assignUserToClass(userId, selected)

        if (result.success) {
            onSuccess()
        } else {
            setAssigning(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-card border border-border rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in-95 duration-300">

                {/* ── HEADER ── */}
                <div className="flex items-center justify-between p-8 border-b border-border bg-surface/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-school-primary-50 border border-school-primary-200">
                            <ShieldCheck className="h-5 w-5 text-school-primary" />
                        </div>
                        <h3 className="font-extrabold text-foreground uppercase italic tracking-tighter">Hub Placement</h3>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-all p-1 active:scale-90">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* ── CLASSROOM LIST ── */}
                <div className="p-8 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Scanning Hubs...</p>
                        </div>
                    ) : classes.length === 0 ? (
                        <div className="py-10 text-center">
                            <p className="text-sm font-semibold text-muted-foreground italic uppercase">No classroom hubs discovered.</p>
                        </div>
                    ) : (
                        <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-2">
                            {classes.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setSelected(c.id)}
                                    className={cn(
                                        "w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all group",
                                        selected === c.id
                                            ? "border-school-primary bg-school-primary-50 shadow-inner"
                                            : "bg-surface border-border hover:border-school-primary-200"
                                    )}
                                >
                                    <div className={cn(
                                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all shadow-sm",
                                        selected === c.id ? 'bg-school-primary text-on-school-primary' : 'bg-card border border-border'
                                    )}>
                                        {selected === c.id
                                            ? <CheckCircle2 className="h-5 w-5 stroke-[3]" />
                                            : <BookOpen className="h-5 w-5 text-muted-foreground/40 group-hover:text-school-primary" />
                                        }
                                    </div>
                                    <div className="min-w-0 space-y-0.5">
                                        <p className="text-sm font-extrabold text-foreground uppercase italic truncate tracking-tight">{c.name}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{c.grade.displayName}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── FOOTER ACTIONS ── */}
                <div className="flex gap-4 p-8 border-t border-border bg-surface/30">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 rounded-xl border border-border text-muted-foreground hover:bg-background hover:text-foreground text-[10px] font-extrabold uppercase tracking-widest transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={!selected || assigning}
                        className="flex-1 py-4 rounded-xl bg-school-primary text-on-school-primary text-[10px] font-extrabold uppercase tracking-widest shadow-lg shadow-school-primary-200 hover:brightness-110 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                    >
                        {assigning ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Commit Sync'}
                    </button>
                </div>

            </div>
        </div>
    )
}

// ── 5. REGISTRY PROTOCOL CONFIRMATION (Rule 18/21) ──────────────────────────

interface ConfirmModalProps {
    title:        string
    description:  string
    confirmLabel: string
    danger?:      boolean
    loading:      boolean
    onConfirm:    () => void
    onCancel:     () => void
}

export function ConfirmModal({
    title, description, confirmLabel,
    danger, loading, onConfirm, onCancel
}: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-card border border-border rounded-[2.5rem] shadow-2xl p-8 space-y-8 animate-in zoom-in-95">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center border",
                        danger ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-amber-50 border-amber-200 text-amber-600"
                    )}>
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <h3 className="font-extrabold text-foreground text-xl uppercase italic tracking-tighter leading-none">{title}</h3>
                </div>
                
                <div className="space-y-3">
                    <p className="text-sm text-foreground/80 font-medium leading-relaxed italic">{description}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Protocol re-validation required.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 py-4 rounded-xl border border-border text-muted-foreground hover:bg-surface text-[10px] font-extrabold uppercase tracking-widest transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={cn(
                            "flex-1 py-4 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2",
                            danger 
                                ? "bg-destructive text-white shadow-destructive/20 shadow-lg" 
                                : "bg-school-primary text-on-school-primary shadow-school-primary-200 shadow-lg"
                        )}
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}