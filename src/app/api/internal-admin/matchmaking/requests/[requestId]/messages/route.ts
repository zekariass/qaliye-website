import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin/api-client";
import { adminErrorResponse } from "@/lib/admin/proxy-helper";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;
    const { searchParams } = new URL(request.url);
    const afterSeq = searchParams.get("afterSeq");
    const path = `/matchmaking/requests/${requestId}/messages${afterSeq ? `?afterSeq=${afterSeq}` : ""}`;
    const res = await adminFetch(path, { method: "GET" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return NextResponse.json(body, { status: res.status });
    }
    return NextResponse.json(await res.json());
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;
    const body = await request.json();
    const res = await adminFetch(`/matchmaking/requests/${requestId}/messages`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return NextResponse.json(errBody, { status: res.status });
    }
    return NextResponse.json(await res.json(), { status: 201 });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
