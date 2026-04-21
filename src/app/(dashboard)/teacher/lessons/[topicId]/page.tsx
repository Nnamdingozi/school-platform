// 'use client'

// import { use, useEffect, useState } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { getLessonForTopic } from "@/app/actions/lesson.actions"
// import { AILessonPlanner, type EnhancedLessonContent } from "@/components/TeacherDashboard/ai-learning-planner"
// import { ArrowLeft, BookOpen, Loader2} from "lucide-react"
// import Link from "next/link"
// import { Badge } from "@/components/ui/badge"

// interface PageProps {
//     params: Promise<{ topicId: string }>
// }

// export default function LessonStudioPage({ params }: PageProps) {
//     const { topicId } = use(params)
//     const { profile, isLoading: isProfileLoading } = useProfileStore()
    
//     // ✅ FIX: Track the ID separately or wrap the state
//     const [lessonId, setLessonId] = useState<string>("")
//     const [lessonContent, setLessonContent] = useState<EnhancedLessonContent | null>(null)
//     const [isPrivateEdit, setIsPrivateEdit] = useState(false)
//     const [loading, setLoading] = useState(true)

//     const schoolId = profile?.schoolId ?? ''

//     useEffect(() => {
//         if (!schoolId || !topicId) return

//         async function fetchContent() {
//             setLoading(true)
//             const res = await getLessonForTopic(topicId, schoolId)
            
//             if (res.success && res.data) {
//                 // ✅ FIX: Extract id from data, and aiContent for the planner
//                 setLessonId(res.data.id)
//                 setLessonContent(res.data.aiContent as unknown as EnhancedLessonContent)
//                 setIsPrivateEdit(res.data.isPrivate)
//             }
//             setLoading(false)
//         }

//         fetchContent()
//     }, [topicId, schoolId])

//     if (isProfileLoading || loading) {
//         return (
//             <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//                 <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//                 <p className="text-slate-500 font-mono text-[10px] uppercase mt-4">Syncing_Vault...</p>
//             </div>
//         )
//     }

//     return (
//         <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-8 bg-slate-950 min-h-screen text-slate-50">
//             <header className="space-y-6">
//                 <Link href="/teacher" className="text-school-primary text-[10px] font-black uppercase flex items-center gap-2 hover:opacity-70 transition-all w-fit">
//                     <ArrowLeft className="h-3 w-3" /> Dashboard
//                 </Link>
                
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
//                     <div className="flex items-center gap-5">
//                         <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center">
//                             <BookOpen className="h-7 w-7 text-school-primary" />
//                         </div>
//                         <div>
//                             <div className="flex items-center gap-2 mb-1">
//                                 <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Lesson Studio</h1>
//                                 {isPrivateEdit && (
//                                     <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
//                                         Customized
//                                     </Badge>
//                                 )}
//                             </div>
//                             <p className="text-slate-500 text-sm font-medium">Topic: <span className="text-slate-300">Curriculum Development Hub</span></p>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <main className="max-w-5xl mx-auto">
//                 <AILessonPlanner 
//                     topicId={topicId}
//                     schoolId={schoolId}
//                     // ✅ Passed the correctly extracted lessonId
//                     lessonId={lessonId}
//                     topicTitle={lessonContent?.studentContent.title ?? "New Subject Node"}
//                     initialData={lessonContent}
//                 />
//             </main>
//         </div>
//     )
// }


// 'use client'

// import { use, useEffect, useState } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { Loader2, ArrowLeft, BookOpen } from "lucide-react"
// import Link from "next/link"
// import { Badge } from "@/components/ui/badge"

// import { AILessonPlanner, type EnhancedLessonContent } from "@/components/TeacherDashboard/ai-learning-planner"
// import { getLessonForTeacher, publishLesson } from "@/app/actions/lesson.actions"

// interface PageProps {
//   params: Promise<{ topicId: string }>
// }

// type LessonStatus = "draft" | "published" | "global"

// export default function LessonStudioPage({ params }: PageProps) {
//   const { topicId } = use(params)

//   const { profile, isLoading: isProfileLoading } = useProfileStore()
//   const schoolId = profile?.schoolId ?? ""

//   // ── State ─────────────────────────────────────────────
//   const [lessonId, setLessonId] = useState<string>("")
//   const [lessonContent, setLessonContent] = useState<EnhancedLessonContent | null>(null)
//   const [status, setStatus] = useState<LessonStatus>("global")
//   const [isCustomized, setIsCustomized] = useState(false)
//   const [loading, setLoading] = useState(true)

