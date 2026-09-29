"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit2, Languages, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import type { DailyUsageSentence } from "../../domain/types/daily-usage-sentence.type";
import type { dailySentenceTableFeatures } from "./daily-usage-sentence-table.config";

interface DailyUsageSentenceColumnsOptions {
  onEdit: (sentence: DailyUsageSentence) => void;
  onManageTranslations: (sentence: DailyUsageSentence) => void;
  onDelete: (sentence: DailyUsageSentence) => void;
}

export function getDailyUsageSentenceColumns({
  onEdit,
  onManageTranslations,
  onDelete,
}: DailyUsageSentenceColumnsOptions): ColumnDef<
  typeof dailySentenceTableFeatures,
  DailyUsageSentence
>[] {
  return [
    {
      id: "sentence",
      header: "Sentence",
      cell: ({ row }) => {
        const translations = row.original.translations;

        const englishTranslation = translations.find(
          (translation) => translation.languageCode === "en",
        );

        return (
          <div className="min-w-70 max-w-125 space-y-1">
            <div className="font-medium">{englishTranslation?.text ?? "—"}</div>
          </div>
        );
      },
    },

    {
      id: "translations",
      header: "Languages",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.translations.map((translation) => (
            <span
              key={translation.id}
              className="rounded-md bg-muted px-2 py-1 text-xs font-medium"
            >
              {translation.languageCode}
            </span>
          ))}
        </div>
      ),
    },

    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => (
        <span
          className={
            row.original.isActive
              ? "text-sm font-medium"
              : "text-sm text-muted-foreground"
          }
        >
          {row.original.isActive ? "Yes" : "No"}
        </span>
      ),
    },

    {
      accessorKey: "isVerified",
      header: "Verified",
      cell: ({ row }) => (
        <span
          className={
            row.original.isVerified
              ? "text-sm font-medium"
              : "text-sm text-muted-foreground"
          }
        >
          {row.original.isVerified ? "Yes" : "No"}
        </span>
      ),
    },

    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => {
        const date = new Date(row.original.updatedAt);

        return (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {date.toLocaleDateString()}
          </span>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const sentence = row.original;

        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={() => onManageTranslations(sentence)}
              title="Manage Translations"
            >
              <Languages className="size-3" />
              <span>Translations</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(sentence)}
              title="Edit Sentence"
            >
              <Edit2 className="size-3.5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(sentence)}
              title="Delete Sentence"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];
}
