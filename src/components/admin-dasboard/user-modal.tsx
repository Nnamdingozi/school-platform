// 'use client'

// import { useState } from 'react'
// import { Loader2, Trash2, UserX, UserCheck, AlertTriangle } from 'lucide-react'
// import {
//     deleteUser,
//     deactivateUser,
//     reactivateUser,
// } from '@/app/actions/user-management'
// import { toast } from 'sonner'

// // ── Types ──────────────────────────────────────────────────────────────────────
// export type UserActionType = 'delete' | 'deactivate' | 'reactivate'

// interface UserActionsModalProps {
//     userId:    string
//     userName:  string | null
//     userEmail: string
//     action:    UserActionType
//     onClose:   () => void
//     onSuccess: () => void
// }

// // ── Config per action type ─────────────────────────────────────────────────────
// const ACTION_CONFIG: Record<UserActionType, {
//     title:       string
//     description: (name: string) => string
//     confirmLabel: string
//     icon:        React.ElementType
//     iconColor:   string
//     iconBg:      string
//     buttonClass: string
// }> = {
//     delete: {
//         title:        'Delete User',
//         description:  (name) => `Are you sure you want to permanently delete ${name}? All their data including assessments, enrollments and notifications will be removed. This cannot be undone.`,
//         confirmLabel: 'Delete Permanently',
//         icon:         Trash2,
//         iconColor:    'text-red-400',
//         iconBg:       'bg-red-500/10 border-red-500/20',
//         buttonClass:  'bg-red-500 hover:bg-red-600 text-white',
//     },
//     deactivate: {
//         title:        'Deactivate User',
//         description:  (name) => `Are you sure you want to deactivate ${name}? They will no longer be able to log in but all their data will be preserved. You can reactivate them at any time.`,
//         confirmLabel: 'Deactivate',
//         icon:         UserX,
//         iconColor:    'text-amber-400',
//         iconBg:       'bg-amber-500/10 border-amber-500/20',
//         buttonClass:  'bg-amber-500 hover:bg-amber-600 text-school-secondary-950',
//     },
//     reactivate: {
//         title:        'Reactivate User',
//         description:  (name) => `Are you sure you want to reactivate ${name}? They will be able to log in again immediately.`,
//         confirmLabel: 'Reactivate',
//         icon:         UserCheck,
//         iconColor:    'text-green-400',
//         iconBg:       'bg-green-500/10 border-green-500/20',
//         buttonClass:  'bg-green-500 hover:bg-green-600 text-white',
//     },
// }

// // ── Toast messages per action ──────────────────────────────────────────────────
// const SUCCESS_MESSAGES: Record<UserActionType, string> = {
//     delete:     'User deleted successfully.',
//     deactivate: 'User deactivated successfully.',
//     reactivate: 'User reactivated successfully.',
// }

// const ERROR_MESSAGES: Record<UserActionType, string> = {
//     delete:     'Failed to delete user.',
//     deactivate: 'Failed to deactivate user.',
//     reactivate: 'Failed to reactivate user.',
// }

// // ── Component ──────────────────────────────────────────────────────────────────
// export function UserActionsModal({
//     userId,
//     userName,
//     userEmail,
//     action,
//     onClose,
//     onSuccess,
// }: UserActionsModalProps) {
//     const [loading, setLoading] = useState(false)
//     const config   = ACTION_CONFIG[action]
//     const Icon     = config.icon
//     const display  = userName ?? userEmail

//     async function handleConfirm() {
//         setLoading(true)

//         const result =
//             action === 'delete'     ? await deleteUser(userId)     :
//             action === 'deactivate' ? await deactivateUser(userId) :
//                                       await reactivateUser(userId)

//         if (result.success) {
//             toast.success(SUCCESS_MESSAGES[action])
//             onSuccess()
//         } else {
//             toast.error(result.error ?? ERROR_MESSAGES[action])
//             setLoading(false)
//         }
//     }

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//             <div className="w-full max-w-sm bg-school-secondary-900 border border-school-secondary-700 rounded-2xl shadow-2xl">

//                 {/* Body */}
//                 <div className="p-6 space-y-4">

