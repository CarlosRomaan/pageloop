import Link from "next/link";

import type { ProjectCommentItem, ProjectCommentsTableProps } from "@/types/project";

const statusStyles = {
  OPEN: "bg-amber-100 text-amber-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  IN_REVIEW: "bg-purple-100 text-purple-800",
  RESOLVED: "bg-green-100 text-green-800",
};

const statusLabels = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  RESOLVED: "Resolved",
};

const ProjectCommentsTable = ({
  projectSlug,
  comments,
}: ProjectCommentsTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Comment</th>
            <th className="px-4 py-3 font-medium">Page</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Assignee</th>
            <th className="px-4 py-3 font-medium">Author</th>
            <th className="px-4 py-3 font-medium">Replies</th>
          </tr>
        </thead>

        <tbody>
          {comments.map((comment) => (
            <tr
              key={comment.id}
              className="border-t transition-colors hover:bg-muted/40"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/projects/${projectSlug}/comments/${comment.id}`}
                  className="font-medium hover:underline"
                >
                  #{comment.number} {comment.message}
                </Link>
              </td>

              <td className="px-4 py-3 text-muted-foreground">
                {comment.page.title ?? comment.page.path}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    statusStyles[comment.status]
                  }`}
                >
                  {statusLabels[comment.status]}
                </span>
              </td>

              <td className="px-4 py-3 text-muted-foreground">
                {comment.assignee?.name ?? "Unassigned"}
              </td>

              <td className="px-4 py-3 text-muted-foreground">
                {comment.author.name ?? comment.author.email}
              </td>

              <td className="px-4 py-3 text-muted-foreground">
                {comment.replies.length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectCommentsTable;