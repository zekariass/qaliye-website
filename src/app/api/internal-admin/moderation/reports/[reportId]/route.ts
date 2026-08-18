import { NextRequest, NextResponse } from "next/server";
import { adminPatch } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, getErrorMessage } from "@/lib/admin/errors";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const { reportId } = await params;
    const body = await request.json();
    const result = await adminPatch<Record<string, unknown>>(
      `/moderation/reports/${reportId}`,
      body,
      { requiredRole: "MODERATOR" }
    );
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
