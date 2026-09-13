"use client";

import { useMemo, useState } from "react";
import { flexRender, useTable, type SortingState } from "@tanstack/react-table";
import { Loader2, XCircle } from "lucide-react";

import { createMeaningTableColumns } from "./meaning-table-columns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { WordMeaning } from "../../../domain/types/word.types";
import { meaningTableFeatures } from "../meaning-table-config";

interface MeaningTableProps {
  meanings: WordMeaning[];
  isLoading: boolean;
  isError: boolean;
  verifyingMeaningId: string | null;
  deletingMeaningId: string | null;
  onToggleVerification: (meaning: WordMeaning) => void;
  onDelete: (meaning: WordMeaning) => void;
}

export function MeaningTable({
  meanings,
  isLoading,
  isError,
  verifyingMeaningId,
  deletingMeaningId,
  onToggleVerification,
  onDelete,
}: MeaningTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () =>
      createMeaningTableColumns({
        verifyingMeaningId,
        deletingMeaningId,
        onToggleVerification,
        onDelete,
      }),
    [verifyingMeaningId, deletingMeaningId, onToggleVerification, onDelete],
  );

  const table = useTable({
    features: meaningTableFeatures,
    data: meanings,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200">
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
              <TableCell colSpan={columns.length} className="h-32 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading meanings...
                </div>
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                <div className="flex flex-col items-center gap-1">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-xs text-red-600">
                    Failed to load meanings.
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : meanings.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-xs text-zinc-400"
              >
                No meanings found for this word.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
