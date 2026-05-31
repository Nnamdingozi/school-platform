


// "use client"

// import { useState, useEffect, useTransition } from "react"
// import ReactMarkdown from "react-markdown"
// import Image from "next/image"
// import { 
//     Sparkles, ImageIcon, FileText, HelpCircle, Zap, 
//     Loader2, Edit3, Save, Layout, 
//     type LucideIcon 
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// // Actions
// import { generateLessonForTopic } from "@/app/actions/ai-generator" 
// import { generateDiagramImage } from "@/app/actions/generate-diagram" 
// import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
// import { getErrorMessage } from "@/lib/error-handler"
// import { publishLesson } from "@/app/actions/lesson.actions"

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface VisualAid {
//   title: string;
//   description: string;
//   imagePrompt: string;
//   url?: string; 
// }

// // ✅ FIX: Synchronized with the Zod schema in ai-generator.ts
// export interface EnhancedLessonContent {
//   metadata: {
//       topicContext: string;
//       difficultyLevel: string;
//   };
//   teacherLogic: {
//       teachingMethod: string;
//       timeAllocation: string;
//       pedagogicalTips: string;
//       introductionHook: string;
//   };
//   studentContent: {
//       title: string;
//       explanation: string;
//       summary: string; // ✅ Renamed from key_summary to match schema
//       learningObjectives: string[];
//       vocabulary: string[];
//       visualAids: VisualAid[]; 
//       examples: { // ✅ Added missing examples property
//           task: string;
//           solution: string;
//       }[];
//       quiz: {
//           question: string;
//           options: string[];
//           answer: string;
//           explanation: string;
//       }[];
//   };
// }

// interface AILessonPlannerProps {
//   topicId: string;
//   lessonId: string; 
//   topicTitle: string;
//   schoolId: string;
//   initialData?: EnhancedLessonContent | null;
//   mode?: "teacher" | "student";
// }

// // ── Main Component ─────────────────────────────────────────────────────────────

// export function AILessonPlanner({ 
//     topicId, 
//     lessonId, 
//     topicTitle, 
//     schoolId, 
//     initialData,
//     mode = "teacher" 
// }: AILessonPlannerProps) {
  
//   const isTeacher = mode === "teacher";
//   const [activeTab, setActiveTab] = useState<string>("explanation")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [isPending, startTransition] = useTransition()
  
//   const [data, setData] = useState<EnhancedLessonContent | null>(initialData || null)
//   const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({})

//   useEffect(() => {
//     setData(initialData || null)
//     setIsEditing(false)
//   }, [topicId, initialData])

//   // ── Handlers ───────────────────────────────────────────────────────────

//   const handleGenerate = async () => {
//     if (!isTeacher) return;
  
//     setIsGenerating(true)
  
//     try {
//       const res = await generateLessonForTopic(topicId, schoolId)
  
//       if (!res.success) {
//         toast.error(res.error ?? "Lesson generation failed")
//         return
//       }
  
//       if (res.aiContent) {
//         setData(res.aiContent as EnhancedLessonContent)
//         toast.success("AI Generation Complete")
//       }
  
//     } catch (err) {
//       console.error(err)
//       toast.error(getErrorMessage(err))
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleManualSave = () => {
//     if (!data) return;
  
//     startTransition(async () => {
//       const res = await publishLesson({
//         topicId,
//         schoolId,
//         content: data
//       });
  
//       if (res.success) {
//         toast.success("Lesson published successfully");
//         setIsEditing(false);
//       }
//     });
//   };
  
//   const handleGenerateImage = async (index: number, prompt: string) => {
//     if (!isTeacher || loadingImages[index] || (data?.studentContent.visualAids[index]?.url)) return;
//     setLoadingImages(prev => ({ ...prev, [index]: true }))
//     try {
//       const result = await generateDiagramImage(prompt) 
//       if (result.success && result.url) {
//         setData(current => {
//           if (!current) return null;
//           const updated = [...current.studentContent.visualAids];
//           updated[index] = { ...updated[index], url: result.url };
//           return { ...current, studentContent: { ...current.studentContent, visualAids: updated } };
//         });
//         await saveGeneratedImageUrlToLesson(lessonId, index, result.url);
//         toast.success("Asset bound to registry.");
//       }
//     } finally {
//       setLoadingImages(prev => ({ ...prev, [index]: false }))
//     }
//   }

// if (!data) {
// return (
// <div className="py-20 text-center bg-slate-900 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">

// <div className="h-20 w-20 bg-school-primary/10 rounded-full flex items-center justify-center mx-auto text-school-primary border border-school-primary/20">
// <Sparkles className="h-10 w-10 animate-pulse" />
// </div>

// <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
// Registry Standby
// </h3>

// <p className="text-sm text-slate-400 uppercase tracking-widest">
// Topic
// </p>

// <p className="text-xl font-black text-school-primary uppercase italic tracking-tight">
// {topicTitle}
// </p>

// {isTeacher && (
// <Button
// onClick={handleGenerate}
// disabled={isGenerating}
// className="bg-school-primary text-slate-950 font-black px-10 py-7 rounded-2xl hover:text-slate-300"
// >
// {isGenerating ? (
// <>
// <Loader2 className="animate-spin mr-2" />
// GENERATING LESSON FOR {topicTitle.toUpperCase()}
// </>
// ) : (
// <>
// <Sparkles className="mr-2 h-5 w-5" />
// GENERATE LESSON
// </>
// )}
// </Button>
// )}

// </div>
// )
// }
//   return (
//     <Card className="border-white/5 bg-slate-200 shadow-2xl overflow-hidden rounded-[2.5rem] flex flex-col">
//       <CardHeader className="bg-slate-950/50 border-b border-white/5 p-8">
//         <div className="flex items-center justify-between gap-4">
//           <div className="flex-1 min-w-0">
//              <div className="flex items-center gap-3 mb-1">
//                 <Layout className="h-5 w-5 text-school-primary" />
//                 <CardTitle className="text-2xl font-black text-white uppercase italic tracking-tighter truncate">
//                     {data.studentContent.title}
//                 </CardTitle>
//              </div>
//              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{topicTitle}</p>
//           </div>
          
//           {isTeacher && (
//             <div className="flex items-center gap-3 shrink-0">
//               {!isEditing ? (
//                   <Button variant="outline" onClick={() => setIsEditing(true)} className="border-white/10 text-slate-400">
//                       <Edit3 className="h-4 w-4 mr-2" /> Edit
//                   </Button>
//               ) : (
//                   <div className="flex gap-2">
//                       <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-slate-500">Cancel</Button>
//                       <Button onClick={handleManualSave} disabled={isPending} className="bg-school-primary text-slate-950 font-black rounded-xl">
//                           {isPending ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
//                           SYNC
//                       </Button>
//                   </div>
//               )}
//             </div>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-8 flex-1">
//         <div className="flex flex-wrap gap-2 mb-10 bg-slate-400 p-1.5 text-gray-200 rounded-2xl w-fit border border-white/5 shadow-inner">
//             <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Lesson Notes" />
//             {isTeacher && <TabButton active={activeTab === "pedagogy"} onClick={() => setActiveTab("pedagogy")} icon={Zap} label="Strategy" />}
//             <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visuals" />
//             <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quiz Ref" />
//         </div>

//         <div className="min-h-[500px]">
//         {activeTab === "explanation" && (
//     <div className="space-y-6">
//         {isEditing ? (
//             <textarea 
//                 className="w-full h-[600px] bg-slate-950 border border-school-primary rounded-[2rem] p-8 text-slate-100 outline-none transition-all font-medium"
//                 value={data.studentContent.explanation}
//                 onChange={(e) => setData({...data, studentContent: {...data.studentContent, explanation: e.target.value}})}
//             />
//         ) : (
//             /* FIX: Enhanced visibility with text-slate-100 and higher contrast prose */
//             <ReactMarkdown
//                     components={{
//                       // ✅ FIX: Omitted 'node' from props to resolve unused var warning
//                       h1: ({ ...props }) => <h1 className="text-3xl font-extrabold text-amber-700 border-b-2 border-amber-200 pb-2 mb-6 mt-2" {...props} />,
//                       h2: ({ ...props }) => <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 flex items-center gap-2" {...props} />,
//                       h3: ({ ...props }) => <h3 className="text-xl font-bold text-amber-800 mt-6 mb-3" {...props} />,
//                       p: ({ ...props }) => <p className="text-slate-700 leading-relaxed mb-4 text-sm" {...props} />,
//                       ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2" {...props} />,
//                       ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 text-slate-700 space-y-2" {...props} />,
//                       li: ({ ...props }) => <li className="pl-1 marker:text-amber-500" {...props} />,
//                       strong: ({ ...props }) => <strong className="font-bold text-slate-900" {...props} />,
//                       blockquote: ({ ...props }) => <blockquote className="border-l-4 border-amber-400 pl-4 py-1 my-4 bg-amber-50/50 italic text-slate-700 rounded-r" {...props} />,
//                     }}
//                   >
//                     {data.studentContent.explanation}
//                   </ReactMarkdown>
//         )}
//     </div>
// )}

//             {/* Pedagogy Tab (Teacher Only) */}
//             {activeTab === "pedagogy" && isTeacher && (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     <PedagogyCard title="Instructional Method" value={data.teacherLogic.teachingMethod} icon={Zap} />
//                     <PedagogyCard title="Classroom Hook" value={data.teacherLogic.introductionHook} icon={Sparkles} />
//                 </div>
//             )}

//             {/* Visuals Tab */}
//             {activeTab === "visuals" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {data.studentContent.visualAids.map((aid, idx) => (
//                         <Card key={idx} className="bg-slate-950 border-white/5 rounded-[2rem] overflow-hidden group shadow-xl transition-all">
//                             <div className="p-6 border-b border-white/5">
//                                 <h4 className="text-sm font-bold text-white uppercase italic">{aid.title}</h4>
//                                 <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{aid.description}</p>
//                             </div>
//                             <div className="relative aspect-video flex flex-col items-center justify-center p-2">
//                                 {aid.url ? (
//                                     <Image src={aid.url} alt={aid.title} fill className="object-cover rounded-2xl opacity-90 transition-opacity" unoptimized />
//                                 ) : (
//                                     <div className="text-center space-y-4">
//                                         <ImageIcon className="h-10 w-10 text-slate-800 mx-auto" />
//                                         {isTeacher && (
//                                             <Button onClick={() => handleGenerateImage(idx, aid.imagePrompt)} disabled={loadingImages[idx]} className="bg-slate-900 border border-white/10 hover:bg-school-primary hover:text-slate-950 transition-all rounded-xl">
//                                                 {loadingImages[idx] ? <Loader2 className="animate-spin h-4 w-4" /> : "Generate Diagram"}
//                                             </Button>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </Card>
//                     ))}
//                 </div>
//             )}

//             {/* Quiz Tab */}
//             {activeTab === "quiz" && (
//                 <div className="max-w-3xl mx-auto space-y-6">
//                     {data.studentContent.quiz.map((q, i) => (
//                         <div key={i} className="p-8 bg-slate-950 rounded-[2rem] border border-white/5 space-y-4 shadow-xl">
//                             <p className="text-xs font-black text-school-primary uppercase tracking-widest">Question 0{i+1}</p>
//                             <p className="text-base font-bold text-white leading-relaxed">{q.question}</p>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                 {q.options.map(opt => (
//                                     <div key={opt} className={cn(
//                                         "p-4 rounded-xl border text-xs font-medium",
//                                         opt === q.answer ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400" : "border-white/5 bg-slate-900/50 text-slate-500"
//                                     )}>
//                                         {opt}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string }) {
//   return (
//     <Button
//       variant="ghost"
//       onClick={onClick}
//       className={cn(
//           "gap-2 px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
//           active ? "bg-school-primary text-slate-950 shadow-lg" : "text-slate-500 hover:text-white"
//       )}
//     >
//       <Icon className="h-4 w-4" />
//       {label}
//     </Button>
//   )
// }

// function PedagogyCard({ title, value, icon: Icon }: { title: string, value: string, icon: LucideIcon }) {
//     return (
//         <Card className="bg-slate-950 border-white/5 p-8 rounded-[2rem] shadow-inner space-y-4">
//             <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white/5 rounded-lg text-slate-50"><Icon className="h-4 w-4" /></div>
//                 <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h5>
//             </div>
//             <p className="text-lg font-bold text-white uppercase italic tracking-tight">{value}</p>
//         </Card>
//     )
// }



// "use client"

// import { useState, useEffect, useTransition } from "react"
// import ReactMarkdown from "react-markdown"
// import Image from "next/image"
// import { 
//     Sparkles, ImageIcon, FileText, HelpCircle, Zap, 
//     Loader2, Edit3, Save, Layout, ListChecks, 
//     Book, Clock, Lightbulb, GraduationCap,
//     type LucideIcon 
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// // Actions
// import { generateLessonForTopic } from "@/app/actions/ai-generator" 
// import { generateDiagramImage } from "@/app/actions/generate-diagram" 
// import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
// import { getErrorMessage } from "@/lib/error-handler"
// import { publishLesson } from "@/app/actions/lesson.actions"

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface VisualAid {
//   title: string;
//   description: string;
//   imagePrompt: string;
//   url?: string; 
// }

// export interface EnhancedLessonContent {
//   metadata: {
//       topicContext: string;
//       difficultyLevel: string;
//   };
//   teacherLogic: {
//       teachingMethod: string;
//       timeAllocation: string;
//       pedagogicalTips: string;
//       introductionHook: string;
//   };
//   studentContent: {
//       title: string;
//       explanation: string;
//       summary: string; 
//       learningObjectives: string[];
//       vocabulary: string[];
//       visualAids: VisualAid[]; 
//       examples: {
//           task: string;
//           solution: string;
//       }[];
//       quiz: {
//           question: string;
//           options: string[];
//           answer: string;
//           explanation: string;
//       }[];
//   };
// }

// interface AILessonPlannerProps {
//   topicId: string;
//   lessonId: string; 
//   topicTitle: string;
//   schoolId: string;
//   initialData?: EnhancedLessonContent | null;
//   mode?: "teacher" | "student";
// }

// // ── Main Component ─────────────────────────────────────────────────────────────

// export function AILessonPlanner({ 
//     topicId, 
//     lessonId, 
//     topicTitle, 
//     schoolId, 
//     initialData,
//     mode = "teacher" 
// }: AILessonPlannerProps) {
  
//   const isTeacher = mode === "teacher";
//   const [activeTab, setActiveTab] = useState<string>("explanation")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [isPending, startTransition] = useTransition()
  
//   const [data, setData] = useState<EnhancedLessonContent | null>(initialData || null)
//   const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({})

//   useEffect(() => {
//     setData(initialData || null)
//     setIsEditing(false)
//   }, [topicId, initialData])

//   // ── Handlers ───────────────────────────────────────────────────────────

//   const handleGenerate = async () => {
//     if (!isTeacher) return;
//     setIsGenerating(true)
//     try {
//       const res = await generateLessonForTopic(topicId, schoolId)
//       if (!res.success) {
//         toast.error(res.error ?? "Lesson generation failed")
//         return
//       }
//       if (res.aiContent) {
//         setData(res.aiContent as unknown as EnhancedLessonContent)
//         toast.success("AI Generation Complete")
//       }
//     } catch (err) {
//       toast.error(getErrorMessage(err))
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleManualSave = () => {
//     if (!data) return;
//     startTransition(async () => {
//       const res = await publishLesson({ topicId, schoolId, content: data as any });
//       if (res.success) {
//         toast.success("Lesson published successfully");
//         setIsEditing(false);
//       }
//     });
//   };
  
//   const handleGenerateImage = async (index: number, prompt: string) => {
//     if (!isTeacher || loadingImages[index] || (data?.studentContent.visualAids[index]?.url)) return;
//     setLoadingImages(prev => ({ ...prev, [index]: true }))
//     try {
//       const result = await generateDiagramImage(prompt) 
//       if (result.success && result.url) {
//         setData(current => {
//           if (!current) return null;
//           const updated = [...current.studentContent.visualAids];
//           updated[index] = { ...updated[index], url: result.url };
//           return { ...current, studentContent: { ...current.studentContent, visualAids: updated } };
//         });
//         await saveGeneratedImageUrlToLesson(lessonId, index, result.url);
//         toast.success("Asset bound to registry.");
//       }
//     } finally {
//       setLoadingImages(prev => ({ ...prev, [index]: false }))
//     }
//   }

//   if (!data) {
//     return (
//       <div className="py-20 text-center bg-slate-900 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
//         <div className="h-20 w-20 bg-school-primary/10 rounded-full flex items-center justify-center mx-auto text-school-primary border border-school-primary/20">
//           <Sparkles className="h-10 w-10 animate-pulse" />
//         </div>
//         <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Registry Standby</h3>
//         <p className="text-xl font-black text-school-primary uppercase italic tracking-tight">{topicTitle}</p>
//         {isTeacher && (
//           <Button onClick={handleGenerate} disabled={isGenerating} className="bg-school-primary text-slate-950 font-black px-10 py-7 rounded-2xl">
//             {isGenerating ? <><Loader2 className="animate-spin mr-2" /> GENERATING...</> : <><Sparkles className="mr-2 h-5 w-5" /> GENERATE LESSON</>}
//           </Button>
//         )}
//       </div>
//     )
//   }

//   return (
//     <Card className="border-white/5 bg-slate-950 shadow-2xl overflow-hidden rounded-[2.5rem] flex flex-col">
//       {/* HEADER SECTION: Includes Difficulty Metadata */}
//       <CardHeader className="bg-slate-900 border-b border-white/5 p-8">
//         <div className="flex items-center justify-between gap-4">
//           <div className="flex-1 min-w-0">
//              <div className="flex items-center gap-3 mb-1">
//                 <Layout className="h-5 w-5 text-school-primary" />
//                 <CardTitle className="text-2xl font-black text-white uppercase italic tracking-tighter truncate">
//                     {data.studentContent.title}
//                 </CardTitle>
//                 <Badge className="bg-school-primary/10 text-school-primary border-school-primary/20 uppercase text-[9px]">
//                     {data.metadata.difficultyLevel}
//                 </Badge>
//              </div>
//              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{topicTitle}</p>
//           </div>
          
//           {isTeacher && (
//             <div className="flex items-center gap-3 shrink-0">
//               {!isEditing ? (
//                   <Button variant="outline" onClick={() => setIsEditing(true)} className="border-white/10 text-slate-400 rounded-xl">
//                       <Edit3 className="h-4 w-4 mr-2" /> Edit Registry
//                   </Button>
//               ) : (
//                   <div className="flex gap-2">
//                       <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-slate-500">Cancel</Button>
//                       <Button onClick={handleManualSave} disabled={isPending} className="bg-school-primary text-slate-950 font-black rounded-xl px-6">
//                           {isPending ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
//                           PUBLISH
//                       </Button>
//                   </div>
//               )}
//             </div>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-8 flex-1 bg-slate-950">
//         {/* TAB NAVIGATION */}
//         <div className="flex flex-wrap gap-2 mb-10 bg-slate-900 p-1.5 rounded-2xl w-fit border border-white/5">
//             <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Notes" />
//             <TabButton active={activeTab === "syllabus"} onClick={() => setActiveTab("syllabus")} icon={ListChecks} label="Syllabus" />
//             {isTeacher && <TabButton active={activeTab === "pedagogy"} onClick={() => setActiveTab("pedagogy")} icon={Zap} label="Strategy" />}
//             <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visuals" />
//             <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quiz" />
//         </div>

//         <div className="min-h-[600px]">
//             {/* 1. NOTES TAB */}
//             {activeTab === "explanation" && (
//                 <div className="space-y-6">
//                     {isEditing ? (
//                         <textarea 
//                             className="w-full h-[600px] bg-slate-900 border border-school-primary/30 rounded-[2rem] p-8 text-slate-100 outline-none font-medium"
//                             value={data.studentContent.explanation}
//                             onChange={(e) => setData({...data, studentContent: {...data.studentContent, explanation: e.target.value}})}
//                         />
//                     ) : (
//                         <div className="prose prose-invert max-w-none">
//                             <ReactMarkdown
//                                 components={{
//                                     h1: ({...props}) => <h1 className="text-3xl font-black text-white uppercase italic border-b border-white/10 pb-4 mb-6" {...props} />,
//                                     h2: ({...props}) => <h2 className="text-xl font-bold text-school-primary uppercase tracking-tight mt-10 mb-4" {...props} />,
//                                     p: ({...props}) => <p className="text-slate-300 leading-loose mb-6 text-lg" {...props} />,
//                                     li: ({...props}) => <li className="text-slate-300 mb-2" {...props} />,
//                                 }}
//                             >
//                                 {data.studentContent.explanation}
//                             </ReactMarkdown>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* 2. SYLLABUS TAB: Summary, Objectives, Vocabulary, Examples */}
//             {activeTab === "syllabus" && (
//                 <div className="space-y-10">
//                     <section className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 shadow-xl">
//                         <h4 className="text-school-primary text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
//                             <GraduationCap className="h-4 w-4" /> Learning Objectives
//                         </h4>
//                         <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {data.studentContent.learningObjectives.map((obj, i) => (
//                                 <li key={i} className="flex items-start gap-3 text-slate-300 text-sm italic">
//                                     <span className="text-school-primary font-black">0{i+1}.</span> {obj}
//                                 </li>
//                             ))}
//                         </ul>
//                     </section>

//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         <section className="space-y-4">
//                             <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Executive Summary</h4>
//                             <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 text-slate-400 text-sm leading-relaxed italic">
//                                 {data.studentContent.summary}
//                             </div>
//                         </section>

//                         <section className="space-y-4">
//                             <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Keyword Registry</h4>
//                             <div className="flex flex-wrap gap-2">
//                                 {data.studentContent.vocabulary.map((word, i) => (
//                                     <Badge key={i} variant="outline" className="px-4 py-2 border-white/5 bg-slate-900 text-slate-300 rounded-xl text-[10px] uppercase font-bold tracking-widest">
//                                         {word}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         </section>
//                     </div>

//                     <section className="space-y-4">
//                         <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Practical Applications (Examples)</h4>
//                         <div className="grid grid-cols-1 gap-4">
//                             {data.studentContent.examples.map((ex, i) => (
//                                 <div key={i} className="p-6 bg-slate-900 rounded-3xl border border-white/5 space-y-3">
//                                     <p className="text-sm font-black text-school-primary uppercase italic">Task: {ex.task}</p>
//                                     <p className="text-xs text-slate-400 border-t border-white/5 pt-3">Solution: {ex.solution}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 </div>
//             )}

//             {/* 3. PEDAGOGY TAB: Teaching Method, Hook, Time, Tips */}
//             {activeTab === "pedagogy" && isTeacher && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <PedagogyCard title="Instructional Method" value={data.teacherLogic.teachingMethod} icon={Zap} />
//                     <PedagogyCard title="Classroom Hook" value={data.teacherLogic.introductionHook} icon={Sparkles} />
//                     <PedagogyCard title="Time Allocation" value={data.teacherLogic.timeAllocation} icon={Clock} />
//                     <PedagogyCard title="Pedagogical Tips" value={data.teacherLogic.pedagogicalTips} icon={Lightbulb} />
//                 </div>
//             )}

//             {/* 4. VISUALS TAB */}
//             {activeTab === "visuals" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {data.studentContent.visualAids.map((aid, idx) => (
//                         <Card key={idx} className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden group shadow-xl">
//                             <div className="p-6 border-b border-white/5">
//                                 <h4 className="text-sm font-bold text-white uppercase italic">{aid.title}</h4>
//                                 <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{aid.description}</p>
//                             </div>
//                             <div className="relative aspect-video flex flex-col items-center justify-center p-2 bg-slate-950">
//                                 {aid.url ? (
//                                     <Image src={aid.url} alt={aid.title} fill className="object-cover rounded-2xl opacity-80" unoptimized />
//                                 ) : (
//                                     <div className="text-center space-y-4">
//                                         <ImageIcon className="h-10 w-10 text-slate-800 mx-auto" />
//                                         {isTeacher && (
//                                             <Button onClick={() => handleGenerateImage(idx, aid.imagePrompt)} disabled={loadingImages[idx]} className="bg-slate-900 border border-white/10 hover:bg-school-primary hover:text-slate-950 transition-all rounded-xl">
//                                                 {loadingImages[idx] ? <Loader2 className="animate-spin h-4 w-4" /> : "Synthesize Diagram"}
//                                             </Button>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </Card>
//                     ))}
//                 </div>
//             )}

//             {/* 5. QUIZ TAB */}
//             {activeTab === "quiz" && (
//                 <div className="max-w-3xl mx-auto space-y-6">
//                     {data.studentContent.quiz.map((q, i) => (
//                         <div key={i} className="p-8 bg-slate-900 rounded-[2rem] border border-white/5 space-y-4 shadow-xl">
//                             <p className="text-xs font-black text-school-primary uppercase tracking-widest">Assessment Item 0{i+1}</p>
//                             <p className="text-base font-bold text-white leading-relaxed">{q.question}</p>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                 {q.options.map(opt => (
//                                     <div key={opt} className={cn(
//                                         "p-4 rounded-xl border text-xs font-medium",
//                                         opt === q.answer ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400" : "border-white/5 bg-slate-950/50 text-slate-500"
//                                     )}>
//                                         {opt}
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="pt-4 border-t border-white/5 text-[10px] text-slate-500 italic">
//                                 Rationale: {q.explanation}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string }) {
//   return (
//     <Button variant="ghost" onClick={onClick} className={cn(
//           "gap-2 px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
//           active ? "bg-school-primary text-slate-950 shadow-lg" : "text-slate-500 hover:text-white hover:bg-white/5"
//       )}>
//       <Icon className="h-4 w-4" /> {label}
//     </Button>
//   )
// }

// function PedagogyCard({ title, value, icon: Icon }: { title: string, value: string, icon: LucideIcon }) {
//     return (
//         <Card className="bg-slate-900 border-white/5 p-8 rounded-[2rem] shadow-inner space-y-4">
//             <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white/5 rounded-lg text-school-primary"><Icon className="h-4 w-4" /></div>
//                 <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h5>
//             </div>
//             <p className="text-lg font-bold text-white uppercase italic tracking-tight leading-relaxed">{value}</p>
//         </Card>
//     )
// }




// "use client"

// import { useState, useEffect, useTransition } from "react"
// import ReactMarkdown from "react-markdown"
// import Image from "next/image"
// import { 
//     Sparkles, ImageIcon, FileText, HelpCircle, Zap, 
//     Loader2, Edit3, Save, Layout, ListChecks, 
//     Clock, Lightbulb, GraduationCap,
//     type LucideIcon 
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// // Actions
// import { generateLessonForTopic, type LessonAiContent } from "@/app/actions/ai-generator" 
// import { generateDiagramImage } from "@/app/actions/generate-diagram" 
// import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
// import { getErrorMessage } from "@/lib/error-handler"
// import { publishLesson } from "@/app/actions/lesson.actions"

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface VisualAid {
//   title: string;
//   description: string;
//   imagePrompt: string;
//   url?: string; 
// }

// /**
//  * Interface representing the complete lesson structure.
//  * Synced with LessonAiContent from ai-generator.ts.
//  */
// export interface EnhancedLessonContent {
//   metadata: {
//       topicContext: string;
//       difficultyLevel: string;
//   };
//   teacherLogic: {
//       teachingMethod: string;
//       timeAllocation: string;
//       pedagogicalTips: string;
//       introductionHook: string;
//   };
//   studentContent: {
//       title: string;
//       explanation: string;
//       summary: string; 
//       learningObjectives: string[];
//       vocabulary: string[];
//       visualAids: VisualAid[]; 
//       examples: {
//           task: string;
//           solution: string;
//       }[];
//       quiz: {
//           question: string;
//           options: string[];
//           answer: string;
//           explanation: string;
//       }[];
//   };
// }

// interface AILessonPlannerProps {
//   topicId: string;
//   lessonId: string; 
//   topicTitle: string;
//   schoolId: string;
//   initialData?: EnhancedLessonContent | null;
//   mode?: "teacher" | "student";
// }

// // ── Main Component ─────────────────────────────────────────────────────────────

// export function AILessonPlanner({ 
//     topicId, 
//     lessonId, 
//     topicTitle, 
//     schoolId, 
//     initialData,
//     mode = "teacher" 
// }: AILessonPlannerProps) {
  
//   const isTeacher = mode === "teacher";
//   const [activeTab, setActiveTab] = useState<string>("explanation")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [isPending, startTransition] = useTransition()
  
//   const [data, setData] = useState<EnhancedLessonContent | null>(initialData || null)
//   const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({})

//   useEffect(() => {
//     setData(initialData || null)
//     setIsEditing(false)
//   }, [topicId, initialData])

//   // ── Handlers ───────────────────────────────────────────────────────────

//   const handleGenerate = async () => {
//     if (!isTeacher) return;
//     setIsGenerating(true)
//     try {
//       const res = await generateLessonForTopic(topicId, schoolId)
//       if (!res.success) {
//         toast.error(res.error ?? "Lesson generation failed")
//         return
//       }
//       if (res.aiContent) {
//         // Casting to our specific interface instead of any
//         setData(res.aiContent as EnhancedLessonContent)
//         toast.success("AI Generation Complete")
//       }
//     } catch (err) {
//       toast.error(getErrorMessage(err))
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleManualSave = () => {
//     if (!data) return;
//     startTransition(async () => {
//       try {
//         const res = await publishLesson({ 
//           topicId, 
//           schoolId, 
//           // FIXED: Removed 'as any'. Using proper type mapping.
//           content: data as unknown as LessonAiContent 
//         });
//         if (res.success) {
//           toast.success("Lesson published successfully");
//           setIsEditing(false);
//         } else if (res.error) {
//           toast.error(res.error);
//         }
//       } catch (err) {
//         toast.error(getErrorMessage(err));
//       }
//     });
//   };
  
//   const handleGenerateImage = async (index: number, prompt: string) => {
//     if (!isTeacher || loadingImages[index] || (data?.studentContent.visualAids[index]?.url)) return;
//     setLoadingImages(prev => ({ ...prev, [index]: true }))
//     try {
//       const result = await generateDiagramImage(prompt) 
//       if (result.success && result.url) {
//         setData(current => {
//           if (!current) return null;
//           const updated = [...current.studentContent.visualAids];
//           updated[index] = { ...updated[index], url: result.url };
//           return { ...current, studentContent: { ...current.studentContent, visualAids: updated } };
//         });
//         await saveGeneratedImageUrlToLesson(lessonId, index, result.url);
//         toast.success("Asset bound to registry.");
//       }
//     } catch (err) {
//         toast.error(getErrorMessage(err));
//     } finally {
//       setLoadingImages(prev => ({ ...prev, [index]: false }))
//     }
//   }

//   if (!data) {
//     return (
//       <div className="py-20 text-center bg-slate-900 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
//         <div className="h-20 w-20 bg-school-primary/10 rounded-full flex items-center justify-center mx-auto text-school-primary border border-school-primary/20">
//           <Sparkles className="h-10 w-10 animate-pulse" />
//         </div>
//         <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Registry Standby</h3>
//         <p className="text-xl font-black text-school-primary uppercase italic tracking-tight">{topicTitle}</p>
//         {isTeacher && (
//           <Button onClick={handleGenerate} disabled={isGenerating} className="bg-school-primary text-slate-950 font-black px-10 py-7 rounded-2xl">
//             {isGenerating ? <><Loader2 className="animate-spin mr-2" /> GENERATING...</> : <><Sparkles className="mr-2 h-5 w-5" /> GENERATE LESSON</>}
//           </Button>
//         )}
//       </div>
//     )
//   }

//   return (
//     <Card className="border-white/5 bg-slate-950 shadow-2xl overflow-hidden rounded-[2.5rem] flex flex-col">
//       <CardHeader className="bg-slate-900 border-b border-white/5 p-8">
//         <div className="flex items-center justify-between gap-4">
//           <div className="flex-1 min-w-0">
//              <div className="flex items-center gap-3 mb-1">
//                 <Layout className="h-5 w-5 text-school-primary" />
//                 <CardTitle className="text-2xl font-black text-white uppercase italic tracking-tighter truncate">
//                     {data.studentContent.title}
//                 </CardTitle>
//                 <Badge className="bg-school-primary/10 text-school-primary border-school-primary/20 uppercase text-[9px]">
//                     {data.metadata.difficultyLevel}
//                 </Badge>
//              </div>
//              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{topicTitle}</p>
//           </div>
          
//           {isTeacher && (
//             <div className="flex items-center gap-3 shrink-0">
//               {!isEditing ? (
//                   <Button variant="outline" onClick={() => setIsEditing(true)} className="border-white/10 text-slate-400 rounded-xl">
//                       <Edit3 className="h-4 w-4 mr-2" /> Edit Registry
//                   </Button>
//               ) : (
//                   <div className="flex gap-2">
//                       <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-slate-500">Cancel</Button>
//                       <Button onClick={handleManualSave} disabled={isPending} className="bg-school-primary text-slate-950 font-black rounded-xl px-6">
//                           {isPending ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
//                           PUBLISH
//                       </Button>
//                   </div>
//               )}
//             </div>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-8 flex-1 bg-slate-950">
//         <div className="flex flex-wrap gap-2 mb-10 bg-slate-900 p-1.5 rounded-2xl w-fit border border-white/5">
//             <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Notes" />
//             <TabButton active={activeTab === "syllabus"} onClick={() => setActiveTab("syllabus")} icon={ListChecks} label="Syllabus" />
//             {isTeacher && <TabButton active={activeTab === "pedagogy"} onClick={() => setActiveTab("pedagogy")} icon={Zap} label="Strategy" />}
//             <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visuals" />
//             <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quiz" />
//         </div>

//         <div className="min-h-[600px]">
//             {activeTab === "explanation" && (
//                 <div className="space-y-6">
//                     {isEditing ? (
//                         <textarea 
//                             className="w-full h-[600px] bg-slate-900 border border-school-primary/30 rounded-[2rem] p-8 text-slate-100 outline-none font-medium"
//                             value={data.studentContent.explanation}
//                             onChange={(e) => setData({...data, studentContent: {...data.studentContent, explanation: e.target.value}})}
//                         />
//                     ) : (
//                         <div className="prose prose-invert max-w-none">
//                             <ReactMarkdown
//                                 components={{
//                                     h1: ({node, ...props}) => <h1 className="text-3xl font-black text-white uppercase italic border-b border-white/10 pb-4 mb-6" {...props} />,
//                                     h2: ({node, ...props}) => <h2 className="text-xl font-bold text-school-primary uppercase tracking-tight mt-10 mb-4" {...props} />,
//                                     p: ({node, ...props}) => <p className="text-slate-300 leading-loose mb-6 text-lg" {...props} />,
//                                     li: ({node, ...props}) => <li className="text-slate-300 mb-2" {...props} />,
//                                 }}
//                             >
//                                 {data.studentContent.explanation}
//                             </ReactMarkdown>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {activeTab === "syllabus" && (
//                 <div className="space-y-10">
//                     <section className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 shadow-xl">
//                         <h4 className="text-school-primary text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
//                             <GraduationCap className="h-4 w-4" /> Learning Objectives
//                         </h4>
//                         <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {data.studentContent.learningObjectives.map((obj, i) => (
//                                 <li key={i} className="flex items-start gap-3 text-slate-300 text-sm italic">
//                                     <span className="text-school-primary font-black">0{i+1}.</span> {obj}
//                                 </li>
//                             ))}
//                         </ul>
//                     </section>

//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         <section className="space-y-4">
//                             <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Executive Summary</h4>
//                             <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 text-slate-400 text-sm leading-relaxed italic">
//                                 {data.studentContent.summary}
//                             </div>
//                         </section>

//                         <section className="space-y-4">
//                             <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Keyword Registry</h4>
//                             <div className="flex flex-wrap gap-2">
//                                 {data.studentContent.vocabulary.map((word, i) => (
//                                     <Badge key={i} variant="outline" className="px-4 py-2 border-white/5 bg-slate-900 text-slate-300 rounded-xl text-[10px] uppercase font-bold tracking-widest">
//                                         {word}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         </section>
//                     </div>

//                     <section className="space-y-4">
//                         <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Applications (Examples)</h4>
//                         <div className="grid grid-cols-1 gap-4">
//                             {data.studentContent.examples.map((ex, i) => (
//                                 <div key={i} className="p-6 bg-slate-900 rounded-3xl border border-white/5 space-y-3">
//                                     <p className="text-sm font-black text-school-primary uppercase italic">Task: {ex.task}</p>
//                                     <p className="text-xs text-slate-400 border-t border-white/5 pt-3">Solution: {ex.solution}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 </div>
//             )}

//             {activeTab === "pedagogy" && isTeacher && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <PedagogyCard title="Instructional Method" value={data.teacherLogic.teachingMethod} icon={Zap} />
//                     <PedagogyCard title="Classroom Hook" value={data.teacherLogic.introductionHook} icon={Sparkles} />
//                     <PedagogyCard title="Time Allocation" value={data.teacherLogic.timeAllocation} icon={Clock} />
//                     <PedagogyCard title="Pedagogical Tips" value={data.teacherLogic.pedagogicalTips} icon={Lightbulb} />
//                 </div>
//             )}

//             {activeTab === "visuals" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {data.studentContent.visualAids.map((aid, idx) => (
//                         <Card key={idx} className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden group shadow-xl">
//                             <div className="p-6 border-b border-white/5">
//                                 <h4 className="text-sm font-bold text-white uppercase italic">{aid.title}</h4>
//                                 <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{aid.description}</p>
//                             </div>
//                             <div className="relative aspect-video flex flex-col items-center justify-center p-2 bg-slate-950">
//                                 {aid.url ? (
//                                     <Image src={aid.url} alt={aid.title} fill className="object-cover rounded-2xl opacity-80" unoptimized />
//                                 ) : (
//                                     <div className="text-center space-y-4">
//                                         <ImageIcon className="h-10 w-10 text-slate-800 mx-auto" />
//                                         {isTeacher && (
//                                             <Button onClick={() => handleGenerateImage(idx, aid.imagePrompt)} disabled={loadingImages[idx]} className="bg-slate-900 border border-white/10 hover:bg-school-primary hover:text-slate-950 transition-all rounded-xl">
//                                                 {loadingImages[idx] ? <Loader2 className="animate-spin h-4 w-4" /> : "Synthesize Diagram"}
//                                             </Button>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </Card>
//                     ))}
//                 </div>
//             )}

//             {activeTab === "quiz" && (
//                 <div className="max-w-3xl mx-auto space-y-6">
//                     {data.studentContent.quiz.map((q, i) => (
//                         <div key={i} className="p-8 bg-slate-900 rounded-[2rem] border border-white/5 space-y-4 shadow-xl">
//                             <p className="text-xs font-black text-school-primary uppercase tracking-widest">Assessment Item 0{i+1}</p>
//                             <p className="text-base font-bold text-white leading-relaxed">{q.question}</p>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                 {q.options.map(opt => (
//                                     <div key={opt} className={cn(
//                                         "p-4 rounded-xl border text-xs font-medium",
//                                         opt === q.answer ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400" : "border-white/5 bg-slate-950/50 text-slate-500"
//                                     )}>
//                                         {opt}
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="pt-4 border-t border-white/5 text-[10px] text-slate-500 italic">
//                                 Rationale: {q.explanation}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string }) {
//   return (
//     <Button variant="ghost" onClick={onClick} className={cn(
//           "gap-2 px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
//           active ? "bg-school-primary text-slate-950 shadow-lg" : "text-slate-500 hover:text-white hover:bg-white/5"
//       )}>
//       <Icon className="h-4 w-4" /> {label}
//     </Button>
//   )
// }

// function PedagogyCard({ title, value, icon: Icon }: { title: string, value: string, icon: LucideIcon }) {
//     return (
//         <Card className="bg-slate-900 border-white/5 p-8 rounded-[2rem] shadow-inner space-y-4">
//             <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white/5 rounded-lg text-school-primary"><Icon className="h-4 w-4" /></div>
//                 <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h5>
//             </div>
//             <p className="text-lg font-bold text-white uppercase italic tracking-tight leading-relaxed">{value}</p>
//         </Card>
//     )
// }


// "use client"

// import { useState, useEffect, useTransition } from "react"
// import ReactMarkdown from "react-markdown"
// import Image from "next/image"
// import { 
//     Sparkles, ImageIcon, FileText, HelpCircle, Zap, 
//     Loader2, Edit3, Save, Layout, ListChecks, 
//     Clock, Lightbulb, GraduationCap,
//     type LucideIcon 
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// // Actions
// import { generateLessonForTopic, type LessonAiContent } from "@/app/actions/ai-generator" 
// import { generateDiagramImage } from "@/app/actions/generate-diagram" 
// import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
// import { getErrorMessage } from "@/lib/error-handler"
// import { publishLesson } from "@/app/actions/lesson.actions"

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface VisualAid {
//   title: string;
//   description: string;
//   imagePrompt: string;
//   url?: string; 
// }

// /**
//  * Interface representing the complete lesson structure.
//  * Synced with LessonAiContent from ai-generator.ts.
//  */
// export interface EnhancedLessonContent {
//   metadata: {
//       topicContext: string;
//       difficultyLevel: string;
//   };
//   teacherLogic: {
//       teachingMethod: string;
//       timeAllocation: string;
//       pedagogicalTips: string;
//       introductionHook: string;
//   };
//   studentContent: {
//       title: string;
//       explanation: string;
//       summary: string; 
//       learningObjectives: string[];
//       vocabulary: string[];
//       visualAids: VisualAid[]; 
//       examples: {
//           task: string;
//           solution: string;
//       }[];
//       quiz: {
//           question: string;
//           options: string[];
//           answer: string;
//           explanation: string;
//       }[];
//   };
// }

// interface AILessonPlannerProps {
//   topicId: string;
//   lessonId: string; 
//   topicTitle: string;
//   schoolId: string;
//   initialData?: EnhancedLessonContent | null;
//   mode?: "teacher" | "student";
// }

// // ── Main Component ─────────────────────────────────────────────────────────────

// export function AILessonPlanner({ 
//     topicId, 
//     lessonId, 
//     topicTitle, 
//     schoolId, 
//     initialData,
//     mode = "teacher" 
// }: AILessonPlannerProps) {
  
//   const isTeacher = mode === "teacher";
//   const [activeTab, setActiveTab] = useState<string>("explanation")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [isPending, startTransition] = useTransition()
  
//   const [data, setData] = useState<EnhancedLessonContent | null>(initialData || null)
//   const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({})

//   useEffect(() => {
//     setData(initialData || null)
//     setIsEditing(false)
//   }, [topicId, initialData])

//   // ── Handlers ───────────────────────────────────────────────────────────

//   const handleGenerate = async () => {
//     if (!isTeacher) return;
//     setIsGenerating(true)
//     try {
//       const res = await generateLessonForTopic(topicId, schoolId)
//       if (!res.success) {
//         toast.error(res.error ?? "Lesson generation failed")
//         return
//       }
//       if (res.aiContent) {
//         setData(res.aiContent as EnhancedLessonContent)
//         toast.success("AI Generation Complete")
//       }
//     } catch (err) {
//       toast.error(getErrorMessage(err))
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleManualSave = () => {
//     if (!data) return;
//     startTransition(async () => {
//       try {
//         const res = await publishLesson({ 
//           topicId, 
//           schoolId, 
//           content: data as unknown as LessonAiContent 
//         });
//         if (res.success) {
//           toast.success("Lesson published successfully");
//           setIsEditing(false);
//         } else if (res.error) {
//           toast.error(res.error);
//         }
//       } catch (err) {
//         toast.error(getErrorMessage(err));
//       }
//     });
//   };
  
//   const handleGenerateImage = async (index: number, prompt: string) => {
//     if (!isTeacher || loadingImages[index] || (data?.studentContent.visualAids[index]?.url)) return;
//     setLoadingImages(prev => ({ ...prev, [index]: true }))
//     try {
//       const result = await generateDiagramImage(prompt) 
//       if (result.success && result.url) {
//         setData(current => {
//           if (!current) return null;
//           const updated = [...current.studentContent.visualAids];
//           updated[index] = { ...updated[index], url: result.url };
//           return { ...current, studentContent: { ...current.studentContent, visualAids: updated } };
//         });
//         await saveGeneratedImageUrlToLesson(lessonId, index, result.url);
//         toast.success("Asset bound to registry.");
//       }
//     } catch (err) {
//         toast.error(getErrorMessage(err));
//     } finally {
//       setLoadingImages(prev => ({ ...prev, [index]: false }))
//     }
//   }

//   if (!data) {
//     return (
//       <div className="py-20 text-center bg-slate-900 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
//         <div className="h-20 w-20 bg-school-primary/10 rounded-full flex items-center justify-center mx-auto text-school-primary border border-school-primary/20">
//           <Sparkles className="h-10 w-10 animate-pulse" />
//         </div>
//         <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Registry Standby</h3>
//         <p className="text-xl font-black text-school-primary uppercase italic tracking-tight">{topicTitle}</p>
//         {isTeacher && (
//           <Button onClick={handleGenerate} disabled={isGenerating} className="bg-school-primary text-slate-950 font-black px-10 py-7 rounded-2xl">
//             {isGenerating ? <><Loader2 className="animate-spin mr-2" /> GENERATING...</> : <><Sparkles className="mr-2 h-5 w-5" /> GENERATE LESSON</>}
//           </Button>
//         )}
//       </div>
//     )
//   }

//   return (
//     <Card className="border-white/5 bg-slate-950 shadow-2xl overflow-hidden rounded-[2.5rem] flex flex-col">
//       <CardHeader className="bg-slate-900 border-b border-white/5 p-8">
//         <div className="flex items-center justify-between gap-4">
//           <div className="flex-1 min-w-0">
//              <div className="flex items-center gap-3 mb-1">
//                 <Layout className="h-5 w-5 text-school-primary" />
//                 <CardTitle className="text-2xl font-black text-white uppercase italic tracking-tighter truncate">
//                     {data.studentContent.title}
//                 </CardTitle>
//                 <Badge className="bg-school-primary/10 text-school-primary border-school-primary/20 uppercase text-[9px]">
//                     {data.metadata.difficultyLevel}
//                 </Badge>
//              </div>
//              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{topicTitle}</p>
//           </div>
          
//           {isTeacher && (
//             <div className="flex items-center gap-3 shrink-0">
//               {!isEditing ? (
//                   <Button variant="outline" onClick={() => setIsEditing(true)} className="border-white/10 text-slate-400 rounded-xl">
//                       <Edit3 className="h-4 w-4 mr-2" /> Edit Registry
//                   </Button>
//               ) : (
//                   <div className="flex gap-2">
//                       <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-slate-500">Cancel</Button>
//                       <Button onClick={handleManualSave} disabled={isPending} className="bg-school-primary text-slate-950 font-black rounded-xl px-6">
//                           {isPending ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
//                           PUBLISH
//                       </Button>
//                   </div>
//               )}
//             </div>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-8 flex-1 bg-slate-950">
//         <div className="flex flex-wrap gap-2 mb-10 bg-slate-900 p-1.5 rounded-2xl w-fit border border-white/5">
//             <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Notes" />
//             <TabButton active={activeTab === "syllabus"} onClick={() => setActiveTab("syllabus")} icon={ListChecks} label="Syllabus" />
//             {isTeacher && <TabButton active={activeTab === "pedagogy"} onClick={() => setActiveTab("pedagogy")} icon={Zap} label="Strategy" />}
//             <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visuals" />
//             <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quiz" />
//         </div>

//         <div className="min-h-[600px]">
//             {/* 1. NOTES TAB */}
//             {activeTab === "explanation" && (
//                 <div className="space-y-6">
//                     {isEditing ? (
//                         <textarea 
//                             className="w-full h-[600px] bg-slate-900 border border-school-primary/30 rounded-[2rem] p-8 text-slate-100 outline-none font-medium"
//                             value={data.studentContent.explanation}
//                             onChange={(e) => setData({...data, studentContent: {...data.studentContent, explanation: e.target.value}})}
//                         />
//                     ) : (
//                         <div className="prose prose-invert max-w-none">
//                             <ReactMarkdown
//                                 components={{
//                                     // FIXED: Removed 'node' from props to resolve unused var warning
//                                     h1: ({ ...props }) => <h1 className="text-3xl font-black text-white uppercase italic border-b border-white/10 pb-4 mb-6" {...props} />,
//                                     h2: ({ ...props }) => <h2 className="text-xl font-bold text-school-primary uppercase tracking-tight mt-10 mb-4" {...props} />,
//                                     p: ({ ...props }) => <p className="text-slate-300 leading-loose mb-6 text-lg" {...props} />,
//                                     li: ({ ...props }) => <li className="text-slate-300 mb-2" {...props} />,
//                                 }}
//                             >
//                                 {data.studentContent.explanation}
//                             </ReactMarkdown>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* 2. SYLLABUS TAB */}
//             {activeTab === "syllabus" && (
//                 <div className="space-y-10">
//                     <section className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 shadow-xl">
//                         <h4 className="text-school-primary text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
//                             <GraduationCap className="h-4 w-4" /> Learning Objectives
//                         </h4>
//                         <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {data.studentContent.learningObjectives.map((obj, i) => (
//                                 <li key={i} className="flex items-start gap-3 text-slate-300 text-sm italic">
//                                     <span className="text-school-primary font-black">0{i+1}.</span> {obj}
//                                 </li>
//                             ))}
//                         </ul>
//                     </section>

//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         <section className="space-y-4">
//                             <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Executive Summary</h4>
//                             <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 text-slate-400 text-sm leading-relaxed italic">
//                                 {data.studentContent.summary}
//                             </div>
//                         </section>

//                         <section className="space-y-4">
//                             <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Keyword Registry</h4>
//                             <div className="flex flex-wrap gap-2">
//                                 {data.studentContent.vocabulary.map((word, i) => (
//                                     <Badge key={i} variant="outline" className="px-4 py-2 border-white/5 bg-slate-900 text-slate-300 rounded-xl text-[10px] uppercase font-bold tracking-widest">
//                                         {word}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         </section>
//                     </div>

//                     <section className="space-y-4">
//                         <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Applications (Examples)</h4>
//                         <div className="grid grid-cols-1 gap-4">
//                             {data.studentContent.examples.map((ex, i) => (
//                                 <div key={i} className="p-6 bg-slate-900 rounded-3xl border border-white/5 space-y-3">
//                                     <p className="text-sm font-black text-school-primary uppercase italic">Task: {ex.task}</p>
//                                     <p className="text-xs text-slate-400 border-t border-white/5 pt-3">Solution: {ex.solution}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 </div>
//             )}

//             {/* 3. PEDAGOGY TAB */}
//             {activeTab === "pedagogy" && isTeacher && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <PedagogyCard title="Instructional Method" value={data.teacherLogic.teachingMethod} icon={Zap} />
//                     <PedagogyCard title="Classroom Hook" value={data.teacherLogic.introductionHook} icon={Sparkles} />
//                     <PedagogyCard title="Time Allocation" value={data.teacherLogic.timeAllocation} icon={Clock} />
//                     <PedagogyCard title="Pedagogical Tips" value={data.teacherLogic.pedagogicalTips} icon={Lightbulb} />
//                 </div>
//             )}

//             {/* 4. VISUALS TAB */}
//             {activeTab === "visuals" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {data.studentContent.visualAids.map((aid, idx) => (
//                         <Card key={idx} className="bg-slate-900 border border-white/5 rounded-[2rem] overflow-hidden group shadow-xl">
//                             <div className="p-6 border-b border-white/5">
//                                 <h4 className="text-sm font-bold text-white uppercase italic">{aid.title}</h4>
//                                 <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{aid.description}</p>
//                             </div>
//                             <div className="relative aspect-video flex flex-col items-center justify-center p-2 bg-slate-950">
//                                 {aid.url ? (
//                                     <Image src={aid.url} alt={aid.title} fill className="object-cover rounded-2xl opacity-80" unoptimized />
//                                 ) : (
//                                     <div className="text-center space-y-4">
//                                         <ImageIcon className="h-10 w-10 text-slate-800 mx-auto" />
//                                         {isTeacher && (
//                                             <Button onClick={() => handleGenerateImage(idx, aid.imagePrompt)} disabled={loadingImages[idx]} className="bg-slate-900 border border-white/10 hover:bg-school-primary hover:text-slate-950 transition-all rounded-xl">
//                                                 {loadingImages[idx] ? <Loader2 className="animate-spin h-4 w-4" /> : "Synthesize Diagram"}
//                                             </Button>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </Card>
//                     ))}
//                 </div>
//             )}

//             {/* 5. QUIZ TAB */}
//             {activeTab === "quiz" && (
//                 <div className="max-w-3xl mx-auto space-y-6">
//                     {data.studentContent.quiz.map((q, i) => (
//                         <div key={i} className="p-8 bg-slate-900 rounded-[2rem] border border-white/5 space-y-4 shadow-xl">
//                             <p className="text-xs font-black text-school-primary uppercase tracking-widest">Assessment Item 0{i+1}</p>
//                             <p className="text-base font-bold text-white leading-relaxed">{q.question}</p>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                 {q.options.map(opt => (
//                                     <div key={opt} className={cn(
//                                         "p-4 rounded-xl border text-xs font-medium",
//                                         opt === q.answer ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400" : "border-white/5 bg-slate-950/50 text-slate-500"
//                                     )}>
//                                         {opt}
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="pt-4 border-t border-white/5 text-[10px] text-slate-500 italic">
//                                 Rationale: {q.explanation}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string }) {
//   return (
//     <Button variant="ghost" onClick={onClick} className={cn(
//           "gap-2 px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
//           active ? "bg-school-primary text-slate-950 shadow-lg" : "text-slate-500 hover:text-white hover:bg-white/5"
//       )}>
//       <Icon className="h-4 w-4" /> {label}
//     </Button>
//   )
// }

// function PedagogyCard({ title, value, icon: Icon }: { title: string, value: string, icon: LucideIcon }) {
//     return (
//         <Card className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-inner space-y-4">
//             <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white/5 rounded-lg text-school-primary"><Icon className="h-4 w-4" /></div>
//                 <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h5>
//             </div>
//             <p className="text-lg font-bold text-white uppercase italic tracking-tight leading-relaxed">{value}</p>
//         </Card>
//     )
// }


// "use client"

// import { useState, useEffect, useTransition } from "react"
// import ReactMarkdown from "react-markdown"
// import Image from "next/image"
// import { 
//     Sparkles, ImageIcon, FileText, HelpCircle, Zap, 
//     Loader2, Edit3, Save, Layout, ListChecks, 
//     Clock, Lightbulb, GraduationCap,
//     type LucideIcon 
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// // Store & Types
// import { useTeacherStore,  } from "@/store/teacherDataStore"
// import { getErrorMessage } from "@/lib/error-handler"
// import { generateLessonForTopic, type LessonAiContent } from "@/app/actions/ai-generator" 
// import { generateDiagramImage } from "@/app/actions/generate-diagram" 
// import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
// import { publishLesson } from "@/app/actions/lesson.actions"

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface VisualAid {
//   title: string;
//   description: string;
//   imagePrompt: string;
//   url?: string; 
// }

// /**
//  * Interface representing the complete lesson structure.
//  * This is the hydrated version of the Prisma JsonValue.
//  */
// export interface EnhancedLessonContent {
//   metadata: {
//       topicContext: string;
//       difficultyLevel: string;
//   };
//   teacherLogic: {
//       teachingMethod: string;
//       timeAllocation: string;
//       pedagogicalTips: string;
//       introductionHook: string;
//   };
//   studentContent: {
//       title: string;
//       explanation: string;
//       summary: string; 
//       learningObjectives: string[];
//       vocabulary: string[];
//       visualAids: VisualAid[]; 
//       examples: {
//           task: string;
//           solution: string;
//       }[];
//       quiz: {
//           question: string;
//           options: string[];
//           answer: string;
//           explanation: string;
//       }[];
//   };
// }

// interface AILessonPlannerProps {
//   topicId: string;
//   lessonId: string; 
//   topicTitle: string;
//   schoolId: string;
//   initialData: EnhancedLessonContent | null;
//   mode?: "teacher" | "student";
// }

// // ── Main Component ─────────────────────────────────────────────────────────────

// export function AILessonPlanner({ 
//     topicId, 
//     lessonId, 
//     topicTitle, 
//     schoolId, 
//     initialData,
//     mode = "teacher" 
// }: AILessonPlannerProps) {
  
//   const isTeacher = mode === "teacher";
//   const [activeTab, setActiveTab] = useState<string>("explanation")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [isPending, startTransition] = useTransition()
  
//   // Local state for "Drafting" before committing to Store/DB
//   const [data, setData] = useState<EnhancedLessonContent | null>(initialData)
//   const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({})

//   // Pulling from Store to allow cross-component synchronization
//   const { setActiveTopic } = useTeacherStore();

//   useEffect(() => {
//     setData(initialData)
//     setIsEditing(false)
//   }, [topicId, initialData])

//   // ── Handlers ───────────────────────────────────────────────────────────

//   const handleGenerate = async () => {
//     if (!isTeacher) return;
//     setIsGenerating(true)
//     try {
//       const res = await generateLessonForTopic(topicId, schoolId)
//       if (!res.success) {
//         toast.error(res.error ?? "Lesson generation failed")
//         return
//       }
//       if (res.aiContent) {
//         const aiData = res.aiContent as unknown as EnhancedLessonContent;
//         setData(aiData)
//         toast.success("AI Generation Complete")
//       }
//     } catch (err) {
//       toast.error(getErrorMessage(err))
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleManualSave = () => {
//     if (!data) return;
//     startTransition(async () => {
//       try {
//           const res = await publishLesson({ 
//             topicId, 
//             schoolId, 
//             content: data as unknown as LessonAiContent 
//           });
//           if (res.success) {
//             toast.success("Lesson published successfully");
//             setIsEditing(false);
//             // Sync with Store so other components reflect changes
//             setActiveTopic(topicId); 
//           }
//       } catch (err) {
//           toast.error(getErrorMessage(err));
//       }
//     });
//   };
  
//   const handleGenerateImage = async (index: number, prompt: string) => {
//     if (!isTeacher || loadingImages[index] || (data?.studentContent.visualAids[index]?.url)) return;
//     setLoadingImages(prev => ({ ...prev, [index]: true }))
//     try {
//       const result = await generateDiagramImage(prompt) 
//       if (result.success && result.url) {
//         setData(current => {
//           if (!current) return null;
//           const updated = [...current.studentContent.visualAids];
//           updated[index] = { ...updated[index], url: result.url };
//           return { ...current, studentContent: { ...current.studentContent, visualAids: updated } };
//         });
//         await saveGeneratedImageUrlToLesson(lessonId, index, result.url);
//         toast.success("Asset bound to registry.");
//       }
//     } catch (err) {
//         toast.error(getErrorMessage(err));
//     } finally {
//       setLoadingImages(prev => ({ ...prev, [index]: false }))
//     }
//   }

//   if (!data) {
//     return (
//       <div className="py-20 text-center bg-slate-900 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
//         <div className="h-20 w-20 bg-school-primary/10 rounded-full flex items-center justify-center mx-auto text-school-primary border border-school-primary/20">
//           <Sparkles className="h-10 w-10 animate-pulse" />
//         </div>
//         <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Registry Standby</h3>
//         <p className="text-xl font-black text-school-primary uppercase italic tracking-tight">{topicTitle}</p>
//         {isTeacher && (
//           <Button onClick={handleGenerate} disabled={isGenerating} className="bg-school-primary text-slate-950 font-black px-10 py-7 rounded-2xl">
//             {isGenerating ? <><Loader2 className="animate-spin mr-2" /> GENERATING...</> : <><Sparkles className="mr-2 h-5 w-5" /> GENERATE LESSON</>}
//           </Button>
//         )}
//       </div>
//     )
//   }

//   return (
//     <Card className="border-white/5 bg-slate-950 shadow-2xl overflow-hidden rounded-[2.5rem] flex flex-col">
//       <CardHeader className="bg-slate-900 border-b border-white/5 p-8">
//         <div className="flex items-center justify-between gap-4">
//           <div className="flex-1 min-w-0">
//              <div className="flex items-center gap-3 mb-1">
//                 <Layout className="h-5 w-5 text-school-primary" />
//                 <CardTitle className="text-2xl font-black text-white uppercase italic tracking-tighter truncate">
//                     {data.studentContent.title}
//                 </CardTitle>
//                 <Badge className="bg-school-primary/10 text-school-primary border-school-primary/20 uppercase text-[9px]">
//                     {data.metadata.difficultyLevel}
//                 </Badge>
//              </div>
//              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{topicTitle}</p>
//           </div>
          
//           {isTeacher && (
//             <div className="flex items-center gap-3 shrink-0">
//               {!isEditing ? (
//                   <Button variant="outline" onClick={() => setIsEditing(true)} className="border-white/10 text-slate-400 rounded-xl">
//                       <Edit3 className="h-4 w-4 mr-2" /> Edit Registry
//                   </Button>
//               ) : (
//                   <div className="flex gap-2">
//                       <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-slate-500">Cancel</Button>
//                       <Button onClick={handleManualSave} disabled={isPending} className="bg-school-primary text-slate-950 font-black rounded-xl px-6">
//                           {isPending ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
//                           PUBLISH
//                       </Button>
//                   </div>
//               )}
//             </div>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-8 flex-1 bg-slate-950">
//         <div className="flex flex-wrap gap-2 mb-10 bg-slate-900 p-1.5 rounded-2xl w-fit border border-white/5">
//             <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Notes" />
//             <TabButton active={activeTab === "syllabus"} onClick={() => setActiveTab("syllabus")} icon={ListChecks} label="Syllabus" />
//             {isTeacher && <TabButton active={activeTab === "pedagogy"} onClick={() => setActiveTab("pedagogy")} icon={Zap} label="Strategy" />}
//             <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visuals" />
//             <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quiz" />
//         </div>

//         <div className="min-h-[600px]">
//             {activeTab === "explanation" && (
//                 <div className="space-y-6">
//                     {isEditing ? (
//                         <textarea 
//                             className="w-full h-[600px] bg-slate-900 border border-school-primary/30 rounded-[2rem] p-8 text-slate-100 outline-none font-medium"
//                             value={data.studentContent.explanation}
//                             onChange={(e) => setData({...data, studentContent: {...data.studentContent, explanation: e.target.value}})}
//                         />
//                     ) : (
//                         <div className="prose prose-invert max-w-none">
//                             <ReactMarkdown
//                                 components={{
//                                     h1: ({ ...props }) => <h1 className="text-3xl font-black text-white uppercase italic border-b border-white/10 pb-4 mb-6" {...props} />,
//                                     h2: ({ ...props }) => <h2 className="text-xl font-bold text-school-primary uppercase tracking-tight mt-10 mb-4" {...props} />,
//                                     p: ({ ...props }) => <p className="text-slate-300 leading-loose mb-6 text-lg" {...props} />,
//                                     li: ({ ...props }) => <li className="text-slate-300 mb-2" {...props} />,
//                                 }}
//                             >
//                                 {data.studentContent.explanation}
//                             </ReactMarkdown>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {activeTab === "syllabus" && (
//                 <div className="space-y-10">
//                     <section className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 shadow-xl">
//                         <h4 className="text-school-primary text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
//                             <GraduationCap className="h-4 w-4" /> Learning Objectives
//                         </h4>
//                         <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {data.studentContent.learningObjectives.map((obj, i) => (
//                                 <li key={i} className="flex items-start gap-3 text-slate-300 text-sm italic">
//                                     <span className="text-school-primary font-black">0{i+1}.</span> {obj}
//                                 </li>
//                             ))}
//                         </ul>
//                     </section>

//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         <section className="space-y-4">
//                             <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Executive Summary</h4>
//                             <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 text-slate-400 text-sm leading-relaxed italic">
//                                 {data.studentContent.summary}
//                             </div>
//                         </section>

//                         <section className="space-y-4">
//                             <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Keyword Registry</h4>
//                             <div className="flex flex-wrap gap-2">
//                                 {data.studentContent.vocabulary.map((word, i) => (
//                                     <Badge key={i} variant="outline" className="px-4 py-2 border-white/5 bg-slate-900 text-slate-300 rounded-xl text-[10px] uppercase font-bold tracking-widest">
//                                         {word}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         </section>
//                     </div>

//                     <section className="space-y-4">
//                         <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Applications (Examples)</h4>
//                         <div className="grid grid-cols-1 gap-4">
//                             {data.studentContent.examples.map((ex, i) => (
//                                 <div key={i} className="p-6 bg-slate-900 rounded-3xl border border-white/5 space-y-3">
//                                     <p className="text-sm font-black text-school-primary uppercase italic">Task: {ex.task}</p>
//                                     <p className="text-xs text-slate-400 border-t border-white/5 pt-3">Solution: {ex.solution}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 </div>
//             )}

//             {activeTab === "pedagogy" && isTeacher && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <PedagogyCard title="Instructional Method" value={data.teacherLogic.teachingMethod} icon={Zap} />
//                     <PedagogyCard title="Classroom Hook" value={data.teacherLogic.introductionHook} icon={Sparkles} />
//                     <PedagogyCard title="Time Allocation" value={data.teacherLogic.timeAllocation} icon={Clock} />
//                     <PedagogyCard title="Pedagogical Tips" value={data.teacherLogic.pedagogicalTips} icon={Lightbulb} />
//                 </div>
//             )}

//             {activeTab === "visuals" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {data.studentContent.visualAids.map((aid, idx) => (
//                         <Card key={idx} className="bg-slate-900 border border-white/5 rounded-[2rem] overflow-hidden group shadow-xl">
//                             <div className="p-6 border-b border-white/5">
//                                 <h4 className="text-sm font-bold text-white uppercase italic">{aid.title}</h4>
//                                 <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{aid.description}</p>
//                             </div>
//                             <div className="relative aspect-video flex flex-col items-center justify-center p-2 bg-slate-950">
//                                 {aid.url ? (
//                                     <Image src={aid.url} alt={aid.title} fill className="object-cover rounded-2xl opacity-80" unoptimized />
//                                 ) : (
//                                     <div className="text-center space-y-4">
//                                         <ImageIcon className="h-10 w-10 text-slate-800 mx-auto" />
//                                         {isTeacher && (
//                                             <Button onClick={() => handleGenerateImage(idx, aid.imagePrompt)} disabled={loadingImages[idx]} className="bg-slate-900 border border-white/10 hover:bg-school-primary hover:text-slate-950 transition-all rounded-xl">
//                                                 {loadingImages[idx] ? <Loader2 className="animate-spin h-4 w-4" /> : "Synthesize Diagram"}
//                                             </Button>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </Card>
//                     ))}
//                 </div>
//             )}

//             {activeTab === "quiz" && (
//                 <div className="max-w-3xl mx-auto space-y-6">
//                     {data.studentContent.quiz.map((q, i) => (
//                         <div key={i} className="p-8 bg-slate-900 rounded-[2rem] border border-white/5 space-y-4 shadow-xl">
//                             <p className="text-xs font-black text-school-primary uppercase tracking-widest">Assessment Item 0{i+1}</p>
//                             <p className="text-base font-bold text-white leading-relaxed">{q.question}</p>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                 {q.options.map(opt => (
//                                     <div key={opt} className={cn(
//                                         "p-4 rounded-xl border text-xs font-medium",
//                                         opt === q.answer ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400" : "border-white/5 bg-slate-950/50 text-slate-500"
//                                     )}>
//                                         {opt}
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="pt-4 border-t border-white/5 text-[10px] text-slate-500 italic">
//                                 Rationale: {q.explanation}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string }) {
//   return (
//     <Button variant="ghost" onClick={onClick} className={cn(
//           "gap-2 px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
//           active ? "bg-school-primary text-slate-950 shadow-lg" : "text-slate-500 hover:text-white hover:bg-white/5"
//       )}>
//       <Icon className="h-4 w-4" /> {label}
//     </Button>
//   )
// }

// function PedagogyCard({ title, value, icon: Icon }: { title: string, value: string, icon: LucideIcon }) {
//     return (
//         <Card className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-inner space-y-4">
//             <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white/5 rounded-lg text-school-primary"><Icon className="h-4 w-4" /></div>
//                 <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h5>
//             </div>
//             <p className="text-lg font-bold text-white uppercase italic tracking-tight leading-relaxed">{value}</p>
//         </Card>
//     )
// }


// "use client"

// import { useState, useEffect, useTransition } from "react"
// import ReactMarkdown from "react-markdown"
// import Image from "next/image"
// import { 
//     Sparkles, ImageIcon, FileText, HelpCircle, Zap, 
//     Loader2, Edit3, Save, Layout, ListChecks, 
//     Clock, Lightbulb, GraduationCap,
//     type LucideIcon 
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// // Store & Types
// import { useTeacherStore } from "@/store/teacherDataStore"
// import { getErrorMessage } from "@/lib/error-handler"
// import { generateTopicContent } from "@/app/actions/ai-generator" 
// import { generateDiagramImage } from "@/app/actions/generate-diagram" 
// import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
// import { publishLesson } from "@/app/actions/lesson.actions"
// import { Role } from "@prisma/client"
// import { ScannedQuestionRegistry } from "../scannedQuestionRegistry"


// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface VisualAid {
//   title: string;
//   description: string;
//   imagePrompt: string;
//   url?: string; 
// }

// export interface EnhancedLessonContent {
//   metadata: {
//       topicContext: string;
//       difficultyLevel: string;
//   };
//   teacherLogic: {
//       teachingMethod: string;
//       timeAllocation: string;
//       pedagogicalTips: string;
//       introductionHook: string;
//   };
//   studentContent: {
//       title: string;
//       explanation: string;
//       summary: string; 
//       learningObjectives: string[];
//       vocabulary: string[];
//       visualAids: VisualAid[]; 
//       examples: {
//           task: string;
//           solution: string;
//       }[];
//       quiz: {
//           question: string;
//           options: string[];
//           answer: string;
//           explanation: string;
//       }[];
//   };
// }

// interface AILessonPlannerProps {
//   topicId: string;
//   lessonId: string; 
//   topicTitle: string;
//   schoolId: string | null; // Rule 6: Can be null for Independent Users
//   userId: string;
//   userRole: Role;
//   initialData: EnhancedLessonContent | null;
//   mode?: "teacher" | "student";
// }

// // ── Main Component ─────────────────────────────────────────────────────────────

// export function AILessonPlanner({ 
//     topicId, 
//     lessonId, 
//     topicTitle, 
//     schoolId, 
//     userId,
//     userRole,
//     initialData,
//     mode = "teacher" 
// }: AILessonPlannerProps) {
  
//   // Rule 6: Even if mode is 'teacher', if they have no schoolId or are INDIVIDUAL_LEARNER, they cannot edit.
//   const canModify = mode === "teacher" && schoolId !== null && userRole !== Role.INDIVIDUAL_LEARNER;
  
//   const [activeTab, setActiveTab] = useState<string>("explanation")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [isPending, startTransition] = useTransition()
  
//   const [data, setData] = useState<EnhancedLessonContent | null>(initialData)
//   const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({})

//   const { setActiveTopic } = useTeacherStore();

//   useEffect(() => {
//     setData(initialData)
//     setIsEditing(false)
//   }, [topicId, initialData])

//   // ── Handlers ───────────────────────────────────────────────────────────

//   const handleGenerate = async () => {
//     if (!canModify) return;
//     setIsGenerating(true)
//     try {
//       // Signature updated to match refactored generate-content.ts
//       const res = await generateTopicContent({
//         topicId,
//         userId,
//         schoolId,
//         userRole
//       })

//       if (!res.success) {
//         toast.error(res.error ?? "Lesson generation failed")
//         return
//       }
      
//       // Note: The content fetch would typically happen via a revalidatePath in the action,
//       // but if the action returns data, we update locally.
//       toast.success("AI Generation Complete. Refreshing content...")
//     } catch (err) {
//       toast.error(getErrorMessage(err))
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleManualSave = () => {
//     if (!data || !canModify || !schoolId) return;
//     startTransition(async () => {
//       try {
//           const res = await publishLesson({ 
//             topicId, 
//             schoolId, 
//             content: data as any // publishLesson needs to be typed in its own file
//           });
//           if (res.success) {
//             toast.success("Lesson published successfully");
//             setIsEditing(false);
//             setActiveTopic(topicId); 
//           }
//       } catch (err) {
//           toast.error(getErrorMessage(err));
//       }
//     });
//   };
  
//   const handleGenerateImage = async (index: number, prompt: string) => {
//     if (!canModify || loadingImages[index] || (data?.studentContent.visualAids[index]?.url)) return;
//     setLoadingImages(prev => ({ ...prev, [index]: true }))
//     try {
//       const result = await generateDiagramImage(prompt) 
//       if (result.success && result.url) {
//         setData(current => {
//           if (!current) return null;
//           const updated = [...current.studentContent.visualAids];
//           updated[index] = { ...updated[index], url: result.url };
//           return { ...current, studentContent: { ...current.studentContent, visualAids: updated } };
//         });
//         await saveGeneratedImageUrlToLesson(lessonId, index, result.url);
//         toast.success("Visual asset bound to registry.");
//       }
//     } catch (err) {
//         toast.error(getErrorMessage(err));
//     } finally {
//       setLoadingImages(prev => ({ ...prev, [index]: false }))
//     }
//   }

//   if (!data) {
//     return (
//       <div className="py-20 text-center bg-slate-900 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
//         <div className="h-20 w-20 bg-school-primary/10 rounded-full flex items-center justify-center mx-auto text-school-primary border border-school-primary/20">
//           <Sparkles className="h-10 w-10 animate-pulse" />
//         </div>
//         <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Registry Standby</h3>
//         <p className="text-xl font-black text-school-primary uppercase italic tracking-tight">{topicTitle}</p>
//         {canModify && (
//           <Button onClick={handleGenerate} disabled={isGenerating} className="bg-school-primary text-slate-950 font-black px-10 py-7 rounded-2xl">
//             {isGenerating ? <><Loader2 className="animate-spin mr-2" /> GENERATING...</> : <><Sparkles className="mr-2 h-5 w-5" /> GENERATE LESSON</>}
//           </Button>
//         )}
//         {!canModify && (
//            <p className="text-slate-500 text-xs uppercase tracking-widest">Awaiting content publication by school administrator.</p>
//         )}
//       </div>
//     )
//   }

//   return (
//     <Card className="border-white/5 bg-slate-950 shadow-2xl overflow-hidden rounded-[2.5rem] flex flex-col">
//       <CardHeader className="bg-slate-900 border-b border-white/5 p-8">
//         <div className="flex items-center justify-between gap-4">
//           <div className="flex-1 min-w-0">
//              <div className="flex items-center gap-3 mb-1">
//                 <Layout className="h-5 w-5 text-school-primary" />
//                 <CardTitle className="text-2xl font-black text-white uppercase italic tracking-tighter truncate">
//                     {data.studentContent.title}
//                 </CardTitle>
//                 <Badge className="bg-school-primary/10 text-school-primary border-school-primary/20 uppercase text-[9px]">
//                     {data.metadata.difficultyLevel}
//                 </Badge>
//              </div>
//              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{topicTitle}</p>
//           </div>
          
//           {canModify && (
//             <div className="flex items-center gap-3 shrink-0">
//               {!isEditing ? (
//                   <Button variant="outline" onClick={() => setIsEditing(true)} className="border-white/10 text-slate-400 rounded-xl">
//                       <Edit3 className="h-4 w-4 mr-2" /> Edit Registry
//                   </Button>
//               ) : (
//                   <div className="flex gap-2">
//                       <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-slate-500">Cancel</Button>
//                       <Button onClick={handleManualSave} disabled={isPending} className="bg-school-primary text-slate-950 font-black rounded-xl px-6">
//                           {isPending ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
//                           PUBLISH
//                       </Button>
//                   </div>
//               )}
//             </div>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-8 flex-1 bg-slate-950">
//         <div className="flex flex-wrap gap-2 mb-10 bg-slate-900 p-1.5 rounded-2xl w-fit border border-white/5">
//             <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Notes" />
//             <TabButton active={activeTab === "syllabus"} onClick={() => setActiveTab("syllabus")} icon={ListChecks} label="Syllabus" />
//             {(canModify || userRole === Role.TEACHER) && <TabButton active={activeTab === "pedagogy"} onClick={() => setActiveTab("pedagogy")} icon={Zap} label="Strategy" />}
//             <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visuals" />
//             <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quiz" />
//             <TabButton 
//         active={activeTab === "past-papers"} 
//         onClick={() => setActiveTab("past-papers")} 
//         icon={History} 
//         label="Past Papers" 
//     />
//         </div>

//         <div className="min-h-[600px]">
//             {activeTab === "explanation" && (
//                 <div className="space-y-6">
//                     {isEditing ? (
//                         <textarea 
//                             className="w-full h-[600px] bg-slate-900 border border-school-primary/30 rounded-[2rem] p-8 text-slate-100 outline-none font-medium"
//                             value={data.studentContent.explanation}
//                             onChange={(e) => setData({...data, studentContent: {...data.studentContent, explanation: e.target.value}})}
//                         />
//                     ) : (
//                         <div className="prose prose-invert max-w-none">
//                             <ReactMarkdown
//                                 components={{
//                                     h1: ({ ...props }) => <h1 className="text-3xl font-black text-white uppercase italic border-b border-white/10 pb-4 mb-6" {...props} />,
//                                     h2: ({ ...props }) => <h2 className="text-xl font-bold text-school-primary uppercase tracking-tight mt-10 mb-4" {...props} />,
//                                     p: ({ ...props }) => <p className="text-slate-300 leading-loose mb-6 text-lg" {...props} />,
//                                     li: ({ ...props }) => <li className="text-slate-300 mb-2" {...props} />,
//                                 }}
//                             >
//                                 {data.studentContent.explanation}
//                             </ReactMarkdown>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {activeTab === "syllabus" && (
//                 <div className="space-y-10">
//                     <section className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 shadow-xl">
//                         <h4 className="text-school-primary text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
//                             <GraduationCap className="h-4 w-4" /> Learning Objectives
//                         </h4>
//                         <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {data.studentContent.learningObjectives.map((obj, i) => (
//                                 <li key={i} className="flex items-start gap-3 text-slate-300 text-sm italic">
//                                     <span className="text-school-primary font-black">0{i+1}.</span> {obj}
//                                 </li>
//                             ))}
//                         </ul>
//                     </section>

//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         <section className="space-y-4">
//                             <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Executive Summary</h4>
//                             <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 text-slate-400 text-sm leading-relaxed italic">
//                                 {data.studentContent.summary}
//                             </div>
//                         </section>

//                         <section className="space-y-4">
//                             <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Keyword Registry</h4>
//                             <div className="flex flex-wrap gap-2">
//                                 {data.studentContent.vocabulary.map((word, i) => (
//                                     <Badge key={i} variant="outline" className="px-4 py-2 border-white/5 bg-slate-900 text-slate-300 rounded-xl text-[10px] uppercase font-bold tracking-widest">
//                                         {word}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         </section>
//                     </div>

//                     <section className="space-y-4">
//                         <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Applications (Examples)</h4>
//                         <div className="grid grid-cols-1 gap-4">
//                             {data.studentContent.examples.map((ex, i) => (
//                                 <div key={i} className="p-6 bg-slate-900 rounded-3xl border border-white/5 space-y-3">
//                                     <p className="text-sm font-black text-school-primary uppercase italic">Task: {ex.task}</p>
//                                     <p className="text-xs text-slate-400 border-t border-white/5 pt-3">Solution: {ex.solution}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 </div>
//             )}

//             {activeTab === "pedagogy" && (canModify || userRole === Role.TEACHER) && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <PedagogyCard title="Instructional Method" value={data.teacherLogic.teachingMethod} icon={Zap} />
//                     <PedagogyCard title="Classroom Hook" value={data.teacherLogic.introductionHook} icon={Sparkles} />
//                     <PedagogyCard title="Time Allocation" value={data.teacherLogic.timeAllocation} icon={Clock} />
//                     <PedagogyCard title="Pedagogical Tips" value={data.teacherLogic.pedagogicalTips} icon={Lightbulb} />
//                 </div>
//             )}

//             {activeTab === "visuals" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {data.studentContent.visualAids.map((aid, idx) => (
//                         <Card key={idx} className="bg-slate-900 border border-white/5 rounded-[2rem] overflow-hidden group shadow-xl">
//                             <div className="p-6 border-b border-white/5">
//                                 <h4 className="text-sm font-bold text-white uppercase italic">{aid.title}</h4>
//                                 <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{aid.description}</p>
//                             </div>
//                             <div className="relative aspect-video flex flex-col items-center justify-center p-2 bg-slate-950">
//                                 {aid.url ? (
//                                     <Image src={aid.url} alt={aid.title} fill className="object-cover rounded-2xl opacity-80" unoptimized />
//                                 ) : (
//                                     <div className="text-center space-y-4">
//                                         <ImageIcon className="h-10 w-10 text-slate-800 mx-auto" />
//                                         {canModify && (
//                                             <Button onClick={() => handleGenerateImage(idx, aid.imagePrompt)} disabled={loadingImages[idx]} className="bg-slate-900 border border-white/10 hover:bg-school-primary hover:text-slate-950 transition-all rounded-xl">
//                                                 {loadingImages[idx] ? <Loader2 className="animate-spin h-4 w-4" /> : "Synthesize Diagram"}
//                                             </Button>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </Card>
//                     ))}
//                 </div>
//             )}

//             {activeTab === "quiz" && (
//                 <div className="max-w-3xl mx-auto space-y-6">
//                     {data.studentContent.quiz.map((q, i) => (
//                         <div key={i} className="p-8 bg-slate-900 rounded-[2rem] border border-white/5 space-y-4 shadow-xl">
//                             <p className="text-xs font-black text-school-primary uppercase tracking-widest">Assessment Item 0{i+1}</p>
//                             <p className="text-base font-bold text-white leading-relaxed">{q.question}</p>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                 {q.options.map(opt => (
//                                     <div key={opt} className={cn(
//                                         "p-4 rounded-xl border text-xs font-medium",
//                                         opt === q.answer ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400" : "border-white/5 bg-slate-950/50 text-slate-500"
//                                     )}>
//                                         {opt}
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="pt-4 border-t border-white/5 text-[10px] text-slate-500 italic">
//                                 Rationale: {q.explanation}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

            
// {activeTab === "past-papers"} && (
//     <ScannedQuestionRegistry 
//        // Filter the scanned bank ONLY for this specific topicId
//        questions={scannedQuestionsFromBank.filter(q => q.topicId === topicId)}
//        userRole={userRole}
//        // In study mode, selection logic is hidden for students
//     />
//     )

//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string }) {
//   return (
//     <Button variant="ghost" onClick={onClick} className={cn(
//           "gap-2 px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
//           active ? "bg-school-primary text-slate-950 shadow-lg" : "text-slate-500 hover:text-white hover:bg-white/5"
//       )}>
//       <Icon className="h-4 w-4" /> {label}
//     </Button>
//   )
// }

// function PedagogyCard({ title, value, icon: Icon }: { title: string, value: string, icon: LucideIcon }) {
//     return (
//         <Card className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-inner space-y-4">
//             <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white/5 rounded-lg text-school-primary"><Icon className="h-4 w-4" /></div>
//                 <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h5>
//             </div>
//             <p className="text-lg font-bold text-white uppercase italic tracking-tight leading-relaxed">{value}</p>
//         </Card>
//     )
// }


// "use client"

// import { useState, useEffect, useTransition } from "react"
// import ReactMarkdown from "react-markdown"
// import Image from "next/image"
// import { 
//     Sparkles, ImageIcon, FileText, HelpCircle, Zap, 
//     Loader2, Edit3, Save, Layout, ListChecks, 
//     Clock, Lightbulb, GraduationCap, History,
//     type LucideIcon 
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// // Store & Types
// import { useTeacherStore } from "@/store/teacherDataStore"
// import { getErrorMessage } from "@/lib/error-handler"
// import { generateTopicContent } from "@/app/actions/ai-generator" 
// import { generateDiagramImage } from "@/app/actions/generate-diagram" 
// import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
// import { publishLesson } from "@/app/actions/lesson.actions"
// import { Role } from "@prisma/client"
// import { ScannedQuestionRegistry } from "../scannedQuestionRegistry"
// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface VisualAid {
//   title: string;
//   description: string;
//   imagePrompt: string;
//   url?: string; 
// }

// export interface EnhancedLessonContent {
//   metadata: {
//       topicContext: string;
//       difficultyLevel: string;
//   };
//   teacherLogic: {
//       teachingMethod: string;
//       timeAllocation: string;
//       pedagogicalTips: string;
//       introductionHook: string;
//   };
//   studentContent: {
//       title: string;
//       explanation: string;
//       summary: string; 
//       learningObjectives: string[];
//       vocabulary: string[];
//       visualAids: VisualAid[]; 
//       examples: {
//           task: string;
//           solution: string;
//       }[];
//       quiz: {
//           question: string;
//           options: string[];
//           answer: string;
//           explanation: string;
//       }[];
//   };
// }

// interface AILessonPlannerProps {
//   topicId: string;
//   lessonId: string; 
//   topicTitle: string;
//   schoolId: string | null;
//   userId: string;
//   userRole: Role;
//   initialData: EnhancedLessonContent | null;
//   initialScannedQuestions?: Question[]; // ✅ Added this prop
//   mode?: "teacher" | "student";
// }

// // ── Main Component ─────────────────────────────────────────────────────────────

// export function AILessonPlanner({ 
//     topicId, 
//     lessonId, 
//     topicTitle, 
//     schoolId, 
//     userId,
//     userRole,
//     initialData,
//     initialScannedQuestions = [], // Default to empty array
//     mode = "teacher" 
// }: AILessonPlannerProps) {
  
//   const canModify = mode === "teacher" && schoolId !== null && userRole !== Role.INDIVIDUAL_LEARNER;
  
//   const [activeTab, setActiveTab] = useState<string>("explanation")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [isPending, startTransition] = useTransition()
  
//   const [data, setData] = useState<EnhancedLessonContent | null>(initialData)
//   const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({})

//   const { setActiveTopic } = useTeacherStore();

//   useEffect(() => {
//     setData(initialData)
//     setIsEditing(false)
//   }, [topicId, initialData])

//   // ── Handlers ───────────────────────────────────────────────────────────

//   const handleGenerate = async () => {
//     if (!canModify) return;
//     setIsGenerating(true)
//     try {
//       const res = await generateTopicContent({
//         topicId,
//         userId,
//         schoolId,
//         userRole
//       })

//       if (!res.success) {
//         toast.error(res.error ?? "Lesson generation failed")
//         return
//       }
//       toast.success("AI Generation Complete. Refreshing content...")
//     } catch (err: unknown) {
//       toast.error(getErrorMessage(err))
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleManualSave = () => {
//     if (!data || !canModify || !schoolId) return;
//     startTransition(async () => {
//       try {
//           const res = await publishLesson({ 
//             topicId, 
//             schoolId, 
//             content: data,
//             userId,
//             userRole
//           });
//           if (res.success) {
//             toast.success("Lesson published successfully");
//             setIsEditing(false);
//             setActiveTopic(topicId); 
//           }
//       } catch (err: unknown) {
//           toast.error(getErrorMessage(err));
//       }
//     });
//   };
  
//   const handleGenerateImage = async (index: number, prompt: string) => {
//     if (!canModify || loadingImages[index] || (data?.studentContent.visualAids[index]?.url)) return;
//     setLoadingImages(prev => ({ ...prev, [index]: true }))
//     try {
//       const result = await generateDiagramImage({ prompt, schoolId, userId, userRole }) 
//       if (result.success && result.url) {
//         setData(current => {
//           if (!current) return null;
//           const updated = [...current.studentContent.visualAids];
//           updated[index] = { ...updated[index], url: result.url };
//           return { ...current, studentContent: { ...current.studentContent, visualAids: updated } };
//         });
//         await saveGeneratedImageUrlToLesson({
//             lessonId, 
//             visualAidIndex: index, 
//             imageUrl: result.url,
//             userId,
//             userRole,
//             schoolId
//         });
//         toast.success("Visual asset bound to registry.");
//       }
//     } catch (err: unknown) {
//         toast.error(getErrorMessage(err));
//     } finally {
//       setLoadingImages(prev => ({ ...prev, [index]: false }))
//     }
//   }

//   if (!data) {
//     return (
//       <div className="py-20 text-center bg-slate-900 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
//         <div className="h-20 w-20 bg-school-primary/10 rounded-full flex items-center justify-center mx-auto text-school-primary border border-school-primary/20">
//           <Sparkles className="h-10 w-10 animate-pulse" />
//         </div>
//         <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Registry Standby</h3>
//         <p className="text-xl font-black text-school-primary uppercase italic tracking-tight">{topicTitle}</p>
//         {canModify && (
//           <Button onClick={handleGenerate} disabled={isGenerating} className="bg-school-primary text-slate-950 font-black px-10 py-7 rounded-2xl">
//             {isGenerating ? <><Loader2 className="animate-spin mr-2" /> GENERATING...</> : <><Sparkles className="mr-2 h-5 w-5" /> GENERATE LESSON</>}
//           </Button>
//         )}
//       </div>
//     )
//   }

//   return (
//     <Card className="border-white/5 bg-slate-950 shadow-2xl overflow-hidden rounded-[2.5rem] flex flex-col">
//       <CardHeader className="bg-slate-900 border-b border-white/5 p-8">
//         <div className="flex items-center justify-between gap-4">
//           <div className="flex-1 min-w-0">
//              <div className="flex items-center gap-3 mb-1">
//                 <Layout className="h-5 w-5 text-school-primary" />
//                 <CardTitle className="text-2xl font-black text-white uppercase italic tracking-tighter truncate">
//                     {data.studentContent.title}
//                 </CardTitle>
//                 <Badge className="bg-school-primary/10 text-school-primary border-school-primary/20 uppercase text-[9px]">
//                     {data.metadata.difficultyLevel}
//                 </Badge>
//              </div>
//              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{topicTitle}</p>
//           </div>
          
//           {canModify && (
//             <div className="flex items-center gap-3 shrink-0">
//               {!isEditing ? (
//                   <Button variant="outline" onClick={() => setIsEditing(true)} className="border-white/10 text-slate-400 rounded-xl">
//                       <Edit3 className="h-4 w-4 mr-2" /> Edit Registry
//                   </Button>
//               ) : (
//                   <div className="flex gap-2">
//                       <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-slate-500">Cancel</Button>
//                       <Button onClick={handleManualSave} disabled={isPending} className="bg-school-primary text-slate-950 font-black rounded-xl px-6">
//                           {isPending ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
//                           PUBLISH
//                       </Button>
//                   </div>
//               )}
//             </div>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-8 flex-1 bg-slate-950">
//         <div className="flex flex-wrap gap-2 mb-10 bg-slate-900 p-1.5 rounded-2xl w-fit border border-white/5">
//             <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Notes" />
//             <TabButton active={activeTab === "syllabus"} onClick={() => setActiveTab("syllabus")} icon={ListChecks} label="Syllabus" />
//             {(canModify || userRole === Role.TEACHER) && <TabButton active={activeTab === "pedagogy"} onClick={() => setActiveTab("pedagogy")} icon={Zap} label="Strategy" />}
//             <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visuals" />
//             <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quiz" />
//             <TabButton active={activeTab === "past-papers"} onClick={() => setActiveTab("past-papers")} icon={History} label="Past Papers" />
//         </div>

//         <div className="min-h-[600px]">
//             {activeTab === "explanation" && (
//                 <div className="space-y-6">
//                     {isEditing ? (
//                         <textarea 
//                             className="w-full h-[600px] bg-slate-900 border border-school-primary/30 rounded-[2rem] p-8 text-slate-100 outline-none font-medium"
//                             value={data.studentContent.explanation}
//                             onChange={(e) => setData({...data, studentContent: {...data.studentContent, explanation: e.target.value}})}
//                         />
//                     ) : (
//                         <div className="prose prose-invert max-w-none">
//                             <ReactMarkdown
//                                 components={{
//                                     h1: ({ ...props }) => <h1 className="text-3xl font-black text-white uppercase italic border-b border-white/10 pb-4 mb-6" {...props} />,
//                                     h2: ({ ...props }) => <h2 className="text-xl font-bold text-school-primary uppercase tracking-tight mt-10 mb-4" {...props} />,
//                                     p: ({ ...props }) => <p className="text-slate-300 leading-loose mb-6 text-lg" {...props} />,
//                                     li: ({ ...props }) => <li className="text-slate-300 mb-2" {...props} />,
//                                 }}
//                             >
//                                 {data.studentContent.explanation}
//                             </ReactMarkdown>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {activeTab === "syllabus" && (
//                 <div className="space-y-10">
//                     <section className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 shadow-xl">
//                         <h4 className="text-school-primary text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
//                             <GraduationCap className="h-4 w-4" /> Learning Objectives
//                         </h4>
//                         <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {data.studentContent.learningObjectives.map((obj, i) => (
//                                 <li key={i} className="flex items-start gap-3 text-slate-300 text-sm italic">
//                                     <span className="text-school-primary font-black">0{i+1}.</span> {obj}
//                                 </li>
//                             ))}
//                         </ul>
//                     </section>

//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         <section className="space-y-4">
//                             <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Executive Summary</h4>
//                             <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 text-slate-400 text-sm leading-relaxed italic">
//                                 {data.studentContent.summary}
//                             </div>
//                         </section>

//                         <section className="space-y-4">
//                             <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Keyword Registry</h4>
//                             <div className="flex flex-wrap gap-2">
//                                 {data.studentContent.vocabulary.map((word, i) => (
//                                     <Badge key={i} variant="outline" className="px-4 py-2 border-white/5 bg-slate-900 text-slate-300 rounded-xl text-[10px] uppercase font-bold tracking-widest">
//                                         {word}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         </section>
//                     </div>

//                     <section className="space-y-4">
//                         <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Applications (Examples)</h4>
//                         <div className="grid grid-cols-1 gap-4">
//                             {data.studentContent.examples.map((ex, i) => (
//                                 <div key={i} className="p-6 bg-slate-900 rounded-3xl border border-white/5 space-y-3">
//                                     <p className="text-sm font-black text-school-primary uppercase italic">Task: {ex.task}</p>
//                                     <p className="text-xs text-slate-400 border-t border-white/5 pt-3">Solution: {ex.solution}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 </div>
//             )}

//             {activeTab === "pedagogy" && (canModify || userRole === Role.TEACHER) && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <PedagogyCard title="Instructional Method" value={data.teacherLogic.teachingMethod} icon={Zap} />
//                     <PedagogyCard title="Classroom Hook" value={data.teacherLogic.introductionHook} icon={Sparkles} />
//                     <PedagogyCard title="Time Allocation" value={data.teacherLogic.timeAllocation} icon={Clock} />
//                     <PedagogyCard title="Pedagogical Tips" value={data.teacherLogic.pedagogicalTips} icon={Lightbulb} />
//                 </div>
//             )}

//             {activeTab === "visuals" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {data.studentContent.visualAids.map((aid, idx) => (
//                         <Card key={idx} className="bg-slate-900 border border-white/5 rounded-[2rem] overflow-hidden group shadow-xl">
//                             <div className="p-6 border-b border-white/5">
//                                 <h4 className="text-sm font-bold text-white uppercase italic">{aid.title}</h4>
//                                 <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{aid.description}</p>
//                             </div>
//                             <div className="relative aspect-video flex flex-col items-center justify-center p-2 bg-slate-950">
//                                 {aid.url ? (
//                                     <Image src={aid.url} alt={aid.title} fill className="object-cover rounded-2xl opacity-80" unoptimized />
//                                 ) : (
//                                     <div className="text-center space-y-4">
//                                         <ImageIcon className="h-10 w-10 text-slate-800 mx-auto" />
//                                         {canModify && (
//                                             <Button onClick={() => handleGenerateImage(idx, aid.imagePrompt)} disabled={loadingImages[idx]} className="bg-slate-900 border border-white/10 hover:bg-school-primary hover:text-slate-950 transition-all rounded-xl">
//                                                 {loadingImages[idx] ? <Loader2 className="animate-spin h-4 w-4" /> : "Synthesize Diagram"}
//                                             </Button>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </Card>
//                     ))}
//                 </div>
//             )}

//             {activeTab === "quiz" && (
//                 <div className="max-w-3xl mx-auto space-y-6">
//                     {data.studentContent.quiz.map((q, i) => (
//                         <div key={i} className="p-8 bg-slate-900 rounded-[2rem] border border-white/5 space-y-4 shadow-xl">
//                             <p className="text-xs font-black text-school-primary uppercase tracking-widest">Assessment Item 0{i+1}</p>
//                             <p className="text-base font-bold text-white leading-relaxed">{q.question}</p>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                 {q.options.map(opt => (
//                                     <div key={opt} className={cn(
//                                         "p-4 rounded-xl border text-xs font-medium",
//                                         opt === q.answer ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400" : "border-white/5 bg-slate-950/50 text-slate-500"
//                                     )}>
//                                         {opt}
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="pt-4 border-t border-white/5 text-[10px] text-slate-500 italic">
//                                 Rationale: {q.explanation}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {activeTab === "past-papers" && (
//                 <ScannedQuestionRegistry 
//                     questions={initialScannedQuestions.filter(q => q.topicId === topicId)}
//                     userRole={userRole}
//                 />
//             )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string }) {
//   return (
//     <Button variant="ghost" onClick={onClick} className={cn(
//           "gap-2 px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
//           active ? "bg-school-primary text-slate-950 shadow-lg" : "text-slate-500 hover:text-white hover:bg-white/5"
//       )}>
//       <Icon className="h-4 w-4" /> {label}
//     </Button>
//   )
// }

// function PedagogyCard({ title, value, icon: Icon }: { title: string, value: string, icon: LucideIcon }) {
//     return (
//         <Card className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-inner space-y-4">
//             <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white/5 rounded-lg text-school-primary"><Icon className="h-4 w-4" /></div>
//                 <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h5>
//             </div>
//             <p className="text-lg font-bold text-white uppercase italic tracking-tight leading-relaxed">{value}</p>
//         </Card>
//     )
// }


// "use client"

// import { useState, useEffect, useTransition } from "react"
// import ReactMarkdown from "react-markdown"
// import Image from "next/image"
// import { 
//     Sparkles, ImageIcon, FileText, HelpCircle, Zap, 
//     Loader2, Edit3, Save, Layout, ListChecks, 
//     Clock, Lightbulb, GraduationCap, History,
//     type LucideIcon 
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"
// import { Question} from "@prisma/client";

// // Store & Types
// import { useTeacherStore } from "@/store/teacherDataStore"
// import { getErrorMessage } from "@/lib/error-handler"
// import { generateTopicContent } from "@/app/actions/ai-generator" 
// import { generateDiagramImage } from "@/app/actions/generate-diagram" 
// import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
// import { publishLesson } from "@/app/actions/lesson.actions"
// import { Role } from "@prisma/client"
// import { ScannedQuestionRegistry } from "../scan/scannedQuestionRegistry"
// import { PracticeHub } from "../individual-student/exam/practicehub"
// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface VisualAid {
//   title: string;
//   description: string;
//   imagePrompt: string;
//   url?: string; 
// }

// export interface EnhancedLessonContent {
//   metadata: {
//       topicContext: string;
//       difficultyLevel: string;
//   };
//   teacherLogic: {
//       teachingMethod: string;
//       timeAllocation: string;
//       pedagogicalTips: string;
//       introductionHook: string;
//   };
//   studentContent: {
//       title: string;
//       explanation: string;
//       summary: string; 
//       learningObjectives: string[];
//       vocabulary: string[];
//       visualAids: VisualAid[]; 
//       examples: {
//           task: string;
//           solution: string;
//       }[];
//       quiz: {
//           question: string;
//           options: string[];
//           answer: string;
//           explanation: string;
//       }[];
//   };
// }

// interface AILessonPlannerProps {
//   topicId: string;
//   lessonId: string; 
//   topicTitle: string;
//   schoolId: string | null;
//   userId: string;
//   userRole: Role;
//   initialData: EnhancedLessonContent | null;
//   initialScannedQuestions?: Question[]; // ✅ Added this prop
//   mode?: "teacher" | "student";
// }

// // ── Main Component ─────────────────────────────────────────────────────────────

// export function AILessonPlanner({ 
//     topicId, 
//     lessonId, 
//     topicTitle, 
//     schoolId, 
//     userId,
//     userRole,
//     initialData,
//     initialScannedQuestions = [], // Default to empty array
//     mode = "teacher" 
// }: AILessonPlannerProps) {
  
//   const canModify = mode === "teacher" && schoolId !== null && userRole !== Role.INDIVIDUAL_LEARNER;
//   const isIndependent = userRole === Role.INDIVIDUAL_LEARNER && schoolId === null;

//   const [activeTab, setActiveTab] = useState<string>("explanation")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [isPending, startTransition] = useTransition()
  
//   const [data, setData] = useState<EnhancedLessonContent | null>(initialData)
//   const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({})

//   const { setActiveTopic } = useTeacherStore();

//   useEffect(() => {
//     setData(initialData)
//     setIsEditing(false)
//   }, [topicId, initialData])

//   // ── Handlers ───────────────────────────────────────────────────────────

//   const handleGenerate = async () => {
//     if (!canModify) return;
//     setIsGenerating(true)
//     try {
//       const res = await generateTopicContent({
//         topicId,
//         userId,
//         schoolId,
//         userRole
//       })

//       if (!res.success) {
//         toast.error(res.error ?? "Lesson generation failed")
//         return
//       }
//       toast.success("AI Generation Complete. Refreshing content...")
//     } catch (err: unknown) {
//       toast.error(getErrorMessage(err))
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleManualSave = () => {
//     if (!data || !canModify || !schoolId) return;
//     startTransition(async () => {
//       try {
//           const res = await publishLesson({ 
//             topicId, 
//             schoolId, 
//             content: data,
//             userId,
//             userRole
//           });
//           if (res.success) {
//             toast.success("Lesson published successfully");
//             setIsEditing(false);
//             setActiveTopic(topicId); 
//           }
//       } catch (err: unknown) {
//           toast.error(getErrorMessage(err));
//       }
//     });
//   };
  
//   const handleGenerateImage = async (index: number, prompt: string) => {
//     if (!canModify || loadingImages[index] || (data?.studentContent.visualAids[index]?.url)) return;
//     setLoadingImages(prev => ({ ...prev, [index]: true }))
//     try {
//       const result = await generateDiagramImage({ prompt, schoolId, userId, userRole }) 
//       if (result.success && result.url) {
//         setData(current => {
//           if (!current) return null;
//           const updated = [...current.studentContent.visualAids];
//           updated[index] = { ...updated[index], url: result.url };
//           return { ...current, studentContent: { ...current.studentContent, visualAids: updated } };
//         });
//         await saveGeneratedImageUrlToLesson({
//             lessonId, 
//             visualAidIndex: index, 
//             imageUrl: result.url,
//             userId,
//             userRole,
//             schoolId
//         });
//         toast.success("Visual asset bound to registry.");
//       }
//     } catch (err: unknown) {
//         toast.error(getErrorMessage(err));
//     } finally {
//       setLoadingImages(prev => ({ ...prev, [index]: false }))
//     }
//   }

//   if (!data) {
//     return (
//       <div className="py-20 text-center bg-slate-900 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
//         <div className="h-20 w-20 bg-school-primary/10 rounded-full flex items-center justify-center mx-auto text-school-primary border border-school-primary/20">
//           <Sparkles className="h-10 w-10 animate-pulse" />
//         </div>
//         <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Registry Standby</h3>
//         <p className="text-xl font-black text-school-primary uppercase italic tracking-tight">{topicTitle}</p>
//         {canModify && (
//           <Button onClick={handleGenerate} disabled={isGenerating} className="bg-school-primary text-slate-950 font-black px-10 py-7 rounded-2xl">
//             {isGenerating ? <><Loader2 className="animate-spin mr-2" /> GENERATING...</> : <><Sparkles className="mr-2 h-5 w-5" /> GENERATE LESSON</>}
//           </Button>
//         )}
//       </div>
//     )
//   }

//   return (
//     <Card className="border-white/5 bg-slate-950 shadow-2xl overflow-hidden rounded-[2.5rem] flex flex-col">
//       <CardHeader className="bg-slate-900 border-b border-white/5 p-8">
//         <div className="flex items-center justify-between gap-4">
//           <div className="flex-1 min-w-0">
//              <div className="flex items-center gap-3 mb-1">
//                 <Layout className="h-5 w-5 text-school-primary" />
//                 <CardTitle className="text-2xl font-black text-white uppercase italic tracking-tighter truncate">
//                     {data.studentContent.title}
//                 </CardTitle>
//                 <Badge className="bg-school-primary/10 text-school-primary border-school-primary/20 uppercase text-[9px]">
//                     {data.metadata.difficultyLevel}
//                 </Badge>
//              </div>
//              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{topicTitle}</p>
//           </div>
          
//           {canModify && (
//             <div className="flex items-center gap-3 shrink-0">
//               {!isEditing ? (
//                   <Button variant="outline" onClick={() => setIsEditing(true)} className="border-white/10 text-slate-400 rounded-xl">
//                       <Edit3 className="h-4 w-4 mr-2" /> Edit Registry
//                   </Button>
//               ) : (
//                   <div className="flex gap-2">
//                       <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-slate-500">Cancel</Button>
//                       <Button onClick={handleManualSave} disabled={isPending} className="bg-school-primary text-slate-950 font-black rounded-xl px-6">
//                           {isPending ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
//                           PUBLISH
//                       </Button>
//                   </div>
//               )}
//             </div>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-8 flex-1 bg-slate-950">
//         <div className="flex flex-wrap gap-2 mb-10 bg-slate-900 p-1.5 rounded-2xl w-fit border border-white/5">
//             <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Notes" />
//             <TabButton active={activeTab === "syllabus"} onClick={() => setActiveTab("syllabus")} icon={ListChecks} label="Syllabus" />
//             {(canModify || userRole === Role.TEACHER) && <TabButton active={activeTab === "pedagogy"} onClick={() => setActiveTab("pedagogy")} icon={Zap} label="Strategy" />}
//             <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visuals" />
//             <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quiz" />
//             <TabButton active={activeTab === "past-papers"} onClick={() => setActiveTab("past-papers")} icon={History} label="Past Papers" />
//             {isIndependent && (
//           <TabButton 
//               active={activeTab === "interactive-quiz"} 
//               onClick={() => setActiveTab("interactive-quiz")} 
//               icon={Zap} 
//               label="Interactive Practice" 
//           />
//       )}
//         </div>

//         <div className="min-h-[600px]">
//             {activeTab === "explanation" && (
//                 <div className="space-y-6">
//                     {isEditing ? (
//                         <textarea 
//                             className="w-full h-[600px] bg-slate-900 border border-school-primary/30 rounded-[2rem] p-8 text-slate-100 outline-none font-medium"
//                             value={data.studentContent.explanation}
//                             onChange={(e) => setData({...data, studentContent: {...data.studentContent, explanation: e.target.value}})}
//                         />
//                     ) : (
//                         <div className="prose prose-invert max-w-none">
//                             <ReactMarkdown
//                                 components={{
//                                     h1: ({ ...props }) => <h1 className="text-3xl font-black text-white uppercase italic border-b border-white/10 pb-4 mb-6" {...props} />,
//                                     h2: ({ ...props }) => <h2 className="text-xl font-bold text-school-primary uppercase tracking-tight mt-10 mb-4" {...props} />,
//                                     p: ({ ...props }) => <p className="text-slate-300 leading-loose mb-6 text-lg" {...props} />,
//                                     li: ({ ...props }) => <li className="text-slate-300 mb-2" {...props} />,
//                                 }}
//                             >
//                                 {data.studentContent.explanation}
//                             </ReactMarkdown>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {activeTab === "syllabus" && (
//                 <div className="space-y-10">
//                     <section className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 shadow-xl">
//                         <h4 className="text-school-primary text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
//                             <GraduationCap className="h-4 w-4" /> Learning Objectives
//                         </h4>
//                         <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {data.studentContent.learningObjectives.map((obj, i) => (
//                                 <li key={i} className="flex items-start gap-3 text-slate-300 text-sm italic">
//                                     <span className="text-school-primary font-black">0{i+1}.</span> {obj}
//                                 </li>
//                             ))}
//                         </ul>
//                     </section>

//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         <section className="space-y-4">
//                             <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Executive Summary</h4>
//                             <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 text-slate-400 text-sm leading-relaxed italic">
//                                 {data.studentContent.summary}
//                             </div>
//                         </section>

//                         <section className="space-y-4">
//                             <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Keyword Registry</h4>
//                             <div className="flex flex-wrap gap-2">
//                                 {data.studentContent.vocabulary.map((word, i) => (
//                                     <Badge key={i} variant="outline" className="px-4 py-2 border-white/5 bg-slate-900 text-slate-300 rounded-xl text-[10px] uppercase font-bold tracking-widest">
//                                         {word}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         </section>
//                     </div>

//                     <section className="space-y-4">
//                         <h4 className="text-white text-xs font-black uppercase tracking-widest ml-2">Applications (Examples)</h4>
//                         <div className="grid grid-cols-1 gap-4">
//                             {data.studentContent.examples.map((ex, i) => (
//                                 <div key={i} className="p-6 bg-slate-900 rounded-3xl border border-white/5 space-y-3">
//                                     <p className="text-sm font-black text-school-primary uppercase italic">Task: {ex.task}</p>
//                                     <p className="text-xs text-slate-400 border-t border-white/5 pt-3">Solution: {ex.solution}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 </div>
//             )}

//             {activeTab === "pedagogy" && (canModify || userRole === Role.TEACHER) && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <PedagogyCard title="Instructional Method" value={data.teacherLogic.teachingMethod} icon={Zap} />
//                     <PedagogyCard title="Classroom Hook" value={data.teacherLogic.introductionHook} icon={Sparkles} />
//                     <PedagogyCard title="Time Allocation" value={data.teacherLogic.timeAllocation} icon={Clock} />
//                     <PedagogyCard title="Pedagogical Tips" value={data.teacherLogic.pedagogicalTips} icon={Lightbulb} />
//                 </div>
//             )}

//             {activeTab === "visuals" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {data.studentContent.visualAids.map((aid, idx) => (
//                         <Card key={idx} className="bg-slate-900 border border-white/5 rounded-[2rem] overflow-hidden group shadow-xl">
//                             <div className="p-6 border-b border-white/5">
//                                 <h4 className="text-sm font-bold text-white uppercase italic">{aid.title}</h4>
//                                 <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{aid.description}</p>
//                             </div>
//                             <div className="relative aspect-video flex flex-col items-center justify-center p-2 bg-slate-950">
//                                 {aid.url ? (
//                                     <Image src={aid.url} alt={aid.title} fill className="object-cover rounded-2xl opacity-80" unoptimized />
//                                 ) : (
//                                     <div className="text-center space-y-4">
//                                         <ImageIcon className="h-10 w-10 text-slate-800 mx-auto" />
//                                         {canModify && (
//                                             <Button onClick={() => handleGenerateImage(idx, aid.imagePrompt)} disabled={loadingImages[idx]} className="bg-slate-900 border border-white/10 hover:bg-school-primary hover:text-slate-950 transition-all rounded-xl">
//                                                 {loadingImages[idx] ? <Loader2 className="animate-spin h-4 w-4" /> : "Synthesize Diagram"}
//                                             </Button>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </Card>
//                     ))}
//                 </div>
//             )}

//             {activeTab === "quiz" && (
//                 <div className="max-w-3xl mx-auto space-y-6">
//                     {data.studentContent.quiz.map((q, i) => (
//                         <div key={i} className="p-8 bg-slate-900 rounded-[2rem] border border-white/5 space-y-4 shadow-xl">
//                             <p className="text-xs font-black text-school-primary uppercase tracking-widest">Assessment Item 0{i+1}</p>
//                             <p className="text-base font-bold text-white leading-relaxed">{q.question}</p>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                 {q.options.map(opt => (
//                                     <div key={opt} className={cn(
//                                         "p-4 rounded-xl border text-xs font-medium",
//                                         opt === q.answer ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400" : "border-white/5 bg-slate-950/50 text-slate-500"
//                                     )}>
//                                         {opt}
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="pt-4 border-t border-white/5 text-[10px] text-slate-500 italic">
//                                 Rationale: {q.explanation}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {activeTab === "past-papers" && (
//                 <ScannedQuestionRegistry 
//                     questions={initialScannedQuestions.filter(q => q.topicId === topicId)}
//                     userRole={userRole}
//                 />
//             )}

// {activeTab === "interactive-quiz" && isIndependent && (
//           <PracticeHub 
//               userId={userId} 
//               // data.metadata.topicContext usually stores the gradeSubjectId
//               gradeSubjectId={data.metadata.topicContext} 
//           />
//       )}

//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string }) {
//   return (
//     <Button variant="ghost" onClick={onClick} className={cn(
//           "gap-2 px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
//           active ? "bg-school-primary text-slate-950 shadow-lg" : "text-slate-500 hover:text-white hover:bg-white/5"
//       )}>
//       <Icon className="h-4 w-4" /> {label}
//     </Button>
//   )
// }

// function PedagogyCard({ title, value, icon: Icon }: { title: string, value: string, icon: LucideIcon }) {
//     return (
//         <Card className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-inner space-y-4">
//             <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white/5 rounded-lg text-school-primary"><Icon className="h-4 w-4" /></div>
//                 <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h5>
//             </div>
//             <p className="text-lg font-bold text-white uppercase italic tracking-tight leading-relaxed">{value}</p>
//         </Card>
//     )
// }


// "use client";

// import { useState, useEffect, useTransition } from "react"
// import ReactMarkdown from "react-markdown"
// import Image from "next/image"
// import { 
//     Sparkles, ImageIcon, FileText, HelpCircle, Zap, 
//     Loader2, Edit3, Save, Layout, ListChecks, 
//     GraduationCap, History,
//     type LucideIcon 
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"
// import { Question} from "@prisma/client";

// // Store & Types
// import { useTeacherStore } from "@/store/teacherDataStore"
// import { getErrorMessage } from "@/lib/error-handler"
// import { EnhancedLessonContent, generateTopicContent } from "@/app/actions/ai-generator" 
// import { generateDiagramImage } from "@/app/actions/generate-diagram" 
// import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
// import { publishLesson } from "@/app/actions/lesson.actions"
// import { Role } from "@prisma/client"
// import { ScannedQuestionRegistry } from "../scan/scannedQuestionRegistry"
// import { PracticeHub } from "../individual-student/exam/practicehub"
// import { useProfileStore } from "@/store/profileStore";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface AILessonPlannerProps {
//   topicId: string;
//   lessonId: string; 
//   topicTitle: string;
//   schoolId: string | null;
//   userId: string;
//   userRole: Role;
//   initialData: EnhancedLessonContent | null;
//   initialScannedQuestions?: Question[];
//   mode?: "teacher" | "student";
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function AILessonPlanner({ 
//     topicId, 
//     lessonId, 
//     topicTitle, 
//     schoolId, 
//     userId,
//     userRole,
//     initialData,
//     initialScannedQuestions = [],
//     mode = "teacher" 
// }: AILessonPlannerProps) {
  
//   const { profile } = useProfileStore();
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   // Rule 6: Identity Context logic
//   const canModify = mode === "teacher" && schoolId !== null && userRole !== Role.INDIVIDUAL_LEARNER;
//   const isIndependent = userRole === Role.INDIVIDUAL_LEARNER && schoolId === null;

//   const [activeTab, setActiveTab] = useState<string>("explanation");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isPending, startTransition] = useTransition();
  
//   const [data, setData] = useState<EnhancedLessonContent | null>(initialData);
//   const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});

//   const { setActiveTopic } = useTeacherStore();

//   useEffect(() => {
//     setData(initialData);
//     setIsEditing(false);
//   }, [topicId, initialData]);

//   // ── Handlers ───────────────────────────────────────────────────────────

//   const handleGenerate = async () => {
//     // Both Teachers and Independent Learners can generate Tier-1 Content
//     if (!canModify && !isIndependent) return;

//     setIsGenerating(true);
//     try {
//       // Rule 15: Correct Action Signature
//       const res = await generateTopicContent({
//         topicId,
//         userId,
//         schoolId,
//         userRole
//       });

//       if (!res.success) {
//         toast.error(res.error ?? "Synthesis failed");
//         return;
//       }
//       toast.success("AI Synthesis Complete. Re-syncing Registry...");
//       // In a real app, you would revalidatePath or re-fetch here
//     } catch (err: unknown) {
//       toast.error(getErrorMessage(err));
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleManualSave = () => {
//     if (!data || !canModify || !schoolId) return;
    
//     startTransition(async () => {
//       try {
//           // Rule 15: Synced with refactored lesson-actions.ts
//           const res = await publishLesson({ 
//             topicId, 
//             schoolId, 
//             content: data,
//             userId,
//             userRole
//           });
          
//           if (res.success) {
//             toast.success("Institutional customization published.");
//             setIsEditing(false);
//             setActiveTopic(topicId); 
//           }
//       } catch (err: unknown) {
//           toast.error(getErrorMessage(err));
//       }
//     });
//   };
  
//   const handleGenerateImage = async (index: number, prompt: string) => {
//     if ((!canModify && !isIndependent) || loadingImages[index] || (data?.studentContent.visualAids[index]?.url)) return;
    
//     setLoadingImages(prev => ({ ...prev, [index]: true }));
//     try {
//       const result = await generateDiagramImage({
//           prompt,
//           schoolId,
//           userId,
//           userRole
//       });

//       if (result.success && result.url) {
//         setData(current => {
//           if (!current) return null;
//           const updated = [...current.studentContent.visualAids];
//           updated[index] = { ...updated[index], url: result.url };
//           return { ...current, studentContent: { ...current.studentContent, visualAids: updated } };
//         });

//         await saveGeneratedImageUrlToLesson({
//             lessonId, 
//             visualAidIndex: index, 
//             imageUrl: result.url,
//             userId,
//             userRole,
//             schoolId
//         });
//         toast.success("Asset bound to registry.");
//       }
//     } catch (err: unknown) {
//         toast.error(getErrorMessage(err));
//     } finally {
//       setLoadingImages(prev => ({ ...prev, [index]: false }));
//     }
//   };

//   // ── Render Logic: Initial State ──

//   if (!data) {
//     return (
//       <div className="py-20 text-center bg-slate-900 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
//         <div 
//             className="h-20 w-20 rounded-full flex items-center justify-center mx-auto border"
//             style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
//         >
//           <Sparkles className="h-10 w-10 animate-pulse" style={{ color: primaryColor }} />
//         </div>
//         <div className="space-y-2">
//             <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Registry Standby</h3>
//             <p className="text-sm font-bold text-slate-500 uppercase tracking-widest italic">{topicTitle}</p>
//         </div>
//         {(canModify || isIndependent) && (
//           <Button 
//             onClick={handleGenerate} 
//             disabled={isGenerating} 
//             className="text-slate-950 font-black px-10 py-7 rounded-2xl text-[10px] tracking-widest uppercase transition-all shadow-xl"
//             style={{ backgroundColor: primaryColor }}
//           >
//             {isGenerating ? <><Loader2 className="animate-spin mr-2" /> SYNTHESIZING...</> : <><Sparkles className="mr-2 h-5 w-5" /> Initialize Synthesis</>}
//           </Button>
//         )}
//       </div>
//     );
//   }

//   // ── Render Logic: Main Workspace ──

//   return (
//     <Card className="border-white/5 bg-slate-950 shadow-2xl overflow-hidden rounded-[2.5rem] flex flex-col">
//       <CardHeader className="bg-slate-900 border-b border-white/5 p-8">
//         <div className="flex items-center justify-between gap-4">
//           <div className="flex-1 min-w-0">
//              <div className="flex items-center gap-3 mb-1">
//                 <Layout className="h-5 w-5" style={{ color: primaryColor }} />
//                 <CardTitle className="text-2xl font-black text-white uppercase italic tracking-tighter truncate leading-none">
//                     {data.studentContent.title}
//                 </CardTitle>
//                 <Badge className="bg-slate-950 text-white border-white/10 uppercase text-[8px] font-black tracking-widest">
//                     {data.metadata.difficultyLevel}
//                 </Badge>
//              </div>
//              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">{topicTitle}</p>
//           </div>
          
//           {canModify && (
//             <div className="flex items-center gap-3 shrink-0">
//               {!isEditing ? (
//                   <Button variant="outline" onClick={() => setIsEditing(true)} className="border-white/10 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest px-6 py-4">
//                       <Edit3 className="h-4 w-4 mr-2" /> Edit Registry
//                   </Button>
//               ) : (
//                   <div className="flex gap-2">
//                       <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Cancel</Button>
//                       <Button 
//                         onClick={handleManualSave} 
//                         disabled={isPending} 
//                         className="text-slate-950 font-black rounded-xl px-8 py-4 text-[10px] uppercase tracking-widest shadow-xl"
//                         style={{ backgroundColor: primaryColor }}
//                       >
//                           {isPending ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
//                           Publish Changes
//                       </Button>
//                   </div>
//               )}
//             </div>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-8 flex-1 bg-slate-950">
//         {/* TABS LIST */}
//         <div className="flex flex-wrap gap-2 mb-10 bg-slate-900 p-1.5 rounded-2xl w-fit border border-white/5 shadow-inner">
//             <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Notes" primaryColor={primaryColor} />
//             <TabButton active={activeTab === "syllabus"} onClick={() => setActiveTab("syllabus")} icon={ListChecks} label="Syllabus" primaryColor={primaryColor} />
//             {(canModify || userRole === Role.TEACHER) && <TabButton active={activeTab === "pedagogy"} onClick={() => setActiveTab("pedagogy")} icon={Zap} label="Strategy" primaryColor={primaryColor} />}
//             <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visuals" primaryColor={primaryColor} />
//             <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quiz" primaryColor={primaryColor} />
//             <TabButton active={activeTab === "past-papers"} onClick={() => setActiveTab("past-papers")} icon={History} label="Past Papers" primaryColor={primaryColor} />
            
//             {isIndependent && (
//                 <TabButton active={activeTab === "interactive-quiz"} onClick={() => setActiveTab("interactive-quiz")} icon={Zap} label="Practice" primaryColor={primaryColor} />
//             )}
//         </div>

//         <div className="min-h-[600px]">
//             {activeTab === "explanation" && (
//                 <div className="space-y-6">
//                     {isEditing ? (
//                         <textarea 
//                             className="w-full h-[600px] bg-slate-900 border border-white/10 rounded-[2rem] p-8 text-slate-100 outline-none font-medium text-lg leading-relaxed shadow-inner"
//                             value={data.studentContent.explanation}
//                             onChange={(e) => setData({...data, studentContent: {...data.studentContent, explanation: e.target.value}})}
//                         />
//                     ) : (
//                         <div className="prose prose-invert max-w-none animate-in fade-in duration-500">
//                             <ReactMarkdown
//                                 components={{
//                                     h1: ({ ...props }) => <h1 className="text-3xl font-black text-white uppercase italic border-b border-white/10 pb-4 mb-6" {...props} />,
//                                     h2: ({ ...props }) => <h2 className="text-xl font-bold uppercase tracking-tight mt-10 mb-4" style={{ color: primaryColor }} {...props} />,
//                                     p: ({ ...props }) => <p className="text-slate-300 leading-loose mb-6 text-lg" {...props} />,
//                                     li: ({ ...props }) => <li className="text-slate-400 mb-2 font-medium" {...props} />,
//                                 }}
//                             >
//                                 {data.studentContent.explanation}
//                             </ReactMarkdown>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {activeTab === "syllabus" && (
//                 <div className="space-y-10 animate-in fade-in duration-500">
//                     <section className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
//                         <h4 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-3" style={{ color: primaryColor }}>
//                             <GraduationCap className="h-5 w-5" /> Learning Objectives
//                         </h4>
//                         <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             {data.studentContent.learningObjectives.map((obj, i) => (
//                                 <li key={i} className="flex items-start gap-4 text-slate-300 text-sm italic font-bold">
//                                     <span style={{ color: primaryColor }}>0{i+1}.</span> {obj}
//                                 </li>
//                             ))}
//                         </ul>
//                     </section>

//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         <section className="space-y-4">
//                             <h4 className="text-white text-[10px] font-black uppercase tracking-widest ml-4">Executive Summary</h4>
//                             <div className="bg-slate-900 p-8 rounded-[2rem] border border-white/5 text-slate-400 text-sm leading-loose italic shadow-inner">
//                                 {data.studentContent.summary}
//                             </div>
//                         </section>

//                         <section className="space-y-4">
//                             <h4 className="text-white text-[10px] font-black uppercase tracking-widest ml-4">Keyword Registry</h4>
//                             <div className="flex flex-wrap gap-2">
//                                 {data.studentContent.vocabulary.map((word, i) => (
//                                     <Badge key={i} variant="outline" className="px-4 py-2 border-white/5 bg-slate-900 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest">
//                                         {word}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         </section>
//                     </div>
//                 </div>
//             )}

//             {activeTab === "visuals" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
//                     {data.studentContent.visualAids.map((aid, idx) => (
//                         <Card key={idx} className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden group shadow-2xl">
//                             <div className="p-8 border-b border-white/5 bg-slate-950/50">
//                                 <h4 className="text-sm font-black text-white uppercase italic">{aid.title}</h4>
//                                 <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-1">{aid.description}</p>
//                             </div>
//                             <div className="relative aspect-video flex flex-col items-center justify-center p-4 bg-slate-950">
//                                 {aid.url ? (
//                                     <Image src={aid.url} alt={aid.title} fill className="object-cover opacity-60 transition-opacity group-hover:opacity-80" unoptimized />
//                                 ) : (
//                                     <div className="text-center space-y-6">
//                                         <ImageIcon className="h-12 w-12 text-slate-900 mx-auto" />
//                                         {(canModify || isIndependent) && (
//                                             <Button 
//                                                 onClick={() => handleGenerateImage(idx, aid.imagePrompt)} 
//                                                 disabled={loadingImages[idx]} 
//                                                 className="bg-slate-900 border border-white/10 text-white font-black rounded-xl text-[9px] uppercase tracking-widest py-5 px-6 hover:brightness-125 transition-all"
//                                             >
//                                                 {loadingImages[idx] ? <Loader2 className="animate-spin h-4 w-4" /> : "Synthesize Asset"}
//                                             </Button>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </Card>
//                     ))}
//                 </div>
//             )}

//             {activeTab === "past-papers" && (
//                 <div className="animate-in fade-in duration-500">
//                     <ScannedQuestionRegistry 
//                         questions={initialScannedQuestions.filter(q => q.topicId === topicId)}
//                         userRole={userRole}
//                     />
//                 </div>
//             )}

//             {activeTab === "interactive-quiz" && isIndependent && (
//                 <PracticeHub 
//                     userId={userId} 
//                     gradeSubjectId={data.metadata.topicContext} 
//                 />
//             )}

//             {/* AI Generated Standard Quiz */}
//             {activeTab === "quiz" && (
//                 <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
//                     {data.studentContent.quiz.map((q, i) => (
//                         <div key={i} className="p-10 bg-slate-900 rounded-[3rem] border border-white/5 space-y-8 shadow-2xl">
//                             <div className="flex items-center gap-4">
//                                 <span className="text-2xl font-black italic opacity-20" style={{ color: primaryColor }}>0{i+1}</span>
//                                 <p className="text-xl font-bold text-white leading-relaxed tracking-tight">{q.question}</p>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-12">
//                                 {q.options.map(opt => (
//                                     <div key={opt} className={cn(
//                                         "p-5 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all",
//                                         opt === q.answer ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400" : "border-white/5 bg-slate-950/50 text-slate-600"
//                                     )}>
//                                         {opt}
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="pt-6 border-t border-white/5 px-12">
//                                 <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">Rationale: {q.explanation}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function TabButton({ active, onClick, icon: Icon, label, primaryColor }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string, primaryColor: string }) {
//   return (
//     <Button 
//         variant="ghost" 
//         onClick={onClick} 
//         className={cn(
//           "gap-3 px-8 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
//           active ? "bg-slate-950 text-white shadow-2xl" : "text-slate-600 hover:text-white"
//         )}
//     >
//       <Icon className="h-4 w-4" style={active ? { color: primaryColor } : {}} /> {label}
//     </Button>
//   );
// }

// function PedagogyCard({ title, value, icon: Icon, primaryColor }: { title: string, value: string, icon: LucideIcon, primaryColor: string }) {
//     return (
//         <Card className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-xl space-y-6">
//             <div className="flex items-center gap-4">
//                 <div className="p-2.5 bg-slate-950 rounded-xl border border-white/5 shadow-inner">
//                     <Icon className="h-4 w-4" style={{ color: primaryColor }} />
//                 </div>
//                 <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h5>
//             </div>
//             <p className="text-lg font-black text-white uppercase italic tracking-tighter leading-relaxed">{value}</p>
//         </Card>
//     );
// }


// "use client";

// import { useState, useEffect, useTransition } from "react";
// import ReactMarkdown from "react-markdown";
// import Image from "next/image";
// import { 
//     Sparkles, ImageIcon, FileText, HelpCircle, Zap, 
//     Loader2, Edit3, Save, Layout, ListChecks, 
//     GraduationCap, History,  type LucideIcon 
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import { Question, Role } from "@prisma/client";

// // Store & Actions
// import { useTeacherStore } from "@/store/teacherDataStore";
// import { useProfileStore } from "@/store/profileStore";
// import { getErrorMessage } from "@/lib/error-handler";
// import { EnhancedLessonContent, generateTopicContent } from "@/app/actions/ai-generator" 
// import { generateDiagramImage } from "@/app/actions/generate-diagram" 
// import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
// import { publishLesson } from "@/app/actions/lesson.actions"
// import { ScannedQuestionRegistry } from "../scan/scannedQuestionRegistry"
// import { PracticeHub } from "../individual-student/exam/practicehub"

// // ── Types ───────────────────────────────────────────────────────────────────

// interface AILessonPlannerProps {
//   topicId: string;
//   lessonId: string; 
//   topicTitle: string;
//   schoolId: string | null;
//   userId: string;
//   userRole: Role;
//   initialData: EnhancedLessonContent | null;
//   initialScannedQuestions?: Question[]; // Registry nodes from digitized papers
//   mode?: "teacher" | "student";
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * AI SYLLABUS PLANNER & REGISTRY HUB
//  * Rule 18: Semantic Color Tokens (bg-background, bg-card, border-border).
//  * Rule 19: Refined Typography (font-extrabold, tracking-tighter).
//  * Rule 6: Contextual UI for Independent Learners.
//  */
// export function AILessonPlanner({ 
//     topicId, 
//     lessonId, 
//     topicTitle, 
//     schoolId, 
//     userId,
//     userRole,
//     initialData,
//     initialScannedQuestions = [],
//     mode = "teacher" 
// }: AILessonPlannerProps) {
  
//   const { profile } = useProfileStore();
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   // Rule 6: Identity Context logic
//   const canModify = mode === "teacher" && schoolId !== null && userRole !== Role.INDIVIDUAL_LEARNER;
//   const isIndependent = userRole === Role.INDIVIDUAL_LEARNER && schoolId === null;

//   const [activeTab, setActiveTab] = useState<string>("explanation");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isPending, startTransition] = useTransition();
  
//   const [data, setData] = useState<EnhancedLessonContent | null>(initialData);
//   const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});

//   const { setActiveTopic } = useTeacherStore();

//   useEffect(() => {
//     setData(initialData);
//     setIsEditing(false);
//   }, [topicId, initialData]);

//   // ── Handlers ──

//   const handleGenerate = async () => {
//     if (!canModify && !isIndependent) return;

//     setIsGenerating(true);
//     try {
//       const res = await generateTopicContent({ topicId, userId, schoolId, userRole });
//       if (!res.success) {
//         toast.error(res.error ?? "Synthesis failed");
//         return;
//       }
//       toast.success("AI Synthesis Complete. Re-syncing Registry...");
//     } catch (err: unknown) {
//       toast.error(getErrorMessage(err));
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleManualSave = () => {
//     if (!data || !canModify || !schoolId) return;
    
//     startTransition(async () => {
//       try {
//           const res = await publishLesson({ topicId, schoolId, content: data, userId, userRole });
//           if (res.success) {
//             toast.success("Institutional customization synchronized.");
//             setIsEditing(false);
//             setActiveTopic(topicId); 
//           }
//       } catch (err: unknown) {
//           toast.error(getErrorMessage(err));
//       }
//     });
//   };
  
//   const handleGenerateImage = async (index: number, prompt: string) => {
//     if ((!canModify && !isIndependent) || loadingImages[index] || (data?.studentContent.visualAids[index]?.url)) return;
    
//     setLoadingImages(prev => ({ ...prev, [index]: true }));
//     try {
//       const result = await generateDiagramImage({ prompt, schoolId, userId, userRole });
//       if (result.success && result.url) {
//         setData(current => {
//           if (!current) return null;
//           const updated = [...current.studentContent.visualAids];
//           updated[index] = { ...updated[index], url: result.url };
//           return { ...current, studentContent: { ...current.studentContent, visualAids: updated } };
//         });

//         await saveGeneratedImageUrlToLesson({ lessonId, visualAidIndex: index, imageUrl: result.url, userId, userRole, schoolId });
//         toast.success("Visual asset bound to registry.");
//       }
//     } catch (err: unknown) {
//         toast.error(getErrorMessage(err));
//     } finally {
//       setLoadingImages(prev => ({ ...prev, [index]: false }));
//     }
//   };

//   // ── Render States ──

//   if (!data) {
//     return (
//       <div className="py-24 text-center bg-card rounded-[2.5rem] border border-border space-y-8 shadow-2xl">
//         <div 
//             className="h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto border"
//             style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}20` }}
//         >
//           <Sparkles className="h-10 w-10 animate-pulse" style={{ color: primaryColor }} />
//         </div>
//         <div className="space-y-3">
//             <h3 className="text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">Registry Standby</h3>
//             <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest italic">{topicTitle}</p>
//         </div>
//         {(canModify || isIndependent) && (
//           <Button 
//             onClick={handleGenerate} 
//             disabled={isGenerating} 
//             className="text-on-school-primary font-bold px-12 py-8 rounded-2xl text-[10px] tracking-[0.2em] uppercase transition-all shadow-xl"
//             style={{ backgroundColor: primaryColor }}
//           >
//             {isGenerating ? <Loader2 className="animate-spin h-5 w-5" /> : "Initialize Synthesis Engine"}
//           </Button>
//         )}
//       </div>
//     );
//   }

//   return (
//     <Card className="border-border bg-background shadow-2xl overflow-hidden rounded-[2rem] flex flex-col">
//       <CardHeader className="bg-card border-b border-border p-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//           <div className="flex-1 min-w-0">
//              <div className="flex items-center gap-4 mb-2">
//                 <div className="p-2 bg-background border border-border rounded-xl">
//                     <Layout className="h-5 w-5" style={{ color: primaryColor }} />
//                 </div>
//                 <CardTitle className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter truncate leading-none">
//                     {data.studentContent.title}
//                 </CardTitle>
//                 <Badge variant="outline" className="text-[9px] font-black uppercase border-border text-muted-foreground">
//                     Level {data.metadata.difficultyLevel}
//                 </Badge>
//              </div>
//              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.3em] ml-12">{topicTitle}</p>
//           </div>
          
//           {canModify && (
//             <div className="flex items-center gap-3 shrink-0">
//               {!isEditing ? (
//                   <Button variant="outline" onClick={() => setIsEditing(true)} className="border-border text-muted-foreground rounded-xl text-[10px] font-bold uppercase tracking-widest px-6 h-12">
//                       <Edit3 className="h-4 w-4 mr-2" /> Modify Node
//                   </Button>
//               ) : (
//                   <div className="flex gap-2">
//                       <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Cancel</Button>
//                       <Button 
//                         onClick={handleManualSave} 
//                         disabled={isPending} 
//                         className="text-on-school-primary font-bold rounded-xl px-8 h-12 text-[10px] uppercase tracking-widest shadow-xl"
//                         style={{ backgroundColor: primaryColor }}
//                       >
//                           {isPending ? <Loader2 className="animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Persist Logic</>}
//                       </Button>
//                   </div>
//               )}
//             </div>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-8 flex-1 bg-surface">
//         {/* TABS SELECTOR */}
//         <div className="flex flex-wrap gap-2 mb-10 bg-card p-1.5 rounded-2xl w-fit border border-border shadow-inner">
//             <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Notes" primaryColor={primaryColor} />
//             <TabButton active={activeTab === "syllabus"} onClick={() => setActiveTab("syllabus")} icon={ListChecks} label="Syllabus" primaryColor={primaryColor} />
//             <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visuals" primaryColor={primaryColor} />
//             <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quiz" primaryColor={primaryColor} />
//             <TabButton active={activeTab === "past-papers"} onClick={() => setActiveTab("past-papers")} icon={History} label="Past Papers" primaryColor={primaryColor} />
            
//             {isIndependent && (
//                 <TabButton active={activeTab === "interactive-quiz"} onClick={() => setActiveTab("interactive-quiz")} icon={Zap} label="Practice Hub" primaryColor={primaryColor} />
//             )}
//         </div>

//         <div className="min-h-[500px]">
//             {/* ── NOTES VIEW ── */}
//             {activeTab === "explanation" && (
//                 <div className="space-y-6">
//                     {isEditing ? (
//                         <textarea 
//                             className="w-full h-[600px] bg-card border border-border rounded-[2rem] p-10 text-foreground outline-none font-medium text-lg leading-relaxed shadow-inner"
//                             value={data.studentContent.explanation}
//                             onChange={(e) => setData({...data, studentContent: {...data.studentContent, explanation: e.target.value}})}
//                         />
//                     ) : (
//                         <div className="prose prose-invert max-w-none animate-in fade-in duration-500 bg-card p-10 rounded-[2.5rem] border border-border shadow-xl">
//                             <ReactMarkdown
//                                 components={{
//                                     h1: ({ ...props }) => <h1 className="text-3xl font-extrabold text-foreground uppercase italic border-b border-border pb-6 mb-8" {...props} />,
//                                     h2: ({ ...props }) => <h2 className="text-xl font-bold uppercase tracking-tight mt-12 mb-6" style={{ color: primaryColor }} {...props} />,
//                                     p: ({ ...props }) => <p className="text-muted-foreground leading-loose mb-6 text-lg font-medium" {...props} />,
//                                     li: ({ ...props }) => <li className="text-muted-foreground mb-3 font-medium" {...props} />,
//                                 }}
//                             >
//                                 {data.studentContent.explanation}
//                             </ReactMarkdown>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* ── SYLLABUS VIEW ── */}
//             {activeTab === "syllabus" && (
//                 <div className="space-y-10 animate-in fade-in duration-500">
//                     <Card className="bg-card border-border p-10 rounded-[2.5rem] shadow-xl">
//                         <h4 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-3" style={{ color: primaryColor }}>
//                             <GraduationCap className="h-5 w-5" /> Learning Objectives
//                         </h4>
//                         <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                             {data.studentContent.learningObjectives.map((obj, i) => (
//                                 <li key={i} className="flex items-start gap-4 text-foreground text-sm font-bold italic uppercase tracking-tight">
//                                     <span className="opacity-20" style={{ color: primaryColor }}>0{i+1}.</span> {obj}
//                                 </li>
//                             ))}
//                         </ul>
//                     </Card>

//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         <section className="space-y-4">
//                             <h4 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-6 italic">Registry Summary</h4>
//                             <div className="bg-card p-10 rounded-[2.5rem] border border-border text-muted-foreground text-sm leading-loose italic font-medium shadow-inner">
//                                 {data.studentContent.summary}
//                             </div>
//                         </section>

//                         <section className="space-y-4">
//                             <h4 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-6 italic">Keyword Index</h4>
//                             <div className="flex flex-wrap gap-3">
//                                 {data.studentContent.vocabulary.map((word, i) => (
//                                     <Badge key={i} variant="outline" className="px-5 py-2.5 border-border bg-card text-foreground rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-sm">
//                                         {word}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         </section>
//                     </div>
//                 </div>
//             )}

//             {/* ── PAST PAPERS VIEW ── */}
//             {activeTab === "past-papers" && (
//                 <div className="animate-in fade-in duration-500">
//                     <div className="mb-8 p-6 bg-school-primary/5 border border-school-primary/10 rounded-2xl flex items-center gap-4">
//                         <History className="h-5 w-5 text-school-primary" />
//                         <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">
//                             Displaying AI-digitized nodes from historical examination papers matching this topic context.
//                         </p>
//                     </div>
//                     <ScannedQuestionRegistry 
//                         questions={initialScannedQuestions.filter(q => q.topicId === topicId)}
//                         userRole={userRole}
//                     />
//                 </div>
//             )}

//             {/* ── INTERACTIVE PRACTICE (Tier 3) ── */}
//             {activeTab === "interactive-quiz" && isIndependent && (
//                 <PracticeHub 
//                     userId={userId} 
//                     gradeSubjectId={data.metadata.topicContext} 
//                 />
//             )}

//             {/* ── STANDARD AI QUIZ ── */}
//             {activeTab === "quiz" && (
//                 <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
//                     {data.studentContent.quiz.map((q, i) => (
//                         <Card key={i} className="p-10 bg-card border-border rounded-[2.5rem] space-y-10 shadow-xl">
//                             <div className="flex items-start gap-6">
//                                 <span className="text-3xl font-black italic opacity-10" style={{ color: primaryColor }}>0{i+1}</span>
//                                 <p className="text-xl font-bold text-foreground leading-snug tracking-tight italic uppercase">{q.question}</p>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-14">
//                                 {q.options.map(opt => (
//                                     <div key={opt} className={cn(
//                                         "p-6 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all",
//                                         opt === q.answer ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-500 shadow-lg" : "border-border bg-background text-muted-foreground"
//                                     )}>
//                                         {opt}
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="pt-8 border-t border-border px-14 flex items-center gap-3">
//                                 <div className="h-1 w-1 rounded-full bg-slate-700" />
//                                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Rationale: {q.explanation}</p>
//                             </div>
//                         </Card>
//                     ))}
//                 </div>
//             )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// /**
//  * ── SUB-COMPONENT: TAB BUTTON ──
//  */
// function TabButton({ active, onClick, icon: Icon, label, primaryColor }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string, primaryColor: string }) {
//   return (
//     <Button 
//         variant="ghost" 
//         onClick={onClick} 
//         className={cn(
//           "gap-3 px-8 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
//           active ? "bg-background text-foreground shadow-lg border border-border" : "text-muted-foreground hover:text-foreground"
//         )}
//     >
//       <Icon className="h-4 w-4" style={active ? { color: primaryColor } : {}} /> {label}
//     </Button>
//   );
// }



// "use client";

// import { useState, useEffect, useTransition } from "react";
// import ReactMarkdown from "react-markdown";
// import Image from "next/image";
// import { 
//     Sparkles, ImageIcon, FileText, HelpCircle, Zap, 
//     Loader2, Edit3, Save, Layout, ListChecks, 
//     GraduationCap, History, type LucideIcon, ChevronRight
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import { Question, Role } from "@prisma/client";

// // Store & Actions
// import { useTeacherStore } from "@/store/teacherDataStore";
// import { useProfileStore } from "@/store/profileStore";
// import { getErrorMessage } from "@/lib/error-handler";
// import { EnhancedLessonContent, generateTopicContent } from "@/app/actions/ai-generator" 
// import { generateDiagramImage } from "@/app/actions/generate-diagram" 
// import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
// import { publishLesson } from "@/app/actions/lesson.actions"
// import { ScannedQuestionRegistry } from "../scan/scannedQuestionRegistry"
// import { PracticeHub } from "../individual-student/exam/practicehub"
// // ── Types ───────────────────────────────────────────────────────────────────

// interface AILessonPlannerProps {
//   topicId: string;
//   lessonId: string; 
//   topicTitle: string;
//   schoolId: string | null;
//   userId: string;
//   userRole: Role;
//   initialData: EnhancedLessonContent | null;
//   initialScannedQuestions?: Question[]; 
//   mode?: "teacher" | "student";
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * AI SYLLABUS PLANNER & REGISTRY HUB
//  * Rule 18: Semantic Color Tokens (bg-background, bg-card, border-border).
//  * Rule 19: Refined Typography (font-extrabold, font-semibold).
//  * Rule 20: Responsive padding and grid distribution.
//  */
// export function AILessonPlanner({ 
//     topicId, 
//     lessonId, 
//     topicTitle, 
//     schoolId, 
//     userId,
//     userRole,
//     initialData,
//     initialScannedQuestions = [],
//     mode = "teacher" 
// }: AILessonPlannerProps) {
  
//   const { profile } = useProfileStore();
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   // Rule 6: Identity Context logic
//   const canModify = mode === "teacher" && schoolId !== null && userRole !== Role.INDIVIDUAL_LEARNER;
//   const isIndependent = userRole === Role.INDIVIDUAL_LEARNER && schoolId === null;

//   const [activeTab, setActiveTab] = useState<string>("explanation");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isPending, startTransition] = useTransition();
  
//   const [data, setData] = useState<EnhancedLessonContent | null>(initialData);
//   const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});

//   const { setActiveTopic } = useTeacherStore();

//   useEffect(() => {
//     setData(initialData);
//     setIsEditing(false);
//   }, [topicId, initialData]);

//   // ── Handlers ──

//   const handleGenerate = async () => {
//     if (!canModify && !isIndependent) return;

//     setIsGenerating(true);
//     try {
//       const res = await generateTopicContent({ topicId, userId, schoolId, userRole });
//       if (!res.success) {
//         toast.error(res.error ?? "Synthesis failed");
//         return;
//       }
//       toast.success("AI Synthesis Complete. Re-syncing Registry...");
//     } catch (err: unknown) {
//       toast.error(getErrorMessage(err));
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleManualSave = () => {
//     if (!data || !canModify || !schoolId) return;
    
//     startTransition(async () => {
//       try {
//           const res = await publishLesson({ topicId, schoolId, content: data, userId, userRole });
//           if (res.success) {
//             toast.success("Institutional customization synchronized.");
//             setIsEditing(false);
//             setActiveTopic(topicId); 
//           }
//       } catch (err: unknown) {
//           toast.error(getErrorMessage(err));
//       }
//     });
//   };
  
//   const handleGenerateImage = async (index: number, prompt: string) => {
//     if ((!canModify && !isIndependent) || loadingImages[index] || (data?.studentContent.visualAids[index]?.url)) return;
    
//     setLoadingImages(prev => ({ ...prev, [index]: true }));
//     try {
//       const result = await generateDiagramImage({ prompt, schoolId, userId, userRole });
//       if (result.success && result.url) {
//         setData(current => {
//           if (!current) return null;
//           const updated = [...current.studentContent.visualAids];
//           updated[index] = { ...updated[index], url: result.url };
//           return { ...current, studentContent: { ...current.studentContent, visualAids: updated } };
//         });

//         await saveGeneratedImageUrlToLesson({ lessonId, visualAidIndex: index, imageUrl: result.url, userId, userRole, schoolId });
//         toast.success("Visual asset bound to registry.");
//       }
//     } catch (err: unknown) {
//         toast.error(getErrorMessage(err));
//     } finally {
//       setLoadingImages(prev => ({ ...prev, [index]: false }));
//     }
//   };

//   // ── Render States ──

//   if (!data) {
//     return (
//       <div className="py-24 text-center bg-card rounded-[2rem] border border-border space-y-8 shadow-2xl">
//         <div 
//             className="h-24 w-24 rounded-2xl flex items-center justify-center mx-auto border border-border bg-background shadow-inner"
//         >
//           <Sparkles className="h-10 w-10 animate-pulse" style={{ color: primaryColor }} />
//         </div>
//         <div className="space-y-3 px-6">
//             <h3 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">Registry Standby</h3>
//             <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest italic">{topicTitle}</p>
//         </div>
//         {(canModify || isIndependent) && (
//           <Button 
//             onClick={handleGenerate} 
//             disabled={isGenerating} 
//             className="text-on-school-primary font-bold px-12 py-8 rounded-2xl text-[10px] tracking-[0.2em] uppercase transition-all shadow-xl"
//             style={{ backgroundColor: primaryColor }}
//           >
//             {isGenerating ? <Loader2 className="animate-spin h-5 w-5" /> : "Initialize Synthesis Engine"}
//           </Button>
//         )}
//       </div>
//     );
//   }

//   return (
//     <Card className="border-border bg-background shadow-2xl overflow-hidden rounded-[2rem] flex flex-col">
//       <CardHeader className="bg-card border-b border-border p-6 md:p-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//           <div className="flex-1 min-w-0">
//              <div className="flex items-center gap-4 mb-2">
//                 <div className="p-2.5 bg-background border border-border rounded-xl shadow-inner">
//                     <Layout className="h-5 w-5" style={{ color: primaryColor }} />
//                 </div>
//                 <CardTitle className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter truncate leading-none">
//                     {data.studentContent.title}
//                 </CardTitle>
//                 <Badge variant="outline" className="text-[9px] font-bold uppercase border-border text-muted-foreground">
//                     LEVEL {data.metadata.difficultyLevel}
//                 </Badge>
//              </div>
//              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.3em] ml-14">{topicTitle}</p>
//           </div>
          
//           {canModify && (
//             <div className="flex items-center gap-3 shrink-0">
//               {!isEditing ? (
//                   <Button variant="outline" onClick={() => setIsEditing(true)} className="border-border bg-background text-muted-foreground rounded-xl text-[10px] font-bold uppercase tracking-widest px-6 h-12 hover:text-foreground">
//                       <Edit3 className="h-4 w-4 mr-2" /> Modify Node
//                   </Button>
//               ) : (
//                   <div className="flex gap-2">
//                       <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest px-4 h-12">Cancel</Button>
//                       <Button 
//                         onClick={handleManualSave} 
//                         disabled={isPending} 
//                         className="text-on-school-primary font-bold rounded-xl px-8 h-12 text-[10px] uppercase tracking-widest shadow-xl"
//                         style={{ backgroundColor: primaryColor }}
//                       >
//                           {isPending ? <Loader2 className="animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Persist Logic</>}
//                       </Button>
//                   </div>
//               )}
//             </div>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-6 md:p-10 flex-1 bg-surface">
//         {/* TABS SELECTOR */}
//         <div className="flex flex-wrap gap-2 mb-10 bg-card p-1.5 rounded-2xl w-fit border border-border shadow-inner">
//             <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Notes" primaryColor={primaryColor} />
//             <TabButton active={activeTab === "syllabus"} onClick={() => setActiveTab("syllabus")} icon={ListChecks} label="Syllabus" primaryColor={primaryColor} />
//             <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visuals" primaryColor={primaryColor} />
//             <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quiz" primaryColor={primaryColor} />
//             <TabButton active={activeTab === "past-papers"} onClick={() => setActiveTab("past-papers")} icon={History} label="Past Papers" primaryColor={primaryColor} />
            
//             {isIndependent && (
//                 <TabButton active={activeTab === "interactive-quiz"} onClick={() => setActiveTab("interactive-quiz")} icon={Zap} label="Practice Hub" primaryColor={primaryColor} />
//             )}
//         </div>

//         <div className="min-h-[500px]">
//             {/* ── NOTES VIEW ── */}
//             {activeTab === "explanation" && (
//                 <div className="space-y-6">
//                     {isEditing ? (
//                         <textarea 
//                             className="w-full h-[600px] bg-card border border-border rounded-[2rem] p-10 text-foreground outline-none font-medium text-lg leading-relaxed shadow-inner"
//                             value={data.studentContent.explanation}
//                             onChange={(e) => setData({...data, studentContent: {...data.studentContent, explanation: e.target.value}})}
//                         />
//                     ) : (
//                         <div className="prose prose-invert max-w-none animate-in fade-in duration-500 bg-card p-8 md:p-12 rounded-[2.5rem] border border-border shadow-2xl">
//                             <ReactMarkdown
//                                 components={{
//                                     h1: ({ ...props }) => <h1 className="text-3xl font-extrabold text-foreground uppercase italic border-b border-border pb-6 mb-8" {...props} />,
//                                     h2: ({ ...props }) => <h2 className="text-xl font-bold uppercase tracking-tight mt-12 mb-6" style={{ color: primaryColor }} {...props} />,
//                                     p: ({ ...props }) => <p className="text-muted-foreground leading-loose mb-6 text-lg font-medium" {...props} />,
//                                     li: ({ ...props }) => <li className="text-muted-foreground mb-3 font-medium" {...props} />,
//                                 }}
//                             >
//                                 {data.studentContent.explanation}
//                             </ReactMarkdown>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* ── SYLLABUS VIEW ── */}
//             {activeTab === "syllabus" && (
//                 <div className="space-y-10 animate-in fade-in duration-500">
//                     <Card className="bg-card border-border p-8 md:p-12 rounded-[2.5rem] shadow-xl">
//                         <h4 className="text-xs font-black uppercase tracking-widest mb-10 flex items-center gap-4" style={{ color: primaryColor }}>
//                             <GraduationCap className="h-6 w-6" /> Learning Objectives
//                         </h4>
//                         <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                             {data.studentContent.learningObjectives.map((obj, i) => (
//                                 <li key={i} className="flex items-start gap-4 text-foreground text-sm font-bold italic uppercase tracking-tight">
//                                     <span className="opacity-30" style={{ color: primaryColor }}>0{i+1}.</span> {obj}
//                                 </li>
//                             ))}
//                         </ul>
//                     </Card>

//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//                         <section className="space-y-4">
//                             <h4 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-8 italic">Registry Summary</h4>
//                             <div className="bg-card p-10 rounded-[2.5rem] border border-border text-muted-foreground text-sm leading-loose italic font-medium shadow-inner">
//                                 {data.studentContent.summary}
//                             </div>
//                         </section>

//                         <section className="space-y-4">
//                             <h4 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-8 italic">Keyword Index</h4>
//                             <div className="flex flex-wrap gap-3">
//                                 {data.studentContent.vocabulary.map((word, i) => (
//                                     <Badge key={i} variant="outline" className="px-5 py-3 border-border bg-background text-foreground rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-sm">
//                                         {word}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         </section>
//                     </div>
//                 </div>
//             )}

//             {/* ── VISUALS VIEW ── */}
//             {activeTab === "visuals" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
//                     {data.studentContent.visualAids.map((aid, idx) => (
//                         <Card key={idx} className="bg-card border-border rounded-[2.5rem] overflow-hidden group shadow-2xl">
//                             <div className="p-8 border-b border-border bg-background/50">
//                                 <h4 className="text-sm font-extrabold text-foreground uppercase italic">{aid.title}</h4>
//                                 <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest mt-1">{aid.description}</p>
//                             </div>
//                             <div className="relative aspect-video flex flex-col items-center justify-center p-4 bg-background shadow-inner">
//                                 {aid.url ? (
//                                     <Image src={aid.url} alt={aid.title} fill className="object-cover opacity-60 transition-opacity group-hover:opacity-100" unoptimized />
//                                 ) : (
//                                     <div className="text-center space-y-6">
//                                         <ImageIcon className="h-12 w-12 text-slate-800 mx-auto" />
//                                         {(canModify || isIndependent) && (
//                                             <Button 
//                                                 onClick={() => handleGenerateImage(idx, aid.imagePrompt)} 
//                                                 disabled={loadingImages[idx]} 
//                                                 className="bg-card border border-border text-foreground font-black rounded-xl text-[9px] uppercase tracking-widest h-12 px-8 hover:bg-school-primary hover:text-slate-950 transition-all"
//                                             >
//                                                 {loadingImages[idx] ? <Loader2 className="animate-spin h-4 w-4" /> : "Synthesize Asset"}
//                                             </Button>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </Card>
//                     ))}
//                 </div>
//             )}

//             {/* ── PAST PAPERS VIEW ── */}
//             {activeTab === "past-papers" && (
//                 <div className="animate-in fade-in duration-500 space-y-10">
//                     <div className="p-8 bg-school-primary/5 border border-school-primary/20 rounded-[2.5rem] flex items-center gap-6 shadow-xl">
//                         <History className="h-8 w-8 text-school-primary" />
//                         <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic leading-relaxed">
//                             Displaying AI-digitized nodes from historical examination papers matching this topic context.
//                         </p>
//                     </div>
//                     {/* ✅ FIXED: Map Prisma 'Question[]' to component 'ScannedQuestion[]' */}
//                     <ScannedQuestionRegistry 
//                         questions={initialScannedQuestions
//                             .filter(q => q.topicId === topicId)
//                             .map(q => ({
//                                 text: q.text,
//                                 answer: q.correctAnswer,
//                                 explanation: q.explanation || "Registry rationale pending.",
//                                 marks: q.points,
//                                 year: q.year || undefined,
//                                 examBody: q.examBody || undefined
//                             }))
//                         }
//                         userRole={userRole}
//                     />
//                 </div>
//             )}

//             {/* ── INTERACTIVE PRACTICE (Tier 3) ── */}
//             {activeTab === "interactive-quiz" && isIndependent && (
//                 <PracticeHub 
//                     userId={userId} 
//                     gradeSubjectId={data.metadata.topicContext} 
//                 />
//             )}

//             {/* ── STANDARD AI QUIZ ── */}
//             {activeTab === "quiz" && (
//                 <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
//                     {data.studentContent.quiz.map((q, i) => (
//                         <Card key={i} className="p-8 md:p-12 bg-card border-border rounded-[2.5rem] space-y-10 shadow-2xl">
//                             <div className="flex items-start gap-6">
//                                 <span className="text-4xl font-black italic opacity-10" style={{ color: primaryColor }}>0{i+1}</span>
//                                 <p className="text-xl font-bold text-foreground leading-snug tracking-tight italic uppercase">{q.question}</p>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-14">
//                                 {q.options.map(opt => (
//                                     <div key={opt} className={cn(
//                                         "p-6 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all",
//                                         opt === q.answer ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-500 shadow-lg" : "border-border bg-background text-muted-foreground"
//                                     )}>
//                                         {opt}
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="pt-8 border-t border-border px-14 flex items-center justify-between">
//                                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Rationale: {q.explanation}</p>
//                                 <ChevronRight className="h-4 w-4 text-slate-800" />
//                             </div>
//                         </Card>
//                     ))}
//                 </div>
//             )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// /**
//  * ── INTERNAL UI HELPER: TAB BUTTON ──
//  */
// function TabButton({ active, onClick, icon: Icon, label, primaryColor }: { active: boolean, onClick: () => void, icon: LucideIcon | any, label: string, primaryColor: string }) {
//   return (
//     <Button 
//         variant="ghost" 
//         onClick={onClick} 
//         className={cn(
//           "gap-3 px-8 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
//           active ? "bg-background text-foreground shadow-lg border border-border" : "text-muted-foreground hover:text-foreground"
//         )}
//     >
//       <Icon className="h-4 w-4" style={active ? { color: primaryColor } : {}} /> {label}
//     </Button>
//   );
// }


// "use client";

// import React, { useState, useEffect, useTransition } from "react";
// import ReactMarkdown from "react-markdown";
// import Image from "next/image";
// import { 
//     Sparkles, ImageIcon, FileText, HelpCircle, Zap, 
//     Loader2, Edit3, Save, Layout, ListChecks, 
//     GraduationCap, History, type LucideIcon, ChevronRight,
//     ShieldCheck, Target, Box
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import { Question, Role } from "@prisma/client";

// // Store & Actions
// import { useTeacherStore } from "@/store/teacherDataStore";
// import { useProfileStore } from "@/store/profileStore";
// import { getErrorMessage } from "@/lib/error-handler";
// import { type EnhancedLessonContent, generateTopicContent } from "@/app/actions/ai-generator" 
// import { generateDiagramImage } from "@/app/actions/generate-diagram" 
// import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
// import { publishLesson } from "@/app/actions/lesson.actions"
// import { ScannedQuestionRegistry, type ScannedQuestion } from "../scan/scannedQuestionRegistry"
// import { PracticeHub } from "../individual-student/exam/practicehub"

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface AILessonPlannerProps {
//   topicId: string;
//   lessonId: string; 
//   topicTitle: string;
//   schoolId: string | null;
//   userId: string;
//   userRole: Role;
//   initialData: EnhancedLessonContent | null;
//   initialScannedQuestions?: Question[]; 
//   mode?: "teacher" | "student";
// }

// /**
//  * AI SYLLABUS PLANNER & REGISTRY HUB
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function AILessonPlanner({ 
//     topicId, 
//     lessonId, 
//     topicTitle, 
//     schoolId, 
//     userId,
//     userRole,
//     initialData,
//     initialScannedQuestions = [],
//     mode = "teacher" 
// }: AILessonPlannerProps) {
//   const { profile } = useProfileStore();
  
//   const canModify = mode === "teacher" && schoolId !== null && userRole !== Role.INDIVIDUAL_LEARNER;
//   const isIndependent = userRole === Role.INDIVIDUAL_LEARNER && schoolId === null;

//   const [activeTab, setActiveTab] = useState<string>("explanation");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isPending, startTransition] = useTransition();
  
//   const [data, setData] = useState<EnhancedLessonContent | null>(initialData);
//   const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});

//   const { setActiveTopic } = useTeacherStore();

//   useEffect(() => {
//     setData(initialData);
//     setIsEditing(false);
//   }, [topicId, initialData]);

//   // ── Handlers ──

//   const handleGenerate = async () => {
//     if (!canModify && !isIndependent) return;
//     setIsGenerating(true);
//     try {
//       const res = await generateTopicContent({ topicId, userId, schoolId, userRole });
//       if (!res.success) {
//         toast.error("Synthesis protocol failed.");
//         return;
//       }
//       toast.success("AI Synthesis Complete. Synchronizing Registry...");
//     } catch (err: unknown) {
//       toast.error(getErrorMessage(err));
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleManualSave = () => {
//     if (!data || !canModify || !schoolId) return;
//     startTransition(async () => {
//       try {
//           const res = await publishLesson({ topicId, schoolId, content: data, userId, userRole });
//           if (res.success) {
//             toast.success("Institutional Hub synchronized.");
//             setIsEditing(false);
//             setActiveTopic(topicId); 
//           }
//       } catch (err: unknown) {
//           toast.error(getErrorMessage(err));
//       }
//     });
//   };

//   // ── Render States ──

//   if (!data) {
//     return (
//       <div className="py-24 text-center bg-card rounded-[2rem] border border-border space-y-10 shadow-2xl animate-in fade-in duration-700">
//         <div className="h-24 w-24 rounded-2xl flex items-center justify-center mx-auto border border-school-primary-200 bg-school-primary-50 shadow-inner">
//           <Sparkles className="h-10 w-10 text-school-primary animate-pulse" />
//         </div>
//         <div className="space-y-4 px-6">
//             <h3 className="text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">Registry Standby</h3>
//             <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest italic">{topicTitle}</p>
//         </div>
//         {(canModify || isIndependent) && (
//           <Button 
//             onClick={handleGenerate} 
//             disabled={isGenerating} 
//             className="h-16 px-12 bg-school-primary text-on-school-primary font-extrabold rounded-2xl shadow-xl shadow-school-primary-200 hover:brightness-110 active:scale-95 transition-all text-[11px] uppercase tracking-widest"
//           >
//             {isGenerating ? <Loader2 className="animate-spin h-5 w-5" /> : "Initialize Synthesis Hub"}
//           </Button>
//         )}
//       </div>
//     );
//   }

//   return (
//     <Card className="border-border bg-background shadow-2xl overflow-hidden rounded-[2rem] flex flex-col animate-in fade-in duration-700">
//       <CardHeader className="bg-surface/50 border-b border-border p-6 md:p-10 backdrop-blur-md">
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
//           <div className="flex-1 min-w-0">
//              <div className="flex flex-wrap items-center gap-4 mb-3">
//                 <div className="p-3 bg-school-primary-50 border border-school-primary-200 rounded-xl shadow-sm">
//                     <Box className="h-5 w-5 text-school-primary" />
//                 </div>
//                 <CardTitle className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter truncate leading-none">
//                     {data.studentContent.title}
//                 </CardTitle>
//                 <Badge variant="outline" className="bg-surface border-border text-muted-foreground text-[10px] font-extrabold px-3 py-1 rounded-lg">
//                     HUB LEVEL {data.metadata.difficultyLevel}
//                 </Badge>
//              </div>
//              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 lg:ml-16 italic opacity-60">Syllabus Path: {topicTitle}</p>
//           </div>
          
//           {canModify && (
//             <div className="flex items-center gap-3 shrink-0">
//               {!isEditing ? (
//                   <Button variant="outline" onClick={() => setIsEditing(true)} className="h-12 px-6 rounded-xl border-border bg-surface text-muted-foreground hover:text-foreground font-extrabold text-[10px] uppercase tracking-widest transition-all shadow-sm">
//                       <Edit3 className="h-4 w-4 mr-2" /> Modify Module
//                   </Button>
//               ) : (
//                   <div className="flex gap-3">
//                       <button onClick={() => setIsEditing(false)} className="px-6 h-12 rounded-xl text-muted-foreground hover:text-foreground text-[10px] font-extrabold uppercase tracking-widest transition-all">Discard</button>
//                       <Button 
//                         onClick={handleManualSave} 
//                         disabled={isPending} 
//                         className="h-12 px-8 bg-school-primary text-on-school-primary font-extrabold rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-school-primary-200 hover:brightness-110 active:scale-95 transition-all"
//                       >
//                           {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save className="h-4 w-4 mr-2" /> Persist Hub</>}
//                       </Button>
//                   </div>
//               )}
//             </div>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-6 md:p-10 flex-1">
//         {/* TABS SELECTOR */}
//         <div className="flex overflow-x-auto pb-4 lg:pb-0 scrollbar-hide mb-10">
//             <div className="flex gap-2 bg-surface p-1.5 rounded-2xl border border-border shadow-inner whitespace-nowrap">
//                 <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Study Notes" />
//                 <TabButton active={activeTab === "syllabus"} onClick={() => setActiveTab("syllabus")} icon={ListChecks} label="Roadmap" />
//                 <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visual Hub" />
//                 <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Module Quiz" />
//                 <TabButton active={activeTab === "past-papers"} onClick={() => setActiveTab("past-papers")} icon={History} label="Archive Ledger" />
                
//                 {isIndependent && (
//                     <TabButton active={activeTab === "interactive-quiz"} onClick={() => setActiveTab("interactive-quiz")} icon={Zap} label="Practice Hub" />
//                 )}
//             </div>
//         </div>

//         <div className="min-h-[500px]">
//             {/* ── ARCHIVE LEDGER VIEW (Rule 15/21) ── */}
//             {activeTab === "past-papers" && (
//                 <div className="animate-in fade-in duration-500 space-y-10">
//                     <div className="p-8 bg-school-primary-50 border border-school-primary-200 rounded-[2.5rem] flex items-center gap-6 shadow-xl">
//                         <div className="p-3 bg-school-primary rounded-xl text-on-school-primary shadow-lg">
//                           <History className="h-6 w-6" />
//                         </div>
//                         <p className="text-xs font-bold uppercase tracking-widest text-school-primary italic leading-relaxed">
//                             Synchronizing AI-digitized Hubs from historical examination ledgers matching this syllabus module.
//                         </p>
//                     </div>
                    
//                     {/* ✅ RESOLVED TS2322: Normalizing Prisma Nulls to ScannedQuestion Registry Expectations */}
//                     <ScannedQuestionRegistry 
//                         questions={initialScannedQuestions
//                             .filter(q => q.topicId === topicId)
//                             .map(q => ({
//                                 text: q.text,
//                                 answer: q.correctAnswer, // Hub mapping
//                                 explanation: q.explanation ?? "Registry rationale pending sync.", // Safe mandatory string
//                                 marks: q.points,
//                                 year: q.year ?? undefined, // Type normalization
//                                 examBody: q.examBody ?? undefined // Type normalization
//                             }))
//                         }
//                         userRole={userRole}
//                     />
//                 </div>
//             )}

//             {/* Other activeTab conditions... (Explanation, Syllabus, Visuals, etc.) */}
//             {activeTab === "explanation" && (
//                  <div className="prose prose-invert max-w-none bg-card p-8 md:p-16 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden">
//                     <ReactMarkdown
//                         components={{
//                             h1: ({ ...props }) => <h1 className="text-3xl md:text-4xl font-extrabold text-foreground uppercase italic border-b border-border pb-8 mb-10 tracking-tighter" {...props} />,
//                             h2: ({ ...props }) => <h2 className="text-2xl font-extrabold text-school-primary uppercase italic tracking-tight mt-12 mb-6" {...props} />,
//                             p: ({ ...props }) => <p className="text-foreground/80 leading-loose mb-8 text-base md:text-lg font-medium italic" {...props} />,
//                             strong: ({ ...props }) => <strong className="text-school-primary font-extrabold" {...props} />,
//                         }}
//                     >
//                         {data.studentContent.explanation}
//                     </ReactMarkdown>
//                 </div>
//             )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// // ── Internal Helper: Tab Hub Trigger (Rule 18/21) ──
// function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
//   return (
//     <button 
//         onClick={onClick} 
//         className={cn(
//           "flex items-center gap-3 px-6 h-12 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-95 shadow-sm",
//           active 
//             ? "bg-school-primary text-on-school-primary shadow-school-primary-200" 
//             : "bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-surface"
//         )}
//     >
//       <Icon className={cn("h-4 w-4", active ? "text-on-school-primary" : "text-school-primary/60")} /> 
//       <span className="italic">{label}</span>
//     </button>
//   );
// }


// "use client";

// import React, { useState, useEffect, useTransition } from "react";
// import ReactMarkdown from "react-markdown";
// import Image from "next/image";
// import { 
//     Sparkles, ImageIcon, FileText, HelpCircle, Zap, 
//     Loader2, Edit3, Save, ListChecks,  History, Box
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import { Question, Role } from "@prisma/client";

// // Store & Actions
// import { useTeacherStore } from "@/store/teacherDataStore";
// import { getErrorMessage } from "@/lib/error-handler";
// import { type EnhancedLessonContent, generateTopicContent } from "@/app/actions/ai-generator" 
// import { generateDiagramImage } from "@/app/actions/generate-diagram" 
// import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
// import { publishLesson } from "@/app/actions/lesson.actions"
// import { ScannedQuestionRegistry } from "../scan/scannedQuestionRegistry"


// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface AILessonPlannerProps {
//   topicId: string;
//   lessonId: string; 
//   topicTitle: string;
//   schoolId: string | null;
//   userId: string;
//   userRole: Role;
//   initialData: EnhancedLessonContent | null;
//   initialScannedQuestions?: Question[]; 
//   mode?: "teacher" | "student";
// }

// /**
//  * AI SYLLABUS PLANNER & REGISTRY HUB
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18/21: Semantic Flip & Scale Protocol.
//  * Rule 19: Standardized Geometry [2rem].
//  */
// export function AILessonPlanner({ 
//     topicId, 
//     lessonId, 
//     topicTitle, 
//     schoolId, 
//     userId,
//     userRole,
//     initialData,
//     initialScannedQuestions = [],
//     mode = "teacher" 
// }: AILessonPlannerProps) {
  
//   const canModify = mode === "teacher" && schoolId !== null && userRole !== Role.INDIVIDUAL_LEARNER;
//   const isIndependent = userRole === Role.INDIVIDUAL_LEARNER && schoolId === null;

//   const [activeTab, setActiveTab] = useState<string>("explanation");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isPending, startTransition] = useTransition();
  
//   const [data, setData] = useState<EnhancedLessonContent | null>(initialData);
//   const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});

//   const { setActiveTopic } = useTeacherStore();

//   useEffect(() => {
//     setData(initialData);
//     setIsEditing(false);
//   }, [topicId, initialData]);

//   // ── Handlers (Restored) ──

//   /**
//    * Rule 11: Visual Asset Synthesis Protocol
//    */
//   const handleGenerateImage = async (index: number, prompt: string) => {
//     if ((!canModify && !isIndependent) || loadingImages[index] || (data?.studentContent.visualAids[index]?.url)) return;
    
//     setLoadingImages(prev => ({ ...prev, [index]: true }));
//     try {
//       // Logic Hub Call: Generating Diagram via AI
//       const result = await generateDiagramImage({ prompt, schoolId, userId, userRole });
      
//       if (result.success && result.url) {
//         setData(current => {
//           if (!current) return null;
//           const updated = [...current.studentContent.visualAids];
//           updated[index] = { ...updated[index], url: result.url };
//           return { ...current, studentContent: { ...current.studentContent, visualAids: updated } };
//         });

//         // Rule 11: Permanent Registry Binding
//         await saveGeneratedImageUrlToLesson({ 
//             lessonId, 
//             visualAidIndex: index, 
//             imageUrl: result.url, 
//             userId, 
//             userRole, 
//             schoolId 
//         });
//         toast.success("Visual Hub asset synchronized.");
//       }
//     } catch (err: unknown) {
//       const message = getErrorMessage(err)
//         toast.error(message || "Asset synthesis failure.");
//     } finally {
//       setLoadingImages(prev => ({ ...prev, [index]: false }));
//     }
//   };

//   const handleGenerate = async () => {
//     if (!canModify && !isIndependent) return;
//     setIsGenerating(true);
//     try {
//       const res = await generateTopicContent({ topicId, userId, schoolId, userRole });
//       if (!res.success) throw new Error("Synthesis protocol breach.");
//       toast.success("AI Synthesis Complete. Syncing Hub...");
//     } catch (err: unknown) {
//        const message = getErrorMessage(err)
//       toast.error(message);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleManualSave = () => {
//     if (!data || !canModify || !schoolId) return;
//     startTransition(async () => {
//       try {
//           const res = await publishLesson({ topicId, schoolId, content: data, userId, userRole });
//           if (res.success) {
//             toast.success("Hub logic persisted.");
//             setIsEditing(false);
//             setActiveTopic(topicId); 
//           }
//       } catch (err: unknown) {
//         const message = getErrorMessage(err)
//           toast.error(message || "Registry update failed.");
//       }
//     });
//   };

//   if (!data) {
//     return (
//       <div className="py-24 text-center bg-card rounded-[2rem] border border-border space-y-10 shadow-2xl animate-in fade-in duration-700">
//         <div className="h-24 w-24 rounded-2xl flex items-center justify-center mx-auto border border-school-primary-200 bg-school-primary-50 shadow-inner">
//           <Sparkles className="h-10 w-10 text-school-primary animate-pulse" />
//         </div>
//         <div className="space-y-4 px-6">
//             <h3 className="text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">Registry Standby</h3>
//             <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest italic">{topicTitle}</p>
//         </div>
//         {(canModify || isIndependent) && (
//           <Button 
//             onClick={handleGenerate} 
//             disabled={isGenerating} 
//             className="h-16 px-12 bg-school-primary text-on-school-primary font-extrabold rounded-2xl shadow-xl shadow-school-primary-200 hover:brightness-110 active:scale-95 transition-all text-[11px] uppercase tracking-widest"
//           >
//             {isGenerating ? <Loader2 className="animate-spin h-5 w-5" /> : "Initialize Synthesis Hub"}
//           </Button>
//         )}
//       </div>
//     );
//   }

//   return (
//     <Card className="border-border bg-background shadow-2xl overflow-hidden rounded-[2rem] flex flex-col animate-in fade-in duration-700">
//       <CardHeader className="bg-surface/50 border-b border-border p-6 md:p-10 backdrop-blur-md">
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
//           <div className="flex-1 min-w-0">
//              <div className="flex flex-wrap items-center gap-4 mb-3">
//                 <div className="p-3 bg-school-primary-50 border border-school-primary-200 rounded-xl shadow-sm">
//                     <Box className="h-5 w-5 text-school-primary" />
//                 </div>
//                 <CardTitle className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter truncate leading-none">
//                     {data.studentContent.title}
//                 </CardTitle>
//                 <Badge variant="outline" className="bg-surface border-border text-muted-foreground text-[10px] font-extrabold px-3 py-1 rounded-lg">
//                     HUB LEVEL {data.metadata.difficultyLevel}
//                 </Badge>
//              </div>
//              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 lg:ml-16 italic opacity-60">Syllabus Path: {topicTitle}</p>
//           </div>
          
//           {canModify && (
//             <div className="flex items-center gap-3 shrink-0">
//               {!isEditing ? (
//                   <Button variant="outline" onClick={() => setIsEditing(true)} className="h-12 px-6 rounded-xl border-border bg-surface text-muted-foreground hover:text-foreground font-extrabold text-[10px] uppercase tracking-widest transition-all shadow-sm">
//                       <Edit3 className="h-4 w-4 mr-2" /> Modify Module
//                   </Button>
//               ) : (
//                   <div className="flex gap-3">
//                       <button onClick={() => setIsEditing(false)} className="px-6 h-12 rounded-xl text-muted-foreground hover:text-foreground text-[10px] font-extrabold uppercase tracking-widest transition-all">Discard</button>
//                       <Button 
//                         onClick={handleManualSave} 
//                         disabled={isPending} 
//                         className="h-12 px-8 bg-school-primary text-on-school-primary font-extrabold rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-school-primary-200 hover:brightness-110 active:scale-95 transition-all"
//                       >
//                           {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save className="h-4 w-4 mr-2" /> Persist Hub</>}
//                       </Button>
//                   </div>
//               )}
//             </div>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-6 md:p-10 flex-1">
//         {/* ── TABS SELECTOR (Rule 18/21) ── */}
//         <div className="flex overflow-x-auto pb-4 lg:pb-0 scrollbar-hide mb-10">
//             <div className="flex gap-2 bg-surface p-1.5 rounded-2xl border border-border shadow-inner whitespace-nowrap">
//                 <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Study Notes" />
//                 <TabButton active={activeTab === "syllabus"} onClick={() => setActiveTab("syllabus")} icon={ListChecks} label="Roadmap" />
//                 <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visual Hub" />
//                 <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Module Quiz" />
//                 <TabButton active={activeTab === "past-papers"} onClick={() => setActiveTab("past-papers")} icon={History} label="Archive Ledger" />
                
//                 {isIndependent && (
//                     <TabButton active={activeTab === "interactive-quiz"} onClick={() => setActiveTab("interactive-quiz")} icon={Zap} label="Practice Hub" />
//                 )}
//             </div>
//         </div>

//         <div className="min-h-[500px]">
//             {/* ── VISUALS VIEW (Restored Display Logic) ── */}
//             {activeTab === "visuals" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
//                     {data.studentContent.visualAids.map((aid, idx) => (
//                         <Card key={idx} className="bg-card border-border rounded-[2.5rem] overflow-hidden group shadow-xl hover:border-school-primary-200 transition-all">
//                             <div className="p-8 border-b border-border bg-surface/50">
//                                 <h4 className="text-base font-extrabold text-foreground uppercase italic">{aid.title}</h4>
//                                 <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-2 italic opacity-60">{aid.description}</p>
//                             </div>
//                             <div className="relative aspect-video flex flex-col items-center justify-center p-6 bg-surface shadow-inner">
//                                 {aid.url ? (
//                                     <Image src={aid.url} alt={aid.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" unoptimized />
//                                 ) : (
//                                     <div className="text-center space-y-8 relative z-10">
//                                         <div className="p-4 bg-background border border-border rounded-2xl mx-auto w-fit shadow-md">
//                                           <ImageIcon className="h-12 w-12 text-muted-foreground/20" />
//                                         </div>
//                                         {(canModify || isIndependent) && (
//                                             <Button 
//                                                 onClick={() => handleGenerateImage(idx, aid.imagePrompt)} 
//                                                 disabled={loadingImages[idx]} 
//                                                 className="h-12 px-8 bg-school-primary text-on-school-primary font-extrabold rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-school-primary-200 active:scale-95 transition-all"
//                                             >
//                                                 {loadingImages[idx] ? <Loader2 className="animate-spin h-4 w-4" /> : "Synthesize Hub Asset"}
//                                             </Button>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </Card>
//                     ))}
//                 </div>
//             )}

//             {/* ── ARCHIVE LEDGER VIEW (Rule 15 Corrected) ── */}
//             {activeTab === "past-papers" && (
//                 <div className="animate-in fade-in duration-500 space-y-10">
//                     <div className="p-8 bg-school-primary-50 border border-school-primary-200 rounded-[2.5rem] flex items-center gap-6 shadow-xl">
//                         <div className="p-3 bg-school-primary rounded-xl text-on-school-primary shadow-lg">
//                           <History className="h-6 w-6" />
//                         </div>
//                         <p className="text-xs font-bold uppercase tracking-widest text-school-primary italic leading-relaxed">
//                             Synchronizing AI-digitized Hubs from historical examination ledgers matching this syllabus module.
//                         </p>
//                     </div>
                    
//                     <ScannedQuestionRegistry 
//                         questions={initialScannedQuestions
//                             .filter(q => q.topicId === topicId)
//                             .map(q => ({
//                                 text: q.text,
//                                 answer: q.correctAnswer, 
//                                 explanation: q.explanation ?? "Registry rationale pending sync.", 
//                                 marks: q.points,
//                                 year: q.year ?? undefined, 
//                                 examBody: q.examBody ?? undefined 
//                             }))
//                         }
//                         userRole={userRole}
//                     />
//                 </div>
//             )}

//             {/* Other activeTab conditions (Notes, Syllabus, etc.) */}
//             {activeTab === "explanation" && (
//                  <div className="prose prose-invert max-w-none bg-card p-8 md:p-16 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden">
//                     <ReactMarkdown
//                         components={{
//                             h1: ({ ...props }) => <h1 className="text-3xl md:text-4xl font-extrabold text-foreground uppercase italic border-b border-border pb-8 mb-10 tracking-tighter" {...props} />,
//                             h2: ({ ...props }) => <h2 className="text-2xl font-extrabold text-school-primary uppercase italic tracking-tight mt-12 mb-6" {...props} />,
//                             p: ({ ...props }) => <p className="text-foreground/80 leading-loose mb-8 text-base md:text-lg font-medium italic" {...props} />,
//                             strong: ({ ...props }) => <strong className="text-school-primary font-extrabold" {...props} />,
//                         }}
//                     >
//                         {data.studentContent.explanation}
//                     </ReactMarkdown>
//                 </div>
//             )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// // ── Sub-Component ──
// function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
//   return (
//     <button 
//         onClick={onClick} 
//         className={cn(
//           "flex items-center gap-3 px-6 h-12 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-95 shadow-sm",
//           active 
//             ? "bg-school-primary text-on-school-primary shadow-school-primary-200" 
//             : "bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-surface"
//         )}
//     >
//       <Icon className={cn("h-4 w-4", active ? "text-on-school-primary" : "text-school-primary/60")} /> 
//       <span className="italic">{label}</span>
//     </button>
//   );
// }


"use client";

import React, { useState, useEffect, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { 
    Sparkles, ImageIcon, FileText, HelpCircle,  
    Loader2, Edit3, Save, ListChecks, History, Box,
    ShieldCheck, Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Question, Role } from "@prisma/client";

// Store & Actions
import { useTeacherStore } from "@/store/teacherDataStore";
import { getErrorMessage } from "@/lib/error-handler";
import { type EnhancedLessonContent, generateTopicContent } from "@/app/actions/ai-generator";
import { generateDiagramImage } from "@/app/actions/generate-diagram";
import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action";
import { publishLesson } from "@/app/actions/lesson.actions";
import { ScannedQuestionRegistry, type ScannedQuestion } from "../scan/scannedQuestionRegistry";

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface AILessonPlannerProps {
  topicId: string;
  lessonId: string; 
  topicTitle: string;
  schoolId: string | null;
  userId: string;
  userRole: Role;
  initialData: EnhancedLessonContent | null;
  initialScannedQuestions?: Question[]; 
  mode?: "teacher" | "student";
}

/**
 * AI SYLLABUS PLANNER & REGISTRY HUB
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 15: Zero 'any' types. All interfaces strictly fulfilled.
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 * Rule 23: Explicit Error Protocol via getErrorMessage.
 */
export function AILessonPlanner({ 
    topicId, 
    lessonId, 
    topicTitle, 
    schoolId, 
    userId,
    userRole,
    initialData,
    initialScannedQuestions = [],
    mode = "teacher" 
}: AILessonPlannerProps) {
  
  const canModify = mode === "teacher" && schoolId !== null && userRole !== Role.INDIVIDUAL_LEARNER;
  const isIndependent = userRole === Role.INDIVIDUAL_LEARNER && schoolId === null;

  const [activeTab, setActiveTab] = useState<string>("explanation");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const [data, setData] = useState<EnhancedLessonContent | null>(initialData);
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});

  const { setActiveTopic } = useTeacherStore();

  useEffect(() => {
    setData(initialData);
    setIsEditing(false);
  }, [topicId, initialData]);

  // ── Handlers (Rule 23 Protected) ──

  const handleGenerateImage = async (index: number, prompt: string) => {
    if ((!canModify && !isIndependent) || loadingImages[index] || (data?.studentContent.visualAids[index]?.url)) return;
    
    setLoadingImages(prev => ({ ...prev, [index]: true }));
    try {
      const result = await generateDiagramImage({ prompt, schoolId, userId, userRole });
      
      if (result.success && result.url) {
        setData(current => {
          if (!current) return null;
          const updated = [...current.studentContent.visualAids];
          updated[index] = { ...updated[index], url: result.url };
          return { ...current, studentContent: { ...current.studentContent, visualAids: updated } };
        });

        await saveGeneratedImageUrlToLesson({ 
            lessonId, 
            visualAidIndex: index, 
            imageUrl: result.url, 
            userId, 
            userRole, 
            schoolId 
        });
        toast.success("Visual Hub asset synchronized.");
      }
    } catch (error: unknown) {
        const message = getErrorMessage(error);
        toast.error(message || "Asset synthesis failure.");
    } finally {
      setLoadingImages(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleGenerate = async () => {
    if (!canModify && !isIndependent) return;
    setIsGenerating(true);
    try {
      const res = await generateTopicContent({ topicId, userId, schoolId, userRole });
      if (!res.success) throw new Error("Synthesis protocol breach.");
      toast.success("AI Synthesis Complete. Syncing Hub...");
    } catch (error: unknown) {
       const message = getErrorMessage(error);
       toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualSave = () => {
    if (!data || !canModify || !schoolId) return;
    startTransition(async () => {
      try {
          const res = await publishLesson({ topicId, schoolId, content: data, userId, userRole });
          if (res.success) {
            toast.success("Hub logic persisted.");
            setIsEditing(false);
            setActiveTopic(topicId); 
          }
      } catch (error: unknown) {
          const message = getErrorMessage(error);
          toast.error(message || "Registry update failed.");
      }
    });
  };

  if (!data) {
    return (
      <div className="py-24 text-center bg-card rounded-[2rem] border border-border space-y-10 shadow-2xl animate-in fade-in duration-700">
        <div className="h-24 w-24 rounded-2xl flex items-center justify-center mx-auto border border-school-primary-200 bg-school-primary-50 shadow-inner">
          <Sparkles className="h-10 w-10 text-school-primary animate-pulse" />
        </div>
        <div className="space-y-4 px-6">
            <h3 className="text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">Hub Standby</h3>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest italic">{topicTitle}</p>
        </div>
        {(canModify || isIndependent) && (
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating} 
            className="h-16 px-12 bg-school-primary text-on-school-primary font-extrabold rounded-2xl shadow-xl shadow-school-primary-200 hover:brightness-110 active:scale-95 transition-all text-[11px] uppercase tracking-widest"
          >
            {isGenerating ? <Loader2 className="animate-spin h-5 w-5" /> : "Initialize Synthesis Hub"}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="border-border bg-background shadow-2xl overflow-hidden rounded-[2rem] flex flex-col animate-in fade-in duration-700">
      <CardHeader className="bg-surface/50 border-b border-border p-6 md:p-10 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex-1 min-w-0">
             <div className="flex flex-wrap items-center gap-4 mb-3">
                <div className="p-3 bg-school-primary-50 border border-school-primary-200 rounded-xl shadow-sm">
                    <Box className="h-5 w-5 text-school-primary" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter truncate leading-none">
                    {data.studentContent.title}
                </CardTitle>
                <Badge variant="outline" className="bg-surface border-border text-muted-foreground text-[10px] font-extrabold px-3 py-1 rounded-lg">
                    HUB LEVEL {data.metadata.difficultyLevel}
                </Badge>
             </div>
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 lg:ml-16 italic opacity-60">Syllabus Path: {topicTitle}</p>
          </div>
          
          {canModify && (
            <div className="flex items-center gap-3 shrink-0">
              {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)} className="h-12 px-6 rounded-xl border-border bg-surface text-muted-foreground hover:text-foreground font-extrabold text-[10px] uppercase tracking-widest transition-all shadow-sm">
                      <Edit3 className="h-4 w-4 mr-2" /> Modify Module
                  </Button>
              ) : (
                  <div className="flex gap-3">
                      <button onClick={() => setIsEditing(false)} className="px-6 h-12 rounded-xl text-muted-foreground hover:text-foreground text-[10px] font-extrabold uppercase tracking-widest transition-all">Discard</button>
                      <Button 
                        onClick={handleManualSave} 
                        disabled={isPending} 
                        className="h-12 px-8 bg-school-primary text-on-school-primary font-extrabold rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-school-primary-200 hover:brightness-110 active:scale-95 transition-all"
                      >
                          {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save className="h-4 w-4 mr-2" /> Persist Hub</>}
                      </Button>
                  </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 md:p-10 flex-1">
        {/* ── TABS SELECTOR (Rule 18/21) ── */}
        <div className="flex overflow-x-auto pb-4 lg:pb-0 scrollbar-hide mb-10">
            <div className="flex gap-2 bg-surface p-1.5 rounded-2xl border border-border shadow-inner whitespace-nowrap">
                <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Study Notes" />
                <TabButton active={activeTab === "syllabus"} onClick={() => setActiveTab("syllabus")} icon={ListChecks} label="Roadmap" />
                <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visual Hub" />
                <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Module Quiz" />
                <TabButton active={activeTab === "past-papers"} onClick={() => setActiveTab("past-papers")} icon={History} label="Archive Ledger" />
            </div>
        </div>

        <div className="min-h-[500px]">
            {/* ── NOTES VIEW (Rule 11) ── */}
            {activeTab === "explanation" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    {isEditing ? (
                        <textarea 
                            className="w-full h-[600px] bg-surface border border-border rounded-[2rem] p-8 md:p-12 text-foreground outline-none font-medium text-lg md:text-xl leading-relaxed shadow-inner focus:ring-2 focus:ring-school-primary-200"
                            value={data.studentContent.explanation}
                            onChange={(e) => setData({...data, studentContent: {...data.studentContent, explanation: e.target.value}})}
                        />
                    ) : (
                        <div className="prose prose-invert max-w-none bg-card p-8 md:p-16 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-school-primary-50 blur-[100px] opacity-20 pointer-events-none" />
                            <ReactMarkdown
                                components={{
                                    h1: ({ ...props }) => <h1 className="text-3xl md:text-4xl font-extrabold text-foreground uppercase italic border-b border-border pb-8 mb-10 tracking-tighter" {...props} />,
                                    h2: ({ ...props }) => <h2 className="text-2xl font-extrabold text-school-primary uppercase italic tracking-tight mt-12 mb-6" {...props} />,
                                    p: ({ ...props }) => <p className="text-foreground/80 leading-loose mb-8 text-base md:text-lg font-medium italic" {...props} />,
                                    strong: ({ ...props }) => <strong className="text-school-primary font-extrabold" {...props} />,
                                    li: ({ ...props }) => <li className="text-foreground/70 mb-4 font-medium" {...props} />,
                                }}
                            >
                                {data.studentContent.explanation}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            )}

            {/* ── SYLLABUS VIEW (Rule 21) ── */}
            {activeTab === "syllabus" && (
                <div className="space-y-10 animate-in fade-in duration-500">
                    <Card className="bg-card border-border p-8 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 blur-3xl opacity-40" />
                        <h4 className="text-sm font-extrabold uppercase tracking-widest mb-10 flex items-center gap-4 text-school-primary italic relative z-10">
                            <Target className="h-6 w-6" /> Hub Objectives
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            {data.studentContent.learningObjectives.map((obj, i) => (
                                <li key={i} className="flex items-start gap-5 text-foreground text-sm font-bold italic uppercase tracking-tight group">
                                    <span className="h-6 w-6 rounded-lg bg-surface border border-border flex items-center justify-center text-[10px] font-extrabold text-school-primary shadow-sm tabular-nums group-hover:bg-school-primary group-hover:text-on-school-primary transition-all">0{i+1}</span> 
                                    <span className="pt-0.5">{obj}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 ml-6">
                                <FileText className="h-4 w-4 text-school-primary opacity-40" />
                                <h4 className="text-muted-foreground text-[10px] font-extrabold uppercase tracking-widest italic">Registry Summary</h4>
                            </div>
                            <div className="bg-surface p-10 rounded-[2.5rem] border border-border text-foreground/70 text-sm md:text-base leading-relaxed italic font-medium shadow-inner">
                                {data.studentContent.summary}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-3 ml-6">
                                <ShieldCheck className="h-4 w-4 text-school-primary opacity-40" />
                                <h4 className="text-muted-foreground text-[10px] font-extrabold uppercase tracking-widest italic">Keyword Index</h4>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {data.studentContent.vocabulary.map((word, i) => (
                                    <Badge key={i} variant="outline" className="px-5 py-3 border-border bg-card text-foreground rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-sm hover:border-school-primary-200 transition-colors">
                                        {word}
                                    </Badge>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            )}

            {/* ── VISUALS VIEW (Rule 21) ── */}
            {activeTab === "visuals" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
                    {data.studentContent.visualAids.map((aid, idx) => (
                        <Card key={idx} className="bg-card border-border rounded-[2rem] overflow-hidden group shadow-xl hover:border-school-primary-200 transition-all">
                            <div className="p-8 border-b border-border bg-surface/50">
                                <h4 className="text-base font-extrabold text-foreground uppercase italic">{aid.title}</h4>
                                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-2 italic opacity-60">{aid.description}</p>
                            </div>
                            <div className="relative aspect-video flex flex-col items-center justify-center p-6 bg-surface shadow-inner">
                                {aid.url ? (
                                    <Image src={aid.url} alt={aid.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" unoptimized />
                                ) : (
                                    <div className="text-center space-y-8 relative z-10">
                                        <div className="p-4 bg-background border border-border rounded-2xl mx-auto w-fit shadow-md">
                                          <ImageIcon className="h-12 w-12 text-muted-foreground/20" />
                                        </div>
                                        {(canModify || isIndependent) && (
                                            <Button 
                                                onClick={() => handleGenerateImage(idx, aid.imagePrompt)} 
                                                disabled={loadingImages[idx]} 
                                                className="h-12 px-8 bg-school-primary text-on-school-primary font-extrabold rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-school-primary-200 active:scale-95 transition-all"
                                            >
                                                {loadingImages[idx] ? <Loader2 className="animate-spin h-4 w-4" /> : "Synthesize Hub Asset"}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* ── ARCHIVE LEDGER VIEW (Rule 15 Resolved) ── */}
            {activeTab === "past-papers" && (
                <div className="animate-in fade-in duration-500 space-y-10">
                    <div className="p-8 bg-school-primary-50 border border-school-primary-200 rounded-[2.5rem] flex items-center gap-6 shadow-xl">
                        <div className="p-3 bg-school-primary rounded-xl text-on-school-primary shadow-lg">
                          <History className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-school-primary italic leading-relaxed">
                            Synchronizing AI-digitized Hubs from historical examination ledgers matching this syllabus module.
                        </p>
                    </div>
                    
                    <ScannedQuestionRegistry 
                        questions={initialScannedQuestions
                            .filter(q => q.topicId === topicId)
                            .map((q: Question): ScannedQuestion => ({
                                text: q.text,
                                answer: q.correctAnswer, 
                                explanation: q.explanation ?? "Registry rationale pending sync.", 
                                marks: q.points,
                                year: q.year ?? undefined, 
                                examBody: q.examBody ?? undefined 
                            }))
                        }
                        userRole={userRole}
                    />
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Sub-Component (Rule 15 Strict Typing) ──
interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ElementType;
    label: string;
}

function TabButton({ active, onClick, icon: Icon, label }: TabButtonProps) {
  return (
    <button 
        onClick={onClick} 
        className={cn(
          "flex items-center gap-3 px-6 h-12 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-95 shadow-sm",
          active 
            ? "bg-school-primary text-on-school-primary shadow-school-primary-200" 
            : "bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-surface"
        )}
    >
      <Icon className={cn("h-4 w-4", active ? "text-on-school-primary" : "text-school-primary/60")} /> 
      <span className="italic">{label}</span>
    </button>
  );
}