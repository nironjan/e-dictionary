"use client";

import { useRouter, useParams } from "next/navigation";
import { CategoryForm } from "@/features/category/presentation/components/category-form";
import { useCategory } from "@/features/category/application/queries/category.query";
import { APP_CONSTANTS } from "../../../../../../lib/constants/constants";
import { LoadingState } from "../../../../../../shared/components/common/loading-state";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: category, isLoading, isError } = useCategory(id);

  if (isLoading) {
    return <LoadingState message="loading..." />;
  }
  if (isError || !category) {
    return <div className="p-6 text-sm text-red-600">Category not found.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <CategoryForm
        category={category}
        onCancel={() => router.push(APP_CONSTANTS.ROUTES.CATEGORY_LIST)}
        onSuccess={() => router.push(APP_CONSTANTS.ROUTES.CATEGORY_LIST)}
      />
    </div>
  );
}
