// import { SubjectSelector } from "./subjectSelector";
// import { SyllabusSelector } from "./syllabusSelector";
// import { SettingsSidebar } from "./settingsSidebar";

// export function DraftBuilder(props: any) {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

//       <SubjectSelector
//         assignments={props.assignments}
//         selectedAssignment={props.selectedAssignment}
//         setSelectedAssignment={props.setSelectedAssignment}
//       />

//       <SyllabusSelector
//         termGroups={props.termGroups}
//         selectedTopicIds={props.selectedTopicIds}
//         setSelectedTopicIds={props.setSelectedTopicIds}
//       />

//       <SettingsSidebar {...props} />
//     </div>
//   );
// }


// import { SubjectSelector } from "./subjectSelector";
// import { SyllabusSelector } from "./syllabusSelector";
// import { SettingsSidebar } from "./settingsSidebar";
// import { Card } from "@/components/ui/card";

// export function DraftBuilder(props: any) {
//   return (
//     <div className="max-w-3xl mx-auto flex flex-col gap-10">

//       {/* Step 1 */}
//       <Card className="p-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
        
//         <div className="flex items-center gap-3 mb-6">
//           <div className="h-8 w-8 rounded-full bg-school-primary text-white flex items-center justify-center text-sm font-bold">
//             1
//           </div>
//           <h3 className="text-lg font-bold tracking-tight">
//             Select Subject
//           </h3>
//         </div>

//         <div className="border-t pt-6">
//           <SubjectSelector
//             assignments={props.assignments}
//             selectedAssignment={props.selectedAssignment}
//             setSelectedAssignment={props.setSelectedAssignment}
//           />
//         </div>

//       </Card>


//       {/* Step 2 */}
//       <Card className="p-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
        
//         <div className="flex items-center gap-3 mb-6">
//           <div className="h-8 w-8 rounded-full bg-school-primary text-white flex items-center justify-center text-sm font-bold">
//             2
//           </div>
//           <h3 className="text-lg font-bold tracking-tight">
//             Choose Topics
//           </h3>
//         </div>

//         <div className="border-t pt-6">
//           <SyllabusSelector
//             termGroups={props.termGroups}
//             selectedTopicIds={props.selectedTopicIds}
//             setSelectedTopicIds={props.setSelectedTopicIds}
//           />
//         </div>

//       </Card>


//       {/* Step 3 */}
//       <Card className="p-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
        
//         <div className="flex items-center gap-3 mb-6">
//           <div className="h-8 w-8 rounded-full bg-school-primary text-white flex items-center justify-center text-sm font-bold">
//             3
//           </div>
//           <h3 className="text-lg font-bold tracking-tight">
//             Exam Settings & Classes
//           </h3>
//         </div>

//         <div className="border-t pt-6">
//           <SettingsSidebar {...props} />
//         </div>

//       </Card>

//     </div>
//   );
// }



// "use client";

// import { SubjectSelector } from "./subjectSelector";
// import { SyllabusSelector } from "./syllabusSelector";
// import { SettingsSidebar } from "./settingsSidebar";
// import { Card } from "@/components/ui/card";
// // Import Prisma types
// import { GradeSubject, Subject, Grade, Topic, Term, Class } from "@prisma/client";
// import { Dispatch, SetStateAction } from "react";

// // ── Utility ──────────────────────────────────────────────────────────────────

// function getErrorMessage(error: unknown): string {
//   if (error instanceof Error) return error.message;
//   if (error && typeof error === 'object' && 'message' in error) {
//     return String(error.message);
//   }
//   return typeof error === 'string' ? error : "An unknown error occurred";
// }

// // ── Types ───────────────────────────────────────────────────────────────────

// export interface AssignmentWithDetails extends GradeSubject {
//   subject: Subject;
//   grade: Grade;
// }

// export interface TermGroup {
//   id: string;
//   displayName: string;
//   index: number;
//   topics: Topic[];
// }

