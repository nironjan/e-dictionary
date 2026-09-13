import { KeyRound, LogOut, Settings, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type UserMenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const USER_MENU_ITEMS = [
  {
    label: "Profile",
    href: "/account/profile",
    icon: User,
    description: "View your profile",
  },
  {
    label: "Account Settings",
    href: "/account/settings",
    icon: Settings,
    description: "Manage your account",
  },
  {
    label: "Security",
    href: "/account/security",
    icon: KeyRound,
    description: "Manage password and security",
  },
] satisfies readonly UserMenuItem[];

export const USER_MENU_LOGOUT = {
  label: "Sign out",
  icon: LogOut,
} as const;
