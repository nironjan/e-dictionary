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
import type { Category } from "../../domain/types/category.type";
import { categoryTableFeatures } from "./category-table-config";

interface CategoryListTableProps {
  categories: Category[];
  columns: ColumnDef<typeof categoryTableFeatures, Category>[];
  isLoading: boolean;
}

export function CategoryListTable({
  categories,
  columns,
  isLoading,
}: CategoryListTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useTable({
    features: categoryTableFeatures,
    data: categories,
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
                Loading categories...
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
                No categories found. Click &quot;New Category&quot; to add one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
