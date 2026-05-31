// 'use client';

// import { useState, useEffect } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { completeOnboarding, getCurricula } from '@/app/actions/onboarding';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toTitleCase } from '@/lib/utils/formatters'
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { toast } from 'sonner';
// import {
//     ArrowLeft,
//     ArrowRight,
//     School,
//     Globe,
//     Clock,
//     Palette,
//     Loader2,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// const TIMEZONES = [
//     'Africa/Lagos', 'Africa/Nairobi', 'Africa/Johannesburg',
//     'Africa/Accra', 'Africa/Cairo', 'Europe/London',
//     'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Dubai',
// ];

// const COUNTRIES = [
//     'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Ethiopia',
//     'United Kingdom', 'United States', 'Canada', 'UAE', 'India',
// ];

// const COLOR_PRESETS = [
//     { primary: '#f59e0b', secondary: '#1e293b', label: 'Amber' },
//     { primary: '#3b82f6', secondary: '#0f172a', label: 'Blue' },
//     { primary: '#10b981', secondary: '#064e3b', label: 'Emerald' },
//     { primary: '#8b5cf6', secondary: '#1e1b4b', label: 'Violet' },
//     { primary: '#ef4444', secondary: '#1c0707', label: 'Red' },
//     { primary: '#f97316', secondary: '#1c0a00', label: 'Orange' },
// ];

// export function SchoolStep() {
//     const {
//         prevStep,
//         adminData,
//         paymentData,
//         schoolData,
//         setSchoolData,
//         setLoading,
//         setError,
//         setProvisioned,
//         isLoading,
//         error,
//         setConfirmedEmail,
//         reset,
//     } = useOnboardingStore();

//     const [curricula, setCurricula] = useState<{ id: string | number; name: string }[]>([]);

//     const [form, setForm] = useState({
//         schoolName: schoolData?.schoolName ?? '',
//         curriculumId: schoolData?.curriculumId ?? '',
//         primaryColor: schoolData?.primaryColor ?? '#f59e0b',
//         secondaryColor: schoolData?.secondaryColor ?? '#1e293b',
//         country: schoolData?.country ?? 'Nigeria',
//         timezone: schoolData?.timezone ?? 'Africa/Lagos',
//     });

//     useEffect(() => {
//         let isMounted = true;
//         getCurricula().then((res) => {
//             if (res.success && isMounted) {
//                 setCurricula(res.data);
//             }
//         });
//         return () => { isMounted = false; };
//     }, []);

//     async function handleSubmit(e: React.FormEvent) {
//         e.preventDefault()
    
//         if (!adminData || !paymentData || !adminData.password) {
//             setError('Missing required account data. Please go back to step 1.')
//             return
//         }
    
//         setError(null)
//         setLoading(true)
    
//         const validAdminData = {
//             name: toTitleCase(adminData.name),   // ← normalize admin name too
//             email: adminData.email,
//             password: adminData.password,
//             phone: adminData.phone || '',
//         }
    
//         // Normalize school name before sending
//         const normalizedForm = {
//             ...form,
//             schoolName: toTitleCase(form.schoolName),
//         }
    
//         const result = await completeOnboarding(
//             validAdminData,
//             normalizedForm,           // ← use normalized form
//             paymentData.reference,
//             paymentData.plan ?? 'starter'
//         )
    
//         setLoading(false)
//         if (!result.success) {
//             setError(result.error ?? 'Failed to create workspace. Please try again.')
//             toast.error(result.error)
//             return
//         }
    
//         setSchoolData(normalizedForm) // ← save normalized form to store
//         setConfirmedEmail(adminData.email)
//         reset()
//         setProvisioned(true)
//         toast.success('School workspace created! Check your email to confirm.')
//     }

//     return (
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="mb-8 text-center">
//                 <h1 className="text-3xl font-black text-school-secondary-100 tracking-tight">
//                     Set up your school
//                 </h1>
//                 <p className="text-school-secondary-100/50 mt-2 text-sm">
//                     {"This creates your school's private workspace."}
//                 </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//                 {/* School Name */}
//                 <div className="space-y-1.5">
//                     <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
//                         School Name
//                     </Label>
//                     <div className="relative">
//                         <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30" />
//                         <Input
//                             value={form.schoolName}
//                             onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
//                             onBlur={(e) => setForm({ ...form, schoolName: toTitleCase(e.target.value) })}
//                             placeholder="Lagos Academy"
//                             required
//                             className="pl-10 bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-100/30 focus:border-school-primary"
//                         />
//                     </div>
//                 </div>

//                 {/* Curriculum Dropdown - FIXED */}
//                 <div className="space-y-1.5">
//                     <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
//                         Curriculum
//                     </Label>
//                     <Select
//                         // Fix: Using undefined ensures the placeholder is visible if empty
//                         value={form.curriculumId ? String(form.curriculumId) : undefined}
//                         onValueChange={(v) => setForm({ ...form, curriculumId: v })}
//                         required
//                     >
//                         <SelectTrigger className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
//                             <SelectValue placeholder="Select a curriculum..." />
//                         </SelectTrigger>
//                         <SelectContent className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
//                             {curricula.length === 0 ? (
//                                 <SelectItem value="loading" disabled>
//                                     Loading curricula...
//                                 </SelectItem>
//                             ) : (
//                                 curricula.map((c) => (
//                                     // Fix: Ensure value is always a string
//                                     <SelectItem key={String(c.id)} value={String(c.id)}>
//                                         {c.name}
//                                     </SelectItem>
//                                 ))
//                             )}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                     {/* Country Dropdown */}
//                     <div className="space-y-1.5">
//                         <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
//                             Country
//                         </Label>
//                         <div className="relative">
//                             <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30 z-10" />
//                             <Select
//                                 value={form.country}
//                                 onValueChange={(v) => setForm({ ...form, country: v })}
//                             >
//                                 <SelectTrigger className="pl-9 bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
//                                     <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
//                                     {COUNTRIES.map((c) => (
//                                         <SelectItem key={c} value={c}>{c}</SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>

//                     {/* Timezone Dropdown */}
//                     <div className="space-y-1.5">
//                         <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
//                             Timezone
//                         </Label>
//                         <div className="relative">
//                             <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30 z-10" />
//                             <Select
//                                 value={form.timezone}
//                                 onValueChange={(v) => setForm({ ...form, timezone: v })}
//                             >
//                                 <SelectTrigger className="pl-9 bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
//                                     <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
//                                     {TIMEZONES.map((tz) => (
//                                         <SelectItem key={tz} value={tz}>{tz}</SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Color Theme Selection */}
//                 <div className="space-y-2">
//                     <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
//                         <Palette className="h-3.5 w-3.5" /> Brand Colors
//                     </Label>

//                     <div className="flex gap-2 flex-wrap">
//                         {COLOR_PRESETS.map((preset) => (
//                             <button
//                                 key={preset.label}
//                                 type="button"
//                                 onClick={() => setForm({
//                                     ...form,
//                                     primaryColor: preset.primary,
//                                     secondaryColor: preset.secondary,
//                                 })}
//                                 className={cn(
//                                     'h-8 w-8 rounded-full border-2 transition-all duration-200 hover:scale-110',
//                                     form.primaryColor === preset.primary
//                                         ? 'border-white scale-110'
//                                         : 'border-transparent'
//                                 )}
//                                 style={{ background: preset.primary }}
//                                 title={preset.label}
//                             />
//                         ))}
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                         <div className="space-y-1">
//                             <p className="text-[10px] text-school-secondary-100 uppercase tracking-wider">Primary</p>
//                             <div className="flex items-center gap-2 bg-school-secondary-800 border border-school-secondary-700 rounded-lg p-2">
//                                 <input
//                                     type="color"
//                                     value={form.primaryColor}
//                                     onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
//                                     className="h-7 w-7 rounded cursor-pointer border-0 bg-transparent"
//                                 />
//                                 <span className="text-xs text-school-secondary-100/60 font-mono">{form.primaryColor}</span>
//                             </div>
//                         </div>
//                         <div className="space-y-1">
//                             <p className="text-[10px] text-school-secondary-100 uppercase tracking-wider">Secondary</p>
//                             <div className="flex items-center gap-2 bg-school-secondary-800 border border-school-secondary-700 rounded-lg p-2">
//                                 <input
//                                     type="color"
//                                     value={form.secondaryColor}
//                                     onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
//                                     className="h-7 w-7 rounded cursor-pointer border-0 bg-transparent"
//                                 />
//                                 <span className="text-xs text-school-secondary-100/60 font-mono">{form.secondaryColor}</span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Brand Preview Card */}
//                     <div
//                         className="rounded-xl p-4 flex items-center justify-between transition-all duration-300"
//                         style={{ background: form.secondaryColor }}
//                     >
//                         <div>
//                             <p className="text-xs font-bold" style={{ color: form.primaryColor }}>
//                                 {form.schoolName || 'Your School'}
//                             </p>
//                             <p className="text-[10px] opacity-50 text-white">Brand preview</p>
//                         </div>
//                         <div
//                             className="h-8 px-3 rounded-lg text-xs font-bold flex items-center transition-all duration-300"
//                             style={{ background: form.primaryColor, color: form.secondaryColor }}
//                         >
//                             Button
//                         </div>
//                     </div>
//                 </div>

//                 {error && (
//                     <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
//                         {error}
//                     </div>
//                 )}

//                 {/* Footer Buttons */}
//                 <div className="flex gap-3 pt-2">
//                     <Button
//                         type="button"
//                         variant="outline"
//                         onClick={prevStep}
//                         disabled={isLoading}
//                         className="border-school-secondary-700 text-school-secondary-100/60 hover:text-school-secondary-100 hover:bg-school-secondary-800"
//                     >
//                         <ArrowLeft className="h-4 w-4" />
//                     </Button>

//                     <Button
//                         type="submit"
//                         disabled={isLoading || !form.schoolName || !form.curriculumId}
//                         className="flex-1 bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold h-11 transition-all duration-200 hover:scale-[1.01]"
//                     >
//                         {isLoading ? (
//                             <span className="flex items-center gap-2">
//                                 <Loader2 className="h-4 w-4 animate-spin" />
//                                 Creating workspace...
//                             </span>
//                         ) : (
//                             <span className="flex items-center gap-2">
//                                 Launch My School
//                                 <ArrowRight className="h-4 w-4" />
//                             </span>
//                         )}
//                     </Button>
//                 </div>

