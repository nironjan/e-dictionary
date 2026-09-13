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

import type { AdminWordListItem } from "@/features/dictionary/domain/types/admin-word-list";

import { wordColumns } from "./columns";
import { wordTableFeatures } from "./table-config";

type WordDataTableProps = {
  data: AdminWordListItem[];
};

export function WordDataTable({ data }: WordDataTableProps) {
  const table = useTable({
    features: wordTableFeatures,
    data,
    columns: wordColumns,
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
              <TableCell
                colSpan={wordColumns.length}
                className="h-24 text-center"
              >
                No words found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
