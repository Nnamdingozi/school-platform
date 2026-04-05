// 'use client'

// import { useState, useEffect } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { Eye, RefreshCw, Save, Loader2 } from 'lucide-react'
// import { updateSchoolProfile } from '@/app/actions/school-settings.action'
// import { toast } from 'sonner'

// export function ProfileSection({ data, schoolId }: { data: any, schoolId: string }) {
//     const [form, setForm] = useState({
//         name: data.school.name,
//         primary: data.school.primaryColor,
//         secondary: data.school.secondaryColor
//     })
//     const [saving, setSaving] = useState(false)

//     useEffect(() => {
//         document.documentElement.style.setProperty('--school-primary', form.primary)
//         document.documentElement.style.setProperty('--school-secondary', form.secondary)
//     }, [form.primary, form.secondary])

//     const handleSave = async () => {
//         setSaving(true)
//         const res = await updateSchoolProfile(schoolId, {
//             name: form.name,
//             primaryColor: form.primary,
//             secondaryColor: form.secondary
//         })
//         if (res.success) toast.success("Branding updated")
//         setSaving(false)
//     }

//     return (
//         <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
//             <Card className="bg-slate-900 border-white/5 rounded-3xl overflow-hidden shadow-2xl">
//                 <CardHeader className="p-8 border-b border-white/5 bg-slate-900/50">
//                     <CardTitle className="text-xl font-bold text-white uppercase italic tracking-tighter">School Identity</CardTitle>
//                     <p className="text-slate-500 text-xs">Configure how your school appears to staff and students.</p>
//                 </CardHeader>
//                 <CardContent className="p-8 space-y-8">
//                     <div className="space-y-2">
//                         <Label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Official Name</Label>
//                         <Input 
//                             value={form.name}
//                             onChange={e => setForm({...form, name: e.target.value})}
//                             className="bg-slate-950 border-white/10 h-12 text-white focus:border-school-primary"
//                         />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         <div className="space-y-4">
//                             <Label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Brand Colors</Label>
//                             <div className="flex gap-4">
//                                 <div className="flex-1 space-y-2">
//                                     <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">Primary</div>
//                                     <div className="flex gap-2">
//                                         <input type="color" value={form.primary} onChange={e => setForm({...form, primary: e.target.value})} className="h-10 w-10 bg-transparent cursor-pointer rounded-lg border-none" />
//                                         <Input value={form.primary} onChange={e => setForm({...form, primary: e.target.value})} className="bg-slate-950 border-white/10 font-mono text-xs uppercase" />
//                                     </div>
//                                 </div>
//                                 <div className="flex-1 space-y-2">
//                                     <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">Secondary</div>
//                                     <div className="flex gap-2">
//                                         <input type="color" value={form.secondary} onChange={e => setForm({...form, secondary: e.target.value})} className="h-10 w-10 bg-transparent cursor-pointer rounded-lg border-none" />
//                                         <Input value={form.secondary} onChange={e => setForm({...form, secondary: e.target.value})} className="bg-slate-950 border-white/10 font-mono text-xs uppercase" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Live Preview Card */}
//                         <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
//                             <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-600 uppercase tracking-widest"><Eye className="h-3 w-3"/> Interface Preview</div>
//                             <div className="p-4 rounded-xl flex items-center justify-between" style={{ backgroundColor: form.secondary }}>
//                                 <span className="text-sm font-bold uppercase tracking-tight" style={{ color: form.primary }}>{form.name}</span>
//                                 <div className="h-8 w-8 rounded-lg flex items-center justify-center font-black" style={{ backgroundColor: form.primary, color: form.secondary }}>
//                                     {form.name.charAt(0)}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <Button 
//                         onClick={handleSave} 
//                         disabled={saving}
//                         className="w-full md:w-auto bg-school-primary text-slate-950 font-black px-10 py-6 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-school-primary/20"
//                     >
//                         {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
//                         SAVE BRANDING
//                     </Button>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }


// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import {
//     Eye, RefreshCw, Save, Loader2,
//     CheckCircle2, AlertCircle, School,
// } from 'lucide-react'
// import { updateSchoolProfile, SchoolSettingsData } from '@/app/actions/school-settings.action'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// // ── Hex validation ─────────────────────────────────────────────────────────────
// function isValidHex(color: string): boolean {
//     return /^#[0-9A-Fa-f]{6}$/.test(color)
// }

// // ── Color Field ────────────────────────────────────────────────────────────────
// function ColorField({
//     label,
//     hint,
//     value,
//     original,
//     onChange,
// }: {
//     label:    string
//     hint:     string
//     value:    string
//     original: string
//     onChange: (v: string) => void
// }) {
//     const valid = isValidHex(value)

//     return (
//         <div className="space-y-2">
//             <div className="flex items-center justify-between">
//                 <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                     {label}
//                 </p>
//                 <button
//                     onClick={() => onChange(original)}
//                     title="Reset to saved value"
//                     className="flex items-center gap-1 text-[10px] text-school-secondary-500 hover:text-white transition-colors"
//                 >
//                     <RefreshCw className="h-2.5 w-2.5" />
//                     Reset
//                 </button>
//             </div>

//             <p className="text-[11px] text-school-secondary-600">{hint}</p>

//             {/* Picker + hex input */}
//             <div className="flex items-center gap-2">
//                 <input
//                     type="color"
//                     value={valid ? value : original}
//                     onChange={e => onChange(e.target.value)}
//                     className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-school-secondary-700 bg-transparent p-0.5"
//                 />
//                 <Input
//                     value={value}
//                     onChange={e => onChange(e.target.value)}
//                     maxLength={7}
//                     placeholder="#000000"
//                     className={cn(
//                         'flex-1 font-mono text-xs bg-school-secondary-800 text-white focus:border-school-primary',
//                         valid
//                             ? 'border-school-secondary-700'
//                             : 'border-red-500/50 focus:border-red-500'
//                     )}
//                 />
//             </div>

//             {/* Swatch */}
//             <div
//                 className={cn(
//                     'h-4 w-full rounded-lg border transition-colors',
//                     valid ? 'border-school-secondary-700' : 'border-red-500/30'
//                 )}
//                 style={{ backgroundColor: valid ? value : 'transparent' }}
//             />

//             {/* Error */}
//             {!valid && (
//                 <p className="flex items-center gap-1 text-[11px] text-red-400">
//                     <AlertCircle className="h-3 w-3 shrink-0" />
//                     Enter a valid hex color (e.g. #f59e0b)
//                 </p>
//             )}
//         </div>
//     )
// }

