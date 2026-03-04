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


// "use client";

// import React, { useState } from "react";
// // Added ChevronDown for the dropdown icon
// import { Check, Zap, School, Building2, User, ChevronDown } from "lucide-react"; 
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// // Mock data for curriculums
// const curriculums = [
//   { id: "cambridge", label: "Cambridge International" },
//   { id: "caps", label: "South African CAPS" },
//   { id: "ib", label: "International Baccalaureate (IB)" },
//   { id: "american", label: "US Common Core" },
// ];

// const plans = [
//   {
//     name: "Independent",
//     id: "individual",
//     price: 19,
//     description: "For solo students or homeschoolers.",
//     icon: <User className="h-5 w-5 text-emerald-500" />,
//     features: ["1 Student Profile", "1 Curriculum Access", "Personal AI Tutor", "Self-Paced Quizzes", "WhatsApp Alerts"],
//     highlight: false,
//   },
//   {
//     name: "Starter",
//     id: "starter",
//     price: 49,
//     description: "For small learning centers.",
//     icon: <Zap className="h-5 w-5 text-blue-500" />,
//     features: ["Up to 50 Students", "Single Curriculum", "AI Lesson Generation", "Basic Assessments", "Teacher Dashboard"],
//     highlight: false,
//   },
//   {
//     name: "Professional",
//     id: "pro",
//     price: 199,
//     description: "For established schools.",
//     icon: <School className="h-5 w-5 text-amber-500" />,
//     features: ["Up to 500 Students", "Multi-Curriculum Support", "AI Video Scripts", "Full CRM & Sales", "Advanced Analytics"],
//     highlight: true,
//   },
//   {
//     name: "Enterprise",
//     id: "enterprise",
//     price: 599,
//     description: "For large school groups.",
//     icon: <Building2 className="h-5 w-5 text-purple-500" />,
//     features: ["Unlimited Students", "Custom Mapping", "White-labeling", "Priority AI Tokens", "API Access"],
//     highlight: false,
//   },
// ];

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.1 },
//   },
// };

// const cardVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: { 
//     opacity: 1, 
//     y: 0,
//     transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
//   },
// };

// export default function PricingPage() {
//   const router = useRouter();
//   const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
//   // 1. New state for curriculum selection
//   const [selectedCurriculum, setSelectedCurriculum] = useState(curriculums[0].id);

//   return (
//     <div className="min-h-screen bg-slate-50 py-24 px-6 overflow-hidden">
//       <div className="max-w-7xl mx-auto text-center">
        
//         {/* Header Section */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
//             Flexible plans for <span className="text-amber-600">modern education.</span>
//           </h1>

//           {/* 2. Added Curriculum Dropdown UI */}
//           <div className="mt-10 mb-4">
//             <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Step 1: Select your Curriculum</label>
//             <div className="relative w-full max-w-xs mx-auto mt-3">
//               <select 
//                 value={selectedCurriculum}
//                 onChange={(e) => setSelectedCurriculum(e.target.value)}
//                 className="w-full h-12 pl-4 pr-10 bg-white border-2 border-slate-200 rounded-xl appearance-none focus:outline-none focus:border-amber-500 font-bold text-slate-700 cursor-pointer transition-colors shadow-sm"
//               >
//                 {curriculums.map((c) => (
//                   <option key={c.id} value={c.id}>{c.label}</option>
//                 ))}
//               </select>
//               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
//             </div>
//           </div>
          
//           {/* Billing Toggle */}
//           <div className="flex items-center justify-center gap-6 mb-16 mt-10">
//             <span className={cn("text-base font-bold transition-colors", billingCycle === "monthly" ? "text-slate-900" : "text-slate-400")}>Monthly</span>
//             <button 
//               onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
//               className="w-16 h-8 bg-slate-200 rounded-full relative focus:outline-none ring-2 ring-amber-500/20 ring-offset-4"
//             >
//               <motion.div 
//                 className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
//                 animate={{ x: billingCycle === "annually" ? 32 : 0 }}
//                 transition={{ type: "spring", stiffness: 400, damping: 25 }}
//                 style={{ backgroundColor: billingCycle === "annually" ? "#d97706" : "white" }}
//               />
//             </button>
//             <span className={cn("text-base font-bold transition-colors", billingCycle === "annually" ? "text-slate-900" : "text-slate-400")}>
//               Annually <span className="text-green-600 text-xs bg-green-100 px-3 py-1 rounded-full ml-2 font-black uppercase tracking-tighter">-20% OFF</span>
//             </span>
//           </div>
//         </motion.div>


