


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

// // ── Props ──────────────────────────────────────────────────────────────────────
// interface CurriculumSectionProps {
//     data:     SchoolSettingsData
//     onUpdate: (updated: Partial<SchoolSettingsData>) => void
// }

// export function CurriculumSection({ data, onUpdate }: CurriculumSectionProps) {
//     const [labels, setLabels] = useState({
//         subject: data.curriculum?.subjectLabel ?? 'Subject',
//         term:    data.curriculum?.termLabel    ?? 'Term',
//         year:    data.curriculum?.yearLabel    ?? 'Year',
//     })
//     const [saving, setSaving] = useState(false)
//     const [saved,  setSaved]  = useState(false)

//     // ✅ Track saved baselines so hasChanges resets after save
//     const [savedLabels, setSavedLabels] = useState({
//         subject: data.curriculum?.subjectLabel ?? 'Subject',
//         term:    data.curriculum?.termLabel    ?? 'Term',
//         year:    data.curriculum?.yearLabel    ?? 'Year',
//     })

//     if (!data.curriculum) return (
//         <Card className="bg-school-secondary-900 border-school-secondary-700">
//             <CardContent className="flex items-center justify-center h-32">
//                 <p className="text-sm text-school-secondary-400">No curriculum assigned.</p>
//             </CardContent>
//         </Card>
//     )

//     const hasChanges =
//         labels.subject !== savedLabels.subject ||
//         labels.term    !== savedLabels.term    ||
//         labels.year    !== savedLabels.year

//     async function handleSave() {
//         if (!data.curriculum) return
//         setSaving(true)

//         const res = await updateCurriculumLabels(data.curriculum.id, {
//             subjectLabel: labels.subject,
//             termLabel:    labels.term,
//             yearLabel:    labels.year,
//         })

//         if (res.success) {
//             setSaved(true)
//             setTimeout(() => setSaved(false), 3000)

//             // ✅ Update saved baselines — hasChanges becomes false immediately
//             setSavedLabels({
//                 subject: labels.subject,
//                 term:    labels.term,
//                 year:    labels.year,
//             })

//             // ✅ Propagate to parent — other tabs using termLabel/subjectLabel
//             // will reflect the new values without a page refresh
//             onUpdate({
//                 curriculum: {
//                     ...data.curriculum!,
//                     subjectLabel: labels.subject,
//                     termLabel:    labels.term,
//                     yearLabel:    labels.year,
//                 },
//             })

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

//                     {/* Instruction banner */}
//                     <div className="flex items-start gap-2 rounded-lg border border-school-secondary-700 bg-school-secondary-800/50 px-3 py-2.5">
//                         <Info className="h-3.5 w-3.5 text-school-primary shrink-0 mt-0.5" />
//                         <p className="text-[11px] text-school-secondary-400 leading-relaxed">
//                             These labels control terminology used throughout the platform.
//                             Changes apply immediately after saving.
//                         </p>
//                     </div>

//                     {/* ── Label inputs ── */}
//                     <div className="grid gap-4 sm:grid-cols-3">
//                         {FIELDS.map(field => {
//                             const changed = labels[field.key] !== savedLabels[field.key]
//                             return (
//                                 <div
//                                     key={field.key}
//                                     className={cn(
//                                         'space-y-1.5 rounded-xl border p-3 transition-all',
//                                         changed
//                                             ? 'border-school-primary/40 bg-school-primary/5'
//                                             : 'border-school-secondary-600 bg-school-secondary-800/30'
//                                     )}
//                                 >
//                                     <div className="flex items-center justify-between">
//                                         <Label className="text-[10px] font-bold text-white uppercase tracking-wider">
//                                             {field.label}
//                                         </Label>
//                                         {changed && (
//                                             <span className="text-[9px] text-school-primary font-semibold">
//                                                 Modified
//                                             </span>
//                                         )}
//                                     </div>
//                                     <Input
//                                         value={labels[field.key]}
//                                         onChange={e => setLabels(prev => ({
//                                             ...prev,
//                                             [field.key]: e.target.value,
//                                         }))}
//                                         placeholder={field.placeholder}
//                                         className={cn(
//                                             'text-white placeholder:text-school-secondary-600 h-9 text-sm transition-all',
//                                             changed
//                                                 ? 'bg-school-primary/5 border-school-primary/50 hover:border-school-primary focus:border-school-primary'
//                                                 : 'bg-school-secondary-800 border-school-secondary-500 hover:border-school-secondary-300 focus:border-school-primary'
//                                         )}
//                                     />
//                                     <p className="text-[11px] text-school-secondary-600">
//                                         e.g. {field.example}
//                                     </p>
//                                     {changed && (
//                                         <p className="flex items-center gap-1 text-[10px] text-school-primary">
//                                             <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
//                                             Updated — save to apply
//                                         </p>
//                                     )}
//                                 </div>
//                             )
//                         })}
//                     </div>

