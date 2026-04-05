

// 'use client';

// import { useCallback, useRef, useState} from 'react';
// import Papa, { ParseResult } from 'papaparse';
// // import { toast } from 'sonner';
// import {
//   Download, Loader2, Upload, X,
//   Plus, User, GraduationCap, Trash2, Info
// } from 'lucide-react';
// import { useProfileStore } from '@/store/profileStore';
// import {
//   bulkLinkParentsAndChildren,
//   searchUsersByRole,
//   type ParentChildLinkInput,
//   type ParentChildLinkResult,
// } from '@/app/actions/parent-linking';
// import { UserSearchInput } from '@/components/admin-dasboard/user-searchInput';


// // --- Types ---
// type RowStatus = 'idle' | 'linking' | 'linked' | 'error';
// interface ChildEntry { id: string; email: string; status: RowStatus; message?: string; }
// interface ParentGroup { id: string; parentEmail: string; children: ChildEntry[]; }

// const makeChild = (email = ''): ChildEntry => ({ id: crypto.randomUUID(), email, status: 'idle' });
// const makeGroup = (parentEmail = '', childEmails: string[] = ['']): ParentGroup => ({
//   id: crypto.randomUUID(),
//   parentEmail,
//   children: childEmails.map(email => makeChild(email)),
// });

// export function ParentChildLinker() {
//   const [groups, setGroups] = useState<ParentGroup[]>([makeGroup()]);
//   const [dragOver, setDragOver] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const { profile } = useProfileStore();
//   const schoolId = profile?.schoolId ?? '';

//   const downloadTemplate = () => {
//     const csvContent = "parent_email,child_email\nguardian@example.com,student1@example.com";
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url; a.download = 'template.csv'; a.click();
//   };

//   const parseCsv = useCallback((file: File) => {
//     Papa.parse<any>(file, {
//       header: true, skipEmptyLines: true,
//       complete: (result: ParseResult<any>) => {
//         const aggregation = new Map<string, string[]>();
//         result.data.forEach(row => {
//           const p = (row.parent_email || row.parentEmail || '').trim().toLowerCase();
//           const c = (row.child_email || row.childEmail || '').trim().toLowerCase();
//           if (p) {
//             const existing = aggregation.get(p) || [];
//             if (c) existing.push(c);
//             aggregation.set(p, existing);
//           }
//         });
//         const newGroups = Array.from(aggregation.entries()).map(([pEmail, cEmails]) => makeGroup(pEmail, cEmails));
//         if (newGroups.length > 0) setGroups(newGroups);
//       },
//     });
//   }, []);

//   const handleLinkAll = async () => {
//     if (!schoolId) return;
//     setSubmitting(true);
//     const payload: ParentChildLinkInput[] = [];
//     groups.forEach(g => g.children.forEach(c => payload.push({ parentEmail: g.parentEmail, childEmail: c.email })));
    
//     setGroups(groups.map(g => ({ ...g, children: g.children.map(c => ({ ...c, status: 'linking' })) })));
//     const results = await bulkLinkParentsAndChildren(payload, schoolId);

//     let idx = 0;
//     setGroups(groups.map(g => ({
//       ...g, children: g.children.map(c => {
//         const res = results[idx++];
//         return { ...c, status: res.success ? 'linked' : 'error', message: res.message };
//       })
//     })));
//     setSubmitting(false);
//   };

//   return (
//     <section className="space-y-6">
//       {/* Instruction Guide */}
//       <div className="bg-school-primary/5 border border-school-primary/20 rounded-[2rem] p-6 flex items-start gap-4">
//         <Info className="h-5 w-5 text-school-primary shrink-0 mt-1" />
//         <p className="text-[11px] text-slate-400 leading-relaxed">
//           <strong>Pro Tip:</strong> Use the search fields to find users by name. The CSV grouping logic supports multiple students per parent automatically.
//         </p>
//       </div>

