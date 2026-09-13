"use client";

import { Trash2 } from "lucide-react";

import { Button } from "../../../../../shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../shared/components/ui/select";
import { Input } from "../../../../../shared/components/ui/input";
import { Switch } from "../../../../../shared/components/ui/switch";

import type { ExampleItem, ExampleUpdate } from "./meaning.types";
import type { Language } from "../../../../language/domain/types/language.type";

interface ExampleRowProps {
  example: ExampleItem;
  index: number;
  languages: Language[];
  onUpdate: (index: number, partial: ExampleUpdate) => void;
  onRemove: (index: number) => void;
}

export function ExampleRow({
  example,
  index,
  languages,
  onUpdate,
  onRemove,
}: ExampleRowProps) {
  const selectedLanguage = languages.find(
    (language) => language.id === example.languageId,
  );

  return (
    <div className="space-y-3 rounded-md border border-zinc-200 bg-zinc-50/60 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-zinc-600">
          Example #{index + 1}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="h-7 w-7 text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        {/* Language */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-zinc-600">
            Language
          </label>

          <Select
            value={example.languageId}
            onValueChange={(value) => {
              if (value !== null) {
                onUpdate(index, {
                  languageId: value,
                });
              }
            }}
          >
            <SelectTrigger className="w-full text-xs">
              <SelectValue placeholder="Select language">
                {selectedLanguage
                  ? `${selectedLanguage.name}${
                      selectedLanguage.nativeName
                        ? ` (${selectedLanguage.nativeName})`
                        : ""
                    }`
                  : "Select language"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.id} value={language.id}>
                  <span>{language.name}</span>

                  {language.nativeName && (
                    <span className="ml-1 text-muted-foreground">
                      ({language.nativeName})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Verification */}
        <div className="flex items-end">
          <div className="flex h-9 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3">
            <Switch
              id={`example-verified-${example.id ?? index}`}
              checked={example.isVerified ?? false}
              onCheckedChange={(checked) => {
                onUpdate(index, {
                  isVerified: checked,
                });
              }}
            />

            <label
              htmlFor={`example-verified-${example.id ?? index}`}
              className="cursor-pointer text-xs font-medium text-zinc-700"
            >
              Verified
            </label>
          </div>
        </div>
      </div>

      {/* Example sentence */}
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-zinc-600">
          Example Sentence
        </label>

        <Input
          value={example.text}
          onChange={(event) =>
            onUpdate(index, {
              text: event.target.value,
            })
          }
          placeholder="Enter an example sentence..."
          className="text-xs"
        />
      </div>
    </div>
  );
}
