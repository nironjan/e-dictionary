"use client";

import { useState } from "react";
import { Badge } from "../../../../../shared/components/ui/badge";
import { Button } from "../../../../../shared/components/ui/button";
import { useCategories } from "../../../../category/application/queries/category.query";
import { useLanguages } from "../../../../language/application/queries/language.query";
import {
  createWordSchema,
  type CreateWordFormData,
} from "../../../domain/schema/word.schema";
import { AlertCircle, CheckCircle2, Code } from "lucide-react";

interface StepReviewSubmitProps {
  formData: CreateWordFormData;
  isEditing?: boolean;
}

export function StepReviewSubmit({
  formData,
  isEditing = false,
}: StepReviewSubmitProps) {
  const { data: languages = [] } = useLanguages();
  const { data: categoriesResponse } = useCategories({
    page: 1,
    limit: 20,
  });
  const categories = categoriesResponse?.data || [];

  const [showJson, setShowJson] = useState(false);

  const selectedLang = languages.find((l) => l.id === formData.languageId);
  const selectedCategories = categories.filter((c) =>
    formData.categoryIds?.includes(c.id),
  );

  // Run validation
  const validationResult = createWordSchema.safeParse(formData);

  return (
    <div className="space-y-4 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Review & Quality Assurance
          </h4>
          <p className="text-xs text-zinc-500">
            Verify lexicographical completeness and Zod schema compliance prior
            to publishing.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowJson(!showJson)}
          className="h-8 gap-1.5 text-xs text-zinc-700"
        >
          <Code className="h-3.5 w-3.5" />
          <span>
            {showJson ? "Hide Payload" : "Inspect NestJS DTO Payload"}
          </span>
        </Button>
      </div>

      {/* Schema Validation Status Banner */}
      {validationResult.success ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3.5 text-emerald-900 flex items-start gap-2.5">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold">Zod Validation Passed</h5>
            <p className="text-xs text-emerald-700 mt-0.5">
              All mandatory fields, relations, nested definitions, and ISO
              constraints satisfy the NestJS DTO contract.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-amber-900 space-y-2">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold">
                Validation Attention Required
              </h5>
              <p className="text-xs text-amber-700 mt-0.5">
                Please resolve the following before saving:
              </p>
            </div>
          </div>
          <ul className="list-disc pl-9 text-xs text-amber-800 space-y-1">
            {validationResult.error.issues.map((err, i) => (
              <li key={i}>
                <span className="font-semibold font-mono">
                  {err.path.join(".") || "Root"}:
                </span>{" "}
                {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Profile */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Core Profile
          </h5>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-zinc-100">
              <span className="text-zinc-500">Headword Lemma</span>
              <span className="font-bold text-zinc-900 text-sm">
                {formData.text || "—"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100">
              <span className="text-zinc-500">Target Language</span>
              <span className="font-medium text-zinc-800">
                {selectedLang
                  ? `${selectedLang.name} (${selectedLang.code})`
                  : "Not Selected"}
              </span>
            </div>

            <div className="py-1">
              <span className="text-zinc-500 block mb-1">Categories</span>
              <div className="flex flex-wrap gap-1">
                {selectedCategories.length > 0 ? (
                  selectedCategories.map((c) => (
                    <Badge
                      key={c.id}
                      variant="secondary"
                      className="text-[10px]"
                    >
                      {c.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-zinc-400 italic">
                    No categories assigned
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Linguistic Elements Breakdown */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Lexical Content Stats
          </h5>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50">
              <div className="text-lg font-bold text-zinc-900">
                {formData.meanings?.length || 0}
              </div>
              <div className="text-[11px] text-zinc-500">Meanings & Senses</div>
            </div>
            <div className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50">
              <div className="text-lg font-bold text-zinc-900">
                {formData.phonetics?.length || 0}
              </div>
              <div className="text-[11px] text-zinc-500">Phonetics</div>
            </div>
            <div className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50">
              <div className="text-lg font-bold text-zinc-900">
                {formData.etymologies?.length || 0}
              </div>
              <div className="text-[11px] text-zinc-500">Etymologies</div>
            </div>
            <div className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50">
              <div className="text-lg font-bold text-zinc-900">
                {formData.media?.length || 0}
              </div>
              <div className="text-[11px] text-zinc-500">Visual Media</div>
            </div>
          </div>
          <div className="text-[11px] text-zinc-500 pt-1">
            Total cross-lingual translations configured:{" "}
            <span className="font-bold text-zinc-800">
              {formData.meanings?.reduce(
                (acc, m) => acc + (m.translations?.length || 0),
                0,
              ) || 0}
            </span>
          </div>
        </div>
      </div>

      {/* JSON Payload Preview */}
      {showJson && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-zinc-100 text-xs font-mono overflow-x-auto max-h-64 animate-in fade-in-50">
          <div className="flex justify-between items-center text-zinc-400 pb-2 border-b border-zinc-800 mb-2">
            <span>Payload for /api/v1/dictionary/admin/words</span>
            <span className="text-[10px]">
              {JSON.stringify(formData).length} bytes
            </span>
          </div>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
