


// 'use client'

// import { SubjectSelector } from "@/components/TeacherDashboard/exams/subjectSelector"
// import { SyllabusSelector } from "@/components/TeacherDashboard/exams/syllabusSelector"
// import { SettingsSidebar } from "@/components/TeacherDashboard/exams/settingsSidebar"
// import { ExamDocumentPreview } from "@/components/TeacherDashboard/exams/ExamDocumentPreview"

// import { useState, useEffect, useTransition, useCallback } from 'react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card } from '@/components/ui/card'

// import {
//   getTeacherAuthorizedAssignments,
//   getClassesByGradeLevel,
//   getGroupedTopics,
//   buildExamPool,
//   finalizeAndDeployExam,
//   getAdminExamRegistry,
//   getTeacherExamHistory,
//   getExamQuestions
// } from '@/app/actions/exam-engine.actions'

// import { useProfileStore } from '@/store/profileStore'

// import {
//   CheckCircle2,
//   Zap,
//   Database,
//   FileText,
//   Eye
// } from 'lucide-react'

// import { toast } from 'sonner'
// import { ExamStatCard } from '@/components/shared/examComponent'

// export default function TeacherExamArchitect() {

//   const { profile } = useProfileStore()
//   const [isPending, startTransition] = useTransition()

//   const [activeTab, setActiveTab] = useState("vault")
//   // const [step, setStep] = useState<1 | 2>(1)
//   const [isViewOnly, setIsViewOnly] = useState(false)

//   const [assignments, setAssignments] = useState<any[]>([])
//   const [validClassrooms, setValidClassrooms] = useState<any[]>([])
//   const [termGroups, setTermGroups] = useState<any[]>([])
//   const [generatedPool, setGeneratedPool] = useState<any[]>([])
//   const [stats, setStats] = useState<any>(null)
//   const [examHistory, setExamHistory] = useState<any[]>([])

//   const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
//   const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
//   const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])
//   const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

//   const [config, setConfig] = useState({
//     title: '',
//     duration: 60,
//     totalQuestions: 20,
//     reusePercentage: 30
//   })

//   // ----------------------------
//   // Load Registry Data
//   // ----------------------------

//   const loadRegistry = useCallback(async () => {

//     if (!profile?.id || !profile?.schoolId) return

//     const [history, authAssignments, adminStats] = await Promise.all([
//       getTeacherExamHistory(profile.id, profile.schoolId),
//       getTeacherAuthorizedAssignments(profile.id, profile.schoolId),
//       getAdminExamRegistry(profile.schoolId)
//     ])

//     setExamHistory(history)
//     setAssignments(authAssignments)

//     if (adminStats.success) {
//       setStats(adminStats.stats)
//     }

//   }, [profile])


//   useEffect(() => {
//     loadRegistry()
//   }, [loadRegistry])


//   // ----------------------------
//   // Load topics + classrooms
//   // ----------------------------

//   useEffect(() => {

//     if (!selectedAssignment || !profile?.schoolId) return

//     getGroupedTopics(selectedAssignment.id).then(setTermGroups)

//     getClassesByGradeLevel(
//       selectedAssignment.gradeId,
//       profile.schoolId
//     ).then(setValidClassrooms)

//     setSelectedTopicIds([])
//     setSelectedClassIds([])

//   }, [selectedAssignment, profile?.schoolId])




  

//   // ----------------------------
//   // Build Exam Pool
//   // ----------------------------

//   const handleBuildPool = () => {

//     if (!config.title || selectedClassIds.length === 0 || selectedTopicIds.length === 0) {
//       return toast.error("Deployment parameters incomplete.")
//     }

//     startTransition(async () => {

//       const res = await buildExamPool({
//         topicIds: selectedTopicIds,
//         totalQuestions: config.totalQuestions,
//         reusePercentage: config.reusePercentage,
//         schoolId: profile!.schoolId!
//       })

//       if (!res.success) {
//         toast.error(res.error || "Failed to build pool")
//         return
//       }

//       setGeneratedPool(res.questions ?? [])
//       setIsViewOnly(false)
//       setStep(2)

//     })

//   }


//   // ----------------------------
//   // Deploy Exam
//   // ----------------------------

//   const handleFinalDeploy = (questions: any[]) => {

//     startTransition(async () => {

//       const res = await finalizeAndDeployExam(
//         {
//           ...config,
//           teacherId: profile!.id,
//           classIds: selectedClassIds,
//           schoolId: profile!.schoolId!,
//           topicIds: selectedTopicIds,
//           termId: termGroups[0]?.id || '',
//           type: 'TERMLY'
//         },
//         questions
//       )

//       if (!res.success) {
//         toast.error(res.error || "Failed to deploy")
//         return
//       }

//       toast.success("Exam Deployed to Registry")

//       setStep(1)
//       setActiveTab("vault")
//       loadRegistry()

//     })

//   }


//   // ----------------------------
//   // View History
//   // ----------------------------

//   const handleViewHistory = async (exam: any) => {

//     const questions = await getExamQuestions(exam.id)

//     setGeneratedPool(questions)

//     setConfig(prev => ({
//       ...prev,
//       title: exam.title,
//       totalQuestions: questions.length
//     }))

//     setIsViewOnly(true)
//     setStep(2)
//     setActiveTab("create")

//   }


//   // ----------------------------
//   // Toggle Class Selection
//   // ----------------------------

//   const toggleClass = (id: string) => {

//     setSelectedClassIds(prev =>
//       prev.includes(id)
//         ? prev.filter(i => i !== id)
//         : [...prev, id]
//     )

//   }


//   return (

//     <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-10">

//       {/* Header */}

//       <header className="flex items-center gap-5 border-b border-white/5 pb-10">

//         <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center">
//           <FileText className="h-7 w-7 text-school-primary" />
//         </div>

//         <div>
//           <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
//             Exam Architect
//           </h1>

//           <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">
//             Institutional Assessment Generation & Vault Management
//           </p>
//         </div>

//       </header>


//       {/* Stats */}

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//         <ExamStatCard
//           label="Subject Bank"
//           value={stats?.totalExams ?? 0}
//           sub="Items available"
//           icon={Database}
//         />

//         <ExamStatCard
//           label="Active Sessions"
//           value="Live"
//           sub="CBT Engine Online"
//           icon={Zap}
//           colorClass="text-school-primary"
//         />

//         <ExamStatCard
//           label="Grading Index"
//           value={`${stats?.completionRate ?? 0}%`}
//           sub="Global Grad Rate"
//           icon={CheckCircle2}
//           colorClass="text-emerald-500"
//         />

//       </div>


//       {/* Tabs */}

//       <Tabs value={activeTab} onValueChange={setActiveTab}>

//         <TabsList className="bg-slate-900 border border-white/5 p-1 rounded-2xl mb-8">
//           <TabsTrigger value="vault">Exam Vault</TabsTrigger>
//           <TabsTrigger value="create">Drafting Room</TabsTrigger>
//         </TabsList>


//         {/* Exam Vault */}

//         <TabsContent value="vault">

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//             {examHistory.length === 0 ? (

//               <div className="col-span-full py-20 text-center opacity-30 uppercase text-xs font-black tracking-widest">
//                 Registry is empty
//               </div>

//             ) : (

//               examHistory.map((exam) => (

//                 <Card
//                   key={exam.id}
//                   className="p-8 bg-slate-900 border-white/5 rounded-3xl"
//                 >

//                   <h3 className="font-bold text-xl uppercase italic">
//                     {exam.title}
//                   </h3>

//                   <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest font-black">
//                     {exam.class.name} • {exam._count.questions} Items
//                   </p>

//                   <button
//                     onClick={() => handleViewHistory(exam)}
//                     className="mt-6 flex items-center gap-2 text-slate-400 hover:text-school-primary font-black uppercase text-[10px]"
//                   >
//                     <Eye className="h-4 w-4" />
//                     Open Registry File
//                   </button>

//                 </Card>

//               ))

//             )}

//           </div>

//         </TabsContent>


//         {/* Drafting Room */}

//         <TabsContent value="create">

//           {step === 1 ? (

//             <DraftBuilder
//               assignments={assignments}
//               selectedAssignment={selectedAssignment}
//               setSelectedAssignment={setSelectedAssignment}
//               termGroups={termGroups}
//               selectedTopicIds={selectedTopicIds}
//               setSelectedTopicIds={setSelectedTopicIds}
//               validClassrooms={validClassrooms}
//               selectedClassIds={selectedClassIds}
//               toggleClass={toggleClass}
//               config={config}
//               setConfig={setConfig}
//               handleBuildPool={handleBuildPool}
//               isPending={isPending}
//             />

//           ) : (

//             <ExamDocumentPreview
//               generatedPool={generatedPool}
//               config={config}
//               handleFinalDeploy={handleFinalDeploy}
//               setStep={setStep}
//               isViewOnly={isViewOnly}
//               isPending={isPending}
//             />

//           )}

//         </TabsContent>

//       </Tabs>

//     </div>

//   )

// }


// // Draft Builder Component

// function DraftBuilder({
//   assignments,
//   selectedAssignment,
//   setSelectedAssignment,
//   termGroups,
//   selectedTopicIds,
//   setSelectedTopicIds,
//   validClassrooms,
//   selectedClassIds,
//   toggleClass,
//   config,
//   setConfig,
//   handleBuildPool,
//   isPending
// }: any) {

//   return (

//     <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in">

//       <SubjectSelector
//         assignments={assignments}
//         selectedAssignment={selectedAssignment}
//         setSelectedAssignment={setSelectedAssignment}
//       />

//       <SyllabusSelector
//         termGroups={termGroups}
//         selectedTopicIds={selectedTopicIds}
//         setSelectedTopicIds={setSelectedTopicIds}
//       />

//       <SettingsSidebar
//         validClassrooms={validClassrooms}
//         selectedClassIds={selectedClassIds}
//         toggleClass={toggleClass}
//         config={config}
//         setConfig={setConfig}
//         handleBuildPool={handleBuildPool}
//         isPending={isPending}
//       />

//     </div>

//   )

// }


// 'use client'

// import { useState, useEffect, useTransition, useCallback } from 'react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card } from '@/components/ui/card'
// import { toast } from 'sonner'

// import { useProfileStore } from '@/store/profileStore'

// import {
//   getTeacherAuthorizedAssignments,
//   getClassesByGradeLevel,
//   getGroupedTopics,
//   buildExamPool,
//   finalizeAndDeployExam,
//   getAdminExamRegistry,
//   getTeacherExamHistory,
//   getExamQuestions
// } from '@/app/actions/exam-engine.actions'

// import { ExamDocumentPreview } from "@/components/TeacherDashboard/exams/ExamDocumentPreview"
// import { ExamStatCard } from '@/components/shared/examComponent'

// import {
//   CheckCircle2,
//   Zap,
//   Database,
//   FileText,
//   Eye
// } from 'lucide-react'

// import { SubjectSelector } from "@/components/TeacherDashboard/exams/subjectSelector"
// import { SyllabusSelector } from "@/components/TeacherDashboard/exams/syllabusSelector"
// import { SettingsSidebar } from "@/components/TeacherDashboard/exams/settingsSidebar"

