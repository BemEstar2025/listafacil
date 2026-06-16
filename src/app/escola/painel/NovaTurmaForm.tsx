"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovaTurmaForm() {
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
      anoLetivo: Number(form.get("anoLetivo")),
      periodo: form.get("periodo"),
      qtdAlunos: Number(form.get("qtdAlunos")),
      professor: form.get("professor"),
    };

    const res = await fetch("/api/turmas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setCarregando(false);

    if (!res.ok) {
      setErro("Erro ao criar turma. Verifique os dados.");
      return;
    }

    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-md border border-gray-200 p-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Nome da turma
          <input name="nome" required placeholder="1º Ano A" className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Ano letivo
          <input name="anoLetivo" type="number" required defaultValue={2026} className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Período
          <select name="periodo" required className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal">
            <option value="MANHA">Manhã</option>
            <option value="TARDE">Tarde</option>
            <option value="INTEGRAL">Integral</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Qtd. estimada de alunos
          <input name="qtdAlunos" type="number" required className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-sm font-medium">
          Professor responsável
          <input name="professor" required className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
        </label>
      </div>
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <button
        type="submit"
        disabled={carregando}
        className="self-start rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {carregando ? "Criando..." : "Criar turma"}
      </button>
    </form>
  );
}
