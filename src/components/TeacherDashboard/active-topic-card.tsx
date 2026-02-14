

// "use client";

// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Settings2, X, ChevronRight } from "lucide-react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// export function ActiveTopicCard({ activeSubject, activeTopic, selectedTermId, selectedWeek }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isEditing, setIsEditing] = useState(false);

//   const topics = activeSubject.topics ?? [];
//   const terms = Array.from(new Map(topics.map(t => [t.term.id, t.term])).values());
  
//   const availableWeeks = Array.from(new Set(
//     topics.filter(t => t.termId === selectedTermId).map(t => t.weekNumber)
//   )).sort((a, b) => (a ?? 0) - (b ?? 0));

//   const availableTopics = topics.filter(t => 
//     t.termId === selectedTermId && String(t.weekNumber) === selectedWeek
//   );

//   const updateUrl = (updates: Record<string, string | undefined>) => {
//     const params = new URLSearchParams(searchParams.toString());
//     Object.entries(updates).forEach(([key, value]) => {
//       if (value) params.set(key, value);
//       else params.delete(key);
//     });
//     router.replace(`?${params.toString()}`, { scroll: false });
//   };

//   return (
//     <Card className="border-none shadow-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white overflow-hidden">
//       <CardHeader className="pb-2">
//         <div className="flex items-center justify-between">
//           <div className="space-y-1">
//             <p className="text-[10px] font-bold uppercase tracking-widest text-amber-100">Current Focus</p>
//             <h2 className="text-2xl font-black md:text-3xl leading-tight">
//               {activeTopic?.title || "Choose a Topic"}
//             </h2>
//           </div>
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             onClick={() => setIsEditing(!isEditing)}
//             className="bg-white/10 hover:bg-white/20 text-white border-none"
//           >
//             {isEditing ? <X className="h-4 w-4" /> : <Settings2 className="h-4 w-4 mr-2" />}
//             {!isEditing && "Change"}
//           </Button>
//         </div>
//       </CardHeader>

//       <CardContent>
//         {isEditing ? (
//           <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-black/10 rounded-lg border border-white/10 animate-in fade-in zoom-in-95 duration-200">
//             <div className="space-y-1">
//               <label className="text-[10px] font-bold uppercase text-amber-100">Step 1: Term</label>
//               <Select value={selectedTermId} onValueChange={(v) => updateUrl({ termId: v, week: undefined, topicId: undefined })}>
//                 <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue placeholder="Term" /></SelectTrigger>
//                 <SelectContent>{terms.map(t => <SelectItem key={t.id} value={t.id}>{t.displayName}</SelectItem>)}</SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-1">
//               <label className="text-[10px] font-bold uppercase text-amber-100">Step 2: Week</label>
//               <Select value={selectedWeek} disabled={!selectedTermId} onValueChange={(v) => updateUrl({ week: v, topicId: undefined })}>
//                 <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue placeholder="Week" /></SelectTrigger>
//                 <SelectContent>{availableWeeks.map(w => <SelectItem key={w} value={String(w)}>Week {w}</SelectItem>)}</SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-1">
//               <label className="text-[10px] font-bold uppercase text-amber-100">Step 3: Topic</label>
//               <Select value={activeTopic?.id} disabled={!selectedWeek} onValueChange={(v) => { updateUrl({ topicId: v }); setIsEditing(false); }}>
//                 <SelectTrigger className="bg-white/20 border-white/40 font-bold text-white"><SelectValue placeholder="Topic" /></SelectTrigger>
//                 <SelectContent>{availableTopics.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}</SelectContent>
//               </Select>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col gap-4">
//             <div className="flex items-center gap-2 mt-2">
//               <div className="px-3 py-1 rounded bg-white/20 text-[10px] font-bold uppercase tracking-tighter">
//                 {activeTopic?.term.displayName}
//               </div>
//               <ChevronRight className="h-3 w-3 opacity-50" />
//               <div className="px-3 py-1 rounded bg-white/20 text-[10px] font-bold uppercase tracking-tighter">
//                 Week {activeTopic?.weekNumber}
//               </div>
//             </div>
//             <p className="text-amber-50/80 text-sm line-clamp-2 italic max-w-2xl">
//               {activeTopic?.description || "Curriculum topic currently active for this class period."}
//             </p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }


// "use client";

// import { useState, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { Settings2, Check, Loader2 } from "lucide-react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

