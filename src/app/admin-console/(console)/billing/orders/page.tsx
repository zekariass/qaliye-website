"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime, formatRelative } from "@/lib/admin/dates";
import { AdminDataTable, type Column } from "@/components/admin/tables/AdminDataTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { CopyIdButton } from "@/components/admin/shared/CopyIdButton";
import { Money } from "@/components/admin/shared/Money";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import type { PaymentOrder } from "@/lib/admin/adapters";
import { Search, Inbox, CheckCircle2, XCircle, Clock, AlertTriangle, Receipt, CreditCard, ListChecks } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PAGE_SIZE = 20;

interface StatusFilterItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const ACTION_NEEDED: StatusFilterItem[] = [
  { label: "Review Queue", value: "", icon: <Inbox className="h-4 w-4" />, color: "#EA580C" },
  { label: "Manual Review", value: "MANUAL_REVIEW", icon: <AlertTriangle className="h-4 w-4" />, color: "#B7791F" },
  { label: "Receipt Submitted", value: "RECEIPT_SUBMITTED", icon: <Receipt className="h-4 w-4" />, color: "#2563EB" },
  { label: "Review Required", value: "REVIEW_REQUIRED", icon: <AlertTriangle className="h-4 w-4" />, color: "#DC2626" },
];

const IN_PROGRESS: StatusFilterItem[] = [
  { label: "Verification Pending", value: "VERIFICATION_PENDING", icon: <Clock className="h-4 w-4" />, color: "#6B7280" },
  { label: "Created / Awaiting Payment", value: "CREATED,AWAITING_PAYMENT", icon: <CreditCard className="h-4 w-4" />, color: "#9CA3AF" },
];

const RESOLVED: StatusFilterItem[] = [
  { label: "Verified", value: "VERIFIED", icon: <CheckCircle2 className="h-4 w-4" />, color: "#16815D" },
  { label: "Rejected", value: "REJECTED", icon: <XCircle className="h-4 w-4" />, color: "#C63B4E" },
  { label: "Expired", value: "EXPIRED", icon: <Clock className="h-4 w-4" />, color: "#9CA3AF" },
];

