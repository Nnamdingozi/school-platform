// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useProfileStore } from '@/store/profileStore'
// import { getStudentsBySchool, UserListItem } from '@/app/actions/user-management'
// import { Search, UserPlus, X } from 'lucide-react'
// import { toast } from 'sonner'
// import { UserCard, UserListSkeleton, EmptyState } from '@/components/shared/user-card'


// export default function StudentsPage() {
//     const router      = useRouter()
//     const { profile } = useProfileStore()
//     const schoolId    = profile?.schoolId ?? ''

//     const [students, setStudents] = useState<UserListItem[]>([])
//     const [filtered, setFiltered] = useState<UserListItem[]>([])
//     const [loading,  setLoading]  = useState(true)
//     const [query,    setQuery]    = useState('')

//     useEffect(() => {
//         if (!schoolId) return
//         setLoading(true)
//         getStudentsBySchool(schoolId)
//             .then(data => {
//                 setStudents(data)
//                 setFiltered(data)
//                 setLoading(false)
//             })
//             .catch(() => {
//                 toast.error('Failed to load students.')
//                 setLoading(false)
//             })
//     }, [schoolId])

//     useEffect(() => {
//         const q = query.toLowerCase()
//         setFiltered(
//             students.filter(s =>
//                 s.name?.toLowerCase().includes(q) ||
//                 s.email.toLowerCase().includes(q) ||
//                 s.phone?.toLowerCase().includes(q)
//             )
//         )
//     }, [query, students])

//     return (
//         <div className="min-h-screen bg-school-secondary-950 p-4 sm:p-6 lg:p-8">
//             <div className="max-w-6xl mx-auto space-y-6">

//                 {/* ── Header ── */}
//                 <div className="flex items-center justify-between gap-4">
//                     <div>
//                         <h1 className="text-2xl font-black text-white tracking-tight">
//                             Students
//                         </h1>
//                         <p className="text-school-secondary-100/50 text-sm mt-1">
//                             {students.length} registered student{students.length !== 1 ? 's' : ''}
//                         </p>
//                     </div>
//                     <button
//                         onClick={() => router.push('/admin/invite-users')}
//                         className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold text-sm transition-all"
//                     >
//                         <UserPlus className="w-4 h-4" />
//                         Invite Student
//                     </button>
//                 </div>

//                 {/* ── Search ── */}
//                 <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-400 pointer-events-none" />
//                     <input
//                         type="text"
//                         value={query}
//                         onChange={e => setQuery(e.target.value)}
//                         placeholder="Search by name, email or phone..."
//                         className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-school-secondary-900 border border-school-secondary-700 text-white placeholder:text-school-secondary-400 focus:border-school-primary focus:outline-none text-sm"
//                     />
//                     {query && (
//                         <button
//                             onClick={() => setQuery('')}
//                             className="absolute right-3 top-1/2 -translate-y-1/2 text-school-secondary-400 hover:text-white"
//                         >
//                             <X className="h-4 w-4" />
//                         </button>
//                     )}
//                 </div>

//                 {/* ── Content ── */}
//                 {loading ? (
//                     <UserListSkeleton />
//                 ) : filtered.length === 0 ? (
//                     <EmptyState
//                         query={query}
//                         onInvite={() => router.push('/admin/invite-users')}
//                         role="student"
//                     />
//                 ) : (
//                     <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//                         {filtered.map(student => (
//                             <UserCard
//                                 key={student.id}
//                                 user={student}
//                                 onClick={() => router.push(`/admin/studentView/${student.id}`)}
//                             />
//                         ))}
//                     </div>
//                 )}

//             </div>
//         </div>
//     )
// }




// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentsBySchool} from '@/app/actions/user-management'
// import { checkSubscription } from "@/app/actions/subscription-guard";
// import { StudentsListClient } from "@/components/admin-dasboard/student/studentListClient";
// import { Role } from "@prisma/client";

