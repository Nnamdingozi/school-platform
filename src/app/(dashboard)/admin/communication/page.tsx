
// 'use client'

// import { WhatsAppHub } from "@/components/communication/whatsAppHub"
// import { useProfileStore } from "@/store/profileStore"
// import { MessageCircle } from "lucide-react"

// export default function CommunicationPage() {
//     const { profile } = useProfileStore()
//     if (!profile?.schoolId) return null

//     return (
//         <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50">
//             <header className="border-b border-white/5 pb-10">
//                 <div className="flex items-center gap-5">
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center">
//                         <MessageCircle className="h-7 w-7 text-school-primary" />
//                     </div>
//                     <div>
//                         <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">WhatsApp Control</h1>
//                         <p className="text-slate-500 text-sm mt-2 font-medium">Global communication hub and message credit management.</p>
//                     </div>
//                 </div>
//             </header>

//             <WhatsAppHub schoolId={profile.schoolId} />
//         </div>
//     )
// }


// 'use client'

// import { WhatsAppHub } from '@/components/communication/whatsAppHub'
// import { useProfileStore } from '@/store/profileStore'
// import { MessageCircle, Loader2 } from 'lucide-react'

// export default function CommunicationPage() {
//     const { profile, isLoading } = useProfileStore()

//     if (isLoading) return (
//         <div className="min-h-screen bg-school-secondary-950 flex items-center justify-center">
//             <div className="flex items-center gap-2.5">
//                 <Loader2 className="h-5 w-5 animate-spin text-school-primary" />
//                 <span className="text-sm text-school-secondary-400">Loading...</span>
//             </div>
//         </div>
//     )

//     if (!profile?.schoolId) return null

//     return (
//         <div className="min-h-screen bg-school-secondary-950">
//             <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

//                 {/* ── Page header ── */}
//                 <div className="flex items-center gap-3">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20">
//                         <MessageCircle className="h-5 w-5 text-school-primary" />
//                     </div>
//                     <div>
//                         <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
//                             WhatsApp Communication
//                         </h1>
//                         <p className="text-xs text-school-secondary-400">
//                             Credit management and message history
//                         </p>
//                     </div>
//                 </div>

//                 {/* ── Content ── */}
//                 <WhatsAppHub schoolId={profile.schoolId} />

//             </div>
//         </div>
//     )
// }



// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { WhatsAppHub } from "@/components/communication/whatsAppHub";
// import { MessageCircle, ShieldAlert } from "lucide-react";
// import { Role } from "@prisma/client";
// import {getCommunicationStats} from "@/app/actions/communication.action"

// /**
//  * Rule 16: Contextual SEO
//  */
// export async function generateMetadata(): Promise<Metadata> {
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return { title: "Communication | SchoolPaaS" };

//     const profile = await prisma.profile.findUnique({
//         where: { id: user.id },
//         include: { school: { select: { name: true } } }
//     });


 
// const statsRes = await getCommunicationStats(profile.schoolId);
// if (!statsRes.success || !statsRes.stats) return <div>Registry Offline</div>;



//     return {
//         title: `WhatsApp Hub | ${profile?.school?.name || "Institution"} | SchoolPaaS`,
//         description: "Manage institutional WhatsApp credits and communication logs."
//     };
// }

// /**
//  * Rule 12: Server-First Authentication & Data Fetching
//  */
// export default async function CommunicationPage() {
//     // 1. Resolve Identity (Rule 10)
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) redirect("/login");

//     const profile = await prisma.profile.findUnique({
//         where: { id: user.id },
//         select: { id: true, schoolId: true, role: true }
//     });

//     if (!profile) redirect("/login");

//     /**
//      * Rule 6 & 13: Independent User Guard
//      * Communication Hub is a Tier-2 Institutional feature.
//      * Redirect learners who do not belong to a school.
//      */
//     if (!profile.schoolId || profile.role === Role.INDIVIDUAL_LEARNER) {
//         redirect("/student?error=access_restricted_institutional");
//     }

