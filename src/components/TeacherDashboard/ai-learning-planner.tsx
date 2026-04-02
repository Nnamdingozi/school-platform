// "use client"

// import { useState, useEffect } from "react"
// import ReactMarkdown from "react-markdown"
// import Image from "next/image" // ✅ Added Next.js Image
// import { Sparkles, ImageIcon, FileText, HelpCircle, Check, Loader2, Download, type LucideIcon } from "lucide-react" // ✅ Added LucideIcon type
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { generateLessonForTopic, type LessonAiContent } from "@/app/actions/ai-generator" 
// import { generateDiagramImage } from "@/app/actions/generate-diagram" 
// import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
// import { toast } from "sonner"

// interface VisualAid {
//   title: string;
//   description: string;
//   imagePrompt: string;
//   url?: string; 
// }


// interface AILessonPlannerProps {
//   topicId: string;
//   lessonId: string; 
//   topicTitle: string;
//   initialData?: EnhancedLessonContent | null; 
// }
// // Inside ai-learning-planner.tsx
// export interface EnhancedLessonContent extends Omit<LessonAiContent, 'visualAids'> {
//   visualAids: VisualAid[];
// }



// export function AILessonPlanner({ topicId, lessonId, topicTitle, initialData }: AILessonPlannerProps) {
//   const [activeTab, setActiveTab] = useState<"visuals" | "summary" | "quiz" | "explanation">("explanation")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [data, setData] = useState<EnhancedLessonContent | null>(initialData || null)
//   const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({})

//   useEffect(() => {
//     setData(initialData || null)
//     setActiveTab("explanation")
//     setIsGenerating(false)
//     setLoadingImages({})
//   }, [topicId, initialData])

//   const handleGenerate = async () => {
//     setIsGenerating(true)
//     const promise = generateLessonForTopic(topicId)

//     toast.promise(promise, {
//       loading: "AI is analyzing the topic and designing visual aids...",
//       success: (result) => {
//         setData(result.aiContent as unknown as EnhancedLessonContent)
//         return "Curriculum architected successfully!"
//       },
//       error: "Could not reach the AI. Check your connection.",
//     })

