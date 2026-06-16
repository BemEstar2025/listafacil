"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({
  endpoint = "/api/auth/logout",
  redirectTo = "/",
}: {
  endpoint?: string;
  redirectTo?: string;
}) {
  const router = useRouter();

  async function sair() {
    await fetch(endpoint, { method: "POST" });
    router.push(redirectTo);
  }

  return (
    <button onClick={sair} className="btn-outline text-sm">
      Sair
    </button>
  );
}
