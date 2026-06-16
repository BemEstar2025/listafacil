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

    const turma = await res.json();
    router.push(`/escola/painel/turmas/${turma.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 card p-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="label">
          Nome da turma
          <input name="nome" required placeholder="1º Ano A" className="input" />
        </label>
        <label className="label">
          Ano letivo
          <input name="anoLetivo" type="number" required defaultValue={2026} className="input" />
        </label>
        <label className="label">
          Período
          <select name="periodo" required className="input">
            <option value="MANHA">Manhã</option>
            <option value="TARDE">Tarde</option>
            <option value="INTEGRAL">Integral</option>
          </select>
        </label>
        <label className="label">
          Qtd. estimada de alunos
          <input name="qtdAlunos" type="number" required className="input" />
        </label>
        <label className="label col-span-2">
          Professor responsável
          <input name="professor" required className="input" />
        </label>
      </div>
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <button
        type="submit"
        disabled={carregando}
        className="btn-primary self-start"
      >
        {carregando ? "Criando..." : "Criar turma"}
      </button>
    </form>
  );
}
