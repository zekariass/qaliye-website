import { NextRequest, NextResponse } from "next/server";
import { adminPost } from "@/lib/admin/api-client";
import { adminErrorResponse } from "@/lib/admin/proxy-helper";
import { adaptNotificationCampaign } from "@/lib/admin/adapters";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await adminPost<Record<string, unknown>>(`/notification-campaigns/${id}/cancel`);
    return NextResponse.json(adaptNotificationCampaign(result));
  } catch (error) {
    return adminErrorResponse(error);
  }
}
