



'use client';

import { useState } from 'react';
import {
  Loader2,
  X,
  Plus,
  User,
  GraduationCap,
  Trash2,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useProfileStore } from '@/store/profileStore';
import {
  bulkLinkParentsAndChildren,
  type ParentChildLinkInput,
  type ParentChildLinkResult,
} from '@/app/actions/parent-linking';
import { UserSearchInput } from '@/components/admin-dasboard/user-searchInput';
import { CSVImporter } from '@/components/shared/CSVImporter';
import { CSVTemplateButton } from '@/components/shared/CSVTemplateButton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// --- Types ---
type RowStatus = 'idle' | 'linking' | 'linked' | 'error';
interface ChildEntry { id: string; email: string; status: RowStatus; message?: string; }
interface ParentGroup { id: string; parentEmail: string; children: ChildEntry[]; }

const makeChild = (email = ''): ChildEntry => ({ id: crypto.randomUUID(), email, status: 'idle' });
const makeGroup = (parentEmail = '', childEmails: string[] = ['']): ParentGroup => ({
  id: crypto.randomUUID(),
  parentEmail,
  children: childEmails.map(email => makeChild(email)),
});

export function ParentChildLinker() {
  const [groups, setGroups] = useState<ParentGroup[]>([makeGroup()]);
  const [submitting, setSubmitting] = useState(false);

  const { profile } = useProfileStore();
  const schoolId = profile?.schoolId ?? '';

  // --- Handlers ---
  const removeParentGroup = (groupId: string) => {
    if (groups.length > 1) setGroups(groups.filter(g => g.id !== groupId));
  };

  const updateParentEmail = (groupId: string, email: string) => {
    setGroups(groups.map(g => g.id === groupId ? { ...g, parentEmail: email } : g));
  };

  const addChildToGroup = (groupId: string) => {
    setGroups(groups.map(g => g.id === groupId ? { ...g, children: [...g.children, makeChild()] } : g));
  };

  const updateChildEmail = (groupId: string, childId: string, email: string) => {
    setGroups(groups.map(g => g.id === groupId ? {
      ...g, children: g.children.map(c => c.id === childId ? { ...c, email, status: 'idle' } : c)
    } : g));
  };

  // --- Logic: Process parsed CSV rows into the Grouped UI ---
  const handleCsvData = (rows: Record<string, string>[]) => {
    const aggregation = new Map<string, string[]>();
    
    rows.forEach(row => {
      // Handle various possible header names
      const p = (row.parent_email || row.parentEmail || row.parent || '').trim().toLowerCase();
      const c = (row.child_email || row.childEmail || row.student || '').trim().toLowerCase();
      
      if (p) {
        const existing = aggregation.get(p) || [];
        if (c) existing.push(c);
        aggregation.set(p, existing);
      }
    });

    const newGroups = Array.from(aggregation.entries()).map(([pEmail, cEmails]) => 
      makeGroup(pEmail, cEmails.length > 0 ? cEmails : [''])
    );

    if (newGroups.length > 0) {
      setGroups(newGroups);
    }
  };

  // --- Submission ---
  const handleLinkAll = async () => {
    if (!schoolId) return toast.error("Institutional context missing.");
    setSubmitting(true);
    
    const payload: ParentChildLinkInput[] = [];
    groups.forEach(g => g.children.forEach(c => {
        if (g.parentEmail && c.email) {
            payload.push({ parentEmail: g.parentEmail, childEmail: c.email });
        }
    }));

    if (payload.length === 0) {
        toast.error("No valid pairs to synchronize.");
        setSubmitting(false);
        return;
    }

    setGroups(groups.map(g => ({ ...g, children: g.children.map(c => ({ ...c, status: 'linking' })) })));
    
    const results: ParentChildLinkResult[] = await bulkLinkParentsAndChildren(payload, schoolId);

    let idx = 0;
    setGroups(groups.map(g => ({
      ...g, children: g.children.map(c => {
        const res = results[idx++];
        return { 
            ...c, 
            status: res.success ? 'linked' : 'error', 
            message: res.message 
        };
      })
    })));
    setSubmitting(false);
  };

  return (
    <section className="space-y-6">
      {/* ── Header & Instructions ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-school-primary/5 border border-school-primary/20 rounded-[2rem] p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-school-primary/10 rounded-2xl text-school-primary">
            <Info className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Relationship Linker</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl">
              Connect guardian accounts to students. You can link multiple students to one parent. 
              The CSV importer automatically groups duplicate parent rows for you.
            </p>
          </div>
        </div>

        {/* ✅ REUSABLE TEMPLATE BUTTON */}
        <CSVTemplateButton 
           fileName="parent_student_links"
           headers={["parent_email", "child_email"]}
           sampleRow={["guardian@example.com", "student1@example.com"]}
           className="bg-slate-900 border-white/10"
        />
      </div>

      {/* ✅ REUSABLE CSV IMPORTER */}
      <CSVImporter 
        title="Registry Bulk Import"
        description="Select a CSV file containing parent and child email pairs."
        expectedHeaders={["parent_email", "child_email"]}
        onDataUpload={handleCsvData}
      />

      {/* ── Main Interface ── */}
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.id} className="bg-slate-900/80 border border-white/5 rounded-[2rem] p-6 relative group shadow-xl">
            <button 
                onClick={() => removeParentGroup(group.id)}
                className="absolute top-6 right-6 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr] gap-10">
              {/* Guardian Search */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-school-primary uppercase tracking-widest flex items-center gap-2">
                  <User className="h-3 w-3" /> Guardian Identity
                </label>
                <UserSearchInput 
                  role="PARENT" 
                  schoolId={schoolId} 
                  placeholder="Search guardian..."
                  value={group.parentEmail}
                  onSelect={(email) => updateParentEmail(group.id, email)}
                />
              </div>

              {/* Student List */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <GraduationCap className="h-3 w-3" /> Student Assignments
                </label>
                
                <div className="space-y-3">
                  {group.children.map((child) => (
                    <div key={child.id} className="space-y-1">
                        <div className="flex gap-2 items-center group/row">
                            <div className="relative flex-1">
                                <UserSearchInput 
                                    role="STUDENT" 
                                    schoolId={schoolId} 
                                    placeholder="Search student..."
                                    value={child.email}
                                    onSelect={(email) => updateChildEmail(group.id, child.id, email)}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {child.status === 'linking' && <Loader2 className="h-3 w-3 animate-spin text-school-primary" />}
                                    {child.status === 'linked' && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                                    {child.status === 'error' && <XCircle className="h-3 w-3 text-red-500" />}
                                </div>
                            </div>
                            <button 
                                onClick={() => setGroups(groups.map(g => g.id === group.id ? {...g, children: g.children.filter(c => c.id !== child.id)} : g))}
                                className="p-3 text-slate-700 hover:text-red-400 opacity-0 group-hover/row:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        {child.message && (
                            <p className={cn(
                                "text-[9px] font-bold ml-1 uppercase tracking-tight",
                                child.status === 'error' ? "text-red-400" : "text-emerald-400"
                            )}>
                                {child.message}
                            </p>
                        )}
                    </div>
                  ))}
                </div>

                <button 
                    onClick={() => addChildToGroup(group.id)} 
                    className="text-[10px] font-black text-school-primary uppercase tracking-widest flex items-center gap-1.5 hover:brightness-125 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" /> Add another child
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <footer className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-white/5 pt-8 px-6">
        <button 
          onClick={() => setGroups([...groups, makeGroup()])} 
          className="flex items-center gap-2 text-slate-500 hover:text-school-primary text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
        >
          <Plus className="h-4 w-4" /> Add Parent Block
        </button>

        <button
          onClick={handleLinkAll}
          disabled={submitting}
          className="w-full sm:w-auto bg-school-primary text-school-secondary-950 font-black text-[11px] uppercase tracking-widest px-10 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 shadow-xl shadow-school-primary/10"
        >
          {submitting ? (
             <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> SYNCHRONIZING...
             </span>
          ) : "Confirm All Relationships"}
        </button>
      </footer>
    </section>
  );
}

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