// // ── Main Component ─────────────────────────────────────────────────────────────
// export function ProfileSection({
//     data,
//     schoolId,
// }: {
//     data:     SchoolSettingsData
//     schoolId: string
// }) {
//     const [name,      setName]      = useState(data.school.name)
//     const [primary,   setPrimary]   = useState(data.school.primaryColor)
//     const [secondary, setSecondary] = useState(data.school.secondaryColor)
//     const [saving,    setSaving]    = useState(false)
//     const [saved,     setSaved]     = useState(false)
//     const savedRef = useRef(false)

//     const primaryValid   = isValidHex(primary)
//     const secondaryValid = isValidHex(secondary)
//     const hasErrors      = !primaryValid || !secondaryValid
//     const hasChanges     =
//         name !== data.school.name ||
//         primary !== data.school.primaryColor ||
//         secondary !== data.school.secondaryColor

//     // ── Live CSS preview ───────────────────────────────────────────────────
//     useEffect(() => {
//         if (primaryValid)   document.documentElement.style.setProperty('--school-primary',   primary)
//         if (secondaryValid) document.documentElement.style.setProperty('--school-secondary', secondary)
//     }, [primary, secondary, primaryValid, secondaryValid])

//     // ── Reset CSS on unmount if unsaved ────────────────────────────────────
//     useEffect(() => {
//         return () => {
//             if (!savedRef.current) {
//                 document.documentElement.style.setProperty('--school-primary',   data.school.primaryColor)
//                 document.documentElement.style.setProperty('--school-secondary', data.school.secondaryColor)
//             }
//         }
//     }, [data.school.primaryColor, data.school.secondaryColor])

//     async function handleSave() {
//         if (hasErrors) {
//             toast.error('Fix color values before saving.')
//             return
//         }
//         setSaving(true)
//         const res = await updateSchoolProfile(schoolId, {
//             name,
//             primaryColor:   primary,
//             secondaryColor: secondary,
//         })
//         if (res.success) {
//             savedRef.current = true
//             setSaved(true)
//             setTimeout(() => setSaved(false), 3000)
//             toast.success('School profile updated.')
//         } else {
//             toast.error(res.error ?? 'Failed to update.')
//         }
//         setSaving(false)
//     }

//     return (
//         <div className="space-y-4">

//             {/* ── School Name ── */}
//             <Card className="bg-school-secondary-900 border-school-secondary-700">
//                 <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
//                     <div className="flex items-center justify-between gap-4">
//                         <div className="flex items-center gap-3">
//                             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                                 <School className="h-4 w-4 text-school-primary" />
//                             </div>
//                             <div>
//                                 <CardTitle className="text-sm font-bold text-white">
//                                     School Name
//                                 </CardTitle>
//                                 <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                     Displayed in the header and all communications
//                                 </p>
//                             </div>
//                         </div>

//                         <SaveButton
//                             saving={saving}
//                             saved={saved}
//                             disabled={hasErrors || saving}
//                             onClick={handleSave}
//                         />
//                     </div>
//                 </CardHeader>
//                 <CardContent className="p-4 sm:p-6">
//                     <div className="max-w-md space-y-1.5">
//                         <Label className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                             Official Name
//                         </Label>
//                         <Input
//                             value={name}
//                             onChange={e => setName(e.target.value)}
//                             placeholder="Enter school name"
//                             className="bg-school-secondary-800 border-school-secondary-700 text-white placeholder:text-school-secondary-600 focus:border-school-primary h-9 text-sm"
//                         />
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* ── Brand Colors ── */}
//             <Card className="bg-school-secondary-900 border-school-secondary-700">
//                 <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
//                     <div className="flex items-center justify-between gap-4">
//                         <div className="flex items-center gap-3">
//                             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                                 <Eye className="h-4 w-4 text-school-primary" />
//                             </div>
//                             <div>
//                                 <CardTitle className="text-sm font-bold text-white">
//                                     Brand Colors
//                                 </CardTitle>
//                                 <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                     Applied across the platform interface · previews live
//                                 </p>
//                             </div>
//                         </div>

//                         <SaveButton
//                             saving={saving}
//                             saved={saved}
//                             disabled={hasErrors || saving}
//                             onClick={handleSave}
//                         />
//                     </div>
//                 </CardHeader>
//                 <CardContent className="p-4 sm:p-6 space-y-5">

//                     {/* Color fields */}
//                     <div className="grid gap-5 sm:grid-cols-2">
//                         <ColorField
//                             label="Primary Color"
//                             hint="Buttons, highlights and accents"
//                             value={primary}
//                             original={data.school.primaryColor}
//                             onChange={setPrimary}
//                         />
//                         <ColorField
//                             label="Secondary Color"
//                             hint="Backgrounds and surface colors"
//                             value={secondary}
//                             original={data.school.secondaryColor}
//                             onChange={setSecondary}
//                         />
//                     </div>

//                     {/* Live preview */}
//                     <div className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-4 space-y-3">
//                         <div className="flex items-center gap-1.5">
//                             <Eye className="h-3 w-3 text-school-secondary-500" />
//                             <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                                 Live Preview
//                             </p>
//                         </div>

//                         {/* Simulated header */}
//                         <div
//                             className="rounded-lg px-4 py-3 flex items-center justify-between"
//                             style={{ backgroundColor: secondary }}
//                         >
//                             <span
//                                 className="text-sm font-bold truncate max-w-[70%]"
//                                 style={{ color: primary }}
//                             >
//                                 {name || 'School Name'}
//                             </span>
//                             <div
//                                 className="h-7 w-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-black"
//                                 style={{ backgroundColor: primary, color: secondary }}
//                             >
//                                 {(name || 'S').charAt(0).toUpperCase()}
//                             </div>
//                         </div>

//                         {/* Button samples */}
//                         <div className="flex gap-2">
//                             <div
//                                 className="flex-1 h-8 rounded-lg text-xs font-bold flex items-center justify-center"
//                                 style={{ backgroundColor: primary, color: secondary }}
//                             >
//                                 Primary
//                             </div>
//                             <div
//                                 className="flex-1 h-8 rounded-lg text-xs font-semibold flex items-center justify-center border"
//                                 style={{ color: primary, borderColor: primary }}
//                             >
//                                 Outline
//                             </div>
//                         </div>

//                         {/* Badge samples */}
//                         <div className="flex gap-2 flex-wrap">
//                             <span
//                                 className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold"
//                                 style={{ backgroundColor: `${primary}20`, color: primary }}
//                             >
//                                 Active
//                             </span>
//                             <span
//                                 className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border"
//                                 style={{ borderColor: primary, color: primary }}
//                             >
//                                 Teacher
//                             </span>
//                             <span
//                                 className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold"
//                                 style={{ backgroundColor: `${primary}15`, color: primary }}
//                             >
//                                 Admin
//                             </span>
//                         </div>
//                     </div>

//                     {/* Unsaved changes indicator */}
//                     {hasChanges && !saved && (
//                         <p className="flex items-center gap-1.5 text-[11px] text-amber-400">
//                             <AlertCircle className="h-3 w-3 shrink-0" />
//                             You have unsaved changes
//                         </p>
//                     )}
//                 </CardContent>
//             </Card>

