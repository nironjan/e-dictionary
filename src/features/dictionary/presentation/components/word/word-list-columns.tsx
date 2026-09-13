"use client";

import { useMemo } from "react";
import {
  ArrowUpDown,
  BookOpenCheck,
  CheckCircle2,
  Edit2,
  Eye,
  Trash2,
  Volume2,
  XCircle,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import type { WordSummary } from "../../../domain/types/word.types";

import { Badge } from "../../../../../shared/components/ui/badge";
import { Button } from "../../../../../shared/components/ui/button";
import type { wordTableFeatures } from "../word-table-config";

interface WordListColumnsOptions {
  onView: (word: WordSummary) => void;
  onEdit: (word: WordSummary) => void;
  onViewMeanings: (word: WordSummary) => void;
  onToggleVerify: (word: WordSummary) => void;
  onDelete: (word: WordSummary) => void;
}

export function useWordListColumns({
  onView,
  onEdit,
  onViewMeanings,
  onToggleVerify,
  onDelete,
}: WordListColumnsOptions): ColumnDef<typeof wordTableFeatures, WordSummary>[] {
  return useMemo(
    () => [
      {
        accessorKey: "text",

        header: ({ column }) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 cursor-pointer gap-1 px-0 font-semibold text-zinc-600 hover:bg-transparent hover:text-zinc-900"
          >
            Word Headword
            <ArrowUpDown className="h-3 w-3" />
          </Button>
        ),

        cell: ({ row }) => {
          const word = row.original;

          const primaryPhonetic =
            word.phonetics?.find((phonetic) => phonetic.isPrimary) ??
            word.phonetics?.[0];

          return (
            <div className="flex items-center gap-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="cursor-pointer text-sm font-bold text-zinc-900 hover:underline"
                    onClick={() => onView(word)}
                  >
                    {word.text}
                  </button>

                  {primaryPhonetic && (
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-500">
                      {primaryPhonetic.text}
                    </span>
                  )}

                  {primaryPhonetic?.audioUrl && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        const audio = new Audio(primaryPhonetic.audioUrl);

                        void audio.play();
                      }}
                      className="p-0.5 text-zinc-400 hover:text-zinc-800"
                      title="Pronounce"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="mt-0.5 font-mono text-[11px] text-zinc-400">
                  ID: {word.id.slice(0, 8)}...
                </div>
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "language",
        header: "Locale",

        cell: ({ row }) => {
          const language = row.original.language;

          return (
            <Badge variant="outline" className="gap-1 font-mono text-[11px]">
              <span className="font-bold">{language?.code ?? "en"}</span>

              <span className="font-normal text-zinc-400">
                ({language?.name ?? "English"})
              </span>
            </Badge>
          );
        },
      },

      {
        accessorKey: "categories",
        header: "Categories",

        cell: ({ row }) => {
          const categories = row.original.categories ?? [];

          if (categories.length === 0) {
            return <span className="text-xs italic text-zinc-400">None</span>;
          }

          return (
            <div className="flex max-w-50 flex-wrap gap-1">
              {categories.slice(0, 2).map((category) => (
                <Badge
                  key={category.id}
                  variant="secondary"
                  className="text-[10px]"
                >
                  {category.name}
                </Badge>
              ))}

              {categories.length > 2 && (
                <Badge variant="secondary" className="text-[10px]">
                  +{categories.length - 2}
                </Badge>
              )}
            </div>
          );
        },
      },

      {
        accessorKey: "meanings",
        header: "Senses & Lexical Scope",

        cell: ({ row }) => {
          const meanings = row.original.meanings ?? [];

          const posList = Array.from(
            new Set(meanings.map((meaning) => meaning.partOfSpeech)),
          );

          const translationsCount = meanings.reduce(
            (total, meaning) => total + (meaning.translations?.length ?? 0),
            0,
          );

          return (
            <div className="space-y-0.5">
              <div className="flex flex-wrap gap-1">
                {posList.map((pos) => (
                  <span
                    key={pos}
                    className="inline-block rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-zinc-700"
                  >
                    {pos}
                  </span>
                ))}
              </div>

              <div className="text-[11px] text-zinc-500">
                {meanings.length} {meanings.length === 1 ? "sense" : "senses"} •{" "}
                {translationsCount}{" "}
                {translationsCount === 1 ? "translation" : "translations"}
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "isVerified",
        header: "Verification",

        cell: ({ row }) => {
          const word = row.original;
          const verified = word.isVerified;

          return (
            <button
              type="button"
              onClick={() => onToggleVerify(word)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                verified
                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
              title="Click to toggle verification status"
            >
              {verified ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}

              <span>{verified ? "Verified" : "Unverified"}</span>
            </button>
          );
        },
      },

      {
        id: "actions",
        header: "Actions",
        enableSorting: false,

        cell: ({ row }) => {
          const word = row.original;

          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                onClick={() => onViewMeanings(word)}
                title="Review & Verify Meanings"
              >
                <BookOpenCheck className="h-3.5 w-3.5" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-600 hover:text-zinc-900"
                onClick={() => onView(word)}
                title="View Word Details"
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-600 hover:text-zinc-900"
                onClick={() => onEdit(word)}
                title="Edit in Multi-step Form"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-700"
                onClick={() => onDelete(word)}
                title="Delete Word"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onView, onEdit, onViewMeanings, onToggleVerify, onDelete],
  );
}
