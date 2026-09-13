import type {
  AdminWordListItem,
  AdminWordListPagination,
} from "../types/admin-word-list";

export interface WordAdminListResponse {
  data: AdminWordListItem[];
  pagination: AdminWordListPagination;
}
