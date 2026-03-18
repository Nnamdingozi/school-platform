'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useProfileStore } from '@/store/profileStore'
import {
    getSchoolSettings,
    updateSchoolProfile,
    updateCurriculumLabels,
    bulkUpdateTermDates,
    updateTermDates,
    clearTermDates,
    updateWhatsAppCredits,
    SchoolSettingsData,
} from '@/app/actions/school-settings.action'
import {
    Settings, School, Calendar, BookOpen,
    MessageCircle, CreditCard, Loader2, Save,
    AlertTriangle, Eye, X, CheckCircle2,
    RefreshCw, ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// ── Types ──────────────────────────────────────────────────────────────────────
type Tab = 'profile' | 'terms' | 'curriculum' | 'whatsapp' | 'billing'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile',    label: 'School Profile',    icon: School        },
    { id: 'terms',      label: 'Term Dates',         icon: Calendar      },
    { id: 'curriculum', label: 'Curriculum Labels',  icon: BookOpen      },
    { id: 'whatsapp',   label: 'WhatsApp',           icon: MessageCircle },
    { id: 'billing',    label: 'Billing',            icon: CreditCard    },
]

// ── Format date for input ──────────────────────────────────────────────────────
function toInputDate(date: Date | null): string {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
}

function formatDate(date: Date | null): string {
    if (!date) return 'Not set'
    return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
    })
}

