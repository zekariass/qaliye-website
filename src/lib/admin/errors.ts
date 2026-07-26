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
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.code = code;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AdminApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

export async function parseBackendError(response: Response): Promise<AdminApiError> {
  try {
    const body = await response.json();
    const message =
      body?.message ?? body?.error ?? `Request failed (${response.status})`;
    const code = body?.code ?? body?.errorCode;
    return new AdminApiError(message, response.status, code);
  } catch {
    return new AdminApiError(`Request failed (${response.status})`, response.status);
  }
}
