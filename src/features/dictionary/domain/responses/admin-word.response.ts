import type { WordDetail } from "../types/admin-word.types";

export interface WordAdminResponse {
  data: WordDetail;
  message?: string;
  success?: boolean;
}
