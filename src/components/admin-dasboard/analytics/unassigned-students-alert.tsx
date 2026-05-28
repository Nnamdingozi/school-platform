'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, X, UserCheck, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import {
    type UnassignedStudentsData,
    type UnassignedStudent,
} from '@/app/actions/analytics.action'

export interface UnassignedStudentsAlertProps {
    initialData: UnassignedStudentsData | null
}

function getInitials(name: string | null, email: string): string {
    return (name ?? email)
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
}

/**
 * REGISTRY OUTLIERS ALERT (Tier 2)
 * Rule 12: Receives server-fetched data as props.
 * Rule 17: Branding via school-primary design tokens.
 */
export function UnassignedStudentsAlert({ initialData }: UnassignedStudentsAlertProps) {
    const router = useRouter()
    const [dismissed, setDismissed] = useState<Set<string>>(new Set())

    const visibleStudents = (initialData?.students ?? [])
        .filter((s) => !dismissed.has(s.id))
        .slice(0, 5)

    const remainingCount = (initialData?.total ?? 0) - dismissed.size
    const totalStudents = initialData?.totalStudents ?? 0
    const assignedPct =
        totalStudents > 0
            ? Math.round(((totalStudents - remainingCount) / totalStudents) * 100)
            : 0
    const unassignedPct =
        totalStudents > 0 ? Math.round((remainingCount / totalStudents) * 100) : 0

    function handleDismiss(studentId: string) {
        setDismissed((prev) => new Set([...prev, studentId]))
    }

    if (!initialData || remainingCount === 0) {
        return (
            <Card className="bg-card border-border rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-4 shadow-2xl">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/70 flex items-center justify-center border border-emerald-500/20 shadow-xl">
                    <UserCheck className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-black text-foreground uppercase italic tracking-tighter">
                    Placement Optimal
                </h3>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest italic max-w-sm">
                    All provisioned student identities have been synchronized with classroom
                    registries.
                </p>
            </Card>
        )
    }

    return (
        <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-8 bg-background/50 border-b border-border space-y-4">
                <div className="flex flex-row items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <CardTitle className="text-[10px] font-black uppercase italic tracking-widest text-foreground">
                                Registry Outliers
                            </CardTitle>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                                {remainingCount} student{remainingCount !== 1 ? 's' : ''} pending
                                institutional placement
                            </p>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                            {remainingCount}/{totalStudents}
                        </span>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            unassigned
                        </p>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                            className="h-full rounded-full bg-amber-500 transition-all duration-500"
                            style={{ width: `${unassignedPct}%` }}
                        />
                    </div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        {assignedPct}% of students assigned to classrooms
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => router.push('/admin/users?tab=unassigned')}
                    className="text-[10px] font-black text-school-primary uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    Manage Registry <ArrowRight className="h-3 w-3" />
                </button>
            </CardHeader>

            <CardContent className="p-8 space-y-4">
                {visibleStudents.map((student) => (
                    <StudentRow
                        key={student.id}
                        student={student}
                        onDismiss={() => handleDismiss(student.id)}
                    />
                ))}

                {remainingCount > 5 && (
                    <button
                        type="button"
                        onClick={() => router.push('/admin/users?tab=unassigned')}
                        className={cn(
                            'w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl',
                            'border border-dashed border-border',
                            'text-[10px] font-black uppercase tracking-widest text-muted-foreground',
                            'hover:border-school-primary/40 hover:bg-school-primary/5 hover:text-school-primary transition-all',
                        )}
                    >
                        View all {remainingCount} unassigned students
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                )}
            </CardContent>
        </Card>
    )
}

interface StudentRowProps {
    student: UnassignedStudent
    onDismiss: () => void
}

function StudentRow({ student, onDismiss }: StudentRowProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border hover:border-school-primary/20 transition-all group">
            <div className="flex items-center gap-4 min-w-0">
                <Avatar className="h-10 w-10 border border-border shrink-0">
                    <AvatarFallback className="bg-school-primary/10 font-black text-xs uppercase text-school-primary">
                        {getInitials(student.name, student.email)}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground uppercase italic tracking-tight truncate">
                        {student.name || 'Anonymous Learner'}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest truncate">
                        {student.email}
                    </p>
                </div>
            </div>
            <button
                type="button"
                onClick={onDismiss}
                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                title="Dismiss notification"
                aria-label={`Dismiss ${student.name ?? student.email}`}
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}