// interface DraftBuilderProps {
//   // Step 1 Props
//   assignments: AssignmentWithDetails[];
//   selectedAssignment: AssignmentWithDetails | null;
//   setSelectedAssignment: Dispatch<SetStateAction<AssignmentWithDetails | null>>;

//   // Step 2 Props
//   termGroups: TermGroup[];
//   selectedTopicIds: string[];
//   setSelectedTopicIds: Dispatch<SetStateAction<string[]>>;

//   // Step 3 Props (Passed to SettingsSidebar)
//   examTitle: string;
//   setExamTitle: Dispatch<SetStateAction<string>>;
//   duration: number;
//   setDuration: Dispatch<SetStateAction<number>>;
//   selectedClassIds: string[];
//   setSelectedClassIds: Dispatch<SetStateAction<string[]>>;
//   availableClasses: Class[];
  
//   // Action state
//   isSubmitting?: boolean;
//   onSubmit: () => Promise<void>;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function DraftBuilder(props: DraftBuilderProps) {
//   try {
//     return (
//       <div className="max-w-3xl mx-auto flex flex-col gap-10">

//         {/* Step 1 */}
//         <Card className="p-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
          
//           <div className="flex items-center gap-3 mb-6">
//             <div className="h-8 w-8 rounded-full bg-school-primary text-white flex items-center justify-center text-sm font-bold">
//               1
//             </div>
//             <h3 className="text-lg font-bold tracking-tight">
//               Select Subject
//             </h3>
//           </div>

//           <div className="border-t pt-6">
//             <SubjectSelector
//               assignments={props.assignments}
//               selectedAssignment={props.selectedAssignment}
//               setSelectedAssignment={props.setSelectedAssignment}
//             />
//           </div>

//         </Card>


//         {/* Step 2 */}
//         <Card className="p-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
          
//           <div className="flex items-center gap-3 mb-6">
//             <div className="h-8 w-8 rounded-full bg-school-primary text-white flex items-center justify-center text-sm font-bold">
//               2
//             </div>
//             <h3 className="text-lg font-bold tracking-tight">
//               Choose Topics
//             </h3>
//           </div>

//           <div className="border-t pt-6">
//             <SyllabusSelector
//               termGroups={props.termGroups}
//               selectedTopicIds={props.selectedTopicIds}
//               setSelectedTopicIds={props.setSelectedTopicIds}
//             />
//           </div>

//         </Card>


//         {/* Step 3 */}
//         <Card className="p-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
          
//           <div className="flex items-center gap-3 mb-6">
//             <div className="h-8 w-8 rounded-full bg-school-primary text-white flex items-center justify-center text-sm font-bold">
//               3
//             </div>
//             <h3 className="text-lg font-bold tracking-tight">
//               Exam Settings & Classes
//             </h3>
//           </div>

//           <div className="border-t pt-6">
//             <SettingsSidebar {...props} />
//           </div>

//         </Card>

//       </div>
//     );
//   } catch (error) {
//     // Graceful error logging using the requested utility
//     console.error("DraftBuilder render error:", getErrorMessage(error));
//     return (
//       <Card className="p-8 border-red-200 bg-red-50 text-red-800 text-sm font-medium">
//         Failed to initialize the exam builder. Please refresh and try again.
//       </Card>
//     );
//   }
// }



// "use client";

// import { SubjectSelector } from "./subjectSelector";
// import { SyllabusSelector } from "./syllabusSelector";
// import { SettingsSidebar } from "./settingsSidebar";
// import { Card } from "@/components/ui/card";
// // Import Prisma types - Removed unused 'Term'
// import { GradeSubject, Subject, Grade, Topic, Class } from "@prisma/client";
// import { Dispatch, SetStateAction, useCallback } from "react";

// // ── Utility ──────────────────────────────────────────────────────────────────

