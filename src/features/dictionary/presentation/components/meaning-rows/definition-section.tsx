"use client";

import { BookOpen, Plus, Trash2 } from "lucide-react";

import { Button } from "../../../../../shared/components/ui/button";
import { Input } from "../../../../../shared/components/ui/input";
import { Textarea } from "../../../../../shared/components/ui/textarea";

import type { DefinitionItem, DefinitionUpdate } from "./meaning.types";

interface DefinitionsSectionProps {
  definitions: DefinitionItem[];
  onAdd: () => void;
  onUpdate: (index: number, partial: DefinitionUpdate) => void;
  onRemove: (index: number) => void;
}

export function DefinitionsSection({
  definitions,
  onAdd,
  onUpdate,
  onRemove,
}: DefinitionsSectionProps) {
  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
          <BookOpen className="h-3.5 w-3.5 text-zinc-500" />

          <span>Definitions ({definitions.length})</span>
        </div>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onAdd}
          className="h-7 text-xs text-blue-600"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Definition
        </Button>
      </div>

      {definitions.map((definition, index) => (
        <div
          key={index}
          className="space-y-2 rounded-md border border-zinc-200 bg-zinc-50/60 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-600">
              Definition #{index + 1}
            </span>

            {definitions.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>

          <Textarea
            value={definition.text}
            onChange={(event) =>
              onUpdate(index, {
                text: event.target.value,
              })
            }
            placeholder="Explain the meaning clearly..."
            className="min-h-13.75 text-xs"
          />

          <Input
            value={definition.usageNote ?? ""}
            onChange={(event) =>
              onUpdate(index, {
                usageNote: event.target.value,
              })
            }
            placeholder="Usage note (e.g. Formal, Medical, Slang)"
            className="text-xs"
          />
        </div>
      ))}
    </div>
  );
}
