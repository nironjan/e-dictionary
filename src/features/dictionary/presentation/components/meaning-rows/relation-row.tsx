"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { RelationType } from "../../../domain/types/enums/word.enum.types";
import type { RelationItem } from "./meaning.types";

interface RelationRowProps {
  relation: RelationItem;
  onRemove: () => void;
}

export function RelationRow({ relation, onRemove }: RelationRowProps) {
  const isSynonym = relation.relationType === RelationType.SYNONYM;

  return (
    <div className="flex items-center gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2">
      {/* Type badge */}
      <span
        className={
          isSynonym
            ? "shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700"
            : "shrink-0 rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-rose-700"
        }
      >
        {isSynonym ? "Syn" : "Ant"}
      </span>

      {/* Word */}
      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        {relation.relatedWordText ?? relation.relatedMeaningId}
      </span>

      {/* Part of speech */}
      <span className="shrink-0 text-xs capitalize text-zinc-500">
        {relation.relatedPartOfSpeech ?? "—"}
      </span>

      {/* Remove */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-7 w-7 shrink-0 p-0 text-zinc-400 hover:bg-red-50 hover:text-red-600"
        aria-label="Remove relation"
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}
