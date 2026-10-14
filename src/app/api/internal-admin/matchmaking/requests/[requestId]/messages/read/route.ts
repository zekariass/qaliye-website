import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin/api-client";
import { adminErrorResponse } from "@/lib/admin/proxy-helper";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;
    const res = await adminFetch(`/matchmaking/requests/${requestId}/messages/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return NextResponse.json(body, { status: res.status });
    }
    // 200 OK — empty body
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
