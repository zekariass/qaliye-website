import { NextRequest, NextResponse } from "next/server";
import { adminGet } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, getErrorMessage } from "@/lib/admin/errors";
import { adaptIdentityReview } from "@/lib/admin/adapters";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((v, k) => { params[k] = v; });

    const raw = await adminGet<Record<string, unknown>>("/identity-reviews", {
      requiredRole: "ADMIN",
      params,
    });

    const rawItems = Array.isArray(raw)
      ? raw
      : Array.isArray(raw.items)
        ? raw.items
        : Array.isArray(raw.data)
          ? raw.data
          : [];

    const items = (rawItems as Record<string, unknown>[]).map(adaptIdentityReview);
    const total = typeof raw.total === "number" ? raw.total : typeof raw.totalItems === "number" ? raw.totalItems : items.length;
    const page = typeof raw.page === "number" ? raw.page : 1;
    const pageSize = typeof raw.pageSize === "number" ? raw.pageSize : typeof raw.page_size === "number" ? raw.page_size : items.length;

    return NextResponse.json({ items, total, page, pageSize });
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
