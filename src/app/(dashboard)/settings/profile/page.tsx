// // 'use client'

// // import { useState, useTransition, useEffect } from 'react'
// // import { useProfileStore } from '@/store/profileStore'
// // import { updatePersonalProfile } from '@/app/actions/profile.actions'
// // import { 
// //     User, Mail, Phone, ShieldCheck, 
// //     Loader2, Save, School,
// //     Fingerprint, BadgeCheck, Palette 
// // } from 'lucide-react'
// // import { Card } from '@/components/ui/card'
// // import { toast } from 'sonner'
// // import { cn } from '@/lib/utils'

// // export default function ProfileSettingsPage() {
// //     const { profile, updateProfile } = useProfileStore()
// //     const [isPending, startTransition] = useTransition()

// //     // Form State initialization
// //     const [formData, setFormData] = useState({
// //         name: '',
// //         phone: ''
// //     })

// //     // Sync form with store data when profile loads
// //     useEffect(() => {
// //         if (profile) {
// //             setFormData({
// //                 name: profile.name || '',
// //                 phone: profile.phone || ''
// //             })
// //         }
// //     }, [profile])

// //     if (!profile) return null

// //     const handleSave = () => {
// //         if (!formData.name) return toast.error("Identity requires a name.")

// //         startTransition(async () => {
// //             const res = await updatePersonalProfile(formData)
// //             if (res.success) {
// //                 updateProfile(formData) 
// //                 toast.success("Identity registry synchronized.")
// //             } else {
// //                 toast.error(res.error || "Update failed.")
// //             }
// //         })
// //     }

// //     return (
// //         <div className="p-4 md:p-8 lg:p-12 bg-slate-950 min-h-screen text-slate-50 space-y-10">
// //             {/* Header */}
// //             <header className="flex items-center gap-5 border-b border-white/5 pb-10">
// //                 <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
// //                     <User className="h-7 w-7 text-school-primary" />
// //                 </div>
// //                 <div>
// //                     <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">Profile Settings</h1>
// //                     <p className="text-slate-500 text-sm mt-2">Update your institutional identity and contact nodes.</p>
// //                 </div>
// //             </header>

// //             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
// //                 {/* Main Form */}
// //                 <div className="lg:col-span-2 space-y-6">
// //                     <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
// //                         <div className="space-y-8">
// //                             <h3 className="text-xs font-black uppercase text-school-primary tracking-[0.2em] flex items-center gap-2">
// //                                 <Fingerprint className="h-4 w-4" /> Personal Registry
// //                             </h3>

// //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //                                 <div className="space-y-3">
// //                                     <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Name</label>
// //                                     <div className="relative">
// //                                         <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
// //                                         <input 
// //                                             className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-school-primary outline-none transition-all font-bold"
// //                                             value={formData.name}
// //                                             onChange={e => setFormData({...formData, name: e.target.value})}
// //                                         />
// //                                     </div>
// //                                 </div>

// //                                 <div className="space-y-3">
// //                                     <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Phone Number</label>
// //                                     <div className="relative">
// //                                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
// //                                         <input 
// //                                             className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-school-primary outline-none transition-all font-mono"
// //                                             value={formData.phone}
// //                                             placeholder="+234..."
// //                                             onChange={e => setFormData({...formData, phone: e.target.value})}
// //                                         />
// //                                     </div>
// //                                 </div>
// //                             </div>

// //                             <div className="space-y-3 opacity-40">
// //                                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Identity (Locked)</label>
// //                                 <div className="relative">
// //                                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-800" />
// //                                     <input 
// //                                         disabled
// //                                         className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-slate-600 cursor-not-allowed"
// //                                         value={profile.email}
// //                                     />
// //                                 </div>
// //                             </div>

// //                             <button 
// //                                 onClick={handleSave}
// //                                 disabled={isPending}
// //                                 className="bg-school-primary text-school-secondary-950 font-black px-12 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-school-primary/20 disabled:opacity-50 flex items-center gap-3 uppercase text-[10px] tracking-widest"
// //                             >
// //                                 {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
// //                                 Sync Changes
// //                             </button>
// //                         </div>
// //                     </Card>
// //                 </div>

// //                 {/* Sidebar Info */}
// //                 <aside className="space-y-6">
// //                     <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] p-8 shadow-xl">
// //                         <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-8 italic">Institutional Metadata</h3>
                        
