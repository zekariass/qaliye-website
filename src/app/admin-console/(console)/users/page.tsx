"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { adminKeys } from "@/lib/admin/query-keys";
import { formatDateTime, formatRelative } from "@/lib/admin/dates";
import { AdminDataTable, type Column } from "@/components/admin/tables/AdminDataTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { CopyIdButton } from "@/components/admin/shared/CopyIdButton";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import type { AdminUser } from "@/lib/admin/adapters";
import { Search, SlidersHorizontal, User } from "lucide-react";
import Link from "next/link";

const PAGE_SIZE = 20;

export default function UsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const role = searchParams.get("role") ?? "";

  const [searchInput, setSearchInput] = useState(search);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  const queryParams = { page, pageSize: PAGE_SIZE, search, status, role };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminKeys.users.list(queryParams),
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (page > 1) qs.set("page", String(page));
      qs.set("pageSize", String(PAGE_SIZE));
      if (search) qs.set("search", search);
      if (status) qs.set("status", status);
      if (role) qs.set("role", role);
      const res = await fetch(`/api/internal-admin/users?${qs}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json() as Promise<{ users: AdminUser[]; totalPages: number; totalItems: number }>;
    },
    staleTime: 30_000,
  });

  const adminConsolePath = pathname.replace(/\/users.*$/, "");

  const columns: Column<AdminUser>[] = [
    {
      key: "user",
      header: "User",
      cell: (u) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#EDE2FF] flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-[#7C3AED]" />
          </div>
          <div className="min-w-0">
            <Link
              href={`${adminConsolePath}/users/${u.userId}`}
              className="font-medium text-[#17171B] hover:text-[#7C3AED] truncate block"
            >
              {u.displayName}
            </Link>
            <CopyIdButton id={u.userId} />
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (u) => <StatusBadge status={u.status} />,
    },
    {
      key: "role",
      header: "Role",
      cell: (u) => (
        <span className="text-xs font-medium text-[#666672]">{u.role}</span>
      ),
    },
    {
      key: "gender",
      header: "Gender",
      cell: (u) => (
        <span className="text-sm text-[#666672]">{u.gender ?? "—"}</span>
      ),
    },
    {
      key: "premium",
      header: "Premium",
      cell: (u) => (
        <span className={`text-xs font-medium ${u.isPremium ? "text-[#EA580C]" : "text-[#9CA3AF]"}`}>
          {u.isPremium ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      cell: (u) => (
        <span className="text-sm text-[#666672]" title={formatDateTime(u.createdAt)}>
          {formatRelative(u.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (u) => (
        <Link
          href={`${adminConsolePath}/users/${u.userId}`}
          className="text-xs text-[#7C3AED] hover:underline"
        >
          View
        </Link>
      ),
      className: "w-16",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage user accounts, statuses, and roles"
      />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateParams({ search: searchInput });
            }}
          >
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email, or ID…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E5EA] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
            />
          </form>
        </div>

        <select
          value={status}
          onChange={(e) => updateParams({ status: e.target.value })}
          className="px-3 py-2 text-sm border border-[#E5E5EA] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 cursor-pointer"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BANNED">Banned</option>
          <option value="PENDING_VERIFICATION">Pending Verification</option>
        </select>

        <select
          value={role}
          onChange={(e) => updateParams({ role: e.target.value })}
          className="px-3 py-2 text-sm border border-[#E5E5EA] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 cursor-pointer"
        >
          <option value="">All roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="MODERATOR">Moderator</option>
        </select>
      </div>

      <AdminDataTable
        columns={columns}
        data={data?.users}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        keyExtractor={(u) => u.userId}
        emptyTitle="No users found"
        emptyDescription="Try adjusting your search or filters."
        pagination={
          data
            ? {
                page,
                totalPages: data.totalPages,
                totalItems: data.totalItems,
                pageSize: PAGE_SIZE,
                onChange: (p) => updateParams({ page: String(p) }),
              }
            : undefined
        }
      />
    </div>
  );
}
