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


"use client";

import React from "react";
import { Loader2, ShieldCheck, Database, Sparkles, School } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Updated Types to match Server Action ---
type Config = {
  title: string;
  totalQuestions: number;
  duration: number;
  reusePercentage: number; // The new field for the action
};

type Classroom = {
  id: string;
  name: string;
};

type Props = {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
  validClassrooms: Classroom[];
  selectedClassIds: string[];
  toggleClass: (id: string) => void;
  handleBuildPool: () => void;
  isPending: boolean;
};

export function SettingsSidebar({
  config,
  setConfig,
  validClassrooms,
  selectedClassIds,
  toggleClass,
  handleBuildPool,
  isPending,
}: Props) {

  const handleBuildClick = () => {
    if (!config.title.trim()) {
      return; // Handled by toast in parent usually, or alert
    }
    handleBuildPool();
  };

  return (
    <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 p-8 space-y-8 shadow-2xl sticky top-8">
      
      {/* 1. IDENTITY SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-school-primary">
            <ShieldCheck className="h-4 w-4" />
            <h3 className="text-[10px] font-black uppercase tracking-widest">Registry Identity</h3>
        </div>

        <div className="space-y-2">
          <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-1">
            Exam Title
          </label>
          <textarea
            placeholder="e.g. JS1 Biology Mid-Term"
            value={config.title}
            onChange={(e) => setConfig((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white resize-none outline-none focus:border-school-primary transition-all font-bold uppercase italic"
            rows={2}
          />
        </div>
      </div>

      {/* 2. REUSE LOGIC (The Mix) */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-school-primary">
                <Database className="h-4 w-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Question Mix</h3>
            </div>
            <span className="text-[10px] font-black text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-white/5">
                {config.reusePercentage}%
            </span>
        </div>

        <input 
            type="range" 
            min="0" 
            max="100" 
            step="10" 
            value={config.reusePercentage} 
            onChange={e => setConfig({...config, reusePercentage: Number(e.target.value)})} 
            className="w-full accent-school-primary cursor-pointer h-1.5 bg-slate-950 rounded-lg appearance-none" 
        />
        
        <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
                <p className="text-[8px] font-black text-slate-600 uppercase">From Assessment Bank</p>
                <p className="text-[11px] font-bold text-slate-400">{config.reusePercentage}% Revision</p>
            </div>
            <div className="flex-1 text-right">
                <p className="text-[8px] font-black text-slate-600 uppercase">AI Synthesis</p>
                <p className="text-[11px] font-bold text-school-primary">{100 - config.reusePercentage}% New AI</p>
            </div>
        </div>
      </div>

      {/* 3. NUMERICAL CONFIG */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">
            Count
          </label>
          <input
            type="number"
            value={config.totalQuestions}
            onChange={(e) => setConfig((prev) => ({ ...prev, totalQuestions: Number(e.target.value) }))}
            className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-mono text-xs focus:border-school-primary outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">
            Mins
          </label>
          <input
            type="number"
            value={config.duration}
            onChange={(e) => setConfig((prev) => ({ ...prev, duration: Number(e.target.value) }))}
            className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white font-mono text-xs focus:border-school-primary outline-none"
          />
        </div>
      </div>

      {/* 4. CLASSROOM SELECTION (Multi-Select) */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2 text-slate-400">
            <School className="h-4 w-4" />
            <h3 className="text-[10px] font-black uppercase tracking-widest">Target Rooms</h3>
        </div>

        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
          {validClassrooms.map((classroom) => {
            const isSelected = selectedClassIds.includes(classroom.id);

            return (
              <button
                key={classroom.id}
                type="button"
                onClick={() => toggleClass(classroom.id)}
                className={cn(
                    "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all active:scale-95",
                    isSelected 
                        ? "bg-school-primary border-school-primary text-slate-950 shadow-lg shadow-school-primary/20" 
                        : "bg-slate-950 border-white/10 text-slate-500 hover:border-white/30"
                )}
              >
                {classroom.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. BUILD BUTTON */}
      <button
        onClick={handleBuildClick}
        disabled={isPending || selectedClassIds.length === 0}
        className="group relative w-full bg-school-primary text-slate-950 font-black py-5 rounded-2xl overflow-hidden hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-school-primary/10 disabled:opacity-20 disabled:grayscale"
      >
        <div className="relative z-10 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em]">
            {isPending ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Synthesizing Pool...
                </>
            ) : (
                <>
                    <Sparkles className="h-4 w-4" />
                    Build Vault Pool
                </>
            )}
        </div>
        
        {/* Animated background glow on hover */}
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </button>

    </div>
  );
}