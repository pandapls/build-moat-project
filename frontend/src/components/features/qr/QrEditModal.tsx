"use client";

import Image from "next/image";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { CopyText } from "@/components/ui/CopyText";
import { qrService } from "@/services/qrService";
import { qrKeys } from "@/lib/queryClient";
import { qrFormSchema } from "@/lib/qrSchemas";
import type { QrCode } from "@/types/qr";

interface QrEditModalProps {
  item: QrCode;
  onClose: () => void;
  onSaved: () => void;
}

function toLocalDatetime(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
}

export function QrEditModal({ item, onClose, onSaved }: QrEditModalProps) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: { url: string; expires_at?: string }) =>
      qrService.update(item.token, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qrKeys.lists() });
      onSaved();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => qrService.delete(item.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qrKeys.lists() });
      onSaved();
    },
  });

  const handleDelete = () => {
    if (!confirm("Delete this QR code? This cannot be undone.")) return;
    deleteMutation.mutate();
  };

  const form = useForm({
    defaultValues: {
      url: item.original_url,
      expires_at: toLocalDatetime(item.expires_at),
    },
    onSubmit: async ({ value }) => {
      await updateMutation.mutateAsync({
        url: value.url,
        expires_at: value.expires_at
          ? new Date(value.expires_at).toISOString()
          : undefined,
      });
    },
  });

  const busy = updateMutation.isPending || deleteMutation.isPending;

  return (
    <Modal title="Edit QR Code" onClose={onClose}>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 relative border rounded-xl overflow-hidden bg-gray-50 shrink-0">
          <Image
            src={qrService.getImageUrl(item.token)}
            alt={`QR ${item.token}`}
            fill
            className="object-contain p-2"
            unoptimized
          />
        </div>
        <div className="flex flex-col gap-2 min-w-0">
          <p className="text-xs font-mono text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg break-all">
            {item.token}
          </p>
          <CopyText text={qrService.getShortUrl(item.token)} />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <form.Field
          name="url"
          validators={{ onChange: qrFormSchema.shape.url }}
        >
          {(field) => (
            <Input
              label="Destination URL"
              type="url"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors[0]?.message}
              disabled={busy}
            />
          )}
        </form.Field>

        <form.Field name="expires_at">
          {(field) => (
            <Input
              label="Expiry Date (optional)"
              type="datetime-local"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              disabled={busy}
            />
          )}
        </form.Field>

        {(updateMutation.isError || deleteMutation.isError) && (
          <p className="text-sm text-red-500">
            {(updateMutation.error ?? deleteMutation.error)?.message}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            isLoading={deleteMutation.isPending}
            disabled={busy}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </Button>
          <Button
            type="submit"
            isLoading={updateMutation.isPending}
            disabled={busy}
            className="flex-1"
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
