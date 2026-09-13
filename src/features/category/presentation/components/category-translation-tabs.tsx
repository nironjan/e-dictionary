"use client";

import { X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import type { useCategoryForm } from "../hooks/use-category-form";
import { useLanguagesQuery } from "../../../language/application/queries/language.query";

import { CategoryAdditionalTranslationEditor } from "./category-additional-translation-editor";
import { CategoryLanguagePicker } from "./category-language-picker";
import { RemoveTranslationDialog } from "./remove-translation-dialog";
import { CategoryPrimaryTranslationEditor } from "./category-translation-editor";

type CategoryTranslationTabsProps = {
  form: ReturnType<typeof useCategoryForm>["form"];
  /** Only provided in edit mode. */
  categoryId?: string;
};

export function CategoryTranslationTabs({
  form,
  categoryId,
}: CategoryTranslationTabsProps) {
  const languagesQuery = useLanguagesQuery();
  const languages = languagesQuery.data ?? [];

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium">Translations</h3>
        <p className="text-sm text-muted-foreground">
          Provide a name and description for each language.
        </p>
      </div>

      <form.Subscribe
        selector={(state) => ({
          defaultLanguageId: state.values.defaultLanguageId,
          translations: state.values.translations,
        })}
      >
        {({ defaultLanguageId, translations }) => {
          const defaultLanguage = languages.find(
            (l) => l.id === defaultLanguageId,
          );

          const additionalLanguageIds = Object.keys(translations);

          const removeTranslation = (langId: string) => {
            const next = { ...translations };
            delete next[langId];
            form.setFieldValue("translations", next);
          };

          return (
            <Tabs defaultValue="__default">
              <div className="flex flex-wrap items-center gap-2">
                <TabsList>
                  <TabsTrigger value="__default">
                    {defaultLanguage?.name ?? "Default"}
                  </TabsTrigger>

                  {additionalLanguageIds.map((langId) => {
                    const lang = languages.find((l) => l.id === langId);
                    return (
                      <TabsTrigger key={langId} value={langId}>
                        {lang?.name ?? langId}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <CategoryLanguagePicker
                  form={form}
                  defaultLanguageId={defaultLanguageId}
                  usedLanguageIds={additionalLanguageIds}
                />
              </div>

              <TabsContent value="__default" className="pt-4">
                <CategoryPrimaryTranslationEditor
                  form={form}
                  languageLabel={defaultLanguage?.name ?? "Default"}
                />
              </TabsContent>

              {additionalLanguageIds.map((langId) => {
                const lang = languages.find((l) => l.id === langId);
                const entry = translations[langId];

                return (
                  <TabsContent key={langId} value={langId} className="pt-4">
                    <div className="mb-2 flex items-center justify-end">
                      <RemoveTranslationDialog
                        categoryId={categoryId}
                        translationId={entry?.id}
                        languageLabel={lang?.name ?? langId}
                        onRemoved={() => removeTranslation(langId)}
                      />
                    </div>

                    <CategoryAdditionalTranslationEditor
                      form={form}
                      languageId={langId}
                      languageLabel={lang?.name ?? langId}
                    />
                  </TabsContent>
                );
              })}
            </Tabs>
          );
        }}
      </form.Subscribe>
    </div>
  );
}
