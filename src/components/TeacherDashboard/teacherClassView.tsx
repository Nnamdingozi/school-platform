import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export function TeacherClassView({ data }: { data: any[] }) {
    // 1. Better Empty State
    if (!data || data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 rounded-[3rem] border border-white/5">
          <div className="p-4 bg-school-primary/10 rounded-full mb-4">
            <Users className="h-10 w-10 text-school-primary" />
          </div>
          <h3 className="text-xl font-black text-white uppercase italic">No Registry Assigned</h3>
          <p className="text-slate-500 text-sm mt-2">You are not currently assigned as a Lead Teacher to any classroom.</p>
          <p className="text-[10px] text-slate-600 uppercase mt-8 tracking-widest">Contact Admin for Registry Access</p>
        </div>
      );
    }
  
    // 2. Default to the first class
    const selectedClass = data[0];
  
    return (
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex justify-between items-end">
          <div>
             <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
               {selectedClass.name}
             </h1>
             <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
               {selectedClass.grade.displayName} — Master Report Sheet
             </p>
          </div>
          
          {/* If teacher has multiple classes, they can see how many here */}
          {data.length > 1 && (
             <span className="text-[10px] font-black bg-school-primary text-slate-950 px-3 py-1 rounded-full">
               + {data.length - 1} OTHER CLASSES
             </span>
          )}
        </header>
  
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {selectedClass.subjectStats?.map((stat: any) => (
            <Card key={stat.subjectName} className="bg-slate-900 border-white/5 p-6 rounded-[1.5rem]">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.subjectName}</p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <span className="text-2xl font-black text-school-primary">{stat.average}%</span>
                  <p className="text-[9px] text-slate-600 font-bold uppercase">Class Avg</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
  
        {/* Table Section (Ensures visibility) */}
        <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-slate-200">
               <thead className="bg-slate-950 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                 <tr>
                   <th className="px-8 py-6 text-left">Student</th>
                   {selectedClass.grade.gradeSubjects.map((gs: any) => (
                     <th key={gs.id} className="px-4 py-6 text-center">{gs.subject.name}</th>
                   ))}
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {selectedClass.students.map((student: any) => (
                    <tr key={student.id} className="hover:bg-white/5">
                      <td className="px-8 py-5 font-bold uppercase text-xs">{student.name}</td>
                      {selectedClass.grade.gradeSubjects.map((gs: any) => {
                         const score = student.assessments.find((a: any) => a.gradeSubjectId === gs.id)?.score;
                         return (
                           <td key={gs.id} className="text-center text-slate-400 font-mono">
                             {score ?? "-"}
                           </td>
                         );
                      })}
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    );
  }