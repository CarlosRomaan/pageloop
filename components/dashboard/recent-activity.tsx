import {
  CheckCircle2,
  FolderKanban,
  Globe,
  MessageSquare,
  UserPlus,
} from "lucide-react";

import type { RecentActivityProps } from "@/types/dashboard";

const activityIcons = {
  PROJECT_CREATED: FolderKanban,
  PROJECT_UPDATED: FolderKanban,
  DOMAIN_ADDED: Globe,
  COMMENT_CREATED: MessageSquare,
  COMMENT_ASSIGNED: MessageSquare,
  COMMENT_STATUS_CHANGED: CheckCircle2,
  COMMENT_REPLIED: MessageSquare,
  INVITE_SENT: UserPlus,
  INVITE_ACCEPTED: UserPlus,
} as const;

const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Recent activity</h2>

        <button className="text-sm text-primary hover:underline">
          View all
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No activity yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon =
              activityIcons[
                activity.type as keyof typeof activityIcons
              ] ?? MessageSquare;

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="rounded-full border p-2">
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {activity.message ?? "Activity recorded"}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {activity.actor ? (
                      <span>
                        {activity.actor.name ??
                          activity.actor.email}
                      </span>
                    ) : (
                      <span>System</span>
                    )}

                    {activity.project ? (
                      <>
                        <span>•</span>
                        <span>{activity.project.name}</span>
                      </>
                    ) : null}
                  </div>
                </div>

                <span className="shrink-0 text-xs text-muted-foreground">
                  {activity.createdAt.toLocaleDateString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;