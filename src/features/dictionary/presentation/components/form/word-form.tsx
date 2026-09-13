"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, AlertCircle, Save } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import type { WordDetail } from "../../../domain/types/word.types";
import { useLanguages } from "../../../../language/application/queries/language.query";
import {
  useCreateWord,
  useUpdateWord,
} from "../../../application/mutation/word.mutation";
import {
  createWordSchema,
  type CreateWordFormData,
} from "../../../domain/schema/word.schema";
import {
  Accent,
  PhoneticType,
  RelationType,
  SourceType,
  type PartOfSpeech,
} from "../../../domain/types/enums/word.enum.types";
import { StepCoreInfo } from "./step-core-info";
import { StepPhonetics } from "./step-phonetics";
import { StepMeanings } from "./step-meanings";
import { StepEtymologies } from "./step-etymologies";
import { StepSources } from "./step-sources";
import { StepMedia } from "./step-media";
import { StepReviewSubmit } from "./review-submit";

interface WordFormProps {
  wordToEdit?: WordDetail | null;
  onCancel: () => void;
  onSuccess?: () => void;
}

const TABS = [
  { id: "core", label: "1. Core Details" },
  { id: "phonetics", label: "2. Phonetics" },
  { id: "meanings", label: "3. Meanings & Translations" },
  { id: "etymologies", label: "4. Etymology" },
  { id: "sources", label: "5. Sources" },
  { id: "media", label: "6. Media" },
  { id: "review", label: "7. Review & Publish" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function getInitialState(
  wordToEdit: WordDetail | null | undefined,
  languages: ReadonlyArray<{ id: string }>,
): CreateWordFormData {
  if (wordToEdit) {
    return {
      text: wordToEdit.text,
      languageId: wordToEdit.languageId,
      categoryIds: wordToEdit.categories?.map((category) => category.id) ?? [],

      phonetics:
        wordToEdit.phonetics?.map((phonetic, index) => ({
          id: phonetic.id,
          text: phonetic.text,
          type: phonetic.type ?? PhoneticType.IPA,
          accent: phonetic.accent ?? Accent.GENERIC,
          audioUrl: phonetic.audioUrl ?? "",
          sourceUrl: phonetic.sourceUrl ?? "",
          isPrimary: phonetic.isPrimary ?? false,
          sortOrder: phonetic.sortOrder ?? index,
        })) ?? [],

      meanings:
        wordToEdit.meanings?.map((meaning, meaningIndex) => ({
          id: meaning.id,
          version: meaning.version,
          partOfSpeech: meaning.partOfSpeech,
          isArchaic: meaning.isArchaic ?? false,
          isVerified: meaning.isVerified ?? false,
          sortOrder: meaning.sortOrder ?? meaningIndex,

          definitions:
            meaning.definitions?.map((definition, definitionIndex) => ({
              id: definition.id,
              text: definition.text,
              usageNote: definition.usageNote ?? "",
              sortOrder: definition.sortOrder ?? definitionIndex,
            })) ?? [],

          translations:
            meaning.translations?.map((translation, translationIndex) => ({
              id: translation.id,
              clientKey: translation.clientKey,
              languageId: translation.languageId,
              text: translation.text,
              targetWordId: translation.targetWordId ?? undefined,
              isVerified: translation.isVerified ?? false,
              sortOrder: translation.sortOrder ?? translationIndex,
            })) ?? [],

          examples:
            meaning.examples?.map((example, exampleIndex) => ({
              id: example.id,
              languageId: example.languageId,
              text: example.text,
              translationId: example.translationId,
              translationClientKey: example.translationClientKey ?? "",
              isVerified: example.isVerified ?? false,
              sortOrder: example.sortOrder ?? exampleIndex,
            })) ?? [],

          relations:
            meaning.relations?.map((relation, relationIndex) => ({
              id: relation.id,
              relationType: relation.relationType ?? RelationType.SYNONYM,
              relatedMeaningId: relation.relatedMeaningId,
              sortOrder: relation.sortOrder ?? relationIndex,
            })) ?? [],
        })) ?? [],

      etymologies:
        wordToEdit.etymologies?.map((etymology, index) => ({
          id: etymology.id,
          origin: etymology.origin,
          originWord: etymology.originWord ?? "",
          originLanguage: etymology.originLanguage ?? "",
          description: etymology.description ?? "",
          sortOrder: etymology.sortOrder ?? index,
        })) ?? [],

      sources:
        wordToEdit.sources?.map((source) => ({
          id: source.id,
          sourceName: source.sourceName,
          sourceType: source.sourceType ?? SourceType.DICTIONARY,
          sourceUrl: source.sourceUrl ?? "",
          retrievedAt: source.retrievedAt
            ? String(source.retrievedAt)
            : undefined,
        })) ?? [],

      media:
        wordToEdit.media?.map((media, index) => ({
          id: media.id,
          imageUrl: media.imageUrl,
          altText: media.altText ?? "",
          mimeType: media.mimeType ?? "image/jpeg",
          width: media.width ?? null,
          height: media.height ?? null,
          isPrimary: media.isPrimary ?? false,
          sortOrder: media.sortOrder ?? index,
        })) ?? [],
    };
  }

  const defaultLanguageId = languages[0]?.id ?? "";

  return {
    text: "",
    languageId: defaultLanguageId,
    categoryIds: [],
    phonetics: [],

    meanings: [
      {
        partOfSpeech: "noun" as PartOfSpeech,
        isArchaic: false,
        sortOrder: 0,

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
      },
    ],

    etymologies: [],
    sources: [],
    media: [],
  };
}

export function WordForm({ wordToEdit, onCancel, onSuccess }: WordFormProps) {
  const { data: languages = [] } = useLanguages();
  const createMutation = useCreateWord();
  const updateMutation = useUpdateWord();

  const [activeTab, setActiveTab] = useState<TabId>("core");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateWordFormData>(() =>
    getInitialState(wordToEdit, languages),
  );

  const updateFormData = (partial: Partial<CreateWordFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const validateStep = (tab: TabId): boolean => {
    if (tab === "core") {
      const fieldErrors: Record<string, string> = {};
      if (!formData.text || formData.text.trim().length === 0) {
        fieldErrors.text = "Word text is required";
      }
      if (!formData.languageId) {
        fieldErrors.languageId = "Language is required";
      }
      setErrors(fieldErrors);
      return Object.keys(fieldErrors).length === 0;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(activeTab)) return;
    const currentIdx = TABS.findIndex((t) => t.id === activeTab);
    if (currentIdx < TABS.length - 1) {
      setActiveTab(TABS[currentIdx + 1].id);
    }
  };

  const handlePrev = () => {
    const currentIdx = TABS.findIndex((t) => t.id === activeTab);
    if (currentIdx > 0) {
      setActiveTab(TABS[currentIdx - 1].id);
    }
  };

  const handleSubmit = async () => {
    const result = createWordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const path = err.path.join(".");
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      setGlobalError(
        "Please fix the validation errors shown in the review tab before submitting.",
      );
      setActiveTab("review");
      return;
    }

    try {
      if (wordToEdit) {
        await updateMutation.mutateAsync({
          id: wordToEdit.id,
          dto: {
            ...result.data,
            version: wordToEdit.version ?? 1,
          },
        });
      } else {
        await createMutation.mutateAsync(result.data);
      }
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to persist word entry";
      setGlobalError(message);
      setActiveTab("review");
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const currentTabIdx = TABS.findIndex((t) => t.id === activeTab);

  return (
    <div className="w-full bg-white rounded-md p-6">
      {/* Page header */}
      <div className="mb-4 border-b border-zinc-200 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            {wordToEdit
              ? `Edit Word Entry: "${wordToEdit.text}"`
              : "Create New Word Entry"}
          </h1>

          <span className="text-xs font-normal text-zinc-500 font-mono">
            Tab {currentTabIdx + 1} of {TABS.length}
          </span>
        </div>

        <p className="mt-1 text-sm text-zinc-500">
          Comprehensive multi-step lexicographical editor for definitions,
          pronunciations, cross-language translations, etymology, and citations.
        </p>
      </div>

      {globalError && (
        <div className="mb-3 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          if (value !== null) {
            setActiveTab(value as TabId);
          }
        }}
        className="flex flex-col"
      >
        <TabsList className="w-full flex justify-start overflow-x-auto border-b border-zinc-200 pb-1 rounded-none bg-transparent">
          {TABS.map((tab) => {
            const badgeCount =
              tab.id === "phonetics"
                ? formData.phonetics.length
                : tab.id === "meanings"
                  ? formData.meanings.length
                  : tab.id === "etymologies"
                    ? formData.etymologies.length
                    : tab.id === "sources"
                      ? formData.sources.length
                      : tab.id === "media"
                        ? formData.media.length
                        : undefined;

            return (
              <TabsTrigger key={tab.id} value={tab.id} className="gap-1.5">
                <span>{tab.label}</span>

                {badgeCount !== undefined && (
                  <Badge
                    variant="secondary"
                    className="min-w-5 h-5 px-1 justify-center text-[10px] leading-none"
                  >
                    {badgeCount}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="py-4">
          <TabsContent value="core">
            <StepCoreInfo
              formData={formData}
              onChange={updateFormData}
              errors={errors}
            />
          </TabsContent>

          <TabsContent value="phonetics">
            <StepPhonetics formData={formData} onChange={updateFormData} />
          </TabsContent>

          <TabsContent value="meanings">
            <StepMeanings formData={formData} onChange={updateFormData} />
          </TabsContent>

          <TabsContent value="etymologies">
            <StepEtymologies formData={formData} onChange={updateFormData} />
          </TabsContent>

          <TabsContent value="sources">
            <StepSources formData={formData} onChange={updateFormData} />
          </TabsContent>

          <TabsContent value="media">
            <StepMedia formData={formData} onChange={updateFormData} />
          </TabsContent>

          <TabsContent value="review">
            <StepReviewSubmit formData={formData} isEditing={!!wordToEdit} />
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer / nav */}
      <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentTabIdx === 0 || isSubmitting}
            className="gap-1 text-xs"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous Step</span>
          </Button>

          {currentTabIdx < TABS.length - 1 ? (
            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              className="gap-1 text-xs"
            >
              <span>Next Step</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
            >
              <Save className="h-3.5 w-3.5" />
              <span>
                {isSubmitting
                  ? "Saving..."
                  : wordToEdit
                    ? "Save Changes"
                    : "Publish Word"}
              </span>
            </Button>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-xs text-zinc-500"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
