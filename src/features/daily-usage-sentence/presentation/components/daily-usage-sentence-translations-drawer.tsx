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
import { Switch } from "@/shared/components/ui/switch";
import { Field, FieldLabel } from "@/shared/components/ui/field";

import { DeleteAlertDialog } from "@/shared/components/common/delete-alert-dialog";

import type {
  DailyUsageSentence,
  DailyUsageSentenceTranslation,
} from "../../domain/types/daily-usage-sentence.type";

import { useDailyUsageSentenceQuery } from "../../application/queries/use-daily-usage-sentence-query";

import { LanguageSelect } from "../../../language/presentation/components/language-select";
import { useAddDailyUsageSentenceTranslationMutation } from "../../application/mutations/use-add-daily-usage-sentence-translation.mutation";
import { useUpdateDailyUsageSentenceTranslationMutation } from "../../application/mutations/use-update-daily-usage-sentence-translation.mutation";
import { useDeleteDailyUsageSentenceTranslationMutation } from "../../application/mutations/use-delete-daily-usage-sentence-translation.mutation";

interface DailyUsageSentenceTranslationsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sentenceId: string | null;
}

interface TranslationFormData {
  languageId: string;
  text: string;
  isVerified: boolean;
  sortOrder: number;
}

const EMPTY_FORM: TranslationFormData = {
  languageId: "",
  text: "",
  isVerified: false,
  sortOrder: 0,
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to save translation";
}

export function DailyUsageSentenceTranslationsDrawer({
  open,
  onOpenChange,
  sentenceId,
}: DailyUsageSentenceTranslationsDrawerProps) {
  const { data: sentence, isLoading } = useDailyUsageSentenceQuery(
    sentenceId ?? "",
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {isLoading && (
        <DialogContent className="sm:max-w-md">
          <div className="py-6 text-center text-sm text-muted-foreground">
            Loading translations…
          </div>
        </DialogContent>
      )}

      {sentence && (
        <DailyUsageSentenceTranslationsContent
          key={sentence.id}
          sentence={sentence}
          onClose={() => onOpenChange(false)}
        />
      )}
    </Dialog>
  );
}

interface ContentProps {
  sentence: DailyUsageSentence;
  onClose: () => void;
}

function DailyUsageSentenceTranslationsContent({
  sentence,
  onClose,
}: ContentProps) {
  const addMutation = useAddDailyUsageSentenceTranslationMutation();

  const updateMutation = useUpdateDailyUsageSentenceTranslationMutation();

  const deleteMutation = useDeleteDailyUsageSentenceTranslationMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<TranslationFormData>(EMPTY_FORM);

  const [error, setError] = useState<string | null>(null);

  const [deleteTranslation, setDeleteTranslation] =
    useState<DailyUsageSentenceTranslation | null>(null);

  const translations = sentence.translations ?? [];

  const isSaving =
    addMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const englishTranslation = translations.find(
    (translation) => translation.languageCode === "en",
  );

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);

    setFormData({
      languageId: "",
      text: "",
      isVerified: false,
      sortOrder: translations.length,
    });

    setError(null);
  };

  const handleStartEdit = (translation: DailyUsageSentenceTranslation) => {
    setEditingId(translation.id);
    setIsAdding(false);

    setFormData({
      languageId: translation.languageId,
      text: translation.text,
      isVerified: translation.isVerified,
      sortOrder: translation.sortOrder,
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
    const text = formData.text.trim();

    if (!text) {
      setError("Translation text is required");
      return;
    }

    if (!formData.languageId) {
      setError("Target language is required");
      return;
    }

    const duplicateLanguage = translations.some(
      (translation) =>
        translation.languageId === formData.languageId &&
        translation.id !== editingId,
    );

    if (duplicateLanguage) {
      setError("A translation for this language already exists");
      return;
    }

    setError(null);

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          sentenceId: sentence.id,
          translationId: editingId,
          data: {
            languageId: formData.languageId,
            text,
            isVerified: formData.isVerified,
            sortOrder: formData.sortOrder,
          },
        });
      } else {
        await addMutation.mutateAsync({
          sentenceId: sentence.id,
          data: {
            languageId: formData.languageId,
            text,
            isVerified: formData.isVerified,
            sortOrder: formData.sortOrder,
          },
        });
      }

      handleCancelForm();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTranslation) {
      return;
    }

    setError(null);

    try {
      await deleteMutation.mutateAsync({
        sentenceId: sentence.id,
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
            <span>Sentence Translations</span>

            <Badge variant="outline" className="text-xs font-mono">
              {translations.length} locale
              {translations.length === 1 ? "" : "s"}
            </Badge>
          </DialogTitle>

          <DialogDescription>
            Manage translations for this daily usage sentence.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-2 pr-1">
          {englishTranslation && (
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                English
              </div>

              <p className="text-sm font-medium">{englishTranslation.text}</p>
            </div>
          )}

          {error && !isAdding && editingId === null && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            {translations.length === 0 ? (
              <div className="rounded-lg border border-dashed px-4 py-6 text-center text-xs text-muted-foreground">
                No translations yet for this sentence. Click below to add one.
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
                        {translation.text}
                      </span>

                      <Badge
                        variant="secondary"
                        className="text-[10px] font-mono uppercase"
                      >
                        {translation.languageCode}
                      </Badge>

                      {translation.isVerified && (
                        <Badge variant="outline" className="text-[10px]">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="ml-3 flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-foreground"
                      onClick={() => handleStartEdit(translation)}
                      disabled={isSaving}
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
                      disabled={isSaving}
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
                  {editingId ? "Edit Translation" : "Add Sentence Translation"}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelForm}
                  className="h-6 text-xs"
                  disabled={isSaving}
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
                  <FieldLabel>Target Language</FieldLabel>

                  <LanguageSelect
                    value={formData.languageId}
                    onChange={(value) =>
                      setFormData((current) => ({
                        ...current,
                        languageId: value ?? "",
                      }))
                    }
                    placeholder="Select language"
                    disabled={isSaving}
                  />
                </Field>

                <Field>
                  <FieldLabel>Translation</FieldLabel>

                  <Input
                    value={formData.text}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        text: event.target.value,
                      }))
                    }
                    placeholder="Enter translated sentence"
                    disabled={isSaving}
                  />
                </Field>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="text-sm font-medium">Verified</div>

                  <div className="text-xs text-muted-foreground">
                    Mark this translation as verified.
                  </div>
                </div>

                <Switch
                  checked={formData.isVerified}
                  onCheckedChange={(checked) =>
                    setFormData((current) => ({
                      ...current,
                      isVerified: checked,
                    }))
                  }
                  disabled={isSaving}
                />
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
                  onClick={() => void handleSave()}
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
              disabled={isSaving}
            >
              <Plus className="size-3.5" />

              <span>Add Translation in Another Language</span>
            </Button>
          )}
        </div>

        <div className="flex justify-end border-t pt-3">
          <Button type="button" size="sm" onClick={onClose} disabled={isSaving}>
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
        itemName={deleteTranslation?.text}
        title="Delete translation?"
        description="This translation will be permanently deleted."
        isDeleting={deleteMutation.isPending}
        onConfirm={() => void handleConfirmDelete()}
      />
    </>
  );
}
