"use client";

import { Plus, Quote } from "lucide-react";

import { Button } from "../../../../../shared/components/ui/button";

import type { ExampleItem, ExampleUpdate } from "./meaning.types";
import { ExampleRow } from "./example-row";
import type { Language } from "../../../../language/domain/types/language.type";

interface ExamplesSectionProps {
  examples: ExampleItem[];
  languages: Language[];
  onAdd: () => void;
  onUpdate: (index: number, partial: ExampleUpdate) => void;
  onRemove: (index: number) => void;
}

export function ExamplesSection({
  examples,
  languages,
  onAdd,
  onUpdate,
  onRemove,
}: ExamplesSectionProps) {
  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
          <Quote className="h-3.5 w-3.5 text-zinc-500" />
          <span>Examples ({examples.length})</span>
        </div>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onAdd}
          className="h-7 text-xs text-blue-600"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Example
        </Button>
      </div>

      {examples.length === 0 ? (
        <div className="rounded-md border border-dashed border-zinc-200 px-3 py-5 text-center text-xs text-zinc-500">
          No examples added yet.
        </div>
      ) : (
        <div className="space-y-2">
          {examples.map((example, index) => (
            <ExampleRow
              key={`${index}-${example.text}`}
              example={example}
              index={index}
              languages={languages}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
