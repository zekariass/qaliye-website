// ── Server-side errors (thrown by api-client) ────────────────────────────────

export class AdminAuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AdminAuthError";
  }
}

export class AdminForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "AdminForbiddenError";
  }
}

export class AdminApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, unknown>;
  constructor(
    message: string,
    status: number,
    code?: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AdminApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

/**
 * Parse a backend error response into an AdminApiError.
 *
 * Handles the Qaliye Admin API error envelope:
 *   { error: { code: "CONFLICT", message: "...", details: {} } }
 *
 * Also supports flat fallbacks for older endpoints:
 *   { message: "...", code: "..." }
 *   { error: "string message" }
 */
export async function parseBackendError(
  response: Response,
): Promise<AdminApiError> {
  try {
    const body = await response.json();

    // Spec envelope: { error: { code, message, details } }
    if (body?.error && typeof body.error === "object") {
      const err = body.error as Record<string, unknown>;
      return new AdminApiError(
        typeof err.message === "string"
          ? err.message
          : `Request failed (${response.status})`,
        response.status,
        typeof err.code === "string" ? err.code : undefined,
        err.details && typeof err.details === "object"
          ? (err.details as Record<string, unknown>)
          : undefined,
      );
    }

    // Flat: { message, code, details }
    if (body?.message && typeof body.message === "string") {
      return new AdminApiError(
        body.message,
        response.status,
        typeof body.code === "string" ? body.code : undefined,
        body.details && typeof body.details === "object"
          ? (body.details as Record<string, unknown>)
          : undefined,
      );
    }

    // Legacy: { error: "string" }
    if (typeof body?.error === "string") {
      return new AdminApiError(body.error, response.status);
    }

    return new AdminApiError(
      `Request failed (${response.status})`,
      response.status,
    );
  } catch {
    return new AdminApiError(
      `Request failed (${response.status})`,
      response.status,
    );
  }
}

// ── Client-side errors (thrown by UI fetch calls to internal proxy) ───────────

/**
 * Structured error thrown by `parseInternalApiError` — safe to use in client
 * components. Carries the same fields as the backend envelope so the UI can
 * differentiate error types (CONFLICT, NOT_FOUND, VALIDATION_ERROR, etc.).
 */
export class InternalApiError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;
  constructor(
    status: number,
    code: string,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "InternalApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Parse an error response from an internal Next.js proxy route.
 *
 * The proxy routes forward the backend error envelope:
 *   { error: { code, message, details } }
 *
 * Falls back gracefully for legacy `{ error: "string" }` shapes.
 */
export async function parseInternalApiError(
  response: Response,
): Promise<InternalApiError> {
  try {
    const body = await response.json();

    // Envelope: { error: { code, message, details } }
    if (body?.error && typeof body.error === "object") {
      const err = body.error as Record<string, unknown>;
      return new InternalApiError(
        response.status,
        typeof err.code === "string" ? err.code : "UNKNOWN",
        typeof err.message === "string"
          ? err.message
          : `Request failed (${response.status})`,
        err.details && typeof err.details === "object"
          ? (err.details as Record<string, unknown>)
          : undefined,
      );
    }

    // Legacy: { error: "string" }
    if (typeof body?.error === "string") {
      return new InternalApiError(response.status, "UNKNOWN", body.error);
    }

    return new InternalApiError(
      response.status,
      "UNKNOWN",
      `Request failed (${response.status})`,
    );
  } catch {
    return new InternalApiError(
      response.status,
      "UNKNOWN",
      `Request failed (${response.status})`,
    );
  }
}

/**
 * Parse a VALIDATION_ERROR message into per-field errors.
 *
 * The backend `message` format is:
 *   "title: must not be blank, navigationPayload: must not be null"
 *
 * Returns: { title: "must not be blank", navigationPayload: "must not be null" }
 *
 * Field names in validation messages are camelCase (Java bean property names),
 * matching the form field names used in the UI.
 */
export function parseValidationFieldErrors(
  message: string,
): Record<string, string> {
  const errors: Record<string, string> = {};
  // Split on ", " but only when followed by a "field: reason" pattern
  const segments = message.split(/,\s+(?=\w+: )/);
  for (const segment of segments) {
    const colonIdx = segment.indexOf(": ");
    if (colonIdx > 0) {
      const field = segment.substring(0, colonIdx).trim();
      const reason = segment.substring(colonIdx + 2).trim();
      if (field && reason) errors[field] = reason;
    }
  }
  return errors;
}
