"use client";

import { Bell, HelpCircle, Search } from "lucide-react";
import LogoutButton from "../auth/logout-button";

const DashboardHeader = () => {
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
        <div className="hidden h-10 w-72 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground md:flex">
          <Search className="h-4 w-4" />
          <span>Search anything...</span>

          <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 text-[10px]">
            ⌘ K
          </kbd>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-4 w-4" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
          SJ
        </div>

        <LogoutButton />
      </div>
    </header>
  );
};

export default DashboardHeader;