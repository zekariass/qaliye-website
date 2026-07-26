import { NextRequest, NextResponse } from "next/server";
import { adminGet } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, getErrorMessage } from "@/lib/admin/errors";
import { adaptUser } from "@/lib/admin/adapters";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((v, k) => { params[k] = v; });

    const raw = await adminGet<Record<string, unknown>>("/users", {
      requiredRole: "MODERATOR",
      params,
    });

    const users = Array.isArray(raw.users)
      ? raw.users.map((u) => adaptUser(u as Record<string, unknown>))
      : Array.isArray(raw.content)
        ? (raw.content as Record<string, unknown>[]).map(adaptUser)
        : [];

    return NextResponse.json({
      users,
      totalPages: raw.totalPages ?? raw.total_pages ?? 1,
      totalItems: raw.totalElements ?? raw.total ?? users.length,
      page: raw.page ?? raw.number ?? 1,
    });
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
