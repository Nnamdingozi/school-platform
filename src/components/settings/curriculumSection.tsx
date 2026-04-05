


// 'use client'

// import { useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { BookOpen, Save, Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react'
// import { updateCurriculumLabels, SchoolSettingsData } from '@/app/actions/school-settings.action'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// export function CurriculumSection({ data }: { data: SchoolSettingsData }) {
//     const [labels, setLabels] = useState({
//         subject: data.curriculum?.subjectLabel ?? 'Subject',
//         term:    data.curriculum?.termLabel    ?? 'Term',
//         year:    data.curriculum?.yearLabel    ?? 'Year',
//     })
//     const [saving, setSaving] = useState(false)
//     const [saved,  setSaved]  = useState(false)

//     if (!data.curriculum) return (
//         <Card className="bg-school-secondary-900 border-school-secondary-700">
//             <CardContent className="flex items-center justify-center h-32">
//                 <p className="text-sm text-school-secondary-400">No curriculum assigned.</p>
//             </CardContent>
//         </Card>
//     )

//     const hasChanges =
//         labels.subject !== data.curriculum.subjectLabel ||
//         labels.term    !== data.curriculum.termLabel    ||
//         labels.year    !== data.curriculum.yearLabel

//     async function handleSave() {
//         setSaving(true)
//         const res = await updateCurriculumLabels(data.curriculum!.id, {
//             subjectLabel: labels.subject,
//             termLabel:    labels.term,
//             yearLabel:    labels.year,
//         })
//         if (res.success) {
//             setSaved(true)
//             setTimeout(() => setSaved(false), 3000)
//             toast.success('Terminology updated.')
//         } else {
//             toast.error(res.error ?? 'Failed to update.')
//         }
//         setSaving(false)
//     }

//     const FIELDS = [
//         {
//             key:         'subject' as const,
//             label:       'Subject Label',
//             placeholder: 'e.g. Subject, Course',
//             example:     '"Mathematics Subject"',
//         },
//         {
//             key:         'term' as const,
//             label:       'Term Label',
//             placeholder: 'e.g. Term, Semester',
//             example:     '"Term 1 Report"',
//         },
//         {
//             key:         'year' as const,
//             label:       'Year Label',
//             placeholder: 'e.g. Year, Grade',
//             example:     '"Year 7 Students"',
//         },
//     ]

//     return (
//         <div className="space-y-4">

//             {/* ── Active curriculum info ── */}
//             <Card className="bg-school-secondary-900 border-school-secondary-700">
//                 <CardContent className="p-4 sm:p-5">
//                     <div className="flex items-center justify-between gap-3 flex-wrap">
//                         <div className="flex items-center gap-3">
//                             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20">
//                                 <BookOpen className="h-4 w-4 text-school-primary" />
//                             </div>
//                             <div>
//                                 <p className="text-sm font-bold text-white">
//                                     {data.curriculum.name}
//                                 </p>
//                                 <p className="text-[11px] text-school-secondary-400">
//                                     Active curriculum · Contact support to change curriculum type
//                                 </p>
//                             </div>
//                         </div>
//                         <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-1 text-[11px] font-semibold text-green-400 shrink-0">
//                             <CheckCircle2 className="h-3 w-3" />
//                             Active
//                         </span>
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* ── Labels card ── */}
//             <Card className="bg-school-secondary-900 border-school-secondary-700">
//                 <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                             <BookOpen className="h-4 w-4 text-school-primary" />
//                         </div>
//                         <div>
//                             <CardTitle className="text-sm font-bold text-white">
//                                 Terminology Labels
//                             </CardTitle>
//                             <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                 Customize how subjects, terms and years appear across the platform
//                             </p>
//                         </div>
//                     </div>
//                 </CardHeader>

//                 <CardContent className="p-4 sm:p-6 space-y-5">

//                     {/* ── Label inputs ── */}
//                     <div className="grid gap-4 sm:grid-cols-3">
//                         {FIELDS.map(field => (
//                             <div key={field.key} className="space-y-1.5">
//                                 <Label className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                                     {field.label}
//                                 </Label>
//                                 <Input
//                                     value={labels[field.key]}
//                                     onChange={e => setLabels(prev => ({ ...prev, [field.key]: e.target.value }))}
//                                     placeholder={field.placeholder}
//                                     className="bg-school-secondary-800 border-school-secondary-700 text-white placeholder:text-school-secondary-600 focus:border-school-primary h-9 text-sm"
//                                 />
//                                 <p className="text-[11px] text-school-secondary-600">
//                                     e.g. {field.example}
//                                 </p>
//                             </div>
//                         ))}
//                     </div>

