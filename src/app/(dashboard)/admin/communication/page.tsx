
// 'use client'

// import { WhatsAppHub } from "@/components/communication/whatsAppHub"
// import { useProfileStore } from "@/store/profileStore"
// import { MessageCircle } from "lucide-react"

// export default function CommunicationPage() {
//     const { profile } = useProfileStore()
//     if (!profile?.schoolId) return null

//     return (
//         <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50">
//             <header className="border-b border-white/5 pb-10">
//                 <div className="flex items-center gap-5">
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center">
//                         <MessageCircle className="h-7 w-7 text-school-primary" />
//                     </div>
//                     <div>
//                         <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">WhatsApp Control</h1>
//                         <p className="text-slate-500 text-sm mt-2 font-medium">Global communication hub and message credit management.</p>
//                     </div>
//                 </div>
//             </header>

//             <WhatsAppHub schoolId={profile.schoolId} />
//         </div>
//     )
// }


'use client'

import { WhatsAppHub } from '@/components/communication/whatsAppHub'
import { useProfileStore } from '@/store/profileStore'
import { MessageCircle, Loader2 } from 'lucide-react'

export default function CommunicationPage() {
    const { profile, isLoading } = useProfileStore()

    if (isLoading) return (
        <div className="min-h-screen bg-school-secondary-950 flex items-center justify-center">
            <div className="flex items-center gap-2.5">
                <Loader2 className="h-5 w-5 animate-spin text-school-primary" />
                <span className="text-sm text-school-secondary-400">Loading...</span>
            </div>
        </div>
    )

    if (!profile?.schoolId) return null

    return (
        <div className="min-h-screen bg-school-secondary-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

                {/* ── Page header ── */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20">
                        <MessageCircle className="h-5 w-5 text-school-primary" />
                    </div>
                    <div>
                        <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                            WhatsApp Communication
                        </h1>
                        <p className="text-xs text-school-secondary-400">
                            Credit management and message history
                        </p>
                    </div>
                </div>

                {/* ── Content ── */}
                <WhatsAppHub schoolId={profile.schoolId} />

            </div>
        </div>
    )
}