//   // ── Fetch Lesson (school-aware) ───────────────────────
//   useEffect(() => {
//     if (!schoolId || !topicId) return

//     async function fetchLesson() {
//       setLoading(true)

//       try {
//         const res = await getLessonForTeacher(topicId, schoolId)

//         if (!res.success || !res.data) {
//           setLessonContent(null)
//           setLessonId("")
//           setStatus("global")
//           setIsCustomized(false)
//           return
//         }

//         const lesson = res.data

//         setLessonId(lesson.id)
//         setStatus(lesson.status ?? "draft")
//         setIsCustomized(lesson.isCustomized ?? false)

//         const baseContent =
//           lesson.customContent ??
//           lesson.globalLesson?.aiContent ??
//           null

//         setLessonContent(baseContent)

//       } catch (err) {
//         console.error("Lesson fetch error:", err)
//         setLessonContent(null)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchLesson()
//   }, [topicId, schoolId])

//   // ── Publish Lesson (FINAL SAVE) ───────────────────────
//   const handlePublish = async (content: EnhancedLessonContent) => {
//     if (!schoolId || !topicId) return

//     const res = await publishLesson({
//       topicId,
//       schoolId,
//       content
//     })

//     if (res.success) {
//       setStatus("published")
//       setIsCustomized(true)
//     }
//   }

//   // ── Loading State ──────────────────────────────────────
//   if (isProfileLoading || loading) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//         <p className="text-slate-500 font-mono text-[10px] uppercase mt-4">
//           Syncing_Vault...
//         </p>
//       </div>
//     )
//   }

//   // ── Main UI ───────────────────────────────────────────
//   return (
//     <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-8 bg-slate-950 min-h-screen text-slate-50">

//       {/* HEADER */}
//       <header className="space-y-6">
//         <Link
//           href="/teacher"
//           className="text-school-primary text-[10px] font-black uppercase flex items-center gap-2 hover:opacity-70 transition-all w-fit"
//         >
//           <ArrowLeft className="h-3 w-3" />
//           Dashboard
//         </Link>

//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">

//           <div className="flex items-center gap-5">
//             <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center">
//               <BookOpen className="h-7 w-7 text-school-primary" />
//             </div>

//             <div>
//               <div className="flex items-center gap-2 mb-1">
//                 <h1 className="text-3xl font-black tracking-tighter uppercase italic">
//                   Lesson Studio
//                 </h1>

//                 {isCustomized && (
//                   <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-black uppercase">
//                     Customized
//                   </Badge>
//                 )}

//                 {status === "published" && (
//                   <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[9px] font-black uppercase">
//                     Published
//                   </Badge>
//                 )}
//               </div>

//               <p className="text-slate-500 text-sm font-medium">
//                 Topic: <span className="text-slate-300">{topicId}</span>
//               </p>
//             </div>
//           </div>

//         </div>
//       </header>

//       {/* MAIN CONTENT */}
//       <main className="max-w-5xl mx-auto">

//         <AILessonPlanner
//           topicId={topicId}
//           schoolId={schoolId}
//           lessonId={lessonId}
//           topicTitle={
//             lessonContent?.studentContent?.title || "New Lesson Node"
//           }
//           initialData={lessonContent}
//           mode="teacher"
//           onPublish={handlePublish}
//         />

//       </main>

//     </div>
//   )
// }


// 'use client'

// import { use, useEffect, useState } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import {
//   getLessonForTeacher,
//   generateLessonForTopic,
//   saveSchoolLesson,
//   getOrCreateSchoolLesson
// } from "@/app/actions/lesson.actions"

// import {
//   ArrowLeft,
//   BookOpen,
//   Loader2,
// } from "lucide-react"

// import Link from "next/link"
// import { Badge } from "@/components/ui/badge"
// import { AILessonPlanner, type EnhancedLessonContent } from "@/components/TeacherDashboard/ai-learning-planner"
// import { toast } from "sonner"

// interface PageProps {
//   params: Promise<{ topicId: string }>
// }

// export default function LessonStudioPage({ params }: PageProps) {
//   const { topicId } = use(params)
//   const { profile, isLoading: isProfileLoading } = useProfileStore()

