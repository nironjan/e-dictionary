"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useLanguages } from "../../application/queries/language.query";

export interface Language {
  id: string;
  name: string;
  code?: string;
}

interface LanguageSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  error?: boolean;
  includeAll?: boolean;
  allLabel?: string;
  allValue?: string;
  excludeIds?: string[];
}

export function LanguageSelect({
  value,
  onChange,
  onBlur,
  placeholder = "Select language",
  disabled = false,
  className,
  contentClassName,
  error = false,
  includeAll = false,
  allLabel = "All languages",
  allValue = "all",
  excludeIds = [],
}: LanguageSelectProps) {
  const { data: languages, isLoading, isError } = useLanguages();

  const selectedLanguage = languages?.find((language) => language.id === value);

  const availableLanguages = languages?.filter(
    (language) => !excludeIds.includes(language.id),
  );

  if (isLoading) {
    return <Skeleton className={cn("h-10 w-full", className)} />;
  }

  if (isError) {
    return (
      <Select disabled>
        <SelectTrigger className={cn("w-full", className)}>
          <SelectValue placeholder="Failed to load languages" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next == null) return;

        onChange?.(next);
        onBlur?.();
      }}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "w-full",
          error && "border-destructive focus:ring-destructive",
          className,
        )}
        aria-invalid={error}
        onBlur={onBlur}
      >
        <SelectValue placeholder={placeholder}>
          {selectedLanguage ? selectedLanguage.name : undefined}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className={contentClassName}>
        {includeAll && <SelectItem value={allValue}>{allLabel}</SelectItem>}

        {availableLanguages?.map((language) => (
          <SelectItem key={language.id} value={language.id}>
            {language.name}
          </SelectItem>
        ))}

        {!availableLanguages?.length && !includeAll && (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No languages available
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
