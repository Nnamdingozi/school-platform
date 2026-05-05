// 'use client'

// import { useState, useTransition } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//     markNotificationReadAction,
//     deleteNotificationAction,
// } from '@/app/actions/notification.actions'
// import { MessageCircle, Check, Trash2, Loader2, ExternalLink } from 'lucide-react'
// import Link from 'next/link'

// interface NotificationRowProps {
//     notification: {
//         id:        string
//         message:   string
//         link:      string | null
//         read:      boolean
//         createdAt: Date
//     }
// }

// function timeAgo(date: Date): string {
//     const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
//     if (seconds < 60)     return 'just now'
//     if (seconds < 3600)   return `${Math.floor(seconds / 60)}m ago`
//     if (seconds < 86400)  return `${Math.floor(seconds / 3600)}h ago`
//     if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
//     return new Date(date).toLocaleDateString('en-GB', {
//         day: 'numeric', month: 'short', year: 'numeric',
//     })
// }

// export function NotificationRow({ notification }: NotificationRowProps) {
//     const router                        = useRouter()
//     const [read,        setRead]        = useState(notification.read)
//     const [deleted,     setDeleted]     = useState(false)
//     const [markPending, startMarkTrans] = useTransition()
//     const [delPending,  startDelTrans]  = useTransition()

//     if (deleted) return null

//     function handleMarkRead() {
//         if (read) return
//         startMarkTrans(async () => {
//             await markNotificationReadAction(notification.id)
//             setRead(true)
//             router.refresh()
//         })
//     }

//     function handleDelete() {
//         startDelTrans(async () => {
//             await deleteNotificationAction(notification.id)
//             setDeleted(true)
//             router.refresh()
//         })
//     }

//     return (
//         <div
//             className={`group relative flex items-start gap-4 px-5 py-4 transition-all duration-200 ${
//                 read
//                     ? 'bg-transparent hover:bg-school-secondary-800/30'
//                     : 'bg-school-primary/5 hover:bg-school-primary/8'
//             }`}
//         >
//             {/* Unread indicator bar */}
//             {!read && (
//                 <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-school-primary rounded-r-full" />
//             )}

//             {/* Icon */}
//             <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
//                 read
//                     ? 'bg-school-secondary-800 border border-school-secondary-700'
//                     : 'bg-school-primary/20 border border-school-primary/30'
//             }`}>
//                 <MessageCircle className={`h-4 w-4 ${
//                     read ? 'text-school-secondary-400' : 'text-school-primary'
//                 }`} />
//             </div>

//             {/* Content */}
//             <div className="flex-1 min-w-0 space-y-1">
//                 <p className={`text-sm leading-snug ${
//                     read
//                         ? 'text-school-secondary-300 font-normal'
//                         : 'text-white font-medium'
//                 }`}>
//                     {notification.message}
//                 </p>
//                 <div className="flex items-center gap-2">
//                     <span className="text-[11px] text-school-secondary-500">
//                         {timeAgo(notification.createdAt)}
//                     </span>
//                     {!read && (
//                         <span className="inline-flex items-center rounded-full bg-school-primary/20 px-2 py-0.5 text-[10px] font-semibold text-school-primary">
//                             New
//                         </span>
//                     )}
//                     {notification.link && (
//                         <Link
//                             href={notification.link}
//                             onClick={handleMarkRead}
//                             className="inline-flex items-center gap-0.5 text-[11px] text-school-primary hover:underline"
//                         >
//                             View
//                             <ExternalLink className="h-2.5 w-2.5" />
//                         </Link>
//                     )}
//                 </div>
//             </div>

//             {/* Actions — visible on hover */}
//             <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">

//                 {/* Mark as read */}
//                 {!read && (
//                     <button
//                         onClick={handleMarkRead}
//                         disabled={markPending}
//                         title="Mark as read"
//                         className="flex h-7 w-7 items-center justify-center rounded-lg text-school-secondary-400 hover:text-school-primary hover:bg-school-primary/10 transition-all disabled:opacity-50"
//                     >
//                         {markPending
//                             ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                             : <Check className="h-3.5 w-3.5" />
//                         }
//                     </button>
//                 )}

//                 {/* Delete */}
//               {/* Delete */}
// <button
//     onClick={handleDelete}
//     disabled={delPending}
//     title="Delete notification"
//     className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all disabled:opacity-50"
// >
//     {delPending
//         ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
//         : <Trash2 className="h-3.5 w-3.5" />
//     }
// </button>

