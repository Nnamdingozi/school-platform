'use client'

import { useState, useEffect } from 'react'
import {
    getClassesBySchool, assignTeacherToClass,
    assignUserToClass
} from '@/app/actions/user-management'
import { X, Loader2, BookOpen, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

// ── Section wrapper ────────────────────────────────────────────────────────────
interface SectionProps {
    title:    string
    icon:     React.ReactNode
    children: React.ReactNode
}

export function Section({ title, icon, children }: SectionProps) {
    return (
        <Card className="bg-school-secondary-900 border-school-secondary-700">
            <CardContent className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-school-secondary-700 pb-3">
                    {icon}
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                        {title}
                    </h2>
                </div>
                {children}
            </CardContent>
        </Card>
    )
}

// ── Empty section ──────────────────────────────────────────────────────────────
export function EmptySection({ message }: { message: string }) {
    return (
        <p className="text-sm text-school-secondary-400 py-2">{message}</p>
    )
}

// ── Detail skeleton ────────────────────────────────────────────────────────────
export function DetailSkeleton() {
    return (
        <div className="min-h-screen bg-school-secondary-950 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="h-4 w-24 rounded bg-school-secondary-700 animate-pulse" />
                <Card className="bg-school-secondary-900 border-school-secondary-700">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-school-secondary-700 animate-pulse" />
                            <div className="space-y-2 flex-1">
                                <div className="h-5 w-40 rounded bg-school-secondary-700 animate-pulse" />
                                <div className="h-3 w-56 rounded bg-school-secondary-700 animate-pulse" />
                                <div className="h-3 w-32 rounded bg-school-secondary-700 animate-pulse" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="bg-school-secondary-900 border-school-secondary-700">
                        <CardContent className="p-5 sm:p-6 space-y-3">
                            <div className="h-4 w-32 rounded bg-school-secondary-700 animate-pulse" />
                            <div className="h-16 rounded-lg bg-school-secondary-700 animate-pulse" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

// ── Assign Class Modal ─────────────────────────────────────────────────────────
interface AssignClassModalProps {
    userId:    string
    schoolId:  string
    role:      'teacher' | 'student' | 'parent'
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

        const result = role === 'teacher'
            ? await assignTeacherToClass(userId, selected)
            : await assignUserToClass(userId, selected)
            // Note: gradeSubjectId is required for students —
            // you may want to add a gradeSubject selector for production

        if (result.success) {
            onSuccess()
        } else {
            setAssigning(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-school-secondary-900 border border-school-secondary-700 rounded-2xl shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-school-secondary-700">
                    <h3 className="font-bold text-white">Assign to Class</h3>
                    <button onClick={onClose} className="text-school-secondary-400 hover:text-white transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-school-primary" />
                        </div>
                    ) : classes.length === 0 ? (
                        <p className="text-sm text-school-secondary-400 text-center py-4">
                            No classes found. Create classes first.
                        </p>
                    ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {classes.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setSelected(c.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all
                                        ${selected === c.id
                                            ? 'border-school-primary bg-school-primary/10'
                                            : 'border-school-secondary-700 bg-school-secondary-800 hover:border-school-secondary-500'
                                        }`}
                                >
                                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg
                                        ${selected === c.id ? 'bg-school-primary/20' : 'bg-school-secondary-700'}`}
                                    >
                                        {selected === c.id
                                            ? <CheckCircle2 className="h-4 w-4 text-school-primary" />
                                            : <BookOpen className="h-4 w-4 text-school-secondary-300" />
                                        }
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                                        <p className="text-xs text-school-secondary-300">{c.grade.displayName}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-2 p-5 border-t border-school-secondary-700">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-school-secondary-700 text-school-secondary-300 hover:text-white text-sm font-semibold transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={!selected || assigning}
                        className="flex-1 py-2.5 rounded-xl bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {assigning
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Assigning...</>
                            : 'Assign'
                        }
                    </button>
                </div>

            </div>
        </div>
    )
}

// ── Confirm Modal ──────────────────────────────────────────────────────────────
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-school-secondary-900 border border-school-secondary-700 rounded-2xl shadow-2xl p-6 space-y-4">
                <h3 className="font-bold text-white text-lg">{title}</h3>
                <p className="text-sm text-school-secondary-300 leading-relaxed">{description}</p>
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl border border-school-secondary-700 text-school-secondary-300 hover:text-white text-sm font-semibold transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2
                            ${danger
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-school-primary hover:bg-school-primary-600 text-school-secondary-950'
                            }`}
                    >
                        {loading
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                            : confirmLabel
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}