import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ListaPublicaClient from "./ListaPublicaClient";
import PapelariaOficialBanner from "./PapelariaOficialBanner";
import OutrasOpcoes from "./OutrasOpcoes";
import { encontrarMelhorProduto } from "@/lib/matching";

export default async function ListaPublicaPage({ params }: { params: Promise<{ linkUnico: string }> }) {
  const { linkUnico } = await params;

  const lista = await prisma.lista.findUnique({
    where: { linkUnico },
    include: {
      itens: true,
      turma: { include: { escola: true } },
      papelariaOficial: { include: { produtos: true } },
    },
  });

  if (!lista) notFound();

  const oficial = lista.papelariaOficial;
  let bannerOficial = null;

  if (oficial) {
    const itensComMatch = lista.itens.map((item) => {
      const produto = encontrarMelhorProduto(item.nome, oficial.produtos);
      return {
        itemListaId: item.id,
        nomeItem: item.nome,
        quantidade: item.quantidade,
        produtoId: produto?.id ?? null,
        precoUnitario: produto?.preco ?? null,
        disponivel: Boolean(produto),
      };
    });
    const disponiveis = itensComMatch.filter((i) => i.disponivel).length;
    const percentualDisponivel = itensComMatch.length > 0 ? Math.round((disponiveis / itensComMatch.length) * 100) : 0;
    const totalEstimado = itensComMatch.reduce((soma, i) => soma + (i.precoUnitario ?? 0) * i.quantidade, 0);

    bannerOficial = (
      <PapelariaOficialBanner
        listaId={lista.id}
        papelariaId={oficial.id}
        nome={oficial.nomeFantasia}
        percentualDisponivel={percentualDisponivel}
        totalEstimado={totalEstimado}
        itens={itensComMatch}
      />
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="page-header">
        <p className="text-sm text-violet-100">{lista.turma.escola.nome}</p>
        <h1 className="text-2xl font-bold">🎒 {lista.turma.nome}</h1>
        <p className="text-sm text-violet-100">Lista de material escolar {lista.ano}</p>
      </header>

      <section className="mb-8 card p-4">
        <h2 className="mb-3 text-lg font-semibold">Itens da lista</h2>
        <ul className="flex flex-col gap-2">
          {lista.itens.map((item) => (
            <li key={item.id} className="text-sm">
              <span className="font-medium">
                {item.quantidade}x {item.nome}
              </span>{" "}
              {!item.obrigatorio && <span className="text-xs text-gray-400">(opcional)</span>}
              {item.especificacao && <span className="text-gray-500"> — {item.especificacao}</span>}
              {item.observacao && <p className="text-xs text-gray-400">Obs: {item.observacao}</p>}
            </li>
          ))}
        </ul>
      </section>

      {bannerOficial && <div className="mb-8">{bannerOficial}</div>}

      {bannerOficial ? (
        <OutrasOpcoes>
          <ListaPublicaClient
            listaId={lista.id}
            escolaNome={lista.turma.escola.nome}
            turmaNome={lista.turma.nome}
          />
        </OutrasOpcoes>
      ) : (
        <ListaPublicaClient
          listaId={lista.id}
          escolaNome={lista.turma.escola.nome}
          turmaNome={lista.turma.nome}
        />
      )}
    </main>
  );
}
