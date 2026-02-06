import { EmptyState } from "@/components/ui/empty-state";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <EmptyState loading />
    </div>
  );
}
