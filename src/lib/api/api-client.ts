const FALLBACK_API_BASE_URL = "/api/v1";

export function normalizeApiBaseUrl(rawBaseUrl?: string): string {
  const raw = (rawBaseUrl ?? "").trim();

  // Empty env var → default relative path
  if (!raw) return FALLBACK_API_BASE_URL;

  const baseUrl = raw.replace(/\/+$/, "");

  if (baseUrl.endsWith("/api/v1")) {
    return baseUrl;
  }

  return `${baseUrl}/api/v1`;
}

const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);

export const API_UNAVAILABLE_MESSAGE =
  "We couldn't complete this action right now. Please try again in a moment.";

/**
 * Standard error response returned by the API.
 *
 * Supports NestJS validation responses as well as
 * application-specific error codes.
 */
export interface ApiErrorResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  code?: string;
  detail?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Additional information attached to ApiClientError.
 */
export interface ApiClientErrorOptions {
  detail?: string;
  code?: string;
  fieldErrors?: Record<string, string>;
  cause?: unknown;
}

/**
 * Normalized error thrown by the API client.
 *
 * All HTTP/API errors should reach the application
 * through this class.
 */
export class ApiClientError extends Error {
  readonly status: number;
  readonly detail?: string;
  readonly code?: string;
  readonly fieldErrors?: Record<string, string>;

  constructor(
    status: number,
    message: string,
    options: ApiClientErrorOptions = {},
  ) {
    super(message, {
      cause: options.cause,
    });

    this.name = "ApiClientError";

    this.status = status;
    this.detail = options.detail;
    this.code = options.code;
    this.fieldErrors = options.fieldErrors;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestBody = unknown | FormData | URLSearchParams | string;

interface RequestOptions {
  headers?: Record<string, string>;

  params?: Record<string, string | number | boolean | null | undefined>;

  /**
   * Internal flag used to prevent:
   *
   * request
   *   → 401
   *   → refresh
   *   → retry
   *   → 401
   *   → refresh again
   */
  skipAuthRefresh?: boolean;
}

/**
 * Only one refresh operation is allowed at a time.
 *
 * If multiple requests receive 401 simultaneously,
 * they all wait for the same refresh Promise.
 */
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.ok;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function buildUrl(endpoint: string, params?: RequestOptions["params"]): string {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3001";

  const url = new URL(`${API_BASE_URL}${endpoint}`, origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      url.searchParams.append(key, String(value));
    });
  }

  return url.toString();
}

