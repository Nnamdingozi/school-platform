// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"

// // import { parse } from "papaparse" // npm install papaparse

// export function AddUserModal() {
//   const [file, setFile] = useState<File | null>(null)
//   const [loading, setLoading] = useState(false)

//   const handleBulkImport = async () => {
//     if (!file) return
//     setLoading(true)

//     // parse(file, {
//     //   header: true,
//     //   complete: async (results) => {
//     //     // Map CSV headers to your Schema
//     //     const formattedData = results.data.map((row: any) => ({
//     //       email: row.email,
//     //       name: row.name,
//     //       role: row.role.toUpperCase(), // STUDENT, TEACHER, etc.
//     //     }))

//     //     await createUsers(formattedData, schoolId, curriculumId)
//     //     setLoading(false)
//     //     alert("Import Successful")
//     //   },
//     // })
//   }

//   return (
//     <div className="p-6 bg-card border rounded-xl space-y-4">
//       <h3 className="text-lg font-bold">Manage Members</h3>
      
//       <div className="grid gap-4">
//         {/* Manual Add Section */}
//         <div className="flex gap-2">
//           <Input placeholder="Name" id="name" />
//           <Input placeholder="Email" id="email" />
//           <select id="role" className="border rounded px-2">
//             <option value="STUDENT">Student</option>
//             <option value="TEACHER">Teacher</option>
//             <option value="PARENT">Parent</option>
//           </select>
//           <Button onClick={() => {/* logic for single add */}}>Add</Button>
//         </div>

//         <div className="relative">
//           <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
//           <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or Bulk Import</span></div>
//         </div>

//         {/* Bulk Upload Section */}
//         <div className="flex items-center gap-4">
//           <Input 
//             type="file" 
//             accept=".csv" 
//             onChange={(e) => setFile(e.target.files?.[0] || null)} 
//           />
//           <Button variant="outline" onClick={handleBulkImport} disabled={loading || !file}>
//             {loading ? "Importing..." : "Upload CSV"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }



"use client";

import React, { useState, useRef } from "react";
import { 
  UserPlus, Loader2, 
  Users, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfileStore } from "@/store/profileStore";
import { Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CSVImporter } from "@/components/shared/CSVImporter";

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface ProvisioningForm {
  name: string;
  email: string;
  role: Role;
}

/**
 * USER PROVISIONING TERMINAL
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-card, bg-surface, border-border).
 * Rule 19: Standardized Geometry [2rem] for layout blocks.
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function AddUserModal() {
  const { profile } = useProfileStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProvisioningForm>({
    name: "",
    email: "",
    role: Role.STUDENT
  });

  const handleManualAdd = async () => {
    if (!form.email || !form.name) {
      toast.error("Registry Error: Missing identity fields.");
      return;
    }
    setLoading(true);
    try {
      // Rule 12: Call Provisioning Action (Placeholder for your specific action)
      // await createUsers([form], profile?.schoolId, profile?.curriculumId);
      toast.success(`Identity Provisioned: ${form.name}`);
      setForm({ name: "", email: "", role: Role.STUDENT });
    } catch (error) {
      toast.error("Registry Breach: Protocol failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ── HEADER ── */}
      <div className="flex items-center gap-4 px-2">
        <div className="h-10 w-10 rounded-xl bg-school-primary-100 border border-school-primary-200 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-school-primary" />
        </div>
        <div>
            <h3 className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter">
                Identity Provisioning
            </h3>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest italic">
                Registry Terminal Node: {profile?.school?.name || "Global Core"}
            </p>
        </div>
      </div>

      {/* ── MANUAL PROVISIONING (Rule 19) ── */}
      <Card className="bg-card border-border rounded-[2rem] p-6 md:p-10 shadow-xl overflow-hidden">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
             <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
             <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Single Node Entry
             </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1.5fr_1fr_0.5fr] gap-4 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Identity Name</label>
              <Input 
                placeholder="Full Name" 
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="bg-surface border-border rounded-xl h-12 text-sm font-semibold focus:ring-school-primary-200" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Registry Email</label>
              <Input 
                placeholder="email@schoolpaas.com" 
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="bg-surface border-border rounded-xl h-12 text-sm font-semibold focus:ring-school-primary-200" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Registry Role</label>
              <div className="relative group">
                <select 
                  value={form.role}
                  onChange={(e) => setForm({...form, role: e.target.value as Role})}
                  className="w-full bg-surface border border-border rounded-xl h-12 px-4 text-xs font-bold uppercase tracking-widest appearance-none outline-none focus:ring-2 focus:ring-school-primary-200 transition-all cursor-pointer"
                >
                  <option value={Role.STUDENT}>Student</option>
                  <option value={Role.TEACHER}>Teacher</option>
                  <option value={Role.PARENT}>Guardian</option>
                  <option value={Role.SCHOOL_ADMIN}>Admin</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-hover:text-school-primary transition-colors" />
              </div>
            </div>

            <Button 
              onClick={handleManualAdd} 
              disabled={loading}
              className="bg-school-primary text-on-school-primary font-extrabold h-12 rounded-xl uppercase text-[10px] tracking-widest shadow-lg shadow-school-primary-200 hover:brightness-110 active:scale-95 transition-all"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Provision"}
            </Button>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="relative py-12">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-6 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground italic">
              Or Batch Protocol
            </span>
          </div>
        </div>

        {/* ── BATCH IMPORT (Rule 20) ── */}
        <div className="space-y-6">
          <CSVImporter 
            title="Registry Batch Sync"
            description="Format: name, email, role (STUDENT, TEACHER, PARENT)"
            expectedHeaders={["name", "email", "role"]}
            onDataUpload={async (rows) => {
              setLoading(true);
              // Rule 12: Async Integration logic
              // await createUsers(rows, profile?.schoolId, profile?.curriculumId);
              toast.success(`Synchronized ${rows.length} Registry Nodes.`);
              setLoading(false);
            }}
          />
        </div>
      </Card>

      {/* ── FOOTER GUIDANCE ── */}
      <div className="flex items-center justify-center gap-4 text-muted-foreground/40 italic">
        <Users className="h-4 w-4" />
        <p className="text-[9px] font-bold uppercase tracking-widest">
            Identities provisioned here will receive an automated registry invitation
        </p>
      </div>
    </div>
  );
}

// ── Shared UI Proxy (In case Card is not global) ───────────────────────────
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("border", className)}>{children}</div>;
}