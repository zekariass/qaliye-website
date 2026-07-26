import { NextRequest, NextResponse } from "next/server";
import { adminGet } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, getErrorMessage } from "@/lib/admin/errors";
import { adaptManualTransaction } from "@/lib/admin/adapters";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((v, k) => { params[k] = v; });

    const raw = await adminGet<Record<string, unknown>>("/transactions", { params });

    const rawItems = Array.isArray(raw.transactions) ? raw.transactions
      : Array.isArray(raw.items) ? raw.items
      : Array.isArray(raw.content) ? raw.content
      : Array.isArray(raw) ? raw : [];

    return NextResponse.json({
      transactions: (rawItems as Record<string, unknown>[]).map(adaptManualTransaction),
      totalPages: raw.totalPages ?? raw.total_pages ?? 1,
      totalItems: raw.totalElements ?? raw.total ?? rawItems.length,
      page: raw.page ?? raw.number ?? 1,
    });
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
