// 'use client'

// import { useState, useTransition, useEffect } from 'react'
// import { format } from 'date-fns'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import {
//     Calendar as CalendarIcon, RefreshCcw,
//     Loader2, Info, CheckCircle2, AlertCircle,
// } from 'lucide-react'
// import { Calendar } from '@/components/ui/calendar'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { updateGlobalTermDates, SchoolSettingsData } from '@/app/actions/school-settings.action'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// interface TermsSectionProps {
//     data:     SchoolSettingsData
//     schoolId: string
//     onUpdate: (updated: Partial<SchoolSettingsData>) => void
// }

// // ── Date Picker ────────────────────────────────────────────────────────────────
// function DatePicker({
//     date, setDate, placeholder = 'Pick date', disabled,
// }: {
//     date:         Date | undefined
//     setDate:      (d: Date | undefined) => void
//     placeholder?: string
//     disabled?:    boolean
// }) {
//     return (
//         <Popover>
//             <PopoverTrigger asChild>
//                 <button
//                     disabled={disabled}
//                     className={cn(
//                         'flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-all',
//                         'bg-school-secondary-800',
//                         date
//                             ? 'border-school-primary/40 text-white hover:border-school-primary'
//                             : 'border-school-secondary-500 text-school-secondary-400 hover:border-school-secondary-300',
//                         disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
//                     )}
//                 >
//                     <CalendarIcon className={cn(
//                         'h-3.5 w-3.5 shrink-0',
//                         date ? 'text-school-primary' : 'text-school-secondary-500'
//                     )} />
//                     <span className="truncate font-medium">
//                         {date ? format(date, 'dd MMM yyyy') : placeholder}
//                     </span>
//                 </button>
//             </PopoverTrigger>
//             <PopoverContent
//                 align="start"
//                 className="w-auto p-0 bg-school-secondary-900 border-school-secondary-700 shadow-2xl rounded-2xl overflow-hidden"
//             >
//                 <Calendar
//                     mode="single"
//                     selected={date}
//                     onSelect={setDate}
//                     initialFocus
//                     className="bg-school-secondary-900 text-white"
//                 />
//             </PopoverContent>
//         </Popover>
//     )
// }

// // ── Term status badge ──────────────────────────────────────────────────────────
// function TermStatusBadge({ synced }: { synced: boolean }) {
//     if (synced) return (
//         <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-400">
//             <CheckCircle2 className="h-2.5 w-2.5" />
//             Configured
//         </span>
//     )
//     return (
//         <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
//             <AlertCircle className="h-2.5 w-2.5" />
//             Not set
//         </span>
//     )
// }

// // ── Build dates keyed by term index ───────────────────────────────────────────
// // Since all grades share the same term dates after a global sync,
// // we only need one representative date per index (take the first match)
// function buildDatesFromData(data: SchoolSettingsData): Record<number, { start: Date | undefined; end: Date | undefined }> {
//     const result: Record<number, { start: Date | undefined; end: Date | undefined }> = {
//         1: { start: undefined, end: undefined },
//         2: { start: undefined, end: undefined },
//         3: { start: undefined, end: undefined },
//     }

//     for (const term of data.terms) {
//         const idx = term.index
//         if (idx >= 1 && idx <= 3) {
//             // Only overwrite if not already set (first term with this index wins)
//             if (!result[idx].start && term.startDate) {
//                 result[idx].start = new Date(term.startDate)
//             }
//             if (!result[idx].end && term.endDate) {
//                 result[idx].end = new Date(term.endDate)
//             }
//         }
//     }

//     return result
// }

// // ── Main Component ─────────────────────────────────────────────────────────────
// export function TermsSection({ data, schoolId, onUpdate }: TermsSectionProps) {
//     const [isPending, startTransition] = useTransition()
//     const [syncingId, setSyncingId]    = useState<number | null>(null)

//     const termLabel = data.curriculum?.termLabel ?? 'Term'

//     // ✅ Dates keyed by index (1/2/3) — not by termId
//     const [globalDates, setGlobalDates] = useState(() => buildDatesFromData(data))

//     // ✅ Re-sync when data prop updates (e.g. after parent refetches)
//     useEffect(() => {
//         setGlobalDates(buildDatesFromData(data))
//     }, [data])

