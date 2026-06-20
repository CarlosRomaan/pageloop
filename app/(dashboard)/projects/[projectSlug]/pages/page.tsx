import ProjectNavigation from "@/components/projects/project-navigation";
import ProjectPagesTable from "@/components/projects/project-pages-table";
import { getProjectPages } from "@/features/projects/queries";
import ProjectPagesMetrics from "@/components/projects/project-pages-metrics";
import { getCurrentProjectMemberOrThrow } from "@/lib/project-permissions";

type ProjectPagesPageProps = {
  params: Promise<{
    projectSlug: string;
  }>;
};

const ProjectPagesPage = async ({ params }: ProjectPagesPageProps) => {
  const { projectSlug } = await params;

  const { project, pages } = await getProjectPages(projectSlug);

  const member = await getCurrentProjectMemberOrThrow(project.id);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Dashboard / Projects / {project.name} / Pages
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Pages
        </h1>

        <p className="mt-2 text-muted-foreground">
          Track feedback across pages where PageLoop is installed.
        </p>
      </div>

      <ProjectNavigation 
        projectSlug={project.slug} 
        canManageProject={member.role === "ADMIN"}
      />

      <ProjectPagesMetrics pages={pages} />

      <ProjectPagesTable pages={pages} />
    </div>
  );
};

export default ProjectPagesPage;