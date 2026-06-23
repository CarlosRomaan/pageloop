import Link from "next/link";
import {
  Archive,
  FileText,
  MessageSquare,
} from "lucide-react";

import { getWorkspacePages } from "@/features/pages/queries";

const PagesPage = async () => {
  const pages = await getWorkspacePages();

  const totalPages = pages.length;

  const pagesWithComments = pages.filter(
    (page) => page.comments.length > 0
  ).length;

  const archivedPages = pages.filter((page) => page.isArchived).length;

  const totalComments = pages.reduce(
    (total, page) => total + page.comments.length,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Pages
        </h1>

        <p className="mt-2 text-muted-foreground">
          Pages detected across all workspace projects.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-background p-5">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <p className="mt-4 text-2xl font-semibold">{totalPages}</p>
          <p className="text-sm text-muted-foreground">Total pages</p>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <p className="mt-4 text-2xl font-semibold">
            {pagesWithComments}
          </p>
          <p className="text-sm text-muted-foreground">With comments</p>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <p className="mt-4 text-2xl font-semibold">
            {totalComments}
          </p>
          <p className="text-sm text-muted-foreground">Total comments</p>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <Archive className="h-5 w-5 text-muted-foreground" />
          <p className="mt-4 text-2xl font-semibold">
            {archivedPages}
          </p>
          <p className="text-sm text-muted-foreground">Archived</p>
        </div>
      </div>

      <div className="rounded-xl border bg-background">
        <div className="border-b p-5">
          <h2 className="font-semibold">All pages</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review detected pages and their feedback activity.
          </p>
        </div>

        {pages.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="font-semibold">No pages yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Pages detected by the widget will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/projects/${page.project.slug}/pages`}
                className="block p-5 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="line-clamp-1 font-medium">
                      {page.title ?? page.path}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {page.project.name}
                      {" • "}
                      {page.path}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {page.comments.length} comments
                      {" • "}
                      Last seen{" "}
                      {page.lastSeenAt
                        ? page.lastSeenAt.toLocaleDateString()
                        : "Never"}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {page.isArchived ? "Archived" : "Active"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PagesPage;