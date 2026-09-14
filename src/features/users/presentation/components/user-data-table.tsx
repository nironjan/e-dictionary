"use client";

import { flexRender, useTable, type ColumnDef } from "@tanstack/react-table";

import type { SafeUser } from "../../domain/types/user.types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { Button } from "@/shared/components/ui/button";
import { usersTableFeatures } from "../users-table-config";

interface UserDataTableProps {
  columns: ColumnDef<typeof usersTableFeatures, SafeUser>[];
  data: SafeUser[];

  page: number;
  limit: number;
  total: number;
  totalPages: number;

  onPageChange: (page: number) => void;
}

export function UserDataTable({
  columns,
  data,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
}: UserDataTableProps) {
  const table = useTable({
    features: usersTableFeatures,
    data,
    columns,
  });

  const start = total === 0 ? 0 : (page - 1) * limit + 1;

  const end = Math.min(page * limit, total);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
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
            {data.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          {total > 0 ? `Showing ${start}–${end} of ${total} users` : "No users"}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>

          <span className="text-sm whitespace-nowrap">
            Page {page} of {Math.max(totalPages, 1)}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
