// 'use client'

// import { useState, Suspense } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { useProfileStore } from '@/store/profileStore'
// import { Settings, School, Calendar, BookOpen, CreditCard, Loader2 } from 'lucide-react'
// import { ProfileSection } from './profileSection'
// import { TermsSection } from './termSelection'
// import { CurriculumSection } from './curriculumSection'
// import { BillingSection } from './billingSection'
// import { type SchoolSettingsData } from '@/app/actions/school-settings.action'

// type Tab = 'profile' | 'terms' | 'curriculum' | 'billing'

// const NAV_ITEMS = [
//     { id: 'profile',    label: 'Registry Identity', icon: School,      tier: 'ALL' },
//     { id: 'terms',      label: 'Academic Timeline', icon: Calendar,    tier: 'SCHOOL' },
//     { id: 'curriculum', label: 'System Terminology', icon: BookOpen,    tier: 'SCHOOL' },
//     { id: 'billing',    label: 'License & Plan',    icon: CreditCard,  tier: 'ALL' },
// ] as const

// export function SettingsClient({ 
//     initialData, 
//     isIndependent 
// }: { 
//     initialData: SchoolSettingsData | null, 
//     isIndependent: boolean 
// }) {
//     const router = useRouter()
//     const searchParams = useSearchParams()
//     const { profile } = useProfileStore()
    
//     const [data, setData] = useState<SchoolSettingsData | null>(initialData)
//     const activeTab = (searchParams.get('tab') as Tab) ?? 'profile'
//     const primaryColor = profile?.primaryColor || "#f59e0b"

//     // Filter navigation based on Tier (Rule 6 & 13)
//     const filteredNav = NAV_ITEMS.filter(item => isIndependent ? item.tier === 'ALL' : true);

//     const handleTabChange = (id: string) => {
//         router.push(`/admin/settings?tab=${id}`, { scroll: false })
//     }

//     const handleDataUpdate = (updated: Partial<SchoolSettingsData>) => {
//         setData(prev => prev ? { ...prev, ...updated } : prev)
//     }

//     return (
//         <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50 animate-in fade-in duration-700">
            
//             <header className="flex items-center gap-5 border-b border-white/5 pb-10">
//                 <div 
//                     className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
//                     style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
//                 >
//                     <Settings className="h-7 w-7" style={{ color: primaryColor }} />
//                 </div>
//                 <div>
//                     <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Settings Registry</h1>
//                     <p className="text-slate-500 text-sm mt-2 font-medium italic">
//                         {isIndependent ? "Manage personal learning configuration." : "Institutional configuration & governance."}
//                     </p>
//                 </div>
//             </header>

//             <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
                
//                 {/* Desktop Nav */}
//                 <aside className="hidden lg:flex flex-col gap-2 sticky top-28">
//                     {filteredNav.map((item) => (
//                         <button
//                             key={item.id}
//                             onClick={() => handleTabChange(item.id)}
//                             className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
//                                 activeTab === item.id 
//                                 ? 'text-slate-950 shadow-2xl scale-[1.02]' 
//                                 : 'text-slate-500 hover:bg-white/5 hover:text-white'
//                             }`}
//                             style={activeTab === item.id ? { backgroundColor: primaryColor } : {}}
//                         >
//                             <item.icon className="h-4 w-4" />
//                             {item.label}
//                         </button>
//                     ))}
//                 </aside>

//                 {/* Main Section */}
//                 <main className="min-w-0 pb-20">
//                     {activeTab === 'profile' && (
//                         <ProfileSection data={data} onUpdate={handleDataUpdate} />
//                     )}
//                     {activeTab === 'billing' && (
//                         <BillingSection initialData={data} isIndependent={isIndependent} />
//                     )}
                    
//                     {!isIndependent && data && (
//                         <>
//                             {activeTab === 'terms' && (
//                                 <TermsSection data={data} onUpdate={handleDataUpdate} />
//                             )}
//                             {activeTab === 'curriculum' && (
//                                 <CurriculumSection data={data} onUpdate={handleDataUpdate} />
//                             )}
//                         </>
//                     )}
//                 </main>
//             </div>
//         </div>
//     )
// }



