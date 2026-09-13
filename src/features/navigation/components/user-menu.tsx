"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ChevronDown, LogOut } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import { USER_MENU_ITEMS } from "../config/user-menu.config";
import { useAuth } from "@/features/auth/presentation/hooks/use-auth";
import { useLogout } from "@/features/auth/application/mutation/auth.mutation";

function getInitials(name: string | null | undefined): string {
  if (!name) {
    return "U";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function UserMenu() {
  const router = useRouter();
  const { user } = useAuth();
  const logoutMutation = useLogout();

  if (!user) {
    return null;
  }

  const initials = getInitials(user.name);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.replace("/login");
      router.refresh();
    } catch {
      // Your API layer can handle/log the actual error.
      // We still avoid leaving the user stuck in the menu.
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-9 items-center gap-2 rounded-md px-2 text-sm font-medium transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        disabled={logoutMutation.isPending}
      >
        <Avatar className="size-7 shrink-0">
          {user.avatarUrl && (
            <AvatarImage
              src={user.avatarUrl}
              alt={user.name ?? "User avatar"}
            />
          )}

          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <span className="hidden min-w-0 max-w-32 truncate sm:inline">
          {user.name}
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {/* User information */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <span className="font-medium">{user.name}</span>

              <span className="text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Account navigation */}
        <DropdownMenuGroup>
          {USER_MENU_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <DropdownMenuItem key={item.href}>
                <Link
                  href={item.href}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            disabled={logoutMutation.isPending}
            onClick={handleLogout}
            className="cursor-pointer"
          >
            <LogOut className="size-4" />

            <span>
              {logoutMutation.isPending ? "Signing out..." : "Sign out"}
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
