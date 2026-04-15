'use client';

import { useEffect, useState } from "react";
import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid";
import { useProfileStore } from "@/store/profileStore";
import { getStudentDashboardData } from "@/app/actions/student-dashboard";
import { Loader2 } from "lucide-react";


export default function SubjectsPage() {
  const { profile, isLoading } = useProfileStore();

  const [data, setData] = useState<any>(null);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;

    async function load() {
      try {
        const res = await getStudentDashboardData(profile!.id);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSubjects(false);
      }
    }

    load();
  }, [profile?.id]);

  // 🔄 Profile loading
  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  // 🔄 Subjects loading
  if (loadingSubjects || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-950 min-h-screen text-white">
      
      <div className="max-w-7xl mx-auto">
        <SubjectsGrid
          subjects={data.subjects}
          classTeacherName={data.classroom?.teacher?.name || "N/A"}
          gradeLevel={data.classroom?.grade?.level || 10}
        />
      </div>
    </div>
  );
}