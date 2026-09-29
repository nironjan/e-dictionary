"use client";

import { useRouter } from "next/navigation";
import { DailyUsageSentenceForm } from "../../../../../features/daily-usage-sentence/presentation/form/daily-usage-sentence-form";
import { APP_CONSTANTS } from "../../../../../lib/constants/constants";

export default function CreateCategoryPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <DailyUsageSentenceForm
        onSuccess={() => router.push(APP_CONSTANTS.ROUTES.DAILY_SENTENCES)}
        onCancel={() => router.push(APP_CONSTANTS.ROUTES.DAILY_SENTENCES)}
      />
    </div>
  );
}