// function getErrorMessage(error: unknown): string {
//   if (error instanceof Error) return error.message;
//   if (error && typeof error === 'object' && 'message' in error) {
//     return String((error as { message?: string }).message);
//   }
//   return typeof error === 'string' ? error : "An unknown error occurred";
// }

// // ── Types ───────────────────────────────────────────────────────────────────

// export interface AssignmentWithDetails extends GradeSubject {
//   subject: Subject;
//   grade: Grade;
// }

// export interface TermGroup {
//   id: string;
//   displayName: string;
//   index: number;
//   topics: Topic[];
// }

// // This matches what SettingsSidebar expects based on the error message
// export interface ExamConfig {
//   title: string;
//   duration: number;
// }

// interface DraftBuilderProps {
//   // Step 1 Props
//   assignments: AssignmentWithDetails[];
//   selectedAssignment: AssignmentWithDetails | null;
//   setSelectedAssignment: Dispatch<SetStateAction<AssignmentWithDetails | null>>;

//   // Step 2 Props
//   termGroups: TermGroup[];
//   selectedTopicIds: string[];
//   setSelectedTopicIds: Dispatch<SetStateAction<string[]>>;

//   // Step 3 Props 
//   examTitle: string;
//   setExamTitle: (title: string) => void;
//   duration: number;
//   setDuration: (val: number) => void;
//   selectedClassIds: string[];
//   setSelectedClassIds: Dispatch<SetStateAction<string[]>>;
//   availableClasses: Class[];
  
//   // Action state
//   isSubmitting?: boolean;
//   onSubmit: () => Promise<void>;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function DraftBuilder(props: DraftBuilderProps) {
  
//   // ── Adapters for Child Components ──────────────────────────────────────────

//   // 1. Adapter for SubjectSelector (fixes incompatible Dispatch type)
//   const handleSubjectChange = useCallback((assignment: any) => {
//     props.setSelectedAssignment(assignment as AssignmentWithDetails);
//   }, [props]);

//   // 2. Adapter for SettingsSidebar (fixes missing config/toggleClass)
//   const sidebarConfig: ExamConfig = {
//     title: props.examTitle,
//     duration: props.duration
//   };

//   const setSidebarConfig = useCallback((newConfig: ExamConfig | ((prev: ExamConfig) => ExamConfig)) => {
//     if (typeof newConfig === 'function') {
//         // Handle functional updates if necessary, though simple mapping is shown below
//         const updated = newConfig(sidebarConfig);
//         props.setExamTitle(updated.title);
//         props.setDuration(updated.duration);
//     } else {
//         props.setExamTitle(newConfig.title);
//         props.setDuration(newConfig.duration);
//     }
//   }, [props, sidebarConfig]);

//   const toggleClass = useCallback((classId: string) => {
//     props.setSelectedClassIds(prev => 
//       prev.includes(classId) ? prev.filter(id => id !== classId) : [...prev, classId]
//     );
//   }, [props]);

//   try {
//     return (
//       <div className="max-w-3xl mx-auto flex flex-col gap-10">

//         {/* Step 1 */}
//         <Card className="p-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="h-8 w-8 rounded-full bg-school-primary text-white flex items-center justify-center text-sm font-bold">
//               1
//             </div>
//             <h3 className="text-lg font-bold tracking-tight">Select Subject</h3>
//           </div>

//           <div className="border-t pt-6">
//             <SubjectSelector
//               assignments={props.assignments}
//               selectedAssignment={props.selectedAssignment}
//               setSelectedAssignment={handleSubjectChange}
//             />
//           </div>
//         </Card>

//         {/* Step 2 */}
//         <Card className="p-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="h-8 w-8 rounded-full bg-school-primary text-white flex items-center justify-center text-sm font-bold">
//               2
//             </div>
//             <h3 className="text-lg font-bold tracking-tight">Choose Topics</h3>
//           </div>

//           <div className="border-t pt-6">
//             <SyllabusSelector
//               termGroups={props.termGroups}
//               selectedTopicIds={props.selectedTopicIds}
//               setSelectedTopicIds={props.setSelectedTopicIds}
//             />
//           </div>
//         </Card>

