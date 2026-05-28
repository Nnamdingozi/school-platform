// 'use client'

// import { useState, useTransition, useEffect } from 'react'
// import { useProfileStore } from '@/store/profileStore'
// import { updatePersonalProfile } from '@/app/actions/profile'
// import { 
//     User, Mail, Phone, ShieldCheck, 
//     Loader2, Save, School,
//     Fingerprint, BadgeCheck, Palette,
//     type LucideIcon 
// } from 'lucide-react'
// import { Card } from '@/components/ui/card'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'
// import { Role } from '@prisma/client'

// // ── Types ──────────────────────────────────────────────────────────────────────

// interface ProfileSettingsClientProps {
//     initialProfile: any; // Syncs with Server Action return
// }

// interface ContextItemProps {
//     icon: LucideIcon;
//     label: string;
//     value: string | number;
//     color?: string;
//     primaryColor: string;
// }

// /**
//  * IDENTITY MANAGEMENT CONSOLE (Tier 3)
//  * Rule 14: Optimistic UI updates to Zustand store.
//  * Rule 17: Injects school branding from Zustand.
//  */
// export function ProfileSettingsClient({ initialProfile }: ProfileSettingsClientProps) {
//     const { profile, updateProfile } = useProfileStore();
//     const [isPending, startTransition] = useTransition();

//     // Use current store state but fallback to initial server data
//     const currentProfile = profile || initialProfile;
//     const primaryColor = currentProfile?.primaryColor || "#f59e0b";

//     const [formData, setFormData] = useState({
//         name: currentProfile?.name || '',
//         phone: currentProfile?.phone || ''
//     });

//     // Rule 11: Sync form with store data if it changes elsewhere
//     useEffect(() => {
//         if (profile) {
//             setFormData({
//                 name: profile.name || '',
//                 phone: profile.phone || ''
//             });
//         }
//     }, [profile]);

//     const handleSave = () => {
//         if (!formData.name.trim()) return toast.error("Identity requires a valid name.");

//         startTransition(async () => {
//             try {
//                 // Rule 10: Backend Security enforced in Action
//                 const res = await updatePersonalProfile(formData);
                
//                 if (res.success) {
//                     // Rule 14: Synchronize global store for instant UI feedback
//                     updateProfile(formData); 
//                     toast.success("Identity registry synchronized.");
//                 } else {
//                     toast.error(res.error || "Update failed.");
//                 }
//             } catch (err: unknown) {
//                 toast.error("Critical connection failure to registry.");
//             }
//         });
//     };

//     return (
//         <div className="p-4 md:p-8 lg:p-12 bg-slate-950 min-h-screen text-slate-50 space-y-10 font-sans animate-in fade-in duration-700">
            
//             {/* ── HEADER ── */}
//             <header className="flex items-center gap-5 border-b border-white/5 pb-10">
//                 <div 
//                     className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
//                     style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
//                 >
//                     <User className="h-7 w-7" style={{ color: primaryColor }} />
//                 </div>
//                 <div>
//                     <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">Profile Settings</h1>
//                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">Institutional Identity Management</p>
//                 </div>
//             </header>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
//                 {/* ── MAIN REGISTRY FORM ── */}
//                 <div className="lg:col-span-2 space-y-6">
//                     <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
//                         <div className="space-y-10">
//                             <div className="flex items-center gap-3">
//                                 <Fingerprint className="h-4 w-4" style={{ color: primaryColor }} />
//                                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Personal Identification</h3>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                                 <div className="space-y-3">
//                                     <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Legal Name</label>
//                                     <div className="relative group">
//                                         <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
//                                         <input 
//                                             className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-5 text-white focus:border-school-primary outline-none transition-all font-black uppercase italic text-sm"
//                                             style={{ '--tw-ring-color': primaryColor } as any}
//                                             value={formData.name}
//                                             onChange={e => setFormData({...formData, name: e.target.value})}
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="space-y-3">
//                                     <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Contact Node (Phone)</label>
//                                     <div className="relative group">
//                                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
//                                         <input 
//                                             className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-5 text-white focus:border-school-primary outline-none transition-all font-mono"
//                                             style={{ '--tw-ring-color': primaryColor } as any}
//                                             value={formData.phone}
//                                             placeholder="+234..."
//                                             onChange={e => setFormData({...formData, phone: e.target.value})}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="space-y-3 opacity-40 grayscale-[0.8]">
//                                 <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1 italic">Read-Only Registry (Email)</label>
//                                 <div className="relative">
//                                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-800" />
//                                     <input 
//                                         disabled
//                                         className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-5 text-slate-600 cursor-not-allowed font-mono lowercase text-sm"
//                                         value={currentProfile.email}
//                                     />
//                                 </div>
//                             </div>