//                 <p className="text-center text-[10px] text-school-secondary-100/20">
//                     By continuing, you agree to our Terms of Service and Privacy Policy.
//                 </p>
//             </form>
//         </div>
//     );
// }





// 'use client';

// import { useState, useTransition } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { completeOnboarding } from '@/app/actions/onboarding';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toTitleCase } from '@/lib/utils/formatters'
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { toast } from 'sonner';
// import {
//     ArrowLeft,
//     ArrowRight,
//     School,
//     Globe,
//     Clock,
//     Palette,
//     Loader2,
//     ShieldCheck,
//     Zap
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { Role } from '@prisma/client';

// // ── Configuration ───────────────────────────────────────────────────────────

// const TIMEZONES = [
//     'Africa/Lagos', 'Africa/Nairobi', 'Africa/Johannesburg',
//     'Africa/Accra', 'Africa/Cairo', 'Europe/London',
//     'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Dubai',
// ];

// const COUNTRIES = [
//     'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Ethiopia',
//     'United Kingdom', 'United States', 'Canada', 'UAE', 'India',
// ];

// const COLOR_PRESETS = [
//     { primary: '#f59e0b', secondary: '#1e293b', label: 'Amber' },
//     { primary: '#3b82f6', secondary: '#0f172a', label: 'Blue' },
//     { primary: '#10b981', secondary: '#064e3b', label: 'Emerald' },
//     { primary: '#8b5cf6', secondary: '#1e1b4b', label: 'Violet' },
//     { primary: '#ef4444', secondary: '#1c0707', label: 'Red' },
//     { primary: '#f97316', secondary: '#1c0a00', label: 'Orange' },
// ];

// /**
//  * ONBOARDING PHASE 03: INSTITUTIONAL SYNC
//  * Rule 17: Pulls curricula directly from the Store (Rule 12 server-hydrated).
//  * Rule 11: Finalizes the creation of the Institutional Registry Node.
//  */
// export function SchoolStep() {
//     const {
//         prevStep,
//         adminData,
//         paymentData,
//         schoolData,
//         curricula, // Rule 17: Accessing Tier-1 templates from store
//         setSchoolData,
//         setLoading,
//         setError,
//         setProvisioned,
//         isLoading,
//         error,
//         setConfirmedEmail,
//         reset,
//     } = useOnboardingStore();

//     const [form, setForm] = useState({
//         schoolName: schoolData?.schoolName ?? '',
//         curriculumId: schoolData?.curriculumId ?? '',
//         primaryColor: schoolData?.primaryColor ?? '#f59e0b',
//         secondaryColor: schoolData?.secondaryColor ?? '#1e293b',
//         country: schoolData?.country ?? 'Nigeria',
//         timezone: schoolData?.timezone ?? 'Africa/Lagos',
//     });

//     const primaryColor = form.primaryColor;

//     async function handleSubmit(e: React.FormEvent) {
//         e.preventDefault()
    
//         if (!adminData || !paymentData || !adminData.password) {
//             setError('Registry Context Failure: Identity node missing.')
//             return
//         }
    
//         setError(null)
//         setLoading(true)
    
//         const normalizedForm = {
//             ...form,
//             schoolName: toTitleCase(form.schoolName),
//         }
    
//         try {
//             // Rule 11: Final Transactional Synchronization
//             const result = await completeOnboarding(
//                 {
//                     ...adminData,
//                     name: toTitleCase(adminData.name),
//                     password: adminData.password
//                 },
//                 normalizedForm,
//                 paymentData.reference,
//                 paymentData.plan ?? 'starter'
//             );
    
//             if (!result.success) {
//                 setError(result.error ?? 'Workspace initialization failed.');
//                 return;
//             }
    
//             setSchoolData(normalizedForm);
//             setConfirmedEmail(adminData.email);
//             setProvisioned(true);
//             toast.success('Institutional Registry Created.');
//             reset(); // Clear onboarding buffer
//         } catch (err) {
//             setError("Critical sync failure.");
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
            
//             {/* ── HEADER ── */}
//             <div className="text-center space-y-2">
//                 <div className="flex justify-center mb-4">
//                     <div className="h-12 w-12 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
//                         <School className="h-6 w-6 text-school-primary" style={{ color: primaryColor }} />
//                     </div>
//                 </div>
//                 <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
//                     Institutional Sync
//                 </h1>
//                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
//                     Finalize your private workspace nodes
//                 </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
                
//                 {/* SCHOOL IDENTITY */}
//                 <div className="space-y-3">
//                     <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Official School Identity</Label>
//                     <div className="relative group">
//                         <School className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
//                         <Input
//                             value={form.schoolName}
//                             onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
//                             onBlur={(e) => setForm({ ...form, schoolName: toTitleCase(e.target.value) })}
//                             placeholder="e.g. LAGOS ACADEMY"
//                             required
//                             className="pl-12 bg-slate-900 border-white/5 text-white font-black uppercase italic text-sm rounded-2xl h-14 focus:border-school-primary"
//                         />
//                     </div>
//                 </div>

//                 {/* CURRICULUM NODES */}
//                 <div className="space-y-3">
//                     <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Academic Core Blueprint</Label>
//                     <Select
//                         value={form.curriculumId ? String(form.curriculumId) : undefined}
//                         onValueChange={(v) => setForm({ ...form, curriculumId: v })}
//                         required
//                     >
//                         <SelectTrigger className="bg-slate-900 border-white/5 text-white font-black uppercase h-14 rounded-2xl">
//                             <SelectValue placeholder="Select Global Template..." />
//                         </SelectTrigger>
//                         <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl shadow-2xl">
//                             {curricula.map((c) => (
//                                 <SelectItem key={c.id} value={c.id} className="text-[10px] font-black uppercase tracking-widest">
//                                     {c.name}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* GEOGRAPHIC NODES */}
//                 <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-3">
//                         <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Country</Label>
//                         <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })}>
//                             <SelectTrigger className="bg-slate-900 border-white/5 text-white font-black uppercase h-14 rounded-2xl">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-slate-900 border-white/10 text-white">
//                                 {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="space-y-3">
//                         <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Timezone</Label>
//                         <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })}>
//                             <SelectTrigger className="bg-slate-900 border-white/5 text-white font-black uppercase h-14 rounded-2xl">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-slate-900 border-white/10 text-white">
//                                 {TIMEZONES.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>

//                 {/* BRANDING PROTOCOL */}
//                 <div className="space-y-4 pt-4 border-t border-white/5">
//                     <div className="flex items-center gap-3">
//                         <Palette className="h-4 w-4 text-slate-500" />
//                         <Label className="text-[10px] font-black text-white uppercase tracking-widest">Interface Branding</Label>
//                     </div>

//                     <div className="flex gap-3 flex-wrap">
//                         {COLOR_PRESETS.map((preset) => (
//                             <button
//                                 key={preset.label}
//                                 type="button"
//                                 onClick={() => setForm({ ...form, primaryColor: preset.primary, secondaryColor: preset.secondary })}
//                                 className={cn(
//                                     'h-10 w-10 rounded-xl border-2 transition-all duration-300 hover:scale-110 shadow-xl',
//                                     form.primaryColor === preset.primary ? 'border-white' : 'border-transparent'
//                                 )}
//                                 style={{ background: preset.primary }}
//                             />
//                         ))}
//                     </div>

//                     {/* Registry Node Preview */}
//                     <div
//                         className="rounded-2xl p-6 flex items-center justify-between shadow-inner border border-white/5"
//                         style={{ background: form.secondaryColor }}
//                     >
//                         <div className="space-y-1">
//                             <p className="text-sm font-black uppercase italic tracking-tight" style={{ color: form.primaryColor }}>
//                                 {form.schoolName || 'REGISTRY_NODE'}
//                             </p>
//                             <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Protocol Preview</p>
//                         </div>
//                         <div
//                             className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center shadow-lg"
//                             style={{ background: form.primaryColor, color: form.secondaryColor }}
//                         >
//                             Sync Hub
//                         </div>
//                     </div>
//                 </div>

//                 {error && (
//                     <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase italic animate-in shake">
//                         Initialization Error: {error}
//                     </div>
//                 )}

//                 {/* ACTIONS */}
//                 <div className="flex gap-4 pt-6">
//                     <Button variant="outline" onClick={prevStep} disabled={isLoading} className="h-16 px-8 rounded-2xl border-white/5 bg-slate-900 text-slate-500 transition-all hover:text-white"><ArrowLeft className="h-5 w-5" /></Button>

//                     <Button
//                         type="submit"
//                         disabled={isLoading || !form.schoolName || !form.curriculumId}
//                         className="flex-1 text-slate-950 font-black h-16 rounded-2xl shadow-xl uppercase text-[11px] tracking-[0.2em] group transition-all active:scale-95"
//                         style={{ backgroundColor: primaryColor }}
//                     >
//                         {isLoading ? (
//                             <Loader2 className="h-5 w-5 animate-spin" />
//                         ) : (
//                             <span className="flex items-center gap-3">
//                                 Initialize Institutional Hub
//                                 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                             </span>
//                         )}
//                     </Button>
//                 </div>
//             </form>
//         </div>
//     );
// }

// 'use client';

// import React, { useState, useTransition } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { completeOnboarding } from '@/app/actions/onboarding';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toTitleCase } from '@/lib/utils/formatters'
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { toast } from 'sonner';
// import {
//     ArrowLeft,
//     ArrowRight,
//     School,
//     Palette,
//     Loader2,
//     ShieldCheck
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { Role } from '@prisma/client';

// // ── Configuration ───────────────────────────────────────────────────────────

// const TIMEZONES = [
//     'Africa/Lagos', 'Africa/Nairobi', 'Africa/Johannesburg',
//     'Africa/Accra', 'Africa/Cairo', 'Europe/London',
//     'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Dubai',
// ];

// const COUNTRIES = [
//     'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Ethiopia',
//     'United Kingdom', 'United States', 'Canada', 'UAE', 'India',
// ];

// // ✅ RESOLVED TS2322: Standardized property names to ensure strict string typing
// const COLOR_PRESETS = [
//     { primary: '#f59e0b', secondary: '#1e293b', label: 'Amber' },
//     { primary: '#3b82f6', secondary: '#0f172a', label: 'Blue' },
//     { primary: '#10b981', secondary: '#064e3b', label: 'Emerald' },
//     { primary: '#8b5cf6', secondary: '#1e1b4b', label: 'Violet' },
//     { primary: '#ef4444', secondary: '#1c0707', label: 'Red' },
//     { primary: '#f97316', secondary: '#1c0a00', label: 'Orange' },
// ];

