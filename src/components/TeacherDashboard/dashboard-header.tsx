// "use client"

// import { ChevronDown, Plus } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { SidebarTrigger } from "@/components/ui/sidebar"

// type SubjectOption = {
//   id: string
//   /**
//    * Pre-formatted label, e.g. "[Grade Name] [Subject Name]"
//    */
//   displayName: string
//   studentCount: number
// }

// interface DashboardHeaderProps {
//   teacherName: string
//   subjects: SubjectOption[]
// }

// export function DashboardHeader({ teacherName, subjects }: DashboardHeaderProps) {
//   const hasSubjects = subjects.length > 0
//   const currentSubject = hasSubjects ? subjects[0] : null

//   return (
//     <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
//       <div className="flex items-center gap-4">
//         <SidebarTrigger className="md:hidden" />
//         <div>
//           <h1 className="text-lg font-semibold text-foreground md:text-xl">
//             Good morning, {teacherName}
//           </h1>
//           <p className="text-sm text-muted-foreground">
//             {"Let's make today a great learning day!"}
//           </p>
//         </div>
//       </div>
//       <div className="flex items-center gap-3">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="outline"
//               className="gap-2 bg-transparent"
//               disabled={!hasSubjects}
//             >
//               <span className="hidden sm:inline">
//                 {currentSubject ? currentSubject.displayName : "No subjects assigned"}
//               </span>
//               <span className="sm:hidden">
//                 {currentSubject ? currentSubject.displayName : "No subjects"}
//               </span>
//               <ChevronDown className="h-4 w-4 text-muted-foreground" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-56">
//             {hasSubjects ? (
//               subjects.map((subject) => (
//                 <DropdownMenuItem key={subject.id} className="flex justify-between">
//                   <span>{subject.displayName}</span>
//                   <span className="text-xs text-muted-foreground">
//                     {subject.studentCount} students
//                   </span>
//                 </DropdownMenuItem>
//               ))
//             ) : (
//               <DropdownMenuItem className="flex justify-between">
//                 <span>No subjects assigned</span>
//               </DropdownMenuItem>
//             )}
//           </DropdownMenuContent>
//         </DropdownMenu>
//         <Button className="gap-2">
//           <Plus className="h-4 w-4" />
//           <span className="hidden sm:inline">Quick Create</span>
//         </Button>
//       </div>
//     </header>
//   )
// }




"use client";

import * as React from "react";
import { Check, ChevronsUpDown, BookOpen, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock data structure - replace with your actual types/data
const subjects = [
  { label: "Mathematics", grade: "Grade 10", value: "math-10" },
  { label: "Physics", grade: "Grade 11", value: "physics-11" },
  { label: "English Literature", grade: "Grade 9", value: "eng-lit-9" },
];

export function DashboardHeader() {
  const [open, setOpen] = React.useState(false);
  const [selectedSubject, setSelectedSubject] = React.useState(subjects[0]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a subject"
          className="w-[250px] justify-between px-3 py-6 hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-start gap-0.5 leading-none">
              <span className="font-semibold text-sm">{selectedSubject.label}</span>
              <span className="text-xs text-muted-foreground">{selectedSubject.grade}</span>
            </div>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search subjects..." />
          <CommandList>
            <CommandEmpty>No subject found.</CommandEmpty>
            <CommandGroup heading="Subjects">
              {subjects.map((subject) => (
                <CommandItem
                  key={subject.value}
                  onSelect={() => {
                    setSelectedSubject(subject);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{subject.label}</span>
                    <span className="text-xs text-muted-foreground">{subject.grade}</span>
                  </div>
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedSubject.value === subject.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem className="cursor-pointer">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Add New Subject</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}