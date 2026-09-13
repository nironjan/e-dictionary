"use client";

import type { WordFormApi } from "../../form/use-word-app-form";

interface BasicInfoTabProps {
  form: WordFormApi;
}

export function BasicInfoTab({ form }: BasicInfoTabProps) {
  return (
    <div className="space-y-4 py-4">
      <form.AppField name="languageId">
        {(field) => <field.TextField label="Language ID" />}
      </form.AppField>
      <form.AppField name="text">
        {(field) => (
          <field.TextField label="Word" placeholder="e.g. serendipity" />
        )}
      </form.AppField>
    </div>
  );
}