//         </div>
//     )
// }

// // ── Save Button ────────────────────────────────────────────────────────────────
// function SaveButton({
//     saving,
//     saved,
//     disabled,
//     onClick,
// }: {
//     saving:   boolean
//     saved:    boolean
//     disabled: boolean
//     onClick:  () => void
// }) {
//     return (
//         <Button
//             onClick={onClick}
//             disabled={disabled}
//             size="sm"
//             className={cn(
//                 'h-8 px-3 text-xs font-bold shrink-0 transition-all',
//                 saved
//                     ? 'bg-green-500 hover:bg-green-600 text-white'
//                     : 'bg-school-primary hover:bg-school-primary-600 text-school-secondary-950'
//             )}
//         >
//             {saving ? (
//                 <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Saving...</>
//             ) : saved ? (
//                 <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />Saved!</>
//             ) : (
//                 <><Save className="h-3.5 w-3.5 mr-1.5" />Save</>
//             )}
//         </Button>
//     )
// }



// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import {
//     Eye, RefreshCw, Save, Loader2,
//     CheckCircle2, AlertCircle, School,
// } from 'lucide-react'
// import { updateSchoolProfile, SchoolSettingsData } from '@/app/actions/school-settings.action'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// // ── Hex validation ─────────────────────────────────────────────────────────────
// function isValidHex(color: string): boolean {
//     return /^#[0-9A-Fa-f]{6}$/.test(color)
// }

// // ── Save Button ────────────────────────────────────────────────────────────────
// function SaveButton({
//     saving,
//     saved,
//     disabled,
//     onClick,
// }: {
//     saving:   boolean
//     saved:    boolean
//     disabled: boolean
//     onClick:  () => void
// }) {
//     return (
//         <Button
//             onClick={onClick}
//             disabled={disabled}
//             size="sm"
//             className={cn(
//                 'h-8 px-4 text-xs font-bold transition-all',
//                 saved
//                     ? 'bg-green-500 hover:bg-green-600 text-white'
//                     : 'bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 disabled:opacity-40'
//             )}
//         >
//             {saving ? (
//                 <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Saving...</>
//             ) : saved ? (
//                 <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />Saved!</>
//             ) : (
//                 <><Save className="h-3.5 w-3.5 mr-1.5" />Save</>
//             )}
//         </Button>
//     )
// }

// // ── Color Field ────────────────────────────────────────────────────────────────
// function ColorField({
//     label,
//     hint,
//     value,
//     original,
//     onChange,
// }: {
//     label:    string
//     hint:     string
//     value:    string
//     original: string
//     onChange: (v: string) => void
// }) {
//     const valid = isValidHex(value)

//     return (
//         <div className="space-y-2">
//             <div className="flex items-center justify-between">
//                 <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                     {label}
//                 </p>
//                 <button
//                     onClick={() => onChange(original)}
//                     title="Reset to saved value"
//                     className="flex items-center gap-1 text-[10px] text-school-secondary-500 hover:text-white transition-colors"
//                 >
//                     <RefreshCw className="h-2.5 w-2.5" />
//                     Reset
//                 </button>
//             </div>

//             <p className="text-[11px] text-school-secondary-600">{hint}</p>

//             {/* Picker + hex input */}
//             <div className="flex items-center gap-2">
//                 <input
//                     type="color"
//                     value={valid ? value : original}
//                     onChange={e => onChange(e.target.value)}
//                     className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-school-secondary-700 bg-transparent p-0.5"
//                 />
//                 <Input
//                     value={value}
//                     onChange={e => onChange(e.target.value)}
//                     maxLength={7}
//                     placeholder="#000000"
//                     className={cn(
//                         'flex-1 font-mono text-xs bg-school-secondary-800 text-white focus:border-school-primary',
//                         valid
//                             ? 'border-school-secondary-700'
//                             : 'border-red-500/50 focus:border-red-500'
//                     )}
//                 />
//             </div>

//             {/* Swatch */}
//             <div
//                 className={cn(
//                     'h-4 w-full rounded-lg border transition-colors',
//                     valid ? 'border-school-secondary-700' : 'border-red-500/30'
//                 )}
//                 style={{ backgroundColor: valid ? value : 'transparent' }}
//             />

//             {/* Error */}
//             {!valid && (
//                 <p className="flex items-center gap-1 text-[11px] text-red-400">
//                     <AlertCircle className="h-3 w-3 shrink-0" />
//                     Enter a valid hex color (e.g. #f59e0b)
//                 </p>
//             )}
//         </div>
//     )
// }

// // ── Main Component ─────────────────────────────────────────────────────────────
// export function ProfileSection({
//     data,
//     schoolId,
// }: {
//     data:     SchoolSettingsData
//     schoolId: string
// }) {
//     const [name,      setName]      = useState(data.school.name)
//     const [primary,   setPrimary]   = useState(data.school.primaryColor)
//     const [secondary, setSecondary] = useState(data.school.secondaryColor)
//     const [saving,    setSaving]    = useState(false)
//     const [saved,     setSaved]     = useState(false)
//     const savedRef = useRef(false)

//     const primaryValid   = isValidHex(primary)
//     const secondaryValid = isValidHex(secondary)
//     const hasErrors      = !primaryValid || !secondaryValid
//     const hasChanges     =
//         name !== data.school.name ||
//         primary !== data.school.primaryColor ||
//         secondary !== data.school.secondaryColor

//     // ── Live CSS preview ───────────────────────────────────────────────────
//     useEffect(() => {
//         if (primaryValid)   document.documentElement.style.setProperty('--school-primary',   primary)
//         if (secondaryValid) document.documentElement.style.setProperty('--school-secondary', secondary)
//     }, [primary, secondary, primaryValid, secondaryValid])

//     // ── Reset CSS on unmount if unsaved ────────────────────────────────────
//     useEffect(() => {
//         return () => {
//             if (!savedRef.current) {
//                 document.documentElement.style.setProperty('--school-primary',   data.school.primaryColor)
//                 document.documentElement.style.setProperty('--school-secondary', data.school.secondaryColor)
//             }
//         }
//     }, [data.school.primaryColor, data.school.secondaryColor])

//     async function handleSave() {
//         if (hasErrors) {
//             toast.error('Fix color values before saving.')
//             return
//         }
//         setSaving(true)
//         const res = await updateSchoolProfile(schoolId, {
//             name,
//             primaryColor:   primary,
//             secondaryColor: secondary,
//         })
//         if (res.success) {
//             savedRef.current = true
//             setSaved(true)
//             setTimeout(() => setSaved(false), 3000)
//             toast.success('School profile updated.')
//         } else {
//             toast.error(res.error ?? 'Failed to update.')
//         }
//         setSaving(false)
//     }

