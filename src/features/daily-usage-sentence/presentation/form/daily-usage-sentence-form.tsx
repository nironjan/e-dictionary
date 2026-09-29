"use client";

import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";

import { CategoryMultiSelect } from "../../../category/presentation/components/category-multi-select";

import type { DailyUsageSentence } from "../../domain/types/daily-usage-sentence.type";
import { useDailyUsageSentenceForm } from "../hooks/use-daily-usage-sentence-form";

interface DailyUsageSentenceFormProps {
  sentence?: DailyUsageSentence | null;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function DailyUsageSentenceForm({
  sentence,
  onCancel,
  onSuccess,
}: DailyUsageSentenceFormProps) {
  const { form, isEditing, isSaving } = useDailyUsageSentenceForm({
    sentence,
    open: true,
    onSuccess: () => onSuccess?.(),
  });

  return (
    <div className="w-full rounded-md bg-white p-6">
      {/* Page header */}
      <div className="mb-4 border-b border-zinc-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {isEditing
            ? "Edit Daily Usage Sentence"
            : "Create Daily Usage Sentence"}
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          {isEditing
            ? "Update the sentence settings, categories, and publication status."
            : "Create the sentence structure first. Translations can be added later from the sentence list."}
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
        className="space-y-0"
      >
        <div className="space-y-6 py-4">
          {/* Slug + Sort Order */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field name="slug">
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;

                return (
                  <Field data-invalid={hasError}>
                    <FieldLabel htmlFor={field.name}>Slug</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="e.g. good-morning"
                      aria-invalid={hasError}
                      disabled={isSaving}
                    />

                    {hasError && (
                      <FieldError
                        errors={field.state.meta.errors.map((message) => ({
                          message,
                        }))}
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="sortOrder">
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;

                return (
                  <Field data-invalid={hasError}>
                    <FieldLabel htmlFor={field.name}>
                      Display Sort Order
                    </FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        const value = Number.parseInt(event.target.value, 10);

                        field.handleChange(Number.isNaN(value) ? 0 : value);
                      }}
                      aria-invalid={hasError}
                      disabled={isSaving}
                    />

                    {hasError && (
                      <FieldError
                        errors={field.state.meta.errors.map((message) => ({
                          message,
                        }))}
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          {/* Categories */}
          <form.Field name="categoryIds">
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;

              return (
                <Field data-invalid={hasError}>
                  <FieldLabel htmlFor={field.name}>Categories *</FieldLabel>

                  <CategoryMultiSelect
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value);
                      field.handleBlur();
                    }}
                    placeholder="Select categories"
                    searchPlaceholder="Search categories..."
                    disabled={isSaving}
                    className={hasError ? "border-red-500" : undefined}
                  />

                  {hasError && (
                    <FieldError
                      errors={field.state.meta.errors.map((message) => ({
                        message,
                      }))}
                    />
                  )}
                </Field>
              );
            }}
          </form.Field>

          {/* Publication settings */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field name="isActive">
              {(field) => (
                <Field orientation="horizontal">
                  <Switch
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                    disabled={isSaving}
                  />

                  <div>
                    <FieldLabel htmlFor={field.name}>
                      Active in Public Dictionary
                    </FieldLabel>

                    <p className="text-xs text-muted-foreground">
                      Make this sentence available to public users.
                    </p>
                  </div>
                </Field>
              )}
            </form.Field>

            <form.Field name="isVerified">
              {(field) => (
                <Field orientation="horizontal">
                  <Switch
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                    disabled={isSaving}
                  />

                  <div>
                    <FieldLabel htmlFor={field.name}>
                      Sentence Verified
                    </FieldLabel>

                    <p className="text-xs text-muted-foreground">
                      Mark this sentence as reviewed and verified.
                    </p>
                  </div>
                </Field>
              )}
            </form.Field>
          </div>
        </div>

        {/* Footer / actions */}
        <div className="mt-6 flex items-center justify-end gap-2 border-t border-zinc-100 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSaving}
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button type="submit" size="sm" disabled={isSaving}>
            {isSaving
              ? "Saving..."
              : isEditing
                ? "Update Sentence"
                : "Create Sentence"}
          </Button>
        </div>
      </form>
    </div>
  );
}
