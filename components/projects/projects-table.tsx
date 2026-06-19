import Link from "next/link";

import type { ProjectListItem } from "@/types/project";

type ProjectsTableProps = {
  projects: ProjectListItem[];
};

const ProjectsTable = ({ projects }: ProjectsTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Project</th>
            <th className="px-4 py-3 font-medium">Domain</th>
            <th className="px-4 py-3 font-medium">Open</th>
            <th className="px-4 py-3 font-medium">Needs review</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => {
            const primaryDomain = project.domains[0]?.domain ?? "No domain";

            const openComments = project.comments.filter(
              (comment) => comment.status === "OPEN"
            ).length;

            const needsReview = project.comments.filter(
              (comment) => comment.status === "IN_REVIEW"
            ).length;

            return (
              <tr
                key={project.id}
                className="border-t transition-colors hover:bg-muted/40"
              >
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="hover:underline"
                  >
                    {project.name}
                  </Link>
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  {primaryDomain}
                </td>

                <td className="px-4 py-3">{openComments}</td>

                <td className="px-4 py-3">{needsReview}</td>

                <td className="px-4 py-3">
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {project.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;