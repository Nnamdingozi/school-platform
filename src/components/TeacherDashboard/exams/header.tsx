import { FileText } from "lucide-react";

export function ArchitectHeader() {
  return (
    <header className="flex items-center gap-5 border-b border-white/5 pb-10">
      <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
        <FileText className="h-7 w-7 text-school-primary" />
      </div>

      <div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
          Exam Architect
        </h1>

        <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">
          Institutional Assessment Generation & Vault Management.
        </p>
      </div>
    </header>
  );
}