//         {/* Step 3 */}
//         <Card className="p-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="h-8 w-8 rounded-full bg-school-primary text-white flex items-center justify-center text-sm font-bold">
//               3
//             </div>
//             <h3 className="text-lg font-bold tracking-tight">Exam Settings & Classes</h3>
//           </div>

//           <div className="border-t pt-6">
//             <SettingsSidebar 
//                 config={sidebarConfig}
//                 setConfig={setSidebarConfig}
//                 validClassrooms={props.availableClasses}
//                 selectedClassIds={props.selectedClassIds}
//                 toggleClass={toggleClass}
//                 isSubmitting={props.isSubmitting}
//                 onSubmit={props.onSubmit}
//             />
//           </div>
//         </Card>

//       </div>
//     );
//   } catch (error) {
//     console.error("DraftBuilder render error:", getErrorMessage(error));
//     return (
//       <Card className="p-8 border-red-200 bg-red-50 text-red-800 text-sm font-medium">
//         Failed to initialize the exam builder. Please refresh and try again.
//       </Card>
//     );
//   }
// }

// "use client";

// import React, { useCallback } from "react";
// import { SubjectSelector } from "./subjectSelector";
// import { SyllabusSelector } from "./syllabusSelector";
// import { SettingsSidebar } from "./settingsSidebar";
// import { Card } from "@/components/ui/card";
// import { useExamStore, getErrorMessage } from "@/store/useExamStore";

// // ── Main Component ──────────────────────────────────────────────────────────

// export function DraftBuilder({ onSubmit }: { onSubmit: () => Promise<void> | void }) {
//   const {
//     assignments,
//     selectedAssignment,
//     setSelectedAssignment,
//     termGroups,
//     selectedTopicIds,
//     setSelectedTopicIds, // This is (ids: string[]) => void
//   } = useExamStore();

//   /**
//    * ADAPTER: Reconciles Zustand's (ids: string[]) => void 
//    * with React.Dispatch<React.SetStateAction<string[]>>.
//    */
//   const handleSetTopics: React.Dispatch<React.SetStateAction<string[]>> = useCallback(
//     (value) => {
//       if (typeof value === "function") {
//         // Calculate the next state using the current state from the store
//         const nextIds = value(selectedTopicIds);
//         setSelectedTopicIds(nextIds);
//       } else {
//         setSelectedTopicIds(value);
//       }
//     },
//     [selectedTopicIds, setSelectedTopicIds]
//   );

//   const handleSubjectChange = useCallback((assignment: unknown) => {
//     setSelectedAssignment(assignment as any);
//   }, [setSelectedAssignment]);

//   try {
//     return (
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
//         <div className="lg:col-span-2 space-y-10">
          
//           {/* Step 1: Subject */}
//           <Card className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900 shadow-2xl">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="h-8 w-8 rounded-xl bg-school-primary/10 text-school-primary border border-school-primary/20 flex items-center justify-center text-xs font-black">
//                 01
//               </div>
//               <h3 className="text-sm font-black uppercase tracking-widest text-white italic">
//                 Registry Selection
//               </h3>
//             </div>
//             <div className="pt-6 border-t border-white/5">
//               <SubjectSelector
//                 assignments={assignments as any}
//                 selectedAssignment={selectedAssignment as any}
//                 setSelectedAssignment={handleSubjectChange}
//               />
//             </div>
//           </Card>

//           {/* Step 2: Syllabus */}
//           <Card className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900 shadow-2xl">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="h-8 w-8 rounded-xl bg-school-primary/10 text-school-primary border border-school-primary/20 flex items-center justify-center text-xs font-black">
//                 02
//               </div>
//               <h3 className="text-sm font-black uppercase tracking-widest text-white italic">
//                 Syllabus Architecture
//               </h3>
//             </div>
//             <div className="pt-6 border-t border-white/5">
//               <SyllabusSelector
//                 termGroups={termGroups}
//                 selectedTopicIds={selectedTopicIds}
//                 setSelectedTopicIds={handleSetTopics} // FIXED: Passed the adapter here
//               />
//             </div>
//           </Card>
//         </div>

