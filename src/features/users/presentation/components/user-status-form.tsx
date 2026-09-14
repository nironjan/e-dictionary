"use client";

import { useState } from "react";

import type { SafeUser, UserStatus } from "../../domain/types/user.types";
import { useUpdateUserStatusMutation } from "../../application/mutations/users.mutation";

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

interface UsersStatusFormProps {
  user: SafeUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsersStatusForm({
  user,
  open,
  onOpenChange,
}: UsersStatusFormProps) {
  const [status, setStatus] = useState<UserStatus>(user.status);

  const mutation = useUpdateUserStatusMutation();

  const handleStatusChange = (value: string | null) => {
    if (value === "active" || value === "inactive" || value === "suspended") {
      setStatus(value);
    }
  };

  const handleSubmit = () => {
    mutation.mutate(
      {
        id: user.id,
        status,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const hasChanged = status !== user.status;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change user status</DialogTitle>

          <DialogDescription>
            Change the account status for{" "}
            <span className="font-medium">{user.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>

          <Select
            value={status}
            onValueChange={handleStatusChange}
            disabled={mutation.isPending}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="active">Active</SelectItem>

              <SelectItem value="inactive">Inactive</SelectItem>

              <SelectItem value="suspended">Suspended</SelectItem>
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
            onClick={handleSubmit}
            disabled={!hasChanged || mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
