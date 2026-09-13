"use client";

import { Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import { useCategoryForm } from "../hooks/use-category-form";
import { useLanguagesQuery } from "../../../language/application/queries/language.query";

type CategoryLanguagePickerProps = {
  form: ReturnType<typeof useCategoryForm>["form"];
  defaultLanguageId: string;
  usedLanguageIds: string[];
};

export function CategoryLanguagePicker({
  form,
  defaultLanguageId,
  usedLanguageIds,
}: CategoryLanguagePickerProps) {
  const languagesQuery = useLanguagesQuery();
  const languages = languagesQuery.data ?? [];

  const used = new Set([defaultLanguageId, ...usedLanguageIds]);
  const available = languages.filter((l) => !used.has(l.id));

  if (available.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button type="button" variant="outline" size="sm">
            <Plus className="mr-1 size-4" />
            Add language
          </Button>
        }
      />

      <DropdownMenuContent align="end">
        {available.map((language) => (
          <DropdownMenuItem
            key={language.id}
            onClick={() => {
              const current = form.state.values.translations;
              form.setFieldValue("translations", {
                ...current,
                [language.id]: { name: "", description: "" },
              });
            }}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
