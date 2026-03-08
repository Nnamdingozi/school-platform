// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { completeOnboarding, getCurricula } from '@/app/actions/onboarding';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { toast } from 'sonner';
// import { ArrowLeft, ArrowRight, School, Globe, Clock, Palette, Check } from 'lucide-react';
// import { cn } from '@/lib/utils';

// const TIMEZONES = [
//     'Africa/Lagos',
//     'Africa/Nairobi',
//     'Africa/Johannesburg',
//     'Africa/Accra',
//     'Africa/Cairo',
//     'Europe/London',
//     'Europe/Paris',
//     'America/New_York',
//     'America/Los_Angeles',
//     'Asia/Dubai',
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
//     const { prevStep, adminData, paymentData, setSchoolData, setLoading, setError, isLoading, error } = useOnboardingStore();

//     const [curricula, setCurricula] = useState<{ id: string; name: string }[]>([]);
//     const [isProvisioning, setIsProvisioning] = useState(false);
//     const [isProvisioned, setIsProvisioned] = useState(false);

//     const [form, setForm] = useState({
//         schoolName: '',
//         curriculumId: '',
//         primaryColor: '#f59e0b',
//         secondaryColor: '#1e293b',
//         country: 'Nigeria',
//         timezone: 'Africa/Lagos',
//     });

//     useEffect(() => {
//         getCurricula().then((res) => {
//             if (res.success) setCurricula(res.data);
//         });
//     }, []);

    // async function handleSubmit(e: React.FormEvent) {
        // e.preventDefault();
        
        // // 1. Fix the TypeScript Error by ensuring password exists
        // if (!adminData || !paymentData || !adminData.password) {
        //     setError('Missing required account data (like password). Please go back to step 1.');
        //     return;
        // }

        // setError(null);
        // setIsProvisioning(true);
        // setLoading(true);
    
        // // Construct a strictly typed AdminFormData object
        // const validAdminData = {
        //     name: adminData.name,
        //     email: adminData.email,
        //     password: adminData.password,
        //     phone: adminData.phone || '',
        // };

        // const result = await completeOnboarding(
        //     validAdminData, // Pass the strictly typed object
        //     form,
        //     paymentData.reference,
        //     paymentData.plan ?? 'starter'
        // );
    
        // setLoading(false);
    
    //     if (!result.success) {
    //         setError(result.error ?? 'Failed to create workspace.');
    //         setIsProvisioning(false);
    //         toast.error(result.error);
    //         return;
    //     }
    
    //     setSchoolData(form);
    //     setIsProvisioned(true);
    //     toast.success(`${form.schoolName} is ready!`);
    
    //     setTimeout(() => {
    //         router.push('/admin');
    //         useOnboardingStore.getState().reset();
          
    //     }, 2500);
//     }
//     // Success / provisioning state
//     if (isProvisioned) {
//         return (
//             <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center text-center py-10 gap-6">
//                 <div className="h-20 w-20 rounded-full bg-school-primary/20 border-4 border-school-primary flex items-center justify-center animate-bounce">
//                     <Check className="h-10 w-10 text-school-primary" />
//                 </div>
//                 <div>
//                     <h2 className="text-2xl font-black text-school-secondary-100">
//                         {form.schoolName} is ready! 🎉
//                     </h2>
//                     <p className="text-school-secondary-100/50 mt-2 text-sm">
//                         Taking you to your dashboard...
//                     </p>
//                 </div>
//                 <div className="flex gap-1">
//                     {[0, 1, 2].map((i) => (
//                         <div
//                             key={i}
//                             className="h-2 w-2 rounded-full bg-school-primary animate-bounce"
//                             style={{ animationDelay: `${i * 0.15}s` }}
//                         />
//                     ))}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="mb-8 text-center">
//                 <h1 className="text-3xl font-black text-school-secondary-100 tracking-tight">
//                     Set up your school
//                 </h1>
//                 <p className="text-school-secondary-100/50 mt-2 text-sm">
//                     This creates your school's private workspace.
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
//                             placeholder="Lagos Academy"
//                             required
//                             className="pl-10 bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-100/30 focus:border-school-primary"
//                         />
//                     </div>
//                 </div>

