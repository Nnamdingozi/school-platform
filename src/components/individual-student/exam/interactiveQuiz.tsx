// "use client"

// import { useState } from "react"
// import { Question } from "@prisma/client"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { toast } from "sonner"
// import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react"
// import { submitPracticeQuizAction } from "@/app/actions/individual-exam"
// import { cn } from "@/lib/utils"

// interface QuizProps {
//   questions: Question[];
//   topicId: string;
//   gradeSubjectId: string;
//   userId: string;
//   schoolId: string | null;
// }

// export function InteractiveQuiz({ questions, topicId, gradeSubjectId, userId, schoolId }: QuizProps) {
//   const [currentIdx, setCurrentIdx] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [score, setScore] = useState(0);
//   const [isFinished, setIsFinished] = useState(false);

//   if (questions.length === 0) {
//     return (
//       <div className="py-20 text-center bg-slate-900/50 rounded-[2rem] border border-white/5">
//         <p className="text-slate-500 uppercase font-black text-xs">No practice questions available for this module yet.</p>
//       </div>
//     );
//   }

//   const currentQuestion = questions[currentIdx];
//   const options = currentQuestion.options as string[];

//   const handleNext = async () => {
//     const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
//     const newScore = isCorrect ? score + 1 : score;
    
//     if (currentIdx < questions.length - 1) {
//       setScore(newScore);
//       setCurrentIdx(currentIdx + 1);
//       setSelectedAnswer(null);
//       setIsSubmitted(false);
//     } else {
//       // Final Submission
//       setScore(newScore);
//       setIsFinished(true);
//       await submitPracticeQuizAction({
//         userId,
//         topicId,
//         gradeSubjectId,
//         score: newScore,
//         maxScore: questions.length,
//         schoolId
//       });
//       toast.success("Progress synchronized to your registry.");
//     }
//   };

//   if (isFinished) {
//     return (
//       <Card className="bg-slate-900 border-school-primary/20 rounded-[2.5rem] p-12 text-center space-y-6">
//         <Trophy className="h-16 w-16 text-school-primary mx-auto animate-bounce" />
//         <h2 className="text-3xl font-black text-white uppercase italic">Practice Complete</h2>
//         <p className="text-5xl font-black text-school-primary">{score} / {questions.length}</p>
//         <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl border-white/10 text-white font-black uppercase">
//           <RotateCcw className="mr-2 h-4 w-4" /> Restart Session
//         </Button>
//       </Card>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto space-y-8">
//       <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest">
//         <span>Question {currentIdx + 1} of {questions.length}</span>
//         <span className="text-school-primary">Accuracy: {score}</span>
//       </div>

//       <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden">
//         <CardContent className="p-10 space-y-8">
//           <p className="text-xl text-white font-bold leading-relaxed">{currentQuestion.text}</p>
          
//           <div className="grid grid-cols-1 gap-3">
//             {options.map((opt) => (
//               <button
//                 key={opt}
//                 disabled={isSubmitted}
//                 onClick={() => setSelectedAnswer(opt)}
//                 className={cn(
//                   "p-5 rounded-2xl text-left text-sm font-bold border transition-all",
//                   selectedAnswer === opt ? "border-school-primary bg-school-primary/10 text-white" : "border-white/5 bg-slate-950/50 text-slate-400 hover:border-white/20",
//                   isSubmitted && opt === currentQuestion.correctAnswer && "border-emerald-500 bg-emerald-500/10 text-emerald-400",
//                   isSubmitted && selectedAnswer === opt && opt !== currentQuestion.correctAnswer && "border-red-500 bg-red-500/10 text-red-400"
//                 )}
//               >
//                 {opt}
//               </button>
//             ))}
//           </div>

//           {!isSubmitted ? (
//             <Button 
//               disabled={!selectedAnswer} 
//               onClick={() => setIsSubmitted(true)}
//               className="w-full bg-school-primary text-slate-950 font-black rounded-xl py-6"
//             >
//               CHECK ANSWER
//             </Button>
//           ) : (
//             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
//               <div className="p-6 bg-slate-950 rounded-2xl border border-white/5">
//                 <h4 className="text-[10px] font-black text-school-primary uppercase mb-2">Pedagogical Rationale</h4>
//                 <p className="text-sm text-slate-400 italic leading-relaxed">{currentQuestion.explanation}</p>
//               </div>
//               <Button onClick={handleNext} className="w-full bg-white text-slate-950 font-black rounded-xl py-6">
//                 CONTINUE <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