// /**
//  * ONBOARDING PHASE 03: INSTITUTIONAL HUB SYNC
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry (rounded-xl, rounded-2xl).
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function SchoolStep() {
//     const {
//         prevStep,
//         adminData,
//         paymentData,
//         schoolData,
//         curricula,
//         setSchoolData,
//         setLoading,
//         setError,
//         setProvisioned,
//         isLoading,
//         error,
//         setConfirmedEmail,
//         reset,
//     } = useOnboardingStore();

//     const [form, setForm] = useState({
//         schoolName: schoolData?.schoolName ?? '',
//         curriculumId: schoolData?.curriculumId ?? '',
//         primaryColor: schoolData?.primaryColor ?? '#f59e0b',
//         secondaryColor: schoolData?.secondaryColor ?? '#1e293b',
//         country: schoolData?.country ?? 'Nigeria',
//         timezone: schoolData?.timezone ?? 'Africa/Lagos',
//     });

//     async function handleSubmit(e: React.FormEvent) {
//         e.preventDefault()
    
//         if (!adminData || !paymentData || !adminData.password) {
//             console.log('❌ Missing context:', { adminData, paymentData });
//             setError('Registry Context Failure: Identity profile missing.');
//             return;
//         }
    
//         setError(null)
//         setLoading(true)
    
//         const normalizedForm = {
//             ...form,
//             schoolName: toTitleCase(form.schoolName),
//         }
    
//         try {
//             const result = await completeOnboarding(
//                 {
//                     ...adminData,
//                     name: toTitleCase(adminData.name),
//                     password: adminData.password
//                 },
//                 normalizedForm,
//                 paymentData.reference,
//                 paymentData.plan ?? 'starter'
//             );
    
//             if (!result.success) {
//                 setError(result.error ?? 'Workspace initialization failed.');
//                 return;
//             }
    
            // setSchoolData(normalizedForm);
            // setConfirmedEmail(adminData.email);
            // setProvisioned(true);
//             toast.success('Institutional Hub Initialized.');
//             // reset(); 
//         } catch (err) {
//             setError("Critical synchronization failure.");
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-10">
            
//             {/* ── HEADER ── */}
//             <div className="text-center space-y-3">
//                 <div className="flex justify-center mb-4">
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center shadow-lg">
//                         <School className="h-7 w-7 text-school-primary" />
//                     </div>
//                 </div>
//                 <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     Institutional Hub
//                 </h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70">
//                     Finalize your private workspace architecture
//                 </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-8">
                
//                 {/* ── SCHOOL IDENTITY ── */}
//                 <div className="space-y-3 group">
//                     <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
//                         Official Institutional Identity
//                     </Label>
//                     <div className="relative">
//                         <School className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
//                         <Input
//                             value={form.schoolName}
//                             onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
//                             onBlur={(e) => setForm({ ...form, schoolName: toTitleCase(e.target.value) })}
//                             placeholder="e.g. LAGOS ACADEMY"
//                             required
//                             className={cn(
//                                 "pl-12 bg-surface border-border text-foreground font-extrabold uppercase italic text-sm rounded-xl h-14 transition-all",
//                                 "focus-visible:ring-2 focus-visible:ring-school-primary-200 focus-visible:border-school-primary"
//                             )}
//                         />
//                     </div>
//                 </div>

//                 {/* ── CURRICULUM HUB ── */}
//                 <div className="space-y-3 group">
//                     <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
//                         Academic Core Blueprint
//                     </Label>
//                     <Select
//                         value={form.curriculumId ? String(form.curriculumId) : undefined}
//                         onValueChange={(v) => setForm({ ...form, curriculumId: v })}
//                         required
//                     >
//                         <SelectTrigger className="bg-surface border-border text-foreground font-bold uppercase h-14 rounded-xl focus:ring-2 focus:ring-school-primary-200">
//                             <SelectValue placeholder="Select Global Template..." />
//                         </SelectTrigger>
//                         <SelectContent className="bg-card border-border text-foreground rounded-xl shadow-2xl">
//                             {curricula.map((c) => (
//                                 <SelectItem key={c.id} value={c.id} className="text-[10px] font-bold uppercase tracking-widest">
//                                     {c.name}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* ── GEOGRAPHIC REGISTRY ── */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-3">
//                         <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Country</Label>
//                         <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })}>
//                             <SelectTrigger className="bg-surface border-border text-foreground font-bold uppercase h-14 rounded-xl">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-card border-border">
//                                 {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="space-y-3">
//                         <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Timeline Hub</Label>
//                         <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })}>
//                             <SelectTrigger className="bg-surface border-border text-foreground font-bold uppercase h-14 rounded-xl">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-card border-border">
//                                 {TIMEZONES.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>

//                 {/* ── BRANDING PROTOCOL (Rule 21) ── */}
//                 <div className="space-y-6 pt-6 border-t border-border">
//                     <div className="flex items-center gap-3">
//                         <Palette className="h-4 w-4 text-school-primary" />
//                         <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">Branding Protocol</Label>
//                     </div>

//                     <div className="flex gap-4 flex-wrap">
//                         {COLOR_PRESETS.map((preset) => (
//                             <button
//                                 key={preset.label}
//                                 type="button"
//                                 // ✅ RESOLVED TS2322: preset.secondary is now guaranteed string
//                                 onClick={() => setForm({ ...form, primaryColor: preset.primary, secondaryColor: preset.secondary })}
//                                 className={cn(
//                                     'h-11 w-11 rounded-xl border-4 transition-all duration-300 hover:scale-110 shadow-lg',
//                                     form.primaryColor === preset.primary ? 'border-foreground' : 'border-transparent'
//                                 )}
//                                 style={{ background: preset.primary }}
//                                 title={preset.label}
//                             />
//                         ))}
//                     </div>

//                     {/* Registry Hub Preview */}
//                     <div className="rounded-2xl p-6 flex items-center justify-between shadow-inner border border-border bg-surface">
//                         <div className="space-y-1">
//                             <p className="text-sm font-extrabold uppercase italic tracking-tight" style={{ color: form.primaryColor }}>
//                                 {form.schoolName || 'REGISTRY_HUB_ID'}
//                             </p>
//                             <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Institutional Preview</p>
//                         </div>
//                         <div
//                             className="h-10 px-5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest flex items-center shadow-lg shadow-black/10"
//                             style={{ background: form.primaryColor, color: '#fff' }}
//                         >
//                             Sync Hub
//                         </div>
//                     </div>
//                 </div>

//                 {/* ── ACTIONS ── */}
//                 <div className="flex gap-4 pt-6">
//                     <Button 
//                         variant="outline" 
//                         type="button" 
//                         onClick={prevStep} 
//                         disabled={isLoading} 
//                         className="h-16 px-8 rounded-xl border-border bg-surface text-muted-foreground transition-all hover:bg-background"
//                     >
//                         <ArrowLeft className="h-5 w-5" />
//                     </Button>

//                     <Button
//                         type="submit"
//                         disabled={isLoading || !form.schoolName || !form.curriculumId}
//                         className={cn(
//                             "flex-1 h-16 rounded-xl shadow-xl transition-all active:scale-95 group",
//                             "bg-school-primary text-on-school-primary font-extrabold text-[11px] uppercase tracking-widest",
//                             "hover:brightness-110 shadow-school-primary-200 disabled:opacity-30"
//                         )}
//                     >
//                         {isLoading ? (
//                             <Loader2 className="h-5 w-5 animate-spin" />
//                         ) : (
//                             <span className="flex items-center gap-3">
//                                 Initialize Institutional Hub
//                                 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                             </span>
//                         )}
//                     </Button>
//                 </div>
//             </form>
//         </div>
//     );
// }


// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { completeOnboarding } from '@/app/actions/onboarding';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toTitleCase } from '@/lib/utils/formatters';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { toast } from 'sonner';
// import {
//     ArrowLeft,
//     ArrowRight,
//     School,
//     Palette,
//     Loader2,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// // ── Configuration ────────────────────────────────────────────────────────────

// const TIMEZONES = [
//     'Africa/Lagos', 'Africa/Nairobi', 'Africa/Johannesburg',
//     'Africa/Accra', 'Africa/Cairo', 'Europe/London',
//     'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Dubai',
// ];

// const COUNTRIES = [
//     'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Ethiopia',
//     'United Kingdom', 'United States', 'Canada', 'UAE', 'India',
// ];

// const COLOR_PRESETS = [
//     { primary: '#f59e0b', secondary: '#1e293b', label: 'Amber' },
//     { primary: '#3b82f6', secondary: '#0f172a', label: 'Blue' },
//     { primary: '#10b981', secondary: '#064e3b', label: 'Emerald' },
//     { primary: '#8b5cf6', secondary: '#1e1b4b', label: 'Violet' },
//     { primary: '#ef4444', secondary: '#1c0707', label: 'Red' },
//     { primary: '#f97316', secondary: '#1c0a00', label: 'Orange' },
// ];

// export function SchoolStep() {
//     const router = useRouter();

//     const {
//         prevStep,
//         adminData,
//         paymentData,
//         schoolData,
//         curricula,
//         setSchoolData,
//         isLoading,
//         setLoading,
//         error,
//         setError,
//     } = useOnboardingStore();

//     const [form, setForm] = useState({
//         schoolName: schoolData?.schoolName ?? '',
//         curriculumId: schoolData?.curriculumId ?? '',
//         primaryColor: schoolData?.primaryColor ?? '#f59e0b',
//         secondaryColor: schoolData?.secondaryColor ?? '#1e293b',
//         country: schoolData?.country ?? 'Nigeria',
//         timezone: schoolData?.timezone ?? 'Africa/Lagos',
//     });

    // async function handleSubmit(e: React.FormEvent) {
    //     e.preventDefault();

    //     if (!adminData || !paymentData || !adminData.password) {
    //         setError('Registry Context Failure: Identity profile missing.');
    //         return;
    //     }

    //     setError(null);
    //     setLoading(true);

    //     const normalizedForm = {
    //         ...form,
    //         schoolName: toTitleCase(form.schoolName),
    //     };

    //     try {
    //         const result = await completeOnboarding(
    //             {
    //                 ...adminData,
    //                 name: toTitleCase(adminData.name),
    //                 password: adminData.password,
    //             },
    //             normalizedForm,
    //             paymentData.reference,
    //             paymentData.plan ?? 'starter'
    //         );

    //         if (!result.success) {
    //             setError(result.error ?? 'Workspace initialization failed.');
    //             setLoading(false);
    //             return;
    //         }

    //         setSchoolData(normalizedForm);
    //         setConfirmedEmail(adminData.email);
    //         setProvisioned(true);
    //         toast.success('Institutional Hub Initialized. Redirecting...');

    //         // Direct navigation — no Zustand state dependency
        
    //     } catch (err) {
    //         console.error('SchoolStep error:', err);
    //         setError('Critical synchronization failure. Please try again.');
    //         setLoading(false);
    //     }
    // }

//     return (
//         <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-10">

//             {/* ── HEADER ── */}
//             <div className="text-center space-y-3">
//                 <div className="flex justify-center mb-4">
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center shadow-lg">
//                         <School className="h-7 w-7 text-school-primary" />
//                     </div>
//                 </div>
//                 <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     Institutional Hub
//                 </h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70">
//                     Finalize your private workspace architecture
//                 </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-8">

//                 {/* ── SCHOOL IDENTITY ── */}
//                 <div className="space-y-3 group">
//                     <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
//                         Official Institutional Identity
//                     </Label>
//                     <div className="relative">
//                         <School className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
//                         <Input
//                             value={form.schoolName}
//                             onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
//                             onBlur={(e) => setForm({ ...form, schoolName: toTitleCase(e.target.value) })}
//                             placeholder="e.g. LAGOS ACADEMY"
//                             required
//                             className={cn(
//                                 'pl-12 bg-surface border-border text-foreground font-extrabold uppercase italic text-sm rounded-xl h-14 transition-all',
//                                 'focus-visible:ring-2 focus-visible:ring-school-primary-200 focus-visible:border-school-primary'
//                             )}
//                         />
//                     </div>
//                 </div>

//                 {/* ── CURRICULUM ── */}
//                 <div className="space-y-3 group">
//                     <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
//                         Academic Core Blueprint
//                     </Label>
//                     <Select
//                         value={form.curriculumId ? String(form.curriculumId) : undefined}
//                         onValueChange={(v) => setForm({ ...form, curriculumId: v })}
//                         required
//                     >
//                         <SelectTrigger className="bg-surface border-border text-foreground font-bold uppercase h-14 rounded-xl focus:ring-2 focus:ring-school-primary-200">
//                             <SelectValue placeholder="Select Global Template..." />
//                         </SelectTrigger>
//                         <SelectContent className="bg-card border-border text-foreground rounded-xl shadow-2xl">
//                             {curricula.map((c) => (
//                                 <SelectItem
//                                     key={c.id}
//                                     value={c.id}
//                                     className="text-[10px] font-bold uppercase tracking-widest"
//                                 >
//                                     {c.name}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* ── GEOGRAPHIC REGISTRY ── */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-3">
//                         <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">
//                             Country
//                         </Label>
//                         <Select
//                             value={form.country}
//                             onValueChange={(v) => setForm({ ...form, country: v })}
//                         >
//                             <SelectTrigger className="bg-surface border-border text-foreground font-bold uppercase h-14 rounded-xl">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-card border-border">
//                                 {COUNTRIES.map((c) => (
//                                     <SelectItem key={c} value={c}>{c}</SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="space-y-3">
//                         <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">
//                             Timeline Hub
//                         </Label>
//                         <Select
//                             value={form.timezone}
//                             onValueChange={(v) => setForm({ ...form, timezone: v })}
//                         >
//                             <SelectTrigger className="bg-surface border-border text-foreground font-bold uppercase h-14 rounded-xl">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-card border-border">
//                                 {TIMEZONES.map((tz) => (
//                                     <SelectItem key={tz} value={tz}>{tz}</SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>

//                 {/* ── BRANDING PROTOCOL ── */}
//                 <div className="space-y-6 pt-6 border-t border-border">
//                     <div className="flex items-center gap-3">
//                         <Palette className="h-4 w-4 text-school-primary" />
//                         <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">
//                             Branding Protocol
//                         </Label>
//                     </div>

//                     <div className="flex gap-4 flex-wrap">
//                         {COLOR_PRESETS.map((preset) => (
//                             <button
//                                 key={preset.label}
//                                 type="button"
//                                 onClick={() =>
//                                     setForm({
//                                         ...form,
//                                         primaryColor: preset.primary,
//                                         secondaryColor: preset.secondary,
//                                     })
//                                 }
//                                 className={cn(
//                                     'h-11 w-11 rounded-xl border-4 transition-all duration-300 hover:scale-110 shadow-lg',
//                                     form.primaryColor === preset.primary
//                                         ? 'border-foreground'
//                                         : 'border-transparent'
//                                 )}
//                                 style={{ background: preset.primary }}
//                                 title={preset.label}
//                             />
//                         ))}
//                     </div>

//                     {/* Preview */}
//                     <div className="rounded-2xl p-6 flex items-center justify-between shadow-inner border border-border bg-surface">
//                         <div className="space-y-1">
//                             <p
//                                 className="text-sm font-extrabold uppercase italic tracking-tight"
//                                 style={{ color: form.primaryColor }}
//                             >
//                                 {form.schoolName || 'REGISTRY_HUB_ID'}
//                             </p>
//                             <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
//                                 Institutional Preview
//                             </p>
//                         </div>
//                         <div
//                             className="h-10 px-5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest flex items-center shadow-lg shadow-black/10"
//                             style={{ background: form.primaryColor, color: '#fff' }}
//                         >
//                             Sync Hub
//                         </div>
//                     </div>
//                 </div>

//                 {/* ── ERROR ── */}
//                 {error && (
//                     <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-bold uppercase tracking-widest italic animate-in fade-in">
//                         {error}
//                     </div>
//                 )}

//                 {/* ── ACTIONS ── */}
//                 <div className="flex gap-4 pt-6">
//                     <Button
//                         type="button"
//                         variant="outline"
//                         onClick={prevStep}
//                         disabled={isLoading}
//                         className="h-16 px-8 rounded-xl border-border bg-surface text-muted-foreground transition-all hover:bg-background"
//                     >
//                         <ArrowLeft className="h-5 w-5" />
//                     </Button>

//                     <Button
//                         type="submit"
//                         disabled={isLoading || !form.schoolName || !form.curriculumId}
//                         className={cn(
//                             'flex-1 h-16 rounded-xl shadow-xl transition-all active:scale-95 group',
//                             'bg-school-primary text-on-school-primary font-extrabold text-[11px] uppercase tracking-widest',
//                             'hover:brightness-110 shadow-school-primary-200 disabled:opacity-30'
//                         )}
//                     >
//                         {isLoading ? (
//                             <Loader2 className="h-5 w-5 animate-spin" />
//                         ) : (
//                             <span className="flex items-center gap-3">
//                                 Initialize Institutional Hub
//                                 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                             </span>
//                         )}
//                     </Button>
//                 </div>
//             </form>
//         </div>
//     );
// }



// 'use client';

// import React, { useState } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toTitleCase } from '@/lib/utils/formatters';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { toast } from 'sonner';
// import {
//     ArrowLeft,
//     ArrowRight,
//     School,
//     Palette,
//     Globe,
//     ChevronDown,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// // ── Configuration (Rule 21 Scale Presets) ───────────────────────────────────

// const TIMEZONES = [
//     'Africa/Lagos', 'Africa/Nairobi', 'Africa/Johannesburg',
//     'Africa/Accra', 'Africa/Cairo', 'Europe/London',
//     'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Dubai',
// ];

// const COUNTRIES = [
//     'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Ethiopia',
//     'United Kingdom', 'United States', 'Canada', 'UAE', 'India',
// ];

// const COLOR_PRESETS = [
//     { primary: '#f59e0b', secondary: '#1e293b', label: 'Amber' },
//     { primary: '#3b82f6', secondary: '#0f172a', label: 'Blue' },
//     { primary: '#10b981', secondary: '#064e3b', label: 'Emerald' },
//     { primary: '#8b5cf6', secondary: '#1e1b4b', label: 'Violet' },
// ];

// /**
//  * ONBOARDING PHASE 02: INSTITUTIONAL HUB CONFIGURATION
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-surface, border-border).
//  * Rule 19: Standardized Geometry (rounded-xl/2xl).
//  * Rule 21: Scale Protocol for mathematical brand tints.
//  */
// export function SchoolStep() {
//     const {
//         prevStep,
//         nextStep,
//         schoolData,
//         curricula,
//         setSchoolData,
//     } = useOnboardingStore();

