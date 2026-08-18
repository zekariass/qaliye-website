"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { adminKeys } from "@/lib/admin/query-keys";
import type { UserStatus } from "@/lib/admin/constants";

interface ChangeStatusDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  displayName: string;
  currentStatus: UserStatus | string;
  newStatus: UserStatus;
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Activate",
  SUSPENDED: "Suspend",
  DEACTIVATED: "Deactivate",
  BANNED: "Ban",
};

const STATUS_CONFIRMATIONS: Record<string, string> = {
  ACTIVE: "This will restore the user's access to the platform.",
  SUSPENDED: "The user will lose access temporarily and can be reinstated.",
  DEACTIVATED: "The user will be deactivated and lose access to the platform.",
  BANNED: "The user will be permanently banned from the platform.",
};

export function ChangeStatusDialog({
  open,
  onClose,
  userId,
  displayName,
  currentStatus,
  newStatus,
}: ChangeStatusDialogProps) {
  const queryClient = useQueryClient();
  const isBan = newStatus === "BANNED";

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/internal-admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Failed to update status (${res.status})`);
      }
    },
    onSuccess: () => {
      toast.success(
        `${displayName} is now ${newStatus.toLowerCase().replace("_", " ")}`
      );
      queryClient.invalidateQueries({ queryKey: adminKeys.users.list({}) });
      queryClient.invalidateQueries({ queryKey: adminKeys.users.detail(userId) });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={() => mutation.mutate()}
      title={`${STATUS_LABELS[newStatus] ?? newStatus} user`}
      description={`Are you sure you want to ${STATUS_LABELS[newStatus]?.toLowerCase() ?? newStatus.toLowerCase()} ${displayName}? ${STATUS_CONFIRMATIONS[newStatus] ?? ""}`}
      confirmLabel={STATUS_LABELS[newStatus] ?? newStatus}
      variant={isBan ? "danger" : "default"}
      isLoading={mutation.isPending}
      typeToConfirm={isBan ? "BAN" : undefined}
    />
  );
}
