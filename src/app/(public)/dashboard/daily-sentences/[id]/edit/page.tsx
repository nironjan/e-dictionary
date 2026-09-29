"use client";

import { useRouter, useParams } from "next/navigation";
import { LoadingState } from "../../../../../../shared/components/common/loading-state";
import { useDailyUsageSentenceQuery } from "../../../../../../features/daily-usage-sentence/application/queries/use-daily-usage-sentence-query";
import { DailyUsageSentenceForm } from "../../../../../../features/daily-usage-sentence/presentation/form/daily-usage-sentence-form";
import { APP_CONSTANTS } from "../../../../../../lib/constants/constants";

export default function EditDailyUsageSentencePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: sentence, isLoading, isError } = useDailyUsageSentenceQuery(id);

  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }
  if (isError || !sentence) {
    return <div className="p-6 text-sm text-red-600">Sentence not found.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <DailyUsageSentenceForm
        sentence={sentence}
        onSuccess={() => router.push(APP_CONSTANTS.ROUTES.DAILY_SENTENCES)}
        onCancel={() => router.push(APP_CONSTANTS.ROUTES.DAILY_SENTENCES)}
      />
    </div>
  );
}
