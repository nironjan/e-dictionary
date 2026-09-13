"use client";

import { BookmarkCheck, ExternalLink, Plus, Trash2 } from "lucide-react";
import { Button } from "../../../../../shared/components/ui/button";
import type { CreateWordFormData } from "../../../domain/schema/word.schema";
import { SourceType } from "../../../domain/types/enums/word.enum.types";
import { Input } from "../../../../../shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../shared/components/ui/select";

interface StepSourcesProps {
  formData: CreateWordFormData;
  onChange: (updated: Partial<CreateWordFormData>) => void;
}

type SourceItem = NonNullable<CreateWordFormData["sources"]>[number];

export function StepSources({ formData, onChange }: StepSourcesProps) {
  const sources = formData.sources || [];

  const handleAddSource = () => {
    const newSource: SourceItem = {
      sourceName: "",
      sourceType: SourceType.DICTIONARY,
      sourceUrl: "",
    };
    onChange({ sources: [...sources, newSource] });
  };

  const handleUpdate = (idx: number, partial: Partial<SourceItem>) => {
    const updated = [...sources];
    updated[idx] = { ...updated[idx], ...partial };
    onChange({ sources: updated });
  };

  const handleRemove = (idx: number) => {
    onChange({ sources: sources.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Attribution & Sources
          </h4>
          <p className="text-xs text-zinc-500">
            Citations for lexicographic authority and copyright verification.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddSource}
          className="h-8 gap-1 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Source</span>
        </Button>
      </div>

      {sources.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-200 p-8 text-center text-zinc-400 text-xs">
          No bibliographic sources attached. Add references like Oxford
          Dictionary, Wiktionary, or field recordings.
        </div>
      ) : (
        <div className="space-y-3">
          {sources.map((src, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-zinc-200 bg-white p-3.5 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
                  <BookmarkCheck className="h-3.5 w-3.5 text-blue-600" />
                  <span>Reference #{idx + 1}</span>
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
                    Source Authority <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={src.sourceName}
                    onChange={(e) =>
                      handleUpdate(idx, { sourceName: e.target.value })
                    }
                    placeholder="e.g. Oxford English Dictionary, Bodo Sahitya Sabha"
                    className="text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Type
                  </label>
                  <Select
                    value={src.sourceType}
                    onValueChange={(value) => {
                      if (value !== null) {
                        handleUpdate(idx, {
                          sourceType: value as SourceType,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="text-xs capitalize">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {Object.values(SourceType).map((sourceType) => (
                        <SelectItem key={sourceType} value={sourceType}>
                          {sourceType.replace("_", " ").toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Reference URL
                  </label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      value={src.sourceUrl || ""}
                      onChange={(e) =>
                        handleUpdate(idx, { sourceUrl: e.target.value })
                      }
                      placeholder="https://..."
                      className="text-xs font-mono"
                    />
                    {src.sourceUrl && (
                      <a
                        href={src.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-zinc-400 hover:text-zinc-800"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
