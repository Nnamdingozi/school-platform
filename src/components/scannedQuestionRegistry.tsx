"use client";

import { useState, useMemo } from "react";
import { Question, Role } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, CheckCircle2, GraduationCap, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScannedRegistryProps {
  questions: Question[];
  userRole: Role;
  onSelectionComplete?: (selectedIds: string[]) => void;
}

export function ScannedQuestionRegistry({ 
  questions, 
  userRole, 
  onSelectionComplete 
}: ScannedRegistryProps) {
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [selectionPercentage, setSelectionPercentage] = useState<number>(0);
  
  const isTeacher = userRole === Role.TEACHER || userRole === Role.SCHOOL_ADMIN;

  // reveal logic
  const toggleAnswer = (id: string) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Rule 9: Teacher Selection Logic (Random Sampling based on %)
  const selectedQuestions = useMemo(() => {
    if (!isTeacher || selectionPercentage === 0) return [];
    const count = Math.ceil((selectionPercentage / 100) * questions.length);
    // Sort randomly and take 'count'
    return [...questions].sort(() => 0.5 - Math.random()).slice(0, count);
  }, [selectionPercentage, questions, isTeacher]);

  const handleConfirmSelection = () => {
    if (onSelectionComplete) {
      onSelectionComplete(selectedQuestions.map(q => q.id));
    }
  };

  return (
    <div className="space-y-8">
      {/* ─── TOOLBAR ─── */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-6 rounded-[2rem] border border-white/5 gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-school-primary/10 rounded-2xl flex items-center justify-center text-school-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-white font-bold uppercase tracking-tighter">Scanned Registry</h3>
            <p className="text-slate-500 text-xs uppercase">{questions.length} Questions Discovered</p>
          </div>
        </div>

        {isTeacher && (
          <div className="flex items-center gap-6 bg-slate-950 p-4 rounded-2xl border border-white/10 w-full md:w-auto">
            <div className="flex flex-col gap-2 min-w-[200px]">
              <div className="flex justify-between text-[10px] font-black text-school-primary uppercase italic">
                <span>Select for Exam</span>
                <span>{selectionPercentage}%</span>
              </div>
              <Slider 
                value={[selectionPercentage]} 
                onValueChange={(val) => setSelectionPercentage(val[0])} 
                max={100} 
                step={5}
              />
            </div>
            <Button 
                onClick={handleConfirmSelection}
                disabled={selectionPercentage === 0}
                className="bg-school-primary text-slate-950 font-black rounded-xl"
            >
                <Percent className="h-4 w-4 mr-2" />
                Include {selectedQuestions.length}
            </Button>
          </div>
        )}
      </div>

      {/* ─── QUESTION GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {questions.map((q, idx) => {
          const isSelected = selectedQuestions.some(sq => sq.id === q.id);
          const isRevealed = revealedAnswers[q.id];

          return (
            <Card key={q.id} className={cn(
              "bg-slate-950 border-white/5 rounded-[2rem] overflow-hidden transition-all duration-300",
              isSelected && "ring-2 ring-school-primary border-transparent"
            )}>
              <CardHeader className="bg-slate-900/50 border-b border-white/5 flex flex-row items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-[10px] font-mono border-white/10 text-slate-500">
                    #{idx + 1}
                  </Badge>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {q.examBody} {q.year}
                  </span>
                </div>
                {isSelected && <CheckCircle2 className="h-5 w-5 text-school-primary animate-pulse" />}
              </CardHeader>

              <CardContent className="p-8 space-y-6">
                <p className="text-slate-200 text-lg leading-relaxed font-medium">
                  {q.text}
                </p>

                <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleAnswer(q.id)}
                    className="w-fit text-xs font-black uppercase tracking-widest text-school-primary hover:bg-school-primary/10"
                  >
                    {isRevealed ? <><EyeOff className="h-4 w-4 mr-2" /> Hide Solution</> : <><Eye className="h-4 w-4 mr-2" /> Reveal Solution</>}
                  </Button>

                  {isRevealed && (
                    <div className="bg-slate-900 rounded-2xl p-6 border border-school-primary/20 animate-in fade-in slide-in-from-top-2">
                        <h4 className="text-[10px] font-black text-school-primary uppercase mb-3">Pedagogical Explanation</h4>
                        <p className="text-sm text-slate-300 italic mb-4">"{q.correctAnswer}"</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {q.explanation}
                        </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}