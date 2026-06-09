// components/student-dashboard/IndividualSetupBanner.tsx
'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export function IndividualSetupBanner({ onStart }: { onStart: () => void }) {
    return (
        <div className="w-full bg-school-primary/10 border border-school-primary/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-school-primary" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-school-primary">
                        Setup Required
                    </p>
                </div>
                <h3 className="text-xl font-extrabold uppercase italic tracking-tighter text-foreground">
                    Personalize Your Learning Hub
                </h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Select your grade and subjects to unlock your full dashboard
                </p>
            </div>
            <button
                onClick={onStart}
                className="flex items-center gap-2 px-8 py-4 bg-school-primary text-on-school-primary font-extrabold rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shrink-0"
            >
                Begin Setup <ArrowRight className="h-4 w-4" />
            </button>
        </div>
    );
}