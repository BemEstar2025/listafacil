"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Item = {
  id: string;
  nome: string;
  quantidade: number;
  especificacao: string | null;
  observacao: string | null;
  obrigatorio: boolean;
  categoria: string;
};

export default function ListaItens({ listaId, itens }: { listaId: string; itens: Item[] }) {
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
      quantidade: Number(form.get("quantidade")),
      especificacao: form.get("especificacao") || undefined,
      observacao: form.get("observacao") || undefined,
      obrigatorio: form.get("obrigatorio") === "on",
      categoria: form.get("categoria"),
    };

    const res = await fetch(`/api/listas/${listaId}/itens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setCarregando(false);

    if (!res.ok) {
      setErro("Erro ao adicionar item.");
      return;
    }

    e.currentTarget.reset();
    router.refresh();
  }

  async function removerItem(itemId: string) {
    await fetch(`/api/listas/${listaId}/itens/${itemId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Itens da lista</h2>

      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-3 rounded-md border border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Nome do item
            <input name="nome" required placeholder="Caderno universitário 200 folhas" className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Quantidade
            <input name="quantidade" type="number" min={1} required defaultValue={1} className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
          </label>
          <label className="col-span-2 flex flex-col gap-1 text-sm font-medium">
            Especificação
            <input name="especificacao" placeholder="espiral, capa dura, sem pauta" className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
          </label>
          <label className="col-span-2 flex flex-col gap-1 text-sm font-medium">
            Observação (opcional)
            <input name="observacao" className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Categoria
            <select name="categoria" className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal">
              <option value="PAPELARIA">Papelaria</option>
              <option value="HIGIENE">Higiene</option>
              <option value="UNIFORME">Uniforme</option>
              <option value="OUTRO">Outro</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input name="obrigatorio" type="checkbox" defaultChecked /> Obrigatório
          </label>
        </div>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <button
          type="submit"
          disabled={carregando}
          className="self-start rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {carregando ? "Adicionando..." : "Adicionar item"}
        </button>
      </form>

      {itens.length === 0 && <p className="text-sm text-gray-500">Nenhum item cadastrado ainda.</p>}
      <ul className="flex flex-col gap-2">
        {itens.map((item) => (
          <li key={item.id} className="flex items-start justify-between rounded-md border border-gray-200 p-3">
            <div>
              <p className="font-medium">
                {item.quantidade}x {item.nome} {!item.obrigatorio && <span className="text-xs text-gray-400">(opcional)</span>}
              </p>
              {item.especificacao && <p className="text-sm text-gray-500">{item.especificacao}</p>}
              {item.observacao && <p className="text-xs text-gray-400">Obs: {item.observacao}</p>}
              <p className="text-xs uppercase text-gray-400">{item.categoria}</p>
            </div>
            <button onClick={() => removerItem(item.id)} className="text-sm text-red-600 hover:underline">
              Remover
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
