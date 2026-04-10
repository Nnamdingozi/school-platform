export function SubjectSelector({
    assignments,
    selectedAssignment,
    setSelectedAssignment,
  }: any) {
    return (
      <div className="space-y-4">
        {assignments.map((item: any) => (
          <button
            key={item.id}
            onClick={() => setSelectedAssignment(item)}
            className="w-full p-5 rounded-2xl border text-left bg-slate-900"
          >
            <p className="text-[9px] font-black uppercase text-slate-500">
              {item.grade.displayName}
            </p>
  
            <h4 className="text-base font-bold uppercase italic text-white">
              {item.subject.name}
            </h4>
          </button>
        ))}
      </div>
    );
  }