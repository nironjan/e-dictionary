"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

import { APP_CONSTANTS } from "../../../../lib/constants/constants";

import { useDailyUsageSentencesQuery } from "../../application/queries/use-daily-usage-sentences-query";

import type { DailyUsageSentenceListQuery } from "../../domain/types/daily-usage-sentence-query.type";
import type { DailyUsageSentence } from "../../domain/types/daily-usage-sentence.type";

import type {
  DailyUsageSentenceActiveFilter,
  DailyUsageSentenceListFilters,
  DailyUsageSentenceVerifiedFilter,
} from "../../domain/types/daily-usage-sentence-list.type";

import { DailyUsageSentenceDataTable } from "./daily-usage-sentence-data-table";
import { DailyUsageSentenceListToolbar } from "./daily-usage-sentence-list-toolbar";
import { DailyUsageSentenceTranslationsDrawer } from "./daily-usage-sentence-translations-drawer";
import { useDeleteDailyUsageSentenceMutation } from "../../application/mutations/use-delete-daily-usage-sentence-mutation";
import { LoadingState } from "../../../../shared/components/common/loading-state";
import { DeleteAlertDialog } from "../../../../shared/components/common/delete-alert-dialog";

const DEFAULT_FILTERS: DailyUsageSentenceListFilters = {
  search: "",
  activation: "all",
  verification: "all",
};

const DEFAULT_LIMIT = 20;

function filtersToQuery(
  filters: DailyUsageSentenceListFilters,
  page: number,
): DailyUsageSentenceListQuery {
  return {
    page,
    limit: DEFAULT_LIMIT,

    search: filters.search.trim() || undefined,

    isActive:
      filters.activation === "all"
        ? undefined
        : filters.activation === "active",

    isVerified:
      filters.verification === "all"
        ? undefined
        : filters.verification === "verified",
  };
}

export function DailyUsageSentenceList() {
  const router = useRouter();

  const [filters, setFilters] =
    useState<DailyUsageSentenceListFilters>(DEFAULT_FILTERS);

  const [page, setPage] = useState(1);

  const [translationSentenceId, setTranslationSentenceId] = useState<
    string | null
  >(null);

  const [isTranslationDialogOpen, setIsTranslationDialogOpen] = useState(false);

  const [deleteSentence, setDeleteSentence] =
    useState<DailyUsageSentence | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteMutation = useDeleteDailyUsageSentenceMutation();

  const query = filtersToQuery(filters, page);

  const { data, isLoading, isFetching } = useDailyUsageSentencesQuery(query);

  const sentences = data?.data ?? [];
  const pagination = data?.pagination;

  const handleCreate = () => {
    router.push(APP_CONSTANTS.ROUTES.DAILY_SENTENCES_CREATE);
  };

  const handleEdit = (sentence: DailyUsageSentence) => {
    router.push(APP_CONSTANTS.ROUTES.DAILY_SENTENCES_EDIT(sentence.id));
  };

  const handleManageTranslations = (sentence: DailyUsageSentence) => {
    setTranslationSentenceId(sentence.id);
    setIsTranslationDialogOpen(true);
  };

  const handleDelete = async (sentence: DailyUsageSentence) => {
    setDeleteSentence(sentence);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteSentence) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({
        id: deleteSentence.id,
      });

      setIsDeleteDialogOpen(false);
      setDeleteSentence(null);

      // If the deleted item was the only item on the current page,
      // move back one page.
      if (sentences.length === 1 && page > 1) {
        setPage((current) => Math.max(1, current - 1));
      }
    } catch {
      // Keep the dialog open so the user can see/retry the deletion.
    }
  };

  const handleSearchChange = (value: string) => {
    setFilters((current) => ({
      ...current,
      search: value,
    }));

    setPage(1);
  };

  const handleActiveChange = (value: DailyUsageSentenceActiveFilter) => {
    setFilters((current) => ({
      ...current,
      activation: value,
    }));

    setPage(1);
  };

  const handleVerifiedChange = (value: DailyUsageSentenceVerifiedFilter) => {
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

  const handleDeleteDialogChange = (open: boolean) => {
    if (deleteMutation.isPending) {
      return;
    }

    setIsDeleteDialogOpen(open);

    if (!open) {
      setDeleteSentence(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <LoadingState message="Loading..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Daily Usage Sentences</h2>

          <p className="text-sm text-muted-foreground">
            Manage daily usage sentences and their translations.
          </p>
        </div>

        <Button onClick={handleCreate}>
          <Plus className="mr-2 size-4" />
          Add Sentence
        </Button>
      </div>

      <DailyUsageSentenceListToolbar
        filters={filters}
        onSearchChange={handleSearchChange}
        onActiveChange={handleActiveChange}
        onVerifiedChange={handleVerifiedChange}
        onReset={handleReset}
      />

      <DailyUsageSentenceDataTable
        data={sentences}
        onEdit={handleEdit}
        onManageTranslations={handleManageTranslations}
        onDelete={handleDelete}
      />

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={
                pagination.page <= 1 || isFetching || deleteMutation.isPending
              }
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={
                pagination.page >= pagination.totalPages ||
                isFetching ||
                deleteMutation.isPending
              }
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <DailyUsageSentenceTranslationsDrawer
        open={isTranslationDialogOpen}
        onOpenChange={(open) => {
          setIsTranslationDialogOpen(open);

          if (!open) {
            setTranslationSentenceId(null);
          }
        }}
        sentenceId={translationSentenceId}
      />

      <DeleteAlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
        onConfirm={handleDeleteConfirm}
        title="Delete daily usage sentence?"
        description="This action cannot be undone. The sentence and its associated translations and categories will be removed."
        itemName={deleteSentence?.slug ?? "this sentence"}
        confirmLabel="Delete Sentence"
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
