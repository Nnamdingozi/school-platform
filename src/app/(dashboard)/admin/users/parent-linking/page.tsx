

// "use client"

// import { useState } from 'react';
// import { ParentChildLinker } from "@/components/admin-dasboard/parent-child-linker";
// import { FamilyDirectory } from "@/components/familyDirectory";
// import { useProfileStore } from '@/store/profileStore';
// import { ArrowLeft, UserPlus, Users } from "lucide-react";
// import Link from "next/link";

// export default function ParentLinkingPage() {
//   const [activeTab, setActiveTab] = useState<'create' | 'view'>('create');
//   const { profile } = useProfileStore();

//   return (
//     <div className="min-h-screen bg-slate-950 p-8">
//       <div className="max-w-6xl mx-auto space-y-8">
//         <header className="flex flex-col md:flex-row justify-between items-end gap-6">
//           <div className="space-y-4">
//             <Link href="/admin/users" className="text-school-primary text-[10px] font-black uppercase flex items-center gap-2">
//               <ArrowLeft className="h-3 w-3" /> User Registry
//             </Link>
//             <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Family Relations</h1>
//           </div>

//           {/* Tab Switcher */}
//           <div className="bg-slate-900 p-1.5 rounded-2xl border border-white/5 flex gap-2">
//             <button 
//               onClick={() => setActiveTab('create')}
//               className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'create' ? 'bg-school-primary text-school-secondary-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
//             >
//               <UserPlus className="h-3.5 w-3.5 inline mr-2" /> Create Links
//             </button>
//             <button 
//               onClick={() => setActiveTab('view')}
//               className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'view' ? 'bg-school-primary text-school-secondary-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
//             >
//               <Users className="h-3.5 w-3.5 inline mr-2" /> View Directory
//             </button>
//           </div>
//         </header>

//         {activeTab === 'create' ? (
//           <ParentChildLinker />
//         ) : (
//           <FamilyDirectory schoolId={profile?.schoolId ?? ''} />
//         )}
//       </div>
//     </div>
//   );
// }


"use client"

import { useState } from 'react';
import { ParentChildLinker } from "@/components/admin-dasboard/parent-child-linker";
// ✅ CHANGE: Import FamilyDirectoryTable instead of FamilyDirectory
import { FamilyDirectoryTable } from "@/components/familyDirectory"; 
import { useProfileStore } from '@/store/profileStore';
import { ArrowLeft, UserPlus, Users } from "lucide-react";
import Link from "next/link";

export default function ParentLinkingPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'view'>('create');
  const { profile } = useProfileStore();

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <Link href="/admin/users" className="text-school-primary text-[10px] font-black uppercase flex items-center gap-2">
              <ArrowLeft className="h-3 w-3" /> User Registry
            </Link>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Family Relations</h1>
          </div>

          <div className="bg-slate-900 p-1.5 rounded-2xl border border-white/5 flex gap-2">
            <button 
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'create' ? 'bg-school-primary text-school-secondary-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              <UserPlus className="h-3.5 w-3.5 inline mr-2" /> Create Links
            </button>
            <button 
              onClick={() => setActiveTab('view')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'view' ? 'bg-school-primary text-school-secondary-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              <Users className="h-3.5 w-3.5 inline mr-2" /> View Directory
            </button>
          </div>
        </header>

        {activeTab === 'create' ? (
          <ParentChildLinker />
        ) : (
          /* ✅ CHANGE: Use FamilyDirectoryTable here */
          <FamilyDirectoryTable schoolId={profile?.schoolId ?? ''} />
        )}
      </div>
    </div>
  );
}