// /* ---------------- STEP GUIDE ---------------- */
// function StepGuide({ title, description }: any) {
//   return (
//     <div className="bg-slate-900 border border-white/5 rounded-2xl p-5">
//       <h3 className="text-sm font-black uppercase text-school-primary">
//         {title}
//       </h3>
//       <p className="text-xs text-slate-400 mt-1 leading-relaxed">
//         {description}
//       </p>
//     </div>
//   )
// }

// export default function TeacherExamArchitect() {

//   const { profile } = useProfileStore()
//   const [isPending, startTransition] = useTransition()

//   /* ---------------- WIZARD STATE ---------------- */
//   const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
//   const progress = (step / 4) * 100

//   const [activeTab, setActiveTab] = useState("vault")
//   const [isViewOnly, setIsViewOnly] = useState(false)

//   /* ---------------- DATA ---------------- */
//   const [assignments, setAssignments] = useState<any[]>([])
//   const [validClassrooms, setValidClassrooms] = useState<any[]>([])
//   const [termGroups, setTermGroups] = useState<any[]>([])
//   const [examHistory, setExamHistory] = useState<any[]>([])
//   const [generatedPool, setGeneratedPool] = useState<any[]>([])
//   const [stats, setStats] = useState<any>(null)

//   /* ---------------- SELECTIONS ---------------- */
//   const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
//   const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
//   const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])

//   const [config, setConfig] = useState({
//     title: '',
//     duration: 60,
//     totalQuestions: 20,
//     reusePercentage: 30
//   })

//   /* ---------------- LOAD DATA ---------------- */
//   const loadRegistry = useCallback(async () => {

//     if (!profile?.id || !profile?.schoolId) return

//     const [history, authAssignments, adminStats] = await Promise.all([
//       getTeacherExamHistory(profile.id, profile.schoolId),
//       getTeacherAuthorizedAssignments(profile.id, profile.schoolId),
//       getAdminExamRegistry(profile.schoolId)
//     ])

//     setExamHistory(history)
//     setAssignments(authAssignments)

//     if (adminStats.success) {
//       setStats(adminStats.stats)
//     }

//   }, [profile])

//   useEffect(() => {
//     loadRegistry()
//   }, [loadRegistry])

//   /* ---------------- TOPICS ---------------- */
//   useEffect(() => {
//     if (!selectedAssignment || !profile?.schoolId) return

//     getGroupedTopics(selectedAssignment.id).then(setTermGroups)

//     getClassesByGradeLevel(
//       selectedAssignment.gradeId,
//       profile.schoolId
//     ).then(setValidClassrooms)

//     setSelectedTopicIds([])
//     setSelectedClassIds([])

//   }, [selectedAssignment, profile?.schoolId])

//   /* ---------------- BUILD POOL ---------------- */
//   const handleBuildPool = () => {

//     if (!config.title || selectedClassIds.length === 0 || selectedTopicIds.length === 0) {
//       return toast.error("Complete all required fields")
//     }

//     startTransition(async () => {

//       const res = await buildExamPool({
//         topicIds: selectedTopicIds,
//         totalQuestions: config.totalQuestions,
//         reusePercentage: config.reusePercentage,
//         schoolId: profile!.schoolId!
//       })

//       if (!res.success) {
//          toast.error(res.error)
//       }

//       setGeneratedPool(res.questions ?? [])
//       setStep(4)

//       toast.success("Questions generated successfully")

//     })
//   }

//   /* ---------------- DEPLOY ---------------- */
//   const handleFinalDeploy = async (questions: any[]) => {

//     startTransition(async () => {

//       const res = await finalizeAndDeployExam(
//         {
//           ...config,
//           teacherId: profile!.id,
//           classIds: selectedClassIds,
//           schoolId: profile!.schoolId!,
//           topicIds: selectedTopicIds,
//           termId: termGroups[0]?.id || '',
//           type: 'TERMLY'
//         },
//         questions
//       )

//       if (!res.success) {
//          toast.error(res.error)
//       }

//       toast.success("Exam deployed successfully")

//       setStep(1)
//       setActiveTab("vault")
//       loadRegistry()

//     })
//   }

//   /* ---------------- VIEW HISTORY ---------------- */
//   const handleViewHistory = async (exam: any) => {

//     const questions = await getExamQuestions(exam.id)

//     setGeneratedPool(questions)

//     setConfig(prev => ({
//       ...prev,
//       title: exam.title,
//       totalQuestions: questions.length
//     }))

//     setIsViewOnly(true)
//     setStep(4)
//     setActiveTab("create")
//   }

//   /* ---------------- TOGGLE CLASS ---------------- */
//   const toggleClass = (id: string) => {
//     setSelectedClassIds(prev =>
//       prev.includes(id)
//         ? prev.filter(i => i !== id)
//         : [...prev, id]
//     )
//   }

//   return (
//     <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-10">

//       {/* HEADER */}
//       <header className="flex items-center gap-5 border-b border-white/5 pb-8">
//         <div className="h-14 w-14 rounded-2xl bg-school-primary/10 flex items-center justify-center">
//           <FileText className="h-7 w-7 text-school-primary" />
//         </div>
//         <div>
//           <h1 className="text-4xl font-black uppercase">Exam Architect</h1>
//           <p className="text-slate-500 text-sm">
//             AI-powered exam generation system
//           </p>
//         </div>
//       </header>

//       {/* PROGRESS */}
//       <div className="space-y-2">
//         <div className="flex justify-between text-xs text-slate-500 uppercase">
//           <span>Progress</span>
//           <span>Step {step} / 4</span>
//         </div>

//         <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
//           <div
//             className="h-full bg-school-primary transition-all"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       </div>

//       {/* TABS */}
//       <Tabs value={activeTab} onValueChange={setActiveTab}>

//         <TabsList className="bg-slate-900 p-1 rounded-xl">
//           <TabsTrigger value="vault">Vault</TabsTrigger>
//           <TabsTrigger value="create">Create</TabsTrigger>
//         </TabsList>

//         {/* VAULT */}
//         <TabsContent value="vault">
//           <div className="grid md:grid-cols-3 gap-6 mt-6">
//             {examHistory.map((exam) => (
//               <Card key={exam.id} className="p-6 bg-slate-900">
//                 <h3 className="font-bold">{exam.title}</h3>
//                 <p className="text-xs text-slate-500">
//                   {exam.class.name} • {exam._count.questions}
//                 </p>

//                 <button
//                   onClick={() => handleViewHistory(exam)}
//                   className="mt-3 text-school-primary text-xs uppercase"
//                 >
//                   View
//                 </button>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>

//         {/* CREATE */}
//         <TabsContent value="create">

//           {/* STEP 1 */}
//           {step === 1 && (
//             <div className="space-y-6">

//               <StepGuide
//                 title="Step 1: Select Subject"
//                 description="Choose subject for exam generation."
//               />

//               <SubjectSelector
//                 assignments={assignments}
//                 selectedAssignment={selectedAssignment}
//                 setSelectedAssignment={(val: any) => {
//                   setSelectedAssignment(val)
//                   setStep(2)
//                 }}
//               />
//             </div>
//           )}

//           {/* STEP 2 */}
//           {step === 2 && (
//             <div className="space-y-6">

//               <StepGuide
//                 title="Step 2: Select Topics"
//                 description="Pick topics for question generation."
//               />

//               <SyllabusSelector
//                 termGroups={termGroups}
//                 selectedTopicIds={selectedTopicIds}
//                 setSelectedTopicIds={setSelectedTopicIds}
//               />

//               {/* NEXT BUTTON FIX */}
//               <button
//                 onClick={() => {
//                   if (selectedTopicIds.length === 0) {
//                     return toast.error("Select at least one topic")
//                   }
//                   setStep(3)
//                 }}
//                 className="bg-school-primary text-black px-6 py-3 rounded-xl font-bold"
//               >
//                 Next
//               </button>

//             </div>
//           )}

//           {/* STEP 3 */}
//           {step === 3 && (
//             <div className="space-y-6">

//               <StepGuide
//                 title="Step 3: Configure Exam"
//                 description="Set title, duration, classes and settings."
//               />

//               <SettingsSidebar
//                 validClassrooms={validClassrooms}
//                 selectedClassIds={selectedClassIds}
//                 toggleClass={toggleClass}
//                 config={config}
//                 setConfig={setConfig}
//                 handleBuildPool={handleBuildPool}
//                 isPending={isPending}
//               />

//             </div>
//           )}

//           {/* STEP 4 */}
//           {step === 4 && (
//             <ExamDocumentPreview
//               generatedPool={generatedPool}
//               config={config}
//               setStep={setStep}
//               isViewOnly={isViewOnly}
//               isPending={isPending}
//               handleFinalDeploy={handleFinalDeploy}
//             />
//           )}

//         </TabsContent>

//       </Tabs>

//     </div>
//   )
// }


// 'use client'

// import { useState, useEffect, useTransition, useCallback } from "react"
// import { Card } from "@/components/ui/card"
// import { toast } from "sonner"
// import { ArrowLeft, ArrowRight } from "lucide-react"

// import {
//   getTeacherAuthorizedAssignments,
//   getClassesByGradeLevel,
//   getGroupedTopics,
//   buildExamPool,
//   finalizeAndDeployExam,
//   getAdminExamRegistry,
//   getTeacherExamHistory,
//   getExamQuestions
// } from "@/app/actions/exam-engine.actions"

// import { useProfileStore } from "@/store/profileStore"

// import { SubjectSelector } from "@/components/TeacherDashboard/exams/subjectSelector"
// import { SyllabusSelector } from "@/components/TeacherDashboard/exams/syllabusSelector"
// import { SettingsSidebar } from "@/components/TeacherDashboard/exams/settingsSidebar"
// import { ExamDocumentPreview } from "@/components/TeacherDashboard/exams/ExamDocumentPreview"

// export default function TeacherExamArchitect() {
//   const { profile } = useProfileStore()
//   const [isPending, startTransition] = useTransition()

//   // ---------------- STEPS ----------------
//   const [step, setStep] = useState(1)

//   // ---------------- DATA ----------------
//   const [assignments, setAssignments] = useState<any[]>([])
//   const [termGroups, setTermGroups] = useState<any[]>([])
//   const [validClassrooms, setValidClassrooms] = useState<any[]>([])
//   const [generatedPool, setGeneratedPool] = useState<any[]>([])

//   // ---------------- SELECTIONS ----------------
//   const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
//   const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
//   const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])

//   // ---------------- CONFIG ----------------
//   const [config, setConfig] = useState({
//     title: "",
//     duration: 60,
//     totalQuestions: 20,
//     reusePercentage: 30
//   })

//   // ---------------- LOAD ----------------
//   const loadAssignments = useCallback(async () => {
//     if (!profile?.id || !profile?.schoolId) return

//     const data = await getTeacherAuthorizedAssignments(profile.id, profile.schoolId)
//     setAssignments(data)
//   }, [profile])

//   useEffect(() => {
//     loadAssignments()
//   }, [loadAssignments])

//   // ---------------- SUBJECT → TOPICS ----------------
//   useEffect(() => {
//     if (!selectedAssignment || !profile?.schoolId) return

//     getGroupedTopics(selectedAssignment.id).then(setTermGroups)
//     getClassesByGradeLevel(selectedAssignment.gradeId, profile.schoolId).then(setValidClassrooms)

