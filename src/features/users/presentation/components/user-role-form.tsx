"use client";

import { useEffect } from "react";

import type { SafeUser, Role } from "../../domain/types/user.types";
import { useUpdateUserRoleMutation } from "../../application/mutations/users.mutation";

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

interface UsersRoleFormProps {
  user: SafeUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleLabels: Record<Role, string> = {
  user: "User",
  editor: "Editor",
  admin: "Admin",
};

export function UsersRoleForm({
  user,
  open,
  onOpenChange,
}: UsersRoleFormProps) {
  const mutation = useUpdateUserRoleMutation();

  const handleRoleChange = (value: string | null) => {
    if (value !== "user" && value !== "editor" && value !== "admin") {
      return;
    }

    mutation.mutate(
      {
        id: user.id,
        role: value,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  useEffect(() => {
    if (!open && mutation.isPending) {
      mutation.reset();
    }
  }, [open, mutation]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change user role</DialogTitle>

          <DialogDescription>
            Update the role assigned to{" "}
            <span className="font-medium">{user.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>

          <Select
            value={user.role}
            onValueChange={handleRoleChange}
            disabled={mutation.isPending}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="user">{roleLabels.user}</SelectItem>

              <SelectItem value="editor">{roleLabels.editor}</SelectItem>

              <SelectItem value="admin">{roleLabels.admin}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={() => handleRoleChange(user.role)}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
