'use client'

import { useState } from 'react'
import { Role } from '@prisma/client'
import { sendInviteAction, resendInviteAction } from '@/app/actions/invitations'
import {
     Trash2, Send, CheckCircle2,
    Loader2, AlertCircle, Plus, X, Info
} from 'lucide-react'
import { getErrorMessage } from '@/lib/error-handler'
import { useProfileStore } from '@/store/profileStore'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Shared Components
import { CSVImporter } from '@/components/shared/CSVImporter'
import { CSVTemplateButton } from '@/components/shared/CSVTemplateButton'

// ── Types ──────────────────────────────────────────────────────────────────────
type InviteRole = 'TEACHER' | 'STUDENT' | 'PARENT'

interface InviteRow {
    id: string
    email: string
    role: InviteRole
    name: string
    status: 'idle' | 'sending' | 'sent' | 'error'
    error?: string
}

interface InviteUsersClientProps {
    initialSchoolId: string;
    userRole: Role;
}

const ROLES: { value: InviteRole; label: string }[] = [
    { value: 'TEACHER', label: 'Teacher' },
    { value: 'STUDENT', label: 'Student' },
    { value: 'PARENT', label: 'Parent' },
]

const makeRow = (email = '', role: InviteRole = 'TEACHER', name = ''): InviteRow => ({
    id: crypto.randomUUID(),
    email,
    role,
    name,
    status: 'idle',
})

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * INSTITUTIONAL INVITATION CONSOLE (Tier 2)
 * Rule 17: Uses Zustand for school primary color branding.
 */
export function InviteUsersClient({ initialSchoolId }: InviteUsersClientProps) {
    const { profile } = useProfileStore();
    const primaryColor = profile?.primaryColor || "#f59e0b";
    
    const [rows, setRows] = useState<InviteRow[]>([makeRow()])
    const [isSending, setIsSending] = useState(false)

    // Row helpers
    const updateRow = (id: string, patch: Partial<InviteRow>) =>
        setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r))

    const removeRow = (id: string) =>
        setRows(prev => prev.length === 1 ? prev : prev.filter(r => r.id !== id))

    const addRow = () => setRows(prev => [...prev, makeRow()])

    const handleCsvData = (csvData: Record<string, string>[]) => {
        const newRows = csvData.map(row => {
            const rawRole = String(row.role || row.Role || 'TEACHER').toUpperCase()
            const role: InviteRole = ['TEACHER', 'STUDENT', 'PARENT'].includes(rawRole) 
                ? (rawRole as InviteRole) 
                : 'TEACHER'
            
            return makeRow(
                String(row.email || row.Email || '').trim(),
                role,
                String(row.name || row.Name || '').trim()
            )
        }).filter(r => r.email.length > 0)

        if (newRows.length > 0) {
            setRows(newRows)
            toast.success(`${newRows.length} identities staged from dataset.`);
        }
    }

    const handleSendAll = async () => {
        const hasInvalid = rows.some(r => !r.email.trim() || !EMAIL_REGEX.test(r.email))
        if (hasInvalid) return toast.error("Ensure all emails follow correct format.");

        setIsSending(true)
        for (const row of rows) {
            if (row.status === 'sent') continue
            updateRow(row.id, { status: 'sending', error: undefined })

            try {
                // Rule 15: Strict parameter syncing with sendInviteAction
                const result = await sendInviteAction({
                    email: row.email.trim(),
                    role: row.role as Role,
                    schoolId: initialSchoolId,
                })
                updateRow(row.id, { 
                    status: result.success ? 'sent' : 'error', 
                    error: result.error 
                })
            } catch (err: unknown) {
                updateRow(row.id, { status: 'error', error: getErrorMessage(err) })
            }
        }
        setIsSending(false)
    }

    const handleSingleResend = async (row: InviteRow) => {
        updateRow(row.id, { status: 'sending', error: undefined });
        const result = await resendInviteAction(row.email);
        updateRow(row.id, { 
            status: result.success ? 'sent' : 'error', 
            error: result.success ? undefined : (result.error || "Resend failed") 
        });
    }

    const allSent = rows.length > 0 && rows.every(r => r.status === 'sent')

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8 lg:p-12 text-slate-50 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto space-y-10">

                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Identity Dispatch</h1>
                        <p className="text-slate-500 text-sm mt-2 font-medium italic">Initialize institutional onboarding for {profile?.school?.name || "Institution"}.</p>
                    </div>
                    {rows.length > 1 && !allSent && (
                        <button onClick={() => setRows([makeRow()])} className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-red-400 transition-colors">
                            <X className="w-3 h-3 inline mr-1" /> Reset Registry
                        </button>
                    )}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <CSVImporter 
                            title="Import Access List"
                            description="Format: email, name, role (TEACHER, STUDENT, PARENT)"
                            expectedHeaders={["email"]}
                            onDataUpload={(data) => handleCsvData(data as Record<string, string>[])}
                        />
                    </div>
                    <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between shadow-2xl">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2" style={{ color: primaryColor }}>
                                <Info className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Protocol</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed italic">
                                Utilize the registry template to ensure precise identity synchronization.
                            </p>
                        </div>
                        <CSVTemplateButton 
                            fileName="registry_invite_template"
                            headers={["email", "name", "role"]}
                            sampleRow={["academic@school.com", "John Smith", "TEACHER"]}
                            className="w-full justify-center py-4 bg-slate-950 mt-6"
                        />
                    </div>
                </div>

                {!allSent && (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            {rows.map((row) => (
                                <InviteRowItem
                                    key={row.id}
                                    row={row}
                                    onUpdate={(patch) => updateRow(row.id, patch)}
                                    onRemove={() => removeRow(row.id)}
                                    onResend={() => handleSingleResend(row)}
                                    primaryColor={primaryColor}
                                />
                            ))}
                        </div>

                        <button onClick={addRow} className="w-full py-5 rounded-2xl border border-dashed border-white/5 bg-slate-900/30 hover:bg-white/5 text-slate-600 hover:text-school-primary text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" /> Add Identity Entry
                        </button>

                        <div className="flex justify-end pt-6">
                            <button
                                onClick={handleSendAll}
                                disabled={isSending}
                                className="bg-school-primary text-slate-950 font-black px-12 py-5 rounded-2xl hover:scale-105 transition-all disabled:opacity-30 shadow-2xl text-xs tracking-widest uppercase flex items-center gap-3"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                               Dispatch Registry Access
                            </button>
                        </div>
                    </div>
                )}

                {allSent && (
                    <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-20 flex flex-col items-center text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-500">
                        <div className="h-20 w-20 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-black uppercase italic text-white leading-none tracking-tighter">Invitations Transmitted</h2>
                        <button onClick={() => setRows([makeRow()])} className="bg-slate-800 text-white font-bold px-10 py-4 rounded-xl hover:bg-slate-700 transition-all text-[10px] uppercase tracking-widest">
                            New Identity Batch
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

function InviteRowItem({ row, onUpdate, onRemove, onResend, primaryColor }: { 
    row: InviteRow, 
    onUpdate: (patch: Partial<InviteRow>) => void, 
    onRemove: () => void, 
    onResend: () => void,
    primaryColor: string 
}) {
    const isSent = row.status === 'sent'
    const isError = row.status === 'error'
    const isSending = row.status === 'sending'

    return (
        <div className={cn(
            "p-2 rounded-2xl border transition-all duration-300",
            isSent ? "bg-emerald-500/5 border-emerald-500/20" : 
            isError ? "bg-red-500/5 border-red-500/20" : "bg-slate-900/50 border-white/5"
        )}>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_160px_48px] gap-3 items-center px-2">
                <input
                    type="email"
                    value={row.email}
                    onChange={e => onUpdate({ email: e.target.value, status: 'idle', error: undefined })}
                    disabled={isSent || isSending}
                    placeholder="identity@school.com"
                    className="bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-school-primary outline-none transition-all"
                />
                <input
                    type="text"
                    value={row.name}
                    onChange={e => onUpdate({ name: e.target.value })}
                    disabled={isSent || isSending}
                    placeholder="Registry Name"
                    className="bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-school-primary outline-none transition-all"
                />
                <div className="relative">
                    <select
                        value={row.role}
                        onChange={e => onUpdate({ role: e.target.value as InviteRole })}
                        disabled={isSent || isSending}
                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black text-slate-300 uppercase tracking-widest outline-none"
                    >
                        {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                </div>
                <div className="flex justify-center">
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" style={{ color: primaryColor }} /> :
                     isSent ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                     <button onClick={onRemove} className="p-2 text-slate-700 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                     </button>}
                </div>
            </div>
            {isError && (
                <div className="flex items-center justify-between mt-2 px-6 pb-2">
                    <p className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1.5 italic">
                        <AlertCircle className="h-3 w-3" /> {row.error}
                    </p>
                    <button onClick={onResend} className="text-[9px] font-black uppercase tracking-widest hover:underline" style={{ color: primaryColor }}>
                        Retry Transmission
                    </button>
                </div>
            )}
        </div>
    )
}