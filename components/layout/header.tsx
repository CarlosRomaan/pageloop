import { Bell, HelpCircle, } from "lucide-react";
import UserMenu from "@/components/layout/user-menu";
import GlobalSearch from "@/components/layout/global-search";
import NotificationsMenu from "@/components/layout/notifications-menu";

type DashboardHeaderProps = {
  user: {
    name?: string | null;
    email?: string | null;
  } | null;
};

const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between bg-background/95 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm font-medium">
            Acme Agency
          </p>

          <p className="text-xs text-muted-foreground">
            Workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block">
          <GlobalSearch />
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        <NotificationsMenu />

        <UserMenu user={user} />

      </div>
    </header>
  );
};

export default DashboardHeader;