//         {/* Pricing Cards Grid */}
//         <motion.div 
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           {plans.map((plan) => {
//             const monthlyPrice = plan.price;
//             const discountedMonthly = Math.floor(monthlyPrice * 0.8);
//             const yearlyTotal = discountedMonthly * 12;

//             return (
//               <motion.div
//                 key={plan.id}
//                 variants={cardVariants}
//                 whileHover={{ 
//                   scale: 1.05, 
//                   y: -12,
//                   zIndex: 50,
//                   transition: { type: "spring", stiffness: 300, damping: 20 } 
//                 }}
//                 className="relative"
//               >
//                 <Card className={cn(
//                   "flex flex-col h-full border-2 transition-all duration-500 rounded-3xl overflow-hidden", 
//                   plan.highlight 
//                     ? "border-amber-500 shadow-[0_20px_50px_rgba(217,119,6,0.15)] bg-white" 
//                     : "border-slate-200 bg-white/70 backdrop-blur-sm"
//                 )}>
//                   <CardHeader className="text-left pt-8">
//                     <div className="flex items-center gap-3 mb-2">
//                       <div className="p-2 bg-slate-100 rounded-xl">{plan.icon}</div>
//                       <CardTitle className="text-xl font-bold tracking-tight">{plan.name}</CardTitle>
//                     </div>
//                     <CardDescription className="text-sm leading-relaxed min-h-[40px]">{plan.description}</CardDescription>
//                   </CardHeader>

//                   <CardContent className="grow text-left">
//                     <div className="mb-8 h-20 flex flex-col justify-end">
//                       <AnimatePresence mode="wait">
//                         <motion.div
//                           key={billingCycle}
//                           initial={{ opacity: 0, scale: 0.95 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           exit={{ opacity: 0, scale: 1.05 }}
//                           transition={{ duration: 0.2 }}
//                         >
//                           {billingCycle === "monthly" ? (
//                             <div>
//                               <span className="text-5xl font-black text-slate-900 tracking-tighter">${monthlyPrice}</span>
//                               <span className="text-slate-400 text-lg font-medium">/mo</span>
//                             </div>
//                           ) : (
//                             <div>
//                               <span className="text-5xl font-black text-slate-900 tracking-tighter">${yearlyTotal}</span>
//                               <span className="text-slate-400 text-lg font-medium">/yr</span>
//                               <p className="text-xs text-green-600 font-black uppercase mt-2 bg-green-50 w-fit px-2 py-1 rounded">
//                                 Save ${(monthlyPrice * 12) - yearlyTotal} Yearly
//                               </p>
//                             </div>
//                           )}
//                         </motion.div>
//                       </AnimatePresence>
//                     </div>

//                     <ul className="space-y-4 mb-4">
//                       {plan.features.map((f, i) => (
//                         <li key={i} className="flex items-start gap-3 text-sm font-semibold text-slate-600">
//                           <Check className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /> {f}
//                         </li>
//                       ))}
//                     </ul>
//                   </CardContent>

//                   <CardFooter className="pb-8">
//                     <Button 
//                       // 3. Updated Router Push to include the selected curriculum
//                       onClick={() => router.push(`/onboarding?plan=${plan.id}&billing=${billingCycle}&curriculum=${selectedCurriculum}`)} 
//                       className={cn(
//                         "w-full h-14 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all", 
//                         plan.highlight 
//                           ? "bg-amber-600 hover:bg-amber-700 text-white" 
//                           : "bg-slate-900 hover:bg-slate-800 text-white"
//                       )}
//                     >
//                       Select Plan
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </motion.div>
//             );
//           })}
//         </motion.div>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import { Check, Zap, School, Building2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// 1. Import Shadcn Select components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const curriculums = [
  { id: "cambridge", label: "Cambridge International" },
  { id: "caps", label: "South African CAPS" },
  { id: "ib", label: "International Baccalaureate (IB)" },
  { id: "american", label: "US Common Core" },
];

const plans = [
  {
    name: "Independent",
    id: "individual",
    price: 19,
    description: "For solo students or homeschoolers.",
    icon: <User className="h-5 w-5 text-emerald-500" />,
    features: ["1 Student Profile", "1 Curriculum Access", "Personal AI Tutor", "Self-Paced Quizzes", "WhatsApp Alerts"],
    highlight: false,
  },
  {
    name: "Starter",
    id: "starter",
    price: 49,
    description: "For small learning centers.",
    icon: <Zap className="h-5 w-5 text-blue-500" />,
    features: ["Up to 50 Students", "Single Curriculum", "AI Lesson Generation", "Basic Assessments", "Teacher Dashboard"],
    highlight: false,
  },
  {
    name: "Professional",
    id: "pro",
    price: 199,
    description: "For established schools.",
    icon: <School className="h-5 w-5 text-amber-500" />,
    features: ["Up to 500 Students", "Multi-Curriculum Support", "AI Video Scripts", "Full CRM & Sales", "Advanced Analytics"],
    highlight: true,
  },
  {
    name: "Enterprise",
    id: "enterprise",
    price: 599,
    description: "For large school groups.",
    icon: <Building2 className="h-5 w-5 text-purple-500" />,
    features: ["Unlimited Students", "Custom Mapping", "White-labeling", "Priority AI Tokens", "API Access"],
    highlight: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  },
};

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  
  // 2. State for the Shadcn Select
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>("cambridge");

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Header and Selection Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Flexible plans for <span className="text-amber-600">modern education.</span>
          </h1>

          {/* 3. Shadcn Select Implementation */}
          <div className="flex flex-col items-center gap-4 mt-12">
             <p className="text-xs font-black uppercase tracking-widest text-slate-400">Step 1: Choose Curriculum</p>
             <Select value={selectedCurriculum} onValueChange={setSelectedCurriculum}>
                <SelectTrigger className="w-[280px] h-12 border-2 border-slate-200 rounded-xl font-bold text-slate-700 bg-white">
                    <SelectValue placeholder="Select Curriculum" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-slate-100">
                    {curriculums.map((c) => (
                        <SelectItem key={c.id} value={c.id} className="font-medium focus:bg-amber-50">
                            {c.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-6 mb-16 mt-10">
            <span className={cn("text-base font-bold transition-colors", billingCycle === "monthly" ? "text-slate-900" : "text-slate-400")}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
              className="w-16 h-8 bg-slate-200 rounded-full relative focus:outline-none ring-2 ring-amber-500/20 ring-offset-4"
            >
              <motion.div 
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: billingCycle === "annually" ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{ backgroundColor: billingCycle === "annually" ? "#d97706" : "white" }}
              />
            </button>
            <span className={cn("text-base font-bold transition-colors", billingCycle === "annually" ? "text-slate-900" : "text-slate-400")}>
              Annually <span className="text-green-600 text-xs bg-green-100 px-3 py-1 rounded-full ml-2 font-black uppercase tracking-tighter">-20% OFF</span>
            </span>
          </div>
        </motion.div>


        {/* Pricing Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {plans.map((plan) => {
            const monthlyPrice = plan.price;
            const discountedMonthly = Math.floor(monthlyPrice * 0.8);
            const yearlyTotal = discountedMonthly * 12;

            return (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05, 
                  y: -12,
                  zIndex: 50,
                  transition: { type: "spring", stiffness: 300, damping: 20 } 
                }}
                className="relative"
              >
                <Card className={cn(
                  "flex flex-col h-full border-2 transition-all duration-500 rounded-3xl overflow-hidden", 
                  plan.highlight 
                    ? "border-amber-500 shadow-[0_20px_50px_rgba(217,119,6,0.15)] bg-white" 
                    : "border-slate-200 bg-white/70 backdrop-blur-sm"
                )}>
                  <CardHeader className="text-left pt-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-slate-100 rounded-xl">{plan.icon}</div>
                      <CardTitle className="text-xl font-bold tracking-tight">{plan.name}</CardTitle>
                    </div>
                    <CardDescription className="text-sm leading-relaxed min-h-[40px]">{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="grow text-left">
                    <div className="mb-8 h-20 flex flex-col justify-end">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={billingCycle}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {billingCycle === "monthly" ? (
                            <div>
                              <span className="text-5xl font-black text-slate-900 tracking-tighter">${monthlyPrice}</span>
                              <span className="text-slate-400 text-lg font-medium">/mo</span>
                            </div>
                          ) : (
                            <div>
                              <span className="text-5xl font-black text-slate-900 tracking-tighter">${yearlyTotal}</span>
                              <span className="text-slate-400 text-lg font-medium">/yr</span>
                              <p className="text-xs text-green-600 font-black uppercase mt-2 bg-green-50 w-fit px-2 py-1 rounded">
                                Save ${(monthlyPrice * 12) - yearlyTotal} Yearly
                              </p>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <ul className="space-y-4 mb-4">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm font-semibold text-slate-600">
                          <Check className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /> {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pb-8">
                    <Button 
                      // 4. Update the router to include selectedCurriculum
                      onClick={() => router.push(`/onboarding?plan=${plan.id}&billing=${billingCycle}&curriculum=${selectedCurriculum}`)} 
                      className={cn(
                        "w-full h-14 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all", 
                        plan.highlight 
                          ? "bg-amber-600 hover:bg-amber-700 text-white" 
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      )}
                    >
                      Select Plan
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}