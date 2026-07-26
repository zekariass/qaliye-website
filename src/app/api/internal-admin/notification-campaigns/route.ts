import { NextRequest, NextResponse } from "next/server";
import { adminGet, adminPost } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, getErrorMessage } from "@/lib/admin/errors";
import { adaptNotificationCampaign } from "@/lib/admin/adapters";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((v, k) => { params[k] = v; });
    const raw = await adminGet<Record<string, unknown>>("/notification-campaigns", { params });

    const campaigns = Array.isArray(raw.content)
      ? (raw.content as Record<string, unknown>[]).map(adaptNotificationCampaign)
      : Array.isArray(raw.campaigns)
        ? (raw.campaigns as Record<string, unknown>[]).map(adaptNotificationCampaign)
        : [];

    return NextResponse.json({
      content: campaigns,
      totalElements: raw.totalElements ?? raw.total ?? campaigns.length,
      totalPages: raw.totalPages ?? raw.total_pages ?? 1,
      page: raw.page ?? raw.number ?? 0,
      size: raw.size ?? campaigns.length,
    });
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await adminPost<Record<string, unknown>>("/notification-campaigns", body);
    return NextResponse.json(adaptNotificationCampaign(result), { status: 201 });
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
