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
// function buildDatesFromData(
//     data: SchoolSettingsData
// ): Record<number, { start: Date | undefined; end: Date | undefined }> {
//     const result: Record<number, { start: Date | undefined; end: Date | undefined }> = {
//         1: { start: undefined, end: undefined },
//         2: { start: undefined, end: undefined },
//         3: { start: undefined, end: undefined },
//     }

//     for (const term of data.terms) {
//         const idx = term.index
//         if (idx >= 1 && idx <= 3) {
//             // First term with this index that has dates wins
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

//     // ✅ Count distinct grades from terms — no division, no decimals
//     const gradeCount = new Set(data.terms.map(t => t.gradeId)).size

//     // Dates keyed by index 1/2/3
//     const [globalDates, setGlobalDates] = useState(() => buildDatesFromData(data))

//     // Re-sync when data prop updates
//     useEffect(() => {
//         setGlobalDates(buildDatesFromData(data))
//     }, [data])

//     function updateDate(
//         index: 1 | 2 | 3,
//         field: 'start' | 'end',
//         value: Date | undefined
//     ) {
//         setGlobalDates(prev => ({
//             ...prev,
//             [index]: { ...prev[index], [field]: value },
//         }))
//     }

//     function handleSync(index: 1 | 2 | 3) {
//         const dates = globalDates[index]
//         if (!dates?.start || !dates?.end) {
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

//                 // Update local state with confirmed dates
//                 setGlobalDates(prev => ({
//                     ...prev,
//                     [index]: { start: dates.start, end: dates.end },
//                 }))

//                 // Propagate to parent — update all terms with this index
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
//                         Dates set here apply to{' '}
//                         <span className="text-white font-semibold">
//                             all {gradeCount} grade{gradeCount !== 1 ? 's' : ''}
//                         </span>{' '}
//                         simultaneously. Select dates then click{' '}
//                         <span className="text-white font-semibold">Sync</span> to save.
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

//                                 {/* ── Card header ── */}
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

//                                 {/* ── Date pickers + sync button ── */}
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

//                                 {/* ── Validation error ── */}
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

//             {/* ── All configured footer ── */}
//             {configuredCount === 3 && (
//                 <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
//                     <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
//                     <p className="text-xs font-semibold text-green-400">
//                         All {termLabel.toLowerCase()}s are configured and synced to all {gradeCount} grade{gradeCount !== 1 ? 's' : ''}.
//                     </p>
//                 </div>
//             )}

//         </div>
//     )
// }


// 'use client'

// import { useState, useTransition, useMemo } from 'react'
// import { format } from 'date-fns'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import {
//     Calendar as CalendarIcon, RefreshCcw,
//     Loader2, Info, CheckCircle2, AlertCircle, ArrowRight
// } from 'lucide-react'
// import { Calendar } from '@/components/ui/calendar'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { syncInstitutionalTermDates } from '@/app/actions/term.action'
// import { type SchoolSettingsData } from '@/app/actions/school-settings.action'
// import { useProfileStore } from '@/store/profileStore'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// interface TermsSectionProps {
//     data: SchoolSettingsData
//     onUpdate: (updated: Partial<SchoolSettingsData>) => void
// }

// /**
//  * INSTITUTIONAL CALENDAR MANAGEMENT (Tier 2)
//  * Rule 4: Only modifies institutional copies of terms.
//  * Rule 17: Uses Zustand for branding.
//  */
// export function TermsSection({ data, onUpdate }: TermsSectionProps) {
//     const { profile } = useProfileStore();
//     const [isPending, startTransition] = useTransition();
//     const [syncingId, setSyncingId] = useState<number | null>(null);
    
//     const primaryColor = profile?.primaryColor || "#f59e0b";
//     const termLabel = data.curriculum?.termLabel ?? 'Term';

//     // Group dates by index (1, 2, 3) from the initial data
//     const [localDates, setLocalDates] = useState(() => {
//         const map: Record<number, { start?: Date, end?: Date }> = { 1: {}, 2: {}, 3: {} };
//         data.terms.forEach(t => {
//             if (!map[t.index].start && t.startDate) map[t.index].start = new Date(t.startDate);
//             if (!map[t.index].end && t.endDate) map[t.index].end = new Date(t.endDate);
//         });
//         return map;
//     });

