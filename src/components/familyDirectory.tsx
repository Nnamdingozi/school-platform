// 'use client';

// import { useState, useEffect, useTransition } from 'react';
// import { getLinkedFamilies, unlinkParentStudent } from '@/app/actions/parent-linking';
// import { User, GraduationCap, Trash2, Loader2, Search, Users } from 'lucide-react';
// import { toast } from 'sonner';

// export function FamilyDirectory({ schoolId }: { schoolId: string }) {
//   const [families, setFamilies] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isPending, startTransition] = useTransition();

//   const loadFamilies = async () => {
//     const data = await getLinkedFamilies(schoolId);
//     setFamilies(data);
//     setLoading(false);
//   };

//   useEffect(() => { loadFamilies(); }, [schoolId]);

//   const handleUnlink = (linkId: string) => {
//     if (!confirm("Are you sure you want to remove this connection?")) return;
//     startTransition(async () => {
//         const res = await unlinkParentStudent(linkId);
//         if (res.success) {
//             toast.success("Relationship removed");
//             loadFamilies();
//         }
//     });
//   };

//   const filteredFamilies = families.filter(f => 
//     f.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
//     f.email.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-school-primary" /></div>;

//   return (
//     <div className="space-y-6">
//       {/* Search Bar */}
//       <div className="relative max-w-md">
//         <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
//         <input 
//           placeholder="Search by parent name or email..."
//           className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:border-school-primary outline-none"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {filteredFamilies.map((parent) => (
//           <div key={parent.id} className="bg-slate-900 border border-white/5 rounded-3xl p-6 hover:border-school-primary/20 transition-all group">
//             <div className="flex items-start justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-xl bg-school-primary/10 flex items-center justify-center text-school-primary">
//                   <User className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-white text-sm uppercase tracking-tight">{parent.name || "Unnamed Parent"}</h3>
//                   <p className="text-[10px] text-slate-500 font-mono">{parent.email}</p>
//                 </div>
//               </div>
//               <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-2 py-1 rounded-md uppercase">
//                 {parent.ParentStudent_ParentStudent_parentIdToprofiles.length} Children
//               </span>
//             </div>

//             <div className="space-y-2">
//               {parent.ParentStudent_ParentStudent_parentIdToprofiles.map((link: any) => (
//                 <div key={link.id} className="flex items-center justify-between bg-slate-950/50 border border-white/5 rounded-2xl p-3 group/row">
//                   <div className="flex items-center gap-3">
//                     <GraduationCap className="h-4 w-4 text-slate-600" />
//                     <div>
//                       <p className="text-xs font-bold text-slate-300">{link.student.name || "Unnamed"}</p>
//                       <p className="text-[9px] text-slate-500">{link.student.email}</p>
//                     </div>
//                   </div>
//                   <button 
//                     onClick={() => handleUnlink(link.id)}
//                     className="p-2 text-slate-700 hover:text-red-400 opacity-0 group-hover/row:opacity-100 transition-all"
//                   >
//                     <Trash2 className="h-3.5 w-3.5" />
//                   </button>
//                 </div>
//               ))}
//               {parent.ParentStudent_ParentStudent_parentIdToprofiles.length === 0 && (
//                 <p className="text-[10px] text-slate-600 italic p-2 text-center border border-dashed border-white/5 rounded-xl">
//                   No children linked to this account.
//                 </p>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredFamilies.length === 0 && (
//         <div className="py-20 text-center bg-slate-900/50 rounded-[3rem] border border-dashed border-white/5">
//             <Users className="h-12 w-12 text-slate-800 mx-auto mb-4" />
//             <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No matching family records found.</p>
//         </div>
//       )}
//     </div>
//   );
// }


// 'use client';

// import React, { useState, useEffect, useTransition } from 'react';
// import { getLinkedFamiliesPaginated, unlinkParentStudent } from '@/app/actions/parent-linking';
// import { 
//   ChevronDown, ChevronRight, User, GraduationCap, 
//   Trash2, Loader2, Search, ChevronLeft
// } from 'lucide-react';
// // import { toast } from 'sonner';

// export function FamilyDirectoryTable({ schoolId }: { schoolId: string }) {
//   const [data, setData] = useState<{families: any[], totalPages: number, totalCount: number}>({ 
//     families: [], totalPages: 0, totalCount: 0 
//   });
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
//   const [isPending, startTransition] = useTransition();

//   const load = async () => {
//     setLoading(true);
//     const res = await getLinkedFamiliesPaginated(schoolId, page, search);
//     setData(res);
//     setLoading(false);
//   };

