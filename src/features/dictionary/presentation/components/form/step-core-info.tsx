"use client";

import { Check } from "lucide-react";
import { Input } from "../../../../../shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../shared/components/ui/select";
import { useCategories } from "../../../../category/application/queries/category.query";
import { useLanguages } from "../../../../language/application/queries/language.query";
import type { CreateWordFormData } from "../../../domain/schema/word.schema";

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
  const { data: categoriesResponse } = useCategories({
    page: 1,
    limit: 20,
  });
  const categories = categoriesResponse?.data || [];

  const handleToggleCategory = (catId: string) => {
    const current = formData.categoryIds || [];
    if (current.includes(catId)) {
      onChange({ categoryIds: current.filter((id) => id !== catId) });
    } else {
      onChange({ categoryIds: [...current, catId] });
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-1">
            Word Text / Lemma <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="e.g. attractive, beautiful, জ্ঞান"
            className={
              errors.text ? "border-red-500 font-medium" : "font-medium"
            }
          />
          {errors.text && (
            <p className="text-[11px] text-red-600 mt-1">{errors.text}</p>
          )}
          <p className="text-[11px] text-zinc-400 mt-1">
            Primary dictionary headword or canonical spelling.
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-1">
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
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>

            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.name} ({lang.code})
                  {lang.nativeName ? ` — ${lang.nativeName}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.languageId && (
            <p className="text-[11px] text-red-600 mt-1">{errors.languageId}</p>
          )}
          <p className="text-[11px] text-zinc-400 mt-1">
            Assigned locale for orthography and search indexing.
          </p>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
          Assigned Categories ({formData.categoryIds?.length || 0} selected)
        </label>
        <p className="text-xs text-zinc-500 mb-2">
          Tag this word into topics for thematic browsing and vocabulary packs.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 rounded-lg border border-zinc-200 bg-zinc-50/50">
          {categories.map((cat) => {
            const isSelected = formData.categoryIds?.includes(cat.id);
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => handleToggleCategory(cat.id)}
                className={`flex items-center justify-between p-2 rounded-md border text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                <span className="font-medium truncate mr-1">{cat.name}</span>
                {isSelected && <Check className="h-3 w-3 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
