import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  FolderKanban,
  Globe,
  MessageSquare,
  UserPlus,
} from "lucide-react";

import { getNotificationItems } from "@/features/notifications/queries";

const notificationIcons = {
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

const NotificationsMenu = async () => {
  const notifications = await getNotificationItems();

  return (
    <div className="relative">
      <details className="group">
        <summary className="relative flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-4 w-4" />

          {notifications.length > 0 ? (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          ) : null}
        </summary>

        <div className="absolute right-0 z-50 mt-2 w-96 overflow-hidden rounded-xl border bg-background shadow-xl">
          <div className="border-b p-4">
            <h2 className="font-semibold">Notifications</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Recent workspace activity.
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => {
                  const Icon =
                    notificationIcons[
                      notification.type as keyof typeof notificationIcons
                    ] ?? MessageSquare;

                  return (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 p-4"
                    >
                      <div className="rounded-full border p-2">
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">
                          {notification.message ?? "Activity recorded"}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {notification.actor?.name ??
                            notification.actor?.email ??
                            "System"}
                          {notification.project
                            ? ` • ${notification.project.name}`
                            : ""}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {notification.createdAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t p-3">
            <Link
              href="/activity"
              className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-primary hover:bg-muted"
            >
              View all activity
            </Link>
          </div>
        </div>
      </details>
    </div>
  );
};

export default NotificationsMenu;