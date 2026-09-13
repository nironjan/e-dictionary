/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import type {
  AdminWordListItem,
  AdminWordListPagination,
  AdminWordListQuery,
  WordVerificationFilter,
  WordLanguageFilter,
} from "../../domain/types/admin-word-list";
import { adminWordApi } from "../../infrastructure/admin-word-api";

export interface UseAdminWordListOptions {
  initialSearch?: string;
  initialLanguage?: WordLanguageFilter;
  initialVerification?: WordVerificationFilter;
  initialLimit?: number;
}

export function useAdminWordList(options: UseAdminWordListOptions = {}) {
  const [search, setSearch] = useState(options.initialSearch || "");
  const [languageCode, setLanguageCode] = useState<WordLanguageFilter>(
    options.initialLanguage || "all",
  );
  const [verification, setVerification] = useState<WordVerificationFilter>(
    options.initialVerification || "all",
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(options.initialLimit || 10);

  const [items, setItems] = useState<AdminWordListItem[]>([]);
  const [pagination, setPagination] = useState<AdminWordListPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchWords = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    const query: AdminWordListQuery = {
      page,
      limit,
      search: search.trim() || undefined,
      languageCode: languageCode === "all" ? undefined : languageCode,
      isVerified:
        verification === "verified"
          ? true
          : verification === "unverified"
            ? false
            : undefined,
    };

    try {
      const response = await adminWordApi.list(query);
      setItems(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, languageCode, verification]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const verifyWord = async (id: string) => {
    await adminWordApi.verify(id);
    await fetchWords();
  };

  const removeWord = async (id: string) => {
    await adminWordApi.remove(id);
    await fetchWords();
  };

  return {
    items,
    pagination,
    isLoading,
    isError,
    error,
    search,
    setSearch: (val: string) => {
      setSearch(val);
      setPage(1);
    },
    languageCode,
    setLanguageCode: (val: WordLanguageFilter) => {
      setLanguageCode(val);
      setPage(1);
    },
    verification,
    setVerification: (val: WordVerificationFilter) => {
      setVerification(val);
      setPage(1);
    },
    page,
    setPage,
    limit,
    setLimit,
    refetch: fetchWords,
    verifyWord,
    removeWord,
  };
}
