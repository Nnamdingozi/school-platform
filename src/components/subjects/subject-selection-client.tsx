"use client";

import { useState, useTransition, useMemo } from "react";
import { useProfileStore } from "@/store/profileStore";
import { 
  claimSubjectAction, 
  releaseSubjectAction,
  getAllSubjectsWithOwnership,
  
} from "@/app/actions/subject-claim";
import { selectPersonalSubjects } from "@/app/actions/subject-allocation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, Lock, BookOpen, Trash2, 
  ShieldCheck, Search, X, FilterX, Globe 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

// ── Types ───────────────────────────────────────────────────────────────────

interface SubjectWithOwnership {
  id: string;
  profileId: string | null;
  subject: { name: string };
  grade: { displayName: string };
  profile: { id: string; name: string | null } | null;
}

interface SubjectSelectionClientProps {
    initialSubjects: SubjectWithOwnership[];
}

/**
 * UNIFIED SUBJECT SELECTION (Tier 2 & 3)
 * Rule 14: Optimistic UI for claiming/selecting nodes.
 * Rule 17: Anti-Prop Drilling - uses Zustand for session identity.
 */
export function SubjectSelectionClient({ initialSubjects }: SubjectSelectionClientProps) {
  const { profile } = useProfileStore();
  const [subjects, setSubjects] = useState<SubjectWithOwnership[]>(initialSubjects);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Rules 6 & 13: Tier Identification
  const isIndependent = profile?.role === Role.INDIVIDUAL_LEARNER && !profile?.schoolId;
  const primaryColor = profile?.primaryColor || "#f59e0b";

  /**
   * Rule 11: Refresh system truth after mutations
   */
  const refreshRegistry = async () => {
    const data = await getAllSubjectsWithOwnership(profile?.schoolId ?? null);
    setSubjects(data as SubjectWithOwnership[]);
  };

  const handleAction = (id: string, action: 'claim' | 'release') => {
    if (!profile?.id) return;

    startTransition(async () => {
      let res;
      
      if (isIndependent) {
          // Tier 3 logic: Building personal library (Rule 6)
          const currentSelection = subjects.filter(s => s.profileId === profile.id).map(s => s.id);
          const newSelection = action === 'claim' 
            ? [...currentSelection, id] 
            : currentSelection.filter(sid => sid !== id);
            
          res = await selectPersonalSubjects({ userId: profile.id, gradeSubjectIds: newSelection });
      } else {
          // Tier 2 logic: Institutional claiming (Rule 5)
          if (action === 'claim') {
            res = await claimSubjectAction({ 
                gradeSubjectId: id, 
                userId: profile.id, 
                userName: profile.name ?? null, 
                userRole: profile.role as Role, 
                schoolId: profile.schoolId ?? null 
            });
          } else {
            res = await releaseSubjectAction({ 
                gradeSubjectId: id, 
                userId: profile.id, 
                userRole: profile.role as Role, 
                schoolId: profile.schoolId ?? null 
            });
          }
      }
      
      if (res && res.success) {
        toast.success(action === 'claim' ? "Registry updated successfully" : "Module released to pool");
        await refreshRegistry();
      } else {
        toast.error(res?.error || "Action failed.");
      }
    });
  };

  const filteredSubjects = useMemo(() => {
    return subjects.filter((item) => {
      const searchStr = `${item.subject.name} ${item.grade.displayName}`.toLowerCase();
      return searchStr.includes(searchQuery.toLowerCase());
    });
  }, [subjects, searchQuery]);

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-10 animate-in fade-in duration-700">
      
      {/* ── HEADER ── */}
      <header className="flex flex-col gap-8 border-b border-white/5 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
                    {isIndependent ? "Knowledge Discovery" : "Syllabus Registry"}
                </h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-3 italic">
                    {isIndependent ? "Add global curriculum modules to your personal library" : "Manage institutional module distribution"}
                </p>
            </div>
            <div className="bg-slate-900 px-8 py-4 rounded-2xl border border-white/5 flex items-center gap-4 shadow-2xl">
                {isIndependent ? <Globe className="h-5 w-5" style={{ color: primaryColor }} /> : <ShieldCheck className="h-5 w-5" style={{ color: primaryColor }} />}
                <div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Current Load</p>
                    <p className="text-sm font-bold text-white uppercase mt-1">
                        {subjects.filter(s => s.profileId === profile?.id).length} Active Nodes
                    </p>
                </div>
            </div>
        </div>

        {/* ── SEARCH BAR ── */}
        <div className="relative max-w-2xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-school-primary transition-colors" style={{ color: primaryColor }} />
            <input 
                type="text"
                placeholder="QUERY BY MODULE OR GRADE LEVEL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded-2xl py-6 pl-14 pr-14 text-sm font-black uppercase tracking-widest text-white outline-none focus:border-school-primary/50 transition-all shadow-2xl"
            />
            {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full">
                    <X className="h-4 w-4 text-slate-400" />
                </button>
            )}
        </div>
      </header>

      {/* ── RESULTS GRID ── */}
      {filteredSubjects.length === 0 ? (
          <div className="py-32 text-center bg-slate-900/30 rounded-[3rem] border border-dashed border-white/5 space-y-4">
              <FilterX className="h-12 w-12 text-slate-800 mx-auto" />
              <p className="text-slate-600 uppercase text-[10px] font-black tracking-widest italic">No registry nodes discovered in this context.</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSubjects.map((item) => {
                const isMine = item.profileId === profile?.id;
                const isTaken = !isIndependent && item.profileId && !isMine;

                return (
                    <Card key={item.id} className={cn(
                        "bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl transition-all relative overflow-hidden border",
                        isMine ? "border-school-primary/40 bg-school-primary/[0.02]" : "border-white/5",
                        isTaken && "grayscale opacity-50"
                    )}
                    style={isMine ? { borderColor: `${primaryColor}40` } : {}}
                    >
                        {isTaken && (
                            <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-slate-950/40 flex flex-col items-center justify-center p-6 text-center">
                                <Lock className="h-8 w-8 text-slate-600 mb-2" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered to</p>
                                <p className="text-sm font-black text-white uppercase italic truncate w-full px-4">{item.profile?.name || "Academic Staff"}</p>
                            </div>
                        )}

                        <div className="relative z-10 space-y-8">
                            <div className="flex justify-between items-center">
                                <Badge variant="outline" className="text-[9px] border-white/10 uppercase py-1 px-3 rounded-lg font-black tracking-widest">
                                    {item.grade.displayName}
                                </Badge>
                                {isMine && (
                                    <span className="text-[8px] font-black text-slate-950 px-2 py-1 rounded uppercase tracking-tighter" style={{ backgroundColor: primaryColor }}>
                                        In Registry
                                    </span>
                                )}
                            </div>

                            <h3 className="text-2xl font-black text-white uppercase italic leading-tight tracking-tighter">
                                {item.subject.name}
                            </h3>

                            <div className="pt-4">
                                <Button 
                                    onClick={() => handleAction(item.id, isMine ? 'release' : 'claim')}
                                    disabled={isPending || !!isTaken}
                                    className={cn(
                                        "w-full rounded-2xl py-7 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl",
                                        isMine 
                                            ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white" 
                                            : "bg-slate-950 border border-white/10 hover:brightness-125"
                                    )}
                                    style={(!isMine && !isTaken) ? { color: primaryColor, borderColor: `${primaryColor}30` } : {}}
                                >
                                    {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : (isMine ? "Purge from Hub" : "Add to Library")}
                                </Button>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
      )}
    </div>
  );
}