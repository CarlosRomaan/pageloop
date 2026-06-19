import InstallationStatusCard from "@/components/projects/installation-status-card";
import ProjectDomainsCard from "@/components/projects/project-domains-card";
import ProjectHeader from "@/components/projects/project-header";
import ProjectMetrics from "@/components/projects/project-metrics";
import ProjectActivityCard from "@/components/projects/project-activity-card";
import { getProjectOverview } from "@/features/projects/queries";
import { ProjectOverviewPageProps } from "@/types/dashboard";
import ProjectNavigation from "@/components/projects/project-navigation";

const ProjectOverviewPage = async ({ params }: ProjectOverviewPageProps) => {
  const { projectSlug } = await params;

  const { project, metrics } = await getProjectOverview(projectSlug);

  const primaryDomain = project.domains[0]?.domain;

  return (
    <div className="space-y-6">
      <ProjectHeader
        name={project.name}
        domain={primaryDomain}
        status={project.status}
      />

      <ProjectNavigation
        projectSlug={project.slug}
      />

      <ProjectMetrics metrics={metrics} />

      <div className="grid gap-6 xl:grid-cols-2">
        <InstallationStatusCard
          setupCompletedAt={project.setupCompletedAt}
          lastWidgetPingAt={project.lastWidgetPingAt}
        />

        <ProjectDomainsCard domains={project.domains} />
      </div>

      <ProjectActivityCard activities={project.activities} />
    </div>
  );
};

export default ProjectOverviewPage;