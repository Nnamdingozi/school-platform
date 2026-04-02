// "use client"

// import { useState } from "react"
// import Papa from "papaparse"

// type ParsedRow = Record<string, string>

// interface CSVImporterProps {
//   title: string
//   description?: string
//   expectedHeaders: string[]
//   onDataUpload: (rows: ParsedRow[]) => void | Promise<void>
// }

// export function CSVImporter({
//   title,
//   description,
//   expectedHeaders,
//   onDataUpload,
// }: CSVImporterProps) {
//   const [fileName, setFileName] = useState<string | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const [isParsing, setIsParsing] = useState(false)

//   function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
//     const file = event.target.files?.[0]
//     if (!file) return

//     setFileName(file.name)
//     setError(null)
//     setIsParsing(true)

//     Papa.parse<ParsedRow>(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: async (results) => {
//         setIsParsing(false)

//         const headers = (results.meta.fields ?? []).map((h) => h.trim())
//         const missing = expectedHeaders.filter(
//           (h) => !headers.includes(h)
//         )

//         if (missing.length > 0) {
//           setError(
//             `CSV is missing required columns: ${missing.join(", ")}`
//           )
//           return
//         }

//         const rows = (results.data ?? []).filter(
//           (row) =>
//             Object.values(row).some(
//               (value) => typeof value === "string" && value.trim() !== ""
//             )
//         )

//         try {
//           await onDataUpload(rows)
//         } catch (err) {
//           setError(
//             err instanceof Error
//               ? err.message
//               : "Failed to upload CSV data."
//           )
//         }
//       },
//       error: (err) => {
//         setIsParsing(false)
//         setError(err.message || "Failed to parse CSV file.")
//       },
//     })
//   }

//   return (
//     <div className="rounded-lg border border-school-secondary/20 bg-card text-foreground p-4 md:p-5 space-y-3">
//       <div className="flex items-center justify-between gap-2">
//         <div>
//           <h3 className="text-sm font-semibold text-foreground">
//             {title}
//           </h3>
//           {description && (
//             <p className="mt-1 text-xs text-muted-foreground">
//               {description}
//             </p>
//           )}
//         </div>
//       </div>

//       <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//         <label className="inline-flex items-center gap-2 rounded-md border border-school-secondary/20 bg-school-primary/10 px-3 py-2 text-xs font-medium text-school-secondary cursor-pointer hover:bg-school-primary/20 transition-colors">
//           <span>Choose CSV file</span>
//           <input
//             type="file"
//             accept=".csv,text/csv"
//             className="hidden"
//             onChange={handleFileChange}
//           />
//         </label>

//         <div className="flex-1 text-right">
//           {fileName ? (
//             <p className="text-xs text-foreground truncate">
//               Selected: <span className="font-medium">{fileName}</span>
//             </p>
//           ) : (
//             <p className="text-xs text-muted-foreground">
//               Required columns: {expectedHeaders.join(", ")}
//             </p>
//           )}
//         </div>
//       </div>

//       {isParsing && (
//         <p className="text-xs text-school-secondary">
//           Parsing CSV, please wait...
//         </p>
//       )}

//       {error && (
//         <p className="text-xs text-destructive">
//           {error}
//         </p>
//       )}
//     </div>
//   )
// }



"use client"

import { useState, useRef } from "react"
import Papa from "papaparse"
import { Upload, Loader2, FileCheck, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type ParsedRow = Record<string, string>

interface CSVImporterProps {
  title: string
  description?: string
  expectedHeaders: string[]
  onDataUpload: (rows: ParsedRow[]) => void | Promise<void>
}

export function CSVImporter({
  title,
  description,
  expectedHeaders,
  onDataUpload,
}: CSVImporterProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    setFileName(file.name)
    setError(null)
    setIsParsing(true)

    Papa.parse<ParsedRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        setIsParsing(false)
        const headers = (results.meta.fields ?? []).map((h) => h.trim())
        const missing = expectedHeaders.filter((h) => !headers.includes(h))

        if (missing.length > 0) {
          setError(`Invalid Format. Missing: ${missing.join(", ")}`)
          return
        }

        const rows = (results.data ?? []).filter((row) =>
            Object.values(row).some((v) => typeof v === "string" && v.trim() !== "")
        )

        try {
          await onDataUpload(rows)
        } catch (err) {
          setError(err instanceof Error ? err.message : "Upload failed.")
        }
      },
      error: (err) => {
        setIsParsing(false)
        setError(err.message || "Parse failed.")
      },
    })
  }

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
      className={cn(
        "rounded-2xl border-2 border-dashed p-6 transition-all text-center group",
        dragOver ? "border-school-primary bg-school-primary/5" : "border-white/10 bg-slate-900/50 hover:border-white/20"
      )}
    >
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-slate-950 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                {isParsing ? <Loader2 className="h-5 w-5 animate-spin text-school-primary" /> : <Upload className="h-5 w-5 text-slate-500" />}
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">{title}</h3>
            {description && <p className="text-[10px] text-slate-500 uppercase font-bold">{description}</p>}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black py-2 px-6 rounded-lg border border-white/5 transition-all"
        >
          {fileName ? "CHANGE FILE" : "BROWSE CSV"}
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {fileName && !error && !isParsing && (
            <div className="flex items-center justify-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                <FileCheck className="h-3.5 w-3.5" /> {fileName} Attached
            </div>
        )}

        {error && (
            <div className="flex items-center justify-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                <AlertCircle className="h-3.5 w-3.5" /> {error}
            </div>
        )}
      </div>
    </div>
  )
}