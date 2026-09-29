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
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Field, FieldLabel } from "@/shared/components/ui/field";

import { DeleteAlertDialog } from "@/shared/components/common/delete-alert-dialog";

import type {
  SpecialExpression,
  SpecialExpressionTranslation,
} from "../../domain/types/special-expression.type";

import { useSpecialExpressionQuery } from "../../application/queries/use-special-expression-query";

import { useCreateSpecialExpressionTranslationMutation } from "../../application/mutations/use-create-special-expression-translation-mutation";
import { useUpdateSpecialExpressionTranslationMutation } from "../../application/mutations/use-update-special-expression-translation-mutation";
import { useDeleteSpecialExpressionTranslationMutation } from "../../application/mutations/use-delete-special-expression-translation-mutation";

import { LanguageSelect } from "../../../language/presentation/components/language-select";

interface SpecialExpressionTranslationsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expressionId: string | null;
}

interface TranslationFormData {
  languageId: string;
  meaning: string;
  replacement: string;
  literalMeaning: string;
  example: string;
  isVerified: boolean;
  sortOrder: number;
}

const EMPTY_FORM: TranslationFormData = {
  languageId: "",
  meaning: "",
  replacement: "",
  literalMeaning: "",
  example: "",
  isVerified: false,
  sortOrder: 0,
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to save translation";
}

export function SpecialExpressionTranslationsDrawer({
  open,
  onOpenChange,
  expressionId,
}: SpecialExpressionTranslationsDrawerProps) {
  const { data: expression, isLoading } = useSpecialExpressionQuery(
    expressionId ?? "",
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {isLoading && (
        <DialogContent className="sm:max-w-2xl">
          <div className="py-6 text-center text-sm text-muted-foreground">
            Loading translations…
          </div>
        </DialogContent>
      )}

      {expression && (
        <SpecialExpressionTranslationsContent
          key={expression.id}
          expression={expression}
          onClose={() => onOpenChange(false)}
        />
      )}
    </Dialog>
  );
}

interface ContentProps {
  expression: SpecialExpression;
  onClose: () => void;
}

function SpecialExpressionTranslationsContent({
  expression,
  onClose,
}: ContentProps) {
  const createMutation = useCreateSpecialExpressionTranslationMutation();

  const updateMutation = useUpdateSpecialExpressionTranslationMutation();

  const deleteMutation = useDeleteSpecialExpressionTranslationMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<TranslationFormData>(EMPTY_FORM);

  const [error, setError] = useState<string | null>(null);

  const [deleteTranslation, setDeleteTranslation] =
    useState<SpecialExpressionTranslation | null>(null);

  const translations = expression.translations ?? [];

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);

    setFormData({
      languageId: "",
      meaning: "",
      replacement: "",
      literalMeaning: "",
      example: "",
      isVerified: false,
      sortOrder: translations.length,
    });

    setError(null);
  };

  const handleStartEdit = (translation: SpecialExpressionTranslation) => {
    setEditingId(translation.id);
    setIsAdding(false);

    setFormData({
      languageId: translation.languageId,
      meaning: translation.meaning,
      replacement: translation.replacement ?? "",
      literalMeaning: translation.literalMeaning ?? "",
      example: translation.example ?? "",
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
    const meaning = formData.meaning.trim();

    if (!meaning) {
      setError("Translation meaning is required");
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
          expressionId: expression.id,
          translationId: editingId,
          data: {
            meaning,
            replacement: formData.replacement.trim() || undefined,
            literalMeaning: formData.literalMeaning.trim() || undefined,
            languageId: formData.languageId,
            example: formData.example.trim() || undefined,
            isVerified: formData.isVerified,
            sortOrder: formData.sortOrder,
          },
        });
      } else {
        await createMutation.mutateAsync({
          expressionId: expression.id,
          data: {
            languageId: formData.languageId,
            meaning,
            replacement: formData.replacement.trim() || undefined,
            literalMeaning: formData.literalMeaning.trim() || undefined,
            example: formData.example.trim() || undefined,
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
        expressionId: expression.id,
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
      <DialogContent className="flex max-h-[85vh] w-[95vw] max-w-3xl flex-col overflow-hidden sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Expression Translations</span>

            <Badge variant="outline" className="text-xs font-mono">
              {translations.length} locale
              {translations.length === 1 ? "" : "s"}
            </Badge>
          </DialogTitle>

          <DialogDescription>
            Manage translations for this special expression.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-2 pr-1">
          {/* Source expression */}
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {expression.type === "idiom" ? "Idiom" : "One Word Substitution"}
            </div>

            <p className="text-sm font-semibold">{expression.expression}</p>

            {expression.replacement && (
              <p className="mt-1 text-xs text-muted-foreground">
                Replacement:{" "}
                <span className="font-medium text-foreground">
                  {expression.replacement}
                </span>
              </p>
            )}
          </div>

          {/* General error */}
          {error && !isAdding && editingId === null && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Translation list */}
          <div className="space-y-2">
            {translations.length === 0 ? (
              <div className="rounded-lg border border-dashed px-4 py-6 text-center text-xs text-muted-foreground">
                No translations yet for this expression. Click below to add one.
              </div>
            ) : (
              translations.map((translation) => (
                <div
                  key={translation.id}
                  className="flex items-start justify-between rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">
                        {translation.meaning}
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

                    {translation.replacement && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Replacement:{" "}
                        <span className="text-foreground">
                          {translation.replacement}
                        </span>
                      </p>
                    )}

                    {translation.example && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {translation.example}
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

          {/* Add/Edit form */}
          {isAdding || editingId !== null ? (
            <div className="space-y-4 rounded-lg border bg-background p-4 shadow-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold">
                  {editingId
                    ? "Edit Translation"
                    : "Add Expression Translation"}
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

              {/* Language */}
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
                  placeholder="Select target language"
                  excludeIds={[expression.languageId]}
                  disabled={isSaving || editingId !== null}
                />

                {editingId !== null && (
                  <p className="text-xs text-muted-foreground">
                    The translation language cannot be changed.
                  </p>
                )}
              </Field>

              {/* Meaning */}
              <Field>
                <FieldLabel>Meaning</FieldLabel>

                <Textarea
                  value={formData.meaning}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      meaning: event.target.value,
                    }))
                  }
                  placeholder="Enter translated meaning"
                  rows={3}
                  disabled={isSaving}
                />
              </Field>

              {/* Replacement */}
              <Field>
                <FieldLabel>Replacement</FieldLabel>

                <Input
                  value={formData.replacement}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      replacement: event.target.value,
                    }))
                  }
                  placeholder="Optional translated replacement"
                  disabled={isSaving}
                />
              </Field>

              {/* Literal Meaning */}
              <Field>
                <FieldLabel>Literal Meaning</FieldLabel>

                <Textarea
                  value={formData.literalMeaning}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      literalMeaning: event.target.value,
                    }))
                  }
                  placeholder="Optional literal meaning"
                  rows={2}
                  disabled={isSaving}
                />
              </Field>

              {/* Example */}
              <Field>
                <FieldLabel>Example</FieldLabel>

                <Textarea
                  value={formData.example}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      example: event.target.value,
                    }))
                  }
                  placeholder="Optional example"
                  rows={3}
                  disabled={isSaving}
                />
              </Field>

              {/* Sort order */}
              <Field>
                <FieldLabel>Display Sort Order</FieldLabel>

                <Input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(event) => {
                    const value = Number.parseInt(event.target.value, 10);

                    setFormData((current) => ({
                      ...current,
                      sortOrder: Number.isNaN(value) ? 0 : value,
                    }));
                  }}
                  disabled={isSaving}
                />
              </Field>

              {/* Verification */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="text-sm font-medium">Verified</div>

                  <div className="text-xs text-muted-foreground">
                    Mark this translation as reviewed and verified.
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

              {/* Actions */}
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

        {/* Footer */}
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
        itemName={deleteTranslation?.meaning}
        title="Delete translation?"
        description="This translation will be permanently deleted."
        isDeleting={deleteMutation.isPending}
        onConfirm={() => void handleConfirmDelete()}
      />
    </>
  );
}
