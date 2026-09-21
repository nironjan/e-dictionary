"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Tags,
  Image as ImageIcon,
  Trash2,
  Languages,
  Edit2,
} from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

import type { Category } from "../../domain/types/category.type";
import type { categoryTableFeatures } from "./category-table-config";

interface CategoryTableColumnsOptions {
  onEdit: (category: Category) => void;
  onManageTranslations: (category: Category) => void;
  onDelete: (category: Category) => void;
  isDeleting: boolean;
}

export function getCategoryTableColumns({
  onEdit,
  onManageTranslations,
  onDelete,
  isDeleting,
}: CategoryTableColumnsOptions): ColumnDef<
  typeof categoryTableFeatures,
  Category
>[] {
  return [
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
      cell: ({ row }) => (
        <div className="text-sm font-semibold">{row.original.name}</div>
      ),
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
            onClick={() => onManageTranslations(category)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
          >
            <Tags className="size-3.5" />
            <span>Manage categories</span>
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
      cell: ({ row }) => {
        const category = row.original;

        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={() => onManageTranslations(category)}
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
              onClick={() => onEdit(category)}
              title="Edit Category"
            >
              <Edit2 className="size-3.5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(category)}
              disabled={isDeleting}
              title="Delete Category"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];
}
