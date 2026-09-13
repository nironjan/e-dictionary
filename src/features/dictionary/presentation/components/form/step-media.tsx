"use client";

import { ImageIcon, Plus, Star, Trash2 } from "lucide-react";
import { Button } from "../../../../../shared/components/ui/button";
import type { CreateWordFormData } from "../../../domain/schema/word.schema";
import { Input } from "../../../../../shared/components/ui/input";

interface StepMediaProps {
  formData: CreateWordFormData;
  onChange: (updated: Partial<CreateWordFormData>) => void;
}

type MediaItem = NonNullable<CreateWordFormData["media"]>[number];

export function StepMedia({ formData, onChange }: StepMediaProps) {
  const mediaList = formData.media || [];

  const handleAddMedia = () => {
    const newMedia: MediaItem = {
      imageUrl: "",
      altText: "",
      mimeType: "image/jpeg",
      isPrimary: mediaList.length === 0,
      sortOrder: mediaList.length,
    };
    onChange({ media: [...mediaList, newMedia] });
  };

  const handleUpdate = (idx: number, partial: Partial<MediaItem>) => {
    const updated = [...mediaList];
    if (partial.isPrimary) {
      updated.forEach((m, i) => {
        m.isPrimary = i === idx;
      });
    }
    updated[idx] = { ...updated[idx], ...partial };
    onChange({ media: updated });
  };

  const handleRemove = (idx: number) => {
    const updated = mediaList.filter((_, i) => i !== idx);
    if (updated.length > 0 && !updated.some((m) => m.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange({ media: updated });
  };

  return (
    <div className="space-y-4 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Visual Media & Illustrations
          </h4>
          <p className="text-xs text-zinc-500">
            Provide pictures, diagrams, and visual concept cards.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddMedia}
          className="h-8 gap-1 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Media</span>
        </Button>
      </div>

      {mediaList.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-200 p-8 text-center text-zinc-400 text-xs">
          No media attached. Adding pictures improves retention for vocabulary
          learners.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mediaList.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-4 space-y-3 transition-colors ${
                item.isPrimary
                  ? "border-zinc-400 bg-zinc-50/70 shadow-xs"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-800">
                    Media #{idx + 1}
                  </span>
                  {item.isPrimary && (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                      <Star className="h-2.5 w-2.5 fill-amber-600" /> Primary
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {!item.isPrimary && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[11px]"
                      onClick={() => handleUpdate(idx, { isPrimary: true })}
                    >
                      Set Primary
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="text-red-500 hover:text-red-700 text-xs p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Preview Box */}
              <div className="flex gap-3 items-center">
                <div className="h-16 w-16 rounded-md border border-zinc-200 bg-zinc-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.altText || "Media"}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                      onError={(e) =>
                        ((e.target as HTMLElement).style.display = "none")
                      }
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-zinc-400" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                      Image Direct URL <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={item.imageUrl}
                      onChange={(e) =>
                        handleUpdate(idx, { imageUrl: e.target.value })
                      }
                      placeholder="https://images.unsplash.com/..."
                      className="text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                  Descriptive Alt Text
                </label>
                <Input
                  value={item.altText || ""}
                  onChange={(e) =>
                    handleUpdate(idx, { altText: e.target.value })
                  }
                  placeholder="e.g. Scenic mountain landscape at sunset"
                  className="text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
