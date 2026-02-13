/**
 * Centralized error handling: typed error normalization and helpers.
 * Use these everywhere instead of typing errors as `any` to avoid build/deploy failures.
 */

// ---------------------------------------------------------------------------
// Known error shapes (typed, never `any`)
// ---------------------------------------------------------------------------

export type PrismaErrorMeta = {
  target?: string[];
  modelName?: string;
  cause?: string;
};

export interface PrismaKnownRequestError extends Error {
  code: string;
  meta?: PrismaErrorMeta;
  clientVersion?: string;
}

export interface ZodIssue {
  path: (string | number)[];
  message: string;
  code?: string;
}

export interface ZodErrorLike extends Error {
  name: "ZodError";
  issues?: ZodIssue[];
  errors?: ZodIssue[];
}

export interface PostgrestErrorLike {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export interface FetchErrorResponse {
  status: number;
  statusText: string;
  url?: string;
  body?: unknown;
}

export interface NextErrorLike extends Error {
  digest?: string;
  code?: string;
}

/** Normalized app error: use this in catch blocks and API responses */
export interface AppError {
  message: string;
  code: string;
  statusCode: number;
  /** Original error for logging only; never expose to client */
  cause?: unknown;
  /** Optional details (e.g. Zod issues, Prisma meta) */
  details?: unknown;
}

// ---------------------------------------------------------------------------
// Type guards (narrow unknown → specific type)
// ---------------------------------------------------------------------------

function isErrorLike(value: unknown): value is Error {
  return (
    value instanceof Error ||
    (typeof value === "object" &&
      value !== null &&
      "message" in value &&
      typeof (value as Error).message === "string")
  );
}

function isPrismaError(value: unknown): value is PrismaKnownRequestError {
  return (
    isErrorLike(value) &&
    "code" in value &&
    typeof (value as PrismaKnownRequestError).code === "string" &&
    ((value as PrismaKnownRequestError).code.startsWith("P") ||
      (value as PrismaKnownRequestError).code === "PrismaClientKnownRequestError")
  );
}

function isZodError(value: unknown): value is ZodErrorLike {
  if (!isErrorLike(value)) return false;
  const e = value as ZodErrorLike;
  return (
    e.name === "ZodError" &&
    (Array.isArray(e.issues) || Array.isArray(e.errors))
  );
}

function isPostgrestError(value: unknown): value is PostgrestErrorLike {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof (value as PostgrestErrorLike).message === "string"
  );
}

function isFetchResponse(value: unknown): value is FetchErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    typeof (value as FetchErrorResponse).status === "number"
  );
}

function isDOMException(value: unknown): value is DOMException {
  return value instanceof DOMException;
}

function isObjectWithMessage(value: unknown): value is { message: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof (value as { message: unknown }).message === "string"
  );
}

// ---------------------------------------------------------------------------
// Status code mapping (Prisma / Supabase / HTTP)
// ---------------------------------------------------------------------------

const PRISMA_CODE_TO_STATUS: Record<string, number> = {
  P2002: 409, // Unique constraint
  P2003: 400, // Foreign key
  P2025: 404, // Record not found
  P2014: 400, // Relation violation
  P2000: 400, // Value too long
  P2001: 404, // Record not found (query)
};

function getPrismaStatus(code: string): number {
  return PRISMA_CODE_TO_STATUS[code] ?? 500;
}

// ---------------------------------------------------------------------------
// Normalizer: unknown → AppError (never use `any` in catch)
// ---------------------------------------------------------------------------

/**
 * Normalize any thrown value to AppError. Use in catch blocks and API routes.
 * Never type the caught value as `any`; use `unknown` and pass to this.
 */