//     function updateDate(index: 1 | 2 | 3, field: 'start' | 'end', value: Date | undefined) {
//         setGlobalDates(prev => ({
//             ...prev,
//             [index]: { ...prev[index], [field]: value },
//         }))
//     }

//     function handleSync(index: 1 | 2 | 3) {
//         const dates = globalDates[index]
//         if (!dates.start || !dates.end) {
//             toast.error('Select both start and end dates.')
//             return
//         }
//         if (dates.start >= dates.end) {
//             toast.error('Start date must be before end date.')
//             return
//         }

//         setSyncingId(index)
//         startTransition(async () => {
//             const res = await updateGlobalTermDates(
//                 schoolId, index, dates.start!, dates.end!
//             )
//             if (res.success) {
//                 toast.success(`${termLabel} ${index} synced to all grades.`)

//                 // ✅ Update local state with confirmed dates
//                 setGlobalDates(prev => ({
//                     ...prev,
//                     [index]: { start: dates.start, end: dates.end },
//                 }))

//                 // ✅ Propagate to parent — update ALL terms with this index
//                 onUpdate({
//                     terms: data.terms.map(t =>
//                         t.index === index
//                             ? { ...t, startDate: dates.start!, endDate: dates.end! }
//                             : t
//                     ),
//                 })
//             } else {
//                 toast.error(res.error ?? 'Sync failed.')
//             }
//             setSyncingId(null)
//         })
//     }

//     const configuredCount = [1, 2, 3].filter(
//         i => globalDates[i]?.start && globalDates[i]?.end
//     ).length

//     const TERMS = [
//         { index: 1 as const, label: `1st ${termLabel}` },
//         { index: 2 as const, label: `2nd ${termLabel}` },
//         { index: 3 as const, label: `3rd ${termLabel}` },
//     ]

//     return (
//         <div className="space-y-4">

//             {/* ── Info banner ── */}
//             <div className="flex items-start gap-3 rounded-xl border border-school-primary/15 bg-school-primary/5 px-4 py-3">
//                 <Info className="h-4 w-4 text-school-primary shrink-0 mt-0.5" />
//                 <div className="space-y-0.5">
//                     <p className="text-xs font-semibold text-white">
//                         Global {termLabel} Dates
//                     </p>
//                     <p className="text-[11px] text-school-secondary-400 leading-relaxed">
//                         Dates set here apply to <span className="text-white font-semibold">all {data.terms.length > 3 ? `${data.terms.length / 3} grades` : 'grades'}</span> simultaneously.
//                         Select dates then click <span className="text-white font-semibold">Sync</span> to save.
//                     </p>
//                 </div>
//                 <div className="ml-auto shrink-0 text-right">
//                     <p className="text-xs font-black text-school-primary">
//                         {configuredCount}/3
//                     </p>
//                     <p className="text-[10px] text-school-secondary-500">
//                         configured
//                     </p>
//                 </div>
//             </div>

//             {/* ── Term cards ── */}
//             <div className="space-y-2">
//                 {TERMS.map(term => {
//                     const current   = globalDates[term.index]
//                     const isSynced  = !!(current?.start && current?.end)
//                     const isSyncing = syncingId === term.index && isPending
//                     const canSync   = !!(current?.start && current?.end)
//                     const hasError  = !!(current?.start && current?.end && current.start >= current.end)

//                     return (
//                         <Card
//                             key={term.index}
//                             className={cn(
//                                 'border transition-all duration-200',
//                                 isSynced
//                                     ? 'bg-school-secondary-900 border-school-secondary-700'
//                                     : 'bg-school-secondary-900 border-amber-500/20'
//                             )}
//                         >
//                             <CardContent className="p-4">

