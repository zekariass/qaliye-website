import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin/api-client";
import { adminErrorResponse, noStoreJson } from "@/lib/admin/proxy-helper";
import type { MmRequest } from "@/lib/admin/matchmaking-types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((v, k) => { params[k] = v; });

    const qs = new URLSearchParams(params).toString();
    const path = `/matchmaking/requests${qs ? `?${qs}` : ""}`;
    const res = await adminFetch(path, { method: "GET" });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return NextResponse.json(body, { status: res.status });
    }

    const data = await res.json() as MmRequest[];
    return noStoreJson(data);
  } catch (error) {
    return adminErrorResponse(error);
  }
}
