"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";

import { useCategories } from "../../application/queries/category.query";

interface CategorySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CategorySelect({
  value,
  onValueChange,
  placeholder = "Select category",
  searchPlaceholder = "Search categories...",
  disabled = false,
  className,
}: CategorySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const { data, isLoading, isError } = useCategories({
    page: 1,
    limit: 100,
    search: search.trim() || undefined,
    isActive: true,
  });

  const categories = data?.data ?? [];

  const selectedCategory = React.useMemo(() => {
    return categories.find((category) => category.id === value);
  }, [categories, value]);

  const handleSelect = (categoryId: string) => {
    onValueChange(categoryId === value ? "" : categoryId);
    setOpen(false);
    setSearch("");
  };

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
            className={`w-full justify-between font-normal ${className ?? ""}`}
          >
            <span className={selectedCategory ? "" : "text-muted-foreground"}>
              {selectedCategory?.name ?? placeholder}
            </span>

            <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
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
                  const isSelected = category.id === value;

                  return (
                    <CommandItem
                      key={category.id}
                      value={category.id}
                      onSelect={handleSelect}
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
