"use client";

import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";

import type {
  CreateLanguageDto,
  Language,
} from "../../domain/types/language.type";
import {
  defaultLanguageFormValues,
  languageFormSchema,
} from "../../domain/schema/language.schema";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  useCreateLanguageMutation,
  useUpdateLanguageMutation,
} from "../../application/mutation/language.mutation";

interface LanguageFormProps {
  language?: Language | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LanguageForm({
  language,
  open,
  onOpenChange,
}: LanguageFormProps) {
  const isEdit = Boolean(language);

  const createMutation = useCreateLanguageMutation();
  const updateMutation = useUpdateLanguageMutation();

  const mutationError = createMutation.error ?? updateMutation.error;

  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm({
    defaultValues: language
      ? {
          code: language.code,
          name: language.name,
          nativeName: language.nativeName ?? "",
          isActive: language.isActive,
          isRtl: language.isRtl,
          sortOrder: language.sortOrder,
        }
      : defaultLanguageFormValues,

    validators: {
      onSubmit: languageFormSchema,
    },

    onSubmit: async ({ value }) => {
      const input: CreateLanguageDto = {
        code: value.code.trim(),
        name: value.name.trim(),
        ...(value.nativeName?.trim()
          ? { nativeName: value.nativeName.trim() }
          : {}),
        isActive: value.isActive,
        isRtl: value.isRtl,
        sortOrder: value.sortOrder,
      };

      if (language) {
        await updateMutation.mutateAsync({
          id: language.id,
          input,
        });
      } else {
        await createMutation.mutateAsync(input);
      }

      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        language
          ? {
              code: language.code,
              name: language.name,
              nativeName: language.nativeName ?? "",
              isActive: language.isActive,
              isRtl: language.isRtl,
              sortOrder: language.sortOrder,
            }
          : defaultLanguageFormValues,
      );
    }
  }, [open, language, form]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      createMutation.reset();
      updateMutation.reset();
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit language" : "Add language"}</DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update the language details."
              : "Add a new language to the dictionary."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="language-form"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-5"
        >
          <form.Field name="code">
            {(field) => {
              return (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium">
                    Code
                  </label>

                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="e.g. en, hi, as, brx"
                    disabled={isEdit || isPending}
                  />

                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          <form.Field name="name">
            {(field) => {
              return (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium">
                    Name
                  </label>

                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="English"
                    disabled={isPending}
                  />

                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          <form.Field name="nativeName">
            {(field) => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Native name
                </label>

                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="e.g. English, हिन्दी, অসমীয়া"
                  disabled={isPending}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="isActive">
              {(field) => (
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="text-sm font-medium">Active</p>

                    <p className="text-muted-foreground text-xs">
                      Language is available for use.
                    </p>
                  </div>

                  <Switch
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                    disabled={isPending}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="isRtl">
              {(field) => (
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="text-sm font-medium">RTL</p>

                    <p className="text-muted-foreground text-xs">
                      Right-to-left language.
                    </p>
                  </div>

                  <Switch
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                    disabled={isPending}
                  />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="sortOrder">
            {(field) => (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Sort order
                </label>

                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={String(field.state.value)}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    const value = event.target.value;

                    field.handleChange(value === "" ? 0 : Number(value));
                  }}
                  disabled={isPending}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {mutationError && (
            <p className="text-destructive text-sm">
              Failed to save language. Please try again.
            </p>
          )}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button type="submit" form="language-form" disabled={isPending}>
            {isPending
              ? "Saving..."
              : isEdit
                ? "Save changes"
                : "Create language"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
