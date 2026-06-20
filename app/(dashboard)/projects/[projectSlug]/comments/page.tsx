import { ProjectCommentsPageProps } from "@/types/project";

import ProjectNavigation from "@/components/projects/project-navigation";
import ProjectCommentsFilters from "@/components/projects/project-comments-filters";
import ProjectCommentsTable from "@/components/projects/project-comments-table";
import { getProjectComments } from "@/features/projects/queries";
import { getCurrentProjectMemberOrThrow } from "@/lib/project-permissions";

const ProjectCommentsPage = async ({
  params,
  searchParams,
}: ProjectCommentsPageProps) => {
  const { projectSlug } = await params;
  const filters = await searchParams;

  const { project, comments, pages, members } =
    await getProjectComments(projectSlug, filters);

  const member = await getCurrentProjectMemberOrThrow(project.id);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Dashboard / Projects / {project.name} / Comments
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Comments
        </h1>

        <p className="mt-2 text-muted-foreground">
          Review, assign and track feedback across this project.
        </p>
      </div>

      <ProjectNavigation 
        projectSlug={project.slug} 
        canManageProject={member.role === "ADMIN"}
      />

      <ProjectCommentsFilters
        projectSlug={project.slug}
        pages={pages}
        members={members}
        selectedStatus={filters.status}
        selectedPageId={filters.pageId}
        selectedAssigneeId={filters.assigneeId}
      />

      <ProjectCommentsTable
        projectSlug={project.slug}
        comments={comments}
      />
    </div>
  );
};

export default ProjectCommentsPage;