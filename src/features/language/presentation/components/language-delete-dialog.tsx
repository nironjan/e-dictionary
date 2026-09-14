"use client";

import { AlertTriangle } from "lucide-react";

import type { Language } from "../../domain/types/language.type";

import { Button } from "@/shared/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useDeleteLanguageMutation } from "../../application/mutation/language.mutation";

interface LanguageDeleteDialogProps {
  language: Language;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LanguageDeleteDialog({
  language,
  open,
  onOpenChange,
}: LanguageDeleteDialogProps) {
  const mutation = useDeleteLanguageMutation();

  const handleDelete = () => {
    mutation.mutate(language.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      mutation.reset();
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="text-destructive size-5" />
          </div>

          <DialogTitle>Delete language</DialogTitle>

          <DialogDescription>
            This action cannot be undone. The language and its associated data
            may be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border bg-muted/50 p-3">
          <p className="font-medium">{language.name}</p>

          <p className="text-muted-foreground text-sm">
            {language.nativeName || language.code}
          </p>
        </div>

        {mutation.error && (
          <p className="text-destructive text-sm">
            Failed to delete language. Please try again.
          </p>
        )}

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
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Deleting..." : "Delete language"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
