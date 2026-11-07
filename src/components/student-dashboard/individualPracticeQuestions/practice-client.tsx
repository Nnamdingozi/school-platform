// "use client";

// import React, { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Award } from "lucide-react";

// interface PracticeQuestionItem {
//   id: string;
//   questionText: string;
//   options: string[];
//   correctAnswer: string;
//   explanation: string | null;
//   difficulty: string;
// }

// interface PracticeInterfaceClientProps {
//   questions: PracticeQuestionItem[];
// }

// export function PracticeClient({ questions }: PracticeInterfaceClientProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [score, setScore] = useState(0);
//   const [isFinished, setIsFinished] = useState(false);

//   if (!questions || questions.length === 0) {
//     return (
//       <div className="max-w-2xl mx-auto text-center space-y-6 py-20">
//         <h2 className="text-2xl font-extrabold uppercase italic tracking-tighter">No Practice Questions Found</h2>
//         <p className="text-muted-foreground text-sm font-semibold uppercase tracking-widest">
//           Please ensure your subjects have been synchronized or try again later.
//         </p>
//       </div>
//     );
//   }

//   if (isFinished) {
//     const percentage = Math.round((score / questions.length) * 100);
//     return (
//       <div className="max-w-2xl mx-auto bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center space-y-8 animate-in fade-in duration-500">
//         <div className="h-20 w-20 bg-school-primary-50 rounded-full flex items-center justify-center mx-auto border border-school-primary-200">
//           <Award className="h-10 w-10 text-school-primary" />
//         </div>
//         <div className="space-y-3">
//           <h2 className="text-3xl font-extrabold uppercase italic tracking-tighter">Practice Session Complete</h2>
//           <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
//             You scored {score} out of {questions.length} ({percentage}%)
//           </p>
//         </div>
//         <Button 
//           onClick={() => {
//             setCurrentIndex(0);
//             setSelectedAnswer(null);
//             setIsSubmitted(false);
//             setScore(0);
//             setIsFinished(false);
//           }}
//           className="h-14 px-8 bg-school-primary text-on-school-primary font-extrabold rounded-2xl text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95"
//         >
//           <RotateCcw className="h-4 w-4 mr-2" /> Restart Practice
//         </Button>
//       </div>
//     );
//   }

//   const currentQ = questions[currentIndex];
//   // Ensure options is parsed if it came as a JSON string from the database
//   const optionsList: string[] = typeof currentQ.options === "string" 
//     ? JSON.parse(currentQ.options) 
//     : currentQ.options;

//   const handleSelect = (option: string) => {
//     if (isSubmitted) return;
//     setSelectedAnswer(option);
//   };

//   const handleSubmitAnswer = () => {
//     if (!selectedAnswer) return;
//     setIsSubmitted(true);
//     if (selectedAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase()) {
//       setScore((prev) => prev + 1);
//     }
//   };

//   const handleNext = () => {
//     setSelectedAnswer(null);
//     setIsSubmitted(false);
//     if (currentIndex + 1 < questions.length) {
//       setCurrentIndex((prev) => prev + 1);
//     } else {
//       setIsFinished(true);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
//       <div className="flex justify-between items-center bg-card border border-border px-6 py-4 rounded-2xl shadow-sm">
//         <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
//           Question {currentIndex + 1} of {questions.length}
//         </span>
//         <span className="px-3 py-1 bg-school-primary-50 text-school-primary rounded-full text-[9px] font-extrabold uppercase tracking-widest">
//           {currentQ.difficulty || "MEDIUM"}
//         </span>
//       </div>

//       <Card className="border border-border rounded-[2rem] shadow-xl bg-card overflow-hidden">
//         <CardHeader className="bg-surface/50 p-8 border-b border-border">
//           <CardTitle className="text-xl md:text-2xl font-extrabold uppercase italic tracking-tighter text-foreground leading-relaxed">
//             {currentQ.questionText}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-8 space-y-6">
//           <div className="grid gap-4">
//             {optionsList.map((opt, idx) => {
//               const isSelected = selectedAnswer === opt;
//               const isCorrect = opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
              
//               let styling = "border-border bg-surface/30 hover:border-school-primary/50 text-foreground";
//               if (isSubmitted) {
//                 if (isCorrect) styling = "border-emerald-500 bg-emerald-500/10 text-emerald-700 font-bold";
//                 else if (isSelected && !isCorrect) styling = "border-destructive bg-destructive/10 text-destructive";
//               } else if (isSelected) {
//                 styling = "border-school-primary bg-school-primary-50 text-school-primary font-bold shadow-inner";
//               }