//   const schoolId = profile?.schoolId ?? ""

//   const [lessonId, setLessonId] = useState<string>("")
//   const [lessonContent, setLessonContent] = useState<EnhancedLessonContent | null>(null)

//   const [loading, setLoading] = useState(true)
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isCustomized, setIsCustomized] = useState(false)

//   // ─────────────────────────────────────────────
//   // LOAD SCHOOL LESSON (OR CREATE IF NOT EXISTS)
//   // ─────────────────────────────────────────────
//   useEffect(() => {
//     if (!schoolId || !topicId) return

//     async function loadLesson() {
//       setLoading(true)

//       try {
//         const res = await getLessonForTeacher(topicId, schoolId)

//         if (res.success && res.data) {
//           setLessonId(res.data.id)
//           setLessonContent(res.data.aiContent)
//           setIsCustomized(res.data.isCustomized)
//         }
//       } catch (err) {
//         console.error("Failed to load lesson:", err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadLesson()
//   }, [topicId, schoolId])

//   // ─────────────────────────────────────────────
//   // GENERATE GLOBAL AI LESSON → CREATE SCHOOL COPY
//   // ─────────────────────────────────────────────
//   const handleGenerate = async () => {
//     if (!schoolId) return

//     setIsGenerating(true)

//     try {
//       const res = await generateLessonForTopic(topicId, schoolId)

//       if (!res.success || !res.aiContent) {
//         toast.error(res.error || "Generation failed")
//         return
//       }

//       // Ensure school lesson exists and is synced
//       const schoolRes = await getOrCreateSchoolLesson({
//         topicId,
//         schoolId,
//         aiContent: res.aiContent
//       })

//       if (schoolRes.success) {
//         setLessonId(schoolRes.data.id)
//         setLessonContent(schoolRes.data.aiContent)
//         setIsCustomized(false)

//         toast.success("Lesson generated successfully")
//       }

//     } catch (err) {
//       console.error(err)
//       toast.error("Unexpected error generating lesson")
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   // ─────────────────────────────────────────────
//   // SAVE TEACHER EDIT → SCHOOL LESSON + VERSION HISTORY
//   // ─────────────────────────────────────────────
//   const handleSave = async (updatedContent: EnhancedLessonContent) => {
//     if (!schoolId || !lessonId) return

//     try {
//       const res = await saveSchoolLesson({
//         lessonId,
//         schoolId,
//         topicId,
//         aiContent: updatedContent
//       })

//       if (res.success) {
//         setLessonContent(updatedContent)
//         setIsCustomized(true)
//         toast.success("Lesson updated successfully")
//       } else {
//         toast.error("Failed to save lesson")
//       }

//     } catch (err) {
//       console.error(err)
//       toast.error("Save error occurred")
//     }
//   }

//   // ─────────────────────────────────────────────
//   // UI STATES
//   // ─────────────────────────────────────────────
//   if (isProfileLoading || loading) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//         <p className="text-slate-500 text-[10px] uppercase mt-4">
//           Syncing Lesson Vault...
//         </p>
//       </div>
//     )
//   }

//   // ─────────────────────────────────────────────
//   // MAIN UI
//   // ─────────────────────────────────────────────
//   return (
//     <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8 bg-slate-950 min-h-screen text-white">

//       {/* HEADER */}
//       <header className="space-y-6">
//         <Link
//           href="/teacher"
//           className="text-school-primary text-[10px] font-black uppercase flex items-center gap-2 hover:opacity-70 w-fit"
//         >
//           <ArrowLeft className="h-3 w-3" />
//           Dashboard
//         </Link>

//         <div className="flex items-center justify-between border-b border-white/5 pb-6">
//           <div className="flex items-center gap-4">
//             <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center">
//               <BookOpen className="h-7 w-7 text-school-primary" />
//             </div>

//             <div>
//               <h1 className="text-3xl font-black uppercase italic">
//                 Lesson Studio
//               </h1>

//               <p className="text-slate-500 text-sm">
//                 Topic Builder Console
//               </p>
//             </div>
//           </div>

//           {isCustomized && (
//             <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-black uppercase">
//               Customized
//             </Badge>
//           )}
//         </div>
//       </header>

//       {/* MAIN WORKSPACE */}
//       <main className="max-w-5xl mx-auto">

