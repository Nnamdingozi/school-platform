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


// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import {
//     MoreHorizontal, Filter, Search,
//     ChevronDown, Loader2, Users,
//     Trash2, UserX, UserCheck
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
//     DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
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
// import { UserActionsModal } from "@/components/admin-dasboard/user-modal"
// import { useUserAction } from "@/hooks/useUserAction"
// import { toast } from "sonner"

// export function StudentsTable() {
//     const router      = useRouter()
//     const { profile } = useProfileStore()
//     const schoolId    = profile?.schoolId ?? ''

//     const [students,      setStudents]      = useState<UserListItem[]>([])
//     const [loading,       setLoading]       = useState(true)
//     const [searchQuery,   setSearchQuery]   = useState('')
//     const [selectedClass, setSelectedClass] = useState('All Classes')
//     const [selectedGrade, setSelectedGrade] = useState('All Grades')

//     const { actionState, triggerAction, closeAction } = useUserAction()

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

//     // ── Post-action handler ────────────────────────────────────────────────
//     function handleActionSuccess() {
//         closeAction()
//         if (actionState?.action === 'delete') {
//             // Remove from local list instantly without refetch
//             setStudents(prev => prev.filter(s => s.id !== actionState.userId))
//         } else {
//             // Refetch to reflect deactivated state
//             getStudentsBySchool(schoolId).then(setStudents)
//         }
//     }

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

//     const getInitials = (name: string | null, email: string) =>
//         (name ?? email)
//             .split(' ')
//             .map(n => n[0])
//             .slice(0, 2)
//             .join('')
//             .toUpperCase()

//     // ── Render ─────────────────────────────────────────────────────────────
//     return (
//         <>
//             <Card className="bg-school-secondary-900 border-school-secondary-700">

//                 {/* ── Header ── */}
//                 <CardHeader className="pb-3 border-b border-school-secondary-700 px-3 sm:px-5">
//                     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                         <div>
//                             <CardTitle className="text-sm sm:text-base font-bold text-white">
//                                 Student Management
//                             </CardTitle>
//                             <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                 {loading
//                                     ? 'Loading...'
//                                     : `${filtered.length} of ${students.length} students`
//                                 }
//                             </p>
//                         </div>

//                         <div className="flex flex-wrap items-center gap-2">

//                             {/* Search */}
//                             <div className="relative flex-1 sm:flex-none">
//                                 <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-school-secondary-400 pointer-events-none" />
//                                 <Input
//                                     placeholder="Search..."
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                     className="w-full sm:w-40 pl-8 h-8 text-xs bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-400 focus:border-school-primary"
//                                 />
//                             </div>

//                             {/* Filter */}
//                             <Popover>
//                                 <PopoverTrigger asChild>
//                                     <Button
//                                         variant="outline"
//                                         size="sm"
//                                         className={`h-8 px-2.5 text-xs gap-1.5 border-school-secondary-700 text-school-secondary-200 hover:bg-school-secondary-800 hover:text-white bg-transparent ${
//                                             hasActiveFilters ? 'border-school-primary text-school-primary' : ''
//                                         }`}
//                                     >
//                                         <Filter className="h-3.5 w-3.5" />
//                                         <span className="hidden sm:inline">Filters</span>
//                                         {hasActiveFilters && (
//                                             <span className="h-1.5 w-1.5 rounded-full bg-school-primary" />
//                                         )}
//                                         <ChevronDown className="h-3 w-3" />
//                                     </Button>
//                                 </PopoverTrigger>
//                                 <PopoverContent
//                                     className="w-56 p-3 bg-school-secondary-900 border-school-secondary-700"
//                                     align="end"
//                                 >
//                                     <div className="space-y-3">
//                                         <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
//                                             Filter Students
//                                         </h4>

//                                         <div className="space-y-1.5">
//                                             <label className="text-[11px] text-school-secondary-400 uppercase tracking-wider font-semibold">
//                                                 Grade
//                                             </label>
//                                             <Select value={selectedGrade} onValueChange={setSelectedGrade}>
//                                                 <SelectTrigger className="h-8 text-xs bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
//                                                     <SelectValue />
//                                                 </SelectTrigger>
//                                                 <SelectContent className="bg-school-secondary-900 border-school-secondary-700">
//                                                     {allGrades.map(g => (
//                                                         <SelectItem
//                                                             key={g}
//                                                             value={g}
//                                                             className="text-xs text-school-secondary-100 focus:bg-school-secondary-800"
//                                                         >
//                                                             {g}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>

