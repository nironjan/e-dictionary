"use client";

import { Languages } from "lucide-react";

import { LanguageForm } from "./language-form";
import { useLanguage } from "../../application/queries/language.query";

type EditLanguageProps = {
  id: string;
};

export function EditLanguage({ id }: EditLanguageProps) {
  const { data: language, isLoading, isError, error } = useLanguage(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <EditLanguageHeader />

        <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
          Loading language...
        </div>
      </div>
    );
  }

  if (isError || !language) {
    return (
      <div className="space-y-6">
        <EditLanguageHeader />

        <div className="rounded-lg border border-destructive/50 p-8 text-center">
          <p className="font-medium text-destructive">
            Failed to load language.
          </p>

          {error instanceof Error && (
            <p className="mt-1 text-sm text-muted-foreground">
              {error.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EditLanguageHeader />

      <div className="rounded-lg border bg-card p-6">
        <LanguageForm language={language} />
      </div>
    </div>
  );
}

function EditLanguageHeader() {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg border bg-muted p-2">
        <Languages className="size-5" />
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Language</h1>

        <p className="text-sm text-muted-foreground">
          Update the language details.
        </p>
      </div>
    </div>
  );
}
