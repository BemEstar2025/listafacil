"use client";

import { useRef, useState } from "react";
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
  const [msgImport, setMsgImport] = useState<string | null>(null);
  const [mostrarManual, setMostrarManual] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

  async function handleImport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsgImport(null);
    const arquivo = fileRef.current?.files?.[0];
    if (!arquivo) return;

    const formData = new FormData();
    formData.append("arquivo", arquivo);

    const res = await fetch(`/api/listas/${listaId}/itens/importar`, { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setMsgImport(data.erro ?? "Erro ao importar planilha.");
      return;
    }

    setMsgImport(`${data.importados} item(ns) importado(s) com sucesso.`);
    if (fileRef.current) fileRef.current.value = "";
    router.refresh();
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Itens da lista</h2>

      <form onSubmit={handleImport} className="mb-4 flex flex-wrap items-center gap-3 card border-dashed p-4">
        <span className="text-sm text-gray-600">
          Importar lista de uma planilha (.xlsx/.csv com colunas: Nome | Quantidade | Especificação | Observação | Obrigatorio | Categoria)
        </span>
        <input ref={fileRef} type="file" accept=".xlsx,.csv" required className="text-sm" />
        <button type="submit" className="btn-outline text-sm px-3 py-1.5">
          Importar
        </button>
        {msgImport && <span className="text-sm text-gray-600">{msgImport}</span>}
      </form>

      {!mostrarManual ? (
        <button
          onClick={() => setMostrarManual(true)}
          className="mb-4 text-sm link-primary"
        >
          ou adicionar item manualmente
        </button>
      ) : (
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-3 card p-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="label">
            Nome do item
            <input name="nome" required placeholder="Caderno universitário 200 folhas" className="input" />
          </label>
          <label className="label">
            Quantidade
            <input name="quantidade" type="number" min={1} required defaultValue={1} className="input" />
          </label>
          <label className="label col-span-2">
            Especificação
            <input name="especificacao" placeholder="espiral, capa dura, sem pauta" className="input" />
          </label>
          <label className="label col-span-2">
            Observação (opcional)
            <input name="observacao" className="input" />
          </label>
          <label className="label">
            Categoria
            <select name="categoria" className="input">
              <option value="PAPELARIA">Papelaria</option>
              <option value="HIGIENE">Higiene</option>
              <option value="UNIFORME">Uniforme</option>
              <option value="OUTRO">Outro</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input name="obrigatorio" type="checkbox" defaultChecked className="h-4 w-4 accent-violet-600" /> Obrigatório
          </label>
        </div>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <button
          type="submit"
          disabled={carregando}
          className="btn-primary self-start"
        >
          {carregando ? "Adicionando..." : "Adicionar item"}
        </button>
      </form>
      )}

      {itens.length === 0 && <p className="text-sm text-gray-500">Nenhum item cadastrado ainda.</p>}
      <ul className="flex flex-col gap-2">
        {itens.map((item) => (
          <li key={item.id} className="flex items-start justify-between card p-3">
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
