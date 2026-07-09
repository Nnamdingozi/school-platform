

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
// import { getErrorMessage } from '@/lib/error-handler';

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

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
//  * Rule 15: Pure TypeScript - No 'any' types.
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 21: Scale Protocol for clean mathematical tints.
//  * Rule 23: Explicit Error Protocol with getErrorMessage.
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

//         try {
//             if (isLocked) {
//                 nextStep();
//                 return;
//             }

//             if (!form.curriculumId) {
//                 throw new Error("Registry Protocol: Academic Blueprint selection required.");
//             }

//             setSchoolData({
//                 ...form,
//                 schoolName: toTitleCase(form.schoolName),
//             });
            
//             toast.success("Institutional Hub configuration staged.");
//             nextStep();
//         } catch (error: unknown) {
//             // ✅ Rule 23: Standardized Error Extraction
//             const message = getErrorMessage(error);
//             toast.error(message);
//         }
//     };

//     const handlePurge = () => {
//         try {
//             if (isLocked) {
//                 throw new Error("Security Protocol: Access restricted post-provisioning.");
//             }
            
//             if (confirm("Registry Warning: Purge all submitted details and restart initialization?")) {
//                 reset();
//                 toast.success("Local registry hub cleared.");
//             }
//         } catch (error: unknown) {
//             // ✅ Rule 23: Standardized Error Extraction
//             const message = getErrorMessage(error);
//             toast.error(message);
//         }
//     };

//     return (
//         <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-10">

//             {/* ── HEADER ── */}
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
//                     {isLocked ? 'Configuration locked following hub sync' : 'Configure your private hub architecture'}
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
//                         <SelectContent className="bg-card border-border text-foreground rounded-xl shadow-2xl">
//                             {/* ✅ RESOLVED: Strict Typing for curricula map */}
//                             {curricula.map((template: LocalCurriculumTemplate) => (
//                                 <SelectItem 
//                                     key={template.id} 
//                                     value={template.id} 
//                                     className="text-[10px] font-bold uppercase tracking-widest"
//                                 >
//                                     {template.name} Hub
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* ── GEOGRAPHIC REGISTRY ── */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-3 group">
//                         <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Country</Label>
//                         <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })} disabled={isLocked}>
//                             <SelectTrigger className="bg-surface border-border text-foreground font-bold h-14 rounded-xl disabled:opacity-60"><SelectValue /></SelectTrigger>
//                             <SelectContent className="bg-card border-border text-foreground">
//                                 {COUNTRIES.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="space-y-3 group">
//                         <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Timeline Hub</Label>
//                         <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })} disabled={isLocked}>
//                             <SelectTrigger className="bg-surface border-border text-foreground font-bold h-14 rounded-xl disabled:opacity-60"><SelectValue /></SelectTrigger>
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

//                 {/* ── NAVIGATION ACTIONS ── */}
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
//                                 {isLocked ? 'Skip to License Hub' : 'Proceed to License Tier'}
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
    Lock,
    BookOpen
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
    // Original Palettes
    { primary: '#f59e0b', secondary: '#1e293b', label: 'Amber Hub' },
    { primary: '#3b82f6', secondary: '#0f172a', label: 'Blue Registry' },
    { primary: '#10b981', secondary: '#064e3b', label: 'Emerald Core' },
    { primary: '#8b5cf6', secondary: '#1e1b4b', label: 'Violet Hub' },
    { primary: '#ef4444', secondary: '#450a0a', label: 'Red Protocol' },
    { primary: '#4f46e5', secondary: '#1e1b4b', label: 'Indigo Matrix' },
    
    // ✅ Added New Palettes
    { primary: '#f97316', secondary: '#431407', label: 'Orange Core' },
    { primary: '#06b6d4', secondary: '#083344', label: 'Cyan System' },
    { primary: '#84cc16', secondary: '#1a2e05', label: 'Lime Protocol' },
    { primary: '#f43f5e', secondary: '#500724', label: 'Rose Matrix' },
    { primary: '#64748b', secondary: '#0f172a', label: 'Graphite Hub' },
    { primary: '#ffffff', secondary: '#020617', label: 'Monochrome Core' },
];