//     const [form, setForm] = useState({
//         schoolName: schoolData?.schoolName ?? '',
//         curriculumId: schoolData?.curriculumId ?? '',
//         primaryColor: schoolData?.primaryColor ?? '#f59e0b',
//         secondaryColor: schoolData?.secondaryColor ?? '#1e293b',
//         country: schoolData?.country ?? 'Nigeria',
//         timezone: schoolData?.timezone ?? 'Africa/Lagos',
//     });

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         // Registry Normalization Protocol
//         const normalizedData = {
//             ...form,
//             schoolName: toTitleCase(form.schoolName),
//         };

//         // Rule 17: Syncing Hub details to the global store
//         setSchoolData(normalizedData);
        
//         toast.success("Institutional Hub configured.");
//         nextStep(); // Move to Phase 03: License Tier
//     };

//     return (
//         <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-10">

//             {/* ── HEADER (Rule 11/21) ── */}
//             <div className="text-center space-y-3">
//                 <div className="flex justify-center mb-4">
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center shadow-lg">
//                         <School className="h-7 w-7 text-school-primary" />
//                     </div>
//                 </div>
//                 <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     Institutional Hub
//                 </h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70">
//                     Configure your private workspace architecture
//                 </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-8">

//                 {/* ── SCHOOL IDENTITY (Rule 18/19) ── */}
//                 <div className="space-y-3 group">
//                     <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
//                         Official Institutional Identity
//                     </Label>
//                     <div className="relative">
//                         <School className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
//                         <Input
//                             value={form.schoolName}
//                             onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
//                             onBlur={(e) => setForm({ ...form, schoolName: toTitleCase(e.target.value) })}
//                             placeholder="e.g. LAGOS ACADEMY"
//                             required
//                             className={cn(
//                                 'pl-12 bg-surface border-border text-foreground font-extrabold uppercase italic text-sm rounded-xl h-14 transition-all',
//                                 'focus-visible:ring-2 focus-visible:ring-school-primary-200 focus-visible:border-school-primary'
//                             )}
//                         />
//                     </div>
//                 </div>