//     return (
//         <div className="space-y-4">

//             {/* ── School Name ── */}
//             <Card className="bg-school-secondary-900 border-school-secondary-700">
//                 <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                             <School className="h-4 w-4 text-school-primary" />
//                         </div>
//                         <div>
//                             <CardTitle className="text-sm font-bold text-white">
//                                 School Name
//                             </CardTitle>
//                             <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                 Displayed in the header and all communications
//                             </p>
//                         </div>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="p-4 sm:p-6 space-y-4">
//                     <div className="max-w-md space-y-1.5">
//                         <Label className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                             Official Name
//                         </Label>
//                         <Input
//                             value={name}
//                             onChange={e => setName(e.target.value)}
//                             placeholder="Enter school name"
//                             className="bg-school-secondary-800 border-school-secondary-700 text-white placeholder:text-school-secondary-600 focus:border-school-primary h-9 text-sm"
//                         />
//                     </div>

//                     {/* Save below the input */}
//                     <div className="flex items-center justify-between pt-1 border-t border-school-secondary-700">
//                         {hasChanges && !saved && (
//                             <p className="flex items-center gap-1.5 text-[11px] text-amber-400">
//                                 <AlertCircle className="h-3 w-3 shrink-0" />
//                                 Unsaved changes
//                             </p>
//                         )}
//                         <div className="ml-auto">
//                             <SaveButton
//                                 saving={saving}
//                                 saved={saved}
//                                 disabled={hasErrors || saving || !hasChanges}
//                                 onClick={handleSave}
//                             />
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* ── Brand Colors ── */}
//             <Card className="bg-school-secondary-900 border-school-secondary-700">
//                 <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                             <Eye className="h-4 w-4 text-school-primary" />
//                         </div>
//                         <div>
//                             <CardTitle className="text-sm font-bold text-white">
//                                 Brand Colors
//                             </CardTitle>
//                             <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                 Applied across the platform interface · previews live
//                             </p>
//                         </div>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="p-4 sm:p-6 space-y-5">

//                     {/* Color fields */}
//                     <div className="grid gap-5 sm:grid-cols-2">
//                         <ColorField
//                             label="Primary Color"
//                             hint="Buttons, highlights and accents"
//                             value={primary}
//                             original={data.school.primaryColor}
//                             onChange={setPrimary}
//                         />
//                         <ColorField
//                             label="Secondary Color"
//                             hint="Backgrounds and surface colors"
//                             value={secondary}
//                             original={data.school.secondaryColor}
//                             onChange={setSecondary}
//                         />
//                     </div>

//                     {/* Live preview */}
//                     <div className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-4 space-y-3">
//                         <div className="flex items-center gap-1.5">
//                             <Eye className="h-3 w-3 text-school-secondary-500" />
//                             <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                                 Live Preview
//                             </p>
//                         </div>

//                         {/* Simulated header */}
//                         <div
//                             className="rounded-lg px-4 py-3 flex items-center justify-between"
//                             style={{ backgroundColor: secondary }}
//                         >
//                             <span
//                                 className="text-sm font-bold truncate max-w-[70%]"
//                                 style={{ color: primary }}
//                             >
//                                 {name || 'School Name'}
//                             </span>
//                             <div
//                                 className="h-7 w-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-black"
//                                 style={{ backgroundColor: primary, color: secondary }}
//                             >
//                                 {(name || 'S').charAt(0).toUpperCase()}
//                             </div>
//                         </div>

//                         {/* Button samples */}
//                         <div className="flex gap-2">
//                             <div
//                                 className="flex-1 h-8 rounded-lg text-xs font-bold flex items-center justify-center"
//                                 style={{ backgroundColor: primary, color: secondary }}
//                             >
//                                 Primary
//                             </div>
//                             <div
//                                 className="flex-1 h-8 rounded-lg text-xs font-semibold flex items-center justify-center border"
//                                 style={{ color: primary, borderColor: primary }}
//                             >
//                                 Outline
//                             </div>
//                         </div>

//                         {/* Badge samples */}
//                         <div className="flex gap-2 flex-wrap">
//                             <span
//                                 className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold"
//                                 style={{ backgroundColor: `${primary}20`, color: primary }}
//                             >
//                                 Active
//                             </span>
//                             <span
//                                 className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border"
//                                 style={{ borderColor: primary, color: primary }}
//                             >
//                                 Teacher
//                             </span>
//                             <span
//                                 className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold"
//                                 style={{ backgroundColor: `${primary}15`, color: primary }}
//                             >
//                                 Admin
//                             </span>
//                         </div>
//                     </div>

//                     {/* Save below the color fields + preview */}
//                     <div className="flex items-center justify-between pt-1 border-t border-school-secondary-700">
//                         {hasChanges && !saved && (
//                             <p className="flex items-center gap-1.5 text-[11px] text-amber-400">
//                                 <AlertCircle className="h-3 w-3 shrink-0" />
//                                 Unsaved changes
//                             </p>
//                         )}
//                         <div className="ml-auto">
//                             <SaveButton
//                                 saving={saving}
//                                 saved={saved}
//                                 disabled={hasErrors || saving || !hasChanges}
//                                 onClick={handleSave}
//                             />
//                         </div>
//                     </div>

//                 </CardContent>
//             </Card>

//         </div>
//     )
// }



// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import {
//     Eye, RefreshCw, Save, Loader2,
//     CheckCircle2, AlertCircle, School,
//     Pencil, Info,
// } from 'lucide-react'
// import { updateSchoolProfile, SchoolSettingsData } from '@/app/actions/school-settings.action'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// // ── Hex validation ─────────────────────────────────────────────────────────────
// function isValidHex(color: string): boolean {
//     return /^#[0-9A-Fa-f]{6}$/.test(color)
// }

// // ── Save Button ────────────────────────────────────────────────────────────────
// function SaveButton({
//     saving, saved, disabled, onClick,
// }: {
//     saving: boolean; saved: boolean; disabled: boolean; onClick: () => void
// }) {
//     return (
//         <Button
//             onClick={onClick}
//             disabled={disabled}
//             size="sm"
//             className={cn(
//                 'h-8 px-4 text-xs font-bold transition-all',
//                 saved
//                     ? 'bg-green-500 hover:bg-green-600 text-white'
//                     : 'bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 disabled:opacity-40'
//             )}
//         >
//             {saving ? (
//                 <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Saving...</>
//             ) : saved ? (
//                 <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />Saved!</>
//             ) : (
//                 <><Save className="h-3.5 w-3.5 mr-1.5" />Save Changes</>
//             )}
//         </Button>
//     )
// }

// // ── Editable hint ──────────────────────────────────────────────────────────────
// function EditableHint({ text }: { text: string }) {
//     return (
//         <div className="flex items-center gap-1.5 text-[10px] text-school-secondary-500">
//             <Pencil className="h-2.5 w-2.5 shrink-0" />
//             <span>{text}</span>
//         </div>
//     )
// }

