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
import { Switch } from "../../../../../shared/components/ui/switch";

import { useWords } from "../../../application/queries/word.query";
import type { TranslationItem, TranslationUpdate } from "./meaning.types";
import type { Language } from "../../../../language/domain/types/language.type";
import { Textarea } from "../../../../../shared/components/ui/textarea";

interface TranslationRowProps {
  translation: TranslationItem;
  index: number;
  languages: Language[];
  sourceLanguageId: string;
  onUpdate: (index: number, partial: TranslationUpdate) => void;
  onRemove: (index: number) => void;
}

export function TranslationRow({
  translation,
  index,
  languages,
  sourceLanguageId,
  onUpdate,
  onRemove,
}: TranslationRowProps) {
  const targetLanguage = languages.find(
    (language) => language.id === translation.languageId,
  );

  const availableLanguages = languages.filter(
    (language) => language.id !== sourceLanguageId,
  );

  const { data: targetWordsResponse, isLoading: isLoadingWords } = useWords({
    languageCode: targetLanguage?.code,
    limit: 100,
  });

  const targetWords = targetWordsResponse?.data ?? [];

  const selectedTargetWord = targetWords.find(
    (word) => word.id === translation.targetWordId,
  );

  return (
    <div className="space-y-3 rounded-md border border-zinc-200 bg-zinc-50/60 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-zinc-600">
          Translation #{index + 1}
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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Target language */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-zinc-600">
            Target Language
          </label>

          <Select
            value={translation.languageId}
            onValueChange={(value) => {
              if (value !== null) {
                onUpdate(index, {
                  languageId: value,
                  targetWordId: undefined,
                });
              }
            }}
          >
            <SelectTrigger className="w-full text-xs">
              <SelectValue placeholder="Select language">
                {targetLanguage
                  ? `${targetLanguage.name}${
                      targetLanguage.nativeName
                        ? ` (${targetLanguage.nativeName})`
                        : ""
                    }`
                  : "Select language"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {availableLanguages.map((language) => (
                <SelectItem key={language.id} value={language.id}>
                  {language.name}
                  {language.nativeName ? ` (${language.nativeName})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Target dictionary word */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-zinc-600">
            Dictionary Word
          </label>

          <Select
            value={translation.targetWordId ?? ""}
            onValueChange={(value) => {
              if (value !== null) {
                onUpdate(index, {
                  targetWordId: value || undefined,
                });
              }
            }}
            disabled={!targetLanguage || isLoadingWords}
          >
            <SelectTrigger className="w-full text-xs">
              <SelectValue
                placeholder={
                  !targetLanguage
                    ? "Select language first"
                    : isLoadingWords
                      ? "Loading words..."
                      : "Select dictionary word"
                }
              >
                {selectedTargetWord?.text}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {targetWords.map((word) => (
                <SelectItem key={word.id} value={word.id}>
                  {word.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Translation text */}
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-zinc-600">
          Translation
        </label>

        <Textarea
          value={translation.text}
          onChange={(event) =>
            onUpdate(index, {
              text: event.target.value,
            })
          }
          placeholder="Enter translated word or phrase..."
          className="text-xs min-h-15 resize-none"
        />
      </div>

      {/* Verification */}
      <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2">
        <div>
          <label
            htmlFor={`translation-verified-${translation.id ?? index}`}
            className="text-xs font-medium text-zinc-700"
          >
            Verified
          </label>

          <p className="text-[11px] text-zinc-500">
            Show this translation publicly
          </p>
        </div>

        <Switch
          id={`translation-verified-${translation.id ?? index}`}
          checked={translation.isVerified}
          onCheckedChange={(checked) =>
            onUpdate(index, {
              isVerified: checked,
            })
          }
        />
      </div>
    </div>
  );
}