// 'use client';

// import { useCallback, useRef, useState } from 'react';
// import Papa, { ParseResult } from 'papaparse';
// import {
//   Download, Loader2, Upload, X,
//   Plus, User, GraduationCap, Trash2, Info, CheckCircle2, XCircle
// } from 'lucide-react';
// import { useProfileStore } from '@/store/profileStore';
// import {
//   bulkLinkParentsAndChildren,
//   type ParentChildLinkInput,
//   type ParentChildLinkResult,
// } from '@/app/actions/parent-linking';
// import { UserSearchInput } from '@/components/admin-dasboard/user-searchInput';

// // --- Types ---
// type RowStatus = 'idle' | 'linking' | 'linked' | 'error';

// interface ChildEntry { 
//   id: string; 
//   email: string; 
//   status: RowStatus; 
//   message?: string; 
// }

// interface ParentGroup { 
//   id: string; 
//   parentEmail: string; 
//   children: ChildEntry[]; 
// }

// // Interface for CSV parsing to replace 'any'
// interface CsvRow {
//   parent_email?: string;
//   parentEmail?: string;
//   child_email?: string;
//   childEmail?: string;
// }

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
//     // Replaced 'any' with CsvRow interface
//     Papa.parse<CsvRow>(file, {
//       header: true, 
//       skipEmptyLines: true,
//       complete: (result: ParseResult<CsvRow>) => {
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
    
