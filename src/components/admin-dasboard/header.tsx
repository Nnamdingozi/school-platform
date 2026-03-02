// "use client"
// import { useState } from "react"
// import { Bell, Search, ChevronDown, User, Settings, LogOut, MessageCircle } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"

// const notifications = [
//   {
//     id: 1,
//     title: "Parent Feedback Received",
//     message: "Mrs. Johnson sent feedback about JSS 2 Math results",
//     time: "2 min ago",
//     unread: true,
//   },
//   {
//     id: 2,
//     title: "Assessment Complete",
//     message: "SSS 1 Chemistry exam has been graded",
//     time: "15 min ago",
//     unread: true,
//   },
//   {
//     id: 3,
//     title: "New Teacher Registration",
//     message: "Mr. Okonkwo has been added to the system",
//     time: "1 hour ago",
//     unread: false,
//   },
//   {
//     id: 4,
//     title: "WhatsApp Alert Sent",
//     message: "Report cards sent to 45 parents via WhatsApp",
//     time: "3 hours ago",
//     unread: false,
//   },
// ]

// export function Header() {
//   const [searchQuery, setSearchQuery] = useState("")
//   const unreadCount = notifications.filter((n) => n.unread).length

//   return (
//     <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
//       {/* School Name & Search */}
//       <div className="flex items-center gap-6">
//         <h1 className="text-lg font-semibold text-foreground">Greenfield Academy</h1>
//         <div className="relative hidden md:block">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             type="search"
//             placeholder="Search students, teachers, classes..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-80 pl-10 bg-background"
//           />
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex items-center gap-2">
//         {/* Mobile Search */}
//         <Button variant="ghost" size="icon" className="md:hidden">
//           <Search className="h-5 w-5" />
//           <span className="sr-only">Search</span>
//         </Button>

//         {/* Notifications */}
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="ghost" size="icon" className="relative">
//               <Bell className="h-5 w-5" />
//               {unreadCount > 0 && (
//                 <Badge
//                   variant="destructive"
//                   className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
//                 >
//                   {unreadCount}
//                 </Badge>
//               )}
//               <span className="sr-only">Notifications</span>
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-80 p-0" align="end">
//             <div className="flex items-center justify-between border-b border-border px-4 py-3">
//               <h3 className="font-semibold text-foreground">Notifications</h3>
//               <Badge variant="secondary" className="text-xs">
//                 {unreadCount} new
//               </Badge>
//             </div>
//             <ScrollArea className="h-80">
//               <div className="space-y-1 p-2">
//                 {notifications.map((notification) => (
//                   <div
//                     key={notification.id}
//                     className={`flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted ${
//                       notification.unread ? "bg-muted/50" : ""
//                     }`}
//                   >
//                     <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
//                       <MessageCircle className="h-4 w-4 text-primary" />
//                     </div>
//                     <div className="flex-1 space-y-1">
//                       <p className="text-sm font-medium text-foreground leading-none">
//                         {notification.title}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         {notification.message}
//                       </p>
//                       <p className="text-xs text-muted-foreground/70">
//                         {notification.time}
//                       </p>
//                     </div>
//                     {notification.unread && (
//                       <div className="h-2 w-2 rounded-full bg-primary" />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </ScrollArea>
//             <div className="border-t border-border p-2">
//               <Button variant="ghost" className="w-full text-sm text-primary">
//                 View all notifications
//               </Button>
//             </div>
//           </PopoverContent>
//         </Popover>

//         {/* User Menu */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1">
//               <Avatar className="h-8 w-8">
//                 <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
//                 <AvatarFallback className="bg-primary text-primary-foreground text-sm">
//                   AD
//                 </AvatarFallback>
//               </Avatar>
//               <div className="hidden flex-col items-start text-left lg:flex">
//                 <span className="text-sm font-medium text-foreground">Admin User</span>
//                 <span className="text-xs text-muted-foreground">School Admin</span>
//               </div>
//               <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-56">
//             <DropdownMenuLabel>My Account</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>
//               <User className="mr-2 h-4 w-4" />
//               Profile
//             </DropdownMenuItem>
//             <DropdownMenuItem>
//               <Settings className="mr-2 h-4 w-4" />
//               Settings
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem className="text-destructive">
//               <LogOut className="mr-2 h-4 w-4" />
//               Log out
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </header>
//   )
// }


