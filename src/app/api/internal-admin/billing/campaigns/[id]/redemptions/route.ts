import { NextRequest, NextResponse } from "next/server";
import { adminGet } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, AdminApiError, getErrorMessage } from "@/lib/admin/errors";
import { adaptRedemption } from "@/lib/admin/adapters";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const qParams: Record<string, string> = {};
    searchParams.forEach((v, k) => { qParams[k] = v; });
    const raw = await adminGet<Record<string, unknown> | Record<string, unknown>[]>(`/billing/campaigns/${id}/redemptions`, { params: qParams, requiredRole: "MODERATOR" });

    const redemptions = Array.isArray(raw)
      ? raw.map(adaptRedemption)
      : Array.isArray((raw as Record<string, unknown>).redemptions)
        ? ((raw as Record<string, unknown>).redemptions as Record<string, unknown>[]).map(adaptRedemption)
        : [];

    return NextResponse.json({ redemptions });
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (error instanceof AdminApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
