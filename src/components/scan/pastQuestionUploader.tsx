// "use client";

// import { useState, useRef, useTransition } from "react";
// import { processPastQuestion } from "@/app/actions/scanned-question-bank";
// import { 
//   Loader2, 
//   ImageIcon, 
//   X, 
//   BookOpen, 
//   Calendar, 
//   Landmark, 
//   ArrowRight,
//   CheckCircle2
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useProfileStore } from "@/store/profileStore";
// import { Role } from "@prisma/client";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import { getErrorMessage } from "@/lib/error-handler";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface SubjectOption {
//   id: string;
//   name: string;
// }

// interface ArchiveUploaderProps {
//   userId: string;
//   schoolId: string | null;
//   userRole: Role;
//   subjects: SubjectOption[];
// }

// /**
//  * INSTITUTIONAL ARCHIVE UPLOADER (Tier 2/3)
//  * Rule 18: Uses Semantic Tokens (bg-card, border-border).
//  * Rule 19: Refined Typography (font-extrabold, tracking-tighter).
//  * Rule 20: Responsive Grid Layout.
//  */
// export function ArchiveUploader({ userId, schoolId, userRole, subjects }: ArchiveUploaderProps) {
//   const { profile } = useProfileStore();
//   const [isPending, startTransition] = useTransition();
  
//   // State Management
//   const [file, setFile] = useState<File | null>(null);
//   const [meta, setMeta] = useState({ 
//     subject: "", 
//     year: new Date().getFullYear(), 
//     examType: "WAEC" // ✅ FIXED: Key matches Server Action signature
//   });

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   /**
//    * Rule 10: Logic secured by non-null validation
//    */
//   const handleProcess = () => {
//     if (!file) return toast.error("Deployment Error: Image payload missing.");
//     if (!meta.subject) return toast.error("Registry Guard: Select a target subject.");

//     const formData = new FormData();
//     formData.append("image", file);

//     startTransition(async () => {
//       try {
//         // ✅ FIXED: All properties correctly mapped and typed
//         const res = await processPastQuestion({
//           formData,
//           userId,
//           schoolId,
//           userRole,
//           subject: meta.subject,
//           year: meta.year,
//           examType: meta.examType
//         });

//         if (res.success) {
//           toast.success("Intelligence Registry Synchronized.");
//           setFile(null);
//           // Optional: Revalidate or redirect logic
//         } else {
//           toast.error(res.error || "Registry sync failed.");
//         }
//       } catch (err: unknown) {
//         toast.error(getErrorMessage(err));
//       }
//     });
//   };

//   return (
//     <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 animate-in slide-in-from-left-4 duration-500">
        
//         {/* ── METADATA INPUTS ── */}
//         <div className="lg:col-span-1 space-y-6">
//             <MetaInput label="Academic Subject" icon={BookOpen}>
//                 <select 
//                     value={meta.subject} 
//                     onChange={e => setMeta({...meta, subject: e.target.value})}
//                     className="w-full bg-card border border-border rounded-2xl px-5 py-4 text-xs font-bold uppercase text-foreground outline-none focus:ring-2 focus:ring-school-primary/20 transition-all"
//                 >
//                     <option value="">Select Module...</option>
//                     {subjects.map((s) => (
//                         <option key={s.id} value={s.name}>{s.name}</option>
//                     ))}
//                 </select>
//             </MetaInput>

//             <MetaInput label="Registry Year" icon={Calendar}>
//                 <input 
//                     type="number" 
//                     value={meta.year} 
//                     onChange={e => setMeta({...meta, year: parseInt(e.target.value)})}
//                     className="w-full bg-card border border-border rounded-2xl px-5 py-4 text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-school-primary/20"
//                 />
//             </MetaInput>

//             <MetaInput label="Assessment Body" icon={Landmark}>
//                 <select 
//                     value={meta.examType} 
//                     onChange={e => setMeta({...meta, examType: e.target.value})}
//                     className="w-full bg-card border border-border rounded-2xl px-5 py-4 text-xs font-bold uppercase text-foreground outline-none focus:ring-2 focus:ring-school-primary/20"
//                 >
//                     <option value="WAEC">WAEC</option>
//                     <option value="JAMB">JAMB</option>
//                     <option value="NECO">NECO</option>
//                     <option value="IGCSE">IGCSE</option>
//                 </select>
//             </MetaInput>
//         </div>

//         {/* ── UPLOAD ZONE ── */}
//         <div className="lg:col-span-2 space-y-8">
//             <div 
//                 onClick={() => fileInputRef.current?.click()} 
//                 className={cn(
//                     "bg-card/30 border-2 border-dashed border-border rounded-[2rem] h-[350px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
//                     file ? "border-school-primary/40 bg-school-primary/5" : "hover:border-school-primary/30"
//                 )}
//             >
//                 <input 
//                     type="file" 
//                     ref={fileInputRef} 
//                     className="hidden" 
//                     accept="image/*" 
//                     onChange={e => setFile(e.target.files?.[0] || null)} 
//                 />
                
