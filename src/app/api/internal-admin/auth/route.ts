import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseRouteClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return NextResponse.json(
        { message: error.message ?? "Authentication failed." },
        { status: 401 }
      );
    }

    if (!data.session) {
      return NextResponse.json(
        { message: "No session returned from Supabase." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const supabase = await createSupabaseRouteClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
