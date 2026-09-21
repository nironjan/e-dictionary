"use client";

import { useRouter, useParams } from "next/navigation";
import { useWord } from "../../../../../../../features/dictionary/application/queries/word.query";
import { WordForm } from "../../../../../../../features/dictionary/presentation/components/form/word-form";
import { APP_CONSTANTS } from "../../../../../../../lib/constants/constants";
import { LoadingState } from "../../../../../../../shared/components/common/loading-state";

export default function EditWordPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: word, isLoading, isError } = useWord(id);

  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }
  if (isError || !word) {
    return <div className="p-6 text-sm text-red-600">Word not found.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <WordForm
        wordToEdit={word}
        onCancel={() => router.push(APP_CONSTANTS.ROUTES.WORD_LIST)}
        onSuccess={() => router.push(APP_CONSTANTS.ROUTES.WORD_LIST)}
      />
    </div>
  );
}
