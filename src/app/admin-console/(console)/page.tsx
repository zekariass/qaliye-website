"use client";

import { useQuery } from "@tanstack/react-query";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatMoney } from "@/lib/admin/money";
import { MetricCard } from "@/components/admin/dashboard/MetricCard";
import { AttentionCard } from "@/components/admin/dashboard/AttentionCard";
import { StatusDistribution } from "@/components/admin/dashboard/StatusDistribution";
import { RecentAuditActivity } from "@/components/admin/dashboard/RecentAuditActivity";
import { MetricSkeleton, CardSkeleton } from "@/components/admin/shared/PageSkeleton";
import { ErrorState } from "@/components/admin/tables/EmptyState";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import {
  Users,
  Camera,
  CreditCard,
  TrendingUp,
  UserCheck,
  UserX,
  UserMinus,
} from "lucide-react";
import type { DashboardMetrics } from "@/lib/admin/adapters";

const BASE = process.env.NEXT_PUBLIC_ADMIN_BASE ?? "";

export default function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useQuery<DashboardMetrics>({
    queryKey: adminKeys.dashboard(),
    queryFn: async () => {
      const res = await fetch("/api/internal-admin/dashboard");
      if (!res.ok) {
        if (res.status === 401) window.location.reload();
        throw new Error(`${res.status}`);
      }
      return res.json();
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
  });

  const adminConsolePath =
    typeof window !== "undefined"
      ? (() => {
          const parts = window.location.pathname.split("/");
          return "/" + parts[1];
        })()
      : "";

  const makeHref = (path: string) => `${adminConsolePath}${path}`;

  if (isError) {
    const statusCode = error?.message ?? "";
    let desc = "Something went wrong. Please try again.";
    if (statusCode === "403") {
      desc = "Your account does not have admin access. Contact an administrator.";
    } else if (statusCode === "500") {
      desc = "The backend service is unavailable. Make sure the Qaliye API server is running.";
    }
    return (
      <div>
        <PageHeader title="Dashboard" />
        <ErrorState description={desc} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Operational overview of the Qaliye platform"
      />

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <MetricSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="Total Users"
              value={data?.totalUsers ?? 0}
              icon={<Users className="h-5 w-5" />}
              iconBgClass="bg-[#EDE2FF]"
              iconColorClass="text-[#7C3AED]"
              href={makeHref("/users")}
            />
            <MetricCard
              title="Active Users"
              value={data?.activeUsers ?? 0}
              icon={<UserCheck className="h-5 w-5" />}
              iconBgClass="bg-[#ECFDF5]"
              iconColorClass="text-[#16815D]"
            />
            <MetricCard
              title="New Today"
              value={data?.newUsersToday ?? 0}
              icon={<TrendingUp className="h-5 w-5" />}
              iconBgClass="bg-[#EFF6FF]"
              iconColorClass="text-[#2563EB]"
            />
            {data?.revenueToday !== undefined && (
              <MetricCard
                title="Revenue Today"
                value={formatMoney(data.revenueToday, data.revenueCurrency ?? "ETB")}
                icon={<CreditCard className="h-5 w-5" />}
                iconBgClass="bg-[#FFF7ED]"
                iconColorClass="text-[#EA580C]"
                href={makeHref("/billing/orders")}
              />
            )}
          </div>

          {(data?.pendingPhotoReviews ?? 0) > 0 ||
          (data?.pendingOrders ?? 0) > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {(data?.pendingPhotoReviews ?? 0) > 0 && (
                <AttentionCard
                  title="Pending Photo Reviews"
                  count={data!.pendingPhotoReviews}
                  icon={<Camera className="h-5 w-5" />}
                  description="Photos awaiting moderation review"
                  href={makeHref("/photo-review")}
                  variant="warning"
                />
              )}
              {(data?.pendingOrders ?? 0) > 0 && (
                <AttentionCard
                  title="Pending Payment Orders"
                  count={data!.pendingOrders}
                  icon={<CreditCard className="h-5 w-5" />}
                  description="Orders awaiting approval or rejection"
                  href={makeHref("/billing/orders")}
                  variant="danger"
                />
              )}
            </div>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <StatusDistribution
              title="User Status Breakdown"
              total={data?.totalUsers ?? 0}
              segments={[
                {
                  label: "Active",
                  value: data?.activeUsers ?? 0,
                  color: "#16815D",
                  bgColor: "#ECFDF5",
                },
                {
                  label: "Suspended",
                  value: data?.suspendedUsers ?? 0,
                  color: "#B7791F",
                  bgColor: "#FFFBEB",
                },
                {
                  label: "Deactivated",
                  value: data?.deactivatedUsers ?? 0,
                  color: "#6B7280",
                  bgColor: "#F3F4F6",
                },
                {
                  label: "Banned",
                  value: data?.bannedUsers ?? 0,
                  color: "#C63B4E",
                  bgColor: "#FFF1F2",
                },
                {
                  label: "Deleted",
                  value: data?.deletedUsers ?? 0,
                  color: "#9CA3AF",
                  bgColor: "#F9FAFB",
                },
              ]}
            />

            <div className="lg:col-span-2">
              <RecentAuditActivity
                entries={data?.recentAuditEvents ?? []}
                auditLogHref={makeHref("/audit-log")}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
