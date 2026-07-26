"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";

interface DeleteUserDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  displayName: string;
  isSelf: boolean;
  adminConsolePath: string;
}

export function DeleteUserDialog({
  open,
  onClose,
  userId,
  displayName,
  isSelf,
  adminConsolePath,
}: DeleteUserDialogProps) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      if (isSelf) throw new Error("You cannot delete your own account.");
      const res = await fetch(`/api/internal-admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Failed to delete user (${res.status})`);
      }
    },
    onSuccess: () => {
      toast.success(`${displayName}'s account has been deleted`);
      onClose();
      router.push(`${adminConsolePath}/users`);
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
        title="Cannot delete your own account"
        description="For security reasons, you cannot delete your own admin account."
        confirmLabel="OK"
        cancelLabel=""
      />
    );
  }

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={() => mutation.mutate()}
      title="Permanently delete user"
      description={`This will permanently delete ${displayName}'s account and all associated data. This action cannot be undone.`}
      confirmLabel="Delete permanently"
      cancelLabel="Keep account"
      variant="danger"
      isLoading={mutation.isPending}
      typeToConfirm="DELETE"
    />
  );
}
