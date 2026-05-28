


// 'use client'

// import { useState, useTransition } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import { School, ShieldCheck, Save, Loader2 } from 'lucide-react'
// import { updateSchoolProfile } from '@/app/actions/school-settings.action'
// import { updatePersonalProfile } from '@/app/actions/profile'
// import { useProfileStore } from '@/store/profileStore'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// export function ProfileSection({ data, onUpdate }: { data: any, onUpdate: any }) {
//     const { profile } = useProfileStore()
//     const [name, setName] = useState(data?.school?.name || profile?.name || "")
//     const [isPending, startTransition] = useTransition()
//     const primaryColor = profile?.primaryColor || "#f59e0b"

//     const handleSave = () => {
//         startTransition(async () => {
//             const res = profile?.schoolId 
//                 ? await updateSchoolProfile(profile.schoolId, { name, primaryColor: profile.primaryColor, secondaryColor: profile.secondaryColor })
//                 : await updatePersonalProfile({ name });

//             if (res.success) {
//                 toast.success("Identity Synchronization Complete");
//                 if (onUpdate) onUpdate({ school: { ...data?.school, name } });
//             } else {
//                 toast.error("Failed to update registry.");
//             }
//         })
//     }

//     return (
//         <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in duration-500">
//             <CardHeader className="p-8 bg-slate-950/50 border-b border-white/5">
//                 <CardTitle className="text-lg font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
//                     <School className="h-5 w-5" style={{ color: primaryColor }} /> Registry Identity
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="p-8 space-y-8">
//                 <div className="space-y-4">
//                     <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
//                         {profile?.schoolId ? "Institutional Name" : "Display Name"}
//                     </Label>
//                     <input 
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-school-primary outline-none transition-all font-bold uppercase italic"
//                         style={{ '--tw-ring-color': primaryColor } as any}
//                     />
//                 </div>

//                 <div className="pt-4 border-t border-white/5 flex justify-between items-center">
//                     <div className="flex items-center gap-2 text-slate-600">
//                         <ShieldCheck className="h-4 w-4" />
//                         <span className="text-[9px] font-black uppercase tracking-widest">Secure Metadata Update</span>
//                     </div>
//                     <button 
//                         onClick={handleSave}
//                         disabled={isPending}
//                         className="px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center gap-2"
//                         style={{ backgroundColor: primaryColor, color: '#000' }}
//                     >
//                         {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Persist Changes</>}
//                     </button>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }




'use client'

import React, { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { School, ShieldCheck, Save, Loader2, User } from 'lucide-react'
import { updateSchoolProfile } from '@/app/actions/school-settings.action'
import { updatePersonalProfile } from '@/app/actions/profile'
import { useProfileStore } from '@/store/profileStore'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface ProfileSectionProps {
    data: {
        school?: {
            name: string;
        };
    };
    onUpdate: (updated: any) => void;
}

/**
 * REGISTRY IDENTITY HUB (Tier 2/3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-card, bg-surface, border-border).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function ProfileSection({ data, onUpdate }: ProfileSectionProps) {
    const { profile } = useProfileStore()
    const [name, setName] = useState(data?.school?.name || profile?.name || "")
    const [isPending, startTransition] = useTransition()

    const handleSave = () => {
        if (!name.trim()) return toast.error("Identity Error: Name cannot be null.");

        startTransition(async () => {
            try {
                const res = profile?.schoolId 
                    ? await updateSchoolProfile(profile.schoolId, { 
                        name, 
                        primaryColor: profile.primaryColor, 
                        secondaryColor: profile.secondaryColor 
                      })
                    : await updatePersonalProfile({ name });

                if (res.success) {
                    toast.success("Identity Synchronization Complete.");
                    if (onUpdate) onUpdate({ school: { ...data?.school, name } });
                } else {
                    toast.error("Registry update failed.");
                }
            } catch (err) {
                toast.error("Protocol Breach: Synchronization aborted.");
            }
        })
    }

    return (
        <Card className="bg-card border-border rounded-[2rem] overflow-hidden shadow-xl animate-in fade-in duration-500">
            {/* ── HEADER (Rule 18/21) ── */}
            <CardHeader className="p-6 md:p-8 bg-surface/50 border-b border-border">
                <CardTitle className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter flex items-center gap-4">
                    {/* Rule 21: Scale Protocol Icon Container */}
                    <div className="h-10 w-10 rounded-xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center shadow-inner">
                        {profile?.schoolId ? (
                            <School className="h-5 w-5 text-school-primary" />
                        ) : (
                            <User className="h-5 w-5 text-school-primary" />
                        )}
                    </div>
                    Registry Identity
                </CardTitle>
            </CardHeader>

            <CardContent className="p-6 md:p-10 space-y-10">
                {/* ── IDENTITY FIELD ── */}
                <div className="space-y-4 group">
                    <Label className="text-[10px] font-semibold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
                        {profile?.schoolId ? "Institutional Identification" : "Personal Display Identity"}
                    </Label>
                    <input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Registry Name..."
                        className={cn(
                            "w-full px-6 py-5 outline-none transition-all",
                            "bg-surface border border-border rounded-2xl shadow-sm", // Rule 18/19
                            "text-base font-extrabold text-foreground uppercase italic tracking-tight",
                            "focus:ring-2 focus:ring-school-primary-200 focus:border-school-primary", // Rule 21
                            "placeholder:text-muted-foreground/30"
                        )}
                    />
                    <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest ml-1 italic opacity-60">
                        This identity will be visible across all academic modules and reports.
                    </p>
                </div>

                {/* ── FOOTER ACTIONS ── */}
                <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3 text-muted-foreground/60">
                        <ShieldCheck className="h-4 w-4 text-school-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest italic">
                            Authorized Metadata Update
                        </span>
                    </div>
                    
                    <button 
                        onClick={handleSave}
                        disabled={isPending}
                        className={cn(
                            "w-full sm:w-auto px-10 py-4 rounded-xl transition-all shadow-xl active:scale-95",
                            "bg-school-primary text-on-school-primary font-extrabold text-[10px] uppercase tracking-widest", // Rule 18 Contrast
                            "hover:brightness-110 shadow-school-primary-200 disabled:opacity-20"
                        )}
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <Save className="h-4 w-4" />
                                Persist Hub Changes
                            </div>
                        )}
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}