//                 {/* Curriculum */}
//                 <div className="space-y-1.5">
//                     <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
//                         Curriculum
//                     </Label>
//                     <Select
//                         value={form.curriculumId}
//                         onValueChange={(v) => setForm({ ...form, curriculumId: v })}
//                         required
//                     >
//                         <SelectTrigger className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
//                             <SelectValue placeholder="Select a curriculum..." />
//                         </SelectTrigger>
//                         <SelectContent>
//                             {curricula.length === 0 && (
//                                 <SelectItem value="loading" disabled>Loading curricula...</SelectItem>
//                             )}
//                             {curricula.map((c) => (
//                                 <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* Country + Timezone side by side */}
//                 <div className="grid grid-cols-2 gap-3">
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
//                                 <SelectContent>
//                                     {COUNTRIES.map((c) => (
//                                         <SelectItem key={c} value={c}>{c}</SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>

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
//                                 <SelectContent>
//                                     {TIMEZONES.map((tz) => (
//                                         <SelectItem key={tz} value={tz}>{tz}</SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Brand Colors */}
//                 <div className="space-y-2">
//                     <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
//                         <Palette className="h-3.5 w-3.5" /> Brand Colors
//                     </Label>

//                     {/* Presets */}
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
//                                     "h-8 w-8 rounded-full border-2 transition-all duration-200 hover:scale-110",
//                                     form.primaryColor === preset.primary
//                                         ? "border-white scale-110"
//                                         : "border-transparent"
//                                 )}
//                                 style={{ background: preset.primary }}
//                                 title={preset.label}
//                             />
//                         ))}
//                     </div>

//                     {/* Custom pickers */}
//                     <div className="grid grid-cols-2 gap-3">
//                         <div className="space-y-1">
//                             <p className="text-[10px] text-school-secondary-100/40 uppercase tracking-wider">Primary</p>
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
//                             <p className="text-[10px] text-school-secondary-100/40 uppercase tracking-wider">Secondary</p>
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

//                     {/* Live preview */}
//                     <div
//                         className="rounded-xl p-4 flex items-center justify-between"
//                         style={{ background: form.secondaryColor }}
//                     >
//                         <div>
//                             <p className="text-xs font-bold" style={{ color: form.primaryColor }}>
//                                 {form.schoolName || 'Your School'}
//                             </p>
//                             <p className="text-[10px] opacity-50 text-white">Brand preview</p>
//                         </div>
//                         <div
//                             className="h-8 px-3 rounded-lg text-xs font-bold flex items-center"
//                             style={{ background: form.primaryColor, color: form.secondaryColor }}
//                         >
//                             Button
//                         </div>
//                     </div>
//                 </div>

//                 {/* Error */}
//                 {error && (
//                     <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
//                         {error}
//                     </div>
//                 )}

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
//                                 <span className="h-4 w-4 border-2 border-school-secondary-950/30 border-t-school-secondary-950 rounded-full animate-spin" />
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

// import { useState, useEffect } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { completeOnboarding, getCurricula } from '@/app/actions/onboarding';
// import { createClient } from '@/lib/supabase/client';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
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
//     Check,
//     Mail,
//     Loader2,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// const TIMEZONES = [
//     'Africa/Lagos',
//     'Africa/Nairobi',
//     'Africa/Johannesburg',
//     'Africa/Accra',
//     'Africa/Cairo',
//     'Europe/London',
//     'Europe/Paris',
//     'America/New_York',
//     'America/Los_Angeles',
//     'Asia/Dubai',
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

//     const [curricula, setCurricula] = useState<{ id: string; name: string }[]>([]);
//     const [isResending, setIsResending] = useState(false);

