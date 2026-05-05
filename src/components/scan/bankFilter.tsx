"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Filter, Calendar, Landmark, BookOpen, Search } from "lucide-react";
import { useProfileStore } from "@/store/profileStore";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────────────────────

interface FilterProps {
  subjects: { id: string; name: string }[];
  years: number[];
  examBodies: string[];
}

/**
 * REGISTRY FILTER CONSOLE (Tier 2/3)
 * Rule 12: Controls data by modifying URL params, triggering server-side re-fetching.
 * Rule 17: Injects institutional primaryColor via Zustand store.
 */
export function BankFilters({ subjects, years, examBodies }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useProfileStore();

  const primaryColor = profile?.primaryColor || "#f59e0b";

  /**
   * Rule 14: Optimistic Update logic.
   * Modifies the browser URL which causes the parent Server Page to re-run its queries.
   */
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // Rule 14: Navigating with 'scroll: false' ensures a smooth, non-jumping experience.
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push("?", { scroll: false });
  };

  const hasActiveFilters = searchParams.get("subjectId") || searchParams.get("year") || searchParams.get("examBody");

  return (
    <div className="flex flex-wrap items-end gap-6 bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl animate-in fade-in duration-500">
      
      {/* ── SUBJECT SELECTOR ── */}
      <div className="space-y-3 flex-1 min-w-[240px]">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
            <BookOpen className="h-3 w-3" /> Academic Module
        </label>
        <Select 
            value={searchParams.get("subjectId") || "all"} 
            onValueChange={(v) => updateFilter("subjectId", v)}
        >
            <SelectTrigger 
                className="bg-slate-950 border-white/5 rounded-2xl h-14 text-xs font-black uppercase tracking-widest focus:ring-1 transition-all"
                style={{ '--tw-ring-color': primaryColor } as any}
            >
                <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl shadow-2xl">
                <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">Global Catalogue</SelectItem>
                {subjects.map(s => (
                    <SelectItem key={s.id} value={s.id} className="text-[10px] font-bold uppercase tracking-widest">
                        {s.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>

      {/* ── YEAR SELECTOR ── */}
      <div className="space-y-3 w-full md:w-40">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
            <Calendar className="h-3 w-3" /> Registry Year
        </label>
        <Select 
            value={searchParams.get("year") || "all"} 
            onValueChange={(v) => updateFilter("year", v)}
        >
            <SelectTrigger 
                className="bg-slate-950 border-white/5 rounded-2xl h-14 text-xs font-black uppercase tracking-widest focus:ring-1 transition-all"
                style={{ '--tw-ring-color': primaryColor } as any}
            >
                <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl shadow-2xl">
                <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Time</SelectItem>
                {years.sort((a, b) => b - a).map(y => (
                    <SelectItem key={y} value={y.toString()} className="text-[10px] font-bold uppercase tracking-widest">
                        {y}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>

      {/* ── BODY SELECTOR ── */}
      <div className="space-y-3 w-full md:w-48">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
            <Landmark className="h-3 w-3" /> Assessment Body
        </label>
        <Select 
            value={searchParams.get("examBody") || "all"} 
            onValueChange={(v) => updateFilter("examBody", v)}
        >
            <SelectTrigger 
                className="bg-slate-950 border-white/5 rounded-2xl h-14 text-xs font-black uppercase tracking-widest focus:ring-1 transition-all"
                style={{ '--tw-ring-color': primaryColor } as any}
            >
                <SelectValue placeholder="Body" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl shadow-2xl">
                <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Bodies</SelectItem>
                {examBodies.map(e => (
                    <SelectItem key={e} value={e} className="text-[10px] font-bold uppercase tracking-widest">
                        {e}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>

      {/* ── RESET BUTTON ── */}
      {hasActiveFilters && (
        <Button 
            variant="ghost" 
            onClick={clearFilters}
            className="h-14 px-6 text-slate-600 hover:text-red-400 text-[10px] uppercase font-black tracking-[0.2em] transition-colors"
        >
          <X className="h-4 w-4 mr-2" /> Reset Matrix
        </Button>
      )}
    </div>
  );
}