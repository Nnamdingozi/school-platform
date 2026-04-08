// "use client";

// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { 
//   Zap, 
//   BookOpen, 
//   FileText, 
//   Users, 
//   ChevronDown,
//   LayoutGrid,
//   Sparkles
// } from "lucide-react";
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// interface DashboardHeaderProps {
//   teacherName: string;
//   subjects: { id: string; displayName: string; studentCount?: number }[];
//   activeSubjectId?: string;
// }

// export function DashboardHeader({ 
//   teacherName, 
//   subjects, 
//   activeSubjectId 
// }: DashboardHeaderProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   // ── Determine Role Context from Path ─────────────────────────────────────
//   const isTeacherPath = pathname.startsWith('/teacher');
//   const pathPrefix = isTeacherPath ? '/teacher' : '/admin';

//   const handleSubjectChange = (id: string) => {
//     const params = new URLSearchParams(searchParams.toString());
//     params.set("subjectId", id);
//     // Reset specific contextual markers when subject changes
//     params.delete("topicId");
//     params.delete("week");
//     params.delete("termId");
//     router.replace(`${pathname}?${params.toString()}`, { scroll: false });
//   };

//   const navigateTo = (target: string) => {
//     if (target.startsWith("#")) {
//       const element = document.getElementById(target.substring(1));
//       if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
//     } else {
//       const suffix = activeSubjectId ? `?subjectId=${activeSubjectId}` : "";
//       router.push(`${target}${suffix}`);
//     }
//   };

//   return (
//     <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-school-secondary-800 bg-school-secondary-950/80 backdrop-blur-md px-6 shadow-2xl">
      
//       {/* ── Left Side: Identity & Selector ── */}
//       <div className="flex items-center gap-6">
//         <h1 className="hidden md:block text-sm font-black uppercase italic tracking-tighter text-white">
//           Hello, <span className="text-school-primary">{teacherName.split(' ')[0]}</span>
//         </h1>

//         <div className="h-6 w-px bg-school-secondary-800 hidden md:block" />

//         <div className="flex items-center gap-3">
//           <Select value={activeSubjectId} onValueChange={handleSubjectChange}>
//             <SelectTrigger className="w-[200px] lg:w-[260px] bg-slate-900 border-white/5 text-xs font-bold uppercase tracking-widest text-slate-300 hover:border-school-primary/50 transition-all rounded-xl">
//               <SelectValue placeholder="Select Registry" />
//             </SelectTrigger>
//             <SelectContent className="bg-slate-900 border-white/10 shadow-2xl">
//               <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 p-2">
//                 Institutional Load
//               </DropdownMenuLabel>
//               {subjects.length === 0 ? (
//                 <div className="p-4 text-[10px] text-slate-500 italic">No active subjects found.</div>
//               ) : (
//                 subjects.map((s) => (
//                     <SelectItem key={s.id} value={s.id} className="text-xs font-bold text-white uppercase tracking-tight focus:bg-school-primary focus:text-school-secondary-950 cursor-pointer">
//                       {s.displayName}
//                     </SelectItem>
//                 ))
//               )}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* ── Right Side: Quick Actions ── */}
//       <div className="flex items-center gap-4">
        
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button className="bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-black text-[10px] uppercase tracking-widest rounded-xl px-5 h-10 shadow-xl shadow-school-primary/10 transition-all active:scale-95 gap-2">
//               <Zap className="h-3.5 w-3.5 fill-current" />
//               <span className="hidden sm:inline">Mission Control</span>
//               <ChevronDown className="h-3 w-3 opacity-50" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-64 bg-slate-900 border-white/10 rounded-2xl shadow-2xl p-2">
//             <DropdownMenuLabel className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2 py-1">
//               Operational Shortcuts
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator className="bg-white/5" />
            
//             <DropdownMenuItem onClick={() => navigateTo("#ai-planner")} className="rounded-xl focus:bg-school-primary/10 focus:text-school-primary py-3 cursor-pointer">
//               <Sparkles className="mr-3 h-4 w-4 text-school-primary" />
//               <span className="text-xs font-bold uppercase tracking-tight">AI Syllabus Node</span>
//             </DropdownMenuItem>
            
//             <DropdownMenuItem onClick={() => navigateTo("#performance-section")} className="rounded-xl focus:bg-school-primary/10 focus:text-school-primary py-3 cursor-pointer">
//               <LayoutGrid className="mr-3 h-4 w-4 text-school-primary" />
//               <span className="text-xs font-bold uppercase tracking-tight">Assessment Matrix</span>
//             </DropdownMenuItem>
            
//             <DropdownMenuItem onClick={() => router.push(`${pathPrefix}/reports`)} className="rounded-xl focus:bg-school-primary/10 focus:text-school-primary py-3 cursor-pointer">
//               <FileText className="mr-3 h-4 w-4 text-school-primary" />
//               <span className="text-xs font-bold uppercase tracking-tight">Full Gradebook</span>
//             </DropdownMenuItem>
            
//             <DropdownMenuSeparator className="bg-white/5" />
            
