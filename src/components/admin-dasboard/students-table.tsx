"use client"

import { useState } from "react"
import { MoreHorizontal, Filter, Search, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const students = [
  { id: 1, name: "Adaobi Okonkwo", grade: "JSS 1", class: "A", status: "active", initials: "AO" },
  { id: 2, name: "Chukwuemeka Eze", grade: "JSS 2", class: "B", status: "active", initials: "CE" },
  { id: 3, name: "Fatima Bello", grade: "JSS 3", class: "A", status: "active", initials: "FB" },
  { id: 4, name: "David Adeleke", grade: "SSS 1", class: "C", status: "inactive", initials: "DA" },
  { id: 5, name: "Ngozi Nnamdi", grade: "SSS 2", class: "A", status: "active", initials: "NN" },
  { id: 6, name: "Oluwaseun Adeyemi", grade: "JSS 1", class: "B", status: "active", initials: "OA" },
  { id: 7, name: "Ibrahim Mohammed", grade: "SSS 3", class: "A", status: "probation", initials: "IM" },
  { id: 8, name: "Chidinma Uche", grade: "JSS 2", class: "C", status: "active", initials: "CU" },
]

const grades = ["All Grades", "JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"]
const subjects = ["All Subjects", "Mathematics", "English", "Science", "Social Studies", "French"]
const terms = ["All Terms", "Term 1", "Term 2", "Term 3"]

export function StudentsTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("All Grades")
  const [selectedSubject, setSelectedSubject] = useState("All Subjects")
  const [selectedTerm, setSelectedTerm] = useState("All Terms")

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGrade = selectedGrade === "All Grades" || student.grade === selectedGrade
    return matchesSearch && matchesGrade
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-accent/15 text-accent hover:bg-accent/25 border-0">Active</Badge>
      case "inactive":
        return <Badge variant="secondary" className="text-muted-foreground">Inactive</Badge>
      case "probation":
        return <Badge className="bg-chart-5/15 text-chart-5 hover:bg-chart-5/25 border-0">Probation</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Student Management</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-9 bg-background"
              />
            </div>

            {/* Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Filters
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Filter Students</h4>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Grade</label>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Subject</label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Term</label>
                    <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {terms.map((term) => (
                          <SelectItem key={term} value={term}>
                            {term}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedGrade("All Grades")
                        setSelectedSubject("All Subjects")
                        setSelectedTerm("All Terms")
                      }}
                    >
                      Clear
                    </Button>
                    <Button size="sm">Apply Filters</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Add Student
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold text-foreground">Name</TableHead>
                <TableHead className="font-semibold text-foreground">Grade</TableHead>
                <TableHead className="font-semibold text-foreground">Class</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {student.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{student.grade}</TableCell>
                  <TableCell className="text-muted-foreground">Class {student.class}</TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>View Report Card</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Remove Student
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
