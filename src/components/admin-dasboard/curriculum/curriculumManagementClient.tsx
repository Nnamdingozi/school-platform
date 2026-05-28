'use client'

import { CurriculumCard } from './curriculum-card'
import { BookMarked, Settings2, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { type CurriculumStats } from '@/app/actions/curiculum-stats'

interface GradeWithSubjects {
    id: string
    displayName: string
    gradeSubjects: { id: string }[]
}

interface CurriculumManagementClientProps {
    initialGrades: GradeWithSubjects[]
    initialStats: CurriculumStats | null
}

const MIN_SUBJECTS_FOR_SYNC = 8

/**
 * INSTITUTIONAL ARCHITECTURE CONSOLE (Tier 2)
 * Rule 12: Server-fetched grades and stats passed as props.
 * Rule 16: Dynamic curriculum labels from stats (yearLabel, subjectLabel).
 * Rule 17: Branding via school-primary design tokens.
 */
export function CurriculumManagementClient({
    initialGrades,
    initialStats,
}: CurriculumManagementClientProps) {
    const yearLabel = initialStats?.yearLabel ?? 'Level'
    const subjectLabel = initialStats?.subjectLabel ?? 'Subject'

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-12 bg-background min-h-screen text-foreground animate-in fade-in duration-700">
            <header className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-10">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl border border-school-primary/20 bg-school-primary/10 flex items-center justify-center shadow-2xl shadow-school-primary/10">
                        <BookMarked className="h-7 w-7 text-school-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
                            Registry Architect
                        </h1>
                        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-2 italic">
                            Institutional Master Syllabus Oversight
                        </p>
                    </div>
                </div>

                <Button
                    asChild
                    variant="outline"
                    className="border-border text-muted-foreground hover:bg-school-primary/5 hover:text-foreground uppercase text-[10px] font-black tracking-widest px-6 h-12 rounded-xl"
                >
                    <Link href="/admin/settings?tab=curriculum">
                        <Settings2 className="w-4 h-4 mr-2 text-school-primary" />
                        Terminology Settings
                    </Link>
                </Button>
            </header>

            <main className="max-w-5xl mx-auto space-y-10">
                <section className="space-y-4">
                    <SectionHeading index="01" title="System Vitality" />
                    <CurriculumCard initialStats={initialStats} />
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <SectionHeading
                            index="02"
                            title={`${yearLabel} Matrix Health`}
                        />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">
                            {initialGrades.length} Nodes Discovered
                        </span>
                    </div>

                    <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-muted-foreground text-[10px] uppercase tracking-widest bg-background/50 border-b border-border font-black">
                                            <th className="px-10 py-6 italic">{yearLabel} Registry</th>
                                            <th className="px-10 py-6 italic">
                                                Active {subjectLabel}s
                                            </th>
                                            <th className="px-10 py-6 italic">Registry Status</th>
                                            <th className="px-10 py-6 text-right italic">Audit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {initialGrades.map((grade) => {
                                            const subjectCount = grade.gradeSubjects?.length ?? 0
                                            const isSynchronized =
                                                subjectCount >= MIN_SUBJECTS_FOR_SYNC

                                            return (
                                                <tr
                                                    key={grade.id}
                                                    className="hover:bg-school-primary/5 transition-all group"
                                                >
                                                    <td className="px-10 py-8 font-black text-foreground uppercase italic text-lg">
                                                        {grade.displayName}
                                                    </td>
                                                    <td className="px-10 py-8">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 min-w-12 px-2 bg-background rounded-lg border border-border flex items-center justify-center text-xs font-mono font-bold text-school-primary shadow-inner">
                                                                {subjectCount}
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest italic">
                                                                {subjectLabel}s
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-8">
                                                        {isSynchronized ? (
                                                            <StatusBadge
                                                                variant="success"
                                                                label="Synchronized"
                                                            />
                                                        ) : (
                                                            <StatusBadge
                                                                variant="warning"
                                                                label="Under-Provisioned"
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="px-10 py-8 text-right">
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            className="h-12 px-6 rounded-2xl bg-background border border-border group-hover:bg-school-primary group-hover:text-on-school-primary transition-all shadow-lg text-[10px] font-black uppercase tracking-widest"
                                                        >
                                                            <Link
                                                                href={`/admin/curriculum/allocation?gradeId=${grade.id}`}
                                                            >
                                                                Manage
                                                                <ChevronRight className="h-4 w-4 ml-2" />
                                                            </Link>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    )
}

interface SectionHeadingProps {
    index: string
    title: string
}

function SectionHeading({ index, title }: SectionHeadingProps) {
    return (
        <div className="flex items-center gap-3 px-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-school-primary">
                {index}
            </span>
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                {title}
            </h3>
        </div>
    )
}

interface StatusBadgeProps {
    variant: 'success' | 'warning'
    label: string
}

function StatusBadge({ variant, label }: StatusBadgeProps) {
    const isSuccess = variant === 'success'
    return (
        <div
            className={
                isSuccess
                    ? 'flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest'
                    : 'flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest'
            }
        >
            {isSuccess ? (
                <CheckCircle2 className="h-4 w-4" />
            ) : (
                <AlertCircle className="h-3 w-3" />
            )}
            {label}
        </div>
    )
}




