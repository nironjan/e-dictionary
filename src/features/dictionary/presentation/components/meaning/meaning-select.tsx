"use client";

import { useState } from "react";

import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useMeanings } from "../../../application/queries/meaning.query";
import type { QueryMeaningsDto } from "../../../infrastructure/meaning.api";

interface MeaningSelectProps {
  /** Word whose meanings should be listed. */
  wordId: string;

  /** Currently selected meaning ID. */
  value: string;

  /** Called with the picked meaning ID. */
  onChange: (meaningId: string) => void;

  /** Optional: exclude a meaning (e.g. the owner meaning itself). */
  excludeMeaningId?: string;

  disabled?: boolean;
  placeholder?: string;
}

interface MeaningOption {
  id: string;
  partOfSpeech: string;
  definition: string;
  isArchaic: boolean;
}

export function MeaningSelect({
  wordId,
  value,
  onChange,
  excludeMeaningId,
  disabled = false,
  placeholder = "Select meaning",
}: MeaningSelectProps) {
  const [open, setOpen] = useState(false);

  const {
    data: meanings = [],
    isLoading,
    isError,
  } = useMeanings({ wordId } as QueryMeaningsDto);

  const persistedMeanings = meanings.filter(
    (m): m is typeof m & { id: string } => Boolean(m.id),
  );

  const filtered = excludeMeaningId
    ? persistedMeanings.filter((m) => m.id !== excludeMeaningId)
    : persistedMeanings;

  const options: MeaningOption[] = filtered.map((meaning) => ({
    id: meaning.id,
    partOfSpeech: meaning.partOfSpeech,
    definition: meaning.definitions?.[0]?.text?.trim() || "No definition",
    isArchaic: meaning.isArchaic ?? false,
  }));

  const selected = options.find((option) => option.id === value);

  function handleSelect(option: MeaningOption) {
    onChange(option.id);
    setOpen(false);
  }

  const triggerDisabled = disabled || !wordId || isLoading;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={triggerDisabled}
            className="h-auto min-h-8 w-full justify-between py-1.5 font-normal"
          />
        }
      >
        {selected ? (
          <div className="min-w-0 text-left">
            <span className="block font-medium capitalize">
              {selected.partOfSpeech}
            </span>
            <span className="block truncate text-[10px] text-muted-foreground">
              {selected.definition}
            </span>
          </div>
        ) : (
          <span className="truncate text-left text-muted-foreground">
            {!wordId
              ? "Select a word first"
              : isLoading
                ? "Loading meanings..."
                : isError
                  ? "Failed to load meanings"
                  : placeholder}
          </span>
        )}

        <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[--anchor-width] min-w-72 p-1">
        <div className="max-h-64 overflow-y-auto">
          {isLoading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Loading meanings...
            </p>
          ) : isError ? (
            <p className="py-6 text-center text-sm text-destructive">
              Could not load meanings. Please try again.
            </p>
          ) : options.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No meanings found.
            </p>
          ) : (
            <div className="space-y-1">
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="flex w-full items-start justify-between gap-2 rounded-md px-2 py-2 text-left hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-medium capitalize">
                        {option.partOfSpeech}
                      </span>

                      {option.isArchaic && (
                        <span className="rounded bg-amber-100 px-1 py-0.5 text-[9px] font-medium text-amber-700">
                          archaic
                        </span>
                      )}
                    </span>

                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {option.definition}
                    </span>
                  </span>

                  {value === option.id && (
                    <Check className="mt-0.5 size-4 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
