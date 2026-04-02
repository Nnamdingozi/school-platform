'use client'

import { useState, useEffect, useTransition } from 'react'
import { Check, UserCircle, Save, Loader2, Info } from 'lucide-react'
import { 
    getClassAllocationData, 
    allocateStudentSubjects // ✅ Using the modified action
} from '@/app/actions/subject-allocation'
import { getErrorMessage } from '@/lib/error-handler'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'


interface Student { id: string; name: string | null; email: string }
interface Subject { id: string; name: string }
type MatrixState = Record<string, string[]>

export function AllocationMatrix({ classId, schoolId }: { classId: string, schoolId: string }) {
    const [data, setData] = useState<{
        className: string, 
        gradeName: string, 
        gradeLevel: number,
        subjects: Subject[], 
        students: Student[]
    } | null>(null)
    
    const [matrix, setMatrix] = useState<MatrixState>({})
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()

    // 1. Load data and transform into matrix state
    useEffect(() => {
        getClassAllocationData(classId, schoolId).then(res => {
            if (res.success && res.data) {
                setData(res.data)
                const initialMap: MatrixState = {}
                res.data.existingMap.forEach((link) => {
                    if (!initialMap[link.studentId]) initialMap[link.studentId] = []
                    initialMap[link.studentId].push(link.gradeSubjectId)
                })
                setMatrix(initialMap)
            } else {
                toast.error(res.error || "Failed to load registry")
            }
            setLoading(false)
        })
    }, [classId, schoolId])

    const toggle = (studentId: string, gsId: string) => {
        const current = matrix[studentId] || []
        const updated = current.includes(gsId) ? current.filter(id => id !== gsId) : [...current, gsId]
        setMatrix({ ...matrix, [studentId]: updated })
    }

    // 2. Save logic utilizing the modified 'allocateStudentSubjects'
    const handleSave = () => {
        startTransition(async () => {
            try {
                const savePromises = Object.entries(matrix).map(([studentId, gradeSubjectIds]) => 
                    allocateStudentSubjects(schoolId, studentId, gradeSubjectIds)
                )

                const results = await Promise.all(savePromises)
                const errors = results.filter(r => !r.success)

                if (errors.length > 0) {
                    toast.error(`${errors.length} student records failed to synchronize.`)
                } else {
                    toast.success("Academic matrix synchronized successfully.")
                }
            } catch (err) {
                toast.error(getErrorMessage(err))
            }
        })
    }

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-school-primary h-8 w-8" />
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Loading_Academic_Matrix...</p>
        </div>
    )

    if (!data) return null

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                        {data.className}
                    </h2>
                    <p className="text-school-primary text-[10px] font-black uppercase tracking-[0.2em] mt-3">
                        {data.gradeName} • Level {data.gradeLevel} Registry
                    </p>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={isPending}
                    className="w-full md:w-auto bg-school-primary text-school-secondary-950 font-black px-10 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-school-primary/20 disabled:opacity-50"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    SYNC ALLOCATIONS
                </button>
            </header>

            {/* WAEC Minimum Info for Senior Secondary */}
            {data.gradeLevel >= 10 && (
                <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3">
                    <Info className="h-5 w-5 text-amber-500 shrink-0" />
                    <p className="text-[11px] text-amber-200/70 leading-relaxed">
                        <span className="font-bold text-amber-500 uppercase tracking-widest">Academic Policy:</span> As this is a Senior level, the system enforces a <span className="text-white font-bold">minimum of 9 subjects</span> per student to comply with WAEC/NECO standards.
                    </p>
                </div>
            )}

            <div className="rounded-[2.5rem] border border-white/5 bg-slate-900 overflow-hidden shadow-2xl relative">
                {isPending && <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-50 flex items-center justify-center font-black text-school-primary uppercase tracking-[0.3em]">Processing_Updates...</div>}
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5">
                                <th className="p-8 sticky left-0 bg-slate-950 z-20 min-w-[300px]">Student Identity</th>
                                {data.subjects.map((sub) => (
                                    <th key={sub.id} className="p-8 text-center border-l border-white/5 whitespace-nowrap min-w-[140px] italic">
                                        {sub.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.students.map((student) => (
                                <tr key={student.id} className="hover:bg-school-primary/5 transition-all group">
                                    <td className="p-8 font-bold sticky left-0 bg-slate-900 z-10 group-hover:bg-slate-800 transition-colors shadow-2xl flex items-center gap-4 border-r border-white/5">
                                        <div className="h-10 w-10 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 border border-white/5 group-hover:text-school-primary transition-colors">
                                            <UserCircle className="h-6 w-6" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm text-white font-black uppercase tracking-tight truncate">{student.name || "UNNAMED"}</span>
                                            <span className="text-[10px] text-slate-500 font-mono lowercase truncate">{student.email}</span>
                                        </div>
                                    </td>
                                    {data.subjects.map((sub) => {
                                        const isChecked = matrix[student.id]?.includes(sub.id)
                                        return (
                                            <td key={sub.id} className="p-8 text-center border-l border-white/5">
                                                <button 
                                                    onClick={() => toggle(student.id, sub.id)}
                                                    className={cn(
                                                        "h-8 w-8 rounded-xl border transition-all flex items-center justify-center mx-auto",
                                                        isChecked 
                                                            ? 'bg-school-primary border-school-primary text-school-secondary-950 scale-110 shadow-[0_0_15px_rgba(var(--school-primary-rgb),0.3)]' 
                                                            : 'border-white/10 hover:border-school-primary/40 bg-slate-950/50'
                                                    )}
                                                >
                                                    {isChecked && <Check className="h-5 w-5 stroke-[4]" />}
                                                </button>
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}