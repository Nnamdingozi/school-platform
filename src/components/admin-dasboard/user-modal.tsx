'use client'

import { useState } from 'react'
import { Loader2, Trash2, UserX, UserCheck, AlertTriangle } from 'lucide-react'
import {
    deleteUser,
    deactivateUser,
    reactivateUser,
} from '@/app/actions/user-management'
import { toast } from 'sonner'

// ── Types ──────────────────────────────────────────────────────────────────────
export type UserActionType = 'delete' | 'deactivate' | 'reactivate'

interface UserActionsModalProps {
    userId:    string
    userName:  string | null
    userEmail: string
    action:    UserActionType
    onClose:   () => void
    onSuccess: () => void
}

// ── Config per action type ─────────────────────────────────────────────────────
const ACTION_CONFIG: Record<UserActionType, {
    title:       string
    description: (name: string) => string
    confirmLabel: string
    icon:        React.ElementType
    iconColor:   string
    iconBg:      string
    buttonClass: string
}> = {
    delete: {
        title:        'Delete User',
        description:  (name) => `Are you sure you want to permanently delete ${name}? All their data including assessments, enrollments and notifications will be removed. This cannot be undone.`,
        confirmLabel: 'Delete Permanently',
        icon:         Trash2,
        iconColor:    'text-red-400',
        iconBg:       'bg-red-500/10 border-red-500/20',
        buttonClass:  'bg-red-500 hover:bg-red-600 text-white',
    },
    deactivate: {
        title:        'Deactivate User',
        description:  (name) => `Are you sure you want to deactivate ${name}? They will no longer be able to log in but all their data will be preserved. You can reactivate them at any time.`,
        confirmLabel: 'Deactivate',
        icon:         UserX,
        iconColor:    'text-amber-400',
        iconBg:       'bg-amber-500/10 border-amber-500/20',
        buttonClass:  'bg-amber-500 hover:bg-amber-600 text-school-secondary-950',
    },
    reactivate: {
        title:        'Reactivate User',
        description:  (name) => `Are you sure you want to reactivate ${name}? They will be able to log in again immediately.`,
        confirmLabel: 'Reactivate',
        icon:         UserCheck,
        iconColor:    'text-green-400',
        iconBg:       'bg-green-500/10 border-green-500/20',
        buttonClass:  'bg-green-500 hover:bg-green-600 text-white',
    },
}

// ── Toast messages per action ──────────────────────────────────────────────────
const SUCCESS_MESSAGES: Record<UserActionType, string> = {
    delete:     'User deleted successfully.',
    deactivate: 'User deactivated successfully.',
    reactivate: 'User reactivated successfully.',
}

const ERROR_MESSAGES: Record<UserActionType, string> = {
    delete:     'Failed to delete user.',
    deactivate: 'Failed to deactivate user.',
    reactivate: 'Failed to reactivate user.',
}

// ── Component ──────────────────────────────────────────────────────────────────
export function UserActionsModal({
    userId,
    userName,
    userEmail,
    action,
    onClose,
    onSuccess,
}: UserActionsModalProps) {
    const [loading, setLoading] = useState(false)
    const config   = ACTION_CONFIG[action]
    const Icon     = config.icon
    const display  = userName ?? userEmail

    async function handleConfirm() {
        setLoading(true)

        const result =
            action === 'delete'     ? await deleteUser(userId)     :
            action === 'deactivate' ? await deactivateUser(userId) :
                                      await reactivateUser(userId)

        if (result.success) {
            toast.success(SUCCESS_MESSAGES[action])
            onSuccess()
        } else {
            toast.error(result.error ?? ERROR_MESSAGES[action])
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-school-secondary-900 border border-school-secondary-700 rounded-2xl shadow-2xl">

                {/* Body */}
                <div className="p-6 space-y-4">

                    {/* Icon + Title */}
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.iconBg}`}>
                            <Icon className={`h-5 w-5 ${config.iconColor}`} />
                        </div>
                        <h3 className="text-base font-bold text-white">
                            {config.title}
                        </h3>
                    </div>

                    {/* Warning banner for delete */}
                    {action === 'delete' && (
                        <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5">
                            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-red-300 font-medium">
                                This action is irreversible and cannot be undone.
                            </p>
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-sm text-school-secondary-300 leading-relaxed">
                        {config.description(display)}
                    </p>

                    {/* User pill */}
                    <div className="flex items-center gap-2 rounded-lg bg-school-secondary-800 border border-school-secondary-700 px-3 py-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-school-primary/20">
                            <span className="text-[10px] font-bold text-school-primary">
                                {display.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0">
                            {userName && (
                                <p className="text-xs font-semibold text-white truncate">
                                    {userName}
                                </p>
                            )}
                            <p className="text-[11px] text-school-secondary-400 truncate">
                                {userEmail}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex gap-2 px-6 pb-6">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl border border-school-secondary-700 text-school-secondary-300 hover:text-white hover:border-school-secondary-500 text-sm font-semibold transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${config.buttonClass}`}
                    >
                        {loading
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                            : config.confirmLabel
                        }
                    </button>
                </div>

            </div>
        </div>
    )
}