//                 {/* ── ACADEMIC BLUEPRINT ── */}
//                 <div className="space-y-3 group">
//                     <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
//                         Academic Core Blueprint
//                     </Label>
//                     <Select
//                         value={form.curriculumId ? String(form.curriculumId) : undefined}
//                         onValueChange={(v) => setForm({ ...form, curriculumId: v })}
//                         required
//                     >
//                         <SelectTrigger className="bg-surface border-border text-foreground font-bold uppercase h-14 rounded-xl focus:ring-2 focus:ring-school-primary-200">
//                             <SelectValue placeholder="Select Global Template..." />
//                         </SelectTrigger>
//                         <SelectContent className="bg-card border-border text-foreground rounded-xl shadow-2xl">
//                             {curricula.map((c) => (
//                                 <SelectItem
//                                     key={c.id}
//                                     value={c.id}
//                                     className="text-[10px] font-bold uppercase tracking-widest"
//                                 >
//                                     {c.name} Hub
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* ── GEOGRAPHIC REGISTRY ── */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-3">
//                         <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">
//                             Country
//                         </Label>
//                         <Select
//                             value={form.country}
//                             onValueChange={(v) => setForm({ ...form, country: v })}
//                         >
//                             <SelectTrigger className="bg-surface border-border text-foreground font-bold uppercase h-14 rounded-xl">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-card border-border">
//                                 {COUNTRIES.map((c) => (
//                                     <SelectItem key={c} value={c}>{c}</SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="space-y-3">
//                         <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">
//                             Timeline Hub
//                         </Label>
//                         <Select
//                             value={form.timezone}
//                             onValueChange={(v) => setForm({ ...form, timezone: v })}
//                         >
//                             <SelectTrigger className="bg-surface border-border text-foreground font-bold uppercase h-14 rounded-xl">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-card border-border">
//                                 {TIMEZONES.map((tz) => (
//                                     <SelectItem key={tz} value={tz}>{tz}</SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>

//                 {/* ── BRANDING PROTOCOL (Rule 21) ── */}
//                 <div className="space-y-6 pt-6 border-t border-border">
//                     <div className="flex items-center gap-3">
//                         <Palette className="h-4 w-4 text-school-primary" />
//                         <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">
//                             Interface Branding Protocol
//                         </Label>
//                     </div>

//                     <div className="flex gap-4 flex-wrap">
//                         {COLOR_PRESETS.map((preset) => (
//                             <button
//                                 key={preset.label}
//                                 type="button"
//                                 onClick={() =>
//                                     setForm({
//                                         ...form,
//                                         primaryColor: preset.primary,
//                                         secondaryColor: preset.secondary,
//                                     })
//                                 }
//                                 className={cn(
//                                     'h-11 w-11 rounded-xl border-4 transition-all duration-300 hover:scale-110 shadow-lg',
//                                     form.primaryColor === preset.primary
//                                         ? 'border-foreground'
//                                         : 'border-transparent'
//                                 )}
//                                 style={{ background: preset.primary }}
//                                 title={preset.label}
//                             />
//                         ))}
//                     </div>

//                     {/* Registry Hub Preview */}
//                     <div className="rounded-2xl p-6 flex items-center justify-between shadow-inner border border-border bg-surface">
//                         <div className="space-y-1">
//                             <p
//                                 className="text-sm font-extrabold uppercase italic tracking-tight"
//                                 style={{ color: form.primaryColor }}
//                             >
//                                 {form.schoolName || 'REGISTRY_HUB_ID'}
//                             </p>
//                             <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
//                                 Institutional Preview
//                             </p>
//                         </div>
//                         <div
//                             className="h-10 px-5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest flex items-center shadow-lg shadow-black/10"
//                             style={{ background: form.primaryColor, color: '#fff' }}
//                         >
//                             Sync Hub
//                         </div>
//                     </div>
//                 </div>

//                 {/* ── NAVIGATION ACTIONS (Rule 20) ── */}
//                 <div className="flex gap-4 pt-6">
//                     <Button
//                         type="button"
//                         variant="outline"
//                         onClick={prevStep}
//                         className="h-16 px-8 rounded-xl border-border bg-surface text-muted-foreground transition-all hover:bg-background"
//                     >
//                         <ArrowLeft className="h-5 w-5" />
//                     </Button>

//                     <Button
//                         type="submit"
//                         disabled={!form.schoolName || !form.curriculumId}
//                         className={cn(
//                             'flex-1 h-16 rounded-xl shadow-xl transition-all active:scale-95 group',
//                             'bg-school-primary text-on-school-primary font-extrabold text-[11px] uppercase tracking-widest',
//                             'hover:brightness-110 shadow-school-primary-200'
//                         )}
//                     >
//                         <span className="flex items-center gap-3">
//                             Proceed to License Selection
//                             <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                         </span>
//                     </Button>
//                 </div>
//             </form>
//         </div>
//     );
// }




// 'use client';

// import React, { useState } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toTitleCase } from '@/lib/utils/formatters';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { toast } from 'sonner';
// import {
//     ArrowLeft,
//     ArrowRight,
//     School,
//     Palette,
//     Globe,
//     ChevronDown,
//     Check,
//     Clock
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// // ── Configuration (Rule 21: High-Fidelity Palette Registry) ─────────────────

// const TIMEZONES = [
//     'Africa/Lagos', 'Africa/Nairobi', 'Africa/Johannesburg',
//     'Africa/Accra', 'Africa/Cairo', 'Europe/London',
//     'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Dubai',
// ];

// const COUNTRIES = [
//     'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Ethiopia',
//     'United Kingdom', 'United States', 'Canada', 'UAE', 'India',
// ];

// const PALETTES = [
//     { primary: '#f59e0b', secondary: '#1e293b', label: 'Amber Hub' },
//     { primary: '#3b82f6', secondary: '#0f172a', label: 'Blue Registry' },
//     { primary: '#10b981', secondary: '#064e3b', label: 'Emerald Core' },
//     { primary: '#8b5cf6', secondary: '#1e1b4b', label: 'Violet Hub' },
//     { primary: '#ef4444', secondary: '#1c0707', label: 'Red Protocol' },
//     { primary: '#000000', secondary: '#334155', label: 'Slate Hub' },
// ];

// /**
//  * ONBOARDING PHASE 02: INSTITUTIONAL HUB CONFIGURATION
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry (rounded-xl, rounded-[2rem]).
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function SchoolStep() {
//     const {
//         prevStep,
//         nextStep,
//         schoolData,
//         curricula,
//         setSchoolData,
//     } = useOnboardingStore();

//     const [form, setForm] = useState({
//         schoolName: schoolData?.schoolName ?? '',
//         curriculumId: schoolData?.curriculumId ?? '',
//         primaryColor: schoolData?.primaryColor ?? PALETTES[0].primary,
//         secondaryColor: schoolData?.secondaryColor ?? PALETTES[0].secondary,
//         country: schoolData?.country ?? 'Nigeria',
//         timezone: schoolData?.timezone ?? 'Africa/Lagos',
//     });

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!form.curriculumId) {
//             toast.error("Registry Protocol: Academic Blueprint selection required.");
//             return;
//         }

//         const normalizedData = {
//             ...form,
//             schoolName: toTitleCase(form.schoolName),
//         };

//         // Rule 17: Synchronizing Hub details to the global store
//         setSchoolData(normalizedData);
        
//         toast.success("Institutional Hub configuration staged.");
//         nextStep(); // Move to Phase 03: License Tier
//     };

//     return (
//         <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-10">

//             {/* ── HEADER (Rule 11/21) ── */}
//             <div className="text-center space-y-3">
//                 <div className="flex justify-center mb-4">
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center shadow-lg">
//                         <School className="h-7 w-7 text-school-primary" />
//                     </div>
//                 </div>
//                 <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     Institutional Hub
//                 </h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70">
//                     Configure your private workspace architecture
//                 </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-8">

//                 {/* ── SCHOOL IDENTITY (Rule 18/19) ── */}
//                 <div className="space-y-3 group">
//                     <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
//                         Official Institutional Identity
//                     </Label>
//                     <div className="relative">
//                         <School className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
//                         <Input
//                             value={form.schoolName}
//                             onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
//                             placeholder="e.g. LAGOS ACADEMY"
//                             required
//                             className={cn(
//                                 'pl-12 bg-surface border-border text-foreground font-extrabold uppercase italic text-sm rounded-xl h-14 transition-all',
//                                 'focus-visible:ring-2 focus-visible:ring-school-primary-200 focus-visible:border-school-primary'
//                             )}
//                         />
//                     </div>
//                 </div>

//                 {/* ── ACADEMIC BLUEPRINT ── */}
//                 <div className="space-y-3 group">
//                     <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
//                         Academic Core Blueprint
//                     </Label>
//                     <Select
//                         value={form.curriculumId}
//                         onValueChange={(v) => setForm({ ...form, curriculumId: v })}
//                         required
//                     >
//                         <SelectTrigger className="bg-surface border-border text-foreground font-bold uppercase h-14 rounded-xl focus:ring-2 focus:ring-school-primary-200 shadow-sm">
//                             <SelectValue placeholder="Select Global Template..." />
//                         </SelectTrigger>
//                         <SelectContent className="bg-card border-border text-foreground rounded-xl shadow-2xl">
//                             {curricula.map((c) => (
//                                 <SelectItem
//                                     key={c.id}
//                                     value={c.id}
//                                     className="text-[10px] font-bold uppercase tracking-widest"
//                                 >
//                                     {c.name} Hub
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* ── GEOGRAPHIC & TIMELINE REGISTRY ── */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-3 group">
//                         <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
//                             Country
//                         </Label>
//                         <Select
//                             value={form.country}
//                             onValueChange={(v) => setForm({ ...form, country: v })}
//                         >
//                             <SelectTrigger className="bg-surface border-border text-foreground font-bold h-14 rounded-xl focus:ring-2 focus:ring-school-primary-200">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-card border-border">
//                                 {COUNTRIES.map((c) => (
//                                     <SelectItem key={c} value={c}>{c}</SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="space-y-3 group">
//                         <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
//                             Timeline Hub (Timezone)
//                         </Label>
//                         <Select
//                             value={form.timezone}
//                             onValueChange={(v) => setForm({ ...form, timezone: v })}
//                         >
//                             <SelectTrigger className="bg-surface border-border text-foreground font-bold h-14 rounded-xl focus:ring-2 focus:ring-school-primary-200">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-card border-border">
//                                 {TIMEZONES.map((tz) => (
//                                     <SelectItem key={tz} value={tz}>{tz}</SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>

//                 {/* ── BRANDING PROTOCOL (Rule 21 Scale) ── */}
//                 <div className="space-y-6 pt-6 border-t border-border">
//                     <div className="flex items-center gap-3">
//                         <Palette className="h-4 w-4 text-school-primary" />
//                         <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">
//                             Institutional Branding Protocol
//                         </Label>
//                     </div>

//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                         {PALETTES.map((palette) => {
//                             const isSelected = form.primaryColor === palette.primary;
//                             return (
//                                 <button
//                                     key={palette.label}
//                                     type="button"
//                                     onClick={() => setForm({ 
//                                         ...form, 
//                                         primaryColor: palette.primary, 
//                                         secondaryColor: palette.secondary 
//                                     })}
//                                     className={cn(
//                                         "relative flex flex-col p-3 rounded-2xl border-2 transition-all group shadow-sm active:scale-95",
//                                         isSelected ? "border-school-primary bg-surface" : "border-border bg-card hover:border-school-primary-100"
//                                     )}
//                                 >
//                                     <div className="flex items-center gap-2 mb-3">
//                                         <div className="h-5 w-5 rounded-full shadow-inner border border-white/10" style={{ background: palette.primary }} />
//                                         <div className="h-5 w-5 rounded-full shadow-inner border border-white/10" style={{ background: palette.secondary }} />
//                                     </div>
//                                     <p className={cn(
//                                         "text-[9px] font-bold uppercase tracking-widest text-left",
//                                         isSelected ? "text-school-primary" : "text-muted-foreground"
//                                     )}>
//                                         {palette.label}
//                                     </p>
//                                     {isSelected && <Check className="absolute top-2 right-2 h-3 w-3 text-school-primary" />}
//                                 </button>
//                             );
//                         })}
//                     </div>

//                     {/* ── LIVE HUB PREVIEW (Rule 18/19/21) ── */}
//                     <div className="space-y-3">
//                         <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1 italic opacity-60">Identity Hub Preview</p>
//                         <div 
//                             className="rounded-[1.5rem] p-6 flex items-center justify-between border shadow-2xl transition-all duration-500"
//                             style={{ backgroundColor: form.secondaryColor, borderColor: `${form.primaryColor}40` }}
//                         >
//                             <div className="space-y-1">
//                                 <h4 className="text-base font-extrabold uppercase italic tracking-tighter" style={{ color: form.primaryColor }}>
//                                     {form.schoolName || 'Hub_Identity'}
//                                 </h4>
//                                 <p className="text-[8px] font-bold uppercase tracking-[0.3em] opacity-40" style={{ color: form.primaryColor }}>
//                                     Active Registry Hub
//                                 </p>
//                             </div>
//                             <div 
//                                 className="h-10 px-5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest flex items-center shadow-lg"
//                                 style={{ backgroundColor: form.primaryColor, color: '#fff' }}
//                             >
//                                 Restore Sync
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ── NAVIGATION ACTIONS ── */}
//                 <div className="flex gap-4 pt-6">
//                     <Button
//                         type="button"
//                         variant="outline"
//                         onClick={prevStep}
//                         className="h-16 px-8 rounded-xl border-border bg-surface text-muted-foreground transition-all hover:bg-background shadow-sm"
//                     >
//                         <ArrowLeft className="h-5 w-5" />
//                     </Button>

