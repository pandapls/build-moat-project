"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { QrCreateForm } from "@/components/features/qr/QrCreateForm";
import { QrResult } from "@/components/features/qr/QrResult";
import { useCreateQr } from "@/hooks/useQrCode";

export default function QrPage() {
  const mutation = useCreateQr();

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <Link
            href="/"
            className="inline-block mb-4 text-xs text-gray-400 hover:text-gray-600"
          >
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">QR Code Generator</h1>
          <p className="mt-2 text-gray-500 text-sm">
            Create dynamic QR codes with trackable short links
          </p>
          <Link
            href="/qr/list"
            className="mt-3 inline-block text-sm text-indigo-600 hover:underline"
          >
            View all QR codes →
          </Link>
        </div>

        {mutation.data ? (
          <QrResult result={mutation.data} onReset={() => mutation.reset()} />
        ) : (
          <Card>
            <QrCreateForm
              onSubmit={mutation.mutate}
              isLoading={mutation.isPending}
            />
            {mutation.isError && (
              <p className="mt-4 text-sm text-red-500 text-center">
                {mutation.error.message}
              </p>
            )}
          </Card>
        )}
      </div>
    </main>
  );
}
