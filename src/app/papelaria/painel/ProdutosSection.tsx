"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Table, Th, Td, Tr } from "../../Table";

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

      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-3 card p-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="label">
            Nome
            <input name="nome" required className="input" />
          </label>
          <label className="label">
            Categoria
            <input name="categoria" required placeholder="caderno, caneta..." className="input" />
          </label>
          <label className="label">
            Marca
            <input name="marca" className="input" />
          </label>
          <label className="label">
            Especificação
            <input name="especificacao" className="input" />
          </label>
          <label className="label">
            Preço (R$)
            <input name="preco" type="number" step="0.01" required className="input" />
          </label>
          <label className="label">
            Estoque
            <input name="estoque" type="number" defaultValue={0} className="input" />
          </label>
        </div>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <button
          type="submit"
          disabled={carregando}
          className="btn-accent self-start"
        >
          {carregando ? "Salvando..." : "Adicionar produto"}
        </button>
      </form>

      <form onSubmit={handleImport} className="mb-6 flex flex-wrap items-center gap-3 card border-dashed p-4">
        <span className="text-sm text-gray-600">
          Importar catálogo (.xlsx/.csv com colunas: Nome | Categoria | Marca | Especificação | Preço | Estoque)
        </span>
        <input ref={fileRef} type="file" accept=".xlsx,.csv" required className="text-sm" />
        <button type="submit" className="btn-outline text-sm px-3 py-1.5">
          Importar
        </button>
        {msgImport && <span className="text-sm text-gray-600">{msgImport}</span>}
      </form>

      {produtosIniciais.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum produto cadastrado ainda.</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Produto</Th>
              <Th>Categoria</Th>
              <Th>Preço</Th>
              <Th>Estoque</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {produtosIniciais.map((produto) => (
              <Tr key={produto.id}>
                <Td className="font-medium text-[var(--foreground)]">
                  {produto.nome}
                  {produto.marca && <span className="text-gray-400"> · {produto.marca}</span>}
                </Td>
                <Td>{produto.categoria}</Td>
                <Td>R$ {produto.preco.toFixed(2)}</Td>
                <Td>{produto.estoque}</Td>
                <Td>
                  {produto.esgotado ? (
                    <span className="badge" style={{ background: "#fee2e2", color: "#b91c1c" }}>Esgotado</span>
                  ) : (
                    <span className="badge" style={{ background: "#dcfce7", color: "#15803d" }}>Disponível</span>
                  )}
                </Td>
                <Td className="text-right">
                  <button onClick={() => alternarEsgotado(produto)} className="mr-3 text-sm link-primary">
                    {produto.esgotado ? "Marcar disponível" : "Marcar esgotado"}
                  </button>
                  <button onClick={() => removerProduto(produto.id)} className="text-sm text-red-600 hover:underline">
                    Remover
                  </button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
