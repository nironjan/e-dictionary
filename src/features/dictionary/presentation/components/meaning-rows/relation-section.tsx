"use client";

import { useState } from "react";
import { Link2, Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import type { RelationItem } from "./meaning.types";
import { RelationRow } from "./relation-row";
import { RelationPickerModal } from "../meaning/relation-picker-modal";

interface RelationsSectionProps {
  relations: RelationItem[];
  searchLanguageCode: string;
  ownerMeaningId?: string;
  onAdd: (relation: RelationItem) => void;
  onRemove: (index: number) => void;
}

export function RelationsSection({
  relations,
  searchLanguageCode,
  ownerMeaningId,
  onAdd,
  onRemove,
}: RelationsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
          <Link2 className="h-3.5 w-3.5 text-zinc-500" />
          <span>Relations ({relations.length})</span>
        </div>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setModalOpen(true)}
          disabled={!searchLanguageCode}
          className="h-7 text-xs text-blue-600"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Relation
        </Button>
      </div>

      {relations.length === 0 ? (
        <div className="rounded-md border border-dashed border-zinc-200 px-3 py-5 text-center text-xs text-zinc-500">
          No relations added yet. Link this sense to synonyms or antonyms.
        </div>
      ) : (
        <div className="space-y-1.5">
          {relations.map((relation, index) => (
            <RelationRow
              key={
                relation.id ??
                `${relation.relationType}-${relation.relatedMeaningId}-${index}`
              }
              relation={relation}
              onRemove={() => onRemove(index)}
            />
          ))}
        </div>
      )}

      <RelationPickerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        languageCode={searchLanguageCode}
        ownerMeaningId={ownerMeaningId}
        excludeMeaningIds={relations.map((r) => r.relatedMeaningId)}
        onConfirm={onAdd}
      />
    </div>
  );
}