function createHeaders(
  body: RequestBody | undefined,
  customHeaders?: Record<string, string>,
): Record<string, string> {
  const headers: Record<string, string> = {
    ...customHeaders,
  };

  /**
   * Do not manually set Content-Type for FormData.
   *
   * The browser must set the multipart boundary automatically.
   */
  if (
    body !== undefined &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    typeof body !== "string" &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  if (body instanceof URLSearchParams && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  }

  return headers;
}

function serializeBody(body: RequestBody | undefined): BodyInit | undefined {
  if (body === undefined) {
    return undefined;
  }

  if (body instanceof FormData) {
    return body;
  }

  if (body instanceof URLSearchParams) {
    return body.toString();
  }

  if (typeof body === "string") {
    return body;
  }

  return JSON.stringify(body);
}

/**
 * Safely extracts the structured API error response.
 *
 * Never throws if the server returns invalid JSON,
 * HTML, or an empty response.
 */
async function extractApiError(response: Response): Promise<ApiErrorResponse> {
  try {
    const data: unknown = await response.json();

    if (typeof data !== "object" || data === null) {
      return {};
    }

    const result: ApiErrorResponse = {};

    if ("statusCode" in data && typeof data.statusCode === "number") {
      result.statusCode = data.statusCode;
    }

    if ("message" in data) {
      const message = data.message;

      if (typeof message === "string") {
        result.message = message;
      } else if (
        Array.isArray(message) &&
        message.every((item): item is string => typeof item === "string")
      ) {
        result.message = message;
      }
    }

    if ("error" in data && typeof data.error === "string") {
      result.error = data.error;
    }

    if ("code" in data && typeof data.code === "string") {
      result.code = data.code;
    }

    if ("detail" in data && typeof data.detail === "string") {
      result.detail = data.detail;
    }

    if (
      "fieldErrors" in data &&
      typeof data.fieldErrors === "object" &&
      data.fieldErrors !== null
    ) {
      const fieldErrors: Record<string, string> = {};

      Object.entries(data.fieldErrors).forEach(([field, value]) => {
        if (typeof value === "string") {
          fieldErrors[field] = value;
        }
      });

      result.fieldErrors = fieldErrors;
    }

    return result;
  } catch {
    return {};
  }
}

/**
 * Converts the API's message representation into
 * a single human-readable string.
 */
function normalizeApiErrorMessage(error: ApiErrorResponse): string | undefined {
  if (error.detail) {
    return error.detail;
  }

  if (typeof error.message === "string") {
    return error.message;
  }

  if (Array.isArray(error.message)) {
    return error.message.join(", ");
  }

  return undefined;
}

async function request<T>(
  method: HttpMethod,
  endpoint: string,
  body?: RequestBody,
  options: RequestOptions = {},
): Promise<T> {
  const { skipAuthRefresh = false, ...requestOptions } = options;

  const url = buildUrl(endpoint, requestOptions.params);

  const headers = createHeaders(body, requestOptions.headers);

  const requestBody = serializeBody(body);

  let response: Response;

  /**
   * Network-level error.
   *
   * fetch() only rejects for network failures,
   * not HTTP 4xx/5xx responses.
   */
  try {
    response = await fetch(url, {
      method,
      headers,
      credentials: "include",
      body: requestBody,
    });
  } catch (error: unknown) {
    throw new ApiClientError(0, API_UNAVAILABLE_MESSAGE, {
      detail: API_UNAVAILABLE_MESSAGE,
      cause: error,
    });
  }

  /**
   * Silent authentication refresh.
   *
   * If an authenticated request receives 401:
   *
   * 1. Refresh access token.
   * 2. Retry original request once.
   * 3. Never recursively refresh the retry.
   */
  if (
    response.status === 401 &&
    !skipAuthRefresh &&
    endpoint !== "/auth/refresh"
  ) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      return request<T>(method, endpoint, body, {
        ...options,
        skipAuthRefresh: true,
      });
    }
  }

  /**
   * Normalize all HTTP errors.
   */
  if (!response.ok) {
    const errorData = await extractApiError(response);

    const isServerError = response.status >= 500;

    const detail = normalizeApiErrorMessage(errorData);

    const message = isServerError
      ? API_UNAVAILABLE_MESSAGE
      : (detail ?? "We could not complete your request. Please try again.");

    throw new ApiClientError(response.status, message, {
      detail: isServerError ? API_UNAVAILABLE_MESSAGE : detail,
      code: errorData.code,
      fieldErrors: errorData.fieldErrors,
    });
  }

  /**
   * 204 No Content.
   */
  if (response.status === 204) {
    return undefined as T;
  }

  /**
   * Some APIs return Content-Length: 0.
   */
  const contentLength = response.headers.get("content-length");

  if (contentLength === "0") {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return (await response.text()) as T;
}

export const apiClient = {
  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>("GET", endpoint, undefined, options);
  },

  post<T>(
    endpoint: string,
    body?: RequestBody,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>("POST", endpoint, body, options);
  },

  put<T>(
    endpoint: string,
    body?: RequestBody,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>("PUT", endpoint, body, options);
  },

  patch<T>(
    endpoint: string,
    body?: RequestBody,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>("PATCH", endpoint, body, options);
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>("DELETE", endpoint, undefined, options);
  },

  upload<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>("POST", endpoint, formData, options);
  },

  postForm<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>("POST", endpoint, formData, options);
  },
};

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiClientError && error.status === 401;
}

export function isValidationError(error: unknown): boolean {
  return (
    error instanceof ApiClientError &&
    Object.keys(error.fieldErrors ?? {}).length > 0
  );
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

interface ApiErrorMessageOptions {
  unauthorizedMessage?: string;
  notFoundMessage?: string;
}

export function getApiErrorMessage(
  error: unknown,
  options: ApiErrorMessageOptions = {},
): string {
  if (!(error instanceof ApiClientError)) {
    return API_UNAVAILABLE_MESSAGE;
  }

  if (error.status === 401 && options.unauthorizedMessage) {
    return options.unauthorizedMessage;
  }

  if (error.status === 404 && options.notFoundMessage) {
    return options.notFoundMessage;
  }

  return error.message || API_UNAVAILABLE_MESSAGE;
}

export default apiClient;
