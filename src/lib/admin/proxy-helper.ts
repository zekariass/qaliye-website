import { NextResponse } from "next/server";
import {
  AdminAuthError,
  AdminForbiddenError,
  AdminApiError,
  getErrorMessage,
} from "./errors";

/**
 * Convert a caught error from `adminFetch` / `adminGet` / `adminPost` / etc.
 * into a NextResponse that mirrors the Qal Dating Admin API error envelope:
 *
 *   { error: { code: "CONFLICT", message: "...", details: {} } }
 *
 * This keeps the proxy transparent — the UI receives the same error shape
 * regardless of whether the error originated from the backend or the proxy
 * itself (auth/role checks).
 */
export function adminErrorResponse(error: unknown): NextResponse {
  if (error instanceof AdminAuthError) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Unauthorized", details: {} } },
      { status: 401 },
    );
  }
  if (error instanceof AdminForbiddenError) {
    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: error.message, details: {} } },
      { status: 403 },
    );
  }
  if (error instanceof AdminApiError) {
    return NextResponse.json(
      {
        error: {
          code: error.code ?? "INTERNAL_ERROR",
          message: error.message,
          details: error.details ?? {},
        },
      },
      { status: error.status },
    );
  }
  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: getErrorMessage(error),
        details: {},
      },
    },
    { status: 500 },
  );
}