//   // Debounced search effect
//   useEffect(() => {
//     const timer = setTimeout(() => { setPage(1); load(); }, 400);
//     return () => clearTimeout(timer);
//   }, [search, load]);

//   // Load when page changes
//   useEffect(() => { load(); }, [page, load]);

//   const toggleRow = (id: string) => {
//     const next = new Set(expandedRows);
//     next.has(id) ? next.delete(id) : next.add(id);
//     setExpandedRows(next);
//   };

//   return (
//     <div className="space-y-4">
//       {/* Search & Stats Header */}
//       <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-3xl border border-white/5">
//         <div className="relative w-full md:w-96">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
//           <input 
//             placeholder="Search 1,000+ parents..."
//             className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:border-school-primary outline-none transition-all"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//         <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-950 px-4 py-2 rounded-full border border-white/5">
//             {data.totalCount} Registered Families
//         </div>
//       </div>

//       {/* Table Container */}
//       <div className="bg-slate-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-slate-950 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">
//               <th className="p-5 w-10"></th>
//               <th className="p-5">Guardian Info</th>
//               <th className="p-5 text-center">Child Count</th>
//               <th className="p-5 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-white/5">
//             {loading ? (
//               <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-school-primary" /></td></tr>
//             ) : data.families.map((parent) => (
//               <React.Fragment key={parent.id}>
//                 {/* Parent Row */}
//                 <tr 
//                   onClick={() => toggleRow(parent.id)}
//                   className="hover:bg-school-primary/5 cursor-pointer transition-colors group"
//                 >
//                   <td className="p-5">
//                     {expandedRows.has(parent.id) ? <ChevronDown className="h-4 w-4 text-school-primary" /> : <ChevronRight className="h-4 w-4 text-slate-600" />}
//                   </td>
//                   <td className="p-5">
//                     <div className="flex items-center gap-3">
//                       <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-school-primary/20 group-hover:text-school-primary transition-all">
//                         <User className="h-4 w-4" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-bold text-white uppercase tracking-tight">{parent.name || "Unknown"}</p>
//                         <p className="text-[10px] text-slate-500 font-mono">{parent.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-5 text-center">
//                     <span className="bg-slate-950 text-school-primary text-[10px] font-black px-3 py-1 rounded-full border border-school-primary/20">
//                       {parent.ParentStudent_ParentStudent_parentIdToprofiles.length}
//                     </span>
//                   </td>
//                   <td className="p-5 text-right">
//                     <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-all">
//                         View Profile
//                     </button>
//                   </td>
//                 </tr>

