// 'use client'

// import { useState } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { Layers, BookOpen, GraduationCap, History, Zap } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { type EnhancedLessonContent } from "@/app/actions/ai-generator"
// import { Question, Role } from "@prisma/client"
// import { ScannedQuestionRegistry } from "@/components/scan/scannedQuestionRegistry"
// import { Badge } from "@/components/ui/badge"
// import { Card } from "@/components/ui/card"

// // ── Types ───────────────────────────────────────────────────────────────────

// interface LessonContentClientProps {
//   initialLesson: {
//     id: string;
//     title: string;
//     aiContent: EnhancedLessonContent;
//   };
//   initialScannedQuestions: Question[];
//   userId: string;
//   schoolId: string | null;
//   userRole: Role;
// }

// /**
//  * STUDENT MODULE VIEWER
//  * Rule 12: Hydrated with server-side props.
//  * Rule 17: Pulls primary branding color from Zustand store.
//  */
// export function LessonContentClient({ 
//   initialLesson, 
//   initialScannedQuestions,
//   userId,
//   schoolId,
//   userRole
// }: LessonContentClientProps) {
//   const { profile } = useProfileStore();
//   const [activeTab, setActiveTab] = useState<'content' | 'practice'>('content');
  
//   const primaryColor = profile?.primaryColor || "#f59e0b";
//   const content = initialLesson.aiContent.studentContent;

//   return (
//     <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700">
      
//       {/* ── HEADER ── */}
//       <header className="border-b border-white/5 pb-10">
//         <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 rounded-lg bg-slate-900 border border-white/5">
//                 <Layers className="h-4 w-4 text-school-primary" style={{ color: primaryColor }} />
//             </div>
//             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Registry Module</span>
//         </div>
//         <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
//             {initialLesson.title}
//         </h1>

//         {/* TABS SWITCHER */}
//         <div className="flex p-1.5 bg-slate-900 rounded-2xl w-fit border border-white/5 shadow-inner">
//             <button 
//                 onClick={() => setActiveTab('content')}
//                 className={cn(
//                     "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
//                     activeTab === 'content' ? "bg-slate-950 text-white shadow-xl border border-white/10" : "text-slate-500 hover:text-white"
//                 )}
//             >
//                 Lesson Note
//             </button>
//             <button 
//                 onClick={() => setActiveTab('practice')}
//                 className={cn(
//                     "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
//                     activeTab === 'practice' ? "bg-slate-950 text-white shadow-xl border border-white/10" : "text-slate-500 hover:text-white"
//                 )}
//             >
//                 <History className="h-3.5 w-3.5" style={activeTab === 'practice' ? { color: primaryColor } : {}} /> Past Papers
//             </button>
//         </div>
//       </header>

//       {activeTab === 'content' && (
//         <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
          
//           {/* OBJECTIVES */}
//           <div className="flex flex-wrap gap-2">
//               {content.learningObjectives.map((obj, i) => (
//                   <Badge key={i} variant="outline" className="px-4 py-2 bg-slate-900 border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">
//                     <GraduationCap className="h-3 w-3 mr-2" style={{ color: primaryColor }} /> {obj}
//                   </Badge>
//               ))}
//           </div>

//           {/* SUMMARY */}
//           <section className="space-y-4">
//             <div className="flex items-center gap-3 ml-2">
//                 <div className="h-px w-8" style={{ backgroundColor: primaryColor }} />
//                 <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">Core Summary</h2>
//             </div>
//             <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
//               <p className="text-slate-300 text-xl leading-loose italic font-medium">{content.summary}</p>
//             </div>
//           </section>

//           {/* CONTENT */}
//           <section className="space-y-6">
//             <div className="flex items-center gap-3 ml-2">
//                 <div className="h-px w-8" style={{ backgroundColor: primaryColor }} />
//                 <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">Theoretical Framework</h2>
//             </div>
//             <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-2xl text-slate-200 whitespace-pre-line leading-loose text-lg font-medium">
//               {content.explanation}
//             </div>
//           </section>

//           {/* VISUAL REGISTRY */}
//           {content.visualAids.length > 0 && (
//             <section className="space-y-6">
//                 <div className="flex items-center gap-3 ml-2">
//                     <div className="h-px w-8" style={{ backgroundColor: primaryColor }} />
//                     <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">Visual Assets</h2>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {content.visualAids.map((v, i) => (
//                     <Card key={i} className="bg-slate-950 rounded-[2rem] border border-white/5 overflow-hidden group hover:border-white/10 transition-all">
//                         <div className="p-8 space-y-3">
//                             <h4 className="text-base font-black text-white uppercase italic group-hover:text-school-primary transition-colors" style={{ color: primaryColor }}>{v.title}</h4>
//                             <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-tight">{v.description}</p>
//                         </div>
//                     </Card>
//                     ))}
//                 </div>
//             </section>
//           )}
//         </div>
//       )}