//         {/* ───────────────────────────────
//             NO LESSON STATE (FIRST TIME)
//         ─────────────────────────────── */}
//         {!lessonContent ? (
//           <div className="text-center py-20 bg-slate-900 rounded-3xl border border-white/5 space-y-6">

//             <SparklesIcon />

//             <h2 className="text-2xl font-black uppercase">
//               No Lesson Found
//             </h2>

//             <p className="text-slate-500 text-sm">
//               Generate an AI lesson for this topic
//             </p>

//             <button
//               onClick={handleGenerate}
//               disabled={isGenerating}
//               className="px-8 py-4 bg-school-primary text-black font-black rounded-2xl"
//             >
//               {isGenerating ? (
//                 <span className="flex items-center gap-2">
//                   <Loader2 className="animate-spin w-4 h-4" />
//                   Generating...
//                 </span>
//               ) : (
//                 "Generate Lesson"
//               )}
//             </button>

//           </div>
//         ) : (
//           <AILessonPlanner
//             topicId={topicId}
//             lessonId={lessonId}
//             schoolId={schoolId}
//             topicTitle={lessonContent.studentContent.title}
//             initialData={lessonContent}
//             mode="teacher"
//             onSave={handleSave}
//           />
//         )}

//       </main>
//     </div>
//   )
// }

// // ─────────────────────────────
// // SIMPLE ICON COMPONENT
// // ─────────────────────────────
// function SparklesIcon() {
//   return (
//     <div className="h-16 w-16 mx-auto bg-school-primary/10 rounded-full flex items-center justify-center border border-school-primary/20">
//       <Loader2 className="h-8 w-8 text-school-primary animate-pulse" />
//     </div>
//   )
// }


// 'use client'

// import { use, useEffect, useState, useCallback } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import {
//   getLessonForTeacher,
//   generateLessonForTopic,
//   getOrCreateSchoolLesson
// } from "@/app/actions/lesson.actions"

// import {
//   ArrowLeft,
//   BookOpen,
//   Loader2,
//   Sparkles
// } from "lucide-react"

// import Link from "next/link"
// import { Badge } from "@/components/ui/badge"
// import { AILessonPlanner, type EnhancedLessonContent } from "@/components/TeacherDashboard/ai-learning-planner"
// import { toast } from "sonner"
// import { getErrorMessage } from "@/lib/error-handler"

// interface PageProps {
//   params: Promise<{ topicId: string }>
// }

// export default function LessonStudioPage({ params }: PageProps) {
//   const { topicId } = use(params)
//   const { profile, isLoading: isProfileLoading } = useProfileStore()

//   const schoolId = profile?.schoolId ?? ""

//   const [lessonId, setLessonId] = useState<string>("")
//   const [lessonContent, setLessonContent] = useState<EnhancedLessonContent | null>(null)

//   const [loading, setLoading] = useState(true)
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isCustomized, setIsCustomized] = useState(false)

//   // ─────────────────────────────────────────────
//   // LOAD SCHOOL LESSON
//   // ─────────────────────────────────────────────
//   const loadLesson = useCallback(async () => {
//     if (!schoolId || !topicId) return
//     setLoading(true)

//     try {
//       const res = await getLessonForTeacher(topicId, schoolId)

//       if (res.success && res.data) {
//         setLessonId(res.data.id)
        
//         /**
//          * RESOLUTION: Handle Union Type.
//          * SchoolLesson uses 'customContent', Global fallback uses 'aiContent'.
//          * We extract the JSON regardless of the source.
//          */
//         const rawContent = (res.data as any).customContent || (res.data as any).aiContent;
//         setLessonContent(rawContent as EnhancedLessonContent)
//         setIsCustomized(res.data.isCustomized || false)
//       }
//     } catch (err) {
//       console.error(getErrorMessage(err))
//     } finally {
//       setLoading(false)
//     }
//   }, [schoolId, topicId])

//   useEffect(() => {
//     loadLesson()
//   }, [loadLesson])

//   // ─────────────────────────────────────────────
//   // GENERATE AI LESSON
//   // ─────────────────────────────────────────────
//   const handleGenerate = async () => {
//     if (!schoolId) return toast.error("Institutional ID missing")

//     setIsGenerating(true)

//     try {
//       // FIX: Signature matches (topicId, schoolId)
//       const res = await generateLessonForTopic(topicId, schoolId)

