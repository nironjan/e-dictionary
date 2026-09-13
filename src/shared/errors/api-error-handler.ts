import { ApiClientError, getApiErrorMessage } from "../../lib/api/api-client";

export function isApiError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

export function getErrorMessage(error: unknown): string {
  return getApiErrorMessage(error);
}
