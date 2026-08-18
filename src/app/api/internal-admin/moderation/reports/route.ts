import { NextRequest, NextResponse } from "next/server";
import { adminGet } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, getErrorMessage } from "@/lib/admin/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((v, k) => { params[k] = v; });

    const result = await adminGet<Record<string, unknown>>("/moderation/reports", {
      requiredRole: "MODERATOR",
      params,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
