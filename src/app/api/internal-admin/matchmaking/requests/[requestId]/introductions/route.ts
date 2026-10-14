import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin/api-client";
import { adminErrorResponse, noStoreJson } from "@/lib/admin/proxy-helper";

// GET /api/v1/admin/matchmaking/requests/{requestId}/introductions
// → IntroductionRow[] (bare array, newest first; [] when none).
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;
    const res = await adminFetch(`/matchmaking/requests/${requestId}/introductions`, {
      method: "GET",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return NextResponse.json(body, { status: res.status });
    }
    return noStoreJson(await res.json());
  } catch (error) {
    return adminErrorResponse(error);
  }
}
