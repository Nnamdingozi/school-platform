"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useProfileStore } from "@/store/profileStore"
import { useSchool } from "@/context/schoolProvider"
import { inviteUser } from "@/app/actions/invites"
import { toast } from "sonner"
import {
    Users, GraduationCap, UserCircle, Plus, Trash2,
    Upload, Send, Loader2, CheckCircle2, XCircle,
    ChevronDown, ArrowLeft, Mail, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Role } from "@/generated/prisma/client"

// ── Types ────────────────────────────────────────────────────────────────────

type InviteRole = "TEACHER" | "STUDENT" | "PARENT"

interface InviteRow {
    id: string
    email: string
    name: string
    status: "idle" | "sending" | "success" | "error"
    error?: string
}

interface RoleTab {
    role: InviteRole
    label: string
    icon: React.ElementType
    description: string
    color: string
}

const ROLE_TABS: RoleTab[] = [
    {
        role: "TEACHER",
        label: "Teachers",
        icon: GraduationCap,
        description: "Teachers can manage classes, create lessons and grade assessments.",
        color: "text-blue-400",
    },
    {
        role: "STUDENT",
        label: "Students",
        icon: UserCircle,
        description: "Students can access lessons, take quizzes and view their grades.",
        color: "text-green-400",
    },
    {
        role: "PARENT",
        label: "Parents",
        icon: Users,
        description: "Parents receive WhatsApp feedback and can monitor their child's progress.",
        color: "text-amber-400",
    },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeRow(): InviteRow {
    return { id: crypto.randomUUID(), email: "", name: "", status: "idle" }
}

function parseCSV(text: string): InviteRow[] {
    return text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [email = "", name = ""] = line.split(",").map((s) => s.trim())
            return { id: crypto.randomUUID(), email, name, status: "idle" as const }
        })
        .filter((r) => r.email.includes("@"))
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function InviteUsersPage() {
    const router = useRouter()
    const { profile } = useProfileStore()
    const { school } = useSchool()

    const [activeRole, setActiveRole] = useState<InviteRole>("TEACHER")
    const [rows, setRows] = useState<Record<InviteRole, InviteRow[]>>({
        TEACHER: [makeRow()],
        STUDENT: [makeRow()],
        PARENT: [makeRow()],
    })
    const [isSending, setIsSending] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const currentRows = rows[activeRole]
    const validRows = currentRows.filter((r) => r.email.includes("@"))
    const sentCount = currentRows.filter((r) => r.status === "success").length
    const errorCount = currentRows.filter((r) => r.status === "error").length

    // ── Row mutations ──────────────────────────────────────────────────────

    function addRow() {
        setRows((prev) => ({
            ...prev,
            [activeRole]: [...prev[activeRole], makeRow()],
        }))
    }

    function removeRow(id: string) {
        setRows((prev) => ({
            ...prev,
            [activeRole]: prev[activeRole].filter((r) => r.id !== id),
        }))
    }

    function updateRow(id: string, field: "email" | "name", value: string) {
        setRows((prev) => ({
            ...prev,
            [activeRole]: prev[activeRole].map((r) =>
                r.id === id ? { ...r, [field]: value, status: "idle", error: undefined } : r
            ),
        }))
    }

    function clearAll() {
        setRows((prev) => ({ ...prev, [activeRole]: [makeRow()] }))
    }

    // ── CSV import ─────────────────────────────────────────────────────────

    function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            const text = ev.target?.result as string
            const parsed = parseCSV(text)
            if (parsed.length === 0) {
                toast.error("No valid emails found in the file.")
                return
            }
            setRows((prev) => ({
                ...prev,
                [activeRole]: [...prev[activeRole].filter((r) => r.email), ...parsed],
            }))
            toast.success(`Imported ${parsed.length} rows`)
        }
        reader.readAsText(file)
        e.target.value = ""
    }

    // ── Send invites ───────────────────────────────────────────────────────

    async function handleSendInvites() {
        if (!profile || !school) return
        if (validRows.length === 0) {
            toast.error("Add at least one valid email address.")
            return
        }

        setIsSending(true)

        // Process sequentially to avoid rate limits
        for (const row of validRows) {
            // Mark as sending
            setRows((prev) => ({
                ...prev,
                [activeRole]: prev[activeRole].map((r) =>
                    r.id === row.id ? { ...r, status: "sending" } : r
                ),
            }))

            const result = await inviteUser({
                email: row.email,
                role: activeRole,
                schoolId: school.id,
                schoolName: school.name,
                invitedByName: profile.name ?? "Admin",
            })

            setRows((prev) => ({
                ...prev,
                [activeRole]: prev[activeRole].map((r) =>
                    r.id === row.id
                        ? {
                            ...r,
                            status: result.success ? "success" : "error",
                            error: result.error,
                        }
                        : r
                ),
            }))
        }

        setIsSending(false)

        const successCount = validRows.length - errorCount
        if (successCount > 0) {
            toast.success(`${successCount} invite${successCount > 1 ? "s" : ""} sent successfully!`)
        }
        if (errorCount > 0) {
            toast.error(`${errorCount} invite${errorCount > 1 ? "s" : ""} failed. Check the errors below.`)
        }
    }

    const activeTab = ROLE_TABS.find((t) => t.role === activeRole)!

    return (
        <div className="min-h-screen bg-school-secondary-950 p-4 md:p-8">
            <div className="mx-auto max-w-4xl space-y-6">

                {/* ── Page Header ────────────────────────────────────────── */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-school-secondary-700 bg-school-secondary-900 text-school-secondary-100/50 hover:text-school-primary hover:border-school-primary/30 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-school-secondary-100 tracking-tight">
                            Invite Users
                        </h1>
                        <p className="text-xs text-school-secondary-100/40 mt-0.5">
                            {school?.name ?? "Your School"} · Invites are sent via email
                        </p>
                    </div>
                </div>

                {/* ── Role Tabs ───────────────────────────────────────────── */}
                <div className="grid grid-cols-3 gap-2">
                    {ROLE_TABS.map((tab) => {
                        const Icon = tab.icon
                        const count = rows[tab.role].filter((r) => r.email.includes("@")).length
                        const isActive = activeRole === tab.role

                        return (
                            <button
                                key={tab.role}
                                onClick={() => setActiveRole(tab.role)}
                                className={cn(
                                    "relative flex flex-col items-center gap-1.5 rounded-xl border p-3 sm:p-4 transition-all duration-200",
                                    isActive
                                        ? "bg-school-secondary-900 border-school-primary/40 shadow-lg shadow-school-primary/5"
                                        : "bg-school-secondary-900/50 border-school-secondary-700 hover:border-school-secondary-600"
                                )}
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-12 rounded-full bg-school-primary" />
                                )}

                                <Icon className={cn("h-5 w-5", isActive ? tab.color : "text-school-secondary-100/30")} />
                                <span className={cn(
                                    "text-xs font-bold",
                                    isActive ? "text-school-secondary-100" : "text-school-secondary-100/40"
                                )}>
                                    {tab.label}
                                </span>

                                {/* Pending count badge */}
                                {count > 0 && (
                                    <span className={cn(
                                        "absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full text-[10px] font-black flex items-center justify-center",
                                        isActive
                                            ? "bg-school-primary text-school-secondary-950"
                                            : "bg-school-secondary-700 text-school-secondary-100/60"
                                    )}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* ── Main Card ───────────────────────────────────────────── */}
                <div className="rounded-2xl border border-school-secondary-700 bg-school-secondary-900 overflow-hidden">

                    {/* Card header */}
                    <div className="flex items-center justify-between border-b border-school-secondary-700 px-5 py-4">
                        <div>
                            <p className="text-sm font-bold text-school-secondary-100">
                                {activeTab.label} Invitations
                            </p>
                            <p className="text-xs text-school-secondary-100/40 mt-0.5">
                                {activeTab.description}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* CSV import */}
                            <input
                                ref={fileRef}
                                type="file"
                                accept=".csv,.txt"
                                className="hidden"
                                onChange={handleFileImport}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => fileRef.current?.click()}
                                className="text-xs text-school-secondary-100/50 hover:text-school-primary hover:bg-school-secondary-800 gap-1.5"
                            >
                                <Upload className="h-3.5 w-3.5" />
                                Import CSV
                            </Button>

                            {/* Clear all */}
                            {currentRows.length > 1 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearAll}
                                    className="text-xs text-red-400/60 hover:text-red-400 hover:bg-school-secondary-800 gap-1.5"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* CSV format hint */}
                    <div className="px-5 py-2.5 bg-school-secondary-800/40 border-b border-school-secondary-700/50">
                        <p className="text-[11px] text-school-secondary-100/30">
                            CSV format: <span className="text-school-secondary-100/50 font-mono">email@example.com, Full Name</span>
                            &nbsp;— one per line. Name is optional.
                        </p>
                    </div>

                    {/* Column headers */}
                    <div className="grid grid-cols-12 gap-3 px-5 py-2.5 border-b border-school-secondary-700/50">
                        <p className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-school-secondary-100/30">#</p>
                        <p className="col-span-5 text-[10px] font-bold uppercase tracking-widest text-school-secondary-100/30">Email</p>
                        <p className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-school-secondary-100/30">Name (optional)</p>
                        <p className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-school-secondary-100/30 text-right">Status</p>
                    </div>

                    {/* Invite rows */}
                    <div className="divide-y divide-school-secondary-700/30 max-h-[420px] overflow-y-auto">
                        {currentRows.map((row, index) => (
                            <div
                                key={row.id}
                                className={cn(
                                    "grid grid-cols-12 gap-3 items-center px-5 py-2.5 transition-colors",
                                    row.status === "success" && "bg-green-500/5",
                                    row.status === "error" && "bg-red-500/5",
                                    row.status === "sending" && "bg-school-secondary-800/50",
                                )}
                            >
                                {/* Row number */}
                                <span className="col-span-1 text-xs text-school-secondary-100/20 font-mono">
                                    {index + 1}
                                </span>

                                {/* Email input */}
                                <div className="col-span-5">
                                    <Input
                                        type="email"
                                        value={row.email}
                                        onChange={(e) => updateRow(row.id, "email", e.target.value)}
                                        placeholder="email@example.com"
                                        disabled={row.status === "sending" || row.status === "success"}
                                        className={cn(
                                            "h-8 text-xs bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-100/20",
                                            "focus:border-school-primary",
                                            row.status === "error" && "border-red-500/50",
                                            row.status === "success" && "border-green-500/50",
                                        )}
                                    />
                                </div>

                                {/* Name input */}
                                <div className="col-span-4">
                                    <Input
                                        type="text"
                                        value={row.name}
                                        onChange={(e) => updateRow(row.id, "name", e.target.value)}
                                        placeholder="Full name"
                                        disabled={row.status === "sending" || row.status === "success"}
                                        className="h-8 text-xs bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-100/20 focus:border-school-primary"
                                    />
                                </div>

                                {/* Status + remove */}
                                <div className="col-span-2 flex items-center justify-end gap-1.5">
                                    {row.status === "idle" && (
                                        <button
                                            onClick={() => removeRow(row.id)}
                                            disabled={currentRows.length === 1}
                                            className="text-school-secondary-100/20 hover:text-red-400 transition-colors disabled:opacity-0"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                    {row.status === "sending" && (
                                        <Loader2 className="h-4 w-4 text-school-primary animate-spin" />
                                    )}
                                    {row.status === "success" && (
                                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                                    )}
                                    {row.status === "error" && (
                                        <div className="flex items-center gap-1" title={row.error}>
                                            <XCircle className="h-4 w-4 text-red-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Error message below row */}
                                {row.status === "error" && row.error && (
                                    <div className="col-span-12 -mt-1 pb-1">
                                        <p className="text-[10px] text-red-400/80 pl-8">
                                            {row.error}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add row button */}
                    <div className="border-t border-school-secondary-700/50 px-5 py-3">
                        <button
                            onClick={addRow}
                            className="flex items-center gap-2 text-xs text-school-secondary-100/40 hover:text-school-primary transition-colors"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add another row
                        </button>
                    </div>
                </div>

                {/* ── Summary + Send ──────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-school-secondary-700 bg-school-secondary-900 px-5 py-4">

                    {/* Summary counts */}
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-school-secondary-100/30" />
                            <span className="text-school-secondary-100/50">
                                <span className="font-bold text-school-secondary-100">{validRows.length}</span> ready to send
                            </span>
                        </div>
                        {sentCount > 0 && (
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                                <span className="text-green-400 font-semibold">{sentCount} sent</span>
                            </div>
                        )}
                        {errorCount > 0 && (
                            <div className="flex items-center gap-1.5">
                                <XCircle className="h-3.5 w-3.5 text-red-400" />
                                <span className="text-red-400 font-semibold">{errorCount} failed</span>
                            </div>
                        )}
                    </div>

                    {/* Send button */}
                    <Button
                        onClick={handleSendInvites}
                        disabled={isSending || validRows.length === 0}
                        className={cn(
                            "bg-school-primary text-school-secondary-950 font-bold hover:bg-school-primary/90",
                            "transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                            "disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 gap-2"
                        )}
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending invites...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Send {validRows.length > 0 ? `${validRows.length} ` : ""}
                                {activeTab.label} Invite{validRows.length !== 1 ? "s" : ""}
                            </>
                        )}
                    </Button>
                </div>

                {/* ── All-role summary ────────────────────────────────────── */}
                {(Object.values(rows).flat().filter(r => r.status === "success").length > 0) && (
                    <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-5 py-4">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                            <p className="text-sm font-bold text-green-400">Invitations sent successfully</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {ROLE_TABS.map((tab) => {
                                const count = rows[tab.role].filter((r) => r.status === "success").length
                                if (count === 0) return null
                                const Icon = tab.icon
                                return (
                                    <div key={tab.role} className="flex items-center gap-1.5 text-xs text-school-secondary-100/60">
                                        <Icon className={cn("h-3.5 w-3.5", tab.color)} />
                                        <span className="font-semibold">{count}</span> {tab.label.toLowerCase()}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
