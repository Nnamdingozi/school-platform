// 'use client'

// import { useState, useTransition } from 'react'
// import { useRouter } from 'next/navigation'
// import { useProfileStore } from '@/store/profileStore'
// import { logoutAction } from '@/app/actions/auth'
// import { LogOut, Loader2, AlertTriangle, Check } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// interface LogoutButtonProps {
//     variant?: "sidebar" | "header" | "minimal"
//     className?: string
// }

// export function LogoutButton({ variant = "sidebar", className }: LogoutButtonProps) {
//     const [confirming, setConfirming] = useState(false)
//     const [isPending, startTransition] = useTransition()
//     const { clearProfile } = useProfileStore()

//     const handleLogout = async () => {
//         if (!confirming) {
//             setConfirming(true)
//             // Auto-reset after 4 seconds
//             setTimeout(() => setConfirming(false), 4000)
//             return
//         }

//         // Trigger the actual logout
//         startTransition(async () => {
//             try {
//                 clearProfile()
//                 await logoutAction()
//             } catch (err) {
//                 toast.error('Session termination failed. Please refresh.')
//                 setConfirming(false)
//             }
//         })
//     }

//     // ── Visual Variants ────────────────────────────────────────────────────────
    
//     // 1. Sidebar Style (Wide, with text)
//     if (variant === "sidebar") {
//         return (
//             <button
//                 onClick={handleLogout}
//                 disabled={isPending}
//                 className={cn(
//                     "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
//                     confirming 
//                         ? "bg-amber-500 text-slate-950 animate-pulse" 
//                         : "text-red-400/70 hover:text-red-400 hover:bg-red-400/10",
//                     isPending && "opacity-50 pointer-events-none",
//                     className
//                 )}
//             >
//                 {isPending ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : confirming ? (
//                     <Check className="h-4 w-4" />
//                 ) : (
//                     <LogOut className="h-4 w-4" />
//                 )}
//                 <span>{isPending ? "Exiting..." : confirming ? "Click to Confirm" : "Log Out Session"}</span>
//             </button>
//         )
//     }

//     // 2. Header Style (Compact, usually just icon or small button)
//     return (
//         <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleLogout}
//             disabled={isPending}
//             className={cn(
//                 "rounded-xl transition-all h-9",
//                 confirming 
//                     ? "bg-amber-500 text-slate-950 hover:bg-amber-600" 
//                     : "text-slate-400 hover:text-red-400 hover:bg-red-500/10",
//                 className
//             )}
//         >
//             {isPending ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//             ) : confirming ? (
//                 <Check className="h-4 w-4 mr-2" />
//             ) : (
//                 <LogOut className="h-4 w-4 mr-2" />
//             )}
//             <span className="text-[10px] font-black uppercase tracking-widest">
//                 {confirming ? "Confirm?" : "Logout"}
//             </span>
//         </Button>
//     )
// }

// 'use client'

// import { useState, useTransition } from 'react'
// import { useProfileStore } from '@/store/profileStore'
// import { logoutAction } from '@/app/actions/auth'
// import { LogOut, Loader2, Check } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// interface LogoutButtonProps {
//     variant?: "sidebar" | "header" | "minimal"
//     className?: string
// }

// export function LogoutButton({ variant = "sidebar", className }: LogoutButtonProps) {
//     const [confirming, setConfirming] = useState<boolean>(false)
//     const [isPending, startTransition] = useTransition()
//     const { clearProfile } = useProfileStore()

//     const handleLogout = async () => {
//         if (!confirming) {
//             setConfirming(true)
//             // Auto-reset confirmation state after 4 seconds
//             setTimeout(() => setConfirming(false), 4000)
//             return
//         }

//         // Trigger the actual secure logout procedure
//         startTransition(async () => {
//             try {
//                 clearProfile()
//                 await logoutAction()
//             } catch (err) {
//                 // FIX: Utilizing the error variable for logging
//                 console.error("Logout failure:", err)
//                 toast.error('Session termination failed. Please refresh the page.')
//                 setConfirming(false)
//             }
//         })
//     }

//     // ── Visual Variants ────────────────────────────────────────────────────────
    
