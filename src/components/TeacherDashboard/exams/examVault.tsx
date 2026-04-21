// import { Card } from "@/components/ui/card";
// import { ClipboardCheck, Eye } from "lucide-react";

// export function ExamVault({ examHistory, handleViewHistory }: any) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
//       {examHistory.map((exam: any) => (
//         <Card
//           key={exam.id}
//           className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-2xl"
//         >
//           <div className="flex justify-between items-start mb-6">
//             <ClipboardCheck className="text-school-primary h-5 w-5" />
//           </div>

//           <h3 className="text-xl font-bold text-white uppercase italic truncate mb-2">
//             {exam.title}
//           </h3>

//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6">
//             {exam.class.name} • {exam._count.questions} Items
//           </p>

//           <button
//             onClick={() => handleViewHistory(exam)}
//             className="w-full bg-slate-950 border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-school-primary transition-all flex items-center justify-center gap-2"
//           >
//             <Eye className="h-3.5 w-3.5" /> Open Registry File
//           </button>
//         </Card>
//       ))}
//     </div>
//   );
// }


// "use client";

// import { Card } from "@/components/ui/card";
// import { ClipboardCheck, Eye, Trash2 } from "lucide-react";
// import { deleteExam } from "@/app/actions/exam-engine.actions";
// import { useTransition } from "react";
// import { toast } from "sonner";

// // 🔥 DELETE BUTTON
// function DeleteExamButton({
//   examId,
//   teacherId,
// }: {
//   examId: string;
//   teacherId: string;
// }) {
//   const [isPending, startTransition] = useTransition();

//   const handleDelete = () => {
//     const confirmDelete = confirm("Are you sure you want to delete this exam?");
//     if (!confirmDelete) return;

//     startTransition(async () => {
//       const res = await deleteExam(examId, teacherId);

//       if (!res.success) {
//         toast.error(res.error);
//         return;
//       }

//       toast.success("Exam deleted successfully");

//       // ✅ refresh UI
//       window.location.reload();
//     });
//   };

//   return (
//     <button
//       onClick={handleDelete}
//       disabled={isPending}
//       className="text-red-500 hover:text-red-400"
//       title="Delete Exam"
//     >
//       <Trash2 className="h-4 w-4" />
//     </button>
//   );
// }

// // 🔥 MAIN VAULT
// export function ExamVault({
//   examHistory,
//   handleViewHistory,
//   teacherId, // ✅ IMPORTANT
// }: any) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
//       {examHistory.map((exam: any) => (
//         <Card
//           key={exam.id}
//           className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-2xl"
//         >
//           {/* HEADER */}
//           <div className="flex justify-between items-start mb-6">
//             <ClipboardCheck className="text-school-primary h-5 w-5" />

//             {/* ✅ DELETE BUTTON ADDED */}
//             <DeleteExamButton
//               examId={exam.id}
//               teacherId={teacherId}
//             />
//           </div>

//           {/* TITLE */}
//           <h3 className="text-xl font-bold text-white uppercase italic truncate mb-2">
//             {exam.title}
//           </h3>

//           {/* META */}
//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6">
//             {exam.class.name} • {exam._count.questions} Items
//           </p>

//           {/* VIEW BUTTON */}
//           <button
//             onClick={() => handleViewHistory(exam)}
//             className="w-full bg-slate-950 border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-school-primary transition-all flex items-center justify-center gap-2"
//           >
//             <Eye className="h-3.5 w-3.5" /> Open Registry File
//           </button>
//         </Card>
//       ))}
//     </div>
//   );
// }


"use client";

import { Card } from "@/components/ui/card";
import { ClipboardCheck, Eye, Trash2 } from "lucide-react";
import { deleteExam } from "@/app/actions/exam-engine.actions";
import { useTransition } from "react";
import { toast } from "sonner";

// ── Types ───────────────────────────────────────────────────────────────────

interface HistoricExam {
  id: string;
  title: string;
  class: {
    name: string;
  };
  _count: {
    questions: number;
  };
  duration: number; // Added to match likely return from action
}

interface ExamVaultProps {
  // FIX: Replaced 'any' with strict interface
  examHistory: HistoricExam[];
  handleViewHistory: (exam: HistoricExam) => Promise<void>;
  teacherId: string;
}

// ── Sub-Component: Delete Button ─────────────────────────────────────────────

function DeleteExamButton({
  examId,
  teacherId,
}: {
  examId: string;
  teacherId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmDelete = confirm("Warning: You are about to wipe this record from the academic registry. Proceed?");
    if (!confirmDelete) return;

    startTransition(async () => {
      const res = await deleteExam(examId, teacherId);

      if (!res.success) {
        toast.error(res.error || "Registry error occurred during deletion.");
        return;
      }

      toast.success("Exam successfully purged from registry.");
      window.location.reload();
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 bg-slate-950 border border-white/5 rounded-xl text-slate-700 hover:text-red-500 transition-all hover:bg-red-500/10"
      title="Purge Record"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

// ── Main Component: Exam Vault ───────────────────────────────────────────────

export function ExamVault({
  examHistory,
  handleViewHistory,
  teacherId,
}: ExamVaultProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {examHistory.length === 0 ? (
        <div className="col-span-full py-40 text-center bg-slate-900/30 rounded-[3rem] border border-dashed border-white/5">
           <ClipboardCheck className="h-12 w-12 text-slate-800 mx-auto mb-4" />
           <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">
             Syllabus Vault Empty
           </p>
        </div>
      ) : (
        // FIX: Strictly typed iterator
        examHistory.map((exam: HistoricExam) => (
          <Card
            key={exam.id}
            className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-2xl hover:border-school-primary/20 transition-all group"
          >
            {/* CARD HEADER */}
            <div className="flex justify-between items-start mb-8">
              <div className="h-10 w-10 bg-school-primary/10 rounded-xl flex items-center justify-center border border-school-primary/20">
                <ClipboardCheck className="text-school-primary h-5 w-5" />
              </div>

              <DeleteExamButton
                examId={exam.id}
                teacherId={teacherId}
              />
            </div>

            {/* IDENTITY SECTION */}
            <div className="space-y-1 mb-8">
                <h3 className="text-xl font-black text-white uppercase italic truncate leading-tight">
                  {exam.title}
                </h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                    Room: <span className="text-slate-300">{exam.class.name}</span>
                </p>
            </div>

            {/* METRICS */}
            <div className="flex gap-4 mb-8">
                <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-white/5">
                    <p className="text-[8px] font-black text-slate-600 uppercase">Items</p>
                    <p className="text-xs font-black text-school-primary italic">{exam._count.questions}</p>
                </div>
                <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-white/5">
                    <p className="text-[8px] font-black text-slate-600 uppercase">Status</p>
                    <p className="text-xs font-black text-emerald-500 italic">DEPLOYED</p>
                </div>
            </div>

            {/* VIEW ACTION */}
            <button
              onClick={() => handleViewHistory(exam)}
              className="w-full bg-slate-950 border border-white/10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-school-primary group-hover:border-school-primary/30 transition-all flex items-center justify-center gap-2 shadow-inner"
            >
              <Eye className="h-4 w-4" /> Open Registry File
            </button>
          </Card>
        ))
      )}
    </div>
  );
}