//                     {/* Icon + Title */}
//                     <div className="flex items-center gap-3">
//                         <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.iconBg}`}>
//                             <Icon className={`h-5 w-5 ${config.iconColor}`} />
//                         </div>
//                         <h3 className="text-base font-bold text-white">
//                             {config.title}
//                         </h3>
//                     </div>

//                     {/* Warning banner for delete */}
//                     {action === 'delete' && (
//                         <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5">
//                             <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
//                             <p className="text-xs text-red-300 font-medium">
//                                 This action is irreversible and cannot be undone.
//                             </p>
//                         </div>
//                     )}

//                     {/* Description */}
//                     <p className="text-sm text-school-secondary-300 leading-relaxed">
//                         {config.description(display)}
//                     </p>

//                     {/* User pill */}
//                     <div className="flex items-center gap-2 rounded-lg bg-school-secondary-800 border border-school-secondary-700 px-3 py-2">
//                         <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-school-primary/20">
//                             <span className="text-[10px] font-bold text-school-primary">
//                                 {display.charAt(0).toUpperCase()}
//                             </span>
//                         </div>
//                         <div className="min-w-0">
//                             {userName && (
//                                 <p className="text-xs font-semibold text-white truncate">
//                                     {userName}
//                                 </p>
//                             )}
//                             <p className="text-[11px] text-school-secondary-400 truncate">
//                                 {userEmail}
//                             </p>
//                         </div>
//                     </div>

//                 </div>

//                 {/* Footer */}
//                 <div className="flex gap-2 px-6 pb-6">
//                     <button
//                         onClick={onClose}
//                         disabled={loading}
//                         className="flex-1 py-2.5 rounded-xl border border-school-secondary-700 text-school-secondary-300 hover:text-white hover:border-school-secondary-500 text-sm font-semibold transition-all disabled:opacity-50"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleConfirm}
//                         disabled={loading}
//                         className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${config.buttonClass}`}
//                     >
//                         {loading
//                             ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
//                             : config.confirmLabel
//                         }
//                     </button>
//                 </div>

//             </div>
//         </div>
//     )
// }



// 'use client'

// import { useState } from 'react'
// import { Loader2, Trash2, UserX, UserCheck, AlertTriangle } from 'lucide-react'
// import { deleteUser, deactivateUser, reactivateUser } from '@/app/actions/user-management'
// import { toast } from 'sonner'
// import { useProfileStore } from '@/store/profileStore'

// export type UserActionType = 'delete' | 'deactivate' | 'reactivate'

// interface UserActionsModalProps {
//     userId:    string
//     userName:  string | null
//     userEmail: string
//     action:    UserActionType
//     onClose:   () => void
//     onSuccess: () => void
// }

// export function UserActionsModal({ userId, userName, userEmail, action, onClose, onSuccess }: UserActionsModalProps) {
//     const [loading, setLoading] = useState(false)
//     const { profile } = useProfileStore()
//     const primaryColor = profile?.primaryColor || "#f59e0b"

//     const display = userName ?? userEmail

//     async function handleConfirm() {
//         setLoading(true)
//         const result = 
//             action === 'delete' ? await deleteUser(userId) :
//             action === 'deactivate' ? await deactivateUser(userId) :
//             await reactivateUser(userId)

//         if (result.success) {
//             toast.success("Identity updated successfully.");
//             onSuccess();
//         } else {
//             toast.error(result.error || "Registry update failed.");
//             setLoading(false);
//         }
//     }

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
//             <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
//                 <div className="p-8 space-y-6">
//                     <div className="flex items-center gap-4">
//                         <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-slate-950 border border-white/5 shadow-inner">
//                             {action === 'delete' ? <Trash2 className="text-red-500" /> : <UserX className="text-amber-500" />}
//                         </div>
//                         <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Registry Action</h3>
//                     </div>

//                     <p className="text-sm text-slate-400 leading-relaxed italic">
//                         {action === 'delete' 
//                             ? `Are you sure you want to purge ${display}? This action is irreversible.` 
//                             : `Deactivate registry access for ${display}? Account will be locked.`}
//                     </p>

