"use client";

import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/ui/Modal";
import { qrService } from "@/services/qrService";
import { qrKeys } from "@/lib/queryClient";
import type { QrCode } from "@/types/qr";

interface QrAnalyticsModalProps {
  item: QrCode;
  onClose: () => void;
}

export function QrAnalyticsModal({ item, onClose }: QrAnalyticsModalProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: qrKeys.detail(item.token),
    queryFn: () => qrService.getAnalytics(item.token),
  });

  return (
    <Modal title="Scan Analytics" onClose={onClose} size="sm">
      <p className="text-xs font-mono text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg break-all">
        {item.token}
      </p>

      {isLoading && (
        <p className="text-sm text-gray-400 text-center py-4">Loading…</p>
      )}

      {isError && (
        <p className="text-sm text-red-500 text-center">{error.message}</p>
      )}

      {data && (
        <div className="flex flex-col items-center gap-2 py-4">
          <span className="text-6xl font-bold text-gray-900">{data.total_scans}</span>
          <span className="text-sm text-gray-500">total scans</span>
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 border rounded-xl"
      >
        Close
      </button>
    </Modal>
  );
}