// //                         <div className="space-y-6">
// //                             <ContextItem icon={BadgeCheck} label="Role" value={profile.role} color="text-school-primary" />
// //                             <ContextItem icon={School} label="School" value={profile.school?.name || 'Standard'} />
// //                             <ContextItem icon={Palette} label="Primary Theme" value={profile.primaryColor} />
// //                         </div>
// //                     </Card>

// //                     <div className="p-6 bg-school-primary/5 border border-school-primary/10 rounded-[2rem]">
// //                         <div className="flex items-center gap-3 text-school-primary mb-3">
// //                             <ShieldCheck className="h-4 w-4" />
// //                             <span className="text-[10px] font-black uppercase tracking-widest">Registry Secure</span>
// //                         </div>
// //                         <p className="text-[11px] text-slate-500 leading-relaxed italic font-medium">
// //                             Your institutional record is managed by the central administrative vault. Personal details are encrypted.
// //                         </p>
// //                     </div>
// //                 </aside>
// //             </div>
// //         </div>
// //     )
// // }

// // function ContextItem({ icon: Icon, label, value, color = "text-white" }: any) {
// //     return (
// //         <div className="flex items-start gap-4">
// //             <div className="p-2 bg-slate-950 rounded-xl border border-white/5">
// //                 <Icon className="h-4 w-4 text-slate-600" />
// //             </div>
// //             <div className="min-w-0">
// //                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</p>
// //                 <p className={cn("text-xs font-bold uppercase truncate tracking-tight", color)}>{value}</p>
// //             </div>
// //         </div>
// //     )
// // }



// 'use client'

// import { useState, useTransition, useEffect } from 'react'
// import { useProfileStore } from '@/store/profileStore'
// import { updatePersonalProfile } from '@/app/actions/profile.actions'
// import { 
//     User, Mail, Phone, ShieldCheck, 
//     Loader2, Save, School,
//     Fingerprint, BadgeCheck, Palette,
//     type LucideIcon // ✅ Added LucideIcon type
// } from 'lucide-react'
// import { Card } from '@/components/ui/card'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// export default function ProfileSettingsPage() {
//     const { profile, updateProfile } = useProfileStore()
//     const [isPending, startTransition] = useTransition()

//     // Form State initialization
//     const [formData, setFormData] = useState({
//         name: '',
//         phone: ''
//     })

//     // Sync form with store data when profile loads
//     useEffect(() => {
//         if (profile) {
//             setFormData({
//                 name: profile.name || '',
//                 phone: profile.phone || ''
//             })
//         }
//     }, [profile])

//     if (!profile) return null

//     const handleSave = () => {
//         if (!formData.name) return toast.error("Identity requires a name.")

//         startTransition(async () => {
//             const res = await updatePersonalProfile(formData)
//             if (res.success) {
//                 updateProfile(formData) 
//                 toast.success("Identity registry synchronized.")
//             } else {
//                 toast.error(res.error || "Update failed.")
//             }
//         })
//     }

//     return (
//         <div className="p-4 md:p-8 lg:p-12 bg-slate-950 min-h-screen text-slate-50 space-y-10 font-sans">
//             {/* Header */}
//             <header className="flex items-center gap-5 border-b border-white/5 pb-10">
//                 <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
//                     <User className="h-7 w-7 text-school-primary" />
//                 </div>
//                 <div>
//                     <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">Profile Settings</h1>
//                     <p className="text-slate-500 text-sm mt-2 font-medium">Update your institutional identity and contact nodes.</p>
//                 </div>
//             </header>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
//                 {/* Main Form */}
//                 <div className="lg:col-span-2 space-y-6">
//                     <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] p-10 shadow-2xl shadow-black/50">
//                         <div className="space-y-8">
//                             <h3 className="text-xs font-black uppercase text-school-primary tracking-[0.2em] flex items-center gap-2">
//                                 <Fingerprint className="h-4 w-4" /> Personal Registry
//                             </h3>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                                 <div className="space-y-3">
//                                     <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Name</label>
//                                     <div className="relative">
//                                         <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
//                                         <input 
//                                             className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-school-primary outline-none transition-all font-bold uppercase italic"
//                                             value={formData.name}
//                                             onChange={e => setFormData({...formData, name: e.target.value})}
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="space-y-3">
//                                     <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Phone Number</label>
//                                     <div className="relative">
//                                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
//                                         <input 
//                                             className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-school-primary outline-none transition-all font-mono"
//                                             value={formData.phone}
//                                             placeholder="+234..."
//                                             onChange={e => setFormData({...formData, phone: e.target.value})}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="space-y-3 opacity-40">
//                                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Identity (Locked)</label>
//                                 <div className="relative">
//                                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-800" />
//                                     <input 
//                                         disabled
//                                         className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-slate-600 cursor-not-allowed font-mono lowercase"
//                                         value={profile.email}
//                                     />
//                                 </div>
//                             </div>

