"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroEscolaPage() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      nome: form.get("nome"),
      cnpj: form.get("cnpj"),
      endereco: form.get("endereco"),
      telefone: form.get("telefone"),
      email: form.get("email"),
      responsavelNome: form.get("responsavelNome"),
      senha: form.get("senha"),
    };

    const res = await fetch("/api/auth/escola/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setCarregando(false);

    if (!res.ok) {
      const data = await res.json();
      setErro(typeof data.erro === "string" ? data.erro : "Erro ao cadastrar. Verifique os dados.");
      return;
    }

    router.push("/escola/painel");
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">Cadastro da Escola</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input name="nome" label="Nome da escola" required />
        <Input name="cnpj" label="CNPJ" required />
        <Input name="endereco" label="Endereço completo" required />
        <Input name="telefone" label="Telefone" required />
        <Input name="email" type="email" label="E-mail institucional" required />
        <Input name="responsavelNome" label="Nome do responsável administrativo" required />
        <Input name="senha" type="password" label="Senha" required />
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <button
          type="submit"
          disabled={carregando}
          className="btn-primary"
        >
          {carregando ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Já tem conta?{" "}
        <a href="/escola/login" className="link-primary">
          Entrar
        </a>
      </p>
    </main>
  );
}

function Input({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="label">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="input"
      />
    </label>
  );
}
