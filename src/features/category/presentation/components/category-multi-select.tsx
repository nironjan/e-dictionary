"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

import { useCategories } from "../../application/queries/category.query";

interface CategoryMultiSelectProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CategoryMultiSelect({
  value,
  onValueChange,
  placeholder = "Select categories",
  searchPlaceholder = "Search categories...",
  disabled = false,
  className,
}: CategoryMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const { data, isLoading, isError } = useCategories({
    page: 1,
    limit: 100,
    search: search.trim() || undefined,
    isActive: true,
  });

  const categories = data?.data ?? [];

  const toggleCategory = (categoryId: string) => {
    if (value.includes(categoryId)) {
      onValueChange(value.filter((id) => id !== categoryId));
      return;
    }

    onValueChange([...value, categoryId]);
  };

  const selectedCategories = categories.filter((category) =>
    value.includes(category.id),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={`min-h-10 w-full justify-between font-normal ${
              className ?? ""
            }`}
          >
            <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
              {selectedCategories.length > 0 ? (
                selectedCategories.map((category) => (
                  <span
                    key={category.id}
                    className="rounded-md bg-muted px-2 py-0.5 text-xs"
                  >
                    {category.name}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>

            <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        }
      />

      <PopoverContent className="w-[var(--anchor-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
            {isLoading && <CommandEmpty>Loading categories...</CommandEmpty>}

            {isError && <CommandEmpty>Failed to load categories.</CommandEmpty>}

            {!isLoading && !isError && categories.length === 0 && (
              <CommandEmpty>No categories found.</CommandEmpty>
            )}

            {!isLoading && !isError && categories.length > 0 && (
              <CommandGroup>
                {categories.map((category) => {
                  const isSelected = value.includes(category.id);

                  return (
                    <CommandItem
                      key={category.id}
                      value={category.id}
                      onSelect={() => toggleCategory(category.id)}
                    >
                      <CheckIcon
                        className={`mr-2 size-4 ${
                          isSelected ? "opacity-100" : "opacity-0"
                        }`}
                      />

                      <span>{category.name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
