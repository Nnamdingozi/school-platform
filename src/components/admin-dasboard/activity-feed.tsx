// "use client"
// import { useEffect, useState } from "react"
// import { ClipboardCheck,MessageSquare,FileText,UserPlus,Bell,LogIn,Settings,Download,Eye,Send,User} from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// // Current user info (would come from auth context in a real app)
// const currentUser = {
//   name: "Dr. Chinedu Okoro",
//   role: "School Administrator",
//   initials: "CO",
// }

// // All activities (school-wide)
// const allActivities = [
//   {
//     id: 1,
//     type: "assessment",
//     title: "Assessment Uploaded",
//     description: "JSS 2 Mathematics - Mid-term Exam",
//     user: "Mrs. Adebayo",
//     time: "5 min ago",
//     icon: ClipboardCheck,
//   },
//   {
//     id: 2,
//     type: "comment",
//     title: "Teacher Comment",
//     description: "Student progress note for Adaobi O.",
//     user: "Mr. Eze",
//     time: "23 min ago",
//     icon: MessageSquare,
//   },
//   {
//     id: 3,
//     type: "report",
//     title: "Report Cards Generated",
//     description: "SSS 1 Term 2 reports ready for review",
//     user: "System",
//     time: "1 hour ago",
//     icon: FileText,
//   },
//   {
//     id: 4,
//     type: "student",
//     title: "New Student Enrolled",
//     description: "Amara Nwosu added to JSS 1A",
//     user: "Admin",
//     time: "2 hours ago",
//     icon: UserPlus,
//   },
//   {
//     id: 5,
//     type: "notification",
//     title: "Parent Meeting Scheduled",
//     description: "PTA Meeting for Term 2 on Feb 15",
//     user: "Principal",
//     time: "3 hours ago",
//     icon: Bell,
//   },
//   {
//     id: 6,
//     type: "assessment",
//     title: "Assessment Graded",
//     description: "SSS 2 Chemistry - Quiz 3 results",
//     user: "Dr. Okafor",
//     time: "4 hours ago",
//     icon: ClipboardCheck,
//   },
// ]

// // Current user's personal activities
// const myActivities = [
//   {
//     id: 1,
//     type: "login",
//     title: "Logged In",
//     description: "Session started from Chrome on Windows",
//     time: "Just now",
//     icon: LogIn,
//   },
//   {
//     id: 2,
//     type: "view",
//     title: "Viewed Student Records",
//     description: "Accessed JSS 2A class roster",
//     time: "12 min ago",
//     icon: Eye,
//   },
//   {
//     id: 3,
//     type: "download",
//     title: "Downloaded Report",
//     description: "Term 2 Assessment Summary - All Grades",
//     time: "45 min ago",
//     icon: Download,
//   },
//   {
//     id: 4,
//     type: "send",
//     title: "Sent WhatsApp Feedback",
//     description: "Bulk notification to JSS 3 parents",
//     time: "1 hour ago",
//     icon: Send,
//   },
//   {
//     id: 5,
//     type: "settings",
//     title: "Updated Settings",
//     description: "Changed curriculum to British National",
//     time: "2 hours ago",
//     icon: Settings,
//   },
//   {
//     id: 6,
//     type: "view",
//     title: "Reviewed Teacher Profile",
//     description: "Viewed Mrs. Adebayo's performance metrics",
//     time: "3 hours ago",
//     icon: Eye,
//   },
//   {
//     id: 7,
//     type: "student",
//     title: "Approved Enrollment",
//     description: "Approved admission for Amara Nwosu",
//     time: "3 hours ago",
//     icon: UserPlus,
//   },
// ]

// const getActivityColor = (type: string) => {
//   switch (type) {
//     case "assessment":
//       return "bg-primary/10 text-primary"
//     case "comment":
//       return "bg-chart-2/10 text-chart-2"
//     case "report":
//       return "bg-accent/10 text-accent"
//     case "student":
//       return "bg-chart-4/10 text-chart-4"
//     case "notification":
//       return "bg-chart-5/10 text-chart-5"
//     case "login":
//       return "bg-chart-1/10 text-chart-1"
//     case "view":
//       return "bg-primary/10 text-primary"
//     case "download":
//       return "bg-chart-2/10 text-chart-2"
//     case "send":
//       return "bg-accent/10 text-accent"
//     case "settings":
//       return "bg-chart-3/10 text-chart-3"
//     default:
//       return "bg-muted text-muted-foreground"
//   }
// }

// export function ActivityFeed() {
//   const [activeTab, setActiveTab] = useState("my")
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
// }, [activeTab]); // or whatever state drives the content change

