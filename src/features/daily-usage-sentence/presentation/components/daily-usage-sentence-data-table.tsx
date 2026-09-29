"use client";

import { flexRender, useTable, type SortingState } from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import type { DailyUsageSentence } from "../../domain/types/daily-usage-sentence.type";
import { getDailyUsageSentenceColumns } from "./daily-usage-sentence-columns";
import { dailySentenceTableFeatures } from "./daily-usage-sentence-table.config";

interface DailyUsageSentenceDataTableProps {
  data: DailyUsageSentence[];
  onEdit: (sentence: DailyUsageSentence) => void;
  onManageTranslations: (sentence: DailyUsageSentence) => void;
  onDelete: (sentence: DailyUsageSentence) => void;
}

export function DailyUsageSentenceDataTable({
  data,
  onEdit,
  onDelete,
  onManageTranslations,
}: DailyUsageSentenceDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = getDailyUsageSentenceColumns({
    onEdit,
    onManageTranslations,
    onDelete,
  });

  const table = useTable({
    features: dailySentenceTableFeatures,
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div className="overflow-hidden rounded-md border">
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
          {table.getRowModel().rows.length > 0 ? (
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No daily usage sentences found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
