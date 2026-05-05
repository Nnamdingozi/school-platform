"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { processPastQuestion } from "@/app/actions/scanned-question-bank";
import { 
  Loader2, Camera, Image as ImageIcon, 
  X, Sparkles, AlertCircle, CheckCircle2,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/profileStore";
import { Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/error-handler";
import { toast } from "sonner";

// ── Types ───────────────────────────────────────────────────────────────────

interface Result {
  success: boolean;
  count?: number;
  imageUrl?: string | null;
  error?: string;
}

type StepId = "upload" | "ocr" | "answers";

interface VisionArchitectProps {
    userId: string;
    schoolId: string | null;
    userRole: Role;
    gradeSubjects: any[];
}

// ── Main Component ──────────────────────────────────────────────────────────

export function VisionArchitectClient({ userId, schoolId, userRole, gradeSubjects }: VisionArchitectProps) {
  const { profile } = useProfileStore();
  const primaryColor = profile?.primaryColor || "#f59e0b";

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [processingStep, setStep] = useState<StepId | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selectedFile: File | null) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setError(null);
    setSuccessCount(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") setPreview(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  /**
   * Rule 10 & 11: Execute AI Synthesis
   */
  const handleProcess = async () => {
    if (!file || !selectedTopicId) return;
    setError(null);
    setSuccessCount(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      setStep("upload");
      // Rule 15: Correct Action Signature with multi-tier context
      const res = await processPastQuestion({
        formData,
        userId,
        schoolId,
        userRole,
        topicId: selectedTopicId
      });

      setStep("ocr");
      await new Promise(r => setTimeout(r, 1000));
      setStep("answers");
      await new Promise(r => setTimeout(r, 800));

      if (!res.success) {
        setError(res.error || "The AI could not decrypt this scan.");
      } else {
        setSuccessCount(res.count ?? 0);
        toast.success("Identity Registry Hydrated Successfully");
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setStep(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 lg:p-12 text-slate-50 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* HEADER */}
        <header className="flex items-center gap-5 border-b border-white/5 pb-10">
          <div className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl" style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}>
            <Sparkles className="h-7 w-7" style={{ color: primaryColor }} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Vision Architect</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Institutional Node Digitization Unit</p>
          </div>
        </header>

        {processingStep ? (
          <div className="py-32 text-center space-y-12">
               <Loader2 className="h-12 w-12 animate-spin mx-auto" style={{ color: primaryColor }} />
               <div className="space-y-2">
                 <h2 className="text-2xl font-black uppercase italic text-white tracking-widest">{processingStep === 'upload' ? 'Uploading Registry' : processingStep === 'ocr' ? 'AI Vision Scan' : 'Syllabus Matching'}</h2>
                 <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Encryption Protocol Active</p>
               </div>
          </div>
        ) : successCount !== null ? (
            <div className="py-20 text-center space-y-8 animate-in zoom-in-95">
                <div className="h-24 w-24 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-2xl">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Digitization Complete</h2>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
                        {successCount} Questions have been integrated into the institutional bank.
                    </p>
                </div>
                <Button onClick={() => setSuccessCount(null)} className="bg-slate-900 border border-white/10 rounded-xl px-10 py-6 uppercase font-black text-[10px] tracking-widest">
                    Process New Entry
                </Button>
            </div>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
            
            {/* TOPIC SELECTOR (Rule 11) */}
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-2">
                    <GraduationCap className="h-3 w-3" /> Target Academic Node
                </label>
                <select 
                    value={selectedTopicId}
                    onChange={(e) => setSelectedTopicId(e.target.value)}
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-school-primary transition-all font-black uppercase italic text-sm cursor-pointer appearance-none shadow-xl"
                    style={{ borderLeft: `4px solid ${primaryColor}` }}
                >
                    <option value="">Select Topic Assignment...</option>
                    {gradeSubjects.map(gs => (
                        <optgroup key={gs.id} label={`${gs.grade.displayName} - ${gs.subject.name}`}>
                            {gs.topics.map((t: any) => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>

            {/* DROPZONE */}
            <div 
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
              className={cn(
                "relative group overflow-hidden rounded-[3rem] border-2 border-dashed transition-all duration-500 bg-slate-900/50 border-white/5 hover:border-white/10"
              )}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] || null)} />

              <div className="p-12 md:p-20 text-center space-y-6">
                {preview ? (
                  <div className="relative inline-block">
                    <Image 
                      src={preview} 
                      alt="Preview" 
                      width={400}
                      height={200}
                      unoptimized 
                      className="h-64 w-auto rounded-3xl object-cover shadow-2xl border-4 border-slate-950" 
                    />
                    <button onClick={() => { setPreview(null); setFile(null); }} className="absolute -top-3 -right-3 bg-red-500 p-2 rounded-full shadow-xl hover:scale-110 transition-all">
                        <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="h-20 w-20 bg-slate-950 rounded-3xl flex items-center justify-center mx-auto border border-white/5 group-hover:border-school-primary/30 transition-all">
                      <ImageIcon className="h-10 w-10 text-slate-700" />
                    </div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest max-w-xs mx-auto">
                        Drag and drop examination paper scan to begin OCR synthesis.
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-4 pt-4">
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="rounded-xl border-white/10 text-slate-400 font-black uppercase text-[9px] tracking-widest px-8">
                    Select Identity Source
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 animate-in shake">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
              </div>
            )}

            <Button 
              onClick={handleProcess} 
              disabled={!file || !selectedTopicId || !!processingStep}
              className="w-full text-slate-950 font-black py-8 rounded-[2.5rem] shadow-xl shadow-school-primary/10 text-xs uppercase tracking-[0.3em] disabled:opacity-20 transition-all"
              style={{ backgroundColor: primaryColor }}
            >
              Initialize Node Synthesis
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}