import { NextRequest, NextResponse } from "next/server";
import { adminPost } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, getErrorMessage } from "@/lib/admin/errors";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;
    const body = await request.json();
    const result = await adminPost<Record<string, unknown>>(
      `/identity-reviews/${reviewId}/approve`,
      body,
      { requiredRole: "ADMIN" }
    );
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
