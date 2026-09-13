"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;

  title?: string;
  description?: string;
  itemName?: string;

  confirmLabel?: string;
  cancelLabel?: string;

  isDeleting?: boolean;
}

export function DeleteAlertDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete item?",
  description = "This action cannot be undone.",
  itemName,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isDeleting = false,
}: DeleteAlertDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {itemName ? (
              <>
                Are you sure you want to permanently delete{" "}
                <span className="font-semibold text-foreground">
                  &quot;{itemName}&quot;
                </span>
                ?{" "}
              </>
            ) : null}

            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              void handleConfirm();
            }}
            disabled={isDeleting}
            render={
              <Button type="button" variant="destructive" disabled={isDeleting}>
                {isDeleting ? "Deleting..." : confirmLabel}
              </Button>
            }
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
