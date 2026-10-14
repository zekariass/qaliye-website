import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin/api-client";
import { adminErrorResponse } from "@/lib/admin/proxy-helper";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ videoCallId: string }> }
) {
  try {
    const { videoCallId } = await params;
    const body = await request.json();
    const res = await adminFetch(`/matchmaking/video-calls/${videoCallId}/fail`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return NextResponse.json(errBody, { status: res.status });
    }
    // 200 OK — empty body
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
