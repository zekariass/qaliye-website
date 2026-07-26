"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { adminKeys } from "@/lib/admin/query-keys";

interface ChangeRoleDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  displayName: string;
  newRole: string;
  isSelf: boolean;
}

export function ChangeRoleDialog({
  open,
  onClose,
  userId,
  displayName,
  newRole,
  isSelf,
}: ChangeRoleDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (isSelf) throw new Error("You cannot modify your own role.");
      const res = await fetch(`/api/internal-admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Failed to update role (${res.status})`);
      }
    },
    onSuccess: () => {
      toast.success(`${displayName}'s role updated to ${newRole}`);
      queryClient.invalidateQueries({ queryKey: adminKeys.users.list({}) });
      queryClient.invalidateQueries({ queryKey: adminKeys.users.detail(userId) });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (isSelf) {
    return (
      <ConfirmDialog
        open={open}
        onClose={onClose}
        onConfirm={onClose}
        title="Cannot modify your own role"
        description="For security reasons, you cannot change your own role. Ask another admin to make this change."
        confirmLabel="OK"
        cancelLabel=""
        variant="default"
      />
    );
  }

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={() => mutation.mutate()}
      title="Change user role"
      description={`Change ${displayName}'s role to ${newRole}? This will affect what actions they can perform in the admin console.`}
      confirmLabel={`Set as ${newRole}`}
      variant="default"
      isLoading={mutation.isPending}
    />
  );
}
