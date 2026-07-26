"use client";

import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface AdminTopbarProps {
  displayName: string;
  role: string;
  adminConsolePath: string;
}

export function AdminTopbar({ displayName, role, adminConsolePath }: AdminTopbarProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      /* ignore */
    }
    try {
      await fetch("/api/internal-admin/auth", { method: "DELETE" });
    } catch {
      /* ignore */
    }
    router.push(adminConsolePath + "/sign-in");
    router.refresh();
  }

  return (
    <header className="h-16 shrink-0 border-b border-[#E5E5EA] bg-white flex items-center justify-between px-5">
      <div />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE2FF]">
            <User className="h-4 w-4 text-[#7C3AED]" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-[#17171B] leading-tight">{displayName}</p>
            <p className="text-xs text-[#666672] leading-tight capitalize">{role.toLowerCase()}</p>
          </div>
        </div>

        <div className="h-5 w-px bg-[#E5E5EA]" />

        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#666672] hover:text-[#C63B4E] hover:bg-[#FFF1F2] rounded-lg transition-colors disabled:opacity-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </header>
  );
}
