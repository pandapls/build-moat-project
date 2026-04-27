"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qrService } from "@/services/qrService";
import { qrKeys } from "@/lib/queryClient";
import type { CreateQrRequest, CreateQrResponse } from "@/types/qr";

export function useCreateQr() {
  const queryClient = useQueryClient();

  return useMutation<CreateQrResponse, Error, CreateQrRequest>({
    mutationFn: (data) => qrService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qrKeys.lists() });
    },
  });
}