// // ── Color Field ────────────────────────────────────────────────────────────────
// function ColorField({
//     label, hint, value, original, savedValue, onChange,
// }: {
//     label:      string
//     hint:       string
//     value:      string
//     original:   string
//     savedValue: string
//     onChange:   (v: string) => void
// }) {
//     const valid   = isValidHex(value)
//     // ✅ Compare against savedValue (last successfully saved), not original prop
//     const changed = value !== savedValue

//     return (
//         <div className={cn(
//             'space-y-2.5 rounded-xl border p-3 transition-all',
//             changed
//                 ? 'border-school-primary/40 bg-school-primary/5'
//                 : 'border-school-secondary-500 bg-school-secondary-800/30'
//         )}>
//             <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                     <p className="text-[10px] font-bold text-white uppercase tracking-wider">
//                         {label}
//                     </p>
//                     <p className="text-[11px] text-school-secondary-500">{hint}</p>
//                 </div>
//                 {changed && (
//                     <button
//                         onClick={() => onChange(original)}
//                         title="Reset to saved value"
//                         className="flex items-center gap-1 text-[10px] text-school-secondary-400 hover:text-amber-400 transition-colors shrink-0"
//                     >
//                         <RefreshCw className="h-2.5 w-2.5" />
//                         Reset
//                     </button>
//                 )}
//             </div>

//             {/* Picker + hex input */}
//             <div className="flex items-center gap-2">
//                 <div className="relative shrink-0">
//                     <input
//                         type="color"
//                         value={valid ? value : original}
//                         onChange={e => onChange(e.target.value)}
//                         className="h-10 w-10 cursor-pointer rounded-lg border-2 border-school-secondary-500 bg-transparent p-0.5 hover:border-school-primary transition-colors"
//                         title="Click to open color picker"
//                     />
//                     <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-school-secondary-700 border border-school-secondary-600 flex items-center justify-center">
//                         <Pencil className="h-2 w-2 text-school-secondary-400" />
//                     </div>
//                 </div>
//                 <div className="flex-1 space-y-1">
//                     <Input
//                         value={value}
//                         onChange={e => onChange(e.target.value)}
//                         maxLength={7}
//                         placeholder="#000000"
//                         className={cn(
//                             'font-mono text-xs text-white h-10 transition-all',
//                             !valid
//                                 ? 'bg-red-500/5 border-red-500/60 hover:border-red-400 focus:border-red-400'
//                                 : changed
//                                 ? 'bg-school-primary/5 border-school-primary/50 hover:border-school-primary focus:border-school-primary'
//                                 : 'bg-school-secondary-800 border-school-secondary-500 hover:border-school-secondary-300 focus:border-school-primary'
//                         )}
//                     />
//                     <p className="text-[10px] text-school-secondary-500 ml-1">
//                         Type a hex value or use the color picker
//                     </p>
//                 </div>
//             </div>

//             {/* Swatch */}
//             <div className="space-y-1">
//                 <div
//                     className={cn(
//                         'h-5 w-full rounded-lg border-2 transition-colors',
//                         valid
//                             ? changed ? 'border-school-primary/40' : 'border-school-secondary-500'
//                             : 'border-red-500/40'
//                     )}
//                     style={{ backgroundColor: valid ? value : 'transparent' }}
//                 />
//                 <p className="text-[10px] text-school-secondary-500 text-right">
//                     Color preview
//                 </p>
//             </div>

//             {/* Error */}
//             {!valid && (
//                 <p className="flex items-center gap-1 text-[11px] text-red-400">
//                     <AlertCircle className="h-3 w-3 shrink-0" />
//                     Enter a valid hex color (e.g. #f59e0b)
//                 </p>
//             )}

//             {/* Changed indicator */}
//             {changed && valid && (
//                 <p className="flex items-center gap-1 text-[11px] text-school-primary">
//                     <CheckCircle2 className="h-3 w-3 shrink-0" />
//                     Color updated — save to apply
//                 </p>
//             )}
//         </div>
//     )
// }

// // ── Main Component ─────────────────────────────────────────────────────────────
// export function ProfileSection({
//     data,
//     schoolId,
// }: {
//     data:     SchoolSettingsData
//     schoolId: string
// }) {
//     const [name,      setName]      = useState(data.school.name)
//     const [primary,   setPrimary]   = useState(data.school.primaryColor)
//     const [secondary, setSecondary] = useState(data.school.secondaryColor)
//     const [saving,    setSaving]    = useState(false)
//     const [saved,     setSaved]     = useState(false)

//     // ✅ Track the last successfully saved values separately
//     // so hasChanges resets to false immediately after a successful save
//     const [savedName,      setSavedName]      = useState(data.school.name)
//     const [savedPrimary,   setSavedPrimary]   = useState(data.school.primaryColor)
//     const [savedSecondary, setSavedSecondary] = useState(data.school.secondaryColor)

//     const savedRef = useRef(false)

//     const primaryValid   = isValidHex(primary)
//     const secondaryValid = isValidHex(secondary)
//     const hasErrors      = !primaryValid || !secondaryValid

//     // ✅ Compare against savedName/savedPrimary/savedSecondary — not data.school.*
//     const hasChanges =
//         name !== savedName ||
//         primary !== savedPrimary ||
//         secondary !== savedSecondary

//     // ── Live CSS preview ───────────────────────────────────────────────────
//     useEffect(() => {
//         if (primaryValid)   document.documentElement.style.setProperty('--school-primary',   primary)
//         if (secondaryValid) document.documentElement.style.setProperty('--school-secondary', secondary)
//     }, [primary, secondary, primaryValid, secondaryValid])

//     // ── Reset CSS on unmount if unsaved ────────────────────────────────────
//     useEffect(() => {
//         return () => {
//             if (!savedRef.current) {
//                 document.documentElement.style.setProperty('--school-primary',   data.school.primaryColor)
//                 document.documentElement.style.setProperty('--school-secondary', data.school.secondaryColor)
//             }
//         }
//     }, [data.school.primaryColor, data.school.secondaryColor])

//     async function handleSave() {
//         if (hasErrors) {
//             toast.error('Fix color values before saving.')
//             return
//         }
//         setSaving(true)
//         const res = await updateSchoolProfile(schoolId, {
//             name,
//             primaryColor:   primary,
//             secondaryColor: secondary,
//         })
//         if (res.success) {
//             savedRef.current = true
//             setSaved(true)
//             setTimeout(() => setSaved(false), 3000)

//             // ✅ Update saved baselines so hasChanges immediately becomes false
//             setSavedName(name)
//             setSavedPrimary(primary)
//             setSavedSecondary(secondary)

//             toast.success('School profile updated.')
//         } else {
//             toast.error(res.error ?? 'Failed to update.')
//         }
//         setSaving(false)
//     }

//     const nameChanged = name !== savedName

//     return (
//         <div className="space-y-4">

//             {/* ── School Name ── */}
//             <Card className="bg-school-secondary-900 border-school-secondary-700">
//                 <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                             <School className="h-4 w-4 text-school-primary" />
//                         </div>
//                         <div>
//                             <CardTitle className="text-sm font-bold text-white">
//                                 School Name
//                             </CardTitle>
//                             <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                 Displayed in the header, sidebar and all communications
//                             </p>
//                         </div>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="p-4 sm:p-6 space-y-4">

//                     {/* Instruction banner */}
//                     <div className="flex items-start gap-2 rounded-lg border border-school-secondary-700 bg-school-secondary-800/50 px-3 py-2.5">
//                         <Info className="h-3.5 w-3.5 text-school-primary shrink-0 mt-0.5" />
//                         <p className="text-[11px] text-school-secondary-400 leading-relaxed">
//                             Click the field below to edit your school name. Changes only apply after clicking{' '}
//                             <span className="text-white font-semibold">Save Changes</span>.
//                         </p>
//                     </div>

//                     {/* Name input wrapper */}
//                     <div className={cn(
//                         'space-y-1.5 rounded-xl border p-3 transition-all',
//                         nameChanged
//                             ? 'border-school-primary/40 bg-school-primary/5'
//                             : 'border-school-secondary-500 bg-school-secondary-800/30'
//                     )}>
//                         <div className="flex items-center justify-between">
//                             <Label className="text-[10px] font-bold text-white uppercase tracking-wider">
//                                 Official School Name
//                             </Label>
//                             <EditableHint text="Click to edit" />
//                         </div>
//                         <Input
//                             value={name}
//                             onChange={e => setName(e.target.value)}
//                             placeholder="e.g. Lagos Academy Secondary School"
//                             className={cn(
//                                 'text-white placeholder:text-school-secondary-600 h-10 text-sm transition-all',
//                                 nameChanged
//                                     ? 'bg-school-primary/5 border-school-primary/50 hover:border-school-primary focus:border-school-primary'
//                                     : 'bg-school-secondary-800 border-school-secondary-500 hover:border-school-secondary-300 focus:border-school-primary'
//                             )}
//                         />
//                         <p className="text-[10px] text-school-secondary-500 ml-0.5">
//                             Appears on reports, notifications and the platform header
//                         </p>
//                         {nameChanged && (
//                             <p className="flex items-center gap-1 text-[11px] text-school-primary">
//                                 <CheckCircle2 className="h-3 w-3 shrink-0" />
//                                 Name updated — save to apply
//                             </p>
//                         )}
//                     </div>

//                     {/* Save row */}
//                     <div className="flex items-center justify-between pt-1 border-t border-school-secondary-700">
//                         {hasChanges && !saved ? (
//                             <p className="flex items-center gap-1.5 text-[11px] text-amber-400">
//                                 <AlertCircle className="h-3 w-3 shrink-0" />
//                                 You have unsaved changes
//                             </p>
//                         ) : (
//                             <span />
//                         )}
//                         <SaveButton
//                             saving={saving}
//                             saved={saved}
//                             disabled={hasErrors || saving || !hasChanges}
//                             onClick={handleSave}
//                         />
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* ── Brand Colors ── */}
//             <Card className="bg-school-secondary-900 border-school-secondary-700">
//                 <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                             <Eye className="h-4 w-4 text-school-primary" />
//                         </div>
//                         <div>
//                             <CardTitle className="text-sm font-bold text-white">
//                                 Brand Colors
//                             </CardTitle>
//                             <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                 Applied across the entire platform interface
//                             </p>
//                         </div>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="p-4 sm:p-6 space-y-5">

//                     {/* Instruction banner */}
//                     <div className="flex items-start gap-2 rounded-lg border border-school-secondary-700 bg-school-secondary-800/50 px-3 py-2.5">
//                         <Info className="h-3.5 w-3.5 text-school-primary shrink-0 mt-0.5" />
//                         <p className="text-[11px] text-school-secondary-400 leading-relaxed">
//                             Click the color swatch to open a picker, or type a hex code directly.
//                             The preview updates in real time. Click{' '}
//                             <span className="text-white font-semibold">Save Changes</span> to apply.
//                         </p>
//                     </div>

//                     {/* Color fields */}
//                     <div className="grid gap-4 sm:grid-cols-2">
//                         <ColorField
//                             label="Primary Color"
//                             hint="Buttons, highlights and accents"
//                             value={primary}
//                             original={data.school.primaryColor}
//                             savedValue={savedPrimary}
//                             onChange={setPrimary}
//                         />
//                         <ColorField
//                             label="Secondary Color"
//                             hint="Backgrounds and surface colors"
//                             value={secondary}
//                             original={data.school.secondaryColor}
//                             savedValue={savedSecondary}
//                             onChange={setSecondary}
//                         />
//                     </div>

//                     {/* Live preview */}
//                     <div className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-4 space-y-3">
//                         <div className="flex items-center gap-1.5">
//                             <Eye className="h-3 w-3 text-school-secondary-500" />
//                             <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                                 Live Preview — updates as you type
//                             </p>
//                         </div>

//                         <div
//                             className="rounded-lg px-4 py-3 flex items-center justify-between"
//                             style={{ backgroundColor: secondary }}
//                         >
//                             <span
//                                 className="text-sm font-bold truncate max-w-[70%]"
//                                 style={{ color: primary }}
//                             >
//                                 {name || 'School Name'}
//                             </span>
//                             <div
//                                 className="h-7 w-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-black"
//                                 style={{ backgroundColor: primary, color: secondary }}
//                             >
//                                 {(name || 'S').charAt(0).toUpperCase()}
//                             </div>
//                         </div>

//                         <div className="flex gap-2">
//                             <div
//                                 className="flex-1 h-8 rounded-lg text-xs font-bold flex items-center justify-center"
//                                 style={{ backgroundColor: primary, color: secondary }}
//                             >
//                                 Primary Button
//                             </div>
//                             <div
//                                 className="flex-1 h-8 rounded-lg text-xs font-semibold flex items-center justify-center border"
//                                 style={{ color: primary, borderColor: primary }}
//                             >
//                                 Outline Button
//                             </div>
//                         </div>

