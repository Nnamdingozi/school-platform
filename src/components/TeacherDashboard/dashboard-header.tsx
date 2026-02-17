

"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { 
  Plus, 
  Zap, 
  BookOpen, 
  FileText, 
  Users, 
  ChevronDown 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  teacherName: string;
  subjects: { id: string; displayName: string }[];
  activeSubjectId?: string;
}

export function DashboardHeader({ 
  teacherName, 
  subjects, 
  activeSubjectId 
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle Subject Switching
  const handleSubjectChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("subjectId", id);
    // Important: When changing subject, clear topic-specific filters
    params.delete("topicId");
    params.delete("week");
    params.delete("termId");
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Quick Start Navigation Logic
  const navigateTo = (basePath: string) => {
    const suffix = activeSubjectId ? `?subjectId=${activeSubjectId}` : "";
    router.push(`${basePath}${suffix}`);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 md:gap-8">
        <div>
          <h1 className="text-lg font-bold tracking-tight md:text-xl">
            Welcome, {teacherName}
          </h1>
        </div>

        {/* Subject Switcher */}
        <div className="hidden sm:block">
          <Select value={activeSubjectId} onValueChange={handleSubjectChange}>
            <SelectTrigger className="w-[220px] lg:w-[280px] bg-muted/50 border-none hover:bg-muted transition-colors">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Your Assigned Subjects
              </DropdownMenuLabel>
              {subjects.map((s) => (
                <SelectItem key={s.id} value={s.id} className="cursor-pointer">
                  {s.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Quick Start Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="bg-amber-600 hover:bg-amber-700 text-white gap-2 shadow-sm">
              <Zap className="h-4 w-4 fill-current" />
              <span className="hidden sm:inline">Quick Start</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Common Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => navigateTo("/planner")}>
              <BookOpen className="mr-2 h-4 w-4 text-amber-600" />
              <span>Generate AI Lesson</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigateTo("/assessments/new")}>
              <Plus className="mr-2 h-4 w-4 text-blue-600" />
              <span>New Assessment</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigateTo("/reports")}>
              <FileText className="mr-2 h-4 w-4 text-emerald-600" />
              <span>View Gradebook</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => navigateTo("/students")}>
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Class Directory</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Subject Toggle (Visible only on small screens) */}
        <div className="sm:hidden">
            <Select value={activeSubjectId} onValueChange={handleSubjectChange}>
                <SelectTrigger className="w-[40px] p-0 border-none bg-transparent">
                    <ChevronDown className="h-5 w-5" />
                </SelectTrigger>
                <SelectContent>
                    {subjects.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.displayName}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>
    </header>
  );
}