//                 {/* Expanded Children Rows */}
//                 {expandedRows.has(parent.id) && (
//                   <tr className="bg-slate-950/50">
//                     <td colSpan={4} className="p-4 px-12">
//                       <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
//                         {parent.ParentStudent_ParentStudent_parentIdToprofiles.map((link: any) => (
//                           <div key={link.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/5">
//                             <div className="flex items-center gap-3">
//                               <GraduationCap className="h-4 w-4 text-school-primary/60" />
//                               <div>
//                                 <p className="text-xs font-bold text-slate-200">{link.student.name}</p>
//                                 <p className="text-[10px] text-slate-500">{link.student.email}</p>
//                               </div>
//                             </div>
//                             <button 
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 if(confirm("Remove this link?")) {
//                                     startTransition(async () => {
//                                         await unlinkParentStudent(link.id);
//                                         load();
//                                     });
//                                 }
//                               }}
//                               className="p-2 text-slate-600 hover:text-red-400 transition-colors"
//                             >
//                               <Trash2 className="h-3.5 w-3.5" />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 rounded-2xl border border-white/5">
//         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
//             Page {page} of {data.totalPages}
//         </p>
//         <div className="flex gap-2">
//           <button 
//             disabled={page === 1}
//             onClick={() => setPage(p => p - 1)}
//             className="p-2 rounded-lg bg-slate-800 text-slate-400 disabled:opacity-20 hover:text-white transition-all"
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </button>
//           <button 
//             disabled={page === data.totalPages}
//             onClick={() => setPage(p => p + 1)}
//             className="p-2 rounded-lg bg-slate-800 text-slate-400 disabled:opacity-20 hover:text-white transition-all"
//           >
//             <ChevronRight className="h-4 w-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { getLinkedFamiliesPaginated, unlinkParentStudent } from '@/app/actions/parent-linking';
import { 
  ChevronDown, ChevronRight, User, GraduationCap, 
  Trash2, Loader2, Search, ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';
import {getErrorMessage} from "@/lib/error-handler"


// ── Interfaces ──────────────────────────────────────────────────────────────
interface StudentLink {
    id: string;
    student: {
        name: string | null;
        email: string;
    };
}

interface FamilyRow {
    id: string;
    name: string | null;
    email: string;
    ParentStudent_ParentStudent_parentIdToprofiles: StudentLink[];
}

interface FamilyDirectoryData {
    families: FamilyRow[];
    totalPages: number;
    totalCount: number;
}

export function FamilyDirectoryTable({ schoolId }: { schoolId: string }) {
  const [data, setData] = useState<FamilyDirectoryData>({ 
    families: [], totalPages: 0, totalCount: 0 
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  // ✅ FIX: Wrapped in useCallback to prevent re-render loops
  const load = useCallback(async () => {
    setLoading(true);
    try {
        const res = await getLinkedFamiliesPaginated(schoolId, page, search);
        setData(res as FamilyDirectoryData);
    } catch (err) {
        console.error("Failed to load families");
        getErrorMessage(err)

    } finally {
        setLoading(false);
    }
  }, [schoolId, page, search]);

  // ✅ FIX: Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => { 
        setPage(1); 
        load(); 
    }, 400);
    return () => clearTimeout(timer);
  }, [search, load]);

  // Load when page changes
  useEffect(() => { 
    load(); 
  }, [page, load]);

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows);
    if (next.has(id)) {
        next.delete(id);
    } else {
        next.add(id);
    }
    setExpandedRows(next);
  };

  const handleUnlink = (linkId: string) => {
    if (!confirm("Are you sure you want to remove this connection?")) return;
    
    startTransition(async () => {
        const res = await unlinkParentStudent(linkId);
        if (res.success) {
            toast.success("Relationship removed");
            load();
        } else {
            toast.error("Failed to remove relationship");
        }
    });
  };

  return (
    <div className="space-y-4">
      {/* Search & Stats Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-3xl border border-white/5">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input 
            placeholder="Search 1,000+ parents..."
            className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:border-school-primary outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-950 px-4 py-2 rounded-full border border-white/5">
            {data.totalCount} Registered Families
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative">
        {/* Global Loading Overlay for transitions */}
        {isPending && (
            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] z-50 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-school-primary" />
            </div>
        )}

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">
              <th className="p-5 w-10"></th>
              <th className="p-5">Guardian Info</th>
              <th className="p-5 text-center">Child Count</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-school-primary" /></td></tr>
            ) : data.families.length === 0 ? (
              <tr><td colSpan={4} className="p-20 text-center text-slate-500 text-xs italic">No records found.</td></tr>
            ) : data.families.map((parent) => (
              <React.Fragment key={parent.id}>
                <tr 
                  onClick={() => toggleRow(parent.id)}
                  className="hover:bg-school-primary/5 cursor-pointer transition-colors group"
                >
                  <td className="p-5">
                    {expandedRows.has(parent.id) ? <ChevronDown className="h-4 w-4 text-school-primary" /> : <ChevronRight className="h-4 w-4 text-slate-600" />}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-school-primary/20 group-hover:text-school-primary transition-all">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-tight">{parent.name || "Unknown"}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{parent.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <span className="bg-slate-950 text-school-primary text-[10px] font-black px-3 py-1 rounded-full border border-school-primary/20">
                      {parent.ParentStudent_ParentStudent_parentIdToprofiles.length}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-all">
                        View Profile
                    </button>
                  </td>
                </tr>

                {expandedRows.has(parent.id) && (
                  <tr className="bg-slate-950/50">
                    <td colSpan={4} className="p-4 px-12">
                      <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                        {parent.ParentStudent_ParentStudent_parentIdToprofiles.map((link) => (
                          <div key={link.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/5">
                            <div className="flex items-center gap-3">
                              <GraduationCap className="h-4 w-4 text-school-primary/60" />
                              <div>
                                <p className="text-xs font-bold text-slate-200">{link.student.name || "Unknown"}</p>
                                <p className="text-[10px] text-slate-500 font-mono">{link.student.email}</p>
                              </div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnlink(link.id);
                              }}
                              disabled={isPending}
                              className="p-2 text-slate-700 hover:text-red-400 transition-colors disabled:opacity-30"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 rounded-2xl border border-white/5">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Page {page} of {data.totalPages || 1}
        </p>
        <div className="flex gap-2">
          <button 
            disabled={page === 1 || loading}
            onClick={() => setPage(p => p - 1)}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 disabled:opacity-20 hover:text-white transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            disabled={page >= data.totalPages || loading}
            onClick={() => setPage(p => p + 1)}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 disabled:opacity-20 hover:text-white transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}