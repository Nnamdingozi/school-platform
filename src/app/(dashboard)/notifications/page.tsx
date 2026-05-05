// import { getMyNotificationsAction } from '@/app/actions/notification.actions'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Bell, MessageCircle, Inbox } from 'lucide-react'
// import { NotificationRow } from '@/components/notifications/notification-row'
// import { MarkAllReadButton } from '@/components/notifications/mark-all-read-button'
// import { DeleteAllNotificationsButton } from '@/components/notifications/delete-all-notifications-button'

// export const dynamic = 'force-dynamic'

// export default async function NotificationsPage() {
//     const result        = await getMyNotificationsAction()
//     const notifications = result.success && result.data ? result.data.notifications : []
//     const unreadCount   = result.success && result.data ? result.data.unreadCount   : 0

//     return (
//         <div className="min-h-screen bg-school-secondary-950 px-4 py-8 sm:px-6 lg:px-8">
//             <div className="mx-auto max-w-2xl space-y-6">

//                 {/* ── Page header ── */}
//                 <div className="space-y-1">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-school-primary/15 border border-school-primary/20">
//                             <Bell className="h-5 w-5 text-school-primary" />
//                         </div>
//                         <div>
//                             <h1 className="text-xl font-black tracking-tight text-white">
//                                 Notifications
//                             </h1>
//                             <p className="text-xs text-school-secondary-400">
//                                 Stay up to date with your school activity
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ── Stats + Actions bar ── */}
//                 <div className="flex items-center justify-between gap-4 rounded-2xl border border-school-secondary-800 bg-school-secondary-900 px-4 py-3">
//                     <div className="flex items-center gap-4">
//                         <div className="flex items-center gap-2">
//                             <Inbox className="h-4 w-4 text-school-secondary-400" />
//                             <span className="text-sm font-semibold text-white">
//                                 {notifications.length}
//                             </span>
//                             <span className="text-xs text-school-secondary-400">total</span>
//                         </div>
//                         {unreadCount > 0 && (
//                             <>
//                                 <div className="h-4 w-px bg-school-secondary-700" />
//                                 <div className="flex items-center gap-2">
//                                     <span className="h-2 w-2 rounded-full bg-school-primary animate-pulse" />
//                                     <span className="text-sm font-semibold text-school-primary">
//                                         {unreadCount}
//                                     </span>
//                                     <span className="text-xs text-school-secondary-400">unread</span>
//                                 </div>
//                             </>
//                         )}
//                     </div>

//                     {/* Actions */}
//                     <div className="flex items-center gap-2">
//                         <MarkAllReadButton unreadCount={unreadCount} />
//                         <DeleteAllNotificationsButton
//                             disabled={notifications.length === 0}
//                         />
//                     </div>
//                 </div>

//                 {/* ── Notifications list ── */}
//                 <div className="rounded-2xl border border-school-secondary-800 bg-school-secondary-900 overflow-hidden">
//                     {notifications.length === 0 ? (

//                         /* ── Empty state ── */
//                         <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
//                             <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-school-secondary-800 border border-school-secondary-700">
//                                 <MessageCircle className="h-8 w-8 text-school-secondary-500" />
//                             </div>
//                             <div className="space-y-1">
//                                 <p className="text-sm font-bold text-white">
//                                     No notifications yet
//                                 </p>
//                                 <p className="text-xs text-school-secondary-400 max-w-xs">
//                                     When your school admins or teachers share updates, they will appear here.
//                                 </p>
//                             </div>
//                         </div>

//                     ) : (
//                         <ScrollArea className="h-[600px]">
//                             <div className="divide-y divide-school-secondary-800/60">
//                                 {notifications.map((n, i) => (
//                                     <NotificationRow
//                                         key={n.id}
//                                         notification={n}
//                                         index={i}
//                                     />
//                                 ))}
//                             </div>
//                         </ScrollArea>
//                     )}
//                 </div>

//             </div>
//         </div>
//     )
// }


// import { getMyNotificationsAction } from '@/app/actions/notification.actions'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Bell, MessageCircle, Inbox } from 'lucide-react'
// import { NotificationRow } from '@/components/notifications/notification-row'
// import { MarkAllReadButton } from '@/components/notifications/mark-all-read-button'
// import { DeleteAllNotificationsButton } from '@/components/notifications/delete-all-notifications-button'

// export const dynamic = 'force-dynamic'

// export default async function NotificationsPage() {
//     const result        = await getMyNotificationsAction()
//     const notifications = result.success && result.data ? result.data.notifications : []
//     const unreadCount   = result.success && result.data ? result.data.unreadCount   : 0

//     return (
//         <div className="min-h-screen bg-school-secondary-950 px-4 py-8 sm:px-6 lg:px-8">
//             <div className="mx-auto max-w-2xl space-y-6">

//                 {/* ── Page header ── */}
//                 <div className="space-y-1">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-school-primary/15 border border-school-primary/20">
//                             <Bell className="h-5 w-5 text-school-primary" />
//                         </div>
//                         <div>
//                             <h1 className="text-xl font-black tracking-tight text-white uppercase italic">
//                                 Notifications
//                             </h1>
//                             <p className="text-xs text-school-secondary-400 font-medium">
//                                 Stay up to date with your school activity
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ── Stats + Actions bar ── */}
//                 <div className="flex items-center justify-between gap-4 rounded-2xl border border-school-secondary-800 bg-school-secondary-900 px-4 py-3 shadow-xl">
//                     <div className="flex items-center gap-4">
//                         <div className="flex items-center gap-2">
//                             <Inbox className="h-4 w-4 text-school-secondary-400" />
//                             <span className="text-sm font-bold text-white uppercase tracking-tighter">
//                                 {notifications.length} Total
//                             </span>
//                         </div>
//                         {unreadCount > 0 && (
//                             <>
//                                 <div className="h-4 w-px bg-school-secondary-700" />
//                                 <div className="flex items-center gap-2">
//                                     <span className="h-2 w-2 rounded-full bg-school-primary animate-pulse" />
//                                     <span className="text-sm font-bold text-school-primary uppercase tracking-tighter">
//                                         {unreadCount} Unread
//                                     </span>
//                                 </div>
//                             </>
//                         )}
//                     </div>

