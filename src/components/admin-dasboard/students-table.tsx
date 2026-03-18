// "use client"

// import { useState } from "react"
// import { MoreHorizontal, Filter, Search, ChevronDown } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import {
//   Table,
//   TableBody,
//   // TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// const students = [
//   { id: 1, name: "Adaobi Okonkwo", grade: "JSS 1", class: "A", status: "active", initials: "AO" },
//   { id: 2, name: "Chukwuemeka Eze", grade: "JSS 2", class: "B", status: "active", initials: "CE" },
//   { id: 3, name: "Fatima Bello", grade: "JSS 3", class: "A", status: "active", initials: "FB" },
//   { id: 4, name: "David Adeleke", grade: "SSS 1", class: "C", status: "inactive", initials: "DA" },
//   { id: 5, name: "Ngozi Nnamdi", grade: "SSS 2", class: "A", status: "active", initials: "NN" },
//   { id: 6, name: "Oluwaseun Adeyemi", grade: "JSS 1", class: "B", status: "active", initials: "OA" },
//   { id: 7, name: "Ibrahim Mohammed", grade: "SSS 3", class: "A", status: "probation", initials: "IM" },
//   { id: 8, name: "Chidinma Uche", grade: "JSS 2", class: "C", status: "active", initials: "CU" },
// ]

// const grades = ["All Grades", "JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"]
// const subjects = ["All Subjects", "Mathematics", "English", "Science", "Social Studies", "French"]
// const terms = ["All Terms", "Term 1", "Term 2", "Term 3"]

// export function StudentsTable() {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedGrade, setSelectedGrade] = useState("All Grades")
//   const [selectedSubject, setSelectedSubject] = useState("All Subjects")
//   const [selectedTerm, setSelectedTerm] = useState("All Terms")

//   const filteredStudents = students.filter((student) => {
//     const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase())
//     const matchesGrade = selectedGrade === "All Grades" || student.grade === selectedGrade
//     return matchesSearch && matchesGrade
//   })

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "active":
//         return <Badge className="bg-accent/15 text-accent hover:bg-accent/25 border-0">Active</Badge>
//       case "inactive":
//         return <Badge variant="secondary" className="text-muted-foreground">Inactive</Badge>
//       case "probation":
//         return <Badge className="bg-chart-5/15 text-chart-5 hover:bg-chart-5/25 border-0">Probation</Badge>
//       default:
//         return <Badge variant="outline">{status}</Badge>
//     }
//   }

//   return (
//     <Card>
//       <CardHeader className="pb-4">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <CardTitle className="text-lg font-semibold text-foreground">Student Management</CardTitle>
//           <div className="flex flex-wrap items-center gap-2">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 placeholder="Search students..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-48 pl-9 bg-background"
//               />
//             </div>

//             {/* Filter Popover */}
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button variant="outline" size="sm" className="gap-2 bg-transparent">
//                   <Filter className="h-4 w-4" />
//                   Filters
//                   <ChevronDown className="h-3 w-3" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-72 p-4" align="end">
//                 <div className="space-y-4">
//                   <h4 className="font-medium text-foreground">Filter Students</h4>
                  