//                     {/* ── Preview ── */}
//                     <div className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-4 space-y-3">
//                         <div className="flex items-center gap-1.5">
//                             <Info className="h-3 w-3 text-school-secondary-500" />
//                             <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                                 Preview
//                             </p>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                             {[
//                                 `${labels.year} 7`,
//                                 `${labels.term} 2`,
//                                 `Mathematics ${labels.subject}`,
//                             ].map(label => (
//                                 <span
//                                     key={label}
//                                     className="inline-flex items-center px-3 py-1.5 rounded-lg bg-school-primary/10 border border-school-primary/20 text-xs font-semibold text-school-primary"
//                                 >
//                                     {label}
//                                 </span>
//                             ))}
//                         </div>
//                     </div>

//                     {/* ── Unsaved changes indicator ── */}
//                     {hasChanges && !saved && (
//                         <p className="flex items-center gap-1.5 text-[11px] text-amber-400">
//                             <AlertCircle className="h-3 w-3 shrink-0" />
//                             You have unsaved changes
//                         </p>
//                     )}

//                     {/* ── Save button — below fields ── */}
//                     <div className="flex items-center justify-end pt-1 border-t border-school-secondary-700">
//                         <Button
//                             onClick={handleSave}
//                             disabled={saving || !hasChanges}
//                             size="sm"
//                             className={cn(
//                                 'h-8 px-4 text-xs font-bold transition-all',
//                                 saved
//                                     ? 'bg-green-500 hover:bg-green-600 text-white'
//                                     : 'bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 disabled:opacity-40'
//                             )}
//                         >
//                             {saving ? (
//                                 <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Saving...</>
//                             ) : saved ? (
//                                 <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />Saved!</>
//                             ) : (
//                                 <><Save className="h-3.5 w-3.5 mr-1.5" />Save Changes</>
//                             )}
//                         </Button>
//                     </div>

//                 </CardContent>
//             </Card>
//         </div>
//     )
// }



'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BookOpen, Save, Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { updateCurriculumLabels, SchoolSettingsData } from '@/app/actions/school-settings.action'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ── Props ──────────────────────────────────────────────────────────────────────
interface CurriculumSectionProps {
    data:     SchoolSettingsData
    onUpdate: (updated: Partial<SchoolSettingsData>) => void
}