export function normalizeError(error: unknown): AppError {
  // Already normalized
  if (isAppError(error)) {
    return error;
  }

  // Prisma
  if (isPrismaError(error)) {
    const code = error.code;
    return {
      message: getPrismaMessage(error) ?? error.message,
      code: `PRISMA_${code}`,
      statusCode: getPrismaStatus(code),
      cause: error,
      details: error.meta,
    };
  }

  // Zod
  if (isZodError(error)) {
    const issues = error.issues ?? error.errors ?? [];
    const message =
      issues.length > 0
        ? issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
        : error.message;
    return {
      message,
      code: "VALIDATION_ERROR",
      statusCode: 400,
      cause: error,
      details: issues,
    };
  }

  // Supabase / Postgrest
  if (isPostgrestError(error)) {
    return {
      message: error.message,
      code: error.code ?? "POSTGREST_ERROR",
      statusCode: 500,
      cause: error,
      details: { hint: error.hint, details: error.details },
    };
  }

  // Fetch response (e.g. failed API call)
  if (isFetchResponse(error)) {
    return {
      message: error.statusText || `Request failed with status ${error.status}`,
      code: `HTTP_${error.status}`,
      statusCode: error.status,
      cause: error,
      details: error.body,
    };
  }

  // DOMException (e.g. AbortError)
  if (isDOMException(error)) {
    return {
      message: error.message,
      code: error.name,
      statusCode: 499, // client closed request
      cause: error,
    };
  }

  // Standard Error or { message: string }
  if (isErrorLike(error)) {
    const message = (error as Error).message;
    const code = "code" in error && typeof (error as { code: unknown }).code === "string"
      ? (error as NextErrorLike).code ?? "ERROR"
      : "ERROR";
    return {
      message: message || "An unexpected error occurred",
      code,
      statusCode: 500,
      cause: error,
    };
  }

  if (isObjectWithMessage(error)) {
    return {
      message: error.message,
      code: "ERROR",
      statusCode: 500,
      cause: error,
    };
  }

  // Primitive or completely unknown
  const message =
    typeof error === "string"
      ? error
      : error !== null && typeof error === "object"
        ? JSON.stringify(error)
        : "An unexpected error occurred";
  return {
    message,
    code: "UNKNOWN_ERROR",
    statusCode: 500,
    cause: error,
  };
}

function isAppError(value: unknown): value is AppError {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    "code" in value &&
    "statusCode" in value &&
    typeof (value as AppError).message === "string" &&
    typeof (value as AppError).code === "string" &&
    typeof (value as AppError).statusCode === "number"
  );
}

function getPrismaMessage(error: PrismaKnownRequestError): string | null {
  const { code, meta } = error;
  if (code === "P2002" && meta?.target) {
    const target = meta.target.join(", ");
    return `A record with this value already exists (${target}).`;
  }
  if (code === "P2025") {
    return "The record was not found.";
  }
  if (code === "P2003") {
    return "Invalid reference (foreign key constraint).";
  }
  return null;
}

// ---------------------------------------------------------------------------
// Helpers for use in UI, API routes, and logging
// ---------------------------------------------------------------------------

/** Safe message for UI / API response; never throws */
export function getErrorMessage(error: unknown): string {
  return normalizeError(error).message;
}

/** HTTP status for response; never throws */
export function getErrorStatus(error: unknown): number {
  return normalizeError(error).statusCode;
}

/** Machine-readable code for logging or client handling */
export function getErrorCode(error: unknown): string {
  return normalizeError(error).code;
}

/** Full normalized error for API JSON or logging */
export function toJsonSafeError(error: unknown): Omit<AppError, "cause"> {
  const { cause: _cause, ...rest } = normalizeError(error);
  return rest;
}

// ---------------------------------------------------------------------------
// Typed throw helper (optional)
// ---------------------------------------------------------------------------

/**
 * Throw a normalized AppError. Use when you want to throw a known error type.
 */
export function createAppError(
  message: string,
  options?: { code?: string; statusCode?: number; details?: unknown }
): never {
  const err: AppError = {
    message,
    code: options?.code ?? "APP_ERROR",
    statusCode: options?.statusCode ?? 500,
    details: options?.details,
  };
  throw err;
}

/**
 * Type-safe catch: normalizes error and runs handler. Use in async routes.
 *
 * @example
 * const result = await normalizeCatch(async () => await prisma.user.findMany());
 * if (!result.ok) return Response.json({ error: result.error.message }, { status: result.error.statusCode });
 */
export async function normalizeCatch<T>(
  fn: () => Promise<T>
): Promise<{ ok: true; data: T } | { ok: false; error: AppError }> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (e: unknown) {
    return { ok: false, error: normalizeError(e) };
  }
}
