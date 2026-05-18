'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useProfileStore } from '@/store/profileStore'
import { Settings, School, Calendar, BookOpen, CreditCard, Loader2 } from 'lucide-react'
import { ProfileSection } from './profileSection'
import { TermsSection } from './termSelection'
import { CurriculumSection } from './curriculumSection'
import { BillingSection } from './billingSection'
import { type SchoolSettingsData } from '@/app/actions/school-settings.action'

type Tab = 'profile' | 'terms' | 'curriculum' | 'billing'

const NAV_ITEMS = [
    { id: 'profile',    label: 'Registry Identity', icon: School,      tier: 'ALL' },
    { id: 'terms',      label: 'Academic Timeline', icon: Calendar,    tier: 'SCHOOL' },
    { id: 'curriculum', label: 'System Terminology', icon: BookOpen,    tier: 'SCHOOL' },
    { id: 'billing',    label: 'License & Plan',    icon: CreditCard,  tier: 'ALL' },
] as const

export function SettingsClient({ 
    initialData, 
    isIndependent 
}: { 
    initialData: SchoolSettingsData | null, 
    isIndependent: boolean 
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { profile } = useProfileStore()
    
    const [data, setData] = useState<SchoolSettingsData | null>(initialData)
    const activeTab = (searchParams.get('tab') as Tab) ?? 'profile'
    const primaryColor = profile?.primaryColor || "#f59e0b"

    // Filter navigation based on Tier (Rule 6 & 13)
    const filteredNav = NAV_ITEMS.filter(item => isIndependent ? item.tier === 'ALL' : true);

    const handleTabChange = (id: string) => {
        router.push(`/admin/settings?tab=${id}`, { scroll: false })
    }

    const handleDataUpdate = (updated: Partial<SchoolSettingsData>) => {
        setData(prev => prev ? { ...prev, ...updated } : prev)
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50 animate-in fade-in duration-700">
            
            <header className="flex items-center gap-5 border-b border-white/5 pb-10">
                <div 
                    className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
                    style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
                >
                    <Settings className="h-7 w-7" style={{ color: primaryColor }} />
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Settings Registry</h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium italic">
                        {isIndependent ? "Manage personal learning configuration." : "Institutional configuration & governance."}
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
                
                {/* Desktop Nav */}
                <aside className="hidden lg:flex flex-col gap-2 sticky top-28">
                    {filteredNav.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                                activeTab === item.id 
                                ? 'text-slate-950 shadow-2xl scale-[1.02]' 
                                : 'text-slate-500 hover:bg-white/5 hover:text-white'
                            }`}
                            style={activeTab === item.id ? { backgroundColor: primaryColor } : {}}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </button>
                    ))}
                </aside>

                {/* Main Section */}
                <main className="min-w-0 pb-20">
                    {activeTab === 'profile' && (
                        <ProfileSection data={data} onUpdate={handleDataUpdate} />
                    )}
                    {activeTab === 'billing' && (
                        <BillingSection initialData={data} isIndependent={isIndependent} />
                    )}
                    
                    {!isIndependent && data && (
                        <>
                            {activeTab === 'terms' && (
                                <TermsSection data={data} onUpdate={handleDataUpdate} />
                            )}
                            {activeTab === 'curriculum' && (
                                <CurriculumSection data={data} onUpdate={handleDataUpdate} />
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    )
}