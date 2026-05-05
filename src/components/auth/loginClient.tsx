'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTeacherData } from '@/app/actions/teacherData';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { type AnyProfile } from '@/types/profile';
import { Role } from '@prisma/client';
import { getErrorMessage } from '@/lib/error-handler';

/**
 * AUTHENTICATION INTERFACE (Tier 3)
 * Rule 14: Optimistic loading states.
 * Rule 17: Syncs database truth with Zustand store.
 */
export function LoginForm() {
  const router = useRouter();
  const setProfile = useProfileStore((state) => state.setProfile);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('Authenticating...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('confirmed') === 'true') toast.success('Identity Verified. Please sign in.');
    if (params.get('error') === 'confirmation_failed') toast.error('Verification link expired.');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingMsg('Verifying identity...');

    try {
      const supabase = createClient();

      // 1. Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;
      if (!data.user?.email) throw new Error('Identity sync failed.');

      setLoadingMsg('Hydrating registry...');

      // 2. Rule 11: Fetch Database Truth (Profile + Relations)
      const profile = await getTeacherData(data.user.email);

      if (!profile) {
        toast.error('Identity record not discovered in registry.');
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      // 3. Rule 17: Initialize Zustand Store (Tier 3 Sync)
      setProfile(profile as unknown as AnyProfile);

      toast.success(`Welcome back, ${profile.name?.split(' ')[0] || 'Registry User'}!`);
      setLoadingMsg('Finalizing redirection...');

      // 4. Rule 2: Multi-Tier Redirection Logic
      setTimeout(() => {
        switch (profile.role) {
          case Role.SUPER_ADMIN:
          case Role.SCHOOL_ADMIN:
            router.replace('/admin');
            break;
          case Role.TEACHER:
            router.replace('/teacher');
            break;
          case Role.STUDENT:
            router.replace('/student');
            break;
          case Role.PARENT:
            router.push('/parent');
            break;
          case Role.INDIVIDUAL_LEARNER:
            // Rule 6: Redirect Independent Learners to their specific hub
            router.replace('/student'); 
            break;
          default:
            router.replace('/login');
        }
      }, 500);

    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900 border border-white/5 rounded-[3rem] shadow-2xl p-10 md:p-12 relative overflow-hidden group">
      
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 h-48 w-48 bg-school-primary/10 rounded-full blur-3xl transition-all group-hover:bg-school-primary/20" />

      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300">
            <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
            <p className="text-white text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">{loadingMsg}</p>
        </div>
      )}

      <div className="text-center mb-10 space-y-4">
        <div className="h-14 w-14 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto border border-white/5 shadow-inner">
            <Lock className="h-6 w-6 text-school-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Registry Access</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Institutional Synchronization Terminal</p>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Email Identity</Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
            <input
              type="email"
              className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800 font-mono lowercase"
              placeholder="user@schoolpaas.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Secret Key</Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-sm text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800 font-bold"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button 
            className="w-full py-8 bg-school-primary text-slate-950 font-black rounded-2xl text-[11px] uppercase tracking-[0.3em] hover:scale-[1.02] transition-all shadow-xl shadow-school-primary/10 mt-4"
        >
          Initialize Session
        </Button>
      </form>

      <div className="mt-10 pt-8 border-t border-white/5 space-y-3">
          <Link href="/forgot-password" title="Recover Access" className="block text-center text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-school-primary transition-colors">
            Lost encryption key?
          </Link>
          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Registry offline? <Link href="/onboarding" className="text-school-primary hover:underline italic">Provision workspace</Link>
          </p>
      </div>

      <div className="mt-8 flex justify-center items-center gap-2 text-slate-700">
          <ShieldCheck className="h-3 w-3" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">Protocol_Secure_v1.2</span>
      </div>
    </div>
  );
}