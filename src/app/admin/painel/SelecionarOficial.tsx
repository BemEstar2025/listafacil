"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SelecionarOficial({
  listaId,
  papelarias,
  papelariaAtualId,
}: {
  listaId: string;
  papelarias: { id: string; nomeFantasia: string; cep: string }[];
  papelariaAtualId: string | null;
}) {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const papelariaId = e.target.value || null;
    setSalvando(true);
    await fetch(`/api/admin/listas/${listaId}/papelaria-oficial`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ papelariaId }),
    });
    setSalvando(false);
    router.refresh();
  }

  return (
    <select
      defaultValue={papelariaAtualId ?? ""}
      onChange={handleChange}
      disabled={salvando}
      className="input px-3 py-1.5 text-sm"
    >
      <option value="">Sem parceira oficial</option>
      {papelarias.map((p) => (
        <option key={p.id} value={p.id}>
          {p.nomeFantasia} ({p.cep})
        </option>
      ))}
    </select>
  );
}