//     // Seed from store if user navigated back
//     const [form, setForm] = useState({
//         schoolName: schoolData?.schoolName ?? '',
//         curriculumId: schoolData?.curriculumId ?? '',
//         primaryColor: schoolData?.primaryColor ?? '#f59e0b',
//         secondaryColor: schoolData?.secondaryColor ?? '#1e293b',
//         country: schoolData?.country ?? 'Nigeria',
//         timezone: schoolData?.timezone ?? 'Africa/Lagos',
//     });

//     useEffect(() => {
//         getCurricula().then((res) => {
//             if (res.success) setCurricula(res.data);
//         });
//     }, []);

//     // ─── Submit ────────────────────────────────────────────────────────────────

//     async function handleSubmit(e: React.FormEvent) {
//         e.preventDefault();

//        // // 1. Fix the TypeScript Error by ensuring password exists
//         if (!adminData || !paymentData || !adminData.password) {
//             setError('Missing required account data . Please go back to step 1.');
//             return;
//         }

//         setError(null);
//         setProvisioned(true);
//         setLoading(true);
    
//         // Construct a strictly typed AdminFormData object
//         const validAdminData = {
//             name: adminData.name,
//             email: adminData.email,
//             password: adminData.password,
//             phone: adminData.phone || '',
//         };

//         const result = await completeOnboarding(
//             validAdminData, // Pass the strictly typed object
//             form,
//             paymentData.reference,
//             paymentData.plan ?? 'starter'
//         );
    
//         setLoading(false);
//         if (!result.success) {
//             setError(result.error ?? 'Failed to create workspace. Please try again.');
//             toast.error(result.error);
//             return;
//         }

//         // ✅ Order matters:
//         // 1. Save school data so confirmation screen can show school name/color
//         // 2. reset() clears step, adminData, paymentData, sets isProvisioned: false
//         // 3. setProvisioned(true) AFTER reset so it isn't overwritten
//         setSchoolData(form);
//         setConfirmedEmail(adminData.email); // ← save email before reset wipes adminData
//         reset();
//         setProvisioned(true);
//         toast.success('School workspace created! Check your email to confirm.');
//     }

//     // ─── Resend confirmation email ─────────────────────────────────────────────

//     async function handleResend() {
//         if (!adminData?.email) return;
//         setIsResending(true);

//         const supabase = createClient();
//         const { error } = await supabase.auth.resend({
//             type: 'signup',
//             email: adminData.email,
//         });

//         setIsResending(false);

//         if (error) {
//             toast.error('Could not resend. Please wait a moment and try again.');
//         } else {
//             toast.success('Confirmation email resent!');
//         }
//     }

//     // ─── School setup form ─────────────────────────────────────────────────────

//     return (
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="mb-8 text-center">
//                 <h1 className="text-3xl font-black text-school-secondary-100 tracking-tight">
//                     Set up your school
//                 </h1>
//                 <p className="text-school-secondary-100/50 mt-2 text-sm">
//                     This creates your school's private workspace.
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
//                             placeholder="Lagos Academy"
//                             required
//                             className="pl-10 bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-100/30 focus:border-school-primary"
//                         />
//                     </div>
//                 </div>

//                 {/* Curriculum */}
//                 <div className="space-y-1.5">
//                     <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
//                         Curriculum
//                     </Label>
//                     <Select
//                         value={form.curriculumId}
//                         onValueChange={(v) => setForm({ ...form, curriculumId: v })}
//                         required
//                     >
//                         <SelectTrigger className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
//                             <SelectValue placeholder="Select a curriculum..." />
//                         </SelectTrigger>
//                         <SelectContent>
//                             {curricula.length === 0 ? (
//                                 <SelectItem value="loading" disabled>
//                                     Loading curricula...
//                                 </SelectItem>
//                             ) : (
//                                 curricula.map((c) => (
//                                     <SelectItem key={c.id} value={c.id}>
//                                         {c.name}
//                                     </SelectItem>
//                                 ))
//                             )}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* Country + Timezone */}
//                 <div className="grid grid-cols-2 gap-3">
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
//                                 <SelectContent>
//                                     {COUNTRIES.map((c) => (
//                                         <SelectItem key={c} value={c}>{c}</SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>

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
//                                 <SelectContent>
//                                     {TIMEZONES.map((tz) => (
//                                         <SelectItem key={tz} value={tz}>{tz}</SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Brand Colors */}
//                 <div className="space-y-2">
//                     <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
//                         <Palette className="h-3.5 w-3.5" /> Brand Colors
//                     </Label>

