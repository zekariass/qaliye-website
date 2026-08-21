import { NextRequest, NextResponse } from "next/server";
import { adminPost } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, AdminApiError, getErrorMessage } from "@/lib/admin/errors";

export async function POST(_request: NextRequest) {
  try {
    const result = await adminPost<{ matches_created?: number; matchesCreated?: number }>(
      "/matches/reconcile",
      undefined,
      { requiredRole: "ADMIN" }
    );
    const matchesCreated =
      typeof result.matches_created === "number"
        ? result.matches_created
        : typeof result.matchesCreated === "number"
          ? result.matchesCreated
          : 0;
    return NextResponse.json({ matches_created: matchesCreated });
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "admin_access_required" }, { status: 403 });
    if (error instanceof AdminApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
