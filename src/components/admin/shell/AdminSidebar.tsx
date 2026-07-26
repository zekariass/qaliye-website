"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Camera,
  CreditCard,
  ArrowLeftRight,
  Bell,
  SendHorizonal,
  Tag,
  Globe,
  UsersRound,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useAdminShellStore } from "@/stores/admin-shell-store";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  adminOnly?: boolean;
}

const ADMIN_BASE = "/__qaliye_console";

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: `${ADMIN_BASE}`,
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Users",
        href: `${ADMIN_BASE}/users`,
        icon: <Users className="h-4 w-4" />,
      },
      {
        label: "Photo Review",
        href: `${ADMIN_BASE}/photo-review`,
        icon: <Camera className="h-4 w-4" />,
      },
      {
        label: "Payment Orders",
        href: `${ADMIN_BASE}/billing/orders`,
        icon: <CreditCard className="h-4 w-4" />,
      },
      {
        label: "Manual Transactions",
        href: `${ADMIN_BASE}/billing/transactions`,
        icon: <ArrowLeftRight className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Engagement",
    items: [
      {
        label: "Notification Campaigns",
        href: `${ADMIN_BASE}/notifications/campaigns`,
        icon: <Bell className="h-4 w-4" />,
        adminOnly: true,
      },
      {
        label: "Direct Notification",
        href: `${ADMIN_BASE}/notifications/direct`,
        icon: <SendHorizonal className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Growth",
    adminOnly: true,
    items: [
      {
        label: "Promotional Campaigns",
        href: `${ADMIN_BASE}/promotions`,
        icon: <Tag className="h-4 w-4" />,
        adminOnly: true,
      },
    ],
  },
  {
    label: "Catalog",
    adminOnly: true,
    items: [
      {
        label: "Languages",
        href: `${ADMIN_BASE}/catalog/languages`,
        icon: <Globe className="h-4 w-4" />,
        adminOnly: true,
      },
      {
        label: "Ethnicities",
        href: `${ADMIN_BASE}/catalog/ethnicities`,
        icon: <UsersRound className="h-4 w-4" />,
        adminOnly: true,
      },
    ],
  },
  {
    label: "Governance",
    items: [
      {
        label: "Audit Log",
        href: `${ADMIN_BASE}/audit-log`,
        icon: <FileText className="h-4 w-4" />,
        adminOnly: true,
      },
    ],
  },
];

interface AdminSidebarProps {
  role: string;
  adminConsolePath: string;
}

export function AdminSidebar({ role, adminConsolePath }: AdminSidebarProps) {
  const { sidebarCollapsed, toggleSidebar } = useAdminShellStore();
  const rawPathname = usePathname();

  const pathname = rawPathname.replace(adminConsolePath, ADMIN_BASE);

  const isAdmin = role === "ADMIN";

  function isActive(href: string) {
    if (href === ADMIN_BASE) return pathname === ADMIN_BASE || pathname === ADMIN_BASE + "/";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={`h-full flex flex-col bg-[#111318] transition-all duration-300 ease-in-out shrink-0 ${
        sidebarCollapsed ? "w-16" : "w-60"
      }`}
    >
      <div
        className={`flex items-center gap-3 h-16 border-b border-white/10 shrink-0 ${
          sidebarCollapsed ? "justify-center px-3" : "px-4"
        }`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7C3AED]">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">Qaliye Console</p>
            <p className="text-xs text-white/40 truncate capitalize">{role.toLowerCase()}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {NAV_GROUPS.map((group) => {
          if (group.adminOnly && !isAdmin) return null;
          const visibleItems = group.items.filter(
            (item) => !item.adminOnly || isAdmin
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label} className="mb-1">
              {!sidebarCollapsed && (
                <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  {group.label}
                </p>
              )}
              {visibleItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href.replace(ADMIN_BASE, adminConsolePath)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-[#2a2d37] text-white"
                        : "text-white/60 hover:text-white hover:bg-[#1e2128]"
                    } ${sidebarCollapsed ? "justify-center" : ""}`}
                  >
                    <span className={`shrink-0 ${active ? "text-[#A78BFA]" : ""}`}>
                      {item.icon}
                    </span>
                    {!sidebarCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-2 shrink-0">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex w-full items-center justify-center gap-2 px-3 py-2 text-xs text-white/40 hover:text-white hover:bg-[#1e2128] rounded-lg transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
