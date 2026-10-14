import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin/api-client";
import { adminErrorResponse } from "@/lib/admin/proxy-helper";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ introductionId: string }> }
) {
  try {
    const { introductionId } = await params;
    const res = await adminFetch(`/matchmaking/introductions/${introductionId}`, {
      method: "GET",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return NextResponse.json(body, { status: res.status });
    }
    return NextResponse.json(await res.json());
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ introductionId: string }> }
) {
  try {
    const { introductionId } = await params;
    const res = await adminFetch(`/matchmaking/introductions/${introductionId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return NextResponse.json(body, { status: res.status });
    }
    // 204 No Content
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
