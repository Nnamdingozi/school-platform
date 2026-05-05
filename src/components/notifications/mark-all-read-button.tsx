// 'use client'

// import { useTransition } from 'react'
// import { useRouter } from 'next/navigation'
// import { markAllNotificationsReadAction } fro@/app/actions/notificationsion'
// import { CheckCircle2, Loader2 } from 'lucide-react'
// import { toast } from 'sonner'

// export function MarkAllReadButton({ unreadCount }: { unreadCount: number }) {
//     const router              = useRouter()
//     const [pending, startTrans] = useTransition()

//     function handleMarkAll() {
//         startTrans(async () => {
//             const result = await markAllNotificationsReadAction()
//             if (result.success) {
//                 toast.success('All notifications marked as read.')
//                 router.refresh()
//             } else {
//                 toast.error('Failed to mark all as read.')
//             }
//         })
//     }

//     return (
//         <button
//             onClick={handleMarkAll}
//             disabled={unreadCount === 0 || pending}
//             className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-school-primary hover:bg-school-primary/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
//         >
//             {pending
//                 ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                 : <CheckCircle2 className="h-3.5 w-3.5" />
//             }
//             Mark all read
//         </button>
//     )
// }


'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { markAllNotificationsReadAction } from '@/app/actions/notifications'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useProfileStore } from '@/store/profileStore'

interface MarkAllReadButtonProps {
    unreadCount: number;
}

/**
 * REGISTRY UTILITY COMPONENT
 * Rule 14: Triggers server-side revalidation (router.refresh).
 * Rule 17: Pulls primaryColor from Zustand to theme the button.
 */
export function MarkAllReadButton({ unreadCount }: MarkAllReadButtonProps) {
    const router = useRouter();
    const { profile } = useProfileStore();
    const [isPending, startTransition] = useTransition();

    const primaryColor = profile?.primaryColor || "#f59e0b";

    function handleMarkAll() {
        if (unreadCount === 0) return;

        startTransition(async () => {
            try {
                // Rule 11: Final System Truth update on server
                const result = await markAllNotificationsReadAction();
                
                if (result.success) {
                    toast.success('Communication registry synchronized.');
                    // Rule 14: Refresh current server page data
                    router.refresh();
                } else {
                    toast.error('Registry sync failed.');
                }
            } catch (error: unknown) {
                toast.error('A critical connection error occurred.');
            }
        });
    }

    return (
        <button
            onClick={handleMarkAll}
            disabled={unreadCount === 0 || isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
            style={{ 
                backgroundColor: `${primaryColor}10`,
                color: unreadCount > 0 ? primaryColor : '#475569' 
            }}
        >
            {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
                <CheckCircle2 className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
            )}
            Mark all as read
        </button>
    );
}