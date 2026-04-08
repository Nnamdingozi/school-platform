"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, GraduationCap, ClipboardList } from "lucide-react"

export function AssessmentDashboard({ data }: { data: any }) {
  const { subjectView, classView } = data;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
      <header>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Assessment Registry</h1>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Grading & Performance Monitoring</p>
      </header>

      <Tabs defaultValue="subject" className="w-full">
        <TabsList className="bg-slate-900 border border-white/5 p-1 rounded-2xl mb-8">
          <TabsTrigger value="subject" className="rounded-xl px-8 data-[state=active]:bg-school-primary data-[state=active]:text-slate-950 font-bold uppercase text-[10px]">
            <BookOpen className="h-3 w-3 mr-2" /> My Subjects
          </TabsTrigger>
          <TabsTrigger value="class" className="rounded-xl px-8 data-[state=active]:bg-school-primary data-[state=active]:text-slate-950 font-bold uppercase text-[10px]">
            <Users className="h-3 w-3 mr-2" /> My Classroom
          </TabsTrigger>
        </TabsList>

        {/* ── VIEW A: SUBJECT-CENTRIC ── */}
        <TabsContent value="subject" className="space-y-6">
          {subjectView.map((gs: any) => (
            <Card key={gs.id} className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden">
              <div className="bg-slate-950/50 p-6 border-b border-white/5 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black text-white italic uppercase">{gs.subject.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{gs.grade.displayName}</p>
                </div>
                <Badge variant="outline" className="text-school-primary border-school-primary/20">
                  {gs.studentSubjects.length} Students enrolled
                </Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-950 text-[10px] uppercase font-black text-slate-500">
                    <tr>
                      <th className="px-6 py-4 text-left">Student Name</th>
                      <th className="px-6 py-4 text-left">Latest Assessment</th>
                      <th className="px-6 py-4 text-center">Score</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {gs.studentSubjects.map((ss: any) => {
                      const latest = ss.student.assessments[0];
                      return (
                        <tr key={ss.student.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-200 uppercase text-xs">{ss.student.name}</td>
                          <td className="px-6 py-4 text-slate-400 italic text-xs">{latest?.topic?.title || "No data"}</td>
                          <td className="px-6 py-4 text-center font-black text-school-primary">
                            {latest ? `${latest.score}/${latest.maxScore}` : "--"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-[9px] font-black uppercase tracking-tighter text-slate-600 hover:text-school-primary">View History</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* ── VIEW B: CLASS-CENTRIC ── */}
        <TabsContent value="class" className="space-y-6">
          {classView.map((cls: any) => (
            <Card key={cls.id} className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden">
               <div className="bg-slate-950/50 p-6 border-b border-white/5">
                  <h3 className="text-lg font-black text-white italic uppercase">{cls.name} Registry</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Master List — All Subjects</p>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-950 text-[10px] uppercase font-black text-slate-500">
                      <tr>
                        <th className="px-6 py-4 text-left">Identity</th>
                        <th className="px-6 py-4 text-left">Recent Activity</th>
                        <th className="px-6 py-4 text-center">Subject Count</th>
                        <th className="px-6 py-4 text-right">Performance Index</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {cls.enrollments.map((e: any) => (
                        <tr key={e.student.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-200 uppercase text-xs">{e.student.name}</td>
                          <td className="px-6 py-4 text-slate-500 text-[10px] font-medium italic truncate max-w-[150px]">
                            {e.student.assessments[0]?.gradeSubject?.subject?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-center text-slate-400 font-mono text-xs">
                             {e.student.assessments.length}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="h-1.5 w-20 bg-slate-800 rounded-full ml-auto overflow-hidden">
                               <div className="h-full bg-school-primary" style={{ width: '75%' }}></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}