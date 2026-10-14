import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin/api-client";
import { adminErrorResponse } from "@/lib/admin/proxy-helper";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;
    // Body is optional — send no body or {} when no overrides
    let body: Record<string, unknown> | undefined;
    const contentLength = request.headers.get("content-length");
    if (contentLength && Number(contentLength) > 0) {
      body = await request.json().catch(() => ({}));
    }

    const res = await adminFetch(`/matchmaking/requests/${requestId}/candidate-search`, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
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
