'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useProfileStore } from '@/store/profileStore'
import { getSchoolSettings, SchoolSettingsData } from '@/app/actions/school-settings.action'
import { Loader2, Settings, School, Calendar, BookOpen, CreditCard } from 'lucide-react'
import { toast } from 'sonner'

// Components
import { ProfileSection } from '@/components/settings/profileSection'
import { TermsSection } from '@/components/settings/termSelection'
import { CurriculumSection } from '@/components/settings/curriculumSection'
import { BillingSection } from '@/components/settings/billingSection'


type Tab = 'profile' | 'terms' | 'curriculum' | 'whatsapp' | 'billing'

const NAV_ITEMS = [
    { id: 'profile',    label: 'School Profile',    icon: School },
    { id: 'terms',      label: 'Term Dates',        icon: Calendar },
    { id: 'curriculum', label: 'Curriculum Labels', icon: BookOpen },
    { id: 'billing',    label: 'Billing & Plan',    icon: CreditCard },
] as const

function SettingsContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { profile } = useProfileStore()
    const schoolId = profile?.schoolId ?? ''

    const activeTab = (searchParams.get('tab') as Tab) ?? 'profile'
    const [data, setData] = useState<SchoolSettingsData | null>(null)
    const [loading, setLoading] = useState(true)

    // Fetch initial settings
    useEffect(() => {
        if (!schoolId) return
        setLoading(true)
        getSchoolSettings(schoolId)
            .then(setData)
            .catch(() => toast.error('Failed to synchronize settings registry.'))
            .finally(() => setLoading(false))
    }, [schoolId])

    // Sync state when children perform updates
    const handleDataUpdate = (updated: Partial<SchoolSettingsData>) => {
        setData(prev => prev ? { ...prev, ...updated } : prev)
    }

    const handleTabChange = (id: Tab) => {
        router.push(`/admin/settings?tab=${id}`, { scroll: false })
    }

    if (loading) return (
        <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest animate-pulse">Initializing_Control_Center...</p>
        </div>
    )

    if (!data) return (
        <div className="h-[80vh] flex items-center justify-center text-red-400 font-bold uppercase tracking-widest italic">
            Configuration_Data_Unavailable
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50">
            {/* ── Page Header ── */}
            <header className="flex items-center gap-5 border-b border-white/5 pb-10">
                <div className="h-14 w-14 rounded-[1.5rem] bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl shadow-school-primary/10">
                    <Settings className="h-7 w-7 text-school-primary" />
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Settings Registry</h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Manage institutional identity and system-wide logic.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-16 items-start">
                
                {/* ── Desktop Navigation ── */}
                <aside className="hidden lg:flex flex-col gap-2 sticky top-28">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                                activeTab === item.id 
                                ? 'bg-school-primary text-school-secondary-950 shadow-2xl shadow-school-primary/20 scale-[1.02]' 
                                : 'text-slate-500 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </button>
                    ))}
                </aside>

                {/* ── Mobile Navigation ── */}
                <div className="lg:hidden flex gap-2 overflow-x-auto pb-6 scrollbar-hide border-b border-white/5">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === item.id 
                                ? 'bg-school-primary text-slate-950 shadow-lg' 
                                : 'bg-slate-900 text-slate-500 border border-white/5'
                            }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* ── Dynamic Content Section ── */}
                <main className="min-w-0 pb-20">
                    {activeTab === 'profile' && (
                        <ProfileSection data={data} schoolId={schoolId} onUpdate={handleDataUpdate} />
                    )}
                    {activeTab === 'terms' && (
                        <TermsSection data={data} schoolId={schoolId} onUpdate={handleDataUpdate} />
                    )}
                    {activeTab === 'curriculum' && (
                        <CurriculumSection data={data} onUpdate={handleDataUpdate} />
                    )}
                    
                    {activeTab === 'billing' && (
                        <BillingSection data={data} />
                    )}
                </main>
            </div>
        </div>
    )
}

// Suspense boundary is required for useSearchParams in Next.js 14/15
export default function SettingsPage() {
    return (
        <Suspense fallback={
            <div className="bg-slate-950 min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-school-primary h-8 w-8" />
            </div>
        }>
            <SettingsContent />
        </Suspense>
    )
}