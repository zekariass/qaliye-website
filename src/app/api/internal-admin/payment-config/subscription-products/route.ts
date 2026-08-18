import { NextRequest, NextResponse } from "next/server";
import { adminGet, adminPost } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, AdminApiError, getErrorMessage } from "@/lib/admin/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((v, k) => { params[k] = v; });
    const data = await adminGet("/payment-config/subscription-products", { requiredRole: "ADMIN", params });
    return NextResponse.json(data);
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
    const data = await adminPost("/payment-config/subscription-products", body, { requiredRole: "ADMIN" });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (error instanceof AdminApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