// ── Plan badge color ───────────────────────────────────────────────────────────
// function getPlanColor(status: string) {
//     switch (status.toLowerCase()) {
//         case 'active':   return 'text-green-400 bg-green-500/10 border-green-500/20'
//         case 'trialing': return 'text-school-primary bg-school-primary/10 border-school-primary/20'
//         case 'past_due': return 'text-red-400 bg-red-500/10 border-red-500/20'
//         default:         return 'text-school-secondary-400 bg-school-secondary-800 border-school-secondary-700'
//     }
// }

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function SettingsPage() {
    const router       = useRouter()
    const searchParams = useSearchParams()
    const { profile }  = useProfileStore()
    const schoolId     = profile?.schoolId ?? ''

    const initialTab = (searchParams.get('tab') as Tab) ?? 'profile'
    const [activeTab, setActiveTab] = useState<Tab>(initialTab)
    const [data,      setData]      = useState<SchoolSettingsData | null>(null)
    const [loading,   setLoading]   = useState(true)

    // ── Fetch settings ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!schoolId) return
        setLoading(true)
        getSchoolSettings(schoolId)
            .then(d => { setData(d); setLoading(false) })
            .catch(() => { toast.error('Failed to load settings.'); setLoading(false) })
    }, [schoolId])

    // ── Sync tab from URL ──────────────────────────────────────────────────
    function handleTabChange(tab: Tab) {
        setActiveTab(tab)
        router.replace(`/admin/settings?tab=${tab}`, { scroll: false })
    }

    function handleDataUpdate(updated: Partial<SchoolSettingsData>) {
        setData(prev => prev ? { ...prev, ...updated } : prev)
    }

    // ── Loading ────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen bg-school-secondary-950 flex items-center justify-center">
            <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-school-primary" />
                <span className="text-sm text-school-secondary-400">Loading settings...</span>
            </div>
        </div>
    )

    if (!data) return (
        <div className="min-h-screen bg-school-secondary-950 flex items-center justify-center">
            <div className="text-center space-y-2">
                <AlertTriangle className="h-8 w-8 text-red-400 mx-auto" />
                <p className="text-white font-bold">Failed to load settings</p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-sm text-school-primary hover:underline"
                >
                    Try again
                </button>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-school-secondary-950 p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* ── Page header ── */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20">
                        <Settings className="h-5 w-5 text-school-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight">
                            School Settings
                        </h1>
                        <p className="text-xs text-school-secondary-400 mt-0.5">
                            Manage your school configuration
                        </p>
                    </div>
                </div>

                {/* ── Tab nav ── */}
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                    {TABS.map(tab => {
                        const Icon     = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                    isActive
                                        ? 'bg-school-primary text-school-secondary-950'
                                        : 'text-school-secondary-300 hover:text-white hover:bg-school-secondary-800'
                                }`}
                            >
                                <Icon className="h-3.5 w-3.5 shrink-0" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        )
                    })}
                </div>

                {/* ── Tab content ── */}
                {activeTab === 'profile' && (
                    <ProfileTab
                        data={data}
                        schoolId={schoolId}
                        onUpdate={handleDataUpdate}
                    />
                )}
                {activeTab === 'terms' && (
                    <TermsTab
                        data={data}
                        schoolId={schoolId}
                        onUpdate={handleDataUpdate}
                    />
                )}
                {activeTab === 'curriculum' && (
                    <CurriculumTab
                        data={data}
                        schoolId={schoolId}
                        onUpdate={handleDataUpdate}
                    />
                )}
                {activeTab === 'whatsapp' && (
                    <WhatsAppTab
                        data={data}
                        schoolId={schoolId}
                        onUpdate={handleDataUpdate}
                    />
                )}
                {activeTab === 'billing' && (
                    <BillingTab data={data} />
                )}

            </div>
        </div>
    )
}

// ── Shared types ───────────────────────────────────────────────────────────────
interface TabProps {
    data:     SchoolSettingsData
    schoolId: string
    onUpdate: (updated: Partial<SchoolSettingsData>) => void
}

// ── Section wrapper ────────────────────────────────────────────────────────────
function SettingsSection({
    title,
    description,
    children,
    onSave,
    saving,
    saved,
}: {
    title:       string
    description: string
    children:    React.ReactNode
    onSave?:     () => void
    saving?:     boolean
    saved?:      boolean
}) {
    return (
        <Card className="bg-school-secondary-900 border-school-secondary-700">
            <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-sm font-bold text-white">
                            {title}
                        </CardTitle>
                        <p className="text-xs text-school-secondary-400 mt-0.5">
                            {description}
                        </p>
                    </div>
                    {onSave && (
                        <Button
                            onClick={onSave}
                            disabled={saving}
                            size="sm"
                            className="h-8 px-3 text-xs bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold shrink-0"
                        >
                            {saving ? (
                                <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Saving...</>
                            ) : saved ? (
                                <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Saved</>
                            ) : (
                                <><Save className="h-3.5 w-3.5 mr-1.5" /> Save</>
                            )}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                {children}
            </CardContent>
        </Card>
    )
}

// ── Profile Tab ────────────────────────────────────────────────────────────────
function ProfileTab({ data, schoolId, onUpdate }: TabProps) {
    const [name,           setName]           = useState(data.school.name)
    const [primaryColor,   setPrimaryColor]   = useState(data.school.primaryColor)
    const [secondaryColor, setSecondaryColor] = useState(data.school.secondaryColor)
    const [saving,         setSaving]         = useState(false)
    const [saved,          setSaved]          = useState(false)

    // Live preview — update CSS variables instantly
    useEffect(() => {
        document.documentElement.style.setProperty('--school-primary', primaryColor)
        document.documentElement.style.setProperty('--school-secondary', secondaryColor)
    }, [primaryColor, secondaryColor])

    // Reset preview on unmount if not saved
    const savedRef = useRef(false)
    useEffect(() => {
        return () => {
            if (!savedRef.current) {
                document.documentElement.style.setProperty('--school-primary', data.school.primaryColor)
                document.documentElement.style.setProperty('--school-secondary', data.school.secondaryColor)
            }
        }
    }, [data.school.primaryColor, data.school.secondaryColor])

    async function handleSave() {
        setSaving(true)
        const result = await updateSchoolProfile(schoolId, {
            name, primaryColor, secondaryColor,
        })
        if (result.success) {
            savedRef.current = true
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
            onUpdate({
                school: {
                    ...data.school,
                    name, primaryColor, secondaryColor,
                },
            })
            toast.success('School profile updated.')
        } else {
            toast.error(result.error ?? 'Failed to update profile.')
        }
        setSaving(false)
    }

    return (
        <div className="space-y-4">
            <SettingsSection
                title="School Name"
                description="The name displayed across the platform."
                onSave={handleSave}
                saving={saving}
                saved={saved}
            >
                <div className="space-y-1.5 max-w-md">
                    <Label className="text-xs text-school-secondary-400 uppercase tracking-wider font-semibold">
                        School Name
                    </Label>
                    <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter school name"
                        className="bg-school-secondary-800 border-school-secondary-700 text-white placeholder:text-school-secondary-500 focus:border-school-primary"
                    />
                </div>
            </SettingsSection>

            <SettingsSection
                title="Brand Colors"
                description="Colors used throughout your school's interface. Changes preview instantly."
                onSave={handleSave}
                saving={saving}
                saved={saved}
            >
                <div className="space-y-4">
                    {/* Color pickers */}
                    <div className="grid gap-4 sm:grid-cols-2">

                        {/* Primary */}
                        <div className="space-y-2">
                            <Label className="text-xs text-school-secondary-400 uppercase tracking-wider font-semibold">
                                Primary Color
                            </Label>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={e => setPrimaryColor(e.target.value)}
                                        className="h-10 w-10 cursor-pointer rounded-lg border border-school-secondary-700 bg-transparent p-0.5"
                                    />
                                </div>
                                <Input
                                    value={primaryColor}
                                    onChange={e => setPrimaryColor(e.target.value)}
                                    placeholder="#f59e0b"
                                    maxLength={7}
                                    className="flex-1 font-mono text-sm bg-school-secondary-800 border-school-secondary-700 text-white focus:border-school-primary"
                                />
                                <button
                                    onClick={() => setPrimaryColor(data.school.primaryColor)}
                                    className="text-school-secondary-400 hover:text-white transition-colors"
                                    title="Reset to original"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </button>
                            </div>
                            <div
                                className="h-6 w-full rounded-lg border border-school-secondary-700"
                                style={{ backgroundColor: primaryColor }}
                            />
                        </div>

                        {/* Secondary */}
                        <div className="space-y-2">
                            <Label className="text-xs text-school-secondary-400 uppercase tracking-wider font-semibold">
                                Secondary Color
                            </Label>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <input
                                        type="color"
                                        value={secondaryColor}
                                        onChange={e => setSecondaryColor(e.target.value)}
                                        className="h-10 w-10 cursor-pointer rounded-lg border border-school-secondary-700 bg-transparent p-0.5"
                                    />
                                </div>
                                <Input
                                    value={secondaryColor}
                                    onChange={e => setSecondaryColor(e.target.value)}
                                    placeholder="#1e293b"
                                    maxLength={7}
                                    className="flex-1 font-mono text-sm bg-school-secondary-800 border-school-secondary-700 text-white focus:border-school-primary"
                                />
                                <button
                                    onClick={() => setSecondaryColor(data.school.secondaryColor)}
                                    className="text-school-secondary-400 hover:text-white transition-colors"
                                    title="Reset to original"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </button>
                            </div>
                            <div
                                className="h-6 w-full rounded-lg border border-school-secondary-700"
                                style={{ backgroundColor: secondaryColor }}
                            />
                        </div>

                    </div>

                    {/* Live preview */}
                    <div className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-4 space-y-2">
                        <div className="flex items-center gap-2 mb-3">
                            <Eye className="h-3.5 w-3.5 text-school-secondary-400" />
                            <span className="text-xs font-semibold text-school-secondary-400 uppercase tracking-wider">
                                Live Preview
                            </span>
                        </div>
                        <div
                            className="rounded-lg p-3 flex items-center justify-between"
                            style={{ backgroundColor: secondaryColor }}
                        >
                            <span
                                className="text-sm font-bold"
                                style={{ color: primaryColor }}
                            >
                                {name || 'School Name'}
                            </span>
                            <div
                                className="h-7 w-7 rounded-lg flex items-center justify-center text-xs font-black"
                                style={{ backgroundColor: primaryColor, color: secondaryColor }}
                            >
                                {(name || 'S').charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div
                                className="flex-1 h-8 rounded-lg text-xs font-bold flex items-center justify-center"
                                style={{ backgroundColor: primaryColor, color: secondaryColor }}
                            >
                                Primary Button
                            </div>
                            <div
                                className="flex-1 h-8 rounded-lg text-xs font-semibold flex items-center justify-center border"
                                style={{
                                    color:            primaryColor,
                                    borderColor:      primaryColor,
                                    backgroundColor:  'transparent',
                                }}
                            >
                                Outline Button
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsSection>
        </div>
    )
}

// ── Terms Tab ──────────────────────────────────────────────────────────────────
function TermsTab({ data, onUpdate }: TabProps) {
    // Group terms by grade
    const termsByGrade = data.terms.reduce<Record<string, typeof data.terms>>((acc, term) => {
        const key = term.grade.displayName
        if (!acc[key]) acc[key] = []
        acc[key].push(term)
        return acc
    }, {})

    // Local date state per term
    const [dates, setDates] = useState<Record<string, { start: string; end: string }>>(
        () => Object.fromEntries(
            data.terms.map(t => [
                t.id,
                { start: toInputDate(t.startDate), end: toInputDate(t.endDate) },
            ])
        )
    )

    const [savingId,  setSavingId]  = useState<string | null>(null)
    const [savingAll, setSavingAll] = useState(false)
    const [clearingId, setClearingId] = useState<string | null>(null)

    function updateDate(termId: string, field: 'start' | 'end', value: string) {
        setDates(prev => ({
            ...prev,
            [termId]: { ...prev[termId], [field]: value },
        }))
    }

    async function handleSaveSingle(termId: string) {
        const d = dates[termId]
        if (!d.start || !d.end) {
            toast.error('Both start and end dates are required.')
            return
        }
        setSavingId(termId)
        const result = await updateTermDates({
            termId,
            startDate: new Date(d.start),
            endDate:   new Date(d.end),
        })
        if (result.success) {
            toast.success('Term dates updated.')
            onUpdate({
                terms: data.terms.map(t =>
                    t.id === termId
                        ? { ...t, startDate: new Date(d.start), endDate: new Date(d.end) }
                        : t
                ),
            })
        } else {
            toast.error(result.error ?? 'Failed to update term dates.')
        }
        setSavingId(null)
    }

    async function handleSaveAll() {
        const updates = data.terms
            .filter(t => dates[t.id]?.start && dates[t.id]?.end)
            .map(t => ({
                termId:    t.id,
                startDate: new Date(dates[t.id].start),
                endDate:   new Date(dates[t.id].end),
            }))

        if (updates.length === 0) {
            toast.error('No valid date pairs to save.')
            return
        }

        setSavingAll(true)
        const result = await bulkUpdateTermDates(updates)
        if (result.success) {
            toast.success(`${updates.length} term(s) updated.`)
            onUpdate({
                terms: data.terms.map(t => {
                    const u = updates.find(u => u.termId === t.id)
                    return u ? { ...t, startDate: u.startDate, endDate: u.endDate } : t
                }),
            })
        } else {
            toast.error(result.error ?? 'Bulk update failed.')
        }
        setSavingAll(false)
    }

    async function handleClear(termId: string) {
        setClearingId(termId)
        const result = await clearTermDates(termId)
        if (result.success) {
            toast.success('Term dates cleared.')
            setDates(prev => ({ ...prev, [termId]: { start: '', end: '' } }))
            onUpdate({
                terms: data.terms.map(t =>
                    t.id === termId ? { ...t, startDate: null, endDate: null } : t
                ),
            })
        } else {
            toast.error(result.error ?? 'Failed to clear dates.')
        }
        setClearingId(null)
    }

    const termLabel = data.curriculum?.termLabel ?? 'Term'
    const allSet    = data.terms.every(t => t.startDate && t.endDate)

    return (
        <div className="space-y-4">

            {/* Save all */}
            <Card className="bg-school-secondary-900 border-school-secondary-700">
                <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-white">
                                {termLabel} Dates Overview
                            </p>
                            <p className="text-xs text-school-secondary-400">
                                {allSet
                                    ? `All ${data.terms.length} ${termLabel.toLowerCase()}s have dates configured.`
                                    : `${data.terms.filter(t => !t.startDate).length} of ${data.terms.length} ${termLabel.toLowerCase()}s need dates.`
                                }
                            </p>
                        </div>
                        <Button
                            onClick={handleSaveAll}
                            disabled={savingAll}
                            size="sm"
                            className="h-8 px-3 text-xs bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold"
                        >
                            {savingAll
                                ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Saving all...</>
                                : <><Save className="h-3.5 w-3.5 mr-1.5" />Save All</>
                            }
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Terms grouped by grade */}
            {Object.entries(termsByGrade).map(([grade, terms]) => (
                <SettingsSection
                    key={grade}
                    title={grade}
                    description={`Set start and end dates for each ${termLabel.toLowerCase()} in ${grade}.`}
                >
                    <div className="space-y-3">
                        {terms.map(term => {
                            const d          = dates[term.id] ?? { start: '', end: '' }
                            const isSaving   = savingId === term.id
                            const isClearing = clearingId === term.id
                            const hasDate    = term.startDate || term.endDate

                            return (
                                <div
                                    key={term.id}
                                    className={`rounded-xl border p-3 sm:p-4 space-y-3 transition-colors ${
                                        hasDate
                                            ? 'border-school-secondary-700 bg-school-secondary-800/30'
                                            : 'border-amber-500/20 bg-amber-500/5'
                                    }`}
                                >
                                    {/* Term header */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full shrink-0 ${
                                                hasDate ? 'bg-green-400' : 'bg-amber-400'
                                            }`} />
                                            <p className="text-sm font-semibold text-white">
                                                {term.displayName}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {hasDate && (
                                                <span className="text-[10px] text-school-secondary-400">
                                                    {formatDate(term.startDate)} → {formatDate(term.endDate)}
                                                </span>
                                            )}
                                            {!hasDate && (
                                                <span className="text-[10px] font-semibold text-amber-400">
                                                    Dates not set
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Date inputs */}
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] text-school-secondary-400 uppercase tracking-wider font-semibold">
                                                Start Date
                                            </Label>
                                            <Input
                                                type="date"
                                                value={d.start}
                                                onChange={e => updateDate(term.id, 'start', e.target.value)}
                                                className="bg-school-secondary-800 border-school-secondary-700 text-white focus:border-school-primary [color-scheme:dark]"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] text-school-secondary-400 uppercase tracking-wider font-semibold">
                                                End Date
                                            </Label>
                                            <Input
                                                type="date"
                                                value={d.end}
                                                onChange={e => updateDate(term.id, 'end', e.target.value)}
                                                className="bg-school-secondary-800 border-school-secondary-700 text-white focus:border-school-primary [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-2">
                                        {hasDate && (
                                            <button
                                                onClick={() => handleClear(term.id)}
                                                disabled={isClearing}
                                                className="inline-flex items-center gap-1 text-[11px] text-school-secondary-400 hover:text-red-400 transition-colors disabled:opacity-50"
                                            >
                                                {isClearing
                                                    ? <Loader2 className="h-3 w-3 animate-spin" />
                                                    : <X className="h-3 w-3" />
                                                }
                                                Clear
                                            </button>
                                        )}
                                        <Button
                                            onClick={() => handleSaveSingle(term.id)}
                                            disabled={isSaving || !d.start || !d.end}
                                            size="sm"
                                            className="h-7 px-3 text-[11px] bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold disabled:opacity-50"
                                        >
                                            {isSaving
                                                ? <><Loader2 className="h-3 w-3 animate-spin mr-1" />Saving...</>
                                                : <><Save className="h-3 w-3 mr-1" />Save</>
                                            }
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </SettingsSection>
            ))}
        </div>
    )
}