//     setSelectedTopicIds([])
//     setSelectedClassIds([])
//   }, [selectedAssignment])

//   // ---------------- NAV ----------------
//   const next = () => setStep((s) => Math.min(s + 1, 4))
//   const back = () => setStep((s) => Math.max(s - 1, 1))

//   // ---------------- GENERATE ----------------
//   const handleGenerate = () => {
//     if (selectedTopicIds.length === 0) {
//       return toast.error("Select at least one topic")
//     }

//     startTransition(async () => {
//       const res = await buildExamPool({
//         topicIds: selectedTopicIds,
//         totalQuestions: config.totalQuestions,
//         reusePercentage: config.reusePercentage,
//         schoolId: profile!.schoolId!
//       })

//       if (!res.success)
//         toast.error(res.error)

//       setGeneratedPool(res.questions || [])
//       next()
//     })
//   }

//   // ---------------- DEPLOY ----------------
//   const handleDeploy = () => {
//     startTransition(async () => {
//       const res = await finalizeAndDeployExam(
//         {
//           ...config,
//           teacherId: profile!.id,
//           classIds: selectedClassIds,
//           schoolId: profile!.schoolId!,
//           topicIds: selectedTopicIds,
//           termId: termGroups[0]?.id || "",
//           type: "TERMLY"
//         },
//         generatedPool
//       )

//       if (!res.success)
//         toast.error(res.error)

//       toast.success("Exam deployed successfully")
//       setStep(1)
//     })
//   }

//   // ---------------- UI ----------------
//   return (
//     <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-6">

//       {/* HEADER */}
//       <div>
//         <h1 className="text-3xl font-black">Exam Builder Wizard</h1>
//         <p className="text-slate-400 text-sm">Step {step} of 4</p>
//       </div>

//       {/* PROGRESS */}
//       <div className="h-2 bg-slate-800 rounded-full">
//         <div
//           className="h-2 bg-green-500 rounded-full transition-all"
//           style={{ width: `${(step / 4) * 100}%` }}
//         />
//       </div>

//       {/* STEP 1: SUBJECT */}
//       {step === 1 && (
//         <Card className="p-6 space-y-4">
//           <h2 className="font-bold">Step 1: Select Subject</h2>

//           <SubjectSelector
//             assignments={assignments}
//             selectedAssignment={selectedAssignment}
//             setSelectedAssignment={setSelectedAssignment}
//           />

//           <button
//             disabled={!selectedAssignment}
//             onClick={next}
//             className="bg-green-500 px-6 py-2 rounded-lg flex items-center gap-2"
//           >
//             Next <ArrowRight className="h-4 w-4" />
//           </button>
//         </Card>
//       )}

//       {/* STEP 2: TOPICS */}
//       {step === 2 && (
//         <Card className="p-6 space-y-4">
//           <h2 className="font-bold">Step 2: Select Topics</h2>

//           <SyllabusSelector
//             termGroups={termGroups}
//             selectedTopicIds={selectedTopicIds}
//             setSelectedTopicIds={setSelectedTopicIds}
//           />

//           <div className="flex justify-between">
//             <button onClick={back}>Back</button>

//             <button
//               onClick={next}
//               disabled={selectedTopicIds.length === 0}
//               className="bg-green-500 px-6 py-2 rounded-lg"
//             >
//               Next
//             </button>
//           </div>
//         </Card>
//       )}

//       {/* STEP 3: CLASS + CONFIG */}
//       {/* STEP 3: CLASS + CONFIG */}
// {step === 3 && (
//   <Card className="p-6 space-y-6">

//     <h2 className="font-bold text-lg">
//       Step 3: Select Classes & Configure Exam
//     </h2>

//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//       {/* LEFT SIDE: CLASS + SETTINGS */}
//       <div className="space-y-4">

//         <SettingsSidebar
//           validClassrooms={validClassrooms}
//           selectedClassIds={selectedClassIds}
//           toggleClass={(id: string) =>
//             setSelectedClassIds((prev) =>
//               prev.includes(id)
//                 ? prev.filter((i) => i !== id)
//                 : [...prev, id]
//             )
//           }
//           config={config}
//           setConfig={setConfig}
//           handleBuildPool={handleGenerate}
//           isPending={isPending}
//         />

//       </div>

//       {/* RIGHT SIDE: SELECTED TOPICS SUMMARY */}
//       <div className="space-y-4">

//         <Card className="p-4 bg-slate-900 border border-white/10">
//           <h3 className="font-bold text-sm mb-3 uppercase tracking-widest text-slate-400">
//             Selected Topics
//           </h3>

//           {selectedTopicIds.length === 0 ? (
//             <p className="text-slate-500 text-sm">
//               No topics selected
//             </p>
//           ) : (
//             <ul className="space-y-2">
//               {termGroups
//                 .flatMap((group: any) => group.topics || group)
//                 .filter((t: any) => selectedTopicIds.includes(t.id))
//                 .map((topic: any) => (
//                   <li
//                     key={topic.id}
//                     className="text-sm bg-slate-800 px-3 py-2 rounded-lg"
//                   >
//                     📘 {topic.title}
//                   </li>
//                 ))}
//             </ul>
//           )}
//         </Card>

//         {/* CLASS SUMMARY */}
//         <Card className="p-4 bg-slate-900 border border-white/10">
//           <h3 className="font-bold text-sm mb-3 uppercase tracking-widest text-slate-400">
//             Selected Classes
//           </h3>

//           {selectedClassIds.length === 0 ? (
//             <p className="text-slate-500 text-sm">
//               No classes selected
//             </p>
//           ) : (
//             <ul className="space-y-2">
//               {validClassrooms
//                 .filter((c: any) => selectedClassIds.includes(c.id))
//                 .map((cls: any) => (
//                   <li
//                     key={cls.id}
//                     className="text-sm bg-slate-800 px-3 py-2 rounded-lg"
//                   >
//                     🏫 {cls.name}
//                   </li>
//                 ))}
//             </ul>
//           )}
//         </Card>

//       </div>

//     </div>

//     {/* NAVIGATION */}
//     <div className="flex justify-between pt-4 border-t border-white/10">

//       <button onClick={back} className="text-slate-400">
//         Back
//       </button>

//       <button
//         onClick={handleGenerate}
//         disabled={
//           selectedClassIds.length === 0 ||
//           selectedTopicIds.length === 0
//         }
//         className="bg-green-500 px-6 py-2 rounded-lg"
//       >
//         Generate Questions
//       </button>

//     </div>

//   </Card>
// )}
//       {/* STEP 4: PREVIEW + DEPLOY */}
//       {step === 4 && (
//         <Card className="p-6 space-y-4">
//           <h2 className="font-bold">Step 4: Preview & Deploy</h2>

//           <ExamDocumentPreview
//             generatedPool={generatedPool}
//             config={config}
//             handleFinalDeploy={handleDeploy}
//             setStep={setStep}
//             isViewOnly={false}
//             isPending={isPending}
//           />

//           <div className="flex justify-between">
//             <button onClick={back}>Back</button>

//             <button
//               onClick={handleDeploy}
//               className="bg-blue-600 px-6 py-2 rounded-lg"
//             >
//               Deploy Exam
//             </button>
//           </div>
//         </Card>
//       )}

//     </div>
//   )
// }




// 'use client'

// import { useState, useEffect, useTransition, useCallback, useMemo } from "react"
// import { Card } from "@/components/ui/card"
// import { toast } from "sonner"
// import { ArrowRight } from "lucide-react"

// import {
//   getTeacherAuthorizedAssignments,
//   getClassesByGradeLevel,
//   getGroupedTopics,
//   buildExamPool,
//   finalizeAndDeployExam,
// } from "@/app/actions/exam-engine.actions"

// import { useProfileStore } from "@/store/profileStore"

// import { SubjectSelector } from "@/components/TeacherDashboard/exams/subjectSelector"
// import { SyllabusSelector } from "@/components/TeacherDashboard/exams/syllabusSelector"
// import { SettingsSidebar } from "@/components/TeacherDashboard/exams/settingsSidebar"
// import { ExamDocumentPreview } from "@/components/TeacherDashboard/exams/ExamDocumentPreview"

// export default function TeacherExamArchitect() {
//   const { profile } = useProfileStore()
//   const [isPending, startTransition] = useTransition()

//   // ───────────────── STEPS ─────────────────
//   const [step, setStep] = useState(1)

//   // ───────────────── DATA ─────────────────
//   const [assignments, setAssignments] = useState<any[]>([])
//   const [termGroups, setTermGroups] = useState<any[]>([])
//   const [validClassrooms, setValidClassrooms] = useState<any[]>([])
//   const [generatedPool, setGeneratedPool] = useState<any[]>([])

//   // ───────────────── SELECTIONS ─────────────────
//   const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
//   const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
//   const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])

//   // ───────────────── CONFIG ─────────────────
//   const [config, setConfig] = useState({
//     title: "",
//     duration: 60,
//     startTime: "", // ISO string or datetime-local input
//     totalQuestions: 20,
//     reusePercentage: 30
//   })

//   // ───────────────── COMPUTED END TIME (SAFE) ─────────────────
//   const endTime = useMemo(() => {
//     if (!config.startTime || !config.duration) return null

//     const start = new Date(config.startTime)
//     if (isNaN(start.getTime())) return null

//     return new Date(start.getTime() + config.duration * 60000).toISOString()
//   }, [config.startTime, config.duration])

//   // ───────────────── LOAD ASSIGNMENTS ─────────────────
//   const loadAssignments = useCallback(async () => {
//     if (!profile?.id || !profile?.schoolId) return

//     const data = await getTeacherAuthorizedAssignments(profile.id, profile.schoolId)
//     setAssignments(data)
//   }, [profile])

//   useEffect(() => {
//     loadAssignments()
//   }, [loadAssignments])

//   // ───────────────── LOAD TOPICS + CLASSES ─────────────────
//   useEffect(() => {
//     if (!selectedAssignment || !profile?.schoolId) return

//     getGroupedTopics(selectedAssignment.id).then(setTermGroups)
//     getClassesByGradeLevel(selectedAssignment.gradeId, profile.schoolId).then(setValidClassrooms)

//     setSelectedTopicIds([])
//     setSelectedClassIds([])
//   }, [selectedAssignment])

//   // ───────────────── NAVIGATION ─────────────────
//   const next = () => setStep((s) => Math.min(s + 1, 4))
//   const back = () => setStep((s) => Math.max(s - 1, 1))

//   // ───────────────── GENERATE QUESTIONS ─────────────────
//   const handleGenerate = () => {
//     if (selectedTopicIds.length === 0) {
//       return toast.error("Select at least one topic")
//     }

//     startTransition(async () => {
//       const res = await buildExamPool({
//         topicIds: selectedTopicIds,
//         totalQuestions: config.totalQuestions,
//         reusePercentage: config.reusePercentage,
//         schoolId: profile!.schoolId!
//       })

//       if (!res.success) 
//         toast.error(res.error)

//       setGeneratedPool(res.questions || [])
//       next()
//     })
//   }

//   // ───────────────── DEPLOY EXAM ─────────────────
//   const handleDeploy = () => {
//     if (!config.startTime) {
//       return toast.error("Please set exam start time")
//     }
  
//     if (!endTime) {
//       return toast.error("Invalid exam time")
//     }
  
