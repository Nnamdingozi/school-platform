"use client"

import { useState } from "react"
import { createUsers } from "@/app/actions/users"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select" 
// import { parse } from "papaparse" // npm install papaparse

export function AddUserModal({ schoolId, curriculumId }: { schoolId: string, curriculumId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleBulkImport = async () => {
    if (!file) return
    setLoading(true)

    // parse(file, {
    //   header: true,
    //   complete: async (results) => {
    //     // Map CSV headers to your Schema
    //     const formattedData = results.data.map((row: any) => ({
    //       email: row.email,
    //       name: row.name,
    //       role: row.role.toUpperCase(), // STUDENT, TEACHER, etc.
    //     }))

    //     await createUsers(formattedData, schoolId, curriculumId)
    //     setLoading(false)
    //     alert("Import Successful")
    //   },
    // })
  }

  return (
    <div className="p-6 bg-card border rounded-xl space-y-4">
      <h3 className="text-lg font-bold">Manage Members</h3>
      
      <div className="grid gap-4">
        {/* Manual Add Section */}
        <div className="flex gap-2">
          <Input placeholder="Name" id="name" />
          <Input placeholder="Email" id="email" />
          <select id="role" className="border rounded px-2">
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
            <option value="PARENT">Parent</option>
          </select>
          <Button onClick={() => {/* logic for single add */}}>Add</Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or Bulk Import</span></div>
        </div>

        {/* Bulk Upload Section */}
        <div className="flex items-center gap-4">
          <Input 
            type="file" 
            accept=".csv" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
          />
          <Button variant="outline" onClick={handleBulkImport} disabled={loading || !file}>
            {loading ? "Importing..." : "Upload CSV"}
          </Button>
        </div>
      </div>
    </div>
  )
}