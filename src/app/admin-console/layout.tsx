import { AdminQueryProvider } from "@/components/admin/AdminQueryProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminQueryProvider>
      {children}
    </AdminQueryProvider>
  );
}