//     // Rule 10: Security - Ensure only Admins can manage billing/credits
//     if (profile.role !== Role.SCHOOL_ADMIN && profile.role !== Role.SUPER_ADMIN) {
//         redirect("/teacher?error=unauthorized_admin_feature");
//     }

//     return (
//         <div className="min-h-screen bg-slate-950">
//             <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

//                 {/* ── Page Header ── */}
//                 <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//                     <div className="flex items-center gap-5">
//                         <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-school-primary/10 border border-school-primary/20 shadow-2xl shadow-school-primary/5">
//                             <MessageCircle className="h-7 w-7 text-school-primary" />
//                         </div>
//                         <div>
//                             <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
//                                 WhatsApp Hub
//                             </h1>
//                             <p className="text-slate-500 text-sm mt-2 font-medium italic">
//                                 Institutional credit management & transmission registry.
//                             </p>
//                         </div>
//                     </div>
//                 </header>

//                 {/* ── Content (Client Component) ── */}
//                 <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
//                 <WhatsAppHub initialStats={statsRes.stats} />;
//                 </main>

//             </div>
//         </div>
//     );
// }


import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { WhatsAppHub } from "@/components/communication/whatsAppHub";
import { MessageCircle } from "lucide-react";
import { Role } from "@prisma/client";
import { getCommunicationStats } from "@/app/actions/communication.action";

/**
 * Rule 16: Contextual SEO
 * Fixed: Returns a strict Metadata object and handles null profile safely.
 */
export async function generateMetadata(): Promise<Metadata> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { title: "Communication | SchoolPaaS" };

    const profile = await prisma.profile.findFirst({
        where: { id: user.id },
        include: { school: { select: { name: true } } }
    });

    const schoolName = profile?.school?.name || "Institution";

    return {
        title: `WhatsApp Hub | ${schoolName} | SchoolPaaS`,
        description: `Manage credits and transmission history for ${schoolName}.`
    };
}

/**
 * Rule 12: Server-First Authentication & Data Fetching
 */
export default async function CommunicationPage() {
    // 1. Identity Verification (Rule 10)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const profile = await prisma.profile.findUnique({
        where: { id: user.id },
        select: { id: true, schoolId: true, role: true }
    });

    if (!profile) redirect("/login");

    /**
     * Rule 6 & 13: Independent User Guard
     * Communication tools are restricted to Tier-2 Institutional users.
     */
    if (!profile.schoolId || profile.role === Role.INDIVIDUAL_LEARNER) {
        redirect("/student?error=access_restricted");
    }

    // Role Gate: Only Admins can manage institutional billing
    if (profile.role !== Role.SCHOOL_ADMIN && profile.role !== Role.SUPER_ADMIN) {
        redirect("/teacher?error=unauthorized");
    }

    // 2. Server-Side Data Fetching (Rule 11 & 12)
    const statsRes = await getCommunicationStats(profile.schoolId);

    if (!statsRes.success || !statsRes.stats) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center max-w-sm">
                    <p className="text-red-500 font-black uppercase italic tracking-tighter">Registry Offline</p>
                    <p className="text-slate-500 text-xs mt-2 uppercase">Unable to synchronize institutional communication data.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

                {/* ── Page Header ── */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                    <div className="flex items-center gap-5">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-school-primary/10 border border-school-primary/20 shadow-2xl shadow-school-primary/5">
                            <MessageCircle className="h-7 w-7 text-school-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
                                WhatsApp Hub
                            </h1>
                            <p className="text-slate-500 text-sm mt-2 font-medium italic">
                                Institutional credit management & transmission registry.
                            </p>
                        </div>
                    </div>
                </header>

                {/* ── Content (Client Component receives Server Data) ── */}
                <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <WhatsAppHub initialStats={statsRes.stats} />
                </main>

            </div>
        </div>
    );
}