// export function ActiveTopicCard({ activeSubject, activeTopic, urlTermId, urlWeek }) {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();
//   const [isEditing, setIsEditing] = useState(false);

//   const topics = activeSubject.topics ?? [];
//   const terms = Array.from(new Map(topics.map(t => [t.term.id, t.term])).values());

//   // Values currently reflected in the URL or the active record
//   const currentTermId = urlTermId || activeTopic?.termId;
//   const currentWeek = urlWeek || String(activeTopic?.weekNumber);

//   const updateUrl = (updates: Record<string, string | undefined>) => {
//     const params = new URLSearchParams(window.location.search);
//     Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    
//     // startTransition triggers the "isPending" state
//     startTransition(() => {
//       router.push(`?${params.toString()}`, { scroll: false });
//     });
//   };

//   const availableWeeks = Array.from(new Set(
//     topics.filter(t => t.termId === currentTermId).map(t => t.weekNumber)
//   )).sort((a, b) => (a ?? 0) - (b ?? 0));

//   const availableTopics = topics.filter(t => 
//     t.termId === currentTermId && String(t.weekNumber) === currentWeek
//   );

//   return (
//     <Card className="relative border-none shadow-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white overflow-hidden transition-all duration-300">
      
//       {/* LOADING OVERLAY */}
//       {isPending && (
//         <div className="absolute inset-0 z-50 flex items-center justify-center bg-amber-600/20 backdrop-blur-[2px] transition-all">
//           <div className="flex flex-col items-center gap-2 bg-black/20 p-4 rounded-2xl border border-white/10 shadow-2xl">
//             <Loader2 className="h-8 w-8 animate-spin text-white" />
//             <span className="text-[10px] font-bold uppercase tracking-widest text-white">Updating Curriculum...</span>
//           </div>
//         </div>
//       )}

//       <CardHeader className="pb-2">
//         <div className="flex items-center justify-between">
//           <div className={cn("space-y-1 transition-all", isPending && "blur-[1px] opacity-50")}>
//             <p className="text-[10px] font-bold uppercase tracking-widest text-amber-100/80">
//               Current Focus
//             </p>
//             <h2 className="text-2xl font-black md:text-3xl tracking-tight">
//               {activeTopic?.title || "Choose a Topic"}
//             </h2>
//           </div>
          
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             onClick={() => setIsEditing(!isEditing)} 
//             className={cn(
//               "border-none transition-all",
//               isEditing 
//                 ? "bg-white text-amber-600 hover:bg-amber-50 font-bold" 
//                 : "bg-white/10 hover:bg-white/20 text-white"
//             )}
//           >
//             {isEditing ? (
//               <><Check className="h-4 w-4 mr-2" /> Done</>
//             ) : (
//               <><Settings2 className="h-4 w-4 mr-2" /> Change Focus</>
//             )}
//           </Button>
//         </div>
//       </CardHeader>

//       <CardContent className={cn("transition-all duration-300", isPending && "blur-[2px] opacity-50")}>
//         {isEditing ? (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-black/10 rounded-xl border border-white/10 shadow-inner">
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold uppercase text-amber-100 ml-1">1. Select Term</label>
//               <Select value={currentTermId} onValueChange={(v) => updateUrl({ termId: v, week: undefined, topicId: undefined })}>
//                 <SelectTrigger className="bg-white/10 border-white/10 text-white"><SelectValue placeholder="Term" /></SelectTrigger>
//                 <SelectContent>{terms.map(t => <SelectItem key={t.id} value={t.id}>{t.displayName}</SelectItem>)}</SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold uppercase text-amber-100 ml-1">2. Select Week</label>
//               <Select value={currentWeek} disabled={!currentTermId} onValueChange={(v) => updateUrl({ week: v, topicId: undefined })}>
//                 <SelectTrigger className="bg-white/10 border-white/10 text-white"><SelectValue placeholder="Week" /></SelectTrigger>
//                 <SelectContent>{availableWeeks.map(w => <SelectItem key={w} value={String(w)}>Week {w}</SelectItem>)}</SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold uppercase text-amber-100 ml-1">3. Select Topic</label>
//               <Select value={activeTopic?.id} disabled={!currentWeek} onValueChange={(v) => { updateUrl({ topicId: v }); setIsEditing(false); }}>
//                 <SelectTrigger className="bg-white/20 border-white/30 font-bold text-white"><SelectValue placeholder="Topic" /></SelectTrigger>
//                 <SelectContent>{availableTopics.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}</SelectContent>
//               </Select>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col gap-4">
//             <div className="flex items-center gap-3 mt-2">
//               <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-tighter">
//                 {activeTopic?.term.displayName}
//               </span>
//               <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-tighter">
//                 Week {activeTopic?.weekNumber}
//               </span>
//             </div>
//             <p className="text-amber-50/80 text-sm italic max-w-2xl border-l-2 border-white/20 pl-4 py-1">
//               {activeTopic?.description || "No description available for this curriculum focus."}
//             </p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }


// "use client";

// import { useState, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { Settings2, Check, Loader2, ChevronRight } from "lucide-react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

// // Prop names now match exactly what Page.tsx is passing
// interface ActiveTopicCardProps {
//   activeSubject: any;
//   activeTopic: any;
//   selectedTermId?: string;
//   selectedWeek?: string;
// }

// export function ActiveTopicCard({ 
//   activeSubject, 
//   activeTopic, 
//   selectedTermId, 
//   selectedWeek 
// }: ActiveTopicCardProps) {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();
//   const [isEditing, setIsEditing] = useState(false);

//   const topics = activeSubject?.topics ?? [];
//   const terms = Array.from(new Map(topics.map((t: any) => [t.term.id, t.term])).values());

//   // Use the props passed from the URL/Server
//   const currentTermId = selectedTermId || activeTopic?.termId;
//   const currentWeek = selectedWeek || String(activeTopic?.weekNumber);

//   const updateUrl = (updates: Record<string, string | undefined>) => {
//     const params = new URLSearchParams(window.location.search);
//     Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    
//     startTransition(() => {
//       router.push(`?${params.toString()}`, { scroll: false });
//     });
//   };

//   const availableWeeks = Array.from(new Set(
//     topics.filter((t: any) => t.termId === currentTermId).map((t: any) => t.weekNumber)
//   )).sort((a: any, b: any) => (a ?? 0) - (b ?? 0));

//   const availableTopics = topics.filter((t: any) => 
//     t.termId === currentTermId && String(t.weekNumber) === currentWeek
//   );

//   return (
//     <Card className="relative border-none shadow-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white overflow-hidden transition-all duration-300">
//       {isPending && (
//         <div className="absolute inset-0 z-50 flex items-center justify-center bg-amber-600/20 backdrop-blur-[2px]">
//           <Loader2 className="h-8 w-8 animate-spin text-white" />
//         </div>
//       )}

//       <CardHeader className="pb-2">
//         <div className="flex items-center justify-between">
//           <div className={cn("space-y-1", isPending && "blur-[1px] opacity-50")}>
//             <p className="text-[10px] font-bold uppercase tracking-widest text-amber-100/80">Current Focus</p>
//             <h2 className="text-2xl font-black md:text-3xl tracking-tight">
//               {activeTopic?.title || "Choose a Topic"}
//             </h2>
//           </div>
          
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             onClick={() => setIsEditing(!isEditing)} 
//             className={cn("border-none", isEditing ? "bg-white text-amber-600" : "bg-white/10 text-white")}
//           >
//             {isEditing ? <><Check className="h-4 w-4 mr-2" /> Done</> : <><Settings2 className="h-4 w-4 mr-2" /> Change</>}
//           </Button>
//         </div>
//       </CardHeader>

//       <CardContent className={cn(isPending && "blur-[2px] opacity-50")}>
//         {isEditing ? (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-black/10 rounded-xl border border-white/10">
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold uppercase text-amber-100">Term</label>
//               <Select value={currentTermId} onValueChange={(v) => updateUrl({ termId: v, week: undefined, topicId: undefined })}>
//                 <SelectTrigger className="bg-white/10 text-white"><SelectValue /></SelectTrigger>
//                 <SelectContent>{terms.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.displayName}</SelectItem>)}</SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold uppercase text-amber-100">Week</label>
//               <Select value={currentWeek} disabled={!currentTermId} onValueChange={(v) => updateUrl({ week: v, topicId: undefined })}>
//                 <SelectTrigger className="bg-white/10 text-white"><SelectValue /></SelectTrigger>
//                 <SelectContent>{availableWeeks.map((w: any) => <SelectItem key={w} value={String(w)}>Week {w}</SelectItem>)}</SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold uppercase text-amber-100">Topic</label>
//               <Select value={activeTopic?.id} disabled={!currentWeek} onValueChange={(v) => { updateUrl({ topicId: v }); setIsEditing(false); }}>
//                 <SelectTrigger className="bg-white/20 font-bold text-white"><SelectValue /></SelectTrigger>
//                 <SelectContent>{availableTopics.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}</SelectContent>
//               </Select>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col gap-4">
//             <div className="flex items-center gap-3 mt-2">
//               <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-tighter">{activeTopic?.term?.displayName}</span>
//               <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-tighter">Week {activeTopic?.weekNumber}</span>
//             </div>
//             <p className="text-amber-50/80 text-sm italic max-w-2xl border-l-2 border-white/20 pl-4">
//               {activeTopic?.description || "Curriculum focus active."}
//             </p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Settings2, Check, Loader2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ActiveTopicCardProps {
  activeSubject: any;
  activeTopic: any;
  selectedTermId?: string;
  selectedWeek?: string;
}


