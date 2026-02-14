
// "use client"

// import { useState } from "react"
// import ReactMarkdown from "react-markdown" // <--- 1. Import added here
// import { Sparkles, Video, FileText, HelpCircle, ChevronRight, Check, Loader2 } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { generateLessonForTopic } from "@/app/actions/ai-generator"
// import { toast } from "sonner"
// import type { LessonAiContent } from "@/app/actions/ai-generator"

// interface AILessonPlannerProps {
//   topicId: string
//   topicTitle: string
//   initialData?: LessonAiContent | null 
// }

// export function AILessonPlanner({ topicId, topicTitle, initialData }: AILessonPlannerProps) {
//   const [activeTab, setActiveTab] = useState<"video" | "summary" | "quiz" | "explanation">("explanation")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [data, setData] = useState<LessonAiContent | null>(initialData || null)

//   const handleGenerate = async () => {
//     setIsGenerating(true)
//     const promise = generateLessonForTopic(topicId)

//     toast.promise(promise, {
//       loading: "AI is architecting your curriculum...",
//       success: (result) => {
//         setData(result.aiContent as unknown as LessonAiContent)
//         return "Lesson generated successfully!"
//       },
//       error: "Could not reach the AI. Check your connection.",
//     })

//     try {
//       await promise
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   return (
//     <Card className="border-amber-200/50 shadow-sm overflow-hidden">
//       <CardHeader className="bg-slate-50/50 border-b border-amber-100/50">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Sparkles className="h-5 w-5 text-amber-500" />
//             <CardTitle className="text-base font-bold">AI Lesson Planner</CardTitle>
//           </div>
//           {data ? (
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
//               {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Content"}
//             </Button>
//           )}
//         </div>
//         <CardDescription className="font-medium text-slate-600">
//           Curriculum Context: <span className="text-amber-700">{topicTitle}</span>
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="pt-6">
//         {!data ? (
//           <div className="flex flex-col items-center justify-center py-12 text-center">
//             <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500">
//               <Sparkles className="h-10 w-10 animate-pulse" />
//             </div>
//             <h3 className="mb-2 font-bold text-slate-800">Ready to Assist</h3>
//             <p className="max-w-xs text-sm text-slate-500 leading-relaxed">
//               Click generate to receive a tailored video script, detailed summary, and interactive quiz for this specific topic.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {/* Navigation Tabs */}
//             <div className="flex flex-wrap gap-2 border-b pb-4">
//               <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Explanation" />
//               <TabButton active={activeTab === "video"} onClick={() => setActiveTab("video")} icon={Video} label="Video Script" />
//               <TabButton active={activeTab === "summary"} onClick={() => setActiveTab("summary")} icon={Check} label="Summary" />
//               <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quick Quiz" />
//             </div>

//             {/* Dynamic Content Display */}
//             <div className="min-h-[300px] animate-in fade-in slide-in-from-bottom-2 duration-500">
              
//               {/* --- UPDATED EXPLANATION SECTION START --- */}
// {activeTab === "explanation" && (
//   <div className="px-1">
//     <ReactMarkdown
//       components={{
//         // Main Title (H1) - Big, Amber, Underlined
//         h1: ({ node, ...props }) => (
//           <h1 className="text-3xl font-extrabold text-amber-700 border-b-2 border-amber-200 pb-2 mb-6 mt-2" {...props} />
//         ),
//         // Section Headers (H2) - Large, Dark Slate, bold
//         h2: ({ node, ...props }) => (
//           <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 flex items-center gap-2" {...props} />
//         ),
//         // Sub-sections (H3) - Medium, Amber/Dark, bold
//         h3: ({ node, ...props }) => (
//           <h3 className="text-xl font-bold text-amber-800 mt-6 mb-3" {...props} />
//         ),
//         // Standard Paragraphs
//         p: ({ node, ...props }) => (
//           <p className="text-slate-700 leading-relaxed mb-4 text-sm" {...props} />
//         ),
//         // Lists (Unordered)
//         ul: ({ node, ...props }) => (
//           <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2" {...props} />
//         ),
//         // Lists (Ordered)
//         ol: ({ node, ...props }) => (
//           <ol className="list-decimal pl-6 mb-4 text-slate-700 space-y-2" {...props} />
//         ),
//         // List Items
//         li: ({ node, ...props }) => (
//           <li className="pl-1 marker:text-amber-500" {...props} />
//         ),
//         // Bold Text
//         strong: ({ node, ...props }) => (
//           <strong className="font-bold text-slate-900" {...props} />
//         ),
//         // Blockquotes (often used for notes)
//         blockquote: ({ node, ...props }) => (
//           <blockquote className="border-l-4 border-amber-400 pl-4 py-1 my-4 bg-amber-50/50 italic text-slate-700 rounded-r" {...props} />
//         ),
//       }}
//     >
//       {data.explanation}
//     </ReactMarkdown>
//   </div>
// )}
// {/* --- UPDATED EXPLANATION SECTION END --- */}

//               {activeTab === "video" && (
//                 <div className="space-y-4">
//                   <h4 className="font-bold text-amber-700 uppercase text-xs tracking-widest">Presenter Script</h4>
//                   <p className="whitespace-pre-line text-sm bg-slate-50 p-4 rounded-lg border border-slate-200 italic text-slate-600">
//                     {data.videoScript}
//                   </p>
//                 </div>
//               )}
//               {activeTab === "summary" && (
//                 <div className="space-y-4">
//                   <h4 className="font-bold text-slate-800">Learning Key Points</h4>
//                   <ul className="grid gap-2">
//                     {data.learningObjectives.map((obj, i) => (
//                       <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
//                         <Check className="h-4 w-4 text-emerald-500" /> {obj}
//                       </li>
//                     ))}
//                   </ul>
//                   <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-800">
//                     {data.summary}
//                   </div>
//                 </div>
//               )}
//               {activeTab === "quiz" && (
//                 <div className="space-y-4">
//                   {data.quiz.map((q, index) => (
//                     <div key={index} className="group rounded-xl border border-slate-200 bg-white p-4 hover:border-amber-300 transition-colors">
//                       <div className="flex gap-3">
//                         <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
//                           {index + 1}
//                         </span>
//                         <div className="space-y-3 w-full">
//                           <p className="text-sm font-bold text-slate-800">{q.question}</p>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                             {q.options.map((opt, i) => (
//                               <div key={i} className={`text-xs p-2 rounded border ${opt === q.answer ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100'}`}>
//                                 {opt}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
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

// // 1. Add useEffect to the imports
// import { useState, useEffect } from "react" 
// import ReactMarkdown from "react-markdown"
// import { Sparkles, Video, FileText, HelpCircle, Check, Loader2 } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { generateLessonForTopic } from "@/app/actions/ai-generator"
// import { toast } from "sonner"
// import type { LessonAiContent } from "@/app/actions/ai-generator"

// interface AILessonPlannerProps {
//   topicId: string
//   topicTitle: string
//   initialData?: LessonAiContent | null 
// }

// export function AILessonPlanner({ topicId, topicTitle, initialData }: AILessonPlannerProps) {
//   const [activeTab, setActiveTab] = useState<"video" | "summary" | "quiz" | "explanation">("explanation")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [data, setData] = useState<LessonAiContent | null>(initialData || null)

//   // 2. Add this useEffect hook
//   // This watches for changes in 'topicId'. When the topic changes, it resets the state.
//   useEffect(() => {
//     // If the parent passes new initialData for this specific topic, use it.
//     // Otherwise, reset data to null so the user sees the "Generate" button.
//     setData(initialData || null)
    
//     // Reset the tab to the first one
//     setActiveTab("explanation")
    
//     // Ensure loading state is turned off
//     setIsGenerating(false)
//   }, [topicId, initialData]) // <--- Dependencies: Run this when topicId or initialData changes

//   const handleGenerate = async () => {
//     setIsGenerating(true)
//     const promise = generateLessonForTopic(topicId)

//     toast.promise(promise, {
//       loading: "AI is architecting your curriculum...",
//       success: (result) => {
//         setData(result.aiContent as unknown as LessonAiContent)
//         return "Lesson generated successfully!"
//       },
//       error: "Could not reach the AI. Check your connection.",
//     })

//     try {
//       await promise
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   return (
//     <Card className="border-amber-200/50 shadow-sm overflow-hidden">
//       <CardHeader className="bg-slate-50/50 border-b border-amber-100/50">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Sparkles className="h-5 w-5 text-amber-500" />
//             <CardTitle className="text-base font-bold">AI Lesson Planner</CardTitle>
//           </div>
//           {data ? (
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
//               {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Content"}
//             </Button>
//           )}
//         </div>
//         <CardDescription className="font-medium text-slate-600">
//           Curriculum Context: <span className="text-amber-700">{topicTitle}</span>
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="pt-6">
//         {!data ? (
//           <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-300">
//             <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500">
//               <Sparkles className="h-10 w-10 animate-pulse" />
//             </div>
//             <h3 className="mb-2 font-bold text-slate-800">Ready to Assist</h3>
//             <p className="max-w-xs text-sm text-slate-500 leading-relaxed">
//               Click generate to receive a tailored video script, detailed summary, and interactive quiz for <strong>{topicTitle}</strong>.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {/* Navigation Tabs */}
//             <div className="flex flex-wrap gap-2 border-b pb-4">
//               <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Explanation" />
//               <TabButton active={activeTab === "video"} onClick={() => setActiveTab("video")} icon={Video} label="Video Script" />
//               <TabButton active={activeTab === "summary"} onClick={() => setActiveTab("summary")} icon={Check} label="Summary" />
//               <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quick Quiz" />
//             </div>

//             {/* Dynamic Content Display */}
//             <div className="min-h-[300px] animate-in fade-in slide-in-from-bottom-2 duration-500">
              
//               {/* --- EXPLANATION SECTION --- */}
//               {activeTab === "explanation" && (
//                 <div className="px-1">
//                   <ReactMarkdown
//                     components={{
//                       h1: ({ node, ...props }) => (
//                         <h1 className="text-3xl font-extrabold text-amber-700 border-b-2 border-amber-200 pb-2 mb-6 mt-2" {...props} />
//                       ),
//                       h2: ({ node, ...props }) => (
//                         <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 flex items-center gap-2" {...props} />
//                       ),
//                       h3: ({ node, ...props }) => (
//                         <h3 className="text-xl font-bold text-amber-800 mt-6 mb-3" {...props} />
//                       ),
//                       p: ({ node, ...props }) => (
//                         <p className="text-slate-700 leading-relaxed mb-4 text-sm" {...props} />
//                       ),
//                       ul: ({ node, ...props }) => (
//                         <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2" {...props} />
//                       ),
//                       ol: ({ node, ...props }) => (
//                         <ol className="list-decimal pl-6 mb-4 text-slate-700 space-y-2" {...props} />
//                       ),
//                       li: ({ node, ...props }) => (
//                         <li className="pl-1 marker:text-amber-500" {...props} />
//                       ),
//                       strong: ({ node, ...props }) => (
//                         <strong className="font-bold text-slate-900" {...props} />
//                       ),
//                       blockquote: ({ node, ...props }) => (
//                         <blockquote className="border-l-4 border-amber-400 pl-4 py-1 my-4 bg-amber-50/50 italic text-slate-700 rounded-r" {...props} />
//                       ),
//                     }}
//                   >
//                     {data.explanation}
//                   </ReactMarkdown>
//                 </div>
//               )}

//               {activeTab === "video" && (
//                 <div className="space-y-4">
//                   <h4 className="font-bold text-amber-700 uppercase text-xs tracking-widest">Presenter Script</h4>
//                   <p className="whitespace-pre-line text-sm bg-slate-50 p-4 rounded-lg border border-slate-200 italic text-slate-600">
//                     {data.videoScript}
//                   </p>
//                 </div>
//               )}
//               {activeTab === "summary" && (
//                 <div className="space-y-4">
//                   <h4 className="font-bold text-slate-800">Learning Key Points</h4>
//                   <ul className="grid gap-2">
//                     {data.learningObjectives.map((obj, i) => (
//                       <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
//                         <Check className="h-4 w-4 text-emerald-500" /> {obj}
//                       </li>
//                     ))}
//                   </ul>
//                   <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-800">
//                     {data.summary}
//                   </div>
//                 </div>
//               )}
//               {activeTab === "quiz" && (
//                 <div className="space-y-4">
//                   {data.quiz.map((q, index) => (
//                     <div key={index} className="group rounded-xl border border-slate-200 bg-white p-4 hover:border-amber-300 transition-colors">
//                       <div className="flex gap-3">
//                         <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
//                           {index + 1}
//                         </span>
//                         <div className="space-y-3 w-full">
//                           <p className="text-sm font-bold text-slate-800">{q.question}</p>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                             {q.options.map((opt, i) => (
//                               <div key={i} className={`text-xs p-2 rounded border ${opt === q.answer ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100'}`}>
//                                 {opt}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
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

// components/AILessonPlanner.tsx
"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Sparkles, ImageIcon, FileText, HelpCircle, Check, Loader2, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { generateLessonForTopic, LessonAiContent } from "@/app/actions/ai-generator" 
import { generateDiagramImage } from "@/app/actions/generate-diagram" // <--- Import generateDiagramImage
import { saveGeneratedImageUrlToLesson } from "@/app/actions/lesson-image-action" // <--- Import saveGeneratedImageUrlToLesson
import { toast } from "sonner"


// Define the structure for a visual aid, including the optional URL field
interface VisualAid {
  title: string;
  description: string;
  imagePrompt: string;
  url?: string; // This field will store the permanent Vercel Blob URL
}

// Extend the LessonAiContent type to ensure it uses our VisualAid structure
interface EnhancedLessonContent extends Omit<LessonAiContent, 'visualAids'> {
  visualAids: VisualAid[];
}

// Props for the AILessonPlanner component
interface AILessonPlannerProps {
  topicId: string;
  lessonId: string; // IMPORTANT: You MUST pass this prop from the parent component
  topicTitle: string;
  initialData?: EnhancedLessonContent | null; 
}

export function AILessonPlanner({ topicId, lessonId, topicTitle, initialData }: AILessonPlannerProps) {
  const [activeTab, setActiveTab] = useState<"visuals" | "summary" | "quiz" | "explanation">("explanation")
  const [isGenerating, setIsGenerating] = useState(false)
  const [data, setData] = useState<EnhancedLessonContent | null>(initialData || null)

  // State to track which image generation is currently loading
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({})

  // Effect to reset component state when topicId or initialData changes
  useEffect(() => {
    setData(initialData || null)
    setActiveTab("explanation")
    setIsGenerating(false)
    setLoadingImages({}) // Reset image loading states
  }, [topicId, initialData])

  // Handles the initial AI generation of the lesson content (text, quiz, visual aid *prompts*)
  const handleGenerate = async () => {
    setIsGenerating(true)
    const promise = generateLessonForTopic(topicId)

    toast.promise(promise, {
      loading: "AI is analyzing the topic and designing visual aids...",
      success: (result) => {
        // When the AI generates, `visualAids` will initially have no 'url' property.
        // The 'url' will be added later when the user clicks 'Generate Diagram'.
        setData(result.aiContent as unknown as EnhancedLessonContent)
        return "Curriculum architected successfully!"
      },
      error: "Could not reach the AI. Check your connection.",
    })

    try {
      await promise
    } finally {
      setIsGenerating(false)
    }
  }

  // Handles the generation of a specific diagram image (DALL-E + Vercel Blob)
  const handleGenerateImage = async (index: number, prompt: string) => {
    // Prevent generation if already loading or if an image already exists for this visual aid
    if (loadingImages[index] || (data?.visualAids[index]?.url)) {
      console.log("Image already generated or loading for index", index);
      return;
    }

    setLoadingImages(prev => ({ ...prev, [index]: true }))
    
    try {
      // 1. Call the server action to generate the image and upload to Vercel Blob
      const result = await generateDiagramImage(prompt) 
      
      if (result.success && result.url) {
        // 2. Optimistically update the UI's local state immediately
        setData(currentData => {
          if (!currentData) return null;
          const updatedVisualAids = [...currentData.visualAids];
          updatedVisualAids[index] = { ...updatedVisualAids[index], url: result.url }; // Add the new URL
          return { ...currentData, visualAids: updatedVisualAids };
        });

        // 3. Call the server action to save the new URL to the database
        const saveResult = await saveGeneratedImageUrlToLesson(lessonId, index, result.url);
        
        if (saveResult.success) {
          toast.success("Diagram generated and saved successfully!");
        } else {
          // If saving to DB failed, consider reverting UI or showing a warning
          toast.error(saveResult.error || "Failed to save diagram URL to database. Image might be temporary.");
        }
      } else {
        toast.error(result.error || "Failed to generate diagram.");
      }
    } catch (e) {
      console.error("Error in handleGenerateImage:", e);
      toast.error("Error connecting to image service.");
    } finally {
      setLoadingImages(prev => ({ ...prev, [index]: false }))
    }
  }

  const contentReady = !!data; 

  return (
    <Card className="border-amber-200/50 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
      <CardHeader className="bg-slate-50/50 border-b border-amber-100/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-base font-bold">AI Lesson Planner</CardTitle>
          </div>
          {contentReady ? (
            <Badge className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200">
              <Check className="h-3 w-3" />
              Content Ready
            </Badge>
          ) : (
            <Button 
              size="sm" 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Lesson Plan"}
            </Button>
          )}
        </div>
        <CardDescription className="font-medium text-slate-600">
          Curriculum Context: <span className="text-amber-700">{topicTitle}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 flex-1">
        {!contentReady ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-300">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500">
              <Sparkles className="h-10 w-10 animate-pulse" />
            </div>
            <h3 className="mb-2 font-bold text-slate-800">Ready to Assist</h3>
            <p className="max-w-xs text-sm text-slate-500 leading-relaxed">
              Click generate to receive an explanation, quiz, and <strong>custom visual aids</strong> (diagrams/graphs) for {topicTitle}.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b pb-4">
              <TabButton active={activeTab === "explanation"} onClick={() => setActiveTab("explanation")} icon={FileText} label="Explanation" />
              <TabButton active={activeTab === "visuals"} onClick={() => setActiveTab("visuals")} icon={ImageIcon} label="Visual Aids" />
              <TabButton active={activeTab === "summary"} onClick={() => setActiveTab("summary")} icon={Check} label="Summary" />
              <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Quick Quiz" />
            </div>

            {/* Dynamic Content Display */}
            <div className="min-h-[300px] animate-in fade-in slide-in-from-bottom-2 duration-500">
              
              {activeTab === "explanation" && (
                <div className="px-1">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-3xl font-extrabold text-amber-700 border-b-2 border-amber-200 pb-2 mb-6 mt-2" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 flex items-center gap-2" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-amber-800 mt-6 mb-3" {...props} />,
                      p: ({ node, ...props }) => <p className="text-slate-700 leading-relaxed mb-4 text-sm" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 text-slate-700 space-y-2" {...props} />,
                      li: ({ node, ...props }) => <li className="pl-1 marker:text-amber-500" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,
                      blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-amber-400 pl-4 py-1 my-4 bg-amber-50/50 italic text-slate-700 rounded-r" {...props} />,
                    }}
                  >
                    {data.explanation}
                  </ReactMarkdown>
                </div>
              )}

              {activeTab === "visuals" && (
                <div className="space-y-8">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 flex gap-2">
                    <Sparkles className="h-4 w-4 mt-0.5 shrink-0" />
                    <p>The AI has analyzed this lesson and identified <strong>{data.visualAids.length}</strong> diagrams or graphs that would improve understanding. Click "Generate" to create them using AI.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {data.visualAids.map((aid, index) => (
                      <Card key={index} className="overflow-hidden border-slate-200">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                          <CardTitle className="text-lg font-bold text-slate-900">{aid.title}</CardTitle>
                          <CardDescription className="text-slate-600">{aid.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                          {/* Conditional rendering: If aid.url exists, display image; otherwise, show generate button */}
                          {aid.url ? ( 
                            <div className="relative group">
                              <img 
                                src={aid.url} // Use the permanent URL stored in the data
                                alt={aid.title} 
                                className="w-full h-auto max-h-[500px] object-contain bg-white"
                              />
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a href={aid.url} target="_blank" rel="noreferrer">
                                  <Button size="sm" variant="secondary" className="shadow-lg"><Download className="h-4 w-4 mr-2" /> Save</Button>
                                </a>
                              </div>
                            </div>
                          ) : (
                            // Show generate button only if no URL exists for this visual aid
                            <div className="h-[300px] bg-slate-50 flex flex-col items-center justify-center p-6 text-center border-b border-slate-100">
                              <ImageIcon className="h-12 w-12 text-slate-300 mb-4" />
                              <p className="text-slate-500 max-w-sm mb-6 text-sm">
                                AI is ready to draw this diagram based on the lesson context.
                              </p>
                              <Button 
                                onClick={() => handleGenerateImage(index, aid.imagePrompt)}
                                disabled={loadingImages[index]} // Disable if currently generating this image
                                className="bg-slate-900 text-white hover:bg-slate-800"
                              >
                                {loadingImages[index] ? (
                                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Drawing Diagram...</>
                                ) : (
                                  <><Sparkles className="mr-2 h-4 w-4 text-amber-400" /> Generate Diagram</>
                                )}
                              </Button>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 p-3 text-xs text-slate-400 italic border-t border-slate-100">
                          Prompt: "{aid.imagePrompt.substring(0, 80)}..."
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "summary" && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800">Learning Key Points</h4>
                  <ul className="grid gap-2">
                    {data.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="h-4 w-4 text-emerald-500" /> {obj}
                      </li>
                    ))}
                  </ul>
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-800">
                    {data.summary}
                  </div>
                </div>
              )}

              {activeTab === "quiz" && (
                <div className="space-y-4">
                  {data.quiz.map((q, index) => (
                    <div key={index} className="group rounded-xl border border-slate-200 bg-white p-4 hover:border-amber-300 transition-colors">
                      <div className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                          {index + 1}
                        </span>
                        <div className="space-y-3 w-full">
                          <p className="text-sm font-bold text-slate-800">{q.question}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {q.options.map((opt, i) => (
                              <div key={i} className={`text-xs p-2 rounded border ${opt === q.answer ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100'}`}>
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      className={`gap-1.5 h-9 rounded-full ${active ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Button>
  )
}