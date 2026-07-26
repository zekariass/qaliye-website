import { NextResponse } from "next/server";
import { adminGet } from "@/lib/admin/api-client";
import { AdminAuthError, AdminForbiddenError, getErrorMessage } from "@/lib/admin/errors";
import { adaptReviewQueueItem } from "@/lib/admin/adapters";

export async function GET() {
  try {
    const raw = await adminGet<Record<string, unknown>>("/moderation/photos/manual-review", {
      requiredRole: "MODERATOR",
    });

    const rawItems = Array.isArray(raw.items)
      ? raw.items
      : Array.isArray(raw.photos)
        ? raw.photos
        : Array.isArray(raw)
          ? raw
          : [];

    const photos = (rawItems as Record<string, unknown>[]).map(adaptReviewQueueItem);

    return NextResponse.json({ photos });
  } catch (error) {
    if (error instanceof AdminAuthError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof AdminForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
