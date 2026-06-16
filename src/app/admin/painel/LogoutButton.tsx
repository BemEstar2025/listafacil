"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function sair() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <button onClick={sair} className="rounded-full border-2 border-white/60 px-4 py-2 text-sm font-semibold text-white">
      Sair
    </button>
  );
}
