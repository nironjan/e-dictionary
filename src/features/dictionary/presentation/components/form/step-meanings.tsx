"use client";

import { Plus, Trash2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../shared/components/ui/accordion";
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
import { useState } from "react";

interface StepMeaningsProps {
  formData: CreateWordFormData;
  onChange: (updated: Partial<CreateWordFormData>) => void;
}

export function StepMeanings({ formData, onChange }: StepMeaningsProps) {
  const { data: languages = [] } = useLanguages();
  const [expandedMeanings, setExpandedMeanings] = useState<string[]>([]);

  const meanings = formData.meanings ?? [];

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

    const newMeaningValue = `meaning-${nextList.length - 1}`;

    setExpandedMeanings((current) => [...current, newMeaningValue]);
  };

  const handleRemoveMeaning = (meaningIdx: number) => {
    if (meanings.length <= 1) {
      return;
    }

    const nextList = meanings.filter((_, index) => index !== meaningIdx);

    onChange({
      meanings: nextList,
    });
  };

  const updateMeaning = (meaningIdx: number, partial: Partial<MeaningItem>) => {
    const currentMeaning = meanings[meaningIdx];

    if (!currentMeaning) {
      return;
    }

    const updated = [...meanings];

    updated[meaningIdx] = {
      ...currentMeaning,
      ...partial,
    };

    onChange({
      meanings: updated,
    });
  };

  // ---------------------------------------------------------------------------
  // Definitions
  // ---------------------------------------------------------------------------

  const handleAddDefinition = (meaningIdx: number) => {
    const meaning = meanings[meaningIdx];

    if (!meaning) {
      return;
    }

    const definitions = meaning.definitions ?? [];

    const nextDefinitions: DefinitionItem[] = [
      ...definitions,
      {
        text: "",
        usageNote: "",
        sortOrder: definitions.length,
      },
    ];

    updateMeaning(meaningIdx, {
      definitions: nextDefinitions,
    });
  };

  const handleUpdateDefinition = (
    meaningIdx: number,
    defIdx: number,
    partial: DefinitionUpdate,
  ) => {
    const meaning = meanings[meaningIdx];

    if (!meaning) {
      return;
    }

    const definitions = [...(meaning.definitions ?? [])];
    const currentDefinition = definitions[defIdx];

    if (!currentDefinition) {
      return;
    }

    definitions[defIdx] = {
      ...currentDefinition,
      ...partial,
    };

    updateMeaning(meaningIdx, {
      definitions,
    });
  };

  const handleRemoveDefinition = (meaningIdx: number, defIdx: number) => {
    const meaning = meanings[meaningIdx];

    if (!meaning) {
      return;
    }

    updateMeaning(meaningIdx, {
      definitions: (meaning.definitions ?? []).filter(
        (_, index) => index !== defIdx,
      ),
    });
  };

  // ---------------------------------------------------------------------------
  // Translations
  // ---------------------------------------------------------------------------

  const handleAddTranslation = (meaningIdx: number) => {
    const meaning = meanings[meaningIdx];

    if (!meaning) {
      return;
    }

    const targetLanguage =
      languages.find((language) => language.id !== formData.languageId) ??
      languages[0];

    const translations = meaning.translations ?? [];

    const newTranslation: TranslationItem = {
      clientKey: crypto.randomUUID(),
      languageId: targetLanguage?.id ?? "",
      text: "",
      targetWordId: undefined,
      isVerified: false,
      sortOrder: translations.length,
    };

    updateMeaning(meaningIdx, {
      translations: [...translations, newTranslation],
    });
  };

  const handleUpdateTranslation = (
    meaningIdx: number,
    transIdx: number,
    partial: TranslationUpdate,
  ) => {
    const meaning = meanings[meaningIdx];

    if (!meaning) {
      return;
    }

    const translations = [...(meaning.translations ?? [])];
    const currentTranslation = translations[transIdx];

    if (!currentTranslation) {
      return;
    }

    translations[transIdx] = {
      ...currentTranslation,
      ...partial,
    };

    updateMeaning(meaningIdx, {
      translations,
    });
  };

  const handleRemoveTranslation = (meaningIdx: number, transIdx: number) => {
    const meaning = meanings[meaningIdx];

    if (!meaning) {
      return;
    }

    updateMeaning(meaningIdx, {
      translations: (meaning.translations ?? []).filter(
        (_, index) => index !== transIdx,
      ),
    });
  };

  // ---------------------------------------------------------------------------
  // Examples
  // ---------------------------------------------------------------------------

  const handleAddExample = (meaningIdx: number) => {
    const meaning = meanings[meaningIdx];

    if (!meaning) {
      return;
    }

    const examples = meaning.examples ?? [];

    const newExample: ExampleItem = {
      languageId: formData.languageId || languages[0]?.id || "",
      text: "",
      translationClientKey: meaning.translations?.[0]?.clientKey ?? "",
      isVerified: false,
      sortOrder: examples.length,
    };

    updateMeaning(meaningIdx, {
      examples: [...examples, newExample],
    });
  };

  const handleUpdateExample = (
    meaningIdx: number,
    exIdx: number,
    partial: ExampleUpdate,
  ) => {
    const meaning = meanings[meaningIdx];

    if (!meaning) {
      return;
    }

    const examples = [...(meaning.examples ?? [])];
    const currentExample = examples[exIdx];

    if (!currentExample) {
      return;
    }

    examples[exIdx] = {
      ...currentExample,
      ...partial,
    };

    updateMeaning(meaningIdx, {
      examples,
    });
  };

  const handleRemoveExample = (meaningIdx: number, exIdx: number) => {
    const meaning = meanings[meaningIdx];

    if (!meaning) {
      return;
    }

    updateMeaning(meaningIdx, {
      examples: (meaning.examples ?? []).filter((_, index) => index !== exIdx),
    });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

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
          <Plus className="size-3.5" />
          <span>Add Sense</span>
        </Button>
      </div>

      {/* Empty State */}
      {meanings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400">
          <p>
            No senses or meanings created yet. Words require at least one
            meaning definition.
          </p>

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
        <Accordion
          multiple
          value={expandedMeanings}
          onValueChange={setExpandedMeanings}
          className="space-y-3"
        >
          {meanings.map((meaning, idx) => {
            const definitionCount = meaning.definitions?.length ?? 0;

            const translationCount = meaning.translations?.length ?? 0;

            const exampleCount = meaning.examples?.length ?? 0;

            return (
              <AccordionItem
                key={meaning.id ?? `new-${idx}`}
                value={`meaning-${idx}`}
                className="overflow-hidden rounded-lg border border-zinc-200 bg-white"
              >
                {/* Meaning Header */}
                <AccordionTrigger className="px-4 py-4 hover:no-underline">
                  <div className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    {/* Number */}
                    <span className="shrink-0 font-mono text-[10px] text-zinc-400">
                      #{idx + 1}
                    </span>

                    {/* Part of speech */}
                    <span className="capitalize font-semibold text-zinc-800">
                      {meaning.partOfSpeech}
                    </span>

                    {/* Archaic */}
                    {meaning.isArchaic && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-700">
                        archaic
                      </span>
                    )}

                    {/* Summary counts */}
                    <div className="hidden min-w-0 items-center gap-2 text-[10px] text-zinc-400 sm:flex">
                      <span>
                        {definitionCount}{" "}
                        {definitionCount === 1 ? "definition" : "definitions"}
                      </span>

                      <span>·</span>

                      <span>
                        {translationCount}{" "}
                        {translationCount === 1
                          ? "translation"
                          : "translations"}
                      </span>

                      <span>·</span>

                      <span>
                        {exampleCount}{" "}
                        {exampleCount === 1 ? "example" : "examples"}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>

                {/* Meaning Content */}
                <AccordionContent className="border-t border-zinc-100 px-4 pb-5 pt-4">
                  <div className="space-y-5">
                    {/* Meaning Settings */}
                    <MeaningSettings
                      meaning={meaning}
                      onChange={(partial) => updateMeaning(idx, partial)}
                    />

                    {/* Definitions */}
                    <DefinitionsSection
                      definitions={meaning.definitions ?? []}
                      onAdd={() => handleAddDefinition(idx)}
                      onUpdate={(defIdx, partial) =>
                        handleUpdateDefinition(idx, defIdx, partial)
                      }
                      onRemove={(defIdx) => handleRemoveDefinition(idx, defIdx)}
                    />

                    {/* Translations */}
                    <TranslationsSection
                      translations={meaning.translations ?? []}
                      languages={languages}
                      sourceLanguageId={formData.languageId}
                      onAdd={() => handleAddTranslation(idx)}
                      onUpdate={(transIdx, partial) =>
                        handleUpdateTranslation(idx, transIdx, partial)
                      }
                      onRemove={(transIdx) =>
                        handleRemoveTranslation(idx, transIdx)
                      }
                    />

                    {/* Examples */}
                    <ExamplesSection
                      examples={meaning.examples ?? []}
                      languages={languages}
                      onAdd={() => handleAddExample(idx)}
                      onUpdate={(exIdx, partial) =>
                        handleUpdateExample(idx, exIdx, partial)
                      }
                      onRemove={(exIdx) => handleRemoveExample(idx, exIdx)}
                    />

                    {/* Delete Meaning */}
                    {meanings.length > 1 && (
                      <div className="flex justify-end border-t border-zinc-100 pt-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMeaning(idx)}
                          className="gap-1.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="size-3.5" />
                          Delete Meaning
                        </Button>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
