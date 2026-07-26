export const adminKeys = {
  dashboard: () => ["admin", "dashboard"] as const,

  users: {
    list: (params: Record<string, unknown>) => ["admin", "users", "list", params] as const,
    detail: (userId: string) => ["admin", "users", userId] as const,
  },

  moderation: {
    counts: () => ["admin", "moderation", "counts"] as const,
    manualReview: () => ["admin", "moderation", "manual-review"] as const,
    reviewQueue: (params: Record<string, unknown>) =>
      ["admin", "moderation", "queue", params] as const,
  },

  billing: {
    orders: {
      list: (params: Record<string, unknown>) =>
        ["admin", "billing", "orders", "list", params] as const,
      detail: (orderId: string) =>
        ["admin", "billing", "orders", orderId] as const,
    },
    campaigns: {
      list: (params: Record<string, unknown>) =>
        ["admin", "billing", "campaigns", "list", params] as const,
      detail: (id: string) => ["admin", "billing", "campaigns", id] as const,
      redemptions: (id: string, params: Record<string, unknown>) =>
        ["admin", "billing", "campaigns", id, "redemptions", params] as const,
    },
    subscriptionProducts: () => ["admin", "billing", "subscription-products"] as const,
  },

  transactions: {
    list: (params: Record<string, unknown>) =>
      ["admin", "transactions", "list", params] as const,
  },

  notificationCampaigns: {
    list: (params: Record<string, unknown>) =>
      ["admin", "notification-campaigns", "list", params] as const,
    detail: (id: string) => ["admin", "notification-campaigns", id] as const,
  },

  catalog: {
    languages: () => ["admin", "catalog", "languages"] as const,
    ethnicities: () => ["admin", "catalog", "ethnicities"] as const,
  },

  auditLog: {
    list: (params: Record<string, unknown>) =>
      ["admin", "audit-log", "list", params] as const,
  },
} as const;
