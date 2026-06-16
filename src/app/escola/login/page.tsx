"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginEscolaPage() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/escola/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), senha: form.get("senha") }),
    });

    setCarregando(false);

    if (!res.ok) {
      setErro("E-mail ou senha incorretos.");
      return;
    }

    router.push("/escola/painel");
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">Login da Escola</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="label">
          E-mail
          <input name="email" type="email" required className="input" />
        </label>
        <label className="label">
          Senha
          <input name="senha" type="password" required className="input" />
        </label>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <button
          type="submit"
          disabled={carregando}
          className="btn-primary"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Ainda não tem conta?{" "}
        <a href="/escola/cadastro" className="link-primary">
          Cadastrar escola
        </a>
      </p>
    </main>
  );
}