//                     {/* ── Preview ── */}
//                     <div className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-4 space-y-3">
//                         <div className="flex items-center gap-1.5">
//                             <Info className="h-3 w-3 text-school-secondary-500" />
//                             <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                                 Preview — updates as you type
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

//                     {/* ── Save row ── */}
//                     <div className="flex items-center justify-between pt-1 border-t border-school-secondary-700">
//                         {hasChanges && !saved ? (
//                             <p className="flex items-center gap-1.5 text-[11px] text-amber-400">
//                                 <AlertCircle className="h-3 w-3 shrink-0" />
//                                 You have unsaved changes
//                             </p>
//                         ) : (
//                             <span />
//                         )}

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


// 'use client'

// import { useState, useTransition } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
// import { BookOpen, Save, Loader2, Info, ShieldCheck } from 'lucide-react'
// import { updateCurriculumLabels } from '@/app/actions/school-settings.action'
// import { type SchoolSettingsData } from '@/app/actions/school-settings.action'
// import { useProfileStore } from '@/store/profileStore'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// interface CurriculumSectionProps {
//     data: SchoolSettingsData
//     onUpdate: (updated: Partial<SchoolSettingsData>) => void
// }

// /**
//  * CURRICULUM TERMINOLOGY MANAGEMENT (Tier 2)
//  * Rule 4: Prevents modification of Global Core if not school-owned.
//  */
// export function CurriculumSection({ data, onUpdate }: CurriculumSectionProps) {
//     const { profile } = useProfileStore();
//     const [isPending, startTransition] = useTransition();
//     const primaryColor = profile?.primaryColor || "#f59e0b";

//     const [labels, setLabels] = useState({
//         subject: data.curriculum?.subjectLabel ?? 'Subject',
//         term:    data.curriculum?.termLabel    ?? 'Term',
//         year:    data.curriculum?.yearLabel    ?? 'Year',
//     });

//     if (!data.curriculum) return (
//         <div className="p-12 text-center bg-slate-900/50 rounded-[2.5rem] border border-dashed border-white/5">
//             <p className="text-slate-500 uppercase font-black text-xs tracking-widest">No modular curriculum assigned to this institution.</p>
//         </div>
//     );

//     // Rule 4: Guard against modifying Global platform labels
//     const isGlobalCurriculum = data.curriculum.isGlobal;

//     const handleSave = () => {
//         if (isGlobalCurriculum) return toast.error("Global core terminology is read-only.");
        
//         startTransition(async () => {
//             const res = await updateCurriculumLabels(data.curriculum!.id, {
//                 subjectLabel: labels.subject,
//                 termLabel: labels.term,
//                 yearLabel: labels.year
//             });

//             if (res.success) {
//                 toast.success("Platform terminology synchronized.");
//                 onUpdate({
//                     curriculum: { ...data.curriculum!, subjectLabel: labels.subject, termLabel: labels.term, yearLabel: labels.year }
//                 });
//             } else {
//                 toast.error(res.error || "Update failed.");
//             }
//         });
//     };

//     return (
//         <div className="space-y-6 animate-in fade-in duration-500">
            
