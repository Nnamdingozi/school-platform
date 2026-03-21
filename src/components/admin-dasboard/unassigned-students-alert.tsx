'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProfileStore } from '@/store/profileStore'
import {
    getUnassignedStudents,
    UnassignedStudent,
    UnassignedStudentsData,
} from '@/app/actions/analytics.action'

import {
    getClassesBySchool,
    assignUserToClass,
} from '@/app/actions/user-management'
import {
    AlertTriangle, ArrowRight,
    Loader2, BookOpen, CheckCircle2,
    X, ChevronRight, UserCheck,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'

// ── Types ──────────────────────────────────────────────────────────────────────
interface ClassOption {
    id:    string
    name:  string
    grade: { displayName: string }
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function UnassignedStudentsAlert() {
    const router      = useRouter()
    const { profile } = useProfileStore()
    const schoolId    = profile?.schoolId ?? ''

    const [data,       setData]       = useState<UnassignedStudentsData | null>(null)
    const [loading,    setLoading]    = useState(true)
    const [dismissed,  setDismissed]  = useState<Set<string>>(new Set())
    const [assigningId, setAssigningId] = useState<string | null>(null)

    // ── Fetch ──────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!schoolId) return
        setLoading(true)
        getUnassignedStudents(schoolId)
            .then(d => { setData(d); setLoading(false) })
            .catch(() => setLoading(false))
    }, [schoolId])

    function handleDismiss(studentId: string) {
        setDismissed(prev => new Set([...prev, studentId]))
    }

    const visibleStudents = (data?.students ?? [])
        .filter(s => !dismissed.has(s.id))
        .slice(0, 5)

    const dismissedCount = dismissed.size
    const remainingCount = (data?.total ?? 0) - dismissedCount

    const getInitials = (name: string | null, email: string) =>
        (name ?? email).split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

    // ── Loading ────────────────────────────────────────────────────────────
    if (loading) return (
        <Card>
            <CardContent className="flex items-center justify-center h-40">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-school-primary" />
                    <span className="text-xs text-muted-foreground">Loading...</span>
                </div>
            </CardContent>
        </Card>
    )

    // ── All assigned ───────────────────────────────────────────────────────
    if (!data || remainingCount === 0) return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-foreground">
                    Unassigned Students
                </CardTitle>
                <CardDescription>Class assignment status</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20">
                        <UserCheck className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                        All students are assigned
                    </p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                        Every student has been assigned to at least one class.
                    </p>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <Card>
            <CardHeader className="pb-3">

                {/* Title row */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-semibold text-foreground">
                                Unassigned Students
                            </CardTitle>
                            <CardDescription>
                                {remainingCount} student{remainingCount !== 1 ? 's' : ''} not yet in a class
                            </CardDescription>
                        </div>
                    </div>

                    {/* Progress pill */}
                    <div className="shrink-0 text-right">
                        <span className="text-xs font-semibold text-amber-500">
                            {remainingCount}/{data.totalStudents}
                        </span>
                        <p className="text-[10px] text-muted-foreground">unassigned</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-muted">
                        <div
                            className="h-1.5 rounded-full bg-amber-500 transition-all duration-500"
                            style={{
                                width: `${data.totalStudents > 0
                                    ? Math.round((remainingCount / data.totalStudents) * 100)
                                    : 0}%`
                            }}
                        />
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                        {data.totalStudents > 0
                            ? Math.round(((data.totalStudents - remainingCount) / data.totalStudents) * 100)
                            : 0
                        }% of students assigned to classes
                    </p>
                </div>

            </CardHeader>

            <CardContent className="space-y-2 pt-0">

                {/* Student rows */}
                {visibleStudents.map(student => (
                    <StudentRow
                        key={student.id}
                        student={student}
                        schoolId={schoolId}
                        assigningId={assigningId}
                        setAssigningId={setAssigningId}
                        onView={() => router.push(`/admin/students/${student.id}`)}
                        onAssigned={() => {
                            handleDismiss(student.id)
                            toast.success(`${student.name ?? student.email} assigned to class.`)
                        }}
                        onDismiss={() => handleDismiss(student.id)}
                        getInitials={getInitials}
                    />
                ))}

                {/* View all link */}
                {remainingCount > 5 && (
                    <button
                        onClick={() => router.push('/admin/students')}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-border hover:border-school-primary hover:bg-school-primary/5 text-xs font-semibold text-muted-foreground hover:text-school-primary transition-all"
                    >
                        View all {remainingCount} unassigned students
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                )}

            </CardContent>
        </Card>
    )
}

// ── Student Row ────────────────────────────────────────────────────────────────
interface StudentRowProps {
    student:        UnassignedStudent
    schoolId:       string
    assigningId:    string | null
    setAssigningId: (id: string | null) => void
    onView:         () => void
    onAssigned:     () => void
    onDismiss:      () => void
    getInitials:    (name: string | null, email: string) => string
}

