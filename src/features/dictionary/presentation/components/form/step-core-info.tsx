"use client";

import { Input } from "../../../../../shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../shared/components/ui/select";
import { useLanguages } from "../../../../language/application/queries/language.query";
import type { CreateWordFormData } from "../../../domain/schema/word.schema";
import { CategoryMultiSelect } from "../../../../category/presentation/components/category-multi-select";

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

  const selectedLanguage = languages.find(
    (language) => language.id === formData.languageId,
  );

  return (
    <div className="space-y-5 animate-in fade-in-50">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

        <div>
          <label className="mb-1 block text-xs font-semibold text-zinc-700">
            Language <span className="text-red-500">*</span>
          </label>

          <Select
            value={formData.languageId}
            onValueChange={(value) => {
              if (value !== null) {
                onChange({ languageId: value });
              }
            }}
          >
            <SelectTrigger
              className={errors.languageId ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select language">
                {selectedLanguage
                  ? `${selectedLanguage.name} (${selectedLanguage.code})${
                      selectedLanguage.nativeName
                        ? ` — ${selectedLanguage.nativeName}`
                        : ""
                    }`
                  : "Select language"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.id} value={language.id}>
                  <span>{language.name}</span>
                  <span className="ml-1 text-muted-foreground">
                    ({language.code})
                  </span>

                  {language.nativeName && (
                    <span className="ml-1 text-muted-foreground">
                      — {language.nativeName}
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.languageId && (
            <p className="mt-1 text-[11px] text-red-600">{errors.languageId}</p>
          )}

          <p className="mt-1 text-[11px] text-zinc-400">
            Assigned locale for orthography and search indexing.
          </p>
        </div>
      </div>

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
