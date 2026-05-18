// "use client";

// import React from "react";

// type Config = {
//   difficulty: string;
//   questionCount: number;
//   duration: number;
// };

// type Classroom = {
//   id: number;
//   name: string;
// };

// type Props = {
//   config: Config;
//   setConfig: React.Dispatch<React.SetStateAction<Config>>;
//   validClassrooms: Classroom[];
//   selectedClassIds: number[];
//   toggleClass: (id: number) => void;
//   handleBuildPool: () => void;
//   isPending: boolean;
// };

// export function SettingsSidebar({
//   config,
//   setConfig,
//   validClassrooms,
//   selectedClassIds,
//   toggleClass,
//   handleBuildPool,
//   isPending,
// }: Props) {
//   return (
//     <div className="bg-white rounded-lg border p-6 space-y-6 text-school-primary">

//       {/* Exam Settings */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Exam Settings</h3>

//         {/* Difficulty */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">
//             Difficulty
//           </label>

//           <select
//             value={config.difficulty}
//             onChange={(e) =>
//               setConfig((prev) => ({
//                 ...prev,
//                 difficulty: e.target.value,
//               }))
//             }
//             className="w-full border rounded-md px-3 py-2"
//           >
//             <option value="easy">Easy</option>
//             <option value="medium">Medium</option>
//             <option value="hard">Hard</option>
//           </select>
//         </div>

//         {/* Question Count */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">
//             Number of Questions
//           </label>

//           <input
//             type="number"
//             value={config.questionCount}
//             onChange={(e) =>
//               setConfig((prev) => ({
//                 ...prev,
//                 questionCount: Number(e.target.value),
//               }))
//             }
//             className="w-full border rounded-md px-3 py-2"
//           />
//         </div>

//         {/* Duration */}
//         <div>
//           <label className="block text-sm font-medium mb-2">
//             Duration (minutes)
//           </label>

//           <input
//             type="number"
//             value={config.duration}
//             onChange={(e) =>
//               setConfig((prev) => ({
//                 ...prev,
//                 duration: Number(e.target.value),
//               }))
//             }
//             className="w-full border rounded-md px-3 py-2"
//           />
//         </div>
//       </div>

//       {/* Classroom Selection */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Assign Classes</h3>

//         <div className="space-y-2">
//           {validClassrooms.map((classroom) => {
//             const isSelected = selectedClassIds.includes(classroom.id);

//             return (
//               <div
//                 key={classroom.id}
//                 className="flex items-center gap-2"
//               >
//                 <input
//                   type="checkbox"
//                   checked={isSelected}
//                   onChange={() => toggleClass(classroom.id)}
//                 />

//                 <span>{classroom.name}</span>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Build Button */}
//       <button
//         onClick={handleBuildPool}
//         disabled={isPending}
//         className="w-full bg-school-primary text-white py-2 rounded-md hover:bg-blue-700 transition"
//       >
//         {isPending ? "Building..." : "Build Question Pool"}
//       </button>

//     </div>
//   );
// }



// "use client";

// import React from "react";

// type Config = {
//   examName: string;
//   difficulty: string;
//   questionCount: number;
//   duration: number;
// };

// type Classroom = {
//   id: number;
//   name: string;
// };

// type Props = {
//   config: Config;
//   setConfig: React.Dispatch<React.SetStateAction<Config>>;
//   validClassrooms: Classroom[];
//   selectedClassIds: number[];
//   toggleClass: (id: number) => void;
//   handleBuildPool: () => void;
//   isPending: boolean;
// };

// export function SettingsSidebar({
//   config,
//   setConfig,
//   validClassrooms,
//   selectedClassIds,
//   toggleClass,
//   handleBuildPool,
//   isPending,
// }: Props) {

//   const handleBuildClick = () => {
//     if (!config.examName.trim()) {
//       alert("Please enter the exam name before building the question pool.");
//       return;
//     }

//     handleBuildPool();
//   };

//   return (
//     <div className="bg-white rounded-lg border p-6 space-y-6 text-school-primary">

//       {/* Exam Settings */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Exam Settings</h3>

//         {/* Exam Name */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">
//             Exam Name
//           </label>

//           <textarea
//             placeholder="e.g. First Term Mathematics Test"
//             value={config.examName}
//             onChange={(e) =>
//               setConfig((prev) => ({
//                 ...prev,
//                 examName: e.target.value,
//               }))
//             }
//             className="w-full border rounded-md px-3 py-2 resize-none"
//             rows={2}
//           />
//         </div>