//       if (!res.success || !res.aiContent) {
//         toast.error(res.error || "Generation failed")
//         return
//       }

//       /**
//        * FIX: Removed 'aiContent' from params as getOrCreateSchoolLesson 
//        * handles the content transfer from global internally.
//        */
//       const schoolRes = await getOrCreateSchoolLesson({
//         topicId,
//         schoolId,
//       })

//       if (schoolRes.success && schoolRes.data) {
//         setLessonId(schoolRes.data.id)
        
//         // Use either customContent or fallback to the newly generated global content
//         const content = schoolRes.data.customContent || res.aiContent;
//         setLessonContent(content as unknown as EnhancedLessonContent)
//         setIsCustomized(false)

//         toast.success("Lesson generated successfully")
//       }

//     } catch (err) {
//       toast.error(getErrorMessage(err))
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   // ─────────────────────────────────────────────
//   // UI STATES
//   // ─────────────────────────────────────────────
//   if (isProfileLoading || loading) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//         <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4 animate-pulse">
//           Syncing Lesson Vault...
//         </p>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8 bg-slate-950 min-h-screen text-white">

//       {/* HEADER */}
//       <header className="space-y-6">
//         <Link
//           href="/teacher"
//           className="text-school-primary text-[10px] font-black uppercase flex items-center gap-2 hover:opacity-70 w-fit"
//         >
//           <ArrowLeft className="h-3 w-3" />
//           Dashboard
//         </Link>

//         <div className="flex items-center justify-between border-b border-white/5 pb-6">
//           <div className="flex items-center gap-4">
//             <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center">
//               <BookOpen className="h-7 w-7 text-school-primary" />
//             </div>

//             <div>
//               <h1 className="text-3xl font-black uppercase italic tracking-tighter">
//                 Lesson Studio
//               </h1>
//               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
//                 Topic Builder Console
//               </p>
//             </div>
//           </div>

//           {isCustomized && (
//             <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-black uppercase px-4 py-1 rounded-full">
//               Customized
//             </Badge>
//           )}
//         </div>
//       </header>

//       {/* MAIN WORKSPACE */}
//       <main className="max-w-5xl mx-auto">
//         {!lessonContent ? (
//           <div className="text-center py-32 bg-slate-900/50 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
//             <div className="h-20 w-20 bg-school-primary/10 rounded-full flex items-center justify-center mx-auto border border-school-primary/20">
//                 <Sparkles className="h-10 w-10 text-school-primary animate-pulse" />
//             </div>

//             <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
//               Registry Empty
//             </h2>

//             <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">
//               Synthesize an AI lesson blueprint for this topic
//             </p>

//             <button
//               onClick={handleGenerate}
//               disabled={isGenerating}
//               className="px-10 py-5 bg-school-primary text-slate-950 font-black rounded-2xl uppercase text-[10px] tracking-widest hover:scale-105 transition-all disabled:opacity-20"
//             >
//               {isGenerating ? (
//                 <span className="flex items-center gap-2">
//                   <Loader2 className="animate-spin w-4 h-4" />
//                   Processing...
//                 </span>
//               ) : (
//                 "Initialize AI Generation"
//               )}
//             </button>
//           </div>
//         ) : (
//           <AILessonPlanner
//             topicId={topicId}
//             lessonId={lessonId}
//             schoolId={schoolId}
//             topicTitle={lessonContent.studentContent.title}
//             initialData={lessonContent}
//             mode="teacher"
//             // FIX: Removed 'onSave' as the AILessonPlanner handles internal saves via its mode
//           />
//         )}
//       </main>
//     </div>
//   )
// }



'use client'

import { use, useEffect, useState, useCallback } from "react"
import { useProfileStore } from "@/store/profileStore"
import {
  getLessonForTeacher,
  generateLessonForTopic,
  getOrCreateSchoolLesson
} from "@/app/actions/lesson.actions"

import {
  ArrowLeft,
  BookOpen,
  Loader2,
  Sparkles
} from "lucide-react"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { AILessonPlanner, type EnhancedLessonContent } from "@/components/TeacherDashboard/ai-learning-planner"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/error-handler"
import { SchoolLesson, GlobalLesson } from "@prisma/client"

// ── Types ───────────────────────────────────────────────────────────────────

/**
 * Represents the structure of the data returned by getLessonForTeacher.
 * Standardizes the union between SchoolLesson and the fallback GlobalLesson.
 */
