"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterProps {
  subjects: { id: string; name: string }[];
  years: number[];
  examBodies: string[];
}

export function BankFilters({ subjects, years, examBodies }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("?");
  };

  return (
    <div className="flex flex-wrap gap-4 items-center bg-slate-900/50 p-4 rounded-3xl border border-white/5">
      {/* Subject Filter */}
      <Select 
        value={searchParams.get("subjectId") || "all"} 
        onValueChange={(v) => updateFilter("subjectId", v)}
      >
        <SelectTrigger className="w-[200px] bg-slate-950 border-white/10 rounded-xl text-xs uppercase font-bold">
          <SelectValue placeholder="All Subjects" />
        </SelectTrigger>
        <SelectContent className="bg-slate-950 border-white/10 text-white">
          <SelectItem value="all">All Subjects</SelectItem>
          {subjects.map(s => (
            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year Filter */}
      <Select 
        value={searchParams.get("year") || "all"} 
        onValueChange={(v) => updateFilter("year", v)}
      >
        <SelectTrigger className="w-[140px] bg-slate-950 border-white/10 rounded-xl text-xs uppercase font-bold">
          <SelectValue placeholder="All Years" />
        </SelectTrigger>
        <SelectContent className="bg-slate-950 border-white/10 text-white">
          <SelectItem value="all">All Years</SelectItem>
          {years.map(y => (
            <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Exam Body Filter */}
      <Select 
        value={searchParams.get("examBody") || "all"} 
        onValueChange={(v) => updateFilter("examBody", v)}
      >
        <SelectTrigger className="w-[160px] bg-slate-950 border-white/10 rounded-xl text-xs uppercase font-bold">
          <SelectValue placeholder="All Bodies" />
        </SelectTrigger>
        <SelectContent className="bg-slate-950 border-white/10 text-white">
          <SelectItem value="all">All Bodies</SelectItem>
          {examBodies.map(e => (
            <SelectItem key={e} value={e}>{e}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {searchParams.toString() !== "" && (
        <Button 
            variant="ghost" 
            onClick={clearFilters}
            className="text-slate-500 hover:text-white text-[10px] uppercase font-black"
        >
          <X className="h-3 w-3 mr-2" /> Reset
        </Button>
      )}
    </div>
  );
}