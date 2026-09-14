"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  ListUsersParams,
  Role,
  SafeUser,
  UserStatus,
} from "../../domain/types/user.types";

import { useUsersQuery } from "../../application/queries/users.query";
import { useCurrentUserQuery } from "@/features/auth/application/queries/auth.query";

import { UserDataTable } from "./user-data-table";
import { UsersRoleForm } from "./user-role-form";
import { UsersStatusForm } from "./user-status-form";
import { UsersDeleteDialog } from "./user-delete-dialog";
import { useUsersColumns } from "./users-columns";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const SEARCH_DEBOUNCE_MS = 400;

function isRole(value: string): value is Role {
  return value === "user" || value === "editor" || value === "admin";
}

function isUserStatus(value: string): value is UserStatus {
  return value === "active" || value === "inactive" || value === "suspended";
}

export function UsersList() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [role, setRole] = useState<Role | undefined>();
  const [status, setStatus] = useState<UserStatus | undefined>();

  /*
   * Dialog state
   */
  const [selectedUser, setSelectedUser] = useState<SafeUser | null>(null);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  /*
   * Current authenticated user
   */
  const currentUserQuery = useCurrentUserQuery();

  const currentUserId = currentUserQuery.data?.id ?? "";

  /*
   * Debounced search
   */
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  /*
   * Filters
   */
  const handleRoleChange = (value: string | null) => {
    if (value === null || value === "all") {
      setRole(undefined);
    } else if (isRole(value)) {
      setRole(value);
    }

    setPage(1);
  };

  const handleStatusChange = (value: string | null) => {
    if (value === null || value === "all") {
      setStatus(undefined);
    } else if (isUserStatus(value)) {
      setStatus(value);
    }

    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearch("");
    setRole(undefined);
    setStatus(undefined);
    setPage(1);
  };

  /*
   * Query parameters
   */
  const params = useMemo<ListUsersParams>(
    () => ({
      page,
      limit,
      ...(search ? { search } : {}),
      ...(role ? { role } : {}),
      ...(status ? { status } : {}),
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    [page, limit, search, role, status],
  );

  const usersQuery = useUsersQuery(params);

  const users = usersQuery.data?.data ?? [];
  const pagination = usersQuery.data?.pagination;

  /*
   * Role dialog
   */
  const handleEditRole = (user: SafeUser) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  const handleRoleDialogChange = (open: boolean) => {
    setRoleDialogOpen(open);

    if (!open) {
      setSelectedUser(null);
    }
  };

  /*
   * Status dialog
   */
  const handleEditStatus = (user: SafeUser) => {
    setSelectedUser(user);
    setStatusDialogOpen(true);
  };

  const handleStatusDialogChange = (open: boolean) => {
    setStatusDialogOpen(open);

    if (!open) {
      setSelectedUser(null);
    }
  };

  /*
   * Delete dialog
   */
  const handleDeleteUser = (user: SafeUser) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open);

    if (!open) {
      setSelectedUser(null);
    }
  };

  /*
   * Table columns
   */
  const columns = useUsersColumns({
    currentUserId,
    onEditRole: handleEditRole,
    onEditStatus: handleEditStatus,
    onDelete: handleDeleteUser,
  });

  const hasFilters =
    searchInput.trim().length > 0 || role !== undefined || status !== undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>

        <p className="text-muted-foreground">
          Manage users, roles, and account status.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by name or email..."
          className="md:max-w-sm"
        />

        <Select value={role ?? "all"} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>

            <SelectItem value="user">Users</SelectItem>

            <SelectItem value="editor">Editors</SelectItem>

            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status ?? "all"} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>

            <SelectItem value="active">Active</SelectItem>

            <SelectItem value="inactive">Inactive</SelectItem>

            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button type="button" variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        )}
      </div>

      {usersQuery.isError ? (
        <div className="rounded-md border p-6 text-center">
          <p className="text-destructive font-medium">Failed to load users.</p>

          <p className="text-muted-foreground mt-1 text-sm">
            Please try again.
          </p>
        </div>
      ) : (
        <div className="relative">
          <UserDataTable
            columns={columns}
            data={users}
            page={pagination?.page ?? page}
            limit={pagination?.limit ?? limit}
            total={pagination?.total ?? 0}
            totalPages={pagination?.totalPages ?? 0}
            onPageChange={setPage}
          />

          {usersQuery.isFetching && (
            <div className="text-muted-foreground mt-2 text-right text-xs">
              Updating...
            </div>
          )}
        </div>
      )}

      {selectedUser && (
        <>
          <UsersRoleForm
            key={`role-${selectedUser.id}`}
            user={selectedUser}
            open={roleDialogOpen}
            onOpenChange={handleRoleDialogChange}
          />

          <UsersStatusForm
            key={`status-${selectedUser.id}`}
            user={selectedUser}
            open={statusDialogOpen}
            onOpenChange={handleStatusDialogChange}
          />

          <UsersDeleteDialog
            key={`delete-${selectedUser.id}`}
            user={selectedUser}
            open={deleteDialogOpen}
            onOpenChange={handleDeleteDialogChange}
          />
        </>
      )}
    </div>
  );
}
