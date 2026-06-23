import Link from "next/link";
import { Bell } from "lucide-react";

import { getNotificationItems } from "@/features/notifications/queries";

const NotificationsMenu = async () => {
  const notifications = await getNotificationItems();

  return (
    <div className="relative">
      <details className="group">
        <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-4 w-4" />
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
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4">
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
                ))}
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