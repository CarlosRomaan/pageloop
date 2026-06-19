import { MetricCardProps } from "@/types/dashboard";

const MetricCard = ({
  title,
  value,
  description,
  icon: Icon,
}: MetricCardProps) => {
  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {value}
          </p>

          {description ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;