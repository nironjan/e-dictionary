"use client";

import { useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import type { Language } from "../../domain/types/language.type";
import { Button } from "@/shared/components/ui/button";
import { LanguagesActions } from "./language-actions";
import type { languageTableFeatures } from "./language-table-config";

interface LanguagesColumnsOptions {
  onEdit: (language: Language) => void;
  onDelete: (language: Language) => void;
}

export function useLanguagesColumns({
  onEdit,
  onDelete,
}: LanguagesColumnsOptions): ColumnDef<
  typeof languageTableFeatures,
  Language
>[] {
  return useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 cursor-pointer gap-1 px-0 font-semibold text-zinc-600 hover:bg-transparent hover:text-zinc-900"
          >
            Name
            <ArrowUpDown className="size-3" />
          </Button>
        ),
        cell: ({ row }) => {
          const language = row.original;

          return (
            <div className="min-w-0">
              <div className="font-medium">{language.name}</div>
            </div>
          );
        },
      },

      {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.code}</span>
        ),
      },

      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const isActive = row.original.isActive;

          return (
            <span
              className={
                isActive
                  ? "text-sm font-medium"
                  : "text-muted-foreground text-sm"
              }
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },

      {
        accessorKey: "isRtl",
        header: "Direction",
        cell: ({ row }) => <span>{row.original.isRtl ? "RTL" : "LTR"}</span>,
      },

      {
        accessorKey: "sortOrder",
        header: "Order",
        cell: ({ row }) => <span>{row.original.sortOrder}</span>,
      },

      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <LanguagesActions
            language={row.original}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ),
      },
    ],
    [onEdit, onDelete],
  );
}
