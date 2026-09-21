"use client";

import { useState } from "react";

import { Input } from "../../../../../shared/components/ui/input";
import { Switch } from "../../../../../shared/components/ui/switch";
import { useLanguages } from "../../../../language/application/queries/language.query";
import { CategoryMultiSelect } from "../../../../category/presentation/components/category-multi-select";
import { LanguageSelect } from "../../../../language/presentation/components/language-select";
import type { CreateWordFormData } from "../../../domain/schema/word.schema";
import type { WordListItem } from "../../../domain/types/word.types";
import { WordSearchSelect } from "../word-search-select";

interface StepCoreInfoProps {
  formData: CreateWordFormData;
  onChange: (updated: Partial<CreateWordFormData>) => void;
  errors: Record<string, string>;
}

export function StepCoreInfo({
  formData,
  onChange,
  errors,
}: StepCoreInfoProps) {
  const { data: languages = [] } = useLanguages();

  const [targetLanguageId, setTargetLanguageId] = useState("");

  const targetLanguage = languages.find(
    (language) => language.id === targetLanguageId,
  );

  const targetLanguageCode = targetLanguage?.code ?? "";

  const wordTranslations = formData.wordTranslations ?? [];

  function handleLanguageChange(languageId: string) {
    onChange({ languageId });
    setTargetLanguageId("");
  }

  function handleTargetLanguageChange(languageId: string) {
    setTargetLanguageId(languageId);
  }

  function handleAddTranslation(word: WordListItem) {
    const alreadyAdded = wordTranslations.some(
      (translation) => translation.targetWordId === word.id,
    );

    if (alreadyAdded) {
      return;
    }

    onChange({
      wordTranslations: [
        ...wordTranslations,
        {
          targetWordId: word.id,
          isVerified: false,
          sortOrder: wordTranslations.length,
          targetWord: {
            id: word.id,
            text: word.text,
            language: {
              id: word.language.id,
              code: word.language.code,
              name: word.language.name,
            },
          },
        },
      ],
    });
  }

  function handleRemoveTranslation(targetWordId: string) {
    const updatedTranslations = wordTranslations
      .filter((translation) => translation.targetWordId !== targetWordId)
      .map((translation, index) => ({
        ...translation,
        sortOrder: index,
      }));

    onChange({ wordTranslations: updatedTranslations });
  }

  function handleTranslationVerificationChange(
    targetWordId: string,
    isVerified: boolean,
  ) {
    onChange({
      wordTranslations: wordTranslations.map((translation) =>
        translation.targetWordId === targetWordId
          ? { ...translation, isVerified }
          : translation,
      ),
    });
  }

  return (
    <div className="animate-in fade-in-50 space-y-5">
      {/* Core information */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Word */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-zinc-700">
            Word Text / Lemma <span className="text-red-500">*</span>
          </label>

          <Input
            value={formData.text}
            onChange={(event) => onChange({ text: event.target.value })}
            placeholder="e.g. attractive, beautiful, জ্ঞান"
            className={
              errors.text ? "border-red-500 font-medium" : "font-medium"
            }
          />

          {errors.text && (
            <p className="mt-1 text-[11px] text-red-600">{errors.text}</p>
          )}

          <p className="mt-1 text-[11px] text-zinc-400">
            Primary dictionary headword or canonical spelling.
          </p>
        </div>

        {/* Source language */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-zinc-700">
            Language <span className="text-red-500">*</span>
          </label>

          <LanguageSelect
            value={formData.languageId}
            onChange={handleLanguageChange}
            placeholder="Select language"
            error={Boolean(errors.languageId)}
          />

          {errors.languageId && (
            <p className="mt-1 text-[11px] text-red-600">{errors.languageId}</p>
          )}

          <p className="mt-1 text-[11px] text-zinc-400">
            Assigned locale for orthography and search indexing.
          </p>
        </div>
      </div>

      {/* Direct word translations */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700">
            Direct Word Translations
          </label>

          <p className="mt-1 text-xs text-zinc-500">
            Link this word directly to equivalent words in another language.
          </p>
        </div>

        {/* Target language */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-zinc-700">
            Target Language
          </label>

          <LanguageSelect
            value={targetLanguageId}
            onChange={handleTargetLanguageChange}
            placeholder="Select target language"
            disabled={!formData.languageId}
            excludeIds={[formData.languageId]}
          />

          <p className="mt-1 text-[11px] text-zinc-400">
            Select the language of the words you want to link.
          </p>
        </div>

        {/* Target word search */}
        {targetLanguageCode && targetLanguage ? (
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-700">
              Target Words
            </label>

            <WordSearchSelect
              key={targetLanguageCode}
              languageCode={targetLanguageCode}
              value={null}
              onSelect={handleAddTranslation}
              onClear={() => undefined}
              excludeWordIds={wordTranslations.map(
                (translation) => translation.targetWordId,
              )}
              placeholder={`Search ${targetLanguage.name} words...`}
            />
          </div>
        ) : null}

        {/* Selected translations */}
        {wordTranslations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-zinc-700">
                Selected translations
              </p>

              <span className="text-[11px] text-zinc-400">
                {wordTranslations.length} selected
              </span>
            </div>

            <div className="space-y-2">
              {wordTranslations.map((translation) => {
                const target = translation.targetWord;

                return (
                  <div
                    key={translation.targetWordId}
                    className="flex items-center justify-between gap-4 rounded-md border bg-muted/30 px-3 py-2.5"
                  >
                    {/* Translation information */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {target?.text ?? translation.targetWordId}
                      </p>

                      {target?.language && (
                        <p className="text-xs text-muted-foreground">
                          {target.language.name} ({target.language.code})
                        </p>
                      )}

                      <div className="mt-1">
                        <span
                          className={
                            translation.isVerified
                              ? "text-[11px] font-medium text-emerald-600"
                              : "text-[11px] font-medium text-amber-600"
                          }
                        >
                          {translation.isVerified
                            ? "Verified translation"
                            : "Unverified translation"}
                        </span>
                      </div>
                    </div>

                    {/* Verification + Remove */}
                    <div className="flex shrink-0 items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={translation.isVerified ?? false}
                          onCheckedChange={(isVerified) =>
                            handleTranslationVerificationChange(
                              translation.targetWordId,
                              isVerified,
                            )
                          }
                          aria-label={`Toggle verification for ${
                            target?.text ?? "translation"
                          }`}
                        />

                        <span className="hidden text-xs font-medium text-zinc-600 sm:inline">
                          Verify
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveTranslation(translation.targetWordId)
                        }
                        className="text-xs font-medium text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {errors.wordTranslations && (
          <p className="text-[11px] text-red-600">{errors.wordTranslations}</p>
        )}
      </div>

      {/* Categories */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
          Assigned Categories{" "}
          <span className="font-normal text-zinc-500">
            ({formData.categoryIds.length} selected)
          </span>
        </label>

        <p className="mb-2 text-xs text-zinc-500">
          Tag this word into topics for thematic browsing and vocabulary packs.
        </p>

        <CategoryMultiSelect
          value={formData.categoryIds}
          onValueChange={(categoryIds) => {
            onChange({ categoryIds });
          }}
          placeholder="Select categories"
          searchPlaceholder="Search categories..."
        />

        {errors.categoryIds && (
          <p className="mt-1 text-[11px] text-red-600">{errors.categoryIds}</p>
        )}
      </div>
    </div>
  );
}
