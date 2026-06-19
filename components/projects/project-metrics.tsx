import {
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Users,
} from "lucide-react";

import MetricCard from "@/components/dashboard/metric-card";
import { ProjectMetricsProps } from "@/types/dashboard";

const ProjectMetrics = ({ metrics }: ProjectMetricsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      <MetricCard
        title="Open"
        value={metrics.openComments}
        description="Needs action"
        icon={MessageSquare}
      />

      <MetricCard
        title="In progress"
        value={metrics.inProgressComments}
        description="Being worked on"
        icon={Clock}
      />

      <MetricCard
        title="Needs review"
        value={metrics.needsReviewComments}
        description="Client approval"
        icon={Clock}
      />

      <MetricCard
        title="Resolved"
        value={metrics.resolvedComments}
        description="Completed"
        icon={CheckCircle2}
      />

      <MetricCard
        title="Pages"
        value={metrics.pages}
        description="Detected"
        icon={FileText}
      />

      <MetricCard
        title="Members"
        value={metrics.members}
        description="Project team"
        icon={Users}
      />
    </div>
  );
};

export default ProjectMetrics;