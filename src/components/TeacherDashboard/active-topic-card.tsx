// "use client";

// import { useState, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { Settings2, Check, Loader2, ChevronRight } from "lucide-react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

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

//   // These values come from the URL props
//   const currentTermId = selectedTermId;
//   const currentWeek = selectedWeek;

//   const updateUrl = (updates: Record<string, string | undefined>) => {
//     const params = new URLSearchParams(window.location.search);
//     Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    
//     startTransition(() => {
//       // Use replace to avoid clumping browser history
//       router.replace(`?${params.toString()}`, { scroll: false });
//     });
//   };

//   const availableWeeks = Array.from(new Set(
//     topics.filter((t: any) => t.termId === currentTermId).map((t: any) => t.weekNumber)
//   )).sort((a: any, b: any) => (a ?? 0) - (b ?? 0));

//   const availableTopics = topics.filter((t: any) => 
//     t.termId === currentTermId && String(t.weekNumber) === currentWeek
//   );

//   return (
//     <Card className="relative border-none shadow-xl bg-linear-to-br from-amber-500 to-amber-600 text-white overflow-hidden transition-all">
//       {/* Loading Blur Overlay */}
//       {isPending && (
//         <div className="absolute inset-0 z-50 flex items-center justify-center bg-amber-600/10 backdrop-blur-[1px]">
//           <Loader2 className="h-6 w-6 animate-spin text-white/50" />
//         </div>
//       )}

//       <CardHeader className="pb-2">
//         <div className="flex items-center justify-between">
//           <div className="space-y-1">
//             <p className="text-[10px] font-bold uppercase tracking-widest text-amber-100">Current Focus</p>
//             <h2 className="text-2xl font-black md:text-3xl tracking-tight">
//               {activeTopic?.title || "Choose a Topic"}
//             </h2>
//           </div>
          
//           {/* DONE BUTTON: The only way to exit editing mode */}
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             onClick={() => setIsEditing(!isEditing)} 
//             className={cn(
//                 "transition-all border-none", 
//                 isEditing ? "bg-white text-amber-600 hover:bg-white/90 font-bold" : "bg-white/10 text-white"
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

//       <CardContent>
//         {isEditing ? (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-black/10 rounded-xl border border-white/10">
//             {/* 1. TERM */}
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold uppercase text-amber-100">1. Term</label>
//               <Select 
//                 value={currentTermId} 
//                 onValueChange={(v) => updateUrl({ termId: v, week: undefined, topicId: undefined })}
//               >
//                 <SelectTrigger className="bg-white/10 border-white/10 text-white font-medium">
//                   <SelectValue placeholder="Select Term" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {terms.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.displayName}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* 2. WEEK */}
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold uppercase text-amber-100">2. Week</label>
//               <Select 
//                 value={currentWeek} 
//                 disabled={!currentTermId} 
//                 onValueChange={(v) => updateUrl({ week: v, topicId: undefined })}
//               >
//                 <SelectTrigger className="bg-white/10 border-white/10 text-white font-medium">
//                   <SelectValue placeholder="Select Week" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {availableWeeks.map((w: any) => <SelectItem key={w} value={String(w)}>Week {w}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* 3. TOPIC */}
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold uppercase text-amber-100">3. Topic</label>
//               <Select 
//                 value={activeTopic?.id} 
//                 disabled={!currentWeek} 
//                 // REMOVED setIsEditing(false) from here so it stays open
//                 onValueChange={(v) => updateUrl({ topicId: v })}
//               >
//                 <SelectTrigger className="bg-white/20 border-white/20 font-bold text-white">
//                   <SelectValue placeholder="Select Topic" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {availableTopics.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         ) : (
//           /* DISPLAY MODE */
//           <div className="flex flex-col gap-4">
//             <div className="flex items-center gap-3 mt-2">
//               <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-tighter">
//                 {activeTopic?.term?.displayName}
//               </span>
//               <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-tighter">
//                 Week {activeTopic?.weekNumber}
//               </span>
//             </div>
//             <p className="text-amber-50/80 text-sm italic max-w-2xl border-l-2 border-white/20 pl-4">
//               {activeTopic?.description || "Focus active for this session."}
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
import { Settings2, Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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

  const currentTermId = selectedTermId;
  const currentWeek = selectedWeek;

  const updateUrl = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    
    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  };

  const availableWeeks = Array.from(new Set(
    topics.filter((t: any) => t.termId === currentTermId).map((t: any) => t.weekNumber)
  )).sort((a: any, b: any) => (a ?? 0) - (b ?? 0));

  const availableTopics = topics.filter((t: any) => 
    t.termId === currentTermId && String(t.weekNumber) === currentWeek
  );

  // Common styles for the dropdown items to override the default green/accent
  const itemStyles = "focus:bg-white focus:text-amber-600 cursor-pointer transition-colors";
  const contentStyles = "bg-amber-700 border-amber-500 text-white";

  return (
    <Card className="relative border-none shadow-xl bg-linear-to-br from-amber-500 to-amber-600 text-white overflow-hidden transition-all">
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
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)} 
            className={cn(
                "transition-all border-none", 
                isEditing ? "bg-white text-amber-600 hover:bg-white/90 font-bold" : "bg-white/10 text-white hover:bg-white"
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
                <SelectContent className={contentStyles}>
                  {terms.map((t: any) => (
                    <SelectItem key={t.id} value={t.id} className={itemStyles}>
                      {t.displayName}
                    </SelectItem>
                  ))}
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
                <SelectContent className={contentStyles}>
                  {availableWeeks.map((w: any) => (
                    <SelectItem key={w} value={String(w)} className={itemStyles}>
                      Week {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 3. TOPIC */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-amber-100">3. Topic</label>
              <Select 
                value={activeTopic?.id} 
                disabled={!currentWeek} 
                onValueChange={(v) => updateUrl({ topicId: v })}
              >
                <SelectTrigger className="bg-white/20 border-white/20 font-bold text-white">
                  <SelectValue placeholder="Select Topic" />
                </SelectTrigger>
                <SelectContent className={contentStyles}>
                  {availableTopics.map((t: any) => (
                    <SelectItem key={t.id} value={t.id} className={itemStyles}>
                      {t.title}
                    </SelectItem>
                  ))}
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