//                     {/* Presets */}
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

//                     {/* Custom pickers */}
//                     <div className="grid grid-cols-2 gap-3">
//                         <div className="space-y-1">
//                             <p className="text-[10px] text-school-secondary-100 uppercase tracking-wider">
//                                 Primary
//                             </p>
//                             <div className="flex items-center gap-2 bg-school-secondary-800 border border-school-secondary-700 rounded-lg p-2">
//                                 <input
//                                     type="color"
//                                     value={form.primaryColor}
//                                     onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
//                                     className="h-7 w-7 rounded cursor-pointer border-0 bg-transparent"
//                                 />
//                                 <span className="text-xs text-school-secondary-100/60 font-mono">
//                                     {form.primaryColor}
//                                 </span>
//                             </div>
//                         </div>
//                         <div className="space-y-1">
//                             <p className="text-[10px] text-school-secondary-100 uppercase tracking-wider">
//                                 Secondary
//                             </p>
//                             <div className="flex items-center gap-2 bg-school-secondary-800 border border-school-secondary-700 rounded-lg p-2">
//                                 <input
//                                     type="color"
//                                     value={form.secondaryColor}
//                                     onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
//                                     className="h-7 w-7 rounded cursor-pointer border-0 bg-transparent"
//                                 />
//                                 <span className="text-xs text-school-secondary-100/60 font-mono">
//                                     {form.secondaryColor}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Live preview */}
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

//                 {/* Error */}
//                 {error && (
//                     <div className="p-3 rounded-lg bg-red-500 border border-red-500/20 text-red-400 text-sm">
//                         {error}
//                     </div>
//                 )}

//                 {/* Actions */}
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

// import { useState, useEffect } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { completeOnboarding, getCurricula } from '@/app/actions/onboarding';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
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
//     // ✅ FIX 1: Removed unused 'Check' and 'Mail'
//     Loader2,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// const TIMEZONES = [
//     'Africa/Lagos',
//     'Africa/Nairobi',
//     'Africa/Johannesburg',
//     'Africa/Accra',
//     'Africa/Cairo',
//     'Europe/London',
//     'Europe/Paris',
//     'America/New_York',
//     'America/Los_Angeles',
//     'Asia/Dubai',
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

//     const [curricula, setCurricula] = useState<{ id: string; name: string }[]>([]);
    
//     // ✅ FIX 2: Removed unused 'isResending' state and 'handleResend' function
//     // (Resending logic is handled in the ConfirmationScreen)

//     const [form, setForm] = useState({
//         schoolName: schoolData?.schoolName ?? '',
//         curriculumId: schoolData?.curriculumId ?? '',
//         primaryColor: schoolData?.primaryColor ?? '#f59e0b',
//         secondaryColor: schoolData?.secondaryColor ?? '#1e293b',
//         country: schoolData?.country ?? 'Nigeria',
//         timezone: schoolData?.timezone ?? 'Africa/Lagos',
//     });

//     useEffect(() => {
//         getCurricula().then((res) => {
//             if (res.success) setCurricula(res.data);
//         });
//     }, []);

//     async function handleSubmit(e: React.FormEvent) {
//         e.preventDefault();

//         if (!adminData || !paymentData || !adminData.password) {
//             setError('Missing required account data. Please go back to step 1.');
//             return;
//         }

//         setError(null);
//         setProvisioned(true);
//         setLoading(true);
    
//         const validAdminData = {
//             name: adminData.name,
//             email: adminData.email,
//             password: adminData.password,
//             phone: adminData.phone || '',
//         };

