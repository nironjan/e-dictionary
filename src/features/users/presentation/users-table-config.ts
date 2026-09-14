import {
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/react-table";

export const usersTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});