/**
 * ONBOARDING PHASE 02: INSTITUTIONAL HUB CONFIGURATION
 * Logic: Updated to support primary and optional secondary curricula.
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

    const isLocked: boolean = isProvisioned;

    const [form, setForm] = useState({
        schoolName: schoolData?.schoolName ?? '',
        curriculumId: schoolData?.curriculumId ?? '',
        secondaryCurriculumId: schoolData?.secondaryCurriculumId ?? 'none',
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
                throw new Error("Registry Protocol: Primary Academic Blueprint selection required.");
            }

            setSchoolData({
                ...form,
                schoolName: toTitleCase(form.schoolName),
                // Transform 'none' back to null for the database
                secondaryCurriculumId: form.secondaryCurriculumId === 'none' ? null : form.secondaryCurriculumId,
            });
            
            toast.success("Institutional Hub configuration staged.");
            nextStep();
        } catch (error: unknown) {
            const message: string = getErrorMessage(error);
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
            const message: string = getErrorMessage(error);
            toast.error(message);
        }
    };

    // Filter secondary curricula to prevent selecting the same one as primary
    const availableSecondaryCurricula: LocalCurriculumTemplate[] = curricula.filter(
        (c: LocalCurriculumTemplate) => c.id !== form.curriculumId
    );

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
                    {isLocked ? 'Provisioned Hub' : 'School Hub'}
                </h1>
                <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70">
                    {isLocked ? 'Configuration locked following hub sync' : 'Configure your school hub'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* ── SCHOOL IDENTITY ── */}
                <div className="space-y-3 group">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
                        School Name
                    </Label>
                    <div className="relative">
                        <School className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
                        <Input
                            value={form.schoolName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, schoolName: e.target.value })}
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

                {/* ── ACADEMIC BLUEPRINTS (Primary & Secondary) ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 group">
                        <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
                            Primary Core Blueprint
                        </Label>
                        <Select
                            value={form.curriculumId}
                            onValueChange={(v: string) => setForm({ ...form, curriculumId: v, secondaryCurriculumId: v === form.secondaryCurriculumId ? 'none' : form.secondaryCurriculumId })}
                            disabled={isLocked}
                            required
                        >
                            <SelectTrigger className="bg-surface border-border text-foreground font-bold uppercase h-14 rounded-xl disabled:opacity-60">
                                <SelectValue placeholder="Select Primary..." />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border text-foreground rounded-xl shadow-2xl">
                                {curricula.map((template: LocalCurriculumTemplate) => (
                                    <SelectItem 
                                        key={template.id} 
                                        value={template.id} 
                                        className="text-[10px] font-bold uppercase tracking-widest"
                                    >
                                        {template.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3 group">
                        <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
                            Secondary Blueprint (Optional)
                        </Label>
                        <Select
                            value={form.secondaryCurriculumId}
                            onValueChange={(v: string) => setForm({ ...form, secondaryCurriculumId: v })}
                            disabled={isLocked || !form.curriculumId}
                        >
                            <SelectTrigger className="bg-surface border-border text-foreground font-bold uppercase h-14 rounded-xl disabled:opacity-60">
                                <SelectValue placeholder="None / Optional" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border text-foreground rounded-xl shadow-2xl">
                                <SelectItem value="none" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    No Secondary Curriculum
                                </SelectItem>
                                {availableSecondaryCurricula.map((template: LocalCurriculumTemplate) => (
                                    <SelectItem 
                                        key={template.id} 
                                        value={template.id} 
                                        className="text-[10px] font-bold uppercase tracking-widest"
                                    >
                                        {template.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* ── GEOGRAPHIC REGISTRY ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3 group">
                        <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Country</Label>
                        <Select value={form.country} onValueChange={(v: string) => setForm({ ...form, country: v })} disabled={isLocked}>
                            <SelectTrigger className="bg-surface border-border text-foreground font-bold h-14 rounded-xl disabled:opacity-60"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-card border-border text-foreground">
                                {COUNTRIES.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3 group">
                        <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Timeline Hub</Label>
                        <Select value={form.timezone} onValueChange={(v: string) => setForm({ ...form, timezone: v })} disabled={isLocked}>
                            <SelectTrigger className="bg-surface border-border text-foreground font-bold h-14 rounded-xl disabled:opacity-60"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-card border-border text-foreground">
                                {TIMEZONES.map((tz: string) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* ── BRANDING PROTOCOL ── */}
                <div className="space-y-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-3">
                        <Palette className="h-4 w-4 text-school-primary" />
                        <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">Branding Protocol</Label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {PALETTES.map((palette) => {
                            const isSelected: boolean = form.primaryColor === palette.primary;
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
                                {isLocked ? 'Skip to Payment Plan' : 'Select Payment Plan'}
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
                            Clear School Information
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}