"use client";

import { useRouter } from "next/navigation";
import { APP_CONSTANTS } from "../../../../../lib/constants/constants";
import { SpecialExpressionForm } from "../../../../../features/special-expression/presentation/components/forms/special-expression-form";

export default function CreateSpecialExpressionPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <SpecialExpressionForm
        onSuccess={() => router.push(APP_CONSTANTS.ROUTES.SPECIAL_EXPRESSIONS)}
        onCancel={() => router.push(APP_CONSTANTS.ROUTES.SPECIAL_EXPRESSIONS)}
      />
    </div>
  );
}
