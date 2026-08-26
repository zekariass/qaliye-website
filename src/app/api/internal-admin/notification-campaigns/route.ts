import { NextRequest, NextResponse } from "next/server";
import { adminGet, adminPost } from "@/lib/admin/api-client";
import { adminErrorResponse } from "@/lib/admin/proxy-helper";
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
    return adminErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await adminPost<Record<string, unknown>>("/notification-campaigns", body);
    return NextResponse.json(adaptNotificationCampaign(result), { status: 201 });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