//                     {/* Actions */}
//                     <div className="flex items-center gap-2">
//                         <MarkAllReadButton unreadCount={unreadCount} />
//                         <DeleteAllNotificationsButton
//                             disabled={notifications.length === 0}
//                         />
//                     </div>
//                 </div>

//                 {/* ── Notifications list ── */}
//                 <div className="rounded-[2rem] border border-school-secondary-800 bg-school-secondary-900 overflow-hidden shadow-2xl">
//                     {notifications.length === 0 ? (
//                         <div className="flex flex-col items-center justify-center py-32 gap-4 text-center px-6">
//                             <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-950 border border-school-secondary-800 shadow-inner">
//                                 <MessageCircle className="h-10 w-10 text-school-secondary-700" />
//                             </div>
//                             <div className="space-y-1">
//                                 <p className="text-lg font-black text-white uppercase tracking-widest">
//                                     Registry Empty
//                                 </p>
//                                 <p className="text-xs text-school-secondary-500 max-w-xs font-medium italic">
//                                     No institutional updates discovered in your registry at this time.
//                                 </p>
//                             </div>
//                         </div>
//                     ) : (
//                         <ScrollArea className="h-[600px]">
//                             <div className="divide-y divide-school-secondary-800/60">
//                                 {notifications.map((n) => (
//                                     <NotificationRow
//                                         key={n.id}
//                                         notification={n}
//                                         /* ✅ FIXED: Removed index={i} to resolve Type Error */
//                                     />
//                                 ))}
//                             </div>
//                         </ScrollArea>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }



import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getMyNotificationsAction } from '@/app/actions/notifications'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell, MessageCircle, Inbox, History } from 'lucide-react'
import { NotificationRow } from '@/components/notifications/notification-row'
import { MarkAllReadButton } from '@/components/notifications/mark-all-read-button'
import { DeleteAllNotificationsButton } from '@/components/notifications/delete-all-notifications-button'

/**
 * Rule 16: Dynamic Contextual SEO
 */
export async function generateMetadata(): Promise<Metadata> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { title: "Notifications | SchoolPaaS" };

    const profile = await prisma.profile.findUnique({
        where: { id: user.id },
        include: { school: { select: { name: true } } }
    });

    return {
        title: `Notifications | ${profile?.school?.name || "Personal Registry"} | SchoolPaaS`,
        description: "Stay up to date with institutional activity and academic updates."
    };
}

/**
 * Rule 12: Server-First Fetching
 */
export default async function NotificationsPage() {
    // Identity Check (Rule 10)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const result = await getMyNotificationsAction();
    const notifications = result.success && result.data ? result.data.notifications : [];
    const unreadCount = result.success && result.data ? result.data.unreadCount : 0;

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl space-y-8 animate-in fade-in duration-700">

                {/* ── Page header ── */}
                <div className="space-y-1">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-school-primary/10 border border-school-primary/20 shadow-2xl">
                            <Bell className="h-6 w-6 text-school-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">
                                Communication Registry
                            </h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
                                System transmission and institutional updates
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Stats + Actions bar ── */}
                <div className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-white/5 bg-slate-900 px-6 py-4 shadow-xl">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Inbox className="h-4 w-4 text-slate-600" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                {notifications.length} Total
                            </span>
                        </div>
                        {unreadCount > 0 && (
                            <>
                                <div className="h-4 w-px bg-white/5" />
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-school-primary animate-pulse" />
                                    <span className="text-[10px] font-black text-school-primary uppercase tracking-widest">
                                        {unreadCount} Unread
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <MarkAllReadButton unreadCount={unreadCount} />
                        <DeleteAllNotificationsButton
                            disabled={notifications.length === 0}
                        />
                    </div>
                </div>

                {/* ── Notifications list ── */}
                <div className="rounded-[2.5rem] border border-white/5 bg-slate-900 overflow-hidden shadow-2xl">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center px-6">
                            <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-950 border border-white/5 shadow-inner">
                                <MessageCircle className="h-8 w-8 text-slate-800" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-black text-white uppercase italic tracking-tighter">
                                    Ledger Empty
                                </p>
                                <p className="text-[10px] text-slate-500 max-w-xs font-bold uppercase tracking-widest leading-relaxed">
                                    No institutional updates discovered in your registry at this time.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <ScrollArea className="h-[600px] no-scrollbar">
                            <div className="divide-y divide-white/5">
                                {notifications.map((n) => (
                                    <NotificationRow
                                        key={n.id}
                                        notification={n}
                                    />
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                <div className="flex justify-center items-center gap-3 text-slate-700 pt-4">
                    <History className="h-3 w-3" />
                    <span className="text-[8px] font-black uppercase tracking-[0.4em]">Registry_Transmission_Logs_v1.2</span>
                </div>
            </div>
        </div>
    )
}