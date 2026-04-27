import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export const qrKeys = {
  all: ["qr"] as const,
  lists: () => [...qrKeys.all, "list"] as const,
  list: (page: number, size: number) =>
    [...qrKeys.lists(), { page, size }] as const,
  detail: (token: string) => [...qrKeys.all, "detail", token] as const,
};