"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, ChevronDown, User, Settings, LogOut, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useProfileStore } from "@/store/profileStore"
import { useSchool } from "@/context/schoolProvider"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function Header() {
    const router = useRouter()
    const { profile } = useProfileStore()
    const { school } = useSchool()
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    // ── Derived display values ─────────────────────────────────────────────
    const displayName = profile?.name ?? "User"
    const displayEmail = profile?.email ?? ""
    const displayRole = profile?.role
        ? profile.role.toLowerCase().replace(/_/g, ' ')
        : "user"
    const schoolName = school?.name ?? profile?.school?.name ?? "EduAI"

    // Initials for avatar fallback
    const initials = displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    // ── Notifications from DB ──────────────────────────────────────────────
    // Using profile.notifications from the store (already included in
    // comprehensiveProfileInclude via the Notification model relation)
    const notifications = profile?.notifications ?? []
    const unreadCount = notifications.filter((n) => !n.read).length

    // ── Logout ─────────────────────────────────────────────────────────────
    async function handleLogout() {
        setIsLoggingOut(true)
        const supabase = createClient()
        const { error } = await supabase.auth.signOut()
        if (error) {
            toast.error("Failed to log out. Please try again.")
            setIsLoggingOut(false)
            return
        }
        useProfileStore.getState().clearProfile()
        router.replace("/login")
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-school-secondary-800 bg-school-secondary-950 px-6">

            {/* School Name + Search */}
            <div className="flex items-center gap-6">
                <h1 className="text-lg font-bold text-school-primary truncate max-w-[200px]">
                    {schoolName}
                </h1>
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-school-secondary-100/30" />
                    <Input
                        type="search"
                        placeholder="Search students, teachers, classes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-80 pl-10 bg-school-secondary-900 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-100/20 focus:border-school-primary"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">

                {/* Mobile Search */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-school-secondary-100/50 hover:text-school-primary hover:bg-school-secondary-800"
                >
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                </Button>

                {/* Notifications */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-school-secondary-100/50 hover:text-school-primary hover:bg-school-secondary-800"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-school-primary text-school-secondary-950 text-[10px] font-black flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-80 p-0 bg-school-secondary-900 border-school-secondary-700"
                        align="end"
                    >
                        <div className="flex items-center justify-between border-b border-school-secondary-700 px-4 py-3">
                            <h3 className="font-bold text-school-secondary-100">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-school-primary/10 text-school-primary font-semibold">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>

                        <ScrollArea className="h-80">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-32 text-school-secondary-100/30">
                                    <Bell className="h-8 w-8 mb-2" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="space-y-0.5 p-2">
                                    {notifications.slice(0, 10).map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`flex items-start gap-3 rounded-lg p-3 transition-colors cursor-pointer
                                                hover:bg-school-secondary-800
                                                ${!notification.read ? "bg-school-secondary-800/50" : ""}
                                            `}
                                        >
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-school-primary/10">
                                                <MessageCircle className="h-4 w-4 text-school-primary" />
                                            </div>
                                            <div className="flex-1 space-y-0.5 min-w-0">
                                                <p className="text-sm font-semibold text-school-secondary-100 leading-snug truncate">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-school-secondary-100/40">
                                                    {new Date(notification.createdAt).toLocaleDateString('en-GB', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <div className="h-2 w-2 rounded-full bg-school-primary shrink-0 mt-1" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>

                        <div className="border-t border-school-secondary-700 p-2">
                            <Button
                                variant="ghost"
                                className="w-full text-sm text-school-primary hover:bg-school-secondary-800"
                                onClick={() => router.push('/notifications')}
                            >
                                View all notifications
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 pl-2 pr-1 hover:bg-school-secondary-800"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-school-primary text-school-secondary-950 text-sm font-black">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden flex-col items-start text-left lg:flex">
                                <span className="text-sm font-semibold text-school-secondary-100 max-w-[120px] truncate">
                                    {displayName}
                                </span>
                                <span className="text-xs text-school-secondary-100/50 capitalize">
                                    {displayRole}
                                </span>
                            </div>
                            <ChevronDown className="ml-1 h-4 w-4 text-school-secondary-100/40" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 bg-school-secondary-900 border-school-secondary-700"
                    >
                        {/* Account info */}
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-semibold text-school-secondary-100">
                                    {displayName}
                                </p>
                                <p className="text-xs text-school-secondary-100/50 truncate">
                                    {displayEmail}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-school-secondary-700" />

                        <DropdownMenuItem
                            className="text-school-secondary-100/70 hover:text-school-secondary-100 hover:bg-school-secondary-800 cursor-pointer"
                            onClick={() => router.push('/settings/profile')}
                        >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-school-secondary-100/70 hover:text-school-secondary-100 hover:bg-school-secondary-800 cursor-pointer"
                            onClick={() => router.push('/settings')}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-school-secondary-700" />

                        <DropdownMenuItem
                            className="text-red-400 hover:text-red-300 hover:bg-school-secondary-800 cursor-pointer"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            {isLoggingOut ? "Logging out..." : "Log out"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </header>
    )
}
