"use client";

import { Languages, Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { LanguageDataTable } from "./language-data-table";
import { useLanguages } from "../../application/queries/language.query";
import { LoadingState } from "../../../../shared/components/common/loading-state";
import { useState } from "react";
import type { Language } from "../../domain/types/language.type";
import { LanguageDialog } from "./language-dialog";

export function LanguageList() {
  const { data: languages, isLoading, isError, error } = useLanguages();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);

  const handleCreate = () => {
    setEditingLanguage(null);
    setDialogOpen(true);
  };

  const handleEdit = (language: Language) => {
    setEditingLanguage(language);
    setDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);

    if (!open) {
      setEditingLanguage(null);
    }
  };

  return (
    <div className="space-y-6">
      <LanguageListHeader onCreate={handleCreate} />

      {isLoading && <LoadingState message="Loading languages..." />}

      {isError && (
        <div className="rounded-md border border-destructive/50 p-8 text-center">
          <p className="font-medium text-destructive">
            Failed to load languages.
          </p>

          {error instanceof Error && (
            <p className="mt-1 text-sm text-muted-foreground">
              {error.message}
            </p>
          )}
        </div>
      )}

      {!isLoading && !isError && (
        <LanguageDataTable data={languages ?? []} onEdit={handleEdit} />
      )}

      <LanguageDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        language={editingLanguage}
      />
    </div>
  );
}

interface LanguageListHeaderProps {
  onCreate: () => void;
}

function LanguageListHeader({ onCreate }: LanguageListHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="rounded-lg border bg-muted p-2">
          <Languages className="size-5" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Languages</h1>

          <p className="text-sm text-muted-foreground">
            Manage dictionary languages.
          </p>
        </div>
      </div>

      <Button onClick={onCreate} className="gap-2">
        <Plus className="size-4" />
        Create Language
      </Button>
    </div>
  );
}
