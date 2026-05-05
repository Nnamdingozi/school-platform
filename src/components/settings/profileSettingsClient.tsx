'use client'

import { useState, useTransition, useEffect } from 'react'
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
import { Role } from '@prisma/client'

// ── Types ──────────────────────────────────────────────────────────────────────

interface ProfileSettingsClientProps {
    initialProfile: any; // Syncs with Server Action return
}

interface ContextItemProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    color?: string;
    primaryColor: string;
}

/**
 * IDENTITY MANAGEMENT CONSOLE (Tier 3)
 * Rule 14: Optimistic UI updates to Zustand store.
 * Rule 17: Injects school branding from Zustand.
 */
export function ProfileSettingsClient({ initialProfile }: ProfileSettingsClientProps) {
    const { profile, updateProfile } = useProfileStore();
    const [isPending, startTransition] = useTransition();

    // Use current store state but fallback to initial server data
    const currentProfile = profile || initialProfile;
    const primaryColor = currentProfile?.primaryColor || "#f59e0b";

    const [formData, setFormData] = useState({
        name: currentProfile?.name || '',
        phone: currentProfile?.phone || ''
    });

    // Rule 11: Sync form with store data if it changes elsewhere
    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                phone: profile.phone || ''
            });
        }
    }, [profile]);

    const handleSave = () => {
        if (!formData.name.trim()) return toast.error("Identity requires a valid name.");

        startTransition(async () => {
            try {
                // Rule 10: Backend Security enforced in Action
                const res = await updatePersonalProfile(formData);
                
                if (res.success) {
                    // Rule 14: Synchronize global store for instant UI feedback
                    updateProfile(formData); 
                    toast.success("Identity registry synchronized.");
                } else {
                    toast.error(res.error || "Update failed.");
                }
            } catch (err: unknown) {
                toast.error("Critical connection failure to registry.");
            }
        });
    };

    return (
        <div className="p-4 md:p-8 lg:p-12 bg-slate-950 min-h-screen text-slate-50 space-y-10 font-sans animate-in fade-in duration-700">
            
            {/* ── HEADER ── */}
            <header className="flex items-center gap-5 border-b border-white/5 pb-10">
                <div 
                    className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
                    style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
                >
                    <User className="h-7 w-7" style={{ color: primaryColor }} />
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">Profile Settings</h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">Institutional Identity Management</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* ── MAIN REGISTRY FORM ── */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                        <div className="space-y-10">
                            <div className="flex items-center gap-3">
                                <Fingerprint className="h-4 w-4" style={{ color: primaryColor }} />
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Personal Identification</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Legal Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
                                        <input 
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-5 text-white focus:border-school-primary outline-none transition-all font-black uppercase italic text-sm"
                                            style={{ '--tw-ring-color': primaryColor } as any}
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Contact Node (Phone)</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
                                        <input 
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-5 text-white focus:border-school-primary outline-none transition-all font-mono"
                                            style={{ '--tw-ring-color': primaryColor } as any}
                                            value={formData.phone}
                                            placeholder="+234..."
                                            onChange={e => setFormData({...formData, phone: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 opacity-40 grayscale-[0.8]">
                                <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1 italic">Read-Only Registry (Email)</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-800" />
                                    <input 
                                        disabled
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-5 text-slate-600 cursor-not-allowed font-mono lowercase text-sm"
                                        value={currentProfile.email}
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleSave}
                                disabled={isPending}
                                className="text-slate-950 font-black px-12 py-6 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-20 flex items-center gap-3 uppercase text-[10px] tracking-[0.3em]"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Sync Personal Registry
                            </button>
                        </div>
                    </Card>
                </div>

                {/* ── METADATA SIDEBAR ── */}
                <aside className="space-y-8">
                    <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] p-10 shadow-xl">
                        <h3 className="text-[10px] font-black uppercase text-slate-600 tracking-[0.3em] mb-10 italic">Institutional Metadata</h3>
                        
                        <div className="space-y-8">
                            <ContextItem icon={BadgeCheck} label="Access Tier" value={currentProfile.role} color="text-white" primaryColor={primaryColor} />
                            <ContextItem icon={School} label="Current Registry" value={currentProfile.school?.name || 'Individual Learning'} primaryColor={primaryColor} />
                            <ContextItem icon={Palette} label="Active Palette" value={currentProfile.primaryColor} primaryColor={primaryColor} />
                        </div>
                    </Card>

                    <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-white/5 shadow-inner">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldCheck className="h-4 w-4 text-slate-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Registry Secure</span>
                        </div>
                        <p className="text-[10px] text-slate-600 leading-relaxed italic uppercase font-bold">
                            Your institutional record is controlled by central administrative logic. Contact your registrar to modify restricted access tiers.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    )
}

function ContextItem({ icon: Icon, label, value, color = "text-white", primaryColor }: ContextItemProps) {
    return (
        <div className="flex items-start gap-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="p-3 bg-slate-950 rounded-xl border border-white/5 shadow-inner">
                <Icon className="h-5 w-5" style={{ color: primaryColor }} />
            </div>
            <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
                <p className={cn("text-sm font-bold uppercase truncate tracking-tighter mt-1 italic", color)}>{value}</p>
            </div>
        </div>
    )
}