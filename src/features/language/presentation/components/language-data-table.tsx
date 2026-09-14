"use client";

import { FlexRender, useTable } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { languageTableFeatures } from "./language-table-config";
import type { Language } from "../../domain/types/language.type";
import type { ColumnDef } from "@tanstack/react-table";

interface LanguageDataTableProps {
  data: Language[];
  columns: ColumnDef<typeof languageTableFeatures, Language>[];
}

export function LanguageDataTable({ data, columns }: LanguageDataTableProps) {
  const table = useTable({
    features: languageTableFeatures,
    data,
    columns,
    getRowId: (row) => row.id,
  });

  const rowModel = table.getRowModel();

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : <FlexRender header={header} />}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {rowModel.rows.length > 0 ? (
            rowModel.rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No languages found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
