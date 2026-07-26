import { NextRequest, NextResponse } from "next/server";
import { adminPost } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, getErrorMessage } from "@/lib/admin/errors";
import { adaptNotificationCampaign } from "@/lib/admin/adapters";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await adminPost<Record<string, unknown>>(`/notification-campaigns/${id}/start`);
    return NextResponse.json(adaptNotificationCampaign(result));
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