//                                         <div className="space-y-1.5">
//                                             <label className="text-[11px] text-school-secondary-400 uppercase tracking-wider font-semibold">
//                                                 Class
//                                             </label>
//                                             <Select value={selectedClass} onValueChange={setSelectedClass}>
//                                                 <SelectTrigger className="h-8 text-xs bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
//                                                     <SelectValue />
//                                                 </SelectTrigger>
//                                                 <SelectContent className="bg-school-secondary-900 border-school-secondary-700">
//                                                     {allClasses.map(c => (
//                                                         <SelectItem
//                                                             key={c}
//                                                             value={c}
//                                                             className="text-xs text-school-secondary-100 focus:bg-school-secondary-800"
//                                                         >
//                                                             {c}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>

//                                         <div className="flex justify-end pt-1 border-t border-school-secondary-700">
//                                             <Button
//                                                 variant="ghost"
//                                                 size="sm"
//                                                 onClick={clearFilters}
//                                                 className="h-7 text-xs text-school-secondary-400 hover:text-white hover:bg-school-secondary-800"
//                                             >
//                                                 Clear
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 </PopoverContent>
//                             </Popover>

//                             {/* Add */}
//                             <Button
//                                 size="sm"
//                                 onClick={() => router.push('/admin/invite-users')}
//                                 className="h-8 px-3 text-xs bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold"
//                             >
//                                 <span className="hidden sm:inline">Add Student</span>
//                                 <span className="sm:hidden">Add</span>
//                             </Button>

//                         </div>
//                     </div>
//                 </CardHeader>

//                 <CardContent className="p-0">

//                     {/* Loading */}
//                     {loading && (
//                         <div className="flex items-center justify-center gap-2 py-12">
//                             <Loader2 className="h-4 w-4 animate-spin text-school-primary" />
//                             <span className="text-xs text-school-secondary-400">Loading students...</span>
//                         </div>
//                     )}

//                     {/* Empty */}
//                     {!loading && filtered.length === 0 && (
//                         <div className="flex flex-col items-center justify-center py-12 gap-2 text-center px-4">
//                             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-school-secondary-800 border border-school-secondary-700">
//                                 <Users className="h-5 w-5 text-school-secondary-400" />
//                             </div>
//                             <p className="text-sm font-semibold text-white">
//                                 {searchQuery || hasActiveFilters
//                                     ? 'No students match your filters'
//                                     : 'No students registered yet'
//                                 }
//                             </p>
//                             <p className="text-xs text-school-secondary-400 max-w-xs">
//                                 {searchQuery || hasActiveFilters
//                                     ? 'Try adjusting your search or filters.'
//                                     : 'Invite students to your school and they will appear here.'
//                                 }
//                             </p>
//                             {!searchQuery && !hasActiveFilters && (
//                                 <Button
//                                     size="sm"
//                                     onClick={() => router.push('/admin/invite-users')}
//                                     className="mt-1 h-8 text-xs bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold"
//                                 >
//                                     Invite Students
//                                 </Button>
//                             )}
//                         </div>
//                     )}