//       {/* Drag & Drop */}
//       <div
//         onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//         onDragLeave={() => setDragOver(false)}
//         onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) parseCsv(f); }}
//         className={`rounded-[2rem] border-2 border-dashed p-8 text-center transition-all ${
//           dragOver ? 'border-school-primary bg-school-primary/5' : 'border-slate-800 bg-slate-900/30'
//         }`}
//       >
//         <Upload className="mx-auto mb-3 h-8 w-8 text-slate-600" />
//         <p className="text-xs text-slate-300">Drag CSV here or <button type="button" onClick={() => fileInputRef.current?.click()} className="text-school-primary font-bold hover:underline">browse files</button></p>
//         <button type="button" onClick={downloadTemplate} className="mt-4 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-tighter transition-colors flex items-center gap-2 mx-auto">
//           <Download className="h-3 w-3" /> Get Sample CSV
//         </button>
//         <input ref={fileInputRef} type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && parseCsv(e.target.files[0])} className="hidden" />
//       </div>

//       {/* Main Registry */}
//       <div className="space-y-4">
//         {groups.map((group) => (
//           <div key={group.id} className="bg-slate-900/80 border border-white/5 rounded-[2rem] p-6 relative group shadow-xl">
//             <button 
//                 onClick={() => setGroups(groups.length > 1 ? groups.filter(g => g.id !== group.id) : groups)}
//                 className="absolute top-6 right-6 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
//             ><Trash2 className="h-4 w-4" /></button>

//             <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-8">
//               {/* Guardian Search */}
//               <div className="space-y-3">
//                 <label className="text-[10px] font-bold text-school-primary uppercase tracking-widest flex items-center gap-2">
//                   <User className="h-3 w-3" /> Guardian Lookup
//                 </label>
//                 <UserSearchInput 
//                   role="PARENT" 
//                   schoolId={schoolId} 
//                   placeholder="Search by name or email..."
//                   value={group.parentEmail}
//                   onSelect={(email) => setGroups(groups.map(g => g.id === group.id ? {...g, parentEmail: email} : g))}
//                 />
//               </div>

//               {/* Student Search Group */}
//               <div className="space-y-4">
//                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
//                   <GraduationCap className="h-3 w-3" /> Student Assignments
//                 </label>
//                 <div className="space-y-2">
//                   {group.children.map((child) => (
//                     <div key={child.id} className="space-y-1">
//                         <div className="flex gap-2 group/row items-center">
//                             <UserSearchInput 
//                               role="STUDENT" 
//                               schoolId={schoolId} 
//                               placeholder="Search student..."
//                               value={child.email}
//                               onSelect={(email) => {
//                                 setGroups(groups.map(g => g.id === group.id ? {
//                                   ...g, children: g.children.map(c => c.id === child.id ? {...c, email, status: 'idle'} : c)
//                                 } : g))
//                               }}
//                             />
//                             <button onClick={() => setGroups(groups.map(g => g.id === group.id ? {...g, children: g.children.filter(c => c.id !== child.id)} : g))} className="p-2 text-slate-700 hover:text-red-400 transition-opacity"><X className="h-4 w-4" /></button>
//                         </div>
//                         {child.message && <p className={`text-[9px] font-medium ml-1 ${child.status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>{child.message}</p>}
//                     </div>
//                   ))}
//                 </div>
//                 <button onClick={() => setGroups(groups.map(g => g.id === group.id ? {...g, children: [...g.children, makeChild()]} : g))} className="text-[10px] font-bold text-school-primary uppercase tracking-widest flex items-center gap-1.5 hover:brightness-125 transition-all">
//                   <Plus className="h-3.5 w-3.5" /> Add Student
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Footer Actions */}
//       <footer className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-white/5 pt-10 px-8 pb-10">
//         <button 
//           onClick={() => setGroups([...groups, makeGroup()])} 
//           className="text-slate-500 hover:text-school-primary text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2"
//         >
//           <Plus className="h-4 w-4" /> Add Parent Block
//         </button>

