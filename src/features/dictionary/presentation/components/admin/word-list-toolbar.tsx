"use client";

import { RotateCcw, Search } from "lucide-react";

import type {
  AdminWordListFilters,
  WordVerificationFilter,
} from "@/features/dictionary/domain/types/admin-word-list";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useLanguages } from "../../../../language/application/queries/language.query";

type WordListToolbarProps = {
  filters: AdminWordListFilters;
  onSearchChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onVerificationChange: (value: WordVerificationFilter) => void;
  onReset: () => void;
};

export function WordListToolbar({
  filters,
  onSearchChange,
  onLanguageChange,
  onVerificationChange,
  onReset,
}: WordListToolbarProps) {
  const { data: languages = [], isLoading: isLanguageLoading } = useLanguages();
  const hasFilters =
    filters.search.trim().length > 0 ||
    filters.languageCode !== "all" ||
    filters.verification !== "all";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={filters.search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search words..."
            className="pl-9"
          />
        </div>

        {/* Language */}
        <select
          value={filters.languageCode}
          onChange={(event) => onLanguageChange(event.target.value)}
          disabled={isLanguageLoading}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="all">
            {isLanguageLoading ? "Loading languages..." : "All languages"}
          </option>

          {languages.map((language) => (
            <option key={language.id} value={language.code}>
              {language.name}
            </option>
          ))}
        </select>

        {/* Verification */}
        <select
          value={filters.verification}
          onChange={(event) =>
            onVerificationChange(event.target.value as WordVerificationFilter)
          }
          className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="all">All</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {/* Reset */}
      {hasFilters && (
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="shrink-0"
        >
          <RotateCcw className="size-4" />
          Reset
        </Button>
      )}
    </div>
  );
}
