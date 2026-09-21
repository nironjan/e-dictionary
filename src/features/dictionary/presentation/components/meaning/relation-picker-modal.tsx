"use client";

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";

import { RelationType } from "../../../domain/types/enums/word.enum.types";
import { useWordTranslationOptions } from "../../../application/queries/word.query";
import { useMeanings } from "../../../application/queries/meaning.query";
import type { WordListItem } from "../../../domain/types/word.types";
import type { RelationItem } from "../meaning-rows/meaning.types";

interface RelationPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  /** Language code used to scope the word search. */
  languageCode: string;

  /** Owning meaning — excluded so it can't relate to itself. */
  ownerMeaningId?: string;

  /** IDs already added — hidden from the word picker. */
  excludeMeaningIds?: string[];

  /** Confirm handler — receives a fully populated RelationItem. */
  onConfirm: (relation: RelationItem) => void;
}

const PAGE_SIZE = 8;

const RELATION_TYPES: { value: RelationType; label: string }[] = [
  { value: RelationType.SYNONYM, label: "Synonym" },
  { value: RelationType.ANTONYM, label: "Antonym" },
];

interface MeaningOption {
  id: string;
  partOfSpeech: string;
  definition: string;
  isArchaic: boolean;
  sortOrder: number;
}

export function RelationPickerModal({
  open,
  onOpenChange,
  languageCode,
  ownerMeaningId,
  excludeMeaningIds = [],
  onConfirm,
}: RelationPickerModalProps) {
  const [relationType, setRelationType] = useState<RelationType>(
    RelationType.SYNONYM,
  );
  const [selectedWord, setSelectedWord] = useState<WordListItem | null>(null);
  const [selectedMeaningId, setSelectedMeaningId] = useState("");
  const [wordSearch, setWordSearch] = useState("");
  const [wordPage, setWordPage] = useState(1);

  // Word search
  const {
    data: wordData,
    isPending: wordsLoading,
    isPlaceholderData,
  } = useWordTranslationOptions(
    {
      languageCode,
      search: wordSearch.trim() || undefined,
      page: wordPage,
      limit: PAGE_SIZE,
    },
    open && Boolean(languageCode),
  );

  const words = wordData?.data ?? [];
  const totalPages = wordData?.pagination.totalPages ?? 0;

  // Meanings of the selected word
  const { data: meanings = [], isPending: meaningsLoading } = useMeanings({
    wordId: selectedWord?.id ?? "",
  } as never);

  const meaningOptions: MeaningOption[] = meanings
    .filter((m): m is typeof m & { id: string } => Boolean(m.id))
    .filter((m) => m.id !== ownerMeaningId)
    .filter((m) => !excludeMeaningIds.includes(m.id))
    .map((m) => ({
      id: m.id,
      partOfSpeech: m.partOfSpeech,
      definition: m.definitions?.[0]?.text?.trim() || "No definition",
      isArchaic: m.isArchaic ?? false,
      sortOrder: m.sortOrder ?? 0,
    }));

  const selectedMeaning = meaningOptions.find(
    (m) => m.id === selectedMeaningId,
  );

  const canConfirm = Boolean(selectedWord && selectedMeaning);

  function reset() {
    setRelationType(RelationType.SYNONYM);
    setSelectedWord(null);
    setSelectedMeaningId("");
    setWordSearch("");
    setWordPage(1);
  }

  function handleClose(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  function handlePickWord(word: WordListItem) {
    setSelectedWord(word);
    setSelectedMeaningId("");
  }

  function handleConfirm() {
    if (!selectedWord || !selectedMeaning) return;

    onConfirm({
      relationType,
      relatedMeaningId: selectedMeaning.id,
      relatedWordId: selectedWord.id,
      relatedWordText: selectedWord.text,
      relatedPartOfSpeech: selectedMeaning.partOfSpeech,
      sortOrder: selectedMeaning.sortOrder,
    });

    handleClose(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="!w-[calc(100vw-2rem)] !max-w-3xl sm:!max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Relation</DialogTitle>
          <DialogDescription>
            Search for a word, then pick one of its meanings to link as a
            synonym or antonym.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Relation type */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
              Relation Type
            </label>

            <div className="flex gap-2">
              {RELATION_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setRelationType(type.value)}
                  className={
                    relationType === type.value
                      ? "rounded-md border border-blue-500 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                      : "rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                  }
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Two columns: word search | meanings */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left — word search */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-700">
                Word
              </label>

              <Input
                value={wordSearch}
                onChange={(e) => {
                  setWordSearch(e.target.value);
                  setWordPage(1);
                }}
                placeholder={`Search ${languageCode} words...`}
                autoComplete="off"
                className="h-8 text-xs"
              />

              <div className="h-64 overflow-y-auto rounded-md border">
                {wordsLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="size-4 animate-spin text-zinc-400" />
                  </div>
                ) : words.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    No words found.
                  </p>
                ) : (
                  <div className="p-1">
                    {words.map((word) => (
                      <button
                        key={word.id}
                        type="button"
                        onClick={() => handlePickWord(word)}
                        className={
                          selectedWord?.id === word.id
                            ? "flex w-full items-center justify-between rounded-sm bg-blue-50 px-2 py-1.5 text-left text-xs text-blue-700"
                            : "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-xs hover:bg-accent"
                        }
                      >
                        <span className="truncate">{word.text}</span>
                        {selectedWord?.id === word.id && (
                          <Check className="ml-2 size-3.5 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  disabled={wordPage <= 1 || isPlaceholderData}
                  onClick={() => setWordPage((p) => p - 1)}
                >
                  <ChevronLeft className="mr-1 size-3.5" />
                  Prev
                </Button>

                <span className="text-[11px] text-muted-foreground">
                  {wordData?.pagination.page ?? wordPage} / {totalPages}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  disabled={
                    !wordData || isPlaceholderData || wordPage >= totalPages
                  }
                  onClick={() => setWordPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="ml-1 size-3.5" />
                </Button>
              </div>
            </div>

            {/* Right — meanings */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-700">
                Meaning
              </label>

              <div className="h-8 rounded-md border bg-zinc-50 px-2 text-xs leading-8 text-zinc-500">
                {selectedWord?.text ?? "Select a word first"}
              </div>

              <div className="h-64 overflow-y-auto rounded-md border">
                {!selectedWord ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    Pick a word to see its meanings.
                  </p>
                ) : meaningsLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="size-4 animate-spin text-zinc-400" />
                  </div>
                ) : meaningOptions.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    No meanings available.
                  </p>
                ) : (
                  <div className="p-1">
                    {meaningOptions.map((meaning) => (
                      <button
                        key={meaning.id}
                        type="button"
                        onClick={() => setSelectedMeaningId(meaning.id)}
                        className={
                          selectedMeaningId === meaning.id
                            ? "flex w-full items-start gap-2 rounded-sm bg-blue-50 px-2 py-2 text-left"
                            : "flex w-full items-start gap-2 rounded-sm px-2 py-2 text-left hover:bg-accent"
                        }
                      >
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5">
                            <span className="text-xs font-medium capitalize">
                              {meaning.partOfSpeech}
                            </span>

                            {meaning.isArchaic && (
                              <span className="rounded bg-amber-100 px-1 py-0.5 text-[9px] font-medium text-amber-700">
                                archaic
                              </span>
                            )}
                          </span>

                          <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                            {meaning.definition}
                          </span>
                        </span>

                        {selectedMeaningId === meaning.id && (
                          <Check className="mt-0.5 size-3.5 shrink-0 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleClose(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={!canConfirm}
            onClick={handleConfirm}
          >
            Add Relation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