//     const handleSync = (index: number) => {
//         const dates = localDates[index];
//         if (!dates.start || !dates.end) return toast.error("Select start and end dates.");
//         if (dates.start >= dates.end) return toast.error("Timeline error: Start must precede End.");

//         setSyncingId(index);
//         startTransition(async () => {
//             const res = await syncInstitutionalTermDates(profile?.schoolId!, index, dates.start!, dates.end!);
//             if (res.success) {
//                 toast.success(`Institutional ${termLabel} ${index} synchronized.`);
//                 // Rule 11: Propagate system truth to parent component
//                 onUpdate({
//                     terms: data.terms.map(t => t.index === index ? { ...t, startDate: dates.start!, endDate: dates.end! } : t)
//                 });
//             } else {
//                 toast.error(res.error || "Sync failed.");
//             }
//             setSyncingId(null);
//         });
//     };

//     return (
//         <div className="space-y-6 animate-in fade-in duration-500">
            
//             {/* Header Info */}
//             <div className="flex items-start gap-4 bg-slate-900 border border-white/5 p-6 rounded-[2rem] shadow-xl">
//                 <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
//                     <Info className="h-5 w-5 text-school-primary" style={{ color: primaryColor }} />
//                 </div>
//                 <div className="space-y-1">
//                     <h3 className="text-sm font-black uppercase text-white italic tracking-widest">Institutional Timeline</h3>
//                     <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed max-w-xl">
//                         Dates configured here will synchronize across all grade levels in your curriculum. 
//                         This ensures standardized reporting and exam windows.
//                     </p>
//                 </div>
//             </div>

//             {/* Term Configuration Grid */}
//             <div className="grid grid-cols-1 gap-4">
//                 {[1, 2, 3].map((idx) => {
//                     const current = localDates[idx];
//                     const isSynced = !!(current.start && current.end);
//                     const isSyncing = syncingId === idx && isPending;

//                     return (
//                         <Card key={idx} className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden group shadow-2xl">
//                             <CardContent className="p-8">
//                                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//                                     <div className="flex items-center gap-4">
//                                         <div className="h-12 w-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5 font-black text-xs italic" style={{ color: isSynced ? primaryColor : '#475569' }}>
//                                             0{idx}
//                                         </div>
//                                         <div>
//                                             <h4 className="text-lg font-black text-white uppercase italic">{termLabel} {idx}</h4>
//                                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                                                 {isSynced ? "Calendar Synchronized" : "Schedule Pending"}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <div className="flex flex-wrap items-center gap-4">
//                                         <DateInput 
//                                             label="Commencement" 
//                                             value={current.start} 
//                                             onChange={(d) => setLocalDates(prev => ({ ...prev, [idx]: { ...prev[idx], start: d } }))} 
//                                         />
//                                         <ArrowRight className="h-4 w-4 text-slate-800 hidden md:block" />
//                                         <DateInput 
//                                             label="Termination" 
//                                             value={current.end} 
//                                             onChange={(d) => setLocalDates(prev => ({ ...prev, [idx]: { ...prev[idx], end: d } }))} 
//                                         />
                                        
//                                         <Button 
//                                             disabled={isSyncing}
//                                             onClick={() => handleSync(idx)}
//                                             className="ml-4 rounded-xl px-8 h-12 font-black text-[10px] uppercase tracking-widest transition-all"
//                                             style={{ backgroundColor: primaryColor, color: '#000' }}
//                                         >
//                                             {isSyncing ? <Loader2 className="animate-spin h-4 w-4" /> : "Sync Dates"}
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     )
//                 })}
//             </div>
//         </div>
//     )
// }

// function DateInput({ label, value, onChange }: { label: string, value?: Date, onChange: (d: Date) => void }) {
//     return (
//         <div className="space-y-2">
//             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">{label}</p>
//             <Popover>
//                 <PopoverTrigger asChild>
//                     <button className="bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 w-40 text-left hover:border-white/20 transition-all">
//                         {value ? format(value, 'dd MMM yyyy') : "Select Date"}
//                     </button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10 shadow-2xl">
//                     <Calendar mode="single" selected={value} onSelect={(d) => d && onChange(d)} initialFocus className="bg-slate-900 text-white" />
//                 </PopoverContent>
//             </Popover>
//         </div>
//     )
// }