//                     <Button
//                         type="submit"
//                         disabled={!form.schoolName || !form.curriculumId}
//                         className={cn(
//                             'flex-1 h-16 rounded-xl shadow-xl transition-all active:scale-95 group',
//                             'bg-school-primary text-on-school-primary font-extrabold text-[11px] uppercase tracking-widest',
//                             'hover:brightness-110 shadow-school-primary-200'
//                         )}
//                     >
//                         <span className="flex items-center gap-3">
//                             Proceed to License Selection
//                             <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                         </span>
//                     </Button>
//                 </div>
//             </form>
//         </div>
//     );
// }



// 'use client';

// import React, { useState } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toTitleCase } from '@/lib/utils/formatters';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { toast } from 'sonner';
// import {
//     ArrowLeft,
//     ArrowRight,
//     School,
//     Palette,
//     Check,
//     Trash2,
//     Lock
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// const TIMEZONES = [
//     'Africa/Lagos', 'Africa/Nairobi', 'Africa/Johannesburg',
//     'Africa/Accra', 'Africa/Cairo', 'Europe/London',
//     'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Dubai',
// ];

// const COUNTRIES = [
//     'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Ethiopia',
//     'United Kingdom', 'United States', 'Canada', 'UAE', 'India',
// ];

// const PALETTES = [
//     { primary: '#f59e0b', secondary: '#1e293b', label: 'Amber Hub' },
//     { primary: '#3b82f6', secondary: '#0f172a', label: 'Blue Registry' },
//     { primary: '#10b981', secondary: '#064e3b', label: 'Emerald Core' },
//     { primary: '#8b5cf6', secondary: '#1e1b4b', label: 'Violet Hub' },
//     { primary: '#ef4444', secondary: '#1c0707', label: 'Red Protocol' },
//     { primary: '#000000', secondary: '#334155', label: 'Slate Hub' },
// ];

// export function SchoolStep() {
//     const {
//         prevStep,
//         nextStep,
//         schoolData,
//         curricula,
//         setSchoolData,
//         paymentStatus, // Bug 1 & 3 Fix
//         reset          // Bug 3 Fix
//     } = useOnboardingStore();

//     // Determine if the form should be locked
//     const isLocked = paymentStatus === 'paid';

//     const [form, setForm] = useState({
//         schoolName: schoolData?.schoolName ?? '',
//         curriculumId: schoolData?.curriculumId ?? '',
//         primaryColor: schoolData?.primaryColor ?? PALETTES[0].primary,
//         secondaryColor: schoolData?.secondaryColor ?? PALETTES[0].secondary,
//         country: schoolData?.country ?? 'Nigeria',
//         timezone: schoolData?.timezone ?? 'Africa/Lagos',
//     });

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         // If locked, just move forward without updating
//         if (isLocked) {
//             nextStep();
//             return;
//         }

//         if (!form.curriculumId) {
//             toast.error("Registry Protocol: Academic Blueprint selection required.");
//             return;
//         }

//         setSchoolData({
//             ...form,
//             schoolName: toTitleCase(form.schoolName),
//         });
        
//         toast.success("Institutional Hub configuration staged.");
//         nextStep();
//     };

//     const handleDeleteDetails = () => {
//         if (isLocked) {
//             toast.error("Security Protocol: Cannot delete details after payment.");
//             return;
//         }
        
//         if (confirm("Are you sure you want to delete all submitted details? This will reset your progress.")) {
//             reset();
//             toast.success("Registry cleared successfully.");
//         }
//     };

//     return (
//         <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-10">

//             {/* ── HEADER ── */}
//             <div className="text-center space-y-3">
//                 <div className="flex justify-center mb-4">
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center shadow-lg">
//                         {isLocked ? <Lock className="h-7 w-7 text-emerald-600" /> : <School className="h-7 w-7 text-school-primary" />}
//                     </div>
//                 </div>
//                 <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     {isLocked ? 'Provisioned Hub' : 'Institutional Hub'}
//                 </h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70">
//                     {isLocked ? 'This configuration is locked following payment' : 'Configure your private workspace architecture'}
//                 </p>
//             </div>

//             {/* ── DATA LOCK WARNING ── */}
//             {isLocked && (
//                 <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
//                     <Check className="h-4 w-4 text-emerald-600" />
//                     <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
//                         Registry details synchronized with active subscription.
//                     </p>
//                 </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-8">
                
//                 {/* ── SCHOOL IDENTITY ── */}
//                 <div className="space-y-3 group">
//                     <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
//                         Official Institutional Identity
//                     </Label>
//                     <div className="relative">
//                         <School className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
//                         <Input
//                             value={form.schoolName}
//                             onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
//                             placeholder="e.g. LAGOS ACADEMY"
//                             required
//                             disabled={isLocked}
//                             className={cn(
//                                 'pl-12 bg-surface border-border text-foreground font-extrabold uppercase italic text-sm rounded-xl h-14 transition-all',
//                                 'disabled:opacity-60 disabled:grayscale'
//                             )}
//                         />
//                     </div>
//                 </div>

//                 {/* ── ACADEMIC BLUEPRINT ── */}
//                 <div className="space-y-3 group">
//                     <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
//                         Academic Core Blueprint
//                     </Label>
//                     <Select
//                         value={form.curriculumId}
//                         onValueChange={(v) => setForm({ ...form, curriculumId: v })}
//                         disabled={isLocked}
//                         required
//                     >
//                         <SelectTrigger className="bg-surface border-border text-foreground font-bold uppercase h-14 rounded-xl disabled:opacity-60">
//                             <SelectValue placeholder="Select Global Template..." />
//                         </SelectTrigger>
//                         <SelectContent className="bg-card border-border">
//                             {curricula.map((c) => (
//                                 <SelectItem key={c.id} value={c.id} className="text-[10px] font-bold uppercase tracking-widest">
//                                     {c.name} Hub
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* ── GEOGRAPHIC ── */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-3 group">
//                         <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Country</Label>
//                         <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })} disabled={isLocked}>
//                             <SelectTrigger className="bg-surface border-border text-foreground font-bold h-14 rounded-xl disabled:opacity-60"><SelectValue /></SelectTrigger>
//                             <SelectContent className="bg-card border-border">
//                                 {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="space-y-3 group">
//                         <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Timezone</Label>
//                         <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })} disabled={isLocked}>
//                             <SelectTrigger className="bg-surface border-border text-foreground font-bold h-14 rounded-xl disabled:opacity-60"><SelectValue /></SelectTrigger>
//                             <SelectContent className="bg-card border-border">
//                                 {TIMEZONES.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>

//                 {/* ── BRANDING ── */}
//                 <div className="space-y-6 pt-6 border-t border-border">
//                     <div className="flex items-center gap-3">
//                         <Palette className="h-4 w-4 text-school-primary" />
//                         <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">Branding Protocol</Label>
//                     </div>