//                 {file ? (
//                     <div className="text-center space-y-4 px-6">
//                         <div className="h-16 w-16 bg-school-primary/10 rounded-2xl flex items-center justify-center mx-auto border border-school-primary/20">
//                             <CheckCircle2 className="h-8 w-8 text-school-primary" />
//                         </div>
//                         <p className="text-xs font-extrabold uppercase text-foreground truncate max-w-xs">{file.name}</p>
//                         <button 
//                             type="button" 
//                             onClick={(e) => { e.stopPropagation(); setFile(null); }}
//                             className="text-[10px] font-bold text-destructive uppercase tracking-widest hover:underline"
//                         >
//                             Remove Source
//                         </button>
//                     </div>
//                 ) : (
//                     <div className="text-center space-y-4 px-10">
//                         <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
//                         <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest leading-relaxed">
//                             Initialize logic scan by dragging <br/> or clicking to browse source nodes
//                         </p>
//                     </div>
//                 )}
//             </div>

//             <Button 
//                 onClick={handleProcess} 
//                 disabled={isPending || !file} 
//                 className="w-full bg-school-primary text-on-school-primary font-extrabold py-8 rounded-[2rem] shadow-xl shadow-school-primary/10 uppercase tracking-[0.2em] text-xs transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-30"
//             >
//                 {isPending ? (
//                     <span className="flex items-center gap-3">
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Synchronizing...
//                     </span>
//                 ) : (
//                     <span className="flex items-center gap-2">
//                         Finalize Archive Entry <ArrowRight className="h-4 w-4" />
//                     </span>
//                 )}
//             </Button>
//         </div>
//     </div>
//   );
// }

// /**
//  * INTERNAL SUB-COMPONENT: META INPUT WRAPPER
//  */
// function MetaInput({ label, icon: Icon, children }: { label: string, icon: any, children: React.ReactNode }) {
//     return (
//         <div className="space-y-3">
//             <label className="text-[10px] font-semibold uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2 italic">
//                 <Icon className="h-3.5 w-3.5" /> {label}
//             </label>
//             {children}
//         </div>
//     )
// }


"use client";

import { useState, useRef, useTransition } from "react";
import { processPastQuestion } from "@/app/actions/scanned-question-bank";
import { Loader2, ImageIcon, BookOpen, Calendar, Landmark, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/profileStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ArchiveUploader({ userId, schoolId, userRole, subjects }: any) {
  const { profile } = useProfileStore();
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState({ subject: "", year: 2024, examType: "WAEC" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const primaryColor = profile?.primaryColor || "#f59e0b";

  const handleProcess = () => {
    if (!file || !meta.subject) return toast.error("Selection incomplete.");
    const formData = new FormData();
    formData.append("image", file);
    startTransition(async () => {
        const res = await processPastQuestion({ ...meta, formData, userId, schoolId, userRole });
        if (res.success) {
            toast.success("Identity registry synchronized.");
            setFile(null);
        } else toast.error(res.error);
    });
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-6 duration-700">
        <div className="lg:col-span-1 space-y-6">
            <div className="space-y-4">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2"><BookOpen className="h-3 w-3" /> Subject</label>
                <select value={meta.subject} onChange={e => setMeta({...meta, subject: e.target.value})} className="w-full bg-card border border-border rounded-2xl px-5 py-4 text-xs font-bold uppercase text-foreground outline-none focus:ring-2 focus:ring-school-primary/20">
                    <option value="">Select...</option>
                    {subjects.map((s: any) => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
            </div>
            <div className="space-y-4">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2"><Calendar className="h-3 w-3" /> Year</label>
                <input type="number" value={meta.year} onChange={e => setMeta({...meta, year: parseInt(e.target.value)})} className="w-full bg-card border border-border rounded-2xl px-5 py-4 text-xs font-bold text-foreground" />
            </div>
            <div className="space-y-4">
                <label className="text-[10px] font-semibold uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2"><Landmark className="h-3 w-3" /> Assessment Body</label>
                <select value={meta.examType} onChange={e => setMeta({...meta, examType: e.target.value})} className="w-full bg-card border border-border rounded-2xl px-5 py-4 text-xs font-bold uppercase text-foreground">
                    <option value="WAEC">WAEC</option>
                    <option value="JAMB">JAMB</option>
                    <option value="NECO">NECO</option>
                </select>
            </div>
        </div>
        <div className="lg:col-span-2 space-y-8">
            <div onClick={() => fileInputRef.current?.click()} className={cn("bg-card/30 border-2 border-dashed border-border rounded-[2rem] h-[350px] flex flex-col items-center justify-center cursor-pointer transition-all", file ? "border-school-primary/40 bg-school-primary/5" : "hover:border-school-primary/30")}>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
                {file ? <p className="text-xs font-bold uppercase text-school-primary italic">{file.name}</p> : <div className="text-center space-y-2"><ImageIcon className="h-10 w-10 text-muted-foreground mx-auto" /><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select Source Node</p></div>}
            </div>
            <Button onClick={handleProcess} disabled={isPending || !file} className="w-full bg-school-primary text-on-school-primary font-extrabold py-8 rounded-[2rem] shadow-xl uppercase text-xs tracking-widest">
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Finalize Logic Synthesis <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
        </div>
    </div>
  );
}