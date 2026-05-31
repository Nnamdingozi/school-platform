// 'use client'

// import { useProfileStore } from '@/store/profileStore'
// import { BillingSection } from '@/components/settings/billingSection'
// import { CreditCard, ShieldCheck, Zap } from 'lucide-react'
// import { type SchoolSettingsData } from '@/app/actions/school-settings.action'
// import { Role } from '@prisma/client'

// interface BillingHubClientProps {
//     initialData: SchoolSettingsData;
// }

// /**
//  * INSTITUTIONAL FINANCIAL CONSOLE (Tier 2)
//  * Rule 12: Hydrated by server-side props.
//  * Rule 17: Leverages Zustand for primary branding.
//  */
// export function BillingHubClient({ initialData }: BillingHubClientProps) {
//     const { profile } = useProfileStore();
//     const primaryColor = profile?.primaryColor || "#f59e0b";
    
//     // Rule 6 Context
//     const isIndependent = !profile?.schoolId || profile.role === Role.INDIVIDUAL_LEARNER;

//     return (
//         <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50 animate-in fade-in duration-700">
            
//             {/* ── HEADER ── */}
//             <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//                 <div className="flex items-center gap-5">
//                     <div 
//                         className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
//                         style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
//                     >
//                         <CreditCard className="h-7 w-7" style={{ color: primaryColor }} />
//                     </div>
//                     <div>
//                         <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">
//                             Financial Hub
//                         </h1>
//                         <p className="text-slate-500 text-sm mt-2 font-medium italic">
//                             Subscription & license oversight for {profile?.school?.name || "Personal Registry"}.
//                         </p>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-3 bg-slate-900 px-6 py-3 rounded-2xl border border-white/5 w-fit shadow-xl">
//                     <ShieldCheck className="h-4 w-4 text-emerald-500" />
//                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">
//                         Verified Transaction Terminal
//                     </span>
//                 </div>
//             </header>

//             {/* ── MAIN MODULE ── */}
//             <main className="max-w-5xl">
//                 {/* ✅ FIXED: Corrected prop names to match BillingSection interface */}
//                 <BillingSection 
//                     initialData={initialData} 
//                     isIndependent={isIndependent} 
//                 />
//             </main>

//             {/* ── FOOTER ── */}
//             <footer className="pt-10 border-t border-white/5">
//                 <div className="flex items-center gap-4 text-slate-600">
//                     <Zap className="h-4 w-4 opacity-40" style={{ color: primaryColor }} />
//                     <p className="text-[9px] font-black uppercase tracking-[0.4em] italic leading-none">
//                         License synchronization managed via Paystack Infrastructure
//                     </p>
//                 </div>
//             </footer>
//         </div>
//     )
// }



'use client'

import React from 'react'
import { useProfileStore } from '@/store/profileStore'
import { BillingSection } from '@/components/settings/billingSection'
import { CreditCard, ShieldCheck, Zap } from 'lucide-react'
import { type SchoolSettingsData } from '@/app/actions/school-settings.action'
import { Role } from '@prisma/client'


interface BillingHubClientProps {
    initialData: SchoolSettingsData;
}

export function BillingHubClient({ initialData }: BillingHubClientProps) {
    const { profile } = useProfileStore();
    const isIndependent = !profile?.schoolId || profile.role === Role.INDIVIDUAL_LEARNER;

    return (
        <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
                
                {/* ── HEADER ── */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
                    <div className="flex items-center gap-6">
                        {/* ✅ Corrected: Using bg-school-primary-100 from your CSS scale */}
                        <div className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-100 flex items-center justify-center shadow-lg transition-colors">
                            <CreditCard className="h-8 w-8 text-school-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tighter uppercase italic leading-none text-foreground">
                                Financial Hub
                            </h1>
                            <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
                                {/* ✅ Corrected: Using bg-school-primary without opacity */}
                                <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
                                Subscription & License Oversight: {profile?.school?.name || "Personal Registry"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-surface px-6 py-4 rounded-2xl border border-border w-fit shadow-inner">
                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">
                            Verified Transaction Terminal
                        </span>
                    </div>
                </header>

                <main className="w-full">
                    <BillingSection 
                        initialData={initialData} 
                        isIndependent={isIndependent} 
                    />
                </main>

                <footer className="pt-12 border-t border-border">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-muted-foreground/40 group">
                            {/* ✅ Corrected: No opacity modifier */}
                            <Zap className="h-4 w-4 transition-colors group-hover:text-school-primary" />
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] italic leading-none">
                                License synchronization managed via Paystack Infrastructure
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                            <span className="text-[8px] font-black uppercase tracking-tighter border border-border px-2 py-0.5 rounded">PCI-DSS</span>
                            <span className="text-[8px] font-black uppercase tracking-tighter border border-border px-2 py-0.5 rounded">256-BIT SSL</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}