//         <button
//           onClick={handleLinkAll}
//           disabled={submitting}
//           className="w-full sm:w-auto bg-school-primary text-school-secondary-950 font-bold text-sm px-10 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 shadow-xl shadow-school-primary/10"
//         >
//           {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm All Links"}
//         </button>
//       </footer>
//     </section>
//   );
// }


'use client';

import { useCallback, useRef, useState } from 'react';
import Papa, { ParseResult } from 'papaparse';
import {
  Download, Loader2, Upload, X,
  Plus, User, GraduationCap, Trash2, Info, CheckCircle2, XCircle
} from 'lucide-react';
import { useProfileStore } from '@/store/profileStore';
import {
  bulkLinkParentsAndChildren,
  type ParentChildLinkInput,
  type ParentChildLinkResult,
} from '@/app/actions/parent-linking';
import { UserSearchInput } from '@/components/admin-dasboard/user-searchInput';

// --- Types ---
type RowStatus = 'idle' | 'linking' | 'linked' | 'error';

interface ChildEntry { 
  id: string; 
  email: string; 
  status: RowStatus; 
  message?: string; 
}

interface ParentGroup { 
  id: string; 
  parentEmail: string; 
  children: ChildEntry[]; 
}

// Interface for CSV parsing to replace 'any'
interface CsvRow {
  parent_email?: string;
  parentEmail?: string;
  child_email?: string;
  childEmail?: string;
}

const makeChild = (email = ''): ChildEntry => ({ id: crypto.randomUUID(), email, status: 'idle' });
const makeGroup = (parentEmail = '', childEmails: string[] = ['']): ParentGroup => ({
  id: crypto.randomUUID(),
  parentEmail,
  children: childEmails.map(email => makeChild(email)),
});

