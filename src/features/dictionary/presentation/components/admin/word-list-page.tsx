"use client";

import { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/shared/components/ui/button";

import { useAdminWordListQuery } from "../../../application/queries/admin-word-query";
import type {
  AdminWordListFilters,
  WordVerificationFilter,
} from "../../../domain/types/admin-word-list";

import { WordDataTable } from "./word-data-table";
import { WordListToolbar } from "./word-list-toolbar";
import { LoadingState } from "../../../../../shared/components/common/loading-state";

const DEFAULT_FILTERS: AdminWordListFilters = {
  search: "",
  languageCode: "en",
  verification: "all",
};

const PAGE_SIZE = 20;

export function WordListPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AdminWordListFilters>(DEFAULT_FILTERS);

  const { data, isLoading, isError, error } = useAdminWordListQuery({
    page,
    limit: PAGE_SIZE,
    search: filters.search,
    languageCode:
      filters.languageCode === "all" ? undefined : filters.languageCode,
    isVerified:
      filters.verification === "all"
        ? undefined
        : filters.verification === "verified",
  });

  const handleSearchChange = (value: string) => {
    setFilters((current) => ({
      ...current,
      search: value,
    }));

    setPage(1);
  };

  const handleLanguageChange = (value: string) => {
    setFilters((current) => ({
      ...current,
      languageCode: value,
    }));

    setPage(1);
  };

  const handleVerificationChange = (value: WordVerificationFilter) => {
    setFilters((current) => ({
      ...current,
      verification: value,
    }));

    setPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <WordListHeader />

        <WordListToolbar
          filters={filters}
          onSearchChange={handleSearchChange}
          onLanguageChange={handleLanguageChange}
          onVerificationChange={handleVerificationChange}
          onReset={handleReset}
        />

        <LoadingState message="Loading words..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <WordListHeader />

        <WordListToolbar
          filters={filters}
          onSearchChange={handleSearchChange}
          onLanguageChange={handleLanguageChange}
          onVerificationChange={handleVerificationChange}
          onReset={handleReset}
        />

        <div className="rounded-md border border-destructive/50 p-8 text-center">
          <p className="font-medium text-destructive">Failed to load words.</p>

          {error instanceof Error && (
            <p className="mt-1 text-sm text-muted-foreground">
              {error.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WordListHeader />

      <WordListToolbar
        filters={filters}
        onSearchChange={handleSearchChange}
        onLanguageChange={handleLanguageChange}
        onVerificationChange={handleVerificationChange}
        onReset={handleReset}
      />

      <WordDataTable data={data?.data ?? []} />
    </div>
  );
}

function WordListHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="rounded-lg border bg-muted p-2">
          <BookOpen className="size-5" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Words</h1>

          <p className="text-sm text-muted-foreground">
            Manage dictionary words.
          </p>
        </div>
      </div>

      <Link
        href="/dashboard/dictionary/words/create"
        className={buttonVariants({
          variant: "default",
          size: "default",
          className: "gap-2",
        })}
      >
        <Plus className="size-4" />
        Create Word
      </Link>
    </div>
  );
}
