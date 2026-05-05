
// import { Card, CardContent } from '@/components/ui/card'
// import { Star, CheckCircle2, Loader2, ShoppingCart } from 'lucide-react';

// interface PackageCardProps {
//     pkg: CreditPackage;
//     loading: boolean;
//     onSelect: (id: string) => void;
// }

// interface CreditPackage {
//     id: string;
//     name: string;
//     credits: number;
//     priceNGN: number;
//     priceUSD: number;
//     description: string;
//     popular: boolean;
// }


// // ── Sub-component: PackageCard ───────────────────────────────────────────────

// export function PackageCard({ pkg, loading, onSelect }: PackageCardProps) {
//     return (
//         <Card className={`relative flex flex-col justify-between overflow-hidden rounded-[2rem] border transition-all hover:scale-[1.02] ${
//             pkg.popular 
//                 ? 'border-school-primary/40 bg-school-primary/5 shadow-2xl shadow-school-primary/10' 
//                 : 'border-white/5 bg-slate-900'
//         }`}>
//             {pkg.popular && (
//                 <div className="absolute top-4 right-4 flex items-center gap-1 bg-school-primary text-school-secondary-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
//                     <Star className="h-3 w-3 fill-current" /> Popular
//                 </div>
//             )}
            
//             <CardContent className="p-8">
//                 <div className="mb-6">
//                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{pkg.name} Bundle</p>
//                     <div className="flex items-baseline gap-2">
//                         <h3 className="text-4xl font-black text-white">{pkg.credits.toLocaleString()}</h3>
//                         <span className="text-sm font-bold text-slate-400">Units</span>
//                     </div>
//                     <p className="text-xs text-slate-500 mt-2 leading-relaxed">{pkg.description}</p>
//                 </div>

//                 <div className="space-y-3 mb-8">
//                     <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
//                         <CheckCircle2 className="h-4 w-4 text-school-primary" /> Instant Delivery
//                     </div>
//                     <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
//                         <CheckCircle2 className="h-4 w-4 text-school-primary" /> Never Expires
//                     </div>
//                 </div>

//                 <div className="pt-6 border-t border-white/5 space-y-4">
//                     <div className="flex justify-between items-center">
//                         <span className="text-[10px] font-bold text-slate-500 uppercase">Investment</span>
//                         <span className="text-xl font-black text-white">₦{pkg.priceNGN.toLocaleString()}</span>
//                     </div>
                    
//                     <button
//                         onClick={() => onSelect(pkg.id)}
//                         disabled={loading}
//                         className="w-full flex items-center justify-center gap-2 bg-school-primary text-school-secondary-950 font-black py-4 rounded-2xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 text-xs uppercase tracking-widest"
//                     >
//                         {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShoppingCart className="h-4 w-4" /> Acquire Credits</>}
//                     </button>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }


// import { Card, CardContent } from '@/components/ui/card'
// import { Star, CheckCircle2, Loader2, ShoppingCart } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { CreditPackage } from '@/types/credits';

// interface PackageCardProps {
//     pkg: CreditPackage;
//     isProcessing: boolean; // Is THIS specific card clicked?
//     isAnyLoading: boolean; // Is ANY card currently loading?
//     onSelect: (id: string) => void;
// }

// export function PackageCard({ pkg, isProcessing, isAnyLoading, onSelect }: PackageCardProps) {
//     // Determine if this specific card should be "muted/blurred"
//     const isMuted = isAnyLoading && !isProcessing;

//     return (
//         <Card className={cn(
//             "relative flex flex-col justify-between overflow-hidden rounded-[2rem] border transition-all duration-500",
//             // Style for the "Popular" package
//             pkg.popular 
//                 ? 'border-school-primary/40 bg-school-primary/5 shadow-2xl shadow-school-primary/10' 
//                 : 'border-white/5 bg-slate-900',
//             // Professional Blur logic: Blur if someone else is being clicked
//             isMuted && "blur-[2px] opacity-30 grayscale-[0.5] pointer-events-none scale-[0.98]",
//             // Highlight the active card
//             isProcessing && "border-school-primary shadow-[0_0_30px_rgba(var(--school-primary-rgb),0.2)] scale-[1.02]"
//         )}>
//             {pkg.popular && (
//                 <div className="absolute top-4 right-4 flex items-center gap-1 bg-school-primary text-school-secondary-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
//                     <Star className="h-3 w-3 fill-current" /> Popular
//                 </div>
//             )}
            
