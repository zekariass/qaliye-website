import { NextRequest, NextResponse } from "next/server";
import { adminGet, adminPatch } from "@/lib/admin/api-client";
import { adminErrorResponse } from "@/lib/admin/proxy-helper";
import { adaptNotificationCampaign } from "@/lib/admin/adapters";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const raw = await adminGet<Record<string, unknown>>(`/notification-campaigns/${id}`);
    return NextResponse.json(adaptNotificationCampaign(raw));
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await adminPatch<Record<string, unknown>>(`/notification-campaigns/${id}`, body);
    return NextResponse.json(adaptNotificationCampaign(result));
  } catch (error) {
    return adminErrorResponse(error);
  }
}
