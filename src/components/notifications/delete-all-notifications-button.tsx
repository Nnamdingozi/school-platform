// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { deleteAllNotificationsAction } from '@/app/actions/notifications'
// import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
// import { toast } from 'sonner'

// interface Props {
//     disabled?: boolean
// }

// export function DeleteAllNotificationsButton({ disabled }: Props) {
//     const router          = useRouter()
//     const [loading,   setLoading]   = useState(false)
//     const [showConfirm, setShowConfirm] = useState(false)

//     async function handleDeleteAll() {
//         setLoading(true)
//         const result = await deleteAllNotificationsAction()
//         if (result.success) {
//             toast.success('All notifications deleted.')
//             router.refresh()
//         } else {
//             toast.error('Failed to delete notifications.')
//         }
//         setLoading(false)
//         setShowConfirm(false)
//     }

//     if (showConfirm) return (
//         <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5">
//             <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
//             <span className="text-xs text-red-300">Delete all?</span>
//             <button
//                 onClick={handleDeleteAll}
//                 disabled={loading}
//                 className="text-xs font-bold text-red-400 hover:text-red-300 disabled:opacity-50"
//             >
//                 {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Yes'}
//             </button>
//             <span className="text-red-500/50">·</span>
//             <button
//                 onClick={() => setShowConfirm(false)}
//                 className="text-xs text-school-secondary-400 hover:text-white"
//             >
//                 Cancel
//             </button>
//         </div>
//     )

//     return (
//         <button
//             onClick={() => setShowConfirm(true)}
//             disabled={disabled}
//             className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
//         >
//             <Trash2 className="h-3.5 w-3.5" />
//             Delete all
//         </button>
//     )
// }






// 'use client'

// import { useState, useTransition } from 'react'
// import { useRouter } from 'next/navigation'
// import { deleteAllNotificationsAction } from '@/app/actions/notifications'
// import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react'
// import { toast } from 'sonner'
// import { useProfileStore } from '@/store/profileStore'
// import { cn } from '@/lib/utils'

// interface DeleteAllNotificationsButtonProps {
//     disabled?: boolean
// }

// /**
//  * REGISTRY PURGE UTILITY (Tier 3)
//  * Rule 14: Uses useTransition for smooth server-side synchronization.
//  * Rule 17: Leverages Zustand for branding context.
//  */
// export function DeleteAllNotificationsButton({ disabled }: DeleteAllNotificationsButtonProps) {
//     const router = useRouter();
//     const { profile } = useProfileStore();
//     const [isPending, startTransition] = useTransition();
//     const [showConfirm, setShowConfirm] = useState(false);

//     const primaryColor = profile?.primaryColor || "#f59e0b";

//     const handleDeleteAll = () => {
//         startTransition(async () => {
//             try {
//                 // Rule 11: Final System Truth update on server
//                 const result = await deleteAllNotificationsAction();
                
//                 if (result.success) {
//                     toast.success('Communication ledger purged.');
//                     setShowConfirm(false);
//                     // Rule 14: Sync the server-side list immediately
//                     router.refresh();
//                 } else {
//                     toast.error('Registry purge failed.');
//                 }
//             } catch (error: unknown) {
//                 toast.error('A critical registry error occurred.');
//             }
//         });
//     }

//     if (showConfirm) return (
//         <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 animate-in slide-in-from-right-2">
//             <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
//             <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter">Purge Ledger?</span>
            
//             <div className="flex items-center gap-2 ml-1">
//                 <button
//                     onClick={handleDeleteAll}
//                     disabled={isPending}
//                     className="text-[10px] font-black text-white hover:text-red-400 uppercase tracking-widest disabled:opacity-50 transition-colors"
//                 >
//                     {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Confirm'}
//                 </button>
//                 <span className="text-red-900/30">|</span>
//                 <button
//                     onClick={() => setShowConfirm(false)}
//                     disabled={isPending}
//                     className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
//                 >
//                     Cancel
//                 </button>
//             </div>
//         </div>
//     )

//     return (
//         <button
//             onClick={() => setShowConfirm(true)}
//             disabled={disabled || isPending}
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
//         >
//             <Trash2 className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
//             Purge All
//         </button>
//     );
// }


'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteAllNotificationsAction } from '@/app/actions/notifications'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getErrorMessage } from '@/lib/error-handler'

interface DeleteAllNotificationsButtonProps {
    disabled?: boolean
}

/**
 * REGISTRY PURGE UTILITY (Tier 3)
 * Rule 11: High-fidelity Registry Typography (font-bold uppercase metadata).
 * Rule 14: Use transition for smooth server-side synchronization.
 * Rule 18: Semantic Flip (bg-surface, bg-destructive, border-border).
 * Rule 19: Standardized Geometry (rounded-xl/2xl).
 * Rule 21: Scale Protocol for clean mathematical tints.
 */
export function DeleteAllNotificationsButton({ disabled }: DeleteAllNotificationsButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDeleteAll = () => {
        startTransition(async () => {
            try {
                // Rule 11: System Truth synchronization
                const result = await deleteAllNotificationsAction();
                
                if (result.success) {
                    toast.success('Communication ledger purged.');
                    setShowConfirm(false);
                    // Rule 14: Immediate Registry Refresh
                    router.refresh();
                } else {
                    toast.error('Registry purge protocol failed.');
                }
            } catch (error: unknown) {
                getErrorMessage(error)
                toast.error('Critical registry synchronization failure.');
            }
        });
    }

    if (showConfirm) return (
        <div className="flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-2 animate-in slide-in-from-right-2 duration-300">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
            <span className="text-[10px] font-bold text-destructive uppercase tracking-widest italic">Purge Ledger?</span>
            
            <div className="flex items-center gap-3 ml-2">
                <button
                    onClick={handleDeleteAll}
                    disabled={isPending}
                    className="text-[10px] font-extrabold text-foreground hover:text-destructive uppercase tracking-widest disabled:opacity-20 transition-all active:scale-95"
                >
                    {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Confirm'}
                </button>
                <div className="h-3 w-px bg-destructive/20" />
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isPending}
                    className="text-[10px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-all"
                >
                    Cancel
                </button>
            </div>
        </div>
    )

    return (
        <button
            onClick={() => setShowConfirm(true)}
            disabled={disabled || isPending}
            className={cn(
                "inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all active:scale-95 group",
                "bg-surface border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5", // Rule 18
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale shadow-sm"
            )}
        >
            <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Purge All Records</span>
        </button>
    );
}