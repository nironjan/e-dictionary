"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import type { SafeUser } from "../../domain/types/user.types";
import { useDeleteUserMutation } from "../../application/mutations/users.mutation";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface UsersDeleteDialogProps {
  user: SafeUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsersDeleteDialog({
  user,
  open,
  onOpenChange,
}: UsersDeleteDialogProps) {
  const mutation = useDeleteUserMutation();

  const [confirmation, setConfirmation] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setConfirmation("");
      mutation.reset();
    }

    onOpenChange(nextOpen);
  };

  const handleDelete = () => {
    if (confirmation !== user.email) {
      return;
    }

    mutation.mutate(
      { id: user.id },
      {
        onSuccess: () => {
          handleOpenChange(false);
        },
      },
    );
  };

  const canDelete = confirmation === user.email;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-5 text-destructive" />
          </div>

          <DialogTitle>Delete user</DialogTitle>

          <DialogDescription>
            This action cannot be undone. The user account and its associated
            data will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-md border bg-muted/50 p-3 text-sm">
            <div className="font-medium">{user.name}</div>

            <div className="text-muted-foreground">{user.email}</div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="delete-user-confirmation"
              className="text-sm font-medium"
            >
              Type the user&apos;s email to confirm
            </label>

            <input
              id="delete-user-confirmation"
              type="text"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder={user.email}
              disabled={mutation.isPending}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={!canDelete || mutation.isPending}
          >
            {mutation.isPending ? "Deleting..." : "Delete user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