//         const result = await completeOnboarding(
//             validAdminData,
//             form,
//             paymentData.reference,
//             paymentData.plan ?? 'starter'
//         );
    
//         setLoading(false);
//         if (!result.success) {
//             setError(result.error ?? 'Failed to create workspace. Please try again.');
//             toast.error(result.error);
//             return;
//         }

//         setSchoolData(form);
//         setConfirmedEmail(adminData.email);
//         reset();
//         setProvisioned(true);
//         toast.success('School workspace created! Check your email to confirm.');
//     }

//     return (
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="mb-8 text-center">
//                 <h1 className="text-3xl font-black text-school-secondary-100 tracking-tight">
//                     Set up your school
//                 </h1>
//                 {/* ✅ FIX 3: Escaped apostrophe using curly braces */}
//                 <p className="text-school-secondary-100/50 mt-2 text-sm">
//                     {"This creates your school's private workspace."}
//                 </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//                 <div className="space-y-1.5">
//                     <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
//                         School Name
//                     </Label>
//                     <div className="relative">
//                         <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30" />
//                         <Input
//                             value={form.schoolName}
//                             onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
//                             placeholder="Lagos Academy"
//                             required
//                             className="pl-10 bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-100/30 focus:border-school-primary"
//                         />
//                     </div>
//                 </div>

//                 <div className="space-y-1.5">
//                     <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
//                         Curriculum
//                     </Label>
//                     <Select
//                         value={form.curriculumId}
//                         onValueChange={(v) => setForm({ ...form, curriculumId: v })}
//                         required
//                     >
//                         <SelectTrigger className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
//                             <SelectValue placeholder="Select a curriculum..." />
//                         </SelectTrigger>
//                         <SelectContent>
//                             {curricula.length === 0 ? (
//                                 <SelectItem value="loading" disabled>
//                                     Loading curricula...
//                                 </SelectItem>
//                             ) : (
//                                 curricula.map((c) => (
//                                     <SelectItem key={c.id} value={c.id}>
//                                         {c.name}
//                                     </SelectItem>
//                                 ))
//                             )}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
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
//                                 <SelectContent>
//                                     {COUNTRIES.map((c) => (
//                                         <SelectItem key={c} value={c}>{c}</SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>

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
//                                 <SelectContent>
//                                     {TIMEZONES.map((tz) => (
//                                         <SelectItem key={tz} value={tz}>{tz}</SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>
//                 </div>

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
//                             <p className="text-[10px] text-school-secondary-100 uppercase tracking-wider">
//                                 Primary
//                             </p>
//                             <div className="flex items-center gap-2 bg-school-secondary-800 border border-school-secondary-700 rounded-lg p-2">
//                                 <input
//                                     type="color"
//                                     value={form.primaryColor}
//                                     onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
//                                     className="h-7 w-7 rounded cursor-pointer border-0 bg-transparent"
//                                 />
//                                 <span className="text-xs text-school-secondary-100/60 font-mono">
//                                     {form.primaryColor}
//                                 </span>
//                             </div>
//                         </div>
//                         <div className="space-y-1">
//                             <p className="text-[10px] text-school-secondary-100 uppercase tracking-wider">
//                                 Secondary
//                             </p>
//                             <div className="flex items-center gap-2 bg-school-secondary-800 border border-school-secondary-700 rounded-lg p-2">
//                                 <input
//                                     type="color"
//                                     value={form.secondaryColor}
//                                     onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
//                                     className="h-7 w-7 rounded cursor-pointer border-0 bg-transparent"
//                                 />
//                                 <span className="text-xs text-school-secondary-100/60 font-mono">
//                                     {form.secondaryColor}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

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
//                     <div className="p-3 rounded-lg bg-red-500 border border-red-500/20 text-red-400 text-sm">
//                         {error}
//                     </div>
//                 )}

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



'use client';

import { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';
import { completeOnboarding, getCurricula } from '@/app/actions/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    Globe,
    Clock,
    Palette,
    Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TIMEZONES = [
    'Africa/Lagos', 'Africa/Nairobi', 'Africa/Johannesburg', 
    'Africa/Accra', 'Africa/Cairo', 'Europe/London', 
    'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Dubai',
];

const COUNTRIES = [
    'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Ethiopia',
    'United Kingdom', 'United States', 'Canada', 'UAE', 'India',
];

const COLOR_PRESETS = [
    { primary: '#f59e0b', secondary: '#1e293b', label: 'Amber' },
    { primary: '#3b82f6', secondary: '#0f172a', label: 'Blue' },
    { primary: '#10b981', secondary: '#064e3b', label: 'Emerald' },
    { primary: '#8b5cf6', secondary: '#1e1b4b', label: 'Violet' },
    { primary: '#ef4444', secondary: '#1c0707', label: 'Red' },
    { primary: '#f97316', secondary: '#1c0a00', label: 'Orange' },
];

export function SchoolStep() {
    const {
        prevStep,
        adminData,
        paymentData,
        schoolData,
        setSchoolData,
        setLoading,
        setError,
        setProvisioned,
        isLoading,
        error,
        setConfirmedEmail, 
        reset,
    } = useOnboardingStore();

    const [curricula, setCurricula] = useState<{ id: string | number; name: string }[]>([]);
    
    const [form, setForm] = useState({
        schoolName: schoolData?.schoolName ?? '',
        curriculumId: schoolData?.curriculumId ?? '',
        primaryColor: schoolData?.primaryColor ?? '#f59e0b',
        secondaryColor: schoolData?.secondaryColor ?? '#1e293b',
        country: schoolData?.country ?? 'Nigeria',
        timezone: schoolData?.timezone ?? 'Africa/Lagos',
    });

    useEffect(() => {
        let isMounted = true;
        getCurricula().then((res) => {
            if (res.success && isMounted) {
                setCurricula(res.data);
            }
        });
        return () => { isMounted = false; };
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!adminData || !paymentData || !adminData.password) {
            setError('Missing required account data. Please go back to step 1.');
            return;
        }

        setError(null);
        setLoading(true);
    
        const validAdminData = {
            name: adminData.name,
            email: adminData.email,
            password: adminData.password,
            phone: adminData.phone || '',
        };

        const result = await completeOnboarding(
            validAdminData,
            form,
            paymentData.reference,
            paymentData.plan ?? 'starter'
        );
    
        setLoading(false);
        if (!result.success) {
            setError(result.error ?? 'Failed to create workspace. Please try again.');
            toast.error(result.error);
            return;
        }

        setSchoolData(form);
        setConfirmedEmail(adminData.email);
        reset();
        setProvisioned(true);
        toast.success('School workspace created! Check your email to confirm.');
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black text-school-secondary-100 tracking-tight">
                    Set up your school
                </h1>
                <p className="text-school-secondary-100/50 mt-2 text-sm">
                    {"This creates your school's private workspace."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* School Name */}
                <div className="space-y-1.5">
                    <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                        School Name
                    </Label>
                    <div className="relative">
                        <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30" />
                        <Input
                            value={form.schoolName}
                            onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                            placeholder="Lagos Academy"
                            required
                            className="pl-10 bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-100/30 focus:border-school-primary"
                        />
                    </div>
                </div>

                {/* Curriculum Dropdown - FIXED */}
                <div className="space-y-1.5">
                    <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                        Curriculum
                    </Label>
                    <Select
                        // Fix: Using undefined ensures the placeholder is visible if empty
                        value={form.curriculumId ? String(form.curriculumId) : undefined}
                        onValueChange={(v) => setForm({ ...form, curriculumId: v })}
                        required
                    >
                        <SelectTrigger className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
                            <SelectValue placeholder="Select a curriculum..." />
                        </SelectTrigger>
                        <SelectContent className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
                            {curricula.length === 0 ? (
                                <SelectItem value="loading" disabled>
                                    Loading curricula...
                                </SelectItem>
                            ) : (
                                curricula.map((c) => (
                                    // Fix: Ensure value is always a string
                                    <SelectItem key={String(c.id)} value={String(c.id)}>
                                        {c.name}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {/* Country Dropdown */}
                    <div className="space-y-1.5">
                        <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                            Country
                        </Label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30 z-10" />
                            <Select
                                value={form.country}
                                onValueChange={(v) => setForm({ ...form, country: v })}
                            >
                                <SelectTrigger className="pl-9 bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
                                    {COUNTRIES.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Timezone Dropdown */}
                    <div className="space-y-1.5">
                        <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                            Timezone
                        </Label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30 z-10" />
                            <Select
                                value={form.timezone}
                                onValueChange={(v) => setForm({ ...form, timezone: v })}
                            >
                                <SelectTrigger className="pl-9 bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
                                    {TIMEZONES.map((tz) => (
                                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Color Theme Selection */}
                <div className="space-y-2">
                    <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
                        <Palette className="h-3.5 w-3.5" /> Brand Colors
                    </Label>

                    <div className="flex gap-2 flex-wrap">
                        {COLOR_PRESETS.map((preset) => (
                            <button
                                key={preset.label}
                                type="button"
                                onClick={() => setForm({
                                    ...form,
                                    primaryColor: preset.primary,
                                    secondaryColor: preset.secondary,
                                })}
                                className={cn(
                                    'h-8 w-8 rounded-full border-2 transition-all duration-200 hover:scale-110',
                                    form.primaryColor === preset.primary
                                        ? 'border-white scale-110'
                                        : 'border-transparent'
                                )}
                                style={{ background: preset.primary }}
                                title={preset.label}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <p className="text-[10px] text-school-secondary-100 uppercase tracking-wider">Primary</p>
                            <div className="flex items-center gap-2 bg-school-secondary-800 border border-school-secondary-700 rounded-lg p-2">
                                <input
                                    type="color"
                                    value={form.primaryColor}
                                    onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                                    className="h-7 w-7 rounded cursor-pointer border-0 bg-transparent"
                                />
                                <span className="text-xs text-school-secondary-100/60 font-mono">{form.primaryColor}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-school-secondary-100 uppercase tracking-wider">Secondary</p>
                            <div className="flex items-center gap-2 bg-school-secondary-800 border border-school-secondary-700 rounded-lg p-2">
                                <input
                                    type="color"
                                    value={form.secondaryColor}
                                    onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                                    className="h-7 w-7 rounded cursor-pointer border-0 bg-transparent"
                                />
                                <span className="text-xs text-school-secondary-100/60 font-mono">{form.secondaryColor}</span>
                            </div>
                        </div>
                    </div>

                    {/* Brand Preview Card */}
                    <div
                        className="rounded-xl p-4 flex items-center justify-between transition-all duration-300"
                        style={{ background: form.secondaryColor }}
                    >
                        <div>
                            <p className="text-xs font-bold" style={{ color: form.primaryColor }}>
                                {form.schoolName || 'Your School'}
                            </p>
                            <p className="text-[10px] opacity-50 text-white">Brand preview</p>
                        </div>
                        <div
                            className="h-8 px-3 rounded-lg text-xs font-bold flex items-center transition-all duration-300"
                            style={{ background: form.primaryColor, color: form.secondaryColor }}
                        >
                            Button
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={isLoading}
                        className="border-school-secondary-700 text-school-secondary-100/60 hover:text-school-secondary-100 hover:bg-school-secondary-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>

                    <Button
                        type="submit"
                        disabled={isLoading || !form.schoolName || !form.curriculumId}
                        className="flex-1 bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold h-11 transition-all duration-200 hover:scale-[1.01]"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creating workspace...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Launch My School
                                <ArrowRight className="h-4 w-4" />
                            </span>
                        )}
                    </Button>
                </div>

                <p className="text-center text-[10px] text-school-secondary-100/20">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </form>
        </div>
    );
}