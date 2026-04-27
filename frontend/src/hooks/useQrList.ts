"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { qrService } from "@/services/qrService";
import { qrKeys } from "@/lib/queryClient";

const PAGE_SIZE = 20;

export function useQrList() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: qrKeys.list(page, PAGE_SIZE),
    queryFn: () => qrService.list(page, PAGE_SIZE),
    placeholderData: (prev) => prev,
  });

  return {
    items: query.data ?? [],
    page,
    hasMore: (query.data?.length ?? 0) === PAGE_SIZE,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error?.message ?? null,
    goToPage: setPage,
    refresh: () =>
      queryClient.refetchQueries({
        queryKey: qrKeys.list(page, PAGE_SIZE),
        exact: true,
      }),
  };
}