//             {/* Context Warning */}
//             <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] flex items-start gap-6 shadow-xl">
//                 <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
//                     <BookOpen className="h-6 w-6" style={{ color: primaryColor }} />
//                 </div>
//                 <div className="space-y-2">
//                     <h3 className="text-sm font-black uppercase text-white italic">Active Blueprint: {data.curriculum.name}</h3>
//                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed italic">
//                         Adjust how academic nodes are labeled across the student and teacher dashboards. 
//                         {isGlobalCurriculum && " NOTE: This is a platform-wide core and labels are restricted to read-only."}
//                     </p>
//                 </div>
//             </div>

//             <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
//                 <CardHeader className="p-8 bg-slate-950/50 border-b border-white/5">
//                     <CardTitle className="text-lg font-black text-white uppercase italic tracking-tighter">System Terminology</CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-8 space-y-8">
                    
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <LabelInput 
//                             label="Subject Node" 
//                             value={labels.subject} 
//                             onChange={(v) => setLabels(prev => ({...prev, subject: v}))} 
//                             disabled={isGlobalCurriculum} 
//                         />
//                         <LabelInput 
//                             label="Academic Term" 
//                             value={labels.term} 
//                             onChange={(v) => setLabels(prev => ({...prev, term: v}))} 
//                             disabled={isGlobalCurriculum} 
//                         />
//                         <LabelInput 
//                             label="Grade / Year" 
//                             value={labels.year} 
//                             onChange={(v) => setLabels(prev => ({...prev, year: v}))} 
//                             disabled={isGlobalCurriculum} 
//                         />
//                     </div>

//                     <div className="pt-6 border-t border-white/5 flex justify-between items-center">
//                         <div className="flex items-center gap-2 text-slate-600">
//                             <ShieldCheck className="h-4 w-4" />
//                             <span className="text-[9px] font-black uppercase tracking-widest">Labels apply to all cohorts immediately.</span>
//                         </div>
                        
//                         {!isGlobalCurriculum && (
//                             <button 
//                                 onClick={handleSave}
//                                 disabled={isPending}
//                                 className="px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center gap-2"
//                                 style={{ backgroundColor: primaryColor, color: '#000' }}
//                             >
//                                 {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save className="h-4 w-4" /> Update Registry</>}
//                             </button>
//                         )}
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }

// function LabelInput({ label, value, onChange, disabled }: { label: string, value: string, onChange: (v: string) => void, disabled: boolean }) {
//     return (
//         <div className="space-y-3">
//             <Label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">{label}</Label>
//             <input 
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//                 disabled={disabled}
//                 className="w-full bg-slate-950 border border-white/5 rounded-xl px-5 py-4 text-white focus:border-school-primary outline-none transition-all font-bold uppercase disabled:opacity-30 disabled:cursor-not-allowed"
//             />
//         </div>
//     )
// }


'use client'

import React, { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { BookOpen, Save, Loader2, ShieldCheck } from 'lucide-react'
import { updateCurriculumLabels } from '@/app/actions/school-settings.action'
import { type SchoolSettingsData } from '@/app/actions/school-settings.action'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getErrorMessage } from '@/lib/error-handler'

interface CurriculumSectionProps {
    data: SchoolSettingsData
    onUpdate: (updated: Partial<SchoolSettingsData>) => void
}

/**
 * CURRICULUM TERMINOLOGY MANAGEMENT (Tier 2)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-card, bg-surface, border-border).
 * Rule 19: Standardized Geometry [2rem] for layout blocks.
 * Rule 21: Scale Protocol for mathematical brand tints.
 */