//     const results: ParentChildLinkResult[] = await bulkLinkParentsAndChildren(payload, schoolId);

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
//     <section className="space-y-6 h-fit">
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
//                         {child.message && (
//                           <div className="flex items-center gap-1 mt-1 ml-1 font-medium">
//                             {child.status === 'error' ? <XCircle className="h-3 w-3 text-red-500" /> : <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
//                             <p className={`text-[9px] ${child.status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>{child.message}</p>
//                           </div>
//                         )}
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
//           {submitting ? (
//             <span className="flex items-center gap-2">
//               <Loader2 className="h-4 w-4 animate-spin" /> LINKING...
//             </span>
//           ) : "Confirm All Links"}
//         </button>
//       </footer>
//     </section>
//   );
// }


// 'use client';

// import { useCallback, useRef, useState } from 'react';
// import Papa, { ParseResult } from 'papaparse';
// import {
//   Download, Loader2, Upload, X,
//   Plus, User, GraduationCap, Trash2, Info, CheckCircle2, XCircle
// } from 'lucide-react';
// import { useProfileStore } from '@/store/profileStore';
// import {
//   bulkLinkParentsAndChildren,
//   type ParentChildLinkInput,
//   type ParentChildLinkResult,
// } from '@/app/actions/parent-linking';
// import { UserSearchInput } from '@/components/admin-dasboard/user-searchInput';
// import { Card, CardContent } from '@/components/ui/card';

// // --- Types ---
// type RowStatus = 'idle' | 'linking' | 'linked' | 'error';

// interface ChildEntry { 
//   id: string; 
//   email: string; 
//   status: RowStatus; 
//   message?: string; 
// }

// interface ParentGroup { 
//   id: string; 
//   parentEmail: string; 
//   children: ChildEntry[]; 
// }

// interface CsvRow {
//   parent_email?: string;
//   parentEmail?: string;
//   child_email?: string;
//   childEmail?: string;
// }

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
//     Papa.parse<CsvRow>(file, {
//       header: true, 
//       skipEmptyLines: true,
//       complete: (result: ParseResult<CsvRow>) => {
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
//     const results: ParentChildLinkResult[] = await bulkLinkParentsAndChildren(payload, schoolId);
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
//     <Card className="bg-gray-50 border-gray-200 shadow-sm rounded-[2rem] overflow-hidden h-fit">
//       <CardContent className="p-6 md:p-8 space-y-8">
        
//         {/* ── Instruction Guide ── */}
//         <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
//           <div className="p-2 bg-school-primary/10 rounded-lg text-school-primary">
//             <Info className="h-5 w-5" />
//           </div>
//           <div>
//             <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Relationship Manager</h3>
//             <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
//               Link guardians to their children. You can add multiple children per parent. CSV grouping is handled automatically.
//             </p>
//           </div>
//         </div>

//         {/* ── Drag & Drop / Upload ── */}
//         <div
//           onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//           onDragLeave={() => setDragOver(false)}
//           onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) parseCsv(f); }}
//           className={`rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
//             dragOver ? 'border-school-primary bg-school-primary/5' : 'border-gray-300 bg-gray-100/50 hover:bg-gray-100'
//           }`}
//         >
//           <Upload className="mx-auto mb-3 h-10 w-10 text-gray-400" />
//           <p className="text-sm text-gray-600 font-medium">Drag CSV here or <button type="button" onClick={() => fileInputRef.current?.click()} className="text-school-primary font-bold hover:underline">browse files</button></p>
//           <button type="button" onClick={downloadTemplate} className="mt-4 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors flex items-center gap-2 mx-auto">
//             <Download className="h-3 w-3" /> Download CSV Template
//           </button>
//           <input ref={fileInputRef} type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && parseCsv(e.target.files[0])} className="hidden" />
//         </div>

