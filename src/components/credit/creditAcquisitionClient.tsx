'use client'

import { useState } from 'react';
import { initiateCreditsPayment } from '@/app/actions/credits';
import { useProfileStore } from '@/store/profileStore';
import { Loader2, Zap, ArrowRight, Shield, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { PackageCard } from './packageCard';
import { getErrorMessage } from '@/lib/error-handler';

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
 * INSTITUTIONAL BILLING CONSOLE (Tier 2)
 * Rule 12: Receives server-data as props.
 * Rule 17: Branding injected via Zustand.
 */
export function CreditAcquisitionClient({ initialPackages }: CreditAcquisitionClientProps) {
    const { profile } = useProfileStore();
    const [activeId, setActiveId] = useState<string | null>(null);

    const schoolId = profile?.schoolId ?? '';
    const primaryColor = profile?.primaryColor || "#f59e0b";

    const handleSelect = async (packageId: string) => {
        if (!schoolId) {
            toast.error("Institutional identification required.");
            return;
        }

        setActiveId(packageId); // Rule 14: Local state update
        
        try {
            const res = await initiateCreditsPayment(schoolId, packageId);
            if (res.success && res.authorizationUrl) {
                // Rule 11: Directing to Gateway Truth
                window.location.href = res.authorizationUrl;
            } else {
                toast.error(res.error || "Registry failed to initialize gateway.");
                setActiveId(null);
            }
        } catch (err: unknown) {
            toast.error(getErrorMessage(err));
            setActiveId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* ─── HEADER ─── */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                    <div className="flex items-center gap-5">
                        <div 
                            className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
                            style={{ 
                                backgroundColor: `${primaryColor}15`,
                                borderColor: `${primaryColor}30`
                            }}
                        >
                            <Zap className="h-7 w-7" style={{ color: primaryColor }} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Credit Acquisition</h1>
                            <p className="text-slate-500 text-sm mt-2 font-medium italic">Replenish WhatsApp units for institutional automation.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-slate-900 border border-white/5 px-6 py-3 rounded-2xl shadow-inner">
                        <Shield className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">PCI-DSS Secure</span>
                    </div>
                </header>

                {/* ─── INFO BANNER ─── */}
                <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 flex items-start gap-6 shadow-xl">
                    <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                        <MessageSquare className="h-6 w-6 text-school-primary" style={{ color: primaryColor }} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-white">Consumption Protocol</p>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-4xl italic">
                            Each successful automated transmission (Assessment Reports, Attendance, AI Notifications) consumes 
                            <span className="text-white font-bold mx-1">1 Credit Unit</span>. 
                            Registry balance never expires and persists across billing cycles.
                        </p>
                    </div>
                </div>

                {/* ─── PACKAGES ─── */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {initialPackages.map((pkg) => (
                        <PackageCard 
                            key={pkg.id} 
                            pkg={pkg} 
                            isProcessing={activeId === pkg.id}
                            isAnyLoading={!!activeId}
                            onSelect={handleSelect}
                            primaryColor={primaryColor}
                        />
                    ))}
                </div>

                <footer className="pt-10 flex items-center justify-center border-t border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 flex items-center gap-3">
                        <Shield className="h-3 w-3" /> Secure Transaction Hub <ArrowRight className="h-3 w-3" />
                    </p>
                </footer>
            </div>
        </div>
    );
}