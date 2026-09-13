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
import type { Language } from "../../domain/types/language.type";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useDeleteLanguageMutation } from "../../application/mutation/language.mutation";

type LanguageActionsProps = {
  language: Language;
};

type LanguageDeleteDialogProps = {
  language: Language;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LanguageActions({ language }: LanguageActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
          aria-label={`Open actions for ${language.name}`}
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              window.location.href = `/dashboard/languages/${language.id}/edit`;
            }}
          >
            Edit language
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete language
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LanguageDeleteDialog
        language={language}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}

function LanguageDeleteDialog({
  language,
  open,
  onOpenChange,
}: LanguageDeleteDialogProps) {
  const deleteMutation = useDeleteLanguageMutation();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(language.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {language.name}?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. The language{" "}
            <span className="font-medium text-foreground">{language.name}</span>{" "}
            will be permanently removed from the dictionary.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteMutation.isError && (
          <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            Failed to delete the language. Please try again.
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
              void handleDelete();
            }}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete language"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