//       {activeTab === 'practice' && (
//         <div className="animate-in slide-in-from-right-4 duration-500">
//             <ScannedQuestionRegistry 
//                 questions={initialScannedQuestions}
//                 userRole={userRole}
//             />
//         </div>
//       )}
//     </div>
//   );
// }



'use client'

import { useState } from "react"
import { useProfileStore } from "@/store/profileStore"
import { Layers, GraduationCap, History, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
// ✅ FIXED: Importing the refactored type from the actions file
import { type EnhancedLessonContent } from "@/app/actions/ai-generator"
import { Question, Role } from "@prisma/client"
import { ScannedQuestionRegistry } from "@/components/scan/scannedQuestionRegistry"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"


// ── Types ───────────────────────────────────────────────────────────────────

interface LessonContentClientProps {
  initialLesson: {
    id: string;
    title: string;
    aiContent: EnhancedLessonContent;
  };
  initialScannedQuestions: Question[];
  userId: string;
  schoolId: string | null;
  userRole: Role;
}

/**
 * STUDENT MODULE VIEWER
 * Rule 12: Hydrated with server-side props.
 * Rule 17: Pulls primary branding color from Zustand store.
 */
export function LessonContentClient({ 
  initialLesson, 
  initialScannedQuestions,
  userId,
  schoolId,
  userRole
}: LessonContentClientProps) {
  const { profile } = useProfileStore();
  const [activeTab, setActiveTab] = useState<'content' | 'practice'>('content');
  
  const primaryColor = profile?.primaryColor || "#f59e0b";
  const content = initialLesson.aiContent.studentContent;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700">
      
      {/* ── HEADER ── */}
      <header className="border-b border-white/5 pb-10">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-slate-900 border border-white/5 shadow-inner">
                <Layers className="h-4 w-4 text-school-primary" style={{ color: primaryColor }} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Academic Module</span>
        </div>
        <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-8">
            {initialLesson.title}
        </h1>

        {/* TABS SWITCHER (Rule 11 System Truth) */}
        <div className="flex p-1.5 bg-slate-900 rounded-2xl w-fit border border-white/5 shadow-2xl">
            <button 
                onClick={() => setActiveTab('content')}
                className={cn(
                    "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === 'content' ? "bg-slate-950 text-white shadow-xl border border-white/10" : "text-slate-500 hover:text-white"
                )}
            >
                Lesson Note
            </button>
            <button 
                onClick={() => setActiveTab('practice')}
                className={cn(
                    "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                    activeTab === 'practice' ? "bg-slate-950 text-white shadow-xl border border-white/10" : "text-slate-500 hover:text-white"
                )}
            >
                <History className="h-3.5 w-3.5" style={activeTab === 'practice' ? { color: primaryColor } : {}} /> Past Papers
            </button>
        </div>
      </header>

      {activeTab === 'content' && (
        <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
          
          {/* OBJECTIVES */}
          <div className="flex flex-wrap gap-2">
              {content.learningObjectives.map((obj, i) => (
                  <Badge key={i} variant="outline" className="px-4 py-2 bg-slate-900 border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <GraduationCap className="h-3 w-3 mr-2" style={{ color: primaryColor }} /> {obj}
                  </Badge>
              ))}
          </div>

          {/* SUMMARY */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 ml-2">
                <div className="h-px w-8" style={{ backgroundColor: primaryColor }} />
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest italic">Executive Summary</h2>
            </div>
            <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
              <p className="text-slate-300 text-xl leading-loose italic font-medium">{content.summary}</p>
            </div>
          </section>

          {/* CONTENT */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 ml-2">
                <div className="h-px w-8" style={{ backgroundColor: primaryColor }} />
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest italic">Theoretical Framework</h2>
            </div>
            <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-2xl text-slate-200 whitespace-pre-line leading-loose text-lg font-medium">
              {content.explanation}
            </div>
          </section>

          {/* VISUAL REGISTRY */}
          {content.visualAids.length > 0 && (
            <section className="space-y-6">
                <div className="flex items-center gap-3 ml-2">
                    <div className="h-px w-8" style={{ backgroundColor: primaryColor }} />
                    <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest italic">Visual Registry</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {content.visualAids.map((v, i) => (
                    <Card key={i} className="bg-slate-950 rounded-[2rem] border border-white/5 overflow-hidden group hover:border-white/10 transition-all shadow-xl">
                        <div className="p-8 space-y-3">
                            <h4 className="text-base font-black text-white uppercase italic group-hover:text-school-primary transition-colors" style={{ color: primaryColor }}>{v.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-tight">{v.description}</p>
                        </div>
                    </Card>
                    ))}
                </div>
            </section>
          )}
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="animate-in slide-in-from-right-4 duration-500">
            <ScannedQuestionRegistry 
                questions={initialScannedQuestions}
                userRole={userRole}
            />
        </div>
      )}
    </div>
  );
}