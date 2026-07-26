import { BACKEND_ADMIN_PREFIX } from "./constants";
import { AdminAuthError, AdminForbiddenError, parseBackendError } from "./errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cache } from "react";

const BACKEND_URL = process.env.QALIYE_API_URL ?? "";

export const getUserRole = cache(async (): Promise<string> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return "USER";

  const token = session.access_token;

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      return String(data.role ?? data.role_id ?? "USER");
    }

    if (res.status === 404) {
      // Profile not found — try admin endpoint to determine role
      const adminRes = await fetch(`${BACKEND_URL}${BACKEND_ADMIN_PREFIX}/users?pageSize=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (adminRes.ok) return "ADMIN";
      if (adminRes.status === 403) {
        // Not admin — try a MODERATOR-accessible endpoint
        const modRes = await fetch(`${BACKEND_URL}${BACKEND_ADMIN_PREFIX}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (modRes.ok) return "MODERATOR";
        return "USER";
      }
      return "USER";
    }

    if (res.status === 403) return "USER";

    return "USER";
  } catch {
    return "USER";
  }
});

interface AdminFetchOptions extends RequestInit {
  requiredRole?: "ADMIN" | "MODERATOR" | null;
  params?: Record<string, string | number | boolean | undefined | null>;
}

export async function adminFetch(
  path: string,
  { requiredRole = "ADMIN", params, ...options }: AdminFetchOptions = {}
): Promise<Response> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new AdminAuthError();

  const token = session.access_token;

  if (requiredRole !== null) {
    const role = await getUserRole();

    if (requiredRole === "ADMIN" && role !== "ADMIN") {
      throw new AdminForbiddenError("Admin access required");
    }
    if (
      requiredRole === "MODERATOR" &&
      role !== "ADMIN" &&
      role !== "MODERATOR"
    ) {
      throw new AdminForbiddenError("Moderator or Admin access required");
    }
  }

  let url = `${BACKEND_URL}${BACKEND_ADMIN_PREFIX}${path}`;
  if (params) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) qs.set(k, String(v));
    }
    const qsString = qs.toString();
    if (qsString) url += `?${qsString}`;
  }

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
}

export async function adminGet<T>(path: string, options?: AdminFetchOptions): Promise<T> {
  const response = await adminFetch(path, { method: "GET", ...options });
  if (!response.ok) throw await parseBackendError(response);
  return response.json() as Promise<T>;
}

export async function adminPost<T>(
  path: string,
  body?: unknown,
  options?: AdminFetchOptions
): Promise<T> {
  const response = await adminFetch(path, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...options,
  });
  if (!response.ok) throw await parseBackendError(response);
  return response.json() as Promise<T>;
}

export async function adminPatch<T>(
  path: string,
  body?: unknown,
  options?: AdminFetchOptions
): Promise<T> {
  const response = await adminFetch(path, {
    method: "PATCH",
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...options,
  });
  if (!response.ok) throw await parseBackendError(response);
  return response.json() as Promise<T>;
}

export async function adminPut<T>(
  path: string,
  body?: unknown,
  options?: AdminFetchOptions
): Promise<T> {
  const response = await adminFetch(path, {
    method: "PUT",
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...options,
  });
  if (!response.ok) throw await parseBackendError(response);
  return response.json() as Promise<T>;
}

export async function adminDelete<T>(
  path: string,
  options?: AdminFetchOptions
): Promise<T> {
  const response = await adminFetch(path, { method: "DELETE", ...options });
  if (!response.ok) throw await parseBackendError(response);
  // 204 No Content — return empty object as void cast
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}