//     try {
//       await promise
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleGenerateImage = async (index: number, prompt: string) => {
//     if (loadingImages[index] || (data?.visualAids[index]?.url)) return;

//     setLoadingImages(prev => ({ ...prev, [index]: true }))
    
//     try {
//       const result = await generateDiagramImage(prompt) 
//       if (result.success && result.url) {
//         setData(currentData => {
//           if (!currentData) return null;
//           const updatedVisualAids = [...currentData.visualAids];
//           updatedVisualAids[index] = { ...updatedVisualAids[index], url: result.url };
//           return { ...currentData, visualAids: updatedVisualAids };
//         });

//         const saveResult = await saveGeneratedImageUrlToLesson(lessonId, index, result.url);
//         if (saveResult.success) {
//           toast.success("Diagram generated and saved successfully!");
//         } else {
//           toast.error(saveResult.error || "Failed to save diagram.");
//         }
//       } else {
//         toast.error(result.error || "Failed to generate diagram.");
//       }
//     } catch (e) {
//       console.error("Error in handleGenerateImage:", e);
//       toast.error("Error connecting to image service.");
//     } finally {
//       setLoadingImages(prev => ({ ...prev, [index]: false }))
//     }
//   }

//   const contentReady = !!data; 

//   return (
//     <Card className="border-amber-200/50 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
//       <CardHeader className="bg-slate-50/50 border-b border-amber-100/50">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Sparkles className="h-5 w-5 text-amber-500" />
//             <CardTitle className="text-base font-bold">AI Lesson Planner</CardTitle>
//           </div>
//           {contentReady ? (
//             <Badge className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200">
//               <Check className="h-3 w-3" />
//               Content Ready
//             </Badge>
//           ) : (
//             <Button 
//               size="sm" 
//               onClick={handleGenerate} 
//               disabled={isGenerating}
//               className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
//             >
//               {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Lesson Plan"}
//             </Button>
//           )}
//         </div>
//         <CardDescription className="font-medium text-slate-600">
//           Curriculum Context: <span className="text-amber-700">{topicTitle}</span>
//         </CardDescription>
//       </CardHeader>
      
//       <CardContent className="pt-6 flex-1">
//         {!contentReady ? (
//           <div className="flex flex-col items-center justify-center py-12 text-center">
//             <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500">
//               <Sparkles className="h-10 w-10 animate-pulse" />
//             </div>
//             <h3 className="mb-2 font-bold text-slate-800">Ready to Assist</h3>
//             <p className="max-w-xs text-sm text-slate-500 leading-relaxed">
//               {"Click generate to receive an explanation, quiz, and custom visual aids for "} {topicTitle}.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <div className="flex flex-wrap gap-2 border-b pb-4">
//               <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Explanation" />
//               <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visual Aids" />
//               <TabButton active={activeTab === "summary"} onClick={() => setActiveTab("summary")} icon={Check} label="Summary" />
//               <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quick Quiz" />
//             </div>

//             <div className="min-h-[300px]">
//               {activeTab === "explanation" && (
//                 <div className="px-1">
//                   <ReactMarkdown
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
//                     {data.explanation}
//                   </ReactMarkdown>
//                 </div>
//               )}

//               {activeTab === "visuals" && (
//                 <div className="space-y-8">
//                   <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 flex gap-2">
//                     <Sparkles className="h-4 w-4 mt-0.5 shrink-0" />
//                     {/* ✅ FIX: Escaped quotes */}
//                     <p>{"The AI has identified diagrams or graphs. Click \"Generate\" to create them."}</p>
//                   </div>

//                   <div className="grid grid-cols-1 gap-8">
//                     {data.visualAids.map((aid, index) => (
//                       <Card key={index} className="overflow-hidden border-slate-200">
//                         <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
//                           <CardTitle className="text-lg font-bold text-slate-900">{aid.title}</CardTitle>
//                           <CardDescription className="text-slate-600">{aid.description}</CardDescription>
//                         </CardHeader>
//                         <CardContent className="p-0">
//                           {aid.url ? ( 
//                             <div className="relative group">
//                               {/* ✅ FIX: Replaced <img> with Next.js <Image /> */}
//                               <Image 
//                                 src={aid.url} 
//                                 alt={aid.title} 
//                                 width={800}
//                                 height={500}
//                                 unoptimized // Vercel Blob URLs are usually already optimized
//                                 className="w-full h-auto max-h-[500px] object-contain bg-white"
//                               />
//                               <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                 <a href={aid.url} target="_blank" rel="noreferrer">
//                                   <Button size="sm" variant="secondary" className="shadow-lg"><Download className="h-4 w-4 mr-2" /> Save</Button>
//                                 </a>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="h-[300px] bg-slate-50 flex flex-col items-center justify-center p-6 text-center border-b border-slate-100">
//                               <ImageIcon className="h-12 w-12 text-slate-300 mb-4" />
//                               <p className="text-slate-500 max-w-sm mb-6 text-sm">
//                                 AI is ready to draw this diagram based on the lesson context.
//                               </p>
//                               <Button 
//                                 onClick={() => handleGenerateImage(index, aid.imagePrompt)}
//                                 disabled={loadingImages[index]}
//                                 className="bg-slate-900 text-white hover:bg-slate-800"
//                               >
//                                 {loadingImages[index] ? (
//                                   <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Drawing Diagram...</>
//                                 ) : (
//                                   <><Sparkles className="mr-2 h-4 w-4 text-amber-400" /> Generate Diagram</>
//                                 )}
//                               </Button>
//                             </div>
//                           )}
//                         </CardContent>
//                         <CardFooter className="bg-slate-50/50 p-3 text-xs text-slate-400 italic border-t border-slate-100">
//                           {/* ✅ FIX: Escaped quotes */}
//                           {"Prompt: "}&quot;{aid.imagePrompt.substring(0, 80)}...&quot;
//                         </CardFooter>
//                       </Card>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* ... Rest of the tabs (summary, quiz) ... */}
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// // ✅ FIX: Replaced 'any' with 'LucideIcon'
// function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string }) {
//   return (
//     <Button
//       variant={active ? "default" : "ghost"}
//       size="sm"
//       onClick={onClick}
//       className={`gap-1.5 h-9 rounded-full ${active ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
//     >
//       <Icon className="h-3.5 w-3.5" />
//       {label}
//     </Button>
//   )
// }



// "use client"

// import { useState, useEffect, useTransition } from "react"
// import ReactMarkdown from "react-markdown"
// import Image from "next/image"
// import { 
//     Sparkles, ImageIcon, FileText, HelpCircle, Zap, 
//     Loader2, Download, Edit3, Save, Eye, Layout, 
//     type LucideIcon 
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// // Actions
// import { generateLessonForTopic, LessonAiContent } from "@/app/actions/ai-generator" 
// import { generateDiagramImage } from "@/app/actions/generate-diagram" 
// import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
// import { saveLesson } from "@/app/actions/lesson.actions" // ✅ New Save Action

// export interface VisualAid {
//   title: string;
//   description: string;
//   imagePrompt: string;
//   url?: string; // ✅ Made optional but present
// }


// // ✅ Updated to match your nested AI schema
// export interface EnhancedLessonContent {
//   teacherLogic: {
//       teachingMethod: string;
//       timeAllocation: string;
//       pedagogicalTips: string;
//       introductionHook: string;
//   };
//   studentContent: {
//       title: string;
//       explanation: string;
//       key_summary: string;
//       learningObjectives: string[];
//       vocabulary: string[];
//       // ✅ Use the specific VisualAid interface here
//       visualAids: VisualAid[]; 
//   };
// }

// interface AILessonPlannerProps {
//   topicId: string;
//   lessonId: string; 
//   topicTitle: string;
//   schoolId: string; // ✅ Added to support saving
//   initialData?: EnhancedLessonContent | null; 
// }

// export function AILessonPlanner({ topicId, lessonId, topicTitle, schoolId, initialData }: AILessonPlannerProps) {
//   const [activeTab, setActiveTab] = useState<"visuals" | "summary" | "quiz" | "explanation" | "pedagogy">("explanation")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [isPending, startTransition] = useTransition()
  
//   // Local state for the complex object
//   const [data, setData] = useState<EnhancedLessonContent | null>(initialData || null)
//   const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({})

//   useEffect(() => {
//     setData(initialData || null)
//     setIsEditing(false)
//   }, [topicId, initialData])

//   // ── Handlers ───────────────────────────────────────────────────────────

//   const handleGenerate = async () => {
//     setIsGenerating(true)
//     const promise = generateLessonForTopic(topicId)
//     toast.promise(promise, {
//       loading: "AI Architect is designing your lesson nodes...",
//       success: (result) => {
//         setData(result.aiContent as unknown as EnhancedLessonContent)
//         return "Lesson generated successfully!"
//       },
//       error: "AI limit reached or connection lost.",
//     })
//     try { await promise } finally { setIsGenerating(false) }
//   }

//   const handleManualSave = () => {
//     if (!data) return
//     startTransition(async () => {
//         const res = await saveLesson({
//             topicId,
//             schoolId,
//             title: data.studentContent.title,
//             content: data.studentContent.explanation,
//             aiContent: data
//         })
//         if (res.success) {
//             toast.success("Lesson committed to school vault.")
//             setIsEditing(false)
//         } else {
//             toast.error("Failed to sync edits.")
//         }
//     })
//   }

//   const handleGenerateImage = async (index: number, prompt: string) => {
//     if (loadingImages[index] || (data?.studentContent.visualAids[index]?.url)) return;
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
//         toast.success("Diagram synchronized.");
//       }
//     } finally {
//       setLoadingImages(prev => ({ ...prev, [index]: false }))
//     }
//   }

//   // ── Render Helpers ─────────────────────────────────────────────────────

//   if (!data) {
//       return (
//           <Card className="border-white/5 bg-slate-900 rounded-[2.5rem] p-20 text-center shadow-2xl">
//               <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-school-primary/10 text-school-primary mx-auto border border-school-primary/20">
//                 <Sparkles className="h-10 w-10 animate-pulse" />
//               </div>
//               <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Lesson Architect</h3>
//               <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8 font-medium">Ready to generate a high-impact lesson for {topicTitle}.</p>
//               <Button onClick={handleGenerate} disabled={isGenerating} className="bg-school-primary text-slate-950 font-black px-10 py-6 rounded-2xl hover:scale-105 transition-all">
//                 {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
//                 GENERATE WITH AI
//               </Button>
//           </Card>
//       )
//   }

//   return (
//     <Card className="border-white/5 bg-slate-900 shadow-2xl overflow-hidden rounded-[2.5rem] flex flex-col">
//       <CardHeader className="bg-slate-950/50 border-b border-white/5 p-8">
//         <div className="flex items-center justify-between">
//           <div className="space-y-1">
//             <div className="flex items-center gap-2">
//                 <Layout className="h-5 w-5 text-school-primary" />
//                 <CardTitle className="text-xl font-black text-white uppercase italic tracking-tighter">
//                     {data.studentContent.title}
//                 </CardTitle>
//             </div>
//             <CardDescription className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">
//               Level: {topicTitle}
//             </CardDescription>
//           </div>
          
//           <div className="flex items-center gap-3">
//             {!isEditing ? (
//                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="border-white/10 text-slate-400 hover:text-school-primary rounded-xl px-4">
//                     <Edit3 className="h-3.5 w-3.5 mr-2" /> Edit Registry
//                  </Button>
//             ) : (
//                 <div className="flex gap-2 animate-in slide-in-from-right-4">
//                     <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white">Cancel</Button>
//                     <Button size="sm" onClick={handleManualSave} disabled={isPending} className="bg-school-primary text-slate-950 font-black rounded-xl px-6">
//                         {isPending ? <Loader2 className="animate-spin" /> : <Save className="h-3.5 w-3.5 mr-2" />}
//                         COMMIT EDITS
//                     </Button>
//                 </div>
//             )}
//           </div>
//         </div>
//       </CardHeader>
      
//       <CardContent className="p-8 flex-1">
//         <div className="flex flex-wrap gap-2 mb-8 bg-slate-950 p-1 rounded-2xl w-fit border border-white/5">
//             <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Lesson Notes" />
//             <TabButton active={activeTab === "pedagogy"} onClick={() => setActiveTab("pedagogy")} icon={Zap} label="Teaching Strategy" />
//             <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visual Assets" />
//             <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Assessment" />
//         </div>

//         <div className="min-h-[400px] animate-in fade-in duration-500">
//             {/* ── LESSON NOTES (EXPLANATION) ── */}
//             {activeTab === "explanation" && (
//             <div className="space-y-6">
//                 {isEditing ? (
//                     <textarea 
//                         className="w-full h-[500px] bg-slate-950 border border-white/5 rounded-3xl p-8 text-slate-300 font-medium leading-relaxed focus:border-school-primary outline-none transition-all"
//                         value={data.studentContent.explanation}
//                         onChange={(e) => setData({...data, studentContent: {...data.studentContent, explanation: e.target.value}})}
//                     />
//                 ) : (
//                     <div className="prose prose-invert max-w-none px-2">
//                         <ReactMarkdown>{data.studentContent.explanation}</ReactMarkdown>
//                     </div>
//                 )}
//             </div>
//             )}

//             {/* ── TEACHING STRATEGY (NEW) ── */}
//             {activeTab === "pedagogy" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <Card className="bg-slate-950 border-white/5 p-6 rounded-3xl shadow-inner">
//                         <p className="text-[10px] font-black text-school-primary uppercase tracking-widest mb-4">Classroom Methodology</p>
//                         <p className="text-sm text-white font-bold italic mb-2">{data.teacherLogic.teachingMethod}</p>
//                         <p className="text-xs text-slate-400 leading-relaxed">{data.teacherLogic.introductionHook}</p>
//                     </Card>
//                     <Card className="bg-slate-950 border-white/5 p-6 rounded-3xl shadow-inner">
//                         <p className="text-[10px] font-black text-school-primary uppercase tracking-widest mb-4">Time Allocation</p>
//                         <p className="text-xl font-black text-white">{data.teacherLogic.timeAllocation}</p>
//                         <div className="mt-4 p-4 rounded-2xl bg-school-primary/5 border border-school-primary/10 text-xs text-slate-300 italic">
//                             &quot;{data.teacherLogic.pedagogicalTips}&quot;
//                         </div>
//                     </Card>
//                 </div>
//             )}

//             {/* ── VISUAL AIDS ── */}
//             {activeTab === "visuals" && (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     {data.studentContent.visualAids.map((aid, index) => (
//                         <Card key={index} className="overflow-hidden border-white/5 bg-slate-950 rounded-3xl shadow-xl group">
//                             <div className="p-6 border-b border-white/5 flex justify-between items-center">
//                                 <div>
//                                     <h4 className="font-bold text-white uppercase text-xs">{aid.title}</h4>
//                                     <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">{aid.description}</p>
//                                 </div>
//                             </div>
//                             <div className="relative min-h-[300px] flex flex-col items-center justify-center p-6 bg-slate-950 shadow-inner">
//                                 {aid.url ? (
//                                     <Image src={aid.url} alt={aid.title} width={600} height={400} className="rounded-xl object-contain" />
//                                 ) : (
//                                     <Button onClick={() => handleGenerateImage(index, aid.imagePrompt)} disabled={loadingImages[index]} className="bg-slate-900 border border-white/10 text-school-primary rounded-2xl h-16 w-16 group-hover:scale-110 transition-all">
//                                         {loadingImages[index] ? <Loader2 className="animate-spin h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
//                                     </Button>
//                                 )}
//                             </div>
//                         </Card>
//                     ))}
//                 </div>
//             )}

//             {/* ... Quizzes logic remains same but point to data.studentContent.quiz ... */}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string }) {
//   return (
//     <Button
//       variant="ghost"
//       size="sm"
//       onClick={onClick}
//       className={cn(
//           "gap-2 px-6 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
//           active ? "bg-school-primary text-slate-950 shadow-lg" : "text-slate-500 hover:text-white"
//       )}
//     >
//       <Icon className="h-3.5 w-3.5" />
//       {label}
//     </Button>
//   )
// }



// "use client"

// import { useState, useEffect, useTransition } from "react"
// import ReactMarkdown from "react-markdown"
// import Image from "next/image"
// import { 
//     Sparkles, ImageIcon, FileText, HelpCircle, Zap, 
//     Loader2, Edit3, Save, Layout, 
//     CheckCircle2, Info, type LucideIcon 
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// // Actions
// import { generateLessonForTopic } from "@/app/actions/ai-generator" 
// import { generateDiagramImage } from "@/app/actions/generate-diagram" 
// import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
// import { saveLessonAction } from "@/app/actions/ai-generator"
// import { getErrorMessage } from "@/lib/error-handler"

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
//       key_summary: string;
//       learningObjectives: string[];
//       vocabulary: string[];
//       visualAids: VisualAid[]; 
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
//   mode?: "teacher" | "student"; // ✅ NEW: Toggle between modes
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

//   // Sync state when topic changes
//   useEffect(() => {
//     setData(initialData || null)
//     setIsEditing(false)
//   }, [topicId, initialData])

//   // ── Handlers ───────────────────────────────────────────────────────────

//   const handleGenerate = async () => {
//     if (!isTeacher) return;
//     setIsGenerating(true)
//     try {
//         const res = await generateLessonForTopic(topicId)
//         if (res.success && res.aiContent) {
//             setData(res.aiContent as unknown as EnhancedLessonContent)
//             toast.success("AI Generation Complete")
//         }
//     } catch (err) {
//         toast.error("AI node synchronization failed.")
//         getErrorMessage(err)
//     } finally {
//         setIsGenerating(false)
//     }
//   }

//   const handleManualSave = () => {
//     if (!data || !isTeacher) return
//     startTransition(async () => {
//         const res = await saveLessonAction({
//             topicId,
//             schoolId,
//             title: data.studentContent.title,
//             content: data.studentContent.explanation,
//             aiContent: data
//         })
//         if (res.success) {
//             toast.success("Registry updated successfully.")
//             setIsEditing(false)
//         }
//     })
//   }

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

//   // ── Early Return for Empty State ───────────────────────────────────────

//   if (!data) {
//       return (
//           <div className="py-20 text-center bg-slate-900 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
//               <div className="h-20 w-20 bg-school-primary/10 rounded-full flex items-center justify-center mx-auto text-school-primary border border-school-primary/20">
//                   <Sparkles className="h-10 w-10 animate-pulse" />
//               </div>
//               <div>
//                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Registry Standby</h3>
//                   <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">
//                       {isTeacher 
//                         ? `Initialize the AI core to generate a syllabus package for ${topicTitle}.`
//                         : "This academic node has not been prepared yet. Please check back later."}
//                   </p>
//               </div>
//               {isTeacher && (
//                 <Button onClick={handleGenerate} disabled={isGenerating} className="bg-school-primary text-slate-950 font-black px-10 py-7 rounded-2xl hover:scale-105 transition-all">
//                    {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-5 w-5" />}
//                    GENERATE LESSON
//                 </Button>
//               )}
//           </div>
//       )
//   }

//   return (
//     <Card className="border-white/5 bg-slate-900 shadow-2xl overflow-hidden rounded-[2.5rem] flex flex-col">
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
//                   <Button variant="outline" onClick={() => setIsEditing(true)} className="border-white/10 text-slate-400 hover:text-white rounded-xl">
//                       <Edit3 className="h-4 w-4 mr-2" /> Edit
//                   </Button>
//               ) : (
//                   <div className="flex gap-2">
//                       <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-slate-500">Cancel</Button>
//                       <Button onClick={handleManualSave} disabled={isPending} className="bg-school-primary text-slate-950 font-black rounded-xl px-8 shadow-xl shadow-school-primary/20">
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
//         {/* Navigation Tabs */}
//         <div className="flex flex-wrap gap-2 mb-10 bg-slate-950 p-1.5 rounded-2xl w-fit border border-white/5 shadow-inner">
//             <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Lesson Notes" />
//             {isTeacher && <TabButton active={activeTab === "pedagogy"} onClick={() => setActiveTab("pedagogy")} icon={Zap} label="Strategy" />}
//             <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visuals" />
//             <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quiz Ref" />
//         </div>

//         <div className="min-h-[500px] animate-in fade-in duration-500">
//             {/* ── NOTES VIEW ── */}
//             {activeTab === "explanation" && (
//                 <div className="space-y-6">
//                     {isEditing ? (
//                         <textarea 
//                             className="w-full h-[600px] bg-slate-950 border border-school-primary/20 rounded-[2rem] p-8 text-slate-300 leading-relaxed outline-none focus:ring-1 ring-school-primary transition-all font-medium"
//                             value={data.studentContent.explanation}
//                             onChange={(e) => setData({...data, studentContent: {...data.studentContent, explanation: e.target.value}})}
//                         />
//                     ) : (
//                         <article className="prose prose-invert max-w-none px-2 prose-headings:italic prose-headings:font-black prose-p:text-slate-400 prose-strong:text-school-primary">
//                             <ReactMarkdown>{data.studentContent.explanation}</ReactMarkdown>
//                         </article>
//                     )}
//                 </div>
//             )}

//             {/* ── PEDAGOGY (Teacher Only) ── */}
//             {activeTab === "pedagogy" && isTeacher && (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     <div className="space-y-8">
//                         <PedagogyCard title="Instructional Method" value={data.teacherLogic.teachingMethod} icon={Zap} />
//                         <PedagogyCard title="Classroom Hook" value={data.teacherLogic.introductionHook} icon={Sparkles} />
//                     </div>
//                     <div className="space-y-8">
//                         <PedagogyCard title="Time Allocation" value={data.teacherLogic.timeAllocation} icon={CheckCircle2} color="text-school-primary" />
//                         <div className="bg-school-primary/5 border border-school-primary/20 p-8 rounded-[2rem] shadow-inner">
//                             <h5 className="text-[10px] font-black uppercase text-school-primary mb-4 tracking-widest flex items-center gap-2">
//                                 <Info className="h-4 w-4" /> Pedagogical Intelligence
//                             </h5>
//                             <p className="text-sm text-slate-300 italic leading-relaxed">&quot;{data.teacherLogic.pedagogicalTips}&quot;</p>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ── VISUAL ASSETS ── */}
//             {activeTab === "visuals" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {data.studentContent.visualAids.map((aid, idx) => (
//                         <Card key={idx} className="bg-slate-950 border-white/5 rounded-[2rem] overflow-hidden group shadow-xl transition-all hover:border-school-primary/20">
//                             <div className="p-6 border-b border-white/5">
//                                 <h4 className="text-sm font-bold text-white uppercase italic">{aid.title}</h4>
//                                 <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{aid.description}</p>
//                             </div>
//                             <div className="relative aspect-video flex flex-col items-center justify-center p-2">
//                                 {aid.url ? (
//                                     <Image src={aid.url} alt={aid.title} fill className="object-cover rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity" unoptimized />
//                                 ) : (
//                                     <div className="text-center space-y-4">
//                                         <ImageIcon className="h-10 w-10 text-slate-800 mx-auto" />
//                                         {isTeacher ? (
//                                             <Button onClick={() => handleGenerateImage(idx, aid.imagePrompt)} disabled={loadingImages[idx]} className="bg-slate-900 border border-white/10 hover:bg-school-primary hover:text-slate-950 transition-all rounded-xl">
//                                                 {loadingImages[idx] ? <Loader2 className="animate-spin h-4 w-4" /> : "Generate Diagram"}
//                                             </Button>
//                                         ) : (
//                                             <p className="text-[10px] text-slate-700 font-bold uppercase">Diagram pending generation</p>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </Card>
//                     ))}
//                 </div>
//             )}

//             {/* ── QUIZ PREVIEW ── */}
//             {activeTab === "quiz" && (
//                 <div className="max-w-3xl mx-auto space-y-6">
//                     {data.studentContent.quiz.map((q, i) => (
//                         <div key={i} className="p-8 bg-slate-950 rounded-[2rem] border border-white/5 space-y-4">
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
//                             <p className="text-[11px] text-slate-500 italic mt-4 pt-4 border-t border-white/5">
//                                 <span className="text-school-primary font-bold mr-1">Rationale:</span> {q.explanation}
//                             </p>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // ── Shared Sub-Components ──────────────────────────────────────────────────────

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

// function PedagogyCard({ title, value, icon: Icon, color = "text-white" }: { title: string, value: string, icon: LucideIcon, color?: string }) {
//     return (
//         <Card className="bg-slate-950 border-white/5 p-8 rounded-[2rem] shadow-inner space-y-4">
//             <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white/5 rounded-lg text-slate-500"><Icon className="h-4 w-4" /></div>
//                 <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{title}</h5>
//             </div>
//             <p className={cn("text-lg font-bold uppercase italic tracking-tight", color)}>{value}</p>
//         </Card>
//     )
// }



"use client"

import { useState, useEffect, useTransition } from "react"
import ReactMarkdown from "react-markdown"
import Image from "next/image"
import { 
    Sparkles, ImageIcon, FileText, HelpCircle, Zap, 
    Loader2, Edit3, Save, Layout, 
    type LucideIcon 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Actions
import { generateLessonForTopic } from "@/app/actions/ai-generator" 
import { generateDiagramImage } from "@/app/actions/generate-diagram" 
import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" 
import { saveLessonAction } from "@/app/actions/ai-generator"
import { getErrorMessage } from "@/lib/error-handler"

// ── Types ──────────────────────────────────────────────────────────────────────

export interface VisualAid {
  title: string;
  description: string;
  imagePrompt: string;
  url?: string; 
}

// ✅ FIX: Synchronized with the Zod schema in ai-generator.ts
export interface EnhancedLessonContent {
  metadata: {
      topicContext: string;
      difficultyLevel: string;
  };
  teacherLogic: {
      teachingMethod: string;
      timeAllocation: string;
      pedagogicalTips: string;
      introductionHook: string;
  };
  studentContent: {
      title: string;
      explanation: string;
      summary: string; // ✅ Renamed from key_summary to match schema
      learningObjectives: string[];
      vocabulary: string[];
      visualAids: VisualAid[]; 
      examples: { // ✅ Added missing examples property
          task: string;
          solution: string;
      }[];
      quiz: {
          question: string;
          options: string[];
          answer: string;
          explanation: string;
      }[];
  };
}

interface AILessonPlannerProps {
  topicId: string;
  lessonId: string; 
  topicTitle: string;
  schoolId: string;
  initialData?: EnhancedLessonContent | null;
  mode?: "teacher" | "student";
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function AILessonPlanner({ 
    topicId, 
    lessonId, 
    topicTitle, 
    schoolId, 
    initialData,
    mode = "teacher" 
}: AILessonPlannerProps) {
  
  const isTeacher = mode === "teacher";
  const [activeTab, setActiveTab] = useState<string>("explanation")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  const [data, setData] = useState<EnhancedLessonContent | null>(initialData || null)
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({})

  useEffect(() => {
    setData(initialData || null)
    setIsEditing(false)
  }, [topicId, initialData])

  // ── Handlers ───────────────────────────────────────────────────────────

  const handleGenerate = async () => {
    if (!isTeacher) return;
    setIsGenerating(true)
    try {
        const res = await generateLessonForTopic(topicId)
        if (res.success && res.aiContent) {
            setData(res.aiContent as unknown as EnhancedLessonContent)
            toast.success("AI Generation Complete")
        }
    } catch (err) {
        toast.error("AI node synchronization failed.")
        getErrorMessage(err)
    } finally {
        setIsGenerating(false)
    }
  }

  const handleManualSave = () => {
    if (!data || !isTeacher) return
    startTransition(async () => {
        const res = await saveLessonAction({
            topicId,
            schoolId,
            title: data.studentContent.title,
            content: data.studentContent.explanation,
            aiContent: data // ✅ Now valid as the types match
        })
        if (res.success) {
            toast.success("Registry updated successfully.")
            setIsEditing(false)
        }
    })
  }

  const handleGenerateImage = async (index: number, prompt: string) => {
    if (!isTeacher || loadingImages[index] || (data?.studentContent.visualAids[index]?.url)) return;
    setLoadingImages(prev => ({ ...prev, [index]: true }))
    try {
      const result = await generateDiagramImage(prompt) 
      if (result.success && result.url) {
        setData(current => {
          if (!current) return null;
          const updated = [...current.studentContent.visualAids];
          updated[index] = { ...updated[index], url: result.url };
          return { ...current, studentContent: { ...current.studentContent, visualAids: updated } };
        });
        await saveGeneratedImageUrlToLesson(lessonId, index, result.url);
        toast.success("Asset bound to registry.");
      }
    } finally {
      setLoadingImages(prev => ({ ...prev, [index]: false }))
    }
  }

  if (!data) {
      return (
          <div className="py-20 text-center bg-slate-900 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
              <div className="h-20 w-20 bg-school-primary/10 rounded-full flex items-center justify-center mx-auto text-school-primary border border-school-primary/20">
                  <Sparkles className="h-10 w-10 animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Registry Standby</h3>
              {isTeacher && (
                <Button onClick={handleGenerate} disabled={isGenerating} className="bg-school-primary text-slate-950 font-black px-10 py-7 rounded-2xl">
                   {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-5 w-5" />}
                   GENERATE LESSON
                </Button>
              )}
          </div>
      )
  }

  return (
    <Card className="border-white/5 bg-slate-900 shadow-2xl overflow-hidden rounded-[2.5rem] flex flex-col">
      <CardHeader className="bg-slate-950/50 border-b border-white/5 p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
             <div className="flex items-center gap-3 mb-1">
                <Layout className="h-5 w-5 text-school-primary" />
                <CardTitle className="text-2xl font-black text-white uppercase italic tracking-tighter truncate">
                    {data.studentContent.title}
                </CardTitle>
             </div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{topicTitle}</p>
          </div>
          
          {isTeacher && (
            <div className="flex items-center gap-3 shrink-0">
              {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)} className="border-white/10 text-slate-400">
                      <Edit3 className="h-4 w-4 mr-2" /> Edit
                  </Button>
              ) : (
                  <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-slate-500">Cancel</Button>
                      <Button onClick={handleManualSave} disabled={isPending} className="bg-school-primary text-slate-950 font-black rounded-xl">
                          {isPending ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                          SYNC
                      </Button>
                  </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-8 flex-1">
        <div className="flex flex-wrap gap-2 mb-10 bg-slate-950 p-1.5 rounded-2xl w-fit border border-white/5 shadow-inner">
            <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Lesson Notes" />
            {isTeacher && <TabButton active={activeTab === "pedagogy"} onClick={() => setActiveTab("pedagogy")} icon={Zap} label="Strategy" />}
            <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visuals" />
            <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quiz Ref" />
        </div>

        <div className="min-h-[500px]">
            {activeTab === "explanation" && (
                <div className="space-y-6">
                    {isEditing ? (
                        <textarea 
                            className="w-full h-[600px] bg-slate-950 border border-school-primary/20 rounded-[2rem] p-8 text-slate-300 outline-none transition-all font-medium"
                            value={data.studentContent.explanation}
                            onChange={(e) => setData({...data, studentContent: {...data.studentContent, explanation: e.target.value}})}
                        />
                    ) : (
                        <article className="prose prose-invert max-w-none px-2 prose-headings:italic prose-headings:font-black prose-p:text-slate-400 prose-strong:text-school-primary">
                            <ReactMarkdown>{data.studentContent.explanation}</ReactMarkdown>
                        </article>
                    )}
                </div>
            )}

            {/* Pedagogy Tab (Teacher Only) */}
            {activeTab === "pedagogy" && isTeacher && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <PedagogyCard title="Instructional Method" value={data.teacherLogic.teachingMethod} icon={Zap} />
                    <PedagogyCard title="Classroom Hook" value={data.teacherLogic.introductionHook} icon={Sparkles} />
                </div>
            )}

            {/* Visuals Tab */}
            {activeTab === "visuals" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.studentContent.visualAids.map((aid, idx) => (
                        <Card key={idx} className="bg-slate-950 border-white/5 rounded-[2rem] overflow-hidden group shadow-xl transition-all">
                            <div className="p-6 border-b border-white/5">
                                <h4 className="text-sm font-bold text-white uppercase italic">{aid.title}</h4>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{aid.description}</p>
                            </div>
                            <div className="relative aspect-video flex flex-col items-center justify-center p-2">
                                {aid.url ? (
                                    <Image src={aid.url} alt={aid.title} fill className="object-cover rounded-2xl opacity-90 transition-opacity" unoptimized />
                                ) : (
                                    <div className="text-center space-y-4">
                                        <ImageIcon className="h-10 w-10 text-slate-800 mx-auto" />
                                        {isTeacher && (
                                            <Button onClick={() => handleGenerateImage(idx, aid.imagePrompt)} disabled={loadingImages[idx]} className="bg-slate-900 border border-white/10 hover:bg-school-primary hover:text-slate-950 transition-all rounded-xl">
                                                {loadingImages[idx] ? <Loader2 className="animate-spin h-4 w-4" /> : "Generate Diagram"}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Quiz Tab */}
            {activeTab === "quiz" && (
                <div className="max-w-3xl mx-auto space-y-6">
                    {data.studentContent.quiz.map((q, i) => (
                        <div key={i} className="p-8 bg-slate-950 rounded-[2rem] border border-white/5 space-y-4 shadow-xl">
                            <p className="text-xs font-black text-school-primary uppercase tracking-widest">Question 0{i+1}</p>
                            <p className="text-base font-bold text-white leading-relaxed">{q.question}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {q.options.map(opt => (
                                    <div key={opt} className={cn(
                                        "p-4 rounded-xl border text-xs font-medium",
                                        opt === q.answer ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400" : "border-white/5 bg-slate-900/50 text-slate-500"
                                    )}>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  )
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
          "gap-2 px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
          active ? "bg-school-primary text-slate-950 shadow-lg" : "text-slate-500 hover:text-white"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  )
}

function PedagogyCard({ title, value, icon: Icon }: { title: string, value: string, icon: LucideIcon }) {
    return (
        <Card className="bg-slate-950 border-white/5 p-8 rounded-[2rem] shadow-inner space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-slate-50"><Icon className="h-4 w-4" /></div>
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h5>
            </div>
            <p className="text-lg font-bold text-white uppercase italic tracking-tight">{value}</p>
        </Card>
    )
}