//     const startDate = new Date(config.startTime)
//     const endDate = new Date(endTime)
  
//     if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//       return toast.error("Invalid date format")
//     }
  
//     startTransition(async () => {
//       const res = await finalizeAndDeployExam(
//         {
//           title: config.title,
//           duration: config.duration,
//           startTime: startDate,
//           endTime: endDate,
  
//           // ✅ ADD THESE
//           totalQuestions: config.totalQuestions,
//           reusePercentage: config.reusePercentage,
//           status: "SCHEDULED",
  
//           teacherId: profile!.id,
//           classIds: selectedClassIds,
//           schoolId: profile!.schoolId!,
//           topicIds: selectedTopicIds,
//           termId: termGroups[0]?.id || "",
//           type: "TERMLY",
//         },
//         generatedPool
//       )
  
//       if (!res.success) {
//         toast.error(res.error)
//         return
//       }
  
//       toast.success("Exam scheduled successfully")
//       setStep(1)
//     })
//   }
  

//   // ───────────────── UI ─────────────────
//   return (
//     <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-6">

//       {/* HEADER */}
//       <div>
//         <h1 className="text-3xl font-black">Exam Builder Wizard</h1>
//         <p className="text-slate-400 text-sm">Step {step} of 4</p>
//       </div>

//       {/* PROGRESS */}
//       <div className="h-2 bg-slate-800 rounded-full">
//         <div
//           className="h-2 bg-green-500 rounded-full transition-all"
//           style={{ width: `${(step / 4) * 100}%` }}
//         />
//       </div>

//       {/* STEP 1 */}
//       {step === 1 && (
//         <Card className="p-6 space-y-4">
//           <h2 className="font-bold">Step 1: Select Subject</h2>

//           <SubjectSelector
//             assignments={assignments}
//             selectedAssignment={selectedAssignment}
//             setSelectedAssignment={setSelectedAssignment}
//           />

//           <button
//             disabled={!selectedAssignment}
//             onClick={next}
//             className="bg-green-500 px-6 py-2 rounded-lg flex items-center gap-2"
//           >
//             Next <ArrowRight className="h-4 w-4" />
//           </button>
//         </Card>
//       )}

//       {/* STEP 2 */}
//       {step === 2 && (
//         <Card className="p-6 space-y-4">
//           <h2 className="font-bold">Step 2: Select Topics</h2>

//           <SyllabusSelector
//             termGroups={termGroups}
//             selectedTopicIds={selectedTopicIds}
//             setSelectedTopicIds={setSelectedTopicIds}
//           />

//           <div className="flex justify-between">
//             <button onClick={back}>Back</button>
//             <button
//               onClick={next}
//               disabled={selectedTopicIds.length === 0}
//               className="bg-green-500 px-6 py-2 rounded-lg"
//             >
//               Next
//             </button>
//           </div>
//         </Card>
//       )}

//       {/* STEP 3 */}
//       {step === 3 && (
//         <Card className="p-6 space-y-6">

//           <h2 className="font-bold text-lg">
//             Step 3: Class & Exam Scheduling
//           </h2>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//             <SettingsSidebar
//               validClassrooms={validClassrooms}
//               selectedClassIds={selectedClassIds}
//               toggleClass={(id: string) =>
//                 setSelectedClassIds((prev) =>
//                   prev.includes(id)
//                     ? prev.filter((i) => i !== id)
//                     : [...prev, id]
//                 )
//               }
//               config={config}
//               setConfig={setConfig}
//               handleBuildPool={handleGenerate}
//               isPending={isPending}
//             />

//             {/* LIVE SCHEDULE PREVIEW */}
//             <Card className="p-4 bg-slate-900 border border-white/10">
//               <h3 className="font-bold mb-2">Exam Schedule</h3>

//               <p className="text-sm text-slate-400">
//                 Start: {config.startTime || "Not set"}
//               </p>

//               <p className="text-sm text-slate-400">
//                 Duration: {config.duration} mins
//               </p>

//               <p className="text-sm text-green-400">
//                 End: {endTime || "Not calculated"}
//               </p>
//             </Card>

//           </div>

//           <div className="flex justify-between pt-4 border-t border-white/10">
//             <button onClick={back}>Back</button>

//             <button
//               onClick={handleGenerate}
//               disabled={
//                 selectedClassIds.length === 0 ||
//                 selectedTopicIds.length === 0
//               }
//               className="bg-green-500 px-6 py-2 rounded-lg"
//             >
//               Generate Questions
//             </button>
//           </div>
//         </Card>
//       )}

//       {/* STEP 4 */}
//       {step === 4 && (
//         <Card className="p-6 space-y-4">

//           <h2 className="font-bold">Step 4: Preview & Deploy</h2>

//           <ExamDocumentPreview
//             generatedPool={generatedPool}
//             config={{
//               ...config,
//               endTime
//             }}
//             handleFinalDeploy={handleDeploy}
//             setStep={setStep}
//             isViewOnly={false}
//             isPending={isPending}
//           />

//           <div className="flex justify-between">
//             <button onClick={back}>Back</button>

//             <button
//               onClick={handleDeploy}
//               className="bg-blue-600 px-6 py-2 rounded-lg"
//             >
//               Deploy Exam
//             </button>
//           </div>

//         </Card>
//       )}

//     </div>
//   )
// }

// 'use client'

// import { useState, useEffect, useTransition, useCallback, useMemo } from "react"
// import { Card } from "@/components/ui/card"
// import { toast } from "sonner"
// import { ArrowRight, Loader2, ArrowLeft } from "lucide-react"

// import {
//   getTeacherAuthorizedAssignments,
//   getClassesByGradeLevel,
//   getGroupedTopics,
//   buildExamPool,
//   finalizeAndDeployExam,
// } from "@/app/actions/exam-engine.actions"

// import { useProfileStore } from "@/store/profileStore"

// import { SubjectSelector } from "@/components/TeacherDashboard/exams/subjectSelector"
// import { SyllabusSelector } from "@/components/TeacherDashboard/exams/syllabusSelector"
// import { SettingsSidebar } from "@/components/TeacherDashboard/exams/settingsSidebar"
// import { ExamDocumentPreview } from "@/components/TeacherDashboard/exams/ExamDocumentPreview"

// // ── Types ───────────────────────────────────────────────────────────────────

// interface AcademicAssignment {
//   id: string
//   gradeId: string
//   subject: { name: string }
//   grade: { displayName: string }
// }

// interface SyllabusTopic {
//   id: string
//   title: string
// }

// interface TermGroup {
//   id: string
//   displayName: string
//   topics: SyllabusTopic[]
// }

// interface PhysicalClassroom {
//   id: string
//   name: string
// }

// interface GeneratedQuestion {
//   text: string
//   options: string[]
//   correctAnswer: string
//   explanation: string
// }