//   return (
//     <Card className="h-full">
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-lg font-semibold text-foreground">
//             Activity Feed
//           </CardTitle>
//           <Button variant="ghost" size="sm" className="text-primary text-xs">
//             View All
//           </Button>
//         </div>
//         {/* Current User Info */}
//         <div className="flex items-center gap-3 pt-2 pb-1 border-b border-border">
//           <Avatar className="h-8 w-8">
//             <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
//               {currentUser.initials}
//             </AvatarFallback>
//           </Avatar>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-foreground truncate">{currentUser.name}</p>
//             <p className="text-xs text-muted-foreground">{currentUser.role}</p>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="p-0">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <div className="px-6 pb-2">
//             <TabsList className="grid w-full grid-cols-2 h-9">
//               <TabsTrigger value="my" className="text-xs">
//                 <User className="h-3 w-3 mr-1" />
//                 My Activity
//               </TabsTrigger>
//               <TabsTrigger value="all" className="text-xs">
//                 <Bell className="h-3 w-3 mr-1" />
//                 School Feed
//               </TabsTrigger>
//             </TabsList>
//           </div>
          
//           <TabsContent value="my" className="mt-0">
//             <ScrollArea className="h-[280px] px-6">
//               <div className="space-y-1 pb-4">
//                 {myActivities.map((activity, index) => {
//                   const Icon = activity.icon
//                   return (
//                     <div key={activity.id} className="relative flex gap-3 py-3">
//                       {index !== myActivities.length - 1 && (
//                         <div className="absolute left-4 top-12 h-full w-px bg-border" />
//                       )}
//                       <div
//                         className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getActivityColor(
//                           activity.type
//                         )}`}
//                       >
//                         <Icon className="h-4 w-4" />
//                       </div>
//                       <div className="flex-1 space-y-1">
//                         <p className="text-sm font-medium text-foreground leading-none">
//                           {activity.title}
//                         </p>
//                         <p className="text-xs text-muted-foreground">
//                           {activity.description}
//                         </p>
//                         <p className="text-xs text-muted-foreground/70">
//                           {activity.time}
//                         </p>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             </ScrollArea>
//           </TabsContent>

//           <TabsContent value="all" className="mt-0">
//             <ScrollArea className="h-[280px] px-6">
//               <div className="space-y-1 pb-4">
//                 {allActivities.map((activity, index) => {
//                   const Icon = activity.icon
//                   return (
//                     <div key={activity.id} className="relative flex gap-3 py-3">
//                       {index !== allActivities.length - 1 && (
//                         <div className="absolute left-4 top-12 h-full w-px bg-border" />
//                       )}
//                       <div
//                         className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getActivityColor(
//                           activity.type
//                         )}`}
//                       >
//                         <Icon className="h-4 w-4" />
//                       </div>
//                       <div className="flex-1 space-y-1">
//                         <p className="text-sm font-medium text-foreground leading-none">
//                           {activity.title}
//                         </p>
//                         <p className="text-xs text-muted-foreground">
//                           {activity.description}
//                         </p>
//                         <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
//                           <span>{activity.user}</span>
//                           <span>•</span>
//                           <span>{activity.time}</span>
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             </ScrollArea>
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//     </Card>
//   )
// }


'use client'

import { useEffect, useState } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { getActivityFeed, ActivityItem } from '@/app/actions/activitylog.action'
import { ActivityType } from '@prisma/client'
import {
    ClipboardCheck, FileText, UserPlus,
    Bell, LogIn, LogOut, Settings, Send, User,
    GraduationCap, BookOpen, Loader2, RefreshCw,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getErrorMessage } from '@/lib/error-handler'

// ── Activity config ────────────────────────────────────────────────────────────

const ACTIVITY_CONFIG: Record<ActivityType, {
    icon:  React.ElementType
    color: string
}> = {
    ASSESSMENT_CREATED: { icon: ClipboardCheck, color: 'bg-school-primary/10 text-school-primary'  },
    ASSESSMENT_GRADED:  { icon: ClipboardCheck, color: 'bg-school-primary/10 text-school-primary'  },
    STUDENT_ENROLLED:   { icon: UserPlus,       color: 'bg-green-500/10 text-green-500'             },
    STUDENT_ASSIGNED:   { icon: UserPlus,       color: 'bg-green-500/10 text-green-500'             },
    TEACHER_ASSIGNED:   { icon: GraduationCap,  color: 'bg-blue-500/10 text-blue-500'               },
    USER_INVITED:       { icon: UserPlus,       color: 'bg-school-primary/10 text-school-primary'   },
    USER_DEACTIVATED:   { icon: User,           color: 'bg-amber-500/10 text-amber-500'             },
    USER_DELETED:       { icon: User,           color: 'bg-red-500/10 text-red-500'                 },
    USER_REACTIVATED:   { icon: User,           color: 'bg-green-500/10 text-green-500'             },
    CLASS_CREATED:      { icon: BookOpen,       color: 'bg-purple-500/10 text-purple-500'           },
    SETTINGS_UPDATED:   { icon: Settings,       color: 'bg-gray-500/10 text-gray-500'               },
    CURRICULUM_UPDATED: { icon: BookOpen,       color: 'bg-school-primary/10 text-school-primary'   },
    TERM_DATES_UPDATED: { icon: FileText,       color: 'bg-blue-500/10 text-blue-500'               },
    WHATSAPP_SENT:      { icon: Send,           color: 'bg-green-500/10 text-green-500'             },
    LOGIN:              { icon: LogIn,          color: 'bg-gray-500/10 text-gray-500'               },
    LOGOUT:             { icon: LogOut,         color: 'bg-gray-500/10 text-gray-500'               },
    REPORT_GENERATED:   { icon: FileText,       color: 'bg-school-primary/10 text-school-primary'   },
}