// ── Curriculum Tab ─────────────────────────────────────────────────────────────
function CurriculumTab({ data, onUpdate }: TabProps) {
    const [subjectLabel, setSubjectLabel] = useState(data.curriculum?.subjectLabel ?? 'Subject')
    const [termLabel,    setTermLabel]    = useState(data.curriculum?.termLabel ?? 'Term')
    const [yearLabel,    setYearLabel]    = useState(data.curriculum?.yearLabel ?? 'Year')
    const [saving,       setSaving]       = useState(false)
    const [saved,        setSaved]        = useState(false)

    async function handleSave() {
        if (!data.curriculum) return
        setSaving(true)
        const result = await updateCurriculumLabels(data.curriculum.id, {
            subjectLabel, termLabel, yearLabel,
        })
        if (result.success) {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
            onUpdate({
                curriculum: data.curriculum
                    ? { ...data.curriculum, subjectLabel, termLabel, yearLabel }
                    : null,
            })
            toast.success('Curriculum labels updated.')
        } else {
            toast.error(result.error ?? 'Failed to update labels.')
        }
        setSaving(false)
    }

    if (!data.curriculum) return (
        <Card className="bg-school-secondary-900 border-school-secondary-700">
            <CardContent className="flex items-center justify-center h-32">
                <p className="text-sm text-school-secondary-400">No curriculum assigned.</p>
            </CardContent>
        </Card>
    )

    return (
        <div className="space-y-4">

            {/* Read-only info */}
            <Card className="bg-school-secondary-900 border-school-secondary-700">
                <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
                            <BookOpen className="h-4 w-4 text-school-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">
                                {data.curriculum.name}
                            </p>
                            <p className="text-xs text-school-secondary-400">
                                Active curriculum — contact support to change curriculum type
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Labels */}
            <SettingsSection
                title="Curriculum Labels"
                description="Customize the terminology used throughout your school platform."
                onSave={handleSave}
                saving={saving}
                saved={saved}
            >
                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        {
                            id:          'subject',
                            label:       'Subject Label',
                            value:       subjectLabel,
                            onChange:    setSubjectLabel,
                            placeholder: 'e.g. Subject, Course',
                            example:     'Used as: "Mathematics Subject"',
                        },
                        {
                            id:          'term',
                            label:       'Term Label',
                            value:       termLabel,
                            onChange:    setTermLabel,
                            placeholder: 'e.g. Term, Semester',
                            example:     'Used as: "Term 1 Report"',
                        },
                        {
                            id:          'year',
                            label:       'Year Label',
                            value:       yearLabel,
                            onChange:    setYearLabel,
                            placeholder: 'e.g. Year, Grade, Class',
                            example:     'Used as: "Year 7 Students"',
                        },
                    ].map(field => (
                        <div key={field.id} className="space-y-1.5">
                            <Label className="text-xs text-school-secondary-400 uppercase tracking-wider font-semibold">
                                {field.label}
                            </Label>
                            <Input
                                value={field.value}
                                onChange={e => field.onChange(e.target.value)}
                                placeholder={field.placeholder}
                                className="bg-school-secondary-800 border-school-secondary-700 text-white placeholder:text-school-secondary-500 focus:border-school-primary"
                            />
                            <p className="text-[11px] text-school-secondary-500">
                                {field.example}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Preview */}
                <div className="mt-4 rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-3">
                    <p className="text-[10px] font-semibold text-school-secondary-400 uppercase tracking-wider mb-2">
                        Preview
                    </p>
                    <p className="text-xs text-school-secondary-200">
                        <span className="text-school-primary font-semibold">{yearLabel} 7</span>
                        {' · '}
                        <span className="text-school-primary font-semibold">{termLabel} 2</span>
                        {' · '}
                        <span className="text-school-primary font-semibold">Mathematics {subjectLabel}</span>
                    </p>
                </div>
            </SettingsSection>
        </div>
    )
}

