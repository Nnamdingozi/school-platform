// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getScannedPapers } from "@/app/actions/scanned-question-bank";
// import { ArchiveHubClient } from "@/components/scan/visionArchitechClient";

// export const metadata: Metadata = {
//     title: "CBT Archive | Registry | SchoolPaaS",
//     description: "Manage institutional and personal digitized examination papers.",
// };

// export default async function Page() {
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) redirect("/login");

//     const profile = await prisma.profile.findUnique({
//         where: { id: user.id },
//         select: { id: true, schoolId: true, role: true, curriculumId: true }
//     });

//     const [subjects, papers] = await Promise.all([
//         prisma.subject.findMany({ where: { curriculumId: profile?.curriculumId }, select: { id: true, name: true } }),
//         getScannedPapers(profile?.schoolId ?? null, profile?.id ?? "")
//     ]);

//     return (
//         <ArchiveHubClient 
//             userId={profile!.id}
//             schoolId={profile!.schoolId}
//             userRole={profile!.role}
//             subjects={subjects}
//             initialPapers={papers}
//         />
//     );
// }



import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getScannedPapers } from "@/app/actions/scanned-question-bank";
import { ArchiveHubClient } from "@/components/scan/pastQuestionArchiveHubClient";

export const metadata: Metadata = {
    title: "CBT Archive Hub | Registry | SchoolPaaS",
    description: "Manage institutional and personal digitized examination papers.",
};

export default async function Page() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const profile = await prisma.profile.findUnique({
        where: { id: user.id },
        select: { id: true, schoolId: true, role: true, curriculumId: true }
    });

    if (!profile) redirect("/login");

    const [subjects, papers] = await Promise.all([
        prisma.subject.findMany({ 
            where: { 
                OR: [{ schoolId: null }, { schoolId: profile.schoolId }] 
            }, 
            select: { id: true, name: true } 
        }),
        getScannedPapers(profile.schoolId, profile.id)
    ]);

    return (
        <ArchiveHubClient 
            userId={profile.id}
            schoolId={profile.schoolId}
            userRole={profile.role}
            subjects={subjects}
            initialPapers={papers}
        />
    );
}