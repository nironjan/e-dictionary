import {
  BookOpen,
  FolderTree,
  Languages,
  LayoutDashboard,
  Plus,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AdminMenuChild = {
  label: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
};

export type AdminMenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  children?: readonly AdminMenuChild[];
};

export const ADMIN_MENU_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview and statistics",
  },
  {
    label: "Dictionary",
    href: "/dashboard/dictionary",
    icon: BookOpen,
    children: [
      {
        label: "All Words",
        href: "/dashboard/dictionary/words",
        icon: BookOpen,
        description: "View and manage all dictionary words",
      },
      {
        label: "Create Word",
        href: "/dashboard/dictionary/words/create",
        icon: Plus,
        description: "Add a new dictionary word",
      },
    ],
  },
  {
    label: "Languages",
    href: "/dashboard/languages",
    icon: Languages,
    children: [
      {
        label: "All Languages",
        href: "/dashboard/languages",
        icon: Languages,
        description: "View and manage all languages",
      },
      {
        label: "Create Language",
        href: "/dashboard/languages/create",
        icon: Plus,
        description: "Add a new Language",
      },
    ],
  },
  {
    label: "Categories",
    href: "/dashboard/categories",
    icon: FolderTree,
    children: [
      {
        label: "All Languages",
        href: "/dashboard/categories",
        icon: FolderTree,
        description: "View and manage all categories",
      },
      {
        label: "Create Category",
        href: "/dashboard/categories/create",
        icon: Plus,
        description: "Add a new Category",
      },
    ],
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
    description: "Manage application users",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Application settings",
  },
] satisfies readonly AdminMenuItem[];