// 'use client'

// import { useState, useTransition, useEffect } from 'react'
// import { format } from 'date-fns'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import {
//     Calendar as CalendarIcon, RefreshCcw,
//     Loader2, Info, CheckCircle2, AlertCircle, ArrowRight
// } from 'lucide-react'
// import { Calendar } from '@/components/ui/calendar'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { syncInstitutionalTermDates } from '@/app/actions/term.action'
// import { type SchoolSettingsData } from '@/app/actions/school-settings.action'
// import { useProfileStore } from '@/store/profileStore'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// interface TermsSectionProps {
//     data: SchoolSettingsData
//     onUpdate: (updated: Partial<SchoolSettingsData>) => void
// }

// /**
//  * INSTITUTIONAL CALENDAR MANAGEMENT (Tier 2)
//  * Rule 4: Prevents modification of Global Core terms.
//  * Rule 11: Final System Truth synchronization across all grade levels.
//  * Rule 17: Leverages Zustand for school-specific primary branding.
//  */
// export function TermsSection({ data, onUpdate }: TermsSectionProps) {
//     const { profile } = useProfileStore();
//     const [isPending, startTransition] = useTransition();
//     const [syncingId, setSyncingId] = useState<number | null>(null);
    
//     const primaryColor = profile?.primaryColor || "#f59e0b";
//     const termLabel = data.curriculum?.termLabel ?? 'Term';

//     /**
//      * Map existing terms from prop into state keyed by index (1, 2, 3)
//      */
//     const [localDates, setLocalDates] = useState(() => {
//         const map: Record<number, { start?: Date, end?: Date }> = { 
//             1: {}, 2: {}, 3: {} 
//         };
//         data.terms.forEach(t => {
//             if (t.index >= 1 && t.index <= 3) {
//                 if (!map[t.index].start && t.startDate) map[t.index].start = new Date(t.startDate);
//                 if (!map[t.index].end && t.endDate) map[t.index].end = new Date(t.endDate);
//             }
//         });
//         return map;
//     });

//     // Re-sync if parent data refreshes
//     useEffect(() => {
//         const map: Record<number, { start?: Date, end?: Date }> = { 1: {}, 2: {}, 3: {} };
//         data.terms.forEach(t => {
//             if (t.index >= 1 && t.index <= 3) {
//                 if (!map[t.index].start && t.startDate) map[t.index].start = new Date(t.startDate);
//                 if (!map[t.index].end && t.endDate) map[t.index].end = new Date(t.endDate);
//             }
//         });
//         setLocalDates(map);
//     }, [data]);

//     /**
//      * RULE 11: Execute institutional sync
//      */
//     const handleSync = (index: number) => {
//         const dates = localDates[index];
//         if (!dates.start || !dates.end) {
//             toast.error("Both commencement and termination dates are required.");
//             return;
//         }
//         if (dates.start >= dates.end) {
//             toast.error("Timeline Logic Error: Start date must precede end date.");
//             return;
//         }

//         setSyncingId(index);
//         startTransition(async () => {
//             try {
//                 /**
//                  * ✅ FIXED: Call action with exactly 3 arguments (index, start, end).
//                  * Identity/SchoolId is handled securely on the server via session.
//                  */
//                 const res = await syncInstitutionalTermDates(index, dates.start!, dates.end!);
                
//                 if (res.success) {
//                     toast.success(`Institutional ${termLabel} ${index} synchronized across all grades.`);
//                     // Rule 11: Update parent state to reflect DB truth immediately
//                     onUpdate({
//                         terms: data.terms.map(t => 
//                             t.index === index 
//                                 ? { ...t, startDate: dates.start!, endDate: dates.end! } 
//                                 : t
//                         )
//                     });
//                 } else {
//                     toast.error(res.error || "Registry synchronization failed.");
//                 }
//             } catch (err: unknown) {
//                 toast.error("A critical error occurred during calendar sync.");
//             } finally {
//                 setSyncingId(null);
//             }
//         });
//     };

