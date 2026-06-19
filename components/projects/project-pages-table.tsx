import type { ProjectPageItem } from "@/types/project";

type ProjectPagesTableProps = {
  pages: ProjectPageItem[];
};

const ProjectPagesTable = ({ pages }: ProjectPagesTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Page</th>
            <th className="px-4 py-3 font-medium">Path</th>
            <th className="px-4 py-3 font-medium">Open</th>
            <th className="px-4 py-3 font-medium">Needs review</th>
            <th className="px-4 py-3 font-medium">Resolved</th>
            <th className="px-4 py-3 font-medium">Last seen</th>
          </tr>
        </thead>

        <tbody>
          {pages.map((page) => {
            const openCount = page.comments.filter(
              (comment) => comment.status === "OPEN"
            ).length;

            const needsReviewCount = page.comments.filter(
              (comment) => comment.status === "IN_REVIEW"
            ).length;

            const resolvedCount = page.comments.filter(
              (comment) => comment.status === "RESOLVED"
            ).length;

            return (
              <tr
                key={page.id}
                className="border-t transition-colors hover:bg-muted/40"
              >
                <td className="px-4 py-3 font-medium">
                  {page.title ?? "Untitled page"}
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  {page.path}
                </td>

                <td className="px-4 py-3">{openCount}</td>

                <td className="px-4 py-3">{needsReviewCount}</td>

                <td className="px-4 py-3">{resolvedCount}</td>

                <td className="px-4 py-3 text-muted-foreground">
                  {page.lastSeenAt
                    ? page.lastSeenAt.toLocaleDateString()
                    : "Not detected yet"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectPagesTable;