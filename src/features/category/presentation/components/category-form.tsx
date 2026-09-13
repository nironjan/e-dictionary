/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";

import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";

import { useCategories } from "../../application/queries/category.query";

import type { Category } from "../../domain/types/category.type";

import { useCategoryForm } from "../hooks/use-category-form";
import { useLanguages } from "../../../language/application/queries/language.query";

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
  const { data: languages = [] } = useLanguages();

  const { data: categoriesResponse } = useCategories({
    page: 1,
    limit: 100,
  });

  const existingCategories = categoriesResponse?.data ?? [];

  const firstLanguageId = languages[0]?.id ?? "";

  const { form, isEditing, isSaving } = useCategoryForm({
    category,
    defaultLanguageId: firstLanguageId,
    open: true, // always "open" on a page — keeps the hook's reset behavior
    onSuccess: () => onSuccess?.(),
  });

  const parentCategories = useMemo(
    () =>
      existingCategories.filter((item) => !category || item.id !== category.id),
    [category, existingCategories],
  );

  return (
    <div className="w-full bg-white rounded-md p-6">
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
                  <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>

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
            <form.Field name="defaultLanguageId">
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;
                const selectedLanguage = languages.find(
                  (l) => l.id === field.state.value,
                );

                return (
                  <Field data-invalid={hasError}>
                    <FieldLabel htmlFor={field.name}>
                      Default Language
                    </FieldLabel>

                    <Select
                      value={field.state.value}
                      onValueChange={(value) => {
                        if (value !== null) {
                          field.handleChange(value);
                        }
                      }}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Select language">
                          {selectedLanguage
                            ? `${selectedLanguage.name} (${selectedLanguage.code})`
                            : undefined}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language.id} value={language.id}>
                            {language.name} ({language.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

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

            <form.Field name="parentId">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Parent Category</FieldLabel>

                  <Select
                    value={field.state.value ?? "__none__"}
                    onValueChange={(value) => {
                      field.handleChange(value === "__none__" ? null : value);
                    }}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="None (Top-Level Category)" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="__none__">
                        None (Top-Level Category)
                      </SelectItem>

                      {parentCategories.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
