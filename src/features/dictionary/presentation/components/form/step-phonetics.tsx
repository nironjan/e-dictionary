"use client";

import { Plus, Star, Trash2, Volume2 } from "lucide-react";
import { Button } from "../../../../../shared/components/ui/button";
import type { CreateWordFormData } from "../../../domain/schema/word.schema";
import {
  Accent,
  PhoneticType,
} from "../../../domain/types/enums/word.enum.types";
import { Input } from "../../../../../shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../shared/components/ui/select";

interface StepPhoneticsProps {
  formData: CreateWordFormData;
  onChange: (updated: Partial<CreateWordFormData>) => void;
}

type PhoneticItem = NonNullable<CreateWordFormData["phonetics"]>[number];

export function StepPhonetics({ formData, onChange }: StepPhoneticsProps) {
  const phonetics = formData.phonetics || [];

  const handleAddPhonetic = () => {
    const newPhonetic: PhoneticItem = {
      text: "",
      type: PhoneticType.IPA,
      accent: Accent.GENERIC,
      audioUrl: "",
      isPrimary: phonetics.length === 0,
      sortOrder: phonetics.length,
    };
    onChange({ phonetics: [...phonetics, newPhonetic] });
  };

  const handleUpdatePhonetic = (
    index: number,
    partial: Partial<PhoneticItem>,
  ) => {
    const updated = [...phonetics];
    if (partial.isPrimary) {
      // make sure only one is primary
      updated.forEach((p, i) => {
        p.isPrimary = i === index;
      });
    }
    updated[index] = { ...updated[index], ...partial };
    onChange({ phonetics: updated });
  };

  const handleRemovePhonetic = (index: number) => {
    const updated = phonetics.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((p) => p.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange({ phonetics: updated });
  };

  return (
    <div className="space-y-4 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Phonetics & Pronunciation
          </h4>
          <p className="text-xs text-zinc-500">
            Add IPA notation, localized accents, and audio recording links.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddPhonetic}
          className="h-8 gap-1 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Phonetic</span>
        </Button>
      </div>

      {phonetics.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-200 p-8 text-center text-zinc-400 text-xs">
          No phonetic transcriptions added yet. Click &quot;Add Phonetic&quot;
          above to add IPA or audio.
        </div>
      ) : (
        <div className="space-y-3">
          {phonetics.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-3.5 transition-all ${
                p.isPrimary
                  ? "border-zinc-400 bg-zinc-50/70 shadow-xs"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-700">
                    #{idx + 1}
                  </span>
                  {p.isPrimary && (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                      <Star className="h-2.5 w-2.5 fill-amber-600" /> Primary
                      Pronunciation
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!p.isPrimary && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[11px]"
                      onClick={() =>
                        handleUpdatePhonetic(idx, { isPrimary: true })
                      }
                    >
                      Make Primary
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-700"
                    onClick={() => handleRemovePhonetic(idx)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                    Transcription (e.g. /əˈtræktɪv/){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={p.text}
                    onChange={(e) =>
                      handleUpdatePhonetic(idx, { text: e.target.value })
                    }
                    placeholder="/ˈatractive/"
                    className="font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                    Type
                  </label>
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-zinc-700">
                      Type
                    </label>

                    <Select
                      value={p.type || PhoneticType.IPA}
                      onValueChange={(value) => {
                        if (value !== null) {
                          handleUpdatePhonetic(idx, {
                            type: value as PhoneticType,
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {Object.values(PhoneticType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-zinc-700">
                      Accent / Dialect
                    </label>

                    <Select
                      value={p.accent || Accent.GENERIC}
                      onValueChange={(value) => {
                        if (value !== null) {
                          handleUpdatePhonetic(idx, {
                            accent: value as Accent,
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {Object.values(Accent).map((accent) => (
                          <SelectItem key={accent} value={accent}>
                            {accent.charAt(0).toUpperCase() + accent.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="md:col-span-4">
                  <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                    Audio Pronunciation URL (Optional)
                  </label>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={p.audioUrl || ""}
                      onChange={(e) =>
                        handleUpdatePhonetic(idx, { audioUrl: e.target.value })
                      }
                      placeholder="https://cdn.example.com/audio/attractive.mp3"
                      className="text-xs font-mono"
                    />
                    {p.audioUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            new Audio(p.audioUrl!).play();
                          } catch {}
                        }}
                        className="p-2 rounded border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700"
                        title="Test Audio"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
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
