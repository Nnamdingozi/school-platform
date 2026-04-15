// import { Card } from "@/components/ui/card"
// import { ArrowLeft, Printer, Loader2, CheckCircle2 } from "lucide-react"

// export function ExamDocumentPreview({
//   generatedPool,
//   config,
//   handleFinalDeploy,
//   setStep,
//   isViewOnly,
//   isPending
// }: any) {

//   return (
//     <div className="max-w-4xl mx-auto space-y-8 pb-20">

//       <div className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl">

//         <button
//           onClick={() => setStep(1)}
//           className="flex items-center gap-2 text-sm"
//         >
//           <ArrowLeft className="h-3 w-3" /> Back
//         </button>

//         <div className="flex gap-4">

//           <button
//             onClick={() => window.print()}
//             className="p-3 bg-slate-950 rounded-xl"
//           >
//             <Printer className="h-5 w-5" />
//           </button>

//           {!isViewOnly && (
//             <button
//               onClick={handleFinalDeploy}
//               disabled={isPending}
//               className="bg-school-primary text-black px-6 py-3 rounded-xl flex items-center gap-2"
//             >
//               {isPending
//                 ? <Loader2 className="h-4 w-4 animate-spin" />
//                 : <CheckCircle2 className="h-4 w-4" />
//               }

//               Deploy Exam
//             </button>
//           )}

//         </div>
//       </div>

//       <Card className="bg-white text-black p-12 rounded-3xl">

//         <h2 className="text-3xl font-black mb-10 text-center">
//           {config.title}
//         </h2>

//         <div className="space-y-10">

//           {generatedPool.map((q: any, idx: number) => (

//             <div key={idx}>

//               <p className="font-bold">
//                 Q{idx + 1}. {q.text}
//               </p>

//               <div className="grid grid-cols-2 gap-4 mt-4">

//                 {q.options.map((opt: string, i: number) => (
//                   <p key={i}>
//                     {String.fromCharCode(65 + i)}) {opt}
//                   </p>
//                 ))}

//               </div>

//             </div>

//           ))}

//         </div>

//       </Card>

//     </div>
//   )
// }


// import { useState } from "react"
// import { Card } from "@/components/ui/card"
// import {
//   ArrowLeft,
//   Printer,
//   Loader2,
//   CheckCircle2,
//   Download,
//   FileText
// } from "lucide-react"

// export function ExamDocumentPreview({
//   generatedPool,
//   config,
//   handleFinalDeploy,
//   setStep,
//   isViewOnly,
//   isPending
// }: any) {

//   const [questions, setQuestions] = useState(generatedPool)

//   // -----------------------------
//   // Update Question Text
//   // -----------------------------
//   const updateQuestion = (index: number, value: string) => {
//     const updated = [...questions]
//     updated[index].text = value
//     setQuestions(updated)
//   }

//   // -----------------------------
//   // Update Option
//   // -----------------------------
//   const updateOption = (qIndex: number, optIndex: number, value: string) => {
//     const updated = [...questions]
//     updated[qIndex].options[optIndex] = value
//     setQuestions(updated)
//   }

//   // -----------------------------
//   // Export as JSON
//   // -----------------------------
//   const exportJSON = () => {

//     const blob = new Blob(
//       [JSON.stringify(questions, null, 2)],
//       { type: "application/json" }
//     )

//     const url = URL.createObjectURL(blob)

//     const a = document.createElement("a")
//     a.href = url
//     a.download = `${config.title}-questions.json`
//     a.click()

//     URL.revokeObjectURL(url)
//   }

//   // -----------------------------
//   // Export as DOC (printable)
//   // -----------------------------
//   const exportDoc = () => {

//     const html = `
//       <html>
//       <head>
//         <title>${config.title}</title>
//       </head>
//       <body>
//         <h1>${config.title}</h1>
//         ${questions
//           .map(
//             (q: any, i: number) => `
//             <p><b>Q${i + 1}. ${q.text}</b></p>
//             ${q.options
//               .map(
//                 (opt: string, idx: number) =>
//                   `<p>${String.fromCharCode(65 + idx)}) ${opt}</p>`
//               )
//               .join("")}
//             <br/>
//           `
//           )
//           .join("")}
//       </body>
//       </html>
//     `

//     const blob = new Blob([html], { type: "application/msword" })

//     const url = URL.createObjectURL(blob)

//     const a = document.createElement("a")
//     a.href = url
//     a.download = `${config.title}.doc`
//     a.click()

//     URL.revokeObjectURL(url)
//   }

//   // -----------------------------
//   // Deploy Handler
//   // -----------------------------
//   const deployExam = () => {
//     handleFinalDeploy(questions)
//   }

//   return (
//     <div className="max-w-4xl mx-auto space-y-8 pb-20">

//       {/* Top Controls */}
//       <div className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl">

//         <button
//           onClick={() => setStep(1)}
//           className="flex items-center gap-2 text-sm"
//         >
//           <ArrowLeft className="h-3 w-3" /> Back
//         </button>

//         <div className="flex gap-3">

//           {/* Print */}
//           <button
//             onClick={() => window.print()}
//             className="p-3 bg-slate-950 rounded-xl"
//           >
//             <Printer className="h-5 w-5" />
//           </button>

