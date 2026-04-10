import { CheckCircle2 } from "lucide-react";

export function SyllabusSelector({
  termGroups,
  selectedTopicIds,
  setSelectedTopicIds,
}: any) {
  return (
    <div className="space-y-8">
      {termGroups.map((term: any) => (
        <div key={term.id} className="space-y-4">
          <h3 className="text-xs font-black uppercase text-school-primary italic px-2">
            {term.displayName}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {term.topics.map((t: any) => (
              <button
                key={t.id}
                onClick={() =>
                  setSelectedTopicIds((prev: string[]) =>
                    prev.includes(t.id)
                      ? prev.filter((x) => x !== t.id)
                      : [...prev, t.id]
                  )
                }
                className="p-4 rounded-xl border text-left text-[11px] font-bold bg-slate-900 text-slate-400 flex justify-between"
              >
                {t.title}

                {selectedTopicIds.includes(t.id) && (
                  <CheckCircle2 className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}