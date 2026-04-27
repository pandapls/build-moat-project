export interface CreateQrRequest {
  url: string;
  expires_at?: string;
}

export interface CreateQrResponse {
  token: string;
  short_url: string;
  qr_code_url: string;
  original_url: string;
}

export interface QrCode {
  token: string;
  original_url: string;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  deleted_at: string | null;
  scan_count: number;
}

export interface UpdateQrRequest {
  url?: string;
  expires_at?: string;
}

export interface AnalyticsResponse {
  token: string;
  total_scans: number;
  scans_by_day: { date: string; count: number }[];
}

export type ListQrResponse = QrCode[];
