import { NextResponse } from "next/server";
import { adminGet } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, AdminApiError, getErrorMessage } from "@/lib/admin/errors";
import { adaptSubscriptionProduct } from "@/lib/admin/adapters";

export async function GET() {
  try {
    const raw = await adminGet<Record<string, unknown> | Record<string, unknown>[]>(
      "/billing/subscription-products",
      { requiredRole: "MODERATOR" }
    );

    const rawProducts = Array.isArray(raw)
      ? raw
      : Array.isArray((raw as Record<string, unknown>).products)
        ? (raw as Record<string, unknown>).products as Record<string, unknown>[]
        : [];

    const products = rawProducts.map(adaptSubscriptionProduct);

    return NextResponse.json({ products });
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (error instanceof AdminApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