//                             <button 
//                                 onClick={handleSave}
//                                 disabled={isPending}
//                                 className="text-slate-950 font-black px-12 py-6 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-20 flex items-center gap-3 uppercase text-[10px] tracking-[0.3em]"
//                                 style={{ backgroundColor: primaryColor }}
//                             >
//                                 {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
//                                 Sync Personal Registry
//                             </button>
//                         </div>
//                     </Card>
//                 </div>

//                 {/* ── METADATA SIDEBAR ── */}
//                 <aside className="space-y-8">
//                     <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] p-10 shadow-xl">
//                         <h3 className="text-[10px] font-black uppercase text-slate-600 tracking-[0.3em] mb-10 italic">Institutional Metadata</h3>
                        
//                         <div className="space-y-8">
//                             <ContextItem icon={BadgeCheck} label="Access Tier" value={currentProfile.role} color="text-white" primaryColor={primaryColor} />
//                             <ContextItem icon={School} label="Current Registry" value={currentProfile.school?.name || 'Individual Learning'} primaryColor={primaryColor} />
//                             <ContextItem icon={Palette} label="Active Palette" value={currentProfile.primaryColor} primaryColor={primaryColor} />
//                         </div>
//                     </Card>

//                     <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-white/5 shadow-inner">
//                         <div className="flex items-center gap-3 mb-4">
//                             <ShieldCheck className="h-4 w-4 text-slate-600" />
//                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Registry Secure</span>
//                         </div>
//                         <p className="text-[10px] text-slate-600 leading-relaxed italic uppercase font-bold">
//                             Your institutional record is controlled by central administrative logic. Contact your registrar to modify restricted access tiers.
//                         </p>
//                     </div>
//                 </aside>
//             </div>
//         </div>
//     )
// }

// function ContextItem({ icon: Icon, label, value, color = "text-white", primaryColor }: ContextItemProps) {
//     return (
//         <div className="flex items-start gap-5 animate-in fade-in slide-in-from-right-4 duration-500">
//             <div className="p-3 bg-slate-950 rounded-xl border border-white/5 shadow-inner">
//                 <Icon className="h-5 w-5" style={{ color: primaryColor }} />
//             </div>
//             <div className="min-w-0">
//                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
//                 <p className={cn("text-sm font-bold uppercase truncate tracking-tighter mt-1 italic", color)}>{value}</p>
//             </div>
//         </div>
//     )
// }



'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { updatePersonalProfile } from '@/app/actions/profile'
import { 
    User, Mail, Phone, ShieldCheck, 
    Loader2, Save, School,
    Fingerprint, BadgeCheck, Palette,
    type LucideIcon
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'


// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface ProfileSettingsClientProps {
    initialProfile: any; 
}

interface ContextItemProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    color?: string;
}