//     return (
//         <div className="space-y-6 animate-in fade-in duration-500">
            
//             {/* ── INFO BANNER ── */}
//             <div className="flex items-start gap-4 bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
//                 <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
//                     <CalendarIcon className="h-6 w-6" style={{ color: primaryColor }} />
//                 </div>
//                 <div className="space-y-2">
//                     <h3 className="text-sm font-black uppercase text-white italic tracking-widest">
//                         Academic Timeline Protocol
//                     </h3>
//                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed max-w-2xl italic">
//                         Configure institutional dates for each {termLabel.toLowerCase()} index. 
//                         Synchronization will apply these dates to all academic levels simultaneously, 
//                         ensuring registry consistency for reports and automated transmissions.
//                     </p>
//                 </div>
//             </div>

//             {/* ── TERM CARDS ── */}
//             <div className="grid grid-cols-1 gap-4">
//                 {[1, 2, 3].map((idx) => {
//                     const current = localDates[idx];
//                     const isSynced = !!(current.start && current.end);
//                     const isSyncing = syncingId === idx && isPending;
//                     const hasError = current.start && current.end && current.start >= current.end;

//                     return (
//                         <Card key={idx} className={cn(
//                             "bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all",
//                             isSynced ? "hover:border-white/10" : "border-amber-500/20"
//                         )}>
//                             <CardContent className="p-8">
//                                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                    
//                                     {/* Label & Status */}
//                                     <div className="flex items-center gap-5">
//                                         <div 
//                                             className="h-12 w-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5 font-black text-xs italic" 
//                                             style={{ color: isSynced ? primaryColor : '#475569' }}
//                                         >
//                                             0{idx}
//                                         </div>
//                                         <div>
//                                             <h4 className="text-lg font-black text-white uppercase italic">{termLabel} {idx}</h4>
//                                             <div className="flex items-center gap-2 mt-1">
//                                                 {isSynced ? (
//                                                     <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded uppercase tracking-widest">Synchronized</span>
//                                                 ) : (
//                                                     <span className="text-[9px] font-black text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded uppercase tracking-widest">Sync Required</span>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Date Controls */}
//                                     <div className="flex flex-wrap items-end gap-6">
//                                         <DateInput 
//                                             label="Commencement" 
//                                             value={current.start} 
//                                             onChange={(d) => setLocalDates(prev => ({ ...prev, [idx]: { ...prev[idx], start: d } }))} 
//                                             primaryColor={primaryColor}
//                                         />
//                                         <ArrowRight className="h-4 w-4 text-slate-800 hidden lg:block mb-4" />
//                                         <DateInput 
//                                             label="Termination" 
//                                             value={current.end} 
//                                             onChange={(d) => setLocalDates(prev => ({ ...prev, [idx]: { ...prev[idx], end: d } }))} 
//                                             primaryColor={primaryColor}
//                                         />
                                        
//                                         <div className="flex flex-col gap-2">
//                                             <Button 
//                                                 disabled={isSyncing || !current.start || !current.end || !!hasError}
//                                                 onClick={() => handleSync(idx)}
//                                                 className="rounded-xl px-10 h-12 font-black text-[10px] uppercase tracking-widest transition-all shadow-xl"
//                                                 style={{ backgroundColor: primaryColor, color: '#000' }}
//                                             >
//                                                 {isSyncing ? <Loader2 className="animate-spin h-4 w-4" /> : <><RefreshCcw className="h-3.5 w-3.5 mr-2" /> Sync Node</>}
//                                             </Button>
//                                             {hasError && (
//                                                 <p className="text-[9px] font-black text-red-500 uppercase text-center animate-pulse">Timeline Error</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     )
//                 })}
//             </div>
//         </div>
//     )
// }

