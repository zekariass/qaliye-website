import { NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin/api-client";
import { adminErrorResponse, noStoreJson } from "@/lib/admin/proxy-helper";

export async function GET() {
  try {
    const res = await adminFetch("/matchmaking/stats", { method: "GET" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return NextResponse.json(body, { status: res.status });
    }
    return noStoreJson(await res.json());
  } catch (error) {
    return adminErrorResponse(error);
  }
}