//                             <button 
//                                 onClick={handleSave}
//                                 disabled={isPending}
//                                 className="bg-school-primary text-school-secondary-950 font-black px-12 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-school-primary/20 disabled:opacity-50 flex items-center gap-3 uppercase text-[10px] tracking-widest"
//                             >
//                                 {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
//                                 Sync Changes
//                             </button>
//                         </div>
//                     </Card>
//                 </div>

//                 {/* Sidebar Info */}
//                 <aside className="space-y-6">
//                     <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] p-8 shadow-xl">
//                         <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-8 italic">Institutional Metadata</h3>
                        
//                         <div className="space-y-6">
//                             <ContextItem icon={BadgeCheck} label="Role" value={profile.role} color="text-school-primary" />
//                             <ContextItem icon={School} label="School" value={profile.school?.name || 'Standard'} />
//                             <ContextItem icon={Palette} label="Primary Theme" value={profile.primaryColor} />
//                         </div>
//                     </Card>

//                     <div className="p-6 bg-school-primary/5 border border-school-primary/10 rounded-[2rem]">
//                         <div className="flex items-center gap-3 text-school-primary mb-3">
//                             <ShieldCheck className="h-4 w-4" />
//                             <span className="text-[10px] font-black uppercase tracking-widest">Registry Secure</span>
//                         </div>
//                         <p className="text-[11px] text-slate-500 leading-relaxed italic font-medium">
//                             Your institutional record is managed by the central administrative vault. Personal details are encrypted.
//                         </p>
//                     </div>
//                 </aside>
//             </div>
//         </div>
//     )
// }

// // ✅ FIX: Define specific interface to resolve "Unexpected any" error
// interface ContextItemProps {
//     icon: LucideIcon;
//     label: string;
//     value: string | number;
//     color?: string;
// }

// function ContextItem({ icon: Icon, label, value, color = "text-white" }: ContextItemProps) {
//     return (
//         <div className="flex items-start gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
//             <div className="p-2.5 bg-slate-950 rounded-xl border border-white/5 shadow-inner">
//                 <Icon className="h-4 w-4 text-slate-600" />
//             </div>
//             <div className="min-w-0">
//                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
//                 <p className={cn("text-xs font-bold uppercase truncate tracking-tight mt-0.5", color)}>{value}</p>
//             </div>
//         </div>
//     )
// }


// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { ProfileSettingsClient } from "@/components/settings/profileSettingsClient";

// /**
//  * Rule 16: Contextual SEO
//  */
// export async function generateMetadata(): Promise<Metadata> {
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return { title: "Profile Settings | SchoolPaaS" };

//     const profile = await prisma.profile.findUnique({
//         where: { id: user.id },
//         select: { name: true, email: true }
//     });

//     const displayName = profile?.name || profile?.email || "User";

//     return {
//         title: `Profile | ${displayName} | SchoolPaaS`,
//         description: "Manage your institutional identity and contact nodes."
//     };
// }

// /**
//  * Rule 12: Server-First Fetching
//  */
// export default async function Page() {
//     // 1. Authenticate (Rule 10)
//     const supabase = await createClient();
//     const { data: { user: authUser } } = await supabase.auth.getUser();
//     if (!authUser) redirect("/login");

//     // 2. Fetch Registry Truth (Rule 11)
//     const profile = await prisma.profile.findUnique({
//         where: { id: authUser.id },
//         include: { 
//             school: { select: { name: true } } 
//         }
//     });

//     if (!profile) redirect("/login?error=profile_not_found");

//     return (
//         <ProfileSettingsClient 
//             initialProfile={profile as any} 
//         />
//     );
// }




// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { ProfileSettingsClient } from "@/components/settings/profileSettingsClient";
// import { Profile } from "@prisma/client";

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// /**
//  * Interface representing a Profile hydrated with its Institutional Hub.
//  */
// interface HydratedIdentityProfile extends Profile {
//     school: {
//         name: string;
//     } | null;
// }

// /**
//  * IDENTITY REGISTRY | SERVER PAGE
//  * Rule 16: Dynamic Contextual SEO - Hub-specific indexing.
//  */
// export async function generateMetadata(): Promise<Metadata> {
//     const supabase = await createClient();
//     const { data: { user: authUser } } = await supabase.auth.getUser();
    
