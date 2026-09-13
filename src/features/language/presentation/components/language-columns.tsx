"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Check, CircleX } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";

import type { Language } from "../../domain/types/language.type";
import type { languageTableFeatures } from "./language-table-config";
import { LanguageActions } from "./language-actions";

export const languageColumns: ColumnDef<
  typeof languageTableFeatures,
  Language
>[] = [
  {
    accessorKey: "name",
    header: "Language",
    cell: ({ row }) => {
      const language = row.original;

      return (
        <div className="flex flex-col">
          <span className="font-medium">{language.name}</span>

          <span className="text-xs text-muted-foreground">{language.slug}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <Badge variant="secondary" className="uppercase">
        {row.original.code}
      </Badge>
    ),
  },

  {
    accessorKey: "nativeName",
    header: "Native Name",
    cell: ({ row }) => <span>{row.original.nativeName || "—"}</span>,
  },

  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isActive;

      return isActive ? (
        <Badge variant="outline" className="gap-1">
          <Check className="size-3" />
          Active
        </Badge>
      ) : (
        <Badge variant="destructive" className="gap-1">
          <CircleX className="size-3" />
          Inactive
        </Badge>
      );
    },
  },

  {
    accessorKey: "isRtl",
    header: "Direction",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.isRtl ? "RTL" : "LTR"}</span>
    ),
  },

  {
    accessorKey: "sortOrder",
    header: "Order",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.sortOrder}
      </span>
    ),
  },

  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => {
      const updatedAt = new Date(row.original.updatedAt);

      return (
        <span className="text-sm text-muted-foreground">
          {updatedAt.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      );
    },
  },

  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const language = row.original;

      return <LanguageActions language={language} />;
    },
  },
];
