
import { Card, CardContent } from '@/components/ui/card'
import { Star, CheckCircle2, Loader2, ShoppingCart } from 'lucide-react';

interface PackageCardProps {
    pkg: CreditPackage;
    loading: boolean;
    onSelect: (id: string) => void;
}

interface CreditPackage {
    id: string;
    name: string;
    credits: number;
    priceNGN: number;
    priceUSD: number;
    description: string;
    popular: boolean;
}


// ── Sub-component: PackageCard ───────────────────────────────────────────────

export function PackageCard({ pkg, loading, onSelect }: PackageCardProps) {
    return (
        <Card className={`relative flex flex-col justify-between overflow-hidden rounded-[2rem] border transition-all hover:scale-[1.02] ${
            pkg.popular 
                ? 'border-school-primary/40 bg-school-primary/5 shadow-2xl shadow-school-primary/10' 
                : 'border-white/5 bg-slate-900'
        }`}>
            {pkg.popular && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-school-primary text-school-secondary-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <Star className="h-3 w-3 fill-current" /> Popular
                </div>
            )}
            
            <CardContent className="p-8">
                <div className="mb-6">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{pkg.name} Bundle</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black text-white">{pkg.credits.toLocaleString()}</h3>
                        <span className="text-sm font-bold text-slate-400">Units</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{pkg.description}</p>
                </div>

                <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-school-primary" /> Instant Delivery
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-school-primary" /> Never Expires
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Investment</span>
                        <span className="text-xl font-black text-white">₦{pkg.priceNGN.toLocaleString()}</span>
                    </div>
                    
                    <button
                        onClick={() => onSelect(pkg.id)}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-school-primary text-school-secondary-950 font-black py-4 rounded-2xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 text-xs uppercase tracking-widest"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShoppingCart className="h-4 w-4" /> Acquire Credits</>}
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
