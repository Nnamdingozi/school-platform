'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteAllNotificationsAction } from '@/app/actions/notification.actions'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
    disabled?: boolean
}

export function DeleteAllNotificationsButton({ disabled }: Props) {
    const router          = useRouter()
    const [loading,   setLoading]   = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    async function handleDeleteAll() {
        setLoading(true)
        const result = await deleteAllNotificationsAction()
        if (result.success) {
            toast.success('All notifications deleted.')
            router.refresh()
        } else {
            toast.error('Failed to delete notifications.')
        }
        setLoading(false)
        setShowConfirm(false)
    }

    if (showConfirm) return (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
            <span className="text-xs text-red-300">Delete all?</span>
            <button
                onClick={handleDeleteAll}
                disabled={loading}
                className="text-xs font-bold text-red-400 hover:text-red-300 disabled:opacity-50"
            >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Yes'}
            </button>
            <span className="text-red-500/50">·</span>
            <button
                onClick={() => setShowConfirm(false)}
                className="text-xs text-school-secondary-400 hover:text-white"
            >
                Cancel
            </button>
        </div>
    )

    return (
        <button
            onClick={() => setShowConfirm(true)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
            <Trash2 className="h-3.5 w-3.5" />
            Delete all
        </button>
    )
}