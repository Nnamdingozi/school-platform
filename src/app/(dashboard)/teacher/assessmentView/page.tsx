"use client";

import { useEffect, useState, useCallback } from "react";
import { useProfileStore } from "@/store/profileStore";
import { getTeacherAssessmentData } from "@/app/actions/assesssment";
import { AssessmentDashboard } from "@/components/TeacherDashboard/assessment";
import { isTeacherProfile } from "@/types/profile";
import { Loader2, ShieldAlert, ClipboardCheck } from "lucide-react";

export default function TeacherAssessmentsPage() {
  const { profile, isLoading: isProfileLoading } = useProfileStore();
  
  const [data, setData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!profile?.id || !profile?.schoolId) return;

    setIsFetching(true);
    try {
      const result = await getTeacherAssessmentData(profile.id, profile.schoolId);
      if (result) {
        setData(result);
        console.log("fetched teacher data: ", result )
      } else {
        setError("Unable to retrieve assessment registry.");
      }
    } catch (err) {
      setError("Data synchronization failed.");
    } finally {
      setIsFetching(false);
    }
  }, [profile]);



  useEffect(() => {
    if (profile && isTeacherProfile(profile)) {
      loadData();
      document.title = "Assessment Registry | Teacher Portal";
    }
  }, [profile, loadData]);

  // 1. Initial Loading State (Store Hydration)
  if (isProfileLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
      </div>
    );
  }

  // 2. Role Security Guard
  if (profile && !isTeacherProfile(profile)) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
        <ShieldAlert className="h-16 w-16 text-red-500/20 mb-6" />
        <h2 className="text-2xl font-black text-white uppercase italic">Unauthorized Access</h2>
        <p className="text-slate-500 max-w-xs mt-2 text-sm">
          Assessment records are restricted to academic staff and lead teachers.
        </p>
      </div>
    );
  }

  // 3. Data Fetching State
  if (isFetching && !data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-school-primary/20" />
          <ClipboardCheck className="h-6 w-6 text-school-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">
          Syncing Grading Registry...
        </p>
      </div>
    );
  }

  // 4. Empty/Error State
  if (error || !data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-center">
        <div className="h-20 w-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
           <ClipboardCheck className="h-8 w-8 text-slate-700" />
        </div>
        <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Registry Offline</h2>
        <p className="text-slate-500 text-xs mt-2 max-w-xs">
          {error || "Your profile is not currently linked to any active subject or classroom assignments."}
        </p>
      </div>
    );
  }

  // 5. Main Dashboard View
  return (
    <main className="min-h-screen bg-slate-950">
      <AssessmentDashboard data={data} />
    </main>
  );
}