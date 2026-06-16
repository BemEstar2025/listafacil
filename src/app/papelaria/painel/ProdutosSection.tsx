"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Produto = {
  id: string;
  nome: string;
  categoria: string;
  marca: string | null;
  especificacao: string | null;
  preco: number;
  estoque: number;
  esgotado: boolean;
};

export default function ProdutosSection({ produtosIniciais }: { produtosIniciais: Produto[] }) {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [msgImport, setMsgImport] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      nome: form.get("nome"),
      categoria: form.get("categoria"),
      marca: form.get("marca") || undefined,
      especificacao: form.get("especificacao") || undefined,
      preco: Number(form.get("preco")),
      estoque: Number(form.get("estoque") || 0),
    };

    const res = await fetch("/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setCarregando(false);

    if (!res.ok) {
      setErro("Erro ao cadastrar produto.");
      return;
    }

    e.currentTarget.reset();
    router.refresh();
  }

  async function handleImport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsgImport(null);
    const arquivo = fileRef.current?.files?.[0];
    if (!arquivo) return;

    const formData = new FormData();
    formData.append("arquivo", arquivo);

    const res = await fetch("/api/produtos/importar", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setMsgImport(data.erro ?? "Erro ao importar planilha.");
      return;
    }

    setMsgImport(`${data.importados} produto(s) importado(s) com sucesso.`);
    if (fileRef.current) fileRef.current.value = "";
    router.refresh();
  }

  async function alternarEsgotado(produto: Produto) {
    await fetch(`/api/produtos/${produto.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ esgotado: !produto.esgotado }),
    });
    router.refresh();
  }

  async function removerProduto(id: string) {
    await fetch(`/api/produtos/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold">Produtos</h2>

      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-3 rounded-md border border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Nome
            <input name="nome" required className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Categoria
            <input name="categoria" required placeholder="caderno, caneta..." className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Marca
            <input name="marca" className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Especificação
            <input name="especificacao" className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Preço (R$)
            <input name="preco" type="number" step="0.01" required className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Estoque
            <input name="estoque" type="number" defaultValue={0} className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
          </label>
        </div>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <button
          type="submit"
          disabled={carregando}
          className="self-start rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {carregando ? "Salvando..." : "Adicionar produto"}
        </button>
      </form>

      <form onSubmit={handleImport} className="mb-6 flex flex-wrap items-center gap-3 rounded-md border border-dashed border-gray-300 p-4">
        <span className="text-sm text-gray-600">
          Importar catálogo (.xlsx/.csv com colunas: Nome | Categoria | Marca | Especificação | Preço | Estoque)
        </span>
        <input ref={fileRef} type="file" accept=".xlsx,.csv" required className="text-sm" />
        <button type="submit" className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
          Importar
        </button>
        {msgImport && <span className="text-sm text-gray-600">{msgImport}</span>}
      </form>

      <ul className="flex flex-col gap-2">
        {produtosIniciais.map((produto) => (
          <li key={produto.id} className="flex items-center justify-between rounded-md border border-gray-200 p-3">
            <div>
              <p className="font-medium">
                {produto.nome} {produto.esgotado && <span className="text-xs text-red-500">(esgotado)</span>}
              </p>
              <p className="text-sm text-gray-500">
                {produto.categoria} {produto.marca && `· ${produto.marca}`} · R$ {produto.preco.toFixed(2)} · estoque: {produto.estoque}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => alternarEsgotado(produto)} className="text-sm text-blue-600 hover:underline">
                {produto.esgotado ? "Marcar disponível" : "Marcar esgotado"}
              </button>
              <button onClick={() => removerProduto(produto.id)} className="text-sm text-red-600 hover:underline">
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
