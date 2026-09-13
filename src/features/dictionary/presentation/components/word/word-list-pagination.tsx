"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../../shared/components/ui/button";

interface WordListPaginationProps {
  page: number;
  totalPages: number;
  visibleCount: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function WordListPagination({
  page,
  totalPages,
  visibleCount,
  totalCount,
  onPrevious,
  onNext,
}: WordListPaginationProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-2 px-1 text-xs text-zinc-500 sm:flex-row">
      <span>
        Showing {visibleCount} of {totalCount} words total
      </span>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 px-2 text-xs"
          disabled={page <= 1}
          onClick={onPrevious}
        >
          <ChevronLeft className="mr-1 h-3.5 w-3.5" />
          Previous
        </Button>

        <span className="font-medium text-zinc-700">
          Page {page} of {totalPages}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 px-2 text-xs"
          disabled={page >= totalPages}
          onClick={onNext}
        >
          Next
          <ChevronRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
