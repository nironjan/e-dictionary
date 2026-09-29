"use client";

import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import type { SpecialExpression } from "../../../domain/types/special-expression.type";
import { useSpecialExpressionForm } from "../../hooks/use-special-expression-form";
import { CategoryMultiSelect } from "../../../../category/presentation/components/category-multi-select";

interface SpecialExpressionFormProps {
  expression?: SpecialExpression | null;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function SpecialExpressionForm({
  expression,
  onCancel,
  onSuccess,
}: SpecialExpressionFormProps) {
  const { form, isEditing, isSaving } = useSpecialExpressionForm({
    expression,
    open: true,
    onSuccess: () => onSuccess?.(),
  });

  return (
    <div className="w-full rounded-md bg-white p-6">
      {/* Page header */}
      <div className="mb-4 border-b border-zinc-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {isEditing ? "Edit Special Expression" : "Create Special Expression"}
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          {isEditing
            ? "Update the expression, meaning, categories, and other details."
            : "Create the special expression first. Translations can be added later from the expression details."}
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
          {/* Language + Type */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Source Language</FieldLabel>

              <div className="flex h-9 items-center rounded-md border bg-muted/40 px-3 text-sm">
                English
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  en
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                Special expressions use English as the source language.
              </p>
            </Field>
            <form.Field name="type">
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;

                return (
                  <Field data-invalid={hasError}>
                    <FieldLabel htmlFor={field.name}>
                      Expression Type *
                    </FieldLabel>

                    <select
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        const value =
                          event.target.value === "idiom"
                            ? "idiom"
                            : "one_word_substitution";

                        field.handleChange(value);
                      }}
                      disabled={isSaving}
                      aria-invalid={hasError}
                      className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none"
                    >
                      <option value="one_word_substitution">
                        One Word Substitution
                      </option>

                      <option value="idiom">Idiom</option>
                    </select>

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

          {/* Expression */}
          <form.Field name="expression">
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;

              return (
                <Field data-invalid={hasError}>
                  <FieldLabel htmlFor={field.name}>Expression *</FieldLabel>

                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="e.g. A person who loves books"
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

          {/* Meaning */}
          <form.Field name="meaning">
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;

              return (
                <Field data-invalid={hasError}>
                  <FieldLabel htmlFor={field.name}>Meaning *</FieldLabel>

                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Explain the meaning of the expression..."
                    rows={3}
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

          {/* Replacement + Literal Meaning */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field name="replacement">
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;

                return (
                  <Field data-invalid={hasError}>
                    <FieldLabel htmlFor={field.name}>Replacement</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="e.g. Bibliophile"
                      aria-invalid={hasError}
                      disabled={isSaving}
                    />

                    <p className="text-xs text-muted-foreground">
                      Required for one-word substitutions and not used for
                      idioms.
                    </p>

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

          {/* Literal Meaning */}
          <form.Field name="literalMeaning">
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;

              return (
                <Field data-invalid={hasError}>
                  <FieldLabel htmlFor={field.name}>Literal Meaning</FieldLabel>

                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Optional literal meaning..."
                    rows={2}
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

          {/* Example */}
          <form.Field name="example">
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;

              return (
                <Field data-invalid={hasError}>
                  <FieldLabel htmlFor={field.name}>Example</FieldLabel>

                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Enter an example sentence..."
                    rows={3}
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

          {/* Notes */}
          <form.Field name="notes">
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;

              return (
                <Field data-invalid={hasError}>
                  <FieldLabel htmlFor={field.name}>Notes</FieldLabel>

                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Optional editorial notes..."
                    rows={3}
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

          {/* Categories */}
          <form.Field name="categoryIds">
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;

              return (
                <Field data-invalid={hasError}>
                  <FieldLabel htmlFor={field.name}>Categories</FieldLabel>

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
        </div>

        {/* Footer */}
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
                ? "Update Expression"
                : "Create Expression"}
          </Button>
        </div>
      </form>
    </div>
  );
}
