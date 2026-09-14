"use client";

import { Edit2, ShieldCheck, Trash2 } from "lucide-react";

import type { SafeUser } from "../../domain/types/user.types";

import { Button } from "@/shared/components/ui/button";

interface UsersActionsProps {
  user: SafeUser;
  currentUserId: string;
  onEditRole: (user: SafeUser) => void;
  onEditStatus: (user: SafeUser) => void;
  onDelete: (user: SafeUser) => void;
}

export function UsersActions({
  user,
  currentUserId,
  onEditRole,
  onEditStatus,
  onDelete,
}: UsersActionsProps) {
  const isCurrentUser = user.id === currentUserId;

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-zinc-600 hover:text-zinc-900"
        onClick={() => onEditRole(user)}
        disabled={isCurrentUser}
        title={
          isCurrentUser ? "You cannot change your own role" : "Change user role"
        }
        aria-label={
          isCurrentUser
            ? "You cannot change your own role"
            : `Change role for ${user.name}`
        }
      >
        <ShieldCheck className="h-3.5 w-3.5" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-zinc-600 hover:text-zinc-900"
        onClick={() => onEditStatus(user)}
        disabled={isCurrentUser}
        title={
          isCurrentUser
            ? "You cannot change your own status"
            : "Change user status"
        }
        aria-label={
          isCurrentUser
            ? "You cannot change your own status"
            : `Change status for ${user.name}`
        }
      >
        <Edit2 className="h-3.5 w-3.5" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-destructive/80 hover:text-destructive"
        onClick={() => onDelete(user)}
        disabled={isCurrentUser}
        title={
          isCurrentUser ? "You cannot delete your own account" : "Delete user"
        }
        aria-label={
          isCurrentUser
            ? "You cannot delete your own account"
            : `Delete ${user.name}`
        }
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
