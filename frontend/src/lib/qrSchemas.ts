import { z } from "zod";

export const qrFormSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .refine((v) => {
      try {
        new URL(v);
        return true;
      } catch {
        return false;
      }
    }, "Please enter a valid URL"),
  expires_at: z.string().optional(),
});

export type QrFormValues = z.infer<typeof qrFormSchema>;
