"use client";

import { useState, useTransition } from "react";
import { deleteScannedPaper } from "@/app/actions/scanned-question-bank";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScannedPaperSet } from "@/app/actions/scanned-question-bank";
import { Role } from "@prisma/client";

interface DeleteButtonProps {
  paper: ScannedPaperSet;
  userId: string;
  schoolId: string | null;
  userRole: Role;
  onDeleted?: () => void; // optional callback e.g. to close detail view
}

export function PastQuestionDeleteButton({
  paper,
  userId,
  schoolId,
  userRole,
  onDeleted,
}: DeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteScannedPaper(paper.id, userId, schoolId, userRole);

      if (res.success) {
        toast.success(`${paper.subject} ${paper.year} removed from registry.`);
        setConfirming(false);
        onDeleted?.();
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to delete paper.");
        setConfirming(false);
      }
    });
  };

  // ── Confirmation state ────────────────────────────────────────────────────
  if (confirming) {
    return (
      <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-200">
        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-amber-500">
          <AlertTriangle className="h-3 w-3" />
          Confirm delete?
        </span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
            "bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20",
            isPending && "opacity-60 cursor-not-allowed"
          )}
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Trash2 className="h-3 w-3" />
          )}
          {isPending ? "Deleting..." : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="flex items-center justify-center h-7 w-7 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  // ── Default state ─────────────────────────────────────────────────────────
  return (
    <button
      onClick={() => setConfirming(true)}
      title="Delete this paper"
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
        "border-border bg-card text-muted-foreground",
        "hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-500"
      )}
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete
    </button>
  );
}