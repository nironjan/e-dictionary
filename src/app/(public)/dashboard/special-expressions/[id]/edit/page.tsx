"use client";

import { useRouter, useParams } from "next/navigation";
import { LoadingState } from "../../../../../../shared/components/common/loading-state";
import { APP_CONSTANTS } from "../../../../../../lib/constants/constants";
import { useSpecialExpressionQuery } from "../../../../../../features/special-expression/application/queries";
import { SpecialExpressionForm } from "../../../../../../features/special-expression/presentation/components/forms/special-expression-form";

export default function EditSpecialExpressionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const {
    data: expression,
    isLoading,
    isError,
  } = useSpecialExpressionQuery(id);

  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }
  if (isError || !expression) {
    return (
      <div className="p-6 text-sm text-red-600">Expression not found.</div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <SpecialExpressionForm
        expression={expression}
        onSuccess={() => router.push(APP_CONSTANTS.ROUTES.SPECIAL_EXPRESSIONS)}
        onCancel={() => router.push(APP_CONSTANTS.ROUTES.SPECIAL_EXPRESSIONS)}
      />
    </div>
  );
}
