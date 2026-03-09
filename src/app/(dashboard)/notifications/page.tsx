import { getMyNotificationsAction, markAllNotificationsReadAction } from '@/app/actions/notification.actions'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell, CheckCircle2, MessageCircle, Inbox } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function markAllReadFormAction(_formData: FormData) {
    'use server'
    await markAllNotificationsReadAction()
}

export default async function NotificationsPage() {
    const result = await getMyNotificationsAction()

    const notifications = result.success && result.data
        ? result.data.notifications
        : []
    const unreadCount = result.success && result.data
        ? result.data.unreadCount
        : 0

    return (
        <div className="min-h-screen bg-school-secondary-950 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl space-y-6">

                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-school-primary/10">
                            <Bell className="h-5 w-5 text-school-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                                Notifications
                            </h1>
                            <p className="text-sm text-school-secondary-200/70">
                                Stay on top of important updates from your school.
                            </p>
                        </div>
                    </div>

                    <form action={markAllReadFormAction}>
                        <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            disabled={unreadCount === 0 || !result.success}
                            className="text-school-primary hover:bg-school-secondary-800"
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark all as read
                        </Button>
                    </form>
                </div>

                {/* Summary */}
                <div className="flex items-center gap-4 rounded-2xl border border-school-secondary-800 bg-school-secondary-900/60 px-4 py-3 text-sm text-school-secondary-100 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Inbox className="h-4 w-4 text-school-primary" />
                        <span className="font-semibold">{notifications.length}</span>
                        <span className="text-school-secondary-300/80">total</span>
                    </div>
                    <div className="h-4 w-px bg-school-secondary-700" />
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-school-primary" />
                        <span className="font-semibold">{unreadCount}</span>
                        <span className="text-school-secondary-300/80">unread</span>
                    </div>
                </div>

                {/* List */}
                <div className="overflow-hidden rounded-2xl border border-school-secondary-800 bg-school-secondary-900/60 shadow-sm">
                    <ScrollArea className="h-[520px]">
                        {notifications.length === 0 ? (
                            <div className="flex h-[240px] flex-col items-center justify-center gap-3 text-school-secondary-100">
                                <MessageCircle className="h-8 w-8 text-school-secondary-400" />
                                <p className="text-sm font-medium">You have no notifications yet</p>
                                <p className="max-w-sm text-center text-xs text-school-secondary-300/80">
                                    When your school admins or teachers share updates, they will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-school-secondary-800">
                                {notifications.map((notification) => (
                                    <NotificationRow key={notification.id} notification={notification} />
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}

interface NotificationRowProps {
    notification: {
        id: string
        message: string
        link: string | null
        read: boolean
        createdAt: Date
    }
}

function NotificationRow({ notification }: NotificationRowProps) {
    const formattedDate = new Date(notification.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    })

    const content = (
        <div
            className={`flex gap-3 px-4 py-3.5 transition-colors ${
                notification.read ? 'bg-transparent' : 'bg-school-secondary-800/70'
            } hover:bg-school-secondary-800`}
        >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-school-primary/15">
                <MessageCircle className="h-4 w-4 text-school-primary" />
            </div>
            <div className="flex flex-1 items-start justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-sm font-medium leading-snug text-school-secondary-100">
                        {notification.message}
                    </p>
                    <p className="text-xs text-school-secondary-400">
                        {formattedDate}
                    </p>
                </div>
                {!notification.read && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-school-primary" />
                )}
            </div>
        </div>
    )

    if (notification.link) {
        return (
            <Link href={notification.link} className="block">
                {content}
            </Link>
        )
    }

    return content
}

