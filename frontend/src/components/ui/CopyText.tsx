"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CopyTextProps {
  text: string;
  variant?: "block" | "inline";
  className?: string;
}

export function CopyText({ text, variant = "inline", className }: CopyTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === "block") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className="flex-1 bg-gray-50 border rounded-lg px-3 py-2 text-gray-700 truncate text-sm">
          {text}
        </span>
        <button
          onClick={handleCopy}
          className="shrink-0 text-sm px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5 min-w-0", className)}>
      <span className="text-xs text-gray-600 truncate" title={text}>
        {text}
      </span>
      <button
        onClick={handleCopy}
        className="shrink-0 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
