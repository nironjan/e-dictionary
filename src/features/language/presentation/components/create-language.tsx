"use client";

import { Languages } from "lucide-react";

import { LanguageForm } from "./language-form";

export function CreateLanguage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg border bg-muted p-2">
          <Languages className="size-5" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Language
          </h1>

          <p className="text-sm text-muted-foreground">
            Add a new language to the dictionary.
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <LanguageForm />
      </div>
    </div>
  );
}