//                                 {/* Header */}
//                                 <div className="flex items-center justify-between gap-3 mb-4">
//                                     <div className="flex items-center gap-2.5">
//                                         <div className={cn(
//                                             'h-7 w-7 shrink-0 rounded-lg flex items-center justify-center text-[10px] font-black',
//                                             isSynced
//                                                 ? 'bg-school-primary/20 text-school-primary border border-school-primary/30'
//                                                 : 'bg-school-secondary-800 text-school-secondary-400 border border-school-secondary-600'
//                                         )}>
//                                             {term.index}
//                                         </div>
//                                         <div>
//                                             <p className="text-xs font-bold text-white">
//                                                 {term.label}
//                                             </p>
//                                             {isSynced ? (
//                                                 <p className="text-[10px] text-school-secondary-400 mt-0.5">
//                                                     {format(current.start!, 'dd MMM yyyy')}
//                                                     {' → '}
//                                                     {format(current.end!, 'dd MMM yyyy')}
//                                                 </p>
//                                             ) : (
//                                                 <p className="text-[10px] text-amber-400/70 mt-0.5">
//                                                     Select dates below and click Sync
//                                                 </p>
//                                             )}
//                                         </div>
//                                     </div>
//                                     <TermStatusBadge synced={isSynced} />
//                                 </div>

//                                 {/* Date pickers + sync */}
//                                 <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
//                                     <div className="space-y-1.5">
//                                         <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                                             Start Date
//                                         </p>
//                                         <DatePicker
//                                             date={current?.start}
//                                             setDate={d => updateDate(term.index, 'start', d)}
//                                             placeholder="Select start date"
//                                             disabled={isSyncing}
//                                         />
//                                     </div>

//                                     <div className="space-y-1.5">
//                                         <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                                             End Date
//                                         </p>
//                                         <DatePicker
//                                             date={current?.end}
//                                             setDate={d => updateDate(term.index, 'end', d)}
//                                             placeholder="Select end date"
//                                             disabled={isSyncing}
//                                         />
//                                     </div>

//                                     <Button
//                                         size="sm"
//                                         disabled={!canSync || isSyncing || hasError}
//                                         onClick={() => handleSync(term.index)}
//                                         className={cn(
//                                             'h-[34px] w-full sm:w-auto px-4 text-[11px] font-bold rounded-xl transition-all',
//                                             canSync && !hasError
//                                                 ? 'bg-school-primary hover:bg-school-primary-600 text-school-secondary-950'
//                                                 : 'bg-school-secondary-800 text-school-secondary-500 border border-school-secondary-600 cursor-not-allowed'
//                                         )}
//                                     >
//                                         {isSyncing ? (
//                                             <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                                         ) : (
//                                             <><RefreshCcw className="h-3 w-3 mr-1.5" />Sync</>
//                                         )}
//                                     </Button>
//                                 </div>

//                                 {/* Validation */}
//                                 {hasError && (
//                                     <p className="mt-2 flex items-center gap-1 text-[11px] text-red-400">
//                                         <AlertCircle className="h-3 w-3 shrink-0" />
//                                         Start date must be before end date
//                                     </p>
//                                 )}

//                             </CardContent>
//                         </Card>
//                     )
//                 })}
//             </div>

//             {/* All configured */}
//             {configuredCount === 3 && (
//                 <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
//                     <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
//                     <p className="text-xs font-semibold text-green-400">
//                         All {termLabel.toLowerCase()}s are configured and synced to all grades.
//                     </p>
//                 </div>
//             )}

//         </div>
//     )
// }



'use client'

import { useState, useTransition, useEffect } from 'react'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Calendar as CalendarIcon, RefreshCcw,
    Loader2, Info, CheckCircle2, AlertCircle,
} from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { updateGlobalTermDates, SchoolSettingsData } from '@/app/actions/school-settings.action'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface TermsSectionProps {
    data:     SchoolSettingsData
    schoolId: string
    onUpdate: (updated: Partial<SchoolSettingsData>) => void
}

// ── Date Picker ────────────────────────────────────────────────────────────────
function DatePicker({
    date, setDate, placeholder = 'Pick date', disabled,
}: {
    date:         Date | undefined
    setDate:      (d: Date | undefined) => void
    placeholder?: string
    disabled?:    boolean
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    disabled={disabled}
                    className={cn(
                        'flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-all',
                        'bg-school-secondary-800',
                        date
                            ? 'border-school-primary/40 text-white hover:border-school-primary'
                            : 'border-school-secondary-500 text-school-secondary-400 hover:border-school-secondary-300',
                        disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                    )}
                >
                    <CalendarIcon className={cn(
                        'h-3.5 w-3.5 shrink-0',
                        date ? 'text-school-primary' : 'text-school-secondary-500'
                    )} />
                    <span className="truncate font-medium">
                        {date ? format(date, 'dd MMM yyyy') : placeholder}
                    </span>
                </button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-auto p-0 bg-school-secondary-900 border-school-secondary-700 shadow-2xl rounded-2xl overflow-hidden"
            >
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="bg-school-secondary-900 text-white"
                />
            </PopoverContent>
        </Popover>
    )
}

