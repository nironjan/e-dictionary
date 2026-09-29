"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

import { APP_CONSTANTS } from "../../../../lib/constants/constants";

import { useDeleteSpecialExpressionMutation } from "../../application/mutations/use-delete-special-expression-mutation";
import { useSpecialExpressionsQuery } from "../../application/queries/use-special-expressions-query";

import type { SpecialExpressionListQuery } from "../../domain/types/special-expression-query.type";
import type { SpecialExpression } from "../../domain/types/special-expression.type";

import type {
  SpecialExpressionListFilters,
  SpecialExpressionVerifiedFilter,
} from "../../domain/types/special-expression-list.type";

import { DeleteAlertDialog } from "../../../../shared/components/common/delete-alert-dialog";
import { LoadingState } from "../../../../shared/components/common/loading-state";

import { SpecialExpressionDataTable } from "./special-expression-data-table";
import { SpecialExpressionTranslationsDrawer } from "./special-expression-translations-drawer";
import { SpecialExpressionListToolbar } from "./special-expression-toolbar";
import { SpecialExpressionVerificationDrawer } from "./special-expression-verification-drawer";

const DEFAULT_FILTERS: SpecialExpressionListFilters = {
  search: "",
  type: "all",
  verification: "all",
};

const DEFAULT_LIMIT = 20;

function filtersToQuery(
  filters: SpecialExpressionListFilters,
  page: number,
): SpecialExpressionListQuery {
  return {
    page,
    limit: DEFAULT_LIMIT,

    search: filters.search.trim() || undefined,

    type: filters.type === "all" ? undefined : filters.type,

    isVerified:
      filters.verification === "all"
        ? undefined
        : filters.verification === "verified",
  };
}

export function SpecialExpressionList() {
  const router = useRouter();

  const [filters, setFilters] =
    useState<SpecialExpressionListFilters>(DEFAULT_FILTERS);

  const [page, setPage] = useState(1);

  const [verificationExpressionId, setVerificationExpressionId] = useState<
    string | null
  >(null);

  const [isVerificationDialogOpen, setIsVerificationDialogOpen] =
    useState(false);

  const [translationExpressionId, setTranslationExpressionId] = useState<
    string | null
  >(null);

  const [isTranslationDialogOpen, setIsTranslationDialogOpen] = useState(false);

  const [deleteExpression, setDeleteExpression] =
    useState<SpecialExpression | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteMutation = useDeleteSpecialExpressionMutation();

  const query = filtersToQuery(filters, page);

  const { data, isLoading, isFetching } = useSpecialExpressionsQuery(query);

  const expressions = data?.data ?? [];
  const pagination = data?.pagination;

  const handleCreate = () => {
    router.push(APP_CONSTANTS.ROUTES.SPECIAL_EXPRESSIONS_CREATE);
  };

  const handleEdit = (expression: SpecialExpression) => {
    router.push(APP_CONSTANTS.ROUTES.SPECIAL_EXPRESSIONS_EDIT(expression.id));
  };

  const handleVerify = (expression: SpecialExpression) => {
    setVerificationExpressionId(expression.id);
    setIsVerificationDialogOpen(true);
  };

  const handleManageTranslations = (expression: SpecialExpression) => {
    setTranslationExpressionId(expression.id);
    setIsTranslationDialogOpen(true);
  };

  const handleDelete = (expression: SpecialExpression) => {
    setDeleteExpression(expression);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteExpression) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({
        id: deleteExpression.id,
      });

      setIsDeleteDialogOpen(false);
      setDeleteExpression(null);

      // If the deleted item was the only item on the current page,
      // move back one page.
      if (expressions.length === 1 && page > 1) {
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

  const handleTypeChange = (value: SpecialExpressionListFilters["type"]) => {
    setFilters((current) => ({
      ...current,
      type: value,
    }));

    setPage(1);
  };

  const handleVerifiedChange = (value: SpecialExpressionVerifiedFilter) => {
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
      setDeleteExpression(null);
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
          <h2 className="text-lg font-semibold">Special Expressions</h2>

          <p className="text-sm text-muted-foreground">
            Manage special expressions and their translations.
          </p>
        </div>

        <Button onClick={handleCreate}>
          <Plus className="mr-2 size-4" />
          Add Expression
        </Button>
      </div>

      <SpecialExpressionListToolbar
        filters={filters}
        onSearchChange={handleSearchChange}
        onTypeChange={handleTypeChange}
        onVerifiedChange={handleVerifiedChange}
        onReset={handleReset}
      />

      <SpecialExpressionDataTable
        data={expressions}
        onEdit={handleEdit}
        onManageTranslations={handleManageTranslations}
        onVerify={handleVerify}
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

      <SpecialExpressionVerificationDrawer
        open={isVerificationDialogOpen}
        onOpenChange={(open) => {
          setIsVerificationDialogOpen(open);

          if (!open) {
            setVerificationExpressionId(null);
          }
        }}
        expressionId={verificationExpressionId}
      />

      <SpecialExpressionTranslationsDrawer
        open={isTranslationDialogOpen}
        onOpenChange={(open) => {
          setIsTranslationDialogOpen(open);
          if (!open) {
            setTranslationExpressionId(null);
          }
        }}
        expressionId={translationExpressionId}
      />

      <DeleteAlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
        onConfirm={handleDeleteConfirm}
        title="Delete special expression?"
        description="This action cannot be undone. The expression and its associated translations and categories will be removed."
        itemName={deleteExpression?.expression ?? "this expression"}
        confirmLabel="Delete Expression"
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