export function CurriculumSection({ data, onUpdate }: CurriculumSectionProps) {
    const [isPending, startTransition] = useTransition();

    const [labels, setLabels] = useState({
        subject: data.curriculum?.subjectLabel ?? 'Subject',
        term:    data.curriculum?.termLabel    ?? 'Term',
        year:    data.curriculum?.yearLabel    ?? 'Year',
    });

    if (!data.curriculum) return (
        <div className="p-12 text-center bg-surface border-2 border-dashed border-border rounded-[2rem] animate-in fade-in duration-500">
            <p className="text-muted-foreground uppercase font-bold text-[10px] tracking-widest italic">
                No modular curriculum assigned to this institution.
            </p>
        </div>
    );

    // Rule 4: Guard against modifying Global platform labels
    const isGlobalCurriculum = data.curriculum.isGlobal;

    const handleSave = () => {
        if (isGlobalCurriculum) return toast.error("Global core terminology is read-only.");
        
        startTransition(async () => {
            try {
                const res = await updateCurriculumLabels(data.curriculum!.id, {
                    subjectLabel: labels.subject,
                    termLabel: labels.term,
                    yearLabel: labels.year
                });

                if (res.success) {
                    toast.success("Registry terminology synchronized.");
                    onUpdate({
                        curriculum: { 
                            ...data.curriculum!, 
                            subjectLabel: labels.subject, 
                            termLabel: labels.term, 
                            yearLabel: labels.year 
                        }
                    });
                } else {
                    toast.error("Registry update failed.");
                }
            } catch (err) {
                 getErrorMessage(err)
                toast.error("Synchronous failure in terminology pipeline.");
            }
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* ── CONTEXT BANNER (Rule 18/21) ── */}
            <div className="bg-card border border-border p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-start gap-6 shadow-xl relative overflow-hidden group">
                {/* Rule 21 Scale Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="p-3 bg-surface rounded-2xl border border-border shadow-sm z-10">
                    <BookOpen className="h-6 w-6 text-school-primary" />
                </div>
                <div className="space-y-2 z-10">
                    <h3 className="text-sm font-extrabold uppercase text-foreground italic tracking-tight">
                        Active Blueprint: {data.curriculum.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest leading-relaxed italic opacity-80">
                        Adjust how academic modules are labeled across the student and teacher dashboards. 
                        {isGlobalCurriculum && " Registry Note: This is a platform-wide core; labels are locked to read-only."}
                    </p>
                </div>
            </div>

            {/* ── SETTINGS CARD (Rule 19) ── */}
            <Card className="bg-card border-border rounded-[2rem] overflow-hidden shadow-2xl">
                <CardHeader className="p-6 md:p-8 bg-surface/50 border-b border-border">
                    <CardTitle className="text-lg font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                        System Terminology
                    </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 md:p-10 space-y-10">
                    {/* Rule 20: Responsive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <LabelInput 
                            label="Academic Module" 
                            value={labels.subject} 
                            onChange={(v) => setLabels(prev => ({...prev, subject: v}))} 
                            disabled={isGlobalCurriculum} 
                        />
                        <LabelInput 
                            label="Timeline Hub" 
                            value={labels.term} 
                            onChange={(v) => setLabels(prev => ({...prev, term: v}))} 
                            disabled={isGlobalCurriculum} 
                        />
                        <LabelInput 
                            label="Cohort / Level" 
                            value={labels.year} 
                            onChange={(v) => setLabels(prev => ({...prev, year: v}))} 
                            disabled={isGlobalCurriculum} 
                        />
                    </div>

                    <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3 text-muted-foreground/60">
                            <ShieldCheck className="h-4 w-4 text-school-primary" />
                            <span className="text-[9px] font-bold uppercase tracking-widest italic leading-none">
                                Terminology overrides apply across all institutional tiers immediately.
                            </span>
                        </div>
                        
                        {!isGlobalCurriculum && (
                            <button 
                                onClick={handleSave}
                                disabled={isPending}
                                className="w-full sm:w-auto bg-school-primary text-on-school-primary font-extrabold px-10 py-4 rounded-xl uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-school-primary-200 hover:brightness-110 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                    <><Save className="h-4 w-4" /> Update Registry</>
                                )}
                            </button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// ── Sub-Component (Rule 18/21) ──────────────────────────────────────────────

function LabelInput({ label, value, onChange, disabled }: { label: string, value: string, onChange: (v: string) => void, disabled: boolean }) {
    return (
        <div className="space-y-3 group">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
                {label}
            </Label>
            <input 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={cn(
                    "w-full px-5 py-4 outline-none transition-all",
                    "bg-surface border border-border rounded-xl shadow-sm", // Rule 18 & 19
                    "text-sm font-extrabold text-foreground uppercase italic",
                    "focus:ring-2 focus:ring-school-primary-200 focus:border-school-primary", // Rule 21
                    "disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale"
                )}
            />
        </div>
    )
}