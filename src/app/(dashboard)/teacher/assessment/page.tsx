


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




'use client'

import { useState, useEffect, useTransition, useCallback, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowRight } from "lucide-react"

import {
  getTeacherAuthorizedAssignments,
  getClassesByGradeLevel,
  getGroupedTopics,
  buildExamPool,
  finalizeAndDeployExam,
} from "@/app/actions/exam-engine.actions"

import { useProfileStore } from "@/store/profileStore"

import { SubjectSelector } from "@/components/TeacherDashboard/exams/subjectSelector"
import { SyllabusSelector } from "@/components/TeacherDashboard/exams/syllabusSelector"
import { SettingsSidebar } from "@/components/TeacherDashboard/exams/settingsSidebar"
import { ExamDocumentPreview } from "@/components/TeacherDashboard/exams/ExamDocumentPreview"

export default function TeacherExamArchitect() {
  const { profile } = useProfileStore()
  const [isPending, startTransition] = useTransition()

  // ───────────────── STEPS ─────────────────
  const [step, setStep] = useState(1)

  // ───────────────── DATA ─────────────────
  const [assignments, setAssignments] = useState<any[]>([])
  const [termGroups, setTermGroups] = useState<any[]>([])
  const [validClassrooms, setValidClassrooms] = useState<any[]>([])
  const [generatedPool, setGeneratedPool] = useState<any[]>([])

  // ───────────────── SELECTIONS ─────────────────
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])

  // ───────────────── CONFIG ─────────────────
  const [config, setConfig] = useState({
    title: "",
    duration: 60,
    startTime: "", // ISO string or datetime-local input
    totalQuestions: 20,
    reusePercentage: 30
  })

  // ───────────────── COMPUTED END TIME (SAFE) ─────────────────
  const endTime = useMemo(() => {
    if (!config.startTime || !config.duration) return null

    const start = new Date(config.startTime)
    if (isNaN(start.getTime())) return null

    return new Date(start.getTime() + config.duration * 60000).toISOString()
  }, [config.startTime, config.duration])

  // ───────────────── LOAD ASSIGNMENTS ─────────────────
  const loadAssignments = useCallback(async () => {
    if (!profile?.id || !profile?.schoolId) return

    const data = await getTeacherAuthorizedAssignments(profile.id, profile.schoolId)
    setAssignments(data)
  }, [profile])

  useEffect(() => {
    loadAssignments()
  }, [loadAssignments])

  // ───────────────── LOAD TOPICS + CLASSES ─────────────────
  useEffect(() => {
    if (!selectedAssignment || !profile?.schoolId) return

    getGroupedTopics(selectedAssignment.id).then(setTermGroups)
    getClassesByGradeLevel(selectedAssignment.gradeId, profile.schoolId).then(setValidClassrooms)

    setSelectedTopicIds([])
    setSelectedClassIds([])
  }, [selectedAssignment])

  // ───────────────── NAVIGATION ─────────────────
  const next = () => setStep((s) => Math.min(s + 1, 4))
  const back = () => setStep((s) => Math.max(s - 1, 1))

  // ───────────────── GENERATE QUESTIONS ─────────────────
  const handleGenerate = () => {
    if (selectedTopicIds.length === 0) {
      return toast.error("Select at least one topic")
    }

    startTransition(async () => {
      const res = await buildExamPool({
        topicIds: selectedTopicIds,
        totalQuestions: config.totalQuestions,
        reusePercentage: config.reusePercentage,
        schoolId: profile!.schoolId!
      })

      if (!res.success) 
        toast.error(res.error)

      setGeneratedPool(res.questions || [])
      next()
    })
  }

  // ───────────────── DEPLOY EXAM ─────────────────
  const handleDeploy = () => {
    if (!config.startTime) {
      return toast.error("Please set exam start time")
    }
  
    if (!endTime) {
      return toast.error("Invalid exam time")
    }
  
    const startDate = new Date(config.startTime)
    const endDate = new Date(endTime)
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return toast.error("Invalid date format")
    }
  
    startTransition(async () => {
      const res = await finalizeAndDeployExam(
        {
          title: config.title,
          duration: config.duration,
          startTime: startDate,
          endTime: endDate,
  
          // ✅ ADD THESE
          totalQuestions: config.totalQuestions,
          reusePercentage: config.reusePercentage,
          status: "SCHEDULED",
  
          teacherId: profile!.id,
          classIds: selectedClassIds,
          schoolId: profile!.schoolId!,
          topicIds: selectedTopicIds,
          termId: termGroups[0]?.id || "",
          type: "TERMLY",
        },
        generatedPool
      )
  
      if (!res.success) {
        toast.error(res.error)
        return
      }
  
      toast.success("Exam scheduled successfully")
      setStep(1)
    })
  }
  

  // ───────────────── UI ─────────────────
  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-50 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black">Exam Builder Wizard</h1>
        <p className="text-slate-400 text-sm">Step {step} of 4</p>
      </div>

      {/* PROGRESS */}
      <div className="h-2 bg-slate-800 rounded-full">
        <div
          className="h-2 bg-green-500 rounded-full transition-all"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <Card className="p-6 space-y-4">
          <h2 className="font-bold">Step 1: Select Subject</h2>

          <SubjectSelector
            assignments={assignments}
            selectedAssignment={selectedAssignment}
            setSelectedAssignment={setSelectedAssignment}
          />

          <button
            disabled={!selectedAssignment}
            onClick={next}
            className="bg-green-500 px-6 py-2 rounded-lg flex items-center gap-2"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        </Card>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <Card className="p-6 space-y-4">
          <h2 className="font-bold">Step 2: Select Topics</h2>

          <SyllabusSelector
            termGroups={termGroups}
            selectedTopicIds={selectedTopicIds}
            setSelectedTopicIds={setSelectedTopicIds}
          />

          <div className="flex justify-between">
            <button onClick={back}>Back</button>
            <button
              onClick={next}
              disabled={selectedTopicIds.length === 0}
              className="bg-green-500 px-6 py-2 rounded-lg"
            >
              Next
            </button>
          </div>
        </Card>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <Card className="p-6 space-y-6">

          <h2 className="font-bold text-lg">
            Step 3: Class & Exam Scheduling
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <SettingsSidebar
              validClassrooms={validClassrooms}
              selectedClassIds={selectedClassIds}
              toggleClass={(id: string) =>
                setSelectedClassIds((prev) =>
                  prev.includes(id)
                    ? prev.filter((i) => i !== id)
                    : [...prev, id]
                )
              }
              config={config}
              setConfig={setConfig}
              handleBuildPool={handleGenerate}
              isPending={isPending}
            />

            {/* LIVE SCHEDULE PREVIEW */}
            <Card className="p-4 bg-slate-900 border border-white/10">
              <h3 className="font-bold mb-2">Exam Schedule</h3>

              <p className="text-sm text-slate-400">
                Start: {config.startTime || "Not set"}
              </p>

              <p className="text-sm text-slate-400">
                Duration: {config.duration} mins
              </p>

              <p className="text-sm text-green-400">
                End: {endTime || "Not calculated"}
              </p>
            </Card>

          </div>

          <div className="flex justify-between pt-4 border-t border-white/10">
            <button onClick={back}>Back</button>

            <button
              onClick={handleGenerate}
              disabled={
                selectedClassIds.length === 0 ||
                selectedTopicIds.length === 0
              }
              className="bg-green-500 px-6 py-2 rounded-lg"
            >
              Generate Questions
            </button>
          </div>
        </Card>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <Card className="p-6 space-y-4">

          <h2 className="font-bold">Step 4: Preview & Deploy</h2>

          <ExamDocumentPreview
            generatedPool={generatedPool}
            config={{
              ...config,
              endTime
            }}
            handleFinalDeploy={handleDeploy}
            setStep={setStep}
            isViewOnly={false}
            isPending={isPending}
          />

          <div className="flex justify-between">
            <button onClick={back}>Back</button>

            <button
              onClick={handleDeploy}
              className="bg-blue-600 px-6 py-2 rounded-lg"
            >
              Deploy Exam
            </button>
          </div>

        </Card>
      )}

    </div>
  )
}