"use client"

import { useState } from "react"
import { Question, Role } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowRight, RotateCcw, Trophy, Zap } from "lucide-react"
import { submitPracticeQuizAction } from "@/app/actions/individual-exam"
import { cn } from "@/lib/utils"

interface QuizProps {
  questions: Question[];
  topicId: string;
  gradeSubjectId: string;
  userId: string;
  schoolId: string | null;
}

export function InteractiveQuiz({ questions, topicId, gradeSubjectId, userId, schoolId }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Helper to safely parse Prisma JSON options
  const getOptions = (q: Question): string[] => {
    if (Array.isArray(q.options)) return q.options as string[];
    return [];
  };

  if (questions.length === 0) {
    return (
      <div className="py-20 text-center bg-slate-900/50 rounded-[3rem] border border-white/5">
        <p className="text-slate-500 uppercase font-black text-xs">No MCQ assets discovered for this selection.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const options = getOptions(currentQuestion);

  const handleNext = async () => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    
    if (currentIdx < questions.length - 1) {
      setScore(newScore);
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      // Final Submission (Rule 11 System Truth)
      setScore(newScore);
      setIsFinished(true);
      await submitPracticeQuizAction({
        userId,
        topicId,
        gradeSubjectId,
        score: newScore,
        maxScore: questions.length,
        schoolId
      });
      toast.success("Progress synchronized to your registry.");
    }
  };

  if (isFinished) {
    return (
      <Card className="bg-slate-900 border-school-primary/20 rounded-[2.5rem] p-12 text-center space-y-6 animate-in zoom-in-95">
        <Trophy className="h-16 w-16 text-school-primary mx-auto animate-bounce" />
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Evaluation Complete</h2>
        <div className="space-y-1">
            <p className="text-5xl font-black text-school-primary">{score} / {questions.length}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Proficiency Score</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl border-white/10 text-white font-black uppercase text-[10px] tracking-widest">
          <RotateCcw className="mr-2 h-4 w-4" /> Initialize New Session
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
        <span>Item {currentIdx + 1} of {questions.length}</span>
        <span className="text-school-primary flex items-center gap-2">
            <Zap className="h-3 w-3" /> Cumulative: {score}
        </span>
      </div>

      <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardContent className="p-10 space-y-8">
          <p className="text-xl text-white font-bold leading-relaxed">{currentQuestion.text}</p>
          
          <div className="grid grid-cols-1 gap-3">
            {options.map((opt) => (
              <button
                key={opt}
                disabled={isSubmitted}
                onClick={() => setSelectedAnswer(opt)}
                className={cn(
                  "p-5 rounded-2xl text-left text-sm font-bold border transition-all",
                  selectedAnswer === opt ? "border-school-primary bg-school-primary/10 text-white" : "border-white/5 bg-slate-950/50 text-slate-400 hover:border-white/20",
                  isSubmitted && opt === currentQuestion.correctAnswer && "border-emerald-500 bg-emerald-500/10 text-emerald-400",
                  isSubmitted && selectedAnswer === opt && opt !== currentQuestion.correctAnswer && "border-red-500 bg-red-500/10 text-red-400"
                )}
              >
                {opt}
              </button>
            ))}
          </div>

          {!isSubmitted ? (
            <Button 
              disabled={!selectedAnswer} 
              onClick={() => setIsSubmitted(true)}
              className="w-full bg-school-primary text-slate-950 font-black rounded-xl py-8 text-xs tracking-widest uppercase"
            >
              VALIDATE RESPONSE
            </Button>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-6 bg-slate-950 rounded-2xl border border-white/5">
                <h4 className="text-[10px] font-black text-school-primary uppercase mb-2">Pedagogical Rationale</h4>
                <p className="text-sm text-slate-400 italic leading-relaxed">{currentQuestion.explanation}</p>
              </div>
              <Button onClick={handleNext} className="w-full bg-white text-slate-950 font-black rounded-xl py-8 text-xs tracking-widest uppercase">
                CONTINUE <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}