//             </div>

//             {/* Unread dot — hidden when actions visible */}
//             {!read && (
//                 <div className="flex h-7 w-7 shrink-0 items-center justify-center group-hover:hidden">
//                     <span className="h-2 w-2 rounded-full bg-school-primary" />
//                 </div>
//             )}
//         </div>
//     )
// }



'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
    markNotificationReadAction,
    deleteNotificationAction,
} from '@/app/actions/notifications'
import { MessageCircle, Check, Trash2, Loader2, ExternalLink, Zap } from 'lucide-react'
import Link from 'next/link'
import { useProfileStore } from '@/store/profileStore'
import { cn } from '@/lib/utils'

interface NotificationRowProps {
    notification: {
        id:        string
        message:   string
        link:      string | null
        read:      boolean
        createdAt: Date
    }
}

function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60)     return 'just now'
    if (seconds < 3600)   return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400)  return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
    })
}

/**
 * TIER 3 NOTIFICATION ITEM
 * Rule 14: Optimistic UI state updates.
 * Rule 17: Branding color injection via Zustand.
 */
export function NotificationRow({ notification }: NotificationRowProps) {
    const router = useRouter()
    const { profile } = useProfileStore();
    
    // State
    const [read, setRead] = useState(notification.read)
    const [deleted, setDeleted] = useState(false)
    const [markPending, startMarkTrans] = useTransition()
    const [delPending, startDelTrans] = useTransition()

    const primaryColor = profile?.primaryColor || "#f59e0b";

    if (deleted) return null

    // Rule 14: Optimistic "Mark as Read"
    function handleMarkRead() {
        if (read) return
        startMarkTrans(async () => {
            setRead(true) // Immediate UI feedback
            const res = await markNotificationReadAction(notification.id)
            if (!res.success) setRead(false) // Rollback on failure
            router.refresh()
        })
    }

    // Rule 14: Optimistic "Delete"
    function handleDelete() {
        startDelTrans(async () => {
            setDeleted(true) // Immediate UI removal
            const res = await deleteNotificationAction(notification.id)
            if (!res.success) setDeleted(false) // Rollback on failure
            router.refresh()
        })
    }

    return (
        <div
            className={cn(
                "group relative flex items-start gap-5 px-8 py-6 transition-all duration-300",
                read ? "bg-transparent opacity-60 hover:opacity-100" : "bg-white/[0.02]"
            )}
        >
            {/* Unread indicator bar */}
            {!read && (
                <div 
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full shadow-lg" 
                    style={{ backgroundColor: primaryColor }}
                />
            )}

            {/* Icon Context */}
            <div className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all",
                read ? "bg-slate-950 border-white/5" : "bg-slate-900 border-white/10"
            )}>
                <MessageCircle 
                    className="h-5 w-5 transition-colors" 
                    style={{ color: read ? '#475569' : primaryColor }} 
                />
            </div>

            {/* Content Payload */}
            <div className="flex-1 min-w-0 space-y-2">
                <p className={cn(
                    "text-sm leading-relaxed transition-colors",
                    read ? "text-slate-400" : "text-white font-bold"
                )}>
                    {notification.message}
                </p>
                
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">
                        {timeAgo(notification.createdAt)}
                    </span>
                    {!read && (
                        <span 
                            className="inline-flex items-center rounded-md px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter"
                            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                        >
                            Registry Update
                        </span>
                    )}
                    {notification.link && (
                        <Link
                            href={notification.link}
                            onClick={handleMarkRead}
                            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest hover:brightness-125 transition-all"
                            style={{ color: primaryColor }}
                        >
                            Synchronize <ExternalLink className="h-3 w-3" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Administrative Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!read && (
                    <button
                        onClick={handleMarkRead}
                        disabled={markPending}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 border border-white/5 text-slate-500 hover:text-white transition-all disabled:opacity-50"
                        title="Mark as synchronized"
                    >
                        {markPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    </button>
                )}

                <button
                    onClick={handleDelete}
                    disabled={delPending}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 border border-white/5 text-slate-700 hover:text-red-500 hover:border-red-500/30 transition-all disabled:opacity-50"
                    title="Purge notification"
                >
                    {delPending ? <Loader2 className="h-4 w-4 animate-spin text-red-500" /> : <Trash2 className="h-4 w-4" />}
                </button>
            </div>
        </div>
    )
}