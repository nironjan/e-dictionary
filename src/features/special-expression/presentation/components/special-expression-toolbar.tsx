"use client";

import { RotateCcw, Search } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import type { SpecialExpressionType } from "../../domain/schemas/special-expression.schema";
import type {
  SpecialExpressionListFilters,
  SpecialExpressionVerifiedFilter,
} from "../../domain/types/special-expression-list.type";

interface SpecialExpressionListToolbarProps {
  filters: SpecialExpressionListFilters;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: SpecialExpressionType | "all") => void;
  onVerifiedChange: (value: SpecialExpressionVerifiedFilter) => void;
  onReset: () => void;
}

export function SpecialExpressionListToolbar({
  filters,
  onSearchChange,
  onTypeChange,
  onVerifiedChange,
  onReset,
}: SpecialExpressionListToolbarProps) {
  const hasFilters =
    filters.search.trim().length > 0 ||
    filters.type !== "all" ||
    filters.verification !== "all";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={filters.search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search special expressions..."
            className="pl-9"
          />
        </div>

        <Select
          value={filters.type}
          onValueChange={(value) => {
            if (value === "all") {
              onTypeChange("all");
              return;
            }

            onTypeChange(value as SpecialExpressionType);
          }}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Types</SelectItem>

              {/* Add your actual SpecialExpressionType values here */}
              <SelectItem value="idiom">Idiom</SelectItem>
              <SelectItem value="proverb">Proverb</SelectItem>
              <SelectItem value="phrase">Phrase</SelectItem>
              <SelectItem value="collocation">Collocation</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={filters.verification}
          onValueChange={(value) => {
            if (
              value === "all" ||
              value === "verified" ||
              value === "unverified"
            ) {
              onVerifiedChange(value);
            }
          }}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by verification" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="shrink-0"
        >
          <RotateCcw className="size-4" />
          Reset
        </Button>
      )}
    </div>
  );
}
