"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function PaymentConfigPage() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.replace(pathname + "/subscription-plans");
  }, [router, pathname]);

  return null;
}