/**
 * IDENTITY MANAGEMENT CONSOLE (Tier 3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function ProfileSettingsClient({ initialProfile }: ProfileSettingsClientProps) {
    const { profile, updateProfile } = useProfileStore();
    const [isPending, startTransition] = useTransition();

    const currentProfile = profile || initialProfile;

    const [formData, setFormData] = useState({
        name: currentProfile?.name || '',
        phone: currentProfile?.phone || ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                phone: profile.phone || ''
            });
        }
    }, [profile]);

    const handleSave = () => {
        if (!formData.name.trim()) return toast.error("Identity Protocol: Name is mandatory.");

        startTransition(async () => {
            try {
                const res = await updatePersonalProfile(formData);
                if (res.success) {
                    updateProfile(formData); 
                    toast.success("Identity registry synchronized.");
                } else {
                    toast.error("Registry update failed.");
                }
            } catch (err: unknown) {
                toast.error("Critical synchronization failure.");
            }
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
            {/* Rule 20: Fluid Container */}
            <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
                
                {/* ── HEADER (Rule 11/21) ── */}
                <header className="flex items-center gap-6 border-b border-border pb-10">
                    <div className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-lg transition-colors">
                        <User className="h-8 w-8 text-school-primary" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tighter uppercase italic leading-none">
                            Profile Settings
                        </h1>
                        <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
                            Institutional Identity Management
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12">
                    
                    {/* ── MAIN REGISTRY FORM (Rule 18/19) ── */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="bg-card border-border rounded-[2rem] p-8 md:p-12 shadow-xl">
                            <div className="space-y-12">
                                <div className="flex items-center gap-3">
                                    <Fingerprint className="h-5 w-5 text-school-primary" />
                                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-foreground italic">
                                        Personal Identification
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
                                            Full Identification
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
                                            <input 
                                                className="w-full bg-surface border border-border rounded-xl pl-12 pr-6 py-4 text-foreground focus:ring-2 focus:ring-school-primary-200 focus:border-school-primary outline-none transition-all font-extrabold uppercase italic text-sm"
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
                                            Contact Record (Phone)
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
                                            <input 
                                                className="w-full bg-surface border border-border rounded-xl pl-12 pr-6 py-4 text-foreground focus:ring-2 focus:ring-school-primary-200 focus:border-school-primary outline-none transition-all font-mono"
                                                value={formData.phone}
                                                placeholder="+234..."
                                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 opacity-40 grayscale pointer-events-none">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 italic">
                                        Read-Only Hub (Registry Email)
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input 
                                            disabled
                                            className="w-full bg-surface border border-border rounded-xl pl-12 pr-6 py-4 text-muted-foreground font-mono lowercase text-sm"
                                            value={currentProfile.email}
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border">
                                    <button 
                                        onClick={handleSave}
                                        disabled={isPending}
                                        className="w-full sm:w-auto bg-school-primary text-on-school-primary font-extrabold px-12 py-5 rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-school-primary-200 flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest"
                                    >
                                        {isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <><Save className="h-4 w-4" /> Sync Identity Record</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* ── METADATA SIDEBAR (Rule 11/21) ── */}
                    <aside className="space-y-8">
                        <Card className="bg-card border-border rounded-[2rem] p-8 md:p-10 shadow-xl overflow-hidden relative">
                            {/* Rule 21 Scale Decoration */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-school-primary-50 rounded-full blur-3xl opacity-50" />
                            
                            <h3 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-10 italic border-b border-border pb-4">
                                Institutional Metadata
                            </h3>
                            
                            <div className="space-y-8 relative z-10">
                                <ContextItem icon={BadgeCheck} label="Access Tier" value={currentProfile.role.replace(/_/g, ' ')} color="text-foreground" />
                                <ContextItem icon={School} label="Current Hub" value={currentProfile.school?.name || 'Individual Learner'} />
                                <ContextItem icon={Palette} label="Identity Color" value={currentProfile.primaryColor} />
                            </div>
                        </Card>

                        <div className="p-8 rounded-[2rem] bg-surface border border-border shadow-inner space-y-4">
                            <div className="flex items-center gap-3 text-school-primary">
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Registry Secure</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed italic font-medium">
                                Personal records are cryptographically isolated within the institutional tier. Modification of restricted access categories requires registrar authorization.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}

// ── Sub-Component (Rule 18/21) ──────────────────────────────────────────────

function ContextItem({ icon: Icon, label, value, color = "text-foreground" }: ContextItemProps) {
    return (
        <div className="flex items-start gap-5 group animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Rule 21: Scale Protocol Icon Box */}
            <div className="p-3 bg-surface rounded-xl border border-border shadow-sm group-hover:border-school-primary-200 transition-colors">
                <Icon className="h-5 w-5 text-school-primary opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="min-w-0 space-y-1">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
                <p className={cn("text-sm font-extrabold uppercase truncate tracking-tighter italic", color)}>
                    {value}
                </p>
            </div>
        </div>
    )
}