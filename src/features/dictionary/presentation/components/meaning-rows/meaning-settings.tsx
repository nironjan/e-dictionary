"use client";

import { Switch } from "../../../../../shared/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../shared/components/ui/select";
import { Label } from "../../../../../shared/components/ui/label";

import { PartOfSpeech } from "../../../domain/types/enums/word.enum.types";
import type { MeaningItem } from "./meaning.types";

interface MeaningSettingsProps {
  meaning: MeaningItem;
  onChange: (partial: Partial<MeaningItem>) => void;
}

export function MeaningSettings({ meaning, onChange }: MeaningSettingsProps) {
  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
      <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-zinc-700">
            Part of Speech
          </label>

          <Select
            value={meaning.partOfSpeech}
            onValueChange={(value) => {
              if (value !== null) {
                onChange({
                  partOfSpeech: value as PartOfSpeech,
                });
              }
            }}
          >
            <SelectTrigger className="w-full text-xs capitalize">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {Object.values(PartOfSpeech).map((pos) => (
                <SelectItem key={pos} value={pos} className="capitalize">
                  {pos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4">
          <Label>IsArchaic</Label>

          <Switch
            checked={meaning.isArchaic ?? false}
            onCheckedChange={(isArchaic) => onChange({ isArchaic })}
          />
        </div>
      </div>
    </div>
  );
}