//                   <div className="space-y-2">
//                     <label className="text-sm text-muted-foreground">Grade</label>
//                     <Select value={selectedGrade} onValueChange={setSelectedGrade}>
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {grades.map((grade) => (
//                           <SelectItem key={grade} value={grade}>
//                             {grade}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm text-muted-foreground">Subject</label>
//                     <Select value={selectedSubject} onValueChange={setSelectedSubject}>
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {subjects.map((subject) => (
//                           <SelectItem key={subject} value={subject}>
//                             {subject}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm text-muted-foreground">Term</label>
//                     <Select value={selectedTerm} onValueChange={setSelectedTerm}>
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {terms.map((term) => (
//                           <SelectItem key={term} value={term}>
//                             {term}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="flex justify-end gap-2 pt-2">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => {
//                         setSelectedGrade("All Grades")
//                         setSelectedSubject("All Subjects")
//                         setSelectedTerm("All Terms")
//                       }}
//                     >
//                       Clear
//                     </Button>
//                     <Button size="sm">Apply Filters</Button>
//                   </div>
//                 </div>
//               </PopoverContent>
//             </Popover>

//             <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
//               Add Student
//             </Button>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="p-0">
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-muted/50 hover:bg-muted/50">
//                 <TableHead className="font-semibold text-foreground">Name</TableHead>
//                 <TableHead className="font-semibold text-foreground">Grade</TableHead>
//                 <TableHead className="font-semibold text-foreground">Class</TableHead>
//                 <TableHead className="font-semibold text-foreground">Status</TableHead>
//                 <TableHead className="text-right font-semibold text-foreground">Action</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredStudents.map((student) => (
//                 <TableRow key={student.id} className="hover:bg-muted/30">
//                   <TableCell>
//                     <div className="flex items-center gap-3">
//                       <Avatar className="h-8 w-8">
//                         <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
//                           {student.initials}
//                         </AvatarFallback>
//                       </Avatar>
//                       <span className="font-medium text-foreground">{student.name}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-muted-foreground">{student.grade}</TableCell>
//                   <TableCell className="text-muted-foreground">Class {student.class}</TableCell>
//                   <TableCell>{getStatusBadge(student.status)}</TableCell>
//                   <TableCell className="text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon" className="h-8 w-8">
//                           <MoreHorizontal className="h-4 w-4" />
//                           <span className="sr-only">Actions</span>
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem>View Profile</DropdownMenuItem>
//                         <DropdownMenuItem>Edit Details</DropdownMenuItem>
//                         <DropdownMenuItem>View Report Card</DropdownMenuItem>
//                         <DropdownMenuItem className="text-destructive">
//                           Remove Student
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }



// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import {
//     MoreHorizontal, Filter, Search,
//     ChevronDown, Loader2, Users,
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//     Table, TableBody, TableCell,
//     TableHead, TableHeader, TableRow,
// } from "@/components/ui/table"
// import {
//     DropdownMenu, DropdownMenuContent,
//     DropdownMenuItem, DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//     Popover, PopoverContent, PopoverTrigger,
// } from "@/components/ui/popover"
// import {
//     Select, SelectContent, SelectItem,
//     SelectTrigger, SelectValue,
// } from "@/components/ui/select"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { useProfileStore } from "@/store/profileStore"
// import { getStudentsBySchool, UserListItem } from "@/app/actions/user-management"
// import { toast } from "sonner"

// export function StudentsTable() {
//     const router         = useRouter()
//     const { profile }    = useProfileStore()
//     const schoolId       = profile?.schoolId ?? ''

//     const [students,       setStudents]       = useState<UserListItem[]>([])
//     const [loading,        setLoading]        = useState(true)
//     const [searchQuery,    setSearchQuery]    = useState('')
//     const [selectedClass,  setSelectedClass]  = useState('All Classes')
//     const [selectedGrade,  setSelectedGrade]  = useState('All Grades')

//     // ── Fetch ──────────────────────────────────────────────────────────────
//     useEffect(() => {
//         if (!schoolId) return
//         setLoading(true)
//         getStudentsBySchool(schoolId)
//             .then(data => {
//                 setStudents(data)
//                 setLoading(false)
//             })
//             .catch(() => {
//                 toast.error('Failed to load students.')
//                 setLoading(false)
//             })
//     }, [schoolId])

//     // ── Derived filter options ─────────────────────────────────────────────
//     const allGrades = [
//         'All Grades',
//         ...Array.from(new Set(
//             students.flatMap(s => s.assignedClasses.map(c => c.grade.displayName))
//         )).sort(),
//     ]

//     const allClasses = [
//         'All Classes',
//         ...Array.from(new Set(
//             students.flatMap(s => s.assignedClasses.map(c => c.name))
//         )).sort(),
//     ]

//     // ── Filtered list ──────────────────────────────────────────────────────
//     const filtered = students.filter(s => {
//         const matchesSearch =
//             s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             s.email.toLowerCase().includes(searchQuery.toLowerCase())

//         const matchesGrade =
//             selectedGrade === 'All Grades' ||
//             s.assignedClasses.some(c => c.grade.displayName === selectedGrade)

//         const matchesClass =
//             selectedClass === 'All Classes' ||
//             s.assignedClasses.some(c => c.name === selectedClass)

//         return matchesSearch && matchesGrade && matchesClass
//     })

//     const clearFilters = () => {
//         setSelectedGrade('All Grades')
//         setSelectedClass('All Classes')
//     }

//     const hasActiveFilters =
//         selectedGrade !== 'All Grades' ||
//         selectedClass !== 'All Classes'

//     // ── Initials ───────────────────────────────────────────────────────────
//     const getInitials = (name: string | null, email: string) =>
//         (name ?? email)
//             .split(' ')
//             .map(n => n[0])
//             .slice(0, 2)
//             .join('')
//             .toUpperCase()

//     // ── Render ─────────────────────────────────────────────────────────────
//     return (
//         <Card className="bg-school-secondary-900 border-school-secondary-700">
//             <CardHeader className="pb-4 border-b border-school-secondary-700">
//                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                     <div>
//                         <CardTitle className="text-lg font-bold text-white">
//                             Student Management
//                         </CardTitle>
//                         <p className="text-xs text-school-secondary-400 mt-0.5">
//                             {loading ? 'Loading...' : `${filtered.length} of ${students.length} students`}
//                         </p>
//                     </div>

//                     <div className="flex flex-wrap items-center gap-2">

//                         {/* Search */}
//                         <div className="relative">
//                             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-school-secondary-400 pointer-events-none" />
//                             <Input
//                                 placeholder="Search students..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className="w-48 pl-9 bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-400 focus:border-school-primary"
//                             />
//                         </div>

//                         {/* Filter Popover */}
//                         <Popover>
//                             <PopoverTrigger asChild>
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     className={`gap-2 border-school-secondary-700 text-school-secondary-200 hover:bg-school-secondary-800 hover:text-white bg-transparent ${
//                                         hasActiveFilters ? 'border-school-primary text-school-primary' : ''
//                                     }`}
//                                 >
//                                     <Filter className="h-4 w-4" />
//                                     Filters
//                                     {hasActiveFilters && (
//                                         <span className="h-1.5 w-1.5 rounded-full bg-school-primary" />
//                                     )}
//                                     <ChevronDown className="h-3 w-3" />
//                                 </Button>
//                             </PopoverTrigger>
//                             <PopoverContent
//                                 className="w-64 p-4 bg-school-secondary-900 border-school-secondary-700"
//                                 align="end"
//                             >
//                                 <div className="space-y-4">
//                                     <h4 className="font-semibold text-white text-sm">Filter Students</h4>

//                                     <div className="space-y-2">
//                                         <label className="text-xs text-school-secondary-400 uppercase tracking-wider font-semibold">
//                                             Grade
//                                         </label>
//                                         <Select value={selectedGrade} onValueChange={setSelectedGrade}>
//                                             <SelectTrigger className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
//                                                 <SelectValue />
//                                             </SelectTrigger>
//                                             <SelectContent className="bg-school-secondary-900 border-school-secondary-700">
//                                                 {allGrades.map(g => (
//                                                     <SelectItem
//                                                         key={g}
//                                                         value={g}
//                                                         className="text-school-secondary-100 focus:bg-school-secondary-800"
//                                                     >
//                                                         {g}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <label className="text-xs text-school-secondary-400 uppercase tracking-wider font-semibold">
//                                             Class
//                                         </label>
//                                         <Select value={selectedClass} onValueChange={setSelectedClass}>
//                                             <SelectTrigger className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
//                                                 <SelectValue />
//                                             </SelectTrigger>
//                                             <SelectContent className="bg-school-secondary-900 border-school-secondary-700">
//                                                 {allClasses.map(c => (
//                                                     <SelectItem
//                                                         key={c}
//                                                         value={c}
//                                                         className="text-school-secondary-100 focus:bg-school-secondary-800"
//                                                     >
//                                                         {c}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>

//                                     <div className="flex justify-end gap-2 pt-2 border-t border-school-secondary-700">
//                                         <Button
//                                             variant="ghost"
//                                             size="sm"
//                                             onClick={clearFilters}
//                                             className="text-school-secondary-400 hover:text-white hover:bg-school-secondary-800"
//                                         >
//                                             Clear
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </PopoverContent>
//                         </Popover>

//                         {/* Add Student */}
//                         <Button
//                             size="sm"
//                             onClick={() => router.push('/admin/invite-users')}
//                             className="bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold"
//                         >
//                             Add Student
//                         </Button>

//                     </div>
//                 </div>
//             </CardHeader>

//             <CardContent className="p-0">

//                 {/* Loading */}
//                 {loading && (
//                     <div className="flex items-center justify-center gap-2 py-16">
//                         <Loader2 className="h-5 w-5 animate-spin text-school-primary" />
//                         <span className="text-sm text-school-secondary-400">Loading students...</span>
//                     </div>
//                 )}

//                 {/* Empty state */}
//                 {!loading && filtered.length === 0 && (
//                     <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
//                         <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-school-secondary-800 border border-school-secondary-700">
//                             <Users className="h-6 w-6 text-school-secondary-400" />
//                         </div>
//                         <p className="text-sm font-semibold text-white">
//                             {searchQuery || hasActiveFilters
//                                 ? 'No students match your filters'
//                                 : 'No students registered yet'
//                             }
//                         </p>
//                         <p className="text-xs text-school-secondary-400 max-w-xs">
//                             {searchQuery || hasActiveFilters
//                                 ? 'Try adjusting your search or filters.'
//                                 : 'Invite students to your school and they will appear here.'
//                             }
//                         </p>
//                         {!searchQuery && !hasActiveFilters && (
//                             <Button
//                                 size="sm"
//                                 onClick={() => router.push('/admin/invite-users')}
//                                 className="mt-2 bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold"
//                             >
//                                 Invite Students
//                             </Button>
//                         )}
//                     </div>
//                 )}

//                 {/* Table */}
//                 {!loading && filtered.length > 0 && (
//                     <div className="overflow-x-auto">
//                         <Table>
//                             <TableHeader>
//                                 <TableRow className="border-school-secondary-700 hover:bg-transparent">
//                                     <TableHead className="text-school-secondary-400 font-semibold text-xs uppercase tracking-wider">
//                                         Name
//                                     </TableHead>
//                                     <TableHead className="text-school-secondary-400 font-semibold text-xs uppercase tracking-wider">
//                                         Email
//                                     </TableHead>
//                                     <TableHead className="text-school-secondary-400 font-semibold text-xs uppercase tracking-wider">
//                                         Phone
//                                     </TableHead>
//                                     <TableHead className="text-school-secondary-400 font-semibold text-xs uppercase tracking-wider">
//                                         Class
//                                     </TableHead>
//                                     <TableHead className="text-right text-school-secondary-400 font-semibold text-xs uppercase tracking-wider">
//                                         Action
//                                     </TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {filtered.map(student => (
//                                     <TableRow
//                                         key={student.id}
//                                         className="border-school-secondary-700 hover:bg-school-secondary-800/50 cursor-pointer transition-colors"
//                                         onClick={() => router.push(`/admin/students/${student.id}`)}
//                                     >
//                                         {/* Name */}
//                                         <TableCell>
//                                             <div className="flex items-center gap-3">
//                                                 <Avatar className="h-8 w-8 shrink-0">
//                                                     <AvatarFallback className="bg-school-primary/20 text-school-primary text-xs font-bold">
//                                                         {getInitials(student.name, student.email)}
//                                                     </AvatarFallback>
//                                                 </Avatar>
//                                                 <span className="font-semibold text-school-secondary-100 truncate max-w-[140px]">
//                                                     {student.name ?? '—'}
//                                                 </span>
//                                             </div>
//                                         </TableCell>

//                                         {/* Email */}
//                                         <TableCell className="text-school-secondary-300 text-sm truncate max-w-[160px]">
//                                             {student.email}
//                                         </TableCell>

//                                         {/* Phone */}
//                                         <TableCell className="text-school-secondary-300 text-sm">
//                                             {student.phone ?? '—'}
//                                         </TableCell>

//                                         {/* Class */}
//                                         <TableCell>
//                                             {student.assignedClasses.length === 0 ? (
//                                                 <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
//                                                     <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
//                                                     Unassigned
//                                                 </span>
//                                             ) : (
//                                                 <span className="text-sm text-school-secondary-200">
//                                                     {student.assignedClasses.map(c =>
//                                                         `${c.name} (${c.grade.displayName})`
//                                                     ).join(', ')}
//                                                 </span>
//                                             )}
//                                         </TableCell>

//                                         {/* Actions */}
//                                         <TableCell
//                                             className="text-right"
//                                             onClick={e => e.stopPropagation()}
//                                         >
//                                             <DropdownMenu>
//                                                 <DropdownMenuTrigger asChild>
//                                                     <Button
//                                                         variant="ghost"
//                                                         size="icon"
//                                                         className="h-8 w-8 text-school-secondary-400 hover:text-white hover:bg-school-secondary-700"
//                                                     >
//                                                         <MoreHorizontal className="h-4 w-4" />
//                                                         <span className="sr-only">Actions</span>
//                                                     </Button>
//                                                 </DropdownMenuTrigger>
//                                                 <DropdownMenuContent
//                                                     align="end"
//                                                     className="bg-school-secondary-900 border-school-secondary-700"
//                                                 >
//                                                     <DropdownMenuItem
//                                                         className="text-school-secondary-200 focus:bg-school-secondary-800 focus:text-white cursor-pointer"
//                                                         onClick={() => router.push(`/admin/studentView/${student.id}`)}
//                                                     >
//                                                         View Profile
//                                                     </DropdownMenuItem>
//                                                     <DropdownMenuItem
//                                                         className="text-red-400 focus:bg-school-secondary-800 focus:text-red-300 cursor-pointer"
//                                                     >
//                                                         Remove Student
//                                                     </DropdownMenuItem>
//                                                 </DropdownMenuContent>
//                                             </DropdownMenu>
//                                         </TableCell>

//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </div>
//                 )}

//             </CardContent>
//         </Card>
//     )
// }


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    MoreHorizontal, Filter, Search,
    ChevronDown, Loader2, Users,
    Trash2, UserX, UserCheck
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useProfileStore } from "@/store/profileStore"
import { getStudentsBySchool, UserListItem } from "@/app/actions/user-management"
import { UserActionsModal } from "@/components/admin-dasboard/user-modal"
import { useUserAction } from "@/hooks/useUserAction"
import { toast } from "sonner"

export function StudentsTable() {
    const router      = useRouter()
    const { profile } = useProfileStore()
    const schoolId    = profile?.schoolId ?? ''

    const [students,      setStudents]      = useState<UserListItem[]>([])
    const [loading,       setLoading]       = useState(true)
    const [searchQuery,   setSearchQuery]   = useState('')
    const [selectedClass, setSelectedClass] = useState('All Classes')
    const [selectedGrade, setSelectedGrade] = useState('All Grades')

    const { actionState, triggerAction, closeAction } = useUserAction()

    // ── Fetch ──────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!schoolId) return
        setLoading(true)
        getStudentsBySchool(schoolId)
            .then(data => {
                setStudents(data)
                setLoading(false)
            })
            .catch(() => {
                toast.error('Failed to load students.')
                setLoading(false)
            })
    }, [schoolId])

    // ── Post-action handler ────────────────────────────────────────────────
    function handleActionSuccess() {
        closeAction()
        if (actionState?.action === 'delete') {
            // Remove from local list instantly without refetch
            setStudents(prev => prev.filter(s => s.id !== actionState.userId))
        } else {
            // Refetch to reflect deactivated state
            getStudentsBySchool(schoolId).then(setStudents)
        }
    }

    // ── Derived filter options ─────────────────────────────────────────────
    const allGrades = [
        'All Grades',
        ...Array.from(new Set(
            students.flatMap(s => s.assignedClasses.map(c => c.grade.displayName))
        )).sort(),
    ]

    const allClasses = [
        'All Classes',
        ...Array.from(new Set(
            students.flatMap(s => s.assignedClasses.map(c => c.name))
        )).sort(),
    ]

    // ── Filtered list ──────────────────────────────────────────────────────
    const filtered = students.filter(s => {
        const matchesSearch =
            s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesGrade =
            selectedGrade === 'All Grades' ||
            s.assignedClasses.some(c => c.grade.displayName === selectedGrade)

        const matchesClass =
            selectedClass === 'All Classes' ||
            s.assignedClasses.some(c => c.name === selectedClass)

        return matchesSearch && matchesGrade && matchesClass
    })

    const clearFilters = () => {
        setSelectedGrade('All Grades')
        setSelectedClass('All Classes')
    }

    const hasActiveFilters =
        selectedGrade !== 'All Grades' ||
        selectedClass !== 'All Classes'

    const getInitials = (name: string | null, email: string) =>
        (name ?? email)
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <>
            <Card className="bg-school-secondary-900 border-school-secondary-700">

                {/* ── Header ── */}
                <CardHeader className="pb-3 border-b border-school-secondary-700 px-3 sm:px-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-sm sm:text-base font-bold text-white">
                                Student Management
                            </CardTitle>
                            <p className="text-[11px] text-school-secondary-400 mt-0.5">
                                {loading
                                    ? 'Loading...'
                                    : `${filtered.length} of ${students.length} students`
                                }
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">

                            {/* Search */}
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-school-secondary-400 pointer-events-none" />
                                <Input
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-40 pl-8 h-8 text-xs bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-400 focus:border-school-primary"
                                />
                            </div>

                            {/* Filter */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={`h-8 px-2.5 text-xs gap-1.5 border-school-secondary-700 text-school-secondary-200 hover:bg-school-secondary-800 hover:text-white bg-transparent ${
                                            hasActiveFilters ? 'border-school-primary text-school-primary' : ''
                                        }`}
                                    >
                                        <Filter className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Filters</span>
                                        {hasActiveFilters && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-school-primary" />
                                        )}
                                        <ChevronDown className="h-3 w-3" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-56 p-3 bg-school-secondary-900 border-school-secondary-700"
                                    align="end"
                                >
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                                            Filter Students
                                        </h4>

                                        <div className="space-y-1.5">
                                            <label className="text-[11px] text-school-secondary-400 uppercase tracking-wider font-semibold">
                                                Grade
                                            </label>
                                            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                                                <SelectTrigger className="h-8 text-xs bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-school-secondary-900 border-school-secondary-700">
                                                    {allGrades.map(g => (
                                                        <SelectItem
                                                            key={g}
                                                            value={g}
                                                            className="text-xs text-school-secondary-100 focus:bg-school-secondary-800"
                                                        >
                                                            {g}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[11px] text-school-secondary-400 uppercase tracking-wider font-semibold">
                                                Class
                                            </label>
                                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                                <SelectTrigger className="h-8 text-xs bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-school-secondary-900 border-school-secondary-700">
                                                    {allClasses.map(c => (
                                                        <SelectItem
                                                            key={c}
                                                            value={c}
                                                            className="text-xs text-school-secondary-100 focus:bg-school-secondary-800"
                                                        >
                                                            {c}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex justify-end pt-1 border-t border-school-secondary-700">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearFilters}
                                                className="h-7 text-xs text-school-secondary-400 hover:text-white hover:bg-school-secondary-800"
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            {/* Add */}
                            <Button
                                size="sm"
                                onClick={() => router.push('/admin/invite-users')}
                                className="h-8 px-3 text-xs bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold"
                            >
                                <span className="hidden sm:inline">Add Student</span>
                                <span className="sm:hidden">Add</span>
                            </Button>

                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">

                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center gap-2 py-12">
                            <Loader2 className="h-4 w-4 animate-spin text-school-primary" />
                            <span className="text-xs text-school-secondary-400">Loading students...</span>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 gap-2 text-center px-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-school-secondary-800 border border-school-secondary-700">
                                <Users className="h-5 w-5 text-school-secondary-400" />
                            </div>
                            <p className="text-sm font-semibold text-white">
                                {searchQuery || hasActiveFilters
                                    ? 'No students match your filters'
                                    : 'No students registered yet'
                                }
                            </p>
                            <p className="text-xs text-school-secondary-400 max-w-xs">
                                {searchQuery || hasActiveFilters
                                    ? 'Try adjusting your search or filters.'
                                    : 'Invite students to your school and they will appear here.'
                                }
                            </p>
                            {!searchQuery && !hasActiveFilters && (
                                <Button
                                    size="sm"
                                    onClick={() => router.push('/admin/invite-users')}
                                    className="mt-1 h-8 text-xs bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold"
                                >
                                    Invite Students
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Table */}
                    {!loading && filtered.length > 0 && (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-school-secondary-700 hover:bg-transparent">
                                        <TableHead className="px-3 sm:px-4 py-2 text-[10px] sm:text-xs text-school-secondary-400 font-semibold uppercase tracking-wider">
                                            Name
                                        </TableHead>
                                        <TableHead className="hidden sm:table-cell px-3 sm:px-4 py-2 text-[10px] sm:text-xs text-school-secondary-400 font-semibold uppercase tracking-wider">
                                            Email
                                        </TableHead>
                                        <TableHead className="hidden lg:table-cell px-3 sm:px-4 py-2 text-[10px] sm:text-xs text-school-secondary-400 font-semibold uppercase tracking-wider">
                                            Phone
                                        </TableHead>
                                        <TableHead className="px-3 sm:px-4 py-2 text-[10px] sm:text-xs text-school-secondary-400 font-semibold uppercase tracking-wider">
                                            Class
                                        </TableHead>
                                        <TableHead className="px-3 sm:px-4 py-2 text-right text-[10px] sm:text-xs text-school-secondary-400 font-semibold uppercase tracking-wider">
                                            Action
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map(student => (
                                        <TableRow
                                            key={student.id}
                                            onClick={() => router.push(`/admin/studentView/${student.id}`)}
                                            className="border-school-secondary-700 hover:bg-school-secondary-800/50 cursor-pointer transition-colors"
                                        >
                                            {/* Name — always visible */}
                                            <TableCell className="px-3 sm:px-4 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-7 w-7 shrink-0">
                                                        <AvatarFallback className="bg-school-primary/20 text-school-primary text-[10px] font-bold">
                                                            {getInitials(student.name, student.email)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-semibold text-school-secondary-100 truncate max-w-[100px] sm:max-w-[160px]">
                                                            {student.name ?? '—'}
                                                        </p>
                                                        <p className="sm:hidden text-[10px] text-school-secondary-400 truncate max-w-[100px]">
                                                            {student.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Email — hidden on mobile */}
                                            <TableCell className="hidden sm:table-cell px-3 sm:px-4 py-2.5 text-xs text-school-secondary-300 truncate max-w-[160px]">
                                                {student.email}
                                            </TableCell>

                                            {/* Phone — hidden on mobile + tablet */}
                                            <TableCell className="hidden lg:table-cell px-3 sm:px-4 py-2.5 text-xs text-school-secondary-300">
                                                {student.phone ?? '—'}
                                            </TableCell>

                                            {/* Class — always visible */}
                                            <TableCell className="px-3 sm:px-4 py-2.5">
                                                {student.assignedClasses.length === 0 ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-amber-400">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                                                        Unassigned
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] sm:text-xs text-school-secondary-200 line-clamp-1">
                                                        {student.assignedClasses.map(c =>
                                                            `${c.name} (${c.grade.displayName})`
                                                        ).join(', ')}
                                                    </span>
                                                )}
                                            </TableCell>

                                            {/* Actions — always visible */}
                                            <TableCell
                                                className="px-3 sm:px-4 py-2.5 text-right"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-school-secondary-400 hover:text-white hover:bg-school-secondary-700"
                                                        >
                                                            <MoreHorizontal className="h-3.5 w-3.5" />
                                                            <span className="sr-only">Actions</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="bg-school-secondary-900 border-school-secondary-700"
                                                    >
                                                        <DropdownMenuItem
                                                            className="text-xs text-school-secondary-200 focus:bg-school-secondary-800 focus:text-white cursor-pointer"
                                                            onClick={() => router.push(`/admin/students/${student.id}`)}
                                                        >
                                                            View Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-school-secondary-700" />
<DropdownMenuItem
    className="text-xs text-amber-400 focus:bg-school-secondary-800 focus:text-amber-300 cursor-pointer"
    onClick={() => triggerAction('deactivate', student.id, student.name, student.email)}
>
    <UserX className="mr-2 h-3.5 w-3.5" />
    Deactivate
</DropdownMenuItem>
<DropdownMenuItem
    className="text-xs text-green-400 focus:bg-school-secondary-800 focus:text-green-300 cursor-pointer"
    onClick={() => triggerAction('reactivate', student.id, student.name, student.email)}
>
    <UserCheck className="mr-2 h-3.5 w-3.5" />
    Reactivate
</DropdownMenuItem>
<DropdownMenuItem
    className="text-xs text-red-400 focus:bg-school-secondary-800 focus:text-red-300 cursor-pointer"
    onClick={() => triggerAction('delete', student.id, student.name, student.email)}
>
    <Trash2 className="mr-2 h-3.5 w-3.5" />
    Delete
</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                </CardContent>
            </Card>

            {/* ── Delete / Deactivate Modal ── */}
            {actionState && (
                <UserActionsModal
                    userId={actionState.userId}
                    userName={actionState.userName}
                    userEmail={actionState.userEmail}
                    action={actionState.action}
                    onClose={closeAction}
                    onSuccess={handleActionSuccess}
                />
            )}
        </>
    )
}