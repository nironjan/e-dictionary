"use client";

import { useRouter } from "next/navigation";
import { WordForm } from "../../../../../../features/dictionary/presentation/components/form/word-form";
import { APP_CONSTANTS } from "../../../../../../lib/constants/constants";

export default function WordCreatePage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <WordForm
        wordToEdit={null}
        onCancel={() => router.push(APP_CONSTANTS.ROUTES.WORD_LIST)}
        onSuccess={() => router.push(APP_CONSTANTS.ROUTES.WORD_LIST)}
      />
    </div>
  );
}
