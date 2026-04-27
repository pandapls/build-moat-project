"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { QrListTable } from "@/components/features/qr/QrListTable";
import { useQrList } from "@/hooks/useQrList";

export default function QrListPage() {
  const { items, page, hasMore, isLoading, isFetching, error, goToPage, refresh } =
    useQrList();

  return (
    <main className="flex-1 px-4 py-12">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="inline-block mb-2 text-xs text-gray-400 hover:text-gray-600"
            >
              ← Back to Tools
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">All QR Codes</h1>
            <p className="mt-1 text-sm text-gray-500">
              All active QR codes, newest first
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={refresh} disabled={isFetching}>
              Refresh
            </Button>
            <Link href="/qr">
              <Button>+ New QR Code</Button>
            </Link>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {isLoading ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Loading...
          </div>
        ) : (
          <QrListTable
            items={items}
            page={page}
            hasMore={hasMore}
            onPageChange={goToPage}
            onRefresh={refresh}
            isFetching={isFetching}
          />
        )}
      </div>
    </main>
  );
}
