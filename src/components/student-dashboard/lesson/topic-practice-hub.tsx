"use client";

import React, { useEffect, useState } from "react";
import { fetchMultiTopicPracticeQuestions } from "@/app/actions/practiceQuestions";
import { PracticeClient } from "@/components/student-dashboard/individualPracticeQuestions/practice-client";
import { Loader2 } from "lucide-react";

interface TopicPracticeHubProps {
  topicId: string;
  userId: string;
}

export function TopicPracticeHub({ topicId, userId }: TopicPracticeHubProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopicPractice() {
      setLoading(true);
      const res = await fetchMultiTopicPracticeQuestions({
        userId,
        topicIds: [topicId], // 👈 Restrict pool strictly to this current topic
        limit: 10,
      });
      if (res.success) {
        setQuestions(res.questions);
      }
      setLoading(false);
    }
    loadTopicPractice();
  }, [topicId, userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
      </div>
    );
  }

  return <PracticeClient questions={questions} />;
}