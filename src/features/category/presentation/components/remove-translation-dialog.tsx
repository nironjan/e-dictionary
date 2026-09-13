"use client";

import { useState } from "react";
import { X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

import { useDeleteCategoryTranslationMutation } from "../../application/mutation/category.mutation";
import { useToast } from "@/shared/hooks/use-toast";

type RemoveTranslationDialogProps = {
  categoryId: string | undefined;
  translationId: string | undefined;
  languageLabel: string;
  onRemoved: () => void;
};

export function RemoveTranslationDialog({
  categoryId,
  translationId,
  languageLabel,
  onRemoved,
}: RemoveTranslationDialogProps) {
  const [open, setOpen] = useState(false);
  const toast = useToast();

  const deleteMutation = useDeleteCategoryTranslationMutation(categoryId ?? "");
  const isPersisted = Boolean(categoryId && translationId);

  const handleConfirm = async () => {
    if (!isPersisted) {
      onRemoved();
      setOpen(false);
      return;
    }

    try {
      await deleteMutation.mutateAsync(translationId!);
      toast.success("Translation removed.");
      onRemoved();
      setOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to remove translation.",
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
        <X className="size-4" />
        Remove
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove {languageLabel} translation?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isPersisted
              ? "This will delete the translation from the category. This action cannot be undone."
              : "This translation hasn't been saved yet. Removing it will discard your input for this language."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteMutation.isError && (
          <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {deleteMutation.error instanceof Error
              ? deleteMutation.error.message
              : "Failed to remove the translation. Please try again."}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={(event) => {
              event.preventDefault();
              void handleConfirm();
            }}
          >
            {deleteMutation.isPending ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