//           {/* Export JSON */}
//           <button
//             onClick={exportJSON}
//             className="p-3 bg-slate-950 rounded-xl"
//           >
//             <Download className="h-5 w-5" />
//           </button>

//           {/* Export DOC */}
//           <button
//             onClick={exportDoc}
//             className="p-3 bg-slate-950 rounded-xl"
//           >
//             <FileText className="h-5 w-5" />
//           </button>

//           {/* Deploy */}
//           {!isViewOnly && (
//             <button
//               onClick={deployExam}
//               disabled={isPending}
//               className="bg-school-primary text-black px-6 py-3 rounded-xl flex items-center gap-2"
//             >
//               {isPending
//                 ? <Loader2 className="h-4 w-4 animate-spin" />
//                 : <CheckCircle2 className="h-4 w-4" />
//               }

//               Deploy Exam
//             </button>
//           )}

//         </div>
//       </div>

//       {/* Document */}
//       <Card className="bg-white text-black p-12 rounded-3xl">

//         <h2 className="text-3xl font-black mb-10 text-center">
//           {config.title}
//         </h2>

//         <div className="space-y-10">

//           {questions.map((q: any, idx: number) => (

//             <div key={idx}>

//               {/* Editable Question */}
//               {isViewOnly ? (
//                 <p className="font-bold">
//                   Q{idx + 1}. {q.text}
//                 </p>
//               ) : (
//                 <textarea
//                   className="w-full font-bold border p-2 rounded"
//                   value={q.text}
//                   onChange={(e) =>
//                     updateQuestion(idx, e.target.value)
//                   }
//                 />
//               )}

//               {/* Options */}
//               <div className="grid grid-cols-2 gap-4 mt-4">

//                 {q.options.map((opt: string, i: number) => (

//                   isViewOnly ? (

//                     <p key={i}>
//                       {String.fromCharCode(65 + i)}) {opt}
//                     </p>

//                   ) : (

//                     <input
//                       key={i}
//                       value={opt}
//                       className="border p-2 rounded"
//                       onChange={(e) =>
//                         updateOption(idx, i, e.target.value)
//                       }
//                     />

//                   )

//                 ))}

//               </div>

//             </div>

//           ))}

//         </div>

//       </Card>

//     </div>
//   )
// }






import { useState } from "react"
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  Printer,
  Loader2,
  CheckCircle2,
  Pencil,
  Save,
  X
} from "lucide-react"

export function ExamDocumentPreview({
  generatedPool,
  config,
  handleFinalDeploy,
  setStep,
  isViewOnly,
  isPending
}: any) {

  const [questions, setQuestions] = useState(generatedPool)
  const [editing, setEditing] = useState(false)

  const updateQuestion = (index: number, value: string) => {
    const updated = [...questions]
    updated[index].text = value
    setQuestions(updated)
  }

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions]
    updated[qIndex].options[optIndex] = value
    setQuestions(updated)
  }

  const deployExam = () => {
    handleFinalDeploy(questions)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">

      {/* Top Controls */}
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl">

        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </button>

        <div className="flex gap-4">

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="p-3 bg-slate-950 rounded-xl"
          >
            <Printer className="h-5 w-5" />
          </button>

          {/* EDIT BUTTON */}
          {!editing && !isViewOnly && (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit Exam
            </button>
          )}

          {/* DEPLOY BUTTON */}
          {!isViewOnly && (
            <button
              onClick={deployExam}
              disabled={isPending}
              className="bg-school-primary text-black px-6 py-3 rounded-xl flex items-center gap-2"
            >
              {isPending
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <CheckCircle2 className="h-4 w-4" />
              }

              Deploy Exam
            </button>
          )}

          {/* SAVE / CANCEL when editing */}
          {editing && (
            <>
              <button
                onClick={() => setEditing(false)}
                className="bg-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>

              <button
                onClick={() => {
                  setQuestions(generatedPool)
                  setEditing(false)
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </>
          )}

        </div>
      </div>

      {/* Document */}
      <Card className="bg-white text-black p-12 rounded-3xl">

        <h2 className="text-3xl font-black mb-10 text-center">
          {config.title}
        </h2>

        <div className="space-y-10">

          {questions.map((q: any, idx: number) => (

            <div key={idx}>

              {editing ? (

                <textarea
                  className="w-full border p-2 rounded font-bold"
                  value={q.text}
                  onChange={(e) =>
                    updateQuestion(idx, e.target.value)
                  }
                />

              ) : (

                <p className="font-bold">
                  Q{idx + 1}. {q.text}
                </p>

              )}

              <div className="grid grid-cols-2 gap-4 mt-4">

                {q.options.map((opt: string, i: number) => (

                  editing ? (

                    <input
                      key={i}
                      value={opt}
                      className="border p-2 rounded"
                      onChange={(e) =>
                        updateOption(idx, i, e.target.value)
                      }
                    />

                  ) : (

                    <p key={i}>
                      {String.fromCharCode(65 + i)}) {opt}
                    </p>

                  )

                ))}

              </div>

            </div>

          ))}

        </div>

      </Card>

    </div>
  )
}