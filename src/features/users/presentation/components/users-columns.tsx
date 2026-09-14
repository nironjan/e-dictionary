"use client";

import { useMemo } from "react";
import { ArrowUpDown, ShieldCheck } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import type { Role, SafeUser, UserStatus } from "../../domain/types/user.types";

import { Button } from "@/shared/components/ui/button";
import type { usersTableFeatures } from "../users-table-config";
import { UsersActions } from "./users-actions";

interface UsersColumnsOptions {
  currentUserId: string;
  onEditRole: (user: SafeUser) => void;
  onEditStatus: (user: SafeUser) => void;
  onDelete: (user: SafeUser) => void;
}

const roleLabels: Record<Role, string> = {
  user: "User",
  editor: "Editor",
  admin: "Admin",
};

const statusLabels: Record<UserStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
};

export function useUsersColumns({
  currentUserId,
  onEditRole,
  onEditStatus,
  onDelete,
}: UsersColumnsOptions): ColumnDef<typeof usersTableFeatures, SafeUser>[] {
  return useMemo(
    () => [
      {
        accessorKey: "name",

        header: ({ column }) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 cursor-pointer gap-1 px-0 font-semibold text-zinc-600 hover:bg-transparent hover:text-zinc-900"
          >
            Name
            <ArrowUpDown className="h-3 w-3" />
          </Button>
        ),

        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className="min-w-0">
              <div className="font-medium">{user.name}</div>

              <div className="text-muted-foreground text-sm md:hidden">
                {user.email}
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "email",

        header: ({ column }) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 cursor-pointer gap-1 px-0 font-semibold text-zinc-600 hover:bg-transparent hover:text-zinc-900"
          >
            Email
            <ArrowUpDown className="h-3 w-3" />
          </Button>
        ),

        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.email}</span>
        ),
      },

      {
        accessorKey: "role",

        header: "Role",

        cell: ({ row }) => {
          const role = row.original.role;

          return (
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="text-muted-foreground size-4" />

              <span>{roleLabels[role]}</span>
            </div>
          );
        },
      },

      {
        accessorKey: "status",

        header: "Status",

        cell: ({ row }) => {
          const status = row.original.status;

          return <span>{statusLabels[status]}</span>;
        },
      },

      {
        accessorKey: "createdAt",

        header: ({ column }) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 cursor-pointer gap-1 px-0 font-semibold text-zinc-600 hover:bg-transparent hover:text-zinc-900"
          >
            Joined
            <ArrowUpDown className="h-3 w-3" />
          </Button>
        ),

        cell: ({ row }) => {
          const date = new Date(row.original.createdAt);

          return new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
          }).format(date);
        },
      },

      {
        id: "actions",

        header: "Actions",

        enableSorting: false,

        cell: ({ row }) => (
          <UsersActions
            user={row.original}
            currentUserId={currentUserId}
            onEditRole={onEditRole}
            onEditStatus={onEditStatus}
            onDelete={onDelete}
          />
        ),
      },
    ],
    [currentUserId, onEditRole, onEditStatus, onDelete],
  );
}
