import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exigirSessao } from "@/lib/session";

export async function GET() {
  let sessao;
  try {
    sessao = await exigirSessao("papelaria");
  } catch {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const orcamentos = await prisma.orcamento.findMany({
    where: { papelariaId: sessao.sub },
    include: { itens: { include: { itemLista: true, produto: true } }, lista: { include: { turma: true } } },
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(orcamentos);
}
