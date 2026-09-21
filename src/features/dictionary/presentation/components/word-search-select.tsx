"use client";

import React, { useEffect, useState } from "react";

import { Check, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useWordTranslationOptions } from "../../application/queries/word.query";
import type { WordListItem } from "../../domain/types/word.types";

interface WordSearchSelectProps {
  languageCode: string;
  value: WordListItem | null;
  onSelect: (word: WordListItem) => void;
  onClear: () => void;
  excludeWordIds?: string[];
  placeholder?: string;
  disabled?: boolean;
}

const PAGE_SIZE = 10;

export function WordSearchSelect({
  languageCode,
  value,
  onSelect,
  onClear,
  excludeWordIds = [],
  placeholder = "Search for a word...",
  disabled = false,
}: WordSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
    setPage(1);
  }

  const { data, isPending, isError, isPlaceholderData } =
    useWordTranslationOptions(
      {
        languageCode,
        search: search.trim() || undefined,
        page,
        limit: PAGE_SIZE,
      },
      open && Boolean(languageCode),
    );

  const words = data?.data ?? [];
  const availableWords = words.filter(
    (word) => word.id !== value?.id && !excludeWordIds.includes(word.id),
  );

  const totalPages = data?.pagination.totalPages ?? 0;

  function handleSelect(word: WordListItem) {
    onSelect(word);
    setOpen(false);
    setSearch("");
    setPage(1);
  }

  function handleClear() {
    onClear();
    setSearch("");
    setPage(1);
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled || !languageCode}
              className="w-full justify-between font-normal"
            />
          }
        >
          <span className="truncate text-left">
            {value ? `${value.text} (${value.language.code})` : placeholder}
          </span>

          <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[--anchor-width] min-w-72 p-0"
        >
          <div className="space-y-3 p-3">
            <Input
              value={search}
              onChange={handleSearchChange}
              placeholder={`Search ${languageCode} words...`}
              autoComplete="off"
            />

            <div className="max-h-64 overflow-y-auto">
              {isPending ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Loading words...
                </p>
              ) : isError ? (
                <p className="py-6 text-center text-sm text-destructive">
                  Could not load words. Please try again.
                </p>
              ) : availableWords.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No matching words found.
                </p>
              ) : (
                <div className="space-y-1">
                  {availableWords.map((word) => (
                    <button
                      key={word.id}
                      type="button"
                      onClick={() => handleSelect(word)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {word.text}
                        </span>

                        <span className="block text-xs text-muted-foreground">
                          {word.language.name} ({word.language.code})
                        </span>
                      </span>

                      {value?.id === word.id && (
                        <Check className="ml-2 size-4 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={page <= 1 || isPending || isPlaceholderData}
                onClick={() => setPage((current) => current - 1)}
              >
                <ChevronLeft className="mr-1 size-4" />
                Previous
              </Button>

              <span className="text-xs text-muted-foreground">
                Page {data?.pagination.page ?? page} of {totalPages}
              </span>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={
                  !data || isPending || isPlaceholderData || page >= totalPages
                }
                onClick={() => setPage((current) => current + 1)}
              >
                Next
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {value && (
        <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{value.text}</p>
            <p className="text-xs text-muted-foreground">
              {value.language.name} ({value.language.code})
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            aria-label="Remove selected word"
            disabled={disabled}
            onClick={handleClear}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
