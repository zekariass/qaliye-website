import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin/api-client";
import { adminErrorResponse } from "@/lib/admin/proxy-helper";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await adminFetch("/matchmaking/introductions", {
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
