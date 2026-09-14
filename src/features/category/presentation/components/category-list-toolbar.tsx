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

import type {
  AdminCategoryListFilters,
  CategoryActiveFilter,
} from "../../domain/types/admin-category-list.type";

interface CategoryListToolbarProps {
  filters: AdminCategoryListFilters;
  onSearchChange: (value: string) => void;
  onActiveChange: (value: CategoryActiveFilter) => void;
  onReset: () => void;
}

export function CategoryListToolbar({
  filters,
  onSearchChange,
  onActiveChange,
  onReset,
}: CategoryListToolbarProps) {
  const hasFilters =
    filters.search.trim().length > 0 || filters.activation !== "all";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={filters.search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search categories..."
            className="pl-9"
          />
        </div>

        <Select
          value={filters.activation}
          onValueChange={(value) => {
            if (value === "all" || value === "active" || value === "inactive") {
              onActiveChange(value);
            }
          }}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
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
