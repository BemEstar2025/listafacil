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
        <label className="flex flex-col gap-1 text-sm font-medium">
          E-mail
          <input name="email" type="email" required className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Senha
          <input name="senha" type="password" required className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
        </label>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <button
          type="submit"
          disabled={carregando}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Ainda não tem conta?{" "}
        <a href="/escola/cadastro" className="text-blue-600 underline">
          Cadastrar escola
        </a>
      </p>
    </main>
  );
}
