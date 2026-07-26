import { NextRequest, NextResponse } from "next/server";
import { adminGet, adminPost } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, AdminApiError, getErrorMessage } from "@/lib/admin/errors";
import { adaptCatalogItem } from "@/lib/admin/adapters";

export async function GET() {
  try {
    const raw = await adminGet<Record<string, unknown> | Record<string, unknown>[]>("/catalog/languages", { requiredRole: "ADMIN" });
    const languages = Array.isArray(raw)
      ? raw.map(adaptCatalogItem)
      : Array.isArray((raw as Record<string, unknown>).languages)
        ? ((raw as Record<string, unknown>).languages as Record<string, unknown>[]).map(adaptCatalogItem)
        : [];
    return NextResponse.json({ languages });
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (error instanceof AdminApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await adminPost<Record<string, unknown>>("/catalog/languages", body, { requiredRole: "ADMIN" });
    return NextResponse.json(adaptCatalogItem(result), { status: 201 });
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (error instanceof AdminApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
