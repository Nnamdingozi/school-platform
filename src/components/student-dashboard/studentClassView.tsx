import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { UserCheck, Users} from "lucide-react";

export function StudentClassView({ data }: { data: any }) {
  if (!data) return <div>You are not currently enrolled in a class.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Class Info & My Subjects */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-school-primary text-white p-8 rounded-[2rem] shadow-xl">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Your Class</h2>
          <p className="text-3xl font-black italic uppercase mt-2">{data.name}</p>
          <div className="mt-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold opacity-70 uppercase">Class Teacher</p>
              <p className="font-bold">{data.teacher.name}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-[2rem] border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-black uppercase text-slate-500 mb-4 tracking-widest">My Registered Subjects</h3>
          <div className="flex flex-wrap gap-2">
            {data.mySubjects.map((sub: string) => (
              <Badge key={sub} variant="outline" className="px-3 py-1 rounded-lg border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                {sub}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Right Column: Classmates List */}
      <div className="lg:col-span-2">
        <Card className="p-8 rounded-[2rem] border-slate-200 dark:border-slate-800 h-full">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">Classmates ({data.classmates.length})</h3>
            <Users className="h-4 w-4 text-slate-300" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.classmates.map((student: any) => (
              <div key={student.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-transparent hover:border-school-primary/20 transition-all">
                <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800">
                  <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-[10px] font-bold">
                    {student.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight truncate">
                  {student.name}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}