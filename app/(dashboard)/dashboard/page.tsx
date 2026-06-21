import {
  CheckCircle2,
  Clock,
  Folder,
  MessageSquare,
} from "lucide-react";

import MetricCard from "@/components/dashboard/metric-card";
import NeedsAttention from "@/components/dashboard/needs-attention";
import ProjectsOverview from "@/components/dashboard/projects-overview";
import RecentActivity from "@/components/dashboard/recent-activity";
import { getDashboardData } from "@/features/dashboard/queries";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isCurrentUserClientOnly } from "@/lib/current-user-role";

const DashboardPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const isClientOnly = await isCurrentUserClientOnly();

  if (isClientOnly) {
    redirect("/client");
  }

  const dashboardData = await getDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Welcome back. Here&apos;s what&apos;s happening in{" "}
          {dashboardData.workspace.name}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Open comments"
          value={dashboardData.metrics.openComments}
          description="Comments waiting for action"
          icon={MessageSquare}
        />

        <MetricCard
          title="In progress"
          value={dashboardData.metrics.inProgressComments}
          description="Currently being worked on"
          icon={Clock}
        />

        <MetricCard
          title="Needs review"
          value={dashboardData.metrics.needsReviewComments}
          description="Waiting for client approval"
          icon={Clock}
        />

        <MetricCard
          title="Resolved"
          value={dashboardData.metrics.resolvedComments}
          description="Approved or completed"
          icon={CheckCircle2}
        />

        <MetricCard
          title="Projects"
          value={dashboardData.metrics.projects}
          description="Recently updated projects"
          icon={Folder}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <NeedsAttention items={dashboardData.needsAttention} />
        <RecentActivity activities={dashboardData.recentActivity} />
      </div>

      <ProjectsOverview projects={dashboardData.projects} />
    </div>
  );
};

export default DashboardPage;