//                         <div className="flex gap-2 flex-wrap">
//                             {['Active', 'Teacher', 'Admin'].map((label, i) => (
//                                 <span
//                                     key={label}
//                                     className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border"
//                                     style={{
//                                         backgroundColor: i === 1 ? 'transparent' : `${primary}${i === 0 ? '20' : '15'}`,
//                                         borderColor:     primary,
//                                         color:           primary,
//                                     }}
//                                 >
//                                     {label}
//                                 </span>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Save row */}
//                     <div className="flex items-center justify-between pt-1 border-t border-school-secondary-700">
//                         {hasChanges && !saved ? (
//                             <p className="flex items-center gap-1.5 text-[11px] text-amber-400">
//                                 <AlertCircle className="h-3 w-3 shrink-0" />
//                                 You have unsaved changes
//                             </p>
//                         ) : (
//                             <span />
//                         )}
//                         <SaveButton
//                             saving={saving}
//                             saved={saved}
//                             disabled={hasErrors || saving || !hasChanges}
//                             onClick={handleSave}
//                         />
//                     </div>

//                 </CardContent>
//             </Card>

//         </div>
//     )
// }


'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Eye, RefreshCw, Save, Loader2,
    CheckCircle2, AlertCircle, School,
    Pencil, Info,
} from 'lucide-react'
import { updateSchoolProfile, SchoolSettingsData } from '@/app/actions/school-settings.action'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ── Hex validation ─────────────────────────────────────────────────────────────
function isValidHex(color: string): boolean {
    return /^#[0-9A-Fa-f]{6}$/.test(color)
}

// ── Save Button ────────────────────────────────────────────────────────────────
function SaveButton({
    saving, saved, disabled, onClick,
}: {
    saving: boolean; saved: boolean; disabled: boolean; onClick: () => void
}) {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
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
    )
}

// ── Editable hint ──────────────────────────────────────────────────────────────
function EditableHint({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-1.5 text-[10px] text-school-secondary-500">
            <Pencil className="h-2.5 w-2.5 shrink-0" />
            <span>{text}</span>
        </div>
    )
}

