"use client";

import KanbanTab from "./KanbanTab";
import OverviewTab from "./OverviewTab";
import WorkDoneTab from "./WorkDoneTab";
import TeamTab from "./TeamTab";
import MilestoneTab from "./MilestoneTab";
import AssetsTab from "./AssetsTab";
import StatusTab from "./StatusTab";
import TicketsTab from "./TicketsTab";
import ReportIssueTab from "./ReportIssueTab";
import UsefulTipsTab from "./TipsTab";
import ClientUpdate from "./ClientUpdate";

export default function TabContent({ activeTab, project }: any) {
  // console.log(project,"projectss");
  

  switch (activeTab) {
    case "Overview":
      return <OverviewTab project={project} />;

    case "Work Done":
      return <WorkDoneTab projectId={project} />;

    case "Kanban":
      return <KanbanTab projectId={project} />;

    case "Team":
      return <TeamTab projectId={project} />;

    case "Milestones":
      return <MilestoneTab projectId={project} />;

    case "Assets":
      return <AssetsTab projectId={project} />;

    case "Progress":
      return <StatusTab projectId={project} />;

    case "Tickets":
      return <TicketsTab projectId={project} />;

    case "Report Issue":
      return <ReportIssueTab projectId={project} />;

    case "Tips":
      return <UsefulTipsTab projectId={project} />;

    case "Client Update":
      return <ClientUpdate projectId={project} />
    // default:
    //   return <OverviewTab project={project} />;
  }
}
