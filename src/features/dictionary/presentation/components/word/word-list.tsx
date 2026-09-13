"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { WordListToolbar } from "./word-list-toolbar";
import { WordListTable } from "./word-list-table";
import { WordListPagination } from "./word-list-pagination";
import { useWordListColumns } from "./word-list-columns";
import type { WordSummary } from "../../../domain/types/word.types";
import { useLanguages } from "../../../../language/application/queries/language.query";
import { useCategories } from "../../../../category/application/queries/category.query";
import { useWord, useWords } from "../../../application/queries/word.query";
import {
  useDeleteWord,
  useVerifyWord,
} from "../../../application/mutation/word.mutation";
import { APP_CONSTANTS } from "../../../../../lib/constants/constants";
import { MeaningListModal } from "../meaning/meaning-list-modal";
import { WordDetailModal } from "./word-detail-modal";

export function WordList() {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // List state
  // ---------------------------------------------------------------------------

  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [search, setSearch] = useState("");
  const [languageCode, setLanguageCode] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // ---------------------------------------------------------------------------
  // Modal state
  // ---------------------------------------------------------------------------

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeWordId, setActiveWordId] = useState<string | null>(null);

  const [meaningModalOpen, setMeaningModalOpen] = useState(false);
  const [meaningWord, setMeaningWord] = useState<WordSummary | null>(null);

  // ---------------------------------------------------------------------------
  // Reference data
  // ---------------------------------------------------------------------------

  const { data: languages = [] } = useLanguages();

  const { data: categoriesResponse } = useCategories({
    page: 1,
    limit: 20,
  });

  const categories = categoriesResponse?.data ?? [];

  // ---------------------------------------------------------------------------
  // Word list query
  // ---------------------------------------------------------------------------

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search: search.trim() || undefined,
      languageCode: languageCode || undefined,
      isVerified: verifiedFilter === "all" ? undefined : verifiedFilter,
      categoryId: selectedCategoryId || undefined,
    }),
    [page, limit, search, languageCode, verifiedFilter, selectedCategoryId],
  );

  const { data: response, isLoading } = useWords(queryParams);

  const words = response?.data ?? [];

  const pagination = response?.pagination ?? {
    page: 1,
    limit,
    total: 0,
    totalPages: 1,
  };

  // ---------------------------------------------------------------------------
  // Active word detail query
  // ---------------------------------------------------------------------------

  const {
    data: activeWord,
    isLoading: isLoadingActiveWord,
    isError: isActiveWordError,
  } = useWord(activeWordId);

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------

  const verifyMutation = useVerifyWord();
  const deleteMutation = useDeleteWord();

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  const handleCreateNew = useCallback(() => {
    router.push(APP_CONSTANTS.ROUTES.CREATE_WORD);
  }, [router]);

  const handleEdit = useCallback(
    (word: WordSummary) => {
      router.push(APP_CONSTANTS.ROUTES.EDIT_WORD(word.id));
    },
    [router],
  );

  // ---------------------------------------------------------------------------
  // Word actions
  // ---------------------------------------------------------------------------

  const handleView = useCallback((word: WordSummary) => {
    setActiveWordId(word.id);
    setDetailModalOpen(true);
  }, []);

  const handleToggleVerify = useCallback(
    async (word: WordSummary) => {
      await verifyMutation.mutateAsync({
        id: word.id,
        dto: {
          isVerified: !word.isVerified,
        },
      });
    },
    [verifyMutation],
  );

  const handleDelete = useCallback(
    async (word: WordSummary) => {
      const confirmed = window.confirm(
        `Permanently remove word "${word.text}" from dictionary index?`,
      );

      if (!confirmed) {
        return;
      }

      await deleteMutation.mutateAsync(word.id);
    },
    [deleteMutation],
  );

  // ---------------------------------------------------------------------------
  // Meaning actions
  // ---------------------------------------------------------------------------

  const handleViewMeanings = useCallback((word: WordSummary) => {
    setMeaningWord(word);
    setMeaningModalOpen(true);
  }, []);

  // ---------------------------------------------------------------------------
  // Table columns
  // ---------------------------------------------------------------------------

  const columns = useWordListColumns({
    onView: handleView,
    onEdit: handleEdit,
    onViewMeanings: handleViewMeanings,
    onToggleVerify: handleToggleVerify,
    onDelete: handleDelete,
  });

  // ---------------------------------------------------------------------------
  // Filter handlers
  // ---------------------------------------------------------------------------

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleLanguageChange = useCallback((value: string) => {
    setLanguageCode(value === "all-languages" ? "" : value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategoryId(value === "all-categories" ? "" : value);
    setPage(1);
  }, []);

  const handleVerificationChange = useCallback((value: string) => {
    setVerifiedFilter(value);
    setPage(1);
  }, []);

  // ---------------------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------------------

  const handlePreviousPage = useCallback(() => {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((currentPage) => Math.min(pagination.totalPages, currentPage + 1));
  }, [pagination.totalPages]);

  // ---------------------------------------------------------------------------
  // Detail modal
  // ---------------------------------------------------------------------------

  const handleDetailModalChange = useCallback((open: boolean) => {
    setDetailModalOpen(open);

    if (!open) {
      setActiveWordId(null);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-4">
      <WordListToolbar
        search={search}
        languageCode={languageCode || "all-languages"}
        selectedCategoryId={selectedCategoryId || "all-categories"}
        verifiedFilter={verifiedFilter}
        languages={languages}
        categories={categories}
        onSearchChange={handleSearchChange}
        onLanguageChange={handleLanguageChange}
        onCategoryChange={handleCategoryChange}
        onVerificationChange={handleVerificationChange}
        onCreateNew={handleCreateNew}
      />

      <WordListTable words={words} columns={columns} isLoading={isLoading} />

      <WordListPagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        visibleCount={words.length}
        totalCount={pagination.total}
        onPrevious={handlePreviousPage}
        onNext={handleNextPage}
      />

      <MeaningListModal
        open={meaningModalOpen}
        onOpenChange={setMeaningModalOpen}
        wordId={meaningWord?.id ?? null}
        wordText={meaningWord?.text}
      />

      <WordDetailModal
        open={detailModalOpen}
        onOpenChange={handleDetailModalChange}
        word={activeWord}
        isLoading={isLoadingActiveWord}
        isError={isActiveWordError}
        onEdit={(word) => {
          router.push(APP_CONSTANTS.ROUTES.EDIT_WORD(word.id));
        }}
      />
    </div>
  );
}