//             <CardContent className="p-8">
//                 <div className="mb-6">
//                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{pkg.name} Bundle</p>
//                     <div className="flex items-baseline gap-2">
//                         <h3 className="text-4xl font-black text-white">{pkg.credits.toLocaleString()}</h3>
//                         <span className="text-sm font-bold text-slate-400">Units</span>
//                     </div>
//                     <p className="text-xs text-slate-500 mt-2 leading-relaxed">{pkg.description}</p>
//                 </div>

//                 <div className="space-y-3 mb-8 text-slate-400">
//                     <div className="flex items-center gap-2 text-[11px] font-medium">
//                         <CheckCircle2 className="h-4 w-4 text-school-primary" /> Instant Delivery
//                     </div>
//                     <div className="flex items-center gap-2 text-[11px] font-medium">
//                         <CheckCircle2 className="h-4 w-4 text-school-primary" /> Never Expires
//                     </div>
//                 </div>

//                 <div className="pt-6 border-t border-white/5 space-y-4">
//                     <div className="flex justify-between items-center">
//                         <span className="text-[10px] font-bold text-slate-500 uppercase">Investment</span>
//                         <span className="text-xl font-black text-white">₦{pkg.priceNGN.toLocaleString()}</span>
//                     </div>
                    
//                     <button
//                         onClick={() => onSelect(pkg.id)}
//                         disabled={isAnyLoading} // Disable all buttons if one is loading
//                         className={cn(
//                             "w-full flex items-center justify-center gap-2 font-black py-4 rounded-2xl transition-all text-xs uppercase tracking-widest",
//                             isProcessing 
//                                 ? "bg-school-primary text-school-secondary-950" 
//                                 : "bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95"
//                         )}
//                     >
//                         {isProcessing ? (
//                             <>
//                                 <Loader2 className="h-4 w-4 animate-spin" />
//                                 Processing...
//                             </>
//                         ) : (
//                             <>
//                                 <ShoppingCart className="h-4 w-4" /> 
//                                 Acquire Credits
//                             </>
//                         )}
//                     </button>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }


'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface PackageCardProps {
    pkg: {
        id: string;
        name: string;
        credits: number;
        priceNGN: number;
        description: string;
        popular: boolean;
    };
    isProcessing: boolean;
    isAnyLoading: boolean;
    onSelect: (id: string) => void;
    primaryColor: string;
}

/**
 * INSTITUTIONAL PACKAGE CARD (Tier 2)
 * Rule 11: Uses school branding colors for the "Popular" ring and buttons.
 * Rule 17: Localizes styles to prevent prop-drilling layout themes.
 */
export function PackageCard({ pkg, isProcessing, isAnyLoading, onSelect, primaryColor }: PackageCardProps) {
    
    // ✅ FIX: Define standard CSS properties for the dynamic ring effect
    const cardStyle: CSSProperties = pkg.popular ? {
        borderColor: primaryColor,
        boxShadow: `0 0 20px ${primaryColor}20`, // Subtle glow in the school's color
    } : {};

    return (
        <Card 
            className={cn(
                "bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col transition-all duration-300 group",
                pkg.popular ? "border-2 shadow-2xl" : "hover:border-white/20",
                isAnyLoading && !isProcessing && "opacity-50 grayscale-[0.5]"
            )}
            style={cardStyle}
        >
            {pkg.popular && (
                <div 
                    className="py-2 text-center" 
                    style={{ backgroundColor: primaryColor }}
                >
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-950">
                        Institutional Choice
                    </p>
                </div>
            )}

            <CardContent className="p-8 flex-1 flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                            {pkg.name}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            {pkg.credits.toLocaleString()} Transmission Units
                        </p>
                    </div>

                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-white italic tracking-tighter">
                            ₦{pkg.priceNGN.toLocaleString()}
                        </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                        {pkg.description}
                    </p>
                </div>

                <div className="space-y-3">
                    <Button 
                        onClick={() => onSelect(pkg.id)}
                        disabled={isAnyLoading}
                        className="w-full py-7 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all shadow-xl group/btn"
                        style={{ 
                            backgroundColor: isProcessing ? 'transparent' : primaryColor,
                            color: isProcessing ? primaryColor : '#020617',
                            border: isProcessing ? `1px solid ${primaryColor}` : 'none'
                        }}
                    >
                        {isProcessing ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                            <span className="flex items-center gap-2">
                                Initialize Purchase 
                                <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                            </span>
                        )}
                    </Button>
                    <p className="text-[8px] text-center text-slate-600 font-bold uppercase tracking-widest">
                        Settled via Paystack Secure Gateway
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}