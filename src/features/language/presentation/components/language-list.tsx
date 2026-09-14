"use client";

import { useMemo, useState } from "react";

import type { Language } from "../../domain/types/language.type";

import { useLanguages } from "../../application/queries/language.query";

import { LanguageForm } from "./language-form";
import { LanguageDeleteDialog } from "./language-delete-dialog";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import { LanguageDataTable } from "./language-data-table";
import { useLanguagesColumns } from "./language-columns";

export function LanguagesList() {
  const languagesQuery = useLanguages();

  const [search, setSearch] = useState("");

  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null,
  );

  const [formOpen, setFormOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const languages = languagesQuery.data ?? [];

  const filteredLanguages = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return languages;
    }

    return languages.filter((language) => {
      return (
        language.name.toLowerCase().includes(normalizedSearch) ||
        language.code.toLowerCase().includes(normalizedSearch) ||
        language.nativeName?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [languages, search]);

  const handleCreate = () => {
    setSelectedLanguage(null);
    setFormOpen(true);
  };

  const handleEdit = (language: Language) => {
    setSelectedLanguage(language);
    setFormOpen(true);
  };

  const handleDelete = (language: Language) => {
    setSelectedLanguage(language);
    setDeleteDialogOpen(true);
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);

    if (!open) {
      setSelectedLanguage(null);
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open);

    if (!open) {
      setSelectedLanguage(null);
    }
  };

  const columns = useLanguagesColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 rounded-md bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Languages</h1>

          <p className="text-muted-foreground">
            Manage dictionary languages and their settings.
          </p>
        </div>

        <Button type="button" onClick={handleCreate}>
          Add language
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search languages..."
          className="sm:max-w-sm"
        />

        {search.trim() && (
          <Button type="button" variant="outline" onClick={() => setSearch("")}>
            Clear
          </Button>
        )}
      </div>

      {languagesQuery.isError ? (
        <div className="rounded-md border p-6 text-center">
          <p className="text-destructive font-medium">
            Failed to load languages.
          </p>

          <p className="text-muted-foreground mt-1 text-sm">
            Please try again.
          </p>
        </div>
      ) : languagesQuery.isLoading ? (
        <div className="rounded-md border p-6 text-center">
          <p className="text-muted-foreground text-sm">Loading languages...</p>
        </div>
      ) : filteredLanguages.length === 0 ? (
        <div className="rounded-md border p-6 text-center">
          <p className="font-medium">No languages found.</p>

          <p className="text-muted-foreground mt-1 text-sm">
            {search.trim()
              ? "Try a different search."
              : "Add your first language to get started."}
          </p>
        </div>
      ) : (
        <div className="relative">
          <LanguageDataTable columns={columns} data={filteredLanguages} />

          {languagesQuery.isFetching && (
            <div className="text-muted-foreground mt-2 text-right text-xs">
              Updating...
            </div>
          )}
        </div>
      )}

      {selectedLanguage && (
        <LanguageDeleteDialog
          key={`delete-${selectedLanguage.id}`}
          language={selectedLanguage}
          open={deleteDialogOpen}
          onOpenChange={handleDeleteDialogChange}
        />
      )}

      <LanguageForm
        key={selectedLanguage?.id ?? "create"}
        language={selectedLanguage}
        open={formOpen}
        onOpenChange={handleFormOpenChange}
      />
    </div>
  );
}
