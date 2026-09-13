"use client";

import { History, Plus, Trash2 } from "lucide-react";
import { Button } from "../../../../../shared/components/ui/button";
import type { CreateWordFormData } from "../../../domain/schema/word.schema";
import { Input } from "../../../../../shared/components/ui/input";
import { Textarea } from "../../../../../shared/components/ui/textarea";

interface StepEtymologiesProps {
  formData: CreateWordFormData;
  onChange: (updated: Partial<CreateWordFormData>) => void;
}

type EtymologyItem = NonNullable<CreateWordFormData["etymologies"]>[number];

export function StepEtymologies({ formData, onChange }: StepEtymologiesProps) {
  const etymologies = formData.etymologies || [];

  const handleAddEtymology = () => {
    const newEtym: EtymologyItem = {
      origin: "",
      originWord: "",
      originLanguage: "",
      description: "",
      sortOrder: etymologies.length,
    };
    onChange({ etymologies: [...etymologies, newEtym] });
  };

  const handleUpdate = (idx: number, partial: Partial<EtymologyItem>) => {
    const updated = [...etymologies];
    updated[idx] = { ...updated[idx], ...partial };
    onChange({ etymologies: updated });
  };

  const handleRemove = (idx: number) => {
    onChange({ etymologies: etymologies.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Etymology & Historical Roots
          </h4>
          <p className="text-xs text-zinc-500">
            Record language origins, cognates, and chronological derivation.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddEtymology}
          className="h-8 gap-1 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Origin</span>
        </Button>
      </div>

      {etymologies.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-200 p-8 text-center text-zinc-400 text-xs">
          No etymological records provided. Optional, but helpful for historical
          linguistics.
        </div>
      ) : (
        <div className="space-y-3">
          {etymologies.map((etym, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-800">
                  <History className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Origin Record #{idx + 1}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Origin Root <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={etym.origin}
                    onChange={(e) =>
                      handleUpdate(idx, { origin: e.target.value })
                    }
                    placeholder="e.g. Middle French attractif"
                    className="text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Origin Word / Lemma
                  </label>
                  <Input
                    value={etym.originWord || ""}
                    onChange={(e) =>
                      handleUpdate(idx, { originWord: e.target.value })
                    }
                    placeholder="e.g. attractivus"
                    className="text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Source Language
                  </label>
                  <Input
                    value={etym.originLanguage || ""}
                    onChange={(e) =>
                      handleUpdate(idx, { originLanguage: e.target.value })
                    }
                    placeholder="e.g. Latin, Sanskrit, Proto-Indo-European"
                    className="text-xs"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Detailed Evolution History
                  </label>
                  <Textarea
                    value={etym.description || ""}
                    onChange={(e) =>
                      handleUpdate(idx, { description: e.target.value })
                    }
                    placeholder="Describe semantic shifts, affixes, or historical transitions..."
                    className="text-xs min-h-15"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