interface TeacherLessonResponse {
  id: string;
  customContent: unknown;
  isCustomized: boolean;
  globalLesson?: GlobalLesson;
}

interface PageProps {
  params: Promise<{ topicId: string }>
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function LessonStudioPage({ params }: PageProps) {
  const { topicId } = use(params)
  const { profile, isLoading: isProfileLoading } = useProfileStore()

  const schoolId = profile?.schoolId ?? ""

  const [lessonId, setLessonId] = useState<string>("")
  const [lessonContent, setLessonContent] = useState<EnhancedLessonContent | null>(null)

  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCustomized, setIsCustomized] = useState(false)

  // ─────────────────────────────────────────────
  // LOAD SCHOOL LESSON
  // ─────────────────────────────────────────────
  const loadLesson = useCallback(async () => {
    if (!schoolId || !topicId) return
    setLoading(true)

    try {
      const res = await getLessonForTeacher(topicId, schoolId)

      if (res.success && res.data) {
        // Safe casting from the action's standard return
        const data = res.data as TeacherLessonResponse;
        
        setLessonId(data.id)
        setLessonContent(data.customContent as EnhancedLessonContent)
        setIsCustomized(data.isCustomized)
      }
    } catch (err) {
      console.error("[LOAD_LESSON_ERROR]:", getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [schoolId, topicId])

  useEffect(() => {
    loadLesson()
  }, [loadLesson])

  // ─────────────────────────────────────────────
  // GENERATE AI LESSON
  // ─────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!schoolId) return toast.error("Institutional ID missing")

    setIsGenerating(true)

    try {
      const res = await generateLessonForTopic(topicId, schoolId)

      if (!res.success || !res.aiContent) {
        toast.error(res.error || "Generation failed")
        return
      }

      const schoolRes = await getOrCreateSchoolLesson({
        topicId,
        schoolId,
      })

      if (schoolRes.success && schoolRes.data) {
        const data = schoolRes.data as SchoolLesson;
        setLessonId(data.id)
        
        // Use the customContent generated during the creation process
        setLessonContent(data.customContent as unknown as EnhancedLessonContent)
        setIsCustomized(false)

        toast.success("Lesson generated successfully")
      }

    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsGenerating(false)
    }
  }

  // ─────────────────────────────────────────────
  // UI STATES
  // ─────────────────────────────────────────────
  if (isProfileLoading || loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4 animate-pulse">
          Syncing Lesson Vault...
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8 bg-slate-950 min-h-screen text-white">

      {/* HEADER */}
      <header className="space-y-6">
        <Link
          href="/teacher"
          className="text-school-primary text-[10px] font-black uppercase flex items-center gap-2 hover:opacity-70 w-fit"
        >
          <ArrowLeft className="h-3 w-3" />
          Dashboard
        </Link>

        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center">
              <BookOpen className="h-7 w-7 text-school-primary" />
            </div>

            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
                Lesson Studio
              </h1>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                Topic Builder Console
              </p>
            </div>
          </div>

          {isCustomized && (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-black uppercase px-4 py-1 rounded-full">
              Customized
            </Badge>
          )}
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="max-w-5xl mx-auto">
        {!lessonContent ? (
          <div className="text-center py-32 bg-slate-900/50 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
            <div className="h-20 w-20 bg-school-primary/10 rounded-full flex items-center justify-center mx-auto border border-school-primary/20">
                <Sparkles className="h-10 w-10 text-school-primary animate-pulse" />
            </div>

            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
              Registry Empty
            </h2>

            <p className="text-slate-500 text-xs uppercase font-bold tracking-widest leading-relaxed max-w-xs mx-auto">
              Initialize the AI engine to synthesize a lesson blueprint for this topic.
            </p>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-10 py-5 bg-school-primary text-slate-950 font-black rounded-2xl uppercase text-[10px] tracking-widest hover:scale-105 transition-all disabled:opacity-20 shadow-xl shadow-school-primary/10"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Generating...
                </span>
              ) : (
                "Generate Lesson"
              )}
            </button>
          </div>
        ) : (
          <AILessonPlanner
            topicId={topicId}
            lessonId={lessonId}
            schoolId={schoolId}
            topicTitle={lessonContent.studentContent.title}
            initialData={lessonContent}
            mode="teacher"
          />
        )}
      </main>
    </div>
  )
}