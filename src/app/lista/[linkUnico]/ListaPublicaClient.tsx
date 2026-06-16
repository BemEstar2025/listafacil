"use client";

import { useMemo, useState } from "react";

type ItemComparativo = {
  itemListaId: string;
  nomeItem: string;
  quantidade: number;
  produtoId: string | null;
  nomeProduto: string | null;
  precoUnitario: number | null;
  disponivel: boolean;
};

type PapelariaComparativo = {
  papelariaId: string;
  nome: string;
  distanciaEstimada: number | null;
  whatsapp: string;
  entregaDomicilio: boolean;
  retiradaLocal: boolean;
  percentualDisponivel: number;
  totalEstimado: number;
  notaMedia: number | null;
  itens: ItemComparativo[];
};

type Filtro = "proxima" | "preco" | "disponibilidade";

export default function ListaPublicaClient({
  listaId,
  escolaNome,
  turmaNome,
}: {
  listaId: string;
  escolaNome: string;
  turmaNome: string;
}) {
  const [cep, setCep] = useState("");
  const [papelarias, setPapelarias] = useState<PapelariaComparativo[] | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [filtro, setFiltro] = useState<Filtro>("disponibilidade");
  const [papelariaSelecionada, setPapelariaSelecionada] = useState<string | null>(null);
  const [resultadoOrcamento, setResultadoOrcamento] = useState<{ mensagem: string; whatsappUrl: string; orcamentoId: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function buscarPapelarias(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setResultadoOrcamento(null);
    const res = await fetch(`/api/publico/papelarias?listaId=${listaId}&cep=${encodeURIComponent(cep)}`);
    const data = await res.json();
    setPapelarias(data);
    setCarregando(false);
  }

  const ordenadas = useMemo(() => {
    if (!papelarias) return [];
    const copia = [...papelarias];
    if (filtro === "preco") copia.sort((a, b) => a.totalEstimado - b.totalEstimado);
    else if (filtro === "disponibilidade") copia.sort((a, b) => b.percentualDisponivel - a.percentualDisponivel);
    else copia.sort((a, b) => (a.distanciaEstimada ?? 0) - (b.distanciaEstimada ?? 0));
    return copia;
  }, [papelarias, filtro]);

  const papelaria = ordenadas.find((p) => p.papelariaId === papelariaSelecionada);

  async function handleSubmitOrcamento(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!papelaria) return;
    setEnviando(true);

    const form = new FormData(e.currentTarget);
    const itensDisponiveis = papelaria.itens.filter((i) => i.disponivel);

    const res = await fetch("/api/publico/orcamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listaId,
        papelariaId: papelaria.papelariaId,
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
    setResultadoOrcamento({ mensagem: data.mensagem, whatsappUrl: data.whatsappUrl, orcamentoId: data.orcamento.id });
  }

  return (
    <section>
      <form onSubmit={buscarPapelarias} className="mb-6 flex gap-2">
        <input
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="Digite seu CEP"
          required
          className="flex-1 rounded-md border border-gray-300 px-3 py-2"
        />
        <button
          type="submit"
          disabled={carregando}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {carregando ? "Buscando..." : "Buscar papelarias"}
        </button>
      </form>

      {papelarias && (
        <>
          <div className="mb-4 flex gap-2 text-sm">
            <span className="text-gray-500">Ordenar por:</span>
            <button onClick={() => setFiltro("preco")} className={filtro === "preco" ? "font-bold text-blue-600" : "text-gray-600"}>
              Menor preço
            </button>
            ·
            <button onClick={() => setFiltro("proxima")} className={filtro === "proxima" ? "font-bold text-blue-600" : "text-gray-600"}>
              Mais próxima
            </button>
            ·
            <button onClick={() => setFiltro("disponibilidade")} className={filtro === "disponibilidade" ? "font-bold text-blue-600" : "text-gray-600"}>
              Maior disponibilidade
            </button>
          </div>

          {ordenadas.length === 0 && <p className="text-sm text-gray-500">Nenhuma papelaria cadastrada ainda.</p>}

          <ul className="mb-6 flex flex-col gap-2">
            {ordenadas.map((p) => (
              <li
                key={p.papelariaId}
                onClick={() => setPapelariaSelecionada(p.papelariaId)}
                className={`cursor-pointer rounded-md border p-3 ${
                  papelariaSelecionada === p.papelariaId ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{p.nome}</p>
                  {p.notaMedia && <span className="text-sm text-yellow-500">★ {p.notaMedia.toFixed(1)}</span>}
                </div>
                <p className="text-sm text-gray-500">
                  {p.percentualDisponivel}% dos itens disponíveis · Total estimado: R$ {p.totalEstimado.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">
                  {p.retiradaLocal && "Retirada no local"} {p.entregaDomicilio && "· Entrega a domicílio"}
                </p>
              </li>
            ))}
          </ul>

          {ordenadas.length > 0 && (
            <div className="mb-8 overflow-x-auto">
              <h3 className="mb-2 font-semibold">Comparador de preços</h3>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border-b p-2 text-left">Item</th>
                    {ordenadas.map((p) => (
                      <th key={p.papelariaId} className="border-b p-2 text-left">
                        {p.nome}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ordenadas[0]?.itens.map((_, idx) => (
                    <tr key={idx}>
                      <td className="border-b p-2">{ordenadas[0].itens[idx].nomeItem}</td>
                      {ordenadas.map((p) => (
                        <td key={p.papelariaId} className="border-b p-2">
                          {p.itens[idx]?.disponivel
                            ? `R$ ${p.itens[idx].precoUnitario!.toFixed(2)}`
                            : "indisponível"}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="p-2">Total</td>
                    {ordenadas.map((p) => (
                      <td key={p.papelariaId} className="p-2">
                        R$ {p.totalEstimado.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {papelaria && !resultadoOrcamento && (
            <form onSubmit={handleSubmitOrcamento} className="rounded-md border border-gray-200 p-4">
              <h3 className="mb-3 font-semibold">Solicitar orçamento — {papelaria.nome}</h3>
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-1 text-sm font-medium">
                  Seu nome
                  <input name="responsavelNome" required className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium">
                  Seu WhatsApp (com DDI+DDD)
                  <input name="responsavelTelefone" required placeholder="5511999999999" className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium">
                  Nome do aluno(a)
                  <input name="nomeAluno" className="rounded-md border border-gray-300 px-3 py-2 text-base font-normal" />
                </label>
                <p className="text-xs text-gray-400">
                  {escolaNome} — {turmaNome}
                </p>
                <button
                  type="submit"
                  disabled={enviando}
                  className="self-start rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {enviando ? "Enviando..." : "Solicitar Orçamento"}
                </button>
              </div>
            </form>
          )}

          {resultadoOrcamento && (
            <div className="rounded-md border border-green-300 bg-green-50 p-4">
              <h3 className="mb-2 font-semibold">Orçamento solicitado!</h3>
              <pre className="mb-3 whitespace-pre-wrap text-sm">{resultadoOrcamento.mensagem}</pre>
              <div className="flex flex-wrap gap-2">
                <a
                  href={resultadoOrcamento.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
                >
                  Enviar via WhatsApp
                </a>
                <a
                  href={`/orcamento/${resultadoOrcamento.orcamentoId}`}
                  className="inline-block rounded-md border border-gray-300 px-4 py-2 font-medium hover:bg-white"
                >
                  Acompanhar status
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
