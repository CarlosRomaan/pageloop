import ProjectNavigation from "@/components/projects/project-navigation";
import ProjectTeamTable from "@/components/projects/project-team-table";
import { getProjectTeam } from "@/features/projects/queries";

import ProjectInviteForm from "@/components/projects/project-invite-form";
import ProjectPendingInvites from "@/components/projects/project-pending-invites";

type ProjectTeamPageProps = {
  params: Promise<{
    projectSlug: string;
  }>;
};

const ProjectTeamPage = async ({ params }: ProjectTeamPageProps) => {
  const { projectSlug } = await params;

  const { project, members, invites } = await getProjectTeam(projectSlug);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Dashboard / Projects / {project.name} / Team
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Team
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage the people who can access this project.
        </p>
      </div>

      <ProjectNavigation projectSlug={project.slug} />

      <ProjectInviteForm
        projectId={project.id}
        projectSlug={project.slug}
      />

      <ProjectPendingInvites invites={invites} />

      <ProjectTeamTable members={members} />
    </div>
  );
};

export default ProjectTeamPage;