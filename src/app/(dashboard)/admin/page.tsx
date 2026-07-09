
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getAnalyticsData, getUnassignedStudents } from "@/app/actions/analytics.action";
import { AdminDashboardClient } from "@/components/admin-dasboard/adminDashBoardClient";

export async function generateMetadata(): Promise<Metadata> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { title: "Dashboard | SchoolPaaS" };

    const profile = await prisma.profile.findUnique({
        where: { id: user.id },
        include: { school: { select: { name: true } } },
    });

    return {
        title: `Dashboard | ${profile?.school?.name || "Institution"} | SchoolPaaS`,
        description: "Institutional overview and operational dashboard.",
    };
}

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const profile = await prisma.profile.findUnique({
        where: { id: user.id },
        include: {
            school: {
                include: {
                    _count: { select: { users: true } },
                },
            },
        },
    });

    if (
        !profile?.schoolId ||
        (profile.role !== Role.SCHOOL_ADMIN && profile.role !== Role.SUPER_ADMIN)
    ) {
        redirect("/teacher?error=unauthorized");
    }

    // Parallel fetch — same pattern as pastQuestions page
    const [analyticsData, unassignedData] = await Promise.all([
        getAnalyticsData(profile.schoolId),
        getUnassignedStudents(profile.schoolId),
    ]);

    return (
        <AdminDashboardClient
            analyticsData={analyticsData}
            unassignedData={unassignedData}
            userCount={profile.school?._count.users ?? 0}
            whatsappCredits={profile.school?.whatsappCredits ?? 0}
        />
    );
}


