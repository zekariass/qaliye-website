import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/shell/AdminSidebar";
import { AdminTopbar } from "@/components/admin/shell/AdminTopbar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/admin/api-client";

export default async function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminConsolePath = process.env.ADMIN_CONSOLE_PATH ?? "";
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(adminConsolePath + "/sign-in");
  }

  const user = session.user;
  const role = await getUserRole();
  const displayName =
    (user.user_metadata?.full_name as string) ??
    (user.user_metadata?.name as string) ??
    user.email ??
    "Admin";

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F7FA]">
      <AdminSidebar
        role={role}
        adminConsolePath={adminConsolePath}
      />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <AdminTopbar
          displayName={displayName}
          role={role}
          adminConsolePath={adminConsolePath}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
