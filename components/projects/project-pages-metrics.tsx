import { CheckCircle2, Clock, FileText, MessageSquare } from "lucide-react";

import MetricCard from "@/components/dashboard/metric-card";
import type { ProjectPageItem } from "@/types/project";

type ProjectPagesMetricsProps = {
  pages: ProjectPageItem[];
};

const ProjectPagesMetrics = ({ pages }: ProjectPagesMetricsProps) => {
  const comments = pages.flatMap((page) => page.comments);

  const openComments = comments.filter(
    (comment) => comment.status === "OPEN"
  ).length;

  const inProgressComments = comments.filter(
    (comment) => comment.status === "IN_PROGRESS"
  ).length;

  const needsReviewComments = comments.filter(
    (comment) => comment.status === "IN_REVIEW"
  ).length;

  const resolvedComments = comments.filter(
    (comment) => comment.status === "RESOLVED"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <MetricCard
        title="Detected pages"
        value={pages.length}
        description="Pages where PageLoop loaded"
        icon={FileText}
      />

      <MetricCard
        title="Open comments"
        value={openComments}
        description="Need action"
        icon={MessageSquare}
      />

      <MetricCard
        title="In progress"
        value={inProgressComments}
        description="Being worked on"
        icon={Clock}
      />

      <MetricCard
        title="Needs review"
        value={needsReviewComments}
        description="Waiting approval"
        icon={Clock}
      />

      <MetricCard
        title="Resolved"
        value={resolvedComments}
        description="Completed"
        icon={CheckCircle2}
      />
    </div>
  );
};

export default ProjectPagesMetrics;