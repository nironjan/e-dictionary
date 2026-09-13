"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Tags } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { LoadingState } from "@/shared/components/common/loading-state";

import { CategoryForm } from "./category-form";
import { useDefaultLanguageQuery } from "../../../language/application/queries/language.query";

export function CreateCategory() {
  const router = useRouter();

  const {
    data: defaultLanguage,
    isLoading,
    isError,
    error,
  } = useDefaultLanguageQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg border bg-muted p-2">
            <Tags className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Create category
            </h1>
            <p className="text-sm text-muted-foreground">
              Add a new category to the dictionary.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-6">
        {isLoading && <LoadingState message="Loading languages..." />}

        {isError && (
          <div className="rounded-lg border border-destructive/50 p-6 text-sm text-destructive">
            Failed to load languages.
            {error instanceof Error && (
              <p className="mt-1 text-muted-foreground">{error.message}</p>
            )}
          </div>
        )}

        {defaultLanguage && (
          <CategoryForm defaultLanguageId={defaultLanguage.id} />
        )}
      </div>
    </div>
  );
}
