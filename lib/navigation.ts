import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Files,
  Puzzle,
  Users,
  Globe,
  Plug,
  CreditCard,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Comments",
    href: "/comments",
    icon: MessageSquare,
  },
  {
    name: "Pages",
    href: "/pages",
    icon: Files,
  },
  {
    name: "Widget",
    href: "/widget",
    icon: Puzzle,
  },
  {
    name: "Team",
    href: "/team",
    icon: Users,
  },
  {
    name: "Domains",
    href: "/domains",
    icon: Globe,
  },
  {
    name: "Integrations",
    href: "/integrations",
    icon: Plug,
  },
  {
    name: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];