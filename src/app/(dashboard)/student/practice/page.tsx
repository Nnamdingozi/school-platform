import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { fetchMultiTopicPracticeQuestions } from "@/app/actions/practiceQuestions";
import { PracticeClient } from "@/components/student-dashboard/individualPracticeQuestions/practice-client";

export default async function PracticePage() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) redirect("/login");

    // Fetch randomized questions for this student
    const result = await fetchMultiTopicPracticeQuestions({
        userId: authUser.id,
        limit: 15,
    });

    return (
        <main className="min-h-screen bg-background p-6 md:p-12">
            <PracticeClient questions={result.questions || []} />
        </main>
    );
}