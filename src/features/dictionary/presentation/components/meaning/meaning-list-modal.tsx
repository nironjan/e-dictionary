"use client";

import { useCallback } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { MeaningTable } from "./meaning-table";
import { useMeanings } from "../../../application/queries/meaning.query";
import {
  useDeleteMeaning,
  useVerifyMeaning,
} from "../../../application/mutation/meaning.mutation";
import type { WordMeaning } from "../../../domain/types/word.types";

interface MeaningListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wordId: string | null;
  wordText?: string;
}

export function MeaningListModal({
  open,
  onOpenChange,
  wordId,
  wordText,
}: MeaningListModalProps) {
  const {
    data: meanings = [],
    isLoading,
    isError,
  } = useMeanings({
    wordId: wordId ?? "",
  });

  const verifyMutation = useVerifyMeaning();
  const deleteMutation = useDeleteMeaning();

  const handleToggleVerification = useCallback(
    async (meaning: WordMeaning) => {
      await verifyMutation.mutateAsync({
        id: meaning.id,
        dto: {
          isVerified: !meaning.isVerified,
        },
      });
    },
    [verifyMutation],
  );

  const handleDelete = useCallback(
    async (meaning: WordMeaning) => {
      const confirmed = window.confirm(
        `Permanently delete this meaning from "${wordText ?? "this word"}"?`,
      );

      if (!confirmed) {
        return;
      }

      await deleteMutation.mutateAsync(meaning.id);
    },
    [deleteMutation, wordText],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="text-base">
            Meanings
            {wordText ? ` — ${wordText}` : ""}
          </DialogTitle>

          <DialogDescription className="text-xs">
            Review definitions, translations, and examples for this word. Verify
            each meaning independently.
          </DialogDescription>
        </DialogHeader>

        <MeaningTable
          meanings={meanings}
          isLoading={isLoading}
          isError={isError}
          verifyingMeaningId={
            verifyMutation.isPending
              ? (verifyMutation.variables?.id ?? null)
              : null
          }
          deletingMeaningId={
            deleteMutation.isPending ? (deleteMutation.variables ?? null) : null
          }
          onToggleVerification={handleToggleVerification}
          onDelete={handleDelete}
        />
      </DialogContent>
    </Dialog>
  );
}
