"use client";

import { useState } from "react";
import {
  flexRender,
  useTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { WordSummary } from "../../../domain/types/word.types";
import { wordTableFeatures } from "../word-table-config";

interface WordListTableProps {
  words: WordSummary[];
  columns: ColumnDef<typeof wordTableFeatures, WordSummary>[];
  isLoading: boolean;
}

export function WordListTable({
  words,
  columns,
  isLoading,
}: WordListTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useTable({
    features: wordTableFeatures,
    data: words,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-xs text-zinc-500"
              >
                Loading dictionary entries...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-xs text-zinc-500"
              >
                No words found matching criteria. Click &quot;New Word
                Entry&quot; to add one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