export function ActiveTopicCard({ 
  activeSubject, 
  activeTopic, 
  selectedTermId, 
  selectedWeek 
}: ActiveTopicCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  const topics = activeSubject?.topics ?? [];
  const terms = Array.from(new Map(topics.map((t: any) => [t.term.id, t.term])).values());

  // These values come from the URL props
  const currentTermId = selectedTermId;
  const currentWeek = selectedWeek;

  const updateUrl = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    
    startTransition(() => {
      // Use replace to avoid clumping browser history
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  };

  const availableWeeks = Array.from(new Set(
    topics.filter((t: any) => t.termId === currentTermId).map((t: any) => t.weekNumber)
  )).sort((a: any, b: any) => (a ?? 0) - (b ?? 0));

  const availableTopics = topics.filter((t: any) => 
    t.termId === currentTermId && String(t.weekNumber) === currentWeek
  );

  return (
    <Card className="relative border-none shadow-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white overflow-hidden transition-all">
      {/* Loading Blur Overlay */}
      {isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-amber-600/10 backdrop-blur-[1px]">
          <Loader2 className="h-6 w-6 animate-spin text-white/50" />
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-100">Current Focus</p>
            <h2 className="text-2xl font-black md:text-3xl tracking-tight">
              {activeTopic?.title || "Choose a Topic"}
            </h2>
          </div>
          
          {/* DONE BUTTON: The only way to exit editing mode */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)} 
            className={cn(
                "transition-all border-none", 
                isEditing ? "bg-white text-amber-600 hover:bg-white/90 font-bold" : "bg-white/10 text-white"
            )}
          >
            {isEditing ? (
              <><Check className="h-4 w-4 mr-2" /> Done</>
            ) : (
              <><Settings2 className="h-4 w-4 mr-2" /> Change Focus</>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-black/10 rounded-xl border border-white/10">
            {/* 1. TERM */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-amber-100">1. Term</label>
              <Select 
                value={currentTermId} 
                onValueChange={(v) => updateUrl({ termId: v, week: undefined, topicId: undefined })}
              >
                <SelectTrigger className="bg-white/10 border-white/10 text-white font-medium">
                  <SelectValue placeholder="Select Term" />
                </SelectTrigger>
                <SelectContent>
                  {terms.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.displayName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* 2. WEEK */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-amber-100">2. Week</label>
              <Select 
                value={currentWeek} 
                disabled={!currentTermId} 
                onValueChange={(v) => updateUrl({ week: v, topicId: undefined })}
              >
                <SelectTrigger className="bg-white/10 border-white/10 text-white font-medium">
                  <SelectValue placeholder="Select Week" />
                </SelectTrigger>
                <SelectContent>
                  {availableWeeks.map((w: any) => <SelectItem key={w} value={String(w)}>Week {w}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* 3. TOPIC */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-amber-100">3. Topic</label>
              <Select 
                value={activeTopic?.id} 
                disabled={!currentWeek} 
                // REMOVED setIsEditing(false) from here so it stays open
                onValueChange={(v) => updateUrl({ topicId: v })}
              >
                <SelectTrigger className="bg-white/20 border-white/20 font-bold text-white">
                  <SelectValue placeholder="Select Topic" />
                </SelectTrigger>
                <SelectContent>
                  {availableTopics.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          /* DISPLAY MODE */
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-tighter">
                {activeTopic?.term?.displayName}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-tighter">
                Week {activeTopic?.weekNumber}
              </span>
            </div>
            <p className="text-amber-50/80 text-sm italic max-w-2xl border-l-2 border-white/20 pl-4">
              {activeTopic?.description || "Focus active for this session."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}