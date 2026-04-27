"use client";

import { useState, useEffect } from "react";
import { getGroupedTopics } from "@/app/actions/exam-engine.actions";
import { getGlobalPracticeQuestions } from "@/app/actions/individual-exam";
import { InteractiveQuiz } from "@/components/individual-student/exam/interactiveQuiz";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, PlayCircle, Library } from "lucide-react";
import { Question, Prisma } from "@prisma/client";

// Strict type for the grouped topics response
type GroupedTerm = Prisma.TermGetPayload<{
    include: {
        topics: {
            select: { id: true, title: true }
        }
    }
}>;

interface PracticeHubProps {
    userId: string;
    gradeSubjectId: string;
}

export function PracticeHub({ userId, gradeSubjectId }: PracticeHubProps) {
  const [terms, setTerms] = useState<GroupedTerm[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [view, setView] = useState<"setup" | "quiz">("setup");

  useEffect(() => {
    async function load() {
      try {
        const data = await getGroupedTopics(gradeSubjectId);
        setTerms(data as GroupedTerm[]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [gradeSubjectId]);

  const startSession = async () => {
    setIsStarting(true);
    try {
      // Pull strictly from Tier-1 Global Core
      const data = await getGlobalPracticeQuestions({ 
          topicIds: selectedTopicIds, 
          limit: 10 
      });
      setQuestions(data);
      setView("quiz");
    } finally {
      setIsStarting(false);
    }
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Indexing Subject Modules...</p>
        </div>
    );
  }

  if (view === "quiz") {
    return (
      <InteractiveQuiz 
        questions={questions} 
        topicId={selectedTopicIds[0]} // Record against primary topic
        gradeSubjectId={gradeSubjectId}
        userId={userId}
        schoolId={null} // Rule 6: Independent context
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-slate-900 border border-white/5 p-10 rounded-[3rem] space-y-8 shadow-2xl">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="h-12 w-12 bg-school-primary/10 rounded-2xl flex items-center justify-center text-school-primary">
                <Library className="h-6 w-6" />
            </div>
            <div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Practice configurations</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Select Global Modules for Evaluation</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {terms.map(term => (
            <div key={term.id} className="space-y-4">
              <h4 className="text-school-primary text-[10px] font-black uppercase tracking-[0.3em] pl-2">{term.displayName}</h4>
              <div className="space-y-2">
                {term.topics.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 bg-slate-950/50 p-4 rounded-2xl border border-white/5 hover:border-school-primary/30 transition-all group">
                    <Checkbox 
                      id={t.id} 
                      checked={selectedTopicIds.includes(t.id)}
                      onCheckedChange={(checked) => {
                        setSelectedTopicIds(prev => checked ? [...prev, t.id] : prev.filter(id => id !== t.id))
                      }}
                      className="border-white/20 data-[state=checked]:bg-school-primary data-[state=checked]:text-slate-950"
                    />
                    <label htmlFor={t.id} className="text-[10px] text-slate-400 font-black uppercase cursor-pointer group-hover:text-white transition-colors">
                        {t.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button 
          disabled={selectedTopicIds.length === 0 || isStarting}
          onClick={startSession}
          className="w-full bg-school-primary text-slate-950 font-black py-8 rounded-2xl text-xs tracking-[0.2em] uppercase hover:scale-[1.01] transition-transform shadow-xl shadow-school-primary/10"
        >
          {isStarting ? <Loader2 className="animate-spin" /> : <><PlayCircle className="mr-2 h-5 w-5" /> Initialize Global Test Engine</>}
        </Button>
      </div>
    </div>
  );
}