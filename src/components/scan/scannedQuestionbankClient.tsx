"use client";

import { useProfileStore } from "@/store/profileStore";
import { BankFilters } from "./bankFilter";
import { ScannedQuestionRegistry } from "./scannedQuestionRegistry";
import { Question, Role } from "@prisma/client";
import { Database, SearchX } from "lucide-react";

interface ScannedBankClientProps {
  initialQuestions: Question[];
  filterOptions: {
    subjects: { id: string; name: string }[];
    years: number[];
    examBodies: string[];
  };
  userRole: Role;
}

/**
 * UNIFIED REGISTRY CONSOLE
 * Rule 12: Serves as the interactive layout for the server-fetched data.
 * Rule 17: Injects school branding.
 */
export function ScannedBankClient({ initialQuestions, filterOptions, userRole }: ScannedBankClientProps) {
  const { profile } = useProfileStore();
  const primaryColor = profile?.primaryColor || "#f59e0b";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* ── HEADER ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
        <div className="flex items-center gap-5">
            <div 
                className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
                style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
            >
                <Database className="h-7 w-7" style={{ color: primaryColor }} />
            </div>
            <div>
                <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
                    Digitized Registry
                </h1>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3 italic">
                    Institutional & Personal Scanned Node Index
                </p>
            </div>
        </div>
      </header>

      {/* ── FILTERS (Rule 14 Interactivity) ── */}
      <BankFilters 
        subjects={filterOptions.subjects}
        years={filterOptions.years}
        examBodies={filterOptions.examBodies}
      />

      {/* ── DATA DISPLAY (Utilizes your display component) ── */}
      {initialQuestions.length === 0 ? (
        <div className="py-32 text-center bg-slate-900/30 rounded-[3rem] border border-dashed border-white/5 space-y-4">
            <SearchX className="h-12 w-12 text-slate-800 mx-auto" />
            <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest italic">
                No matching nodes discovered in registry tier.
            </p>
        </div>
      ) : (
        <ScannedQuestionRegistry 
            questions={initialQuestions} 
            userRole={userRole} 
        />
      )}
    </div>
  );
}