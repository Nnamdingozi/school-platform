// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";

// interface FilterProps {
//   subjects: { id: string; name: string }[];
//   years: number[];
//   examBodies: string[];
// }

// export function BankFilters({ subjects, years, examBodies }: FilterProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const updateFilter = (key: string, value: string) => {
//     const params = new URLSearchParams(searchParams.toString());
//     if (value === "all") {
//       params.delete(key);
//     } else {
//       params.set(key, value);
//     }
//     router.push(`?${params.toString()}`);
//   };

//   const clearFilters = () => {
//     router.push("?");
//   };

//   return (
//     <div className="flex flex-wrap gap-4 items-center bg-slate-900/50 p-4 rounded-3xl border border-white/5">
//       {/* Subject Filter */}
//       <Select 
//         value={searchParams.get("subjectId") || "all"} 
//         onValueChange={(v) => updateFilter("subjectId", v)}
//       >
//         <SelectTrigger className="w-[200px] bg-slate-950 border-white/10 rounded-xl text-xs uppercase font-bold">
//           <SelectValue placeholder="All Subjects" />
//         </SelectTrigger>
//         <SelectContent className="bg-slate-950 border-white/10 text-white">
//           <SelectItem value="all">All Subjects</SelectItem>
//           {subjects.map(s => (
//             <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       {/* Year Filter */}
//       <Select 
//         value={searchParams.get("year") || "all"} 
//         onValueChange={(v) => updateFilter("year", v)}
//       >
//         <SelectTrigger className="w-[140px] bg-slate-950 border-white/10 rounded-xl text-xs uppercase font-bold">
//           <SelectValue placeholder="All Years" />
//         </SelectTrigger>
//         <SelectContent className="bg-slate-950 border-white/10 text-white">
//           <SelectItem value="all">All Years</SelectItem>
//           {years.map(y => (
//             <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       {/* Exam Body Filter */}
//       <Select 
//         value={searchParams.get("examBody") || "all"} 
//         onValueChange={(v) => updateFilter("examBody", v)}
//       >
//         <SelectTrigger className="w-[160px] bg-slate-950 border-white/10 rounded-xl text-xs uppercase font-bold">
//           <SelectValue placeholder="All Bodies" />
//         </SelectTrigger>
//         <SelectContent className="bg-slate-950 border-white/10 text-white">
//           <SelectItem value="all">All Bodies</SelectItem>
//           {examBodies.map(e => (
//             <SelectItem key={e} value={e}>{e}</SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       {searchParams.toString() !== "" && (
//         <Button 
//             variant="ghost" 
//             onClick={clearFilters}
//             className="text-slate-500 hover:text-white text-[10px] uppercase font-black"
//         >
//           <X className="h-3 w-3 mr-2" /> Reset
//         </Button>
//       )}
//     </div>
//   );
// }



// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getScannedQuestions } from "@/app/actions/scanned-question-bank";
// import { academicCoreScope } from "@/lib/content-scope";
// import { ScannedBankClient } from "@/components/scan/scannedQuestionbankClient";
// import { Role } from "@prisma/client";

// /**
//  * Rule 16: Dynamic SEO
//  */
// export async function generateMetadata(): Promise<Metadata> {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) return { title: "Scanned Bank | SchoolPaaS" };

//   const profile = await prisma.profile.findUnique({
//     where: { id: user.id },
//     include: { school: { select: { name: true } } }
//   });

//   return {
//     title: `Digitized Registry | ${profile?.school?.name || "Personal"} | SchoolPaaS`,
//     description: "Access and filter institutional and personal scanned exam questions."
//   };
// }

// /**
//  * Rule 12: Server-First Data Fetching
//  */
// export default async function ScannedBankPage({ 
//   searchParams 
// }: { 
//   searchParams: Promise<{ subjectId?: string; year?: string; examBody?: string }> 
// }) {
//   const params = await searchParams;

//   // 1. Resolve Identity (Rule 10)
//   const supabase = await createClient();
//   const { data: { user: authUser } } = await supabase.auth.getUser();
//   if (!authUser) redirect("/login");

//   const profile = await prisma.profile.findUnique({
//     where: { id: authUser.id },
//     select: { id: true, schoolId: true, role: true }
//   });

//   if (!profile) redirect("/login");

//   // 2. Fetch Metadata for Filters (Rule 7: Global + School)
//   const [subjects, yearsData, bodiesData] = await Promise.all([
//     prisma.subject.findMany({
//       where: academicCoreScope({ schoolId: profile.schoolId }),
//       select: { id: true, name: true },
//       orderBy: { name: 'asc' }
//     }),
//     prisma.question.findMany({
//         where: { category: "SCANNED", OR: [{ schoolId: profile.schoolId }, { creatorId: profile.id }] },
//         distinct: ['year'],
//         select: { year: true },
//         orderBy: { year: 'desc' }
//     }),
//     prisma.question.findMany({
//         where: { category: "SCANNED", OR: [{ schoolId: profile.schoolId }, { creatorId: profile.id }] },
//         distinct: ['examBody'],
//         select: { examBody: true }
//     })
//   ]);

//   // 3. Fetch Initial Filtered Results (Rule 11 System Truth)
//   const questions = await getScannedQuestions({
//     userId: profile.id,
//     schoolId: profile.schoolId,
//     subjectId: params.subjectId,
//     year: params.year ? parseInt(params.year) : undefined,
//     examBody: params.examBody,
//   });

//   return (
//     <ScannedBankClient 
//       initialQuestions={questions}
//       filterOptions={{
//         subjects,
//         years: yearsData.map(y => y.year).filter((y): y is number => y !== null),
//         examBodies: bodiesData.map(b => b.examBody).filter((b): b is string => b !== null)
//       }}
//       userRole={profile.role}
//     />
//   );
// }


import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getScannedPapers } from "@/app/actions/scanned-question-bank";
import { ArchiveHubClient } from "@/components/scan/pastQuestionArchiveHubClient";

export const metadata: Metadata = {
    title: "CBT Archive | Registry | SchoolPaaS",
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

    const [subjects, papers] = await Promise.all([
        prisma.subject.findMany({ where: { curriculumId: profile?.curriculumId }, select: { id: true, name: true } }),
        getScannedPapers(profile?.schoolId ?? null, profile?.id ?? "")
    ]);

    return (
        <ArchiveHubClient 
            userId={profile!.id}
            schoolId={profile!.schoolId}
            userRole={profile!.role}
            subjects={subjects}
            initialPapers={papers}
        />
    );
}