// ── Color Field ────────────────────────────────────────────────────────────────
function ColorField({
    label, hint, value, original, savedValue, onChange,
}: {
    label:      string
    hint:       string
    value:      string
    original:   string
    savedValue: string
    onChange:   (v: string) => void
}) {
    const valid   = isValidHex(value)
    const changed = value !== savedValue

    return (
        <div className={cn(
            'space-y-2.5 rounded-xl border p-3 transition-all',
            changed
                ? 'border-school-primary/40 bg-school-primary/5'
                : 'border-school-secondary-500 bg-school-secondary-800/30'
        )}>
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider">
                        {label}
                    </p>
                    <p className="text-[11px] text-school-secondary-500">{hint}</p>
                </div>
                {changed && (
                    <button
                        onClick={() => onChange(original)}
                        title="Reset to saved value"
                        className="flex items-center gap-1 text-[10px] text-school-secondary-400 hover:text-amber-400 transition-colors shrink-0"
                    >
                        <RefreshCw className="h-2.5 w-2.5" />
                        Reset
                    </button>
                )}
            </div>

            {/* Picker + hex input */}
            <div className="flex items-center gap-2">
                <div className="relative shrink-0">
                    <input
                        type="color"
                        value={valid ? value : original}
                        onChange={e => onChange(e.target.value)}
                        className="h-10 w-10 cursor-pointer rounded-lg border-2 border-school-secondary-500 bg-transparent p-0.5 hover:border-school-primary transition-colors"
                        title="Click to open color picker"
                    />
                    <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-school-secondary-700 border border-school-secondary-600 flex items-center justify-center">
                        <Pencil className="h-2 w-2 text-school-secondary-400" />
                    </div>
                </div>
                <div className="flex-1 space-y-1">
                    <Input
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        maxLength={7}
                        placeholder="#000000"
                        className={cn(
                            'font-mono text-xs text-white h-10 transition-all',
                            !valid
                                ? 'bg-red-500/5 border-red-500/60 hover:border-red-400 focus:border-red-400'
                                : changed
                                ? 'bg-school-primary/5 border-school-primary/50 hover:border-school-primary focus:border-school-primary'
                                : 'bg-school-secondary-800 border-school-secondary-500 hover:border-school-secondary-300 focus:border-school-primary'
                        )}
                    />
                    <p className="text-[10px] text-school-secondary-500 ml-1">
                        Type a hex value or use the color picker
                    </p>
                </div>
            </div>

            {/* Swatch */}
            <div className="space-y-1">
                <div
                    className={cn(
                        'h-5 w-full rounded-lg border-2 transition-colors',
                        valid
                            ? changed ? 'border-school-primary/40' : 'border-school-secondary-500'
                            : 'border-red-500/40'
                    )}
                    style={{ backgroundColor: valid ? value : 'transparent' }}
                />
                <p className="text-[10px] text-school-secondary-500 text-right">
                    Color preview
                </p>
            </div>

            {!valid && (
                <p className="flex items-center gap-1 text-[11px] text-red-400">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    Enter a valid hex color (e.g. #f59e0b)
                </p>
            )}

            {changed && valid && (
                <p className="flex items-center gap-1 text-[11px] text-school-primary">
                    <CheckCircle2 className="h-3 w-3 shrink-0" />
                    Color updated — save to apply
                </p>
            )}
        </div>
    )
}

// ── Props ──────────────────────────────────────────────────────────────────────
interface ProfileSectionProps {
    data:     SchoolSettingsData
    schoolId: string
    onUpdate: (updated: Partial<SchoolSettingsData>) => void
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function ProfileSection({ data, schoolId, onUpdate }: ProfileSectionProps) {
    const [name,      setName]      = useState(data.school.name)
    const [primary,   setPrimary]   = useState(data.school.primaryColor)
    const [secondary, setSecondary] = useState(data.school.secondaryColor)
    const [saving,    setSaving]    = useState(false)
    const [saved,     setSaved]     = useState(false)

    const [savedName,      setSavedName]      = useState(data.school.name)
    const [savedPrimary,   setSavedPrimary]   = useState(data.school.primaryColor)
    const [savedSecondary, setSavedSecondary] = useState(data.school.secondaryColor)

    const savedRef = useRef(false)

    const primaryValid   = isValidHex(primary)
    const secondaryValid = isValidHex(secondary)
    const hasErrors      = !primaryValid || !secondaryValid

    const hasChanges =
        name !== savedName ||
        primary !== savedPrimary ||
        secondary !== savedSecondary

    // ── Live CSS preview ───────────────────────────────────────────────────
    useEffect(() => {
        if (primaryValid)   document.documentElement.style.setProperty('--school-primary',   primary)
        if (secondaryValid) document.documentElement.style.setProperty('--school-secondary', secondary)
    }, [primary, secondary, primaryValid, secondaryValid])

    // ── Reset CSS on unmount if unsaved ────────────────────────────────────
    useEffect(() => {
        return () => {
            if (!savedRef.current) {
                document.documentElement.style.setProperty('--school-primary',   data.school.primaryColor)
                document.documentElement.style.setProperty('--school-secondary', data.school.secondaryColor)
            }
        }
    }, [data.school.primaryColor, data.school.secondaryColor])

    async function handleSave() {
        if (hasErrors) {
            toast.error('Fix color values before saving.')
            return
        }
        setSaving(true)
        const res = await updateSchoolProfile(schoolId, {
            name,
            primaryColor:   primary,
            secondaryColor: secondary,
        })
        if (res.success) {
            savedRef.current = true
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)

            // ✅ Update saved baselines — hasChanges becomes false immediately
            setSavedName(name)
            setSavedPrimary(primary)
            setSavedSecondary(secondary)

            // ✅ Propagate to parent — keeps parent data in sync so other
            // tabs and components reflect the updated name and colors
            onUpdate({
                school: {
                    ...data.school,
                    name,
                    primaryColor:   primary,
                    secondaryColor: secondary,
                },
            })

            toast.success('School profile updated.')
        } else {
            toast.error(res.error ?? 'Failed to update.')
        }
        setSaving(false)
    }

    const nameChanged = name !== savedName

    return (
        <div className="space-y-4">

            {/* ── School Name ── */}
            <Card className="bg-school-secondary-900 border-school-secondary-700">
                <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
                            <School className="h-4 w-4 text-school-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-bold text-white">
                                School Name
                            </CardTitle>
                            <p className="text-[11px] text-school-secondary-400 mt-0.5">
                                Displayed in the header, sidebar and all communications
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4">

                    <div className="flex items-start gap-2 rounded-lg border border-school-secondary-700 bg-school-secondary-800/50 px-3 py-2.5">
                        <Info className="h-3.5 w-3.5 text-school-primary shrink-0 mt-0.5" />
                        <p className="text-[11px] text-school-secondary-400 leading-relaxed">
                            Click the field below to edit your school name. Changes only apply after clicking{' '}
                            <span className="text-white font-semibold">Save Changes</span>.
                        </p>
                    </div>

                    <div className={cn(
                        'space-y-1.5 rounded-xl border p-3 transition-all',
                        nameChanged
                            ? 'border-school-primary/40 bg-school-primary/5'
                            : 'border-school-secondary-500 bg-school-secondary-800/30'
                    )}>
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-bold text-white uppercase tracking-wider">
                                Official School Name
                            </Label>
                            <EditableHint text="Click to edit" />
                        </div>
                        <Input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Lagos Academy Secondary School"
                            className={cn(
                                'text-white placeholder:text-school-secondary-600 h-10 text-sm transition-all',
                                nameChanged
                                    ? 'bg-school-primary/5 border-school-primary/50 hover:border-school-primary focus:border-school-primary'
                                    : 'bg-school-secondary-800 border-school-secondary-500 hover:border-school-secondary-300 focus:border-school-primary'
                            )}
                        />
                        <p className="text-[10px] text-school-secondary-500 ml-0.5">
                            Appears on reports, notifications and the platform header
                        </p>
                        {nameChanged && (
                            <p className="flex items-center gap-1 text-[11px] text-school-primary">
                                <CheckCircle2 className="h-3 w-3 shrink-0" />
                                Name updated — save to apply
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-school-secondary-700">
                        {hasChanges && !saved ? (
                            <p className="flex items-center gap-1.5 text-[11px] text-amber-400">
                                <AlertCircle className="h-3 w-3 shrink-0" />
                                You have unsaved changes
                            </p>
                        ) : (
                            <span />
                        )}
                        <SaveButton
                            saving={saving}
                            saved={saved}
                            disabled={hasErrors || saving || !hasChanges}
                            onClick={handleSave}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* ── Brand Colors ── */}
            <Card className="bg-school-secondary-900 border-school-secondary-700">
                <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
                            <Eye className="h-4 w-4 text-school-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-bold text-white">
                                Brand Colors
                            </CardTitle>
                            <p className="text-[11px] text-school-secondary-400 mt-0.5">
                                Applied across the entire platform interface
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-5">

                    <div className="flex items-start gap-2 rounded-lg border border-school-secondary-700 bg-school-secondary-800/50 px-3 py-2.5">
                        <Info className="h-3.5 w-3.5 text-school-primary shrink-0 mt-0.5" />
                        <p className="text-[11px] text-school-secondary-400 leading-relaxed">
                            Click the color swatch to open a picker, or type a hex code directly.
                            The preview updates in real time. Click{' '}
                            <span className="text-white font-semibold">Save Changes</span> to apply.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <ColorField
                            label="Primary Color"
                            hint="Buttons, highlights and accents"
                            value={primary}
                            original={data.school.primaryColor}
                            savedValue={savedPrimary}
                            onChange={setPrimary}
                        />
                        <ColorField
                            label="Secondary Color"
                            hint="Backgrounds and surface colors"
                            value={secondary}
                            original={data.school.secondaryColor}
                            savedValue={savedSecondary}
                            onChange={setSecondary}
                        />
                    </div>

                    {/* Live preview */}
                    <div className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-4 space-y-3">
                        <div className="flex items-center gap-1.5">
                            <Eye className="h-3 w-3 text-school-secondary-500" />
                            <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
                                Live Preview — updates as you type
                            </p>
                        </div>

                        <div
                            className="rounded-lg px-4 py-3 flex items-center justify-between"
                            style={{ backgroundColor: secondary }}
                        >
                            <span
                                className="text-sm font-bold truncate max-w-[70%]"
                                style={{ color: primary }}
                            >
                                {name || 'School Name'}
                            </span>
                            <div
                                className="h-7 w-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-black"
                                style={{ backgroundColor: primary, color: secondary }}
                            >
                                {(name || 'S').charAt(0).toUpperCase()}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div
                                className="flex-1 h-8 rounded-lg text-xs font-bold flex items-center justify-center"
                                style={{ backgroundColor: primary, color: secondary }}
                            >
                                Primary Button
                            </div>
                            <div
                                className="flex-1 h-8 rounded-lg text-xs font-semibold flex items-center justify-center border"
                                style={{ color: primary, borderColor: primary }}
                            >
                                Outline Button
                            </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {['Active', 'Teacher', 'Admin'].map((label, i) => (
                                <span
                                    key={label}
                                    className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                                    style={{
                                        backgroundColor: i === 1 ? 'transparent' : `${primary}${i === 0 ? '20' : '15'}`,
                                        borderColor:     primary,
                                        color:           primary,
                                    }}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-school-secondary-700">
                        {hasChanges && !saved ? (
                            <p className="flex items-center gap-1.5 text-[11px] text-amber-400">
                                <AlertCircle className="h-3 w-3 shrink-0" />
                                You have unsaved changes
                            </p>
                        ) : (
                            <span />
                        )}
                        <SaveButton
                            saving={saving}
                            saved={saved}
                            disabled={hasErrors || saving || !hasChanges}
                            onClick={handleSave}
                        />
                    </div>

                </CardContent>
            </Card>

        </div>
    )
}