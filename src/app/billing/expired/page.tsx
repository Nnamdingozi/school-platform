import { Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExpiredPage() {
  return (
    <div className="h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-red-500/20 rounded-[3rem] p-12 text-center shadow-2xl">
        <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
          <Lock className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
          Portal Access Revoked
        </h1>
        <p className="text-slate-500 mt-4 text-sm leading-relaxed">
          Your institution&apos;s academic subscription has expired. All automated registry tools and AI services are currently suspended.
        </p>
        
        <div className="mt-10 space-y-4">
          <Button className="w-full bg-school-primary text-slate-950 font-black py-6 rounded-2xl">
            <CreditCard className="mr-2 h-4 w-4" /> Renew Subscription
          </Button>
          <button className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">
            Contact System Administrator
          </button>
        </div>
      </div>
    </div>
  );
}