// ── Time formatter ─────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60)     return 'just now'
    if (seconds < 3600)   return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400)  return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyFeed({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-48 gap-2 text-center px-4">
            <Bell className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    )
}

// ── Activity row ───────────────────────────────────────────────────────────────

function ActivityRow({
    activity,
    showActor,
    isLast,
}: {
    activity:  ActivityItem
    showActor: boolean
    isLast:    boolean
}) {
    const config = ACTIVITY_CONFIG[activity.type]
    const Icon   = config?.icon  ?? Bell
    const color  = config?.color ?? 'bg-muted text-muted-foreground'

    return (
        <div className="relative flex gap-3 py-3">
            {/* Timeline connector */}
            {!isLast && (
                <div className="absolute left-4 top-11 bottom-0 w-px bg-border" />
            )}

            {/* Icon */}
            <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}>
                <Icon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-0.5 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug truncate">
                    {activity.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                    {activity.description}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/70 flex-wrap">
                    {showActor && activity.actorName && (
                        <>
                            <span className="font-medium text-muted-foreground">
                                {activity.actorName}
                            </span>
                            <span>·</span>
                        </>
                    )}
                    <span>{timeAgo(activity.createdAt)}</span>
                </div>
            </div>
        </div>
    )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function ActivityFeed() {
    const { profile }  = useProfileStore()
    const schoolId     = profile?.schoolId ?? ''
    const actorId      = profile?.id       ?? ''

    const [data,       setData]       = useState<{
        myActivity:     ActivityItem[]
        schoolActivity: ActivityItem[]
    } | null>(null)
    const [loading,    setLoading]    = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [activeTab,  setActiveTab]  = useState('my')

    const initials = (profile?.name ?? 'U')
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

        async function fetchData(isRefresh = false) {
            if (!schoolId || !actorId) return;
        
            // ✅ Use proper if/else for state updates (statements)
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            
            try {
                const result = await getActivityFeed(schoolId, actorId);
                setData(result);
            } catch (error) {
                console.error("Failed to sync feed");
                getErrorMessage(error)
            } finally {
                if (isRefresh) {
                    setRefreshing(false);
                } else {
                    setLoading(false);
                }
            }
        }

    useEffect(() => {
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schoolId, actorId])

    return (
        <Card className="h-fit">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg font-semibold text-foreground">
                        Activity Feed
                    </CardTitle>
                    <button
                        onClick={() => fetchData(true)}
                        disabled={refreshing}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>

                {/* Current user pill */}
                <div className="flex items-center gap-2.5 pt-2 pb-1 border-b border-border">
                    <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-school-primary/10 text-school-primary text-xs font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                            {profile?.name ?? 'Admin'}
                        </p>
                        <p className="text-[11px] text-muted-foreground capitalize">
                            {profile?.role?.toLowerCase().replace(/_/g, ' ') ?? 'Administrator'}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="px-6 pb-2">
                        <TabsList className="grid w-full grid-cols-2 h-9">
                            <TabsTrigger value="my" className="text-xs">
                                <User className="h-3 w-3 mr-1" />
                                My Activity
                            </TabsTrigger>
                            <TabsTrigger value="all" className="text-xs">
                                <Bell className="h-3 w-3 mr-1" />
                                School Feed
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* ── My Activity ── */}
                    <TabsContent value="my" className="mt-0">
                        <ScrollArea className="h-[280px] px-6">
                            {loading ? (
                                <div className="flex items-center justify-center h-48 gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-school-primary" />
                                    <span className="text-xs text-muted-foreground">Loading...</span>
                                </div>
                            ) : !data?.myActivity.length ? (
                                <EmptyFeed message="No activity recorded yet. Actions you take will appear here." />
                            ) : (
                                <div className="pb-4">
                                    {data.myActivity.map((activity, i) => (
                                        <ActivityRow
                                            key={activity.id}
                                            activity={activity}
                                            showActor={false}
                                            isLast={i === data.myActivity.length - 1}
                                        />
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    {/* ── School Feed ── */}
                    <TabsContent value="all" className="mt-0">
                        <ScrollArea className="h-[280px] px-6">
                            {loading ? (
                                <div className="flex items-center justify-center h-48 gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-school-primary" />
                                    <span className="text-xs text-muted-foreground">Loading...</span>
                                </div>
                            ) : !data?.schoolActivity.length ? (
                                <EmptyFeed message="No school activity yet. Actions taken by any admin will appear here." />
                            ) : (
                                <div className="pb-4">
                                    {data.schoolActivity.map((activity, i) => (
                                        <ActivityRow
                                            key={activity.id}
                                            activity={activity}
                                            showActor={true}
                                            isLast={i === data.schoolActivity.length - 1}
                                        />
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}