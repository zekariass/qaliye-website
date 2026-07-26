import { NextResponse } from "next/server";
import { adminGet } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, getErrorMessage } from "@/lib/admin/errors";
import { adaptDashboardMetrics } from "@/lib/admin/adapters";

export async function GET() {
  try {
    const raw = await adminGet<Record<string, unknown>>("/analytics/dashboard", {
      requiredRole: "MODERATOR",
    });
    const data = adaptDashboardMetrics(raw);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof AdminForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