function StudentRow({
    student, schoolId, assigningId, setAssigningId,
    onView, onAssigned, onDismiss, getInitials,
}: StudentRowProps) {
    const [showPicker, setShowPicker]   = useState(false)
    const [classes,    setClasses]      = useState<ClassOption[]>([])
    const [loadingCls, setLoadingCls]   = useState(false)
    const [savingCls,  setSavingCls]    = useState(false)
    const [selectedCls, setSelectedCls] = useState('')

    const isAssigning = assigningId === student.id

    async function handleOpenPicker() {
        if (showPicker) { setShowPicker(false); return }
        setLoadingCls(true)
        setAssigningId(student.id)
        const data = await getClassesBySchool(schoolId)
        setClasses(data)
        setLoadingCls(false)
        setShowPicker(true)
    }

    async function handleAssign() {
        if (!selectedCls) return
        setSavingCls(true)

        // Get gradeSubjectId from the class
        const cls = classes.find(c => c.id === selectedCls)
        if (!cls) { setSavingCls(false); return }

        // Use first available gradeSubject for this class
        const result = await assignUserToClass(student.id, selectedCls)
        if (result.success) {
            setShowPicker(false)
            setAssigningId(null)
            onAssigned()
        } else {
            toast.error(result.error ?? 'Failed to assign.')
        }
        setSavingCls(false)
    }

    function handleCancel() {
        setShowPicker(false)
        setAssigningId(null)
        setSelectedCls('')
    }

    return (
        <div className={`rounded-xl border transition-all ${
            showPicker
                ? 'border-school-primary/30 bg-school-primary/5'
                : 'border-border bg-muted/20 hover:bg-muted/40'
        }`}>

            {/* Main row */}
            <div className="flex items-center gap-3 p-3">

                {/* Avatar */}
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-amber-500/20 text-amber-600 text-[10px] font-bold">
                        {getInitials(student.name, student.email)}
                    </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                        {student.name ?? '—'}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                        {student.email}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">

                    {/* View profile */}
                    <button
                        onClick={onView}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-school-primary hover:bg-school-primary/10 transition-all"
                        title="View profile"
                    >
                        <ChevronRight className="h-3.5 w-3.5" />
                    </button>

                    {/* Assign to class */}
                    <button
                        onClick={handleOpenPicker}
                        disabled={!!assigningId && !isAssigning}
                        className={`flex h-7 items-center gap-1 px-2 rounded-lg text-[10px] font-semibold transition-all disabled:opacity-40 ${
                            showPicker
                                ? 'bg-school-primary text-school-secondary-950'
                                : 'bg-school-primary/10 text-school-primary hover:bg-school-primary/20'
                        }`}
                        title="Assign to class"
                    >
                        {loadingCls
                            ? <Loader2 className="h-3 w-3 animate-spin" />
                            : <BookOpen className="h-3 w-3" />
                        }
                        <span className="hidden sm:inline">
                            {showPicker ? 'Cancel' : 'Assign'}
                        </span>
                    </button>

                    {/* Dismiss */}
                    <button
                        onClick={onDismiss}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Dismiss"
                    >
                        <X className="h-3 w-3" />
                    </button>

                </div>
            </div>

            {/* Class picker */}
            {showPicker && (
                <div className="px-3 pb-3 space-y-2 border-t border-school-primary/20 pt-2">
                    <p className="text-[10px] font-semibold text-school-primary uppercase tracking-wider">
                        Select a class
                    </p>

                    {classes.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-2 text-center">
                            No classes found. Create classes first.
                        </p>
                    ) : (
                        <>
                            <div className="grid gap-1.5 max-h-36 overflow-y-auto">
                                {classes.map(cls => (
                                    <button
                                        key={cls.id}
                                        onClick={() => setSelectedCls(cls.id)}
                                        className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                                            selectedCls === cls.id
                                                ? 'border-school-primary bg-school-primary/10'
                                                : 'border-border hover:border-school-primary/40 hover:bg-muted/60'
                                        }`}
                                    >
                                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                                            selectedCls === cls.id
                                                ? 'bg-school-primary/20'
                                                : 'bg-muted'
                                        }`}>
                                            {selectedCls === cls.id
                                                ? <CheckCircle2 className="h-3.5 w-3.5 text-school-primary" />
                                                : <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                                            }
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-foreground truncate">
                                                {cls.name}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {cls.grade.displayName}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Confirm/Cancel */}
                            <div className="flex gap-2 pt-1">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAssign}
                                    disabled={!selectedCls || savingCls}
                                    className="flex-1 py-1.5 rounded-lg bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                                >
                                    {savingCls
                                        ? <><Loader2 className="h-3 w-3 animate-spin" /> Assigning...</>
                                        : <><CheckCircle2 className="h-3 w-3" /> Confirm</>
                                    }
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

        </div>
    )
}