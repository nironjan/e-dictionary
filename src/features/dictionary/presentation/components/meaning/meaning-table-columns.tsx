"use client";

import { CheckCircle2, Circle, Loader2, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { WordMeaning } from "../../../domain/types/word.types";
import type { meaningTableFeatures } from "../meaning-table-config";
import { Badge } from "../../../../../shared/components/ui/badge";
import { Button } from "../../../../../shared/components/ui/button";

interface MeaningTableColumnsOptions {
  verifyingMeaningId: string | null;
  deletingMeaningId: string | null;
  onToggleVerification: (meaning: WordMeaning) => void;
  onDelete: (meaning: WordMeaning) => void;
}

export function createMeaningTableColumns({
  verifyingMeaningId,
  deletingMeaningId,
  onToggleVerification,
  onDelete,
}: MeaningTableColumnsOptions): ColumnDef<
  typeof meaningTableFeatures,
  WordMeaning
>[] {
  return [
    {
      accessorKey: "partOfSpeech",
      header: "Part of Speech",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-[10px] uppercase">
          {row.original.partOfSpeech}
        </Badge>
      ),
    },
    {
      id: "verification",
      header: "Status",
      cell: ({ row }) => {
        const meaning = row.original;
        const verified = meaning.isVerified;
        const isUpdating = verifyingMeaningId === meaning.id;

        return (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isUpdating || deletingMeaningId === meaning.id}
            onClick={() => onToggleVerification(meaning)}
            className={
              verified
                ? "h-7 gap-1.5 px-2 text-xs text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                : "h-7 gap-1.5 px-2 text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
            }
          >
            {isUpdating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : verified ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <Circle className="h-3 w-3" />
            )}

            {verified ? "Verified" : "Unverified"}
          </Button>
        );
      },
    },

    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const meaning = row.original;
        const isDeleting = deletingMeaningId === meaning.id;
        const isVerifying = verifyingMeaningId === meaning.id;

        return (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isDeleting || isVerifying}
            onClick={() => onDelete(meaning)}
            title="Delete meaning"
            className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-700"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </Button>
        );
      },
    },
  ];
}
