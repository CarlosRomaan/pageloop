import { LucideIcon } from "lucide-react";
import type { ActivityLog, Project, User, Comment, ProjectDomain } from "@prisma/client";

export type MetricCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
};

export type RecentActivityProps = {
  activities: Array<
    ActivityLog & {
      actor: User | null;
      project: Project | null;
    }
  >;
};

export type NeedsAttentionProps = {
  items: {
    id: string;
    name: string;
    slug: string;
    openCount: number;
    needsReviewCount: number;
    hasWidgetIssue: boolean;
  }[];
};

export type ProjectsOverviewProps = {
  projects: Array<
    Project & {
      domains: ProjectDomain[];
      comments: Comment[];
    }
  >;
};

export type ProjectOverviewPageProps = {
  params: Promise<{
    projectSlug: string;
  }>;
};

export type ProjectActivityCardProps = {
  activities: Array<
    ActivityLog & {
      actor: User | null;
    }
  >;
};

export type ProjectDomainsCardProps = {
  domains: ProjectDomain[];
};

export type InstallationStatusCardProps = {
  setupCompletedAt: Date | null;
  lastWidgetPingAt: Date | null;
};

export type ProjectHeaderProps = {
  name: string;
  domain?: string;
  status: string;
};

export type ProjectMetricsProps = {
  metrics: {
    openComments: number;
    inProgressComments: number;
    needsReviewComments: number;
    resolvedComments: number;
    pages: number;
    members: number;
  };
};