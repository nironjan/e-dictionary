"use client";

import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

import { useCategoryForm } from "../hooks/use-category-form";
import { FieldShell } from "./form/field-shell";

type Props = {
  form: ReturnType<typeof useCategoryForm>["form"];
  languageLabel: string;
};

export function CategoryPrimaryTranslationEditor({
  form,
  languageLabel,
}: Props) {
  return (
    <div className="grid gap-4">
      <form.Field name="name">
        {(field) => (
          <FieldShell
            id={field.name}
            label={`${languageLabel} name`}
            error={field.state.meta.errors[0]?.message}
          >
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Botany"
              autoComplete="off"
            />
          </FieldShell>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <FieldShell
            id={field.name}
            label={`${languageLabel} description`}
            error={field.state.meta.errors[0]?.message}
          >
            <Textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Short description."
              rows={4}
            />
          </FieldShell>
        )}
      </form.Field>
    </div>
  );
}
