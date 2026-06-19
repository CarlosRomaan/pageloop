import { ProjectsOverviewProps } from "@/types/dashboard";

const ProjectsOverview = ({ projects }: ProjectsOverviewProps) => {
  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Projects overview</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Track active projects and pending reviews.
          </p>
        </div>

        <button className="text-sm text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border">
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
                  <td className="px-4 py-3 font-medium">{project.name}</td>

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
    </div>
  );
};

export default ProjectsOverview;