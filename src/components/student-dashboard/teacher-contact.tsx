// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Mail, MessageSquare, User } from "lucide-react"

// interface Teacher {
//   name: string
//   role: string
//   subject: string
//   avatar?: string
//   email: string
//   available: boolean
// }

// const classTeacher: Teacher = {
//   name: "Mrs. Folake Adebayo",
//   role: "Class Teacher",
//   subject: "Mathematics",
//   email: "f.adebayo@school.edu",
//   available: true,
// }

// export function TeacherContact() {
//   const initials = classTeacher.name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .slice(0, 2)

//   return (
//     <Card>
//       <CardHeader className="pb-3">
//         <CardTitle className="flex items-center gap-2 text-lg">
//           <User className="h-5 w-5 text-primary" />
//           Class Teacher
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="flex items-center gap-4">
//           {/* Avatar */}
//           <div className="relative">
//             <Avatar className="h-16 w-16">
//               <AvatarImage src={classTeacher.avatar || "/placeholder.svg"} />
//               <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
//                 {initials}
//               </AvatarFallback>
//             </Avatar>
//             {classTeacher.available && (
//               <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card bg-success">
//                 <span className="sr-only">Online</span>
//               </span>
//             )}
//           </div>

//           {/* Info */}
//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-foreground truncate">
//               {classTeacher.name}
//             </h3>
//             <p className="text-sm text-muted-foreground">{classTeacher.role}</p>
//             <div className="flex items-center gap-2 mt-1">
//               <Badge variant="secondary" className="text-xs">
//                 {classTeacher.subject}
//               </Badge>
//               {classTeacher.available && (
//                 <Badge variant="outline" className="text-xs text-success border-success/30">
//                   Available
//                 </Badge>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Contact Actions */}
//         <div className="flex items-center gap-2 mt-4">
//           <Button className="flex-1 gap-2" size="sm">
//             <MessageSquare className="h-4 w-4" />
//             Send Message
//           </Button>
//           <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
//             <Mail className="h-4 w-4" />
//             <span className="sr-only">Email</span>
//           </Button>
//         </div>

//         {/* Quick Info */}
//         <div className="mt-4 pt-4 border-t border-border">
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <Mail className="h-4 w-4" />
//             <span className="truncate">{classTeacher.email}</span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, ShieldCheck, Phone } from "lucide-react"

interface TeacherContactProps {
  teacher: {
    name: string | null;
    email: string;
    phone?: string | null;
    avatar?: string;
  } | null;
}

export function TeacherContact({ teacher }: TeacherContactProps) {
  // Logic: Safe initials generation
  const initials = teacher?.name
    ? teacher.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : "TR";

  return (
    <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
      <CardHeader className="pb-6 bg-slate-950/50 border-b border-white/5">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-school-primary/10 rounded-lg text-school-primary">
                <ShieldCheck className="h-4 w-4" />
            </div>
            <CardTitle className="text-sm font-black uppercase italic tracking-tighter text-white">
                Classroom Leadership
            </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          {/* Avatar with Ring */}
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-slate-950 shadow-2xl ring-2 ring-white/5">
              <AvatarImage src={teacher?.avatar} alt={teacher?.name || "Teacher"} />
              <AvatarFallback className="bg-slate-950 text-school-primary text-xl font-black italic">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 h-5 w-5 rounded-full border-4 border-slate-900 shadow-lg" title="Status: Online" />
          </div>

          {/* Teacher Identity */}
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
              {teacher?.name || "Registry Pending"}
            </h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                Designated Form Teacher
            </p>
          </div>

          <div className="flex gap-2">
             <Badge className="bg-school-primary/10 text-school-primary border-none text-[8px] font-black uppercase px-3 py-0.5">
                Official Representative
             </Badge>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="space-y-3">
          <Button className="w-full bg-school-primary text-slate-950 font-black py-6 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-school-primary/10">
            <MessageSquare className="mr-2 h-4 w-4" />
            Initiate Consultation
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-white/5 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl py-5">
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="border-white/5 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl py-5">
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Official Data Registry */}
        <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-slate-600 uppercase tracking-widest">Email Hash</span>
            <span className="text-slate-400 truncate max-w-[150px]">{teacher?.email || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-slate-600 uppercase tracking-widest">Access Key</span>
            <span className="text-slate-400 font-mono">STAFF_{teacher?.name?.split(" ")[1]?.toUpperCase() || "PENDING"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}