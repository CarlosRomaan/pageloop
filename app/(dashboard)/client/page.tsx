import Link from "next/link";

import { getClientProjects } from "@/features/client/queries";

const ClientPortalPage = async () => {
  const projects = await getClientProjects();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Client Portal
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Your review projects
        </h1>

        <p className="mt-2 text-muted-foreground">
          Review feedback, track progress and approve updates.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-background p-8 text-center">
          <h2 className="font-semibold">No client projects yet</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Projects shared with you will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const openComments = project.comments.filter(
              (comment) => comment.status === "OPEN"
            ).length;

            const needsReview = project.comments.filter(
              (comment) => comment.status === "IN_REVIEW"
            ).length;

            const resolved = project.comments.filter(
              (comment) => comment.status === "RESOLVED"
            ).length;

            return (
              <Link
                key={project.id}
                href={`/client/projects/${project.slug}`}
                className="rounded-xl border bg-background p-5 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">{project.name}</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {project.domains[0]?.domain ?? "No domain"}
                    </p>
                  </div>

                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {project.status}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="font-medium">{openComments}</p>
                    <p className="text-xs text-muted-foreground">Open</p>
                  </div>

                  <div>
                    <p className="font-medium">{needsReview}</p>
                    <p className="text-xs text-muted-foreground">Review</p>
                  </div>

                  <div>
                    <p className="font-medium">{resolved}</p>
                    <p className="text-xs text-muted-foreground">Resolved</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientPortalPage;