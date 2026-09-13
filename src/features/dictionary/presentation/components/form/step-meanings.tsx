"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "../../../../../shared/components/ui/button";

import { useLanguages } from "../../../../language/application/queries/language.query";
import type { CreateWordFormData } from "../../../domain/schema/word.schema";
import { PartOfSpeech } from "../../../domain/types/enums/word.enum.types";

import { MeaningSettings } from "../meaning-rows/meaning-settings";

import type {
  MeaningItem,
  DefinitionItem,
  TranslationItem,
  ExampleItem,
  DefinitionUpdate,
  TranslationUpdate,
  ExampleUpdate,
} from "../meaning-rows/meaning.types";
import { DefinitionsSection } from "../meaning-rows/definition-section";
import { TranslationsSection } from "../meaning-rows/translation-section";
import { ExamplesSection } from "../meaning-rows/example-section";

interface StepMeaningsProps {
  formData: CreateWordFormData;
  onChange: (updated: Partial<CreateWordFormData>) => void;
}

export function StepMeanings({ formData, onChange }: StepMeaningsProps) {
  const { data: languages = [] } = useLanguages();

  const meanings = formData.meanings ?? [];
  console.log(
    "StepMeanings examples:",
    meanings.map((meaning) => ({
      meaningId: meaning.id,
      examples: meaning.examples.map((example) => ({
        id: example.id,
        text: example.text,
        isVerified: example.isVerified,
      })),
    })),
  );

  const [activeMeaningIdx, setActiveMeaningIdx] = useState(0);

  // ---------------------------------------------------------------------------
  // Meanings
  // ---------------------------------------------------------------------------

  const handleAddMeaning = () => {
    const newMeaning: MeaningItem = {
      partOfSpeech: PartOfSpeech.NOUN,
      isArchaic: false,
      sortOrder: meanings.length,
      definitions: [
        {
          text: "",
          usageNote: "",
          sortOrder: 0,
        },
      ],
      translations: [],
      examples: [],
      relations: [],
    };

    const nextList = [...meanings, newMeaning];

    onChange({
      meanings: nextList,
    });

    setActiveMeaningIdx(nextList.length - 1);
  };

  const handleRemoveMeaning = (idx: number) => {
    const nextList = meanings.filter((_, i) => i !== idx);

    onChange({
      meanings: nextList,
    });

    setActiveMeaningIdx(Math.max(0, idx - 1));
  };

  const updateCurrentMeaning = (partial: Partial<MeaningItem>) => {
    const currentMeaning = meanings[activeMeaningIdx];

    if (!currentMeaning) {
      return;
    }

    const updated = [...meanings];

    updated[activeMeaningIdx] = {
      ...currentMeaning,
      ...partial,
    };

    onChange({
      meanings: updated,
    });
  };

  const currentMeaning = meanings[activeMeaningIdx];

  // ---------------------------------------------------------------------------
  // Definitions
  // ---------------------------------------------------------------------------

  const handleAddDefinition = () => {
    if (!currentMeaning) {
      return;
    }

    const definitions = currentMeaning.definitions ?? [];

    const nextDefinitions: DefinitionItem[] = [
      ...definitions,
      {
        text: "",
        usageNote: "",
        sortOrder: definitions.length,
      },
    ];

    updateCurrentMeaning({
      definitions: nextDefinitions,
    });
  };

  const handleUpdateDefinition = (
    defIdx: number,
    partial: DefinitionUpdate,
  ) => {
    if (!currentMeaning) {
      return;
    }

    const definitions = [...(currentMeaning.definitions ?? [])];

    const currentDefinition = definitions[defIdx];

    if (!currentDefinition) {
      return;
    }

    definitions[defIdx] = {
      ...currentDefinition,
      ...partial,
    };

    updateCurrentMeaning({
      definitions,
    });
  };

  const handleRemoveDefinition = (defIdx: number) => {
    if (!currentMeaning) {
      return;
    }

    updateCurrentMeaning({
      definitions: (currentMeaning.definitions ?? []).filter(
        (_, i) => i !== defIdx,
      ),
    });
  };

  // ---------------------------------------------------------------------------
  // Translations
  // ---------------------------------------------------------------------------

  const handleAddTranslation = () => {
    if (!currentMeaning) {
      return;
    }

    const targetLanguage =
      languages.find((language) => language.id !== formData.languageId) ??
      languages[0];

    const translations = currentMeaning.translations ?? [];

    const newTranslation: TranslationItem = {
      clientKey: crypto.randomUUID(),
      languageId: targetLanguage?.id ?? "",
      text: "",
      targetWordId: undefined,
      isVerified: false,
      sortOrder: translations.length,
    };

    updateCurrentMeaning({
      translations: [...translations, newTranslation],
    });
  };

  const handleUpdateTranslation = (
    transIdx: number,
    partial: TranslationUpdate,
  ) => {
    if (!currentMeaning) {
      return;
    }

    const translations = [...(currentMeaning.translations ?? [])];

    const currentTranslation = translations[transIdx];

    if (!currentTranslation) {
      return;
    }

    translations[transIdx] = {
      ...currentTranslation,
      ...partial,
    };

    updateCurrentMeaning({
      translations,
    });
  };

  const handleRemoveTranslation = (transIdx: number) => {
    if (!currentMeaning) {
      return;
    }

    updateCurrentMeaning({
      translations: (currentMeaning.translations ?? []).filter(
        (_, i) => i !== transIdx,
      ),
    });
  };

  // ---------------------------------------------------------------------------
  // Examples
  // ---------------------------------------------------------------------------

  const handleAddExample = () => {
    if (!currentMeaning) {
      return;
    }

    const examples = currentMeaning.examples ?? [];

    const newExample: ExampleItem = {
      languageId: formData.languageId || languages[0]?.id || "",
      text: "",
      translationClientKey: currentMeaning.translations?.[0]?.clientKey ?? "",
      isVerified: false,
      sortOrder: examples.length,
    };

    updateCurrentMeaning({
      examples: [...examples, newExample],
    });
  };

  const handleUpdateExample = (exIdx: number, partial: ExampleUpdate) => {
    if (!currentMeaning) {
      return;
    }

    const examples = [...(currentMeaning.examples ?? [])];

    const currentExample = examples[exIdx];

    if (!currentExample) {
      return;
    }

    examples[exIdx] = {
      ...currentExample,
      ...partial,
    };

    updateCurrentMeaning({
      examples,
    });
  };

  const handleRemoveExample = (exIdx: number) => {
    if (!currentMeaning) {
      return;
    }

    updateCurrentMeaning({
      examples: (currentMeaning.examples ?? []).filter((_, i) => i !== exIdx),
    });
  };

  return (
    <div className="animate-in fade-in-50 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Meanings & Lexical Senses
          </h4>

          <p className="text-xs text-zinc-500">
            Define parts of speech, multi-lingual translations, definitions, and
            contextual examples.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleAddMeaning}
          className="h-8 gap-1 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Sense</span>
        </Button>
      </div>

      {/* Empty State */}
      {meanings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400">
          No senses or meanings created yet. Words require at least one meaning
          definition.
          <div className="mt-3">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddMeaning}
            >
              Create First Meaning
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Sense Navigation */}
          <div className="space-y-1.5 pr-3 md:border-r md:border-zinc-200">
            <span className="mb-1 block text-[11px] font-semibold uppercase text-zinc-400">
              Lexical Senses
            </span>

            {meanings.map((meaning, idx) => (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                onClick={() => setActiveMeaningIdx(idx)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();

                    setActiveMeaningIdx(idx);
                  }
                }}
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-2 text-xs font-medium transition-colors ${
                  activeMeaningIdx === idx
                    ? "border-zinc-900 bg-zinc-900 text-white shadow-xs"
                    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-mono text-[10px] opacity-70">
                    #{idx + 1}
                  </span>

                  <span className="capitalize">{meaning.partOfSpeech}</span>

                  {meaning.isArchaic && (
                    <span className="rounded bg-amber-500/20 px-1 text-[9px] text-amber-300">
                      arc
                    </span>
                  )}
                </div>

                {meanings.length > 1 && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      handleRemoveMeaning(idx);
                    }}
                    className={`rounded p-1 text-xs hover:bg-red-500/20 ${
                      activeMeaningIdx === idx
                        ? "text-zinc-300 hover:text-white"
                        : "text-zinc-400 hover:text-red-600"
                    }`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Active Sense */}
          {currentMeaning && (
            <div className="space-y-4 md:col-span-3">
              <MeaningSettings
                meaning={currentMeaning}
                onChange={updateCurrentMeaning}
              />

              <DefinitionsSection
                definitions={currentMeaning.definitions ?? []}
                onAdd={handleAddDefinition}
                onUpdate={handleUpdateDefinition}
                onRemove={handleRemoveDefinition}
              />

              <TranslationsSection
                translations={currentMeaning.translations ?? []}
                languages={languages}
                sourceLanguageId={formData.languageId}
                onAdd={handleAddTranslation}
                onUpdate={handleUpdateTranslation}
                onRemove={handleRemoveTranslation}
              />

              <ExamplesSection
                examples={currentMeaning.examples ?? []}
                languages={languages}
                onAdd={handleAddExample}
                onUpdate={handleUpdateExample}
                onRemove={handleRemoveExample}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