//         {/* Difficulty */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">
//             Difficulty
//           </label>

//           <select
//             value={config.difficulty}
//             onChange={(e) =>
//               setConfig((prev) => ({
//                 ...prev,
//                 difficulty: e.target.value,
//               }))
//             }
//             className="w-full border rounded-md px-3 py-2"
//           >
//             <option value="easy">Easy</option>
//             <option value="medium">Medium</option>
//             <option value="hard">Hard</option>
//           </select>
//         </div>

//         {/* Question Count */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">
//             Number of Questions
//           </label>

//           <input
//             type="number"
//             value={config.questionCount}
//             onChange={(e) =>
//               setConfig((prev) => ({
//                 ...prev,
//                 questionCount: Number(e.target.value),
//               }))
//             }
//             className="w-full border rounded-md px-3 py-2"
//           />
//         </div>

//         {/* Duration */}
//         <div>
//           <label className="block text-sm font-medium mb-2">
//             Duration (minutes)
//           </label>

//           <input
//             type="number"
//             value={config.duration}
//             onChange={(e) =>
//               setConfig((prev) => ({
//                 ...prev,
//                 duration: Number(e.target.value),
//               }))
//             }
//             className="w-full border rounded-md px-3 py-2"
//           />
//         </div>
//       </div>

//       {/* Classroom Selection */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Assign Classes</h3>

//         <div className="space-y-2">
//           {validClassrooms.map((classroom) => {
//             const isSelected = selectedClassIds.includes(classroom.id);

//             return (
//               <div key={classroom.id} className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={isSelected}
//                   onChange={() => toggleClass(classroom.id)}
//                 />

//                 <span>{classroom.name}</span>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Build Button */}
//       <button
//         onClick={handleBuildClick}
//         disabled={isPending}
//         className="w-full bg-school-primary text-white py-2 rounded-md hover:bg-blue-700 transition"
//       >
//         {isPending ? "Building..." : "Build Question Pool"}
//       </button>

//     </div>
//   );
// }


// "use client";

// import React from "react";
// import { Loader2, ShieldCheck, Database, Sparkles, School } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useExamStore, getErrorMessage } from "@/store/useExamStore";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface SettingsSidebarProps {
//   /**
//    * The trigger function to start the AI generation.
//    * This is usually a server action defined in the parent page.
//    */
//   onBuildPool: () => Promise<void> | void;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function SettingsSidebar({ onBuildPool }: SettingsSidebarProps) {
//   // Pulling everything from the Zustand store
//   const { 
//     config, 
//     setConfig, 
//     availableClasses, 
//     selectedClassIds, 
//     toggleClass, 
//     isSubmitting 
//   } = useExamStore();

//   const handleBuildClick = async () => {
//     try {
//       if (!config.title.trim()) {
//         // You can add a toast notification here
//         return; 
//       }
//       await onBuildPool();
//     } catch (error) {
//       console.error("[BUILD_CLICK_ERROR]:", getErrorMessage(error));
//     }
//   };

//   return (
//     <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 p-8 space-y-8 shadow-2xl sticky top-8">
      
//       {/* 1. IDENTITY SECTION */}
//       <div className="space-y-4">
//         <div className="flex items-center gap-2 text-school-primary">
//             <ShieldCheck className="h-4 w-4" />
//             <h3 className="text-[10px] font-black uppercase tracking-widest">Registry Identity</h3>
//         </div>

//         <div className="space-y-2">
//           <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-1">
//             Exam Title
//           </label>
//           <textarea
//             placeholder="e.g. JS1 Biology Mid-Term"
//             value={config.title}
//             onChange={(e) => setConfig({ title: e.target.value })}
//             className="w-full bg-slate-950 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white resize-none outline-none focus:border-school-primary transition-all font-bold uppercase italic"
//             rows={2}
//           />
//         </div>
//       </div>

//       {/* 2. REUSE LOGIC (The Mix) */}
//       <div className="space-y-4 pt-6 border-t border-white/5">
//         <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2 text-school-primary">
//                 <Database className="h-4 w-4" />
//                 <h3 className="text-[10px] font-black uppercase tracking-widest">Question Mix</h3>
//             </div>
//             <span className="text-[10px] font-black text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-white/5">
//                 {config.reusePercentage}%
//             </span>
//         </div>

//         <input 
//             type="range" 
//             min="0" 
//             max="100" 
//             step="10" 
//             value={config.reusePercentage} 
//             onChange={e => setConfig({ reusePercentage: Number(e.target.value) })} 
//             className="w-full accent-school-primary cursor-pointer h-1.5 bg-slate-950 rounded-lg appearance-none" 
//         />
        
