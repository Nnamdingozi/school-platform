import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { checkSubscription } from "@/app/actions/subscription-guard";
import { getSubscriptionPlans } from "@/app/actions/subscription.actions";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ShieldAlert, School, User, Lock } from "lucide-react";

export default async function BillingPage() {
  // 1. Identity & Context
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { school: true }
  });

  if (!profile) redirect("/login");

  // 2. Database-Driven Status (Rule 11)
  const subStatus = await checkSubscription(profile.id, profile.schoolId);

  // If they are active, send them back to the dashboard
  if (subStatus.isActive) {
    redirect(profile.role === Role.PARENT ? "/parent" : "/teacher");
  }

  // 3. Fetch Tier-1 Core Content (Plans)
  const plans = await getSubscriptionPlans();

  // 4. Role Gate (Rule 10 Security)
  const isAuthorizedToPay = 
    profile.role === Role.SCHOOL_ADMIN || 
    profile.role === Role.INDIVIDUAL_LEARNER || 
    profile.role === Role.SUPER_ADMIN;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-12">
        
        {/* EXPIRED HEADER */}
        <div className="text-center space-y-4">
          <div className="h-20 w-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 mb-6">
            <ShieldAlert className="h-10 w-10 animate-pulse" />
          </div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter">Access Suspended</h1>
          <p className="text-slate-400 uppercase tracking-widest text-sm">
            {profile.schoolId ? `Subscription for ${profile.school?.name} has expired` : "Your personal learning license has expired"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT: STATUS INFO */}
          <Card className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem]">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xl font-black uppercase italic flex items-center gap-3">
                <Lock className="h-5 w-5 text-school-primary" /> System Lock
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <p className="text-slate-400 text-sm leading-relaxed">
                Academic records, AI generated lessons, and digitized question registries are currently locked. 
                Full access will be restored immediately upon renewal.
              </p>
              
              {!isAuthorizedToPay && (
                <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl">
                  <p className="text-amber-500 text-xs font-black uppercase tracking-widest leading-relaxed">
                    Notice: Only the School Administrator can renew this subscription. 
                    Please contact your management to restore access.
                  </p>
                </div>
              )}

              {profile.schoolId && (
                <div className="flex items-center gap-4 text-[10px] font-black uppercase text-slate-500">
                  <School className="h-4 w-4" /> Institutional Tier
                </div>
              )}
              {!profile.schoolId && (
                <div className="flex items-center gap-4 text-[10px] font-black uppercase text-slate-500">
                  <User className="h-4 w-4" /> Individual Tier
                </div>
              )}
            </CardContent>
          </Card>

          {/* RIGHT: RENEWAL / PLANS */}
          <div className="space-y-4">
            {isAuthorizedToPay ? (
              plans.map((plan) => (
                <Card key={plan.id} className="bg-slate-900 border-white/10 hover:border-school-primary/50 transition-all cursor-pointer p-6 rounded-[2rem] group">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-black uppercase italic text-lg">{plan.name}</h3>
                      <p className="text-slate-500 text-xs uppercase">{plan.durationDays} Days Access</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-school-primary">₦{plan.priceNGN.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-school-primary text-slate-950 font-black rounded-xl py-6 hover:scale-[1.02] transition-transform">
                    <CreditCard className="h-4 w-4 mr-2" /> RENEW PLAN
                  </Button>
                </Card>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-900/50 rounded-[2rem] border border-white/5">
                <ShieldAlert className="h-12 w-12 text-slate-700 mb-4" />
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  Awaiting Administrative Action
                </p>
              </div>
            )}
          </div>

        </div>

        {/* LOGOUT FOOTER */}
        <div className="text-center">
          <Button variant="ghost" className="text-slate-500 uppercase text-[10px] font-black tracking-widest hover:text-white">
            Logout and Sign in as different user
          </Button>
        </div>
      </div>
    </div>
  );
}