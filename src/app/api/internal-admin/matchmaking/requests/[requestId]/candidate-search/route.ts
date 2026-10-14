import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin/api-client";
import { adminErrorResponse, noStoreJson } from "@/lib/admin/proxy-helper";

// POST /api/v1/admin/matchmaking/requests/{requestId}/candidate-search
// Body: { override_params?, page?, size? } — all optional.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;
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
    return noStoreJson(await res.json());
  } catch (error) {
    return adminErrorResponse(error);
  }
}
