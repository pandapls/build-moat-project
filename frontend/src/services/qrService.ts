import apiClient from "@/lib/apiClient";
import type {
  AnalyticsResponse,
  CreateQrRequest,
  CreateQrResponse,
  ListQrResponse,
  QrCode,
  UpdateQrRequest,
} from "@/types/qr";

export const qrService = {
  create: async (data: CreateQrRequest): Promise<CreateQrResponse> => {
    const res = await apiClient.post<CreateQrResponse>("/api/qr/create", data);
    return res.data;
  },

  getByToken: async (token: string): Promise<QrCode> => {
    const res = await apiClient.get<QrCode>(`/api/qr/${token}`);
    return res.data;
  },

  update: async (token: string, data: UpdateQrRequest): Promise<void> => {
    await apiClient.patch(`/api/qr/${token}`, data);
  },

  delete: async (token: string): Promise<void> => {
    await apiClient.delete(`/api/qr/${token}`);
  },

  getAnalytics: async (token: string): Promise<AnalyticsResponse> => {
    const res = await apiClient.get<AnalyticsResponse>(
      `/api/qr/${token}/analytics`
    );
    return res.data;
  },

  list: async (page = 1, size = 20): Promise<ListQrResponse> => {
    const res = await apiClient.get<ListQrResponse>("/api/qr", {
      params: { page, size },
    });
    return Array.isArray(res.data) ? res.data : [];
  },

  getImageUrl: (token: string): string => {
    const base =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    return `${base}/api/qr/${token}/images`;
  },

  getShortUrl: (token: string): string => {
    const base =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    return `${base}/r/${token}`;
  },
};
