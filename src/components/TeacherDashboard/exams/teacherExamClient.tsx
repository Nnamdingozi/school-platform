'use client'

import { useState, useTransition, useMemo, useEffect, Dispatch, SetStateAction } from "react"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { 
  ArrowRight, Loader2, ArrowLeft, BookOpen, Layers, 
  Settings, Calendar, FileText,
  ShieldCheck
} from "lucide-react"

import {
  getGroupedTopics,
  buildExamPool,
  finalizeAndDeployExam,
  type ExamPoolItem
} from "@/app/actions/exam-engine.actions"

import { 
  useExamStore, 
  type AssignmentWithDetails, 
  type TermGroup 
} from "@/store/useExamStore"
import { useProfileStore } from "@/store/profileStore"

import { SubjectSelector } from "@/components/TeacherDashboard/exams/subjectSelector"
import { SyllabusSelector } from "@/components/TeacherDashboard/exams/syllabusSelector"
import { SettingsSidebar } from "@/components/TeacherDashboard/exams/settingsSidebar"
import { ExamDocumentPreview } from "@/components/TeacherDashboard/exams/ExamDocumentPreview"
import { AssessmentType,  Class, Role, QuestionCategory } from "@prisma/client"
import { getErrorMessage } from "@/lib/error-handler"


// ── Types ───────────────────────────────────────────────────────────────────

interface TeacherExamArchitectProps {
    initialAssignments: AssignmentWithDetails[];
    initialClasses: Class[];
}

/**
 * INSTITUTIONAL ASSESSMENT ARCHITECT (Tier 2)
 * Rule 12: Hydrated via Server Props.
 * Rule 17: Consistent Store Pattern.
 */
