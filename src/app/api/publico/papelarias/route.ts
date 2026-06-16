import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encontrarMelhorProduto } from "@/lib/matching";

function distanciaEstimadaPorCep(cepA: string, cepB: string) {
  const a = parseInt(cepA.replace(/\D/g, "").slice(0, 5) || "0", 10);
  const b = parseInt(cepB.replace(/\D/g, "").slice(0, 5) || "0", 10);
  return Math.abs(a - b);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const listaId = searchParams.get("listaId");
  const cep = searchParams.get("cep") ?? "";

  if (!listaId) {
    return NextResponse.json({ erro: "listaId é obrigatório" }, { status: 400 });
  }

  const lista = await prisma.lista.findUnique({ where: { id: listaId }, include: { itens: true } });
  if (!lista) return NextResponse.json({ erro: "Lista não encontrada" }, { status: 404 });

  const papelarias = await prisma.papelaria.findMany({
    include: { produtos: true, avaliacoes: true },
  });

  const resultado = papelarias.map((papelaria) => {
    const itensComMatch = lista.itens.map((item) => {
      const produto = encontrarMelhorProduto(item.nome, papelaria.produtos);
      return {
        itemListaId: item.id,
        nomeItem: item.nome,
        quantidade: item.quantidade,
        produtoId: produto?.id ?? null,
        nomeProduto: produto?.nome ?? null,
        precoUnitario: produto?.preco ?? null,
        disponivel: Boolean(produto),
      };
    });

    const totalItens = itensComMatch.length;
    const disponiveis = itensComMatch.filter((i) => i.disponivel).length;
    const percentualDisponivel = totalItens > 0 ? Math.round((disponiveis / totalItens) * 100) : 0;
    const totalEstimado = itensComMatch.reduce(
      (soma, i) => soma + (i.precoUnitario ?? 0) * i.quantidade,
      0
    );
    const notaMedia =
      papelaria.avaliacoes.length > 0
        ? papelaria.avaliacoes.reduce((s, a) => s + a.nota, 0) / papelaria.avaliacoes.length
        : null;

    return {
      papelariaId: papelaria.id,
      nome: papelaria.nomeFantasia,
      cep: papelaria.cep,
      distanciaEstimada: cep ? distanciaEstimadaPorCep(cep, papelaria.cep) : null,
      whatsapp: papelaria.whatsapp,
      entregaDomicilio: papelaria.entregaDomicilio,
      retiradaLocal: papelaria.retiradaLocal,
      percentualDisponivel,
      totalEstimado,
      notaMedia,
      itens: itensComMatch,
    };
  });

  resultado.sort((a, b) => {
    if (cep && a.distanciaEstimada !== null && b.distanciaEstimada !== null) {
      return a.distanciaEstimada - b.distanciaEstimada;
    }
    return b.percentualDisponivel - a.percentualDisponivel;
  });

  return NextResponse.json(resultado);
}