//     if (!authUser) return { title: "Profile Settings | SchoolPaaS" };

//     const profile = await prisma.profile.findUnique({
//         where: { id: authUser.id },
//         select: { name: true, email: true }
//     });

//     const displayName = profile?.name || profile?.email || "Registry User";

//     return {
//         title: `Identity Hub | ${displayName} | SchoolPaaS`,
//         description: "Manage your institutional identity records and communication hubs."
//     };
// }

// /**
//  * PROFILE SETTINGS PAGE (Tier 3)
//  * Rule 12: Server-First Execution. Handles identity verification and registry hydration.
//  * Rule 15: Pure TypeScript - Zero 'any' types in the identity pipeline.
//  */
// export default async function ProfileSettingsPage() {
//     // 1. Resolve Identity Hub & Verification (Rule 10)
//     const supabase = await createClient();
//     const { data: { user: authUser } } = await supabase.auth.getUser();
//     if (!authUser) redirect("/login");

//     // 2. Authoritative Data Hydration (Rule 11)
//     // We fetch the full profile record including the linked school name.
//     const profile = await prisma.profile.findUnique({
//         where: { id: authUser.id },
//         include: { 
//             school: { select: { name: true } } 
//         }
//     });

//     if (!profile) {
//         redirect("/login?error=identity_not_discovered");
//     }

//     // 3. Client-Side Protocol Handoff (Rule 15)
//     // Normalized casting to ensure strict type synchronization with the client console.
//     const initialProfile = profile as HydratedIdentityProfile;

//     return (
//         <main className="min-h-screen bg-background">
//             <ProfileSettingsClient 
//                 initialProfile={initialProfile} 
//             />
//         </main>
//     );
// }


import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { ProfileSettingsClient } from "@/components/settings/profileSettingsClient";
import { getErrorMessage } from "@/lib/error-handler";
import { type AnyProfile } from "@/types/profile";

/**
 * IDENTITY REGISTRY | SERVER PAGE
 * Rule 16: Dynamic Contextual SEO
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) return { title: "Profile Hub | SchoolPaaS" };

    const profile = await prisma.profile.findUnique({
        where: { id: authUser.id },
        select: { name: true, email: true }
    });

    const displayName = profile?.name || "Registry User";

    return {
        title: `Identity Hub | ${displayName} | SchoolPaaS`,
        description: "Manage institutional identity records and communication hubs."
    };
}

/**
 * PROFILE SETTINGS PAGE (Tier 3)
 * Rule 12: Server-First Execution.
 * Rule 15: Zero 'any' types. Resolved Variance conflict via Unknown-Bridge.
 * Rule 23: Explicit Error Protocol with standardized extraction.
 */
export default async function ProfileSettingsPage() {
    try {
        // 1. Resolve Identity Hub & Verification (Rule 10)
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) redirect("/login");

        // 2. Authoritative Hub Hydration (Rule 11)
        // We fetch the profile and its associated Institutional Hub Branding
        const profileData = await prisma.profile.findUnique({
            where: { id: authUser.id },
            include: { 
                school: { 
                    select: { 
                        name: true,
                        primaryColor: true,
                        secondaryColor: true
                    } 
                } 
            }
        });

        if (!profileData) {
            redirect("/login?error=identity_not_discovered");
        }

        // 3. Registry Bridge Protocol (Rule 15)
        // ✅ RESOLVED: Casting to AnyProfile via unknown bridge to satisfy Component Interface.
        // This ensures properties like 'primaryColor' are correctly inherited from the School Tier.
        const initialProfile = (profileData as unknown) as AnyProfile;

        return (
            <main className="min-h-screen bg-background">
                <ProfileSettingsClient 
                    initialProfile={initialProfile} 
                />
            </main>
        );

    } catch (error: unknown) {
        // ✅ Rule 23: Explicit Error Protocol
        const message = getErrorMessage(error);
        console.error(`[IDENTITY_HUB_SERVER_FAULT]: ${message}`);

        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-card border border-destructive/20 p-8 rounded-[2rem] text-center space-y-4 shadow-xl">
                    <h2 className="text-xl font-extrabold text-destructive uppercase italic tracking-tighter leading-none">
                        Registry Protocol Error
                    </h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                        {message}
                    </p>
                    <div className="pt-4">
                        <a href="/dashboard" className="text-[10px] font-extrabold text-school-primary uppercase tracking-widest hover:underline">
                            Return to Command Core
                        </a>
                    </div>
                </div>
            </main>
        );
    }
}