export function TeacherExamArchitectClient({ initialAssignments, initialClasses }: TeacherExamArchitectProps) {
  const { profile } = useProfileStore();
  const [isPending, startTransition] = useTransition();
  
  // Rule 17: Access the Unified Exam Store
  const { 
    setInitialData,
    assignments,
    termGroups, 
    selectedAssignment, setSelectedAssignment,
    selectedTopicIds, setSelectedTopicIds,
    selectedClassIds,
    config, 
  } = useExamStore();

  const [step, setStep] = useState<number>(1);
  const [generatedPool, setGeneratedPool] = useState<ExamPoolItem[]>([]);

  const primaryColor = profile?.primaryColor || "#f59e0b";

  // 1. Sync Store with Server Truth
  useEffect(() => {
    setInitialData({
        assignments: initialAssignments,
        termGroups: [],
        availableClasses: initialClasses
    });
  }, [initialAssignments, initialClasses, setInitialData]);

  // 2. Dynamic Registry Lookup
  useEffect(() => {
    if (!selectedAssignment || !profile?.schoolId) return;

    getGroupedTopics(selectedAssignment.id).then((data) => {
        useExamStore.setState({ termGroups: data as unknown as TermGroup[] });
    });
  }, [selectedAssignment, profile?.schoolId]);

  const endTime = useMemo(() => {
    if (!config.startTime || !config.duration) return null;
    const start = new Date(config.startTime);
    return new Date(start.getTime() + config.duration * 60000).toISOString();
  }, [config.startTime, config.duration]);

  // ── Navigation ──

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  // ── Handlers ──

  const handleGeneratePool = async (): Promise<void> => {
    if (selectedTopicIds.length === 0) {
        toast.error("Registry Error: No syllabus nodes selected.");
        return;
    }
    
    const sid = profile?.schoolId;
    const uid = profile?.id;

    if (!sid || !uid) {
        toast.error("Security Context Missing: Please re-authenticate.");
        return;
    }

    startTransition(async () => {
      try {
        const res = await buildExamPool({
            topicIds: selectedTopicIds,
            totalQuestions: config.totalQuestions,
            reusePercentage: config.reusePercentage,
            schoolId: sid,
            userId: uid
          });
    
          if (!res.success) throw new Error(res.error);
    
          setGeneratedPool(res.questions as ExamPoolItem[]);
          next();
      } catch (err: unknown) {
        toast.error(getErrorMessage(err));
      }
    });
  };

  const handleFinalDeployment = async (): Promise<void> => {
    const sid = profile?.schoolId;
    const uid = profile?.id;

    if (!config.startTime || !endTime || !uid || !sid) {
      toast.error("Deployment parameters incomplete.");
      return;
    }
  
    startTransition(async () => {
      try {
        const res = await finalizeAndDeployExam(
            {
              title: config.title,
              duration: config.duration,
              startTime: new Date(config.startTime),
              endTime: new Date(endTime),
              totalQuestions: config.totalQuestions,
              reusePercentage: config.reusePercentage,
              status: "SCHEDULED",
              teacherId: uid,
              classIds: selectedClassIds,
              schoolId: sid,
              topicIds: selectedTopicIds,
              termId: termGroups[0]?.id || "",
              type: AssessmentType.TERMLY,
            },
            generatedPool.map(q => ({ id: q.id! })),
            uid,
            profile?.role as Role
          );
      
          if (!res.success) throw new Error(res.error);
      
          toast.success("Institutional registry synchronized.");
          setStep(1);
      } catch (err: unknown) {
        toast.error(getErrorMessage(err));
      }
    });
  };

  // ✅ Resolver for child Dispatch expectations
  const handleSetTopicIds: Dispatch<SetStateAction<string[]>> = (value) => {
      const nextValue = typeof value === 'function' ? value(selectedTopicIds) : value;
      setSelectedTopicIds(nextValue);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 bg-slate-950 min-h-screen text-slate-50 space-y-10 animate-in fade-in duration-700">
      
      {/* ── HEADER ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
        <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Exam Architect</h1>
            <div className="flex items-center gap-3 mt-3">
                <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Deployment Status: Step 0{step}</p>
            </div>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 px-6 py-3 rounded-2xl border border-white/5 shadow-xl">
            <ShieldCheck className="h-5 w-5" style={{ color: primaryColor }} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Logic Engine Node</span>
        </div>
      </header>

      {/* ── PROGRESS ── */}
      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
        <div className="h-full transition-all duration-700" style={{ width: `${(step / 4) * 100}%`, backgroundColor: primaryColor }} />
      </div>

      {/* ── STEP 01: IDENTITY ── */}
      {step === 1 && (
        <Card className="p-10 bg-slate-900 border-white/5 rounded-[3rem] shadow-2xl space-y-10 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-slate-950 rounded-2xl border border-white/5">
                <BookOpen className="h-6 w-6" style={{ color: primaryColor }} />
             </div>
             <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Assignment Identity</h2>
          </div>
          
          {/* ✅ FIXED: Passed missing properties to SubjectSelector to resolve Error 2739 */}
          <SubjectSelector 
            assignments={assignments}
            selectedAssignment={selectedAssignment}
            setSelectedAssignment={(val) => setSelectedAssignment(val as AssignmentWithDetails)}
          />

          <div className="pt-6 flex items-center gap-6">
            <button
                disabled={!selectedAssignment}
                onClick={next}
                className="text-slate-950 font-black px-12 py-5 rounded-2xl flex items-center gap-3 disabled:opacity-20 hover:scale-[1.02] transition-all shadow-xl uppercase text-[10px] tracking-widest"
                style={{ backgroundColor: primaryColor }}
            >
                Map Syllabus Registry <ArrowRight className="h-4 w-4" />
            </button>
            {isPending && <Loader2 className="h-5 w-5 animate-spin" style={{ color: primaryColor }} />}
          </div>
        </Card>
      )}

      {/* ── STEP 02: SYLLABUS ── */}
      {step === 2 && (
        <Card className="p-10 bg-slate-900 border-white/5 rounded-[3rem] shadow-2xl space-y-10 animate-in fade-in">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-slate-950 rounded-2xl border border-white/5">
                <Layers className="h-6 w-6" style={{ color: primaryColor }} />
             </div>
             <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Node Integration</h2>
          </div>
          <SyllabusSelector 
            termGroups={termGroups}
            selectedTopicIds={selectedTopicIds}
            setSelectedTopicIds={handleSetTopicIds}
          />
          <div className="flex justify-between pt-10 border-t border-white/5">
            <button onClick={back} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors tracking-widest">
                <ArrowLeft className="h-4 w-4" /> Return to Identity
            </button>
            <button 
                onClick={next} 
                disabled={selectedTopicIds.length === 0} 
                className="text-slate-950 font-black px-12 py-5 rounded-2xl flex items-center gap-3 shadow-xl uppercase text-[10px] tracking-widest"
                style={{ backgroundColor: primaryColor }}
            >
              Configure Logic <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Card>
      )}

      {/* ── STEP 03: SETTINGS ── */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 ml-2">
                <Settings className="h-4 w-4 text-slate-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Telemetry Configuration</span>
            </div>
            <SettingsSidebar onBuildPool={handleGeneratePool} />
          </div>
          
          <aside className="space-y-6">
            <Card className="p-8 bg-slate-900 border-white/5 rounded-[2.5rem] shadow-2xl space-y-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                    <Calendar className="h-4 w-4" style={{ color: primaryColor }} /> Timeline Context
                </h3>
                <div className="space-y-4">
                    <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 shadow-inner">
                        <p className="text-[9px] font-black text-slate-600 uppercase mb-2">Registry Start</p>
                        <p className="text-sm font-bold text-white italic">{config.startTime || "Undefined"}</p>
                    </div>
                    <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 shadow-inner">
                        <p className="text-[9px] font-black text-slate-600 uppercase mb-2">Scope Allocation</p>
                        <p className="text-sm font-bold text-white">{selectedClassIds.length} Cohorts Targeted</p>
                    </div>
                </div>
            </Card>
          </aside>
        </div>
      )}

      {/* ── STEP 04: AUDIT ── */}
      {step === 4 && (
        <div className="space-y-10 animate-in zoom-in-95">
            <div className="flex justify-between items-center bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl">
                 <button onClick={back} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all tracking-widest">
                    <ArrowLeft className="h-4 w-4"/> Revision
                 </button>
                 <div className="flex items-center gap-4">
                    <FileText className="h-5 w-5" style={{ color: primaryColor }} />
                    <span className="text-xs font-black uppercase text-white italic tracking-widest">Blueprint Audit</span>
                 </div>
            </div>
            <ExamDocumentPreview
                generatedPool={generatedPool.map(q => ({
                    id: q.id,
                    text: q.text,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    category: q.category === "REVISION" ? QuestionCategory.REVISION : QuestionCategory.EXAM
                }))}
                config={{ title: config.title }}
                handleFinalDeploy={() => handleFinalDeployment()}
                setStep={setStep}
                isViewOnly={false}
                isPending={isPending}
            />
        </div>
      )}
    </div>
  )
}