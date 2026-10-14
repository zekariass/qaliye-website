import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin/api-client";
import { adminErrorResponse } from "@/lib/admin/proxy-helper";

// PATCH /api/v1/admin/matchmaking/users/{userId}/matchmaking-preferences/notes
// Proxied at this path to avoid gitignore conflict with "notes" directory name.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const res = await adminFetch(
      `/matchmaking/users/${userId}/matchmaking-preferences/notes`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return NextResponse.json(errBody, { status: res.status });
    }
    // 200 OK — empty body per API spec
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
