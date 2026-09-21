"use client";

import { useState } from "react";
import { AlertCircle, Edit2, Plus, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Field, FieldLabel } from "@/shared/components/ui/field";

import { DeleteAlertDialog } from "@/shared/components/common/delete-alert-dialog";

import type {
  Category,
  CategoryTranslation,
} from "../../domain/types/category.type";

import { useCategory } from "../../application/queries/category.query";

import {
  useAddCategoryTranslation,
  useDeleteCategoryTranslation,
  useUpdateCategoryTranslation,
} from "../../application/mutation/category.mutation";
import { LanguageSelect } from "../../../language/presentation/components/language-select";

interface CategoryTranslationsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string | null;
}

interface TranslationFormData {
  languageId: string;
  name: string;
  description: string;
}

const EMPTY_FORM: TranslationFormData = {
  languageId: "",
  name: "",
  description: "",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to save translation";
}

export function CategoryTranslationsDrawer({
  open,
  onOpenChange,
  categoryId,
}: CategoryTranslationsDrawerProps) {
  const { data: category, isLoading } = useCategory(categoryId ?? "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {isLoading && (
        <DialogContent className="sm:max-w-md">
          <div className="py-6 text-center text-sm text-muted-foreground">
            Loading translations…
          </div>
        </DialogContent>
      )}

      {category && (
        <CategoryTranslationsContent
          key={category.id}
          category={category}
          onClose={() => onOpenChange(false)}
        />
      )}
    </Dialog>
  );
}

interface ContentProps {
  category: Category;
  onClose: () => void;
}

function CategoryTranslationsContent({ category, onClose }: ContentProps) {
  const addMutation = useAddCategoryTranslation();
  const updateMutation = useUpdateCategoryTranslation();
  const deleteMutation = useDeleteCategoryTranslation();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<TranslationFormData>(EMPTY_FORM);

  const [error, setError] = useState<string | null>(null);

  const [deleteTranslation, setDeleteTranslation] =
    useState<CategoryTranslation | null>(null);

  const translations = category.translations ?? [];

  const isSaving = addMutation.isPending || updateMutation.isPending;

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      languageId: "",
      name: "",
      description: "",
    });
    setError(null);
  };

  const handleStartEdit = (translation: CategoryTranslation) => {
    setEditingId(translation.id);
    setIsAdding(false);

    setFormData({
      languageId: translation.languageId ?? translation.language.id ?? "",
      name: translation.name,
      description: translation.description ?? "",
    });

    setError(null);
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setError(null);
  };

  const handleSave = async () => {
    const name = formData.name.trim();

    if (!name) {
      setError("Translation name is required");
      return;
    }

    if (!formData.languageId) {
      setError("Target language is required");
      return;
    }

    setError(null);

    const dto = {
      languageId: formData.languageId,
      name,
      description: formData.description.trim() || undefined,
    };

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          categoryId: category.id,
          translationId: editingId,
          dto,
        });

        setEditingId(null);
      } else {
        await addMutation.mutateAsync({
          categoryId: category.id,
          dto,
        });

        setIsAdding(false);
      }

      setFormData(EMPTY_FORM);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTranslation) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({
        categoryId: category.id,
        translationId: deleteTranslation.id,
      });

      setDeleteTranslation(null);

      if (editingId === deleteTranslation.id) {
        handleCancelForm();
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <DialogContent className="flex max-h-[85vh] w-[95vw] max-w-2xl flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Translations for &quot;{category.name}&quot;</span>

            <Badge variant="outline" className="text-xs font-mono">
              {translations.length} locale
              {translations.length === 1 ? "" : "s"}
            </Badge>
          </DialogTitle>

          <DialogDescription>
            Manage localized names and descriptions for this category.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-2 pr-1">
          <div className="space-y-2">
            {translations.length === 0 ? (
              <div className="rounded-lg border border-dashed px-4 py-6 text-center text-xs text-muted-foreground">
                No translations yet for this category. Click below to add one.
              </div>
            ) : (
              translations.map((translation) => (
                <div
                  key={translation.id}
                  className="flex items-start justify-between rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold">
                        {translation.name}
                      </span>

                      <Badge
                        variant="secondary"
                        className="text-[10px] font-mono uppercase"
                      >
                        {translation.language?.code ?? "code"} •{" "}
                        {translation.language?.name ?? "Language"}
                      </Badge>

                      <span className="text-[11px] font-mono text-muted-foreground">
                        /{translation.slug}
                      </span>
                    </div>

                    {translation.description && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {translation.description}
                      </p>
                    )}
                  </div>

                  <div className="ml-3 flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-foreground"
                      onClick={() => handleStartEdit(translation)}
                      disabled={deleteMutation.isPending}
                    >
                      <Edit2 className="size-3" />
                      <span className="sr-only">Edit translation</span>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeleteTranslation(translation)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="size-3" />
                      <span className="sr-only">Delete translation</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {isAdding || editingId !== null ? (
            <div className="space-y-4 rounded-lg border bg-background p-4 shadow-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold">
                  {editingId ? "Edit Translation" : "Add Category Translation"}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelForm}
                  className="h-6 text-xs"
                >
                  Cancel
                </Button>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">
                  <AlertCircle className="size-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="translation-language">
                    Target Language
                  </FieldLabel>

                  <LanguageSelect
                    value={formData.languageId}
                    onChange={(value) =>
                      setFormData((current) => ({
                        ...current,
                        languageId: value ?? "",
                      }))
                    }
                    placeholder="Select language"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="translation-name">
                    Localized Category Name
                  </FieldLabel>

                  <Input
                    id="translation-name"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. बिजाब, इलेक्ट्रॉनिक्स"
                  />
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="translation-description">
                    Description
                  </FieldLabel>

                  <Input
                    id="translation-description"
                    value={formData.description}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Brief description in target language"
                  />
                </Field>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelForm}
                  disabled={isSaving}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Saving..."
                    : editingId
                      ? "Save Translation"
                      : "Create Translation"}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleStartAdd}
              className="w-full gap-2 border-dashed text-xs"
            >
              <Plus className="size-3.5" />
              <span>Add Translation in Another Language</span>
            </Button>
          )}
        </div>

        <div className="flex justify-end border-t pt-3">
          <Button type="button" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>

      <DeleteAlertDialog
        open={deleteTranslation !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTranslation(null);
          }
        }}
        itemName={deleteTranslation?.name}
        title="Delete translation?"
        description="This translation will be permanently deleted."
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
