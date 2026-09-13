"use client";

import { Globe2, Plus } from "lucide-react";

import { Button } from "../../../../../shared/components/ui/button";

import type { TranslationItem, TranslationUpdate } from "./meaning.types";
import { TranslationRow } from "./translation-row";
import type { Language } from "../../../../language/domain/types/language.type";

interface TranslationsSectionProps {
  translations: TranslationItem[];
  languages: Language[];
  sourceLanguageId: string;
  onAdd: () => void;
  onUpdate: (index: number, partial: TranslationUpdate) => void;
  onRemove: (index: number) => void;
}

export function TranslationsSection({
  translations,
  languages,
  sourceLanguageId,
  onAdd,
  onUpdate,
  onRemove,
}: TranslationsSectionProps) {
  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
          <Globe2 className="h-3.5 w-3.5 text-emerald-600" />

          <span>Cross-Language Translations ({translations.length})</span>
        </div>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onAdd}
          className="h-7 text-xs text-emerald-600"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Translation
        </Button>
      </div>

      {translations.length === 0 ? (
        <p className="text-xs italic text-zinc-400">
          No translations linked for this sense yet.
        </p>
      ) : (
        <div className="space-y-2">
          {translations.map((translation, index) => (
            <TranslationRow
              key={translation.clientKey ?? `translation-${index}`}
              translation={translation}
              index={index}
              languages={languages}
              sourceLanguageId={sourceLanguageId}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
