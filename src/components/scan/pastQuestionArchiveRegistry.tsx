"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ChevronRight, Zap, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useProfileStore } from "@/store/profileStore";
import { ScannedPaperSet } from "@/app/actions/scanned-question-bank";

export function ArchiveRegistry({ initialData }: { initialData: ScannedPaperSet[] }) {
  const { profile } = useProfileStore();
  const [selected, setSelected] = useState<ScannedPaperSet | null>(null);
  const [revealed, setRevealed] = useState<number | null>(null);
  const primaryColor = profile?.primaryColor || "#f59e0b";

  if (selected) return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
          <button onClick={() => { setSelected(null); setRevealed(null); }} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-[10px] font-bold uppercase tracking-widest transition-colors"><ArrowLeft className="h-4 w-4" /> Registry Index</button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
              <div><h2 className="text-3xl font-extrabold text-foreground uppercase italic tracking-tighter">{selected.subject}</h2><p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-1">{selected.type} • Session {selected.year}</p></div>
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-5 py-2 rounded-xl text-emerald-500"><ShieldCheck className="h-4 w-4" /><span className="text-[9px] font-black uppercase tracking-widest">Verified Logic Node</span></div>
          </div>
          <div className="grid grid-cols-1 gap-6">
              {selected.questions.map((q: any, i: number) => (
                  <Card key={i} className="bg-card border-border rounded-[2rem] p-10 space-y-8 shadow-xl">
                      <div className="flex gap-6"><span className="text-2xl font-black italic opacity-20" style={{ color: primaryColor }}>0{i+1}</span><p className="text-lg font-bold text-foreground leading-relaxed">{q.text}</p></div>
                      <div className="pt-8 border-t border-border flex flex-col gap-6">
                          <button onClick={() => setRevealed(revealed === i ? null : i)} className="w-fit flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all" style={{ color: primaryColor }}>{revealed === i ? <><EyeOff className="h-4 w-4" /> Conceal</> : <><Eye className="h-4 w-4" /> Reveal Solution</>}</button>
                          {revealed === i && <div className="bg-background rounded-3xl p-8 border border-border animate-in slide-in-from-top-4 space-y-4 shadow-inner"><div><p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Correct Response</p><p className="text-lg font-extrabold text-foreground italic">"{q.answer}"</p></div><div><p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Rationale</p><p className="text-sm text-muted-foreground leading-relaxed font-medium">{q.explanation}</p></div></div>}
                      </div>
                  </Card>
              ))}
          </div>
      </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-700">
        {initialData.map((paper) => (
            <Card key={paper.id} onClick={() => setSelected(paper)} className="bg-card border-border hover:border-school-primary/30 transition-all rounded-[2.5rem] p-10 space-y-8 shadow-xl cursor-pointer group">
                <div className="flex justify-between items-start"><div className="p-4 bg-background rounded-2xl border border-border shadow-inner group-hover:border-school-primary/20"><FileText className="h-7 w-7 text-muted-foreground group-hover:text-school-primary transition-colors" /></div><span className="px-3 py-1 bg-background border border-border rounded-lg text-[9px] font-black text-slate-500 uppercase">{paper.type}</span></div>
                <div><h3 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">{paper.subject}</h3><p className="text-xs font-bold text-school-primary mt-3" style={{ color: primaryColor }}>Registry Session {paper.year}</p></div>
                <div className="flex items-center justify-between pt-8 border-t border-border"><span className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Zap className="h-3.5 w-3.5" style={{ color: primaryColor }} /> AI Processed</span><ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1" /></div>
            </Card>
        ))}
    </div>
  );
}