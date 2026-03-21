"use client"

import { useState } from "react"
import Papa from "papaparse"

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

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setError(null)
    setIsParsing(true)

    Papa.parse<ParsedRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        setIsParsing(false)

        const headers = (results.meta.fields ?? []).map((h) => h.trim())
        const missing = expectedHeaders.filter(
          (h) => !headers.includes(h)
        )

        if (missing.length > 0) {
          setError(
            `CSV is missing required columns: ${missing.join(", ")}`
          )
          return
        }

        const rows = (results.data ?? []).filter(
          (row) =>
            Object.values(row).some(
              (value) => typeof value === "string" && value.trim() !== ""
            )
        )

        try {
          await onDataUpload(rows)
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to upload CSV data."
          )
        }
      },
      error: (err) => {
        setIsParsing(false)
        setError(err.message || "Failed to parse CSV file.")
      },
    })
  }

  return (
    <div className="rounded-lg border border-school-secondary/20 bg-card text-foreground p-4 md:p-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="inline-flex items-center gap-2 rounded-md border border-school-secondary/20 bg-school-primary/10 px-3 py-2 text-xs font-medium text-school-secondary cursor-pointer hover:bg-school-primary/20 transition-colors">
          <span>Choose CSV file</span>
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <div className="flex-1 text-right">
          {fileName ? (
            <p className="text-xs text-foreground truncate">
              Selected: <span className="font-medium">{fileName}</span>
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Required columns: {expectedHeaders.join(", ")}
            </p>
          )}
        </div>
      </div>

      {isParsing && (
        <p className="text-xs text-school-secondary">
          Parsing CSV, please wait...
        </p>
      )}

      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}