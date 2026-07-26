import { NextRequest, NextResponse } from "next/server";
import { adminGet } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, AdminApiError, getErrorMessage } from "@/lib/admin/errors";
import { adaptPaymentOrder } from "@/lib/admin/adapters";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((v, k) => { params[k] = v; });

    const raw = await adminGet<Record<string, unknown>>("/billing/orders", { params, requiredRole: "MODERATOR" });

    // Handle multiple possible response formats:
    // 1. { orders: [...] } (documented)
    // 2. { items: [...] }
    // 3. { content: [...] } (Spring Page)
    // 4. { _embedded: { orders: [...] } } (Spring HATEOAS)
    // 5. { data: [...] }
    // 6. [...] (raw array)
    const embedded = raw._embedded as Record<string, unknown> | undefined;

    const rawOrders: Record<string, unknown>[] = Array.isArray(raw.orders)
      ? raw.orders as Record<string, unknown>[]
      : Array.isArray(raw.items)
        ? raw.items as Record<string, unknown>[]
        : Array.isArray(raw.content)
          ? raw.content as Record<string, unknown>[]
          : Array.isArray(raw.data)
            ? raw.data as Record<string, unknown>[]
            : embedded && Array.isArray(embedded.orders)
              ? embedded.orders as Record<string, unknown>[]
              : embedded && Array.isArray(embedded.paymentOrders)
                ? embedded.paymentOrders as Record<string, unknown>[]
                : Array.isArray(raw)
                  ? raw as Record<string, unknown>[]
                  : [];

    const orders = (rawOrders as Record<string, unknown>[]).map(adaptPaymentOrder);

    return NextResponse.json({
      orders,
      totalPages: raw.totalPages ?? raw.total_pages ?? Math.ceil(Number(raw.total ?? orders.length) / Number(raw.pageSize ?? raw.page_size ?? 20)),
      totalItems: raw.totalElements ?? raw.total ?? orders.length,
      page: raw.page ?? raw.number ?? 1,
    });
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (error instanceof AdminApiError) {
      console.error("[billing/orders] Backend error:", error.status, error.message);
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[billing/orders] Unexpected error:", error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
