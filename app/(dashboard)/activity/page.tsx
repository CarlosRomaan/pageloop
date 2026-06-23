import {
  CheckCircle2,
  FolderKanban,
  Globe,
  MessageSquare,
  UserPlus,
} from "lucide-react";

import { getWorkspaceActivity } from "@/features/activity/queries";

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

const ActivityPage = async () => {
  const { workspace, activities } = await getWorkspaceActivity();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Dashboard / Activity
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Activity
        </h1>

        <p className="mt-2 text-muted-foreground">
          Recent activity across {workspace.name}.
        </p>
      </div>

      <div className="rounded-xl border bg-background">
        <div className="divide-y">
          {activities.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No activity yet.
            </div>
          ) : (
            activities.map((activity) => {
              const Icon =
                activityIcons[
                  activity.type as keyof typeof activityIcons
                ] ?? MessageSquare;

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-5"
                >
                  <div className="rounded-full border p-2">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {activity.message ?? "Activity recorded"}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>
                        {activity.actor?.name ??
                          activity.actor?.email ??
                          "System"}
                      </span>

                      {activity.project ? (
                        <>
                          <span>•</span>
                          <span>{activity.project.name}</span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <span className="shrink-0 text-xs text-muted-foreground">
                    {activity.createdAt.toLocaleString()}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;