//                     <div className="flex gap-3">
//                         <button onClick={onClose} className="flex-1 py-4 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all">Cancel</button>
//                         <button 
//                             onClick={handleConfirm} 
//                             disabled={loading}
//                             className="flex-1 py-4 rounded-xl text-[10px] font-black uppercase transition-all disabled:opacity-50 shadow-xl"
//                             style={{ backgroundColor: action === 'delete' ? '#ef4444' : primaryColor, color: '#000' }}
//                         >
//                             {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Confirm"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }




'use client'

import React, { useState } from 'react'
import { Loader2, Trash2, UserX, UserCheck, AlertTriangle } from 'lucide-react'
import { deleteUser, deactivateUser, reactivateUser } from '@/app/actions/user-management'
import { toast } from 'sonner'
import { useProfileStore } from '@/store/profileStore'
import { cn } from '@/lib/utils'

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

export type UserActionType = 'delete' | 'deactivate' | 'reactivate'

interface UserActionsModalProps {
    userId:    string
    userName:  string | null
    userEmail: string
    action:    UserActionType
    onClose:   () => void
    onSuccess: () => void
}

/**
 * USER ACTIONS MODAL (Tier 2/3)
 * Rule 18: Semantic Color Flip (bg-card, bg-surface, border-border).
 * Rule 19: Standardized Radius [2rem] for modals.
 * Rule 11: Refined Typography for Registry density.
 */
export function UserActionsModal({ 
    userId, 
    userName, 
    userEmail, 
    action, 
    onClose, 
    onSuccess 
}: UserActionsModalProps) {
    const [loading, setLoading] = useState(false)
    const { profile } = useProfileStore()

    const displayIdentity = userName ?? userEmail

    async function handleConfirm() {
        setLoading(true)
        try {
            const result = 
                action === 'delete' ? await deleteUser(userId) :
                action === 'deactivate' ? await deactivateUser(userId) :
                await reactivateUser(userId)

            if (result.success) {
                toast.success("Identity Registry Updated.");
                onSuccess();
            } else {
                toast.error(result.error || "Update Failed.");
                setLoading(false);
            }
        } catch (error) {
            toast.error("Registry Protocol Breach: Action Aborted.");
            setLoading(false);
        }
    }

    // Determine Icon based on Action
    const ActionIcon = action === 'delete' ? Trash2 : action === 'deactivate' ? UserX : UserCheck
    const iconColor = action === 'delete' ? "text-destructive" : "text-school-primary"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            
            {/* Rule 19: Standardized Modal Geometry [2rem] */}
            <div className="w-full max-w-sm bg-card border border-border rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 md:p-10 space-y-8">
                    
                    {/* Header Section */}
                    <div className="flex items-center gap-5">
                        {/* Rule 19: Internal item radius 2xl */}
                        <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-surface border border-border shadow-inner">
                            <ActionIcon className={cn("h-6 w-6", iconColor)} />
                        </div>
                        <h3 className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter">
                            Registry Action
                        </h3>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-2">
                        <p className="text-sm text-foreground font-medium leading-relaxed italic">
                            {action === 'delete' 
                                ? `Purge all data for ${displayIdentity}?` 
                                : action === 'deactivate' 
                                ? `Lock registry access for ${displayIdentity}?`
                                : `Restore access for ${displayIdentity}?`}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">
                            {action === 'delete' 
                                ? "This action is irreversible and permanent." 
                                : "Identity credentials will be modified."}
                        </p>
                    </div>

                    {/* Action Buttons (Rule 20) */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                            onClick={onClose} 
                            disabled={loading}
                            className="flex-1 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-surface transition-all border border-transparent hover:border-border"
                        >
                            Cancel
                        </button>
                        
                        <button 
                            onClick={handleConfirm} 
                            disabled={loading}
                            className={cn(
                                "flex-1 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50",
                                action === 'delete' 
                                    ? "bg-destructive text-destructive-foreground hover:brightness-110" 
                                    : "bg-school-primary text-on-school-primary hover:brightness-110"
                            )}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                            ) : (
                                "Confirm"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}