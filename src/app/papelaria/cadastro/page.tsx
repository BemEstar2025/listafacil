"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroPapelariaPage() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      nomeFantasia: form.get("nomeFantasia"),
      razaoSocial: form.get("razaoSocial"),
      cnpj: form.get("cnpj"),
      endereco: form.get("endereco"),
      cep: form.get("cep"),
      whatsapp: form.get("whatsapp"),
      telefone: form.get("telefone") || undefined,
      horario: form.get("horario") || undefined,
      raioKm: Number(form.get("raioKm") || 5),
      entregaDomicilio: form.get("entregaDomicilio") === "on",
      retiradaLocal: form.get("retiradaLocal") === "on",
      email: form.get("email"),
      senha: form.get("senha"),
    };

    const res = await fetch("/api/auth/papelaria/cadastro", {
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

    router.push("/papelaria/painel");
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">Cadastro da Papelaria</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input name="nomeFantasia" label="Nome fantasia" required />
        <Input name="razaoSocial" label="Razão social" required />
        <Input name="cnpj" label="CNPJ" required />
        <Input name="endereco" label="Endereço completo" required />
        <Input name="cep" label="CEP" required />
        <Input name="whatsapp" label="WhatsApp comercial (DDI+DDD+número)" required />
        <Input name="telefone" label="Telefone (opcional)" />
        <Input name="horario" label="Horário de funcionamento" />
        <Input name="raioKm" label="Raio de atendimento (km)" type="number" />
        <label className="flex items-center gap-2 text-sm font-medium">
          <input name="entregaDomicilio" type="checkbox" /> Entrega a domicílio
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input name="retiradaLocal" type="checkbox" defaultChecked /> Retirada no local
        </label>
        <Input name="email" type="email" label="E-mail" required />
        <Input name="senha" type="password" label="Senha" required />
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <button
          type="submit"
          disabled={carregando}
          className="btn-accent"
        >
          {carregando ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Já tem conta?{" "}
        <a href="/papelaria/login" className="link-accent">
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