//               return (
//                 <button
//                   key={idx}
//                   onClick={() => handleSelect(opt)}
//                   disabled={isSubmitted}
//                   className={`w-full text-left p-5 rounded-2xl border-2 transition-all text-xs font-semibold uppercase tracking-wider flex items-center justify-between ${styling}`}
//                 >
//                   <span>{opt}</span>
//                   {isSubmitted && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />}
//                   {isSubmitted && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive shrink-0" />}
//                 </button>
//               );
//             })}
//           </div>

//           {isSubmitted && currentQ.explanation && (
//             <div className="p-6 bg-surface border border-border rounded-2xl space-y-2 animate-in fade-in duration-300">
//               <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-school-primary italic">Instructor Explanation:</h4>
//               <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest leading-relaxed">
//                 {currentQ.explanation}
//               </p>
//             </div>
//           )}

//           <div className="pt-4 flex justify-end">
//             {!isSubmitted ? (
//               <Button 
//                 onClick={handleSubmitAnswer}
//                 disabled={!selectedAnswer}
//                 className="h-14 px-8 bg-school




"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Award } from "lucide-react";

interface PracticeQuestionItem {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
  difficulty: string;
}

interface PracticeInterfaceClientProps {
  questions: PracticeQuestionItem[];
}

export function PracticeClient({ questions }: PracticeInterfaceClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-20">
        <h2 className="text-2xl font-extrabold uppercase italic tracking-tighter">No Practice Questions Found</h2>
        <p className="text-muted-foreground text-sm font-semibold uppercase tracking-widest">
          Please ensure your subjects have been synchronized or try again later.
        </p>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center space-y-8 animate-in fade-in duration-500">
        <div className="h-20 w-20 bg-school-primary-50 rounded-full flex items-center justify-center mx-auto border border-school-primary-200">
          <Award className="h-10 w-10 text-school-primary" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold uppercase italic tracking-tighter">Practice Session Complete</h2>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
            You scored {score} out of {questions.length} ({percentage}%)
          </p>
        </div>
        <Button 
          onClick={() => {
            setCurrentIndex(0);
            setSelectedAnswer(null);
            setIsSubmitted(false);
            setScore(0);
            setIsFinished(false);
          }}
          className="h-14 px-8 bg-school-primary text-on-school-primary font-extrabold rounded-2xl text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95"
        >
          <RotateCcw className="h-4 w-4 mr-2" /> Restart Practice
        </Button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  // Ensure options is parsed if it came as a JSON string from the database
  const optionsList: string[] = typeof currentQ.options === "string" 
    ? JSON.parse(currentQ.options) 
    : currentQ.options;

  const handleSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    setIsSubmitted(true);
    if (selectedAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase()) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-card border border-border px-6 py-4 rounded-2xl shadow-sm">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="px-3 py-1 bg-school-primary-50 text-school-primary rounded-full text-[9px] font-extrabold uppercase tracking-widest">
          {currentQ.difficulty || "MEDIUM"}
        </span>
      </div>

      <Card className="border border-border rounded-[2rem] shadow-xl bg-card overflow-hidden">
        <CardHeader className="bg-surface/50 p-8 border-b border-border">
          <CardTitle className="text-xl md:text-2xl font-extrabold uppercase italic tracking-tighter text-foreground leading-relaxed">
            {currentQ.questionText}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid gap-4">
            {optionsList.map((opt, idx) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
              
              let styling = "border-border bg-surface/30 hover:border-school-primary/50 text-foreground";
              if (isSubmitted) {
                if (isCorrect) styling = "border-emerald-500 bg-emerald-500/10 text-emerald-700 font-bold";
                else if (isSelected && !isCorrect) styling = "border-destructive bg-destructive/10 text-destructive";
              } else if (isSelected) {
                styling = "border-school-primary bg-school-primary-50 text-school-primary font-bold shadow-inner";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(opt)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all text-xs font-semibold uppercase tracking-wider flex items-center justify-between ${styling}`}
                >
                  <span>{opt}</span>
                  {isSubmitted && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />}
                  {isSubmitted && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive shrink-0" />}
                </button>
              );
            })}
          </div>

          {isSubmitted && currentQ.explanation && (
            <div className="p-6 bg-surface border border-border rounded-2xl space-y-2 animate-in fade-in duration-300">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-school-primary italic">Instructor Explanation:</h4>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            {!isSubmitted ? (
              <Button 
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="h-14 px-8 bg-school-primary text-on-school-primary hover:opacity-90 font-extrabold rounded-2xl text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                Submit Answer
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                className="h-14 px-8 bg-school-primary text-on-school-primary hover:opacity-90 font-extrabold rounded-2xl text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95"
              >
                {currentIndex + 1 < questions.length ? "Next Question" : "View Results"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}