// ── WhatsApp Tab ───────────────────────────────────────────────────────────────
function WhatsAppTab({ data, schoolId, onUpdate }: TabProps) {
    const [credits, setCredits] = useState(String(data.school.whatsappCredits))
    const [saving,  setSaving]  = useState(false)
    const [saved,   setSaved]   = useState(false)

    async function handleSave() {
        const parsed = parseInt(credits)
        if (isNaN(parsed) || parsed < 0) {
            toast.error('Please enter a valid number of credits.')
            return
        }
        setSaving(true)
        const result = await updateWhatsAppCredits(schoolId, { whatsappCredits: parsed })
        if (result.success) {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
            onUpdate({ school: { ...data.school, whatsappCredits: parsed } })
            toast.success('WhatsApp credits updated.')
        } else {
            toast.error(result.error ?? 'Failed to update credits.')
        }
        setSaving(false)
    }

    return (
        <div className="space-y-4">
            <SettingsSection
                title="WhatsApp Credits"
                description="Credits are consumed when sending feedback messages to parents via WhatsApp."
                onSave={handleSave}
                saving={saving}
                saved={saved}
            >
                <div className="space-y-4 max-w-sm">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-school-secondary-400 uppercase tracking-wider font-semibold">
                            Available Credits
                        </Label>
                        <Input
                            type="number"
                            min="0"
                            value={credits}
                            onChange={e => setCredits(e.target.value)}
                            className="bg-school-secondary-800 border-school-secondary-700 text-white focus:border-school-primary"
                        />
                        <p className="text-[11px] text-school-secondary-500">
                            Each WhatsApp message sent to a parent costs 1 credit.
                        </p>
                    </div>

                    {/* Credit status */}
                    <div className={`flex items-center gap-2.5 rounded-xl p-3 border ${
                        data.school.whatsappCredits > 10
                            ? 'bg-green-500/10 border-green-500/20'
                            : data.school.whatsappCredits > 0
                            ? 'bg-amber-500/10 border-amber-500/20'
                            : 'bg-red-500/10 border-red-500/20'
                    }`}>
                        <MessageCircle className={`h-4 w-4 shrink-0 ${
                            data.school.whatsappCredits > 10
                                ? 'text-green-400'
                                : data.school.whatsappCredits > 0
                                ? 'text-amber-400'
                                : 'text-red-400'
                        }`} />
                        <div>
                            <p className="text-xs font-semibold text-white">
                                {data.school.whatsappCredits > 10
                                    ? `${data.school.whatsappCredits} credits remaining`
                                    : data.school.whatsappCredits > 0
                                    ? `Low balance — ${data.school.whatsappCredits} credits left`
                                    : 'No credits — top up to send messages'
                                }
                            </p>
                            <p className="text-[11px] text-school-secondary-400 mt-0.5">
                                {data.school.whatsappCredits > 10
                                    ? 'You have sufficient credits.'
                                    : 'Consider topping up your credits.'}
                            </p>
                        </div>
                    </div>
                </div>
            </SettingsSection>
        </div>
    )
}

