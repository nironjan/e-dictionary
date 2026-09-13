"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Tags } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { LoadingState } from "@/shared/components/common/loading-state";
import { useCategoryQuery } from "../../application/queries/category.query";

import { CategoryForm } from "./category-form";

type EditCategoryProps = {
  id: string;
};

export function EditCategory({ id }: EditCategoryProps) {
  const { data: category, isLoading, isError, error } = useCategoryQuery(id);

  return (
    <div className="space-y-6">
      <EditCategoryHeader />

      {isLoading && <LoadingState message="Loading category..." />}

      {isError && (
        <div className="rounded-lg border border-destructive/50 p-8 text-center">
          <p className="font-medium text-destructive">
            Failed to load category.
          </p>
          {error instanceof Error && (
            <p className="mt-1 text-sm text-muted-foreground">
              {error.message}
            </p>
          )}
        </div>
      )}

      {category && (
        <div className="rounded-lg border bg-card p-6">
          <CategoryForm
            category={category}
            defaultLanguageId={category.defaultLanguage.id}
          />
        </div>
      )}
    </div>
  );
}

function EditCategoryHeader() {
  const router = useRouter();

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg border bg-muted p-2">
          <Tags className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit category
          </h1>
          <p className="text-sm text-muted-foreground">
            Update the category details.
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
  );
}
