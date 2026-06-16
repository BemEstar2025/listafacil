"use client";

import { useState } from "react";

type ItemComparativo = {
  itemListaId: string;
  nomeItem: string;
  quantidade: number;
  produtoId: string | null;
  precoUnitario: number | null;
  disponivel: boolean;
};

export default function PapelariaOficialBanner({
  listaId,
  papelariaId,
  nome,
  percentualDisponivel,
  totalEstimado,
  itens,
}: {
  listaId: string;
  papelariaId: string;
  nome: string;
  percentualDisponivel: number;
  totalEstimado: number;
  itens: ItemComparativo[];
}) {
  const [aberto, setAberto] = useState(false);
  const [resultado, setResultado] = useState<{ mensagem: string; orcamentoId: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function solicitar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    const form = new FormData(e.currentTarget);
    const itensDisponiveis = itens.filter((i) => i.disponivel);

    const res = await fetch("/api/publico/orcamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listaId,
        papelariaId,
        responsavelNome: form.get("responsavelNome"),
        responsavelTelefone: form.get("responsavelTelefone"),
        nomeAluno: form.get("nomeAluno") || undefined,
        itens: itensDisponiveis.map((i) => ({
          itemListaId: i.itemListaId,
          produtoId: i.produtoId,
          quantidade: i.quantidade,
          precoUnitario: i.precoUnitario,
        })),
      }),
    });
    setEnviando(false);
    if (!res.ok) return;
    const data = await res.json();
    setResultado({ mensagem: data.mensagem, orcamentoId: data.orcamento.id });
  }

  return (
    <section className="page-header">
      <span className="badge" style={{ background: "rgba(255,255,255,.2)", color: "#fff" }}>
        ✓ Papelaria parceira oficial desta turma
      </span>
      <h2 className="mt-2 text-xl font-bold">{nome}</h2>
      <p className="mt-1 text-sm text-violet-100">
        Negociamos o melhor preço para a {nome} fornecer a lista desta turma — {percentualDisponivel}%
        dos itens disponíveis, total estimado de R$ {totalEstimado.toFixed(2)}.
      </p>

      {!aberto && !resultado && (
        <button onClick={() => setAberto(true)} className="mt-4 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-violet-700">
          Solicitar orçamento com a papelaria oficial
        </button>
      )}

      {aberto && !resultado && (
        <form onSubmit={solicitar} className="mt-4 flex flex-col gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
          <input name="responsavelNome" required placeholder="Seu nome" className="input bg-white" />
          <input name="responsavelTelefone" required placeholder="Seu WhatsApp (DDI+DDD+número)" className="input bg-white" />
          <input name="nomeAluno" placeholder="Nome do aluno(a)" className="input bg-white" />
          <button type="submit" disabled={enviando} className="self-start rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 disabled:opacity-50">
            {enviando ? "Enviando..." : "Confirmar solicitação"}
          </button>
        </form>
      )}

      {resultado && (
        <div className="mt-4 rounded-2xl bg-white/10 p-4 backdrop-blur">
          <p className="text-sm">Orçamento solicitado! Acompanhe e converse com a papelaria sem expor seu telefone.</p>
          <a href={`/orcamento/${resultado.orcamentoId}`} className="mt-3 inline-block rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-violet-700">
            Abrir chat e acompanhar status
          </a>
        </div>
      )}
    </section>
  );
}
