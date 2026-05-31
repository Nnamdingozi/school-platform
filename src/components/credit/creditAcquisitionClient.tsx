// 'use client'

// import { useState } from 'react';
// import { initiateCreditsPayment } from '@/app/actions/credits';
// import { useProfileStore } from '@/store/profileStore';
// import { Loader2, Zap, ArrowRight, Shield, MessageSquare } from 'lucide-react';
// import { toast } from 'sonner';
// import { PackageCard } from './packageCard';
// import { getErrorMessage } from '@/lib/error-handler';

// interface CreditPackage {
//     id: string;
//     name: string;
//     credits: number;
//     priceNGN: number;
//     priceUSD: number;
//     description: string;
//     popular: boolean;
// }

// interface CreditAcquisitionClientProps {
//     initialPackages: CreditPackage[];
// }

// /**
//  * INSTITUTIONAL BILLING CONSOLE (Tier 2)
//  * Rule 12: Receives server-data as props.
//  * Rule 17: Branding injected via Zustand.
//  */
// export function CreditAcquisitionClient({ initialPackages }: CreditAcquisitionClientProps) {
//     const { profile } = useProfileStore();
//     const [activeId, setActiveId] = useState<string | null>(null);

//     const schoolId = profile?.schoolId ?? '';
//     const primaryColor = profile?.primaryColor || "#f59e0b";

//     const handleSelect = async (packageId: string) => {
//         if (!schoolId) {
//             toast.error("Institutional identification required.");
//             return;
//         }

//         setActiveId(packageId); // Rule 14: Local state update
        
//         try {
//             const res = await initiateCreditsPayment(schoolId, packageId);
//             if (res.success && res.authorizationUrl) {
//                 // Rule 11: Directing to Gateway Truth
//                 window.location.href = res.authorizationUrl;
//             } else {
//                 toast.error(res.error || "Registry failed to initialize gateway.");
//                 setActiveId(null);
//             }
//         } catch (err: unknown) {
//             toast.error(getErrorMessage(err));
//             setActiveId(null);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12 animate-in fade-in duration-700">
//             <div className="max-w-7xl mx-auto space-y-12">
                
//                 {/* ─── HEADER ─── */}
//                 <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//                     <div className="flex items-center gap-5">
//                         <div 
//                             className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
//                             style={{ 
//                                 backgroundColor: `${primaryColor}15`,
//                                 borderColor: `${primaryColor}30`
//                             }}
//                         >
//                             <Zap className="h-7 w-7" style={{ color: primaryColor }} />
//                         </div>
//                         <div>
//                             <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Credit Acquisition</h1>
//                             <p className="text-slate-500 text-sm mt-2 font-medium italic">Replenish WhatsApp units for institutional automation.</p>
//                         </div>
//                     </div>
                    
//                     <div className="flex items-center gap-3 bg-slate-900 border border-white/5 px-6 py-3 rounded-2xl shadow-inner">
//                         <Shield className="h-4 w-4 text-emerald-500" />
//                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">PCI-DSS Secure</span>
//                     </div>
//                 </header>

//                 {/* ─── INFO BANNER ─── */}
//                 <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 flex items-start gap-6 shadow-xl">
//                     <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
//                         <MessageSquare className="h-6 w-6 text-school-primary" style={{ color: primaryColor }} />
//                     </div>
//                     <div className="space-y-2">
//                         <p className="text-xs font-black uppercase tracking-widest text-white">Consumption Protocol</p>
//                         <p className="text-xs text-slate-500 leading-relaxed max-w-4xl italic">
//                             Each successful automated transmission (Assessment Reports, Attendance, AI Notifications) consumes 
//                             <span className="text-white font-bold mx-1">1 Credit Unit</span>. 
//                             Registry balance never expires and persists across billing cycles.
//                         </p>
//                     </div>
//                 </div>

//                 {/* ─── PACKAGES ─── */}
//                 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//                     {initialPackages.map((pkg) => (
//                         <PackageCard 
//                             key={pkg.id} 
//                             pkg={pkg} 
//                             isProcessing={activeId === pkg.id}
//                             isAnyLoading={!!activeId}
//                             onSelect={handleSelect}
//                             primaryColor={primaryColor}
//                         />
//                     ))}
//                 </div>

//                 <footer className="pt-10 flex items-center justify-center border-t border-white/5">
//                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 flex items-center gap-3">
//                         <Shield className="h-3 w-3" /> Secure Transaction Hub <ArrowRight className="h-3 w-3" />
//                     </p>
//                 </footer>
//             </div>
//         </div>
//     );
// }





