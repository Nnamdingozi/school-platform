"use client";

import { useMemo, useState, useTransition } from "react";
import { Role } from "@/generated/prisma/enums";
import { toggleSubjectEnrollment } from "@/app/actions/enrollment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ManageSubject = {
  id: string;
  gradeName: string;
  subjectName: string;
  isSelected: boolean;
};

type Props = {
  userId: string;
  userRole: Role;
  subjects: ManageSubject[];
};

export function ManageSubjectsClient({ userId, userRole, subjects }: Props) {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<ManageSubject[]>(subjects);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) => {
      const haystack = `${item.gradeName} ${item.subjectName}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [items, search]);

  const handleToggle = (subject: ManageSubject) => {
    if (isPending) return;

    startTransition(async () => {
      try {
        const optimisticSelected = !subject.isSelected;

        // Optimistic UI update
        setItems((prev) =>
          prev.map((item) =>
            item.id === subject.id ? { ...item, isSelected: optimisticSelected } : item
          )
        );

        const result = await toggleSubjectEnrollment({
          gradeSubjectId: subject.id,
          userId,
        });

        const actionVerb = optimisticSelected ? "added to" : "removed from";
        const noun =
          userRole === Role.STUDENT ? "your subjects" : "your teaching list";

        toast.success(
          `${subject.subjectName} ${actionVerb} ${noun}.`
        );
      } catch (error) {
        console.error(error);
        toast.error("Unable to update subject enrollment. Please try again.");

        // Roll back optimistic change on error
        setItems((prev) =>
          prev.map((item) =>
            item.id === subject.id ? { ...item, isSelected: subject.isSelected } : item
          )
        );
      }
    });
  };

  const titleByRole =
    userRole === Role.STUDENT ? "Manage Your Subjects" : "Manage Your Teaching Subjects";

  const subtitleByRole =
    userRole === Role.STUDENT
      ? "Choose the subjects you want to focus on this term."
      : "Select the subjects and classes you actively teach.";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {titleByRole}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {subtitleByRole}
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <Input
            placeholder="Search by subject or grade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No subjects found. Try adjusting your search.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((subject) => {
            const isSelected = subject.isSelected;

            return (
              <Card
                key={subject.id}
                className={cn(
                  "flex flex-col border transition-colors",
                  isSelected &&
                    "border-amber-400 bg-amber-50/40 dark:border-amber-500 dark:bg-amber-900/20"
                )}
              >
                <CardHeader className="space-y-1 pb-2">
                  <CardTitle className="flex items-center justify-between gap-2 text-base">
                    <span className="truncate">
                      {subject.gradeName} – {subject.subjectName}
                    </span>
                    {isSelected && (
                      <Badge
                        variant="outline"
                        className="border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-200"
                      >
                        Selected
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-auto flex justify-end pt-0">
                  <Button
                    variant={isSelected ? "outline" : "default"}
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleToggle(subject)}
                  >
                    {isSelected ? "Remove" : "Enroll"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