// ── Billing Tab ────────────────────────────────────────────────────────────────
function BillingTab({ data }: { data: SchoolSettingsData }) {
    const sub = data.school.subscription

    return (
        <div className="space-y-4">
            <Card className="bg-school-secondary-900 border-school-secondary-700">
                <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
                    <CardTitle className="text-sm font-bold text-white">
                        Subscription
                    </CardTitle>
                    <p className="text-xs text-school-secondary-400 mt-0.5">
                        Your current plan and billing details. Managed via Stripe.
                    </p>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4">
                    {!sub ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                            <CreditCard className="h-8 w-8 text-school-secondary-600" />
                            <p className="text-sm font-semibold text-white">
                                No active subscription
                            </p>
                            <p className="text-xs text-school-secondary-400 max-w-xs">
                                Contact support to set up your subscription and unlock all features.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Plan details */}
                            <div className="grid gap-3 sm:grid-cols-3">
                                {[
                                    { label: 'Plan',        value: sub.plan },
                                    {
                                        label: 'Status',
                                        value: (
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getPlanColor(sub.status)}`}>
                                                {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                            </span>
                                        ),
                                    },
                                    {
                                        label: 'Renews',
                                        value: new Date(sub.currentPeriodEnd).toLocaleDateString('en-GB', {
                                            day: 'numeric', month: 'long', year: 'numeric',
                                        }),
                                    },
                                ].map(item => (
                                    <div
                                        key={item.label}
                                        className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-3"
                                    >
                                        <p className="text-[10px] font-semibold text-school-secondary-400 uppercase tracking-wider mb-1">
                                            {item.label}
                                        </p>
                                        <div className="text-sm font-bold text-white">
                                            {item.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Manage */}
                            <div className="flex items-center justify-between rounded-xl border border-school-secondary-700 bg-school-secondary-800/30 p-3 sm:p-4">
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        Manage Subscription
                                    </p>
                                    <p className="text-xs text-school-secondary-400 mt-0.5">
                                        Update payment method, change plan or cancel via Stripe.
                                    </p>
                                </div>
                                <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-school-secondary-700 hover:bg-school-secondary-600 text-school-secondary-100 hover:text-white text-xs font-semibold transition-all shrink-0">
                                    Stripe Portal
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// ── Helper used in BillingTab ──────────────────────────────────────────────────
function getPlanColor(status: string) {
    switch (status.toLowerCase()) {
        case 'active':   return 'text-green-400 bg-green-500/10 border-green-500/20'
        case 'trialing': return 'text-school-primary bg-school-primary/10 border-school-primary/20'
        case 'past_due': return 'text-red-400 bg-red-500/10 border-red-500/20'
        default:         return 'text-school-secondary-400 bg-school-secondary-800 border-school-secondary-700'
    }
}