// ── Term status badge ──────────────────────────────────────────────────────────
function TermStatusBadge({ synced }: { synced: boolean }) {
    if (synced) return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-400">
            <CheckCircle2 className="h-2.5 w-2.5" />
            Configured
        </span>
    )
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
            <AlertCircle className="h-2.5 w-2.5" />
            Not set
        </span>
    )
}

// ── Build dates keyed by term index ───────────────────────────────────────────
function buildDatesFromData(
    data: SchoolSettingsData
): Record<number, { start: Date | undefined; end: Date | undefined }> {
    const result: Record<number, { start: Date | undefined; end: Date | undefined }> = {
        1: { start: undefined, end: undefined },
        2: { start: undefined, end: undefined },
        3: { start: undefined, end: undefined },
    }

    for (const term of data.terms) {
        const idx = term.index
        if (idx >= 1 && idx <= 3) {
            // First term with this index that has dates wins
            if (!result[idx].start && term.startDate) {
                result[idx].start = new Date(term.startDate)
            }
            if (!result[idx].end && term.endDate) {
                result[idx].end = new Date(term.endDate)
            }
        }
    }

    return result
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function TermsSection({ data, schoolId, onUpdate }: TermsSectionProps) {
    const [isPending, startTransition] = useTransition()
    const [syncingId, setSyncingId]    = useState<number | null>(null)

    const termLabel = data.curriculum?.termLabel ?? 'Term'

    // ✅ Count distinct grades from terms — no division, no decimals
    const gradeCount = new Set(data.terms.map(t => t.gradeId)).size

    // Dates keyed by index 1/2/3
    const [globalDates, setGlobalDates] = useState(() => buildDatesFromData(data))

    // Re-sync when data prop updates
    useEffect(() => {
        setGlobalDates(buildDatesFromData(data))
    }, [data])

    function updateDate(
        index: 1 | 2 | 3,
        field: 'start' | 'end',
        value: Date | undefined
    ) {
        setGlobalDates(prev => ({
            ...prev,
            [index]: { ...prev[index], [field]: value },
        }))
    }

    function handleSync(index: 1 | 2 | 3) {
        const dates = globalDates[index]
        if (!dates?.start || !dates?.end) {
            toast.error('Select both start and end dates.')
            return
        }
        if (dates.start >= dates.end) {
            toast.error('Start date must be before end date.')
            return
        }

        setSyncingId(index)
        startTransition(async () => {
            const res = await updateGlobalTermDates(
                schoolId, index, dates.start!, dates.end!
            )
            if (res.success) {
                toast.success(`${termLabel} ${index} synced to all grades.`)

                // Update local state with confirmed dates
                setGlobalDates(prev => ({
                    ...prev,
                    [index]: { start: dates.start, end: dates.end },
                }))

                // Propagate to parent — update all terms with this index
                onUpdate({
                    terms: data.terms.map(t =>
                        t.index === index
                            ? { ...t, startDate: dates.start!, endDate: dates.end! }
                            : t
                    ),
                })
            } else {
                toast.error(res.error ?? 'Sync failed.')
            }
            setSyncingId(null)
        })
    }

    const configuredCount = [1, 2, 3].filter(
        i => globalDates[i]?.start && globalDates[i]?.end
    ).length

    const TERMS = [
        { index: 1 as const, label: `1st ${termLabel}` },
        { index: 2 as const, label: `2nd ${termLabel}` },
        { index: 3 as const, label: `3rd ${termLabel}` },
    ]

    return (
        <div className="space-y-4">

            {/* ── Info banner ── */}
            <div className="flex items-start gap-3 rounded-xl border border-school-primary/15 bg-school-primary/5 px-4 py-3">
                <Info className="h-4 w-4 text-school-primary shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-white">
                        Global {termLabel} Dates
                    </p>
                    <p className="text-[11px] text-school-secondary-400 leading-relaxed">
                        Dates set here apply to{' '}
                        <span className="text-white font-semibold">
                            all {gradeCount} grade{gradeCount !== 1 ? 's' : ''}
                        </span>{' '}
                        simultaneously. Select dates then click{' '}
                        <span className="text-white font-semibold">Sync</span> to save.
                    </p>
                </div>
                <div className="ml-auto shrink-0 text-right">
                    <p className="text-xs font-black text-school-primary">
                        {configuredCount}/3
                    </p>
                    <p className="text-[10px] text-school-secondary-500">
                        configured
                    </p>
                </div>
            </div>

            {/* ── Term cards ── */}
            <div className="space-y-2">
                {TERMS.map(term => {
                    const current   = globalDates[term.index]
                    const isSynced  = !!(current?.start && current?.end)
                    const isSyncing = syncingId === term.index && isPending
                    const canSync   = !!(current?.start && current?.end)
                    const hasError  = !!(current?.start && current?.end && current.start >= current.end)

                    return (
                        <Card
                            key={term.index}
                            className={cn(
                                'border transition-all duration-200',
                                isSynced
                                    ? 'bg-school-secondary-900 border-school-secondary-700'
                                    : 'bg-school-secondary-900 border-amber-500/20'
                            )}
                        >
                            <CardContent className="p-4">

                                {/* ── Card header ── */}
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className={cn(
                                            'h-7 w-7 shrink-0 rounded-lg flex items-center justify-center text-[10px] font-black',
                                            isSynced
                                                ? 'bg-school-primary/20 text-school-primary border border-school-primary/30'
                                                : 'bg-school-secondary-800 text-school-secondary-400 border border-school-secondary-600'
                                        )}>
                                            {term.index}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white">
                                                {term.label}
                                            </p>
                                            {isSynced ? (
                                                <p className="text-[10px] text-school-secondary-400 mt-0.5">
                                                    {format(current.start!, 'dd MMM yyyy')}
                                                    {' → '}
                                                    {format(current.end!, 'dd MMM yyyy')}
                                                </p>
                                            ) : (
                                                <p className="text-[10px] text-amber-400/70 mt-0.5">
                                                    Select dates below and click Sync
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <TermStatusBadge synced={isSynced} />
                                </div>

                                {/* ── Date pickers + sync button ── */}
                                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">

                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
                                            Start Date
                                        </p>
                                        <DatePicker
                                            date={current?.start}
                                            setDate={d => updateDate(term.index, 'start', d)}
                                            placeholder="Select start date"
                                            disabled={isSyncing}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
                                            End Date
                                        </p>
                                        <DatePicker
                                            date={current?.end}
                                            setDate={d => updateDate(term.index, 'end', d)}
                                            placeholder="Select end date"
                                            disabled={isSyncing}
                                        />
                                    </div>

                                    <Button
                                        size="sm"
                                        disabled={!canSync || isSyncing || hasError}
                                        onClick={() => handleSync(term.index)}
                                        className={cn(
                                            'h-[34px] w-full sm:w-auto px-4 text-[11px] font-bold rounded-xl transition-all',
                                            canSync && !hasError
                                                ? 'bg-school-primary hover:bg-school-primary-600 text-school-secondary-950'
                                                : 'bg-school-secondary-800 text-school-secondary-500 border border-school-secondary-600 cursor-not-allowed'
                                        )}
                                    >
                                        {isSyncing ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <><RefreshCcw className="h-3 w-3 mr-1.5" />Sync</>
                                        )}
                                    </Button>

                                </div>

                                {/* ── Validation error ── */}
                                {hasError && (
                                    <p className="mt-2 flex items-center gap-1 text-[11px] text-red-400">
                                        <AlertCircle className="h-3 w-3 shrink-0" />
                                        Start date must be before end date
                                    </p>
                                )}

                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* ── All configured footer ── */}
            {configuredCount === 3 && (
                <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                    <p className="text-xs font-semibold text-green-400">
                        All {termLabel.toLowerCase()}s are configured and synced to all {gradeCount} grade{gradeCount !== 1 ? 's' : ''}.
                    </p>
                </div>
            )}

        </div>
    )
}