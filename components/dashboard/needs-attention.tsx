import Link from "next/link";
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
            <p className="text-sm font-medium">Nothing needs attention</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You&apos;re all caught up.
            </p>
          </div>
        ) : (
          items.map((item) => {
            let description = "";
            let status = "";
            let href = `/projects/${item.slug}`;

            if (item.hasWidgetIssue) {
              description = "Widget has not been detected yet";
              status = "Setup issue";
              href = `/projects/${item.slug}/installation`;
            } else if (item.needsReviewCount > 0) {
              description = `${item.needsReviewCount} comments waiting for client review`;
              status = "Needs review";
              href = `/projects/${item.slug}/comments`;
            } else {
              description = `${item.openCount} open comments need action`;
              status = "Open comments";
              href = `/projects/${item.slug}/comments`;
            }

            return (
              <Link
                key={item.id}
                href={href}
                className="block rounded-lg border p-4 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{item.name}</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>

                  <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
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