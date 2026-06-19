"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ProjectNavigationProps = {
  projectSlug: string;
};

const navigation = [
  {
    label: "Overview",
    href: "",
  },
  {
    label: "Comments",
    href: "/comments",
  },
  {
    label: "Pages",
    href: "/pages",
  },
  {
    label: "Team",
    href: "/team",
  },
  {
    label: "Installation",
    href: "/installation",
  },
  {
    label: "Settings",
    href: "/settings",
  },
];

const ProjectNavigation = ({
  projectSlug,
}: ProjectNavigationProps) => {
  const pathname = usePathname();

  return (
    <div className="border-b">
      <nav className="flex gap-6 overflow-x-auto">
        {navigation.map((item) => {
          const href = `/projects/${projectSlug}${item.href}`;

          const isActive =
            item.href === ""
              ? pathname === `/projects/${projectSlug}`
              : pathname.startsWith(href);

          return (
            <Link
              key={item.label}
              href={href}
              className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default ProjectNavigation;