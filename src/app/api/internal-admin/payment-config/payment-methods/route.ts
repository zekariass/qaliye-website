import { NextRequest, NextResponse } from "next/server";
import { adminGet, adminPost } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, AdminApiError, getErrorMessage } from "@/lib/admin/errors";
import { adaptPaymentMethod } from "@/lib/admin/adapters";

function extractItems(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) return raw as Record<string, unknown>[];
  const r = raw as Record<string, unknown>;
  if (Array.isArray(r.items)) return r.items as Record<string, unknown>[];
  if (Array.isArray(r.data)) return r.data as Record<string, unknown>[];
  if (Array.isArray(r.content)) return r.content as Record<string, unknown>[];
  return [];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((v, k) => { params[k] = v; });
    const raw = await adminGet("/payment-config/payment-methods", { requiredRole: "ADMIN", params });
    return NextResponse.json({ items: extractItems(raw).map(adaptPaymentMethod) });
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
    const data = await adminPost<Record<string, unknown>>("/payment-config/payment-methods", body, { requiredRole: "ADMIN" });
    return NextResponse.json(adaptPaymentMethod(data), { status: 201 });
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (error instanceof AdminApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