//         <div className="flex justify-between items-start gap-4">
//             <div className="flex-1">
//                 <p className="text-[8px] font-black text-slate-600 uppercase">From Assessment Bank</p>
//                 <p className="text-[11px] font-bold text-slate-400">{config.reusePercentage}% Revision</p>
//             </div>
//             <div className="flex-1 text-right">
//                 <p className="text-[8px] font-black text-slate-600 uppercase">AI Synthesis</p>
//                 <p className="text-[11px] font-bold text-school-primary">{100 - config.reusePercentage}% New AI</p>
//             </div>
//         </div>
//       </div>

//       {/* 3. NUMERICAL CONFIG */}
//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">
//             Count
//           </label>
//           <input
//             type="number"
//             value={config.totalQuestions}
//             onChange={(e) => setConfig({ totalQuestions: Number(e.target.value) })}
//             className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-mono text-xs focus:border-school-primary outline-none"
//           />
//         </div>

//         <div className="space-y-2">
//           <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">
//             Duration (Mins)
//           </label>
//           <input
//             type="datetime-local"
//             value={config.startTime}
//             onChange={(e) => setConfig({ startTime: e.target.value })}
//             className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-mono text-[10px] focus:border-school-primary outline-none"
//           />
//         </div>
//       </div>

//       {/* 4. CLASSROOM SELECTION */}
//       <div className="space-y-4 pt-6 border-t border-white/5">
//         <div className="flex items-center gap-2 text-slate-400">
//             <School className="h-4 w-4" />
//             <h3 className="text-[10px] font-black uppercase tracking-widest">Target Rooms</h3>
//         </div>

//         <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
//           {availableClasses.map((classroom) => {
//             const isSelected = selectedClassIds.includes(classroom.id);

//             return (
//               <button
//                 key={classroom.id}
//                 type="button"
//                 onClick={() => toggleClass(classroom.id)}
//                 className={cn(
//                     "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all active:scale-95",
//                     isSelected 
//                         ? "bg-school-primary border-school-primary text-slate-950 shadow-lg shadow-school-primary/20" 
//                         : "bg-slate-950 border-white/10 text-slate-500 hover:border-white/30"
//                 )}
//               >
//                 {classroom.name}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* 5. BUILD BUTTON */}
//       <button
//         onClick={handleBuildClick}
//         disabled={isSubmitting || selectedClassIds.length === 0}
//         className="group relative w-full bg-school-primary text-slate-950 font-black py-5 rounded-2xl overflow-hidden hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-school-primary/10 disabled:opacity-20 disabled:grayscale"
//       >
//         <div className="relative z-10 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em]">
//             {isSubmitting ? (
//                 <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Synthesizing Pool...
//                 </>
//             ) : (
//                 <>
//                     <Sparkles className="h-4 w-4" />
//                     Build Vault Pool
//                 </>
//             )}
//         </div>
        
//         <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
//       </button>

//     </div>
//   );
// }





"use client";

import React from "react";
import { Loader2, ShieldCheck, Database, Sparkles, School, Clock, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExamStore } from "@/store/useExamStore";
import { useProfileStore } from "@/store/profileStore";
import { toast } from "sonner";

// ── Types ───────────────────────────────────────────────────────────────────

interface SettingsSidebarProps {
  /**
   * Rule 12: Trigger for the AI synthesis logic defined in the parent console.
   */
  onBuildPool: () => Promise<void>;
}

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * ARCHITECT ENGINE CONFIGURATION (Tier 2)
 * Rule 17: Eliminates prop drilling by interacting directly with Exam & Profile stores.
 * Rule 11: Real-time configuration of assessment metadata.
 */
