"use client";

import { Plus, Search } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface LanguageOption {
  id: string;
  code: string;
  name: string;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface WordListToolbarProps {
  search: string;
  languageCode: string;
  selectedCategoryId: string;
  verifiedFilter: string;

  languages: LanguageOption[];
  categories: CategoryOption[];

  onSearchChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onVerificationChange: (value: string) => void;
  onCreateNew: () => void;
}

export function WordListToolbar({
  search,
  languageCode,
  selectedCategoryId,
  verifiedFilter,
  languages,
  categories,
  onSearchChange,
  onLanguageChange,
  onCategoryChange,
  onVerificationChange,
  onCreateNew,
}: WordListToolbarProps) {
  return (
    <div className="flex flex-col items-stretch justify-between gap-3 rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs lg:flex-row lg:items-center">
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />

          <Input
            placeholder="Search words by lemma or keyword..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-9 pl-9 text-xs"
          />
        </div>

        <div className="w-40">
          <Select
            value={languageCode}
            onValueChange={(value) => onLanguageChange(value ?? "")}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Languages" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all-languages">All Languages</SelectItem>

              {languages.map((language) => (
                <SelectItem key={language.id} value={language.code}>
                  {language.name} ({language.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-40">
          <Select
            value={selectedCategoryId}
            onValueChange={(value) => onCategoryChange(value ?? "")}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>

              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-36">
          <Select
            value={verifiedFilter}
            onValueChange={(value) => onVerificationChange(value ?? "all")}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>

              <SelectItem value="true">Verified Only</SelectItem>

              <SelectItem value="false">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        onClick={onCreateNew}
        className="shrink-0 gap-1.5 bg-zinc-900 text-white hover:bg-zinc-800"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>New Word Entry</span>
      </Button>
    </div>
  );
}
