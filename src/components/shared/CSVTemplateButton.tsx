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


'use client';

import { FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CSVTemplateButtonProps {
  fileName: string;
  headers: string[];
  sampleRow: string[];
  label?: string;
  className?: string;
}

export function CSVTemplateButton({ 
  fileName, 
  headers, 
  sampleRow, 
  label = "Get Template",
  className 
}: CSVTemplateButtonProps) {
  
  const handleDownload = () => {
    // 1. Combine headers and sample row into CSV format
    const csvContent = [
      headers.join(','),
      sampleRow.join(',')
    ].join('\n');

    // 2. Create and trigger download
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
        "flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-school-primary uppercase tracking-widest transition-all px-3 py-2 bg-slate-900 rounded-lg border border-white/5",
        className
      )}
    >
      <FileSpreadsheet className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}