'use client'

import React, { useState } from 'react';
import { initiateCreditsPayment } from '@/app/actions/credits';
import { useProfileStore } from '@/store/profileStore';
import { Zap, Shield, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { PackageCard } from './packageCard';
import { getErrorMessage } from '@/lib/error-handler';


// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface CreditPackage {
    id: string;
    name: string;
    credits: number;
    priceNGN: number;
    priceUSD: number;
    description: string;
    popular: boolean;
}

interface CreditAcquisitionClientProps {
    initialPackages: CreditPackage[];
}

/**
 * INSTITUTIONAL CREDIT TERMINAL (Tier 2)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem] for layout blocks.
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function CreditAcquisitionClient({ initialPackages }: CreditAcquisitionClientProps) {
    const { profile } = useProfileStore();
    const [activeId, setActiveId] = useState<string | null>(null);

    const schoolId = profile?.schoolId ?? '';

    const handleSelect = async (packageId: string) => {
        if (!schoolId) {
            toast.error("Registry Error: Institutional context required.");
            return;
        }

        // Rule 14: Optimistic state update for terminal feedback
        setActiveId(packageId); 
        
        try {
            const res = await initiateCreditsPayment(schoolId, packageId);
            if (res.success && res.authorizationUrl) {
                // Rule 11: Handing off to definitive transaction gateway
                window.location.href = res.authorizationUrl;
            } else {
                toast.error(res.error || "Gateway initialization failed.");
                setActiveId(null);
            }
        } catch (err: unknown) {
            toast.error(getErrorMessage(err));
            setActiveId(null);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
            {/* Rule 20: Compulsory Responsiveness with fluid padding */}
            <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
                
                {/* ── HEADER (Rule 11/21) ── */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
                    <div className="flex items-center gap-6">
                        {/* Rule 21: Scale Protocol for clean brand background */}
                        <div className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-lg transition-colors">
                            <Zap className="h-8 w-8 text-school-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tighter uppercase italic leading-none">
                                Credit Acquisition
                            </h1>
                            <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
                                Resource Provisioning: {profile?.school?.name || "Registry Node"}
                            </p>
                        </div>
                    </div>
                    
                    {/* Compliance Node (Rule 18/19) */}
                    <div className="flex items-center gap-3 bg-surface border border-border px-6 py-4 rounded-2xl shadow-inner">
                        <Shield className="h-5 w-5 text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">
                            PCI-DSS Secured Terminal
                        </span>
                    </div>
                </header>

                {/* ── INFO BANNER (Rule 19) ── */}
                <div className="bg-card border border-border rounded-[2rem] p-6 md:p-10 flex flex-col md:flex-row items-start gap-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="p-3 bg-surface rounded-2xl border border-border shadow-sm z-10">
                        <MessageSquare className="h-6 w-6 text-school-primary" />
                    </div>
                    <div className="space-y-3 z-10">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-foreground">Consumption Protocol</p>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl italic font-medium">
                            Each successful automated transmission (Assessment Reports, Attendance, AI Notifications) consumes 
                            <span className="text-foreground font-bold mx-1.5">1 Credit Unit</span>. 
                            Registry balance is permanent, persists across cycles, and is cryptographically settled.
                        </p>
                    </div>
                </div>

                {/* ── PACKAGES GRID (Rule 20) ── */}
                <main className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {initialPackages.map((pkg) => (
                        <PackageCard 
                            key={pkg.id} 
                            pkg={pkg} 
                            isProcessing={activeId === pkg.id}
                            isAnyLoading={!!activeId}
                            onSelect={handleSelect}
                        />
                    ))}
                </main>

                {/* ── FOOTER ── */}
                <footer className="pt-12 flex flex-col sm:flex-row items-center justify-between border-t border-border gap-6">
                    <div className="flex items-center gap-3 text-muted-foreground/30">
                        <Shield className="h-4 w-4" />
                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] italic">
                            Institutional_Transaction_Node_v2.0
                        </p>
                    </div>
                    <div className="flex items-center gap-4 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                        <div className="h-8 w-12 bg-muted rounded border border-border" title="Visa/Mastercard Supported" />
                        <div className="h-8 w-12 bg-muted rounded border border-border" title="Verve Supported" />
                    </div>
                </footer>
            </div>
        </div>
    );
}