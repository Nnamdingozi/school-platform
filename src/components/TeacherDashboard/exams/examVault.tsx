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


"use client";

import { Card } from "@/components/ui/card";
import { ClipboardCheck, Eye, Trash2 } from "lucide-react";
import { deleteExam } from "@/app/actions/exam-engine.actions";
import { useTransition } from "react";
import { toast } from "sonner";

// 🔥 DELETE BUTTON
function DeleteExamButton({
  examId,
  teacherId,
}: {
  examId: string;
  teacherId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmDelete = confirm("Are you sure you want to delete this exam?");
    if (!confirmDelete) return;

    startTransition(async () => {
      const res = await deleteExam(examId, teacherId);

      if (!res.success) {
        toast.error(res.error);
        return;
      }

      toast.success("Exam deleted successfully");

      // ✅ refresh UI
      window.location.reload();
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-500 hover:text-red-400"
      title="Delete Exam"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

// 🔥 MAIN VAULT
export function ExamVault({
  examHistory,
  handleViewHistory,
  teacherId, // ✅ IMPORTANT
}: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {examHistory.map((exam: any) => (
        <Card
          key={exam.id}
          className="bg-slate-900 border-white/5 p-8 rounded-[2.5rem] shadow-2xl"
        >
          {/* HEADER */}
          <div className="flex justify-between items-start mb-6">
            <ClipboardCheck className="text-school-primary h-5 w-5" />

            {/* ✅ DELETE BUTTON ADDED */}
            <DeleteExamButton
              examId={exam.id}
              teacherId={teacherId}
            />
          </div>

          {/* TITLE */}
          <h3 className="text-xl font-bold text-white uppercase italic truncate mb-2">
            {exam.title}
          </h3>

          {/* META */}
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6">
            {exam.class.name} • {exam._count.questions} Items
          </p>

          {/* VIEW BUTTON */}
          <button
            onClick={() => handleViewHistory(exam)}
            className="w-full bg-slate-950 border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-school-primary transition-all flex items-center justify-center gap-2"
          >
            <Eye className="h-3.5 w-3.5" /> Open Registry File
          </button>
        </Card>
      ))}
    </div>
  );
}