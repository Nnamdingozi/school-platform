// 'use client';

// import { Download, FileSpreadsheet } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface CSVTemplateButtonProps {
//   fileName: string;
//   headers: string[];
//   sampleRow?: string[];
//   className?: string;
// }

// export function CSVTemplateButton({ 
//   fileName, 
//   headers, 
//   sampleRow,
//   className 
// }: CSVTemplateButtonProps) {
  
//   const handleDownload = () => {
//     const csvContent = [
//       headers.join(','),
//       sampleRow ? sampleRow.join(',') : headers.map(h => `example_${h}`).join(',')
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", `${fileName}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <button 
//       type="button"
//       onClick={handleDownload}
//       className={cn(
//         "flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-school-primary uppercase tracking-widest transition-colors",
//         className
//       )}
//     >
//       <FileSpreadsheet className="h-3.5 w-3.5" />
//       Get CSV Template
//     </button>
//   );
// }


// 'use client';

// import { FileSpreadsheet } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface CSVTemplateButtonProps {
//   fileName: string;
//   headers: string[];
//   sampleRow: string[];
//   label?: string;
//   className?: string;
// }

// export function CSVTemplateButton({ 
//   fileName, 
//   headers, 
//   sampleRow, 
//   label = "Get Template",
//   className 
// }: CSVTemplateButtonProps) {
  
//   const handleDownload = () => {
//     // 1. Combine headers and sample row into CSV format
//     const csvContent = [
//       headers.join(','),
//       sampleRow.join(',')
//     ].join('\n');

//     // 2. Create and trigger download
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", `${fileName}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <button 
//       type="button"
//       onClick={handleDownload}
//       className={cn(
//         "flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-school-primary uppercase tracking-widest transition-all px-3 py-2 bg-slate-900 rounded-lg border border-white/5",
//         className
//       )}
//     >
//       <FileSpreadsheet className="h-3.5 w-3.5" />
//       {label}
//     </button>
//   );
// }


// 'use client';

// import { FileSpreadsheet } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { useProfileStore } from '@/store/profileStore';

// interface CSVTemplateButtonProps {
//   fileName: string;
//   headers: string[];
//   sampleRow: string[];
//   label?: string;
//   className?: string;
// }

// export function CSVTemplateButton({ fileName, headers, sampleRow, label = "Download Template", className }: CSVTemplateButtonProps) {
//   const { profile } = useProfileStore();
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   const handleDownload = () => {
//     const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", `${fileName}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <button 
//       type="button"
//       onClick={handleDownload}
//       className={cn(
//         "flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all px-6 py-3 bg-slate-900 rounded-xl border border-white/5 group shadow-xl",
//         className
//       )}
//     >
//       <FileSpreadsheet className="h-4 w-4 text-slate-500 group-hover:text-school-primary transition-colors" style={{ color: primaryColor }} />
//       <span className="text-slate-400 group-hover:text-white transition-colors">{label}</span>
//     </button>
//   );
// }



'use client';

import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';


interface CSVTemplateButtonProps {
  fileName: string;
  headers: string[];
  sampleRow: string[];
  label?: string;
  className?: string;
}

/**
 * CSV TEMPLATE GENERATOR (Utility)
 * Rule 11: High-density Registry Typography (font-bold uppercase).
 * Rule 18: Semantic Color Flip (bg-surface, bg-card, border-border).
 * Rule 19: Standardized Geometry (rounded-xl).
 */
export function CSVTemplateButton({ 
  fileName, 
  headers, 
  sampleRow, 
  label = "Download Template", 
  className 
}: CSVTemplateButtonProps) {
 

  const handleDownload = () => {
    // Generate CSV data from props
    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button 
      type="button"
      onClick={handleDownload}
      className={cn(
        "inline-flex items-center gap-3 transition-all px-6 py-3 group shadow-sm",
        "bg-surface border border-border rounded-xl hover:bg-card hover:border-school-primary/30", // Rule 18 & 19
        "active:scale-95",
        className
      )}
    >
      {/* Rule 18: Branded Icon Sync */}
      <FileSpreadsheet className="h-4 w-4 text-school-primary opacity-80 group-hover:opacity-100 transition-all" />
      
      {/* Rule 11: Metadata Typography */}
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
    </button>
  );
}