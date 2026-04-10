import { SubjectSelector } from "./subjectSelector";
import { SyllabusSelector } from "./syllabusSelector";
import { SettingsSidebar } from "./settingsSidebar";

export function DraftBuilder(props: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

      <SubjectSelector
        assignments={props.assignments}
        selectedAssignment={props.selectedAssignment}
        setSelectedAssignment={props.setSelectedAssignment}
      />

      <SyllabusSelector
        termGroups={props.termGroups}
        selectedTopicIds={props.selectedTopicIds}
        setSelectedTopicIds={props.setSelectedTopicIds}
      />

      <SettingsSidebar {...props} />
    </div>
  );
}