//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                         {PALETTES.map((palette) => {
//                             const isSelected = form.primaryColor === palette.primary;
//                             return (
//                                 <button
//                                     key={palette.label}
//                                     type="button"
//                                     disabled={isLocked}
//                                     onClick={() => setForm({ ...form, primaryColor: palette.primary, secondaryColor: palette.secondary })}
//                                     className={cn(
//                                         "relative flex flex-col p-3 rounded-2xl border-2 transition-all group shadow-sm active:scale-95 disabled:opacity-50",
//                                         isSelected ? "border-school-primary bg-surface" : "border-border bg-card"
//                                     )}
//                                 >
//                                     <div className="flex items-center gap-2 mb-3">
//                                         <div className="h-5 w-5 rounded-full" style={{ background: palette.primary }} />
//                                         <div className="h-5 w-5 rounded-full" style={{ background: palette.secondary }} />
//                                     </div>
//                                     <p className="text-[9px] font-bold uppercase tracking-widest">{palette.label}</p>
//                                     {isSelected && <Check className="absolute top-2 right-2 h-3 w-3 text-school-primary" />}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* ── NAVIGATION ACTIONS ── */}
//                 <div className="flex flex-col gap-6 pt-6">
//                     <div className="flex gap-4">
//                         {!isLocked && (
//                             <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={prevStep}
//                                 className="h-16 px-8 rounded-xl border-border bg-surface text-muted-foreground transition-all hover:bg-background"
//                             >
//                                 <ArrowLeft className="h-5 w-5" />
//                             </Button>
//                         )}

//                         <Button
//                             type="submit"
//                             className={cn(
//                                 'flex-1 h-16 rounded-xl shadow-xl transition-all group font-extrabold text-[11px] uppercase tracking-widest',
//                                 isLocked ? 'bg-emerald-600 text-white' : 'bg-school-primary text-on-school-primary hover:brightness-110 shadow-school-primary-200'
//                             )}
//                         >
//                             <span className="flex items-center gap-3">
//                                 {isLocked ? 'Skip to Status' : 'Proceed to License Selection'}
//                                 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                             </span>
//                         </Button>
//                     </div>

//                     {/* DELETE ACTION - Only shown if NOT paid */}
//                     {!isLocked && (
//                         <button
//                             type="button"
//                             onClick={handleDeleteDetails}
//                             className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground/50 hover:text-destructive transition-colors uppercase tracking-[0.2em]"
//                         >
//                             <Trash2 className="h-3 w-3" />
//                             Purge All Submitted Details
//                         </button>
//                     )}
//                 </div>
//             </form>
//         </div>
//     );
// }


// 'use client';

// import React, { useState } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toTitleCase } from '@/lib/utils/formatters';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { toast } from 'sonner';
// import {
//     ArrowLeft,
//     ArrowRight,
//     School,
//     Palette,
//     Check,
//     Trash2,
//     Lock
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// /**
//  * Localized Interface to resolve TS2305 and ensure internal type safety.
//  */
// interface LocalCurriculumTemplate {
//     id: string;
//     name: string;
//     yearLabel: string;
//     termLabel: string;
// }

// const TIMEZONES: string[] = [
//     'Africa/Lagos', 'Africa/Nairobi', 'Africa/Johannesburg',
//     'Africa/Accra', 'Africa/Cairo', 'Europe/London',
//     'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Dubai',
// ];

// const COUNTRIES: string[] = [
//     'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Ethiopia',
//     'United Kingdom', 'United States', 'Canada', 'UAE', 'India',
// ];

// const PALETTES = [
//     { primary: '#f59e0b', secondary: '#1e293b', label: 'Amber Hub' },
//     { primary: '#3b82f6', secondary: '#0f172a', label: 'Blue Registry' },
//     { primary: '#10b981', secondary: '#064e3b', label: 'Emerald Core' },
//     { primary: '#8b5cf6', secondary: '#1e1b4b', label: 'Violet Hub' },
//     { primary: '#ef4444', secondary: '#1c0707', label: 'Red Protocol' },
//     { primary: '#000000', secondary: '#334155', label: 'Slate Hub' },
// ];

