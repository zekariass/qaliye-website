import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import type { UserStatus } from "@/lib/admin/constants";

export function UserStatusBadge({ status }: { status: UserStatus | string }) {
  return <StatusBadge status={status} />;
}