// /**
//  * ── HELPER: INTERNAL DATE PICKER ──
//  */
// function DateInput({ label, value, onChange, primaryColor }: { label: string, value?: Date, onChange: (d: Date) => void, primaryColor: string }) {
//     return (
//         <div className="space-y-2">
//             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">{label}</p>
//             <Popover>
//                 <PopoverTrigger asChild>
//                     <button className="bg-slate-950 border border-white/5 rounded-xl px-5 py-3.5 text-xs font-bold text-slate-300 w-44 text-left hover:border-white/20 transition-all shadow-inner">
//                         {value ? format(value, 'dd MMM yyyy') : "Select Date"}
//                     </button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10 shadow-2xl rounded-2xl overflow-hidden">
//                     <Calendar 
//                         mode="single" 
//                         selected={value} 
//                         onSelect={(d) => d && onChange(d)} 
//                         initialFocus 
//                         className="bg-slate-900 text-white"
//                         style={{ color: '#fff' }}
//                     />
//                 </PopoverContent>
//             </Popover>
//         </div>
//     )
// }


'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Calendar as CalendarIcon, RefreshCcw,
    Loader2, CheckCircle2, ArrowRight, ChevronDown
} from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { syncInstitutionalTermDates } from '@/app/actions/term.action'
import { type SchoolSettingsData } from '@/app/actions/school-settings.action'
import { useProfileStore } from '@/store/profileStore'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface TermsSectionProps {
    data: SchoolSettingsData
    onUpdate: (updated: Partial<SchoolSettingsData>) => void
}

