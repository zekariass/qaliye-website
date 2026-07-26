import { NextRequest, NextResponse } from "next/server";
import { adminGet } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, getErrorMessage } from "@/lib/admin/errors";
import { adaptAuditLogEntry } from "@/lib/admin/adapters";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((v, k) => { params[k] = v; });
    const raw = await adminGet<Record<string, unknown>>("/audit-log", { params });

    const entries = Array.isArray(raw.entries)
      ? (raw.entries as Record<string, unknown>[]).map(adaptAuditLogEntry)
      : Array.isArray(raw.content)
        ? (raw.content as Record<string, unknown>[]).map(adaptAuditLogEntry)
        : [];

    const total = Number(raw.total ?? raw.total_count ?? entries.length);
    const pageSize = Number(raw.pageSize ?? raw.page_size ?? 25);
    const page = Number(raw.page ?? 1);
    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      entries,
      total,
      page,
      pageSize,
      totalPages,
      totalElements: total,
    });
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
