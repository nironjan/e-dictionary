"use client";

import Link from "next/link";
import { MoreHorizontal, Pencil, Eye } from "lucide-react";

import type { AdminWordListItem } from "@/features/dictionary/domain/types/admin-word-list";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

type WordActionsProps = {
  word: AdminWordListItem;
};

export function WordActions({ word }: WordActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
        aria-label={`Open actions for ${word.text}`}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link
            href={`/admin/dictionary/words/${word.id}`}
            className="flex w-full items-center gap-2"
          >
            <Eye className="size-4" />
            <span>View word</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link
            href={`/dashboard/dictionary/words/${word.id}/edit`}
            className="flex w-full items-center gap-2"
          >
            <Pencil className="size-4" />
            <span>Edit word</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
