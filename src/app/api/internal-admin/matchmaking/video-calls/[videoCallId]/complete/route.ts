import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin/api-client";
import { adminErrorResponse } from "@/lib/admin/proxy-helper";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ videoCallId: string }> }
) {
  try {
    const { videoCallId } = await params;
    const res = await adminFetch(`/matchmaking/video-calls/${videoCallId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return NextResponse.json(errBody, { status: res.status });
    }
    return NextResponse.json(await res.json());
  } catch (error) {
    return adminErrorResponse(error);
  }
}