export function ParentChildLinker() {
  const [groups, setGroups] = useState<ParentGroup[]>([makeGroup()]);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { profile } = useProfileStore();
  const schoolId = profile?.schoolId ?? '';

  const downloadTemplate = () => {
    const csvContent = "parent_email,child_email\nguardian@example.com,student1@example.com";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'template.csv'; a.click();
  };

  const parseCsv = useCallback((file: File) => {
    // Replaced 'any' with CsvRow interface
    Papa.parse<CsvRow>(file, {
      header: true, 
      skipEmptyLines: true,
      complete: (result: ParseResult<CsvRow>) => {
        const aggregation = new Map<string, string[]>();
        result.data.forEach(row => {
          const p = (row.parent_email || row.parentEmail || '').trim().toLowerCase();
          const c = (row.child_email || row.childEmail || '').trim().toLowerCase();
          if (p) {
            const existing = aggregation.get(p) || [];
            if (c) existing.push(c);
            aggregation.set(p, existing);
          }
        });
        const newGroups = Array.from(aggregation.entries()).map(([pEmail, cEmails]) => makeGroup(pEmail, cEmails));
        if (newGroups.length > 0) setGroups(newGroups);
      },
    });
  }, []);

  const handleLinkAll = async () => {
    if (!schoolId) return;
    setSubmitting(true);
    const payload: ParentChildLinkInput[] = [];
    groups.forEach(g => g.children.forEach(c => payload.push({ parentEmail: g.parentEmail, childEmail: c.email })));
    
    setGroups(groups.map(g => ({ ...g, children: g.children.map(c => ({ ...c, status: 'linking' })) })));
    
    const results: ParentChildLinkResult[] = await bulkLinkParentsAndChildren(payload, schoolId);

    let idx = 0;
    setGroups(groups.map(g => ({
      ...g, children: g.children.map(c => {
        const res = results[idx++];
        return { ...c, status: res.success ? 'linked' : 'error', message: res.message };
      })
    })));
    setSubmitting(false);
  };

  return (
    <section className="space-y-6">
      {/* Instruction Guide */}
      <div className="bg-school-primary/5 border border-school-primary/20 rounded-[2rem] p-6 flex items-start gap-4">
        <Info className="h-5 w-5 text-school-primary shrink-0 mt-1" />
        <p className="text-[11px] text-slate-400 leading-relaxed">
          <strong>Pro Tip:</strong> Use the search fields to find users by name. The CSV grouping logic supports multiple students per parent automatically.
        </p>
      </div>

      {/* Drag & Drop */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) parseCsv(f); }}
        className={`rounded-[2rem] border-2 border-dashed p-8 text-center transition-all ${
          dragOver ? 'border-school-primary bg-school-primary/5' : 'border-slate-800 bg-slate-900/30'
        }`}
      >
        <Upload className="mx-auto mb-3 h-8 w-8 text-slate-600" />
        <p className="text-xs text-slate-300">Drag CSV here or <button type="button" onClick={() => fileInputRef.current?.click()} className="text-school-primary font-bold hover:underline">browse files</button></p>
        <button type="button" onClick={downloadTemplate} className="mt-4 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-tighter transition-colors flex items-center gap-2 mx-auto">
          <Download className="h-3 w-3" /> Get Sample CSV
        </button>
        <input ref={fileInputRef} type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && parseCsv(e.target.files[0])} className="hidden" />
      </div>

      {/* Main Registry */}
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.id} className="bg-slate-900/80 border border-white/5 rounded-[2rem] p-6 relative group shadow-xl">
            <button 
                onClick={() => setGroups(groups.length > 1 ? groups.filter(g => g.id !== group.id) : groups)}
                className="absolute top-6 right-6 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            ><Trash2 className="h-4 w-4" /></button>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-8">
              {/* Guardian Search */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-school-primary uppercase tracking-widest flex items-center gap-2">
                  <User className="h-3 w-3" /> Guardian Lookup
                </label>
                <UserSearchInput 
                  role="PARENT" 
                  schoolId={schoolId} 
                  placeholder="Search by name or email..."
                  value={group.parentEmail}
                  onSelect={(email) => setGroups(groups.map(g => g.id === group.id ? {...g, parentEmail: email} : g))}
                />
              </div>

              {/* Student Search Group */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <GraduationCap className="h-3 w-3" /> Student Assignments
                </label>
                <div className="space-y-2">
                  {group.children.map((child) => (
                    <div key={child.id} className="space-y-1">
                        <div className="flex gap-2 group/row items-center">
                            <UserSearchInput 
                              role="STUDENT" 
                              schoolId={schoolId} 
                              placeholder="Search student..."
                              value={child.email}
                              onSelect={(email) => {
                                setGroups(groups.map(g => g.id === group.id ? {
                                  ...g, children: g.children.map(c => c.id === child.id ? {...c, email, status: 'idle'} : c)
                                } : g))
                              }}
                            />
                            <button onClick={() => setGroups(groups.map(g => g.id === group.id ? {...g, children: g.children.filter(c => c.id !== child.id)} : g))} className="p-2 text-slate-700 hover:text-red-400 transition-opacity"><X className="h-4 w-4" /></button>
                        </div>
                        {child.message && (
                          <div className="flex items-center gap-1 mt-1 ml-1 font-medium">
                            {child.status === 'error' ? <XCircle className="h-3 w-3 text-red-500" /> : <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                            <p className={`text-[9px] ${child.status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>{child.message}</p>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
                <button onClick={() => setGroups(groups.map(g => g.id === group.id ? {...g, children: [...g.children, makeChild()]} : g))} className="text-[10px] font-bold text-school-primary uppercase tracking-widest flex items-center gap-1.5 hover:brightness-125 transition-all">
                  <Plus className="h-3.5 w-3.5" /> Add Student
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <footer className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-white/5 pt-10 px-8 pb-10">
        <button 
          onClick={() => setGroups([...groups, makeGroup()])} 
          className="text-slate-500 hover:text-school-primary text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Parent Block
        </button>

        <button
          onClick={handleLinkAll}
          disabled={submitting}
          className="w-full sm:w-auto bg-school-primary text-school-secondary-950 font-bold text-sm px-10 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 shadow-xl shadow-school-primary/10"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> LINKING...
            </span>
          ) : "Confirm All Links"}
        </button>
      </footer>
    </section>
  );
}