// interface ExamConfig {
//   title: string
//   duration: number
//   startTime: string
//   totalQuestions: number
//   reusePercentage: number
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function TeacherExamArchitect() {
//   const { profile } = useProfileStore()
//   const [isPending, startTransition] = useTransition()

//   // ───────────────── STEPS ─────────────────
//   const [step, setStep] = useState<number>(1)

//   // ───────────────── DATA ─────────────────
//   const [assignments, setAssignments] = useState<AcademicAssignment[]>([])
//   const [termGroups, setTermGroups] = useState<TermGroup[]>([])
//   const [validClassrooms, setValidClassrooms] = useState<PhysicalClassroom[]>([])
//   const [generatedPool, setGeneratedPool] = useState<GeneratedQuestion[]>([])

//   // ───────────────── SELECTIONS ─────────────────
//   const [selectedAssignment, setSelectedAssignment] = useState<AcademicAssignment | null>(null)
//   const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
//   const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])

//   // ───────────────── CONFIG ─────────────────
//   const [config, setConfig] = useState<ExamConfig>({
//     title: "",
//     duration: 60,
//     startTime: "",
//     totalQuestions: 20,
//     reusePercentage: 30
//   })

//   const endTime = useMemo(() => {
//     if (!config.startTime || !config.duration) return null
//     const start = new Date(config.startTime)
//     if (isNaN(start.getTime())) return null
//     return new Date(start.getTime() + config.duration * 60000).toISOString()
//   }, [config.startTime, config.duration])

//   // ───────────────── LOAD DATA ─────────────────
//   const loadAssignments = useCallback(async () => {
//     if (!profile?.id || !profile?.schoolId) return
//     const data = await getTeacherAuthorizedAssignments(profile.id, profile.schoolId)
//     setAssignments(data as AcademicAssignment[])
//   }, [profile?.id, profile?.schoolId])

//   useEffect(() => {
//     loadAssignments()
//   }, [loadAssignments])

//   useEffect(() => {
//     // FIX: Included profile.schoolId in dependency array to resolve warning
//     if (!selectedAssignment || !profile?.schoolId) return

//     getGroupedTopics(selectedAssignment.id).then((data) => setTermGroups(data as TermGroup[]))
//     getClassesByGradeLevel(selectedAssignment.gradeId, profile.schoolId).then((data) => 
//         setValidClassrooms(data as PhysicalClassroom[])
//     )

//     setSelectedTopicIds([])
//     setSelectedClassIds([])
//   }, [selectedAssignment, profile?.schoolId])

//   // ───────────────── HANDLERS ─────────────────
//   const next = () => setStep((s) => Math.min(s + 1, 4))
//   const back = () => setStep((s) => Math.max(s - 1, 1))

//   const handleGenerate = () => {
//     if (selectedTopicIds.length === 0) return toast.error("Select at least one topic")
//     if (!profile?.schoolId) return

//     startTransition(async () => {
//       const res = await buildExamPool({
//         topicIds: selectedTopicIds,
//         totalQuestions: config.totalQuestions,
//         reusePercentage: config.reusePercentage,
//         schoolId: profile.schoolId as string
//       })

//       if (!res.success) {
//         toast.error(res.error || "Generation failed")
//         return
//       }

//       setGeneratedPool(res.questions as GeneratedQuestion[] || [])
//       next()
//     })
//   }

//   const handleDeploy = () => {
//     if (!config.startTime || !endTime || !profile?.id || !profile?.schoolId) {
//       return toast.error("Deployment parameters incomplete")
//     }
  
//     const startDate = new Date(config.startTime)
//     const endDate = new Date(endTime)
  
//     startTransition(async () => {
//       const res = await finalizeAndDeployExam(
//         {
//           title: config.title,
//           duration: config.duration,
//           startTime: startDate,
//           endTime: endDate,
//           totalQuestions: config.totalQuestions,
//           reusePercentage: config.reusePercentage,
//           status: "SCHEDULED",
//           teacherId: profile.id,
//           classIds: selectedClassIds,
//           schoolId: profile.schoolId,
//           topicIds: selectedTopicIds,
//           termId: termGroups[0]?.id || "",
//           type: "TERMLY",
//         },
//         generatedPool
//       )
  
//       if (!res.success) {
//         toast.error(res.error || "Deployment failed")
//         return
//       }
  
//       toast.success("Exam successfully scheduled")
//       setStep(1)
//     })
//   }

//   return (
//     <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-6">
//       <header>
//         <h1 className="text-3xl font-black uppercase italic tracking-tighter">Exam Builder Wizard</h1>
//         <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Step {step} of 4</p>
//       </header>

//       <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
//         <div
//           className="h-full bg-school-primary transition-all duration-500 shadow-[0_0_10px_rgba(var(--primary),0.5)]"
//           style={{ width: `${(step / 4) * 100}%` }}
//         />
//       </div>

//       {step === 1 && (
//         <Card className="p-10 bg-slate-900 border-white/5 rounded-[2.5rem] shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
//           <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Phase 1: Assignment Identity</h2>
//           <SubjectSelector
//             assignments={assignments}
//             selectedAssignment={selectedAssignment}
//             setSelectedAssignment={setSelectedAssignment}
//           />
//           <button
//             disabled={!selectedAssignment}
//             onClick={next}
//             className="w-full md:w-fit bg-school-primary text-slate-950 font-black px-10 py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
//           >
//             Enter Syllabus Pool <ArrowRight className="h-4 w-4" />
//           </button>
//         </Card>
//       )}

//       {step === 2 && (
//         <Card className="p-10 bg-slate-900 border-white/5 rounded-[2.5rem] shadow-2xl space-y-8 animate-in fade-in slide-in-from-right-4">
//           <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Phase 2: Topic Mapping</h2>
//           <SyllabusSelector
//             termGroups={termGroups}
//             selectedTopicIds={selectedTopicIds}
//             setSelectedTopicIds={setSelectedTopicIds}
//           />
//           <div className="flex justify-between items-center pt-6 border-t border-white/5">
//             <button onClick={back} className="text-xs font-black uppercase text-slate-500 hover:text-white">Return</button>
//             <button
//               onClick={next}
//               disabled={selectedTopicIds.length === 0}
//               className="bg-school-primary text-slate-950 font-black px-10 py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
//             >
//               Configure Schedule
//             </button>
//           </div>
//         </Card>
//       )}

//       {step === 3 && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4">
//           <div className="lg:col-span-2">
//             <Card className="p-10 bg-slate-900 border-white/5 rounded-[2.5rem] shadow-2xl space-y-8">
//               <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Phase 3: Deployment Config</h2>
//               <SettingsSidebar
//                 validClassrooms={validClassrooms}
//                 selectedClassIds={selectedClassIds}
//                 toggleClass={(id: string) =>
//                   setSelectedClassIds((prev) =>
//                     prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//                   )
//                 }
//                 config={config}
//                 setConfig={setConfig}
//                 handleBuildPool={handleGenerate}
//                 isPending={isPending}
//               />
//             </Card>
//           </div>
          
//           <Card className="p-8 bg-slate-900/50 border-school-primary/20 border rounded-[2.5rem] h-fit space-y-6">
//               <h3 className="text-xs font-black text-school-primary uppercase tracking-widest">Active Schedule Preview</h3>
//               <div className="space-y-4">
//                 <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
//                     <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Start Window</p>
//                     <p className="text-sm font-bold text-white">{config.startTime || "Awaiting Input..."}</p>
//                 </div>
//                 <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
//                     <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Duration</p>
//                     <p className="text-sm font-bold text-white">{config.duration} Minutes</p>
//                 </div>
//                 {endTime && (
//                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
//                         <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Projected Conclusion</p>
//                         <p className="text-sm font-black text-emerald-400 italic">{new Date(endTime).toLocaleString()}</p>
//                    </div>
//                 )}
//               </div>
//               <button
//                 onClick={handleGenerate}
//                 disabled={isPending || selectedClassIds.length === 0 || !config.title}
//                 className="w-full bg-school-primary text-slate-950 font-black py-4 rounded-xl uppercase text-xs tracking-widest shadow-xl disabled:opacity-20 transition-all"
//               >
//                 {isPending ? <Loader2 className="animate-spin mx-auto h-4 w-4" /> : "Synthesize Question Pool"}
//               </button>
//           </Card>
//         </div>
//       )}

//       {step === 4 && (
//         <div className="space-y-8 animate-in zoom-in-95 duration-300">
//            <div className="flex justify-between items-center bg-slate-900 p-6 rounded-[2rem] border border-white/5">
//                 <button onClick={back} className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-white"><ArrowLeft className="h-4 w-4"/> Revision</button>
//                 <button 
//                   onClick={handleDeploy} 
//                   disabled={isPending}
//                   className="bg-school-primary text-slate-950 px-10 py-3 rounded-xl font-black uppercase text-xs shadow-xl flex items-center gap-2"
//                 >
//                   {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Deploy to Registry"}
//                 </button>
//             </div>
//             <ExamDocumentPreview
//                 generatedPool={generatedPool}
//                 config={{ ...config, endTime }}
//                 handleFinalDeploy={handleDeploy}
//                 setStep={setStep}
//                 isViewOnly={false}
//                 isPending={isPending}
//             />
//         </div>
//       )}
//     </div>
//   )
// }


// 'use client'

// import { useState, useEffect, useTransition, useCallback, useMemo } from "react"
// import { Card } from "@/components/ui/card"
// import { toast } from "sonner"
// import { ArrowRight, Loader2, ArrowLeft } from "lucide-react"

// import {
//   getTeacherAuthorizedAssignments,
//   getClassesByGradeLevel,
//   getGroupedTopics,
//   buildExamPool,
//   finalizeAndDeployExam,
// } from "@/app/actions/exam-engine.actions"

// import { useProfileStore } from "@/store/profileStore"

// import { SubjectSelector } from "@/components/TeacherDashboard/exams/subjectSelector"
// import { SyllabusSelector } from "@/components/TeacherDashboard/exams/syllabusSelector"
// import { SettingsSidebar } from "@/components/TeacherDashboard/exams/settingsSidebar"
// import { ExamDocumentPreview } from "@/components/TeacherDashboard/exams/ExamDocumentPreview"
// import { AssessmentType, ExamStatus } from "@prisma/client"

// // ── Utility ──────────────────────────────────────────────────────────────────

// function getErrorMessage(error: unknown): string {
//   if (error instanceof Error) return error.message;
//   if (error && typeof error === 'object' && 'message' in error) {
//     return String((error as { message?: string }).message);
//   }
//   return typeof error === 'string' ? error : "An unknown error occurred";
// }

// // ── Types ───────────────────────────────────────────────────────────────────

// interface AcademicAssignment {
//   id: string
//   gradeId: string
//   subject: { name: string }
//   grade: { displayName: string }
// }

// interface SyllabusTopic {
//   id: string
//   title: string
// }

// interface TermGroup {
//   id: string
//   displayName: string
//   topics: SyllabusTopic[]
// }

// interface PhysicalClassroom {
//   id: string
//   name: string;
// }

// interface GeneratedQuestion {
//   text: string
//   options: string[]
//   correctAnswer: string
//   explanation: string
// }

// interface ExamConfig {
//   title: string
//   duration: number
//   startTime: string
//   totalQuestions: number
//   reusePercentage: number
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function TeacherExamArchitect() {
//   const { profile } = useProfileStore()
//   const [isPending, startTransition] = useTransition()

//   // ───────────────── STEPS ─────────────────
//   const [step, setStep] = useState<number>(1)

//   // ───────────────── DATA ─────────────────
//   const [assignments, setAssignments] = useState<AcademicAssignment[]>([])
//   const [termGroups, setTermGroups] = useState<TermGroup[]>([])
//   const [validClassrooms, setValidClassrooms] = useState<PhysicalClassroom[]>([])
//   const [generatedPool, setGeneratedPool] = useState<GeneratedQuestion[]>([])

//   // ───────────────── SELECTIONS ─────────────────
//   const [selectedAssignment, setSelectedAssignment] = useState<AcademicAssignment | null>(null)
//   const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
//   const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])

//   // ───────────────── CONFIG ─────────────────
//   const [config, setConfig] = useState<ExamConfig>({
//     title: "",
//     duration: 60,
//     startTime: "",
//     totalQuestions: 20,
//     reusePercentage: 30
//   })

//   const endTime = useMemo(() => {
//     if (!config.startTime || !config.duration) return null
//     const start = new Date(config.startTime)
//     if (isNaN(start.getTime())) return null
//     return new Date(start.getTime() + config.duration * 60000).toISOString()
//   }, [config.startTime, config.duration])

//   // ───────────────── LOAD DATA ─────────────────
//   const loadAssignments = useCallback(async () => {
//     if (!profile?.id || !profile?.schoolId) return
//     try {
//         const data = await getTeacherAuthorizedAssignments(profile.id, profile.schoolId)
//         setAssignments(data as AcademicAssignment[])
//     } catch (err) {
//         toast.error(getErrorMessage(err))
//     }
//   }, [profile?.id, profile?.schoolId])

//   useEffect(() => {
//     loadAssignments()
//   }, [loadAssignments])

//   useEffect(() => {
//     if (!selectedAssignment || !profile?.schoolId) return

//     getGroupedTopics(selectedAssignment.id).then((data) => setTermGroups(data as TermGroup[]))
//     getClassesByGradeLevel(selectedAssignment.gradeId, profile.schoolId).then((data) => 
//         setValidClassrooms(data as PhysicalClassroom[])
//     )

//     setSelectedTopicIds([])
//     setSelectedClassIds([])
//   }, [selectedAssignment, profile?.schoolId])

//   // ───────────────── HANDLERS ─────────────────
//   const next = () => setStep((s) => Math.min(s + 1, 4))
//   const back = () => setStep((s) => Math.max(s - 1, 1))

//   const handleGenerate = () => {
//     if (selectedTopicIds.length === 0) return toast.error("Select at least one topic")
//     if (!profile?.schoolId) return toast.error("Institutional context missing")

//     startTransition(async () => {
//       try {
//         const res = await buildExamPool({
//             topicIds: selectedTopicIds,
//             totalQuestions: config.totalQuestions,
//             reusePercentage: config.reusePercentage,
//             schoolId: profile.schoolId! // Assert non-null after guard
//           })
    
//           if (!res.success) {
//             toast.error(res.error || "Generation failed")
//             return
//           }
    
//           setGeneratedPool(res.questions as GeneratedQuestion[] || [])
//           next()
//       } catch (err) {
//         toast.error(getErrorMessage(err))
//       }
//     })
//   }

//   const handleDeploy = () => {
//     // RESOLUTION: Added strict check for profile existence and schoolId type compatibility
//     if (!config.startTime || !endTime || !profile?.id || !profile?.schoolId) {
//       return toast.error("Deployment parameters or Institutional ID incomplete")
//     }
  
//     const startDate = new Date(config.startTime)
//     const endDate = new Date(endTime)
  
//     startTransition(async () => {
//       try {
//         const res = await finalizeAndDeployExam(
//             {
//               title: config.title,
//               duration: config.duration,
//               startTime: startDate,
//               endTime: endDate,
//               totalQuestions: config.totalQuestions,
//               reusePercentage: config.reusePercentage,
//               status: ExamStatus.SCHEDULED,
//               teacherId: profile.id,
//               classIds: selectedClassIds,
//               schoolId: profile.schoolId!, // Corrected: Passed as strict string
//               topicIds: selectedTopicIds,
//               termId: termGroups[0]?.id || "",
//               type: AssessmentType.TERMLY,
//             },
//             generatedPool
//           )
      
//           if (!res.success) {
//             toast.error(res.error || "Deployment failed")
//             return
//           }
      
//           toast.success("Exam successfully scheduled")
//           setStep(1)
//       } catch (err) {
//         toast.error(getErrorMessage(err))
//       }
//     })
//   }

//   return (
//     <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-6">
//       <header>
//         <h1 className="text-3xl font-black uppercase italic tracking-tighter">Exam Builder Wizard</h1>
//         <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Step {step} of 4</p>
//       </header>

//       <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
//         <div
//           className="h-full bg-school-primary transition-all duration-500 shadow-[0_0_10px_rgba(var(--primary),0.5)]"
//           style={{ width: `${(step / 4) * 100}%` }}
//         />
//       </div>

//       {step === 1 && (
//         <Card className="p-10 bg-slate-900 border-white/5 rounded-[2.5rem] shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
//           <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Phase 1: Assignment Identity</h2>
//           <SubjectSelector
//             assignments={assignments as any}
//             selectedAssignment={selectedAssignment}
//             setSelectedAssignment={setSelectedAssignment as any}
//           />
//           <button
//             disabled={!selectedAssignment}
//             onClick={next}
//             className="w-full md:w-fit bg-school-primary text-slate-950 font-black px-10 py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
//           >
//             Enter Syllabus Pool <ArrowRight className="h-4 w-4" />
//           </button>
//         </Card>
//       )}

//       {step === 2 && (
//         <Card className="p-10 bg-slate-900 border-white/5 rounded-[2.5rem] shadow-2xl space-y-8 animate-in fade-in slide-in-from-right-4">
//           <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Phase 2: Topic Mapping</h2>
//           <SyllabusSelector
//             termGroups={termGroups}
//             selectedTopicIds={selectedTopicIds}
//             setSelectedTopicIds={setSelectedTopicIds as any}
//           />
//           <div className="flex justify-between items-center pt-6 border-t border-white/5">
//             <button onClick={back} className="text-xs font-black uppercase text-slate-500 hover:text-white">Return</button>
//             <button
//               onClick={next}
//               disabled={selectedTopicIds.length === 0}
//               className="bg-school-primary text-slate-950 font-black px-10 py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
//             >
//               Configure Schedule
//             </button>
//           </div>
//         </Card>
//       )}

//       {step === 3 && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4">
//           <div className="lg:col-span-2">
//             <Card className="p-10 bg-slate-900 border-white/5 rounded-[2.5rem] shadow-2xl space-y-8">
//               <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Phase 3: Deployment Config</h2>
//               <SettingsSidebar
//                 validClassrooms={validClassrooms as any}
//                 selectedClassIds={selectedClassIds}
//                 toggleClass={(id: string) =>
//                   setSelectedClassIds((prev) =>
//                     prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//                   )
//                 }
//                 config={config as any}
//                 setConfig={setConfig as any}
//                 handleBuildPool={handleGenerate}
//                 isPending={isPending}
//               />
//             </Card>
//           </div>
          
//           <Card className="p-8 bg-slate-900/50 border-school-primary/20 border rounded-[2.5rem] h-fit space-y-6">
//               <h3 className="text-xs font-black text-school-primary uppercase tracking-widest">Active Schedule Preview</h3>
//               <div className="space-y-4">
//                 <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
//                     <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Start Window</p>
//                     <p className="text-sm font-bold text-white">{config.startTime || "Awaiting Input..."}</p>
//                 </div>
//                 <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
//                     <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Duration</p>
//                     <p className="text-sm font-bold text-white">{config.duration} Minutes</p>
//                 </div>
//                 {endTime && (
//                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
//                         <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Projected Conclusion</p>
//                         <p className="text-sm font-black text-emerald-400 italic">{new Date(endTime).toLocaleString()}</p>
//                    </div>
//                 )}
//               </div>
//               <button
//                 onClick={handleGenerate}
//                 disabled={isPending || selectedClassIds.length === 0 || !config.title}
//                 className="w-full bg-school-primary text-slate-950 font-black py-4 rounded-xl uppercase text-xs tracking-widest shadow-xl disabled:opacity-20 transition-all"
//               >
//                 {isPending ? <Loader2 className="animate-spin mx-auto h-4 w-4" /> : "Synthesize Question Pool"}
//               </button>
//           </Card>
//         </div>
//       )}

//       {step === 4 && (
//         <div className="space-y-8 animate-in zoom-in-95 duration-300">
//            <div className="flex justify-between items-center bg-slate-900 p-6 rounded-[2rem] border border-white/5">
//                 <button onClick={back} className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-white"><ArrowLeft className="h-4 w-4"/> Revision</button>
//                 <button 
//                   onClick={handleDeploy} 
//                   disabled={isPending}
//                   className="bg-school-primary text-slate-950 px-10 py-3 rounded-xl font-black uppercase text-xs shadow-xl flex items-center gap-2"
//                 >
//                   {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Deploy to Registry"}
//                 </button>
//             </div>
//             <ExamDocumentPreview
//                 generatedPool={generatedPool as any}
//                 config={{ ...config, endTime }}
//                 handleFinalDeploy={handleDeploy}
//                 setStep={setStep}
//                 isViewOnly={false}
//                 isPending={isPending}
//             />
//         </div>
//       )}
//     </div>
//   )
// }


// 'use client'

// import { useState, useEffect, useTransition, useCallback, useMemo } from "react"
// import { Card } from "@/components/ui/card"
// import { toast } from "sonner"
// import { ArrowRight, Loader2, ArrowLeft } from "lucide-react"

// import {
//   getTeacherAuthorizedAssignments,
//   getClassesByGradeLevel,
//   getGroupedTopics,
//   buildExamPool,
//   finalizeAndDeployExam,
// } from "@/app/actions/exam-engine.actions"

// import { useExamStore, getErrorMessage, type AssignmentWithDetails, type TermGroup } from "@/store/useExamStore"
// import { useProfileStore } from "@/store/profileStore"

// import { SubjectSelector } from "@/components/TeacherDashboard/exams/subjectSelector"
// import { SyllabusSelector } from "@/components/TeacherDashboard/exams/syllabusSelector"
// import { SettingsSidebar } from "@/components/TeacherDashboard/exams/settingsSidebar"
// import { ExamDocumentPreview } from "@/components/TeacherDashboard/exams/ExamDocumentPreview"
// import { AssessmentType, ExamStatus } from "@prisma/client"

// // ── Types ───────────────────────────────────────────────────────────────────

// interface UIQuestion {
//   id?: string;
//   text: string;
//   options: string[];
// }

// interface GeneratedQuestion extends UIQuestion {
//   correctAnswer: string;
//   explanation: string;
// }

// interface PageExamConfig {
//   title: string;
//   duration: number;
//   startTime: string;
//   totalQuestions: number;
//   reusePercentage: number;
//   endTime?: string | null; // Added to satisfy Preview component
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function TeacherExamArchitect() {
//   const { profile } = useProfileStore()
//   const [isPending, startTransition] = useTransition()
  
//   // Pulling from our central Exam Store
//   const { 
//     assignments, setInitialData,
//     termGroups, 
//     availableClasses,
//     selectedAssignment, setSelectedAssignment,
//     selectedTopicIds, setSelectedTopicIds,
//     selectedClassIds,
//     config, setConfig
//   } = useExamStore()

//   const [step, setStep] = useState<number>(1)
//   const [generatedPool, setGeneratedPool] = useState<GeneratedQuestion[]>([])

//   const endTime = useMemo(() => {
//     if (!config.startTime || !config.duration) return null
//     const start = new Date(config.startTime)
//     if (isNaN(start.getTime())) return null
//     return new Date(start.getTime() + config.duration * 60000).toISOString()
//   }, [config.startTime, config.duration])

//   // ───────────────── LOAD DATA ─────────────────
//   const loadInitialState = useCallback(async () => {
//     if (!profile?.id || !profile?.schoolId) return
//     try {
//         const [assigns] = await Promise.all([
//             getTeacherAuthorizedAssignments(profile.id, profile.schoolId)
//         ])
//         setInitialData({
//             assignments: assigns as AssignmentWithDetails[],
//             termGroups: [],
//             availableClasses: []
//         })
//     } catch (err) {
//         toast.error(getErrorMessage(err))
//     }
//   }, [profile?.id, profile?.schoolId, setInitialData])

//   useEffect(() => {
//     loadInitialState()
//   }, [loadInitialState])

//   useEffect(() => {
//     if (!selectedAssignment || !profile?.schoolId) return

//     getGroupedTopics(selectedAssignment.id).then((data) => {
//         useExamStore.setState({ termGroups: data as TermGroup[] })
//     })
//     getClassesByGradeLevel(selectedAssignment.gradeId, profile.schoolId).then((data) => {
//         useExamStore.setState({ availableClasses: data as any })
//     })
//   }, [selectedAssignment, profile?.schoolId])

//   // ───────────────── HANDLERS ─────────────────
//   const next = () => setStep((s) => Math.min(s + 1, 4))
//   const back = () => setStep((s) => Math.max(s - 1, 1))

//   const handleGenerate = async (): Promise<void> => {
//     if (selectedTopicIds.length === 0) {
//         toast.error("Select at least one topic")
//         return
//     }
//     if (!profile?.schoolId) return

//     startTransition(async () => {
//       try {
//         const res = await buildExamPool({
//             topicIds: selectedTopicIds,
//             totalQuestions: config.totalQuestions,
//             reusePercentage: config.reusePercentage,
//             schoolId: profile.schoolId!
//           })
    
//           if (!res.success) {
//             toast.error(res.error || "Generation failed")
//             return
//           }
    
//           setGeneratedPool(res.questions as GeneratedQuestion[] || [])
//           next()
//       } catch (err) {
//         toast.error(getErrorMessage(err))
//       }
//     })
//   }

//   const handleDeploy = async (): Promise<void> => {
//     if (!config.startTime || !endTime || !profile?.id || !profile?.schoolId) {
//       toast.error("Deployment parameters incomplete")
//       return
//     }
  
//     startTransition(async () => {
//       try {
//         const res = await finalizeAndDeployExam(
//             {
//               title: config.title,
//               duration: config.duration,
//               startTime: new Date(config.startTime),
//               endTime: new Date(endTime),
//               totalQuestions: config.totalQuestions,
//               reusePercentage: config.reusePercentage,
//               status: ExamStatus.SCHEDULED,
//               teacherId: profile.id,
//               classIds: selectedClassIds,
//               schoolId: profile.schoolId!,
//               topicIds: selectedTopicIds,
//               termId: termGroups[0]?.id || "",
//               type: AssessmentType.TERMLY,
//             },
//             generatedPool
//           )
      
//           if (!res.success) {
//             toast.error(res.error || "Deployment failed")
//             return
//           }
      
//           toast.success("Exam successfully scheduled")
//           setStep(1)
//       } catch (err) {
//         toast.error(getErrorMessage(err))
//       }
//     })
//   }

//   // Adapter for SyllabusSelector functional updates
//   const handleSetTopics: React.Dispatch<React.SetStateAction<string[]>> = useCallback((val) => {
//     const nextIds = typeof val === 'function' ? val(selectedTopicIds) : val
//     setSelectedTopicIds(nextIds)
//   }, [selectedTopicIds, setSelectedTopicIds])

//   return (
//     <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-6">
//       <header>
//         <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Exam Architect</h1>
//         <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Step {step} of 4</p>
//       </header>

//       <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
//         <div className="h-full bg-school-primary transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
//       </div>

//       {step === 1 && (
//         <Card className="p-10 bg-slate-900 border-white/5 rounded-[2.5rem] shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
//           <SubjectSelector
//             assignments={assignments}
//             selectedAssignment={selectedAssignment}
//             setSelectedAssignment={(val) => setSelectedAssignment(val as AssignmentWithDetails)}
//           />
//           <button
//             disabled={!selectedAssignment}
//             onClick={next}
//             className="bg-school-primary text-slate-950 font-black px-10 py-4 rounded-2xl flex items-center gap-2 disabled:opacity-30"
//           >
//             Enter Syllabus Pool <ArrowRight className="h-4 w-4" />
//           </button>
//         </Card>
//       )}

//       {step === 2 && (
//         <Card className="p-10 bg-slate-900 border-white/5 rounded-[2.5rem] shadow-2xl space-y-8 animate-in fade-in">
//           <SyllabusSelector
//             termGroups={termGroups}
//             selectedTopicIds={selectedTopicIds}
//             setSelectedTopicIds={handleSetTopics}
//           />
//           <div className="flex justify-between pt-6 border-t border-white/5">
//             <button onClick={back} className="text-xs font-black uppercase text-slate-500">Back</button>
//             <button onClick={next} disabled={selectedTopicIds.length === 0} className="bg-school-primary text-slate-950 font-black px-10 py-4 rounded-2xl">
//               Configure Schedule
//             </button>
//           </div>
//         </Card>
//       )}

//       {step === 3 && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
//           <div className="lg:col-span-2">
//             <SettingsSidebar onBuildPool={handleGenerate} />
//           </div>
          
//           <Card className="p-8 bg-slate-900/50 border-school-primary/20 border rounded-[2.5rem] h-fit space-y-6">
//               <h3 className="text-xs font-black text-school-primary uppercase tracking-widest">Schedule Preview</h3>
//               <div className="space-y-4">
//                 <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
//                     <p className="text-[10px] font-black text-slate-500 uppercase">Start Window</p>
//                     <p className="text-sm font-bold text-white">{config.startTime || "TBD"}</p>
//                 </div>
//                 {endTime && (
//                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
//                         <p className="text-[10px] font-black text-emerald-500 uppercase">Conclusion</p>
//                         <p className="text-sm font-black text-emerald-400 italic">{new Date(endTime).toLocaleString()}</p>
//                    </div>
//                 )}
//               </div>
//           </Card>
//         </div>
//       )}

//       {step === 4 && (
//         <div className="space-y-8 animate-in zoom-in-95">
//             <ExamDocumentPreview
//                 generatedPool={generatedPool}
//                 config={{ ...config, endTime } as any}
//                 handleFinalDeploy={() => handleDeploy()}
//                 setStep={setStep}
//                 isViewOnly={false}
//                 isPending={isPending}
//             />
//         </div>
//       )}
//     </div>
//   )
// }


// 'use client'

// import { useState, useEffect, useTransition, useCallback, useMemo } from "react"
// import { Card } from "@/components/ui/card"
// import { toast } from "sonner"
// import { ArrowRight, Loader2, ArrowLeft } from "lucide-react"

// import {
//   getTeacherAuthorizedAssignments,
//   getClassesByGradeLevel,
//   getGroupedTopics,
//   buildExamPool,
//   finalizeAndDeployExam,
// } from "@/app/actions/exam-engine.actions"

// import { useExamStore, getErrorMessage, type AssignmentWithDetails, type TermGroup } from "@/store/useExamStore"
// import { useProfileStore } from "@/store/profileStore"

// import { SubjectSelector } from "@/components/TeacherDashboard/exams/subjectSelector"
// import { SyllabusSelector } from "@/components/TeacherDashboard/exams/syllabusSelector"
// import { SettingsSidebar } from "@/components/TeacherDashboard/exams/settingsSidebar"
// import { ExamDocumentPreview } from "@/components/TeacherDashboard/exams/ExamDocumentPreview"
// import { AssessmentType, ExamStatus, Topic } from "@prisma/client"

// // ── Types ───────────────────────────────────────────────────────────────────

// interface UIQuestion {
//   id?: string;
//   text: string;
//   options: string[];
// }

// interface GeneratedQuestion extends UIQuestion {
//   correctAnswer: string;
//   explanation: string;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function TeacherExamArchitect() {
//   const { profile } = useProfileStore()
//   const [isPending, startTransition] = useTransition()
  
//   const { 
//     assignments, setInitialData,
//     termGroups, 
//     availableClasses,
//     selectedAssignment, setSelectedAssignment,
//     selectedTopicIds, setSelectedTopicIds,
//     selectedClassIds,
//     config, 
//   } = useExamStore()

//   const [step, setStep] = useState<number>(1)
//   const [generatedPool, setGeneratedPool] = useState<GeneratedQuestion[]>([])

//   const endTime = useMemo(() => {
//     if (!config.startTime || !config.duration) return null
//     const start = new Date(config.startTime)
//     if (isNaN(start.getTime())) return null
//     return new Date(start.getTime() + config.duration * 60000).toISOString()
//   }, [config.startTime, config.duration])

//   // ───────────────── LOAD DATA ─────────────────
//   const loadInitialState = useCallback(async () => {
//     if (!profile?.id || !profile?.schoolId) return
//     try {
//         const assigns = await getTeacherAuthorizedAssignments(profile.id, profile.schoolId)
//         setInitialData({
//             assignments: assigns as AssignmentWithDetails[],
//             termGroups: [],
//             availableClasses: []
//         })
//     } catch (err) {
//         toast.error(getErrorMessage(err))
//     }
//   }, [profile?.id, profile?.schoolId, setInitialData])

//   useEffect(() => {
//     loadInitialState()
//   }, [loadInitialState])

//   useEffect(() => {
//     if (!selectedAssignment || !profile?.schoolId) return

//     /**
//      * RESOLUTION FOR ERROR 2352:
//      * We use 'as unknown as TermGroup[]' because the database action 
//      * returns a selection of the Topic model. This satisfies the 
//      * ExamStore's requirement for TermGroups.
//      */
//     getGroupedTopics(selectedAssignment.id).then((data) => {
//         useExamStore.setState({ termGroups: data as unknown as TermGroup[] })
//     })

//     getClassesByGradeLevel(selectedAssignment.gradeId, profile.schoolId).then((data) => {
//         useExamStore.setState({ availableClasses: data as any[] })
//     })
//   }, [selectedAssignment, profile?.schoolId])

//   // ───────────────── HANDLERS ─────────────────
//   const next = () => setStep((s) => Math.min(s + 1, 4))
//   const back = () => setStep((s) => Math.max(s - 1, 1))

//   const handleGenerate = async (): Promise<void> => {
//     if (selectedTopicIds.length === 0) {
//         toast.error("Select at least one topic")
//         return
//     }
//     if (!profile?.schoolId) return

//     startTransition(async () => {
//       try {
//         const res = await buildExamPool({
//             topicIds: selectedTopicIds,
//             totalQuestions: config.totalQuestions,
//             reusePercentage: config.reusePercentage,
//             schoolId: profile.schoolId!
//           })
    
//           if (!res.success) {
//             toast.error(res.error || "Generation failed")
//             return
//           }
    
//           setGeneratedPool(res.questions as GeneratedQuestion[] || [])
//           next()
//       } catch (err) {
//         toast.error(getErrorMessage(err))
//       }
//     })
//   }

//   const handleDeploy = async (): Promise<void> => {
//     if (!config.startTime || !endTime || !profile?.id || !profile?.schoolId) {
//       toast.error("Deployment parameters incomplete")
//       return
//     }
  
//     startTransition(async () => {
//       try {
//         const res = await finalizeAndDeployExam(
//             {
//               title: config.title,
//               duration: config.duration,
//               startTime: new Date(config.startTime),
//               endTime: new Date(endTime),
//               totalQuestions: config.totalQuestions,
//               reusePercentage: config.reusePercentage,
//               status: ExamStatus.SCHEDULED,
//               teacherId: profile.id,
//               classIds: selectedClassIds,
//               schoolId: profile.schoolId!,
//               topicIds: selectedTopicIds,
//               termId: termGroups[0]?.id || "",
//               type: AssessmentType.TERMLY,
//             },
//             generatedPool
//           )
      
//           if (!res.success) {
//             toast.error(res.error || "Deployment failed")
//             return
//           }
      
//           toast.success("Exam successfully scheduled")
//           setStep(1)
//       } catch (err) {
//         toast.error(getErrorMessage(err))
//       }
//     })
//   }

//   const handleSetTopics: React.Dispatch<React.SetStateAction<string[]>> = useCallback((val) => {
//     const nextIds = typeof val === 'function' ? val(selectedTopicIds) : val
//     setSelectedTopicIds(nextIds)
//   }, [selectedTopicIds, setSelectedTopicIds])

//   return (
//     <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-6">
//       <header>
//         <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Exam Architect</h1>
//         <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Step {step} of 4</p>
//       </header>

//       <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
//         <div className="h-full bg-school-primary transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
//       </div>

//       {step === 1 && (
//         <Card className="p-10 bg-slate-900 border-white/5 rounded-[2.5rem] shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
//           <SubjectSelector
//             assignments={assignments}
//             selectedAssignment={selectedAssignment}
//             setSelectedAssignment={(val) => setSelectedAssignment(val as AssignmentWithDetails)}
//           />
//           <div className="pt-4">
//             <button
//                 disabled={!selectedAssignment}
//                 onClick={next}
//                 className="bg-school-primary text-slate-950 font-black px-10 py-4 rounded-2xl flex items-center gap-2 disabled:opacity-30 hover:scale-[1.02] transition-transform"
//             >
//                 Enter Syllabus Pool <ArrowRight className="h-4 w-4" />
//             </button>
//           </div>
//         </Card>
//       )}

//       {step === 2 && (
//         <Card className="p-10 bg-slate-900 border-white/5 rounded-[2.5rem] shadow-2xl space-y-8 animate-in fade-in">
//           <SyllabusSelector
//             termGroups={termGroups}
//             selectedTopicIds={selectedTopicIds}
//             setSelectedTopicIds={handleSetTopics}
//           />
//           <div className="flex justify-between pt-6 border-t border-white/5">
//             <button onClick={back} className="text-xs font-black uppercase text-slate-500">Back</button>
//             <button onClick={next} disabled={selectedTopicIds.length === 0} className="bg-school-primary text-slate-950 font-black px-10 py-4 rounded-2xl">
//               Configure Schedule
//             </button>
//           </div>
//         </Card>
//       )}

//       {step === 3 && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
//           <div className="lg:col-span-2">
//             <SettingsSidebar onBuildPool={handleGenerate} />
//           </div>
          
//           <Card className="p-8 bg-slate-900/50 border-school-primary/20 border rounded-[2.5rem] h-fit space-y-6">
//               <h3 className="text-xs font-black text-school-primary uppercase tracking-widest">Schedule Preview</h3>
//               <div className="space-y-4">
//                 <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
//                     <p className="text-[10px] font-black text-slate-500 uppercase">Start Window</p>
//                     <p className="text-sm font-bold text-white">{config.startTime || "TBD"}</p>
//                 </div>
//                 {endTime && (
//                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
//                         <p className="text-[10px] font-black text-emerald-500 uppercase">Conclusion</p>
//                         <p className="text-sm font-black text-emerald-400 italic">{new Date(endTime).toLocaleString()}</p>
//                    </div>
//                 )}
//               </div>
//           </Card>
//         </div>
//       )}

//       {step === 4 && (
//         <div className="space-y-8 animate-in zoom-in-95">
//             <ExamDocumentPreview
//                 generatedPool={generatedPool}
//                 config={{ ...config, endTime } as any}
//                 handleFinalDeploy={() => handleDeploy()}
//                 setStep={setStep}
//                 isViewOnly={false}
//                 isPending={isPending}
//             />
//         </div>
//       )}
//     </div>
//   )
// }




'use client'

import { useState, useEffect, useTransition, useCallback, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { 
  ArrowRight, 
  Loader2, 
  ArrowLeft, 
  BookOpen, 
  Layers, 
  Settings, 
  Calendar,
 GraduationCap,
  FileText,
  ShieldCheck,
  School
} from "lucide-react"

import {
  getTeacherAuthorizedAssignments,
  getClassesByGradeLevel,
  getGroupedTopics,
  buildExamPool,
  finalizeAndDeployExam,
} from "@/app/actions/exam-engine.actions"

import { 
  useExamStore, 
  getErrorMessage, 
  type AssignmentWithDetails, 
  type TermGroup 
} from "@/store/useExamStore"
import { useProfileStore } from "@/store/profileStore"

import { SubjectSelector } from "@/components/TeacherDashboard/exams/subjectSelector"
import { SyllabusSelector } from "@/components/TeacherDashboard/exams/syllabusSelector"
import { SettingsSidebar } from "@/components/TeacherDashboard/exams/settingsSidebar"
import { ExamDocumentPreview } from "@/components/TeacherDashboard/exams/ExamDocumentPreview"
import { AssessmentType, ExamStatus, Class } from "@prisma/client"
import { cn } from "@/lib/utils"

// ── Types ───────────────────────────────────────────────────────────────────

interface UIQuestion {
  id?: string;
  text: string;
  options: string[];
}

interface GeneratedQuestion extends UIQuestion {
  correctAnswer: string;
  explanation: string;
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function TeacherExamArchitect() {
  const { profile } = useProfileStore()
  const [isPending, startTransition] = useTransition()
  
  const { 
    assignments, setInitialData,
    termGroups, 
    availableClasses, // FIXED: Now utilized in the UI below
    selectedAssignment, setSelectedAssignment,
    selectedTopicIds, setSelectedTopicIds,
    selectedClassIds,
    config, 
  } = useExamStore()

  const [step, setStep] = useState<number>(1)
  const [generatedPool, setGeneratedPool] = useState<GeneratedQuestion[]>([])

  const endTime = useMemo(() => {
    if (!config.startTime || !config.duration) return null
    const start = new Date(config.startTime)
    if (isNaN(start.getTime())) return null
    return new Date(start.getTime() + config.duration * 60000).toISOString()
  }, [config.startTime, config.duration])

  // ───────────────── LOAD DATA ─────────────────
  const loadInitialState = useCallback(async () => {
    if (!profile?.id || !profile?.schoolId) return
    try {
        const assigns = await getTeacherAuthorizedAssignments(profile.id, profile.schoolId)
        setInitialData({
            assignments: assigns as AssignmentWithDetails[],
            termGroups: [],
            availableClasses: []
        })
    } catch (err) {
        toast.error(getErrorMessage(err))
    }
  }, [profile?.id, profile?.schoolId, setInitialData])

  useEffect(() => {
    loadInitialState()
  }, [loadInitialState])

  useEffect(() => {
    if (!selectedAssignment || !profile?.schoolId) return

    getGroupedTopics(selectedAssignment.id).then((data) => {
        useExamStore.setState({ termGroups: data as unknown as TermGroup[] })
    })

    getClassesByGradeLevel(selectedAssignment.gradeId, profile.schoolId).then((data) => {
        // FIXED: Casting to Prisma Class type instead of any
        useExamStore.setState({ availableClasses: data as Class[] })
    })
  }, [selectedAssignment, profile?.schoolId])

  // ───────────────── HANDLERS ─────────────────
  const next = () => setStep((s) => Math.min(s + 1, 4))
  const back = () => setStep((s) => Math.max(s - 1, 1))

  const handleGenerate = async (): Promise<void> => {
    if (selectedTopicIds.length === 0) {
        toast.error("Select at least one topic")
        return
    }
    if (!profile?.schoolId) return

    startTransition(async () => {
      try {
        const res = await buildExamPool({
            topicIds: selectedTopicIds,
            totalQuestions: config.totalQuestions,
            reusePercentage: config.reusePercentage,
            schoolId: profile.schoolId!
          })
    
          if (!res.success) {
            toast.error(res.error || "Generation failed")
            return
          }
    
          setGeneratedPool(res.questions as GeneratedQuestion[] || [])
          next()
      } catch (err) {
        toast.error(getErrorMessage(err))
      }
    })
  }

  const handleDeploy = async (): Promise<void> => {
    if (!config.startTime || !endTime || !profile?.id || !profile?.schoolId) {
      toast.error("Deployment parameters incomplete")
      return
    }
  
    startTransition(async () => {
      try {
        const res = await finalizeAndDeployExam(
            {
              title: config.title,
              duration: config.duration,
              startTime: new Date(config.startTime),
              endTime: new Date(endTime),
              totalQuestions: config.totalQuestions,
              reusePercentage: config.reusePercentage,
              status: ExamStatus.SCHEDULED,
              teacherId: profile.id,
              classIds: selectedClassIds,
              schoolId: profile.schoolId!,
              topicIds: selectedTopicIds,
              termId: termGroups[0]?.id || "",
              type: AssessmentType.TERMLY,
            },
            generatedPool
          )
      
          if (!res.success) {
            toast.error(res.error || "Deployment failed")
            return
          }
      
          toast.success("Exam successfully scheduled")
          setStep(1)
      } catch (err) {
        toast.error(getErrorMessage(err))
      }
    })
  }

  const handleSetTopics: React.Dispatch<React.SetStateAction<string[]>> = useCallback((val) => {
    const nextIds = typeof val === 'function' ? val(selectedTopicIds) : val
    setSelectedTopicIds(nextIds)
  }, [selectedTopicIds, setSelectedTopicIds])

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-6">
      <header className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Exam Architect</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-school-primary" /> Phase {step} of 4
            </p>
        </div>
        <Badge className="bg-school-primary/10 text-school-primary border-school-primary/20">
            ENGINE_ACTIVE_v2.4
        </Badge>
      </header>

      <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
        <div className="h-full bg-school-primary transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
      </div>

      {step === 1 && (
        <Card className="p-10 bg-slate-900 border-white/5 rounded-[2.5rem] shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
             <BookOpen className="h-6 w-6 text-school-primary" />
             <h2 className="text-xl font-black text-white uppercase italic tracking-tight leading-none">Assignment Identity</h2>
          </div>
          <SubjectSelector
            assignments={assignments}
            selectedAssignment={selectedAssignment}
            setSelectedAssignment={(val) => setSelectedAssignment(val as AssignmentWithDetails)}
          />
          <div className="pt-4 flex items-center gap-4">
            <button
                disabled={!selectedAssignment}
                onClick={next}
                className="bg-school-primary text-slate-950 font-black px-10 py-4 rounded-2xl flex items-center gap-2 disabled:opacity-30 hover:scale-[1.02] transition-all"
            >
                Enter Syllabus Pool <ArrowRight className="h-4 w-4" />
            </button>
            {isPending && <Loader2 className="h-5 w-5 animate-spin text-school-primary" />}
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="p-10 bg-slate-900 border-white/5 rounded-[2.5rem] shadow-2xl space-y-8 animate-in fade-in">
          <div className="flex items-center gap-3">
             <Layers className="h-6 w-6 text-school-primary" />
             <h2 className="text-xl font-black text-white uppercase italic tracking-tight leading-none">Topic Mapping</h2>
          </div>
          <SyllabusSelector
            termGroups={termGroups}
            selectedTopicIds={selectedTopicIds}
            setSelectedTopicIds={handleSetTopics}
          />
          <div className="flex justify-between pt-6 border-t border-white/5">
            <button onClick={back} className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" /> Subject Link
            </button>
            <button onClick={next} disabled={selectedTopicIds.length === 0} className="bg-school-primary text-slate-950 font-black px-10 py-4 rounded-2xl flex items-center gap-2">
              Configure Schedule <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Card>
      )}

      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 text-slate-400 ml-2">
                <Settings className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Architect Engine Settings</span>
            </div>
            <SettingsSidebar onBuildPool={handleGenerate} />
          </div>
          
          <div className="space-y-6">
            <Card className="p-8 bg-slate-900/50 border-school-primary/20 border rounded-[2.5rem] h-fit space-y-6 shadow-2xl">
                <h3 className="text-xs font-black text-school-primary uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Schedule Context
                </h3>
                <div className="space-y-4">
                    <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Window Start</p>
                        <p className="text-sm font-bold text-white italic">{config.startTime || "Awaiting Input..."}</p>
                    </div>
                    {endTime && (
                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Projected End</p>
                            <p className="text-sm font-black text-emerald-400 italic">{new Date(endTime).toLocaleString()}</p>
                    </div>
                    )}
                    <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Room Allocation</p>
                        <p className="text-sm font-bold text-white">{selectedClassIds.length} Targeted</p>
                    </div>
                </div>
            </Card>

            {/* FIXED: Utilizing availableClasses to resolve unused variable warning */}
            <Card className="p-6 bg-slate-900 border-white/5 rounded-[2rem] space-y-4">
                <div className="flex items-center gap-2 text-slate-500">
                    <School className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Valid Registry Rooms</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {availableClasses.map(cls => (
                        <div key={cls.id} className="px-2 py-1 bg-slate-950 rounded border border-white/5 text-[8px] font-bold text-slate-400">
                            {cls.name}
                        </div>
                    ))}
                    {availableClasses.length === 0 && <p className="text-[9px] text-slate-600 italic">No rooms discovery yet...</p>}
                </div>
            </Card>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-8 animate-in zoom-in-95">
            <div className="flex justify-between items-center bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-xl">
                 <button onClick={back} className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-white transition-colors">
                    <ArrowLeft className="h-4 w-4"/> Revision
                 </button>
                 <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-school-primary" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Document Draft Blueprint</span>
                 </div>
            </div>
            <ExamDocumentPreview
                generatedPool={generatedPool}
                /**
                 * FIXED: We pass only 'title' to satisfy ExamConfig. 
                 * Child component does not expect endTime in its interface.
                 */
                config={{ title: config.title }}
                handleFinalDeploy={() => handleDeploy()}
                setStep={setStep}
                isViewOnly={false}
                isPending={isPending}
            />
        </div>
      )}
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={cn("px-3 py-1 rounded-full text-[9px] font-black tracking-widest border border-white/10", className)}>
            <GraduationCap className="h-3 w-3 inline-block mr-1 mb-0.5" />
            {children}
        </span>
    )
}