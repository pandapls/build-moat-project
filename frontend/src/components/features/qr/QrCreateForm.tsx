"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { qrFormSchema } from "@/lib/qrSchemas";
import type { CreateQrRequest } from "@/types/qr";

interface QrCreateFormProps {
  onSubmit: (data: CreateQrRequest) => void;
  isLoading: boolean;
}

export function QrCreateForm({ onSubmit, isLoading }: QrCreateFormProps) {
  const form = useForm({
    defaultValues: { url: "", expires_at: "" },
    onSubmit: async ({ value }) => {
      const payload: CreateQrRequest = { url: value.url };
      if (value.expires_at) {
        payload.expires_at = new Date(value.expires_at).toISOString();
      }
      onSubmit(payload);
    },
  });

  return (
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
            placeholder="https://example.com"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]?.message}
            disabled={isLoading}
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
            disabled={isLoading}
          />
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <Button
            type="submit"
            disabled={!canSubmit || isLoading}
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Generate QR Code
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