export function CurriculumSection({ data, onUpdate }: CurriculumSectionProps) {
    const [labels, setLabels] = useState({
        subject: data.curriculum?.subjectLabel ?? 'Subject',
        term:    data.curriculum?.termLabel    ?? 'Term',
        year:    data.curriculum?.yearLabel    ?? 'Year',
    })
    const [saving, setSaving] = useState(false)
    const [saved,  setSaved]  = useState(false)

    // ✅ Track saved baselines so hasChanges resets after save
    const [savedLabels, setSavedLabels] = useState({
        subject: data.curriculum?.subjectLabel ?? 'Subject',
        term:    data.curriculum?.termLabel    ?? 'Term',
        year:    data.curriculum?.yearLabel    ?? 'Year',
    })

    if (!data.curriculum) return (
        <Card className="bg-school-secondary-900 border-school-secondary-700">
            <CardContent className="flex items-center justify-center h-32">
                <p className="text-sm text-school-secondary-400">No curriculum assigned.</p>
            </CardContent>
        </Card>
    )

    const hasChanges =
        labels.subject !== savedLabels.subject ||
        labels.term    !== savedLabels.term    ||
        labels.year    !== savedLabels.year

    async function handleSave() {
        if (!data.curriculum) return
        setSaving(true)

        const res = await updateCurriculumLabels(data.curriculum.id, {
            subjectLabel: labels.subject,
            termLabel:    labels.term,
            yearLabel:    labels.year,
        })

        if (res.success) {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)

            // ✅ Update saved baselines — hasChanges becomes false immediately
            setSavedLabels({
                subject: labels.subject,
                term:    labels.term,
                year:    labels.year,
            })

            // ✅ Propagate to parent — other tabs using termLabel/subjectLabel
            // will reflect the new values without a page refresh
            onUpdate({
                curriculum: {
                    ...data.curriculum!,
                    subjectLabel: labels.subject,
                    termLabel:    labels.term,
                    yearLabel:    labels.year,
                },
            })

            toast.success('Terminology updated.')
        } else {
            toast.error(res.error ?? 'Failed to update.')
        }

        setSaving(false)
    }

    const FIELDS = [
        {
            key:         'subject' as const,
            label:       'Subject Label',
            placeholder: 'e.g. Subject, Course',
            example:     '"Mathematics Subject"',
        },
        {
            key:         'term' as const,
            label:       'Term Label',
            placeholder: 'e.g. Term, Semester',
            example:     '"Term 1 Report"',
        },
        {
            key:         'year' as const,
            label:       'Year Label',
            placeholder: 'e.g. Year, Grade',
            example:     '"Year 7 Students"',
        },
    ]

    return (
        <div className="space-y-4">

            {/* ── Active curriculum info ── */}
            <Card className="bg-school-secondary-900 border-school-secondary-700">
                <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20">
                                <BookOpen className="h-4 w-4 text-school-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">
                                    {data.curriculum.name}
                                </p>
                                <p className="text-[11px] text-school-secondary-400">
                                    Active curriculum · Contact support to change curriculum type
                                </p>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-1 text-[11px] font-semibold text-green-400 shrink-0">
                            <CheckCircle2 className="h-3 w-3" />
                            Active
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* ── Labels card ── */}
            <Card className="bg-school-secondary-900 border-school-secondary-700">
                <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
                            <BookOpen className="h-4 w-4 text-school-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-bold text-white">
                                Terminology Labels
                            </CardTitle>
                            <p className="text-[11px] text-school-secondary-400 mt-0.5">
                                Customize how subjects, terms and years appear across the platform
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-5">

                    {/* Instruction banner */}
                    <div className="flex items-start gap-2 rounded-lg border border-school-secondary-700 bg-school-secondary-800/50 px-3 py-2.5">
                        <Info className="h-3.5 w-3.5 text-school-primary shrink-0 mt-0.5" />
                        <p className="text-[11px] text-school-secondary-400 leading-relaxed">
                            These labels control terminology used throughout the platform.
                            Changes apply immediately after saving.
                        </p>
                    </div>

                    {/* ── Label inputs ── */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        {FIELDS.map(field => {
                            const changed = labels[field.key] !== savedLabels[field.key]
                            return (
                                <div
                                    key={field.key}
                                    className={cn(
                                        'space-y-1.5 rounded-xl border p-3 transition-all',
                                        changed
                                            ? 'border-school-primary/40 bg-school-primary/5'
                                            : 'border-school-secondary-600 bg-school-secondary-800/30'
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-bold text-white uppercase tracking-wider">
                                            {field.label}
                                        </Label>
                                        {changed && (
                                            <span className="text-[9px] text-school-primary font-semibold">
                                                Modified
                                            </span>
                                        )}
                                    </div>
                                    <Input
                                        value={labels[field.key]}
                                        onChange={e => setLabels(prev => ({
                                            ...prev,
                                            [field.key]: e.target.value,
                                        }))}
                                        placeholder={field.placeholder}
                                        className={cn(
                                            'text-white placeholder:text-school-secondary-600 h-9 text-sm transition-all',
                                            changed
                                                ? 'bg-school-primary/5 border-school-primary/50 hover:border-school-primary focus:border-school-primary'
                                                : 'bg-school-secondary-800 border-school-secondary-500 hover:border-school-secondary-300 focus:border-school-primary'
                                        )}
                                    />
                                    <p className="text-[11px] text-school-secondary-600">
                                        e.g. {field.example}
                                    </p>
                                    {changed && (
                                        <p className="flex items-center gap-1 text-[10px] text-school-primary">
                                            <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                                            Updated — save to apply
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* ── Preview ── */}
                    <div className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-4 space-y-3">
                        <div className="flex items-center gap-1.5">
                            <Info className="h-3 w-3 text-school-secondary-500" />
                            <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
                                Preview — updates as you type
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[
                                `${labels.year} 7`,
                                `${labels.term} 2`,
                                `Mathematics ${labels.subject}`,
                            ].map(label => (
                                <span
                                    key={label}
                                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-school-primary/10 border border-school-primary/20 text-xs font-semibold text-school-primary"
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ── Save row ── */}
                    <div className="flex items-center justify-between pt-1 border-t border-school-secondary-700">
                        {hasChanges && !saved ? (
                            <p className="flex items-center gap-1.5 text-[11px] text-amber-400">
                                <AlertCircle className="h-3 w-3 shrink-0" />
                                You have unsaved changes
                            </p>
                        ) : (
                            <span />
                        )}

                        <Button
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            size="sm"
                            className={cn(
                                'h-8 px-4 text-xs font-bold transition-all',
                                saved
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 disabled:opacity-40'
                            )}
                        >
                            {saving ? (
                                <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Saving...</>
                            ) : saved ? (
                                <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />Saved!</>
                            ) : (
                                <><Save className="h-3.5 w-3.5 mr-1.5" />Save Changes</>
                            )}
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}