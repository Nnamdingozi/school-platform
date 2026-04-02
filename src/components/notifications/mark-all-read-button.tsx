'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { markAllNotificationsReadAction } from '@/app/actions/notification.actions'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function MarkAllReadButton({ unreadCount }: { unreadCount: number }) {
    const router              = useRouter()
    const [pending, startTrans] = useTransition()

    function handleMarkAll() {
        startTrans(async () => {
            const result = await markAllNotificationsReadAction()
            if (result.success) {
                toast.success('All notifications marked as read.')
                router.refresh()
            } else {
                toast.error('Failed to mark all as read.')
            }
        })
    }

    return (
        <button
            onClick={handleMarkAll}
            disabled={unreadCount === 0 || pending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-school-primary hover:bg-school-primary/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
            {pending
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <CheckCircle2 className="h-3.5 w-3.5" />
            }
            Mark all read
        </button>
    )
}