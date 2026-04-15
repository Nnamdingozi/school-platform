// import { SubjectSelector } from "./subjectSelector";
// import { SyllabusSelector } from "./syllabusSelector";
// import { SettingsSidebar } from "./settingsSidebar";

// export function DraftBuilder(props: any) {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

//       <SubjectSelector
//         assignments={props.assignments}
//         selectedAssignment={props.selectedAssignment}
//         setSelectedAssignment={props.setSelectedAssignment}
//       />

//       <SyllabusSelector
//         termGroups={props.termGroups}
//         selectedTopicIds={props.selectedTopicIds}
//         setSelectedTopicIds={props.setSelectedTopicIds}
//       />

//       <SettingsSidebar {...props} />
//     </div>
//   );
// }


import { SubjectSelector } from "./subjectSelector";
import { SyllabusSelector } from "./syllabusSelector";
import { SettingsSidebar } from "./settingsSidebar";
import { Card } from "@/components/ui/card";

export function DraftBuilder(props: any) {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-10">

      {/* Step 1 */}
      <Card className="p-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-8 rounded-full bg-school-primary text-white flex items-center justify-center text-sm font-bold">
            1
          </div>
          <h3 className="text-lg font-bold tracking-tight">
            Select Subject
          </h3>
        </div>

        <div className="border-t pt-6">
          <SubjectSelector
            assignments={props.assignments}
            selectedAssignment={props.selectedAssignment}
            setSelectedAssignment={props.setSelectedAssignment}
          />
        </div>

      </Card>


      {/* Step 2 */}
      <Card className="p-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-8 rounded-full bg-school-primary text-white flex items-center justify-center text-sm font-bold">
            2
          </div>
          <h3 className="text-lg font-bold tracking-tight">
            Choose Topics
          </h3>
        </div>

        <div className="border-t pt-6">
          <SyllabusSelector
            termGroups={props.termGroups}
            selectedTopicIds={props.selectedTopicIds}
            setSelectedTopicIds={props.setSelectedTopicIds}
          />
        </div>

      </Card>


      {/* Step 3 */}
      <Card className="p-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-8 rounded-full bg-school-primary text-white flex items-center justify-center text-sm font-bold">
            3
          </div>
          <h3 className="text-lg font-bold tracking-tight">
            Exam Settings & Classes
          </h3>
        </div>

        <div className="border-t pt-6">
          <SettingsSidebar {...props} />
        </div>

      </Card>

    </div>
  );
}