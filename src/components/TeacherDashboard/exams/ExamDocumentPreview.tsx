import { Card } from "@/components/ui/card"
import { ArrowLeft, Printer, Loader2, CheckCircle2 } from "lucide-react"

export function ExamDocumentPreview({
  generatedPool,
  config,
  handleFinalDeploy,
  setStep,
  isViewOnly,
  isPending
}: any) {

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">

      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl">

        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </button>

        <div className="flex gap-4">

          <button
            onClick={() => window.print()}
            className="p-3 bg-slate-950 rounded-xl"
          >
            <Printer className="h-5 w-5" />
          </button>

          {!isViewOnly && (
            <button
              onClick={handleFinalDeploy}
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

        </div>
      </div>

      <Card className="bg-white text-black p-12 rounded-3xl">

        <h2 className="text-3xl font-black mb-10 text-center">
          {config.title}
        </h2>

        <div className="space-y-10">

          {generatedPool.map((q: any, idx: number) => (

            <div key={idx}>

              <p className="font-bold">
                Q{idx + 1}. {q.text}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-4">

                {q.options.map((opt: string, i: number) => (
                  <p key={i}>
                    {String.fromCharCode(65 + i)}) {opt}
                  </p>
                ))}

              </div>

            </div>

          ))}

        </div>

      </Card>

    </div>
  )
}