// /**
//  * ONBOARDING PHASE 02: INSTITUTIONAL HUB CONFIGURATION
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry (rounded-xl, rounded-[2rem]).
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function SchoolStep() {
//     const {
//         prevStep,
//         nextStep,
//         schoolData,
//         curricula,
//         setSchoolData,
//         isProvisioned,
//         reset          
//     } = useOnboardingStore();

//     // Registry Protocol: Determine if the Hub is already provisioned
//     const isLocked = isProvisioned;

//     const [form, setForm] = useState({
//         schoolName: schoolData?.schoolName ?? '',
//         curriculumId: schoolData?.curriculumId ?? '',
//         primaryColor: schoolData?.primaryColor ?? PALETTES[0].primary,
//         secondaryColor: schoolData?.secondaryColor ?? PALETTES[0].secondary,
//         country: schoolData?.country ?? 'Nigeria',
//         timezone: schoolData?.timezone ?? 'Africa/Lagos',
//     });

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         if (isLocked) {
//             nextStep();
//             return;
//         }

//         if (!form.curriculumId) {
//             toast.error("Registry Protocol: Academic Blueprint selection required.");
//             return;
//         }

//         setSchoolData({
//             ...form,
//             schoolName: toTitleCase(form.schoolName),
//         });
        
//         toast.success("Institutional Hub configuration staged.");
//         nextStep();
//     };

//     const handlePurge = () => {
//         if (isLocked) {
//             toast.error("Security Protocol: Access restricted post-provisioning.");
//             return;
//         }
        
//         if (confirm("Registry Warning: Purge all submitted details and restart initialization?")) {
//             reset();
//             toast.success("Local registry cleared.");
//         }
//     };

//     return (
//         <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-10">

//             {/* ── HEADER (Rule 11/21) ── */}
//             <div className="text-center space-y-3">
//                 <div className="flex justify-center mb-4">
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center shadow-lg transition-colors">
//                         {isLocked ? (
//                             <Lock className="h-7 w-7 text-emerald-600" />
//                         ) : (
//                             <School className="h-7 w-7 text-school-primary" />
//                         )}
//                     </div>
//                 </div>
//                 <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     {isLocked ? 'Provisioned Hub' : 'Institutional Hub'}
//                 </h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70">
//                     {isLocked ? 'Configuration locked following hub sync' : 'Configure your private workspace architecture'}
//                 </p>
//             </div>

//             {isLocked && (
//                 <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 animate-in zoom-in-95">
//                     <Check className="h-4 w-4 text-emerald-600" />
//                     <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest italic">
//                         Registry identity synchronized with institutional hub.
//                     </p>
//                 </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-8">

//                 {/* ── SCHOOL IDENTITY (Rule 18/19) ── */}
//                 <div className="space-y-3 group">
//                     <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
//                         Official Institutional Identity
//                     </Label>
//                     <div className="relative">
//                         <School className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
//                         <Input
//                             value={form.schoolName}
//                             onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
//                             placeholder="e.g. LAGOS ACADEMY"
//                             required
//                             disabled={isLocked}
//                             className={cn(
//                                 'pl-12 bg-surface border-border text-foreground font-extrabold uppercase italic text-sm rounded-xl h-14 transition-all',
//                                 'focus-visible:ring-2 focus-visible:ring-school-primary-200 focus-visible:border-school-primary',
//                                 'disabled:opacity-60 disabled:grayscale'
//                             )}
//                         />
//                     </div>
//                 </div>

//                 {/* ── ACADEMIC BLUEPRINT ── */}
//                 <div className="space-y-3 group">
//                     <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
//                         Academic Core Blueprint
//                     </Label>
//                     <Select
//                         value={form.curriculumId}
//                         onValueChange={(v) => setForm({ ...form, curriculumId: v })}
//                         disabled={isLocked}
//                         required
//                     >
//                         <SelectTrigger className="bg-surface border-border text-foreground font-bold uppercase h-14 rounded-xl focus:ring-2 focus:ring-school-primary-200 disabled:opacity-60 shadow-sm">
//                             <SelectValue placeholder="Select Global Template..." />
//                         </SelectTrigger>
//                         <SelectContent className="bg-card border-border text-foreground rounded-xl shadow-2xl">
//                             {/* ✅ RESOLVED TS7006 & TS2305: Using localized interface */}
//                             {curricula.map((c: any) => {
//                                 const template = c as LocalCurriculumTemplate;
//                                 return (
//                                     <SelectItem key={template.id} value={template.id} className="text-[10px] font-bold uppercase tracking-widest">
//                                         {template.name} Hub
//                                     </SelectItem>
//                                 );
//                             })}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* ── GEOGRAPHIC & TIMELINE HUB ── */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-3 group">
//                         <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
//                             Country
//                         </Label>
//                         <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })} disabled={isLocked}>
//                             <SelectTrigger className="bg-surface border-border text-foreground font-bold h-14 rounded-xl focus:ring-2 focus:ring-school-primary-200 disabled:opacity-60">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-card border-border text-foreground">
//                                 {COUNTRIES.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="space-y-3 group">
//                         <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
//                             Timeline Hub
//                         </Label>
//                         <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })} disabled={isLocked}>
//                             <SelectTrigger className="bg-surface border-border text-foreground font-bold h-14 rounded-xl focus:ring-2 focus:ring-school-primary-200 disabled:opacity-60">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="bg-card border-border text-foreground">
//                                 {TIMEZONES.map((tz: string) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>

//                 {/* ── BRANDING PROTOCOL (Rule 21) ── */}
//                 <div className="space-y-6 pt-6 border-t border-border">
//                     <div className="flex items-center gap-3">
//                         <Palette className="h-4 w-4 text-school-primary" />
//                         <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">
//                             Branding Protocol
//                         </Label>
//                     </div>

//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                         {PALETTES.map((palette) => {
//                             const isSelected = form.primaryColor === palette.primary;
//                             return (
//                                 <button
//                                     key={palette.label}
//                                     type="button"
//                                     disabled={isLocked}
//                                     onClick={() => setForm({ ...form, primaryColor: palette.primary, secondaryColor: palette.secondary })}
//                                     className={cn(
//                                         "relative flex flex-col p-3 rounded-2xl border-2 transition-all group shadow-sm active:scale-95 disabled:opacity-50",
//                                         isSelected ? "border-school-primary bg-surface" : "border-border bg-card hover:border-school-primary-100"
//                                     )}
//                                 >
//                                     <div className="flex items-center gap-2 mb-3">
//                                         <div className="h-6 w-6 rounded-full shadow-inner border border-white/10" style={{ background: palette.primary }} />
//                                         <div className="h-6 w-6 rounded-full shadow-inner border border-white/10" style={{ background: palette.secondary }} />
//                                     </div>
//                                     <p className={cn(
//                                         "text-[9px] font-bold uppercase tracking-widest text-left",
//                                         isSelected ? "text-school-primary" : "text-muted-foreground"
//                                     )}>
//                                         {palette.label}
//                                     </p>
//                                     {isSelected && <Check className="absolute top-2 right-2 h-3 w-3 text-school-primary" />}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* ── NAVIGATION ACTIONS (Rule 20) ── */}
//                 <div className="flex flex-col gap-6 pt-6">
//                     <div className="flex gap-4">
//                         {!isLocked && (
//                             <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={prevStep}
//                                 className="h-16 px-8 rounded-xl border-border bg-surface text-muted-foreground transition-all hover:bg-background shadow-sm"
//                             >
//                                 <ArrowLeft className="h-5 w-5" />
//                             </Button>
//                         )}

//                         <Button
//                             type="submit"
//                             className={cn(
//                                 'flex-1 h-16 rounded-xl shadow-xl transition-all active:scale-95 group font-extrabold text-[11px] uppercase tracking-widest',
//                                 isLocked ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-school-primary text-on-school-primary hover:brightness-110 shadow-school-primary-200'
//                             )}
//                         >
//                             <span className="flex items-center gap-3">
//                                 {isLocked ? 'Skip to Status Hub' : 'Proceed to License Tier'}
//                                 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                             </span>
//                         </Button>
//                     </div>

//                     {!isLocked && (
//                         <button
//                             type="button"
//                             onClick={handlePurge}
//                             className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground/50 hover:text-destructive transition-colors uppercase tracking-[0.2em]"
//                         >
//                             <Trash2 className="h-3 w-3" />
//                             Purge Staged Hub Configuration
//                         </button>
//                     )}
//                 </div>
//             </form>
//         </div>
//     );
// }


'use client';

import React, { useState } from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toTitleCase } from '@/lib/utils/formatters';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
    ArrowLeft,
    ArrowRight,
    School,
    Palette,
    Check,
    Trash2,
    Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/error-handler';

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface LocalCurriculumTemplate {
    id: string;
    name: string;
    yearLabel: string;
    termLabel: string;
}

const TIMEZONES: string[] = [
    'Africa/Lagos', 'Africa/Nairobi', 'Africa/Johannesburg',
    'Africa/Accra', 'Africa/Cairo', 'Europe/London',
    'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Dubai',
];

const COUNTRIES: string[] = [
    'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Ethiopia',
    'United Kingdom', 'United States', 'Canada', 'UAE', 'India',
];

const PALETTES = [
    { primary: '#f59e0b', secondary: '#1e293b', label: 'Amber Hub' },
    { primary: '#3b82f6', secondary: '#0f172a', label: 'Blue Registry' },
    { primary: '#10b981', secondary: '#064e3b', label: 'Emerald Core' },
    { primary: '#8b5cf6', secondary: '#1e1b4b', label: 'Violet Hub' },
    { primary: '#ef4444', secondary: '#1c0707', label: 'Red Protocol' },
    { primary: '#000000', secondary: '#334155', label: 'Slate Hub' },
];

/**
 * ONBOARDING PHASE 02: INSTITUTIONAL HUB CONFIGURATION
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 15: Pure TypeScript - No 'any' types.
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 21: Scale Protocol for clean mathematical tints.
 * Rule 23: Explicit Error Protocol with getErrorMessage.
 */
export function SchoolStep() {
    const {
        prevStep,
        nextStep,
        schoolData,
        curricula,
        setSchoolData,
        isProvisioned,
        reset          
    } = useOnboardingStore();

    const isLocked = isProvisioned;

    const [form, setForm] = useState({
        schoolName: schoolData?.schoolName ?? '',
        curriculumId: schoolData?.curriculumId ?? '',
        primaryColor: schoolData?.primaryColor ?? PALETTES[0].primary,
        secondaryColor: schoolData?.secondaryColor ?? PALETTES[0].secondary,
        country: schoolData?.country ?? 'Nigeria',
        timezone: schoolData?.timezone ?? 'Africa/Lagos',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isLocked) {
                nextStep();
                return;
            }

            if (!form.curriculumId) {
                throw new Error("Registry Protocol: Academic Blueprint selection required.");
            }

            setSchoolData({
                ...form,
                schoolName: toTitleCase(form.schoolName),
            });
            
            toast.success("Institutional Hub configuration staged.");
            nextStep();
        } catch (error: unknown) {
            // ✅ Rule 23: Standardized Error Extraction
            const message = getErrorMessage(error);
            toast.error(message);
        }
    };

    const handlePurge = () => {
        try {
            if (isLocked) {
                throw new Error("Security Protocol: Access restricted post-provisioning.");
            }
            
            if (confirm("Registry Warning: Purge all submitted details and restart initialization?")) {
                reset();
                toast.success("Local registry hub cleared.");
            }
        } catch (error: unknown) {
            // ✅ Rule 23: Standardized Error Extraction
            const message = getErrorMessage(error);
            toast.error(message);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-10">

            {/* ── HEADER ── */}
            <div className="text-center space-y-3">
                <div className="flex justify-center mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center shadow-lg transition-colors">
                        {isLocked ? (
                            <Lock className="h-7 w-7 text-emerald-600" />
                        ) : (
                            <School className="h-7 w-7 text-school-primary" />
                        )}
                    </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                    {isLocked ? 'Provisioned Hub' : 'Institutional Hub'}
                </h1>
                <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70">
                    {isLocked ? 'Configuration locked following hub sync' : 'Configure your private hub architecture'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* ── SCHOOL IDENTITY ── */}
                <div className="space-y-3 group">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
                        Official Institutional Identity
                    </Label>
                    <div className="relative">
                        <School className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
                        <Input
                            value={form.schoolName}
                            onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                            placeholder="e.g. LAGOS ACADEMY"
                            required
                            disabled={isLocked}
                            className={cn(
                                'pl-12 bg-surface border-border text-foreground font-extrabold uppercase italic text-sm rounded-xl h-14 transition-all',
                                'disabled:opacity-60 disabled:grayscale'
                            )}
                        />
                    </div>
                </div>

                {/* ── ACADEMIC BLUEPRINT ── */}
                <div className="space-y-3 group">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
                        Academic Core Blueprint
                    </Label>
                    <Select
                        value={form.curriculumId}
                        onValueChange={(v) => setForm({ ...form, curriculumId: v })}
                        disabled={isLocked}
                        required
                    >
                        <SelectTrigger className="bg-surface border-border text-foreground font-bold uppercase h-14 rounded-xl disabled:opacity-60">
                            <SelectValue placeholder="Select Global Template..." />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border text-foreground rounded-xl shadow-2xl">
                            {/* ✅ RESOLVED: Strict Typing for curricula map */}
                            {curricula.map((template: LocalCurriculumTemplate) => (
                                <SelectItem 
                                    key={template.id} 
                                    value={template.id} 
                                    className="text-[10px] font-bold uppercase tracking-widest"
                                >
                                    {template.name} Hub
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* ── GEOGRAPHIC REGISTRY ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3 group">
                        <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Country</Label>
                        <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })} disabled={isLocked}>
                            <SelectTrigger className="bg-surface border-border text-foreground font-bold h-14 rounded-xl disabled:opacity-60"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-card border-border text-foreground">
                                {COUNTRIES.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3 group">
                        <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Timeline Hub</Label>
                        <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })} disabled={isLocked}>
                            <SelectTrigger className="bg-surface border-border text-foreground font-bold h-14 rounded-xl disabled:opacity-60"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-card border-border text-foreground">
                                {TIMEZONES.map((tz: string) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* ── BRANDING PROTOCOL (Rule 21) ── */}
                <div className="space-y-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-3">
                        <Palette className="h-4 w-4 text-school-primary" />
                        <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">Branding Protocol</Label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {PALETTES.map((palette) => {
                            const isSelected = form.primaryColor === palette.primary;
                            return (
                                <button
                                    key={palette.label}
                                    type="button"
                                    disabled={isLocked}
                                    onClick={() => setForm({ ...form, primaryColor: palette.primary, secondaryColor: palette.secondary })}
                                    className={cn(
                                        "relative flex flex-col p-3 rounded-2xl border-2 transition-all group shadow-sm active:scale-95 disabled:opacity-50",
                                        isSelected ? "border-school-primary bg-surface" : "border-border bg-card hover:border-school-primary-100"
                                    )}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="h-6 w-6 rounded-full shadow-inner border border-white/10" style={{ background: palette.primary }} />
                                        <div className="h-6 w-6 rounded-full shadow-inner border border-white/10" style={{ background: palette.secondary }} />
                                    </div>
                                    <p className={cn(
                                        "text-[9px] font-bold uppercase tracking-widest text-left",
                                        isSelected ? "text-school-primary" : "text-muted-foreground"
                                    )}>
                                        {palette.label}
                                    </p>
                                    {isSelected && <Check className="absolute top-2 right-2 h-3 w-3 text-school-primary" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── NAVIGATION ACTIONS ── */}
                <div className="flex flex-col gap-6 pt-6">
                    <div className="flex gap-4">
                        {!isLocked && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                className="h-16 px-8 rounded-xl border-border bg-surface text-muted-foreground transition-all hover:bg-background shadow-sm"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        )}

                        <Button
                            type="submit"
                            className={cn(
                                'flex-1 h-16 rounded-xl shadow-xl transition-all active:scale-95 group font-extrabold text-[11px] uppercase tracking-widest',
                                isLocked ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-school-primary text-on-school-primary hover:brightness-110 shadow-school-primary-200'
                            )}
                        >
                            <span className="flex items-center gap-3">
                                {isLocked ? 'Skip to License Hub' : 'Proceed to License Tier'}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Button>
                    </div>

                    {!isLocked && (
                        <button
                            type="button"
                            onClick={handlePurge}
                            className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground/50 hover:text-destructive transition-colors uppercase tracking-[0.2em]"
                        >
                            <Trash2 className="h-3 w-3" />
                            Purge Staged Hub Configuration
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}