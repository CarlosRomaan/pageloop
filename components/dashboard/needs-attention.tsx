import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  Wrench,
} from "lucide-react";

import { NeedsAttentionProps } from "@/types/dashboard";

const NeedsAttention = ({ items }: NeedsAttentionProps) => {
  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="mb-4">
        <h2 className="font-semibold">Needs attention</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Projects and comments that need action.
        </p>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border">
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="mt-3 text-sm font-medium">
              Nothing needs attention
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              You&apos;re all caught up.
            </p>
          </div>
        ) : (
          items.map((item) => {
            let description = "";
            let status = "";
            let href = `/projects/${item.slug}`;
            let Icon = MessageSquare;

            if (item.hasWidgetIssue) {
              description = "Widget has not been detected yet.";
              status = "Installation";
              href = `/projects/${item.slug}/installation`;
              Icon = Wrench;
            } else if (item.needsReviewCount > 0) {
              description = `${item.needsReviewCount} comments waiting for client review.`;
              status = "Client review";
              href = `/projects/${item.slug}/comments?status=IN_REVIEW`;
              Icon = AlertTriangle;
            } else {
              description = `${item.openCount} open comments need action.`;
              status = "Action required";
              href = `/projects/${item.slug}/comments?status=OPEN`;
              Icon = MessageSquare;
            }

            return (
              <Link
                key={item.id}
                href={href}
                className="block rounded-lg border p-4 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="rounded-full border p-2">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.name}</p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {status}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NeedsAttention;
