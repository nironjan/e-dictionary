"use client";

import { Edit2, Trash2 } from "lucide-react";

import type { Language } from "../../domain/types/language.type";

import { Button } from "@/shared/components/ui/button";

interface LanguagesActionsProps {
  language: Language;
  onEdit: (language: Language) => void;
  onDelete: (language: Language) => void;
}

export function LanguagesActions({
  language,
  onEdit,
  onDelete,
}: LanguagesActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => onEdit(language)}
        aria-label={`Edit ${language.name}`}
        title="Edit language"
      >
        <Edit2 className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-destructive hover:text-destructive"
        onClick={() => onDelete(language)}
        aria-label={`Delete ${language.name}`}
        title="Delete language"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
