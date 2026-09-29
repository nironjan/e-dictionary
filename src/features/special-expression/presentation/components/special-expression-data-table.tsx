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

import type { SpecialExpression } from "../../domain/types/special-expression.type";
import { getSpecialExpressionColumns } from "./special-expression-column";
import { specialExpressionTableFeatures } from "./config/special-expression-table.config";

interface SpecialExpressionDataTableProps {
  data: SpecialExpression[];
  onEdit: (expression: SpecialExpression) => void;
  onManageTranslations: (expression: SpecialExpression) => void;
  onVerify: (expression: SpecialExpression) => void;
  onDelete: (expression: SpecialExpression) => void;
}

export function SpecialExpressionDataTable({
  data,
  onEdit,
  onDelete,
  onManageTranslations,
  onVerify,
}: SpecialExpressionDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = getSpecialExpressionColumns({
    onEdit,
    onManageTranslations,
    onVerify,
    onDelete,
  });

  const table = useTable({
    features: specialExpressionTableFeatures,
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
                No special expressions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
