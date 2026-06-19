'use client'

import Link from "next/link";
import { ProjectCommentsFiltersProps } from "@/types/project";
import type {
  CommentStatus,
  Page,
  ProjectMember,
  User,
} from "@prisma/client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const statuses = [
  {
    label: "Open",
    value: "OPEN",
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
  },
  {
    label: "In Review",
    value: "IN_REVIEW",
  },
  {
    label: "Resolved",
    value: "RESOLVED",
  },
];

const createCommentsHref = (
  projectSlug: string,
  params: Record<string, string | undefined>
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();

  return `/projects/${projectSlug}/comments${queryString ? `?${queryString}` : ""
    }`;
};

const ProjectCommentsFilters = ({
  projectSlug,
  pages,
  members,
  selectedStatus,
  selectedPageId,
  selectedAssigneeId,
}: ProjectCommentsFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-background p-4">
      <div className="flex flex-wrap items-center gap-2">
        {statuses.map((status) => (
          <Link
            key={status.value}
            href={createCommentsHref(projectSlug, {
              status:
                selectedStatus === status.value
                  ? undefined
                  : status.value,
              pageId: selectedPageId,
              assigneeId: selectedAssigneeId,
            })}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${selectedStatus === status.value
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
              }`}
          >
            {status.label}
          </Link>
        ))}

        <select
          value={selectedPageId ?? ""}
          onChange={(event) => {
            const params = new URLSearchParams(searchParams);

            if (event.target.value) {
              params.set("pageId", event.target.value);
            } else {
              params.delete("pageId");
            }

            router.push(
              `/projects/${projectSlug}/comments?${params.toString()}`
            );
          }}
        >
          <option value="">All pages</option>

          {pages.map((page) => (
            <option
              key={page.id}
              value={page.id}
            >
              {page.title ?? page.path}
            </option>
          ))}
        </select>

        <select
          value={selectedAssigneeId ?? ""}
          onChange={(event) => {
            const params = new URLSearchParams(searchParams);

            if (event.target.value) {
              params.set("assigneeId", event.target.value);
            } else {
              params.delete("assigneeId");
            }

            router.push(
              `/projects/${projectSlug}/comments?${params.toString()}`
            );
          }}
        >
          <option value="">All assignees</option>
          <option value="unassigned">Unassigned</option>

          {members.map((member) => (
            <option
              key={member.id}
              value={member.userId}
            >
              {member.user.name ?? member.user.email}
            </option>
          ))}
        </select>
      </div>

      <Link
        href={`/projects/${projectSlug}/comments`}
        className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        Clear filters
      </Link>
    </div>
  );
};

export default ProjectCommentsFilters;