//                     {/* Table */}
//                     {!loading && filtered.length > 0 && (
//                         <div className="overflow-x-auto">
//                             <Table>
//                                 <TableHeader>
//                                     <TableRow className="border-school-secondary-700 hover:bg-transparent">
//                                         <TableHead className="px-3 sm:px-4 py-2 text-[10px] sm:text-xs text-school-secondary-400 font-semibold uppercase tracking-wider">
//                                             Name
//                                         </TableHead>
//                                         <TableHead className="hidden sm:table-cell px-3 sm:px-4 py-2 text-[10px] sm:text-xs text-school-secondary-400 font-semibold uppercase tracking-wider">
//                                             Email
//                                         </TableHead>
//                                         <TableHead className="hidden lg:table-cell px-3 sm:px-4 py-2 text-[10px] sm:text-xs text-school-secondary-400 font-semibold uppercase tracking-wider">
//                                             Phone
//                                         </TableHead>
//                                         <TableHead className="px-3 sm:px-4 py-2 text-[10px] sm:text-xs text-school-secondary-400 font-semibold uppercase tracking-wider">
//                                             Class
//                                         </TableHead>
//                                         <TableHead className="px-3 sm:px-4 py-2 text-right text-[10px] sm:text-xs text-school-secondary-400 font-semibold uppercase tracking-wider">
//                                             Action
//                                         </TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {filtered.map(student => (
//                                         <TableRow
//                                             key={student.id}
//                                             onClick={() => router.push(`/admin/studentView/${student.id}`)}
//                                             className="border-school-secondary-700 hover:bg-school-secondary-800/50 cursor-pointer transition-colors"
//                                         >
//                                             {/* Name — always visible */}
//                                             <TableCell className="px-3 sm:px-4 py-2.5">
//                                                 <div className="flex items-center gap-2">
//                                                     <Avatar className="h-7 w-7 shrink-0">
//                                                         <AvatarFallback className="bg-school-primary/20 text-school-primary text-[10px] font-bold">
//                                                             {getInitials(student.name, student.email)}
//                                                         </AvatarFallback>
//                                                     </Avatar>
//                                                     <div className="min-w-0">
//                                                         <p className="text-xs font-semibold text-school-secondary-100 truncate max-w-[100px] sm:max-w-[160px]">
//                                                             {student.name ?? '—'}
//                                                         </p>
//                                                         <p className="sm:hidden text-[10px] text-school-secondary-400 truncate max-w-[100px]">
//                                                             {student.email}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </TableCell>

//                                             {/* Email — hidden on mobile */}
//                                             <TableCell className="hidden sm:table-cell px-3 sm:px-4 py-2.5 text-xs text-school-secondary-300 truncate max-w-[160px]">
//                                                 {student.email}
//                                             </TableCell>

//                                             {/* Phone — hidden on mobile + tablet */}
//                                             <TableCell className="hidden lg:table-cell px-3 sm:px-4 py-2.5 text-xs text-school-secondary-300">
//                                                 {student.phone ?? '—'}
//                                             </TableCell>

//                                             {/* Class — always visible */}
//                                             <TableCell className="px-3 sm:px-4 py-2.5">
//                                                 {student.assignedClasses.length === 0 ? (
//                                                     <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-amber-400">
//                                                         <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
//                                                         Unassigned
//                                                     </span>
//                                                 ) : (
//                                                     <span className="text-[10px] sm:text-xs text-school-secondary-200 line-clamp-1">
//                                                         {student.assignedClasses.map(c =>
//                                                             `${c.name} (${c.grade.displayName})`
//                                                         ).join(', ')}
//                                                     </span>
//                                                 )}
//                                             </TableCell>

//                                             {/* Actions — always visible */}
//                                             <TableCell
//                                                 className="px-3 sm:px-4 py-2.5 text-right"
//                                                 onClick={e => e.stopPropagation()}
//                                             >
//                                                 <DropdownMenu>
//                                                     <DropdownMenuTrigger asChild>
//                                                         <Button
//                                                             variant="ghost"
//                                                             size="icon"
//                                                             className="h-7 w-7 text-school-secondary-400 hover:text-white hover:bg-school-secondary-700"
//                                                         >
//                                                             <MoreHorizontal className="h-3.5 w-3.5" />
//                                                             <span className="sr-only">Actions</span>
//                                                         </Button>
//                                                     </DropdownMenuTrigger>
//                                                     <DropdownMenuContent
//                                                         align="end"
//                                                         className="bg-school-secondary-900 border-school-secondary-700"
//                                                     >
//                                                         <DropdownMenuItem
//                                                             className="text-xs text-school-secondary-200 focus:bg-school-secondary-800 focus:text-white cursor-pointer"
//                                                             onClick={() => router.push(`/admin/students/${student.id}`)}
//                                                         >
//                                                             View Profile
//                                                         </DropdownMenuItem>
//                                                         <DropdownMenuSeparator className="bg-school-secondary-700" />
// <DropdownMenuItem
//     className="text-xs text-amber-400 focus:bg-school-secondary-800 focus:text-amber-300 cursor-pointer"
//     onClick={() => triggerAction('deactivate', student.id, student.name, student.email)}
// >
//     <UserX className="mr-2 h-3.5 w-3.5" />
//     Deactivate
// </DropdownMenuItem>
// <DropdownMenuItem
//     className="text-xs text-green-400 focus:bg-school-secondary-800 focus:text-green-300 cursor-pointer"
//     onClick={() => triggerAction('reactivate', student.id, student.name, student.email)}
// >
//     <UserCheck className="mr-2 h-3.5 w-3.5" />
//     Reactivate
// </DropdownMenuItem>
// <DropdownMenuItem
//     className="text-xs text-red-400 focus:bg-school-secondary-800 focus:text-red-300 cursor-pointer"
//     onClick={() => triggerAction('delete', student.id, student.name, student.email)}
// >
//     <Trash2 className="mr-2 h-3.5 w-3.5" />
//     Delete
// </DropdownMenuItem>
//                                                     </DropdownMenuContent>
//                                                 </DropdownMenu>
//                                             </TableCell>

//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </div>
//                     )}

//                 </CardContent>
//             </Card>

//             {/* ── Delete / Deactivate Modal ── */}
//             {actionState && (
//                 <UserActionsModal
//                     userId={actionState.userId}
//                     userName={actionState.userName}
//                     userEmail={actionState.userEmail}
//                     action={actionState.action}
//                     onClose={closeAction}
//                     onSuccess={handleActionSuccess}
//                 />
//             )}
//         </>
//     )
// }



"use client"

import { useState, useEffect, useMemo, useTransition, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
    MoreHorizontal, Filter, Search,
    ChevronDown, Loader2, Users,
    Trash2, UserX, UserCheck, X, GraduationCap
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
import { cn } from "@/lib/utils"

/**
 * MODULAR STUDENT REGISTRY TABLE (Tier 2)
 * Rule 18: Semantic Tokens (bg-card, border-border).
 * Rule 19: Refined Typography (font-extrabold headers).
 * Rule 20: Responsive hidden columns for mobile-first display.
 */
export function StudentsTable() {
    const router = useRouter();
    const { profile } = useProfileStore();
    const [isPending, startTransition] = useTransition();

    const [students, setStudents] = useState<UserListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [selectedGrade, setSelectedGrade] = useState('All Grades');

    const { actionState, triggerAction, closeAction } = useUserAction();

    const schoolId = profile?.schoolId ?? '';
    const primaryColor = profile?.primaryColor || "#f59e0b";

    // ── Rule 11: Fetch Registry Truth ──
    const loadStudents = useCallback(async () => {
        if (!schoolId) return;
        try {
            setLoading(true);
            const data = await getStudentsBySchool(schoolId);
            setStudents(data);
        } catch (err) {
            toast.error('Identity sync failure: Could not load registry.');
        } finally {
            setLoading(false);
        }
    }, [schoolId]);

    useEffect(() => {
        loadStudents();
    }, [loadStudents]);

    function handleActionSuccess() {
        closeAction();
        startTransition(async () => {
            await loadStudents();
        });
    }

    // ── Logic: Matrix Filtering ──
    const allGrades = ['All Grades', ...Array.from(new Set(students.flatMap(s => s.assignedClasses.map(c => c.grade.displayName)))).sort()];
    const allClasses = ['All Classes', ...Array.from(new Set(students.flatMap(s => s.assignedClasses.map(c => c.name)))).sort()];

    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return students.filter(s => {
            const matchesSearch = !q || (s.name?.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
            const matchesGrade = selectedGrade === 'All Grades' || s.assignedClasses.some(c => c.grade.displayName === selectedGrade);
            const matchesClass = selectedClass === 'All Classes' || s.assignedClasses.some(c => c.name === selectedClass);
            return matchesSearch && matchesGrade && matchesClass;
        });
    }, [students, searchQuery, selectedGrade, selectedClass]);

    const getInitials = (name: string | null, email: string) =>
        (name ?? email).split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase();

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <Card className="bg-card border-border rounded-[2rem] shadow-2xl overflow-hidden">
                
                {/* ── TOOLBAR ── */}
                <CardHeader className="p-6 md:p-8 border-b border-border bg-background/50">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-extrabold text-foreground uppercase italic tracking-tighter">
                                Student Identities
                            </CardTitle>
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                {loading ? 'Querying Registry...' : `${filtered.length} of ${students.length} provisioned nodes`}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Search Registry */}
                            <div className="relative group flex-1 sm:flex-none">
                                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-school-primary transition-colors" style={{ color: primaryColor }} />
                                <Input
                                    placeholder="Search Registry..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-56 pl-10 h-11 bg-background border-border text-xs font-bold uppercase tracking-widest rounded-xl focus:ring-1 transition-all"
                                    style={{ '--tw-ring-color': primaryColor } as any}
                                />
                            </div>

                            {/* Filter Matrix */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="h-11 rounded-xl border-border bg-background px-4 gap-2 text-[10px] font-black uppercase tracking-widest hover:border-school-primary transition-all">
                                        <Filter className="h-3.5 w-3.5" />
                                        <span className="hidden md:inline">Matrix Filters</span>
                                        <ChevronDown className="h-3 w-3 opacity-30" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-6 bg-card border-border rounded-2xl shadow-2xl space-y-6" align="end">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-muted-foreground uppercase">Target Level</label>
                                            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                                                <SelectTrigger className="h-10 bg-background border-border text-xs font-bold uppercase">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-border">
                                                    {allGrades.map(g => <SelectItem key={g} value={g} className="text-xs uppercase font-bold">{g}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-muted-foreground uppercase">Classroom Node</label>
                                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                                <SelectTrigger className="h-10 bg-background border-border text-xs font-bold uppercase">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-border">
                                                    {allClasses.map(c => <SelectItem key={c} value={c} className="text-xs uppercase font-bold">{c}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        className="w-full text-[9px] font-black uppercase text-muted-foreground hover:text-foreground"
                                        onClick={() => { setSelectedGrade('All Grades'); setSelectedClass('All Classes'); }}
                                    >
                                        Clear Parameters
                                    </Button>
                                </PopoverContent>
                            </Popover>

                            <Button
                                size="sm"
                                onClick={() => router.push('/admin/invite')}
                                className="h-11 px-6 bg-school-primary text-on-school-primary font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Enroll Student
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="h-8 w-8 animate-spin" style={{ color: primaryColor }} />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Querying_Registry_Nodes...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-24 text-center space-y-4 px-6">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
                            <p className="text-sm font-bold text-foreground uppercase italic tracking-tighter">No identities discovered matching current matrix parameters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-background/40">
                                    <TableRow className="border-border hover:bg-transparent">
                                        <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identity</TableHead>
                                        <TableHead className="hidden md:table-cell px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registry Node</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Placement</TableHead>
                                        <TableHead className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Logic</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map(student => (
                                        <TableRow 
                                            key={student.id} 
                                            className="border-border hover:bg-white/[0.02] transition-colors cursor-pointer group"
                                            onClick={() => router.push(`/admin/students/${student.id}`)}
                                        >
                                            <TableCell className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-10 w-10 border border-border shadow-inner">
                                                        <AvatarFallback className="bg-background text-[10px] font-black uppercase" style={{ color: primaryColor }}>
                                                            {getInitials(student.name, student.email)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-extrabold text-foreground uppercase italic leading-none">{student.name || 'Anonymous'}</p>
                                                        <p className="md:hidden text-[9px] text-muted-foreground uppercase mt-1 truncate">{student.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell px-8 py-6 text-[11px] font-mono font-bold text-muted-foreground lowercase">
                                                {student.email}
                                            </TableCell>
                                            <TableCell className="px-8 py-6">
                                                {student.assignedClasses.length === 0 ? (
                                                    <span className="inline-flex px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-black uppercase">Unassigned</span>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-foreground font-bold uppercase text-[10px]">
                                                        <GraduationCap className="h-4 w-4 opacity-20" style={{ color: primaryColor }} />
                                                        {student.assignedClasses[0].name}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-8 py-6 text-right" onClick={e => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 border border-border bg-background rounded-xl hover:border-school-primary transition-all">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-card border-border rounded-xl shadow-2xl">
                                                        <DropdownMenuItem onClick={() => router.push(`/admin/students/${student.id}`)} className="text-[10px] font-bold uppercase tracking-widest">View Profile</DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-border" />
                                                        <DropdownMenuItem onClick={() => triggerAction('deactivate', student.id, student.name, student.email)} className="text-[10px] font-bold uppercase text-amber-500">Deactivate Node</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => triggerAction('delete', student.id, student.name, student.email)} className="text-[10px] font-bold uppercase text-red-500">Purge Record</DropdownMenuItem>
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

            {/* System Modals */}
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
        </div>
    )
}