//     // 1. Sidebar Style (Full width, integrated into navigation)
//     if (variant === "sidebar") {
//         return (
//             <button
//                 onClick={handleLogout}
//                 disabled={isPending}
//                 className={cn(
//                     "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all outline-none",
//                     confirming 
//                         ? "bg-amber-500 text-slate-950 animate-pulse" 
//                         : "text-red-400/70 hover:text-red-400 hover:bg-red-400/10",
//                     isPending && "opacity-50 pointer-events-none",
//                     className
//                 )}
//             >
//                 {isPending ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : confirming ? (
//                     <Check className="h-4 w-4" />
//                 ) : (
//                     <LogOut className="h-4 w-4" />
//                 )}
//                 <span>
//                     {isPending ? "Exiting..." : confirming ? "Click to Confirm" : "Terminate Session"}
//                 </span>
//             </button>
//         )
//     }

//     // 2. Header Style (Compact, intended for dropdowns or top bars)
//     return (
//         <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleLogout}
//             disabled={isPending}
//             className={cn(
//                 "rounded-xl transition-all h-9 w-full justify-start",
//                 confirming 
//                     ? "bg-amber-500 text-slate-950 hover:bg-amber-600" 
//                     : "text-slate-400 hover:text-red-400 hover:bg-red-500/10",
//                 className
//             )}
//         >
//             {isPending ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//             ) : confirming ? (
//                 <Check className="h-4 w-4 mr-2" />
//             ) : (
//                 <LogOut className="h-4 w-4 mr-2" />
//             )}
//             <span className="text-[10px] font-black uppercase tracking-widest">
//                 {confirming ? "Confirm?" : "Logout"}
//             </span>
//         </Button>
//     )
// }


'use client'

import React, { useState, useTransition } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { logoutAction } from '@/app/actions/auth'
import { LogOut, Loader2, Check, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface LogoutButtonProps {
    variant?: "sidebar" | "header" | "minimal"
    className?: string
}

/**
 * REGISTRY LOGOUT TERMINAL (Tier 3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold uppercase).
 * Rule 18: Semantic Flip (bg-surface, bg-destructive, border-border).
 * Rule 19: Standardized Geometry (rounded-xl/rounded-2xl).
 * Rule 21: Scale Protocol for clean mathematical brand/error tints.
 */
export function LogoutButton({ variant = "sidebar", className }: LogoutButtonProps) {
    const [confirming, setConfirming] = useState<boolean>(false)
    const [isPending, startTransition] = useTransition()
    const { clearProfile } = useProfileStore()

    const handleLogout = async () => {
        if (!confirming) {
            setConfirming(true)
            // Auto-reset confirmation logic after 4 seconds
            setTimeout(() => setConfirming(false), 4000)
            return
        }

        // Rule 11: Transactional Registry Exit
        startTransition(async () => {
            try {
                clearProfile()
                await logoutAction()
            } catch (err) {
                console.error("[REGISTRY_EXIT_FAULT]:", err)
                toast.error('Session termination protocol failed.')
                setConfirming(false)
            }
        })
    }

    // ── Visual Variants ────────────────────────────────────────────────────────
    
    // 1. Sidebar Style (Rule 11/20)
    if (variant === "sidebar") {
        return (
            <button
                onClick={handleLogout}
                disabled={isPending}
                className={cn(
                    "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all outline-none",
                    confirming 
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20 animate-pulse" 
                        : "text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10",
                    isPending && "opacity-50 pointer-events-none grayscale",
                    className
                )}
            >
                <div className="shrink-0">
                    {isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : confirming ? (
                        <AlertTriangle className="h-5 w-5" />
                    ) : (
                        <LogOut className="h-5 w-5" />
                    )}
                </div>
                <span className="truncate italic">
                    {isPending ? "Exiting_Registry..." : confirming ? "Confirm Exit" : "Terminate Session"}
                </span>
            </button>
        )
    }

    // 2. Header Style (Compact for Dropdowns - Rule 18/21)
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isPending}
            className={cn(
                "rounded-xl transition-all h-10 w-full justify-start px-3",
                confirming 
                    ? "bg-amber-500 text-black hover:bg-amber-600" 
                    : "text-muted-foreground hover:text-destructive hover:bg-destructive/5",
                className
            )}
        >
            <div className="shrink-0 mr-3">
                {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : confirming ? (
                    <Check className="h-4 w-4" />
                ) : (
                    <LogOut className="h-4 w-4" />
                )}
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest">
                {confirming ? "Verify Exit?" : "Logout"}
            </span>
        </Button>
    )
}