// /**
//  * Rule 16: Dynamic Contextual SEO
//  */
// export async function generateMetadata(): Promise<Metadata> {
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return { title: "Students | SchoolPaaS" };

//     const profile = await prisma.profile.findUnique({
//         where: { id: user.id },
//         include: { school: { select: { name: true } } }
//     });

//     return {
//         title: `Student Registry | ${profile?.school?.name || "Institution"} | SchoolPaaS`,
//         description: "Institutional management of student identities and classroom placements."
//     };
// }

// /**
//  * Rule 12: Server-First Fetching
//  */
// export default async function StudentsPage() {
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) redirect("/login");

//     const profile = await prisma.profile.findUnique({
//         where: { id: user.id },
//         select: { id: true, schoolId: true, role: true }
//     });

//     // Rule 6 & 13: Institutional Gate
//     if (!profile?.schoolId || (profile.role !== Role.SCHOOL_ADMIN && profile.role !== Role.SUPER_ADMIN)) {
//         redirect("/teacher?error=access_denied");
//     }

//     // Rule 11: System Truth - Check subscription before allowing access to management
//     const subStatus = await checkSubscription(profile.id, profile.schoolId);
//     if (!subStatus.isActive) redirect("/billing");

//     // Fetch Tier-2 Institutional Data
//     const students = await getStudentsBySchool(profile.schoolId);

//     return (
//         <StudentsListClient initialStudents={students} />
//     );
// }



import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getStudentsBySchool} from '@/app/actions/user-management'
import { checkSubscription } from "@/app/actions/subscription-guard";
import { StudentsListClient } from "@/components/admin-dasboard/student/studentListClient";
import { Role } from "@prisma/client";

/**
 * STUDENT REGISTRY | SERVER PAGE
 * Rule 16: Dynamic Contextual SEO
 * Synchronizes institutional identity with search engine metadata.
 */
export async function generateMetadata(): Promise<Metadata> {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return { title: "Students | SchoolPaaS" };

    const profile = await prisma.profile.findUnique({
        where: { id: authUser.id },
        include: { school: { select: { name: true } } }
    });

    return {
        title: `Student Registry | ${profile?.school?.name || "Institution"} | SchoolPaaS`,
        description: "Institutional management of student identities, registry nodes, and classroom placements."
    };
}

/**
 * STUDENT REGISTRY (Tier 2)
 * Rule 12: Server-First Fetching. Handles security scoping and data hydration.
 * Rule 5/6: Multi-tenant isolation. Strictly gates access to Institutional Admins.
 * Rule 11: Subscription Guard ensures management features are active.
 */
export default async function StudentsPage() {
    // 1. Authentication Layer (Rule 10)
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) redirect("/login");

    // 2. Authorization & Scoping (Rule 5/6)
    const profile = await prisma.profile.findUnique({
        where: { id: authUser.id },
        select: { id: true, schoolId: true, role: true }
    });

    // Security Protocol: Only Institutional Admins (Tier 2) or Super Admins (Tier 1) may proceed.
    if (
        !profile?.schoolId || 
        (profile.role !== Role.SCHOOL_ADMIN && profile.role !== Role.SUPER_ADMIN)
    ) {
        redirect("/dashboard?error=unauthorized_registry_access");
    }

    // 3. Subscription Sentinel (Rule 11)
    // Management capabilities are locked behind an active institutional subscription.
    const subStatus = await checkSubscription(profile.id, profile.schoolId);
    if (!subStatus.isActive) {
        redirect("/billing?reason=subscription_required");
    }

    // 4. Data Hydration (Rule 12)
    // Fetching the authoritative student ledger for this specific institution.
    const students = await getStudentsBySchool(profile.schoolId);

    // 5. Client-Side Handoff (Rule 17: Branding handled via Client Component Store)
    return (
        <StudentsListClient initialStudents={students} />
    );
}