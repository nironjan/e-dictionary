"use client";

import { useRouter } from "next/navigation";
import { CategoryForm } from "@/features/category/presentation/components/category-form";
import { APP_CONSTANTS } from "../../../../../lib/constants/constants";

export default function CreateCategoryPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <CategoryForm
        category={null}
        onCancel={() => router.push(APP_CONSTANTS.ROUTES.CATEGORY_LIST)}
        onSuccess={() => router.push(APP_CONSTANTS.ROUTES.CATEGORY_LIST)}
      />
    </div>
  );
}