const ALL_STATUSES: StatusFilterItem[] = [
  { label: "All Orders", value: "ALL", icon: <ListChecks className="h-4 w-4" />, color: "#7C3AED" },
];

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

  const page = Number(searchParams.get("page") ?? "1");
  const status = searchParams.get("status") ?? "";
  const search = searchParams.get("search") ?? "";

  const adminConsolePath = pathname.replace(/\/billing\/orders.*$/, "");

  function updateParams(updates: Record<string, string>, clearKeys: string[] = []) {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of clearKeys) params.delete(key);
    for (const [k, v] of Object.entries(updates)) {
      if (v) params.set(k, v); else params.delete(k);
    }
    if (!("page" in updates)) params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminKeys.billing.orders.list({ page, status, search }),
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (search) {
        qs.set("page", "1");
        qs.set("pageSize", "500");
      } else {
        if (page > 1) qs.set("page", String(page));
        qs.set("pageSize", String(PAGE_SIZE));
      }
      if (status) {
        qs.set("status", status);
      } else {
        qs.set("status", "ALL");
      }
      const res = await fetch(`/api/internal-admin/billing/orders?${qs}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json() as Promise<{ orders: PaymentOrder[]; totalPages: number; totalItems: number }>;
    },
    staleTime: 15_000,
  });

  const allOrders = data?.orders ?? [];
  const filteredOrders = search
    ? allOrders.filter((o) => {
        const q = search.toLowerCase();
        return (
          o.orderReference.toLowerCase().includes(q) ||
          (o.userDisplayName?.toLowerCase().includes(q) ?? false) ||
          o.userId.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q)
        );
      })
    : allOrders;

  const columns: Column<PaymentOrder>[] = [
    {
      key: "ref",
      header: "Order Ref",
      cell: (o) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <Link href={`${adminConsolePath}/billing/orders/${o.id}`} className="font-mono text-sm font-medium text-[#7C3AED] hover:underline">
              {o.orderReference}
            </Link>
            <CopyIdButton id={o.orderReference} label="Ref" iconOnly />
          </div>
          <CopyIdButton id={o.id} />
        </div>
      ),
    },
    {
      key: "user",
      header: "User",
      cell: (o) => (
        <span className="text-sm text-[#17171B]">{o.userDisplayName ?? o.userId}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      cell: (o) => <Money minorUnits={o.expectedAmountMinorUnits} currency={o.currency} className="text-sm" />,
    },
    {
      key: "method",
      header: "Method",
      cell: (o) => <span className="text-sm text-[#666672]">{o.methodDisplayName ?? o.methodCode ?? "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (o) => <StatusBadge status={o.status} />,
    },
    {
      key: "created",
      header: "Created",
      cell: (o) => (
        <span className="text-sm text-[#666672]" title={formatDateTime(o.createdAt)}>
          {formatRelative(o.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (o) => (
        <Link href={`${adminConsolePath}/billing/orders/${o.id}`} className="text-xs text-[#7C3AED] hover:underline">
          Review
        </Link>
      ),
      className: "w-16",
    },
  ];

  function renderFilterLink(item: StatusFilterItem) {
    const active = status === item.value;
    return (
      <button
        key={item.value}
        type="button"
        onClick={() => { setSearchInput(""); updateParams({ status: item.value }, ["search"]); }}
        className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-colors text-left ${
          active
            ? "bg-[#F3F0FF] text-[#7C3AED] font-medium"
            : "text-[#666672] hover:text-[#17171B] hover:bg-[#F7F7FA]"
        }`}
      >
        <span className="shrink-0" style={{ color: active ? "#7C3AED" : item.color }}>
          {item.icon}
        </span>
        <span className="truncate">{item.label}</span>
      </button>
    );
  }

  return (
    <div>
      <PageHeader title="Payment Orders" description="Review and manage payment orders" />

      <div className="flex gap-6">
        {/* Left sidebar with status filters */}
        <aside className="w-56 shrink-0 hidden lg:block">
          <div className="sticky top-0 space-y-4">
            <div>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]">All</p>
              {ALL_STATUSES.map(renderFilterLink)}
            </div>

            <div>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]">Action Needed</p>
              {ACTION_NEEDED.map(renderFilterLink)}
            </div>

            <div>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]">In Progress</p>
              {IN_PROGRESS.map(renderFilterLink)}
            </div>

            <div>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]">Resolved</p>
              {RESOLVED.map(renderFilterLink)}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-52">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <form onSubmit={(e) => { e.preventDefault(); updateParams({ search: searchInput }); }}>
                <input type="search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by reference or user…" className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E5EA] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]" />
              </form>
            </div>
            {/* Mobile status filter dropdown */}
            <select value={status} onChange={(e) => { setSearchInput(""); updateParams({ status: e.target.value }, ["search"]); }} className="px-3 py-2 text-sm border border-[#E5E5EA] rounded-xl bg-white focus:outline-none cursor-pointer lg:hidden">
              <option value="">Review Queue</option>
              <option value="ALL">All Orders</option>
              <option value="MANUAL_REVIEW">Manual Review</option>
              <option value="RECEIPT_SUBMITTED">Receipt Submitted</option>
              <option value="REVIEW_REQUIRED">Review Required</option>
              <option value="VERIFICATION_PENDING">Verification Pending</option>
              <option value="CREATED,AWAITING_PAYMENT">Awaiting Payment</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          <AdminDataTable
            columns={columns}
            data={filteredOrders}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            keyExtractor={(o) => o.id}
            emptyTitle="No orders found"
            emptyDescription="No payment orders match your filters."
            pagination={search ? undefined : data ? { page, totalPages: data.totalPages, totalItems: data.totalItems, pageSize: PAGE_SIZE, onChange: (p) => updateParams({ page: String(p) }) } : undefined}
          />
        </div>
      </div>
    </div>
  );
}