//         <div className="lg:col-span-1">
//           <SettingsSidebar onBuildPool={onSubmit} />
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error("[DRAFT_BUILDER_CRASH]:", getErrorMessage(error));
//     return (
//       <div className="p-12 text-center bg-slate-950 border border-red-500/20 rounded-[3rem]">
//         <h2 className="text-white font-black text-lg">Architect Error</h2>
//         <p className="text-slate-500 text-xs mt-2">{getErrorMessage(error)}</p>
//       </div>
//     );
//   }
// }



"use client";

import React, { useCallback } from "react";
import { SubjectSelector } from "./subjectSelector";
import { SyllabusSelector } from "./syllabusSelector";
import { SettingsSidebar } from "./settingsSidebar";
import { Card } from "@/components/ui/card";
import { useExamStore, getErrorMessage, type AssignmentWithDetails } from "@/store/useExamStore";

// ── Main Component ──────────────────────────────────────────────────────────

export function DraftBuilder({ onSubmit }: { onSubmit: () => Promise<void> | void }) {
  const {
    assignments,
    selectedAssignment,
    setSelectedAssignment,
    termGroups,
    selectedTopicIds,
    setSelectedTopicIds,
  } = useExamStore();

  /**
   * ADAPTER: Reconciles Zustand's (ids: string[]) => void 
   * with React.Dispatch<React.SetStateAction<string[]>>.
   */
  const handleSetTopics: React.Dispatch<React.SetStateAction<string[]>> = useCallback(
    (value) => {
      if (typeof value === "function") {
        const nextIds = value(selectedTopicIds);
        setSelectedTopicIds(nextIds);
      } else {
        setSelectedTopicIds(value);
      }
    },
    [selectedTopicIds, setSelectedTopicIds]
  );

  /**
   * FIXED: Removed 'any'. Using 'unknown' for the incoming event/value 
   * and casting to the store's strict AssignmentWithDetails type.
   */
  const handleSubjectChange = useCallback((assignment: unknown) => {
    setSelectedAssignment(assignment as AssignmentWithDetails | null);
  }, [setSelectedAssignment]);

  try {
    return (
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Step 1: Subject */}
          <Card className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-xl bg-school-primary/10 text-school-primary border border-school-primary/20 flex items-center justify-center text-xs font-black">
                01
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white italic">
                Registry Selection
              </h3>
            </div>
            <div className="pt-6 border-t border-white/5">
              {/* FIXED: Removed 'as any'. Types are now inferred from the store */}
              <SubjectSelector
                assignments={assignments}
                selectedAssignment={selectedAssignment}
                setSelectedAssignment={handleSubjectChange}
              />
            </div>
          </Card>

          {/* Step 2: Syllabus */}
          <Card className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-xl bg-school-primary/10 text-school-primary border border-school-primary/20 flex items-center justify-center text-xs font-black">
                02
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white italic">
                Syllabus Architecture
              </h3>
            </div>
            <div className="pt-6 border-t border-white/5">
              <SyllabusSelector
                termGroups={termGroups}
                selectedTopicIds={selectedTopicIds}
                setSelectedTopicIds={handleSetTopics}
              />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <SettingsSidebar onBuildPool={onSubmit} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("[DRAFT_BUILDER_CRASH]:", getErrorMessage(error));
    return (
      <div className="p-12 text-center bg-slate-950 border border-red-500/20 rounded-[3rem]">
        <h2 className="text-white font-black text-lg">Architect Error</h2>
        <p className="text-slate-500 text-xs mt-2">{getErrorMessage(error)}</p>
      </div>
    );
  }
}