//         {/* ── Main Registry ── */}
//         <div className="space-y-6">
//           {groups.map((group) => (
//             <div key={group.id} className="bg-white border border-gray-200 rounded-3xl p-6 relative group shadow-sm transition-all hover:shadow-md">
//               <button 
//                   onClick={() => setGroups(groups.length > 1 ? groups.filter(g => g.id !== group.id) : groups)}
//                   className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </button>

//               <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
//                 {/* Guardian Info */}
//                 <div className="space-y-3">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
//                     <User className="h-3 w-3" /> Guardian Account
//                   </label>
//                   <UserSearchInput 
//                     role="PARENT" 
//                     schoolId={schoolId} 
//                     placeholder="Search parent..."
//                     value={group.parentEmail}
//                     onSelect={(email) => setGroups(groups.map(g => g.id === group.id ? {...g, parentEmail: email} : g))}
//                   />
//                 </div>

//                 {/* Children Assignments */}
//                 <div className="space-y-4">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
//                     <GraduationCap className="h-3 w-3" /> Student Assignments
//                   </label>
                  
//                   <div className="space-y-3">
//                     {group.children.map((child) => (
//                       <div key={child.id} className="space-y-1">
//                           <div className="flex gap-2 items-center group/row">
//                               <div className="relative flex-1">
//                                   <UserSearchInput 
//                                     role="STUDENT" 
//                                     schoolId={schoolId} 
//                                     placeholder="Search student..."
//                                     value={child.email}
//                                     onSelect={(email) => {
//                                       setGroups(groups.map(g => g.id === group.id ? {
//                                         ...g, children: g.children.map(c => c.id === child.id ? {...c, email, status: 'idle'} : c)
//                                       } : g))
//                                     }}
//                                   />
//                                   <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                                       {child.status === 'linking' && <Loader2 className="h-3 w-3 animate-spin text-school-primary" />}
//                                       {child.status === 'linked' && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
//                                       {child.status === 'error' && <XCircle className="h-3 w-3 text-red-500" />}
//                                   </div>
//                               </div>
//                               <button 
//                                 onClick={() => setGroups(groups.map(g => g.id === group.id ? {...g, children: g.children.filter(c => c.id !== child.id)} : g))}
//                                 className="p-2 text-gray-300 hover:text-red-500 transition-colors"
//                               >
//                                 <X className="h-4 w-4" />
//                               </button>
//                           </div>
//                           {child.message && (
//                             <div className="flex items-center gap-1 mt-1 ml-1">
//                               <p className={`text-[9px] font-bold ${child.status === 'error' ? 'text-red-500' : 'text-emerald-600'}`}>{child.message}</p>
//                             </div>
//                           )}
//                       </div>
//                     ))}
//                   </div>

//                   <button 
//                     onClick={() => addChildToGroup(group.id)}
//                     className="text-[10px] font-bold text-school-primary uppercase tracking-widest flex items-center gap-1.5 hover:opacity-70 transition-all"
//                   >
//                     <Plus className="h-3.5 w-3.5" /> Add Student
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ── Footer Actions ── */}
//         <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-gray-200 pt-8 px-2">
//           <button 
//             onClick={() => setGroups([...groups, makeGroup()])} 
//             className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-[10px] font-bold uppercase tracking-widest transition-all"
//           >
//             <Plus className="h-4 w-4" /> Add Parent Group
//           </button>

//           <button
//             onClick={handleLinkAll}
//             disabled={submitting}
//             className="w-full sm:w-auto bg-school-primary text-school-secondary-950 font-bold text-xs uppercase tracking-widest px-10 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 shadow-md"
//           >
//             {submitting ? (
//               <span className="flex items-center gap-2">
//                 <Loader2 className="h-4 w-4 animate-spin" /> Processing
//               </span>
//             ) : "Confirm All Links"}
//           </button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }