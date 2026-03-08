'use client'

import { useState, useRef, useCallback } from 'react'
import { Role } from '@prisma/client'
import { sendInviteAction, resendInviteAction } from '@/app/actions/invitation.actions'
import {
    UserPlus, Upload, Trash2, Send, CheckCircle2,
    XCircle, Loader2, AlertCircle, Plus, X, Download
} from 'lucide-react'
import Papa, { ParseResult } from 'papaparse'
import { getErrorMessage } from '@/lib/error-handler'
import { useProfileStore } from '@/store/profileStore'

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

interface CSVRow {
    email?: string
    Email?: string
    name?: string
    Name?: string
    role?: string
    Role?: string
}

const ROLES: { value: InviteRole; label: string }[] = [
    { value: 'TEACHER', label: 'Teacher' },
    { value: 'STUDENT', label: 'Student' },
    { value: 'PARENT', label: 'Parent' },
]

const VALID_ROLES = new Set<InviteRole>(['TEACHER', 'STUDENT', 'PARENT'])

const isValidInviteRole = (value: string): value is InviteRole =>
    VALID_ROLES.has(value as InviteRole)

const makeRow = (
    email = '',
    role: InviteRole = 'TEACHER',
    name = ''
): InviteRow => ({
    id: crypto.randomUUID(),
    email,
    role,
    name,
    status: 'idle',
})

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ── Main Component ─────────────────────────────────────────────────────────────
export default function InviteUsersPage() {
    const [rows, setRows] = useState<InviteRow[]>([makeRow()])
    const [sending, setSending] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { profile } = useProfileStore()
    const schoolId = profile?.schoolId ?? ''

    // ── Row helpers ────────────────────────────────────────────────────────────
    const updateRow = (id: string, patch: Partial<InviteRow>) =>
        setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r))

    const removeRow = (id: string) =>
        setRows(prev => prev.length === 1 ? prev : prev.filter(r => r.id !== id))

    const addRow = () => setRows(prev => [...prev, makeRow()])

    const clearAll = () => setRows([makeRow()])

    // ── CSV parsing ────────────────────────────────────────────────────────────
    const parseCSV = useCallback((file: File) => {
        Papa.parse<CSVRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results: ParseResult<CSVRow>) => {
                const parsed = results.data
                    .map((row): InviteRow => {
                        const rawRole = String(row.role ?? row.Role ?? 'TEACHER').toUpperCase()
                        const role: InviteRole = isValidInviteRole(rawRole) ? rawRole : 'TEACHER'
                        return makeRow(
                            String(row.email ?? row.Email ?? '').trim(),
                            role,
                            String(row.name ?? row.Name ?? '').trim(),
                        )
                    })
                    .filter((r): boolean => r.email.length > 0)

                if (parsed.length > 0) setRows(parsed)
            },
            error: () => alert('Failed to parse CSV. Please check the format.'),
        })
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) parseCSV(file)
        e.target.value = ''
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files?.[0]
        if (file?.name.endsWith('.csv')) parseCSV(file)
    }

    // ── Download CSV template ──────────────────────────────────────────────────
    const downloadTemplate = () => {
        const csv = 'email,name,role\njohn@school.com,John Doe,TEACHER\njane@school.com,Jane Smith,STUDENT'
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'invite-template.csv'
        a.click()
        URL.revokeObjectURL(url)
    }

    // ── Send invites ───────────────────────────────────────────────────────────
    const handleSendAll = async () => {
        // Validate all rows first
        const hasErrors = rows.some(r =>
            !r.email.trim() || !EMAIL_REGEX.test(r.email)
        )

        if (hasErrors) {
            setRows(prev => prev.map((r): InviteRow => {
                const isEmpty = !r.email.trim()
                const isInvalid = !isEmpty && !EMAIL_REGEX.test(r.email)
                if (isEmpty || isInvalid) {
                    return {
                        ...r,
                        status: 'error',
                        error: isEmpty ? 'Email is required' : 'Invalid email address',
                    }
                }
                return r
            }))
            return
        }

        setSending(true)

        for (const row of rows) {
            if (row.status === 'sent') continue

            updateRow(row.id, { status: 'sending', error: undefined })

            try {
                await sendInviteAction({
                    email: row.email.trim(),
                    role: row.role as Role,
                    schoolId,
                })
                updateRow(row.id, { status: 'sent' })
            } catch (err: unknown) {
                updateRow(row.id, {
                    status: 'error',
                    error: getErrorMessage(err),
                })
            }

            // Small delay to avoid rate limits
            await new Promise<void>(resolve => setTimeout(resolve, 300))
        }

        setSending(false)
    }

    const handleResend = async (row: InviteRow) => {
        updateRow(row.id, { status: 'sending', error: undefined })
        try {
            await resendInviteAction(row.email)
            updateRow(row.id, { status: 'sent' })
        } catch (err: unknown) {
            updateRow(row.id, {
                status: 'error',
                error: getErrorMessage(err),
            })
        }
    }

    // ── Derived state ──────────────────────────────────────────────────────────
    const sentCount = rows.filter(r => r.status === 'sent').length
    const errorCount = rows.filter(r => r.status === 'error').length
    const pendingCount = rows.filter(r => r.status === 'idle').length
    const allSent = rows.length > 0 && sentCount === rows.length

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0f172a] p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* ── Header ── */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">
                            Invite Users
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Invite teachers, students, or parents to your school.
                        </p>
                    </div>
                    {rows.length > 1 && (
                        <button
                            onClick={clearAll}
                            className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
                        >
                            <X className="w-3 h-3" /> Clear all
                        </button>
                    )}
                </div>

                {/* ── Summary bar ── */}
                {(sentCount > 0 || errorCount > 0) && (
                    <div className="flex items-center gap-3 flex-wrap">
                        {sentCount > 0 && (
                            <div className="flex items-center gap-1.5 text-sm text-green-400">
                                <CheckCircle2 className="w-4 h-4" />
                                {sentCount} invite{sentCount > 1 ? 's' : ''} sent
                            </div>
                        )}
                        {errorCount > 0 && (
                            <div className="flex items-center gap-1.5 text-sm text-red-400">
                                <XCircle className="w-4 h-4" />
                                {errorCount} failed
                            </div>
                        )}
                        {pendingCount > 0 && (
                            <div className="flex items-center gap-1.5 text-sm text-slate-400">
                                <AlertCircle className="w-4 h-4" />
                                {pendingCount} pending
                            </div>
                        )}
                    </div>
                )}

                {/* ── CSV Upload area ── */}
                <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`
                        relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200
                        ${dragOver
                            ? 'border-[#f59e0b] bg-[#f59e0b]/5'
                            : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
                        }
                    `}
                >
                    <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-300 font-medium">
                        Drag & drop a CSV file here
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        or{' '}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[#f59e0b] hover:underline font-medium"
                        >
                            browse to upload
                        </button>
                    </p>
                    <p className="text-[11px] text-slate-600 mt-2">
                        CSV columns: <span className="font-mono">email, name, role</span>
                        {' · '}
                        <button
                            onClick={downloadTemplate}
                            className="text-slate-500 hover:text-slate-300 inline-flex items-center gap-1 transition-colors"
                        >
                            <Download className="w-3 h-3" />
                            Download template
                        </button>
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                {/* ── Invite rows ── */}
                <div className="space-y-3">
                    <div className="hidden sm:grid sm:grid-cols-[1fr_160px_36px] gap-3 px-1">
                        <div className="grid grid-cols-2 gap-3">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Email
                            </p>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Name (optional)
                            </p>
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Role
                        </p>
                    </div>

                    {rows.map((row, index) => (
                        <InviteRowItem
                            key={row.id}
                            row={row}
                            index={index}
                            totalRows={rows.length}
                            onUpdate={patch => updateRow(row.id, patch)}
                            onRemove={() => removeRow(row.id)}
                            onResend={() => handleResend(row)}
                        />
                    ))}
                </div>

                {/* ── Add row ── */}
                {!allSent && (
                    <button
                        onClick={addRow}
                        className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 text-slate-500 hover:text-slate-300 text-sm flex items-center justify-center gap-2 transition-all duration-200"
                    >
                        <Plus className="w-4 h-4" />
                        Add another user
                    </button>
                )}

                {/* ── Send button ── */}
                {!allSent && (
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleSendAll}
                            disabled={sending || rows.every(r => r.status === 'sent')}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Sending invites...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Send {rows.filter(r => r.status !== 'sent').length} Invite
                                    {rows.filter(r => r.status !== 'sent').length !== 1 ? 's' : ''}
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* ── All sent state ── */}
                {allSent && (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                        <div className="bg-green-500/10 p-4 rounded-full">
                            <CheckCircle2 className="w-8 h-8 text-green-400" />
                        </div>
                        <p className="text-white font-bold text-lg">All invites sent!</p>
                        <p className="text-slate-400 text-sm text-center">
                            Users will receive an email with a link to set up their account.
                        </p>
                        <button
                            onClick={clearAll}
                            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 text-sm font-medium transition-all"
                        >
                            <UserPlus className="w-4 h-4" />
                            Invite more users
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Individual row component ───────────────────────────────────────────────────
interface InviteRowItemProps {
    row: InviteRow
    index: number
    totalRows: number
    onUpdate: (patch: Partial<InviteRow>) => void
    onRemove: () => void
    onResend: () => void
}

function InviteRowItem({
    row, index, totalRows, onUpdate, onRemove, onResend
}: InviteRowItemProps) {
    const isSent = row.status === 'sent'
    const isError = row.status === 'error'
    const isSending = row.status === 'sending'

    return (
        <div className={`
            rounded-xl border transition-all duration-200
            ${isSent ? 'border-green-500/20 bg-green-500/5' : ''}
            ${isError ? 'border-red-500/20 bg-red-500/5' : ''}
            ${!isSent && !isError ? 'border-slate-700 bg-slate-800/50' : ''}
        `}>
            <div className="p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px_36px] gap-3 items-start">

                    {/* Email + Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="sm:hidden text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                                Email
                            </label>
                            <input
                                type="email"
                                value={row.email}
                                onChange={e => onUpdate({ email: e.target.value, status: 'idle', error: undefined })}
                                disabled={isSent || isSending}
                                placeholder="user@email.com"
                                className={`
                                    w-full px-3 py-2 rounded-lg text-sm border bg-slate-900 text-white
                                    placeholder:text-slate-600 focus:outline-none transition-colors
                                    disabled:opacity-60 disabled:cursor-not-allowed
                                    ${isError ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-[#f59e0b]'}
                                    ${isSent ? 'border-green-500/30' : ''}
                                `}
                            />
                        </div>

                        <div>
                            <label className="sm:hidden text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                                Name (optional)
                            </label>
                            <input
                                type="text"
                                value={row.name}
                                onChange={e => onUpdate({ name: e.target.value })}
                                disabled={isSent || isSending}
                                placeholder="Full name"
                                className="w-full px-3 py-2 rounded-lg text-sm border border-slate-700 bg-slate-900 text-white placeholder:text-slate-600 focus:border-[#f59e0b] focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Role selector */}
                    <div>
                        <label className="sm:hidden text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                            Role
                        </label>
                        <select
                            value={row.role}
                            onChange={e => onUpdate({ role: e.target.value as InviteRole })}
                            disabled={isSent || isSending}
                            className="w-full px-3 py-2 rounded-lg text-sm border border-slate-700 bg-slate-900 text-white focus:border-[#f59e0b] focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {ROLES.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status / Remove */}
                    <div className="flex items-center justify-end sm:justify-center h-full pt-1 sm:pt-0">
                        {isSending && (
                            <Loader2 className="w-4 h-4 text-[#f59e0b] animate-spin" />
                        )}
                        {isSent && (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                        )}
                        {!isSent && !isSending && (
                            <button
                                onClick={onRemove}
                                disabled={totalRows === 1}
                                className="p-1 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-0 disabled:pointer-events-none"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Error message + resend */}
                {isError && (
                    <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="text-xs text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            {row.error}
                        </p>
                        <button
                            onClick={onResend}
                            className="text-xs text-[#f59e0b] hover:underline font-medium shrink-0"
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}