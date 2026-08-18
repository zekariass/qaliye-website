"use client";

import { useState } from "react";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime, formatRelative, daysSince } from "@/lib/admin/dates";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { CopyIdButton } from "@/components/admin/shared/CopyIdButton";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { PageSkeleton } from "@/components/admin/shared/PageSkeleton";
import { ErrorState } from "@/components/admin/tables/EmptyState";
import { ChangeStatusDialog } from "@/components/admin/users/ChangeStatusDialog";
import { ChangeRoleDialog } from "@/components/admin/users/ChangeRoleDialog";
import { DeleteUserDialog } from "@/components/admin/users/DeleteUserDialog";
import { SendNotificationDrawer } from "@/components/admin/users/SendNotificationDrawer";
import type { AdminUser } from "@/lib/admin/adapters";
import type { UserStatus } from "@/lib/admin/constants";
import {
  User,
  ShieldAlert,
  ShieldCheck,
  Ban,
  Trash2,
  Bell,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#E5E5EA] last:border-0">
      <span className="text-sm text-[#666672] shrink-0 w-40">{label}</span>
      <span className="text-sm text-[#17171B] text-right min-w-0">{value ?? "—"}</span>
    </div>
  );
}

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const pathname = usePathname();
  const adminConsolePath = pathname.replace(/\/users\/.*$/, "");

  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    newStatus: UserStatus;
  } | null>(null);
  const [roleDialog, setRoleDialog] = useState<{
    open: boolean;
    newRole: string;
  } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [notifDrawer, setNotifDrawer] = useState(false);

  const { data: user, isLoading, isError, refetch } = useQuery<AdminUser>({
    queryKey: adminKeys.users.detail(userId),
    queryFn: async () => {
      const res = await fetch(`/api/internal-admin/users/${userId}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  if (isLoading) return <PageSkeleton hasHeader rows={5} />;
  if (isError || !user)
    return (
      <ErrorState
        title="Failed to load user"
        description="The user could not be retrieved. Please try again."
        onRetry={refetch}
      />
    );

  const days = daysSince(user.createdAt);

  return (
    <div className="max-w-4xl">
      <div className="mb-4">
        <Link
          href={`${adminConsolePath}/users`}
          className="inline-flex items-center gap-1 text-sm text-[#666672] hover:text-[#7C3AED]"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Users
        </Link>
      </div>

      <PageHeader
        title={user.displayName}
        badge={<StatusBadge status={user.status} />}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setNotifDrawer(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#666672] border border-[#E5E5EA] bg-white hover:bg-[#F7F7FA] rounded-xl transition-colors"
            >
              <Bell className="h-4 w-4" />
              Notify
            </button>

            {user.status !== "ACTIVE" && (
              <button
                type="button"
                onClick={() => setStatusDialog({ open: true, newStatus: "ACTIVE" })}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#16815D] border border-[#A7F3D0] bg-[#ECFDF5] hover:bg-[#D1FAE5] rounded-xl transition-colors"
              >
                <ShieldCheck className="h-4 w-4" />
                Activate
              </button>
            )}

            {user.status === "ACTIVE" && (
              <button
                type="button"
                onClick={() => setStatusDialog({ open: true, newStatus: "SUSPENDED" })}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#B7791F] border border-[#FDE68A] bg-[#FFFBEB] hover:bg-[#FEF3C7] rounded-xl transition-colors"
              >
                <ShieldAlert className="h-4 w-4" />
                Suspend
              </button>
            )}

            {user.status !== "BANNED" && (
              <button
                type="button"
                onClick={() => setStatusDialog({ open: true, newStatus: "BANNED" })}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#C63B4E] border border-[#FECDD3] bg-[#FFF1F2] hover:bg-[#FFE4E6] rounded-xl transition-colors"
              >
                <Ban className="h-4 w-4" />
                Ban
              </button>
            )}

            {user.status !== "DEACTIVATED" && (
              <button
                type="button"
                onClick={() => setStatusDialog({ open: true, newStatus: "DEACTIVATED" })}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#666672] border border-[#E5E5EA] bg-white hover:bg-[#F7F7FA] rounded-xl transition-colors"
              >
                <ShieldAlert className="h-4 w-4" />
                Deactivate
              </button>
            )}

            <button
              type="button"
              onClick={() => setDeleteDialog(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#C63B4E] border border-[#FECDD3] bg-white hover:bg-[#FFF1F2] rounded-xl transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
            <div className="flex items-center gap-4 mb-5">
              <div className="h-14 w-14 rounded-full bg-[#EDE2FF] flex items-center justify-center shrink-0">
                <User className="h-8 w-8 text-[#7C3AED]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#17171B]">{user.displayName}</h2>
                <CopyIdButton id={user.userId} label="ID" />
              </div>
            </div>

            <DetailRow label="Status" value={<StatusBadge status={user.status} />} />
            <DetailRow label="Role" value={
              <div className="flex items-center gap-2">
                <span>{user.role}</span>
                <select
                  value={user.role}
                  onChange={(e) => setRoleDialog({ open: true, newRole: e.target.value })}
                  className="text-xs px-2 py-1 border border-[#E5E5EA] rounded-lg bg-white text-[#666672] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 cursor-pointer"
                >
                  <option value="USER">USER</option>
                  <option value="MODERATOR">MODERATOR</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="TEST">TEST</option>
                </select>
              </div>
            } />
            <DetailRow label="Gender" value={user.gender ?? "—"} />
            <DetailRow label="Age" value={user.age ? `${user.age} years` : "—"} />
            <DetailRow label="Premium" value={user.isPremium ? "Yes" : "No"} />
            <DetailRow label="Joined" value={
              <span title={formatDateTime(user.createdAt)}>
                {formatRelative(user.createdAt)}
                {days !== null && (
                  <span className="ml-1 text-[#9CA3AF]">({days} days ago)</span>
                )}
              </span>
            } />
            <DetailRow
              label="Last Active"
              value={user.lastActiveAt ? formatRelative(user.lastActiveAt) : "—"}
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#17171B] mb-4">Activity</h3>
            <div className="space-y-3">
              {user.photoCount !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#666672]">Photos</span>
                  <span className="font-medium text-[#17171B]">{user.photoCount}</span>
                </div>
              )}
              {user.reportCount !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#666672]">Reports</span>
                  <span className={`font-medium ${(user.reportCount ?? 0) > 0 ? "text-[#C63B4E]" : "text-[#17171B]"}`}>
                    {user.reportCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {statusDialog && (
        <ChangeStatusDialog
          open={statusDialog.open}
          onClose={() => setStatusDialog(null)}
          userId={userId}
          displayName={user.displayName}
          currentStatus={user.status}
          newStatus={statusDialog.newStatus}
        />
      )}

      {roleDialog && (
        <ChangeRoleDialog
          open={roleDialog.open}
          onClose={() => setRoleDialog(null)}
          userId={userId}
          displayName={user.displayName}
          newRole={roleDialog.newRole}
          isSelf={false}
        />
      )}

      <DeleteUserDialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        userId={userId}
        displayName={user.displayName}
        isSelf={false}
        adminConsolePath={adminConsolePath}
      />

      <SendNotificationDrawer
        open={notifDrawer}
        onClose={() => setNotifDrawer(false)}
        userId={userId}
        displayName={user.displayName}
      />
    </div>
  );
}
