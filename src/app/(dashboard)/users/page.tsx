"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Users, 
  GraduationCap, 
  UserCircle,
  Download,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { AddUserManagement } from "@/components/admin-dasboard/add-user-management";
import { downloadUserTemplate } from "@/lib/export-utils";

const ROLE_CONFIG = {
  STUDENT: { label: "Students", icon: <GraduationCap className="w-4 h-4" />, color: "text-blue-600" },
  TEACHER: { label: "Teachers", icon: <Users className="w-4 h-4" />, color: "text-emerald-600" },
  PARENT: { label: "Parents", icon: <UserCircle className="w-4 h-4" />, color: "text-purple-600" },
};

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState("STUDENT");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock IDs - these should come from your Auth Context/Session
  const schoolId = "school-uuid-123";
  const curriculumId = "british-curriculum-id";

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Directory</h1>
          <p className="text-slate-500 font-medium">Add, import, and manage your school community.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={downloadUserTemplate} 
            className="hidden sm:flex gap-2 border-slate-200 hover:bg-slate-50"
          >
            <Download className="w-4 h-4" /> Get Template
          </Button>
          {/* <AddUserManagement schoolId={schoolId} curriculumId={curriculumId} /> */}
        </div>
      </div>

      {/* Control Bar: Tabs & Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
          <TabsList className="grid grid-cols-3 w-full lg:w-[400px] bg-slate-100/50">
            {Object.entries(ROLE_CONFIG).map(([key, config]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all"
              >
                {config.icon}
                <span className="font-bold text-xs uppercase tracking-wider">{config.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder={`Search ${activeTab.toLowerCase()}s...`} 
              className="pl-10 bg-slate-50 border-none focus-visible:ring-amber-500 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl bg-slate-50 text-slate-500">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Table / Empty State */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Card className="border-slate-200 shadow-sm rounded-4xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    {ROLE_CONFIG[activeTab as keyof typeof ROLE_CONFIG].icon}
                    Active {ROLE_CONFIG[activeTab as keyof typeof ROLE_CONFIG].label}
                  </CardTitle>
                  <CardDescription>
                    Showing all registered {activeTab.toLowerCase()}s in your institution.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Empty State placeholder - this is where your <Table> would go */}
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                  <Users className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-900">No {activeTab.toLowerCase()}s onboarded yet</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2 font-medium">
                  It looks like your directory is empty. You can add users one by one or import your entire list via CSV.
                </p>
                <div className="mt-8 flex gap-4">
                  {/* <AddUserManagement schoolId={schoolId} curriculumId={curriculumId} /> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}