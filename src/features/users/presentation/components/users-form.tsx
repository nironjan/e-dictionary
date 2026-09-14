"use client";

import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import type { Role, SafeUser, UserStatus } from "../../domain/types/user.types";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import {
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
} from "../../application/mutations/users.mutation";

const userSchema = z.object({
  role: z.enum(["user", "editor", "admin"]),
  status: z.enum(["active", "inactive", "suspended"]),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UsersFormProps {
  user: SafeUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const roles = ["user", "editor", "admin"] as const;
const statuses = ["active", "inactive", "suspended"] as const;

export function UsersForm({ user, open, onOpenChange }: UsersFormProps) {
  const updateRoleMutation = useUpdateUserRoleMutation();
  const updateStatusMutation = useUpdateUserStatusMutation();

  const isPending =
    updateRoleMutation.isPending || updateStatusMutation.isPending;

  const form = useForm({
    defaultValues: {
      role: user?.role ?? "user",
      status: user?.status ?? "active",
    } satisfies UserFormValues,

    validators: {
      onSubmit: userSchema,
    },

    onSubmit: async ({ value }) => {
      if (!user) {
        return;
      }

      const roleChanged = value.role !== user.role;
      const statusChanged = value.status !== user.status;

      if (roleChanged) {
        await updateRoleMutation.mutateAsync({
          id: user.id,
          role: value.role,
        });
      }

      if (statusChanged) {
        await updateStatusMutation.mutateAsync({
          id: user.id,
          status: value.status,
        });
      }

      if (roleChanged || statusChanged) {
        onOpenChange(false);
      }
    },
  });

  useEffect(() => {
    if (!user || !open) {
      return;
    }

    form.reset({
      role: user.role,
      status: user.status,
    });
  }, [user, open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update user</DialogTitle>

          <DialogDescription>
            Change the role or status assigned to{" "}
            <span className="font-medium">{user?.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            void form.handleSubmit();
          }}
          className="space-y-6"
        >
          <form.Field name="role">
            {(field) => (
              <div className="space-y-2">
                <label htmlFor="user-role" className="text-sm font-medium">
                  Role
                </label>

                <Select
                  value={field.state.value}
                  onValueChange={(value) => {
                    if (
                      value === "user" ||
                      value === "editor" ||
                      value === "admin"
                    ) {
                      field.handleChange(value);
                    }
                  }}
                  disabled={isPending}
                >
                  <SelectTrigger id="user-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>

                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {roleLabels[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {field.state.meta.errors
                      .map((error) =>
                        typeof error === "string" ? error : error?.message,
                      )
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="status">
            {(field) => (
              <div className="space-y-2">
                <label htmlFor="user-status" className="text-sm font-medium">
                  Status
                </label>

                <Select
                  value={field.state.value}
                  onValueChange={(value) => {
                    if (
                      value === "active" ||
                      value === "inactive" ||
                      value === "suspended"
                    ) {
                      field.handleChange(value);
                    }
                  }}
                  disabled={isPending}
                >
                  <SelectTrigger id="user-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {statusLabels[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {field.state.meta.errors
                      .map((error) =>
                        typeof error === "string" ? error : error?.message,
                      )
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending || !user}>
              {isPending ? "Updating..." : "Update user"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