export function SettingsSidebar({ onBuildPool }: SettingsSidebarProps) {
  const { profile } = useProfileStore();
  const { 
    config, 
    setConfig, 
    availableClasses, 
    selectedClassIds, 
    toggleClass, 
    isSubmitting 
  } = useExamStore();

  const primaryColor = profile?.primaryColor || "#f59e0b";

  const handleBuildClick = async () => {
    if (!config.title.trim()) {
      toast.error("Registry Entry Incomplete: Exam title required.");
      return; 
    }
    if (selectedClassIds.length === 0) {
      toast.error("Scope Unresolved: Select at least one target classroom.");
      return;
    }
    await onBuildPool();
  };

  return (
    <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 p-8 space-y-8 shadow-2xl sticky top-8">
      
      {/* 1. IDENTITY BLOCK */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" style={{ color: primaryColor }} />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Registry Identity</h3>
        </div>

        <div className="space-y-2">
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">
            Exam Title / Index
          </label>
          <textarea
            placeholder="e.g. BIOLOGY MID-TERM"
            value={config.title}
            onChange={(e) => setConfig({ title: e.target.value.toUpperCase() })}
            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white resize-none outline-none focus:border-school-primary transition-all font-black uppercase italic shadow-inner"
            rows={2}
            style={{ '--tw-ring-color': primaryColor } as any}
          />
        </div>
      </div>

      {/* 2. LOGIC MIX (Rule 8 AI Content) */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-slate-500" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Question Synthesis Mix</h3>
            </div>
            <span className="text-[10px] font-black text-white px-2 py-0.5 rounded-md bg-slate-950 border border-white/5 shadow-lg">
                {config.reusePercentage}%
            </span>
        </div>

        <input 
            type="range" 
            min="0" 
            max="100" 
            step="10" 
            value={config.reusePercentage} 
            onChange={e => setConfig({ reusePercentage: Number(e.target.value) })} 
            className="w-full cursor-pointer h-1.5 bg-slate-950 rounded-lg appearance-none accent-school-primary" 
            style={{ accentColor: primaryColor }}
        />
        
        <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">Bank Selection</p>
                <p className="text-[11px] font-black text-slate-400 uppercase italic">{config.reusePercentage}% Revision</p>
            </div>
            <div className="flex-1 text-right">
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">AI Synthesis</p>
                <p className="text-[11px] font-black uppercase italic" style={{ color: primaryColor }}>{100 - config.reusePercentage}% New</p>
            </div>
        </div>
      </div>

      {/* 3. PERFORMANCE PARAMETERS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">
            Item Count
          </label>
          <div className="relative">
            <input
                type="number"
                value={config.totalQuestions}
                onChange={(e) => setConfig({ totalQuestions: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-white/5 rounded-xl pl-10 pr-4 py-4 text-white font-mono text-sm focus:border-school-primary outline-none shadow-inner"
            />
            <Database className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-700" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">
            Duration (m)
          </label>
          <div className="relative">
            <input
                type="number"
                value={config.duration}
                onChange={(e) => setConfig({ duration: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-white/5 rounded-xl pl-10 pr-4 py-4 text-white font-mono text-sm focus:border-school-primary outline-none shadow-inner"
            />
            <Timer className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-700" />
          </div>
        </div>
      </div>

      {/* 4. SCHEDULE CONFIGURATION */}
      <div className="space-y-3 pt-6 border-t border-white/5">
        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">
            Registry Window Commencement
        </label>
        <div className="relative">
            <input
                type="datetime-local"
                value={config.startTime}
                onChange={(e) => setConfig({ startTime: e.target.value })}
                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono text-[11px] focus:border-school-primary outline-none uppercase shadow-inner"
            />
            <Clock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-800" />
        </div>
      </div>

      {/* 5. CLASSROOM SCOPE */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2">
            <School className="h-4 w-4 text-slate-500" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Identity Allocation</h3>
        </div>

        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto no-scrollbar">
          {availableClasses.map((classroom) => {
            const isSelected = selectedClassIds.includes(classroom.id);
            return (
              <button
                key={classroom.id}
                type="button"
                onClick={() => toggleClass(classroom.id)}
                className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-all active:scale-95 shadow-sm",
                    isSelected 
                        ? "bg-school-primary border-school-primary text-slate-950 shadow-lg" 
                        : "bg-slate-950 border-white/10 text-slate-500 hover:border-white/30"
                )}
                style={isSelected ? { backgroundColor: primaryColor } : {}}
              >
                {classroom.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. ENGINE TRIGGER */}
      <div className="pt-4">
        <button
            onClick={handleBuildClick}
            disabled={isSubmitting || selectedClassIds.length === 0}
            className="group relative w-full text-slate-950 font-black py-6 rounded-[2rem] overflow-hidden hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-20 disabled:grayscale"
            style={{ backgroundColor: primaryColor }}
        >
            <div className="relative z-10 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.3em]">
                {isSubmitting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Synthesizing...
                    </>
                ) : (
                    <>
                        <Sparkles className="h-4 w-4" />
                        Initialize Pool
                    </>
                )}
            </div>
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </button>
      </div>

    </div>
  );
}