// 'use client'

// import React, { useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { Settings, School, Calendar, BookOpen, CreditCard, ChevronRight } from 'lucide-react'
// import { ProfileSection } from './profileSection'
// import { TermsSection } from './termSelection'
// import { CurriculumSection } from './curriculumSection'
// import { BillingSection } from './billingSection'
// import { type SchoolSettingsData } from '@/app/actions/school-settings.action'
// import { cn } from '@/lib/utils'

// // ── Types & Config (Rule 15) ────────────────────────────────────────────────

// type Tab = 'profile' | 'terms' | 'curriculum' | 'billing'

// const NAV_ITEMS = [
//     { id: 'profile',    label: 'Registry Identity',  icon: School,      tier: 'ALL' },
//     { id: 'terms',      label: 'Academic Timeline', icon: Calendar,    tier: 'SCHOOL' },
//     { id: 'curriculum', label: 'System Terminology', icon: BookOpen,    tier: 'SCHOOL' },
//     { id: 'billing',    label: 'License & Plan',     icon: CreditCard,  tier: 'ALL' },
// ] as const

// /**
//  * SETTINGS REGISTRY TERMINAL (Tier 2/3)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 20: Compulsory Responsiveness (Fluid Padding + Mobile Tab Bar).
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function SettingsClient({ 
//     initialData, 
//     isIndependent 
// }: { 
//     initialData: SchoolSettingsData | null, 
//     isIndependent: boolean 
// }) {
//     const router = useRouter()
//     const searchParams = useSearchParams()
    
//     const [data, setData] = useState<SchoolSettingsData | null>(initialData)
//     const activeTab = (searchParams.get('tab') as Tab) ?? 'profile'

//     // Rule 6: Filter navigation based on Tier (Institutional vs Individual)
//     const filteredNav = NAV_ITEMS.filter(item => isIndependent ? item.tier === 'ALL' : true);

//     const handleTabChange = (id: string) => {
//         router.push(`/admin/settings?tab=${id}`, { scroll: false })
//     }

//     const handleDataUpdate = (updated: Partial<SchoolSettingsData>) => {
//         setData(prev => prev ? { ...prev, ...updated } : prev)
//     }

//     return (
//         <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
//             {/* Rule 20: Fluid Container and Padding */}
//             <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
                
//                 {/* ── HEADER (Rule 11/21) ── */}
//                 <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-10">
//                     <div className="flex items-center gap-6">
//                         {/* Rule 21: Scale Protocol Icon Container */}
//                         <div className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-lg transition-colors">
//                             <Settings className="h-8 w-8 text-school-primary" />
//                         </div>
//                         <div className="space-y-1">
//                             <h1 className="text-2xl md:text-4xl font-extrabold tracking-tighter uppercase italic leading-none">
//                                 Settings Registry
//                             </h1>
//                             <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
//                                 <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
//                                 {isIndependent ? "Personal Learning Hub Configuration" : "Institutional Governance & Core Architecture"}
//                             </p>
//                         </div>
//                     </div>
//                 </header>

//                 {/* ── MOBILE TAB NAVIGATION (Rule 20) ── */}
//                 <div className="lg:hidden flex overflow-x-auto pb-4 gap-3 custom-scrollbar no-scrollbar">
//                     {filteredNav.map((item) => (
//                         <button
//                             key={item.id}
//                             onClick={() => handleTabChange(item.id)}
//                             className={cn(
//                                 "flex items-center gap-3 px-6 py-3.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all whitespace-nowrap border shadow-sm",
//                                 activeTab === item.id 
//                                     ? "bg-school-primary text-on-school-primary border-school-primary" 
//                                     : "bg-surface border-border text-muted-foreground"
//                             )}
//                         >
//                             <item.icon className="h-4 w-4" />
//                             {item.label}
//                         </button>
//                     ))}
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 md:gap-20 items-start">
                    
//                     {/* ── DESKTOP ASIDE (Rule 18/19/21) ── */}
//                     <aside className="hidden lg:flex flex-col gap-3 sticky top-28">
//                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-4 mb-2">Navigation Matrix</p>
//                         {filteredNav.map((item) => (
//                             <button
//                                 key={item.id}
//                                 onClick={() => handleTabChange(item.id)}
//                                 className={cn(
//                                     "flex items-center justify-between px-6 py-4 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all group",
//                                     activeTab === item.id 
//                                         ? "bg-school-primary text-on-school-primary shadow-xl shadow-school-primary-200 translate-x-2" 
//                                         : "bg-surface border border-border text-muted-foreground hover:bg-card hover:text-foreground hover:border-school-primary-200"
//                                 )}
//                             >
//                                 <div className="flex items-center gap-4">
//                                     <item.icon className={cn("h-4 w-4", activeTab === item.id ? "text-on-school-primary" : "text-school-primary/60 group-hover:text-school-primary")} />
//                                     {item.label}
//                                 </div>
//                                 <ChevronRight className={cn("h-3 w-3 transition-transform", activeTab === item.id ? "opacity-100 rotate-90" : "opacity-0 group-hover:opacity-40")} />
//                             </button>
//                         ))}
//                     </aside>

//                     {/* ── CONTENT HUB (Rule 14) ── */}
//                     <main className="min-w-0 pb-24">
//                         <div className="animate-in slide-in-from-bottom-4 duration-500">
//                             {activeTab === 'profile' && (
//                                 <ProfileSection data={data as any} onUpdate={handleDataUpdate} />
//                             )}
//                             {activeTab === 'billing' && (
//                                 <BillingSection initialData={data} isIndependent={isIndependent} />
//                             )}
                            
//                             {!isIndependent && data && (
//                                 <>
//                                     {activeTab === 'terms' && (
//                                         <TermsSection data={data} onUpdate={handleDataUpdate} />
//                                     )}
//                                     {activeTab === 'curriculum' && (
//                                         <CurriculumSection data={data} onUpdate={handleDataUpdate} />
//                                     )}
//                                 </>
//                             )}
//                         </div>
//                     </main>
//                 </div>
//             </div>
//         </div>
//     )
// }



'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Settings, School, Calendar, BookOpen, CreditCard, ChevronRight, Layout } from 'lucide-react'
import { ProfileSection } from './profileSection'
import { TermsSection } from './termSelection'
import { CurriculumSection } from './curriculumSection'
import { BillingSection } from './billingSection'
import { type SchoolSettingsData } from '@/app/actions/school-settings.action'
import { cn } from '@/lib/utils'
import { getErrorMessage } from '@/lib/error-handler'

// ── Types & Config (Rule 15: Strict Registry Types) ─────────────────────────

type Tab = 'profile' | 'terms' | 'curriculum' | 'billing'

interface NavItem {
    id:    Tab
    label: string
    icon:  React.ElementType
    tier:  'ALL' | 'SCHOOL'
}

const NAV_ITEMS: NavItem[] = [
    { id: 'profile',    label: 'Registry Identity',  icon: School,      tier: 'ALL' },
    { id: 'terms',      label: 'Academic Timeline', icon: Calendar,    tier: 'SCHOOL' },
    { id: 'curriculum', label: 'System Terminology', icon: BookOpen,    tier: 'SCHOOL' },
    { id: 'billing',    label: 'License Hub',        icon: CreditCard,  tier: 'ALL' },
]

interface SettingsClientProps {
    initialData:   SchoolSettingsData | null
    isIndependent: boolean
}

/**
 * SETTINGS REGISTRY TERMINAL (Tier 2/3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 15: Zero 'any' types. Strictly typed Hub data flow.
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 * Rule 23: Explicit Error Protocol integration.
 */
export function SettingsClient({ initialData, isIndependent }: SettingsClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [data, setData] = useState<SchoolSettingsData | null>(initialData)
    const activeTab = (searchParams.get('tab') as Tab) ?? 'profile'

    // Rule 6/13: Tier-aware Navigation Filtering
    const filteredNav = NAV_ITEMS.filter(item => isIndependent ? item.tier === 'ALL' : true);

    const handleTabChange = (id: Tab) => {
        router.push(`/admin/settings?tab=${id}`, { scroll: false })
    }

    /**
     * Rule 11: Real-time Registry Synchronization
     * ✅ Rule 15: Strictly typed partial update protocol.
     */
    const handleDataUpdate = (updated: Partial<SchoolSettingsData>) => {
        try {
            setData(prev => prev ? { ...prev, ...updated } : prev)
        } catch (error: unknown) {
            // ✅ Rule 23: Explicit Error Protocol
            const message = getErrorMessage(error);
            console.error(`[SETTINGS_SYNC_FAULT]: ${message}`);
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
            {/* Rule 20: Fluid Container and Padding */}
            <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
                
                {/* ── HEADER (Rule 11/21) ── */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
                    <div className="flex items-center gap-6">
                        {/* Rule 21: Scale Protocol Hub Icon */}
                        <div className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-lg transition-colors group">
                            <Settings className="h-8 w-8 text-school-primary transition-transform group-hover:rotate-90 duration-500" />
                        </div>
                        <div className="space-y-1">
                            {/* Rule 11: Header scaling */}
                            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tighter uppercase italic leading-none">
                                Settings Hub
                            </h1>
                            <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
                                {isIndependent ? "Personal Hub Configuration" : "Institutional Governance & Core Architecture"}
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-3 px-5 py-2.5 rounded-xl bg-surface border border-border shadow-inner">
                        <Layout className="h-4 w-4 text-school-primary/60" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Registry Access: Verified</span>
                    </div>
                </header>

                {/* ── MOBILE NAVIGATION (Rule 20) ── */}
                <div className="lg:hidden flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth">
                    {filteredNav.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={cn(
                                "flex items-center gap-3 px-6 py-3.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all whitespace-nowrap border",
                                activeTab === item.id 
                                    ? "bg-school-primary text-on-school-primary border-school-primary shadow-lg" 
                                    : "bg-surface border-border text-muted-foreground hover:bg-background"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 md:gap-20 items-start">
                    
                    {/* ── DESKTOP SIDEBAR HUB (Rule 18/19/21) ── */}
                    <aside className="hidden lg:flex flex-col gap-3 sticky top-28">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 ml-4 mb-2">Navigation Matrix</p>
                        {filteredNav.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleTabChange(item.id)}
                                className={cn(
                                    "flex items-center justify-between px-6 py-4 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all group",
                                    activeTab === item.id 
                                        ? "bg-school-primary text-on-school-primary shadow-xl shadow-school-primary-200 translate-x-2" 
                                        : "bg-surface border border-border text-muted-foreground hover:bg-card hover:text-foreground hover:border-school-primary-200"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon className={cn("h-4 w-4 transition-colors", activeTab === item.id ? "text-on-school-primary" : "text-school-primary/60 group-hover:text-school-primary")} />
                                    <span className="italic">{item.label}</span>
                                </div>
                                <ChevronRight className={cn("h-3 w-3 transition-all", activeTab === item.id ? "opacity-100 rotate-90" : "opacity-0 group-hover:opacity-40 group-hover:translate-x-1")} />
                            </button>
                        ))}
                    </aside>

                    {/* ── CONTENT TERMINAL (Rule 14) ── */}
                    <main className="min-w-0 pb-24">
                        <div className="animate-in slide-in-from-bottom-6 duration-700">
                            {activeTab === 'profile' && (
                                /* ✅ RESOLVED TS2322: Removed 'as any' and ensured type-safe prop passing */
                                <ProfileSection data={data} onUpdate={handleDataUpdate} />
                            )}
                            {activeTab === 'billing' && (
                                <BillingSection initialData={data} isIndependent={isIndependent} />
                            )}
                            
                            {!isIndependent && data && (
                                <div className="space-y-10 md:space-y-16">
                                    {activeTab === 'terms' && (
                                        <TermsSection data={data} onUpdate={handleDataUpdate} />
                                    )}
                                    {activeTab === 'curriculum' && (
                                        <CurriculumSection data={data} onUpdate={handleDataUpdate} />
                                    )}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}