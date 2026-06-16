"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "../../AuthCard";

export default function AdminLoginPage() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha: form.get("senha") }),
    });

    setCarregando(false);

    if (!res.ok) {
      setErro("Senha incorreta.");
      return;
    }

    router.push("/admin/painel");
  }

  return (
    <AuthCard titulo="Admin ListaFácil" emoji="🔐">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="label">
          Senha de administrador
          <input name="senha" type="password" required className="input" />
        </label>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <button type="submit" disabled={carregando} className="btn-primary">
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </AuthCard>
  );
}
