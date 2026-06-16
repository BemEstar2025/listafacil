"use client";

import { useRouter } from "next/navigation";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-white">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={`border-b border-[var(--border-subtle)] bg-gray-50 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-b border-[var(--border-subtle)] px-4 py-3 ${className}`}>{children}</td>;
}

export function Tr({
  children,
  href,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <tr
      onClick={href ? () => router.push(href) : undefined}
      className={`last:[&_td]:border-b-0 ${href ? "cursor-pointer transition-colors hover:bg-gray-50" : ""} ${className}`}
    >
      {children}
    </tr>
  );
}
