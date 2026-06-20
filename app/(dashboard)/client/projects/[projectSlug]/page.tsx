import Link from "next/link";

import { getClientProject } from "@/features/client/queries";

type ClientProjectPageProps = {
  params: Promise<{
    projectSlug: string;
  }>;
};

const ClientProjectPage = async ({ params }: ClientProjectPageProps) => {
  const { projectSlug } = await params;

  const project = await getClientProject(projectSlug);

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
    <div className="space-y-6">
      <div>
        <Link
          href="/client"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to client portal
        </Link>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          {project.name}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {project.domains[0]?.domain ?? "No domain"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-background p-5">
          <p className="text-sm text-muted-foreground">Open comments</p>
          <p className="mt-2 text-3xl font-semibold">{openComments}</p>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <p className="text-sm text-muted-foreground">Needs review</p>
          <p className="mt-2 text-3xl font-semibold">{needsReview}</p>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <p className="text-sm text-muted-foreground">Resolved</p>
          <p className="mt-2 text-3xl font-semibold">{resolved}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-background">
        <div className="border-b p-5">
          <h2 className="font-semibold">Comments</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review feedback and track progress.
          </p>
        </div>

        <div className="divide-y">
          {project.comments.map((comment) => (
            <Link
              key={comment.id}
              href={`/client/projects/${project.slug}/comments/${comment.id}`}
              className="block p-5 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">
                    #{comment.number} {comment.message}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {comment.page.title ?? comment.page.path}
                  </p>
                </div>

                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  {comment.status.replace("_", " ")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientProjectPage;