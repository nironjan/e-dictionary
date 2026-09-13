"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  type ColumnDef,
  type SortingState,
  useTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Image as ImageIcon,
  Languages,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { useDeleteCategory } from "../../application/mutation/category.mutation";
import { useCategories } from "../../application/queries/category.query";
import type { Category } from "../../domain/types/category.type";
import { CategoryTranslationsDrawer } from "./category-translation-drawer";
import { categoryTableFeatures } from "./category-table-config";
import { useRouter } from "next/navigation";
import { APP_CONSTANTS } from "../../../../lib/constants/constants";
import { LoadingState } from "../../../../shared/components/common/loading-state";

const PAGE_SIZE = 20;

export function CategoryList() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [translationsDrawerOpen, setTranslationsDrawerOpen] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const { data: response, isLoading } = useCategories({
    page,
    limit: PAGE_SIZE,
  });

  const deleteMutation = useDeleteCategory();

  const categories = response?.data ?? [];

  const pagination = response?.pagination ?? {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  };

  const handleEdit = (category: Category) => {
    router.push(APP_CONSTANTS.ROUTES.CATEGORY_EDIT(category.id));
  };

  const handleCreate = () => {
    router.push(APP_CONSTANTS.ROUTES.CATEGORY_CREATE);
  };

  const handleManageTranslations = (category: Category) => {
    setSelectedCategoryId(category.id);
    setTranslationsDrawerOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete category "${name}"?`,
    );

    if (!confirmed) {
      return;
    }

    await deleteMutation.mutateAsync(id);
  };

  const columns = useMemo<ColumnDef<typeof categoryTableFeatures, Category>[]>(
    () => [
      {
        accessorKey: "image",
        header: "Visual",
        enableSorting: false,
        cell: ({ row }) => {
          const category = row.original;

          return (
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  referrerPolicy="no-referrer"
                  className="size-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <ImageIcon className="size-4 text-muted-foreground" />
              )}
            </div>
          );
        },
      },

      {
        accessorKey: "name",
        header: ({ column }) => {
          const sorted = column.getIsSorted();

          return (
            <button
              type="button"
              onClick={() => column.toggleSorting()}
              className="flex cursor-pointer items-center gap-1 font-semibold text-muted-foreground hover:text-foreground"
            >
              Category Name
              <ArrowUpDown className="size-3" />
              {sorted === "asc" && <span className="text-[10px]">↑</span>}
              {sorted === "desc" && <span className="text-[10px]">↓</span>}
            </button>
          );
        },
        cell: ({ row }) => {
          const category = row.original;

          return (
            <div>
              <div className="text-sm font-semibold">{category.name}</div>

              <div className="font-mono text-[11px] text-muted-foreground">
                ID: {category.id.slice(0, 8)}...
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "defaultLanguage",
        header: "Primary Language",
        enableSorting: false,
        cell: ({ row }) => {
          const language = row.original.defaultLanguage;

          return (
            <Badge variant="secondary" className="font-mono text-[11px]">
              {language?.name ?? "English"} ({language?.code ?? "en"})
            </Badge>
          );
        },
      },

      {
        accessorKey: "translations",
        header: "Translations",
        enableSorting: false,
        cell: ({ row }) => {
          const category = row.original;

          return (
            <button
              type="button"
              onClick={() => handleManageTranslations(category)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
            >
              <Languages className="size-3.5" />
              <span>Manage translations</span>
            </button>
          );
        },
      },

      {
        accessorKey: "isActive",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => {
          const isActive = row.original.isActive;

          return (
            <Badge
              variant={isActive ? "default" : "secondary"}
              className="text-[11px]"
            >
              {isActive ? "Active" : "Hidden"}
            </Badge>
          );
        },
      },

      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => {
          const category = row.original;

          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 gap-1 px-2 text-xs"
                onClick={() => handleManageTranslations(category)}
                title="Manage Translations"
              >
                <Languages className="size-3" />
                <span>Locales</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-foreground"
                onClick={() => handleEdit(category)}
                title="Edit Category"
              >
                <Edit2 className="size-3.5" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleDelete(category.id, category.name)}
                disabled={deleteMutation.isPending}
                title="Delete Category"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          );
        },
      },
    ],
    [deleteMutation.isPending],
  );

  const table = useTable({
    features: categoryTableFeatures,
    data: categories,
    columns,

    state: {
      sorting,
    },

    onSortingChange: setSorting,
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />

          <Input
            placeholder="Search categories..."
            value={globalFilter}
            onChange={(event) => {
              setGlobalFilter(event.target.value);
              setPage(1);
            }}
            className="h-9 pl-9 text-xs"
          />
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleCreate}
          className="shrink-0 gap-1.5"
        >
          <Plus className="size-3.5" />
          <span>New Category</span>
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-background shadow-xs">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  <LoadingState message="laoding..." />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-2 px-1 text-xs text-muted-foreground sm:flex-row">
        <span>
          Showing {categories.length} of {pagination.total} categories
        </span>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-2 text-xs"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeft className="mr-1 size-3.5" />
            Previous
          </Button>

          <span className="font-medium text-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-2 text-xs"
            disabled={page >= pagination.totalPages}
            onClick={() =>
              setPage((current) => Math.min(pagination.totalPages, current + 1))
            }
          >
            Next
            <ChevronRight className="ml-1 size-3.5" />
          </Button>
        </div>
      </div>

      <CategoryTranslationsDrawer
        open={translationsDrawerOpen}
        onOpenChange={(next) => {
          setTranslationsDrawerOpen(next);
          if (!next) {
            setSelectedCategoryId(null);
          }
        }}
        categoryId={selectedCategoryId}
      />
    </div>
  );
}
