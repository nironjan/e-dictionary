"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import { DeleteAlertDialog } from "@/shared/components/common/delete-alert-dialog";

import { useCategories } from "../../application/queries/category.query";
import { useDeleteCategory } from "../../application/mutation/category.mutation";

import type { Category } from "../../domain/types/category.type";
import type {
  AdminCategoryListFilters,
  CategoryActiveFilter,
} from "../../domain/types/admin-category-list.type";

import { getCategoryTableColumns } from "./category-table-columns";
import { CategoryListToolbar } from "./category-list-toolbar";
import { CategoryTranslationsDrawer } from "./category-translation-drawer";
import { CategoryListTable } from "./category-table";

const PAGE_SIZE = 20;

const DEFAULT_FILTERS: AdminCategoryListFilters = {
  search: "",
  activation: "all",
};

export function CategoryList() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [filters, setFilters] =
    useState<AdminCategoryListFilters>(DEFAULT_FILTERS);

  const [translationsOpen, setTranslationsOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const query = useCategories({
    page,
    limit: PAGE_SIZE,
    search: filters.search.trim() || undefined,
    isActive:
      filters.activation === "all"
        ? undefined
        : filters.activation === "active",
  });

  const deleteMutation = useDeleteCategory();

  const categories = query.data?.data ?? [];
  const pagination = query.data?.pagination;

  const handleCreate = useCallback(() => {
    router.push("/dashboard/categories/create");
  }, [router]);

  const handleEdit = useCallback(
    (category: Category) => {
      router.push(`/dashboard/categories/${category.id}/edit`);
    },
    [router],
  );

  const handleManageTranslations = useCallback((category: Category) => {
    setSelectedCategoryId(category.id);
    setTranslationsOpen(true);
  }, []);

  const handleDelete = useCallback((category: Category) => {
    setDeleteCategory(category);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteCategory) {
      return;
    }

    await deleteMutation.mutateAsync(deleteCategory.id);

    setDeleteCategory(null);

    if (categories.length === 1 && page > 1) {
      setPage((currentPage) => currentPage - 1);
    }
  }, [categories.length, deleteCategory, deleteMutation, page]);

  const handleSearchChange = useCallback((value: string) => {
    setFilters((current) => ({
      ...current,
      search: value,
    }));

    setPage(1);
  }, []);

  const handleActiveChange = useCallback((value: CategoryActiveFilter) => {
    setFilters((current) => ({
      ...current,
      activation: value,
    }));

    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  const columns = useMemo(
    () =>
      getCategoryTableColumns({
        onEdit: handleEdit,
        onManageTranslations: handleManageTranslations,
        onDelete: handleDelete,
        isDeleting: deleteMutation.isPending,
      }),
    [
      handleEdit,
      handleManageTranslations,
      handleDelete,
      deleteMutation.isPending,
    ],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">categories</h1>

          <p className="text-muted-foreground">
            Manage category and their translations.
          </p>
        </div>

        <Button type="button" onClick={handleCreate}>
          Add Category
        </Button>
      </div>

      <CategoryListToolbar
        filters={filters}
        onSearchChange={handleSearchChange}
        onActiveChange={handleActiveChange}
        onReset={handleReset}
      />

      <CategoryListTable
        categories={categories}
        columns={columns}
        isLoading={query.isLoading}
      />

      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1 || query.isFetching}
              onClick={() => {
                setPage((currentPage) => Math.max(1, currentPage - 1));
              }}
            >
              Previous
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages || query.isFetching}
              onClick={() => {
                setPage((currentPage) => currentPage + 1);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <CategoryTranslationsDrawer
        categoryId={selectedCategoryId}
        open={translationsOpen}
        onOpenChange={(open) => {
          setTranslationsOpen(open);

          if (!open) {
            setSelectedCategoryId(null);
          }
        }}
      />

      <DeleteAlertDialog
        open={deleteCategory !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteCategory(null);
          }
        }}
        itemName={deleteCategory?.name}
        title="Delete category?"
        description="This category and its associated data will be permanently deleted."
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