/**
 * INSTITUTIONAL CALENDAR MANAGEMENT (Tier 2)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem] for architecture cards.
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function TermsSection({ data, onUpdate }: TermsSectionProps) {
    const { profile } = useProfileStore();
    const [isPending, startTransition] = useTransition();
    const [syncingId, setSyncingId] = useState<number | null>(null);
    
    const termLabel = data.curriculum?.termLabel ?? 'Term';

    const [localDates, setLocalDates] = useState(() => {
        const map: Record<number, { start?: Date, end?: Date }> = { 1: {}, 2: {}, 3: {} };
        data.terms.forEach(t => {
            if (t.index >= 1 && t.index <= 3) {
                if (!map[t.index].start && t.startDate) map[t.index].start = new Date(t.startDate);
                if (!map[t.index].end && t.endDate) map[t.index].end = new Date(t.endDate);
            }
        });
        return map;
    });

    useEffect(() => {
        const map: Record<number, { start?: Date, end?: Date }> = { 1: {}, 2: {}, 3: {} };
        data.terms.forEach(t => {
            if (t.index >= 1 && t.index <= 3) {
                if (!map[t.index].start && t.startDate) map[t.index].start = new Date(t.startDate);
                if (!map[t.index].end && t.endDate) map[t.index].end = new Date(t.endDate);
            }
        });
        setLocalDates(map);
    }, [data]);

    const handleSync = (index: number) => {
        const dates = localDates[index];
        if (!dates.start || !dates.end) {
            toast.error("Registry Gate: Both commencement and termination dates are required.");
            return;
        }
        if (dates.start >= dates.end) {
            toast.error("Timeline Logic Error: Commencement must precede termination.");
            return;
        }

        setSyncingId(index);
        startTransition(async () => {
            try {
                const res = await syncInstitutionalTermDates(index, dates.start!, dates.end!);
                
                if (res.success) {
                    toast.success(`Institutional Timeline Synchronized: ${termLabel} ${index}`);
                    onUpdate({
                        terms: data.terms.map(t => 
                            t.index === index 
                                ? { ...t, startDate: dates.start!, endDate: dates.end! } 
                                : t
                        )
                    });
                } else {
                    toast.error("Registry synchronization failed.");
                }
            } catch (err: unknown) {
                toast.error("Critical failure during calendar sync.");
            } finally {
                setSyncingId(null);
            }
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            
            {/* ── CONTEXT BANNER (Rule 18/21) ── */}
            <div className="bg-card border border-border p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-start gap-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="p-3 bg-surface rounded-2xl border border-border shadow-sm z-10">
                    <CalendarIcon className="h-6 w-6 text-school-primary" />
                </div>
                <div className="space-y-2 z-10">
                    <h3 className="text-sm font-extrabold uppercase text-foreground italic tracking-tight">
                        Academic Timeline Protocol
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest leading-relaxed max-w-2xl italic opacity-80">
                        Configure institutional dates for each {termLabel.toLowerCase()} hub. 
                        Synchronization applies timeline metadata across all academic modules simultaneously, 
                        ensuring registry consistency for automated transmissions.
                    </p>
                </div>
            </div>

            {/* ── TERM CARDS (Rule 19/20) ── */}
            <div className="space-y-4">
                {[1, 2, 3].map((idx) => {
                    const current = localDates[idx];
                    const isSynced = !!(current.start && current.end);
                    const isSyncing = syncingId === idx && isPending;
                    const hasError = current.start && current.end && current.start >= current.end;

                    return (
                        <Card key={idx} className={cn(
                            "bg-card border-border rounded-[2rem] overflow-hidden shadow-lg transition-all duration-300",
                            isSynced ? "hover:border-school-primary-200" : "border-amber-200 bg-amber-50/10"
                        )}>
                            <CardContent className="p-6 md:p-8">
                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                                    
                                    {/* Identity sector */}
                                    <div className="flex items-center gap-5">
                                        <div 
                                            className={cn(
                                                "h-14 w-14 rounded-2xl flex items-center justify-center border font-extrabold text-sm italic transition-colors shadow-inner",
                                                isSynced ? "bg-school-primary-50 border-school-primary-200 text-school-primary" : "bg-surface border-border text-muted-foreground/30"
                                            )}
                                        >
                                            0{idx}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter">{termLabel} {idx}</h4>
                                            <div className="flex items-center gap-2">
                                                {isSynced ? (
                                                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 uppercase tracking-widest">Synchronized</span>
                                                ) : (
                                                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 uppercase tracking-widest">Timeline Required</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Controls sector (Rule 20) */}
                                    <div className="flex flex-wrap items-end gap-6 md:gap-8">
                                        <DateInput 
                                            label="Commencement" 
                                            value={current.start} 
                                            onChange={(d) => setLocalDates(prev => ({ ...prev, [idx]: { ...prev[idx], start: d } }))} 
                                        />
                                        <div className="hidden xl:flex items-center pb-5">
                                            <ArrowRight className="h-4 w-4 text-muted-foreground/20" />
                                        </div>
                                        <DateInput 
                                            label="Termination" 
                                            value={current.end} 
                                            onChange={(d) => setLocalDates(prev => ({ ...prev, [idx]: { ...prev[idx], end: d } }))} 
                                        />
                                        
                                        <div className="flex flex-col gap-2 min-w-[160px]">
                                            <button 
                                                disabled={isSyncing || !current.start || !current.end || !!hasError}
                                                onClick={() => handleSync(idx)}
                                                className={cn(
                                                    "h-12 px-8 rounded-xl font-extrabold text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-20",
                                                    isSynced ? "bg-school-primary text-on-school-primary" : "bg-foreground text-background"
                                                )}
                                            >
                                                {isSyncing ? (
                                                    <Loader2 className="animate-spin h-4 w-4 mx-auto" />
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <RefreshCcw className="h-3.5 w-3.5" />
                                                        Sync Hub
                                                    </div>
                                                )}
                                            </button>
                                            {hasError && (
                                                <p className="text-[9px] font-bold text-destructive uppercase text-center animate-pulse tracking-tighter">Timeline Logic Error</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

// ── Sub-Component (Rule 18/19/21) ───────────────────────────────────────────

function DateInput({ label, value, onChange }: { label: string, value?: Date, onChange: (d: Date) => void }) {
    return (
        <div className="space-y-2 group">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">{label}</p>
            <Popover>
                <PopoverTrigger asChild>
                    <button className={cn(
                        "h-12 w-44 px-4 flex items-center justify-between rounded-xl border transition-all shadow-sm outline-none",
                        "bg-surface border-border text-foreground hover:border-school-primary-200",
                        "focus:ring-2 focus:ring-school-primary-200"
                    )}>
                        <span className="text-xs font-bold uppercase italic tabular-nums">
                            {value ? format(value, 'dd MMM yyyy') : "Select Date"}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 opacity-30" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card border-border shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95" align="start">
                    <Calendar 
                        mode="single" 
                        selected={value} 
                        onSelect={(d) => d && onChange(d)} 
                        initialFocus 
                        className="bg-card text-foreground"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}