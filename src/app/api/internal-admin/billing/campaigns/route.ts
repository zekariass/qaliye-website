import { NextRequest, NextResponse } from "next/server";
import { adminGet, adminPost } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, AdminApiError, getErrorMessage } from "@/lib/admin/errors";
import { adaptPromotionalCampaign } from "@/lib/admin/adapters";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((v, k) => { params[k] = v; });
    const raw = await adminGet<Record<string, unknown>>("/billing/campaigns", { params, requiredRole: "MODERATOR" });

    const campaigns = Array.isArray(raw.campaigns)
      ? (raw.campaigns as Record<string, unknown>[]).map(adaptPromotionalCampaign)
      : Array.isArray(raw.content)
        ? (raw.content as Record<string, unknown>[]).map(adaptPromotionalCampaign)
        : [];

    return NextResponse.json({
      campaigns,
      page: raw.page ?? 1,
      pageSize: raw.pageSize ?? raw.page_size ?? campaigns.length,
      total: raw.total ?? campaigns.length,
      totalPages: raw.totalPages ?? raw.total_pages ?? 1,
    });
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
    const result = await adminPost<Record<string, unknown>>("/billing/campaigns", body, { requiredRole: "MODERATOR" });
    return NextResponse.json(adaptPromotionalCampaign(result), { status: 201 });
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (error instanceof AdminApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
