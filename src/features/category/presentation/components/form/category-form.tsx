/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";

import { useCategories } from "../../../application/queries/category.query";

import type { Category } from "../../../domain/types/category.type";

import { useCategoryForm } from "../../hooks/use-category-form";
import { LanguageSelect } from "../../../../language/presentation/components/language-select";

interface CategoryFormProps {
  category?: Category | null;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function CategoryForm({
  category,
  onCancel,
  onSuccess,
}: CategoryFormProps) {
  const { data: categoriesResponse } = useCategories({
    page: 1,
    limit: 100,
  });

  const existingCategories = categoriesResponse?.data ?? [];

  /*
   * We still need a default language ID for the form's initial state.
   *
   * LanguageSelect owns the actual language query used by the UI.
   * The form hook currently expects the first available language
   * as its default when creating a new category.
   *
   * If you want to completely remove language fetching from this
   * component, the cleaner long-term solution is to let
   * useCategoryForm resolve its own default language.
   */
  const firstLanguageId = "";

  const { form, isEditing, isSaving } = useCategoryForm({
    category,
    defaultLanguageId: firstLanguageId,
    open: true,
    onSuccess: () => onSuccess?.(),
  });

  const parentCategories = useMemo(
    () =>
      existingCategories.filter((item) => !category || item.id !== category.id),
    [category, existingCategories],
  );

  return (
    <div className="w-full rounded-md bg-white p-6">
      {/* Page header */}
      <div className="mb-4 border-b border-zinc-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {isEditing ? "Edit Category" : "Create Category"}
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          {isEditing
            ? `Update category details for ${category?.name}.`
            : "Create a dictionary topic or classification."}
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
        <div className="space-y-4 py-4">
          {/* Name */}
          <form.Field name="name">
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;

              return (
                <Field data-invalid={hasError}>
                  <FieldLabel htmlFor={field.name}>
                    Category Name *(update from manage categories)
                  </FieldLabel>

                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="e.g. Botany, Electronics, Books"
                    aria-invalid={hasError}
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

          {/* Language + Parent */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Default Language */}
            <form.Field name="defaultLanguageId">
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;

                return (
                  <Field data-invalid={hasError}>
                    <FieldLabel htmlFor={field.name}>
                      Default Language
                    </FieldLabel>

                    <LanguageSelect
                      value={field.state.value}
                      onChange={(value) => {
                        field.handleChange(value);
                        field.handleBlur();
                      }}
                      onBlur={field.handleBlur}
                      placeholder="Select language"
                      disabled={isSaving}
                      includeAll={false}
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

            {/* Parent Category */}
            <form.Field name="parentId">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Parent Category</FieldLabel>

                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onChange={(event) => {
                      field.handleChange(event.target.value || null);
                    }}
                    onBlur={field.handleBlur}
                    disabled={isSaving}
                    className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="">None (Top-Level Category)</option>

                    {parentCategories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            </form.Field>
          </div>

          {/* Image */}
          <form.Field name="image">
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;
              const imageUrl = field.state.value;

              return (
                <Field data-invalid={hasError}>
                  <FieldLabel htmlFor={field.name}>
                    Category Image URL
                  </FieldLabel>

                  <Input
                    id={field.name}
                    name={field.name}
                    type="url"
                    value={imageUrl}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="https://cdn.example.com/category.png"
                    aria-invalid={hasError}
                  />

                  {hasError && (
                    <FieldError
                      errors={field.state.meta.errors.map((message) => ({
                        message,
                      }))}
                    />
                  )}

                  {imageUrl && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={imageUrl}
                        alt="Category preview"
                        referrerPolicy="no-referrer"
                        className="size-10 rounded-md border object-cover"
                      />

                      <span className="text-xs text-muted-foreground">
                        Image Preview
                      </span>
                    </div>
                  )}
                </Field>
              );
            }}
          </form.Field>

          {/* Sort + Active */}
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
            <form.Field name="sortOrder">
              {(field) => (
                <Field>
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
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="isActive">
              {(field) => (
                <Field orientation="horizontal">
                  <Switch
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                  />

                  <FieldLabel htmlFor={field.name}>
                    Active in Public Vocabulary
                  </FieldLabel>
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
                ? "Update Category"
                : "Create Category"}
          </Button>
        </div>
      </form>
    </div>
  );
}