//             <DropdownMenuItem onClick={() => router.push(`${pathPrefix}/students`)} className="rounded-xl focus:bg-red-500/10 focus:text-red-400 py-3 cursor-pointer">
//               <Users className="mr-3 h-4 w-4 text-slate-500" />
//               <span className="text-xs font-bold uppercase tracking-tight">Student Directory</span>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         {/* ── Mobile Selector Icon ── */}
//         <div className="sm:hidden">
//           <Select value={activeSubjectId} onValueChange={handleSubjectChange}>
//             <SelectTrigger className="w-10 p-0 border-none bg-school-primary/10 text-school-primary rounded-lg flex items-center justify-center">
//               <BookOpen className="h-4 w-4" />
//             </SelectTrigger>
//             <SelectContent className="bg-slate-900 border-white/10">
//               {subjects.map((s) => (
//                 <SelectItem key={s.id} value={s.id} className="text-[10px] font-bold uppercase">{s.displayName}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//       </div>
//     </header>
//   );
// }


"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { 
  Zap, 
  BookOpen, 
  FileText, 
  Users, 
  ChevronDown,
  LayoutGrid,
  Sparkles
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  teacherName: string;
  subjects: { id: string; displayName: string; studentCount?: number }[];
  activeSubjectId?: string;
}

export function DashboardHeader({ 
  teacherName, 
  subjects, 
  activeSubjectId 
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubjectChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("subjectId", id);
    // Reset specific contextual markers when subject changes
    params.delete("topicId");
    params.delete("week");
    params.delete("termId");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const navigateTo = (target: string) => {
    if (target.startsWith("#")) {
      const element = document.getElementById(target.substring(1));
      if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Since this is teacher-only, we append the active subject to the URL
      const suffix = activeSubjectId ? `?subjectId=${activeSubjectId}` : "";
      router.push(`${target}${suffix}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-school-secondary-800 bg-school-secondary-950/80 backdrop-blur-md px-6 shadow-2xl shadow-black/20">
      
      {/* ── Left Side: Identity & Selector ── */}
      <div className="flex items-center gap-6">
        <h1 className="hidden md:block text-xs font-black uppercase italic tracking-tighter text-white">
          Faculty Hub: <span className="text-school-primary">{teacherName}</span>
        </h1>

        <div className="h-6 w-px bg-school-secondary-800 hidden md:block" />

        <div className="flex items-center gap-3">
          <Select value={activeSubjectId} onValueChange={handleSubjectChange}>
            <SelectTrigger className="w-[200px] lg:w-[280px] bg-slate-900 border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:border-school-primary/50 transition-all rounded-xl shadow-inner">
              <SelectValue placeholder="Select Subject Registry" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 shadow-2xl">
              <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 p-2">
                Active Workload
              </DropdownMenuLabel>
              {subjects.length === 0 ? (
                <div className="p-4 text-[10px] text-slate-600 italic uppercase">No subjects mapped to profile</div>
              ) : (
                subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="text-xs font-bold text-white uppercase tracking-tight focus:bg-school-primary focus:text-school-secondary-950 cursor-pointer">
                      {s.displayName}
                    </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Right Side: Quick Actions ── */}
      <div className="flex items-center gap-4">
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-black text-[10px] uppercase tracking-widest rounded-xl px-5 h-10 shadow-xl shadow-school-primary/10 transition-all active:scale-95 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span className="hidden sm:inline">Instructor Console</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-slate-900 border-white/10 rounded-2xl shadow-2xl p-2">
            <DropdownMenuLabel className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2 py-1">
              Operational Shortcuts
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            
            <DropdownMenuItem onClick={() => navigateTo("#ai-planner")} className="rounded-xl focus:bg-school-primary/10 focus:text-school-primary py-3 cursor-pointer">
              <Sparkles className="mr-3 h-4 w-4 text-school-primary" />
              <span className="text-xs font-bold uppercase tracking-tight">AI Syllabus Node</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigateTo("#performance-section")} className="rounded-xl focus:bg-school-primary/10 focus:text-school-primary py-3 cursor-pointer">
              <LayoutGrid className="mr-3 h-4 w-4 text-school-primary" />
              <span className="text-xs font-bold uppercase tracking-tight">Gradebook Registry</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigateTo("/teacher/reports")} className="rounded-xl focus:bg-school-primary/10 focus:text-school-primary py-3 cursor-pointer">
              <FileText className="mr-3 h-4 w-4 text-school-primary" />
              <span className="text-xs font-bold uppercase tracking-tight">Class Analytics</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-white/5" />
            
            <DropdownMenuItem onClick={() => navigateTo("/teacher/students")} className="rounded-xl focus:bg-school-primary/10 focus:text-school-primary py-3 cursor-pointer">
              <Users className="mr-3 h-4 w-4 text-slate-500" />
              <span className="text-xs font-bold uppercase tracking-tight">Student Directory</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ── Mobile Context Switcher ── */}
        <div className="sm:hidden">
          <Select value={activeSubjectId} onValueChange={handleSubjectChange}>
            <SelectTrigger className="w-10 h-10 p-0 border-none bg-school-primary/10 text-school-primary rounded-xl flex items-center justify-center">
              <BookOpen className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              {subjects.map((s) => (
                <SelectItem key={s.id} value={s.id} className="text-[10px] font-bold uppercase">{s.displayName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>
    </header>
  );
}